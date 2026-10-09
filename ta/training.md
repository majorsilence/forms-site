---
layout: docs
lang: ta
title: பயிற்சி வழிகாட்டி
subtitle: Majorsilence.Forms மீது பயன்பாடுகளை உருவாக்கி வெளியிடும் பயன்பாட்டுக் குழுக்களுக்கான ஒழுங்கமைந்த பாடத்திட்டம் — ஒவ்வொரு உதாரணமும் C# மற்றும் VB.NET இரண்டிலும். 26.9.0 பதிப்புக்காக 2026 அக்டோபரில் திருத்தப்பட்டது.
seo_title: "பல்தள WinForms பயிற்சி வழிகாட்டி (C# மற்றும் VB.NET)"
description: >-
  ஒரு WinForms பயன்பாட்டைப் பல்தள (cross-platform) அடுக்கில் உருவாக்கும் அல்லது இடம்பெயர்க்கும் குழுக்களுக்கான
  ஒழுங்கமைந்த பாடத்திட்டம் — மன மாதிரி, இடம்பெயர்த்தல், ஏழு பின்தளங்கள், async உரையாடல் சாளரங்கள், தீம்,
  சோதனை, CI. C# மற்றும் VB.NET.
keywords:
  - winforms பயிற்சி
  - winforms tutorial தமிழ்
  - பல்தள winforms
  - winforms இடம்பெயர்த்தல் வழிகாட்டி
  - winforms linux mac
  - vb.net cross platform ui
  - winforms migration guide
priority: "0.8"
permalink: /ta/training/
---

இது, Majorsilence.Forms மீது **ஒரு பயன்பாட்டை** உருவாக்க — அல்லது இடம்பெயர்க்க — தயாராகும் மென்பொருள்
உருவாக்கக் குழுவிடம் கொடுக்க வேண்டிய வழிகாட்டி. இது WinForms அனுபவத்தை மட்டுமே எதிர்பார்க்கிறது.

இது வேண்டுமென்றே framework-ஐப் *பயன்படுத்துவதற்கு* மட்டுப்படுத்தப்பட்டுள்ளது: packages-ஐக் குறிப்பிடுதல்,
படிவங்களை (forms) எழுதுதல், பழைய (legacy) குறியீட்டுத் தளத்தை மாற்றிக் கொண்டுவருதல், உங்கள் இலக்குகளைத்
தேர்ந்தெடுத்தல், நீங்கள் உருவாக்கியதைச் சோதித்தல், அதை வெளியிடுதல். இது பங்களிப்பாளர் (contributor)
வழிகாட்டி **அல்ல** — இதில் எதையும் பின்பற்ற framework-ஐயே clone செய்யவோ build செய்யவோ ஒருபோதும் தேவையில்லை.
(framework-இல் ஏதாவது ஒன்றைச் சரிசெய்ய வேண்டும் என்று நீங்கள் இறுதியில் விரும்பினால், [module 10](#module-10-gaps)
முக்கியமான அந்த ஒரே பத்தியைக் காட்டுகிறது.)

**ஒவ்வொரு குறியீட்டு உதாரணமும் C# மற்றும் VB.NET இரண்டிலும் உள்ளது.** முதல் பதிப்பில் இருந்த C# உதாரணங்கள்
வெளியிடுவதற்கு முன் macOS-இல் compile செய்யப்பட்டு இயக்கப்பட்டன — வழிகாட்டி முழுவதுமுள்ள screenshots
அந்த இயக்கங்களே, போலி வடிவமைப்புகள் (mock-ups) அல்ல; கீழே நீங்கள் படிக்கப்போகும் நேர்மையான எச்சரிக்கைகளில்
இரண்டு, அவற்றை இயக்கியபோதுதான் கண்டுபிடிக்கப்பட்டன. 2026 அக்டோபர் திருத்தத்தில் சேர்க்கப்பட்ட உதாரணங்கள்
(தீம், MVVM, async உரையாடல் சாளரங்கள், புதிய பின்தளங்கள், animation frames, தனிப்பயன் automation நிலை)
இந்த வழிகாட்டிக்காக இயக்கப்படவில்லை; repository-யின் சொந்த ஆவணங்கள் மற்றும் மாதிரிகளுடன் ஒப்பிட்டுச்
சரிபார்க்கப்பட்டன, அது முக்கியமான இடங்களில் அவ்வாறு குறிக்கப்பட்டுள்ளன. இங்கு VB ஒரு முதல்தர இடம்பெயர்த்தல்
இலக்கு: migrator `.vbproj`/`.vb` கோப்புகளைக் கையாள்கிறது, பழைய VB compiler முன்பு தானாக வழங்கிய
constructor-ஐ மீண்டும் செருகுகிறது, ஒரு `My.Resources` accessor-ஐயும் உருவாக்குகிறது. VB-க்கே உரிய மூன்று
எச்சரிக்கைகள் அவை பொருந்தும் இடங்களில் சுட்டிக்காட்டப்பட்டுள்ளன — [`--dual-build` C#-க்கு மட்டுமே](#module-5-dualbuild),
[`My.*` பகுதியளவு மட்டுமே செயல்படுத்தப்பட்டுள்ளது](#module-5-checklist), [சோதனை அமைப்புக்கு VB-இல் module
initializer இல்லை](#module-8-headless).

இதைப் பயன்படுத்த இரண்டு வழிகள்:

| வடிவம் | எப்படி | Modules |
|---|---|---|
| **இரண்டு நாள் பயிலரங்கு** | நாள் 1: modules 0–4 (மாதிரி, முதல் பயன்பாடு, எது வேலை செய்கிறது என்பதை அறிதல், வரைதல்). நாள் 2: modules 5–10 (இடம்பெயர்த்தல், இலக்குகள், interop, சோதனை, நேட்டிவ் உள்ளடக்கம், வெளியிடுதல்). | அனைத்தும் |
| **சுயவேகக் கற்றல்** | Modules 0–3 கட்டாய மையப் பகுதி — அவை இல்லாமல் யாரும் இடம்பெயர்த்தலைத் தொடங்கக் கூடாது. பின்னர் நீங்கள் இடம்பெயர்க்கிறீர்கள் என்றால் 5-ஐயும், புதிதாக ஏதாவது உருவாக்குகிறீர்கள் என்றால் 6 + 8-ஐயும் எடுத்துக்கொள்ளுங்கள். பின்னிணைப்புகள் D, E (தீம், MVVM உதவிகள்) தோற்றத்துக்கும் view-model இணைப்புக்கும் பொறுப்பானவருக்கான விருப்ப வாசிப்பு. | தேர்வு |

கீழே உள்ள ஒவ்வொரு முடிவையும் வடிவமைப்பதால், இரண்டு விஷயங்களை ஆரம்பத்திலேயே ஏற்றுக்கொள்ளுங்கள்.
Majorsilence.Forms **பீட்டா (beta)** நிலையில் உள்ளது: API நிலைப்படுத்தப்பட்டு வருகிறது, WinForms-இன் எல்லா
மூலைகளும் இன்னும் உள்ளடக்கப்படவில்லை — எனவே உங்கள் package பதிப்பை நிலைப்படுத்துங்கள். மேலும் இது
**compile ஆகி தோராயமாக இயங்கும், pixel-perfect அல்ல**: இடம்பெயர்க்கப்பட்ட குறியீடு compile ஆகவும் *இயங்கவும்*
வடிவமைக்கப்பட்டுள்ளது, சில members வேண்டுமென்றே இப்போதைக்கு எதுவும் செய்வதில்லை. எது எது என்று எப்படிக்
கண்டறிவது என்பதைப் பற்றியதே Module 3 முழுவதும்; மெதுவாகப் படிப்பதற்கு அதிகம் பலன் தருவதும் அந்த module-தான்.

---

## உள்ளடக்கம்
{:#contents}

- [Module 0 — முதலில் ஏதாவது ஒன்றை இயக்குங்கள்](#module-0)
- [Module 1 — மன மாதிரி: தானே வரையும் கட்டுப்பாடுகள், மாற்றக்கூடிய ஹோஸ்ட்](#module-1)
- [Module 2 — உங்கள் முதல் பயன்பாடு](#module-2)
- [Module 3 — அதன் மேல் கட்டுவதற்கு முன் எது வேலை செய்கிறது என்பதை அறிதல்](#module-3)
- [Module 4 — வரைதலும் தனிப்பயன் வரைதலும்](#module-4)
- [Module 5 — உங்கள் WinForms பயன்பாட்டை இடம்பெயர்த்தல்](#module-5)
- [Module 6 — உங்கள் இலக்குகளைத் தேர்ந்தெடுத்தல்](#module-6)
- [Module 7 — Windows-இல் படிப்படியான ஏற்பு](#module-7)
- [Module 8 — உங்கள் பயன்பாட்டைச் சோதித்தல்](#module-8)
- [Module 9 — நேட்டிவ் உள்ளடக்கமும் வீடியோவும்](#module-9)
- [Module 10 — வெளியிடுதல்: CI, பதிப்பு மேலாண்மை, புதுப்பித்த நிலையில் இருத்தல்](#module-10)
- [பின்னிணைப்பு A — அறிகுறி வாரியான சிக்கல் தீர்வு](#appendix-a)
- [பின்னிணைப்பு B — உண்மையான குறியீட்டுத் தளத்துக்கான அறிமுகத் திட்டம்](#appendix-b)
- [பின்னிணைப்பு C — குறிப்பு அட்டை](#appendix-c)
- [பின்னிணைப்பு D — CSS மூலம் உங்கள் பயன்பாட்டுக்குத் தீம் அமைத்தல்](#appendix-d)
- [பின்னிணைப்பு E — MVVM உதவிகள்](#appendix-e)

---

## Module 0 — முதலில் ஏதாவது ஒன்றை இயக்குங்கள்
{:#module-0}

**விளைவு:** ஒவ்வொரு டெவலப்பரும் தனது சொந்த OS-இல் தனக்கென ஒரு பயன்பாட்டை இயக்கியிருப்பார், "இந்த framework X-ஐச்
செய்யுமா" என்பதை எங்கே பார்க்க வேண்டும் என்றும் அறிந்திருப்பார்.

உங்களுக்குத் தேவையானது [.NET 10 SDK](https://dotnet.microsoft.com/download) மட்டுமே. Windows தேவையில்லை, Visual
Studio தேவையில்லை, platform workloads தேவையில்லை, framework மூலக் குறியீடும் தேவையில்லை.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

இதோ இயங்கும் ஒரு பல்தள பயன்பாடு. உருவாக்கப்பட்டதன் வடிவத்தைக் கவனியுங்கள், ஏனெனில் அதுவே நீங்கள்
தக்கவைக்க வேண்டிய வடிவம்: **இரண்டு திட்டங்கள் கொண்ட ஒரு solution** — `MainForm`-ஐயும் அதன் Designer கோப்பையும்
வைத்திருக்கும் ஒரு சாதாரண class library ஆன `MajorsilenceFormsApp.Shared`, மற்றும் Avalonia பின்தளத்தின் (backend)
மேல் அமைந்த மெல்லிய desktop *head* ஆன `MajorsilenceFormsApp`. உங்கள் படிவங்கள் பகிரப்பட்ட library-இல் இருக்கும்;
ஒரு head என்பது ஒரு entry point-உம் ஒரு பின்தளமும் மட்டுமே. படிவங்களைத் தொடாமல், இன்னொரு head-ஐச் சேர்ப்பதன்
மூலம் அதே UI-ஐப் பின்னர் ஒரு தொலைபேசியிலோ browser-இலோ இயக்க முடிவது இதனால்தான் ([module 6](#module-6)):

```
dotnet new majorsilenceforms -n MyApp --IncludeAndroid --IncludeWasm --IncludeiOS
```

ஒவ்வொரு switch-உம் ஒரு head திட்டத்தைச் சேர்க்கிறது, அதற்கான workload-ஐயும் கோருகிறது (`android`, `wasm-tools`,
`ios` — கடைசியானது Mac-இல் மட்டும்); மூன்றுமே இயல்பாக off, எனவே சாதாரண கட்டளை கூடுதல் workload எதுவும்
நிறுவப்படாமலேயே build ஆகிறது. `--msformsVersion`, `--avaloniaVersion` ஆகியவை scaffold குறிப்பிடும் package
பதிப்புகளை நிலைப்படுத்துகின்றன.

இப்போது குறிப்புப் பொருட்கள்.

**உங்கள் API ஆவணமே கட்டுப்பாட்டுக் காட்சியகம் (control gallery).** தனியான API குறிப்பு இன்னும் இல்லை, எனவே
"`TreeView` X-ஐ ஆதரிக்கிறதா" என்பதற்கு வேகமான பதில் gallery தான் — ஒவ்வொரு உள்ளமைந்த கட்டுப்பாட்டுக்கும் (control)
ஒரு demo panel. விரைவான பார்வைக்கு எந்தச் செலவும் இல்லை: [நேரடி browser காட்சியகம்]({{ '/gallery/' | relative_url }})
என்பது WebAssembly-க்கு compile செய்யப்பட்ட உண்மையான framework, எதையும் நிறுவத் தேவையில்லை.

![Button panel தேர்ந்தெடுக்கப்பட்ட நிலையில் macOS-இல் இயங்கும் ControlGallery மாதிரி]({{ '/assets/img/gallery-macos.png' | relative_url }})

*macOS 26-இல் `ControlGallery`, Avalonia பின்தளம், `Button` panel தேர்ந்தெடுக்கப்பட்டுள்ளது. எது framework-உடையது,
எது இல்லை என்பதைக் கவனியுங்கள்: traffic-light தலைப்புப் பட்டை OS-உடையது; அதற்குக் கீழே உள்ள ஒவ்வொரு pixel-உம் —
nav tree, அதன் scrollbar, button வகைகள் — Skia மூலம் Majorsilence.Forms வரைகிறது.*

ஒரு கட்டுப்பாட்டைப் பார்ப்பது மட்டுமல்லாமல் அதன் பின்னாலுள்ள குறியீட்டைப் படிக்க வேண்டியிருக்கும்போது,
repository-யை அதன் [`samples/`]({{ site.github_url }}/tree/main/samples) கோப்புறைக்காக clone செய்து, நீங்கள்
படிக்க விரும்புவதை இயக்குங்கள்:

```
git clone https://github.com/majorsilence/Majorsilence.Forms.git
dotnet run --project samples/Gallery.Avalonia   # காட்சியகம், desktop பின்தளத்தில்
dotnet run --project samples/Explorer           # ஒரு Windows Explorer நகல்
dotnet run --project samples/Outlaw             # ஒரு Outlook நகல்
```

> **மாதிரிகளை `dotnet run --project …` மூலமாகவோ, build output கோப்புறையிலிருந்தோ இயக்குங்கள் — repo root-இலிருந்து
> அல்ல.** ஒவ்வொரு மாதிரியும் icons-ஐ ஒரு *சார்பு* (relative) பாதை வழியாக ஏற்றுகிறது (`ImageLoader` `"Images"`-ஐப்
> பயன்படுத்துகிறது), அது assembly இருப்பிடத்துக்கு எதிராக அல்ல, **process working directory**-க்கு எதிராகத்
> தீர்க்கப்படுகிறது. build செய்யப்பட்ட executable-ஐ வேறு எங்கிருந்தாவது இயக்கினால் ஒவ்வொரு icon கோப்பும்
> கிடைக்காமல் போகும் — `Bitmap(string)` exception எறிவதற்குப் பதிலாக 1×1 placeholder-ஆகத் தரம் குறைகிறது,
> எனவே பயன்பாடு சுத்தமாகத் தொடங்கும், எதையும் log செய்யாது, ஒவ்வொரு icon-உம் கண்ணுக்குத் தெரியாமல் வரையும்.
>
> இதை ஒருமுறை வேண்டுமென்றே செய்து பாருங்கள், ஏனெனில் **உங்கள் சொந்தப் பயன்பாடும் இந்த நடத்தையைப் பெறுகிறது**.
> உங்கள் குறியீட்டில் இதற்கான தீர்வு, assets-ஐ assembly இருப்பிடத்துக்கு எதிராகத் தீர்ப்பது:
>
> **C#**
>
> ```csharp
> using Majorsilence.Forms.Drawing;
>
> static readonly string ImageRoot =
>     Path.Combine (AppContext.BaseDirectory, "Images");
>
> public static Bitmap Load (string fileName)
>     => new Bitmap (Path.Combine (ImageRoot, fileName));
> ```
>
> **VB.NET**
>
> ```vb
> Imports System.IO
> Imports Majorsilence.Forms.Drawing
>
> Private Shared ReadOnly ImageRoot As String =
>     Path.Combine(AppContext.BaseDirectory, "Images")
>
> Public Shared Function Load(fileName As String) As Bitmap
>     Return New Bitmap(Path.Combine(ImageRoot, fileName))
> End Function
> ```
>
> இது [அமைதியான no-op தோல்வி முறையின்](#module-3-cost) ஒரு சிறிய வடிவம்; வேலை செய்யும் என்று உங்களுக்கு
> *தெரிந்த* ஒரு மாதிரியில் இதைச் சந்திப்பது, production-இல் முதல்முறையாகச் சந்திப்பதைவிட மிக மலிவானது.

**பயிற்சி 0.** வார்ப்புருப் (template) பயன்பாட்டை உருவாக்கி, இயக்கி, ஒரு `MessageBox`-ஐக் காட்டும் `Button` ஒன்றைச்
சேருங்கள். பின்னர் நேரடிக் காட்சியகத்தைத் திறந்து, உங்கள் சொந்தப் பயன்பாடு சார்ந்திருக்கும் மூன்று கட்டுப்பாடுகளைக்
கண்டுபிடியுங்கள்.

---

## Module 1 — மன மாதிரி: தானே வரையும் கட்டுப்பாடுகள், மாற்றக்கூடிய ஹோஸ்ட்
{:#module-1}

**விளைவு:** எந்த WinForms வழக்கங்கள் (idioms) மாற்றமின்றி அப்படியே வரும், எவை வேறுவிதமாக நடந்துகொள்ளும்,
எவை வேலை செய்யவே முடியாது என்பதை — தேடிப் பார்ப்பதன் மூலம் அல்ல, அடிப்படைக் கொள்கைகளிலிருந்தே — நீங்கள்
முன்கணிக்க முடியும்.

ஒரே ஒரு கட்டமைப்பு (architectural) உண்மை உள்ளது; கிட்டத்தட்ட மற்ற அனைத்தும் அதிலிருந்தே பிறக்கின்றன:

> **Majorsilence.Forms தனது வரைதல் (rendering) அனைத்தையும் SkiaSharp மூலம் தானே செய்கிறது. அதன் கீழுள்ள
> windowing toolkit ஒரு ஹோஸ்ட் (host) மட்டுமே.**

```
        Your app  (Forms, controls, Designer files — the WinForms model you know)
            │
       Majorsilence.Forms  (controls + WinForms-compatible API, drawn with SkiaSharp)
            │
   Swappable host backend
   ├─ Avalonia   → Windows · macOS · Linux  (default)  · also Android · iOS · Browser
   ├─ Uno        → desktop · iOS · Android · WebAssembly
   ├─ GTK 4      → Linux first (real Gtk.Window); Windows/macOS with the GTK runtime
   ├─ Terminal   → a console (Kitty graphics / Sixel / Unicode blocks) — single-view, like a phone
   ├─ WinForms   → Windows only; real System.Windows.Forms windows — a *migration* backend
   ├─ WPF        → Windows only; a real WPF Window — the same migration idea
   └─ Headless   → offscreen rendering for tests / CI
```

ஏழு பின்தளங்கள், ஒரே தொகுப்புப் படிவங்கள். Windows-க்கு மட்டுமான இரண்டும் ஒரே நோக்கத்துக்காக உள்ளன — ஒரு
WinForms அல்லது WPF பயன்பாடு Majorsilence.Forms-ஐ ஒவ்வொரு கட்டுப்பாடாக ஏற்க அனுமதிப்பது ([module 7](#module-7-c))
— Terminal பின்தளம், ஹோஸ்ட் உண்மையிலேயே மாற்றக்கூடியது என்பதற்கான சான்று: உங்கள் படிவத்தில் உள்ள எதுவும், அது ஒரு
GPU swapchain வழியாகக் காட்டப்படுகிறதா அல்லது ஒரு `▄` எழுத்தின் வழியாகக் காட்டப்படுகிறதா என்பதை அறியாது.

ஒவ்வொரு கட்டுப்பாடும் ஒரு Skia canvas-இல் வரைகிறது. கீழுள்ள ஹோஸ்ட் நேட்டிவ் சாளரங்களை உருவாக்குகிறது, message
loop-ஐ இயக்குகிறது, உள்ளீட்டை வழங்குகிறது, வரையப்பட்ட மேற்பரப்பைக் காட்டுகிறது — அது செய்வது அவ்வளவுதான்.
மைய package எந்த windowing toolkit-ஐயும் குறிப்பிடுவதில்லை; நீங்கள் குறிப்பிடும் பின்தளமே ஒன்றை வழங்குகிறது.
பயன்பாட்டு டெவலப்பரான உங்களுக்கு, அந்த இணைப்புக்கோட்டுக்கு (seam) சரியாக இரண்டு நடைமுறை விளைவுகள் உள்ளன:
**உங்கள் project கோப்பில் உள்ள ஒரு வரி உங்கள் ஹோஸ்டைத் தேர்ந்தெடுக்கிறது** ([module 6](#module-6)), மேலும்
**எந்த toolkit type-உம் உங்கள் குறியீட்டில் ஒருபோதும் தோன்றாது** — WinForms-இல் போலவே, நீங்கள் `Form`, `Control`,
`MouseButtons`, `Keys`, `System.Drawing` value types ஆகியவற்றுக்கு எதிராக எழுதுகிறீர்கள்.

### இதிலிருந்து என்ன பின்தொடர்கிறது
{:#module-1-consequences}

இந்த அட்டவணையே இந்த module-இன் பலன். இதிலுள்ள ஒவ்வொன்றும், மனப்பாடம் செய்வதற்குப் பதிலாக நீங்கள் தர்க்கரீதியாக
வந்தடையக்கூடிய ஒரு நடத்தை வேறுபாடு.

| வரைதல் framework-உடையது, சாளரங்கள் ஹோஸ்ட்டுடையவை என்பதால்… | ஆகவே… |
|---|---|
| ஒவ்வொரு top-level சாளரத்துக்கும் ஒரு நேட்டிவ் OS சாளரம்; அதனுள் உள்ள அனைத்தும் வரையப்படுகின்றன | `Control.Handle` என்பது `IntPtr.Zero`. ஒரு `Button`-க்குப் பின்னால் தெரிவிப்பதற்கு எந்த OS object-உம் இல்லை. [module 9](#module-9) பார்க்கவும். |
| `WindowBase.Handle` இன்னும் WinForms-இன் "உருவாக்கத்தைக் கட்டாயப்படுத்த `.Handle`-ஐத் தொடு" வழக்கத்தை நிறைவு செய்ய வேண்டும் | அது ஒரு **ஒளிபுகா (opaque) பூஜ்ஜியமற்ற token-ஐத் திருப்பித் தருகிறது — `HWND` அல்ல**. அதை ஒருபோதும் நேட்டிவ் குறியீட்டிடம் கொடுக்காதீர்கள். `WindowBase.PlatformHandle` தான் உண்மையானது — Avalonia பின்தளத்தில் (`HWND`/`NSWindow`/`XID`) மற்றும் WinForms பின்தளத்தில் (ஒரு உண்மையான `HWND`) உண்மையானது; மற்ற இடங்களில் பூஜ்ஜியம். |
| framework தனது சொந்த canvas-ஐக் காட்சித் திரைக்கு ஏற்ப அளவிடுகிறது | **ஒரு `Control`-இல் நீங்கள் காணும் அனைத்தும் தருக்க அலகுகளில் (logical units) உள்ளன** — `Width`/`Height`/`Bounds`, `MouseEventArgs`, மேலும் (2026-10-01 முதல்) `ClientRectangle`, `ClientSize`, paint canvas ஆகியவையும். சாதாரண WinForms layout மற்றும் paint குறியீடு, எந்த மாற்றமும் இல்லாமல் எந்த அளவிடுதலிலும் (scaling) சரியான அளவில் இருக்கும். சாதனப் பிக்சல்கள் (device pixels) விருப்பத்தின் பேரில் மட்டும் (`ScaledBounds`, `PaintEventArgs.Scaling`, `LogicalToDeviceUnits`). ஒரே விதிவிலக்கு: owner-draw நிகழ்வுகள் (`DrawItem`, `DrawNode`, `CellPainting`, …) இன்னும் சாதனப் பிக்சல் `Graphics`-உடன் சாதனப் பிக்சல் எல்லைகளையே தருகின்றன. [module 4](#module-4-paint) பார்க்கவும். |
| தோற்றம் Win32-ஆல் அல்ல, framework-ஆல் தீர்மானிக்கப்படுகிறது | `BackColor`, `ForeColor`, `Font` ஆகியவை **சூழல்சார் (ambient)** — கீழுள்ள உதாரணத்தைப் பார்க்கவும். framework அனைத்தையும் வரைவதால், ஒரே CSS stylesheet முழுப் பயன்பாட்டின் பாணியையும் மாற்ற முடியும் ([பின்னிணைப்பு D](#appendix-d)). |
| உள்ளீட்டு வழிச்செலுத்தல் (input routing) framework-உடையது | **Mouse capture, அதை எடுத்த கட்டுப்பாட்டுக்கே முழு gesture முழுவதும் சொந்தம்** — ஒரு container மீது தொடங்கிய drag, அதன் மேலுள்ள ஒரு button-ஐக் கடந்தாலும் தொடர்கிறது. தானே capture எடுக்கும் ஒரு child, அதன் முன்னோர்களை (ancestors) விட இன்னும் முன்னுரிமை பெறுகிறது. |
| இங்கே ஒரு `Form` என்பது `Control` அல்ல — அது ஒரு internal `WindowBase`-இலிருந்து பெறப்படுகிறது | பொதுவான `Control` members `Form`-இல் உள்ளன (`Anchor`, `Dock`, `TabIndex`, `Padding`/`Margin`, `Parent`, `MouseEnter`/`MouseLeave`), ஆனால் ஒரு `Form`-ஐ இன்னும் `Control.ControlCollection`-இல் வைக்க முடியாது, `Control`-type கொண்டு ஒரு tree-ஐ walk செய்வதன் மூலம் கண்டுபிடிக்கவும் முடியாது. |
| Touch என்பது mouse போலச் செய்தல் அல்ல, முதல்தர உள்ளீடு | `Control` `LongPress`, `Pinch`, `Swipe`, `ScrollGesture` ஆகியவற்றை எழுப்புகிறது. **இவற்றில் எதுவும் mouse-க்கு fire ஆவதில்லை.** `ScrollableControl` ஏற்கனவே `ScrollGesture`-ஐ `AutoScrollPosition`-க்குப் பயன்படுத்துகிறது, எனவே உங்கள் `Panel`/`ListBox`/`TreeView` subclasses குறியீட்டு மாற்றம் எதுவுமின்றி touch panning-ஐப் பெறுகின்றன. |

**சூழல்சார் தோற்றம் (ambient appearance) — தப்பிப் பிழைக்கும் WinForms வழக்கம்.** `BackColor`, `ForeColor`, `Font`
ஒவ்வொன்றும் முதலில் கட்டுப்பாட்டின் சொந்த style chain-ஐயும், பின்னர் parent chain-ஐயும், பின்னர் ஹோஸ்ட் செய்யும்
சாளரத்தையும், பின்னர் தீமையும் பார்க்கின்றன. எனவே ஒரு container-க்கு ஒருமுறை நிறம் கொடுத்து அதன் children அதை
எடுத்துக்கொள்ள விடுவது, நீங்கள் எதிர்பார்ப்பது போலவே சரியாக வேலை செய்கிறது:

**C#**

```csharp
var panel = new Panel {
    BackColor = Color.FromArgb (32, 32, 32),
    ForeColor = Color.White,                 // children இதைப் பெறுகின்றன…
    Dock = DockStyle.Fill
};

panel.Controls.Add (new Label  { Text = "Inherits white text", Left = 12, Top = 12 });
panel.Controls.Add (new Button { Text = "So does this",        Left = 12, Top = 40 });

// …ஆனால் ஒரு உள்ளீட்டு மேற்பரப்பு தனது பின்னணியைத் தானே நிலைநிறுத்துகிறது, ஏனெனில் WinForms அதற்கு SystemColors.Window-ஐத் தருகிறது.
panel.Controls.Add (new TextBox { Left = 12, Top = 80, Width = 200 });   // வெளிர் நிறமாகவே இருக்கும்
Controls.Add (panel);
```

**VB.NET**

```vb
Dim panel As New Panel With {
    .BackColor = Color.FromArgb(32, 32, 32),
    .ForeColor = Color.White,
    .Dock = DockStyle.Fill
}

panel.Controls.Add(New Label With {.Text = "Inherits white text", .Left = 12, .Top = 12})
panel.Controls.Add(New Button With {.Text = "So does this", .Left = 12, .Top = 40})

' ஒரு உள்ளீட்டு மேற்பரப்பு தனது பின்னணியைத் தானே நிலைநிறுத்துகிறது, ஏனெனில் WinForms அதற்கு SystemColors.Window-ஐத் தருகிறது.
panel.Controls.Add(New TextBox With {.Left = 12, .Top = 80, .Width = 200})   ' வெளிர் நிறமாகவே இருக்கும்
Controls.Add(panel)
```

![macOS-இல் இயங்கும் சூழல்சார் தோற்ற உதாரணம்]({{ '/assets/img/example-ambient.png' | relative_url }})

*அதே குறியீடு, இயங்கும் நிலையில். `Label`, `Button` தலைப்புகள் panel-இலிருந்து வெள்ளை நிறத்தைப் பெற்றன;
`TextBox` தனது சொந்த வெளிர் பின்னணியைத் தக்கவைத்தது.*

அந்த வேண்டுமென்றே அமைந்த சமச்சீரின்மை — containers கீழ்நோக்கிப் பரவுகின்றன, `TextBox`/`ComboBox` அப்படிச்
செய்வதில்லை — "என் dark theme ஏன் பாதி மட்டுமே பொருந்தியுள்ளது" என்ற மிகப் பொதுவான கேள்விக்குக் காரணம்;
அது WinForms-படி சரியானதே.

இவை அனைத்தும் தரும் கையடக்கத் தன்மை (portability) கண்ணுக்குத் தெரிகிறது. அதே `Explorer` மாதிரி, மூன்று
இயக்க முறைமைகள், ஒரே குறியீட்டுத் தளம்:

![Windows-இல் Explorer மாதிரி]({{ '/assets/img/explorer-windows.png' | relative_url }})

*Windows — திட்டத்தின் சொந்த ஆவணங்களிலிருந்து.*

![Ubuntu-வில் Explorer மாதிரி]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

*Ubuntu (AMD64) — திட்டத்தின் சொந்த ஆவணங்களிலிருந்து.*

![macOS-இல் Explorer மாதிரி]({{ '/assets/img/explorer-macos.png' | relative_url }})

*macOS 26 — தற்போதைய build-இலிருந்து பிடிக்கப்பட்டது.*

**பயிற்சி 1.** தேடாமல், மேலுள்ள அட்டவணையிலிருந்து பதிலளியுங்கள்: `myButton.Handle`-ஐ ஒரு நேட்டிவ் video
library-க்குக் கொடுத்தால் என்ன நடக்கும், அதற்குப் பதிலாக என்ன செய்ய வேண்டும்? பின்னர் உங்கள் சொந்த WinForms
குறியீட்டுத் தளத்தில், ஒரு container-இல் `BackColor`-ஐ அமைத்து children அதைப் பெறுவதைச் சார்ந்திருக்கும்
ஓர் இடத்தைக் கண்டுபிடித்து, அது இன்னும் வேலை செய்யுமா என்று முன்கணியுங்கள்.

---

## Module 2 — உங்கள் முதல் பயன்பாடு
{:#module-2}

**விளைவு:** இரண்டு மொழிகளில் எதிலும், ஒரு Majorsilence.Forms பயன்பாட்டை ஆரம்பத்திலிருந்து உருவாக்கவும், ஒவ்வொரு
வரியும் என்ன செய்கிறது என்பதை விளக்கவும் உங்களால் முடியும்.

### Project கோப்பு
{:#module-2-project}

ஒரு console பயன்பாட்டிலிருந்து தொடங்கி, மூன்று விஷயங்களை மாற்றுங்கள்.

**C# — `MyApp.csproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
  </ItemGroup>
</Project>
```

**VB.NET — `MyApp.vbproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>MyApp</RootNamespace>
    <OptionStrict>On</OptionStrict>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
  </ItemGroup>
</Project>
```

VB பதிப்பில் **இல்லாதது** எது என்பதைக் கவனியுங்கள்: `MyType` இல்லை, VB application framework இல்லை. migrator-ஆல்
மறைக்க முடியாத ஒரே கட்டமைப்பு வேறுபாடு அதுதான்; [`--dual-build` VB-க்கு வழங்கப்படாததற்கும்](#module-5-dualbuild)
அதுவே காரணம்.

Target frameworks பற்றி ஒரு குறிப்பு, ஏனெனில் இடம்பெயர்த்தல் முதலில் நீக்குவது `-windows` பின்னொட்டைத்தான்:
ஒரு பல்தள head-க்குத் தேவையானது சாதாரண `net10.0` (அல்லது `net8.0`) மட்டுமே. மைய packages (`Majorsilence.Forms`,
`Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`) ஒரு **`netstandard2.0`** build-ஐயும் வழங்குகின்றன;
அதுதான் ஒரு பழைய **.NET Framework 4.8** பயன்பாடு இந்தக் கட்டுப்பாடுகளைக் குறிப்பிட அனுமதிக்கிறது — WinForms
அல்லது WPF பின்தளத்தின் `net48` வரிசையுடன் இணைந்து ([module 7](#module-7-c)). பல்தள பின்தளங்கள் `net8.0`+ மட்டுமே.

**இரண்டு packages-உம் தேவை — பயிற்சியில் இதை உரக்கச் சொல்ல வேண்டும்.** மைய `Majorsilence.Forms` package எந்த
windowing toolkit-ஐயும் குறிப்பிடுவதில்லை — SkiaSharp-ஐ மட்டுமே. கட்டுப்பாடுகளும் வரைதலும் அதனுடையவை; ஆனால்
அதனால் திரையில் ஒரு சாளரத்தை வைக்க முடியாது. அதைச் செய்யும் பின்தளம் `Majorsilence.Forms.Avalonia`; அதைக்
குறிப்பிடுவதுதான் பயன்பாட்டை Windows, macOS, Linux-இல் *இயக்கக்கூடியதாக* ஆக்குகிறது. வேறொரு ஹோஸ்டை இலக்காகக்
கொள்ள, அந்த இரண்டாவது வரியை `Majorsilence.Forms.Uno`, `.Gtk4`, `.Terminal`, `.WinForms`, `.Wpf` அல்லது `.Headless`
என மாற்றுங்கள் — அந்த ஒரு வரி (இயல்பல்லாத பின்தளங்களுக்கு, அதனுடன் ஒரு வரி தேர்வுக் குறியீடு) தான் முழு
மாற்றமும் ([module 6](#module-6)).

### மிகச் சிறிய முழுமையான பயன்பாடு
{:#module-2-code}

**C#**

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}

static class Program
{
    [STAThread]
    static void Main (string [] args)
    {
        Application.Run (new MainForm ());
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Public Class MainForm
    Inherits Form
End Class

Module Program
    <STAThread>
    Sub Main(args As String())
        Application.Run(New MainForm())
    End Sub
End Module
```

அந்தப் பயன்பாடு வேறு எந்த அமைப்பும் இல்லாமல் Windows, macOS, Linux-இல் இயங்குகிறது, ஏனெனில் பின்தளத்தின்
package குறிப்பிடப்பட்டிருக்கும்போது அது தானாகவே தீர்மானிக்கப்படுகிறது. உங்களுக்கு *வேறொரு* பின்தளம் வேண்டுமென்றால்,
**முதல் சாளரம் உருவாக்கப்படுவதற்கு முன்பே** அதை assign செய்யுங்கள்:

**C#**

```csharp
Majorsilence.Forms.Backends.Platform.Backend =
    new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Application.Run (new MainForm ());     // இது பின்னரே வர வேண்டும்
```

**VB.NET**

```vb
Majorsilence.Forms.Backends.Platform.Backend =
    New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Application.Run(New MainForm())        ' இது பின்னரே வர வேண்டும்
```

அந்த வரிசைக் கட்டுப்பாடு உண்மையானது, பலரைச் சிக்கலில் மாட்டுகிறது: ஒரு படிவத்தை உருவாக்குவதே பின்தளத்தைத்
தொடுகிறது. mobile மற்றும் browser entry points ([module 6](#module-6)) ஒரு instance-க்குப் பதிலாக ஒரு *factory*-ஐ
ஏற்பதற்கும் இதுவே காரணம்.

### உண்மையிலேயே ஏதாவது செய்யும் ஒரு படிவம்
{:#module-2-interactive}

குறியீட்டில் layout, ஒரு நிகழ்வு கையாளி (event handler), ஒரு உரையாடல் சாளரம் (dialog), ஒரு modal முடிவு — ஒவ்வொரு
திரைக்கும் தேவையான நான்கு விஷயங்கள். இது சாதாரண WinForms பழக்கமே என்பதைக் கவனியுங்கள்: `Anchor`, `Dock`,
`DialogResult`, `MessageBox`.

**C#**

```csharp
using Majorsilence.Forms;
using System.Drawing;

public class GreetForm : Form
{
    private readonly TextBox nameBox;
    private readonly Button  okButton;

    public GreetForm ()
    {
        Text = "Greeter";
        ClientSize = new Size (360, 140);

        var prompt = new Label {
            Name = "promptLabel", Text = "Your name:",
            Left = 12, Top = 16, Width = 100
        };

        nameBox = new TextBox {
            Name = "nameBox", AccessibleName = "Full name",
            Left = 12, Top = 40, Width = 336,
            Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
        };

        okButton = new Button {
            Name = "okButton", Text = "OK",
            Left = 188, Top = 96, Width = 75,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Right
        };

        var cancelButton = new Button {
            Name = "cancelButton", Text = "Cancel",
            Left = 273, Top = 96, Width = 75,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Right
        };

        okButton.Click     += OkButton_Click;
        cancelButton.Click += (sender, e) => {
            DialogResult = DialogResult.Cancel;
            Close ();
        };

        Controls.Add (prompt);
        Controls.Add (nameBox);
        Controls.Add (okButton);
        Controls.Add (cancelButton);
    }

    private void OkButton_Click (object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace (nameBox.Text)) {
            MessageBox.Show ("Please enter a name.", "Greeter",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        DialogResult = DialogResult.OK;
        Close ();
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports System.Drawing

Public Class GreetForm
    Inherits Form

    Private ReadOnly nameBox As TextBox
    Private ReadOnly okButton As Button

    Public Sub New()
        Text = "Greeter"
        ClientSize = New Size(360, 140)

        Dim prompt As New Label With {
            .Name = "promptLabel", .Text = "Your name:",
            .Left = 12, .Top = 16, .Width = 100
        }

        nameBox = New TextBox With {
            .Name = "nameBox", .AccessibleName = "Full name",
            .Left = 12, .Top = 40, .Width = 336,
            .Anchor = AnchorStyles.Top Or AnchorStyles.Left Or AnchorStyles.Right
        }

        okButton = New Button With {
            .Name = "okButton", .Text = "OK",
            .Left = 188, .Top = 96, .Width = 75,
            .Anchor = AnchorStyles.Bottom Or AnchorStyles.Right
        }

        Dim cancelButton As New Button With {
            .Name = "cancelButton", .Text = "Cancel",
            .Left = 273, .Top = 96, .Width = 75,
            .Anchor = AnchorStyles.Bottom Or AnchorStyles.Right
        }

        AddHandler okButton.Click, AddressOf OkButton_Click
        AddHandler cancelButton.Click,
            Sub(sender As Object, e As EventArgs)
                DialogResult = DialogResult.Cancel
                Close()
            End Sub

        Controls.Add(prompt)
        Controls.Add(nameBox)
        Controls.Add(okButton)
        Controls.Add(cancelButton)
    End Sub

    Private Sub OkButton_Click(sender As Object, e As EventArgs)
        If String.IsNullOrWhiteSpace(nameBox.Text) Then
            MessageBox.Show("Please enter a name.", "Greeter",
                            MessageBoxButtons.OK, MessageBoxIcon.Warning)
            Return
        End If

        DialogResult = DialogResult.OK
        Close()
    End Sub
End Class
```

![macOS-இல் இயங்கும் GreetForm உதாரணம்]({{ '/assets/img/example-greet.png' | relative_url }})

*`GreetForm`, இயங்கும் நிலையில். `Top | Left | Right` anchor காரணமாக `TextBox` சாளரத்துடன் சேர்ந்து நீண்டது;
இரண்டு buttons-உம் கீழ்-வலது மூலையில் நிலையாக இருந்தன.*

பெட்டி காலியாக இருக்கும்போது OK அழுத்தினால், சரிபார்ப்பு (validation) பாதை இயங்குகிறது:

![சரிபார்ப்புப் பாதையிலிருந்து வரும் MessageBox]({{ '/assets/img/example-messagebox.png' | relative_url }})

*`MessageBox.Show` ஒரு உண்மையான modal சாளரத்தைத் திறக்கிறது — அது இருக்க வேண்டியபடியே handler-ஐத் தடுத்து
நிறுத்துகிறது, parent-ஐ முடக்குகிறது. நேர்மையான ஒரு விவரத்தைக் கவனியுங்கள்: `MessageBoxIcon.Warning` ஏற்றுக்கொள்ளப்படுகிறது,
ஆனால் எச்சரிக்கைக் குறியீட்டுப் படம் (glyph) இன்னும் வரையப்படுவதில்லை. அதுதான் செயல்பாட்டிலுள்ள
[stub கொள்கை](#module-3-stub-policy) — அழைப்பு வேலை செய்கிறது, ஒரு காட்சி விவரம் வேலை செய்யவில்லை, எதுவும்
exception எறியவில்லை.*

ஒரு parent படிவத்திலிருந்து அதை modal-ஆகக் காட்டுவது WinForms-இலிருந்து மாறவில்லை:

**C#**

```csharp
using var dialog = new GreetForm ();

if (dialog.ShowDialog (this) == DialogResult.OK)
    statusLabel.Text = "Hello!";
```

**VB.NET**

```vb
Using dialog As New GreetForm()
    If dialog.ShowDialog(Me) = DialogResult.OK Then
        statusLabel.Text = "Hello!"
    End If
End Using
```

கவனிக்க வேண்டிய இரண்டு விஷயங்கள், ஏனெனில் பலர் சிக்குவது இவற்றில்தான்: ஒவ்வொரு ஊடாடும் கட்டுப்பாட்டிலும் உள்ள
`Name` அலங்காரம் அல்ல — அதுவே சோதனை locator-ஆகவும் *மற்றும்* accessibility id-ஆகவும் ஆகிறது ([module 8](#module-8))
— மேலும் C# `|`-ஐப் பயன்படுத்தும் இடத்தில் VB-இல் `Anchor` `AnchorStyles.Top Or AnchorStyles.Left`-ஐப் பயன்படுத்துகிறது;
VB-க்கு மாற்றும்போது மிகப் பொதுவான தட்டச்சுப் பிழை இதுதான்.

மூன்றாவது, உங்கள் roadmap-இல் எங்காவது browser அல்லது phone head இருந்தால்: மேலுள்ள தடுக்கும் (blocking) `ShowDialog`,
`MessageBox.Show` ஆகியவை desktop-க்கு மட்டுமே. browser, Android, iOS வரிசைகளில் அவை எதையும் காட்டுவதற்கு *முன்பே*
`PlatformNotSupportedException` எறிகின்றன; ஒவ்வொரு உரையாடல் சாளரத்துக்கும் await செய்யக்கூடிய இரட்டை உண்டு
(`ShowDialogAsync`, `MessageBox.ShowAsync`). இன்று மாற்ற எதுவும் இல்லை — ஆனால் உங்கள் நூறாவது handler-ஐ எழுதுவதற்கு
முன் [async-உரையாடல் விதியைப்](#module-6-async) படியுங்கள், ஏனெனில் பகிரப்பட்ட UI library-ஐப் பின்னர் மாற்றுவதைவிட
ஆரம்பத்திலிருந்தே async-ஆக எழுதுவது மிக மலிவானது.

### ஒரு உண்மையான பயன்பாடு எப்படி இருக்கும்
{:#module-2-real}

ஒரு தனிப் படிவம் பயிற்சி இலக்கு அல்ல. வணிக (LOB) பயன்பாட்டு வேலைக்கு நகலெடுக்க வேண்டிய வடிவம் `PointOfSale`
மாதிரி — ஒன்றல்ல, நான்கு திட்டங்கள்:

| திட்டம் | பங்கு |
|---|---|
| `PointOfSale.Client` | Majorsilence.Forms desktop பயன்பாடு (படிவங்கள், panels, தனிப்பயன் கட்டுப்பாடுகள், services) |
| `PointOfSale.Api` | JWT auth மற்றும் role-based policies கொண்ட ASP.NET Core minimal API |
| `PointOfSale.Contracts` | இரு பக்கங்களும் பகிரும் DTOs |
| `PointOfSale.Data` | EF Core + SQLite persistence மற்றும் seeding |

UI அடுக்கில் உள்ள எதுவும் உங்கள் கட்டமைப்பைக் கட்டுப்படுத்துவதில்லை: இது ஒரு சாதாரண .NET client, எனவே உங்கள்
தற்போதைய DI, HTTP, logging, persistence தேர்வுகள் அனைத்தும் மாற்றமின்றி அப்படியே தொடர்கின்றன.

"சிக்கலான, பல panes கொண்ட பயன்பாட்டுக்கு இது தாங்குமா?" என்பதற்கான பதில் `Outlaw`:

![macOS-இல் இயங்கும் Outlook நகலான Outlaw மாதிரி]({{ '/assets/img/outlaw-macos.png' | relative_url }})

*macOS 26-இல் `Outlaw` — ஒரு Outlook நகல், வேண்டுமென்றே விளையாட்டு demo அல்ல: icon rail, folder tree,
virtualized message list, status bar — அனைத்தும் Majorsilence.Forms வரைந்தவை. message வரிசை தேர்ந்தெடுக்கப்பட்டுள்ளது;
மாதிரி தேர்வை reading pane-உடன் ஒருபோதும் இணைக்காததால் அது placeholder-ஆகவே இருக்கிறது — இது ஒரு layout மற்றும்
கட்டுப்பாட்டு அடர்த்திப் பயிற்சி, mail client அல்ல.*

**இதை இப்போதே திட்டமிடுங்கள்:** **காட்சி வடிவமைப்பான் (visual designer) இன்னும் இல்லை.** Designer *குறியீடு*
இடம்பெயர்ந்து இயங்குகிறது — `*.Designer.cs`/`*.Designer.vb` முறை அப்படியே பாதுகாக்கப்படுகிறது, உங்கள் control
libraries குறிப்பிடும் design-time types இன்னும் compile ஆகின்றன — ஆனால் runtime-இல் எதுவும் அவற்றை instantiate
செய்வதில்லை, layout-ஐத் திருத்த design மேற்பரப்பும் இல்லை. இது எழுதப்பட்ட திட்டம் உள்ள, விரும்பப்படும் அம்சம்;
தள்ளிவைக்கப்பட்டது அல்ல. Designer கோப்புகளைக் கையால் திருத்துவதற்கோ, மேலே உள்ளது போலக் குறியீட்டில் layout
செய்வதற்கோ நேரம் ஒதுக்குங்கள்.

**பயிற்சி 2.** உங்கள் குழுவின் மொழியில் `GreetForm`-ஐ உருவாக்குங்கள். பின்னர் பின்தள package-ஐ Headless-ஆக
மாற்றி, பயன்பாடு எந்தச் சாளரத்தையும் திறக்காமல் தொடங்கி வெளியேறுவதை உறுதிப்படுத்துங்கள் — சரியாக அதே
அமைப்பை [module 8](#module-8)-இல் மீண்டும் பயன்படுத்துவீர்கள்.

---

## Module 3 — அதன் மேல் கட்டுவதற்கு முன் எது வேலை செய்கிறது என்பதை அறிதல்
{:#module-3}

**விளைவு:** எந்த member-ஐயும் சார்ந்திருப்பதற்கு முன், அது உண்மையிலேயே வேலை செய்கிறதா என்று கண்டறிவது எப்படி
என்று உங்களுக்குத் தெரியும் — framework-இன் தனித்துவமான தோல்வி முறையைப் பார்த்தவுடனே அடையாளம் காண்பீர்கள்.

இந்த வழிகாட்டியின் மிக முக்கியமான module இதுதான். [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)-ஐ
ஒருமுறை முதலிலிருந்து கடைசி வரை படியுங்கள், பின்னர் வேலை செய்யும்போது அதைத் திறந்தே வைத்திருங்கள். அது சரியாக
உங்கள் நிலைமைக்காகவே உள்ளது: எதை நம்புவது என்று தீர்மானிக்கும், WinForms குறியீட்டுத் தளம் கொண்ட ஒரு டெவலப்பர்.

### Stub கொள்கை
{:#module-3-stub-policy}

> **ஒரு member-க்கு இன்னும் வேலை செய்யும் செயல்படுத்தல் இல்லையென்றால், அது `NotImplementedException` எறிவதற்குப்
> பதிலாகப் பாதுகாப்பாக no-op (எதுவும் செய்யாது) ஆகிறது (அல்லது பொருத்தமான இயல்பு மதிப்பைத் திருப்புகிறது).**

இது முழு இணக்க அடுக்கு (compatibility layer) முழுவதும் உள்ள, வேண்டுமென்றே அமைக்கப்பட்ட, சீரான கொள்கை; ஒரு காட்சி
அம்சம் இன்னும் எதுவும் செய்யாத இடத்திலும் இடம்பெயர்க்கப்பட்ட குறியீடு compile ஆகவும் *இயங்கவும்* அனுமதிப்பது
இதுதான். நடைமுறையில்:

- பின்னணி நடத்தை இல்லாத ஒரு property, சாதாரணமாக அமைக்கக்கூடிய ஒரு auto-property — நீங்கள் அமைப்பதைச்
  சேமித்து மீண்டும் தருகிறது, runtime நடத்தையை மட்டும் மாற்றுவதில்லை.
- செயல்படுத்தல் இல்லாத ஒரு method exception எறிவதற்குப் பதிலாக நடுநிலை மதிப்பைத் திருப்புகிறது — உதாரணமாக,
  `ShowDialog()`-க்கு இன்னும் உண்மையான UI இல்லாத ஒரு உரையாடல் சாளரம் உடனடியாக `DialogResult.OK`-ஐத் திருப்புகிறது.
- ஒருபோதும் எழுப்பப்படாத ஒரு நிகழ்வு (event) இன்னும் compile ஆகிறது, அதற்குச் subscribe செய்யவும் முடியும்;
  அது வெறுமனே ஒருபோதும் fire ஆவதில்லை. இது குறைவாகவே பயன்படுத்தப்படுகிறது, matrix-இல் ஒவ்வொரு type-க்கும்
  சுட்டிக்காட்டப்படுகிறது.

**stub ஆவதற்குப் பதிலாக exception எறியும் ஒரு member-ஐச் சந்தித்தால், அது ஒரு bug — அதைத் தெரிவியுங்கள்**
([module 10](#module-10-gaps)).

### அந்தக் கொள்கையின் விலை — உங்கள் குழுவிடம் சொல்ல வேண்டிய கதை
{:#module-3-cost}

அமைதியான no-op தான் கண்டுபிடிக்க மிகக் கடினமான இடைவெளி: அது compile ஆகிறது, இயங்குகிறது, ஒரே அறிகுறி
எங்கோ கீழ்நிலையில் வரும் தவறான வெளியீடு மட்டுமே. அடிப்படை உதாரணத்தை அப்படியே சொல்வது பயனுள்ளது, ஏனெனில்
எந்த விதியையும் விட அது இந்தத் தோல்வி முறையை நன்றாகக் கற்பிக்கிறது:

`Image.MakeTransparent` வெறுமையாக இருந்தது. மாற்றப்பட்ட ஒரு game குறியீடு sprite sheet-இன் பின்னணி நிறத்தை
ஒளிபுகும் (transparent) நிறமாக key செய்தது; அழைப்பு எதுவும் செய்யவில்லை; ஒவ்வொரு sprite-உம் பின்னால் ஒரு வெள்ளைப்
பெட்டியுடன் வரையப்பட்டது. எதுவும் exception எறியவில்லை. grep செய்வதற்கு எதுவும் இருக்கவில்லை.

உங்களுக்கு இதிலிருந்து இரண்டு விஷயங்கள் பின்தொடர்கின்றன. முதலாவது, **ஏதாவது தவறாக வரையப்பட்டால் அல்லது
நடந்துகொண்டால், எதுவும் exception எறியவில்லை என்றால், உங்கள் சொந்தக் குறியீட்டைச் சந்தேகிப்பதற்கு முன் ஒரு stub-ஐச்
சந்தேகியுங்கள்** — சம்பந்தப்பட்ட member-க்கான matrix வரிசையைச் சரிபாருங்கள். இரண்டாவது, அந்த வகை இடைவெளி இப்போது
பாதுகாக்கப்படுகிறது: திட்டம் தனக்குத் தெரிந்த, உடல் வெறுமையான public `void` methods-ஐ ஒரு baseline சோதனையில்
நிலைப்படுத்துகிறது (`NoOpStubBaseline.txt` — இதை எழுதும் நேரத்தில் 161 பதிவுகள்), எனவே புதியது ஒன்றை அமைதியாகச்
சேர்க்க முடியாது, பதிவுகள் வெளியீடுகளோடு குறைந்து வருகின்றன. மூன்று சகோதர baselines மற்ற வகை வெறுமைகளை
நிலைப்படுத்துகின்றன — அறிவிக்கப்பட்டும் செயலற்ற நிகழ்வுகள், ஒருபோதும் எழுப்பப்படாத நிகழ்வுகள், ஒரு மதிப்பைச்
சேமிக்க மட்டுமே செய்யும் properties (matrix தற்போது தெரிவிப்பதன்படி முறையே 1,254-இல் 79, 127, 812). அதனால்தான்
matrix-ஐ விளம்பரமாகக் கருதாமல் ஒரு குறிப்பாக நம்புவது தகும்: எண்கள் மதிப்பீடு செய்யப்பட்டவை அல்ல, கட்டாயப்படுத்தப்படுபவை.

### நீங்கள் சார்ந்திருக்கும் நடத்தையை நிலைப்படுத்துங்கள்
{:#module-3-pin}

நடைமுறைப் பாதுகாப்பு, ஒவ்வொரு அனுமானத்துக்கும் ஒரு சோதனை. ஒரு அம்சம் முக்கியமானதாக இருக்கும்போது, member இருப்பதை
அல்ல, அதன் *விளைவை* assert செய்யுங்கள் — ஒரு stub-ஐப் பிடிக்கும் சோதனைக்கும் பிடிக்காத சோதனைக்கும் உள்ள வேறுபாடு
அதுதான்:

**C#**

```csharp
using Majorsilence.Forms.Drawing;
using Majorsilence.Forms.Drawing.Imaging;
using Xunit;

[Fact]
public void MakeTransparent_actually_clears_the_key_colour ()
{
    using var bitmap = new Bitmap (4, 4);
    using (var g = Graphics.FromImage (bitmap))
    using (var brush = new SolidBrush (Color.Magenta))
        g.FillRectangle (brush, new Rectangle (0, 0, 4, 4));

    bitmap.MakeTransparent (Color.Magenta);

    // method இருப்பதை அல்ல, விளைவை (RESULT) assert செய்யுங்கள் — ஒரு stub "அது compile ஆகிறது" சோதனையில் தேறிவிடும்.
    Assert.Equal (0, bitmap.GetPixel (0, 0).A);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing
Imports Majorsilence.Forms.Drawing.Imaging
Imports Xunit

<Fact>
Public Sub MakeTransparent_actually_clears_the_key_colour()
    Using bitmap As New Bitmap(4, 4)
        Using g = Graphics.FromImage(bitmap)
            Using brush As New SolidBrush(Color.Magenta)
                g.FillRectangle(brush, New Rectangle(0, 0, 4, 4))
            End Using
        End Using

        bitmap.MakeTransparent(Color.Magenta)

        ' method இருப்பதை அல்ல, விளைவை (RESULT) assert செய்யுங்கள்.
        Assert.Equal(0, CInt(bitmap.GetPixel(0, 0).A))
    End Using
End Sub
```

உங்கள் முக்கியப் பாதையில் (critical path) உள்ள ஒவ்வொரு member-க்கும் இப்படி ஒன்றை எழுதுங்கள். அதற்கு சில நிமிடங்களே
ஆகும்; அது முக்கியமாகும் நாளில் ஒரு அமைதியான no-op-ஐச் சிவப்பு build-ஆக மாற்றுகிறது.

### அனுமானிக்காதீர்கள், சரிபாருங்கள் — சான்றுகள்
{:#module-3-apidiff}

திட்டம் தனது சொந்த public மேற்பரப்பை, உண்மையான `System.Windows.Forms` reference assembly-உடன் reflection மூலம்
ஒப்பிட்டு (diff), அதன் முடிவை commit செய்யப்பட்ட baseline-ஆக வைத்திருக்கிறது. அந்தத் தணிக்கையின் முதல் ஓட்டம்
**1,905 விடுபட்ட பதிவுகளைக்** கண்டறிந்தது — அவற்றில் **தவறான எண் மதிப்புடன் இருக்கும் 126 enum members**-உம் அடங்கும்.
அந்தக் கடைசி வகையைத்தான் தனிப்பட்ட முறையில் கவனத்தில் கொள்ள வேண்டும்: குறியீடு compile ஆகிறது, இயங்குகிறது, அமைதியாக
வேறு ஏதோ ஒன்றைக் குறிக்கிறது. சமநிலையை (parity) அனுமானிப்பதற்குப் பதிலாக உங்கள் பயன்பாடு சார்ந்திருக்கும் குறிப்பிட்ட
members-ஐச் சரிபார்க்க வேண்டும் என்பதற்குக் கிடைக்கும் சிறந்த வாதம் இதுவே.

**இரண்டு API-மேற்பரப்பு baselines-உம் — WinForms மற்றும் GDI+ — இப்போது பூஜ்ஜியத்தில் உள்ளன.** upstream அறிவிக்கும்
ஒவ்வொரு member-ஐயும் இந்த அடுக்கும் அறிவிக்கிறது. இதைக் கவனமாகப் படியுங்கள், ஏனெனில் இது பிரச்சினையின் சிறிய பாதி:
பெயர் மட்டத்திலான diff ஒரு member WinForms போல *நடந்துகொள்கிறதா* என்று கேட்க முடியாது. பன்னிரண்டு பகுதிகளை உள்ளடக்கிய
மூலக் குறியீட்டுத் தணிக்கை (2026-08-25) சரியாக அதையே கேட்டு, **நடத்தை வேறுபட்ட 483 இடங்களைக்** கண்டறிந்தது — அவற்றில்
41, ஒரு பொதுவான இடம்பெயர்க்கப்பட்ட பயன்பாட்டை உடைக்கும் அளவுக்குக் கடுமையானவை. அந்தப் பட்டியலின் பெரும்பகுதி பின்னர்
கட்டங்களாகச் சேர்க்கப்பட்டுவிட்டது (`ProcessCmdKey` வழியான keyboard முன்-செயலாக்கம், ஒரே focus/validation கட்டுப்பாட்டுப்
புள்ளி, உண்மையான உரையாடல் சாளரங்கள், `AutoScaleMode.Font` உண்மையாகவே அளவிடுதல், வேலை செய்யும் `CurrencyManager`
உடன் நேரடி data binding, `ListView.View = Details` அட்டவணையாக வரைதல், upstream வரிசையில் படிவ வாழ்க்கைச் சுழற்சி
நிகழ்வுகள், Ctrl+Z-இல் text-box undo, …); மீதமுள்ளவை [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md)-இல்
கண்காணிக்கப்படுகின்றன. உங்கள் குழுவுக்கான பாடம் மாறவில்லை: **"அது compile ஆகிறது" என்றால் பெயர் இருக்கிறது என்று
மட்டுமே பொருள்; அது வேலை செய்கிறதா என்பதை matrix வரிசை சொல்கிறது.**

### கட்டுப்பாடு வாரியான அட்டவணையைப் படித்தல்
{:#module-3-reading}

Matrix-இல் உள்ள நிலை, இடம்பெயர்க்கும் ஒரு டெவலப்பரின் பார்வையிலிருந்து மதிப்பிடப்படுகிறது:

| நிலை | பொருள் |
|---|---|
| **Implemented** | முதன்மையான மேற்பரப்பு உள்ளது. இடைவெளிகள் ஆழமான/அரிதான மூலைகளுக்கோ, matrix ஒருமுறை குறிப்பிடும் அமைப்புசார் முறைகளுக்கோ மட்டுமே. |
| **Partial** | விடுபட்டுள்ள, பொதுவாகப் பயன்படுத்தப்படும் குறிப்பிட்ட members-ஐப் பெயரிடுகிறது. |
| **Missing** | அந்தப் பெயரில் type இல்லவே இல்லை. |

அதிகம் பயன்படுத்தப்படும் கட்டுப்பாடுகள் (`Button`, `TextBox`, `Panel`, `TabControl`, `TableLayoutPanel`, `TreeView`,
`ListView`, menus, toolbars, status bars, பொதுவான உரையாடல் சாளரங்கள், …) செயல்பாட்டு ரீதியாகச் செயல்படுத்தப்பட்டுள்ளன,
stubs அல்ல. வேலையைத் திட்டமிடுவதற்கு முன் அறிந்திருக்க வேண்டிய இடைவெளிகள்:

| Type | கவனிக்க வேண்டியவை |
|---|---|
| `DataGridView` | ஒரே type-இல் உள்ள மிகப்பெரிய இடைவெளி — ஆனால் அதிகம் பயன்படுத்தப்படும் hooks **உண்மையானவை, fire ஆகின்றன**: `CellFormatting`, `CellPainting`, `RowPrePaint`/`RowPostPaint`, `CellParsing`, `RowValidating`/`RowValidated`, `GetClipboardContent()`, border-style properties. இன்னும் அறிவிக்கப்பட்டும் ஒருபோதும் எழுப்பப்படாதவை: `RowsAdded`/`RowsRemoved`, `DataError`, `SortCompare`, `CellValueNeeded`/`CellValuePushed`, `CellMouse*` குடும்பம், நுணுக்கமான `*Changed` நிகழ்வுகள். Auto-sizing வெறுமனே invalidate மட்டுமே செய்கிறது. |
| `ListView` | owner-draw இல்லை, virtual-mode retrieval callbacks இல்லை (`VirtualMode` ஒரு சாதாரண property), `InsertionMark` இல்லை. |
| `TreeView` | `Sorted` இல்லை, `ImageKey`/`SelectedImageKey` இல்லை (index அடிப்படையிலான `ImageIndex` வேலை செய்கிறது), `HitTest` இல்லை, `ShowNodeToolTips` இல்லை. |
| `ComboBox`/`ListBox`/`CheckedListBox` | `DataSource`/`DisplayMember`/`ValueMember` உள்ளன; binding *format* hooks-உம் `Sort()`-உம் இல்லை. |
| `RichTextBox`, `MaskedTextBox` | முறையே: undo/redo மற்றும் `SelectedRtf`; overwrite-mode மற்றும் char-index நிலைப்படுத்தல். |
| `ToolStrip` குடும்பம் | `MenuStrip`/`ContextMenuStrip`/`StatusStrip` உண்மையிலேயே `ToolStrip`-இலிருந்து பெறப்படுகின்றன, எனவே முழு மேற்பரப்பையும் அணுக முடியும் — ஆனால் `ToolStrip`-மட்ட members stubs. `Renderer`/`RenderMode`-ஐ assign செய்வது வரைதலை **மாற்றாது**; `LayoutStyle` layout-ஐ மாற்றாது; overflow button இல்லை. வேலை செய்வது, ஒவ்வொரு கட்டுப்பாடும் ஏற்கனவே நன்றாகச் செய்தது மட்டுமே. |
| `WebBrowser` | Navigation வேலை செய்கிறது; DOM object model எதுவும் இல்லை (`Document`, `HtmlElement`, …), ஏனெனில் அது COM automation அல்ல, உண்மையான webview-ஐ அடிப்படையாகக் கொண்டது. |
| பொதுவான உரையாடல் சாளரங்கள் | முடிவுகளும் `ShowDialog()`-உம் வேலை செய்கின்றன. Windows-shell-க்கு மட்டுமான கூடுதல்கள் (`CustomPlaces`, `AutoUpgradeEnabled`, dialog hook அமைப்பு) இல்லை — எதிர்பார்க்கக்கூடியதே, hook செய்ய நேட்டிவ் உரையாடல் சாளரம் இல்லை. |

**Grid உடன் வேலை செய்தல், நடைமுறையில்.** பெரும்பாலான வணிக (LOB) பயன்பாடுகள் வாழ்வது `DataGridView`-இல் என்பதால்,
ஆதரிக்கப்படும் வடிவம் இதோ — வேலை செய்யாத members மூலம் அல்லாமல், உண்மையாக fire ஆகும் நிகழ்வுகள் மூலம் formatting
மற்றும் painting:

**C#**

```csharp
var grid = new DataGridView { Name = "ordersGrid", Dock = DockStyle.Fill };
grid.DataSource = orders;

// CellFormatting உண்மையானது: paint செய்யும்போது ஒவ்வொரு cell-க்கும் fire ஆகிறது.
grid.CellFormatting += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name != "Total")
        return;

    if (e.Value is decimal total) {
        e.Value = total.ToString ("C");
        e.CellStyle.ForeColor = total < 0 ? Color.Firebrick : Color.Black;
        e.FormattingApplied = true;          // இதை மீண்டும் format செய்ய வேண்டாம் என்று grid-இடம் சொல்லுங்கள்
    }
};

// CellParsing-உம் உண்மையானது: edit commit ஆகும்போது இயங்குகிறது, நீங்கள் தட்டச்சு செய்த மதிப்பே சேமிக்கப்படுகிறது.
grid.CellParsing += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name == "Total"
        && decimal.TryParse (e.Value?.ToString (), out var parsed)) {
        e.Value = parsed;
        e.ParsingApplied = true;
    }
};
```

**VB.NET**

```vb
Dim grid As New DataGridView With {.Name = "ordersGrid", .Dock = DockStyle.Fill}
grid.DataSource = orders

' CellFormatting உண்மையானது: paint செய்யும்போது ஒவ்வொரு cell-க்கும் fire ஆகிறது.
AddHandler grid.CellFormatting,
    Sub(sender As Object, e As DataGridViewCellFormattingEventArgs)
        If grid.Columns(e.ColumnIndex).Name <> "Total" Then Return

        If TypeOf e.Value Is Decimal Then
            Dim total = CDec(e.Value)
            e.Value = total.ToString("C")
            e.CellStyle.ForeColor = If(total < 0, Color.Firebrick, Color.Black)
            e.FormattingApplied = True        ' இதை மீண்டும் format செய்ய வேண்டாம் என்று grid-இடம் சொல்லுங்கள்
        End If
    End Sub

' CellParsing-உம் உண்மையானது: edit commit ஆகும்போது இயங்குகிறது, நீங்கள் தட்டச்சு செய்த மதிப்பே சேமிக்கப்படுகிறது.
AddHandler grid.CellParsing,
    Sub(sender As Object, e As DataGridViewCellParsingEventArgs)
        Dim parsed As Decimal
        If grid.Columns(e.ColumnIndex).Name = "Total" AndAlso
           Decimal.TryParse(If(e.Value?.ToString(), String.Empty), parsed) Then
            e.Value = parsed
            e.ParsingApplied = True
        End If
    End Sub
```

![macOS-இல் இயங்கும் DataGridView CellFormatting உதாரணம்]({{ '/assets/img/example-grid.png' | relative_url }})

*அந்தக் குறியீடு, ஒரு சாதாரண `List<Order>`-க்கு எதிராக இயங்கும் நிலையில்: bind செய்யப்பட்ட type-இலிருந்து தானாக
உருவாக்கப்பட்ட columns, நாணய வடிவில் format செய்யப்பட்ட மதிப்புகள், handler-இன் `e.CellStyle.ForeColor` உண்மையிலேயே
renderer-ஐ அடைவதால் சிவப்பு நிற எதிர்மறை மதிப்புகள்.*

> **நீங்கள் இன்னும் 26.0.30-இல் நிலைப்படுத்தப்பட்டிருந்தால் அறிய வேண்டிய ஒரு பதிப்பு எச்சரிக்கை.** அந்த package-இல்,
> bind செய்யப்பட்ட cell மதிப்புகள் ஏற்கனவே strings-ஆக மாற்றப்பட்ட நிலையில் `CellFormatting`-ஐ அடைகின்றன, எனவே
> `e.Value is decimal` ஒருபோதும் பொருந்தாது, இந்த handler அமைதியாக எதுவும் செய்யாது — இந்த module பேசும் அதே
> தோல்வி முறை. இது அடுத்து வந்த வெளியீடுகளில் சரிசெய்யப்பட்டது (bind செய்யப்பட்ட cells, member-இன் type-ஐத்
> தக்கவைக்கின்றன), எனவே 26.9.0 போன்ற தற்போதைய பதிப்பில் மேலுள்ள குறியீடு சரியானது. நீங்கள் 26.0.30-இல் இருந்து
> format செய்யப்படாத மதிப்புகளைக் கண்டால், அதற்குப் பதிலாகத் தற்காப்பாக parse செய்யுங்கள்:
> `decimal.TryParse (e.Value?.ToString (), out var total)`. அந்த வடிவம் இரண்டு நிலைகளிலும் வேலை செய்கிறது.

அதே அட்டவணையின்படி, இப்போதைக்கு நீங்கள் சார்ந்து எழுதக் *கூடாதவை*: `RowsAdded`, `DataError`, `SortCompare`,
`CellValueNeeded` (எனவே virtual mode இல்லை), `CellMouse*` குடும்பம். ஒவ்வொன்றும் compile ஆகிறது, அமைதியாக ஒருபோதும்
fire ஆவதில்லை — [மேலே](#module-3-cost) உள்ள அதே தோல்வி முறை.

Vendor stacks-இலிருந்து வரும் குழுக்களுக்கு இரண்டு குறிப்புகள். **Telerik UI for WinForms**-க்கு ஒரு முதல்தர இணக்க
அடுக்கு (`Majorsilence.Forms.Telerik`) உள்ளது; அதன் சொந்த மூலக் குறியீடே ஒப்பந்தத்தைத் தெளிவாகச் சொல்கிறது:
*coverage is compile-and-approximate, not pixel-perfect* (உள்ளடக்கம் compile ஆகி தோராயமாக இயங்கும், pixel-perfect அல்ல).
**Spellcheck** (`TextBox`-உடன் இணைக்கப்பட்டது) என்பது அலை அடிக்கோடுகளும் பரிந்துரை menu-வும் கொண்ட, சார்புகள் இல்லாமல்
ஆரம்பத்திலிருந்து எழுதப்பட்ட செயல்படுத்தல் — அது WinForms API அல்லவே அல்ல; Telerik-இன் `RadSpellChecker`-ஐ ஆதரிப்பதற்காக
உள்ளது.

**பயிற்சி 3.** உங்கள் சொந்தப் பயன்பாடு சார்ந்திருக்கும் மூன்று members-ஐத் தேர்ந்தெடுங்கள் — உங்களுக்கு உறுதியாகத்
தெரிந்த ஒன்று, உறுதியாகத் தெரியாத ஒன்று, அசாதாரணமான ஒன்று. ஒவ்வொன்றும் செயல்படுத்தப்பட்டதா, stub செய்யப்பட்டதா,
இல்லாததா என்று matrix-இலிருந்து தீர்மானித்து, மிகக் குறைவாக உறுதியாகத் தெரிந்ததற்கு ஒரு
[நிலைப்படுத்தும் சோதனையை](#module-3-pin) எழுதுங்கள்.

---

## Module 4 — வரைதலும் தனிப்பயன் வரைதலும்
{:#module-4}

**விளைவு:** எந்த `System.Drawing` types அப்படியே இருக்கின்றன, எவை இடம் மாறுகின்றன என்பதும், WinForms-பாணி மற்றும்
Skia-நேட்டிவ் வரைதல் குறியீடு இரண்டையும் எப்படி எழுதுவது என்பதும் உங்களுக்குத் தெரியும்.

`Majorsilence.Forms.Drawing` என்பது Windows-க்கு மட்டுமான `System.Drawing.Common`-க்கு (GDI+) Skia-அடிப்படையிலான,
பல்தள மாற்றீடு. அனைத்தையும் நிர்வகிக்கும் பிரிவு:

| மூலம் | இலக்கு | ஏன் |
|---|---|---|
| `System.Drawing` **primitives** — `Color`, `Point`, `PointF`, `Size`, `SizeF`, `Rectangle`, `RectangleF` | *மாற்றமில்லை* | அவை ஏற்கனவே ஒவ்வொரு தளத்திலும் `System.Drawing.Primitives`-இல் வருகின்றன. |
| `System.Drawing` **GDI+ types** — `Bitmap`, `Font`, `Pen`, `Brush`, `Graphics` சார்ந்தவை | `Majorsilence.Forms.Drawing` | `System.Drawing.Common`-இல் GDI+ Windows-க்கு மட்டுமே; SkiaSharp மீது மீண்டும் செயல்படுத்தப்பட்டுள்ளது. |
| `System.Drawing.Drawing2D` / `.Imaging` / `.Text` | `Majorsilence.Forms.Drawing.Drawing2D` / `.Imaging` / `.Text` | அதே பிரிவு, துணை namespaces-ஆக. |
| `System.Drawing.Printing` | `Majorsilence.Forms.Printing` | Printing இணக்க அடுக்கின் drawing பக்கத்தில் அல்ல, Forms பக்கத்தில் உள்ளது. |
| `System.Windows.Forms.VisualStyles`, `System.Drawing.Design`, `System.ComponentModel.Design` | *தொடப்படுவதில்லை* | இணையானது இல்லை — இல்லாத ஒன்றாக மீண்டும் எழுதப்படுவதற்குப் பதிலாகக் கைமுறை மதிப்பாய்வுக்காகக் குறிக்கப்படுகின்றன. |

Drawing அடுக்கைத் தனியாகப் பயன்படுத்த முயல்பவர்களைச் சிக்க வைக்கும் ஒரு packaging விவரம்: value types, images,
fonts, resources ஆகியவை `Majorsilence.Forms.Drawing.Common` package-இல் உள்ளன, ஆனால் **`Graphics` தானே மைய
`Majorsilence.Forms` package-இல் வருகிறது** (இன்னும் `Majorsilence.Forms.Drawing` namespace-இன் கீழ்). எனவே headless
image கையாளுதலுக்கும் மைய package-ஐக் குறிப்பிட வேண்டும் — எந்தப் பயன்பாட்டிலும் அது உங்களிடம் ஏற்கனவே இருக்கும்.

உண்மையான support tickets-ஐ உருவாக்கும் மூன்று குறிப்பிட்ட விஷயங்கள்:

1. **`System.Drawing.Common` உங்கள் திட்டத்திலிருந்து நீக்கப்பட வேண்டும்** — அது .NET 7 முதல் Windows-க்கு மட்டுமே
   என்பதால் மட்டுமல்ல; அதைக் குறிப்பிட்டபடி விட்டால் `System.Drawing.Bitmap`/`Font`/`Pen` Majorsilence மாற்றீடுகளுக்கு
   அருகில் மீண்டும் scope-க்குள் வருகின்றன — அப்போது ஒவ்வொரு தகுதிப்படுத்தப்படாத பயன்பாடும் port-க்குத் தீர்க்கப்படுவதற்குப்
   பதிலாக *ambiguous reference* (தெளிவற்ற குறிப்பு) ஆகத் தோல்வியடைகிறது.
2. **`SystemColors`, `ColorTranslator` ஆகியவை தெளிவின்மையின் விதிவிலக்குகள்.** அவை `System.Drawing.Primitives`-இல்
   உள்ளன, எனவே primitives-க்காக நீங்கள் வைத்திருக்கும் `using System.Drawing;` வழியாக இன்னும் தீர்க்கப்படுகின்றன —
   தகுதிப்படுத்தப்படாமல் பயன்படுத்தினால் Majorsilence உடையவற்றுடன் மோதுகின்றன (CS0104). தீர்வு ஒரு வரி alias;
   migrator அதைத் தேவைப்படும் கோப்புகளில் மட்டும் உங்களுக்காகச் சேர்க்கிறது:

   **C#**

   ```csharp
   using System.Drawing;
   using SystemColors = Majorsilence.Forms.SystemColors;
   ```

   **VB.NET**

   ```vb
   Imports System.Drawing
   Imports SystemColors = Majorsilence.Forms.SystemColors
   ```

3. **Gradient, hatch brushes ஆகியவை GDI+ அவற்றை வைக்கும் இடத்திலேயே உள்ளன**: `LinearGradientBrush`,
   `PathGradientBrush`, `HatchBrush`, `HatchStyle` ஆகியவை `Majorsilence.Forms.Drawing.Drawing2D`-இல் உள்ளன.
   `Brush`, `SolidBrush`, `TextureBrush` ஆகியவை `Majorsilence.Forms.Drawing`-இல் உள்ளன — அவை உண்மையிலேயே
   `System.Drawing` types. மீண்டும் எழுதப்பட்ட import வழியாக அவற்றை அணுகும் குறியீடு பாதிக்கப்படுவதில்லை; முழுமையாகத்
   தகுதிப்படுத்தப்பட்ட குறிப்பு மட்டுமே புதுப்பிக்கப்பட வேண்டும்.

### திரைக்கு வெளியே image வேலை
{:#module-4-offscreen}

`Graphics.FromImage` GDI+-இல் வேலை செய்வது போலவே வேலை செய்கிறது; அதாவது உங்கள் தற்போதைய imaging குறியீட்டின்
பெரும்பகுதி imports-ஐ மாற்றுவதன் மூலம் மட்டுமே மாறிவிடுகிறது:

**C#**

```csharp
using Majorsilence.Forms.Drawing;
using Majorsilence.Forms.Drawing.Drawing2D;
using Majorsilence.Forms.Drawing.Imaging;
using System.Drawing;

public static void SaveThumbnail (string sourcePath, string targetPath, int width)
{
    using var source = new Bitmap (sourcePath);
    var height = (int) (source.Height * (width / (double) source.Width));

    using var thumb = new Bitmap (width, height);

    using (var g = Graphics.FromImage (thumb)) {
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.SmoothingMode     = SmoothingMode.AntiAlias;

        g.DrawImage (source,
            new Rectangle (0, 0, width, height),
            0, 0, source.Width, source.Height,
            GraphicsUnit.Pixel);

        using var watermark = new SolidBrush (Color.FromArgb (96, Color.Black));
        g.FillRectangle (watermark, new Rectangle (0, height - 18, width, 18));
    }

    thumb.Save (targetPath, ImageFormat.Png);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing
Imports Majorsilence.Forms.Drawing.Drawing2D
Imports Majorsilence.Forms.Drawing.Imaging
Imports System.Drawing

Public Shared Sub SaveThumbnail(sourcePath As String, targetPath As String, width As Integer)
    Using source As New Bitmap(sourcePath)
        Dim height = CInt(source.Height * (width / CDbl(source.Width)))

        Using thumb As New Bitmap(width, height)
            Using g = Graphics.FromImage(thumb)
                g.InterpolationMode = InterpolationMode.HighQualityBicubic
                g.SmoothingMode = SmoothingMode.AntiAlias

                g.DrawImage(source,
                            New Rectangle(0, 0, width, height),
                            0, 0, source.Width, source.Height,
                            GraphicsUnit.Pixel)

                Using watermark As New SolidBrush(Color.FromArgb(96, Color.Black))
                    g.FillRectangle(watermark, New Rectangle(0, height - 18, width, 18))
                End Using
            End Using

            thumb.Save(targetPath, ImageFormat.Png)
        End Using
    End Using
End Sub
```

![திரைக்கு வெளியே imaging உதாரணம் உருவாக்கிய thumbnail]({{ '/assets/img/example-thumbnail.png' | relative_url }})

*அந்த method-இன் உண்மையான வெளியீடு: 1080×752 screenshot ஒன்று bicubic interpolation மூலம் 320 px அகலத்துக்கு
மறுஅளவாக்கப்பட்டது, அடியில் பகுதியளவு ஒளிபுகும் watermark பட்டையுடன்.*

அந்தக் குறியீட்டுக்கு UI சார்பு எதுவுமே இல்லை — அது ஒரு console பயன்பாட்டிலோ, service-இலோ, சோதனையிலோ இயங்கும்.

### தனிப்பயன் வரைதல்: இரண்டு வழிகள், ஒவ்வொன்றையும் எப்போது பயன்படுத்துவது
{:#module-4-paint}

`PaintEventArgs` உங்களுக்கு **இரண்டு** மேற்பரப்புகளையும் தருகிறது. `e.Graphics` GDI+ வடிவிலான wrapper, எனவே
மாற்றப்பட்ட `OnPaint` குறியீடு மாற்றமின்றி compile ஆகிறது. `e.Canvas` என்பது framework தானே வரையப் பயன்படுத்தும்
மூல `SKCanvas` — Skia நன்றாகச் செய்யும், GDI+ ஒருபோதும் செய்யாத ஒன்று உங்களுக்கு வேண்டும்போது அதைப் பயன்படுத்துங்கள்.

**C# — WinForms-பாணி, மாற்றமின்றி மாறுகிறது**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Drawing;
using System.Drawing;

public class Badge : Control
{
    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);

        using var fill = new SolidBrush (Color.FromArgb (110, 67, 166));
        using var pen  = new Pen (Color.White, 2);

        e.Graphics.FillRectangle (fill, ClientRectangle);
        e.Graphics.DrawRectangle (pen, 1, 1, Width - 3, Height - 3);
    }
}
```

**VB.NET — WinForms-பாணி, மாற்றமின்றி மாறுகிறது**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Drawing
Imports System.Drawing

Public Class Badge
    Inherits Control

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        MyBase.OnPaint(e)

        Using fill As New SolidBrush(Color.FromArgb(110, 67, 166))
            Using pen As New Pen(Color.White, 2)
                e.Graphics.FillRectangle(fill, ClientRectangle)
                e.Graphics.DrawRectangle(pen, 1, 1, Width - 3, Height - 3)
            End Using
        End Using
    End Sub
End Class
```

**C# — Skia-நேட்டிவ், GDI+ வெளிப்படுத்த முடியாத விளைவுகளுக்கு**

```csharp
using SkiaSharp;

protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    using var paint = new SKPaint {
        IsAntialias = true,
        Shader = SKShader.CreateLinearGradient (
            new SKPoint (0, 0), new SKPoint (0, Height),
            new [] { new SKColor (110, 67, 166), new SKColor (185, 138, 255) },
            SKShaderTileMode.Clamp)
    };

    // உண்மையான gradient shader கொண்ட வட்டமூலைச் செவ்வகம் — ஒரே அழைப்பு, GDI+-இல் இணையானது இல்லை.
    e.Canvas.DrawRoundRect (new SKRect (0, 0, Width, Height), 12, 12, paint);
}
```

**VB.NET — Skia-நேட்டிவ்**

```vb
Imports SkiaSharp

Protected Overrides Sub OnPaint(e As PaintEventArgs)
    MyBase.OnPaint(e)

    Using paint As New SKPaint With {
        .IsAntialias = True,
        .Shader = SKShader.CreateLinearGradient(
            New SKPoint(0, 0), New SKPoint(0, Height),
            {New SKColor(110, 67, 166), New SKColor(185, 138, 255)},
            SKShaderTileMode.Clamp)
    }
        ' உண்மையான gradient shader கொண்ட வட்டமூலைச் செவ்வகம் — ஒரே அழைப்பு, GDI+-இல் இணையானது இல்லை.
        e.Canvas.DrawRoundRect(New SKRect(0, 0, Width, Height), 12, 12, paint)
    End Using
End Sub
```

![macOS-இல் இயங்கும், அருகருகே உள்ள இரண்டு தனிப்பயன் வரைதல் அணுகுமுறைகள்]({{ '/assets/img/example-paint.png' | relative_url }})

*ஒரே சாளரத்தில் இரண்டு கட்டுப்பாடுகளும். இடது: GDI+ வடிவிலான பாதை — தட்டையான நிரப்பல், 2 px வெள்ளை எல்லை. வலது:
Skia பாதை — ஒரே `DrawRoundRect` அழைப்பில் வட்ட மூலைகளும் உண்மையான gradient shader-உம்.*

**உங்கள் குழுவுக்கான வழிகாட்டல்:** `e.Graphics` உடன் இடம்பெயருங்கள் (அது இலவசம் — குறியீடு ஏற்கனவே உள்ளது),
புதிய காட்சிகளுக்கு வேண்டுமென்றே `e.Canvas`-ஐப் பயன்படுத்துங்கள். ஒரே handler-இல் இரண்டையும் கலப்பது பரவாயில்லை;
அவை ஒரே மேற்பரப்பில் வரைகின்றன.

**Canvas தருக்க அலகுகளில் (logical units) உள்ளது — அதை நீங்களே அளவிடாதீர்கள்.** மேலுள்ள இரண்டு உதாரணங்களும்
`ClientRectangle`, `Width`, `Height` ஆகியவற்றுக்கு எதிராக வரைகின்றன; HiDPI desktop-இலும் phone-இலும் (Android சுமார்
2.6–2.75 அளவிடுதலைத் தெரிவிக்கிறது) கூடுதல் குறியீடு இல்லாமல் சரியான அளவில் இருக்கின்றன, ஏனெனில் உங்கள் `OnPaint`
இயங்குவதற்கு முன் framework canvas-ஐக் காட்சித் திரைக்கு ஏற்ப அளவிடுகிறது. 2026-10-01-க்கு முன் canvas *சாதனப்*
பிக்சல்களில் இருந்தது, ஒரு தனிப்பயன் கட்டுப்பாடு `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`-ஐத் தானே அழைக்க
வேண்டியிருந்தது. **ஒரு கட்டுப்பாட்டில் அந்த அழைப்பு உங்களிடம் இருந்தால், அதை நீக்குங்கள்** — அது இப்போது வரைதலை
இருமுறை அளவிடுகிறது; அறிகுறி, 2× திரையில் இரட்டை அளவில் வரையும், உங்கள் 1× monitor-இல் சரியாகத் தெரியும் ஒரு
கட்டுப்பாடு. `e.ClipRectangle`, `e.Canvas` ஆகியவையும் தருக்க அலகுகளில் உள்ளன; ஒரு துல்லியமான சாதனப் பிக்சலில் இறங்க
வேண்டிய அரிதான நிலைக்காக (ஒரு மெல்லிய கோடு, pixel-art sprite) `PaintEventArgs.Scaling` இன்னும் உள்ளது. நீங்கள் இன்னும்
சாதனப் பிக்சல்களைப் பெறும் ஒரே இடம் owner-draw குடும்பம் — `DrawItem`, `DrawNode`, `CellPainting` போன்றவை — அவற்றின்
`Bounds`-உம் `Graphics`-உம் ஒன்றுக்கொன்று பொருந்துகின்றன, ஆனால் கட்டுப்பாட்டின் தருக்க `ClientRectangle`-உடன் அல்ல.
இரண்டு வகையையும் `MF_HEADLESS_SCALE=2`-இன் கீழ் சோதியுங்கள் ([module 8](#module-8-headless)).

### ஒரு கட்டுப்பாட்டை animate செய்தல்: `RequestAnimationFrame`
{:#module-4-animation}

16 ms-இல் ஒரு `Timer` — WinForms animate செய்தது அப்படித்தான், அது இன்னும் வேலை செய்கிறது. framework browser-இன்
வழக்கத்தையும் வழங்குகிறது; அது Avalonia-வில் காட்சித் திரையுடன் ஒத்திசைந்தது, மேலும் — உங்கள் சோதனைகளுக்கு
முக்கியமான பகுதி — Headless-இல் முழுமையாகத் தீர்மானிக்கக்கூடியது (deterministic). `control.RequestAnimationFrame (callback)`
அடுத்த frame-இன் தொடக்கத்தில், வேறுபாடாக மட்டுமே பொருள் கொண்ட ஒரு timestamp உடன், **ஒருமுறை** call back செய்கிறது;
தொடர்ந்து செல்ல callback-இன் உள்ளிருந்து மீண்டும் கேளுங்கள். (`docs/animation.md`-உடன் ஒப்பிட்டுச் சரிபார்க்கப்பட்டது,
இந்த வழிகாட்டிக்காக இயக்கப்படவில்லை.)

**C#**

```csharp
private TimeSpan? start;
private float fade;                  // 0..1 — OnPaint இதைப் படிக்கிறது

public void StartFade ()
{
    start = null;
    RequestAnimationFrame (OnFrame);
}

private void OnFrame (TimeSpan timestamp)
{
    start ??= timestamp;
    var progress = Math.Min (1, (timestamp - start.Value).TotalSeconds / 0.4);

    fade = (float) progress;
    Invalidate ();

    if (progress < 1)
        RequestAnimationFrame (OnFrame);   // *அடுத்த* frame-இல் வழங்கப்படும், ஒருபோதும் இதில் அல்ல
}
```

**VB.NET**

```vb
Private start As TimeSpan?
Private fade As Single               ' 0..1 — OnPaint இதைப் படிக்கிறது

Public Sub StartFade()
    start = Nothing
    RequestAnimationFrame(AddressOf OnFrame)
End Sub

Private Sub OnFrame(timestamp As TimeSpan)
    If Not start.HasValue Then start = timestamp
    Dim progress = Math.Min(1, (timestamp - start.Value).TotalSeconds / 0.4)

    fade = CSng(progress)
    Invalidate()

    If progress < 1 Then
        RequestAnimationFrame(AddressOf OnFrame)   ' *அடுத்த* frame-இல் வழங்கப்படும், ஒருபோதும் இதில் அல்ல
    End If
End Sub
```

Headless பின்தளத்தில் நீங்கள் clock-ஐ முன்னகர்த்தும் வரை எதுவும் இயங்காது; இது ஒரு animation-ஐத் துல்லியமான
assertion-ஆக மாற்றுகிறது: `HeadlessRenderer.AnimationClock.Reset ()`, உங்கள் frames-ஐக் கோருங்கள், பின்னர்
`HeadlessRenderer.AnimationClock.Step (10)` 1/60 s கொண்ட பத்து frames-ஐ இயக்குகிறது, உங்கள் callback சரியாகப் பத்து
timestamps-ஐப் பார்த்திருக்கும். `Majorsilence.Forms.Animation` package அதே frame கோரிக்கையின் மேல் `Tween<T>`, `Easing`,
`control.Animate (…)` ஆகியவற்றை அடுக்குகிறது; பயனர் குறைவான இயக்கத்தைக் கேட்டிருக்கும்போது
`SystemInformation.PrefersReducedMotion` உங்களுக்குச் சொல்கிறது — இது ஆலோசனை மட்டுமே, எனவே ஒரு animation-ஐத்
*தொடங்கும்* இடத்தில் அந்தச் சரிபார்ப்பைச் செய்வது உங்கள் பொறுப்பு. விவரங்கள்
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)-இல்.

Skia-நேட்டிவ் வழியில் செல்லும்போது ஒரு பொறி: **மூல `SKFont`/`DrawText` font fallback எதுவும் செய்வதில்லை.** framework-இன்
சொந்த உரை வரைதல் விடுபட்ட glyphs-ஐ ஒரு fallback சங்கிலி வழியாகத் தீர்க்கிறது, ஆனால் வெறும் `SKTypeface.Default`
அப்படிச் செய்வதில்லை — அந்த typeface-இல் இல்லாத ஒரு glyph-ஐக் (ஒரு அம்புக்குறி, emoji, CJK) கொண்ட string-ஐ வரைந்தால்,
அமைதியாக missing-glyph பெட்டி கிடைக்கும். பயனருக்குக் காட்டும் உரைக்கு `e.Graphics.DrawString`-ஐயே பயன்படுத்துங்கள்,
அல்லது உங்கள் typeface-ஐ வெளிப்படையாகத் தேர்ந்தெடுங்கள்.

Skia உண்மையிலேயே GDI+-ஐப் பின்பற்ற முடியாத இடங்களில், matrix பாசாங்கு செய்யாமல் அதைச் சொல்கிறது: தனிப்பயன்
line cap கொண்ட ஒரு `Pen`, அந்த cap-இன் அறிவிக்கப்பட்ட `BaseCap`-ஐப் பயன்படுத்தி வரைகிறது (`SKPaint` butt/round/square
மட்டுமே வழங்குகிறது), `Pen.Alignment` சேமிக்கப்படுகிறது ஆனால் பயன்படுத்தப்படுவதில்லை, `Image.Palette`-ஐ assign செய்வது
மீண்டும் quantize செய்வதில்லை, ஏனெனில் நவீன SkiaSharp-இல் indexed bitmap type இல்லை — ஒவ்வொரு மேற்பரப்பும் 32bpp.

**பயிற்சி 4.** உங்களுக்குச் சொந்தமான GDI+ குறியீட்டின் ஒரு பகுதியை — thumbnail generator, chart, watermark —
UI இல்லாத ஒரு console பயன்பாட்டில் `Majorsilence.Forms.Drawing`-க்கு எதிராக மாற்றுங்கள். பின்னர் தனிப்பயனாக வரையப்படும்
ஒரு கட்டுப்பாட்டை எடுத்து, `e.Canvas` வழியாக ஒரு Skia-நேட்டிவ் தொடுதலைச் (gradient, blur, வட்டமூலை clip) சேருங்கள்.

---

## Module 5 — உங்கள் WinForms பயன்பாட்டை இடம்பெயர்த்தல்
{:#module-5}

**விளைவு:** உங்கள் solution மீது `majorsilence-migrate`-ஐ இயக்கவும், அதன் அறிக்கையைப் படிக்கவும், அதைத் தொடர்ந்து
வரும் கைமுறைத் திருத்தச் சரிபார்ப்புப் பட்டியலை முடிக்கவும் உங்களால் முடியும்.

### நிறுவுதல்
{:#module-5-install}

```
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help
```

ஒவ்வொரு repo-வுக்குமான நிறுவலை விரும்புங்கள் (`dotnet new tool-manifest`, பின்னர்
`dotnet tool install Majorsilence.Forms.Migrator`, `dotnet majorsilence-migrate` என இயக்குங்கள்), அப்போது முழுக் குழுவும்
ஒரே பதிப்பை இயக்கும். **Tool package மட்டுமே வெளியிடப்படும் ஒரே வடிவம்** — முன்பு வெளியீடுகள் ஒவ்வொரு தளத்துக்கும்
ஒரு self-contained single-file binary-ஐ இணைத்தன, இப்போது அப்படிச் செய்வதில்லை. இதற்குக் கணினியில் ஒரு .NET runtime
தேவை (உங்களிடம் உள்ள எந்தப் புதிய major பதிப்புக்கும் roll forward ஆகும்); எதையும் நிறுவ விரும்பவில்லை என்றால்,
ஒரு clone-இலிருந்து `dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>` மூலம் இயக்குங்கள்.

### உங்கள் மூலக் குறியீட்டில் இடம்பெயர்த்தல் எப்படித் தோன்றும்
{:#module-5-beforeafter}

எல்லாவற்றுக்கும் முன், மாற்றத்தின் அளவைப் பாருங்கள். இது ஒரு வழக்கமான படிவத்தின் தலைப்பகுதி, முன்னும் பின்னும்:

**C# — முன்**

```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**C# — பின்**

```csharp
using System;
using System.Drawing;                                        // தக்கவைக்கப்பட்டது: Color, Point, Size, Rectangle
using Majorsilence.Forms;                                    // முன்பு System.Windows.Forms
using Majorsilence.Forms.Drawing;                            // Bitmap-க்காக
using SystemColors = Majorsilence.Forms.SystemColors;         // சேர்க்கப்பட்டது: CS0104-ஐத் தீர்க்கிறது

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();                          // உங்கள் Designer கோப்பு தொடப்படவில்லை
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**VB.NET — முன்**

```vb
Imports System.Drawing
Imports System.Windows.Forms

Public Class CustomerForm
    Inherits Form

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

**VB.NET — பின்**

```vb
Imports System.Drawing                                        ' தக்கவைக்கப்பட்டது: Color, Point, Size, Rectangle
Imports Majorsilence.Forms                                    ' முன்பு System.Windows.Forms
Imports Majorsilence.Forms.Drawing                            ' Bitmap-க்காக
Imports SystemColors = Majorsilence.Forms.SystemColors         ' சேர்க்கப்பட்டது: தெளிவின்மையைத் தீர்க்கிறது

Public Class CustomerForm
    Inherits Form

    ' MyType=Empty முன்பு வழங்கிய மறைமுக parameterless constructor-ஐயும் migrator மீண்டும் செருகுகிறது;
    ' இந்தப் படிவத்தின் Designer partial பற்றிய அறிவைப் பயன்படுத்துவதால் அது இரட்டிப்பாவதில்லை.
    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

அதன் முழு வடிவமும் அவ்வளவுதான்: imports மாறுகின்றன, `Handles` clauses-உம் designer குறியீடும் தப்பிப் பிழைக்கின்றன,
உங்கள் வணிக தர்க்கம் (business logic) தொடப்படுவதில்லை.

### அதனுடன் வாதிடுவதற்கு முன் tool என்ன என்பதை அறியுங்கள்
{:#module-5-design}

`majorsilence-migrate` என்பது வேண்டுமென்றே பல சுற்றுகளில் இயங்கும் **உரை/regex அடிப்படையிலான மீண்டும் எழுதி (rewriter)**.
அது syntax tree-ஐ parse செய்வதில்லை, symbols-ஐத் தீர்ப்பதில்லை — அதுதான் நோக்கமே:

- **உடைந்த குறியீட்டிலும் இது வேலை செய்கிறது.** பாதி இடம்பெயர்க்கப்பட்ட solution, மாற்றப்படாத type-ஐக் குறிப்பிடும் ஒரு
  `.vb`, ஒரு reference விடுபட்ட project — இவை எதுவும் rewriter-ஐ நிறுத்துவதில்லை, ஏனெனில் குறியீடு compile ஆகவோ parse
  ஆகவோ கூட அதற்குத் தேவையில்லை. ஒரு Roslyn tool, project build ஆகும் வரை அதைத் தொட மறுக்கும்; அது பழைய குறியீட்டுத்
  தளத்தின் மீதான *முதல் சுற்றின்* நோக்கத்தையே தோற்கடிக்கும்.
- **இது வேகமானது** — ஆயிரக்கணக்கான கோப்புகள் சில வினாடிகளில்.
- **இது விட்டுக்கொடுப்பது:** உண்மையான cross-project symbol resolution. வெறும் `Panel` என்பது
  `System.Windows.Forms.Panel`-ஆ அல்லது `Panel` என்ற பெயரிலான உங்கள் சொந்த class-ஆ என்று அதனால் சொல்ல முடியாது;
  அது namespace-prefix முறைகளையும் import சூழலையும் சார்ந்துள்ளது. அது அடையாளம் காணாத ஒவ்வொரு namespace-உம்
  **அமைதியாக ஊகிக்கப்படுவதற்குப் பதிலாகக் கைமுறை மதிப்பாய்வுக்காகக் குறிக்கப்படுகிறது**.

சரியாக அந்தக் குருட்டுப் புள்ளிக்காக, விருப்பத்தின் பேரில் இயக்கக்கூடிய இரண்டாவது engine *உள்ளது* — `--engine roslyn`;
அது உரை அடிப்படையிலானதன் மேல் அடுக்கப்பட்டு, உண்மையான symbol resolution-ஐப் பயன்படுத்துகிறது:

| | `--engine text` (இயல்பு) | `--engine roslyn` |
|---|---|---|
| உள்ளீடு | எந்த `.sln`/`.csproj`/`.vbproj`/கோப்புறை/தனிக் கோப்பும் | **ஏற்றக்கூடிய (loadable)** project தேவை; வெறும் கோப்புறை அல்லது தனிக் கோப்பு, எச்சரிக்கையுடன் முழு ஓட்டத்துக்கும் text-க்குத் திரும்புகிறது |
| compile ஆகாத குறியீட்டைத் தாங்குதல் | ஆம் | இல்லை |
| வேகம் | வினாடிகள் | பல மடங்கு மெதுவானது (MSBuild evaluation ஆதிக்கம் செலுத்துகிறது) |
| ஒரே பெயருள்ள type-களைப் பிரித்தறிதல் | இல்லை | **ஆம் — அது இருப்பதற்கான காரணமே இது** |
| தோல்வியைக் கையாளுதல் | பொருந்தாது | *ஒவ்வொரு project-க்கும்* மூடிய நிலையில் தோல்வியடைகிறது (அந்த project-இன் கோப்புகள் text-க்குத் திரும்புகின்றன). MSBuild-ஐக் கண்டுபிடிக்கவே முடியவில்லை என்றால், அமைதியாகத் தரம் குறைவதற்குப் பதிலாக ஓட்டம் முழுமையாகத் தோல்வியடைகிறது |

**குழு விதி:** ஒரு பெரிய பழைய குறியீட்டுத் தளத்தின் மீதான முதல் சுற்று எப்போதும் இயல்பான `--engine text`-ஐயே
பயன்படுத்துகிறது. ஒரு WinForms/GDI+ type-உடன் வெறும் பெயரைப் பகிரும் தனிப்பயன் type-க்கு *உறுதிப்படுத்தப்பட்ட* நிகழ்வு
இருக்கும்போது மட்டுமே, பின்னர், இப்போது ஏற்றக்கூடியதாகிவிட்ட முடிவின் மீது `--engine roslyn`-ஐப் பயன்படுத்துங்கள்.
அது ஓர் இடத்தில் *குறைவான* எச்சரிக்கைகளைத் தருகிறது என்பதையும் கவனியுங்கள் — வெறும் `using System.Drawing;`-இன் கீழுள்ள
தகுதிப்படுத்தப்படாத GDI+ types-ஐக் குறிப்பதற்குப் பதிலாக நேரடியாகவே சரிசெய்கிறது. அந்த வேறுபாடு ஒரு பின்னடைவு (regression) அல்ல.

### பரிந்துரைக்கப்படும் முதல் ஓட்டம்
{:#module-5-firstrun}

```
# சுத்தமான git branch-இல், வரம்பைப் பார்க்க முதலில் dry-run:
majorsilence-migrate MySolution.sln --dry-run --diff

# பின்னர் உண்மையாக இயக்குங்கள் — முந்தைய commit-க்கு எதிரான diff தான் இடம்பெயர்த்தல்:
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

git கண்காணிக்கும் branch-இல் அதே இடத்தில் இயக்குவது (`--no-backup` உடன், ஏனெனில் git *தான்* உங்கள் backup) இடம்பெயர்த்தலை
idempotent ஆகவும் diff செய்யக்கூடியதாகவும் ஆக்குகிறது: இயக்குங்கள், கோப்பு கோப்பாகப் பரிசோதியுங்கள், பின்னர் மேலும்
பழைய குறியீட்டைக் கொண்டுவரும்போது பாதுகாப்பாக மீண்டும் இயக்குங்கள்.

முதல் நாளிலேயே அறிய வேண்டிய options:

| Option | பயன்பாடு |
|---|---|
| `-o, --output <dir>` | அதே இடத்தில் மாற்றுவதற்குப் பதிலாக ஒரு mirror tree-க்கு எழுதுகிறது |
| `-n, --dry-run`, `--diff` | உறுதியளிப்பதற்கு முன் வரம்பை அளவிடுங்கள் |
| `--backend <name>` | `avalonia` (இயல்பு) \| `uno` \| `headless` — எந்தப் பின்தள package-ஐக் குறிப்பிடுகிறது |
| `--tfm <tfm>` | ஒரு TFM-ஐக் கட்டாயப்படுத்துகிறது. இயல்பு: பதிப்பைத் தக்கவைத்து, `-windows` பின்னொட்டை நீக்குகிறது |
| `--package-version <v>` | இயல்பாக migrator-இன் சொந்தப் பதிப்பு — tool-உம் packages-உம் ஒரே வெளியீட்டிலிருந்து வருகின்றன |
| `--map <file>` | உள்ளமைந்த ஆதரவு இல்லாத vendor-க்கான கூடுதல் namespace mappings (மீண்டும் மீண்டும் பயன்படுத்தலாம்) |
| `--dual-build` | ஒரு C# project-ஐ உண்மையான WinForms-க்கு எதிராகவும் build ஆக வைத்திருக்கிறது — கீழே பார்க்கவும் |
| `--strict` | ஏதேனும் கைமுறை-மதிப்பாய்வு எச்சரிக்கை இருந்தால் பூஜ்ஜியமல்லாத குறியீட்டுடன் வெளியேறுகிறது. **இதுதான் உங்கள் CI வாயில்.** |
| `--report <file>` / `--no-report` | Markdown அறிக்கை |

உள்ளமைந்த mapping இல்லாத vendor-க்கு, ஒரு `--map` கோப்பு வெறும் JSON தான்:

```json
{
  "namespaces":     { "DevExpress.XtraEditors": "Majorsilence.Forms.DevExpress" },
  "removePackages": [ "DevExpress.Win.*" ]
}
```

### அது உண்மையில் என்ன மாற்றுகிறது
{:#module-5-changes}

1. **Project கோப்புகள்** — `UseWindowsForms`/`UseWPF`-ஐ நீக்குகிறது, `-windows` TFM பின்னொட்டை நீக்குகிறது (import
   செய்யப்பட்ட `.props`/`.targets`-இலும்), Windows-desktop framework reference-ஐ நீக்குகிறது, WinForms-க்கு மட்டுமான
   NuGet packages-ஐ (Telerik, DevExpress, **`System.Drawing.Common`**) நீக்குகிறது, `Majorsilence.Forms` + ஒரு பின்தள
   reference-ஐச் சேர்க்கிறது — **அது தொடும் ஒவ்வொரு project-க்கும்**. அந்தத் தொகுப்பு "WinForms projects"-ஐ விட
   அகலமானது: `System.Windows.Forms`-ஐ ஒருபோதும் குறிப்பிடாத ஒரு சாதாரண class library-க்கு image அல்லது font helper
   இருந்தால் அதுவும் மீண்டும் எழுதப்படுகிறது, reference இல்லாமல் அது compile ஆகாது. தப்பிப் பிழைக்கும் primitives-ஐ
   மட்டுமே பயன்படுத்தும் projects முற்றிலும் தொடப்படுவதில்லை.
2. **மூலக் கோப்புகள்** — நீளமான-prefix-முதலில் அட்டவணை மூலம் namespace மீண்டும் எழுதுதல், இரட்டிப்பு imports
   சுருக்கப்படுதல், தேவையான இடங்களில் `SystemColors`/`ColorTranslator` alias வெளியிடப்படுதல், VB-க்கு: மறைமுக
   constructor மீண்டும் செருகப்படுதல், `My.Resources` accessor உருவாக்கப்படுதல், மீதமுள்ள `My.*` பயன்பாட்டுக்கு எச்சரிக்கை.
3. **Resx கோப்புகள்** — மாற்றத்தைத் தப்பிப் பிழைக்க வேண்டிய image/type குறிப்புகளுக்காக scan செய்யப்படுகின்றன.
4. **அறிக்கை** — ஒரு Markdown சுருக்கம் (இயல்பு `migration-report.md`).

### அறிக்கையைப் படித்தல்
{:#module-5-report}

மூன்று பிரிவுகள் முக்கியமானவை:

- **Scan செய்யப்பட்டவை vs. மாற்றப்பட்டவை** எண்ணிக்கைகள் — diff-இன் வரம்பு, ஒரே பார்வையில்.
- **கோப்பு வாரியான மாற்றப் பட்டியல்** — உண்மையில் தொடப்பட்ட அனைத்தும்.
- **கைமுறை மதிப்பாய்வு** — காரணம் வாரியாகத் தொகுக்கப்பட்ட ஒவ்வொரு எச்சரிக்கையும்: ஆதரிக்கப்படாத namespaces, வெறும்
  `System.Drawing` import-இன் கீழுள்ள தகுதிப்படுத்தப்படாத GDI+ types, `My.*` பயன்பாடு, முழுமையாகத் தவிர்க்கப்பட்ட எந்த
  project-உம். மிகப் பொதுவாகத் தவிர்க்கப்படுவது **பழைய SDK-style அல்லாத `.csproj`/`.vbproj`**; அதை நீங்கள் முதலில் SDK
  style-க்கு மாற்ற வேண்டும் — இது project-வடிவ முன்நிபந்தனை, migrator தவறவிட்டது அல்ல.

### `--dual-build` உடன் படிப்படியான இடம்பெயர்த்தல் (C# மட்டும்)
{:#module-5-dualbuild}

இயல்பாக, tool ஒரு project-ஐ முழுமையாக மாற்றிவிடுகிறது. அதற்குப் பதிலாக `--dual-build`, ஒரே MSBuild property மூலம்
மாற்றக்கூடிய வகையில், ஒரு C# project-ஐ **இரண்டில் ஏதாவது ஒரு** stack-க்கு எதிராக build ஆக அனுமதிக்கிறது — எனவே உங்கள்
Windows டெவலப்பர்கள் திருப்தி அடையும் வரை உண்மையான WinForms-க்கு எதிராக build செய்துகொண்டே இருக்கலாம். Project
கோப்புகள் வேறுவிதத்தில் தொடப்படுவதில்லை; கோப்பின் மேலுள்ள import மட்டுமே நிபந்தனைக்குட்பட்டதாகிறது:

```csharp
#if MAJORSILENCE_FORMS
using Majorsilence.Forms;
#else
using System.Windows.Forms;
#endif
```

repo root-இல் உள்ள ஒரு `Directory.Build.props` மூலம் build-ஐ மாற்றுங்கள்:

```xml
<Project>
  <PropertyGroup>
    <MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>
  </PropertyGroup>
</Project>
```

இரண்டு எச்சரிக்கைகள். இது **வேண்டுமென்றே குறுகியது**: கோப்பின் உடலில் உள்ள எந்த *முழுமையாகத் தகுதிப்படுத்தப்பட்ட*
குறிப்பும் (`System.Windows.Forms.MessageBox.Show(...)`) இன்னும் நிபந்தனையின்றி மீண்டும் எழுதப்படுகிறது, symbol
வரையறுக்கப்பட்ட பின்னரே compile ஆகிறது.

மேலும் **இதற்கு VB-இல் இணையானது இல்லை**; அதனால்தான் இந்தப் பிரிவில் VB மாதிரி இல்லை. `MyType=Empty` முழு VB "My"
application framework-ஐயும் — மறைமுக constructor, `My.*`, அனைத்தையும் — அணைத்துவிடுகிறது, எந்த preprocessor symbol-ஆலும்
அதை மாற்ற முடியாது. `--dual-build` கொடுக்கப்பட்ட ஒரு VB project, அதற்குப் பதிலாக, ஏன் என்று விளக்கும் எச்சரிக்கையுடன்,
சாதாரண முழுமையான முறையில் மாற்றப்படுகிறது. **VB குழுக்களுக்கு: dual-build காலத்துக்குப் பதிலாக ஒரு மாற்றுத் தருணத்தை
(cut-over) திட்டமிடுங்கள்**, மாற்றப்பட்டது நம்பகமானதாகும் வரை இடம்பெயர்த்தலுக்கு முந்தைய branch-ஐ உயிருடன் வைத்திருங்கள்.

### கைமுறைத் திருத்தச் சரிபார்ப்புப் பட்டியல்
{:#module-5-checklist}

Rewriter-ஆல் இவற்றைப் பார்க்க முடியாது. diff வந்தபின் இவற்றை வெளிப்படையாக முடியுங்கள் — "அது compile ஆனது" என்பதற்கும்
"அது சரியாக நடந்துகொள்கிறது" என்பதற்கும் இடையிலான வேறுபாடு இவைதான்.

| # | மாற்றம் | என்ன செய்ய வேண்டும் |
|---|---|---|
| 1 | **`SplitContainer.Orientation`-இன் பொருள் மாறியது** — இப்போது அது WinForms-இல் போலவே, layout-இன் அல்ல, *பட்டையின்* (bar) திசை. `Vertical` (இயல்பு) = panels அருகருகே. | நீங்கள் அதை ஒருபோதும் அமைக்கவில்லை என்றால், எதுவும் மாறாது. **அமைத்திருந்தால், அதைத் தலைகீழாக்குங்கள்.** எதுவும் உங்களை எச்சரிக்காது: இரண்டு மதிப்புகளும் முன்னும் பின்னும் compile ஆகின்றன, உரை அடிப்படையிலான சுற்றில் migrator-ஆல் ஒரு `SplitContainer.Orientation`-ஐ வேறு எந்த `Orientation`-இலிருந்தும் பிரித்தறிய முடியாது. grep செய்யுங்கள். `Splitter`-க்கும் இதுவே. |
| 2 | **நிகழ்வு delegate types இப்போது WinForms-உடன் பொருந்துகின்றன.** `KeyDown`/`KeyUp` → `KeyEventHandler`; `Mouse*` குடும்பம் → `MouseEventHandler`; `Form.FormClosing` → `FormClosingEventHandler`; `PrintDocument.PrintPage` → `PrintPageEventHandler`; `Control.MouseEnter`-உம் menu/tool-strip item `Click`-உம் → சாதாரண `EventHandler`. | Lambdas, `AddressOf` handlers, VB `Handles` clauses தொடர்ந்து வேலை செய்கின்றன. C#-இல் **வெளிப்படையாக உருவாக்கப்பட்ட** `new KeyEventHandler<…>`-பாணி wrappers (`new EventHandler<KeyEventArgs>(…)`) இனி மாறுவதில்லை — wrapper-ஐ நீக்குங்கள் அல்லது WinForms delegate-ஐப் பெயரிடுங்கள். |
| 3 | **`Click`, `MouseEnter` இனி mouse ஆயத்தொலைவுகளைக் கொண்டுசெல்வதில்லை** — ஏனெனில் WinForms-இல் அவை ஒருபோதும் கொண்டுசென்றதில்லை. | `Click`-இலிருந்து `e.X`/`e.Button`-ஐப் படிக்கும் handler `MouseClick`-க்கு நகர்கிறது. ஒரு menu item-இல் (WinForms-இலும் mouse-type மாறுபாடு இல்லை), நிலையைச் சொந்தக் கட்டுப்பாட்டிலிருந்து எடுங்கள். C#-இல், பழைய `OnMouseEnter(MouseEventArgs)`-ஐ override செய்தால் CS0115 உடன் தோல்வியடைகிறது; VB-இல் இணையான `Overrides` புதிய signature-க்கு எதிராக compile ஆகத் தவறுகிறது — இரண்டுமே உரக்கத் தோல்வியடைகின்றன, அதுதான் உங்களுக்கு வேண்டியது. |
| 4 | **`TreeViewDrawMode.OwnerDrawContent`, WinForms-இன் `OwnerDrawText` என மறுபெயரிடப்பட்டது**, `OwnerDrawAll` இப்போது உள்ளது. | எதுவும் உடையாது — பழைய பெயர் அதே மதிப்புடன் கூடிய `[Obsolete]` alias — ஆனால் அது நீக்கப்படும். இப்போதே மறுபெயரிடுங்கள். `OwnerDrawText` பின்னணி/focus வரைதலுக்குப் பிறகு `DrawNode`-ஐ எழுப்புகிறது; `OwnerDrawAll` எதுவும் வரையப்படுவதற்கு முன்பே அதை எழுப்புகிறது. |
| 5 | **இரண்டு `DataGridViewDataErrorContexts` members நீக்கப்பட்டன** (`RowDirtyStateNeeded`, `CleanupExceptionHandling`) — இரண்டுமே WinForms members அல்ல. | அந்த மதிப்புகளில் இப்போது உள்ள உண்மையானவற்றைக் கொண்டு மாற்றுங்கள்: `RowDeletion`, `ClipboardContent`. |
| 6 | **Strongly-typed resource designers.** உருவாக்கப்பட்ட ஒரு `Resources.Designer.cs`/`.vb`, `ResourceManager.GetObject(...)`-ஐ ஒரு drawing type-க்கு cast செய்கிறது; ஒரு உண்மையான `System.Resources.ResourceManager` compile செய்யப்பட்ட `.resources` பெயரிடுவதையே திருப்பித் தருகிறது, எனவே சுத்தமாக compile ஆன பிறகு, runtime-இல் முதல் resource வாசிப்பில் cast `InvalidCastException` எறிகிறது. | Builder-இன் சொந்த `GeneratedCodeAttribute`-ஐ நிபந்தனையாகக் கொண்டு migrator இதை உங்களுக்காகக் கையாள்கிறது: அந்தக் கோப்புகளில் மட்டும், `ResourceManager` என்பது `Majorsilence.Forms.ComponentResourceManager` ஆகிறது; அது அதே `.resources`-ஐப் படித்து graphics பதிவுகளை இயல்பாக்குகிறது. கையால் எழுதப்பட்ட string lookups BCL type-ஐயே வைத்திருக்கின்றன. **Resources அதிகம் உள்ள உங்கள் படிவங்களை முன்கூட்டியே சரிபாருங்கள்.** |
| 7 | **VB `My.*` பகுதியளவு செயல்படுத்தப்பட்டுள்ளது — API அடிப்படையில் அல்ல, சான்றுகளின் அடிப்படையில்.** ஒரு பெரிய உண்மையான VB குறியீட்டுத் தளத்தின் சாத்தியக்கூறுத் தணிக்கை, கையால் எழுதப்பட்ட குறியீடு மூன்று பகுதிகளை மட்டுமே தொடுவதைக் கண்டறிந்தது, எனவே சரியாக அந்த மூன்றுமே உண்மையானவை: `My.Application.Info.*` (`Title`, உண்மையான `Version` ஆக `Version`, `Copyright`, `CompanyName`, …), `My.Resources.*` (உருவாக்கப்பட்ட accessor module), `My.Computer.Name`. | மற்ற அனைத்தும் அமைதியாக மீண்டும் எழுதப்படுவதற்குப் பதிலாக இன்னும் எச்சரிக்கை தருகின்றன: `My.Forms`, `My.Settings`, `My.User`, `My.Application.Log`/`Startup`/`Shutdown`/`UnhandledException`, splash screens, `My.Computer.Registry`/`Clipboard`/`Info` — உருவாக்கப்பட்ட `Settings.Designer.vb` boilerplate-க்கு வெளியே இவற்றில் எதற்கும் கையால் எழுதப்பட்ட பயன்பாடு பூஜ்ஜியம் என்று தணிக்கை கண்டறிந்தது; பலவற்றுக்குக் கையடக்க இணையானது இல்லை. கீழுள்ள மாற்று முறைகளையும், MIGRATION.md-இன் "Still not implemented, and why" பகுதியையும் பார்க்கவும். மேலும் கவனிக்க: `ResXFileRef` ஆகச் சேமிக்கப்பட்ட resx பதிவுகள் (inline data அல்லாமல் இணைக்கப்பட்ட கோப்பு) compile ஆகின்றன, ஆனால் runtime-இல் `null` ஆகத் தீர்க்கப்படுகின்றன. |
| 8 | **இணக்க இலக்கு இல்லாத Telerik துணை namespaces** — `Telerik.WinControls.Themes`, `.Design`, `.Primitives`, `.Layouts` — எச்சரித்து விட்டுவிடப்படுகின்றன. | ஒவ்வொரு பயன்பாட்டுக்கும் தீர்மானியுங்கள்: theming-ஐ நீக்குங்கள், அல்லது மீண்டும் செயல்படுத்துங்கள். மேலும்: `RadScheduler`-இன் month/week/day **calendar grid UI** வேண்டுமென்றே வரம்புக்கு வெளியே உள்ளது (data layer, navigation, agenda view உண்மையானவை), எனவே grid-ஐப் பயன்படுத்தும் குறியீட்டை agenda view-க்கு எதிராக மீண்டும் எழுத வேண்டும். |

**VB `My.*` மேற்பரப்பை மாற்றுதல்.** செயல்படுத்தப்பட்ட மூன்று பகுதிகளுக்கும் எந்த வேலையும் தேவையில்லை:

```vb
' இவை இடம்பெயர்த்தலுக்குப் பிறகும் தொடர்ந்து வேலை செய்கின்றன:
Dim title = My.Application.Info.Title
Dim ver As Version = My.Application.Info.Version      ' உண்மையான Version, String அல்ல
logo.Image = My.Resources.CompanyLogo                 ' உருவாக்கப்பட்ட accessor module
Dim machine = My.Computer.Name
```

பெரும்பாலான குறியீட்டுத் தளங்கள் சந்திப்பது `My.Forms`-ஐத்தான். மறைமுக singleton-ஐ வெளிப்படையான instance கொண்டு மாற்றுங்கள்:

```vb
' முன் — My.Forms ஒவ்வொரு படிவ type-க்கும் தாமதமாக உருவாக்கப்படும் singleton-ஐத் தந்தது:
My.Forms.CustomerForm.Show()

' பின் — instance-ஐ நீங்களே வைத்திருங்கள் (அல்லது உங்கள் DI container-இலிருந்து பெறுங்கள்):
Private customerForm As CustomerForm

Private Sub ShowCustomers()
    If customerForm Is Nothing OrElse customerForm.IsDisposed Then
        customerForm = New CustomerForm()
    End If
    customerForm.Show()
End Sub
```

`My.Settings`, .NET-இல் வேறு இடங்களில் நீங்கள் ஏற்கனவே பயன்படுத்தும் configuration எதுவோ அதுவாக மாறுகிறது —
`Microsoft.Extensions.Configuration`, ஒரு JSON கோப்பு, அல்லது உங்கள் சொந்த settings class:

```vb
' முன்:  Dim url = My.Settings.ApiBaseUrl
' பின்:
Dim url = AppSettings.Current.ApiBaseUrl
```

### Imports-ஐ மீண்டும் எழுதவே முடியாதபோது
{:#module-5-compat}

Migrator-ஆல் சேவை செய்ய முடியாத ஒரு நிலைமை: **public API `System.Windows.Forms`-க்கு type செய்யப்பட்ட, விநியோகிக்கப்படும்
control library** — அதன் பயனர்கள் அதற்கு உண்மையான WinForms types-ஐக் கொடுக்கிறார்கள், எனவே அதன் `using`-களை மீண்டும்
எழுதினால் அவர்கள் உடைந்துவிடுவார்கள். அந்த நிலைக்கு ஒரு proof-of-concept source generator உள்ளது,
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/tree/main/src/Majorsilence.Forms.WinFormsShims.Compat);
அது Majorsilence.Forms-ஐ *அடிப்படையாகக் கொண்ட* `System.Windows.Forms`, `System.Drawing` namespaces-ஐ வெளியிடுகிறது,
எனவே **மாற்றப்படாத** WinForms மூலக் குறியீடு — Designer கோப்புகள் உட்பட — உண்மையான WinForms assembly எதுவும் இல்லாமல்
framework-க்கு எதிராக compile ஆகிறது. [`WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo)
மாதிரி அது வேலை செய்வதைக் காட்டுகிறது; அதன் `RESULTS.md` எது வேலை செய்தது, எது செய்யவில்லை என்பதைப் பதிவு செய்கிறது.
இதைச் சார்ந்திருக்க வேண்டிய திட்டமாக அல்ல, மதிப்பிட வேண்டிய ஒரு பரிசோதனையாகக் கருதுங்கள்; வெளியிடப்படும் பாதை migrator தான்.

**உடைக்கும் மாற்றங்கள் (breaking changes) எங்கே உள்ளன.** மேலுள்ள சரிபார்ப்புப் பட்டியலின் ஒவ்வொரு உருப்படியும்
[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)-இன் "Breaking change", "Renamed to match WinForms"
பிரிவுகளிலிருந்து வந்தது; புதியது ஒன்று முதலில் தோன்றுவதும் அங்கேதான். முதல் இடம்பெயர்த்தலில் மட்டுமல்ல, ஒவ்வொரு
மேம்படுத்தலிலும் அந்தப் பிரிவுகளைப் படியுங்கள் — [module 10](#module-10-versioning) பேசுவது அந்தப் பழக்கத்தைப் பற்றித்தான்.

**பயிற்சி 5.** ஒரு உண்மையான உள்ளகப் பயன்பாட்டின் மீது — இந்தக் காலாண்டில் யாரும் சார்ந்திராத ஒன்றாக இருப்பது நல்லது —
முதலில் `--dry-run --diff` உடன் migrator-ஐ இயக்குங்கள். பின்னர் ஒரு branch-இல் உண்மையாக இயக்கி, அதை build ஆக வைத்து,
மேலுள்ள சரிபார்ப்புப் பட்டியலை உருப்படி உருப்படியாக முடியுங்கள். அதற்கு ஒரு நாள் நேர வரம்பு வையுங்கள்; நோக்கம் உங்கள்
மீதமுள்ள பயன்பாடுகளுக்கான அளவீடு செய்யப்பட்ட மதிப்பீடு, முடிக்கப்பட்ட port அல்ல.

---
## Module 6 — உங்கள் இலக்குகளைத் தேர்ந்தெடுத்தல்
{:#module-6}

**விளைவு:** ஒவ்வொரு இலக்குக்கும் சரியான பின்தள (backend) package-ஐ உங்களால் தேர்ந்தெடுக்க முடியும்; மேலும் ஒவ்வொன்றிலும் உண்மையில் கிடைக்காதவை எவை என்பதைத் தாமதமாகக் கண்டுபிடிப்பதற்குப் பதிலாக முன்பே அறிந்திருப்பீர்கள்.

உங்கள் இலக்குத் தொகுப்பு என்பது ஒரு package தேர்வு:

| இதைக் குறிப்பிடுங்கள் (reference) | இலக்கு | குறிப்புகள் |
|---|---|---|
| `Majorsilence.Forms.Avalonia` | **இயல்புநிலை (Default).** Windows/macOS/Linux desktop — அத்துடன் Avalonia-வின் சொந்தத் தள packages வழியாக Browser/WASM (எப்போதும் build செய்யப்படும்), Android மற்றும் iOS (விருப்பத்தின் பேரில், workloads தேவை) | குறிப்பிடப்பட்டால் தானாகவே தீர்க்கப்படும் (resolved). இதன் சாளர ஹோஸ்ட் *உண்மையிலேயே* ஒரு நேட்டிவ் சாளரமாக இருக்கும் பல்தள பின்தளம் இது; எனவே இது உண்மையான தள handle-ஐ வழங்குகிறது, ஹோஸ்ட் பயன்பாட்டுக்கு OS-நிலை modal பண்புகளைத் தருகிறது. WebView2/WKWebView/WebKitGTK வழியாக WebView |
| `Majorsilence.Forms.Uno` | Uno அடுக்கின் வழியாக desktop, அத்துடன் iOS/Android/WebAssembly | `SKXamlCanvas` வழியாகக் காட்சிப்படுத்துகிறது; ஒரு Uno app head தேவை. owner என்ற கருத்து இல்லை — modality-க்கு `Form.ShowDialog(parent)`-ஐப் பயன்படுத்துங்கள் |
| `Majorsilence.Forms.Gtk4` | முதன்மையாக Linux — ஒவ்வொரு படிவத்துக்கும் ஓர் உண்மையான `Gtk.Window`; GTK 4 runtime நிறுவப்பட்டிருந்தால் Windows/macOS-இலும் | வெளிப்படையாகத் தேர்ந்தெடுக்கப்பட வேண்டும். உட்பொதித்தலின் இரு திசைகளும், **airspace பிரச்சினை இல்லாத** `NativeControlHost`, WebKitGTK 6.0 வழியாக `WebBrowser`. அறியப்பட்ட வரம்புகள்: திரை நிலையைக் கட்டுப்படுத்த முடியாது (GTK 4 அதை நீக்கிவிட்டது, எனவே `Location` ஒரு குறிப்பு மட்டுமே), `SetIcon(byte[])` no-op (எதுவும் செய்யாது), கோப்புத் தேர்வுச் சாளரங்கள் framework-இன் சொந்த உரையாடல் சாளரங்களுக்குத் திரும்புகின்றன, முழுஎண் அளவுக் காரணி (integer scale factor) மட்டுமே |
| `Majorsilence.Forms.Terminal` | ஒரு console — தொலைபேசியில் போலவே, தலைப்புப் பட்டை இல்லாமல் படிவம் terminal முழுவதையும் நிரப்புகிறது | terminal-இல் இருந்தால் உண்மையான பிக்சல் தெளிவுத்திறனில் Kitty graphics அல்லது Sixel, இல்லையெனில் Unicode block glyphs; mouse மற்றும் keyboard; Ctrl+C எப்போதும் வெளியேறும். xterm மற்றும் WezTerm-இல் சரிபார்க்கப்பட்டது. நேட்டிவ் தேர்வுச் சாளரங்கள், `NativeControlHost` அல்லது webview இல்லை |
| `Majorsilence.Forms.WinForms` | **Windows மட்டும்** — Win32 pump மீது உண்மையான `System.Windows.Forms` சாளரங்கள் | ஓர் *இடம்பெயர்த்தல்* பின்தளம் ([module 7](#module-7-c)): Majorsilence கட்டுப்பாடுகளை ஒரு WinForms பயன்பாட்டில் ஒவ்வொன்றாக உட்பொதியுங்கள். `net48`-ஐயும் இலக்காகக் கொள்கிறது. உண்மையான `HWND`. gestures இல்லை, webview இல்லை |
| `Majorsilence.Forms.Wpf` | **Windows மட்டும்** — `Dispatcher` loop மீது ஓர் உண்மையான WPF `Window` | WinForms பின்தளத்தின் அதே வடிவமும் நோக்கமும்: `ToWpfElement()`, `ToWpfWindow()`. `net48`, `net8.0-windows`, `net10.0-windows` |
| `Majorsilence.Forms.Headless` | சோதனைகள், CI, servers, pixel-diff | திரை (display) தேவையில்லை. இதுவே உங்கள் சோதனை வழி ([module 8](#module-8)). கைமுறை animation கடிகாரம் |

தானாகவே நிறுவிக்கொள்ளும் பின்தளம் Avalonia மட்டுமே. மற்றவை ஒவ்வொன்றும் ஒரு வரி; முதல் படிவம் உருவாக்கப்படுவதற்கு முன் அது வைக்கப்பட வேண்டும் ([module 2](#module-2-code)-இல் உள்ள வரிசைக் கட்டுப்பாடு):

**C#**

```csharp
// GTK 4 — இதற்கு ஒரு helper உள்ளது
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();

// Terminal — இதற்கும் அப்படியே
Majorsilence.Forms.Terminal.TerminalApplication.Use ();

// WinForms, WPF, Headless — பின்தளத்தை நேரடியாக assign செய்யுங்கள்
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.WinForms.WinFormsPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Majorsilence.Forms.Application.Run (new MainForm ());   // நீங்கள் தேர்ந்தெடுத்த வரிக்குப் பிறகு
```

**VB.NET**

```vb
' GTK 4 — இதற்கு ஒரு helper உள்ளது
Majorsilence.Forms.Gtk4.Gtk4Application.Use()

' Terminal — இதற்கும் அப்படியே
Majorsilence.Forms.Terminal.TerminalApplication.Use()

' WinForms, WPF, Headless — பின்தளத்தை நேரடியாக assign செய்யுங்கள்
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.WinForms.WinFormsPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Wpf.WpfPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Majorsilence.Forms.Application.Run(New MainForm())      ' நீங்கள் தேர்ந்தெடுத்த வரிக்குப் பிறகு
```

(நிச்சயமாக, ஒன்றை மட்டும் தேர்ந்தெடுங்கள் — அந்த வரியின் எல்லா வடிவங்களையும் இந்தத் தொகுதி காட்டுகிறது.) GTK 4 பின்தளத்துக்குக் கணினியில் நேட்டிவ் libraries-உம் தேவை: Debian/Ubuntu-இல் `libgtk-4-1`, Fedora/Arch-இல் `gtk4`, macOS-இல் `brew install
gtk4`, மேலும் நீங்கள் `WebBrowser`-ஐப் பயன்படுத்தினால் WebKitGTK 6.0.

Avalonia மீதான desktop முதிர்ச்சியடைந்த பாதை. கீழே உள்ளவை அனைத்தும் புதிய இலக்குகளைப் பற்றியவை, ஒவ்வொன்றின் நேர்மையான நிலையையும் பற்றியவை.

### ஒற்றைக் காட்சித் தளங்கள்: browser, Android, iOS
{:#module-6-singleview}

அந்த மூன்றிலும் OS சாளர மேலாளர் (window manager) இல்லை — ஒவ்வொன்றும் ஒரு பயன்பாடு/tab/திரைக்குச் சரியாக ஒரே ஒரு உட்பொதிக்கக்கூடிய காட்சியை (view) மட்டுமே வழங்குகிறது. **ஒவ்வொரு** சாளரமும் ஒரு canvas ஆக இருக்கும் ஒரே ஹோஸ்டை அவை பகிர்கின்றன: popup அல்லாத முதல் சாளரம் viewport-ஐ நிரப்புகிறது; மற்ற அனைத்தும் — ComboBox dropdowns, menus, கூடுதல் top-level படிவங்கள் — அதன் முழுமையாக நிலைப்படுத்தப்பட்ட (absolutely positioned) child ஆகும்.

தொடக்கம் ஹோஸ்டால் இயக்கப்படுகிறது; எனவே ஒவ்வொரு தளத்துக்கும் ஒரு **factory**-ஐ ஏற்கும் சொந்த நுழைவுப் புள்ளி (entry point) உள்ளது (பின்தளம் தொடங்கப்படும் வரை படிவம் இருக்கக்கூடாது), அவற்றில் எதுவும் தடுப்பதில்லை (block செய்வதில்லை):

**C#**

```csharp
// Browser (WASM) — உங்கள் browser head-இன் Program.cs
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());

// Android — உங்கள் Activity-யின் OnCreate-இலிருந்து
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());

// iOS — FinishedLaunching-இலிருந்து
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());
```

**VB.NET**

```vb
' Browser (WASM). VB-க்கு async நுழைவுப் புள்ளி இல்லை, RunBrowserAsync தடுப்பதும் இல்லை —
' tab-இன் சொந்த event loop UI-ஐ இயக்குகிறது — எனவே அதைத் தொடங்கிவிட்டுத் திரும்புங்கள்.
Module Program
    Sub Main()
        Dim starting = Majorsilence.Forms.Application.RunBrowserAsync(Function() New MainForm())
    End Sub
End Module

' Android — உங்கள் Activity-யின் OnCreate-இலிருந்து
Majorsilence.Forms.Application.RunAndroid(Function() New MainForm())

' iOS — FinishedLaunching-இலிருந்து
Majorsilence.Forms.Application.RunIOS(Function() New MainForm())
```

argument-இன் வடிவத்தைக் கவனியுங்கள்: ஒரு **factory** (`Function() New MainForm()`), ஒரு instance அல்ல. `New MainForm()`-ஐ நேரடியாகக் கொடுத்தால், பின்தளம் இருப்பதற்கு முன்பே படிவம் உருவாக்கப்பட்டுவிடும்.

**அங்கே வேலை செய்யாதவை** — இவை சாளர மேலாளர் இல்லாததன் இயல்பான விளைவுகள், நிலுவையிலுள்ள வேலை அல்ல:

- **சாளர அலங்காரம் (window chrome) இல்லை.** `Title`, `Topmost`, `SetSystemDecorations`, `SetIcon`, min/max அளவு, `CanResize`, `ShowInTaskbar`, `WindowState` ஆகியவை no-ops; `WindowState` எப்போதும் `Normal` என்றே வாசிக்கப்படும்.
- **உரையாடல் சாளரங்கள் OS-modal அல்ல**, ஏனெனில் modal சாளரம் என்ற கருத்தே இல்லை — ஓர் உரையாடல் சாளரம் முதன்மைக் காட்சியின் child, parent-ஐ முடக்கும் பண்புகள் உட்பட. மேலும் **தடுக்கும் (blocking) அழைப்புகள் முற்றிலும் வேலை செய்யாது**: அடுத்த பகுதியைப் பாருங்கள்.
- **WebView இல்லை**, எனவே அது தேவைப்படும் இணக்கக் கட்டுப்பாடுகள் (`RadPdfViewer`, `RadRichTextEditor`) அவற்றின் எளிய-viewer/`RichTextBox` பாதைகளுக்குத் திரும்புகின்றன.
- **சாளர deactivation மூலம் வெளியே click செய்தால் popup மூடப்படுவது நிகழாது.** பயன்பாட்டுக்கு *உள்ளே* வேறோர் இடத்தில் click செய்தால் popups இன்னும் மூடப்படும்; பயன்பாட்டுக்கு முற்றிலும் வெளியே உள்ள ஒன்றுக்கு focus போவது மட்டுமே கையாளப்படுவதில்லை.

### async உரையாடல் சாளர விதி
{:#module-6-async}

இந்த module-இல் நீங்கள் குறியீட்டை *எழுதும்* முறையை மாற்றும் ஒரே விதி இதுதான், எனவே இதற்குத் தனித் தலைப்பு. browser-இல், .NET பக்கத்தின் ஒற்றை JavaScript thread மீது இயங்குகிறது; திரும்பாத ஓர் அழைப்பு, அது திரும்ப உதவியிருக்கக்கூடிய input, timers, வரைதல் ஆகியவற்றை நிறுத்திவிடுகிறது. Android மற்றும் iOS-இல், Avalonia-வின் dispatcher ஒரு nested frame-ஐ push செய்ய முடியாது. எனவே மூன்று வரிசைகளிலும் Avalonia பின்தளம் `CanRunModalLoop = false` என அறிவிக்கிறது; தடுக்கும் ஒவ்வொரு modal அழைப்பும் — `Form.ShowDialog`, `MessageBox.Show`, கோப்புத் தேர்வுச் சாளரங்களின் `ShowDialog`, `TaskDialog.ShowDialog`, `VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show` — **எதையும் காட்டுவதற்கு முன்பே, அதன் async இரட்டையின் பெயரைக் குறிப்பிட்டு** `PlatformNotSupportedException`-ஐ எறிகிறது. (Android 15 emulator மற்றும் iPhone 17 Pro simulator-இல் அளவிடப்பட்டது; `docs/backends.md`-இல் பதிவு செய்யப்பட்டுள்ளது.)

async வடிவங்கள் desktop உட்பட ஒவ்வொரு பின்தளத்திலும் வேலை செய்கின்றன, எனவே பகிரப்பட்ட UI library அவற்றை ஒருமுறை எழுதினால் போதும்:

**C#**

```csharp
// முன்பு — desktop-க்கு மட்டும்
private void OkButton_Click (object? sender, EventArgs e)
{
    if (string.IsNullOrWhiteSpace (nameBox.Text)) {
        MessageBox.Show ("Please enter a name.", "Greeter");
        return;
    }
    using var confirm = new ConfirmForm ();
    if (confirm.ShowDialog (this) == DialogResult.OK)
        Save ();
}

// பின்பு — எல்லா இடங்களிலும் இயங்கும். async void handler என்பதே வழக்கம்; முடிவு இன்னும் ஒரு DialogResult தான்.
private async void OkButton_Click (object? sender, EventArgs e)
{
    if (string.IsNullOrWhiteSpace (nameBox.Text)) {
        await MessageBox.ShowAsync ("Please enter a name.", "Greeter");
        return;
    }
    using var confirm = new ConfirmForm ();
    if (await confirm.ShowDialogAsync (this) == DialogResult.OK)
        Save ();
}
```

**VB.NET**

```vb
' முன்பு — desktop-க்கு மட்டும்
Private Sub OkButton_Click(sender As Object, e As EventArgs)
    If String.IsNullOrWhiteSpace(nameBox.Text) Then
        MessageBox.Show("Please enter a name.", "Greeter")
        Return
    End If
    Using confirm As New ConfirmForm()
        If confirm.ShowDialog(Me) = DialogResult.OK Then Save()
    End Using
End Sub

' பின்பு — எல்லா இடங்களிலும் இயங்கும். Async Sub ... Await என்பதே VB-இன் நிகழ்வு கையாளி வழக்கம்.
Private Async Sub OkButton_Click(sender As Object, e As EventArgs)
    If String.IsNullOrWhiteSpace(nameBox.Text) Then
        Await MessageBox.ShowAsync("Please enter a name.", "Greeter")
        Return
    End If
    Using confirm As New ConfirmForm()
        If Await confirm.ShowDialogAsync(Me) = DialogResult.OK Then Save()
    End Using
End Sub
```

UI thread-ஐத் தடுக்கும் மற்ற அனைத்துக்கும் — `.Result`, `.Wait()`, `GetAwaiter().GetResult()`, `Thread.Sleep` — இதே விதி பொருந்தும்; எனவே அதற்குப் பதிலாக task-ஐ `await` செய்யுங்கள், `await Task.Delay (n)` பயன்படுத்துங்கள்.

**இவற்றை நீங்கள் கையால் தேட வேண்டியதில்லை.** மைய `Majorsilence.Forms` package ஒரு Roslyn analyzer-ஐக் கொண்டுள்ளது — `MFB001` (தடுக்கும் modal அழைப்பு, அதன் await செய்யக்கூடிய இரட்டையின் பெயருடன்), `MFB002` (ஒரு task மீது synchronous காத்திருப்பு), `MFB003` (`Thread.Sleep`) — நிரலின் வடிவம் மாறாத இடங்களில் (ஒரு `async` method-க்குள், அல்லது ஒரு `void` நிகழ்வு கையாளியில் — அதை அது `async` எனக் குறிக்கிறது) ஒரு handler-ஐ await செய்யப்பட்ட வடிவத்துக்கு மீண்டும் எழுதும் code fixes-உடன். desktop-மட்டுமான குறியீட்டில் இது அமைதியாக இருக்கும்; ஒரு `net*-browser` இலக்கில் இயக்கத்துக்கு வரும். ஒரு browser head குறிப்பிடும் **பகிரப்பட்ட UI library**-ஐயும் உள்ளடக்க, அந்த library-க்கு அருகில் opt in செய்யுங்கள்:

```ini
# பகிரப்பட்ட UI project-க்கு அருகில் உள்ள .editorconfig (அல்லது ஒரு .globalconfig)
[*.cs]
majorsilence_forms.browser_target = true
```

roadmap-இல் browser அல்லது phone head உள்ள எந்த project-இலும் அந்த opt-in-ஐ முதல் நாளிலேயே செய்யுங்கள்; பின்னர் handlers-ஐ மாற்றுவதைவிட இது மிகவும் மலிவானது. ஒரு நேர்மையான வரம்பு: analyzer இன்று browser-க்கு மட்டுமே, எனவே Android அல்லது iOS குறியீட்டிலிருந்து மட்டுமே அடையப்படும் தடுக்கும் அழைப்பு build நேரத்தில் கொடியிடப்படாது — அது இயக்க நேரத்தில் மேலே உள்ள செய்தியுடன் தோல்வியடையும். (analyzer-உம் அதன் diagnostics-உம் C#-க்கு மட்டுமான Roslyn விதிகள்; ஒரு VB project இயக்க நேர exception-ஐப் பெறும், ஆனால் build நேர எச்சரிக்கையைப் பெறாது.)

### தொலைபேசி வரிசைகளில் வேலை செய்பவை
{:#module-6-mobile}

ஒரு தொலைபேசிப் பயன்பாடு இல்லாமல் வெளியிட முடியாத அம்சங்களை Avalonia Android மற்றும் iOS வரிசைகள் பெற்றுள்ளன; படிவத்தின் பார்வையில் அவை அனைத்தும் தானியக்கமானவை:

- **திரை விசைப்பலகை (on-screen keyboard)** ஒரு `TextBox` focus பெறும்போது எழுப்பப்படுகிறது, blur ஆகும்போது மறைக்கப்படுகிறது; விசைப்பலகை திறக்கும்போது புலம் அதற்கு மேலே scroll செய்யப்படுகிறது. `TextBoxBase.InputKind` (`Number`, `Email`, `Url`, `Phone`) விசைப்பலகை அமைப்பைத் தேர்ந்தெடுக்கிறது — box focus பெறுவதற்கு முன் அதை அமைத்துவிடுங்கள், ஏனெனில் அது அப்போதுதான் வாசிக்கப்படுகிறது. desktop இதைப் புறக்கணிக்கிறது.
- **Safe-area insets** (status bar, notch, home indicator) `Form.SafeAreaPadding` வழியாகப் படிவத்தின் client layout-க்குப் பயன்படுத்தப்படுகின்றன; எனவே dock மற்றும் anchor செய்யப்பட்ட கட்டுப்பாடுகள் குறியீடு இல்லாமலேயே அவற்றிலிருந்து விலகி நிற்கின்றன.
- **Android back button** `WindowBase.BackRequested`-ஐ எழுப்புகிறது (ரத்து செய்யக்கூடிய நிகழ்வு — திறந்திருக்கும் popup அல்லது sheet அதை முதலில் பெறுகிறது). வார்ப்புரு உருவாக்கும் `MainActivity` ஏற்கனவே அதை முன்னனுப்புகிறது.
- **`Form.SizeClass`** (600 தருக்க px-க்குக் கீழ் `Compact`, `Medium`, 840-இலிருந்து `Expanded`) மற்றும் `SizeClassChanged` ஆகியவை ஒரே படிவம் தொலைபேசி layout-க்கும் tablet layout-க்கும் இடையே மாற உதவுகின்றன.
- `Application.Suspended`/`Resumed`, haptics, திரையை விழித்திருக்க வைத்தல் (keep-screen-awake), in-process audio.

மேலும் தொலைபேசி வடிவத் திரைகளுக்காக உருவாக்கப்பட்ட நான்கு கட்டுப்பாடுகள் — அனைத்தும் மைய package-இல், desktop-இலும் பயன்படுத்தக்கூடியவை: **`StackPanel`** (ஒரு Majorsilence நீட்டிப்பு — ஒவ்வொரு child-ஐயும் column அகலத்துக்கு நீட்டுகிறது, அகலமான சாளரத்தில் column-ஐ வாசிக்க ஏற்ற அகலத்தில் கட்டுப்படுத்துகிறது), **`Card`** (தீமிலிருந்து நிறம் பெறும், வட்டமான, எல்லையுடைய ஒரு `Panel`), **`RichListBox`** (வரிசைகள் வார்ப்புருவாக்கப்பட்ட பல-வரி உருப்படிகளாக இருக்கும் ஒரு `ListBox`), **`NavigationHost`** (`BackRequested`-ஐ மதிக்கும் தலைப்புப் பட்டையும் back button-உம் கொண்ட ஒரு page stack). `docs/mobile-layout.md` பரிந்துரைக்கும் வடிவில் ஒரு settings திரை (அந்த ஆவணத்துடன் ஒப்பிட்டுச் சரிபார்க்கப்பட்டது, இந்த வழிகாட்டிக்காக இயக்கப்படவில்லை):

**C#**

```csharp
var column = new StackPanel {
    Dock = DockStyle.Fill, AutoScroll = true,
    MaximumContentWidth = 560, Spacing = 8, Padding = new Padding (8)
};
column.Controls.Add (new Label { Text = "Server address", AutoSize = true });      // column அகலத்துக்கு மடிகிறது
column.Controls.Add (new TextBox { Name = "serverBox", Height = 48, InputKind = TextInputKind.Url });

var card = new Card { Height = 120 };                                              // வட்டமானது, தீம் சார்ந்தது
card.Controls.Add (new Label { Text = "Reminders", Dock = DockStyle.Top });
column.Controls.Add (card);

var nav = new NavigationHost { Dock = DockStyle.Fill };                            // page stack + back button
Controls.Add (nav);
await nav.PushAsync (column);                                                      // ஒரு async handler-இலிருந்து
```

**VB.NET**

```vb
Dim column As New StackPanel With {
    .Dock = DockStyle.Fill, .AutoScroll = True,
    .MaximumContentWidth = 560, .Spacing = 8, .Padding = New Padding(8)
}
column.Controls.Add(New Label With {.Text = "Server address", .AutoSize = True})   ' column அகலத்துக்கு மடிகிறது
column.Controls.Add(New TextBox With {.Name = "serverBox", .Height = 48, .InputKind = TextInputKind.Url})

Dim card As New Card With {.Height = 120}                                           ' வட்டமானது, தீம் சார்ந்தது
card.Controls.Add(New Label With {.Text = "Reminders", .Dock = DockStyle.Top})
column.Controls.Add(card)

Dim nav As New NavigationHost With {.Dock = DockStyle.Fill}                         ' page stack + back button
Controls.Add(nav)
Await nav.PushAsync(column)                                                         ' ஒரு Async handler-இலிருந்து
```

(`TextInputKind` `Majorsilence.Forms.Backends`-இல் உள்ளது.) இந்தச் செய்முறையில் மீதமுள்ள அனைத்தும் நீங்கள் அறிந்த WinForms தான் — `AutoSize` labels மடிகின்றன, `FlowLayoutPanel`/`TableLayoutPanel` ஒரு card-க்குள் செல்கின்றன.

**முதிர்ச்சி கடுமையாக வேறுபடுகிறது; இது ஓர் அடிக்குறிப்பில் அல்ல, உங்கள் திட்டமிடலில் இடம்பெற வேண்டும்.** மூன்று வரிசைகளும் CI-இல் compile ஆகின்றன. **browser** முழுக் காட்சியகத்தையும் இயக்குகிறது, ஆனால் இளமையானது. **Android** ஓர் ஆரம்ப உண்மைச் சாதனச் சோதனையைக் கடந்துள்ளது: காட்சியகம் boot ஆகிறது, தட்டல்கள் சரியான கட்டுப்பாட்டைச் சென்றடைகின்றன, rendering அளவிடுதல் சரியாக உள்ளது, touch scroll மற்றும் flick வன்பொருளில் வேலை செய்கின்றன — ஆனால் மேலே உள்ள விசைப்பலகை, safe-area, சுழற்சி (rotation) நடத்தைகள் Headless-இல் unit-test செய்யப்பட்டுள்ளன, இன்னும் ஒரு சாதனத்தில் இயக்கிப் பார்க்கப்படவில்லை. **iOS** compile ஆகிறது, CI ஒரு smoke check-ஆக உண்மையான head-ஐ simulator-இல் தொடங்குகிறது, ஆனால் யாரும் இன்னும் அதை simulator-இலோ சாதனத்திலோ ஊடாடும் வகையில் இயக்கவில்லை. mobile உங்கள் roadmap-இல் இருந்தால், அதை ஒரு checkbox ஆக அல்ல, உண்மையான ஆபத்துள்ள ஒரு spike ஆகக் கருதுங்கள் — சில மாதங்களுக்கு முன் இருந்ததைவிட மிகச் சிறிய spike, ஆனாலும் ஒரு spike.

உங்களுக்குத் தேவைப்படும் workloads, ஒவ்வொன்றும் ஒருமுறை:

```
dotnet workload install wasm-tools   # browser — publish செய்யத் தேவை, build செய்ய அல்ல
dotnet workload install android
dotnet workload install ios          # macOS மட்டும்; Linux/Windows பாதை இல்லை
```

browser-க்கு, `dotnet run` ஒரு WebAssembly project-ஐ serve செய்யாது என்பதைக் கவனியுங்கள்: அதை `dotnet publish` செய்து, `wwwroot` வெளியீட்டை எந்த static file server மூலமும் serve செய்யுங்கள்.

ஒரு browser port-ஐ உடனடியாகக் கடிக்கும் ஓர் இடைவெளி: **சார்புப் பாதை (relative path) மூலம் ஏற்றப்படும் கோப்புகள் அங்கே இருப்பதில்லை.** உண்மையான கோப்பு முறைமை (filesystem) இல்லை, எனவே desktop-இல் வேலை செய்யும் படம் ஏற்றுதல் சத்தமில்லாமல் வெற்று icons-ஐத் தருகிறது ([module 0](#module-0)-இல் உள்ள அதே 1×1 placeholder நடத்தை). படங்களை embedded resources ஆக வெளியிட்டு, அதற்குப் பதிலாக assembly வழியாக வாசியுங்கள்:

**C#**

```csharp
using Majorsilence.Forms.Drawing;

public static Bitmap LoadEmbedded (string name)
{
    var assembly = typeof (MainForm).Assembly;
    using var stream = assembly.GetManifestResourceStream ($"MyApp.Images.{name}")
        ?? throw new InvalidOperationException ($"Missing embedded resource: {name}");

    return new Bitmap (stream);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing

Public Shared Function LoadEmbedded(name As String) As Bitmap
    Dim assembly = GetType(MainForm).Assembly
    Using stream = assembly.GetManifestResourceStream($"MyApp.Images.{name}")
        If stream Is Nothing Then
            Throw New InvalidOperationException($"Missing embedded resource: {name}")
        End If
        Return New Bitmap(stream)
    End Using
End Function
```

**browser-இல் அணுகல்தன்மை (accessibility) இலவசமாகக் கிடைக்கிறது — நீங்கள் உங்கள் கட்டுப்பாடுகளுக்குப் பெயரிட்டிருந்தால்.** ஒரு canvas, திரை வாசிப்பானுக்கும், browser-இன் find-in-page-க்கும், DOM அடிப்படையிலான எந்தச் சோதனைக் கருவிக்கும் ஒளிபுகாதது. எனவே browser வரிசையில் Avalonia பின்தளம் canvas-க்கு அருகில் திறந்திருக்கும் படிவங்களின் ஒரு **DOM பிரதிபிம்பத்தை (DOM mirror)** வைத்திருக்கிறது: ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒரு வெளிப்படையான, click ஊடுருவிச் செல்லும் element, அதன் ARIA role, பெயர், நிலை, எல்லைகளைக் கொண்டது; உங்கள் சோதனைகள் வாசிக்கும் அதே தானியக்க மரத்திலிருந்து ([module 8](#module-8-tree)) உருவாக்கப்பட்டு, ஒரு வரைதலுக்குப் பிறகு அதிகபட்சம் ஒவ்வொரு 100 ms-க்கும் மீண்டும் ஒத்திசைக்கப்படுகிறது. ஒரு சோதனை கண்டுபிடிக்கக்கூடிய எதையும் ஒரு திரை வாசிப்பானும் கண்டுபிடிக்க முடியும் — module 8-இன் "ஊடாடும் ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒரு `Name`" விதி உங்கள் code review சரிபார்ப்புப் பட்டியலில் இருக்க வேண்டியதற்கு இது இன்னொரு காரணம்.

### ஏற்கனவே உள்ள Avalonia, Uno, WinForms, WPF அல்லது GTK 4 பயன்பாட்டுக்குள் உட்பொதித்தல்
{:#module-6-embedding}

அந்த ஐந்து toolkits-இல் ஒன்றின் மீது நீங்கள் ஏற்கனவே ஒரு பயன்பாட்டை வெளியிட்டால், Majorsilence.Forms-ஐக் கூடுதலாக ஏற்றுக்கொள்ளலாம் — வழக்கமான `Form.Show()` ஓட்டத்தை மாற்றாமல், அதன் கட்டுப்பாடுகளையும் சாளரங்களையும் நேட்டிவ் objects போலவே பயன்படுத்தி. இந்த முறை எல்லா இடங்களிலும் ஒரே மாதிரி (ஒரு `MajorsilenceFormsPresenter` மற்றும் ஒரு ஜோடி extension methods); ஹோஸ்ட் type மட்டுமே மாறுகிறது. இங்கே Avalonia மற்றும் Uno காட்டப்பட்டுள்ளன, Windows ஜோடி [module 7](#module-7-c)-இல் உள்ளது, GTK 4-க்கு `ToGtkWidget()` / `ToGtkWindow()`:

**C#**

```csharp
// ஒரு Majorsilence கட்டுப்பாடு, நேட்டிவ் ஒன்றாக ஹோஸ்ட் செய்யப்படுகிறது
Avalonia.Controls.Control          hostControl = myMfControl.ToAvaloniaControl ();
Microsoft.UI.Xaml.FrameworkElement unoControl  = myMfControl.ToUnoControl ();

// ஒரு Majorsilence Form-இன் பின்தளச் சாளரம், ஹோஸ்டிடம் திருப்பிக் கொடுக்கப்படுகிறது
Avalonia.Controls.Window window = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window unoWin = myForm.ToUnoWindow ();

window.Show ();                    // இங்கிருந்து அதைக் காட்டுவது ஹோஸ்டின் பொறுப்பு
```

**VB.NET**

```vb
' ஒரு Majorsilence கட்டுப்பாடு, நேட்டிவ் ஒன்றாக ஹோஸ்ட் செய்யப்படுகிறது
Dim hostControl As Avalonia.Controls.Control = myMfControl.ToAvaloniaControl()
Dim unoControl As Microsoft.UI.Xaml.FrameworkElement = myMfControl.ToUnoControl()

' ஒரு Majorsilence Form-இன் பின்தளச் சாளரம், ஹோஸ்டிடம் திருப்பிக் கொடுக்கப்படுகிறது
Dim window As Avalonia.Controls.Window = myForm.ToAvaloniaWindow()
Dim unoWin As Microsoft.UI.Xaml.Window = myForm.ToUnoWindow()

window.Show()                      ' இங்கிருந்து அதைக் காட்டுவது ஹோஸ்டின் பொறுப்பு
```

**Owner/modal உறவுகள் பின்தளத்துக்குப் பின்தளம் வேறுபடுகின்றன:** `ToAvaloniaWindow()`, `ToWinFormsForm()`, `ToGtkWindow()` ஒவ்வொன்றும் உண்மையான OS-நிலை modal உறவைத் தருகின்றன; இந்தப் பின்தளத்தில் Uno-க்கு owner என்ற கருத்து இல்லை, எனவே `ToUnoWindow()` ஒரு சுயாதீனமான top-level சாளரத்தைத் திருப்பித் தருகிறது. Uno-வின் கீழ், `Form.ShowDialog(parent)`-ஐப் பயன்படுத்துங்கள் — இது framework-இன் சொந்த modal loop, நேட்டிவ் சாளர உரிமையைச் சார்ந்திருப்பதில்லை.

### நீங்களே தலைப்புப் பட்டையை வரைந்தால்
{:#module-6-chrome}

தனிப்பயன் chrome உருவாக்கும் எவருக்கும் ஒரு slide அளவுக்குத் தகுதியானது. Avalonia பின்தளத்தில், இழுத்தல் (drag) மற்றும் அளவு மாற்றுதல் ஊடாடும் begin-drag அழைப்புகள் வழியாகச் செல்கின்றன. Uno-வில் அவ்வாறு செய்ய முடியாது (WinUI-இல் நிரல்வழி begin-drag இல்லை), எனவே நகர்த்தல்/அளவு மாற்றுதல் அறிவிப்பு முறையிலானது (declarative): படிவம் தனது தலைப்புப் பட்டைப் பகுதியை ஒரு caption region ஆக வெளியிடுகிறது, ஹோஸ்ட் அதை WinUI-க்கு முன்னனுப்புகிறது. அது ஒரு Windows-desktop API, எனவே OS தலைப்புப் பட்டை இழுத்தல் Win32 head-இல் வேலை செய்கிறது; macOS நேட்டிவ் அலங்காரங்களைப் பயன்படுத்துகிறது, இழுத்தல்/அளவு மாற்றுதலை OS கையாள்கிறது; **X11 head-இல் தலைப்புப் பட்டை இழுத்தல் கிடைக்காது** — OS சாளர இழுத்தல் தேவைப்பட்டால் அங்கே system decorations-ஐப் பயன்படுத்துங்கள்.

**பயிற்சி 6.** [module 2](#module-2)-இலிருந்து `GreetForm`-ஐ எடுத்து, package reference-ஐயும், Avalonia அல்லாத பின்தளத்துக்கு அந்த ஒரு தேர்வு வரியையும் மாற்றி, இரண்டு பின்தளங்களில் இயக்குங்கள் (Linux-இல் GTK 4; எங்கும் Terminal — ஹோஸ்ட் இணைப்புக்கோட்டை *உணர* இதுவே விரைவான வழி). பிறகு அதை WebAssembly-க்கு publish செய்து ஒரு browser-இல் திறவுங்கள்: `OkButton_Click`-இல் உள்ள `MessageBox.Show` அங்கே exception எறிகிறது; அந்த handler-ஐ `ShowAsync`-க்கு மாற்றுவதுதான் ஒரே திருத்தத்தில் முழு async உரையாடல் சாளர விதியும். நீங்கள் கவனிக்கும் ஒவ்வொரு நடத்தை வேறுபாட்டையும் எழுதிவைத்து, ஒவ்வொன்றையும் மேலே உள்ள பட்டியல்களுடன் ஒப்பிடுங்கள் — அவற்றில் இல்லாத எதுவும் புகாரளிக்கத் தகுந்தது.

---

## Module 7 — Windows-இல் படிப்படியான ஏற்பு
{:#module-7}

**விளைவு:** Majorsilence.Forms-ஐயும் உண்மையான WinForms-ஐயும் ஒரே process-இல், எந்தத் திசையிலும், எந்த நுணுக்க அளவிலும் — முழுப் படிவங்கள் அல்லது தனிக் கட்டுப்பாடுகள் — உங்களால் இயக்க முடியும்; அதை நிலையாக வைத்திருக்கும் மூன்று விதிகளையும் அறிந்திருப்பீர்கள்.

இதற்கு Windows-க்கு மட்டுமான இரண்டு கருவிகள் உள்ளன, அவை வெவ்வேறு அடுக்குகளில் செயல்படுகின்றன:

| | `Majorsilence.Forms.WindowsFormsInterop` (திசைகள் A மற்றும் B) | `Majorsilence.Forms.WinForms` பின்தளம் (திசை C) |
|---|---|---|
| நுணுக்க அளவு | முழுப் படிவங்களும் உரையாடல் சாளரங்களும் | தனித்தனிக் கட்டுப்பாடுகள் (மற்றும் படிவங்கள்) |
| Majorsilence இயங்குவது | Avalonia பின்தளத்தில், WinForms-உடன் Win32 pump-ஐப் பகிர்ந்துகொண்டு | உண்மையான WinForms சாளரங்களில் — Avalonia சம்பந்தப்படுவதில்லை |
| மிகப் பொருத்தமானது | ஒரு Majorsilence பயன்பாட்டிலிருந்து பழைய WinForms படிவங்களைத் திறப்பது, அதன் மறுதலையும் | WinForms UI-க்குள் Majorsilence கட்டுப்பாடுகளை உட்பொதிப்பது; தனது உள்ளமைப்புகளை முதலில் port செய்யும் ஒரு கட்டுப்பாட்டு library; .NET Framework 4.8 ஹோஸ்ட்கள் |

அவை ஒன்றாக இருக்க முடியும் — திசை C-இல் உள்ள presenter ஏற்கனவே அமைக்கப்பட்ட பின்தளத்தைத் தொடாமல் விட்டுவிடுகிறது.

`Majorsilence.Forms.WindowsFormsInterop` என்பது **Windows-க்கு மட்டுமான** ஒரு பாலம் (bridge). Windows அல்லாத இடங்களில் அந்த assembly ஒரு வெற்று placeholder (எனவே பல்தள builds பச்சையாகவே இருக்கும்), ஒவ்வொரு அழைப்பும் `PlatformNotSupportedException`-ஐ எறிகிறது.

**இது ஏன் வேலை செய்கிறது:** Windows-இல், Avalonia பின்தளம் தனது சொந்த loop-ஐ இயக்குவதற்குப் பதிலாகத் தனது சாளரங்களை OS message pump-இல் பதிவு செய்கிறது; `System.Windows.Forms`-உம் அதே pump-ஐப் பயன்படுத்துகிறது. எனவே இரண்டு toolkits-உம் அழைக்கப்படும் `Application.Run` எதுவாக இருந்தாலும் அதைப் பகிர்ந்துகொள்கின்றன — ஒரே loop இரண்டுக்கும் சேவை செய்கிறது.

### திசை A — பழைய WinForms படிவத்தைத் திறக்கும் ஒரு Majorsilence.Forms பயன்பாடு
{:#module-7-a}

பயன்பாடு இடம்பெயர்ந்துவிட்டது, ஆனால் சில உரையாடல் சாளரங்கள் இன்னும் இடம்பெயரவில்லை என்ற நிலைக்கு.

**C#**

```csharp
using Majorsilence.Forms.Interop;

// Modeless — உடனடியாகத் திரும்புகிறது
WindowsFormsInterop.Show (new LegacySettingsForm (), owner: this);

// Modal — WinForms உரையாடல் சாளரம் மூடப்படும் வரை தடுக்கிறது
var result = WindowsFormsInterop.ShowDialog (new LegacyWizardForm (), owner: this);
if (result == System.Windows.Forms.DialogResult.OK) {
    // …
}

// Factory overload — காட்டும் நேரத்தில் UI thread-இல் படிவத்தை உருவாக்குகிறது
WindowsFormsInterop.Show (() => new LegacySettingsForm ());
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Interop

' Modeless — உடனடியாகத் திரும்புகிறது
WindowsFormsInterop.Show(New LegacySettingsForm(), owner:=Me)

' Modal — WinForms உரையாடல் சாளரம் மூடப்படும் வரை தடுக்கிறது
Dim result = WindowsFormsInterop.ShowDialog(New LegacyWizardForm(), owner:=Me)
If result = System.Windows.Forms.DialogResult.OK Then
    ' …
End If

' Factory overload — காட்டும் நேரத்தில் UI thread-இல் படிவத்தை உருவாக்குகிறது
WindowsFormsInterop.Show(Function() New LegacySettingsForm())
```

WinForms உரையாடல் சாளரம் Majorsilence parent-க்கு உண்மையாகவே உரிமைப்பட்டதாக (அதற்கு modal ஆக) இருக்க, தொடக்கத்தில் handle resolver-ஐ **ஒருமுறை** இணையுங்கள் — நீங்கள் அதைச் செய்யும் வரை, WinForms படிவங்கள் owner இல்லாமலேயே காட்டப்படும்:

**C#**

```csharp
WindowsFormsInterop.OwnerHandleResolver = mfForm =>
{
    var host = mfForm.Backend as Majorsilence.Forms.Backends.MajorsilenceFormsWindowHost;
    return host?.TryGetPlatformHandle ()?.Handle ?? IntPtr.Zero;
};
```

**VB.NET**

```vb
WindowsFormsInterop.OwnerHandleResolver =
    Function(mfForm)
        Dim host = TryCast(mfForm.Backend,
                           Majorsilence.Forms.Backends.MajorsilenceFormsWindowHost)
        If host Is Nothing Then Return IntPtr.Zero
        Return If(host.TryGetPlatformHandle()?.Handle, IntPtr.Zero)
    End Function
```

### திசை B — Majorsilence.Forms திரைகளைத் திறக்கும் ஒரு WinForms பயன்பாடு
{:#module-7-b}

எதற்கும் உறுதியளிப்பதற்கு முன் framework-ஐச் சரிபார்க்கும் குறைந்த ஆபத்துள்ள வழி இது: நீங்கள் ஏற்கனவே வெளியிடும் பயன்பாட்டுக்குள் *புதிய* திரைகளை Majorsilence.Forms மீது உருவாக்குங்கள்.

**C#**

```csharp
[STAThread]
static void Main ()
{
    System.Windows.Forms.Application.EnableVisualStyles ();
    System.Windows.Forms.Application.SetCompatibleTextRenderingDefault (false);
    System.Windows.Forms.Application.SetHighDpiMode (HighDpiMode.PerMonitorV2);

    WindowsFormsInterop.InitializeMajorsilence ();   // ஒருமுறை, முதல் MF சாளரத்துக்கு முன்
    System.Windows.Forms.Application.Run (new MainForm ());
}
```

```csharp
using MF = Majorsilence.Forms;

WindowsFormsInterop.ShowMajorsilenceForm (new NewSettingsForm (), owner: this);

MF.DialogResult r = WindowsFormsInterop.ShowMajorsilenceDialog (new NewWizardForm (), owner: this);
if (r == MF.DialogResult.OK) {
    // …
}
```

**VB.NET**

```vb
Module Program
    <STAThread>
    Sub Main()
        System.Windows.Forms.Application.EnableVisualStyles()
        System.Windows.Forms.Application.SetCompatibleTextRenderingDefault(False)
        System.Windows.Forms.Application.SetHighDpiMode(HighDpiMode.PerMonitorV2)

        WindowsFormsInterop.InitializeMajorsilence()   ' ஒருமுறை, முதல் MF சாளரத்துக்கு முன்
        System.Windows.Forms.Application.Run(New MainForm())
    End Sub
End Module
```

```vb
Imports MF = Majorsilence.Forms

WindowsFormsInterop.ShowMajorsilenceForm(New NewSettingsForm(), owner:=Me)

Dim r As MF.DialogResult =
    WindowsFormsInterop.ShowMajorsilenceDialog(New NewWizardForm(), owner:=Me)
If r = MF.DialogResult.OK Then
    ' …
End If
```

அது `DialogResult.None` (அதாவது "வெளிப்படையான முடிவு இல்லாமல் மூடப்பட்டது", எ.கா. தலைப்புப் பட்டையின் ✕) அல்லாத எதையாவது திருப்பித் தர, Majorsilence படிவத்தில் `Close()`-க்கு முன் `DialogResult`-ஐ அமையுங்கள்:

**C#**

```csharp
okButton.Click += (sender, e) => {
    DialogResult = Majorsilence.Forms.DialogResult.OK;
    Close ();
};
```

**VB.NET**

```vb
AddHandler okButton.Click,
    Sub(sender As Object, e As EventArgs)
        DialogResult = Majorsilence.Forms.DialogResult.OK
        Close()
    End Sub
```

### திசை C — ஒரு நேரத்தில் ஒரு கட்டுப்பாடு, WinForms (அல்லது WPF) பின்தளத்தில்
{:#module-7-c}

திசைகள் A மற்றும் B முழுத் திரைகளை நகர்த்துகின்றன. நீங்கள் நகர்த்தக்கூடிய அலகு *ஒரு கட்டுப்பாடு* ஆக இருக்கும்போது — ஒரு தனிப்பயன் grid, ஒரு chart, நெரிசலான படிவத்தின் ஒரு panel — அதற்குப் பதிலாக `Majorsilence.Forms.WinForms`-ஐக் குறிப்பிடுங்கள். இது ஒரு முழுமையான தளப் பின்தளம் ([module 6](#module-6)); இதன் சாளரங்கள் பாரம்பரிய Win32 pump மீதான உண்மையான `System.Windows.Forms` படிவங்கள், Skia மேற்பரப்பு GDI-ஆதரவுள்ள ஒரு கட்டுப்பாட்டின் வழியாகக் காட்சிப்படுத்தப்படுகிறது. ஒரு WinForms container-க்குள் இடப்படும் Majorsilence கட்டுப்பாடு ஒரு சாதாரண `System.Windows.Forms.Control` ஆகிறது; முதல் முறை ஒரு presenter உருவாக்கப்படும்போது பின்தளம் தானாகவே நிறுவிக்கொள்கிறது, பயன்பாட்டின் ஏற்கனவே உள்ள `Application.Run` அனைத்துக்கும் சேவை செய்கிறது. (package README மற்றும் `samples/EmbeddingWinForms`-உடன் ஒப்பிட்டுச் சரிபார்க்கப்பட்டது, இந்த வழிகாட்டிக்காக இயக்கப்படவில்லை.)

**C#**

```csharp
using Majorsilence.Forms.WinForms;

// Namespace-ஐ முழுமையாகக் குறிப்பிடுங்கள்: இந்தக் கோப்பில் System.Windows.Forms, Majorsilence.Forms இரண்டும் scope-இல் உள்ளன.
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });

System.Windows.Forms.Control host = scene.ToWinFormsControl ();   // அல்லது: new MajorsilenceFormsPresenter { Content = scene }
legacyForm.Controls.Add (host);

// WinForms-க்கு உரிமைப்பட்ட ஒரு முழு Majorsilence Form — உண்மையான நேட்டிவ்-modal உறவு:
var dialog = new Majorsilence.Forms.Form { Text = "Ported dialog" };
System.Windows.Forms.Form native = dialog.ToWinFormsForm ();
native.ShowDialog (legacyForm);
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WinForms

' Namespace-ஐ முழுமையாகக் குறிப்பிடுங்கள்: இந்தக் கோப்பில் System.Windows.Forms, Majorsilence.Forms இரண்டும் scope-இல் உள்ளன.
Dim scene As New Majorsilence.Forms.Panel()
scene.Controls.Add(New Majorsilence.Forms.Button With {.Text = "Ported button", .Left = 12, .Top = 12})

Dim host As System.Windows.Forms.Control = scene.ToWinFormsControl()   ' அல்லது: New MajorsilenceFormsPresenter With {.Content = scene}
legacyForm.Controls.Add(host)

' WinForms-க்கு உரிமைப்பட்ட ஒரு முழு Majorsilence Form — உண்மையான நேட்டிவ்-modal உறவு:
Dim dialog As New Majorsilence.Forms.Form With {.Text = "Ported dialog"}
Dim native As System.Windows.Forms.Form = dialog.ToWinFormsForm()
native.ShowDialog(legacyForm)
```

இந்த வழியின் மூன்று பண்புகள் திட்டமிடலுக்கு முக்கியமானவை:

- **இது `net48`-ஐ இலக்காகக் கொள்கிறது.** மையத்தின் `netstandard2.0` build-உடன் சேர்ந்து, ஒரு **.NET Framework 4.8** பயன்பாடு நவீன .NET-க்கு முதலில் மாறாமலேயே Majorsilence கட்டுப்பாடுகளை ஹோஸ்ட் செய்ய முடியும். இது பல இடம்பெயர்த்தல் திட்டங்களின் வரிசையை மாற்றுகிறது: UI port-உம் runtime மேம்படுத்தலும் இனி ஒரே project ஆக இருக்க வேண்டியதில்லை.
- **இது இரு திசைகளிலும் வேலை செய்கிறது.** `NativeControlHost` ([module 9](#module-9-route-a)) உட்பொதிக்கப்பட்ட Majorsilence காட்சிக்குள் ஓர் *உண்மையான* WinForms கட்டுப்பாட்டை ஹோஸ்ட் செய்கிறது, பின்தளம் `PlatformHandle` வழியாக உண்மையான `HWND`-ஐத் திருப்பித் தருகிறது. உட்பொதிக்கப்பட்ட உள்ளடக்கம் திறக்கும் popups (dropdowns, menus) உண்மையான எல்லையற்ற OS சாளரங்கள்.
- **கடைசிக் கட்டுப்பாடு port செய்யப்பட்டதும், package-ஐ** `Majorsilence.Forms.Avalonia`-க்கு **மாற்றுங்கள்**; அதே குறியீடு பல்தளமாகிவிடும். பின்தள இணைப்புக்கோட்டுக்கு (seam) மேலே எதுவும் மாறாது.

இல்லாதவை: gestures (WinForms-இல் gesture API இல்லை — touch, mouse ஆக வருகிறது) மற்றும் ஒரு webview (WebView-ஐச் சார்ந்த இணக்கக் கட்டுப்பாடுகள், Headless-இல் போலவே, மாற்று வழிக்குத் திரும்புகின்றன). `Majorsilence.Forms.Wpf` என்பது WPF shell-க்கான அதே யோசனை — `ToWpfElement()` மற்றும் `ToWpfWindow()`, `net48`/`net8.0-windows`/`net10.0-windows`, `Platform.Backend = new WpfPlatformBackend ()` மூலம் தேர்ந்தெடுக்கப்படுகிறது.

**இரண்டு பாதிகளையும் ஒரே பயன்பாடு போலத் தோன்றச் செய்தல்.** கலப்பு-toolkit பயன்பாட்டைக் காட்டிக்கொடுப்பது ஒரே திரையில் இரண்டு காட்சிப் பாணிகள். `Majorsilence.Forms.Theming.WinForms` *அதே* CSS தீமை ([appendix D](#appendix-d)) உண்மையான `System.Windows.Forms` கட்டுப்பாடுகளுக்கு, WinForms அனுமதிக்கும் அளவுக்குப் பயன்படுத்துகிறது; ஒவ்வொரு இடைவெளியும் சத்தமில்லாமல் தவிர்க்கப்படாமல் ஒரு diagnostic ஆகப் புகாரளிக்கப்படுகிறது:

**C#**

```csharp
using Majorsilence.Forms.Theming.WinForms;

Theme.LoadFromCssFile ("Themes/graphite.css");                     // Majorsilence பாதி
WinFormsCssTheme.Apply (File.ReadAllText ("Themes/graphite.css")); // WinForms பாதி
WinFormsCssTheme.Track (legacyForm);                               // இப்போதே பாணியிடு, பின்னர் சேர்க்கப்படும் கட்டுப்பாடுகளையும்
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Theming.WinForms

Theme.LoadFromCssFile("Themes/graphite.css")                        ' Majorsilence பாதி
WinFormsCssTheme.Apply(File.ReadAllText("Themes/graphite.css"))     ' WinForms பாதி
WinFormsCssTheme.Track(legacyForm)                                  ' இப்போதே பாணியிடு, பின்னர் சேர்க்கப்படும் கட்டுப்பாடுகளையும்
```

(`WinFormsCssTheme.Watch (path)` ஒவ்வொரு save-இலும் மீண்டும் பயன்படுத்துகிறது; Windows-க்கு மட்டுமான `ThemeStudio.WinForms` மாதிரி இப்படித்தான் வேலை செய்கிறது.)

### மூன்று விதிகள்
{:#module-7-rules}

1. **ஒரு process-க்கு ஒரு `Application.Run`.** `Majorsilence.Forms.Application.Run`, `System.Windows.Forms.Application.Run` இரண்டையும் ஒருபோதும் அழைக்காதீர்கள். ஒரு ஹோஸ்டைத் தேர்ந்தெடுங்கள்; மறு திசைக்குப் பாலத்தைப் பயன்படுத்துங்கள்.
2. **UI (STA) thread மட்டும்** — சரியாக WinForms போலவே. ஒரு background thread-இலிருந்து, திரும்பக் கடந்து வாருங்கள்:

   **C#**

   ```csharp
   await Task.Run (() => {
       var data = LoadFromDatabase ();
       Majorsilence.Forms.Application.RunOnUIThread (() => grid.DataSource = data);
   });
   ```

   **VB.NET**

   ```vb
   Await Task.Run(
       Sub()
           Dim data = LoadFromDatabase()
           Majorsilence.Forms.Application.RunOnUIThread(Sub() grid.DataSource = data)
       End Sub)
   ```

3. **Win32 parenting சமச்சீரற்றது.** MF → WF parenting மேலே உள்ள handle resolver வழியாக வேலை செய்கிறது; WF → MF திசையில் MF சாளரம் தற்போது OS நிலையில் owner இல்லாதது.

**பயிற்சி 7.** ஏற்கனவே உள்ள ஒரு WinForms பயன்பாட்டின் சோதனை நகலில், owner handle இணைக்கப்பட்ட நிலையில், திசை B வழியாக Majorsilence.Forms மீது உருவாக்கப்பட்ட ஒரு புதிய திரையைச் சேருங்கள். பிறகு அதே பயன்பாட்டில், ஏற்கனவே உள்ள ஒரு கட்டுப்பாட்டைத் திசை C வழியாக ஒரு Majorsilence கட்டுப்பாட்டால் மாற்றுங்கள். இரண்டும் சேர்ந்து, பங்குதாரர்களின் (stakeholders) தடையை நீக்கும் demo ஆகின்றன, ஏனெனில் நீங்கள் ஏற்கனவே வெளியிடுவதில் அவை எதையும் மாற்றுவதில்லை.

---

## Module 8 — உங்கள் பயன்பாட்டைச் சோதித்தல்
{:#module-8}

**விளைவு:** உங்கள் குழு, உடையாத locators-ஐப் பயன்படுத்தி, திரை (display) இல்லாமல் CI-இல் இயங்கும் UI சோதனைகளை எழுதுகிறது — எந்த அணுகல்தன்மை (accessibility) இலவசமாகக் கிடைக்கிறது என்பதையும் அறிந்திருக்கிறது.

> இந்த module ஒரு மேலோட்டம். [**Automation & UI சோதனை**]({{ '/ta/automation/' | relative_url }}) என்பது
> நடைமுறையாளரின் பதிப்பு: page objects, ஒரு wait helper (implicit waits இல்லை), உண்மையான Selenium-இலிருந்து
> பயன்பாட்டை இயக்குதல், Windows-இல் FlaUI/WinAppDriver, golden-image regression, GitHub Actions,
> Azure DevOps மற்றும் Jenkins-க்கான CI செய்முறைகள், AI agents அதே மேற்பரப்பில் எவ்வாறு இணைகின்றன என்பவை.

### ஒரு தானியக்க மரம், மூன்று பயன்பாட்டாளர்கள்
{:#module-8-tree}

framework ஒரு பின்தளச் சார்பற்ற **தானியக்க மரத்தை (automation tree)** வெளிப்படுத்துகிறது: ids, பெயர்கள், roles, மதிப்புகள், நிலை, எல்லைகள் ஆகியவற்றுடன் உங்கள் நேரடிக் கட்டுப்பாட்டுப் படிநிலையின் ஒரு snapshot.

| பயன்படுத்துபவர் | Package | உங்களுக்குத் தருவது |
|---|---|---|
| In-process UI சோதனைகள் | `Majorsilence.Forms.Automation` (மைய package-இல்) | பிக்சல் கணக்கீடு இல்லாமல் C#/VB-இலிருந்து ஒரு படிவத்தை இயக்குதல் |
| தொலை (remote) automation | `Majorsilence.Forms.WebDriver` | எந்த Selenium client-உம் இயக்கக்கூடிய ஒரு W3C WebDriver server |
| திரை வாசிப்பான்களும் உருப்பெருக்கிகளும் | `Majorsilence.Forms.WindowsUIAutomation` | Windows-இல் Narrator / NVDA / JAWS |

renderers பயன்படுத்தும் அதே தருக்க எல்லைகளையும் நிலையையும் மரம் வாசிக்கிறது, எனவே headless மற்றும் உண்மையான பின்தளங்களில் அது ஒரே மாதிரி நடந்துகொள்கிறது — **Headless-க்கு எதிராக எழுதப்பட்ட ஒரு சோதனை, Avalonia-வில் ஒரு பயனர் காண்பதை விவரிக்கிறது.**

### கட்டுப்பாடுகளைக் கண்டுபிடிக்கக்கூடியவையாக்குங்கள் — முதல் நாளிலேயே ஏற்கப்படும் குழு வழக்கம்
{:#module-8-findable}

Locators நீங்கள் ஏற்கனவே அமைக்கும் இரண்டு properties-ஐ அடிப்படையாகக் கொள்கின்றன:

- `Control.Name` → element-இன் **AutomationId**. நிலையான locator. எப்போதும் இதையே முன்னுரிமைப்படுத்துங்கள்.
- `Control.AccessibleName` (இல்லையெனில் `Text`, பிறகு `Name`) → element-இன் **Name**.

**C#**

```csharp
var okButton = new Button  { Name = "okButton", Text = "OK" };
var nameBox  = new TextBox { Name = "nameBox",  AccessibleName = "Full name" };
```

**VB.NET**

```vb
Dim okButton As New Button With {.Name = "okButton", .Text = "OK"}
Dim nameBox As New TextBox With {.Name = "nameBox", .AccessibleName = "Full name"}
```

நீங்கள் `Control.AccessibleRole`-ஐ அமைக்காவிட்டால், roles கட்டுப்பாட்டு type-இலிருந்து ஊகிக்கப்படுகின்றன (`button`, `textbox`, `checkbox`, `radio`, `combobox`, `list`, `label`, `tablist`, `window`, …). "ஊடாடும் ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒரு `Name`" என்பதை ஒரு code-review விதியாக்குங்கள் — அதே keystroke-இலிருந்து சோதனை locators-ஐயும் *அத்துடன்* திரை வாசிப்பான் ஆதரவையும் அது பெற்றுத் தருகிறது; Windows-இல் UI Automation வழியாகவும், browser-இல் [ARIA DOM பிரதிபிம்பம்](#module-6-singleview) வழியாகவும்.

### தனிப்பயனாக வரையப்படும் கட்டுப்பாடுகள்: உங்கள் சொந்த மதிப்பையும் நிலையையும் வெளியிடுங்கள்
{:#module-8-stateprovider}

உள்ளமைந்த கட்டுப்பாடுகளுக்குத் தங்கள் மதிப்பை எப்படிப் புகாரளிப்பது என்று தெரியும் — ஒரு `TextBox` தன் உரையை, ஒரு `CheckBox` `"true"`-ஐ. நீங்களே வரையும் ஒரு கட்டுப்பாட்டுக்கு ([module 4](#module-4-paint)) ஊகிக்க எதுவும் இல்லை, எனவே அது மரத்தில் வெற்று மதிப்புடனும், அதன் type பெயரிலிருந்து ஊகிக்கப்பட்ட role-உடனும் தோன்றுகிறது. `AccessibleRole` மற்றும் `AccessibleName` ஏற்கனவே role-ஐயும் பெயரையும் சரிசெய்கின்றன. மதிப்புக்கும் கூடுதல் நிலைக்கும், `IAutomationStateProvider`-ஐ implement செய்யுங்கள் — அப்போது மரம் ஊகிப்பதற்குப் பதிலாக நீங்கள் புகாரளிப்பதைப் பயன்படுத்துகிறது; ஒவ்வொரு நிலை உள்ளீடும் தனியாக query செய்யக்கூடிய ஒரு `state-{key}` attribute ஆகிறது. (`docs/automation.md`-இலிருந்து; இந்த வழிகாட்டிக்காக இயக்கப்படவில்லை.)

**C#**

```csharp
using System.Collections.Generic;
using System.Globalization;
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;

public sealed class BeaconIndicator : Control, IAutomationStateProvider
{
    public int Level { get; set; }
    public string Status { get; set; } = "warning";

    public string? AutomationValue => Level.ToString (CultureInfo.InvariantCulture);

    public IReadOnlyDictionary<string, string> AutomationState => new Dictionary<string, string> {
        ["level"]  = Level.ToString (CultureInfo.InvariantCulture),
        ["status"] = Status,
    };

    protected override void OnPaint (PaintEventArgs e) { /* beacon-ஐ வரையுங்கள் */ }
}

// ஒரு சோதனையில் — நிலையை XPath மூலம் அணுகலாம்:
session.Find (By.XPath ("//BeaconIndicator[@state-level='3']"));
```

**VB.NET**

```vb
Imports System.Globalization
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation

Public NotInheritable Class BeaconIndicator
    Inherits Control
    Implements IAutomationStateProvider

    Public Property Level As Integer
    Public Property Status As String = "warning"

    Public ReadOnly Property AutomationValue As String Implements IAutomationStateProvider.AutomationValue
        Get
            Return Level.ToString(CultureInfo.InvariantCulture)
        End Get
    End Property

    Public ReadOnly Property AutomationState As IReadOnlyDictionary(Of String, String) _
            Implements IAutomationStateProvider.AutomationState
        Get
            Return New Dictionary(Of String, String) From {
                {"level", Level.ToString(CultureInfo.InvariantCulture)},
                {"status", Status}
            }
        End Get
    End Property

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        ' beacon-ஐ வரையுங்கள்
    End Sub
End Class

' ஒரு சோதனையில் — நிலையை XPath மூலம் அணுகலாம்:
session.Find(By.XPath("//BeaconIndicator[@state-level='3']"))
```

அதில் `Name`, `AccessibleName`, `AccessibleRole` ஆகியவற்றையும் அமைத்தால், element நான்கையும் `GetPageSource()`-இல் கொண்டிருக்கும் — மேலும் WebDriver வழியாக, `getAttribute("state-level")` அதே விஷயத்தை வாசிக்கிறது. நிலை keys-ஐ எழுத்துகள், இலக்கங்கள், `-`, `_` ஆகியவற்றுக்குள் வைத்திருங்கள். அறிய வேண்டிய ஒரு விதி: `AutomationValue` உள்ளமைந்த ஊகத்துடன் கலப்பதில்லை, அதை *மாற்றீடு* செய்கிறது; எனவே checkbox போன்ற ஒரு தனிப்பயன் கட்டுப்பாடு `"true"`/`"false"`-ஐத் தானே புகாரளிக்க வேண்டும்.

### Headless பின்தளமே உங்கள் CI வழி
{:#module-8-headless}

`Majorsilence.Forms.Headless`-க்குத் திரை தேவையில்லை. முழுச் சோதனை assembly-க்கும் ஒருமுறை அதை நிறுவுங்கள், பிறகு ஒவ்வொரு சோதனையும் அதைப் பெறும்.

**C# — ஒரு module initializer தான் மிக நேர்த்தியான hook**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Headless;

internal static class TestBootstrap
{
    [ModuleInitializer]
    internal static void Init () => HeadlessRenderer.Use ();
}
```

**VB.NET — VB-இல் module initializer இல்லை, எனவே உங்கள் சோதனை framework-இன் assembly hook-ஐப் பயன்படுத்துங்கள்**

```vb
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBootstrap
    ' MSTest: <AssemblyInitialize>. NUnit-இல் இதற்கு இணையானது <OneTimeSetUp> உடன் ஒரு <SetUpFixture>;
    ' xUnit-இல் ஒரு collection/assembly fixture. VB <ModuleInitializer>-ஐப் பயன்படுத்த முடியாது — VB
    ' compiler module initializers-ஐ உருவாக்குவதில்லை, எனவே அந்த attribute மட்டும் எதுவும் செய்யாது.
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        HeadlessRenderer.Use()
    End Sub
End Class
```

இது ஓர் உண்மையான மொழி வேறுபாடு, பாணி விருப்பம் அல்ல: C# முறையை VB-க்குள் நகலெடுத்தால், உங்கள் சோதனைகள் எந்தப் பின்தளமும் இல்லாமல் இயங்கி, குழப்பமான வழிகளில் தோல்வியடையும்.

மேலும் "இதுதான் உண்மையானது" என்பதற்காக UI சோதனைகளை Avalonia பின்தளத்தில் இயக்கத் தூண்டப்படாதீர்கள்: Avalonia-வின் dispatcher thread-உடன் கட்டுண்டது, ஒரு test runner-இன் worker threads-உடன் முரண்படுகிறது. உங்கள் சோதனைத் தொகுப்புக்குத் திரையோ UI thread-ஓ தேவைப்படாமல் இருப்பதற்காகவே Headless உள்ளது — framework-இன் சொந்தச் சோதனைத் தொகுப்பு அதன் மீதுதான் இயங்குகிறது; `HeadlessRenderer.Use ()` என்பது `HeadlessPlatformBackend`-ஐ நீங்களே assign செய்வதற்குச் சமம்.

### ஒரு முழுமையான UI சோதனை
{:#module-8-inprocess}

`By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` ஆகியவை elements-ஐக் கண்டுபிடிக்கின்றன; `Find`, `FindOrThrow`, `FindAll` ஒவ்வொன்றும் ஒரு **புதிய snapshot**-ஐ query செய்கின்றன. செயல்கள் (`Click`, `SendKeys`, `PressKey`, `Clear`) ஓர் உண்மையான பின்தளம் பயன்படுத்தும் அதே நடுநிலை input pipeline வழியாகச் செல்கின்றன; எனவே அவை உண்மையான routing, focus, layout ஆகியவற்றைச் சோதிக்கின்றன — சோதனைக்கு மட்டுமான குறுக்குவழியை அல்ல.

**C#**

```csharp
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;
using Xunit;

public class GreetFormTests
{
    [Fact]
    public void Entering_a_name_and_pressing_OK_accepts_the_dialog ()
    {
        using var form = new GreetForm ();
        var session = new AutomationSession (form);

        session.SendKeys (session.FindOrThrow (By.Id ("nameBox")), "Ada Lovelace");
        Assert.Equal ("Ada Lovelace", session.GetText (session.FindOrThrow (By.Id ("nameBox"))));

        session.Click (session.FindOrThrow (By.Id ("okButton")));
        Assert.Equal (DialogResult.OK, form.DialogResult);
    }

    [Fact]
    public void The_form_still_renders_at_the_expected_size ()
    {
        using var form = new GreetForm ();

        // Golden-image சோதனை: திரைக்கு வெளியே வரைந்து, commit செய்யப்பட்ட ஒரு PNG-உடன் ஒப்பிடுங்கள்.
        var png = HeadlessRenderer.CapturePng (form, 360, 140);

        Assert.NotEmpty (png);
        // File.WriteAllBytes ("greetform.expected.png", png);   // வேண்டுமென்றே மட்டும் மீண்டும் உருவாக்குங்கள்
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class GreetFormTests

    <TestMethod>
    Public Sub Entering_a_name_and_pressing_OK_accepts_the_dialog()
        Using form As New GreetForm()
            Dim session As New AutomationSession(form)

            session.SendKeys(session.FindOrThrow(By.Id("nameBox")), "Ada Lovelace")
            Assert.AreEqual("Ada Lovelace",
                            session.GetText(session.FindOrThrow(By.Id("nameBox"))))

            session.Click(session.FindOrThrow(By.Id("okButton")))
            Assert.AreEqual(DialogResult.OK, form.DialogResult)
        End Using
    End Sub

    <TestMethod>
    Public Sub The_form_still_renders_at_the_expected_size()
        Using form As New GreetForm()
            ' Golden-image சோதனை: திரைக்கு வெளியே வரைந்து, commit செய்யப்பட்ட ஒரு PNG-உடன் ஒப்பிடுங்கள்.
            Dim png = HeadlessRenderer.CapturePng(form, 360, 140)
            Assert.IsTrue(png.Length > 0)
        End Using
    End Sub
End Class
```

`By.XPath` மரத்தின் XML வடிவத்துக்கு எதிராக மதிப்பிடப்படுகிறது — `session.GetPageSource()` திருப்பித் தரும் அதே வடிவம்; அடிப்படையாகக் கொள்ள நிலையான id இல்லாதபோது பயனுள்ளது:

**C#**

```csharp
session.Find    (By.XPath ("//Button[@id='okButton']"));
session.Find    (By.XPath ("//TextBox[@name='Full name']"));
session.FindAll (By.XPath ("//Panel//Button"));
```

**VB.NET**

```vb
session.Find(By.XPath("//Button[@id='okButton']"))
session.Find(By.XPath("//TextBox[@name='Full name']"))
session.FindAll(By.XPath("//Panel//Button"))
```

**HiDPI-இல் சோதித்தல்.** `MF_HEADLESS_SCALE=2` headless பின்தளத்தை அளவிடப்பட்ட (scaled) ஒரு திரையைப் புகாரளிக்கச் செய்கிறது; அளவிடப்பட்ட monitor இல்லாமல் 2×-இல் layout-ஐச் சோதிப்பது இப்படித்தான். framework-இன் சொந்தச் சோதனைத் தொகுப்பு அந்த அளவில் வெற்றி பெறுகிறது, CI அதைக் கட்டாயச் சோதனையாக (gate) வைத்திருக்கிறது; எனவே இது உடைந்ததாக அறியப்பட்ட ஒரு மூலை அல்ல, ஆதரிக்கப்படும் ஒரு செயல்.

ஆனால் அந்தத் தோல்விகள் எப்படிச் சரிசெய்யப்பட்டன என்பதிலிருந்து பாடம் கற்றுக்கொள்ளுங்கள், ஏனெனில் உங்கள் குறியீட்டிலும் அதே பொறி உள்ளது: அவற்றில் ஏறக்குறைய அனைத்தும் **ஒரே குழப்பம் — தருக்க அலகுகள் எதிர் சாதன அலகுகள்.** 2026-10-01 முதல், ஒரு `Control`-இலிருந்து நீங்கள் வாசிக்கும் அனைத்தும் — `Bounds`, `ClientRectangle`, `ClientSize`, `MouseEventArgs`, paint canvas — தருக்க அலகுகளில் உள்ளன ([module 4](#module-4-paint)); இது அந்தப் பொறியின் மோசமான பகுதியை நீக்கியது. *இன்னும்* சாதனப் பிக்சல்களில் இருப்பவை: பிடிக்கப்பட்ட (captured) bitmaps (அளவு 2-இல் `HeadlessRenderer.CapturePng` ஒவ்வொரு திசையிலும் இரு மடங்கு அளவு), நீங்கள் பெயரால் கேட்ட `Scaled*` குடும்பம், owner-draw நிகழ்வுகளின் `Bounds`. அளவு 1-இல் அவை ஒரே மாதிரியானவை, எனவே அளவிடப்பட்ட திரை வரும் வரை அவற்றைக் கலப்பது கண்ணுக்குத் தெரியாது. ஆகவே: **வடிவியலை அளவு-1 பிக்சல்களில் அல்ல, விகிதாசாரமாக assert செய்யுங்கள்**; பிடிக்கப்பட்ட bitmap-ஐ ஒரு செவ்வகத்துடன் ஒப்பிடும்போது, ஒவ்வொன்றும் எந்த வெளியில் (space) உள்ளது என்று சரிபாருங்கள். இன்னும் `ScaleTransform (e.Scaling, …)`-ஐ அழைக்கும் தனிப்பயன் கட்டுப்பாடுதான் இன்று இந்த gate-இல் தோல்வியடையும் மிகப் பொதுவான வழி.

### Selenium மூலம் தொலை automation
{:#module-8-webdriver}

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

var server = new WebDriverServer (form, port: 4444);
server.Start ();          // http://127.0.0.1:4444/  (loopback மட்டும்)
// … எந்த WebDriver client மூலமும் இதை இயக்குங்கள் …
server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Dim server As New WebDriverServer(form, port:=4444)
server.Start()            ' http://127.0.0.1:4444/  (loopback மட்டும்)
' … எந்த WebDriver client மூலமும் இதை இயக்குங்கள் …
server.Stop()
```

WebDriver என்பது வெறும் HTTP மற்றும் JSON என்பதால், எந்த மொழியிலும் உள்ள எந்த client-உம் வேலை செய்யும்:

**C#**

```csharp
driver.FindElement (By.CssSelector ("#okButton")).Click ();
driver.FindElement (By.Name ("nameBox")).SendKeys ("Ada Lovelace");
```

**VB.NET**

```vb
driver.FindElement(By.CssSelector("#okButton")).Click()
driver.FindElement(By.Name("nameBox")).SendKeys("Ada Lovelace")
```

ஆதரிக்கப்படுபவை: new/delete session, find element(s), click, send keys, clear, get text, get name (role), get attribute, get rect, get enabled, **page source** (XML), screenshot (PNG), `GET /status`. Locators: `id`, `name`, `tag name` (role), `xpath`, `css selector` (`#id` மற்றும் `[name='…']`), அத்துடன் தனிப்பயன் `role`, `type`, `link text`. Element references ஒவ்வொரு பயன்பாட்டிலும் ஒரு புதிய snapshot-க்கு எதிராக மீண்டும் தீர்க்கப்படுகின்றன, நிலையான AutomationId-க்கு முன்னுரிமை அளித்து; எனவே திருத்தங்களுக்குப் பிறகும் மதிப்புகள் நேரடியாகவே இருக்கும்.

**Locators-ஐப் பதிவு செய்தல்.** server XML page source-ஐயும், *அத்துடன்* சரியாக அந்த source-க்கு எதிராக இயங்கும் ஒரு xpath உத்தியையும் வெளிப்படுத்துவதால், Appium பாணியிலான எந்த inspector-உம் நேரடி மரத்தை ஒரு screenshot மீது காட்டி, nodes-ஐ click செய்வதன் மூலம் locators-ஐப் பிடிக்க உதவும். அதை `127.0.0.1`, உங்கள் port, path `/`, சாதாரண http ஆகியவற்றுக்குச் சுட்டுங்கள்; capabilities புறக்கணிக்கப்படுகின்றன. Locators-ஐ இந்த வரிசையில் முன்னுரிமைப்படுத்துங்கள்: **`id`** → **`xpath`** → `name`/`role`/`type`. எச்சரிக்கைகள்: இது ஒரு W3C WebDriver server, முழு Appium server அல்ல (Appium-க்கு மட்டுமான endpoints 404-ஐத் திருப்பித் தருகின்றன — பொதுவான WebDriver client தான் மிக நம்பகமான inspector); screenshot வேறொரு DPI-இல் பிடிக்கப்பட்டால் overlay இடம்பெயர்ந்திருக்கலாம்; ஒரு நேரத்தில் ஒரு சாளரம்; மறைக்கப்பட்ட கட்டுப்பாடுகள் மரத்திலிருந்து விடுபடுகின்றன.

ஒரு **headless** சோதனையில் message loop இல்லை, எனவே HTTP அழைப்புகள் ஒரு worker-இல் இயங்கும்போது queue-ஐ pump செய்யுங்கள்:

**C#**

```csharp
var task = Task.Run (RunWebDriverFlow);
while (!task.IsCompleted) {
    Platform.Backend.DoEvents ();
    Thread.Sleep (5);
}
```

**VB.NET**

```vb
Dim task = Task.Run(AddressOf RunWebDriverFlow)
While Not task.IsCompleted
    Platform.Backend.DoEvents()
    Thread.Sleep(5)
End While
```

**desktop பயன்பாட்டுக்கு Playwright பொருந்தாது** — அது ஒரு DOM மீது browser engines-ஐத் தானியக்கமாக்குகிறது, இங்கே DOM இல்லை. (browser head-இன் [ARIA பிரதிபிம்பம்](#module-6-singleview) ஒரு DOM தான், ஆனால் அது ஓர் அணுகல்தன்மை மேற்பரப்பு, automation API அல்ல; பயன்பாட்டை WebDriver வழியாக இயக்குங்கள்.) அந்தக் கேள்வி ஒரு sprint-ஐ விழுங்க விடாதீர்கள்.

### ஒரு AI agent பயன்பாட்டை இயக்க அனுமதித்தல்
{:#module-8-mcp}

ஒரு AI உதவியாளர் பயன்படுத்துவதும் அதே WebDriver endpoint தான். `Majorsilence.Forms.Mcp` என்பது ஒரு dotnet global tool ஆக வெளியிடப்படும் MCP server: அது உதவியாளருடன் stdio வழியாக MCP-யிலும், உங்கள் பயன்பாட்டின் `WebDriverServer`-உடன் loopback வழியாக HTTP-யிலும் பேசுகிறது; `ui_snapshot`, `ui_find`, `ui_read`, `ui_click`, `ui_type`, `ui_wait_for`, `ui_screenshot` ஆகியவற்றை வெளிப்படுத்துகிறது. ஒவ்வொரு tool-உம் ஒரு element handle-ஐ அல்ல, ஒரு locator-ஐ ஏற்கிறது; எனவே ஒரு find-க்கும் ஒரு செயலுக்கும் இடையில் எதுவும் பழையதாகிவிடுவதில்லை.

```
dotnet tool install -g Majorsilence.Forms.Mcp
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444     # அல்லது எந்த MCP client-இன் config-இலும் இதே கட்டளை
```

கற்கும்போது இதைச் சுட்டுவதற்கு ஒன்று: `samples/AutomationTarget` என்பது சரியாக இதற்காகவே உருவாக்கப்பட்ட ஒரு சிறிய பயன்பாடு — `dotnet run --project samples/AutomationTarget -- --webdriver 4444` endpoint-ஐத் தொடங்கி, அதை இயக்குவதற்கான கட்டளைகளை அச்சிடுகிறது. அதன் கட்டுப்பாடுகள் ஒவ்வொன்றும் ஒரு client கையாள வேண்டிய ஒரு விஷயத்தைச் சோதிக்கின்றன: நிரந்தரமாக முடக்கப்பட்ட ஒரு button (பொய்யான வெற்றிக்குப் பதிலாக ஒரு மறுப்பைக் காண்பீர்கள்), ஒரு checkbox tick செய்யப்பட்ட பிறகுதான் இயக்கத்துக்கு வரும் Submit button (`ui_wait_for` இதற்காகத்தான்), வேண்டுமென்றே பெயரிடப்படாத ஒரு கட்டுப்பாடு, client தான் செய்ததாகக் *கூறுவதை* பயன்பாடு கண்டதுடன் ஒப்பிட்டுப் பார்க்க உதவும் ஒவ்வொரு செயலின் கண்ணுக்குத் தெரியும் log. automation மேற்பரப்புக்கு அங்கீகாரம் (authentication) இல்லை, எனவே அதை development மற்றும் test builds-இல் மட்டுமே வெளிப்படுத்துங்கள்.

### Windows-இல் அணுகல்தன்மை
{:#module-8-a11y}

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // முதலில் காட்டப்பட வேண்டும் — அதற்கு ஒரு நேட்டிவ் handle தேவை
WindowsUIAutomation.Enable (form);  // சாளரம் மூடப்படும்போது தானாகவே பிரிந்துவிடும்
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' முதலில் காட்டப்பட வேண்டும் — அதற்கு ஒரு நேட்டிவ் handle தேவை
WindowsUIAutomation.Enable(form)    ' சாளரம் மூடப்படும்போது தானாகவே பிரிந்துவிடும்
```

> **அந்தக் குறியீட்டுத் துண்டு Windows அல்லாத இடங்களில் compile ஆகாது** — இது சரிபார்க்கப்பட்டது, ஊகம் அல்ல. Windows-க்கு
> வெளியே அந்த package ஒரு வெற்று stub ஆக வருகிறது, எனவே `Majorsilence.Forms.WindowsUIAutomation` namespace இருப்பதில்லை;
> இயக்க நேர `PlatformNotSupportedException`-க்குப் பதிலாக CS0234 கிடைக்கும். ஒரு பல்தள பயன்பாட்டில்,
> multi-target செய்து (`net10.0;net10.0-windows`) அந்த அழைப்பை `#if WINDOWS` மூலம் பாதுகாருங்கள், அல்லது உங்கள்
> desktop head நிபந்தனையுடன் குறிப்பிடும் Windows-க்கு மட்டுமான ஒரு project-இல் அதை வைத்திருங்கள்.

ஒவ்வொரு கட்டுப்பாடும் **Name**, **AutomationId** (`Control.Name`), **ControlType**, **IsEnabled**, **HasKeyboardFocus**, ஒரு திரை **BoundingRectangle** ஆகியவற்றுடன் ஒரு UIA element ஆகிறது. `Invoke` (buttons) நேரடியாக வேலை செய்கிறது; `Value` மற்றும் `Toggle` வாசிப்பதற்காக வெளிப்படுத்தப்படுகின்றன. Focus மாற்றங்கள் UIA focus-changed நிகழ்வுகளை எழுப்புகின்றன — அதுதான் ஒரு திரை வாசிப்பான் புதிய கட்டுப்பாட்டை அறிவிக்கவும், ஓர் உருப்பெருக்கி அதைப் பின்தொடரவும் செய்கிறது.

இந்த முதல் பதிப்பில் இல்லாதவை: ஒவ்வொரு keystroke-க்குமான `TextBox` மதிப்பு நிகழ்வுகள் (திரை வாசிப்பான்கள் தங்கள் சொந்தத் தட்டச்சு-எழுத்து எதிரொலிக்குத் திரும்புகின்றன; focus-இல் புலம் இன்னும் அறிவிக்கப்படுகிறது), structure-changed நிகழ்வுகள், உள்-கட்டுப்பாட்டு உருப்படிகள் (தனித்தனி tabs, பட்டியல் வரிசைகள்). அதே மரத்தின் மீதான Linux (AT-SPI) மற்றும் macOS (NSAccessibility) பாலங்கள் roadmap உருப்படிகள் — எனவே அந்தத் தளங்களில் உங்களுக்கு அணுகல்தன்மைக் கடப்பாடு இருந்தால், வெளியிடும் நேரத்தில் அல்ல, இப்போதே அதை எழுப்புங்கள்.

**பயிற்சி 8.** மேலே உள்ள `GreetFormTests`-ஐ உங்கள் குழுவின் மொழியில் எழுதி, திரை இல்லாமல் CI-இல் அதைப் பச்சையாக்குங்கள், பிறகு ஒரு golden-image assertion-ஐச் சேருங்கள். உங்கள் குறியீட்டுத் தளத்தில் உள்ள ஒவ்வொரு UI சோதனையும் பின்பற்ற வேண்டிய வார்ப்புரு அந்தச் சோதனைதான்.

---

## Module 9 — நேட்டிவ் உள்ளடக்கமும் வீடியோவும்
{:#module-9}

**விளைவு:** உங்கள் குழுவில் யாரும் ஒருபோதும் சாளர handle ஒன்றைப் போலியாக உருவாக்க மாட்டார்கள்; வீடியோ, வரைபடங்கள், உலாவி உள்ளடக்கம் ஆகியவை உண்மையில் சரியாக ஒன்றிணைந்து (composite) தோன்றும் விதத்தில் ஹோஸ்ட் செய்யப்படும்.

இரண்டு கேள்விகள் உண்மையில் ஒரே கேள்வியாக மாறுகின்றன — "ஒரு கட்டுப்பாட்டுக்குள் (control) நேட்டிவ் உள்ளடக்கத்தை எப்படி வைப்பது?" மற்றும் "ஒரு கட்டுப்பாட்டுக்கான `HWND`-ஐ எப்படிப் பெறுவது?" — இரண்டாவதற்கான பதில்: **உங்களால் முடியாது, அதைப் போலியாக உருவாக்கவும் கூடாது.**

| உறுப்பு (Member) | மதிப்பு | ஏன் |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | ஒவ்வொரு கட்டுப்பாட்டுக்கும் தனி OS சாளரம் எதுவும் இல்லை. `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle` ஆகியவற்றுக்கும் இதுவே. |
| `WindowBase.Handle` | ஒளிபுகா (opaque), பூஜ்ஜியமல்லாத ஒரு token | **இது `HWND` அல்ல.** `Invoke`-க்கு முன் handle உருவாக்கத்தைக் கட்டாயப்படுத்த WinForms குறியீடு வழக்கமாக `.Handle`-ஐ வாசிப்பதால் இது உள்ளது; பூஜ்ஜியத்தைத் திருப்பினால் அந்த வழக்கம் உடைந்துவிடும். managed குறியீட்டுக்குள் மட்டுமே இதற்கு அர்த்தம் உண்டு. |
| `WindowBase.PlatformHandle` | உண்மையான நேட்டிவ் handle, அல்லது பூஜ்ஜியம் | உண்மையானது இதுதான் — Avalonia பின்தளத்தில் `HWND`/`NSWindow`/`XID`, WinForms பின்தளத்தில் உண்மையான `HWND`. Uno மற்றும் Headless-இல் பூஜ்ஜியம். |

**போலியாக்குவது பற்றிய விதி:** புனையப்பட்ட handle ஒன்று, நீங்கள் கட்டுப்படுத்தும் managed குறியீட்டுக்குள் மட்டுமே சுற்றிவரும் வரை *மட்டுமே* பாதுகாப்பானது. அது நேட்டிவ் குறியீட்டுக்குள் நுழையும் கணத்திலேயே பாதுகாப்பற்றதாகிவிடும் — LibVLC-இன் `libvlc_media_player_set_hwnd`, mpv-இன் `--wid`, GStreamer-இன் `GstVideoOverlay.set_window_handle` ஆகிய அனைத்தும் அதை OS-க்கு (`SetParent`, `CreateWindowEx`, `SetWindowPos`) அனுப்புகின்றன; OS புனையப்பட்ட மதிப்பைச் சகித்துக்கொள்ளாது.

### வழி A — `NativeControlHost`
{:#module-9-route-a}

ஆதரிக்கப்படும் இணைப்புக்கோடு (seam): உங்கள் கட்டுப்பாடு ஒரு செவ்வகத்தை ஒதுக்குகிறது; பின்தளம் (backend) அதை Skia மேற்பரப்பின் மேல் வைக்கப்படும் உண்மையான toolkit உறுப்பால் நிரப்புகிறது, அது placeholder-இன் எல்லைகள், clip, தெரிவுநிலை ஆகியவற்றுடன் ஒத்திசைவாக வைக்கப்படுகிறது. Avalonia, Uno, GTK 4, WinForms பின்தளம் ஆகியவற்றில் கிடைக்கிறது; Headless மற்றும் Terminal-இல் இல்லை.

**C#**

```csharp
using Majorsilence.Forms;

var host = new NativeControlHost {
    Name = "mapHost",
    Dock = DockStyle.Fill
};

// toolkit-இன் சொந்த உறுப்பு வகையை ஒதுக்குங்கள். Avalonia பின்தளத்தில் அது ஒரு Avalonia Control:
host.NativeControl = new Avalonia.Controls.Button { Content = "I am a real Avalonia button" };

Controls.Add (host);

// null அமைத்தால் ஹோஸ்ட் செய்யப்பட்ட உறுப்பு மீண்டும் அகற்றப்படும்.
host.NativeControl = null;
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Dim host As New NativeControlHost With {
    .Name = "mapHost",
    .Dock = DockStyle.Fill
}

' toolkit-இன் சொந்த உறுப்பு வகையை ஒதுக்குங்கள். Avalonia பின்தளத்தில் அது ஒரு Avalonia Control:
host.NativeControl = New Avalonia.Controls.Button With {
    .Content = "I am a real Avalonia button"
}

Controls.Add(host)

' Nothing அமைத்தால் ஹோஸ்ட் செய்யப்பட்ட உறுப்பு மீண்டும் அகற்றப்படும்.
host.NativeControl = Nothing
```

![Majorsilence படிவம் ஒன்றுக்குள் ஹோஸ்ட் செய்யப்பட்ட நேட்டிவ் Avalonia பொத்தான்]({{ '/assets/img/example-native.png' | relative_url }})

*அந்தக் குறியீடு இயங்கும் நிலையில்: Avalonia `Button` உண்மையிலேயே அங்கே உள்ளது, Skia மேற்பரப்புக்கு மேல் ஹோஸ்ட் செய்யப்பட்டுள்ளது. அது பொத்தான் அலங்காரம் (chrome) எதுவுமின்றி வெறும் உரையாக வரையப்படுவதைக் கவனியுங்கள் — ஹோஸ்ட் செய்யப்பட்ட நேட்டிவ் கட்டுப்பாடு **ஹோஸ்ட் பயன்பாட்டின்** Avalonia styles மூலம் வடிவமைக்கப்படுகிறது; பின்தளம் எந்தத் தீமையும் நிறுவாத குறைந்தபட்ச Avalonia பயன்பாட்டையே தொடங்குகிறது. இணைப்புக்கோடு வேலை செய்கிறது; வடிவமைப்பை நீங்கள்தான் வழங்க வேண்டும். வரைபடம் அல்லது வீடியோ காட்சி போன்ற தானே வரையும் மேற்பரப்பு அல்லாமல், உண்மையான நேட்டிவ் UI-ஐ ஹோஸ்ட் செய்யத் திட்டமிட்டால் அதற்கான வேலையைக் கணக்கில் கொள்ளுங்கள்.*

தெரிந்துகொள்ள வேண்டிய மூன்று விஷயங்கள். **Airspace வரம்புகள்:** overlay என்பது நீங்கள் வரைந்த உள்ளடக்கத்துக்கு *மேலே* உள்ள நேட்டிவ் உறுப்பு; ஆகவே framework வரையும் எதுவும் அதன் மேல் தோன்ற முடியாது (GTK 4 விதிவிலக்கு — அது ஒவ்வொரு widget-ஐயும் ஒரே render tree-க்குள் ஒன்றிணைக்கிறது, அதனால் அங்கே "airspace" சிக்கல் இல்லை). **வடிவமைப்பு Majorsilence.Forms-இலிருந்து மரபுரிமையாகப் பெறப்படுவதில்லை** — மேலுள்ள திரைப்பிடிப்பைப் பாருங்கள். மேலும் **தவறான வகையை ஒதுக்கினால் அது மௌனமாகத் தோல்வியடையும்** — `NativeControl`-இன் வகை `Object`; ஒவ்வொரு பின்தளமும் அதன் வகையைச் சரிபார்த்து, பொருந்தாவிட்டால் வெறுமனே திரும்பிவிடும்; எதுவும் exception எறியாது, எதுவும் log ஆகாது, எதுவும் தோன்றாது. Uno பின்தளத்துக்குக் கொடுக்கப்பட்ட Avalonia `Control` சரியாக இதையே செய்கிறது; GTK 4-க்குக் கொடுக்கப்பட்ட WinForms கட்டுப்பாடும் அப்படியே. உங்கள் நேட்டிவ் உள்ளடக்கம் தெரியவில்லை என்றால், முதலில் வகையைச் சரிபாருங்கள்: Avalonia `Control`, Uno `UIElement`, `System.Windows.Forms.Control`, `Gtk.Widget`.

### வழி B — frame callbacks மூலம் வீடியோ (பரிந்துரைக்கப்படுகிறது)
{:#module-9-route-b}

நேட்டிவ் மேற்பரப்பை ஹோஸ்ட் செய்வதற்குப் பதிலாக, player-இலிருந்து decode செய்யப்பட்ட frames-ஐ எடுத்து நீங்களே Skia-க்குள் வரையுங்கள். நீங்கள் வரையும் மற்ற எல்லாவற்றுடனும் அது சரியாக ஒன்றிணைகிறது; airspace சிக்கல், handle சிக்கல் இரண்டையும் அது முற்றிலுமாகத் தவிர்க்கிறது. அதன் வடிவம்:

**C#**

```csharp
public class VideoSurface : Control
{
    private SKBitmap? frame;

    // உங்கள் player-இன் frame callback-இலிருந்து, அது பயன்படுத்தும் எந்த thread-இலும் அழைக்கப்படுகிறது.
    public void OnFrameDecoded (SKBitmap decoded)
    {
        frame = decoded;
        Majorsilence.Forms.Application.RunOnUIThread (Invalidate);
    }

    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);

        if (frame is not null)
            e.Canvas.DrawBitmap (frame, new SKRect (0, 0, Width, Height));
    }
}
```

**VB.NET**

```vb
Public Class VideoSurface
    Inherits Control

    Private frame As SKBitmap

    ' உங்கள் player-இன் frame callback-இலிருந்து, அது பயன்படுத்தும் எந்த thread-இலும் அழைக்கப்படுகிறது.
    Public Sub OnFrameDecoded(decoded As SKBitmap)
        frame = decoded
        Majorsilence.Forms.Application.RunOnUIThread(AddressOf Invalidate)
    End Sub

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        MyBase.OnPaint(e)

        If frame IsNot Nothing Then
            e.Canvas.DrawBitmap(frame, New SKRect(0, 0, Width, Height))
        End If
    End Sub
End Class
```

![decode செய்யப்பட்ட frame ஒன்றை ஒன்றிணைத்துக் காட்டும் frame-callback வீடியோ மேற்பரப்பு]({{ '/assets/img/example-video.png' | relative_url }})

*அதே குறியீடு, decoder-க்குப் பதிலாகச் செயற்கையாக உருவாக்கப்பட்ட frame ஒன்றுடன். Bitmap நேரடியாகக் கட்டுப்பாட்டின் Skia canvas-க்குள் வரையப்படுகிறது; ஆகவே நீங்கள் வரையும் மற்ற எல்லாவற்றுடனும் அது ஒன்றிணைகிறது — airspace இல்லை, handle இல்லை; Headless உட்பட ஒவ்வொரு பின்தளத்திலும் ஒரே மாதிரி வேலை செய்கிறது (அதை unit-test செய்வது அப்படித்தான்).*

முழு ஒப்பீட்டுக்கும் தெரிந்த இடைவெளிகளுக்கும் [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md)-ஐப் பாருங்கள்.

**பயிற்சி 9.** உங்கள் குறியீட்டுத் தளத்திலுள்ள ஒவ்வொரு `.Handle`-ஐயும் கண்டுபிடித்து, ஒவ்வொரு பயன்பாட்டையும் வகைப்படுத்துங்கள்: handle உருவாக்கத்தைக் கட்டாயப்படுத்துதல் (பரவாயில்லை — வைத்திருங்கள்), managed குறியீட்டுக்கு அனுப்புதல் (பரவாயில்லை), அல்லது நேட்டிவ் குறியீட்டுக்கு அனுப்புதல் (மாற்றியே ஆக வேண்டும்). உண்மையிலேயே குழப்பமான ஒரு வகை bug-ஐத் தடுக்கும் ஐந்து நிமிட grep இது.

---

## Module 10 — வெளியிடுதல்: CI, பதிப்பு மேலாண்மை, புதுப்பித்த நிலையில் இருத்தல்
{:#module-10}

**விளைவு:** இந்த framework உண்மையில் உருவாக்கும் பின்னடைவுகளை (regressions) உங்கள் pipeline பிடிக்கும்; ஓர் இடைவெளியை (gap) எதிர்கொள்ளும்போது என்ன செய்ய வேண்டும் என்பது உங்களுக்குத் தெரிந்திருக்கும்.

### உங்கள் pipeline-க்குக் கட்டுப்பாட்டு வாயில்கள் அமையுங்கள்
{:#module-10-ci}

| வாயில் (Gate) | கட்டளை | பிடிப்பது |
|---|---|---|
| சுத்தமான build | `dotnet build --configuration Release` | எச்சரிக்கைகள் குவிவதற்கு முன்பே |
| சோதனைகள் | `dotnet test --configuration Release --no-build` | [module 8](#module-8)-இலுள்ள அனைத்தும் — திரை (display) தேவையில்லை |
| இடம்பெயர்த்தல் விலகல் (drift) | `majorsilence-migrate <sln> --dry-run --strict` | நீங்கள் இன்னும் ஒருங்கிணைந்துகொண்டிருக்கும்போது, ஒரு branch-இல் வந்து சேரும் கணத்திலேயே புதிய, mapping செய்யப்படாத reference ஒன்றை |
| HiDPI | அளவிடுதலுக்கு (scaling) உணர்திறன் கொண்ட சோதனைகளில் `MF_HEADLESS_SCALE=2` | அளவு 1-இல் மட்டுமே வேலை செய்யும் layout-ஐ — மேலும் இன்னும் தன் சொந்த canvas-ஐ அளவிடும் தனிப்பயன் கட்டுப்பாட்டை ([module 4](#module-4-paint)) |
| உலாவிக் குறியீட்டில் தடுக்கும் அழைப்புகள் | `MFB001`–`MFB003` analyzer; பகிரப்பட்ட UI library-இன் `.editorconfig`-இல் `majorsilence_forms.browser_target = true`, அந்தத் திட்டத்தில் எச்சரிக்கைகளைப் பிழைகளாகக் கருதுதல் | பக்கத்தை exception எறியவைக்கும் அல்லது உறையவைக்கும் `ShowDialog`/`MessageBox.Show`/`.Result`/`Thread.Sleep` ஒன்றை ([module 6](#module-6-async)) |
| உலாவித் தொடக்கம் (boot) | உங்கள் wasm head-ஐ `dotnet publish` செய்தல் + headless-Chromium smoke test | wasm pipeline உடைவதை |

உலாவியை இலக்காகக் கொண்டால், அந்தக் கடைசி வாயிலை அப்படியே எடுத்துக்கொள்வது பயனுள்ளது: **wasm இலக்கை build செய்வது அது வேலை செய்கிறது என்பதற்குச் சான்று அல்ல.** wasm-tools pipeline-ஐ (emcc/wasm-opt நேட்டிவ் link) இயக்குவது `dotnet publish`; உலாவியில் உண்மையாகத் தொடங்குவது (boot) மட்டுமே bundle-ஐ நிரூபிக்கிறது. வெற்றிபெறும் `dotnet build` அதைப் பற்றி எதுவும் சொல்லாது. framework-இன் சொந்த CI இதை, gallery head புரிந்துகொள்ளும் `?check=<name>` query string மற்றும் ஒரு சிறிய Node script (`samples/Gallery.Wasm/tools/modal-check.mjs`) மூலம் செய்கிறது; அது வெளியிடப்பட்ட bundle-ஐ headless Chrome-இல் தொடங்கி, பெயரிடப்பட்ட ஒவ்வொரு சோதனையையும் இயக்கி, விளைவை எதிர்பார்க்கப்படும் அட்டவணையுடன் ஒப்பிடுகிறது — async-உரையாடல் சாளர விதியை நிரூபித்தவை அந்த modal சோதனைகளே. அந்த வடிவத்தையே பின்பற்றுங்கள்: உங்கள் சொந்த head-இல் ஒரு `?check=` switch சேர்க்க ஒரு பிற்பகல் போதும்; அது "publish ஆனது" என்பதை "இயங்கியது" என்பதாக மாற்றுகிறது.

### பதிப்பு ஒழுக்கம்
{:#module-10-versioning}

- **உங்கள் package பதிப்பை நிலைப்படுத்துங்கள்.** இது பீட்டா மென்பொருள்; API நிலைபெற்று வருகிறது. நிலைப்படுத்துங்கள், திட்டமிட்டே மேம்படுத்துங்கள் (upgrade), வெளியீட்டுக் குறிப்புகளை வாசியுங்கள் — [module 5-இன் சரிபார்ப்புப் பட்டியலில்](#module-5-checklist) ஆவணப்படுத்தப்பட்டுள்ள உடைக்கும் மாற்றங்கள் (breaking changes) பதிப்புகளுக்கு இடையே வந்து சேரும் வகையைச் சேர்ந்தவை.
- **core, backend, migrator பதிப்புகளை ஒன்றாகவே நகர்த்துங்கள்.** migrator-இன் `--package-version` இயல்பாக அதன் சொந்தப் பதிப்பையே எடுக்கிறது, ஏனெனில் கருவியும் packages-உம் ஒரே வெளியீட்டிலிருந்தே வருகின்றன.
- **பதிப்பை ஓரிடத்தில் மையப்படுத்துங்கள்**, அப்போது ஒரு மேம்படுத்தல் ஒரே ஒரு திருத்தம்தான். `Directory.Packages.props`-இல்:

  ```xml
  <Project>
    <PropertyGroup>
      <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    </PropertyGroup>
    <ItemGroup>
      <PackageVersion Include="Majorsilence.Forms" Version="26.9.0" />
      <PackageVersion Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
      <PackageVersion Include="Majorsilence.Forms.Headless" Version="26.9.0" />
    </ItemGroup>
  </Project>
  ```

  `Majorsilence.Forms.Mvvm`, `.Theming.WinForms`, `.Animation` அல்லது இரண்டாவது பின்தளம் ஒன்றை நீங்கள் பயன்படுத்தத் தொடங்கும்போது அவற்றையும் இதே பட்டியலில் சேருங்கள் — இந்தக் குடும்பத்திலுள்ள ஒவ்வொரு package-உம் ஒரே வெளியீட்டிலிருந்து, ஒரே பதிப்பில் வருகிறது.

- **மேம்படுத்தலை ஒரு branch-இல், உங்கள் golden-image சோதனைகள் பச்சையாக (green) இருக்கும் நிலையில் செய்யுங்கள்** — அது வேறு யாரையும் அடைவதற்கு முன். வரைதல் (rendering) மாற்றங்களுக்காகவே அந்தச் சோதனைகள் உள்ளன.

### ஓர் இடைவெளியை எதிர்கொள்ளும்போது
{:#module-10-gaps}

நீங்கள் எதிர்கொள்வீர்கள். தெரிந்துகொள்ள வேண்டிய பயனுள்ள விஷயம்: இந்த framework-இலுள்ள பல இடைவெளிகள் API மேற்பரப்பை வாசிப்பதன் மூலம் அல்ல, *உண்மையான பயன்பாடுகளை இடம்பெயர்த்ததன்* மூலம் மட்டுமே கண்டுபிடிக்கப்பட்டன — ஒரு WinForms விளையாட்டு, ஒரு ribbon கட்டுப்பாட்டு library. உங்கள் குழு உண்மையான ஒன்றை port செய்து, மௌனமான no-op ஒன்றை எதிர்கொண்டால், அந்தக் கண்டுபிடிப்பு உங்கள் சொந்தத் திட்டத்துக்கு அப்பாலும் மதிப்புடையது.

- **no-op ஆக இருப்பதற்குப் பதிலாக exception எறியும் உறுப்பு (member)** [stub கொள்கைக்கு](#module-3-stub-policy) முரணானது — அதை bug ஆக அறிவியுங்கள்.
- **உங்களுக்கு ஒரு நாளை வீணாக்கிய மௌனமான no-op** ஒன்றுக்கும் issue ஒன்றைப் பதிவுசெய்வது பயனுள்ளது: உறுப்பின் பெயரை மட்டுமல்ல, *அறிகுறியையும்* சேர்த்துப் பதிவுசெய்யுங்கள் ("`X` எதுவும் செய்யவில்லை, அதனால் sprites வெள்ளைப் பெட்டியுடன் வரையப்பட்டன"), ஏனெனில் அடுத்த குழு அதைக் கண்டுபிடிக்க உதவுவது அந்த அறிகுறிதான். நீங்கள் எழுதிய [நிலைப்படுத்தும் சோதனையை](#module-3-pin) இணையுங்கள் — அது இயக்கத் தயாரான மீள்உருவாக்கம் (reproduction).
- **தடைப்பட்டு, காத்திருக்க முடியவில்லையா?** இந்தத் திட்டம் AI உதவியுடன் எழுதப்பட்டவையோ இல்லையோ pull requests-ஐ ஏற்றுக்கொள்கிறது; அதற்கான தரம் எளிமையானது: `dotnet build --configuration Release`, `dotnet test` இரண்டும் சுத்தமாக இருக்க வேண்டும்; புதிய நடத்தை compile ஆகிறது என்பதை அல்ல, அது *வேலை செய்கிறது* என்பதை நிரூபிக்கும் சோதனைகளால் உள்ளடக்கப்பட வேண்டும்; [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) அது விவரிக்கும் குறியீட்டுடன் சேர்த்தே புதுப்பிக்கப்பட வேண்டும். உங்களைத் தடுக்கும் குறிப்பிட்ட இடைவெளியை மூடுவது, பொதுவாக அதைச் சுற்றி வடிவமைப்பதைவிட மிகச் சிறிய வேலை.

**பயிற்சி 10.** மேலுள்ள வாயில்களை உங்கள் repository-இல் சேருங்கள். பின்னர், [module 3](#module-3)-இன் பயிற்சியிலிருந்து உங்கள் பயன்பாட்டுக்கு உண்மையில் தேவைப்படும் அந்த ஓர் இடைவெளியை எடுத்து, குழுவாக முடிவுசெய்யுங்கள்: அதைச் சுற்றி வடிவமைப்பதா, அல்லது upstream-இல் அதை மூடுவதா. எதை, ஏன் என்று எழுதிவையுங்கள்.

---

## பின்னிணைப்பு A — அறிகுறி வாரியான சிக்கல் தீர்வு
{:#appendix-a}

| அறிகுறி | சாத்தியமான காரணம் | தீர்வு |
|---|---|---|
| பயன்பாடு தொடங்கவில்லை / சாளரம் எதுவும் தோன்றவில்லை | எந்தப் பின்தள package-உம் reference செய்யப்படவில்லை — core package-ஆல் தனியாகத் திரையில் சாளரத்தைக் காட்ட முடியாது | `Majorsilence.Forms.Avalonia` (அல்லது Uno/Headless) சேருங்கள் |
| இடம்பெயர்த்த பின் `Bitmap`/`Font`/`Pen` மீது ambiguous-reference பிழைகள் | Majorsilence மாற்றீடுகளுடன் `System.Drawing.Common` இன்னும் reference செய்யப்பட்டுள்ளது | அந்த package reference-ஐ அகற்றுங்கள் (migrator தான் தொடும் ஒவ்வொரு திட்டத்திலும் இதைச் செய்கிறது) |
| `SystemColors` / `ColorTranslator` மீது CS0104 (C#) / தெளிவின்மை (VB) | இரண்டும் `System.Drawing.Primitives`-இல் உள்ளன, ஆகவே வைத்திருக்கப்பட்ட `System.Drawing` import வழியாக இன்னும் resolve ஆகின்றன | alias சேருங்கள் — `using SystemColors = Majorsilence.Forms.SystemColors;` / `Imports SystemColors = Majorsilence.Forms.SystemColors` |
| WinForms-ஐ ஒருபோதும் குறிப்பிடாத class library ஒன்று compile ஆகவில்லை | அதிலிருந்த image/font உதவி ஒன்று `Majorsilence.Forms.Drawing.*`-க்கு மீண்டும் எழுதப்பட்டது | `Majorsilence.Forms` reference-ஐச் சேருங்கள்; "மீண்டும் எழுதுதல் தொடும் திட்டங்கள்" என்பது "WinForms திட்டங்கள்" என்பதைவிட அகலமானது |
| Designer நிகழ்வு இணைப்பு compile ஆகவில்லை (`new EventHandler<KeyEventArgs>(…)`) | நிகழ்வு delegate வகைகள் இப்போது WinForms-உடன் பொருந்துகின்றன | wrapper-ஐ நீக்குங்கள், அல்லது WinForms delegate-ஐப் பெயரிடுங்கள் (`KeyEventHandler`, `MouseEventHandler`, …) |
| `Click` handler-இல் `e.X` / `e.Button` இல்லை | WinForms-இலும் `Click` ஒரு `EventArgs` நிகழ்வுதான் | `MouseClick`-க்கு மாறுங்கள்; menu item-இல், உரிமையாளர் கட்டுப்பாட்டிலிருந்து நிலையை (position) எடுங்கள் |
| VB: `Anchor`/`DockStyle` flags மீது `Or` vs `|` | VB-இல் flag சேர்க்கை `Or` பயன்படுத்துகிறது | `AnchorStyles.Top Or AnchorStyles.Left` |
| VB: சோதனைகள் எந்தப் பின்தளமும் இல்லாமல் இயங்குகின்றன | VB-இல் module initializer இல்லை — C# `<ModuleInitializer>` முறை மௌனமாக எதுவும் செய்யாது | `<AssemblyInitialize>` / `<SetUpFixture>`-இலிருந்து பின்தளத்தை நிறுவுங்கள் — [module 8](#module-8-headless)-ஐப் பாருங்கள் |
| split layout ஒன்றின் திசை (orientation) தலைகீழாக மாறியது | `SplitContainer.Orientation` இப்போது *பிரிகோட்டின் (bar)* திசையைக் குறிக்கிறது | நீங்கள் அமைக்கும் மதிப்பைத் தலைகீழாக்குங்கள் (எதுவும் எச்சரிக்காது — இரண்டு மதிப்புகளும் compile ஆகும்) |
| முதல் resource வாசிப்பில் `InvalidCastException` | உருவாக்கப்பட்ட (generated) resource designer ஒன்று `System.Resources.ResourceManager` முடிவை cast செய்கிறது | `Majorsilence.Forms.ComponentResourceManager` பயன்படுத்துங்கள் (migrator உருவாக்கப்பட்ட designers-ஐத் தானாகவே மீண்டும் எழுதுகிறது) |
| இயங்கும் நேரத்தில் ஒரு resource `null` ஆக resolve ஆகிறது | resx பதிவு ஒரு `ResXFileRef` (இணைக்கப்பட்ட கோப்பு, inline தரவு அல்ல) | resource-ஐ inline ஆக்குங்கள், அல்லது நீங்களே அதை load செய்யுங்கள் |
| எல்லா icons-உம் தெரியவில்லை, எதுவும் log ஆகவில்லை | ஒப்பீட்டு (relative) asset பாதை ஒன்று தவறான **working directory**-க்கு எதிராக resolve ஆனது; காணாமல் போன கோப்பு exception எறிவதற்குப் பதிலாக 1×1 placeholder ஆனது | assets-ஐ `AppContext.BaseDirectory`-க்கு எதிராக resolve செய்யுங்கள் — [module 0](#module-0)-ஐப் பாருங்கள் |
| உலாவி build-இல் மட்டும் icons காணவில்லை | அங்கே உண்மையான filesystem இல்லை; ஒப்பீட்டுக் கோப்பு load-கள் வேலை செய்ய முடியாது | படங்களை embedded resources ஆக அனுப்புங்கள் — [module 6](#module-6-singleview)-ஐப் பாருங்கள் |
| ஒரு property-ஐ அமைத்ததற்குத் தெரியும் விளைவு எதுவுமே இல்லை | [stub கொள்கையின்படி](#module-3-stub-policy) அது ஒரு stub — சேமித்துத் திரும்ப வாசிக்கக் கொடுக்கிறது, எதுவும் அதைப் பயன்படுத்துவதில்லை | matrix வரிசையைச் சரிபாருங்கள். அதற்குப் பதிலாக அது exception *எறிந்தால்*, அது bug — அறிவியுங்கள் |
| ஹோஸ்ட் செய்யப்பட்ட நேட்டிவ் உள்ளடக்கம் தெரியவில்லை | பின்தளம் உங்கள் நேட்டிவ் கட்டுப்பாட்டின் வகையைச் சரிபார்த்தது, பொருந்தவில்லை, மௌனமாகத் திரும்பியது | வகையைச் சரிபாருங்கள்: Avalonia பின்தளத்துக்கு Avalonia `Control`, Uno-க்கு Uno `UIElement`, WinForms பின்தளத்துக்கு `System.Windows.Forms.Control`, GTK 4-க்கு `Gtk.Widget` |
| Maximize/minimize எதுவும் செய்யவில்லை; `Title` புறக்கணிக்கப்படுகிறது | நீங்கள் ஒற்றைக் காட்சித் (single-view) தளத்தில் உள்ளீர்கள் (உலாவி/Android/iOS/Terminal) — window manager இல்லை | எதிர்பார்க்கப்பட்டதே. [module 6](#module-6-singleview)-ஐப் பாருங்கள் |
| HiDPI-இல் clicks தவறான இடத்தில் விழுகின்றன | உள்ளீட்டு வழிச்செலுத்தல் தருக்க அலகுகளையும் சாதன அலகுகளையும் கலக்கிறது — 26.0.30-இல் இருந்த framework bug, பின்னர் சரிசெய்யப்பட்டு CI-இல் அளவு 2-இல் வாயில் அமைக்கப்பட்டது | மேம்படுத்துங்கள் (26.9.0 அல்லது அதற்குப் பிந்தையது). தொடர்ந்தால், இரண்டு வெளிகளையும் கலப்பது உங்கள் சொந்தக் குறியீடுதான் — [module 8](#module-8-headless)-ஐப் பாருங்கள் |
| தனிப்பயன் கட்டுப்பாடு ஒன்று HiDPI திரையில் இரு மடங்கு அளவில் வரைகிறது, 1×-இல் சரியாக உள்ளது | paint canvas இப்போது தருக்க அலகுகளில் உள்ளது; கட்டுப்பாடு இன்னும் `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` அழைத்து இருமுறை அளவிடுகிறது | `ScaleTransform`-ஐ அகற்றுங்கள் — [module 4](#module-4-paint)-ஐப் பாருங்கள். `MF_HEADLESS_SCALE=2`-இன் கீழ் சோதியுங்கள் |
| Owner-drawn உருப்படிகள் (`DrawItem`, `DrawNode`, `CellPainting`) HiDPI-இல் சிறியதாக அல்லது இடம்பெயர்ந்து வருகின்றன | கட்டுப்பாட்டின் தருக்க `ClientRectangle` போலல்லாமல், அந்த நிகழ்வுகள் இன்னும் சாதனப் பிக்சல்களில் உள்ளன | `e.Bounds`, `e.Graphics` இரண்டையும் சேர்த்தே பயன்படுத்துங்கள், கட்டுப்பாட்டின் சொந்தத் தருக்க வடிவவியலைக் கலக்காதீர்கள்; [module 4](#module-4-paint)-ஐப் பாருங்கள் |
| உலாவியில், Android அல்லது iOS-இல் `ShowDialog` / `MessageBox.Show`-இலிருந்து `PlatformNotSupportedException` | அந்த வரிசைகளால் nested modal loop ஒன்றை இயக்க முடியாது; exception, await செய்யக்கூடிய இணை முறையைப் பெயரிடுகிறது | `async` handler ஒன்றிலிருந்து `ShowDialogAsync` / `MessageBox.ShowAsync` பயன்படுத்துங்கள் — [module 6](#module-6-async)-ஐப் பாருங்கள். மீதியை build கண்டுபிடிக்கும்படி `MFB` analyzer-ஐ இயக்குங்கள் |
| ஒரு click-க்குப் பின் உலாவித் tab உறைந்துவிடுகிறது | ஏதோ ஒன்று பக்கத்தின் ஒற்றை thread-ஐத் தடுத்தது — `.Result`, `.Wait()`, `Thread.Sleep` | அதை `await` செய்யுங்கள் (`MFB002`/`MFB003` இவற்றைக் குறிக்கின்றன) — [module 6](#module-6-async)-ஐப் பாருங்கள் |
| GTK 4 சாளரம் ஒன்று `Location` / `StartPosition`-ஐப் புறக்கணிக்கிறது | மேல்நிலைச் சாளரங்களின் client-side நிலையமைப்பை GTK 4 நீக்கிவிட்டது; window manager முடிவுசெய்கிறது | எதிர்பார்க்கப்பட்டதே. அந்தப் பின்தளத்தில் `Location` என்பது சேமிக்கப்படும் ஒரு குறிப்பு மட்டுமே — [module 6](#module-6)-ஐப் பாருங்கள் |
| GTK 4 / Headless-இல் file pickers எதுவும் திருப்பவில்லை | அந்தப் பின்தளங்களில் இன்னும் நேட்டிவ் picker இல்லை, ஆகவே framework-இன் சொந்த மாற்று (fallback) உரையாடல் சாளரம் பயன்படுத்தப்படுகிறது | எதிர்பார்க்கப்பட்டதே; fallback வேலை செய்கிறது. `Gtk.FileDialog` இணைப்பு ஒத்திவைக்கப்பட்ட வேலை |
| WinForms உரையாடல் சாளரம் ஒன்று அதன் Majorsilence பெற்றோருக்கு modal ஆக இல்லை | `OwnerHandleResolver` ஒருபோதும் இணைக்கப்படவில்லை | தொடக்கத்தில் ஒருமுறை அதை இணையுங்கள் — [module 7](#module-7-a)-ஐப் பாருங்கள் |
| Windows-இல் deadlock அல்லது இரட்டை message loop | இரண்டு `Application.Run`-களும் அழைக்கப்பட்டன | ஒரு process-க்கு ஒரு ஹோஸ்ட்; மற்றத் திசைக்கு bridge-ஐப் பயன்படுத்துங்கள் |
| macOS/Linux-இல் interop-இலிருந்து `PlatformNotSupportedException` | அங்கே `System.Windows.Forms` இல்லை | interop அழைப்புகளை Windows சரிபார்ப்பின் பின்னால் பாதுகாத்து வையுங்கள் |
| CSS தீம் விதி ஒன்றுக்கு விளைவு இல்லை, பிழையும் இல்லை | ஒரு கட்டுப்பாடு அந்த property-ஐக் குறியீட்டில் அமைத்தது (`button.BackColor = …`) — WinForms-இல் போலவே, வெளிப்படையான ஒவ்வொரு-கட்டுப்பாட்டு மதிப்புகளே வெல்லும் | ஒவ்வொரு-கட்டுப்பாட்டு மதிப்பை அகற்றுங்கள், அல்லது ஏற்றுக்கொள்ளுங்கள். மாறாக, *எழுத்துப்பிழை* உள்ள விதி எப்போதும் பிழையைத் தரும் — `ThemeStyleSheet.Parse` diagnostics-ஐச் சரிபாருங்கள் ([பின்னிணைப்பு D](#appendix-d)) |
| `BindCommand` செய்யப்பட்ட பொத்தான் ஒவ்வொரு click-க்கும் அதன் command-ஐ இருமுறை இயக்குகிறது | அதே கட்டுப்பாட்டில் `Button.Command`-உம் அமைக்கப்பட்டுள்ளது | ஒன்றை மட்டும் பயன்படுத்துங்கள் ([பின்னிணைப்பு E](#appendix-e)) |

---

## பின்னிணைப்பு B — உண்மையான குறியீட்டுத் தளத்துக்கான அறிமுகத் திட்டம்
{:#appendix-b}

உறுதிப்பாடு (commitment) வருவதற்கு முன்பே சான்றுகள் வந்து சேரும் ஒரு வரிசைமுறை.

1. **Spike (1 நாள்).** Modules 0–3. ஒவ்வொரு டெவலப்பரின் OS-இலும் வார்ப்புருப் பயன்பாடு இயங்குகிறது, நேரடி gallery ஆராயப்பட்டது, இணக்க matrix வாசிக்கப்பட்டது. வழங்கல் (deliverable): உங்கள் பயன்பாட்டின் முதன்மையான 20 UI சார்புகளின் பட்டியல், ஒவ்வொன்றும் implemented / stubbed / absent என மதிப்பிடப்பட்டது.
2. **முன்னோட்ட இடம்பெயர்த்தல் (2–5 நாட்கள்).** சிறிய, உண்மையான, அபாயம் குறைந்த உள்ளகப் பயன்பாடு ஒன்றைத் தேர்ந்தெடுங்கள். ஒரு branch-இல் migrator-ஐ இயக்கி, அதை build ஆகவைத்து, [கைமுறைத் திருத்தச் சரிபார்ப்புப் பட்டியலின்படி](#module-5-checklist) வேலை செய்யுங்கள். வழங்கல்: அளவீடு செய்யப்பட்ட ஒரு KLOC-க்கான மதிப்பீடு, மேலும் *உங்களை* உண்மையில் தடுக்கும் இடைவெளிகளின் பட்டியல்.
3. **ஏற்றுக்கொள்ளும் வடிவத்தைத் தீர்மானியுங்கள்.** நான்கு தெரிவுகள், ஒன்றையொன்று விலக்குபவை அல்ல:
   - **புதிய பயன்பாடு** — நேரடியாக Majorsilence.Forms மீது தொடங்குங்கள் ([module 2](#module-2)).
   - **பழைய பயன்பாட்டில் புதிய திரைகள்** — Windows-இல் Direction B interop; நீங்கள் வெளியிடும் எதையும் மாற்றாமல் ([module 7](#module-7-b)).
   - **பழைய பயன்பாட்டில் ஒரு நேரத்தில் ஒரு கட்டுப்பாடு** — WinForms அல்லது WPF பின்தளம் ([module 7](#module-7-c)); இது .NET Framework 4.8-இலும் வேலை செய்கிறது, ஆகவே UI port runtime மேம்படுத்தலுக்காகக் காத்திருக்கத் தேவையில்லை.
   - **முழுப் பயன்பாட்டு இடம்பெயர்த்தல்** — migrator; நீங்கள் C#-இல் இருந்தால் விருப்பப்படி `--dual-build` உடன் ([module 5](#module-5-dualbuild)). **VB குழுக்கள்: அதற்குப் பதிலாக ஒரே தடவையில் மாறுவதை (cut-over) திட்டமிடுங்கள்** — dual-build உங்களுக்குக் கிடைக்காது.
4. **பெருமளவு வேலைக்கு முன் சோதனை வலையை அமையுங்கள்.** முன்னோட்டப் பயன்பாட்டில் [Module 8](#module-8): locator பெயரிடல் மரபு, CI-இல் headless சோதனைகள், நீங்கள் கவனம் செலுத்தும் திரைகளுக்கு golden images. பெரிய பயன்பாட்டை இடம்பெயர்ப்பதற்கு *முன்பே* இதைச் செய்யுங்கள் — port சரியாக நடந்துகொள்கிறதா என்பதை நீங்கள் அறிவது அந்தச் சோதனைகள் மூலமே.
5. **CI வாயில்களை அமையுங்கள்** ([module 10](#module-10-ci)), `--strict` இடம்பெயர்த்தல் விலகல் (drift) உட்பட.
6. **பகுதி பகுதியாக இடம்பெயர்த்துங்கள்**, ஒரு நேரத்தில் வெளியிடக்கூடிய ஓர் அலகு; ஒவ்வொன்றும் வாயில்களில் பச்சையாக முடிய வேண்டும்.
7. **கண்டுபிடிப்புகளைத் திருப்பி அனுப்புங்கள்** ([module 10](#module-10-gaps)). நீங்கள் எதிர்கொள்ளும் மௌனமான no-ops, API-ஐ வாசிப்பதன் மூலம் வேறு யாராலும் கண்டுபிடிக்க முடியாதவை.

இவற்றை வெளிப்படையாகவும் ஆரம்பத்திலேயும் தீர்மானியுங்கள், ஏனெனில் ஒவ்வொன்றும் திட்டத்தைக் கட்டுப்படுத்துகிறது: உங்களுக்கு உண்மையில் எந்தத் தளங்கள் தேவை (desktop மட்டும் என்பது "iOS-உம் சேர்த்து" என்பதிலிருந்து மிகவும் வேறுபட்ட திட்டம்), உங்களுக்கு visual designer தேவையா (இன்னும் ஒன்று இல்லை), நீங்கள் vendor கட்டுப்பாட்டுத் தொகுப்பு ஒன்றைச் சார்ந்திருக்கிறீர்களா (Telerik-க்கு இணக்க அடுக்கு உள்ளது; மற்ற vendors-க்கு `--map` கோப்பும் கைமுறை வேலையும் தேவை), Windows-க்கு வெளியே உங்களுக்கு அணுகல்தன்மைக் (accessibility) கடப்பாடு உள்ளதா, உங்கள் குறியீட்டுத் தளம் VB-ஆ (dual-build அல்ல, cut-over), உங்கள் பயன்பாட்டில் ஏதாவது நேட்டிவ் உள்ளடக்கத்தை ஹோஸ்ட் செய்கிறதா அல்லது சாளர handles-ஐ வாசிக்கிறதா, மேலும் — உலாவி அல்லது தொலைபேசி head ஒன்று எல்லைக்குள் இருந்தால் — உங்கள் உரையாடல் சாளரங்கள் தொடக்கத்திலிருந்தே async ஆக எழுதப்பட்டுள்ளனவா ([module 6](#module-6-async)).

---

## பின்னிணைப்பு C — குறிப்பு அட்டை
{:#appendix-c}

**தளப் பக்கங்கள்:** [தொடங்குதல்]({{ '/ta/getting-started/' | relative_url }}) ·
[இடம்பெயர்த்தல்]({{ '/ta/migration/' | relative_url }}) ·
[மாதிரிகள்]({{ '/ta/samples/' | relative_url }}) · [தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) ·
[தானியக்கமும் UI சோதனையும்]({{ '/ta/automation/' | relative_url }}) ·
[நேட்டிவ் interop]({{ '/ta/native-interop/' | relative_url }}) · [அடிக்கடி கேட்கப்படும் கேள்விகள்]({{ '/ta/faq/' | relative_url }}) ·
[வலைப்பதிவு]({{ '/ta/blog/' | relative_url }}) · [நேரடி உலாவிக் காட்சியகம்]({{ '/gallery/' | relative_url }})

**Repository-இல் — பயன்பாட்டுக் குழு ஒன்றுக்கு உண்மையில் தேவைப்படும் ஆவணங்கள்:**

| ஆவணம் | எப்போது வாசிக்க வேண்டும் |
|---|---|
| [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) | எந்த உறுப்பையும் நம்பியிருப்பதற்கு முன். அதைத் திறந்தே வைத்திருங்கள் |
| [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) | migrator-ஐ இயக்கும்போது; ஒவ்வொரு உடைக்கும் மாற்றமும் இங்கே ஆவணப்படுத்தப்பட்டுள்ளது |
| [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) | பின்தளம் ஒன்றைத் தேர்ந்தெடுக்கும்போது; தருக்க vs. சாதன அலகுகள்; ஒற்றைக் காட்சி வரிசைகள்; async-உரையாடல் சாளர விதியும் analyzer-உம் |
| [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) | CSS தீம் ஒன்றை எழுதும்போது — முழு மொழியும் அந்த ஒரே பக்கத்தில் உள்ளது |
| [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) | `Observe`/`BindText`/`BindCommand` மூலம் view models-ஐ இணைக்கும்போது |
| [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md) | தொலைபேசி வடிவத் திரை ஒன்றை வடிவமைக்கும்போது — `StackPanel`, `Card`, `RichListBox` |
| [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md) | `RequestAnimationFrame`, tweens, குறைக்கப்பட்ட இயக்கம் (reduced motion), Headless கடிகாரம் |
| [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md) | ஆழமான சோதனை, தனிப்பயன் கட்டுப்பாடுகளின் `IAutomationStateProvider`, MCP server உட்பட |
| [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) | Windows-இல் இரண்டு அடுக்குகளையும் ஒரே process-இல் இயக்கும்போது |
| [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) | நேட்டிவ் உள்ளடக்கம் அல்லது வீடியோவை ஹோஸ்ட் செய்யும்போது |

**மனப்பாடம் செய்யத் தகுந்த கட்டளைகள்:**

```
dotnet new install Majorsilence.Forms.Templates        # ஒருமுறை
dotnet new majorsilenceforms -n MyApp                  # புதிய பயன்பாடு (பகிரப்பட்ட library + desktop head)
dotnet run --project MyApp
dotnet build --configuration Release && dotnet test --configuration Release --no-build
MF_HEADLESS_SCALE=2 dotnet test --configuration Release --no-build   # HiDPI வாயில்
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff   # இடம்பெயர்த்தலின் அளவை மதிப்பிட
majorsilence-migrate MySolution.sln --no-backup        # ஒரு branch-இல் இயக்க
majorsilence-migrate MySolution.sln --dry-run --strict # CI விலகல் வாயில்
dotnet tool install -g Majorsilence.Forms.Mcp          # AI agent ஒன்று பயன்பாட்டை இயக்க அனுமதிக்க (module 8)
dotnet workload install wasm-tools && dotnet publish <YourWasmHead> -c Release -o out
dotnet run --project samples/ThemeStudio               # clone ஒன்றிலிருந்து: நேரடி CSS தீம் editor (பின்னிணைப்பு D)
```

**என்ன மாறுகிறது என்று கேட்கும் எவருக்குமான இரண்டு வரிச் சுருக்கம்:** உங்கள் imports `System.Windows.Forms`-இலிருந்து `Majorsilence.Forms`-க்கும், GDI+-இலிருந்து `Majorsilence.Forms.Drawing`-க்கும் நகர்கின்றன; நீங்கள் ஒரு பின்தள package-ஐச் சேர்க்கிறீர்கள். உங்கள் படிவங்கள், designer கோப்புகள், நிகழ்வு கையாளிகள், வணிக logic அனைத்தும் உங்களுடையவையாகவே இருக்கும்.

---

## பின்னிணைப்பு D — CSS மூலம் உங்கள் பயன்பாட்டுக்குத் தீம் அமைத்தல்
{:#appendix-d}

**விளைவு:** ஒரே கோப்பிலிருந்து முழுப் பயன்பாட்டின் தோற்றத்தையும் மாற்ற உங்களால் முடியும்; தீம் மொழியால் எதை வெளிப்படுத்த முடியும், எதை முடியாது என்பதும், ஒரு விதி தவறாக இருக்கும்போது அதை எப்படிக் கண்டறிவது என்பதும் உங்களுக்குத் தெரிந்திருக்கும்.

framework ஒவ்வொரு பிக்சலையும் தானே வரைவதால் ([module 1](#module-1)), தோற்றம் என்பது OS-இன் விஷயமல்ல, framework-இன் விஷயம் — framework அதை **CSS-இன் சிறிய, கண்டிப்பாக வரையறுக்கப்பட்ட துணைக்கணமாக** வெளிப்படுத்துகிறது. ஒரு தீம் என்பது ஒரு `.css` கோப்பு; முழு மொழியும் ஒரே பக்கத்தில் அடங்குகிறது ([`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md)); அதற்கு வெளியே உள்ள எதையும் parser, வரி, நெடுவரிசை, ஆதரிக்கப்படும் மாற்று ஆகியவற்றுடன் நிராகரிக்கிறது. framework-இன் இந்தப் பகுதியில் வேண்டுமென்றே **மௌனமான no-op எதுவும் இல்லை** — எழுத்துப்பிழையுள்ள property ஒரு பிழை, stub அல்ல. (இந்தப் பின்னிணைப்பு அந்த ஆவணத்துடனும் `ThemeStudio` மாதிரியுடனும் ஒப்பிட்டுச் சரிபார்க்கப்பட்டது; இந்த வழிகாட்டிக்காக இயக்கிப் பார்க்கப்படவில்லை. பழைய `<Theme>` XML வடிவம் இன்னும் வேலை செய்கிறது, CSS-உடன் கலந்தும் பயன்படுத்தலாம்.)

### தீம் ஒன்றை load செய்தல்
{:#appendix-d-load}

**C#**

```csharp
using Majorsilence.Forms;

// ஒரு கோப்பை உடனடியாகப் பிரயோகியுங்கள்:
Theme.LoadFromCssFile ("Themes/ocean.css");

// அல்லது பெயருடன் பதிவுசெய்து, இயங்கும் நேரத்தில் மாற்றுங்கள்:
Theme.RegisterThemeCssFromFile ("Themes/ocean.css");   // கோப்பின் @theme header-இலிருந்து "Ocean" என்பதைத் திருப்புகிறது
Theme.ApplyTheme ("Ocean");
Theme.SetBuiltInTheme (BuiltInTheme.Light);            // உள்ளமைந்த தீமுக்குத் திரும்ப; அனைத்தையும் மீட்டமைக்கிறது

// தற்போதைய தீமிலிருந்து உங்கள் சொந்தத் தீமைத் தொடங்குங்கள்:
File.WriteAllText ("mine.css", Theme.ExportCss ("Mine", "Light"));
```

**VB.NET**

```vb
Imports Majorsilence.Forms

' ஒரு கோப்பை உடனடியாகப் பிரயோகியுங்கள்:
Theme.LoadFromCssFile("Themes/ocean.css")

' அல்லது பெயருடன் பதிவுசெய்து, இயங்கும் நேரத்தில் மாற்றுங்கள்:
Theme.RegisterThemeCssFromFile("Themes/ocean.css")     ' கோப்பின் @theme header-இலிருந்து "Ocean" என்பதைத் திருப்புகிறது
Theme.ApplyTheme("Ocean")
Theme.SetBuiltInTheme(BuiltInTheme.Light)              ' உள்ளமைந்த தீமுக்குத் திரும்ப; அனைத்தையும் மீட்டமைக்கிறது

' தற்போதைய தீமிலிருந்து உங்கள் சொந்தத் தீமைத் தொடங்குங்கள்:
File.WriteAllText("mine.css", Theme.ExportCss("Mine", "Light"))
```

திடீர் மின்னல் (flash) இல்லாமல் இருக்க வேண்டுமென்றால், முதல் படிவம் காட்டப்படுவதற்கு முன் தீமை load செய்யுங்கள்; பின்னர் பிரயோகித்தால் திறந்திருக்கும் அனைத்தும் மீண்டும் வரையப்படும்.

### மொழி, ஒரே உதாரணத்தில்
{:#appendix-d-language}

மூன்று வகைக் கூற்றுகள் — ஒரு header, tokens, கட்டுப்பாட்டு விதிகள் — வேறு எதுவும் இல்லை:

```css
/* Ocean: ஆழ்ந்த நீல-பச்சை இருண்ட தீம். */
@theme "Ocean" extends Dark;             /* உள்ளமைந்த ஒன்றிலிருந்து (Light, Dark, Classic, Aero, …) அல்லது பதிவுசெய்யப்பட்ட எந்தத் தீமிலிருந்தும் தொடங்குங்கள் */

:root {
  --brand: #1e90ff;                      /* உங்கள் சொந்த மாறி, கீழே var() மூலம் குறிப்பிடப்படுகிறது */

  --accent-color: var(--brand);          /* tokens: ஒவ்வொரு Theme property-க்கும் ஒன்று, kebab-case-இல் */
  --background-color: #0a1929;
  --control-mid-color: #102a43;
  --foreground-color: #cfe8ff;
  --foreground-color-on-accent: white;
  --font-size: 14px;                     /* முழுப் பிக்சல்கள் மட்டுமே — pt/em/rem/% பிழைகள் */
  --ui-font: "Segoe UI", "Noto Sans", sans-serif;
}

/* ஒரு விதி ஒரு கட்டுப்பாட்டு வகையை (TYPE) வடிவமைக்கிறது — குறியீட்டில் தன் சொந்த நிறத்தை அமைக்காத, பயன்பாட்டிலுள்ள ஒவ்வொரு Button-ஐயும். */
Button        { border: 1px solid #15395c; border-radius: 4px; box-shadow: 2px 2px #06101c; }
Button:hover  { background-color: var(--brand); color: white; }
Button:active { box-shadow: 0px 0px #06101c; }

TextBox, ComboBox, NumericUpDown { background-color: #061120; border-color: var(--border-low-color); }

/* Parts: ஒரு கட்டுப்பாடு தனக்குள்ளே வரையும் பகுதிகள். */
DataGridView::header    { background-color: #2c2c30; color: #e8e8ea; font-weight: bold; }
DataGridView::selection { background-color: var(--accent-color); color: var(--foreground-color-on-accent); }
ScrollBar::thumb        { background-color: #55555c; border-radius: 4px; }
Menu::item:hover        { background-color: #34343a; }
```

இதைப் பற்றி உங்கள் குழுவுக்குச் சொல்ல வேண்டியவை — ஒவ்வொன்றும் CSS உள்ளுணர்வு தவறாக வழிநடத்தும் இடம்:

- **முதலில் tokens.** `:root` tokens-ஐ மட்டும் அமைத்தாலே ஒவ்வொரு கட்டுப்பாட்டின் *மற்றும்* ஒவ்வொரு part-இன் நிறமும் மாறிவிடும்; இயல்புநிலைகள் நீங்கள் விரும்பியவாறு இல்லாத இடங்களில் மட்டும் கட்டுப்பாட்டு விதிகளைச் சேருங்கள்.
- **Selectors என்பவை கட்டுப்பாட்டு வகைப் பெயர்கள்** (`Button`, `TextBox`, `DataGridView`, மேலும் ஒவ்வொரு Telerik compat கட்டுப்பாடும்). classes இல்லை, ids இல்லை, descendant selectors இல்லை, `*` இல்லை — ஒரு விதி அந்த வகையின் ஒவ்வொரு கட்டுப்பாட்டுக்கும், அது எங்கே இருந்தாலும், பொருந்தும். *ஒரே ஒரு* கட்டுப்பாட்டை வடிவமைக்க, குறியீட்டில் `button.Style.BackgroundColor` (அல்லது WinForms `BackColor`) அமையுங்கள்; WinForms-இல் இருப்பது போலவே **வெளிப்படையான ஒவ்வொரு-கட்டுப்பாட்டு மதிப்புகள் எப்போதும் வெல்லும்**.
- **நான்கு pseudo-classes** (`:hover`, `:active`, `:disabled`, `:focus`), அதுவும் அந்த நிலைக்காக மீண்டும் வரையும் கட்டுப்பாடுகளில் மட்டுமே — இன்று `Button`, `LinkLabel`, `TrackBar`. `TextBox:hover` விளக்கத்துடன் கூடிய பிழை, மௌனமான வெறுமை அல்ல.
- **cascade இல்லை, specificity இல்லை, `!important` இல்லை.** பிந்தைய அறிவிப்புகள் முந்தையவற்றை மாற்றீடு செய்கின்றன. `@import` இல்லை, `@media` இல்லை — இரண்டு தீம்களைப் பதிவுசெய்து, குறியீட்டில் ஒன்றைத் தேர்ந்தெடுங்கள்.
- **Layout-க்குத் தீம் அமைக்க முடியாது.** நிறங்கள், எல்லைகள் (borders), ஆரங்கள் (ஒவ்வொரு மூலைக்கும்), dashed borders, கடின offset `box-shadow`, எழுத்துருக்கள் ஆகியவற்றுக்கு முடியும்; `margin`/`padding` பிழைகள் — அவற்றைக் குறியீட்டில் அமையுங்கள்.
- **Hex alpha கடைசியில் வரும்** (`#rrggbbaa`), XML வடிவத்தின் `#AARRGGBB`-க்கு நேர்மாறாக.

### Theme Studio, மற்றும் உதவியாளர் (assistant) ஒன்றைத் தீம் எழுத அனுமதித்தல்
{:#appendix-d-studio}

`samples/ThemeStudio` (repo-இல் உள்ளது; முன்பே build செய்யப்பட்ட binaries GitHub releases-இல் இணைக்கப்பட்டுள்ளன) ஒரு நேரடி editor: இடப்புறம் CSS, வலப்புறம் தீம் அமைக்கக்கூடிய ஒவ்வொரு கட்டுப்பாடும், கீழே parser-இன் diagnostics; நீங்கள் தட்டச்சு செய்யும்போதே மீண்டும் பிரயோகிக்கப்படுகிறது — Studio-வின் சொந்தச் சாளரத்துக்கும் கூட. ஒரு கோப்பைத் திறந்தால் அது **கண்காணிக்கப்படுகிறது** (watched); ஆகவே அதை உங்கள் சொந்த editor-இல் திருத்தலாம், அல்லது coding assistant ஒன்றைத் திருத்த அனுமதிக்கலாம். அதன் **Copy reference for AI** பொத்தான் முழுமையான token/selector/property குறிப்பை clipboard-இல் வைக்கிறது; அதை "a warm, high-contrast light theme with rounded buttons" போன்ற கோரிக்கையுடன் ஒரு chat-இல் ஒட்டி, பதிலைத் திரும்ப ஒட்டுங்கள். parser ஆட்சேபித்தால், பிழை உரையை உதவியாளரிடம் திரும்ப ஒட்டுங்கள் — ஒவ்வொரு செய்தியும் தவறான உரையையும் மாற்றையும் பெயரிடுகிறது. `--render-headless out.png theme.css` திரை (display) இல்லாமல் முன்னோட்டத்தை வரைந்து, பிழைகள் இருந்தால் பூஜ்ஜியமல்லாத குறியீட்டுடன் வெளியேறுகிறது; இதனால் தீம் கோப்பு CI சரிபார்க்கக்கூடிய ஒன்றாகிறது. `samples/ThemeStudio/Themes/`-இல் ஆறு தொடக்கப் புள்ளிகள் வருகின்றன: `light`/`dark` (பொருந்திய ஜோடி), `ocean`, `graphite`, `paper`, `parchment`.

### குறியீட்டிலிருந்து diagnostics
{:#appendix-d-diagnostics}

உங்கள் பயனர்கள் வழங்கும் தீம் ஒன்றுக்கு, கண்மூடித்தனமாகப் பிரயோகிப்பதற்குப் பதிலாக, அதை நீங்களே parse செய்து சிக்கல்களைக் காட்டுங்கள்:

**C#**

```csharp
var sheet = ThemeStyleSheet.Parse (File.ReadAllText (path));

foreach (var d in sheet.Diagnostics)
    log.WriteLine ($"{d.Severity} ({d.Line}:{d.Column}): {d.Message}");
```

**VB.NET**

```vb
Dim sheet = ThemeStyleSheet.Parse(File.ReadAllText(path))

For Each d In sheet.Diagnostics
    log.WriteLine($"{d.Severity} ({d.Line}:{d.Column}): {d.Message}")
Next
```

### ஒரே sheet, மூன்று toolkits
{:#appendix-d-hosts}

கலப்பு இடம்பெயர்த்தல் பயன்பாட்டில், அதே கோப்பு *மற்றப்* பாதியின் தோற்றத்தையும் மாற்ற முடியும்: `Majorsilence.Forms.Theming.WinForms` அதை உண்மையான `System.Windows.Forms` கட்டுப்பாடுகளுக்குப் பிரயோகிக்கிறது ([module 7](#module-7-c)); `Majorsilence.Forms.Theming.Avalonia` அதை நேட்டிவ் Avalonia Fluent கட்டுப்பாடுகளுக்குப் பிரயோகிக்கிறது (`AvaloniaCssTheme.Apply` / `Watch`); ஒவ்வொன்றுக்கும் ஆவணப்படுத்தப்பட்ட ஆதரவு matrix உண்டு, ஒவ்வொரு இடைவெளியும் diagnostic ஆக அறிவிக்கப்படுகிறது. நீண்ட இடம்பெயர்த்தலின்போது "இது இரண்டு பயன்பாடுகளை ஒன்றாக staple செய்தது போலத் தோன்றும்" என்ற கவலைக்கான பதில் இதுதான்.

**பயிற்சி D.** Light தீமை export செய்யுங்கள் (`Theme.ExportCss`), மூன்று tokens-ஐயும் ஒரு `Button` விதியையும் மாற்றி, தொடக்கத்தில் அதை load செய்யுங்கள். பின்னர் வேண்டுமென்றே `TextBox:hover { color: red; }` என்று எழுதி, parser தரும் பிழையை வாசியுங்கள் — framework-இன் இந்தப் பகுதியின் முழுத் தத்துவமும் அந்த ஒரே செய்தியில் உள்ளது.

---

## பின்னிணைப்பு E — MVVM உதவிகள்
{:#appendix-e}

**விளைவு:** reflection இல்லாமல், trimming மற்றும் NativeAOT-இன் கீழ் பாதுகாப்பான முறையில் view model ஒன்றைப் படிவத்துடன் இணைக்க உங்களால் முடியும்; அதை எப்போது பயன்படுத்தக் *கூடாது* என்பதும் உங்களுக்குத் தெரிந்திருக்கும்.

பகிரப்பட்ட UI library-க்கு மாறும் WinForms குழுக்கள், view models-ஐப் படிவங்களிலிருந்து பிரிக்கும் வாய்ப்பை அடிக்கடி பயன்படுத்துகின்றன. `Control.DataBindings` இங்கே வேலை செய்கிறது, இருவழியானதும் கூட — ஆனால் அது reflection-ஐப் பயன்படுத்துகிறது, அதாவது உங்கள் view-model properties-ஐ trimmer-க்காக root செய்ய வேண்டும். `Majorsilence.Forms.Mvvm` அதற்கான மாற்று: `INotifyPropertyChanged`, `ICommand` மீதான சிறிய extension methods தொகுப்பு; அவை property-ஐ `nameof` மூலம் பெயரிட்டு, lambdas வழியாக வாசித்து எழுதுகின்றன; ஆகவே இயங்கும் நேரத்தில் எதுவும் string மூலம் தேடப்படுவதில்லை. இதற்கு toolkit சார்பு எதுவும் இல்லை; CommunityToolkit.Mvvm மூலம் எழுதப்பட்டது உட்பட எந்த view model-உடனும் வேலை செய்கிறது. ([`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) மற்றும் gallery-இன் `MvvmHelpersPanel` ஆகியவற்றுடன் ஒப்பிட்டுச் சரிபார்க்கப்பட்டது; இந்த வழிகாட்டிக்காக இயக்கிப் பார்க்கப்படவில்லை.)

### நான்கு உதவிகள்
{:#appendix-e-helpers}

**C#**

```csharp
using Majorsilence.Forms.Mvvm;

var scope = new BindingScope ();                        // இந்தப் பக்கம் உருவாக்கும் ஒவ்வொரு subscription-ஐயும் சேகரிக்கிறது

// ஒருவழி: இப்போதே பிரயோகி, அந்த property-க்கான ஒவ்வொரு PropertyChanged-இலும் மீண்டும் பிரயோகி.
viewModel.Observe (nameof (CounterViewModel.Count), vm => vm.Count,
                   count => countLabel.Text = $"Count: {count}").AddTo (scope);

// இருவழி: TextBox.Text <-> ProfileViewModel.Name (BindChecked, BindSelectedIndex, BindValue ஆகியவையும் உள்ளன).
nameBox.BindText (viewModel, nameof (ProfileViewModel.Name),
                  vm => vm.Name, (vm, value) => vm.Name = value).AddTo (scope);

// Commands: Enabled, CanExecute-ஐப் பின்தொடர்கிறது; Click command-ஐ இயக்குகிறது. தனிப்பயனாக வரையப்பட்டவை உட்பட எந்தக் கட்டுப்பாட்டிலும் வேலை செய்கிறது.
incrementButton.BindCommand (viewModel.IncrementCommand).AddTo (scope);

// பக்கத்தை விட்டு வெளியேறும்போது:
scope.Dispose ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Mvvm

Dim scope As New BindingScope()                          ' இந்தப் பக்கம் உருவாக்கும் ஒவ்வொரு subscription-ஐயும் சேகரிக்கிறது

' ஒருவழி: இப்போதே பிரயோகி, அந்த property-க்கான ஒவ்வொரு PropertyChanged-இலும் மீண்டும் பிரயோகி.
viewModel.Observe(NameOf(CounterViewModel.Count), Function(vm) vm.Count,
                  Sub(count) countLabel.Text = $"Count: {count}").AddTo(scope)

' இருவழி: TextBox.Text <-> ProfileViewModel.Name (BindChecked, BindSelectedIndex, BindValue ஆகியவையும் உள்ளன).
nameBox.BindText(viewModel, NameOf(ProfileViewModel.Name),
                 Function(vm) vm.Name, Sub(vm, value) vm.Name = value).AddTo(scope)

' Commands: Enabled, CanExecute-ஐப் பின்தொடர்கிறது; Click command-ஐ இயக்குகிறது. தனிப்பயனாக வரையப்பட்டவை உட்பட எந்தக் கட்டுப்பாட்டிலும் வேலை செய்கிறது.
incrementButton.BindCommand(viewModel.IncrementCommand).AddTo(scope)

' பக்கத்தை விட்டு வெளியேறும்போது:
scope.Dispose()
```

### உதவிகள் உறுதியளிப்பவை — மற்றும் இரண்டு விதிகள்
{:#appendix-e-rules}

- **ஒவ்வொரு push-உம் UI thread-இலேயே வந்து சேர்கிறது.** worker thread-இல் எழுப்பப்பட்ட `PropertyChanged` dispatcher வழியாக post செய்யப்படுகிறது; UI thread-இல் எழுப்பப்பட்டது உடனே பிரயோகிக்கப்படுகிறது, ஆகவே வரிசை காக்கப்படுகிறது. பல மாற்றங்கள் வரிசையில் காத்திருந்தால், ஒவ்வொரு push-உம் இயங்கும்போது *தற்போதைய* மதிப்பையே வாசிக்கிறது; ஆகவே ஒரு கட்டுப்பாடு புதிய மதிப்புக்குப் பின் பழைய மதிப்பை ஒருபோதும் காட்டாது.
- **இருவழி binding caret-ஐத் தொடுவதில்லை.** கட்டுப்பாட்டின் மதிப்பு வேறுபடும்போது மட்டுமே அது எழுதப்படுகிறது; ஒரு திசை பிரயோகிக்கப்படும்போது மற்றது புறக்கணிக்கப்படுகிறது, ஆகவே இரண்டும் மாறி மாறி ping-pong ஆக முடியாது. தெரிந்துகொள்ள வேண்டிய விளைவு: view model தனக்குக் கொடுக்கப்பட்டதை *மீண்டும் எழுதினால்* (trimming, upper-casing), view model தானே ஒரு மாற்றத்தை எழுப்பும் வரை, பயனர் தட்டச்சு செய்ததையே பெட்டி வைத்திருக்கும்.
- **async command ஒன்று தன்னால் இயங்க முடியாது என்று அறிவிக்கும்போது `BindCommand` கட்டுப்பாட்டை முடக்குகிறது** — CommunityToolkit-இன் `AsyncRelayCommand` இயல்பாகவே இதைச் செய்கிறது — கூடுதல் குறியீடு எதுவுமின்றி.
- **விதி 1: ஒரே கட்டுப்பாட்டில் `BindCommand`-ஐ `Button.Command`-உடன் சேர்க்காதீர்கள்.** இரண்டும் command-ஐ இயக்கும், ஆகவே ஒவ்வொரு click-க்கும் அது இருமுறை இயங்கும். ஒன்றை மட்டும் பயன்படுத்துங்கள்.
- **விதி 2: பக்கம் மறையும்போது scope-ஐ dispose செய்யுங்கள்.** `BindingScope` தான் வைத்திருக்கும் அனைத்தையும், கடைசியாகச் சேர்க்கப்பட்டதிலிருந்து தொடங்கி, dispose செய்கிறது; ஆகவே எந்த view-உம் தன்னைவிட நீண்ட காலம் வாழும் view model மீது handler ஒன்றைக் கசியவிடுவதில்லை. `null`/வெற்றுப் பெயருடன் கூடிய `PropertyChanged` என்பது "எல்லாம் மாறியது" என்று பொருள்படும், அது ஒவ்வொரு observation-ஐயும் புதுப்பிக்கிறது.

இன்று இருவழி binding நான்கு கட்டுப்பாடுகளை உள்ளடக்குகிறது: `TextBox`, `CheckBox`, `ComboBox` (தேர்ந்தெடுக்கப்பட்ட index), `NumericUpDown` (கட்டுப்பாடே செய்வது போல, அதன் வரம்புக்குள் கட்டுப்படுத்தப்பட்டது). மற்ற எதுவும் — `TrackBar`, `DateTimePicker`, radio group — ஒரு திசையில் `Observe`-உம் மறு திசையில் கட்டுப்பாட்டின் சொந்த நிகழ்வும், அல்லது `DataBindings`.

### UI thread இல்லாமல் இணைப்பைச் சோதித்தல்
{:#appendix-e-testing}

உதவிகள் விருப்பத்தேர்வான `IUiDispatcher` ஒன்றை (`CheckAccess()` + `Post(Action)`) ஏற்கின்றன. இயல்புநிலை, நீங்கள் UI thread-இல் உள்ளீர்களா என்று செயலிலுள்ள பின்தளத்திடம் கேட்டு, `Application.RunOnUIThread` வழியாக post செய்கிறது. ஒரு சோதனையில், "UI thread-இல் இல்லை" என்று அறிவித்து, தனக்குக் கொடுக்கப்பட்டதை வரிசையில் வைக்கும் போலி (fake) ஒன்றை அனுப்புங்கள் — அப்போது பின்னணி மாற்றம் ஒன்று marshal செய்யப்பட்டது என்பதை உங்கள் சோதனை *நிரூபிக்க* முடியும், தான் தேர்ந்தெடுக்கும் நேரத்தில் வரிசையை இயக்கவும் முடியும். reflection அடிப்படையிலான binding உங்களை எழுத அனுமதிக்கும் எதையும்விட இது வலுவான சோதனை.

**பயிற்சி E.** உங்கள் முன்னோட்ட இடம்பெயர்த்தலிலிருந்து, கையால் எழுதப்பட்ட view-model இணைப்பு (உள்ளே events, வெளியே property அமைப்புகள்) கொண்ட ஒரு படிவத்தை எடுத்து, அதை `BindingScope` ஒன்றுக்குள் `Observe`/`BindText`/`BindCommand` மூலம் மாற்றீடு செய்யுங்கள். நீங்கள் நீக்கிய வரிகளை எண்ணுங்கள்; பின்னர் worker-thread மாற்றம் ஒன்று label-ஐ அடைகிறது என்பதை நிரூபிக்கும், போலி dispatcher கொண்ட ஒரு சோதனையை எழுதுங்கள்.
