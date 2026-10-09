---
layout: docs
lang: si
title: macOS මත WinForms
subtitle: Windows Forms කේත පදනමක් Apple Silicon සහ Intel Mac පරිගණක මත ධාවනය කිරීම — ක්‍රියා කරන දේ, වෙනස් ලෙස දැනෙන දේ, සහ .app එකක් බෙදා හරින ආකාරය.
permalink: /si/winforms-on-macos/
seo_title: "WinForms macOS මත ධාවනය කරන්නේ කෙසේද — බහු-වේදිකා Windows Forms"
description: >-
  Windows Forms කිසි දිනෙක Mac එකක ධාවනය වී නැත. Majorsilence.Forms ඔබේ WinForms යෙදුම Apple Silicon
  සහ Intel මත ස්වදේශීයව ධාවනය කරන්නේ කෙසේද — සහ .app bundle එකක් බෙදා හැරීම.
keywords:
  - winforms mac
  - WinForms macOS මත
  - windows forms macos
  - run winforms on macos
  - c# winforms mac
  - winforms apple silicon
  - system.windows.forms macos
  - .net gui framework mac
  - winforms dark mode mac
priority: "0.9"
---

## සාමාන්‍ය WinForms හට එය කළ නොහැක්කේ ඇයි
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` පවතින්නේ Windows Desktop runtime එකේ වන අතර එය `user32.dll` සහ GDI+ ආවරණය කරයි. එහි macOS build එකක් නැත, කිසි දිනෙක තිබුණේ ද නැත — `net10.0-windows` ව්‍යාපෘතියක් Mac එකක build වන්නේවත් නැත. සුපුරුදු විසඳුම් මාර්ග ද සාර්ථක නොවේ: Mono හි WinForms port එක කිසි දිනෙක නවීන .NET වෙත පැමිණියේ නැත, .NET 7 සිට `System.Drawing.Common` Windows නොවන වේදිකාවල `PlatformNotSupportedException` විසි කරයි, තවද යෙදුම Windows VM එකක් හෝ CrossOver යටතේ ධාවනය කිරීමෙන් අදහස් වන්නේ ඔබ තවමත් Windows යෙදුමක් බෙදා හරින බවයි.

## ඒ වෙනුවට Majorsilence.Forms කරන්නේ කුමක්ද
{:#what-majorsilenceforms-does-instead}

එය SkiaSharp මත WinForms API එක නැවත ක්‍රියාත්මක කර, Avalonia හරහා සැබෑ `NSWindow` එකක එය ධාරකය (host) කරයි. සාමාන්‍ය `net10.0` build එකක් — `-windows` TFM එකක් නොමැතිව — **Apple Silicon (arm64) සහ Intel (x64)** Mac පරිගණක මත ස්වදේශීයව ආරම්භ වන යෙදුමක් නිපදවයි.

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

සැකිල්ල (template) බෙදාගත් UI library එකක් සහ desktop head එකක් නිපදවයි; එකම මූලාශ්‍ර කේතය වෙනස් නොකර Windows සහ Linux මත build වේ.

## macOS මත සැබවින්ම ක්‍රියා කරන දේ
{:#what-actually-works-on-macos}

| ක්ෂේත්‍රය | macOS මත |
|---|---|
| කවුළු සහ ආදානය | Avalonia backend එක හරහා ස්වදේශීය `NSWindow`, සම්මත macOS traffic-light chrome සහ ස්වදේශීය drag/resize සමඟ |
| Apple Silicon | ස්වදේශීය arm64 — `osx-arm64` සහ `osx-x64` දෙකම සාමාන්‍ය publish ඉලක්ක වේ |
| විදැහුම්කරණය (Rendering), Retina | SkiaSharp, GPU-වේගවත් කළ සහ HiDPI-දැනුවත් — Windows සහ Linux හි එකම paint කේතය |
| අකුරු සහ පෙළ | SkiaSharp මඟින් CoreText හරහා resolve කරයි, නැති ඕනෑම දෙයක් සඳහා ඇතුළත් fallback කට්ටලයක් සමඟ |
| GDI+ / `System.Drawing` කේතය | `Majorsilence.Forms.Drawing` මඟින් ප්‍රතිස්ථාපනය කර ඇත — `Bitmap`, `Font`, `Pen`, `Brush`, `Region`, `Drawing2D`, `Imaging`, EMF/WMF playback |
| පොදු සංවාද කවුළු | Backend එක හරහා ස්වදේශීය open/save/folder/colour/font සංවාද කවුළු |
| මුද්‍රණය | `PrintDocument` Skia හරහා PDF වෙත විදැහුම් කරයි, සෑම OS එකකම එක සමානව |
| WebView පාලකයන් | සැබෑ `WKWebView`, inline PDF විදැහුම්කරණය ඇතුළුව |
| ශබ්දය | `afplay` හරහා වාදනය වේ |
| ආරක්ෂිත ගබඩාව සහ කථනය | `Majorsilence.Forms.Essentials`: `SecureStorage` Keychain Services වෙත ලියයි, `Speech` පද්ධතියේ `say` හඬ භාවිත කරයි; දෙකම `IsSupported` වාර්තා කරන අතර exception විසි කරනවා වෙනුවට no-ops (කිසිවක් නොකරයි) බවට පහත වැටේ |
| තේමා සහ dark mode | තේමා යනු CSS ගොනු ය (ලේඛනගත උප කුලකයක්); `BuiltInTheme.Default` OS හි light/dark පෙනුම අනුගමනය කරන අතර, `Theme.SetBuiltInTheme`/`Theme.ApplyTheme` runtime එකේදී මාරු කරයි. [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) නිදසුන පෙරදසුනක් සහිත සජීවී CSS සංස්කාරකයක් වන අතර, පෙර-ගොඩනැගූ binaries GitHub Releases වෙත අමුණා ඇත |
| Trackpad අභිනයන් (gestures) | `Pinch`, `Swipe`, `LongPress` සහ momentum `ScrollGesture` පළමු-පෙළ events වේ; `ScrollableControl` දැනටමත් ඒවා යොදන බැවින්, `Panel`/`ListBox`/`TreeView` යෙදුම් වෙනස්කම් කිසිවකින් තොරව pan වේ |
| ස්වදේශීය කවුළු handle | `WindowBase.PlatformHandle` හරහා සැබෑ `NSWindow` pointer එකක් (*පාලක*-අනුව handles සෑම තැනකම `IntPtr.Zero` වේ — [ස්වදේශීය interop]({{ '/si/native-interop/' | relative_url }}) බලන්න) |
| Uno backend | ඔබ Uno තුළ ධාරකය කිරීමට කැමති නම්, එයටද සහාය දක්වන අතර macOS මත සම්පූර්ණ පෝරමයක් boot කර විදැහුම් කිරීම තහවුරු කර ඇත |
| GTK 4 backend | Homebrew වෙතින් ලැබෙන GTK runtime එක (`brew install gtk4`) සමඟ macOS මත compile වී ධාවනය වේ — Linux-first backend එකක්, එබැවින් AppKit කවුළුවක් නොව GTK කවුළුවක් අපේක්ෂා කරන්න; ප්‍රධාන වශයෙන් Mac එකක GTK head එක පරීක්ෂා කිරීමට ප්‍රයෝජනවත් |

## එය Mac-ශෛලියට අනුකූල නොවන ලෙස දැනෙන තැන්
{:#where-it-will-feel-un-mac-like}

Design review එකකට පෙර දැනගැනීම වටී, මන්ද මේවා bugs නොව ගැළපුම් ආකෘතියේ ප්‍රතිඵල වේ:

- **Menu bar එක කවුළුව තුළ ඇත.** `MenuStrip` යනු WinForms එය අඳින ආකාරයටම, පෝරමය තුළ ඉහළට dock කළ සැබෑ තීරුවකි — එය තිරයේ ඉහළ ඇති macOS ගෝලීය menu bar එක මතට ප්‍රක්ෂේපණය නොකෙරේ.
- **පාලකයන් අඳිනු ලැබේ, ස්වදේශීය නොවේ.** `Button` එකක් යනු framework එක මඟින් තේමා කළ Skia paint කේතයකි, එබැවින් එය AppKit වලට නොව Windows සහ Linux මත ඔබේ යෙදුමට ගැළපේ. වේදිකා හරහා ස්ථාවරත්වය සහ එක් එක් වේදිකාවේ ස්වදේශීය පෙනුම සැබවින්ම ප්‍රතිවිරුද්ධ ඉලක්ක වේ; මෙම ව්‍යාපෘතිය පළමුවැන්න තෝරා ගනී. CSS තේමාකරණය මඟින් Mac වර්ණ තලයකට සහ අකුරු ශෛලියකට සමීප වීමට ඉඩ සලසයි, නමුත් එය තවමත් AppKit හි නොව ඔබේ තේමාවයි.
- **Windows සම්ප්‍රදායන් කේතය සමඟම ගමන් කරයි.** යතුරුපුවරු කෙටිමං, සංවාද කවුළු බොත්තම් පිළිවෙළ සහ කවුළු-වසා දැමීමේ අර්ථ ශාස්ත්‍රය ඔබේ පවතින WinForms නිර්මාණයෙන් පැමිණේ. ඒවා macOS පුරුදුවලට අනුගත කිරීම යෙදුම්-මට්ටමේ කාර්යයකි.
- **UI Automation පාලමක් නැත.** තිර කියවන (screen-reader) සහාය (`Majorsilence.Forms.WindowsUIAutomation`) අද Windows-පමණක් ය; `NSAccessibility` පාලමක් roadmap එකේ ඇත, සම්බන්ධ කර නැත. Backend-ස්වාධීන [ස්වයංක්‍රීයකරණ ගසය]({{ '/si/automation/' | relative_url }}) තවමත් macOS මත පරීක්ෂණ, Selenium සහ MCP server එක මෙහෙයවයි.

## `.app` එකක් බෙදා හැරීම
{:#shipping-a-app}

ඇසුරුම් කිරීම (packaging) ඕනෑම Avalonia හෝ .NET desktop යෙදුමක් සඳහා මෙන්ම වේ — framework එක අමතර පියවර කිසිවක් එක් නොකරයි:

```bash
dotnet publish -c Release -r osx-arm64 --self-contained
```

එතැන් සිට, සම්මත macOS කාර්යයන් අදාළ වේ: publish කළ ප්‍රතිදානය `Info.plist` එකක් සහ `.icns` එකක් සමඟ `YourApp.app/Contents/MacOS` bundle පිරිසැලසුමකට ඔතා, ඉන්පසු එය `codesign` කර, ඔබ App Store එකෙන් පිටත බෙදා හරින්නේ නම් Apple සමඟ notarize කරන්න. `osx-arm64` සහ `osx-x64` publish කර ඒවා `lipo` සමඟ එකතු කිරීමෙන් universal binary එකක් build කරන්න.

## macOS මත තහවුරු කර ඇත
{:#verified-on-macos}

[`Explorer`]({{ '/si/samples/' | relative_url }}) නිදසුන සහ සම්පූර්ණ පාලක ගැලරිය යන දෙකම macOS මත ධාවනය වන අතර, ගැලරියේ Uno head එක ද එහි තහවුරු කර ඇත:

![macOS මත ධාවනය වන Explorer නිදසුන]({{ '/assets/img/explorer-macos.png' | relative_url }})

## ඊළඟට
{:#next}

- [ආරම්භ කිරීම]({{ '/si/getting-started/' | relative_url }}) — පළමු යෙදුම, සැකිල්ලකින් හෝ මුල සිට.
- [පවතින WinForms යෙදුමක් සංක්‍රමණය කරන්න]({{ '/si/migration/' | relative_url }}) — ස්වයංක්‍රීය නැවත ලිවීම.
- [Linux මත WinForms]({{ '/si/winforms-on-linux/' | relative_url }}) — Ubuntu, Fedora සහ Debian මත එම කතාවම.
- [බහු-වේදිකා WinForms]({{ '/si/cross-platform-winforms/' | relative_url }}) — ගෘහ නිර්මාණය සහ එහි හුවමාරු.
