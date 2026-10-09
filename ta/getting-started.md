---
layout: docs
lang: ta
title: தொடங்குதல்
subtitle: உங்கள் முதல் Majorsilence.Forms பயன்பாட்டை சில நிமிடங்களில் உருவாக்குங்கள்.
seo_title: "தொடங்குதல் — பல்தள WinForms பயன்பாடு ஒன்றை உருவாக்குங்கள்"
description: >-
  dotnet வார்ப்புருவைப் பயன்படுத்தி சில நிமிடங்களில் பல்தள WinForms பயன்பாடு ஒன்றை உருவாக்குங்கள், அல்லது
  சாதாரண .NET திட்டம் ஒன்றில் Majorsilence.Forms-ஐச் சேர்த்துக்கொள்ளுங்கள். Windows, macOS மற்றும் Linux.
keywords:
  - winforms பல்தள பயிற்சி
  - majorsilence.forms தொடங்குதல்
  - dotnet new winforms cross platform
  - winforms linux tutorial
  - பல்தள winforms hello world
  - .net gui பயன்பாடு உருவாக்குவது எப்படி
  - winforms macos linux
priority: "0.8"
permalink: /ta/getting-started/
---

## வார்ப்புருவிலிருந்து
{:#from-a-template}

Majorsilence.Forms பயன்பாடு ஒன்றைத் தொடங்குவதற்கான எளிதான வழி `dotnet` வார்ப்புரு (template) ஆகும். இது NuGet-இல் `Majorsilence.Forms.Templates` என்ற பெயரில் வெளியிடப்பட்டுள்ளது.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

இது **இரண்டு திட்டங்களைக் கொண்ட ஒரு solution**-ஐ உருவாக்கி, அடிப்படையான "Hello World" `MainForm` ஒன்றை இயக்குகிறது:

- `MajorsilenceFormsApp.Shared` — `MainForm` மற்றும் `MainForm.Designer.cs` ஆகியவற்றைக் கொண்ட UI நூலகம். உங்கள் எல்லாப் படிவங்களும் (forms) இங்கே இருக்கும்; எனவே கீழே உள்ள ஒவ்வொரு head-உம் அவற்றைப் பகிர்ந்துகொள்கிறது.
- `MajorsilenceFormsApp` — டெஸ்க்டாப் head: Windows, macOS மற்றும் Linux-க்காக Avalonia பின்தளத்தில் (backend) இயங்கும் `WinExe`.

`dotnet new majorsilenceforms -n MyApp` (விருப்பப்படி `-o <dir>`) பெயரிடப்பட்ட ஒரு திட்டத்திலும் namespace-இலும் உருவாக்குகிறது.

### மொபைல் மற்றும் உலாவி heads
{:#mobile-and-browser-heads}

Avalonia-வின் மற்ற இலக்குகளுக்கான head திட்டங்களை switches மூலம் சேர்க்கலாம் — ஒவ்வொன்றும் அதே பகிரப்பட்ட UI நூலகத்தின் மேல் அமைந்த மெல்லிய head ஆகும்:

```
dotnet new majorsilenceforms --IncludeAndroid --IncludeWasm --IncludeiOS
```

| Switch | சேர்ப்பது | தேவை |
|---|---|---|
| `--IncludeAndroid` | `MajorsilenceFormsApp.Android` (`net10.0-android`) | `dotnet workload install android` |
| `--IncludeWasm` | `MajorsilenceFormsApp.Wasm` (`net10.0-browser`) | `dotnet workload install wasm-tools` (`publish`-க்கு) |
| `--IncludeiOS` | `MajorsilenceFormsApp.iOS` (`net10.0-ios`) | `dotnet workload install ios` உடன் ஒரு Mac |

இவை அனைத்தும் இயல்பாக முடக்கப்பட்டுள்ளன; எனவே சாதாரண `dotnet new majorsilenceforms`-ஐத் தொடர்ந்து `dotnet build` எந்தக் கூடுதல் workload-உம் இல்லாமல் வேலை செய்யும். iOS head சோதனை நிலையில் (experimental) உள்ளது. `--msformsVersion` மற்றும் `--avaloniaVersion` ஆகியவை, உருவாக்கப்படும் திட்டம் நிலைப்படுத்தும் package பதிப்புகளை மாற்றியமைக்கின்றன; [வார்ப்புரு README]({{ site.github_url }}/blob/main/tools/Majorsilence.Forms.Templates/README.md)-ஐப் பாருங்கள்.

தனியான API ஆவணங்கள் இன்னும் இல்லை, ஆனால் Windows Forms அனுபவம் உள்ள எவருக்கும் இதன் API பரிச்சயமானதாக இருக்கும். மாதிரிப் பயன்பாடுகளின் மூலக் குறியீடே சிறந்த குறிப்பு:

- [`ControlGallery`]({{ site.github_url }}/tree/main/samples/ControlGallery) — உள்ளமைந்த ஒவ்வொரு கட்டுப்பாடும் (control), நேரடியாக இயங்கும் நிலையில்.
- [`Explorer`]({{ site.github_url }}/tree/main/samples/Explorer) — Windows Explorer-இன் நகல்.

முழுப் பட்டியலுக்கும் ஒவ்வொன்றையும் எப்படி இயக்குவது என்பதற்கும் [மாதிரிகள்]({{ '/ta/samples/' | relative_url }}) பக்கத்தைப் பாருங்கள்.

## புதிதாகத் தொடங்குதல்
{:#from-scratch}

சாதாரண .NET console பயன்பாடு ஒன்றை Majorsilence.Forms பயன்பாடாக மாற்ற, பின்வரும் மாற்றங்களைச் செய்யுங்கள்.

### திட்டக் கோப்பு
{:#project-file}

```xml
<PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
</PropertyGroup>
```

`Majorsilence.Forms`-க்கும் ஒரு பின்தளத்துக்கும் reference சேர்க்கவும் — core package எந்த windowing toolkit-ஐயும் reference செய்வதில்லை; எனவே திரையில் உண்மையில் சாளரத்தைக் காட்டுவது பின்தளமே:

```xml
<ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
</ItemGroup>
```

Core package `net8.0`, `net10.0` மற்றும் `netstandard2.0` ஆகியவற்றை multi-target செய்கிறது. எந்தப் பல்தள பின்தளத்துக்கும் `-windows` பின்னொட்டு தேவையில்லை.

### வெற்றுப் படிவம்
{:#an-empty-form}

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}
```

### Program.cs
{:#programcs}

உங்கள் படிவத்தின் ஒரு instance-உடன் `Application.Run()`-ஐ அழையுங்கள்:

```csharp
static void Main (string [] args)
{
    Application.Run (new MainForm ());
}
```

உங்கள் பயன்பாடு இப்போது இயங்கத் தயார் — இயல்புநிலை Avalonia பின்தளத்தில், மேலதிக அமைப்பு எதுவும் இல்லாமல் Windows, macOS மற்றும் Linux-இல் இயங்கும்.

### வேறொரு பின்தளத்தைத் தேர்ந்தெடுத்தல்
{:#selecting-another-backend}

Avalonia இயல்புநிலை: `Platform.Backend`-ஐ எதுவும் அமைக்காதபோது, `Majorsilence.Forms.Avalonia` reference செய்யப்பட்டிருந்தால் framework அதை ஏற்றுகிறது. அதே படிவத்தை வேறொரு ஹோஸ்டில் (host) இயக்க, அதற்குப் பதிலாக அந்தப் பின்தளத்தின் package-ஐ reference செய்து, `Application.Run`-க்கு முன் அதைத் தேர்ந்தெடுங்கள்:

```csharp
// GTK 4 — உண்மையான Gtk.Window, முதன்மையாக Linux (GTK 4 runtime தேவை, எ.கா. libgtk-4-1)
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();
Application.Run (new MainForm ());

// Terminal — படிவம் terminal முழுவதையும் நிரப்புகிறது; Kitty graphics, Sixel, அல்லது Unicode block elements
Majorsilence.Forms.Terminal.TerminalApplication.Use ();
Application.Run (new MainForm ());

// Headless — சோதனைகளுக்கும் CI-க்குமான திரைக்கு வெளியே வரைதல் (offscreen rendering)
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();
```

Windows-இல், புதிய பயன்பாடுகளுக்காக அல்லாமல் இடம்பெயர்த்தலுக்காக (migration) மேலும் இரண்டு பின்தளங்கள் உள்ளன: `Majorsilence.Forms.WinForms` மற்றும் `Majorsilence.Forms.Wpf` ஆகியவை, ஏற்கனவே உள்ள WinForms அல்லது WPF பயன்பாட்டினுள் Majorsilence.Forms கட்டுப்பாடுகளை ஹோஸ்ட் செய்கின்றன (`myControl.ToWinFormsControl()`, `myControl.ToWpfElement()`), .NET Framework 4.8 உட்பட. இதனால் ஒரு நேரத்தில் ஒரு கட்டுப்பாட்டை port செய்து, கடைசிப் பகுதி முடிந்ததும் Avalonia அல்லது Uno-க்கு மாறலாம். Uno Platform அதன் சொந்த app head மூலம் இயங்குகிறது. ஏழு பின்தளங்களையும், ஒவ்வொன்றும் எதைச் செய்ய முடியும், எதைச் செய்ய முடியாது என்பதையும், உங்கள் சொந்தப் பின்தளத்தை எப்படிச் சேர்ப்பது என்பதையும் அறிய [Platform backends]({{ '/ta/backends/' | relative_url }}) பக்கத்தைப் பாருங்கள்.

## தனிப்பயனாக வரையப்படும் கட்டுப்பாடுகள் தருக்க அலகுகளில் வரைகின்றன
{:#custom-painted-controls-draw-in-logical-units}

ஒரு கட்டுப்பாட்டின் `OnPaint` மற்றும் `OnPaintBackground` overrides-உம், அதன் `Paint` handlers-உம் **தருக்க அலகுகளில் (logical units)** வரைகின்றன — framework-இல் உள்ள மற்ற எல்லாவற்றுக்கும் உரிய அதே அலகுகள்: `Left`, `Top`, `Width`, `Height`, `ClientRectangle`, `ClientSize` மற்றும் `MouseEventArgs.X`/`Y`. Framework, canvas-ஐ display-க்கு ஏற்ப அளவிடுகிறது (scaling); எனவே சாதாரண WinForms வரைதல் குறியீடு HiDPI டெஸ்க்டாப்பிலும் எந்தத் தொலைபேசியிலும் (Android சுமார் 2.6–2.75 அளவிலான `Scaling`-ஐத் தெரிவிக்கிறது) எந்த மாற்றமும் இன்றி சரியான அளவில் இருக்கும்:

```csharp
protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    e.Graphics.DrawRectangle (Pens.Gray, 0, 0, Width - 1, Height - 1);   // கட்டுப்பாட்டைச் சுற்றி சட்டம் வரைகிறது
    e.Graphics.FillRectangle (Brushes.LimeGreen, 0, 0, 10, 10);         // 10x10 தருக்கச் சதுரம்
}
```

`e.ClipRectangle`-க்கும், நீங்கள் SkiaSharp-உடன் நேரடியாக வரைந்தால் `e.Canvas`-க்கும் இதுவே பொருந்தும். ஒன்றைச் சரியான ஒரு சாதனப் பிக்சலில் (device pixel) வைக்க விரும்பும் குறியீட்டுக்காக `PaintEventArgs.Scaling` இன்னும் உள்ளது; `ScaledWidth`, `ScaledBounds` மற்றும் `LogicalToDeviceUnits` ஆகியவையும் உள்ளன. கட்டுப்பாட்டுக் காட்சியகத்தில் (control gallery) உள்ள [`GameOfLifePanel.cs`]({{ site.github_url }}/blob/main/samples/ControlGallery/Panels/GameOfLifePanel.cs) ஒரு முழுமையான தனிப்பயன் கட்டுப்பாடு ஆகும்.

> **2026-10-01-க்கு முந்தைய வெளியீட்டிலிருந்து மேம்படுத்துகிறீர்களா?** முன்பு paint canvas சாதனப் பிக்சல்களில் இருந்தது; தனிப்பயன் கட்டுப்பாடு ஒன்று `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`-ஐத் தானே அழைக்க வேண்டியிருந்தது. நீங்கள் அந்த அழைப்பைச் சேர்த்திருந்தால் அதை நீக்குங்கள் — இல்லையெனில் வரைதல் இப்போது இருமுறை அளவிடப்படும். Owner-draw நிகழ்வுகள் (`DrawItem`, `DrawNode`, `CellPainting`) இன்னும் சாதனப் பிக்சல் எல்லைகளையே தருகின்றன. தவறிப்போன எதையும் கண்டறிய உங்கள் சோதனைகளை `MF_HEADLESS_SCALE=2` உடன் இயக்குங்கள்.

Hit-testing கூடுதல் முயற்சியின்றி ஒத்திசைவாக இருக்கும்: `MouseEventArgs.X`/`Y` ஆகியவை `Width`/`Height` மற்றும் paint canvas உள்ள அதே தருக்க அலகுகளில் வருகின்றன; எனவே ஒருமுறை கட்டமைக்கப்படும் geometry இரண்டுக்கும் பயன்படும்.

## அடுத்து எங்கே செல்வது
{:#where-to-go-next}

- **[பயிற்சி வழிகாட்டி]({{ '/ta/training/' | relative_url }})** — ஒரு முழுக் குழுவுக்குமான கட்டமைக்கப்பட்ட பாடத்திட்டம்: மனமாதிரி (mental model), இணக்க ஒப்பந்தம், இடம்பெயர்த்தல், பின்தளங்கள், சோதனை, அவற்றுடன் இணைந்த CI gates மற்றும் அறிமுகத் திட்டம் (rollout plan).
- **[Platform backends]({{ '/ta/backends/' | relative_url }})** — ஹோஸ்ட் இணைப்புக்கோடு (seam), ஏழு பின்தளங்களும், உலாவியில் இயக்குதல், ஏற்கனவே உள்ள Avalonia, Uno, GTK 4, WinForms அல்லது WPF பயன்பாட்டினுள் Majorsilence.Forms-ஐ உட்பொதித்தல் (embedding), மற்றும் தொடு சைகைகள் (touch gestures).
- **[CSS மூலம் தீம் அமைத்தல்]({{ site.github_url }}/blob/main/docs/theming.md)** — ஒவ்வொரு கட்டுப்பாட்டின் தோற்றத்தையும் மாற்றும் சிறிய CSS துணைத்தொகுப்பு, `Theme.LoadFromCssFile`, மற்றும் நேரடியாக இயங்கும் [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) மாதிரி.
- **[MVVM உதவிகள்]({{ site.github_url }}/blob/main/docs/mvvm.md)** — `Majorsilence.Forms.Mvvm`-இலிருந்து `Observe`, `BindText`, `BindCommand` மற்றும் `BindingScope`: reflection இல்லாதவை, trim மற்றும் AOT-க்குப் பாதுகாப்பானவை, CommunityToolkit.Mvvm-உடன் இணக்கமானவை.
- **[தொலைபேசி பாணித் திரையை வடிவமைத்தல்]({{ site.github_url }}/blob/main/docs/mobile-layout.md)** — Android மற்றும் iOS heads-க்கான உரை மடிப்பு (wrapping text), `Card`, `RichListBox`, `StackPanel` மற்றும் `NavigationHost`.
- **[அசைவூட்டம் (Animation)]({{ site.github_url }}/blob/main/docs/animation.md)** — `RequestAnimationFrame`, tweens மற்றும் easing, மற்றும் headless சோதனைகளுக்கான கைமுறைக் கடிகாரம் (manual clock).
- **[தானியக்கம் & UI சோதனை]({{ '/ta/automation/' | relative_url }})** — CI-இல் headless-ஆக இயங்கும் UI சோதனைகளை எழுதுதல், Selenium, FlaUI அல்லது MCP server வழியாக AI உதவியாளர் மூலம் பயன்பாட்டை இயக்குதல், மற்றும் Windows-இல் திரை வாசிப்பான்களை (screen readers) இயங்கச் செய்தல்.
- **[Native interop]({{ '/ta/native-interop/' | relative_url }})** — native உள்ளடக்கத்தை (வீடியோ, வரைபடங்கள், உலாவி இயந்திரங்கள்) ஹோஸ்ட் செய்தல், மற்றும் `Control.Handle` ஏன் ஒரு `HWND` அல்ல என்பது.

## ஏற்கனவே உள்ள WinForms பயன்பாட்டை இடம்பெயர்த்தல்
{:#migrating-an-existing-winforms-app}

புதிதாகத் தொடங்குவதற்குப் பதிலாக ஏற்கனவே உள்ள codebase ஒன்றைக் கொண்டுவருகிறீர்களா? இரண்டு ஆவணங்கள் அதை விளக்குகின்றன:

- **[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)** — `majorsilence-migrate` CLI (`dotnet tool install -g Majorsilence.Forms.Migrator`) ஒரு WinForms solution-ஐ Majorsilence.Forms-க்கு எப்படி மீண்டும் எழுதுகிறது, அதன் வெளியீட்டை எப்படிப் படிப்பது.
- **[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)** — உங்கள் குறியீடு compile ஆன பின், எவை முழுமையாகச் செயல்படுத்தப்பட்டுள்ளன, எவை தோராயமாகச் செயல்படுத்தப்பட்டுள்ளன, எவை வேண்டுமென்றே வரம்புக்கு வெளியே உள்ளன.

> பீட்டா (beta) நிலை: API நிலைபெற்று வருகிறது; WinForms-இன் எல்லா மூலைகளும் இன்னும் உள்ளடக்கப்படவில்லை. புதிய பல்தள வணிக (LOB) பயன்பாடுகளுக்கும், உண்மையான பயன்பாடுகளை இன்றே இடம்பெயர்த்துவதற்கும் இது பொருத்தமானது — உங்கள் பதிப்பை நிலைப்படுத்துங்கள், அவ்வளவுதான்.
