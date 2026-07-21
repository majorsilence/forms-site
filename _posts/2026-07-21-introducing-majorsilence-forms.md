---
title: "Introducing Majorsilence.Forms"
date: 2026-07-21 15:00:00 -0000
read_time: "4 min read"
excerpt: "A WinForms-style UI framework for moving legacy and modern WinForms apps onto a cross-platform stack — without a rewrite."
---

Moving a WinForms application off Windows-only desktop has traditionally meant a ground-up rewrite:
XAML, a forced MVVM restructuring, or the web. That's expensive, risky, and it throws away years of
working business logic and UX for a codebase that mostly just needs a new coat of paint.

**Majorsilence.Forms** takes a different approach: it mirrors the WinForms API surface — `Form`s,
controls, event handlers, even `*.Designer.cs` code-behind — and ships a compatibility layer so
existing forms and controls move over with far less churn. The programming model doesn't change;
where it runs does.

## How it's built

Every control is drawn with [SkiaSharp](https://github.com/mono/SkiaSharp) into an `SKSurface`, on
top of a swappable host backend:

- **Avalonia** (default) — Windows, macOS, Linux desktop out of the box, with its own Android, iOS,
  and Browser (WebAssembly) targets as a path to mobile and web too.
- **Uno Platform** — the broadest reach: desktop, iOS, Android, and WebAssembly.
- **Headless** — dependency-free offscreen rendering for CI and automated tests.

The core `Majorsilence.Forms` assembly references no windowing toolkit at all — just SkiaSharp.
Backends are separate assemblies that plug into two small interfaces, `IPlatformBackend` and
`IWindowBackend`. That seam is what lets the exact same app target Avalonia today and Uno tomorrow
with no changes to application code. Read more in [Platform backends]({{ '/backends/' | relative_url }}).

## Who it's for

If you're sitting on a WinForms codebase that's Windows-only today and you want to keep momentum —
reuse your controls, your team's muscle memory, your business logic — instead of starting a
multi-year rewrite, this is built for you.

The project is early stage: the API is stabilizing and not every WinForms corner is covered yet.
It's already a solid fit for new cross-platform line-of-business apps, and for migrating real
production apps if you pin your version. See the
[compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) for exactly what's
implemented versus stubbed today.

## Try it

```
dotnet new --install MajorsilenceForms.Templates
dotnet new majorsilenceforms
dotnet run
```

Or dig into a real application — [`samples/Explorer`]({{ site.github_url }}/tree/main/samples/Explorer)
is a full Windows Explorer clone, and [`samples/Outlaw`]({{ site.github_url }}/tree/main/samples/Outlaw)
is an Outlook clone, both running unmodified on the same control set across platforms.

See [Getting Started]({{ '/getting-started/' | relative_url }}) to scaffold your first app.
