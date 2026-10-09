---
layout: docs
lang: si
title: පුහුණු මාර්ගෝපදේශය
subtitle: Majorsilence.Forms මත යෙදුම් ගොඩනඟා නිකුත් කරන යෙදුම් කණ්ඩායම් සඳහා ව්‍යුහගත පාඨමාලාවක් — සෑම නිදසුනක්ම C# සහ VB.NET යන දෙකෙන්ම. 26.9.0 සඳහා 2026 ඔක්තෝබර් මාසයේ සංශෝධනය කරන ලදී.
seo_title: "බහු-වේදිකා WinForms පුහුණු මාර්ගෝපදේශය (C# සහ VB.NET)"
description: >-
  WinForms යෙදුමක් බහු-වේදිකා තාක්ෂණ තොගයක් මත ගොඩනඟන හෝ ඒ වෙත සංක්‍රමණය කරන කණ්ඩායම් සඳහා
  ව්‍යුහගත පාඨමාලාවක් — මානසික ආකෘතිය, සංක්‍රමණය, backend හතක්, async සංවාද කවුළු, තේමා,
  පරීක්ෂණ, CI. C# සහ VB.NET.
keywords:
  - winforms පුහුණුව
  - winforms බහු-වේදිකා
  - cross platform winforms tutorial
  - winforms සංක්‍රමණය
  - winforms migration guide
  - vb.net cross platform ui
  - winforms linux mac
  - winforms team training
priority: "0.8"
permalink: /si/training/
---

මෙය Majorsilence.Forms මත **යෙදුමක්** ගොඩනඟන්නට — හෝ සංක්‍රමණය කරන්නට — සූදානම් වන සංවර්ධන
කණ්ඩායමකට භාර දිය යුතු මාර්ගෝපදේශයයි. එය WinForms අත්දැකීම පමණක් උපකල්පනය කරයි; වෙන කිසිවක් නොවේ.

එහි විෂය පථය හිතාමතාම රාමුව (framework) *භාවිත කිරීමට* සීමා කර ඇත: පැකේජ යොමු කිරීම, පෝරම
ලිවීම, පැරණි කේත පදනමක් මාරු කිරීම, ඔබගේ ඉලක්ක තෝරා ගැනීම, ඔබ ගොඩනැඟූ දේ පරීක්ෂා කිරීම සහ එය
නිකුත් කිරීම. මෙය දායකයන් සඳහා වූ මාර්ගෝපදේශයක් **නොවේ** — මෙහි කිසිදු කොටසක් අනුගමනය කිරීමට රාමුව
clone කිරීමට හෝ build කිරීමට ඔබට කිසිදා අවශ්‍ය නොවේ. (අවසානයේ රාමුවේ යමක් නිවැරදි කිරීමට ඔබට
අවශ්‍ය වුවහොත්, [module 10](#module-10-gaps) වැදගත් වන එකම ඡේදය වෙත ඔබව යොමු කරයි.)

**සෑම කේත නිදසුනක්ම C# සහ VB.NET යන දෙකෙන්ම දක්වා ඇත.** මුල් සංස්කරණයේ C# නිදසුන් ප්‍රකාශනයට
පෙර macOS මත compile කර ධාවනය කරන ලදී — පුරා ඇති තිර රූප (screenshots) එම ධාවනයන්ය, ව්‍යාජ
නිර්මාණ නොවේ, සහ ඔබ පහතින් කියවන අවංක අවවාද දෙකක් සොයා ගත්තේ ඒවා ධාවනය කිරීමෙනි. 2026 ඔක්තෝබර්
සංශෝධනයේදී එක් කළ නිදසුන් (තේමා, MVVM, async සංවාද කවුළු, නවතම backend, animation frames,
අභිරුචි ස්වයංක්‍රීයකරණ තත්ත්වය) මෙම මාර්ගෝපදේශය සඳහා ධාවනය කරනු වෙනුවට repository එකේම
ලේඛන සහ නිදසුන් සමඟ සසඳා පරීක්ෂා කරන ලද අතර, එය වැදගත් වන තැන්වල එසේ සලකුණු කර ඇත. මෙහි VB
පළමු පෙළේ සංක්‍රමණ ඉලක්කයකි: migrator එක `.vbproj`/`.vb` ගොනු හසුරුවයි, සම්භාව්‍ය VB compiler
විසින් කලින් සපයන ලද constructor එක නැවත ඇතුළු කරයි, සහ `My.Resources` accessor එකක් ජනනය කරයි.
VB-විශේෂිත අවවාද තුනක් ඒවා අදාළ වන තැන්වල පෙන්වා දී ඇත — [`--dual-build` C# සඳහා
පමණි](#module-5-dualbuild), [`My.*` ක්‍රියාත්මක කර ඇත්තේ
අර්ධ වශයෙනි](#module-5-checklist), සහ [පරීක්ෂණ සැකසුම සඳහා VB හි module initializer එකක්
නැත](#module-8-headless).

එය භාවිත කිරීමට ක්‍රම දෙකක්:

| ආකෘතිය | කෙසේද | Modules |
|---|---|---|
| **දෙදින වැඩමුළුව** | 1 වන දිනය: modules 0–4 (ආකෘතිය, පළමු යෙදුම, ක්‍රියා කරන්නේ කුමක්දැයි දැන ගැනීම, ඇඳීම). 2 වන දිනය: modules 5–10 (සංක්‍රමණය, ඉලක්ක, interop, පරීක්ෂණ, ස්වදේශීය අන්තර්ගතය, නිකුත් කිරීම). | සියල්ල |
| **ස්වයං-වේගයෙන්** | Modules 0–3 අනිවාර්ය හරයයි — ඒවා නොමැතිව කිසිවෙකු සංක්‍රමණයක් ආරම්භ නොකළ යුතුය. ඉන්පසු ඔබ සංක්‍රමණය කරන්නේ නම් 5 ද, අලුත් දෙයක් ගොඩනඟන්නේ නම් 6 + 8 ද ගන්න. උපග්‍රන්ථ D සහ E (තේමා, MVVM සහායක) පෙනුම සහ view-model සම්බන්ධ කිරීම භාරව සිටින අය සඳහා විකල්ප කියවීමකි. | තෝරන්න |

පහත සෑම තීරණයක්ම හැඩගස්වන නිසා, මුලින්ම පිළිගත යුතු කරුණු දෙකක් තිබේ. Majorsilence.Forms
**බීටා** අදියරේ පවතී: API එක ස්ථාවර වෙමින් පවතින අතර WinForms හි සෑම කොනක්ම ආවරණය වී නැත — එබැවින්
ඔබගේ පැකේජ අනුවාදය ස්ථිර කරන්න. තවද එය **compile වී ආසන්න වශයෙන් ක්‍රියා කරන (compile-and-approximate)
එකක් මිස, පික්සලයෙන් පික්සලයට නිවැරදි එකක් නොවේ**: සංක්‍රමණය කළ කේතය නිර්මාණය කර ඇත්තේ compile වී
*ධාවනය වීමට* වන අතර, සමහර සාමාජිකයන් (members) තවමත් හිතාමතාම කිසිවක් නොකරයි. Module 3 සම්පූර්ණයෙන්ම
කුමක් කුමක්දැයි හඳුනා ගන්නා ආකාරය ගැනය, සහ සෙමින් කියවීමෙන් වැඩිම ප්‍රතිලාභ ලැබෙන module එක එයයි.

---

## පටුන
{:#contents}

- [Module 0 — පළමුව යමක් ධාවනය කරන්න](#module-0)
- [Module 1 — මානසික ආකෘතිය: ස්වයං-ඇඳි පාලක සහ මාරු කළ හැකි ධාරකය](#module-1)
- [Module 2 — ඔබගේ පළමු යෙදුම](#module-2)
- [Module 3 — ඒ මත ගොඩනඟන්නට පෙර ක්‍රියා කරන්නේ කුමක්දැයි දැන ගැනීම](#module-3)
- [Module 4 — ඇඳීම සහ අභිරුචි ඇඳීම](#module-4)
- [Module 5 — ඔබගේ WinForms යෙදුම සංක්‍රමණය කිරීම](#module-5)
- [Module 6 — ඔබගේ ඉලක්ක තෝරා ගැනීම](#module-6)
- [Module 7 — Windows මත පියවරෙන් පියවර අනුගත වීම](#module-7)
- [Module 8 — ඔබගේ යෙදුම පරීක්ෂා කිරීම](#module-8)
- [Module 9 — ස්වදේශීය අන්තර්ගතය සහ වීඩියෝ](#module-9)
- [Module 10 — නිකුත් කිරීම: CI, අනුවාද කළමනාකරණය සහ යාවත්කාලීනව සිටීම](#module-10)
- [උපග්‍රන්ථය A — රෝග ලක්ෂණ අනුව දෝෂ නිරාකරණය](#appendix-a)
- [උපග්‍රන්ථය B — සැබෑ කේත පදනමක් සඳහා යෙදවීමේ සැලැස්ම](#appendix-b)
- [උපග්‍රන්ථය C — යොමු කාඩ්පත](#appendix-c)
- [උපග්‍රන්ථය D — CSS මගින් ඔබගේ යෙදුමට තේමා යෙදීම](#appendix-d)
- [උපග්‍රන්ථය E — MVVM සහායක](#appendix-e)

---

## Module 0 — පළමුව යමක් ධාවනය කරන්න
{:#module-0}

**ප්‍රතිඵලය:** සෑම සංවර්ධකයෙකුටම තමන්ගේම OS එක මත ධාවනය වන තමන්ගේම යෙදුමක් ඇති අතර, "මෙම
රාමුවට X කළ හැකිද" යන්න සොයා බැලිය යුත්තේ කොතැනදැයි දනී.

ඔබට අවශ්‍ය වන්නේ [.NET 10 SDK](https://dotnet.microsoft.com/download) පමණි. Windows නැත, Visual
Studio නැත, වේදිකා workload නැත, සහ රාමුවේ මූලාශ්‍ර කේතය නැත.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

එය ධාවනය වන බහු-වේදිකා යෙදුමකි. scaffold කළ දෙයෙහි හැඩය සලකා බලන්න, මන්ද රඳවා ගත යුතු හැඩය එයයි:
**ව්‍යාපෘති දෙකක් සහිත solution එකක්** — `MainForm` සහ එහි Designer ගොනුව දරන සාමාන්‍ය class library
එකක් වන `MajorsilenceFormsApp.Shared`, සහ Avalonia backend මත ඇති සිහින් desktop *head* එකක් වන
`MajorsilenceFormsApp`. ඔබගේ පෝරම ජීවත් වන්නේ shared library එකේය; head එකක් යනු ඇතුළු වීමේ ලක්ෂ්‍යයක්
(entry point) සහ backend එකක් පමණි. පසුව එකම UI එක දුරකථනයක හෝ බ්‍රවුසරයක ධාවනය කිරීමට ඉඩ දෙන්නේ එයයි —
පෝරම ස්පර්ශ කරනු වෙනුවට තවත් head එකක් එක් කිරීමෙන් ([module 6](#module-6)):

```
dotnet new majorsilenceforms -n MyApp --IncludeAndroid --IncludeWasm --IncludeiOS
```

සෑම switch එකක්ම එක් head ව්‍යාපෘතියක් එක් කරන අතර එයට අදාළ workload එක අවශ්‍ය වේ (`android`,
`wasm-tools`, `ios` — අවසාන එක Mac මත පමණි); තුනම පෙරනිමියෙන් අක්‍රියයි, එබැවින් සාමාන්‍ය විධානය අමතර
workload කිසිවක් ස්ථාපනය නොකර build වේ. `--msformsVersion` සහ `--avaloniaVersion` මගින් scaffold එක
යොමු කරන පැකේජ අනුවාද ස්ථිර කරයි.

දැන් යොමු ද්‍රව්‍ය.

**ඔබගේ API ලේඛනය පාලක ගැලරියයි.** තවමත් වෙනම API යොමුවක් නැත, එබැවින් "`TreeView` X සඳහා සහාය
දක්වනවාද" යන්නට වේගවත්ම පිළිතුර ගැලරියයි — සෑම ගොඩනඟා ඇති පාලකයක් (control) සඳහාම එක් demo පැනලයක්.
ඉක්මන්ම බැල්මට කිසිදු වියදමක් නැත: [සජීවී බ්‍රවුසර ගැලරිය]({{ '/gallery/' | relative_url }}) යනු
WebAssembly වෙත compile කළ සැබෑ රාමුවයි, ස්ථාපනයක් අවශ්‍ය නැත.

![Button පැනලය තෝරාගෙන macOS මත ධාවනය වන ControlGallery නිදසුන]({{ '/assets/img/gallery-macos.png' | relative_url }})

*macOS 26 මත `ControlGallery`, Avalonia backend, `Button` පැනලය තෝරාගෙන. රාමුවට අයත් දේ සහ අයත්
නොවන දේ සලකන්න: traffic-light ශීර්ෂය OS එකට අයත්ය, සහ එයට පහළින් ඇති සෑම පික්සලයක්ම — nav ගසය,
එහි scrollbar එක, බොත්තම් ප්‍රභේද — Skia හරහා Majorsilence.Forms විසින් අඳිනු ලැබේ.*

පාලකයක් හුදෙක් බැලීම වෙනුවට එය පිටුපස ඇති කේතය කියවීමට ඔබට අවශ්‍ය වූ විට, එහි
[`samples/`]({{ site.github_url }}/tree/main/samples) ෆෝල්ඩරය සඳහා repository එක clone කර ඔබට
අධ්‍යයනය කිරීමට අවශ්‍ය දේ ධාවනය කරන්න:

```
git clone https://github.com/majorsilence/Majorsilence.Forms.git
dotnet run --project samples/Gallery.Avalonia   # ගැලරිය, desktop backend මත
dotnet run --project samples/Explorer           # Windows Explorer ක්ලෝනයක්
dotnet run --project samples/Outlaw             # Outlook ක්ලෝනයක්
```

> **නිදසුන් ධාවනය කරන්න `dotnet run --project …` මගින්, හෝ build ප්‍රතිදාන නාමාවලියේ සිට — repo
> root එකේ සිට නොවේ.** සෑම නිදසුනක්ම අයිකන පූරණය කරන්නේ *සාපේක්ෂ* මාර්ගයක් (path) හරහාය (`ImageLoader`
> `"Images"` භාවිත කරයි), එය විසඳෙන්නේ assembly ස්ථානයට එරෙහිව නොව **ක්‍රියාවලියේ වැඩ කරන නාමාවලියට
> (process working directory)** එරෙහිවය. build කළ executable එක වෙනත් ඕනෑම තැනක සිට දියත් කළහොත් සෑම
> අයිකන ගොනුවක්ම මග හැරේ — තවද `Bitmap(string)` exception එකක් විසි කරනු වෙනුවට 1×1 placeholder
> එකකට පිරිහෙයි, එබැවින් යෙදුම පිරිසිදුව ආරම්භ වේ, කිසිවක් log නොකරයි, සහ සෑම අයිකනයක්ම අදෘශ්‍යමාන
> ලෙස විදැහුම් කරයි.
>
> මෙය එක් වරක් හිතාමතාම කර බැලීම වටී, මන්ද **ඔබගේම යෙදුමටද මෙම හැසිරීම උරුම වේ**. ඔබගේ කේතයේ
> විසඳුම නම් assets, assembly ස්ථානයට එරෙහිව විසඳීමයි:
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
> එය [නිහඬ no-op අසාර්ථක වීමේ ආකාරයේ](#module-3-cost) කුඩා නිදසුනකි, සහ ක්‍රියා කරන බව ඔබ *දන්නා*
> නිදසුනක් මත එයට මුහුණ දීම, නිෂ්පාදනයේදී (production) පළමු වරට එයට මුහුණ දීමට වඩා බොහෝ ලාභදායීය.

**අභ්‍යාසය 0.** සැකිලි යෙදුම සාදා, එය ධාවනය කර, `MessageBox` එකක් පෙන්වන `Button` එකක් එක් කරන්න.
ඉන්පසු සජීවී ගැලරිය විවෘත කර ඔබගේම යෙදුම රඳා පවතින පාලක තුනක් සොයා ගන්න.

---

## Module 1 — මානසික ආකෘතිය: ස්වයං-ඇඳි පාලක සහ මාරු කළ හැකි ධාරකය
{:#module-1}

**ප්‍රතිඵලය:** කිසිදු වෙනසක් නොමැතිව ගෙන යන WinForms රටා මොනවාද, වෙනස් ලෙස හැසිරෙන්නේ මොනවාද, සහ
කිසිසේත් ක්‍රියා කළ නොහැක්කේ මොනවාද යන්න — සොයා බැලීමෙන් නොව මූලික මූලධර්ම වලින් — ඔබට අනාවැකි
කිව හැකිය.

එක් ගෘහ නිර්මාණ ශිල්පීය (architectural) කරුණක් ඇති අතර, අනෙක් සියල්ලම පාහේ එයින් පැන නගී:

> **Majorsilence.Forms තමන්ගේම ඇඳීම් සියල්ල SkiaSharp සමඟ සිදු කරයි. ඊට යටින් ඇති කවුළු මෙවලම් කට්ටලය
> (windowing toolkit) ධාරකයක් (host) පමණි.**

```
        Your app  (Forms, controls, Designer files — the WinForms model you know)
            │
       Majorsilence.Forms  (controls + WinForms-compatible API, drawn with SkiaSharp)
            │
   Swappable host backend
   ├─ Avalonia   → Windows · macOS · Linux  (default)  · also Android · iOS · Browser
   ├─ Uno        → desktop · iOS · Android · WebAssembly
   ├─ GTK 4      → Linux first (real Gtk.Window); Windows/macOS with the GTK runtime
   ├─ Terminal   → a console (Kitty graphics / Sixel / Unicode blocks) — single-view, like a phone
   ├─ WinForms   → Windows only; real System.Windows.Forms windows — a *migration* backend
   ├─ WPF        → Windows only; a real WPF Window — the same migration idea
   └─ Headless   → offscreen rendering for tests / CI
```

Backend හතක්, පෝරම එක් කට්ටලයක්. Windows-පමණක් ඇති ඒවා දෙක පවතින්නේ එක් අරමුණක් සඳහාය — WinForms
හෝ WPF යෙදුමකට වරකට එක් පාලකයක් බැගින් Majorsilence.Forms අනුගත කිරීමට ඉඩ දීම ([module 7](#module-7-c)) —
සහ Terminal එක ධාරකය සැබවින්ම හුවමාරු කළ හැකි බවට සාක්ෂියයි: එය GPU swapchain එකක් හරහාද `▄`
අක්ෂරයක් හරහාද ඉදිරිපත් කරන්නේ යන්න ඔබගේ පෝරමයේ කිසිවක් නොදනී.

සෑම පාලකයක්ම Skia canvas එකකට අඳියි. යටින් ඇති ධාරකය ස්වදේශීය (native) කවුළු සාදයි, message loop
එක ධාවනය කරයි, ආදානය (input) ලබා දෙයි, සහ විදැහුම් කළ මතුපිට ඉදිරිපත් කරයි — එය කරන්නේ එපමණයි.
හර පැකේජය කිසිදු කවුළු මෙවලම් කට්ටලයක් යොමු නොකරයි; ඔබ යොමු කරන backend එක එකක් සපයයි. යෙදුම්
සංවර්ධකයෙකු ලෙස ඔබට එම සන්ධියට (seam) හරියටම ප්‍රායෝගික ප්‍රතිවිපාක දෙකක් ඇත: **ඔබගේ ව්‍යාපෘති
ගොනුවේ එක් පේළියක් ඔබගේ ධාරකය තෝරයි** ([module 6](#module-6)), සහ **කිසිදු මෙවලම් කට්ටල වර්ගයක් (type)
කිසිදා ඔබගේ කේතයේ නොපෙන්වයි** — ඔබ ලියන්නේ `Form`, `Control`, `MouseButtons`, `Keys` සහ
`System.Drawing` අගය වර්ග වලට එරෙහිවය, WinForms හි මෙන්ම.

### එයින් පැන නගින්නේ කුමක්ද
{:#module-1-consequences}

මෙම වගුව මෙම module එකේ ප්‍රතිලාභයයි. එහි ඇති සෑම දෙයක්ම කටපාඩම් කරනු වෙනුවට තර්කයෙන් ළඟා විය හැකි
හැසිරීම් වෙනසකි.

| ඇඳීම රාමුවට අයත් වන අතර කවුළු ධාරකයට අයත් වන නිසා… | එබැවින්… |
|---|---|
| සෑම ඉහළ මට්ටමේ කවුළුවකටම එක් ස්වදේශීය OS කවුළුවක්; එය ඇතුළත ඇති සියල්ල අඳිනු ලැබේ | `Control.Handle` යනු `IntPtr.Zero` වේ. `Button` එකක් පිටුපස වාර්තා කිරීමට OS වස්තුවක් නැත. [module 9](#module-9) බලන්න. |
| `WindowBase.Handle` තවමත් WinForms හි "නිර්මාණය බලෙන් කිරීමට `.Handle` ස්පර්ශ කරන්න" රටාව තෘප්තිමත් කළ යුතුය | එය **පාරාන්ධ (opaque) ශුන්‍ය-නොවන token එකක් ලබා දෙයි — `HWND` එකක් නොවේ**. එය කිසිදා ස්වදේශීය කේතයට ලබා නොදෙන්න. `WindowBase.PlatformHandle` සැබෑ එකයි — Avalonia backend එකේ (`HWND`/`NSWindow`/`XID`) සහ WinForms backend එකේ (සැබෑ `HWND` එකක්) සැබෑය; වෙනත් තැන්වල ශුන්‍යය. |
| රාමුව තමන්ගේම canvas එක සංදර්ශකයට අනුව පරිමාණනය කරයි | **`Control` එකක ඔබ දකින සියල්ල තාර්කික ඒකක වලින් වේ** — `Width`/`Height`/`Bounds`, `MouseEventArgs`, සහ (2026-10-01 සිට) `ClientRectangle`, `ClientSize` සහ paint canvas එකද. සාමාන්‍ය WinForms පිරිසැලසුම් සහ paint කේතය කිසිදු වෙනසක් නොමැතිව ඕනෑම පරිමාණනයකදී නිවැරදි ප්‍රමාණයයි. උපාංග පික්සල තෝරා ගත යුත්තේ ඔබ විසින්මය (`ScaledBounds`, `PaintEventArgs.Scaling`, `LogicalToDeviceUnits`). එකම ව්‍යතිරේකය: owner-draw සිදුවීම් (`DrawItem`, `DrawNode`, `CellPainting`, …) තවමත් උපාංග-පික්සල `Graphics` එකක් සමඟ උපාංග-පික්සල සීමා ඔබට ලබා දෙයි. [module 4](#module-4-paint) බලන්න. |
| පෙනුම විසඳන්නේ Win32 විසින් නොව රාමුව විසිනි | `BackColor`, `ForeColor` සහ `Font` **පරිසරයෙන් උරුම වන (ambient)** ඒවාය — පහත නිදසුන බලන්න. තවද රාමුව සියල්ල අඳින නිසා, එක් CSS stylesheet එකකට මුළු යෙදුමම නැවත හැඩගැන්විය හැකිය ([උපග්‍රන්ථය D](#appendix-d)). |
| ආදාන මාර්ගගත කිරීම (input routing) රාමුවට අයත්ය | **මූසික ග්‍රහණය (mouse capture) සම්පූර්ණ අභිනය (gesture) පුරාම එය ගත් පාලකයට අයත් වේ** — container එකක් මත ආරම්භ කළ drag එකක් ඒ මත ඇති බොත්තමක් හරහා යාමෙන් පසුද නොනැසී පවතී. තමන් විසින්ම ග්‍රහණය ගන්නා child පාලකයක් තවමත් එහි මුතුන් මිත්තන්ට (ancestors) වඩා ජය ගනී. |
| මෙහි `Form` එකක් `Control` එකක් නොවේ — එය අභ්‍යන්තර `WindowBase` එකකින් ව්‍යුත්පන්න වේ | පොදු `Control` සාමාජිකයන් `Form` මත පවතී (`Anchor`, `Dock`, `TabIndex`, `Padding`/`Margin`, `Parent`, `MouseEnter`/`MouseLeave`), නමුත් `Form` එකකට තවමත් `Control.ControlCollection` එකකට යා නොහැකි අතර ගසක `Control`-වර්ගයේ ගමනකින් (walk) සොයා ගත නොහැක. |
| ස්පර්ශය මූසික අනුකරණයක් නොව පළමු පෙළේ ආදානයකි | `Control` මගින් `LongPress`, `Pinch`, `Swipe` සහ `ScrollGesture` මතු කරයි. **ඒවායින් කිසිවක් මූසිකය සඳහා ක්‍රියාත්මක නොවේ.** `ScrollableControl` දැනටමත් `ScrollGesture` එක `AutoScrollPosition` වෙත යොදයි, එබැවින් ඔබගේ `Panel`/`ListBox`/`TreeView` subclass වලට කිසිදු කේත වෙනසක් නොමැතිව ස්පර්ශ panning ලැබේ. |

**පරිසරයෙන් උරුම වන පෙනුම — නොනැසී පවතින WinForms රටාව.** `BackColor`, `ForeColor` සහ `Font` එක එකක්
පාලකයේම style දාමය, ඉන්පසු parent දාමය, ඉන්පසු ධාරක කවුළුව, ඉන්පසු තේමාව හරහා ගමන් කරයි. එබැවින්
container එකක් එක් වරක් වර්ණ ගන්වා එහි children එය ලබා ගැනීමට ඉඩ දීම ඔබ බලාපොරොත්තු වන ආකාරයටම
ක්‍රියා කරයි:

**C#**

```csharp
var panel = new Panel {
    BackColor = Color.FromArgb (32, 32, 32),
    ForeColor = Color.White,                 // children මෙය උරුම කර ගනී…
    Dock = DockStyle.Fill
};

panel.Controls.Add (new Label  { Text = "Inherits white text", Left = 12, Top = 12 });
panel.Controls.Add (new Button { Text = "So does this",        Left = 12, Top = 40 });

// …නමුත් ආදාන මතුපිටක් තමන්ගේම පසුබිම රඳවා ගනී, මන්ද WinForms එයට SystemColors.Window ලබා දෙයි.
panel.Controls.Add (new TextBox { Left = 12, Top = 80, Width = 200 });   // ලා පැහැයෙන්ම පවතී
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

' ආදාන මතුපිටක් තමන්ගේම පසුබිම රඳවා ගනී, මන්ද WinForms එයට SystemColors.Window ලබා දෙයි.
panel.Controls.Add(New TextBox With {.Left = 12, .Top = 80, .Width = 200})   ' ලා පැහැයෙන්ම පවතී
Controls.Add(panel)
```

![macOS මත ධාවනය වන පරිසරයෙන් උරුම වන පෙනුම පිළිබඳ නිදසුන]({{ '/assets/img/example-ambient.png' | relative_url }})

*හරියටම එම කේතය, ධාවනය වෙමින්. `Label` සහ `Button` ශීර්ෂ පැනලයෙන් සුදු පැහැය උරුම කර ගත්තේය;
`TextBox` තමන්ගේම ලා පැහැති පසුබිම රඳවා ගත්තේය.*

එම හිතාමතා අසමමිතිය — containers පහළට ගලා යයි (cascade), `TextBox`/`ComboBox` එසේ නොකරයි —
"මගේ අඳුරු තේමාව අඩක් පමණක් යෙදී ඇත්තේ ඇයි" යන නිතරම අසන ප්‍රශ්නයට හේතුවයි, සහ එය WinForms අනුව
නිවැරදිය.

මේ සියල්ලෙන් ලැබෙන ගෙන යා හැකි බව (portability) පැහැදිලිව පෙනේ. එකම `Explorer` නිදසුන, මෙහෙයුම්
පද්ධති තුනක්, එක් කේත පදනමක්:

![Windows මත Explorer නිදසුන]({{ '/assets/img/explorer-windows.png' | relative_url }})

*Windows — ව්‍යාපෘතියේම ලේඛන වලින්.*

![Ubuntu මත Explorer නිදසුන]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

*Ubuntu (AMD64) — ව්‍යාපෘතියේම ලේඛන වලින්.*

![macOS මත Explorer නිදසුන]({{ '/assets/img/explorer-macos.png' | relative_url }})

*macOS 26 — වත්මන් build එකෙන් ලබා ගන්නා ලදී.*

**අභ්‍යාසය 1.** සෙවීමකින් තොරව ඉහත වගුවෙන් පිළිතුරු දෙන්න: ඔබ `myButton.Handle` ස්වදේශීය වීඩියෝ
library එකකට ලබා දුන්නොත් සිදු වන්නේ කුමක්ද, සහ ඒ වෙනුවට ඔබ කළ යුත්තේ කුමක්ද? ඉන්පසු ඔබගේම WinForms
කේත පදනමේ container එකක් මත `BackColor` සකසා children එය උරුම කර ගැනීම මත රඳා පවතින එක් ස්ථානයක්
සොයාගෙන, එය තවමත් ක්‍රියා කරනවාද යන්න අනාවැකි කියන්න.

---

## Module 2 — ඔබගේ පළමු යෙදුම
{:#module-2}

**ප්‍රතිඵලය:** ඔබට ඕනෑම භාෂාවකින් මුල සිටම Majorsilence.Forms යෙදුමක් සෑදිය හැකි අතර, සෑම පේළියක්ම
කරන්නේ කුමක්දැයි පැහැදිලි කළ හැකිය.

### ව්‍යාපෘති ගොනුව
{:#module-2-project}

console යෙදුමකින් ආරම්භ කර කරුණු තුනක් වෙනස් කරන්න.

**C# — `MyApp.csproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
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
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
  </ItemGroup>
</Project>
```

VB අනුවාදයේ **නැති** දේ සලකන්න: `MyType` නැත, VB application framework එක නැත. migrator එකට වසා
දැමිය නොහැකි එකම ව්‍යුහාත්මක වෙනස එයයි, සහ [VB සඳහා `--dual-build` ලබා නොදෙන්නේ](#module-5-dualbuild)
එබැවිනි.

ඉලක්ක රාමු (target frameworks) පිළිබඳ සටහනක්, මන්ද සංක්‍රමණයක් පළමුව ඉවත් කරන්නේ `-windows` උපසර්ගයයි:
බහු-වේදිකා head එකකට අවශ්‍ය වන්නේ සාමාන්‍ය `net10.0` (හෝ `net8.0`) එකක් පමණි. හර පැකේජ
(`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`) **`netstandard2.0`**
build එකක්ද සපයයි, සම්භාව්‍ය **.NET Framework 4.8** යෙදුමකට පාලක යොමු කිරීමට ඉඩ දෙන්නේ එයයි —
WinForms හෝ WPF backend එකේ `net48` පේළිය සමඟ යුගල කර ([module 7](#module-7-c)). බහු-වේදිකා backend
`net8.0`+ සඳහා පමණි.

**පැකේජ දෙකම — පුහුණුවේදී හඬ නඟා කිව යුතු කොටස මෙයයි.** හර `Majorsilence.Forms` පැකේජය කිසිදු කවුළු
මෙවලම් කට්ටලයක් යොමු නොකරයි — SkiaSharp පමණි. එය පාලක සහ ඇඳීම හිමිකර ගනී; එයට තිරය මත කවුළුවක්
තැබිය නොහැක. එය කරන්නේ `Majorsilence.Forms.Avalonia` backend එකයි, සහ එය යොමු කිරීම යෙදුම Windows,
macOS සහ Linux මත *ධාවනය කළ හැකි* කරයි. වෙනත් ධාරකයක් ඉලක්ක කිරීමට එම දෙවන පේළිය
`Majorsilence.Forms.Uno`, `.Gtk4`, `.Terminal`, `.WinForms`, `.Wpf` හෝ `.Headless` සමඟ මාරු කරන්න —
එම එක් පේළිය (සහ පෙරනිමි නොවන backend සඳහා, තේරීමේ කේත පේළියක්) සම්පූර්ණ මාරුවයි
([module 6](#module-6)).

### කුඩාම සම්පූර්ණ යෙදුම
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

එම යෙදුම වැඩිදුර වින්‍යාසයකින් තොරව Windows, macOS සහ Linux මත ධාවනය වේ, මන්ද backend එකේ පැකේජය
යොමු කළ විට එය ස්වයංක්‍රීයව විසඳෙන බැවිනි. ඔබට *වෙනත්* backend එකක් අවශ්‍ය නම්, එය **පළමු කවුළුව
නිර්මාණය කිරීමට පෙර** පවරන්න:

**C#**

```csharp
Majorsilence.Forms.Backends.Platform.Backend =
    new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Application.Run (new MainForm ());     // මෙය පසුව පැමිණිය යුතුය
```

**VB.NET**

```vb
Majorsilence.Forms.Backends.Platform.Backend =
    New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Application.Run(New MainForm())        ' මෙය පසුව පැමිණිය යුතුය
```

එම අනුපිළිවෙළ සීමාව සැබෑ වන අතර මිනිසුන්ව අමාරුවේ දමයි: පෝරමයක් නිර්මාණය කිරීම backend එක ස්පර්ශ
කරයි. ජංගම සහ බ්‍රවුසර ඇතුළු වීමේ ලක්ෂ්‍ය ([module 6](#module-6)) instance එකක් වෙනුවට *factory* එකක්
ගන්නේද එබැවිනි.

### සැබවින්ම යමක් කරන පෝරමයක්
{:#module-2-interactive}

කේතයෙන් පිරිසැලසුම, සිදුවීම් හසුරුවනයක් (event handler), සංවාද කවුළුවක්, සහ modal ප්‍රතිඵලයක් — සෑම
තිරයකටම අවශ්‍ය කරුණු හතර. මෙය සාමාන්‍ය WinForms පුරුද්ද බව සලකන්න: `Anchor`, `Dock`, `DialogResult`,
`MessageBox`.

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

![macOS මත ධාවනය වන GreetForm නිදසුන]({{ '/assets/img/example-greet.png' | relative_url }})

*`GreetForm`, ධාවනය වෙමින්. එහි `Top | Left | Right` anchor එක නිසා `TextBox` එක කවුළුව සමඟ
දිගු විය; බොත්තම් දෙක පහළ-දකුණේ ස්ථිරව රැඳී සිටියේය.*

කොටුව හිස්ව තිබියදී OK ඔබන්න, එවිට වලංගුකරණ (validation) මාර්ගය ධාවනය වේ:

![වලංගුකරණ මාර්ගයෙන් එන MessageBox එක]({{ '/assets/img/example-messagebox.png' | relative_url }})

*`MessageBox.Show` සැබෑ modal කවුළුවක් විවෘත කරයි — එය හසුරුවනය අවහිර කර parent එක අක්‍රිය කරයි,
විය යුතු පරිදිම. අවංක විස්තරය සලකන්න: `MessageBoxIcon.Warning` පිළිගනු ලැබුවද තවමත් අනතුරු ඇඟවීමේ
සංකේතයක් (glyph) අඳින්නේ නැත. එය ක්‍රියාත්මක වන [stub ප්‍රතිපත්තියයි](#module-3-stub-policy) — ඇමතුම
ක්‍රියා කරයි, එක් දෘශ්‍ය විස්තරයක් ක්‍රියා නොකරයි, සහ කිසිවක් විසි නොවේ (throw).*

parent පෝරමයකින් එය modal ලෙස පෙන්වීම WinForms හි සිට වෙනස් වී නැත:

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

සැලකිය යුතු කරුණු දෙකක්, මන්ද මිනිසුන් අසු වන්නේ ඒවාටය: සෑම අන්තර්ක්‍රියාකාරී පාලකයකම ඇති `Name` එක
සැරසිල්ලක් නොවේ — එය පරීක්ෂණ locator එක *සහ* ප්‍රවේශ්‍යතා (accessibility) id එක බවට පත් වේ
([module 8](#module-8)) — සහ C# `|` භාවිත කරන තැන VB හි `Anchor` සඳහා `AnchorStyles.Top Or AnchorStyles.Left`
භාවිත කරයි, එය VB porting හි නිතරම සිදු වන ටයිප් දෝෂයයි.

තුන්වැන්නක්, බ්‍රවුසර හෝ දුරකථන head එකක් ඔබගේ roadmap එකේ කොතැනක හෝ තිබේ නම්: ඉහත අවහිර කරන
`ShowDialog` සහ `MessageBox.Show` desktop සඳහා පමණි. බ්‍රවුසර, Android සහ iOS පේළි මත ඒවා කිසිවක්
පෙන්වීමට *පෙර* `PlatformNotSupportedException` විසි කරයි, සහ සෑම සංවාද කවුළුවකටම await කළ හැකි නිවුන්
සගයෙක් ඇත (`ShowDialogAsync`, `MessageBox.ShowAsync`). අද වෙනස් කිරීමට කිසිවක් නැත — නමුත් ඔබගේ සියවන
හසුරුවනය ලිවීමට පෙර [async-සංවාද නීතිය](#module-6-async) කියවන්න, මන්ද shared UI library එකක් පසුව
පරිවර්තනය කිරීමට වඩා මුල සිටම async ලෙස ලිවීම බොහෝ ලාභදායීය.

### සැබෑ යෙදුමක් පෙනෙන්නේ කෙසේද
{:#module-2-real}

තනි පෝරමයක් පුහුණු ඉලක්කයක් නොවේ. ව්‍යාපාරික (LOB) කටයුතු සඳහා පිටපත් කළ යුතු හැඩය `PointOfSale`
නිදසුනයි — ව්‍යාපෘති එකක් නොව හතරක්:

| ව්‍යාපෘතිය | භූමිකාව |
|---|---|
| `PointOfSale.Client` | Majorsilence.Forms desktop යෙදුම (පෝරම, පැනල, අභිරුචි පාලක, සේවා) |
| `PointOfSale.Api` | JWT auth සහ භූමිකා-පාදක ප්‍රතිපත්ති සහිත ASP.NET Core minimal API |
| `PointOfSale.Contracts` | දෙපැත්තම බෙදා ගන්නා DTOs |
| `PointOfSale.Data` | EF Core + SQLite persistence සහ seeding |

UI ස්තරය පිළිබඳ කිසිවක් ඔබගේ ගෘහ නිර්මාණය සීමා නොකරයි: එය සාමාන්‍ය .NET client එකකි, එබැවින් ඔබගේ
පවතින DI, HTTP, logging සහ persistence තේරීම් සියල්ල වෙනසක් නොමැතිව ගෙන යයි.

තවද "සංකීර්ණ, බහු-පැනල යෙදුමක් සඳහා එය ඔරොත්තු දෙනවාද?" යන්නට පිළිතුර `Outlaw` වේ:

![macOS මත ධාවනය වන Outlook ක්ලෝනයක් වන Outlaw නිදසුන]({{ '/assets/img/outlaw-macos.png' | relative_url }})

*macOS 26 මත `Outlaw` — Outlook ක්ලෝනයක්, හිතාමතාම සෙල්ලම් demo එකක් නොවේ: අයිකන rail එකක්, ෆෝල්ඩර
ගසක්, virtualized පණිවිඩ ලැයිස්තුවක් සහ status bar එකක්, සියල්ල Majorsilence.Forms විසින් අඳින ලද.
පණිවිඩ පේළිය තෝරාගෙන ඇත; නිදසුන කිසිදා තේරීම කියවීමේ පැනලයට සම්බන්ධ නොකරන නිසා එය placeholder
එකක් ලෙසම පවතී — එය පිරිසැලසුම් සහ පාලක-ඝනත්ව අභ්‍යාසයකි, mail client එකක් නොවේ.*

**දැන්ම මේ වටා සැලසුම් කරන්න:** **තවමත් දෘශ්‍ය designer එකක් නැත**. Designer *කේතය* සංක්‍රමණය වී ධාවනය
වේ — `*.Designer.cs`/`*.Designer.vb` රටාව එලෙසම සංරක්ෂණය වන අතර, ඔබගේ පාලක libraries යොමු කරන
design-time වර්ග තවමත් compile වේ — නමුත් runtime එකේදී කිසිවක් ඒවා instantiate නොකරන අතර පිරිසැලසුම
සංස්කරණය කිරීමට design මතුපිටක් නැත. එය ලිඛිත සැලැස්මක් සහිත අවශ්‍ය විශේෂාංගයකි, කල් දැමූ එකක් නොවේ.
designer ගොනු අතින් සංස්කරණය කිරීමට, හෝ ඉහත පරිදි කේතයෙන් පිරිසැලසුම් කිරීමට අයවැය කරන්න.

**අභ්‍යාසය 2.** ඔබගේ කණ්ඩායමේ භාෂාවෙන් `GreetForm` ගොඩනඟන්න. ඉන්පසු backend පැකේජය Headless වෙත
මාරු කර, කවුළුවක් විවෘත නොකර යෙදුම ආරම්භ වී පිටවන බව තහවුරු කරන්න — [module 8](#module-8) හිදී ඔබ
හරියටම එම සැකසුම නැවත භාවිත කරනු ඇත.

---

## Module 3 — ඒ මත ගොඩනඟන්නට පෙර ක්‍රියා කරන්නේ කුමක්දැයි දැන ගැනීම
{:#module-3}

**ප්‍රතිඵලය:** ඕනෑම සාමාජිකයෙකු මත රඳා පැවතීමට පෙර, එය සැබවින්ම ක්‍රියා කරනවාද යන්න සොයා ගන්නා
ආකාරය ඔබ දන්නා අතර — රාමුවේ ලාක්ෂණික අසාර්ථක වීමේ ආකාරය දුටු සැණින් හඳුනා ගනී.

මෙය මාර්ගෝපදේශයේ වැදගත්ම module එකයි.
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) එක වරක් මුල
සිට අග දක්වා කියවා, ඔබ වැඩ කරන අතරතුර එය විවෘතව තබා ගන්න. එය පවතින්නේ හරියටම ඔබගේ තත්ත්වය
සඳහාය: විශ්වාස කළ යුත්තේ කුමක්දැයි තීරණය කරන WinForms කේත පදනමක් ඇති සංවර්ධකයෙකු.

### stub ප්‍රතිපත්තිය
{:#module-3-stub-policy}

> **සාමාජිකයෙකුට තවමත් ක්‍රියාකාරී ක්‍රියාත්මක කිරීමක් නොමැති නම්, එය `NotImplementedException` විසි
> කරනු වෙනුවට ආරක්ෂිතව no-op වේ (කිසිවක් නොකරයි) (හෝ සාධාරණ පෙරනිමි අගයක් ලබා දෙයි).**

එය සම්පූර්ණ ගැළපුම් ස්තරය පුරා හිතාමතා, ස්ථාවර ප්‍රතිපත්තියක් වන අතර, දෘශ්‍ය විශේෂාංගයක් තවමත් කිසිවක්
නොකරන තැන්වල පවා සංක්‍රමණය කළ කේතයට compile වී *ධාවනය වීමට* ඉඩ දෙන්නේ එයයි. සංයුක්තව:

- පසුබිම් හැසිරීමක් නොමැති property එකක් සරල settable auto-property එකකි — ඔබ සකසන දේ එය ගබඩා
  කර නැවත කියවයි, එය හුදෙක් runtime හැසිරීම වෙනස් නොකරයි.
- ක්‍රියාත්මක කිරීමක් නොමැති method එකක් විසි කරනු වෙනුවට උදාසීන අගයක් ලබා දෙයි — උදා: තවමත් සැබෑ
  UI එකක් නොමැති `ShowDialog()` ඇති සංවාද කවුළුවක් වහාම `DialogResult.OK` ලබා දෙයි.
- කිසිදා මතු නොකරන සිදුවීමක් (event) තවමත් compile වන අතර එයට subscribe කළ හැකිය; එය හුදෙක් කිසිදා
  ක්‍රියාත්මක නොවේ. මෙය භාවිත වන්නේ අඩුවෙන් වන අතර, matrix එකේ වර්ගයෙන් වර්ගයට පෙන්වා දී ඇත.

**stub කරනු වෙනුවට විසි කරන සාමාජිකයෙකුට ඔබ මුහුණ දුන්නොත්, එය දෝෂයකි (bug) — එය වාර්තා කරන්න**
([module 10](#module-10-gaps)).

### එම ප්‍රතිපත්තියේ මිල — සහ ඔබගේ කණ්ඩායමට කිව යුතු කතාව
{:#module-3-cost}

නිහඬ no-op එකක් සොයා ගැනීමට අපහසුම ආකාරයේ හිඩැසයි: එය compile වේ, ධාවනය වේ, සහ එකම රෝග ලක්ෂණය
පහළට කොතැනක හෝ වැරදි ප්‍රතිදානයකි. සම්භාව්‍ය නිදසුන වචනයෙන් වචනයට කීම වටී, මන්ද එය ඕනෑම නීතියකට
වඩා හොඳින් අසාර්ථක වීමේ ආකාරය උගන්වයි:

`Image.MakeTransparent` හිස් විය. port කළ ක්‍රීඩා කේතය sprite sheet එකක පසුබිම් වර්ණය විනිවිද පෙනෙන
(transparent) ලෙස යතුරු කළේය, ඇමතුම කිසිවක් නොකළේය, සහ සෑම sprite එකක්ම පිටුපස සුදු කොටුවක් සමඟ
ඇඳුණේය. කිසිවක් විසි නොවීය. grep කිරීමට කිසිවක් නොතිබුණි.

ඔබට කරුණු දෙකක් පැන නගී. පළමුව, **යමක් වැරදි ලෙස විදැහුම් වන හෝ හැසිරෙන අතර කිසිවක් විසි නොවූ විට,
ඔබගේම කේතය සැක කිරීමට පෙර stub එකක් සැක කරන්න** — අදාළ සාමාජිකයා සඳහා matrix පේළිය පරීක්ෂා කරන්න.
දෙවනුව, එම ආකාරයේ හිඩැස දැන් ආරක්ෂා කර ඇත: ව්‍යාපෘතිය එහි දන්නා හිස්-සිරුරු (empty-bodied) පොදු
`void` methods මූලික පරීක්ෂණයක (baseline test) ස්ථිර කරයි (`NoOpStubBaseline.txt` — ලියන අවස්ථාවේ
ඇතුළත් කිරීම් 161), එබැවින් නව එකක් නිහඬව එක් කළ නොහැකි අතර, ඇතුළත් කිරීම් නිකුතු පුරා අඩු වේ.
සහෝදර baseline තුනක් අනෙකුත් හිස් බව වර්ග ස්ථිර කරයි — ප්‍රකාශ කළ නමුත් අක්‍රිය සිදුවීම්, කිසිදා මතු
නොකරන සිදුවීම්, සහ අගයක් ගබඩා කිරීම පමණක් කරන properties (matrix එක දැනට වාර්තා කරන පරිදි පිළිවෙළින්
1,254 න් 79, 127 සහ 812). matrix එක අලෙවිකරණයක් ලෙස නොසලකා යොමුවක් ලෙස විශ්වාස කිරීම වටින්නේ එබැවිනි:
සංඛ්‍යා ඇස්තමේන්තු නොව බලාත්මක කරනු ලැබේ.

### ඔබ රඳා පවතින හැසිරීම ස්ථිර කරන්න
{:#module-3-pin}

ප්‍රායෝගික ආරක්ෂාව නම් එක් උපකල්පනයකට එක් පරීක්ෂණයකි. විශේෂාංගයක් වැදගත් වන විට, සාමාජිකයාගේ
පැවැත්ම නොව *බලපෑම* තහවුරු (assert) කරන්න — stub එකක් අල්ලා ගන්නා පරීක්ෂණයක් සහ නොගන්නා පරීක්ෂණයක්
අතර වෙනස එයයි:

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

    // method එක පවතින බව නොව ප්‍රතිඵලය (RESULT) තහවුරු කරන්න — stub එකක් "එය compile වේ" පරීක්ෂණයක් සමත් වනු ඇත.
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

        ' method එක පවතින බව නොව ප්‍රතිඵලය (RESULT) තහවුරු කරන්න.
        Assert.Equal(0, CInt(bitmap.GetPixel(0, 0).A))
    End Using
End Sub
```

ඔබගේ තීරණාත්මක මාර්ගයේ (critical path) සෑම සාමාජිකයෙකු සඳහාම එවැනි එකක් ලියන්න. එයට වැය වන්නේ
මිනිත්තු කිහිපයක් වන අතර එය වැදගත් වන දිනයේදී නිහඬ no-op එකක් රතු build එකක් බවට පරිවර්තනය කරයි.

### උපකල්පනය නොකර පරීක්ෂා කරන්න — සාක්ෂි
{:#module-3-apidiff}

ව්‍යාපෘතිය reflection මගින් තමන්ගේම පොදු මතුපිට සැබෑ `System.Windows.Forms` reference assembly එකට
එරෙහිව diff කර ප්‍රතිඵලය commit කළ baseline එකක් ලෙස තබා ගනී. එම විගණනයේ පළමු ධාවනය **අතුරුදහන්
ඇතුළත් කිරීම් 1,905ක්** සොයා ගත්තේය — **වැරදි සංඛ්‍යාත්මක අගයක් සහිතව පවතින enum සාමාජිකයන් 126ක්**
ඇතුළුව. පුද්ගලිකව සැලකිල්ලට ගත යුත්තේ එම අවසාන කාණ්ඩයයි: කේතය compile වේ, ධාවනය වේ, සහ නිහඬව වෙනත්
දෙයක් අදහස් කරයි. සමානත්වය උපකල්පනය කරනු වෙනුවට ඔබගේ යෙදුම රඳා පවතින නිශ්චිත සාමාජිකයන් සත්‍යාපනය
කිරීම සඳහා ඇති හොඳම තර්කය එයයි.

**API-මතුපිට baseline දෙකම — WinForms සහ GDI+ — දැන් ශුන්‍යයේ පවතී.** upstream ප්‍රකාශ කරන සෑම
සාමාජිකයෙකුම, මෙම ස්තරයද ප්‍රකාශ කරයි. එය ප්‍රවේශමෙන් කියවන්න, මන්ද එය ගැටලුවේ කුඩා භාගයයි: නාම-මට්ටමේ
diff එකකට සාමාජිකයෙකු WinForms මෙන් *හැසිරෙනවාද* යන්න ඇසිය නොහැක. ක්ෂේත්‍ර දොළහක මූලාශ්‍ර විගණනයක්
(2026-08-25) හරියටම එය ඇසූ අතර **හැසිරීම වෙනස් වූ ස්ථාන 483ක්** සොයා ගත්තේය — ඉන් 41ක් සාමාන්‍ය
සංක්‍රමණය කළ යෙදුමක් බිඳ දැමීමට තරම් බරපතල විය. එම ලැයිස්තුවෙන් වැඩි කොටසක් එතැන් සිට අදියර වශයෙන්
ඇතුළත් වී ඇත (`ProcessCmdKey` හරහා යතුරුපුවරු පූර්ව-සැකසුම, එක් focus/validation choke point එකක්, සැබෑ
සංවාද කවුළු, `AutoScaleMode.Font` සැබවින්ම පරිමාණනය කිරීම, ක්‍රියාකාරී `CurrencyManager` එකක් සහිත සජීවී
දත්ත බන්ධනය (data binding), `ListView.View = Details` වගුවක් ලෙස විදැහුම් වීම, upstream අනුපිළිවෙළට පෝරම
ජීවන චක්‍ර සිදුවීම්, Ctrl+Z මත text-box undo, …); ඉතිරි දේ
[`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md) හි ලුහුබඳිනු
ලැබේ. ඔබගේ කණ්ඩායමට පාඩම වෙනස් නොවේ: **"එය compile වේ" යන්නෙන් අදහස් වන්නේ නම පවතින බවයි; එය ක්‍රියා
කරනවාද යන්න matrix පේළිය ඔබට කියයි.**

### පාලකයෙන් පාලකයට වගුව කියවීම
{:#module-3-reading}

matrix එකේ තත්ත්වය ලකුණු කර ඇත්තේ සංක්‍රමණය කරන සංවර්ධකයෙකුගේ දෘෂ්ටිකෝණයෙනි:

| තත්ත්වය | අර්ථය |
|---|---|
| **Implemented** | ප්‍රධාන ධාරාවේ මතුපිට පවතී. හිඩැස් ගැඹුරු/දුර්ලභ කොන් වලට හෝ matrix එක එක් වරක් සඳහන් කරන පද්ධතිමය රටා වලට සීමා වේ. |
| **Partial** | අතුරුදහන් වූ නිශ්චිත, බහුලව භාවිත වන සාමාජිකයන් නම් කරයි. |
| **Missing** | එම නාමය යටතේ වර්ගය කිසිසේත් නොපවතී. |

වැඩි භාවිතයක් ඇති පාලක (`Button`, `TextBox`, `Panel`, `TabControl`, `TableLayoutPanel`, `TreeView`,
`ListView`, මෙනු, toolbars, status bars, පොදු සංවාද කවුළු, …) ක්‍රියාකාරීව ක්‍රියාත්මක කර ඇත, stub නොවේ.
වැඩ සැලසුම් කිරීමට පෙර දැනගත යුතු හිඩැස්:

| වර්ගය | සැලකිලිමත් විය යුතු දේ |
|---|---|
| `DataGridView` | තනි-වර්ග හිඩැස් අතරින් විශාලතම එක — නමුත් වැඩිම භාවිත වන hooks **සැබෑ වන අතර ක්‍රියාත්මක වේ**: `CellFormatting`, `CellPainting`, `RowPrePaint`/`RowPostPaint`, `CellParsing`, `RowValidating`/`RowValidated`, `GetClipboardContent()`, සහ border-style properties. තවමත් ප්‍රකාශ කළ නමුත් කිසිදා මතු නොකරන: `RowsAdded`/`RowsRemoved`, `DataError`, `SortCompare`, `CellValueNeeded`/`CellValuePushed`, `CellMouse*` පවුල, සහ සියුම් `*Changed` සිදුවීම්. ස්වයං-ප්‍රමාණකරණය (auto-sizing) කරන්නේ invalidate කිරීම පමණි. |
| `ListView` | owner-draw නැත, virtual-mode ලබා ගැනීමේ callbacks නැත (`VirtualMode` සරල property එකකි), `InsertionMark` නැත. |
| `TreeView` | `Sorted` නැත, `ImageKey`/`SelectedImageKey` නැත (දර්ශක-පාදක `ImageIndex` ක්‍රියා කරයි), `HitTest` නැත, `ShowNodeToolTips` නැත. |
| `ComboBox`/`ListBox`/`CheckedListBox` | `DataSource`/`DisplayMember`/`ValueMember` පවතී; බන්ධන *ආකෘතිකරණ (format)* hooks සහ `Sort()` නොපවතී. |
| `RichTextBox`, `MaskedTextBox` | පිළිවෙළින්, Undo/redo සහ `SelectedRtf`; overwrite-mode සහ char-index ස්ථානගත කිරීම. |
| `ToolStrip` පවුල | `MenuStrip`/`ContextMenuStrip`/`StatusStrip` සැබවින්ම `ToolStrip` වෙතින් ව්‍යුත්පන්න වේ, එබැවින් සම්පූර්ණ මතුපිටටම ළඟා විය හැකිය — නමුත් `ToolStrip`-මට්ටමේ සාමාජිකයන් stub වේ. `Renderer`/`RenderMode` පැවරීම ඇඳීම වෙනස් **නොකරයි**; `LayoutStyle` පිරිසැලසුම වෙනස් නොකරයි; overflow බොත්තමක් නැත. ක්‍රියා කරන්නේ සෑම පාලකයක්ම දැනටමත් හොඳින් කළ දෙයයි. |
| `WebBrowser` | සංචාලනය (navigation) ක්‍රියා කරයි; කිසිසේත් DOM වස්තු ආකෘතියක් නැත (`Document`, `HtmlElement`, …), මන්ද එය COM automation මගින් නොව සැබෑ webview එකක් මගින් පිටුබලය ලබයි. |
| පොදු සංවාද කවුළු | ප්‍රතිඵල සහ `ShowDialog()` ක්‍රියා කරයි. Windows-shell-පමණක් අමතර දේ (`CustomPlaces`, `AutoUpgradeEnabled`, සංවාද hook plumbing) නොමැත — එය අපේක්ෂිතය, hook කිරීමට ස්වදේශීය සංවාද කවුළුවක් නැත. |

**grid එක සමඟ වැඩ කිරීම, සංයුක්තව.** බොහෝ LOB යෙදුම් ජීවත් වන්නේ `DataGridView` තුළ නිසා, සහාය
දක්වන හැඩය මෙන්න — ක්‍රියා නොකරන සාමාජිකයන් හරහා නොව, සැබවින්ම ක්‍රියාත්මක වන සිදුවීම් හරහා ආකෘතිකරණය
සහ ඇඳීම:

**C#**

```csharp
var grid = new DataGridView { Name = "ordersGrid", Dock = DockStyle.Fill };
grid.DataSource = orders;

// CellFormatting සැබෑය: paint කිරීමේදී එය සෑම cell එකකටම ක්‍රියාත්මක වේ.
grid.CellFormatting += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name != "Total")
        return;

    if (e.Value is decimal total) {
        e.Value = total.ToString ("C");
        e.CellStyle.ForeColor = total < 0 ? Color.Firebrick : Color.Black;
        e.FormattingApplied = true;          // එය නැවත ආකෘතිකරණය නොකරන ලෙස grid එකට කියන්න
    }
};

// CellParsing ද සැබෑය: එය edit commit මත ධාවනය වන අතර, ගබඩා වන්නේ ඔබ ලබා දුන් අගයයි.
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

' CellFormatting සැබෑය: paint කිරීමේදී එය සෑම cell එකකටම ක්‍රියාත්මක වේ.
AddHandler grid.CellFormatting,
    Sub(sender As Object, e As DataGridViewCellFormattingEventArgs)
        If grid.Columns(e.ColumnIndex).Name <> "Total" Then Return

        If TypeOf e.Value Is Decimal Then
            Dim total = CDec(e.Value)
            e.Value = total.ToString("C")
            e.CellStyle.ForeColor = If(total < 0, Color.Firebrick, Color.Black)
            e.FormattingApplied = True        ' එය නැවත ආකෘතිකරණය නොකරන ලෙස grid එකට කියන්න
        End If
    End Sub

' CellParsing ද සැබෑය: එය edit commit මත ධාවනය වන අතර, ගබඩා වන්නේ ඔබ ලබා දුන් අගයයි.
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

![macOS මත ධාවනය වන DataGridView CellFormatting නිදසුන]({{ '/assets/img/example-grid.png' | relative_url }})

*එම කේතය, සරල `List<Order>` එකකට එරෙහිව ධාවනය වෙමින්: බන්ධිත වර්ගයෙන් ස්වයංක්‍රීයව ජනනය වූ තීරු,
මුදල් ලෙස ආකෘතිකරණය කළ අගයන්, සහ හසුරුවනයේ `e.CellStyle.ForeColor` සැබවින්ම renderer එකට ළඟා වන
නිසා සෘණ අගයන් රතු පැහැයෙන්.*

> **ඔබ තවමත් 26.0.30 වෙත ස්ථිර කර ඇත්නම් දැනගත යුතු එක් අනුවාද අවවාදයක්.** එම පැකේජයේ, බන්ධිත cell
> අගයන් `CellFormatting` වෙත පැමිණෙන්නේ දැනටමත් strings වලට පරිවර්තනය වීය, එබැවින් `e.Value is decimal`
> කිසිදා නොගැළපෙන අතර මෙම හසුරුවනය නිහඬව කිසිවක් නොකරයි — මෙම module එක සාකච්ඡා කරන හරියටම එම
> අසාර්ථක වීමේ ආකාරයයි. ඉන් පසු පැමිණි නිකුතු වලදී එය නිවැරදි කරන ලදී (බන්ධිත cells සාමාජිකයාගේ වර්ගය
> රඳවා ගනී), එබැවින් 26.9.0 වැනි වත්මන් අනුවාදයක් මත ඉහත කේතය නිවැරදිය. ඔබ 26.0.30 මත සිට ආකෘතිකරණය
> නොවූ අගයන් දකින්නේ නම්, ඒ වෙනුවට ආරක්ෂාකාරීව parse කරන්න:
> `decimal.TryParse (e.Value?.ToString (), out var total)`. එම ආකාරය කෙසේ වුවද ක්‍රියා කරයි.

එම වගුවෙන්ම, ඔබ තවමත් ඒවාට එරෙහිව *නොලිවිය යුතු* දේ: `RowsAdded`, `DataError`, `SortCompare`,
`CellValueNeeded` (එබැවින් virtual mode නැත), සහ `CellMouse*` පවුල. සෑම එකක්ම compile වන අතර නිහඬව
කිසිදා ක්‍රියාත්මක නොවේ — [ඉහත](#module-3-cost) සඳහන් හරියටම එම අසාර්ථක වීමේ ආකාරයයි.

vendor තාක්ෂණ තොග වලින් පැමිණෙන කණ්ඩායම් සඳහා සටහන් දෙකක්. **Telerik UI for WinForms** සඳහා පළමු පෙළේ
ගැළපුම් ස්තරයක් (`Majorsilence.Forms.Telerik`) ඇති අතර, එහිම මූලාශ්‍ර කේතය ගිවිසුම පැහැදිලිව සඳහන්
කරයි: *ආවරණය compile වී ආසන්න වශයෙන් ක්‍රියා කරන එකකි, පික්සලයෙන් පික්සලයට නිවැරදි නොවේ*. තවද
**spellcheck** (`TextBox` වෙත සම්බන්ධ කර ඇති) යනු රැලි සහිත යටි ඉරි සහ යෝජනා මෙනුවක් සහිත, පරායත්තතා
රහිතව මුල සිට ලියූ ක්‍රියාත්මක කිරීමකි — කිසිසේත් WinForms API එකක් නොවේ; එය පවතින්නේ Telerik හි
`RadSpellChecker` සඳහා පිටුබලය දීමටය.

**අභ්‍යාසය 3.** ඔබගේම යෙදුම රඳා පවතින සාමාජිකයන් තුනක් තෝරන්න — ඔබට විශ්වාස එකක්, විශ්වාස නැති
එකක්, සහ අසාමාන්‍ය එකක්. එක් එක් එක සඳහා, එය ක්‍රියාත්මක කර ඇත්ද, stub කර ඇත්ද, නැතහොත් නොමැතිද යන්න
matrix එකෙන් තීරණය කර, ඔබට අවම විශ්වාසයක් ඇති එක සඳහා [ස්ථිර කිරීමේ පරීක්ෂණයක්](#module-3-pin)
ලියන්න.

---

## Module 4 — ඇඳීම සහ අභිරුචි ඇඳීම
{:#module-4}

**ප්‍රතිඵලය:** රැඳී සිටින `System.Drawing` වර්ග මොනවාද, ගමන් කරන ඒවා මොනවාද, සහ WinForms-ශෛලීය සහ
Skia-ස්වදේශීය ඇඳීමේ කේත දෙකම ලියන්නේ කෙසේද යන්න ඔබ දනී.

`Majorsilence.Forms.Drawing` යනු Windows-පමණක් වූ `System.Drawing.Common` (GDI+) සඳහා Skia පිටුබලය
සහිත, බහු-වේදිකා ආදේශකයකි. සියල්ල පාලනය කරන බෙදීම:

| මූලාශ්‍රය | ඉලක්කය | ඇයි |
|---|---|---|
| `System.Drawing` **primitives** — `Color`, `Point`, `PointF`, `Size`, `SizeF`, `Rectangle`, `RectangleF` | *වෙනස් නොවේ* | ඒවා දැනටමත් සෑම වේදිකාවකම `System.Drawing.Primitives` තුළ නිකුත් වේ. |
| `System.Drawing` **GDI+ වර්ග** — `Bitmap`, `Font`, `Pen`, `Brush`, `Graphics`-ආශ්‍රිත | `Majorsilence.Forms.Drawing` | `System.Drawing.Common` හි GDI+ Windows-පමණි; SkiaSharp මත නැවත ක්‍රියාත්මක කර ඇත. |
| `System.Drawing.Drawing2D` / `.Imaging` / `.Text` | `Majorsilence.Forms.Drawing.Drawing2D` / `.Imaging` / `.Text` | එකම බෙදීම, උප-namespace සහිතව. |
| `System.Drawing.Printing` | `Majorsilence.Forms.Printing` | මුද්‍රණය පිහිටා ඇත්තේ ගැළපුම් ස්තරයේ ඇඳීම් පැත්තේ නොව Forms පැත්තේය. |
| `System.Windows.Forms.VisualStyles`, `System.Drawing.Design`, `System.ComponentModel.Design` | *එලෙසම තබයි* | සමාන දෙයක් නැත — නොපවතින දෙයකට නැවත ලියනු වෙනුවට අතින් සමාලෝචනය සඳහා සලකුණු කෙරේ. |

ඇඳීම් ස්තරය තනිවම භාවිත කිරීමට උත්සාහ කරන අයව පැකිළවන එක් ඇසුරුම් (packaging) විස්තරයක්: අගය
වර්ග, රූප, අකුරු සහ සම්පත් ජීවත් වන්නේ `Majorsilence.Forms.Drawing.Common` පැකේජයේය, නමුත් **`Graphics`
ම නිකුත් වන්නේ හර `Majorsilence.Forms` පැකේජයේය** (තවමත් `Majorsilence.Forms.Drawing` namespace එක
යටතේ). එබැවින් headless රූප හැසිරවීමට හර පැකේජයද යොමු කළ යුතුය — ඕනෑම යෙදුමක ඔබට එය කෙසේ හෝ ඇත.

සැබෑ සහාය ටිකට්පත් ඇති කරන විශේෂිත කරුණු තුනක්:

1. **`System.Drawing.Common` ඔබගේ ව්‍යාපෘතියෙන් ඉවත් කළ යුතුය**, එය .NET 7 සිට Windows-පමණක් වීම නිසා
   පමණක් නොව, එය යොමු කර තැබීමෙන් Majorsilence ආදේශක අසලින්ම `System.Drawing.Bitmap`/`Font`/`Pen`
   නැවත විෂය පථයට (scope) ගෙන එන නිසාය — එවිට සෑම සුදුසුකම් නොලත් (unqualified) භාවිතයක්ම port එකට
   විසඳෙනු වෙනුවට *අපැහැදිලි යොමුවක්* (ambiguous reference) ලෙස අසාර්ථක වේ.
2. **`SystemColors` සහ `ColorTranslator` අපැහැදිලිතා ව්‍යතිරේකයන්ය.** ඒවා ජීවත් වන්නේ
   `System.Drawing.Primitives` තුළ නිසා, primitives සඳහා ඔබ තබා ගන්නා `using System.Drawing;` හරහා
   තවමත් විසඳිය හැකිය — සහ සුදුසුකම් නොලත් ලෙස භාවිත කළ විට ඒවා Majorsilence ඒවා සමඟ ගැටේ (CS0104).
   විසඳුම එක් පේළියක alias එකකි, එය අවශ්‍ය ගොනු වල පමණක් migrator එක ඔබ වෙනුවෙන් එක් කරයි:

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

3. **gradient සහ hatch brushes ජීවත් වන්නේ GDI+ ඒවා තබන තැනමය**: `LinearGradientBrush`,
   `PathGradientBrush`, `HatchBrush` සහ `HatchStyle` ඇත්තේ `Majorsilence.Forms.Drawing.Drawing2D` තුළය.
   `Brush`, `SolidBrush` සහ `TextureBrush` ඇත්තේ `Majorsilence.Forms.Drawing` තුළය — ඒවා සැබවින්ම
   `System.Drawing` වර්ග වේ. නැවත ලියූ import එක හරහා ඒවාට ළඟා වන කේතයට බලපෑමක් නැත; යාවත්කාලීන කළ
   යුත්තේ සම්පූර්ණයෙන් සුදුසුකම් ලත් (fully-qualified) යොමුවක් පමණි.

### තිරයෙන් පිටත රූප සැකසීම
{:#module-4-offscreen}

`Graphics.FromImage` GDI+ හි ක්‍රියා කරන ආකාරයටම ක්‍රියා කරයි, එයින් අදහස් වන්නේ ඔබගේ පවතින රූප සැකසුම්
කේතයෙන් වැඩි කොටසක් imports පමණක් වෙනස් කිරීමෙන් port වන බවයි:

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

![තිරයෙන් පිටත රූප සැකසුම් නිදසුන මගින් නිපදවූ thumbnail එක]({{ '/assets/img/example-thumbnail.png' | relative_url }})

*එම method එකේ සැබෑ ප්‍රතිදානය: bicubic interpolation සමඟ 320 px පළලට ප්‍රමාණය වෙනස් කළ 1080×752
තිර රූපයක්, පහළ දිගේ අර්ධ-විනිවිද watermark තීරුව සමඟ.*

එම කේතයට කිසිසේත් UI පරායත්තතාවක් නැත — එය console යෙදුමක, සේවාවක (service), හෝ පරීක්ෂණයක ධාවනය වේ.

### අභිරුචි ඇඳීම: ක්‍රම දෙකක්, සහ එක් එක් එක භාවිත කළ යුත්තේ කවදාද
{:#module-4-paint}

`PaintEventArgs` ඔබට මතුපිට **දෙකම** ලබා දෙයි. `e.Graphics` යනු GDI+-හැඩැති wrapper එකයි, එබැවින් port
කළ `OnPaint` කේතය වෙනසක් නොමැතිව compile වේ. `e.Canvas` යනු රාමුවම අඳින අමු `SKCanvas` එකයි — Skia
හොඳින් කරන සහ GDI+ කිසිදා නොකළ දෙයක් ඔබට අවශ්‍ය වූ විට එය භාවිත කරන්න.

**C# — WinForms-ශෛලීය, වෙනසක් නොමැතිව port වේ**

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

**VB.NET — WinForms-ශෛලීය, වෙනසක් නොමැතිව port වේ**

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

**C# — Skia-ස්වදේශීය, GDI+ හට ප්‍රකාශ කළ නොහැකි effects සඳහා**

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

    // සැබෑ gradient shader එකක් සහිත වටකුරු සෘජුකෝණාස්‍රයක් — එක් ඇමතුමක්, GDI+ හි සමාන දෙයක් නැත.
    e.Canvas.DrawRoundRect (new SKRect (0, 0, Width, Height), 12, 12, paint);
}
```

**VB.NET — Skia-ස්වදේශීය**

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
        ' සැබෑ gradient shader එකක් සහිත වටකුරු සෘජුකෝණාස්‍රයක් — එක් ඇමතුමක්, GDI+ හි සමාන දෙයක් නැත.
        e.Canvas.DrawRoundRect(New SKRect(0, 0, Width, Height), 12, 12, paint)
    End Using
End Sub
```

![macOS මත ධාවනය වන, අභිරුචි ඇඳීමේ ප්‍රවේශ දෙක එක ළඟ]({{ '/assets/img/example-paint.png' | relative_url }})

*එක් කවුළුවක පාලක දෙකම. වම: GDI+-හැඩැති මාර්ගය — පැතලි පිරවීම, 2 px සුදු මායිම. දකුණ: Skia
මාර්ගය — වටකුරු කොන් සහ සැබෑ gradient shader එකක්, තනි `DrawRoundRect` ඇමතුමකින්.*

**ඔබගේ කණ්ඩායමට මඟ පෙන්වීම:** `e.Graphics` සමඟ සංක්‍රමණය කරන්න (එය නොමිලේය — කේතය දැනටමත් පවතී),
සහ නව දෘශ්‍ය සඳහා හිතාමතාම `e.Canvas` භාවිත කරන්න. එක් හසුරුවනයක ඒවා මිශ්‍ර කිරීම හොඳයි; ඒවා එකම
මතුපිටට අඳියි.

**canvas එක තාර්කික ඒකක වලින් ඇත — එය ඔබ විසින්ම පරිමාණනය නොකරන්න.** ඉහත නිදසුන් දෙකම
`ClientRectangle`, `Width` සහ `Height` වලට එරෙහිව අඳින අතර, වැඩිදුර කේතයකින් තොරව HiDPI desktop එකක හෝ
දුරකථනයක (Android ආසන්න වශයෙන් 2.6–2.75 පරිමාණනයක් වාර්තා කරන) නිවැරදි ප්‍රමාණයෙන් ඇත, මන්ද ඔබගේ
`OnPaint` ධාවනය වීමට පෙර රාමුව canvas එක සංදර්ශකයට පරිමාණනය කරන බැවිනි. 2026-10-01 ට පෙර canvas එක
*උපාංග* පික්සල වලින් වූ අතර අභිරුචි පාලකයකට `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` තමන් විසින්ම
ඇමතීමට සිදු විය. **ඔබට පාලකයක එම ඇමතුම තිබේ නම්, එය ඉවත් කරන්න** — එය දැන් ඇඳීම දෙවරක් පරිමාණනය
කරයි, සහ රෝග ලක්ෂණය නම් 2× සංදර්ශකයක දෙගුණ ප්‍රමාණයෙන් අඳින නමුත් ඔබගේ 1× monitor එකේ හොඳින් පෙනෙන
පාලකයකි. `e.ClipRectangle` සහ `e.Canvas` ද තාර්කිකය; නිශ්චිත උපාංග පික්සලයකට ගොඩබෑමට ඔබට අවශ්‍ය දුර්ලභ
අවස්ථාව සඳහා (hairline එකක්, pixel-art sprite එකක්) `PaintEventArgs.Scaling` තවමත් ඇත. ඔබට තවමත් උපාංග
පික්සල ලැබෙන එකම ස්ථානය owner-draw පවුලයි — `DrawItem`, `DrawNode`, `CellPainting` සහ ඒ හා සමාන ඒවා —
ඒවායේ `Bounds` සහ `Graphics` එකිනෙකා සමඟ එකඟ වන නමුත් පාලකයේ තාර්කික `ClientRectangle` සමඟ එකඟ නොවේ.
ඕනෑම වර්ගයක් `MF_HEADLESS_SCALE=2` යටතේ පරීක්ෂා කරන්න ([module 8](#module-8-headless)).

### පාලකයක් සජීවීකරණය කිරීම: `RequestAnimationFrame`
{:#module-4-animation}

16 ms හි `Timer` එකක් යනු WinForms සජීවීකරණය (animate) කළ ආකාරය වන අතර, එය තවමත් ක්‍රියා කරයි. රාමුව
බ්‍රවුසරයේ රටාවද ලබා දෙයි, එය Avalonia මත සංදර්ශකයට පෙළගැසී ඇති අතර — ඔබගේ පරීක්ෂණ සඳහා වැදගත් කොටස —
Headless මත සම්පූර්ණයෙන්ම නිර්ණායක (deterministic) වේ. `control.RequestAnimationFrame (callback)` ඊළඟ
frame එකේ ආරම්භයේදී, වෙනසක් ලෙස පමණක් අර්ථයක් ඇති timestamp එකක් සමඟ **එක් වරක්** නැවත අමතයි; දිගටම
යාමට callback එක ඇතුළත සිට නැවත ඉල්ලන්න. (`docs/animation.md` සමඟ සසඳා පරීක්ෂා කරන ලදී, මෙම
මාර්ගෝපදේශය සඳහා ධාවනය කර නැත.)

**C#**

```csharp
private TimeSpan? start;
private float fade;                  // 0..1 — OnPaint මගින් කියවයි

public void StartFade ()
{
    start = null;
    RequestAnimationFrame (OnFrame);
}

private void OnFrame (TimeSpan timestamp)
{
    start ??= timestamp;
    var progress = Math.Min (1, (timestamp - start.Value).TotalSeconds / 0.4);

    fade = (float) progress;
    Invalidate ();

    if (progress < 1)
        RequestAnimationFrame (OnFrame);   // *ඊළඟ* frame එකේදී ඉටු වේ, කිසිදා මෙම frame එකේදී නොවේ
}
```

**VB.NET**

```vb
Private start As TimeSpan?
Private fade As Single               ' 0..1 — OnPaint මගින් කියවයි

Public Sub StartFade()
    start = Nothing
    RequestAnimationFrame(AddressOf OnFrame)
End Sub

Private Sub OnFrame(timestamp As TimeSpan)
    If Not start.HasValue Then start = timestamp
    Dim progress = Math.Min(1, (timestamp - start.Value).TotalSeconds / 0.4)

    fade = CSng(progress)
    Invalidate()

    If progress < 1 Then
        RequestAnimationFrame(AddressOf OnFrame)   ' *ඊළඟ* frame එකේදී ඉටු වේ, කිසිදා මෙම frame එකේදී නොවේ
    End If
End Sub
```

Headless backend එක මත ඔබ ඔරලෝසුව පියවර කරන තුරු කිසිවක් ධාවනය නොවේ, එය සජීවීකරණයක් නිශ්චිත
assertion එකක් බවට පත් කරයි: `HeadlessRenderer.AnimationClock.Reset ()`, ඔබගේ frames ඉල්ලන්න, ඉන්පසු
`HeadlessRenderer.AnimationClock.Step (10)` 1/60 s හි frames දහයක් ධාවනය කරන අතර ඔබගේ callback එක හරියටම
timestamps දහයක් දැක ඇත. `Majorsilence.Forms.Animation` පැකේජය එම frame ඉල්ලීමම මත `Tween<T>`, `Easing`
සහ `control.Animate (…)` ස්තර කරයි, සහ පරිශීලකයා අඩු චලනයක් ඉල්ලා ඇති විට `SystemInformation.PrefersReducedMotion`
ඔබට කියයි — එය උපදේශාත්මක පමණි, එබැවින් සජීවීකරණයක් *ආරම්භ කරන* ස්ථානයේදී එය පරීක්ෂා කිරීම ඔබගේ
වගකීමයි. විස්තර [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md) හි ඇත.

ඔබ Skia-ස්වදේශීය වන විට එක් උගුලක්: **අමු `SKFont`/`DrawText` කිසිදු font fallback එකක් නොකරයි.**
රාමුවේම පෙළ විදැහුම්කරණය fallback දාමයක් හරහා අතුරුදහන් glyphs විසඳයි, නමුත් හිස් `SKTypeface.Default`
එකක් එසේ නොකරයි — එම typeface එකේ නැති glyph එකක් (ඊතලයක්, emoji එකක්, CJK) අඩංගු string එකක් ඇන්දොත්
ඔබට නිහඬවම missing-glyph කොටුව ලැබේ. පරිශීලකයාට පෙනෙන පෙළ සඳහා `e.Graphics.DrawString` භාවිත කරන්න,
නැතහොත් ඔබගේ typeface එක පැහැදිලිව තෝරන්න.

Skia හට සැබවින්ම GDI+ අනුගමනය කළ නොහැකි තැන්වල, matrix එක මවා පෑමක් නොකර එය පවසයි: අභිරුචි line
cap එකක් සහිත `Pen` එකක් එම cap එකේ ප්‍රකාශිත `BaseCap` භාවිතයෙන් stroke කරයි (`SKPaint` ලබා දෙන්නේ
butt/round/square පමණි), `Pen.Alignment` ගබඩා කරන නමුත් යෙදෙන්නේ නැත, සහ නූතන SkiaSharp හි indexed
bitmap වර්ගයක් නොමැති නිසා `Image.Palette` පැවරීම නැවත quantize නොකරයි — සෑම මතුපිටක්ම 32bpp වේ.

**අභ්‍යාසය 4.** ඔබ සතු GDI+ කේත කොටසක් — thumbnail ජනකයක්, ප්‍රස්තාරයක්, watermark එකක් — UI නොමැති
console යෙදුමක `Majorsilence.Forms.Drawing` වෙත port කරන්න. ඉන්පසු අභිරුචි ලෙස අඳින පාලකයක් ගෙන
`e.Canvas` හරහා Skia-ස්වදේශීය ස්පර්ශයක් (gradient එකක්, blur එකක්, වටකුරු clip එකක්) එක් කරන්න.

---

## Module 5 — ඔබගේ WinForms යෙදුම සංක්‍රමණය කිරීම
{:#module-5}

**ප්‍රතිඵලය:** ඔබට ඔබගේ solution එක මත `majorsilence-migrate` ධාවනය කර, එහි වාර්තාව කියවා, ඉන් පසුව
එන අතින් නිවැරදි කිරීමේ පිරික්සුම් ලැයිස්තුව (checklist) හරහා වැඩ කළ හැකිය.

### ස්ථාපනය
{:#module-5-install}

```
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help
```

repo එකකට වෙන් වූ ස්ථාපනයකට (`dotnet new tool-manifest`, ඉන්පසු
`dotnet tool install Majorsilence.Forms.Migrator`, `dotnet majorsilence-migrate` ලෙස ධාවනය කරයි) මනාප
දක්වන්න, එවිට මුළු කණ්ඩායමම එකම අනුවාදය ධාවනය කරයි. **tool පැකේජය නිකුත් කරන එකම ආකාරයයි** — නිකුතු
කලින් වේදිකාවකට එක් ස්වයං-අන්තර්ගත තනි-ගොනු binary එකක් අමුණා ඇති නමුත් තවදුරටත් එසේ නොකරයි. එයට
යන්ත්‍රයේ .NET runtime එකක් අවශ්‍ය වේ (ඔබ සතු ඕනෑම නවතම ප්‍රධාන අනුවාදයකට එය ඉදිරියට යයි), සහ ඔබට
කිසිවක් ස්ථාපනය නොකිරීමට අවශ්‍ය නම්, clone එකක සිට
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>` මගින් එය ධාවනය කරන්න.

### ඔබගේ මූලාශ්‍ර කේතයේ සංක්‍රමණය පෙනෙන්නේ කෙසේද
{:#module-5-beforeafter}

වෙන කිසිවකට පෙර, වෙනසේ ප්‍රමාණය බලන්න. මෙය සාමාන්‍ය පෝරමයක ශීර්ෂය, පෙර සහ පසු:

**C# — පෙර**

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

**C# — පසු**

```csharp
using System;
using System.Drawing;                                        // රඳවා ගන්නා ලදී: Color, Point, Size, Rectangle
using Majorsilence.Forms;                                    // කලින් System.Windows.Forms විය
using Majorsilence.Forms.Drawing;                            // Bitmap සඳහා
using SystemColors = Majorsilence.Forms.SystemColors;         // එක් කරන ලදී: CS0104 විසඳයි

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();                          // ඔබගේ Designer ගොනුව ස්පර්ශ නොවේ
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**VB.NET — පෙර**

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

**VB.NET — පසු**

```vb
Imports System.Drawing                                        ' රඳවා ගන්නා ලදී: Color, Point, Size, Rectangle
Imports Majorsilence.Forms                                    ' කලින් System.Windows.Forms විය
Imports Majorsilence.Forms.Drawing                            ' Bitmap සඳහා
Imports SystemColors = Majorsilence.Forms.SystemColors         ' එක් කරන ලදී: අපැහැදිලිතාව විසඳයි

Public Class CustomerForm
    Inherits Form

    ' MyType=Empty කලින් සැපයූ ව්‍යංග්‍ය පරාමිති-රහිත constructor එකද migrator එක නැවත ඇතුළු කරයි,
    ' මෙම පෝරමයේ Designer partial එක පිළිබඳ දැනුම භාවිතයෙන්, එය අනුපිටපත් නොවන ලෙස.
    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

එහි සම්පූර්ණ හැඩය එයයි: imports වෙනස් වේ, `Handles` වගන්ති සහ designer කේතය නොනැසී පවතී, සහ ඔබගේ
ව්‍යාපාරික තර්කනය (business logic) ස්පර්ශ නොවේ.

### මෙවලම සමඟ වාද කිරීමට පෙර එය කුමක්දැයි දැන ගන්න
{:#module-5-design}

`majorsilence-migrate` යනු හිතාමතාම බහු-අවධි **පාඨමය/regex නැවත ලියන්නෙකි** (rewriter). එය syntax
tree එකක් parse කිරීම හෝ symbols විසඳීම නොකරයි, සහ අරමුණ එයයි:

- **එය කැඩුණු කේතය මත ක්‍රියා කරයි.** අඩක් සංක්‍රමණය කළ solution එකක්, port නොකළ වර්ගයක් යොමු කරන
  `.vb` එකක්, අතුරුදහන් යොමුවක් සහිත ව්‍යාපෘතියක් — මේ කිසිවක් rewriter එක නතර නොකරයි, මන්ද එයට කේතය
  compile වීමට හෝ parse වීමටවත් කිසිදා අවශ්‍ය නොවන බැවිනි. Roslyn මෙවලමක් ව්‍යාපෘතියක් build වන තුරු
  එය ස්පර්ශ කිරීම ප්‍රතික්ෂේප කරනු ඇත, එය පැරණි කේත පදනමක් මත *පළමු අවධියක* අරමුණම පරාජය කරයි.
- **එය වේගවත්ය** — තත්පර කිහිපයකින් ගොනු දහස් ගණනක්.
- **එය අත්හරින දේ:** සැබෑ හරස්-ව්‍යාපෘති symbol විසඳීම. හිස් `Panel` එකක් `System.Windows.Forms.Panel`
  ද නැතහොත් `Panel` නමින් ඔබගේම class එකක්ද යන්න එයට කිව නොහැක; එය namespace-උපසර්ග රටා සහ import
  සන්දර්භය මත රඳා පවතී. එය හඳුනා නොගන්නා සෑම namespace එකක්ම **නිහඬව අනුමාන කරනු වෙනුවට අතින්
  සමාලෝචනය සඳහා සලකුණු කෙරේ**.

හරියටම එම අන්ධ ලක්ෂ්‍යය සඳහා තෝරා ගත හැකි දෙවන engine එකක් *ඇත* — `--engine roslyn`, පාඨමය එක මත
ස්තර කර, සැබෑ symbol විසඳීම භාවිත කරයි:

| | `--engine text` (පෙරනිමි) | `--engine roslyn` |
|---|---|---|
| ආදානය | ඕනෑම `.sln`/`.csproj`/`.vbproj`/නාමාවලියක්/තනි ගොනුවක් | **පූරණය කළ හැකි** ව්‍යාපෘතියක් අවශ්‍යයි; හිස් නාමාවලියක් හෝ තනි ගොනුවක් අනතුරු ඇඟවීමක් සමඟ සම්පූර්ණ ධාවනය සඳහාම text වෙත ආපසු වැටේ |
| compile නොවන කේතය ඉවසයි | ඔව් | නැත |
| වේගය | තත්පර | විශාලත්ව අනුපිළිවෙළ කිහිපයකින් මන්දගාමී (MSBuild ඇගයීම ආධිපත්‍යය දරයි) |
| එකම නමැති වර්ග වෙන්කර හඳුනා ගැනීම | නැත | **ඔව් — එය පවතින්නේ ඒ සඳහාය** |
| අසාර්ථකත්ව හැසිරවීම | N/A | *ව්‍යාපෘතියෙන් ව්‍යාපෘතියට* ආරක්ෂිතව අසාර්ථක වේ (එම ව්‍යාපෘතියේ ගොනු text වෙත ආපසු වැටේ). MSBuild කිසිසේත් සොයා ගත නොහැකි නම්, නිහඬව පහත් කරනු වෙනුවට ධාවනය දැඩි ලෙස අසාර්ථක වේ |

**කණ්ඩායම් නීතිය:** විශාල පැරණි කේත පදනමක් මත පළමු අවධිය සැමවිටම පෙරනිමි `--engine text` භාවිත
කරයි. පසුව, දැන් පූරණය කළ හැකි ප්‍රතිඵලය මත, WinForms/GDI+ වර්ගයක් සමඟ හිස් නමක් බෙදා ගන්නා අභිරුචි
වර්ගයක *තහවුරු කළ* අවස්ථාවක් ඔබට ඇති විට පමණක් `--engine roslyn` භාවිත කරන්න. එය එක් තැනක *අඩු*
අනතුරු ඇඟවීම් නිපදවන බවද සලකන්න — හිස් `using System.Drawing;` එකක් යටතේ ඇති සුදුසුකම් නොලත් GDI+
වර්ග සලකුණු කරනු වෙනුවට එය කෙළින්ම නිවැරදි කරයි. එම අපසරනය පසුබෑමක් (regression) නොවේ.

### නිර්දේශිත පළමු ධාවනය
{:#module-5-firstrun}

```
# පිරිසිදු git branch එකක, පරාසය බැලීමට පළමුව dry-run කරන්න:
majorsilence-migrate MySolution.sln --dry-run --diff

# ඉන්පසු සැබෑ ලෙස ධාවනය කරන්න — පෙර commit එකට එරෙහි diff එක සංක්‍රමණයම වේ:
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

git මගින් ලුහුබඳින branch එකක ස්ථානයේම ධාවනය කිරීම (`--no-backup` සමඟ, මන්ද git *ම* ඔබගේ උපස්ථය බැවින්)
සංක්‍රමණය idempotent සහ diff කළ හැකි කරයි: එය ධාවනය කරන්න, ගොනුවෙන් ගොනුව පරීක්ෂා කරන්න, පසුව තවත්
පැරණි කේත ඇද ගන්නා විට ආරක්ෂිතව නැවත ධාවනය කරන්න.

පළමු දිනයේම දැනගත යුතු විකල්ප:

| විකල්පය | භාවිතය |
|---|---|
| `-o, --output <dir>` | ස්ථානයේම පරිවර්තනය කරනු වෙනුවට දර්පණ ගසකට (mirror tree) ලියන්න |
| `-n, --dry-run`, `--diff` | එයට කැප වීමට පෙර එහි පරාසය බලන්න |
| `--backend <name>` | `avalonia` (පෙරනිමි) \| `uno` \| `headless` — එය යොමු කරන backend පැකේජය |
| `--tfm <tfm>` | TFM එකක් බල කරන්න. පෙරනිමිය: අනුවාදය තබාගෙන, `-windows` උපසර්ගය ඉවත් කරයි |
| `--package-version <v>` | පෙරනිමිය migrator එකේම අනුවාදයයි — මෙවලම සහ පැකේජ එකම නිකුතුවෙන් නිකුත් වේ |
| `--map <file>` | ගොඩනඟා ඇති සහායක් නොමැති vendor කෙනෙකු සඳහා අමතර namespace සිතියම්කරණ (නැවත නැවත දිය හැකිය) |
| `--dual-build` | C# ව්‍යාපෘතියක් සැබෑ WinForms වලටද එරෙහිව build වන ලෙස තබා ගන්න — පහත බලන්න |
| `--strict` | ඕනෑම අතින්-සමාලෝචන අනතුරු ඇඟවීමක් මත ශුන්‍ය-නොවන කේතයකින් පිටවන්න. **මෙය ඔබගේ CI ගේට්ටුවයි.** |
| `--report <file>` / `--no-report` | Markdown වාර්තාව |

ගොඩනඟා ඇති සිතියම්කරණයක් නොමැති vendor කෙනෙකු සඳහා, `--map` ගොනුවක් හුදෙක් JSON වේ:

```json
{
  "namespaces":     { "DevExpress.XtraEditors": "Majorsilence.Forms.DevExpress" },
  "removePackages": [ "DevExpress.Win.*" ]
}
```

### එය සැබවින්ම වෙනස් කරන්නේ කුමක්ද
{:#module-5-changes}

1. **ව්‍යාපෘති ගොනු** — `UseWindowsForms`/`UseWPF` ඉවත් කරයි, `-windows` TFM උපසර්ගය ඉවත් කරයි (import
   කළ `.props`/`.targets` තුළද ඇතුළුව), Windows-desktop රාමු යොමුව ඉවත් කරයි, WinForms-පමණක් NuGet
   පැකේජ ඉවත් කරයි (Telerik, DevExpress, **`System.Drawing.Common`**), සහ `Majorsilence.Forms` + backend
   යොමුවක් එක් කරයි — **එය ස්පර්ශ කරන සෑම ව්‍යාපෘතියකටම**. එම කට්ටලය "WinForms ව්‍යාපෘති" වලට වඩා
   පුළුල්ය: `System.Windows.Forms` කිසිදා සඳහන් නොකරන සරල class library එකකට රූප හෝ font සහායකයක්
   ඇත්නම් එයද නැවත ලියනු ලබන අතර, යොමුව නොමැතිව එයට compile විය නොහැක. නොනැසී පවතින primitives පමණක්
   භාවිත කරන ව්‍යාපෘති සම්පූර්ණයෙන්ම නොසලකා හරිනු ලැබේ.
2. **මූලාශ්‍ර ගොනු** — දිගම-උපසර්ගය-පළමුව වගුවක් හරහා namespace නැවත ලිවීම්, අනුපිටපත් imports
   හකුළනු ලැබේ, අවශ්‍ය තැන `SystemColors`/`ColorTranslator` alias එක නිකුත් කෙරේ, සහ VB සඳහා: ව්‍යංග්‍ය
   constructor එක නැවත ඇතුළු කෙරේ, `My.Resources` accessor එකක් ජනනය කෙරේ, සහ ඉතිරි `My.*` භාවිතය
   පිළිබඳව අනතුරු අඟවයි.
3. **Resx ගොනු** — මාරුවෙන් නොනැසී පැවතිය යුතු රූප/වර්ග යොමු සඳහා පරිලෝකනය කෙරේ.
4. **වාර්තාව** — Markdown සාරාංශයක් (පෙරනිමිය `migration-report.md`).

### වාර්තාව කියවීම
{:#module-5-report}

වැදගත් වන්නේ කොටස් තුනකි:

- **පරිලෝකනය කළ සහ වෙනස් කළ** ගණන් — diff එකේ පරාසය, එක බැල්මකින්.
- **ගොනුවෙන් ගොනුවට වෙනස් කිරීම් ලැයිස්තුව** — සැබවින්ම ස්පර්ශ වූ සියල්ල.
- **අතින් සමාලෝචනය** — හේතුව අනුව කාණ්ඩ කළ සෑම අනතුරු ඇඟවීමක්ම: සහාය නොදක්වන namespaces, හිස්
  `System.Drawing` import එකක් යටතේ ඇති සුදුසුකම් නොලත් GDI+ වර්ග, `My.*` භාවිතය, සහ සම්පූර්ණයෙන්ම මඟ
  හැරුණු ඕනෑම ව්‍යාපෘතියක්. වඩාත් සුලබ මඟ හැරීම **පැරණි SDK-ශෛලීය නොවන `.csproj`/`.vbproj`** එකකි,
  එය ඔබ පළමුව SDK ශෛලියට පරිවර්තනය කළ යුතුය — එය ව්‍යාපෘති-ආකෘති පූර්වාවශ්‍යතාවකි, migrator එක මඟ
  හැරිය දෙයක් නොවේ.

### `--dual-build` සමඟ පියවරෙන් පියවර සංක්‍රමණය (C# පමණි)
{:#module-5-dualbuild}

පෙරනිමියෙන් මෙවලම ව්‍යාපෘතියක් සම්පූර්ණයෙන්ම commit කරයි. ඒ වෙනුවට `--dual-build` මගින් C# ව්‍යාපෘතියකට
එක් MSBuild property එකකින් මාරු කරමින් තාක්ෂණ තොග **දෙකෙන් ඕනෑම එකකට** එරෙහිව build වීමට ඉඩ දෙයි —
එවිට ඔබගේ Windows සංවර්ධකයන්ට තෘප්තිමත් වන තුරු සැබෑ WinForms වලට එරෙහිව දිගටම build කළ හැකිය.
ව්‍යාපෘති ගොනු වෙනත් ආකාරයකින් ස්පර්ශ නොවන අතර, කොන්දේසි සහිත වන්නේ ගොනුවේ ඉහළ ඇති import එක පමණි:

```csharp
#if MAJORSILENCE_FORMS
using Majorsilence.Forms;
#else
using System.Windows.Forms;
#endif
```

repo-root `Directory.Build.props` එකක් සමඟ build එක මාරු කරන්න:

```xml
<Project>
  <PropertyGroup>
    <MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>
  </PropertyGroup>
</Project>
```

අවවාද දෙකක්. එය **හිතාමතාම පටුය**: ගොනු සිරුරක ඇති ඕනෑම *සම්පූර්ණයෙන් සුදුසුකම් ලත්* යොමුවක්
(`System.Windows.Forms.MessageBox.Show(...)`) තවමත් කොන්දේසි විරහිතව නැවත ලියනු ලබන අතර, symbol එක
නිර්වචනය කළ පසුව පමණක් compile වේ.

තවද **VB සමාන දෙයක් නැත**, මෙම කොටසේ VB නිදසුනක් නොමැත්තේ එබැවිනි. `MyType=Empty` මුළු VB "My"
application framework එකම අක්‍රිය කරයි — ව්‍යංග්‍ය constructor, `My.*`, සියල්ල — සහ කිසිදු preprocessor
symbol එකකට එය මාරු කළ නොහැක. `--dual-build` ලබා දුන් VB ව්‍යාපෘතියක් ඒ වෙනුවට සාමාන්‍ය commit කළ
ආකාරයට පරිවර්තනය කෙරේ, ඇයිදැයි පැහැදිලි කරන අනතුරු ඇඟවීමක් සමඟ. **VB කණ්ඩායම් සඳහා, dual-build
කාල පරිච්ඡේදයක් වෙනුවට එකවර මාරුවක් (cut-over) සැලසුම් කරන්න**, සහ පරිවර්තනය කළ එක විශ්වාස කරන
තුරු සංක්‍රමණයට පෙර branch එක ජීවමානව තබා ගන්න.

### අතින් නිවැරදි කිරීමේ පිරික්සුම් ලැයිස්තුව
{:#module-5-checklist}

rewriter එකට මේවා දැකිය නොහැක. diff එක ඇතුළත් වූ පසු ඒවා පැහැදිලිව හසුරුවන්න — "එය compile විය" සහ
"එය නිවැරදිව හැසිරේ" අතර වෙනස ඒවාය.

| # | වෙනස | කළ යුතු දේ |
|---|---|---|
| 1 | **`SplitContainer.Orientation` හි අර්ථය වෙනස් විය** — එය දැන් WinForms හි මෙන් පිරිසැලසුමේ නොව *තීරුවේ* (bar) දිශාවයි. `Vertical` (පෙරනිමි) = පැනල එක ළඟ. | ඔබ එය කිසිදා සකසා නොමැති නම්, කිසිවක් වෙනස් නොවේ. **ඔබ එය සකසා ඇත්නම්, එය ප්‍රතිලෝම කරන්න.** කිසිවක් ඔබට අනතුරු නොඅඟවයි: අගයන් දෙකම පෙර සහ පසු compile වන අතර, පාඨමය අවධියකදී `SplitContainer.Orientation` එකක් වෙනත් ඕනෑම `Orientation` එකකින් වෙන්කර හඳුනා ගැනීමට migrator එකට නොහැක. එය grep කරන්න. `Splitter` සඳහාද එසේමය. |
| 2 | **සිදුවීම් delegate වර්ග දැන් WinForms සමඟ ගැළපේ.** `KeyDown`/`KeyUp` → `KeyEventHandler`; `Mouse*` පවුල → `MouseEventHandler`; `Form.FormClosing` → `FormClosingEventHandler`; `PrintDocument.PrintPage` → `PrintPageEventHandler`; `Control.MouseEnter` සහ menu/tool-strip අයිතමයේ `Click` → සරල `EventHandler`. | Lambdas, `AddressOf` හසුරුවන සහ VB `Handles` වගන්ති දිගටම ක්‍රියා කරයි. C# හි **පැහැදිලිව නිර්මාණය කළ** `new KeyEventHandler<…>`-ශෛලීය wrappers (`new EventHandler<KeyEventArgs>(…)`) තවදුරටත් පරිවර්තනය නොවේ — wrapper එක ඉවත් කරන්න හෝ WinForms delegate එක නම් කරන්න. |
| 3 | **`Click` සහ `MouseEnter` තවදුරටත් මූසික ඛණ්ඩාංක රැගෙන නොයයි** — මන්ද WinForms හි ඒවා කිසිදා එසේ නොකළ බැවිනි. | `Click` වෙතින් `e.X`/`e.Button` කියවන හසුරුවනයක් `MouseClick` වෙත ගෙන යයි. menu අයිතමයක් මත (WinForms හිද මූසික-වර්ගයේ ප්‍රභේදයක් නැත), ස්ථානය හිමිකාර පාලකයෙන් ගන්න. C# හි, පැරණි `OnMouseEnter(MouseEventArgs)` override කිරීම CS0115 සමඟ අසාර්ථක වේ; VB හි සමාන `Overrides` නව අත්සනට (signature) එරෙහිව compile වීමට අසමත් වේ — දෙකම ශබ්ද නඟයි, ඔබට අවශ්‍ය එයයි. |
| 4 | **`TreeViewDrawMode.OwnerDrawContent` නැවත නම් කරන ලදී** WinForms හි `OwnerDrawText` ලෙස, සහ `OwnerDrawAll` දැන් පවතී. | කිසිවක් නොකැඩේ — පැරණි නම එකම අගය සහිත `[Obsolete]` alias එකකි — නමුත් එය ඉවත් කරනු ඇත. දැන්ම නැවත නම් කරන්න. `OwnerDrawText` පසුබිම්/focus ඇඳීමෙන් පසු `DrawNode` මතු කරයි; `OwnerDrawAll` කිසිවක් ඇඳීමට පෙර එය මතු කරයි. |
| 5 | **`DataGridViewDataErrorContexts` සාමාජිකයන් දෙදෙනෙකු ඉවත් කරන ලදී** (`RowDirtyStateNeeded`, `CleanupExceptionHandling`) — දෙකම WinForms සාමාජිකයන් නොවේ. | එම අගයන්හි දැන් පවතින සැබෑ ඒවා සමඟ ප්‍රතිස්ථාපනය කරන්න: `RowDeletion`, `ClipboardContent`. |
| 6 | **ප්‍රබල-වර්ගීකෘත (strongly-typed) සම්පත් designers.** ජනනය කළ `Resources.Designer.cs`/`.vb` එකක් `ResourceManager.GetObject(...)` ඇඳීම් වර්ගයකට cast කරයි; සැබෑ `System.Resources.ResourceManager` එකක් compile කළ `.resources` නම් කරන ඕනෑම දෙයක් ආපසු ලබා දෙයි, එබැවින් පිරිසිදුව compile වී තිබියදීත්, පළමු සම්පත් කියවීමේදී runtime එකේදී cast එක `InvalidCastException` විසි කරයි. | builder එකේම `GeneratedCodeAttribute` මත පදනම්ව migrator එක මෙය ඔබ වෙනුවෙන් හසුරුවයි: එම ගොනු වල පමණක්, `ResourceManager` එක `Majorsilence.Forms.ComponentResourceManager` බවට පත් වේ, එය එකම `.resources` කියවන නමුත් graphics ඇතුළත් කිරීම් සාමාන්‍යකරණය කරයි. අතින් ලියූ string සෙවීම් BCL වර්ගය තබා ගනී. **ඔබගේ සම්පත්-බර පෝරම කලින්ම සත්‍යාපනය කරන්න.** |
| 7 | **VB `My.*` අර්ධ වශයෙන් ක්‍රියාත්මක කර ඇත්තේ API එක අනුව නොව සාක්ෂි අනුවය.** විශාල සැබෑ VB කේත පදනමක ශක්‍යතා විගණනයකින් අතින් ලියූ කේතය ස්පර්ශ කරන්නේ කොටස් තුනක් පමණක් බව සොයා ගත් නිසා, හරියටම එම තුන සැබෑය: `My.Application.Info.*` (`Title`, සැබෑ `Version` එකක් ලෙස `Version`, `Copyright`, `CompanyName`, …), `My.Resources.*` (ජනනය කළ accessor module එකක්) සහ `My.Computer.Name`. | අනෙක් සියල්ල නිහඬව නැවත ලියනු වෙනුවට තවමත් අනතුරු අඟවයි: `My.Forms`, `My.Settings`, `My.User`, `My.Application.Log`/`Startup`/`Shutdown`/`UnhandledException`, splash screens, `My.Computer.Registry`/`Clipboard`/`Info` — ජනනය කළ `Settings.Designer.vb` boilerplate වලින් පිටත ඒවායින් කිසිවක අතින් ලියූ භාවිතයක් විගණනයෙන් සොයා නොගත් අතර, ඒවායින් කිහිපයකට ගෙන යා හැකි සමාන දෙයක් නැත. පහත porting රටා සහ MIGRATION.md හි "Still not implemented, and why" බලන්න. තවද සලකන්න: `ResXFileRef` ලෙස ගබඩා කළ resx ඇතුළත් කිරීම් (inline දත්ත වෙනුවට සම්බන්ධිත ගොනුව) compile වන නමුත් runtime එකේදී `null` වෙත විසඳේ. |
| 8 | **ගැළපුම් ඉලක්කයක් නොමැති Telerik උප-namespaces** — `Telerik.WinControls.Themes`, `.Design`, `.Primitives`, `.Layouts` — අනතුරු අඟවා එලෙසම තබයි. | භාවිතයෙන් භාවිතයට තීරණය කරන්න: තේමාකරණය ඉවත් කරන්න, හෝ නැවත ක්‍රියාත්මක කරන්න. එසේම: `RadScheduler` හි මාස/සති/දින **දින දර්ශන grid UI** එක හිතාමතාම විෂය පථයෙන් පිටත ඇත (දත්ත ස්තරය, සංචාලනය සහ agenda දර්ශනය සැබෑය), එබැවින් grid එක භාවිත කරන කේතය agenda දර්ශනයට එරෙහිව නැවත ලිවිය යුතුය. |

**VB `My.*` මතුපිට port කිරීම.** ක්‍රියාත්මක කළ කොටස් තුනට කිසිදු වැඩක් අවශ්‍ය නැත:

```vb
' සංක්‍රමණයෙන් පසුවද මේවා දිගටම ක්‍රියා කරයි:
Dim title = My.Application.Info.Title
Dim ver As Version = My.Application.Info.Version      ' සැබෑ Version එකක්, String එකක් නොවේ
logo.Image = My.Resources.CompanyLogo                 ' ජනනය කළ accessor module එක
Dim machine = My.Computer.Name
```

බොහෝ කේත පදනම් මුහුණ දෙන්නේ `My.Forms` ටය. ව්‍යංග්‍ය singleton එක පැහැදිලි instance එකකින් ප්‍රතිස්ථාපනය
කරන්න:

```vb
' පෙර — My.Forms ඔබට සෑම පෝරම වර්ගයකටම කම්මැලි ලෙස (lazily) නිර්මාණය කළ singleton එකක් ලබා දුන්නේය:
My.Forms.CustomerForm.Show()

' පසු — instance එක ඔබ විසින්ම තබා ගන්න (හෝ ඔබගේ DI container එකෙන් එය විසඳන්න):
Private customerForm As CustomerForm

Private Sub ShowCustomers()
    If customerForm Is Nothing OrElse customerForm.IsDisposed Then
        customerForm = New CustomerForm()
    End If
    customerForm.Show()
End Sub
```

තවද `My.Settings` ඔබ .NET හි වෙනත් තැන්වල දැනටමත් භාවිත කරන ඕනෑම වින්‍යාසයක් බවට පත් වේ —
`Microsoft.Extensions.Configuration`, JSON ගොනුවක්, හෝ ඔබගේම settings class එකක්:

```vb
' පෙර:  Dim url = My.Settings.ApiBaseUrl
' පසු:
Dim url = AppSettings.Current.ApiBaseUrl
```

### ඔබට imports කිසිසේත් නැවත ලිවිය නොහැකි විට
{:#module-5-compat}

migrator එකට සේවය කළ නොහැකි එක් තත්ත්වයක්: **පොදු API එක `System.Windows.Forms` වෙත වර්ගීකරණය කර ඇති
බෙදා හරින ලද පාලක library එකක්** — එහි පාරිභෝගිකයන් එයට සැබෑ WinForms වර්ග ලබා දෙයි, එබැවින් එහි
`using`s නැවත ලිවීම ඔවුන්ව බිඳ දමයි. එම අවස්ථාව සඳහා සංකල්ප-සාධන (proof-of-concept) source generator එකක්
ඇත, [`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/tree/main/src/Majorsilence.Forms.WinFormsShims.Compat),
එය Majorsilence.Forms මගින් *පිටුබලය ලබන* `System.Windows.Forms` සහ `System.Drawing` namespaces නිකුත්
කරයි, එවිට **වෙනස් නොකළ** WinForms මූලාශ්‍ර කේතය — Designer ගොනු ඇතුළුව — කිසිදු සැබෑ WinForms assembly
එකක් සම්බන්ධ නොවී රාමුවට එරෙහිව compile වේ. [`WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo)
නිදසුන එය ක්‍රියා කරන ආකාරය පෙන්වන අතර එහි `RESULTS.md` ක්‍රියා කළ සහ නොකළ දේ වාර්තා කරයි. එය රඳා
පැවතිය යුතු සැලැස්මක් ලෙස නොව ඇගයීමට ලක් කළ යුතු අත්හදා බැලීමක් ලෙස සලකන්න; නිකුත් කරන මාර්ගය
migrator එකයි.

**බිඳ දමන වෙනස්කම් (breaking changes) ජීවත් වන්නේ කොතැනද.** ඉහත පිරික්සුම් ලැයිස්තුවේ සෑම අයිතමයක්ම
පැමිණියේ [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) හි "Breaking change" සහ
"Renamed to match WinForms" කොටස් වලිනි, නව එකක් පළමුව දිස් වන්නේද එහිය. පළමු සංක්‍රමණයේදී පමණක් නොව,
සෑම upgrade කිරීමකදීම එම කොටස් කියවන්න — [module 10](#module-10-versioning) ගැන වන්නේ එම පුරුද්දයි.

**අභ්‍යාසය 5.** සැබෑ අභ්‍යන්තර යෙදුමක් මත migrator එක ධාවනය කරන්න — වඩාත් සුදුසු වන්නේ මෙම කාර්තුවේ
කිසිවෙකු රඳා නොපවතින එකකි — පළමුව `--dry-run --diff` සමඟ. ඉන්පසු branch එකක සැබෑ ලෙස එය ධාවනය කර,
එය build වන තත්ත්වයට පත් කර, ඉහත පිරික්සුම් ලැයිස්තුව අයිතමයෙන් අයිතමයට හසුරුවන්න. එය දිනකට සීමා
කරන්න; ඉලක්කය නිම කළ port එකක් නොව, ඔබගේ ඉතිරි කළඹ (portfolio) සඳහා ක්‍රමාංකනය කළ ඇස්තමේන්තුවකි.

---

## Module 6 — ඔබගේ ඉලක්ක තෝරා ගැනීම
{:#module-6}

**ප්‍රතිඵලය:** එක් එක් ඉලක්කය සඳහා නිවැරදි backend පැකේජය තෝරා ගැනීමට ඔබට හැකි වේ, එමෙන්ම එක් එක් ඉලක්කයේ සැබවින්ම නොමැති දේ ප්‍රමාද වී සොයා ගැනීම වෙනුවට කලින්ම දැනගනී.

ඔබගේ ඉලක්ක කට්ටලය යනු පැකේජ තේරීමකි:

| මෙය reference කරන්න | ඉලක්කය | සටහන් |
|---|---|---|
| `Majorsilence.Forms.Avalonia` | **පෙරනිමිය.** Windows/macOS/Linux desktop — ඊට අමතරව Browser/WASM (සැමවිටම build වේ), Android සහ iOS (opt-in, workloads අවශ්‍යයි) Avalonia-ගේම වේදිකා පැකේජ හරහා | reference කළ විට ස්වයංක්‍රීයව තෝරා ගැනේ. කවුළු ධාරකය (window host) *සැබෑ* native කවුළුවක් වන බහු-වේදිකා backend එක මෙයයි, එබැවින් එය සැබෑ වේදිකා handle එකක් ලබා දෙන අතර ධාරක යෙදුමකට OS මට්ටමේ modal අර්ථකථනය ලබා දෙයි. WebView2/WKWebView/WebKitGTK හරහා WebView |
| `Majorsilence.Forms.Uno` | Desktop සහ Uno stack හරහා iOS/Android/WebAssembly | `SKXamlCanvas` හරහා ඉදිරිපත් කරයි; Uno app head එකක් අවශ්‍යයි. owner සංකල්පයක් නැත — modality සඳහා `Form.ShowDialog(parent)` භාවිත කරන්න |
| `Majorsilence.Forms.Gtk4` | මූලිකව Linux — එක් පෝරමයකට එක් සැබෑ `Gtk.Window` එකක්; GTK 4 runtime ස්ථාපනය කර ඇති Windows/macOS මතද | පැහැදිලිව තෝරා ගත යුතුය. කාවැද්දීමේ දිශා දෙකම, **airspace ගැටලුවක් නොමැති** `NativeControlHost`, WebKitGTK 6.0 හරහා `WebBrowser`. දන්නා සීමා: තිර-ස්ථාන පාලනයක් නැත (GTK 4 එය ඉවත් කළ නිසා `Location` යනු ඉඟියක් පමණි), `SetIcon(byte[])` no-op (කිසිවක් නොකරයි), ගොනු තෝරන්නන් framework-ගේම සංවාද කවුළු වෙත යොමු වේ, පූර්ණ සංඛ්‍යා පරිමාණ සාධක පමණි |
| `Majorsilence.Forms.Terminal` | console එකක් — phone එකක මෙන්, title bar නොමැතිව පෝරමය terminal එක පුරා පිරී යයි | terminal එකට ඇති තැන්වල සැබෑ පික්සල විභේදනයෙන් Kitty graphics හෝ Sixel, නැතිනම් Unicode block glyphs; mouse සහ keyboard; Ctrl+C සැමවිටම පිටවෙයි. xterm සහ WezTerm මත තහවුරු කර ඇත. native pickers, `NativeControlHost` හෝ webview නැත |
| `Majorsilence.Forms.WinForms` | **Windows පමණි** — Win32 pump මත සැබෑ `System.Windows.Forms` කවුළු | *සංක්‍රමණ* backend එකකි ([module 7](#module-7-c)): Majorsilence පාලක WinForms යෙදුමකට එකින් එක කාවද්දන්න. `net48` ද ඉලක්ක කරයි. සැබෑ `HWND`. gestures නැත, webview නැත |
| `Majorsilence.Forms.Wpf` | **Windows පමණි** — `Dispatcher` loop මත සැබෑ WPF `Window` එකක් | WinForms backend එකට සමාන හැඩය සහ අරමුණ: `ToWpfElement()`, `ToWpfWindow()`. `net48`, `net8.0-windows`, `net10.0-windows` |
| `Majorsilence.Forms.Headless` | පරීක්ෂණ, CI, servers, pixel-diff | display එකක් අවශ්‍ය නැත. ඔබගේ පරීක්ෂණ ක්‍රමය මෙයයි ([module 8](#module-8)). අතින් පාලනය කරන animation clock |

තමන්ම ස්ථාපනය වන එකම backend එක Avalonia ය. අනෙක් ඒවා එක් පේළියකි, පළමු පෝරමය සෑදීමට පෙර තැබිය යුතුය ([module 2](#module-2-code)හි අනුපිළිවෙළ සීමාව):

**C#**

```csharp
// GTK 4 — සහායක ක්‍රමයක් ඇත
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();

// Terminal — එලෙසම
Majorsilence.Forms.Terminal.TerminalApplication.Use ();

// WinForms, WPF, Headless — backend එක සෘජුවම පවරන්න
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.WinForms.WinFormsPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Majorsilence.Forms.Application.Run (new MainForm ());   // ඔබ තෝරාගත් පේළියෙන් පසුව
```

**VB.NET**

```vb
' GTK 4 — සහායක ක්‍රමයක් ඇත
Majorsilence.Forms.Gtk4.Gtk4Application.Use()

' Terminal — එලෙසම
Majorsilence.Forms.Terminal.TerminalApplication.Use()

' WinForms, WPF, Headless — backend එක සෘජුවම පවරන්න
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.WinForms.WinFormsPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Wpf.WpfPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Majorsilence.Forms.Application.Run(New MainForm())      ' ඔබ තෝරාගත් පේළියෙන් පසුව
```

(ඇත්තෙන්ම එකක් පමණක් තෝරන්න — මෙම කොටසේ පෙන්වන්නේ එම පේළියේ සියලු ආකාරයන්ය.) GTK 4 backend එකට යන්ත්‍රයේ native පුස්තකාලද අවශ්‍යයි: Debian/Ubuntu මත `libgtk-4-1`, Fedora/Arch මත `gtk4`, macOS මත `brew install gtk4`, ඊට අමතරව ඔබ `WebBrowser` භාවිත කරන්නේ නම් WebKitGTK 6.0.

Avalonia මත desktop යනු පරිණත මාර්ගයයි. පහත සියල්ල නව ඉලක්ක ගැන සහ එක් එක් ඒවායේ අවංක තත්ත්වය ගැනය.

### තනි-දර්ශන වේදිකා: browser, Android, iOS
{:#module-6-singleview}

මෙම තුනෙන් කිසිවකට OS window manager එකක් නැත — එක් එක් ඒවා යෙදුමකට/tab එකකට/තිරයකට කාවැද්දිය හැකි දර්ශනයක් (view) එකක් පමණක් ලබා දෙයි. ඒවා **සෑම** කවුළුවක්ම canvas එකක් වන එකම ධාරකයක් බෙදා ගනී: popup නොවන පළමු කවුළුව viewport එක පුරා පිරෙයි; අනෙක් සියල්ල — ComboBox dropdowns, menus, අමතර top-level පෝරම — එහි නිරපේක්ෂ ලෙස ස්ථානගත කළ child එකකි.

ආරම්භය ධාරකය විසින් මෙහෙයවනු ලැබේ, එබැවින් සෑම වේදිකාවකටම **factory** එකක් ගන්නා තමන්ගේම entry point එකක් ඇත (backend එක ආරම්භ වන තුරු පෝරමය නොපැවතිය යුතුය), සහ ඒ කිසිවක් block නොකරයි:

**C#**

```csharp
// Browser (WASM) — ඔබගේ browser head එකේ Program.cs
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());

// Android — ඔබගේ Activity එකේ OnCreate වෙතින්
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());

// iOS — FinishedLaunching වෙතින්
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());
```

**VB.NET**

```vb
' Browser (WASM). VB-ට async entry point එකක් නැත, සහ RunBrowserAsync block නොකරයි —
' tab එකේම event loop එක UI එක මෙහෙයවයි — එබැවින් එය ආරම්භ කර return කරන්න.
Module Program
    Sub Main()
        Dim starting = Majorsilence.Forms.Application.RunBrowserAsync(Function() New MainForm())
    End Sub
End Module

' Android — ඔබගේ Activity එකේ OnCreate වෙතින්
Majorsilence.Forms.Application.RunAndroid(Function() New MainForm())

' iOS — FinishedLaunching වෙතින්
Majorsilence.Forms.Application.RunIOS(Function() New MainForm())
```

argument එකේ හැඩය සලකන්න: instance එකක් නොව **factory** එකක් (`Function() New MainForm()`). `New MainForm()` සෘජුවම ලබා දුනහොත් backend එක පැවතීමට පෙර පෝරමය සෑදෙනු ඇත.

**එහි ක්‍රියා නොකරන දේ** — window manager එකක් නොමැති වීමට ආවේණික දේ මිස, ඉදිරියේදී කිරීමට ඇති වැඩ නොවේ:

- **කවුළු chrome නැත.** `Title`, `Topmost`, `SetSystemDecorations`, `SetIcon`, අවම/උපරිම ප්‍රමාණය, `CanResize`, `ShowInTaskbar` සහ `WindowState` no-ops වේ; `WindowState` සැමවිටම `Normal` ලෙස කියවේ.
- **සංවාද කවුළු OS-modal නොවේ**, මන්ද modal කවුළු සංකල්පයක් නැති බැවිනි — සංවාද කවුළුවක් යනු ප්‍රධාන දර්ශනයේ child එකකි, parent එක අක්‍රිය කිරීමේ අර්ථකථනය ඇතුළුව. තවද **block කරන ඇමතුම් කිසිසේත් ක්‍රියා නොකරයි**: ඊළඟ කොටස බලන්න.
- **WebView නැත**, එබැවින් එකක් අවශ්‍ය ගැළපුම් පාලක (`RadPdfViewer`, `RadRichTextEditor`) ඒවායේ සරල-viewer/`RichTextBox` මාර්ග වෙත යොමු වේ.
- **කවුළු අක්‍රිය වීම හරහා පිටත-click මගින් popup වසා දැමීම ක්‍රියාත්මක නොවේ.** යෙදුම *ඇතුළත* වෙනත් තැනක click කිරීමෙන් තවමත් popups වැසේ; හසුරුවා නොගන්නේ යෙදුමෙන් සම්පූර්ණයෙන්ම පිටත දෙයකට focus අහිමි වීම පමණි.

### async-සංවාද නීතිය
{:#module-6-async}

මෙම module එකේ ඔබ කේතය *ලියන* ආකාරය වෙනස් කරන එකම නීතිය මෙයයි, එබැවින් එයට තමන්ගේම මාතෘකාවක් ලැබේ. browser එකේදී .NET ක්‍රියාත්මක වන්නේ පිටුවේ තනි JavaScript thread එක මතය, සහ return නොවන ඇමතුමක් එය return වීමට ඉඩ දෙන ආදානය, timers සහ painting නවත්වයි. Android සහ iOS මත, Avalonia-ගේ dispatcher-ට nested frame එකක් push කළ නොහැක. එබැවින් පේළි තුනෙහිම Avalonia backend එක `CanRunModalLoop = false` වාර්තා කරයි, සහ block කරන සෑම modal ඇමතුමක්ම — `Form.ShowDialog`, `MessageBox.Show`, ගොනු තෝරන්නන්ගේ `ShowDialog`, `TaskDialog.ShowDialog`, `VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show` — **කිසිවක් පෙන්වීමට පෙර, එහි async නිවුන් ක්‍රමය නම් කරමින්** `PlatformNotSupportedException` විසි කරයි. (Android 15 emulator එකක සහ iPhone 17 Pro simulator එකක මනින ලදී; `docs/backends.md` හි සටහන් කර ඇත.)

async ආකාර desktop ඇතුළුව සෑම backend එකකම ක්‍රියා කරයි, එබැවින් බෙදාගත් UI පුස්තකාලයක් ඒවා එක් වරක් ලියයි:

**C#**

```csharp
// පෙර — desktop පමණි
private void OkButton_Click (object? sender, EventArgs e)
{
    if (string.IsNullOrWhiteSpace (nameBox.Text)) {
        MessageBox.Show ("Please enter a name.", "Greeter");
        return;
    }
    using var confirm = new ConfirmForm ();
    if (confirm.ShowDialog (this) == DialogResult.OK)
        Save ();
}

// පසු — සෑම තැනකම ක්‍රියා කරයි. async void handler එකක් සම්මත රටාවයි; ප්‍රතිඵලය තවමත් DialogResult එකකි.
private async void OkButton_Click (object? sender, EventArgs e)
{
    if (string.IsNullOrWhiteSpace (nameBox.Text)) {
        await MessageBox.ShowAsync ("Please enter a name.", "Greeter");
        return;
    }
    using var confirm = new ConfirmForm ();
    if (await confirm.ShowDialogAsync (this) == DialogResult.OK)
        Save ();
}
```

**VB.NET**

```vb
' පෙර — desktop පමණි
Private Sub OkButton_Click(sender As Object, e As EventArgs)
    If String.IsNullOrWhiteSpace(nameBox.Text) Then
        MessageBox.Show("Please enter a name.", "Greeter")
        Return
    End If
    Using confirm As New ConfirmForm()
        If confirm.ShowDialog(Me) = DialogResult.OK Then Save()
    End Using
End Sub

' පසු — සෑම තැනකම ක්‍රියා කරයි. Async Sub ... Await යනු VB-හි event-handler රටාවයි.
Private Async Sub OkButton_Click(sender As Object, e As EventArgs)
    If String.IsNullOrWhiteSpace(nameBox.Text) Then
        Await MessageBox.ShowAsync("Please enter a name.", "Greeter")
        Return
    End If
    Using confirm As New ConfirmForm()
        If Await confirm.ShowDialogAsync(Me) = DialogResult.OK Then Save()
    End Using
End Sub
```

UI thread එක block කරන අනෙක් සියල්ලටද — `.Result`, `.Wait()`, `GetAwaiter().GetResult()` සහ `Thread.Sleep` — මෙම නීතියම අදාළ වේ, එබැවින් ඒ වෙනුවට task එක `await` කර `await Task.Delay (n)` භාවිත කරන්න.

**මේවා අතින් සොයා ගැනීමට ඔබට අවශ්‍ය නැත.** මූලික `Majorsilence.Forms` පැකේජය Roslyn analyzer එකක් රැගෙන එයි — `MFB001` (block කරන modal ඇමතුම, එහි await කළ හැකි නිවුන් ක්‍රමය නම් කරමින්), `MFB002` (task එකක් මත synchronous රැඳී සිටීම) සහ `MFB003` (`Thread.Sleep`) — වැඩසටහනේ හැඩය රැකෙන තැන්වල (`async` method එකක් ඇතුළත, හෝ එය `async` ලෙස සලකුණු කරන `void` event handler එකක) handler එකක් await කළ ආකාරයට නැවත ලියන code fixes සමඟ. desktop-පමණක් කේතයේදී එය නිහඬව පවතින අතර `net*-browser` ඉලක්කයක් සඳහා ක්‍රියාත්මක වේ. browser head එකක් reference කරන **බෙදාගත් UI පුස්තකාලයක්** ආවරණය කිරීමට, එම පුස්තකාලය අසල opt in කරන්න:

```ini
# බෙදාගත් UI ව්‍යාපෘතිය අසල .editorconfig (හෝ .globalconfig) ගොනුව
[*.cs]
majorsilence_forms.browser_target = true
```

browser හෝ phone head එකක් roadmap එකේ ඇති ඕනෑම ව්‍යාපෘතියක පළමු දිනයේම එම opt-in කරන්න; පසුව handlers පරිවර්තනය කිරීමට වඩා එය බෙහෙවින් ලාභදායීය. එක් අවංක සීමාවක්: analyzer එක අද browser-පමණි, එබැවින් Android හෝ iOS කේතයෙන් පමණක් ළඟා වන block කරන ඇමතුමක් build අවස්ථාවේදී සලකුණු නොවේ — එය ඉහත පණිවිඩය සමඟ run අවස්ථාවේදී අසාර්ථක වේ. (analyzer එක සහ එහි diagnostics C#-පමණක් Roslyn නීති වේ; VB ව්‍යාපෘතියකට runtime exception එක ලැබෙන නමුත් build-time අනතුරු ඇඟවීම නොලැබේ.)

### phone පේළි මත ක්‍රියා කරන දේ
{:#module-6-mobile}

Avalonia Android සහ iOS පේළිවලට, phone යෙදුමකට නැතිව නිකුත් කළ නොහැකි දේවල් එකතු වී ඇත, ඒ සියල්ල පෝරමයේ දෘෂ්ටිකෝණයෙන් ස්වයංක්‍රීයය:

- **තිරය මත keyboard එක** `TextBox` එකකට focus ලැබෙන විට මතු වන අතර blur වන විට ඉවත් වේ; keyboard එක විවෘත වන විට field එක keyboard එකට ඉහළින් scroll කෙරේ. `TextBoxBase.InputKind` (`Number`, `Email`, `Url`, `Phone`) keyboard පිරිසැලසුම තෝරයි — එය කියවනු ලබන්නේ එවිට බැවින්, box එකට focus ලැබීමට පෙර එය සකසන්න. Desktop එය නොසලකයි.
- **Safe-area insets** (status bar, notch, home indicator) `Form.SafeAreaPadding` හරහා පෝරමයේ client පිරිසැලසුමට යොදනු ලැබේ, එබැවින් docked සහ anchored පාලක කේතයක් නොමැතිව ඒවායින් ඈත්ව පවතී.
- **Android back බොත්තම** `WindowBase.BackRequested` මතු කරයි (අවලංගු කළ හැකි event එකක් — විවෘත popup එකකට හෝ sheet එකකට එය මුලින්ම ලැබේ). සැකිල්ල ජනනය කරන `MainActivity` එය දැනටමත් ඉදිරියට යවයි.
- **`Form.SizeClass`** (තාර්කික px 600ට අඩු නම් `Compact`, `Medium`, 840 සිට `Expanded`) සහ `SizeClassChanged` මගින් එක් පෝරමයකට phone පිරිසැලසුමක් සහ tablet පිරිසැලසුමක් අතර මාරු විය හැක.
- `Application.Suspended`/`Resumed`, haptics, තිරය අවදියෙන් තබා ගැනීම, in-process audio.

තවද phone-හැඩැති තිර සඳහා සාදන ලද පාලක හතරක්, සියල්ල මූලික පැකේජයේ ඇති අතර desktop මතද භාවිත කළ හැක: **`StackPanel`** (Majorsilence දිගුවක් — සෑම child එකක්ම තීරු පළලට දිගු කරයි, පුළුල් කවුළුවක තීරුව කියවිය හැකි පළලකට සීමා කරයි), **`Card`** (තේමාවෙන් වර්ණ ගන්වන ලද, රවුම් කළ, දාරයක් සහිත `Panel` එකක්), **`RichListBox`** (පේළි සැකිලිගත බහු-පේළි අයිතම වන `ListBox` එකක්) සහ **`NavigationHost`** (`BackRequested` ගරු කරන title bar එකක් සහ back බොත්තමක් සහිත පිටු stack එකක්). `docs/mobile-layout.md` නිර්දේශ කරන හැඩයෙන් settings තිරයක් (එම ලේඛනයට එරෙහිව පරීක්ෂා කර ඇත, මෙම මාර්ගෝපදේශය සඳහා run කර නැත):

**C#**

```csharp
var column = new StackPanel {
    Dock = DockStyle.Fill, AutoScroll = true,
    MaximumContentWidth = 560, Spacing = 8, Padding = new Padding (8)
};
column.Controls.Add (new Label { Text = "Server address", AutoSize = true });      // තීරුවට අනුව wrap වේ
column.Controls.Add (new TextBox { Name = "serverBox", Height = 48, InputKind = TextInputKind.Url });

var card = new Card { Height = 120 };                                              // රවුම්, තේමාගත
card.Controls.Add (new Label { Text = "Reminders", Dock = DockStyle.Top });
column.Controls.Add (card);

var nav = new NavigationHost { Dock = DockStyle.Fill };                            // පිටු stack + back බොත්තම
Controls.Add (nav);
await nav.PushAsync (column);                                                      // async handler එකකින්
```

**VB.NET**

```vb
Dim column As New StackPanel With {
    .Dock = DockStyle.Fill, .AutoScroll = True,
    .MaximumContentWidth = 560, .Spacing = 8, .Padding = New Padding(8)
}
column.Controls.Add(New Label With {.Text = "Server address", .AutoSize = True})   ' තීරුවට අනුව wrap වේ
column.Controls.Add(New TextBox With {.Name = "serverBox", .Height = 48, .InputKind = TextInputKind.Url})

Dim card As New Card With {.Height = 120}                                           ' රවුම්, තේමාගත
card.Controls.Add(New Label With {.Text = "Reminders", .Dock = DockStyle.Top})
column.Controls.Add(card)

Dim nav As New NavigationHost With {.Dock = DockStyle.Fill}                         ' පිටු stack + back බොත්තම
Controls.Add(nav)
Await nav.PushAsync(column)                                                         ' Async handler එකකින්
```

(`TextInputKind` පවතින්නේ `Majorsilence.Forms.Backends` හි ය.) වට්ටෝරුවේ අනෙක් සියල්ල ඔබ දන්නා WinForms ය — `AutoSize` labels wrap වේ, `FlowLayoutPanel`/`TableLayoutPanel` card එකක් ඇතුළට යයි.

**පරිණතභාවය තියුණු ලෙස වෙනස් වේ, සහ මෙය අඩිසටහනක නොව ඔබගේ සැලසුම්කරණයට අයත්ය.** පේළි තුනම CI හි compile වේ. **browser** එක සම්පූර්ණ gallery එක run කරන අතර එය නවකය. **Android** හට මූලික සැබෑ-උපාංග පරීක්ෂාවක් සිදු වී ඇත: gallery එක boot වේ, taps නිවැරදි පාලකයට වදී, විදැහුම් පරිමාණනය නිවැරදිය, සහ touch scroll සහ flick දෘඩාංග මත ක්‍රියා කරයි — නමුත් ඉහත keyboard, safe-area සහ භ්‍රමණ හැසිරීම Headless මත unit-test කර ඇති අතර තවමත් උපාංගයක් මත අත්හදා බලා නැත. **iOS** compile වේ, සහ CI විසින් smoke check එකක් ලෙස සැබෑ head එක simulator එකක දියත් කරයි, නමුත් කිසිවෙකු තවමත් එය simulator එකක හෝ උපාංගයක අන්තර්ක්‍රියාකාරීව run කර නැත. mobile ඔබගේ roadmap එකේ ඇත්නම්, එය checkbox එකක් ලෙස නොව සැබෑ අවදානමක් සහිත spike එකක් ලෙස සලකන්න — මාස කිහිපයකට පෙර තිබූ ප්‍රමාණයට වඩා බොහෝ කුඩා spike එකක්, නමුත් spike එකක්.

ඔබට අවශ්‍ය වන workloads, එක් එක් එක් වරක්:

```
dotnet workload install wasm-tools   # browser — publish කිරීමට අවශ්‍යයි, build කිරීමට නොවේ
dotnet workload install android
dotnet workload install ios          # macOS පමණි; Linux/Windows මාර්ගයක් නැත
```

browser සඳහා, `dotnet run` WebAssembly ව්‍යාපෘතියක් serve නොකරන බව සලකන්න: එය `dotnet publish` කර `wwwroot` ප්‍රතිදානය ඕනෑම static file server එකකින් serve කරන්න.

browser port එකකට වහාම බලපාන එක් හිඩැසක්: **සාපේක්ෂ path මගින් load කරන ගොනු එහි නොපවතී.** සැබෑ ගොනු පද්ධතියක් නැත, එබැවින් desktop මත ක්‍රියා කරන රූප load කිරීම නිහඬව හිස් icons ලබා දෙයි ([module 0](#module-0)හි ඇති 1×1 placeholder හැසිරීමම). ඒ වෙනුවට රූප embedded resources ලෙස නිකුත් කර ඒවා assembly එක හරහා කියවන්න:

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

**browser එකේ ප්‍රවේශ්‍යතාව (accessibility) නොමිලේ ලැබේ — ඔබ ඔබගේ පාලක නම් කළා නම්.** canvas එකක් තිර කියවනයකට (screen reader), browser එකේ find-in-page එකට සහ ඕනෑම DOM-පාදක පරීක්ෂණ මෙවලමකට පාරදෘශ්‍ය නොවේ. එබැවින් browser පේළියේ Avalonia backend එක canvas එක අසල විවෘත පෝරමවල **DOM දර්පණයක් (DOM mirror)** තබා ගනී: සෑම පාලකයකටම එහි ARIA role, නම, තත්ත්වය සහ සීමා රැගෙන යන, විනිවිද පෙනෙන, click-through මූලද්‍රව්‍යයක් බැගින්, ඔබගේ පරීක්ෂණ කියවන එම ස්වයංක්‍රීයකරණ ගසයෙන්ම ([module 8](#module-8-tree)) ගොඩනගා, paint එකකින් පසු උපරිම වශයෙන් සෑම 100 ms කටම වරක් නැවත සමමුහුර්ත කෙරේ. පරීක්ෂණයකට සොයාගත හැකි ඕනෑම දෙයක් තිර කියවනයකටද සොයාගත හැක — module 8 හි "සෑම අන්තර්ක්‍රියාකාරී පාලකයකටම `Name` එකක් ලැබේ" නීතිය ඔබගේ code review checklist එකට අයත් වීමට තවත් එක් හේතුවක් එයයි.

### පවතින Avalonia, Uno, WinForms, WPF හෝ GTK 4 යෙදුමක් ඇතුළත කාවැද්දීම
{:#module-6-embedding}

ඔබ දැනටමත් එම toolkits පහෙන් එකක් මත යෙදුමක් නිකුත් කරන්නේ නම්, ඔබට Majorsilence.Forms එකතු කිරීමක් ලෙස (additively) අනුගත කළ හැක — සාමාන්‍ය `Form.Show()` ප්‍රවාහය වෙනස් නොකර, එහි පාලක සහ කවුළු native objects මෙන් භාවිත කරමින්. රටාව සෑම තැනකම සමානය (`MajorsilenceFormsPresenter` එකක් සහ extension methods යුගලයක්); වෙනස් වන්නේ ධාරක වර්ගය පමණි. මෙහි Avalonia සහ Uno පෙන්වා ඇත, Windows යුගලය [module 7](#module-7-c) හි ඇත, සහ GTK 4 යනු `ToGtkWidget()` / `ToGtkWindow()` ය:

**C#**

```csharp
// Majorsilence පාලකයක්, native එකක් ලෙස ධාරණය කර ඇත
Avalonia.Controls.Control          hostControl = myMfControl.ToAvaloniaControl ();
Microsoft.UI.Xaml.FrameworkElement unoControl  = myMfControl.ToUnoControl ();

// Majorsilence Form එකක backend කවුළුව, ධාරකයට ආපසු භාර දී ඇත
Avalonia.Controls.Window window = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window unoWin = myForm.ToUnoWindow ();

window.Show ();                    // මෙතැන් සිට එය පෙන්වීම ධාරකයේ වගකීමයි
```

**VB.NET**

```vb
' Majorsilence පාලකයක්, native එකක් ලෙස ධාරණය කර ඇත
Dim hostControl As Avalonia.Controls.Control = myMfControl.ToAvaloniaControl()
Dim unoControl As Microsoft.UI.Xaml.FrameworkElement = myMfControl.ToUnoControl()

' Majorsilence Form එකක backend කවුළුව, ධාරකයට ආපසු භාර දී ඇත
Dim window As Avalonia.Controls.Window = myForm.ToAvaloniaWindow()
Dim unoWin As Microsoft.UI.Xaml.Window = myForm.ToUnoWindow()

window.Show()                      ' මෙතැන් සිට එය පෙන්වීම ධාරකයේ වගකීමයි
```

**Owner/modal සම්බන්ධතා backend අනුව වෙනස් වේ:** `ToAvaloniaWindow()`, `ToWinFormsForm()` සහ `ToGtkWindow()` එක් එක් ඒවා සැබෑ OS මට්ටමේ modal සම්බන්ධතාවක් ලබා දෙයි; මෙම backend එකේ Uno හට owner සංකල්පයක් නැත, එබැවින් `ToUnoWindow()` ස්වාධීන top-level කවුළුවක් ආපසු ලබා දෙයි. Uno යටතේ, `Form.ShowDialog(parent)` භාවිත කරන්න — native කවුළු හිමිකාරිත්වය මත රඳා නොපවතින, framework-ගේම modal loop එක.

### ඔබ ඔබගේම title bar එක අඳින්නේ නම්
{:#module-6-chrome}

custom chrome ගොඩනගන ඕනෑම කෙනෙකුට එක් slide එකක් වටී. Avalonia backend එකේ, ඇදගෙන යාම සහ ප්‍රමාණය වෙනස් කිරීම අන්තර්ක්‍රියාකාරී begin-drag ඇමතුම් හරහා සිදු වේ. Uno මත එසේ කළ නොහැක (WinUI හට programmatic begin-drag එකක් නැත), එබැවින් move/resize ප්‍රකාශනාත්මකය (declarative): පෝරමය තම title-bar තීරුව caption region එකක් ලෙස ප්‍රකාශයට පත් කරයි, ධාරකය එය WinUI වෙත ඉදිරියට යවයි. එය Windows-desktop API එකක් බැවින්, OS title-bar drag Win32 head එකේ ක්‍රියා කරයි; macOS native decorations භාවිත කරන අතර drag/resize OS සතුය; **X11 head එකේ title-bar drag ලබා ගත නොහැක** — ඔබට OS කවුළු ඇදගෙන යාම අවශ්‍ය නම් එහි system decorations භාවිත කරන්න.

**අභ්‍යාසය 6.** [module 2](#module-2) හි `GreetForm` ගෙන, පැකේජ reference එක සහ, Avalonia නොවන backend එකක් සඳහා, එක් තේරීම් පේළිය වෙනස් කිරීමෙන් එය backends දෙකක run කරන්න (Linux මත, GTK 4; ඕනෑම තැනක, Terminal — ධාරක සන්ධිය (host seam) *දැනීමට* ඉක්මන්ම මාර්ගය එයයි). ඉන්පසු එය WebAssembly වෙත publish කර browser එකක විවෘත කරන්න: `OkButton_Click` හි `MessageBox.Show` එහිදී exception එකක් විසි කරයි, සහ එම handler එක `ShowAsync` වෙත පරිවර්තනය කිරීම එක් සංස්කරණයකින් සම්පූර්ණ async-සංවාද නීතියයි. ඔබ නිරීක්ෂණය කරන සෑම හැසිරීම් වෙනසක්ම ලියා, එක් එක් ඒවා ඉහත ලැයිස්තුවලට එරෙහිව පරීක්ෂා කරන්න — ඒවායේ නොමැති ඕනෑම දෙයක් වාර්තා කිරීමට වටී.

---

## Module 7 — Windows මත පියවරෙන් පියවර අනුගත වීම
{:#module-7}

**ප්‍රතිඵලය:** ඔබට Majorsilence.Forms සහ සැබෑ WinForms එක් process එකක, ඕනෑම දිශාවකින් සහ ඕනෑම කැටිති මට්ටමකින් — සම්පූර්ණ පෝරම හෝ තනි පාලක — run කළ හැකි අතර, එය ස්ථායීව තබා ගන්නා නීති තුන ඔබ දනී.

මේ සඳහා Windows-පමණක් මෙවලම් දෙකක් ඇති අතර, ඒවා විවිධ ස්තරවල ක්‍රියා කරයි:

| | `Majorsilence.Forms.WindowsFormsInterop` (දිශා A සහ B) | `Majorsilence.Forms.WinForms` backend (දිශාව C) |
|---|---|---|
| කැටිති මට්ටම | සම්පූර්ණ පෝරම සහ සංවාද කවුළු | තනි පාලක (සහ පෝරම) |
| Majorsilence run වන්නේ | Avalonia backend එක මත, Win32 pump එක WinForms සමඟ බෙදා ගනිමින් | සැබෑ WinForms කවුළු — Avalonia සම්බන්ධ නැත |
| වඩාත් සුදුසු | Majorsilence යෙදුමකින් පැරණි WinForms පෝරම විවෘත කිරීම, සහ අනෙක් අතට | WinForms UI ඇතුළත Majorsilence පාලක කාවැද්දීම; තම අභ්‍යන්තරය මුලින්ම port කරන පාලක පුස්තකාලයක්; .NET Framework 4.8 ධාරක |

ඒවාට එකට පැවතිය හැක — දිශාව C හි presenter එක දැනටමත් වින්‍යාස කළ backend එකක් එලෙසම තබයි.

`Majorsilence.Forms.WindowsFormsInterop` යනු **Windows-පමණක්** පාලමකි. Windows නොවන තැන්වල assembly එක හිස් placeholder එකකි (එබැවින් බහු-වේදිකා builds කොළ පැහැයෙන් පවතී) සහ සෑම ඇමතුමක්ම `PlatformNotSupportedException` විසි කරයි.

**එය කිසිසේත් ක්‍රියා කරන්නේ ඇයි:** Windows මත, Avalonia backend එක තමන්ගේම loop එකක් run කරනවා වෙනුවට තම කවුළු OS message pump එක සමඟ ලියාපදිංචි කරයි, සහ `System.Windows.Forms` එම pump එකම භාවිත කරයි. එබැවින් toolkits දෙක කැඳවනු ලබන ඕනෑම `Application.Run` එකක් බෙදා ගනී — එක් loop එකක් දෙකටම සේවය කරයි.

### දිශාව A — පැරණි WinForms පෝරමයක් විවෘත කරන Majorsilence.Forms යෙදුමක්
{:#module-7-a}

යෙදුම සංක්‍රමණය වී ඇති නමුත් සංවාද කවුළු කිහිපයක් තවමත් සංක්‍රමණය වී නැති විට සඳහා.

**C#**

```csharp
using Majorsilence.Forms.Interop;

// Modeless — වහාම return වේ
WindowsFormsInterop.Show (new LegacySettingsForm (), owner: this);

// Modal — WinForms සංවාද කවුළුව වැසෙන තුරු block කරයි
var result = WindowsFormsInterop.ShowDialog (new LegacyWizardForm (), owner: this);
if (result == System.Windows.Forms.DialogResult.OK) {
    // …
}

// Factory overload — පෙන්වන අවස්ථාවේදී UI thread එක මත පෝරමය සාදයි
WindowsFormsInterop.Show (() => new LegacySettingsForm ());
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Interop

' Modeless — වහාම return වේ
WindowsFormsInterop.Show(New LegacySettingsForm(), owner:=Me)

' Modal — WinForms සංවාද කවුළුව වැසෙන තුරු block කරයි
Dim result = WindowsFormsInterop.ShowDialog(New LegacyWizardForm(), owner:=Me)
If result = System.Windows.Forms.DialogResult.OK Then
    ' …
End If

' Factory overload — පෙන්වන අවස්ථාවේදී UI thread එක මත පෝරමය සාදයි
WindowsFormsInterop.Show(Function() New LegacySettingsForm())
```

WinForms සංවාද කවුළුව Majorsilence parent එකට සැබවින්ම අයත් (සහ එයට modal) වීමට, ආරම්භයේදී handle resolver එක **එක් වරක්** සම්බන්ධ කරන්න — ඔබ එසේ කරන තුරු, WinForms පෝරම owner රහිතව පෙන්වනු ලැබේ:

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

### දිශාව B — Majorsilence.Forms තිර විවෘත කරන WinForms යෙදුමක්
{:#module-7-b}

කිසිවකට කැප වීමට පෙර framework එක තහවුරු කිරීමේ අඩු-අවදානම් මාර්ගය මෙයයි: ඔබ දැනටමත් නිකුත් කරන යෙදුම ඇතුළත *නව* තිර Majorsilence.Forms මත ගොඩනගන්න.

**C#**

```csharp
[STAThread]
static void Main ()
{
    System.Windows.Forms.Application.EnableVisualStyles ();
    System.Windows.Forms.Application.SetCompatibleTextRenderingDefault (false);
    System.Windows.Forms.Application.SetHighDpiMode (HighDpiMode.PerMonitorV2);

    WindowsFormsInterop.InitializeMajorsilence ();   // එක් වරක්, පළමු MF කවුළුවට පෙර
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

        WindowsFormsInterop.InitializeMajorsilence()   ' එක් වරක්, පළමු MF කවුළුවට පෙර
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

එය `DialogResult.None` ("පැහැදිලි ප්‍රතිඵලයක් නොමැතිව වසා ඇත" යන්නයි, උදා. title-bar ✕) හැර වෙනත් යමක් ආපසු ලබා දීමට, Majorsilence පෝරමයේ `Close()` ට පෙර `DialogResult` සකසන්න:

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

### දිශාව C — WinForms (හෝ WPF) backend එක මත, වරකට එක් පාලකයක්
{:#module-7-c}

දිශා A සහ B සම්පූර්ණ තිර ගෙන යයි. ඔබට ගෙන යාමට දැරිය හැකි ඒකකය *පාලකයක්* වන විට — custom grid එකක්, chart එකක්, කාර්යබහුල පෝරමයක එක් panel එකක් — ඒ වෙනුවට `Majorsilence.Forms.WinForms` reference කරන්න. එය සම්පූර්ණ වේදිකා backend එකකි ([module 6](#module-6)), එහි කවුළු සම්භාව්‍ය Win32 pump එක මත සැබෑ `System.Windows.Forms` පෝරම වන අතර, Skia මතුපිට GDI-පාදක පාලකයක් හරහා ඉදිරිපත් කෙරේ. WinForms container එකකට දමන Majorsilence පාලකයක් සාමාන්‍ය `System.Windows.Forms.Control` එකක් බවට පත් වේ; presenter එකක් පළමු වරට සාදන විට backend එක තමන්ම ස්ථාපනය වන අතර, යෙදුමේ පවතින `Application.Run` සියල්ලටම සේවය කරයි. (පැකේජ README සහ `samples/EmbeddingWinForms` ට එරෙහිව පරීක්ෂා කර ඇත, මෙම මාර්ගෝපදේශය සඳහා run කර නැත.)

**C#**

```csharp
using Majorsilence.Forms.WinForms;

// Namespace සහිතව සඳහන් කරන්න: මෙම ගොනුවේ System.Windows.Forms සහ Majorsilence.Forms දෙකම scope එකේ ඇත.
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });

System.Windows.Forms.Control host = scene.ToWinFormsControl ();   // හෝ: new MajorsilenceFormsPresenter { Content = scene }
legacyForm.Controls.Add (host);

// WinForms සතු සම්පූර්ණ Majorsilence Form එකක් — සැබෑ native-modal සම්බන්ධතාවක්:
var dialog = new Majorsilence.Forms.Form { Text = "Ported dialog" };
System.Windows.Forms.Form native = dialog.ToWinFormsForm ();
native.ShowDialog (legacyForm);
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WinForms

' Namespace සහිතව සඳහන් කරන්න: මෙම ගොනුවේ System.Windows.Forms සහ Majorsilence.Forms දෙකම scope එකේ ඇත.
Dim scene As New Majorsilence.Forms.Panel()
scene.Controls.Add(New Majorsilence.Forms.Button With {.Text = "Ported button", .Left = 12, .Top = 12})

Dim host As System.Windows.Forms.Control = scene.ToWinFormsControl()   ' හෝ: New MajorsilenceFormsPresenter With {.Content = scene}
legacyForm.Controls.Add(host)

' WinForms සතු සම්පූර්ණ Majorsilence Form එකක් — සැබෑ native-modal සම්බන්ධතාවක්:
Dim dialog As New Majorsilence.Forms.Form With {.Text = "Ported dialog"}
Dim native As System.Windows.Forms.Form = dialog.ToWinFormsForm()
native.ShowDialog(legacyForm)
```

සැලසුම්කරණය සඳහා මෙම මාර්ගයේ ගුණාංග තුනක් වැදගත් වේ:

- **එය `net48` ඉලක්ක කරයි.** මූලික පැකේජයේ `netstandard2.0` build එක සමඟ එක්ව, **.NET Framework 4.8** යෙදුමකට මුලින්ම නවීන .NET වෙත නොගොස් Majorsilence පාලක ධාරණය කළ හැක. එය බොහෝ සංක්‍රමණ සැලසුම්වල අනුපිළිවෙළ වෙනස් කරයි: UI port එක සහ runtime උත්ශ්‍රේණිය තවදුරටත් එකම ව්‍යාපෘතිය විය යුතු නැත.
- **එය දෙපැත්තටම ක්‍රියා කරයි.** `NativeControlHost` ([module 9](#module-9-route-a)) කාවැද්දූ Majorsilence scene එක ඇතුළත *සැබෑ* WinForms පාලකයක් ධාරණය කරන අතර, backend එක `PlatformHandle` හරහා සැබෑ `HWND` එකක් ආපසු ලබා දෙයි. කාවැද්දූ අන්තර්ගතය විවෘත කරන popups (dropdowns, menus) සැබෑ දාර රහිත OS කවුළු වේ.
- **අවසාන පාලකය port කළ පසු, පැකේජය** `Majorsilence.Forms.Avalonia` වෙත මාරු කරන්න, එවිට එම කේතයම බහු-වේදිකා වේ. backend සන්ධියට (seam) ඉහළින් කිසිවක් වෙනස් නොවේ.

එහි නොමැති දේ: gestures (WinForms හට gesture API එකක් නැත — touch පැමිණෙන්නේ mouse ලෙසය) සහ webview එකක් (WebView මත රඳා පවතින ගැළපුම් පාලක, Headless මත මෙන්, විකල්ප මාර්ගවලට යොමු වේ). `Majorsilence.Forms.Wpf` යනු WPF shell එකක් සඳහා එම අදහසමය — `ToWpfElement()` සහ `ToWpfWindow()`, `net48`/`net8.0-windows`/`net10.0-windows`, `Platform.Backend = new WpfPlatformBackend ()` මගින් තෝරා ගැනේ.

**කොටස් දෙකම එක් යෙදුමක් ලෙස පෙනෙන්නට සැලැස්වීම.** මිශ්‍ර-toolkit යෙදුමක රහස හෙළි කරන ලක්ෂණය නම් එක් තිරයක දෘශ්‍ය ශෛලීන් දෙකකි. `Majorsilence.Forms.Theming.WinForms` විසින් *එම* CSS තේමාවම ([උපග්‍රන්ථය D](#appendix-d)) සැබෑ `System.Windows.Forms` පාලකවලට යොදයි, WinForms ඉඩ දෙන තරමට, සහ සෑම හිඩැසක්ම නිහඬව මඟ හරිනවා වෙනුවට diagnostic එකක් ලෙස වාර්තා කරමින්:

**C#**

```csharp
using Majorsilence.Forms.Theming.WinForms;

Theme.LoadFromCssFile ("Themes/graphite.css");                     // Majorsilence කොටස
WinFormsCssTheme.Apply (File.ReadAllText ("Themes/graphite.css")); // WinForms කොටස
WinFormsCssTheme.Track (legacyForm);                               // දැන් ශෛලිගත කරන්න, පසුව එකතු කරන පාලකද
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Theming.WinForms

Theme.LoadFromCssFile("Themes/graphite.css")                        ' Majorsilence කොටස
WinFormsCssTheme.Apply(File.ReadAllText("Themes/graphite.css"))     ' WinForms කොටස
WinFormsCssTheme.Track(legacyForm)                                  ' දැන් ශෛලිගත කරන්න, පසුව එකතු කරන පාලකද
```

(`WinFormsCssTheme.Watch (path)` සෑම save කිරීමකදීම නැවත යොදයි, Windows-පමණක් `ThemeStudio.WinForms` නිදසුන ක්‍රියා කරන්නේ එලෙසය.)

### නීති තුන
{:#module-7-rules}

1. **එක් process එකකට එක් `Application.Run` එකක්.** කිසිවිටෙක `Majorsilence.Forms.Application.Run` සහ `System.Windows.Forms.Application.Run` දෙකම කැඳවන්න එපා. ධාරකයක් තෝරන්න; අනෙක් දිශාව සඳහා පාලම භාවිත කරන්න.
2. **UI (STA) thread එක පමණි** — හරියටම WinForms මෙන්. background thread එකකින්, නැවත UI thread එකට මාරු වන්න:

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

3. **Win32 parenting අසමමිතිකය.** MF → WF parenting ඉහත handle resolver එක හරහා ක්‍රියා කරයි; WF → MF දිශාවේදී MF කවුළුව දැනට OS මට්ටමින් owner රහිතය.

**අභ්‍යාසය 7.** පවතින WinForms යෙදුමක පරීක්ෂණ පිටපතක, owner handle සම්බන්ධ කර, දිශාව B හරහා Majorsilence.Forms මත ගොඩනගන ලද එක් නව තිරයක් එකතු කරන්න. ඉන්පසු, එම යෙදුමේම, දිශාව C හරහා පවතින එක් පාලකයක් Majorsilence පාලකයකින් ප්‍රතිස්ථාපනය කරන්න. ඔබ දැනටමත් නිකුත් කරන දේ ගැන කිසිවක් වෙනස් නොකරන බැවින්, ඒ දෙක එකට පාර්ශවකරුවන්ගේ බාධා ඉවත් කරන demo එක වේ.

---

## Module 8 — ඔබගේ යෙදුම පරීක්ෂා කිරීම
{:#module-8}

**ප්‍රතිඵලය:** ඔබගේ කණ්ඩායම display එකක් නොමැතිව CI හි run වන UI පරීක්ෂණ, කැඩී නොයන locators භාවිත කරමින් ලියයි — සහ නොමිලේ ලැබෙන ප්‍රවේශ්‍යතාව කුමක්දැයි දනී.

> මෙම module එක දළ විශ්ලේෂණයයි. [**ස්වයංක්‍රීයකරණය සහ UI පරීක්ෂණ**]({{ '/si/automation/' | relative_url }}) යනු ප්‍රායෝගික භාවිත කරන්නාගේ අනුවාදයයි: page objects, wait සහායකයක් (implicit waits නැත), සැබෑ Selenium වෙතින් යෙදුම මෙහෙයවීම, Windows මත FlaUI/WinAppDriver, golden-image regression, GitHub Actions, Azure DevOps සහ Jenkins සඳහා CI වට්ටෝරු, සහ AI agents එම මතුපිටටම සම්බන්ධ වන ආකාරය.

### එක් ස්වයංක්‍රීයකරණ ගසයක්, පාරිභෝගිකයන් තිදෙනෙක්
{:#module-8-tree}

framework එක backend-මධ්‍යස්ථ **ස්වයංක්‍රීයකරණ ගසයක් (automation tree)** නිරාවරණය කරයි: ids, නම්, roles, අගයන්, තත්ත්වය සහ සීමා සහිත ඔබගේ සජීවී පාලක ධුරාවලියේ snapshot එකකි.

| පාරිභෝගිකයා | පැකේජය | ඔබට ලබා දෙන්නේ |
|---|---|---|
| In-process UI පරීක්ෂණ | `Majorsilence.Forms.Automation` (මූලික පැකේජයේ) | පික්සල ගණනය කිරීම් නොමැතිව C#/VB වෙතින් පෝරමයක් මෙහෙයවීම |
| දුරස්ථ ස්වයංක්‍රීයකරණය | `Majorsilence.Forms.WebDriver` | ඕනෑම Selenium client එකකට මෙහෙයවිය හැකි W3C WebDriver server එකක් |
| තිර කියවන සහ විශාලන මෙවලම් | `Majorsilence.Forms.WindowsUIAutomation` | Windows මත Narrator / NVDA / JAWS |

ගසය renderers භාවිත කරන එම තාර්කික සීමා සහ තත්ත්වයම කියවයි, එබැවින් එය headless සහ සැබෑ backends මත එක සමානව හැසිරේ — **Headless ට එරෙහිව ලියන පරීක්ෂණයක් Avalonia මත පරිශීලකයෙකු දකින දේ විස්තර කරයි.**

### පාලක සොයාගත හැකි කරන්න — පළමු දිනයේම අනුගත කරන කණ්ඩායම් සම්මුතියක්
{:#module-8-findable}

Locators රඳා පවතින්නේ ඔබ දැනටමත් සකසන ගුණාංග දෙකක් මතය:

- `Control.Name` → මූලද්‍රව්‍යයේ **AutomationId**. ස්ථායී locator එක. සැමවිටම එයට ප්‍රමුඛත්වය දෙන්න.
- `Control.AccessibleName` (නැතිනම් `Text`, ඉන්පසු `Name`) → මූලද්‍රව්‍යයේ **Name**.

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

ඔබ `Control.AccessibleRole` සකසන්නේ නැත්නම්, roles පාලක වර්ගයෙන් අනුමාන කෙරේ (`button`, `textbox`, `checkbox`, `radio`, `combobox`, `list`, `label`, `tablist`, `window`, …). "සෑම අන්තර්ක්‍රියාකාරී පාලකයකටම `Name` එකක් ලැබේ" යන්න code-review නීතියක් කරන්න — එය එකම යතුරු එබීමකින් පරීක්ෂණ locators *සහ* තිර කියවන සහාය ලබා දෙයි, Windows මත UI Automation හරහා සහ browser එකේ [ARIA DOM දර්පණය](#module-6-singleview) හරහා.

### අභිරුචි ලෙස paint කළ පාලක: ඔබගේම අගය සහ තත්ත්වය ප්‍රකාශ කරන්න
{:#module-8-stateprovider}

ගොඩනඟන ලද පාලක තම අගය වාර්තා කරන්නේ කෙසේදැයි දනී — `TextBox` එකක් එහි text එක, `CheckBox` එකක් `"true"`. ඔබ තනිවම paint කරන පාලකයකට ([module 4](#module-4-paint)) අනුමාන කිරීමට කිසිවක් නැත, එබැවින් එය ගසයේ හිස් අගයක් සහ එහි වර්ග නාමයෙන් අනුමාන කළ role එකක් සමඟ දිස් වේ. `AccessibleRole` සහ `AccessibleName` දැනටමත් role එක සහ නම නිවැරදි කරයි. අගය සහ ඕනෑම අමතර තත්ත්වයක් සඳහා, `IAutomationStateProvider` ක්‍රියාත්මක කරන්න — එවිට ගසය අනුමාන කරනවා වෙනුවට ඔබ වාර්තා කරන දේ භාවිත කරයි, සහ සෑම state ඇතුළත් කිරීමක්ම ඔබට ස්වාධීනව query කළ හැකි `state-{key}` attribute එකක් බවට පත් වේ. (`docs/automation.md` වෙතින්; මෙම මාර්ගෝපදේශය සඳහා run කර නැත.)

**C#**

```csharp
using System.Collections.Generic;
using System.Globalization;
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;

public sealed class BeaconIndicator : Control, IAutomationStateProvider
{
    public int Level { get; set; }
    public string Status { get; set; } = "warning";

    public string? AutomationValue => Level.ToString (CultureInfo.InvariantCulture);

    public IReadOnlyDictionary<string, string> AutomationState => new Dictionary<string, string> {
        ["level"]  = Level.ToString (CultureInfo.InvariantCulture),
        ["status"] = Status,
    };

    protected override void OnPaint (PaintEventArgs e) { /* beacon එක අඳින්න */ }
}

// පරීක්ෂණයක — තත්ත්වය XPath මගින් ආමන්ත්‍රණය කළ හැක:
session.Find (By.XPath ("//BeaconIndicator[@state-level='3']"));
```

**VB.NET**

```vb
Imports System.Globalization
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation

Public NotInheritable Class BeaconIndicator
    Inherits Control
    Implements IAutomationStateProvider

    Public Property Level As Integer
    Public Property Status As String = "warning"

    Public ReadOnly Property AutomationValue As String Implements IAutomationStateProvider.AutomationValue
        Get
            Return Level.ToString(CultureInfo.InvariantCulture)
        End Get
    End Property

    Public ReadOnly Property AutomationState As IReadOnlyDictionary(Of String, String) _
            Implements IAutomationStateProvider.AutomationState
        Get
            Return New Dictionary(Of String, String) From {
                {"level", Level.ToString(CultureInfo.InvariantCulture)},
                {"status", Status}
            }
        End Get
    End Property

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        ' beacon එක අඳින්න
    End Sub
End Class

' පරීක්ෂණයක — තත්ත්වය XPath මගින් ආමන්ත්‍රණය කළ හැක:
session.Find(By.XPath("//BeaconIndicator[@state-level='3']"))
```

එය මතද `Name`, `AccessibleName` සහ `AccessibleRole` සකසන්න, එවිට මූලද්‍රව්‍යය `GetPageSource()` තුළ ඒ හතරම රැගෙන යයි — සහ, WebDriver හරහා, `getAttribute("state-level")` එම දේම කියවයි. state keys අකුරු, ඉලක්කම්, `-` සහ `_` වලට සීමා කරන්න. දැනගත යුතු එක් නීතියක්: `AutomationValue` ගොඩනඟන ලද අනුමානය සමඟ මිශ්‍ර වීම වෙනුවට එය *ප්‍රතිස්ථාපනය* කරයි, එබැවින් checkbox-වැනි අභිරුචි පාලකයක් `"true"`/`"false"` තනිවම වාර්තා කරයි.

### Headless backend එක ඔබගේ CI විසඳුමයි
{:#module-8-headless}

`Majorsilence.Forms.Headless` හට display එකක් අවශ්‍ය නැත. සම්පූර්ණ පරීක්ෂණ assembly එක සඳහා එය එක් වරක් ස්ථාපනය කරන්න, එවිට සෑම පරීක්ෂණයකටම එය ලැබේ.

**C# — module initializer එකක් වඩාත් පිළිවෙළ hook එකයි**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Headless;

internal static class TestBootstrap
{
    [ModuleInitializer]
    internal static void Init () => HeadlessRenderer.Use ();
}
```

**VB.NET — VB හට module initializer එකක් නැත, එබැවින් ඔබගේ පරීක්ෂණ framework එකේ assembly hook එක භාවිත කරන්න**

```vb
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBootstrap
    ' MSTest: <AssemblyInitialize>. NUnit හි සමානය <OneTimeSetUp> සහිත <SetUpFixture> එකකි;
    ' xUnit හි එය collection/assembly fixture එකකි. VB හට <ModuleInitializer> භාවිත කළ නොහැක — VB
    ' compiler එක module initializers නිකුත් නොකරයි, එබැවින් attribute එක පමණක් කිසිවක් නොකරනු ඇත.
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        HeadlessRenderer.Use()
    End Sub
End Class
```

එය ශෛලීය මනාපයක් නොව සැබෑ භාෂා වෙනසකි: ඔබ C# රටාව VB වෙත පිටපත් කළහොත්, ඔබගේ පරීක්ෂණ කිසිදු backend එකක් නොමැතිව run වී ව්‍යාකූල ආකාරවලින් අසාර්ථක වනු ඇත.

තවද "එය සැබෑ එක නිසා" UI පරීක්ෂණ Avalonia backend එක මත run කිරීමට පෙළඹෙන්න එපා: Avalonia-ගේ dispatcher එක thread-බද්ධ වන අතර පරීක්ෂණ runner එකක worker threads සමඟ ගැටේ. Headless පවතින්නේ හරියටම ඔබගේ suite එකට display එකක් හෝ UI thread එකක් අවශ්‍ය නොවන ලෙසය — framework-ගේම suite එක එය මත run වේ, සහ `HeadlessRenderer.Use ()` යනු `HeadlessPlatformBackend` ඔබම පැවරීමට සමානය.

### සම්පූර්ණ UI පරීක්ෂණයක්
{:#module-8-inprocess}

`By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` මූලද්‍රව්‍ය සොයා ගනී; `Find`, `FindOrThrow` සහ `FindAll` එක් එක් ඒවා **නැවුම් snapshot එකක්** query කරයි. ක්‍රියා (`Click`, `SendKeys`, `PressKey`, `Clear`) සැබෑ backend එකක් භාවිත කරන එම මධ්‍යස්ථ ආදාන නළය හරහා යයි, එබැවින් ඒවා සැබෑ routing, focus සහ පිරිසැලසුම අත්හදා බලයි — පරීක්ෂණ-පමණක් කෙටිමඟක් නොවේ.

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

        // Golden-image පරීක්ෂාව: offscreen විදැහුම් කර commit කළ PNG එකක් සමඟ සසඳන්න.
        var png = HeadlessRenderer.CapturePng (form, 360, 140);

        Assert.NotEmpty (png);
        // File.WriteAllBytes ("greetform.expected.png", png);   // හිතාමතාම නැවත ජනනය කරන්න
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
            ' Golden-image පරීක්ෂාව: offscreen විදැහුම් කර commit කළ PNG එකක් සමඟ සසඳන්න.
            Dim png = HeadlessRenderer.CapturePng(form, 360, 140)
            Assert.IsTrue(png.Length > 0)
        End Using
    End Sub
End Class
```

`By.XPath` ගසයේ XML විදැහුමට එරෙහිව ඇගයීම් කරයි, එය `session.GetPageSource()` ආපසු ලබා දෙන හැඩයමය — ඔබට රඳා පැවතීමට ස්ථායී id එකක් නොමැති විට ප්‍රයෝජනවත්ය:

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

**HiDPI හිදී පරීක්ෂා කිරීම.** `MF_HEADLESS_SCALE=2` මගින් headless backend එක පරිමාණනය කළ display එකක් වාර්තා කරයි, පරිමාණනය කළ monitor එකක් නොමැතිව 2× හි පිරිසැලසුම පරීක්ෂා කරන්නේ එලෙසය. framework-ගේම suite එක එම පරිමාණයේදී සමත් වන අතර CI එය gate කරයි, එබැවින් එය දන්නා-කැඩුණු කොනක් නොව සහාය දක්වන දෙයකි.

කෙසේ වෙතත්, එම අසාර්ථකත්වයන් නිවැරදි කළ ආකාරයෙන් පාඩම ගන්න, මන්ද එය ඔබගේ කේතයේද ඇති එම උගුලමය: ඒවායින් බොහෝමයක් **එක් ව්‍යාකූලත්වයකි — තාර්කික ඒකක එදිරිව උපාංග ඒකක.** 2026-10-01 සිට ඔබ `Control` එකකින් කියවන සියල්ල — `Bounds`, `ClientRectangle`, `ClientSize`, `MouseEventArgs`, paint canvas එක — තාර්කිකය ([module 4](#module-4-paint)), එය උගුලේ නරකම කොටස ඉවත් කළේය. *තවමත්* උපාංග පික්සලවල ඇති දේ: ග්‍රහණය කළ bitmaps (scale 2 හිදී `HeadlessRenderer.CapturePng` එක් එක් දිශාවට දෙගුණයක් විශාලය), ඔබ නමින් ඉල්ලූ `Scaled*` පවුල, සහ owner-draw events වල `Bounds`. scale 1 හිදී ඒවා සමාන වේ, එබැවින් පරිමාණනය කළ display එකක් දිස් වන තුරු ඒවා මිශ්‍ර කිරීම නොපෙනේ. එබැවින්: **ජ්‍යාමිතිය scale-1 පික්සලවලින් නොව සමානුපාතිකව assert කරන්න**, සහ ග්‍රහණය කළ bitmap එකක් සෘජුකෝණාස්‍රයක් සමඟ සසඳන විට, එක් එක් ඒවා කුමන අවකාශයේ දැයි පරීක්ෂා කරන්න. තවමත් `ScaleTransform (e.Scaling, …)` කැඳවන අභිරුචි පාලකයක් අද මෙම gate එක අසමත් වීමේ වඩාත් සුලබ ක්‍රමයයි.

### Selenium සමඟ දුරස්ථ ස්වයංක්‍රීයකරණය
{:#module-8-webdriver}

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

var server = new WebDriverServer (form, port: 4444);
server.Start ();          // http://127.0.0.1:4444/  (loopback පමණි)
// … ඕනෑම WebDriver client එකකින් එය මෙහෙයවන්න …
server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Dim server As New WebDriverServer(form, port:=4444)
server.Start()            ' http://127.0.0.1:4444/  (loopback පමණි)
' … ඕනෑම WebDriver client එකකින් එය මෙහෙයවන්න …
server.Stop()
```

WebDriver යනු HTTP සහ JSON පමණක් බැවින්, ඕනෑම භාෂාවක ඕනෑම client එකක් ක්‍රියා කරයි:

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

සහාය දක්වන දේ: new/delete session, find element(s), click, send keys, clear, get text, get name (role), get attribute, get rect, get enabled, **page source** (XML), screenshot (PNG), `GET /status`. Locators: `id`, `name`, `tag name` (role), `xpath`, `css selector` (`#id` සහ `[name='…']`), ඊට අමතරව අභිරුචි `role`, `type`, `link text`. Element references සෑම භාවිතයකදීම නැවුම් snapshot එකකට එරෙහිව නැවත විසඳෙයි, ස්ථායී AutomationId එකට ප්‍රමුඛත්වය දෙමින්, එබැවින් සංස්කරණවලින් පසුවද අගයන් සජීවීව පවතී.

**Locators පටිගත කිරීම.** server එක XML page source *සහ* හරියටම එම source එකට එරෙහිව run වන xpath strategy එකක් නිරාවරණය කරන බැවින්, ඕනෑම Appium-ශෛලීය inspector එකකට screenshot එකක් මත සජීවී ගසය පෙන්විය හැකි අතර nodes මත click කිරීමෙන් locators ග්‍රහණය කිරීමට ඉඩ දෙයි. එය `127.0.0.1`, ඔබගේ port එක, path `/`, සාමාන්‍ය http වෙත යොමු කරන්න; capabilities නොසලකා හරිනු ලැබේ. මෙම අනුපිළිවෙළින් locators වලට ප්‍රමුඛත්වය දෙන්න: **`id`** → **`xpath`** → `name`/`role`/`type`. අවවාද: මෙය සම්පූර්ණ Appium server එකක් නොව W3C WebDriver server එකකි (Appium-පමණක් endpoints 404 ආපසු ලබා දෙයි — සාමාන්‍ය WebDriver client එකක් වඩාත්ම විශ්වාසදායක inspector එකයි); screenshot එක වෙනත් DPI එකකින් ග්‍රහණය කළහොත් overlay එක විස්ථාපනය විය හැක; වරකට එක් කවුළුවක්; සැඟවුණු පාලක ගසයෙන් ඉවත් කෙරේ.

**headless** පරීක්ෂණයක message loop එකක් නැත, එබැවින් HTTP ඇමතුම් worker එකක run වන අතරතුර queue එක pump කරන්න:

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

**Playwright** desktop යෙදුමට **ගැළපෙන්නේ නැත** — එය DOM එකක් හරහා browser engines ස්වයංක්‍රීය කරයි, සහ මෙහි DOM එකක් නැත. (browser head එකේ [ARIA දර්පණය](#module-6-singleview) DOM එකකි, නමුත් එය ස්වයංක්‍රීයකරණ API එකක් නොව ප්‍රවේශ්‍යතා මතුපිටකි; යෙදුම WebDriver හරහා මෙහෙයවන්න.) එම ප්‍රශ්නයට sprint එකක් කා දැමීමට ඉඩ නොදෙන්න.

### AI agent එකකට යෙදුම මෙහෙයවීමට ඉඩ දීම
{:#module-8-mcp}

AI සහායකයෙකු භාවිත කරන්නේද එම WebDriver endpoint එකමය. `Majorsilence.Forms.Mcp` යනු dotnet global tool එකක් ලෙස නිකුත් කරන MCP server එකකි: එය සහායකයා සමඟ stdio හරහා MCP ද, ඔබගේ යෙදුමේ `WebDriverServer` සමඟ loopback හරහා HTTP ද කතා කරයි, `ui_snapshot`, `ui_find`, `ui_read`, `ui_click`, `ui_type`, `ui_wait_for` සහ `ui_screenshot` නිරාවරණය කරමින්. සෑම tool එකක්ම element handle එකක් නොව locator එකක් ගනී, එබැවින් find එකක් සහ ක්‍රියාවක් අතර කිසිවක් පරණ නොවේ.

```
dotnet tool install -g Majorsilence.Forms.Mcp
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444     # හෝ ඕනෑම MCP client එකක config එකේ එම විධානයම
```

ඉගෙන ගන්නා අතරතුර එය යොමු කිරීමට දෙයක්: `samples/AutomationTarget` යනු හරියටම මේ සඳහා සාදන ලද කුඩා යෙදුමකි — `dotnet run --project samples/AutomationTarget -- --webdriver 4444` endpoint එක ආරම්භ කර එය මෙහෙයවීමට විධාන මුද්‍රණය කරයි. එහි සෑම පාලකයක්ම client එකකට හැසිරවිය යුතු එක් දෙයක් අත්හදා බලයි: ස්ථිරවම අක්‍රිය බොත්තමක් (එවිට ඔබට ව්‍යාජ සාර්ථකත්වයක් වෙනුවට ප්‍රතික්ෂේප කිරීමක් පෙනේ), checkbox එකක් ටික් කළ පසු පමණක් සක්‍රිය වන Submit බොත්තමක් (`ui_wait_for` පවතින්නේ ඒ සඳහාය), හිතාමතාම නම් නොකළ එක් පාලකයක්, සහ client එක කළ බව *කියන* දේ යෙදුම දුටු දේ සමඟ පරීක්ෂා කළ හැකි වන පරිදි සෑම ක්‍රියාවකම දෘශ්‍ය log එකක්. ස්වයංක්‍රීයකරණ මතුපිට සත්‍යාපනය රහිතය, එබැවින් එය නිරාවරණය කරන්නේ සංවර්ධන සහ පරීක්ෂණ builds වල පමණි.

### Windows මත ප්‍රවේශ්‍යතාව
{:#module-8-a11y}

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // මුලින්ම පෙන්විය යුතුය — එයට native handle එකක් අවශ්‍යයි
WindowsUIAutomation.Enable (form);  // කවුළුව වැසෙන විට ස්වයංක්‍රීයව වෙන් වේ
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' මුලින්ම පෙන්විය යුතුය — එයට native handle එකක් අවශ්‍යයි
WindowsUIAutomation.Enable(form)    ' කවුළුව වැසෙන විට ස්වයංක්‍රීයව වෙන් වේ
```

> **එම කේත කොටස Windows නොවන තැන්වල compile නොවේ** — න්‍යායාත්මකව නොව, තහවුරු කර ඇත. Windows නොවන තැන්වල පැකේජය හිස් stub එකක් ලෙස නිකුත් වේ, එබැවින් `Majorsilence.Forms.WindowsUIAutomation` namespace එක නොපවතින අතර ඔබට runtime `PlatformNotSupportedException` එකක් වෙනුවට CS0234 ලැබේ. බහු-වේදිකා යෙදුමක, multi-target කර (`net10.0;net10.0-windows`) ඇමතුම `#if WINDOWS` මගින් ආරක්ෂා කරන්න, නැතිනම් එය ඔබගේ desktop head එක කොන්දේසි සහිතව reference කරන Windows-පමණක් ව්‍යාපෘතියක තබන්න.

සෑම පාලකයක්ම **Name**, **AutomationId** (`Control.Name`), **ControlType**, **IsEnabled**, **HasKeyboardFocus** සහ තිර **BoundingRectangle** සහිත UIA මූලද්‍රව්‍යයක් බවට පත් වේ. `Invoke` (බොත්තම්) සජීවීය; `Value` සහ `Toggle` කියවීම සඳහා නිරාවරණය කර ඇත. Focus වෙනස්කම් UIA focus-changed events මතු කරයි — තිර කියවනයක් නව පාලකය නිවේදනය කිරීමටත් විශාලන මෙවලමක් එය අනුගමනය කිරීමටත් හේතු වන්නේ එයයි.

මෙම පළමු අනුවාදයේ නොමැති දේ: එක් එක් යතුරු එබීමට `TextBox` අගය events (තිර කියවන තමන්ගේම ටයිප් කළ-අක්ෂර echo එක වෙත යොමු වේ; focus වන විට field එක තවමත් නිවේදනය කෙරේ), structure-changed events, සහ උප-පාලක අයිතම (තනි tabs, ලැයිස්තු පේළි). එම ගසයම මත Linux (AT-SPI) සහ macOS (NSAccessibility) පාලම් roadmap අයිතම වේ — එබැවින් එම වේදිකාවල ඔබට ප්‍රවේශ්‍යතා වගකීමක් ඇත්නම්, එය නිකුත් කරන අවස්ථාවේදී නොව දැන්ම මතු කරන්න.

**අභ්‍යාසය 8.** ඉහත `GreetFormTests` ඔබගේම කණ්ඩායමේ භාෂාවෙන් ලියන්න, display එකක් නොමැතිව CI හි එය කොළ පැහැ කරන්න, ඉන්පසු golden-image assertion එකක් එකතු කරන්න. ඔබගේ codebase එකේ සෑම UI පරීක්ෂණයක්ම අනුගමනය කළ යුතු සැකිල්ල එම පරීක්ෂණයයි.

---

## Module 9 — ස්වදේශීය අන්තර්ගතය සහ වීඩියෝ
{:#module-9}

**ප්‍රතිඵලය:** කණ්ඩායමේ කිසිවෙක් කිසි දිනෙක කවුළු handle එකක් ව්‍යාජ ලෙස සාදන්නේ නැත, සහ වීඩියෝ/සිතියම්/බ්‍රවුසර අන්තර්ගතය සැබවින්ම නිවැරදිව සංයෝජනය (composite) වන ආකාරයට ධාරකය කෙරේ.

ප්‍රශ්න දෙකක් ඇත්තටම එකම ප්‍රශ්නය බව පෙනී යයි — "පාලකයක් (control) තුළට ස්වදේශීය (native) අන්තර්ගතය දමන්නේ කෙසේද?" සහ "පාලකයක් සඳහා `HWND` එකක් ලබා ගන්නේ කෙසේද?" — සහ දෙවැන්නට පිළිතුර **ඔබට එය කළ නොහැක, සහ ඔබ එකක් ව්‍යාජ ලෙස සාදන්නත් නොකළ යුතුය.**

| සාමාජිකයා | අගය | හේතුව |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | එක් එක් පාලකය සඳහා OS කවුළුවක් නොපවතී. `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle` සඳහාද එසේමය. |
| `WindowBase.Handle` | පාරාන්ධ (opaque), ශුන්‍ය නොවන ටෝකනයක් | **මෙය `HWND` එකක් නොවේ.** එය පවතින්නේ WinForms කේතය `Invoke` කිරීමට පෙර handle නිර්මාණය බල කිරීමට නිතිපතා `.Handle` කියවන නිසාත්, ශුන්‍යය ආපසු දීමෙන් එම රටාව බිඳෙන නිසාත්ය. අර්ථවත් වන්නේ managed කේතය තුළ පමණි. |
| `WindowBase.PlatformHandle` | සැබෑ ස්වදේශීය handle එක, නැතහොත් ශුන්‍යය | සැබෑම එක — Avalonia backend එකේ `HWND`/`NSWindow`/`XID`, WinForms backend එකේ සැබෑ `HWND` එකක්. Uno සහ Headless මත ශුන්‍යය. |

**ව්‍යාජ සෑදීම පිළිබඳ නීතිය:** ව්‍යාජ ලෙස සාදන ලද handle එකක් ආරක්ෂිත වන්නේ එය ඔබ පාලනය කරන managed කේතය හරහා පමණක් ගමන් කරන තාක් පමණි. එය ස්වදේශීය කේතයට ඇතුළු වූ මොහොතේම ආරක්ෂිත වීම නවතී — LibVLC හි `libvlc_media_player_set_hwnd`, mpv හි `--wid`, GStreamer හි `GstVideoOverlay.set_window_handle` යන සියල්ල එය OS වෙත (`SetParent`, `CreateWindowEx`, `SetWindowPos`) යවන අතර, OS විසින් ගොතන ලද අගයක් ඉවසන්නේ නැත.

### මාර්ගය A — `NativeControlHost`
{:#module-9-route-a}

සහාය දක්වන සන්ධිය (seam): ඔබගේ පාලකය සෘජුකෝණාස්‍රයක් වෙන් කර ගන්නා අතර, backend එක එය Skia පෘෂ්ඨය මත අතිච්ඡාදනය (overlay) කළ සැබෑ toolkit මූලද්‍රව්‍යයකින් පුරවයි; එය placeholder එකේ සීමා, clip සහ දෘශ්‍යතාවයට ගැළපෙන සේ තබා ගනී. Avalonia, Uno, GTK 4 සහ WinForms backend මත ලබා ගත හැක; Headless සහ Terminal මත නොමැත.

**C#**

```csharp
using Majorsilence.Forms;

var host = new NativeControlHost {
    Name = "mapHost",
    Dock = DockStyle.Fill
};

// toolkit එකේම මූලද්‍රව්‍ය වර්ගය පවරන්න. Avalonia backend එකේ එය Avalonia Control එකකි:
host.NativeControl = new Avalonia.Controls.Button { Content = "I am a real Avalonia button" };

Controls.Add (host);

// null සැකසීමෙන් ධාරකය කළ මූලද්‍රව්‍යය නැවත ඉවත් වේ.
host.NativeControl = null;
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Dim host As New NativeControlHost With {
    .Name = "mapHost",
    .Dock = DockStyle.Fill
}

' toolkit එකේම මූලද්‍රව්‍ය වර්ගය පවරන්න. Avalonia backend එකේ එය Avalonia Control එකකි:
host.NativeControl = New Avalonia.Controls.Button With {
    .Content = "I am a real Avalonia button"
}

Controls.Add(host)

' Nothing සැකසීමෙන් ධාරකය කළ මූලද්‍රව්‍යය නැවත ඉවත් වේ.
host.NativeControl = Nothing
```

![Majorsilence පෝරමයක් තුළ ධාරකය කළ ස්වදේශීය Avalonia බොත්තමක්]({{ '/assets/img/example-native.png' | relative_url }})

*එම කේතය ක්‍රියාත්මක වන අයුරු: Avalonia `Button` එක සැබවින්ම එහි ඇත, Skia පෘෂ්ඨයට ඉහළින් ධාරකය කර ඇත. බොත්තම් හැඩතල (chrome) නොමැතිව හුදු පෙළක් ලෙස විදැහෙන බව සලකන්න — ධාරකය කළ ස්වදේශීය පාලකයක් හැඩගැන්වෙන්නේ **ධාරක යෙදුමේ** Avalonia styles මගිනි, සහ backend එක කිසිදු තේමාවක් ස්ථාපනය නොකරන අවම Avalonia යෙදුමක් ආරම්භ කරයි. සන්ධිය ක්‍රියා කරයි; හැඩගැන්වීම සැපයීම ඔබගේ වගකීමයි. සිතියමක් හෝ වීඩියෝ දර්ශනයක් වැනි තමන්ම අඳින පෘෂ්ඨයක් වෙනුවට සැබෑ ස්වදේශීය UI ධාරකය කිරීමට ඔබ සැලසුම් කරන්නේ නම්, ඒ සඳහා කාලය වෙන් කරන්න.*

දැනගත යුතු කරුණු තුනක්. **Airspace සීමා:** overlay එක ඔබ අඳින ලද අන්තර්ගතයට *ඉහළින්* ඇති ස්වදේශීය මූලද්‍රව්‍යයකි, එබැවින් framework එක අඳින කිසිවක් එයට ඉහළින් පෙන්විය නොහැක (GTK 4 ව්‍යතිරේකයකි — එය සෑම widget එකක්ම එක් render tree එකකට සංයෝජනය කරයි, එබැවින් එහි airspace ගැටලුවක් නැත). **හැඩගැන්වීම Majorsilence.Forms වෙතින් උරුම නොවේ** — ඉහත තිර රුව බලන්න. සහ **වැරදි වර්ගයක් පැවරීම නිහඬව අසාර්ථක වේ** — `NativeControl` හි වර්ගය `Object` වන අතර, සෑම backend එකක්ම එහි වර්ගය පරීක්ෂා කර, නොගැළපේ නම් සරලවම ආපසු යයි; කිසිවක් throw නොවේ, කිසිවක් log නොවේ, කිසිවක් නොපෙනේ. Uno backend එකට දෙන Avalonia `Control` එකක් හරියටම එයම කරයි; GTK 4 වෙත දෙන WinForms පාලකයක්ද එසේමය. ඔබගේ ස්වදේශීය අන්තර්ගතය නොපෙනේ නම්, පළමුව වර්ගය පරීක්ෂා කරන්න: Avalonia `Control`, Uno `UIElement`, `System.Windows.Forms.Control`, `Gtk.Widget`.

### මාර්ගය B — frame callbacks හරහා වීඩියෝ (නිර්දේශිතයි)
{:#module-9-route-b}

ස්වදේශීය පෘෂ්ඨයක් ධාරකය කරනවා වෙනුවට, player එකෙන් decode කළ frames ලබාගෙන ඔබම ඒවා Skia වෙත අඳින්න. එය ඔබ අඳින අනෙක් සියල්ල සමඟ නිසි ලෙස සංයෝජනය වන අතර, airspace ගැටලුව සහ handle ගැටලුව යන දෙකම සම්පූර්ණයෙන්ම මඟහරී. හැඩය:

**C#**

```csharp
public class VideoSurface : Control
{
    private SKBitmap? frame;

    // ඔබගේ player එකේ frame callback එකෙන් කැඳවේ, එය භාවිත කරන ඕනෑම thread එකක.
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

    ' ඔබගේ player එකේ frame callback එකෙන් කැඳවේ, එය භාවිත කරන ඕනෑම thread එකක.
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

![decode කළ frame එකක් සංයෝජනය කරන frame-callback වීඩියෝ පෘෂ්ඨය]({{ '/assets/img/example-video.png' | relative_url }})

*decoder එකක් වෙනුවට කෘත්‍රිමව සාදන ලද frame එකක් සමඟ එම කේතයම. bitmap එක පාලකයේ Skia canvas එකට කෙලින්ම අඳින බැවින්, ඔබ අඳින අනෙක් සියල්ල සමඟ එය සංයෝජනය වේ — airspace නැත, handle නැත, සහ Headless ඇතුළු සෑම backend එකකම එය එක සමානව ක්‍රියා කරයි (ඔබ එය unit-test කරන්නේ එලෙසයි).*

සම්පූර්ණ සංසන්දනය සහ දන්නා හිඩැස් සඳහා [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) බලන්න.

**අභ්‍යාසය 9.** ඔබගේ කේත පදනමේ ඇති සෑම `.Handle` එකක්ම සොයාගෙන එක් එක් භාවිතය වර්ගීකරණය කරන්න: handle නිර්මාණය බල කිරීම (කමක් නැත — තබා ගන්න), managed කේතයට යැවීම (කමක් නැත), හෝ ස්වදේශීය කේතයට යැවීම (වෙනස් කළ යුතුමය). සැබවින්ම ව්‍යාකූල වන දෝෂ වර්ගයක් වළක්වන විනාඩි පහක grep එකකි.

---

## Module 10 — නිකුත් කිරීම: CI, අනුවාද කළමනාකරණය සහ යාවත්කාලීනව සිටීම
{:#module-10}

**ප්‍රතිඵලය:** මෙම framework එක සැබවින්ම ඇති කරන ප්‍රතිගාමී දෝෂ (regressions) ඔබගේ pipeline එක අල්ලා ගනී, සහ හිඩැසකට මුහුණ දුන් විට කළ යුත්තේ කුමක්දැයි ඔබ දනී.

### ඔබගේ pipeline එකට ද්වාර (gates) යොදන්න
{:#module-10-ci}

| ද්වාරය | විධානය | අල්ලා ගන්නේ |
|---|---|---|
| පිරිසිදු build | `dotnet build --configuration Release` | අනතුරු ඇඟවීම් ගොඩගැසීමට පෙර |
| පරීක්ෂණ | `dotnet test --configuration Release --no-build` | [module 8](#module-8) හි සියල්ල — display එකක් අවශ්‍ය නැත |
| සංක්‍රමණ අපගමනය (drift) | `majorsilence-migrate <sln> --dry-run --strict` | ඔබ තවමත් අභිසාරී වෙමින් සිටියදී, branch එකකට පැමිණෙන මොහොතේම සිතියම්ගත නොකළ නව යොමුවක් |
| HiDPI | ඔබගේ පරිමාණනයට සංවේදී පරීක්ෂණ මත `MF_HEADLESS_SCALE=2` | පරිමාණය 1 හිදී පමණක් ක්‍රියා කරන පිරිසැලසුම — සහ තවමත් තමන්ගේම canvas එක පරිමාණනය කරන අභිරුචි පාලකයක් ([module 4](#module-4-paint)) |
| බ්‍රවුසර කේතයේ අවහිර කරන ඇමතුම් | `MFB001`–`MFB003` analyzer, හවුල් UI පුස්තකාලයේ `.editorconfig` හි `majorsilence_forms.browser_target = true` සමඟ, සහ එම ව්‍යාපෘතියේ අනතුරු ඇඟවීම් දෝෂ ලෙස සලකමින් | පිටුව throw කරන හෝ ඇඹරී නතර කරන `ShowDialog`/`MessageBox.Show`/`.Result`/`Thread.Sleep` එකක් ([module 6](#module-6-async)) |
| බ්‍රවුසර boot | ඔබගේ wasm head එක `dotnet publish` කිරීම + headless-Chromium smoke test එකක් | wasm pipeline එක බිඳ වැටීම |

ඔබ බ්‍රවුසරය ඉලක්ක කරන්නේ නම් අවසාන එක එලෙසම ගැනීම වටී: **wasm ඉලක්කයක් build කිරීම එය ක්‍රියා කරන බවට සාක්ෂියක් නොවේ.** wasm-tools pipeline එක (emcc/wasm-opt ස්වදේශීය link එක) ධාවනය කරන්නේ `dotnet publish` වන අතර, bundle එක සනාථ කරන්නේ බ්‍රවුසරයක සැබෑ boot එකක් පමණි. සාර්ථක `dotnet build` එකක් ඒ ගැන ඔබට කිසිවක් නොකියයි. framework එකේම CI මෙය කරන්නේ gallery head එක තේරුම් ගන්නා `?check=<name>` query string එකක් සහ publish කළ bundle එක headless Chrome තුළ boot කර, නම් කළ එක් එක් check එක ධාවනය කර, ප්‍රතිඵලය අපේක්ෂිත වගුවක් සමඟ සසඳන කුඩා Node script එකක් (`samples/Gallery.Wasm/tools/modal-check.mjs`) මගිනි — async-dialog නීතිය සනාථ කළේ modal checks ය. හැඩය පිටපත් කරන්න: ඔබගේම head එකේ `?check=` switch එකකට වැය වන්නේ එක් සවස් වරුවක් පමණක් වන අතර, එය "publish විය" යන්න "ධාවනය විය" බවට පත් කරයි.

### අනුවාද විනය
{:#module-10-versioning}

- **ඔබගේ පැකේජ අනුවාදය ස්ථිර කරන්න.** මෙය බීටා මෘදුකාංගයකි; API එක ස්ථාවර වෙමින් පවතී. ස්ථිර කරන්න, සැලකිල්ලෙන් යාවත්කාලීන කරන්න, සහ release notes කියවන්න — [module 5 හි පිරික්සුම් ලැයිස්තුවේ](#module-5-checklist) ලේඛනගත කර ඇති බිඳ දමන වෙනස්කම් (breaking changes) අනුවාද අතර පැමිණෙන වර්ගයේ දේවල්ය.
- **core, backend සහ migrator අනුවාද එකට පෙළගස්වා තබන්න.** migrator හි `--package-version` පෙරනිමියෙන් එහිම අනුවාදය ගනී, මන්ද මෙවලම සහ පැකේජ එකම නිකුතුවෙන් නිකුත් වන බැවිනි.
- **අනුවාදය මධ්‍යගත කරන්න**, එවිට යාවත්කාලීන කිරීමක් එක් සංස්කරණයකි. `Directory.Packages.props` තුළ:

  ```xml
  <Project>
    <PropertyGroup>
      <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    </PropertyGroup>
    <ItemGroup>
      <PackageVersion Include="Majorsilence.Forms" Version="26.9.0" />
      <PackageVersion Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
      <PackageVersion Include="Majorsilence.Forms.Headless" Version="26.9.0" />
    </ItemGroup>
  </Project>
  ```

  ඔබ `Majorsilence.Forms.Mvvm`, `.Theming.WinForms`, `.Animation` හෝ දෙවන backend එකක් භාවිතයට ගන්නා විට ඒවා එම ලැයිස්තුවටම එක් කරන්න — පවුලේ සෑම පැකේජයක්ම එකම නිකුතුවෙන්, එකම අනුවාදයෙන් නිකුත් වේ.

- **වෙනත් කිසිවෙකු වෙත ළඟා වීමට පෙර, ඔබගේ golden-image පරීක්ෂණ සාර්ථක (green) තත්ත්වයේ තිබියදී branch එකක යාවත්කාලීන කරන්න.** විදැහුම්කරණ (rendering) වෙනස්කම් යනු හරියටම එම පරීක්ෂණ තිබෙන්නේ ඒ සඳහාය.

### හිඩැසකට මුහුණ දුන් විට
{:#module-10-gaps}

ඔබ මුහුණ දෙනු ඇත. දැනගැනීමට ප්‍රයෝජනවත් කරුණ නම්, මෙම framework එකේ හිඩැස් කිහිපයක් සොයාගත්තේ API පෘෂ්ඨය කියවීමෙන් නොව, *සැබෑ යෙදුම් සංක්‍රමණය කිරීමෙන්* පමණක් බවයි — WinForms ක්‍රීඩාවක්, ribbon පාලක පුස්තකාලයක්. ඔබගේ කණ්ඩායම සැබෑ දෙයක් port කර නිහඬ no-op එකකට මුහුණ දුන්නොත්, එම සොයාගැනීමට ඔබගේම ව්‍යාපෘතියෙන් ඔබ්බට වටිනාකමක් ඇත.

- **no-op වෙනුවට throw කරන සාමාජිකයෙක්** [stub ප්‍රතිපත්තියට](#module-3-stub-policy) පටහැනිය — එය දෝෂයක් ලෙස වාර්තා කරන්න.
- **ඔබට දිනක් අහිමි කළ නිහඬ no-op එකක්** ද issue එකක් වටී: සාමාජිකයාගේ නම පමණක් නොව *රෝග ලක්ෂණය* සමඟ එය ගොනු කරන්න ("`X` කිසිවක් නොකළ නිසා, sprites සුදු කොටුවක් සමඟ ඇඳුණි"), මන්ද ඊළඟ කණ්ඩායමට එය සොයාගත හැකි කරන්නේ රෝග ලක්ෂණයයි. ඔබ ලියූ [pinning test](#module-3-pin) එක අමුණන්න — එය ධාවනයට සූදානම් ප්‍රතිනිෂ්පාදනයකි (reproduction).
- **අවහිර වී ඇති අතර බලා සිටිය නොහැකිද?** ව්‍යාපෘතිය AI-සහායෙන් හෝ නැතිව pull requests පිළිගන්නා අතර, ඒ සඳහා සරල මට්ටමක් ඇත: `dotnet build --configuration Release` සහ `dotnet test` පිරිසිදුව සමත් වීම, නව හැසිරීම compile වන බව නොව එය *ක්‍රියා කරන* බව සනාථ කරන පරීක්ෂණවලින් ආවරණය වීම, සහ [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) එය විස්තර කරන කේතය සමඟම යාවත්කාලීන වීම. ඔබව අවහිර කරන නිශ්චිත හිඩැස වසා දැමීම, සාමාන්‍යයෙන් එය වටා සැලසුම් කිරීමට වඩා බෙහෙවින් කුඩා කාර්යයකි.

**අභ්‍යාසය 10.** ඉහත ද්වාර ඔබගේ repository එකට එක් කරන්න. ඉන්පසු [module 3](#module-3) හි අභ්‍යාසයෙන් ඔබගේ යෙදුමට සැබවින්ම අවශ්‍ය එක් හිඩැසක් ගෙන, කණ්ඩායමක් ලෙස තීරණය කරන්න: එය වටා සැලසුම් කිරීමද, නැතහොත් upstream හි එය වසා දැමීමද. කුමක්ද සහ ඇයි යන්න ලියා තබන්න.

---

## උපග්‍රන්ථය A — රෝග ලක්ෂණ අනුව දෝෂ නිරාකරණය
{:#appendix-a}

| රෝග ලක්ෂණය | බොහෝ විට හේතුව | විසඳුම |
|---|---|---|
| යෙදුම ආරම්භ නොවේ / කවුළුවක් නොපෙනේ | backend පැකේජයක් යොමු කර නැත — core පැකේජයට තනිවම තිරය මත කවුළුවක් තැබිය නොහැක | `Majorsilence.Forms.Avalonia` (හෝ Uno/Headless) එක් කරන්න |
| සංක්‍රමණයෙන් පසු `Bitmap`/`Font`/`Pen` මත ambiguous-reference දෝෂ | Majorsilence ආදේශක අසලම `System.Drawing.Common` තවමත් යොමු කර ඇත | පැකේජ යොමුව ඉවත් කරන්න (migrator එය ස්පර්ශ කරන සෑම ව්‍යාපෘතියකම මෙය කරයි) |
| `SystemColors` / `ColorTranslator` මත CS0104 (C#) / ද්විත්වාර්ථය (VB) | දෙකම `System.Drawing.Primitives` හි ඇති බැවින්, තබාගත් `System.Drawing` import එක හරහා ඒවා තවමත් resolve වේ | alias එක එක් කරන්න — `using SystemColors = Majorsilence.Forms.SystemColors;` / `Imports SystemColors = Majorsilence.Forms.SystemColors` |
| කිසිදා WinForms ගැන සඳහන් නොකළ class library එකක් compile නොවේ | එහි `Majorsilence.Forms.Drawing.*` වෙත නැවත ලියවුණු image/font සහායකයක් තිබුණි | `Majorsilence.Forms` යොමුව එක් කරන්න; "නැවත ලිවීම ස්පර්ශ කරන ව්‍යාපෘති" යනු "WinForms ව්‍යාපෘති" වලට වඩා පුළුල්ය |
| Designer සිදුවීම් සම්බන්ධ කිරීම compile නොවේ (`new EventHandler<KeyEventArgs>(…)`) | සිදුවීම් delegate වර්ග දැන් WinForms හා ගැළපේ | wrapper එක ඉවත් කරන්න, නැතහොත් WinForms delegate එක නම් කරන්න (`KeyEventHandler`, `MouseEventHandler`, …) |
| `Click` හසුරුවනයක `e.X` / `e.Button` නොමැත | WinForms හිද `Click` යනු `EventArgs` සිදුවීමකි | `MouseClick` වෙත මාරු වන්න; මෙනු අයිතමයක නම්, ස්ථානය අයිති පාලකයෙන් ගන්න |
| VB: `Anchor`/`DockStyle` flags මත `Or` සහ `|` | VB හි flag සංයෝජනය `Or` භාවිත කරයි | `AnchorStyles.Top Or AnchorStyles.Left` |
| VB: පරීක්ෂණ කිසිදු backend එකකට එරෙහිව ධාවනය වේ | VB හි module initializer නැත — C# `<ModuleInitializer>` රටාව නිහඬව කිසිවක් නොකරයි | backend එක `<AssemblyInitialize>` / `<SetUpFixture>` වෙතින් ස්ථාපනය කරන්න — [module 8](#module-8-headless) බලන්න |
| බෙදූ පිරිසැලසුමක දිශානතිය පෙරළී ඇත | `SplitContainer.Orientation` දැන් අදහස් කරන්නේ *තීරුවේ* දිශාවයි | ඔබ සකසන අගය ප්‍රතිලෝම කරන්න (කිසිවක් අනතුරු අඟවන්නේ නැත — අගයන් දෙකම compile වේ) |
| පළමු resource කියවීමේදී `InvalidCastException` | උත්පාදිත resource designer එකක් `System.Resources.ResourceManager` ප්‍රතිඵලයක් cast කරයි | `Majorsilence.Forms.ComponentResourceManager` භාවිත කරන්න (migrator උත්පාදිත designers ස්වයංක්‍රීයව නැවත ලියයි) |
| runtime හිදී resource එකක් `null` වෙත resolve වේ | resx ඇතුළත් කිරීම `ResXFileRef` එකකි (සම්බන්ධිත ගොනුවක්, inline දත්ත නොවේ) | resource එක inline කරන්න, නැතහොත් ඔබම එය load කරන්න |
| සෑම icon එකක්ම නොපෙනේ, කිසිවක් log නොවේ | සාපේක්ෂ asset path එකක් වැරදි **working directory** එකකට එරෙහිව resolve විය; නැති ගොනුව throw කරනවා වෙනුවට 1×1 placeholder එකක් බවට පත් විය | assets `AppContext.BaseDirectory` ට එරෙහිව resolve කරන්න — [module 0](#module-0) බලන්න |
| icons නැත්තේ බ්‍රවුසර build එකේ පමණි | එහි සැබෑ ගොනු පද්ධතියක් නැත; සාපේක්ෂ ගොනු load කිරීම් ක්‍රියා කළ නොහැක | images embedded resources ලෙස නිකුත් කරන්න — [module 6](#module-6-singleview) බලන්න |
| property එකක් සැකසීමෙන් කිසිදු දෘශ්‍ය බලපෑමක් නැත | [stub ප්‍රතිපත්තියට](#module-3-stub-policy) අනුව එය stub එකකි — ගබඩා කර ආපසු කියවයි, කිසිවක් එය භාවිත නොකරයි | matrix පේළිය පරීක්ෂා කරන්න. එය ඒ වෙනුවට *throw* කරයි නම්, එය දෝෂයකි — වාර්තා කරන්න |
| ධාරකය කළ ස්වදේශීය අන්තර්ගතය නොපෙනේ | backend එක ඔබගේ ස්වදේශීය පාලකයේ වර්ගය පරීක්ෂා කර, නොගැළපුණු නිසා නිහඬව ආපසු ගියේය | වර්ගය පරීක්ෂා කරන්න: Avalonia backend සඳහා Avalonia `Control`, Uno සඳහා Uno `UIElement`, WinForms backend සඳහා `System.Windows.Forms.Control`, GTK 4 සඳහා `Gtk.Widget` |
| Maximize/minimize කිසිවක් නොකරයි; `Title` නොසලකා හැරේ | ඔබ සිටින්නේ තනි-දර්ශන (single-view) වේදිකාවක (browser/Android/iOS/Terminal) — window manager එකක් නැත | අපේක්ෂිතයි. [module 6](#module-6-singleview) බලන්න |
| HiDPI හිදී ක්ලික් කිරීම් වැරදි තැනක වැටේ | input routing තාර්කික සහ උපාංග ඒකක මිශ්‍ර කරයි — 26.0.30 හි framework දෝෂයක්, පසුව නිවැරදි කර CI හි පරිමාණය 2 හිදී ද්වාරගත කර ඇත | යාවත්කාලීන කරන්න (26.9.0 හෝ පසු). එය දිගටම පවතී නම්, අවකාශ දෙක මිශ්‍ර කරන්නේ ඔබගේම කේතයයි — [module 8](#module-8-headless) බලන්න |
| අභිරුචි පාලකයක් HiDPI display එකක දෙගුණ ප්‍රමාණයෙන් අඳී, 1× හිදී හරි | paint canvas එක දැන් තාර්කිකය; පාලකය තවමත් `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` කැඳවා දෙවරක් පරිමාණනය කරයි | `ScaleTransform` ඉවත් කරන්න — [module 4](#module-4-paint) බලන්න. `MF_HEADLESS_SCALE=2` යටතේ පරීක්ෂා කරන්න |
| Owner-drawn අයිතම (`DrawItem`, `DrawNode`, `CellPainting`) HiDPI හිදී කුඩා වී හෝ විස්ථාපනය වී පෙනේ | පාලකයේ තාර්කික `ClientRectangle` මෙන් නොව, එම සිදුවීම් තවමත් උපාංග පික්සල වලින් ඇත | `e.Bounds` සහ `e.Graphics` එකට භාවිත කරන්න, පාලකයේම තාර්කික ජ්‍යාමිතිය මිශ්‍ර නොකරන්න; [module 4](#module-4-paint) බලන්න |
| බ්‍රවුසරයේ, Android හෝ iOS මත `ShowDialog` / `MessageBox.Show` වෙතින් `PlatformNotSupportedException` | එම පේළිවලට nested modal loop එකක් ධාවනය කළ නොහැක; exception එක await කළ හැකි සමාන්තරය (twin) නම් කරයි | `async` හසුරුවනයකින් `ShowDialogAsync` / `MessageBox.ShowAsync` භාවිත කරන්න — [module 6](#module-6-async) බලන්න. ඉතිරිය build එක සොයා ගන්නා සේ `MFB` analyzer එක සක්‍රිය කරන්න |
| ක්ලික් එකකින් පසු බ්‍රවුසර tab එක ඇඹරී නතර වේ | යමක් පිටුවේ තනි thread එක අවහිර කළේය — `.Result`, `.Wait()`, `Thread.Sleep` | එය `await` කරන්න (`MFB002`/`MFB003` මේවා සලකුණු කරයි) — [module 6](#module-6-async) බලන්න |
| GTK 4 කවුළුවක් `Location` / `StartPosition` නොසලකා හරී | GTK 4 ඉහළ මට්ටමේ කවුළු client-side ස්ථානගත කිරීම ඉවත් කළේය; තීරණය කරන්නේ window manager ය | අපේක්ෂිතයි. එම backend එකේ `Location` යනු ගබඩා කළ ඉඟියක් පමණි — [module 6](#module-6) බලන්න |
| GTK 4 / Headless මත file pickers කිසිවක් ආපසු නොදෙයි | එම backends වලට තවමත් ස්වදේශීය picker එකක් නැති බැවින්, framework එකේම fallback සංවාද කවුළුව භාවිත වේ | අපේක්ෂිතයි; fallback එක ක්‍රියා කරයි. `Gtk.FileDialog` සම්බන්ධ කිරීම පසුවට කල් දැමූ කාර්යයකි |
| WinForms සංවාද කවුළුවක් එහි Majorsilence මාපියාට modal නොවේ | `OwnerHandleResolver` කිසිදා සම්බන්ධ කර නැත | ආරම්භයේදී එක් වරක් එය සම්බන්ධ කරන්න — [module 7](#module-7-a) බලන්න |
| Windows මත deadlock හෝ ද්විත්ව message loop | `Application.Run` දෙකම කැඳවා ඇත | process එකකට එක් ධාරකයක්; අනෙක් දිශාව සඳහා bridge එක භාවිත කරන්න |
| macOS/Linux මත interop වෙතින් `PlatformNotSupportedException` | එහි `System.Windows.Forms` නොපවතී | interop ඇමතුම් Windows පරීක්ෂාවක් පිටුපස ආරක්ෂා කරන්න |
| CSS තේමා නීතියකට කිසිදු බලපෑමක් නැත, දෝෂයක්ද නැත | පාලකයක් එම property එක කේතයෙන් සකසා ඇත (`button.BackColor = …`) — WinForms හි මෙන්, පැහැදිලි පාලක-අනුව අගයන් ජය ගනී | පාලක-අනුව අගය ඉවත් කරන්න, නැතහොත් එය පිළිගන්න. ඊට වෙනස්ව, *අක්ෂර වැරදි* නීතියක් සැමවිටම දෝෂයක් දෙයි — `ThemeStyleSheet.Parse` diagnostics පරීක්ෂා කරන්න ([උපග්‍රන්ථය D](#appendix-d)) |
| `BindCommand` කළ බොත්තමක් එක් ක්ලික් එකකට එහි command එක දෙවරක් ධාවනය කරයි | එම පාලකයේම `Button.Command` ද සකසා ඇත | එකක් හෝ අනෙක භාවිත කරන්න ([උපග්‍රන්ථය E](#appendix-e)) |

---

## උපග්‍රන්ථය B — සැබෑ කේත පදනමක් සඳහා යෙදවීමේ සැලැස්ම
{:#appendix-b}

බැඳීමට (commitment) පෙර සාක්ෂි ලැබෙන අනුපිළිවෙළක්.

1. **Spike (දින 1).** Modules 0–3. සැකිලි යෙදුම සෑම සංවර්ධකයෙකුගේම OS මත ධාවනය වීම, සජීවී ගැලරිය ගවේෂණය කිරීම, ගැළපුම් matrix එක කියවීම. භාරදීම: ඔබගේ යෙදුමේ ප්‍රධාන UI පරායත්තතා 20 ක ලැයිස්තුවක්, implemented / stubbed / absent ලෙස ලකුණු කර.
2. **නියමු සංක්‍රමණය (දින 2–5).** කුඩා, සැබෑ, අවදානම අඩු අභ්‍යන්තර යෙදුමක් තෝරන්න. branch එකක migrator ධාවනය කර, එය build වන තත්ත්වයට ගෙනවිත්, [අතින් නිවැරදි කිරීමේ පිරික්සුම් ලැයිස්තුව](#module-5-checklist) හරහා යන්න. භාරදීම: ක්‍රමාංකනය කළ KLOC-අනුව ඇස්තමේන්තුවක් සහ සැබවින්ම *ඔබව* අවහිර කරන හිඩැස් ලැයිස්තුවක්.
3. **භාවිතයට ගැනීමේ හැඩය තීරණය කරන්න.** විකල්ප හතරක්, එකිනෙක බැහැර නොවේ:
   - **නව යෙදුම** — කෙලින්ම Majorsilence.Forms මත ආරම්භ කරන්න ([module 2](#module-2)).
   - **පැරණි යෙදුමක නව තිර** — Windows මත Direction B interop, ඔබ නිකුත් කරන කිසිවක් වෙනස් නොකර ([module 7](#module-7-b)).
   - **පැරණි යෙදුමක එක් වරකට එක් පාලකයක්** — WinForms හෝ WPF backend ([module 7](#module-7-c)), එය .NET Framework 4.8 මතද ක්‍රියා කරන බැවින්, UI port එක runtime යාවත්කාලීන කිරීම බලා සිටිය යුතු නැත.
   - **සම්පූර්ණ යෙදුම් සංක්‍රමණය** — migrator, ඔබ C# භාවිත කරන්නේ නම් විකල්පයක් ලෙස `--dual-build` සමඟ ([module 5](#module-5-dualbuild)). **VB කණ්ඩායම්: ඒ වෙනුවට cut-over එකක් සැලසුම් කරන්න** — dual-build ඔබට ලබා ගත නොහැක.
4. **තොග වැඩට පෙර පරීක්ෂණ දැල ස්ථාපනය කරන්න.** නියමු යෙදුම මත [Module 8](#module-8): locator නම් කිරීමේ සම්මුතිය, CI හි headless පරීක්ෂණ, ඔබ සැලකිලිමත් වන තිර සඳහා golden images. විශාල යෙදුම සංක්‍රමණය කිරීමට *පෙර* මෙය කරන්න — port එක නිවැරදිව හැසිරෙන බව ඔබ දැනගන්නේ පරීක්ෂණ මගිනි.
5. **CI ද්වාර සකසන්න** ([module 10](#module-10-ci)), `--strict` සංක්‍රමණ අපගමනය ඇතුළුව.
6. **කොටස් වශයෙන් සංක්‍රමණය කරන්න**, වරකට එක් යෙදවිය හැකි ඒකකයක්, සෑම එකක්ම ද්වාර මත සාර්ථකව (green) අවසන් කරමින්.
7. **සොයාගැනීම් ආපසු ලබා දෙන්න** ([module 10](#module-10-gaps)). ඔබ මුහුණ දෙන නිහඬ no-ops යනු API කියවීමෙන් වෙනත් කිසිවෙකුට සොයාගත නොහැකි ඒවාය.

මේවා පැහැදිලිව සහ කලින්ම තීරණය කරන්න, මන්ද සෑම එකක්ම සැලැස්ම සීමා කරයි: ඔබට සැබවින්ම අවශ්‍ය වේදිකා මොනවාද (desktop-පමණක් යනු "iOS ද සමඟ" යන්නට වඩා බෙහෙවින් වෙනස් ව්‍යාපෘතියකි), ඔබට දෘශ්‍ය designer එකක් අවශ්‍යද (තවමත් එකක් නැත), ඔබ vendor පාලක කට්ටලයක් මත රඳා පවතිනවාද (Telerik සඳහා ගැළපුම් ස්තරයක් ඇත; අනෙක් vendors සඳහා `--map` ගොනුවක් සහ අතින් කරන වැඩ අවශ්‍යය), Windows වලින් පිටත ප්‍රවේශ්‍යතා (accessibility) බැඳීමක් ඔබට තිබේද, ඔබගේ කේත පදනම VB ද (dual-build නොව cut-over), ඔබගේ යෙදුමේ කිසිවක් ස්වදේශීය අන්තර්ගතය ධාරකය කරනවාද හෝ කවුළු handles කියවනවාද, සහ — බ්‍රවුසර හෝ දුරකථන head එකක් විෂය පථයට අයත් නම් — ඔබගේ සංවාද කවුළු මුල සිටම async ලෙස ලියා තිබේද ([module 6](#module-6-async)).

---

## උපග්‍රන්ථය C — යොමු කාඩ්පත
{:#appendix-c}

**අඩවි පිටු:** [ආරම්භ කිරීම]({{ '/si/getting-started/' | relative_url }}) ·
[සංක්‍රමණය]({{ '/si/migration/' | relative_url }}) ·
[නිදසුන්]({{ '/si/samples/' | relative_url }}) · [වේදිකා backends]({{ '/si/backends/' | relative_url }}) ·
[ස්වයංක්‍රීයකරණය සහ UI පරීක්ෂණ]({{ '/si/automation/' | relative_url }}) ·
[ස්වදේශීය interop]({{ '/si/native-interop/' | relative_url }}) · [නිතර අසන ප්‍රශ්න]({{ '/si/faq/' | relative_url }}) ·
[බ්ලොග්]({{ '/si/blog/' | relative_url }}) · [සජීවී බ්‍රවුසර ගැලරිය]({{ '/gallery/' | relative_url }})

**repository එකේ — යෙදුම් කණ්ඩායමකට සැබවින්ම අවශ්‍ය ලේඛන:**

| ලේඛනය | එය කියවිය යුත්තේ |
|---|---|
| [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) | ඕනෑම සාමාජිකයෙකු මත රඳා පැවතීමට පෙර. එය විවෘතව තබා ගන්න |
| [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) | migrator ධාවනය කරන විට; සෑම බිඳ දමන වෙනසක්ම මෙහි ලේඛනගත කර ඇත |
| [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) | backend එකක් තෝරන විට; තාර්කික සහ උපාංග ඒකක; තනි-දර්ශන පේළි; async-dialog නීතිය සහ analyzer |
| [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) | CSS තේමාවක් ලියන විට — සම්පූර්ණ භාෂාවම එම එක් පිටුවේ ඇත |
| [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) | `Observe`/`BindText`/`BindCommand` සමඟ view models සම්බන්ධ කරන විට |
| [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md) | දුරකථන හැඩැති තිරයක් පිරිසැලසුම් කරන විට — `StackPanel`, `Card`, `RichListBox` |
| [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md) | `RequestAnimationFrame`, tweens, අඩු කළ චලනය (reduced motion), Headless clock |
| [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md) | ගැඹුරින් පරීක්ෂා කරන විට, අභිරුචි පාලකවල `IAutomationStateProvider` සහ MCP server ඇතුළුව |
| [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) | Windows මත එක් process එකක stacks දෙකම ධාවනය කරන විට |
| [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) | ස්වදේශීය අන්තර්ගතය හෝ වීඩියෝ ධාරකය කරන විට |

**මතක තබා ගැනීමට වටින විධාන:**

```
dotnet new install Majorsilence.Forms.Templates        # එක් වරක්
dotnet new majorsilenceforms -n MyApp                  # නව යෙදුම (හවුල් පුස්තකාලය + desktop head)
dotnet run --project MyApp
dotnet build --configuration Release && dotnet test --configuration Release --no-build
MF_HEADLESS_SCALE=2 dotnet test --configuration Release --no-build   # HiDPI ද්වාරය
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff   # සංක්‍රමණයක විෂය පථය මැනීම
majorsilence-migrate MySolution.sln --no-backup        # branch එකක එය ධාවනය කරන්න
majorsilence-migrate MySolution.sln --dry-run --strict # CI අපගමන ද්වාරය
dotnet tool install -g Majorsilence.Forms.Mcp          # AI agent එකකට යෙදුම මෙහෙයවීමට ඉඩ දෙන්න (module 8)
dotnet workload install wasm-tools && dotnet publish <YourWasmHead> -c Release -o out
dotnet run --project samples/ThemeStudio               # clone එකකින්: සජීවී CSS තේමා සංස්කාරකය (උපග්‍රන්ථය D)
```

**වෙනස් වන්නේ කුමක්දැයි අසන ඕනෑම අයෙකු සඳහා පේළි දෙකක සාරාංශය:** ඔබගේ imports `System.Windows.Forms` සිට `Majorsilence.Forms` වෙතත්, GDI+ සිට `Majorsilence.Forms.Drawing` වෙතත් මාරු වන අතර, ඔබ backend පැකේජයක් එක් කරයි. ඔබගේ පෝරම, designer ගොනු, සිදුවීම් හසුරුවන සහ ව්‍යාපාරික තර්කනය ඔබගේම ලෙස පවතී.

---

## උපග්‍රන්ථය D — CSS මගින් ඔබගේ යෙදුමට තේමා යෙදීම
{:#appendix-d}

**ප්‍රතිඵලය:** ඔබට එක් ගොනුවකින් සම්පූර්ණ යෙදුමක්ම නැවත හැඩගැන්විය හැකි අතර, තේමා භාෂාවට ප්‍රකාශ කළ හැකි සහ නොහැකි දේ දන්නා අතර, නීතියක් වැරදි වූ විට එය සොයා ගන්නේ කෙසේදැයි දනී.

framework එක සෑම පික්සලයක්ම තමන්ම අඳින බැවින් ([module 1](#module-1)), පෙනුම OS එකේ නොව framework එකේ කාරණයකි — සහ framework එක එය **CSS හි කුඩා, දැඩි ලෙස නිර්වචනය කළ උප කුලකයක්** ලෙස නිරාවරණය කරයි. තේමාවක් යනු `.css` ගොනුවකි; සම්පූර්ණ භාෂාවම එක් පිටුවකට ගැළපේ ([`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md)), සහ parser එක එයින් පිටත ඕනෑම දෙයක් පේළියක්, තීරුවක් සහ සහාය දක්වන විකල්පය සමඟ ප්‍රතික්ෂේප කරයි. framework එකේ මෙම කොටසේ හිතාමතාම **නිහඬ no-op නැත** — අක්ෂර වැරදි property එකක් දෝෂයකි, stub එකක් නොවේ. (මෙම උපග්‍රන්ථය එම ලේඛනයට සහ `ThemeStudio` නිදසුනට එරෙහිව පරීක්ෂා කරන ලදී, මෙම මාර්ගෝපදේශය සඳහා ධාවනය කර නැත. පැරණි `<Theme>` XML ආකෘතිය තවමත් ක්‍රියා කරන අතර CSS සමඟ මිශ්‍ර කළ හැක.)

### තේමාවක් load කිරීම
{:#appendix-d-load}

**C#**

```csharp
using Majorsilence.Forms;

// ගොනුවක් වහාම යොදන්න:
Theme.LoadFromCssFile ("Themes/ocean.css");

// නැතහොත් නමින් ලියාපදිංචි කර runtime හිදී මාරු කරන්න:
Theme.RegisterThemeCssFromFile ("Themes/ocean.css");   // ගොනුවේ @theme ශීර්ෂයෙන් "Ocean" ආපසු දෙයි
Theme.ApplyTheme ("Ocean");
Theme.SetBuiltInTheme (BuiltInTheme.Light);            // නැවත built-in එකකට; සියල්ල යළි සකසයි

// වත්මන් තේමාවෙන් ඔබගේම එකක් ආරම්භ කරන්න:
File.WriteAllText ("mine.css", Theme.ExportCss ("Mine", "Light"));
```

**VB.NET**

```vb
Imports Majorsilence.Forms

' ගොනුවක් වහාම යොදන්න:
Theme.LoadFromCssFile("Themes/ocean.css")

' නැතහොත් නමින් ලියාපදිංචි කර runtime හිදී මාරු කරන්න:
Theme.RegisterThemeCssFromFile("Themes/ocean.css")     ' ගොනුවේ @theme ශීර්ෂයෙන් "Ocean" ආපසු දෙයි
Theme.ApplyTheme("Ocean")
Theme.SetBuiltInTheme(BuiltInTheme.Light)              ' නැවත built-in එකකට; සියල්ල යළි සකසයි

' වත්මන් තේමාවෙන් ඔබගේම එකක් ආරම්භ කරන්න:
File.WriteAllText("mine.css", Theme.ExportCss("Mine", "Light"))
```

කිසිදු දිලිසීමක් (flash) නොපෙනීමට ඔබට අවශ්‍ය නම්, පළමු පෝරමය පෙන්වීමට පෙර තේමාව load කරන්න; පසුව යෙදීමෙන් විවෘතව ඇති සියල්ල නැවත අඳිනු ලැබේ.

### භාෂාව, එක් උදාහරණයකින්
{:#appendix-d-language}

ප්‍රකාශ වර්ග තුනක් — ශීර්ෂයක්, tokens සහ පාලක නීති — සහ වෙන කිසිවක් නැත:

```css
/* Ocean: ගැඹුරු නිල්-කොළ අඳුරු තේමාවක්. */
@theme "Ocean" extends Dark;             /* built-in එකකින් (Light, Dark, Classic, Aero, …) හෝ ලියාපදිංචි ඕනෑම තේමාවකින් ආරම්භ කරන්න */

:root {
  --brand: #1e90ff;                      /* ඔබගේම විචල්‍යය, පහත var() සමඟ යොමු කෙරේ */

  --accent-color: var(--brand);          /* tokens: එක් Theme property එකකට එකක්, kebab-case ලෙස */
  --background-color: #0a1929;
  --control-mid-color: #102a43;
  --foreground-color: #cfe8ff;
  --foreground-color-on-accent: white;
  --font-size: 14px;                     /* සම්පූර්ණ පික්සල පමණි — pt/em/rem/% දෝෂ වේ */
  --ui-font: "Segoe UI", "Noto Sans", sans-serif;
}

/* නීතියක් පාලක වර්ගයක් (TYPE) හැඩගන්වයි — කේතයෙන් තමන්ගේම වර්ණය සකසා නොමැති, යෙදුමේ සෑම Button එකක්ම. */
Button        { border: 1px solid #15395c; border-radius: 4px; box-shadow: 2px 2px #06101c; }
Button:hover  { background-color: var(--brand); color: white; }
Button:active { box-shadow: 0px 0px #06101c; }

TextBox, ComboBox, NumericUpDown { background-color: #061120; border-color: var(--border-low-color); }

/* Parts: පාලකයක් තමා තුළම අඳින කොටස්. */
DataGridView::header    { background-color: #2c2c30; color: #e8e8ea; font-weight: bold; }
DataGridView::selection { background-color: var(--accent-color); color: var(--foreground-color-on-accent); }
ScrollBar::thumb        { background-color: #55555c; border-radius: 4px; }
Menu::item:hover        { background-color: #34343a; }
```

ඒ ගැන ඔබගේ කණ්ඩායමට පැවසිය යුතු දේ, මන්ද මේ සෑම එකක්ම CSS ගැන ඇති අවබෝධය නොමඟ යවන තැනකි:

- **පළමුව tokens.** `:root` tokens පමණක් සැකසීමෙන්ම සෑම පාලකයක්ම *සහ* සෑම part එකක්ම නැවත වර්ණ ගැන්වේ; පෙරනිමි අගයන් ඔබට අවශ්‍ය දේ නොවන තැන්වල පමණක් පාලක නීති එක් කරන්න.
- **Selectors යනු පාලක වර්ග නාම වේ** (`Button`, `TextBox`, `DataGridView`, සහ සෑම Telerik compat පාලකයක්ම). classes නැත, ids නැත, descendant selectors නැත, `*` නැත — නීතියක් එම වර්ගයේ සෑම පාලකයකටම, එය කොතැනක තිබුණත්, අදාළ වේ. *එක්* පාලකයක් හැඩගැන්වීමට, කේතයෙන් `button.Style.BackgroundColor` (හෝ WinForms `BackColor`) සකසන්න; WinForms හි මෙන්ම, **පැහැදිලි පාලක-අනුව අගයන් සැමවිටම ජය ගනී**.
- **Pseudo-classes හතරක්** (`:hover`, `:active`, `:disabled`, `:focus`), සහ ඒවා එම තත්ත්වය සඳහා නැවත අඳින පාලක මත පමණි — අද `Button`, `LinkLabel` සහ `TrackBar`. `TextBox:hover` යනු පැහැදිලි කිරීමක් සහිත දෝෂයකි, නිහඬ කිසිවක් නැති බවක් නොවේ.
- **Cascade නැත, specificity නැත, `!important` නැත.** පසු ප්‍රකාශන පෙර ඒවා ප්‍රතිස්ථාපනය කරයි. `@import` නැත, `@media` නැත — තේමා දෙකක් ලියාපදිංචි කර කේතයෙන් එකක් තෝරන්න.
- **පිරිසැලසුම (layout) තේමා කළ නොහැක.** වර්ණ, දාර (borders), අරයන් (කොන අනුව), ඉරි සහිත දාර, දෘඪ offset `box-shadow` සහ fonts තේමා කළ හැක; `margin`/`padding` දෝෂ වේ — ඒවා කේතයෙන් සකසන්න.
- **Hex alpha අවසානයට එයි** (`#rrggbbaa`), XML ආකෘතියේ `#AARRGGBB` හි ප්‍රතිවිරුද්ධයයි.

### Theme Studio, සහ සහායකයෙකුට තේමාව ලිවීමට ඉඩ දීම
{:#appendix-d-studio}

`samples/ThemeStudio` (repo එකේ ඇත, GitHub releases වලට පෙර-build කළ binaries අමුණා ඇත) යනු සජීවී සංස්කාරකයකි: වම් පසින් CSS, දකුණු පසින් තේමා කළ හැකි සෑම පාලකයක්ම, යටින් parser එකේ diagnostics, ඔබ type කරන විටම නැවත යෙදේ — Studio එකේම කවුළුවටද. ගොනුවක් විවෘත කළ විට එය **නිරීක්ෂණය (watch)** කෙරේ, එබැවින් ඔබට එය ඔබගේම සංස්කාරකයේ සංස්කරණය කළ හැක, නැතහොත් කේතකරණ සහායකයෙකුට එය සංස්කරණය කිරීමට ඉඩ දිය හැක. එහි **Copy reference for AI** බොත්තම සම්පූර්ණ token/selector/property යොමුව clipboard එකට දමයි; එය "වටකුරු බොත්තම් සහිත, උණුසුම්, ඉහළ-වෙනස්කම් (high-contrast) ආලෝක තේමාවක්" යන්න සමඟ chat එකකට paste කර, පිළිතුර නැවත paste කරන්න. parser එක විරුද්ධ වුවහොත්, දෝෂ පෙළ නැවත සහායකයාට paste කරන්න — සෑම පණිවිඩයක්ම වරදකාරී පෙළ සහ විකල්පය නම් කරයි. `--render-headless out.png theme.css` මගින් display එකක් නොමැතිව පෙරදසුන විදැහී, දෝෂ ඇති විට ශුන්‍ය නොවන කේතයකින් පිටවේ; එමගින් තේමා ගොනුවක් CI හට පරීක්ෂා කළ හැකි දෙයක් බවට පත් වේ. ආරම්භක ලක්ෂ්‍ය හයක් `samples/ThemeStudio/Themes/` හි නිකුත් වේ: `light`/`dark` (ගැළපෙන යුගලයක්), `ocean`, `graphite`, `paper`, `parchment`.

### කේතයෙන් diagnostics
{:#appendix-d-diagnostics}

ඔබගේ පරිශීලකයින් සපයන තේමාවක් සඳහා, අන්ධව යෙදීම වෙනුවට ඔබම එය parse කර ගැටලු පෙන්වන්න:

**C#**

```csharp
var sheet = ThemeStyleSheet.Parse (File.ReadAllText (path));

foreach (var d in sheet.Diagnostics)
    log.WriteLine ($"{d.Severity} ({d.Line}:{d.Column}): {d.Message}");
```

**VB.NET**

```vb
Dim sheet = ThemeStyleSheet.Parse(File.ReadAllText(path))

For Each d In sheet.Diagnostics
    log.WriteLine($"{d.Severity} ({d.Line}:{d.Column}): {d.Message}")
Next
```

### එක් පත්‍රයක්, toolkits තුනක්
{:#appendix-d-hosts}

මිශ්‍ර සංක්‍රමණ යෙදුමක, එම ගොනුවටම *අනෙක්* භාගයද නැවත හැඩගැන්විය හැක: `Majorsilence.Forms.Theming.WinForms` එය සැබෑ `System.Windows.Forms` පාලකවලට ([module 7](#module-7-c)) ද, `Majorsilence.Forms.Theming.Avalonia` ස්වදේශීය Avalonia Fluent පාලකවලට (`AvaloniaCssTheme.Apply` / `Watch`) ද යොදයි; සෑම එකකටම ලේඛනගත සහාය matrix එකක් ඇති අතර සෑම හිඩැසක්ම diagnostic එකක් ලෙස වාර්තා වේ. දිගු සංක්‍රමණයක් අතරතුර "එය එකට ඇලවූ යෙදුම් දෙකක් මෙන් පෙනෙනු ඇත" යන්නට පිළිතුර එයයි.

**අභ්‍යාසය D.** Light තේමාව export කර (`Theme.ExportCss`), tokens තුනක් සහ එක් `Button` නීතියක් වෙනස් කර, ආරම්භයේදී එය load කරන්න. ඉන්පසු හිතාමතාම `TextBox:hover { color: red; }` ලියා parser එක ඔබට දෙන දෝෂය කියවන්න — එය framework එකේ මෙම කොටසේ සම්පූර්ණ දර්ශනයම එක් පණිවිඩයකින් පෙන්වයි.

---

## උපග්‍රන්ථය E — MVVM සහායක
{:#appendix-e}

**ප්‍රතිඵලය:** ඔබට reflection නොමැතිව, trimming සහ NativeAOT යටතේ ආරක්ෂිත ආකාරයෙන් view model එකක් පෝරමයකට සම්බන්ධ කළ හැකි අතර, එය භාවිත *නොකළ යුත්තේ* කවදාදැයි ඔබ දනී.

හවුල් UI පුස්තකාලයකට මාරු වන WinForms කණ්ඩායම් බොහෝ විට view models පෝරමවලින් වෙන් කිරීමට එම අවස්ථාව ගනී. `Control.DataBindings` මෙහි ක්‍රියා කරන අතර ද්වි-මාර්ගිකය (two-way) — නමුත් එය reflection මත පදනම් වේ, එයින් අදහස් වන්නේ trimmer සඳහා ඔබගේ view-model properties root කළ යුතු බවයි. `Majorsilence.Forms.Mvvm` විකල්පයයි: `INotifyPropertyChanged` සහ `ICommand` මත ඇති extension methods කුඩා කට්ටලයක්, ඒවා property එක `nameof` සමඟ නම් කර lambdas හරහා එය කියවා ලියයි, එබැවින් run time හිදී කිසිවක් string මගින් සොයා බලන්නේ නැත. එයට toolkit පරායත්තතාවයක් නැති අතර CommunityToolkit.Mvvm සමඟ ලියූ එකක් ඇතුළුව ඕනෑම view model එකක් සමඟ ක්‍රියා කරයි. ([`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) සහ ගැලරියේ `MvvmHelpersPanel` ට එරෙහිව පරීක්ෂා කරන ලදී, මෙම මාර්ගෝපදේශය සඳහා ධාවනය කර නැත.)

### සහායක හතර
{:#appendix-e-helpers}

**C#**

```csharp
using Majorsilence.Forms.Mvvm;

var scope = new BindingScope ();                        // මෙම පිටුව සාදන සෑම subscription එකක්ම එකතු කරයි

// One-way: දැන් යොදන්න, සහ එම property එක සඳහා සෑම PropertyChanged එකකදීම නැවත.
viewModel.Observe (nameof (CounterViewModel.Count), vm => vm.Count,
                   count => countLabel.Text = $"Count: {count}").AddTo (scope);

// Two-way: TextBox.Text <-> ProfileViewModel.Name (BindChecked, BindSelectedIndex, BindValue ද).
nameBox.BindText (viewModel, nameof (ProfileViewModel.Name),
                  vm => vm.Name, (vm, value) => vm.Name = value).AddTo (scope);

// Commands: Enabled, CanExecute අනුගමනය කරයි; Click මගින් command එක ධාවනය වේ. අභිරුචිව අඳින ඒවා ඇතුළුව ඕනෑම පාලකයක ක්‍රියා කරයි.
incrementButton.BindCommand (viewModel.IncrementCommand).AddTo (scope);

// පිටුවෙන් ඉවත් වන විට:
scope.Dispose ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Mvvm

Dim scope As New BindingScope()                          ' මෙම පිටුව සාදන සෑම subscription එකක්ම එකතු කරයි

' One-way: දැන් යොදන්න, සහ එම property එක සඳහා සෑම PropertyChanged එකකදීම නැවත.
viewModel.Observe(NameOf(CounterViewModel.Count), Function(vm) vm.Count,
                  Sub(count) countLabel.Text = $"Count: {count}").AddTo(scope)

' Two-way: TextBox.Text <-> ProfileViewModel.Name (BindChecked, BindSelectedIndex, BindValue ද).
nameBox.BindText(viewModel, NameOf(ProfileViewModel.Name),
                 Function(vm) vm.Name, Sub(vm, value) vm.Name = value).AddTo(scope)

' Commands: Enabled, CanExecute අනුගමනය කරයි; Click මගින් command එක ධාවනය වේ. අභිරුචිව අඳින ඒවා ඇතුළුව ඕනෑම පාලකයක ක්‍රියා කරයි.
incrementButton.BindCommand(viewModel.IncrementCommand).AddTo(scope)

' පිටුවෙන් ඉවත් වන විට:
scope.Dispose()
```

### සහායක සහතික කරන දේ — සහ නීති දෙක
{:#appendix-e-rules}

- **සෑම push එකක්ම UI thread එකට පැමිණේ.** worker thread එකක raise කළ `PropertyChanged` එකක් dispatcher හරහා post කෙරේ; UI thread එකේ raise කළ එකක් වහාම යෙදෙන බැවින් අනුපිළිවෙළ රැකේ. වෙනස්කම් කිහිපයක් පෝලිම් ගැසුණහොත්, සෑම push එකක්ම ධාවනය වන විට *වත්මන්* අගය කියවන බැවින්, පාලකයක් කිසි විටෙක නව අගයකට පසු පැරණි අගයක් පෙන්වන්නේ නැත.
- **ද්වි-මාර්ගික binding caret එකට බාධා නොකරයි.** පාලකයට ලියනු ලබන්නේ එහි අගය වෙනස් වූ විට පමණක් වන අතර, එක් දිශාවක් යොදන අතරතුර අනෙක නොසලකා හරින බැවින්, දෙක එහා මෙහා පැද්දෙන්නේ (ping-pong) නැත. දැනගත යුතු ප්‍රතිවිපාකය: view model එක ලබා දෙන දේ *නැවත ලියයි* නම් (trimming, upper-casing), view model එක තමන්ගේම වෙනසක් raise කරන තුරු box එක පරිශීලකයා type කළ දේ තබා ගනී.
- **async command එකක් ධාවනය කළ නොහැකි බව වාර්තා කරන අතරතුර `BindCommand` පාලකය අක්‍රිය කරයි** — CommunityToolkit හි `AsyncRelayCommand` පෙරනිමියෙන් එය කරයි — අමතර කේතයක් නොමැතිව.
- **නීතිය 1: එකම පාලකය මත `BindCommand` සහ `Button.Command` ඒකාබද්ධ නොකරන්න.** දෙකම command එක ධාවනය කරන බැවින්, එය එක් ක්ලික් එකකට දෙවරක් ධාවනය වේ. එකක් හෝ අනෙක භාවිත කරන්න.
- **නීතිය 2: පිටුව ඉවත් වන විට scope එක dispose කරන්න.** `BindingScope` එය දරන සියල්ල, නවතම එක පළමුව, dispose කරයි, එබැවින් කිසිදු view එකක් තමන්ට වඩා දිගු කල් පවතින view model එකක් මත හසුරුවනයක් කාන්දු නොකරයි. `null`/හිස් නමක් සහිත `PropertyChanged` එකක් "සියල්ල වෙනස් විය" යන්න අදහස් කරන අතර සෑම observation එකක්ම නැවුම් කරයි.

ද්වි-මාර්ගික binding අද පාලක හතරක් ආවරණය කරයි: `TextBox`, `CheckBox`, `ComboBox` (තෝරාගත් index) සහ `NumericUpDown` (පාලකයම කරන ආකාරයටම, එහි පරාසයට සීමා කර). වෙනත් ඕනෑම දෙයක් — `TrackBar` එකක්, `DateTimePicker` එකක්, radio group එකක් — එක් දිශාවකට `Observe` සහ අනෙක් දිශාවට පාලකයේම සිදුවීම, නැතහොත් `DataBindings` වේ.

### UI thread එකක් නොමැතිව සම්බන්ධතා පරීක්ෂා කිරීම
{:#appendix-e-testing}

සහායක විකල්ප `IUiDispatcher` එකක් (`CheckAccess()` + `Post(Action)`) ගනී. පෙරනිමිය, ඔබ UI thread එකේ සිටිනවාදැයි සක්‍රිය backend එකෙන් විමසා `Application.RunOnUIThread` හරහා post කරයි. පරීක්ෂණයකදී, "UI thread එකේ නැත" යැයි වාර්තා කරන සහ ලැබෙන දේ පෝලිම් කරන ව්‍යාජ (fake) එකක් ලබා දෙන්න — එවිට පසුබිම් වෙනසක් marshal කළ බව ඔබගේ පරීක්ෂණයට *සනාථ* කළ හැකි අතර, එයට අවශ්‍ය විටෙක පෝලිම ධාවනය කළ හැක. එය reflection මත පදනම් වූ binding එකකින් ඔබට ලිවිය හැකි ඕනෑම දෙයකට වඩා ශක්තිමත් පරීක්ෂණයකි.

**අභ්‍යාසය E.** ඔබගේ නියමු සංක්‍රමණයෙන්, අතින් ලියූ view-model සම්බන්ධතා (සිදුවීම් ඇතුළට, property සැකසීම් පිටතට) සහිත එක් පෝරමයක් ගෙන, එය `BindingScope` එකක් තුළ `Observe`/`BindText`/`BindCommand` මගින් ප්‍රතිස්ථාපනය කරන්න. ඔබ මකා දැමූ පේළි ගණන් කරන්න; ඉන්පසු worker-thread වෙනසක් label එකට ළඟා වන බව සනාථ කරන, ව්‍යාජ dispatcher එකක් සහිත එක් පරීක්ෂණයක් ලියන්න.
