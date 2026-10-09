---
layout: docs
lang: si
title: නිතර අසන ප්‍රශ්න
subtitle: බහු-වේදිකා WinForms ගැන මිනිසුන් මුලින්ම අසන දේට කෙටි, සෘජු පිළිතුරු.
permalink: /si/faq/
seo_title: "බහු-වේදිකා WinForms නිතර අසන ප්‍රශ්න — WinForms Linux මත ධාවනය කළ හැකිද?"
description: >-
  WinForms Linux හෝ macOS මත ධාවනය කළ හැකිද? WinForms බහු-වේදිකා ද? මට නැවත ලිවීමට සිදුවේද? විවෘත
  මූලාශ්‍ර (open-source) WinForms ගැළපුම් ස්තරය ගැන සෘජු පිළිතුරු.
keywords:
  - can winforms run on linux
  - winforms linux
  - is winforms cross platform
  - winforms බහු-වේදිකා
  - winforms on mac
  - winforms compatibility layer
  - winforms alternative
  - winforms designer cross platform
  - winforms vb.net cross platform
  - winforms dark mode theme
  - winforms gtk
  - winforms terminal
  - winforms nativeaot
  - winforms mvvm
priority: "0.8"
faq:
  - question: WinForms Linux මත ධාවනය කළ හැකිද?
    id: can-winforms-run-on-linux
    answer: >-
      පවතින ආකාරයෙන් නොහැක. System.Windows.Forms ලැබෙන්නේ Windows Desktop runtime එකේ පමණක් වන අතර එය user32.dll සහ GDI+ ආවරණය (wrap) කරයි, එබැවින් WinForms ව්‍යාපෘතියක් Linux මත build වීමවත් නොවේ. Majorsilence.Forms මෙය විසඳන්නේ WinForms API එක SkiaSharp මත නැවත ක්‍රියාත්මක කර, එය Avalonia හරහා native window එකක හෝ සැබෑ GTK 4 window එකක ධාරණය කිරීමෙනි, එබැවින් එම C# හෝ VB.NET source එකම -windows target framework එකක් නොමැති සාමාන්‍ය net10.0 build එකකින් Ubuntu, Fedora සහ Debian මත native ලෙස build වී ධාවනය වේ.
  - question: WinForms macOS මත ධාවනය කළ හැකිද?
    id: can-winforms-run-on-macos
    answer: >-
      පවතින ආකාරයෙන් නොහැක — System.Windows.Forms හි macOS build එකක් කිසි දිනෙක තිබී නැත. Majorsilence.Forms එම WinForms කේතයම Apple Silicon සහ Intel Macs යන දෙකෙහිම සැබෑ NSWindow එකක ධාවනය කරයි, සාමාන්‍ය osx-arm64 සහ osx-x64 runtime identifiers සමඟ publish කර.
  - question: එය native Linux toolkit එකක් වන GTK මත ධාවනය වේද?
    id: does-it-run-on-gtk-as-a-native-linux-toolkit
    answer: >-
      ඔව්. Majorsilence.Forms.Gtk4 යනු gir.core bindings මත ගොඩනැගූ GTK 4 backend එකකි: Wayland හෝ X11 මත සැබෑ Gtk.Window එකක්, Application.Run ට පෙර Gtk4Application.Use මඟින් පැහැදිලිවම තෝරනු ලැබේ, සහ GTK 4 runtime එක ස්ථාපනය කර ඇති ඕනෑම තැනක Windows සහ macOS මතද ධාවනය වේ. එය ToGtkWidget සහ ToGtkWindow හරහා දෙදිශාවටම කාවැද්දිය (embed) හැකිය, සුපුරුදු airspace ගැටලුවකින් තොරව native GTK widgets ධාරණය කරයි, සහ WebBrowser හට WebKitGTK engine එකක් ලබා දෙයි. දන්නා හිඩැස් නම් තිරයේ පිහිටීම පාලනය කළ නොහැකි වීම, පූර්ණ සංඛ්‍යා (integer) scale factors පමණක් වීම, සහ ගොනු pickers framework එකේම සංවාද කවුළු වෙත ආපසු වැටීමයි.
  - question: එය terminal එකක ධාවනය කළ හැකිද?
    id: can-it-run-in-a-terminal
    answer: >-
      ඔව්. Majorsilence.Forms.Terminal පෝරමයක් console එකක තනි full-screen දර්ශනයක් ලෙස ධාරණය කරයි, දුරකථනයක් කරන ආකාරයටම; terminal එක සහාය දක්වන තැන්වලදී සැබෑ pixel resolution එකෙන් Kitty graphics හෝ Sixel හරහා විදැහුම් කරන අතර වෙනත් තැන්වලදී Unicode block elements වෙත ආපසු වැටේ. Mouse සහ keyboard ක්‍රියා කරයි, Ctrl+C සැමවිටම පිටවෙයි, සහ එය xterm සහ WezTerm තුළ තහවුරු කර ඇත. මෙම backend එකේ native ගොනු pickers, native hosting හෝ web view නැත.
  - question: WinForms බහු-වේදිකා ද?
    id: is-winforms-cross-platform
    answer: >-
      නැත. Windows Forms ම Windows-පමණක් වන අතර සැමවිටම එසේ විය; ඊට යටින් ඇති .NET runtime එක පමණක් බහු-වේදිකා වේ. WinForms යෙදුමක් බහු-වේදිකා කිරීම යනු UI එක වෙනත් framework එකක නැවත ලිවීම, Wine වැනි දෙයකින් Windows අනුකරණය (emulate) කිරීම, හෝ Majorsilence.Forms වැනි API-ගැළපෙන නැවත ක්‍රියාත්මක කිරීමක් (reimplementation) භාවිත කිරීමයි.
  - question: WinForms ගැළපුම් ස්තරයක් යනු කුමක්ද?
    id: what-is-a-winforms-compatibility-layer
    answer: >-
      System.Windows.Forms හි ඇති එම classes, properties සහ events — Form, Button, DataGridView, සිදුවීම් හසුරුවන (event handlers), Designer.cs රටාව — නිරාවරණය කරන නමුත්, ඒවා Win32 වෙනුවට ගෙන යා හැකි (portable) යමක් මත ක්‍රියාත්මක කරන library එකකි. ඔබේ source එක එහි හැඩය රඳවා ගෙන namespace එක පමණක් වෙනස් කරයි; යටින් ඇති සියල්ල වෙනස් වේ.
  - question: මගේ WinForms යෙදුම බහු-වේදිකා කිරීමට එය නැවත ලිවිය යුතුද?
    id: do-i-have-to-rewrite-my-winforms-app-to-make-it-cross-platform
    answer: >-
      Majorsilence.Forms සමඟ නම් නැත. සංක්‍රමණය බොහෝ දුරට යාන්ත්‍රික වේ — namespaces, ව්‍යාපෘති ගොනු සහ resources — සහ majorsilence-migrate CLI එක එය ඔබ වෙනුවෙන්, තැනින් තැන (in place) සහ කියවිය හැකි git diff එකක් ලෙස සිදු කරයි. ඔබේ පෝරම, පාලක, සිදුවීම් හසුරුවන සහ Designer ගොනු රඳවා ගැනේ. WndProc හෝ Control.Handle හරහා Win32 වෙත කෙලින්ම ළඟා වන කේතය නම් නැවත ලිවිය යුතුය.
  - question: Majorsilence.Forms, Avalonia, Uno Platform හෝ .NET MAUI වලින් වෙනස් වන්නේ කෙසේද?
    id: how-is-majorsilenceforms-different-from-avalonia-uno-platform-or-net-maui
    answer: >-
      ඒවා XAML frameworks වේ: විශිෂ්ට ඉලක්ක, නමුත් එකක් භාවිතයට ගැනීම යනු ඔබේ UI එක XAML views සහ view models ලෙස නැවත ගොඩනැගීමයි. Majorsilence.Forms WinForms ක්‍රමලේඛන ආකෘතිය රඳවා ගන්නා අතර යටින් ඇති toolkit එක මාරු කළ හැකි ධාරකයක් (host) ලෙස සලකයි: පෙරනිමියෙන් Avalonia හෝ Uno, සහ GTK 4, සැබෑ WinForms, WPF හෝ terminal එකක්ද — එය ඒවා සමඟ තරඟ කරනවා වෙනුවට ඒවා මත ගොඩනැගී ඇත. මුල සිට අලුතින් ආරම්භ කරන යෙදුමක් සඳහා XAML කෙලින්ම තෝරන්න; ඔබ රඳවා ගැනීමට උත්සාහ කරන වත්කම පවතින WinForms codebase එකක් නම් Majorsilence.Forms තෝරන්න.
  - question: මගේ Designer.cs ගොනු තවමත් ක්‍රියා කරයිද?
    id: do-my-designercs-files-still-work
    answer: >-
      ඔව්. Designer.cs සහ Designer.vb code-behind රටාව පවතින ආකාරයෙන්ම ආරක්ෂා කර ඇති අතර generate කළ layout කේතය වෙනසකින් තොරව ධාවනය වේ. තවම නොපවතින්නේ එය සංස්කරණය කිරීමට දෘශ්‍ය design surface එකකි — drag-and-drop designer එකක් නැත, සහ එය backlog එකේ ඇති අපේක්ෂිත විශේෂාංගයකි.
  - question: එය C# මෙන්ම VB.NET ද සහාය දක්වයිද?
    id: does-it-support-vbnet-as-well-as-c
    answer: >-
      ඔව්. migrator එක .vb ව්‍යාපෘති නැවත ලියයි, MyType=Empty අදාළ වීම නතර වූ විට අහිමි වන implicit WinForms constructor එක ඇතුළු කරයි, සහ My.Resources accessor එකක් generate කරයි. VB Application Model හි කොටස් (My.Application, My.Forms) ද ක්‍රියාත්මක කර ඇති අතර, තවමත් ක්‍රියාත්මක කර නොමැති දේ සහ ඊට හේතු MIGRATION.md හි ලැයිස්තුගත කර ඇත. පුහුණු මාර්ගෝපදේශය සෑම නිදසුනක්ම C# සහ VB.NET යන දෙකෙන්ම ලබා දෙයි.
  - question: System.Drawing සහ GDI+ වෙනුවට එන්නේ කුමක්ද?
    id: what-replaces-systemdrawing-and-gdi
    answer: >-
      Majorsilence.Forms.Drawing.Common — Bitmap, Font, Pen, Brush, Icon, Region, StringFormat, Drawing2D, Imaging සහ EMF/WMF metafile playback ආවරණය කරන, SkiaSharp මත පදනම් වූ නැවත ක්‍රියාත්මක කිරීමකි. value types — Color, Point, Size, Rectangle — හිතාමතාම නැවත ක්‍රියාත්මක කර නැත; ඒ වෙනුවට දැනටමත් බහු-වේදිකා වන සැබෑ System.Drawing.Primitives types භාවිත වේ. මෙය වැදගත් වන්නේ .NET 7 සිට System.Drawing.Common, Windows නොවන වේදිකා මත PlatformNotSupportedException throw කරන බැවිනි.
  - question: මට එය තේමා කළ හැකිද, dark mode එකක් තිබේද?
    id: can-i-theme-it-and-is-there-a-dark-mode
    answer: >-
      ඔව්. තේමා ලියනු ලබන්නේ CSS හි කුඩා, සම්පූර්ණයෙන් ලේඛනගත කළ උප කට්ටලයකිනි: @theme "Ocean" extends Dark වැනි තේමා header එකක්, accent, background සහ font properties සඳහා root tokens, සහ hover, active, disabled සහ focus තත්ත්ව සහිත පාලක-වර්ගය අනුව rules. Light සහ dark built-in තේමා සමඟ එයි, සෑම පාලකයකටම CSS selector එකක් ඇත, සහ parser එක උප කට්ටලයෙන් පිටත ඕනෑම දෙයක් නිහඬව නොසලකා හරිනවා වෙනුවට diagnostic එකක් වාර්තා කරයි. Theme Studio නිදසුන පෙරදසුන සහිත සජීවී සංස්කාරකයක් වන අතර, සහකාර Theming.WinForms සහ Theming.Avalonia packages එම sheet එකම සැබෑ System.Windows.Forms සහ native Avalonia පාලක වලට යොදයි, එබැවින් එක් තේමාවකට මිශ්‍ර සංක්‍රමණ යෙදුමක් නැවත හැඩගැන්විය හැකිය.
  - question: Majorsilence.Forms නොමිලේ සහ විවෘත මූලාශ්‍ර (open source) ද?
    id: is-majorsilenceforms-free-and-open-source
    answer: >-
      ඔව්. එය MIT බලපත්‍රය යටතේ ඇත, GitHub මත විවෘතව සංවර්ධනය කෙරේ, සහ NuGet වෙත publish කෙරේ. වාණිජ මට්ටමක් හෝ ගෙවිය යුතු බලපත්‍රයක් නැත.
  - question: එය production සඳහා සූදානම් ද?
    id: is-it-production-ready
    answer: >-
      එය බීටා අවධියේ ය. API එක ස්ථාවර වෙමින් පවතින අතර සෑම WinForms කෙළවරක්ම ආවරණය කර නැත, එබැවින් ඔබේ package අනුවාදය ස්ථිර කරන්න. සෑම WinForms සහ GDI+ member එකක්ම දැන් ප්‍රකාශ කර ඇති අතර, members තවමත් WinForms මෙන් හැසිරෙන්නේ නැති තැන් පිළිබඳ ක්ෂේත්‍ර දොළහක හැසිරීම්-හිඩැස් විගණනයක් අදියර වශයෙන් සිදු කෙරෙමින් පවතී; keyboard chain, focus සහ validation, සැබෑ සංවාද කවුළු, data binding, ListView details view සහ බොහෝ පාලක-පවුල් දැනටමත් සම්පූර්ණ කර ඇත. සැබෑ යෙදුම් කිහිපයක් එය මතට fork කර ඇත, ඒ අතර Notepad++ ක්ලෝනයක්, DarkUI, PKHeX සහ RibbonWinForms වේ. කැපවීමට පෙර ගැළපුම් matrix එක කියවන්න.
  - question: එය DataGridView සහාය දක්වයිද?
    id: does-it-support-datagridview
    answer: >-
      අර්ධ වශයෙන්, සහ එය බොහෝ සෙයින් පටු වී ඇතත්, තවමත් තනි type එකක විශාලතම හිඩැස එයයි. වැඩිපුරම භාවිත වන hooks සැබෑ ය — cell formatting සහ painting, row pre සහ post paint, cell parsing, row validation, clipboard content, border styles, virtual mode, commit නොකළ නව පේළිය සහ column display-order නැවත පිළිවෙළ කිරීම. CellStateChanged සහ RowStateChanged වැනි events කිහිපයක් source ගැළපුම සඳහා තවමත් ප්‍රකාශ කර ඇතත් කිසි විටෙක raise නොවේ. ඒවා කුමක්ද යන්න ගැළපුම් matrix එක නිවැරදිවම ලැයිස්තුගත කරයි.
  - question: සහාය දක්වන .NET අනුවාද මොනවාද?
    id: which-net-versions-are-supported
    answer: >-
      සෑම backend එකක් සඳහාම .NET 8 සහ .NET 10, -windows target framework suffix එකක් හෝ Windows Desktop runtime dependency එකක් නොමැතිව. core packages netstandard2.0 සඳහාද build වන අතර, WinForms සහ WPF සංක්‍රමණ backends net48 target එකක් එක් කරයි, එවිට .NET Framework 4.8 යෙදුමකට ඒවා ධාරණය කළ හැකිය.
  - question: එය .NET Framework 4.8 සමඟ ක්‍රියා කරයිද?
    id: does-it-work-with-net-framework-48
    answer: >-
      Windows-පමණක් වූ සංක්‍රමණ backends හරහා පමණි. core library එක netstandard2.0 ඉලක්ක කරන අතර, Majorsilence.Forms.WinForms සහ Majorsilence.Forms.Wpf එක එකක් net48 build එකක් සපයයි, එබැවින් සම්භාව්‍ය .NET Framework 4.8 WinForms හෝ WPF යෙදුමකට අදම Majorsilence.Forms පාලක කාවැද්දිය හැකි අතර පසුව .NET 8 හෝ 10 සහ බහු-වේදිකා backend එකකට මාරු විය හැකිය. Avalonia, Uno, GTK 4 සහ Headless backends සඳහා .NET 8 හෝ ඊට නවතම අනුවාදයක් අවශ්‍ය වේ.
  - question: එය web browser එකක ධාවනය කළ හැකිද?
    id: can-it-run-in-a-web-browser
    answer: >-
      ඔව්, WebAssembly හරහා, Avalonia හි browser target එක හෝ Uno Platform භාවිතයෙන්, සහ සම්පූර්ණ පාලක ගැලරිය සජීවී in-browser demo එකක් ලෙස publish කර ඇත. browser එකට ඇත්තේ එක් thread එකක් පමණක් වන අතර nested message loop එකක් නැත, එබැවින් Form.ShowDialog සහ MessageBox.Show වැනි blocking calls කිසිවක් පෙන්වීමට පෙර පැහැදිලි PlatformNotSupportedException එකක් throw කරයි; ඒ වෙනුවට Form.ShowDialogAsync, MessageBox.ShowAsync සහ අනෙකුත් async ප්‍රතිරූප භාවිත කරන්න, සහ ඇතුළත් Roslyn analyzer එකක් blocking calls ඔබ වෙනුවෙන් සලකුණු කරයි. canvas එකට සමගාමීව framework එක ARIA accessibility DOM එකක් පවත්වාගෙන යයි, role, name සහ state සහිතව එක් පාලකයකට එක් element එකක් බැගින්, එබැවින් තිර කියවන, find-in-page සහ DOM test tools හට UI එක දැකිය හැකිය. මෙම target එකේ තවමත් native WebView එකක් නැත.
  - question: Android සහ iOS සඳහා විසඳුමක් තිබේද, එය කොතරම් පරිණත ද?
    id: is-there-an-android-and-ios-story-and-how-mature-is-it
    answer: >-
      ඔව්, Avalonia හි Android සහ iOS targets හරහා, ඒවා ව්‍යාපෘති සැකිල්ල --IncludeAndroid සහ --IncludeiOS මඟින් එක් කරයි. on-screen keyboard, input kinds, safe-area insets, back බොත්තම, suspend සහ resume, haptics සහ StackPanel, Card සහ NavigationHost වැනි දුරකථන-ආකාර layout පාලක ක්‍රියාත්මකව ඇති අතර, browser එකේ මෙන්ම blocking සංවාද කවුළු async ආකාරවලට පක්ෂව throw කරයි. Android, boot, taps, පරිමාණනය සහ touch scrolling ආවරණය වන පරිදි සැබෑ උපාංගයක් මත මූලික පරීක්ෂාවකට ලක් වී ඇත; iOS, CI simulator smoke check එකක compile වී launch වන නමුත් කිසිවෙකු තවම එය අන්තර්ක්‍රියාකාරීව ධාවනය කර නැත, එබැවින් ගැටලු මතු වී නිරාකරණය වීමේ කාලයක් අපේක්ෂා කරන්න.
  - question: මට එය MVVM හෝ CommunityToolkit.Mvvm සමඟ භාවිත කළ හැකිද?
    id: can-i-use-it-with-mvvm-or-communitytoolkitmvvm
    answer: >-
      ඔව්. Majorsilence.Forms.Mvvm, INotifyPropertyChanged සහ ICommand මත සම්බන්ධ කිරීම් (wiring) සපයයි: එක්-දිශා යාවත්කාලීන සඳහා Observe, ද්වි-දිශා binding සඳහා BindText, BindChecked, BindSelectedIndex සහ BindValue, බොත්තම් සඳහා BindCommand, සහ ඒ සියල්ල dispose කිරීමට BindingScope එකක්. එය properties nameof මඟින් නම් කර lambdas මඟින් කියවයි, එබැවින් reflection නැති අතර trimming යටතේ root කිරීමට කිසිවක් නැත. එය කිසිදු toolkit එකක් මත රඳා නොපවතින නිසා, CommunityToolkit.Mvvm සමඟ ලියූ view model එකක් වෙනසකින් තොරව ක්‍රියා කරයි.
  - question: එය trimming සහ NativeAOT සහාය දක්වයිද?
    id: does-it-support-trimming-and-nativeaot
    answer: >-
      core, Drawing.Common, Avalonia සහ Headless packages සඳහා ඔව්; ඒවා IsAotCompatible සමඟ build වන නිසා ඕනෑම trim හෝ AOT අවදානමක් ඒවායේම build එක අසාර්ථක කරයි, සහ NativeAOT smoke test එකක් CI තුළ publish වේ. සම්භාව්‍ය Control.DataBindings API එක reflection භාවිත කරන නිසා, trim කළ යෙදුමක් තමන් bind කරන view-model members TrimmerRootDescriptor එකකින් root කළ යුතුය; framework එක තම පාලකවල bind කළ හැකි properties සඳහා තමන්ගේම descriptor එකක් කාවද්දා ඇති අතර, Mvvm package එක මෙම ගැටලුව සම්පූර්ණයෙන්ම මඟහරී. netstandard2.0 සහ GTK 4 පේළි තවම විශ්ලේෂණය කර නැත.
  - question: පාලකයක් සඳහා HWND එකක් ලබා ගන්නේ කෙසේද?
    id: how-do-i-get-an-hwnd-for-a-control
    answer: >-
      බහු-වේදිකා backends මත ඔබට එය කළ නොහැකි අතර, framework එක ව්‍යාජ එකක් සෑදීම ප්‍රතික්ෂේප කරයි. මෙහි පාලකයක් යනු OS window එකක් නොව canvas එකක් මත වන paint operations වේ, එබැවින් Control.Handle යනු IntPtr.Zero වේ. Window-මට්ටමේ handles සැබෑ ය — WindowBase.PlatformHandle, Windows මත සැබෑ HWND එකක්, macOS මත NSWindow සහ X11 මත XID ලබා දෙයි. native අන්තර්ගතය ධාරණය කිරීම සඳහා සහාය දක්වන NativeControlHost සන්ධියක් (seam) ඇති අතර, Windows-පමණක් වූ WinForms backend එක සැබෑ HWND එකක් ලබා දෙයි, මන්ද එහි window එක සැබවින්ම WinForms window එකක් වන බැවිනි.
  - question: මට වරකට එක් තිරයක් බැගින් සංක්‍රමණය කළ හැකිද?
    id: can-i-migrate-one-screen-at-a-time
    answer: >-
      ඔව්, ක්‍රම කිහිපයකින්. migrator හි dual-build mode එක එක් MSBuild property එකක් පිටුපස ව්‍යාපෘතියක් සැබෑ WinForms සහ Majorsilence.Forms යන දෙකටම එරෙහිව compile වන ලෙස තබා ගනී. Windows මත, Majorsilence.Forms.WindowsFormsInterop සැබෑ System.Windows.Forms පෝරම Majorsilence.Forms යෙදුමක් තුළ ධාරණය කරයි, සහ ප්‍රතිලෝමවද, එබැවින් සම්පූර්ණ තිර තනි තනිව මාරු වේ. ඊටත් වඩා සියුම්ව, WinForms සහ WPF backends, ToWinFormsControl හෝ ToWpfElement හරහා වරකට එක් පාලකයක් බැගින් පවතින යෙදුමක් තුළ Majorsilence.Forms පාලක කාවද්දයි, සහ WinFormsShims.Compat source generator එක, WinForms වෙත type කළ පාලක libraries සඳහා, Designer ගොනු ද ඇතුළුව වෙනස් නොකළ System.Windows.Forms source, Majorsilence.Forms වෙත එරෙහිව compile වීමට ඉඩ දෙයි.
  - question: AI coding assistant කෙනෙකුට UI එක මෙහෙයවිය හැකිද?
    id: can-an-ai-coding-assistant-drive-the-ui
    answer: >-
      ඔව්. සෑම පාලකයක්ම පෙළ ස්වයංක්‍රීයකරණ ගසයක් (automation tree) හරහා නිරාවරණය වන අතර, යෙදුමට එය Selenium හෝ curl සමඟ කතා කළ හැකි loopback WebDriver endpoint එකක් හරහා serve කළ හැකිය. Majorsilence.Forms.Mcp යනු එම endpoint එක MCP server එකක් ලෙස ආවරණය කරන publish කළ dotnet tool එකකි, ui_snapshot, ui_find, ui_read, ui_click, ui_type, ui_wait_for සහ ui_screenshot tools සමඟ, එබැවින් Claude Code වැනි assistant කෙනෙකුට ධාවනය වන පෝරමයක් පරීක්ෂා කර ක්‍රියාත්මක කළ හැකිය. custom-painted පාලක IAutomationStateProvider ක්‍රියාත්මක කිරීමෙන් තමන්ගේම අගය සහ තත්ත්වය publish කරයි.
  - question: custom-painted පාලක DPI පරිමාණනය හැසිරවිය යුතුද?
    id: do-custom-painted-controls-need-to-handle-dpi-scaling
    answer: >-
      නැත, සහ 2026-10-01 සිට ඒවා එසේ නොකළ යුතුය. ClientRectangle, ClientSize සහ paint canvas එක Width, Height, Bounds සහ mouse coordinates මෙන්ම තාර්කික ඒකක වලින් වන අතර, framework එක canvas එක display එකට පරිමාණනය කරයි. පැරණි පාලකයක් e.Scaling සමඟ e.Graphics.ScaleTransform call කළේ නම්, එය ඉවත් කරන්න, නැතහොත් ඇඳීම දෙවරක් පරිමාණනය වේ. උපාංග පික්සල ScaledBounds, PaintEventArgs.Scaling සහ LogicalToDeviceUnits හරහා තවමත් ලබා ගත හැකි අතර, DrawItem සහ CellPainting වැනි owner-draw events තවමත් උපාංග-පික්සල bounds භාර දෙයි. MF_HEADLESS_SCALE=2 සමඟ scale 2 හිදී පරීක්ෂා කරන්න.
---

{% for entry in page.faq %}
### {{ entry.question }}
{:#{{ entry.id }}}

{{ entry.answer }}
{% endfor %}

## තවමත් යමක් සොයමින් සිටිනවාද?
{:#still-looking-for-something}

- [බහු-වේදිකා WinForms]({{ '/si/cross-platform-winforms/' | relative_url }}) — ගෘහ නිර්මාණ ශිල්පය (architecture) සහ
  ගැළපුම් ආකෘතියේ පිරිවැය.
- [Linux මත WinForms]({{ '/si/winforms-on-linux/' | relative_url }}) සහ
  [macOS මත WinForms]({{ '/si/winforms-on-macos/' | relative_url }}) — වේදිකාවෙන් වේදිකාවට විස්තර.
- [වේදිකා backends]({{ '/si/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms,
  WPF සහ Headless පැත්තෙන් පැත්තට.
- [WinForms යෙදුමක් සංක්‍රමණය කරන්න]({{ '/si/migration/' | relative_url }}) — ස්වයංක්‍රීය නැවත ලිවීම.
- [WinForms විකල්ප සංසන්දනය]({{ '/si/winforms-alternatives/' | relative_url }}) — MAUI, Avalonia,
  Uno, Eto.Forms, Wine.
- [CSS සමඟ තේමාකරණය]({{ site.github_url }}/blob/main/docs/theming.md) — තේමා උප කට්ටලය, tokens
  සහ Theme Studio.
- [ගැළපුම් matrix එක]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — "*X* සහාය දක්වයිද?"
  යන්නට පාලකයෙන් පාලකයට පිළිතුර.
- [Issue එකක් විවෘත කරන්න]({{ site.github_url }}/issues) — පිළිතුර මෙහි නොමැති නම්.
