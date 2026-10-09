---
layout: docs
lang: ta
title: ஒரு WinForms பயன்பாட்டை இடம்பெயர்த்தல்
subtitle: ஏற்கனவே உள்ள Windows Forms தீர்வை (solution) தானியங்கி மீள்எழுத்தின் மூலம் Majorsilence.Forms இற்கு நகர்த்துங்கள் — அல்லது படிப்படியாக, ஒரு நேரத்தில் ஒரு படிவம் அல்லது ஒரு கட்டுப்பாடு என நகர்த்துங்கள்; அதுவரை மீதமுள்ளவை உண்மையான WinForms அல்லது WPF உடன் தொடர்ந்து build ஆகும்.
permalink: /ta/migration/
seo_title: "WinForms ஐ பல்தள .NET இற்கு இடம்பெயர்த்தல் — Migration கருவி"
description: >-
  ஒரு Windows Forms பயன்பாட்டை முழுமையாக மீண்டும் எழுதாமல் பல்தள .NET இற்கு இடம்பெயர்த்துங்கள்.
  majorsilence-migrate CLI namespaces, projects, resources ஆகியவற்றை git diff ஆக மீண்டும் எழுதுகிறது;
  WinForms, WPF பின்தளங்கள் ஒரு நேரத்தில் ஒரு கட்டுப்பாட்டை port செய்ய அனுமதிக்கின்றன.
keywords:
  - winforms migration
  - winforms இடம்பெயர்த்தல்
  - winforms migration tool
  - winforms பல்தள மாற்றம்
  - winforms .net 10 migration
  - winforms linux port
  - பழைய winforms பயன்பாட்டை நவீனமாக்கல்
  - system.windows.forms migration
priority: "0.9"
---

ஒரு WinForms பயன்பாட்டை XAML framework ஒன்றுக்கு இடம்பெயர்த்தல் என்றால் ஒவ்வொரு திரையையும் மீண்டும்
கட்டியெழுப்புவதாகும். அதை Majorsilence.Forms இற்கு இடம்பெயர்த்தல் பெரும்பாலும் ஒரு **இயந்திரத்தனமான
மீள்எழுத்து (mechanical rewrite)** — அதே படிவங்கள், அதே கட்டுப்பாடுகள், அதே நிகழ்வு கையாளிகள் (event
handlers), வேறொரு namespace ஐ நோக்கி மாற்றப்பட்டவை — அதை உங்களுக்காகச் செய்யும் ஒரு CLI உம் உள்ளது.

```bash
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff
```

முழுமையான குறிப்பு repository இல் உள்ள [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)
ஆகும். இந்தப் பக்கம் ஒரு அறிமுக வழிகாட்டி மட்டுமே.

## கருவியை நிறுவுதல்
{:#installing-the-tool}

Migrator, nuget.org இல் ஒரு .NET tool ஆக வெளியிடப்படுகிறது; இப்போது அது வெளியிடப்படும் ஒரே
வடிவம் **இது மட்டுமே** — முன்பு releases ஒவ்வொரு தளத்துக்கும் ஒரு self-contained single-file binary
ஐயும் இணைத்தன; இப்போது அப்படிச் செய்வதில்லை. அதாவது கணினியில் ஒரு .NET runtime தேவை (package
`RollForward=latestMajor` உடன் `net10.0` ஐ இலக்காகக் கொள்கிறது, எனவே புதிய runtime ஒன்றும் சரியே).

```bash
# Global ஆக நிறுவுதல்
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help

# அல்லது repo வாரியாக, ஒரு tool manifest இல் பதிப்பை நிலைப்படுத்தி
dotnet new tool-manifest
dotnet tool install Majorsilence.Forms.Migrator
dotnet majorsilence-migrate --help
```

எதையும் நிறுவ விரும்பவில்லை என்றால், repository இன் clone ஒன்றிலிருந்து
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>` மூலம் இயக்கலாம்.

## Migrator எவற்றை மாற்றுகிறது
{:#what-the-migrator-changes}

| இலக்கு | என்ன நடக்கிறது |
|---|---|
| `.csproj` / `.vbproj` | `UseWindowsForms`/`UseWPF` ஐ நீக்குகிறது, `-windows` TFM பின்னொட்டை அகற்றுகிறது (`net8.0-windows` → `net8.0`, `net10.0-windows10.0.19041.0` → `net10.0`) — import செய்யப்பட்ட `.props`/`.targets` கோப்புகளிலும் சேர்த்து — Windows Desktop framework reference ஐ அகற்றுகிறது, WinForms இற்கு மட்டுமான packages ஐ நீக்குகிறது (Telerik UI for WinForms, DevExpress, **`System.Drawing.Common`**), மேலும் மீள்எழுத்து உண்மையில் தொடும் ஒவ்வொரு project இலும் `Majorsilence.Forms` உம் ஒரு பின்தளமும் சேர்க்கிறது. Central Package Management பயன்படுத்தும் solutions மதிக்கப்படுகின்றன: பதிப்பு இல்லாத `PackageReference`கள், பதிப்புகள் `Directory.Packages.props` இல் சேர்க்கப்படும் |
| `.cs` / `.vb` | நீளமான prefix முதலில் என்ற அட்டவணை மூலம் namespaces ஐ மீண்டும் எழுதுகிறது, அதனால் உருவாகும் இரட்டை `using`/`Imports` வரிகளைச் சுருக்குகிறது, தக்கவைக்கப்பட்ட `System.Drawing` import தெளிவற்றதாக்கும் சில பெயர்களுக்கு aliases சேர்க்கிறது (`SystemColors`, `ColorTranslator`, Telerik இன் `TabStripItem`), மேலும் `ApplicationConfiguration.Initialize()` ஐ comment செய்கிறது |
| Visual Basic சிறப்பம்சங்கள் | `MyType=Empty` பொருந்துவது நின்றவுடன் இழக்கப்படும் மறைமுக WinForms constructor ஐ உட்செலுத்துகிறது, ஒரு `My.Resources` accessor module ஐ உருவாக்குகிறது, மீதமுள்ள `My.*` பயன்பாடுகளுக்கு எச்சரிக்கை தருகிறது. `My.Application.Info.*`, `My.Resources.*`, `My.Computer.Name` உண்மையாகவே செயல்படுத்தப்பட்டுள்ளன; `My.Forms`, `My.Settings`, `My.User` மற்றும் ஏனையவை இன்னும் எச்சரிக்கை தருகின்றன |
| `.resx` | Framework மாற்றத்தின் பின்னும் தப்பிப் பிழைக்க வேண்டிய image, type references ஐக் கண்டறிகிறது |
| Strongly-typed resource designers | உருவாக்கப்பட்ட `Resources.Designer.cs` பாணிக் கோப்புகளில் (அவற்றில் மட்டும்) `System.Resources.ResourceManager` ஆனது `Majorsilence.Forms.ComponentResourceManager` ஆக மாறுகிறது; இதனால் உருவாக்கப்பட்ட `(Icon) ResourceManager.GetObject(...)` casts முதல் resource வாசிப்பிலேயே exception எறியாமல் runtime இல் வெற்றிபெறுகின்றன |
| அறிக்கை | தான் தொட்ட அனைத்தையும், ஒரு மனிதர் பார்க்க வேண்டும் என்று கருதும் அனைத்தையும் சுருக்கும் Markdown அறிக்கையை எழுதுகிறது |

`System.Drawing.Common` அகற்றப்படுவது தோன்றுவதைவிட முக்கியமானது: அதை reference ஆக விட்டால்
`System.Drawing.Bitmap`/`Font`/`Pen` ஆகியவை அவற்றின் `Majorsilence.Forms.Drawing` மாற்றீடுகளுக்கு
அருகில் மீண்டும் scope இற்குள் வருகின்றன; அப்போது தகுதிப்படுத்தப்படாத (unqualified) ஒவ்வொரு பயன்பாடும்
port ஐ நோக்கித் தீர்க்கப்படாமல் *ambiguous reference* ஆகத் தோல்வியடைகிறது. மேலும் "மீள்எழுத்து தொடும்
projects" என்பது "WinForms projects" ஐவிட அகலமானது: image helper ஒன்றைக் கொண்ட சாதாரண class library
ஒன்றும் `Majorsilence.Forms.Drawing.*` ஆக மீண்டும் எழுதப்படுகிறது, அதற்கும் அந்த reference தேவை.
`System.Drawing` இல் தங்கியிருக்கும் அடிப்படை வகைகளை (`Color`, `Point`, `Size`) மட்டும் பயன்படுத்தும்
libraries தொடப்படுவதில்லை.

### நீங்கள் உண்மையில் பயன்படுத்தும் options
{:#the-options-youll-actually-use}

- `--dry-run --diff` — எதையும் எழுதாமல் unified diff ஐக் காட்டுகிறது.
- `--no-backup` — `.bak` கோப்புகள் இல்லாமல் இடத்திலேயே மாற்றுகிறது, ஏனெனில் git தான் backup.
- `--backend avalonia|uno|headless` — எந்தப் பின்தள package ஐச் சேர்ப்பது (இயல்புநிலை Avalonia).
- `--package-version <v>` — package பதிப்பை நிலைப்படுத்துகிறது; இயல்பாக migrator இன் சொந்தப் பதிப்பு,
  ஏனெனில் கருவியும் packages உம் ஒரே release இலிருந்து வெளியிடப்படுகின்றன.
- `--map <file>` — கருவிக்குத் தெரியாத மூன்றாம் தரப்பு vendor ஒருவருக்கான (உதாரணமாக DevExpress) கூடுதல்
  namespace mappings, package globs அடங்கிய JSON கோப்பு. Telerik UI for WinForms உள்ளமைக்கப்பட்டுள்ளது;
  அது `--map` இல்லாமலேயே `Majorsilence.Forms.Telerik` இற்கு map ஆகிறது.
- `--strict` — ஏதேனும் manual-review எச்சரிக்கை உருவானால் non-zero exit code உடன் வெளியேறுகிறது.
  புதிய, map செய்யப்படாத reference ஒன்று pipeline ஐத் தோல்வியடையச் செய்யும் வகையில், இடம்பெயர்க்கப்பட்ட
  branch இல் இதை CI gate ஆகப் பயன்படுத்துங்கள்.
- `--engine roslyn` — symbol அறிந்த இரண்டாவது சுற்று; கீழே காண்க.

Krypton Toolkit ports இற்கு ஒரு கூடுதல் படி உண்டு: வகை-உறவு உண்மைகளைக் கருவியால் சரிசெய்ய முடியாது
(Majorsilence.Forms இன் `Form` ஒரு `Control` அல்ல), எனவே repository, Standard, Extended toolkits
இற்காக idempotent bridge scripts ஐ [`tools/fixups/`]({{ site.github_url }}/tree/main/tools/fixups)
இல் வழங்குகிறது; மீதமுள்ள வேலை
[`docs/krypton-port-plan.md`]({{ site.github_url }}/blob/main/docs/krypton-port-plan.md) இல் கண்காணிக்கப்படுகிறது.

## பரிந்துரைக்கப்படும் முதல் ஓட்டம்
{:#the-recommended-first-run}

ஒரு git branch இல், இடத்திலேயே இயக்குங்கள்; அப்போது இடம்பெயர்த்தல் என்பது நீங்கள் வாசிக்கவும், மீண்டும்
இயக்கவும், திரும்பப் பெறவும் கூடிய ஒரு diff ஆகிறது:

```bash
# எதையும் மாற்றும் முன் வீச்சைப் பாருங்கள்
majorsilence-migrate MySolution.sln --dry-run --diff

# பின்னர் உண்மையாகச் செய்யுங்கள் — git தான் backup, எனவே .bak கோப்புகளைத் தவிர்க்கவும்
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

மீள்எழுத்து idempotent ஆனது, எனவே மேலும் பழைய code ஐ merge செய்த பின் மீண்டும் இயக்குவது பாதுகாப்பானது.
அறிக்கையை வாசியுங்கள்: அது ஒவ்வொரு எச்சரிக்கையையும் காரணப்படி குழுவாக்குகிறது; மிகவும் பொதுவான
"skipped project" என்பது, கருவி அதைப் parse செய்யும் முன் SDK பாணிக்கு மாற்றப்பட வேண்டிய பழைய
non-SDK-style `.csproj` ஆகும் — இது ஒரு முன்தேவைப் படி, இடம்பெயர்த்தலில் உள்ள குறைபாடு அல்ல.

## இரண்டு engines
{:#two-engines}

இயல்புநிலை engine வேண்டுமென்றே ஒரு **உரை அடிப்படையிலான மீள்எழுதி (textual rewriter)** — syntax tree
இல்லை, symbol resolution இல்லை. இது ஒரு குறுக்குவழி போலத் தோன்றலாம், ஆனால் அப்படியல்ல: பாதி
இடம்பெயர்க்கப்பட்ட solution இலும், இன்னும் யாரும் port செய்யாத type ஒன்றைக் குறிப்பிடும் `.vb` கோப்பிலும்,
தற்போது compile ஆகாத project இலும் கருவி வேலை செய்யும் என்பதே இதன் பொருள். Roslyn அடிப்படையிலான கருவி
ஒன்று project build ஆகும் வரை அதைத் தொட மறுக்கும்; இது பழைய codebase ஒன்றின் மீதான *முதல் சுற்றின்*
நோக்கத்தையே தோற்கடிக்கிறது. மேலும் இது ஆயிரக்கணக்கான கோப்புகளை வினாடிகளில் கடந்து செல்கிறது.

இது விட்டுக்கொடுப்பது cross-project symbol resolution: இரண்டும் வெறும் பெயரால் பயன்படுத்தப்படும்போது
உங்கள் சொந்த `Panel` class ஐ `System.Windows.Forms.Panel` இலிருந்து அதனால் வேறுபடுத்த முடியாது.
அந்தக் குறிப்பிட்ட சூழலுக்கு, `MSBuildWorkspace` உம் உண்மையான symbol resolution உம் பயன்படுத்தும்
விருப்பத்தேர்வான `--engine roslyn` உள்ளது. அது மிகவும் மெதுவானது, load செய்யக்கூடிய project ஒன்று
தேவை, எனவே அது இரண்டாவது சுற்று — முதலாவது அல்ல. இது project வாரியாக fail closed ஆகிறது: load ஆகாத
ஒரு project, அந்த project இன் கோப்புகளுக்கு மட்டும் ஒரு எச்சரிக்கையுடன் text engine இற்குத் திரும்புகிறது.

## படிப்படியான இடம்பெயர்த்தல்: ஒரே தடவையில் switch ஐப் புரட்டாமல் இருக்க ஐந்து வழிகள்
{:#incremental-migration-five-ways-to-not-flip-the-switch-at-once}

ஒரு பெரிய பயன்பாட்டை ஒரே commit இல் நகர்த்த நீங்கள் அரிதாகவே விரும்புவீர்கள். இப்போது அதைப் படிகளாகச்
செய்யப் பல வழிகள் உள்ளன, அவற்றை ஒன்றாகச் சேர்த்தும் பயன்படுத்தலாம்.

### `--dual-build`: ஒரே codebase, எந்த stack உம்
{: id="--dual-build-one-codebase-either-stack"}

`--dual-build` ஒரு C# project ஐ **எந்த** stack உடனும் build ஆகும்படி விடுகிறது; ஒரே ஒரு MSBuild
property மூலம் மாற்றலாம்; இதனால் port நடந்துகொண்டிருக்கும்போது Windows developer ஒருவர் உண்மையான
WinForms உடன் தொடர்ந்து compile செய்யலாம். `UseWindowsForms`, `-windows` TFM, WinForms இற்கு மட்டுமான
packages அனைத்தும் அப்படியே இருக்கும்; Majorsilence.Forms அவற்றுடன் சேர்க்கப்படுகிறது, கோப்பின் மேலுள்ள
`using System.Windows.Forms;` மட்டும் ஒரு `#if MAJORSILENCE_FORMS` நிபந்தனையாக மாறுகிறது. மாற்றுவதற்கு
`Directory.Build.props` இல் `<MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>` ஐ அமையுங்கள். VB இற்கு
இது வழங்கப்படுவதில்லை — `MyType=Empty` முழு `My` framework ஐயும் அணைக்கிறது, அதை preprocessor symbol
ஒன்றால் மாற்ற முடியாது — எனவே `--dual-build` கொடுக்கப்பட்ட VB project ஒன்று எச்சரிக்கையுடன் வழமையான
முறையில் மாற்றப்படுகிறது.

### `WindowsFormsInterop`: முழுப் படிவங்கள், இரு திசைகளிலும்
{:#windowsformsinterop-whole-forms-both-directions}

Windows இல், [`Majorsilence.Forms.WindowsFormsInterop`]({{ site.github_url }}/blob/main/docs/winforms-interop.md)
உண்மையான `System.Windows.Forms` படிவங்களை Avalonia பின்தளத்தில் இயங்கும் Majorsilence.Forms
பயன்பாடு ஒன்றுக்குள் ஹோஸ்ட் செய்கிறது (மறுதிசையிலும்), ஒரே Win32 message pump ஐப் பகிர்ந்துகொண்டு;
இதனால் இயங்கிக்கொண்டிருக்கும் பயன்பாடு ஒன்றில் முழுத் திரைகளை ஒவ்வொன்றாக நகர்த்தலாம்.

### WinForms, WPF பின்தளங்கள்: ஒரு நேரத்தில் ஒரு கட்டுப்பாடு
{:#the-winforms-and-wpf-backends-one-control-at-a-time}

`Majorsilence.Forms.WinForms` உம் `Majorsilence.Forms.Wpf` உம் Windows இற்கு மட்டுமான **இடம்பெயர்த்தல்
பின்தளங்கள் (migration backends)**. Avalonia இற்குப் பதிலாக, Majorsilence.Forms இன் கீழுள்ள ஹோஸ்ட்
ஒரு உண்மையான `System.Windows.Forms` சாளரம் (அல்லது ஒரு WPF `Window`); Skia மேற்பரப்பு ஒரு GDI bitmap
(அல்லது ஒரு `WriteableBitmap`) மூலம் காட்டப்படுகிறது. முக்கியமானது உட்பொதித்தலின் திசை: port செய்யப்பட்ட
Majorsilence.Forms கட்டுப்பாடு ஒன்று ஏற்கனவே உள்ள பயன்பாட்டுக்குள் சாதாரண WinForms `Control` ஆகவோ
WPF `FrameworkElement` ஆகவோ மீண்டும் பொருந்துகிறது.

```csharp
// WinForms ஹோஸ்ட்
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// WPF ஹோஸ்ட்
myWpfGrid.Children.Add (myMfControl.ToWpfElement ());
```

`ToWinFormsForm()` / `ToWpfWindow()` முழு `Form` ஒன்றுக்கும் இதையே செய்கின்றன, உண்மையான native-modal
`ShowDialog(owner)` உட்பட. இரு packages உம் `net8.0-windows`, `net10.0-windows` உடன் **`net48`** ஐயும்
இலக்காகக் கொள்கின்றன, core package இன் `netstandard2.0` build உடன் இணைந்து; இதனால் .NET Framework
4.8 பயன்பாடு ஒன்று நவீன .NET இற்கு நகர்வதற்கு *முன்பே* Majorsilence.Forms ஐ ஏற்கத் தொடங்கலாம்.
WinForms கட்டுப்பாட்டு library ஒன்று தனது உட்பகுதிகளை port செய்துகொண்டே, தனது பயனர்களுக்கு WinForms
கட்டுப்பாடுகளைத் தொடர்ந்து வழங்கலாம்.

எல்லாம் port செய்யப்பட்டதும், பின்தள package ஐ `Majorsilence.Forms.Avalonia` (அல்லது Uno, அல்லது
GTK 4) ஆக மாற்றுங்கள்; அதே code பல்தளமாகிறது; பின்தள இணைப்புக்கோட்டுக்கு (seam) மேலே எதுவும்
மாறுவதில்லை. இந்தப் பின்தளங்களில் `IWebViewFactory` இல்லை, gesture ஆதரவும் இல்லை; Windows அல்லாத
தளங்களில் அவை வெற்று placeholder assemblies ஆக build ஆகின்றன, இதனால் பல்தள solution ஒன்று எங்கும்
compile ஆகிறது. மாதிரிகள்:
[`samples/EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms),
[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf); package READMEs:
[WinForms]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinForms/README.md),
[WPF]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Wpf/README.md).

### `WinFormsShims.Compat`: namespace ஐ மீண்டும் எழுத முடியாதபோது
{:#winformsshimscompat-when-you-cant-rewrite-the-namespace}

சில வேளைகளில் `using System.Windows.Forms;` ஐ மீண்டும் எழுதுவது சாத்தியமில்லை: தனது சொந்த **public API**
`System.Windows.Forms`/`System.Drawing` வகைகளில் அமைந்துள்ள, பயனர்களிடம் அவர்களின் code ஐ மாற்றுமாறு
கேட்க முடியாத, விநியோகிக்கப்படும் கட்டுப்பாட்டு library ஒன்று.
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinFormsShims.Compat/README.md)
என்பது Majorsilence.Forms ஐ அடிப்படையாகக் கொண்ட `System.Windows.Forms`, `System.Drawing` namespaces ஐ
வெளியிடும் Roslyn source generator ஆகும்; இதனால் மாற்றப்படாத WinForms source — Designer.cs கோப்புகள்
உட்பட — port உடன் compile ஆகிறது. இது ஒரு **proof of concept** ஆக வெளியிடப்பட்டுள்ளது: sealed அல்லாத
ஒவ்வொரு class இற்கும் subclasses, sealed drawing leaves (`Font`, `Pen`, `Bitmap`...) இற்கு implicit
conversions கொண்ட wrappers, forwarding static classes (`Application`, `MessageBox`, `Brushes`...), மற்றும்
`Control` இன் சொந்த நிகழ்வுக் குடும்பம். அதன் முதன்மைக் குறைபாடு `Control` மூலமான polymorphic storage;
C# இன் single inheritance அதை மறைக்க முடியாது. அதை நம்புவதற்கு முன் README இன் scope பகுதியை
வாசியுங்கள்; மாதிரி [`samples/WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo),
அதன் கண்டுபிடிப்புகள் `RESULTS.md` இல்.

### `Theming.WinForms`: இரு பாதிகளுக்கும் ஒரே stylesheet
{:#themingwinforms-one-stylesheet-for-both-halves}

கலப்புப் பயன்பாடு ஒன்றில் ஒரே சாளரத்தில் இரண்டு காட்சி அமைப்புகள் உள்ளன. [`Majorsilence.Forms.Theming.WinForms`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Theming.WinForms/README.md)
Majorsilence.Forms பயன்படுத்தும் அதே CSS தீம் ஐ **உண்மையான** `System.Windows.Forms` கட்டுப்பாடுகளுக்குப்
பயன்படுத்துகிறது — அதே tokens, அதே selectors, அதே diagnostics — கட்டுப்பாட்டு மரத்தைக் கடந்து
`BackColor`, `ForeColor`, `Font`, `FlatAppearance`, `DataGridView` cell styles, tokens இலிருந்து கட்டப்பட்ட
`ToolStripProfessionalRenderer`, DWM வழியாக Windows 11 title bar ஆகியவற்றை அமைப்பதன் மூலம். தொடக்கத்தில்
ஒருமுறை `WinFormsCssTheme.Apply`, ஒவ்வொரு படிவத்துக்கும் `Track(form)`, WinForms ஆல் வெளிப்படுத்த முடியாத
எதற்கும் `Diagnostics` ஐ வாசியுங்கள்; எதுவும் மௌனமாகப் புறக்கணிக்கப்படுவதில்லை. ஆதரவு அட்டவணை
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md) இல் உள்ளது.

## Compile ஆன பிறகு
{:#after-it-compiles}

Migrator, code ஐ build ஆகும் நிலைக்குக் கொண்டுவருகிறது. எந்த WinForms நடத்தை முழுமையாகச்
செயல்படுத்தப்பட்டுள்ளது, எது தோராயமானது, எது வேண்டுமென்றே வீச்சுக்கு வெளியே உள்ளது என்பதை அது
உங்களுக்குச் *சொல்வதில்லை* — அது [இணக்க அட்டவணை (compatibility matrix)]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md),
அடுத்து வாசிக்க வேண்டிய ஆவணம் அதுவே.

சோதிக்கும் முன் இணக்க அடுக்கின் ஒரு பண்பை நன்கு உள்வாங்கிக்கொள்வது பயனுள்ளது: **செயல்படுத்தப்படாத
members exception எறிவதற்குப் பதிலாக no-op (எதுவும் செய்யாது) ஆக இருக்கும் அல்லது பொருத்தமான இயல்புநிலை
மதிப்பைத் தரும்.** காட்சி அம்சம் ஒன்று இன்னும் இல்லாத இடங்களிலும் இடம்பெயர்க்கப்பட்ட code compile ஆகி
இயங்குகிறது; இது சரியான இயல்புநிலை — ஆனால் ஒரு குறைபாடு சத்தமின்றி மௌனமாக இருக்கலாம் என்பதும் இதன்
பொருள். `Image.MakeTransparent` அப்படி ஒன்றாக இருந்தது: நிற-விசை (colour-keyed) sprite sheet ஒன்று ஒவ்வொரு
sprite இன் பின்னாலும் ஒரு வெள்ளைப் பெட்டியுடன் வரையப்பட்டது, எதுவும் exception எறியவில்லை. இப்போது
repository இதற்கு எதிராக `NoOpStubBaselineTests` மூலம் பாதுகாக்கிறது; அது வெற்று உடல் கொண்ட public `void`
methods இன் அறியப்பட்ட தொகுப்பை `NoOpStubBaseline.txt` இல் நிலைப்படுத்துகிறது (இதை எழுதும் நேரத்தில்
161), இதனால் புதிய stub ஒன்றை ஏற்பது ஒரு உணர்வுபூர்வமான, பதிவுசெய்யப்பட்ட செயலாகிறது. இடம்பெயர்க்கப்பட்ட
பயன்பாட்டை build செய்வதோடு நிறுத்தாமல், சோதியுங்கள்.

இணக்கத்தின் இரண்டு பாதிகளிலும் project எங்கே நிற்கிறது:

- **API மேற்பரப்பு:** upstream WinForms, GDI+ இற்கு எதிரான தானியங்கி gap plans **பூஜ்ஜியத்தில்** உள்ளன —
  upstream இல் உள்ள ஒவ்வொரு public member உம் அறிவிக்கப்பட்டுள்ளது.
- **நடத்தை:** பன்னிரண்டு பகுதிகளை உள்ளடக்கிய ஒரு தணிக்கை (ஆகஸ்ட் 2026), member ஒன்று இருந்தும் WinForms
  செய்வதைச் செய்யாத **483 இடங்களைக்** கண்டறிந்தது. அந்தக் கட்டங்களில் பெரும்பாலானவை அதன் பின்
  நிறைவடைந்துள்ளன — keyboard முன்-செயலாக்கம் (`ProcessCmdKey`), focus, validation, உண்மையான உரையாடல்
  சாளரங்கள், படிவ வாழ்க்கைச் சுழற்சி, நிகழ்வு வரிசை, live data binding, `ListView` details view,
  `DataGridView` நிகழ்வுகள், text-box undo, `ToolStrip` நடத்தை, `NotifyIcon`,
  `Application.AddMessageFilter`. தொடர் கணக்கு
  [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md) இல் உள்ளது.

சோதிக்கும் முன் `MIGRATION.md` இல் இரண்டு வகையான மாற்றங்களைக் கவனமாக வாசிப்பது பயனுள்ளது, ஏனெனில்
இரு வழியிலும் அவை சிக்கலின்றி compile ஆகின்றன:

- **WinForms உடன் பொருந்துவதற்காகச் செய்யப்பட்ட உடைக்கும் மாற்றங்கள் (breaking changes).**
  `SplitContainer.Orientation` இப்போது WinForms இல் உள்ளதுபோல் splitter bar இன் திசையைக் குறிக்கிறது;
  எனவே நீங்கள் அதை அமைத்திருந்தால், தலைகீழாக்குங்கள். `TreeViewDrawMode.OwnerDrawContent` என்பது
  `OwnerDrawText` இற்கான ஒரு `[Obsolete]` alias; `OwnerDrawAll` இப்போது உள்ளது. நிகழ்வு delegate வகைகள்
  WinForms உடன் பொருந்துகின்றன (`KeyEventHandler`, `MouseEventHandler`, `FormClosingEventHandler`),
  எனவே designer உருவாக்கிய `new KeyEventHandler(...)` வரிகள் compile ஆகின்றன — ஆனால் `Click`, `MouseEnter`
  இனி mouse ஆயத்தொலைவுகளைக் கொண்டுசெல்வதில்லை, ஏனெனில் WinForms இல் அவை ஒருபோதும் கொண்டுசெல்லவில்லை.
  Gradient, hatch brushes `Majorsilence.Forms.Drawing.Drawing2D` இற்கு நகர்ந்துள்ளன, GDI+ அவற்றை வைத்திருக்கும்
  இடம் அதுவே.
- **தனிப்பயன் வரைதல் கொண்ட கட்டுப்பாடுகள் தருக்க அலகுகளில் (logical units) வரைகின்றன** (2026-10-01
  முதல்). `ClientRectangle`, `ClientSize`, உங்கள் `OnPaint`/`Paint` கையாளி பெறும் canvas ஆகியவை இப்போது
  `Bounds` போலவே தருக்க அலகுகளில் உள்ளன; framework காட்சித்திரைக்கு ஏற்ப அளவிடுகிறது (scaling). தனிப்பயன்
  கட்டுப்பாடு ஒன்று தானே `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` ஐ அழைத்திருந்தால், அந்த
  அழைப்பை நீக்குங்கள், இல்லையெனில் எல்லாம் இரட்டை அளவில் வரையப்படும். Owner-draw நிகழ்வுகள் (`DrawItem`,
  `DrawNode`, `CellPainting`) இன்னும் சாதனப் பிக்சல்களையே தருகின்றன. சோதனை ஓட்டத்தில்
  `MF_HEADLESS_SCALE=2` இந்த வேறுபாட்டைக் காட்டும்.

## இடம்பெயர்க்கப்பட்ட உண்மையான பயன்பாடுகள்
{:#real-apps-that-have-been-migrated}

இது வெறும் கோட்பாடு அல்ல. Majorsilence இன் சொந்த
[MPlayercontrol](https://github.com/majorsilence/MPlayercontrol),
[Reporting](https://github.com/majorsilence/Reporting/tree/feature/modernization-roadmap) ஆகியவை
இடம்பெயர்க்கப்பட்டு வருகின்றன; மேலும் இணக்க அடுக்கையும் migrator ஐயும் சோதிப்பதற்காகவே திறந்த மூல
WinForms projects பல fork செய்யப்பட்டுள்ளன — ஒரு Notepad++ clone, DarkUI, PKHeX, metroframework,
RibbonWinForms, ஒரு Super Mario Bros remake, advanceddatagridview மற்றும் பல. மேலே உள்ள stub baseline
அட்டவணையில் உள்ள பல குறைபாடுகள் இவ்வாறே கண்டறியப்பட்டன. முழுப் பட்டியல் repository readme இன்
[Migrated Project Examples]({{ site.github_url }}#migrated-project-examples) பகுதியில் உள்ளது.

## ஒரு யதார்த்தமான திட்டம்
{:#a-realistic-plan}

1. Migrator ஐ ஒரு branch இல் இயக்குங்கள், முதலில் dry-run. அறிக்கையை வாசியுங்கள்.
2. Compile ஆகச் செய்யுங்கள். Manual-review எச்சரிக்கைகளைக் கையாளுங்கள்; அவை நீங்கியதும் CI இல் `--strict` ஐச் சேர்க்கவும்.
3. உங்கள் பயன்பாடு பெரிதும் சார்ந்திருக்கும் எதற்கும் இணக்க அட்டவணையைச் சரிபாருங்கள் — `DataGridView`,
   தனிப்பயன் வரைதல், மூன்றாம் தரப்புக் கட்டுப்பாட்டுத் தொகுப்புகள்.
4. Regressions தெரியும்படி [தானியக்க மரத்துக்கு (automation tree)]({{ '/ta/automation/' | relative_url }})
   எதிராக UI சோதனைகளை அமையுங்கள்; அது எந்த OS இலும் CI இல் headless ஆக (திரையின்றி) இயங்குகிறது.
5. முதலில் Windows இற்கு வெளியிடுங்கள் — அதே தளம், புதிய framework, ஒரு நேரத்தில் ஒரு மாறி. பயன்பாடு
   பெரியதாக இருந்தால், WinForms அல்லது WPF பின்தளத்தில் ஒரு நேரத்தில் ஒரு கட்டுப்பாடாகச் செய்யுங்கள்.
   பின்னர் பின்தளத்தை மாற்றி macOS, Linux ஐச் சேர்க்கவும்.
6. Package பதிப்பை நிலைப்படுத்துங்கள். Project பீட்டா நிலையில் உள்ளது, API இன்னும் நிலைப்பட்டு வருகிறது.

[பயிற்சி வழிகாட்டியின் Module 5]({{ '/ta/training/' | relative_url }}#module-5) ஒரு குழுவை இதனூடாக
விரிவாக அழைத்துச் செல்கிறது, C#, VB.NET இரண்டிலும் உதாரணங்களுடன்.

## அடுத்து
{:#next}

- [பயிற்சி வழிகாட்டி]({{ '/ta/training/' | relative_url }}) — இடம்பெயர்க்கும் குழு ஒன்றுக்கான முழுப் பாடத்திட்டம்.
- [பல்தள WinForms]({{ '/ta/cross-platform-winforms/' | relative_url }}) — இணக்க அடுக்கு எதைச்
  செய்யும், எதைச் செய்யாது.
- [பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms, WPF,
  Headless அருகருகே.
- [WinForms மாற்றுகள் ஒப்பீடு]({{ '/ta/winforms-alternatives/' | relative_url }}) — இதற்கும் முழு
  மீள்எழுத்துக்கும் இடையே நீங்கள் இன்னும் தேர்ந்தெடுத்துக்கொண்டிருந்தால்.
- [FAQ]({{ '/ta/faq/' | relative_url }}) — முதலில் எழும் கேள்விகள்.
