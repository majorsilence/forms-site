---
layout: docs
lang: si
title: WinForms විකල්ප සංසන්දනය
subtitle: Majorsilence.Forms සහ .NET MAUI, Avalonia, Uno Platform, Eto.Forms, WPF සහ Wine — එක් එක් විකල්පය පවතින WinForms කේත පදනමකින් සැබවින්ම ඉල්ලා සිටින්නේ කුමක්ද.
permalink: /si/winforms-alternatives/
seo_title: "WinForms විකල්ප සංසන්දනය — MAUI, Avalonia, Uno සහ තවත්"
description: >-
  WinForms කේත පදනමක් සඳහා අවංක සංසන්දනයක්: .NET MAUI, Avalonia, Uno Platform, Eto.Forms, WPF
  සහ Wine — සහ ඉන් කුමන ඒවා සම්පූර්ණ UI නැවත ලිවීමකට බල කරන්නේද.
keywords:
  - winforms alternative
  - WinForms විකල්ප
  - winforms replacement
  - maui vs avalonia vs uno
  - winforms vs avalonia
  - migrate winforms to maui
  - WinForms සංක්‍රමණය
  - cross platform .net ui framework
  - best winforms alternative
priority: "0.9"
---

ඔබට ක්‍රියාත්මක WinForms යෙදුමක් ඇති අතර එය macOS හෝ Linux මත අවශ්‍ය නම්, සැබෑ ප්‍රශ්නය "හොඳම UI framework එක කුමක්ද" යන්න නොවේ — එය **"මගේ පවතින කේතයෙන් කොපමණ ප්‍රමාණයක් ඉතිරි වේද?"** යන්නයි. පහත සෑම විකල්පයක්ම හොඳ framework එකකි. ඒවා ඔබේ කේත පදනමෙන් ඉල්ලා සිටින්නේ ඉතා වෙනස් ප්‍රමාණයන් පමණි.

## කෙටි සාරාංශය
{:#the-short-version}

| විකල්පය | UI ආකෘතිය | Linux | macOS | Mobile / වෙබ් | ඔබේ පවතින WinForms කේතයට කුමක් සිදු වේද |
|---|---|---|---|---|---|
| **Majorsilence.Forms** | WinForms (`Form`, පාලකයන්, events, Designer ගොනු) | ඔව් (Avalonia හෝ GTK 4) | ඔව් | Browser (නවකයි), Android සහ iOS (මුල් අවධිය); terminal එකක් ද | **තබා ගනී.** Namespace වෙනසක් + ගැළපුම් ස්තරයක්; migrator එක යාන්ත්‍රික කොටස ස්වයංක්‍රීය කරයි. Windows මත, .NET Framework 4.8 ඇතුළුව, පවතින WinForms හෝ WPF යෙදුම තුළ වරකට එක් පාලකයක් ලෙස ද එය අනුගත කළ හැක |
| **Avalonia** | XAML + MVVM | ඔව් | ඔව් | ඔව් | XAML views සහ view models ලෙස නැවත ලියනු ලැබේ |
| **Uno Platform** | WinUI XAML + MVVM | ඔව් | ඔව් | ඔව් | WinUI XAML ලෙස නැවත ලියනු ලැබේ |
| **.NET MAUI** | XAML + MVVM | නිල සහායක් නැත | ඔව් (Mac Catalyst) | ඔව් | නැවත ලියනු ලැබේ, සහ mobile-first පාලක කට්ටලයකට ගැළපෙන සේ විෂය පථය නැවත සකසනු ලැබේ |
| **Eto.Forms** | එහිම forms-ශෛලීය .NET API එකක්, එක් එක් OS හි ස්වදේශීය widgets | ඔව් | ඔව් | නැත | Eto හි API එකට එරෙහිව නැවත ලියනු ලැබේ — හැඩයෙන් හුරුපුරුදුයි, නමුත් WinForms සමඟ මූලාශ්‍ර-ගැළපෙන්නේ නැත |
| **WPF** | XAML + MVVM | නැත | නැත | නැත | නැවත ලියනු ලැබේ, සහ තවමත් Windows-පමණක් |
| **Wine** | කිසිවක් නැත — Windows binary එක ධාවනය කරයි | ඔව් | ඔව් | නැත | ස්පර්ශ නොකෙරේ, නමුත් ඔබ බෙදා හරින්නේ ස්වදේශීය යෙදුමක් නොව අනුකරණය කළ (emulated) Windows යෙදුමකි |

## Majorsilence.Forms ගොඩනගා ඇත්තේ මේවායින් කිහිපයක් *මත*ය
{:#majorsilenceforms-is-built-on-several-of-these}

මෙය පැහැදිලිව කිව යුතුය, මන්ද එය සුලබ වැරදි අවබෝධයකි: Majorsilence.Forms, Avalonia, Uno Platform හෝ GTK සමඟ තරග කරන්නේ නැත. එය ඒවා **භාවිත කරයි.** සෑම පාලකයක්ම Majorsilence.Forms විසින්ම SkiaSharp සමඟ අඳින අතර, යටින් ඇති ධාරකය (host) — පෙරනිමියෙන් Avalonia, නැතහොත් Uno, නැතහොත් gir.core හරහා සැබෑ GTK 4 කවුළුවක් — කවුළුව නිර්මාණය කර, message loop එක ධාවනය කර, Skia පෘෂ්ඨය ඉදිරිපත් කරයි. Windows මත, එම පාලකයන්ම සැබෑ `System.Windows.Forms` හෝ WPF කවුළු මඟින් ද ධාරකය කළ හැකි අතර, පියවරෙන් පියවර, එම ස්ථානයේම (in-place) සංක්‍රමණයක් කළ හැකි වන්නේ එබැවිනි. [වේදිකා backends]({{ '/si/backends/' | relative_url }}) බලන්න.

එබැවින් තේරීම "Majorsilence.Forms ද Avalonia ද" නොවේ. එය මෙයයි: *ඔබ Avalonia හි XAML සෘජුවම ලියනවාද, නැතහොත් WinForms දිගටම ලියමින් Avalonia (හෝ GTK 4, හෝ Uno) යටිතල නළ පද්ධතිය (plumbing) ලෙස ක්‍රියා කිරීමට ඉඩ දෙනවාද?*

## විකල්පයෙන් විකල්පයට
{:#option-by-option}

### .NET MAUI
{:#net-maui}

Xamarin.Forms හි Microsoft හි නිල බහු-වේදිකා අනුප්‍රාප්තිකයා වන අතර, බොහෝ සෙවුම් ප්‍රතිඵල ඔබට ලබා දෙන පිළිතුර එයයි. **නව** mobile-සහ-desktop යෙදුමක් සඳහා එය ශක්තිමත් තේරීමකි.

පවතින WinForms ව්‍යාපාරික (LOB) යෙදුමක් සඳහා එය සාමාන්‍යයෙන් දුෂ්කරම මාර්ගයයි: නිල Linux සහායක් නැත, පාලක කට්ටලය mobile-first ය (`DataGridView` සමාන එකක් නැත, වෙනස් කවුළු සහ සංවාද කවුළු ආකෘතියක්), තවද සෑම තිරයක්ම XAML වලින් නැවත ගොඩනගනු ලබන්නේ ඔබේ WinForms කේතයේ නිසැකවම පාහේ නොමැති view-model ස්තරයක් සමඟිනි. `*.Designer.cs` ගොනු අර්ථවත් ලෙස නැවත භාවිත කිරීමක් නැත.

### Avalonia
{:#avalonia}

පරිණත, සැබවින්ම බහු-වේදිකා XAML framework එකකි — desktop, mobile සහ WebAssembly — විශිෂ්ට Linux සහායක් සහ Skia renderer එකක් සමඟ. ඔබට නවීන XAML stack එකක් අවශ්‍ය නම් සහ UI ස්තරය නැවත ලිවීමට සූදානම් නම්, මෙය ශක්තිමත්ම සාමාන්‍ය පිළිතුරයි, තවද එය Majorsilence.Forms ධාවනය වන පෙරනිමි ධාරකයයි.

Avalonia හි වාණිජ **XPF** නිෂ්පාදනය *WPF* සඳහා වූ ගැළපුම් ස්තරයක් මිස WinForms සඳහා නොවන බව සලකන්න; එය `System.Windows.Forms` කේත පදනමකට උදව් නොකරයි.

### Uno Platform
{:#uno-platform}

WinUI/UWP XAML API එක desktop, mobile සහ WebAssembly හරහා ක්‍රියාත්මක කරයි, ඉතා පුළුල් ළඟාවක් සහ ශක්තිමත් මෙවලම් සමඟ. Avalonia හා සමාන තීරණයක හැඩයකි: විශිෂ්ට ඉලක්කයක්, WinForms සිට සම්පූර්ණ UI නැවත ලිවීමක්. ඔබේ ආයතනය දැනටමත් එයට ආයෝජනය කර ඇත්නම්, එය Majorsilence.Forms backend එකක් ලෙස ද ලබා ගත හැක.

### Eto.Forms
{:#etoforms}

මෙම ව්‍යාපෘතියෙන් පිටත, ආත්මයෙන් එයට සමීපතම දෙයයි: XAML වෙනුවට forms-සහ-පාලක API එකක් සහිත බහු-වේදිකා .NET UI library එකක්, එක් එක් වේදිකාවේ *ස්වදේශීය* widgets වලට බැඳේ (Windows මත WinForms, macOS මත Cocoa, Linux මත GTK). එක් එක් OS අනුව ස්වදේශීය පෙනුම සැබෑ වාසියකි.

නමුත් එහි API එක එහිම වේ — `Eto.Forms.Form` යනු `System.Windows.Forms.Form` නොවේ, පිරිසැලසුම ඛණ්ඩාංක/anchor-පදනම් නොව container-පදනම් ය, තවද පවතින designer ගොනු සඳහා මාර්ගයක් නැත. ඔබ හුරුපුරුදු ශෛලියකින් නැවත ලියයි. Majorsilence.Forms හට දැන් එහිම GTK 4 backend එකක් ඇති විටදී පවා එම සංසන්දනය වලංගු වේ: Eto එහි පාලකයන් GTK widgets වලට සිතියම්ගත කරන අතර, Majorsilence.Forms GTK කවුළුව සහ input loop එක ධාරකයක් ලෙස පමණක් භාවිත කර, එහිම WinForms-හැඩැති පාලකයන් දිගටම අඳියි.

### Mono හි `System.Windows.Forms`
{:#monos-systemwindowsforms}

Mono විසින් WinForms නැවත ක්‍රියාත්මක කිරීමක් බෙදා හැරියේය, පැරණි forum threads වල "WinForms Linux මත ක්‍රියා කරයි" යන්න දකින්නට ලැබෙන්නේ එබැවිනි. එය .NET Framework යුගය ඉලක්ක කළ අතර, කිසි දිනෙක නවීන .NET වෙත ගෙන නොගිය අතර, අද නව port එකක් සඳහා ශක්‍ය ඉලක්කයක් නොවේ.

### Wine
{:#wine}

Wine ඔබේ වෙනස් නොකළ Windows binary එක Linux සහ macOS මත ධාවනය කරයි. ඔබේ කේතයේ කිසිවක් වෙනස් නොවේ, එය සැබවින්ම ආකර්ෂණීයයි — ඔබට එයට සහාය දීමට සිදු වන තුරු: ඔබ Windows යෙදුමක් සහ ගැළපුම් runtime එකක් බෙදා හරියි, Wine හි Win32/GDI+ ආවරණය කුමක් වුවත් එය ඔබට උරුම වේ, ධාරක OS සමඟ ඒකාබද්ධතාවය ආසන්න පමණි, තවද installers සහ updates සංකීර්ණ වේ. එය වේදිකා උපාය මාර්ගයක් නොව, deployment විසඳුම් මාර්ගයකි (workaround).

### WPF මත රැඳී සිටීම
{:#staying-on-wpf}

WPF හොඳ framework එකක් වන අතර WinForms සිට සංකල්පීය වශයෙන් සුළු පියවරකි, නමුත් එය Windows-පමණක් ය. එය "UI නවීකරණය කරන්න" යන්න විසඳයි; එය "macOS සහ Linux මත ධාවනය කරන්න" යන්න විසඳන්නේ නැත. (ඔබට දැනටමත් WPF shell එකක් ඇති අතර එය තුළ බහු-වේදිකා තිර අවශ්‍ය නම්, හරියටම ඒ සඳහා Majorsilence.Forms හට WPF ධාරක backend එකක් ඇත — නමුත් WPF shell එක Windows මතම පවතී.)

## Majorsilence.Forms නිවැරදි පිළිතුර වන්නේ කවදාද
{:#when-majorsilenceforms-is-the-right-answer}

- ඔබට සැලකිය යුතු WinForms කේත පදනමක් ඇත — විශේෂයෙන් පෝරම බොහොමයක් සහිත ව්‍යාපාරික (LOB) යෙදුමක් — එහි ව්‍යාපාරික තර්කනය සහ UX වත්කම වන අතර නැවත ලිවීමේ අවදානම ගැටලුව වේ.
- ඔබේ කණ්ඩායමේ කුසලතා WinForms වන අතර, XAML/MVVM නැවත පුහුණු චක්‍රයක් සැබෑ වියදමකි.
- ඔබට එක් කේත පදනමකින් Windows, macOS සහ Linux අවශ්‍ය වන අතර, browser සහ mobile පසු විකල්පයක් ලෙස.
- port කිරීම සඳහා සියල්ල නවත්වන්නට ඔබට නොහැක. `Majorsilence.Forms.WinForms` සහ `.Wpf` backends ඔබේ *පවතින* Windows යෙදුම තුළ බහු-වේදිකා පාලකයන් ධාරකය කරයි, වරකට එක් පාලකයක් හෝ පෝරමයක් — සහ ඒවා `net48` ඉලක්ක කරයි, එබැවින් ඔබ නවීන .NET වෙත යාමටත් පෙර .NET Framework 4.8 යෙදුමකින් මෙය ක්‍රියා කරයි. එම CSS තේමාවටම port කළ පාලකයන් සමඟ සැබෑ WinForms පාලකයන් ද නැවත මෝස්තර කළ හැක (`Majorsilence.Forms.Theming.WinForms`), එබැවින් මිශ්‍ර යෙදුම එක් යෙදුමක් ලෙස පෙනේ.
- ඔබට බීටා ගැළපුම් ස්තරයක් පිළිගෙන අනුවාදය ස්ථිර කළ හැක.

## එය එසේ නොවන්නේ කවදාද
{:#when-it-isnt}

- **මුල සිටම නව ව්‍යාපෘතියක්, WinForms කේතයක් නැත, WinForms කණ්ඩායමක් නැත.** Avalonia හෝ Uno සෘජුවම ලියන්න; මැද ගැළපුම් ස්තරයක් නොමැතිව ඔබට පරිණත XAML stack එකක් ලැබේ.
- **Mobile-first.** MAUI, Avalonia හෝ Uno අද දුරකථන නිසි ලෙස ඉලක්ක කරයි. Majorsilence.Forms හි Android සහාය සැබෑ උපාංගයක් මත මූලික පරීක්ෂණයක් පමණක් ලබා ඇති අතර iOS හට CI simulator smoke check එකක් පමණි — දෙකම මුල් අවධියේය — තවද framework එක දැන් ලබා දෙන දුරකථන-ශෛලීය `StackPanel`/`Card`/`NavigationHost` පාලකයන් සමඟ වුවද, ඛණ්ඩාංක-ස්ථානගත desktop පෝරමයක් කෙසේ හෝ දුර්වල දුරකථන UI එකකි.
- **ඔබේ යෙදුම Win32 තුළ ගැඹුරින් ඇත.** අධික `WndProc`, `Control.Handle` P/Invoke හෝ custom Win32 පාලකයන් සැබෑ වැඩකින් තොරව මෙම කිසිදු port එකක් — මෙය ද ඇතුළුව — නොනැසී පවතින්නේ නැත.
- **ඔබට Windows මත ස්වදේශීය WinForms සමඟ පික්සලයට-සමාන සමානත්වයක් අවශ්‍යයි.** පාලකයන් එක් එක් OS හි ස්වදේශීය widgets වලට ගැළපෙනවා වෙනුවට, වේදිකා හරහා ස්ථාවරව, Skia මඟින් අඳිනු ලබන අතර CSS මඟින් තේමා කරනු ලැබේ. (port කළ යෙදුමක් එහි අකුර සැකසූ පසු push buttons සහ check/radio glyphs වලට Windows 11-ශෛලීය පෙනුම ලැබේ, නමුත් එය මිශ්‍ර යෙදුම් සඳහා වූ සහනයක් මිස සමානත්ව සහතිකයක් නොවේ.)

## ඊළඟට
{:#next}

- [බහු-වේදිකා WinForms]({{ '/si/cross-platform-winforms/' | relative_url }}) — ගැළපුම් ස්තරය ක්‍රියා කරන ආකාරය සහ එහි වියදම.
- [පවතින WinForms යෙදුමක් සංක්‍රමණය කරන්න]({{ '/si/migration/' | relative_url }}) — ස්වයංක්‍රීය නැවත ලිවීම.
- [ගැළපුම් matrix එක]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — ඔබ කැප වීමට පෙර, පාලකයෙන් පාලකයට ආවරණය.
