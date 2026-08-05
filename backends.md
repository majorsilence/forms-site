---
layout: docs
title: Platform backends
subtitle: One rendering core, three swappable hosts.
---

Majorsilence.Forms does **all of its own drawing** with SkiaSharp. Every control paints into an
`SKSurface`/`SKCanvas`; the windowing toolkit underneath is only a *host* — it creates native
windows, runs the message loop, delivers input, and presents the Skia surface to the screen.

That host is abstracted behind a small seam so Majorsilence.Forms can run on more than one toolkit:

| Assembly | Backend | Notes |
|---|---|---|
| `Majorsilence.Forms.Avalonia` | Avalonia 12 | Default desktop backend — Windows, macOS, Linux. Avalonia also ships its own Android, iOS, and Browser (WASM) targets, making this backend a second path to mobile and web alongside Uno. |
| `Majorsilence.Forms.Headless` | Dependency-free SkiaSharp | Offscreen rendering for tests/servers; the reference second backend. |
| `Majorsilence.Forms.Uno` | Uno Platform / Skia | Desktop, iOS, Android, WebAssembly. Presents via `SKXamlCanvas` through a Uno app head. |

The **core `Majorsilence.Forms` assembly references no windowing toolkit** — only SkiaSharp.
Backends are separate assemblies that depend on the core and reach into its internal render/input
plumbing.

## The seam

Two interfaces define everything a host must provide:

- **`IPlatformBackend`** — application + process services: the dispatcher, timers, clipboard,
  screens, and the modal loop.
- **`IWindowBackend`** — one native window: location/size, show/hide/close, cursor, decorations,
  file dialogs, and — pushed the other way — paint requests and input delivered straight to the
  window's neutral `Render`/`Handle*` methods.

All coordinates crossing the seam are `System.Drawing` value types and Majorsilence.Forms enums —
no toolkit type ever leaks into the core.

### Selecting a backend

A desktop app just references `Majorsilence.Forms.Avalonia` and calls `Application.Run(new MyForm())`
with zero configuration. To use a different backend, set it before the first window is created:

```csharp
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();
```

## Embedding in a host app

Everything above assumes Majorsilence.Forms owns the top-level window and the backend is just the
rendering host underneath. The Avalonia and Uno backends also support the *reverse* direction: an
existing Avalonia or Uno app that treats Majorsilence.Forms objects as if they were its own native
ones — additively, without changing anything about the usual `Form.Show()` flow.

**A Majorsilence control becomes a host control**, via `MajorsilenceFormsPresenter` (a real
`Avalonia.Controls.Canvas` / WinUI `Grid`) and its extension methods. Drop the result into any native
visual tree:

```csharp
// Avalonia
Avalonia.Controls.Control hostControl = myMfControl.ToAvaloniaControl ();

// Uno
Microsoft.UI.Xaml.FrameworkElement hostControl = myMfControl.ToUnoControl ();
```

**A Majorsilence `Form` becomes a host window.** A `Form`'s backend window is created eagerly in the
Form's own constructor, and on both backends that object already *is* (Avalonia) or *wraps* (Uno) a
real native window — so these hand it straight back:

```csharp
Avalonia.Controls.Window window = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window  window = myForm.ToUnoWindow ();
```

The host owns showing it from there. Majorsilence's own `Load`/`Shown`/`Application.OpenForms`
bookkeeping still runs correctly the first time the window becomes visible, whichever side triggered
it.

**Owner and modal relationships differ by backend.** A real `Avalonia.Controls.Window` supports
native `.Owner` and `.ShowDialog(owner)`, so `ToAvaloniaWindow()` gives a genuine OS-level modal
relationship. Uno has no such concept in this backend today, so `ToUnoWindow()` returns an
independent top-level window; use `Form.ShowDialog(parent)` — Majorsilence's own modal loop, which
doesn't depend on native window ownership — for modal behaviour under Uno.

Both directions are demonstrated by
[`samples/EmbeddingAvalonia`]({{ site.github_url }}/tree/main/samples/EmbeddingAvalonia) and
[`samples/EmbeddingUno`]({{ site.github_url }}/tree/main/samples/EmbeddingUno).

## The Avalonia backend

The default backend, and the one a new desktop app gets with zero configuration. It targets
Windows, macOS, and Linux desktop out of the box. Avalonia itself isn't desktop-only, though — it
ships its own Android, iOS, and Browser (WebAssembly) targets, so wiring `Majorsilence.Forms.Avalonia`
up to one of those is a second path to mobile and web, alongside the dedicated Uno backend below —
worth reaching for if your app (or team) is already invested in Avalonia's mobile/browser tooling.

### Running in the browser (WebAssembly)

There's no separate WASM package — `Majorsilence.Forms.Avalonia` multi-targets `net10.0-browser` as
an extra row alongside its desktop TFMs, built on Avalonia 12's own `Avalonia.Browser` platform
(WebGL2/Emscripten, same Skia renderer as desktop). A minimal browser head just references
`Majorsilence.Forms.Avalonia` + `Avalonia.Browser` from a `Microsoft.NET.Sdk.WebAssembly` project —
see [`samples/Gallery.Wasm`]({{ site.github_url }}/tree/main/samples/Gallery.Wasm), which runs the
full ControlGallery `MainForm` in-browser.

Building it needs the wasm-tools workload once, then a normal publish:

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm/Gallery.Wasm.csproj -c Release -o out
```

Serve `out/wwwroot` with any static file server and open `index.html` — `dotnet run` doesn't serve a
WebAssembly SDK project directly. There's no real filesystem in the browser, so assets an app reads
from disk (images, etc.) need `WasmFilesToIncludeInFileSystem` in the csproj to preload them into the
in-memory filesystem, as the sample does for its image folder.

Startup is async and host-driven instead of the blocking desktop loop:

```csharp
await Majorsilence.Forms.Application.RunBrowserAsync(() => new MainForm());
```

This is a young, unverified-in-CI path — worth knowing before depending on it:

- **No native WebView.** The browser TFM excludes Avalonia's WebView entirely, so compat controls
  that need one (`RadPdfViewer`, `RadRichTextEditor`) fall back to their plain-viewer/`RichTextBox`
  paths — see [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md).
- **No real window chrome.** Every window renders onto a Canvas inside the page — title, topmost,
  system decorations, icon, resizability, and window-drag are all no-ops; `ShowDialog` shows the
  window but isn't OS-modal.
- **Popup dismissal on outside focus loss doesn't fire** the way it does on desktop, since a Canvas
  has no window-deactivation event to hook.
- Not part of the headless CI build, and no equivalent to the Uno backend's "verified on macOS" note
  exists yet for this path.

## The Headless backend

The simplest possible backend, and the reference implementation to copy when building a new one:
a work-queue message loop, an in-memory clipboard, a virtual screen, and offscreen rendering to an
`SKSurface`. It needs no display, so it powers the unit test suite and can render the
ControlGallery headlessly for CI and pixel-diff verification.

## The Uno backend

Implements the seam on Uno Platform's Skia target, hosting a `SKXamlCanvas` and translating Uno
pointer/key/character events into the neutral input path. It needs a Uno *app head* — see
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — and has been verified
launching and rendering a full `MainForm` on macOS.

Window drag/resize for Majorsilence.Forms' self-drawn chrome is handled declaratively rather than
imperatively on this backend: resize comes for free from a borderless presenter that keeps the OS
resize margins, and title-bar drag uses WinUI's caption-region API on the Windows desktop head.
On macOS the native decorations own drag/resize; on X11 title-bar drag is unavailable and
`UseSystemDecorations` is the fallback.

## Touch gestures

`Control` has five purely-additive events for touch and pen input: `LongPress`, `Pinch` (pinch-to-zoom
and two-finger rotate together), `Swipe`, and `ScrollGesture` — continuous drag-to-pan that keeps
firing with a decaying delta through the platform's own momentum phase after the contact lifts, which
is the entire flick-scrolling implementation. None of them fire for the mouse.

`ScrollableControl` already applies `ScrollGesture` to `AutoScrollPosition`, so existing
`Panel`/`ListBox`/`TreeView` subclasses gained touch panning with no app code changes, and
`LongPress`'s default handler opens `ContextMenu` if one is set — mirroring the existing right-click
behaviour.

Both the Avalonia and Uno backends implement this, and it works the same whether Majorsilence.Forms
owns the window or is embedded via `ToAvaloniaControl()`/`ToUnoControl()`. The two platforms' gesture
models are genuinely different underneath — Avalonia attaches dedicated recognizers that are
self-gated to touch/pen, while WinUI/Uno has one unified manipulation stream that isn't, reports
velocity in different units, and has no native swipe at all. The Uno backend therefore filters mouse
pointers itself, converts velocity, and synthesizes `Swipe` from manipulation velocity. The two
judgement calls that needs — is this frame a pinch or a pan, and was that flick fast enough to be a
swipe — live in `GestureHeuristics` in the core assembly and are unit-tested, since neither can be
verified without multi-touch hardware.

## Hosting native elements

`INativeControlHostBackend` is an optional backend capability (alongside `IWebViewFactory`),
implemented by Avalonia and Uno and absent on Headless. It lets a `NativeControlHost` control reserve
a rectangle that the backend fills with a real toolkit element — an Avalonia `Control`, an Uno
`UIElement` — overlaid on the Skia surface and kept aligned to the placeholder's bounds, clip, and
visibility.

See [Native interop]({{ '/native-interop/' | relative_url }}) for how to use it, its airspace limits,
why native handles can't be faked, and why video is usually better done with frame callbacks drawn
into Skia than with a hosted native surface.

## Adding another backend

A new backend is a new assembly referencing `Majorsilence.Forms` (core) plus the target toolkit,
implementing `IPlatformBackend` and `IWindowBackend` — mirror the Avalonia/Headless/Uno trio: drive
the dispatcher and lifecycle in `IPlatformBackend`, and present a Skia surface plus translate input
in `IWindowBackend`.

See [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) in the repository for
the full interface listing.
