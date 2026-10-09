---
layout: docs
title: Platform backends
subtitle: One rendering core, seven swappable hosts.
seo_title: "Platform Backends — WinForms on Avalonia, Uno, GTK 4, Terminal, WinForms, WPF or Headless"
description: >-
  How a cross-platform WinForms app is hosted on Avalonia, Uno Platform, GTK 4, a terminal, real
  WinForms or WPF windows, or a headless Skia surface — the backend seam, logical pixels, trimming,
  WebAssembly, mobile, and embedding in a host app.
keywords:
  - winforms on avalonia
  - winforms on uno platform
  - winforms on gtk4
  - winforms in a terminal
  - winforms webassembly
  - majorsilence.forms wpf backend
  - majorsilence.forms winforms backend
  - headless winforms rendering
  - skiasharp ui backend
priority: "0.8"
---

Majorsilence.Forms does **all of its own drawing** with SkiaSharp. Every control paints into an
`SKSurface`/`SKCanvas`; the windowing toolkit underneath is only a *host* — it creates native
windows, runs the message loop, delivers input, and presents the Skia surface to the screen.

That host is abstracted behind a small seam, so the same application code runs on any of seven
backends:

| Package | Host | What it is for | Platforms | How you select it |
|---|---|---|---|---|
| `Majorsilence.Forms.Avalonia` | Avalonia 12 | The default. Real desktop windows; also browser, Android and iOS through Avalonia's own platform packages. The only cross-platform backend with a real `TryGetPlatformHandle` (HWND / NSWindow / XID). | Windows, macOS, Linux; WebAssembly; Android and iOS (opt-in) | Automatic — reference the package and call `Application.Run (new MainForm ())`. |
| `Majorsilence.Forms.Uno` | Uno Platform Skia (Uno.WinUI 6.5) | Presents via `SKXamlCanvas` inside a Uno app head. | Desktop (verified on macOS); Uno also targets iOS/Android/WASM | `Platform.Backend = new UnoPlatformBackend ()` from the Uno app's `OnLaunched`. |
| `Majorsilence.Forms.Gtk4` | GTK 4 via gir.core (`GirCore.Gtk-4.0 0.8.1`) | A real `Gtk.Window` per form on the GLib main loop. Linux-first. Embedding both ways, `NativeControlHost` with no airspace problem, `WebBrowser` via WebKitGTK 6.0. | Linux (Wayland/X11, verified on Wayland); Windows/macOS with GTK 4 installed | `Gtk4Application.Use ();` then `Application.Run`. |
| `Majorsilence.Forms.Terminal` | Console / ANSI | Runs a form in a terminal as a single-view host (the form fills the screen, no title bar). Kitty graphics or Sixel at real pixel resolution, else Unicode block elements. | Any terminal; verified in xterm and WezTerm | `TerminalApplication.Use ();` then `Application.Run`. |
| `Majorsilence.Forms.WinForms` | real `System.Windows.Forms` | Windows-only *migration* backend: real WinForms windows on the Win32 pump, Skia presented through a GDI bitmap. Adopt Majorsilence.Forms one control at a time. Also targets `net48`. | Windows | `Platform.Backend = new WinFormsPlatformBackend ()` — or drop a `MajorsilenceFormsPresenter` into a WinForms form; it installs itself. |
| `Majorsilence.Forms.Wpf` | WPF `Window` | Windows-only migration backend, same shape as the WinForms one: a real WPF `Window` on the `Dispatcher` loop, Skia presented through a `WriteableBitmap`. Also targets `net48`. | Windows | `Platform.Backend = new WpfPlatformBackend ()`. |
| `Majorsilence.Forms.Headless` | dependency-free SkiaSharp | Offscreen rendering for tests, CI and servers; the reference backend to copy. | Anywhere .NET runs; no display | `HeadlessRenderer.Use ()`. |

The **core `Majorsilence.Forms` assembly references no windowing toolkit** — only SkiaSharp.
Backends are separate assemblies that depend on the core and reach into its internal render/input
plumbing.

### Target frameworks

The core (`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`)
multi-targets `net8.0`, `net10.0` **and `netstandard2.0`**. `Majorsilence.Forms.WinForms` and
`Majorsilence.Forms.Wpf` each add a **`net48`** row (paired with the core's `netstandard2.0` build)
alongside `net8.0-windows` / `net10.0-windows`, so a classic .NET Framework 4.8 WinForms or WPF app
can host Majorsilence.Forms controls today. The `net48` rows compile on every OS in CI; only
*running* them needs Windows.

The cross-platform backends (Avalonia, Uno, GTK 4, Terminal, Headless) target `net8.0`+ and need no
`-windows` TFM suffix. There is no `netstandard2.0` backend, so on a non-Windows .NET Framework
runtime an app can reference the controls but not host a window.

## The seam

Two interfaces in `Majorsilence.Forms.Backends` define everything a host must provide:

- **`IPlatformBackend`** — application and process services: the dispatcher (`Post`/`Invoke`),
  timers, clipboard, screens, `CreateWindow`, and the modal loop.
- **`IWindowBackend`** — one native window: location/size/scaling, show/hide/close, title, cursor,
  decorations, drag/resize, and the native file dialogs.

`IWindowBackend` is the *pull* side. The *push* side — paint requests and native input — is the
backend calling the owning window's neutral methods directly: `RenderFrame (SKCanvas, physW, physH,
scaling)`, `HandlePointer*`, `HandleKeyDown/Up`, `HandleTextInput`, and the `OnBackend*` lifecycle
hooks. All coordinates crossing the seam are `System.Drawing` value types and Majorsilence.Forms
enums — no toolkit type leaks into the core. Optional capabilities (`IWebViewFactory`,
`INativeControlHostBackend`, `IAudioBackend`, `IModalLoopSupport`, …) sit beside the two interfaces;
a backend that leaves one out simply never raises the corresponding events.

### Selecting a backend

`Majorsilence.Forms.Backends.Platform.Backend` holds the active `IPlatformBackend`. If unset, it
resolves by name to `AvaloniaPlatformBackend` when `Majorsilence.Forms.Avalonia` is referenced — so a
desktop app just references that package and calls `Application.Run (new MyForm ())`. Every other
backend is installed explicitly, **before the first window is created**:

```csharp
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
// or the helpers:  Gtk4Application.Use ();   TerminalApplication.Use ();   HeadlessRenderer.Use ();
Application.Run (new MainForm ());
```

### Logical vs. device pixels

Everything an application sees on `Control` is in **logical units** — the numbers it sets and reads
back at any display scaling: `Width`/`Height`/`Location`/`Bounds`, `ClientSize` and
`ClientRectangle`, `MouseEventArgs.X/Y`, and **the paint canvas**. `OnPaint`, `Paint` handlers and
`e.ClipRectangle` are all logical; the framework scales the canvas to the display.

```csharp
child.Left = (ClientSize.Width - child.Width) / 2;            // centres the child at any DPI
e.Graphics.DrawRectangle (pen, 0, 0, Width - 1, Height - 1);  // frames the control at any DPI
```

**This changed on 2026-10-01.** Until then `ClientSize`, `ClientRectangle` and the paint canvas were
device pixels and a custom control had to call `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`
itself. If you added such a call, **remove it** — the drawing is now scaled twice. Device pixels are
still reachable through the explicitly named `Scaled*` family (`ScaledWidth`, `ScaledBounds`, …),
`PaintEventArgs.Scaling` and `LogicalToDeviceUnits`.

One exception remains: **owner-draw events** (`DrawItem`, `DrawNode`, `DrawListViewItem`, the grid's
`CellPainting`, …) still hand over device-pixel `Bounds` with a device-pixel `Graphics`. The two agree
with each other but not with the rest of the control.

Test scaling assumptions under `MF_HEADLESS_SCALE=2` (see
[Automation]({{ '/automation/' | relative_url }})) — code that is right at scale 1 and wrong at any
other scale is the common bug.

### Trimming and NativeAOT

`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Avalonia` and
`Majorsilence.Forms.Headless` build with `IsAotCompatible`, so a new trim/AOT hazard fails the
Release build instead of quietly breaking a trimmed consumer, and
`tests/Majorsilence.Forms.AotSmoke` publishes a real NativeAOT binary in CI. The Uno, GTK 4,
WinForms, WPF and Telerik assemblies are **not** analysed — their toolkits are reflection-heavy and
out of scope for an AOT guarantee.

**Data binding is the one reflective corner.** `Control.DataBindings` finds properties and
`<Property>Changed` events by name at run time. The framework embeds its own `ILLink.Descriptors.xml`
rooting the bindable pairs of its own controls (`Text`/`TextChanged`, `Checked`, `SelectedIndex`,
`Value`), so the **control side needs nothing from you**. The **view-model side is still yours**:
root the properties you bind with a `TrimmerRootDescriptor` in the app project, or avoid the question
by wiring the view model in ordinary code — which is what the reflection-free
`Majorsilence.Forms.Mvvm` package (`Observe`, `BindText`, `BindCommand`) does. A missing or trimmed
member fails loudly at `DataBindings.Add` with the member's name; only a missing `Changed` event
degrades silently to one-way. Coverage beyond `Label`/`TextBox.Text` is not exercised by an automated
test, so check a published build before relying on it.

## Embedding in a host app

Everything above assumes Majorsilence.Forms owns the top-level window. The Avalonia, Uno, WinForms,
WPF and GTK 4 backends also support the *reverse* direction: an existing host app that treats
Majorsilence.Forms objects as if they were its own native ones — additively, without changing
anything about the usual `Form.Show()` flow.

**A Majorsilence control becomes a host control**, via `MajorsilenceFormsPresenter` (a real
`Avalonia.Controls.Canvas` / WinUI `Grid` / `System.Windows.Forms.Control` / WPF `Grid` / GTK
`DrawingArea`) and its extension methods. Drop the result into any native visual tree:

```csharp
Avalonia.Controls.Control            c = myMfControl.ToAvaloniaControl ();  // Majorsilence.Forms
Microsoft.UI.Xaml.FrameworkElement   c = myMfControl.ToUnoControl ();       // Majorsilence.Forms.Uno
System.Windows.Forms.Control         c = myMfControl.ToWinFormsControl ();  // Majorsilence.Forms.WinForms
System.Windows.FrameworkElement      c = myMfControl.ToWpfElement ();       // Majorsilence.Forms.Wpf
Gtk.Widget                           c = myMfControl.ToGtkWidget ();        // Majorsilence.Forms.Gtk4
```

The GTK 4 presenter *exposes* a `Widget` property rather than deriving from a GTK widget (gir.core's
GObject subclassing needs an extra integration package); everything else is the same shape.

**A Majorsilence `Form` becomes a host window.** A `Form`'s backend window is created eagerly in its
constructor, and on these backends that object already *is* (Avalonia, WinForms, WPF, GTK 4) or
*wraps* (Uno) a real native window, so these hand it straight back:

```csharp
Avalonia.Controls.Window  w = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window  w = myForm.ToUnoWindow ();
System.Windows.Forms.Form w = myForm.ToWinFormsForm ();
System.Windows.Window     w = myForm.ToWpfWindow ();
Gtk.Window                w = myForm.ToGtkWindow ();
```

The host owns showing it from there — assign it as the main window, set `Owner`, call
`Show()`/`ShowDialog(owner)`. Majorsilence's own `Load`/`Shown`/`Application.OpenForms` bookkeeping
still runs the first time the window becomes visible, whichever side triggered it.

**Owner and modal relationships differ by backend.** Avalonia, WinForms and GTK 4 give a genuine
OS-level modal relationship through their native `Owner`/`ShowDialog(owner)` (GTK: transient-for +
modal). Uno has no owner concept in this backend, so `ToUnoWindow()` returns an independent
top-level window; use `Form.ShowDialog(parent)` — Majorsilence's own modal loop, which does not
depend on native ownership — for modal behaviour under Uno.

Every direction is demonstrated by
[`EmbeddingAvalonia`]({{ site.github_url }}/tree/main/samples/EmbeddingAvalonia),
[`EmbeddingUno`]({{ site.github_url }}/tree/main/samples/EmbeddingUno),
[`EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) and
[`EmbeddingGtk4`]({{ site.github_url }}/tree/main/samples/EmbeddingGtk4); see
[Samples]({{ '/samples/' | relative_url }}).

## The Avalonia backend

The default, and what a new desktop app gets with zero configuration. On Windows/macOS/Linux the
window host *is* a real `Avalonia.Controls.Window`, which is why this is the only cross-platform
backend that implements `TryGetPlatformHandle` (see
[Native interop]({{ '/native-interop/' | relative_url }})) and why `ToAvaloniaWindow()` gives a host
app genuine OS-level owner/modal semantics.

It is not desktop-only. The project multi-targets:

| TFM | Built | Avalonia platform package |
|---|---|---|
| `net8.0`, `net10.0` | Always | `Avalonia.Desktop` + `Avalonia.Controls.WebView` |
| `net10.0-browser` | Always | `Avalonia.Browser` |
| `net10.0-android` | Opt-in: `-p:EnableAndroidTarget=true` (needs the `android` workload) | `Avalonia.Android` |
| `net10.0-ios` | Opt-in: `-p:EnableIOSTarget=true` (needs the `ios` workload, macOS only) | `Avalonia.iOS` |

The browser row is unconditional because wasm-tools is only needed to *publish*. Android and iOS are
opt-in because their workloads are needed just to compile that row, and the two gates are separate
because a machine commonly has one workload without the other.

### Single-view platforms (browser, Android, iOS)

None of the three has an OS window manager; each offers exactly one view per app/tab/screen. They
share one host where **every** Majorsilence.Forms window is a `Canvas` rather than an Avalonia
`Window`: the first non-popup form fills the viewport, and popups, menus and additional top-level
forms are absolutely positioned children of it. Startup is host-driven and takes a **factory**,
because the form must not exist before the backend is initialized:

```csharp
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());  // browser
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());             // from OnCreate
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());                 // from FinishedLaunching
```

**What doesn't work there**, mostly inherent rather than pending:

- **No window chrome.** `Topmost`, system decorations, `SetIcon`, `Min`/`MaximumSize`, `CanResize`,
  `ShowInTaskbar`, `WindowState` and move/resize drags are no-ops. `Title` is a no-op today too, but
  that one is pending work.
- **`ShowDialog` is not OS-modal** — it still *behaves* modally, because the parent-disable lives
  above the seam; a secondary window opens at the view's top-left. And the **blocking** `ShowDialog`
  does not work at all on any of the three — see [Browser threading](#browser-threading).
- **No WebView.** Compat controls that need one (`RadPdfViewer`, `RadRichTextEditor`) fall back to
  their plain-viewer paths. The browser has no native webview; Android and iOS do, so those two are
  deferred work rather than a hard limit.
- **Popup dismissal on losing focus to another app does not fire**; clicking elsewhere inside the
  app still dismisses popups.

**What does work there** (mobile parity):

- **On-screen keyboard.** Focusing a `TextBox` raises the soft keyboard and dismisses it on blur.
  `TextBoxBase.InputKind` (`Number`, `Email`, `Url`, `Phone`) picks the layout; masked and multiline
  boxes get the matching keyboard. Desktop backends ignore it.
- **Safe-area insets.** `Form.SafeAreaPadding` is applied automatically, so docked and anchored
  controls stay clear of the status bar, notch and home indicator; when the keyboard opens, the
  focused field is scrolled into view.
- **Lifecycle, back button, size classes.** `Application.Suspended`/`Resumed`,
  `WindowBase.BackRequested` (the template's `MainActivity` forwards the Android back button),
  `Form.SizeClass`/`SizeClassChanged`, touch scroll bars on Android, and the phone-style layout
  controls (`StackPanel`, `Card`, `RichListBox`, `NavigationHost`) in
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md).

**Maturity differs sharply across the three.** All three compile in CI, but the headless test suite
exercises the shared core, not a real head.

- **Browser** runs the full gallery — the [live demo]({{ '/gallery/' | relative_url }}) is it — and
  its modal and accessibility checks run in headless Chrome on every CI build. The path is still
  young.
- **Android** has had an initial real-device pass: the gallery boots, and tap hit-testing, render
  scaling and touch scroll/flick are confirmed on hardware. The on-screen keyboard, safe-area insets
  and rotation are unit-tested on Headless but not yet exercised on a device.
- **iOS** compiles, and CI launches it in a simulator as a smoke check, but nobody has run it
  interactively on a simulator or device; the `ios` job is still `continue-on-error`.

### Running in the browser (WebAssembly)

There is no separate WASM package — `Majorsilence.Forms.Avalonia`'s `net10.0-browser` row is built
on Avalonia 12's `Avalonia.Browser` platform (WebGL2/Emscripten, the same Skia renderer as desktop).
A minimal browser head references `Majorsilence.Forms.Avalonia` + `Avalonia.Browser` from a
`Microsoft.NET.Sdk.WebAssembly` project — see
[`samples/Gallery.Wasm`]({{ site.github_url }}/tree/main/samples/Gallery.Wasm), or scaffold one
with `dotnet new majorsilenceforms --IncludeWasm`.

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

Serve `out/wwwroot` with any static file server — `dotnet run` does not serve a WebAssembly SDK
project. CI publishes this bundle on every PR and attaches it to each release.

There is no real filesystem in the browser. `WasmFilesToIncludeInFileSystem`, the usual item for
preloading one, is silently ignored under `Microsoft.NET.Sdk.WebAssembly`, which is why the gallery's
own icons are still missing in the browser (and Android/iOS) builds. Ship such assets as
`EmbeddedResource`s instead.

### Browser threading

In the browser, .NET runs on the page's one JavaScript thread. A call that does not return also
stops the input, timers and painting that would have let it return — so a nested modal loop cannot
run, and the Avalonia backend reports `CanRunModalLoop = false` on `net10.0-browser`. **The same is
true on Android and iOS**, for a different reason: Avalonia's dispatcher cannot push a nested frame
there (measured on an Android 15 emulator and an iPhone 17 Pro simulator).

Every blocking modal entry point checks that flag **before showing anything** and throws
`PlatformNotSupportedException` naming its async twin, so a refused call leaves no dialog open and
no owner disabled. Every modal API has an awaitable form, and each works on every backend:

| Blocking | Awaitable |
|---|---|
| `Form.ShowDialog (…)` | `Form.ShowDialogAsync (…)` — the same owner overloads |
| `MessageBox.Show (…)` | `MessageBox.ShowAsync (…)` |
| `OpenFileDialog`/`SaveFileDialog`/`FolderBrowserDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `TaskDialog.ShowDialog (…)` | `TaskDialog.ShowDialogAsync (…)` |
| `ColorDialog`/`FontDialog`/`PrintPreviewDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `CommonDialog.ShowDialog` (your own subclass) | `CommonDialog.ShowDialogAsync`; override `RunDialogAsync` |
| `VbInteraction.MsgBox`/`InputBox` | `VbInteraction.MsgBoxAsync`/`InputBoxAsync` |
| `RadMessageBox.Show (…)` (Telerik compat) | `RadMessageBox.ShowAsync (…)` |

The usual shape is an `async void` event handler — the one place `async void` is the idiom:

```csharp
private async void deleteButton_Click (object sender, EventArgs e)
{
    if (await MessageBox.ShowAsync (this, "Delete the selected rows?", "Orders", MessageBoxButtons.YesNo) != DialogResult.Yes)
        return;

    using var options = new DeleteOptionsForm ();
    if (await options.ShowDialogAsync (this) == DialogResult.OK)
        await DeleteAsync (options.Mode);
}
```

The same rule covers `task.Result`, `.Wait ()`, `GetAwaiter ().GetResult ()` and `Thread.Sleep` —
use `await` and `await Task.Delay`.

**The analyzer.** The core `Majorsilence.Forms` package carries a Roslyn analyzer with code fixes:
`MFB001` a blocking modal call (naming its awaitable twin), `MFB002` a synchronous wait on a task,
`MFB003` `Thread.Sleep`. It is silent unless the code is browser code — a `net*-browser` TFM, a
library declaring `<SupportedPlatform Include="browser" />`, or an explicit opt-in for a shared UI
library that a browser head references:

```ini
# .editorconfig next to the shared UI library
[*.cs]
majorsilence_forms.browser_target = true
```

The analyzer is browser-only; a blocking call in Android or iOS code is not flagged at build time
and fails at run time with the same message. If JSPI or the CoreCLR browser runtime ever lets a
nested loop run, `CanRunModalLoop` is the one switch to turn back on.

### Accessibility DOM (browser)

A single canvas is invisible to a screen reader, find-in-page or a DOM test tool. On the browser
target the Avalonia backend therefore keeps a **DOM mirror of the open forms next to the canvas**:
one transparent, click-through element per control carrying its ARIA role, name, state and bounds,
built from the framework's own automation tree — the same tree the Windows UI Automation bridge and
the WebDriver server read, so anything a test can find, a screen reader can find too. It re-syncs
after paint at most every 100 ms and sends only what changed; popups are mirrored inside the window
they opened for; two live regions announce dialogs, message boxes, status text and labels with a
`LiveSetting`. Test tools locate by role and name or `[data-mf-automation-id=…]` and click at the
element's bounding box, since input still belongs to the canvas.

Honest caveat: it was verified by reading the DOM and recording the live regions in headless Chrome.
**Nothing has been tried with a real screen reader yet.** Opt out with the
`Majorsilence.Forms.Browser.DisableAccessibilityDom` AppContext switch.

## The Headless backend

The simplest possible backend and the reference implementation to copy: a work-queue message loop,
an in-memory clipboard, a virtual screen, and offscreen rendering to an `SKSurface`.
`HeadlessRenderer.Use ()` installs it and makes the calling thread the UI thread;
`CapturePng (window, w, h)` renders to PNG; `Click`/`MouseDown`/`KeyDown`/`TextInput` helpers drive
the same neutral `Handle*` path a real backend uses. It needs no display, so it powers the unit
tests and renders the ControlGallery for CI and pixel-diff checks:

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

Animation is deterministic here: `control.RequestAnimationFrame (…)` is driven by a manual clock,
`HeadlessRenderer.AnimationClock.Step (n)`, instead of a display timer. See
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md).

## The Uno backend

Implements the seam on Uno Platform's Skia target: `UnoPlatformBackend` drives the `DispatcherQueue`
and WinUI clipboard, `UnoWindowHost` hosts a `SKXamlCanvas` and translates pointer/key/character
events into the neutral input path. It needs a Uno *app head* — see
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — and has been verified
launching and rendering the full gallery on macOS.

Window drag/resize for Majorsilence.Forms' self-drawn chrome is declarative rather than imperative on
this backend: resize comes for free from a borderless presenter that keeps the OS resize margins, and
title-bar drag uses WinUI's caption-region API (`SetCaptionRegions`) on the Windows desktop head. On
macOS the native decorations own drag/resize; on X11 title-bar drag is unavailable and
`UseSystemDecorations` is the fallback.

## The GTK 4 backend

`Majorsilence.Forms.Gtk4` implements the seam on GTK 4 through the
[gir.core](https://github.com/gircore/gir.core) bindings. It is a real-window desktop backend for
Linux first (Wayland/X11), and also compiles and runs on Windows/macOS wherever the GTK 4 runtime is
installed. Unlike Avalonia it is selected explicitly:

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // installs Gtk4PlatformBackend
Application.Run (new MainForm ());      // GLib main loop
```

**What works:** a real `Gtk.Window` per top-level form and borderless windows for popups; Skia
rendered into a Cairo image surface each paint; mouse, keyboard and typed text through GTK event
controllers; GLib timers behind `Timer`; clipboard text and multi-monitor `Screen`; custom-chrome
move/resize drags via `Gdk.Toplevel.BeginMove/BeginResize`; `ShowDialog` with a genuine
transient-for/modal relationship; embedding in both directions (`ToGtkWidget()`, `ToGtkWindow()`);
and `NativeControlHost` — a real `Gtk.Widget` overlaid inside a Majorsilence scene. GTK 4 composites
every widget into one render tree, so **there is no airspace problem** here, unlike
Avalonia/Uno/WinForms. `WebBrowser`, `RadPdfViewer` and `RadRichTextEditor` are backed by
**WebKitGTK 6.0** (navigation events, `ExecuteScriptAsync`, a JS-to-host message bridge); the native
library is only loaded when a `WebBrowser` is created, and `IsWebViewFunctional` is false without it.

Verified on Wayland: the window shows, the full ControlGallery renders, timers fire, repaints follow
input, the embedding sample presents, and the webview round-trips a script message.

**What doesn't work**, mostly GTK 4 API removals rather than pending work: no screen-position
control (`Form.Location` is a hint the window manager may ignore; `Topmost`, `ShowInTaskbar` and
`MaximumSize` round-trip but are not enforced); `SetIcon(byte[])` is a no-op (GTK 4 icons are themed
names); file and folder pickers return empty, so the common-dialog fallbacks take over as on
Headless; fractional scaling uses GTK's integer scale factor (1 or 2); and the backend is not
AOT-analysed. It needs a display server — use Headless for offscreen rendering.

**Install.** `libgtk-4-1` on Debian/Ubuntu, `gtk4` on Fedora/Arch, `brew install gtk4` on macOS,
the GTK runtime on Windows; for the webview add WebKitGTK 6.0 (`libwebkitgtk-6.0-4` on
Debian/Ubuntu). Run [`samples/Gallery.Gtk4`]({{ site.github_url }}/tree/main/samples/Gallery.Gtk4)
(`MF_GTK4_WEBVIEW=1` for the webview form). See also
[WinForms on Linux]({{ '/winforms-on-linux/' | relative_url }}).

## The Terminal backend

`Majorsilence.Forms.Terminal` runs a form in a terminal. The terminal is the window, so this is a
single-view host like a phone: the form fills the screen, draws no title bar or caption buttons, and
its `Text` goes to the terminal's own title. The app provides its own way out (`Close ()`);
**Ctrl+C always exits** and is never delivered to the app. Popups composite over the form; a dialog
replaces the screen while shown.

```csharp
TerminalApplication.Use ();             // or Use (new TerminalOptions { … })
Application.Run (new MainForm ());
```

**Output modes.** The usual Skia pipeline renders offscreen and the picture is shown one of four ways:

| Mode | Resolution | When |
|---|---|---|
| Kitty graphics | the terminal's real pixels | kitty, WezTerm, Ghostty |
| Sixel | real pixels, 256 colours | foot, mlterm, iTerm2, Contour, xterm `-ti vt340` |
| Blocks (default without graphics) | 2×4 pixels per cell from Unicode quadrant glyphs | everything else, and always inside tmux/screen |
| Half-block | 1×2 pixels per cell | pinned only, for a font without the quadrant glyphs |

Blocks mode makes a 300×80 terminal a 600×320 screen, readable at scale 1. Only changed cells,
regions or 16×8-cell tiles are re-sent, so a caret blink is one tile.

**Detection and pinning.** At startup the host asks the terminal what it supports (Kitty graphics,
Kitty keyboard and device attributes, which also lists Sixel) instead of trusting `TERM`; truecolor
is confirmed the same way. Pin a mode with `MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` or
`TerminalOptions.GraphicsMode`; a pinned mode is never overridden. `MF_TERMINAL_SIXEL_MAX=WxH` tells
the host about a raised xterm `maxGraphicsSize` (xterm cuts Sixel images off at 1000×1000 by default,
so the form is sized to fit), and `MF_TERMINAL_TRACE=/path` logs the raw replies, the mode chosen and
every decoded input event.

**Input.** Mouse (clicks, drags, hover, wheel) and keyboard (text, arrows, navigation keys, F1–F12,
modifiers) are decoded from the byte stream; with Kitty graphics the mouse is pixel-exact. Where the
terminal offers the Kitty keyboard protocol it is switched on, giving real key releases, exact
modifiers and correct non-US layouts. A form starts with nothing focused, so press Tab once before
using the arrow keys.

**Verified** in xterm 407 (Sixel with `-ti vt340`; Blocks/truecolor by default) and WezTerm (Kitty
graphics, Sixel when pinned). **Not yet verified:** kitty, Ghostty, foot, iTerm2, Windows Terminal,
macOS Terminal, tmux, and Windows console I/O (written against the VT modes, not exercised). Native
file pickers, `NativeControlHost` and web views have no terminal equivalent. Run
[`samples/Gallery.Terminal`]({{ site.github_url }}/tree/main/samples/Gallery.Terminal) in a
truecolor terminal.

## The WinForms and WPF backends (migration)

These two exist for one purpose: **incremental migration on Windows**. A WinForms or WPF app keeps
its shell, menus and windows on the real toolkit while individual screens or controls move to
Majorsilence.Forms — each ported piece drops back in as a standard `System.Windows.Forms.Control` or
WPF `FrameworkElement`. A WinForms *control library* can port its internals while still shipping
WinForms controls to its consumers. When everything is ported, swap the package for
`Majorsilence.Forms.Avalonia` and the same code goes cross-platform; nothing above the seam changes.
Both target **`net48`** as well as `net8.0-windows`/`net10.0-windows`, so a .NET Framework 4.8 app
can start migrating without first moving to modern .NET.

**`Majorsilence.Forms.WinForms`** hosts real `System.Windows.Forms` windows on the classic Win32
pump and presents Skia through a GDI-backed control. WinForms input is already in device pixels and
its `Keys`/`MouseButtons` enums are numerically identical to Majorsilence.Forms', so translation is a
cast. Popups are borderless tool windows; `TryGetPlatformHandle` returns the real HWND. The presenter
installs the backend automatically when none is configured, so the app's existing `Application.Run`
services everything:

```csharp
using Majorsilence.Forms.WinForms;

var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// or hand a whole MF Form to WinForms as a native-modal dialog
System.Windows.Forms.Form native = myMfForm.ToWinFormsForm ();
native.ShowDialog (ownerWinFormsForm);
```

Verified interactively on Windows via `samples/EmbeddingWinForms`: rendering, mouse and keyboard
input, combo-dropdown popups, `NativeControlHost` overlays and `ToWinFormsForm()` modal dialogs. Not
implemented: gestures (WinForms has no gesture API) and `IWebViewFactory` (webview-dependent compat
controls fall back). Off Windows the modern-.NET rows build as an empty placeholder so a
cross-platform solution still compiles everywhere.

**`Majorsilence.Forms.Wpf`** is the same shape on a real WPF `Window` and the `Dispatcher` loop, with
Skia presented through a `WriteableBitmap`, `Microsoft.Win32` file dialogs and
`System.Windows.Clipboard`. `NotifyIcon` uses the real `System.Windows.Forms.NotifyIcon`, since WPF
has none. Select it explicitly, or embed:

```csharp
Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();   // MF owns the app
Application.Run (new MainForm ());

myWpfGrid.Children.Add (myMfControl.ToWpfElement ());                  // or embed in a WPF app
```

[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf) runs the full gallery
on it.

**Relationship to `WindowsFormsInterop`.** Both exist for incremental migration and solve different
layers of it. `Majorsilence.Forms.WindowsFormsInterop` bridges **whole forms** between a WinForms app
and Majorsilence.Forms running on the Avalonia backend, sharing one message pump. The WinForms
backend removes Avalonia from the picture and works at **control** granularity. They can coexist —
the presenter leaves an already-configured backend alone. For a control library whose public API is
typed to WinForms there is a third option, the `Majorsilence.Forms.WinFormsShims.Compat` source
generator; see the [Migration guide]({{ '/migration/' | relative_url }}).

## Touch gestures

`Control` has purely-additive events for touch and pen input: `LongPress`, `Pinch` (pinch-to-zoom
and two-finger rotate together), `Swipe`, and `ScrollGesture` — continuous drag-to-pan that keeps
firing with a decaying delta through the platform's momentum phase after the contact lifts, which is
the entire flick-scrolling implementation. None of them fire for the mouse. `ScrollableControl`
applies `ScrollGesture` to `AutoScrollPosition`, `ListBox` and `TreeView` pan their own scrollbar the
same way, and `LongPress` opens `ContextMenu` by default. Gesture points are converted to logical
units at the seam, so hit-testing is right at any scaling.

The **Avalonia** and **Uno** backends implement gestures, whether Majorsilence.Forms owns the window
or is embedded. The two gesture models differ underneath — Avalonia attaches dedicated recognizers
that are self-gated to touch/pen; WinUI/Uno has one unified manipulation stream that is not, reports
velocity in different units, and has no native swipe — so the Uno backend filters mouse pointers,
converts velocity and synthesizes `Swipe`. The judgement calls that needs live in `GestureHeuristics`
in the core and are unit-tested, since neither can be verified without multi-touch hardware. The
other backends raise no gesture events.

## Hosting native elements

`INativeControlHostBackend` is an optional capability implemented by the **Avalonia, Uno, WinForms,
WPF and GTK 4** backends and absent on Headless and Terminal. It lets a `NativeControlHost` control
reserve a rectangle that the backend fills with a real toolkit element — an Avalonia `Control`, a
Uno `UIElement`, a `System.Windows.Forms.Control`, a `Gtk.Widget` — overlaid on the Skia surface and
kept aligned to the placeholder's bounds, clip and visibility. GTK 4 is the exception to the usual
airspace limits: it composites every widget into one render tree, so a hosted widget clips and blends
correctly.

`IWebViewFactory` is the sibling capability behind `WebBrowser`: WebView2 / WKWebView / WebKitGTK on
Avalonia desktop, WebKitGTK on GTK 4, none on Headless, browser, Terminal or the WinForms backend.

See [Native interop]({{ '/native-interop/' | relative_url }}) for how to use it, its airspace
limits, why native handles can't be faked, and why video is usually better done with frame callbacks
drawn into Skia than with a hosted native surface.

## Mobile capabilities

A handful of further optional seams exist mainly for the Avalonia backend's Android and iOS rows.
Everything degrades to a no-op elsewhere; check the `IsSupported` flags.

- **In-process audio** (`IAudioBackend`). `Media.SoundPlayer` and `Media.SystemSounds` play through
  the backend on Android and iOS and fall back to `Media.NativeAudio` (spawning the OS playback
  utility) on desktop. `Media.AudioPlayer` — volume, `AudioUsage` (e.g. `Alarm`), a real `Completed`
  event — has no desktop fallback and is real only where `AudioPlayer.IsSupported` says so.
- **Haptics.** `Haptics.Tap`/`Impact`/`Vibrate`; `Haptics.IsSupported` is true only on Android and
  iOS. The `VIBRATE` permission merges into the consuming app's manifest automatically.
- **Local notifications.** `LocalNotifications.RegisterChannel`/`Show`/`Tapped`, Android only so far;
  the host's `MainActivity` registers itself and forwards intents and permission results.
- **Keep screen awake.** `Application.KeepScreenAwake` is real on every row but browser — Android,
  iOS, Windows (`SetThreadExecutionState`), macOS (IOKit power assertion) and Linux
  (`systemd-inhibit`). Headless implements it as a plain settable fake for view-model tests.
- **Lifecycle and back button.** `Application.Suspended`/`Resumed` and `WindowBase.BackRequested`
  are raised by the single-view hosts; every other backend already fires `Activated`/`Deactivate`
  from its real window and has nothing to suspend.

Capabilities that have nothing to do with which UI backend is active — `SecureStorage`, `Speech`
(text-to-speech), `Launcher.OpenAsync`, `FileSystem.OpenAppPackageFileAsync` — live in the separate
**`Majorsilence.Forms.Essentials`** package, which picks its own per-platform implementation and does
not go through `Platform.Backend` at all. Per-platform detail and verification status for all of
these is in [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md).

## Adding another backend

A new backend is a new assembly referencing `Majorsilence.Forms` (core) plus the target toolkit,
implementing `IPlatformBackend` and `IWindowBackend` — mirror Headless for the shape: drive the
dispatcher and lifecycle in `IPlatformBackend`, present a Skia surface (calling `owner.RenderFrame`)
and translate input (`owner.Handle*`) in `IWindowBackend`, and add an `[InternalsVisibleTo]` entry in
the core project. Optional capabilities (`IWebViewFactory`, `INativeControlHostBackend`,
`IModalLoopSupport`, …) can come later or never.

See [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) in the repository for the
full interface listing and the per-backend implementation notes this page condenses.
