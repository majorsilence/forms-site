---
layout: docs
lang: ta
title: அடிக்கடி கேட்கப்படும் கேள்விகள்
subtitle: பல்தள WinForms பற்றி மக்கள் முதலில் கேட்கும் கேள்விகளுக்குச் சுருக்கமான, நேரடியான பதில்கள்.
permalink: /ta/faq/
seo_title: "பல்தள WinForms FAQ — WinForms Linux இல் இயங்குமா?"
description: >-
  WinForms Linux அல்லது macOS இல் இயங்குமா? WinForms பல்தளமா? மீண்டும் எழுத வேண்டுமா? திறந்த மூல
  WinForms இணக்க அடுக்கு பற்றிய நேரடியான பதில்கள்.
keywords:
  - winforms linux இல் இயங்குமா
  - winforms பல்தளம்
  - can winforms run on linux
  - winforms mac
  - winforms இணக்க அடுக்கு
  - winforms alternative
  - winforms vb.net cross platform
  - winforms dark mode
  - winforms gtk
priority: "0.8"
faq:
  - question: WinForms Linux இல் இயங்குமா?
    id: can-winforms-run-on-linux
    answer: >-
      உள்ளபடியே இயங்காது. System.Windows.Forms, Windows Desktop runtime இல் மட்டுமே வருகிறது; அது user32.dll மற்றும் GDI+ ஐச் சுற்றி அமைந்துள்ளது, எனவே ஒரு WinForms திட்டம் Linux இல் build ஆகக்கூட மாட்டாது. Majorsilence.Forms இதைத் தீர்க்கிறது: WinForms API ஐ SkiaSharp மீது மீண்டும் செயல்படுத்தி, Avalonia மூலம் ஒரு native சாளரத்தில் அல்லது ஓர் உண்மையான GTK 4 சாளரத்தில் ஹோஸ்ட் செய்கிறது. இதனால் அதே C# அல்லது VB.NET மூலக் குறியீடு, -windows target framework இல்லாத சாதாரண net10.0 build இலிருந்து Ubuntu, Fedora மற்றும் Debian இல் native ஆக build ஆகி இயங்குகிறது.
  - question: WinForms macOS இல் இயங்குமா?
    id: can-winforms-run-on-macos
    answer: >-
      உள்ளபடியே இயங்காது — System.Windows.Forms க்கு ஒருபோதும் macOS build இருந்ததில்லை. Majorsilence.Forms அதே WinForms குறியீட்டை Apple Silicon மற்றும் Intel Mac இரண்டிலும் ஓர் உண்மையான NSWindow இல் இயக்குகிறது; வழக்கமான osx-arm64 மற்றும் osx-x64 runtime identifiers மூலம் வெளியிடப்படுகிறது.
  - question: இது native Linux toolkit ஆன GTK இல் இயங்குமா?
    id: does-it-run-on-gtk-as-a-native-linux-toolkit
    answer: >-
      ஆம். Majorsilence.Forms.Gtk4 என்பது gir.core bindings மீது கட்டப்பட்ட ஒரு GTK 4 பின்தளம் (backend): Wayland அல்லது X11 இல் ஓர் உண்மையான Gtk.Window; Application.Run க்கு முன் Gtk4Application.Use மூலம் வெளிப்படையாகத் தேர்ந்தெடுக்கப்படுகிறது; GTK 4 runtime நிறுவப்பட்ட இடங்களில் Windows மற்றும் macOS இலும் இயங்குகிறது. இது ToGtkWidget மற்றும் ToGtkWindow மூலம் இரு திசைகளிலும் உட்பொதிக்கிறது, வழக்கமான airspace பிரச்சினை இல்லாமல் native GTK widgets ஐ ஹோஸ்ட் செய்கிறது, மேலும் WebBrowser க்கு WebKitGTK engine ஐ வழங்குகிறது. அறியப்பட்ட இடைவெளிகள்: திரை நிலையைக் கட்டுப்படுத்த முடியாது, முழு எண் scale factors மட்டுமே, மேலும் file pickers framework இன் சொந்த உரையாடல் சாளரங்களுக்குத் திரும்புகின்றன.
  - question: இது ஒரு terminal இல் இயங்குமா?
    id: can-it-run-in-a-terminal
    answer: >-
      ஆம். Majorsilence.Forms.Terminal ஒரு படிவத்தை, ஒரு தொலைபேசி செய்வது போல, console இல் ஒற்றை முழுத்திரைக் காட்சியாக ஹோஸ்ட் செய்கிறது; terminal ஆதரிக்கும் இடங்களில் உண்மையான pixel resolution இல் Kitty graphics அல்லது Sixel மூலம் வரைகிறது, மற்ற இடங்களில் Unicode block elements க்குத் திரும்புகிறது. Mouse மற்றும் விசைப்பலகை வேலை செய்கின்றன, Ctrl+C எப்போதும் வெளியேறும், மேலும் இது xterm மற்றும் WezTerm இல் சரிபார்க்கப்பட்டுள்ளது. இந்தப் பின்தளத்தில் native file pickers, native hosting அல்லது web view இல்லை.
  - question: WinForms பல்தளமா?
    id: is-winforms-cross-platform
    answer: >-
      இல்லை. Windows Forms தானே Windows க்கு மட்டுமானது, எப்போதும் அப்படித்தான் இருந்தது; அதன் கீழுள்ள .NET runtime மட்டுமே பல்தளமானது. ஒரு WinForms பயன்பாட்டைப் பல்தளமாக்குவது என்றால், UI ஐ வேறொரு framework இல் மீண்டும் எழுதுவது, Wine போன்ற ஒன்றின் மூலம் Windows ஐ emulate செய்வது, அல்லது Majorsilence.Forms போன்ற API இணக்கமான மறுசெயலாக்கத்தைப் பயன்படுத்துவது ஆகியவற்றில் ஒன்று.
  - question: WinForms இணக்க அடுக்கு என்றால் என்ன?
    id: what-is-a-winforms-compatibility-layer
    answer: >-
      System.Windows.Forms இன் அதே classes, properties மற்றும் events ஐ — Form, Button, DataGridView, நிகழ்வு கையாளிகள் (event handlers), Designer.cs முறை — வெளிப்படுத்தும், ஆனால் அவற்றை Win32 க்குப் பதிலாக எடுத்துச் செல்லக்கூடிய ஒன்றின் மீது செயல்படுத்தும் ஒரு library. உங்கள் மூலக் குறியீடு தன் வடிவத்தை வைத்துக்கொண்டு namespace ஐ மட்டும் மாற்றுகிறது; கீழே உள்ள அனைத்தும் வேறு.
  - question: என் WinForms பயன்பாட்டைப் பல்தளமாக்க அதை மீண்டும் எழுத வேண்டுமா?
    id: do-i-have-to-rewrite-my-winforms-app-to-make-it-cross-platform
    answer: >-
      Majorsilence.Forms உடன் தேவையில்லை. இடம்பெயர்த்தல் பெரும்பாலும் இயந்திரத்தனமானது — namespaces, project கோப்புகள் மற்றும் resources — மேலும் majorsilence-migrate CLI அதை உங்களுக்காக, அதே இடத்தில், படிக்கக்கூடிய git diff ஆகச் செய்கிறது. உங்கள் படிவங்கள், கட்டுப்பாடுகள், நிகழ்வு கையாளிகள் மற்றும் Designer கோப்புகள் அப்படியே வைக்கப்படுகின்றன. WndProc அல்லது Control.Handle மூலம் Win32 ஐ நேரடியாக அணுகும் குறியீட்டை மட்டும் மீண்டும் எழுத வேண்டும்.
  - question: Majorsilence.Forms, Avalonia, Uno Platform அல்லது .NET MAUI இலிருந்து எப்படி வேறுபடுகிறது?
    id: how-is-majorsilenceforms-different-from-avalonia-uno-platform-or-net-maui
    answer: >-
      அவை XAML frameworks: சிறந்த இலக்குகள், ஆனால் ஒன்றை ஏற்பது என்றால் உங்கள் UI ஐ XAML views மற்றும் view models ஆக மீண்டும் கட்டுவதாகும். Majorsilence.Forms, WinForms நிரலாக்க மாதிரியை வைத்துக்கொண்டு, கீழுள்ள toolkit ஐ மாற்றக்கூடிய ஹோஸ்ட் ஆகக் கருதுகிறது: இயல்பாக Avalonia அல்லது Uno, அத்துடன் GTK 4, உண்மையான WinForms, WPF அல்லது ஒரு terminal — இது அவற்றுடன் போட்டியிடாமல் அவற்றின் மீது கட்டப்பட்டுள்ளது. புதிதாகத் தொடங்கும் பயன்பாட்டுக்கு நேரடியாக XAML ஐத் தேர்ந்தெடுங்கள்; ஏற்கனவே உள்ள WinForms codebase தான் நீங்கள் காக்க முயலும் சொத்து என்றால் Majorsilence.Forms ஐத் தேர்ந்தெடுங்கள்.
  - question: என் Designer.cs கோப்புகள் இன்னும் வேலை செய்யுமா?
    id: do-my-designercs-files-still-work
    answer: >-
      ஆம். Designer.cs மற்றும் Designer.vb code-behind முறை அப்படியே பாதுகாக்கப்படுகிறது, உருவாக்கப்பட்ட layout குறியீடு மாற்றமின்றி இயங்குகிறது. இன்னும் இல்லாதது அதைத் திருத்துவதற்கான காட்சி வடிவமைப்பு மேற்பரப்பு — drag-and-drop designer இல்லை; அது backlog இல் உள்ள விரும்பப்படும் அம்சம்.
  - question: இது C# உடன் VB.NET ஐயும் ஆதரிக்கிறதா?
    id: does-it-support-vbnet-as-well-as-c
    answer: >-
      ஆம். Migrator .vb திட்டங்களை மீண்டும் எழுதுகிறது, MyType=Empty பொருந்தாமல் போகும்போது இழக்கப்படும் மறைமுக WinForms constructor ஐச் சேர்க்கிறது, மேலும் ஒரு My.Resources accessor ஐ உருவாக்குகிறது. VB Application Model இன் பகுதிகளும் (My.Application, My.Forms) செயல்படுத்தப்பட்டுள்ளன; இன்னும் செயல்படுத்தப்படாதவற்றையும் அதற்கான காரணங்களையும் MIGRATION.md பட்டியலிடுகிறது. பயிற்சி வழிகாட்டி ஒவ்வொரு உதாரணத்தையும் C# மற்றும் VB.NET இரண்டிலும் தருகிறது.
  - question: System.Drawing மற்றும் GDI+ க்குப் பதிலாக என்ன உள்ளது?
    id: what-replaces-systemdrawing-and-gdi
    answer: >-
      Majorsilence.Forms.Drawing.Common — Bitmap, Font, Pen, Brush, Icon, Region, StringFormat, Drawing2D, Imaging மற்றும் EMF/WMF metafile playback ஆகியவற்றை உள்ளடக்கும் SkiaSharp அடிப்படையிலான மறுசெயலாக்கம். Value types — Color, Point, Size, Rectangle — வேண்டுமென்றே மீண்டும் செயல்படுத்தப்படவில்லை; ஏற்கனவே பல்தளமான உண்மையான System.Drawing.Primitives types பயன்படுத்தப்படுகின்றன. இது முக்கியம், ஏனெனில் .NET 7 முதல் System.Drawing.Common, Windows அல்லாத தளங்களில் PlatformNotSupportedException ஐ எறிகிறது.
  - question: இதற்குத் தீம் அமைக்க முடியுமா, dark mode உள்ளதா?
    id: can-i-theme-it-and-is-there-a-dark-mode
    answer: >-
      ஆம். தீம்கள் CSS இன் ஒரு சிறிய, முழுமையாக ஆவணப்படுத்தப்பட்ட துணைக்குழுவில் எழுதப்படுகின்றன: @theme "Ocean" extends Dark போன்ற தீம் தலைப்பு, accent, background மற்றும் font பண்புகளுக்கான root tokens, மற்றும் hover, active, disabled, focus நிலைகளுடன் கூடிய கட்டுப்பாட்டு வகை வாரியான விதிகள். Light மற்றும் dark உள்ளமைந்த தீம்கள் வருகின்றன, ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒரு CSS selector உண்டு, மேலும் துணைக்குழுவுக்கு வெளியே உள்ள எதையும் அமைதியாகப் புறக்கணிக்காமல் parser ஒரு diagnostic ஐ அறிவிக்கிறது. Theme Studio மாதிரி முன்னோட்டத்துடன் கூடிய நேரடித் திருத்தி; துணை Theming.WinForms மற்றும் Theming.Avalonia packages அதே stylesheet ஐ உண்மையான System.Windows.Forms மற்றும் native Avalonia கட்டுப்பாடுகளுக்குப் பொருத்துகின்றன, எனவே ஒரே தீம் ஒரு கலப்பு இடம்பெயர்த்தல் பயன்பாட்டை மறுவடிவமைக்க முடியும்.
  - question: Majorsilence.Forms இலவசமானதா, திறந்த மூலமானதா?
    id: is-majorsilenceforms-free-and-open-source
    answer: >-
      ஆம். இது MIT உரிமம் பெற்றது, GitHub இல் வெளிப்படையாக உருவாக்கப்படுகிறது, NuGet இல் வெளியிடப்படுகிறது. வணிக நிலை அல்லது கட்டண உரிமம் எதுவும் இல்லை.
  - question: இது production க்குத் தயாரா?
    id: is-it-production-ready
    answer: >-
      இது பீட்டா நிலையில் உள்ளது. API நிலைபெற்று வருகிறது, எல்லா WinForms மூலைகளும் உள்ளடக்கப்படவில்லை, எனவே உங்கள் package பதிப்பை நிலைப்படுத்துங்கள். ஒவ்வொரு WinForms மற்றும் GDI+ member உம் இப்போது அறிவிக்கப்பட்டுள்ளது; members இன்னும் WinForms போல நடந்துகொள்ளாத இடங்கள் பற்றிய பன்னிரண்டு பகுதி நடத்தை இடைவெளித் தணிக்கை கட்டங்களாகக் கையாளப்படுகிறது; விசைப்பலகைச் சங்கிலி, focus மற்றும் validation, உண்மையான உரையாடல் சாளரங்கள், data binding, ListView details view மற்றும் பெரும்பாலான கட்டுப்பாட்டுக் குடும்பங்கள் ஏற்கனவே முடிக்கப்பட்டுள்ளன. பல உண்மையான பயன்பாடுகள் இதன் மீது fork செய்யப்பட்டுள்ளன, அவற்றுள் ஒரு Notepad++ நகல், DarkUI, PKHeX மற்றும் RibbonWinForms. உறுதியளிக்கும் முன் compatibility matrix ஐப் படியுங்கள்.
  - question: இது DataGridView ஐ ஆதரிக்கிறதா?
    id: does-it-support-datagridview
    answer: >-
      பகுதியளவில்; இது இன்னும் தனி ஒரு type இல் உள்ள மிகப்பெரிய இடைவெளி, எனினும் அது பெருமளவு குறைந்துள்ளது. அதிகம் பயன்படுத்தப்படும் hooks உண்மையானவை — cell formatting மற்றும் painting, row pre மற்றும் post paint, cell parsing, row validation, clipboard உள்ளடக்கம், border styles, virtual mode, commit செய்யப்படாத புதிய row மற்றும் column காட்சி வரிசை மாற்றம். CellStateChanged மற்றும் RowStateChanged போன்ற சில events மூலக் குறியீட்டு இணக்கத்துக்காக இன்னும் அறிவிக்கப்பட்டுள்ளன, ஆனால் ஒருபோதும் எழுப்பப்படுவதில்லை. எவை என்பதை compatibility matrix துல்லியமாகப் பட்டியலிடுகிறது.
  - question: எந்த .NET பதிப்புகள் ஆதரிக்கப்படுகின்றன?
    id: which-net-versions-are-supported
    answer: >-
      ஒவ்வொரு பின்தளத்துக்கும் .NET 8 மற்றும் .NET 10, -windows target framework பின்னொட்டு இல்லாமல், Windows Desktop runtime சார்பு இல்லாமல். முக்கிய packages netstandard2.0 க்கும் build ஆகின்றன; WinForms மற்றும் WPF இடம்பெயர்த்தல் பின்தளங்கள் net48 target ஐச் சேர்க்கின்றன, எனவே ஒரு .NET Framework 4.8 பயன்பாடு அவற்றை ஹோஸ்ட் செய்ய முடியும்.
  - question: இது .NET Framework 4.8 உடன் வேலை செய்யுமா?
    id: does-it-work-with-net-framework-48
    answer: >-
      Windows க்கு மட்டுமான இடம்பெயர்த்தல் பின்தளங்கள் மூலம் மட்டுமே. முக்கிய library netstandard2.0 ஐ இலக்காகக் கொண்டுள்ளது, மேலும் Majorsilence.Forms.WinForms மற்றும் Majorsilence.Forms.Wpf ஒவ்வொன்றும் ஒரு net48 build உடன் வருகின்றன; எனவே ஒரு பாரம்பரிய .NET Framework 4.8 WinForms அல்லது WPF பயன்பாடு இன்றே Majorsilence.Forms கட்டுப்பாடுகளை உட்பொதித்து, பின்னர் .NET 8 அல்லது 10 க்கும் ஒரு பல்தளப் பின்தளத்துக்கும் மாறலாம். Avalonia, Uno, GTK 4 மற்றும் Headless பின்தளங்களுக்கு .NET 8 அல்லது அதற்குப் புதியது தேவை.
  - question: இது ஒரு web உலாவியில் இயங்குமா?
    id: can-it-run-in-a-web-browser
    answer: >-
      ஆம், WebAssembly மூலம், Avalonia இன் browser target அல்லது Uno Platform ஐப் பயன்படுத்தி; முழுக் கட்டுப்பாட்டுக் காட்சியகம் நேரடி உலாவி demo ஆக வெளியிடப்பட்டுள்ளது. உலாவியில் ஒரே thread தான், nested message loop இல்லை, எனவே Form.ShowDialog மற்றும் MessageBox.Show போன்ற தடுக்கும் அழைப்புகள் எதையும் காட்டுவதற்கு முன்பே தெளிவான PlatformNotSupportedException ஐ எறிகின்றன; அதற்குப் பதிலாக Form.ShowDialogAsync, MessageBox.ShowAsync மற்றும் பிற async இணைகளைப் பயன்படுத்துங்கள்; தொகுப்புடன் வரும் ஒரு Roslyn analyzer தடுக்கும் அழைப்புகளை உங்களுக்காகச் சுட்டிக்காட்டுகிறது. Canvas உடன் சேர்த்து framework ஒரு ARIA accessibility DOM ஐப் பேணுகிறது — ஒவ்வொரு கட்டுப்பாட்டுக்கும் role, name மற்றும் state உடன் ஒரு element — எனவே திரை வாசிப்பான்கள், find-in-page மற்றும் DOM சோதனைக் கருவிகள் UI ஐப் பார்க்க முடியும். இந்த target இல் இன்னும் native WebView இல்லை.
  - question: Android மற்றும் iOS ஆதரவு உள்ளதா, அது எவ்வளவு முதிர்ந்தது?
    id: is-there-an-android-and-ios-story-and-how-mature-is-it
    answer: >-
      ஆம், Avalonia இன் Android மற்றும் iOS targets மூலம்; project வார்ப்புரு அவற்றை --IncludeAndroid மற்றும் --IncludeiOS மூலம் சேர்க்கிறது. திரை விசைப்பலகை, input வகைகள், safe-area insets, back button, suspend மற்றும் resume, haptics, மற்றும் StackPanel, Card, NavigationHost போன்ற தொலைபேசி பாணி layout கட்டுப்பாடுகள் தயாராக உள்ளன; உலாவியில் போலவே தடுக்கும் உரையாடல் சாளரங்கள் async வடிவங்களுக்கு ஆதரவாக exception எறிகின்றன. Android தொடக்கம், taps, அளவிடுதல் மற்றும் touch scrolling ஆகியவற்றை உள்ளடக்கிய ஆரம்ப உண்மைச் சாதனச் சோதனையைக் கடந்துள்ளது; iOS ஒரு CI simulator smoke சோதனையில் compile ஆகித் தொடங்குகிறது, ஆனால் இதுவரை யாரும் அதை ஊடாடும் முறையில் இயக்கவில்லை, எனவே குறைபாடுகள் வெளிப்படும் என எதிர்பாருங்கள்.
  - question: இதை MVVM அல்லது CommunityToolkit.Mvvm உடன் பயன்படுத்தலாமா?
    id: can-i-use-it-with-mvvm-or-communitytoolkitmvvm
    answer: >-
      ஆம். Majorsilence.Forms.Mvvm, INotifyPropertyChanged மற்றும் ICommand மீதான இணைப்புகளை வழங்குகிறது: ஒருவழிப் புதுப்பிப்புகளுக்கு Observe, இருவழி binding க்கு BindText, BindChecked, BindSelectedIndex மற்றும் BindValue, buttons க்கு BindCommand, இவை அனைத்தையும் dispose செய்ய ஒரு BindingScope. இது properties ஐ nameof மூலம் பெயரிடுகிறது, lambdas மூலம் படிக்கிறது, எனவே reflection இல்லை, trimming இன்போது root செய்ய வேண்டியதும் எதுவுமில்லை. இது எந்த toolkit ஐயும் சார்ந்திருக்கவில்லை, எனவே CommunityToolkit.Mvvm கொண்டு எழுதப்பட்ட view model மாற்றமின்றி வேலை செய்கிறது.
  - question: இது trimming மற்றும் NativeAOT ஐ ஆதரிக்கிறதா?
    id: does-it-support-trimming-and-nativeaot
    answer: >-
      Core, Drawing.Common, Avalonia மற்றும் Headless packages க்கு ஆம்; அவை IsAotCompatible உடன் build ஆகின்றன, எனவே எந்த trim அல்லது AOT அபாயமும் அவற்றின் சொந்த build ஐயே தோல்வியடையச் செய்யும்; ஒரு NativeAOT smoke test CI இல் publish செய்யப்படுகிறது. பாரம்பரிய Control.DataBindings API reflection ஐப் பயன்படுத்துகிறது, எனவே trim செய்யப்பட்ட பயன்பாடு தான் bind செய்யும் view-model members ஐ ஒரு TrimmerRootDescriptor மூலம் root செய்ய வேண்டும்; framework தனது கட்டுப்பாடுகளின் bind செய்யக்கூடிய properties க்கான சொந்த descriptor ஐ உட்பொதிக்கிறது, மேலும் Mvvm package இந்தப் பிரச்சினையை முற்றிலும் தவிர்க்கிறது. Netstandard2.0 மற்றும் GTK 4 வரிசைகள் இன்னும் பகுப்பாய்வு செய்யப்படவில்லை.
  - question: ஒரு கட்டுப்பாட்டுக்கான HWND ஐ எப்படிப் பெறுவது?
    id: how-do-i-get-an-hwnd-for-a-control
    answer: >-
      பல்தளப் பின்தளங்களில் முடியாது, மேலும் framework போலியான ஒன்றைத் தர மறுக்கிறது. இங்கே ஒரு கட்டுப்பாடு OS சாளரம் அல்ல, ஒரு canvas மீதான paint செயல்பாடுகள், எனவே Control.Handle என்பது IntPtr.Zero. சாளர நிலை handles உண்மையானவை — WindowBase.PlatformHandle, Windows இல் உண்மையான HWND, macOS இல் NSWindow மற்றும் X11 இல் XID ஐத் தருகிறது. Native உள்ளடக்கத்தை ஹோஸ்ட் செய்ய ஆதரிக்கப்படும் NativeControlHost இணைப்புக்கோடு (seam) உள்ளது; Windows க்கு மட்டுமான WinForms பின்தளம் உண்மையான HWND ஐத் தருகிறது, ஏனெனில் அங்கே சாளரம் உண்மையிலேயே ஒரு WinForms சாளரம்.
  - question: ஒரு நேரத்தில் ஒரு திரையாக இடம்பெயர்க்க முடியுமா?
    id: can-i-migrate-one-screen-at-a-time
    answer: >-
      ஆம், பல வழிகளில். Migrator இன் dual-build mode, ஒரே MSBuild property க்குப் பின்னால் ஒரு திட்டத்தை உண்மையான WinForms மற்றும் Majorsilence.Forms இரண்டுக்கும் எதிராக compile ஆகும்படி வைக்கிறது. Windows இல், Majorsilence.Forms.WindowsFormsInterop உண்மையான System.Windows.Forms படிவங்களை ஒரு Majorsilence.Forms பயன்பாட்டுக்குள்ளும், அதன் எதிர்மாறாகவும் ஹோஸ்ட் செய்கிறது, எனவே முழுத் திரைகளும் தனித்தனியாக நகர்கின்றன. இன்னும் நுணுக்கமாக, WinForms மற்றும் WPF பின்தளங்கள் ToWinFormsControl அல்லது ToWpfElement மூலம் ஏற்கனவே உள்ள பயன்பாட்டினுள் Majorsilence.Forms கட்டுப்பாடுகளை ஒவ்வொன்றாக உட்பொதிக்கின்றன; WinFormsShims.Compat source generator, WinForms க்கு type செய்யப்பட்ட கட்டுப்பாட்டு libraries க்கு, Designer கோப்புகள் உட்பட மாற்றப்படாத System.Windows.Forms மூலக் குறியீட்டை Majorsilence.Forms க்கு எதிராக compile ஆக அனுமதிக்கிறது.
  - question: ஒரு AI coding assistant UI ஐ இயக்க முடியுமா?
    id: can-an-ai-coding-assistant-drive-the-ui
    answer: >-
      ஆம். ஒவ்வொரு கட்டுப்பாடும் ஓர் உரை வடிவத் தானியக்க மரம் (automation tree) மூலம் வெளிப்படுத்தப்படுகிறது; பயன்பாடு அதை Selenium அல்லது curl பேசக்கூடிய ஒரு loopback WebDriver endpoint மூலம் வழங்க முடியும். Majorsilence.Forms.Mcp என்பது அந்த endpoint ஐ ஒரு MCP server ஆகச் சுற்றும், வெளியிடப்பட்ட dotnet tool; அதில் ui_snapshot, ui_find, ui_read, ui_click, ui_type, ui_wait_for மற்றும் ui_screenshot கருவிகள் உள்ளன, எனவே Claude Code போன்ற ஒரு assistant இயங்கும் படிவத்தை ஆய்வு செய்து இயக்க முடியும். தனிப்பயனாக வரையப்படும் கட்டுப்பாடுகள் IAutomationStateProvider ஐச் செயல்படுத்துவதன் மூலம் தமது சொந்த value மற்றும் state ஐ வெளியிடுகின்றன.
  - question: தனிப்பயனாக வரையப்படும் கட்டுப்பாடுகள் DPI அளவிடுதலைக் கையாள வேண்டுமா?
    id: do-custom-painted-controls-need-to-handle-dpi-scaling
    answer: >-
      இல்லை, 2026-10-01 முதல் அவை கையாளக்கூடாது. ClientRectangle, ClientSize மற்றும் paint canvas ஆகியவை Width, Height, Bounds மற்றும் mouse coordinates போலவே தருக்க அலகுகளில் (logical units) உள்ளன, மேலும் framework canvas ஐ display க்கு ஏற்ப அளவிடுகிறது. ஒரு பழைய கட்டுப்பாடு e.Scaling உடன் e.Graphics.ScaleTransform ஐ அழைத்தால், அதை நீக்குங்கள், இல்லையெனில் வரைதல் இருமுறை அளவிடப்படும். சாதனப் பிக்சல்கள் ScaledBounds, PaintEventArgs.Scaling மற்றும் LogicalToDeviceUnits மூலம் இன்னும் கிடைக்கின்றன; DrawItem மற்றும் CellPainting போன்ற owner-draw events இன்னும் சாதனப் பிக்சல் bounds ஐயே தருகின்றன. MF_HEADLESS_SCALE=2 உடன் scale 2 இல் சோதியுங்கள்.
---

{% for entry in page.faq %}
### {{ entry.question }}
{:#{{ entry.id }}}

{{ entry.answer }}
{% endfor %}

## இன்னும் எதையாவது தேடுகிறீர்களா?
{:#still-looking-for-something}

- [பல்தள WinForms]({{ '/ta/cross-platform-winforms/' | relative_url }}) — கட்டமைப்பும், இணக்க மாதிரிக்கு
  ஆகும் விலையும்.
- [Linux இல் WinForms]({{ '/ta/winforms-on-linux/' | relative_url }}) மற்றும்
  [macOS இல் WinForms]({{ '/ta/winforms-on-macos/' | relative_url }}) — தளம் வாரியான விவரங்கள்.
- [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms,
  WPF மற்றும் Headless அருகருகே.
- [ஒரு WinForms பயன்பாட்டை இடம்பெயர்த்தல்]({{ '/ta/migration/' | relative_url }}) — தானியங்கி மீண்டும் எழுதுதல்.
- [WinForms மாற்றுகள் ஒப்பீடு]({{ '/ta/winforms-alternatives/' | relative_url }}) — MAUI, Avalonia,
  Uno, Eto.Forms, Wine.
- [CSS மூலம் தீம் அமைத்தல்]({{ site.github_url }}/blob/main/docs/theming.md) — தீம் துணைக்குழு, tokens
  மற்றும் Theme Studio.
- [Compatibility matrix]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — "*X* ஆதரிக்கப்படுகிறதா?"
  என்பதற்குக் கட்டுப்பாடு வாரியான பதில்.
- [ஒரு issue ஐத் திறக்கவும்]({{ site.github_url }}/issues) — பதில் இங்கே இல்லையென்றால்.
