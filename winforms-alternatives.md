---
layout: docs
title: WinForms alternatives compared
subtitle: Majorsilence.Forms vs .NET MAUI, Avalonia, Uno Platform, Eto.Forms, WPF and Wine — what each one actually asks of an existing WinForms codebase.
permalink: /winforms-alternatives/
seo_title: "WinForms Alternatives Compared — MAUI, Avalonia, Uno & More"
description: >-
  An honest comparison for a WinForms codebase: .NET MAUI, Avalonia, Uno Platform, Eto.Forms, WPF
  and Wine — and which ones force a full UI rewrite.
keywords:
  - winforms alternative
  - winforms replacement
  - alternative to windows forms
  - maui vs avalonia vs uno
  - winforms vs avalonia
  - migrate winforms to maui
  - cross platform .net ui framework
  - best winforms alternative
  - winforms gtk
  - incremental winforms migration
priority: "0.9"
---

If you have a working WinForms application and need it on macOS or Linux, the real question isn't
"which UI framework is best" — it's **"how much of my existing code survives?"** Every option below
is a good framework. They just ask for very different amounts of your codebase.

## The short version

| Option | UI paradigm | Linux | macOS | Mobile / web | What happens to your existing WinForms code |
|---|---|---|---|---|---|
| **Majorsilence.Forms** | WinForms (`Form`, controls, events, Designer files) | Yes (Avalonia or GTK 4) | Yes | Browser (young), Android and iOS (early); also a terminal | **Kept.** Namespace change + a compatibility layer; the migrator automates the mechanical part. On Windows it can also be adopted one control at a time inside the existing WinForms or WPF app, including on .NET Framework 4.8 |
| **Avalonia** | XAML + MVVM | Yes | Yes | Yes | Rewritten as XAML views and view models |
| **Uno Platform** | WinUI XAML + MVVM | Yes | Yes | Yes | Rewritten as WinUI XAML |
| **.NET MAUI** | XAML + MVVM | No official support | Yes (Mac Catalyst) | Yes | Rewritten, and re-scoped for a mobile-first control set |
| **Eto.Forms** | Its own forms-style .NET API, native widgets per OS | Yes | Yes | No | Rewritten against Eto's API — familiar in shape, but not source-compatible with WinForms |
| **WPF** | XAML + MVVM | No | No | No | Rewritten, and still Windows-only |
| **Wine** | None — runs the Windows binary | Yes | Yes | No | Untouched, but you are shipping an emulated Windows app, not a native one |

## Majorsilence.Forms is built *on* several of these

Worth being explicit, because it is a common misreading: Majorsilence.Forms is not competing with
Avalonia, Uno Platform or GTK. It **uses** them. Every control is drawn by Majorsilence.Forms itself
with SkiaSharp, and the host underneath — Avalonia by default, or Uno, or a real GTK 4 window via
gir.core — creates the window, runs the message loop and presents the Skia surface. On Windows, the
same controls can be hosted by real `System.Windows.Forms` or WPF windows instead, which is what
makes an incremental, in-place migration possible. See
[Platform backends]({{ '/backends/' | relative_url }}).

So the choice isn't "Majorsilence.Forms or Avalonia". It is: *do you write Avalonia's XAML directly,
or do you keep writing WinForms and let Avalonia (or GTK 4, or Uno) be the plumbing?*

## Option by option

### .NET MAUI

Microsoft's official cross-platform successor to Xamarin.Forms, and the answer most search results
will give you. It is a strong choice for a **new** mobile-and-desktop app.

For an existing WinForms LOB application it's usually the hardest path: there is no official Linux
support, the control set is mobile-first (no `DataGridView` equivalent, a different windowing and
dialog model), and every screen is rebuilt in XAML with a view-model layer that your WinForms code
almost certainly doesn't have. There is no meaningful reuse of `*.Designer.cs` files.

### Avalonia

A mature, genuinely cross-platform XAML framework — desktop, mobile and WebAssembly — with excellent
Linux support and a Skia renderer. If you want a modern XAML stack and are prepared to rewrite the
UI layer, this is the strongest general answer, and it's the default host Majorsilence.Forms runs on.

Note that Avalonia's commercial **XPF** product is a compatibility layer for *WPF*, not WinForms; it
doesn't help a `System.Windows.Forms` codebase.

### Uno Platform

Implements the WinUI/UWP XAML API across desktop, mobile and WebAssembly, with very broad reach and
strong tooling. Same shape of decision as Avalonia: excellent target, full UI rewrite from WinForms.
It's also available as a Majorsilence.Forms backend if your organization is already invested in it.

### Eto.Forms

The closest thing in spirit to this project outside it: a cross-platform .NET UI library with a
forms-and-controls API rather than XAML, binding to each platform's *native* widgets (WinForms on
Windows, Cocoa on macOS, GTK on Linux). Native look per OS is a real advantage.

But its API is its own — `Eto.Forms.Form` is not `System.Windows.Forms.Form`, layout is
container-based rather than coordinate/anchor-based, and there is no path for existing designer
files. You rewrite, in a familiar idiom. That comparison still holds now that Majorsilence.Forms has
a GTK 4 backend of its own: Eto maps its controls onto GTK widgets, whereas Majorsilence.Forms only
uses the GTK window and input loop as a host and keeps drawing its own WinForms-shaped controls.

### Mono's `System.Windows.Forms`

Mono did ship a WinForms reimplementation, which is why "WinForms works on Linux" turns up in old
forum threads. It targeted the .NET Framework era, was never carried into modern .NET, and is not a
viable target for a new port today.

### Wine

Wine runs your unmodified Windows binary on Linux and macOS. Nothing changes in your code, which is
genuinely attractive — until you have to support it: you ship a Windows app plus a compatibility
runtime, you inherit whatever Wine's Win32/GDI+ coverage happens to be, integration with the host OS
is approximate, and installers and updates get complicated. It's a deployment workaround, not a
platform strategy.

### Staying on WPF

WPF is a fine framework and a modest conceptual step from WinForms, but it is Windows-only. It
solves "modernize the UI"; it does not solve "run on macOS and Linux". (If you already have a WPF
shell and want cross-platform screens inside it, Majorsilence.Forms has a WPF host backend for
exactly that — but the WPF shell itself stays on Windows.)

## When Majorsilence.Forms is the right answer

- You have a substantial WinForms codebase — especially a line-of-business app with many forms —
  where the business logic and UX are the asset and the rewrite risk is the problem.
- Your team's skills are WinForms, and a XAML/MVVM retraining cycle is a real cost.
- You need Windows, macOS and Linux from one codebase, with browser and mobile as a later option.
- You can't stop the world to port. The `Majorsilence.Forms.WinForms` and `.Wpf` backends host the
  cross-platform controls inside your *existing* Windows app, one control or form at a time — and
  they target `net48`, so this works from a .NET Framework 4.8 app before you've even moved to
  modern .NET. The same CSS theme can restyle the real WinForms controls alongside the ported ones
  (`Majorsilence.Forms.Theming.WinForms`), so the mixed app looks like one app.
- You can accept a beta compatibility layer and pin your version.

## When it isn't

- **Green-field, no WinForms code, no WinForms team.** Write Avalonia or Uno directly; you get a
  mature XAML stack with no compatibility layer in the middle.
- **Mobile-first.** MAUI, Avalonia or Uno target phones properly today. Majorsilence.Forms'
  Android support has had an initial real-device pass and iOS only a CI simulator smoke check —
  both are early — and a coordinate-positioned desktop form is a poor phone UI anyway, even with
  the phone-style `StackPanel`/`Card`/`NavigationHost` controls the framework now ships.
- **Your app is deep in Win32.** Heavy `WndProc`, `Control.Handle` P/Invoke or custom Win32
  controls don't survive any of these ports — including this one — without real work.
- **You need pixel-identical parity with native WinForms on Windows.** Controls are drawn by Skia
  and themed by CSS, consistently across platforms, rather than matching each OS's native widgets.
  (Push buttons and check/radio glyphs do get the Windows 11-style look once a ported app sets its
  font, but that is a courtesy for mixed apps, not a parity guarantee.)

## Next

- [Cross-platform WinForms]({{ '/cross-platform-winforms/' | relative_url }}) — how the
  compatibility layer works and what it costs.
- [Migrate an existing WinForms app]({{ '/migration/' | relative_url }}) — the automated rewrite.
- [Compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — control-by-control
  coverage, before you commit.
