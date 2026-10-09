---
layout: docs
lang: ta
title: தளப் பின்தளங்கள் (platform backends)
subtitle: ஒரே வரைதல் மையம், மாற்றக்கூடிய ஏழு ஹோஸ்ட்கள்.
seo_title: "தளப் பின்தளங்கள் — Avalonia, Uno, GTK 4, Terminal, WinForms, WPF அல்லது Headless மீது WinForms"
description: >-
  பல்தள WinForms பயன்பாடு ஒன்று Avalonia, Uno Platform, GTK 4, ஒரு terminal, உண்மையான WinForms அல்லது
  WPF சாளரங்கள், அல்லது headless Skia மேற்பரப்பு மீது எவ்வாறு ஹோஸ்ட் செய்யப்படுகிறது — பின்தள
  இணைப்புக்கோடு (seam), தருக்கப் பிக்சல்கள், trimming, WebAssembly, மொபைல், மற்றும் ஹோஸ்ட் பயன்பாட்டில் உட்பொதித்தல்.
keywords:
  - winforms avalonia
  - winforms uno platform
  - winforms gtk4 linux
  - winforms terminal
  - winforms webassembly browser
  - majorsilence.forms wpf backend
  - majorsilence.forms winforms backend
  - headless winforms rendering
  - skiasharp ui backend தமிழ்
priority: "0.8"
permalink: /ta/backends/
---

Majorsilence.Forms தனது **அனைத்து வரைதலையும் (rendering) தானே** SkiaSharp மூலம் செய்கிறது. ஒவ்வொரு
கட்டுப்பாடும் (control) ஒரு `SKSurface`/`SKCanvas` இல் வரைகிறது; அதற்குக் கீழே உள்ள சாளர toolkit வெறும்
ஒரு *ஹோஸ்ட் (host)* மட்டுமே — அது native சாளரங்களை உருவாக்குகிறது, message loop ஐ இயக்குகிறது,
உள்ளீட்டை வழங்குகிறது, மற்றும் Skia மேற்பரப்பைத் திரையில் காட்டுகிறது.

அந்த ஹோஸ்ட் ஒரு சிறிய இணைப்புக்கோட்டின் (seam) பின்னால் மறைக்கப்பட்டுள்ளது. எனவே அதே பயன்பாட்டுக்
குறியீடு ஏழு பின்தளங்களில் (backends) எதிலும் இயங்கும்:

| Package | ஹோஸ்ட் | எதற்காக | தளங்கள் | எவ்வாறு தேர்ந்தெடுப்பது |
|---|---|---|---|---|
| `Majorsilence.Forms.Avalonia` | Avalonia 12 | இயல்புநிலை. உண்மையான desktop சாளரங்கள்; Avalonia வின் சொந்தத் தள packages மூலம் browser, Android, iOS உம். உண்மையான `TryGetPlatformHandle` (HWND / NSWindow / XID) கொண்ட ஒரே பல்தள பின்தளம். | Windows, macOS, Linux; WebAssembly; Android மற்றும் iOS (opt-in) | தானாக — package ஐக் குறிப்பிட்டு `Application.Run (new MainForm ())` ஐ அழையுங்கள். |
| `Majorsilence.Forms.Uno` | Uno Platform Skia (Uno.WinUI 6.5) | ஒரு Uno app head இனுள் `SKXamlCanvas` வழியாகக் காட்டுகிறது. | Desktop (macOS இல் சரிபார்க்கப்பட்டது); Uno, iOS/Android/WASM ஐயும் இலக்காகக் கொள்கிறது | Uno பயன்பாட்டின் `OnLaunched` இலிருந்து `Platform.Backend = new UnoPlatformBackend ()`. |
| `Majorsilence.Forms.Gtk4` | gir.core வழியாக GTK 4 (`GirCore.Gtk-4.0 0.8.1`) | GLib main loop இல் ஒவ்வொரு படிவத்துக்கும் ஓர் உண்மையான `Gtk.Window`. Linux முதன்மை. இரு திசைகளிலும் உட்பொதித்தல், airspace சிக்கல் இல்லாத `NativeControlHost`, WebKitGTK 6.0 வழியாக `WebBrowser`. | Linux (Wayland/X11, Wayland இல் சரிபார்க்கப்பட்டது); GTK 4 நிறுவப்பட்ட Windows/macOS | `Gtk4Application.Use ();` பின்னர் `Application.Run`. |
| `Majorsilence.Forms.Terminal` | Console / ANSI | ஒரு படிவத்தை terminal இல் ஒற்றைக் காட்சி (single-view) ஹோஸ்டாக இயக்குகிறது (படிவம் திரையை நிரப்பும், title bar இல்லை). உண்மையான பிக்சல் தெளிவுத்திறனில் Kitty graphics அல்லது Sixel, இல்லையெனில் Unicode block எழுத்துகள். | எந்த terminal உம்; xterm மற்றும் WezTerm இல் சரிபார்க்கப்பட்டது | `TerminalApplication.Use ();` பின்னர் `Application.Run`. |
| `Majorsilence.Forms.WinForms` | உண்மையான `System.Windows.Forms` | Windows க்கு மட்டுமான *இடம்பெயர்த்தல் (migration)* பின்தளம்: Win32 pump இல் உண்மையான WinForms சாளரங்கள், GDI bitmap வழியாக Skia காட்டப்படுகிறது. Majorsilence.Forms ஐ ஒவ்வொரு கட்டுப்பாடாக ஏற்றுக்கொள்ளுங்கள். `net48` ஐயும் இலக்காகக் கொள்கிறது. | Windows | `Platform.Backend = new WinFormsPlatformBackend ()` — அல்லது ஒரு WinForms படிவத்தில் `MajorsilenceFormsPresenter` ஐ இடுங்கள்; அது தன்னைத் தானே நிறுவிக்கொள்ளும். |
| `Majorsilence.Forms.Wpf` | WPF `Window` | Windows க்கு மட்டுமான இடம்பெயர்த்தல் பின்தளம், WinForms பின்தளத்தின் அதே வடிவம்: `Dispatcher` loop இல் ஓர் உண்மையான WPF `Window`, `WriteableBitmap` வழியாக Skia காட்டப்படுகிறது. `net48` ஐயும் இலக்காகக் கொள்கிறது. | Windows | `Platform.Backend = new WpfPlatformBackend ()`. |
| `Majorsilence.Forms.Headless` | சார்புகள் இல்லாத SkiaSharp | சோதனைகள், CI மற்றும் servers க்கான offscreen வரைதல்; பின்பற்ற வேண்டிய மாதிரிப் பின்தளம். | .NET இயங்கும் எங்கும்; display தேவையில்லை | `HeadlessRenderer.Use ()`. |

**மைய `Majorsilence.Forms` assembly எந்தச் சாளர toolkit ஐயும் குறிப்பிடுவதில்லை** — SkiaSharp ஐ மட்டுமே.
பின்தளங்கள் தனி assemblies ஆகும்; அவை மையத்தைச் சார்ந்திருந்து அதன் உள்ளக render/input
அமைப்புகளை அணுகுகின்றன.

### இலக்கு frameworks (target frameworks)
{:#target-frameworks}

மையம் (`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`)
`net8.0`, `net10.0` **மற்றும் `netstandard2.0`** ஐ multi-target செய்கிறது. `Majorsilence.Forms.WinForms` மற்றும்
`Majorsilence.Forms.Wpf` ஒவ்வொன்றும் `net8.0-windows` / `net10.0-windows` உடன் சேர்த்து ஒரு **`net48`** வரிசையைச்
சேர்க்கின்றன (மையத்தின் `netstandard2.0` build உடன் இணைக்கப்பட்டு). எனவே ஒரு பழைய .NET Framework 4.8 WinForms
அல்லது WPF பயன்பாடு இன்றே Majorsilence.Forms கட்டுப்பாடுகளை ஹோஸ்ட் செய்ய முடியும். `net48` வரிசைகள் CI இல்
எல்லா OS இலும் compile ஆகின்றன; அவற்றை *இயக்குவதற்கு* மட்டுமே Windows தேவை.

பல்தள பின்தளங்கள் (Avalonia, Uno, GTK 4, Terminal, Headless) `net8.0`+ ஐ இலக்காகக் கொள்கின்றன; அவற்றுக்கு
`-windows` TFM பின்னொட்டு தேவையில்லை. `netstandard2.0` பின்தளம் எதுவும் இல்லை. எனவே Windows அல்லாத
.NET Framework runtime இல் ஒரு பயன்பாடு கட்டுப்பாடுகளைக் குறிப்பிட முடியும், ஆனால் ஒரு சாளரத்தை ஹோஸ்ட் செய்ய முடியாது.

## இணைப்புக்கோடு (seam)
{:#the-seam}

ஒரு ஹோஸ்ட் வழங்க வேண்டிய அனைத்தையும் `Majorsilence.Forms.Backends` இல் உள்ள இரண்டு interfaces வரையறுக்கின்றன:

- **`IPlatformBackend`** — பயன்பாடு மற்றும் process சேவைகள்: dispatcher (`Post`/`Invoke`),
  timers, clipboard, திரைகள், `CreateWindow`, மற்றும் modal loop.
- **`IWindowBackend`** — ஒரு native சாளரம்: இருப்பிடம்/அளவு/அளவிடுதல், show/hide/close, தலைப்பு, cursor,
  அலங்காரங்கள் (decorations), drag/resize, மற்றும் native கோப்பு உரையாடல் சாளரங்கள்.

`IWindowBackend` என்பது *pull* பக்கம். *Push* பக்கம் — paint கோரிக்கைகள் மற்றும் native உள்ளீடு — என்பது
பின்தளம் தனக்குரிய சாளரத்தின் நடுநிலை methods ஐ நேரடியாக அழைப்பதாகும்: `RenderFrame (SKCanvas, physW, physH,
scaling)`, `HandlePointer*`, `HandleKeyDown/Up`, `HandleTextInput`, மற்றும் `OnBackend*` lifecycle
hooks. இணைப்புக்கோட்டைக் கடக்கும் எல்லா ஆயத்தொலைவுகளும் `System.Drawing` value types மற்றும் Majorsilence.Forms
enums ஆகும் — எந்த toolkit வகையும் மையத்துக்குள் கசிவதில்லை. விருப்பத் திறன்கள் (`IWebViewFactory`,
`INativeControlHostBackend`, `IAudioBackend`, `IModalLoopSupport`, …) இரண்டு interfaces க்கும் அருகில் உள்ளன;
அவற்றில் ஒன்றைச் செயல்படுத்தாத பின்தளம் அதற்குரிய நிகழ்வுகளை ஒருபோதும் எழுப்புவதில்லை.

### பின்தளத்தைத் தேர்ந்தெடுத்தல்
{:#selecting-a-backend}

`Majorsilence.Forms.Backends.Platform.Backend` செயலில் உள்ள `IPlatformBackend` ஐ வைத்திருக்கிறது. அது அமைக்கப்படாவிட்டால்,
`Majorsilence.Forms.Avalonia` குறிப்பிடப்பட்டிருக்கும்போது பெயரின் மூலம் `AvaloniaPlatformBackend` க்குத் தீர்க்கப்படுகிறது —
எனவே ஒரு desktop பயன்பாடு அந்த package ஐக் குறிப்பிட்டு `Application.Run (new MyForm ())` ஐ அழைத்தால் போதும். ஏனைய
ஒவ்வொரு பின்தளமும் **முதல் சாளரம் உருவாக்கப்படுவதற்கு முன்** வெளிப்படையாக நிறுவப்படுகிறது:

```csharp
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
// அல்லது உதவி methods:  Gtk4Application.Use ();   TerminalApplication.Use ();   HeadlessRenderer.Use ();
Application.Run (new MainForm ());
```

### தருக்க அலகுகள் vs. சாதனப் பிக்சல்கள்
{:#logical-vs-device-pixels}

`Control` இல் பயன்பாடு காணும் அனைத்தும் **தருக்க அலகுகளில் (logical units)** உள்ளன — எந்தத் திரை
அளவிடுதலிலும் (scaling) அது அமைக்கும், திரும்ப வாசிக்கும் எண்கள்: `Width`/`Height`/`Location`/`Bounds`, `ClientSize` மற்றும்
`ClientRectangle`, `MouseEventArgs.X/Y`, மற்றும் **paint canvas**. `OnPaint`, `Paint` கையாளிகள் மற்றும்
`e.ClipRectangle` அனைத்தும் தருக்க அலகுகளில்; framework canvas ஐத் திரைக்கு ஏற்ப அளவிடுகிறது.

```csharp
child.Left = (ClientSize.Width - child.Width) / 2;            // எந்த DPI இலும் child ஐ மையப்படுத்துகிறது
e.Graphics.DrawRectangle (pen, 0, 0, Width - 1, Height - 1);  // எந்த DPI இலும் கட்டுப்பாட்டுக்குச் சட்டமிடுகிறது
```

**இது 2026-10-01 அன்று மாறியது.** அதுவரை `ClientSize`, `ClientRectangle` மற்றும் paint canvas
சாதனப் பிக்சல்களில் (device pixels) இருந்தன; ஒரு custom கட்டுப்பாடு `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` ஐத்
தானே அழைக்க வேண்டியிருந்தது. நீங்கள் அத்தகைய அழைப்பைச் சேர்த்திருந்தால், **அதை நீக்குங்கள்** — இப்போது வரைதல் இரண்டு முறை
அளவிடப்படும். சாதனப் பிக்சல்களை இன்னும் வெளிப்படையாகப் பெயரிடப்பட்ட `Scaled*` குடும்பம் (`ScaledWidth`, `ScaledBounds`, …),
`PaintEventArgs.Scaling` மற்றும் `LogicalToDeviceUnits` மூலம் அணுகலாம்.

ஒரு விதிவிலக்கு இன்னும் உள்ளது: **owner-draw நிகழ்வுகள்** (`DrawItem`, `DrawNode`, `DrawListViewItem`, grid இன்
`CellPainting`, …) இன்னும் சாதனப் பிக்சல் `Bounds` ஐ ஒரு சாதனப் பிக்சல் `Graphics` உடன் வழங்குகின்றன. இவ்விரண்டும்
ஒன்றுக்கொன்று பொருந்துகின்றன, ஆனால் கட்டுப்பாட்டின் ஏனைய பகுதியுடன் பொருந்துவதில்லை.

அளவிடுதல் அனுமானங்களை `MF_HEADLESS_SCALE=2` இன் கீழ் சோதியுங்கள் (பார்க்க
[தானியக்கம் (Automation)]({{ '/ta/automation/' | relative_url }})) — scale 1 இல் சரியாகவும் வேறு எந்த
scale இலும் தவறாகவும் இருக்கும் குறியீடே பொதுவான bug ஆகும்.

### Trimming மற்றும் NativeAOT
{:#trimming-and-nativeaot}

`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Avalonia` மற்றும்
`Majorsilence.Forms.Headless` ஆகியவை `IsAotCompatible` உடன் build ஆகின்றன. எனவே புதிய trim/AOT அபாயம் ஒன்று trim செய்யப்பட்ட
பயன்பாட்டை அமைதியாக உடைப்பதற்குப் பதிலாக Release build ஐயே தோல்வியடையச் செய்கிறது; மேலும்
`tests/Majorsilence.Forms.AotSmoke` CI இல் ஓர் உண்மையான NativeAOT binary ஐ publish செய்கிறது. Uno, GTK 4,
WinForms, WPF மற்றும் Telerik assemblies **பகுப்பாய்வு செய்யப்படுவதில்லை** — அவற்றின் toolkits reflection ஐ அதிகம் பயன்படுத்துவதால்
AOT உத்தரவாதத்தின் வரம்புக்கு வெளியே உள்ளன.

**Data binding மட்டுமே reflection பயன்படுத்தும் ஒரே பகுதி.** `Control.DataBindings` இயக்க நேரத்தில் properties மற்றும்
`<Property>Changed` நிகழ்வுகளைப் பெயரின் மூலம் கண்டறிகிறது. Framework தனது சொந்தக் கட்டுப்பாடுகளின் bind செய்யக்கூடிய
ஜோடிகளை (`Text`/`TextChanged`, `Checked`, `SelectedIndex`, `Value`) root செய்யும் தனது சொந்த `ILLink.Descriptors.xml` ஐ
உட்பொதிக்கிறது; எனவே **கட்டுப்பாட்டுப் பக்கத்துக்கு உங்களிடமிருந்து எதுவும் தேவையில்லை**. **View-model பக்கம் இன்னும்
உங்கள் பொறுப்பே**: நீங்கள் bind செய்யும் properties ஐப் பயன்பாட்டுத் திட்டத்தில் ஒரு `TrimmerRootDescriptor` மூலம் root செய்யுங்கள்,
அல்லது view model ஐச் சாதாரணக் குறியீட்டில் இணைப்பதன் மூலம் இக்கேள்வியையே தவிர்த்துவிடுங்கள் — reflection இல்லாத
`Majorsilence.Forms.Mvvm` package (`Observe`, `BindText`, `BindCommand`) செய்வது அதுவே. காணாமல் போன அல்லது trim
செய்யப்பட்ட member ஒன்று `DataBindings.Add` இல் அந்த member இன் பெயருடன் வெளிப்படையாகத் தோல்வியடைகிறது; காணாமல் போன
`Changed` நிகழ்வு மட்டுமே அமைதியாக ஒரு-திசை (one-way) binding ஆகக் குறைகிறது. `Label`/`TextBox.Text` க்கு அப்பாற்பட்ட
பரவல் தானியங்கிச் சோதனையால் சரிபார்க்கப்படுவதில்லை; எனவே அதை நம்புவதற்கு முன் ஒரு publish செய்யப்பட்ட build ஐச் சோதியுங்கள்.

## ஹோஸ்ட் பயன்பாட்டில் உட்பொதித்தல்
{:#embedding-in-a-host-app}

மேலே உள்ள அனைத்தும் Majorsilence.Forms மேல்நிலைச் சாளரத்தைச் சொந்தமாக்கிக்கொள்கிறது என்று அனுமானிக்கின்றன. Avalonia, Uno, WinForms,
WPF மற்றும் GTK 4 பின்தளங்கள் *எதிர்* திசையையும் ஆதரிக்கின்றன: ஏற்கனவே உள்ள ஒரு ஹோஸ்ட் பயன்பாடு
Majorsilence.Forms objects ஐத் தனது சொந்த native objects போலவே கையாளுதல் — வழக்கமான `Form.Show()` ஓட்டத்தில்
எதையும் மாற்றாமல், கூடுதலாக மட்டும்.

**ஒரு Majorsilence கட்டுப்பாடு ஹோஸ்ட் கட்டுப்பாடாக மாறுகிறது**, `MajorsilenceFormsPresenter` (ஓர் உண்மையான
`Avalonia.Controls.Canvas` / WinUI `Grid` / `System.Windows.Forms.Control` / WPF `Grid` / GTK
`DrawingArea`) மற்றும் அதன் extension methods வழியாக. விளைவை எந்த native visual tree இலும் இடுங்கள்:

```csharp
Avalonia.Controls.Control            c = myMfControl.ToAvaloniaControl ();  // Majorsilence.Forms
Microsoft.UI.Xaml.FrameworkElement   c = myMfControl.ToUnoControl ();       // Majorsilence.Forms.Uno
System.Windows.Forms.Control         c = myMfControl.ToWinFormsControl ();  // Majorsilence.Forms.WinForms
System.Windows.FrameworkElement      c = myMfControl.ToWpfElement ();       // Majorsilence.Forms.Wpf
Gtk.Widget                           c = myMfControl.ToGtkWidget ();        // Majorsilence.Forms.Gtk4
```

GTK 4 presenter ஒரு GTK widget இலிருந்து derive செய்வதற்குப் பதிலாக ஒரு `Widget` property ஐ *வெளிப்படுத்துகிறது*
(gir.core இன் GObject subclassing க்குக் கூடுதல் integration package ஒன்று தேவை); ஏனைய அனைத்தும் அதே வடிவமே.

**ஒரு Majorsilence `Form` ஹோஸ்ட் சாளரமாக மாறுகிறது.** ஒரு `Form` இன் பின்தளச் சாளரம் அதன் constructor இலேயே
உடனடியாக உருவாக்கப்படுகிறது; இந்தப் பின்தளங்களில் அந்த object ஏற்கனவே ஓர் உண்மையான native சாளரம் *ஆகும்* (Avalonia, WinForms, WPF, GTK 4)
அல்லது அதை *உள்ளடக்குகிறது* (Uno). எனவே இவை அதை நேரடியாகத் திருப்பித் தருகின்றன:

```csharp
Avalonia.Controls.Window  w = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window  w = myForm.ToUnoWindow ();
System.Windows.Forms.Form w = myForm.ToWinFormsForm ();
System.Windows.Window     w = myForm.ToWpfWindow ();
Gtk.Window                w = myForm.ToGtkWindow ();
```

அதன் பிறகு அதைக் காட்டுவது ஹோஸ்டின் பொறுப்பு — அதை main window ஆக ஒதுக்குங்கள், `Owner` ஐ அமையுங்கள்,
`Show()`/`ShowDialog(owner)` ஐ அழையுங்கள். சாளரம் முதன்முறை தெரியும்போது, எந்தப் பக்கம் அதைத் தூண்டியிருந்தாலும்,
Majorsilence இன் சொந்த `Load`/`Shown`/`Application.OpenForms` கணக்கியல் இன்னும் இயங்குகிறது.

**Owner மற்றும் modal உறவுகள் பின்தளத்துக்குப் பின்தளம் வேறுபடுகின்றன.** Avalonia, WinForms மற்றும் GTK 4 அவற்றின் native
`Owner`/`ShowDialog(owner)` மூலம் உண்மையான OS-நிலை modal உறவை வழங்குகின்றன (GTK: transient-for +
modal). இந்தப் பின்தளத்தில் Uno க்கு owner என்ற கருத்து இல்லை; எனவே `ToUnoWindow()` ஒரு சுயாதீனமான மேல்நிலைச்
சாளரத்தைத் திருப்பித் தருகிறது. Uno இன் கீழ் modal நடத்தைக்கு `Form.ShowDialog(parent)` ஐப் பயன்படுத்துங்கள் — இது
native உரிமையைச் சாராத Majorsilence இன் சொந்த modal loop ஆகும்.

ஒவ்வொரு திசையும்
[`EmbeddingAvalonia`]({{ site.github_url }}/tree/main/samples/EmbeddingAvalonia),
[`EmbeddingUno`]({{ site.github_url }}/tree/main/samples/EmbeddingUno),
[`EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) மற்றும்
[`EmbeddingGtk4`]({{ site.github_url }}/tree/main/samples/EmbeddingGtk4) மூலம் காட்டப்படுகிறது; பார்க்க
[மாதிரிகள் (Samples)]({{ '/ta/samples/' | relative_url }}).

## Avalonia பின்தளம்
{:#the-avalonia-backend}

இயல்புநிலைப் பின்தளம்; எந்த அமைப்பும் இல்லாமல் ஒரு புதிய desktop பயன்பாடு பெறுவது இதுவே. Windows/macOS/Linux இல்
சாளர ஹோஸ்ட் ஓர் உண்மையான `Avalonia.Controls.Window` *ஆகும்*. அதனால்தான் `TryGetPlatformHandle` ஐச் செயல்படுத்தும் ஒரே பல்தள
பின்தளம் இதுவாகும் (பார்க்க
[Native interop]({{ '/ta/native-interop/' | relative_url }})), மேலும் அதனால்தான் `ToAvaloniaWindow()` ஒரு ஹோஸ்ட்
பயன்பாட்டுக்கு உண்மையான OS-நிலை owner/modal நடத்தையை வழங்குகிறது.

இது desktop க்கு மட்டுமானது அல்ல. இத்திட்டம் பின்வருவனவற்றை multi-target செய்கிறது:

| TFM | Build ஆவது | Avalonia தள package |
|---|---|---|
| `net8.0`, `net10.0` | எப்போதும் | `Avalonia.Desktop` + `Avalonia.Controls.WebView` |
| `net10.0-browser` | எப்போதும் | `Avalonia.Browser` |
| `net10.0-android` | Opt-in: `-p:EnableAndroidTarget=true` (`android` workload தேவை) | `Avalonia.Android` |
| `net10.0-ios` | Opt-in: `-p:EnableIOSTarget=true` (`ios` workload தேவை, macOS இல் மட்டும்) | `Avalonia.iOS` |

wasm-tools *publish* செய்வதற்கு மட்டுமே தேவைப்படுவதால் browser வரிசை நிபந்தனையற்றது. Android மற்றும் iOS opt-in ஆக
உள்ளன, ஏனெனில் அந்த வரிசையை compile செய்வதற்கே அவற்றின் workloads தேவை; ஒரு கணினியில் பொதுவாக ஒரு workload இருக்கும்,
மற்றொன்று இருக்காது என்பதால் இரண்டு கட்டுப்பாடுகளும் தனித்தனியாக உள்ளன.

### ஒற்றைக் காட்சித் தளங்கள் (browser, Android, iOS)
{:#single-view-platforms-browser-android-ios}

மூன்றிலும் OS window manager இல்லை; ஒவ்வொன்றும் ஒரு app/tab/screen க்குச் சரியாக ஒரு view ஐ மட்டுமே வழங்குகிறது. அவை
ஒரே ஹோஸ்டைப் பகிர்கின்றன; அதில் **ஒவ்வொரு** Majorsilence.Forms சாளரமும் Avalonia `Window` அல்ல, ஒரு `Canvas` ஆகும்:
popup அல்லாத முதல் படிவம் viewport ஐ நிரப்புகிறது; popups, menus மற்றும் கூடுதல் மேல்நிலைப் படிவங்கள் அதன்
absolute நிலையிடப்பட்ட children ஆகும். தொடக்கம் ஹோஸ்டால் இயக்கப்படுகிறது மற்றும் ஒரு **factory** ஐ ஏற்கிறது,
ஏனெனில் பின்தளம் initialize ஆவதற்கு முன் படிவம் இருக்கக்கூடாது:

```csharp
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());  // browser
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());             // OnCreate இலிருந்து
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());                 // FinishedLaunching இலிருந்து
```

**அங்கே வேலை செய்யாதவை** — பெரும்பாலும் நிலுவையிலுள்ள வேலை அல்ல, இயல்பான வரம்புகள்:

- **சாளர அலங்காரம் (chrome) இல்லை.** `Topmost`, system decorations, `SetIcon`, `Min`/`MaximumSize`, `CanResize`,
  `ShowInTaskbar`, `WindowState` மற்றும் move/resize drags ஆகியவை no-op (எதுவும் செய்யாது). `Title` உம் இன்று no-op தான், ஆனால்
  அது நிலுவையிலுள்ள வேலை.
- **`ShowDialog` OS-modal அல்ல** — parent-disable இணைப்புக்கோட்டுக்கு மேலே இருப்பதால் அது இன்னும் modal ஆகவே *நடந்துகொள்கிறது*;
  இரண்டாம் நிலைச் சாளரம் view இன் மேல்-இடது மூலையில் திறக்கிறது. மேலும் **blocking** `ShowDialog`
  மூன்றில் எதிலும் வேலை செய்வதே இல்லை — பார்க்க [Browser threading](#browser-threading).
- **WebView இல்லை.** ஒன்று தேவைப்படும் compat கட்டுப்பாடுகள் (`RadPdfViewer`, `RadRichTextEditor`) தமது
  எளிய viewer பாதைகளுக்குப் பின்வாங்குகின்றன. Browser இல் native webview இல்லை; Android மற்றும் iOS இல் உள்ளது, எனவே அவ்விரண்டும்
  கடினமான வரம்பு அல்ல, ஒத்திவைக்கப்பட்ட வேலை.
- **வேறொரு பயன்பாட்டுக்கு focus இழக்கும்போது popup மூடப்படுவது நிகழாது**; பயன்பாட்டினுள் வேறு இடத்தில் click செய்தால்
  popups இன்னும் மூடப்படுகின்றன.

**அங்கே வேலை செய்பவை** (மொபைல் சமநிலை):

- **திரை விசைப்பலகை (on-screen keyboard).** ஒரு `TextBox` க்கு focus கொடுத்தால் soft keyboard எழும்; blur ஆனதும் மறையும்.
  `TextBoxBase.InputKind` (`Number`, `Email`, `Url`, `Phone`) layout ஐத் தேர்ந்தெடுக்கிறது; masked மற்றும் multiline
  boxes பொருத்தமான விசைப்பலகையைப் பெறுகின்றன. Desktop பின்தளங்கள் இதைப் புறக்கணிக்கின்றன.
- **Safe-area insets.** `Form.SafeAreaPadding` தானாகப் பயன்படுத்தப்படுகிறது; எனவே dock மற்றும் anchor செய்யப்பட்ட
  கட்டுப்பாடுகள் status bar, notch மற்றும் home indicator இலிருந்து விலகி இருக்கின்றன; விசைப்பலகை திறக்கும்போது,
  focus உள்ள புலம் பார்வைக்குள் scroll செய்யப்படுகிறது.
- **Lifecycle, back button, size classes.** `Application.Suspended`/`Resumed`,
  `WindowBase.BackRequested` (வார்ப்புருவின் `MainActivity` Android back button ஐ அனுப்புகிறது),
  `Form.SizeClass`/`SizeClassChanged`, Android இல் touch scroll bars, மற்றும் phone பாணி layout
  கட்டுப்பாடுகள் (`StackPanel`, `Card`, `RichListBox`, `NavigationHost`) —
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md) இல்.

**மூன்றின் முதிர்ச்சியும் கூர்மையாக வேறுபடுகிறது.** மூன்றும் CI இல் compile ஆகின்றன, ஆனால் headless சோதனைத் தொகுப்பு
பகிரப்பட்ட மையத்தையே சோதிக்கிறது, ஓர் உண்மையான head ஐ அல்ல.

- **Browser** முழுக் கட்டுப்பாட்டுக் காட்சியகத்தையும் இயக்குகிறது — [நேரடி demo]({{ '/gallery/' | relative_url }}) அதுவே — மேலும்
  அதன் modal மற்றும் அணுகல்தன்மைச் சோதனைகள் ஒவ்வொரு CI build இலும் headless Chrome இல் இயங்குகின்றன. இந்தப் பாதை இன்னும்
  இளமையானது.
- **Android** ஒரு தொடக்க உண்மைச் சாதனச் சோதனையைக் கடந்துள்ளது: காட்சியகம் boot ஆகிறது; tap hit-testing, render
  அளவிடுதல் மற்றும் touch scroll/flick ஆகியவை வன்பொருளில் உறுதிப்படுத்தப்பட்டுள்ளன. திரை விசைப்பலகை, safe-area insets
  மற்றும் சுழற்சி (rotation) Headless இல் unit-test செய்யப்பட்டுள்ளன, ஆனால் இன்னும் ஒரு சாதனத்தில் சோதிக்கப்படவில்லை.
- **iOS** compile ஆகிறது; CI அதை ஒரு simulator இல் smoke check ஆக launch செய்கிறது, ஆனால் யாரும் அதை
  simulator அல்லது சாதனத்தில் ஊடாடும் வகையில் இயக்கவில்லை; `ios` job இன்னும் `continue-on-error` ஆகவே உள்ளது.

### Browser இல் இயக்குதல் (WebAssembly)
{:#running-in-the-browser-webassembly}

தனி WASM package எதுவும் இல்லை — `Majorsilence.Forms.Avalonia` இன் `net10.0-browser` வரிசை
Avalonia 12 இன் `Avalonia.Browser` தளத்தின் மீது build செய்யப்படுகிறது (WebGL2/Emscripten, desktop இன் அதே Skia renderer).
ஒரு குறைந்தபட்ச browser head, ஒரு `Microsoft.NET.Sdk.WebAssembly` திட்டத்திலிருந்து `Majorsilence.Forms.Avalonia` + `Avalonia.Browser` ஐக்
குறிப்பிடுகிறது — பார்க்க
[`samples/Gallery.Wasm`]({{ site.github_url }}/tree/main/samples/Gallery.Wasm), அல்லது
`dotnet new majorsilenceforms --IncludeWasm` மூலம் ஒன்றை உருவாக்குங்கள்.

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

`out/wwwroot` ஐ எந்த static file server மூலமும் serve செய்யுங்கள் — `dotnet run` ஒரு WebAssembly SDK
திட்டத்தை serve செய்வதில்லை. CI இந்த bundle ஐ ஒவ்வொரு PR இலும் publish செய்து ஒவ்வொரு release உடனும் இணைக்கிறது.

Browser இல் உண்மையான filesystem இல்லை. ஒன்றை முன்கூட்டியே ஏற்றுவதற்கான வழக்கமான item ஆன `WasmFilesToIncludeInFileSystem`,
`Microsoft.NET.Sdk.WebAssembly` இன் கீழ் அமைதியாகப் புறக்கணிக்கப்படுகிறது; அதனால்தான் browser (மற்றும் Android/iOS) builds இல்
காட்சியகத்தின் சொந்த icons இன்னும் காணப்படவில்லை. அத்தகைய assets ஐப் பதிலாக `EmbeddedResource` ஆக அனுப்புங்கள்.

### Browser threading
{:#browser-threading}

Browser இல் .NET பக்கத்தின் ஒரே JavaScript thread இல் இயங்குகிறது. திரும்பாத ஓர் அழைப்பு, அது திரும்புவதற்கு உதவியிருக்கக்கூடிய
உள்ளீடு, timers மற்றும் வரைதல் ஆகியவற்றையும் நிறுத்திவிடுகிறது — எனவே nested modal loop இயங்க முடியாது, மேலும்
Avalonia பின்தளம் `net10.0-browser` இல் `CanRunModalLoop = false` எனத் தெரிவிக்கிறது. **Android மற்றும் iOS இலும்
இதுவே உண்மை**, வேறொரு காரணத்துக்காக: அங்கே Avalonia வின் dispatcher ஒரு nested frame ஐ push செய்ய முடியாது
(Android 15 emulator மற்றும் iPhone 17 Pro simulator இல் அளவிடப்பட்டது).

ஒவ்வொரு blocking modal நுழைவுப் புள்ளியும் **எதையும் காட்டுவதற்கு முன்** அந்த flag ஐச் சரிபார்த்து, அதன் async இரட்டையின்
பெயரைக் குறிப்பிடும் `PlatformNotSupportedException` ஐ எறிகிறது; எனவே மறுக்கப்பட்ட அழைப்பு எந்த உரையாடல் சாளரத்தையும் திறந்தபடி
விடுவதில்லை, எந்த owner ஐயும் முடக்கியபடி விடுவதில்லை. ஒவ்வொரு modal API க்கும் await செய்யக்கூடிய வடிவம் உள்ளது; ஒவ்வொன்றும்
எல்லாப் பின்தளங்களிலும் வேலை செய்கிறது:

| Blocking | Await செய்யக்கூடியது |
|---|---|
| `Form.ShowDialog (…)` | `Form.ShowDialogAsync (…)` — அதே owner overloads |
| `MessageBox.Show (…)` | `MessageBox.ShowAsync (…)` |
| `OpenFileDialog`/`SaveFileDialog`/`FolderBrowserDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `TaskDialog.ShowDialog (…)` | `TaskDialog.ShowDialogAsync (…)` |
| `ColorDialog`/`FontDialog`/`PrintPreviewDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `CommonDialog.ShowDialog` (உங்கள் சொந்த subclass) | `CommonDialog.ShowDialogAsync`; `RunDialogAsync` ஐ override செய்யுங்கள் |
| `VbInteraction.MsgBox`/`InputBox` | `VbInteraction.MsgBoxAsync`/`InputBoxAsync` |
| `RadMessageBox.Show (…)` (Telerik compat) | `RadMessageBox.ShowAsync (…)` |

வழக்கமான வடிவம் ஒரு `async void` நிகழ்வு கையாளி (event handler) — `async void` வழக்கமான முறையாக இருக்கும் ஒரே இடம் இதுவே:

```csharp
private async void deleteButton_Click (object sender, EventArgs e)
{
    if (await MessageBox.ShowAsync (this, "Delete the selected rows?", "Orders", MessageBoxButtons.YesNo) != DialogResult.Yes)
        return;

    using var options = new DeleteOptionsForm ();
    if (await options.ShowDialogAsync (this) == DialogResult.OK)
        await DeleteAsync (options.Mode);
}
```

அதே விதி `task.Result`, `.Wait ()`, `GetAwaiter ().GetResult ()` மற்றும் `Thread.Sleep` க்கும் பொருந்தும் —
`await` மற்றும் `await Task.Delay` ஐப் பயன்படுத்துங்கள்.

**Analyzer.** மைய `Majorsilence.Forms` package, code fixes உடன் கூடிய ஒரு Roslyn analyzer ஐக் கொண்டுள்ளது:
`MFB001` ஒரு blocking modal அழைப்பு (அதன் await செய்யக்கூடிய இரட்டையின் பெயருடன்), `MFB002` ஒரு task மீதான synchronous காத்திருப்பு,
`MFB003` `Thread.Sleep`. குறியீடு browser குறியீடாக இல்லாவிட்டால் அது அமைதியாக இருக்கும் — browser குறியீடு என்பது ஒரு `net*-browser` TFM,
`<SupportedPlatform Include="browser" />` ஐ அறிவிக்கும் ஒரு library, அல்லது ஒரு browser head குறிப்பிடும் பகிரப்பட்ட UI
library க்கான வெளிப்படையான opt-in:

```ini
# பகிரப்பட்ட UI library க்கு அருகிலுள்ள .editorconfig
[*.cs]
majorsilence_forms.browser_target = true
```

Analyzer browser க்கு மட்டுமே; Android அல்லது iOS குறியீட்டில் உள்ள blocking அழைப்பு build நேரத்தில் கொடியிடப்படுவதில்லை,
இயக்க நேரத்தில் அதே செய்தியுடன் தோல்வியடைகிறது. JSPI அல்லது CoreCLR browser runtime என்றாவது ஒரு
nested loop ஐ இயங்க அனுமதித்தால், மீண்டும் இயக்க வேண்டிய ஒரே switch `CanRunModalLoop` ஆகும்.

### அணுகல்தன்மை DOM (browser)
{:#accessibility-dom-browser}

ஒற்றை canvas ஒரு திரை வாசிப்பானுக்கு (screen reader), find-in-page க்கு அல்லது DOM சோதனைக் கருவிக்குத் தெரிவதில்லை. எனவே browser
இலக்கில் Avalonia பின்தளம் **திறந்திருக்கும் படிவங்களின் DOM பிரதியை canvas க்கு அருகில்** வைத்திருக்கிறது:
ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒரு வெளிப்படையான, click ஊடுருவும் element; அது அதன் ARIA role, பெயர், நிலை மற்றும் எல்லைகளைக் கொண்டுள்ளது;
framework இன் சொந்தத் தானியக்க மரத்திலிருந்து (automation tree) உருவாக்கப்படுகிறது — Windows UI Automation bridge உம்
WebDriver server உம் வாசிக்கும் அதே மரம்; எனவே ஒரு சோதனை கண்டறியக்கூடிய எதையும் திரை வாசிப்பானும் கண்டறிய முடியும். அது
வரைதலுக்குப் பின் அதிகபட்சம் ஒவ்வொரு 100 ms க்கும் ஒருமுறை மீள்-ஒத்திசைக்கிறது, மாறியதை மட்டுமே அனுப்புகிறது; popups அவை
திறக்கப்பட்ட சாளரத்தினுள் பிரதிபலிக்கப்படுகின்றன; இரண்டு live regions உரையாடல் சாளரங்கள், message boxes, status உரை மற்றும்
`LiveSetting` கொண்ட labels ஐ அறிவிக்கின்றன. சோதனைக் கருவிகள் role மற்றும் பெயர் அல்லது `[data-mf-automation-id=…]` மூலம் கண்டறிந்து,
element இன் bounding box இல் click செய்கின்றன, ஏனெனில் உள்ளீடு இன்னும் canvas க்கே உரியது.

நேர்மையான எச்சரிக்கை: DOM ஐ வாசித்தும் headless Chrome இல் live regions ஐப் பதிவுசெய்தும் இது சரிபார்க்கப்பட்டது.
**உண்மையான திரை வாசிப்பானுடன் இதுவரை எதுவும் முயற்சிக்கப்படவில்லை.**
`Majorsilence.Forms.Browser.DisableAccessibilityDom` AppContext switch மூலம் இதிலிருந்து விலகலாம்.

## Headless பின்தளம்
{:#the-headless-backend}

சாத்தியமான மிக எளிய பின்தளம், பின்பற்ற வேண்டிய மாதிரிச் செயலாக்கம்: ஒரு work-queue message loop,
நினைவகத்தினுள் ஒரு clipboard, ஒரு மெய்நிகர் திரை, மற்றும் ஒரு `SKSurface` க்கு offscreen வரைதல்.
`HeadlessRenderer.Use ()` அதை நிறுவி, அழைக்கும் thread ஐ UI thread ஆக்குகிறது;
`CapturePng (window, w, h)` PNG ஆக வரைகிறது; `Click`/`MouseDown`/`KeyDown`/`TextInput` உதவிகள், ஓர் உண்மையான பின்தளம்
பயன்படுத்தும் அதே நடுநிலை `Handle*` பாதையை இயக்குகின்றன. இதற்கு display தேவையில்லை; எனவே இது unit
tests ஐ இயக்குகிறது, மேலும் CI மற்றும் pixel-diff சோதனைகளுக்காக ControlGallery ஐ வரைகிறது:

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

இங்கே animation நிர்ணயமானது (deterministic): `control.RequestAnimationFrame (…)` ஒரு display timer ஆல் அல்ல,
`HeadlessRenderer.AnimationClock.Step (n)` என்ற கைமுறைக் கடிகாரத்தால் இயக்கப்படுகிறது. பார்க்க
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md).

## Uno பின்தளம்
{:#the-uno-backend}

Uno Platform இன் Skia இலக்கில் இணைப்புக்கோட்டைச் செயல்படுத்துகிறது: `UnoPlatformBackend` `DispatcherQueue` ஐயும்
WinUI clipboard ஐயும் இயக்குகிறது; `UnoWindowHost` ஒரு `SKXamlCanvas` ஐ ஹோஸ்ட் செய்து pointer/key/character
நிகழ்வுகளை நடுநிலை உள்ளீட்டுப் பாதைக்கு மொழிபெயர்க்கிறது. இதற்கு ஒரு Uno *app head* தேவை — பார்க்க
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — மேலும் macOS இல் முழுக் காட்சியகத்தையும்
launch செய்து வரைவது சரிபார்க்கப்பட்டுள்ளது.

இந்தப் பின்தளத்தில் Majorsilence.Forms இன் தானே வரையப்பட்ட chrome க்கான சாளர drag/resize, imperative அல்ல, declarative ஆகும்:
OS resize ஓரங்களை வைத்திருக்கும் borderless presenter இலிருந்து resize இலவசமாகக் கிடைக்கிறது; title-bar drag,
Windows desktop head இல் WinUI இன் caption-region API (`SetCaptionRegions`) ஐப் பயன்படுத்துகிறது.
macOS இல் native decorations drag/resize ஐக் கையாளுகின்றன; X11 இல் title-bar drag கிடைக்காது, மேலும்
`UseSystemDecorations` மாற்று வழியாகும்.

## GTK 4 பின்தளம்
{:#the-gtk-4-backend}

`Majorsilence.Forms.Gtk4`, [gir.core](https://github.com/gircore/gir.core) bindings மூலம் GTK 4 இல் இணைப்புக்கோட்டைச்
செயல்படுத்துகிறது. இது Linux ஐ (Wayland/X11) முதன்மையாகக் கொண்ட உண்மைச் சாளர desktop பின்தளம்; GTK 4 runtime
நிறுவப்பட்டுள்ள இடங்களில் Windows/macOS இலும் compile ஆகி இயங்குகிறது. Avalonia போலன்றி இது வெளிப்படையாகத் தேர்ந்தெடுக்கப்படுகிறது:

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // Gtk4PlatformBackend ஐ நிறுவுகிறது
Application.Run (new MainForm ());      // GLib main loop
```

**வேலை செய்பவை:** ஒவ்வொரு மேல்நிலைப் படிவத்துக்கும் ஓர் உண்மையான `Gtk.Window`, popups க்கு borderless சாளரங்கள்; ஒவ்வொரு
paint இலும் Skia ஒரு Cairo image surface இல் வரையப்படுகிறது; GTK event controllers வழியாக mouse, விசைப்பலகை மற்றும்
தட்டச்சு செய்யப்பட்ட உரை; `Timer` இன் பின்னால் GLib timers; clipboard உரை மற்றும் பல-monitor `Screen`; `Gdk.Toplevel.BeginMove/BeginResize`
வழியாக custom-chrome move/resize drags; உண்மையான transient-for/modal உறவுடன் `ShowDialog`;
இரு திசைகளிலும் உட்பொதித்தல் (`ToGtkWidget()`, `ToGtkWindow()`); மற்றும் `NativeControlHost` — ஒரு Majorsilence
காட்சியினுள் மேலடுக்காக வைக்கப்படும் ஓர் உண்மையான `Gtk.Widget`. GTK 4 ஒவ்வொரு widget ஐயும் ஒரே render tree இல் composite செய்கிறது;
எனவே Avalonia/Uno/WinForms போலன்றி **இங்கே airspace சிக்கல் இல்லை**. `WebBrowser`, `RadPdfViewer` மற்றும் `RadRichTextEditor` ஆகியவை
**WebKitGTK 6.0** ஆல் ஆதரிக்கப்படுகின்றன (navigation நிகழ்வுகள், `ExecuteScriptAsync`, JS இலிருந்து ஹோஸ்டுக்கு ஒரு message bridge);
native library ஒரு `WebBrowser` உருவாக்கப்படும்போது மட்டுமே ஏற்றப்படுகிறது; அது இல்லாவிட்டால் `IsWebViewFunctional` false ஆகும்.

Wayland இல் சரிபார்க்கப்பட்டது: சாளரம் தெரிகிறது, முழு ControlGallery உம் வரையப்படுகிறது, timers இயங்குகின்றன, repaints
உள்ளீட்டைத் தொடர்கின்றன, உட்பொதித்தல் மாதிரி காட்டப்படுகிறது, webview ஒரு script செய்தியைச் சுற்றி அனுப்பித் திரும்பப் பெறுகிறது.

**வேலை செய்யாதவை** — பெரும்பாலும் நிலுவையிலுள்ள வேலை அல்ல, GTK 4 இலிருந்து நீக்கப்பட்ட API கள்: திரை-நிலைக்
கட்டுப்பாடு இல்லை (`Form.Location` என்பது window manager புறக்கணிக்கக்கூடிய ஒரு குறிப்பு மட்டுமே; `Topmost`, `ShowInTaskbar` மற்றும்
`MaximumSize` மதிப்புகள் சேமிக்கப்பட்டுத் திரும்பக் கிடைக்கின்றன, ஆனால் அமல்படுத்தப்படுவதில்லை); `SetIcon(byte[])` ஒரு no-op (GTK 4 icons தீம்
பெயர்களாகும்); கோப்பு மற்றும் folder pickers வெறுமையாகத் திரும்புகின்றன, எனவே Headless இல் போலவே common-dialog மாற்று வழிகள்
பொறுப்பேற்கின்றன; fractional scaling, GTK இன் முழுஎண் scale factor (1 அல்லது 2) ஐப் பயன்படுத்துகிறது; மேலும் இந்தப் பின்தளம்
AOT-பகுப்பாய்வு செய்யப்படுவதில்லை. இதற்கு ஒரு display server தேவை — offscreen வரைதலுக்கு Headless ஐப் பயன்படுத்துங்கள்.

**நிறுவுதல்.** Debian/Ubuntu இல் `libgtk-4-1`, Fedora/Arch இல் `gtk4`, macOS இல் `brew install gtk4`,
Windows இல் GTK runtime; webview க்கு WebKitGTK 6.0 ஐச் சேர்க்கவும் (Debian/Ubuntu இல் `libwebkitgtk-6.0-4`).
[`samples/Gallery.Gtk4`]({{ site.github_url }}/tree/main/samples/Gallery.Gtk4) ஐ இயக்குங்கள்
(webview படிவத்துக்கு `MF_GTK4_WEBVIEW=1`). மேலும் பார்க்க
[Linux இல் WinForms]({{ '/ta/winforms-on-linux/' | relative_url }}).

## Terminal பின்தளம்
{:#the-terminal-backend}

`Majorsilence.Forms.Terminal` ஒரு படிவத்தை terminal இல் இயக்குகிறது. Terminal தான் சாளரம்; எனவே இது ஒரு phone போல
ஒற்றைக் காட்சி ஹோஸ்ட்: படிவம் திரையை நிரப்புகிறது, title bar அல்லது caption buttons எதையும் வரைவதில்லை, மேலும்
அதன் `Text` terminal இன் சொந்தத் தலைப்புக்குச் செல்கிறது. பயன்பாடு வெளியேறத் தனது சொந்த வழியை வழங்குகிறது (`Close ()`);
**Ctrl+C எப்போதும் வெளியேறுகிறது**, அது ஒருபோதும் பயன்பாட்டுக்கு வழங்கப்படுவதில்லை. Popups படிவத்தின் மேல் composite ஆகின்றன; ஓர் உரையாடல் சாளரம்
காட்டப்படும்போது அது திரையை மாற்றீடு செய்கிறது.

```csharp
TerminalApplication.Use ();             // அல்லது Use (new TerminalOptions { … })
Application.Run (new MainForm ());
```

**வெளியீட்டு முறைகள்.** வழக்கமான Skia pipeline offscreen இல் வரைகிறது; படம் நான்கு வழிகளில் ஒன்றில் காட்டப்படுகிறது:

| முறை | தெளிவுத்திறன் | எப்போது |
|---|---|---|
| Kitty graphics | terminal இன் உண்மையான பிக்சல்கள் | kitty, WezTerm, Ghostty |
| Sixel | உண்மையான பிக்சல்கள், 256 நிறங்கள் | foot, mlterm, iTerm2, Contour, xterm `-ti vt340` |
| Blocks (graphics இல்லாதபோது இயல்புநிலை) | Unicode quadrant glyphs இலிருந்து ஒரு cell க்கு 2×4 பிக்சல்கள் | ஏனைய அனைத்தும், மேலும் tmux/screen இனுள் எப்போதும் |
| Half-block | ஒரு cell க்கு 1×2 பிக்சல்கள் | quadrant glyphs இல்லாத font க்கு, நிலைப்படுத்தினால் மட்டும் |

Blocks முறை 300×80 terminal ஐ 600×320 திரையாக்குகிறது; scale 1 இல் வாசிக்கக்கூடியது. மாறிய cells,
பகுதிகள் அல்லது 16×8-cell tiles மட்டுமே மீண்டும் அனுப்பப்படுகின்றன; எனவே ஒரு caret blink என்பது ஒரு tile மட்டுமே.

**கண்டறிதல் மற்றும் நிலைப்படுத்தல்.** தொடக்கத்தில் ஹோஸ்ட் `TERM` ஐ நம்புவதற்குப் பதிலாக, terminal எதை ஆதரிக்கிறது என்று அதனிடமே கேட்கிறது
(Kitty graphics, Kitty keyboard மற்றும் device attributes — இது Sixel ஐயும் பட்டியலிடுகிறது); truecolor
உம் அதே வழியில் உறுதிப்படுத்தப்படுகிறது. `MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` அல்லது
`TerminalOptions.GraphicsMode` மூலம் ஒரு முறையை நிலைப்படுத்துங்கள்; நிலைப்படுத்தப்பட்ட முறை ஒருபோதும் மேலெழுதப்படுவதில்லை. `MF_TERMINAL_SIXEL_MAX=WxH`,
உயர்த்தப்பட்ட xterm `maxGraphicsSize` பற்றி ஹோஸ்டுக்குத் தெரிவிக்கிறது (xterm இயல்பாக Sixel படங்களை 1000×1000 இல் வெட்டிவிடுகிறது,
எனவே படிவம் பொருந்தும்படி அளவிடப்படுகிறது); `MF_TERMINAL_TRACE=/path` மூல பதில்கள், தேர்ந்தெடுக்கப்பட்ட முறை மற்றும்
decode செய்யப்பட்ட ஒவ்வொரு உள்ளீட்டு நிகழ்வையும் பதிவு செய்கிறது.

**உள்ளீடு.** Mouse (clicks, drags, hover, wheel) மற்றும் விசைப்பலகை (உரை, arrows, navigation விசைகள், F1–F12,
modifiers) byte stream இலிருந்து decode செய்யப்படுகின்றன; Kitty graphics உடன் mouse பிக்சல்-துல்லியமானது.
Terminal Kitty keyboard protocol ஐ வழங்கும் இடத்தில் அது இயக்கப்படுகிறது; அது உண்மையான key releases, துல்லியமான
modifiers மற்றும் சரியான US அல்லாத layouts ஐ வழங்குகிறது. ஒரு படிவம் எதற்கும் focus இல்லாமல் தொடங்குகிறது; எனவே arrow விசைகளைப்
பயன்படுத்துவதற்கு முன் ஒருமுறை Tab ஐ அழுத்துங்கள்.

xterm 407 (`-ti vt340` உடன் Sixel; இயல்பாக Blocks/truecolor) மற்றும் WezTerm (Kitty graphics, நிலைப்படுத்தினால் Sixel)
இல் **சரிபார்க்கப்பட்டது**. **இன்னும் சரிபார்க்கப்படாதவை:** kitty, Ghostty, foot, iTerm2, Windows Terminal,
macOS Terminal, tmux, மற்றும் Windows console I/O (VT modes க்கு எதிராக எழுதப்பட்டது, சோதிக்கப்படவில்லை). Native
file pickers, `NativeControlHost` மற்றும் web views க்கு terminal இல் சமமானது எதுவும் இல்லை.
[`samples/Gallery.Terminal`]({{ site.github_url }}/tree/main/samples/Gallery.Terminal) ஐ ஒரு
truecolor terminal இல் இயக்குங்கள்.

## WinForms மற்றும் WPF பின்தளங்கள் (இடம்பெயர்த்தல்)
{:#the-winforms-and-wpf-backends-migration}

இவ்விரண்டும் ஒரே நோக்கத்துக்காக உள்ளன: **Windows இல் படிப்படியான இடம்பெயர்த்தல் (incremental migration)**. ஒரு WinForms அல்லது WPF பயன்பாடு
தனது shell, menus மற்றும் சாளரங்களை உண்மையான toolkit இலேயே வைத்திருக்கிறது; தனிப்பட்ட திரைகள் அல்லது கட்டுப்பாடுகள்
Majorsilence.Forms க்கு நகர்கின்றன — port செய்யப்பட்ட ஒவ்வொரு பகுதியும் ஒரு நிலையான `System.Windows.Forms.Control` அல்லது
WPF `FrameworkElement` ஆக மீண்டும் இடம்பெறுகிறது. ஒரு WinForms *control library* தனது உள்ளகங்களை port செய்துகொண்டே
தனது பயனர்களுக்கு WinForms கட்டுப்பாடுகளைத் தொடர்ந்து வழங்க முடியும். அனைத்தும் port செய்யப்பட்டதும், package ஐ
`Majorsilence.Forms.Avalonia` க்கு மாற்றுங்கள்; அதே குறியீடு பல்தளமாகிறது; இணைப்புக்கோட்டுக்கு மேலே எதுவும் மாறுவதில்லை.
இரண்டும் `net8.0-windows`/`net10.0-windows` உடன் **`net48`** ஐயும் இலக்காகக் கொள்கின்றன; எனவே ஒரு .NET Framework 4.8 பயன்பாடு
முதலில் நவீன .NET க்கு நகராமலேயே இடம்பெயர்த்தலைத் தொடங்கலாம்.

**`Majorsilence.Forms.WinForms`** பழைய Win32 pump இல் உண்மையான `System.Windows.Forms` சாளரங்களை ஹோஸ்ட் செய்து,
GDI ஆதரவுடைய ஒரு கட்டுப்பாடு வழியாக Skia ஐக் காட்டுகிறது. WinForms உள்ளீடு ஏற்கனவே சாதனப் பிக்சல்களில் உள்ளது;
அதன் `Keys`/`MouseButtons` enums எண்ணளவில் Majorsilence.Forms இன் enums க்குச் சமமானவை; எனவே மொழிபெயர்ப்பு என்பது ஒரு
cast மட்டுமே. Popups borderless tool சாளரங்கள்; `TryGetPlatformHandle` உண்மையான HWND ஐத் திருப்பித் தருகிறது. எந்தப் பின்தளமும்
அமைக்கப்படாதபோது presenter தானாகவே பின்தளத்தை நிறுவுகிறது; எனவே பயன்பாட்டின் ஏற்கனவே உள்ள `Application.Run`
அனைத்தையும் கவனித்துக்கொள்கிறது:

```csharp
using Majorsilence.Forms.WinForms;

var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// அல்லது ஒரு முழு MF Form ஐ native-modal உரையாடல் சாளரமாக WinForms இடம் ஒப்படையுங்கள்
System.Windows.Forms.Form native = myMfForm.ToWinFormsForm ();
native.ShowDialog (ownerWinFormsForm);
```

`samples/EmbeddingWinForms` வழியாக Windows இல் ஊடாடும் வகையில் சரிபார்க்கப்பட்டது: வரைதல், mouse மற்றும் விசைப்பலகை
உள்ளீடு, combo-dropdown popups, `NativeControlHost` மேலடுக்குகள் மற்றும் `ToWinFormsForm()` modal உரையாடல் சாளரங்கள்.
செயல்படுத்தப்படாதவை: gestures (WinForms க்கு gesture API இல்லை) மற்றும் `IWebViewFactory` (webview சார்ந்த compat
கட்டுப்பாடுகள் மாற்று வழிக்குப் பின்வாங்குகின்றன). Windows க்கு வெளியே நவீன-.NET வரிசைகள் வெற்று placeholder ஆக build ஆகின்றன; எனவே ஒரு
பல்தள solution எல்லா இடங்களிலும் இன்னும் compile ஆகிறது.

**`Majorsilence.Forms.Wpf`** ஓர் உண்மையான WPF `Window` மற்றும் `Dispatcher` loop மீது அதே வடிவம் கொண்டது;
Skia ஒரு `WriteableBitmap` வழியாகக் காட்டப்படுகிறது, `Microsoft.Win32` கோப்பு உரையாடல் சாளரங்கள் மற்றும்
`System.Windows.Clipboard` பயன்படுத்தப்படுகின்றன. WPF இல் `NotifyIcon` இல்லாததால், அது உண்மையான `System.Windows.Forms.NotifyIcon` ஐப்
பயன்படுத்துகிறது. அதை வெளிப்படையாகத் தேர்ந்தெடுங்கள், அல்லது உட்பொதியுங்கள்:

```csharp
Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();   // MF பயன்பாட்டைச் சொந்தமாக்குகிறது
Application.Run (new MainForm ());

myWpfGrid.Children.Add (myMfControl.ToWpfElement ());                  // அல்லது ஒரு WPF பயன்பாட்டில் உட்பொதியுங்கள்
```

[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf) அதன் மீது முழுக் காட்சியகத்தையும்
இயக்குகிறது.

**`WindowsFormsInterop` உடனான தொடர்பு.** இரண்டும் படிப்படியான இடம்பெயர்த்தலுக்காகவே உள்ளன, ஆனால் அதன் வெவ்வேறு
அடுக்குகளைத் தீர்க்கின்றன. `Majorsilence.Forms.WindowsFormsInterop` ஒரு WinForms பயன்பாட்டுக்கும் Avalonia பின்தளத்தில் இயங்கும்
Majorsilence.Forms க்கும் இடையே **முழுப் படிவங்களை** இணைக்கிறது, ஒரே message pump ஐப் பகிர்ந்துகொள்கிறது. WinForms
பின்தளம் Avalonia வை முற்றாக நீக்கி, **கட்டுப்பாடு** நுணுக்க நிலையில் வேலை செய்கிறது. அவை ஒன்றாக இருக்கலாம் —
ஏற்கனவே அமைக்கப்பட்ட பின்தளத்தை presenter தொடுவதில்லை. பொது API WinForms வகைகளைக் கொண்ட ஒரு control library க்கு
மூன்றாவது வழியும் உள்ளது: `Majorsilence.Forms.WinFormsShims.Compat` source
generator; பார்க்க [இடம்பெயர்த்தல் வழிகாட்டி]({{ '/ta/migration/' | relative_url }}).

## தொடு சைகைகள் (touch gestures)
{:#touch-gestures}

`Control` இல் touch மற்றும் pen உள்ளீட்டுக்கான, முற்றிலும் கூடுதலான (additive) நிகழ்வுகள் உள்ளன: `LongPress`, `Pinch` (pinch-to-zoom
மற்றும் இரு-விரல் சுழற்சி ஒன்றாக), `Swipe`, மற்றும் `ScrollGesture` — தொடர்ச்சியான drag-to-pan; தொடுகை விலகிய பின்
தளத்தின் momentum கட்டம் முழுவதும் குறைந்துவரும் delta உடன் இது தொடர்ந்து எழுப்பப்படுகிறது; flick-scrolling
செயலாக்கம் முழுவதும் இதுவே. இவற்றில் எதுவும் mouse க்கு எழுப்பப்படுவதில்லை. `ScrollableControl`
`ScrollGesture` ஐ `AutoScrollPosition` க்குப் பயன்படுத்துகிறது; `ListBox` மற்றும் `TreeView` அதே வழியில் தமது சொந்த scrollbar ஐ
நகர்த்துகின்றன; `LongPress` இயல்பாக `ContextMenu` ஐத் திறக்கிறது. Gesture புள்ளிகள் இணைப்புக்கோட்டில் தருக்க
அலகுகளாக மாற்றப்படுகின்றன; எனவே எந்த அளவிடுதலிலும் hit-testing சரியாக இருக்கும்.

**Avalonia** மற்றும் **Uno** பின்தளங்கள் gestures ஐச் செயல்படுத்துகின்றன — Majorsilence.Forms சாளரத்தைச் சொந்தமாக்கினாலும்
சரி, உட்பொதிக்கப்பட்டிருந்தாலும் சரி. இரண்டு gesture மாதிரிகளும் அடிப்படையில் வேறுபடுகின்றன — Avalonia, touch/pen க்கு மட்டும்
தானே வரையறுக்கப்பட்ட பிரத்தியேக recognizers ஐ இணைக்கிறது; WinUI/Uno இல் அவ்வாறு வரையறுக்கப்படாத ஒரே ஒருங்கிணைந்த manipulation stream உள்ளது,
அது வேகத்தை வேறு அலகுகளில் தெரிவிக்கிறது, மேலும் native swipe இல்லை — எனவே Uno பின்தளம் mouse pointers ஐ வடிகட்டுகிறது,
வேகத்தை மாற்றுகிறது, மேலும் `Swipe` ஐச் செயற்கையாக உருவாக்குகிறது. அதற்குத் தேவையான மதிப்பீட்டு முடிவுகள் மையத்திலுள்ள
`GestureHeuristics` இல் உள்ளன, அவை unit-test செய்யப்பட்டுள்ளன, ஏனெனில் multi-touch வன்பொருள் இல்லாமல் இரண்டையும் சரிபார்க்க முடியாது.
ஏனைய பின்தளங்கள் எந்த gesture நிகழ்வையும் எழுப்புவதில்லை.

## Native elements ஐ ஹோஸ்ட் செய்தல்
{:#hosting-native-elements}

`INativeControlHostBackend` என்பது **Avalonia, Uno, WinForms, WPF மற்றும் GTK 4** பின்தளங்களால் செயல்படுத்தப்பட்டு,
Headless மற்றும் Terminal இல் இல்லாத ஒரு விருப்பத் திறன். இது ஒரு `NativeControlHost` கட்டுப்பாடு, பின்தளம் ஓர் உண்மையான
toolkit element ஆல் நிரப்பும் ஒரு செவ்வகத்தை ஒதுக்க அனுமதிக்கிறது — ஒரு Avalonia `Control`, ஒரு
Uno `UIElement`, ஒரு `System.Windows.Forms.Control`, ஒரு `Gtk.Widget` — அது Skia மேற்பரப்பின் மேல் மேலடுக்காக வைக்கப்பட்டு,
placeholder இன் எல்லைகள், clip மற்றும் தெரிவுநிலையுடன் சீரமைக்கப்பட்டிருக்கும். வழக்கமான airspace வரம்புகளுக்கு GTK 4 விதிவிலக்கு:
அது ஒவ்வொரு widget ஐயும் ஒரே render tree இல் composite செய்கிறது; எனவே ஹோஸ்ட் செய்யப்பட்ட widget சரியாக clip ஆகி
கலக்கிறது.

`IWebViewFactory` என்பது `WebBrowser` இன் பின்னால் உள்ள இணைத் திறன்: Avalonia desktop இல் WebView2 / WKWebView / WebKitGTK,
GTK 4 இல் WebKitGTK; Headless, browser, Terminal அல்லது WinForms பின்தளத்தில் எதுவும் இல்லை.

அதை எவ்வாறு பயன்படுத்துவது, அதன் airspace வரம்புகள், native handles ஏன் போலியாக உருவாக்க முடியாது, மேலும் video ஏன்
பொதுவாக ஹோஸ்ட் செய்யப்பட்ட native மேற்பரப்பை விட Skia இல் வரையப்படும் frame callbacks மூலம் சிறப்பாகச் செய்யப்படுகிறது என்பதற்குப்
பார்க்க [Native interop]({{ '/ta/native-interop/' | relative_url }}).

## மொபைல் திறன்கள்
{:#mobile-capabilities}

மேலும் சில விருப்ப இணைப்புக்கோடுகள் முக்கியமாக Avalonia பின்தளத்தின் Android மற்றும் iOS வரிசைகளுக்காக உள்ளன.
ஏனைய இடங்களில் அனைத்தும் no-op ஆகக் குறைகின்றன; `IsSupported` flags ஐச் சரிபாருங்கள்.

- **Process இனுள் ஒலி** (`IAudioBackend`). `Media.SoundPlayer` மற்றும் `Media.SystemSounds` Android மற்றும் iOS இல்
  பின்தளம் வழியாக இயங்குகின்றன; desktop இல் `Media.NativeAudio` க்குப் பின்வாங்குகின்றன (OS playback
  utility ஐ இயக்குவதன் மூலம்). `Media.AudioPlayer` — ஒலியளவு, `AudioUsage` (எ.கா. `Alarm`), ஓர் உண்மையான `Completed`
  நிகழ்வு — desktop மாற்று வழி இல்லை; `AudioPlayer.IsSupported` அவ்வாறு கூறும் இடங்களில் மட்டுமே அது உண்மையானது.
- **Haptics.** `Haptics.Tap`/`Impact`/`Vibrate`; `Haptics.IsSupported` Android மற்றும் iOS இல் மட்டுமே true.
  `VIBRATE` அனுமதி பயன்படுத்தும் பயன்பாட்டின் manifest இல் தானாக இணைகிறது.
- **உள்ளூர் அறிவிப்புகள் (local notifications).** `LocalNotifications.RegisterChannel`/`Show`/`Tapped`, இதுவரை Android இல் மட்டும்;
  ஹோஸ்டின் `MainActivity` தன்னைப் பதிவுசெய்து intents மற்றும் அனுமதி முடிவுகளை அனுப்புகிறது.
- **திரையை விழித்திருக்க வைத்தல்.** `Application.KeepScreenAwake` browser தவிர ஒவ்வொரு வரிசையிலும் உண்மையானது — Android,
  iOS, Windows (`SetThreadExecutionState`), macOS (IOKit power assertion) மற்றும் Linux
  (`systemd-inhibit`). View-model சோதனைகளுக்காக Headless அதை ஒரு எளிய அமைக்கக்கூடிய போலியாகச் செயல்படுத்துகிறது.
- **Lifecycle மற்றும் back button.** `Application.Suspended`/`Resumed` மற்றும் `WindowBase.BackRequested`
  ஒற்றைக் காட்சி ஹோஸ்ட்களால் எழுப்பப்படுகின்றன; ஏனைய ஒவ்வொரு பின்தளமும் ஏற்கனவே தனது உண்மையான சாளரத்திலிருந்து `Activated`/`Deactivate` ஐ
  எழுப்புகிறது, மேலும் suspend செய்ய எதுவும் இல்லை.

எந்த UI பின்தளம் செயலில் உள்ளது என்பதுடன் தொடர்பில்லாத திறன்கள் — `SecureStorage`, `Speech`
(text-to-speech), `Launcher.OpenAsync`, `FileSystem.OpenAppPackageFileAsync` — தனியான
**`Majorsilence.Forms.Essentials`** package இல் உள்ளன; அது தனது சொந்தத் தள-வாரியான செயலாக்கத்தைத் தேர்ந்தெடுக்கிறது,
`Platform.Backend` வழியாகச் செல்வதே இல்லை. இவை அனைத்துக்குமான தள-வாரியான விவரங்களும் சரிபார்ப்பு நிலையும்
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) இல் உள்ளன.

## இன்னொரு பின்தளத்தைச் சேர்த்தல்
{:#adding-another-backend}

புதிய பின்தளம் என்பது `Majorsilence.Forms` (மையம்) மற்றும் இலக்கு toolkit ஐக் குறிப்பிட்டு,
`IPlatformBackend` மற்றும் `IWindowBackend` ஐச் செயல்படுத்தும் ஒரு புதிய assembly ஆகும் — வடிவத்துக்கு Headless ஐப் பின்பற்றுங்கள்:
`IPlatformBackend` இல் dispatcher மற்றும் lifecycle ஐ இயக்குங்கள், `IWindowBackend` இல் ஒரு Skia மேற்பரப்பைக் காட்டி (`owner.RenderFrame` ஐ அழைத்து)
உள்ளீட்டை மொழிபெயருங்கள் (`owner.Handle*`), மேலும் மையத் திட்டத்தில் ஒரு `[InternalsVisibleTo]` பதிவைச் சேருங்கள்.
விருப்பத் திறன்கள் (`IWebViewFactory`, `INativeControlHostBackend`,
`IModalLoopSupport`, …) பின்னர் வரலாம், அல்லது ஒருபோதும் வராமலும் இருக்கலாம்.

முழு interface பட்டியலுக்கும், இந்தப் பக்கம் சுருக்கித் தரும் பின்தள-வாரியான செயலாக்கக் குறிப்புகளுக்கும்
repository இல் உள்ள [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) ஐப் பாருங்கள்.
