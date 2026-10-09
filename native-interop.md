---
layout: docs
title: Native interop
subtitle: Hosted native content, video, and why there is no HWND behind a Button.
seo_title: "Native Interop — Why Control.Handle Isn't an HWND"
description: >-
  Host native content — video, maps, browser engines — inside a cross-platform WinForms control
  on Avalonia, Uno, WinForms, WPF or GTK 4, and why Control.Handle is IntPtr.Zero here.
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

Majorsilence.Forms does all of its own drawing into a single Skia surface. Every backend follows the
same model as the toolkit underneath it: **one host window per top-level window — a real OS window on
the desktop backends — and everything inside it is drawn, not composed from native child windows.**
A `Button` is paint operations on a canvas. There is no `HWND` behind it because there is no OS
object behind it.

| Member | Value | Why |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | No per-control OS window exists to report. Reading it still has upstream's side effect — it creates the control's handle state, so `IsHandleCreated` becomes true and `HandleCreated` fires, which is what `_ = control.Handle;` is written for. Same value for `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle`. |
| `WindowBase.Handle` | An opaque nonzero token | **Not an `HWND`.** WinForms code routinely reads `.Handle` to force handle creation before `Invoke`, and returning zero breaks that idiom. Meaningful only inside managed code. |
| `WindowBase.PlatformHandle` | The real native handle, or `IntPtr.Zero` | The genuine article, via `IWindowBackend.TryGetPlatformHandle()`. Implemented by the Avalonia backend — `HWND` on Windows, `NSWindow` on macOS, `XID` on X11 — and by the Windows-only WinForms backend, which returns its form's `HWND`. Currently zero on Uno and Headless. |

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
top of the Skia surface and keeps it aligned to the placeholder's bounds. On most backends this is
the "airspace" interop model — native elements can't be composited into the Skia buffer, so they're
positioned over it. GTK 4 is the exception, covered below.

```csharp
var host = new NativeControlHost { Dock = DockStyle.Fill };
host.NativeControl = someAvaloniaControl;   // or an Uno UIElement, a WinForms Control, a Gtk.Widget…
panel.Controls.Add (host);
```

The host tracks bounds, the intersected clip region of every scrolling ancestor, and effective
visibility along the whole parent chain, forwarding all three to the backend. Re-sync happens
automatically on paint and on visibility changes; call `SyncNativeControl()` yourself if you move or
resize the host outside the normal paint cycle.

`INativeControlHostBackend` is an optional backend capability (see
[Backends]({{ '/backends/' | relative_url }})). Which backends implement it, and what they expect:

| Backend | Expected type of `NativeControl` | Behaviour |
|---|---|---|
| Avalonia (window host, single-view host, presenter) | `Avalonia.Controls.Control` | Added to an overlay `Canvas` above the Skia surface. |
| Uno (window host, presenter) | `Microsoft.UI.Xaml.UIElement` | Added to the root `Canvas`/panel above the `SKXamlCanvas`. |
| WinForms / WPF (window host, presenter) | `System.Windows.Forms.Control` / `System.Windows.FrameworkElement` | Added to an overlay layer above the Skia control. |
| GTK 4 (window host, presenter) | `Gtk.Widget` | Added as a `Gtk.Overlay` child above the `Gtk.DrawingArea`. **No airspace problem** — GTK composites every widget into one render tree, so the hosted widget clips and blends like any other. |
| Headless, Terminal | — | Don't implement the capability; the host renders as an empty placeholder. |

> **Assigning the wrong type fails silently.** Each backend type-checks `NativeControl` and simply
> returns if it doesn't match. Nothing throws, nothing logs, nothing appears on screen. If your native
> content is invisible, check the type first — an Avalonia `Control` given to the Uno backend, or
> vice versa, produces exactly this.

### Airspace limitations

These apply to any hosted native element on the Avalonia, Uno, WinForms and WPF backends, and are
inherent to the model rather than bugs to be fixed:

- The native element draws **above** the entire Majorsilence.Forms scene. It can't be z-ordered
  between Majorsilence controls, and anything that visually overlaps it — a dropdown, a tooltip, a
  context menu — is painted underneath it.
- Clipping is rectangular only. Rotation, non-rectangular clips, and opacity from the Majorsilence
  side don't apply to it.
- Scrolling works but isn't free: the overlay is repositioned per sync, so it can visibly lag the
  Skia content during a fast scroll. Keep hosted elements in non-scrolling areas where you can.

**GTK 4 is the exception.** The Skia surface sits inside a `Gtk.Overlay` and the hosted widget is an
overlay child, but GTK 4 composites every widget into one render tree — so the hosted widget is
z-ordered, clipped and blended like any other, and none of the caveats above apply. The one
compromise: a host scrolled partly out of a viewport *reflows* its native widget into the visible
box rather than translating it under a clip, so a half-scrolled widget re-lays-out to the smaller
rectangle instead of being cut off.

## Route A — hosting real native content

Use this when you need something that genuinely must be an OS window: a GPU-accelerated video
surface, a native map or CAD view, a browser engine.

The point is that you're **not faking a handle — you're creating a real one** and giving the native
library that. `NativeControl` takes a toolkit object rather than a handle, so there's a wrapper step
in between. `AvaloniaWebViewHandle` (in `Majorsilence.Forms.Avalonia`) and `Gtk4WebViewHandle` (in
`Majorsilence.Forms.Gtk4`) are the worked examples already in the tree: they wrap
`Avalonia.Controls.NativeWebView` / `WebKit.WebView` and expose them as `IWebViewHandle.NativeControl`.

**GTK 4 is the easy case.** `WebKit.WebView` is just a `Gtk.Widget`; the backend adds it to the
`Gtk.Overlay` above the Skia surface and GTK composites it into the same render tree — no handle to
create, no airspace, no platform-reach caveat. The full `IWebViewHandle` (navigation events, JS
eval, the script-message bridge) is implemented against WebKitGTK 6.0 through `IWebViewFactory`,
which is what `WebBrowser` and the webview-backed compat controls use on that backend.

**Avalonia.** Subclass `Avalonia.Controls.NativeControlHost` and override
`CreateNativeControlCore (IPlatformHandle parent)`, which returns a real `IPlatformHandle` — an
`HWND` on Windows, an `XID` on X11, an `NSView` on macOS. Create your child window there, hand its
handle to the player, release it in `DestroyNativeControlCore`, and assign the resulting Avalonia
control to `NativeControlHost.NativeControl`.

**Uno.** `Uno.UI.NativeElementHosting` exposes `Win32NativeWindow(IntPtr Hwnd)` and
`X11NativeWindow(IntPtr WindowId)` — public wrappers around a handle you created — plus
`BrowserHtmlElement` for WASM. Set one as the `Content` of a `ContentPresenter` and give that to
`NativeControl`.

**Platform reach: realistically Windows and X11** for the handle-based paths. Wayland needs
subsurfaces, macOS gives you an `NSView` rather than anything `HWND`-shaped, and WASM/Android/iOS
give you no usable window handle at all. A feature built this way won't run everywhere the rest of
the framework does. The GTK 4 widget path has no such limit — it runs wherever GTK 4 does, Wayland
included.

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
| Composites with Majorsilence content | No — draws on top (GTK 4: yes) | Yes |
| Backends | Avalonia, Uno, WinForms, WPF, GTK 4 | All, including Headless and Terminal |
| Platforms | Windows, X11 realistically (GTK 4: also Wayland) | Everywhere |
| GPU decode path | Yes | No (software decode + copy) |
| Testable in CI | No | Yes |
| Needs a real OS handle | Yes (create one — never fake); GTK 4: no, a `Gtk.Widget` | No |

Default to **B** for video. Reach for **A** when you need a browser engine, hardware decode, or a
third-party native view that only knows how to draw into a window.

## Known gaps

- **Uno doesn't implement `TryGetPlatformHandle`**, so `WindowBase.PlatformHandle` is
  `IntPtr.Zero` there even though the public Uno wrappers (`Win32NativeWindow.Hwnd`,
  `X11NativeWindow.WindowId`) would close it. This also means platform accessibility bridges can't
  attach on Uno.
- **No media or video control ships in the framework.** Both routes above are integration guidance,
  not a `VideoView` you can instantiate.
- **Route A's Uno path is documented from the public API surface, not from a running app.** The
  Avalonia path is exercised in the tree by `AvaloniaWebViewHandle`, and the GTK 4 path by
  `Gtk4WebViewHandle` (verified on Wayland against WebKitGTK 6.0); the Uno equivalent is not.

Full detail lives in
[`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) in the repository.
