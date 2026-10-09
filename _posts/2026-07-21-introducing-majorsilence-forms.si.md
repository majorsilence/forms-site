---
title: "Majorsilence.Forms හඳුන්වා දීම"
date: 2026-07-21 15:00:00 -0000
lang: si
permalink: /si/blog/2026/07/21/introducing-majorsilence-forms/
read_time: "මිනිත්තු 4 ක කියවීමක්"
excerpt: "පැරණි සහ නවීන WinForms යෙදුම් නැවත ලිවීමකින් තොරව බහු-වේදිකා (cross-platform) තාක්ෂණ තොගයකට ගෙන යාම සඳහා වූ WinForms-ශෛලියේ UI framework එකක්."
description: >-
  Majorsilence.Forms හඳුන්වා දීම: .NET සඳහා විවෘත-මූලාශ්‍ර බහු-වේදිකා WinForms පුස්තකාලයක්. ඔබේ
  පෝරම, පාලක සහ Designer ගොනු එලෙසම තබාගෙන, එකම යෙදුම නැවත ලිවීමකින් තොරව Windows, macOS සහ
  Linux මත ධාවනය කරන්න.
---

WinForms යෙදුමක් Windows-පමණක් desktop එකෙන් ඉවතට ගෙන යාම යනු සාම්ප්‍රදායිකව මුල සිටම නැවත ලිවීමකි (rewrite): XAML, බලහත්කාරයෙන් MVVM ව්‍යුහයකට වෙනස් කිරීම, නැතහොත් web. එය මිල අධිකයි, අවදානම් සහිතයි, තවද බොහෝ විට අලුත් පෙනුමක් පමණක් අවශ්‍ය codebase එකක් වෙනුවෙන් වසර ගණනාවක් තිස්සේ ක්‍රියා කළ ව්‍යාපාරික තර්කනය (business logic) සහ UX ඉවත දමයි.

**Majorsilence.Forms** වෙනස් ප්‍රවේශයක් ගනී: එය WinForms API මතුපිට පිළිබිඹු කරයි — `Form`, පාලක (controls), සිදුවීම් හසුරුවන (event handlers), `*.Designer.cs` code-behind පවා — තවද පවතින පෝරම සහ පාලක ඉතා අඩු වෙනස්කම් ප්‍රමාණයකින් ගෙන යා හැකි වන පරිදි ගැළපුම් ස්තරයක් (compatibility layer) සපයයි. ක්‍රමලේඛන ආකෘතිය වෙනස් නොවේ; වෙනස් වන්නේ එය ධාවනය වන ස්ථානය පමණි.

## එය ගොඩනගා ඇති ආකාරය
{:#how-its-built}

සෑම පාලකයක්ම [SkiaSharp](https://github.com/mono/SkiaSharp) භාවිතයෙන් `SKSurface` එකකට ඇඳ ඇත්තේ, මාරු කළ හැකි ධාරක (host) backend එකක් මතය:

- **Avalonia** (පෙරනිමි) — Windows, macOS, Linux desktop කිසිදු සැකසීමකින් තොරව, තවද mobile සහ web වෙත ද මාර්ගයක් ලෙස එයටම ආවේණික Android, iOS සහ Browser (WebAssembly) ඉලක්ක සමඟ.
- **Uno Platform** — පුළුල්ම ආවරණය: desktop, iOS, Android සහ WebAssembly.
- **Headless** — CI සහ ස්වයංක්‍රීය පරීක්ෂණ සඳහා කිසිදු පරායත්තතාවයකින් තොර, තිරයෙන් පිටත (offscreen) විදැහුම්කරණය.

මූලික `Majorsilence.Forms` assembly එක කිසිදු windowing toolkit එකක් reference නොකරයි — SkiaSharp පමණි. Backends යනු `IPlatformBackend` සහ `IWindowBackend` යන කුඩා interfaces දෙකට සම්බන්ධ වන වෙනම assemblies ය. එම සන්ධිය (seam) නිසා, යෙදුම් කේතයේ කිසිදු වෙනසක් නොමැතිව හරියටම එකම යෙදුමට අද Avalonia ද හෙට Uno ද ඉලක්ක කළ හැකිය. වැඩිදුර [Platform backends]({{ '/si/backends/' | relative_url }}) හි කියවන්න.

## එය කා සඳහාද
{:#who-its-for}

ඔබ අද Windows-පමණක් ධාවනය වන WinForms codebase එකක් සතුව සිටිමින්, වසර ගණනාවක නැවත ලිවීමක් ආරම්භ කරනවා වෙනුවට ගම්‍යතාවය රඳවා ගැනීමට — ඔබේ පාලක, ඔබේ කණ්ඩායමේ හුරුපුරුදු දැනුම, ඔබේ ව්‍යාපාරික තර්කනය නැවත භාවිත කිරීමට — කැමති නම්, මෙය ඔබ සඳහාම ගොඩනගා ඇත.

මෙම ව්‍යාපෘතිය මුල් අවධියක පවතී: API ස්ථාවර වෙමින් පවතින අතර සෑම WinForms කොටසක්ම තවමත් ආවරණය වී නැත. නව බහු-වේදිකා ව්‍යාපාරික (LOB) යෙදුම් සඳහා එය දැනටමත් හොඳ තේරීමකි, තවද ඔබ අනුවාදය ස්ථිර කරන්නේ නම් (pin your version) සැබෑ production යෙදුම් සංක්‍රමණය කිරීමටද සුදුසුය. අද ක්‍රියාත්මක කර ඇත්තේ මොනවාද, stub ලෙස පමණක් ඇත්තේ මොනවාද යන්න හරියටම දැනගැනීමට [ගැළපුම් න්‍යාසය (compatibility matrix)]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) බලන්න.

## උත්සාහ කර බලන්න
{:#try-it}

```
dotnet new --install MajorsilenceForms.Templates
dotnet new majorsilenceforms
dotnet run
```

නැතහොත් සැබෑ යෙදුමක් ගවේෂණය කරන්න — [`samples/Explorer`]({{ site.github_url }}/tree/main/samples/Explorer) යනු සම්පූර්ණ Windows Explorer ප්‍රතිනිර්මාණයක් වන අතර, [`samples/Outlaw`]({{ site.github_url }}/tree/main/samples/Outlaw) යනු Outlook ප්‍රතිනිර්මාණයකි; දෙකම එකම පාලක කට්ටලය මත වේදිකා හරහා කිසිදු වෙනසකින් තොරව ධාවනය වේ.

ඔබේ පළමු යෙදුම සකස් කිරීමට [Getting Started]({{ '/si/getting-started/' | relative_url }}) බලන්න.
