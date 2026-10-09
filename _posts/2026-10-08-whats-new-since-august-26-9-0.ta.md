---
title: "ஆகஸ்ட் முதல் வந்தவை: 26.9.0, நான்கு புதிய பின்தளங்கள், CSS தீம்கள், மற்றும் நடத்தை தணிக்கை"
date: 2026-10-08 12:00:00 -0230
lang: ta
permalink: /ta/blog/2026/10/08/whats-new-since-august-26-9-0/
read_time: "7 நிமிட வாசிப்பு"
excerpt: "ஏழு வாரங்கள், 557 commits: GTK 4, Terminal, WinForms மற்றும் WPF ஹோஸ்ட்கள், .NET Framework 4.8 ஆதரவு, CSS தீம்கள், mobile மற்றும் browser இல் async-மட்டும் உரையாடல் சாளரங்கள், மேலும் நீங்கள் கட்டாயம் கவனிக்க வேண்டிய ஒரு வரைதல் மாற்றம்."
description: >-
  Majorsilence.Forms 26.9.0: GTK 4, Terminal, WinForms மற்றும் WPF பின்தளங்கள், net48 மற்றும் netstandard2.0,
  CSS தீம்கள், MVVM, நடத்தை தணிக்கை, மற்றும் மேம்படுத்தல் குறிப்புகள்.
---

இங்கு வெளியான கடைசிப் பதிவு 26.0.30 ஐ அடிப்படையாகக் கொண்டு எழுதப்பட்டது. 2026-08-17 முதல் repository இல் 557 commits சேர்ந்துள்ளன; தற்போதைய வெளியீடு **26.9.0**. இது ஏற்கனவே உள்ள பயனர்களுக்கும் மதிப்பீடு செய்பவர்களுக்குமான ஒரு தொகுப்பு: என்ன மாறியது, ஒவ்வொரு பகுதியும் எவ்வளவு முதிர்ச்சியடைந்துள்ளது, மேலும் மேம்படுத்தும்போது (upgrade) நீங்கள் கட்டாயம் செய்ய வேண்டிய ஒரு விஷயம்.

## நான்கு புதிய பின்தளங்கள்
{:#four-new-backends}

மூன்று ஹோஸ்ட்கள் இருந்தன — Avalonia, Uno, Headless. இப்போது ஏழு உள்ளன; அனைத்தும் அதே கட்டுப்பாட்டுத் தொகுப்பை இயக்குகின்றன. வேறுபாடு, window ஐ யார் உருவாக்குகிறார்கள், Skia மேற்பரப்பை யார் காட்டுகிறார்கள் என்பதில் மட்டுமே.

**GTK 4** (`Majorsilence.Forms.Gtk4`) என்பது gir.core மீது கட்டப்பட்ட, Linux ஐ முதன்மையாகக் கொண்ட ஒரு ஹோஸ்ட்: ஒவ்வொரு படிவத்துக்கும் ஒரு உண்மையான `Gtk.Window`, GLib main loop; GTK 4 runtime உடன் Windows மற்றும் macOS இலும் பயன்படுத்தலாம். `Application.Run` க்கு முன் `Gtk4Application.Use ();` மூலம் இதை வெளிப்படையாகத் தேர்ந்தெடுங்கள். உட்பொதித்தல் (embedding) இரு திசைகளிலும் வேலை செய்கிறது (`ToGtkWidget()`, `ToGtkWindow()`); GTK 4 ஒரே render tree ஐ composite செய்வதால் `NativeControlHost` க்கு "airspace" பிரச்சினை இல்லை; `WebBrowser` WebKitGTK 6.0 மூலம் இயங்குகிறது. Wayland இல் சரிபார்க்கப்பட்டது. அறியப்பட்ட இடைவெளிகள்: திரை-நிலைக் கட்டுப்பாடு இல்லை (GTK 4 அந்த API ஐ நீக்கிவிட்டது), `SetIcon(byte[])` ஒரு no-op (எதுவும் செய்யாது), native கோப்புத் தேர்விகள் (file pickers) வெறுமையாகத் திரும்புவதால் மாற்று (fallback) உரையாடல் சாளரங்கள் பயன்படுத்தப்படுகின்றன, முழு எண் அளவுக் காரணி (integer scale factor) மட்டுமே, AOT-பகுப்பாய்வு செய்யப்படவில்லை.

**Terminal** (`Majorsilence.Forms.Terminal`, 2026-10-04) ஒரு படிவத்தை console க்குள் ஒற்றைக் காட்சியாக (single view) host செய்கிறது — ஒரு தொலைபேசியைப் போல, படிவம் terminal ஐ நிரப்புகிறது, title bar இல்லை. கிடைக்கும் இடங்களில் உண்மையான pixel தெளிவுத்திறனில் Kitty graphics அல்லது Sixel ஐப் பயன்படுத்துகிறது; இல்லையெனில் Unicode block elements. Terminal ஐ வினவுவதன் மூலம் கண்டறிதல் நடைபெறுகிறது; `MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` ஒரு பயன்முறையை நிலைப்படுத்துகிறது. Mouse மற்றும் keyboard வேலை செய்கின்றன; Ctrl+C எப்போதும் வெளியேறும். `TerminalApplication.Use (options);` மூலம் தேர்ந்தெடுக்கப்படுகிறது. xterm மற்றும் WezTerm இல் மட்டுமே சரிபார்க்கப்பட்டது. Native தேர்விகள், `NativeControlHost` அல்லது webview இல்லை.

**WinForms** (`Majorsilence.Forms.WinForms`) என்பது Windows-மட்டும் இயங்கும் ஒரு *இடம்பெயர்த்தல்* பின்தளம்: Win32 pump இல் உண்மையான `System.Windows.Forms` windows, Skia ஒரு GDI bitmap மூலம் காட்டப்படுகிறது. ஏற்கனவே உள்ள ஒரு WinForms பயன்பாட்டில் Majorsilence.Forms கட்டுப்பாடுகளை ஒவ்வொன்றாக உட்பொதிக்க — `myMfControl.ToWinFormsControl()`, `myForm.ToWinFormsForm()`, `MajorsilenceFormsPresenter` — பின்னர் அனைத்தும் port செய்யப்பட்டதும் ஹோஸ்டை Avalonia அல்லது Uno க்கு மாற்ற இது உள்ளது. Gestures இல்லை, `IWebViewFactory` இல்லை. Avalonia ஹோஸ்டில் முழுப் படிவங்களை இணைக்கும் பழைய `WindowsFormsInterop` இலிருந்து இது வேறுபட்டது.

**WPF** (`Majorsilence.Forms.Wpf`) WPF பயன்பாடுகளுக்கு அதே வடிவத்தையும் நோக்கத்தையும் கொண்டுள்ளது: ஒரு உண்மையான WPF `Window`, `WriteableBitmap` மூலம் காட்சிப்படுத்தல், `ToWpfElement()` மற்றும் `ToWpfWindow()`. `Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();` மூலம் இதைத் தேர்ந்தெடுங்கள்.

Avalonia, WinForms மற்றும் GTK 4 உண்மையான OS-மட்ட modal உரையாடல் சாளரங்களை வழங்குகின்றன; Uno ஒரு சுயாதீன window ஐத் திறக்கிறது, எனவே அங்கு `Form.ShowDialog(parent)` ஐப் பயன்படுத்துங்கள்.

## .NET Framework 4.8 மற்றும் netstandard2.0
{:#net-framework-48-and-netstandard20}

மைய packages — `Majorsilence.Forms`, `.Drawing.Common`, `.Telerik` — இப்போது `net8.0`, `net10.0` **மற்றும் `netstandard2.0`** ஐ இலக்காகக் கொள்கின்றன; WinForms மற்றும் WPF பின்தளங்கள் `net48` ஐயும் சேர்க்கின்றன. எனவே ஒரு .NET Framework 4.8 பயன்பாடு முதலில் நவீன .NET க்கு மாறாமலேயே Majorsilence.Forms கட்டுப்பாடுகளை host செய்ய முடியும்; இது பல இடம்பெயர்த்தல்களில் இருந்த ஒரு வரிசைப் பிரச்சினையை (ordering problem) நீக்குகிறது.

## நடத்தை இடைவெளி தணிக்கை
{:#the-behaviour-gap-audit}

இரண்டு API-மேற்பரப்பு இடைவெளித் திட்டங்களும் (WinForms மற்றும் GDI+) **பூஜ்ஜியத்தில்** உள்ளன: upstream இல் உள்ள ஒவ்வொரு member உம் அறிவிக்கப்பட்டுள்ளது. அது எப்போதுமே குறைவான சுவாரஸ்யமான பாதி. இருக்கும் ஆனால் யாரும் படிக்காத ஒரு மதிப்பைச் சேமிக்கும், அல்லது யாரும் தூண்டாத ஒரு நிகழ்வை வெளிப்படுத்தும் ஒரு member, உங்கள் இடம்பெயர்க்கப்பட்ட பயன்பாட்டை compile ஆக விடுகிறது, பின்னர் அமைதியாக எதுவும் செய்யாமல் இருக்கிறது.

எனவே 2026-08-25 அன்று, பன்னிரண்டு பகுதிகளிலான ஒரு தணிக்கை ஒவ்வொரு பகுதியையும் upstream செயலாக்கத்துடன் ஒப்பிட்டு, நடத்தை வேறுபட்ட **483 கண்டுபிடிப்புகளைப்** பதிவு செய்தது. அதன் பின்னர் கட்டங்கள் 0–4 உம் பெரும்பாலான கட்டுப்பாட்டுக் குடும்பங்களுக்கான மாற்றங்களும் சேர்க்கப்பட்டுள்ளன. இப்போது உண்மையாகச் செயல்படும் உறுதியான விஷயங்கள்: `ProcessCmdKey` முன்-செயலாக்கச் சங்கிலி, ஒற்றை focus/validation கட்டுப்பாட்டுப் புள்ளி, client area க்கு வெளியே title bar, `AutoScaleMode.Font` உண்மையில் அளவிடுதல் (scaling), நேரடி data binding (`CurrencyManager`, `BindingNavigator`), `ListView.View = Details`, upstream வரிசையில் படிவ வாழ்க்கைச் சுழற்சி (Load → VisibleChanged → Activated, Shown posted), DataGridView நெடுவரிசை மறுவரிசைப்படுத்தல், உரைக் கட்டுப்பாடுகளில் Ctrl+Z, system tray இல் `NotifyIcon`, `Application.AddMessageFilter`, மற்றும் ஒரு படிவத்தை dispose செய்யும்போது அதன் கட்டுப்பாடுகளும் dispose ஆகுதல்.

வெற்றுப் பகுதியும் (hollow surface) இப்போது *அளவிடப்படுகிறது*: அறியப்பட்ட no-op methods, செயலற்ற நிகழ்வுகள் (inert events) மற்றும் சேமிப்பு-மட்டும் properties ஆகியவற்றை baseline கோப்புகள் நிலைப்படுத்துகின்றன; எனவே அவற்றில் சேர்ப்பது தற்செயலாக அல்லாமல் உணர்வுபூர்வமான செயலாகிறது. Stub கொள்கை மாறவில்லை — no-op அல்லது default ஐத் திருப்புதல், ஒருபோதும் `NotImplementedException` இல்லை.

## தருக்க அலகுகள்: நீங்கள் கட்டாயம் செய்ய வேண்டிய ஒரு விஷயம்
{:#logical-units-the-one-thing-you-must-do}

2026-10-01 அன்று `ClientRectangle`, `ClientSize` மற்றும் வரைதல் canvas (`OnPaint`, `Paint`, `e.ClipRectangle`, `e.Canvas`) ஆகியவை `Width`/`Height`/`Bounds` மற்றும் `MouseEventArgs` உடன் பொருந்தும் வகையில் **தருக்க அலகுகளாக (logical units)** மாறின. Framework உங்களுக்காக canvas ஐக் காட்சித்திரைக்கு ஏற்ப அளவிடுகிறது.

**ஒரு custom கட்டுப்பாடு `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` ஐ அழைத்திருந்தால், அதை நீக்குங்கள்** — இல்லையெனில் வரைதல் இப்போது இரண்டு முறை அளவிடப்படும். சாதனப் பிக்சல்களை (device pixels) இன்னும் `Scaled*` குடும்பம் (`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling` மற்றும் `LogicalToDeviceUnits` மூலம் அணுகலாம். ஒரே விதிவிலக்கு owner-draw நிகழ்வுகள் (`DrawItem`, `DrawNode`, `CellPainting`); அவை இன்னும் சாதனப்-பிக்சல் எல்லைகளையே தருகின்றன. பழைய நடத்தையைச் சார்ந்திருக்கும் எதையும் கண்டறிய உங்கள் சோதனைகளை `MF_HEADLESS_SCALE=2` உடன் இயக்குங்கள்.

## Browser மற்றும் mobile
{:#browser-and-mobile}

`net10.0-browser`, `-android` மற்றும் `-ios` இல் Avalonia பின்தளம் `CanRunModalLoop = false` எனத் தெரிவிக்கிறது; தடுக்கும் (blocking) அழைப்புகள் — `Form.ShowDialog`, `MessageBox.Show`, கோப்புத் தேர்விகள், `TaskDialog.ShowDialog`, `VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show` — இப்போது hang ஆவதற்குப் பதிலாக, எதுவும் காட்டப்படுவதற்கு *முன்பே* async இணையின் பெயரைக் குறிப்பிட்டு `PlatformNotSupportedException` ஐ எறிகின்றன. Async வடிவங்கள் (`ShowDialogAsync`, `MessageBox.ShowAsync`, `FileDialog.ShowDialogAsync`, …) ஒவ்வொரு ஹோஸ்டிலும் வேலை செய்கின்றன; எனவே பொதுவான வழக்கம் `await` உடன் கூடிய ஒரு `async void` handler. மைய package இல் உள்ள ஒரு Roslyn analyzer இவற்றை முன்கூட்டியே கண்டறிகிறது — `MFB001` தடுக்கும் modal அழைப்பு, `MFB002` ஒரு Task மீது ஒத்திசைவான (synchronous) காத்திருப்பு, `MFB003` `Thread.Sleep` — ஒவ்வொன்றுக்கும் ஒரு code fix உண்டு; browser TFMs களுக்கு அல்லது `.editorconfig` இல் `majorsilence_forms.browser_target = true` இருக்கும்போது செயல்படும்.

Browser இலக்கு canvas க்கு அருகில் ஒரு **அணுகல்தன்மை DOM (accessibility DOM)** ஐயும் பராமரிக்கிறது: ஒவ்வொரு கட்டுப்பாட்டுக்கும் ARIA role, name, state மற்றும் bounds கொண்ட, ஒளிபுகும் (transparent), click-through ஆன ஒரு element; இது framework இன் சொந்தத் தானியக்க மரத்திலிருந்து (automation tree) கட்டப்படுகிறது. திரை வாசிப்பான்கள் (screen readers), பக்கத்தில் தேடல் (find-in-page) மற்றும் DOM அடிப்படையிலான சோதனைக் கருவிகள் இப்போது UI ஐப் பார்க்க முடியும்.

Android மற்றும் iOS இல் `TextBox` focus பெறும்போது திரை keyboard எழுகிறது, `TextBoxBase.InputKind` keyboard வகையைத் தேர்ந்தெடுக்கிறது, safe-area insets `Form.SafeAreaPadding` மூலம் பொருந்துகின்றன, `WindowBase.BackRequested` Android back பொத்தானைக் கையாளுகிறது. நேர்மையான நிலை: Android இல் ஓர் ஆரம்ப உண்மைச்-சாதனச் சோதனை நடந்துள்ளது (boot, taps, render scaling, touch scroll ஆகியவை hardware இல் உறுதிப்படுத்தப்பட்டன); keyboard, safe-area மற்றும் rotation ஆகியவை unit-test மட்டுமே செய்யப்பட்டுள்ளன. iOS CI உண்மையான head ஐ compile செய்து ஒரு simulator smoke check இல் தொடங்குகிறது; ஆனால் யாரும் அதை interactive ஆக இயக்கவில்லை, அந்த job இன்னும் `continue-on-error` ஆகவே உள்ளது.

அதனுடன் தொலைபேசி-பாணி layout கட்டுப்பாடுகளும் வந்தன: `StackPanel`, `Card`, `RichListBox` (பல-வரி templated வரிசைகள்) மற்றும் `NavigationHost` (back பொத்தானுடன் கூடிய ஒரு page stack).

## CSS தீம்கள் மற்றும் Theme Studio
{:#css-theming-and-theme-studio}

தீம்களை இப்போது கண்டிப்பான, ஆவணப்படுத்தப்பட்ட CSS துணைத்தொகுப்பாக எழுதலாம்: `@theme "Ocean" extends Dark;`, ஒவ்வொரு `Theme` property க்கும் ஒன்றாக `:root` tokens, `Button:hover { … }` போன்ற கட்டுப்பாட்டு-வகை விதிகள், `Type::part` மூலம் பகுதிகள். Parser ஒருபோதும் அமைதியாகத் தோல்வியடைவதில்லை — `ThemeStyleSheet.Parse` diagnostics ஐச் சேகரிக்கிறது. `Theme.LoadFromCssFile` மூலம், அல்லது `Theme.RegisterThemeCssFromFile` + `Theme.ApplyTheme ("Ocean")` மூலம் ஏற்றுங்கள்; `Theme.ExportCss` மூலம் ஏற்றுமதி செய்யுங்கள். Telerik compat அடுக்கு உட்பட ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒரு selector உள்ளது; பழைய `<Theme>` XML இன்னும் வேலை செய்கிறது.

இரண்டு துணை packages *அதே* sheet ஐ மற்ற ஹோஸ்ட்களுக்கும் பொருத்துகின்றன: `Majorsilence.Forms.Theming.WinForms` உண்மையான `System.Windows.Forms` கட்டுப்பாடுகளுக்கு மீண்டும் பாணியிடுகிறது (Windows மட்டும்), `Majorsilence.Forms.Theming.Avalonia` native Avalonia Fluent கட்டுப்பாடுகளுக்கு மீண்டும் பாணியிடுகிறது; எனவே ஒரே CSS கோப்பு, கலப்பு இடம்பெயர்த்தல் பயன்பாட்டுக்குத் தீம் அளிக்க முடியும். `samples/ThemeStudio` முன்னோட்டமும் diagnostics உம் கொண்ட ஒரு நேரடி editor; முன்கூட்டியே build செய்யப்பட்ட binaries GitHub Releases இல் இணைக்கப்பட்டுள்ளன.

## MVVM, Essentials, animation
{:#mvvm-essentials-animation}

`Majorsilence.Forms.Mvvm` என்பது `INotifyPropertyChanged` மற்றும் `ICommand` மீதான trim- மற்றும் AOT-பாதுகாப்பான இணைப்பு; reflection இல்லை, toolkit சார்பு இல்லை: `viewModel.Observe (nameof (VM.Count), vm => vm.Count, …)`, இருவழி `BindText`/`BindChecked`/`BindSelectedIndex`/`BindValue`, `BindCommand`, மேலும் அனைத்தையும் dispose செய்ய ஒரு `BindingScope`. இது CommunityToolkit.Mvvm உடன் இணைந்து வேலை செய்கிறது.

`Majorsilence.Forms.Essentials` தளம்-சார்ந்த திறன்களை மையத்துக்கு வெளியே வைக்கிறது: `SecureStorage`, `Speech` உரையிலிருந்து-பேச்சு (text-to-speech), `Launcher.OpenAsync` (http/https/mailto/tel/sms) மற்றும் `FileSystem.OpenAppPackageFileAsync`. அனைத்தும் no-op ஆகத் தரம் குறைகின்றன; `IsSupported` ஐச் சரிபாருங்கள்.

`control.RequestAnimationFrame` உம் `Majorsilence.Forms.Animation` உம் (`Tween<T>`, `Easing`, `Animator`) Avalonia இல் காட்சித்திரையுடன் ஒத்திசைந்த animation ஐயும், Headless இல் கைமுறைக் கடிகாரத்தையும் (manual clock) வழங்குகின்றன.

## கருவிகள்
{:#tooling}

- MCP server ஒரு வெளியிடப்பட்ட dotnet tool: `dotnet tool install -g Majorsilence.Forms.Mcp`, பின்னர் `claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444`. இது `ui_snapshot`, `ui_find`, `ui_click`, `ui_type`, `ui_wait_for` மற்றும் `ui_screenshot` ஐ வெளிப்படுத்துகிறது; உங்கள் பயன்பாட்டின் `WebDriverServer` உடன் தொடர்பு கொள்கிறது.
- `samples/AutomationTarget` என்பது கருவிகளைக் கற்றுக்கொள்வதற்காக வேண்டுமென்றே சிக்கலாக்கப்பட்ட ஒரு சிறிய பயன்பாடு (clicks ஐ மறுக்கும் கட்டுப்பாடுகள், பெயரிடப்படாத ஒன்று). Custom-painted கட்டுப்பாடுகள் `IAutomationStateProvider` மூலம் மதிப்பையும் நிலையையும் வெளியிடுகின்றன.
- Migrator இப்போது dotnet tool ஆக **மட்டுமே** வழங்கப்படுகிறது (`dotnet tool install -g Majorsilence.Forms.Migrator`); self-contained binaries இனி வெளியீடுகளுடன் இணைக்கப்படுவதில்லை. புதிய switches: `--map`, `--dual-build`, `--strict`, `--dry-run --diff`.
- `Majorsilence.Forms.WinFormsShims.Compat` என்பது Majorsilence.Forms ஐ அடிப்படையாகக் கொண்ட `System.Windows.Forms` மற்றும் `System.Drawing` namespaces ஐ உருவாக்கும் ஒரு proof-of-concept source generator; இதனால் மாற்றப்படாத WinForms மூலக் குறியீடு — `Designer.cs` உட்பட — compile ஆகிறது. பொது API WinForms types ஐப் பயன்படுத்தும் கட்டுப்பாட்டு நூலகங்களுக்கானது. PoC நிலை; `samples/WinFormsCompatDemo` ஐப் பாருங்கள்.

## மேம்படுத்தல் குறிப்புகள்
{:#upgrade-notes}

- **26.9.0** இல் பதிப்பை நிலைப்படுத்துங்கள். இந்தத் திட்டம் இன்னும் பீட்டா நிலையில் உள்ளது; இன்னும் visual designer இல்லை.
- Custom paint குறியீட்டில் உள்ள எந்த `ScaleTransform (e.Scaling, e.Scaling)` ஐயும் நீக்குங்கள் (மேலே பாருங்கள்).
- வார்ப்புரு package id `Majorsilence.Forms.Templates`; `dotnet new install Majorsilence.Forms.Templates` மூலம் நிறுவப்படுகிறது. `dotnet new majorsilenceforms` இப்போது பகிரப்பட்ட UI நூலகம் மற்றும் ஒரு desktop head உடன் கூடிய solution ஐ உருவாக்குகிறது; `--IncludeAndroid`, `--IncludeiOS` மற்றும் `--IncludeWasm` heads ஐச் சேர்க்கின்றன.
- உடைக்கும் மாற்றங்கள் (breaking changes) `MIGRATION.md` இல் பட்டியலிடப்பட்டுள்ளன: `SplitContainer.Orientation`, `TreeViewDrawMode.OwnerDrawContent`, நிகழ்வு delegate types இப்போது WinForms உடன் பொருந்துகின்றன, மேலும் gradient/hatch brushes GDI+ உடன் பொருந்தும்படி நகர்த்தப்பட்டன.
- Browser, Android மற்றும் iOS இல், தடுக்கும் உரையாடல் சாளர அழைப்புகளை அவற்றின் async இணைகளால் மாற்றுங்கள்; அவற்றைக் கண்டறிய `MFB001`–`MFB003` ஐப் பயன்படுத்துங்கள்.

## மேலும் எங்கே படிக்கலாம்
{:#where-to-read-more}

- [Platform பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) மற்றும் [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md)
- [தொடங்குதல்]({{ '/ta/getting-started/' | relative_url }}) மற்றும் [இடம்பெயர்த்தல்]({{ '/ta/migration/' | relative_url }}) / [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)
- [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md), [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md), [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md), [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)
- [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md)
- [தானியக்கம் (Automation)]({{ '/ta/automation/' | relative_url }}) மற்றும் [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md)
- [மாதிரிகள்]({{ '/ta/samples/' | relative_url }})
