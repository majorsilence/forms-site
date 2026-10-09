---
title: "අගෝස්තුවේ සිට පැමිණි දේ: 26.9.0, නව backends හතරක්, CSS තේමා සහ හැසිරීම් විගණනය"
date: 2026-10-08 12:00:00 -0230
lang: si
permalink: /si/blog/2026/10/08/whats-new-since-august-26-9-0/
read_time: "මිනිත්තු 7 ක කියවීමක්"
excerpt: "සති හතක් සහ commits 557 ක්: GTK 4, Terminal, WinForms සහ WPF ධාරක, .NET Framework 4.8 සහාය, CSS තේමා, mobile සහ browser මත async-පමණක් සංවාද කවුළු, සහ ඔබ ක්‍රියා කළ යුතු එක් paint වෙනසක්."
description: >-
  Majorsilence.Forms 26.9.0: GTK 4, Terminal, WinForms සහ WPF backends, net48 සහ netstandard2.0,
  CSS තේමා, MVVM, හැසිරීම් විගණනය, සහ උත්ශ්‍රේණි කිරීමේ සටහන්.
---

මෙහි අවසාන ලිපිය ලියා තිබුණේ 26.0.30 අනුවාදය අනුවය. 2026-08-17 සිට repository එකට commits 557 ක් එක් වී ඇති අතර වත්මන් නිකුතුව **26.9.0** වේ. මෙය දැනට සිටින පරිශීලකයින් සහ ඇගයීම් කරන්නන් සඳහා සාරාංශයකි: වෙනස් වූයේ කුමක්ද, එක් එක් කොටස කෙතරම් පරිණතද, සහ උත්ශ්‍රේණි කිරීමේදී ඔබ අනිවාර්යයෙන්ම කළ යුතු එකම දෙය.

## නව backends හතරක්
{:#four-new-backends}

ධාරක (hosts) තුනක් තිබුණි — Avalonia, Uno, Headless. දැන් හතක් ඇති අතර, සියල්ලම එකම පාලක කට්ටලය ධාවනය කරයි; වෙනස වන්නේ කවුළුව නිර්මාණය කර Skia surface එක ඉදිරිපත් කරන්නේ කවුද යන්න පමණි.

**GTK 4** (`Majorsilence.Forms.Gtk4`) යනු gir.core මත ගොඩනගා ඇති, Linux වලට මුල්තැන දෙන ධාරකයකි: එක් පෝරමයකට එක් සැබෑ `Gtk.Window` එකක්, GLib main loop, තවද GTK 4 runtime සමඟ Windows සහ macOS මතද භාවිත කළ හැකිය. `Application.Run` ට පෙර `Gtk4Application.Use ();` සමඟ එය පැහැදිලිවම තෝරන්න. කාවැද්දීම (embedding) දෙපැත්තටම ක්‍රියා කරයි (`ToGtkWidget()`, `ToGtkWindow()`), GTK 4 එක් render tree එකක් සංයුක්ත කරන බැවින් `NativeControlHost` හට "airspace" ගැටලුවක් නැත, තවද `WebBrowser` WebKitGTK 6.0 මඟින් සහාය දක්වයි. Wayland මත තහවුරු කර ඇත. දන්නා හිඩැස්: තිර-පිහිටීම් පාලනයක් නැත (GTK 4 එම API එක ඉවත් කළේය), `SetIcon(byte[])` යනු no-op (කිසිවක් නොකරයි) එකකි, native file pickers හිස්ව ආපසු එන බැවින් විකල්ප (fallback) සංවාද කවුළු භාවිත වේ, පූර්ණ සංඛ්‍යා scale factor පමණි, AOT-විශ්ලේෂණය කර නැත.

**Terminal** (`Majorsilence.Forms.Terminal`, 2026-10-04) පෝරමයක් console එකක් තුළ තනි-දර්ශන (single view) ලෙස ධාරණය කරයි — දුරකථනයක මෙන්, පෝරමය terminal එක පුරා පිරී යයි, title bar එකක් නැත. ලබා ගත හැකි තැන්වල එය සැබෑ pixel විභේදනයෙන් Kitty graphics හෝ Sixel භාවිත කරයි, එසේ නොමැති නම් Unicode block elements; හඳුනාගැනීම සිදු වන්නේ terminal එකෙන් විමසීමෙනි, තවද `MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` මඟින් ප්‍රකාරයක් ස්ථිර කරයි. Mouse සහ keyboard ක්‍රියා කරයි; Ctrl+C සෑම විටම පිටවෙයි. `TerminalApplication.Use (options);` සමඟ තෝරනු ලැබේ. xterm සහ WezTerm මත පමණක් තහවුරු කර ඇත. Native pickers, `NativeControlHost` හෝ webview නැත.

**WinForms** (`Majorsilence.Forms.WinForms`) යනු Windows-පමණක් වූ *සංක්‍රමණ* backend එකකි: Win32 pump මත සැබෑ `System.Windows.Forms` කවුළු, GDI bitmap එකක් හරහා ඉදිරිපත් කරන Skia. එය පවතින්නේ ඔබට පවතින WinForms යෙදුමක් තුළ Majorsilence.Forms පාලක වරකට එක පාලකය බැගින් කාවැද්දීමට හැකි වන පරිදිය — `myMfControl.ToWinFormsControl()`, `myForm.ToWinFormsForm()`, `MajorsilenceFormsPresenter` — ඉන්පසු සියල්ල port කළ පසු ධාරකය Avalonia හෝ Uno වෙත මාරු කරන්න. Gestures නැත, `IWebViewFactory` නැත. එය Avalonia ධාරකය මත සම්පූර්ණ පෝරම සම්බන්ධ කරන පැරණි `WindowsFormsInterop` ට වඩා වෙනස් ය.

**WPF** (`Majorsilence.Forms.Wpf`) WPF යෙදුම් සඳහා එම හැඩයම සහ අරමුණම ඇත: සැබෑ WPF `Window` එකක්, `WriteableBitmap` ඉදිරිපත් කිරීම, `ToWpfElement()` සහ `ToWpfWindow()`. `Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();` සමඟ එය තෝරන්න.

Avalonia, WinForms සහ GTK 4 සැබෑ OS-මට්ටමේ modal සංවාද කවුළු ලබා දෙයි; Uno ස්වාධීන කවුළුවක් විවෘත කරයි, එබැවින් එහිදී `Form.ShowDialog(parent)` භාවිත කරන්න.

## .NET Framework 4.8 සහ netstandard2.0
{:#net-framework-48-and-netstandard20}

මූලික packages — `Majorsilence.Forms`, `.Drawing.Common`, `.Telerik` — දැන් `net8.0`, `net10.0` **සහ `netstandard2.0`** බහු-ඉලක්ක (multi-target) කරන අතර, WinForms සහ WPF backends `net48` එක් කරයි. එබැවින් .NET Framework 4.8 යෙදුමකට පළමුව නවීන .NET වෙත මාරු නොවී Majorsilence.Forms පාලක ධාරණය කළ හැකි අතර, එමඟින් බොහෝ සංක්‍රමණවලට තිබූ අනුපිළිවෙල පිළිබඳ ගැටලුවක් ඉවත් වේ.

## හැසිරීම්-හිඩැස් විගණනය
{:#the-behaviour-gap-audit}

API-මතුපිට හිඩැස් සැලසුම් දෙක (WinForms සහ GDI+) **ශුන්‍යයේ** පවතී: upstream හි ඇති සෑම member එකක්ම ප්‍රකාශ කර ඇත. එය සෑම විටම අඩු සිත්ගන්නා භාගය විය. පවතින නමුත් කිසිවෙකු කියවන්නේ නැති අගයක් ගබඩා කරන, හෝ කිසිවෙකු fire නොකරන event එකක් ඇති member එකක් ඔබේ සංක්‍රමණය කළ යෙදුම compile කරයි, ඉන්පසු නිහඬවම කිසිවක් නොකරයි.

එබැවින් 2026-08-25 දින ක්ෂේත්‍ර දොළහක විගණනයක් එක් එක් ක්ෂේත්‍රය upstream ක්‍රියාත්මක කිරීම සමඟ සංසන්දනය කර, හැසිරීම වෙනස් වූ **සොයාගැනීම් 483 ක්** වාර්තා කළේය. එතැන් සිට අදියර 0–4 සහ බොහෝ පාලක-පවුල් පැමිණ ඇත. දැන් සැබෑ වී ඇති නිශ්චිත අයිතම: `ProcessCmdKey` පූර්ව-සැකසුම් දාමය, තනි focus/validation පාලන ලක්ෂ්‍යයක්, client area එකෙන් පිටත title bar එක, `AutoScaleMode.Font` සැබවින්ම පරිමාණනය කිරීම, සජීවී data binding (`CurrencyManager`, `BindingNavigator`), `ListView.View = Details`, upstream අනුපිළිවෙලින් පෝරම ජීවන චක්‍රය (Load → VisibleChanged → Activated, Shown post කෙරේ), DataGridView තීරු නැවත පිළියෙල කිරීම, පෙළ පාලකවල Ctrl+Z, system tray හි `NotifyIcon`, `Application.AddMessageFilter`, සහ පෝරමයක් dispose කිරීමේදී එහි පාලක dispose කිරීම.

හිස් මතුපිට දැන් *මනිනු ලැබේ*: baseline ගොනු මඟින් දන්නා no-op methods, අක්‍රිය events සහ ගබඩා-පමණක් properties ස්ථිර කරයි, එබැවින් ඒවාට එකතු කිරීම අහම්බයක් නොව සවිඥානික ක්‍රියාවකි. Stub ප්‍රතිපත්තිය වෙනස් නොවේ — no-op හෝ පෙරනිමි අගය ආපසු දීම, කිසිදා `NotImplementedException` නොවේ.

## තාර්කික ඒකක: ඔබ අනිවාර්යයෙන්ම කළ යුතු එකම දෙය
{:#logical-units-the-one-thing-you-must-do}

2026-10-01 දින `ClientRectangle`, `ClientSize` සහ paint canvas (`OnPaint`, `Paint`, `e.ClipRectangle`, `e.Canvas`) **තාර්කික ඒකක (logical units)** බවට පත් විය; එය `Width`/`Height`/`Bounds` සහ `MouseEventArgs` සමඟ ගැළපේ. Framework එක ඔබ වෙනුවෙන් canvas එක display එකට පරිමාණනය කරයි.

**අභිරුචි පාලකයක් `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` call කළේ නම්, එය ඉවත් කරන්න** — දැන් ඇඳීම දෙවරක් පරිමාණනය වේ. උපාංග පික්සල (device pixels) තවමත් `Scaled*` පවුල (`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling` සහ `LogicalToDeviceUnits` හරහා ලබා ගත හැකිය. එකම ව්‍යතිරේකය owner-draw events (`DrawItem`, `DrawNode`, `CellPainting`) වන අතර, ඒවා තවමත් ඔබට උපාංග-පික්සල සීමා ලබා දෙයි. පැරණි හැසිරීම මත රඳා පවතින ඕනෑම දෙයක් අල්ලා ගැනීමට ඔබේ පරීක්ෂණ `MF_HEADLESS_SCALE=2` සමඟ ධාවනය කරන්න.

## Browser සහ mobile
{:#browser-and-mobile}

`net10.0-browser`, `-android` සහ `-ios` මත Avalonia backend එක `CanRunModalLoop = false` වාර්තා කරයි, තවද අවහිර කරන calls — `Form.ShowDialog`, `MessageBox.Show`, file pickers, `TaskDialog.ShowDialog`, `VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show` — දැන් එල්ලී සිටිනවා වෙනුවට, කිසිවක් පෙන්වීමට *පෙර* async සහෝදර method එක නම් කරමින් `PlatformNotSupportedException` විසි කරයි. Async ආකාර (`ShowDialogAsync`, `MessageBox.ShowAsync`, `FileDialog.ShowDialogAsync`, …) සෑම ධාරකයකම ක්‍රියා කරයි, එබැවින් සම්මත රටාව වන්නේ `await` සහිත `async void` handler එකකි. මූලික package එකේ ඇති Roslyn analyzer එකක් මේවා කලින්ම සොයා ගනී — `MFB001` අවහිර කරන modal call, `MFB002` Task එකක් මත සමමුහුර්ත රැඳී සිටීම, `MFB003` `Thread.Sleep`, එක් එක් සඳහා code fix එකක් සමඟ — browser TFMs සඳහා හෝ `.editorconfig` හි `majorsilence_forms.browser_target = true` සමඟ සක්‍රිය වේ.

Browser ඉලක්කය canvas එක අසලම **ප්‍රවේශ්‍යතා DOM (accessibility DOM)** එකක් ද තබා ගනී: framework එකේම ස්වයංක්‍රීයකරණ ගසයෙන් (automation tree) ගොඩනගන, ARIA role, නම, තත්ත්වය සහ සීමා සහිත, එක් පාලකයකට එක් විනිවිද පෙනෙන, click-through element එකක්. තිර කියවන (screen readers), find-in-page සහ DOM-පාදක පරීක්ෂණ මෙවලම්වලට දැන් UI එක දැකිය හැකිය.

Android සහ iOS මත `TextBox` focus වූ විට තිරයේ keyboard එක මතු වේ, `TextBoxBase.InputKind` keyboard වර්ගය තෝරයි, safe-area insets `Form.SafeAreaPadding` හරහා යෙදේ, සහ `WindowBase.BackRequested` Android back බොත්තම හසුරුවයි. අවංක තත්ත්වය: Android හි මූලික සැබෑ-උපාංග පරීක්ෂාවක් සිදු කර ඇත (boot, taps, render scaling, touch scroll දෘඩාංග මත තහවුරු කර ඇත); keyboard, safe-area සහ භ්‍රමණය unit-test කර ඇත්තේ පමණි. iOS CI සැබෑ head එක compile කර simulator smoke check එකක දියත් කරයි, නමුත් කිසිවෙකු එය අන්තර්ක්‍රියාකාරීව ධාවනය කර නැති අතර job එක තවමත් `continue-on-error` වේ.

දුරකථන-ශෛලියේ පිරිසැලසුම් පාලක ද ඒ සමඟම පැමිණියේය: `StackPanel`, `Card`, `RichListBox` (බහු-පේළි සැකිලිගත පේළි) සහ `NavigationHost` (back බොත්තමක් සහිත පිටු තොගයක්).

## CSS තේමා සහ Theme Studio
{:#css-theming-and-theme-studio}

තේමා දැන් දැඩි, ලේඛනගත CSS උප කුලකයක් ලෙස ලිවිය හැකිය: `@theme "Ocean" extends Dark;`, එක් `Theme` property එකකට එක් `:root` token එක බැගින්, `Button:hover { … }` වැනි පාලක-වර්ග නීති, `Type::part` හරහා කොටස්. Parser එක කිසිදා නිහඬව අසාර්ථක නොවේ — `ThemeStyleSheet.Parse` diagnostics එකතු කරයි. `Theme.LoadFromCssFile` සමඟ, හෝ `Theme.RegisterThemeCssFromFile` + `Theme.ApplyTheme ("Ocean")` සමඟ පූරණය කරන්න; `Theme.ExportCss` සමඟ අපනයනය කරන්න. Telerik compat ස්තරය ඇතුළුව සෑම පාලකයකටම selector එකක් ඇති අතර, පැරණි `<Theme>` XML තවමත් ක්‍රියා කරයි.

සහායක packages දෙකක් *එකම* sheet එක වෙනත් ධාරකවලට යොදයි: `Majorsilence.Forms.Theming.WinForms` සැබෑ `System.Windows.Forms` පාලක නැවත හැඩගන්වයි (Windows පමණි) සහ `Majorsilence.Forms.Theming.Avalonia` native Avalonia Fluent පාලක නැවත හැඩගන්වයි, එබැවින් එක් CSS ගොනුවකට මිශ්‍ර සංක්‍රමණ යෙදුමකට තේමාවක් දිය හැකිය. `samples/ThemeStudio` යනු පෙරදසුන සහ diagnostics සහිත සජීවී සංස්කාරකයකි; පෙර-ගොඩනගන ලද binaries GitHub Releases වෙත අමුණා ඇත.

## MVVM, Essentials, සජීවීකරණය
{:#mvvm-essentials-animation}

`Majorsilence.Forms.Mvvm` යනු `INotifyPropertyChanged` සහ `ICommand` මත trim- සහ AOT-ආරක්ෂිත සම්බන්ධ කිරීමකි; reflection නැත, toolkit පරායත්තතාවයක් නැත: `viewModel.Observe (nameof (VM.Count), vm => vm.Count, …)`, ද්වි-මාර්ග `BindText`/`BindChecked`/`BindSelectedIndex`/`BindValue`, `BindCommand`, සහ ඒ සියල්ල dispose කිරීමට `BindingScope` එකක්. එය CommunityToolkit.Mvvm සමඟ එකට ක්‍රියා කරයි.

`Majorsilence.Forms.Essentials` වේදිකාවට-විශේෂිත හැකියාවන් core එකෙන් පිටත තබා ගනී: `SecureStorage`, `Speech` text-to-speech, `Launcher.OpenAsync` (http/https/mailto/tel/sms) සහ `FileSystem.OpenAppPackageFileAsync`. සියල්ල no-op එකකට පහත් වේ; `IsSupported` පරීක්ෂා කරන්න.

`control.RequestAnimationFrame` සහ `Majorsilence.Forms.Animation` (`Tween<T>`, `Easing`, `Animator`) Avalonia මත display-සමපාත සජීවීකරණයක් ද Headless මත අතින් පාලනය කරන ඔරලෝසුවක් ද ලබා දෙයි.

## මෙවලම්
{:#tooling}

- MCP server එක ප්‍රකාශිත dotnet tool එකකි: `dotnet tool install -g Majorsilence.Forms.Mcp`, ඉන්පසු `claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444`. එය ඔබේ යෙදුමේ `WebDriverServer` සමඟ සන්නිවේදනය කරමින් `ui_snapshot`, `ui_find`, `ui_click`, `ui_type`, `ui_wait_for` සහ `ui_screenshot` නිරාවරණය කරයි.
- `samples/AutomationTarget` යනු මෙවලම් ඉගෙනීම සඳහා හිතාමතාම අපහසු කළ කුඩා යෙදුමකි (clicks ප්‍රතික්ෂේප කරන පාලක, එකක් නම් නොකළ). අභිරුචි-ලෙස අඳින පාලක `IAutomationStateProvider` හරහා අගය සහ තත්ත්වය ප්‍රකාශ කරයි.
- සංක්‍රමණ මෙවලම (migrator) දැන් dotnet tool එකක් ලෙස **පමණක්** නිකුත් වේ (`dotnet tool install -g Majorsilence.Forms.Migrator`); ස්වයං-අන්තර්ගත binaries තවදුරටත් නිකුතුවලට අමුණන්නේ නැත. නව switches: `--map`, `--dual-build`, `--strict`, `--dry-run --diff`.
- `Majorsilence.Forms.WinFormsShims.Compat` යනු Majorsilence.Forms මඟින් සහාය දක්වන `System.Windows.Forms` සහ `System.Drawing` namespaces නිකුත් කරන සංකල්ප-සාධන (proof-of-concept) source generator එකකි, එබැවින් වෙනස් නොකළ WinForms මූලාශ්‍ර — `Designer.cs` ඇතුළුව — compile වේ. පොදු API එක WinForms වෙත type කර ඇති පාලක පුස්තකාල සඳහා. PoC තත්ත්වය; `samples/WinFormsCompatDemo` බලන්න.

## උත්ශ්‍රේණි කිරීමේ සටහන්
{:#upgrade-notes}

- **26.9.0** ස්ථිර කරන්න. ව්‍යාපෘතිය තවමත් බීටා අවධියේ ඇති අතර තවමත් දෘශ්‍ය designer එකක් නැත.
- අභිරුචි paint කේතයේ ඇති ඕනෑම `ScaleTransform (e.Scaling, e.Scaling)` ඉවත් කරන්න (ඉහත බලන්න).
- සැකිලි package id එක `Majorsilence.Forms.Templates` වන අතර, `dotnet new install Majorsilence.Forms.Templates` සමඟ ස්ථාපනය කෙරේ. `dotnet new majorsilenceforms` දැන් බෙදාගත් UI පුස්තකාලයක් සහ desktop head එකක් සහිත solution එකක් සකසයි; `--IncludeAndroid`, `--IncludeiOS` සහ `--IncludeWasm` heads එක් කරයි.
- බිඳ දමන වෙනස්කම් (breaking changes) `MIGRATION.md` හි ලැයිස්තුගත කර ඇත: `SplitContainer.Orientation`, `TreeViewDrawMode.OwnerDrawContent`, event delegate types දැන් WinForms සමඟ ගැළපේ, සහ gradient/hatch brushes GDI+ සමඟ ගැළපෙන පරිදි මාරු කර ඇත.
- Browser, Android සහ iOS මත, අවහිර කරන සංවාද කවුළු calls ඒවායේ async සහෝදරයන් සමඟ ප්‍රතිස්ථාපනය කරන්න; ඒවා සොයා ගැනීමට `MFB001`–`MFB003` ට ඉඩ දෙන්න.

## වැඩිදුර කියවීමට
{:#where-to-read-more}

- [Platform backends]({{ '/si/backends/' | relative_url }}) සහ
  [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md)
- [Getting started]({{ '/si/getting-started/' | relative_url }}) සහ
  [සංක්‍රමණය (Migration)]({{ '/si/migration/' | relative_url }}) /
  [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)
- [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md),
  [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md),
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md),
  [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)
- [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md)
- [ස්වයංක්‍රීයකරණය (Automation)]({{ '/si/automation/' | relative_url }}) සහ
  [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md)
- [නිදසුන් (Samples)]({{ '/si/samples/' | relative_url }})
