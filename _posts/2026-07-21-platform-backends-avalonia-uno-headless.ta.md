---
title: "Platform பின்தளங்கள்: Avalonia, Uno மற்றும் Headless"
date: 2026-07-21 11:00:00 -0000
lang: ta
permalink: /ta/blog/2026/07/21/platform-backends-avalonia-uno-headless/
read_time: "5 நிமிட வாசிப்பு"
excerpt: "Majorsilence.Forms ஒவ்வொரு கட்டுப்பாட்டையும் SkiaSharp மூலம் தானே வரைகிறது — அடியில் உள்ள windowing toolkit ஒரு ஹோஸ்ட் மட்டுமே. இணைப்புக்கோடு (seam) எவ்வாறு செயல்படுகிறது என்பது இதோ."
description: >-
  பல்தள WinForms எவ்வாறு Avalonia, Uno Platform மற்றும் ஒரு headless Skia மேற்பரப்பில் இயங்குகிறது:
  ஒவ்வொரு கட்டுப்பாடும் SkiaSharp மூலம் வரையப்படுகிறது; அடியில் உள்ள windowing toolkit மாற்றக்கூடிய
  ஒரு ஹோஸ்ட் மட்டுமே.
---

Majorsilence.Forms **தனக்குத் தேவையான அனைத்து வரைதலையும் தானே** SkiaSharp மூலம் செய்கிறது. ஒவ்வொரு கட்டுப்பாடும் (control) ஒரு `SKSurface`/`SKCanvas` இல் வரைகிறது; அடியில் உள்ள windowing toolkit ஒரு *ஹோஸ்ட் (host)* மட்டுமே — அது native windows ஐ உருவாக்குகிறது, message loop ஐ இயக்குகிறது, உள்ளீட்டை (input) வழங்குகிறது, மேலும் Skia மேற்பரப்பைத் திரையில் காட்டுகிறது. அந்தப் பிரிப்புதான், இன்று மிகவும் வேறுபட்ட மூன்று toolkits இல் அதே கட்டுப்பாட்டுத் தொகுப்பை இயங்க அனுமதிக்கிறது.

## இணைப்புக்கோடு (seam)
{:#the-seam}

ஒரு ஹோஸ்ட் வழங்க வேண்டிய அனைத்தையும் இரண்டு interfaces வரையறுக்கின்றன:

`IPlatformBackend` பயன்பாட்டு மட்ட சேவைகளை உள்ளடக்குகிறது — dispatcher (`Post`/`Invoke`), timers, clipboard, திரைகளைப் பட்டியலிடுதல் (screen enumeration), மற்றும் modal loop. `IWindowBackend` ஒரு தனி native window ஐ உள்ளடக்குகிறது — அளவும் நிலையும், show/hide/close, cursor, decorations, கோப்பு உரையாடல் சாளரங்கள் (file dialogs). உள்ளீடும் வரைதல் கோரிக்கைகளும் *எதிர்* திசையில் பாய்கின்றன: பின்தளம் window இன் நடுநிலையான `RenderFrame(SKCanvas, …)` மற்றும் `Handle*` methods ஐ நேரடியாக அழைக்கிறது. எந்த platform type உம் — Avalonia type இல்லை, WinUI type இல்லை — மைய Majorsilence.Forms குறியீட்டுக்குள் ஒருபோதும் நுழைவதில்லை.

## இன்று மூன்று பின்தளங்கள்
{:#three-backends-today}

**`Majorsilence.Forms.Avalonia`** இயல்புநிலை — Avalonia 12, எந்த அமைப்பும் இல்லாமல் Windows, macOS மற்றும் Linux desktop ஐ வழங்குகிறது. அதைக் குறிப்பிடுங்கள் (reference), `Application.Run(new MyForm())` அப்படியே வேலை செய்யும். இது desktop க்கு மட்டும் வரையறுக்கப்படவில்லை: Avalonia அதனுடைய சொந்த Android, iOS மற்றும் Browser (WASM) இலக்குகளை வழங்குகிறது; எனவே கீழே உள்ள பிரத்யேக Uno பின்தளத்துடன் சேர்த்து, இதே பின்தளம் mobile மற்றும் web க்கான இரண்டாவது பாதையாகும்.

**`Majorsilence.Forms.Headless`** சாத்தியமான மிக எளிய பின்தளம்; புதிய ஒன்றை எழுதுவதற்கான மேற்கோள் வார்ப்புருவாகவும் (reference template) இது செயல்படுகிறது: work-queue message loop, நினைவகத்திலான (in-memory) clipboard, மெய்நிகர் திரை, மற்றும் offscreen வரைதல். இதற்குக் காட்சித்திரை (display) தேவையில்லை; எனவே unit test தொகுப்பு இதிலேயே இயங்குகிறது, மேலும் CI pixel-diffing க்காக ControlGallery மாதிரியை நேரடியாக ஒரு PNG ஆக வரைய முடியும்:

```
dotnet run --project samples/ControlGallery -- --render-headless out.png 1100 750 --select-row 0
```

**`Majorsilence.Forms.Uno`** Uno Platform இன் Skia renderer ஐ இலக்காகக் கொள்கிறது; ஒரு `SKXamlCanvas` ஐ host செய்து desktop, iOS, Android மற்றும் WebAssembly ஐ எட்டுகிறது. இது macOS இல் முழுமையாக (end-to-end) சரிபார்க்கப்பட்டுள்ளது: Uno ஹோஸ்ட் தொடங்குகிறது, பின்தளம் window ஐ உருவாக்குகிறது, ControlGallery இன் முழு `MainForm` canvas இல் வரையப்படுகிறது. இதற்கு ஒரு interactive session தேவைப்படுவதால், headless CI build மூலம் அல்லாமல், ஒரு பிரத்யேக head திட்டம் (app head) மூலம் இயங்குகிறது — [`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno).

குறிப்பிடத்தக்க ஒரு விவரம்: Uno இல் "window இழுத்தலைத் தொடங்கு" (begin a window drag) என்ற programmatic API இல்லை; எனவே Majorsilence.Forms தானே வரையும் window chrome இன் நகர்த்தல்/அளவு மாற்றம் அதற்குப் பதிலாக declarative முறையில் கையாளப்படுகிறது — ஒரு borderless presenter OS இன் resize ஓரங்களை இலவசமாகத் தக்கவைக்கிறது; Windows desktop head இல் title-bar இழுத்தல் WinUI இன் caption-region API மூலம் செயல்படுகிறது. macOS இல், அதற்குப் பதிலாக native decorations இழுத்தல்/அளவு மாற்றத்தைக் கையாளுகின்றன.

## உங்கள் சொந்தப் பின்தளத்தைச் சேர்த்தல்
{:#adding-your-own}

ஒரு புதிய பின்தளம் இன்னொரு assembly மட்டுமே: மைய `Majorsilence.Forms` ஐயும் உங்கள் toolkit ஐயும் குறிப்பிடுங்கள், `IPlatformBackend` மற்றும் `IWindowBackend` ஐச் செயல்படுத்துங்கள், Avalonia/Headless/Uno மூவரையும் பின்பற்றுங்கள் — platform பின்தளத்தில் dispatcher ஐ இயக்குங்கள், window பின்தளத்தில் ஒரு Skia மேற்பரப்பைக் காட்டி உள்ளீட்டை மொழிபெயருங்கள். முழு interface பட்டியலுக்கு [Platform பின்தளங்கள்]({{ '/ta/backends/' | relative_url }}) பக்கத்தைப் பாருங்கள்.
