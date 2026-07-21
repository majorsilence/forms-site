---
title: "Migrating a WinForms app with majorsilence-migrate"
date: 2026-07-21 08:00:00 -0000
read_time: "6 min read"
excerpt: "A deliberately textual rewriter — not a Roslyn transform — so it can run over thousands of files in seconds, even ones that don't currently compile."
---

`majorsilence-migrate` is the CLI tool that automates moving a WinForms solution onto
Majorsilence.Forms. Its central design decision is easy to miss and worth calling out explicitly:
it does **not** parse a syntax tree or resolve symbols. It's a multi-pass **textual/regex rewriter**
over raw source text — and that's on purpose.

## Why textual, not Roslyn

From the tool's own source comment: *"This is a deliberately textual transform — it does not parse
the syntax tree — which keeps it fast and tolerant of files that don't currently compile."*

That trade-off buys two things a symbol-aware tool can't offer:

- **It works on broken code.** A half-migrated solution, a file referencing a type nobody's ported
  yet, a project with a missing reference — none of it stops the rewriter, because it never needs
  the code to compile or even fully parse. A Roslyn-based tool with real symbol resolution would
  refuse to touch a project until it builds, which defeats the point of a *first pass* over a
  legacy codebase.
- **It's fast.** No compilation, no `MSBuildWorkspace`, no project graph loading — it runs over
  thousands of files in seconds.

The cost: no true cross-project symbol resolution. The rewriter can't always tell whether a bare
`Panel` reference means `System.Windows.Forms.Panel` or your own class of the same name — it relies
on namespace-prefix and `using`/`Imports` context instead. In practice this is rarely ambiguous
(WinForms and Telerik type names are distinctive), and anything it doesn't recognize gets flagged
for manual review rather than silently guessed at.

## The optional Roslyn engine

For the genuinely ambiguous case — a custom type sharing a bare name with a WinForms/GDI+ type in
the same file — there's an opt-in second engine: `--engine roslyn`. It uses `MSBuildWorkspace` and
real symbol resolution instead of regexes, layered *on top of* the textual engine rather than
replacing it; several passes stay textual even in Roslyn mode, because they were never
symbol-resolution problems to begin with.

The trade-offs run the other way from the default engine: it needs a solution or project that
actually loads via MSBuild (a bare directory or single file falls back to the text engine with a
warning), it's orders of magnitude slower because MSBuild evaluation dominates the run, and if one
project fails to load, only that project's files fall back to the text engine — the run doesn't
abort. If MSBuild itself can't be located at all, the whole run hard-fails rather than silently
downgrading.

**When to reach for it:** after a first pass with the default `--engine text`, on a project that
already loads cleanly, if you're seeing a specific, confirmed name-collision case in the diff. For
the initial pass over a large, possibly half-broken legacy codebase, the default textual engine is
still the right tool.

## What's next

See [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) in the repository for the full
pass-by-pass breakdown, and
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) for what's
actually implemented once your migrated code compiles.
