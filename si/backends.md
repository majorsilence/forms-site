---
layout: docs
lang: si
title: වේදිකා backend
subtitle: එක් විදැහුම්කරණ හරයක්, මාරු කළ හැකි ධාරක හතක්.
seo_title: "වේදිකා backend — Avalonia, Uno, GTK 4, Terminal, WinForms, WPF හෝ Headless මත WinForms"
description: >-
  බහු-වේදිකා WinForms යෙදුමක් Avalonia, Uno Platform, GTK 4, terminal එකක්, සැබෑ WinForms හෝ WPF
  කවුළු, හෝ headless Skia පෘෂ්ඨයක් මත ධාරණය කරන ආකාරය — backend සන්ධිය (seam), තාර්කික පික්සල,
  trimming, WebAssembly, ජංගම උපාංග සහ ධාරක යෙදුමක කාවැද්දීම.
keywords:
  - winforms avalonia
  - winforms uno platform
  - winforms gtk4 linux
  - winforms terminal
  - winforms webassembly browser
  - majorsilence.forms wpf backend
  - majorsilence.forms winforms backend
  - headless winforms rendering
  - skiasharp ui backend
priority: "0.8"
permalink: /si/backends/
---

Majorsilence.Forms **තමන්ගේම සියලු ඇඳීම්** SkiaSharp සමඟ සිදු කරයි. සෑම පාලකයක්ම (control)
`SKSurface`/`SKCanvas` එකකට අඳියි; ඊට යටින් ඇති කවුළු මෙවලම් කට්ටලය (toolkit) හුදෙක් *ධාරකයක්* (host) පමණි — එය
ස්වදේශීය (native) කවුළු සාදයි, පණිවිඩ ලූපය ධාවනය කරයි, ආදානය ලබා දෙයි, සහ Skia පෘෂ්ඨය තිරයට ඉදිරිපත් කරයි.

එම ධාරකය කුඩා සන්ධියක් (seam) පිටුපස වියුක්ත කර ඇති නිසා, එකම යෙදුම් කේතය backend (පසුබිම් ස්තරය) හතෙන්
ඕනෑම එකක් මත ධාවනය වේ:

| පැකේජය | ධාරකය | එය කුමක් සඳහාද | වේදිකා | ඔබ එය තෝරා ගන්නා ආකාරය |
|---|---|---|---|---|
| `Majorsilence.Forms.Avalonia` | Avalonia 12 | පෙරනිමිය. සැබෑ desktop කවුළු; Avalonia හි වේදිකා පැකේජ හරහා browser, Android සහ iOS ද. සැබෑ `TryGetPlatformHandle` (HWND / NSWindow / XID) ඇති එකම බහු-වේදිකා backend එක. | Windows, macOS, Linux; WebAssembly; Android සහ iOS (opt-in) | ස්වයංක්‍රීය — පැකේජය යොමු කර `Application.Run (new MainForm ())` අමතන්න. |
| `Majorsilence.Forms.Uno` | Uno Platform Skia (Uno.WinUI 6.5) | Uno app head එකක් තුළ `SKXamlCanvas` හරහා ඉදිරිපත් කරයි. | Desktop (macOS මත තහවුරු කර ඇත); Uno iOS/Android/WASM ද ඉලක්ක කරයි | Uno යෙදුමේ `OnLaunched` වෙතින් `Platform.Backend = new UnoPlatformBackend ()`. |
| `Majorsilence.Forms.Gtk4` | gir.core හරහා GTK 4 (`GirCore.Gtk-4.0 0.8.1`) | GLib ප්‍රධාන ලූපය මත සෑම පෝරමයකටම සැබෑ `Gtk.Window` එකක්. Linux ප්‍රමුඛ. දෙපැත්තටම කාවැද්දීම, "airspace" ගැටලුවක් නැති `NativeControlHost`, WebKitGTK 6.0 හරහා `WebBrowser`. | Linux (Wayland/X11, Wayland මත තහවුරු කර ඇත); GTK 4 ස්ථාපිත Windows/macOS | `Gtk4Application.Use ();` ඉන්පසු `Application.Run`. |
| `Majorsilence.Forms.Terminal` | Console / ANSI | පෝරමයක් terminal එකක තනි-දර්ශන ධාරකයක් ලෙස ධාවනය කරයි (පෝරමය තිරය පුරා පිරේ, title bar නැත). සැබෑ පික්සල විභේදනයෙන් Kitty graphics හෝ Sixel, නැතහොත් Unicode block elements. | ඕනෑම terminal එකක්; xterm සහ WezTerm හි තහවුරු කර ඇත | `TerminalApplication.Use ();` ඉන්පසු `Application.Run`. |
| `Majorsilence.Forms.WinForms` | සැබෑ `System.Windows.Forms` | Windows-පමණක් *සංක්‍රමණ* backend එක: Win32 pump මත සැබෑ WinForms කවුළු, GDI bitmap එකක් හරහා Skia ඉදිරිපත් කෙරේ. Majorsilence.Forms වරකට එක් පාලකයක් බැගින් භාවිතයට ගන්න. `net48` ද ඉලක්ක කරයි. | Windows | `Platform.Backend = new WinFormsPlatformBackend ()` — නැතහොත් WinForms පෝරමයකට `MajorsilenceFormsPresenter` එකක් දමන්න; එය තමන්වම ස්ථාපනය කරයි. |
| `Majorsilence.Forms.Wpf` | WPF `Window` | Windows-පමණක් සංක්‍රමණ backend එක, WinForms එකේම හැඩය: `Dispatcher` ලූපය මත සැබෑ WPF `Window` එකක්, `WriteableBitmap` එකක් හරහා Skia ඉදිරිපත් කෙරේ. `net48` ද ඉලක්ක කරයි. | Windows | `Platform.Backend = new WpfPlatformBackend ()`. |
| `Majorsilence.Forms.Headless` | පරායත්තතා රහිත SkiaSharp | පරීක්ෂණ, CI සහ server සඳහා offscreen විදැහුම්කරණය; පිටපත් කිරීමට යොමු backend එක. | .NET ධාවනය වන ඕනෑම තැනක; display එකක් අවශ්‍ය නැත | `HeadlessRenderer.Use ()`. |

**හරය වන `Majorsilence.Forms` assembly එක කිසිදු කවුළු toolkit එකක් යොමු නොකරයි** — SkiaSharp පමණි.
Backend යනු හරය මත රඳා පවතින සහ එහි අභ්‍යන්තර render/input යාන්ත්‍රණයට ප්‍රවේශ වන වෙනම assembly වේ.

### ඉලක්ක framework
{:#target-frameworks}

හරය (`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`)
`net8.0`, `net10.0` **සහ `netstandard2.0`** බහු-ඉලක්ක කරයි. `Majorsilence.Forms.WinForms` සහ
`Majorsilence.Forms.Wpf` එක එකක් `net8.0-windows` / `net10.0-windows` සමඟ **`net48`** පේළියක් එක් කරයි
(හරයේ `netstandard2.0` build එක සමඟ යුගල කර), එබැවින් සම්භාව්‍ය .NET Framework 4.8 WinForms හෝ WPF යෙදුමකට
අදම Majorsilence.Forms පාලක ධාරණය කළ හැක. `net48` පේළි CI හි සෑම OS එකකම compile වේ; ඒවා *ධාවනය* කිරීමට
පමණක් Windows අවශ්‍ය වේ.

බහු-වේදිකා backend (Avalonia, Uno, GTK 4, Terminal, Headless) `net8.0`+ ඉලක්ක කරන අතර `-windows` TFM
උපසර්ගයක් අවශ්‍ය නොවේ. `netstandard2.0` backend එකක් නැති නිසා, Windows නොවන .NET Framework runtime එකක
යෙදුමකට පාලක යොමු කළ හැකි නමුත් කවුළුවක් ධාරණය කළ නොහැක.

## සන්ධිය
{:#the-seam}

ධාරකයක් සැපයිය යුතු සියල්ල `Majorsilence.Forms.Backends` හි ඇති අතුරුමුහුණත් දෙකක් මගින් නිර්වචනය කෙරේ:

- **`IPlatformBackend`** — යෙදුම් සහ ක්‍රියාවලි සේවා: dispatcher (`Post`/`Invoke`), timers, clipboard,
  තිර, `CreateWindow`, සහ modal ලූපය.
- **`IWindowBackend`** — එක් ස්වදේශීය කවුළුවක්: ස්ථානය/ප්‍රමාණය/පරිමාණනය, show/hide/close, මාතෘකාව, cursor,
  decorations, drag/resize, සහ ස්වදේශීය ගොනු සංවාද කවුළු.

`IWindowBackend` යනු *pull* පැත්තයි. *push* පැත්ත — paint ඉල්ලීම් සහ ස්වදේශීය ආදානය — යනු backend එක හිමිකාර
කවුළුවේ උදාසීන (neutral) ක්‍රම සෘජුවම ඇමතීමයි: `RenderFrame (SKCanvas, physW, physH, scaling)`,
`HandlePointer*`, `HandleKeyDown/Up`, `HandleTextInput`, සහ `OnBackend*` ජීවන චක්‍ර hooks. සන්ධිය හරහා යන
සියලු ඛණ්ඩාංක `System.Drawing` value types සහ Majorsilence.Forms enums වේ — කිසිදු toolkit වර්ගයක් හරයට
කාන්දු නොවේ. විකල්ප හැකියාවන් (`IWebViewFactory`, `INativeControlHostBackend`, `IAudioBackend`,
`IModalLoopSupport`, …) අතුරුමුහුණත් දෙක අසල පවතී; එකක් අත්හරින backend එකක් අනුරූප සිදුවීම් කිසි විටෙක
මතු නොකරයි.

### Backend එකක් තෝරා ගැනීම
{:#selecting-a-backend}

`Majorsilence.Forms.Backends.Platform.Backend` සක්‍රිය `IPlatformBackend` එක රඳවා ගනී. එය සකසා නොමැති නම්,
`Majorsilence.Forms.Avalonia` යොමු කර ඇති විට එය නමින් `AvaloniaPlatformBackend` වෙත විසඳේ — එබැවින් desktop
යෙදුමක් හුදෙක් එම පැකේජය යොමු කර `Application.Run (new MyForm ())` අමතයි. අනෙක් සෑම backend එකක්ම
**පළමු කවුළුව සෑදීමට පෙර** පැහැදිලිවම ස්ථාපනය කළ යුතුය:

```csharp
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
// නැතහොත් සහායක:  Gtk4Application.Use ();   TerminalApplication.Use ();   HeadlessRenderer.Use ();
Application.Run (new MainForm ());
```

### තාර්කික ඒකක සහ උපාංග පික්සල
{:#logical-vs-device-pixels}

යෙදුමක් `Control` මත දකින සියල්ල **තාර්කික ඒකක** (logical units) වලින් වේ — ඕනෑම display පරිමාණනයකදී
එය සකසන සහ නැවත කියවන අංක: `Width`/`Height`/`Location`/`Bounds`, `ClientSize` සහ `ClientRectangle`,
`MouseEventArgs.X/Y`, සහ **paint canvas එක**. `OnPaint`, `Paint` හසුරුවන සහ `e.ClipRectangle` සියල්ල
තාර්කිකයි; framework එක canvas එක display එකට පරිමාණනය කරයි.

```csharp
child.Left = (ClientSize.Width - child.Width) / 2;            // ඕනෑම DPI එකකදී child මැදට කරයි
e.Graphics.DrawRectangle (pen, 0, 0, Width - 1, Height - 1);  // ඕනෑම DPI එකකදී පාලකය වටා රාමුවක් අඳියි
```

**මෙය 2026-10-01 දින වෙනස් විය.** ඊට පෙර `ClientSize`, `ClientRectangle` සහ paint canvas එක උපාංග පික්සල
(device pixels) වූ අතර අභිරුචි පාලකයකට `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` තමන්ම ඇමතීමට සිදු
විය. ඔබ එවැනි ඇමතුමක් එක් කළේ නම්, **එය ඉවත් කරන්න** — දැන් ඇඳීම දෙවරක් පරිමාණනය වේ. උපාංග පික්සල තවමත්
පැහැදිලිව නම් කළ `Scaled*` පවුල (`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling` සහ
`LogicalToDeviceUnits` හරහා ලබා ගත හැක.

එක් ව්‍යතිරේකයක් ඉතිරිව ඇත: **owner-draw සිදුවීම්** (`DrawItem`, `DrawNode`, `DrawListViewItem`, grid එකේ
`CellPainting`, …) තවමත් උපාංග-පික්සල `Bounds` උපාංග-පික්සල `Graphics` එකක් සමඟ ලබා දෙයි. ඒ දෙක එකිනෙක හා
එකඟ වන නමුත් පාලකයේ ඉතිරි කොටස සමඟ එකඟ නොවේ.

පරිමාණන උපකල්පන `MF_HEADLESS_SCALE=2` යටතේ පරීක්ෂා කරන්න (බලන්න
[ස්වයංක්‍රීයකරණය]({{ '/si/automation/' | relative_url }})) — පරිමාණය 1 දී නිවැරදි වී වෙනත් ඕනෑම පරිමාණයකදී
වැරදි වන කේතය සුලබ දෝෂයයි.

### Trimming සහ NativeAOT
{:#trimming-and-nativeaot}

`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Avalonia` සහ
`Majorsilence.Forms.Headless` `IsAotCompatible` සමඟ build වේ, එබැවින් නව trim/AOT අවදානමක් trimmed පාරිභෝගිකයෙකු
නිහඬව බිඳ දමනවා වෙනුවට Release build එක අසාර්ථක කරයි, සහ `tests/Majorsilence.Forms.AotSmoke` CI හි සැබෑ
NativeAOT binary එකක් publish කරයි. Uno, GTK 4, WinForms, WPF සහ Telerik assembly **විශ්ලේෂණය නොකෙරේ** —
ඒවායේ toolkit reflection මත දැඩිව රඳා පවතින අතර AOT සහතිකයක විෂය පථයෙන් පිටත වේ.

**Data binding යනු reflection භාවිත කරන එකම කොටසයි.** `Control.DataBindings` ධාවන වේලාවේදී නමින් properties
සහ `<Property>Changed` සිදුවීම් සොයා ගනී. Framework එක තමන්ගේම පාලකවල bind කළ හැකි යුගල (`Text`/`TextChanged`,
`Checked`, `SelectedIndex`, `Value`) root කරන තමන්ගේම `ILLink.Descriptors.xml` එකක් කාවද්දයි, එබැවින්
**පාලක පැත්තට ඔබෙන් කිසිවක් අවශ්‍ය නැත**. **view-model පැත්ත තවමත් ඔබේ වගකීමයි**: ඔබ bind කරන properties
යෙදුම් ව්‍යාපෘතියේ `TrimmerRootDescriptor` එකකින් root කරන්න, නැතහොත් සාමාන්‍ය කේතයෙන් view model එක සම්බන්ධ
කිරීමෙන් ප්‍රශ්නය මඟහරින්න — reflection-රහිත `Majorsilence.Forms.Mvvm` පැකේජය (`Observe`, `BindText`,
`BindCommand`) කරන්නේ එයයි. අතුරුදහන් වූ හෝ trim වූ member එකක් member එකේ නම සමඟ `DataBindings.Add` හිදී
පැහැදිලිව අසාර්ථක වේ; අතුරුදහන් `Changed` සිදුවීමක් පමණක් නිහඬව එක්-දිශා (one-way) බවට පිරිහේ.
`Label`/`TextBox.Text` ඉක්මවා යන ආවරණය ස්වයංක්‍රීය පරීක්ෂණයකින් අභ්‍යාස නොකෙරේ, එබැවින් එය මත රඳා පැවතීමට
පෙර publish කළ build එකක් පරීක්ෂා කරන්න.

## ධාරක යෙදුමක කාවැද්දීම
{:#embedding-in-a-host-app}

ඉහත සියල්ල උපකල්පනය කරන්නේ ඉහළම මට්ටමේ කවුළුව Majorsilence.Forms සතු බවයි. Avalonia, Uno, WinForms, WPF
සහ GTK 4 backend *ප්‍රතිවිරුද්ධ* දිශාවටද සහාය දක්වයි: Majorsilence.Forms objects තමන්ගේම ස්වදේශීය ඒවා
මෙන් සලකන දැනට පවතින ධාරක යෙදුමක් — එකතු කිරීමක් ලෙස, සුපුරුදු `Form.Show()` ප්‍රවාහයේ කිසිවක් වෙනස් නොකර.

**Majorsilence පාලකයක් ධාරක පාලකයක් බවට පත් වේ**, `MajorsilenceFormsPresenter` (සැබෑ
`Avalonia.Controls.Canvas` / WinUI `Grid` / `System.Windows.Forms.Control` / WPF `Grid` / GTK
`DrawingArea` එකක්) සහ එහි extension methods හරහා. ප්‍රතිඵලය ඕනෑම ස්වදේශීය visual tree එකකට දමන්න:

```csharp
Avalonia.Controls.Control            c = myMfControl.ToAvaloniaControl ();  // Majorsilence.Forms
Microsoft.UI.Xaml.FrameworkElement   c = myMfControl.ToUnoControl ();       // Majorsilence.Forms.Uno
System.Windows.Forms.Control         c = myMfControl.ToWinFormsControl ();  // Majorsilence.Forms.WinForms
System.Windows.FrameworkElement      c = myMfControl.ToWpfElement ();       // Majorsilence.Forms.Wpf
Gtk.Widget                           c = myMfControl.ToGtkWidget ();        // Majorsilence.Forms.Gtk4
```

GTK 4 presenter එක GTK widget එකකින් ව්‍යුත්පන්න වීම වෙනුවට `Widget` property එකක් *නිරාවරණය* කරයි
(gir.core හි GObject subclassing සඳහා අමතර integration පැකේජයක් අවශ්‍ය වේ); අනෙක් සියල්ල එකම හැඩයයි.

**Majorsilence `Form` එකක් ධාරක කවුළුවක් බවට පත් වේ.** `Form` එකක backend කවුළුව එහි constructor එකේදීම
කලින්ම සාදනු ලබන අතර, මෙම backend මත එම object එක දැනටමත් සැබෑ ස්වදේශීය කවුළුවක් *වේ* (Avalonia, WinForms,
WPF, GTK 4) හෝ එකක් *ආවරණය කරයි* (Uno), එබැවින් මේවා එය කෙළින්ම ආපසු ලබා දෙයි:

```csharp
Avalonia.Controls.Window  w = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window  w = myForm.ToUnoWindow ();
System.Windows.Forms.Form w = myForm.ToWinFormsForm ();
System.Windows.Window     w = myForm.ToWpfWindow ();
Gtk.Window                w = myForm.ToGtkWindow ();
```

එතැන් සිට එය පෙන්වීම ධාරකයේ වගකීමයි — එය ප්‍රධාන කවුළුව ලෙස පවරන්න, `Owner` සකසන්න,
`Show()`/`ShowDialog(owner)` අමතන්න. කවුළුව පළමු වරට දෘශ්‍යමාන වන විට, කුමන පැත්තෙන් එය ක්‍රියාත්මක කළත්,
Majorsilence හි තමන්ගේම `Load`/`Shown`/`Application.OpenForms` ගිණුම්කරණය තවමත් ධාවනය වේ.

**Owner සහ modal සම්බන්ධතා backend අනුව වෙනස් වේ.** Avalonia, WinForms සහ GTK 4 ඒවායේ ස්වදේශීය
`Owner`/`ShowDialog(owner)` හරහා සැබෑ OS-මට්ටමේ modal සම්බන්ධතාවක් ලබා දෙයි (GTK: transient-for + modal).
මෙම backend එකේ Uno හට owner සංකල්පයක් නැති නිසා, `ToUnoWindow()` ස්වාධීන ඉහළම මට්ටමේ කවුළුවක් ලබා දෙයි;
Uno යටතේ modal හැසිරීම සඳහා `Form.ShowDialog(parent)` භාවිත කරන්න — එය ස්වදේශීය හිමිකාරිත්වය මත රඳා නොපවතින
Majorsilence හි තමන්ගේම modal ලූපයයි.

සෑම දිශාවක්ම
[`EmbeddingAvalonia`]({{ site.github_url }}/tree/main/samples/EmbeddingAvalonia),
[`EmbeddingUno`]({{ site.github_url }}/tree/main/samples/EmbeddingUno),
[`EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) සහ
[`EmbeddingGtk4`]({{ site.github_url }}/tree/main/samples/EmbeddingGtk4) මගින් පෙන්වා දී ඇත; බලන්න
[නිදසුන්]({{ '/si/samples/' | relative_url }}).

## Avalonia backend
{:#the-avalonia-backend}

පෙරනිමිය, සහ නව desktop යෙදුමකට කිසිදු වින්‍යාසයකින් තොරව ලැබෙන්නේ මෙයයි. Windows/macOS/Linux මත කවුළු
ධාරකය සැබෑ `Avalonia.Controls.Window` එකක් *වේ*, `TryGetPlatformHandle` ක්‍රියාත්මක කරන එකම බහු-වේදිකා
backend එක මෙය වන්නේත් (බලන්න [ස්වදේශීය interop]({{ '/si/native-interop/' | relative_url }})),
`ToAvaloniaWindow()` ධාරක යෙදුමකට සැබෑ OS-මට්ටමේ owner/modal අර්ථකථන ලබා දෙන්නේත් එබැවිනි.

එය desktop-පමණක් නොවේ. ව්‍යාපෘතිය බහු-ඉලක්ක කරයි:

| TFM | Build වේ | Avalonia වේදිකා පැකේජය |
|---|---|---|
| `net8.0`, `net10.0` | සැමවිටම | `Avalonia.Desktop` + `Avalonia.Controls.WebView` |
| `net10.0-browser` | සැමවිටම | `Avalonia.Browser` |
| `net10.0-android` | Opt-in: `-p:EnableAndroidTarget=true` (`android` workload අවශ්‍යයි) | `Avalonia.Android` |
| `net10.0-ios` | Opt-in: `-p:EnableIOSTarget=true` (`ios` workload අවශ්‍යයි, macOS පමණි) | `Avalonia.iOS` |

wasm-tools අවශ්‍ය වන්නේ *publish* කිරීමට පමණක් නිසා browser පේළිය කොන්දේසි රහිතයි. Android සහ iOS
opt-in වන්නේ එම පේළිය compile කිරීමට පවා ඒවායේ workload අවශ්‍ය නිසාය, සහ යන්ත්‍රයකට බොහෝ විට එක් workload එකක්
අනෙක නොමැතිව ඇති නිසා දොරටු දෙක වෙන් වෙන්ව ඇත.

### තනි-දර්ශන වේදිකා (browser, Android, iOS)
{:#single-view-platforms-browser-android-ios}

තුනෙන් එකකටවත් OS කවුළු කළමනාකරුවෙකු නැත; එක් එක් යෙදුමකට/tab එකකට/තිරයකට හරියටම එක් view එකක් පමණක්
ලබා දේ. ඒවා එක් ධාරකයක් බෙදා ගන්නා අතර එහි **සෑම** Majorsilence.Forms කවුළුවක්ම Avalonia `Window` එකක්
වෙනුවට `Canvas` එකකි: popup නොවන පළමු පෝරමය viewport එක පුරා පිරෙන අතර, popups, menus සහ අමතර ඉහළම
මට්ටමේ පෝරම එහි නිරපේක්ෂව ස්ථානගත කළ ළමා අංග වේ. ආරම්භය ධාරකය විසින් මෙහෙයවනු ලබන අතර **factory** එකක්
ගනී, මන්ද backend එක ආරම්භ කිරීමට පෙර පෝරමය පැවතිය යුතු නොවන බැවිනි:

```csharp
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());  // browser
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());             // OnCreate වෙතින්
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());                 // FinishedLaunching වෙතින්
```

**එහි ක්‍රියා නොකරන දේ**, බොහෝ දුරට අපේක්ෂිත වැඩ නොව ස්වභාවයෙන්ම පවතින සීමා:

- **කවුළු chrome නැත.** `Topmost`, පද්ධති decorations, `SetIcon`, `Min`/`MaximumSize`, `CanResize`,
  `ShowInTaskbar`, `WindowState` සහ move/resize drags no-ops (කිසිවක් නොකරයි) වේ. `Title` ද අද no-op එකකි,
  නමුත් එය ඉදිරියට කළ යුතු වැඩකි.
- **`ShowDialog` OS-modal නොවේ** — parent-disable සන්ධියට ඉහළින් පවතින නිසා එය තවමත් modal ලෙස *හැසිරේ*;
  ද්විතීයික කවුළුවක් view එකේ ඉහළ-වම් කෙළවරේ විවෘත වේ. තවද **අවහිර කරන (blocking)** `ShowDialog` තුනෙන්
  කිසිවක් මත කිසිසේත් ක්‍රියා නොකරයි — බලන්න [Browser threading](#browser-threading).
- **WebView නැත.** එකක් අවශ්‍ය compat පාලක (`RadPdfViewer`, `RadRichTextEditor`) ඒවායේ සරල-viewer මාර්ග
  වෙත පසුබසී. Browser හට ස්වදේශීය webview එකක් නැත; Android සහ iOS හට ඇත, එබැවින් එම දෙක දැඩි සීමාවක් නොව
  කල් දැමූ වැඩකි.
- **වෙනත් යෙදුමකට focus අහිමි වන විට popup ඉවත් කිරීම ක්‍රියාත්මක නොවේ**; යෙදුම තුළ වෙනත් තැනක click කිරීම
  තවමත් popups ඉවත් කරයි.

**එහි ක්‍රියා කරන දේ** (ජංගම සමානතාව):

- **තිරය මත යතුරු පුවරුව.** `TextBox` එකකට focus කිරීම soft keyboard එක මතු කරන අතර blur වූ විට එය ඉවත්
  කරයි. `TextBoxBase.InputKind` (`Number`, `Email`, `Url`, `Phone`) පිරිසැලසුම තෝරයි; masked සහ multiline
  boxes වලට ගැළපෙන keyboard එක ලැබේ. Desktop backend එය නොසලකා හරියි.
- **Safe-area insets.** `Form.SafeAreaPadding` ස්වයංක්‍රීයව යොදනු ලබන නිසා, docked සහ anchored පාලක status
  bar, notch සහ home indicator වලින් ඈත්ව පවතී; keyboard එක විවෘත වූ විට, focus වූ ක්ෂේත්‍රය දර්ශනයට scroll
  කෙරේ.
- **ජීවන චක්‍රය, back බොත්තම, size classes.** `Application.Suspended`/`Resumed`,
  `WindowBase.BackRequested` (සැකිල්ලේ `MainActivity` Android back බොත්තම යොමු කරයි),
  `Form.SizeClass`/`SizeClassChanged`, Android මත touch scroll bars, සහ
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md) හි ඇති දුරකථන-ශෛලීය
  පිරිසැලසුම් පාලක (`StackPanel`, `Card`, `RichListBox`, `NavigationHost`).

**පරිණතභාවය තුන අතර තියුණු ලෙස වෙනස් වේ.** තුනම CI හි compile වන නමුත්, headless පරීක්ෂණ කට්ටලය අභ්‍යාස
කරන්නේ බෙදාගත් හරය මිස සැබෑ head එකක් නොවේ.

- **Browser** සම්පූර්ණ ගැලරිය ධාවනය කරයි — [සජීවී demo එක]({{ '/gallery/' | relative_url }}) එයමයි — සහ
  එහි modal සහ ප්‍රවේශ්‍යතා පරීක්ෂණ සෑම CI build එකකම headless Chrome තුළ ධාවනය වේ. මාර්ගය තවමත් නවකයි.
- **Android** හි මූලික සැබෑ-උපාංග පරීක්ෂාවක් සිදු කර ඇත: ගැලරිය boot වන අතර, tap hit-testing, render
  පරිමාණනය සහ touch scroll/flick දෘඪාංග මත තහවුරු කර ඇත. තිරය මත යතුරු පුවරුව, safe-area insets සහ
  භ්‍රමණය Headless මත unit-test කර ඇති නමුත් තවමත් උපාංගයක අභ්‍යාස කර නැත.
- **iOS** compile වන අතර, CI එය smoke check එකක් ලෙස simulator එකක දියත් කරයි, නමුත් කිසිවෙකු එය simulator
  එකක හෝ උපාංගයක අන්තර්ක්‍රියාකාරීව ධාවනය කර නැත; `ios` job එක තවමත් `continue-on-error` වේ.

### Browser තුළ ධාවනය (WebAssembly)
{:#running-in-the-browser-webassembly}

වෙනම WASM පැකේජයක් නැත — `Majorsilence.Forms.Avalonia` හි `net10.0-browser` පේළිය Avalonia 12 හි
`Avalonia.Browser` වේදිකාව මත build වේ (WebGL2/Emscripten, desktop හි ඇති එකම Skia renderer එක). අවම
browser head එකක් `Microsoft.NET.Sdk.WebAssembly` ව්‍යාපෘතියකින් `Majorsilence.Forms.Avalonia` +
`Avalonia.Browser` යොමු කරයි — බලන්න
[`samples/Gallery.Wasm`]({{ site.github_url }}/tree/main/samples/Gallery.Wasm), නැතහොත්
`dotnet new majorsilenceforms --IncludeWasm` මගින් එකක් සාදන්න.

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

`out/wwwroot` ඕනෑම static file server එකකින් serve කරන්න — `dotnet run` WebAssembly SDK ව්‍යාපෘතියක් serve
නොකරයි. CI මෙම bundle එක සෑම PR එකකම publish කර සෑම release එකකටම අමුණයි.

Browser තුළ සැබෑ ගොනු පද්ධතියක් නැත. එකක් පූර්ව-පූරණය කිරීමේ සුපුරුදු item එක වන
`WasmFilesToIncludeInFileSystem`, `Microsoft.NET.Sdk.WebAssembly` යටතේ නිහඬව නොසලකා හරිනු ලැබේ, ගැලරියේම
icons තවමත් browser (සහ Android/iOS) builds වල අතුරුදහන් වී ඇත්තේ එබැවිනි. එවැනි assets ඒ වෙනුවට
`EmbeddedResource` ලෙස යවන්න.

### Browser threading
{:#browser-threading}

Browser තුළ, .NET ධාවනය වන්නේ පිටුවේ එකම JavaScript thread එක මතය. ආපසු නොඑන ඇමතුමක් එය ආපසු පැමිණීමට ඉඩ
දෙන ආදානය, timers සහ painting ද නවත්වයි — එබැවින් කැදැලි (nested) modal ලූපයකට ධාවනය විය නොහැකි අතර,
Avalonia backend එක `net10.0-browser` මත `CanRunModalLoop = false` වාර්තා කරයි. **Android සහ iOS මතද එයම
සත්‍යයි**, වෙනත් හේතුවක් නිසා: Avalonia හි dispatcher එකට එහි කැදැලි frame එකක් push කළ නොහැක (Android 15
emulator එකක සහ iPhone 17 Pro simulator එකක මනින ලදී).

සෑම අවහිර කරන modal ප්‍රවේශ ලක්ෂ්‍යයක්ම **කිසිවක් පෙන්වීමට පෙර** එම flag එක පරීක්ෂා කර එහි async නිවුන් එක
නම් කරමින් `PlatformNotSupportedException` විසි කරයි, එබැවින් ප්‍රතික්ෂේප වූ ඇමතුමක් කිසිදු සංවාද කවුළුවක්
විවෘතව හෝ කිසිදු owner එකක් අක්‍රිය කර තබන්නේ නැත. සෑම modal API එකකටම await කළ හැකි ආකාරයක් ඇති අතර, එක් එක්
ආකාරය සෑම backend එකකම ක්‍රියා කරයි:

| අවහිර කරන | Await කළ හැකි |
|---|---|
| `Form.ShowDialog (…)` | `Form.ShowDialogAsync (…)` — එකම owner overloads |
| `MessageBox.Show (…)` | `MessageBox.ShowAsync (…)` |
| `OpenFileDialog`/`SaveFileDialog`/`FolderBrowserDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `TaskDialog.ShowDialog (…)` | `TaskDialog.ShowDialogAsync (…)` |
| `ColorDialog`/`FontDialog`/`PrintPreviewDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `CommonDialog.ShowDialog` (ඔබේම subclass එක) | `CommonDialog.ShowDialogAsync`; `RunDialogAsync` override කරන්න |
| `VbInteraction.MsgBox`/`InputBox` | `VbInteraction.MsgBoxAsync`/`InputBoxAsync` |
| `RadMessageBox.Show (…)` (Telerik compat) | `RadMessageBox.ShowAsync (…)` |

සුපුරුදු හැඩය `async void` සිදුවීම් හසුරුවනයකි (event handler) — `async void` සම්මත රටාව වන එකම තැන:

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

එම නීතියම `task.Result`, `.Wait ()`, `GetAwaiter ().GetResult ()` සහ `Thread.Sleep` ද ආවරණය කරයි —
`await` සහ `await Task.Delay` භාවිත කරන්න.

**Analyzer එක.** හරය වන `Majorsilence.Forms` පැකේජය code fixes සහිත Roslyn analyzer එකක් රැගෙන යයි:
`MFB001` අවහිර කරන modal ඇමතුමක් (එහි await කළ හැකි නිවුන් එක නම් කරමින්), `MFB002` task එකක් මත සමමුහුර්ත
රැඳී සිටීමක්, `MFB003` `Thread.Sleep`. කේතය browser කේතය නොවේ නම් එය නිහඬයි — `net*-browser` TFM එකක්,
`<SupportedPlatform Include="browser" />` ප්‍රකාශ කරන library එකක්, හෝ browser head එකක් යොමු කරන බෙදාගත් UI
library එකක් සඳහා පැහැදිලි opt-in එකක්:

```ini
# බෙදාගත් UI library එක අසල .editorconfig
[*.cs]
majorsilence_forms.browser_target = true
```

Analyzer එක browser-පමණි; Android හෝ iOS කේතයේ අවහිර කරන ඇමතුමක් build වේලාවේදී සලකුණු නොකෙරෙන අතර ධාවන
වේලාවේදී එකම පණිවිඩය සමඟ අසාර්ථක වේ. JSPI හෝ CoreCLR browser runtime එක කවදා හෝ කැදැලි ලූපයකට ධාවනය වීමට
ඉඩ දෙන්නේ නම්, නැවත සක්‍රිය කළ යුතු එකම switch එක `CanRunModalLoop` වේ.

### ප්‍රවේශ්‍යතා DOM (browser)
{:#accessibility-dom-browser}

තනි canvas එකක් තිර කියවනයකට (screen reader), find-in-page හෝ DOM පරීක්ෂණ මෙවලමකට නොපෙනේ. එබැවින් browser
ඉලක්කය මත Avalonia backend එක **canvas එක අසල විවෘත පෝරමවල DOM පිළිබිඹුවක්** තබා ගනී: එක් එක් පාලකයට එහි
ARIA role, නම, තත්ත්වය සහ සීමා රැගෙන යන විනිවිද පෙනෙන, click-through අංගයක්, framework එකේම ස්වයංක්‍රීයකරණ
ගසයෙන් (automation tree) ගොඩනඟන ලද — Windows UI Automation bridge සහ WebDriver server කියවන එම ගසයම, එබැවින්
පරීක්ෂණයකට සොයා ගත හැකි ඕනෑම දෙයක් තිර කියවනයකටද සොයා ගත හැක. එය paint කිරීමෙන් පසු උපරිම වශයෙන් සෑම
100 ms කට වරක් නැවත සමමුහුර්ත වන අතර වෙනස් වූ දේ පමණක් යවයි; popups ඒවා විවෘත වූ කවුළුව තුළ පිළිබිඹු කෙරේ;
live regions දෙකක් සංවාද කවුළු, message boxes, status text සහ `LiveSetting` සහිත labels නිවේදනය කරයි.
පරීක්ෂණ මෙවලම් role සහ නම මගින් හෝ `[data-mf-automation-id=…]` මගින් ස්ථානගත කර අංගයේ bounding box එකේ
click කරයි, මන්ද ආදානය තවමත් canvas එකට අයත් බැවිනි.

අවංක අවවාදයක්: එය තහවුරු කළේ headless Chrome තුළ DOM කියවීමෙන් සහ live regions පටිගත කිරීමෙනි.
**සැබෑ තිර කියවනයක් සමඟ තවමත් කිසිවක් උත්සාහ කර නැත.** `Majorsilence.Forms.Browser.DisableAccessibilityDom`
AppContext switch එකෙන් opt out කරන්න.

## Headless backend
{:#the-headless-backend}

හැකි සරලම backend එක සහ පිටපත් කිරීමට යොමු ක්‍රියාත්මක කිරීම: work-queue පණිවිඩ ලූපයක්, මතකය තුළ
clipboard එකක්, අතථ්‍ය තිරයක්, සහ `SKSurface` එකකට offscreen විදැහුම්කරණය. `HeadlessRenderer.Use ()` එය
ස්ථාපනය කර ඇමතුම් thread එක UI thread එක බවට පත් කරයි; `CapturePng (window, w, h)` PNG වෙත විදැහුම් කරයි;
`Click`/`MouseDown`/`KeyDown`/`TextInput` සහායක සැබෑ backend එකක් භාවිත කරන එම උදාසීන `Handle*` මාර්ගයම
මෙහෙයවයි. එයට display එකක් අවශ්‍ය නොවන නිසා, එය unit tests බලගන්වන අතර CI සහ pixel-diff පරීක්ෂණ සඳහා
ControlGallery විදැහුම් කරයි:

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

මෙහි සජීවිකරණය නිර්ණායකයි (deterministic): `control.RequestAnimationFrame (…)` display timer එකක් වෙනුවට
අතින් මෙහෙයවන ඔරලෝසුවක් වන `HeadlessRenderer.AnimationClock.Step (n)` මගින් මෙහෙයවනු ලැබේ. බලන්න
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md).

## Uno backend
{:#the-uno-backend}

Uno Platform හි Skia ඉලක්කය මත සන්ධිය ක්‍රියාත්මක කරයි: `UnoPlatformBackend` `DispatcherQueue` සහ WinUI
clipboard මෙහෙයවන අතර, `UnoWindowHost` `SKXamlCanvas` එකක් ධාරණය කර pointer/key/character සිදුවීම් උදාසීන
ආදාන මාර්ගයට පරිවර්තනය කරයි. එයට Uno *app head* එකක් අවශ්‍යයි — බලන්න
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — සහ macOS මත සම්පූර්ණ ගැලරිය
දියත් කර විදැහුම් කරන බව තහවුරු කර ඇත.

Majorsilence.Forms හි ස්වයං-ඇඳි chrome සඳහා කවුළු drag/resize මෙම backend එකේ imperative නොව declarative
වේ: OS resize margins තබා ගන්නා borderless presenter එකකින් resize නොමිලේ ලැබෙන අතර, Windows desktop head එකේ
title-bar drag සඳහා WinUI හි caption-region API (`SetCaptionRegions`) භාවිත වේ. macOS මත ස්වදේශීය decorations
drag/resize හසුරුවයි; X11 මත title-bar drag නොමැති අතර `UseSystemDecorations` විකල්ප විසඳුමයි.

## GTK 4 backend
{:#the-gtk-4-backend}

`Majorsilence.Forms.Gtk4` [gir.core](https://github.com/gircore/gir.core) bindings හරහා GTK 4 මත සන්ධිය
ක්‍රියාත්මක කරයි. එය මූලිකව Linux (Wayland/X11) සඳහා වූ සැබෑ-කවුළු desktop backend එකක් වන අතර, GTK 4
runtime එක ස්ථාපිත ඕනෑම Windows/macOS එකක compile වී ධාවනය ද වේ. Avalonia මෙන් නොව එය පැහැදිලිවම තෝරා ගනු
ලැබේ:

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // Gtk4PlatformBackend ස්ථාපනය කරයි
Application.Run (new MainForm ());      // GLib ප්‍රධාන ලූපය
```

**ක්‍රියා කරන දේ:** සෑම ඉහළම මට්ටමේ පෝරමයකටම සැබෑ `Gtk.Window` එකක් සහ popups සඳහා borderless කවුළු; සෑම
paint එකකදීම Cairo image surface එකකට විදැහුම් කරන Skia; GTK event controllers හරහා mouse, keyboard සහ
ටයිප් කළ පෙළ; `Timer` පිටුපස GLib timers; clipboard පෙළ සහ බහු-monitor `Screen`;
`Gdk.Toplevel.BeginMove/BeginResize` හරහා custom-chrome move/resize drags; සැබෑ transient-for/modal
සම්බන්ධතාවක් සහිත `ShowDialog`; දෙදිශාවටම කාවැද්දීම (`ToGtkWidget()`, `ToGtkWindow()`); සහ
`NativeControlHost` — Majorsilence දර්ශනයක් තුළ ආවරණය කළ සැබෑ `Gtk.Widget` එකක්. GTK 4 සෑම widget එකක්ම එක්
render tree එකකට සංයුක්ත කරන නිසා, Avalonia/Uno/WinForms මෙන් නොව **මෙහි "airspace" ගැටලුවක් නැත**.
`WebBrowser`, `RadPdfViewer` සහ `RadRichTextEditor` **WebKitGTK 6.0** මගින් පිටුබලය ලබයි (navigation සිදුවීම්,
`ExecuteScriptAsync`, JS-සිට-ධාරකයට පණිවිඩ පාලමක්); ස්වදේශීය library එක පූරණය වන්නේ `WebBrowser` එකක් සෑදූ
විට පමණක් වන අතර, එය නොමැතිව `IsWebViewFunctional` false වේ.

Wayland මත තහවුරු කර ඇත: කවුළුව පෙන්වයි, සම්පූර්ණ ControlGallery විදැහුම් වේ, timers ක්‍රියාත්මක වේ, repaints
ආදානය අනුගමනය කරයි, embedding නිදසුන ඉදිරිපත් වේ, සහ webview එක script පණිවිඩයක් round-trip කරයි.

**ක්‍රියා නොකරන දේ**, බොහෝ දුරට අපේක්ෂිත වැඩ නොව GTK 4 API ඉවත් කිරීම්: තිර-ස්ථාන පාලනයක් නැත
(`Form.Location` යනු කවුළු කළමනාකරු නොසලකා හැරිය හැකි ඉඟියකි; `Topmost`, `ShowInTaskbar` සහ `MaximumSize`
round-trip වන නමුත් බලාත්මක නොකෙරේ); `SetIcon(byte[])` no-op එකකි (GTK 4 icons යනු themed නම් වේ); ගොනු සහ
ෆෝල්ඩර pickers හිස්ව ආපසු එන නිසා, Headless මෙන්ම common-dialog විකල්ප ක්‍රියාත්මක වේ; භාගික පරිමාණනය GTK හි
පූර්ණ සංඛ්‍යා පරිමාණ සාධකය (1 හෝ 2) භාවිත කරයි; සහ backend එක AOT-විශ්ලේෂණය කර නැත. එයට display server
එකක් අවශ්‍යයි — offscreen විදැහුම්කරණය සඳහා Headless භාවිත කරන්න.

**ස්ථාපනය.** Debian/Ubuntu මත `libgtk-4-1`, Fedora/Arch මත `gtk4`, macOS මත `brew install gtk4`, Windows මත
GTK runtime එක; webview සඳහා WebKitGTK 6.0 එක් කරන්න (Debian/Ubuntu මත `libwebkitgtk-6.0-4`).
[`samples/Gallery.Gtk4`]({{ site.github_url }}/tree/main/samples/Gallery.Gtk4) ධාවනය කරන්න
(webview පෝරමය සඳහා `MF_GTK4_WEBVIEW=1`). මෙයද බලන්න:
[Linux මත WinForms]({{ '/si/winforms-on-linux/' | relative_url }}).

## Terminal backend
{:#the-terminal-backend}

`Majorsilence.Forms.Terminal` පෝරමයක් terminal එකක ධාවනය කරයි. Terminal එකම කවුළුව වන නිසා, මෙය දුරකථනයක්
මෙන් තනි-දර්ශන ධාරකයකි: පෝරමය තිරය පුරා පිරේ, title bar හෝ caption බොත්තම් නොඅඳියි, සහ එහි `Text` terminal
එකේම මාතෘකාවට යයි. යෙදුම පිටවීමට තමන්ගේම මාර්ගයක් සපයයි (`Close ()`); **Ctrl+C සැමවිටම පිටවෙයි** සහ කිසි
විටෙක යෙදුමට ලබා නොදේ. Popups පෝරමය මත සංයුක්ත වේ; සංවාද කවුළුවක් පෙන්වන අතරතුර තිරය ප්‍රතිස්ථාපනය කරයි.

```csharp
TerminalApplication.Use ();             // නැතහොත් Use (new TerminalOptions { … })
Application.Run (new MainForm ());
```

**ප්‍රතිදාන ආකාර.** සුපුරුදු Skia pipeline එක offscreen විදැහුම් කරන අතර පින්තූරය ආකාර හතරෙන් එකකින්
පෙන්වයි:

| ආකාරය | විභේදනය | කවදාද |
|---|---|---|
| Kitty graphics | terminal එකේ සැබෑ පික්සල | kitty, WezTerm, Ghostty |
| Sixel | සැබෑ පික්සල, වර්ණ 256 | foot, mlterm, iTerm2, Contour, xterm `-ti vt340` |
| Blocks (graphics නොමැති විට පෙරනිමිය) | Unicode quadrant glyphs වලින් cell එකකට පික්සල 2×4 | අනෙක් සියල්ල, සහ tmux/screen තුළ සැමවිටම |
| Half-block | cell එකකට පික්සල 1×2 | ස්ථිර කළ විට පමණි, quadrant glyphs නොමැති font එකක් සඳහා |

Blocks ආකාරය 300×80 terminal එකක් 600×320 තිරයක් බවට පත් කරයි, පරිමාණය 1 දී කියවිය හැක. වෙනස් වූ cells,
කලාප හෝ 16×8-cell tiles පමණක් නැවත යවන නිසා, caret blink එකක් එක් tile එකකි.

**හඳුනා ගැනීම සහ ස්ථිර කිරීම.** ආරම්භයේදී ධාරකය `TERM` විශ්වාස කරනවා වෙනුවට terminal එක සහාය දක්වන්නේ කුමක්දැයි
විමසයි (Kitty graphics, Kitty keyboard සහ device attributes, එය Sixel ද ලැයිස්තුගත කරයි); truecolor ද එලෙසම
තහවුරු කෙරේ. `MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` හෝ `TerminalOptions.GraphicsMode` සමඟ ආකාරයක්
ස්ථිර කරන්න; ස්ථිර කළ ආකාරයක් කිසි විටෙක අභිබවා නොයයි. `MF_TERMINAL_SIXEL_MAX=WxH` වැඩි කළ xterm
`maxGraphicsSize` එකක් ගැන ධාරකයට දන්වයි (xterm පෙරනිමියෙන් Sixel රූප 1000×1000 දී කපා දමයි, එබැවින් පෝරමය
ගැළපෙන සේ ප්‍රමාණය කෙරේ), සහ `MF_TERMINAL_TRACE=/path` අමු පිළිතුරු, තෝරාගත් ආකාරය සහ විකේතනය කළ සෑම ආදාන
සිදුවීමක්ම log කරයි.

**ආදානය.** Mouse (clicks, drags, hover, wheel) සහ keyboard (පෙළ, ඊතල, navigation යතුරු, F1–F12, modifiers)
byte stream එකෙන් විකේතනය කෙරේ; Kitty graphics සමඟ mouse එක පික්සල-නිරවද්‍ය වේ. Terminal එක Kitty keyboard
protocol එක ලබා දෙන තැන එය සක්‍රිය කෙරෙන අතර, සැබෑ key releases, නිවැරදි modifiers සහ නිවැරදි US-නොවන
පිරිසැලසුම් ලබා දෙයි. පෝරමයක් කිසිවක් focus නොකර ආරම්භ වේ, එබැවින් ඊතල යතුරු භාවිත කිරීමට පෙර Tab එක් වරක්
ඔබන්න.

**තහවුරු කර ඇත:** xterm 407 (`-ti vt340` සමඟ Sixel; පෙරනිමියෙන් Blocks/truecolor) සහ WezTerm (Kitty
graphics, ස්ථිර කළ විට Sixel). **තවම තහවුරු කර නැත:** kitty, Ghostty, foot, iTerm2, Windows Terminal, macOS
Terminal, tmux, සහ Windows console I/O (VT ආකාරවලට එරෙහිව ලියා ඇත, අභ්‍යාස කර නැත). ස්වදේශීය ගොනු pickers,
`NativeControlHost` සහ web views සඳහා terminal සමානයක් නැත.
[`samples/Gallery.Terminal`]({{ site.github_url }}/tree/main/samples/Gallery.Terminal) truecolor terminal
එකක ධාවනය කරන්න.

## WinForms සහ WPF backend (සංක්‍රමණය)
{:#the-winforms-and-wpf-backends-migration}

මේ දෙක පවතින්නේ එක් අරමුණක් සඳහාය: **Windows මත පියවරෙන් පියවර සංක්‍රමණය**. WinForms හෝ WPF යෙදුමක් තම
shell, menus සහ කවුළු සැබෑ toolkit එක මත තබා ගන්නා අතර තනි තිර හෝ පාලක Majorsilence.Forms වෙත ගෙන යයි —
port කළ සෑම කොටසක්ම සම්මත `System.Windows.Forms.Control` හෝ WPF `FrameworkElement` එකක් ලෙස නැවත ඇතුළු
වේ. WinForms *පාලක library* එකකට තම පාරිභෝගිකයින්ට තවමත් WinForms පාලක යවමින් තම අභ්‍යන්තරය port කළ හැක.
සියල්ල port කළ පසු, පැකේජය `Majorsilence.Forms.Avalonia` වෙත මාරු කරන්න, එවිට එම කේතයම බහු-වේදිකා වේ;
සන්ධියට ඉහළින් කිසිවක් වෙනස් නොවේ. දෙකම `net8.0-windows`/`net10.0-windows` මෙන්ම **`net48`** ද ඉලක්ක කරයි,
එබැවින් .NET Framework 4.8 යෙදුමකට පළමුව නවීන .NET වෙත නොගොස් සංක්‍රමණය ආරම්භ කළ හැක.

**`Majorsilence.Forms.WinForms`** සම්භාව්‍ය Win32 pump මත සැබෑ `System.Windows.Forms` කවුළු ධාරණය කරන අතර
GDI-පිටුබලය සහිත පාලකයක් හරහා Skia ඉදිරිපත් කරයි. WinForms ආදානය දැනටමත් උපාංග පික්සල වලින් වන අතර එහි
`Keys`/`MouseButtons` enums Majorsilence.Forms හි ඒවාට සංඛ්‍යාත්මකව සමාන වේ, එබැවින් පරිවර්තනය cast එකකි.
Popups යනු borderless tool windows වේ; `TryGetPlatformHandle` සැබෑ HWND එක ලබා දෙයි. කිසිවක් වින්‍යාස කර
නොමැති විට presenter එක backend එක ස්වයංක්‍රීයව ස්ථාපනය කරයි, එබැවින් යෙදුමේ දැනට පවතින `Application.Run`
සියල්ල සේවනය කරයි:

```csharp
using Majorsilence.Forms.WinForms;

var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// නැතහොත් සම්පූර්ණ MF Form එකක් WinForms වෙත native-modal සංවාද කවුළුවක් ලෙස ලබා දෙන්න
System.Windows.Forms.Form native = myMfForm.ToWinFormsForm ();
native.ShowDialog (ownerWinFormsForm);
```

`samples/EmbeddingWinForms` හරහා Windows මත අන්තර්ක්‍රියාකාරීව තහවුරු කර ඇත: විදැහුම්කරණය, mouse සහ keyboard
ආදානය, combo-dropdown popups, `NativeControlHost` overlays සහ `ToWinFormsForm()` modal සංවාද කවුළු. ක්‍රියාත්මක
කර නැත: gestures (WinForms හට gesture API එකක් නැත) සහ `IWebViewFactory` (webview මත රඳා පවතින compat පාලක
පසුබසී). Windows නොවන තැන්වල නවීන-.NET පේළි හිස් placeholder එකක් ලෙස build වන නිසා බහු-වේදිකා solution
එකක් තවමත් සෑම තැනකම compile වේ.

**`Majorsilence.Forms.Wpf`** සැබෑ WPF `Window` එකක් සහ `Dispatcher` ලූපය මත එකම හැඩයයි, Skia
`WriteableBitmap` එකක් හරහා ඉදිරිපත් කෙරේ, `Microsoft.Win32` ගොනු සංවාද කවුළු සහ `System.Windows.Clipboard`
සමඟ. WPF හට එකක් නැති නිසා `NotifyIcon` සැබෑ `System.Windows.Forms.NotifyIcon` භාවිත කරයි. එය පැහැදිලිවම
තෝරන්න, නැතහොත් කාවද්දන්න:

```csharp
Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();   // යෙදුම MF සතුයි
Application.Run (new MainForm ());

myWpfGrid.Children.Add (myMfControl.ToWpfElement ());                  // නැතහොත් WPF යෙදුමක කාවද්දන්න
```

[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf) එය මත සම්පූර්ණ ගැලරිය
ධාවනය කරයි.

**`WindowsFormsInterop` සමඟ සම්බන්ධතාව.** දෙකම පියවරෙන් පියවර සංක්‍රමණය සඳහා පවතින අතර එහි විවිධ ස්තර
විසඳයි. `Majorsilence.Forms.WindowsFormsInterop` WinForms යෙදුමක් සහ Avalonia backend එක මත ධාවනය වන
Majorsilence.Forms අතර **සම්පූර්ණ පෝරම** පාලම් කරයි, එක් පණිවිඩ pump එකක් බෙදා ගනිමින්. WinForms backend
එක Avalonia පින්තූරයෙන් ඉවත් කර **පාලක** මට්ටමින් ක්‍රියා කරයි. ඒවාට එකට පැවතිය හැක — presenter එක දැනටමත්
වින්‍යාස කළ backend එකකට අත නොතබයි. Public API එක WinForms වර්ගවලට ටයිප් කර ඇති පාලක library එකක් සඳහා
තුන්වන විකල්පයක් ඇත, `Majorsilence.Forms.WinFormsShims.Compat` source generator එක; බලන්න
[සංක්‍රමණ මාර්ගෝපදේශය]({{ '/si/migration/' | relative_url }}).

## ස්පර්ශ ඉඟි (touch gestures)
{:#touch-gestures}

`Control` හට ස්පර්ශ සහ pen ආදානය සඳහා සම්පූර්ණයෙන්ම එකතු කිරීමක් වන සිදුවීම් ඇත: `LongPress`, `Pinch`
(pinch-to-zoom සහ ඇඟිලි දෙකේ භ්‍රමණය එකට), `Swipe`, සහ `ScrollGesture` — ස්පර්ශය ඉවත් කළ පසු වේදිකාවේ
momentum අවධිය හරහා ක්ෂය වන delta එකක් සමඟ දිගටම ක්‍රියාත්මක වන අඛණ්ඩ drag-to-pan, එය සම්පූර්ණ
flick-scrolling ක්‍රියාත්මක කිරීමයි. ඒවායින් කිසිවක් mouse සඳහා ක්‍රියාත්මක නොවේ. `ScrollableControl`
`ScrollGesture` එක `AutoScrollPosition` වෙත යොදයි, `ListBox` සහ `TreeView` තමන්ගේම scrollbar එකම ආකාරයට
pan කරයි, සහ `LongPress` පෙරනිමියෙන් `ContextMenu` විවෘත කරයි. Gesture ලක්ෂ්‍ය සන්ධියේදී තාර්කික ඒකක වලට
පරිවර්තනය කරන නිසා, ඕනෑම පරිමාණනයකදී hit-testing නිවැරදිය.

**Avalonia** සහ **Uno** backend, කවුළුව Majorsilence.Forms සතු වුවද කාවද්දා ඇතත්, gestures ක්‍රියාත්මක කරයි.
යටින් gesture ආකෘති දෙක වෙනස් වේ — Avalonia touch/pen වලට පමණක් ස්වයං-සීමා කළ කැපවූ recognizers අමුණයි;
WinUI/Uno හට එසේ සීමා නොකළ එක් ඒකාබද්ධ manipulation stream එකක් ඇති අතර, වෙනස් ඒකක වලින් ප්‍රවේගය වාර්තා කරයි,
සහ ස්වදේශීය swipe එකක් නැත — එබැවින් Uno backend එක mouse pointers පෙරහන් කරයි, ප්‍රවේගය පරිවර්තනය කරයි සහ
`Swipe` සංශ්ලේෂණය කරයි. ඒ සඳහා අවශ්‍ය විනිශ්චයන් හරයේ `GestureHeuristics` හි පවතින අතර unit-test කර ඇත, මන්ද
බහු-ස්පර්ශ දෘඪාංග නොමැතිව දෙකෙන් එකක්වත් තහවුරු කළ නොහැකි බැවිනි. අනෙක් backend කිසිදු gesture සිදුවීමක් මතු
නොකරයි.

## ස්වදේශීය අංග ධාරණය කිරීම
{:#hosting-native-elements}

`INativeControlHostBackend` යනු **Avalonia, Uno, WinForms, WPF සහ GTK 4** backend මගින් ක්‍රියාත්මක කරන සහ
Headless සහ Terminal මත නොමැති විකල්ප හැකියාවකි. එය `NativeControlHost` පාලකයකට backend එක සැබෑ toolkit
අංගයකින් පුරවන සෘජුකෝණාස්‍රයක් වෙන් කර ගැනීමට ඉඩ දෙයි — Avalonia `Control` එකක්, Uno `UIElement` එකක්,
`System.Windows.Forms.Control` එකක්, `Gtk.Widget` එකක් — Skia පෘෂ්ඨය මත ආවරණය කර placeholder එකේ සීමා, clip
සහ දෘශ්‍යතාවට අනුකූලව තබා ඇත. සුපුරුදු "airspace" සීමාවලට GTK 4 ව්‍යතිරේකයකි: එය සෑම widget එකක්ම එක් render
tree එකකට සංයුක්ත කරන නිසා, ධාරණය කළ widget එකක් නිවැරදිව clip සහ blend වේ.

`IWebViewFactory` යනු `WebBrowser` පිටුපස ඇති සහෝදර හැකියාවයි: Avalonia desktop මත WebView2 / WKWebView /
WebKitGTK, GTK 4 මත WebKitGTK, Headless, browser, Terminal හෝ WinForms backend මත කිසිවක් නැත.

එය භාවිත කරන ආකාරය, එහි "airspace" සීමා, ස්වදේශීය handles ව්‍යාජ ලෙස සෑදිය නොහැක්කේ ඇයි, සහ වීඩියෝ සාමාන්‍යයෙන්
ධාරණය කළ ස්වදේශීය පෘෂ්ඨයකට වඩා Skia තුළට ඇඳින frame callbacks සමඟ කිරීම වඩා හොඳ වන්නේ ඇයි යන්න සඳහා
[ස්වදේශීය interop]({{ '/si/native-interop/' | relative_url }}) බලන්න.

## ජංගම හැකියාවන්
{:#mobile-capabilities}

තවත් විකල්ප සන්ධි කිහිපයක් ප්‍රධාන වශයෙන් Avalonia backend එකේ Android සහ iOS පේළි සඳහා පවතී. වෙනත් සෑම
තැනකම සියල්ල no-op එකක් බවට පිරිහේ; `IsSupported` flags පරීක්ෂා කරන්න.

- **ක්‍රියාවලිය තුළ ශ්‍රව්‍ය** (`IAudioBackend`). `Media.SoundPlayer` සහ `Media.SystemSounds` Android සහ iOS
  මත backend එක හරහා වාදනය වන අතර desktop මත `Media.NativeAudio` (OS playback utility එක spawn කරමින්) වෙත
  පසුබසී. `Media.AudioPlayer` — volume, `AudioUsage` (උදා. `Alarm`), සැබෑ `Completed` සිදුවීමක් — හට
  desktop විකල්පයක් නැති අතර එය සැබෑ වන්නේ `AudioPlayer.IsSupported` එසේ කියන තැන පමණි.
- **Haptics.** `Haptics.Tap`/`Impact`/`Vibrate`; `Haptics.IsSupported` true වන්නේ Android සහ iOS මත පමණි.
  `VIBRATE` අවසරය පරිභෝජනය කරන යෙදුමේ manifest එකට ස්වයංක්‍රීයව ඒකාබද්ධ වේ.
- **දේශීය දැනුම්දීම්.** `LocalNotifications.RegisterChannel`/`Show`/`Tapped`, මේ වන තෙක් Android පමණි;
  ධාරකයේ `MainActivity` තමන්වම ලියාපදිංචි කර intents සහ අවසර ප්‍රතිඵල යොමු කරයි.
- **තිරය අවදියෙන් තබා ගැනීම.** `Application.KeepScreenAwake` browser හැර සෑම පේළියකම සැබෑය — Android, iOS,
  Windows (`SetThreadExecutionState`), macOS (IOKit power assertion) සහ Linux (`systemd-inhibit`). Headless
  එය view-model පරීක්ෂණ සඳහා සරල, සැකසිය හැකි ව්‍යාජයක් ලෙස ක්‍රියාත්මක කරයි.
- **ජීවන චක්‍රය සහ back බොත්තම.** `Application.Suspended`/`Resumed` සහ `WindowBase.BackRequested` තනි-දර්ශන
  ධාරක මගින් මතු කෙරේ; අනෙක් සෑම backend එකක්ම දැනටමත් තම සැබෑ කවුළුවෙන් `Activated`/`Deactivate`
  ක්‍රියාත්මක කරන අතර අත්හිටුවීමට කිසිවක් නැත.

සක්‍රිය UI backend එක කුමක්ද යන්නට කිසිදු සම්බන්ධයක් නැති හැකියාවන් — `SecureStorage`, `Speech`
(text-to-speech), `Launcher.OpenAsync`, `FileSystem.OpenAppPackageFileAsync` — වෙනම
**`Majorsilence.Forms.Essentials`** පැකේජයේ පවතී, එය තමන්ගේම වේදිකා-අනුව ක්‍රියාත්මක කිරීම තෝරා ගන්නා අතර
කිසිසේත් `Platform.Backend` හරහා නොයයි. මේ සියල්ල සඳහා වේදිකා-අනුව විස්තර සහ තහවුරු කිරීමේ තත්ත්වය
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) හි ඇත.

## තවත් backend එකක් එක් කිරීම
{:#adding-another-backend}

නව backend එකක් යනු `Majorsilence.Forms` (හරය) සහ ඉලක්ක toolkit එක යොමු කරන, `IPlatformBackend` සහ
`IWindowBackend` ක්‍රියාත්මක කරන නව assembly එකකි — හැඩය සඳහා Headless අනුකරණය කරන්න: `IPlatformBackend` හි
dispatcher සහ ජීවන චක්‍රය මෙහෙයවන්න, `IWindowBackend` හි Skia පෘෂ්ඨයක් ඉදිරිපත් කර (`owner.RenderFrame`
අමතමින්) ආදානය පරිවර්තනය කරන්න (`owner.Handle*`), සහ හර ව්‍යාපෘතියට `[InternalsVisibleTo]` ඇතුළත් කිරීමක් එක්
කරන්න. විකල්ප හැකියාවන් (`IWebViewFactory`, `INativeControlHostBackend`, `IModalLoopSupport`, …) පසුව හෝ
කිසි විටෙකත් නොපැමිණිය හැක.

සම්පූර්ණ අතුරුමුහුණත් ලැයිස්තුව සහ මෙම පිටුව සංක්ෂිප්ත කරන backend-අනුව ක්‍රියාත්මක කිරීමේ සටහන් සඳහා repository
එකේ [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) බලන්න.
