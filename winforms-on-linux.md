---
layout: docs
title: WinForms on Linux
subtitle: Running a Windows Forms codebase on Ubuntu, Fedora, Debian and friends — what works, what to watch for, and how to ship it.
permalink: /winforms-on-linux/
seo_title: "How to Run WinForms on Linux — Cross-Platform Windows Forms"
description: >-
  Windows Forms can't run on Linux and Mono's port is long gone. How Majorsilence.Forms builds and
  runs your WinForms app natively on Ubuntu, Fedora and Debian.
keywords:
  - winforms on linux
  - windows forms linux
  - run winforms on ubuntu
  - c# winforms linux
  - .net winforms linux gui
  - system.windows.forms linux
  - winforms mono linux
priority: "0.9"
---

## Why plain WinForms can't do it

`System.Windows.Forms` ships only in the **Windows Desktop** runtime. On Linux there is no
`Microsoft.WindowsDesktop.App` shared framework to resolve against, so a `net10.0-windows` project
doesn't merely fail to run — `dotnet build` refuses it. The assembly is a wrapper over `user32.dll`
and GDI+, and neither exists here.

The three things people usually try:

- **Mono's `System.Windows.Forms`.** A real reimplementation, and the reason old forum threads say
  this works. It was built for the .NET Framework era, was never carried into modern .NET, and is
  not a target you can adopt today.
- **Wine.** Runs the Windows binary rather than porting it. Workable as a stopgap; it means shipping
  a Windows executable plus a compatibility runtime, with approximate host integration.
- **`System.Drawing.Common` on Linux.** Even for non-UI drawing code this stopped being an option:
  it has thrown `PlatformNotSupportedException` off Windows since .NET 7 unless you set a
  now-removed compatibility switch.

## What Majorsilence.Forms does instead

It reimplements the WinForms API on top of SkiaSharp and hosts it in an Avalonia window. On Linux
that means a normal, native X11 application — a real window in your window manager, real input, GPU
compositing where available, and a plain `net10.0` build with no `-windows` suffix anywhere.

```bash
dotnet new install MajorsilenceForms.Templates
dotnet new majorsilenceforms
dotnet run
```

That is the whole setup on a stock Ubuntu box with the .NET SDK installed. The same source builds
and runs unchanged on Windows and macOS.

## What actually works on Linux

| Area | On Linux |
|---|---|
| Windowing, input, HiDPI | Native, via the Avalonia X11 backend. Runs under XWayland on Wayland sessions. |
| Rendering | SkiaSharp, GPU-accelerated — the same paint code as Windows and macOS, so controls look identical |
| Fonts and text | SkiaSharp resolves system fonts through fontconfig; `Majorsilence.Forms.Drawing.Common` also bundles a fallback set, so text renders even on a minimal image with no fonts installed |
| GDI+ / `System.Drawing` code | Replaced by `Majorsilence.Forms.Drawing` — `Bitmap`, `Font`, `Pen`, `Brush`, `Region`, `Drawing2D`, `Imaging`, and EMF/WMF playback |
| Common dialogs | `OpenFileDialog`, `SaveFileDialog`, `FolderBrowserDialog`, `ColorDialog`, `FontDialog` work through the backend's native dialogs |
| Printing | `PrintDocument` renders through Skia to PDF rather than to a print driver — the same on every OS |
| WebView controls | Real WebKitGTK, where WebKitGTK/WPE is installed |
| Sound | Played through the OS utility (`paplay`/`aplay`) |
| Native window handle | A real X11 `XID` via `WindowBase.PlatformHandle` (per-*control* handles are `IntPtr.Zero` everywhere — see [Native interop]({{ '/native-interop/' | relative_url }})) |
| UI Automation / screen readers | Windows-only today (`Majorsilence.Forms.WindowsUIAutomation`); AT-SPI is not wired up. The backend-neutral [automation tree]({{ '/automation/' | relative_url }}) still drives tests and Selenium on Linux |
| `Majorsilence.Forms.WindowsFormsInterop` | Windows-only by definition — it hosts real `System.Windows.Forms` forms, which don't exist here |

## Deployment notes

Nothing exotic — it's an ordinary .NET application:

```bash
dotnet publish -c Release -r linux-x64 --self-contained
```

Two things worth knowing:

- **Native Skia binary.** `SkiaSharp.NativeAssets.Linux` carries `libSkiaSharp.so`, which links
  against fontconfig. Desktop distributions already have it; slim container images generally need
  `libfontconfig1` (Debian/Ubuntu) or `fontconfig` (Fedora/Alpine) added explicitly.
- **Headless environments.** For CI, servers and containers with no display, reference
  `Majorsilence.Forms.Headless` instead of a desktop backend and render offscreen — no Xvfb, no
  display server. That's how this project's own test suite runs. See
  [Automation & UI testing]({{ '/automation/' | relative_url }}).

## Verified on Linux

The [`Explorer`]({{ '/samples/' | relative_url }}) sample — a Windows Explorer clone — runs on
Ubuntu, and the full [control gallery]({{ '/samples/' | relative_url }}) runs on the Avalonia
backend there:

![The Explorer sample running on Ubuntu]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

## Next

- [Getting started]({{ '/getting-started/' | relative_url }}) — first app, from a template or scratch.
- [Migrate an existing WinForms app]({{ '/migration/' | relative_url }}) — the automated rewrite,
  including dropping the `-windows` TFM and the `System.Drawing.Common` reference.
- [WinForms on macOS]({{ '/winforms-on-macos/' | relative_url }}) — the same story on Apple hardware.
- [Cross-platform WinForms]({{ '/cross-platform-winforms/' | relative_url }}) — the architecture and
  its trade-offs.
