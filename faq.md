---
layout: docs
title: Frequently asked questions
subtitle: Short, direct answers to what people ask first about cross-platform WinForms.
permalink: /faq/
seo_title: "Cross-Platform WinForms FAQ — Can WinForms Run on Linux?"
description: >-
  Can WinForms run on Linux or macOS? Is WinForms cross-platform? Do I have to rewrite? Straight
  answers about the open-source WinForms compatibility layer.
keywords:
  - can winforms run on linux
  - is winforms cross platform
  - winforms on mac
  - winforms compatibility layer
  - winforms alternative
  - winforms designer cross platform
  - winforms vb.net cross platform
priority: "0.8"
faq:
  - question: Can WinForms run on Linux?
    answer: >-
      Not as-is. System.Windows.Forms ships only in the Windows Desktop runtime and wraps user32.dll
      and GDI+, so a WinForms project will not even build on Linux. Majorsilence.Forms solves it by
      reimplementing the WinForms API on SkiaSharp and hosting it in a native X11 window through
      Avalonia, so the same C# or VB.NET source builds and runs natively on Ubuntu, Fedora and
      Debian from a plain net10.0 build with no -windows target framework.
  - question: Can WinForms run on macOS?
    answer: >-
      Not as-is — there has never been a macOS build of System.Windows.Forms. Majorsilence.Forms
      runs the same WinForms code in a real NSWindow on both Apple Silicon and Intel Macs, published
      with the ordinary osx-arm64 and osx-x64 runtime identifiers.
  - question: Is WinForms cross-platform?
    answer: >-
      No. Windows Forms itself is Windows-only and always has been; only the .NET runtime under it
      is cross-platform. Making a WinForms application cross-platform means either rewriting the UI
      in another framework, emulating Windows with something like Wine, or using an API-compatible
      reimplementation such as Majorsilence.Forms.
  - question: What is a WinForms compatibility layer?
    answer: >-
      A library that exposes the same classes, properties and events as System.Windows.Forms — Form,
      Button, DataGridView, the event handlers, the Designer.cs pattern — but implements them on
      something portable instead of Win32. Your source keeps its shape and changes namespace;
      everything underneath is different.
  - question: Do I have to rewrite my WinForms app to make it cross-platform?
    answer: >-
      Not with Majorsilence.Forms. The migration is mostly mechanical — namespaces, project files and
      resources — and the majorsilence-migrate CLI performs it for you, in place and as a readable
      git diff. Your forms, controls, event handlers and Designer files are kept. Code that reaches
      into Win32 directly, through WndProc or Control.Handle, does have to be rewritten.
  - question: How is Majorsilence.Forms different from Avalonia, Uno Platform or .NET MAUI?
    answer: >-
      Those are XAML frameworks: excellent targets, but adopting one means rebuilding your UI as
      XAML views and view models. Majorsilence.Forms keeps the WinForms programming model and uses
      Avalonia or Uno as the host underneath it — it is built on them rather than competing with
      them. Choose XAML directly for a green-field app; choose Majorsilence.Forms when an existing
      WinForms codebase is the asset you are trying to keep.
  - question: Do my Designer.cs files still work?
    answer: >-
      Yes. The Designer.cs and Designer.vb code-behind pattern is preserved as-is and the generated
      layout code runs unchanged. What does not exist yet is a visual design surface to edit it in —
      there is no drag-and-drop designer, and it is a wanted feature on the backlog.
  - question: Does it support VB.NET as well as C#?
    answer: >-
      Yes. The migrator rewrites .vb projects, injects the implicit WinForms constructor lost when
      MyType=Empty stops applying, and generates a My.Resources accessor. The training guide gives
      every example in both C# and VB.NET.
  - question: What replaces System.Drawing and GDI+?
    answer: >-
      Majorsilence.Forms.Drawing.Common, a SkiaSharp-backed reimplementation covering Bitmap, Font,
      Pen, Brush, Icon, Region, StringFormat, Drawing2D, Imaging and EMF/WMF metafile playback. The
      value types — Color, Point, Size, Rectangle — are deliberately not reimplemented; the real,
      already cross-platform System.Drawing.Primitives types are used instead. This matters because
      System.Drawing.Common has thrown PlatformNotSupportedException off Windows since .NET 7.
  - question: Is Majorsilence.Forms free and open source?
    answer: >-
      Yes. It is MIT licensed, developed in the open on GitHub, and published to NuGet. There is no
      commercial tier or paid license.
  - question: Is it production-ready?
    answer: >-
      It is beta. The API is stabilizing and not every WinForms corner is covered, so pin your
      package version. It is a reasonable choice for new cross-platform line-of-business apps and
      for migrating real applications today, and several real applications have been ported to it.
      Read the compatibility matrix before committing.
  - question: Does it support DataGridView?
    answer: >-
      Partially, and it is the largest single-type gap. The highest-traffic hooks are real — cell
      formatting and painting, row pre and post paint, cell parsing, row validation, clipboard
      content and border styles. Several events are declared for source compatibility but never
      raised. The compatibility matrix lists exactly which.
  - question: Which .NET versions are supported?
    answer: >-
      .NET 8 and .NET 10. There is no -windows target framework suffix and no Windows Desktop
      runtime dependency.
  - question: Can it run in a web browser?
    answer: >-
      Yes, through WebAssembly, using either Avalonia's browser target or Uno Platform. The full
      control gallery is published as a live in-browser demo. This path works but is young: there is
      no native WebView, and window chrome, modality and popup dismissal behave differently than on
      the desktop.
  - question: How do I get an HWND for a control?
    answer: >-
      You cannot, and the framework refuses to fake one. A control here is paint operations on a
      canvas rather than an OS window, so Control.Handle is IntPtr.Zero. Window-level handles are
      genuine — WindowBase.PlatformHandle returns a real HWND on Windows, NSWindow on macOS and XID
      on X11. For hosting native content there is a supported NativeControlHost seam.
  - question: Can I migrate one screen at a time?
    answer: >-
      Yes, two ways. The migrator's dual-build mode keeps a project compiling against both real
      WinForms and Majorsilence.Forms behind one MSBuild property. Separately, on Windows,
      Majorsilence.Forms.WindowsFormsInterop hosts real System.Windows.Forms forms inside a
      Majorsilence.Forms application and the reverse, so screens can move over individually in a
      running app.
---

{% for entry in page.faq %}
### {{ entry.question }}

{{ entry.answer }}
{% endfor %}

## Still looking for something?

- [Cross-platform WinForms]({{ '/cross-platform-winforms/' | relative_url }}) — the architecture and
  what the compatibility model costs.
- [WinForms on Linux]({{ '/winforms-on-linux/' | relative_url }}) and
  [WinForms on macOS]({{ '/winforms-on-macos/' | relative_url }}) — platform-by-platform detail.
- [Migrate a WinForms app]({{ '/migration/' | relative_url }}) — the automated rewrite.
- [WinForms alternatives compared]({{ '/winforms-alternatives/' | relative_url }}) — MAUI, Avalonia,
  Uno, Eto.Forms, Wine.
- [Compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — the
  control-by-control answer to "is *X* supported?".
- [Open an issue]({{ site.github_url }}/issues) — if the answer isn't here.
