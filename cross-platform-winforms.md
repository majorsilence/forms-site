---
layout: docs
title: Cross-platform WinForms
subtitle: What it means to run Windows Forms code on macOS and Linux, what it costs, and how Majorsilence.Forms does it.
permalink: /cross-platform-winforms/
seo_title: "Cross-Platform WinForms — Run Windows Forms on macOS & Linux"
description: >-
  How a WinForms compatibility layer lets existing Windows Forms apps run on macOS and Linux — the
  architecture, what it replaces, and what it costs.
keywords:
  - cross platform winforms
  - winforms compatibility library
  - winforms compat layer
  - winforms cross platform
  - windows forms on linux
  - windows forms on mac
  - winforms alternative
  - system.windows.forms cross platform
  - .net cross platform gui
priority: "0.9"
changefreq: weekly
---

**Windows Forms is Windows-only, and always has been.** `System.Windows.Forms` is a managed wrapper
over Win32 window classes and GDI+ — `HWND`s, `WM_PAINT`, `user32.dll`. .NET itself runs everywhere,
but that assembly ships only in the Windows Desktop runtime, so a WinForms app cannot be built or
launched on macOS or Linux at all. That is the whole problem, and it is why "make our WinForms app
cross-platform" has historically meant "rewrite it".

Majorsilence.Forms takes the other route: **reimplement the WinForms programming model on a
cross-platform renderer.** Same class names, same properties, same events, same designer-generated
code — but nothing underneath is Win32.

```csharp
using Majorsilence.Forms;   // instead of System.Windows.Forms

public class MainForm : Form
{
    public MainForm ()
    {
        var button = new Button { Text = "Click me", Location = new Point (12, 12) };
        button.Click += (s, e) => MessageBox.Show ("Hello from Linux.");
        Controls.Add (button);
    }
}
```

That file compiles and runs on Windows, macOS and Linux from a single `net10.0` build. There is no
`-windows` TFM, no Windows Desktop runtime, and no Wine.

## How a WinForms compatibility layer actually works

Three approaches exist for getting WinForms code onto another platform, and they behave very
differently:

| Approach | What it is | Trade-off |
|---|---|---|
| **Emulation** (Wine, Mono's old `System.Windows.Forms`) | Reimplement Win32/GDI+ underneath the *unmodified* WinForms assembly | Zero source changes, but you inherit an enormous Win32 surface, non-native behaviour, and a support story that ends the moment your app touches something unimplemented |
| **Rewrite** (WPF, .NET MAUI, Avalonia, the web) | Re-express the UI in a different paradigm | A genuinely modern result, at the cost of rebuilding every screen and retraining the team |
| **API-compatible reimplementation** (Majorsilence.Forms) | Rebuild the WinForms *API* on a portable renderer | Source-level compatibility with a mechanical namespace change; you give up Win32 escape hatches like `Control.Handle` and `WndProc` |

Majorsilence.Forms is the third. Every control is drawn by the framework itself with
[SkiaSharp](https://github.com/mono/SkiaSharp) — the same GPU-accelerated 2D engine behind Chrome
and Flutter — so a `Button` looks and behaves identically on all three desktops because it is
literally the same paint code on all three.

## The architecture in one diagram

<div class="msf-diagram">        Your app  (Forms, controls, Designer files — the WinForms model you know)
            │
       Majorsilence.Forms  (controls + WinForms-compatible API, drawn with SkiaSharp)
            │
   Swappable host backend
   ├─ Avalonia   → Windows · macOS · Linux  (default)  · also Android · iOS · Browser
   ├─ Uno         → desktop · iOS · Android · WebAssembly
   └─ Headless    → offscreen rendering for tests / CI</div>

The core `Majorsilence.Forms` assembly references **no windowing toolkit** — only SkiaSharp. A
backend's entire job is to create a native window, run a message loop, deliver input, and present a
Skia surface. That seam is why the same application binary can target Avalonia on the desktop today
and Uno or WebAssembly tomorrow. See [Platform backends]({{ '/backends/' | relative_url }}) for the
interfaces and how to add your own.

## What you get on each platform

| Platform | Status | Host |
|---|---|---|
| Windows | Supported, out of the box | Avalonia (default) or Uno |
| macOS (Intel and Apple Silicon) | Supported, out of the box — see [WinForms on macOS]({{ '/winforms-on-macos/' | relative_url }}) | Avalonia (default) or Uno |
| Linux (X11) | Supported, out of the box — see [WinForms on Linux]({{ '/winforms-on-linux/' | relative_url }}) | Avalonia (default) or Uno |
| WebAssembly / browser | Working, young — [try the live gallery]({{ '/gallery/' | relative_url }}) | Avalonia Browser or Uno Wasm |
| Android | Early, work in progress | Avalonia Android or Uno |
| iOS | Early, unverified | Avalonia iOS or Uno |
| Headless / CI | Supported | Headless backend, offscreen Skia |

## The Windows-only APIs a port has to replace

Making the controls portable is only half of it. A real WinForms application also leans on two
other Windows-only stacks, and both have a cross-platform answer here:

- **`System.Drawing.Common` (GDI+)** has been Windows-only since .NET 7.
  `Majorsilence.Forms.Drawing.Common` is a Skia-backed reimplementation of it — `Bitmap`, `Font`,
  `Pen`, `Brush`, `Icon`, `Region`, `StringFormat`, `Drawing2D`, `Imaging`, even EMF/WMF metafile
  playback. The value types (`Color`, `Point`, `Size`, `Rectangle`) are deliberately *not*
  reimplemented; the real, already-portable `System.Drawing.Primitives` types are used instead, so
  they interop with everything else in .NET.
- **Printing** goes through `Majorsilence.Forms.Printing.PrintDocument`, which renders pages with
  the same Skia pipeline and produces a PDF rather than talking to an OS print driver. That is a
  platform-agnostic substitute by design, not an unfinished per-OS gap.

## What it costs

Being honest about the trade is more useful than a feature list:

- **`Control.Handle` is `IntPtr.Zero`.** A control here is paint operations on a canvas, not an OS
  window, so there is no `HWND` to hand out and the framework refuses to invent one. Window-level
  handles *are* real (`HWND`/`NSWindow`/`XID`). See [Native interop]({{ '/native-interop/' | relative_url }}).
- **No `WndProc`, no Win32 P/Invoke against controls.** Message-based tricks have to be rewritten
  against real APIs.
- **Coverage is not 100%.** The project is beta. Unimplemented members deliberately no-op or return
  a sensible default instead of throwing, so migrated code compiles *and runs* — which also means a
  gap can be silent. The
  [compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) tracks what is
  real, what is approximated, and what is out of scope, control by control.
- **Pixel-identical rendering with native WinForms is a non-goal.** Controls are themed and drawn by
  Skia; they look consistent across platforms rather than matching each OS's native widgets.

## Where to go next

- **[Getting started]({{ '/getting-started/' | relative_url }})** — a running app in a few minutes.
- **[Migrate an existing WinForms app]({{ '/migration/' | relative_url }})** — the
  `majorsilence-migrate` CLI does the mechanical rewrite for you.
- **[WinForms alternatives compared]({{ '/winforms-alternatives/' | relative_url }})** — how this
  differs from .NET MAUI, Avalonia, Uno Platform, Eto.Forms and Wine.
- **[FAQ]({{ '/faq/' | relative_url }})** — short answers to the questions that come first.
