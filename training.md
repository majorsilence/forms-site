---
layout: docs
title: Training guide
subtitle: A structured curriculum for application teams building and shipping on Majorsilence.Forms — every example in both C# and VB.NET.
seo_title: "Cross-Platform WinForms Training Guide (C# and VB.NET)"
description: >-
  A structured curriculum for teams building or migrating a WinForms app onto a cross-platform
  stack — mental model, migration, testing, CI. C# and VB.NET.
keywords:
  - winforms training
  - cross platform winforms tutorial
  - winforms migration guide
  - vb.net cross platform ui
  - winforms team curriculum
priority: "0.8"
---

This is the guide to hand a development team that is about to build — or migrate — **an application**
on Majorsilence.Forms. It assumes WinForms experience and nothing else.

It is deliberately scoped to *using* the framework: referencing the packages, writing forms, moving a
legacy codebase over, choosing your targets, testing what you built, and shipping it. It is **not** a
contributor guide — you never need to clone or build the framework itself to follow any of it. (If you
do end up wanting to fix something in the framework, [module 10](#module-10-gaps) points you at the one
paragraph that matters.)

**Every code example appears in both C# and VB.NET.** Every C# example was compiled and run on macOS
before publishing — the screenshots throughout are those runs, not mock-ups, and two of the honest
caveats you'll read below were found by running them. VB is a first-class migration target here: the
migrator handles `.vbproj`/`.vb` files, re-injects the constructor the classic VB compiler used to
supply, and generates a `My.Resources` accessor. Three VB-specific caveats are called out where they
land — [`--dual-build` is C#-only](#module-5-dualbuild), [`My.*` is only partly
implemented](#module-5-checklist), and [VB has no module initializer for test
setup](#module-8-headless).

Two ways to use it:

| Format | How | Modules |
|---|---|---|
| **Two-day workshop** | Day 1: modules 0–4 (model, first app, knowing what works, drawing). Day 2: modules 5–10 (migration, targets, interop, testing, native content, shipping). | all |
| **Self-paced** | Modules 0–3 are the mandatory core — nobody should start a migration without them. Then take 5 if you're migrating, or 6 + 8 if you're building something new. | pick |

Two things to accept up front, because they shape every decision below. Majorsilence.Forms is
**beta**: the API is stabilizing, and not every WinForms corner is covered — so pin your package
version. And it is **compile-and-approximate, not pixel-perfect**: migrated code is designed to
compile *and run*, with some members deliberately doing nothing yet. Module 3 is entirely about how to
tell which is which, and it is the module that most repays a slow read.

---

## Contents
{:#contents}

- [Module 0 — Get something running](#module-0)
- [Module 1 — The mental model: self-drawn controls on a swappable host](#module-1)
- [Module 2 — Your first app](#module-2)
- [Module 3 — Knowing what works before you build on it](#module-3)
- [Module 4 — Drawing and custom paint](#module-4)
- [Module 5 — Migrating your WinForms app](#module-5)
- [Module 6 — Choosing your targets](#module-6)
- [Module 7 — Incremental adoption on Windows](#module-7)
- [Module 8 — Testing your app](#module-8)
- [Module 9 — Native content and video](#module-9)
- [Module 10 — Shipping: CI, versioning, staying current](#module-10)
- [Appendix A — Troubleshooting by symptom](#appendix-a)
- [Appendix B — Rollout plan for a real codebase](#appendix-b)
- [Appendix C — Reference card](#appendix-c)

---

## Module 0 — Get something running
{:#module-0}

**Outcome:** every developer has an app of their own running on their own OS, and knows where to look
up "can this framework do X".

All you need is the [.NET 10 SDK](https://dotnet.microsoft.com/download). No Windows, no Visual
Studio, no platform workloads, and no framework source.

```
dotnet new --install MajorsilenceForms.Templates
dotnet new majorsilenceforms
dotnet run
```

That's a running cross-platform app. Now the reference material.

**Your API documentation is the control gallery.** There is no standalone API reference yet, so the
fastest answer to "does `TreeView` support X" is the gallery — one demo panel per built-in control. The
quickest look costs nothing: the [live browser gallery]({{ '/gallery/' | relative_url }}) is the real
framework compiled to WebAssembly, no install required.

![The ControlGallery sample running on macOS, with the Button panel selected]({{ '/assets/img/gallery-macos.png' | relative_url }})

*`ControlGallery` on macOS 26, Avalonia backend, `Button` panel selected. Note what is and isn't the
framework's: the traffic-light caption is the OS's, and every pixel below it — the nav tree, its
scrollbar, the button variants — is drawn by Majorsilence.Forms through Skia.*

When you need to read the code behind a control rather than just look at it, clone the repository for
its [`samples/`]({{ site.github_url }}/tree/main/samples) folder and run what you want to study:

```
git clone https://github.com/majorsilence/Majorsilence.Forms.git
dotnet run --project samples/Gallery.Avalonia   # the gallery, on the desktop backend
dotnet run --project samples/Explorer           # a Windows Explorer clone
dotnet run --project samples/Outlaw             # an Outlook clone
```

> **Run samples with `dotnet run --project …`, or from the build output directory — not from the repo
> root.** Each sample loads icons through a *relative* path (`ImageLoader` uses `"Images"`), which
> resolves against the **process working directory**, not the assembly location. Launch the built
> executable from anywhere else and every icon file misses — and `Bitmap(string)` degrades to a 1×1
> placeholder rather than throwing, so the app boots cleanly, logs nothing, and renders with every icon
> invisible.
>
> Worth doing once on purpose, because **your own app inherits this behavior**. The fix in your code is
> to resolve assets against the assembly location:
>
> **C#**
>
> ```csharp
> using Majorsilence.Forms.Drawing;
>
> static readonly string ImageRoot =
>     Path.Combine (AppContext.BaseDirectory, "Images");
>
> public static Bitmap Load (string fileName)
>     => new Bitmap (Path.Combine (ImageRoot, fileName));
> ```
>
> **VB.NET**
>
> ```vb
> Imports System.IO
> Imports Majorsilence.Forms.Drawing
>
> Private Shared ReadOnly ImageRoot As String =
>     Path.Combine(AppContext.BaseDirectory, "Images")
>
> Public Shared Function Load(fileName As String) As Bitmap
>     Return New Bitmap(Path.Combine(ImageRoot, fileName))
> End Function
> ```
>
> It is the [silent-no-op failure mode](#module-3-cost) in miniature, and meeting it on a sample you
> *know* works is much cheaper than meeting it for the first time in production.

**Exercise 0.** Create the template app, run it, and add a `Button` that shows a `MessageBox`. Then
open the live gallery and find three controls your own application depends on.

---

## Module 1 — The mental model: self-drawn controls on a swappable host
{:#module-1}

**Outcome:** you can predict which WinForms idioms carry over untouched, which behave differently, and
which cannot work at all — from first principles rather than by looking things up.

There is one architectural fact, and almost everything else follows from it:

> **Majorsilence.Forms does all of its own drawing with SkiaSharp. The windowing toolkit underneath is
> only a host.**

```
        Your app  (Forms, controls, Designer files — the WinForms model you know)
            │
       Majorsilence.Forms  (controls + WinForms-compatible API, drawn with SkiaSharp)
            │
   Swappable host backend
   ├─ Avalonia   → Windows · macOS · Linux  (default)  · also Android · iOS · Browser
   ├─ Uno        → desktop · iOS · Android · WebAssembly
   └─ Headless   → offscreen rendering for tests / CI
```

Every control paints into a Skia canvas. The host underneath creates native windows, runs the message
loop, delivers input, and presents the rendered surface — and that's all it does. The core package
references no windowing toolkit whatsoever; the backend you reference supplies one. For you as an app
developer that seam has exactly two practical consequences: **one line in your project file picks your
host** ([module 6](#module-6)), and **no toolkit type ever appears in your code** — you write against
`Form`, `Control`, `MouseButtons`, `Keys` and `System.Drawing` value types, the same as WinForms.

### What follows from it
{:#module-1-consequences}

This table is the payoff of the module. Everything in it is a behavioral difference you can reason your
way to, rather than memorize.

| Because drawing is the framework's and windows are the host's… | So… |
|---|---|
| One native OS window per top-level window; everything inside it is painted | `Control.Handle` is `IntPtr.Zero`. There is no OS object behind a `Button` to report. See [module 9](#module-9). |
| `WindowBase.Handle` still has to satisfy the WinForms "touch `.Handle` to force creation" idiom | It returns an **opaque nonzero token — not an `HWND`**. Never hand it to native code. `WindowBase.PlatformHandle` is the genuine article (Avalonia backend only). |
| Appearance is resolved by the framework, not by Win32 | `BackColor`, `ForeColor` and `Font` are **ambient** — see the example below. |
| Input routing is the framework's | **Mouse capture belongs to the control that took it for the whole gesture** — a drag begun on a container survives crossing a button sitting on it. A child that takes capture itself still wins over its ancestors. |
| A `Form` is not a `Control` here — it derives from an internal `WindowBase` | The common `Control` members exist on `Form` (`Anchor`, `Dock`, `TabIndex`, `Padding`/`Margin`, `Parent`, `MouseEnter`/`MouseLeave`), but a `Form` still can't go into a `Control.ControlCollection` or be found by a `Control`-typed walk of a tree. |
| Touch is a first-class input, not mouse emulation | `Control` raises `LongPress`, `Pinch`, `Swipe` and `ScrollGesture`. **None of them fire for the mouse.** `ScrollableControl` already applies `ScrollGesture` to `AutoScrollPosition`, so your `Panel`/`ListBox`/`TreeView` subclasses get touch panning with no code changes. |

**Ambient appearance, the WinForms idiom that survives.** `BackColor`, `ForeColor` and `Font` each walk
the control's own style chain, then the parent chain, then the hosting window, then the theme. So
colouring a container once and letting its children pick it up works exactly as you expect:

**C#**

```csharp
var panel = new Panel {
    BackColor = Color.FromArgb (32, 32, 32),
    ForeColor = Color.White,                 // children inherit this…
    Dock = DockStyle.Fill
};

panel.Controls.Add (new Label  { Text = "Inherits white text", Left = 12, Top = 12 });
panel.Controls.Add (new Button { Text = "So does this",        Left = 12, Top = 40 });

// …but an input surface pins its own background, because WinForms gives it SystemColors.Window.
panel.Controls.Add (new TextBox { Left = 12, Top = 80, Width = 200 });   // stays light
Controls.Add (panel);
```

**VB.NET**

```vb
Dim panel As New Panel With {
    .BackColor = Color.FromArgb(32, 32, 32),
    .ForeColor = Color.White,
    .Dock = DockStyle.Fill
}

panel.Controls.Add(New Label With {.Text = "Inherits white text", .Left = 12, .Top = 12})
panel.Controls.Add(New Button With {.Text = "So does this", .Left = 12, .Top = 40})

' An input surface pins its own background, because WinForms gives it SystemColors.Window.
panel.Controls.Add(New TextBox With {.Left = 12, .Top = 80, .Width = 200})   ' stays light
Controls.Add(panel)
```

![The ambient appearance example running on macOS]({{ '/assets/img/example-ambient.png' | relative_url }})

*That exact code, running. The `Label` and `Button` captions inherited white from the panel; the
`TextBox` kept its own light background.*

That deliberate asymmetry — containers cascade, `TextBox`/`ComboBox` don't — is the single most common
"why is my dark theme half-applied" question, and it is WinForms-correct.

The portability all this buys is visible. Same `Explorer` sample, three operating systems, one
codebase:

![The Explorer sample on Windows]({{ '/assets/img/explorer-windows.png' | relative_url }})

*Windows — from the project's own docs.*

![The Explorer sample on Ubuntu]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

*Ubuntu (AMD64) — from the project's own docs.*

![The Explorer sample on macOS]({{ '/assets/img/explorer-macos.png' | relative_url }})

*macOS 26 — captured from the current build.*

**Exercise 1.** Answer from the table above, without searching: if you pass `myButton.Handle` to a
native video library, what happens, and what should you do instead? Then find one place in your own
WinForms codebase that sets `BackColor` on a container and relies on children inheriting it, and
predict whether it still works.

---

## Module 2 — Your first app
{:#module-2}

**Outcome:** you can create a Majorsilence.Forms app from scratch, in either language, and explain what
every line does.

### The project file
{:#module-2-project}

Start from a console app and change three things.

**C# — `MyApp.csproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.0.30" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.0.30" />
  </ItemGroup>
</Project>
```

**VB.NET — `MyApp.vbproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>MyApp</RootNamespace>
    <OptionStrict>On</OptionStrict>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.0.30" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.0.30" />
  </ItemGroup>
</Project>
```

Note what is **not** there in the VB version: no `MyType`, no VB application framework. That's the one
structural difference the migrator can't paper over, and it's why
[`--dual-build` isn't offered for VB](#module-5-dualbuild).

**Both packages, and this is the part to say out loud in training.** The core `Majorsilence.Forms`
package references no windowing toolkit at all — only SkiaSharp. It owns the controls and the drawing;
it cannot put a window on screen. `Majorsilence.Forms.Avalonia` is the backend that does, and
referencing it is what makes the app *runnable* on Windows, macOS and Linux. Swap that second line for
`Majorsilence.Forms.Uno` or `Majorsilence.Forms.Headless` to target a different host — that one line is
the whole switch ([module 6](#module-6)).

### The smallest complete app
{:#module-2-code}

**C#**

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}

static class Program
{
    [STAThread]
    static void Main (string [] args)
    {
        Application.Run (new MainForm ());
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Public Class MainForm
    Inherits Form
End Class

Module Program
    <STAThread>
    Sub Main(args As String())
        Application.Run(New MainForm())
    End Sub
End Module
```

That app runs on Windows, macOS and Linux with no further configuration, because the backend is
resolved automatically when its package is referenced. If you want a *different* backend, assign it
**before the first window is created**:

**C#**

```csharp
Majorsilence.Forms.Backends.Platform.Backend =
    new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Application.Run (new MainForm ());     // must come after
```

**VB.NET**

```vb
Majorsilence.Forms.Backends.Platform.Backend =
    New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Application.Run(New MainForm())        ' must come after
```

That ordering constraint is real and bites people: constructing a form touches the backend. It is also
why the mobile and browser entry points ([module 6](#module-6)) take a *factory* rather than an
instance.

### A form that actually does something
{:#module-2-interactive}

Layout in code, an event handler, a dialog, and a modal result — the four things every screen needs.
Note this is ordinary WinForms muscle memory: `Anchor`, `Dock`, `DialogResult`, `MessageBox`.

**C#**

```csharp
using Majorsilence.Forms;
using System.Drawing;

public class GreetForm : Form
{
    private readonly TextBox nameBox;
    private readonly Button  okButton;

    public GreetForm ()
    {
        Text = "Greeter";
        ClientSize = new Size (360, 140);

        var prompt = new Label {
            Name = "promptLabel", Text = "Your name:",
            Left = 12, Top = 16, Width = 100
        };

        nameBox = new TextBox {
            Name = "nameBox", AccessibleName = "Full name",
            Left = 12, Top = 40, Width = 336,
            Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
        };

        okButton = new Button {
            Name = "okButton", Text = "OK",
            Left = 188, Top = 96, Width = 75,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Right
        };

        var cancelButton = new Button {
            Name = "cancelButton", Text = "Cancel",
            Left = 273, Top = 96, Width = 75,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Right
        };

        okButton.Click     += OkButton_Click;
        cancelButton.Click += (sender, e) => {
            DialogResult = DialogResult.Cancel;
            Close ();
        };

        Controls.Add (prompt);
        Controls.Add (nameBox);
        Controls.Add (okButton);
        Controls.Add (cancelButton);
    }

    private void OkButton_Click (object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace (nameBox.Text)) {
            MessageBox.Show ("Please enter a name.", "Greeter",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        DialogResult = DialogResult.OK;
        Close ();
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports System.Drawing

Public Class GreetForm
    Inherits Form

    Private ReadOnly nameBox As TextBox
    Private ReadOnly okButton As Button

    Public Sub New()
        Text = "Greeter"
        ClientSize = New Size(360, 140)

        Dim prompt As New Label With {
            .Name = "promptLabel", .Text = "Your name:",
            .Left = 12, .Top = 16, .Width = 100
        }

        nameBox = New TextBox With {
            .Name = "nameBox", .AccessibleName = "Full name",
            .Left = 12, .Top = 40, .Width = 336,
            .Anchor = AnchorStyles.Top Or AnchorStyles.Left Or AnchorStyles.Right
        }

        okButton = New Button With {
            .Name = "okButton", .Text = "OK",
            .Left = 188, .Top = 96, .Width = 75,
            .Anchor = AnchorStyles.Bottom Or AnchorStyles.Right
        }

        Dim cancelButton As New Button With {
            .Name = "cancelButton", .Text = "Cancel",
            .Left = 273, .Top = 96, .Width = 75,
            .Anchor = AnchorStyles.Bottom Or AnchorStyles.Right
        }

        AddHandler okButton.Click, AddressOf OkButton_Click
        AddHandler cancelButton.Click,
            Sub(sender As Object, e As EventArgs)
                DialogResult = DialogResult.Cancel
                Close()
            End Sub

        Controls.Add(prompt)
        Controls.Add(nameBox)
        Controls.Add(okButton)
        Controls.Add(cancelButton)
    End Sub

    Private Sub OkButton_Click(sender As Object, e As EventArgs)
        If String.IsNullOrWhiteSpace(nameBox.Text) Then
            MessageBox.Show("Please enter a name.", "Greeter",
                            MessageBoxButtons.OK, MessageBoxIcon.Warning)
            Return
        End If

        DialogResult = DialogResult.OK
        Close()
    End Sub
End Class
```

![The GreetForm example running on macOS]({{ '/assets/img/example-greet.png' | relative_url }})

*`GreetForm`, running. The `TextBox` stretched with the window because of its
`Top | Left | Right` anchor; the two buttons stayed pinned bottom-right.*

Press OK with the box empty and the validation path runs:

![The MessageBox from the validation path]({{ '/assets/img/example-messagebox.png' | relative_url }})

*`MessageBox.Show` opens a real modal window — it blocks the handler and disables the parent, as it
should. Note the honest detail: `MessageBoxIcon.Warning` is accepted but no warning glyph is drawn
yet. That's the [stub policy](#module-3-stub-policy) in action — the call works, one visual detail
doesn't, and nothing throws.*

Showing it modally from a parent form is unchanged from WinForms:

**C#**

```csharp
using var dialog = new GreetForm ();

if (dialog.ShowDialog (this) == DialogResult.OK)
    statusLabel.Text = "Hello!";
```

**VB.NET**

```vb
Using dialog As New GreetForm()
    If dialog.ShowDialog(Me) = DialogResult.OK Then
        statusLabel.Text = "Hello!"
    End If
End Using
```

Two things to notice, because they're the ones that catch people: the `Name` on every interactive
control isn't decoration — it becomes the test locator *and* the accessibility id
([module 8](#module-8)) — and `Anchor` uses `AnchorStyles.Top Or AnchorStyles.Left` in VB where C# uses
`|`, which is the single most common VB porting typo.

### What a real app looks like
{:#module-2-real}

A single form is not a training target. The `PointOfSale` sample is the shape to copy for
line-of-business work — four projects, not one:

| Project | Role |
|---|---|
| `PointOfSale.Client` | The Majorsilence.Forms desktop app (forms, panels, custom controls, services) |
| `PointOfSale.Api` | ASP.NET Core minimal API with JWT auth and role-based policies |
| `PointOfSale.Contracts` | DTOs shared by both sides |
| `PointOfSale.Data` | EF Core + SQLite persistence and seeding |

Nothing about the UI layer constrains your architecture: it is an ordinary .NET client, so your
existing DI, HTTP, logging and persistence choices all carry over unchanged.

And `Outlaw` is the answer to "does it hold up for a complex, multi-pane app?":

![The Outlaw sample, an Outlook clone, running on macOS]({{ '/assets/img/outlaw-macos.png' | relative_url }})

*`Outlaw` on macOS 26 — an Outlook clone, deliberately not a toy demo: an icon rail, folder tree,
virtualized message list and status bar, all drawn by Majorsilence.Forms. The message row is selected;
the reading pane stays a placeholder because the sample never wires selection to it — it's a layout and
control-density exercise, not a mail client.*

**Plan around this now:** there is **no visual designer yet**. Designer *code* migrates and runs — the
`*.Designer.cs`/`*.Designer.vb` pattern is preserved as-is, and the design-time types your control
libraries reference still compile — but nothing instantiates them at runtime and there is no design
surface to edit layout in. It is a wanted feature with a written plan, not a deferred one. Budget for
hand-editing designer files, or for laying out in code as above.

**Exercise 2.** Build `GreetForm` in your team's language. Then switch the backend package to Headless
and confirm the app starts and exits without opening a window — you'll reuse exactly that setup in
[module 8](#module-8).

---

## Module 3 — Knowing what works before you build on it
{:#module-3}

**Outcome:** before relying on any member, you know how to find out whether it really works — and you
recognise the framework's characteristic failure mode on sight.

This is the most important module in the guide. Read the
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) once end to end,
then keep it open while you work. It exists for exactly your situation: a developer with a WinForms
codebase deciding what to trust.

### The stub policy
{:#module-3-stub-policy}

> **If a member has no working implementation yet, it safely no-ops (or returns a sensible default)
> instead of throwing `NotImplementedException`.**

That is a deliberate, consistent policy across the whole compatibility layer, and it is what lets
migrated code compile *and run* even where a visual feature does nothing yet. Concretely:

- A property with no backing behavior is a plain settable auto-property — it stores what you set and
  reads back, it just doesn't change runtime behavior.
- A method with no implementation returns a neutral value rather than throwing — e.g. a dialog whose
  `ShowDialog()` has no real UI yet returns `DialogResult.OK` immediately.
- An event that is never raised still compiles and can be subscribed to; it simply never fires. Used
  sparingly, and called out per type in the matrix.

**If you hit a member that throws instead of stubbing, that's a bug — report it**
([module 10](#module-10-gaps)).

### The cost of that policy — and the story to tell your team
{:#module-3-cost}

A silent no-op is the hardest kind of gap to find: it compiles, it runs, and the only symptom is wrong
output somewhere downstream. The canonical example is worth telling verbatim, because it teaches the
failure mode better than any rule:

`Image.MakeTransparent` was empty. Ported game code keyed a sprite sheet's background colour to
transparent, the call did nothing, and every sprite drew with a white box behind it. Nothing threw.
There was nothing to grep for.

Two things follow for you. First, **when something renders or behaves wrongly and nothing threw,
suspect a stub before you suspect your own code** — check the matrix row for the member involved.
Second, that class of gap is now guarded: the project pins its known empty-bodied public methods in a
baseline test, so a new one can't be added silently, and the entries shrink over releases. That's why
the matrix is worth trusting as a reference rather than treating as marketing.

### Pin the behavior you depend on
{:#module-3-pin}

The practical defence is a test per assumption. When a feature matters, assert the *effect*, not the
member's existence — that's the difference between a test that catches a stub and one that doesn't:

**C#**

```csharp
using Majorsilence.Forms.Drawing;
using Majorsilence.Forms.Drawing.Imaging;
using Xunit;

[Fact]
public void MakeTransparent_actually_clears_the_key_colour ()
{
    using var bitmap = new Bitmap (4, 4);
    using (var g = Graphics.FromImage (bitmap))
    using (var brush = new SolidBrush (Color.Magenta))
        g.FillRectangle (brush, new Rectangle (0, 0, 4, 4));

    bitmap.MakeTransparent (Color.Magenta);

    // Assert the RESULT, not that the method exists — a stub would pass an "it compiles" test.
    Assert.Equal (0, bitmap.GetPixel (0, 0).A);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing
Imports Majorsilence.Forms.Drawing.Imaging
Imports Xunit

<Fact>
Public Sub MakeTransparent_actually_clears_the_key_colour()
    Using bitmap As New Bitmap(4, 4)
        Using g = Graphics.FromImage(bitmap)
            Using brush As New SolidBrush(Color.Magenta)
                g.FillRectangle(brush, New Rectangle(0, 0, 4, 4))
            End Using
        End Using

        bitmap.MakeTransparent(Color.Magenta)

        ' Assert the RESULT, not that the method exists.
        Assert.Equal(0, CInt(bitmap.GetPixel(0, 0).A))
    End Using
End Sub
```

Write one of those for each member on your critical path. It costs minutes and it converts a silent
no-op into a red build the day it matters.

### Check, don't assume — the evidence
{:#module-3-apidiff}

The project diffs its own public surface against the real `System.Windows.Forms` reference assembly by
reflection and keeps the result as a committed baseline. That audit's first run found **1,905 missing
entries** — including **126 enum members that exist with the wrong numeric value**. That last category
is the one to take personally: the code compiles, runs, and silently means something else. It is the
best argument available for verifying the specific members your app leans on instead of assuming
parity.

### Reading the per-control table
{:#module-3-reading}

Status in the matrix is scored from a migrating developer's point of view:

| Status | Means |
|---|---|
| **Implemented** | The mainstream surface is there. Gaps are limited to deep/rare corners or the systemic patterns the matrix states once. |
| **Partial** | Names the specific commonly-used members that are missing. |
| **Missing** | The type doesn't exist under that name at all. |

The high-traffic controls (`Button`, `TextBox`, `Panel`, `TabControl`, `TableLayoutPanel`, `TreeView`,
`ListView`, menus, toolbars, status bars, common dialogs, …) are functionally implemented, not stubs.
The gaps worth knowing before you plan work:

| Type | Watch out for |
|---|---|
| `DataGridView` | The largest single-type gap — but the highest-traffic hooks are **real and firing**: `CellFormatting`, `CellPainting`, `RowPrePaint`/`RowPostPaint`, `CellParsing`, `RowValidating`/`RowValidated`, `GetClipboardContent()`, and the border-style properties. Still declared-but-never-raised: `RowsAdded`/`RowsRemoved`, `DataError`, `SortCompare`, `CellValueNeeded`/`CellValuePushed`, the `CellMouse*` family, and the granular `*Changed` events. Auto-sizing only invalidates. |
| `ListView` | No owner-draw, no virtual-mode retrieval callbacks (`VirtualMode` is a plain property), no `InsertionMark`. |
| `TreeView` | No `Sorted`, no `ImageKey`/`SelectedImageKey` (index-based `ImageIndex` works), no `HitTest`, no `ShowNodeToolTips`. |
| `ComboBox`/`ListBox`/`CheckedListBox` | `DataSource`/`DisplayMember`/`ValueMember` exist; the binding *format* hooks and `Sort()` don't. |
| `RichTextBox`, `MaskedTextBox` | Undo/redo and `SelectedRtf`; overwrite-mode and char-index positioning, respectively. |
| `ToolStrip` family | `MenuStrip`/`ContextMenuStrip`/`StatusStrip` genuinely derive from `ToolStrip`, so the whole surface is reachable — but the `ToolStrip`-level members are stubs. Assigning `Renderer`/`RenderMode` does **not** change painting; `LayoutStyle` does not change layout; there is no overflow button. What works is what each control already did well. |
| `WebBrowser` | Navigation works; there is no DOM object model at all (`Document`, `HtmlElement`, …), because it's backed by a real webview, not COM automation. |
| Common dialogs | Results and `ShowDialog()` work. Windows-shell-only extras (`CustomPlaces`, `AutoUpgradeEnabled`, dialog hook plumbing) are absent — expected, there's no native dialog to hook. |

**Working with the grid, concretely.** Since `DataGridView` is where most LOB apps live, here is the
shape that *is* supported — formatting and painting through the events that really fire, rather than
through the members that don't:

**C#**

```csharp
var grid = new DataGridView { Name = "ordersGrid", Dock = DockStyle.Fill };
grid.DataSource = orders;

// CellFormatting is real: it fires per cell during paint.
grid.CellFormatting += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name != "Total")
        return;

    if (e.Value is decimal total) {
        e.Value = total.ToString ("C");
        e.CellStyle.ForeColor = total < 0 ? Color.Firebrick : Color.Black;
        e.FormattingApplied = true;          // tell the grid not to format it again
    }
};

// CellParsing is real too: it runs on edit commit, and your typed value is what gets stored.
grid.CellParsing += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name == "Total"
        && decimal.TryParse (e.Value?.ToString (), out var parsed)) {
        e.Value = parsed;
        e.ParsingApplied = true;
    }
};
```

**VB.NET**

```vb
Dim grid As New DataGridView With {.Name = "ordersGrid", .Dock = DockStyle.Fill}
grid.DataSource = orders

' CellFormatting is real: it fires per cell during paint.
AddHandler grid.CellFormatting,
    Sub(sender As Object, e As DataGridViewCellFormattingEventArgs)
        If grid.Columns(e.ColumnIndex).Name <> "Total" Then Return

        If TypeOf e.Value Is Decimal Then
            Dim total = CDec(e.Value)
            e.Value = total.ToString("C")
            e.CellStyle.ForeColor = If(total < 0, Color.Firebrick, Color.Black)
            e.FormattingApplied = True        ' tell the grid not to format it again
        End If
    End Sub

' CellParsing is real too: it runs on edit commit, and your typed value is what gets stored.
AddHandler grid.CellParsing,
    Sub(sender As Object, e As DataGridViewCellParsingEventArgs)
        Dim parsed As Decimal
        If grid.Columns(e.ColumnIndex).Name = "Total" AndAlso
           Decimal.TryParse(If(e.Value?.ToString(), String.Empty), parsed) Then
            e.Value = parsed
            e.ParsingApplied = True
        End If
    End Sub
```

![The DataGridView CellFormatting example running on macOS]({{ '/assets/img/example-grid.png' | relative_url }})

*That code, running against a plain `List<Order>`: columns auto-generated from the bound type, values
formatted as currency, and negatives red because the handler's `e.CellStyle.ForeColor` really does
reach the renderer.*

> **One version caveat worth knowing if you pin 26.0.30.** In the package as published, bound cell
> values arrive at `CellFormatting` already converted to strings, so `e.Value is decimal` never
> matches and this handler silently does nothing — the exact failure mode this module is about. It is
> fixed in the framework's main branch (bound cells now keep the member's type), so the code above is
> correct going forward. If you're on the published 26.0.30 and see unformatted values, parse
> defensively instead: `decimal.TryParse (e.Value?.ToString (), out var total)`. That form works
> either way.

What you must *not* write against yet, from the same table: `RowsAdded`, `DataError`, `SortCompare`,
`CellValueNeeded` (so no virtual mode), and the `CellMouse*` family. Each compiles and silently never
fires — exactly the failure mode from [above](#module-3-cost).

Two notes for teams coming from vendor stacks. **Telerik UI for WinForms** has a first-class
compatibility layer (`Majorsilence.Forms.Telerik`) whose own source states the deal plainly: *coverage
is compile-and-approximate, not pixel-perfect*. And **spellcheck** (wired into `TextBox`) is a
dependency-free from-scratch implementation with wavy underlines and a suggestions menu — not a
WinForms API at all; it exists to back Telerik's `RadSpellChecker`.

**Exercise 3.** Pick three members your own app depends on — one you're sure about, one you're not, and
one exotic. For each, determine from the matrix whether it is implemented, stubbed, or absent, then
write a [pinning test](#module-3-pin) for the one you're least sure of.

---

## Module 4 — Drawing and custom paint
{:#module-4}

**Outcome:** you know which `System.Drawing` types stay, which move, and how to write both
WinForms-style and Skia-native painting code.

`Majorsilence.Forms.Drawing` is a Skia-backed, cross-platform replacement for the Windows-only
`System.Drawing.Common` (GDI+). The split that governs everything:

| Source | Target | Why |
|---|---|---|
| `System.Drawing` **primitives** — `Color`, `Point`, `PointF`, `Size`, `SizeF`, `Rectangle`, `RectangleF` | *unchanged* | They ship in `System.Drawing.Primitives` on every platform already. |
| `System.Drawing` **GDI+ types** — `Bitmap`, `Font`, `Pen`, `Brush`, `Graphics`-adjacent | `Majorsilence.Forms.Drawing` | GDI+ is Windows-only in `System.Drawing.Common`; reimplemented on SkiaSharp. |
| `System.Drawing.Drawing2D` / `.Imaging` / `.Text` | `Majorsilence.Forms.Drawing.Drawing2D` / `.Imaging` / `.Text` | Same split, sub-namespaced. |
| `System.Drawing.Printing` | `Majorsilence.Forms.Printing` | Printing sits on the Forms side of the compatibility layer, not the drawing side. |
| `System.Windows.Forms.VisualStyles`, `System.Drawing.Design`, `System.ComponentModel.Design` | *left alone* | No equivalent — flagged for manual review rather than rewritten into something that doesn't exist. |

One packaging detail that trips people who try to use the drawing layer on its own: the value types,
images, fonts and resources live in the `Majorsilence.Forms.Drawing.Common` package, but **`Graphics`
itself ships in the core `Majorsilence.Forms` package** (still under the
`Majorsilence.Forms.Drawing` namespace). So headless image manipulation needs the core package
referenced too — which you have anyway in any app.

Three specifics that cause real support tickets:

1. **`System.Drawing.Common` must be removed from your project**, not merely because it's Windows-only
   from .NET 7 on, but because leaving it referenced puts `System.Drawing.Bitmap`/`Font`/`Pen` back in
   scope beside the Majorsilence replacements — every unqualified use then fails as an *ambiguous
   reference* rather than resolving to the port.
2. **`SystemColors` and `ColorTranslator` are the ambiguity exceptions.** They live in
   `System.Drawing.Primitives`, so they're still resolvable through the `using System.Drawing;` you keep
   for primitives — and used unqualified they collide with the Majorsilence ones (CS0104). The fix is a
   one-line alias, which the migrator adds for you, only in files that need it:

   **C#**

   ```csharp
   using System.Drawing;
   using SystemColors = Majorsilence.Forms.SystemColors;
   ```

   **VB.NET**

   ```vb
   Imports System.Drawing
   Imports SystemColors = Majorsilence.Forms.SystemColors
   ```

3. **The gradient and hatch brushes live where GDI+ puts them**: `LinearGradientBrush`,
   `PathGradientBrush`, `HatchBrush` and `HatchStyle` are in `Majorsilence.Forms.Drawing.Drawing2D`.
   `Brush`, `SolidBrush` and `TextureBrush` are in `Majorsilence.Forms.Drawing` — those really are
   `System.Drawing` types. Code reaching them through the rewritten import is unaffected; only a
   fully-qualified reference needs updating.

### Offscreen image work
{:#module-4-offscreen}

`Graphics.FromImage` works the way it does in GDI+, which means most of your existing imaging code
ports by changing imports alone:

**C#**

```csharp
using Majorsilence.Forms.Drawing;
using Majorsilence.Forms.Drawing.Drawing2D;
using Majorsilence.Forms.Drawing.Imaging;
using System.Drawing;

public static void SaveThumbnail (string sourcePath, string targetPath, int width)
{
    using var source = new Bitmap (sourcePath);
    var height = (int) (source.Height * (width / (double) source.Width));

    using var thumb = new Bitmap (width, height);

    using (var g = Graphics.FromImage (thumb)) {
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.SmoothingMode     = SmoothingMode.AntiAlias;

        g.DrawImage (source,
            new Rectangle (0, 0, width, height),
            0, 0, source.Width, source.Height,
            GraphicsUnit.Pixel);

        using var watermark = new SolidBrush (Color.FromArgb (96, Color.Black));
        g.FillRectangle (watermark, new Rectangle (0, height - 18, width, 18));
    }

    thumb.Save (targetPath, ImageFormat.Png);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing
Imports Majorsilence.Forms.Drawing.Drawing2D
Imports Majorsilence.Forms.Drawing.Imaging
Imports System.Drawing

Public Shared Sub SaveThumbnail(sourcePath As String, targetPath As String, width As Integer)
    Using source As New Bitmap(sourcePath)
        Dim height = CInt(source.Height * (width / CDbl(source.Width)))

        Using thumb As New Bitmap(width, height)
            Using g = Graphics.FromImage(thumb)
                g.InterpolationMode = InterpolationMode.HighQualityBicubic
                g.SmoothingMode = SmoothingMode.AntiAlias

                g.DrawImage(source,
                            New Rectangle(0, 0, width, height),
                            0, 0, source.Width, source.Height,
                            GraphicsUnit.Pixel)

                Using watermark As New SolidBrush(Color.FromArgb(96, Color.Black))
                    g.FillRectangle(watermark, New Rectangle(0, height - 18, width, 18))
                End Using
            End Using

            thumb.Save(targetPath, ImageFormat.Png)
        End Using
    End Using
End Sub
```

![The thumbnail produced by the offscreen imaging example]({{ '/assets/img/example-thumbnail.png' | relative_url }})

*The actual output of that method: a 1080×752 screenshot resized to 320 px wide with bicubic
interpolation, with the semi-transparent watermark bar along the bottom.*

That code has no UI dependency at all — it runs in a console app, a service, or a test.

### Custom paint: two ways, and when to use each
{:#module-4-paint}

`PaintEventArgs` gives you **both** surfaces. `e.Graphics` is the GDI+-shaped wrapper, so ported
`OnPaint` code compiles unchanged. `e.Canvas` is the raw `SKCanvas` the framework itself draws with —
reach for it when you want something Skia does well and GDI+ never did.

**C# — WinForms-style, ports unchanged**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Drawing;
using System.Drawing;

public class Badge : Control
{
    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);

        using var fill = new SolidBrush (Color.FromArgb (110, 67, 166));
        using var pen  = new Pen (Color.White, 2);

        e.Graphics.FillRectangle (fill, ClientRectangle);
        e.Graphics.DrawRectangle (pen, 1, 1, Width - 3, Height - 3);
    }
}
```

**VB.NET — WinForms-style, ports unchanged**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Drawing
Imports System.Drawing

Public Class Badge
    Inherits Control

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        MyBase.OnPaint(e)

        Using fill As New SolidBrush(Color.FromArgb(110, 67, 166))
            Using pen As New Pen(Color.White, 2)
                e.Graphics.FillRectangle(fill, ClientRectangle)
                e.Graphics.DrawRectangle(pen, 1, 1, Width - 3, Height - 3)
            End Using
        End Using
    End Sub
End Class
```

**C# — Skia-native, for effects GDI+ can't express**

```csharp
using SkiaSharp;

protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    using var paint = new SKPaint {
        IsAntialias = true,
        Shader = SKShader.CreateLinearGradient (
            new SKPoint (0, 0), new SKPoint (0, Height),
            new [] { new SKColor (110, 67, 166), new SKColor (185, 138, 255) },
            SKShaderTileMode.Clamp)
    };

    // Rounded rect with a real gradient shader — one call, no GDI+ equivalent.
    e.Canvas.DrawRoundRect (new SKRect (0, 0, Width, Height), 12, 12, paint);
}
```

**VB.NET — Skia-native**

```vb
Imports SkiaSharp

Protected Overrides Sub OnPaint(e As PaintEventArgs)
    MyBase.OnPaint(e)

    Using paint As New SKPaint With {
        .IsAntialias = True,
        .Shader = SKShader.CreateLinearGradient(
            New SKPoint(0, 0), New SKPoint(0, Height),
            {New SKColor(110, 67, 166), New SKColor(185, 138, 255)},
            SKShaderTileMode.Clamp)
    }
        ' Rounded rect with a real gradient shader — one call, no GDI+ equivalent.
        e.Canvas.DrawRoundRect(New SKRect(0, 0, Width, Height), 12, 12, paint)
    End Using
End Sub
```

![Both custom-paint approaches side by side, running on macOS]({{ '/assets/img/example-paint.png' | relative_url }})

*Both controls in one window. Left: the GDI+-shaped path — flat fill, 2 px white border. Right: the
Skia path — rounded corners and a real gradient shader, in a single `DrawRoundRect` call.*

**Guidance for your team:** migrate with `e.Graphics` (it's free — the code already exists), and reach
for `e.Canvas` deliberately for new visuals. Mixing them in one handler is fine; they draw to the same
surface.

One trap when you go Skia-native: **raw `SKFont`/`DrawText` does no font fallback.** The framework's own
text rendering resolves missing glyphs through a fallback chain, but a bare `SKTypeface.Default` does
not — draw a string containing a glyph that typeface lacks (an arrow, an emoji, CJK) and you get the
missing-glyph box, silently. Stick to `e.Graphics.DrawString` for user-facing text, or pick your
typeface explicitly.

Where Skia genuinely cannot follow GDI+, the matrix says so rather than pretending: a `Pen` with a
custom line cap strokes using that cap's declared `BaseCap` (`SKPaint` offers only butt/round/square),
`Pen.Alignment` is stored but not applied, and assigning `Image.Palette` doesn't re-quantize because
modern SkiaSharp has no indexed bitmap type — every surface is 32bpp.

**Exercise 4.** Port one piece of GDI+ code you own — a thumbnail generator, a chart, a watermark —
against `Majorsilence.Forms.Drawing` in a console app with no UI. Then take one custom-painted control
and add a Skia-native touch (a gradient, a blur, a rounded clip) through `e.Canvas`.

---

## Module 5 — Migrating your WinForms app
{:#module-5}

**Outcome:** you can run `majorsilence-migrate` on your solution, read its report, and work the
manual-fix checklist that follows.

### Install
{:#module-5-install}

```
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help
```

Prefer a per-repo install (`dotnet new tool-manifest`, then
`dotnet tool install Majorsilence.Forms.Migrator`, run as `dotnet majorsilence-migrate`). Each GitHub
release also attaches a self-contained single-file binary per platform, if you'd rather not install a
tool at all.

### What the migration looks like in your source
{:#module-5-beforeafter}

Before anything else, see the size of the change. This is a typical form's head, before and after:

**C# — before**

```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**C# — after**

```csharp
using System;
using System.Drawing;                                        // kept: Color, Point, Size, Rectangle
using Majorsilence.Forms;                                    // was System.Windows.Forms
using Majorsilence.Forms.Drawing;                            // for Bitmap
using SystemColors = Majorsilence.Forms.SystemColors;         // added: resolves CS0104

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();                          // your Designer file is untouched
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**VB.NET — before**

```vb
Imports System.Drawing
Imports System.Windows.Forms

Public Class CustomerForm
    Inherits Form

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

**VB.NET — after**

```vb
Imports System.Drawing                                        ' kept: Color, Point, Size, Rectangle
Imports Majorsilence.Forms                                    ' was System.Windows.Forms
Imports Majorsilence.Forms.Drawing                            ' for Bitmap
Imports SystemColors = Majorsilence.Forms.SystemColors         ' added: resolves the ambiguity

Public Class CustomerForm
    Inherits Form

    ' The migrator also re-injects the implicit parameterless constructor that MyType=Empty
    ' used to supply, using knowledge of this form's Designer partial so it isn't duplicated.
    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

That's the whole shape of it: imports change, `Handles` clauses and designer code survive, and your
business logic isn't touched.

### Know what the tool is before you argue with it
{:#module-5-design}

`majorsilence-migrate` is a deliberate multi-pass **textual/regex rewriter**. It does not parse a
syntax tree or resolve symbols, and that is the point:

- **It works on broken code.** A half-migrated solution, a `.vb` referencing an unported type, a
  project with a missing reference — none of it stops the rewriter, because it never needs the code to
  compile or even parse. A Roslyn tool would refuse to touch a project until it builds, which defeats
  the purpose of a *first pass* over a legacy codebase.
- **It's fast** — thousands of files in seconds.
- **What it gives up:** true cross-project symbol resolution. It can't tell whether a bare `Panel` is
  `System.Windows.Forms.Panel` or your own class named `Panel`; it relies on namespace-prefix patterns
  and import context. Every namespace it doesn't recognise is **flagged for manual review rather than
  silently guessed at**.

There *is* an opt-in second engine for exactly that blind spot — `--engine roslyn`, layered on top of
the textual one, using real symbol resolution:

| | `--engine text` (default) | `--engine roslyn` |
|---|---|---|
| Input | Any `.sln`/`.csproj`/`.vbproj`/directory/single file | Needs a **loadable** project; a bare directory or single file falls back to text for the whole run, with a warning |
| Tolerates non-compiling code | Yes | No |
| Speed | Seconds | Orders of magnitude slower (MSBuild evaluation dominates) |
| Same-named-type disambiguation | No | **Yes — the reason it exists** |
| Failure handling | N/A | Fails closed *per project* (that project's files fall back to text). If MSBuild can't be located at all, the run hard-fails rather than silently downgrading |

**Team rule:** the first pass over a large legacy codebase always uses the default `--engine text`.
Reach for `--engine roslyn` afterwards, on the now-loadable result, only when you have a *confirmed*
case of a custom type sharing a bare name with a WinForms/GDI+ type. Note it also produces *fewer*
warnings in one place — it fixes unqualified GDI+ types under a bare `using System.Drawing;` outright
instead of flagging them. That divergence is not a regression.

### The recommended first run
{:#module-5-firstrun}

```
# On a clean git branch, dry-run first to see the scope:
majorsilence-migrate MySolution.sln --dry-run --diff

# Then run for real — the diff against the previous commit IS the migration:
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

Running in place on a git-tracked branch (with `--no-backup`, since git *is* your backup) makes the
migration idempotent and diffable: run it, inspect file by file, re-run safely when you pull in more
legacy code later.

Options worth knowing on day one:

| Option | Use |
|---|---|
| `-o, --output <dir>` | Write to a mirror tree instead of converting in place |
| `-n, --dry-run`, `--diff` | Scope it before you commit to it |
| `--backend <name>` | `avalonia` (default) \| `uno` \| `headless` — which backend package it references |
| `--tfm <tfm>` | Force a TFM. Default: keep the version, drop the `-windows` suffix |
| `--package-version <v>` | Defaults to the migrator's own version — tool and packages ship from the same release |
| `--map <file>` | Extra namespace mappings for a vendor with no built-in support (repeatable) |
| `--dual-build` | Keep a C# project building against real WinForms too — see below |
| `--strict` | Exit non-zero on any manual-review warning. **This is your CI gate.** |
| `--report <file>` / `--no-report` | The Markdown report |

For a vendor with no built-in mapping, a `--map` file is just JSON:

```json
{
  "namespaces":     { "DevExpress.XtraEditors": "Majorsilence.Forms.DevExpress" },
  "removePackages": [ "DevExpress.Win.*" ]
}
```

### What it actually changes
{:#module-5-changes}

1. **Project files** — removes `UseWindowsForms`/`UseWPF`, drops the `-windows` TFM suffix (including
   in imported `.props`/`.targets`), drops the Windows-desktop framework reference, removes
   WinForms-only NuGet packages (Telerik, DevExpress, **`System.Drawing.Common`**), and adds
   `Majorsilence.Forms` + a backend reference — **to every project it touches**. That set is wider than
   "WinForms projects": a plain class library that never mentions `System.Windows.Forms` still gets
   rewritten if it has an image or font helper, and can't compile without the reference. Projects using
   only the surviving primitives are left completely alone.
2. **Source files** — namespace rewrites via a longest-prefix-first table, duplicate imports collapsed,
   the `SystemColors`/`ColorTranslator` alias emitted where needed, and for VB: the implicit
   constructor re-injected, a `My.Resources` accessor generated, and remaining `My.*` usage warned on.
3. **Resx files** — scanned for image/type references that must survive the swap.
4. **Report** — a Markdown summary (default `migration-report.md`).

### Reading the report
{:#module-5-report}

Three sections matter:

- **Scanned vs. changed** counts — the scope of the diff, at a glance.
- **Per-file change list** — everything actually touched.
- **Manual review** — every warning grouped by cause: unsupported namespaces, unqualified GDI+ types
  under a bare `System.Drawing` import, `My.*` usage, and any project skipped outright. The most common
  skip is a **legacy non-SDK-style `.csproj`/`.vbproj`**, which you must convert to SDK style first — a
  project-format prerequisite, not something the migrator missed.

### Incremental migration with `--dual-build` (C# only)
{:#module-5-dualbuild}

By default the tool commits a project outright. `--dual-build` instead lets a C# project build against
**either** stack, switched by one MSBuild property — so your Windows developers can keep building
against real WinForms until they're satisfied. Project files are left otherwise untouched, and only the
top-of-file import becomes conditional:

```csharp
#if MAJORSILENCE_FORMS
using Majorsilence.Forms;
#else
using System.Windows.Forms;
#endif
```

Flip the build with a repo-root `Directory.Build.props`:

```xml
<Project>
  <PropertyGroup>
    <MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>
  </PropertyGroup>
</Project>
```

Two caveats. It's **deliberately narrow**: any *fully-qualified* reference in a file body
(`System.Windows.Forms.MessageBox.Show(...)`) is still rewritten unconditionally, and only compiles once
the symbol is defined.

And **there is no VB equivalent**, which is why this section has no VB sample. `MyType=Empty` switches
off the whole VB "My" application framework — implicit constructor, `My.*`, the lot — and no
preprocessor symbol can toggle that. A VB project passed `--dual-build` is converted the normal
committed way instead, with a warning explaining why. **For VB teams, plan a cut-over rather than a
dual-build period**, and keep the pre-migration branch alive until the converted one is trusted.

### The manual-fix checklist
{:#module-5-checklist}

The rewriter cannot see these. Work them explicitly after the diff lands — they are the difference
between "it compiled" and "it behaves".

| # | Change | What to do |
|---|---|---|
| 1 | **`SplitContainer.Orientation` changed meaning** — it is now the direction of the *bar*, as in WinForms, not of the layout. `Vertical` (default) = panels side by side. | If you never set it, nothing changes. **If you did set it, invert it.** Nothing warns you: both values compile before and after, and the migrator can't tell a `SplitContainer.Orientation` from any other `Orientation` in a textual pass. Grep it. Same for `Splitter`. |
| 2 | **Event delegate types now match WinForms.** `KeyDown`/`KeyUp` → `KeyEventHandler`; the `Mouse*` family → `MouseEventHandler`; `Form.FormClosing` → `FormClosingEventHandler`; `PrintDocument.PrintPage` → `PrintPageEventHandler`; `Control.MouseEnter` and the menu/tool-strip item `Click` → plain `EventHandler`. | Lambdas, `AddressOf` handlers and VB `Handles` clauses keep working. **Explicitly constructed** `new KeyEventHandler<…>`-style wrappers in C# (`new EventHandler<KeyEventArgs>(…)`) no longer convert — drop the wrapper or name the WinForms delegate. |
| 3 | **`Click` and `MouseEnter` no longer carry mouse coordinates** — because in WinForms they never did. | A handler reading `e.X`/`e.Button` off `Click` moves to `MouseClick`. On a menu item (no mouse-typed variant in WinForms either), take the position from the owning control. In C#, overriding the old `OnMouseEnter(MouseEventArgs)` fails with CS0115; in VB the equivalent `Overrides` fails to compile against the new signature — both are loud, which is what you want. |
| 4 | **`TreeViewDrawMode.OwnerDrawContent` was renamed** to WinForms' `OwnerDrawText`, and `OwnerDrawAll` now exists. | Nothing breaks — the old name is an `[Obsolete]` alias with the same value — but it will be removed. Rename now. `OwnerDrawText` raises `DrawNode` after background/focus painting; `OwnerDrawAll` raises it before anything is painted. |
| 5 | **Two `DataGridViewDataErrorContexts` members were removed** (`RowDirtyStateNeeded`, `CleanupExceptionHandling`) — neither is a WinForms member. | Replace with the real ones now present at those values: `RowDeletion`, `ClipboardContent`. |
| 6 | **Strongly-typed resource designers.** A generated `Resources.Designer.cs`/`.vb` casts `ResourceManager.GetObject(...)` to a drawing type; a real `System.Resources.ResourceManager` hands back whatever the compiled `.resources` names, so the cast throws `InvalidCastException` at runtime on first resource read, having compiled cleanly. | The migrator handles this for you, gated on the builder's own `GeneratedCodeAttribute`: in those files only, `ResourceManager` becomes `Majorsilence.Forms.ComponentResourceManager`, which reads the same `.resources` but normalizes graphics entries. Hand-written string lookups keep the BCL type. **Verify your resource-heavy forms early.** |
| 7 | **VB `My.*`** — only `My.Application.Info.*`, `My.Resources.*` and `My.Computer.Name` are implemented. | Everything else still warns: `My.Forms`, `My.Settings`, `My.User`, `My.Application.Log`/`Startup`/`Shutdown`, `My.Computer.Registry`/`Clipboard`/`Info`. See the porting patterns below. Also note: resx entries stored as `ResXFileRef` (linked file rather than inline data) compile but resolve to `null` at runtime. |
| 8 | **Telerik sub-namespaces with no compatibility target** — `Telerik.WinControls.Themes`, `.Design`, `.Primitives`, `.Layouts` — are warn-and-leave. | Decide per usage: drop the theming, or reimplement. Also: `RadScheduler`'s month/week/day **calendar grid UI** is deliberately out of scope (the data layer, navigation and agenda view are real), so code using the grid needs rewriting against the agenda view. |

**Porting the VB `My.*` surface.** The three implemented pieces need no work:

```vb
' These keep working after migration:
Dim title = My.Application.Info.Title
Dim ver As Version = My.Application.Info.Version      ' a real Version, not a String
logo.Image = My.Resources.CompanyLogo                 ' generated accessor module
Dim machine = My.Computer.Name
```

`My.Forms` is the one most codebases hit. Replace the implicit singleton with an explicit instance:

```vb
' Before — My.Forms gave you a lazily-created singleton per form type:
My.Forms.CustomerForm.Show()

' After — hold the instance yourself (or resolve it from your DI container):
Private customerForm As CustomerForm

Private Sub ShowCustomers()
    If customerForm Is Nothing OrElse customerForm.IsDisposed Then
        customerForm = New CustomerForm()
    End If
    customerForm.Show()
End Sub
```

And `My.Settings` becomes whatever configuration you already use elsewhere in .NET —
`Microsoft.Extensions.Configuration`, a JSON file, or your own settings class:

```vb
' Before:  Dim url = My.Settings.ApiBaseUrl
' After:
Dim url = AppSettings.Current.ApiBaseUrl
```

**Exercise 5.** Run the migrator on a real internal app — ideally one nobody depends on this quarter —
with `--dry-run --diff` first. Then run it for real on a branch, get it building, and work the checklist
above item by item. Time-box it to a day; the goal is a calibrated estimate for the rest of your
portfolio, not a finished port.

---

## Module 6 — Choosing your targets
{:#module-6}

**Outcome:** you can pick the right backend package per target, and you know what is genuinely
unavailable on each rather than discovering it late.

Your target set is a package choice:

| Reference this | To target | Notes |
|---|---|---|
| `Majorsilence.Forms.Avalonia` | **Default.** Windows/macOS/Linux desktop — plus Browser/WASM, Android and iOS through Avalonia's own platform packages | The only backend where the window host *is* a real native window, so the only one that can hand out a real platform handle or give a host app OS-level modal semantics |
| `Majorsilence.Forms.Uno` | Desktop plus iOS/Android/WebAssembly through the Uno stack | Presents via `SKXamlCanvas`; needs an Uno app head |
| `Majorsilence.Forms.Headless` | Tests, CI, servers, pixel-diff | No display needed. This is your test story ([module 8](#module-8)) |

Desktop is the mature path. Everything below is about the newer targets, and the honest state of each.

### Single-view platforms: browser, Android, iOS
{:#module-6-singleview}

None of those three has an OS window manager — each offers exactly one embeddable view per
app/tab/screen. They share one host where **every** window is a canvas: the first non-popup window
fills the viewport; everything else — ComboBox dropdowns, menus, additional top-level forms — is an
absolutely positioned child of it.

Startup is host-driven, so each platform has its own entry point taking a **factory** (the form must not
exist until the backend is initialized), and none of them blocks:

**C#**

```csharp
// Browser (WASM) — Program.cs of your browser head
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());

// Android — from your Activity's OnCreate
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());

// iOS — from FinishedLaunching
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());
```

**VB.NET**

```vb
' Browser (WASM). VB has no async entry point, and RunBrowserAsync does not block —
' the tab's own event loop drives the UI — so start it and return.
Module Program
    Sub Main()
        Dim starting = Majorsilence.Forms.Application.RunBrowserAsync(Function() New MainForm())
    End Sub
End Module

' Android — from your Activity's OnCreate
Majorsilence.Forms.Application.RunAndroid(Function() New MainForm())

' iOS — from FinishedLaunching
Majorsilence.Forms.Application.RunIOS(Function() New MainForm())
```

Note the shape of the argument: a **factory** (`Function() New MainForm()`), not an instance. Passing
`New MainForm()` directly would construct the form before the backend exists.

**What doesn't work there** — inherent to having no window manager, not pending work:

- **No window chrome.** `Title`, `Topmost`, `SetSystemDecorations`, `SetIcon`, min/max size,
  `CanResize`, `ShowInTaskbar` and `WindowState` are no-ops; `WindowState` always reads `Normal`.
- **`ShowDialog` isn't OS-modal**, because there's no modal window concept — but it still *behaves*
  modally: the parent-disable and blocking wait live above the backend seam.
- **No WebView**, so compatibility controls needing one (`RadPdfViewer`, `RadRichTextEditor`) fall back
  to their plain-viewer/`RichTextBox` paths.
- **Outside-click popup dismissal via window deactivation doesn't fire.** Clicking elsewhere *inside*
  the app still dismisses popups; only losing focus to something outside the app entirely is unhandled.

**Maturity differs sharply, and this belongs in your planning rather than in a footnote:** the browser
path runs the full gallery and is young; Android builds and boots but has had no real-device testing;
**iOS has never been compiled at all** — it's written from Avalonia.iOS's API surface and standard
.NET-for-iOS conventions, so expect a first-build shakeout. If mobile is on your roadmap, treat it as a
spike with real risk, not a checkbox.

Workloads you'll need, once each:

```
dotnet workload install wasm-tools   # browser — needed to publish, not to build
dotnet workload install android
dotnet workload install ios          # macOS only; there is no Linux/Windows path
```

For the browser, note that `dotnet run` does not serve a WebAssembly project: `dotnet publish` it and
serve the `wwwroot` output with any static file server.

One gap that will bite a browser port immediately: **files loaded by relative path don't exist there.**
There's no real filesystem, so image loading that works on desktop silently yields blank icons (the same
1×1 placeholder behavior from [module 0](#module-0)). Ship images as embedded resources and read them
through the assembly instead:

**C#**

```csharp
using Majorsilence.Forms.Drawing;

public static Bitmap LoadEmbedded (string name)
{
    var assembly = typeof (MainForm).Assembly;
    using var stream = assembly.GetManifestResourceStream ($"MyApp.Images.{name}")
        ?? throw new InvalidOperationException ($"Missing embedded resource: {name}");

    return new Bitmap (stream);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing

Public Shared Function LoadEmbedded(name As String) As Bitmap
    Dim assembly = GetType(MainForm).Assembly
    Using stream = assembly.GetManifestResourceStream($"MyApp.Images.{name}")
        If stream Is Nothing Then
            Throw New InvalidOperationException($"Missing embedded resource: {name}")
        End If
        Return New Bitmap(stream)
    End Using
End Function
```

### Embedding inside an existing Avalonia or Uno app
{:#module-6-embedding}

If you already ship an Avalonia or Uno app, you can adopt Majorsilence.Forms additively — using its
controls and windows as if they were native objects, without changing the normal `Form.Show()` flow:

**C#**

```csharp
// A Majorsilence control, hosted as a native one
Avalonia.Controls.Control          hostControl = myMfControl.ToAvaloniaControl ();
Microsoft.UI.Xaml.FrameworkElement unoControl  = myMfControl.ToUnoControl ();

// A Majorsilence Form's backend window, handed back to the host
Avalonia.Controls.Window window = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window unoWin = myForm.ToUnoWindow ();

window.Show ();                    // the host owns showing it from here
```

**VB.NET**

```vb
' A Majorsilence control, hosted as a native one
Dim hostControl As Avalonia.Controls.Control = myMfControl.ToAvaloniaControl()
Dim unoControl As Microsoft.UI.Xaml.FrameworkElement = myMfControl.ToUnoControl()

' A Majorsilence Form's backend window, handed back to the host
Dim window As Avalonia.Controls.Window = myForm.ToAvaloniaWindow()
Dim unoWin As Microsoft.UI.Xaml.Window = myForm.ToUnoWindow()

window.Show()                      ' the host owns showing it from here
```

**Owner/modal relationships differ by backend:** `ToAvaloniaWindow()` gives a genuine OS-level modal
relationship; Uno has no owner concept in this backend, so `ToUnoWindow()` gives back an independent
top-level window. Under Uno, use `Form.ShowDialog(parent)` — the framework's own modal loop, which
doesn't depend on native window ownership.

### If you draw your own title bar
{:#module-6-chrome}

Worth one slide for anyone building custom chrome. On the Avalonia backend, dragging and resizing go
through interactive begin-drag calls. On Uno they can't (WinUI has no programmatic begin-drag), so
move/resize is declarative: the form publishes its title-bar strip as a caption region, which the host
forwards to WinUI. That's a Windows-desktop API, so OS title-bar drag works on the Win32 head; macOS
uses native decorations and the OS owns drag/resize; on the **X11 head title-bar drag is unavailable** —
use system decorations there if you need OS window dragging.

**Exercise 6.** Take `GreetForm` from [module 2](#module-2) and run it on two backends by changing only
the package reference. Then publish it to WebAssembly and open it in a browser. Write down every
behavioral difference you observe and check each against the list above — anything not on it is worth
reporting.

---

## Module 7 — Incremental adoption on Windows
{:#module-7}

**Outcome:** you can run Majorsilence.Forms and real WinForms in one process, in either direction, and
you know the three rules that keep it stable.

`Majorsilence.Forms.WindowsFormsInterop` is a **Windows-only** bridge for incremental migration. Off
Windows the assembly is an empty placeholder (so cross-platform builds stay green) and every call
throws `PlatformNotSupportedException`.

**Why it works at all:** on Windows, the Avalonia backend registers its windows with the OS message pump
rather than running its own loop, and `System.Windows.Forms` uses the same pump. The two toolkits
therefore share whichever `Application.Run` is called — one loop services both.

### Direction A — a Majorsilence.Forms app opening a legacy WinForms form
{:#module-7-a}

For when the app has moved but a few dialogs haven't.

**C#**

```csharp
using Majorsilence.Forms.Interop;

// Modeless — returns immediately
WindowsFormsInterop.Show (new LegacySettingsForm (), owner: this);

// Modal — blocks until the WinForms dialog closes
var result = WindowsFormsInterop.ShowDialog (new LegacyWizardForm (), owner: this);
if (result == System.Windows.Forms.DialogResult.OK) {
    // …
}

// Factory overload — constructs the form on the UI thread at show time
WindowsFormsInterop.Show (() => new LegacySettingsForm ());
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Interop

' Modeless — returns immediately
WindowsFormsInterop.Show(New LegacySettingsForm(), owner:=Me)

' Modal — blocks until the WinForms dialog closes
Dim result = WindowsFormsInterop.ShowDialog(New LegacyWizardForm(), owner:=Me)
If result = System.Windows.Forms.DialogResult.OK Then
    ' …
End If

' Factory overload — constructs the form on the UI thread at show time
WindowsFormsInterop.Show(Function() New LegacySettingsForm())
```

For the WinForms dialog to be genuinely owned by (and modal to) the Majorsilence parent, wire the handle
resolver **once** at startup — until you do, WinForms forms are shown unowned:

**C#**

```csharp
WindowsFormsInterop.OwnerHandleResolver = mfForm =>
{
    var host = mfForm.Backend as Majorsilence.Forms.Backends.MajorsilenceFormsWindowHost;
    return host?.TryGetPlatformHandle ()?.Handle ?? IntPtr.Zero;
};
```

**VB.NET**

```vb
WindowsFormsInterop.OwnerHandleResolver =
    Function(mfForm)
        Dim host = TryCast(mfForm.Backend,
                           Majorsilence.Forms.Backends.MajorsilenceFormsWindowHost)
        If host Is Nothing Then Return IntPtr.Zero
        Return If(host.TryGetPlatformHandle()?.Handle, IntPtr.Zero)
    End Function
```

### Direction B — a WinForms app opening Majorsilence.Forms screens
{:#module-7-b}

This is the low-risk way to validate the framework before committing to anything: build *new* screens on
Majorsilence.Forms inside the app you already ship.

**C#**

```csharp
[STAThread]
static void Main ()
{
    System.Windows.Forms.Application.EnableVisualStyles ();
    System.Windows.Forms.Application.SetCompatibleTextRenderingDefault (false);
    System.Windows.Forms.Application.SetHighDpiMode (HighDpiMode.PerMonitorV2);

    WindowsFormsInterop.InitializeMajorsilence ();   // once, before the first MF window
    System.Windows.Forms.Application.Run (new MainForm ());
}
```

```csharp
using MF = Majorsilence.Forms;

WindowsFormsInterop.ShowMajorsilenceForm (new NewSettingsForm (), owner: this);

MF.DialogResult r = WindowsFormsInterop.ShowMajorsilenceDialog (new NewWizardForm (), owner: this);
if (r == MF.DialogResult.OK) {
    // …
}
```

**VB.NET**

```vb
Module Program
    <STAThread>
    Sub Main()
        System.Windows.Forms.Application.EnableVisualStyles()
        System.Windows.Forms.Application.SetCompatibleTextRenderingDefault(False)
        System.Windows.Forms.Application.SetHighDpiMode(HighDpiMode.PerMonitorV2)

        WindowsFormsInterop.InitializeMajorsilence()   ' once, before the first MF window
        System.Windows.Forms.Application.Run(New MainForm())
    End Sub
End Module
```

```vb
Imports MF = Majorsilence.Forms

WindowsFormsInterop.ShowMajorsilenceForm(New NewSettingsForm(), owner:=Me)

Dim r As MF.DialogResult =
    WindowsFormsInterop.ShowMajorsilenceDialog(New NewWizardForm(), owner:=Me)
If r = MF.DialogResult.OK Then
    ' …
End If
```

Set `DialogResult` before `Close()` in the Majorsilence form for that to return anything but
`DialogResult.None` (which means "closed without an explicit result", e.g. the title-bar ✕):

**C#**

```csharp
okButton.Click += (sender, e) => {
    DialogResult = Majorsilence.Forms.DialogResult.OK;
    Close ();
};
```

**VB.NET**

```vb
AddHandler okButton.Click,
    Sub(sender As Object, e As EventArgs)
        DialogResult = Majorsilence.Forms.DialogResult.OK
        Close()
    End Sub
```

### The three rules
{:#module-7-rules}

1. **One `Application.Run` per process.** Never call both `Majorsilence.Forms.Application.Run` and
   `System.Windows.Forms.Application.Run`. Pick a host; use the bridge for the other direction.
2. **UI (STA) thread only** — exactly like WinForms. From a background thread, cross back:

   **C#**

   ```csharp
   await Task.Run (() => {
       var data = LoadFromDatabase ();
       Majorsilence.Forms.Application.RunOnUIThread (() => grid.DataSource = data);
   });
   ```

   **VB.NET**

   ```vb
   Await Task.Run(
       Sub()
           Dim data = LoadFromDatabase()
           Majorsilence.Forms.Application.RunOnUIThread(Sub() grid.DataSource = data)
       End Sub)
   ```

3. **Win32 parenting is asymmetric.** MF → WF parenting works through the handle resolver above; in the
   WF → MF direction the MF window is currently unowned at the OS level.

**Exercise 7.** In a scratch copy of an existing WinForms app, add one new screen built on
Majorsilence.Forms via Direction B, with the owner handle wired. This is the demo that unblocks
stakeholders, because it changes nothing about what you already ship.

---

## Module 8 — Testing your app
{:#module-8}

**Outcome:** your team writes UI tests that run in CI with no display, using locators that don't break —
and knows what accessibility comes free.

> This module is the overview. [**Automation & UI testing**]({{ '/automation/' | relative_url }}) is the
> practitioner's version: page objects, a wait helper (there are no implicit waits), driving the app from
> real Selenium, FlaUI/WinAppDriver on Windows, golden-image regression, CI recipes for GitHub Actions,
> Azure DevOps and Jenkins, and how AI agents hook into the same surface.

### One automation tree, three consumers
{:#module-8-tree}

The framework exposes a backend-neutral **automation tree**: a snapshot of your live control hierarchy
with ids, names, roles, values, state and bounds.

| Consumer | Package | Gives you |
|---|---|---|
| In-process UI tests | `Majorsilence.Forms.Automation` (in the core package) | Drive a form from C#/VB without pixel math |
| Remote automation | `Majorsilence.Forms.WebDriver` | A W3C WebDriver server any Selenium client can drive |
| Screen readers & magnifiers | `Majorsilence.Forms.WindowsUIAutomation` | Narrator / NVDA / JAWS on Windows |

The tree reads the same logical bounds and state the renderers use, so it behaves identically on the
headless and real backends — **a test written against Headless describes what a user sees on Avalonia.**

### Make controls findable — a team convention, adopted on day one
{:#module-8-findable}

Locators key off two properties you're already setting:

- `Control.Name` → the element's **AutomationId**. The stable locator. Prefer it always.
- `Control.AccessibleName` (falling back to `Text`, then `Name`) → the element's **Name**.

**C#**

```csharp
var okButton = new Button  { Name = "okButton", Text = "OK" };
var nameBox  = new TextBox { Name = "nameBox",  AccessibleName = "Full name" };
```

**VB.NET**

```vb
Dim okButton As New Button With {.Name = "okButton", .Text = "OK"}
Dim nameBox As New TextBox With {.Name = "nameBox", .AccessibleName = "Full name"}
```

Roles are inferred from the control type (`button`, `textbox`, `checkbox`, `radio`, `combobox`, `list`,
`label`, `tablist`, `window`, …) unless you set `Control.AccessibleRole`. Make "every interactive control
gets a `Name`" a code-review rule — it buys test locators *and* screen-reader support from the same
keystroke.

### The Headless backend is your CI story
{:#module-8-headless}

`Majorsilence.Forms.Headless` needs no display. Install it once for the whole test assembly, then every
test gets it.

**C# — a module initializer is the tidiest hook**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Headless;

internal static class TestBootstrap
{
    [ModuleInitializer]
    internal static void Init () => HeadlessRenderer.Use ();
}
```

**VB.NET — VB has no module initializer, so use your test framework's assembly hook**

```vb
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBootstrap
    ' MSTest: <AssemblyInitialize>. NUnit's equivalent is a <SetUpFixture> with <OneTimeSetUp>;
    ' xUnit's is a collection/assembly fixture. VB cannot use <ModuleInitializer> — the VB
    ' compiler does not emit module initializers, so the attribute alone would do nothing.
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        HeadlessRenderer.Use()
    End Sub
End Class
```

That is a genuine language difference, not a style preference: if you copy the C# pattern into VB, your
tests will run against no backend at all and fail in confusing ways.

### A complete UI test
{:#module-8-inprocess}

`By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` locate elements; `Find`,
`FindOrThrow` and `FindAll` each query a **fresh snapshot**. Actions (`Click`, `SendKeys`, `PressKey`,
`Clear`) go through the same neutral input pipeline a real backend uses, so they exercise real routing,
focus and layout — not a test-only shortcut.

**C#**

```csharp
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;
using Xunit;

public class GreetFormTests
{
    [Fact]
    public void Entering_a_name_and_pressing_OK_accepts_the_dialog ()
    {
        using var form = new GreetForm ();
        var session = new AutomationSession (form);

        session.SendKeys (session.FindOrThrow (By.Id ("nameBox")), "Ada Lovelace");
        Assert.Equal ("Ada Lovelace", session.GetText (session.FindOrThrow (By.Id ("nameBox"))));

        session.Click (session.FindOrThrow (By.Id ("okButton")));
        Assert.Equal (DialogResult.OK, form.DialogResult);
    }

    [Fact]
    public void The_form_still_renders_at_the_expected_size ()
    {
        using var form = new GreetForm ();

        // Golden-image check: render offscreen and compare against a committed PNG.
        var png = HeadlessRenderer.CapturePng (form, 360, 140);

        Assert.NotEmpty (png);
        // File.WriteAllBytes ("greetform.expected.png", png);   // regenerate deliberately
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class GreetFormTests

    <TestMethod>
    Public Sub Entering_a_name_and_pressing_OK_accepts_the_dialog()
        Using form As New GreetForm()
            Dim session As New AutomationSession(form)

            session.SendKeys(session.FindOrThrow(By.Id("nameBox")), "Ada Lovelace")
            Assert.AreEqual("Ada Lovelace",
                            session.GetText(session.FindOrThrow(By.Id("nameBox"))))

            session.Click(session.FindOrThrow(By.Id("okButton")))
            Assert.AreEqual(DialogResult.OK, form.DialogResult)
        End Using
    End Sub

    <TestMethod>
    Public Sub The_form_still_renders_at_the_expected_size()
        Using form As New GreetForm()
            ' Golden-image check: render offscreen and compare against a committed PNG.
            Dim png = HeadlessRenderer.CapturePng(form, 360, 140)
            Assert.IsTrue(png.Length > 0)
        End Using
    End Sub
End Class
```

`By.XPath` evaluates against the tree's XML rendering, the same shape `session.GetPageSource()` returns —
useful when you have no stable id to key off:

**C#**

```csharp
session.Find    (By.XPath ("//Button[@id='okButton']"));
session.Find    (By.XPath ("//TextBox[@name='Full name']"));
session.FindAll (By.XPath ("//Panel//Button"));
```

**VB.NET**

```vb
session.Find(By.XPath("//Button[@id='okButton']"))
session.Find(By.XPath("//TextBox[@name='Full name']"))
session.FindAll(By.XPath("//Panel//Button"))
```

**Testing at HiDPI.** `MF_HEADLESS_SCALE=2` makes the headless backend report a scaled display, which is
how you test layout at 2× without a scaled monitor. The framework's own suite passes at that scale and
CI gates it, so it's a supported thing to do rather than a known-broken corner.

Take the lesson from how those failures were fixed, though, because it's the same trap in your code:
almost all of them were **one confusion — logical versus device units.** `Bounds`, `MouseEventArgs` and
`GetTabRect` are logical; `ClientRectangle`, back buffers and captured bitmaps are device pixels. They're
identical at scale 1, so mixing them is invisible until a scaled display shows up. So: **assert geometry
proportionally rather than in scale-1 pixels**, and when you compare a captured bitmap against a
rectangle, check which space each one is in.

### Remote automation with Selenium
{:#module-8-webdriver}

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

var server = new WebDriverServer (form, port: 4444);
server.Start ();          // http://127.0.0.1:4444/  (loopback only)
// … drive it with any WebDriver client …
server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Dim server As New WebDriverServer(form, port:=4444)
server.Start()            ' http://127.0.0.1:4444/  (loopback only)
' … drive it with any WebDriver client …
server.Stop()
```

Because WebDriver is just HTTP and JSON, any client in any language works:

**C#**

```csharp
driver.FindElement (By.CssSelector ("#okButton")).Click ();
driver.FindElement (By.Name ("nameBox")).SendKeys ("Ada Lovelace");
```

**VB.NET**

```vb
driver.FindElement(By.CssSelector("#okButton")).Click()
driver.FindElement(By.Name("nameBox")).SendKeys("Ada Lovelace")
```

Supported: new/delete session, find element(s), click, send keys, clear, get text, get name (role), get
attribute, get rect, get enabled, **page source** (XML), screenshot (PNG), `GET /status`. Locators:
`id`, `name`, `tag name` (role), `xpath`, `css selector` (`#id` and `[name='…']`), plus custom `role`,
`type`, `link text`. Element references re-resolve against a fresh snapshot on every use, preferring the
stable AutomationId, so values stay live after edits.

**Recording locators.** Because the server exposes XML page source *and* an xpath strategy that runs
against exactly that source, any Appium-style inspector can render the live tree over a screenshot and
let you capture locators by clicking nodes. Point it at `127.0.0.1`, your port, path `/`, plain http;
capabilities are ignored. Prefer locators in this order: **`id`** → **`xpath`** → `name`/`role`/`type`.
Caveats: this is a W3C WebDriver server, not a full Appium server (Appium-only endpoints return 404 — a
generic WebDriver client is the most reliable inspector); the overlay may be offset if the screenshot is
captured at a different DPI; one window at a time; hidden controls are omitted from the tree.

In a **headless** test there's no message loop, so pump the queue while the HTTP calls run on a worker:

**C#**

```csharp
var task = Task.Run (RunWebDriverFlow);
while (!task.IsCompleted) {
    Platform.Backend.DoEvents ();
    Thread.Sleep (5);
}
```

**VB.NET**

```vb
Dim task = Task.Run(AddressOf RunWebDriverFlow)
While Not task.IsCompleted
    Platform.Backend.DoEvents()
    Thread.Sleep(5)
End While
```

**Playwright is not a fit** — it automates browser engines over a DOM, and there is no DOM here. Don't
let that question consume a sprint.

### Accessibility on Windows
{:#module-8-a11y}

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // must be shown first — it needs a native handle
WindowsUIAutomation.Enable (form);  // detaches automatically when the window closes
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' must be shown first — it needs a native handle
WindowsUIAutomation.Enable(form)    ' detaches automatically when the window closes
```

> **That snippet does not compile off Windows** — verified, not theorised. Away from Windows the package
> ships as an empty stub, so the `Majorsilence.Forms.WindowsUIAutomation` namespace does not exist and
> you get CS0234 rather than a runtime `PlatformNotSupportedException`. In a cross-platform app,
> multi-target (`net10.0;net10.0-windows`) and guard the call with `#if WINDOWS`, or keep it in a
> Windows-only project that your desktop head references conditionally.

Each control becomes a UIA element with **Name**, **AutomationId** (`Control.Name`), **ControlType**,
**IsEnabled**, **HasKeyboardFocus** and a screen **BoundingRectangle**. `Invoke` (buttons) is live;
`Value` and `Toggle` are exposed for reading. Focus changes raise UIA focus-changed events — that's what
makes a screen reader announce the new control and a magnifier follow it.

Not in this first cut: per-keystroke `TextBox` value events (screen readers fall back to their own
typed-character echo; the field is still announced on focus), structure-changed events, and sub-control
items (individual tabs, list rows). Linux (AT-SPI) and macOS (NSAccessibility) bridges over the same tree
are roadmap items — so if you have an accessibility obligation on those platforms, raise it now rather
than at ship time.

**Exercise 8.** Write the `GreetFormTests` above for your own team's language, get it green in CI with
no display, then add a golden-image assertion. That test is the template every UI test in your codebase
should follow.

---

## Module 9 — Native content and video
{:#module-9}

**Outcome:** nobody on the team ever fakes a window handle, and video/maps/browser content gets hosted
the way that actually composites.

Two questions turn out to be the same question — "how do I put native content inside a control?" and
"how do I get an `HWND` for a control?" — and the answer to the second is **you can't, and you shouldn't
fake one.**

| Member | Value | Why |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | No per-control OS window exists. Same for `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle`. |
| `WindowBase.Handle` | An opaque nonzero token | **Not an `HWND`.** It exists because WinForms code routinely reads `.Handle` to force handle creation before `Invoke`, and returning zero breaks that idiom. Meaningful only inside managed code. |
| `WindowBase.PlatformHandle` | The real native handle, or zero | The genuine article — `HWND`/`NSWindow`/`XID` on the Avalonia backend. Currently zero on Uno and Headless. |

**The rule about faking:** a fabricated handle is safe *only* while it round-trips through managed code
you control. It stops being safe the moment it crosses into native code — LibVLC's
`libvlc_media_player_set_hwnd`, mpv's `--wid`, GStreamer's `GstVideoOverlay.set_window_handle` all pass
it to the OS (`SetParent`, `CreateWindowEx`, `SetWindowPos`), which will not tolerate a made-up value.

### Route A — `NativeControlHost`
{:#module-9-route-a}

The supported seam: your control reserves a rectangle, and the backend fills it with a real toolkit
element overlaid on the Skia surface, kept aligned to the placeholder's bounds, clip and visibility.
Available on Avalonia and Uno; absent on Headless.

**C#**

```csharp
using Majorsilence.Forms;

var host = new NativeControlHost {
    Name = "mapHost",
    Dock = DockStyle.Fill
};

// Assign the toolkit's own element type. On the Avalonia backend that's an Avalonia Control:
host.NativeControl = new Avalonia.Controls.Button { Content = "I am a real Avalonia button" };

Controls.Add (host);

// Setting null removes the hosted element again.
host.NativeControl = null;
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Dim host As New NativeControlHost With {
    .Name = "mapHost",
    .Dock = DockStyle.Fill
}

' Assign the toolkit's own element type. On the Avalonia backend that's an Avalonia Control:
host.NativeControl = New Avalonia.Controls.Button With {
    .Content = "I am a real Avalonia button"
}

Controls.Add(host)

' Setting Nothing removes the hosted element again.
host.NativeControl = Nothing
```

![A native Avalonia button hosted inside a Majorsilence form]({{ '/assets/img/example-native.png' | relative_url }})

*That code, running: the Avalonia `Button` is genuinely there, hosted above the Skia surface. Note it
renders as bare text with no button chrome — a hosted native control is styled by the **host
application's** Avalonia styles, and the backend bootstraps a minimal Avalonia app that installs no
theme. The seam works; the styling is yours to supply. Budget for that if you plan to host real native
UI rather than a self-drawing surface like a map or video view.*

Three things to know. **Airspace limits:** the overlay is a native element *above* your painted content,
so nothing the framework draws can appear on top of it. **Styling is not inherited** from
Majorsilence.Forms — see the screenshot above. And **assigning the wrong type fails silently** —
`NativeControl` is typed `Object`, both backends type-check it and simply return if it doesn't match;
nothing throws, nothing logs, nothing appears. An Avalonia `Control` handed to the Uno backend produces
exactly that. If your native content is invisible, check the type first.

### Route B — video via frame callbacks (recommended)
{:#module-9-route-b}

Instead of hosting a native surface, take decoded frames from the player and draw them into Skia
yourself. It composites properly with everything else you paint, and it sidesteps both the airspace
problem and the handle problem entirely. The shape:

**C#**

```csharp
public class VideoSurface : Control
{
    private SKBitmap? frame;

    // Called from your player's frame callback, on whatever thread it uses.
    public void OnFrameDecoded (SKBitmap decoded)
    {
        frame = decoded;
        Majorsilence.Forms.Application.RunOnUIThread (Invalidate);
    }

    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);

        if (frame is not null)
            e.Canvas.DrawBitmap (frame, new SKRect (0, 0, Width, Height));
    }
}
```

**VB.NET**

```vb
Public Class VideoSurface
    Inherits Control

    Private frame As SKBitmap

    ' Called from your player's frame callback, on whatever thread it uses.
    Public Sub OnFrameDecoded(decoded As SKBitmap)
        frame = decoded
        Majorsilence.Forms.Application.RunOnUIThread(AddressOf Invalidate)
    End Sub

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        MyBase.OnPaint(e)

        If frame IsNot Nothing Then
            e.Canvas.DrawBitmap(frame, New SKRect(0, 0, Width, Height))
        End If
    End Sub
End Class
```

![The frame-callback video surface compositing a decoded frame]({{ '/assets/img/example-video.png' | relative_url }})

*The same code with a synthesized frame standing in for a decoder. The bitmap is drawn straight into the
control's Skia canvas, so it composites with everything else you paint — no airspace, no handle, and it
works identically on every backend including Headless (which is how you'd unit-test it).*

See [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) for the full
comparison and the known gaps.

**Exercise 9.** Find every `.Handle` in your codebase and classify each use: forcing handle creation
(fine — keep it), passing to managed code (fine), or passing to native code (must change). A
five-minute grep that prevents a genuinely confusing class of bug.

---

## Module 10 — Shipping: CI, versioning, staying current
{:#module-10}

**Outcome:** your pipeline catches the regressions this framework actually produces, and you know what
to do when you hit a gap.

### Gate your pipeline
{:#module-10-ci}

| Gate | Command | Catches |
|---|---|---|
| Build clean | `dotnet build --configuration Release` | Warnings before they compound |
| Tests | `dotnet test --configuration Release --no-build` | Everything from [module 8](#module-8) — no display required |
| Migration drift | `majorsilence-migrate <sln> --dry-run --strict` | A new unmapped reference the moment it lands on a branch, while you're still converging |
| HiDPI | `MF_HEADLESS_SCALE=2` on your scaling-sensitive tests | Layout that only works at scale 1 |
| Browser boot | `dotnet publish` your wasm head + a headless-Chromium smoke test | The wasm pipeline breaking |

That last one is worth stealing outright if you target the browser: **building a wasm target is not
evidence it works.** `dotnet publish` is what runs the wasm-tools pipeline (the emcc/wasm-opt native
link), and only a real boot in a browser proves the bundle. A `dotnet build` that succeeds tells you
nothing about it.

### Version discipline
{:#module-10-versioning}

- **Pin your package version.** This is beta software; the API is stabilizing. Pin, upgrade
  deliberately, and read the release notes — the breaking changes documented in
  [module 5's checklist](#module-5-checklist) are the kind of thing that lands between versions.
- **Keep the core, backend and migrator versions in lockstep.** The migrator's `--package-version`
  defaults to its own version, because the tool and the packages ship from the same release.
- **Centralise the version** so an upgrade is one edit. In `Directory.Packages.props`:

  ```xml
  <Project>
    <PropertyGroup>
      <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    </PropertyGroup>
    <ItemGroup>
      <PackageVersion Include="Majorsilence.Forms" Version="26.0.30" />
      <PackageVersion Include="Majorsilence.Forms.Avalonia" Version="26.0.30" />
      <PackageVersion Include="Majorsilence.Forms.Headless" Version="26.0.30" />
    </ItemGroup>
  </Project>
  ```

- **Upgrade on a branch with your golden-image tests green** before it reaches anyone else. Rendering
  changes are exactly what those tests are for.

### When you hit a gap
{:#module-10-gaps}

You will. The useful thing to know is that several gaps in this framework were found only by *migrating
real applications* — a WinForms game, a ribbon control library — not by reading the API surface. If your
team ports something real and hits a silent no-op, that finding has value beyond your own project.

- **A member that throws instead of no-opping** contradicts the [stub policy](#module-3-stub-policy) —
  report it as a bug.
- **A silent no-op that cost you a day** is worth an issue too: file it with the *symptom*, not just the
  member name ("`X` did nothing, so sprites drew with a white box"), because the symptom is what makes
  it findable for the next team. Attach the [pinning test](#module-3-pin) you wrote — it's a
  reproduction, ready to run.
- **Blocked and can't wait?** The project takes pull requests, AI-assisted or not, with a simple bar:
  `dotnet build --configuration Release` and `dotnet test` clean, new behavior covered by tests that
  prove it *works* rather than that it compiles, and
  [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) updated alongside
  the code it describes. Closing the specific gap blocking you is usually far smaller work than
  designing around it.

**Exercise 10.** Add the gates above to your repository. Then take the one gap from
[module 3](#module-3)'s exercise that your app genuinely needs, and decide as a team: design around it,
or close it upstream. Write down which and why.

---

## Appendix A — Troubleshooting by symptom
{:#appendix-a}

| Symptom | Likely cause | Fix |
|---|---|---|
| App won't start / no window appears | No backend package referenced — the core package can't put a window on screen | Add `Majorsilence.Forms.Avalonia` (or Uno/Headless) |
| Ambiguous-reference errors on `Bitmap`/`Font`/`Pen` after migrating | `System.Drawing.Common` is still referenced beside the Majorsilence replacements | Remove the package reference (the migrator does this for every project it touches) |
| CS0104 (C#) / ambiguity (VB) on `SystemColors` / `ColorTranslator` | Both live in `System.Drawing.Primitives`, so they still resolve through the kept `System.Drawing` import | Add the alias — `using SystemColors = Majorsilence.Forms.SystemColors;` / `Imports SystemColors = Majorsilence.Forms.SystemColors` |
| A class library that never mentioned WinForms won't compile | It had an image/font helper that got rewritten to `Majorsilence.Forms.Drawing.*` | Add the `Majorsilence.Forms` reference; "projects the rewrite touches" is wider than "WinForms projects" |
| Designer event wiring won't compile (`new EventHandler<KeyEventArgs>(…)`) | Event delegate types now match WinForms | Drop the wrapper, or name the WinForms delegate (`KeyEventHandler`, `MouseEventHandler`, …) |
| `e.X` / `e.Button` missing in a `Click` handler | `Click` is an `EventArgs` event in WinForms too | Move to `MouseClick`; on a menu item, take the position from the owning control |
| VB: `Or` vs `|` on `Anchor`/`DockStyle` flags | Flag combination uses `Or` in VB | `AnchorStyles.Top Or AnchorStyles.Left` |
| VB: tests run against no backend | VB has no module initializer — the C# `<ModuleInitializer>` pattern silently does nothing | Install the backend from `<AssemblyInitialize>` / `<SetUpFixture>` — see [module 8](#module-8-headless) |
| A split layout flipped orientation | `SplitContainer.Orientation` now means the direction of the *bar* | Invert the value you set (nothing warns — both values compile) |
| `InvalidCastException` on first resource read | A generated resource designer casting a `System.Resources.ResourceManager` result | Use `Majorsilence.Forms.ComponentResourceManager` (the migrator rewrites generated designers automatically) |
| A resource resolves to `null` at runtime | The resx entry is a `ResXFileRef` (linked file, not inline data) | Inline the resource, or load it yourself |
| Every icon invisible, nothing logged | A relative asset path resolved against the wrong **working directory**; the missing file became a 1×1 placeholder instead of throwing | Resolve assets against `AppContext.BaseDirectory` — see [module 0](#module-0) |
| Icons missing in the browser build only | No real filesystem there; relative file loads can't work | Ship images as embedded resources — see [module 6](#module-6-singleview) |
| A property set has no visible effect at all | It's a stub per the [stub policy](#module-3-stub-policy) — stores and reads back, nothing consumes it | Check the matrix row. If it *throws* instead, that's a bug — report it |
| Hosted native content is invisible | The backend type-checked your native control, didn't match, and returned silently | Check the type: Avalonia `Control` for the Avalonia backend, Uno `UIElement` for Uno |
| Maximize/minimize does nothing; `Title` is ignored | You're on a single-view platform (browser/Android/iOS) — no window manager | Expected. See [module 6](#module-6-singleview) |
| Clicks land in the wrong place at HiDPI | Input routing mixing logical and device units — fixed in main, where the full suite now passes at scale 2 under CI | Upgrade past 26.0.30 when released; check your own code for the same logical-vs-device mix ([module 8](#module-8-headless)) |
| A WinForms dialog isn't modal to its Majorsilence parent | `OwnerHandleResolver` was never wired | Wire it once at startup — see [module 7](#module-7-a) |
| Deadlock or double message loop on Windows | Both `Application.Run`s were called | One host per process; use the bridge for the other direction |
| `PlatformNotSupportedException` from interop on macOS/Linux | `System.Windows.Forms` doesn't exist there | Guard interop calls behind a Windows check |

---

## Appendix B — Rollout plan for a real codebase
{:#appendix-b}

A sequence that has the evidence arriving before the commitment does.

1. **Spike (1 day).** Modules 0–3. Template app running on each developer's OS, live gallery explored,
   compatibility matrix read. Deliverable: a list of your app's top 20 UI dependencies scored
   implemented / stubbed / absent.
2. **Pilot migration (2–5 days).** Pick a small, real, low-stakes internal app. Run the migrator on a
   branch, get it building, work the [manual-fix checklist](#module-5-checklist). Deliverable: a
   calibrated per-KLOC estimate and a list of gaps that actually block *you*.
3. **Decide the adoption shape.** Three options, not mutually exclusive:
   - **New app** — start on Majorsilence.Forms directly ([module 2](#module-2)).
   - **New screens in an old app** — Direction B interop on Windows, changing nothing you ship
     ([module 7](#module-7-b)).
   - **Whole-app migration** — the migrator, optionally with `--dual-build` if you're on C#
     ([module 5](#module-5-dualbuild)). **VB teams: plan a cut-over instead** — dual-build isn't
     available to you.
4. **Establish the test net before the bulk work.** [Module 8](#module-8), on the pilot: locator naming
   convention, headless tests in CI, golden images for the screens you care about. Do this *before*
   migrating the big app — the tests are how you'll know the port behaves.
5. **Set the CI gates** ([module 10](#module-10-ci)), including `--strict` migration drift.
6. **Migrate in tranches**, one deployable unit at a time, each ending green on the gates.
7. **Feed findings back** ([module 10](#module-10-gaps)). The silent no-ops you hit are the ones nobody
   else can find by reading the API.

Decide these explicitly and early, because each constrains the plan: which platforms you actually need
(desktop-only is a very different project from "and iOS"), whether you need a visual designer (there
isn't one yet), whether you depend on a vendor control suite (Telerik has a compatibility layer; other
vendors need a `--map` file and manual work), whether you have an accessibility obligation outside
Windows, whether your codebase is VB (cut-over, not dual-build), and whether anything in your app hosts
native content or reads window handles.

---

## Appendix C — Reference card
{:#appendix-c}

**Site pages:** [Getting started]({{ '/getting-started/' | relative_url }}) ·
[Samples]({{ '/samples/' | relative_url }}) · [Platform backends]({{ '/backends/' | relative_url }}) ·
[Automation & UI testing]({{ '/automation/' | relative_url }}) ·
[Native interop]({{ '/native-interop/' | relative_url }}) · [Blog]({{ '/blog/' | relative_url }}) ·
[Live browser gallery]({{ '/gallery/' | relative_url }})

**In the repository — the four documents an application team actually needs:**

| Document | Read it when |
|---|---|
| [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) | Before relying on any member. Keep it open |
| [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) | Running the migrator; every breaking change is documented here |
| [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) | Running both stacks in one process on Windows |
| [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) | Hosting native content or video |

**Commands worth memorising:**

```
dotnet new majorsilenceforms                           # new app from the template
dotnet build --configuration Release && dotnet test --configuration Release --no-build
majorsilence-migrate MySolution.sln --dry-run --diff   # scope a migration
majorsilence-migrate MySolution.sln --no-backup        # run it on a branch
majorsilence-migrate MySolution.sln --dry-run --strict # CI drift gate
dotnet workload install wasm-tools && dotnet publish <YourWasmHead> -c Release -o out
```

**The two-line summary for anyone who asks what changes:** your imports move from
`System.Windows.Forms` to `Majorsilence.Forms` and from GDI+ to `Majorsilence.Forms.Drawing`, and you
add a backend package. Your forms, designer files, event handlers and business logic stay yours.
