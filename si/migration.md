---
layout: docs
lang: si
title: WinForms යෙදුමක් සංක්‍රමණය කරන්න
subtitle: දැනට පවතින Windows Forms විසඳුමක් ස්වයංක්‍රීය නැවත ලිවීමක් මගින් Majorsilence.Forms වෙත ගෙන යන්න — නැතහොත් එය පියවරෙන් පියවර, වරකට එක් පෝරමයක් හෝ එක් පාලකයක් බැගින් කරන්න; ඉතිරි කොටස සැබෑ WinForms හෝ WPF සමඟම build වෙමින් පවතී.
permalink: /si/migration/
seo_title: "WinForms බහු-වේදිකා .NET වෙත සංක්‍රමණය — Migration Tool"
description: >-
  Windows Forms යෙදුමක් නැවත ලිවීමකින් තොරව බහු-වේදිකා .NET වෙත සංක්‍රමණය කරන්න. majorsilence-migrate
  CLI මෙවලම namespace, ව්‍යාපෘති සහ resources git diff එකක් ලෙස නැවත ලියන අතර, WinForms සහ WPF
  backend මගින් වරකට එක් පාලකයක් බැගින් port කිරීමට ඉඩ දෙයි.
keywords:
  - winforms migration
  - winforms සංක්‍රමණය
  - winforms migration tool
  - winforms cross platform
  - winforms linux
  - winforms .net 10
  - winforms යෙදුම නවීකරණය
  - system.windows.forms migration
  - legacy winforms modernization
priority: "0.9"
---

WinForms යෙදුමක් XAML framework එකකට සංක්‍රමණය කිරීම යනු සෑම තිරයක්ම නැවත ගොඩනැගීමයි. එය
Majorsilence.Forms වෙත සංක්‍රමණය කිරීම බොහෝ දුරට **යාන්ත්‍රික නැවත ලිවීමකි** — එම පෝරම, එම පාලක, එම
සිදුවීම් හසුරුවන (event handlers), වෙනත් namespace එකකට යොමු කර ඇත — සහ ඔබ වෙනුවෙන් එය සිදු කරන CLI
මෙවලමක් ඇත.

```bash
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff
```

සම්පූර්ණ යොමුව repository එකේ ඇති [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) වේ.
මෙම පිටුව දළ හැඳින්වීමයි.

## මෙවලම ස්ථාපනය කිරීම
{:#installing-the-tool}

migrator මෙවලම nuget.org වෙත .NET tool එකක් ලෙස නිකුත් වන අතර, දැන් එය නිකුත් වන **එකම** ආකාරය එයයි —
කලින් නිකුතු සමඟ එක් එක් වේදිකාව සඳහා self-contained single-file binary එකක්ද අමුණා තිබුණත්, දැන් එසේ
නොකෙරේ. එයින් අදහස් වන්නේ යන්ත්‍රයේ .NET runtime එකක් අවශ්‍ය බවයි (පැකේජය `RollForward=latestMajor`
සමඟ `net10.0` ඉලක්ක කරයි, එබැවින් නවතම runtime එකක් වුවද ගැටලුවක් නැත).

```bash
# ගෝලීය ස්ථාපනය
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help

# නැතහොත් repo එකකට පමණක්, tool manifest එකක ස්ථිර කර
dotnet new tool-manifest
dotnet tool install Majorsilence.Forms.Migrator
dotnet majorsilence-migrate --help
```

කිසිවක් ස්ථාපනය නොකිරීමට කැමති නම්, repository එකේ clone එකකින්
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>` ලෙස එය ධාවනය කරන්න.

## migrator මෙවලම වෙනස් කරන දේ
{:#what-the-migrator-changes}

| ඉලක්කය | සිදු වන දේ |
|---|---|
| `.csproj` / `.vbproj` | `UseWindowsForms`/`UseWPF` ඉවත් කරයි, `-windows` TFM උපසර්ගය ඉවත් කරයි (`net8.0-windows` → `net8.0`, `net10.0-windows10.0.19041.0` → `net10.0`) — import කළ `.props`/`.targets` තුළද — Windows Desktop framework reference එක ඉවත් කරයි, WinForms-පමණක් පැකේජ (Telerik UI for WinForms, DevExpress, **`System.Drawing.Common`**) ඉවත් කරයි, සහ නැවත ලිවීම සැබවින්ම ස්පර්ශ කරන සෑම ව්‍යාපෘතියකටම `Majorsilence.Forms` සහ backend එකක් එක් කරයි. Central Package Management භාවිත කරන විසඳුම්වලට ගරු කෙරේ: අනුවාදයකින් තොර `PackageReference`, අනුවාද `Directory.Packages.props` වෙත එක් කෙරේ |
| `.cs` / `.vb` | දිගම-උපසර්ගය-පළමුව (longest-prefix-first) වගුවක් හරහා namespace නැවත ලියයි, එයින් ඇති වන අනුපිටපත් `using`/`Imports` පේළි එකතු කරයි, රඳවා ගත් `System.Drawing` import එකක් නිසා අපැහැදිලි වන නම් කිහිපය සඳහා alias එක් කරයි (`SystemColors`, `ColorTranslator`, Telerik හි `TabStripItem`), සහ `ApplicationConfiguration.Initialize()` comment out කරයි |
| Visual Basic විශේෂතා | `MyType=Empty` අදාළ වීම නතර වූ විට නැති වන implicit WinForms constructor එක ඇතුළු කරයි, `My.Resources` accessor module එකක් ජනනය කරයි, සහ ඉතිරි `My.*` භාවිතය ගැන අනතුරු ඇඟවීම් දෙයි. `My.Application.Info.*`, `My.Resources.*` සහ `My.Computer.Name` සැබවින්ම ක්‍රියාත්මක කර ඇත; `My.Forms`, `My.Settings`, `My.User` සහ ඉතිරිය තවමත් අනතුරු ඇඟවීම් දෙයි |
| `.resx` | framework මාරුවෙන් පසුවද පැවතිය යුතු image සහ type references සොයා ගනී |
| Strongly-typed resource designers | ජනනය කළ `Resources.Designer.cs`-ආකාර ගොනුවල (සහ ඒවායේ පමණක්), `System.Resources.ResourceManager` යන්න `Majorsilence.Forms.ComponentResourceManager` බවට පත් වේ, එබැවින් ජනනය කළ `(Icon) ResourceManager.GetObject(...)` casts පළමු resource කියවීමේදී exception එකක් විසි කරනවා වෙනුවට runtime හිදී සාර්ථක වේ |
| වාර්තාව | එය ස්පර්ශ කළ සියල්ලේ සහ මිනිසෙකු විසින් පරීක්ෂා කළ යුතු යැයි එය සලකන සියල්ලේ Markdown සාරාංශයක් ලියයි |

`System.Drawing.Common` ඉවත් වීම පෙනෙනවාට වඩා වැදගත් ය: එය reference කර තැබුවහොත්
`System.Drawing.Bitmap`/`Font`/`Pen` නැවතත් ඒවායේ `Majorsilence.Forms.Drawing` ආදේශක අසලම scope එකට
පැමිණෙන අතර, එවිට සෑම අසුදුසුකම් නොලත් (unqualified) භාවිතයක්ම port එකට resolve වෙනවා වෙනුවට
*ambiguous reference* දෝෂයක් ලෙස අසාර්ථක වේ. තවද "නැවත ලිවීම ස්පර්ශ කරන ව්‍යාපෘති" යනු "WinForms ව්‍යාපෘති"
වලට වඩා පුළුල් ය: image helper එකක් ඇති සාමාන්‍ය class library එකක්ද `Majorsilence.Forms.Drawing.*` වෙත
නැවත ලියවෙන අතර එයටද reference එක අවශ්‍ය වේ. `System.Drawing` තුළ රැඳෙන primitives (`Color`, `Point`,
`Size`) පමණක් භාවිත කරන libraries වලට අත නොතැබේ.

### ඔබ සැබවින්ම භාවිත කරන විකල්ප
{:#the-options-youll-actually-use}

- `--dry-run --diff` — කිසිවක් ලිවීමකින් තොරව unified diff එක පෙන්වයි.
- `--no-backup` — `.bak` ගොනු නොමැතිව එම ස්ථානයේම වෙනස් කරයි, මන්ද git යනු backup එකයි.
- `--backend avalonia|uno|headless` — එක් කළ යුතු backend පැකේජය (Avalonia පෙරනිමියයි).
- `--package-version <v>` — පැකේජ අනුවාදය ස්ථිර කරයි; පෙරනිමිය migrator මෙවලමේම අනුවාදයයි, මන්ද
  මෙවලම සහ පැකේජ එකම නිකුතුවෙන් නිකුත් වේ.
- `--map <file>` — මෙවලම නොදන්නා තෙවන පාර්ශ්ව vendor කෙනෙකු (උදාහරණයක් ලෙස DevExpress) සඳහා අමතර namespace
  mappings සහ package globs අඩංගු JSON ගොනුවක්. Telerik UI for WinForms ගොඩනගා ඇති අතර `--map` නොමැතිවම
  `Majorsilence.Forms.Telerik` වෙත map වේ.
- `--strict` — අතින් සමාලෝචනය කළ යුතු (manual-review) අනතුරු ඇඟවීමක් ඇති වුවහොත් ශුන්‍ය නොවන කේතයකින්
  පිටවෙයි. සංක්‍රමණය කළ branch එකේ CI gate එකක් ලෙස එය භාවිත කරන්න, එවිට අලුත් map නොකළ reference එකක්
  pipeline එක අසාර්ථක කරයි.
- `--engine roslyn` — symbol ගැන දැනුවත් දෙවන අදියර, පහතින් බලන්න.

Krypton Toolkit ports සඳහා එක් අමතර පියවරක් ඇත: මෙවලමට type-relationship කරුණු නිවැරදි කළ නොහැක
(Majorsilence.Forms `Form` එකක් `Control` එකක් නොවේ), එබැවින් repository එක Standard සහ Extended toolkits
සඳහා idempotent bridge scripts [`tools/fixups/`]({{ site.github_url }}/tree/main/tools/fixups) තුළ
සපයන අතර, ඉතිරි වැඩ
[`docs/krypton-port-plan.md`]({{ site.github_url }}/blob/main/docs/krypton-port-plan.md) තුළ ලුහුබඳිනු ලැබේ.

## නිර්දේශිත පළමු ධාවනය
{:#the-recommended-first-run}

එය git branch එකක එම ස්ථානයේම ධාවනය කරන්න, එවිට සංක්‍රමණය ඔබට කියවිය හැකි, නැවත ධාවනය කළ හැකි සහ
ආපසු හැරවිය හැකි diff එකක් වේ:

```bash
# කිසිවක් වෙනස් කිරීමට පෙර විෂය පථය බලන්න
majorsilence-migrate MySolution.sln --dry-run --diff

# ඉන්පසු සැබවින්ම කරන්න — git යනු backup එකයි, එබැවින් .bak ගොනු මඟ හරින්න
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

නැවත ලිවීම idempotent වේ, එබැවින් තවත් legacy කේතය merge කළ පසු එය නැවත ධාවනය කිරීම ආරක්ෂිතයි. වාර්තාව
කියවන්න: එය සෑම අනතුරු ඇඟවීමක්ම හේතුව අනුව සමූහගත කරයි, සහ වඩාත් සුලභ "skipped project" යනු මෙවලමට
parse කිරීමට පෙර SDK style වෙත පරිවර්තනය කළ යුතු පැරණි non-SDK-style `.csproj` එකකි — එය පූර්ව අවශ්‍යතා
පියවරක් මිස සංක්‍රමණයේ හිඩැසක් නොවේ.

## Engine දෙකක්
{:#two-engines}

පෙරනිමි engine එක හිතාමතාම **පාඨමය නැවත ලියනයකි (textual rewriter)** — syntax tree එකක් නැත, symbol
resolution නැත. එය කෙටි මඟක් ලෙස ඇසෙන නමුත් එසේ නොවේ: එයින් අදහස් වන්නේ මෙවලම අඩක් සංක්‍රමණය කළ
විසඳුමක් මත, කිසිවෙකු තවම port නොකළ type එකක් reference කරන `.vb` ගොනුවක් මත, දැනට compile නොවන
ව්‍යාපෘතියක් මත ක්‍රියා කරන බවයි. Roslyn මත පදනම් වූ මෙවලමක් ව්‍යාපෘතියක් build වන තුරු එයට අත තැබීම
ප්‍රතික්ෂේප කරයි, එය legacy කේත පදනමක් මත *පළමු අදියරක* අරමුණම පරාජය කරයි. එය තත්පර කිහිපයකින් ගොනු
දහස් ගණනක් හරහාද ධාවනය වේ.

එය අත්හරින්නේ ව්‍යාපෘති අතර symbol resolution ය: දෙකම හිස් නමින් භාවිත කරන විට ඔබේම `Panel` class එක
`System.Windows.Forms.Panel` වෙතින් වෙන්කර හඳුනා ගැනීමට එයට නොහැක. එම නිශ්චිත අවස්ථාව සඳහා
`MSBuildWorkspace` සහ සැබෑ symbol resolution භාවිත කරන, තෝරා ගත යුතු (opt-in) `--engine roslyn` ඇත. එය
බොහෝ මන්දගාමී වන අතර load කළ හැකි ව්‍යාපෘතියක් අවශ්‍ය වේ, එබැවින් එය දෙවන අදියරයි — පළමුවැන්න නොවේ. එය
එක් එක් ව්‍යාපෘතිය සඳහා ආරක්ෂිතව අසාර්ථක වේ (fails closed): load නොවන එක් ව්‍යාපෘතියක් අනතුරු ඇඟවීමක් සමඟ
එම ව්‍යාපෘතියේ ගොනු සඳහා text engine එකට ආපසු වැටේ.

## පියවරෙන් පියවර සංක්‍රමණය: සියල්ල එකවර මාරු නොකිරීමට ක්‍රම පහක්
{:#incremental-migration-five-ways-to-not-flip-the-switch-at-once}

විශාල යෙදුමක් එක් commit එකකින් ගෙන යාමට ඔබට අවශ්‍ය වන්නේ කලාතුරකිනි. දැන් එය පියවර වශයෙන් කිරීමට ක්‍රම
කිහිපයක් ඇති අතර, ඒවා එකට භාවිත කළ හැක.

### `--dual-build`: එක් කේත පදනමක්, ඕනෑම stack එකක්
{: id="--dual-build-one-codebase-either-stack"}

`--dual-build` මගින් C# ව්‍යාපෘතියක් **ඕනෑම** stack එකකට එරෙහිව build වන ලෙස තබයි, එය තනි MSBuild
property එකකින් මාරු කෙරේ, එබැවින් port කිරීම සිදු වන අතරතුර Windows සංවර්ධකයෙකුට සැබෑ WinForms සමඟ
දිගටම compile කළ හැක. `UseWindowsForms`, `-windows` TFM සහ WinForms-පමණක් පැකේජ සියල්ල රැඳේ;
Majorsilence.Forms ඒවා අසලට එක් කෙරෙන අතර, ගොනුවේ ඉහළ ඇති `using System.Windows.Forms;` පමණක්
`#if MAJORSILENCE_FORMS` කොන්දේසියක් බවට පත් වේ. එය මාරු කිරීමට `Directory.Build.props` තුළ
`<MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>` සකසන්න. VB සඳහා මෙය ලබා නොදේ — `MyType=Empty` සම්පූර්ණ
`My` framework එකම අක්‍රිය කරන අතර preprocessor symbol එකකින් එය මාරු කළ නොහැක — එබැවින් `--dual-build`
ලබා දුන් VB ව්‍යාපෘතියක් අනතුරු ඇඟවීමක් සමඟ සාමාන්‍ය ආකාරයට පරිවර්තනය වේ.

### `WindowsFormsInterop`: සම්පූර්ණ පෝරම, දෙපැත්තටම
{:#windowsformsinterop-whole-forms-both-directions}

Windows මත, [`Majorsilence.Forms.WindowsFormsInterop`]({{ site.github_url }}/blob/main/docs/winforms-interop.md)
මගින් Avalonia backend මත ධාවනය වන Majorsilence.Forms යෙදුමක් තුළ සැබෑ `System.Windows.Forms` පෝරම
ධාරණය කරයි (සහ ප්‍රතිලෝමවද), එක් Win32 message pump එකක් බෙදා ගනිමින්, එබැවින් ධාවනය වන යෙදුමක සම්පූර්ණ
තිර වරකට එකක් බැගින් ගෙන යා හැක.

### WinForms සහ WPF backend: වරකට එක් පාලකයක්
{:#the-winforms-and-wpf-backends-one-control-at-a-time}

`Majorsilence.Forms.WinForms` සහ `Majorsilence.Forms.Wpf` යනු Windows-පමණක් **සංක්‍රමණ backend** වේ.
Avalonia වෙනුවට, Majorsilence.Forms යටින් ඇති ධාරකය (host) සැබෑ `System.Windows.Forms` කවුළුවකි
(නැතහොත් WPF `Window` එකකි), Skia surface එක GDI bitmap එකක් (නැතහොත් `WriteableBitmap` එකක්) හරහා
ඉදිරිපත් කෙරේ. මෙහි වැදගත්කම කාවැද්දීමේ (embedding) දිශාවයි: port කළ Majorsilence.Forms පාලකයක් සාමාන්‍ය
WinForms `Control` එකක් හෝ WPF `FrameworkElement` එකක් ලෙස පවතින යෙදුමට නැවත ඇතුළු වේ.

```csharp
// WinForms ධාරකය
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// WPF ධාරකය
myWpfGrid.Children.Add (myMfControl.ToWpfElement ());
```

`ToWinFormsForm()` / `ToWpfWindow()` සම්පූර්ණ `Form` එකක් සඳහාද එයම කරයි, සැබෑ native-modal
`ShowDialog(owner)` ඇතුළුව. පැකේජ දෙකම `net8.0-windows` සහ `net10.0-windows` මෙන්ම **`net48`** ද ඉලක්ක
කරන අතර, core පැකේජයේ `netstandard2.0` build එක සමඟ යුගල වේ, එබැවින් .NET Framework 4.8 යෙදුමකට නවීන
.NET වෙත ගෙන යාමට *පෙරම* Majorsilence.Forms භාවිතය ආරම්භ කළ හැක. WinForms පාලක library එකකට එහි අභ්‍යන්තර
කොටස් port කර එහි පාරිභෝගිකයින්ට දිගටම WinForms පාලක සැපයිය හැක.

සියල්ල port කළ පසු, backend පැකේජය `Majorsilence.Forms.Avalonia` (හෝ Uno, හෝ GTK 4) වෙත මාරු කරන්න, එවිට
එම කේතයම බහු-වේදිකා වේ; backend සන්ධියට (seam) ඉහළින් කිසිවක් වෙනස් නොවේ. මෙම backend මත
`IWebViewFactory` නැත, gesture සහාය නැත, සහ Windows නොවන වේදිකාවල ඒවා හිස් placeholder assemblies ලෙස
build වේ, එබැවින් බහු-වේදිකා විසඳුමක් තවමත් සෑම තැනකම compile වේ. නිදසුන්:
[`samples/EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) සහ
[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf); පැකේජ READMEs:
[WinForms]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinForms/README.md),
[WPF]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Wpf/README.md).

### `WinFormsShims.Compat`: namespace නැවත ලිවිය නොහැකි විට
{:#winformsshimscompat-when-you-cant-rewrite-the-namespace}

සමහර විට `using System.Windows.Forms;` නැවත ලිවීම විකල්පයක් නොවේ: තමන්ගේම **public API** එක
`System.Windows.Forms`/`System.Drawing` වලට type කර ඇති, සහ පාරිභෝගිකයින්ගෙන් ඔවුන්ගේ කේතය වෙනස් කරන්නැයි
ඉල්ලිය නොහැකි, බෙදා හරින ලද පාලක library එකක්.
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinFormsShims.Compat/README.md)
යනු Majorsilence.Forms මත පදනම් වූ `System.Windows.Forms` සහ `System.Drawing` namespace නිකුත් කරන Roslyn
source generator එකකි, එබැවින් වෙනස් නොකළ WinForms මූලාශ්‍ර කේතය — Designer.cs ගොනු ඇතුළුව — port එකට
එරෙහිව compile වේ. එය **සංකල්ප සාධනයක් (proof of concept)** ලෙස ප්‍රකාශයට පත් කර ඇත: sealed නොවන සෑම
class එකකටම subclasses, sealed drawing leaves (`Font`, `Pen`, `Bitmap`...) සඳහා implicit conversions සහිත
wrappers, forwarding static classes (`Application`, `MessageBox`, `Brushes`...), සහ `Control` හි තමන්ගේම
event පවුල. එහි ප්‍රධාන හිඩැස `Control` හරහාම polymorphic ගබඩා කිරීමයි, එය C# හි single inheritance මගින්
වසා දැමිය නොහැක. එය මත රඳා පැවතීමට පෙර README හි scope කොටස කියවන්න; නිදසුන
[`samples/WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo) වන අතර, එහි
සොයාගැනීම් `RESULTS.md` තුළ ඇත.

### `Theming.WinForms`: කොටස් දෙකටම එක් stylesheet එකක්
{:#themingwinforms-one-stylesheet-for-both-halves}

මිශ්‍ර යෙදුමකට එක් කවුළුවක් තුළ දෘශ්‍ය පද්ධති දෙකක් ඇත. [`Majorsilence.Forms.Theming.WinForms`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Theming.WinForms/README.md)
මගින් Majorsilence.Forms භාවිත කරන එම CSS තේමාවම **සැබෑ** `System.Windows.Forms` පාලකවලට යොදයි —
එම tokens, එම selectors, එම diagnostics — පාලක ගසය හරහා ගමන් කරමින් `BackColor`, `ForeColor`, `Font`,
`FlatAppearance`, `DataGridView` cell styles, tokens වලින් ගොඩනැගූ `ToolStripProfessionalRenderer` එකක්,
සහ DWM හරහා Windows 11 title bar එක සකසමින්. ආරම්භයේදී එක් වරක් `WinFormsCssTheme.Apply`, එක් එක් පෝරමය
සඳහා `Track(form)`, සහ WinForms හට ප්‍රකාශ කළ නොහැකි වූ ඕනෑම දෙයක් සඳහා `Diagnostics` කියවන්න; කිසිවක්
නිහඬව නොසලකා හරිනු නොලැබේ. සහාය න්‍යාසය
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md) වේ.

## එය compile වූ පසු
{:#after-it-compiles}

migrator මෙවලම කේතය build වන තත්ත්වයට ගෙන එයි. එය ඔබට *නොකියන* දෙය නම් කුමන WinForms හැසිරීම සම්පූර්ණයෙන්
ක්‍රියාත්මක කර ඇත්ද, කුමක් ආසන්න කර ඇත්ද, සහ කුමක් හිතාමතාම විෂය පථයෙන් පිටත ඇත්ද යන්නයි — එය
[ගැළපුම් න්‍යාසය (compatibility matrix)]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) වන අතර,
ඊළඟට කියවිය යුතු ලේඛනය එයයි.

පරීක්ෂා කිරීමට පෙර ගැළපුම් ස්තරයේ එක් ගුණාංගයක් හොඳින් තේරුම් ගැනීම වටී: **ක්‍රියාත්මක නොකළ සාමාජිකයින්
exception විසි කරනවා වෙනුවට no-op (කිසිවක් නොකරයි) හෝ සාධාරණ පෙරනිමි අගයක් ආපසු දෙයි.** දෘශ්‍ය විශේෂාංගයක්
තවම නොමැති තැන්වලදී පවා සංක්‍රමණය කළ කේතය compile වී ධාවනය වේ, එය නිවැරදි පෙරනිමියයි — නමුත් එයින් අදහස්
වන්නේ හිඩැසක් ශබ්ද නඟනවා වෙනුවට නිහඬ විය හැකි බවයි. `Image.MakeTransparent` එවැන්නකි: වර්ණ-යතුරු කළ
sprite sheet එකක් සෑම sprite එකක් පිටුපසම සුදු කොටුවක් සමඟ ඇඳුණු අතර කිසිවක් exception විසි නොකළේය.
repository එක දැන් `NoOpStubBaselineTests` මගින් එයට එරෙහිව ආරක්ෂා වේ, එය හිස් ශරීර සහිත දන්නා public `void`
methods කට්ටලය `NoOpStubBaseline.txt` තුළ ස්ථිර කරයි (ලියන අවස්ථාවේ 161), එවිට අලුත් stub එකක් පිළිගැනීම
සවිඥානික, වාර්තාගත ක්‍රියාවක් වේ. සංක්‍රමණය කළ යෙදුම පරීක්ෂා කරන්න, එය build කිරීම පමණක් නොකරන්න.

ගැළපුමේ කොටස් දෙක සම්බන්ධයෙන් ව්‍යාපෘතිය සිටින තැන:

- **API surface:** upstream WinForms සහ GDI+ වලට එරෙහි ස්වයංක්‍රීය gap plans **ශුන්‍යයේ** ඇත —
  upstream හි ඇති සෑම public සාමාජිකයෙකුම ප්‍රකාශ කර ඇත.
- **හැසිරීම:** ක්ෂේත්‍ර දොළහක විගණනයක් (2026 අගෝස්තු) සාමාජිකයෙකු පැවතියද WinForms කරන දේ නොකළ
  **ස්ථාන 483ක්** සොයා ගත්තේය. එම අදියරවලින් බොහොමයක් එතැන් සිට සම්පූර්ණ කර ඇත — keyboard pre-processing
  (`ProcessCmdKey`), focus සහ validation, සැබෑ සංවාද කවුළු, පෝරම ජීවන චක්‍රය සහ event අනුපිළිවෙල, සජීවී data
  binding, `ListView` details view, `DataGridView` events, text-box undo, `ToolStrip` හැසිරීම,
  `NotifyIcon`, `Application.AddMessageFilter`. ධාවන ගණනය
  [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md) වේ.

පරීක්ෂා කිරීමට පෙර `MIGRATION.md` තුළ හිතාමතා කියවීමට වටින වෙනස්කම් වර්ග දෙකක් ඇත, මන්ද ඒවා කෙසේ වුවද
පිරිසිදුව compile වේ:

- **WinForms සමඟ ගැළපීමට කළ බිඳ දමන වෙනස්කම් (breaking changes).** `SplitContainer.Orientation` දැන්
  WinForms හි මෙන් splitter bar එකේ දිශාව අදහස් කරයි, එබැවින් ඔබ එය සකසා ඇත්නම්, එය ප්‍රතිලෝම කරන්න.
  `TreeViewDrawMode.OwnerDrawContent` යනු `OwnerDrawText` සඳහා `[Obsolete]` alias එකක් වන අතර, `OwnerDrawAll`
  දැන් පවතී. Event delegate types WinForms සමඟ ගැළපේ (`KeyEventHandler`, `MouseEventHandler`,
  `FormClosingEventHandler`), එබැවින් designer මගින් ජනනය කළ `new KeyEventHandler(...)` පේළි compile වේ —
  නමුත් `Click` සහ `MouseEnter` තවදුරටත් mouse coordinates රැගෙන නොයයි, මන්ද WinForms තුළ ඒවා කිසි විටෙකත්
  එසේ නොකළේය. gradient සහ hatch brushes, GDI+ ඒවා තබා ගන්නා `Majorsilence.Forms.Drawing.Drawing2D` වෙත ගෙන
  ගොස් ඇත.
- **අභිරුචි ලෙස ඇඳින පාලක තාර්කික ඒකකවලින් අඳියි** (2026-10-01 සිට). `ClientRectangle`, `ClientSize` සහ
  ඔබේ `OnPaint`/`Paint` හසුරුවනයට ලැබෙන canvas එක දැන් `Bounds` මෙන් තාර්කික වන අතර, framework එක
  දර්ශකයට අනුව පරිමාණනය කරයි. අභිරුචි පාලකයක් `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` තමන්ම
  කැඳවූයේ නම්, එම ඇමතුම ඉවත් කරන්න, නැතහොත් සියල්ල දෙගුණ පරිමාණයෙන් ඇඳේ. Owner-draw events (`DrawItem`,
  `DrawNode`, `CellPainting`) තවමත් ඔබට උපාංග පික්සල ලබා දෙයි. පරීක්ෂණ ධාවනයක `MF_HEADLESS_SCALE=2`
  වෙනස පෙන්වයි.

## සංක්‍රමණය කර ඇති සැබෑ යෙදුම්
{:#real-apps-that-have-been-migrated}

මෙය න්‍යායික නොවේ. Majorsilence හි තමන්ගේම
[MPlayercontrol](https://github.com/majorsilence/MPlayercontrol) සහ
[Reporting](https://github.com/majorsilence/Reporting/tree/feature/modernization-roadmap) සංක්‍රමණය වෙමින්
පවතින අතර, ගැළපුම් ස්තරය සහ migrator මෙවලම පරීක්ෂා කිරීම සඳහාම විවෘත මූලාශ්‍ර WinForms ව්‍යාපෘති කට්ටලයක්
fork කර ඇත — Notepad++ clone එකක්, DarkUI, PKHeX, metroframework, RibbonWinForms, Super Mario Bros remake
එකක්, advanceddatagridview සහ තවත් බොහෝ දේ. ඉහත stub baseline වගුවේ හිඩැස් කිහිපයක් මේ ආකාරයෙන් සොයා
ගන්නා ලදී. සම්පූර්ණ ලැයිස්තුව repository readme හි
[Migrated Project Examples]({{ site.github_url }}#migrated-project-examples) කොටසේ ඇත.

## යථාර්ථවාදී සැලැස්මක්
{:#a-realistic-plan}

1. branch එකක migrator මෙවලම ධාවනය කරන්න, පළමුව dry-run. වාර්තාව කියවන්න.
2. එය compile වන තත්ත්වයට ගෙන එන්න. manual-review අනතුරු ඇඟවීම් හරහා වැඩ කරන්න; ඒවා ඉවත් වූ පසු CI වෙත
   `--strict` එක් කරන්න.
3. ඔබේ යෙදුම දැඩි ලෙස රඳා පවතින ඕනෑම දෙයක් සඳහා ගැළපුම් න්‍යාසය පරීක්ෂා කරන්න — `DataGridView`, අභිරුචි
   ඇඳීම, තෙවන පාර්ශ්ව පාලක කට්ටල.
4. [ස්වයංක්‍රීයකරණ ගසයට]({{ '/si/automation/' | relative_url }}) එරෙහිව UI පරීක්ෂණ සකසන්න, එවිට
   පසුබෑම් (regressions) පෙනේ; එය ඕනෑම OS එකක CI තුළ headless ලෙස ධාවනය වේ.
5. පළමුව Windows වෙත නිකුත් කරන්න — එම වේදිකාව, අලුත් framework, වරකට එක් විචල්‍යයක්. යෙදුම විශාල නම්,
   WinForms හෝ WPF backend මත වරකට එක් පාලකයක් බැගින් එය කරන්න. ඉන්පසු backend එක මාරු කර macOS සහ Linux
   එක් කරන්න.
6. ඔබේ පැකේජ අනුවාදය ස්ථිර කරන්න. ව්‍යාපෘතිය බීටා අවධියේ ඇති අතර API එක තවමත් ස්ථායී වෙමින් පවතී.

[පුහුණු මාර්ගෝපදේශයේ Module 5]({{ '/si/training/' | relative_url }}#module-5) මගින් C# සහ VB.NET යන
දෙකෙහිම නිදසුන් සමඟ කණ්ඩායමක් මේ හරහා විස්තරාත්මකව රැගෙන යයි.

## ඊළඟට
{:#next}

- [පුහුණු මාර්ගෝපදේශය]({{ '/si/training/' | relative_url }}) — සංක්‍රමණය වන කණ්ඩායමක් සඳහා සම්පූර්ණ
  පාඨමාලාව.
- [බහු-වේදිකා WinForms]({{ '/si/cross-platform-winforms/' | relative_url }}) — ගැළපුම් ස්තරයට කළ හැකි සහ
  කළ නොහැකි දේ.
- [Backends]({{ '/si/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms, WPF සහ
  Headless එක පෙළට.
- [WinForms විකල්ප සංසන්දනය]({{ '/si/winforms-alternatives/' | relative_url }}) — ඔබ තවමත් මෙය සහ නැවත
  ලිවීමක් අතර තෝරමින් සිටී නම්.
- [FAQ]({{ '/si/faq/' | relative_url }}) — මුලින්ම මතු වන ප්‍රශ්න.
