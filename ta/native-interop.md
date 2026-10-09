---
layout: docs
lang: ta
title: Native interop
subtitle: ஹோஸ்ட் செய்யப்படும் native உள்ளடக்கம், வீடியோ, மற்றும் ஒரு Button இன் பின்னால் HWND ஏன் இல்லை.
permalink: /ta/native-interop/
seo_title: "Native Interop — Control.Handle ஏன் ஒரு HWND அல்ல"
description: >-
  Native உள்ளடக்கத்தை — வீடியோ, வரைபடங்கள், browser engines — Avalonia, Uno, WinForms, WPF அல்லது
  GTK 4 இல் உள்ள பல்தள WinForms கட்டுப்பாடு ஒன்றுக்குள் ஹோஸ்ட் செய்யுங்கள்; இங்கே Control.Handle ஏன்
  IntPtr.Zero ஆக உள்ளது என்பதையும் அறியுங்கள்.
keywords:
  - winforms control handle hwnd
  - winforms native control host பல்தள
  - winforms வீடியோ இயக்கம் பல்தள
  - nativecontrolhost skiasharp
  - winforms hwnd linux
  - winforms native interop avalonia
  - winforms வீடியோ கட்டுப்பாடு
priority: "0.7"
---

இரண்டு கேள்விகள் உண்மையில் ஒரே கேள்வியாக மாறுகின்றன:

- *"ஒரு native பொருளை — வீடியோ மேற்பரப்பு, map view, browser engine — Majorsilence.Forms
  கட்டுப்பாடு ஒன்றுக்குள் எப்படி வைப்பது?"*
- *"ஒரு கட்டுப்பாட்டுக்கான `HWND` ஐ, அதைக் கேட்கும் library ஒன்றுக்குக் கொடுப்பதற்காக, எப்படிப் பெறுவது?"*

இரண்டாவதற்கான சுருக்கமான பதில்: **பெற முடியாது, போலியான ஒன்றை உருவாக்கவும் கூடாது**. அது அரிதாகவே
தேவைப்படும், ஏனெனில் முதலாவதற்கு ஒரு உண்மையான பதில் உள்ளது: [`NativeControlHost`](#the-seam-nativecontrolhost).

உண்மையான WinForms பயன்பாடு ஒன்றுக்குள் Majorsilence.Forms சாளரம் ஒன்றை ஹோஸ்ட் செய்வது எதிர்த்திசை;
அது [`winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) இல் விளக்கப்பட்டுள்ளது.

## இங்கே handles ஏன் உண்மையானவை அல்ல
{:#why-handles-arent-real-here}

Majorsilence.Forms தனது வரைதல் அனைத்தையும் தானே ஒரே Skia மேற்பரப்பில் செய்கிறது. ஒவ்வொரு
பின்தளமும் (backend) அதன் கீழுள்ள toolkit இன் அதே மாதிரியைப் பின்பற்றுகிறது: **ஒவ்வொரு top-level
சாளரத்துக்கும் ஒரு ஹோஸ்ட் சாளரம் — desktop பின்தளங்களில் உண்மையான OS சாளரம் — அதற்குள் உள்ள அனைத்தும்
வரையப்படுகின்றன, native child சாளரங்களிலிருந்து தொகுக்கப்படுவதில்லை.** ஒரு `Button` என்பது canvas
ஒன்றின் மீதான வரைதல் செயல்பாடுகள் மட்டுமே. அதன் பின்னால் OS பொருள் எதுவும் இல்லாததால், `HWND` உம் இல்லை.

| Member | மதிப்பு | ஏன் |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | அறிவிப்பதற்கு கட்டுப்பாடு வாரியான OS சாளரம் எதுவும் இல்லை. அதை வாசிப்பது upstream இன் பக்க விளைவை இன்னும் கொண்டுள்ளது — அது கட்டுப்பாட்டின் handle நிலையை உருவாக்குகிறது, எனவே `IsHandleCreated` true ஆகிறது, `HandleCreated` எழுகிறது; `_ = control.Handle;` எழுதப்படுவது இதற்காகத்தான். `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle` இற்கும் இதே மதிப்பு. |
| `WindowBase.Handle` | ஒளிபுகா (opaque) பூஜ்ஜியமற்ற token | **இது `HWND` அல்ல.** `Invoke` இற்கு முன் handle உருவாக்கத்தைக் கட்டாயப்படுத்த WinForms code வழமையாக `.Handle` ஐ வாசிக்கிறது; பூஜ்ஜியத்தைத் தருவது அந்த வழக்கத்தை உடைக்கும். Managed code இற்குள் மட்டுமே அர்த்தமுள்ளது. |
| `WindowBase.PlatformHandle` | உண்மையான native handle, அல்லது `IntPtr.Zero` | உண்மையானது, `IWindowBackend.TryGetPlatformHandle()` வழியாக. Avalonia பின்தளத்தால் செயல்படுத்தப்பட்டுள்ளது — Windows இல் `HWND`, macOS இல் `NSWindow`, X11 இல் `XID` — மேலும் Windows இற்கு மட்டுமான WinForms பின்தளத்தாலும், அது தனது படிவத்தின் `HWND` ஐத் தருகிறது. தற்போது Uno, Headless இல் பூஜ்ஜியம். |

### போலியாக்குதல் பற்றிய விதி
{:#the-rule-about-faking}

போலியாக உருவாக்கப்பட்ட handle ஒன்று **நீங்கள் கட்டுப்படுத்தும் managed code ஊடாக மட்டும் சுற்றி வரும்வரை
மட்டுமே** பாதுகாப்பானது — `WindowBase.Handle` செய்வது சரியாக அதுவே, அதன் நோக்கமும் அது மட்டுமே. அது
native code இற்குள் கடக்கும் கணத்திலேயே பாதுகாப்பற்றதாகிறது.

Native libraries நீங்கள் கொடுக்கும் handle ஐ வெறுமனே சேமித்து வைப்பதில்லை. LibVLC இன்
`libvlc_media_player_set_hwnd`, mpv இன் `--wid`, GStreamer இன் `GstVideoOverlay.set_window_handle`
அனைத்தும் அதை OS இற்குக் கடத்துகின்றன — `SetParent`, `CreateWindowEx`, `GetClientRect`, `SetWindowPos`,
`XReparentWindow`. அவற்றுக்கு ஒரு புனைந்த எண்ணைக் கொடுத்தால் இரண்டில் ஒரு விளைவு கிடைக்கும், இரண்டாவது
மோசமானது:

1. அழைப்பு தோல்வியடைகிறது; உங்களுக்கு ஒரு கறுப்புச் செவ்வகம் அல்லது native library க்குள் ஒரு crash கிடைக்கிறது.
2. அழைப்பு *வேறொன்றுக்குச் சொந்தமான சாளரம் ஒன்றின் மீது வெற்றிபெறுகிறது.* `HWND`கள் pointers அல்ல,
   handle-table குறியீடுகள் (indices); சிறிய முழு எண்கள் உயிர்ப்புள்ள மதிப்புகள். Hash code என்பது
   உண்மையான சாளரம் ஒன்றுடன் மோதக்கூடிய எண்ணின் சரியான வடிவம்.

எனவே: OS ஐ அடையும் எதற்கும் ஒருபோதும் handle ஒன்றைச் செயற்கையாக உருவாக்காதீர்கள். கீழே உள்ள இரண்டு
வழிகளில் ஒன்றைப் பயன்படுத்துங்கள்.

## இணைப்புக்கோடு (seam): `NativeControlHost`
{:#the-seam-nativecontrolhost}

`Majorsilence.Forms.NativeControlHost` என்பது கீழுள்ள toolkit இன் native element ஒன்றுக்காக **ஒரு
செவ்வகத்தை ஒதுக்கும்** `Control` ஆகும். அது தானே எதையும் வரைவதில்லை; பின்தளம் உண்மையான element ஐ Skia
மேற்பரப்புக்கு மேலே மேலடுக்கி (overlay), placeholder இன் எல்லைகளுடன் சீரமைத்து வைக்கிறது. பெரும்பாலான
பின்தளங்களில் இது "airspace" interop மாதிரி — native elements ஐ Skia buffer இற்குள் தொகுக்க (composite)
முடியாது, எனவே அவை அதன் மேலே நிலைப்படுத்தப்படுகின்றன. GTK 4 விதிவிலக்கு; அது கீழே விளக்கப்பட்டுள்ளது.

```csharp
var host = new NativeControlHost { Dock = DockStyle.Fill };
host.NativeControl = someAvaloniaControl;   // அல்லது ஒரு Uno UIElement, ஒரு WinForms Control, ஒரு Gtk.Widget…
panel.Controls.Add (host);
```

ஹோஸ்ட் எல்லைகளையும், scroll ஆகும் ஒவ்வொரு மூதாதையினதும் வெட்டும் clip பகுதியையும், முழு parent
சங்கிலியிலும் உள்ள பயனுள்ள காட்சிநிலையையும் (visibility) கண்காணித்து, மூன்றையும் பின்தளத்துக்கு
அனுப்புகிறது. Paint இலும் visibility மாற்றங்களிலும் மீள்-ஒத்திசைவு தானாக நடக்கிறது; வழமையான paint
சுழற்சிக்கு வெளியே ஹோஸ்டை நகர்த்தினால் அல்லது அளவு மாற்றினால் `SyncNativeControl()` ஐ நீங்களே அழையுங்கள்.

`INativeControlHostBackend` என்பது விருப்பத்தேர்வான ஒரு பின்தளத் திறன் ஆகும் (காண்க
[பின்தளங்கள்]({{ '/ta/backends/' | relative_url }})). எந்தப் பின்தளங்கள் அதைச் செயல்படுத்துகின்றன, அவை
எதை எதிர்பார்க்கின்றன:

| பின்தளம் | `NativeControl` இன் எதிர்பார்க்கப்படும் வகை | நடத்தை |
|---|---|---|
| Avalonia (window host, ஒற்றைக் காட்சி host, presenter) | `Avalonia.Controls.Control` | Skia மேற்பரப்புக்கு மேலே உள்ள overlay `Canvas` இல் சேர்க்கப்படுகிறது. |
| Uno (window host, presenter) | `Microsoft.UI.Xaml.UIElement` | `SKXamlCanvas` இற்கு மேலே உள்ள root `Canvas`/panel இல் சேர்க்கப்படுகிறது. |
| WinForms / WPF (window host, presenter) | `System.Windows.Forms.Control` / `System.Windows.FrameworkElement` | Skia கட்டுப்பாட்டுக்கு மேலே உள்ள overlay அடுக்கில் சேர்க்கப்படுகிறது. |
| GTK 4 (window host, presenter) | `Gtk.Widget` | `Gtk.DrawingArea` இற்கு மேலே `Gtk.Overlay` child ஆகச் சேர்க்கப்படுகிறது. **Airspace பிரச்சினை இல்லை** — GTK ஒவ்வொரு widget ஐயும் ஒரே render tree இல் தொகுக்கிறது, எனவே ஹோஸ்ட் செய்யப்பட்ட widget வேறு எந்த widget போலவும் clip ஆகி, கலக்கிறது. |
| Headless, Terminal | — | இந்தத் திறனைச் செயல்படுத்துவதில்லை; ஹோஸ்ட் ஒரு வெற்று placeholder ஆக வரையப்படுகிறது. |

> **தவறான வகையை ஒதுக்குவது மௌனமாகத் தோல்வியடைகிறது.** ஒவ்வொரு பின்தளமும் `NativeControl` இன் வகையைச்
> சரிபார்த்து, பொருந்தாவிட்டால் வெறுமனே திரும்புகிறது. எந்த exception உம் இல்லை, எந்த log உம் இல்லை,
> திரையில் எதுவும் தோன்றாது. உங்கள் native உள்ளடக்கம் தெரியவில்லை என்றால், முதலில் வகையைச் சரிபாருங்கள் —
> Uno பின்தளத்துக்குக் கொடுக்கப்பட்ட Avalonia `Control` ஒன்று, அல்லது மறுதலை, சரியாக இதையே உருவாக்கும்.

### Airspace வரம்புகள்
{:#airspace-limitations}

இவை Avalonia, Uno, WinForms, WPF பின்தளங்களில் ஹோஸ்ட் செய்யப்படும் எந்த native element இற்கும்
பொருந்தும்; இவை சரிசெய்யப்பட வேண்டிய bugs அல்ல, மாதிரியிலேயே உள்ளார்ந்தவை:

- Native element முழு Majorsilence.Forms காட்சிக்கும் **மேலே** வரைகிறது. அதை Majorsilence கட்டுப்பாடுகளுக்கு
  இடையே z-order செய்ய முடியாது; அதனுடன் காட்சியில் மேற்பொருந்தும் எதுவும் — dropdown, tooltip,
  context menu — அதன் கீழேயே வரையப்படுகிறது.
- Clipping செவ்வக வடிவில் மட்டுமே. Majorsilence பக்கத்திலிருந்து வரும் சுழற்சி (rotation), செவ்வகமற்ற
  clips, ஒளிபுகாமை (opacity) அதற்குப் பொருந்தாது.
- Scrolling வேலை செய்கிறது, ஆனால் செலவின்றி அல்ல: ஒவ்வொரு sync இலும் overlay மீள்நிலைப்படுத்தப்படுகிறது,
  எனவே வேகமான scroll இன்போது அது Skia உள்ளடக்கத்துக்குப் பின்தங்குவது கண்ணுக்குத் தெரியலாம். முடிந்தவரை
  ஹோஸ்ட் செய்யப்பட்ட elements ஐ scroll ஆகாத பகுதிகளில் வையுங்கள்.

**GTK 4 விதிவிலக்கு.** Skia மேற்பரப்பு ஒரு `Gtk.Overlay` இற்குள் உள்ளது, ஹோஸ்ட் செய்யப்பட்ட widget ஒரு
overlay child; ஆனால் GTK 4 ஒவ்வொரு widget ஐயும் ஒரே render tree இல் தொகுக்கிறது — எனவே ஹோஸ்ட் செய்யப்பட்ட
widget வேறு எந்த widget போலவும் z-order செய்யப்பட்டு, clip ஆகி, கலக்கப்படுகிறது; மேலுள்ள எச்சரிக்கைகள்
எதுவும் பொருந்தாது. ஒரே ஒரு சமரசம்: viewport இலிருந்து பகுதியாக scroll செய்யப்பட்ட ஹோஸ்ட் ஒன்று தனது
native widget ஐ clip இன் கீழ் நகர்த்துவதற்குப் பதிலாக, தெரியும் பெட்டிக்குள் *மீள்பாய்ச்சுகிறது (reflow)*;
எனவே பாதி scroll செய்யப்பட்ட widget வெட்டப்படுவதற்குப் பதிலாகச் சிறிய செவ்வகத்துக்கு ஏற்ப மீண்டும்
layout ஆகிறது.

## வழி A — உண்மையான native உள்ளடக்கத்தை ஹோஸ்ட் செய்தல்
{:#route-a--hosting-real-native-content}

உண்மையிலேயே OS சாளரமாக இருக்க வேண்டிய ஒன்று தேவைப்படும்போது இதைப் பயன்படுத்துங்கள்: GPU-accelerated
வீடியோ மேற்பரப்பு, native map அல்லது CAD view, browser engine.

முக்கியமானது என்னவென்றால், நீங்கள் **handle ஒன்றைப் போலியாக்கவில்லை — உண்மையான ஒன்றை உருவாக்கி**
அதை native library க்குக் கொடுக்கிறீர்கள். `NativeControl` ஒரு handle ஐ அல்ல, toolkit பொருள் ஒன்றை
ஏற்கிறது; எனவே இடையில் ஒரு wrapper படி உள்ளது. `AvaloniaWebViewHandle` (`Majorsilence.Forms.Avalonia`
இல்), `Gtk4WebViewHandle` (`Majorsilence.Forms.Gtk4` இல்) ஆகியவை tree இல் ஏற்கனவே உள்ள செயல்படும்
உதாரணங்கள்: அவை `Avalonia.Controls.NativeWebView` / `WebKit.WebView` ஐ wrap செய்து
`IWebViewHandle.NativeControl` ஆக வெளிப்படுத்துகின்றன.

**GTK 4 எளிதான சூழல்.** `WebKit.WebView` வெறும் ஒரு `Gtk.Widget`; பின்தளம் அதை Skia மேற்பரப்புக்கு மேலே
உள்ள `Gtk.Overlay` இல் சேர்க்கிறது, GTK அதை அதே render tree இல் தொகுக்கிறது — உருவாக்க handle இல்லை,
airspace இல்லை, தள எல்லை பற்றிய எச்சரிக்கை இல்லை. முழு `IWebViewHandle` (navigation நிகழ்வுகள், JS eval,
script-message bridge) `IWebViewFactory` வழியாக WebKitGTK 6.0 இற்கு எதிராகச் செயல்படுத்தப்பட்டுள்ளது;
அந்தப் பின்தளத்தில் `WebBrowser` உம் webview அடிப்படையிலான compat கட்டுப்பாடுகளும் பயன்படுத்துவது அதையே.

**Avalonia.** `Avalonia.Controls.NativeControlHost` ஐ subclass செய்து
`CreateNativeControlCore (IPlatformHandle parent)` ஐ override செய்யுங்கள்; அது உண்மையான `IPlatformHandle`
ஒன்றைத் தருகிறது — Windows இல் `HWND`, X11 இல் `XID`, macOS இல் `NSView`. உங்கள் child சாளரத்தை அங்கே
உருவாக்கி, அதன் handle ஐ player இற்குக் கொடுத்து, `DestroyNativeControlCore` இல் அதை விடுவித்து,
விளைவான Avalonia கட்டுப்பாட்டை `NativeControlHost.NativeControl` இற்கு ஒதுக்குங்கள்.

**Uno.** `Uno.UI.NativeElementHosting`, `Win32NativeWindow(IntPtr Hwnd)`, `X11NativeWindow(IntPtr WindowId)`
ஆகியவற்றை வெளிப்படுத்துகிறது — நீங்கள் உருவாக்கிய handle ஒன்றைச் சுற்றியுள்ள public wrappers — மேலும்
WASM இற்காக `BrowserHtmlElement`. ஒன்றை `ContentPresenter` ஒன்றின் `Content` ஆக அமைத்து, அதை
`NativeControl` இற்குக் கொடுங்கள்.

**தள எல்லை: handle அடிப்படையிலான வழிகளுக்கு யதார்த்தமாக Windows, X11 மட்டுமே.** Wayland இற்கு
subsurfaces தேவை, macOS உங்களுக்கு `HWND` வடிவிலான எதையும் அல்ல, ஒரு `NSView` ஐத் தருகிறது,
WASM/Android/iOS பயன்படுத்தக்கூடிய window handle எதையுமே தருவதில்லை. இவ்வாறு கட்டப்பட்ட அம்சம்
framework இன் மீதிப் பகுதி இயங்கும் எல்லா இடங்களிலும் இயங்காது. GTK 4 widget வழிக்கு அப்படியான எல்லை
இல்லை — GTK 4 இயங்கும் எல்லா இடங்களிலும், Wayland உட்பட, அது இயங்குகிறது.

## வழி B — handle இல்லாத வீடியோ (பரிந்துரைக்கப்படுகிறது)
{:#route-b--video-without-a-handle-recommended}

பெரும்பாலான வீடியோ libraries ஒரு சாளரத்தை ஏற்பதற்குப் பதிலாக **decode செய்யப்பட்ட frames** ஐ உங்களுக்குத்
தர முடியும்; இது பிரச்சினையிலிருந்து handle ஐ முற்றாக அகற்றுகிறது: LibVLC இன் `libvlc_video_set_callbacks`
(`vmem`), software mode இல் mpv இன் render API, ஒரு GStreamer `appsink`, அல்லது frames ஏற்கனவே உங்களுக்குச்
சொந்தமான FFmpeg.

நீங்கள் ஒரு pixel buffer ஐப் பெற்று, அதை ஒரு `SKBitmap` இற்குள் நகலெடுத்து, வேறு எந்தக் கட்டுப்பாடு
போலவும் `OnPaint` இல் வரைகிறீர்கள்:

```csharp
public class VideoView : Control
{
    private SKBitmap? frame;

    // புதிதாக decode செய்யப்பட்ட BGRA frame உடன், decoder இன் சொந்த callback thread இலிருந்து அழைக்கப்படுகிறது.
    // Output format ஐ அமைக்கும்போது library இடம் width * 4 pitch ஐக் கேளுங்கள்; அப்போது
    // வரும் buffer இடைவெளியின்றி அடுக்கப்பட்டு SKBitmap இன் row layout உடன் பொருந்தும்.
    public void PresentFrame (ReadOnlySpan<byte> bgra, int width, int height)
    {
        if (frame is null || frame.Width != width || frame.Height != height) {
            frame?.Dispose ();
            frame = new SKBitmap (width, height, SKColorType.Bgra8888, SKAlphaType.Premul);
        }

        // ஒரே மொத்த நகல், pixel வாரியாக அல்ல: SKBitmap.SetPixel ஒவ்வொரு அழைப்புக்கும் ஒரு P/Invoke;
        // ஒரு megapixel frame இற்கு அது milliseconds அல்ல, seconds செலவாகும்.
        bgra.CopyTo (frame.GetPixelSpan ());
        frame.NotifyPixelsChanged ();

        // Invalidate() marshal செய்வதில்லை -- அது சாளரம் வரை சென்று, நீங்கள் அழைக்கும் எந்த
        // thread இலும் அதை dirty எனக் குறிக்கிறது. UI thread இற்கு வெளிப்படையாக மாறுங்கள்.
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

இந்த மாதிரி ஒரே bitmap ஐப் பயன்படுத்துகிறது; எனவே decoder அடுத்த frame ஐ எழுதும்போது paint ஒன்று அதை
வாசிக்கலாம் — இது சுமையின் கீழ் crash ஆக அல்ல, tearing ஆகத் தெரியும். இரண்டு bitmaps இடையே மாறுவது (பின்னுள்ள
ஒன்றில் எழுதி, ஒரே reference ஒதுக்கீட்டால் வெளியிடுவது) வழமையான தீர்வு; demo ஒன்றுக்கு அப்பாற்பட்ட
எதற்கும் அதைச் செய்வது பயனுள்ளது.

**இது ஏன் சிறந்த இயல்புநிலை.** Frame, Skia காட்சியின் ஒரு பகுதியாகிறது; எனவே z-order, clipping, scrolling,
opacity, transforms அனைத்தும் வேறு எந்தக் கட்டுப்பாட்டுக்கும் போலவே நடந்துகொள்கின்றன — airspace
எச்சரிக்கைகள் எதுவும் பொருந்தாது. Headless, WASM உட்பட ஒவ்வொரு பின்தளத்திலும் இது வேலை செய்கிறது; இது
அதைச் சோதிக்கக்கூடியதாகவும் ஆக்குகிறது: வரையப்பட்ட pixels மீது assert செய்யலாம். செலவு: ஒவ்வொரு frame
இற்கும் ஒரு CPU நகல், software decode.

## தேர்ந்தெடுத்தல்
{:#choosing}

| | வழி A (native host) | வழி B (frame callbacks) |
|---|---|---|
| Majorsilence உள்ளடக்கத்துடன் தொகுக்கப்படுகிறது | இல்லை — மேலே வரைகிறது (GTK 4: ஆம்) | ஆம் |
| பின்தளங்கள் | Avalonia, Uno, WinForms, WPF, GTK 4 | அனைத்தும், Headless, Terminal உட்பட |
| தளங்கள் | யதார்த்தமாக Windows, X11 (GTK 4: Wayland உம்) | எல்லா இடங்களிலும் |
| GPU decode வழி | ஆம் | இல்லை (software decode + நகல்) |
| CI இல் சோதிக்கக்கூடியது | இல்லை | ஆம் |
| உண்மையான OS handle தேவை | ஆம் (ஒன்றை உருவாக்குங்கள் — ஒருபோதும் போலியாக்காதீர்கள்); GTK 4: இல்லை, ஒரு `Gtk.Widget` | இல்லை |

வீடியோவுக்கு இயல்பாக **B** ஐத் தேர்ந்தெடுங்கள். Browser engine, hardware decode, அல்லது ஒரு சாளரத்துக்குள்
மட்டுமே வரையத் தெரிந்த மூன்றாம் தரப்பு native view தேவைப்படும்போது **A** ஐ நாடுங்கள்.

## அறியப்பட்ட குறைபாடுகள்
{:#known-gaps}

- **Uno, `TryGetPlatformHandle` ஐச் செயல்படுத்துவதில்லை**, எனவே public Uno wrappers
  (`Win32NativeWindow.Hwnd`, `X11NativeWindow.WindowId`) அதை நிரப்பக்கூடியவையாக இருந்தும், அங்கே
  `WindowBase.PlatformHandle` என்பது `IntPtr.Zero`. இதன் பொருள் Uno இல் தள accessibility bridges
  இணைய முடியாது என்பதும் ஆகும்.
- **Framework உடன் media அல்லது வீடியோ கட்டுப்பாடு எதுவும் வழங்கப்படுவதில்லை.** மேலுள்ள இரு வழிகளும்
  ஒருங்கிணைப்பு வழிகாட்டல்கள் மட்டுமே, நீங்கள் instantiate செய்யக்கூடிய `VideoView` அல்ல.
- **வழி A இன் Uno வழி, இயங்கும் பயன்பாடு ஒன்றிலிருந்து அல்ல, public API மேற்பரப்பிலிருந்து
  ஆவணப்படுத்தப்பட்டுள்ளது.** Avalonia வழி tree இல் `AvaloniaWebViewHandle` ஆலும், GTK 4 வழி
  `Gtk4WebViewHandle` ஆலும் (WebKitGTK 6.0 இற்கு எதிராக Wayland இல் சரிபார்க்கப்பட்டது) பயன்படுத்தப்படுகின்றன;
  Uno இற்கு இணையானது அப்படியல்ல.

முழு விவரங்கள் repository இல் உள்ள
[`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) இல் உள்ளன.
