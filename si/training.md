---
layout: docs
lang: si
title: පුහුණු මාර්ගෝපදේශය
subtitle: Majorsilence.Forms මත යෙදුම් සාදා නිකුත් කරන කණ්ඩායම් සඳහා පියවරෙන් පියවර සැකසූ පාඨමාලාවකි. සෑම උදාහරණයක්ම C# සහ VB.NET දෙකෙන්ම ඇත. 26.9.0 අනුවාදය සඳහා 2026 ඔක්තෝබර් මාසයේ සංශෝධනය කරන ලදී.
seo_title: "බහු-වේදිකා WinForms පුහුණු මාර්ගෝපදේශය (C# සහ VB.NET)"
description: >-
  WinForms යෙදුමක් බහු-වේදිකා තාක්ෂණයක් මත අලුතින් සාදන හෝ ඒ වෙත සංක්‍රමණය කරන කණ්ඩායම් සඳහා
  පියවරෙන් පියවර සැකසූ පාඨමාලාවකි. මූලික සංකල්පය, සංක්‍රමණය, backend හතක්, async dialog,
  තේමා, පරීක්ෂණ සහ CI ආවරණය වේ. C# සහ VB.NET.
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

Majorsilence.Forms මත **යෙදුමක්** අලුතින් සාදන්නට හෝ පවතින යෙදුමක් සංක්‍රමණය කරන්නට සූදානම් වන
සංවර්ධන කණ්ඩායමකට අතට දිය යුතු මාර්ගෝපදේශය මෙයයි. ඔබට WinForms පිළිබඳ අත්දැකීම් ඇතැයි පමණක් මෙහි
උපකල්පනය කෙරේ. ඊට අමතරව කිසිවක් දැන සිටිය යුතු නැත.

මෙහි විෂය පථය හිතාමතාම රාමුව (framework) *භාවිත කිරීමට* පමණක් සීමා කර ඇත. එනම් package යොමු කිරීම,
form ලිවීම, පැරණි කේත පදනමක් මාරු කිරීම, ඉලක්ක වේදිකා තෝරා ගැනීම, සෑදූ දේ පරීක්ෂා කිරීම සහ එය නිකුත්
කිරීම යන කරුණුය. මෙය රාමුවට දායක වන්නන් සඳහා වූ මාර්ගෝපදේශයක් **නොවේ**. මෙහි කිසිදු කොටසක්
අනුගමනය කිරීමට රාමුවේ මූලාශ්‍රය clone කිරීමට හෝ build කිරීමට ඔබට අවශ්‍ය නොවේ. (කවදා හෝ රාමුවේම
යමක් නිවැරදි කිරීමට ඔබට සිදු වුවහොත්, ඒ සඳහා වැදගත් වන එකම ඡේදය වෙත [module 10](#module-10-gaps)
ඔබව යොමු කරයි.)

**සෑම කේත උදාහරණයක්ම C# සහ VB.NET දෙකෙන්ම දක්වා ඇත.** මුල් සංස්කරණයේ C# උදාහරණ ප්‍රකාශයට පත්
කිරීමට පෙර macOS මත compile කර ධාවනය කරන ලදී. මාර්ගෝපදේශය පුරා ඇති තිර රූප (screenshots) එම
ධාවනයන්ගෙන් ලබා ගත් ඒවා මිස සැකසූ රූප නොවේ. එසේම, පහත ඔබ කියවන අවංක අනතුරු ඇඟවීම් දෙකක් සොයා
ගැනුණේද ඒවා ධාවනය කිරීමෙනි. 2026 ඔක්තෝබර් සංශෝධනයේදී එක් කළ උදාහරණ (තේමා, MVVM, async dialog,
අලුත් backend, animation frame, custom automation state) මෙම මාර්ගෝපදේශය සඳහා වෙනම ධාවනය නොකළ
අතර, ඒ වෙනුවට repository එකේම ලේඛන සහ sample සමඟ සසඳා පරීක්ෂා කරන ලදී. එය වැදගත් වන තැන්වල ඒ බව
සඳහන් කර ඇත. මෙහි VB යනු පළමු පෙළේ සංක්‍රමණ ඉලක්කයකි. migrator එක `.vbproj`/`.vb` ගොනු හසුරුවයි,
සම්භාව්‍ය VB compiler එක කලින් සපයා දුන් constructor එක නැවත එක් කරයි, එසේම `My.Resources` accessor
එකක් ජනනය කරයි. VB වලට පමණක් අදාළ අනතුරු ඇඟවීම් තුනක් ඒවා අදාළ වන තැන්වලම පෙන්වා දී ඇත:
[`--dual-build` C# සඳහා පමණි](#module-5-dualbuild), [`My.*` ක්‍රියාත්මක කර ඇත්තේ අර්ධ
වශයෙනි](#module-5-checklist), සහ [පරීක්ෂණ සැකසීම සඳහා VB හි module initializer එකක්
නැත](#module-8-headless).

මෙය භාවිත කළ හැකි ක්‍රම දෙකකි:

| ක්‍රමය | කෙසේද | Modules |
|---|---|---|
| **දෙදින වැඩමුළුව** | පළමු දිනය: modules 0–4 (මූලික සංකල්පය, පළමු යෙදුම, ක්‍රියා කරන්නේ මොනවාදැයි දැන ගැනීම, ඇඳීම). දෙවන දිනය: modules 5–10 (සංක්‍රමණය, ඉලක්ක වේදිකා, interop, පරීක්ෂණ, native අන්තර්ගතය, නිකුත් කිරීම). | සියල්ල |
| **තමන්ගේ වේගයෙන්** | Modules 0–3 අනිවාර්ය හරයයි. ඒවා නොකියවා කිසිවෙකු සංක්‍රමණයක් ආරම්භ නොකළ යුතුය. ඉන්පසු, ඔබ සංක්‍රමණය කරන්නේ නම් module 5 ද, අලුත් යෙදුමක් සාදන්නේ නම් modules 6 සහ 8 ද කියවන්න. උපග්‍රන්ථ D සහ E (තේමා, MVVM සහායක) යෙදුමේ පෙනුම සහ view-model සම්බන්ධ කිරීම භාර අය සඳහා වූ අමතර කියවීම්ය. | තෝරන්න |

පහත එන සෑම තීරණයකටම බලපාන නිසා, මුලින්ම පිළිගත යුතු කරුණු දෙකක් තිබේ. පළමුවැන්න, Majorsilence.Forms
තවමත් **බීටා** අදියරේ පවතී. API එක ස්ථාවර වෙමින් පවතින අතර, WinForms හි සෑම කුඩා කොනක්ම තවම
ආවරණය වී නැත. ඒ නිසා ඔබේ package අනුවාදය නිශ්චිතව සටහන් කර තබන්න. දෙවැන්න, එය **compile වී ආසන්න
වශයෙන් ක්‍රියා කරන (compile-and-approximate) රාමුවක් මිස, පික්සලයෙන් පික්සලයට නිවැරදි රාමුවක් නොවේ**.
සංක්‍රමණය කළ කේතය compile වී *ධාවනය වන* ලෙස නිර්මාණය කර ඇති නමුත්, සමහර member තවමත් හිතාමතාම
කිසිවක් නොකරයි. ක්‍රියා කරන්නේ මොනවාද, නොකරන්නේ මොනවාද යන්න හඳුනා ගන්නා ආකාරය Module 3 සම්පූර්ණයෙන්ම
විස්තර කරයි. සෙමින්, හොඳින් කියවීමෙන් වැඩිම ප්‍රතිලාභ ලැබෙන module එක එයයි.

---

## පටුන
{:#contents}

- [Module 0 — මුලින්ම යමක් ධාවනය කර බලන්න](#module-0)
- [Module 1 — මූලික සංකල්පය: රාමුවම අඳින control සහ මාරු කළ හැකි host එක](#module-1)
- [Module 2 — ඔබේ පළමු යෙදුම](#module-2)
- [Module 3 — ගොඩනැඟීමට පෙර, ක්‍රියා කරන්නේ මොනවාදැයි දැන ගන්න](#module-3)
- [Module 4 — ඇඳීම සහ custom paint](#module-4)
- [Module 5 — ඔබේ WinForms යෙදුම සංක්‍රමණය කිරීම](#module-5)
- [Module 6 — ඉලක්ක වේදිකා තෝරා ගැනීම](#module-6)
- [Module 7 — Windows මත පියවරෙන් පියවර හඳුන්වා දීම](#module-7)
- [Module 8 — ඔබේ යෙදුම පරීක්ෂා කිරීම](#module-8)
- [Module 9 — Native අන්තර්ගතය සහ වීඩියෝ](#module-9)
- [Module 10 — නිකුත් කිරීම: CI, අනුවාද පාලනය සහ යාවත්කාලීනව සිටීම](#module-10)
- [උපග්‍රන්ථය A — රෝග ලක්ෂණය අනුව දෝෂ සෙවීම](#appendix-a)
- [උපග්‍රන්ථය B — සැබෑ කේත පදනමක් සඳහා ක්‍රියාත්මක කිරීමේ සැලැස්ම](#appendix-b)
- [උපග්‍රන්ථය C — ඉක්මන් යොමු පත්‍රිකාව](#appendix-c)
- [උපග්‍රන්ථය D — CSS මගින් ඔබේ යෙදුමට තේමා යෙදීම](#appendix-d)
- [උපග්‍රන්ථය E — MVVM සහායක](#appendix-e)

---

## Module 0 — මුලින්ම යමක් ධාවනය කර බලන්න
{:#module-0}

**අපේක්ෂිත ප්‍රතිඵලය:** සෑම සංවර්ධකයෙකුටම තමන්ගේම මෙහෙයුම් පද්ධතිය මත ධාවනය වන තමන්ගේම යෙදුමක්
තිබීම. එසේම, "මේ රාමුවට X කළ හැකිද" යන්න සොයා බැලිය යුත්තේ කොතැනින්දැයි දැන සිටීම.

ඔබට අවශ්‍ය වන්නේ [.NET 10 SDK](https://dotnet.microsoft.com/download) එක පමණි. Windows අවශ්‍ය නැත.
Visual Studio අවශ්‍ය නැත. වේදිකාවලට අදාළ workload හෝ රාමුවේ මූලාශ්‍ර කේතය ද අවශ්‍ය නැත.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

මේ වන විට ඔබ අතේ ධාවනය වන බහු-වේදිකා යෙදුමක් තිබේ. scaffold කළ යෙදුමේ ව්‍යුහය හොඳින් සලකා බලන්න,
මන්ද ඉදිරියටත් රඳවා ගත යුතු ව්‍යුහය එයයි. එය **project දෙකක් සහිත solution එකකි**.
`MajorsilenceFormsApp.Shared` යනු `MainForm` සහ එහි Designer ගොනුව දරන සාමාන්‍ය class library එකකි.
`MajorsilenceFormsApp` යනු Avalonia backend එක මත ධාවනය වන සිහින් desktop *head* එකකි. ඔබේ form
සියල්ල ජීවත් වන්නේ shared library එක තුළය. head එකක් යනු entry point එකක් සහ backend එකක් පමණි.
පසු කලෙක එම UI එකම දුරකථනයක හෝ බ්‍රවුසරයක ධාවනය කිරීමට හැකි වන්නේ මේ නිසාය. ඒ සඳහා form වලට
අත තැබීම අවශ්‍ය නැත, තවත් head එකක් එක් කළ යුතුය ([module 6](#module-6)):

```
dotnet new majorsilenceforms -n MyApp --IncludeAndroid --IncludeWasm --IncludeiOS
```

මෙම සෑම switch එකක්ම head project එක බැගින් එක් කරන අතර, ඒ සඳහා අදාළ workload එක (`android`,
`wasm-tools`, `ios`) අවශ්‍ය වේ. ඒවායින් අවසාන එක ක්‍රියා කරන්නේ Mac එකක පමණි. පෙරනිමියෙන් තුනම
අක්‍රියයි. ඒ නිසා සාමාන්‍ය විධානය අමතර workload කිසිවක් ස්ථාපනය නොකර build වේ. scaffold එක යොමු කරන
package අනුවාද නිශ්චිතව සටහන් කිරීමට `--msformsVersion` සහ `--avaloniaVersion` භාවිත කරන්න.

දැන් යොමු ද්‍රව්‍ය ගැන.

**ඔබේ API ලේඛනය වන්නේ control ගැලරියයි.** තවමත් වෙනම API යොමුවක් නැත. ඒ නිසා "`TreeView` එක X සඳහා
සහාය දක්වනවාද" යන්නට ඉක්මන්ම පිළිතුර ලැබෙන්නේ ගැලරියෙනි. එහි රාමුව සමඟ එන සෑම control එකකටම demo
panel එකක් බැගින් ඇත. ඉක්මන් බැල්මක් හෙළීමට කිසිදු වියදමක් නැත. [බ්‍රවුසරයේ ධාවනය වන සජීවී
ගැලරිය]({{ '/gallery/' | relative_url }}) යනු WebAssembly වෙත compile කළ සැබෑ රාමුවම වන අතර, එයට
කිසිදු ස්ථාපනයක් අවශ්‍ය නැත.

![Button panel එක තෝරාගෙන macOS මත ධාවනය වන ControlGallery sample එක]({{ '/assets/img/gallery-macos.png' | relative_url }})

*macOS 26 මත `ControlGallery` sample එක, Avalonia backend එක මත, `Button` panel එක තෝරාගෙන. රාමුවට
අයත් දේ සහ අයත් නොවන දේ සලකා බලන්න. ඉහළ ඇති traffic-light ශීර්ෂය මෙහෙයුම් පද්ධතියට අයත්ය. ඊට
පහළින් ඇති සෑම පික්සලයක්ම, එනම් nav tree එක, එහි scrollbar එක සහ button ප්‍රභේද, Skia හරහා
Majorsilence.Forms විසින්ම අඳිනු ලැබේ.*

control එකක් හුදෙක් බැලීම වෙනුවට එය පිටුපස ඇති කේතය කියවීමට අවශ්‍ය වූ විට, repository එක clone කර
එහි [`samples/`]({{ site.github_url }}/tree/main/samples) ෆෝල්ඩරයේ ඇති, ඔබට අධ්‍යයනය කිරීමට අවශ්‍ය
sample එක ධාවනය කරන්න:

```
git clone https://github.com/majorsilence/Majorsilence.Forms.git
dotnet run --project samples/Gallery.Avalonia   # ගැලරිය, desktop backend මත
dotnet run --project samples/Explorer           # Windows Explorer ක්ලෝනයක්
dotnet run --project samples/Outlaw             # Outlook ක්ලෝනයක්
```

> **Sample ධාවනය කළ යුත්තේ `dotnet run --project …` මගින් හෝ build output directory එකේ සිටය. repo
> root එකේ සිට නොවේ.** සෑම sample එකක්ම අයිකන load කරන්නේ *සාපේක්ෂ* path එකක් හරහාය (`ImageLoader`
> එක `"Images"` භාවිත කරයි). එම path එක ගණනය වන්නේ assembly එක ඇති ස්ථානයට අනුව නොව, **ක්‍රියාවලියේ
> working directory එකට** අනුවය. build කළ executable එක වෙනත් ඕනෑම තැනක සිට ධාවනය කළහොත් කිසිදු
> අයිකන ගොනුවක් හමු නොවේ. ඒ විට `Bitmap(string)` exception එකක් විසි කරනවා වෙනුවට 1×1 placeholder
> එකක් බවට පත් වේ. ප්‍රතිඵලය වන්නේ යෙදුම කිසිදු දෝෂයක් නොමැතිව ආරම්භ වී, කිසිවක් log නොකර, සෑම
> අයිකනයක්ම නොපෙනෙන ලෙස විදැහුම් කිරීමයි.
>
> මෙය එක් වරක් හිතාමතාම කර බැලීම වටී, මන්ද **ඔබේම යෙදුමටද මේ හැසිරීම උරුම වේ**. ඔබේ කේතයේ
> විසඳුම නම් asset path ගණනය කිරීමේදී assembly එක ඇති ස්ථානය පදනම් කර ගැනීමයි:
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
> මෙය [නිහඬව කිසිවක් නොකර අසාර්ථක වීමේ](#module-3-cost) කුඩා උදාහරණයකි. ක්‍රියා කරන බව ඔබ *දන්නා*
> sample එකකදී එයට මුහුණ දීම, production එකේදී පළමු වරට එයට මුහුණ දීමට වඩා බොහෝ සෙයින් පහසුය.

**අභ්‍යාසය 0.** template එකෙන් යෙදුමක් සාදා, එය ධාවනය කර, `MessageBox` එකක් පෙන්වන `Button` එකක්
එයට එක් කරන්න. ඉන්පසු සජීවී ගැලරිය විවෘත කර, ඔබේම යෙදුම රඳා පවතින control තුනක් එහි සොයා ගන්න.

---

## Module 1 — මූලික සංකල්පය: රාමුවම අඳින control සහ මාරු කළ හැකි host එක
{:#module-1}

**අපේක්ෂිත ප්‍රතිඵලය:** කිසිදු වෙනසක් නොමැතිව ගෙන යා හැකි WinForms රටා මොනවාද, වෙනස් ලෙස හැසිරෙන
රටා මොනවාද, කිසිසේත් ක්‍රියා නොකරන රටා මොනවාද යන්න ඔබට කල්තියා කිව හැකි වීම. ඒ ලේඛන සොයා බැලීමෙන්
නොව, මූලික සිද්ධාන්ත මත පදනම්වය.

නිර්මාණ ව්‍යුහය පිළිබඳ එක් කරුණක් ඇති අතර, අනෙක් සියල්ලම පාහේ එයින් පැන නගී:

> **Majorsilence.Forms තම ඇඳීම් සියල්ල SkiaSharp මගින් තනිවම සිදු කරයි. ඊට යටින් ඇති windowing
> toolkit එක host එකක් පමණි.**

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

Backend හතක්, නමුත් form කට්ටලය එකකි. Windows වලට පමණක් සීමා වූ backend දෙක පවතින්නේ එක් අරමුණක්
සඳහාය. එනම් WinForms හෝ WPF යෙදුමකට වරකට control එක බැගින් Majorsilence.Forms හඳුන්වා දීමට ඉඩ
දීමයි ([module 7](#module-7-c)). Terminal backend එක නම් host එක සැබවින්ම මාරු කළ හැකි බවට සාක්ෂියකි.
ඔබේ form එක ඉදිරිපත් වන්නේ GPU swapchain එකක් හරහාද, නැතහොත් `▄` අක්ෂරයක් හරහාද යන්න form එක තුළ
කිසිවක් නොදනී.

සෑම control එකක්ම අඳින්නේ Skia canvas එකක් මතය. යටින් ඇති host එක native window සාදයි, message loop
එක ධාවනය කරයි, input ලබා දෙයි, විදැහුම් කළ රූපය තිරයට ඉදිරිපත් කරයි. එය කරන්නේ එපමණයි. හර package
එක කිසිදු windowing toolkit එකක් යොමු නොකරයි. toolkit එක සපයන්නේ ඔබ යොමු කරන backend එකයි. යෙදුම්
සංවර්ධකයෙකු වන ඔබට මෙම බෙදීමෙන් ප්‍රායෝගික ප්‍රතිඵල හරියටම දෙකක් ලැබේ. **ඔබේ project ගොනුවේ එක්
පේළියක් ඔබේ host එක තෝරයි** ([module 6](#module-6)). එසේම **ඔබේ කේතයේ කිසිදු toolkit type එකක්
කිසිදා නොපෙනේ**. ඔබ ලියන්නේ WinForms හි මෙන්ම `Form`, `Control`, `MouseButtons`, `Keys` සහ
`System.Drawing` value type වලට එරෙහිවය.

### මෙයින් පැන නගින දේ
{:#module-1-consequences}

මේ module එකේ ඵලය මෙම වගුවයි. එහි ඇති සෑම කරුණක්ම කටපාඩම් කරනු වෙනුවට තර්කයෙන් ම අවබෝධ කර ගත හැකි
හැසිරීම් වෙනසකි.

| ඇඳීම රාමුවට අයත් වන අතර window host එකට අයත් වන නිසා… | ඒ නිසා… |
|---|---|
| සෑම top-level window එකකටම native OS window එක බැගින් ඇත. ඒ ඇතුළත ඇති සියල්ල අඳිනු ලබන දේය. | `Control.Handle` හි අගය `IntPtr.Zero` වේ. `Button` එකක් පිටුපස වාර්තා කිරීමට OS object එකක් නැත. [module 9](#module-9) බලන්න. |
| WinForms හි "`.Handle` ස්පර්ශ කර window එක බලෙන් සෑදීම" යන රටාව `WindowBase.Handle` තවමත් ඉටු කළ යුතුය. | එය ලබා දෙන්නේ **අර්ථයක් නැති, ශුන්‍ය නොවන token එකකි. `HWND` එකක් නොවේ**. එය කිසිදා native කේතයට ලබා නොදෙන්න. සැබෑ handle එක `WindowBase.PlatformHandle` එකයි. එය Avalonia backend එකේ (`HWND`/`NSWindow`/`XID`) සහ WinForms backend එකේ (සැබෑ `HWND` එකක්) සැබෑ අගයක් වන අතර, වෙනත් backend වල ශුන්‍යය. |
| රාමුව තම canvas එක තිරයේ scaling එකට අනුව තනිවම පරිමාණය කරයි. | **`Control` එකක ඔබ දකින සියල්ල logical ඒකක වලිනි.** `Width`/`Height`/`Bounds`, `MouseEventArgs` මෙන්ම (2026-10-01 සිට) `ClientRectangle`, `ClientSize` සහ paint canvas එකද එසේය. සාමාන්‍ය WinForms layout සහ paint කේතය කිසිදු වෙනසක් නොමැතිව ඕනෑම scaling එකකදී නිවැරදි ප්‍රමාණයෙන් පෙනේ. device පික්සල අවශ්‍ය නම් ඒවා වෙනම ඉල්ලා ගත යුතුය (`ScaledBounds`, `PaintEventArgs.Scaling`, `LogicalToDeviceUnits`). එකම ව්‍යතිරේකය owner-draw event ය (`DrawItem`, `DrawNode`, `CellPainting`, …). ඒවා තවමත් device-පික්සල `Graphics` එකක් සමඟ device-පික්සල bounds ලබා දෙයි. [module 4](#module-4-paint) බලන්න. |
| පෙනුම තීරණය කරන්නේ Win32 නොව රාමුවයි. | `BackColor`, `ForeColor` සහ `Font` **ambient** වේ, එනම් වටපිටාවෙන් උරුම වේ. පහත උදාහරණය බලන්න. එසේම රාමුව සියල්ල අඳින නිසා, එක් CSS stylesheet එකකින් මුළු යෙදුමේම පෙනුම වෙනස් කළ හැකිය ([උපග්‍රන්ථය D](#appendix-d)). |
| input යොමු කිරීම රාමුවට අයත්ය. | **mouse capture එක, අභිනය (gesture) අවසන් වන තුරුම එය ලබා ගත් control එක සතුව පවතී.** container එකක් මත ආරම්භ කළ drag එකක්, ඒ මත ඇති button එකක් හරහා ගියත් නොනැසී පවතී. child control එකක් තනිවම capture එක ලබා ගත්තොත්, එය තම ancestor වලට වඩා ප්‍රමුඛ වේ. |
| මෙහි `Form` එකක් `Control` එකක් නොවේ. එය අභ්‍යන්තර `WindowBase` class එකකින් ව්‍යුත්පන්න වේ. | පොදු `Control` member `Form` මතද ඇත (`Anchor`, `Dock`, `TabIndex`, `Padding`/`Margin`, `Parent`, `MouseEnter`/`MouseLeave`). එහෙත් `Form` එකක් `Control.ControlCollection` එකකට එක් කළ නොහැකි අතර, `Control` type එකෙන් tree එකක් පීරන විට එය හමු නොවේ. |
| ස්පර්ශය (touch) mouse අනුකරණයක් නොව, පළමු පෙළේ input ක්‍රමයකි. | `Control` මගින් `LongPress`, `Pinch`, `Swipe` සහ `ScrollGesture` event මතු කෙරේ. **ඒවායින් කිසිවක් mouse එකට ක්‍රියාත්මක නොවේ.** `ScrollableControl` දැනටමත් `ScrollGesture` එක `AutoScrollPosition` වෙත යොදයි. ඒ නිසා ඔබේ `Panel`/`ListBox`/`TreeView` subclass වලට කිසිදු කේත වෙනසක් නොමැතිව ස්පර්ශයෙන් pan කිරීමේ හැකියාව ලැබේ. |

**Ambient පෙනුම: නොනැසී පවතින WinForms රටාව.** `BackColor`, `ForeColor` සහ `Font` යන සෑම එකක්ම
මුලින් control එකේම style දාමය, ඉන්පසු parent දාමය, ඉන්පසු host window එක, අවසානයේ තේමාව යන
පිළිවෙළට අගය සොයා යයි. ඒ නිසා container එකකට එක් වරක් වර්ණයක් දී, එහි children එය උරුම කර ගැනීමට
ඉඩ හැරීම ඔබ බලාපොරොත්තු වන ආකාරයටම ක්‍රියා කරයි:

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

![macOS මත ධාවනය වන ambient පෙනුම පිළිබඳ උදාහරණය]({{ '/assets/img/example-ambient.png' | relative_url }})

*හරියටම එම කේතය ධාවනය වන අයුරු. `Label` සහ `Button` වල අකුරු panel එකෙන් සුදු පැහැය උරුම කර ගෙන
ඇත. `TextBox` එක තමන්ගේම ලා පැහැති පසුබිම රඳවා ගෙන ඇත.*

මෙම හිතාමතා කළ අසමානතාව, එනම් container වලින් වර්ණය පහළට ගලා යන අතර `TextBox`/`ComboBox` එසේ
නොවීම, "මගේ dark theme එක අඩක් පමණක් යෙදී ඇත්තේ ඇයි" යන නිතරම අසන ප්‍රශ්නයට හේතුවයි. එය WinForms
හැසිරීමට අනුකූලව නිවැරදිය.

මේ සියල්ලෙන් ලැබෙන බහු-වේදිකා හැකියාව ඇසට පෙනෙන දෙයකි. එකම `Explorer` sample එක, මෙහෙයුම් පද්ධති
තුනක්, එක් කේත පදනමක්:

![Windows මත Explorer sample එක]({{ '/assets/img/explorer-windows.png' | relative_url }})

*Windows. project එකේම ලේඛනවලින් ලබා ගත් රූපයකි.*

![Ubuntu මත Explorer sample එක]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

*Ubuntu (AMD64). project එකේම ලේඛනවලින් ලබා ගත් රූපයකි.*

![macOS මත Explorer sample එක]({{ '/assets/img/explorer-macos.png' | relative_url }})

*macOS 26. වත්මන් build එකෙන් ලබා ගත් රූපයකි.*

**අභ්‍යාසය 1.** කිසිවක් සොයා නොබලා, ඉහත වගුව පමණක් භාවිත කර පිළිතුරු දෙන්න: `myButton.Handle` එක
native වීඩියෝ library එකකට ලබා දුන්නොත් සිදු වන්නේ කුමක්ද? ඒ වෙනුවට ඔබ කළ යුත්තේ කුමක්ද? ඉන්පසු ඔබේම
WinForms කේත පදනමේ, container එකක `BackColor` සකසා එහි children එය උරුම කර ගැනීම මත රඳා පවතින
එක් තැනක් සොයා ගන්න. එය තවමත් ක්‍රියා කරයිදැයි කල්තියා කියන්න.

---

## Module 2 — ඔබේ පළමු යෙදුම
{:#module-2}

**අපේක්ෂිත ප්‍රතිඵලය:** C# හෝ VB.NET යන ඕනෑම භාෂාවකින්, මුල සිටම Majorsilence.Forms යෙදුමක් සෑදීමට
ඔබට හැකි වේ. එමෙන්ම එහි සෑම පේළියක්ම කරන්නේ කුමක්දැයි ඔබට පැහැදිලි කළ හැකි වේ.

### Project ගොනුව
{:#module-2-project}

සාමාන්‍ය console යෙදුමකින් පටන් ගෙන, වෙනස්කම් තුනක් පමණක් කරන්න.

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

VB අනුවාදයේ **නැති** දේ ගැන අවධානය යොමු කරන්න. එහි `MyType` එකක් නැත; VB application framework එකද නැත.
සංක්‍රමණ මෙවලමට (migrator) වසං කළ නොහැකි එකම ව්‍යුහාත්මක වෙනස මෙයයි. VB සඳහා
[`--dual-build` ලබා නොදීමට](#module-5-dualbuild) හේතුවද එයමය.

Target framework ගැන කෙටි සටහනක් මෙහි අවශ්‍යය. මන්ද, සංක්‍රමණයකදී මුලින්ම ඉවත් වන්නේ `-windows` යන
උපසර්ගයයි. බහු-වේදිකා head එකකට අවශ්‍ය වන්නේ සාමාන්‍ය `net10.0` (හෝ `net8.0`) එකක් පමණි. මූලික
පැකේජ (`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`) සඳහා
**`netstandard2.0`** build එකක්ද ලැබේ. පැරණි **.NET Framework 4.8** යෙදුමකට මෙම control භාවිත කිරීමට
ඉඩ සැලසෙන්නේ ඒ නිසාය. එවිට එය WinForms හෝ WPF backend එකේ `net48` අනුවාදය සමඟ යුගල කළ යුතුය
([Module 7](#module-7-c)). බහු-වේදිකා backend නම් `net8.0` හෝ ඊට ඉහළ අනුවාද සඳහා පමණි.

**පැකේජ දෙකම අවශ්‍යය. පුහුණුවකදී පැහැදිලිවම කිව යුතු කරුණ මෙයයි.** මූලික `Majorsilence.Forms` පැකේජය
කිසිදු window toolkit එකක් භාවිත නොකරයි; එය රඳා පවතින්නේ SkiaSharp මත පමණි. Control සහ ඇඳීම යන සියල්ල
අයත් වන්නේ එයටය. නමුත් තිරය මත window එකක් විවෘත කිරීමට එයට නොහැකිය. එම කාර්යය කරන backend එක
`Majorsilence.Forms.Avalonia` වේ. එය යොමු කළ විටය යෙදුම Windows, macOS සහ Linux මත *ධාවනය කළ හැකි*
බවට පත් වන්නේ. වෙනත් host එකක් ඉලක්ක කිරීමට අවශ්‍ය නම්, එම දෙවන පේළිය `Majorsilence.Forms.Uno`,
`.Gtk4`, `.Terminal`, `.WinForms`, `.Wpf` හෝ `.Headless` වෙනුවට මාරු කරන්න. මාරුව යනු එම එක පේළිය
පමණි. පෙරනිමි නොවන backend එකකදී නම්, backend එක තෝරන කේත පේළියක්ද ඊට එක් වේ ([Module 6](#module-6)).

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

මෙම යෙදුම කිසිදු අමතර වින්‍යාසයකින් තොරව Windows, macOS සහ Linux මත ධාවනය වේ. backend එකේ පැකේජය යොමු
කළ විට, එය ස්වයංක්‍රීයවම තෝරා ගැනෙන බැවිනි. ඔබට *වෙනත්* backend එකක් අවශ්‍ය නම්, එය **පළමු window එක
සෑදීමට පෙර** පවරන්න:

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

මෙම අනුපිළිවෙළ සැබෑ සීමාවකි. බොහෝ දෙනෙකු අමාරුවේ වැටෙන්නේ මෙතැනදීය. Form එකක් සෑදූ සැණින් එය backend එක
භාවිත කරයි. ජංගම සහ බ්‍රවුසර entry point ([Module 6](#module-6)) instance එකක් වෙනුවට *factory* එකක්
ඉල්ලන්නේද මේ හේතුව නිසාමය.

### සැබවින්ම යමක් කරන form එකක්
{:#module-2-interactive}

කේතයෙන් ලියන layout එකක්, event handler එකක්, dialog එකක් සහ modal ප්‍රතිඵලයක්. සෑම තිරයකටම අවශ්‍ය
කරුණු හතර මේවාය. මෙහි අලුත් දෙයක් නැත; `Anchor`, `Dock`, `DialogResult`, `MessageBox` යන සියල්ල ඔබට
WinForms වලින් හුරුපුරුදු දේමය.

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

![macOS මත ධාවනය වන GreetForm උදාහරණය]({{ '/assets/img/example-greet.png' | relative_url }})

*ධාවනය වෙමින් පවතින `GreetForm`. `TextBox` එකට `Top | Left | Right` anchor එක දී ඇති නිසා, එය window එක
සමඟම පළල් විය. බොත්තම් දෙක පහළ දකුණු කෙළවරේම රැඳී ඇත.*

කොටුව හිස්ව තිබියදී OK එබුවහොත්, validation කොටස ක්‍රියාත්මක වේ:

![Validation කොටසෙන් මතු වන MessageBox එක]({{ '/assets/img/example-messagebox.png' | relative_url }})

*`MessageBox.Show` මගින් සැබෑ modal window එකක් විවෘත වේ. එය handler එක නවත්වා, parent window එක අක්‍රිය
කරයි. සිදු විය යුත්තේද එයමය. මෙහි අවංකව කිව යුතු කරුණක් ඇත: `MessageBoxIcon.Warning` පිළිගනු ලැබුවද,
අනතුරු ඇඟවීමේ සලකුණක් තවමත් අඳින්නේ නැත. [Stub ප්‍රතිපත්තිය](#module-3-stub-policy) ක්‍රියාත්මක වන
ආකාරය මෙයයි. ඇමතුම ක්‍රියා කරයි. එක් දෘශ්‍ය විස්තරයක් පමණක් තවම නැත. කිසිදු exception එකක් මතු නොවේ.*

Parent form එකකින් එය modal ලෙස පෙන්වන ආකාරය WinForms වලින් කිසිසේත් වෙනස් නැත:

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

අවධානයට ගත යුතු කරුණු දෙකක් මෙහි ඇත. බොහෝ දෙනෙකු වැරදෙන්නේ මේ දෙකෙන්ය. පළමුවැන්න, සෑම අන්තර්ක්‍රියාකාරී
control එකකටම දී ඇති `Name` එක හුදු අලංකාරයක් නොවේ. එය පරීක්ෂණ සඳහා locator එක බවට *සහ* accessibility id
එක බවට පත් වේ ([Module 8](#module-8)). දෙවැන්න, C# හි `|` භාවිත කරන තැන VB හි `Anchor` සඳහා
`AnchorStyles.Top Or AnchorStyles.Left` ලෙස ලිවිය යුතුය. VB වෙත port කිරීමේදී වැඩියෙන්ම සිදුවන
ටයිප් කිරීමේ වැරැද්ද මෙයයි.

බ්‍රවුසර හෝ දුරකථන head එකක් ඔබේ සැලසුම්වල කොතැනක හෝ තිබේ නම්, තුන්වන කරුණක්ද ඇත. ඉහත දැක්වූ,
ක්‍රියාත්මක වීම නවත්වන `ShowDialog` සහ `MessageBox.Show` desktop මත පමණක් ක්‍රියා කරයි. බ්‍රවුසර,
Android සහ iOS මත ඒවා කිසිවක් පෙන්වීමට *පෙර* `PlatformNotSupportedException` එකක් මතු කරයි. ඒ නිසා
සෑම dialog එකකටම await කළ හැකි සමාන අනුවාදයක් ඇත (`ShowDialogAsync`, `MessageBox.ShowAsync`). අදට
වෙනස් කළ යුතු කිසිවක් නැත. නමුත් ඔබේ සියවන handler එක ලියන්නට පෙර
[async dialog නීතිය](#module-6-async) කියවන්න. Shared UI library එකක් පසුව async බවට පරිවර්තනය කිරීමට
වඩා, මුල සිටම async ලෙස ලිවීම බෙහෙවින් පහසුය.

### සැබෑ යෙදුමක හැඩය
{:#module-2-real}

තනි form එකක් පුහුණුවකට සුදුසු ඉලක්කයක් නොවේ. ව්‍යාපාරික යෙදුම් (line-of-business) සඳහා අනුගමනය කළ යුතු
හැඩය `PointOfSale` උදාහරණයෙන් පෙන්වයි. එහි ඇත්තේ එක් project එකක් නොව හතරකි:

| Project එක | කාර්යය |
|---|---|
| `PointOfSale.Client` | Majorsilence.Forms desktop යෙදුම (form, panel, custom control සහ service) |
| `PointOfSale.Api` | JWT auth සහ role-based policy සහිත ASP.NET Core minimal API එක |
| `PointOfSale.Contracts` | දෙපැත්තම බෙදා ගන්නා DTO |
| `PointOfSale.Data` | EF Core + SQLite මගින් දත්ත ගබඩා කිරීම සහ seeding |

UI ස්තරය ඔබේ නිර්මාණ ව්‍යුහයට කිසිදු සීමාවක් පනවන්නේ නැත. එය සාමාන්‍ය .NET client එකක් පමණි. ඒ නිසා
ඔබ දැනටමත් භාවිත කරන DI, HTTP, logging සහ දත්ත ගබඩා කිරීමේ ක්‍රම සියල්ල වෙනසක් නැතිව එලෙසම භාවිත කළ
හැකිය.

"සංකීර්ණ, බහු-panel යෙදුමකට මෙය ඔරොත්තු දෙනවාද?" යන ප්‍රශ්නයට පිළිතුර `Outlaw` උදාහරණයයි:

![macOS මත ධාවනය වන Outlaw උදාහරණය, Outlook clone එකක්]({{ '/assets/img/outlaw-macos.png' | relative_url }})

*macOS 26 මත `Outlaw`. මෙය Outlook clone එකකි. හිතාමතාම, හුදු demo එකක් ලෙස නොව සැබෑ යෙදුමක් මෙන්
සාදා ඇත. අයිකන rail එක, folder tree එක, virtualized පණිවිඩ ලැයිස්තුව සහ status bar එක යන සියල්ල
Majorsilence.Forms විසින්ම අඳිනු ලැබේ. පණිවිඩ පේළියක් තෝරා ඇත. නමුත් කියවීමේ panel එක placeholder එකක්
ලෙසම පවතී. තේරීම එයට සම්බන්ධ කිරීමක් මෙම උදාහරණයේ නැති බැවිනි. මෙය layout සහ control ඝනත්වය පෙන්වීමේ
අභ්‍යාසයක් මිස mail client එකක් නොවේ.*

**මේ ගැන දැන්ම සැලසුම් කරන්න:** **visual designer එකක් තවමත් නැත.** Designer *කේතය* සංක්‍රමණය වී
ධාවනය වේ. `*.Designer.cs` සහ `*.Designer.vb` රටාව එලෙසම රැකෙයි. ඔබේ control library යොමු කරන
design-time වර්ගද තවමත් compile වේ. නමුත් runtime එකේදී ඒවා කිසිවක් instantiate නොකෙරේ. Layout එක
සංස්කරණය කිරීමට design surface එකක්ද නැත. මෙය කල් දැමූ විශේෂාංගයක් නොවේ; අවශ්‍ය බව පිළිගෙන, ලිඛිත
සැලැස්මක් ඇති විශේෂාංගයකි. එබැවින් designer ගොනු අතින් සංස්කරණය කිරීමට, නැතහොත් ඉහත පරිදි layout එක
කේතයෙන්ම ලිවීමට කාලය වෙන් කර ගන්න.

**අභ්‍යාසය 2.** ඔබේ කණ්ඩායම භාවිත කරන භාෂාවෙන් `GreetForm` එක සාදන්න. ඉන්පසු backend පැකේජය Headless
බවට මාරු කර, window එකක් විවෘත නොකරම යෙදුම ආරම්භ වී පිටවන බව තහවුරු කරන්න. හරියටම මේ සැකසුමම
[Module 8](#module-8) හිදී ඔබ නැවත භාවිත කරනු ඇත.

---

## Module 3 — ගොඩනැඟීමට පෙර, ක්‍රියා කරන්නේ මොනවාදැයි දැන ගන්න
{:#module-3}

**අපේක්ෂිත ප්‍රතිඵලය:** යම් member එකක් මත රඳා පැවතීමට පෙර, එය සැබවින්ම ක්‍රියා කරන්නේ දැයි සොයා බලන
ආකාරය ඔබ දනී. එසේම, මෙම රාමුවට ආවේණික දෝෂ රටාව දුටු විගස හඳුනා ගැනීමට ද ඔබට හැකි වේ.

මෙම මාර්ගෝපදේශයේ වැදගත්ම module එක මෙයයි. මුලින්ම
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) ගොනුව මුල සිට
අග දක්වා එක් වරක් කියවන්න. ඉන්පසු වැඩ කරන අතරතුර එය විවෘතව තබා ගන්න. එම ගොනුව සකසා ඇත්තේ හරියටම
ඔබේ තත්ත්වයේ සිටින අයෙකු සඳහාය. එනම්, WinForms කේත පදනමක් අතැතිව, විශ්වාස කළ හැක්කේ කුමක් දැයි
තීරණය කරන සංවර්ධකයෙකු සඳහාය.

### Stub ප්‍රතිපත්තිය
{:#module-3-stub-policy}

> **යම් member එකකට තවමත් ක්‍රියා කරන implementation එකක් නොමැති නම්, එය `NotImplementedException`
> විසි කරන්නේ නැත. ඒ වෙනුවට එය ආරක්ෂිතව කිසිවක් නොකර (no-op) නිහඬව පසු වේ, නැතහොත් සාධාරණ
> පෙරනිමි අගයක් ලබා දෙයි.**

මෙය සමස්ත ගැළපුම් ස්තරය පුරාම හිතාමතා, එකම ආකාරයට අනුගමනය කරන ප්‍රතිපත්තියකි. යම් දෘශ්‍ය විශේෂාංගයක්
තවම කිසිවක් නොකරන තැනකදී පවා, සංක්‍රමණය කළ කේතය compile වී *ධාවනය වන්නේ* මේ නිසාය. එය ක්‍රියාත්මක
වන ආකාරය මෙසේය:

- පිටුපස හැසිරීමක් නොමැති property එකක් සාමාන්‍ය settable auto-property එකක් පමණි. ඔබ සකසන අගය එය
  ගබඩා කර නැවත කියවා දෙයි. නමුත් runtime එකේදී කිසිදු හැසිරීමක් වෙනස් නොකරයි.
- implementation එකක් නොමැති method එකක් exception එකක් විසි නොකරයි. ඒ වෙනුවට එය උදාසීන අගයක්
  ලබා දෙයි. උදාහරණයක් ලෙස, තවම සැබෑ UI එකක් නොමැති dialog එකක `ShowDialog()` method එක වහාම
  `DialogResult.OK` ලබා දෙයි.
- කිසිදා raise නොවන event එකක් වුව ද compile වන අතර එයට subscribe කළ ද හැකිය. එය කිසිදා fire වන්නේ
  නැත, එපමණයි. මෙය භාවිත කර ඇත්තේ ඉතා අඩුවෙන් වන අතර, matrix එකේ එක් එක් type එක යටතේ සඳහන් කර ඇත.

**stub එකක් ලෙස හැසිරෙනු වෙනුවට exception එකක් විසි කරන member එකක් ඔබට හමු වුවහොත්, එය දෝෂයකි.
එය වාර්තා කරන්න** ([Module 10](#module-10-gaps)).

### මෙම ප්‍රතිපත්තියේ මිල, සහ එය ඔබේ කණ්ඩායමට පැහැදිලි කළ යුතු ආකාරය
{:#module-3-cost}

නිහඬ no-op එකක් යනු සොයා ගැනීමට අපහසුම ආකාරයේ හිඩැසයි. එය compile වේ, ධාවනය ද වේ. ඇති එකම රෝග ලක්ෂණය
නම්, ඉන් ඔබ්බෙහි කොතැනක හෝ වැරදි ප්‍රතිදානයක් ලැබීමයි. මෙයට ඇති සම්භාව්‍ය උදාහරණය ඒ ආකාරයෙන්ම කීම
වටී. ඕනෑම නීතියකට වඩා හොඳින් මෙම දෝෂ රටාව උගන්වන්නේ එයයි:

`Image.MakeTransparent` method එක හිස්ව තිබුණි. Port කළ game කේතයක්, sprite sheet එකක පසුබිම් වර්ණය
විනිවිද පෙනෙන (transparent) ලෙස සැකසීමට එය ඇමතීය. එම ඇමතුම කිසිවක් නොකළේය. ප්‍රතිඵලය වූයේ සෑම
sprite එකක්ම පිටුපස සුදු කොටුවක් සහිතව ඇඳීමයි. කිසිදු exception එකක් විසි වූයේ නැත. grep කර සෙවීමට
දෙයක් ද නොතිබුණි.

මෙයින් ඔබට කරුණු දෙකක් උගත හැකිය. පළමුව, **යමක් වැරදි ලෙස පෙනෙන විට හෝ හැසිරෙන විට, කිසිදු exception
එකක් විසි වී නොමැති නම්, ඔබේම කේතයට සැක කිරීමට පෙර stub එකක් ගැන සැක කරන්න.** අදාළ member එකට
අයත් matrix පේළිය පරීක්ෂා කරන්න. දෙවනුව, මේ ආකාරයේ හිඩැස් දැන් ආරක්ෂා කර ඇත. ව්‍යාපෘතිය, හිස් බඳක් ඇති
බව දන්නා public `void` methods සියල්ල baseline පරීක්ෂණයක සටහන් කර තබයි (`NoOpStubBaseline.txt`
ගොනුව; මෙය ලියන විට එහි ඇතුළත් කිරීම් 161 කි). ඒ නිසා අලුත් එකක් නිහඬව එකතු විය නොහැකි අතර, නිකුතුවෙන්
නිකුතුවට එම ලැයිස්තුව කෙටි වේ. අනෙක් ආකාරයේ හිස්කම් තුන ද සහෝදර baseline තුනකින් සටහන් කර ඇත. එනම්,
ප්‍රකාශ කර ඇතත් ක්‍රියා නොකරන events, කිසිදා raise නොවන events, සහ අගයක් ගබඩා කිරීම පමණක් කරන
properties යන ඒවාය (matrix එක දැනට වාර්තා කරන පරිදි, 1,254 න් පිළිවෙළින් 79, 127 සහ 812 කි). matrix එක
ප්‍රචාරක ලේඛනයක් ලෙස නොව, විශ්වාස කළ හැකි යොමුවක් ලෙස සැලකිය හැක්කේ මේ නිසාය. එහි ඇති සංඛ්‍යා
ඇස්තමේන්තු නොවේ; ඒවා පරීක්ෂණවලින් බලාත්මක කර ඇත.

### ඔබ රඳා පවතින හැසිරීම පරීක්ෂණයකින් ස්ථිර කරන්න
{:#module-3-pin}

ප්‍රායෝගික ආරක්ෂාව නම්, ඔබ කරන එක් එක් උපකල්පනයකට එක් පරීක්ෂණයක් ලිවීමයි. යම් විශේෂාංගයක් ඔබට වැදගත්
නම්, member එක පවතින බව නොව එහි *ප්‍රතිඵලය* තහවුරු කරන්න. stub එකක් හසු කර ගන්නා පරීක්ෂණයක් සහ හසු
නොකරන පරීක්ෂණයක් අතර වෙනස එයයි:

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

ඔබේ යෙදුමට අත්‍යවශ්‍ය සෑම member එකකටම මෙවැනි පරීක්ෂණයක් ලියන්න. එයට ගත වන්නේ මිනිත්තු කිහිපයකි.
නමුත් එය වැදගත් වන දවසේදී, නිහඬ no-op එකක් රතු build එකක් බවට පත් කරන්නේ එයයි.

### උපකල්පනය නොකර පරීක්ෂා කරන්න: සාක්ෂි
{:#module-3-apidiff}

ව්‍යාපෘතිය තමන්ගේම public API surface එක, සැබෑ `System.Windows.Forms` reference assembly එක සමඟ
reflection මගින් සංසන්දනය කරයි. එම ප්‍රතිඵලය committed baseline එකක් ලෙස තබා ගනී. මෙම විගණනයේ පළමු
ධාවනයේදී **අතුරුදහන් ඇතුළත් කිරීම් 1,905 ක්** හමු විය. ඒ අතර, **වැරදි සංඛ්‍යාත්මක අගයක් සහිතව පවතින enum
members 126 ක්** ද විය. ඒ අවසාන කාණ්ඩය ගැන විශේෂයෙන් සැලකිලිමත් වන්න. එවැනි කේතයක් compile වේ, ධාවනය
වේ, නමුත් නිහඬව වෙනත් අර්ථයක් දෙයි. ඔබේ යෙදුම රඳා පවතින member එකින් එක පරීක්ෂා කළ යුත්තේ ඇයි ද,
සමානත්වය උපකල්පනය නොකළ යුත්තේ ඇයි ද යන්නට මෙයට වඩා හොඳ හේතුවක් නැත.

**API-surface baseline දෙකම, එනම් WinForms සහ GDI+ යන දෙකම, දැන් ශුන්‍යයේ පවතී.** upstream එක ප්‍රකාශ
කරන සෑම member එකක්ම මෙම ස්තරය ද ප්‍රකාශ කරයි. නමුත් මෙය හොඳින් තේරුම් ගන්න. එය ගැටලුවේ කුඩා අර්ධය
පමණි. නම් මට්ටමින් කරන සංසන්දනයකට, member එකක් WinForms මෙන් *හැසිරෙන්නේ* දැයි විමසිය නොහැකිය. ක්ෂේත්‍ර
දොළහක් ආවරණය කළ මූලාශ්‍ර විගණනයක් (2026-08-25) හරියටම එම ප්‍රශ්නය ඇසූ අතර, **හැසිරීම වෙනස් වන ස්ථාන
483 ක්** සොයා ගත්තේය. ඉන් 41 ක්, සාමාන්‍ය සංක්‍රමණය කළ යෙදුමක් බිඳ දැමීමට තරම් බරපතළ විය. එම ලැයිස්තුවේ
වැඩි කොටසක් මේ වන විට අදියර වශයෙන් නිවැරදි කර ඇත (`ProcessCmdKey` හරහා යතුරුපුවරු පූර්ව-සැකසුම,
focus/validation සඳහා එක් මධ්‍යස්ථානයක්, සැබෑ dialogs, සැබවින්ම පරිමාණය කරන `AutoScaleMode.Font`,
ක්‍රියා කරන `CurrencyManager` එකක් සහිත සජීවී data binding, වගුවක් ලෙස render වන
`ListView.View = Details`, upstream පිළිවෙළටම ක්‍රියාත්මක වන form lifecycle events, Ctrl+Z මගින් text box
undo කිරීම, ආදිය). ඉතිරිව ඇති දේ
[`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md) ගොනුවේ
ලැයිස්තුගත කර ඇත. ඔබේ කණ්ඩායමට ඇති පාඩම වෙනස් නොවේ: **"compile වේ" යන්නෙන් අදහස් වන්නේ නම පවතින බව
පමණි. එය ක්‍රියා කරන්නේ දැයි කියන්නේ matrix පේළියයි.**

### control එකින් control එකට ඇති වගුව කියවීම
{:#module-3-reading}

matrix එකේ තත්ත්වය ලකුණු කර ඇත්තේ සංක්‍රමණය වන සංවර්ධකයෙකුගේ දෘෂ්ටිකෝණයෙනි:

| තත්ත්වය | අර්ථය |
|---|---|
| **Implemented** | සාමාන්‍යයෙන් භාවිත වන සියල්ල පවතී. හිඩැස් ඇත්තේ ගැඹුරු හෝ දුර්ලභ කොන්වල, නැතහොත් matrix එක එක් වරක් සඳහන් කරන පද්ධතිමය රටාවල පමණි. |
| **Partial** | අතුරුදහන් වී ඇති, බහුලව භාවිත වන members මොනවාදැයි නමින්ම සඳහන් කරයි. |
| **Missing** | එම නමින් type එක කිසිසේත් නොපවතී. |

වැඩිපුරම භාවිත වන controls (`Button`, `TextBox`, `Panel`, `TabControl`, `TableLayoutPanel`, `TreeView`,
`ListView`, menus, toolbars, status bars, පොදු dialogs, ආදිය) සැබවින්ම ක්‍රියා කරන ලෙස implement කර ඇත.
ඒවා stubs නොවේ. වැඩ සැලසුම් කිරීමට පෙර දැන ගත යුතු හිඩැස් මේවාය:

| Type එක | සැලකිලිමත් විය යුතු දේ |
|---|---|
| `DataGridView` | තනි type එකක ඇති විශාලතම හිඩැස මෙයයි. එහෙත් වැඩිපුරම භාවිත වන hooks **සැබවින්ම ක්‍රියා කරන අතර fire වේ**: `CellFormatting`, `CellPainting`, `RowPrePaint`/`RowPostPaint`, `CellParsing`, `RowValidating`/`RowValidated`, `GetClipboardContent()`, සහ border-style properties. ප්‍රකාශ කර ඇතත් කිසිදා raise නොවන ඒවා: `RowsAdded`/`RowsRemoved`, `DataError`, `SortCompare`, `CellValueNeeded`/`CellValuePushed`, `CellMouse*` පවුල, සහ සියුම් මට්ටමේ `*Changed` events. Auto-sizing කරන්නේ invalidate කිරීම පමණි. |
| `ListView` | owner-draw නැත. virtual-mode සඳහා දත්ත ලබා ගන්නා callbacks නැත (`VirtualMode` සාමාන්‍ය property එකක් පමණි). `InsertionMark` නැත. |
| `TreeView` | `Sorted` නැත. `ImageKey`/`SelectedImageKey` නැත (index මත පදනම් වූ `ImageIndex` ක්‍රියා කරයි). `HitTest` නැත. `ShowNodeToolTips` නැත. |
| `ComboBox`/`ListBox`/`CheckedListBox` | `DataSource`/`DisplayMember`/`ValueMember` පවතී. binding *format* hooks සහ `Sort()` නොපවතී. |
| `RichTextBox`, `MaskedTextBox` | පිළිවෙළින්: undo/redo සහ `SelectedRtf`; overwrite-mode සහ char-index අනුව ස්ථානගත කිරීම. |
| `ToolStrip` පවුල | `MenuStrip`/`ContextMenuStrip`/`StatusStrip` සැබවින්ම `ToolStrip` වෙතින් උරුම වේ. ඒ නිසා සම්පූර්ණ surface එකටම ළඟා විය හැකිය. නමුත් `ToolStrip` මට්ටමේ members stubs වේ. `Renderer`/`RenderMode` සැකසීමෙන් ඇඳීම වෙනස් **නොවේ**. `LayoutStyle` මගින් layout එක වෙනස් නොවේ. overflow button එකක් නැත. ක්‍රියා කරන්නේ එක් එක් control එක දැනටමත් හොඳින් කළ දේ පමණි. |
| `WebBrowser` | Navigation ක්‍රියා කරයි. DOM object model එකක් කිසිසේත් නැත (`Document`, `HtmlElement`, ආදිය). එයට හේතුව, මෙය COM automation මත නොව සැබෑ webview එකක් මත පදනම් වීමයි. |
| පොදු dialogs | ප්‍රතිඵල සහ `ShowDialog()` ක්‍රියා කරයි. Windows shell එකට පමණක් අයත් අමතර දේ (`CustomPlaces`, `AutoUpgradeEnabled`, dialog hook plumbing) නැත. එය අපේක්ෂිතය; hook කිරීමට native dialog එකක් නැත. |

**Grid එක සමඟ වැඩ කිරීම, ප්‍රායෝගිකව.** බොහෝ LOB යෙදුම්වල ජීවය ඇත්තේ `DataGridView` එක තුළ නිසා,
සහාය *දක්වන* රටාව මෙහි දක්වා ඇත. එනම්, ක්‍රියා නොකරන members හරහා නොව, සැබවින්ම fire වන events හරහා
formatting සහ painting කිරීමයි:

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

![macOS මත ධාවනය වන DataGridView CellFormatting උදාහරණය]({{ '/assets/img/example-grid.png' | relative_url }})

*සාමාන්‍ය `List<Order>` එකක් සමඟ ධාවනය වන එම කේතය. bind කළ type එකෙන් columns ස්වයංක්‍රීයව සෑදී ඇත.
අගයන් මුදල් ලෙස format වී ඇත. සෘණ අගයන් රතු පැහැයෙන් පෙනෙන්නේ, handler එකේ `e.CellStyle.ForeColor`
අගය සැබවින්ම renderer එක දක්වා ළඟා වන නිසාය.*

> **ඔබ තවමත් 26.0.30 අනුවාදයේ රැඳී සිටී නම් දැන ගත යුතු කරුණක්.** එම පැකේජයේදී, bind කළ cell අගයන්
> `CellFormatting` වෙත පැමිණෙන්නේ දැනටමත් string බවට හරවා තිබියදීය. ඒ නිසා `e.Value is decimal` කිසිදා
> ගැළපෙන්නේ නැත. මෙම handler එක නිහඬව කිසිවක් නොකරයි. එය හරියටම මෙම module එකෙන් කතා කරන දෝෂ රටාවයි.
> ඊළඟ නිකුතුවලදී එය නිවැරදි කර ඇත (bind කළ cells දැන් member එකේ type එක රඳවා ගනී). ඒ නිසා ඉහත කේතය
> 26.9.0 වැනි වත්මන් අනුවාදයක නිවැරදිව ක්‍රියා කරයි. ඔබ 26.0.30 හි සිටින අතර format නොවූ අගයන් පෙනේ
> නම්, ඒ වෙනුවට ආරක්ෂිතව parse කරන්න: `decimal.TryParse (e.Value?.ToString (), out var total)`. එම
> ආකාරය අනුවාද දෙකේම ක්‍රියා කරයි.

එම වගුවෙන්ම, ඔබ තවම කේත *නොලිවිය යුතු* members: `RowsAdded`, `DataError`, `SortCompare`,
`CellValueNeeded` (ඒ නිසා virtual mode නැත), සහ `CellMouse*` පවුල. ඒ සෑම එකක්ම compile වන නමුත් නිහඬව
කිසිදා fire නොවේ. [ඉහත](#module-3-cost) විස්තර කළ දෝෂ රටාව හරියටම එයයි.

Vendor stacks වලින් පැමිණෙන කණ්ඩායම් සඳහා සටහන් දෙකක්. **Telerik UI for WinForms** සඳහා පූර්ණ ගැළපුම්
ස්තරයක් (`Majorsilence.Forms.Telerik`) ඇත. එහි මූලාශ්‍රයේම ගිවිසුම පැහැදිලිව සඳහන් කර ඇත: *ආවරණය
compile වී ආසන්න වශයෙන් ක්‍රියා කිරීම පමණි, පික්සලයෙන් පික්සලයට නිවැරදි නොවේ*. එසේම, `TextBox` එකට
සම්බන්ධ කර ඇති **spellcheck** විශේෂාංගය, කිසිදු dependency එකක් නොමැතිව මුල සිට ලියූ implementation එකකි.
එහි රැළි සහිත යටි ඉරි සහ යෝජනා menu එකක් ඇත. එය WinForms API එකක් නොවේ. එය පවතින්නේ Telerik හි
`RadSpellChecker` එකට පදනම සැපයීමටය.

**අභ්‍යාසය 3.** ඔබේ යෙදුම රඳා පවතින members තුනක් තෝරා ගන්න. එකක් ඔබට විශ්වාසයි, එකක් විශ්වාස නැත, තවත්
එකක් දුර්ලභ එකකි. ඒ එක් එක්ක implement කර ඇත්ද, stub කර ඇත්ද, නැතහොත් නොපවතී ද යන්න matrix එකෙන්
සොයා ගන්න. ඉන්පසු ඔබට අඩුම විශ්වාසය ඇති එක සඳහා [ස්ථිර කරන පරීක්ෂණයක්](#module-3-pin) ලියන්න.

---

## Module 4 — ඇඳීම සහ custom paint
{:#module-4}

**අපේක්ෂිත ප්‍රතිඵලය:** `System.Drawing` types අතරින් එලෙසම පවතින්නේ මොනවාද, වෙනත් තැනකට යන්නේ මොනවාද
යන්න ඔබ දනී. එසේම WinForms ආකාරයේ සහ Skia-native ආකාරයේ painting කේත දෙකම ලිවීමට ඔබට හැකි වේ.

`Majorsilence.Forms.Drawing` යනු Windows එකට පමණක් සීමා වූ `System.Drawing.Common` (GDI+) සඳහා Skia මත
පදනම් වූ බහු-වේදිකා ආදේශකයකි. සියල්ල තීරණය කරන බෙදීම මෙයයි:

| මූලාශ්‍රය | ඉලක්කය | හේතුව |
|---|---|---|
| `System.Drawing` **primitives**: `Color`, `Point`, `PointF`, `Size`, `SizeF`, `Rectangle`, `RectangleF` | *වෙනසක් නැත* | ඒවා දැනටමත් සෑම වේදිකාවකම `System.Drawing.Primitives` තුළ ලැබේ. |
| `System.Drawing` **GDI+ types**: `Bitmap`, `Font`, `Pen`, `Brush`, සහ `Graphics` ආශ්‍රිත ඒවා | `Majorsilence.Forms.Drawing` | `System.Drawing.Common` හි GDI+ ක්‍රියා කරන්නේ Windows මත පමණි. SkiaSharp මත නැවත implement කර ඇත. |
| `System.Drawing.Drawing2D` / `.Imaging` / `.Text` | `Majorsilence.Forms.Drawing.Drawing2D` / `.Imaging` / `.Text` | එම බෙදීමම, sub-namespace වශයෙන්. |
| `System.Drawing.Printing` | `Majorsilence.Forms.Printing` | මුද්‍රණය අයත් වන්නේ ගැළපුම් ස්තරයේ ඇඳීම් පැත්තට නොව Forms පැත්තටය. |
| `System.Windows.Forms.VisualStyles`, `System.Drawing.Design`, `System.ComponentModel.Design` | *එලෙසම තබයි* | සමාන දෙයක් නැත. නොපවතින දෙයක් බවට නැවත ලියනු වෙනුවට, අතින් සමාලෝචනය කිරීමට සලකුණු කරයි. |

ඇඳීම් ස්තරය තනිව භාවිත කිරීමට උත්සාහ කරන අය පැකිලෙන පැකේජ විස්තරයක් ඇත. value types, රූප, fonts සහ
සම්පත් ඇත්තේ `Majorsilence.Forms.Drawing.Common` පැකේජයේය. නමුත් **`Graphics` class එකම ලැබෙන්නේ මූලික
`Majorsilence.Forms` පැකේජයෙනි** (namespace එක තවමත් `Majorsilence.Forms.Drawing` වේ). ඒ නිසා headless
ලෙස රූප සැකසීමට ද මූලික පැකේජය reference කළ යුතුය. ඕනෑම යෙදුමක එය කෙසේ හෝ දැනටමත් ඇත.

සැබෑ support tickets ඇති කරන නිශ්චිත කරුණු තුනක් ඇත:

1. **`System.Drawing.Common` ඔබේ project එකෙන් ඉවත් කළ යුතුමය.** එය .NET 7 සිට Windows එකට පමණක් සීමා වීම
   එයට එකම හේතුව නොවේ. එය reference කර තැබුවහොත්, Majorsilence ආදේශක අසලම `System.Drawing.Bitmap`,
   `Font` සහ `Pen` නැවත scope එකට පැමිණේ. එවිට unqualified ලෙස භාවිත කරන සෑම තැනක්ම port එක වෙත
   resolve වනු වෙනුවට, *ambiguous reference* දෝෂයක් ලෙස අසාර්ථක වේ.
2. **`SystemColors` සහ `ColorTranslator` මෙම ambiguity ගැටලුවට ඇති ව්‍යතිරේක දෙකයි.** ඒවා ඇත්තේ
   `System.Drawing.Primitives` තුළය. ඒ නිසා primitives සඳහා ඔබ තබා ගන්නා `using System.Drawing;` හරහා
   ඒවා තවමත් resolve වේ. unqualified ලෙස භාවිත කළ විට ඒවා Majorsilence හි ඒවා සමඟ ගැටේ (CS0104). විසඳුම
   එක් පේළියක alias එකකි. අවශ්‍ය ගොනුවලට පමණක්, migrator එක එය ඔබ වෙනුවෙන් එක් කරයි:

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

3. **gradient සහ hatch brushes ඇත්තේ GDI+ ඒවා තබන තැනමය**: `LinearGradientBrush`, `PathGradientBrush`,
   `HatchBrush` සහ `HatchStyle` ඇත්තේ `Majorsilence.Forms.Drawing.Drawing2D` තුළය. `Brush`, `SolidBrush`
   සහ `TextureBrush` ඇත්තේ `Majorsilence.Forms.Drawing` තුළය. ඒවා සැබවින්ම `System.Drawing` types වේ.
   නැවත ලියූ import එක හරහා ඒවාට ළඟා වන කේතයට කිසිදු බලපෑමක් නැත. යාවත්කාලීන කළ යුත්තේ fully-qualified
   යොමු පමණි.

### Offscreen රූප සැකසීම
{:#module-4-offscreen}

`Graphics.FromImage` ක්‍රියා කරන්නේ GDI+ හි ක්‍රියා කරන ආකාරයටමය. ඒ නිසා ඔබේ පවතින imaging කේතයෙන්
බොහොමයක් imports වෙනස් කිරීමෙන් පමණක් port වේ:

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

![offscreen රූප සැකසීමේ උදාහරණයෙන් නිපදවූ thumbnail එක]({{ '/assets/img/example-thumbnail.png' | relative_url }})

*එම method එකේ සැබෑ ප්‍රතිදානය: 1080×752 ප්‍රමාණයේ screenshot එකක්, bicubic interpolation මගින් පළල
320 px දක්වා කුඩා කර ඇත. පහළින් අර්ධ විනිවිද පෙනෙන watermark තීරුව ද ඇත.*

එම කේතයට කිසිදු UI dependency එකක් නැත. එය console යෙදුමක, service එකක හෝ පරීක්ෂණයක ධාවනය කළ හැකිය.

### Custom paint: ක්‍රම දෙකක්, සහ ඒ එක් එක්ක භාවිත කළ යුත්තේ කවදාද
{:#module-4-paint}

`PaintEventArgs` මගින් ඔබට ඇඳීමට surfaces **දෙකක්ම** ලැබේ. `e.Graphics` යනු GDI+ හැඩයේ wrapper එකයි.
ඒ නිසා port කළ `OnPaint` කේතය කිසිදු වෙනසක් නොමැතිව compile වේ. `e.Canvas` යනු රාමුවම ඇඳීමට භාවිත කරන
අමු `SKCanvas` එකයි. GDI+ ට කිසිදා කළ නොහැකි වූ, Skia හොඳින් කරන දෙයක් ඔබට අවශ්‍ය වූ විට එය භාවිත කරන්න.

**C#: WinForms ආකාරයට, වෙනසක් නොමැතිව port වේ**

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

**VB.NET: WinForms ආකාරයට, වෙනසක් නොමැතිව port වේ**

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

**C#: Skia-native, GDI+ ට ප්‍රකාශ කළ නොහැකි effects සඳහා**

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

**VB.NET: Skia-native**

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

![macOS මත ධාවනය වන, custom paint ක්‍රම දෙකම එක ළඟ]({{ '/assets/img/example-paint.png' | relative_url }})

*එක් කවුළුවක controls දෙකම. වමේ: GDI+ හැඩයේ මාර්ගය, එනම් තනි වර්ණයකින් පිරවූ, 2 px සුදු දාරයක් සහිත
කොටුව. දකුණේ: Skia මාර්ගය, එනම් වටකුරු කොන් සහ සැබෑ gradient shader එකක්, එක් `DrawRoundRect`
ඇමතුමකින්.*

**ඔබේ කණ්ඩායමට උපදෙස:** සංක්‍රමණය කරන්නේ `e.Graphics` සමඟය. එයට අමතර වියදමක් නැත; කේතය දැනටමත් ඇත.
අලුත් දෘශ්‍ය අංග සඳහා, හිතාමතාම `e.Canvas` තෝරා ගන්න. එක් handler එකක් තුළ දෙකම මිශ්‍ර කිරීමේ වරදක් නැත.
දෙකම අඳින්නේ එකම surface එක මතය.

**Canvas එක ඇත්තේ logical units වලිනි. එය ඔබම scale නොකරන්න.** ඉහත උදාහරණ දෙකම අඳින්නේ
`ClientRectangle`, `Width` සහ `Height` අනුවය. අමතර කේතයක් නොමැතිව, HiDPI desktop එකක හෝ දුරකථනයක
(Android එකක scaling අගය දළ වශයෙන් 2.6 සිට 2.75 දක්වා වේ) ඒවා නිවැරදි ප්‍රමාණයෙන් පෙනේ. ඊට හේතුව, ඔබේ
`OnPaint` ධාවනය වීමට පෙර රාමුව canvas එක display එකට ගැළපෙන ලෙස scale කිරීමයි. 2026-10-01 ට පෙර canvas
එක තිබුණේ *device* pixels වලිනි. එවිට custom control එකක් `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`
තනිවම ඇමතිය යුතු විය. **ඔබේ control එකක එම ඇමතුම තිබේ නම්, එය ඉවත් කරන්න.** දැන් එය ඇඳීම දෙවරක් scale
කරයි. එහි රෝග ලක්ෂණය නම්, 2× display එකක control එක දෙගුණ ප්‍රමාණයෙන් ඇඳෙන අතර ඔබේ 1× monitor එකේ
හොඳින් පෙනීමයි. `e.ClipRectangle` සහ `e.Canvas` ද logical units වලින්ම වේ. හරියටම device pixel එකක
ඇඳීමට අවශ්‍ය දුර්ලභ අවස්ථා (hairline එකක්, pixel-art sprite එකක්) සඳහා `PaintEventArgs.Scaling` තවමත්
ඇත. ඔබට තවමත් device pixels ලැබෙන එකම තැන owner-draw පවුලයි. එනම් `DrawItem`, `DrawNode`,
`CellPainting` සහ ඒ හා සමාන ඒවාය. ඒවායේ `Bounds` සහ `Graphics` එකිනෙකට ගැළපේ. නමුත් control එකේ logical
`ClientRectangle` එකට නොගැළපේ. දෙවර්ගයම `MF_HEADLESS_SCALE=2` යටතේ පරීක්ෂා කරන්න
([Module 8](#module-8-headless)).

### Control එකක් animate කිරීම: `RequestAnimationFrame`
{:#module-4-animation}

WinForms හි animation කළේ 16 ms `Timer` එකකිනි. එය තවමත් ක්‍රියා කරයි. ඊට අමතරව රාමුව browser එකේ
ක්‍රමය ද ලබා දෙයි. එය Avalonia මත display එකට සමගාමී වේ. ඔබේ පරීක්ෂණවලට වැදගත් වන කරුණ නම්, Headless
මත එය සම්පූර්ණයෙන්ම deterministic වීමයි. `control.RequestAnimationFrame (callback)` ඇමතීමෙන්, ඊළඟ frame
එක ආරම්භයේදී ඔබේ callback එක **එක් වරක්** පමණක් ඇමතේ. එයට ලැබෙන timestamp එකට අර්ථයක් ඇත්තේ වෙනසක්
ලෙස පමණි. දිගටම යාමට නම්, callback එක තුළින්ම නැවත ඉල්ලන්න. (මෙය `docs/animation.md` සමඟ සසඳා පරීක්ෂා
කරන ලදී; මෙම මාර්ගෝපදේශය සඳහා ධාවනය නොකළේය.)

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

Headless backend එක මත, ඔබ ඔරලෝසුව ඉදිරියට ගෙන යන තුරු කිසිවක් ධාවනය නොවේ. ඒ නිසා animation එකක්
නිවැරදි assertion එකක් බවට පත් වේ. `HeadlessRenderer.AnimationClock.Reset ()` අමතන්න. ඔබේ frames ඉල්ලන්න.
ඉන්පසු `HeadlessRenderer.AnimationClock.Step (10)` අමතන්න. එවිට 1/60 s බැගින් වූ frames දහයක් ධාවනය වන අතර,
ඔබේ callback එකට හරියටම timestamps දහයක් ලැබී ඇත. `Majorsilence.Forms.Animation` පැකේජය එම frame
ඉල්ලීම මතම `Tween<T>`, `Easing` සහ `control.Animate (…)` ගොඩනඟයි. පරිශීලකයා අඩු චලනයක් ඉල්ලා ඇති බව
`SystemInformation.PrefersReducedMotion` මගින් ඔබට දැනුම් දෙයි. එය උපදෙසක් පමණි. ඒ නිසා animation එකක්
*ආරම්භ කරන* තැනදී එය පරීක්ෂා කිරීම ඔබේ වගකීමකි. විස්තර
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md) ගොනුවේ ඇත.

Skia-native ලෙස ලියන විට ඇති උගුලක්: **අමු `SKFont`/`DrawText` කිසිදු font fallback එකක් නොකරයි.** රාමුවේම
පෙළ ඇඳීම, නොමැති glyphs සඳහා fallback දාමයක් හරහා විසඳුමක් සොයයි. නමුත් හුදු `SKTypeface.Default` එකක්
එසේ නොකරයි. එම typeface එකට නැති glyph එකක් (ඊතලයක්, emoji එකක්, CJK අකුරක්) අඩංගු string එකක් ඇන්ද
විට, ඔබට ලැබෙන්නේ නිහඬව පෙන්වන missing-glyph කොටුවයි. පරිශීලකයාට පෙනෙන පෙළ සඳහා `e.Graphics.DrawString`
භාවිත කරන්න. නැතහොත් ඔබේ typeface එක පැහැදිලිවම තෝරා ගන්න.

Skia ට GDI+ අනුගමනය කිරීමට සැබවින්ම නොහැකි තැන්වල, matrix එක මවා පාන්නේ නැතිව එය පැහැදිලිව කියයි. custom
line cap එකක් සහිත `Pen` එකක් stroke කරන්නේ එම cap එකේ ප්‍රකාශිත `BaseCap` එක භාවිතයෙනි (`SKPaint` ලබා
දෙන්නේ butt, round සහ square පමණි). `Pen.Alignment` ගබඩා වේ, නමුත් යොදන්නේ නැත. `Image.Palette` සැකසීමෙන්
නැවත quantize වන්නේ නැත. ඊට හේතුව, නවීන SkiaSharp හි indexed bitmap type එකක් නොමැති වීමයි. සෑම surface
එකක්ම 32bpp වේ.

**අභ්‍යාසය 4.** ඔබ සතු GDI+ කේත කොටසක් (thumbnail generator එකක්, chart එකක්, watermark එකක්) UI එකක්
නොමැති console යෙදුමක, `Majorsilence.Forms.Drawing` මත port කරන්න. ඉන්පසු custom paint කළ control එකක්
ගෙන, `e.Canvas` හරහා Skia-native ස්පර්ශයක් (gradient එකක්, blur එකක්, වටකුරු clip එකක්) එක් කරන්න.

---

## Module 5 — ඔබේ WinForms යෙදුම සංක්‍රමණය කිරීම
{:#module-5}

**අපේක්ෂිත ප්‍රතිඵලය:** ඔබේ solution එක මත `majorsilence-migrate` ධාවනය කිරීමටත්, එය දෙන වාර්තාව
තේරුම් ගැනීමටත්, ඉන් පසුව අතින් නිවැරදි කළ යුතු දේවල් ලැයිස්තුව (checklist) පියවරෙන් පියවර සම්පූර්ණ කිරීමටත්
ඔබට හැකි වේ.

### ස්ථාපනය
{:#module-5-install}

```
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help
```

හැකි නම් tool එක repo එකටම සීමා කර ස්ථාපනය කරන්න. එනම් මුලින් `dotnet new tool-manifest` ධාවනය කර,
ඉන්පසු `dotnet tool install Majorsilence.Forms.Migrator` මගින් ස්ථාපනය කර, `dotnet majorsilence-migrate`
ලෙස ධාවනය කරන්න. එවිට මුළු කණ්ඩායමම භාවිත කරන්නේ එකම අනුවාදයයි. **මෙම tool එක ලැබෙන්නේ dotnet tool
පැකේජයක් ලෙස පමණි.** කලින් නිකුතු සමඟ වේදිකාවකට එක බැගින් තනි-ගොනු binary එකක්ද ලබා දුන් නමුත් දැන් එසේ
නොකෙරේ. එය ධාවනය කිරීමට යන්ත්‍රයේ .NET runtime එකක් තිබිය යුතුය (ඔබ සතුව ඇති නවතම ප්‍රධාන අනුවාදය
කුමක් වුවත් එය මතට roll forward වේ). කිසිවක් ස්ථාපනය නොකර භාවිත කිරීමට අවශ්‍ය නම්, රාමුවේ clone එකක සිට
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>` ලෙස ධාවනය කළ හැකිය.

### ඔබේ කේතයේ සංක්‍රමණය පෙනෙන අයුරු
{:#module-5-beforeafter}

වෙන කිසිවකට පෙර, වෙනස කොතරම් කුඩාදැයි බලමු. පහත දැක්වෙන්නේ සාමාන්‍ය form එකක මුල් කොටස, සංක්‍රමණයට පෙර
සහ පසු:

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
            InitializeComponent ();                          // ඔබේ Designer ගොනුව ස්පර්ශ නොවේ
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

සම්පූර්ණ වෙනස මෙපමණයි. import වෙනස් වේ; `Handles` වගන්ති සහ Designer කේතය එලෙසම පවතී; ඔබේ ව්‍යාපාරික
තර්කනයට (business logic) කිසිදු අතක් නොතබයි.

### tool එකේ ප්‍රතිඵල සමඟ තර්ක කිරීමට පෙර, එය කරන්නේ කුමක්දැයි තේරුම් ගන්න
{:#module-5-design}

`majorsilence-migrate` යනු හිතාමතාම **පෙළ සහ regex මත පදනම් වූ, pass කිහිපයකින් ක්‍රියා කරන rewriter
එකකි**. එය syntax tree එකක් parse නොකරයි; symbol විසඳීමක්ද නොකරයි. එසේ නිර්මාණය කර ඇත්තේ හේතුවක් ඇතිවය:

- **කැඩුණු කේතය මතද එය ක්‍රියා කරයි.** අඩක් සංක්‍රමණය කළ solution එකක්, තවම port නොකළ type එකක් යොමු කරන
  `.vb` ගොනුවක්, reference එකක් අඩු project එකක්: මේ කිසිවක් rewriter එක නවත්වන්නේ නැත. මන්ද කේතය
  compile වීම හෝ parse වීම පවා එයට අවශ්‍ය නොවන බැවිනි. Roslyn මත පදනම් වූ tool එකක් නම් project එක build
  වන තුරු එය ස්පර්ශ කිරීම ප්‍රතික්ෂේප කරයි. පැරණි කේත පදනමක් මත *පළමු වටයක්* යාමට එය කිසිසේත් ගැළපෙන්නේ නැත.
- **එය වේගවත්ය.** ගොනු දහස් ගණනක් තත්පර කිහිපයකින් සකසයි.
- **එය අත්හරින දේ:** project අතර සැබෑ symbol විසඳීමයි. හුදෙක් `Panel` ලෙස ලියා ඇති නමක්
  `System.Windows.Forms.Panel` ද, නැතිනම් ඔබේම `Panel` නමැති class එකද යන්න එයට කිව නොහැකිය. එය රඳා
  පවතින්නේ namespace prefix රටා සහ import සන්දර්භය මතය. හඳුනා නොගන්නා සෑම namespace එකක්ම **නිහඬව අනුමාන
  කරනු වෙනුවට අතින් සමාලෝචනය කිරීම සඳහා සලකුණු කෙරේ**.

හරියටම එම අන්ධ ලක්ෂ්‍යය සඳහා, අවශ්‍ය නම් සක්‍රිය කළ හැකි දෙවන engine එකක්ද ඇත. එය `--engine roslyn` යි.
එය පෙළ මත පදනම් වූ engine එකට උඩින් ක්‍රියා කරන අතර සැබෑ symbol විසඳීමක් භාවිත කරයි:

| | `--engine text` (පෙරනිමිය) | `--engine roslyn` |
|---|---|---|
| ආදානය | ඕනෑම `.sln`/`.csproj`/`.vbproj`/ෆෝල්ඩරයක්/තනි ගොනුවක් | **load කළ හැකි** project එකක් අවශ්‍යයි. හුදු ෆෝල්ඩරයක් හෝ තනි ගොනුවක් දුන් විට මුළු ධාවනයම අනතුරු ඇඟවීමක් සමඟ text engine එකට ආපසු යයි |
| compile නොවන කේතය ඉවසයිද | ඔව් | නැත |
| වේගය | තත්පර කිහිපයක් | බොහෝ ගුණයකින් මන්දගාමීය (වැඩි කාලය ගත වන්නේ MSBuild ඇගයීමටය) |
| එකම නමක් ඇති type වෙන් කර හඳුනා ගැනීම | නැත | **ඔව්. එය පවතින්නේම ඒ සඳහාය** |
| අසාර්ථක වීම හසුරුවන අයුරු | අදාළ නොවේ | *project එක බැගින්* ආරක්ෂිතව අසාර්ථක වේ (එම project එකේ ගොනු text engine එකට ආපසු යයි). MSBuild කිසිසේත් සොයාගත නොහැකි නම්, නිහඬව පහළ වැටෙනු වෙනුවට මුළු ධාවනයම අසාර්ථක වේ |

**කණ්ඩායම් නීතිය:** විශාල පැරණි කේත පදනමක පළමු වටය සැම විටම පෙරනිමි `--engine text` මගින් කරන්න.
`--engine roslyn` වෙත යා යුත්තේ ඉන් පසුව, දැන් load කළ හැකි ප්‍රතිඵලය මත, ඔබේම custom type එකක් WinForms
හෝ GDI+ type එකක නමම භාවිත කරන බව *තහවුරු කළ* අවස්ථාවක පමණි. එක් තැනක එය *අඩු* අනතුරු ඇඟවීම් ප්‍රමාණයක්
දෙන බවද සිහි තබා ගන්න: හුදු `using System.Drawing;` එකක් යටතේ ඇති, සම්පූර්ණ නම නොදක්වා ලියූ GDI+ type
සලකුණු කරනු වෙනුවට එය කෙලින්ම නිවැරදි කරයි. එම වෙනස දෝෂයක් නොවේ.

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

git මගින් පාලනය වන branch එකක, ගොනු එම ස්ථානයේම වෙනස් කරමින් ධාවනය කිරීමෙන් (git එකම ඔබේ backup එක
වන නිසා `--no-backup` සමඟ) සංක්‍රමණය idempotent සහ diff කළ හැකි එකක් බවට පත් වේ. එනම් එය ධාවනය කර, ගොනුවෙන්
ගොනුව පරීක්ෂා කර, පසු කලෙක තවත් පැරණි කේත ගෙන ආ විට ආරක්ෂිතව නැවත ධාවනය කළ හැකිය.

පළමු දිනයේම දැන සිටිය යුතු විකල්ප (options):

| විකල්පය | භාවිතය |
|---|---|
| `-o, --output <dir>` | ගොනු එම ස්ථානයේම වෙනස් කරනු වෙනුවට පිටපතක් වෙනම ෆෝල්ඩර ව්‍යුහයකට ලියයි |
| `-n, --dry-run`, `--diff` | වෙනසට ඉදිරිපත් වීමට පෙර එහි පරාසය බලා ගන්න |
| `--backend <name>` | `avalonia` (පෙරනිමිය) \| `uno` \| `headless` — යොමු කරන backend පැකේජය තෝරයි |
| `--tfm <tfm>` | TFM එක බලෙන් සකසයි. පෙරනිමිය: අනුවාදය එලෙස තබා `-windows` suffix එක පමණක් ඉවත් කරයි |
| `--package-version <v>` | පෙරනිමිය migrator එකේම අනුවාදයයි. tool එකත් පැකේජත් නිකුත් වන්නේ එකම නිකුතුවකිනි |
| `--map <file>` | built-in සහාය නැති vendor එකක් සඳහා අමතර namespace සිතියම්ගත කිරීම් (කිහිප වතාවක් දිය හැකිය) |
| `--dual-build` | C# project එකක් සැබෑ WinForms මතද දිගටම build වන ලෙස තබයි. පහත බලන්න |
| `--strict` | අතින් සමාලෝචනය කළ යුතු ඕනෑම අනතුරු ඇඟවීමක් ඇත්නම් ශුන්‍ය නොවන exit code එකක් දෙයි. **මෙය ඔබේ CI gate එකයි.** |
| `--report <file>` / `--no-report` | Markdown වාර්තාව |

built-in සිතියම්ගත කිරීමක් නැති vendor එකක් සඳහා, `--map` ගොනුව සරල JSON එකක් පමණි:

```json
{
  "namespaces":     { "DevExpress.XtraEditors": "Majorsilence.Forms.DevExpress" },
  "removePackages": [ "DevExpress.Win.*" ]
}
```

### එය සැබවින්ම වෙනස් කරන දේ
{:#module-5-changes}

1. **Project ගොනු.** `UseWindowsForms`/`UseWPF` ඉවත් කරයි; TFM එකේ `-windows` suffix එක ඉවත් කරයි
   (import කළ `.props`/`.targets` ගොනුවලින්ද); Windows desktop framework reference එක ඉවත් කරයි;
   WinForms සඳහා පමණක් වූ NuGet පැකේජ (Telerik, DevExpress, **`System.Drawing.Common`**) ඉවත් කරයි; සහ
   `Majorsilence.Forms` සමඟ backend reference එකක් එක් කරයි. මෙය **එය ස්පර්ශ කරන සෑම project එකකටම**
   සිදු වේ. එම කට්ටලය "WinForms project" වලට වඩා පුළුල්ය: `System.Windows.Forms` කිසි තැනක සඳහන් නොකරන
   සාමාන්‍ය class library එකක් වුවද, එහි රූප හෝ font සම්බන්ධ helper එකක් ඇත්නම් නැවත ලියනු ලබයි. මන්ද
   reference එක නොමැතිව එය compile විය නොහැකි බැවිනි. ඉතිරි වන මූලික type පමණක් භාවිත කරන project
   කිසිසේත් ස්පර්ශ නොකරයි.
2. **මූලාශ්‍ර ගොනු.** දිගම prefix එක මුලින් ගැළපෙන වගුවක් අනුව namespace නැවත ලියයි; අනුපිටපත් import
   එකකට එක් කරයි; අවශ්‍ය තැන්වල `SystemColors`/`ColorTranslator` alias එක එක් කරයි. VB සඳහා අමතරව:
   ව්‍යංග්‍ය constructor එක නැවත ඇතුළු කරයි, `My.Resources` accessor එකක් ජනනය කරයි, සහ ඉතිරි `My.*`
   භාවිත ගැන අනතුරු අඟවයි.
3. **Resx ගොනු.** මාරුවෙන් පසුවද ක්‍රියා කළ යුතු රූප සහ type යොමු සොයා පරීක්ෂා කරයි.
4. **වාර්තාව.** Markdown සාරාංශයක් (පෙරනිමියෙන් `migration-report.md`).

### වාර්තාව කියවීම
{:#module-5-report}

වැදගත් වන්නේ කොටස් තුනකි:

- **පරීක්ෂා කළ සහ වෙනස් කළ** ගොනු ගණන. එක බැල්මෙන් diff එකේ පරාසය දැක ගත හැකිය.
- **ගොනුවෙන් ගොනුව වෙනස් කළ දේ.** සැබවින්ම ස්පර්ශ කළ සියල්ල.
- **අතින් සමාලෝචනය කළ යුතු දේ.** සෑම අනතුරු ඇඟවීමක්ම හේතුව අනුව කාණ්ඩ කර ඇත: සහාය නොදක්වන namespace,
  හුදු `System.Drawing` import එකක් යටතේ සම්පූර්ණ නම නොදක්වා ලියූ GDI+ type, `My.*` භාවිත, සහ මුළුමනින්ම
  මඟ හැරිය project. බහුලවම මඟ හැරෙන්නේ **පැරණි, SDK විලාසයේ නොවන `.csproj`/`.vbproj`** ගොනුවකි. එවැන්නක්
  මුලින් SDK විලාසයට පරිවර්තනය කළ යුතුය. එය project ආකෘතියේ පූර්ව අවශ්‍යතාවකි; migrator එකට මඟ හැරුණු
  දෙයක් නොවේ.

### `--dual-build` මගින් පියවරෙන් පියවර සංක්‍රමණය (C# පමණි)
{:#module-5-dualbuild}

පෙරනිමියෙන් tool එක project එකක් සම්පූර්ණයෙන්ම නව රාමුවට මාරු කරයි. `--dual-build` භාවිත කළ විට,
C# project එකකට එක් MSBuild property එකකින් මාරු කළ හැකි ලෙස stack **දෙකෙන් ඕනෑම එකක්** මත build වීමට
හැකි වේ. එවිට ඔබේ Windows සංවර්ධකයන්ට සෑහීමකට පත් වන තුරු සැබෑ WinForms මතම build කිරීම දිගටම කරගෙන යා
හැකිය. Project ගොනු වෙනත් ආකාරයකින් වෙනස් නොවේ; ගොනුවේ මුල ඇති import එක පමණක් කොන්දේසි සහිත වේ:

```csharp
#if MAJORSILENCE_FORMS
using Majorsilence.Forms;
#else
using System.Windows.Forms;
#endif
```

repo එකේ මුල් ෆෝල්ඩරයේ `Directory.Build.props` ගොනුවකින් build එක මාරු කරන්න:

```xml
<Project>
  <PropertyGroup>
    <MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>
  </PropertyGroup>
</Project>
```

සීමා දෙකක් ඇත. පළමුව, මෙය **හිතාමතාම පටු විසඳුමකි**: ගොනුවක් ඇතුළත *සම්පූර්ණ නමින්* ලියූ ඕනෑම යොමුවක්
(`System.Windows.Forms.MessageBox.Show(...)` වැනි) කොන්දේසි නොමැතිව නැවත ලියනු ලබන අතර, එය compile
වන්නේ එම symbol එක අර්ථ දක්වා ඇති විට පමණි.

දෙවනුව, **VB සඳහා මෙයට සමාන දෙයක් නැත.** මෙම කොටසේ VB නිදසුනක් නොමැත්තේ ඒ නිසාය. `MyType=Empty`
මගින් VB හි මුළු "My" application framework එකම අක්‍රිය වේ: ව්‍යංග්‍ය constructor එක, `My.*`, සියල්ල. එය
preprocessor symbol එකකින් මාරු කළ හැකි දෙයක් නොවේ. `--dual-build` දී ධාවනය කළ VB project එකක්, ඒ ඇයිදැයි
පැහැදිලි කරන අනතුරු ඇඟවීමක් සමඟ, සාමාන්‍ය සම්පූර්ණ ආකාරයෙන්ම පරිවර්තනය කෙරේ. **VB කණ්ඩායම් dual-build
කාල සීමාවක් වෙනුවට එක් වරකින් මාරු වීමක් (cut-over) සැලසුම් කළ යුතුය.** පරිවර්තනය කළ branch එක විශ්වාස
කළ හැකි වන තුරු, සංක්‍රමණයට පෙර branch එක එලෙසම තබා ගන්න.

### අතින් නිවැරදි කළ යුතු දේවල් ලැයිස්තුව
{:#module-5-checklist}

පහත දේවල් rewriter එකට පෙනෙන්නේ නැත. diff එක ලැබුණු පසු මේවා එකින් එක අතින් කරන්න. "compile වුණා" සහ
"නිවැරදිව ක්‍රියා කරනවා" අතර වෙනස මේවායි.

| # | වෙනස | කළ යුතු දේ |
|---|---|---|
| 1 | **`SplitContainer.Orientation` හි අර්ථය වෙනස් විය.** දැන් එය WinForms හි මෙන් *බෙදුම් තීරුවේ* දිශාවයි, පිරිසැලසුමේ දිශාව නොවේ. `Vertical` (පෙරනිමිය) යනු panel දෙක එකිනෙක අසල තිබීමයි. | ඔබ එය කිසි විටෙක සකසා නැත්නම් කිසිවක් වෙනස් නොවේ. **සකසා ඇත්නම්, අගය ප්‍රතිලෝම කරන්න.** මේ ගැන කිසිදු අනතුරු ඇඟවීමක් නොලැබේ: අගයන් දෙකම පෙරත් පසුත් compile වන අතර, පෙළ මත ක්‍රියා කරන pass එකකට `SplitContainer.Orientation` එකක් වෙනත් `Orientation` එකකින් වෙන් කර හඳුනාගත නොහැකිය. grep කර සොයන්න. `Splitter` සඳහාද එසේමය. |
| 2 | **Event delegate type දැන් WinForms හා ගැළපේ.** `KeyDown`/`KeyUp` → `KeyEventHandler`; `Mouse*` පවුල → `MouseEventHandler`; `Form.FormClosing` → `FormClosingEventHandler`; `PrintDocument.PrintPage` → `PrintPageEventHandler`; `Control.MouseEnter` සහ menu/tool-strip item වල `Click` → සරල `EventHandler`. | Lambda, `AddressOf` handler සහ VB `Handles` වගන්ති එලෙසම ක්‍රියා කරයි. C# හි **පැහැදිලිව නිර්මාණය කළ** `new KeyEventHandler<…>` විලාසයේ wrapper (`new EventHandler<KeyEventArgs>(…)` වැනි) තවදුරටත් පරිවර්තනය නොවේ. wrapper එක ඉවත් කරන්න, නැතිනම් WinForms delegate එකේ නම දෙන්න. |
| 3 | **`Click` සහ `MouseEnter` තවදුරටත් mouse ඛණ්ඩාංක රැගෙන එන්නේ නැත.** WinForms හි කිසි විටෙක එසේ නොවූ බැවිනි. | `Click` එකෙන් `e.X`/`e.Button` කියවන handler එකක් `MouseClick` වෙත ගෙන යන්න. menu item එකක නම් (WinForms හිද ඒ සඳහා mouse-typed ප්‍රභේදයක් නැත) පිහිටීම හිමිකාර control එකෙන් ගන්න. C# හි පැරණි `OnMouseEnter(MouseEventArgs)` override කිරීම CS0115 දෝෂයෙන් අසාර්ථක වේ; VB හි අදාළ `Overrides` නව signature එකට එරෙහිව compile නොවේ. දෙකම පැහැදිලිව දෝෂ දෙයි. ඔබට අවශ්‍ය වන්නේද එයයි. |
| 4 | **`TreeViewDrawMode.OwnerDrawContent` හි නම** WinForms හි `OwnerDrawText` ලෙස වෙනස් විය, සහ `OwnerDrawAll` දැන් පවතී. | කිසිවක් කැඩෙන්නේ නැත. පැරණි නම එකම අගය ඇති `[Obsolete]` alias එකකි. නමුත් එය ඉවත් කරනු ලැබේ, එබැවින් දැන්ම නම වෙනස් කරන්න. `OwnerDrawText` මගින් පසුබිම සහ focus ඇඳීමෙන් පසු `DrawNode` මතු කරයි; `OwnerDrawAll` කිසිවක් ඇඳීමට පෙර එය මතු කරයි. |
| 5 | **`DataGridViewDataErrorContexts` හි සාමාජිකයන් දෙදෙනෙක් ඉවත් කරන ලදී** (`RowDirtyStateNeeded`, `CleanupExceptionHandling`). දෙකම WinForms සාමාජිකයන් නොවේ. | එම අගයන්හි දැන් පවතින සැබෑ ඒවා යොදන්න: `RowDeletion`, `ClipboardContent`. |
| 6 | **Strongly-typed resource designer ගොනු.** ජනනය කළ `Resources.Designer.cs`/`.vb` ගොනුවක් `ResourceManager.GetObject(...)` හි ප්‍රතිඵලය drawing type එකකට cast කරයි. සැබෑ `System.Resources.ResourceManager` එකක් ආපසු දෙන්නේ compile කළ `.resources` ගොනුව නම් කරන ඕනෑම දෙයක් වන නිසා, එය compile වුවද පළමු resource එක කියවන මොහොතේ runtime හිදී `InvalidCastException` මතු වේ. | migrator එක මෙය ඔබ වෙනුවෙන් විසඳයි. builder එකේම `GeneratedCodeAttribute` එක ඇති ගොනුවල පමණක්, `ResourceManager` එක `Majorsilence.Forms.ComponentResourceManager` බවට පත් වේ. එය එකම `.resources` ගොනුව කියවන නමුත් graphics entries සාමාන්‍යකරණය කරයි. අතින් ලියූ string lookup සඳහා BCL type එකම පවතී. **resource බහුල form කලින්ම පරීක්ෂා කරන්න.** |
| 7 | **VB `My.*` කොටසක් පමණක් ක්‍රියාත්මක කර ඇත. එය API එක අනුව නොව සාක්ෂි අනුව කළ තේරීමකි.** විශාල සැබෑ VB කේත පදනමක් පිළිබඳ ශක්‍යතා විගණනයකින් හෙළි වූයේ අතින් ලියූ කේතය කොටස් තුනක් පමණක් භාවිත කරන බවයි. ඒ නිසා හරියටම එම තුනම සැබෑය: `My.Application.Info.*` (`Title`, සැබෑ `Version` එකක් ලෙස `Version`, `Copyright`, `CompanyName`, …), `My.Resources.*` (ජනනය කළ accessor module එකක්) සහ `My.Computer.Name`. | අනෙක් සියල්ල නිහඬව නැවත ලියනු වෙනුවට තවමත් අනතුරු අඟවයි: `My.Forms`, `My.Settings`, `My.User`, `My.Application.Log`/`Startup`/`Shutdown`/`UnhandledException`, splash screen, `My.Computer.Registry`/`Clipboard`/`Info`. විගණනයේදී ජනනය කළ `Settings.Designer.vb` boilerplate එකෙන් පිටත මේ කිසිවක අතින් ලියූ භාවිතයක් හමු නොවූ අතර, ඒවායින් කිහිපයකට portable විකල්පයක්ද නැත. පහත port කිරීමේ රටා සහ MIGRATION.md හි "Still not implemented, and why" කොටස බලන්න. තවත් දෙයක්: `ResXFileRef` ලෙස ගබඩා කළ resx entries (inline දත්ත වෙනුවට link කළ ගොනු) compile වන නමුත් runtime හිදී `null` ලෙස ලැබේ. |
| 8 | **ගැළපුම් ඉලක්කයක් නැති Telerik උප-namespace** (`Telerik.WinControls.Themes`, `.Design`, `.Primitives`, `.Layouts`) අනතුරු ඇඟවීමක් සමඟ එලෙසම තබයි. | භාවිතය අනුව තීරණය කරන්න: theming එක අත්හරින්න, නැතිනම් නැවත ක්‍රියාත්මක කරන්න. එසේම `RadScheduler` හි මාසය/සතිය/දිනය **calendar grid UI එක** හිතාමතාම පරාසයෙන් පිටතය (දත්ත ස්තරය, සංචාලනය සහ agenda view සැබෑය). ඒ නිසා grid එක භාවිත කරන කේතය agenda view එක මත නැවත ලිවිය යුතුය. |

**VB `My.*` කොටස port කිරීම.** ක්‍රියාත්මක කර ඇති කොටස් තුන සඳහා කිසිදු වැඩක් අවශ්‍ය නැත:

```vb
' සංක්‍රමණයෙන් පසුවද මේවා දිගටම ක්‍රියා කරයි:
Dim title = My.Application.Info.Title
Dim ver As Version = My.Application.Info.Version      ' සැබෑ Version එකක්, String එකක් නොවේ
logo.Image = My.Resources.CompanyLogo                 ' ජනනය කළ accessor module එක
Dim machine = My.Computer.Name
```

බොහෝ කේත පදනම්වලට මුණගැසෙන්නේ `My.Forms` ය. ව්‍යංග්‍ය singleton එක වෙනුවට පැහැදිලි instance එකක් යොදන්න:

```vb
' පෙර — My.Forms ඔබට සෑම පෝරම වර්ගයකටම කම්මැලි ලෙස (lazily) නිර්මාණය කළ singleton එකක් ලබා දුන්නේය:
My.Forms.CustomerForm.Show()

' පසු — instance එක ඔබ විසින්ම තබා ගන්න (හෝ ඔබේ DI container එකෙන් එය විසඳන්න):
Private customerForm As CustomerForm

Private Sub ShowCustomers()
    If customerForm Is Nothing OrElse customerForm.IsDisposed Then
        customerForm = New CustomerForm()
    End If
    customerForm.Show()
End Sub
```

`My.Settings` වෙනුවට .NET හි අනෙක් තැන්වල ඔබ දැනටමත් භාවිත කරන configuration ක්‍රමයම යොදන්න:
`Microsoft.Extensions.Configuration`, JSON ගොනුවක්, නැතිනම් ඔබේම settings class එකක්:

```vb
' පෙර:  Dim url = My.Settings.ApiBaseUrl
' පසු:
Dim url = AppSettings.Current.ApiBaseUrl
```

### import කිසිසේත් නැවත ලිවිය නොහැකි විට
{:#module-5-compat}

migrator එකට උදව් කළ නොහැකි එක් තත්ත්වයක් ඇත: **පොදු API එක `System.Windows.Forms` type වලින් අර්ථ
දක්වා ඇති, බෙදා හරින control library එකකි.** එය භාවිත කරන්නන් එයට සැබෑ WinForms type ලබා දෙන නිසා, එහි
`using` නැවත ලිවීමෙන් ඔවුන්ගේ කේතය කැඩී යයි. එවැනි අවස්ථාවක් සඳහා proof-of-concept මට්ටමේ source
generator එකක් ඇත:
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/tree/main/src/Majorsilence.Forms.WinFormsShims.Compat).
එය Majorsilence.Forms *මත පදනම් වූ* `System.Windows.Forms` සහ `System.Drawing` namespace ජනනය කරයි.
එවිට සැබෑ WinForms assembly එකක් කිසිසේත් සම්බන්ධ නොකර, Designer ගොනු ඇතුළුව **කිසිදු වෙනසක් නොකළ**
WinForms කේතය රාමුව මත compile වේ.
[`WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo) නිදසුන එය ක්‍රියා
කරන අයුරු පෙන්වන අතර, එහි `RESULTS.md` ගොනුවේ ක්‍රියා කළ දේත් නොකළ දේත් සටහන් කර ඇත. එය ඇගයීමට ගත යුතු
අත්හදා බැලීමක් ලෙස සලකන්න; රඳා පැවතීමට සැලසුමක් ලෙස නොවේ. නිල මාර්ගය migrator එකයි.

**කැඩෙන වෙනස්කම් ලැයිස්තුගත වන තැන.** ඉහත ලැයිස්තුවේ සෑම අයිතමයක්ම පැමිණියේ
[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) හි "Breaking change" සහ "Renamed to match
WinForms" කොටස්වලිනි. අලුත් වෙනසක් මුලින්ම දිස් වන්නේද එහිය. පළමු සංක්‍රමණයේදී පමණක් නොව, සෑම upgrade
එකකදීම එම කොටස් කියවන්න. [Module 10](#module-10-versioning) හි විෂය එම පුරුද්දයි.

**අභ්‍යාසය 5.** සැබෑ අභ්‍යන්තර යෙදුමක් මත migrator එක ධාවනය කරන්න. හැකි නම් මේ කාර්තුවේ කිසිවෙකු රඳා
නොපවතින යෙදුමක් තෝරා ගන්න. මුලින් `--dry-run --diff` සමඟ ධාවනය කරන්න. ඉන්පසු branch එකක සැබෑ ලෙස ධාවනය
කර, build වන තත්ත්වයට ගෙන, ඉහත ලැයිස්තුව අයිතමයෙන් අයිතමය සම්පූර්ණ කරන්න. එක් දිනකට සීමා කරන්න. ඉලක්කය
සම්පූර්ණ port එකක් නොවේ; ඔබේ ඉතිරි යෙදුම් සියල්ලටම ගත වන කාලය ගැන නිවැරදි ඇස්තමේන්තුවක් ලබා ගැනීමයි.

---

## Module 6 — ඉලක්ක වේදිකා තෝරා ගැනීම
{:#module-6}

**අපේක්ෂිත ප්‍රතිඵලය:** සෑම ඉලක්කයකටම නිවැරදි backend පැකේජය තෝරා ගැනීමට ඔබට හැකි වන අතර, එක් එක්
වේදිකාවේ සැබවින්ම නොලැබෙන දේ ප්‍රමාද වී සොයා ගනු වෙනුවට කලින්ම ඔබ දන්නවා ඇත.

ඔබේ ඉලක්ක කට්ටලය යනු පැකේජ තේරීමකි:

| යොමු කරන්න | ඉලක්කය | සටහන් |
|---|---|---|
| `Majorsilence.Forms.Avalonia` | **පෙරනිමිය.** Windows/macOS/Linux desktop. ඊට අමතරව Avalonia හි තමන්ගේම වේදිකා පැකේජ හරහා Browser/WASM (සැම විටම build වේ), Android සහ iOS (අවශ්‍ය නම් සක්‍රිය කළ හැකිය; workload අවශ්‍යයි) | යොමු කළ විට ස්වයංක්‍රීයව තෝරා ගැනේ. window host එක සැබෑ native window එකක් *වන* බහු-වේදිකා backend එක මෙයයි. ඒ නිසා එය සැබෑ වේදිකා handle එකක් ලබා දෙන අතර host යෙදුමකට OS මට්ටමේ modal හැසිරීම දෙයි. WebView ලැබෙන්නේ WebView2/WKWebView/WebKitGTK හරහාය |
| `Majorsilence.Forms.Uno` | Desktop, සහ Uno stack එක හරහා iOS/Android/WebAssembly | `SKXamlCanvas` හරහා පෙන්වයි; Uno app head එකක් අවශ්‍යයි. owner සංකල්පයක් නැත. modal හැසිරීම සඳහා `Form.ShowDialog(parent)` භාවිත කරන්න |
| `Majorsilence.Forms.Gtk4` | මූලිකව Linux සඳහාය. සෑම form එකකටම සැබෑ `Gtk.Window` එකක්. GTK 4 runtime එක ස්ථාපනය කර ඇත්නම් Windows/macOS මතද ක්‍රියා කරයි | පැහැදිලිව තෝරා ගත යුතුය. embedding දිශා දෙකම, **airspace ගැටලුවක් නැති** `NativeControlHost`, WebKitGTK 6.0 හරහා `WebBrowser`. දන්නා සීමා: තිරයේ පිහිටීම පාලනය කළ නොහැකිය (GTK 4 එය ඉවත් කළ නිසා `Location` ඉඟියක් පමණි), `SetIcon(byte[])` කිසිවක් නොකරයි, file picker රාමුවේම dialog වෙත ආපසු යයි, scale factor පූර්ණ සංඛ්‍යා පමණි |
| `Majorsilence.Forms.Terminal` | console එකක්. දුරකථනයක මෙන්, title bar එකක් නොමැතිව form එක මුළු terminal එකම පුරවයි | terminal එකට සහාය ඇත්නම් සැබෑ පික්සල් විභේදනයෙන් Kitty graphics හෝ Sixel, නැතිනම් Unicode block අකුරු; mouse සහ keyboard; Ctrl+C සැම විටම පිටවේ. xterm සහ WezTerm මත තහවුරු කර ඇත. native picker, `NativeControlHost` හෝ webview නැත |
| `Majorsilence.Forms.WinForms` | **Windows පමණි.** Win32 message pump එක මත සැබෑ `System.Windows.Forms` window | *සංක්‍රමණ* backend එකකි ([Module 7](#module-7-c)): WinForms යෙදුමක් තුළ Majorsilence control එක බැගින් කාවද්දන්න. `net48` ද ඉලක්ක කරයි. සැබෑ `HWND`. gestures නැත, webview නැත |
| `Majorsilence.Forms.Wpf` | **Windows පමණි.** `Dispatcher` loop එක මත සැබෑ WPF `Window` එකක් | WinForms backend එකේ හැඩයත් අරමුණත් මෙයටද එසේමය: `ToWpfElement()`, `ToWpfWindow()`. `net48`, `net8.0-windows`, `net10.0-windows` |
| `Majorsilence.Forms.Headless` | පරීක්ෂණ, CI, server, pixel-diff | display එකක් අවශ්‍ය නැත. පරීක්ෂණ සඳහා ඔබේ පිළිතුර මෙයයි ([Module 8](#module-8)). animation clock එක අතින් පාලනය වේ |

තමන්ම ස්ථාපනය වන එකම backend එක Avalonia යි. අනෙක් ඒවාට පේළියක් අවශ්‍යය. එය පළමු form එක නිර්මාණය කිරීමට
පෙර තැබිය යුතුය ([Module 2](#module-2-code) හි සඳහන් කළ පිළිවෙළ සීමාවම):

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

(ඇත්තෙන්ම තෝරා ගත යුත්තේ එකක් පමණි. ඉහත කොටස පෙන්වන්නේ එම පේළියේ සෑම ආකාරයක්මය.) GTK 4 backend
එකට යන්ත්‍රයේ native library ද තිබිය යුතුය: Debian/Ubuntu මත `libgtk-4-1`, Fedora/Arch මත `gtk4`, macOS මත
`brew install gtk4`. `WebBrowser` භාවිත කරන්නේ නම් WebKitGTK 6.0 ද අවශ්‍යයි.

Avalonia මත desktop යනු පරිණත මාර්ගයයි. මින් පහත සියල්ල අලුත් ඉලක්ක වේදිකා ගැනත්, ඒ එක් එක් වේදිකාවේ සැබෑ
තත්ත්වය ගැනත්ය.

### තනි view එකක් පමණක් ඇති වේදිකා: browser, Android, iOS
{:#module-6-singleview}

මේ තුනෙන් කිසිවකට OS window manager එකක් නැත. සෑම එකක්ම යෙදුමකට, tab එකකට හෝ තිරයකට එක embeddable
view එකක් පමණක් ලබා දෙයි. ඒ නිසා ඒවා **සෑම** window එකක්ම canvas එකක් වන පොදු host එකක් බෙදා ගනී: popup
නොවන පළමු window එක viewport එක පුරවයි; අනෙක් සියල්ල (ComboBox dropdown, menu, අමතර top-level form)
එහි නිරපේක්ෂව පිහිටුවන ලද child එකක් වේ.

ආරම්භය host එක විසින් මෙහෙයවන නිසා, සෑම වේදිකාවකටම **factory** එකක් ගන්නා තමන්ගේම entry point එකක් ඇත
(backend එක සූදානම් වන තුරු form එක නිර්මාණය නොවිය යුතුය). ඒ කිසිවක් block නොකරයි:

**C#**

```csharp
// Browser (WASM) — ඔබේ browser head එකේ Program.cs
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());

// Android — ඔබේ Activity එකේ OnCreate වෙතින්
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

' Android — ඔබේ Activity එකේ OnCreate වෙතින්
Majorsilence.Forms.Application.RunAndroid(Function() New MainForm())

' iOS — FinishedLaunching වෙතින්
Majorsilence.Forms.Application.RunIOS(Function() New MainForm())
```

argument එකේ හැඩය සලකන්න: එය instance එකක් නොව **factory** එකකි (`Function() New MainForm()`).
`New MainForm()` කෙලින්ම ලබා දුන්නොත්, backend එක පවතින්නටත් පෙර form එක නිර්මාණය වේ.

**මෙම වේදිකාවල ක්‍රියා නොකරන දේ.** මේවා window manager එකක් නොමැති වීමේ ස්වභාවික ප්‍රතිඵලයි; ඉදිරියට කිරීමට
ඉතිරිව ඇති වැඩ නොවේ:

- **window chrome නැත.** `Title`, `Topmost`, `SetSystemDecorations`, `SetIcon`, min/max size,
  `CanResize`, `ShowInTaskbar` සහ `WindowState` කිසිවක් නොකරයි; `WindowState` සැම විටම `Normal` ලෙස
  කියවේ.
- **dialog OS මට්ටමින් modal නොවේ.** modal window යන සංකල්පයක්ම නැති බැවිනි. dialog එකක් යනු ප්‍රධාන
  view එකේ child එකකි. parent එක අක්‍රිය කිරීම ඇතුළු සෙසු හැසිරීම් එලෙසම ලැබේ. එසේම **block කරන call
  කිසිසේත් ක්‍රියා නොකරයි.** ඊළඟ කොටස බලන්න.
- **WebView නැත.** ඒ නිසා webview එකක් අවශ්‍ය ගැළපුම් control (`RadPdfViewer`, `RadRichTextEditor`)
  ඒවායේ සරල viewer/`RichTextBox` මාර්ගවලට ආපසු යයි.
- **window එක deactivate වීම හරහා popup වැසීම සිදු නොවේ.** යෙදුම *ඇතුළත* වෙනත් තැනක click කිරීම තවමත්
  popup වසයි. හසුරුවා නැත්තේ යෙදුමෙන් සම්පූර්ණයෙන්ම පිටත දෙයකට focus එක යාම පමණි.

### async dialog නීතිය
{:#module-6-async}

මෙම module එකේ ඔබ කේතය *ලියන ආකාරයම* වෙනස් කරන එකම නීතිය මෙයයි. ඒ නිසා එයට වෙනම ශීර්ෂයක් ලැබේ.
browser එකේ .NET ධාවනය වන්නේ පිටුවේ එකම JavaScript thread එක මතය. ආපසු නොඑන call එකක් ඇති විට, එය
ආපසු ඒමට ඉඩ දෙන input, timer සහ ඇඳීම යන සියල්ල නතර වේ. Android සහ iOS මත Avalonia හි dispatcher එකට
nested frame එකක් ධාවනය කළ නොහැකිය. ඒ නිසා මේ වේදිකා තුනේම Avalonia backend එක `CanRunModalLoop = false`
ලෙස වාර්තා කරයි. එවිට block කරන සෑම modal call එකක්ම (`Form.ShowDialog`, `MessageBox.Show`, file picker
වල `ShowDialog`, `TaskDialog.ShowDialog`, `VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show`)
**කිසිවක් පෙන්වීමට පෙර, එහි async අනුවාදයේ නම සඳහන් කරමින** `PlatformNotSupportedException` මතු කරයි.
(Android 15 emulator එකක සහ iPhone 17 Pro simulator එකක මනින ලදී; `docs/backends.md` හි සටහන් කර ඇත.)

async ආකාර desktop ඇතුළු සෑම backend එකකම ක්‍රියා කරයි. ඒ නිසා බෙදාගත් UI library එකක ඒවා එක් වරක්
ලියා සෑම තැනකම භාවිත කළ හැකිය:

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

UI thread එක block කරන අනෙක් සියල්ලටද එකම නීතිය අදාළය: `.Result`, `.Wait()`,
`GetAwaiter().GetResult()` සහ `Thread.Sleep`. ඒවා වෙනුවට task එක `await` කරන්න; `Thread.Sleep` වෙනුවට
`await Task.Delay (n)` භාවිත කරන්න.

**මේවා අතින් සොයා ගැනීමට අවශ්‍ය නැත.** මූලික `Majorsilence.Forms` පැකේජය සමඟම Roslyn analyzer එකක්
ලැබේ. එහි නීති තුනකි: `MFB001` (block කරන modal call එකක්; එහි await කළ හැකි අනුවාදයේ නම දක්වයි),
`MFB002` (task එකක් මත synchronous ලෙස බලා සිටීම) සහ `MFB003` (`Thread.Sleep`). වැඩසටහනේ හැඩය වෙනස්
නොවන තැන්වල (එනම් `async` method එකක් ඇතුළත, හෝ `async` ලෙස සලකුණු කළ හැකි `void` event handler එකක්)
handler එක await කරන ආකාරයට නැවත ලියන code fix ද ඒ සමඟ ඇත. desktop සඳහා පමණක් වූ කේතයේ එය නිහඬය;
`net*-browser` ඉලක්කයක් ඇති විට එය සක්‍රිය වේ. browser head එකක් යොමු කරන **බෙදාගත් UI library** එකක්ද
ආවරණය කිරීමට, එම library එක අසල මෙසේ සක්‍රිය කරන්න:

```ini
# බෙදාගත් UI ව්‍යාපෘතිය අසල .editorconfig (හෝ .globalconfig) ගොනුව
[*.cs]
majorsilence_forms.browser_target = true
```

browser හෝ දුරකථන head එකක් ඉදිරි සැලසුම්වල ඇති ඕනෑම project එකක, පළමු දිනයේම මෙය සක්‍රිය කරන්න. පසුව
handler පරිවර්තනය කිරීමට වඩා එය බොහෝ ලාභදායීය. අවංකව කිව යුතු එක් සීමාවක් ඇත: අද වන විට analyzer එක
browser සඳහා පමණි. ඒ නිසා Android හෝ iOS කේතයෙන් පමණක් ළඟා වන block කරන call එකක් build කරන විට සලකුණු
නොවේ; එය අසාර්ථක වන්නේ runtime හිදී, ඉහත පණිවිඩය සමඟය. (analyzer එකත් එහි diagnostics ත් C# සඳහා පමණක්
වූ Roslyn නීතිය. VB project එකකට runtime exception එක ලැබෙන නමුත් build කරන විට අනතුරු ඇඟවීමක් නොලැබේ.)

### දුරකථන වේදිකාවල ක්‍රියා කරන දේ
{:#module-6-mobile}

Avalonia Android සහ iOS වේදිකා දෙකට දුරකථන යෙදුමකට නැතිවම බැරි දේවල් දැන් ලැබී ඇත. form එකේ දෘෂ්ටිකෝණයෙන්
ඒ සියල්ල ස්වයංක්‍රීයය:

- **තිරයේ keyboard එක** `TextBox` එකකට focus ලැබුණු විට මතු වන අතර focus අහිමි වූ විට සැඟවේ. keyboard එක
  විවෘත වන විට field එක ඊට ඉහළට scroll වේ. `TextBoxBase.InputKind` (`Number`, `Email`, `Url`, `Phone`)
  මගින් keyboard පිරිසැලසුම තෝරයි. එය කියවන්නේ focus ලැබෙන මොහොතේ නිසා, ඊට පෙර සකසන්න. desktop එය
  නොසලකා හරියි.
- **Safe-area inset** (status bar, notch, home indicator) `Form.SafeAreaPadding` හරහා form එකේ client
  පිරිසැලසුමට යොදනු ලැබේ. ඒ නිසා dock සහ anchor කළ control කිසිදු කේතයක් නොමැතිව ඒවායින් ඈත්ව පවතී.
- **Android back බොත්තම** `WindowBase.BackRequested` මතු කරයි (අවලංගු කළ හැකි event එකකි; විවෘත popup
  හෝ sheet එකකට එය මුලින් ලැබේ). template එකෙන් ජනනය වන `MainActivity` එය දැනටමත් ඉදිරියට යවයි.
- **`Form.SizeClass`** (logical px 600 ට අඩු නම් `Compact`, `Medium`, 840 සිට `Expanded`) සහ
  `SizeClassChanged` මගින් එකම form එකකට දුරකථන පිරිසැලසුමක් සහ tablet පිරිසැලසුමක් අතර මාරු විය හැකිය.
- `Application.Suspended`/`Resumed`, haptics, තිරය නොනිවී තබා ගැනීම, in-process audio.

ඊට අමතරව දුරකථන හැඩයේ තිර සඳහාම ගොඩනැඟූ control හතරක් ඇත. සියල්ල මූලික පැකේජයේම ඇති අතර desktop මතද
භාවිත කළ හැකිය: **`StackPanel`** (Majorsilence දිගුවකි; සෑම child එකක්ම තීරුවේ පළලට දිගු කරන අතර පළල් window
එකක තීරුව කියවීමට පහසු පළලකට සීමා කරයි), **`Card`** (තේමාවෙන් වර්ණ ගන්නා, වටකුරු දාර සහ border එකක් ඇති
`Panel` එකක්), **`RichListBox`** (පේළි template කළ බහු-පේළි අයිතම වන `ListBox` එකක්) සහ
**`NavigationHost`** (title bar එකක් සහ `BackRequested` ට ගරු කරන back බොත්තමක් ඇති page stack එකක්).
`docs/mobile-layout.md` නිර්දේශ කරන හැඩයේ settings තිරයක් (මෙම මාර්ගෝපදේශය සඳහා ධාවනය නොකර, එම ලේඛනය
සමඟ සසඳා පරීක්ෂා කරන ලදී):

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

(`TextInputKind` ඇත්තේ `Majorsilence.Forms.Backends` හිය.) මෙම රෙසිපියේ ඉතිරි සියල්ල ඔබ දන්නා WinForms
මය: `AutoSize` label wrap වේ; `FlowLayoutPanel`/`TableLayoutPanel` card එකක් ඇතුළට යයි.

**පරිණතභාවය වේදිකාවෙන් වේදිකාවට බෙහෙවින් වෙනස්ය. මෙය පාදක සටහනක නොව ඔබේ සැලසුම් කිරීමේදීම සලකා බැලිය
යුතුය.** වේදිකා තුනම CI හි compile වේ. **browser** සම්පූර්ණ ගැලරියම ධාවනය කරන නමුත් තවම අලුත්ය. **Android**
සැබෑ උපාංගයක මූලික පරීක්ෂාවකට ලක් කර ඇත: ගැලරිය ආරම්භ වේ, tap කළ විට නිවැරදි control එකට ළඟා වේ, render
scaling නිවැරදිය, සහ touch scroll හා flick hardware මත ක්‍රියා කරයි. නමුත් ඉහත සඳහන් keyboard, safe-area සහ
rotation හැසිරීම් Headless මත unit test කර ඇති අතර තවම උපාංගයක අත්හදා බලා නැත. **iOS** compile වන අතර CI
මගින් smoke check එකක් ලෙස සැබෑ head එක simulator එකක ආරම්භ කරයි. නමුත් simulator එකක හෝ උපාංගයක එය
අන්තර්ක්‍රියාකාරීව තවම කිසිවෙකු ධාවනය කර නැත. mobile ඔබේ ඉදිරි සැලසුම්වල ඇත්නම්, එය හුදෙක් tick කරන
කොටුවක් ලෙස නොව සැබෑ අවදානමක් ඇති spike එකක් ලෙස සලකන්න. මාස කිහිපයකට පෙර තිබූ තත්ත්වයට වඩා එය බොහෝ
කුඩා spike එකකි, නමුත් තවමත් spike එකකි.

ඔබට අවශ්‍ය වන workload, එක් වරක් බැගින්:

```
dotnet workload install wasm-tools   # browser — publish කිරීමට අවශ්‍යයි, build කිරීමට නොවේ
dotnet workload install android
dotnet workload install ios          # macOS පමණි; Linux/Windows මාර්ගයක් නැත
```

browser සම්බන්ධයෙන් සිහි තබා ගත යුතු දෙයක්: `dotnet run` මගින් WebAssembly project එකක් serve නොකරයි. එය
`dotnet publish` කර, ලැබෙන `wwwroot` output එක ඕනෑම static file server එකකින් serve කරන්න.

browser port එකකට වහාම මුණගැසෙන එක් හිඩැසක් ඇත: **සාපේක්ෂ මාර්ගයකින් load කරන ගොනු එහි නැත.** සැබෑ
ගොනු පද්ධතියක් නොමැති නිසා, desktop මත ක්‍රියා කරන රූප load කිරීම එහිදී නිහඬව හිස් icon දෙයි
([Module 0](#module-0) හි සඳහන් කළ 1×1 placeholder හැසිරීමමය). ඒ වෙනුවට රූප embedded resource ලෙස
යොදා assembly එක හරහා කියවන්න:

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

**browser එකේ ප්‍රවේශ්‍යතාව (accessibility) නොමිලේම ලැබේ. ඒ ඔබ control වලට නම් දී ඇත්නම්ය.** screen reader
එකකට, browser එකේ find-in-page එකට සහ DOM මත පදනම් වූ ඕනෑම test tool එකකට canvas එකක් හුදු හිස් තැනකි.
ඒ නිසා browser වේදිකාවේ Avalonia backend එක canvas එක අසලින් විවෘත form වල **DOM mirror** එකක් පවත්වා ගනී.
එනම් සෑම control එකකටම ARIA role එක, නම, තත්ත්වය සහ සීමා රැගත්, විනිවිද පෙනෙන, click හරහා යන element එකක්.
එය ගොඩනැඟෙන්නේ ඔබේ පරීක්ෂණ කියවන automation tree එකෙන්මය ([Module 8](#module-8-tree)). ඇඳීමකින් පසු
වැඩිම වශයෙන් සෑම 100 ms කට වරක් එය නැවත sync වේ. test එකකට සොයාගත හැකි ඕනෑම දෙයක් screen reader එකකටද
සොයාගත හැකිය. Module 8 හි "අන්තර්ක්‍රියාකාරී සෑම control එකකටම `Name` එකක්" යන නීතිය ඔබේ code review
ලැයිස්තුවට අයත් විය යුතු තවත් හේතුවක් එයයි.

### දැනට පවතින Avalonia, Uno, WinForms, WPF හෝ GTK 4 යෙදුමක් තුළ කාවැද්දීම
{:#module-6-embedding}

ඔබ දැනටමත් එම toolkit පහෙන් එකක් මත යෙදුමක් නිකුත් කරන්නේ නම්, Majorsilence.Forms එයට එකතු කිරීමක් ලෙස
හඳුන්වා දිය හැකිය. එනම් එහි control සහ window එම toolkit එකේ native object මෙන් භාවිත කරන අතරම, සාමාන්‍ය
`Form.Show()` ප්‍රවාහය වෙනස් නොකරය. රටාව සෑම තැනකම එකම ය (`MajorsilenceFormsPresenter` එකක් සහ extension
method දෙකක්); වෙනස් වන්නේ host type එක පමණි. මෙහි පෙන්වන්නේ Avalonia සහ Uno යි. Windows යුගල
[Module 7](#module-7-c) හි ඇත; GTK 4 සඳහා `ToGtkWidget()` / `ToGtkWindow()` යි:

**C#**

```csharp
// Majorsilence control එකක්, native control එකක් ලෙස host කර ඇත
Avalonia.Controls.Control          hostControl = myMfControl.ToAvaloniaControl ();
Microsoft.UI.Xaml.FrameworkElement unoControl  = myMfControl.ToUnoControl ();

// Majorsilence Form එකක backend කවුළුව, host එකට ආපසු භාර දී ඇත
Avalonia.Controls.Window window = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window unoWin = myForm.ToUnoWindow ();

window.Show ();                    // මෙතැන් සිට එය පෙන්වීම host එකේ වගකීමයි
```

**VB.NET**

```vb
' Majorsilence control එකක්, native control එකක් ලෙස host කර ඇත
Dim hostControl As Avalonia.Controls.Control = myMfControl.ToAvaloniaControl()
Dim unoControl As Microsoft.UI.Xaml.FrameworkElement = myMfControl.ToUnoControl()

' Majorsilence Form එකක backend කවුළුව, host එකට ආපසු භාර දී ඇත
Dim window As Avalonia.Controls.Window = myForm.ToAvaloniaWindow()
Dim unoWin As Microsoft.UI.Xaml.Window = myForm.ToUnoWindow()

window.Show()                      ' මෙතැන් සිට එය පෙන්වීම host එකේ වගකීමයි
```

**owner/modal සම්බන්ධතා backend එකෙන් backend එකට වෙනස්ය:** `ToAvaloniaWindow()`, `ToWinFormsForm()` සහ
`ToGtkWindow()` යන සෑම එකක්ම සැබෑ OS මට්ටමේ modal සම්බන්ධතාවක් දෙයි. මෙම backend එකේ Uno ට owner
සංකල්පයක් නැති නිසා, `ToUnoWindow()` ආපසු දෙන්නේ ස්වාධීන top-level window එකකි. Uno යටතේ
`Form.ShowDialog(parent)` භාවිත කරන්න. එය රාමුවේම modal loop එක වන අතර native window ownership මත
රඳා නොපවතී.

### ඔබේම title bar එකක් අඳින්නේ නම්
{:#module-6-chrome}

custom chrome ගොඩනඟන ඕනෑම අයෙකුට මෙය එක් slide එකක් වටී. Avalonia backend එකේ window එක ඇදගෙන යාම සහ
ප්‍රමාණය වෙනස් කිරීම සිදු වන්නේ අන්තර්ක්‍රියාකාරී begin-drag call හරහාය. Uno හි එය කළ නොහැකිය (WinUI හි
programmatic begin-drag එකක් නැත). ඒ නිසා එහි move/resize ප්‍රකාශන ආකාරයෙන් සිදු වේ: form එක තම title-bar
තීරුව caption region එකක් ලෙස ප්‍රකාශ කරන අතර host එක එය WinUI වෙත යවයි. එය Windows desktop API එකක් නිසා,
Win32 head එකේ OS title-bar drag ක්‍රියා කරයි. macOS native decorations භාවිත කරන අතර drag/resize OS එකට
අයත්ය. **X11 head එකේ title-bar drag නොලැබේ.** එහි OS window drag අවශ්‍ය නම් system decorations
භාවිත කරන්න.

**අභ්‍යාසය 6.** [Module 2](#module-2) හි `GreetForm` එක ගෙන, පැකේජ යොමුව වෙනස් කරමින් backend දෙකක් මත
ධාවනය කරන්න. Avalonia නොවන backend එකකට backend එක තෝරන එක් පේළියද වෙනස් කරන්න (Linux මත GTK 4; ඕනෑම
තැනක Terminal. host සීමාව *දැනෙන* වේගවත්ම ක්‍රමය එයයි). ඉන්පසු එය WebAssembly වෙත publish කර browser එකක
විවෘත කරන්න. `OkButton_Click` හි `MessageBox.Show` එක එහිදී exception එකක් මතු කරයි. එම handler එක
`ShowAsync` වෙත පරිවර්තනය කිරීම යනු එක් වෙනසකින් මුළු async dialog නීතියමයි. ඔබ දකින සෑම හැසිරීම්
වෙනසක්ම ලියා තබා, ඒ සෑම එකක්ම ඉහත ලැයිස්තු සමඟ සසඳන්න. ඒවායේ නැති ඕනෑම දෙයක් වාර්තා කිරීමට වටී.

---

## Module 7 — Windows මත පියවරෙන් පියවර හඳුන්වා දීම
{:#module-7}

**අපේක්ෂිත ප්‍රතිඵලය:** Majorsilence.Forms සහ සැබෑ WinForms එකම process එකක් තුළ එකට ධාවනය කරන්නට
ඔබට හැකි වේ. එය දෙපැත්තටම කළ හැකිය. සම්පූර්ණ form එකක් වශයෙන් හෝ තනි control එකක් වශයෙන් කළ හැකිය.
එසේම, එය ස්ථාවරව තබා ගන්නා නීති තුන ඔබ දනී.

මේ සඳහා Windows මත පමණක් ක්‍රියා කරන මෙවලම් දෙකක් තිබේ. ඒ දෙක ක්‍රියා කරන්නේ වෙනස් මට්ටම් දෙකකය:

| | `Majorsilence.Forms.WindowsFormsInterop` (දිශා A සහ B) | `Majorsilence.Forms.WinForms` backend එක (දිශාව C) |
|---|---|---|
| ක්‍රියා කරන මට්ටම | සම්පූර්ණ form සහ dialog | තනි control (සහ form) |
| Majorsilence ධාවනය වන්නේ | Avalonia backend එක මත, Win32 message pump එක WinForms සමඟ බෙදා ගනිමින් | සැබෑ WinForms කවුළු තුළ. Avalonia කිසිසේත් සම්බන්ධ නොවේ |
| වඩාත් ගැළපෙන්නේ | Majorsilence යෙදුමකින් පැරණි WinForms form විවෘත කිරීමට, සහ ඊට ප්‍රතිවිරුද්ධ දිශාවට | WinForms UI එකක් තුළට Majorsilence control කාවැද්දීමට; තම අභ්‍යන්තරය මුලින්ම port කරන control library එකකට; .NET Framework 4.8 යෙදුම්වලට |

මේ දෙක එකට පැවතිය හැකිය. දිශාව C හි presenter එක, දැනටමත් වින්‍යාස කර ඇති backend එකක් වෙනස් නොකරයි.

`Majorsilence.Forms.WindowsFormsInterop` යනු **Windows මත පමණක්** ක්‍රියා කරන පාලමකි. Windows නොවන
වේදිකාවක එම assembly එක හිස් placeholder එකක් පමණි. ඒ නිසා බහු-වේදිකා build කැඩෙන්නේ නැත. නමුත් එහි සෑම
ක්‍රමයක්ම කැඳවූ විට `PlatformNotSupportedException` එකක් විසි කරයි.

**මෙය ක්‍රියා කරන්නේ කෙසේද:** Windows මත Avalonia backend එක තමන්ගේම message loop එකක් පවත්වන්නේ නැත.
ඒ වෙනුවට එය තම කවුළු OS එකේ message pump එක සමඟ ලියාපදිංචි කරයි. `System.Windows.Forms` ද භාවිත කරන්නේ
එම pump එකමය. එබැවින් කුමන `Application.Run` එක කැඳවූවත්, toolkit දෙකම එය බෙදා ගනී. එක් loop එකක්
දෙකටම සේවය කරයි.

### දිශාව A — පැරණි WinForms form එකක් විවෘත කරන Majorsilence.Forms යෙදුමක්
{:#module-7-a}

යෙදුම සංක්‍රමණය කර අවසන් වුවත්, dialog කිහිපයක් තවමත් පැරණි WinForms මත ඉතිරිව ඇති අවස්ථාවට මෙය ගැළපේ.

**C#**

```csharp
using Majorsilence.Forms.Interop;

// Modeless — වහාම return වේ
WindowsFormsInterop.Show (new LegacySettingsForm (), owner: this);

// Modal — WinForms dialog එක වැසෙන තුරු block කරයි
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

' Modal — WinForms dialog එක වැසෙන තුරු block කරයි
Dim result = WindowsFormsInterop.ShowDialog(New LegacyWizardForm(), owner:=Me)
If result = System.Windows.Forms.DialogResult.OK Then
    ' …
End If

' Factory overload — පෙන්වන අවස්ථාවේදී UI thread එක මත පෝරමය සාදයි
WindowsFormsInterop.Show(Function() New LegacySettingsForm())
```

WinForms dialog එක Majorsilence form එකට සැබවින්ම අයත් වී, එයට modal වී ක්‍රියා කරන්නට නම්, යෙදුම
ආරම්භයේදී handle resolver එක **එක් වරක්** සම්බන්ධ කළ යුතුය. එය නොකරන තාක්, WinForms form එක owner
එකක් නොමැතිව පෙන්වනු ලැබේ:

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

කිසිදු බැඳීමකට පෙර රාමුව අත්හදා බැලීමට ඇති අඩුම අවදානම් සහිත ක්‍රමය මෙයයි. ඔබ දැනටමත් නිකුත් කරන
යෙදුම තුළම, *අලුත්* තිර Majorsilence.Forms මත ගොඩනඟන්න.

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

Majorsilence form එක තුළ `Close()` කැඳවීමට පෙර `DialogResult` එක සකසන්න. එසේ නොකළහොත් ආපසු ලැබෙන්නේ
`DialogResult.None` පමණි. එහි තේරුම "පැහැදිලි ප්‍රතිඵලයක් නොමැතිව වැසුණා" යන්නයි. උදාහරණයක් ලෙස,
title bar එකේ ✕ බොත්තමෙන් වැසූ විට එසේ වේ:

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

### දිශාව C — WinForms (හෝ WPF) backend එක මත, වරකට එක් control එකක් බැගින්
{:#module-7-c}

දිශා A සහ B මගින් ගෙන යන්නේ සම්පූර්ණ තිරය. නමුත් සමහර විට ඔබට එකවර ගෙන යා හැක්කේ *එක් control එකක්*
පමණි. එනම් ඔබේම grid එකක්, chart එකක්, හෝ කාර්යබහුල form එකක එක් panel එකක් පමණි. එවැනි අවස්ථාවක
ඒ වෙනුවට `Majorsilence.Forms.WinForms` පැකේජය යොමු කරන්න. එය සම්පූර්ණ වේදිකා backend එකකි
([module 6](#module-6)). එහි කවුළු යනු සාම්ප්‍රදායික Win32 pump එක මත ධාවනය වන සැබෑ
`System.Windows.Forms` form වේ. Skia මගින් ඇඳි අන්තර්ගතය පෙන්වන්නේ GDI පාදක control එකක් හරහාය.
WinForms container එකකට දැමූ Majorsilence control එකක් සාමාන්‍ය `System.Windows.Forms.Control`
එකක් බවට පත් වේ. පළමු presenter එක සෑදෙන විට backend එක තනිවම ස්ථාපනය වන අතර, යෙදුමේ දැනට පවතින
`Application.Run` එකම සියල්ල හසුරුවයි. (මෙය පැකේජයේ README එක සහ `samples/EmbeddingWinForms`
සමඟ සසඳා පරීක්ෂා කරන ලදී; මෙම මාර්ගෝපදේශය සඳහා ධාවනය කර නැත.)

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

සැලසුම් කිරීමේදී මෙම මාර්ගයේ කරුණු තුනක් වැදගත් වේ:

- **එය `net48` ඉලක්ක කරයි.** මූලික පැකේජයේ `netstandard2.0` build එක සමඟ එක් වූ විට, **.NET Framework 4.8**
  යෙදුමකට පවා නවීන .NET වෙත මාරු නොවී Majorsilence control host කළ හැකිය. මෙය බොහෝ සංක්‍රමණ සැලසුම්වල
  පිළිවෙළ වෙනස් කරයි. UI එක port කිරීම සහ runtime එක යාවත්කාලීන කිරීම තවදුරටත් එකම ව්‍යාපෘතියක් විය යුතු නැත.
- **එය දෙපැත්තටම ක්‍රියා කරයි.** `NativeControlHost` ([module 9](#module-9-route-a)) මගින් කාවැද්දූ
  Majorsilence scene එක තුළ *සැබෑ* WinForms control එකක් host කළ හැකිය. backend එක `PlatformHandle` හරහා
  සැබෑ `HWND` එකක් ලබා දෙයි. කාවැද්දූ අන්තර්ගතය විවෘත කරන popup (dropdown, menu වැනි) සැබෑ, border රහිත OS
  කවුළු වේ.
- **අවසාන control එකත් port කළ පසු පැකේජය මාරු කරන්න.** `Majorsilence.Forms.Avalonia` වෙත මාරු වූ විට එම
  කේතයම බහු-වේදිකා වේ. backend මායිමට ඉහළින් ඇති කිසිවක් වෙනස් නොවේ.

මෙහි නොමැති දේ: gesture සහාය (WinForms හි gesture API එකක් නැත; ස්පර්ශය mouse ලෙස පැමිණේ) සහ webview එකක්
(WebView මත රඳා පවතින compatibility control, Headless මත මෙන්ම fallback වේ). `Majorsilence.Forms.Wpf`
යනු WPF shell එකක් සඳහා වූ එම අදහසමය. එහි `ToWpfElement()` සහ `ToWpfWindow()` ඇත,
`net48`/`net8.0-windows`/`net10.0-windows` ඉලක්ක කරයි, සහ `Platform.Backend = new WpfPlatformBackend ()`
මගින් තෝරා ගනී.

**කොටස් දෙකම එක යෙදුමක් සේ පෙන්වීම.** toolkit දෙකක් මිශ්‍ර කළ යෙදුමක් හඳුනා ගත හැකි වන්නේ එකම තිරයක
පෙනුම් විලාස දෙකක් තිබීමෙනි. `Majorsilence.Forms.Theming.WinForms` පැකේජය *එකම* CSS තේමාව
([උපග්‍රන්ථය D](#appendix-d)) සැබෑ `System.Windows.Forms` control වලටද යොදයි. WinForms ඉඩ දෙන තරමට එය
යොදන අතර, යෙදිය නොහැකි සෑම දෙයක්ම නිශ්ශබ්දව මඟ හරිනු වෙනුවට diagnostic එකක් ලෙස වාර්තා කරයි:

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

(`WinFormsCssTheme.Watch (path)` මගින් ගොනුව save කරන සෑම විටම තේමාව නැවත යොදයි. Windows මත පමණක්
ක්‍රියා කරන `ThemeStudio.WinForms` නිදසුන ක්‍රියා කරන්නේ එලෙසය.)

### නීති තුන
{:#module-7-rules}

1. **එක් process එකකට එක් `Application.Run` එකක් පමණි.** `Majorsilence.Forms.Application.Run` සහ
   `System.Windows.Forms.Application.Run` දෙකම කිසිවිටෙක කැඳවන්න එපා. host එකක් තෝරා ගන්න. අනෙක් දිශාව සඳහා
   පාලම භාවිත කරන්න.
2. **UI (STA) thread එක මත පමණි.** මෙය හරියටම WinForms මෙන්මය. background thread එකක සිට UI එක වෙනස්
   කිරීමට නම්, නැවත UI thread එකට මාරු වන්න:

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

3. **Win32 parenting දෙපැත්තට සමාන නොවේ.** MF → WF දිශාවේ parenting ඉහත handle resolver එක හරහා ක්‍රියා කරයි.
   නමුත් WF → MF දිශාවේදී MF කවුළුව දැනට OS මට්ටමින් owner එකක් නොමැතිව පවතී.

**අභ්‍යාසය 7.** දැනට පවතින WinForms යෙදුමක තාවකාලික පිටපතක් ගන්න. දිශාව B හරහා Majorsilence.Forms මත
ගොඩනැඟූ අලුත් තිරයක් එයට එක් කරන්න. owner handle එකද සම්බන්ධ කරන්න. ඉන්පසු එම යෙදුමේම, දිශාව C හරහා
දැනට පවතින එක් control එකක් Majorsilence control එකකින් ප්‍රතිස්ථාපනය කරන්න. මේ දෙකම එකට ගත් විට,
තීරණ ගන්නා අයගේ සැකය දුරු කරන demo එක ලැබේ. මන්ද, ඔබ දැනටමත් නිකුත් කරන කිසිවක් එයින් වෙනස් නොවේ.

---

## Module 8 — ඔබේ යෙදුම පරීක්ෂා කිරීම
{:#module-8}

**අපේක්ෂිත ප්‍රතිඵලය:** ඔබේ කණ්ඩායම display එකක් නොමැති CI පරිසරයක ධාවනය වන UI පරීක්ෂණ ලියයි. ඒවා
කැඩී නොයන locator භාවිත කරයි. එසේම, කිසිදු අමතර වෙහෙසකින් තොරව ලැබෙන accessibility පහසුකම් මොනවාදැයි
කණ්ඩායම දනී.

> මෙම module එක දළ හැඳින්වීමක් පමණි. [**Automation සහ UI පරීක්ෂණ**]({{ '/si/automation/' | relative_url }})
> පිටුව ප්‍රායෝගිකව වැඩ කරන්නා සඳහා වූ සම්පූර්ණ අනුවාදයයි. එහි page object රටාව, wait helper එකක්
> (implicit wait නැත), සැබෑ Selenium වෙතින් යෙදුම මෙහෙයවීම, Windows මත FlaUI/WinAppDriver, golden-image
> regression පරීක්ෂණ, GitHub Actions, Azure DevOps සහ Jenkins සඳහා CI වට්ටෝරු, සහ AI agent එකම
> අතුරුමුහුණතට සම්බන්ධ වන ආකාරය ඇතුළත් වේ.

### එක් automation tree එකක්, එය භාවිත කරන පාර්ශ්ව තුනක්
{:#module-8-tree}

රාමුව backend එකෙන් ස්වාධීන **automation tree** එකක් ඉදිරිපත් කරයි. එය ඔබේ ජීවමාන control ධුරාවලියේ
ඡායාරූපයකි. එහි සෑම control එකකම id, name, role, value, තත්ත්වය සහ මායිම් අඩංගු වේ.

| භාවිත කරන්නා | පැකේජය | ලබා දෙන දේ |
|---|---|---|
| In-process UI පරීක්ෂණ | `Majorsilence.Forms.Automation` (මූලික පැකේජයේම ඇත) | පික්සල ගණනය කිරීම් නොමැතිව C#/VB වෙතින් form එකක් මෙහෙයවීම |
| දුරස්ථ automation | `Majorsilence.Forms.WebDriver` | ඕනෑම Selenium client එකකින් මෙහෙයවිය හැකි W3C WebDriver server එකක් |
| Screen reader සහ magnifier | `Majorsilence.Forms.WindowsUIAutomation` | Windows මත Narrator / NVDA / JAWS සහාය |

මෙම tree එක කියවන්නේ renderer භාවිත කරන තාර්කික මායිම් සහ තත්ත්වයමය. ඒ නිසා headless backend එක මත සහ
සැබෑ backend එක මත එය එක හා සමානව හැසිරේ. **Headless මත ලියූ පරීක්ෂණයක් විස්තර කරන්නේ Avalonia මත
පරිශීලකයා දකින දෙයමය.**

### Control සොයා ගත හැකි කරන්න: පළමු දිනයේම අනුගමනය කළ යුතු කණ්ඩායම් සම්මුතියක්
{:#module-8-findable}

Locator ක්‍රියා කරන්නේ ඔබ දැනටමත් සකසන property දෙකක් මතය:

- `Control.Name` → element එකේ **AutomationId** එක බවට පත් වේ. මෙය ස්ථාවර locator එකයි. සැම විටම මෙයට
  මුල් තැන දෙන්න.
- `Control.AccessibleName` → element එකේ **Name** එක බවට පත් වේ. එය නොමැති නම් `Text`, එයත් නොමැති නම්
  `Name` භාවිත වේ.

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

ඔබ `Control.AccessibleRole` සකසා නොමැති නම්, role එක control වර්ගයෙන් අනුමාන කෙරේ (`button`, `textbox`,
`checkbox`, `radio`, `combobox`, `list`, `label`, `tablist`, `window`, …). "අන්තර්ක්‍රියාකාරී සෑම control
එකකටම `Name` එකක් තිබිය යුතුය" යන්න code review නීතියක් කර ගන්න. එකම යතුරු එබීමෙන් පරීක්ෂණ locator
*සහ* screen reader සහාය යන දෙකම ලැබේ. Windows මත එය UI Automation හරහාද, browser එක තුළ
[ARIA DOM mirror](#module-6-singleview) එක හරහාද ක්‍රියාත්මක වේ.

### ඔබම paint කරන control: ඔබේම value එක සහ තත්ත්වය ප්‍රකාශ කරන්න
{:#module-8-stateprovider}

රාමුවේ සාදා ඇති control තම value එක වාර්තා කරන්නේ කෙසේදැයි දනී. `TextBox` එකක් තම පෙළද, `CheckBox` එකක්
`"true"` යන්නද වාර්තා කරයි. නමුත් ඔබම paint කරන control එකකට ([module 4](#module-4-paint)) අනුමාන කිරීමට
කිසිවක් නැත. ඒ නිසා එය tree එකේ පෙනෙන්නේ හිස් value එකක් සහ වර්ගයේ නමින් අනුමාන කළ role එකක් සමඟය.
Role එක සහ name එක `AccessibleRole` සහ `AccessibleName` මගින් නිවැරදි කළ හැකිය. Value එක සහ වෙනත් අමතර
තත්ත්ව සඳහා `IAutomationStateProvider` ක්‍රියාත්මක කරන්න. එවිට tree එක අනුමාන කරනු වෙනුවට ඔබ වාර්තා
කරන දේ භාවිත කරයි. එසේම සෑම තත්ත්ව යතුරක්ම `state-{key}` attribute එකක් බවට පත් වන නිසා, ඒ එකින් එක
වෙන වෙනම query කළ හැකිය. (මෙය `docs/automation.md` වෙතිනි; මෙම මාර්ගෝපදේශය සඳහා ධාවනය කර නැත.)

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

එයටම `Name`, `AccessibleName` සහ `AccessibleRole` ද සකසන්න. එවිට `GetPageSource()` හි එම element එක
කරුණු හතරම රැගෙන පෙනී සිටී. WebDriver හරහා `getAttribute("state-level")` කැඳවූ විටද ලැබෙන්නේ එම අගයමය.
තත්ත්ව යතුරු සඳහා අකුරු, ඉලක්කම්, `-` සහ `_` පමණක් භාවිත කරන්න. දැන ගත යුතු එක් නීතියක් ඇත:
`AutomationValue` රාමුවේ අනුමානය සමඟ මිශ්‍ර නොවී, එය සම්පූර්ණයෙන්ම *ප්‍රතිස්ථාපනය* කරයි. ඒ නිසා checkbox
එකක් මෙන් හැසිරෙන ඔබේම control එකක් `"true"`/`"false"` අගය තමන්ම වාර්තා කළ යුතුය.

### CI සඳහා පිළිතුර Headless backend එකයි
{:#module-8-headless}

`Majorsilence.Forms.Headless` පැකේජයට display එකක් අවශ්‍ය නැත. සම්පූර්ණ test assembly එක සඳහා එය එක්
වරක් ස්ථාපනය කරන්න. එවිට සෑම පරීක්ෂණයකටම එය ලැබේ.

**C# — module initializer එකක් වඩාත්ම පිළිවෙළ ක්‍රමයයි**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Headless;

internal static class TestBootstrap
{
    [ModuleInitializer]
    internal static void Init () => HeadlessRenderer.Use ();
}
```

**VB.NET — VB හි module initializer නැත, ඒ නිසා ඔබේ test framework එකේ assembly hook එක භාවිත කරන්න**

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

මෙය ශෛලියේ වෙනසක් නොව, භාෂා දෙක අතර සැබෑ වෙනසකි. C# රටාව එලෙසම VB වෙත පිටපත් කළහොත්, ඔබේ පරීක්ෂණ
කිසිදු backend එකක් නොමැතිව ධාවනය වී, තේරුම් ගැනීමට අපහසු ආකාරයෙන් අසමත් වේ.

"සැබෑ backend එක එයයි" කියා UI පරීක්ෂණ Avalonia backend එක මත ධාවනය කිරීමට පෙළඹෙන්න එපා. Avalonia හි
dispatcher එක එක් thread එකකට බැඳී ඇති නිසා, test runner එකේ worker thread සමඟ එය ගැටේ. Headless backend
එක පවතින්නේම ඔබේ පරීක්ෂණ කට්ටලයට display එකක් හෝ UI thread එකක් අවශ්‍ය නොවන ලෙස සැකසීමටය. රාමුවේම
පරීක්ෂණ කට්ටලය ධාවනය වන්නේ එය මතය. `HeadlessRenderer.Use ()` කැඳවීම, `HeadlessPlatformBackend` එක
ඔබම පැවරීමට සමානය.

### සම්පූර්ණ UI පරීක්ෂණයක්
{:#module-8-inprocess}

`By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` මගින් element සොයා ගනී. `Find`,
`FindOrThrow` සහ `FindAll` සෑම විටම **අලුත් snapshot එකක්** මත query කරයි. ක්‍රියා (`Click`, `SendKeys`,
`PressKey`, `Clear`) යන්නේ සැබෑ backend එකක් භාවිත කරන එම මධ්‍යස්ථ input මාර්ගය හරහාමය. ඒ නිසා ඒවා සැබෑ
routing, focus සහ layout පරීක්ෂා කරයි. පරීක්ෂණ සඳහා පමණක් වූ කෙටි මඟක් නොවේ.

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

`By.XPath` ක්‍රියා කරන්නේ tree එකේ XML ස්වරූපය මතය. එය `session.GetPageSource()` ලබා දෙන හැඩයමය.
ස්ථාවර id එකක් නොමැති විට මෙය ප්‍රයෝජනවත් වේ:

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

**HiDPI මත පරීක්ෂා කිරීම.** `MF_HEADLESS_SCALE=2` සැකසූ විට headless backend එක scale කළ display එකක්
ඇති බව වාර්තා කරයි. scale කළ monitor එකක් නොමැතිව 2× මට්ටමින් layout පරීක්ෂා කරන්නේ එලෙසය. රාමුවේම
පරීක්ෂණ කට්ටලය එම scale එකේදී සමත් වන අතර CI එය gate එකක් ලෙස පරීක්ෂා කරයි. ඒ නිසා මෙය කැඩී ඇති බව
දන්නා කොනක් නොව, සහාය දක්වන දෙයකි.

එහෙත් එම අසමත් වීම් නිවැරදි කළ ආකාරයෙන් පාඩමක් ඉගෙන ගන්න. ඔබේ කේතයේද හමු වන්නේ එම උගුලමය. ඒවායින්
බොහොමයක් **එකම පැටලීමක්** නිසා ඇති විය: එනම් logical ඒකක සහ device ඒකක අතර වෙනසයි. 2026-10-01 සිට
`Control` එකකින් ඔබ කියවන සියල්ල logical ඒකකවලින් ලැබේ. `Bounds`, `ClientRectangle`, `ClientSize`,
`MouseEventArgs` සහ paint canvas එක ඒ අතර වේ ([module 4](#module-4-paint)). එයින් උගුලේ බරපතලම
කොටස ඉවත් විය. නමුත් *තවමත්* device පික්සලවලින් ලැබෙන දේද ඇත: ග්‍රහණය කළ bitmap (scale 2 හිදී
`HeadlessRenderer.CapturePng` එක දෙපැත්තෙන්ම දෙගුණයක් විශාලය), ඔබ නමින්ම ඉල්ලා සිටින `Scaled*`
කුලකය, සහ owner-draw event වල `Bounds`. scale 1 හිදී මේ දෙක සමාන නිසා, ඒවා මිශ්‍ර කළ බව scale කළ
display එකක් හමු වන තුරු නොපෙනේ. එබැවින්, **ජ්‍යාමිතිය scale 1 පික්සලවලින් නොව, සමානුපාතිකව
තහවුරු කරන්න.** ග්‍රහණය කළ bitmap එකක් rectangle එකක් සමඟ සංසන්දනය කරන විට, ඒ දෙක කුමන ඒකක
පරාසයේදැයි පරීක්ෂා කරන්න. තවමත් `ScaleTransform (e.Scaling, …)` කැඳවන ඔබේම control එකක්, අද මෙම gate එක
අසමත් වීමට ඇති වඩාත් සුලබ හේතුවයි.

### Selenium මගින් දුරස්ථ automation
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

WebDriver යනු හුදෙක් HTTP සහ JSON පමණක් නිසා, ඕනෑම භාෂාවක ඕනෑම client එකක් ක්‍රියා කරයි:

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

සහාය දක්වන දේ: session සෑදීම සහ ඉවත් කිරීම, element සෙවීම (එකක් හෝ කිහිපයක්), click, send keys, clear,
get text, get name (role), get attribute, get rect, get enabled, **page source** (XML), screenshot (PNG),
සහ `GET /status`. Locator: `id`, `name`, `tag name` (role), `xpath`, `css selector` (`#id` සහ
`[name='…']`), ඊට අමතරව `role`, `type`, `link text` යන අභිරුචි ඒවා. Element යොමු සෑම භාවිතයකදීම අලුත්
snapshot එකක් මත නැවත සොයා ගනී. ඒ සඳහා ස්ථාවර AutomationId එකට මුල් තැන දෙයි. ඒ නිසා වෙනස් කිරීම්වලින්
පසුවත් අගයන් යාවත්කාලීනව පවතී.

**Locator පටිගත කිරීම.** Server එක XML page source එකක් ලබා දෙන අතර, xpath උපාය ක්‍රියා කරන්නේ හරියටම
එම source එක මතය. ඒ නිසා Appium ආකාරයේ ඕනෑම inspector එකකට screenshot එකක් මත ජීවමාන tree එක පෙන්වා,
node මත click කිරීමෙන් locator ග්‍රහණය කර ගැනීමට ඉඩ දිය හැකිය. එය `127.0.0.1` වෙත, ඔබේ port එකට, `/`
path එකට, සාමාන්‍ය http හරහා යොමු කරන්න. Capabilities නොසලකා හරිනු ලැබේ. Locator තෝරා ගන්නා පිළිවෙළ:
**`id`** → **`xpath`** → `name`/`role`/`type`. සීමා කිහිපයක් ඇත. මෙය W3C WebDriver server එකක් මිස
සම්පූර්ණ Appium server එකක් නොවේ (Appium වලට පමණක් අයත් endpoint 404 ලබා දෙයි; ඒ නිසා සාමාන්‍ය WebDriver
client එකක් වඩාත් විශ්වාසදායක inspector එකයි). Screenshot එක වෙනස් DPI එකකින් ගත්තොත් overlay එක
විස්ථාපනය විය හැකිය. වරකට එක් කවුළුවක් පමණි. සැඟවුණු control tree එකට ඇතුළත් නොවේ.

**Headless** පරීක්ෂණයක message loop එකක් නැත. ඒ නිසා HTTP ඇමතුම් worker thread එකක ධාවනය වන අතරතුර,
ඔබම queue එක pump කරන්න:

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

**Playwright මෙම desktop යෙදුමට නොගැළපේ.** එය automate කරන්නේ DOM එකක් හරහා browser engine ය. මෙහි
DOM එකක් නැත. (Browser head එකේ [ARIA mirror](#module-6-singleview) එක DOM එකක් වුවත්, එය accessibility
සඳහා වූ අතුරුමුහුණතක් මිස automation API එකක් නොවේ. යෙදුම මෙහෙයවන්න WebDriver හරහාය.) මේ ප්‍රශ්නයට
sprint එකක් වැය කරන්න එපා.

### AI agent එකකට යෙදුම මෙහෙයවීමට ඉඩ දීම
{:#module-8-mcp}

AI සහායකයෙකු භාවිත කරන්නේද එම WebDriver endpoint එකමය. `Majorsilence.Forms.Mcp` යනු dotnet global tool
එකක් ලෙස නිකුත් කරන MCP server එකකි. එය සහායකයා සමඟ stdio හරහා MCP භාෂාවෙන් කතා කරන අතර, ඔබේ යෙදුමේ
`WebDriverServer` එක සමඟ loopback හරහා HTTP භාෂාවෙන් කතා කරයි. එය `ui_snapshot`, `ui_find`, `ui_read`,
`ui_click`, `ui_type`, `ui_wait_for` සහ `ui_screenshot` යන මෙවලම් ඉදිරිපත් කරයි. සෑම මෙවලමක්ම ගන්නේ
element handle එකක් නොව locator එකකි. ඒ නිසා සෙවීමක් සහ ක්‍රියාවක් අතර කිසිවක් පරණ නොවේ.

```
dotnet tool install -g Majorsilence.Forms.Mcp
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444     # හෝ ඕනෑම MCP client එකක config එකේ එම විධානයම
```

ඉගෙන ගන්නා අතරතුර අත්හදා බැලීමට ඉලක්කයක්: `samples/AutomationTarget` යනු හරියටම මේ සඳහාම සාදන ලද කුඩා
යෙදුමකි. `dotnet run --project samples/AutomationTarget -- --webdriver 4444` විධානය endpoint එක ආරම්භ
කර, එය මෙහෙයවීමට අවශ්‍ය විධාන මුද්‍රණය කරයි. එහි සෑම control එකක්ම client එකකට හැසිරවීමට සිදු වන එක්
කරුණක් බැගින් පරීක්ෂා කරයි: සදහටම අක්‍රිය බොත්තමක් (බොරු සාර්ථකත්වයක් වෙනුවට ප්‍රතික්ෂේපයක් දැකීමට),
checkbox එකක් සලකුණු කළ පසු පමණක් සක්‍රිය වන Submit බොත්තමක් (`ui_wait_for` ඇත්තේ ඒ සඳහාය), හිතාමතාම
නමක් නොදුන් එක් control එකක්, සහ සෑම ක්‍රියාවක්ම පෙන්වන දෘශ්‍ය log එකක්. එම log එකෙන්, client එක කළ බව
*කියන* දේ සහ යෙදුම සැබවින්ම දුටු දේ සංසන්දනය කළ හැකිය. මෙම automation අතුරුමුහුණතට සත්‍යාපනයක් නැත.
ඒ නිසා එය development සහ test build වල පමණක් විවෘත කරන්න.

### Windows මත accessibility
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

> **ඉහත කේතය Windows නොවන වේදිකාවක compile නොවේ.** මෙය න්‍යායක් නොව, තහවුරු කරගත් කරුණකි. Windows නොවන
> වේදිකාවක මෙම පැකේජය නිකුත් වන්නේ හිස් stub එකක් ලෙසය. ඒ නිසා `Majorsilence.Forms.WindowsUIAutomation`
> namespace එක නොපවතින අතර, runtime එකේදී `PlatformNotSupportedException` එකක් වෙනුවට compile කරන විටම
> CS0234 දෝෂය ලැබේ. බහු-වේදිකා යෙදුමක නම් multi-target කර (`net10.0;net10.0-windows`) එම කැඳවීම
> `#if WINDOWS` තුළ තබන්න. නැතහොත් එය Windows සඳහා පමණක් වූ වෙනම project එකක තබා, desktop head එකෙන්
> කොන්දේසි සහිතව reference කරන්න.

සෑම control එකක්ම UIA element එකක් බවට පත් වේ. එයට **Name**, **AutomationId** (`Control.Name`),
**ControlType**, **IsEnabled**, **HasKeyboardFocus** සහ තිරය මත **BoundingRectangle** එකක් ඇත. `Invoke`
(බොත්තම් සඳහා) සම්පූර්ණයෙන් ක්‍රියාත්මකය. `Value` සහ `Toggle` කියවීම සඳහා පමණක් ලබා දේ. Focus එක වෙනස්
වන විට UIA focus-changed event නිකුත් වේ. Screen reader එකක් අලුත් control එක කියවන්නේද, magnifier එකක්
එය අනුගමනය කරන්නේද ඒ නිසාය.

මෙම පළමු අනුවාදයේ නොමැති දේ: යතුරක් එබෙන සෑම විටම නිකුත් වන `TextBox` value event (screen reader තමන්ගේම
typed-character echo එකට යොමු වේ; focus වූ විට field එක තවමත් කියවනු ලැබේ), structure-changed event, සහ
control එකක් තුළ ඇති අයිතම (තනි tab, list පේළි). එම tree එකම මත ගොඩනඟන Linux (AT-SPI) සහ macOS
(NSAccessibility) පාලම් roadmap එකේ ඇති අයිතමයන්ය. ඒ නිසා එම වේදිකාවල accessibility වගකීමක් ඔබට ඇත්නම්,
නිකුත් කරන අවස්ථාවේදී නොව, දැන්ම එය මතු කරන්න.

**අභ්‍යාසය 8.** ඉහත `GreetFormTests` එක ඔබේ කණ්ඩායමේ භාෂාවෙන් ලියන්න. Display එකක් නොමැතිව CI හි එය
සමත් කරවා ගන්න. ඉන්පසු golden-image assertion එකක් එක් කරන්න. ඔබේ කේත පදනමේ සෑම UI පරීක්ෂණයක්ම
අනුගමනය කළ යුතු ආකෘතිය එම පරීක්ෂණයයි.

---

## Module 9 — Native අන්තර්ගතය සහ වීඩියෝ
{:#module-9}

**අපේක්ෂිත ප්‍රතිඵලය:** කණ්ඩායමේ කිසිවෙකු කවුළු handle එකක් ව්‍යාජ ලෙස සාදන්නේ නැත. වීඩියෝ, සිතියම් සහ බ්‍රවුසර අන්තර්ගතය, තිරයේ සෙසු දේ සමඟ නිවැරදිව එකට විදැහෙන (composite වන) ආකාරයට host කරයි.

බැලූ බැල්මට වෙනස් ප්‍රශ්න දෙකක් ඇත. "control එකක් ඇතුළට native අන්තර්ගතයක් දමන්නේ කෙසේද?" යන්න එකකි. "control එකකට `HWND` එකක් ලබා ගන්නේ කෙසේද?" යන්න අනෙකයි. ඇත්තටම මේ දෙකම එකම ප්‍රශ්නයයි. දෙවැන්නට පිළිතුර නම්, **එය කළ නොහැකි බවත්, ව්‍යාජ එකක් සාදා නොගත යුතු බවත්ය.**

| සාමාජිකය (member) | අගය | හේතුව |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | එක් එක් control එකට වෙන වෙනම OS කවුළුවක් නැත. `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle` සඳහාද මෙය එසේමය. |
| `WindowBase.Handle` | අර්ථයක් නොදක්වන, ශුන්‍ය නොවන token එකක් | **මෙය `HWND` එකක් නොවේ.** WinForms කේතයේ, `Invoke` කිරීමට පෙර handle එක සාදා ගැනීම සඳහා `.Handle` කියවීම සාමාන්‍ය පුරුද්දකි. ශුන්‍යය ආපසු දුනහොත් එම පුරුද්ද බිඳී යයි. මෙය පවතින්නේ ඒ නිසාය. අර්ථවත් වන්නේ managed කේතය තුළ පමණි. |
| `WindowBase.PlatformHandle` | සැබෑ native handle එක, නැතහොත් ශුන්‍යය | මෙය සැබෑ එකයි. Avalonia backend එකේදී `HWND`/`NSWindow`/`XID` එකක් ද, WinForms backend එකේදී සැබෑ `HWND` එකක් ද ලැබේ. Uno සහ Headless මත ශුන්‍යයයි. |

**ව්‍යාජ handle ගැන නීතිය මෙයයි:** සාදාගත් handle එකක් ආරක්ෂිත වන්නේ, එය ඔබේ පාලනයේ ඇති managed කේතය තුළ පමණක් ගමන් කරන තාක් කල් පමණි. Native කේතයට ඇතුළු වූ මොහොතේම එය අනතුරුදායක වේ. LibVLC හි `libvlc_media_player_set_hwnd`, mpv හි `--wid`, GStreamer හි `GstVideoOverlay.set_window_handle` යන සියල්ල එම අගය OS එකට (`SetParent`, `CreateWindowEx`, `SetWindowPos`) යවයි. ගොතන ලද අගයක් OS එක ඉවසන්නේ නැත.

### මාර්ගය A — `NativeControlHost`
{:#module-9-route-a}

රාමුව නිල වශයෙන් සහාය දක්වන ක්‍රමය මෙයයි. ඔබේ control එක සෘජුකෝණාස්‍රයක් වෙන් කර ගනී. backend එක එම ඉඩ, Skia surface එකට ඉහළින් තබන සැබෑ toolkit element එකකින් පුරවයි. එම element එක placeholder එකේ සීමාවන්, clip එක සහ දෘශ්‍යතාව සමඟ ගැළපෙන සේ නිරන්තරයෙන් තබා ගැනේ. මෙය Avalonia, Uno, GTK 4 සහ WinForms backend මත ලැබේ. Headless සහ Terminal මත නැත.

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

// null සැකසීමෙන් host කළ මූලද්‍රව්‍යය නැවත ඉවත් වේ.
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

' Nothing සැකසීමෙන් host කළ මූලද්‍රව්‍යය නැවත ඉවත් වේ.
host.NativeControl = Nothing
```

![Majorsilence form එකක් තුළ host කළ native Avalonia බොත්තමක්]({{ '/assets/img/example-native.png' | relative_url }})

*එම කේතය ධාවනය වන අයුරු. Avalonia `Button` එක සැබවින්ම එහි ඇත. එය host වී ඇත්තේ Skia surface එකට ඉහළිනි. නමුත් බොත්තමක පෙනුම (chrome) කිසිවක් නැතිව, හුදු පෙළක් ලෙස එය විදැහෙන බව සලකන්න. host කළ native control එකකට හැඩය ලැබෙන්නේ **host යෙදුමේ** Avalonia styles වලිනි. backend එක ආරම්භ කරන්නේ කිසිදු තේමාවක් නැති, අවම Avalonia යෙදුමකි. එනම්, host කිරීමේ ක්‍රමය ක්‍රියා කරයි; හැඩගැන්වීම සැපයීම ඔබේ වගකීමකි. සිතියමක් හෝ වීඩියෝ දසුනක් වැනි, තමන්ම අඳින surface එකක් නොව සැබෑ native UI එකක් host කිරීමට ඔබ අදහස් කරන්නේ නම්, ඒ සඳහා කාලය වෙන් කර ගන්න.*

දැනගත යුතු කරුණු තුනක් ඇත. පළමුවැන්න **airspace සීමාවයි.** Overlay එක යනු ඔබ ඇඳි අන්තර්ගතයට *ඉහළින්* ඇති native element එකකි. ඒ නිසා රාමුව අඳින කිසිවක් එයට උඩින් පෙන්විය නොහැක. (GTK 4 මෙයට ව්‍යතිරේකයකි. එය සෑම widget එකක්ම එක් render tree එකකට එකතු කරන නිසා, එහි airspace ගැටලුවක් නැත.) දෙවැන්න, **Majorsilence.Forms වෙතින් හැඩගැන්වීම උරුම නොවේ.** ඉහත තිර රූපය බලන්න. තුන්වැන්න, **වැරදි වර්ගයක් පැවරුවහොත් එය නිහඬවම අසාර්ථක වේ.** `NativeControl` හි වර්ගය `Object` ය. සෑම backend එකක්ම එහි වර්ගය පරීක්ෂා කර, නොගැළපේ නම් කිසිවක් නොකර ආපසු යයි. Exception එකක් නැත, log එකක් නැත, තිරයේ කිසිවක් නැත. Uno backend එකට Avalonia `Control` එකක් දුන්නොත් සිදු වන්නේ හරියටම එයයි. GTK 4 වෙත WinForms control එකක් දුන්නත් එසේමය. ඔබේ native අන්තර්ගතය නොපෙනේ නම්, මුලින්ම වර්ගය පරීක්ෂා කරන්න: Avalonia සඳහා Avalonia `Control`, Uno සඳහා `UIElement`, WinForms backend සඳහා `System.Windows.Forms.Control`, GTK 4 සඳහා `Gtk.Widget`.

### මාර්ගය B — frame callbacks හරහා වීඩියෝ (නිර්දේශිත ක්‍රමය)
{:#module-9-route-b}

Native surface එකක් host කරනවා වෙනුවට, player එකෙන් decode කළ frames ලබාගෙන ඔබම ඒවා Skia මත අඳින්න. එවිට ඔබ අඳින සෙසු සියල්ල සමඟ එය නිවැරදිව එකට විදැහේ. Airspace ගැටලුව සහ handle ගැටලුව යන දෙකම සම්පූර්ණයෙන්ම මඟ හැරේ. එහි හැඩය මෙසේය:

**C#**

```csharp
public class VideoSurface : Control
{
    private SKBitmap? frame;

    // ඔබේ player එකේ frame callback එකෙන් කැඳවේ, එය භාවිත කරන ඕනෑම thread එකක.
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

    ' ඔබේ player එකේ frame callback එකෙන් කැඳවේ, එය භාවිත කරන ඕනෑම thread එකක.
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

![decode කළ frame එකක් විදහන frame-callback වීඩියෝ surface එක]({{ '/assets/img/example-video.png' | relative_url }})

*එම කේතයම, decoder එකක් වෙනුවට කෘත්‍රිමව සාදාගත් frame එකක් සමඟ. Bitmap එක control එකේ Skia canvas එකට කෙලින්ම අඳින නිසා, ඔබ අඳින සෙසු සියල්ල සමඟ එය එකට විදැහේ. Airspace ගැටලුවක් නැත, handle එකක් අවශ්‍ය නැත. Headless ඇතුළු සෑම backend එකකම එය එක ලෙසම ක්‍රියා කරයි. Unit test කළ යුත්තේද එලෙසය.*

සම්පූර්ණ සංසන්දනය සහ දැනට දන්නා හිඩැස් [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) හි ඇත.

**අභ්‍යාසය 9.** ඔබේ කේත පදනමේ ඇති සෑම `.Handle` භාවිතයක්ම සොයා, එක් එක් භාවිතය වර්ග තුනකට බෙදන්න: handle එක සාදා ගැනීම සඳහා (කමක් නැත, එලෙසම තබන්න), managed කේතයට යැවීම (කමක් නැත), native කේතයට යැවීම (අනිවාර්යයෙන් වෙනස් කළ යුතුය). විනාඩි පහක grep එකකින්, සැබවින්ම ව්‍යාකූල කරවන දෝෂ වර්ගයක් මුළුමනින්ම වළක්වා ගත හැකිය.

---

## Module 10 — නිකුත් කිරීම: CI, අනුවාද පාලනය සහ යාවත්කාලීනව සිටීම
{:#module-10}

**අපේක්ෂිත ප්‍රතිඵලය:** මෙම රාමුවෙන් සැබවින්ම ඇති විය හැකි regressions ඔබේ pipeline එක අල්ලා ගනී. එසේම, හිඩැසකට මුහුණ දුන් විට කළ යුත්තේ කුමක්දැයි ඔබ දනී.

### ඔබේ pipeline එකට gates යොදන්න
{:#module-10-ci}

| Gate එක | විධානය | අල්ලා ගන්නේ |
|---|---|---|
| පිරිසිදු build එකක් | `dotnet build --configuration Release` | ගොඩගැසීමට පෙර warnings |
| පරීක්ෂණ | `dotnet test --configuration Release --no-build` | [Module 8](#module-8) හි සියල්ල. Display එකක් අවශ්‍ය නැත |
| සංක්‍රමණයේ අපගමනය (drift) | `majorsilence-migrate <sln> --dry-run --strict` | ඔබ තවමත් සංක්‍රමණය අවසන් කරමින් සිටියදී, map නොකළ නව යොමුවක් branch එකකට පැමිණි මොහොතේම එය |
| HiDPI | පරිමාණයට සංවේදී පරීක්ෂණවලට `MF_HEADLESS_SCALE=2` | පරිමාණය 1 හිදී පමණක් ක්‍රියා කරන layout එකක්. එසේම තවමත් තමන්ගේම canvas එක පරිමාණය කරන custom control එකක් ([Module 4](#module-4-paint)) |
| බ්‍රවුසර කේතයේ block කරන ඇමතුම් | `MFB001`–`MFB003` analyzer එක. හවුල් UI library එකේ `.editorconfig` හි `majorsilence_forms.browser_target = true` යොදා, එම project එකේ warnings දෝෂ ලෙස සලකන්න | පිටුව throw කරවන හෝ හිර කරවන `ShowDialog`/`MessageBox.Show`/`.Result`/`Thread.Sleep` ඇමතුමක් ([Module 6](#module-6-async)) |
| බ්‍රවුසරයේ boot වීම | ඔබේ wasm head එක `dotnet publish` කර, headless-Chromium smoke test එකක් ධාවනය කිරීම | wasm pipeline එක බිඳ වැටීම |

ඔබ බ්‍රවුසරය ඉලක්ක කරන්නේ නම්, අවසාන gate එක එලෙසම පිටපත් කර ගැනීම වටී. හේතුව මෙයයි: **wasm ඉලක්කයක් build වීම, එය ක්‍රියා කරන බවට සාක්ෂියක් නොවේ.** wasm-tools pipeline එක (emcc/wasm-opt native link එක) ධාවනය කරන්නේ `dotnet publish` විසිනි. Bundle එක සැබවින්ම හරි බව ඔප්පු වන්නේ බ්‍රවුසරයක සැබෑ boot එකකින් පමණි. සාර්ථක `dotnet build` එකක් ඒ ගැන කිසිවක් නොකියයි. රාමුවේම CI එක මෙය කරන්නේ මෙසේය. Gallery head එක තේරුම් ගන්නා `?check=<name>` query string එකක් ඇත. කුඩා Node script එකක් (`samples/Gallery.Wasm/tools/modal-check.mjs`) publish කළ bundle එක headless Chrome තුළ boot කර, නම් කළ එක් එක් check එක ධාවනය කර, ප්‍රතිඵලය අපේක්ෂිත වගුවක් සමඟ සසඳයි. async-dialog නීතිය ඔප්පු කළේද මෙම modal checks මගිනි. මේ හැඩය ඔබේ යෙදුමටද ගන්න. ඔබේම head එකට `?check=` switch එකක් එක් කිරීමට ගත වන්නේ එක් සවස් වරුවකි. එයින් "publish වුණා" යන්න "ධාවනය වුණා" බවට පත් වේ.

### අනුවාද කළමනාකරණයේ විනය
{:#module-10-versioning}

- **ඔබේ package අනුවාදය ස්ථිරව සඳහන් කරන්න (pin කරන්න).** මෙය තවමත් බීටා මෘදුකාංගයකි. API එක ස්ථාවර වෙමින් පවතී. අනුවාදය pin කරන්න, දැනුවත්ව යාවත්කාලීන කරන්න, release notes කියවන්න. [Module 5 හි පිරික්සුම් ලැයිස්තුවේ](#module-5-checklist) ලේඛනගත කර ඇති බිඳෙන වෙනස්කම් (breaking changes) වර්ගයේ දේ අනුවාද අතර පැමිණිය හැකිය.
- **Core, backend සහ migrator යන තුනේම අනුවාද එක සමානව තබා ගන්න.** මෙවලම සහ packages එකම release එකෙන් නිකුත් වන නිසා, migrator හි `--package-version` හි පෙරනිමි අගය එහිම අනුවාදයයි.
- **අනුවාදය එක තැනකට ගන්න.** එවිට යාවත්කාලීනයක් යනු එක් සංස්කරණයක් පමණි. `Directory.Packages.props` තුළ:

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

  `Majorsilence.Forms.Mvvm`, `.Theming.WinForms`, `.Animation` හෝ දෙවන backend එකක් භාවිතයට ගන්නා විට, ඒවාද එම ලැයිස්තුවටම එක් කරන්න. මෙම පවුලේ සෑම package එකක්ම එකම release එකෙන්, එකම අනුවාදයෙන් නිකුත් වේ.

- **යාවත්කාලීන කිරීම branch එකක කරන්න. ඔබේ golden-image පරීක්ෂණ සාර්ථක වූ පසුව පමණක් එය අනෙක් අයට ලබා දෙන්න.** Rendering වෙනස්කම් හඳුනා ගැනීම සඳහාම එම පරීක්ෂණ තිබෙන්නේ.

### හිඩැසකට මුහුණ දුන් විට
{:#module-10-gaps}

හිඩැස් හමු වනු නිසැකය. දැනගත යුතු වැදගත් කරුණ මෙයයි: මෙම රාමුවේ හිඩැස් කිහිපයක්ම සොයා ගැනුණේ API එක කියවීමෙන් නොව, *සැබෑ යෙදුම් සංක්‍රමණය කිරීමෙන්* පමණි. WinForms ක්‍රීඩාවක්, ribbon control library එකක් ඒ අතර විය. ඔබේ කණ්ඩායම සැබෑ යෙදුමක් port කරන අතරතුර නිහඬ no-op එකකට මුහුණ දුන්නොත්, එම සොයා ගැනීම ඔබේ ව්‍යාපෘතියෙන් ඔබ්බටද වටී.

- **No-op වීම වෙනුවට throw කරන සාමාජිකයෙක්** [stub ප්‍රතිපත්තියට](#module-3-stub-policy) පටහැනිය. එය දෝෂයක් ලෙස වාර්තා කරන්න.
- **ඔබේ දවසක්ම නාස්ති කළ නිහඬ no-op එකක්** ද issue එකක් විය යුතුය. එහිදී සාමාජිකයාගේ නම පමණක් නොව *රෝග ලක්ෂණයද* ලියන්න ("`X` කිසිවක් නොකළ නිසා sprites සුදු කොටුවක් සමඟ ඇඳුණි"). ඊළඟ කණ්ඩායමට එය සොයා ගත හැකි වන්නේ රෝග ලක්ෂණයෙනි. ඔබ ලියූ [pinning test](#module-3-pin) එකද අමුණන්න. එය ධාවනයට සූදානම් reproduction එකකි.
- **අවහිර වී සිටින අතර බලා සිටීමට නොහැකිද?** ව්‍යාපෘතිය pull requests පිළිගනී. AI සහාය ඇතිව හෝ නැතිව කමක් නැත. කොන්දේසි සරලය: `dotnet build --configuration Release` සහ `dotnet test` පිරිසිදුව සමත් විය යුතුය. නව හැසිරීම compile වන බව පමණක් නොව, එය *ක්‍රියා කරන* බව ඔප්පු කරන පරීක්ෂණවලින් ආවරණය විය යුතුය. [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) ද එය විස්තර කරන කේතය සමඟම යාවත්කාලීන විය යුතුය. ඔබව අවහිර කරන හිඩැස වසා දැමීම, බොහෝ විට එය මඟ හැර සැලසුම් කිරීමට වඩා බෙහෙවින් කුඩා වැඩකි.

**අභ්‍යාසය 10.** ඉහත gates ඔබේ repository එකට එක් කරන්න. ඉන්පසු [Module 3](#module-3) හි අභ්‍යාසයෙන් හමු වූ හිඩැස් අතුරින්, ඔබේ යෙදුමට සැබවින්ම අවශ්‍ය එකක් තෝරන්න. කණ්ඩායමක් ලෙස තීරණය කරන්න: එය මඟ හැර සැලසුම් කරනවාද, නැතහොත් upstream හි එය වසා දමනවාද. තීරණය සහ හේතුව ලියා තබන්න.

---

## උපග්‍රන්ථය A — රෝග ලක්ෂණය අනුව දෝෂ සෙවීම
{:#appendix-a}

| රෝග ලක්ෂණය | බොහෝ විට හේතුව | විසඳුම |
|---|---|---|
| යෙදුම ආරම්භ නොවේ / කවුළුවක් නොපෙනේ | Backend package එකක් යොමු කර නැත. Core package එකට තනිව තිරයේ කවුළුවක් පෙන්විය නොහැක | `Majorsilence.Forms.Avalonia` (හෝ Uno/Headless) එක් කරන්න |
| සංක්‍රමණයෙන් පසු `Bitmap`/`Font`/`Pen` සඳහා ambiguous-reference දෝෂ | Majorsilence ආදේශක සමඟම `System.Drawing.Common` තවමත් යොමු වී ඇත | එම package යොමුව ඉවත් කරන්න (migrator එක ස්පර්ශ කරන සෑම project එකකම මෙය ස්වයංක්‍රීයව කරයි) |
| `SystemColors` / `ColorTranslator` සඳහා CS0104 (C#) / ambiguity (VB) | දෙකම `System.Drawing.Primitives` හි ඇත. ඒ නිසා තබා ගත් `System.Drawing` import එක හරහා ඒවා තවමත් resolve වේ | Alias එකක් එක් කරන්න: `using SystemColors = Majorsilence.Forms.SystemColors;` / `Imports SystemColors = Majorsilence.Forms.SystemColors` |
| WinForms ගැන කිසිදා සඳහන් නොකළ class library එකක් compile නොවේ | එහි තිබූ image/font helper එකක් `Majorsilence.Forms.Drawing.*` වෙත නැවත ලියවී ඇත | `Majorsilence.Forms` යොමුව එක් කරන්න. "නැවත ලිවීමට හසු වන projects" යන්න "WinForms projects" යන්නට වඩා පුළුල්ය |
| Designer එකේ event සම්බන්ධ කිරීම් compile නොවේ (`new EventHandler<KeyEventArgs>(…)`) | Event delegate වර්ග දැන් WinForms හා ගැළපේ | Wrapper එක ඉවත් කරන්න, නැතහොත් WinForms delegate එක නමින්ම ලියන්න (`KeyEventHandler`, `MouseEventHandler`, …) |
| `Click` handler එකක `e.X` / `e.Button` නැත | WinForms හිද `Click` යනු `EventArgs` event එකකි | `MouseClick` වෙත මාරු වන්න. Menu item එකක නම්, ස්ථානය එයට අයිති control එකෙන් ගන්න |
| VB: `Anchor`/`DockStyle` flags සඳහා `Or` ද `|` ද | VB හි flags එකතු කරන්නේ `Or` මගිනි | `AnchorStyles.Top Or AnchorStyles.Left` |
| VB: පරීක්ෂණ ධාවනය වන්නේ backend එකක් නැතිවය | VB හි module initializer නැත. C# හි `<ModuleInitializer>` රටාව එහි නිහඬව කිසිවක් නොකරයි | Backend එක `<AssemblyInitialize>` / `<SetUpFixture>` තුළින් install කරන්න. [Module 8](#module-8-headless) බලන්න |
| Split layout එකක දිශාව මාරු වී ඇත | `SplitContainer.Orientation` දැන් අදහස් කරන්නේ *බෙදුම් තීරුවේ* දිශාවයි | ඔබ සකසන අගය අනෙක් පැත්තට හරවන්න (අගයන් දෙකම compile වන නිසා කිසිදු අනතුරු ඇඟවීමක් නැත) |
| පළමු resource එක කියවන විට `InvalidCastException` | Generate කළ resource designer එකක් `System.Resources.ResourceManager` ප්‍රතිඵලයක් cast කරයි | `Majorsilence.Forms.ComponentResourceManager` භාවිත කරන්න (migrator එක generate කළ designers ස්වයංක්‍රීයව නැවත ලියයි) |
| Runtime හිදී resource එකක් `null` ලෙස ලැබේ | resx entry එක `ResXFileRef` එකකි (inline දත්ත නොව, link කළ ගොනුවකි) | Resource එක inline කරන්න, නැතහොත් ඔබම එය load කරන්න |
| සෑම icon එකක්ම නොපෙනේ, log එකේද කිසිවක් නැත | සාපේක්ෂ asset path එකක් වැරදි **working directory** එකකට සාපේක්ෂව resolve වී ඇත. නැති ගොනුව throw කරනවා වෙනුවට 1×1 placeholder එකක් බවට පත් විය | Assets `AppContext.BaseDirectory` ට සාපේක්ෂව resolve කරන්න. [Module 0](#module-0) බලන්න |
| Icons නැත්තේ බ්‍රවුසර build එකේ පමණි | එහි සැබෑ ගොනු පද්ධතියක් නැත. ඒ නිසා සාපේක්ෂ path වලින් ගොනු load කළ නොහැක | රූප embedded resources ලෙස යෙදුම සමඟම යවන්න. [Module 6](#module-6-singleview) බලන්න |
| Property එකක් සැකසුවත් කිසිදු දෘශ්‍ය වෙනසක් නැත | [stub ප්‍රතිපත්තිය](#module-3-stub-policy) අනුව එය stub එකකි. අගය ගබඩා කර ආපසු කියවයි, නමුත් කිසිවක් එය භාවිත නොකරයි | Matrix එකේ අදාළ පේළිය බලන්න. එය *throw* කරනවා නම්, එය දෝෂයකි. වාර්තා කරන්න |
| Host කළ native අන්තර්ගතය නොපෙනේ | Backend එක ඔබේ native control එකේ වර්ගය පරීක්ෂා කර, නොගැළපුණු නිසා නිහඬව ආපසු ගියේය | වර්ගය පරීක්ෂා කරන්න: Avalonia backend එකට Avalonia `Control`, Uno වලට Uno `UIElement`, WinForms backend එකට `System.Windows.Forms.Control`, GTK 4 වලට `Gtk.Widget` |
| Maximize/minimize කිසිවක් නොකරයි; `Title` නොසලකා හැරේ | ඔබ සිටින්නේ single-view වේදිකාවකය (browser/Android/iOS/Terminal). එහි window manager එකක් නැත | මෙය අපේක්ෂිතයි. [Module 6](#module-6-singleview) බලන්න |
| HiDPI හිදී click වැරදි තැනකට වැටේ | Input routing එක logical සහ device ඒකක මිශ්‍ර කර ඇත. මෙය 26.0.30 හි රාමුවේ දෝෂයකි. පසුව නිවැරදි කර, CI හි පරිමාණය 2 හිදී gate කර ඇත | යාවත්කාලීන කරන්න (26.9.0 හෝ ඊට පසු). තවමත් එසේ වේ නම්, අවකාශ දෙක මිශ්‍ර කරන්නේ ඔබේම කේතයයි. [Module 8](#module-8-headless) බලන්න |
| Custom control එකක් HiDPI display එකක දෙගුණයක් විශාලව අඳී, 1× හිදී හරි | Paint canvas එක දැන් logical ය. නමුත් control එක තවමත් `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` කැඳවන නිසා දෙවරක් පරිමාණය වේ | `ScaleTransform` එක ඉවත් කරන්න. [Module 4](#module-4-paint) බලන්න. `MF_HEADLESS_SCALE=2` යටතේ පරීක්ෂා කරන්න |
| Owner-drawn අයිතම (`DrawItem`, `DrawNode`, `CellPainting`) HiDPI හිදී කුඩාව හෝ තැන මාරු වී පෙනේ | Control එකේ logical `ClientRectangle` එක මෙන් නොව, එම events තවමත් device pixel වලිනි | `e.Bounds` සහ `e.Graphics` එකට භාවිත කරන්න. Control එකේම logical ජ්‍යාමිතිය ඒ සමඟ මිශ්‍ර නොකරන්න. [Module 4](#module-4-paint) බලන්න |
| බ්‍රවුසරයේ, Android හෝ iOS මත `ShowDialog` / `MessageBox.Show` වෙතින් `PlatformNotSupportedException` | එම වේදිකාවලට nested modal loop එකක් ධාවනය කළ නොහැක. Exception පණිවිඩයේම await කළ හැකි විකල්පය නම් කර ඇත | `async` handler එකක සිට `ShowDialogAsync` / `MessageBox.ShowAsync` භාවිත කරන්න. [Module 6](#module-6-async) බලන්න. ඉතිරිය build එකේදීම හසු කර ගැනීමට `MFB` analyzer එක සක්‍රිය කරන්න |
| Click එකකින් පසු බ්‍රවුසර tab එක හිර වේ | යමක් පිටුවේ ඇති එකම thread එක block කළේය: `.Result`, `.Wait()`, `Thread.Sleep` | එය `await` කරන්න (`MFB002`/`MFB003` මේවා හඳුනා ගනී). [Module 6](#module-6-async) බලන්න |
| GTK 4 කවුළුවක් `Location` / `StartPosition` නොසලකා හරී | GTK 4 හි top-level කවුළු client පැත්තෙන් ස්ථානගත කිරීම ඉවත් කර ඇත. තීරණය කරන්නේ window manager එකයි | මෙය අපේක්ෂිතයි. එම backend එකේ `Location` යනු ගබඩා කර තබන ඉඟියක් පමණි. [Module 6](#module-6) බලන්න |
| GTK 4 / Headless මත file pickers කිසිවක් ආපසු නොදෙයි | එම backends වලට තවමත් native picker එකක් නැත. ඒ නිසා රාමුවේම fallback dialog එක භාවිත වේ | මෙය අපේක්ෂිතයි; fallback එක ක්‍රියා කරයි. `Gtk.FileDialog` සම්බන්ධ කිරීම පසුවට කල් දමා ඇති කාර්යයකි |
| WinForms dialog එකක් එහි Majorsilence parent එකට modal නොවේ | `OwnerHandleResolver` එක සම්බන්ධ කර නැත | ආරම්භයේදී එක් වරක් එය සම්බන්ධ කරන්න. [Module 7](#module-7-a) බලන්න |
| Windows මත deadlock හෝ message loop දෙකක් | `Application.Run` දෙකම කැඳවා ඇත | Process එකකට host එක් එකක් පමණි. අනෙක් දිශාවට bridge එක භාවිත කරන්න |
| macOS/Linux මත interop වෙතින් `PlatformNotSupportedException` | එම වේදිකාවල `System.Windows.Forms` නැත | Interop ඇමතුම් Windows දැයි බලන පරීක්ෂාවක් පිටුපස තබන්න |
| CSS තේමා rule එකකින් කිසිදු වෙනසක් නැත, දෝෂයක්ද නැත | Control එකක් එම property එක කේතයෙන් සකසා ඇත (`button.BackColor = …`). WinForms හි මෙන්ම, control එකට කෙලින්ම දුන් අගය සැමවිටම ඉදිරියෙන් සිටී | Control එකට දුන් අගය ඉවත් කරන්න, නැතහොත් එය එලෙස පිළිගන්න. ඊට වෙනස්ව, *අක්ෂර වැරදි සහිත* rule එකක් සැමවිටම දෝෂයක් දෙයි. `ThemeStyleSheet.Parse` diagnostics බලන්න ([උපග්‍රන්ථය D](#appendix-d)) |
| `BindCommand` කළ බොත්තමක් එක් click එකකට command එක දෙවරක් ධාවනය කරයි | එම control එකේම `Button.Command` ද සකසා ඇත | දෙකෙන් එකක් පමණක් භාවිත කරන්න ([උපග්‍රන්ථය E](#appendix-e)) |

---

## උපග්‍රන්ථය B — සැබෑ කේත පදනමක් සඳහා ක්‍රියාත්මක කිරීමේ සැලැස්ම
{:#appendix-b}

බැඳීමක් ගැනීමට පෙර සාක්ෂි ලැබෙන පරිදි සකස් කළ පියවර අනුපිළිවෙළකි.

1. **Spike එක (දින 1).** Module 0 සිට 3 දක්වා. Template යෙදුම සෑම සංවර්ධකයෙකුගේම OS එක මත ධාවනය කිරීම, සජීවී ගැලරිය ගවේෂණය කිරීම, compatibility matrix එක කියවීම. ලැබිය යුතු ප්‍රතිඵලය: ඔබේ යෙදුම රඳා පවතින ප්‍රධාන UI අංග 20 ක ලැයිස්තුවක්, එක් එක් අංගය implemented / stubbed / absent ලෙස ලකුණු කර.
2. **නියමු සංක්‍රමණය (දින 2–5).** කුඩා, සැබෑ, අවදානම අඩු අභ්‍යන්තර යෙදුමක් තෝරා ගන්න. Branch එකක migrator එක ධාවනය කර, build වන තත්ත්වයට ගෙන, [අතින් නිවැරදි කිරීමේ පිරික්සුම් ලැයිස්තුව](#module-5-checklist) හරහා යන්න. ලැබිය යුතු ප්‍රතිඵලය: කේත පේළි දහසකට (KLOC) ගත වන කාලය පිළිබඳ සැබෑ ඇස්තමේන්තුවක් සහ *ඔබව* සැබවින්ම අවහිර කරන හිඩැස් ලැයිස්තුවක්.
3. **භාවිතයට ගන්නා ආකාරය තීරණය කරන්න.** විකල්ප හතරක් ඇත. ඒවා එකිනෙක බැහැර කරන්නේ නැත:
   - **නව යෙදුමක්.** කෙලින්ම Majorsilence.Forms මත ආරම්භ කරන්න ([Module 2](#module-2)).
   - **පැරණි යෙදුමක නව තිර.** Windows මත Direction B interop. ඔබ නිකුත් කරන කිසිවක් වෙනස් නොවේ ([Module 7](#module-7-b)).
   - **පැරණි යෙදුමක, වරකට එක් control එකක්.** WinForms හෝ WPF backend එක ([Module 7](#module-7-c)). මෙය .NET Framework 4.8 මතද ක්‍රියා කරන නිසා, UI port එක runtime යාවත්කාලීනය එනතුරු බලා සිටිය යුතු නැත.
   - **මුළු යෙදුමම සංක්‍රමණය කිරීම.** Migrator එක මගිනි. ඔබ C# භාවිත කරන්නේ නම් `--dual-build` ද යොදා ගත හැක ([Module 5](#module-5-dualbuild)). **VB කණ්ඩායම් ඒ වෙනුවට එක් වර මාරු වීමක් (cut-over) සැලසුම් කළ යුතුය.** dual-build ඔබට නැත.
4. **විශාල වැඩට පෙර පරීක්ෂණ ආරක්ෂක දැල සකසන්න.** නියමු යෙදුම මත [Module 8](#module-8): locator නම් කිරීමේ සම්මුතිය, CI හි headless පරීක්ෂණ, වැදගත් තිර සඳහා golden images. විශාල යෙදුම සංක්‍රමණය කිරීමට *පෙර* මෙය කරන්න. port එක නිවැරදිව හැසිරෙන බව ඔබ දැන ගන්නේ මේ පරීක්ෂණවලිනි.
5. **CI gates සකසන්න** ([Module 10](#module-10-ci)). `--strict` සමඟ සංක්‍රමණ drift පරීක්ෂාවද ඇතුළත් කරන්න.
6. **කොටස් වශයෙන් සංක්‍රමණය කරන්න.** වරකට deploy කළ හැකි එක් ඒකකයක්. සෑම කොටසක්ම gates සියල්ල සමත් වී අවසන් විය යුතුය.
7. **සොයා ගැනීම් ආපසු ලබා දෙන්න** ([Module 10](#module-10-gaps)). ඔබට හමු වන නිහඬ no-ops, API එක කියවීමෙන් වෙන කිසිවෙකුට සොයා ගත නොහැකි ඒවාය.

පහත කරුණු කලින්ම, පැහැදිලිව තීරණය කරන්න. සෑම එකක්ම සැලැස්ම සීමා කරයි. ඔබට සැබවින්ම අවශ්‍ය වේදිකා මොනවාද? (desktop පමණක් යන්න, "iOS ද සමඟ" යන්නට වඩා හාත්පසින්ම වෙනස් ව්‍යාපෘතියකි.) දෘශ්‍ය designer එකක් ඔබට අවශ්‍යද? (තවමත් එකක් නැත.) Vendor control suite එකක් මත ඔබ රඳා පවතිනවාද? (Telerik සඳහා ගැළපුම් ස්තරයක් ඇත. අනෙක් vendors සඳහා `--map` ගොනුවක් සහ අතින් කරන වැඩ අවශ්‍යය.) Windows වලින් පිටත accessibility වගකීමක් ඔබට තිබේද? ඔබේ කේත පදනම VB ද? (එසේ නම් dual-build නොව cut-over.) ඔබේ යෙදුමේ කිසිවක් native අන්තර්ගතය host කරනවාද, නැතහොත් කවුළු handles කියවනවාද? බ්‍රවුසර හෝ දුරකථන head එකක් සැලැස්මට ඇතුළත් නම්, ඔබේ dialogs මුල සිටම async ලෙස ලියා තිබේද? ([Module 6](#module-6-async))

---

## උපග්‍රන්ථය C — ඉක්මන් යොමු පත්‍රිකාව
{:#appendix-c}

**අඩවියේ පිටු:** [ආරම්භ කිරීම]({{ '/si/getting-started/' | relative_url }}) ·
[සංක්‍රමණය]({{ '/si/migration/' | relative_url }}) ·
[නිදසුන්]({{ '/si/samples/' | relative_url }}) · [වේදිකා backends]({{ '/si/backends/' | relative_url }}) ·
[ස්වයංක්‍රීයකරණය සහ UI පරීක්ෂණ]({{ '/si/automation/' | relative_url }}) ·
[Native interop]({{ '/si/native-interop/' | relative_url }}) · [නිතර අසන ප්‍රශ්න]({{ '/si/faq/' | relative_url }}) ·
[බ්ලොග්]({{ '/si/blog/' | relative_url }}) · [සජීවී බ්‍රවුසර ගැලරිය]({{ '/gallery/' | relative_url }})

**Repository එකේ ඇති, යෙදුම් කණ්ඩායමකට සැබවින්ම අවශ්‍ය ලේඛන:**

| ලේඛනය | කියවිය යුත්තේ කවදාද |
|---|---|
| [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) | ඕනෑම සාමාජිකයෙකු මත රඳා පැවතීමට පෙර. සැමවිටම විවෘතව තබා ගන්න |
| [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) | Migrator එක ධාවනය කරන විට. සෑම බිඳෙන වෙනසක්ම මෙහි ලේඛනගත කර ඇත |
| [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) | Backend එකක් තෝරන විට. Logical සහ device ඒකක, single-view වේදිකා, async-dialog නීතිය සහ analyzer එක |
| [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) | CSS තේමාවක් ලියන විට. මුළු භාෂාවම එම එක් පිටුවේ ඇත |
| [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) | `Observe`/`BindText`/`BindCommand` මගින් view models සම්බන්ධ කරන විට |
| [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md) | දුරකථන තිරයකට ගැළපෙන layout එකක් සාදන විට: `StackPanel`, `Card`, `RichListBox` |
| [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md) | `RequestAnimationFrame`, tweens, reduced motion, Headless clock එක |
| [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md) | පරීක්ෂණ ගැන ගැඹුරින් දැන ගැනීමට. Custom controls වල `IAutomationStateProvider` සහ MCP server එක ඇතුළුව |
| [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) | Windows මත එක් process එකක stacks දෙකම ධාවනය කරන විට |
| [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) | Native අන්තර්ගතය හෝ වීඩියෝ host කරන විට |

**මතක තබා ගැනීම වටින විධාන:**

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

**වෙනස් වන්නේ කුමක්දැයි අසන අයෙකුට දිය හැකි පේළි දෙකේ පිළිතුර:** ඔබේ imports `System.Windows.Forms` වෙනුවට `Majorsilence.Forms` ද, GDI+ වෙනුවට `Majorsilence.Forms.Drawing` ද බවට මාරු වේ. ඊට අමතරව backend package එකක් එක් වේ. ඔබේ forms, designer ගොනු, event handlers සහ ව්‍යාපාරික තර්කනය කිසිදු වෙනසක් නැතිව ඔබේම ලෙස පවතී.

---

## උපග්‍රන්ථය D — CSS මගින් ඔබේ යෙදුමට තේමා යෙදීම
{:#appendix-d}

**අපේක්ෂිත ප්‍රතිඵලය:** එක් ගොනුවකින් මුළු යෙදුමකම පෙනුම වෙනස් කිරීමට ඔබට හැකි වේ. තේමා භාෂාවෙන් ප්‍රකාශ කළ හැකි දේ සහ නොහැකි දේ ඔබ දනී. Rule එකක් වැරදි වූ විට එය සොයා ගන්නා ආකාරයද ඔබ දනී.

රාමුව සෑම පික්සලයක්ම තමන්ම අඳින නිසා ([Module 1](#module-1)), යෙදුමේ පෙනුම OS එකේ කාරණයක් නොව රාමුවේ කාරණයකි. රාමුව එය ඔබට ලබා දෙන්නේ **CSS හි කුඩා, දැඩිව නිර්වචනය කළ උප කොටසක්** ලෙසය. තේමාවක් යනු `.css` ගොනුවකි. මුළු භාෂාවම එක් පිටුවකට ගැළපේ ([`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md)). එයින් පිටත ඕනෑම දෙයක් parser එක ප්‍රතික්ෂේප කරයි. එසේ කරන විට පේළිය, තීරුව සහ සහාය දක්වන විකල්පයද පෙන්වයි. රාමුවේ මෙම කොටසේ **නිහඬ no-op කිසිවක් නැත.** එය හිතාමතාම ගත් තීරණයකි. අක්ෂර වැරදි සහිත property එකක් stub එකක් නොව දෝෂයකි. (මෙම උපග්‍රන්ථය එම ලේඛනය සහ `ThemeStudio` නිදසුන සමඟ සසඳා පරීක්ෂා කරන ලද්දකි. මෙම මාර්ගෝපදේශය සඳහා වෙනම ධාවනය කර නැත. පැරණි `<Theme>` XML ආකෘතිය තවමත් ක්‍රියා කරන අතර, CSS සමඟ මිශ්‍රවද භාවිත කළ හැක.)

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

// වත්මන් තේමාවෙන් ඔබේම එකක් ආරම්භ කරන්න:
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

' වත්මන් තේමාවෙන් ඔබේම එකක් ආරම්භ කරන්න:
File.WriteAllText("mine.css", Theme.ExportCss("Mine", "Light"))
```

තිරය දිලිසෙන බවක් (flash) නොපෙනෙන්නට ඔබට අවශ්‍ය නම්, පළමු form එක පෙන්වීමට පෙර තේමාව load කරන්න. පසුව යෙදුවහොත්, විවෘතව ඇති සියල්ල නැවත අඳිනු ලැබේ.

### මුළු භාෂාවම, එක් උදාහරණයකින්
{:#appendix-d-language}

ප්‍රකාශ වර්ග තුනක් පමණි: header එකක්, tokens සහ control rules. වෙන කිසිවක් නැත:

```css
/* Ocean: ගැඹුරු නිල්-කොළ අඳුරු තේමාවක්. */
@theme "Ocean" extends Dark;             /* built-in එකකින් (Light, Dark, Classic, Aero, …) හෝ ලියාපදිංචි ඕනෑම තේමාවකින් ආරම්භ කරන්න */

:root {
  --brand: #1e90ff;                      /* ඔබේම විචල්‍යය, පහත var() සමඟ යොමු කෙරේ */

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

/* Parts: control එකක් තමා තුළම අඳින කොටස්. */
DataGridView::header    { background-color: #2c2c30; color: #e8e8ea; font-weight: bold; }
DataGridView::selection { background-color: var(--accent-color); color: var(--foreground-color-on-accent); }
ScrollBar::thumb        { background-color: #55555c; border-radius: 4px; }
Menu::item:hover        { background-color: #34343a; }
```

මේ ගැන ඔබේ කණ්ඩායමට පැවසිය යුතු කරුණු කිහිපයක් ඇත. CSS ගැන සාමාන්‍ය අවබෝධය නොමඟ යවන තැන් මේවාය:

- **මුලින්ම tokens.** `:root` tokens පමණක් සැකසීමෙන්ම සෑම control එකකම *සහ* සෑම part එකකම වර්ණ වෙනස් වේ. පෙරනිමි අගයන් ඔබට නොගැළපෙන තැන්වලට පමණක් control rules එක් කරන්න.
- **Selectors යනු control වර්ගවල නම්ය** (`Button`, `TextBox`, `DataGridView`, සහ සෑම Telerik compat control එකක්ම). Classes නැත, ids නැත, descendant selectors නැත, `*` නැත. Rule එකක් එම වර්ගයේ සෑම control එකකටම, එය කොතැන තිබුණත්, අදාළ වේ. *එක්* control එකක් පමණක් හැඩගැන්වීමට නම්, කේතයෙන් `button.Style.BackgroundColor` (හෝ WinForms හි `BackColor`) සකසන්න. WinForms හි මෙන්ම, **control එකට කෙලින්ම දුන් අගය සැමවිටම ඉදිරියෙන් සිටී.**
- **Pseudo-classes හතරක් පමණි** (`:hover`, `:active`, `:disabled`, `:focus`). ඒවාද එම තත්ත්වයට නැවත අඳින controls සඳහා පමණි. අද වන විට ඒවා `Button`, `LinkLabel` සහ `TrackBar` ය. `TextBox:hover` යනු නිහඬව නොසලකා හැරෙන දෙයක් නොව, පැහැදිලි කිරීමක් සහිත දෝෂයකි.
- **Cascade නැත, specificity නැත, `!important` නැත.** පසුව ලියූ ප්‍රකාශය පෙර එක ප්‍රතිස්ථාපනය කරයි. `@import` නැත, `@media` නැත. තේමා දෙකක් ලියාපදිංචි කර, කේතයෙන් එකක් තෝරන්න.
- **Layout එක තේමාවකින් වෙනස් කළ නොහැක.** වර්ණ, borders, කොන් වක්‍ර කිරීම (කොන අනුව), ඉරි සහිත borders, ස්ථාවර offset සහිත `box-shadow` සහ fonts වෙනස් කළ හැක. `margin`/`padding` දෝෂ වේ. ඒවා කේතයෙන් සකසන්න.
- **Hex alpha අගය අවසානයට එයි** (`#rrggbbaa`). මෙය XML ආකෘතියේ `#AARRGGBB` හි ප්‍රතිවිරුද්ධ පිළිවෙළයි.

### Theme Studio, සහ තේමාව ලිවීම AI සහායකයෙකුට භාර දීම
{:#appendix-d-studio}

`samples/ThemeStudio` සජීවී සංස්කාරකයකි. (එය repo එකේ ඇත. GitHub releases වල කලින් build කළ binaries ද අමුණා ඇත.) වම් පැත්තේ CSS, දකුණු පැත්තේ තේමා කළ හැකි සෑම control එකක්ම, යටින් parser එකේ diagnostics. ඔබ type කරන විටම තේමාව නැවත යෙදේ. Studio එකේම කවුළුවටද එසේමය. ගොනුවක් විවෘත කළ විට එය **නිරීක්ෂණය (watch) කෙරේ.** ඒ නිසා ඔබට එය ඔබේම editor එකෙන් සංස්කරණය කළ හැක. නැතහොත් coding assistant එකකට එය සංස්කරණය කිරීමට ඉඩ දිය හැක. එහි ඇති **Copy reference for AI** බොත්තම සම්පූර්ණ token/selector/property යොමුව clipboard එකට ගනී. එය chat එකකට paste කර, "වටකුරු බොත්තම් සහිත, උණුසුම්, high-contrast ආලෝක තේමාවක්" යැයි ඉල්ලා, ලැබෙන පිළිතුර නැවත paste කරන්න. Parser එක විරුද්ධ වුවහොත්, දෝෂ පණිවිඩය නැවත සහායකයාට paste කරන්න. සෑම පණිවිඩයකම වැරදි පෙළ සහ නිවැරදි විකල්පය සඳහන් වේ. `--render-headless out.png theme.css` මගින් display එකක් නැතිව preview එක render කර, දෝෂ ඇත්නම් ශුන්‍ය නොවන කේතයකින් පිටවේ. එයින් තේමා ගොනුවක් CI හි පරීක්ෂා කළ හැකි දෙයක් බවට පත් වේ. ආරම්භයට තේමා හයක් `samples/ThemeStudio/Themes/` හි ඇත: `light`/`dark` (ගැළපෙන යුගලයක්), `ocean`, `graphite`, `paper`, `parchment`.

### කේතයෙන් diagnostics ලබා ගැනීම
{:#appendix-d-diagnostics}

ඔබේ පරිශීලකයන් සපයන තේමාවක් නම්, අන්ධව යොදනවා වෙනුවට ඔබම එය parse කර, ගැටලු ඔවුන්ට පෙන්වන්න:

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

### එක් sheet එකක්, toolkits තුනක්
{:#appendix-d-hosts}

මිශ්‍ර සංක්‍රමණ යෙදුමක, එම ගොනුවෙන්ම *අනෙක්* පැත්තද හැඩගැන්විය හැක. `Majorsilence.Forms.Theming.WinForms` එය සැබෑ `System.Windows.Forms` controls වලට යොදයි ([Module 7](#module-7-c)). `Majorsilence.Forms.Theming.Avalonia` එය native Avalonia Fluent controls වලට යොදයි (`AvaloniaCssTheme.Apply` / `Watch`). දෙකටම ලේඛනගත සහාය matrix එකක් ඇත. සෑම හිඩැසක්ම diagnostic එකක් ලෙස වාර්තා වේ. දිගු සංක්‍රමණයක් අතරතුර "මේක එකට ඇලවූ යෙදුම් දෙකක් වගේ පෙනෙයි" යන බියට පිළිතුර මෙයයි.

**අභ්‍යාසය D.** Light තේමාව export කරන්න (`Theme.ExportCss`). Tokens තුනක් සහ එක් `Button` rule එකක් වෙනස් කර, ආරම්භයේදී එය load කරන්න. ඉන්පසු හිතාමතාම `TextBox:hover { color: red; }` ලියා, parser එක දෙන දෝෂ පණිවිඩය කියවන්න. රාමුවේ මෙම කොටසේ මුළු දර්ශනයම එක් පණිවිඩයකින් එහි ඇත.

---

## උපග්‍රන්ථය E — MVVM සහායක
{:#appendix-e}

**අපේක්ෂිත ප්‍රතිඵලය:** reflection නොමැතිව, trimming සහ NativeAOT යටතේද ආරක්ෂිත ආකාරයට, view model එකක් form එකකට සම්බන්ධ කිරීමට ඔබට හැකි වේ. එය භාවිත *නොකළ යුත්තේ* කවදාදැයිද ඔබ දනී.

හවුල් UI library එකකට මාරු වන WinForms කණ්ඩායම්, බොහෝ විට එම අවස්ථාවෙන් view models forms වලින් වෙන් කර ගැනීමටද ප්‍රයෝජන ගනී. `Control.DataBindings` මෙහි ක්‍රියා කරන අතර එය two-way ය. නමුත් එය reflection මත රඳා පවතී. එනම්, trimmer එක සඳහා ඔබේ view-model properties root කළ යුතුය. `Majorsilence.Forms.Mvvm` එයට විකල්පයකි. එය `INotifyPropertyChanged` සහ `ICommand` මත ක්‍රියා කරන කුඩා extension methods කට්ටලයකි. Property එක `nameof` මගින් නම් කර, lambdas හරහා එය කියවා ලියයි. ඒ නිසා run time එකේදී string මගින් කිසිවක් සොයන්නේ නැත. එයට කිසිදු toolkit එකක් මත රඳා පැවතීමක් නැත. CommunityToolkit.Mvvm මගින් ලියූ ඒවා ඇතුළුව ඕනෑම view model එකක් සමඟ ක්‍රියා කරයි. ([`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) සහ ගැලරියේ `MvvmHelpersPanel` සමඟ සසඳා පරීක්ෂා කරන ලදී. මෙම මාර්ගෝපදේශය සඳහා වෙනම ධාවනය කර නැත.)

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

// Commands: Enabled, CanExecute අනුගමනය කරයි; Click මගින් command එක ධාවනය වේ. custom paint කළ ඒවා ඇතුළුව ඕනෑම control එකක ක්‍රියා කරයි.
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

' Commands: Enabled, CanExecute අනුගමනය කරයි; Click මගින් command එක ධාවනය වේ. custom paint කළ ඒවා ඇතුළුව ඕනෑම control එකක ක්‍රියා කරයි.
incrementButton.BindCommand(viewModel.IncrementCommand).AddTo(scope)

' පිටුවෙන් ඉවත් වන විට:
scope.Dispose()
```

### සහායක සහතික කරන දේ, සහ නීති දෙකක්
{:#appendix-e-rules}

- **සෑම යාවත්කාලීනයක්ම UI thread එකට පැමිණේ.** Worker thread එකක raise වූ `PropertyChanged` එකක් dispatcher එක හරහා post කෙරේ. UI thread එකේම raise වූ එකක් වහාම යෙදේ. ඒ නිසා අනුපිළිවෙළ රැකේ. වෙනස්කම් කිහිපයක් පෝලිමේ රැඳී ඇත්නම්, සෑම push එකක්ම ධාවනය වන මොහොතේ *වත්මන්* අගය කියවයි. ඒ නිසා control එකක් නව අගයකට පසුව පැරණි අගයක් කිසි විටෙක පෙන්වන්නේ නැත.
- **Two-way binding caret එකට බාධා නොකරයි.** Control එකට ලියන්නේ එහි අගය වෙනස් වී ඇත්නම් පමණි. එක් දිශාවක් යෙදෙන අතරතුර අනෙක් දිශාව නොසලකා හැරේ. ඒ නිසා දෙක අතර එහා මෙහා යාමක් (ping-pong) සිදු නොවේ. දැනගත යුතු ප්‍රතිවිපාකය: view model එක ලැබෙන අගය *වෙනස් කර* ගබඩා කරන්නේ නම් (trim කිරීම, upper-case කිරීම වැනි), view model එක තමන්ගේම වෙනස් වීමක් raise කරන තුරු box එකේ පරිශීලකයා type කළ දේම රැඳී පවතී.
- **Async command එකක් ධාවනය කළ නොහැකි යැයි වාර්තා කරන අතරතුර, `BindCommand` control එක අක්‍රිය කරයි.** CommunityToolkit හි `AsyncRelayCommand` පෙරනිමියෙන්ම එසේ වාර්තා කරයි. අමතර කේතයක් අවශ්‍ය නැත.
- **නීතිය 1: එකම control එකේ `BindCommand` සහ `Button.Command` දෙකම භාවිත නොකරන්න.** දෙකම command එක ධාවනය කරන නිසා, එක් click එකකට එය දෙවරක් ධාවනය වේ. දෙකෙන් එකක් පමණක් භාවිත කරන්න.
- **නීතිය 2: පිටුවෙන් ඉවත් වන විට scope එක dispose කරන්න.** `BindingScope` තමා තුළ ඇති සියල්ල, අලුත්ම එක මුලින්, dispose කරයි. ඒ නිසා කිසිදු view එකක්, තමාට වඩා දිගු කල් පවතින view model එකක handler එකක් ඉතිරි කර (leak කර) යන්නේ නැත. `null` හෝ හිස් නමක් සහිත `PropertyChanged` එකක් "සියල්ල වෙනස් විය" යන්න අදහස් කරයි. එය සෑම observation එකක්ම නැවත යොදවයි.

අද වන විට two-way binding controls හතරකට ලැබේ: `TextBox`, `CheckBox`, `ComboBox` (තෝරාගත් index එක) සහ `NumericUpDown` (control එකම කරන ආකාරයට, එහි පරාසයට සීමා කර). සෙසු ඒවා සඳහා, එනම් `TrackBar` එකක්, `DateTimePicker` එකක් හෝ radio group එකක් සඳහා, එක් දිශාවට `Observe` ද අනෙක් දිශාවට control එකේම event එක ද භාවිත කරන්න. නැතහොත් `DataBindings` භාවිත කරන්න.

### UI thread එකක් නැතිව සම්බන්ධතා පරීක්ෂා කිරීම
{:#appendix-e-testing}

සහායකවලට විකල්ප ලෙස `IUiDispatcher` එකක් (`CheckAccess()` + `Post(Action)`) දිය හැක. පෙරනිමි dispatcher එක, ඔබ UI thread එකේ සිටිනවාදැයි සක්‍රිය backend එකෙන් විමසා, `Application.RunOnUIThread` හරහා post කරයි. පරීක්ෂණයකදී, "UI thread එකේ නැත" යැයි වාර්තා කරන සහ ලැබෙන දේ පෝලිමකට දමන ව්‍යාජ (fake) එකක් දෙන්න. එවිට පසුබිම් thread එකක සිදු වූ වෙනසක් නිවැරදිව UI thread එකට යොමු වූ බව ඔබේ පරීක්ෂණයට *ඔප්පු* කළ හැක. පෝලිම ධාවනය කරන වෙලාවද පරීක්ෂණයම තීරණය කරයි. Reflection මත පදනම් වූ binding එකකින් ලිවිය හැකි ඕනෑම පරීක්ෂණයකට වඩා මෙය ශක්තිමත්ය.

**අභ්‍යාසය E.** ඔබේ නියමු සංක්‍රමණයෙන්, අතින් ලියූ view-model සම්බන්ධතා ඇති (events ඇතුළට, property සැකසීම් පිටතට) form එකක් තෝරා ගන්න. එය `BindingScope` එකක් තුළ `Observe`/`BindText`/`BindCommand` මගින් ප්‍රතිස්ථාපනය කරන්න. මකා දැමූ පේළි ගණන් කරන්න. ඉන්පසු, worker thread එකක සිදු වූ වෙනසක් label එක දක්වා පැමිණෙන බව ඔප්පු කරන, ව්‍යාජ dispatcher එකක් සහිත එක් පරීක්ෂණයක් ලියන්න.
