---
layout: docs
title: Migrate a WinForms app
subtitle: Move an existing Windows Forms solution onto Majorsilence.Forms with an automated rewrite — including the incremental path that keeps building against real WinForms.
permalink: /migration/
seo_title: "Migrate WinForms to Cross-Platform .NET — Migration Tool"
description: >-
  Migrate a Windows Forms app to cross-platform .NET without a rewrite. The majorsilence-migrate
  CLI rewrites namespaces, projects and resources as a git diff.
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

## What the migrator changes

| Target | What happens |
|---|---|
| `.csproj` / `.vbproj` | Removes `UseWindowsForms`/`UseWPF`, drops the `-windows` TFM suffix (`net8.0-windows` → `net8.0`), drops the Windows Desktop framework reference, removes WinForms-only packages (Telerik UI for WinForms, DevExpress, **`System.Drawing.Common`**), adds `Majorsilence.Forms` plus a backend |
| `.cs` / `.vb` | Rewrites namespaces through a longest-prefix-first table, collapses the duplicate `using`/`Imports` lines that produces, and adds aliases for the few names a retained `System.Drawing` import would make ambiguous |
| Visual Basic specifics | Injects the implicit WinForms constructor lost when `MyType=Empty` stops applying, generates a `My.Resources` accessor, and warns on remaining `My.*` usage |
| `.resx` | Finds image and type references that have to survive the framework swap |
| Report | Writes a Markdown summary of everything it touched and everything it wants a human to look at |

`System.Drawing.Common` going away matters more than it looks: leaving it referenced puts
`System.Drawing.Bitmap`/`Font`/`Pen` back in scope next to their `Majorsilence.Forms.Drawing`
replacements, and every unqualified use then fails as an *ambiguous reference* rather than resolving
to the port.

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

The rewrite is idempotent, so re-running it after merging more legacy code is safe.

## Two engines

The default engine is a deliberate **textual rewriter** — no syntax tree, no symbol resolution. That
sounds like a shortcut and isn't: it means the tool works on a half-migrated solution, on a `.vb`
file referencing a type nobody has ported yet, on a project that doesn't currently compile. A
Roslyn-based tool refuses to touch a project until it builds, which defeats the purpose of a *first
pass* over a legacy codebase. It also runs over thousands of files in seconds.

What it gives up is cross-project symbol resolution: it can't tell your own `Panel` class from
`System.Windows.Forms.Panel` when both are used by bare name. For that specific case there is an
opt-in `--engine roslyn` that uses `MSBuildWorkspace` and real symbol resolution. It is much slower
and needs a loadable project, so it's the second pass — not the first.

## Incremental migration: `--dual-build`

You rarely want to flip a large application over in one commit. `--dual-build` leaves the project
building against **either** stack, switched by a single MSBuild property, so a Windows developer can
keep compiling against real WinForms while the port is in progress. `UseWindowsForms`, the `-windows`
TFM and the WinForms-only packages all stay; Majorsilence.Forms is added alongside them behind a
`MAJORSILENCE_FORMS` define.

On Windows there is also a second incremental path that has nothing to do with the migrator:
`Majorsilence.Forms.WindowsFormsInterop` hosts real `System.Windows.Forms` forms inside a
Majorsilence.Forms app (and the reverse), so screens can move over one at a time in a running
application. See [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md).

## After it compiles

The migrator gets the code to build. What it does *not* tell you is which WinForms behaviour is
fully implemented, which is approximated, and which is deliberately out of scope — that's the
[compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md), and it's the
document to read next.

One property of the compatibility layer is worth internalizing before you test: **unimplemented
members no-op or return a sensible default rather than throwing.** Migrated code compiles and runs
even where a visual feature isn't there yet, which is the right default — but it also means a gap
can be silent rather than loud. Test the migrated app, don't just build it.

## A realistic plan

1. Run the migrator on a branch, dry-run first. Read the report.
2. Get it compiling. Work through the manual-review warnings.
3. Check the compatibility matrix for anything your app leans on heavily — `DataGridView`, custom
   painting, third-party control suites.
4. Stand up UI tests against the [automation tree]({{ '/automation/' | relative_url }}) so
   regressions are visible; it runs headlessly in CI on any OS.
5. Ship to Windows first — same platform, new framework, one variable at a time. Then add macOS and
   Linux.
6. Pin your package version. The project is beta and the API is still stabilizing.

[Module 4 of the training guide]({{ '/training/' | relative_url }}) walks a team through this in
detail, with examples in both C# and VB.NET.

## Next

- [Training guide]({{ '/training/' | relative_url }}) — the full curriculum for a migrating team.
- [Cross-platform WinForms]({{ '/cross-platform-winforms/' | relative_url }}) — what the
  compatibility layer can and can't do.
- [WinForms alternatives compared]({{ '/winforms-alternatives/' | relative_url }}) — if you're still
  choosing between this and a rewrite.
- [FAQ]({{ '/faq/' | relative_url }}) — the questions that come up first.
