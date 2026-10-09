---
layout: docs
lang: ta
title: பல்தள WinForms
subtitle: Windows Forms குறியீட்டை macOS மற்றும் Linux-இல் இயக்குவது என்றால் என்ன, அதன் விலை என்ன, Majorsilence.Forms அதை எப்படிச் செய்கிறது.
permalink: /ta/cross-platform-winforms/
seo_title: "பல்தள WinForms — Windows Forms-ஐ macOS & Linux-இல் இயக்குங்கள்"
description: >-
  WinForms இணக்க அடுக்கு ஒன்று ஏற்கனவே உள்ள Windows Forms பயன்பாடுகளை macOS மற்றும் Linux-இல்
  இயங்கச் செய்வது எப்படி — கட்டமைப்பு, அது எதை மாற்றீடு செய்கிறது, அதன் விலை என்ன.
keywords:
  - பல்தள WinForms
  - cross platform winforms
  - WinForms Linux
  - WinForms macOS
  - WinForms இணக்க அடுக்கு
  - Windows Forms Linux-இல் இயக்குதல்
  - winforms compatibility library
  - .NET பல்தள GUI
  - winforms gtk
priority: "0.9"
changefreq: weekly
---

**Windows Forms எப்போதும் Windows-க்கு மட்டுமே உரியது.** `System.Windows.Forms` என்பது Win32 சாளர வகுப்புகள் (window classes) மற்றும் GDI+ மீதான ஒரு managed உறை — `HWND`கள், `WM_PAINT`, `user32.dll`. .NET எல்லா இடங்களிலும் இயங்குகிறது, ஆனால் அந்த assembly Windows Desktop runtime-இல் மட்டுமே வருகிறது; எனவே ஒரு WinForms பயன்பாட்டை macOS அல்லது Linux-இல் build செய்யவோ தொடங்கவோ முடியவே முடியாது. அதுதான் முழுப் பிரச்சினை; அதனால்தான் "எங்கள் WinForms பயன்பாட்டைப் பல்தளமாக்குங்கள்" என்பது வரலாற்று ரீதியாக "அதை மீண்டும் எழுதுங்கள்" என்றே பொருள்பட்டது.

Majorsilence.Forms மற்ற வழியைத் தேர்ந்தெடுக்கிறது: **WinForms நிரலாக்க மாதிரியை ஒரு பல்தள renderer மீது மீண்டும் செயல்படுத்துதல்.** அதே வகுப்புப் பெயர்கள், அதே பண்புகள் (properties), அதே நிகழ்வுகள் (events), designer உருவாக்கும் அதே குறியீடு — ஆனால் அடியில் எதுவும் Win32 அல்ல.

```csharp
using Majorsilence.Forms;   // System.Windows.Forms-க்குப் பதிலாக

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

அந்தக் கோப்பு ஒரே `net10.0` (அல்லது `net8.0`) build-இலிருந்து Windows, macOS மற்றும் Linux-இல் compile ஆகி இயங்குகிறது. `-windows` TFM இல்லை, Windows Desktop runtime இல்லை, Wine-உம் இல்லை. மைய நூலகம் ஒரு `netstandard2.0` build-ஐயும் வழங்குகிறது; அதனால்தான் Windows-இல் உள்ள .NET Framework 4.8 பயன்பாடும் அதை ஹோஸ்ட் (host) செய்ய முடிகிறது.

## WinForms இணக்க அடுக்கு உண்மையில் எப்படி வேலை செய்கிறது
{:#how-a-winforms-compatibility-layer-actually-works}

WinForms குறியீட்டை வேறொரு தளத்துக்குக் கொண்டு செல்ல மூன்று அணுகுமுறைகள் உள்ளன; அவை மிகவும் வேறுபட்டு நடந்துகொள்கின்றன:

| அணுகுமுறை | அது என்ன | விட்டுக்கொடுப்பு |
|---|---|---|
| **போலச்செய்தல் (emulation)** (Wine, Mono-வின் பழைய `System.Windows.Forms`) | *மாற்றப்படாத* WinForms assembly-க்கு அடியில் Win32/GDI+-ஐ மீண்டும் செயல்படுத்துதல் | மூலக் குறியீட்டில் எந்த மாற்றமும் இல்லை, ஆனால் மிகப் பெரிய Win32 பரப்பு, இயல்பற்ற நடத்தை, மற்றும் உங்கள் பயன்பாடு செயல்படுத்தப்படாத ஏதாவதொன்றைத் தொட்ட கணமே முடிந்துவிடும் ஆதரவு ஆகியவற்றை நீங்கள் சுமக்க வேண்டும் |
| **மீண்டும் எழுதுதல் (rewrite)** (WPF, .NET MAUI, Avalonia, இணையம்) | UI-ஐ வேறொரு முன்னுதாரணத்தில் மீண்டும் வெளிப்படுத்துதல் | உண்மையிலேயே நவீனமான விளைவு, ஆனால் ஒவ்வொரு திரையையும் மீண்டும் கட்டி, அணிக்கு மீண்டும் பயிற்சி அளிக்க வேண்டிய விலையில் |
| **API-இணக்கமான மறுசெயலாக்கம்** (Majorsilence.Forms) | WinForms *API*-ஐ ஒரு கையடக்க (portable) renderer மீது மீண்டும் கட்டுதல் | இயந்திரத்தனமான namespace மாற்றத்துடன் மூலக் குறியீட்டு மட்ட இணக்கம்; `Control.Handle`, `WndProc` போன்ற Win32 தப்பிக்கும் வழிகளை விட்டுக்கொடுக்கிறீர்கள் |

Majorsilence.Forms மூன்றாவது வகை. ஒவ்வொரு கட்டுப்பாடும் (control) [SkiaSharp](https://github.com/mono/SkiaSharp) மூலம் framework தானே வரைகிறது — Chrome மற்றும் Flutter-க்குப் பின்னால் உள்ள அதே GPU-முடுக்கப்பட்ட 2D இயந்திரம் — எனவே ஒரு `Button` மூன்று desktop-களிலும் ஒரே மாதிரித் தோன்றி ஒரே மாதிரி நடந்துகொள்கிறது, ஏனெனில் அது மூன்றிலும் உண்மையிலேயே அதே வரைதல் குறியீடுதான்.

## ஒரே வரைபடத்தில் கட்டமைப்பு
{:#the-architecture-in-one-diagram}

<div class="msf-diagram">        உங்கள் பயன்பாடு  (படிவங்கள், கட்டுப்பாடுகள், Designer கோப்புகள் — உங்களுக்குத் தெரிந்த WinForms மாதிரி)
            │
       Majorsilence.Forms  (கட்டுப்பாடுகள் + WinForms-இணக்க API, SkiaSharp மூலம் வரையப்படுகிறது)
            │
   மாற்றக்கூடிய ஹோஸ்ட் பின்தளம் (host backend)
   ├─ Avalonia   → Windows · macOS · Linux  (இயல்புநிலை)  · Android · iOS · உலாவி ஆகியவையும்
   ├─ Uno         → desktop · iOS · Android · WebAssembly
   ├─ GTK 4       → Linux-முதன்மை உண்மையான GTK சாளரம் (gir.core), GTK runtime உடன் Windows/macOS-இலும்
   ├─ Terminal    → படிவம் terminal-இல் வரையப்படுகிறது (Kitty graphics, Sixel அல்லது Unicode blocks)
   ├─ WinForms    → Windows-மட்டும் இடம்பெயர்த்தல் பாலம்: ஏற்கனவே உள்ள WinForms பயன்பாட்டில் உட்பொதித்து, படிப்படியாக port செய்யுங்கள்
   ├─ WPF         → Windows-மட்டும் இடம்பெயர்த்தல் பாலம், அதே வடிவம், ஏற்கனவே உள்ள WPF பயன்பாட்டுக்கு
   └─ Headless    → சோதனைகள் / CI-க்கான திரைக்கு வெளியான வரைதல் (offscreen rendering)</div>

மைய `Majorsilence.Forms` assembly **எந்த windowing toolkit-ஐயும்** குறிப்பிடுவதில்லை — SkiaSharp-ஐ மட்டுமே. ஒரு பின்தளத்தின் (backend) முழு வேலையும் ஒரு native சாளரத்தை (அல்லது ஒரு terminal-ஐ, அல்லது எதையுமே இல்லாமல்) உருவாக்குவது, ஒரு message loop-ஐ இயக்குவது, உள்ளீட்டை வழங்குவது, ஒரு Skia surface-ஐக் காட்டுவது ஆகியவைதான். அந்த இணைப்புக்கோடு (seam) காரணமாகவே அதே பயன்பாட்டு binary இன்று desktop-இல் Avalonia-வையும் நாளை GTK 4, Uno அல்லது WebAssembly-ஐயும் இலக்காகக் கொள்ள முடிகிறது — மேலும் ஒரு Windows பயன்பாடு இடம்பெயரும்போது தனது ஏற்கனவே உள்ள WinForms அல்லது WPF சாளரங்களுக்குள் அதே கட்டுப்பாடுகளை ஹோஸ்ட் செய்ய முடிகிறது. இடைமுகங்களுக்கும் உங்கள் சொந்தப் பின்தளத்தைச் சேர்ப்பது எப்படி என்பதற்கும் [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) பக்கத்தைப் பாருங்கள்.

## ஒவ்வொரு தளத்திலும் உங்களுக்குக் கிடைப்பது
{:#what-you-get-on-each-platform}

| தளம் | நிலை | ஹோஸ்ட் |
|---|---|---|
| Windows | ஆதரிக்கப்படுகிறது, நேரடியாகவே | Avalonia (இயல்புநிலை), Uno, அல்லது GTK runtime நிறுவப்பட்டிருந்தால் GTK 4 |
| Windows, ஏற்கனவே உள்ள WinForms அல்லது WPF பயன்பாட்டுக்குள் | ஆதரிக்கப்படுகிறது — படிப்படியான இடம்பெயர்த்தல், ஒரு நேரத்தில் ஒரு கட்டுப்பாடு; **.NET Framework 4.8** (`net48`) இலிருந்தும் ஹோஸ்ட் செய்யலாம் | `Majorsilence.Forms.WinForms` / `Majorsilence.Forms.Wpf` |
| macOS (Intel மற்றும் Apple Silicon) | ஆதரிக்கப்படுகிறது, நேரடியாகவே — [macOS-இல் WinForms]({{ '/ta/winforms-on-macos/' | relative_url }}) பாருங்கள் | Avalonia (இயல்புநிலை), Uno, அல்லது Homebrew வழியாக GTK 4 |
| Linux (X11 / Wayland) | ஆதரிக்கப்படுகிறது, நேரடியாகவே — [Linux-இல் WinForms]({{ '/ta/winforms-on-linux/' | relative_url }}) பாருங்கள் | Avalonia (இயல்புநிலை, X11), GTK 4 (native Wayland/X11, Wayland-இல் சரிபார்க்கப்பட்டது), அல்லது Uno |
| Terminal | இயங்குகிறது, புதியது — xterm மற்றும் WezTerm-இல் சரிபார்க்கப்பட்டது | `Majorsilence.Forms.Terminal`: படிவம் terminal முழுவதையும் நிரப்புகிறது, Kitty graphics, Sixel அல்லது Unicode block எழுத்துருக்களாக வரையப்படுகிறது |
| WebAssembly / உலாவி | இயங்குகிறது, புதியது — [நேரடிக் காட்சியகத்தை முயன்று பாருங்கள்]({{ '/gallery/' | relative_url }}); திரை வாசிப்பான்கள் UI-இன் ARIA DOM பிரதிபலிப்பைக் காண்கின்றன | Avalonia Browser அல்லது Uno Wasm |
| Android | ஆரம்ப நிலை — உண்மைச் சாதனத்தில் முதற்கட்டச் சோதனை முடிந்தது (boot, தட்டல்கள், render scaling, தொடு scroll ஆகியவை வன்பொருளில் உறுதிப்படுத்தப்பட்டன); keyboard, safe-area, சுழற்சி ஆகியவை unit-test மட்டுமே செய்யப்பட்டுள்ளன | Avalonia Android அல்லது Uno |
| iOS | ஆரம்ப நிலை — CI உண்மையான head-ஐ compile செய்து simulator smoke check-இல் தொடங்குகிறது, ஆனால் இதுவரை யாரும் அதை ஊடாடும் வகையில் இயக்கவில்லை | Avalonia iOS அல்லது Uno |
| Headless / CI | ஆதரிக்கப்படுகிறது | Headless பின்தளம், offscreen Skia |

## ஒரு port மாற்றீடு செய்ய வேண்டிய Windows-மட்டும் API-கள்
{:#the-windows-only-apis-a-port-has-to-replace}

கட்டுப்பாடுகளைக் கையடக்கமாக்குவது பாதி வேலை மட்டுமே. ஒரு உண்மையான WinForms பயன்பாடு வேறு Windows-மட்டும் அடுக்குகளையும் சார்ந்திருக்கிறது; அவை ஒவ்வொன்றுக்கும் இங்கே ஒரு பல்தளத் தீர்வு உள்ளது:

- **`System.Drawing.Common` (GDI+)** .NET 7 முதல் Windows-மட்டும் ஆகிவிட்டது. `Majorsilence.Forms.Drawing.Common` அதன் Skia-அடிப்படையிலான மறுசெயலாக்கம் — `Bitmap`, `Font`, `Pen`, `Brush`, `Icon`, `Region`, `StringFormat`, `Drawing2D`, `Imaging`, EMF/WMF metafile playback கூட. மதிப்பு வகைகள் (`Color`, `Point`, `Size`, `Rectangle`) வேண்டுமென்றே மீண்டும் செயல்படுத்தப்படவில்லை; ஏற்கனவே கையடக்கமான உண்மையான `System.Drawing.Primitives` வகைகளே பயன்படுத்தப்படுகின்றன, எனவே அவை .NET-இன் மற்ற அனைத்துடனும் இணைந்து செயல்படுகின்றன.
- **அச்சிடுதல் (printing)** `Majorsilence.Forms.Printing.PrintDocument` வழியாகச் செல்கிறது; அது அதே Skia pipeline மூலம் பக்கங்களை வரைந்து, OS print driver-உடன் பேசுவதற்குப் பதிலாக ஒரு PDF-ஐ உருவாக்குகிறது. அது வடிவமைப்பின்படியே தளம் சாராத மாற்றீடு, முடிக்கப்படாத OS-வாரியான இடைவெளி அல்ல.
- **காட்சிப் பாணிகள் (visual styles, uxtheme).** WinForms தனது தோற்றத்தை `Application.EnableVisualStyles()` வழியாக OS தீம் இயந்திரத்திலிருந்து பெறுகிறது; இங்கே அந்த அழைப்பு no-op (எதுவும் செய்யாது), தோற்றம் framework-இன் சொந்தத் தீமிலிருந்து வருகிறது. தீம்கள் சாதாரண CSS கோப்புகள் — நிறங்கள் மற்றும் எழுத்துருக்களுக்கான tokens மற்றும் கட்டுப்பாடு-வாரியான விதிகளுடன் ஆவணப்படுத்தப்பட்ட ஒரு உட்பிரிவு — எனவே ஒரே sheet பயன்பாட்டை ஒவ்வொரு OS-இலும் ஒரே மாதிரி அலங்கரிக்கிறது, உள்ளமைந்த `Default` தீம் OS-இன் light/dark விருப்பத்தைப் பின்பற்றுகிறது. [CSS மூலம் தீம் அமைத்தல்]({{ site.github_url }}/blob/main/docs/theming.md) பாருங்கள்.

## அதன் விலை என்ன
{:#what-it-costs}

அம்சப் பட்டியலை விட, விட்டுக்கொடுப்புகள் பற்றி நேர்மையாக இருப்பது அதிகப் பயனுள்ளது:

- **`Control.Handle` என்பது `IntPtr.Zero`.** இங்கே ஒரு கட்டுப்பாடு என்பது canvas மீதான வரைதல் செயல்பாடுகள், OS சாளரம் அல்ல; எனவே கொடுக்க `HWND` எதுவும் இல்லை, framework ஒன்றைக் கற்பனையாக உருவாக்க மறுக்கிறது. சாளர-மட்ட handles *உண்மையானவை* (`HWND`/`NSWindow`/`XID`, மேலும் WinForms பின்தளத்தில் ஒரு உண்மையான HWND). [Native interop]({{ '/ta/native-interop/' | relative_url }}) பாருங்கள்.
- **`WndProc` இல்லை, கட்டுப்பாடுகளுக்கு எதிரான Win32 P/Invoke இல்லை.** message-அடிப்படையிலான உத்திகளை உண்மையான API-களைக் கொண்டு மீண்டும் எழுத வேண்டும்.
- **தடுக்கும் (blocking) உரையாடல் சாளரங்கள் உலாவியிலோ தொலைபேசியிலோ இல்லை.** உலாவி, Android மற்றும் iOS இலக்குகளில் ஹோஸ்டுக்கு nested message loop இல்லை; எனவே `Form.ShowDialog`, `MessageBox.Show` மற்றும் கோப்புத் தேர்விகள் எதையும் காட்டுவதற்கு முன்பே async இணையைப் பெயரிட்டு `PlatformNotSupportedException`-ஐ எறிகின்றன. `ShowDialogAsync`, `MessageBox.ShowAsync` மற்றும் அவை போன்றவை எல்லா இடங்களிலும் வேலை செய்கின்றன; மைய package-இல் வரும் ஒரு Roslyn analyzer (`MFB001`–`MFB003`, code fixes உடன்) அந்த இலக்குகளில் தடுக்கும் அழைப்புகளைச் சுட்டிக்காட்டுகிறது. Desktop பயன்பாடுகள் தங்கள் தடுக்கும் அழைப்புகளை வைத்துக்கொள்ளலாம்.
- **ஆயத்தொலைவுகள் (coordinates) தருக்க அலகுகள், சாதனப் பிக்சல்கள் அல்ல.** `Width`, `Bounds`, `ClientRectangle`, mouse நிலைகள் மற்றும் வரைதல் canvas அனைத்தும் தருக்க அலகுகளில் உள்ளன; framework காட்சிக்கு ஏற்ப அளவிடுகிறது (scaling). DPI காரணியைக் கொண்டு தாங்களே `ScaleTransform` செய்த custom-painted கட்டுப்பாடுகள் அதை நீக்க வேண்டும்; சாதனப் பிக்சல்களை `ScaledBounds`, `PaintEventArgs.Scaling` மற்றும் `LogicalToDeviceUnits` மூலம் அணுகலாம்.
- **உள்ளடக்கம் 100% அல்ல.** இந்தத் திட்டம் பீட்டா நிலையில் உள்ளது. செயல்படுத்தப்படாத உறுப்புகள் exception எறிவதற்குப் பதிலாக வேண்டுமென்றே no-op ஆகின்றன அல்லது ஒரு பொருத்தமான இயல்புநிலை மதிப்பைத் தருகின்றன; எனவே இடம்பெயர்த்த குறியீடு compile ஆகிறது *மேலும் இயங்குகிறது* — அதாவது ஓர் இடைவெளி சத்தமின்றி இருக்கவும் கூடும். [இணக்க அட்டவணை]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) எது உண்மையானது, எது தோராயமானது, எது வரம்புக்கு வெளியே என்பதைக் கட்டுப்பாடு வாரியாகக் கண்காணிக்கிறது.
- **native WinForms உடன் பிக்சல்-சமமான வரைதல் ஒரு இலக்கு அல்ல.** கட்டுப்பாடுகள் Skia மூலம் தீம் செய்யப்பட்டு வரையப்படுகின்றன; அவை ஒவ்வொரு OS-இன் native widgets-ஐப் பொருத்துவதற்குப் பதிலாகத் தளங்களிடையே சீராகத் தோன்றுகின்றன. ஒரு வேண்டுமென்ற விதிவிலக்கு: ஒரு WinForms பயன்பாடு செய்வது போல `Application.SetDefaultFont` மூலம் தனது எழுத்துருவைத் தேர்ந்தெடுக்கும் port செய்யப்பட்ட பயன்பாட்டுக்கு, push buttons மற்றும் check/radio glyphs ஆகியவை Windows 11 தீமின் கீழ் WinForms வரைவது போலவே வரையப்படுகின்றன; எனவே பக்கத்துக்குப் பக்கமான இடம்பெயர்த்தல் இரண்டு வெவ்வேறு தயாரிப்புகள் போலத் தோன்றாது.

## அடுத்து எங்கே செல்லலாம்
{:#where-to-go-next}

- **[தொடங்குதல்]({{ '/ta/getting-started/' | relative_url }})** — சில நிமிடங்களில் இயங்கும் ஒரு பயன்பாடு.
- **[ஏற்கனவே உள்ள WinForms பயன்பாட்டை இடம்பெயர்த்தல்]({{ '/ta/migration/' | relative_url }})** — `majorsilence-migrate` CLI இயந்திரத்தனமான மீண்டும் எழுதுதலை உங்களுக்காகச் செய்கிறது.
- **[WinForms மாற்றுகள் ஒப்பீடு]({{ '/ta/winforms-alternatives/' | relative_url }})** — இது .NET MAUI, Avalonia, Uno Platform, Eto.Forms மற்றும் Wine-இலிருந்து எப்படி வேறுபடுகிறது.
- **[FAQ]({{ '/ta/faq/' | relative_url }})** — முதலில் எழும் கேள்விகளுக்குச் சுருக்கமான பதில்கள்.
