---
layout: docs
lang: ta
title: மாதிரிகள்
subtitle: Majorsilence.Forms கொண்டு உருவாக்கப்பட்ட, இன்றே repository-இல் உள்ள உண்மையான பயன்பாடுகள்.
permalink: /ta/samples/
seo_title: "பல்தள WinForms மாதிரிகள் மற்றும் demo பயன்பாடுகள்"
description: >-
  நீங்களே இயக்கிப் பார்க்கக்கூடிய உண்மையான பல்தள WinForms பயன்பாடுகள்: Windows Explorer நகல், Outlook நகல்,
  client/server விற்பனை முனையம் (point-of-sale) பயன்பாடு, நேரடி CSS தீம் ஸ்டுடியோ, மற்றும் desktop, GTK 4,
  உலாவி, மொபைல், ஏன் terminal-இலும் கூட முழுமையான கட்டுப்பாட்டுக் காட்சியகம்.
keywords:
  - winforms மாதிரி பயன்பாடுகள்
  - winforms sample apps
  - பல்தள winforms உதாரணங்கள்
  - c# winforms demo linux macos
  - winforms control gallery
  - winforms css தீம்
  - winforms point of sale sample
  - winforms gtk 4
  - winforms terminal ui
priority: "0.8"
---

ஒவ்வொரு மாதிரியும் repository-இல் [`samples/`]({{ site.github_url }}/tree/main/samples) கீழ் உள்ளது.
வேறுவிதமாகக் குறிப்பிடப்படாவிட்டால், ஒவ்வொன்றும் `dotnet run --project samples/<Name>` மூலம் இயங்கும்; அதற்கு
.NET 10 SDK மட்டுமே தேவை.

| மாதிரி | இது காட்டுவது | தளங்கள் |
|---|---|---|
| [`ControlGallery`](#controlgallery) | உள்ளமைந்த ஒவ்வொரு கட்டுப்பாடும் (ஒரு library — கீழே உள்ள head-களைப் பார்க்கவும்) | — |
| [`Gallery.Avalonia`](#galleryavalonia) | இயல்புநிலைப் பின்தளத்தில் காட்சியகம், headless வரைதல் உட்பட | Windows, macOS, Linux |
| [`Gallery.Uno`](#galleryuno) | அதே காட்சியகம் Uno பின்தளத்தில் | Desktop (macOS இல் சரிபார்க்கப்பட்டது) |
| [`Gallery.Gtk4`](#gallerygtk4) | அதே காட்சியகம் GTK 4 பின்தளத்தில் (gir.core) | GTK 4 உள்ள Desktop (Wayland இல் சரிபார்க்கப்பட்டது) |
| [`Gallery.Wasm`](#gallerywasm) | அதே காட்சியகம் உலாவியில் | WebAssembly |
| [`Gallery.Android`](#galleryandroid) | அதே காட்சியகம் Android இல் | Android |
| [`Gallery.iOS`](#galleryios) | அதே காட்சியகம் iOS இல் | iOS |
| [`Gallery.Terminal`](#galleryterminal) | அதே காட்சியகம் ஒரு terminal-இல் | Console / ANSI terminals |
| [`Gallery.Wpf`](#gallerywpf) | அதே காட்சியகம் WPF பின்தளத்தில் | Windows |
| [`Explorer`](#explorer) | ஒரு Windows Explorer நகல் | Windows, macOS, Linux |
| [`Outlaw`](#outlaw) | ஒரு Outlook நகல் | Windows, macOS, Linux |
| [`PointOfSale`](#pointofsale) | முழுமையான client/server வணிக (LOB) பயன்பாடு | Windows, macOS, Linux |
| [`ThemeStudio`](#themestudio) | நேரடி CSS தீம் திருத்தியும் முன்னோட்டமும் | Windows, macOS, Linux |
| [`ThemeStudio.WinForms`](#themestudiowinforms) | அதே Studio, உண்மையான `System.Windows.Forms` கட்டுப்பாடுகளுக்கு எதிராக | Windows |
| [`EmbeddingAvalonia` / `EmbeddingUno` / `EmbeddingWinForms` / `EmbeddingGtk4`](#embedding) | ஒரு native பயன்பாட்டின் *உள்ளே* ஹோஸ்ட் செய்யப்பட்ட Majorsilence.Forms | Desktop (WinForms: Windows மட்டும்; Gtk4: GTK 4 தேவை) |
| [`WinFormsInterop`](#winformsinterop) | இருதிசை `System.Windows.Forms` interop | Windows |
| [`WinFormsCompatDemo`](#winformscompatdemo) | Source-generate செய்யப்பட்ட `System.Windows.Forms` namespace, உண்மையான WinForms assembly இல்லை | Windows, macOS, Linux |
| [`AutomationTarget`](#automationtarget) | தனது சொந்த automation endpoint-ஐ வெளிப்படுத்தும் பயன்பாடு | Windows, macOS, Linux |

காட்சியக head-களை முயற்சிக்க நீங்கள் அவற்றில் எதையும் நீங்களே build செய்ய வேண்டியதில்லை. CI பின்வருவனவற்றை
வெளியிடுகிறது: உலாவி bundle (`gallery-wasm`), sideload செய்யக்கூடிய Android APK + AAB (`gallery-android`, .NET Android
debug key கொண்டு கையொப்பமிடப்பட்டது — sideload செய்வதற்குச் சரி, Play Store-க்கு அல்ல), zip செய்யப்பட்ட iOS-simulator `.app`
(`gallery-ios`; கையொப்பமிடப்பட்ட சாதன `.ipa` இல்லை) மற்றும் Windows, Linux, macOS க்கான self-contained ThemeStudio binaries.
இவை அனைத்தும் ஒவ்வொரு [GitHub Release]({{ site.github_url }}/releases)-உடனும் இணைக்கப்படுகின்றன.

## ControlGallery
{:#controlgallery}

உள்ளமைந்த ஒவ்வொரு கட்டுப்பாடும், நேரடியாக, ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒரு demo panel. `ControlGallery` தானே
பின்தளம் சாராத ஒரு **library** — பகிரப்பட்ட `MainForm` மற்றும் demo panels — இது எந்தப் பின்தளத்தையும் reference
செய்வதில்லை. ஆகவே ஒவ்வொரு பின்தளத்துக்கும் அதை ஹோஸ்ட் செய்யும் ஒரு மெல்லிய app head கிடைக்கிறது; மற்ற
பின்தளங்களின் dependencies process-க்குள் இழுக்கப்படுவதில்லை. கீழே உள்ள `Gallery.*` head-களில் ஒன்றை இயக்குங்கள்.

## Gallery.Avalonia
{:#galleryavalonia}

இயல்புநிலை (Avalonia) பின்தளத்தில் உள்ள desktop head:

```
dotnet run --project samples/Gallery.Avalonia
```

இது headless ஆகவும் வரைகிறது; CI மற்றும் pixel-diff சோதனைகளுக்குப் பயனுள்ளது:

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

## Gallery.Uno
{:#galleryuno}

அதே கட்டுப்பாட்டுக் காட்சியகம் **Uno** பின்தளத்தில் இயங்குகிறது — desktop, iOS, Android மற்றும் WebAssembly வரை எட்டும்.

```
dotnet run --project samples/Gallery.Uno
```

இதற்கு ஒரு windowing session தேவை, எனவே இது headless CI build-இன் பகுதி அல்ல; இதன் Uno packages மாதிரியின்
சொந்த `nuget.config` வழியாக nuget.org இலிருந்து restore ஆகின்றன. முழுக் காட்சியகத்தையும் தொடங்கி வரைவது
macOS இல் சரிபார்க்கப்பட்டது.

## Gallery.Gtk4
{:#gallerygtk4}

அதே காட்சியகம் **GTK 4** பின்தளத்தில் (gir.core) — ஓர் உண்மையான `Gtk.Window`, Linux-ஐ முதன்மையாகக் கொண்டது.

```
dotnet run --project samples/Gallery.Gtk4                    # முழு ControlGallery
MF_GTK4_DEMO=1 dotnet run --project samples/Gallery.Gtk4     # சிறிய render + input smoke படிவம்
MF_GTK4_WEBVIEW=1 dotnet run --project samples/Gallery.Gtk4  # WebKitGTK 6.0 இல் ஒரு WebBrowser
```

இதற்கு ஒரு display session (X11/Wayland) மற்றும் GTK 4 native libraries தேவை (webview படிவத்துக்குக் கூடுதலாக
`libwebkitgtk-6.0` தேவை), எனவே இது headless CI build-இன் பகுதி அல்ல. இதன் `GirCore.*` packages மாதிரியின் சொந்த
`nuget.config` வழியாக nuget.org இலிருந்து restore ஆகின்றன. `MF_GTK4_SELFTEST=1` ஊடாடல் இல்லாத ஒரு சோதனையை
இயக்கிவிட்டு வெளியேறுகிறது. முழுக் காட்சியகத்தையும் தொடங்கி வரைவது Wayland இல் சரிபார்க்கப்பட்டது. GTK 4 பின்தளம் எதைச்
செய்கிறது, எதை இன்னும் செய்வதில்லை என்பதற்கு [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) பார்க்கவும்.

## Gallery.Wasm
{:#gallerywasm}

அதே கட்டுப்பாட்டுக் காட்சியகம் மீண்டும், இம்முறை Avalonia பின்தளத்தின் `net10.0-browser` target-இல் உலாவியில்
இயங்குகிறது — **[நேரடியாக முயற்சிக்கவும்]({{ '/gallery/' | relative_url }})**, நிறுவல் எதுவும் தேவையில்லை.
இது WebAssembly-க்கு compile செய்யப்பட்ட உண்மையான framework; எனவே முதல் ஏற்றத்தின்போது .NET runtime பதிவிறக்கம் ஆகும்.

இதை நீங்களே build செய்ய, wasm-tools workload ஒருமுறை தேவை:

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

பின்னர் `out/wwwroot`-ஐ ஏதேனும் ஒரு static file server மூலம் serve செய்து `index.html`-ஐத் திறக்கவும் — WebAssembly SDK
திட்டங்கள் சாதாரண exe போல `dotnet run` மூலம் serve செய்யப்படுவதில்லை. அல்லது toolchain-ஐத் தவிர்க்கலாம்: ஒவ்வொரு PR-இலும்
CI build செய்யும் `gallery-wasm` bundle ஒவ்வொரு GitHub Release-உடனும் இணைக்கப்படுகிறது. Build விவரங்களுக்கும் தற்போதைய
வரம்புகளுக்கும் [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}#running-in-the-browser-webassembly)
பார்க்கவும்.

> **அறியப்பட்ட இடைவெளி:** காட்சியகத்தின் icons உலாவியில் வரையப்படுவதில்லை (Android அல்லது iOS இலும் இல்லை) — அவற்றை
> முன்கூட்டியே ஏற்றுவதற்கான `WasmFilesToIncludeInFileSystem` item-ஐ WebAssembly SDK எந்த அறிவிப்புமின்றிப் புறக்கணிக்கிறது,
> எனவே `Bitmap(string)` ஒரு 1×1 placeholder ஆகக் குறைகிறது. கண்ணுக்குத் தெரியாத icons உடன் பயன்பாடு சீராகத் தொடங்குகிறது.

உலாவி head **browser-head சோதனைகளையும்** கொண்டுள்ளது: வெளியிடப்பட்ட bundle-ஐ `?check=<name>` உடன் திறந்தால், பக்கம்
காட்சியகத்துக்குப் பதிலாக ஒரு சோதனையை இயக்கும் — தடுக்கும் (blocking) modal அழைப்புகள் (இவை உலாவியில் தமது async இணையின்
பெயரைக் குறிப்பிட்டு exception எறிகின்றன), அவற்றின் await செய்யக்கூடிய வடிவங்கள், ஓர் accessibility-DOM சோதனை மற்றும்
நான்கு வரைதல் சோதனைகள் — இவை console-இல் `MFCHECK` வரிகளை எழுதுகின்றன. `tools/modal-check.mjs` அவை அனைத்தையும்
headless Chrome இல் இயக்குகிறது; CI அதை `wasm` job-இல் `--expect` உடன் இயக்குகிறது. அதே படிவம் Android மற்றும் iOS
head-களிலும் இணைக்கப்பட்டுள்ளது; ஒவ்வொன்றுக்கும் அதன் சொந்த `tools/modal-check.sh` உண்டு. பெயர்கள், environment variables
மற்றும் எதிர்பார்க்கப்படும் முடிவுகள் அனைத்தும் repository-இல் உள்ள
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md#gallerywasm) இல் உள்ளன.

## Gallery.Android (Android மட்டும், பணி நடைபெறுகிறது)
{:#galleryandroid}

அதே `ControlGallery` `MainForm` மீண்டும், Avalonia பின்தளத்தின் Android target-இல், ஒற்றை Activity ஒன்றால்
ஹோஸ்ட் செய்யப்படுகிறது. `android` workload தேவை:

```
dotnet workload install android
dotnet build samples/Gallery.Android -t:Run
```

Workload நிறுவப்பட்டதும், `Directory.Build.props` அதைக் கண்டறிந்து இந்தத் திட்டத்தை அதன் stub build-இலிருந்து உண்மையான
`net10.0-android` head-க்குத் தானாக மாற்றுகிறது — எனவே repo root-இல் சாதாரண `dotnet build` / `dotnet test`-க்கு ஒருபோதும்
workload தேவையில்லை, மேலும் Visual Studio ஒரு emulator-க்கு எதிராக F5 உடன் நேரடியாக வேலை செய்கிறது. கட்டாயப்படுத்த
`-p:EnableAndroidTarget=true` கொடுக்கவும்; அது கட்டுப்படுத்தப்படாதது (ungated), எனவே workload இல்லாவிட்டால் அமைதியாக stub-க்குத்
திரும்பாமல் build தோல்வியடையும்.

> Android ஆதரவு ஆரம்ப நிலையில் உள்ளது. இது ஓர் ஆரம்ப உண்மைச் சாதனச் சோதனையைக் கடந்துள்ளது — காட்சியகம் தொடங்குகிறது
> (அங்கே AppCompat-theme தொடக்க crash ஒன்று கண்டறியப்பட்டுச் சரிசெய்யப்பட்டது), மேலும் tap hit-testing, render அளவிடுதல் (scaling)
> மற்றும் touch scroll/flick ஆகியவை வன்பொருளில் வேலை செய்வது உறுதிப்படுத்தப்பட்டுள்ளது — ஆனால் திரை விசைப்பலகை, safe-area insets,
> சுழற்சி மற்றும் முழுக் கட்டுப்பாட்டு உள்ளடக்கம் ஆகியவை desktop மற்றும் உலாவிப் பின்தளங்கள் பெற்ற அதே அளவு சோதனையைப் பெறவில்லை.
> குறைபாடுகளை எதிர்பாருங்கள்.

CI ஒவ்வொரு PR-இலும் sideload செய்யக்கூடிய APK + AAB-ஐ வெளியிட்டு (artifact `gallery-android`) அவற்றை ஒவ்வொரு
GitHub Release-உடனும் இணைக்கிறது. Android உலாவியின் ஒற்றைக் காட்சி ஹோஸ்ட்-ஐப் பகிர்ந்துகொள்கிறது, எனவே அதே window-chrome
மற்றும் WebView வரம்புகள் இங்கும் பொருந்தும் — [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) பார்க்கவும்.

## Gallery.iOS (iOS மட்டும், சரிபார்க்கப்படவில்லை)
{:#galleryios}

iOS இணை, ஒற்றை `UIViewController` ஒன்றால் ஹோஸ்ட் செய்யப்படுகிறது. `ios` workload உள்ள ஒரு Mac தேவை:

```
dotnet workload install ios
dotnet build samples/Gallery.iOS -t:Run
```

`Gallery.Android` போலவே, ஒரு mobile workload இருக்கும்போது `Directory.Build.props` இதை stub-இலிருந்து உண்மையான `net10.0-ios`
head-க்குத் தானாக மாற்றுகிறது — ஆனால் macOS இல் மட்டும், ஏனெனில் `ios` workload வேறெங்கும் இல்லை. `-p:EnableIOSTarget=true`
மூலம் கட்டாயப்படுத்தவும்; `EnableMobileHeads` குடை property-ஐ விட இதையே விரும்புங்கள், ஏனெனில் `android` workload இல்லாத
Mac இல் அது `net10.0-android` வரிசையையும் கேட்டுத் தோல்வியடையும்.

> iOS மிகக் குறைவாக நிரூபிக்கப்பட்ட பின்தளம்: இது Avalonia.iOS இன் API மேற்பரப்பு மற்றும் வழக்கமான .NET-for-iOS
> நடைமுறைகளின் அடிப்படையில் எழுதப்பட்டது. CI இன் `ios` job (`macos-latest` இல்) இப்போது உண்மையான head-ஐ compile செய்து
> smoke சோதனையாக ஒரு simulator-இல் தொடங்குகிறது — ஆனால் அந்த job இன்னும் `continue-on-error` ஆகவே உள்ளது, மேலும் யாரும் அதை
> ஒரு சாதனத்தில் ஊடாடும் முறையில் இயக்கவில்லை. குறைபாடுகளை regression ஆக அல்ல, எதிர்பார்க்கப்பட்டவையாகக் கருதுங்கள்.

Build வெற்றியடையும்போது CI ஒவ்வொரு PR-இலும் zip செய்யப்பட்ட iOS-simulator `.app` ஒன்றை வெளியிட்டு (artifact `gallery-ios`)
அதை ஒவ்வொரு GitHub Release-உடனும் இணைக்கிறது. கையொப்பமிடப்பட்ட சாதன `.ipa` இல்லை — அதற்கு Apple distribution
certificate தேவை.

## Gallery.Terminal
{:#galleryterminal}

அதே காட்சியகம் **Terminal** பின்தளத்தில்: படிவம் title bar இல்லாமல் terminal முழுவதையும் நிரப்புகிறது, ஒரு
தொலைபேசித் திரையை நிரப்புவது போல. Skia திரைக்கு வெளியே (offscreen) வரைகிறது; terminal ஆதரிக்கும் இடங்களில் அதன்
உண்மையான pixel resolution-இல் Kitty graphics அல்லது Sixel ஆகவும், இல்லையெனில் Unicode block elements ஆகவும் காட்டப்படுகிறது.

```
dotnet run --project samples/Gallery.Terminal                       # முழு ControlGallery
MF_TERMINAL_DEMO=1 dotnet run --project samples/Gallery.Terminal    # அதற்குப் பதிலாக ஒரு சிறிய smoke படிவம்
```

இதை truecolor terminal ஒன்றில் இயக்குங்கள். Output mode terminal-இடம் கேட்டுக் கண்டறியப்படுகிறது;
`MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` ஒன்றைக் கட்டாயப்படுத்துகிறது, மேலும் `MF_TERMINAL_SCALE=0.5` படிவத்தை
pixel grid-ஐ விட இருமடங்கு பெரிய canvas-இல் அமைக்கிறது (பழைய half-block முறையில் பயனுள்ளது). Mouse மற்றும் விசைப்பலகை
வேலை செய்கின்றன; Ctrl+C எப்போதும் வெளியேறும். இதுவரை xterm மற்றும் WezTerm இல் சரிபார்க்கப்பட்டது. பின்தளத்தின்
வரம்புகளுக்கு (native pickers, `NativeControlHost` அல்லது web view இல்லை) [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }})
பார்க்கவும்.

## Gallery.Wpf (Windows மட்டும்)
{:#gallerywpf}

அதே காட்சியகம் **WPF** பின்தளத்தில் — ஓர் உண்மையான WPF `Window`, Skia ஒரு `WriteableBitmap` மூலம் காட்டப்படுகிறது.
WPF தானாகத் தேர்ந்தெடுக்கப்படும் இயல்புநிலைப் பின்தளம் அல்ல, எனவே head அதை முதல் சாளரத்துக்கு முன்பே வெளிப்படையாக
நிறுவுகிறது (`Platform.Backend = new WpfPlatformBackend ();`).

```
dotnet run --project samples/Gallery.Wpf
```

WinForms பின்தளத்தைப் போலவே, இது Windows-க்கு மட்டுமான ஒரு *இடம்பெயர்த்தல்* பின்தளம் —
[தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) பார்க்கவும்.

## Explorer
{:#explorer}

Windows Explorer இன் நகல் — கோப்பு உலாவல், tree வழிசெலுத்தல் மற்றும் list views, முக்கியக் கட்டுப்பாட்டுத் தொகுப்பை
முழுமையாகப் பயன்படுத்துகிறது. திட்டம் `samples/Explorer` இல் உள்ளது, அதன் பெயர் `Explore.csproj`.

```
dotnet run --project samples/Explorer
```

Windows, Ubuntu மற்றும் macOS இல் இயங்குவது சரிபார்க்கப்பட்டது.

## Outlaw
{:#outlaw}

Microsoft Outlook இன் நகல்; ஒரு விளையாட்டு demo அல்ல, சிக்கலான, பல-pane கொண்ட, நிஜ உலகப் பயன்பாட்டு வடிவத்தை
Majorsilence.Forms தாங்குவதைக் காட்டுகிறது.

```
dotnet run --project samples/Outlaw
```

## PointOfSale
{:#pointofsale}

ஒற்றைச் சாளர demo அல்ல, நான்கு திட்டங்களாகப் பிரிக்கப்பட்ட முழுமையான வணிக (LOB) பயன்பாடு — ஓர் உண்மையான
Majorsilence.Forms பயன்பாடு எடுக்கும் வடிவம்:

| திட்டம் | பங்கு |
|---|---|
| `PointOfSale.Client` | Majorsilence.Forms desktop பயன்பாடு (படிவங்கள், panels, தனிப்பயன் கட்டுப்பாடுகள், services) |
| `PointOfSale.Api` | JWT auth மற்றும் role அடிப்படையிலான policies கொண்ட ASP.NET Core minimal API |
| `PointOfSale.Contracts` | இரு பக்கங்களும் பகிர்ந்துகொள்ளும் DTOs |
| `PointOfSale.Data` | EF Core + SQLite persistence மற்றும் seeding (`tests/PointOfSale.Data.Tests` மூலம் சோதிக்கப்படுகிறது) |

முதலில் API-ஐத் தொடங்குங்கள், பிறகு client-ஐ — client தனது சொந்த `appsettings.json` இலிருந்து `ApiBaseUrl`-ஐ (மற்றும் அதன்
kiosk-mode அமைப்புகளை) படிக்கிறது; இயல்புநிலை `http://127.0.0.1:5000`:

```
dotnet run --project samples/PointOfSale/PointOfSale.Api
dotnet run --project samples/PointOfSale/PointOfSale.Client
```

முதல் இயக்கத்தின்போது API ஒரு local `pos.db`-ஐ உருவாக்கி seed செய்கிறது. `appsettings.json` இல் உள்ள இயல்புநிலை JWT signing key
ஒரு placeholder மட்டுமே, இரகசியம் அல்ல — அதை `appsettings.Development.json` அல்லது environment-இல் override செய்யுங்கள்.
மூலம்: [`samples/PointOfSale`]({{ site.github_url }}/tree/main/samples/PointOfSale).

## ThemeStudio
{:#themestudio}

CSS தீம்களை எழுதுவதற்கான ஒரு desktop பயன்பாடு: இடப்பக்கம் CSS திருத்தி, வலப்பக்கம் தீம் செய்யக்கூடிய ஒவ்வொரு
கட்டுப்பாட்டிலும் ஒன்று, கீழே parser இன் diagnostics. ஒவ்வொரு திருத்தமும் stylesheet-ஐ மீண்டும் பொருத்துகிறது (Studio-வின் சொந்தச்
சாளரத்துக்கும்), திறக்கப்பட்ட கோப்பு disk-இல் கண்காணிக்கப்படுகிறது, எனவே வெளிப்புறத் திருத்தி அல்லது coding assistant அதை இயக்க
முடியும், மேலும் **Copy reference for AI** ஒரு assistant-க்கு prompt கொடுப்பதற்காக முழுமையான theming reference-ஐ clipboard-இல்
வைக்கிறது.

```
dotnet run --project samples/ThemeStudio                                           # Light தீமை CSS ஆகக் கொண்டு தொடங்கவும்
dotnet run --project samples/ThemeStudio -- samples/ThemeStudio/Themes/ocean.css   # ஒரு தீமைத் திறந்து கண்காணிக்கவும்
dotnet run --project samples/ThemeStudio -- --render-headless out.png samples/ThemeStudio/Themes/paper.css --tab 1
```

கடைசி வடிவம் display இல்லாமல் முன்னோட்டத்தை ஒரு PNG ஆக வரைகிறது (tabs: 0 inputs, 1 lists மற்றும் grids,
2 menus மற்றும் chrome, 3 token swatches, 4 native Avalonia); தீமில் பிழைகள் இருந்தால் பூஜ்ஜியமல்லாத code உடன் வெளியேறுகிறது.
Tab 4, `Majorsilence.Forms.Theming.Avalonia` மூலம் அதே stylesheet-ஆல் தீம் செய்யப்பட்ட உண்மையான Avalonia கட்டுப்பாடுகளை
ஹோஸ்ட் செய்கிறது.

`samples/ThemeStudio/Themes/` தொடங்குவதற்கான உதாரணத் தீம்களுடன் வருகிறது: `light.css` மற்றும் `dark.css` (ஒரே accent-ஐப்
பகிரும் பொருந்திய ஜோடி, எனவே எதுவும் நகராமல் ஒரு பயன்பாடு mode-களை மாற்ற முடியும்), `ocean.css`, `graphite.css`, `paper.css`
மற்றும் `parchment.css`. `win-x64`, `linux-x64` மற்றும் `osx-arm64` க்கான முன்கூட்டியே build செய்யப்பட்ட, self-contained ThemeStudio
binaries ஒவ்வொரு GitHub Release-உடனும் இணைக்கப்படுகின்றன. Theming reference repository-இல் உள்ள
[`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) ஆகும்.

## ThemeStudio.WinForms (Windows மட்டும்)
{:#themestudiowinforms}

**உண்மையான `System.Windows.Forms`** பயன்பாடுகளுக்கான Theme Studio இன் Windows-க்கு மட்டுமான head: அதே திருத்தி மற்றும்
diagnostics, applier map செய்யும் ஒவ்வொரு WinForms கட்டுப்பாட்டிலும் ஒன்றின் முன்னோட்டத்துடன், `Majorsilence.Forms.Theming.WinForms`
மூலம் தீம் செய்யப்படுகிறது. WinForms வெளிப்படுத்த முடியாதவற்றை (info / warning) diagnostics பட்டியல் parser இன் சொந்த
diagnostics உடன் சேர்க்கிறது.

```
dotnet run --project samples/ThemeStudio.WinForms                                              # Light தீமை CSS ஆகக் கொண்டு தொடங்கவும்
dotnet run --project samples/ThemeStudio.WinForms -- samples/ThemeStudio/Themes/graphite.css   # ஒரு தீமைத் திறந்து கண்காணிக்கவும்
dotnet run --project samples/ThemeStudio.WinForms -- --screenshot out.png samples/ThemeStudio/Themes/graphite.css
```

`--screenshot` முன்னோட்டத்தை `Control.DrawToBitmap` மூலம் வரைகிறது — WinForms க்கு headless பின்தளம் இல்லை, எனவே ஒரு
desktop session இன்னும் தேவை — மேலும் parse பிழைகள் இருந்தால் பூஜ்ஜியமல்லாத code உடன் வெளியேறுகிறது. ஒரு `win-x64` build,
ThemeStudio binaries உடன் சேர்த்து ஒவ்வொரு GitHub Release-உடனும் இணைக்கப்படுகிறது.
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md) பார்க்கவும்.

## EmbeddingAvalonia / EmbeddingUno / EmbeddingWinForms / EmbeddingGtk4
{:#embedding}

எதிர்த் திசை: Majorsilence.Forms மேல்நிலைச் சாளரத்தைச் சொந்தமாக்க விடாமல், Majorsilence.Forms கட்டுப்பாடுகளையும்
சாளரங்களையும் தனது சொந்த native ஆனவை போலப் பயன்படுத்தும் ஒரு சாதாரண Avalonia, Uno, பாரம்பரிய WinForms அல்லது GTK 4 பயன்பாடு.

```
dotnet run --project samples/EmbeddingAvalonia
dotnet run --project samples/EmbeddingUno
dotnet run --project samples/EmbeddingWinForms   # Windows மட்டும்
dotnet run --project samples/EmbeddingGtk4       # ஒரு display + GTK 4 தேவை
```

ஒவ்வொரு சாளரமும் native ஹோஸ்ட் கட்டுப்பாடுகளையும் உட்பொதிக்கப்பட்ட (embedded) Majorsilence.Forms காட்சியையும் அருகருகே வைக்கிறது:

- `ToAvaloniaControl()` / `ToUnoControl()` / `ToWinFormsControl()` / `ToGtkWidget()` — `MajorsilenceFormsPresenter` வழியாக
  native ஒன்றாக ஹோஸ்ட் செய்யப்பட்ட ஒரு Majorsilence கட்டுப்பாடு.
- `ToAvaloniaWindow()` / `ToUnoWindow()` / `ToWinFormsForm()` / `ToGtkWindow()` — ஒரு Majorsilence `Form` இன் பின்தளச் சாளரம்
  ஹோஸ்ட்-இடம் திருப்பிக் கொடுக்கப்படுகிறது. Avalonia, WinForms மற்றும் GTK 4 க்கு உண்மையான OS-நிலை modal உரையாடல் சாளரம்
  கிடைக்கிறது; இந்தப் பின்தளத்தில் Uno க்கு owner என்ற கருத்து இல்லை, எனவே அதற்குச் சுயாதீனமான மேல்நிலைச் சாளரம் கிடைக்கிறது,
  அங்கே modal நடத்தையைப் பெற `Form.ShowDialog(parent)` தான் வழி.
- `NativeControlHost` — Majorsilence காட்சியின் *உள்ளே* ஹோஸ்ட் செய்யப்பட்ட ஒரு native button, மீண்டும் மற்றத் திசை
  (நான்கிலும்; GTK 4 இல் இது "airspace" பிரச்சினை இல்லாமல் சீராக composite ஆகிறது).
  [Native interop]({{ '/ta/native-interop/' | relative_url }}) பார்க்கவும்.

`EmbeddingWinForms` இரு பாதிகளையும் ஒரே stylesheet, `Themes/graphite.css` இலிருந்து `WinFormsCssTheme` மூலம் தீம் செய்கிறது
(தீம் இல்லாத தோற்றத்துக்கு `--no-theme`); `EmbeddingAvalonia` அதையே `AvaloniaCssTheme` மூலம் செய்கிறது (அதன்
**Apply ocean.css** button, அல்லது `--theme file.css`; மேலும் `--render-headless out.png` சாளரத்தைத் திரைக்கு வெளியே வரைந்து
வெளியேறுகிறது). Avalonia மற்றும் Uno மாதிரிகள் ஹோஸ்ட் தீமையும் மாற்றுகின்றன, எனவே Majorsilence.Forms கட்டுப்பாடுகள் அதைப்
பின்பற்றுவதை நீங்கள் பார்க்கலாம். WinForms மாதிரி, WinForms பின்தளத்தில் ஒவ்வொரு கட்டுப்பாடாக port செய்யும் இடம்பெயர்த்தல்
வழி; GTK 4 மாதிரி அதன் ஹோஸ்ட் `Gtk.Application` இன் loop-ஐ, அதனுள் Gtk4 பின்தளத்துடன் இயக்குகிறது (ஊடாடல் இல்லாத சோதனைக்கு
`EMBED_SELFTEST=1`). API மற்றும் பின்தளங்களுக்கு இடையிலான owner/modal வேறுபாடுகளுக்கு
[ஹோஸ்ட் பயன்பாட்டில் உட்பொதித்தல்]({{ '/ta/backends/' | relative_url }}#embedding-in-a-host-app) பார்க்கவும்.

## WinFormsInterop (Windows மட்டும்)
{:#winformsinterop}

ஒரே process-இல் `System.Windows.Forms` மற்றும் Majorsilence.Forms இடையிலான இருதிசை interop-ஐக் காட்டுகிறது — மாதிரி ஓர்
உண்மையான WinForms ஹோஸ்ட் ஆகத் தொடங்குகிறது, திறக்கப்படும் ஒவ்வொரு Majorsilence.Forms சாளரமும் தன் பங்குக்குப் பழைய
WinForms படிவங்களைத் திறக்க முடியும். இது Avalonia பின்தளத்தில் முழுப் படிவ இணைப்பு (bridging); `EmbeddingWinForms`
பயன்படுத்தும் WinForms பின்தளத்திலிருந்து வேறுபட்டது.

```
dotnet run --project samples/WinFormsInterop
```

முழு API-க்கு [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) பார்க்கவும்.

## WinFormsCompatDemo
{:#winformscompatdemo}

`WinFormsInterop` உடன் குழப்பிக்கொள்ள வேண்டாம்: இந்த process-இல் எங்கும் உண்மையான `System.Windows.Forms` assembly இல்லை.
`Form1.cs`/`Form1.Designer.cs` சாதாரண, மாற்றப்படாத WinForms designer உருவாக்கிய மூலக் குறியீடு — ஒரு `Button`, `Label`,
`TextBox`, ஒரு `MessageBox.Show(...)` அழைப்பு — இவை Majorsilence.Forms க்கு எதிராக compile ஆகின்றன, ஏனெனில்
`Majorsilence.Forms.WinFormsShims.Compat` Roslyn source generator அதனால் ஆதரிக்கப்படும் அதே பெயருடைய `System.Windows.Forms`
namespace-ஐ, முற்றிலும் compile நேரத்திலேயே, உருவாக்குகிறது. மாதிரி Avalonia பின்தளத்தை reference செய்கிறது, எனவே
`Application.Run` வெறும் compile சோதனை அல்ல, ஓர் உண்மையான சாளரத்தைத் திறக்கிறது.

```
dotnet run --project samples/WinFormsCompatDemo
```

இதன் [`RESULTS.md`]({{ site.github_url }}/blob/main/samples/WinFormsCompatDemo/RESULTS.md) இன்றைய நிலையில் இந்த
மாற்றத்தில் எது தப்புகிறது, எது தப்புவதில்லை என்பதைப் பதிவு செய்கிறது — designer உருவாக்கிய படிவம் பிழையின்றி compile ஆகிறது,
முதலில் உடைவது `PaintEventArgs` போன்ற `EventHandler` அல்லாத delegate-க்கு type செய்யப்பட்ட ஒரு handler ஆகும்.
இது எங்கே பொருந்துகிறது என்பதற்கு [இடம்பெயர்த்தல்]({{ '/ta/migration/' | relative_url }}) பார்க்கவும்.

## AutomationTarget
{:#automationtarget}

தன் மீதே ஒரு `WebDriverServer`-ஐத் தொடங்கும், வேண்டுமென்றே சிறியதாக வைக்கப்பட்ட ஒரு பயன்பாடு; automation கருவிகளைக்
கற்கும்போது — MCP server, Selenium client அல்லது சாதாரண `curl` மூலம் — இயக்குவதற்கு உண்மையான ஒன்று இருக்கும்.

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

இது endpoint-ஐயும் அதை இயக்குவதற்கான கட்டளைகளையும் அச்சிடுகிறது. `--webdriver <port>` port-ஐத் தேர்ந்தெடுக்கிறது (இயல்புநிலை
4444); `--no-webdriver` அதை ஒரு சாதாரண பயன்பாடாக இயக்குகிறது. ஒவ்வொரு கட்டுப்பாடும் ஒரு client சமாளிக்க வேண்டிய ஒரு விடயத்தைக்
காட்டுகிறது — click செய்யப்பட மறுக்கும் ஒரு கட்டுப்பாடு, ஒரு checkbox tick செய்யப்பட்ட பின்னரே இயங்கும் ஒன்று, வேண்டுமென்றே பெயரிடப்படாமல்
விடப்பட்ட ஒன்று — மேலும் ஒவ்வொரு செயலும் திரையிலும் stdout-இலும் பதிவு செய்யப்படுகிறது, எனவே ஒரு client கூறுவதைப் பயன்பாடு
உண்மையில் கண்டதுடன் ஒப்பிட்டுச் சரிபார்க்கலாம். இங்கே screenshots வடிவமைப்பின்படியே கிடைக்காது: இது Avalonia இல் இயங்குகிறது,
படம் பிடிப்பது Headless பின்தளத்தின் பணி.

கட்டுப்பாடு வாரியான விளக்கத்துக்கு [`samples/AutomationTarget/README.md`]({{ site.github_url }}/blob/main/samples/AutomationTarget/README.md)
பார்க்கவும்; கருவிகளுக்கு [Automation மற்றும் UI சோதனை]({{ '/ta/automation/' | relative_url }}) பார்க்கவும்.

## மூலக் குறியீட்டிலிருந்து build செய்தல்
{:#building-from-source}

- [Repository]({{ site.github_url }})-ஐ clone செய்யுங்கள்
- .NET 10 SDK-ஐ நிறுவுங்கள்
- உங்கள் IDE இல் `Majorsilence.Forms.slnx`-ஐத் திறக்கவும், அல்லது எந்த மாதிரியையும் `dotnet run --project samples/<Name>` மூலம் நேரடியாக இயக்குங்கள்

`Gallery.Android` மற்றும் `Gallery.iOS` solution-இல் உள்ளன, ஆனால் பொருந்தும் workload நிறுவப்படாவிட்டால் வெற்று stub libraries
ஆக compile ஆகின்றன, எனவே repo root-இல் சாதாரண `dotnet build` / `dotnet test` எந்தத் தள workload உம் இல்லாமல் வேலை செய்கிறது.
ஒரு தளத்தைக் கட்டாயப்படுத்த `-p:EnableAndroidTarget=true` அல்லது `-p:EnableIOSTarget=true` பயன்படுத்துங்கள்.

தளம் சார்ந்த build குறிப்புகளுக்கு repository-இல் உள்ள
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md) பார்க்கவும்.
