---
layout: docs
lang: si
title: Linux මත WinForms
subtitle: Windows Forms කේත පදනමක් Ubuntu, Fedora, Debian සහ ඒ ආශ්‍රිත distributions මත ධාවනය කිරීම — ක්‍රියා කරන දේ, අවධානය යොමු කළ යුතු දේ, සහ එය බෙදා හරින ආකාරය.
permalink: /si/winforms-on-linux/
seo_title: "WinForms Linux මත ධාවනය කරන්නේ කෙසේද — බහු-වේදිකා Windows Forms"
description: >-
  Windows Forms හට Linux මත ධාවනය විය නොහැකි අතර Mono හි port එක බොහෝ කලකට පෙර නැති වී ගොස් ඇත.
  Majorsilence.Forms ඔබේ WinForms යෙදුම Ubuntu, Fedora සහ Debian මත ස්වදේශීයව build කර ධාවනය කරන්නේ
  කෙසේද — Avalonia කවුළුවක, සැබෑ GTK 4 කවුළුවක, හෝ terminal එකක.
keywords:
  - winforms linux
  - WinForms Linux මත
  - windows forms linux
  - run winforms on ubuntu
  - c# winforms linux
  - system.windows.forms linux
  - winforms gtk
  - winforms wayland
  - winforms terminal
priority: "0.9"
---

## සාමාන්‍ය WinForms හට එය කළ නොහැක්කේ ඇයි
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` ලැබෙන්නේ **Windows Desktop** runtime එකේ පමණි. Linux මත resolve කිරීමට `Microsoft.WindowsDesktop.App` shared framework එකක් නැත, එබැවින් `net10.0-windows` ව්‍යාපෘතියක් ධාවනය වීමට අසමත් වනවා පමණක් නොවේ — `dotnet build` එය ප්‍රතික්ෂේප කරයි. Assembly එක `user32.dll` සහ GDI+ මත ඇති ආවරණයක් වන අතර, ඒ දෙකම මෙහි නොපවතී.

මිනිසුන් සාමාන්‍යයෙන් උත්සාහ කරන දේවල් තුන:

- **Mono හි `System.Windows.Forms`.** සැබෑ නැවත ක්‍රියාත්මක කිරීමකි, පැරණි forum threads මෙය ක්‍රියා කරන බව පවසන්නේ එබැවිනි. එය .NET Framework යුගය සඳහා ගොඩනගා තිබූ අතර, කිසි දිනෙක නවීන .NET වෙත ගෙන නොගිය අතර, අද ඔබට අනුගත කළ හැකි ඉලක්කයක් නොවේ.
- **Wine.** Windows binary එක port කරනවා වෙනුවට එය ධාවනය කරයි. තාවකාලික විසඳුමක් ලෙස භාවිත කළ හැක; එයින් අදහස් වන්නේ Windows executable එකක් සහ ගැළපුම් runtime එකක් බෙදා හැරීම, ආසන්න ධාරක ඒකාබද්ධතාවයක් සමඟිනි.
- **Linux මත `System.Drawing.Common`.** UI නොවන ඇඳීමේ කේතය සඳහා පවා මෙය තවදුරටත් විකල්පයක් නොවේ: .NET 7 සිට, දැන් ඉවත් කර ඇති ගැළපුම් switch එකක් සකසා නොමැති නම්, එය Windows නොවන වේදිකාවල `PlatformNotSupportedException` විසි කරයි.

## ඒ වෙනුවට Majorsilence.Forms කරන්නේ කුමක්ද
{:#what-majorsilenceforms-does-instead}

එය SkiaSharp මත WinForms API එක නැවත ක්‍රියාත්මක කර, backend (පසුබිම් ස්තරය) එකක් සපයන කවුළුවක එය ධාරකය කරයි. Linux මත, එකම යෙදුම් කේතයෙන්ම, ඔබට තෝරා ගැනීමට ධාරක (hosts) තුනක් ඇත:

- **Avalonia** (පෙරනිමි) — සාමාන්‍ය X11 යෙදුමක්: ඔබේ window manager එකේ සැබෑ කවුළුවක්, සැබෑ ආදානය, ලබා ගත හැකි තැන්වල GPU compositing. Wayland sessions වලදී XWayland යටතේ ධාවනය වේ.
- **GTK 4** (`Majorsilence.Forms.Gtk4`) — [gir.core](https://github.com/gircore/gir.core) bindings හරහා සැබෑ `Gtk.Window` එකක්, Wayland සහ X11 මත ස්වදේශීය. පැහැදිලිවම තෝරා ගත යුතුය; විස්තර [පහතින්](#gtk4).
- **Terminal** (`Majorsilence.Forms.Terminal`) — terminal emulator එකක අඳින ලද පෝරමය, display server එකක් අවශ්‍ය නැත; විස්තර [පහතින්](#terminal).

ඔබ කුමක් තෝරා ගත්තද එය කොතැනකවත් `-windows` suffix එකක් නොමැති සාමාන්‍ය `net10.0` (හෝ `net8.0`) build එකකි.

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

.NET SDK ස්ථාපනය කර ඇති සාමාන්‍ය Ubuntu පරිගණකයක සම්පූර්ණ සැකසුම එයයි. සැකිල්ල (template) බෙදාගත් UI library එකක් සහ Avalonia backend එක මත desktop head එකක් නිපදවයි; එකම මූලාශ්‍ර කේතය වෙනස් නොකර Windows සහ macOS මත build වී ධාවනය වේ.

## Linux මත සැබවින්ම ක්‍රියා කරන දේ
{:#what-actually-works-on-linux}

| ක්ෂේත්‍රය | Linux මත |
|---|---|
| කවුළු, ආදානය, HiDPI | ස්වදේශීය. Avalonia backend එක X11 භාවිත කරයි (Wayland session එකකදී XWayland). GTK 4 backend එක ස්වදේශීය Wayland/X11 වේ — Wayland මත තහවුරු කර ඇත — නමුත් GTK හි පූර්ණ සංඛ්‍යා පරිමාණ සාධකය භාවිත කරයි, එබැවින් දැනට 1.25×/1.5× සංදර්ශක 1× ලෙස විදැහුම් කර compositor එකට upscale කිරීමට ඉඩ දෙයි |
| විදැහුම්කරණය (Rendering) | SkiaSharp, GPU-වේගවත් කළ — Windows සහ macOS හි එකම paint කේතය, එබැවින් පාලකයන් එක සමානව පෙනේ |
| අකුරු සහ පෙළ | SkiaSharp fontconfig හරහා පද්ධති අකුරු resolve කරයි; `Majorsilence.Forms.Drawing.Common` fallback කට්ටලයක් ද ඇතුළත් කරයි, එබැවින් අකුරු ස්ථාපනය කර නැති අවම image එකක පවා පෙළ විදැහුම් වේ |
| GDI+ / `System.Drawing` කේතය | `Majorsilence.Forms.Drawing` මඟින් ප්‍රතිස්ථාපනය කර ඇත — `Bitmap`, `Font`, `Pen`, `Brush`, `Region`, `Drawing2D`, `Imaging`, සහ EMF/WMF playback |
| පොදු සංවාද කවුළු | `OpenFileDialog`, `SaveFileDialog`, `FolderBrowserDialog`, `ColorDialog`, `FontDialog` Avalonia backend එකේ ස්වදේශීය සංවාද කවුළු හරහා ක්‍රියා කරයි. GTK 4 මත ස්වදේශීය ගොනු තෝරන්නන් තවම සම්බන්ධ කර නැත, එබැවින් ඒ වෙනුවට framework එකේම fallback සංවාද කවුළු දිස් වේ |
| මුද්‍රණය | `PrintDocument` මුද්‍රණ driver එකකට නොව Skia හරහා PDF වෙත විදැහුම් කරයි — සෑම OS එකකම එක සමානයි |
| WebView පාලකයන් | Desktop backends දෙකෙහිම සැබෑ WebKitGTK — Avalonia මත `Avalonia.Controls.WebView` හරහා, සහ GTK 4 මත සෘජුවම WebKitGTK 6.0 (`libwebkitgtk-6.0` ස්ථාපනය කර තිබිය යුතුය; `IsWebViewFunctional` ඔබට එය කියයි) |
| ශබ්දය | OS උපයෝගිතාව (`paplay`/`aplay`) හරහා වාදනය වේ |
| ආරක්ෂිත ගබඩාව සහ කථනය | `Majorsilence.Forms.Essentials`: `SecureStorage` `secret-tool` හරහා Secret Service භාවිත කරයි (keyring daemon එකක් හෝ `libsecret-tools` නොමැති නම් `IsSupported` false වේ, කිසි විටෙක plaintext fallback එකක් නොවේ); `Speech` `espeak`/`espeak-ng` භාවිත කරයි |
| තේමා | CSS තේමා ගොනු අන් සෑම තැනකම මෙන් මෙහිද ක්‍රියා කරයි; `BuiltInTheme.Default` OS හි light/dark මනාපය අනුගමනය කරයි |
| ස්වදේශීය කවුළු handle | Avalonia මත `WindowBase.PlatformHandle` හරහා සැබෑ X11 `XID` එකක් (*පාලක*-අනුව handles සෑම තැනකම `IntPtr.Zero` වේ — [ස්වදේශීය interop]({{ '/si/native-interop/' | relative_url }}) බලන්න). GTK 4 මත, `NativeControlHost` ඔබේ පෝරමය තුළ සැබෑ `Gtk.Widget` එකක් "airspace" ගැටලුවකින් තොරව ආවරණය කරයි, මන්ද GTK 4 සියල්ල එක් render tree එකකට composite කරන බැවිනි |
| UI Automation / තිර කියවන | තවමත් Windows-පමණක් (`Majorsilence.Forms.WindowsUIAutomation`); AT-SPI පාලමක් roadmap එකේ ඇත, සම්බන්ධ කර නැත. Browser build එක තිර කියවන වලට ARIA DOM පිළිබිඹුවක් නිරාවරණය කරයි. Backend-ස්වාධීන [ස්වයංක්‍රීයකරණ ගසය]({{ '/si/automation/' | relative_url }}) කෙසේ වෙතත් Linux මත පරීක්ෂණ, Selenium සහ MCP server එක මෙහෙයවයි |
| `Majorsilence.Forms.WindowsFormsInterop`, `.WinForms`, `.Wpf` | අර්ථ දැක්වීම අනුවම Windows-පමණක් — ඒවා මෙහි නොපවතින සැබෑ `System.Windows.Forms`/WPF කවුළු ධාරකය කරයි |

## GTK 4 backend එක
{:#gtk4}

ඔබට Avalonia කවුළුවක් වෙනුවට සැබෑ GTK කවුළුවක් අවශ්‍ය නම් — GNOME desktop එකක් සඳහා, ස්වදේශීය Wayland සඳහා, හෝ කාවැද්දීමට (embed) ඔබට දැනටමත් `Gtk.Application` එකක් ඇති නිසා — GTK 4 backend එකට යොමු කර `Application.Run` ට පෙර එය තෝරන්න:

```bash
dotnet add package Majorsilence.Forms
dotnet add package Majorsilence.Forms.Gtk4
```

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // GTK 4 backend එක ස්ථාපනය කරයි (නැතහොත් Avalonia පෙරනිමියයි)
Application.Run (new MainForm ());      // GLib main loop
```

පරිගණකයට GTK 4 ම අවශ්‍යයි: Debian/Ubuntu මත `libgtk-4-1`, Fedora/Arch මත `gtk4`. `WebBrowser` සහ webview-පදනම් compat පාලකයන් සඳහා, WebKitGTK 6.0 එක් කරන්න (Debian/Ubuntu මත `libwebkitgtk-6.0-4`, Fedora මත `webkitgtk6.0`, Arch මත `webkitgtk`). කාවැද්දීම දෙපැත්තටම ක්‍රියා කරයි — `myControl.ToGtkWidget ()` / `myForm.ToGtkWindow ()` Majorsilence.Forms අන්තර්ගතය පවතින GTK යෙදුමක් තුළ තබයි, සහ `ShowDialog` හට සැබෑ transient-for, modal කවුළුවක් ලැබේ.

දන්නා සීමා, බොහෝ දුරට ඉතිරි වැඩ නොව GTK 4 API ඉවත් කිරීම් ය: `Form.Location` යනු window manager එකට නොසලකා හැරිය හැකි ඉඟියකි (GTK 4 client-side positioning ඉවත් කළේය), `SetIcon(byte[])` no-op වේ (GTK 4 icons තේමා කළ නම් වේ), ගොනු තෝරන්නන් framework එකේම සංවාද කවුළු වෙත fallback වේ, පරිමාණනය පූර්ණ සංඛ්‍යා පමණි, සහ backend එක AOT-විශ්ලේෂණය කර නැත. සම්පූර්ණ ලැයිස්තුව [GTK 4 backend ලේඛනයේ]({{ site.github_url }}/blob/main/docs/backends.md#the-gtk-4-backend) ඇත.

## Terminal backend එක
{:#terminal}

`Majorsilence.Forms.Terminal` එකම පෝරමය terminal emulator එකක් තුළ ධාවනය කරයි — terminal එකක් ඇති ඕනෑම තැනක, tmux/screen හෝ SSH session එකක් ඇතුළුව, display server එකකින් තොරව. පෝරමය සාමාන්‍ය Skia pipeline එකෙන් විදැහුම් කර, terminal එක සහාය දක්වන තැන්වල terminal එකේ සැබෑ පික්සල විභේදනයෙන් Kitty graphics හෝ Sixel ලෙසත්, අන් සෑම තැනකම Unicode block glyphs (cell එකකට 2×4 sub-pixels) ලෙසත් පෙන්වනු ලැබේ; ප්‍රකාරය සහ 24-bit වර්ණ terminal එකෙන් විමසා සොයා ගන්නා අතර, `MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` එකක් ස්ථිර කරයි. මූසිකය සහ යතුරුපුවරුව ක්‍රියා කරයි, ලබා දෙන තැන්වල Kitty keyboard protocol එක භාවිත වේ, සහ Ctrl+C සැමවිටම පිටවෙයි.

එය දුරකථනයක් මෙන් තනි-දර්ශන ධාරකයකි: පෝරමය title bar එකකින් තොරව terminal එක පුරා පිරේ. එය xterm සහ WezTerm මත තහවුරු කර ඇත; kitty, Ghostty, foot, iTerm2 සහ Windows Terminal තවම පරීක්ෂා කර නැත. ස්වදේශීය ගොනු තෝරන්නන්, `NativeControlHost` සහ web views සඳහා terminal සමානයක් නැත. `samples/Gallery.Terminal` සහ [Terminal README]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Terminal/README.md) බලන්න.

## Deployment සටහන්
{:#deployment-notes}

අමුතු කිසිවක් නැත — එය සාමාන්‍ය .NET යෙදුමකි:

```bash
dotnet publish -c Release -r linux-x64 --self-contained
```

දැනගත යුතු කරුණු තුනක්:

- **ස්වදේශීය Skia binary.** `SkiaSharp.NativeAssets.Linux` හි `libSkiaSharp.so` ඇති අතර, එය fontconfig වෙත link වේ. Desktop distributions වල එය දැනටමත් ඇත; සිහින් container images වලට සාමාන්‍යයෙන් `libfontconfig1` (Debian/Ubuntu) හෝ `fontconfig` (Fedora/Alpine) පැහැදිලිවම එක් කළ යුතුය.
- **GTK runtime (GTK 4 backend එකට පමණි).** ඔබේ installer හෝ පැකේජය `libgtk-4-1` (Debian/Ubuntu) හෝ `gtk4` (Fedora/Arch) මත රඳා පැවතිය යුතු අතර, ඔබ `WebBrowser` භාවිත කරන්නේ නම් `libwebkitgtk-6.0-4`/`webkitgtk6.0` ද අවශ්‍යයි. Avalonia backend එකට එවැනි පරායත්තතාවයක් නැත.
- **Headless පරිසර.** සංදර්ශකයක් නොමැති CI, servers සහ containers සඳහා, desktop backend එකක් වෙනුවට `Majorsilence.Forms.Headless` වෙත යොමු කර offscreen විදැහුම් කරන්න — Xvfb නැත, display server එකක් නැත. මෙම ව්‍යාපෘතියේම පරීක්ෂණ කට්ටලය ධාවනය වන්නේ එලෙසිනි. [ස්වයංක්‍රීයකරණය සහ UI පරීක්ෂණ]({{ '/si/automation/' | relative_url }}) බලන්න.

## Linux මත තහවුරු කර ඇත
{:#verified-on-linux}

[`Explorer`]({{ '/si/samples/' | relative_url }}) නිදසුන — Windows Explorer ක්ලෝනයක් — Ubuntu මත ධාවනය වේ, සම්පූර්ණ [පාලක ගැලරිය]({{ '/si/samples/' | relative_url }}) එහි Avalonia backend එක මත ධාවනය වේ, `Gallery.Gtk4` Wayland මත විදැහුම් කිරීම, ආදානය හැසිරවීම සහ WebKitGTK පූරණය කිරීම තහවුරු කර ඇත, සහ `Gallery.Terminal` xterm සහ WezTerm තුළ ධාවනය කර ඇත:

![Ubuntu මත ධාවනය වන Explorer නිදසුන]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

## ඊළඟට
{:#next}

- [ආරම්භ කිරීම]({{ '/si/getting-started/' | relative_url }}) — පළමු යෙදුම, සැකිල්ලකින් හෝ මුල සිට.
- [පවතින WinForms යෙදුමක් සංක්‍රමණය කරන්න]({{ '/si/migration/' | relative_url }}) — ස්වයංක්‍රීය නැවත ලිවීම, `-windows` TFM එක සහ `System.Drawing.Common` යොමුව ඉවත් කිරීම ද ඇතුළුව.
- [වේදිකා backends]({{ '/si/backends/' | relative_url }}) — Avalonia, GTK 4, Terminal සහ අනෙක් ඒවා.
- [macOS මත WinForms]({{ '/si/winforms-on-macos/' | relative_url }}) — Apple දෘඩාංග මත එම කතාවම.
- [බහු-වේදිකා WinForms]({{ '/si/cross-platform-winforms/' | relative_url }}) — ගෘහ නිර්මාණය සහ එහි හුවමාරු.
