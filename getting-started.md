---
layout: docs
title: Getting Started
subtitle: Scaffold your first Majorsilence.Forms app in a few minutes.
seo_title: "Getting Started — Build a Cross-Platform WinForms App"
description: >-
  Scaffold a cross-platform WinForms app in minutes with the dotnet template, or add
  Majorsilence.Forms to a plain .NET project. Windows, macOS and Linux.
keywords:
  - winforms cross platform tutorial
  - majorsilence.forms getting started
  - dotnet new winforms cross platform
  - cross platform winforms hello world
priority: "0.8"
---

## From a template

The easiest way to start a Majorsilence.Forms application is the `dotnet` template, published on
NuGet as `Majorsilence.Forms.Templates`.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

This scaffolds a **solution with two projects** and runs a basic "Hello World" `MainForm`:

- `MajorsilenceFormsApp.Shared` — a UI library holding `MainForm` and `MainForm.Designer.cs`. All
  of your forms go here, so every head below shares them.
- `MajorsilenceFormsApp` — the desktop head: a `WinExe` on the Avalonia backend for Windows, macOS
  and Linux.

`dotnet new majorsilenceforms -n MyApp` (optionally `-o <dir>`) scaffolds into a named
project and namespace.

### Mobile and browser heads

Add head projects for Avalonia's other targets with switches — each is a thin head over the same
shared UI library:

```
dotnet new majorsilenceforms --IncludeAndroid --IncludeWasm --IncludeiOS
```

| Switch | Adds | Needs |
|---|---|---|
| `--IncludeAndroid` | `MajorsilenceFormsApp.Android` (`net10.0-android`) | `dotnet workload install android` |
| `--IncludeWasm` | `MajorsilenceFormsApp.Wasm` (`net10.0-browser`) | `dotnet workload install wasm-tools` (for `publish`) |
| `--IncludeiOS` | `MajorsilenceFormsApp.iOS` (`net10.0-ios`) | a Mac with `dotnet workload install ios` |

All default to off, so a plain `dotnet new majorsilenceforms` followed by `dotnet build` works with
no extra workload. The iOS head is experimental. `--msformsVersion` and `--avaloniaVersion`
override the package versions the scaffold pins; see the
[template README]({{ site.github_url }}/blob/main/tools/Majorsilence.Forms.Templates/README.md).

There isn't standalone API documentation yet, but the surface should be familiar to anyone with
Windows Forms experience. The best reference is the source of the sample applications:

- [`ControlGallery`]({{ site.github_url }}/tree/main/samples/ControlGallery) — every built-in control, live.
- [`Explorer`]({{ site.github_url }}/tree/main/samples/Explorer) — a Windows Explorer clone.

See [Samples]({{ '/samples/' | relative_url }}) for the full list and how to run each one.

## From scratch

To turn a regular .NET console application into a Majorsilence.Forms application, make the
following changes.

### Project file

```xml
<PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
</PropertyGroup>
```

Add a reference to `Majorsilence.Forms` and to a backend — the core package references no windowing
toolkit, so the backend is what actually puts a window on screen:

```xml
<ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
</ItemGroup>
```

The core package multi-targets `net8.0`, `net10.0` and `netstandard2.0`. No `-windows` suffix is
needed for any cross-platform backend.

### An empty form

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}
```

### Program.cs

Call `Application.Run()` with an instance of your form:

```csharp
static void Main (string [] args)
{
    Application.Run (new MainForm ());
}
```

Your application is now ready to run — on the default Avalonia backend, that's Windows, macOS, and
Linux with no further configuration.

### Selecting another backend

Avalonia is the default: when nothing sets `Platform.Backend`, the framework loads
`Majorsilence.Forms.Avalonia` if it is referenced. To run the same form on a different host,
reference that backend's package instead and select it before `Application.Run`:

```csharp
// GTK 4 — a real Gtk.Window, Linux first (needs the GTK 4 runtime, e.g. libgtk-4-1)
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();
Application.Run (new MainForm ());

// Terminal — the form fills the terminal; Kitty graphics, Sixel, or Unicode block elements
Majorsilence.Forms.Terminal.TerminalApplication.Use ();
Application.Run (new MainForm ());

// Headless — offscreen rendering for tests and CI
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();
```

On Windows, two more backends exist for migration rather than for new apps: `Majorsilence.Forms.WinForms`
and `Majorsilence.Forms.Wpf` host Majorsilence.Forms controls inside an existing WinForms or WPF
application (`myControl.ToWinFormsControl()`, `myControl.ToWpfElement()`), including on .NET
Framework 4.8, so you can port one control at a time and switch to Avalonia or Uno when the last
piece is done. Uno Platform runs through its own app head. See
[Platform backends]({{ '/backends/' | relative_url }}) for all seven, what each one can and cannot
do, and how to add your own.

## Custom-painted controls draw in logical units

A control's `OnPaint` and `OnPaintBackground` overrides, and its `Paint` handlers, draw in **logical
units** — the same units as everything else in the framework: `Left`, `Top`, `Width`, `Height`,
`ClientRectangle`, `ClientSize` and `MouseEventArgs.X`/`Y`. The framework scales the canvas to the
display, so ordinary WinForms drawing code is the right size on a HiDPI desktop or on any phone
(Android reports a `Scaling` of roughly 2.6–2.75) with no changes:

```csharp
protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    e.Graphics.DrawRectangle (Pens.Gray, 0, 0, Width - 1, Height - 1);   // frames the control
    e.Graphics.FillRectangle (Brushes.LimeGreen, 0, 0, 10, 10);         // a 10x10 logical square
}
```

The same holds for `e.ClipRectangle`, and for `e.Canvas` if you draw with SkiaSharp directly.
`PaintEventArgs.Scaling` is still there for code that wants to place something on an exact device
pixel, as are `ScaledWidth`, `ScaledBounds` and `LogicalToDeviceUnits`.
[`GameOfLifePanel.cs`]({{ site.github_url }}/blob/main/samples/ControlGallery/Panels/GameOfLifePanel.cs)
in the control gallery is a complete custom control.

> **Upgrading from a release before 2026-10-01?** The paint canvas used to be in device pixels, and
> a custom control had to call `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` itself. Remove that
> call if you added it — the drawing would now be scaled twice. Owner-draw events (`DrawItem`,
> `DrawNode`, `CellPainting`) still hand you device-pixel bounds. Run your tests with
> `MF_HEADLESS_SCALE=2` to catch anything that slipped.

Hit-testing is consistent for free: `MouseEventArgs.X`/`Y` arrive in the same logical units as
`Width`/`Height` and the paint canvas, so geometry built once serves both.

## Where to go next

- **[Training guide]({{ '/training/' | relative_url }})** — the structured curriculum for a whole team:
  the mental model, the compatibility contract, migration, backends, testing, and the CI gates and
  rollout plan that go with them.
- **[Platform backends]({{ '/backends/' | relative_url }})** — the host seam, all seven backends,
  running in the browser, embedding Majorsilence.Forms inside an existing Avalonia, Uno, GTK 4,
  WinForms or WPF app, and touch gestures.
- **[Theming with CSS]({{ site.github_url }}/blob/main/docs/theming.md)** — the small CSS subset
  that restyles every control, `Theme.LoadFromCssFile`, and the live
  [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) sample.
- **[MVVM helpers]({{ site.github_url }}/blob/main/docs/mvvm.md)** — `Observe`, `BindText`,
  `BindCommand` and `BindingScope` from `Majorsilence.Forms.Mvvm`: reflection-free, trim- and
  AOT-safe, and compatible with CommunityToolkit.Mvvm.
- **[Laying out a phone-style screen]({{ site.github_url }}/blob/main/docs/mobile-layout.md)** —
  wrapping text, `Card`, `RichListBox`, `StackPanel` and `NavigationHost` for Android and iOS heads.
- **[Animation]({{ site.github_url }}/blob/main/docs/animation.md)** — `RequestAnimationFrame`,
  tweens and easing, and the manual clock for headless tests.
- **[Automation & UI testing]({{ '/automation/' | relative_url }})** — write UI tests that run headlessly
  in CI, drive the app from Selenium, FlaUI or an AI assistant through the MCP server, and light up
  screen readers on Windows.
- **[Native interop]({{ '/native-interop/' | relative_url }})** — hosting native content (video, maps,
  browser engines) and why `Control.Handle` isn't an `HWND`.

## Migrating an existing WinForms app

Bringing over an existing codebase rather than starting fresh? Two documents cover it:

- **[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)** — how the
  `majorsilence-migrate` CLI (`dotnet tool install -g Majorsilence.Forms.Migrator`) rewrites a
  WinForms solution onto Majorsilence.Forms, and how to read its output.
- **[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)** — what's
  fully implemented, what's approximated, and what's deliberately out of scope, once your code
  compiles.

> Beta stage: the API is stabilizing and not every WinForms corner is covered yet. It's a good fit
> for new cross-platform LOB apps and for migrating real apps today — just pin your version.
