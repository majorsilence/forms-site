---
layout: docs
lang: si
title: නිදසුන්
subtitle: Majorsilence.Forms භාවිතයෙන් ගොඩනැගූ සැබෑ යෙදුම්, අද වන විට repository එකේ ඇත.
permalink: /si/samples/
seo_title: "බහු-වේදිකා WinForms නිදසුන් සහ ආදර්ශන (demo) යෙදුම්"
description: >-
  ඔබට ධාවනය කළ හැකි සැබෑ බහු-වේදිකා WinForms යෙදුම්: Windows Explorer ක්ලෝනයක්, Outlook ක්ලෝනයක්,
  client/server point-of-sale යෙදුමක්, සජීවී CSS තේමා studio එකක්, සහ desktop, GTK 4, browser,
  mobile සහ terminal එකක පවා ක්‍රියා කරන සම්පූර්ණ පාලක ගැලරිය.
keywords:
  - winforms sample apps
  - winforms නිදසුන්
  - cross platform winforms examples
  - c# winforms demo linux macos
  - winforms control gallery
  - winforms theme studio css
  - winforms point of sale sample
  - winforms gtk 4
  - winforms terminal ui
priority: "0.8"
---

සෑම නිදසුනක්ම repository එකේ [`samples/`]({{ site.github_url }}/tree/main/samples) යටතේ ඇත.
වෙනත් ලෙස සඳහන් කර නොමැති නම්, එක් එක් නිදසුන `dotnet run --project samples/<Name>` මඟින් ධාවනය වන අතර
ඒ සඳහා අවශ්‍ය වන්නේ .NET 10 SDK පමණි.

| නිදසුන | පෙන්වන දේ | වේදිකා |
|---|---|---|
| [`ControlGallery`](#controlgallery) | සියලුම ගොඩනංවා ඇති (built-in) පාලක (library එකකි — පහත heads බලන්න) | — |
| [`Gallery.Avalonia`](#galleryavalonia) | පෙරනිමි backend එක මත ගැලරිය, headless විදැහුම්කරණය ද ඇතුළුව | Windows, macOS, Linux |
| [`Gallery.Uno`](#galleryuno) | Uno backend එක මත එම ගැලරියම | Desktop (macOS මත තහවුරු කර ඇත) |
| [`Gallery.Gtk4`](#gallerygtk4) | GTK 4 backend එක (gir.core) මත එම ගැලරියම | GTK 4 සහිත Desktop (Wayland මත තහවුරු කර ඇත) |
| [`Gallery.Wasm`](#gallerywasm) | browser එක තුළ එම ගැලරියම | WebAssembly |
| [`Gallery.Android`](#galleryandroid) | Android මත එම ගැලරියම | Android |
| [`Gallery.iOS`](#galleryios) | iOS මත එම ගැලරියම | iOS |
| [`Gallery.Terminal`](#galleryterminal) | terminal එකක් තුළ එම ගැලරියම | Console / ANSI terminals |
| [`Gallery.Wpf`](#gallerywpf) | WPF backend එක මත එම ගැලරියම | Windows |
| [`Explorer`](#explorer) | Windows Explorer ක්ලෝනයක් | Windows, macOS, Linux |
| [`Outlaw`](#outlaw) | Outlook ක්ලෝනයක් | Windows, macOS, Linux |
| [`PointOfSale`](#pointofsale) | සම්පූර්ණ client/server ව්‍යාපාරික (LOB) යෙදුමක් | Windows, macOS, Linux |
| [`ThemeStudio`](#themestudio) | සජීවී CSS තේමා සංස්කාරකය සහ පෙරදසුන | Windows, macOS, Linux |
| [`ThemeStudio.WinForms`](#themestudiowinforms) | සැබෑ `System.Windows.Forms` පාලක මත එම Studio එකම | Windows |
| [`EmbeddingAvalonia` / `EmbeddingUno` / `EmbeddingWinForms` / `EmbeddingGtk4`](#embedding) | ස්වදේශීය (native) යෙදුමක් *තුළ* ධාරණය කළ Majorsilence.Forms | Desktop (WinForms: Windows පමණි; Gtk4: GTK 4 අවශ්‍යයි) |
| [`WinFormsInterop`](#winformsinterop) | ද්වි-දිශා `System.Windows.Forms` interop | Windows |
| [`WinFormsCompatDemo`](#winformscompatdemo) | source-generate කළ `System.Windows.Forms` namespace එක, සැබෑ WinForms assembly එකක් නැත | Windows, macOS, Linux |
| [`AutomationTarget`](#automationtarget) | තමන්ගේම automation endpoint එකක් නිරාවරණය කරන යෙදුමක් | Windows, macOS, Linux |

ගැලරි heads අත්හදා බැලීමට ඔබ ඒවායින් කිසිවක් ඔබම build කළ යුතු නැත. CI විසින් browser bundle එක
(`gallery-wasm`), sideload කළ හැකි Android APK + AAB (`gallery-android`, .NET Android debug key එකෙන්
අත්සන් කර ඇත — sideload කිරීමට සුදුසුයි, Play Store සඳහා නොවේ), zip කළ iOS-simulator `.app` එකක්
(`gallery-ios`; අත්සන් කළ device `.ipa` එකක් නැත) සහ Windows, Linux සහ macOS සඳහා self-contained
ThemeStudio binaries publish කර, ඒ සියල්ල එක් එක් [GitHub Release]({{ site.github_url }}/releases) එකට අමුණයි.

## ControlGallery
{:#controlgallery}

සියලුම ගොඩනංවා ඇති පාලක, සජීවීව, එක් පාලකයකට එක් demo panel එකක් බැගින්. `ControlGallery` යනු
backend එකකට නොබැඳුණු **library** එකකි — පොදු `MainForm` සහ demo panels — එය කිසිදු backend එකක්
reference නොකරයි, එබැවින් එක් එක් backend එකට එය ධාරණය කරන තුනී app head එකක් ලැබෙන අතර අනෙක්
backends වල dependencies process එකට ඇදී එන්නේ නැත. පහත `Gallery.*` heads වලින් එකක් ධාවනය කරන්න.

## Gallery.Avalonia
{:#galleryavalonia}

පෙරනිමි (Avalonia) backend එක මත desktop head එක:

```
dotnet run --project samples/Gallery.Avalonia
```

එය headless ලෙසද විදැහුම් කරයි, CI සහ pixel-diff පරීක්ෂා සඳහා ප්‍රයෝජනවත්ය:

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

## Gallery.Uno
{:#galleryuno}

**Uno** backend එක මත ධාවනය වන එම පාලක ගැලරියම — desktop, iOS, Android සහ WebAssembly දක්වා ළඟා වේ.

```
dotnet run --project samples/Gallery.Uno
```

මෙයට windowing session එකක් අවශ්‍ය නිසා එය headless CI build එකේ කොටසක් නොවේ; එහි Uno packages,
නිදසුනේම `nuget.config` හරහා nuget.org වෙතින් restore වේ. සම්පූර්ණ ගැලරිය launch වීම සහ විදැහුම් වීම
macOS මත තහවුරු කර ඇත.

## Gallery.Gtk4
{:#gallerygtk4}

**GTK 4** backend එක (gir.core) මත එම ගැලරියම — සැබෑ `Gtk.Window` එකක්, Linux-first.

```
dotnet run --project samples/Gallery.Gtk4                    # සම්පූර්ණ ControlGallery
MF_GTK4_DEMO=1 dotnet run --project samples/Gallery.Gtk4     # කුඩා render + input smoke form එකක්
MF_GTK4_WEBVIEW=1 dotnet run --project samples/Gallery.Gtk4  # WebKitGTK 6.0 මත WebBrowser එකක්
```

මෙයට display session එකක් (X11/Wayland) සහ GTK 4 native libraries අවශ්‍ය වේ (webview form එකට
අමතරව `libwebkitgtk-6.0` ද අවශ්‍යයි), එබැවින් එය headless CI build එකේ කොටසක් නොවේ. එහි `GirCore.*`
packages, නිදසුනේම `nuget.config` හරහා nuget.org වෙතින් restore වේ. `MF_GTK4_SELFTEST=1` අන්තර්ක්‍රියාකාරී
නොවන පරීක්ෂාවක් ධාවනය කර පිටවෙයි. සම්පූර්ණ ගැලරිය launch වීම සහ විදැහුම් වීම Wayland මත තහවුරු කර ඇත.
GTK 4 backend එක දැනට කරන සහ තවම නොකරන දේ සඳහා [වේදිකා backends]({{ '/si/backends/' | relative_url }}) බලන්න.

## Gallery.Wasm
{:#gallerywasm}

නැවතත් එම පාලක ගැලරියම, මෙවර Avalonia backend එකේ `net10.0-browser` target එක මත browser එක තුළ
ධාවනය වේ — **[සජීවීව අත්හදා බලන්න]({{ '/gallery/' | relative_url }})**, ස්ථාපනයක් අවශ්‍ය නැත.
මෙය WebAssembly වෙත compile කළ සැබෑ framework එකම වන බැවින්, පළමු load එකේදී .NET runtime එක බාගත වේ.

එය ඔබම build කිරීමට, wasm-tools workload එක එක් වරක් ස්ථාපනය කළ යුතුය:

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

ඉන්පසු ඕනෑම static file server එකකින් `out/wwwroot` serve කර `index.html` විවෘත කරන්න — සාමාන්‍ය exe
එකක් මෙන් WebAssembly SDK ව්‍යාපෘති `dotnet run` මඟින් serve නොවේ. නැතහොත් toolchain එක මඟහරින්න:
සෑම PR එකකදීම CI build කරන `gallery-wasm` bundle එක එක් එක් GitHub Release එකට අමුණා ඇත. build විස්තර
සහ වත්මන් සීමාවන් සඳහා
[වේදිකා backends]({{ '/si/backends/' | relative_url }}#running-in-the-browser-webassembly)
බලන්න.

> **දන්නා හිඩැස:** ගැලරියේ icons browser එකේ (Android හෝ iOS මතද) විදැහුම් නොවේ — ඒවා කල්තියා load
> කිරීමට අදහස් කළ `WasmFilesToIncludeInFileSystem` item එක WebAssembly SDK විසින් නිහඬව නොසලකා හරින බැවින්,
> `Bitmap(string)` 1×1 placeholder එකකට පිරිහෙයි. යෙදුම නොපෙනෙන icons සමඟ ගැටලුවකින් තොරව ආරම්භ වේ.

browser head එක **browser-head පරීක්ෂා** ද රැගෙන යයි: publish කළ bundle එක `?check=<name>` සමඟ
විවෘත කළ විට, page එක ගැලරිය වෙනුවට එක් පරීක්ෂාවක් ධාවනය කරයි — blocking modal calls (browser මත
ඒවා තම async ප්‍රතිරූපය නම් කරමින් throw කරයි), ඒවායේ await කළ හැකි ආකාර, accessibility-DOM පරීක්ෂාවක්
සහ විදැහුම්කරණ පරීක්ෂා හතරක් — console එකට `MFCHECK` පේළි ලියමින්. `tools/modal-check.mjs` ඒ සියල්ල
headless Chrome තුළ ධාවනය කරන අතර CI එය `wasm` job එකේ `--expect` සමඟ ධාවනය කරයි; එම form එකම Android
සහ iOS heads වලටද link කර ඇති අතර, එක් එක් එකට තමන්ගේම `tools/modal-check.sh` ඇත. නම්, environment
variables සහ අපේක්ෂිත ප්‍රතිඵල සියල්ල repository එකේ
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md#gallerywasm) හි ඇත.

## Gallery.Android (Android පමණි, ප්‍රගතියේ පවතින වැඩ)
{:#galleryandroid}

නැවතත් එම `ControlGallery` `MainForm` එකම, Avalonia backend එකේ Android target එක මත, තනි Activity
එකකින් ධාරණය කර ඇත. `android` workload එක අවශ්‍යයි:

```
dotnet workload install android
dotnet build samples/Gallery.Android -t:Run
```

workload එක ස්ථාපනය කළ පසු, `Directory.Build.props` එය හඳුනාගෙන මෙම ව්‍යාපෘතිය එහි stub build එකේ
සිට සැබෑ `net10.0-android` head එකට ස්වයංක්‍රීයව මාරු කරයි — එබැවින් repo root එකේ සාමාන්‍ය
`dotnet build` / `dotnet test` එකකට කිසි විටෙක workload එක අවශ්‍ය නොවන අතර, Visual Studio emulator
එකකට එරෙහිව F5 සමඟ කෙලින්ම ක්‍රියා කරයි. එය බලෙන් සක්‍රිය කිරීමට `-p:EnableAndroidTarget=true` දෙන්න;
එයට කිසිදු gate එකක් නැති නිසා, workload එක නොමැති නම් නිහඬව stub එකට ආපසු යනවා වෙනුවට build එක අසාර්ථක වේ.

> Android සහාය තවම මුල් අවධියේ ය. එය සැබෑ උපාංගයක් මත මූලික පරීක්ෂාවකට ලක් වී ඇත — ගැලරිය ආරම්භ වේ
> (AppCompat-theme ආරම්භක crash එකක් එහිදී සොයාගෙන නිවැරදි කරන ලදී), සහ tap hit-testing, render
> පරිමාණනය සහ touch scroll/flick දෘඩාංග මත ක්‍රියා කරන බව තහවුරු කර ඇත — නමුත් on-screen keyboard,
> safe-area insets, rotation සහ සම්පූර්ණ පාලක ආවරණය, desktop සහ browser backends ලැබූ මට්ටමේ පරීක්ෂාවක්
> ලබා නැත. අසම්පූර්ණ තැන් අපේක්ෂා කරන්න.

CI සෑම PR එකකදීම sideload කළ හැකි APK + AAB publish කරයි (artifact `gallery-android`) සහ ඒවා එක් එක්
GitHub Release එකට අමුණයි. Android, browser එකේ තනි-දර්ශන ධාරකය (single-view host) බෙදා ගන්නා බැවින්,
window-chrome සහ WebView සීමාවන් එලෙසම අදාළ වේ — [වේදිකා backends]({{ '/si/backends/' | relative_url }}) බලන්න.

## Gallery.iOS (iOS පමණි, තහවුරු කර නැත)
{:#galleryios}

iOS සමාන ප්‍රතිරූපය, තනි `UIViewController` එකකින් ධාරණය කර ඇත. `ios` workload එක සහිත Mac එකක් අවශ්‍යයි:

```
dotnet workload install ios
dotnet build samples/Gallery.iOS -t:Run
```

`Gallery.Android` මෙන්ම, mobile workload එකක් ඇති විට `Directory.Build.props` මෙය stub එකක සිට සැබෑ
`net10.0-ios` head එකට ස්වයංක්‍රීයව මාරු කරයි — නමුත් macOS මත පමණි, මන්ද `ios` workload එක වෙන කොහේවත්
නොපවතින බැවිනි. `-p:EnableIOSTarget=true` මඟින් එය බලෙන් සක්‍රිය කරන්න; `EnableMobileHeads` umbrella
එකට වඩා එය භාවිත කරන්න, මන්ද `android` workload එක නැති Mac එකක එය `net10.0-android` පේළියද ඉල්ලා
අසාර්ථක වන බැවිනි.

> iOS යනු අවම වශයෙන් සනාථ වූ backend එකයි: එය ලියා ඇත්තේ Avalonia.iOS හි API surface එක සහ සම්මත
> .NET-for-iOS සම්ප්‍රදායන් අනුව ය. CI හි `ios` job එක (`macos-latest` මත) දැන් සැබෑ head එක compile කර
> smoke check එකක් ලෙස simulator එකක launch කරයි — නමුත් job එක තවමත් `continue-on-error` වන අතර, කිසිවෙකු
> එය උපාංගයක් මත අන්තර්ක්‍රියාකාරීව ධාවනය කර නැත. අසම්පූර්ණ තැන් regression එකක් ලෙස නොව, අපේක්ෂිත දෙයක්
> ලෙස සලකන්න.

build එක සාර්ථක වන විට CI සෑම PR එකකදීම zip කළ iOS-simulator `.app` එකක් publish කරයි (artifact
`gallery-ios`) සහ එය එක් එක් GitHub Release එකට අමුණයි. අත්සන් කළ device `.ipa` එකක් නැත — ඒ සඳහා
Apple distribution certificate එකක් අවශ්‍ය වේ.

## Gallery.Terminal
{:#galleryterminal}

**Terminal** backend එක මත එම ගැලරියම: පෝරමය (form) title bar එකක් නොමැතිව terminal එක පුරා පිරෙයි,
දුරකථන තිරයක් පුරා පිරෙන ආකාරයටම. Skia offscreen විදැහුම් කරන අතර, terminal එක සහාය දක්වන තැන්වලදී
එය terminal එකේ සැබෑ pixel resolution එකෙන් Kitty graphics හෝ Sixel ලෙසද, නැතිනම් Unicode block
elements ලෙසද පෙන්වයි.

```
dotnet run --project samples/Gallery.Terminal                       # සම්පූර්ණ ControlGallery
MF_TERMINAL_DEMO=1 dotnet run --project samples/Gallery.Terminal    # ඒ වෙනුවට කුඩා smoke form එකක්
```

එය truecolor terminal එකක ධාවනය කරන්න. output mode එක සොයා ගන්නේ terminal එකෙන් විමසීමෙනි;
`MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` එකක් බලෙන් තෝරන අතර, `MF_TERMINAL_SCALE=0.5` පෝරමය
pixel grid එක මෙන් දෙගුණයක් විශාල canvas එකක් මත සකසයි (සම්භාව්‍ය half-block mode එකේදී ප්‍රයෝජනවත්).
Mouse සහ keyboard ක්‍රියා කරයි; Ctrl+C සැමවිටම පිටවෙයි. මේ වන විට xterm සහ WezTerm තුළ තහවුරු කර ඇත.
backend එකේ සීමාවන් සඳහා (native pickers, `NativeControlHost` හෝ web view නැත)
[වේදිකා backends]({{ '/si/backends/' | relative_url }}) බලන්න.

## Gallery.Wpf (Windows පමණි)
{:#gallerywpf}

**WPF** backend එක මත එම ගැලරියම — සැබෑ WPF `Window` එකක්, Skia `WriteableBitmap` එකක් හරහා ඉදිරිපත්
කෙරේ. WPF ස්වයංක්‍රීයව තෝරාගන්නා පෙරනිමි backend එක නොවන නිසා, head එක පළමු window එකට පෙර එය පැහැදිලිවම
ස්ථාපනය කරයි (`Platform.Backend = new WpfPlatformBackend ();`).

```
dotnet run --project samples/Gallery.Wpf
```

WinForms backend එක මෙන්ම, මෙයද Windows පමණක් වූ *සංක්‍රමණ (migration)* backend එකකි —
[වේදිකා backends]({{ '/si/backends/' | relative_url }}) බලන්න.

## Explorer
{:#explorer}

Windows Explorer හි ක්ලෝනයක් — ගොනු බ්‍රවුස් කිරීම, tree navigation සහ list views, මූලික පාලක කට්ටලය
මුල සිට අග දක්වා ක්‍රියාත්මක කරමින්. ව්‍යාපෘතිය `samples/Explorer` හි ඇති අතර එහි නම `Explore.csproj` වේ.

```
dotnet run --project samples/Explorer
```

Windows, Ubuntu සහ macOS මත ධාවනය වන බව තහවුරු කර ඇත.

## Outlaw
{:#outlaw}

Microsoft Outlook හි ක්ලෝනයක්. මෙය සෙල්ලම් demo එකක් නොව, සංකීර්ණ, බහු-pane, සැබෑ ලෝකයේ යෙදුම්
හැඩයක් Majorsilence.Forms මඟින් දරාගත හැකි බව පෙන්වයි.

```
dotnet run --project samples/Outlaw
```

## PointOfSale
{:#pointofsale}

තනි-window demo එකක් නොව, ව්‍යාපෘති හතරකට බෙදූ සම්පූර්ණ ව්‍යාපාරික (LOB) යෙදුමක් — සැබෑ
Majorsilence.Forms යෙදුමක් ගන්නා හැඩය:

| ව්‍යාපෘතිය | භූමිකාව |
|---|---|
| `PointOfSale.Client` | Majorsilence.Forms desktop යෙදුම (පෝරම, panels, custom පාලක, services) |
| `PointOfSale.Api` | JWT auth සහ role-based policies සහිත ASP.NET Core minimal API එකක් |
| `PointOfSale.Contracts` | දෙපැත්තම බෙදා ගන්නා DTOs |
| `PointOfSale.Data` | EF Core + SQLite persistence සහ seeding (`tests/PointOfSale.Data.Tests` මඟින් ආවරණය කර ඇත) |

පළමුව API එක, ඉන්පසු client එක ආරම්භ කරන්න — client එක `ApiBaseUrl` (සහ එහි kiosk-mode settings)
තමන්ගේම `appsettings.json` වෙතින් කියවන අතර, පෙරනිමිය `http://127.0.0.1:5000` වේ:

```
dotnet run --project samples/PointOfSale/PointOfSale.Api
dotnet run --project samples/PointOfSale/PointOfSale.Client
```

API එක පළමු ධාවනයේදී local `pos.db` එකක් සාදා seed කරයි. `appsettings.json` හි ඇති පෙරනිමි JWT signing
key එක placeholder එකක් මිස රහසක් නොවේ — එය `appsettings.Development.json` හෝ environment එකේ override
කරන්න. Source: [`samples/PointOfSale`]({{ site.github_url }}/tree/main/samples/PointOfSale).

## ThemeStudio
{:#themestudio}

CSS තේමා ලිවීම සඳහා desktop යෙදුමක්: වම් පැත්තේ CSS සංස්කාරකයක්, දකුණු පැත්තේ තේමා කළ හැකි සෑම පාලකයකින්ම
එකක් බැගින්, සහ යටින් parser එකේ diagnostics. සෑම සංස්කරණයක්ම sheet එක නැවත යොදයි (Studio එකේම window
එකටද), විවෘත කළ ගොනුවක් disk එක මත නිරීක්ෂණය කෙරෙන නිසා බාහිර සංස්කාරකයකට හෝ coding assistant කෙනෙකුට
එය මෙහෙයවිය හැකිය, සහ **Copy reference for AI** මඟින් assistant කෙනෙකුට prompt කිරීම සඳහා සම්පූර්ණ
තේමාකරණ (theming) යොමුව clipboard එකට දමයි.

```
dotnet run --project samples/ThemeStudio                                           # Light තේමාව CSS ලෙස ගෙන ආරම්භ කරන්න
dotnet run --project samples/ThemeStudio -- samples/ThemeStudio/Themes/ocean.css   # තේමාවක් විවෘත කර නිරීක්ෂණය කරන්න
dotnet run --project samples/ThemeStudio -- --render-headless out.png samples/ThemeStudio/Themes/paper.css --tab 1
```

අවසාන ආකාරය display එකක් නොමැතිව පෙරදසුන PNG එකකට විදැහුම් කරයි (tabs: 0 inputs, 1 lists සහ grids,
2 menus සහ chrome, 3 token swatches, 4 native Avalonia) සහ තේමාවේ දෝෂ ඇත්නම් non-zero ලෙස පිටවෙයි.
Tab 4, `Majorsilence.Forms.Theming.Avalonia` හරහා එම sheet එකෙන්ම තේමා කළ සැබෑ Avalonia පාලක ධාරණය කරයි.

`samples/ThemeStudio/Themes/` ආරම්භ කිරීමට නිදසුන් තේමා සපයයි: `light.css` සහ `dark.css` (එක accent එකක්
බෙදා ගන්නා ගැළපෙන යුගලයක්, එබැවින් යෙදුමකට කිසිවක් චලනය නොවී modes මාරු කළ හැකිය), `ocean.css`,
`graphite.css`, `paper.css` සහ `parchment.css`. `win-x64`, `linux-x64` සහ `osx-arm64` සඳහා කලින් build කළ,
self-contained ThemeStudio binaries එක් එක් GitHub Release එකට අමුණා ඇත. තේමාකරණ යොමුව repository එකේ
[`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) හි ඇත.

## ThemeStudio.WinForms (Windows පමණි)
{:#themestudiowinforms}

**සැබෑ `System.Windows.Forms`** යෙදුම් සඳහා Theme Studio හි Windows පමණක් වූ head එක: එම සංස්කාරකය සහ
diagnostics, applier එක map කරන සෑම WinForms පාලකයකින්ම එකක් බැගින් පෙරදසුනක් සමඟ,
`Majorsilence.Forms.Theming.WinForms` හරහා තේමා කර ඇත. diagnostics ලැයිස්තුව parser එකේම diagnostics වලට
අමතරව WinForms හට ප්‍රකාශ කළ නොහැකි වූ දේ (info / warning) එක් කරයි.

```
dotnet run --project samples/ThemeStudio.WinForms                                              # Light තේමාව CSS ලෙස ගෙන ආරම්භ කරන්න
dotnet run --project samples/ThemeStudio.WinForms -- samples/ThemeStudio/Themes/graphite.css   # තේමාවක් විවෘත කර නිරීක්ෂණය කරන්න
dotnet run --project samples/ThemeStudio.WinForms -- --screenshot out.png samples/ThemeStudio/Themes/graphite.css
```

`--screenshot` පෙරදසුන `Control.DrawToBitmap` මඟින් විදැහුම් කරයි — WinForms හට headless backend එකක් නැති
නිසා desktop session එකක් තවමත් අවශ්‍යයි — සහ parse දෝෂ ඇති විට non-zero ලෙස පිටවෙයි. `win-x64` build
එකක් ThemeStudio binaries සමඟ එක් එක් GitHub Release එකට අමුණා ඇත.
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md) බලන්න.

## EmbeddingAvalonia / EmbeddingUno / EmbeddingWinForms / EmbeddingGtk4
{:#embedding}

ප්‍රතිවිරුද්ධ දිශාව: Majorsilence.Forms හට ඉහළම මට්ටමේ (top-level) window එක අයිති කර ගැනීමට ඉඩ දෙනවා
වෙනුවට, සාමාන්‍ය Avalonia, Uno, සම්භාව්‍ය WinForms හෝ GTK 4 යෙදුමක් Majorsilence.Forms පාලක සහ windows
තමන්ගේම native ඒවා මෙන් භාවිත කරයි.

```
dotnet run --project samples/EmbeddingAvalonia
dotnet run --project samples/EmbeddingUno
dotnet run --project samples/EmbeddingWinForms   # Windows පමණි
dotnet run --project samples/EmbeddingGtk4       # display එකක් + GTK 4 අවශ්‍යයි
```

සෑම window එකක්ම native ධාරක පාලක සහ කාවැද්දූ (embedded) Majorsilence.Forms scene එකක් පැත්තෙන් පැත්තට තබයි:

- `ToAvaloniaControl()` / `ToUnoControl()` / `ToWinFormsControl()` / `ToGtkWidget()` —
  `MajorsilenceFormsPresenter` හරහා native පාලකයක් ලෙස ධාරණය කළ Majorsilence පාලකයක්.
- `ToAvaloniaWindow()` / `ToUnoWindow()` / `ToWinFormsForm()` / `ToGtkWindow()` — Majorsilence `Form`
  එකක backend window එක ධාරකයට ආපසු භාර දීම. Avalonia, WinForms සහ GTK 4 හට සැබෑ OS-මට්ටමේ modal
  සංවාද කවුළුවක් ලැබේ; Uno හට මෙම backend එකේ owner සංකල්පයක් නැති නිසා, එයට ස්වාධීන top-level window
  එකක් ලැබෙන අතර එහිදී modal හැසිරීම ලබා ගැනීමේ මාර්ගය `Form.ShowDialog(parent)` වේ.
- `NativeControlHost` — Majorsilence scene එක *තුළ* ධාරණය කළ native බොත්තමක්, නැවතත් අනෙක් දිශාව
  (හතරම; GTK 4 මත එය කිසිදු "airspace" ගැටලුවකින් තොරව පිරිසිදුව composite වේ).
  [Native interop]({{ '/si/native-interop/' | relative_url }}) බලන්න.

`EmbeddingWinForms` අර්ධ දෙකම එක් stylesheet එකකින්, `Themes/graphite.css`, `WinFormsCssTheme` හරහා
තේමා කරයි (තේමා නොකළ පෙනුම සඳහා `--no-theme`); `EmbeddingAvalonia` එයම `AvaloniaCssTheme` හරහා කරයි
(එහි **Apply ocean.css** බොත්තම, හෝ `--theme file.css`, සහ `--render-headless out.png` window එක
offscreen ඇඳ පිටවෙයි). Avalonia සහ Uno ඒවා ධාරකයේ තේමාවද toggle කරන නිසා, Majorsilence.Forms පාලක එය
අනුගමනය කරන අයුරු ඔබට බලා සිටිය හැකිය. WinForms එක, WinForms backend එක මත වරකට එක් පාලකයක් බැගින් port
කරන සංක්‍රමණ මාර්ගයයි; GTK 4 එක, Gtk4 backend එක ඇතුළත තබාගෙන එහි ධාරක `Gtk.Application` හි loop එක
ධාවනය කරයි (අන්තර්ක්‍රියාකාරී නොවන පරීක්ෂාවක් සඳහා `EMBED_SELFTEST=1`). API එක සහ backends අතර
owner/modal වෙනස්කම් සඳහා
[ධාරක යෙදුමක කාවැද්දීම]({{ '/si/backends/' | relative_url }}#embedding-in-a-host-app) බලන්න.

## WinFormsInterop (Windows පමණි)
{:#winformsinterop}

තනි process එකක් තුළ `System.Windows.Forms` සහ Majorsilence.Forms අතර ද්වි-දිශා interop පෙන්වයි —
නිදසුන සැබෑ WinForms ධාරකයක් ලෙස ආරම්භ වන අතර, විවෘත කරන සෑම Majorsilence.Forms window එකකටම නැවත
පැරණි (legacy) WinForms පෝරම විවෘත කළ හැකිය. මෙය Avalonia backend එක මත සම්පූර්ණ-පෝරම bridging වන අතර,
`EmbeddingWinForms` භාවිත කරන WinForms backend එකෙන් වෙනස් වේ.

```
dotnet run --project samples/WinFormsInterop
```

සම්පූර්ණ API එක සඳහා [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md)
බලන්න.

## WinFormsCompatDemo
{:#winformscompatdemo}

`WinFormsInterop` සමඟ පටලවා නොගන්න: මෙම process එකේ කොතැනකවත් සැබෑ `System.Windows.Forms` assembly එකක්
නැත. `Form1.cs`/`Form1.Designer.cs` යනු සාමාන්‍ය, වෙනස් නොකළ WinForms designer-generated source ය —
`Button`, `Label`, `TextBox`, `MessageBox.Show(...)` call එකක් — ඒවා Majorsilence.Forms වෙත එරෙහිව
compile වන්නේ `Majorsilence.Forms.WinFormsShims.Compat` Roslyn source generator එක, එය මත පදනම් වූ එකම
නමින් යුත් `System.Windows.Forms` namespace එකක් සම්පූර්ණයෙන්ම compile කාලයේදී emit කරන බැවිනි. නිදසුන
Avalonia backend එක reference කරන නිසා `Application.Run` හුදෙක් compile පරීක්ෂාවක් නොව, සැබෑ window එකක්
විවෘත කරයි.

```
dotnet run --project samples/WinFormsCompatDemo
```

එහි [`RESULTS.md`]({{ site.github_url }}/blob/main/samples/WinFormsCompatDemo/RESULTS.md) අද වන විට
පරිවර්තනයෙන් බේරෙන සහ නොබේරෙන දේ වාර්තා කරයි — designer-generated පෝරමය දෝෂ නොමැතිව compile වන අතර,
පළමුවෙන්ම බිඳෙන්නේ `PaintEventArgs` වැනි `EventHandler` නොවන delegate එකකට type කළ handler එකකි.
මෙය ගැළපෙන්නේ කොතැනටද යන්න සඳහා [සංක්‍රමණය]({{ '/si/migration/' | relative_url }}) බලන්න.

## AutomationTarget
{:#automationtarget}

automation tooling ඉගෙන ගන්නා අතරතුර මෙහෙයවීමට සැබෑ දෙයක් තිබීම සඳහා, තමන් මතම `WebDriverServer` එකක්
ආරම්භ කරන, හිතාමතාම කුඩා කළ යෙදුමක් — MCP server එකෙන්, Selenium client එකකින් හෝ සාමාන්‍ය `curl` වලින්.

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

එය endpoint එක සහ එය මෙහෙයවීමට අවශ්‍ය commands මුද්‍රණය කරයි. `--webdriver <port>` port එක තෝරයි (පෙරනිමිය
4444); `--no-webdriver` එය සාමාන්‍ය යෙදුමක් ලෙස ධාවනය කරයි. සෑම පාලකයක්ම client එකකට මුහුණ දීමට සිදුවන
එක් දෙයක් පෙන්වයි — click කිරීම ප්‍රතික්ෂේප කරන පාලකයක්, checkbox එකක් tick කළ පසුව පමණක් සක්‍රිය වන
එකක්, සහ හිතාමතාම නමක් නොදී තැබූ එකක් — සහ සෑම ක්‍රියාවක්ම තිරය මත සහ stdout වෙත log කෙරේ, එබැවින්
client එකක ප්‍රකාශ, යෙදුම සැබවින්ම දුටු දේ සමඟ ඔබට පරීක්ෂා කළ හැකිය. මෙහි screenshots සැලසුම් කළ ආකාරයෙන්ම
ලබා ගත නොහැක: එය Avalonia මත ධාවනය වන අතර, image capture යනු Headless backend එකේ කාර්යයයි.

පාලකයෙන් පාලකයට විස්තරය සඳහා
[`samples/AutomationTarget/README.md`]({{ site.github_url }}/blob/main/samples/AutomationTarget/README.md)
ද, tooling එක සඳහා [Automation සහ UI පරීක්ෂාව]({{ '/si/automation/' | relative_url }}) ද බලන්න.

## source වෙතින් build කිරීම
{:#building-from-source}

- [repository]({{ site.github_url }}) එක clone කරන්න
- .NET 10 SDK ස්ථාපනය කරන්න
- ඔබේ IDE එකේ `Majorsilence.Forms.slnx` විවෘත කරන්න, නැතහොත් `dotnet run --project samples/<Name>` මඟින් ඕනෑම නිදසුනක් කෙලින්ම ධාවනය කරන්න

`Gallery.Android` සහ `Gallery.iOS` solution එකේ ඇති නමුත්, ගැළපෙන workload එක ස්ථාපනය කර නොමැති නම් ඒවා
හිස් stub libraries ලෙස compile වේ, එබැවින් repo root එකේ සාමාන්‍ය `dotnet build` / `dotnet test` එකක්
කිසිදු platform workload එකක් නොමැතිව ක්‍රියා කරයි. `-p:EnableAndroidTarget=true` හෝ
`-p:EnableIOSTarget=true` මඟින් එක් වේදිකාවක් බලෙන් සක්‍රිය කරන්න.

වේදිකා-විශේෂිත build සටහන් සඳහා repository එකේ
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md) බලන්න.
