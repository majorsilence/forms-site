---
title: "Platform backends: Avalonia, Uno සහ Headless"
date: 2026-07-21 11:00:00 -0000
lang: si
permalink: /si/blog/2026/07/21/platform-backends-avalonia-uno-headless/
read_time: "මිනිත්තු 5 ක කියවීමක්"
excerpt: "Majorsilence.Forms සෑම පාලකයක්ම SkiaSharp සමඟ තනිවම අඳියි — යටින් ඇති windowing toolkit එක ධාරකයක් (host) පමණි. සන්ධිය (seam) ක්‍රියා කරන ආකාරය මෙන්න."
description: >-
  බහු-වේදිකා WinForms, Avalonia, Uno Platform සහ headless Skia surface එකක් මත ධාවනය වන ආකාරය:
  සෑම පාලකයක්ම SkiaSharp සමඟ අඳින අතර යටින් ඇති windowing toolkit එක මාරු කළ හැකි ධාරකයක් පමණි.
---

Majorsilence.Forms **තමන්ගේම සියලු ඇඳීම්** SkiaSharp සමඟ සිදු කරයි. සෑම පාලකයක්ම `SKSurface`/`SKCanvas` එකකට අඳියි; යටින් ඇති windowing toolkit එක *ධාරකයක් (host)* පමණි — එය native කවුළු නිර්මාණය කරයි, message loop එක ධාවනය කරයි, ආදානය (input) ලබා දෙයි, සහ Skia surface එක තිරයට ඉදිරිපත් කරයි. එම වෙන්කිරීම නිසා අද හරියටම එකම පාලක කට්ටලයට එකිනෙකට බෙහෙවින් වෙනස් toolkits තුනක් මත ධාවනය විය හැකිය.

## සන්ධිය (seam)
{:#the-seam}

ධාරකයක් සැපයිය යුතු සියල්ල interfaces දෙකකින් නිර්වචනය වේ:

`IPlatformBackend` යෙදුම්-මට්ටමේ සේවා ආවරණය කරයි — dispatcher (`Post`/`Invoke`), timers, clipboard, තිර ගණනය කිරීම (screen enumeration), සහ modal loop එක. `IWindowBackend` තනි native කවුළුවක් ආවරණය කරයි — ප්‍රමාණය සහ පිහිටීම, show/hide/close, cursor, decorations, ගොනු සංවාද කවුළු (file dialogs). ආදාන සහ paint ඉල්ලීම් ගලා යන්නේ *අනෙක්* දිශාවටය: backend එක කවුළුවේ මධ්‍යස්ථ `RenderFrame(SKCanvas, …)` සහ `Handle*` methods සෘජුවම call කරයි. කිසිදු වේදිකා type එකක් — Avalonia type එකක් හෝ WinUI type එකක් — කිසි විටෙක මූලික Majorsilence.Forms කේතයට ඇතුළු නොවේ.

## අද ඇති backends තුන
{:#three-backends-today}

**`Majorsilence.Forms.Avalonia`** පෙරනිමියයි — Avalonia 12, කිසිදු සැකසීමකින් තොරව Windows, macOS සහ Linux desktop ලබා දෙයි. එය reference කරන්න, `Application.Run(new MyForm())` සරලවම ක්‍රියා කරයි. එය desktop වලට පමණක් සීමා නොවේ: Avalonia එයටම ආවේණික Android, iOS සහ Browser (WASM) ඉලක්ක සපයන බැවින්, පහත විස්තර කරන කැපවූ Uno backend එකට අමතරව, මෙම backend එකම mobile සහ web වෙත දෙවන මාර්ගයකි.

**`Majorsilence.Forms.Headless`** යනු හැකි සරලම backend එක වන අතර, නව එකක් ලිවීම සඳහා යොමු සැකිල්ල (reference template) ලෙසද ක්‍රියා කරයි: work-queue message loop එකක්, මතකය තුළ (in-memory) clipboard එකක්, අතථ්‍ය තිරයක්, සහ තිරයෙන් පිටත (offscreen) විදැහුම්කරණය. එයට display එකක් අවශ්‍ය නොවන බැවින්, unit test suite එක ධාවනය වන්නේ එය මතය, තවද CI pixel-diffing සඳහා ControlGallery නිදසුන සෘජුවම PNG එකකට විදැහුම් කළ හැකිය:

```
dotnet run --project samples/ControlGallery -- --render-headless out.png 1100 750 --select-row 0
```

**`Majorsilence.Forms.Uno`** Uno Platform හි Skia renderer එක ඉලක්ක කරයි; `SKXamlCanvas` එකක් ධාරණය කරමින් desktop, iOS, Android සහ WebAssembly වෙත ළඟා වේ. එය macOS මත අන්තයේ සිට අන්තය දක්වා (end-to-end) තහවුරු කර ඇත: Uno ධාරකය දියත් වේ, backend එක කවුළුව නිර්මාණය කරයි, සහ ControlGallery හි සම්පූර්ණ `MainForm` canvas එකට විදැහුම් වේ. එයට අන්තර්ක්‍රියාකාරී session එකක් අවශ්‍ය නිසා, එය headless CI build එක හරහා නොව, කැපවූ head ව්‍යාපෘතියක් — [`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — හරහා ධාවනය වේ.

සඳහන් කළ යුතු එක් විස්තරයක්: Uno හි ක්‍රමලේඛනමය "කවුළු ඇදීමක් ආරම්භ කිරීමේ" (begin a window drag) API එකක් නැත, එබැවින් Majorsilence.Forms හි තමන් විසින්ම අඳින කවුළු chrome එක සඳහා move/resize ඒ වෙනුවට ප්‍රකාශනාත්මකව (declaratively) හසුරුවනු ලැබේ — borderless presenter එකක් OS resize margins නොමිලේ රඳවා ගන්නා අතර, Windows desktop head එක මත title-bar ඇදීම WinUI හි caption-region API එක භාවිත කරයි. macOS මත, ඒ වෙනුවට native decorations ඇදීම/ප්‍රමාණය වෙනස් කිරීම හසුරුවයි.

## ඔබේම එකක් එක් කිරීම
{:#adding-your-own}

නව backend එකක් යනු තවත් assembly එකක් පමණි: මූලික `Majorsilence.Forms` සහ ඔබේ toolkit එක reference කරන්න, `IPlatformBackend` සහ `IWindowBackend` ක්‍රියාත්මක කරන්න, සහ Avalonia/Headless/Uno ත්‍රිත්වය අනුකරණය කරන්න — platform backend එක තුළ dispatcher එක ධාවනය කරන්න, සහ window backend එක තුළ Skia surface එකක් ඉදිරිපත් කර ආදානය පරිවර්තනය කරන්න. සම්පූර්ණ interface ලැයිස්තුව සඳහා [Platform backends]({{ '/si/backends/' | relative_url }}) බලන්න.
