---
layout: docs
title: Getting Started
subtitle: Scaffold your first Majorsilence.Forms app in a few minutes.
---

## From a template

The easiest way to start a Majorsilence.Forms application is the `dotnet` template, published on NuGet.

```
dotnet new --install MajorsilenceForms.Templates
dotnet new majorsilenceforms
dotnet run
```

This creates and runs a basic "Hello World" Majorsilence.Forms application.

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
    <PackageReference Include="Majorsilence.Forms" Version="26.0.30" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.0.30" />
</ItemGroup>
```

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
Linux with no further configuration. See [Platform backends]({{ '/backends/' | relative_url }}) to
target Uno Platform, the browser, or offscreen rendering instead.

## Where to go next

- **[Training guide]({{ '/training/' | relative_url }})** — the structured curriculum for a whole team:
  the mental model, the compatibility contract, migration, backends, testing, and the CI gates and
  rollout plan that go with them.
- **[Platform backends]({{ '/backends/' | relative_url }})** — the host seam, running in the browser,
  embedding Majorsilence.Forms inside an existing Avalonia or Uno app, and touch gestures.
- **[Accessibility & automation]({{ '/automation/' | relative_url }})** — write UI tests in-process or
  over Selenium/WebDriver, and light up screen readers on Windows.
- **[Native interop]({{ '/native-interop/' | relative_url }})** — hosting native content (video, maps,
  browser engines) and why `Control.Handle` isn't an `HWND`.

## Migrating an existing WinForms app

Bringing over an existing codebase rather than starting fresh? Two documents cover it:

- **[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)** — how the
  `majorsilence-migrate` CLI rewrites a WinForms solution onto Majorsilence.Forms, and how to read
  its output.
- **[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)** — what's
  fully implemented, what's approximated, and what's deliberately out of scope, once your code
  compiles.

> Early stage: the API is stabilizing and not every WinForms corner is covered yet. It's a good fit
> for new cross-platform LOB apps and for migrating real apps today — just pin your version.
