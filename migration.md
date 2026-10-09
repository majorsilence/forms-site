---
layout: docs
title: Migrate a WinForms app
subtitle: Move an existing Windows Forms solution onto Majorsilence.Forms with an automated rewrite — or do it incrementally, one form or one control at a time, while the rest keeps building against real WinForms or WPF.
permalink: /migration/
seo_title: "Migrate WinForms to Cross-Platform .NET — Migration Tool"
description: >-
  Migrate a Windows Forms app to cross-platform .NET without a rewrite. The majorsilence-migrate
  CLI rewrites namespaces, projects and resources as a git diff, and the WinForms and WPF backends
  let you port one control at a time.
keywords:
  - migrate winforms
  - winforms migration tool
  - convert winforms to cross platform
  - modernize winforms application
  - winforms to .net 10
  - port winforms to linux
  - system.windows.forms migration
  - legacy winforms modernization
priority: "0.9"
---

Migrating a WinForms application to a XAML framework means rebuilding every screen. Migrating it to
Majorsilence.Forms is mostly a **mechanical rewrite** — the same forms, the same controls, the same
event handlers, pointed at a different namespace — and there's a CLI that performs it for you.

```bash
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff
```

The full reference is [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) in the
repository. This page is the orientation.

## Installing the tool

The migrator ships to nuget.org as a .NET tool, and that is now the **only** form it ships in —
releases used to attach a self-contained single-file binary per platform as well, and no longer do.
That means it needs a .NET runtime on the machine (the package targets `net10.0` with
`RollForward=latestMajor`, so a newer runtime is fine).

```bash
# Global install
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help

# Or per repo, pinned in a tool manifest
dotnet new tool-manifest
dotnet tool install Majorsilence.Forms.Migrator
dotnet majorsilence-migrate --help
```

If you'd rather not install anything, run it from a clone of the repository with
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>`.

## What the migrator changes

| Target | What happens |
|---|---|
| `.csproj` / `.vbproj` | Removes `UseWindowsForms`/`UseWPF`, drops the `-windows` TFM suffix (`net8.0-windows` → `net8.0`, `net10.0-windows10.0.19041.0` → `net10.0`) — including in imported `.props`/`.targets` — drops the Windows Desktop framework reference, removes WinForms-only packages (Telerik UI for WinForms, DevExpress, **`System.Drawing.Common`**), and adds `Majorsilence.Forms` plus a backend to every project the rewrite actually touches. Solutions using Central Package Management are honoured: version-less `PackageReference`s, versions added to `Directory.Packages.props` |
| `.cs` / `.vb` | Rewrites namespaces through a longest-prefix-first table, collapses the duplicate `using`/`Imports` lines that produces, adds aliases for the few names a retained `System.Drawing` import would make ambiguous (`SystemColors`, `ColorTranslator`, Telerik's `TabStripItem`), and comments out `ApplicationConfiguration.Initialize()` |
| Visual Basic specifics | Injects the implicit WinForms constructor lost when `MyType=Empty` stops applying, generates a `My.Resources` accessor module, and warns on remaining `My.*` usage. `My.Application.Info.*`, `My.Resources.*` and `My.Computer.Name` are implemented for real; `My.Forms`, `My.Settings`, `My.User` and the rest still warn |
| `.resx` | Finds image and type references that have to survive the framework swap |
| Strongly-typed resource designers | In generated `Resources.Designer.cs`-style files (and only those), `System.Resources.ResourceManager` becomes `Majorsilence.Forms.ComponentResourceManager`, so the generated `(Icon) ResourceManager.GetObject(...)` casts succeed at runtime instead of throwing on the first resource read |
| Report | Writes a Markdown summary of everything it touched and everything it wants a human to look at |

`System.Drawing.Common` going away matters more than it looks: leaving it referenced puts
`System.Drawing.Bitmap`/`Font`/`Pen` back in scope next to their `Majorsilence.Forms.Drawing`
replacements, and every unqualified use then fails as an *ambiguous reference* rather than resolving
to the port. And "projects the rewrite touches" is wider than "WinForms projects": a plain class
library with an image helper gets rewritten to `Majorsilence.Forms.Drawing.*` too and needs the
reference. Libraries that only use the primitives that stay in `System.Drawing` (`Color`, `Point`,
`Size`) are left alone.

### The options you'll actually use

- `--dry-run --diff` — show the unified diff without writing anything.
- `--no-backup` — in-place without `.bak` files, because git is the backup.
- `--backend avalonia|uno|headless` — which backend package to add (Avalonia is the default).
- `--package-version <v>` — pin the package version; defaults to the migrator's own version, since
  the tool and the packages ship from the same release.
- `--map <file>` — a JSON file of extra namespace mappings and package globs for a third-party
  vendor the tool doesn't know (DevExpress, say). Telerik UI for WinForms is built in and maps onto
  `Majorsilence.Forms.Telerik` with no `--map`.
- `--strict` — exit non-zero if any manual-review warning is produced. Use it as a CI gate on the
  migrated branch so a new unmapped reference fails the pipeline.
- `--engine roslyn` — the symbol-aware second pass, below.

Krypton Toolkit ports get one extra step: the tool can't fix type-relationship facts (a
Majorsilence.Forms `Form` is not a `Control`), so the repository ships idempotent bridge scripts in
[`tools/fixups/`]({{ site.github_url }}/tree/main/tools/fixups) for the Standard and Extended
toolkits, with the remaining work tracked in
[`docs/krypton-port-plan.md`]({{ site.github_url }}/blob/main/docs/krypton-port-plan.md).

## The recommended first run

Run it in place on a git branch, so the migration is a diff you can read, re-run and revert:

```bash
# See the scope before changing anything
majorsilence-migrate MySolution.sln --dry-run --diff

# Then do it for real — git is the backup, so skip the .bak files
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

The rewrite is idempotent, so re-running it after merging more legacy code is safe. Read the
report: it groups every warning by cause, and the most common "skipped project" is a legacy
non-SDK-style `.csproj` that has to be converted to SDK style before the tool can parse it — a
prerequisite step, not a migration gap.

## Two engines

The default engine is a deliberate **textual rewriter** — no syntax tree, no symbol resolution. That
sounds like a shortcut and isn't: it means the tool works on a half-migrated solution, on a `.vb`
file referencing a type nobody has ported yet, on a project that doesn't currently compile. A
Roslyn-based tool refuses to touch a project until it builds, which defeats the purpose of a *first
pass* over a legacy codebase. It also runs over thousands of files in seconds.

What it gives up is cross-project symbol resolution: it can't tell your own `Panel` class from
`System.Windows.Forms.Panel` when both are used by bare name. For that specific case there is an
opt-in `--engine roslyn` that uses `MSBuildWorkspace` and real symbol resolution. It is much slower
and needs a loadable project, so it's the second pass — not the first. It fails closed per project:
one project that won't load falls back to the text engine for that project's files, with a warning.

## Incremental migration: five ways to not flip the switch at once

You rarely want to move a large application over in one commit. There are now several ways to do it
in steps, and they compose.

### `--dual-build`: one codebase, either stack

`--dual-build` leaves a C# project building against **either** stack, switched by a single MSBuild
property, so a Windows developer can keep compiling against real WinForms while the port is in
progress. `UseWindowsForms`, the `-windows` TFM and the WinForms-only packages all stay;
Majorsilence.Forms is added alongside them, and only the top-of-file
`using System.Windows.Forms;` becomes an `#if MAJORSILENCE_FORMS` conditional. Set
`<MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>` in `Directory.Build.props` to flip it. Not offered
for VB — `MyType=Empty` switches off the whole `My` framework and can't be toggled by a preprocessor
symbol — so a VB project passed `--dual-build` is converted the normal way with a warning.

### `WindowsFormsInterop`: whole forms, both directions

On Windows, [`Majorsilence.Forms.WindowsFormsInterop`]({{ site.github_url }}/blob/main/docs/winforms-interop.md)
hosts real `System.Windows.Forms` forms inside a Majorsilence.Forms app running on the Avalonia
backend (and the reverse), sharing one Win32 message pump, so whole screens can move over one at a
time in a running application.

### The WinForms and WPF backends: one control at a time

`Majorsilence.Forms.WinForms` and `Majorsilence.Forms.Wpf` are Windows-only **migration backends**.
Instead of Avalonia, the host underneath Majorsilence.Forms is a real `System.Windows.Forms` window
(or a WPF `Window`) with the Skia surface presented through a GDI bitmap (or a `WriteableBitmap`).
The point is the embedding direction: a ported Majorsilence.Forms control drops back into the
existing app as an ordinary WinForms `Control` or WPF `FrameworkElement`.

```csharp
// WinForms host
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// WPF host
myWpfGrid.Children.Add (myMfControl.ToWpfElement ());
```

`ToWinFormsForm()` / `ToWpfWindow()` do the same for a whole `Form`, including a real native-modal
`ShowDialog(owner)`. Both packages target **`net48`** as well as `net8.0-windows` and
`net10.0-windows`, paired with the `netstandard2.0` build of the core package, so a .NET Framework
4.8 application can start adopting Majorsilence.Forms *before* it moves to modern .NET. A WinForms
control library can port its internals and keep shipping WinForms controls to its consumers.

When everything is ported, swap the backend package for `Majorsilence.Forms.Avalonia` (or Uno, or
GTK 4) and the same code goes cross-platform; nothing above the backend seam changes. There is no
`IWebViewFactory` and no gesture support on these backends, and off Windows they build as empty
placeholder assemblies so a cross-platform solution still compiles everywhere. Samples:
[`samples/EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) and
[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf); package READMEs:
[WinForms]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinForms/README.md),
[WPF]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Wpf/README.md).

### `WinFormsShims.Compat`: when you can't rewrite the namespace

Sometimes rewriting `using System.Windows.Forms;` isn't an option: a distributed control library
whose own **public API** is typed to `System.Windows.Forms`/`System.Drawing`, and whose consumers
can't be asked to change their code.
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinFormsShims.Compat/README.md)
is a Roslyn source generator that emits `System.Windows.Forms` and `System.Drawing` namespaces
backed by Majorsilence.Forms, so unmodified WinForms source — Designer.cs files included — compiles
against the port. It is published as a **proof of concept**: subclasses for every non-sealed class,
wrappers with implicit conversions for the sealed drawing leaves (`Font`, `Pen`, `Bitmap`...),
forwarding static classes (`Application`, `MessageBox`, `Brushes`...), and `Control`'s own event
family. Its headline gap is polymorphic storage through `Control` itself, which C#'s single
inheritance can't paper over. Read the README's scope section before relying on it; the sample is
[`samples/WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo), with
its findings in `RESULTS.md`.

### `Theming.WinForms`: one stylesheet for both halves

A mixed app has two visual systems in one window. [`Majorsilence.Forms.Theming.WinForms`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Theming.WinForms/README.md)
applies the same CSS theme Majorsilence.Forms uses to the **real** `System.Windows.Forms` controls —
same tokens, same selectors, same diagnostics — by walking the control tree and setting `BackColor`,
`ForeColor`, `Font`, `FlatAppearance`, `DataGridView` cell styles, a token-built
`ToolStripProfessionalRenderer`, and the Windows 11 title bar via DWM. `WinFormsCssTheme.Apply`
once at startup, `Track(form)` for each form, and read `Diagnostics` for anything WinForms couldn't
express; nothing is silently ignored. The support matrix is
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md).

## After it compiles

The migrator gets the code to build. What it does *not* tell you is which WinForms behaviour is
fully implemented, which is approximated, and which is deliberately out of scope — that's the
[compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md), and it's the
document to read next.

One property of the compatibility layer is worth internalizing before you test: **unimplemented
members no-op or return a sensible default rather than throwing.** Migrated code compiles and runs
even where a visual feature isn't there yet, which is the right default — but it also means a gap
can be silent rather than loud. `Image.MakeTransparent` was one: a colour-keyed sprite sheet drew
with a white box behind every sprite and nothing threw. The repository now guards against that with
`NoOpStubBaselineTests`, which pins the known set of empty-bodied public `void` methods in
`NoOpStubBaseline.txt` (161 at the time of writing) so that accepting a new stub is a conscious,
recorded act. Test the migrated app, don't just build it.

Where the project stands on the two halves of compatibility:

- **API surface:** the automated gap plans against upstream WinForms and GDI+ are at **zero** —
  every public member upstream has is declared.
- **Behaviour:** a twelve-area audit (August 2026) found **483 places** where a member existed but
  didn't do what WinForms does. Most of those phases have since landed — keyboard pre-processing
  (`ProcessCmdKey`), focus and validation, real dialogs, form lifecycle and event order, live data
  binding, `ListView` details view, `DataGridView` events, text-box undo, `ToolStrip` behaviour,
  `NotifyIcon`, `Application.AddMessageFilter`. The running tally is
  [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md).

Two kinds of change are worth a deliberate read in `MIGRATION.md` before you test, because they
compile cleanly either way:

- **Breaking changes made to match WinForms.** `SplitContainer.Orientation` now means the direction
  of the splitter bar, as in WinForms, so if you set it, invert it. `TreeViewDrawMode.OwnerDrawContent`
  is an `[Obsolete]` alias for `OwnerDrawText`, and `OwnerDrawAll` now exists. Event delegate types
  match WinForms (`KeyEventHandler`, `MouseEventHandler`, `FormClosingEventHandler`), so
  designer-generated `new KeyEventHandler(...)` lines compile — but `Click` and `MouseEnter` no
  longer carry mouse coordinates, because in WinForms they never did. The gradient and hatch brushes
  moved to `Majorsilence.Forms.Drawing.Drawing2D`, where GDI+ keeps them.
- **Custom-painted controls draw in logical units** (since 2026-10-01). `ClientRectangle`,
  `ClientSize` and the canvas your `OnPaint`/`Paint` handler receives are now logical, like `Bounds`,
  and the framework scales to the display. If a custom control called
  `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` itself, remove that call or everything draws at
  double scale. Owner-draw events (`DrawItem`, `DrawNode`, `CellPainting`) still hand you device
  pixels. `MF_HEADLESS_SCALE=2` in a test run shows the difference.

## Real apps that have been migrated

This isn't theoretical. Majorsilence's own
[MPlayercontrol](https://github.com/majorsilence/MPlayercontrol) and
[Reporting](https://github.com/majorsilence/Reporting/tree/feature/modernization-roadmap) are
migrating, and a set of open-source WinForms projects has been forked specifically to exercise the
compatibility layer and the migrator — a Notepad++ clone, DarkUI, PKHeX, metroframework,
RibbonWinForms, a Super Mario Bros remake, advanceddatagridview and more. Several gaps in the stub
baseline table above were found this way. The full list is in the
[Migrated Project Examples]({{ site.github_url }}#migrated-project-examples) section of the
repository readme.

## A realistic plan

1. Run the migrator on a branch, dry-run first. Read the report.
2. Get it compiling. Work through the manual-review warnings; add `--strict` to CI once they're gone.
3. Check the compatibility matrix for anything your app leans on heavily — `DataGridView`, custom
   painting, third-party control suites.
4. Stand up UI tests against the [automation tree]({{ '/automation/' | relative_url }}) so
   regressions are visible; it runs headlessly in CI on any OS.
5. Ship to Windows first — same platform, new framework, one variable at a time. If the app is
   large, do it one control at a time on the WinForms or WPF backend. Then swap the backend and add
   macOS and Linux.
6. Pin your package version. The project is beta and the API is still stabilizing.

[Module 5 of the training guide]({{ '/training/' | relative_url }}#module-5) walks a team through
this in detail, with examples in both C# and VB.NET.

## Next

- [Training guide]({{ '/training/' | relative_url }}) — the full curriculum for a migrating team.
- [Cross-platform WinForms]({{ '/cross-platform-winforms/' | relative_url }}) — what the
  compatibility layer can and can't do.
- [Backends]({{ '/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms, WPF and
  Headless side by side.
- [WinForms alternatives compared]({{ '/winforms-alternatives/' | relative_url }}) — if you're still
  choosing between this and a rewrite.
- [FAQ]({{ '/faq/' | relative_url }}) — the questions that come up first.
