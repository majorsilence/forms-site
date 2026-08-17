---
layout: docs
title: Samples
subtitle: Real applications built with Majorsilence.Forms, in the repository today.
seo_title: "Cross-Platform WinForms Samples & Demo Apps"
description: >-
  Real cross-platform WinForms apps you can run: a Windows Explorer clone, an Outlook clone, and
  the full control gallery on desktop, browser and mobile.
keywords:
  - winforms sample apps
  - cross platform winforms examples
  - c# winforms demo linux macos
  - winforms control gallery
priority: "0.8"
---

## ControlGallery

Every built-in control, live, one demo panel per control. `ControlGallery` itself is a
backend-agnostic **library** — the shared `MainForm` and demo panels — and each backend gets a thin
app head that hosts it. `Gallery.Avalonia` is the desktop one:

```
dotnet run --project samples/Gallery.Avalonia
```

It also renders headlessly, useful for CI and pixel-diff checks:

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

## Gallery.Uno

The same control gallery running on the **Uno** backend — desktop, iOS, Android, and WebAssembly reach.

```
dotnet run --project samples/Gallery.Uno
```

Needs a windowing session, so it isn't part of the headless CI build; its Uno packages restore from
nuget.org via the sample's own `nuget.config`.

## Gallery.Wasm

The same control gallery again, this time running in the browser on the Avalonia backend's
`net10.0-browser` target — **[try it live]({{ '/gallery/' | relative_url }})**, no install required.
It's the real framework compiled to WebAssembly, so first load pulls down the .NET runtime.

To build it yourself, you need the wasm-tools workload once:

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

Then serve `out/wwwroot` with any static file server and open `index.html` — WebAssembly SDK
projects aren't served by `dotnet run` the way a normal exe is. Like Gallery.Uno, it isn't part of
the headless CI build. See [Platform backends]({{ '/backends/' | relative_url }}#running-in-the-browser-webassembly)
for build details and current limitations.

## Gallery.Android (Android-only, work in progress)

The same `ControlGallery` `MainForm` again, on the Avalonia backend's Android target, hosted by a
single Activity. Needs the `android` workload:

```
dotnet workload install android
dotnet build samples/Gallery.Android -p:EnableAndroidTarget=true -t:Run
```

> Android support is early — it builds and boots the gallery, but hasn't had the real-device testing
> or control-coverage pass the desktop and browser backends have. Expect rough edges.

It's deliberately kept out of the default solution build, so a plain `dotnet build` / `dotnet test`
at the repo root never needs the workload.

## Gallery.iOS (iOS-only, unverified)

The iOS equivalent, hosted by a single `UIViewController`. Needs a Mac with the `ios` workload:

```
dotnet workload install ios
dotnet build samples/Gallery.iOS -p:EnableIOSTarget=true -t:Run
```

> Unlike every other sample here, this one has never actually been compiled — the `ios` workload only
> installs on macOS, and no Mac was available. It's written from Avalonia.iOS's API surface and
> standard .NET-for-iOS conventions rather than from a working build, so expect a first-build
> shakeout on real hardware or in CI before treating it as working.

## EmbeddingAvalonia / EmbeddingUno

The reverse direction: an ordinary Avalonia or Uno application that drops Majorsilence.Forms
controls and windows into its *own* visual tree, rather than letting Majorsilence.Forms own the
top-level window.

```
dotnet run --project samples/EmbeddingAvalonia
dotnet run --project samples/EmbeddingUno
```

Each shows a Majorsilence.Forms control hosted as a native one and a Majorsilence.Forms `Form` opened
as a host window. See
[Embedding in a host app]({{ '/backends/' | relative_url }}#embedding-in-a-host-app) for the API and
the owner/modal differences between the two backends.

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
