---
layout: docs
lang: si
title: ආරම්භ කිරීම
subtitle: මිනිත්තු කිහිපයකින් ඔබගේ පළමු Majorsilence.Forms යෙදුම සාදන්න.
seo_title: "ආරම්භ කිරීම — බහු-වේදිකා WinForms යෙදුමක් සාදන්න"
description: >-
  dotnet සැකිල්ල භාවිතයෙන් මිනිත්තු කිහිපයකින් බහු-වේදිකා WinForms යෙදුමක් සාදන්න, නැතහොත් සාමාන්‍ය
  .NET ව්‍යාපෘතියකට Majorsilence.Forms එක් කරන්න. Windows, macOS සහ Linux.
keywords:
  - winforms cross platform tutorial
  - majorsilence.forms getting started
  - dotnet new winforms cross platform
  - winforms linux mac hello world
  - බහු-වේදිකා winforms යෙදුමක් සාදන්නේ කෙසේද
  - winforms සිංහල tutorial
  - dotnet winforms සැකිල්ල
priority: "0.8"
permalink: /si/getting-started/
---

## සැකිල්ලකින් (template)
{:#from-a-template}

Majorsilence.Forms යෙදුමක් ආරම්භ කිරීමට පහසුම ක්‍රමය වන්නේ NuGet හි `Majorsilence.Forms.Templates`
ලෙස ප්‍රකාශිත `dotnet` සැකිල්ලයි.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

මෙය **ව්‍යාපෘති දෙකක් සහිත solution එකක්** සාදා මූලික "Hello World" `MainForm` එකක් ධාවනය කරයි:

- `MajorsilenceFormsApp.Shared` — `MainForm` සහ `MainForm.Designer.cs` අඩංගු UI පුස්තකාලයකි. ඔබගේ
  සියලුම පෝරම මෙහි යන බැවින්, පහත සෑම head ව්‍යාපෘතියක්ම ඒවා බෙදා ගනී.
- `MajorsilenceFormsApp` — ඩෙස්ක්ටොප් head එක: Windows, macOS සහ Linux සඳහා Avalonia backend එක මත
  ක්‍රියා කරන `WinExe` එකකි.

`dotnet new majorsilenceforms -n MyApp` (අවශ්‍ය නම් `-o <dir>` ද සමඟ) නම් කළ ව්‍යාපෘතියක් සහ
namespace එකක් ලෙස සාදයි.

### ජංගම සහ බ්‍රවුසර head ව්‍යාපෘති
{:#mobile-and-browser-heads}

Avalonia හි අනෙකුත් ඉලක්ක සඳහා switch භාවිතයෙන් head ව්‍යාපෘති එක් කරන්න — ඒ සෑම එකක්ම එකම බෙදාගත් UI
පුස්තකාලය මත ඇති තුනී head එකකි:

```
dotnet new majorsilenceforms --IncludeAndroid --IncludeWasm --IncludeiOS
```

| Switch | එක් කරන දේ | අවශ්‍ය දේ |
|---|---|---|
| `--IncludeAndroid` | `MajorsilenceFormsApp.Android` (`net10.0-android`) | `dotnet workload install android` |
| `--IncludeWasm` | `MajorsilenceFormsApp.Wasm` (`net10.0-browser`) | `dotnet workload install wasm-tools` (`publish` සඳහා) |
| `--IncludeiOS` | `MajorsilenceFormsApp.iOS` (`net10.0-ios`) | `dotnet workload install ios` සහිත Mac එකක් |

මේ සියල්ල පෙරනිමියෙන් අක්‍රීයයි, එබැවින් සාමාන්‍ය `dotnet new majorsilenceforms` එකකට පසුව
`dotnet build` අමතර workload එකක් නොමැතිව ක්‍රියා කරයි. iOS head එක පර්යේෂණාත්මකයි (experimental).
`--msformsVersion` සහ `--avaloniaVersion` මගින් සැකිල්ල ස්ථිර කරන package අනුවාද ප්‍රතිස්ථාපනය කළ
හැක; [සැකිල්ලේ README]({{ site.github_url }}/blob/main/tools/Majorsilence.Forms.Templates/README.md)
බලන්න.

තවමත් වෙනම API ලේඛනයක් නැත, නමුත් Windows Forms අත්දැකීම් ඇති ඕනෑම අයෙකුට මෙම පෘෂ්ඨය හුරුපුරුදු
විය යුතුය. හොඳම යොමුව නිදසුන් යෙදුම්වල මූල කේතයයි:

- [`ControlGallery`]({{ site.github_url }}/tree/main/samples/ControlGallery) — සියලුම බිල්ට්-ඉන් පාලක, සජීවීව.
- [`Explorer`]({{ site.github_url }}/tree/main/samples/Explorer) — Windows Explorer ප්‍රතිරූපයක්.

සම්පූර්ණ ලැයිස්තුව සහ ඒ සෑම එකක්ම ධාවනය කරන ආකාරය සඳහා [නිදසුන්]({{ '/si/samples/' | relative_url }}) බලන්න.

## මුල සිටම
{:#from-scratch}

සාමාන්‍ය .NET console යෙදුමක් Majorsilence.Forms යෙදුමක් බවට පත් කිරීමට, පහත වෙනස්කම් කරන්න.

### Project ගොනුව
{:#project-file}

```xml
<PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
</PropertyGroup>
```

`Majorsilence.Forms` සහ backend එකක් සඳහා යොමුවක් (reference) එක් කරන්න — මූලික package එක කිසිදු
කවුළු toolkit එකක් යොමු නොකරයි, එබැවින් තිරය මත සැබවින්ම කවුළුවක් පෙන්වන්නේ backend එකයි:

```xml
<ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
</ItemGroup>
```

මූලික package එක `net8.0`, `net10.0` සහ `netstandard2.0` බහු-ඉලක්ක කරයි. කිසිදු බහු-වේදිකා
backend එකක් සඳහා `-windows` උපසර්ගයක් අවශ්‍ය නොවේ.

### හිස් පෝරමයක්
{:#an-empty-form}

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}
```

### Program.cs
{:#programcs}

ඔබගේ පෝරමයේ instance එකක් සමඟ `Application.Run()` අමතන්න:

```csharp
static void Main (string [] args)
{
    Application.Run (new MainForm ());
}
```

ඔබගේ යෙදුම දැන් ධාවනයට සූදානම් — පෙරනිමි Avalonia backend එක මත, එනම් වෙනත් කිසිදු වින්‍යාසයකින්
තොරව Windows, macOS සහ Linux.

### වෙනත් backend එකක් තෝරා ගැනීම
{:#selecting-another-backend}

Avalonia පෙරනිමියයි: කිසිවක් `Platform.Backend` සකසා නොමැති විට, `Majorsilence.Forms.Avalonia`
යොමු කර ඇත්නම් framework එක එය load කරයි. එම පෝරමයම වෙනත් ධාරකයක් මත ධාවනය කිරීමට, ඒ වෙනුවට එම
backend එකේ package එක යොමු කර `Application.Run` ට පෙර එය තෝරන්න:

```csharp
// GTK 4 — සැබෑ Gtk.Window එකක්, මූලිකව Linux සඳහා (GTK 4 runtime අවශ්‍යයි, උදා: libgtk-4-1)
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();
Application.Run (new MainForm ());

// Terminal — පෝරමය ටර්මිනලය පුරා පිරෙයි; Kitty graphics, Sixel, හෝ Unicode block elements
Majorsilence.Forms.Terminal.TerminalApplication.Use ();
Application.Run (new MainForm ());

// Headless — පරීක්ෂණ සහ CI සඳහා තිරයෙන් පිටත (offscreen) විදැහුම්කරණය
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();
```

Windows මත, නව යෙදුම් සඳහා නොව සංක්‍රමණය සඳහා තවත් backend දෙකක් ඇත: `Majorsilence.Forms.WinForms`
සහ `Majorsilence.Forms.Wpf`, පවතින WinForms හෝ WPF යෙදුමක් තුළ Majorsilence.Forms පාලක ධාරණය කරයි
(`myControl.ToWinFormsControl()`, `myControl.ToWpfElement()`), .NET Framework 4.8 මත ද ඇතුළුව. එබැවින්
ඔබට වරකට එක් පාලකයක් බැගින් port කර, අවසාන කොටස අවසන් වූ විට Avalonia හෝ Uno වෙත මාරු විය හැක.
Uno Platform ධාවනය වන්නේ එහිම app head එක හරහාය. backend හතම, ඒ සෑම එකකටම කළ හැකි සහ කළ නොහැකි
දේ, සහ ඔබගේම backend එකක් එක් කරන ආකාරය සඳහා
[වේදිකා backend]({{ '/si/backends/' | relative_url }}) බලන්න.

## අභිරුචි ලෙස අඳින පාලක තාර්කික ඒකකවලින් අඳියි
{:#custom-painted-controls-draw-in-logical-units}

පාලකයක `OnPaint` සහ `OnPaintBackground` overrides, සහ එහි `Paint` හසුරුවන, **තාර්කික ඒකක**
(logical units) වලින් අඳියි — framework එකේ අනෙක් සියල්ලටම භාවිත වන එම ඒකකම: `Left`, `Top`, `Width`,
`Height`, `ClientRectangle`, `ClientSize` සහ `MouseEventArgs.X`/`Y`. framework එක canvas එක
සංදර්ශකයට ගැළපෙන සේ පරිමාණනය කරයි, එබැවින් සාමාන්‍ය WinForms ඇඳීමේ කේතය HiDPI ඩෙස්ක්ටොප් එකක හෝ
ඕනෑම දුරකථනයක (Android ආසන්න වශයෙන් 2.6–2.75 ක `Scaling` වාර්තා කරයි) කිසිදු වෙනසකින් තොරව නිවැරදි
ප්‍රමාණයෙන් පෙනේ:

```csharp
protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    e.Graphics.DrawRectangle (Pens.Gray, 0, 0, Width - 1, Height - 1);   // පාලකය වටා රාමුවක් අඳියි
    e.Graphics.FillRectangle (Brushes.LimeGreen, 0, 0, 10, 10);         // 10x10 තාර්කික සමචතුරස්‍රයක්
}
```

`e.ClipRectangle` සඳහා ද, ඔබ SkiaSharp සමඟ කෙලින්ම අඳින්නේ නම් `e.Canvas` සඳහා ද එයම අදාළ වේ.
නිශ්චිත උපාංග පික්සලයක් මත යමක් තැබීමට අවශ්‍ය කේතය සඳහා `PaintEventArgs.Scaling` තවමත් ඇත,
`ScaledWidth`, `ScaledBounds` සහ `LogicalToDeviceUnits` ද එසේමය. පාලක ගැලරියේ ඇති
[`GameOfLifePanel.cs`]({{ site.github_url }}/blob/main/samples/ControlGallery/Panels/GameOfLifePanel.cs)
සම්පූර්ණ අභිරුචි පාලකයකි.

> **2026-10-01 ට පෙර නිකුතුවකින් උත්ශ්‍රේණි කරනවාද?** paint canvas එක කලින් තිබුණේ උපාංග පික්සලවලින්ය,
> සහ අභිරුචි පාලකයකට `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` තමන් විසින්ම ඇමතීමට සිදු විය.
> ඔබ එම ඇමතුම එක් කළේ නම් එය ඉවත් කරන්න — නැතහොත් ඇඳීම දැන් දෙවරක් පරිමාණනය වේ. Owner-draw සිදුවීම්
> (`DrawItem`, `DrawNode`, `CellPainting`) තවමත් ඔබට ලබා දෙන්නේ උපාංග-පික්සල සීමාවන්ය (bounds).
> මගහැරුණු ඕනෑම දෙයක් අල්ලා ගැනීමට `MF_HEADLESS_SCALE=2` සමඟ ඔබගේ පරීක්ෂණ ධාවනය කරන්න.

Hit-testing අමතර වෑයමකින් තොරව ස්ථාවරයි: `MouseEventArgs.X`/`Y` පැමිණෙන්නේ `Width`/`Height` සහ
paint canvas එකට සමාන තාර්කික ඒකකවලින්ය, එබැවින් වරක් ගොඩනගන ජ්‍යාමිතිය දෙකටම සේවය කරයි.

## ඊළඟට යා යුත්තේ කොතැනටද
{:#where-to-go-next}

- **[පුහුණු මාර්ගෝපදේශය]({{ '/si/training/' | relative_url }})** — සම්පූර්ණ කණ්ඩායමක් සඳහා ව්‍යුහගත
  විෂය නිර්දේශය: මානසික ආකෘතිය, ගැළපුම් ගිවිසුම (compatibility contract), සංක්‍රමණය, backend,
  පරීක්ෂණ, සහ ඒවා සමඟ යන CI gates සහ rollout සැලැස්ම.
- **[වේදිකා backend]({{ '/si/backends/' | relative_url }})** — ධාරක සන්ධිය (seam), backend හතම,
  බ්‍රවුසරයේ ධාවනය, පවතින Avalonia, Uno, GTK 4, WinForms හෝ WPF යෙදුමක් තුළ Majorsilence.Forms
  කාවැද්දීම, සහ ස්පර්ශ ඉඟි (touch gestures).
- **[CSS සමඟ තේමා සැකසීම]({{ site.github_url }}/blob/main/docs/theming.md)** — සෑම පාලකයක්ම නැවත
  හැඩගන්වන කුඩා CSS උප කුලකය, `Theme.LoadFromCssFile`, සහ සජීවී
  [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) නිදසුන.
- **[MVVM උපකාරක]({{ site.github_url }}/blob/main/docs/mvvm.md)** — `Majorsilence.Forms.Mvvm` හි
  `Observe`, `BindText`, `BindCommand` සහ `BindingScope`: reflection-රහිත, trim සහ AOT සඳහා ආරක්ෂිත,
  සහ CommunityToolkit.Mvvm සමඟ ගැළපේ.
- **[දුරකථන-ශෛලියේ තිරයක් සැලසුම් කිරීම]({{ site.github_url }}/blob/main/docs/mobile-layout.md)** —
  Android සහ iOS head සඳහා පෙළ wrap කිරීම, `Card`, `RichListBox`, `StackPanel` සහ `NavigationHost`.
- **[Animation]({{ site.github_url }}/blob/main/docs/animation.md)** — `RequestAnimationFrame`,
  tweens සහ easing, සහ headless පරීක්ෂණ සඳහා අතින් පාලනය කරන ඔරලෝසුව.
- **[ස්වයංක්‍රීයකරණය සහ UI පරීක්ෂණ]({{ '/si/automation/' | relative_url }})** — CI තුළ headless ලෙස
  ධාවනය වන UI පරීක්ෂණ ලියන්න, Selenium, FlaUI හෝ MCP සේවාදායකය හරහා AI සහායකයෙකු මගින් යෙදුම
  මෙහෙයවන්න, සහ Windows මත තිර කියවන සක්‍රීය කරන්න.
- **[ස්වදේශීය interop]({{ '/si/native-interop/' | relative_url }})** — ස්වදේශීය අන්තර්ගතය (වීඩියෝ,
  සිතියම්, බ්‍රවුසර එන්ජින්) ධාරණය කිරීම සහ `Control.Handle` යනු `HWND` එකක් නොවන්නේ ඇයි.

## පවතින WinForms යෙදුමක් සංක්‍රමණය කිරීම
{:#migrating-an-existing-winforms-app}

අලුතින් ආරම්භ කරනවා වෙනුවට පවතින කේත පදනමක් ගෙන එනවාද? ලේඛන දෙකක් එය ආවරණය කරයි:

- **[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)** — `majorsilence-migrate` CLI
  (`dotnet tool install -g Majorsilence.Forms.Migrator`) WinForms solution එකක් Majorsilence.Forms
  මතට නැවත ලියන ආකාරය සහ එහි ප්‍රතිදානය කියවන ආකාරය.
- **[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)** — ඔබගේ කේතය
  compile වූ පසු, සම්පූර්ණයෙන් ක්‍රියාත්මක කර ඇති දේ, ආසන්න වශයෙන් ක්‍රියාත්මක කර ඇති දේ, සහ හිතාමතාම
  විෂය පථයෙන් බැහැර කර ඇති දේ.

> බීටා අවධිය: API එක ස්ථාවර වෙමින් පවතින අතර සෑම WinForms කොනක්ම තවමත් ආවරණය වී නැත. නව බහු-වේදිකා
> ව්‍යාපාරික (LOB) යෙදුම් සඳහා සහ අද සැබෑ යෙදුම් සංක්‍රමණය කිරීම සඳහා එය හොඳින් ගැළපේ — අනුවාදය ස්ථිර
> කරන්න පමණි.
