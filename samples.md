---
layout: docs
title: Samples
subtitle: Real applications built with Majorsilence.Forms, in the repository today.
---

## ControlGallery

Every built-in control, live, one demo panel per control. Run it on the default (Avalonia) backend:

```
dotnet run --project samples/ControlGallery
```

It also renders headlessly, useful for CI and pixel-diff checks:

```
dotnet run --project samples/ControlGallery -- --render-headless out.png 1100 750 --select-row 0
```

## Gallery.Uno

The same control gallery running on the **Uno** backend — desktop, iOS, Android, and WebAssembly reach.

```
dotnet run --project samples/Gallery.Uno
```

Needs a windowing session, so it isn't part of the headless CI build; its Uno packages restore from
nuget.org via the sample's own `nuget.config`.

## Explorer

A clone of Windows Explorer — file browsing, tree navigation, and list views exercising the core
control set end to end.

```
dotnet run --project samples/Explorer
```

Verified running on Windows, Ubuntu, and macOS.

## Outlaw

A clone of Microsoft Outlook, showing Majorsilence.Forms holding up a complex, multi-pane,
real-world application shape rather than a toy demo.

```
dotnet run --project samples/Outlaw
```

## WinFormsInterop (Windows-only)

Demonstrates bi-directional interop between `System.Windows.Forms` and Majorsilence.Forms in a
single process — the sample starts as a real WinForms host and each opened Majorsilence.Forms
window can in turn open legacy WinForms forms.

```
dotnet run --project samples/WinFormsInterop
```

See [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) for the
full API.

## Building from source

- Clone the [repository]({{ site.github_url }})
- Install the .NET SDK
- Open `Majorsilence.Forms.slnx` in your IDE, or run any sample directly with `dotnet run --project samples/<Name>`

For platform-specific build notes, see
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md) in the repository.
