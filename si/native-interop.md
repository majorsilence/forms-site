---
layout: docs
lang: si
title: Native interop
subtitle: ධාරණය කළ native අන්තර්ගතය, වීඩියෝ, සහ Button එකක් පිටුපස HWND එකක් නොමැත්තේ ඇයි.
permalink: /si/native-interop/
seo_title: "Native Interop — Control.Handle යනු HWND එකක් නොවන්නේ ඇයි"
description: >-
  Avalonia, Uno, WinForms, WPF හෝ GTK 4 මත බහු-වේදිකා WinForms පාලකයක් තුළ native අන්තර්ගතය — වීඩියෝ,
  සිතියම්, browser engines — ධාරණය කරන්න, සහ මෙහි Control.Handle යනු IntPtr.Zero වන්නේ ඇයි දැයි දැන ගන්න.
keywords:
  - winforms control handle hwnd
  - winforms native control host
  - winforms video playback cross platform
  - winforms වීඩියෝ ධාවනය
  - nativecontrolhost skiasharp
  - winforms hwnd linux
  - avalonia native interop
priority: "0.7"
---

ප්‍රශ්න දෙකක් එකම ප්‍රශ්නය බව පෙනී යයි:

- *"native දෙයක් — වීඩියෝ surface එකක්, සිතියම් දර්ශනයක්, browser engine එකක් — Majorsilence.Forms පාලකයක්
  තුළ තබන්නේ කෙසේද?"*
- *"handle එකක් අවශ්‍ය library එකකට ලබා දීම සඳහා පාලකයක `HWND` එකක් ලබා ගන්නේ කෙසේද?"*

දෙවැන්නට කෙටි පිළිතුර **ඔබට නොහැක, සහ ඔබ එකක් ව්‍යාජව සෑදිය යුතු නැත**. ඔබට එය අවශ්‍ය වන්නේ කලාතුරකිනි,
මන්ද පළමුවැන්නට සැබෑ පිළිතුරක් ඇත: [`NativeControlHost`](#the-seam-nativecontrolhost).

සැබෑ WinForms යෙදුමක් තුළ Majorsilence.Forms කවුළුවක් ධාරණය කිරීම ප්‍රතිවිරුද්ධ දිශාවයි, එය
[`winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) තුළ ආවරණය කෙරේ.

## මෙහි handles සැබෑ නොවන්නේ ඇයි
{:#why-handles-arent-real-here}

Majorsilence.Forms තමන්ගේම සියලු ඇඳීම් තනි Skia surface එකකට කරයි. සෑම backend එකක්ම එය යටින් ඇති toolkit
එකේ ආකෘතියම අනුගමනය කරයි: **එක් ඉහළ-මට්ටමේ (top-level) කවුළුවකට එක් ධාරක කවුළුවක් — desktop backend මත
සැබෑ OS කවුළුවක් — සහ එය තුළ ඇති සියල්ල ඇඳ ඇත, native child කවුළුවලින් සංයුක්ත කර නැත.** `Button` එකක්
යනු canvas එකක් මත ඇඳීමේ මෙහෙයුම් ය. එය පිටුපස `HWND` එකක් නැත්තේ එය පිටුපස OS වස්තුවක් නැති නිසාය.

| සාමාජිකයා | අගය | හේතුව |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | වාර්තා කිරීමට එක් එක් පාලකයට වෙනම OS කවුළුවක් නොපවතී. එය කියවීමෙන් තවමත් upstream හි අතුරු ප්‍රතිඵලය ඇති වේ — එය පාලකයේ handle තත්ත්වය සාදයි, එබැවින් `IsHandleCreated` true වන අතර `HandleCreated` ක්‍රියාත්මක වේ, `_ = control.Handle;` ලියන්නේ ඒ සඳහාමය. `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle` සඳහාද එම අගයමය. |
| `WindowBase.Handle` | පාරාන්ධ (opaque) ශුන්‍ය නොවන token එකක් | **`HWND` එකක් නොවේ.** `Invoke` වලට පෙර handle නිර්මාණය බල කිරීමට WinForms කේතය නිතිපතා `.Handle` කියවන අතර, ශුන්‍යය ආපසු දීමෙන් එම රටාව බිඳී යයි. අර්ථවත් වන්නේ managed කේතය තුළ පමණි. |
| `WindowBase.PlatformHandle` | සැබෑ native handle එක, නැතහොත් `IntPtr.Zero` | සැබෑ දෙය, `IWindowBackend.TryGetPlatformHandle()` හරහා. Avalonia backend මගින් ක්‍රියාත්මක කර ඇත — Windows මත `HWND`, macOS මත `NSWindow`, X11 මත `XID` — සහ Windows-පමණක් WinForms backend මගින්ද, එය තම පෝරමයේ `HWND` ආපසු දෙයි. දැනට Uno සහ Headless මත ශුන්‍යයි. |

### ව්‍යාජ handles පිළිබඳ නීතිය
{:#the-rule-about-faking}

ව්‍යාජව සාදන ලද handle එකක් ආරක්ෂිත වන්නේ **එය ඔබ පාලනය කරන managed කේතය හරහා පමණක් ගමන් කරන තාක් කල්
පමණි** — `WindowBase.Handle` කරන්නේ හරියටම එයයි, එය ඇත්තේද ඒ සඳහා පමණි. එය native කේතයට ඇතුළු වන මොහොතේම
ආරක්ෂිත වීම නතර වේ.

Native libraries ඔබ ලබා දෙන handle එක ගබඩා කර තබා ගැනීම පමණක් නොකරයි. LibVLC හි
`libvlc_media_player_set_hwnd`, mpv හි `--wid`, සහ GStreamer හි `GstVideoOverlay.set_window_handle` යන සියල්ල
එය OS වෙත යවයි — `SetParent`, `CreateWindowEx`, `GetClientRect`, `SetWindowPos`, `XReparentWindow`. ඒවාට
සාදාගත් අංකයක් ලබා දීමෙන් ඔබට ප්‍රතිඵල දෙකෙන් එකක් ලැබේ, සහ දෙවැන්න වඩාත් නරකය:

1. ඇමතුම අසාර්ථක වන අතර, ඔබට කළු සෘජුකෝණාස්‍රයක් හෝ native library එක තුළ crash එකක් ලැබේ.
2. ඇමතුම *වෙනත් දෙයකට අයත් කවුළුවකට එරෙහිව සාර්ථක වේ.* `HWND` යනු pointers නොව handle-table
   indices වන අතර, කුඩා පූර්ණ සංඛ්‍යා සජීවී අගයන් වේ. hash code එකක් යනු සැබෑ කවුළුවක් සමඟ ගැටෙන
   හරියටම එවැනි හැඩයේ අංකයකි.

එබැවින්: OS වෙත ළඟා වන කිසිවක් සඳහා කිසි විටෙකත් handle එකක් කෘත්‍රිමව සාදන්න එපා. පහත මාර්ග දෙකෙන් එකක්
භාවිත කරන්න.

## සන්ධිය (seam): `NativeControlHost`
{:#the-seam-nativecontrolhost}

`Majorsilence.Forms.NativeControlHost` යනු යටින් ඇති toolkit එකේ native මූලද්‍රව්‍යයක් සඳහා **සෘජුකෝණාස්‍රයක්
වෙන් කර තබන** `Control` එකකි. එය තමන්ම කිසිවක් නොඅඳියි; backend එක සැබෑ මූලද්‍රව්‍යය Skia surface එකට
ඉහළින් overlay කර එය placeholder එකේ සීමාවලට පෙළගස්වා තබයි. බොහෝ backend මත මෙය "airspace" interop
ආකෘතියයි — native මූලද්‍රව්‍ය Skia buffer එකට සංයුක්ත කළ නොහැක, එබැවින් ඒවා එයට ඉහළින් ස්ථානගත කෙරේ.
GTK 4 ව්‍යතිරේකයයි, එය පහතින් ආවරණය කෙරේ.

```csharp
var host = new NativeControlHost { Dock = DockStyle.Fill };
host.NativeControl = someAvaloniaControl;   // හෝ Uno UIElement එකක්, WinForms Control එකක්, Gtk.Widget එකක්…
panel.Controls.Add (host);
```

ධාරකය සීමා (bounds), සෑම scroll වන මුතුන් මිත්තෙකුගේම (ancestor) ඡේදනය වූ clip කලාපය, සහ සම්පූර්ණ parent
දාමය දිගේ ඵලදායී දෘශ්‍යතාව ලුහුබඳින අතර, ඒ තුනම backend වෙත යවයි. paint කිරීමේදී සහ දෘශ්‍යතා වෙනස්වීම්වලදී
නැවත සමමුහුර්ත කිරීම ස්වයංක්‍රීයව සිදු වේ; සාමාන්‍ය paint චක්‍රයෙන් පිටත ඔබ ධාරකය ගෙන යන්නේ හෝ ප්‍රමාණය
වෙනස් කරන්නේ නම් `SyncNativeControl()` ඔබම කැඳවන්න.

`INativeControlHostBackend` යනු විකල්ප backend හැකියාවකි ([Backends]({{ '/si/backends/' | relative_url }})
බලන්න). එය ක්‍රියාත්මක කරන backend සහ ඒවා අපේක්ෂා කරන දේ:

| Backend | `NativeControl` හි අපේක්ෂිත type එක | හැසිරීම |
|---|---|---|
| Avalonia (window host, තනි-දර්ශන host, presenter) | `Avalonia.Controls.Control` | Skia surface එකට ඉහළින් ඇති overlay `Canvas` එකකට එක් කෙරේ. |
| Uno (window host, presenter) | `Microsoft.UI.Xaml.UIElement` | `SKXamlCanvas` එකට ඉහළින් ඇති root `Canvas`/panel එකට එක් කෙරේ. |
| WinForms / WPF (window host, presenter) | `System.Windows.Forms.Control` / `System.Windows.FrameworkElement` | Skia පාලකයට ඉහළින් ඇති overlay ස්තරයකට එක් කෙරේ. |
| GTK 4 (window host, presenter) | `Gtk.Widget` | `Gtk.DrawingArea` එකට ඉහළින් `Gtk.Overlay` child එකක් ලෙස එක් කෙරේ. **airspace ගැටලුවක් නැත** — GTK සෑම widget එකක්ම එක් render tree එකකට සංයුක්ත කරයි, එබැවින් ධාරණය කළ widget එක වෙනත් ඕනෑම එකක් මෙන් clip වී blend වේ. |
| Headless, Terminal | — | මෙම හැකියාව ක්‍රියාත්මක නොකරයි; ධාරකය හිස් placeholder එකක් ලෙස විදැහුම් වේ. |

> **වැරදි type එක පැවරීම නිහඬව අසාර්ථක වේ.** සෑම backend එකක්ම `NativeControl` හි type එක පරීක්ෂා කර, එය
> නොගැළපේ නම් සරලවම ආපසු යයි. කිසිවක් exception විසි නොකරයි, කිසිවක් log නොකරයි, තිරය මත කිසිවක් නොපෙනේ.
> ඔබේ native අන්තර්ගතය නොපෙනේ නම්, පළමුව type එක පරීක්ෂා කරන්න — Uno backend එකට ලබා දුන් Avalonia
> `Control` එකක්, හෝ ප්‍රතිලෝමව, හරියටම මෙය ඇති කරයි.

### Airspace සීමාවන්
{:#airspace-limitations}

මේවා Avalonia, Uno, WinForms සහ WPF backend මත ධාරණය කළ ඕනෑම native මූලද්‍රව්‍යයකට අදාළ වන අතර, නිවැරදි
කළ යුතු දෝෂ නොව ආකෘතියටම ආවේණික ලක්ෂණ වේ:

- native මූලද්‍රව්‍යය සම්පූර්ණ Majorsilence.Forms දර්ශනයටම **ඉහළින්** අඳියි. එය Majorsilence පාලක අතර
  z-order කළ නොහැකි අතර, එය දෘශ්‍යමය වශයෙන් අතිච්ඡාදනය කරන ඕනෑම දෙයක් — dropdown එකක්, tooltip එකක්,
  context menu එකක් — එයට යටින් ඇඳේ.
- Clipping සෘජුකෝණාස්‍රාකාර පමණි. Majorsilence පැත්තෙන් එන භ්‍රමණය, සෘජුකෝණාස්‍රාකාර නොවන clips, සහ
  opacity එයට අදාළ නොවේ.
- Scrolling ක්‍රියා කරයි නමුත් වියදමක් නැතිව නොවේ: overlay එක එක් එක් sync එකකදී නැවත ස්ථානගත කෙරේ, එබැවින්
  වේගවත් scroll එකකදී එය Skia අන්තර්ගතයට වඩා පසුපසින් යන බව පෙනිය හැක. හැකි තැන්වලදී ධාරණය කළ මූලද්‍රව්‍ය
  scroll නොවන ප්‍රදේශවල තබන්න.

**GTK 4 ව්‍යතිරේකයයි.** Skia surface එක `Gtk.Overlay` එකක් තුළ පිහිටා ඇති අතර ධාරණය කළ widget එක overlay
child එකකි, නමුත් GTK 4 සෑම widget එකක්ම එක් render tree එකකට සංයුක්ත කරයි — එබැවින් ධාරණය කළ widget එක
වෙනත් ඕනෑම එකක් මෙන් z-order වී, clip වී, blend වේ, සහ ඉහත අවවාද කිසිවක් අදාළ නොවේ. එකම සම්මුතිය: viewport
එකකින් අර්ධ වශයෙන් පිටතට scroll වූ ධාරකයක් එහි native widget එක clip එකක් යටතේ විස්ථාපනය කරනවා වෙනුවට
දෘශ්‍යමාන කොටුවට *නැවත සකසයි (reflow)*, එබැවින් අඩක් scroll වූ widget එකක් කපා හැරෙනවා වෙනුවට කුඩා
සෘජුකෝණාස්‍රයට නැවත layout වේ.

## මාර්ගය A — සැබෑ native අන්තර්ගතය ධාරණය කිරීම
{:#route-a--hosting-real-native-content}

සැබවින්ම OS කවුළුවක් විය යුතු දෙයක් ඔබට අවශ්‍ය වූ විට මෙය භාවිත කරන්න: GPU-accelerated වීඩියෝ surface
එකක්, native සිතියම් හෝ CAD දර්ශනයක්, browser engine එකක්.

වැදගත්ම දෙය නම් ඔබ **handle එකක් ව්‍යාජව සාදන්නේ නැත — ඔබ සැබෑ එකක් සාදයි** සහ එය native library එකට
ලබා දෙයි. `NativeControl` handle එකක් වෙනුවට toolkit වස්තුවක් ගනී, එබැවින් අතරමැද wrapper පියවරක් ඇත.
`AvaloniaWebViewHandle` (`Majorsilence.Forms.Avalonia` තුළ) සහ `Gtk4WebViewHandle` (`Majorsilence.Forms.Gtk4`
තුළ) යනු tree එකේ දැනටමත් ඇති ක්‍රියාත්මක නිදසුන් ය: ඒවා `Avalonia.Controls.NativeWebView` /
`WebKit.WebView` wrap කර `IWebViewHandle.NativeControl` ලෙස නිරාවරණය කරයි.

**GTK 4 පහසු අවස්ථාවයි.** `WebKit.WebView` යනු හුදෙක් `Gtk.Widget` එකකි; backend එක එය Skia surface එකට
ඉහළින් ඇති `Gtk.Overlay` එකට එක් කරන අතර GTK එය එම render tree එකටම සංයුක්ත කරයි — සෑදිය යුතු handle එකක්
නැත, airspace නැත, වේදිකා ළඟාවීම පිළිබඳ අවවාදයක් නැත. සම්පූර්ණ `IWebViewHandle` (navigation events, JS eval,
script-message bridge) `IWebViewFactory` හරහා WebKitGTK 6.0 ට එරෙහිව ක්‍රියාත්මක කර ඇත, එම backend මත
`WebBrowser` සහ webview මත පදනම් වූ compat පාලක භාවිත කරන්නේ එයයි.

**Avalonia.** `Avalonia.Controls.NativeControlHost` subclass කර
`CreateNativeControlCore (IPlatformHandle parent)` override කරන්න, එය සැබෑ `IPlatformHandle` එකක් ආපසු දෙයි —
Windows මත `HWND` එකක්, X11 මත `XID` එකක්, macOS මත `NSView` එකක්. ඔබේ child කවුළුව එහි සාදන්න, එහි handle
එක player එකට ලබා දෙන්න, `DestroyNativeControlCore` තුළ එය නිදහස් කරන්න, සහ ලැබෙන Avalonia පාලකය
`NativeControlHost.NativeControl` වෙත පවරන්න.

**Uno.** `Uno.UI.NativeElementHosting` මගින් `Win32NativeWindow(IntPtr Hwnd)` සහ
`X11NativeWindow(IntPtr WindowId)` — ඔබ සෑදූ handle එකක් වටා ඇති public wrappers — සහ WASM සඳහා
`BrowserHtmlElement` නිරාවරණය කරයි. ඉන් එකක් `ContentPresenter` එකක `Content` ලෙස සකසා එය `NativeControl`
වෙත ලබා දෙන්න.

**වේදිකා ළඟාවීම: යථාර්ථවාදීව Windows සහ X11** handle මත පදනම් වූ මාර්ග සඳහා. Wayland සඳහා subsurfaces
අවශ්‍ය වේ, macOS ඔබට `HWND`-හැඩැති කිසිවක් නොව `NSView` එකක් ලබා දෙයි, සහ WASM/Android/iOS කිසිසේත්ම භාවිත
කළ හැකි කවුළු handle එකක් ලබා නොදේ. මේ ආකාරයෙන් ගොඩනගන විශේෂාංගයක් framework එකේ ඉතිරි කොටස ධාවනය වන
සෑම තැනකම ධාවනය නොවේ. GTK 4 widget මාර්ගයට එවැනි සීමාවක් නැත — GTK 4 ධාවනය වන ඕනෑම තැනක එය ධාවනය වේ,
Wayland ඇතුළුව.

## මාර්ගය B — handle එකකින් තොර වීඩියෝ (නිර්දේශිත)
{:#route-b--video-without-a-handle-recommended}

බොහෝ වීඩියෝ libraries කවුළුවක් ගන්නවා වෙනුවට ඔබට **decode කළ frames** ලබා දිය හැක, එමගින් ගැටලුවෙන් handle
එක සම්පූර්ණයෙන්ම ඉවත් වේ: LibVLC හි `libvlc_video_set_callbacks` (`vmem`), software mode හි mpv හි render
API, GStreamer `appsink` එකක්, හෝ ඔබ දැනටමත් frames අයිති කර ගන්නා FFmpeg.

ඔබට pixel buffer එකක් ලැබේ, එය `SKBitmap` එකකට පිටපත් කරන්න, සහ වෙනත් ඕනෑම පාලකයක් මෙන් `OnPaint` තුළ
එය අඳින්න:

```csharp
public class VideoView : Control
{
    private SKBitmap? frame;

    // decoder එකේම callback thread එකෙන්, අලුතින් decode කළ BGRA frame එකක් සමඟ කැඳවේ.
    // output format එක සකසන විට library එකෙන් width * 4 pitch එකක් ඉල්ලන්න, එවිට
    // ලැබෙන buffer එක තදින් ඇසුරුම් කර ඇති අතර SKBitmap හි row layout එකට ගැළපේ.
    public void PresentFrame (ReadOnlySpan<byte> bgra, int width, int height)
    {
        if (frame is null || frame.Width != width || frame.Height != height) {
            frame?.Dispose ();
            frame = new SKBitmap (width, height, SKColorType.Bgra8888, SKAlphaType.Premul);
        }

        // එක් තොග පිටපතක්, pixel එකින් එක නොවේ: SKBitmap.SetPixel යනු එක් ඇමතුමකට එක් P/Invoke එකකි,
        // එය megapixel frame එකක් සඳහා මිලි තත්පර නොව තත්පර ගණනක් වැය කරයි.
        bgra.CopyTo (frame.GetPixelSpan ());
        frame.NotifyPixelsChanged ();

        // Invalidate() marshal නොකරයි -- එය කවුළුව දක්වා ගොස් ඔබ එය කැඳවන ඕනෑම thread එකක
        // dirty ලෙස සලකුණු කරයි. UI thread එකට පැහැදිලිවම මාරු වන්න.
        BeginInvoke (Invalidate);
    }

    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);
        if (frame is not null)
            e.Canvas.DrawBitmap (frame, new SKRect (0, 0, Width, Height));
    }
}
```

මෙම සටහන එක් bitmap එකක් භාවිත කරයි, එබැවින් decoder එක ඊළඟ frame එක ලියන අතරතුර paint එකකට එය කියවිය
හැක — එය crash එකක් ලෙස නොව, බර යටතේ tearing ලෙස දිස් වේ. bitmaps දෙකක් අතර මාරු වීම (පිටුපස එකට ලියා,
තනි reference පැවරුමකින් ප්‍රකාශ කිරීම) සාමාන්‍ය විසඳුම වන අතර, demo එකකට වඩා වැඩි ඕනෑම දෙයක් සඳහා එය
කිරීම වටී.

**මෙය වඩා හොඳ පෙරනිමිය වන්නේ ඇයි.** frame එක Skia දර්ශනයේ කොටසක් බවට පත් වේ, එබැවින් z-order, clipping,
scrolling, opacity, සහ transforms සියල්ල වෙනත් සෑම පාලකයකටම මෙන් හැසිරේ — airspace අවවාද කිසිවක් අදාළ
නොවේ. එය Headless සහ WASM ඇතුළු සෑම backend එකකම ක්‍රියා කරයි, එය එය පරීක්ෂා කළ හැකි ද කරයි: ඔබට
විදැහුම් කළ pixels මත assert කළ හැක. වියදම එක් frame එකකට CPU පිටපතක් සහ software decode වේ.

## තෝරා ගැනීම
{:#choosing}

| | මාර්ගය A (native host) | මාර්ගය B (frame callbacks) |
|---|---|---|
| Majorsilence අන්තර්ගතය සමඟ සංයුක්ත වේ | නැත — ඉහළින් අඳියි (GTK 4: ඔව්) | ඔව් |
| Backends | Avalonia, Uno, WinForms, WPF, GTK 4 | සියල්ල, Headless සහ Terminal ඇතුළුව |
| වේදිකා | යථාර්ථවාදීව Windows, X11 (GTK 4: Wayland ද) | සෑම තැනකම |
| GPU decode මාර්ගය | ඔව් | නැත (software decode + පිටපත) |
| CI තුළ පරීක්ෂා කළ හැක | නැත | ඔව් |
| සැබෑ OS handle එකක් අවශ්‍යයි | ඔව් (එකක් සාදන්න — කිසි විටෙකත් ව්‍යාජ නොකරන්න); GTK 4: නැත, `Gtk.Widget` එකක් | නැත |

වීඩියෝ සඳහා පෙරනිමියෙන් **B** භාවිත කරන්න. ඔබට browser engine එකක්, hardware decode, හෝ කවුළුවකට ඇඳීමට
පමණක් දන්නා තෙවන පාර්ශ්ව native දර්ශනයක් අවශ්‍ය වූ විට **A** වෙත යොමු වන්න.

## දන්නා හිඩැස්
{:#known-gaps}

- **Uno `TryGetPlatformHandle` ක්‍රියාත්මක නොකරයි**, එබැවින් public Uno wrappers (`Win32NativeWindow.Hwnd`,
  `X11NativeWindow.WindowId`) මගින් එය වසා දැමිය හැකි වුවද, එහි `WindowBase.PlatformHandle` යනු
  `IntPtr.Zero` වේ. එයින් අදහස් වන්නේ Uno මත වේදිකා ප්‍රවේශ්‍යතා (accessibility) bridges සම්බන්ධ කළ නොහැකි
  බවයි.
- **framework එක සමඟ කිසිදු media හෝ වීඩියෝ පාලකයක් නිකුත් නොවේ.** ඉහත මාර්ග දෙකම ඒකාබද්ධ කිරීමේ
  මාර්ගෝපදේශ මිස, ඔබට instantiate කළ හැකි `VideoView` එකක් නොවේ.
- **මාර්ගය A හි Uno මාර්ගය ලේඛනගත කර ඇත්තේ ධාවනය වන යෙදුමකින් නොව, public API surface එකෙනි.** Avalonia
  මාර්ගය tree එක තුළ `AvaloniaWebViewHandle` මගින්ද, GTK 4 මාර්ගය `Gtk4WebViewHandle` මගින්ද (WebKitGTK 6.0
  ට එරෙහිව Wayland මත තහවුරු කර ඇත) ක්‍රියාත්මක කර පරීක්ෂා කෙරේ; Uno සමාන්තරය එසේ නොවේ.

සම්පූර්ණ විස්තර repository එකේ
[`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) තුළ ඇත.
