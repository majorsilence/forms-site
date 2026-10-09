---
layout: docs
lang: ta
title: Linux-இல் WinForms
subtitle: Ubuntu, Fedora, Debian போன்றவற்றில் ஒரு Windows Forms குறியீட்டுத் தளத்தை இயக்குதல் — எது வேலை செய்கிறது, எதைக் கவனிக்க வேண்டும், அதை எப்படி வழங்குவது.
permalink: /ta/winforms-on-linux/
seo_title: "WinForms-ஐ Linux-இல் இயக்குவது எப்படி — பல்தள Windows Forms"
description: >-
  Windows Forms Linux-இல் இயங்காது, Mono-வின் port நீண்ட காலத்துக்கு முன்பே முடிந்துவிட்டது.
  Majorsilence.Forms உங்கள் WinForms பயன்பாட்டை Ubuntu, Fedora மற்றும் Debian-இல் native ஆக build
  செய்து இயக்குவது எப்படி — Avalonia சாளரத்தில், உண்மையான GTK 4 சாளரத்தில், அல்லது terminal-இல்.
keywords:
  - WinForms Linux
  - winforms on linux
  - Windows Forms Linux-இல் இயக்குதல்
  - Ubuntu-இல் WinForms இயக்குவது எப்படி
  - c# winforms linux
  - Linux-க்கான .NET GUI
  - system.windows.forms linux
  - winforms gtk
  - winforms wayland
priority: "0.9"
---

## சாதாரண WinForms-ஆல் ஏன் இதைச் செய்ய முடியாது
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` **Windows Desktop** runtime-இல் மட்டுமே வருகிறது. Linux-இல் resolve செய்வதற்கு `Microsoft.WindowsDesktop.App` shared framework இல்லை; எனவே ஒரு `net10.0-windows` திட்டம் இயங்கத் தவறுவது மட்டுமல்ல — `dotnet build` அதை ஏற்கவே மறுக்கிறது. அந்த assembly `user32.dll` மற்றும் GDI+ மீதான ஒரு உறை; இரண்டுமே இங்கே இல்லை.

மக்கள் வழக்கமாக முயற்சிக்கும் மூன்று விஷயங்கள்:

- **Mono-வின் `System.Windows.Forms`.** உண்மையான ஒரு மறுசெயலாக்கம்; பழைய forum உரையாடல்கள் இது வேலை செய்கிறது என்று சொல்வதற்குக் காரணம் இதுதான். அது .NET Framework காலத்துக்காகக் கட்டப்பட்டது, நவீன .NET-க்கு ஒருபோதும் கொண்டு செல்லப்படவில்லை, இன்று நீங்கள் ஏற்றுக்கொள்ளக்கூடிய இலக்கும் அல்ல.
- **Wine.** Windows binary-ஐ port செய்வதற்குப் பதிலாக அதையே இயக்குகிறது. தற்காலிகத் தீர்வாகப் பயன்படும்; அதாவது ஒரு Windows executable-ஐயும் ஓர் இணக்க runtime-ஐயும் தோராயமான ஹோஸ்ட் ஒருங்கிணைப்புடன் வழங்குவது.
- **Linux-இல் `System.Drawing.Common`.** UI அல்லாத வரைதல் குறியீட்டுக்குக் கூட இது ஒரு தேர்வாக இல்லாமல் போய்விட்டது: இப்போது நீக்கப்பட்ட ஓர் இணக்க switch-ஐ அமைக்காவிட்டால், .NET 7 முதல் Windows-க்கு வெளியே அது `PlatformNotSupportedException`-ஐ எறிந்து வருகிறது.

## அதற்குப் பதிலாக Majorsilence.Forms என்ன செய்கிறது
{:#what-majorsilenceforms-does-instead}

அது WinForms API-ஐ SkiaSharp மீது மீண்டும் செயல்படுத்தி, ஒரு பின்தளம் (backend) வழங்கும் சாளரத்தில் ஹோஸ்ட் செய்கிறது. Linux-இல் தேர்ந்தெடுக்க மூன்று ஹோஸ்ட்கள் உள்ளன, அனைத்தும் அதே பயன்பாட்டுக் குறியீட்டிலிருந்து:

- **Avalonia** (இயல்புநிலை) — ஒரு சாதாரண X11 பயன்பாடு: உங்கள் window manager-இல் ஒரு உண்மையான சாளரம், உண்மையான உள்ளீடு, கிடைக்கும் இடங்களில் GPU compositing. Wayland அமர்வுகளில் XWayland கீழ் இயங்குகிறது.
- **GTK 4** (`Majorsilence.Forms.Gtk4`) — [gir.core](https://github.com/gircore/gir.core) bindings வழியாக ஒரு உண்மையான `Gtk.Window`, Wayland மற்றும் X11-இல் native. வெளிப்படையாகத் தேர்ந்தெடுக்கப்படுகிறது; விவரங்கள் [கீழே](#gtk4).
- **Terminal** (`Majorsilence.Forms.Terminal`) — படிவம் ஒரு terminal emulator-இல் வரையப்படுகிறது, display server தேவையில்லை; விவரங்கள் [கீழே](#terminal).

எதைத் தேர்ந்தெடுத்தாலும் அது எங்கும் `-windows` பின்னொட்டு இல்லாத ஒரு சாதாரண `net10.0` (அல்லது `net8.0`) build.

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

.NET SDK நிறுவப்பட்ட ஒரு சாதாரண Ubuntu கணினியில் முழு அமைப்பும் அவ்வளவுதான். வார்ப்புரு (template) ஒரு பகிரப்பட்ட UI நூலகத்தையும் Avalonia பின்தளத்தில் ஒரு desktop head-ஐயும் உருவாக்குகிறது; அதே மூலக் குறியீடு Windows மற்றும் macOS-இல் மாற்றமின்றி build ஆகி இயங்குகிறது.

## Linux-இல் உண்மையில் எது வேலை செய்கிறது
{:#what-actually-works-on-linux}

| பகுதி | Linux-இல் |
|---|---|
| சாளரங்கள், உள்ளீடு, HiDPI | Native. Avalonia பின்தளம் X11-ஐப் பயன்படுத்துகிறது (Wayland அமர்வில் XWayland). GTK 4 பின்தளம் native Wayland/X11 — Wayland-இல் சரிபார்க்கப்பட்டது — ஆனால் GTK-இன் முழுஎண் scale காரணியைப் பயன்படுத்துகிறது; எனவே தற்போதைக்கு 1.25×/1.5× காட்சிகள் 1×-இல் வரையப்பட்டு compositor பெரிதாக்குகிறது |
| வரைதல் (rendering) | SkiaSharp, GPU-முடுக்கப்பட்டது — Windows மற்றும் macOS-இல் உள்ள அதே வரைதல் குறியீடு, எனவே கட்டுப்பாடுகள் ஒரே மாதிரித் தோன்றுகின்றன |
| எழுத்துருக்கள் மற்றும் உரை | SkiaSharp கணினி எழுத்துருக்களை fontconfig வழியாகக் கண்டறிகிறது; `Majorsilence.Forms.Drawing.Common` ஒரு மாற்று (fallback) எழுத்துருத் தொகுப்பையும் உள்ளடக்கியுள்ளது, எனவே எழுத்துருக்கள் எதுவும் நிறுவப்படாத குறைந்தபட்ச image-இலும் உரை வரையப்படுகிறது |
| GDI+ / `System.Drawing` குறியீடு | `Majorsilence.Forms.Drawing` மூலம் மாற்றீடு — `Bitmap`, `Font`, `Pen`, `Brush`, `Region`, `Drawing2D`, `Imaging`, மற்றும் EMF/WMF playback |
| பொதுவான உரையாடல் சாளரங்கள் | `OpenFileDialog`, `SaveFileDialog`, `FolderBrowserDialog`, `ColorDialog`, `FontDialog` ஆகியவை Avalonia பின்தளத்தின் native உரையாடல் சாளரங்கள் வழியாக வேலை செய்கின்றன. GTK 4-இல் native கோப்புத் தேர்விகள் இன்னும் இணைக்கப்படவில்லை, எனவே அதற்குப் பதிலாக framework-இன் சொந்த மாற்று உரையாடல் சாளரங்கள் தோன்றுகின்றன |
| அச்சிடுதல் | `PrintDocument` ஒரு print driver-க்கு அல்லாமல் Skia வழியாக PDF-க்கு வரைகிறது — ஒவ்வொரு OS-இலும் ஒரே மாதிரி |
| WebView கட்டுப்பாடுகள் | இரண்டு desktop பின்தளங்களிலும் உண்மையான WebKitGTK — Avalonia-இல் `Avalonia.Controls.WebView` வழியாக, GTK 4-இல் நேரடியாக WebKitGTK 6.0 (`libwebkitgtk-6.0` நிறுவப்பட்டிருக்க வேண்டும்; `IsWebViewFunctional` அதைச் சொல்லும்) |
| ஒலி | OS கருவி (`paplay`/`aplay`) வழியாக இயக்கப்படுகிறது |
| பாதுகாப்பான சேமிப்பு மற்றும் பேச்சு | `Majorsilence.Forms.Essentials`: `SecureStorage` `secret-tool` வழியாக Secret Service-ஐப் பயன்படுத்துகிறது (keyring daemon அல்லது `libsecret-tools` இல்லையென்றால் `IsSupported` false ஆகும், ஒருபோதும் plaintext மாற்று அல்ல); `Speech` `espeak`/`espeak-ng`-ஐப் பயன்படுத்துகிறது |
| தீம்கள் | CSS தீம் கோப்புகள் எல்லா இடங்களிலும் போலவே இங்கும் வேலை செய்கின்றன; `BuiltInTheme.Default` OS-இன் light/dark விருப்பத்தைப் பின்பற்றுகிறது |
| Native சாளர handle | Avalonia-இல் `WindowBase.PlatformHandle` வழியாக ஒரு உண்மையான X11 `XID` (*கட்டுப்பாடு*-வாரியான handles எல்லா இடங்களிலும் `IntPtr.Zero` — [Native interop]({{ '/ta/native-interop/' | relative_url }}) பாருங்கள்). GTK 4-இல் `NativeControlHost` உங்கள் படிவத்துக்குள் ஒரு உண்மையான `Gtk.Widget`-ஐ airspace பிரச்சினையின்றி மேலடுக்குகிறது, ஏனெனில் GTK 4 அனைத்தையும் ஒரே render tree-இல் compose செய்கிறது |
| UI Automation / திரை வாசிப்பான்கள் | இன்னும் Windows-மட்டும் (`Majorsilence.Forms.WindowsUIAutomation`); AT-SPI bridge திட்டப் பாதையில் (roadmap) உள்ளது, இணைக்கப்படவில்லை. உலாவி build திரை வாசிப்பான்களுக்கு ஒரு ARIA DOM பிரதிபலிப்பை வெளிப்படுத்துகிறது. பின்தளம் சாராத [தானியக்க மரம்]({{ '/ta/automation/' | relative_url }}) எப்படியிருந்தாலும் Linux-இல் சோதனைகள், Selenium மற்றும் MCP server-ஐ இயக்குகிறது |
| `Majorsilence.Forms.WindowsFormsInterop`, `.WinForms`, `.Wpf` | வரையறைப்படியே Windows-மட்டும் — அவை உண்மையான `System.Windows.Forms`/WPF சாளரங்களை ஹோஸ்ட் செய்கின்றன, அவை இங்கே இல்லை |

## GTK 4 பின்தளம்
{:#gtk4}

Avalonia சாளரத்துக்குப் பதிலாக ஒரு உண்மையான GTK சாளரம் வேண்டுமென்றால் — GNOME desktop-க்காக, native Wayland-க்காக, அல்லது உட்பொதிக்க ஏற்கனவே ஒரு `Gtk.Application` உங்களிடம் இருப்பதால் — GTK 4 பின்தளத்தைக் குறிப்பிட்டு `Application.Run`-க்கு முன் அதைத் தேர்ந்தெடுங்கள்:

```bash
dotnet add package Majorsilence.Forms
dotnet add package Majorsilence.Forms.Gtk4
```

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // GTK 4 பின்தளத்தை நிறுவுகிறது (இல்லையெனில் Avalonia இயல்புநிலை)
Application.Run (new MainForm ());      // GLib main loop
```

கணினிக்கு GTK 4 தானே தேவை: Debian/Ubuntu-இல் `libgtk-4-1`, Fedora/Arch-இல் `gtk4`. `WebBrowser` மற்றும் webview-அடிப்படையிலான compat கட்டுப்பாடுகளுக்கு WebKitGTK 6.0-ஐச் சேர்க்கவும் (Debian/Ubuntu-இல் `libwebkitgtk-6.0-4`, Fedora-இல் `webkitgtk6.0`, Arch-இல் `webkitgtk`). உட்பொதித்தல் இரு திசைகளிலும் வேலை செய்கிறது — `myControl.ToGtkWidget ()` / `myForm.ToGtkWindow ()` ஆகியவை Majorsilence.Forms உள்ளடக்கத்தை ஏற்கனவே உள்ள GTK பயன்பாட்டுக்குள் வைக்கின்றன, `ShowDialog` ஓர் உண்மையான transient-for, modal சாளரத்தைப் பெறுகிறது.

அறியப்பட்ட வரம்புகள், பெரும்பாலும் நிலுவையிலுள்ள வேலை அல்ல, GTK 4 API நீக்கங்கள்: `Form.Location` என்பது window manager புறக்கணிக்கக்கூடிய ஒரு குறிப்பு மட்டுமே (GTK 4 client-side நிலைப்படுத்தலைக் கைவிட்டது), `SetIcon(byte[])` no-op (எதுவும் செய்யாது) (GTK 4 icons தீம் பெயர்கள்), கோப்புத் தேர்விகள் framework-இன் சொந்த உரையாடல் சாளரங்களுக்குத் திரும்புகின்றன, அளவிடுதல் (scaling) முழுஎண் மட்டுமே, பின்தளம் AOT-பகுப்பாய்வு செய்யப்படவில்லை. முழுப் பட்டியல் [GTK 4 பின்தள ஆவணங்களில்]({{ site.github_url }}/blob/main/docs/backends.md#the-gtk-4-backend).

## Terminal பின்தளம்
{:#terminal}

`Majorsilence.Forms.Terminal` அதே படிவத்தை ஒரு terminal emulator-க்குள் இயக்குகிறது — terminal இருக்கும் எந்த இடத்திலும், tmux/screen அல்லது SSH அமர்வு உட்பட, display server இல்லாமல். படிவம் வழக்கமான Skia pipeline மூலம் வரையப்பட்டு, terminal ஆதரிக்கும் இடங்களில் terminal-இன் உண்மையான பிக்சல் தெளிவுத்திறனில் Kitty graphics அல்லது Sixel ஆகவும், மற்ற எல்லா இடங்களிலும் Unicode block glyphs (ஒரு cell-க்கு 2×4 sub-pixels) ஆகவும் காட்டப்படுகிறது; முறையும் 24-bit நிறமும் terminal-ஐ வினவுவதன் மூலம் கண்டறியப்படுகின்றன, `MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` ஒன்றை நிலைப்படுத்துகிறது. Mouse மற்றும் keyboard வேலை செய்கின்றன, வழங்கப்படும் இடங்களில் Kitty keyboard protocol பயன்படுத்தப்படுகிறது, Ctrl+C எப்போதும் வெளியேறுகிறது.

இது ஒரு தொலைபேசி போன்ற ஒற்றைக் காட்சி (single-view) ஹோஸ்ட்: படிவம் title bar இல்லாமல் terminal முழுவதையும் நிரப்புகிறது. இது xterm மற்றும் WezTerm-இல் சரிபார்க்கப்பட்டது; kitty, Ghostty, foot, iTerm2 மற்றும் Windows Terminal இன்னும் சோதிக்கப்படவில்லை. Native கோப்புத் தேர்விகள், `NativeControlHost` மற்றும் web views ஆகியவற்றுக்கு terminal-இல் சமமானவை இல்லை. `samples/Gallery.Terminal` மற்றும் [Terminal README]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Terminal/README.md) பாருங்கள்.

## Deployment குறிப்புகள்
{:#deployment-notes}

விசித்திரமாக எதுவும் இல்லை — இது ஒரு சாதாரண .NET பயன்பாடு:

```bash
dotnet publish -c Release -r linux-x64 --self-contained
```

தெரிந்துகொள்ள வேண்டிய மூன்று விஷயங்கள்:

- **Native Skia binary.** `SkiaSharp.NativeAssets.Linux` `libSkiaSharp.so`-ஐக் கொண்டுள்ளது, அது fontconfig-உடன் link ஆகிறது. Desktop distributions-இல் அது ஏற்கனவே உள்ளது; மெலிதான container images-க்குப் பொதுவாக `libfontconfig1` (Debian/Ubuntu) அல்லது `fontconfig` (Fedora/Alpine) வெளிப்படையாகச் சேர்க்கப்பட வேண்டும்.
- **GTK runtime (GTK 4 பின்தளத்துக்கு மட்டும்).** உங்கள் installer அல்லது package `libgtk-4-1` (Debian/Ubuntu) அல்லது `gtk4` (Fedora/Arch)-ஐச் சார்ந்திருக்க வேண்டும், `WebBrowser` பயன்படுத்தினால் `libwebkitgtk-6.0-4`/`webkitgtk6.0`-ஐயும். Avalonia பின்தளத்துக்கு அத்தகைய சார்பு இல்லை.
- **Headless சூழல்கள்.** காட்சி இல்லாத CI, servers மற்றும் containers-க்கு, desktop பின்தளத்துக்குப் பதிலாக `Majorsilence.Forms.Headless`-ஐக் குறிப்பிட்டு திரைக்கு வெளியே வரையுங்கள் — Xvfb இல்லை, display server இல்லை. இந்தத் திட்டத்தின் சொந்தச் சோதனைத் தொகுப்பு அப்படித்தான் இயங்குகிறது. [தானியக்கம் & UI சோதனை]({{ '/ta/automation/' | relative_url }}) பாருங்கள்.

## Linux-இல் சரிபார்க்கப்பட்டது
{:#verified-on-linux}

[`Explorer`]({{ '/ta/samples/' | relative_url }}) மாதிரி — ஒரு Windows Explorer நகல் — Ubuntu-இல் இயங்குகிறது, முழுக் [கட்டுப்பாட்டுக் காட்சியகம்]({{ '/ta/samples/' | relative_url }}) அங்கே Avalonia பின்தளத்தில் இயங்குகிறது, `Gallery.Gtk4` Wayland-இல் வரைதல், உள்ளீட்டைக் கையாளுதல் மற்றும் WebKitGTK-ஐ ஏற்றுதல் ஆகியவற்றுக்காகச் சரிபார்க்கப்பட்டது, `Gallery.Terminal` xterm மற்றும் WezTerm-இல் இயக்கப்பட்டது:

![Ubuntu-இல் இயங்கும் Explorer மாதிரி]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

## அடுத்து
{:#next}

- [தொடங்குதல்]({{ '/ta/getting-started/' | relative_url }}) — முதல் பயன்பாடு, வார்ப்புருவிலிருந்து அல்லது புதிதாக.
- [ஏற்கனவே உள்ள WinForms பயன்பாட்டை இடம்பெயர்த்தல்]({{ '/ta/migration/' | relative_url }}) — தானியக்க மீண்டும் எழுதுதல், `-windows` TFM மற்றும் `System.Drawing.Common` reference-ஐ நீக்குவது உட்பட.
- [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) — Avalonia, GTK 4, Terminal மற்றும் மற்றவை.
- [macOS-இல் WinForms]({{ '/ta/winforms-on-macos/' | relative_url }}) — Apple வன்பொருளில் அதே கதை.
- [பல்தள WinForms]({{ '/ta/cross-platform-winforms/' | relative_url }}) — கட்டமைப்பும் அதன் விட்டுக்கொடுப்புகளும்.
