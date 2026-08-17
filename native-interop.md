---
layout: docs
title: Native interop
subtitle: Hosted native content, video, and why there is no HWND behind a Button.
seo_title: "Native Interop — Why Control.Handle Isn't an HWND"
description: >-
  Host native content — video, maps, browser engines — inside a cross-platform WinForms control,
  and why Control.Handle is IntPtr.Zero here.
keywords:
  - winforms control handle hwnd
  - host native control winforms cross platform
  - winforms video playback cross platform
  - nativecontrolhost skiasharp
priority: "0.7"
---

Two questions turn out to be the same question:

- *"How do I put a native thing — a video surface, a map view, a browser engine — inside a
  Majorsilence.Forms control?"*
- *"How do I get an `HWND` for a control, to hand to a library that wants one?"*

The short answer to the second is **you can't, and you shouldn't fake one**. You rarely need to,
because the first has a real answer: [`NativeControlHost`](#the-seam-nativecontrolhost).

Hosting a Majorsilence.Forms window inside a real WinForms app is the opposite direction, and covered
by [`winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md).

## Why handles aren't real here

Majorsilence.Forms does all of its own drawing into a single Skia surface. Both real backends follow
the same model as the toolkits underneath them: **one native OS window per top-level window, and
everything inside it is drawn, not composed from native child windows.** A `Button` is paint
operations on a canvas. There is no `HWND` behind it because there is no OS object behind it.

| Member | Value | Why |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | No per-control OS window exists to report. Same for `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle`. |
| `WindowBase.Handle` | An opaque nonzero token | **Not an `HWND`.** WinForms code routinely reads `.Handle` to force handle creation before `Invoke`, and returning zero breaks that idiom. Meaningful only inside managed code. |
| `WindowBase.PlatformHandle` | The real native handle, or `IntPtr.Zero` | The genuine article, via `IWindowBackend.TryGetPlatformHandle()`. Implemented by the Avalonia backend — `HWND` on Windows, `NSWindow` on macOS, `XID` on X11. Currently zero on Uno and Headless. |

### The rule about faking

A fabricated handle is safe **only while it round-trips through managed code you control** — which is
exactly what `WindowBase.Handle` does, and all it is for. It stops being safe the moment it crosses
into native code.

Native libraries don't merely store the handle you give them. LibVLC's
`libvlc_media_player_set_hwnd`, mpv's `--wid`, and GStreamer's `GstVideoOverlay.set_window_handle` all
pass it on to the OS — `SetParent`, `CreateWindowEx`, `GetClientRect`, `SetWindowPos`,
`XReparentWindow`. Handing those a made-up number gets you one of two outcomes, and the second is
worse:

1. The call fails, and you get a black rectangle or a crash inside the native library.
2. The call *succeeds against a window that belongs to something else.* `HWND`s are handle-table
   indices, not pointers, and small integers are live values. A hash code is precisely the shape of
   number that collides with a real window.

So: never synthesize a handle for anything that will reach the OS. Use one of the two routes below.

## The seam: `NativeControlHost`

`Majorsilence.Forms.NativeControlHost` is a `Control` that **reserves a rectangle** for a native
element of the underlying toolkit. It paints nothing itself; the backend overlays the real element on
top of the Skia surface and keeps it aligned to the placeholder's bounds. This is the "airspace"
interop model — native elements can't be composited into the Skia buffer, so they're positioned over
it.

```csharp
var host = new NativeControlHost { Dock = DockStyle.Fill };
host.NativeControl = someAvaloniaControl;   // or an Uno UIElement
panel.Controls.Add (host);
```

The host tracks bounds, the intersected clip region of every scrolling ancestor, and effective
visibility along the whole parent chain, forwarding all three to the backend. Re-sync happens
automatically on paint and on visibility changes; call `SyncNativeControl()` yourself if you move or
resize the host outside the normal paint cycle.

| Backend | Expected type of `NativeControl` | Behaviour |
|---|---|---|
| Avalonia | `Avalonia.Controls.Control` | Added to an overlay `Canvas` above the Skia surface. |
| Uno | `Microsoft.UI.Xaml.UIElement` | Added to the root `Canvas`/panel above the `SKXamlCanvas`. |
| Headless | — | Doesn't implement the capability; the host renders as an empty placeholder. |

> **Assigning the wrong type fails silently.** Both backends type-check `NativeControl` and simply
> return if it doesn't match. Nothing throws, nothing logs, nothing appears on screen. If your native
> content is invisible, check the type first — an Avalonia `Control` given to the Uno backend, or
> vice versa, produces exactly this.

### Airspace limitations

These apply to any hosted native element on either backend, and are inherent to the model rather than
bugs to be fixed:

- The native element draws **above** the entire Majorsilence.Forms scene. It can't be z-ordered
  between Majorsilence controls, and anything that visually overlaps it — a dropdown, a tooltip, a
  context menu — is painted underneath it.
- Clipping is rectangular only. Rotation, non-rectangular clips, and opacity from the Majorsilence
  side don't apply to it.
- Scrolling works but isn't free: the overlay is repositioned per sync, so it can visibly lag the
  Skia content during a fast scroll. Keep hosted elements in non-scrolling areas where you can.

## Route A — hosting real native content

Use this when you need something that genuinely must be an OS window: a GPU-accelerated video
surface, a native map or CAD view, a browser engine.

The point is that you're **not faking a handle — you're creating a real one** and giving the native
library that. `NativeControl` takes a toolkit object rather than a handle, so there's a wrapper step
in between. `AvaloniaWebViewHandle` is the worked example already in the tree.

**Avalonia.** Subclass `Avalonia.Controls.NativeControlHost` and override
`CreateNativeControlCore (IPlatformHandle parent)`, which returns a real `IPlatformHandle` — an
`HWND` on Windows, an `XID` on X11, an `NSView` on macOS. Create your child window there, hand its
handle to the player, release it in `DestroyNativeControlCore`, and assign the resulting Avalonia
control to `NativeControlHost.NativeControl`.

**Uno.** `Uno.UI.NativeElementHosting` exposes `Win32NativeWindow(IntPtr Hwnd)` and
`X11NativeWindow(IntPtr WindowId)` — public wrappers around a handle you created — plus
`BrowserHtmlElement` for WASM. Set one as the `Content` of a `ContentPresenter` and give that to
`NativeControl`.

**Platform reach: realistically Windows and X11.** Wayland needs subsurfaces, macOS gives you an
`NSView` rather than anything `HWND`-shaped, and WASM/Android/iOS give you no usable window handle at
all. A feature built this way won't run everywhere the rest of the framework does.

## Route B — video without a handle (recommended)

Most video libraries can hand you **decoded frames** instead of taking a window, which removes the
handle from the problem entirely: LibVLC's `libvlc_video_set_callbacks` (`vmem`), mpv's render API in
software mode, a GStreamer `appsink`, or FFmpeg, where you already own the frames.

You receive a pixel buffer, copy it into an `SKBitmap`, and draw it in `OnPaint` like any other
control:

```csharp
public class VideoView : Control
{
    private SKBitmap? frame;

    // Called from the decoder's own callback thread with a freshly decoded BGRA frame.
    // Ask the library for a pitch of width * 4 when you set the output format, so the
    // incoming buffer is tightly packed and matches SKBitmap's row layout.
    public void PresentFrame (ReadOnlySpan<byte> bgra, int width, int height)
    {
        if (frame is null || frame.Width != width || frame.Height != height) {
            frame?.Dispose ();
            frame = new SKBitmap (width, height, SKColorType.Bgra8888, SKAlphaType.Premul);
        }

        // One bulk copy, not per-pixel: SKBitmap.SetPixel is a P/Invoke per call, which for a
        // megapixel frame costs seconds rather than milliseconds.
        bgra.CopyTo (frame.GetPixelSpan ());
        frame.NotifyPixelsChanged ();

        // Invalidate() does NOT marshal -- it walks to the window and marks it dirty on whatever
        // thread you call it from. Hop to the UI thread explicitly.
        BeginInvoke (Invalidate);
    }

    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);
        if (frame is not null)
            e.Canvas.DrawBitmap (frame, new SKRect (0, 0, Width, Height));
    }
}
```

This sketch uses one bitmap, so a paint can read it while the decoder writes the next frame — visible
as tearing under load, not as a crash. Swapping between two bitmaps (write to the back one, publish
with a single reference assignment) is the usual fix, and worth doing for anything beyond a demo.

**Why this is the better default.** The frame becomes part of the Skia scene, so z-order, clipping,
scrolling, opacity, and transforms all behave as they do for every other control — none of the
airspace caveats apply. It works on every backend, including Headless and WASM, which also makes it
testable: you can assert on rendered pixels. The cost is a per-frame CPU copy and software decode.

## Choosing

| | Route A (native host) | Route B (frame callbacks) |
|---|---|---|
| Composites with Majorsilence content | No — draws on top | Yes |
| Backends | Avalonia, Uno | All, including Headless |
| Platforms | Windows, X11 realistically | Everywhere |
| GPU decode path | Yes | No (software decode + copy) |
| Testable in CI | No | Yes |
| Needs a real OS handle | Yes (create one — never fake) | No |

Default to **B** for video. Reach for **A** when you need a browser engine, hardware decode, or a
third-party native view that only knows how to draw into a window.

## Known gaps

- **Uno doesn't implement `TryGetPlatformHandle`**, so `WindowBase.PlatformHandle` is
  `IntPtr.Zero` there even though the public Uno wrappers would close it. This also means platform
  accessibility bridges can't attach on Uno.
- **No media or video control ships in the framework.** Both routes above are integration guidance,
  not a `VideoView` you can instantiate.
- **Route A's Uno path is documented from the public API surface, not from a running app.** The
  Avalonia path is exercised in the tree; the Uno equivalent is not.

Full detail lives in
[`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) in the repository.
