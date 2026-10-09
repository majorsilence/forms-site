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
  - winforms dark mode theme
  - winforms gtk
  - winforms terminal
  - winforms nativeaot
  - winforms mvvm
priority: "0.8"
faq:
  - question: Can WinForms run on Linux?
    id: can-winforms-run-on-linux
    answer: >-
      Not as-is. System.Windows.Forms ships only in the Windows Desktop runtime and wraps user32.dll
      and GDI+, so a WinForms project will not even build on Linux. Majorsilence.Forms solves it by
      reimplementing the WinForms API on SkiaSharp and hosting it in a native window through
      Avalonia, or in a real GTK 4 window, so the same C# or VB.NET source builds and runs natively
      on Ubuntu, Fedora and Debian from a plain net10.0 build with no -windows target framework.
  - question: Can WinForms run on macOS?
    id: can-winforms-run-on-macos
    answer: >-
      Not as-is — there has never been a macOS build of System.Windows.Forms. Majorsilence.Forms
      runs the same WinForms code in a real NSWindow on both Apple Silicon and Intel Macs, published
      with the ordinary osx-arm64 and osx-x64 runtime identifiers.
  - question: Does it run on GTK, as a native Linux toolkit?
    id: does-it-run-on-gtk-as-a-native-linux-toolkit
    answer: >-
      Yes. Majorsilence.Forms.Gtk4 is a GTK 4 backend built on the gir.core bindings: a real Gtk.Window
      on Wayland or X11, selected explicitly with Gtk4Application.Use before Application.Run, and it
      also runs on Windows and macOS wherever the GTK 4 runtime is installed. It embeds in both
      directions through ToGtkWidget and ToGtkWindow, hosts native GTK widgets without the usual
      airspace problem, and gives WebBrowser a WebKitGTK engine. Known gaps are no screen-position
      control, integer-only scale factors and file pickers that fall back to the framework's own
      dialogs.
  - question: Can it run in a terminal?
    id: can-it-run-in-a-terminal
    answer: >-
      Yes. Majorsilence.Forms.Terminal hosts a form as a single full-screen view in a console, the
      way a phone does, rendering through Kitty graphics or Sixel at real pixel resolution where the
      terminal supports them and falling back to Unicode block elements elsewhere. Mouse and keyboard
      work, Ctrl+C always exits, and it has been verified in xterm and WezTerm. There are no native
      file pickers, native hosting or web view on this backend.
  - question: Is WinForms cross-platform?
    id: is-winforms-cross-platform
    answer: >-
      No. Windows Forms itself is Windows-only and always has been; only the .NET runtime under it
      is cross-platform. Making a WinForms application cross-platform means either rewriting the UI
      in another framework, emulating Windows with something like Wine, or using an API-compatible
      reimplementation such as Majorsilence.Forms.
  - question: What is a WinForms compatibility layer?
    id: what-is-a-winforms-compatibility-layer
    answer: >-
      A library that exposes the same classes, properties and events as System.Windows.Forms — Form,
      Button, DataGridView, the event handlers, the Designer.cs pattern — but implements them on
      something portable instead of Win32. Your source keeps its shape and changes namespace;
      everything underneath is different.
  - question: Do I have to rewrite my WinForms app to make it cross-platform?
    id: do-i-have-to-rewrite-my-winforms-app-to-make-it-cross-platform
    answer: >-
      Not with Majorsilence.Forms. The migration is mostly mechanical — namespaces, project files and
      resources — and the majorsilence-migrate CLI performs it for you, in place and as a readable
      git diff. Your forms, controls, event handlers and Designer files are kept. Code that reaches
      into Win32 directly, through WndProc or Control.Handle, does have to be rewritten.
  - question: How is Majorsilence.Forms different from Avalonia, Uno Platform or .NET MAUI?
    id: how-is-majorsilenceforms-different-from-avalonia-uno-platform-or-net-maui
    answer: >-
      Those are XAML frameworks: excellent targets, but adopting one means rebuilding your UI as
      XAML views and view models. Majorsilence.Forms keeps the WinForms programming model and treats
      the toolkit underneath as a swappable host: Avalonia or Uno by default, and also GTK 4, real
      WinForms, WPF or a terminal — it is built on them rather than competing with them. Choose XAML
      directly for a green-field app; choose Majorsilence.Forms when an existing WinForms codebase is
      the asset you are trying to keep.
  - question: Do my Designer.cs files still work?
    id: do-my-designercs-files-still-work
    answer: >-
      Yes. The Designer.cs and Designer.vb code-behind pattern is preserved as-is and the generated
      layout code runs unchanged. What does not exist yet is a visual design surface to edit it in —
      there is no drag-and-drop designer, and it is a wanted feature on the backlog.
  - question: Does it support VB.NET as well as C#?
    id: does-it-support-vbnet-as-well-as-c
    answer: >-
      Yes. The migrator rewrites .vb projects, injects the implicit WinForms constructor lost when
      MyType=Empty stops applying, and generates a My.Resources accessor. Parts of the VB Application
      Model (My.Application, My.Forms) are implemented too, and MIGRATION.md lists what still is not
      and why. The training guide gives every example in both C# and VB.NET.
  - question: What replaces System.Drawing and GDI+?
    id: what-replaces-systemdrawing-and-gdi
    answer: >-
      Majorsilence.Forms.Drawing.Common, a SkiaSharp-backed reimplementation covering Bitmap, Font,
      Pen, Brush, Icon, Region, StringFormat, Drawing2D, Imaging and EMF/WMF metafile playback. The
      value types — Color, Point, Size, Rectangle — are deliberately not reimplemented; the real,
      already cross-platform System.Drawing.Primitives types are used instead. This matters because
      System.Drawing.Common has thrown PlatformNotSupportedException off Windows since .NET 7.
  - question: Can I theme it, and is there a dark mode?
    id: can-i-theme-it-and-is-there-a-dark-mode
    answer: >-
      Yes. Themes are written in a small, fully documented subset of CSS: a theme header such as
      @theme "Ocean" extends Dark, root tokens for the accent, background and font properties, and
      per-control-type rules with hover, active, disabled and focus states. Light and dark built-ins
      ship, every control has a CSS selector, and the parser reports a diagnostic rather than silently
      ignoring anything outside the subset. The Theme Studio sample is a live editor with preview, and
      the companion Theming.WinForms and Theming.Avalonia packages apply the same sheet to real
      System.Windows.Forms and native Avalonia controls, so one theme can restyle a mixed migration app.
  - question: Is Majorsilence.Forms free and open source?
    id: is-majorsilenceforms-free-and-open-source
    answer: >-
      Yes. It is MIT licensed, developed in the open on GitHub, and published to NuGet. There is no
      commercial tier or paid license.
  - question: Is it production-ready?
    id: is-it-production-ready
    answer: >-
      It is beta. The API is stabilizing and not every WinForms corner is covered, so pin your
      package version. Every WinForms and GDI+ member is now declared, and a twelve-area behaviour-gap
      audit of where members did not yet behave like WinForms is being worked through in phases, with
      the keyboard chain, focus and validation, real dialogs, data binding, ListView details view and
      most per-control families already landed. Several real applications have been forked onto it,
      among them a Notepad++ clone, DarkUI, PKHeX and RibbonWinForms. Read the compatibility matrix
      before committing.
  - question: Does it support DataGridView?
    id: does-it-support-datagridview
    answer: >-
      Partially, and it is still the largest single-type gap, though it has narrowed a lot. The
      highest-traffic hooks are real — cell formatting and painting, row pre and post paint, cell
      parsing, row validation, clipboard content, border styles, virtual mode, the uncommitted new row
      and column display-order reordering. A few events such as CellStateChanged and RowStateChanged
      are still declared for source compatibility but never raised. The compatibility matrix lists
      exactly which.
  - question: Which .NET versions are supported?
    id: which-net-versions-are-supported
    answer: >-
      .NET 8 and .NET 10 for every backend, with no -windows target framework suffix and no Windows
      Desktop runtime dependency. The core packages also build for netstandard2.0, and the WinForms
      and WPF migration backends add a net48 target so a .NET Framework 4.8 application can host them.
  - question: Does it work with .NET Framework 4.8?
    id: does-it-work-with-net-framework-48
    answer: >-
      Only through the Windows-only migration backends. The core library targets netstandard2.0, and
      Majorsilence.Forms.WinForms and Majorsilence.Forms.Wpf each ship a net48 build, so a classic
      .NET Framework 4.8 WinForms or WPF app can embed Majorsilence.Forms controls today and move to
      .NET 8 or 10 and a cross-platform backend later. The Avalonia, Uno, GTK 4 and Headless backends
      need .NET 8 or newer.
  - question: Can it run in a web browser?
    id: can-it-run-in-a-web-browser
    answer: >-
      Yes, through WebAssembly, using either Avalonia's browser target or Uno Platform, and the full
      control gallery is published as a live in-browser demo. The browser has one thread and no nested
      message loop, so blocking calls such as Form.ShowDialog and MessageBox.Show throw a clear
      PlatformNotSupportedException before anything is shown; use Form.ShowDialogAsync,
      MessageBox.ShowAsync and the other async twins instead, and a shipped Roslyn analyzer flags the
      blocking calls for you. Alongside the canvas the framework keeps an ARIA accessibility DOM, one
      element per control with role, name and state, so screen readers, find-in-page and DOM test tools
      can see the UI. There is still no native WebView on this target.
  - question: Is there an Android and iOS story, and how mature is it?
    id: is-there-an-android-and-ios-story-and-how-mature-is-it
    answer: >-
      Yes, through Avalonia's Android and iOS targets, which the project template adds with
      --IncludeAndroid and --IncludeiOS. The on-screen keyboard, input kinds, safe-area insets, back
      button, suspend and resume, haptics and phone-style layout controls such as StackPanel, Card and
      NavigationHost are in place, and blocking dialogs throw in favour of the async forms as in the
      browser. Android has had an initial real-device pass covering boot, taps, scaling and touch
      scrolling; iOS compiles and launches in a CI simulator smoke check but nobody has run it
      interactively yet, so expect a shakeout.
  - question: Can I use it with MVVM or CommunityToolkit.Mvvm?
    id: can-i-use-it-with-mvvm-or-communitytoolkitmvvm
    answer: >-
      Yes. Majorsilence.Forms.Mvvm provides the wiring over INotifyPropertyChanged and ICommand:
      Observe for one-way updates, BindText, BindChecked, BindSelectedIndex and BindValue for two-way
      binding, BindCommand for buttons, and a BindingScope to dispose it all. It names properties with
      nameof and reads them with lambdas, so there is no reflection and nothing to root under trimming.
      It depends on no toolkit, so a view model written with CommunityToolkit.Mvvm works unchanged.
  - question: Does it support trimming and NativeAOT?
    id: does-it-support-trimming-and-nativeaot
    answer: >-
      Yes for the core, Drawing.Common, Avalonia and Headless packages, which build with
      IsAotCompatible so any trim or AOT hazard fails their own build, and a NativeAOT smoke test
      publishes in CI. The classic Control.DataBindings API is reflective, so a trimmed app must root
      the view-model members it binds with a TrimmerRootDescriptor; the framework embeds its own
      descriptor for its controls' bindable properties, and the Mvvm package avoids the problem
      entirely. The netstandard2.0 and GTK 4 rows are not yet analysed.
  - question: How do I get an HWND for a control?
    id: how-do-i-get-an-hwnd-for-a-control
    answer: >-
      You cannot on the cross-platform backends, and the framework refuses to fake one. A control
      here is paint operations on a canvas rather than an OS window, so Control.Handle is IntPtr.Zero.
      Window-level handles are genuine — WindowBase.PlatformHandle returns a real HWND on Windows,
      NSWindow on macOS and XID on X11. For hosting native content there is a supported
      NativeControlHost seam, and the Windows-only WinForms backend does return a real HWND because
      the window really is a WinForms window.
  - question: Can I migrate one screen at a time?
    id: can-i-migrate-one-screen-at-a-time
    answer: >-
      Yes, in several ways. The migrator's dual-build mode keeps a project compiling against both real
      WinForms and Majorsilence.Forms behind one MSBuild property. On Windows,
      Majorsilence.Forms.WindowsFormsInterop hosts real System.Windows.Forms forms inside a
      Majorsilence.Forms application and the reverse, so whole screens move individually. Finer still,
      the WinForms and WPF backends embed Majorsilence.Forms controls inside an existing app one control
      at a time through ToWinFormsControl or ToWpfElement, and the WinFormsShims.Compat source generator
      lets unmodified System.Windows.Forms source, Designer files included, compile against
      Majorsilence.Forms for control libraries typed to WinForms.
  - question: Can an AI coding assistant drive the UI?
    id: can-an-ai-coding-assistant-drive-the-ui
    answer: >-
      Yes. Every control is exposed through a text automation tree, and the app can serve it over a
      loopback WebDriver endpoint that Selenium or curl can talk to. Majorsilence.Forms.Mcp is a
      published dotnet tool that wraps that endpoint as an MCP server, with ui_snapshot, ui_find,
      ui_read, ui_click, ui_type, ui_wait_for and ui_screenshot tools, so an assistant such as Claude
      Code can inspect and operate a running form. Custom-painted controls publish their own value and
      state by implementing IAutomationStateProvider.
  - question: Do custom-painted controls need to handle DPI scaling?
    id: do-custom-painted-controls-need-to-handle-dpi-scaling
    answer: >-
      No, and since 2026-10-01 they should not. ClientRectangle, ClientSize and the paint canvas are in
      logical units, the same as Width, Height, Bounds and mouse coordinates, and the framework scales
      the canvas to the display. If an older control called e.Graphics.ScaleTransform with e.Scaling,
      remove it or the drawing is scaled twice. Device pixels remain available through ScaledBounds,
      PaintEventArgs.Scaling and LogicalToDeviceUnits, and owner-draw events such as DrawItem and
      CellPainting still hand over device-pixel bounds. Test at scale 2 with MF_HEADLESS_SCALE=2.
---

{% for entry in page.faq %}
### {{ entry.question }}
{:#{{ entry.id }}}

{{ entry.answer }}
{% endfor %}

## Still looking for something?

- [Cross-platform WinForms]({{ '/cross-platform-winforms/' | relative_url }}) — the architecture and
  what the compatibility model costs.
- [WinForms on Linux]({{ '/winforms-on-linux/' | relative_url }}) and
  [WinForms on macOS]({{ '/winforms-on-macos/' | relative_url }}) — platform-by-platform detail.
- [Platform backends]({{ '/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms,
  WPF and Headless side by side.
- [Migrate a WinForms app]({{ '/migration/' | relative_url }}) — the automated rewrite.
- [WinForms alternatives compared]({{ '/winforms-alternatives/' | relative_url }}) — MAUI, Avalonia,
  Uno, Eto.Forms, Wine.
- [Theming with CSS]({{ site.github_url }}/blob/main/docs/theming.md) — the theme subset, tokens
  and Theme Studio.
- [Compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — the
  control-by-control answer to "is *X* supported?".
- [Open an issue]({{ site.github_url }}/issues) — if the answer isn't here.
