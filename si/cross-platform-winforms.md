---
layout: docs
lang: si
title: බහු-වේදිකා WinForms
subtitle: Windows Forms කේතය macOS සහ Linux මත ධාවනය කිරීම යනු කුමක්ද, එහි වියදම කුමක්ද, සහ Majorsilence.Forms එය කරන්නේ කෙසේද.
permalink: /si/cross-platform-winforms/
seo_title: "බහු-වේදිකා WinForms — Windows Forms macOS සහ Linux මත ධාවනය කරන්න"
description: >-
  WinForms ගැළපුම් ස්තරයක් මඟින් පවතින Windows Forms යෙදුම් macOS සහ Linux මත ධාවනය කරන්නේ
  කෙසේද — ගෘහ නිර්මාණය (architecture), එය ප්‍රතිස්ථාපනය කරන දේ, සහ එහි වියදම.
keywords:
  - cross platform winforms
  - WinForms බහු-වේදිකා
  - winforms linux
  - winforms mac
  - windows forms linux මත
  - winforms compatibility library
  - winforms alternative
  - .net cross platform gui
  - winforms gtk
priority: "0.9"
changefreq: weekly
---

**Windows Forms සැමවිටම Windows-සඳහා පමණක් වූ තාක්ෂණයකි.** `System.Windows.Forms` යනු Win32 කවුළු පන්ති (window classes) සහ GDI+ මත ඇති managed ආවරණයකි — `HWND`, `WM_PAINT`, `user32.dll`. .NET ම ඕනෑම තැනක ධාවනය වුවද, එම assembly එක ලැබෙන්නේ Windows Desktop runtime එකේ පමණි. එබැවින් WinForms යෙදුමක් macOS හෝ Linux මත build කිරීමට හෝ ආරම්භ කිරීමට කිසිසේත් නොහැක. සම්පූර්ණ ගැටලුව එයයි. "අපේ WinForms යෙදුම බහු-වේදිකා (cross-platform) කරන්න" යන්නෙහි ඓතිහාසික අර්ථය "එය නැවත ලියන්න" වූයේ ඒ නිසාය.

Majorsilence.Forms අනෙක් මාර්ගය ගනී: **WinForms ක්‍රමලේඛන ආකෘතිය බහු-වේදිකා renderer එකක් මත නැවත ක්‍රියාත්මක කිරීම.** එකම පන්ති නම්, එකම properties, එකම events, එකම designer-generated කේතය — නමුත් යටින් ඇති කිසිවක් Win32 නොවේ.

```csharp
using Majorsilence.Forms;   // System.Windows.Forms වෙනුවට

public class MainForm : Form
{
    public MainForm ()
    {
        var button = new Button { Text = "Click me", Location = new Point (12, 12) };
        button.Click += (s, e) => MessageBox.Show ("Hello from Linux.");
        Controls.Add (button);
    }
}
```

එම ගොනුව තනි `net10.0` (හෝ `net8.0`) build එකකින් Windows, macOS සහ Linux මත compile වී ධාවනය වේ. `-windows` TFM එකක් නැත, Windows Desktop runtime එකක් නැත, Wine ද නැත. මූලික library එක `netstandard2.0` build එකක් ද ලබා දෙයි; Windows මත .NET Framework 4.8 යෙදුමකට ද එය ධාරකය (host) කළ හැක්කේ එලෙසිනි.

## WinForms ගැළපුම් ස්තරයක් සැබවින්ම ක්‍රියා කරන්නේ කෙසේද
{:#how-a-winforms-compatibility-layer-actually-works}

WinForms කේතය වෙනත් වේදිකාවකට ගෙන යාමට ප්‍රවේශ තුනක් ඇති අතර, ඒවා හැසිරෙන්නේ ඉතා වෙනස් ආකාරවලටය:

| ප්‍රවේශය | එය කුමක්ද | හුවමාරුව (trade-off) |
|---|---|---|
| **අනුකරණය (Emulation)** (Wine, Mono හි පැරණි `System.Windows.Forms`) | *වෙනස් නොකළ* WinForms assembly එකට යටින් Win32/GDI+ නැවත ක්‍රියාත්මක කිරීම | මූලාශ්‍ර කේත වෙනස්කම් ශුන්‍යයි, නමුත් ඔබට අතිවිශාල Win32 පෘෂ්ඨයක්, ස්වදේශීය නොවන හැසිරීමක්, සහ ඔබේ යෙදුම ක්‍රියාත්මක කර නැති යමක් ස්පර්ශ කරන මොහොතේම අවසන් වන සහාය කතාවක් උරුම වේ |
| **නැවත ලිවීම (Rewrite)** (WPF, .NET MAUI, Avalonia, වෙබ්) | UI එක වෙනත් ආකෘතියකින් නැවත ප්‍රකාශ කිරීම | සැබවින්ම නවීන ප්‍රතිඵලයක්, නමුත් සෑම තිරයක්ම නැවත ගොඩනැගීමේ සහ කණ්ඩායම නැවත පුහුණු කිරීමේ වියදමින් |
| **API-ගැළපෙන නැවත ක්‍රියාත්මක කිරීම** (Majorsilence.Forms) | WinForms *API* එක ගෙන යා හැකි (portable) renderer එකක් මත නැවත ගොඩනැගීම | යාන්ත්‍රික namespace වෙනසක් සමඟ මූලාශ්‍ර-මට්ටමේ ගැළපුම; `Control.Handle` සහ `WndProc` වැනි Win32 ගැලවීමේ මාර්ග ඔබට අහිමි වේ |

Majorsilence.Forms තුන්වැන්නයි. සෑම පාලකයක්ම (control) framework එක විසින්ම [SkiaSharp](https://github.com/mono/SkiaSharp) සමඟ අඳිනු ලැබේ — Chrome සහ Flutter පිටුපස ඇති එම GPU-වේගවත් කළ 2D එන්ජිමයි. එබැවින් `Button` එකක් desktop තුනේම එක සමානව පෙනෙන්නේත් හැසිරෙන්නේත්, එය තුනේම වචනාර්ථයෙන්ම එකම paint කේතය වන නිසාය.

## එක් රූප සටහනකින් ගෘහ නිර්මාණය
{:#the-architecture-in-one-diagram}

<div class="msf-diagram">        Your app  (Forms, controls, Designer files — the WinForms model you know)
            │
       Majorsilence.Forms  (controls + WinForms-compatible API, drawn with SkiaSharp)
            │
   Swappable host backend
   ├─ Avalonia   → Windows · macOS · Linux  (default)  · also Android · iOS · Browser
   ├─ Uno         → desktop · iOS · Android · WebAssembly
   ├─ GTK 4       → Linux-first real GTK window (gir.core), also Windows/macOS with the GTK runtime
   ├─ Terminal    → the form drawn in a terminal (Kitty graphics, Sixel or Unicode blocks)
   ├─ WinForms    → Windows-only migration bridge: embed in an existing WinForms app, port in steps
   ├─ WPF         → Windows-only migration bridge, same shape, for an existing WPF app
   └─ Headless    → offscreen rendering for tests / CI</div>

මූලික `Majorsilence.Forms` assembly එක **කිසිදු windowing toolkit එකකට** යොමු නොවේ — SkiaSharp වෙත පමණි. Backend (පසුබිම් ස්තරය) එකක සම්පූර්ණ කාර්යය වන්නේ ස්වදේශීය කවුළුවක් (හෝ terminal එකක්, හෝ කිසිවක් නැත) නිර්මාණය කිරීම, message loop එකක් ධාවනය කිරීම, ආදානය (input) ලබා දීම, සහ Skia පෘෂ්ඨයක් ඉදිරිපත් කිරීමයි. එකම යෙදුම් binary එකට අද desktop මත Avalonia ද, හෙට GTK 4, Uno හෝ WebAssembly ද ඉලක්ක කළ හැක්කේ එම සන්ධිය (seam) නිසාය — තවද Windows යෙදුමකට සංක්‍රමණය වන අතරතුර එහි පවතින WinForms හෝ WPF කවුළු තුළ එම පාලකයන්ම ධාරකය කළ හැක්කේ ද එබැවිනි. අතුරුමුහුණත් සහ ඔබේම backend එකක් එක් කරන ආකාරය සඳහා [වේදිකා backends]({{ '/si/backends/' | relative_url }}) බලන්න.

## එක් එක් වේදිකාවේදී ඔබට ලැබෙන දේ
{:#what-you-get-on-each-platform}

| වේදිකාව | තත්ත්වය | ධාරකය |
|---|---|---|
| Windows | සහාය දක්වයි, කිසිදු සැකසුමකින් තොරව | Avalonia (පෙරනිමි), Uno, හෝ GTK runtime ස්ථාපනය කර ඇති විට GTK 4 |
| Windows, පවතින WinForms හෝ WPF යෙදුමක් තුළ | සහාය දක්වයි — පියවරෙන් පියවර සංක්‍රමණය, වරකට එක් පාලකයක්; **.NET Framework 4.8** (`net48`) වෙතින් ද ධාරකය කරයි | `Majorsilence.Forms.WinForms` / `Majorsilence.Forms.Wpf` |
| macOS (Intel සහ Apple Silicon) | සහාය දක්වයි, කිසිදු සැකසුමකින් තොරව — [macOS මත WinForms]({{ '/si/winforms-on-macos/' | relative_url }}) බලන්න | Avalonia (පෙරනිමි), Uno, හෝ Homebrew හරහා GTK 4 |
| Linux (X11 / Wayland) | සහාය දක්වයි, කිසිදු සැකසුමකින් තොරව — [Linux මත WinForms]({{ '/si/winforms-on-linux/' | relative_url }}) බලන්න | Avalonia (පෙරනිමි, X11), GTK 4 (ස්වදේශීය Wayland/X11, Wayland මත තහවුරු කර ඇත), හෝ Uno |
| Terminal | ක්‍රියා කරයි, තවමත් නවකයි — xterm සහ WezTerm මත තහවුරු කර ඇත | `Majorsilence.Forms.Terminal`: පෝරමය terminal එක පුරා පිරී, Kitty graphics, Sixel, හෝ Unicode block glyphs ලෙස අඳිනු ලැබේ |
| WebAssembly / browser | ක්‍රියා කරයි, තවමත් නවකයි — [සජීවී ගැලරිය අත්හදා බලන්න]({{ '/gallery/' | relative_url }}); තිර කියවන (screen readers) වලට UI හි ARIA DOM පිළිබිඹුවක් පෙනේ | Avalonia Browser හෝ Uno Wasm |
| Android | මුල් අවධිය — සැබෑ උපාංගයක් මත මූලික පරීක්ෂණය සිදු කර ඇත (boot වීම, taps, render scaling, touch scroll දෘඩාංග මත තහවුරු කර ඇත); යතුරුපුවරුව, safe-area සහ භ්‍රමණය unit-test කර ඇත්තේ පමණි | Avalonia Android හෝ Uno |
| iOS | මුල් අවධිය — CI මඟින් සැබෑ head එක compile කර simulator smoke check එකක එය ආරම්භ කරයි, නමුත් කිසිවෙකු තවම එය අන්තර්ක්‍රියාකාරීව ධාවනය කර නැත | Avalonia iOS හෝ Uno |
| Headless / CI | සහාය දක්වයි | Headless backend, offscreen Skia |

## port කිරීමකදී ප්‍රතිස්ථාපනය කළ යුතු Windows-පමණක් APIs
{:#the-windows-only-apis-a-port-has-to-replace}

පාලකයන් ගෙන යා හැකි කිරීම කාර්යයෙන් අඩක් පමණි. සැබෑ WinForms යෙදුමක් වෙනත් Windows-පමණක් stacks මතද රඳා පවතින අතර, ඒ සෑම එකකටම මෙහි බහු-වේදිකා පිළිතුරක් ඇත:

- **`System.Drawing.Common` (GDI+)** .NET 7 සිට Windows-පමණක් වී ඇත. `Majorsilence.Forms.Drawing.Common` යනු එහි Skia-පදනම් වූ නැවත ක්‍රියාත්මක කිරීමකි — `Bitmap`, `Font`, `Pen`, `Brush`, `Icon`, `Region`, `StringFormat`, `Drawing2D`, `Imaging`, EMF/WMF metafile playback පවා. අගය වර්ග (`Color`, `Point`, `Size`, `Rectangle`) හිතාමතාම නැවත ක්‍රියාත්මක කර *නැත*; ඒ වෙනුවට සැබෑ, දැනටමත් ගෙන යා හැකි `System.Drawing.Primitives` වර්ග භාවිත කරයි, එබැවින් ඒවා .NET හි අනෙක් සියල්ල සමඟ interop වේ.
- **මුද්‍රණය (Printing)** `Majorsilence.Forms.Printing.PrintDocument` හරහා සිදු වේ. එය එම Skia pipeline එකෙන්ම පිටු විදැහුම් කර (render), OS මුද්‍රණ driver එකක් සමඟ කතා කරනවා වෙනුවට PDF එකක් නිපදවයි. එය නිර්මාණයෙන්ම වේදිකා-ස්වාධීන ආදේශකයකි, නිම නොකළ OS-අනුව හිඩැසක් නොවේ.
- **දෘශ්‍ය මෝස්තර (uxtheme).** WinForms `Application.EnableVisualStyles()` හරහා OS තේමා එන්ජිමෙන් එහි පෙනුම ණයට ගනී; මෙහි එම ඇමතුම no-op (කිසිවක් නොකරයි) වන අතර, පෙනුම පැමිණෙන්නේ framework එකේම තේමාවෙනි. තේමා යනු සරල CSS ගොනු ය — වර්ණ සහ අකුරු සඳහා tokens සහ පාලක-අනුව නීති සහිත ලේඛනගත උප කුලකයක් — එබැවින් එක් sheet එකක් සෑම OS එකකම යෙදුමට එක සමාන මෝස්තරයක් ලබා දෙන අතර, ගොඩනැගූ `Default` තේමාව OS හි light/dark මනාපය අනුගමනය කරයි. [CSS සමඟ තේමාකරණය]({{ site.github_url }}/blob/main/docs/theming.md) බලන්න.

## එහි වියදම
{:#what-it-costs}

විශේෂාංග ලැයිස්තුවකට වඩා හුවමාරුව ගැන අවංක වීම වඩා ප්‍රයෝජනවත්ය:

- **`Control.Handle` යනු `IntPtr.Zero` වේ.** මෙහි පාලකයක් යනු OS කවුළුවක් නොව canvas එකක් මත paint මෙහෙයුම් ය, එබැවින් ලබා දීමට `HWND` එකක් නැති අතර framework එක එකක් නිර්මාණය කිරීම ප්‍රතික්ෂේප කරයි. කවුළු-මට්ටමේ handles සැබෑ *වේ* (`HWND`/`NSWindow`/`XID`, සහ WinForms backend එකේ සැබෑ HWND එකක්). [ස්වදේශීය interop]({{ '/si/native-interop/' | relative_url }}) බලන්න.
- **`WndProc` නැත, පාලකයන්ට එරෙහිව Win32 P/Invoke නැත.** පණිවිඩ-පදනම් උපක්‍රම සැබෑ APIs වලට එරෙහිව නැවත ලිවිය යුතුය.
- **Browser එකක හෝ දුරකථනයක අවහිර කරන (blocking) සංවාද කවුළු නොපවතී.** Browser, Android සහ iOS ඉලක්කවල ධාරකයට කැදැලි message loop එකක් නැත, එබැවින් `Form.ShowDialog`, `MessageBox.Show` සහ ගොනු තෝරන්නන් කිසිවක් පෙන්වීමට පෙර `PlatformNotSupportedException` විසි කරයි — async සහෝදරයාගේ නම සඳහන් කරමින්. `ShowDialogAsync`, `MessageBox.ShowAsync` සහ ඒ ආශ්‍රිත ඒවා සෑම තැනකම ක්‍රියා කරන අතර, මූලික පැකේජයේ ඇතුළත් Roslyn analyzer එකක් (`MFB001`–`MFB003`, කේත නිවැරදි කිරීම් සමඟ) එම ඉලක්කවල අවහිර කරන ඇමතුම් සලකුණු කරයි. Desktop යෙදුම්වලට ඒවායේ අවහිර කරන ඇමතුම් තබා ගත හැක.
- **ඛණ්ඩාංක තාර්කික ඒකක වේ, උපාංග පික්සල නොවේ.** `Width`, `Bounds`, `ClientRectangle`, මූසික ස්ථාන සහ paint canvas යන සියල්ල තාර්කික ඒකකවලින් ය; framework එක සංදර්ශකයට පරිමාණනය කරයි. DPI සාධකයෙන් තමන්ගේම `ScaleTransform` එකක් කළ custom-painted පාලකයන් එය ඉවත් කළ යුතු අතර, උපාංග පික්සල `ScaledBounds`, `PaintEventArgs.Scaling` සහ `LogicalToDeviceUnits` හරහා ලබා ගත හැක.
- **ආවරණය 100% නොවේ.** ව්‍යාපෘතිය බීටා අවධියේ ඇත. ක්‍රියාත්මක නොකළ සාමාජිකයන් exception විසි කරනවා වෙනුවට හිතාමතාම no-op වේ හෝ සාධාරණ පෙරනිමි අගයක් ආපසු දෙයි, එබැවින් සංක්‍රමණය කළ කේතය compile වී *ධාවනය ද වේ* — එයින් අදහස් වන්නේ හිඩැසක් නිහඬ විය හැකි බවද ය. [ගැළපුම් matrix එක]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) පාලකයෙන් පාලකයට සැබෑ දේ, ආසන්න කළ දේ, සහ විෂය පථයෙන් පිටත දේ නිරීක්ෂණය කරයි.
- **ස්වදේශීය WinForms සමඟ පික්සලයට-සමාන විදැහුම්කරණය ඉලක්කයක් නොවේ.** පාලකයන් Skia මඟින් තේමා කර අඳිනු ලැබේ; ඒවා එක් එක් OS හි ස්වදේශීය widgets වලට ගැළපෙනවා වෙනුවට වේදිකා හරහා ස්ථාවරව පෙනේ. එක් හිතාමතා ව්‍යතිරේකයක්: WinForms යෙදුමක් කරන ආකාරයටම `Application.SetDefaultFont` සමඟ අකුර තෝරන port කළ යෙදුමකට, Windows 11 තේමාව යටතේ WinForms අඳින ආකාරයටම push buttons සහ check/radio glyphs අඳිනු ලැබේ, එබැවින් පැත්තකින් පැත්තට සංක්‍රමණයක් නිෂ්පාදන දෙකක් මෙන් නොපෙනේ.

## ඊළඟට යා යුත්තේ කොහේද
{:#where-to-go-next}

- **[ආරම්භ කිරීම]({{ '/si/getting-started/' | relative_url }})** — මිනිත්තු කිහිපයකින් ධාවනය වන යෙදුමක්.
- **[පවතින WinForms යෙදුමක් සංක්‍රමණය කරන්න]({{ '/si/migration/' | relative_url }})** — `majorsilence-migrate` CLI එක ඔබ වෙනුවෙන් යාන්ත්‍රික නැවත ලිවීම සිදු කරයි.
- **[WinForms විකල්ප සංසන්දනය]({{ '/si/winforms-alternatives/' | relative_url }})** — මෙය .NET MAUI, Avalonia, Uno Platform, Eto.Forms සහ Wine වලින් වෙනස් වන්නේ කෙසේද.
- **[නිතර අසන ප්‍රශ්න (FAQ)]({{ '/si/faq/' | relative_url }})** — මුලින්ම එන ප්‍රශ්නවලට කෙටි පිළිතුරු.
