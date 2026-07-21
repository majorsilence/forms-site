---
title: "Platform backends: Avalonia, Uno, and Headless"
date: 2026-07-21 11:00:00 -0000
read_time: "5 min read"
excerpt: "Majorsilence.Forms draws every control itself with SkiaSharp — the windowing toolkit underneath is just a host. Here's how the seam works."
---

Majorsilence.Forms does **all of its own drawing** with SkiaSharp. Every control paints into an
`SKSurface`/`SKCanvas`; the windowing toolkit underneath is only a *host* — it creates native
windows, runs the message loop, delivers input, and presents the Skia surface to the screen. That
separation is what lets the exact same control set run on three very different toolkits today.

## The seam

Two interfaces define everything a host must provide:

`IPlatformBackend` covers application-level services — the dispatcher (`Post`/`Invoke`), timers,
clipboard, screen enumeration, and the modal loop. `IWindowBackend` covers a single native window —
size and position, show/hide/close, cursor, decorations, file dialogs. Input and paint requests flow
the *other* direction: the backend calls the window's neutral `RenderFrame(SKCanvas, …)` and
`Handle*` methods directly. No platform type — no Avalonia type, no WinUI type — ever crosses into
core Majorsilence.Forms code.

## Three backends today

**`Majorsilence.Forms.Avalonia`** is the default — Avalonia 12, giving Windows, macOS, and Linux
desktop with zero configuration. Reference it and `Application.Run(new MyForm())` just works. It's
not limited to desktop, either: Avalonia ships its own Android, iOS, and Browser (WASM) targets, so
this same backend is a second path to mobile and web, alongside the dedicated Uno backend below.

**`Majorsilence.Forms.Headless`** is the simplest possible backend and doubles as the reference
template for writing a new one: a work-queue message loop, an in-memory clipboard, a virtual
screen, and offscreen rendering. It needs no display, so it's what the unit test suite runs on, and
it can render the ControlGallery sample straight to a PNG for CI pixel-diffing:

```
dotnet run --project samples/ControlGallery -- --render-headless out.png 1100 750 --select-row 0
```

**`Majorsilence.Forms.Uno`** targets Uno Platform's Skia renderer, hosting a `SKXamlCanvas` and
reaching desktop, iOS, Android, and WebAssembly. It's been verified end-to-end on macOS: the Uno
host launches, the backend creates the window, and the ControlGallery's full `MainForm` renders into
the canvas. Because it needs an interactive session, it runs through a dedicated app head —
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — rather than the
headless CI build.

One detail worth calling out: Uno has no programmatic "begin a window drag" API, so move/resize for
Majorsilence.Forms' self-drawn window chrome is handled declaratively instead — a borderless
presenter keeps the OS resize margins for free, and title-bar drag rides WinUI's caption-region
API on the Windows desktop head. On macOS, native decorations own drag/resize instead.

## Adding your own

A new backend is just another assembly: reference core `Majorsilence.Forms` plus your toolkit,
implement `IPlatformBackend` and `IWindowBackend`, and mirror the Avalonia/Headless/Uno trio — drive
the dispatcher in the platform backend, and present a Skia surface plus translate input in the
window backend. See [Platform backends]({{ '/backends/' | relative_url }}) for the full interface
listing.
