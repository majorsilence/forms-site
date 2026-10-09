---
title: "What landed since August: 26.9.0, four new backends, CSS theming, and the behaviour audit"
date: 2026-10-08 12:00:00 -0230
read_time: "7 min read"
excerpt: "Seven weeks and 557 commits: GTK 4, Terminal, WinForms and WPF hosts, .NET Framework 4.8 support, CSS themes, async-only dialogs on mobile and browser, and one paint change you need to act on."
description: >-
  Majorsilence.Forms 26.9.0: GTK 4, Terminal, WinForms and WPF backends, net48 and netstandard2.0,
  CSS theming, MVVM, the behaviour audit, and upgrade notes.
---

The last post here was written against 26.0.30. Since 2026-08-17 the repository has taken 557 commits
and the current release is **26.9.0**. This is a roundup for existing users and evaluators: what
changed, how mature each piece is, and the one thing you must do when you upgrade.

## Four new backends

There were three hosts — Avalonia, Uno, Headless. There are now seven, all running the same control
set; the difference is who creates the window and presents the Skia surface.

**GTK 4** (`Majorsilence.Forms.Gtk4`) is a Linux-first host built on gir.core: a real `Gtk.Window` per
form, GLib main loop, also usable on Windows and macOS with the GTK 4 runtime. Select it explicitly with
`Gtk4Application.Use ();` before `Application.Run`. Embedding works both ways (`ToGtkWidget()`,
`ToGtkWindow()`), `NativeControlHost` has no airspace problem because GTK 4 composites one render tree,
and `WebBrowser` is backed by WebKitGTK 6.0. Verified on Wayland. Known gaps: no screen-position
control (GTK 4 removed the API), `SetIcon(byte[])` is a no-op, native file pickers return empty so
fallback dialogs are used, integer scale factor only, not AOT-analysed.

**Terminal** (`Majorsilence.Forms.Terminal`, 2026-10-04) hosts a form inside a console as a
single view — the form fills the terminal, no title bar, like a phone. It uses Kitty graphics or Sixel
at real pixel resolution where available, otherwise Unicode block elements; detection is by querying the
terminal, and `MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` pins a mode. Mouse and keyboard work; Ctrl+C
always exits. Selected with `TerminalApplication.Use (options);`. Verified in xterm and WezTerm only.
No native pickers, `NativeControlHost` or webview.

**WinForms** (`Majorsilence.Forms.WinForms`) is a Windows-only *migration* backend: real
`System.Windows.Forms` windows on the Win32 pump, Skia presented through a GDI bitmap. It exists so you
can embed Majorsilence.Forms controls in an existing WinForms app one control at a time —
`myMfControl.ToWinFormsControl()`, `myForm.ToWinFormsForm()`, `MajorsilenceFormsPresenter` — then swap
the host to Avalonia or Uno once everything is ported. No gestures, no `IWebViewFactory`. It is distinct
from the older `WindowsFormsInterop`, which bridges whole forms on the Avalonia host.

**WPF** (`Majorsilence.Forms.Wpf`) has the same shape and purpose for WPF apps: a real WPF `Window`,
`WriteableBitmap` presentation, `ToWpfElement()` and `ToWpfWindow()`. Select it with
`Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();`.

Avalonia, WinForms and GTK 4 give genuine OS-level modal dialogs; Uno opens an independent window, so
use `Form.ShowDialog(parent)` there.

## .NET Framework 4.8 and netstandard2.0

The core packages — `Majorsilence.Forms`, `.Drawing.Common`, `.Telerik` — now multi-target `net8.0`,
`net10.0` **and `netstandard2.0`**, and the WinForms and WPF backends add `net48`. A .NET Framework 4.8
application can therefore host Majorsilence.Forms controls without first moving to modern .NET, which
removes an ordering problem many migrations had.

## The behaviour-gap audit

The two API-surface gap plans (WinForms and GDI+) are at **zero**: every member upstream has is
declared. That was always the less interesting half. A member that exists but stores a value nobody
reads, or raises an event nobody fires, compiles your migrated app and then quietly does nothing.

So on 2026-08-25 a twelve-area audit compared each area against the upstream implementation and
recorded **483 findings** where behaviour differed. Since then phases 0–4 and most per-control families
have landed. Concrete items now real: the `ProcessCmdKey` pre-processing chain, a single
focus/validation choke point, the title bar out of the client area, `AutoScaleMode.Font` actually
scaling, live data binding (`CurrencyManager`, `BindingNavigator`), `ListView.View = Details`, form
lifecycle in upstream order (Load → VisibleChanged → Activated, Shown posted), DataGridView column
reordering, Ctrl+Z in text controls, `NotifyIcon` in the system tray, `Application.AddMessageFilter`, and
disposing a form disposing its controls.

The hollow surface is also *measured* now: baseline files pin the known no-op methods, inert events and
stored-only properties, so adding to them is a conscious act rather than an accident. The stub policy is
unchanged — no-op or return default, never `NotImplementedException`.

## Logical units: the one thing you must do

On 2026-10-01 `ClientRectangle`, `ClientSize` and the paint canvas (`OnPaint`, `Paint`,
`e.ClipRectangle`, `e.Canvas`) became **logical units**, matching `Width`/`Height`/`Bounds` and
`MouseEventArgs`. The framework scales the canvas to the display for you.

**If a custom control called `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`, remove it** — the
drawing is now scaled twice. Device pixels are still reachable through the `Scaled*` family
(`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling` and `LogicalToDeviceUnits`. The one
exception is owner-draw events (`DrawItem`, `DrawNode`, `CellPainting`), which still hand you
device-pixel bounds. Run your tests with `MF_HEADLESS_SCALE=2` to catch anything that depends on the
old behaviour.

## Browser and mobile

On `net10.0-browser`, `-android` and `-ios` the Avalonia backend reports `CanRunModalLoop = false`,
and the blocking calls — `Form.ShowDialog`, `MessageBox.Show`, the file pickers, `TaskDialog.ShowDialog`,
`VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show` — now throw `PlatformNotSupportedException`
naming the async twin *before* anything is shown, rather than hanging. The async forms
(`ShowDialogAsync`, `MessageBox.ShowAsync`, `FileDialog.ShowDialogAsync`, …) work on every host, so the
idiom is an `async void` handler with `await`. A Roslyn analyzer in the core package finds these ahead
of time — `MFB001` blocking modal call, `MFB002` synchronous wait on a Task, `MFB003` `Thread.Sleep`,
each with a code fix — active for browser TFMs or with `majorsilence_forms.browser_target = true` in
`.editorconfig`.

The browser target also keeps an **accessibility DOM** beside the canvas: one transparent,
click-through element per control with ARIA role, name, state and bounds, built from the framework's
own automation tree. Screen readers, find-in-page and DOM-based test tools can now see the UI.

On Android and iOS the on-screen keyboard is raised on `TextBox` focus, `TextBoxBase.InputKind` picks
the keyboard type, safe-area insets apply through `Form.SafeAreaPadding`, and
`WindowBase.BackRequested` handles the Android back button. Honest status: Android has had an initial
real-device pass (boot, taps, render scaling, touch scroll confirmed on hardware); keyboard, safe-area
and rotation are unit-tested only. iOS CI compiles the real head and launches it in a simulator smoke
check, but nobody has run it interactively and the job is still `continue-on-error`.

Phone-style layout controls arrived alongside: `StackPanel`, `Card`, `RichListBox` (multi-line templated
rows) and `NavigationHost` (a page stack with a back button).

## CSS theming and Theme Studio

Themes can now be written as a strict, documented CSS subset: `@theme "Ocean" extends Dark;`, `:root`
tokens one per `Theme` property, control-type rules like `Button:hover { … }`, parts via `Type::part`.
The parser never fails silently — `ThemeStyleSheet.Parse` collects diagnostics. Load with
`Theme.LoadFromCssFile`, or `Theme.RegisterThemeCssFromFile` + `Theme.ApplyTheme ("Ocean")`; export
with `Theme.ExportCss`. Every control, including the Telerik compat layer, has a selector, and the older
`<Theme>` XML still works.

Two companion packages apply the *same* sheet to other hosts: `Majorsilence.Forms.Theming.WinForms`
restyles real `System.Windows.Forms` controls (Windows only) and `Majorsilence.Forms.Theming.Avalonia`
restyles native Avalonia Fluent controls, so one CSS file can theme a mixed migration app.
`samples/ThemeStudio` is a live editor with preview and diagnostics; prebuilt binaries are attached to
GitHub Releases.

## MVVM, Essentials, animation

`Majorsilence.Forms.Mvvm` is trim- and AOT-safe wiring over `INotifyPropertyChanged` and `ICommand`,
no reflection, no toolkit dependency: `viewModel.Observe (nameof (VM.Count), vm => vm.Count, …)`,
two-way `BindText`/`BindChecked`/`BindSelectedIndex`/`BindValue`, `BindCommand`, and a `BindingScope` to
dispose it all. It works alongside CommunityToolkit.Mvvm.

`Majorsilence.Forms.Essentials` keeps per-platform capabilities out of core: `SecureStorage`, `Speech`
text-to-speech, `Launcher.OpenAsync` (http/https/mailto/tel/sms) and `FileSystem.OpenAppPackageFileAsync`.
Everything degrades to a no-op; check `IsSupported`.

`control.RequestAnimationFrame` plus `Majorsilence.Forms.Animation` (`Tween<T>`, `Easing`, `Animator`)
give display-aligned animation on Avalonia and a manual clock on Headless.

## Tooling

- The MCP server is a published dotnet tool: `dotnet tool install -g Majorsilence.Forms.Mcp`, then
  `claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444`. It exposes `ui_snapshot`, `ui_find`,
  `ui_click`, `ui_type`, `ui_wait_for` and `ui_screenshot`, talking to your app's `WebDriverServer`.
- `samples/AutomationTarget` is a deliberately awkward little app (controls that refuse clicks, one
  unnamed) for learning the tooling. Custom-painted controls publish value and state via
  `IAutomationStateProvider`.
- The migrator ships **only** as a dotnet tool now (`dotnet tool install -g Majorsilence.Forms.Migrator`);
  self-contained binaries are no longer attached to releases. New switches: `--map`, `--dual-build`,
  `--strict`, `--dry-run --diff`.
- `Majorsilence.Forms.WinFormsShims.Compat` is a proof-of-concept source generator that emits
  `System.Windows.Forms` and `System.Drawing` namespaces backed by Majorsilence.Forms, so unmodified
  WinForms source — including `Designer.cs` — compiles. For control libraries whose public API is typed
  to WinForms. PoC status; see `samples/WinFormsCompatDemo`.

## Upgrade notes

- Pin **26.9.0**. The project is still beta and still has no visual designer.
- Remove any `ScaleTransform (e.Scaling, e.Scaling)` in custom paint code (see above).
- The template package id is `Majorsilence.Forms.Templates`, installed with
  `dotnet new install Majorsilence.Forms.Templates`. `dotnet new majorsilenceforms` now scaffolds a
  solution with a shared UI library and a desktop head; `--IncludeAndroid`, `--IncludeiOS` and
  `--IncludeWasm` add heads.
- Breaking changes are listed in `MIGRATION.md`: `SplitContainer.Orientation`,
  `TreeViewDrawMode.OwnerDrawContent`, event delegate types now match WinForms, and gradient/hatch
  brushes moved to match GDI+.
- On browser, Android and iOS, replace blocking dialog calls with their async twins; let `MFB001`–`MFB003`
  find them.

## Where to read more

- [Platform backends]({{ '/backends/' | relative_url }}) and
  [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md)
- [Getting started]({{ '/getting-started/' | relative_url }}) and
  [Migration]({{ '/migration/' | relative_url }}) /
  [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)
- [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md),
  [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md),
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md),
  [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)
- [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md)
- [Automation]({{ '/automation/' | relative_url }}) and
  [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md)
- [Samples]({{ '/samples/' | relative_url }})
