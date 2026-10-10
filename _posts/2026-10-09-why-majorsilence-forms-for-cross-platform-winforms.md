---
title: "Cross-platform WinForms in 2026: where Majorsilence.Forms fits next to MAUI, Avalonia and Uno"
date: 2026-10-09 12:00:00 -0230
read_time: "4 min read"
excerpt: "If you have a WinForms codebase and need Linux and macOS, the question is how much of your code survives. Here is where Majorsilence.Forms stands on each platform, honestly."
description: >-
  A plain assessment of Majorsilence.Forms for cross-platform .NET: strong Linux, macOS and Windows
  support, growing Android, iOS and WebAssembly, and how it compares to MAUI, Avalonia and Uno.
---

Most "cross-platform .NET UI" roundups list .NET MAUI, Avalonia and Uno Platform. All three are good,
and all three ask you to rewrite a WinForms application in XAML. Majorsilence.Forms exists for the
other case: you keep writing `Form`s, controls, event handlers and `*.Designer.cs` files, and the
app runs on Windows, macOS and Linux from one build.

## Where it is strong

**Linux, macOS and Windows** are the primary targets. Controls are drawn with SkiaSharp and hosted by
Avalonia, or by a real GTK 4 window on Linux. CI exercises them on every change, and the repository
carries a member-by-member compatibility matrix so you can check a control before you commit.

## Where it is growing

**WebAssembly** works today: the whole control gallery runs [in your browser]({{ '/gallery/' | relative_url }}).
**Android** boots and handles taps, scaling, touch scrolling and the soft keyboard on a device, with
rotation and wider control coverage still being exercised. **iOS** is early: it compiles and launches
in a CI simulator, and has not yet been run interactively on a device.

## Not a competitor to the XAML frameworks

It is built on them. Avalonia, Uno and GTK 4 supply the window and the event loop; Majorsilence.Forms
supplies the WinForms programming model. The [alternatives page]({{ '/winforms-alternatives/' | relative_url }})
compares them by how much existing code each one keeps.

Start with the [getting started guide]({{ '/getting-started/' | relative_url }}) or the
[migration guide]({{ '/migration/' | relative_url }}).
