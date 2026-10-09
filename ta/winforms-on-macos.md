---
layout: docs
lang: ta
title: macOS-இல் WinForms
subtitle: Apple Silicon மற்றும் Intel Mac-களில் ஒரு Windows Forms குறியீட்டுத் தளத்தை இயக்குதல் — எது வேலை செய்கிறது, எது வேறுபட்டு உணரப்படுகிறது, ஒரு .app-ஐ எப்படி வழங்குவது.
permalink: /ta/winforms-on-macos/
seo_title: "WinForms-ஐ macOS-இல் இயக்குவது எப்படி — பல்தள Windows Forms"
description: >-
  Windows Forms ஒருபோதும் Mac-இல் இயங்கியதில்லை. Majorsilence.Forms உங்கள் WinForms பயன்பாட்டை
  Apple Silicon மற்றும் Intel-இல் native ஆக இயக்குவது எப்படி — ஒரு .app bundle-ஐ வழங்குவதும் சேர்த்து.
keywords:
  - WinForms Mac
  - winforms on mac
  - Windows Forms macOS-இல் இயக்குதல்
  - macOS-இல் WinForms இயக்குவது எப்படி
  - c# winforms mac
  - Mac-க்கான .NET GUI framework
  - winforms apple silicon
  - system.windows.forms macos
  - winforms dark mode mac
priority: "0.9"
---

## சாதாரண WinForms-ஆல் ஏன் இதைச் செய்ய முடியாது
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` Windows Desktop runtime-இல் உள்ளது, `user32.dll` மற்றும் GDI+-ஐ உறையிடுகிறது. அதற்கு macOS build இல்லை, ஒருபோதும் இருந்ததுமில்லை — ஒரு `net10.0-windows` திட்டம் Mac-இல் build கூட ஆகாது. வழக்கமான சுற்றுவழிகளும் நிலைக்கவில்லை: Mono-வின் WinForms port நவீன .NET-க்கு ஒருபோதும் வரவில்லை, .NET 7 முதல் `System.Drawing.Common` Windows-க்கு வெளியே `PlatformNotSupportedException`-ஐ எறிகிறது, பயன்பாட்டை ஒரு Windows VM அல்லது CrossOver கீழ் இயக்கினால் நீங்கள் இன்னும் ஒரு Windows பயன்பாட்டையே வழங்குகிறீர்கள்.

## அதற்குப் பதிலாக Majorsilence.Forms என்ன செய்கிறது
{:#what-majorsilenceforms-does-instead}

அது WinForms API-ஐ SkiaSharp மீது மீண்டும் செயல்படுத்தி, Avalonia வழியாக ஒரு உண்மையான `NSWindow`-இல் ஹோஸ்ட் செய்கிறது. ஒரு சாதாரண `net10.0` build — `-windows` TFM இல்லாமல் — **Apple Silicon (arm64) மற்றும் Intel (x64)** Mac-களில் native ஆகத் தொடங்கும் ஒரு பயன்பாட்டை உருவாக்குகிறது.

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

வார்ப்புரு (template) ஒரு பகிரப்பட்ட UI நூலகத்தையும் ஒரு desktop head-ஐயும் உருவாக்குகிறது; அதே மூலக் குறியீடு Windows மற்றும் Linux-இல் மாற்றமின்றி build ஆகிறது.

## macOS-இல் உண்மையில் எது வேலை செய்கிறது
{:#what-actually-works-on-macos}

| பகுதி | macOS-இல் |
|---|---|
| சாளரங்கள் மற்றும் உள்ளீடு | Avalonia பின்தளம் வழியாக native `NSWindow`, வழக்கமான macOS traffic-light chrome மற்றும் native இழுத்தல்/அளவு மாற்றுதலுடன் |
| Apple Silicon | Native arm64 — `osx-arm64` மற்றும் `osx-x64` இரண்டும் சாதாரண publish இலக்குகள் |
| வரைதல் (rendering), Retina | SkiaSharp, GPU-முடுக்கப்பட்டது, HiDPI-ஐ அறிந்தது — Windows மற்றும் Linux-இல் உள்ள அதே வரைதல் குறியீடு |
| எழுத்துருக்கள் மற்றும் உரை | SkiaSharp மூலம் CoreText வழியாகக் கண்டறியப்படுகின்றன, இல்லாதவற்றுக்கு உள்ளடக்கப்பட்ட மாற்று (fallback) எழுத்துருத் தொகுப்புடன் |
| GDI+ / `System.Drawing` குறியீடு | `Majorsilence.Forms.Drawing` மூலம் மாற்றீடு — `Bitmap`, `Font`, `Pen`, `Brush`, `Region`, `Drawing2D`, `Imaging`, EMF/WMF playback |
| பொதுவான உரையாடல் சாளரங்கள் | பின்தளம் வழியாக native open/save/folder/colour/font உரையாடல் சாளரங்கள் |
| அச்சிடுதல் | `PrintDocument` Skia வழியாக PDF-க்கு வரைகிறது, ஒவ்வொரு OS-இலும் ஒரே மாதிரி |
| WebView கட்டுப்பாடுகள் | உண்மையான `WKWebView`, inline PDF வரைதல் உட்பட |
| ஒலி | `afplay` வழியாக இயக்கப்படுகிறது |
| பாதுகாப்பான சேமிப்பு மற்றும் பேச்சு | `Majorsilence.Forms.Essentials`: `SecureStorage` Keychain Services-இல் எழுதுகிறது, `Speech` கணினியின் `say` குரலைப் பயன்படுத்துகிறது; இரண்டும் `IsSupported`-ஐத் தெரிவிக்கின்றன, exception எறிவதற்குப் பதிலாக no-op ஆகக் குறைகின்றன |
| தீம்கள் மற்றும் dark mode | தீம்கள் CSS கோப்புகள் (ஆவணப்படுத்தப்பட்ட ஒரு உட்பிரிவு); `BuiltInTheme.Default` OS-இன் light/dark தோற்றத்தைப் பின்பற்றுகிறது, `Theme.SetBuiltInTheme`/`Theme.ApplyTheme` இயக்க நேரத்தில் மாற்றுகின்றன. [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) மாதிரி preview கொண்ட ஒரு நேரடி CSS editor; முன்கூட்டியே build செய்யப்பட்ட binaries GitHub Releases-இல் இணைக்கப்பட்டுள்ளன |
| Trackpad சைகைகள் | `Pinch`, `Swipe`, `LongPress` மற்றும் momentum `ScrollGesture` ஆகியவை முதல்தர நிகழ்வுகள்; `ScrollableControl` ஏற்கனவே அவற்றைப் பயன்படுத்துகிறது, எனவே `Panel`/`ListBox`/`TreeView` பயன்பாட்டில் எந்த மாற்றமும் இல்லாமல் pan ஆகின்றன |
| Native சாளர handle | `WindowBase.PlatformHandle` வழியாக ஓர் உண்மையான `NSWindow` pointer (*கட்டுப்பாடு*-வாரியான handles எல்லா இடங்களிலும் `IntPtr.Zero` — [Native interop]({{ '/ta/native-interop/' | relative_url }}) பாருங்கள்) |
| Uno பின்தளம் | ஆதரிக்கப்படுகிறது; macOS-இல் boot ஆகி ஒரு முழுப் படிவத்தை வரைவதும் சரிபார்க்கப்பட்டது — Uno-வில் ஹோஸ்ட் செய்ய விரும்பினால் |
| GTK 4 பின்தளம் | Homebrew-இலிருந்து GTK runtime உடன் (`brew install gtk4`) macOS-இல் compile ஆகி இயங்குகிறது — இது Linux-முதன்மைப் பின்தளம், எனவே AppKit சாளரம் அல்லாமல் GTK சாளரத்தை எதிர்பாருங்கள்; முக்கியமாக Mac-இல் GTK head-ஐச் சோதிக்கப் பயனுள்ளது |

## எங்கே அது Mac போல உணரப்படாது
{:#where-it-will-feel-un-mac-like}

வடிவமைப்பு மதிப்பாய்வுக்கு முன் தெரிந்துகொள்வது நல்லது, ஏனெனில் இவை bugs அல்ல, இணக்க மாதிரியின் விளைவுகள்:

- **Menu bar சாளரத்துக்குள் உள்ளது.** `MenuStrip` என்பது WinForms வரைவது போலவே படிவத்துக்குள் மேலே பொருத்தப்பட்ட ஓர் உண்மையான bar — அது திரையின் மேலே உள்ள macOS global menu bar-இல் காட்டப்படுவதில்லை.
- **கட்டுப்பாடுகள் வரையப்படுகின்றன, native அல்ல.** ஒரு `Button` என்பது framework தீம் செய்த Skia வரைதல் குறியீடு; எனவே அது AppKit-ஐப் பொருத்துவதற்குப் பதிலாக Windows மற்றும் Linux-இல் உள்ள உங்கள் பயன்பாட்டுடன் பொருந்துகிறது. தளங்களிடையே சீர்மையும் ஒவ்வொன்றிலும் native தோற்றமும் உண்மையிலேயே முரண்படும் இலக்குகள்; இந்தத் திட்டம் முதலாவதைத் தேர்ந்தெடுக்கிறது. CSS தீம் அமைத்தல் Mac வண்ணத் தொகுப்பு மற்றும் எழுத்தமைப்புக்கு அருகில் வர உதவுகிறது, ஆனால் அது இன்னும் உங்கள் தீம், AppKit-இனுடையது அல்ல.
- **Windows வழக்கங்கள் குறியீட்டுடன் சேர்ந்தே வருகின்றன.** Keyboard shortcuts, உரையாடல் சாளரப் பொத்தான்களின் வரிசை மற்றும் சாளரம் மூடும் நடத்தை ஆகியவை உங்கள் ஏற்கனவே உள்ள WinForms வடிவமைப்பிலிருந்து வருகின்றன. அவற்றை macOS பழக்கங்களுக்கு ஏற்ப மாற்றுவது பயன்பாட்டு மட்ட வேலை.
- **UI Automation bridge இல்லை.** திரை வாசிப்பான் ஆதரவு (`Majorsilence.Forms.WindowsUIAutomation`) இன்று Windows-மட்டும்; ஒரு `NSAccessibility` bridge திட்டப் பாதையில் (roadmap) உள்ளது, இணைக்கப்படவில்லை. பின்தளம் சாராத [தானியக்க மரம்]({{ '/ta/automation/' | relative_url }}) macOS-இலும் சோதனைகள், Selenium மற்றும் MCP server-ஐ இயக்குகிறது.

## ஒரு `.app`-ஐ வழங்குதல்
{:#shipping-a-app}

Packaging எந்த Avalonia அல்லது .NET desktop பயன்பாட்டுக்கும் உள்ளது போலவே — framework கூடுதல் படிகள் எதையும் சேர்ப்பதில்லை:

```bash
dotnet publish -c Release -r osx-arm64 --self-contained
```

அதன் பிறகு, வழக்கமான macOS வேலைகள் பொருந்தும்: publish செய்யப்பட்ட வெளியீட்டை ஒரு `Info.plist` மற்றும் ஒரு `.icns` உடன் `YourApp.app/Contents/MacOS` bundle அமைப்பில் உறையிட்டு, அதை `codesign` செய்து, App Store-க்கு வெளியே விநியோகித்தால் Apple-இடம் notarize செய்யுங்கள். `osx-arm64` மற்றும் `osx-x64` இரண்டையும் publish செய்து `lipo` மூலம் இணைப்பதன் மூலம் ஒரு universal binary-ஐ build செய்யுங்கள்.

## macOS-இல் சரிபார்க்கப்பட்டது
{:#verified-on-macos}

[`Explorer`]({{ '/ta/samples/' | relative_url }}) மாதிரியும் முழுக் கட்டுப்பாட்டுக் காட்சியகமும் macOS-இல் இயங்குகின்றன; காட்சியகத்தின் Uno head-உம் அங்கே சரிபார்க்கப்பட்டது:

![macOS-இல் இயங்கும் Explorer மாதிரி]({{ '/assets/img/explorer-macos.png' | relative_url }})

## அடுத்து
{:#next}

- [தொடங்குதல்]({{ '/ta/getting-started/' | relative_url }}) — முதல் பயன்பாடு, வார்ப்புருவிலிருந்து அல்லது புதிதாக.
- [ஏற்கனவே உள்ள WinForms பயன்பாட்டை இடம்பெயர்த்தல்]({{ '/ta/migration/' | relative_url }}) — தானியக்க மீண்டும் எழுதுதல்.
- [Linux-இல் WinForms]({{ '/ta/winforms-on-linux/' | relative_url }}) — Ubuntu, Fedora மற்றும் Debian-இல் அதே கதை.
- [பல்தள WinForms]({{ '/ta/cross-platform-winforms/' | relative_url }}) — கட்டமைப்பும் அதன் விட்டுக்கொடுப்புகளும்.
