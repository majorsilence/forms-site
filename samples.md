---
layout: docs
title: Samples
subtitle: Real applications built with Majorsilence.Forms, in the repository today.
seo_title: "Cross-Platform WinForms Samples & Demo Apps"
description: >-
  Real cross-platform WinForms apps you can run: a Windows Explorer clone, an Outlook clone, a
  client/server point-of-sale app, a live CSS theme studio, and the full control gallery on desktop,
  GTK 4, browser, mobile and even in a terminal.
keywords:
  - winforms sample apps
  - cross platform winforms examples
  - c# winforms demo linux macos
  - winforms control gallery
  - winforms theme studio css
  - winforms point of sale sample
  - winforms gtk 4
  - winforms terminal ui
priority: "0.8"
---

Every sample lives under [`samples/`]({{ site.github_url }}/tree/main/samples) in the repository.
Unless noted otherwise, each one runs with `dotnet run --project samples/<Name>` and needs only the
.NET 10 SDK.

| Sample | What it shows | Platforms |
|---|---|---|
| [`ControlGallery`](#controlgallery) | Every built-in control (a library — see the heads below) | — |
| [`Gallery.Avalonia`](#galleryavalonia) | The gallery on the default backend, incl. headless rendering | Windows, macOS, Linux |
| [`Gallery.Uno`](#galleryuno) | The same gallery on the Uno backend | Desktop (verified on macOS) |
| [`Gallery.Gtk4`](#gallerygtk4) | The same gallery on the GTK 4 backend (gir.core) | Desktop with GTK 4 (verified on Wayland) |
| [`Gallery.Wasm`](#gallerywasm) | The same gallery in the browser | WebAssembly |
| [`Gallery.Android`](#galleryandroid) | The same gallery on Android | Android |
| [`Gallery.iOS`](#galleryios) | The same gallery on iOS | iOS |
| [`Gallery.Terminal`](#galleryterminal) | The same gallery in a terminal | Console / ANSI terminals |
| [`Gallery.Wpf`](#gallerywpf) | The same gallery on the WPF backend | Windows |
| [`Explorer`](#explorer) | A Windows Explorer clone | Windows, macOS, Linux |
| [`Outlaw`](#outlaw) | An Outlook clone | Windows, macOS, Linux |
| [`PointOfSale`](#pointofsale) | A full client/server LOB app | Windows, macOS, Linux |
| [`ThemeStudio`](#themestudio) | Live CSS theme editor and preview | Windows, macOS, Linux |
| [`ThemeStudio.WinForms`](#themestudiowinforms) | The same Studio against real `System.Windows.Forms` controls | Windows |
| [`EmbeddingAvalonia` / `EmbeddingUno` / `EmbeddingWinForms` / `EmbeddingGtk4`](#embedding) | Majorsilence.Forms hosted *inside* a native app | Desktop (WinForms: Windows only; Gtk4: needs GTK 4) |
| [`WinFormsInterop`](#winformsinterop) | Bi-directional `System.Windows.Forms` interop | Windows |
| [`WinFormsCompatDemo`](#winformscompatdemo) | Source-generated `System.Windows.Forms` namespace, no real WinForms assembly | Windows, macOS, Linux |
| [`AutomationTarget`](#automationtarget) | An app that exposes its own automation endpoint | Windows, macOS, Linux |

You don't have to build any of the gallery heads yourself to try them. CI publishes the browser bundle
(`gallery-wasm`), a sideloadable Android APK + AAB (`gallery-android`, signed with the .NET Android
debug key — fine for sideloading, not the Play Store), a zipped iOS-simulator `.app` (`gallery-ios`;
there is no signed device `.ipa`) and self-contained ThemeStudio binaries for Windows, Linux and macOS,
and attaches all of them to each [GitHub Release]({{ site.github_url }}/releases).

## ControlGallery
{:#controlgallery}

Every built-in control, live, one demo panel per control. `ControlGallery` itself is a
backend-agnostic **library** — the shared `MainForm` and demo panels — that references no backend, so
each backend gets a thin app head that hosts it without dragging the other backends' dependencies
into the process. Run one of the `Gallery.*` heads below.

## Gallery.Avalonia
{:#galleryavalonia}

The desktop head, on the default (Avalonia) backend:

```
dotnet run --project samples/Gallery.Avalonia
```

It also renders headlessly, useful for CI and pixel-diff checks:

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

## Gallery.Uno
{:#galleryuno}

The same control gallery running on the **Uno** backend — desktop, iOS, Android, and WebAssembly reach.

```
dotnet run --project samples/Gallery.Uno
```

Needs a windowing session, so it isn't part of the headless CI build; its Uno packages restore from
nuget.org via the sample's own `nuget.config`. Verified launching and rendering the full gallery on
macOS.

## Gallery.Gtk4
{:#gallerygtk4}

The same gallery on the **GTK 4** backend (gir.core) — a real `Gtk.Window`, Linux-first.

```
dotnet run --project samples/Gallery.Gtk4                    # full ControlGallery
MF_GTK4_DEMO=1 dotnet run --project samples/Gallery.Gtk4     # tiny render + input smoke form
MF_GTK4_WEBVIEW=1 dotnet run --project samples/Gallery.Gtk4  # a WebBrowser on WebKitGTK 6.0
```

Needs a display session (X11/Wayland) and the GTK 4 native libraries (the webview form additionally
needs `libwebkitgtk-6.0`), so it isn't part of the headless CI build. Its `GirCore.*` packages restore
from nuget.org via the sample's own `nuget.config`. `MF_GTK4_SELFTEST=1` runs a non-interactive check
and exits. Verified launching and rendering the full gallery on Wayland. See
[Platform backends]({{ '/backends/' | relative_url }}) for what the GTK 4 backend does and doesn't do yet.

## Gallery.Wasm
{:#gallerywasm}

The same control gallery again, this time running in the browser on the Avalonia backend's
`net10.0-browser` target — **[try it live]({{ '/gallery/' | relative_url }})**, no install required.
It's the real framework compiled to WebAssembly, so first load pulls down the .NET runtime.

To build it yourself, you need the wasm-tools workload once:

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

Then serve `out/wwwroot` with any static file server and open `index.html` — WebAssembly SDK
projects aren't served by `dotnet run` the way a normal exe is. Or skip the toolchain: the `gallery-wasm`
bundle CI builds on every PR is attached to each GitHub Release. See
[Platform backends]({{ '/backends/' | relative_url }}#running-in-the-browser-webassembly)
for build details and current limitations.

> **Known gap:** the gallery's icons don't render in the browser (nor on Android or iOS) — the
> `WasmFilesToIncludeInFileSystem` item meant to preload them is silently ignored by the WebAssembly
> SDK, so `Bitmap(string)` degrades to a 1×1 placeholder. The app boots cleanly with invisible icons.

The browser head also carries the **browser-head checks**: open the published bundle with
`?check=<name>` and the page runs one check instead of the gallery — the blocking modal calls (which
throw on the browser, naming their async twin), their awaitable forms, an accessibility-DOM check and
four rendering checks — writing `MFCHECK` lines to the console. `tools/modal-check.mjs` runs them all
in headless Chrome and CI runs it with `--expect` in the `wasm` job; the same form is linked into the
Android and iOS heads, each with its own `tools/modal-check.sh`. The names, environment variables and
expected results are all in
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md#gallerywasm) in the repository.

## Gallery.Android (Android-only, work in progress)
{:#galleryandroid}

The same `ControlGallery` `MainForm` again, on the Avalonia backend's Android target, hosted by a
single Activity. Needs the `android` workload:

```
dotnet workload install android
dotnet build samples/Gallery.Android -t:Run
```

Once the workload is installed, `Directory.Build.props` detects it and switches this project from its
stub build to the real `net10.0-android` head automatically — so a plain `dotnet build` / `dotnet test`
at the repo root never needs the workload, and Visual Studio just works with F5 against an emulator.
Pass `-p:EnableAndroidTarget=true` to force it; that one is ungated, so a missing workload fails the
build rather than silently reverting to the stub.

> Android support is early. It has had an initial real-device pass — the gallery boots (an
> AppCompat-theme startup crash was found and fixed there), and tap hit-testing, render scaling and
> touch scroll/flick are confirmed working on hardware — but the on-screen keyboard, safe-area insets,
> rotation and full control coverage have not had the same testing as the desktop and browser backends.
> Expect rough edges.

CI publishes a sideloadable APK + AAB on every PR (artifact `gallery-android`) and attaches them to
each GitHub Release. Android shares the browser's single-view host, so the same window-chrome and
WebView limitations apply — see [Platform backends]({{ '/backends/' | relative_url }}).

## Gallery.iOS (iOS-only, unverified)
{:#galleryios}

The iOS equivalent, hosted by a single `UIViewController`. Needs a Mac with the `ios` workload:

```
dotnet workload install ios
dotnet build samples/Gallery.iOS -t:Run
```

As with `Gallery.Android`, `Directory.Build.props` switches this from a stub to the real `net10.0-ios`
head automatically once a mobile workload is present — but only on macOS, since the `ios` workload
exists nowhere else. Force it with `-p:EnableIOSTarget=true`; prefer that over the `EnableMobileHeads`
umbrella, which on a Mac without the `android` workload would also ask for the `net10.0-android` row
and fail.

> iOS is the least-proven backend: it was written from Avalonia.iOS's API surface and standard
> .NET-for-iOS conventions. CI's `ios` job (on `macos-latest`) now compiles the real head and launches
> it in a simulator as a smoke check — but the job is still `continue-on-error`, and nobody has run it
> interactively on a device. Treat rough edges as expected, not as a regression.

CI publishes a zipped iOS-simulator `.app` on every PR when the build succeeds (artifact `gallery-ios`)
and attaches it to each GitHub Release. There is no signed device `.ipa` — that needs an Apple
distribution certificate.

## Gallery.Terminal
{:#galleryterminal}

The same gallery on the **Terminal** backend: the form fills the terminal, with no title bar, the way
it would fill a phone screen. Skia renders offscreen and is shown as Kitty graphics or Sixel at the
terminal's real pixel resolution where the terminal offers them, else as Unicode block elements.

```
dotnet run --project samples/Gallery.Terminal                       # full ControlGallery
MF_TERMINAL_DEMO=1 dotnet run --project samples/Gallery.Terminal    # a small smoke form instead
```

Run it in a truecolor terminal. The output mode is found by asking the terminal;
`MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` forces one, and `MF_TERMINAL_SCALE=0.5` lays the
form out on a canvas twice as large as the pixel grid (useful in classic half-block mode). Mouse and
keyboard work; Ctrl+C always exits. Verified in xterm and WezTerm so far. See
[Platform backends]({{ '/backends/' | relative_url }}) for the backend's limits (no native pickers,
`NativeControlHost` or web view).

## Gallery.Wpf (Windows-only)
{:#gallerywpf}

The same gallery on the **WPF** backend — a real WPF `Window`, Skia presented through a
`WriteableBitmap`. WPF is not the auto-resolved default backend, so the head installs it explicitly
before the first window (`Platform.Backend = new WpfPlatformBackend ();`).

```
dotnet run --project samples/Gallery.Wpf
```

Like the WinForms backend, this is a Windows-only *migration* backend — see
[Platform backends]({{ '/backends/' | relative_url }}).

## Explorer
{:#explorer}

A clone of Windows Explorer — file browsing, tree navigation, and list views exercising the core
control set end to end. The project lives in `samples/Explorer` and is named `Explore.csproj`.

```
dotnet run --project samples/Explorer
```

Verified running on Windows, Ubuntu, and macOS.

## Outlaw
{:#outlaw}

A clone of Microsoft Outlook, showing Majorsilence.Forms holding up a complex, multi-pane,
real-world application shape rather than a toy demo.

```
dotnet run --project samples/Outlaw
```

## PointOfSale
{:#pointofsale}

A complete line-of-business application split across four projects, rather than a single-window
demo — the shape a real Majorsilence.Forms app takes:

| Project | Role |
|---|---|
| `PointOfSale.Client` | The Majorsilence.Forms desktop app (forms, panels, custom controls, services) |
| `PointOfSale.Api` | An ASP.NET Core minimal API with JWT auth and role-based policies |
| `PointOfSale.Contracts` | DTOs shared by both sides |
| `PointOfSale.Data` | EF Core + SQLite persistence and seeding (covered by `tests/PointOfSale.Data.Tests`) |

Start the API first, then the client — the client reads `ApiBaseUrl` (and its kiosk-mode settings)
from its own `appsettings.json`, defaulting to `http://127.0.0.1:5000`:

```
dotnet run --project samples/PointOfSale/PointOfSale.Api
dotnet run --project samples/PointOfSale/PointOfSale.Client
```

The API creates and seeds a local `pos.db` on first run. The default JWT signing key in
`appsettings.json` is a placeholder, not a secret — override it in `appsettings.Development.json` or
the environment. Source: [`samples/PointOfSale`]({{ site.github_url }}/tree/main/samples/PointOfSale).

## ThemeStudio
{:#themestudio}

A desktop app for writing CSS themes: a CSS editor on the left, one of every themable control on the
right, and the parser's diagnostics underneath. Every edit re-applies the sheet (to the Studio's own
window too), an opened file is watched on disk so an external editor or a coding assistant can drive
it, and **Copy reference for AI** puts the complete theming reference on the clipboard for prompting
an assistant.

```
dotnet run --project samples/ThemeStudio                                           # start from the Light theme as CSS
dotnet run --project samples/ThemeStudio -- samples/ThemeStudio/Themes/ocean.css   # open and watch a theme
dotnet run --project samples/ThemeStudio -- --render-headless out.png samples/ThemeStudio/Themes/paper.css --tab 1
```

The last form renders the preview to a PNG with no display (tabs: 0 inputs, 1 lists and grids,
2 menus and chrome, 3 token swatches, 4 native Avalonia) and exits non-zero if the theme has errors.
Tab 4 hosts real Avalonia controls themed by the same sheet through
`Majorsilence.Forms.Theming.Avalonia`.

`samples/ThemeStudio/Themes/` ships example themes to start from: `light.css` and `dark.css` (a
matched pair sharing one accent, so an app can switch modes without anything moving), `ocean.css`,
`graphite.css`, `paper.css` and `parchment.css`. Prebuilt, self-contained ThemeStudio binaries for
`win-x64`, `linux-x64` and `osx-arm64` are attached to each GitHub Release. The theming reference
itself is [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) in the repository.

## ThemeStudio.WinForms (Windows-only)
{:#themestudiowinforms}

The Windows-only head of the Theme Studio for **real `System.Windows.Forms`** apps: the same editor
and diagnostics, with a preview of one of each WinForms control the applier maps, themed through
`Majorsilence.Forms.Theming.WinForms`. The diagnostics list adds what WinForms could not express
(info / warning) to the parser's own.

```
dotnet run --project samples/ThemeStudio.WinForms                                              # start from the Light theme as CSS
dotnet run --project samples/ThemeStudio.WinForms -- samples/ThemeStudio/Themes/graphite.css   # open and watch a theme
dotnet run --project samples/ThemeStudio.WinForms -- --screenshot out.png samples/ThemeStudio/Themes/graphite.css
```

`--screenshot` renders the preview with `Control.DrawToBitmap` — WinForms has no headless backend, so
a desktop session is still required — and exits non-zero on parse errors. A `win-x64` build is
attached to each GitHub Release alongside the ThemeStudio binaries. See
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md).

## EmbeddingAvalonia / EmbeddingUno / EmbeddingWinForms / EmbeddingGtk4
{:#embedding}

The reverse direction: an ordinary Avalonia, Uno, classic WinForms, or GTK 4 application that uses
Majorsilence.Forms controls and windows as if they were its own native ones, rather than letting
Majorsilence.Forms own the top-level window.

```
dotnet run --project samples/EmbeddingAvalonia
dotnet run --project samples/EmbeddingUno
dotnet run --project samples/EmbeddingWinForms   # Windows only
dotnet run --project samples/EmbeddingGtk4       # needs a display + GTK 4
```

Each window puts native host controls and an embedded Majorsilence.Forms scene side by side:

- `ToAvaloniaControl()` / `ToUnoControl()` / `ToWinFormsControl()` / `ToGtkWidget()` — a
  Majorsilence control hosted as a native one via `MajorsilenceFormsPresenter`.
- `ToAvaloniaWindow()` / `ToUnoWindow()` / `ToWinFormsForm()` / `ToGtkWindow()` — a Majorsilence
  `Form`'s backend window handed back to the host. Avalonia, WinForms and GTK 4 get a genuine OS-level
  modal dialog; Uno has no owner concept in this backend, so it gets an independent top-level window
  and `Form.ShowDialog(parent)` is the way to get modal behaviour there.
- `NativeControlHost` — a native button hosted *inside* the Majorsilence scene, the other direction
  again (all four; on GTK 4 it composites cleanly with no airspace problem). See
  [Native interop]({{ '/native-interop/' | relative_url }}).

`EmbeddingWinForms` themes both halves from one stylesheet, `Themes/graphite.css`, through
`WinFormsCssTheme` (`--no-theme` for the untreated look); `EmbeddingAvalonia` does the same through
`AvaloniaCssTheme` (its **Apply ocean.css** button, or `--theme file.css`, and `--render-headless out.png`
draws the window offscreen and exits). The Avalonia and Uno ones also toggle the host theme, so you
can watch Majorsilence.Forms controls follow it. The WinForms one is the port-one-control-at-a-time
migration path on the WinForms backend; the GTK 4 one runs its host `Gtk.Application`'s loop with the
Gtk4 backend inside it (`EMBED_SELFTEST=1` for a non-interactive check). See
[Embedding in a host app]({{ '/backends/' | relative_url }}#embedding-in-a-host-app) for the API and
the owner/modal differences between the backends.

## WinFormsInterop (Windows-only)
{:#winformsinterop}

Demonstrates bi-directional interop between `System.Windows.Forms` and Majorsilence.Forms in a
single process — the sample starts as a real WinForms host and each opened Majorsilence.Forms
window can in turn open legacy WinForms forms. This is whole-form bridging on the Avalonia backend,
distinct from the WinForms backend that `EmbeddingWinForms` uses.

```
dotnet run --project samples/WinFormsInterop
```

See [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) for the
full API.

## WinFormsCompatDemo
{:#winformscompatdemo}

Not to be confused with `WinFormsInterop`: there is no real `System.Windows.Forms` assembly anywhere
in this process. `Form1.cs`/`Form1.Designer.cs` are ordinary, unmodified WinForms designer-generated
source — a `Button`, `Label`, `TextBox`, a `MessageBox.Show(...)` call — that compile against
Majorsilence.Forms because the `Majorsilence.Forms.WinFormsShims.Compat` Roslyn source generator emits
a same-named `System.Windows.Forms` namespace backed by it, purely at compile time. The sample
references the Avalonia backend so `Application.Run` opens a real window, not just a compile check.

```
dotnet run --project samples/WinFormsCompatDemo
```

Its [`RESULTS.md`]({{ site.github_url }}/blob/main/samples/WinFormsCompatDemo/RESULTS.md) records what
does and doesn't survive the translation today — the designer-generated form compiles clean, and the
first thing that breaks is a handler typed to a non-`EventHandler` delegate such as `PaintEventArgs`.
See [Migration]({{ '/migration/' | relative_url }}) for where this fits.

## AutomationTarget
{:#automationtarget}

A deliberately small app that starts a `WebDriverServer` on itself, so there is something real to
drive while learning the automation tooling — from the MCP server, a Selenium client, or plain `curl`.

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

It prints the endpoint and the commands to drive it. `--webdriver <port>` picks the port (default
4444); `--no-webdriver` runs it as an ordinary app. Each control demonstrates one thing a client has
to cope with — a control that refuses to be clicked, one that only becomes enabled once a checkbox is
ticked, and one deliberately left unnamed — and every action is logged on screen and to stdout, so
you can check a client's claims against what the app actually saw. Screenshots are unavailable here by
design: it runs on Avalonia, and image capture is the Headless backend's job.

See [`samples/AutomationTarget/README.md`]({{ site.github_url }}/blob/main/samples/AutomationTarget/README.md)
for the control-by-control breakdown, and [Automation & UI testing]({{ '/automation/' | relative_url }})
for the tooling itself.

## Building from source
{:#building-from-source}

- Clone the [repository]({{ site.github_url }})
- Install the .NET 10 SDK
- Open `Majorsilence.Forms.slnx` in your IDE, or run any sample directly with `dotnet run --project samples/<Name>`

`Gallery.Android` and `Gallery.iOS` are in the solution but compile as empty stub libraries unless the
matching workload is installed, so a plain `dotnet build` / `dotnet test` at the repo root works with
no platform workload. Force one platform with `-p:EnableAndroidTarget=true` or `-p:EnableIOSTarget=true`.

For platform-specific build notes, see
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md) in the repository.
