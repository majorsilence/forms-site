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
| `Majorsilence.Forms.Avalonia` | Avalonia 12 | Default desktop backend — Windows, macOS, Linux. |
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

## Adding another backend

A new backend is a new assembly referencing `Majorsilence.Forms` (core) plus the target toolkit,
implementing `IPlatformBackend` and `IWindowBackend` — mirror the Avalonia/Headless/Uno trio: drive
the dispatcher and lifecycle in `IPlatformBackend`, and present a Skia surface plus translate input
in `IWindowBackend`.

See [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) in the repository for
the full interface listing.
