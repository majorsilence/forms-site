---
layout: docs
lang: ta
title: தானியக்கமும் UI சோதனையும்
subtitle: ஒரே தானியக்க மரம் — in-process சோதனைகள், Selenium, திரை வாசிப்பான்கள், AI முகவர்களுக்கான MCP சேவையகம் — அதன் மேல் உண்மையான சோதனைத் தொகுப்பை எப்படிக் கட்டுவது. ஒவ்வொரு எடுத்துக்காட்டும் C# மற்றும் VB.NET இரண்டிலும்.
seo_title: "WinForms UI சோதனையும் தானியக்கமும் — Headless CI, Selenium மற்றும் MCP"
description: >-
  பல்தள WinForms பயன்பாட்டை ஒரே தானியக்க மரத்திலிருந்து தானியக்கி சோதியுங்கள்: in-process UI சோதனைகள்,
  headless CI, ஒரு W3C WebDriver சேவையகம், திரை வாசிப்பான்கள் (Windows UIA மற்றும் உலாவி ARIA), மேலும்
  இயங்கும் பயன்பாட்டை AI முகவர்கள் இயக்க அனுமதிக்கும் ஒரு MCP சேவையகம்.
keywords:
  - winforms ui சோதனை
  - winforms ui testing
  - winforms பயன்பாட்டை தானியக்குதல்
  - winforms selenium webdriver
  - headless winforms ci
  - winforms திரை வாசிப்பான் அணுகல்தன்மை
  - mcp
  - ai முகவர் ui சோதனை
priority: "0.8"
permalink: /ta/automation/
---

Majorsilence.Forms ஒரு பின்தளம் (backend) சாராத **தானியக்க மரத்தை (automation tree)** வெளிப்படுத்துகிறது:
இயங்கும் கட்டுப்பாட்டு (control) படிநிலையின் ஒரு snapshot — ids, பெயர்கள், பாத்திரங்கள் (roles), மதிப்புகள், நிலை,
எல்லைகள் (bounds) உடன். இந்தப் பக்கம் அந்த மரத்துக்கான குறிப்பு ஆவணமும், அதன் மேல் **உங்கள்** பயன்பாட்டைச்
சோதிப்பதற்கான நடைமுறை வழிகாட்டியும் ஆகும் — page objects, காத்திருப்புகள், தொழில்துறைக் கருவிகள், காட்சிப்
பின்னடைவுச் சோதனை (visual regression), CI செய்முறைகள், அதே மேற்பரப்பில் AI முகவர்கள் எப்படி இணைகின்றன என்பது.

பயிற்சி வழிகாட்டியின் [Module 8]({{ '/ta/training/' | relative_url }}#module-8) இதன் சுருக்கப் பதிப்பு.

இங்குள்ள அனைத்தும் இதை எழுதும்போது macOS இல் framework இன் தற்போதைய main கிளைக்கு எதிராக இயக்கிப்
பார்க்கப்பட்டது — ஒரு உண்மையான Selenium `RemoteWebDriver` அமர்வு உட்பட. ஏதாவது வேலை செய்யவில்லை என்றால்,
அது வெளிப்படையாகச் சொல்லப்பட்டுள்ளது.

---

## உள்ளடக்கம்
{:#contents}

- [ஒரே மரம், நான்கு நுகர்வோர்](#tree)
- [தனிப்பயனாக வரையப்பட்ட கட்டுப்பாடுகள்: உங்கள் சொந்த மதிப்பையும் நிலையையும் வெளியிடுதல்](#custom-controls)
- [உங்கள் நிலையைத் தேர்ந்தெடுங்கள்](#levels)
- [நான்கு முன்நிபந்தனைகள்](#prerequisites)
- [நிலை 1 — headless பின்தளத்தில் in-process சோதனைகள்](#level-1)
- [`Thread.Sleep` இல்லாமல் காத்திருத்தல்](#waits)
- [Page objects](#page-objects)
- [நிலை 2 — Selenium மற்றும் WebDriver சேவையகம்](#level-2)
- [Inspector மூலம் locators ஐப் பதிவுசெய்தல்](#inspector)
- [நிலை 3 — Windows-native கருவிகள் (FlaUI, WinAppDriver, Appium)](#level-3)
- [Golden images மூலம் காட்சிப் பின்னடைவுச் சோதனை](#visual)
- [BDD: மேலே Reqnroll / SpecFlow](#bdd)
- [CI செய்முறைகள்](#ci)
- [AI கருவிகள் இவை அனைத்துடனும் எப்படி இணைகின்றன](#ai)
- [வரம்புகளும் தவிர்க்க வேண்டிய முறைகளும்](#limits)
- [வரைபாதை (Roadmap)](#roadmap)

---

## ஒரே மரம், நான்கு நுகர்வோர்
{:#tree}

வரைதல் (rendering) பகுதிகள் பயன்படுத்தும் அதே தருக்க எல்லைகளையும் நிலையையுமே இந்த மரம் வாசிக்கிறது; எனவே
headless பின்தளத்திலும் உண்மையான பின்தளங்களிலும் (Avalonia, Uno, GTK 4 மற்றும் பிற — பார்க்க
[தளப் பின்தளங்கள்]({{ '/ta/backends/' | relative_url }})) அது ஒரே மாதிரி நடந்துகொள்கிறது — **Headless க்கு எதிராக
எழுதப்பட்ட சோதனை, Avalonia இல் பயனர் காண்பதையே விவரிக்கிறது.** அந்த ஒரே மாதிரியை நான்கு விஷயங்கள் நுகர்கின்றன:

| நுகர்வோர் | தொகுப்பு (Package) | அது உங்களுக்குத் தருவது |
|---|---|---|
| In-process UI சோதனைகள் | `Majorsilence.Forms.Automation` (core தொகுப்பில்) | பிக்சல் கணக்கு இல்லாமல் C#/VB இலிருந்து படிவத்தை (form) இயக்குதல் |
| தொலைநிலைத் தானியக்கம் | `Majorsilence.Forms.WebDriver` | எந்த Selenium client உம் இயக்கக்கூடிய ஒரு W3C WebDriver சேவையகம் — AI முகவர்களுக்கான [MCP சேவையகம்](#ai-mcp) பேசுவதும் இதனுடன்தான் |
| திரை வாசிப்பான்களும் உருப்பெருக்கிகளும் (Windows) | `Majorsilence.Forms.WindowsUIAutomation` | Windows இல் Narrator / NVDA / JAWS |
| திரை வாசிப்பான்களும் DOM கருவிகளும் (உலாவி) | `net10.0-browser` இல் `Majorsilence.Forms.Avalonia` க்குள் உள்ளமைந்தது | canvas க்கு அருகில் திறந்த படிவங்களின் ஒளிபுகும் ARIA DOM பிரதிபலிப்பு — ஒவ்வொரு கட்டுப்பாட்டுக்கும் role, name, state, bounds, மேலும் live regions ([விவரங்கள்]({{ '/ta/backends/' | relative_url }}#accessibility-dom-browser)) |

இவை ஒவ்வொன்றும் ஒரே விஷயத்தைக் காண்கின்றன, அந்த விஷயம் **உரை (text)**. `session.GetPageSource()` இயங்கும் UI ஐ
XML ஆக வெளியிடுகிறது — அதனால்தான் locators ஐப் பதிவுசெய்ய முடிகிறது, snapshots ஐ diff செய்ய முடிகிறது, ஒரு
பிக்சல் கூட இல்லாமல் [AI முகவர்கள் பயனுள்ளவையாகின்றன](#ai):

```xml
<Form name="Login" role="window" type="Form" x="0" y="0" width="400" height="300">
  <Button id="okButton" name="OK" role="button" type="Button"
          value="" enabled="true" visible="true" x="10" y="10" width="100" height="30" />
  <TextBox id="nameBox" name="Full name" role="textbox" type="TextBox"
           value="" enabled="true" visible="true" x="10" y="50" width="200" height="30" />
</Form>
```

Tag என்பது கட்டுப்பாட்டின் வகை; `id` என்பது `Control.Name`, `name` என்பது அணுகல் பெயர் (accessible name). கீழே உள்ள
ஒவ்வொரு locator உம் பொருத்துவது சரியாக இந்தப் பண்புகளைத்தான்.

**மரத்தில் உள்ள அனைத்தும் கட்டுப்பாடுகள் அல்ல.** Menu items, toolbar பொத்தான்கள், `ListBox` items ஆகியவை child
கட்டுப்பாடுகளாக ஹோஸ்ட் செய்யப்படாமல் அவற்றின் parent ஆல் வரையப்படுகின்றன; எனவே கட்டுப்பாட்டுப் படிநிலையிலிருந்து
மட்டும் கட்டப்பட்ட மரம் strip அல்லது list இலேயே நின்றுவிட்டது — ஒரு `ToolStrip` ஐக் கண்டுபிடிக்க முடிந்தது ஆனால்
அதில் எதையும் click செய்ய முடியவில்லை, அல்லது ஒரு list ஐக் கண்டுபிடிக்க முடிந்தது ஆனால் அதில் எதையும் வாசிக்க
முடியவில்லை. இப்போது அவை தமக்கென சொந்தத் திரை எல்லைகளுடன் தனி nodes ஆக உள்ளன:

```xml
<ListBox id="wordList" name="wordList" role="list" type="ListBox" value="Beta" ... >
  <ListBoxItem id="" name="Alpha" role="listitem" type="ListBoxItem" x="11" y="11" width="258" height="17" />
  <ListBoxItem id="" name="Beta"  role="listitem" type="ListBoxItem" x="11" y="28" width="258" height="17" />
</ListBox>
```

Items பற்றி இரண்டு விஷயங்கள் தெரிந்திருக்க வேண்டும். அவற்றுக்கு **`id` இல்லை** — ஒரு item க்குச் சொந்தமான `Name`
இல்லை, செயற்கையாக உருவாக்கப்பட்ட index ஒன்று list scroll ஆகும்போது மாறிவிடும் — எனவே அவற்றைப் பெயர், உரை அல்லது
XPath மூலம் கண்டறியுங்கள் (`By.Name ("Beta")`, `//*[@role='listitem']`). மேலும் **எந்த item தேர்ந்தெடுக்கப்பட்டுள்ளது
என்பது list இலிருந்து வாசிக்கப்படுகிறது** — அதன் `value` தேர்ந்தெடுக்கப்பட்ட item; ஒரு item இன் சொந்த உரை அதன்
உரையாகவே இருக்கும். பார்வைக்குள் scroll ஆன items மட்டுமே தோன்றும், ஏனெனில் திரைக்கு வெளியே உள்ள item க்கு
click செய்ய ஒரு செவ்வகம் இல்லை.

*Menu மற்றும் toolbar items, list items, அவற்றை click செய்வதற்குப் பின்னால் உள்ள HiDPI hit-test திருத்தம் ஆகியவை
26.0.30 முதல் ஒவ்வொரு வெளியீட்டிலும் உள்ளன — இன்னும் 26.0.30 இல் நிலைப்படுத்தப்பட்ட திட்டம் மட்டுமே strip ஐயும்
list ஐயும் அவற்றின் உள்ளடக்கம் இல்லாமல் காண்கிறது.*

### தனிப்பயனாக வரையப்பட்ட கட்டுப்பாடுகள்: உங்கள் சொந்த மதிப்பையும் நிலையையும் வெளியிடுதல்
{:#custom-controls}

மேலே உள்ள அனைத்தும் உள்ளமைந்த கட்டுப்பாடுகளுக்கு உடனடியாக வேலை செய்யும் — `Button`, `TextBox`, `CheckBox` மற்றும்
பிறவற்றுக்குத் தமது role ஐயும் value ஐயும் எப்படித் தெரிவிப்பது என்று ஏற்கனவே தெரியும். தனிப்பயனாக வரையப்பட்ட
கட்டுப்பாட்டுக்கு (`OnPaint` இல் நீங்களே வரையும் ஒன்று) அப்படிப்பட்ட ஊகிப்பு எதுவும் இல்லை: கூடுதலாக எதுவும்
செய்யாவிட்டால், அது மரத்தில் `""` என்ற மதிப்புடனும் எந்த நிலையும் இல்லாமலும் தோன்றும் — அதன் வகைப் பெயரிலிருந்து
ஊகிக்கப்பட்ட ஒரு role மட்டுமே இருக்கும்.

**Role க்கும் name க்கும் ஏற்கனவே இடம் உண்டு**, எந்தக் கட்டுப்பாட்டுக்கும்: `Control.AccessibleRole` மற்றும்
`Control.AccessibleName` (ஏற்கனவே உள்ள WinForms-compat பண்புகள்) உள்ளமைந்த ஊகிப்புக்கு முன்பே சரிபார்க்கப்படுகின்றன;
எனவே அவற்றை அமைப்பது வேறு எதற்கும் போலவே தனிப்பயன் கட்டுப்பாட்டுக்கும் வேலை செய்யும் — அந்த இரண்டுக்கும் புதிய API
தேவையில்லை.

**Value க்கும் கூடுதல் நிலைக்கும் `IAutomationStateProvider` தேவை.** அதை உங்கள் கட்டுப்பாட்டில் implement செய்தால்,
மரம் ஊகிப்பதற்குப் பதிலாக அதைப் பயன்படுத்தும் — எடுத்துக்காட்டாக, ஒரு நிலை widget காட்டும் level:

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
        ["level"] = Level.ToString (CultureInfo.InvariantCulture),
        ["status"] = Status,
    };

    protected override void OnPaint (PaintEventArgs e) { /* beacon ஐ வரையவும் */ }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation

Public NotInheritable Class BeaconIndicator
    Inherits Control
    Implements IAutomationStateProvider

    Public Property Level As Integer
    Public Property Status As String = "warning"

    Public ReadOnly Property AutomationValue As String Implements IAutomationStateProvider.AutomationValue
        Get
            Return Level.ToString(Globalization.CultureInfo.InvariantCulture)
        End Get
    End Property

    Public ReadOnly Property AutomationState As IReadOnlyDictionary(Of String, String) _
            Implements IAutomationStateProvider.AutomationState
        Get
            Return New Dictionary(Of String, String) From {
                {"level", Level.ToString(Globalization.CultureInfo.InvariantCulture)},
                {"status", Status}
            }
        End Get
    End Property

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        ' beacon ஐ வரையவும்
    End Sub
End Class
```

`AccessibleRole`/`AccessibleName` ஐயும் அமைத்தால், element நான்கையும் கொண்டிருக்கும்:

**C#**

```csharp
var beacon = new BeaconIndicator {
    Name = "workshopBeacon",             // AutomationId
    AccessibleName = "Workshop beacon",  // Name
    AccessibleRole = AccessibleRole.StatusBar,
    Level = 3,
    Status = "alarm",
};
```

**VB.NET**

```vb
Dim beacon As New BeaconIndicator With {
    .Name = "workshopBeacon",             ' AutomationId
    .AccessibleName = "Workshop beacon",  ' Name
    .AccessibleRole = AccessibleRole.StatusBar,
    .Level = 3,
    .Status = "alarm"
}
```

...இது `session.GetPageSource()` இல் உள்ளமைந்த கட்டுப்பாடு போலவே சரியாகத் தோன்றும், கூடுதலாக ஒவ்வொரு entry க்கும்
ஒரு `state-{key}` பண்பு — ஒரு ஒளிபுகா blob ஆக அல்ல, தனித்தனியாக query செய்யக்கூடியவை:

```xml
<BeaconIndicator id="workshopBeacon" name="Workshop beacon" role="statusbar" type="BeaconIndicator"
                 value="3" state-level="3" state-status="alarm"
                 enabled="true" visible="true" x="10" y="10" width="60" height="60" />
```

**C#**

```csharp
session.Find (By.XPath ("//BeaconIndicator[@state-level='3']"));
```

**VB.NET**

```vb
session.Find(By.XPath("//BeaconIndicator[@state-level='3']"))
```

அதே `state-{key}` பெயர் WebDriver இன் `getAttribute` மூலமும் வேலை செய்யும் — page source இலிருந்தோ அல்லது இயங்கும்
`getAttribute` அழைப்பிலிருந்தோ பிடிக்கப்பட்ட locator ஒரே பண்பைக் காண்கிறது. Keys எளிய அடையாளங்காட்டிகளாக
இருக்க வேண்டும் (எழுத்துகள், இலக்கங்கள், `-`/`_`): வழக்கத்துக்கு மாறான key, கட்டுப்பாட்டு வகைப் பெயர் போலவே XML
பண்பின் *பெயருக்காக* சுத்திகரிக்கப்படும் (sanitized), ஆனால் `getAttribute` key ஐ சுத்திகரிக்காமலேயே தேடுகிறது; எனவே
சுத்திகரிப்பு தேவைப்பட்ட key க்கு இரண்டும் ஒத்துப்போகாது.

`AutomationValue` உள்ளமைந்த ஊகிப்பை முழுமையாக மாற்றீடு செய்கிறது, அதனுடன் கலப்பதில்லை — `"true"`/`"false"` வேண்டும்
`CheckBox` போன்ற தனிப்பயன் கட்டுப்பாடு, `ValueOf` இன் சொந்த switch ஐ இலவசமாகப் பெறுவதற்குப் பதிலாக அதைத் தானே
தெரிவிக்க வேண்டும். ஒவ்வொரு உள்ளமைந்த கட்டுப்பாட்டின் `State` உம் காலியாகவே இருக்கும்; ஏற்கனவே உள்ள
கட்டுப்பாடு (interface ஐ implement செய்யாத ஒன்று) தெரிவிப்பதை இங்குள்ள எதுவும் மாற்றுவதில்லை.

அதே நிலை மற்ற நுகர்வோரையும் அடைகிறது: உலாவியில் அது கட்டுப்பாட்டின் ARIA பிரதிபலிப்பு element இல்
`data-mf-state-*` பண்புகளாகத் தோன்றும்; எனவே நீங்கள் தானியக்கக்கூடியதாக்கும் தனிப்பயன் கட்டுப்பாட்டைத் திரை
வாசிப்பானும் விவரிக்க முடியும்.

---

## உங்கள் நிலையைத் தேர்ந்தெடுங்கள்
{:#levels}

உள்நுழைய மூன்று வழிகள், அவை அனைத்தும் *அதே* தானியக்க மரத்தை நுகர்கின்றன — எனவே ஒரு நிலையில் நீங்கள் எழுதும்
locator மற்ற நிலைகளிலும் செல்லுபடியாகும்.

| நிலை | பயன்பாட்டை இயக்குவது எது | display இல்லாமல் இயங்குமா | எதற்குப் பயன்படுத்துவது |
|---|---|---|---|
| **1. In-process** — `AutomationSession` | உங்கள் சோதனைக் குறியீடு, அதே process இல் | **ஆம்** (Headless பின்தளம்) | உங்கள் சோதனைத் தொகுப்பின் பெரும்பகுதி. வேகமானது, debug செய்யக்கூடியது, ports இல்லை, drivers இல்லை. |
| **2. Remote** — `WebDriverServer` + Selenium | எந்த W3C WebDriver client உம், HTTP மூலம் | ஆம் | ஏற்கனவே உள்ள Selenium தொகுப்பை மீண்டும் பயன்படுத்துதல், .NET அல்லாத சோதனை மொழிகள், inspector மூலம் locators ஐப் பதிவுசெய்தல். |
| **3. Windows-native** — UIA bridge | FlaUI, WinAppDriver, Appium, Accessibility Insights | இல்லை (Windows desktop அமர்வு தேவை) | உண்மையான திரை வாசிப்பான் நடத்தையைச் சரிபார்த்தல், உங்கள் Windows QA குழுவிடம் ஏற்கனவே உள்ள கருவிகளால் பயன்பாட்டை இயக்குதல். |

**Coverage க்கு இயல்பாக நிலை 1 ஐயும்**, அணுகல்தன்மைச் சரிபார்ப்புக்கு நிலை 3 ஐயும் பயன்படுத்துங்கள். .NET க்கு
வெளியே உள்ள ஏதாவது பயன்பாட்டை இயக்க வேண்டியிருக்கும்போது நிலை 2 ஐ நாடுங்கள்.

---

## நான்கு முன்நிபந்தனைகள்
{:#prerequisites}

இவற்றைத் தவறாகச் செய்தால், ஒவ்வொரு நிலையும் குழப்பமான வழிகளில் தவறாக நடந்துகொள்ளும்.

### 1. ஒவ்வொரு ஊடாடும் கட்டுப்பாட்டுக்கும் பெயரிடுங்கள்
{:#prerequisites-names}

Locators இரண்டு பண்புகளைச் சார்ந்துள்ளன. `Control.Name` element இன் **AutomationId** ஆகிறது — நிலையான locator.
`Control.AccessibleName` (இல்லையெனில் `Text`, பின்னர் `Name`) அதன் **Name** ஆகிறது.

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

இதை ஒரு review விதியாக்குங்கள். அதே ஒரு keystroke ஒரு சோதனை locator ஐயும் *மற்றும்* திரை வாசிப்பான் ஆதரவையும்
தருகிறது; ஏற்கனவே உள்ள பயன்பாடு முழுவதும் பின்னர் பெயர்களைச் சேர்ப்பதுதான் UI சோதனைகளை ஏற்றுக்கொள்வதில் மிகவும்
சலிப்பூட்டும் ஒரே பகுதி.

### 2. தானியக்குவதற்கு முன் ஒரு layout pass ஐக் கட்டாயப்படுத்துங்கள்
{:#prerequisites-layout}

படிவம் layout ஆகும் வரை எல்லைகளும் hit-testing உம் இருப்பதில்லை. Headless பின்தளத்தில் ஏதாவது ஒரு frame ஐக் கேட்கும்
வரை எதுவும் layout ஆவதில்லை; எனவே ஒரு சோதனை செய்யும் முதல் வேலை ஒருமுறை render செய்வதுதான்:

**C#**

```csharp
using var form = new GreetForm ();
HeadlessRenderer.CapturePng (form, 360, 140);   // layout ஐக் கட்டாயப்படுத்துகிறது; bytes ஐ நிராகரிக்கவும்
```

**VB.NET**

```vb
Using form As New GreetForm()
    HeadlessRenderer.CapturePng(form, 360, 140)   ' layout ஐக் கட்டாயப்படுத்துகிறது; bytes ஐ நிராகரிக்கவும்
End Using
```

இதைத் தவிர்த்தால் `Click` எதன் மீதும் விழாது, ஏனெனில் ஒவ்வொரு கட்டுப்பாட்டின் `Bounds` உம் இன்னும் காலியாக
இருக்கும். `Show()` ஐ அழைக்க வேண்டிய **அவசியமில்லை** — காட்டப்படாத படிவத்தையும் in-process இல் முழுமையாகத்
தானியக்க முடியும்.

### 3. UI சோதனைகளை வரிசையாக (serially) இயக்குங்கள்
{:#prerequisites-serial}

செயலில் உள்ள பின்தளமும் (`Platform.Backend`) `Application.OpenForms` உம் process முழுவதற்கும் பொதுவானவை (global).
அவற்றைப் பகிரும் சோதனைகள் இணையாக இயங்க முடியாது — ஒரு சோதனையில் உள்ள modal உரையாடல் சாளரம் தனது owner ஐ
global open-forms பட்டியலிலிருந்து எடுக்கிறது, மேலும் இன்னொரு சோதனையின் சாளரத்துக்காக என்றென்றும் காத்திருக்கலாம்.

**C# (xUnit)**

```csharp
using Xunit;

// பின்தளமும் Application.OpenForms உம் process முழுவதற்குமான global நிலை.
[assembly: CollectionBehavior (DisableTestParallelization = true)]
```

NUnit: `[assembly: LevelOfParallelism(1)]`, மேலும் `[Parallelizable]` இல்லாமல். MSTest: உங்கள் `.runsettings` இலிருந்து
`<Parallelize>` ஐ விட்டுவிடுங்கள், அல்லது `Workers` ஐ `1` ஆக அமைக்கவும்.

UI அல்லாத சோதனைகளுக்கு இணையாக்கத்தை வைத்திருக்க விரும்பினால், framework இன் சொந்தத் தொகுப்பு செய்வதைச்
செய்யுங்கள்: பின்தளத்தைத் தொடும் ஒவ்வொரு class ஐயும் ஒரே xUnit collection இல் (`[Collection ("Headless")]`)
வையுங்கள் — xUnit அதை வரிசையாக இயக்கும் — மற்றவற்றைச் சுதந்திரமாக விடுங்கள். Framework அந்த மரபை ஒரு சோதனை
மூலம் அமல்படுத்துகிறது
([`HeadlessCollectionConventionTests`]({{ site.github_url }}/blob/main/tests/Majorsilence.Forms.Tests/HeadlessCollectionConventionTests.cs)):
அது compile செய்யப்பட்ட assembly இல் `HeadlessRenderer.Use ()` அழைப்புகளைத் தேடி, attribute இல்லாமல் அந்த அழைப்பைச்
செய்த எந்த class ஐயும் பெயரிட்டுத் தோல்வியடைகிறது — அது அமல்படுத்தப்படுவதற்கு முன் எழுபது கோப்புகள் ஒருமுறை
மரபிலிருந்து விலகியிருந்தன; எனவே இந்த முறையை ஏற்றுக்கொண்டால், அந்தக் காவலையும் நகலெடுங்கள்.

### 4. ஒவ்வொரு assembly க்கும் ஒருமுறை Headless பின்தளத்தை நிறுவுங்கள்
{:#prerequisites-bootstrap}

**C# — module initializer தான் மிகவும் நேர்த்தியான hook**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Backends;
using Majorsilence.Forms.Headless;

internal static class TestBackend
{
    // assembly இல் உள்ள எந்தச் சோதனைக்கும் முன் இயங்கும். Headless பின்தளத்துக்கு UI-thread
    // dispatcher சார்பு இல்லை; அதுவே test runner இன் worker threads இன் கீழ் அதைப் பாதுகாப்பானதாக்குகிறது.
    [ModuleInitializer]
    internal static void Init () => Platform.Backend = new HeadlessPlatformBackend ();
}
```

**VB.NET — VB இல் module initializer இல்லை**

```vb
Imports Majorsilence.Forms.Backends
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBackend
    ' VB <ModuleInitializer> ஐப் பயன்படுத்த முடியாது — VB compiler module initializers ஐ
    ' உருவாக்குவதில்லை; எனவே attribute மட்டும் அமைதியாக எதுவும் செய்யாது, ஒவ்வொரு சோதனையும்
    ' பின்தளம் இல்லாமலேயே இயங்கும். அதற்குப் பதிலாக framework இன் assembly-நிலை hook ஐப் பயன்படுத்துங்கள்:
    ' MSTest <AssemblyInitialize>, NUnit <SetUpFixture> + <OneTimeSetUp>, அல்லது ஒரு
    ' xUnit assembly fixture.
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        Platform.Backend = New HeadlessPlatformBackend()
    End Sub
End Class
```

நீங்கள் விரும்பினால் `HeadlessRenderer.Use ()` உம் இதையே செய்கிறது, தெரிந்திருக்க வேண்டிய ஒரு கூடுதல் நடத்தையுடன்:
Headless பின்தளம் ஏற்கனவே செயலில் இல்லையெனில் அதை நிறுவுவதோடு, **ஒவ்வொரு அழைப்பும் அழைக்கும் thread ஐ Headless
பின்தளத்தின் UI thread ஆக்குகிறது**. Test runner இன் கீழ் இது முக்கியம், ஏனெனில் அது ஒவ்வொரு சோதனையையும்
அப்போது காலியாக உள்ள worker thread க்குக் கொடுக்கிறது: `Application.RunOnUIThread` உம் பின்தளத்தின் வரிசையும் (queue)
"நான் UI thread இல் இருக்கிறேனா?" என்பதை thread id மூலம் தீர்மானிக்கின்றன; எனவே முதன்முதலில் கேட்ட thread ஐ மட்டும்
நினைவில் வைத்திருக்கும் பின்தளம், பின்வரும் ஒவ்வொரு சோதனையின் வேலையையும் off-thread என்று கருதும். ஆகவே
framework இன் சொந்தத் தொகுப்பு assembly க்கு ஒருமுறை அல்லாமல் ஒவ்வொரு சோதனையின் தொடக்கத்திலும்
`HeadlessRenderer.Use ()` ஐ அழைக்கிறது — உங்கள் சோதனைகள் வேலையை UI thread க்குத் திருப்பி அனுப்பினால் (marshal)
நகலெடுக்கத் தகுந்த மலிவான பழக்கம்.

> **UI சோதனைகளை Avalonia பின்தளத்தில் இயக்காதீர்கள்.** Avalonia இன் dispatcher ஒரு thread உடன் கட்டுண்டது, அது
> test runner இன் worker threads உடன் முரண்படுகிறது. உங்கள் தொகுப்புக்கு display *அல்லது* UI thread தேவைப்படாமல்
> இருக்கவே Headless பின்தளம் உள்ளது — அதனால்தான் framework இன் சொந்தத் தொகுப்பு அதில் இயங்குகிறது.

---

## நிலை 1 — headless பின்தளத்தில் in-process சோதனைகள்
{:#level-1}

API ஒரே அமர்வில் கற்றுக்கொள்ளும் அளவுக்குச் சிறியது.

| அழைப்பு | செய்வது |
|---|---|
| `new AutomationSession (form)` | ஒரு படிவத்தை (அல்லது எந்த `WindowBase` ஐயும்) சுற்றிக்கொள்கிறது |
| `session.Find (by)` / `FindOrThrow (by)` / `FindAll (by)` | ஒவ்வொரு முறையும் ஒரு **புதிய** snapshot ஐ query செய்கிறது |
| `By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` | Locators |
| `session.Click (element)` | உண்மையான உள்ளீட்டுப் pipeline மூலம் அழுத்துகிறது |
| `session.SendKeys (element, text)` | Focus + தட்டச்சு |
| `session.PressKey (Keys.Enter)` | focus இல் உள்ள கட்டுப்பாட்டுக்கு ஒரு தனி விசை |
| `session.Clear (element)` | திருத்தக்கூடிய கட்டுப்பாட்டைக் காலியாக்குகிறது |
| `session.GetText (element)` | value/text ஐ வாசிக்கிறது |
| `session.Root` / `session.GetPageSource ()` | முழு மரமும் objects ஆக / XML ஆக |

Elements வெளிப்படுத்துபவை: `AutomationId`, `Name`, `Role`, `ControlType`, `Value`, `State` (தனிப்பயனாக வரையப்பட்ட
கட்டுப்பாட்டின் சொந்தக் கூடுதல் நிலை — [மேலே](#custom-controls) பார்க்க; ஒவ்வொரு உள்ளமைந்த கட்டுப்பாட்டுக்கும் காலி),
`Enabled`, `Visible`, `Focused`, `Bounds`, `Children`, `ClickPoint`, மற்றும் `Descendants()`.

> **`AutomationElement` என்பது மாற்ற முடியாத snapshot — வாசிப்பதற்கு முன் மீண்டும் resolve செய்யுங்கள்.** எல்லோரும்
> சிக்கும் ஒரே gotcha இதுதான், அது சமச்சீரற்றது: முன்பு பிடிக்கப்பட்ட element மீதான *செயல்கள்* சரியாக வேலை செய்யும்
> (`Click`/`SendKeys` இயங்கும் கட்டுப்பாட்டுக்குச் செல்கின்றன), ஆனால் *வாசிப்புகள்* பிடிக்கப்பட்ட நேரத்தின் நிலையையே
> தருகின்றன.
>
> ```csharp
> var box = session.FindOrThrow (By.Id ("nameBox"));
> session.SendKeys (box, "Ada");          // வேலை செய்கிறது — செயல் இயங்கும் கட்டுப்பாட்டை அடைகிறது
> session.GetText (box);                  // "" — இந்த snapshot தட்டச்சுக்கு முந்தையது
> session.GetText (session.FindOrThrow (By.Id ("nameBox")));   // "Ada" — புதிய snapshot
> ```
>
> எனவே: விரும்பினால் செயல்களுக்காகப் பிடித்து வைத்துக்கொள்ளுங்கள், ஆனால் `GetText`, `Enabled`, `Visible`, `Value`,
> `Bounds` க்கு எப்போதும் மீண்டும் `Find` செய்யுங்கள். [கீழே உள்ள page-object முறை](#page-objects) locators ஐ
> *properties* ஆக வெளிப்படுத்துவதன் மூலம் இதைத் தானாகவே செய்கிறது.

ஒரு முழுமையான சோதனை:

**C#**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;
using Xunit;

public class GreetFormTests
{
    [Fact]
    public void Entering_a_name_and_pressing_OK_accepts_the_dialog ()
    {
        using var form = new GreetForm ();
        HeadlessRenderer.CapturePng (form, 360, 140);        // layout pass

        var session = new AutomationSession (form);

        session.SendKeys (session.FindOrThrow (By.Id ("nameBox")), "Ada Lovelace");
        Assert.Equal ("Ada Lovelace", session.GetText (session.FindOrThrow (By.Id ("nameBox"))));

        session.Click (session.FindOrThrow (By.Id ("okButton")));

        Assert.Equal (DialogResult.OK, form.DialogResult);
    }

    [Fact]
    public void OK_is_disabled_until_a_name_is_entered ()
    {
        using var form = new GreetForm ();
        HeadlessRenderer.CapturePng (form, 360, 140);

        var session = new AutomationSession (form);

        // உங்கள் சொந்த field references மீது அல்ல, மரத்திலிருந்து வாசித்த நிலை மீது assert செய்யுங்கள்.
        Assert.False (session.FindOrThrow (By.Id ("okButton")).Enabled);
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
            HeadlessRenderer.CapturePng(form, 360, 140)      ' layout pass

            Dim session As New AutomationSession(form)

            session.SendKeys(session.FindOrThrow(By.Id("nameBox")), "Ada Lovelace")
            Assert.AreEqual("Ada Lovelace",
                            session.GetText(session.FindOrThrow(By.Id("nameBox"))))

            session.Click(session.FindOrThrow(By.Id("okButton")))

            Assert.AreEqual(DialogResult.OK, form.DialogResult)
        End Using
    End Sub
End Class
```

`Click` உம் `SendKeys` உம் ஒரு உண்மையான பின்தளம் பயன்படுத்தும் அதே நடுநிலை உள்ளீட்டுப் பாதை வழியாகச் செல்கின்றன;
எனவே அவை உண்மையான routing, focus, layout ஆகியவற்றைச் சோதிக்கின்றன — சோதனைக்கு மட்டுமான குறுக்குவழியை அல்ல.
அதுவே headless assertion ஐ அர்த்தமுள்ளதாக்குகிறது.

### நிலையான id இல்லாதபோது, XPath
{:#level-1-xpath}

`By.XPath`, `GetPageSource()` தரும் அதே XML மீது இயங்குகிறது; எனவே நீங்கள் காண்பதையே பொருத்த முடியும்:

**C#**

```csharp
session.Find    (By.XPath ("//Button[@id='okButton']"));
session.Find    (By.XPath ("//TextBox[@name='Full name']"));
session.FindAll (By.XPath ("//Panel//Button"));
session.Find    (By.XPath ("(//Button)[2]"));
```

**VB.NET**

```vb
session.Find(By.XPath("//Button[@id='okButton']"))
session.Find(By.XPath("//TextBox[@name='Full name']"))
session.FindAll(By.XPath("//Panel//Button"))
session.Find(By.XPath("(//Button)[2]"))
```

Elements ஐத் தேர்ந்தெடுக்கும் expressions மட்டுமே — positions, attribute predicates, descendant axis அனைத்தும் வேலை
செய்யும்.

### ஒரு gesture தேவைப்படும்போது, கீழ்நிலை உள்ளீடு
{:#level-1-input}

`AutomationSession` click மற்றும் தட்டச்சை உள்ளடக்குகிறது. Drags, wheel scrolling, அல்லது ஒரு நகர்வு முழுவதும் அழுத்திப்
பிடித்திருப்பது போன்றவற்றுக்கு, ஒரு நிலை கீழே `HeadlessRenderer` க்குச் செல்லுங்கள் — அது சாளர ஆயத்தொலைவுகளில்
(window coordinates) உள்ளீட்டைச் செலுத்துகிறது:

**C#**

```csharp
HeadlessRenderer.MouseDown (form, 40, 60);
HeadlessRenderer.MouseMove (form, 120, 60, MouseButtons.Left);
HeadlessRenderer.MouseUp   (form, 120, 60);

HeadlessRenderer.KeyDown   (form, Keys.Control | Keys.A);
HeadlessRenderer.TextInput (form, "typed text");
```

**VB.NET**

```vb
HeadlessRenderer.MouseDown(form, 40, 60)
HeadlessRenderer.MouseMove(form, 120, 60, MouseButtons.Left)
HeadlessRenderer.MouseUp(form, 120, 60)

HeadlessRenderer.KeyDown(form, Keys.Control Or Keys.A)
HeadlessRenderer.TextInput(form, "typed text")
```

இங்குள்ள ஆயத்தொலைவுகள் **தருக்க அலகுகள்**, renderer அவற்றை உங்களுக்காகச் சாதனப் பிக்சல்களாக மாற்றுகிறது — அதனால்தான்
அதே சோதனையை `MF_HEADLESS_SCALE=2` இல் இயக்கும்போதும் இவை வேலை செய்கின்றன; அது framework இன் சொந்த CI தனது நான்கு
வடிவங்களில் ஒன்றாக இயக்கும் உருவகப்படுத்தப்பட்ட HiDPI gate (Debug, Release, `MF_FORCE_CUSTOM_CHROME=1`, மற்றும்
`MF_FORCE_CUSTOM_CHROME=1 MF_HEADLESS_SCALE=2`). உங்கள் தொகுப்பையும் அதன் கீழ் இயக்குங்கள்; தருக்க-அலகு மற்றும்
சாதனப் பிக்சல் குழப்பம் scale 1 இல் கண்ணுக்குத் தெரியாது.

---

## `Thread.Sleep` இல்லாமல் காத்திருத்தல்
{:#waits}

**உள்ளமைந்த implicit wait எதுவும் இல்லை**, in-process சோதனைகளுக்கு அதுவே சரியான இயல்புநிலை: உங்கள் பயன்பாடு
அப்படிச் செய்யாத வரை எதுவும் ஒத்திசைவற்றது (asynchronous) அல்ல. ஆனால் உங்கள் குறியீடு பின்னணி thread இல் வேலை
செய்து `Application.RunOnUIThread` மூலம் திருப்பி அனுப்பும் அந்தக் கணத்திலேயே, நீங்கள் தூங்குவதற்குப் (sleep) பதிலாக
pump செய்து poll செய்ய வேண்டும்.

இதை ஒருமுறை எழுதி எல்லா இடங்களிலும் பயன்படுத்துங்கள்:

**C#**

```csharp
using System.Diagnostics;
using Majorsilence.Forms.Backends;
using Majorsilence.Forms.Automation;

public static class Wait
{
    public static AutomationElement For (AutomationSession session, By by, int timeoutMs = 2000)
        => Until (() => session.Find (by), timeoutMs, $"no element matched {by.Description}");

    public static T Until<T> (Func<T?> probe, int timeoutMs, string message) where T : class
    {
        var clock = Stopwatch.StartNew ();

        do {
            var hit = probe ();
            if (hit is not null)
                return hit;

            // மீண்டும் probe செய்வதற்கு முன், வரிசையில் உள்ள வேலையை (timers, RunOnUIThread callbacks) இயங்க விடுங்கள்.
            Platform.Backend.DoEvents ();
            Thread.Sleep (10);
        } while (clock.ElapsedMilliseconds < timeoutMs);

        throw new TimeoutException ($"Timed out after {timeoutMs}ms: {message}");
    }
}
```

**VB.NET**

```vb
Imports System.Diagnostics
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Backends

Public Module Wait

    Public Function ForElement(session As AutomationSession, by As By,
                               Optional timeoutMs As Integer = 2000) As AutomationElement
        Return Until(Function() session.Find(by), timeoutMs,
                     $"no element matched {by.Description}")
    End Function

    Public Function Until(Of T As Class)(probe As Func(Of T), timeoutMs As Integer,
                                        message As String) As T
        Dim clock = Stopwatch.StartNew()

        Do
            Dim hit = probe()
            If hit IsNot Nothing Then Return hit

            ' மீண்டும் probe செய்வதற்கு முன், வரிசையில் உள்ள வேலையை (timers, RunOnUIThread callbacks) இயங்க விடுங்கள்.
            Platform.Backend.DoEvents()
            Thread.Sleep(10)
        Loop While clock.ElapsedMilliseconds < timeoutMs

        Throw New TimeoutException($"Timed out after {timeoutMs}ms: {message}")
    End Function
End Module
```

பிறகு: `Wait.For (session, By.Id ("resultsGrid"))`, அல்லது
`Wait.Until (() => session.GetText (label) == "Done" ? label : null, 5000, "label never said Done")`.

**ஒருபோதும் `Thread.Sleep` ஐ மட்டும் பயன்படுத்தாதீர்கள்.** `DoEvents()` இல்லாமல் வரிசையில் உள்ள callback ஒருபோதும்
இயங்காது; எனவே வெறும் sleep சோதனையை மெதுவாக்குகிறது *மேலும்* அது தொடர்ந்து தோல்வியடைகிறது.

---

## Page objects
{:#page-objects}

200 சோதனைகள் முழுவதும் சிதறிக் கிடக்கும் `By.Id ("okButton")` தான் UI தொகுப்புகளைப் பராமரிப்பதைச் செலவுமிக்கதாக்குகிறது.
ஒவ்வொரு திரையையும் ஒருமுறை சுற்றி வையுங்கள் (wrap).

**C#**

```csharp
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

public sealed class GreetPage
{
    private readonly AutomationSession session;

    public GreetPage (GreetForm form)
    {
        HeadlessRenderer.CapturePng (form, 360, 140);   // layout pass, ஒருமுறை, இங்கே
        session = new AutomationSession (form);
    }

    // Locators சரியாக ஒரே இடத்தில் இருக்கின்றன.
    private AutomationElement NameBox => session.FindOrThrow (By.Id ("nameBox"));
    private AutomationElement Ok      => session.FindOrThrow (By.Id ("okButton"));
    private AutomationElement Cancel  => session.FindOrThrow (By.Id ("cancelButton"));

    // Methods, clicks ஆக அல்லாமல் பயனரின் நோக்கமாக வாசிக்கப்படுகின்றன.
    public GreetPage EnterName (string name)
    {
        session.Clear (NameBox);
        session.SendKeys (NameBox, name);
        return this;
    }

    public void Accept () => session.Click (Ok);
    public void Dismiss () => session.Click (Cancel);

    public string EnteredName => session.GetText (NameBox);
    public bool CanAccept => Ok.Enabled;
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Headless

Public NotInheritable Class GreetPage
    Private ReadOnly session As AutomationSession

    Public Sub New(form As GreetForm)
        HeadlessRenderer.CapturePng(form, 360, 140)     ' layout pass, ஒருமுறை, இங்கே
        session = New AutomationSession(form)
    End Sub

    Private ReadOnly Property NameBox As AutomationElement
        Get
            Return session.FindOrThrow(By.Id("nameBox"))
        End Get
    End Property

    Private ReadOnly Property Ok As AutomationElement
        Get
            Return session.FindOrThrow(By.Id("okButton"))
        End Get
    End Property

    Public Function EnterName(name As String) As GreetPage
        session.Clear(NameBox)
        session.SendKeys(NameBox, name)
        Return Me
    End Function

    Public Sub Accept()
        session.Click(Ok)
    End Sub

    Public ReadOnly Property EnteredName As String
        Get
            Return session.GetText(NameBox)
        End Get
    End Property

    Public ReadOnly Property CanAccept As Boolean
        Get
            Return Ok.Enabled
        End Get
    End Property
End Class
```

Locators **fields ஆக அல்ல, properties ஆக** இருப்பது முக்கியம்: `Find` ஒவ்வொரு அழைப்பிலும் புதிய snapshot ஐ query
செய்கிறது; எனவே UI மாறிய பிறகு property மீண்டும் resolve ஆகிறது, ஆனால் cache செய்யப்பட்ட field பழையதாகிவிடுகிறது.

அப்போது சோதனை நடத்தையாக வாசிக்கப்படுகிறது:

**C#**

```csharp
using var form = new GreetForm ();
var page = new GreetPage (form);

Assert.False (page.CanAccept);
page.EnterName ("Ada Lovelace").Accept ();
Assert.Equal (DialogResult.OK, form.DialogResult);
```

**VB.NET**

```vb
Using form As New GreetForm()
    Dim page As New GreetPage(form)

    Assert.IsFalse(page.CanAccept)
    page.EnterName("Ada Lovelace").Accept()
    Assert.AreEqual(DialogResult.OK, form.DialogResult)
End Using
```

---

## நிலை 2 — Selenium மற்றும் WebDriver சேவையகம்
{:#level-2}

`Majorsilence.Forms.WebDriver` loopback இல் HTTP மூலம் ஒரு **W3C WebDriver** endpoint ஐ ஹோஸ்ட் செய்கிறது. WebDriver
என்பது வெறும் HTTP மற்றும் JSON என்பதால், எந்த மொழியிலும் உள்ள எந்த client உம் உங்கள் desktop பயன்பாட்டை இயக்க
முடியும் — உங்கள் web குழு ஏற்கனவே பயன்படுத்தும் Selenium bindings உட்பட.

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

using var server = new WebDriverServer (form, port: 4444);
server.Start ();

Console.WriteLine (server.Url);      // http://127.0.0.1:4444/  (loopback மட்டும்)

// … அதை இயக்குங்கள் …

server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Using server As New WebDriverServer(form, port:=4444)
    server.Start()

    Console.WriteLine(server.Url)    ' http://127.0.0.1:4444/  (loopback மட்டும்)

    ' … அதை இயக்குங்கள் …

    server.Stop()
End Using
```

**ஆதரிக்கப்படும் கட்டளைகள்:** new/delete session, find element(s), click, send keys, clear, get text, get name
(role), get attribute, get rect, get enabled, **page source** (`GET …/source`, XML), screenshot (PNG, offscreen
renderer வழியாக), மற்றும் `GET /status`.

தெரிந்திருக்க வேண்டிய ஒரு சமச்சீரின்மை: மேலே உள்ள அனைத்தும் எந்தப் பின்தளத்திலும் உள்ள சாளரத்துக்கு எதிராக வேலை
செய்யும், ஆனால் **screenshots Headless இல் மட்டுமே**. `GET …/screenshot`, `HeadlessRenderer` வழியாக render செய்கிறது;
அது தான் ஹோஸ்ட் செய்யாத சாளரத்தை மறுக்கிறது — Avalonia பின்தளத்தில் உள்ள desktop பயன்பாட்டை நோக்கிச் சுட்டினால்,
அது `Window is not hosted on the Headless backend` என்று பதிலளிக்கும். அதற்குப் பதிலாக மரத்தை வாசியுங்கள்;
screenshots ஐ headless சோதனை ஓட்டத்தில் எடுங்கள் — [golden images](#visual) எப்படியும் அங்கேதான் இருக்கின்றன.

**Locator உத்திகள்:** `id`, `name`, `tag name` (role), `xpath`, `css selector` (`#id` மற்றும் `[name='…']` வடிவங்கள்),
மேலும் தனிப்பயன் `role`, `type`, `link text`. Element references ஒவ்வொரு பயன்பாட்டிலும் புதிய snapshot க்கு எதிராக
மீண்டும் resolve ஆகின்றன, நிலையான AutomationId க்கு முன்னுரிமை கொடுத்து — எனவே UI அதன் கீழ் மாறிய பிறகும் ஒரு
reference செல்லுபடியாகவே இருக்கும்.

### உண்மையான Selenium client மூலம் இயக்குதல்
{:#level-2-selenium}

Element செயல்கள் UI thread க்கு marshal செய்யப்படுகின்றன; எனவே message loop இல்லாத சோதனையில், HTTP அழைப்புகள் ஒரு
worker இல் இயங்கும்போது நீங்கள் main thread இல் வரிசையை pump செய்கிறீர்கள். Framework இன் சொந்தச் சோதனைகள்
பயன்படுத்தும் முறை இதுதான், நகலெடுக்க வேண்டியதும் இதுதான்:

**C#**

```csharp
using System.Net;
using System.Net.Sockets;
using Majorsilence.Forms.WebDriver;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using MFPlatform = Majorsilence.Forms.Backends.Platform;   // கீழே உள்ள gotcha ஐப் பார்க்கவும்

static int FreePort ()
{
    var listener = new TcpListener (IPAddress.Loopback, 0);
    listener.Start ();
    var port = ((IPEndPoint) listener.LocalEndpoint).Port;
    listener.Stop ();
    return port;                                   // CI இல் 4444 ஐ ஒருபோதும் hard-code செய்யாதீர்கள்
}

static T RunPumped<T> (Func<T> work)
{
    var task = Task.Run (work);
    while (!task.IsCompleted) {
        MFPlatform.Backend.DoEvents ();            // இந்த thread இல் pump செய்யவும்
        Thread.Sleep (5);
    }
    return task.GetAwaiter ().GetResult ();
}

[Fact]
public void Selenium_can_drive_the_form ()
{
    using var form = new GreetForm ();
    HeadlessRenderer.CapturePng (form, 360, 140);

    using var server = new WebDriverServer (form, FreePort ());
    server.Start ();

    var typed = RunPumped (() => {
        var driver = new RemoteWebDriver (server.Url,
            new ChromeOptions ().ToCapabilities (), TimeSpan.FromSeconds (30));
        try {
            driver.FindElement (By.CssSelector ("#okButton")).Click ();
            driver.FindElement (By.Name ("nameBox")).SendKeys ("Ada Lovelace");
            return driver.FindElement (By.CssSelector ("#nameBox")).Text;
        } finally {
            driver.Quit ();
        }
    });

    Assert.Equal ("Ada Lovelace", typed);
}
```

**VB.NET**

```vb
Imports System.Net
Imports System.Net.Sockets
Imports Majorsilence.Forms.WebDriver
Imports OpenQA.Selenium
Imports OpenQA.Selenium.Chrome
Imports OpenQA.Selenium.Remote
Imports MFPlatform = Majorsilence.Forms.Backends.Platform

Private Shared Function FreePort() As Integer
    Dim listener As New TcpListener(IPAddress.Loopback, 0)
    listener.Start()
    Dim port = CType(listener.LocalEndpoint, IPEndPoint).Port
    listener.Stop()
    Return port
End Function

Private Shared Function RunPumped(Of T)(work As Func(Of T)) As T
    Dim task = Threading.Tasks.Task.Run(work)
    While Not task.IsCompleted
        MFPlatform.Backend.DoEvents()
        Threading.Thread.Sleep(5)
    End While
    Return task.GetAwaiter().GetResult()
End Function
```

மூன்று gotchas — அனைத்தும் உண்மையில் இயக்கிப் பார்த்தபோது கண்டறியப்பட்டவை:

1. **`Platform` தெளிவற்றது.** `Majorsilence.Forms.Backends.Platform`, `OpenQA.Selenium.Platform` உடன் மோதுகிறது —
   இரண்டு namespaces ஐயும் import செய்த அந்தக் கணமே CS0104. மேலே உள்ளது போல ஒன்றுக்கு alias கொடுங்கள்.
2. **`GetAttribute` அல்ல, `GetDomAttribute` ஐப் பயன்படுத்துங்கள்.** Selenium 4 இன் பழைய `GetAttribute`,
   `/session/{id}/execute/sync` வழியாக ஒரு JavaScript atom ஐ இயக்குகிறது; native பயன்பாட்டில் அதற்கு இணையானது
   இல்லை — அது `NotImplementedException` ஐ எறிகிறது. `GetDomAttribute` சாதாரண `/attribute/{name}` endpoint ஐ
   அழைக்கிறது, அது implement செய்யப்பட்டுள்ளது, மேலும் `id`, `name`, `role`, `type`, `value`, `enabled`, `visible`,
   எல்லைகள் ஆகியவற்றைத் தருகிறது.
3. **`By.CssSelector ("#id")` மற்றும் `By.XPath` க்கு முன்னுரிமை கொடுங்கள்.** Selenium இன் .NET client `By.Name` க்கு
   `using: "name"` ஐ அனுப்புவதில்லை — அதை `*[name ="x"]` என்ற CSS selector ஆக மாற்றி எழுதுகிறது. அந்த வடிவம்
   ஏற்றுக்கொள்ளப்படுகிறது, ஆனால் `By.CssSelector ("#okButton")` உம் XPath உம்தான் மிகக் குறைவான ஆச்சரியம் தரும்
   தேர்வுகள். JavaScript தேவைப்படும் எதுவும் (`ExecuteScript`, அதன் மேல் கட்டப்பட்ட implicit waits) வடிவமைப்பின்படியே
   கிடைக்காது.

### அல்லது bindings ஐ முழுவதுமாகத் தவிர்த்துவிடுங்கள்
{:#level-2-http}

ஒரு smoke test க்கு — அல்லது Selenium நிறுவப்படாத ஒரு மொழியிலிருந்து — மூல protocol மூன்று அழைப்புகள் மட்டுமே:

```bash
SID=$(curl -s -XPOST 127.0.0.1:4444/session -d '{}' | jq -r .value.sessionId)

curl -s 127.0.0.1:4444/session/$SID/source                       # XML மரம்
curl -s -XPOST 127.0.0.1:4444/session/$SID/element \
     -d '{"using":"css selector","value":"#okButton"}'            # கண்டுபிடி
curl -s -XPOST 127.0.0.1:4444/session/$SID/element/$EID/click -d '{}'
```

Python, framework பற்றி எந்த அறிவும் இல்லாமல்:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Remote("http://127.0.0.1:4444", options=webdriver.ChromeOptions())
print(driver.page_source)                          # XML மரம்
driver.find_element(By.CSS_SELECTOR, "#okButton").click()
driver.quit()
```

Capabilities புறக்கணிக்கப்படுகின்றன — சேவையகம் எப்போதும் ஒரு அமர்வை வழங்குகிறது; எனவே உங்கள் client க்குத்
தேவையானதை அனுப்புங்கள்.

---

## Inspector மூலம் locators ஐப் பதிவுசெய்தல்
{:#inspector}

சேவையகம் XML **page source** ஐயும் *மற்றும்* சரியாக அந்த source க்கு எதிராக மதிப்பிடப்படும் ஒரு `xpath` உத்தியையும்
வெளிப்படுத்துவதால், Appium பாணியிலான எந்த inspector உம் இயங்கும் element மரத்தை ஒரு screenshot மீது வரைந்து, nodes
ஐ click செய்வதன் மூலம் locators ஐப் பிடிக்க அனுமதிக்கும். Inspector பயன்படுத்தும் சுழற்சி, சேவையகம் implement செய்யும்
மூன்று கட்டளைகள் மட்டுமே:

| படி | கட்டளை | தருவது |
|---|---|---|
| மரத்தின் snapshot | `GET /session/{id}/source` | XML ([மேலே உள்ள மாதிரியைப்](#tree) பார்க்கவும்) |
| UI ஐக் காட்டுதல் | `GET /session/{id}/screenshot` | base64 PNG |
| ஒரு locator ஐ உறுதிப்படுத்துதல் | `POST /session/{id}/element` + `…/attribute/{name}` | element / அதன் பண்புகள் |

பரிந்துரைக்கப்படும் பதிவுப் பாதை இதுதான்: Selenium IDE உலாவிக்குள் DOM நிகழ்வுகளைப் பதிவுசெய்கிறது, அதற்கு ஒரு native
பயன்பாட்டுடன் இணைய எந்த வழியும் இல்லை.

| அமைப்பு | மதிப்பு |
|---|---|
| Remote Host | `127.0.0.1` |
| Remote Port | `WebDriverServer` க்கு நீங்கள் கொடுத்த எதுவோ அது |
| Remote Path | `/` |
| Protocol | `http`, SSL இல்லை |
| Capabilities | எந்த JSON object உம் — capability பொருத்தம் புறக்கணிக்கப்படுகிறது |

பிடிக்கப்பட்ட locators ஐ இந்த வரிசையில் விரும்புங்கள்: **`id`** (`Control.Name` உடன் பொருந்துகிறது; element references
முதலில் அதற்கு எதிராகவே மீண்டும் resolve ஆகின்றன) → **`xpath`** → `name` / `role` / `type`.

எச்சரிக்கைகள்: இது ஒரு W3C WebDriver சேவையகம், முழுமையான Appium சேவையகம் அல்ல; எனவே Appium க்கு மட்டுமான
endpoints (settings, gestures, app management) 404 ஐத் தருகின்றன — பொதுவான WebDriver client தான் மிகவும் நம்பகமான
inspector. எல்லைகள் தருக்க client ஆயத்தொலைவுகள்; எனவே வேறு DPI இல் பிடிக்கப்பட்ட overlay, locators சரியாக
இருந்தாலும் இடம் விலகியிருக்கலாம். ஒரு அமர்வுக்கு ஒரு சாளரம், மறைக்கப்பட்ட கட்டுப்பாடுகள் மரத்திலிருந்து
விலக்கப்படுகின்றன.

---

## நிலை 3 — Windows-native கருவிகள் (FlaUI, WinAppDriver, Appium)
{:#level-3}

`Majorsilence.Forms.WindowsUIAutomation` அதே மரத்தை **Windows UI Automation** மீது திட்டமிடுகிறது (projects). அதுவே
Narrator, NVDA, JAWS ஆகியவை உங்கள் பயன்பாட்டை வாசிக்க உதவுகிறது — மேலும் UIA அடிப்படையிலான சோதனைக் கருவிகள் எந்தத்
தனிப்பயன் protocol உம் இல்லாமல் அதை இயக்க முடியும் என்பதும் இதன் பொருள்.

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // முதலில் காட்டப்பட வேண்டும் — அதற்கு ஒரு native handle தேவை
WindowsUIAutomation.Enable (form);  // சாளரம் மூடும்போது தானாகவே பிரிந்துவிடும்
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' முதலில் காட்டப்பட வேண்டும் — அதற்கு ஒரு native handle தேவை
WindowsUIAutomation.Enable(form)    ' சாளரம் மூடும்போது தானாகவே பிரிந்துவிடும்
```

> **இது Windows அல்லாத தளங்களில் compile ஆகாது** — கோட்பாடாக அல்ல, சரிபார்க்கப்பட்டது. Windows க்கு வெளியே இந்தத்
> தொகுப்பு ஒரு காலியான stub ஆக வருகிறது; எனவே namespace இருப்பதில்லை, நீங்கள் runtime
> `PlatformNotSupportedException` ஐ அல்ல, **CS0234** ஐப் பெறுவீர்கள். Multi-target செய்யுங்கள்
> (`net10.0;net10.0-windows`) மற்றும் `#if WINDOWS` மூலம் காவல் வையுங்கள், அல்லது அந்த அழைப்பை Windows க்கு மட்டுமான
> திட்டத்தில் வைத்திருங்கள்.

ஒவ்வொரு கட்டுப்பாடும் **Name**, **AutomationId** (`Control.Name`), **ControlType**, **IsEnabled**, **HasKeyboardFocus**,
ஒரு திரை **BoundingRectangle** ஆகியவற்றுடன் ஒரு UIA element ஆகிறது. Focus மாற்றங்கள் UIA focus-changed நிகழ்வுகளை
எழுப்புகின்றன.

இது பின்தளம் சாராதது — native window handle வழங்கும் எந்த Windows ஹோஸ்ட் (host) க்கும் வேலை செய்யும் — மேலும்
விசைப்பலகை focus ஐ நகர்த்துவது ஒரு UIA focus-changed நிகழ்வை எழுப்புகிறது; அதுவே திரை வாசிப்பான் புதிய
கட்டுப்பாட்டை அறிவிக்கவும், உருப்பெருக்கி caret ஐப் பின்தொடரவும் வைக்கிறது. Focus இல் உள்ள கட்டுப்பாட்டின் மதிப்பு
மாற்றங்கள் ஒரு property-changed நிகழ்வை எழுப்புகின்றன.

`LiveSetting`, `Polite` அல்லது `Assertive` ஆக உள்ள ஒரு `Label` ஒரு live region ஆகும்: அதன் element UIA இன்
**LiveSetting** ஐத் தெரிவிக்கிறது, அதன் உரையை மாற்றுவது UIA இன் **LiveRegionChanged** நிகழ்வை எழுப்புகிறது — அதுவே
பயனர் அதற்கு நகராமலேயே Narrator உம் NVDA உம் ஒரு நிலை label இன் புதிய உரையை வாசிக்க வைக்கிறது (upstream இன்
`Label.OnTextChanged` செய்வது போல). ஒரு element இன் **HelpText** அதன் கட்டுப்பாட்டின் `AccessibilityObject.Help` ஆகும்;
எனவே `Control.QueryAccessibilityHelp` handler இன் `HelpString` தான் திரை வாசிப்பான் அந்தக் கட்டுப்பாட்டின் உதவியாக
வாசிப்பது. இரண்டும் Windows reference assemblies க்கு எதிராக compile செய்யப்பட்டுள்ளன, ஆனால் உண்மையான திரை
வாசிப்பானில் கேட்டுப் பார்க்கப்படவில்லை.

**இன்று என்ன வேலை செய்கிறது, எதை எதிர்பார்க்கலாம்:** `Invoke` pattern (பொத்தான்கள்) செயலில் உள்ளது; எனவே FlaUI அல்லது
WinAppDriver script கட்டுப்பாடுகளைக் கண்டுபிடித்து click செய்ய முடியும். `Value` (text, combo) மற்றும் `Toggle`
(checkbox) **வாசிப்பதற்காக** வெளிப்படுத்தப்பட்டுள்ளன; எழுதும் ஆதரவு பிந்தைய கட்டம் — எனவே UIA மூலம் உரையை
*அமைப்பது* இன்னும் வேலை செய்யாமல் இருக்கலாம், நிலை 1 அல்லது நிலை 2 மேற்பரப்புகள் வழியாகத் தட்டச்சு செய்வதே
நம்பகமான பாதை. இந்த முதல் பதிப்பில் இல்லாதவை: ஒவ்வொரு keystroke க்குமான `TextBox` மதிப்பு நிகழ்வுகள் (கட்டுப்பாடு
இன்னும் `TextChanged` ஐ எழுப்புவதில்லை; எனவே திரை வாசிப்பான்கள் தமது சொந்தத் தட்டச்சு-எழுத்து எதிரொலிக்குத்
திரும்புகின்றன — focus இல் field இன் மதிப்பு இன்னும் அறிவிக்கப்படுகிறது), structure-changed நிகழ்வுகள், மற்றும்
கட்டுப்பாட்டுக்குள் உள்ள items (தனித்தனி tabs, list வரிசைகள்).

அந்தப் பிரிவின் காரணமாக, Windows இல் நடைமுறைக்கு ஏற்ற வேலைப் பகிர்வு இதுதான்: **நிலை 1 அல்லது 2 மூலம் இயக்குங்கள்,
நிலை 3 மூலம் அணுகல்தன்மையைச் சரிபார்க்குங்கள்.**

தூய மர/role தர்க்கம் framework க்குள்ளேயே unit-test செய்யப்பட்டுள்ளது
(`Majorsilence.Forms.WindowsUIAutomation.Tests`, Windows CI இல்), ஆனால் முழு COM round-trip க்கு ஊடாடும் Windows
desktop அமர்வு தேவை — அதை headless ஆக assert செய்ய முடியாது. உங்கள் பயன்பாட்டை இயக்கி, bridge ஐ `Enable` செய்து,
பின்னர் **Accessibility Insights** அல்லது `inspect.exe` மூலம் ஆய்வு செய்து, திரை வாசிப்பான் காண்பது போல மரத்தைப்
பாருங்கள். உண்மையில் முக்கியமான சோதனை **Narrator** ஐ இயக்கி சாளரம் முழுவதும் tab செய்து பார்ப்பதுதான்: ஒவ்வொரு
கட்டுப்பாடும் அதன் பெயர் மற்றும் role உடன் அறிவிக்கப்பட வேண்டும், ஒரு பொத்தான் திரை வாசிப்பானிலிருந்து
செயல்படுத்தப்பட வேண்டும்.

அதே மரத்தின் மேல் Linux (AT-SPI) மற்றும் macOS (NSAccessibility) bridges வரைபாதையில் (roadmap) உள்ளன. அந்தத்
தளங்களில் உங்களுக்கு அணுகல்தன்மைக் கடப்பாடு இருந்தால், இப்போதே அதைக் கருத்தில் கொண்டு திட்டமிடுங்கள்.

**உலாவி வேறு விதமாக உள்ளடக்கப்படுகிறது.** `net10.0-browser` இல் Avalonia பின்தளம் அதே மரத்தை canvas க்கு அருகில்
ஒளிபுகும், click ஊடுருவிச் செல்லும் elements கொண்ட ஒரு DOM ஆகப் பிரதிபலிக்கிறது — ஒவ்வொரு கட்டுப்பாட்டுக்கும் ஒன்று,
ARIA role, name, state, bounds உடன், மேலும் UIA bridge எழுப்பும் அதே label/status/dialog அறிவிப்புகளுக்கான
`aria-live` regions உடன். திரை வாசிப்பான், find-in-page, அல்லது DOM அடிப்படையிலான சோதனைக் கருவி காண்பது அதுதான்.
அதற்கு உங்களிடமிருந்து எந்த அழைப்பும் தேவையில்லை (`Majorsilence.Forms.Browser.DisableAccessibilityDom` AppContext
switch மூலம் விலகலாம்), மேலும் அது உண்மையான திரை வாசிப்பானால் அல்லாமல், CI இல் headless Chrome இல் DOM ஐ வாசிப்பதன்
மூலம் சரிபார்க்கப்படுகிறது. [பின்தளங்கள் பக்கம்]({{ '/ta/backends/' | relative_url }}#accessibility-dom-browser) roles,
states, live-region விதிகளை ஆவணப்படுத்துகிறது.

---

## Golden images மூலம் காட்சிப் பின்னடைவுச் சோதனை (visual regression)
{:#visual}

`HeadlessRenderer.CapturePng` ஒரு படிவத்தைத் திரைக்கு வெளியே PNG bytes ஆக வரைகிறது. அதுவே உங்கள் golden-image அடிப்படைக் கருவி, அதற்கு எந்தத் திரையும் (display) தேவையில்லை:

**C#**

```csharp
[Fact]
public void GreetForm_matches_its_golden_image ()
{
    using var form = new GreetForm ();
    var actual = HeadlessRenderer.CapturePng (form, 360, 140);

    var goldenPath = Path.Combine (AppContext.BaseDirectory, "Golden", "greetform.png");

    if (!File.Exists (goldenPath) || Environment.GetEnvironmentVariable ("UPDATE_GOLDEN") == "1") {
        Directory.CreateDirectory (Path.GetDirectoryName (goldenPath)!);
        File.WriteAllBytes (goldenPath, actual);
        return;                                   // முதல் ஓட்டம் பதிவு செய்கிறது; பின்னர் ஒருபோதும் அமைதியாக வெற்றியடையாது
    }

    var expected = File.ReadAllBytes (goldenPath);

    if (!expected.AsSpan ().SequenceEqual (actual)) {
        // CI அதை ஒரு artifact ஆக இணைக்கும்படி உண்மையான bytes-ஐ எழுதுங்கள்.
        File.WriteAllBytes (Path.ChangeExtension (goldenPath, ".actual.png"), actual);
        Assert.Fail ($"Render differs from {goldenPath}. Actual written alongside it.");
    }
}
```

**VB.NET**

```vb
<TestMethod>
Public Sub GreetForm_matches_its_golden_image()
    Using form As New GreetForm()
        Dim actual = HeadlessRenderer.CapturePng(form, 360, 140)

        Dim goldenPath = Path.Combine(AppContext.BaseDirectory, "Golden", "greetform.png")

        If Not File.Exists(goldenPath) OrElse
           Environment.GetEnvironmentVariable("UPDATE_GOLDEN") = "1" Then
            Directory.CreateDirectory(Path.GetDirectoryName(goldenPath))
            File.WriteAllBytes(goldenPath, actual)
            Return
        End If

        Dim expected = File.ReadAllBytes(goldenPath)

        If Not expected.SequenceEqual(actual) Then
            File.WriteAllBytes(Path.ChangeExtension(goldenPath, ".actual.png"), actual)
            Assert.Fail($"Render differs from {goldenPath}. Actual written alongside it.")
        End If
    End Using
End Sub
```

சலிப்பான வழியில் கற்றுக்கொண்ட நடைமுறை விதிகள்:

- **வேண்டுமென்றே மீண்டும் உருவாக்குங்கள், ஒருபோதும் தானாக அல்ல.** ஒரு `UPDATE_GOLDEN=1` சூழல் மாறி வாயில் (அல்லது [Verify](https://github.com/VerifyTests/Verify) / ApprovalTests இல் உள்ள அதற்குச் சமமானது — இவை இதையும், கூடவே ஒரு diff-tool தொடக்கியையும் இலவசமாகத் தருகின்றன) "சோதனை பச்சையானது" என்பது "அடிப்படை (baseline) நகர்ந்தது" என்று பொருள்படாமல் தடுக்கிறது.
- **`.actual.png`-ஐ எப்போதும் CI artifact ஆக வெளியிடுங்கள்.** படம் இணைக்கப்படாத byte-ஒப்பீட்டுத் தோல்வி, யாராலும் நடவடிக்கை எடுக்க முடியாத bug அறிக்கை.
- **எல்லாத் திரைகளுக்கும் அல்ல, சில திரைகளுக்கு மட்டும் golden image வையுங்கள்.** அவை layout மற்றும் தீம் பின்னடைவுகளைப் பிடிக்கின்றன; ஆனால் வேண்டுமென்றே செய்யப்படும் ஒவ்வொரு பிக்சல் மாற்றத்திலும் தோல்வியடைகின்றன, எனவே தொகுப்பைச் சிறியதாகவும் அதிக மதிப்புள்ளதாகவும் வையுங்கள்.
- **இயக்க முறைமைகளுக்கு (OS) இடையே எழுத்துருக்கள் வேறுபடுகின்றன.** ஒவ்வொரு OS-க்கும் ஒரு baseline பராமரிப்பதற்குப் பதிலாக, CI இல் golden images-ஐ ஒரே தளத்துக்கு நிலைப்படுத்துங்கள் (Linux மிக மலிவானது).
- **`MF_HEADLESS_SCALE=2` இல் golden image எடுக்காதீர்கள்** — நீங்கள் ஒரு 2× baseline-ஐயும் வைத்திருந்தால் தவிர. அளவிடப்பட்ட (scaled) ஓட்டங்களில் layout-ஐ *விகிதாசாரமாக* உறுதிப்படுத்துங்கள், பிக்சல் ஒப்பீட்டை scale 1 இல் மட்டும் வையுங்கள்.

பொருள்சார் (பிக்சல் அல்லாத) snapshots-க்கு, `session.GetPageSource()` மிக அதிக நிலையான baseline ஆகும்: கட்டமைப்பு மாறும்போது அது மாறுகிறது, வரைதலைப் (rendering) புறக்கணிக்கிறது. "UI அதே வடிவத்தைத் தக்கவைத்ததா" என்ற சரிபார்ப்புகளுக்கு அந்த XML-ஐ snapshot செய்யுங்கள்; "இன்னும் சரியாகத் தெரிகிறதா" என்பதற்கு PNG-களை ஒதுக்குங்கள்.

---

## BDD: அதன் மேல் Reqnroll / SpecFlow
{:#bdd}

சிறப்பாக எதுவும் தேவையில்லை — page objects வேலையைச் செய்கின்றன, step definitions மெல்லியதாகவே இருக்கின்றன.

```gherkin
Feature: Greeting

  Scenario: A name is required
    Given the greeter is open
    When I press OK without entering a name
    Then I am warned that a name is required

  Scenario: Entering a name accepts the dialog
    Given the greeter is open
    When I enter the name "Ada Lovelace"
    And I press OK
    Then the dialog is accepted
```

**C#**

```csharp
using Reqnroll;

[Binding]
public sealed class GreetingSteps : IDisposable
{
    private readonly GreetForm form = new ();
    private GreetPage? page;

    [Given ("the greeter is open")]
    public void GivenTheGreeterIsOpen () => page = new GreetPage (form);

    [When ("I enter the name {string}")]
    public void WhenIEnterTheName (string name) => page!.EnterName (name);

    [When ("I press OK")]
    public void WhenIPressOk () => page!.Accept ();

    [Then ("the dialog is accepted")]
    public void ThenTheDialogIsAccepted ()
        => Assert.Equal (DialogResult.OK, form.DialogResult);

    public void Dispose () => form.Dispose ();
}
```

**VB.NET**

```vb
Imports Reqnroll

<Binding>
Public NotInheritable Class GreetingSteps
    Implements IDisposable

    Private ReadOnly form As New GreetForm()
    Private page As GreetPage

    <Given("the greeter is open")>
    Public Sub GivenTheGreeterIsOpen()
        page = New GreetPage(form)
    End Sub

    <When("I enter the name {string}")>
    Public Sub WhenIEnterTheName(name As String)
        page.EnterName(name)
    End Sub

    <Then("the dialog is accepted")>
    Public Sub ThenTheDialogIsAccepted()
        Assert.AreEqual(DialogResult.OK, form.DialogResult)
    End Sub

    Public Sub Dispose() Implements IDisposable.Dispose
        form.Dispose()
    End Sub
End Class
```

இணையாக்கத்தை (parallelism) assembly மட்டத்தில் முடக்கியே வையுங்கள் ([மேலே](#prerequisites-serial)) — அது BDD ஓட்டிகளுக்கும் பொருந்தும்.

---

## CI செய்முறைகள்
{:#ci}

திரை இல்லை, driver பதிவிறக்கங்கள் இல்லை, X server இல்லை. ஒரு UI சோதனைத் தொகுப்பு வெறும் `dotnet test` தான்.

### GitHub Actions
{:#ci-github}

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest          # திரை தேவையில்லை — Headless backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x

      - run: dotnet build --configuration Release
      - run: dotnet test --configuration Release --no-build --logger "trx;LogFileName=test.trx"

      # 2x இல் layout. அளவிடுதல் தோல்வி தெளிவாகத் தெரிய இதைத் தனி job/step ஆக வையுங்கள்.
      - name: UI tests at simulated HiDPI
        env:
          MF_HEADLESS_SCALE: "2"
        run: dotnet test --configuration Release --no-build --filter "Category=Scaling"

      - name: Upload failed golden images
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: golden-image-diffs
          path: |
            **/*.actual.png
            **/Golden/**
```

உண்மையில் Windows தேவைப்படுவதற்கு மட்டும் ஒரு Windows job சேர்க்குங்கள் — UIA/அணுகல்தன்மை (accessibility) சரிபார்ப்பு:

```yaml
  accessibility:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x
      - run: dotnet test tests/YourApp.Accessibility.Tests --configuration Release
```

### Azure DevOps
{:#ci-azure}

```yaml
pool:
  vmImage: ubuntu-latest

steps:
  - task: UseDotNet@2
    inputs:
      version: 10.0.x

  - script: dotnet build --configuration Release
    displayName: Build

  - script: dotnet test --configuration Release --no-build --logger trx
    displayName: Test

  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFormat: VSTest
      testResultsFiles: '**/*.trx'
```

### Jenkins
{:#ci-jenkins}

Hosted சேவைகளை விட Jenkins-க்குச் சற்று அதிக அமைப்பு தேவை, ஏனெனில் அது .NET-இன் சொந்தச் சோதனை வெளியீட்டைப் படிக்க முடியாது, மேலும் Windows agents பொதுவாக UI தானியக்கத்தை உடைக்கும் வகையில் நிறுவப்படுகின்றன. இரண்டுமே ஒருமுறை மட்டும் செய்யும் திருத்தங்கள்.

**முதலில், ஒரு சோதனை-முடிவு வெளியீட்டாளரைத் (publisher) தேர்ந்தெடுங்கள்.** `dotnet test` TRX எழுதுகிறது, அதை எந்த Jenkins publisher-உம் நேரடியாகப் படிப்பதில்லை — எனவே ஒவ்வொரு சோதனைத் திட்டத்திலும் ஒரு logger package-ஐச் சேர்த்து, பொருந்தும் step-ஐ அதன் வெளியீட்டை நோக்கிச் சுட்டுகிறீர்கள். மூன்று சேர்க்கைகள் வேலை செய்கின்றன; உங்கள் Jenkins-இல் ஏற்கனவே எந்த plugin உள்ளதோ அதன்படி தேர்ந்தெடுங்கள்:

| Publisher step | Logger package | Plugin |
|---|---|---|
| `junit` | `JunitXml.TestLogger` | JUnit plugin — வழக்கமான Jenkins அமைப்பில் உள்ளது, எனவே plugin வேலை எதுவும் தேவையில்லை |
| `nunit` | `NunitXml.TestLogger` | NUnit plugin — தனியாக நிறுவ வேண்டும், ஆனால் பல .NET நிறுவனங்கள் ஏற்கனவே இதை இயக்குகின்றன |
| `mstest` | *இல்லை* — `--logger trx` பயன்படுத்துங்கள் | MSTest plugin — தனியாக நிறுவ வேண்டும்; TRX-ஐ மாற்றுகிறது, package reference சேர்க்க முடியாவிட்டால் இதுவே ஒரே தெரிவு |

```xml
<!-- இவற்றில் ஒன்று, ஒவ்வொரு சோதனைத் திட்டத்திலும் -->
<PackageReference Include="JunitXml.TestLogger" Version="8.0.0" />
<PackageReference Include="NunitXml.TestLogger" Version="8.0.0" />
```

இங்கே முக்கியமான எல்லா வகையிலும் இந்த இரண்டு loggers-உம் ஒன்றுக்கொன்று மாற்றீடானவை: அதே `--logger "<name>;LogFilePath=…"` தொடரியல், அதே `{assembly}` token, கீழே உள்ள அதே namespace எச்சரிக்கை. வெளியீட்டு வடிவமும் Jenkins step-உம் மட்டுமே வேறுபடுகின்றன. Package இல்லாமல், `--logger junit` **build-ஐத் தோல்வியடையச் செய்கிறது**: `Could not find a test logger with AssemblyQualifiedName, URI or FriendlyName 'junit'` — இது அமைதியான no-op (எதுவும் செய்யாது) அல்ல, இதனால் குறைந்தபட்சம் முதல் தடவையிலேயே விடுபட்டது வெளிப்படையாகத் தெரிகிறது.

பின்னர் `Jenkinsfile` (JUnit வடிவம்; NUnit மாற்றீடு [கீழே](#ci-jenkins-nunit)):

```groovy
pipeline {
    agent none

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '10'))
    }

    environment {
        DOTNET_CLI_TELEMETRY_OPTOUT = '1'
        DOTNET_NOLOGO               = '1'
    }

    stages {
        stage('Verify') {
            parallel {

                stage('Headless UI suite') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/dotnet/sdk:10.0'
                            // dotnet-க்கு எழுதக்கூடிய HOME தேவை; இந்த mount builds-க்கு இடையே
                            // NuGet restores-ஐச் சூடாக வைக்கிறது (NUGET_PACKAGES, HOME-க்குக் கீழ் தீர்க்கப்படுகிறது).
                            args '-e DOTNET_CLI_HOME=/tmp -e HOME=/tmp ' +
                                 '-v $HOME/.nuget/packages:/tmp/.nuget/packages'
                        }
                    }
                    steps {
                        sh 'dotnet build --configuration Release'

                        // திரை இல்லை, Xvfb இல்லை, driver பதிவிறக்கங்கள் இல்லை — Headless backend.
                        sh '''
                            dotnet test --configuration Release --no-build \
                                --logger "junit;LogFilePath=$WORKSPACE/artifacts/junit/{assembly}.xml"
                        '''

                        // 2x இல் layout. தனி அழைப்பு, அதனால் அளவிடுதல் தோல்வி பிரதான ஓட்டத்துடன்
                        // கலக்காமல் Jenkins சோதனை அறிக்கையில் தெளிவாகத் தெரியும்.
                        withEnv(['MF_HEADLESS_SCALE=2']) {
                            sh '''
                                dotnet test --configuration Release --no-build \
                                    --filter "Category=Scaling" \
                                    --logger "junit;LogFilePath=$WORKSPACE/artifacts/junit/{assembly}.hidpi.xml"
                            '''
                        }
                    }
                    post {
                        always {
                            junit testResults: 'artifacts/junit/*.xml', allowEmptyResults: false
                            // படம் இல்லாமல் golden-image தோல்விகளை மதிப்பாய்வு செய்ய முடியாது.
                            archiveArtifacts artifacts: '**/*.actual.png', allowEmptyArchive: true
                        }
                    }
                }

                stage('Accessibility (Windows)') {
                    // ஊடாடும் desktop session இல் இயங்கும் agent ஆக இருக்க வேண்டும் — கீழே பாருங்கள்.
                    agent { label 'windows-desktop' }
                    steps {
                        // மும்மேற்கோள்: ஒற்றை மேற்கோள் Groovy string பல வரிகளுக்கு நீள முடியாது.
                        // Windows இல் dotnet-க்கு forward slashes பரவாயில்லை.
                        bat '''
                            dotnet test tests/YourApp.Accessibility.Tests --configuration Release ^
                                --logger "junit;LogFilePath=%WORKSPACE%/artifacts/junit/uia.xml"
                        '''
                    }
                    post {
                        always {
                            junit testResults: 'artifacts/junit/uia.xml', allowEmptyResults: true
                        }
                    }
                }
            }
        }
    }
}
```

#### அதற்குப் பதிலாக NUnit plugin-ஐப் பயன்படுத்துதல்
{:#ci-jenkins-nunit}

உங்கள் Jenkins-இல் ஏற்கனவே NUnit plugin இருந்தால், package-ஐ `NunitXml.TestLogger` ஆக மாற்றி இரண்டு வரிகளை மாற்றுங்கள் — logger பெயரும் publisher step-உம். Parameter பெயர் வேறுபடுவதைக் கவனியுங்கள்: `junit` `testResults` எடுக்கிறது, `nunit` `testResultsPattern` எடுக்கிறது.

```groovy
steps {
    sh '''
        dotnet test --configuration Release --no-build \
            --logger "nunit;LogFilePath=$WORKSPACE/artifacts/nunit/{assembly}.xml"
    '''
}
post {
    always {
        nunit testResultsPattern: 'artifacts/nunit/*.xml', failedTestsFailBuild: true
        archiveArtifacts artifacts: '**/*.actual.png', allowEmptyArchive: true
    }
}
```

அது NUnit v3 `<test-run>` XML-ஐ உருவாக்குகிறது, அதை plugin உள்ளே வரும்போதே மாற்றுகிறது — எனவே Jenkins சோதனைப் போக்கு (trend), ஒவ்வொரு சோதனையின் வரலாறு, தோல்விகளை உலாவுதல் எல்லாம் `junit` உடன் இருப்பது போலவே சரியாக நடந்துகொள்கின்றன. ஒன்றை மற்றதை விட விரும்புவதற்குச் செயல்பாட்டுக் காரணம் எதுவும் இல்லை; நீங்கள் ஏற்கனவே பராமரிக்கும் plugin-ஐப் பயன்படுத்துங்கள்.

#### Jenkins-க்கே உரிய, தெரிந்துகொள்ள வேண்டிய நான்கு விடயங்கள்
{:#ci-jenkins-gotchas}

இல்லாவிட்டால் இவை ஒவ்வொன்றையும் கண்டுபிடிக்க ஒரு மதியப்பொழுது செலவாகும்.

- **உங்கள் சோதனை classes-க்கு namespace கொடுங்கள்.** இரண்டு loggers-உம் ஒவ்வொரு சோதனையின் `classname`-ஐயும் அதன் namespace இலிருந்து பெறுகின்றன. Global namespace இல் உள்ள ஒரு class `classname="UnknownNamespace.UnknownType"` ஆக வெளிவருகிறது — இரண்டு loggers-ஐயும் அருகருகே இயக்கிச் சரிபார்க்கப்பட்டது — எனவே ஒவ்வொரு சோதனையும் அர்த்தமற்ற ஒரே தொட்டியில் விழுகிறது, Jenkins-இன் test browser எதையும் குழுவாக்க முடியாது. `namespace MyApp.UiTests` இல் உள்ள ஒரு class `classname="MyApp.UiTests.GreetFormTests"` ஆக வெளிவருகிறது, அறிக்கை வழிசெலுத்தக்கூடியதாகிறது.
- **`LogFilePath` இல் உள்ள `{assembly}` சோதனை assembly பெயராக விரிவடைகிறது**, எனவே பல சோதனைத் திட்டங்கள் ஒன்றின் முடிவுகளை மற்றொன்று மேலெழுதுவதில்லை. அடைவை (directory) உருவாக்குங்கள் அல்லது logger அதைச் செய்யட்டும், மேலும் `junit`-ஐ ஒரு தனிக் கோப்புக்குப் பதிலாக glob-ஐ நோக்கிச் சுட்டுங்கள்.
- **Windows agent ஊடாடும் desktop session இல் இயங்க வேண்டும்.** Windows UIA bridge-க்கு ஒரு உண்மையான native சாளரமும் இணைவதற்கு ஒரு desktop-உம் தேவை. *Windows service* ஆக நிறுவப்பட்ட Jenkins agent-க்கு ஊடாடும் session இல்லை, எனவே சாளரப் பயன்பாடுகளும் ஒவ்வொரு UIA உறுதிப்படுத்தலும் framework bugs போலத் தோன்றும் வழிகளில் தோல்வியடைகின்றன. அதற்குப் பதிலாக அந்த agent-ஐ login செய்யப்பட்ட பயனர் session இலிருந்து தொடங்குங்கள் (logon இல் agent JAR-ஐ இயக்கும் scheduled task, அல்லது பிரத்தியேக இயந்திரத்தில் கைமுறையாகத் தொடங்கப்பட்ட agent). Linux stage-க்கு அத்தகைய தேவை இல்லை — Headless backend-இன் முழு நோக்கமும் அதுதான்.
- **ஒவ்வொரு `agent` block-உம் தனக்கென ஒரு workspace பெறுகிறது.** `--no-build` ஒரு agent-க்குள் மட்டுமே வேலை செய்கிறது; agents-க்கு இடையே build வெளியீடு அங்கு இருக்காது. ஒவ்வொரு stage-இலும் build செய்யுங்கள் (மேலே உள்ளது போல) அல்லது வெளியீட்டை வெளிப்படையாக `stash`/`unstash` செய்யுங்கள். முன்பு ஒரே agent பயன்படுத்திய pipeline-க்கு ஒவ்வொரு stage-க்கும் `agent` சேர்ப்பதே திடீர் "project file not found" அல்லது "assembly missing" தோல்விக்கு வழக்கமான காரணம்.

உங்கள் Jenkins-இல் Docker இல்லையென்றால், `docker` agent-ஐ நீக்கி ஒரு சாதாரண `agent { label 'linux' }` பயன்படுத்தி, node இல் .NET SDK-ஐ நிறுவுங்கள் (அல்லது **.NET SDK Support** plugin-இன் `dotnetsdk` tool-ஐப் பயன்படுத்தி steps-ஐ `withDotNet` இல் சுற்றுங்கள்). சோதனைத் தொகுப்பில் எதுவும் மாறுவதில்லை — எப்படியிருந்தாலும் அதற்குத் திரை தேவையில்லை.

> **இங்கே எது சரிபார்க்கப்பட்டது, எது சரிபார்க்கப்படவில்லை.** .NET பாதி இயக்கப்பட்டது: இரண்டு loggers-உம் (`JunitXml.TestLogger`
> மற்றும் `NunitXml.TestLogger`, 8.0.0), package இல்லாதபோது வரும் தோல்விச் செய்தி, ஒவ்வொரு சோதனை assembly-க்கும் ஒரு கோப்பாக விரிவடையும் `{assembly}`
> token, மேலே உள்ள namespace-இலிருந்து-`classname` நடத்தை. Jenkins steps மற்றும் plugin parameters நேரடி controller இலிருந்து அல்ல,
> அந்த plugins-இன் சொந்த ஆவணங்களிலிருந்து வருகின்றன — `testResults` / `testResultsPattern`-ஐ நீங்கள் நிறுவியுள்ள plugin பதிப்புகளுடன் சரிபாருங்கள்.

### மக்கள் தவறவிடும் அந்த ஒரு வாயில்
{:#ci-wasm}

நீங்கள் உலாவிக்கு (browser) வெளியிடுகிறீர்கள் என்றால், **wasm இலக்கை build செய்வது அது வேலை செய்கிறது என்பதற்குச் சான்றல்ல.** wasm-tools pipeline-ஐ (emcc/wasm-opt native link) இயக்குவது `dotnet publish` தான், மேலும் உலாவியில் உண்மையாகத் தொடங்குவது (boot) மட்டுமே bundle-ஐ நிரூபிக்கிறது. அதை publish செய்து headless Chromium உடன் smoke-test செய்யுங்கள்:

```yaml
  wasm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: 10.0.x }
      - run: dotnet workload install wasm-tools
      - run: dotnet publish src/YourApp.Wasm -c Release -o out
      - run: npx playwright install --with-deps chromium
      # out/wwwroot-ஐ serve செய்து canvas வரைகிறது / console பிழைகள் இல்லை என உறுதிப்படுத்துங்கள்.
      - run: node scripts/wasm-smoke.mjs
```

தெரிந்துகொள்ள வேண்டிய முரண்நகை: Playwright உங்கள் *பயன்பாட்டின்* UI-ஐ இயக்க முடியாது (DOM இல்லை — [வரம்புகள்](#limits) பாருங்கள்), ஆனால் WebAssembly bundle தொடங்குகிறது என்று உறுதிப்படுத்துவதற்கு அதுவே சரியான கருவி.

---

## AI கருவிகள் இவை அனைத்துடனும் எப்படி இணைகின்றன
{:#ai}

ஒரு கட்டமைப்புக் காரணத்தால், இந்த framework AI coding உதவியாளர்களுக்கும் agents-க்கும் வழக்கத்துக்கு மாறாக நட்பானது:

> **தானியக்க மரம் (automation tree) உரை வடிவில் உள்ளது.** `session.GetPageSource()` நேரடி UI-ஐ ids, பெயர்கள்,
> roles, மதிப்புகள், நிலை, எல்லைகள் (bounds) ஆகியவற்றுடன் XML ஆகத் தருகிறது.

ஒரு மாதிரி (model) உங்கள் பயனர் இடைமுகத்தைப் பிக்சல்கள் இல்லாமல், OCR இல்லாமல், vision model இல்லாமல் *படிக்க* முடியும். அது "GUI-ஐ இயக்குதல்" என்பதை computer-use பிரச்சினையிலிருந்து உரைப் பிரச்சினையாக மாற்றுகிறது — இது மிக மலிவானதும் மிக நம்பகமானதும் ஆகும்.

```xml
<Form name="Greeter" role="window" type="Form" x="0" y="0" width="360" height="140">
  <Label   id="promptLabel" name="Your name:" role="label" ... />
  <TextBox id="nameBox" name="Full name" role="textbox" value="" enabled="true" ... />
  <Button  id="okButton" name="OK" role="button" enabled="false" ... />
</Form>
```

நான்கு ஒருங்கிணைப்பு முறைகள், மலிவானது முதலில்.

### 1. Shell + curl — ஒருங்கிணைப்பு வேலை பூஜ்ஜியம்
{:#ai-shell}

Shell கட்டளைகளை இயக்கக்கூடிய எந்த agent-உம் ஏற்கனவே உங்கள் பயன்பாட்டை இயக்க முடியும்: WebDriver server-ஐத் தொடங்குங்கள், பின்னர் [level 2](#level-2-http) இல் உள்ள endpoints-ஐ அது `curl` செய்யட்டும். Bindings இல்லை, SDK இல்லை, MCP server இல்லை. இயங்கும் பயன்பாட்டில் ஒரு coding உதவியாளர் *தன் சொந்த வேலையைச் சரிபார்க்க* அனுமதிக்க இதுவே மிக வேகமான வழி, பொதுவாக இங்கிருந்துதான் தொடங்க வேண்டும்.

Agent-க்கு மூன்று கட்டளைகளைக் (`/source`, `/element`, `/element/{id}/click`) கொடுங்கள், அது ஆராயத் தொடங்கும்.

### 2. உதவியாளரைச் சோதனைச் சுழற்சியை நோக்கிச் சுட்டுங்கள்
{:#ai-loop}

அதிக மதிப்புள்ள முறைக்குப் புதிய API மேற்பரப்பு எதுவுமே தேவையில்லை — **முழுச் சுழற்சியும் திரை இல்லாமலேயே மூடுகிறது** என்பதே அது:

1. கட்டுப்பாடுகளின் பெயர்களை அறிய agent `GetPageSource()` வெளியீட்டை (அல்லது ஏற்கனவே உள்ள ஒரு சோதனையை) படிக்கிறது.
2. `By.Id` locators பயன்படுத்தி ஒரு சோதனையை எழுதுகிறது.
3. `dotnet test` இயக்குகிறது.
4. தோல்வியைப் படித்து, திருத்தி, மீண்டும் செய்கிறது.

அது container இலும், CI இலும், GUI session இல்லாத இயந்திரத்திலும் வேலை செய்கிறது — coding agents சரியாக அங்குதான் இயங்குகின்றன. பிக்சல்-சார்ந்த GUI தானியக்கத்துடன் ஒப்பிடுங்கள்; அங்கே திரை இல்லாமல் agent முடிவை முற்றிலும் பார்க்க முடியாது.

ஒரு உதவியாளரை இதில் சிறப்பாகச் செய்ய வைக்க, உங்கள் repo-வில் ஒரு சிறிய `AGENTS.md` / `CLAUDE.md` போதுமானது:

```markdown
## UI-ஐ இயக்குதலும் சோதித்தலும்

- UI சோதனைகள் headless ஆக இயங்குகின்றன: `dotnet test`. திரை தேவையில்லை. ஒருபோதும் `Thread.Sleep` சேர்க்காதீர்கள்;
  `tests/Support/Wait.cs` இல் உள்ள `Wait` helper-ஐப் பயன்படுத்துங்கள் (அது backend வரிசையை இயக்குகிறது).
- Backend ஒவ்வொரு சோதனை assembly-க்கும் ஒருமுறை `TestBackend.Init` இல் நிறுவப்படுகிறது — ஒவ்வொரு சோதனைக்கும் அமைக்காதீர்கள்.
- சோதனைகள் வரிசையாகவே (serial) இருக்க வேண்டும்: `Platform.Backend` மற்றும் `Application.OpenForms` global ஆனவை.
- Locators `Control.Name` இலிருந்து வருகின்றன (`By.Id("okButton")`). ஒரு கட்டுப்பாட்டுக்கு `Name` இல்லையென்றால்,
  உரை அல்லது index மூலம் கண்டுபிடிப்பதற்குப் பதிலாக ஒன்றைச் சேர்க்குங்கள்.
- ஒரு படிவத்தைத் தானியக்கமாக்கும் முன் `HeadlessRenderer.CapturePng(form, w, h)`-ஐ ஒருமுறை அழையுங்கள் — அது layout-ஐக் கட்டாயப்படுத்துகிறது.
- தானியக்க அடுக்கு UI-ஐப் பார்ப்பது போலப் பார்க்க: `session.GetPageSource()` மரத்தை XML ஆக அச்சிடுகிறது.
- *விளைவை* (நிலை, DialogResult, வரைந்த வெளியீடு) உறுதிப்படுத்துங்கள், ஒரு member இருக்கிறது என்பதை ஒருபோதும் அல்ல.
```

### 3. ஒரு MCP tool மேற்பரப்பு — ஊடாடும் உதவியாளர்களுக்கு
{:#ai-mcp}

ஒரு உதவியாளர் *இயங்கும்* பயன்பாட்டை உரையாடல் வழியாக இயக்க அனுமதிக்க, தானியக்க மேற்பரப்பை [Model Context Protocol](https://modelcontextprotocol.io) tools ஆக வெளிப்படுத்துங்கள். **Framework ஒன்றை வழங்குகிறது** — [`Majorsilence.Forms.Mcp`]({{ site.github_url }}/tree/main/tools/Majorsilence.Forms.Mcp), வெளியிடப்பட்ட ஒரு `dotnet` global tool; அது stdin/stdout வழியாக MCP பேசி, [level 2](#level-2) இல் உள்ள WebDriver endpoint வழியாகப் பயன்பாட்டை இயக்குகிறது:

```
dotnet tool install -g Majorsilence.Forms.Mcp
```

```
assistant  ──MCP/stdio──▶  majorsilence-mcp  ──HTTP/loopback──▶  your app (WebDriverServer)
```

Framework-உடன் link செய்வதற்குப் பதிலாக HTTP வழியாகப் பாலம் அமைப்பதுதான் அதைப் பதிப்பு- மற்றும் backend-சாராததாக ஆக்குகிறது: `WebDriverServer`-ஐத் தொடங்கும் எந்த Majorsilence.Forms பயன்பாட்டையும் அது இயக்குகிறது, வேறொருவரின் UI thread-க்கு marshal செய்ய வேண்டிய அவசியமே இல்லை.

எனவே பயன்பாட்டுப் பக்க அமைப்பு, Selenium-க்கு உங்களுக்கு ஏற்கனவே தேவைப்படும் அதே இரண்டு வரிகள்தான்:

```csharp
using var server = new WebDriverServer (form, 4444);
server.Start ();
```

பின்னர் ஒரு client-ஐ அதை நோக்கிச் சுட்டுங்கள். Claude Code:

```
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444
```

MCP servers-ஐத் தானே தொடங்கும் எந்த client-உம் (Claude Desktop, editors, agent frameworks) அதே கட்டளையைத் தன் சொந்த config வடிவத்தில் எடுத்துக்கொள்கிறது:

```json
{
  "mcpServers": {
    "majorsilence-ui": {
      "command": "majorsilence-mcp",
      "args": ["--port", "4444"]
    }
  }
}
```

தெரிவுகள்: `--port <port>` (loopback, இயல்புநிலை 4444), முழு base URL-க்கு `--url <url>`, அல்லது `MAJORSILENCE_MCP_URL` சூழல் மாறி; `--help` அதே சுருக்கத்தை அச்சிடுகிறது.

அது வெளிப்படுத்தும் tools:

| Tool | Arguments | திருப்பித் தருவது |
|---|---|---|
| `ui_snapshot` | — | முழுக் கட்டுப்பாட்டு மரமும் XML ஆக |
| `ui_find` | `target`, `strategy` | id, name, role, type, value, text, enabled/visible, bounds |
| `ui_read` | `target`, `strategy` | கட்டுப்பாடு தற்போது காட்டுவது |
| `ui_click` | `target`, `strategy` | உறுதிப்படுத்தல், அல்லது ஏன் மறுக்கப்பட்டது |
| `ui_type` | `target`, `text`, `strategy`, `clear` | பின்னர் கட்டுப்பாடு காட்டுவது |
| `ui_wait_for` | `target`, `strategy`, `timeoutMs`, `requireEnabled` | தயார்நிலை, அல்லது காத்திருப்பு ஏன் காலாவதியானது |
| `ui_screenshot` | — | சாளரத்தின் ஒரு PNG — [Headless-hosted சாளரங்களுக்கு மட்டும்](#level-2) |

நீங்கள் சொந்தமாக ஒன்றை உருவாக்கினால் நகலெடுக்கத் தகுந்த மூன்று முடிவுகள் அதில் உள்ளன:

- **ஒவ்வொரு tool-உம் element handle அல்ல, ஒரு locator-ஐ எடுக்கிறது.** ஒவ்வொரு அழைப்பும் தான் செயல்படும் பொருளை மீண்டும் தீர்க்கிறது, எனவே [staleness பொறி](#level-1) கடிக்க வழியே இல்லை: ஒரு மாதிரி turns-க்கு இடையே வைத்திருக்க எந்த handle-உம் இல்லை.
- **`strategy` இயல்புநிலையாக `id`** — கட்டுப்பாட்டின் `Name` — மேலும் அடையாளம் காணப்படாத strategy ஊடே அனுப்பப்படாமல் பெயர் சொல்லி நிராகரிக்கப்படுகிறது. Server தான் அடையாளம் காணாத எதற்கும் *name* தேடலுக்குத் திரும்புகிறது, எனவே சரிபார்க்கப்படாத எழுத்துப்பிழை அமைதியாகத் தவறான வழியில் தேடி "not found" என்று பதிலளிக்கும்.
- **`ui_click` மற்றும் `ui_type` destructive எனக் குறிக்கப்பட்டுள்ளன, மற்றவை read-only**; எதைத் தானாக அங்கீகரிப்பது என்று முடிவெடுக்கும்போது host பயனருக்குக் காட்டுவது இதைத்தான்.

**அதைச் சுட்டுவதற்கு ஏதாவது.**
[`samples/AutomationTarget`]({{ site.github_url }}/tree/main/samples/AutomationTarget) சரியாக இதற்காக உருவாக்கப்பட்ட ஒரு சிறிய பயன்பாடு: அது endpoint-ஐத் தானே தொடங்கி, அதை இயக்குவதற்கான கட்டளைகளை அச்சிடுகிறது (MCP `claude mcp add` வரி, ஒரு Selenium `RemoteWebDriver` constructor, `/status`-க்கு ஒரு `curl`).

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

`--webdriver <port>` port-ஐத் தேர்ந்தெடுக்கிறது; `--no-webdriver` அதைச் சாதாரண பயன்பாடாக இயக்குகிறது. அதன் ஒவ்வொரு கட்டுப்பாடும் ஒரு client கையாள வேண்டிய ஒரு விடயத்தைப் பயிற்சி செய்கிறது — எழுதவும் படிக்கவும் ஒரு text box (`nameBox`), handler ஒரு label-ஐ மாற்றும் ஒரு பொத்தான் (`greetButton` → `greetingLabel`), நிரந்தரமாக முடக்கப்பட்ட ஒரு பொத்தான் (`lockedButton`, போலியான வெற்றிக்குப் பதிலாக மறுப்பைப் பார்க்க), `agreeCheck` checkbox தேர்வு செய்யப்பட்ட பிறகே இயக்கப்படும் ஒரு Submit பொத்தான் (`ui_wait_for` இதற்காகத்தான்), வரிசைகள் `listitem` nodes ஆக உள்ள ஒரு `logList`, மேலும் வேண்டுமென்றே *பெயரிடப்படாத* ஒரு label — மரத்தில் வெற்று `id` எப்படித் தெரிகிறது என்று பார்க்க. ஒவ்வொரு செயலும் தெரியும் log-இலும் stdout-இலும் சேர்க்கப்படுகிறது, எனவே client தான் செய்ததாகக் கூறுவது பயன்பாடு உண்மையில் பார்த்ததுதானா என்று சரிபார்க்கலாம். ஒரு நல்ல முதல் பயிற்சி: *"type 'Grace Hopper' into nameBox, click greetButton, and read greetingLabel"* என்பது `Hello, Grace Hopper!` என்று திரும்பி வர வேண்டும்.

அது கடினமான வழியில் கற்பிக்கும் இரண்டு விடயங்கள்: அது Avalonia backend இல் இயங்குகிறது, எனவே `ui_screenshot` மறுக்கப்படுகிறது (screenshots [Headless-க்கு மட்டும்](#level-2)); அதன் list items-க்கு `id` இல்லை, எனவே அவை பெயர், உரை அல்லது XPath மூலம் கண்டுபிடிக்கப்படுகின்றன.

இரண்டு பாதிகளும் NuGet இல் உள்ளன — tool, மற்றும் சோதிக்கப்படும் பயன்பாட்டுக்கு `Majorsilence.Forms.WebDriver` — எனவே repo இலிருந்து எதையும் build செய்ய வேண்டியதில்லை. Server-ஐ மூலக் குறியீட்டிலிருந்து இயக்க விரும்பினால் (உதாரணமாக, அதை மாற்ற), அதற்குச் சமமானது:

```
dotnet run --project tools/Majorsilence.Forms.Mcp -- --port 4444
```

#### அல்லது மேற்பரப்பை உங்கள் சொந்த process-க்குள் host செய்யுங்கள்
{:#ai-mcp-inprocess}

இந்த tools-ஐப் பயன்பாட்டுக்குள்ளிருந்து வெளிப்படுத்த விரும்பினால் — அல்லது MCP அல்லாத ஒரு agent framework உடன் இணைக்க விரும்பினால் — framework-க்கே உரிய பகுதி `AutomationSession` மேல் உள்ள ஒரு மெல்லிய adapter மட்டுமே:

**C#**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

// சோதிக்கப்படும் ஒவ்வொரு பயன்பாட்டுக்கும் ஒரு instance. ஒவ்வொரு method-உம் UI thread இல் அழைக்கப்படுகிறது.
public sealed class UiAgentSurface
{
    private readonly Form form;
    private readonly AutomationSession session;

    public UiAgentSurface (Form form)
    {
        this.form = form;
        session = new AutomationSession (form);
    }

    public string Snapshot () => session.GetPageSource ();

    public string Click (string id)
    {
        var element = session.Find (By.Id (id));
        if (element is null)
            return $"no element with id '{id}'";       // மாதிரி செயல்படக்கூடிய ஒரு எளிய பிழை
        if (!element.Enabled)
            return $"'{id}' is disabled";

        session.Click (element);
        return "ok";
    }

    public string Type (string id, string text)
    {
        var element = session.FindOrThrow (By.Id (id));
        session.Clear (element);
        session.SendKeys (element, text);

        // படிக்க மீண்டும் தீர்க்கவும்: பிடிக்கப்பட்ட element தட்டச்சுக்கு முந்தைய snapshot.
        return session.GetText (session.FindOrThrow (By.Id (id)));
    }

    public string Read (string id) => session.GetText (session.FindOrThrow (By.Id (id)));

    public byte[] Screenshot (int width, int height)
        => HeadlessRenderer.CapturePng (form, width, height);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Headless

Public NotInheritable Class UiAgentSurface
    Private ReadOnly form As Form
    Private ReadOnly session As AutomationSession

    Public Sub New(form As Form)
        Me.form = form
        session = New AutomationSession(form)
    End Sub

    Public Function Snapshot() As String
        Return session.GetPageSource()
    End Function

    Public Function Click(id As String) As String
        Dim element = session.Find(By.Id(id))
        If element Is Nothing Then Return $"no element with id '{id}'"
        If Not element.Enabled Then Return $"'{id}' is disabled"

        session.Click(element)
        Return "ok"
    End Function

    Public Function Type(id As String, text As String) As String
        Dim element = session.FindOrThrow(By.Id(id))
        session.Clear(element)
        session.SendKeys(element, text)

        ' படிக்க மீண்டும் தீர்க்கவும்: பிடிக்கப்பட்ட element தட்டச்சுக்கு முந்தைய snapshot.
        Return session.GetText(session.FindOrThrow(By.Id(id)))
    End Function

    Public Function Screenshot(width As Integer, height As Integer) As Byte()
        Return HeadlessRenderer.CapturePng(form, width, height)
    End Function
End Class
```

குழாய் இணைப்பை (plumbing) விட முக்கியமான இரண்டு வடிவமைப்புக் குறிப்புகள்:

- **பிழைகளை exceptions ஆக அல்ல, உரையாகத் திருப்புங்கள்.** "no element with id 'okButton'" என்பதிலிருந்து ஒரு மாதிரி மீள முடியும்; tool எல்லையைக் கடக்கும் stack trace-இலிருந்து பொதுவாக முடியாது.
- **UI thread-க்கு marshal செய்யுங்கள்.** உங்கள் host பயன்பாடு உண்மையான message loop-ஐ இயக்கினால், ஒவ்வொரு அழைப்பையும் `Application.RunOnUIThread` உடன் சுற்றுங்கள். WebDriver server ஏற்கனவே இதை உங்களுக்காகச் செய்கிறது — பயன்பாடு இயங்கும் desktop process ஆக இருக்கும்போது `AutomationSession`-க்குப் பதிலாக *அதைச்* சுற்றுவதற்கு இது ஒரு நல்ல வாதம்.

**அல்லது MCP-ஐ முழுவதுமாகத் தவிருங்கள்:** WebDriver endpoint loopback இல் உள்ள சாதாரண HTTP என்பதால், shell அணுகல் உள்ள உதவியாளர் ([முறை 1](#ai-shell)) அல்லது HTTP திறன் கொண்ட பொதுவான MCP server கூடுதல் process எதுவுமின்றி அதே பயன்பாட்டை இயக்க முடியும்.

### 4. உங்கள் சொந்த agent சுழற்சி, process-க்குள்ளேயே
{:#ai-agentloop}

உங்கள் தயாரிப்புக்கு *உள்ளேயே* ஒரு agent-ஐ உருவாக்குகிறீர்கள் என்றால் — UI-ஐ இயக்கும் "இதை எனக்காகச் செய்" உதவியாளர் — அதே adapter ஒரு சாதாரண tool-use சுழற்சியில் tool வரையறைகளாக மாறுகிறது. [Anthropic C# SDK](https://github.com/anthropics/anthropic-sdk-csharp) உடன் (`dotnet add package Anthropic`), tools மூல JSON schemas ஆகும், `client.Beta.Messages.ToolRunner(...)` உங்களுக்காகச் சுழற்சியை இயக்கி, மாதிரி நிறுத்தும் வரை உங்கள் functions-ஐ அழைத்து முடிவுகளைத் திருப்பி வழங்குகிறது:

```csharp
using System.Text.Json;
using Anthropic;
using Anthropic.Models.Messages;

var clickTool = new Tool {
    Name = "ui_click",
    Description = "Click a control in the running application by its automation id. "
                + "Call ui_snapshot first to discover valid ids.",
    InputSchema = new () {
        Properties = new Dictionary<string, JsonElement> {
            ["id"] = JsonSerializer.SerializeToElement (
                new { type = "string", description = "The control's automation id, e.g. okButton" }),
        },
        Required = ["id"],
    },
};

// இயல்புநிலை மாதிரி: claude-opus-5. பின்னர் tool அழைப்புகளை மேலே உள்ள UiAgentSurface-க்கு அனுப்புங்கள்.
```

ஒவ்வொரு tool-க்கும் **வழிகாட்டும் (prescriptive)** விளக்கம் கொடுங்கள் — அது என்ன செய்கிறது என்பது மட்டுமல்ல, அதை *எப்போது* அழைக்க வேண்டும் என்று சொல்லுங்கள் ("நீங்கள் ஆய்வு செய்யாத திரையில் உங்கள் முதல் `ui_click`-க்கு முன் `ui_snapshot`-ஐ அழையுங்கள்"). அந்த ஒரு பழக்கம் எவ்வளவு prompt tuning-ஐ விடவும் நம்பகத்தன்மைக்கு அதிகம் உதவுகிறது.

### Agent எழுதும் சோதனைகளுக்கான பாதுகாப்பு வேலிகள்
{:#ai-guardrails}

இந்த வகைச் சோதனைகளை எழுதுவதில் agents உண்மையிலேயே திறமையானவை. எதையும் நிரூபிக்காமல் வெற்றியடையும் சோதனைகளை எழுதுவதிலும் அவை திறமையானவை, எனவே இவற்றைக் குறிப்பாக மதிப்பாய்வு செய்யுங்கள்:

- **இருப்பை அல்ல, விளைவுகளை உறுதிப்படுத்துங்கள்.** `Assert.NotNull(session.Find(By.Id("okButton")))` கட்டுப்பாடு இருக்கிறது என்று நிரூபிக்கிறது; அதைக் கிளிக் செய்வது ஏதாவது செய்கிறது என்று நிரூபிப்பதில்லை. பெரும்பாலான frameworks-ஐ விட இங்கே இது முக்கியம், ஏனெனில் செயல்படுத்தப்படாத members [exception எறிவதற்குப் பதிலாகப் பாதுகாப்பாக no-op ஆகின்றன]({{ '/ta/training/' | relative_url }}#module-3-stub-policy) — ஒரு member அணுகக்கூடியது என்று மட்டும் சரிபார்க்கும் சோதனை ஒரு stub-க்கு எதிராகவும் வெற்றியடையும்.
- **சோதனையைப் பச்சையாக்குவதற்காகத் தளர்த்தப்பட்ட உறுதிப்படுத்தல்களைக் கவனியுங்கள்.** மாற்றப்பட்ட `Assert.Equal` என்பது மாறுவேடத்தில் உள்ள நடத்தை மாற்றம். சோதனை எண்ணிக்கையை மட்டுமல்ல, உறுதிப்படுத்தல்களையும் diff செய்யுங்கள்.
- **Golden images-ஐ agent மீண்டும் உருவாக்க ஒருபோதும் அனுமதிக்காதீர்கள்.** `UPDATE_GOLDEN`-ஐ மனிதச் செயலாகவே வையுங்கள்; agent தன் சொந்த வெளியீட்டுக்குப் பொருந்தும்படி மீண்டும் எழுதிய baseline எதையும் சோதிப்பதில்லை.
- **Index-க்குப் பதிலாக `Name` தேவைப்படுத்துங்கள்.** யாராவது ஒரு பொத்தானைச் சேர்க்கும் வரை `By.XPath("(//Button)[3]")` வேலை செய்கிறது. ஒரு கட்டுப்பாட்டுக்கு `Name` இல்லையென்றால், சரியான திருத்தம் ஒன்றைச் சேர்ப்பதுதான்.
- **கண்டுபிடிப்பதற்கு முன் page source-ஐப் படிக்க வையுங்கள்.** உண்மையான மரத்திலிருந்து அல்லாமல் மூலக் குறியீட்டிலிருந்து கற்பனை செய்யப்பட்ட locators, agent எழுதும் நிலையற்ற (flaky) சோதனைகளுக்கு மிகப் பொதுவான காரணம்.

---

## வரம்புகளும் தவிர்க்க வேண்டிய முறைகளும் (anti-patterns)
{:#limits}

**Playwright உங்கள் desktop பயன்பாட்டை இயக்க முடியாது.** அது Chrome DevTools Protocol வழியாக ஒரு DOM-க்கு எதிராக உலாவி இயந்திரங்களைத் தானியக்கமாக்குகிறது; desktop backend இல் உள்ள Majorsilence.Forms பயன்பாடு Skia உடன் native ஆக வரைகிறது, இணைவதற்கு DOM-உம் இல்லை, உலாவி இயந்திரமும் இல்லை. HTTP மேற்பரப்பை Playwright-இன் API-request client இலிருந்து, ஒரு HTTP சேவையாகக் கருதி, இயக்க *முடியும்* — ஆனால் அது உலாவித் தானியக்கம் அல்ல, சாதாரண WebDriver client-ஐ விட எதையும் கூடுதலாகத் தருவதில்லை. அதற்குப் பதிலாக [WebDriver server](#level-2)-ஐப் பயன்படுத்துங்கள். (உங்கள் [WebAssembly bundle தொடங்குகிறது](#ci-wasm) என்று smoke-test செய்வதற்கு Playwright *சரியான* கருவிதான் — அது வேறு வேலை.)

**உலாவி இலக்கு பகுதியளவு விதிவிலக்கு.** அங்கே Avalonia backend திறந்த படிவங்களின் ஒரு [ARIA DOM பிரதியை](#tree) வைத்திருக்கிறது, எனவே ஒரு DOM கருவி கட்டுப்பாடுகளைக் கண்டுபிடிக்க *முடியும்* — role மற்றும் name மூலம், அல்லது `[data-mf-automation-id="okButton"]` மூலம் — அவற்றின் நிலையைப் படிக்கவும் முடியும். உள்ளீடு (input) இன்னும் canvas-க்கே சொந்தம்: பிரதி elements `pointer-events: none` ஆக உள்ளன, எனவே DOM click மூலம் அல்லாமல், element-இன் bounding box இல் கிளிக் செய்யுங்கள் (`locator.boundingBox ()` பின்னர் `page.mouse.click`). உலாவி smoke test-க்கு அது போதுமானது; சோதனைத் தொகுப்பின் பெரும்பகுதி இன்னும் level 1 இலேயே இருக்க வேண்டும்.

ஒரு சோதனைத் தொகுப்பை இவற்றைச் சுற்றி வடிவமைக்கும் முன் தெரிந்துகொள்ள வேண்டிய பிற எல்லைகள்:

| வரம்பு | விளைவு |
|---|---|
| ஒரு WebDriver session-க்கு ஒரு சாளரம் | Frame அல்லது சாளர மாற்றம் இல்லை; பல-சாளர ஓட்டங்கள் level 1 இல் இருக்க வேண்டும் |
| Screenshots-க்கு Headless backend தேவை | Desktop-hosted சாளரத்துக்கு எதிராக `GET …/screenshot` தோல்வியடைகிறது ([மேலே](#level-2)); headless ஓட்டத்தில் பிடியுங்கள் |
| Tab headers மற்றும் grid cells மரத்தில் இல்லை | Menu, toolbar மற்றும் list items உள்ளன ([மேலே](#tree)); tabs மற்றும் `DataGridView` cells-க்கு இன்னும் சொந்த nodes தேவை |
| ஒவ்வொரு item-க்குமான தேர்வு நிலை இல்லை | தேர்ந்தெடுக்கப்பட்ட item-க்கு list-இன் `value`-ஐப் படியுங்கள்; ஒரு item இன்னும் தானாக "selected" என்று அறிவிக்க முடியாது |
| மறைந்த கட்டுப்பாடுகள் மரத்திலிருந்து விடுபடுகின்றன | கண்ணுக்குத் தெரியாத கட்டுப்பாட்டின் உள்ளடக்கத்தை உறுதிப்படுத்த முடியாது — அதற்குப் பதிலாகத் தெரிவுநிலையை உறுதிப்படுத்துங்கள் |
| JavaScript இயக்க endpoint இல்லை | `execute/sync` மேல் கட்டப்பட்ட Selenium APIs (`ExecuteScript`, `GetAttribute`, JS-அடிப்படையிலான waits) கிடைக்காது; `GetDomAttribute` மற்றும் உங்கள் சொந்த polling-ஐப் பயன்படுத்துங்கள் |
| Implicit waits இல்லை | உங்கள் சொந்த [`Wait` helper](#waits)-ஐக் கொண்டுவாருங்கள் |
| UIA எழுதும் patterns முழுமையற்றவை | உரையை level 1/2 வழியாக அமையுங்கள்; level 3-ஐ அறிவிப்பைச் சரிபார்க்கப் பயன்படுத்துங்கள், உள்ளீட்டை இயக்க அல்ல |
| UIA package compile நேரத்தில் Windows-க்கு மட்டுமானது | `#if WINDOWS` கொண்டு பாதுகாக்குங்கள் அல்லது Windows-மட்டும் திட்டத்தில் தனிமைப்படுத்துங்கள் |
| `AutomationElement` மாற்ற முடியாத snapshot | செயல்கள் பிடிக்கப்பட்ட element-ஐ ஏற்கின்றன; **வாசிப்புகள் மீண்டும் தீர்க்க வேண்டும்** ([மேலே](#level-1)) |
| சோதனைகள் global backend நிலையைப் பகிர்கின்றன | எப்போதும் வரிசையான (serial) இயக்கம் |

பெரும்பாலான வலிக்குக் காரணமான இரண்டு பழக்கங்கள்:

- **Scale-1 பிக்சல் வடிவவியலை உறுதிப்படுத்தாதீர்கள்.** Framework-இன் சொந்த HiDPI தோல்விகள் கிட்டத்தட்ட முழுவதுமாக ஒரே குழப்பம்தான் — தருக்க அலகுகள் எதிர் சாதன அலகுகள். 2026-10-01 முதல் பொது மேற்பரப்பு சீராக **தருக்க (logical)** அலகுகளில் உள்ளது: `Bounds`, `ClientRectangle`, `ClientSize`, `MouseEventArgs`, `GetTabRect`, மற்றும் paint canvas (`OnPaint`, `e.ClipRectangle`) அனைத்தும் ஒரே அலகைப் பகிர்கின்றன, framework உங்களுக்காக canvas-ஐ அளவிடுகிறது (இன்னும் `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` அழைக்கும் custom கட்டுப்பாடு இப்போது இருமுறை அளவிடுகிறது — அதை நீக்குங்கள்). சாதனப் பிக்சல்கள் அப்படிப் பெயரிடப்பட்ட இடங்களில் மட்டுமே அணுகக்கூடியவை — `Scaled*` குடும்பம் (`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling`, `LogicalToDeviceUnits`, back buffers மற்றும் பிடிக்கப்பட்ட bitmaps — கூடவே எஞ்சியிருக்கும் விதிவிலக்கு: **owner-draw நிகழ்வுகள்** (`DrawItem`, `DrawNode`, `CellPainting`) இன்னும் சாதனப் பிக்சல் எல்லைகளைத் தருகின்றன. இரண்டு அலகு முறைகளும் scale 1 இல் ஒன்றேதான், எனவே அளவிடப்பட்ட திரை வரும் வரை அவற்றைக் கலப்பது கண்ணுக்குத் தெரியாது. விகிதாசாரமாக உறுதிப்படுத்துங்கள், `MF_HEADLESS_SCALE=2` வாயிலை இயக்குங்கள்.
- **ஒரு runner-இன் கீழ் Avalonia backend இல் சோதிக்காதீர்கள்.** அது வேலை செய்வது போலத் தோன்றி, பின்னர் deadlock ஆகும் அல்லது சீரற்று நடந்துகொள்ளும், ஏனெனில் அதன் dispatcher ஒரு thread-உடன் கட்டப்பட்டுள்ளது. Headless இதற்காகவே உள்ளது.

---

## வழிவரைபடம் (Roadmap)
{:#roadmap}

- ✅ **Windows UI Automation bridge** — திரை வாசிப்பான்கள், உருப்பெருக்கிகள், ஏற்கனவே உள்ள UIA கருவிகள் (FlaUI, Appium/WinAppDriver), custom protocol எதுவுமின்றி.
- UIA patterns-ஐ முழுமையாக்குதல்: `Value`/`Toggle` எழுதும் ஆதரவு, structure-changed நிகழ்வுகள், மற்றும் `TextBox` ஒவ்வொரு விசை அழுத்தத்துக்குமான value நிகழ்வுகள் (editor இலிருந்து `TextChanged` எழுப்புதல்).
- ✅ **உலாவி அணுகல்தன்மை DOM** — `net10.0-browser` இல் அதே மரம் live regions உடன் ARIA elements ஆகப் பிரதிபலிக்கப்படுகிறது, எனவே திரை வாசிப்பான்கள், find-in-page மற்றும் DOM சோதனைக் கருவிகள் UI-ஐப் பார்க்க முடியும் ([விவரங்கள்]({{ '/ta/backends/' | relative_url }}#accessibility-dom-browser)). உண்மையான திரை வாசிப்பான் மூலம் இன்னும் கேட்கப்படவில்லை — headless Chrome இல் DOM-ஐப் படித்துச் சரிபார்க்கப்பட்டது.
- அதே மரத்தின் மேல் **AT-SPI (Linux)** மற்றும் **NSAccessibility (macOS)** bridges.
- ✅ **கட்டுப்பாடு அல்லாத items**: menu items, toolbar பொத்தான்கள் மற்றும் `ListBox` items மரத்தில் உள்ளன, அவற்றின் சொந்த எல்லைகளுடன், கிளிக் செய்யக்கூடியவையாக.
- ✅ **Custom-painted கட்டுப்பாடுகள் தங்கள் சொந்த மதிப்பையும் கூடுதல் நிலையையும் வெளியிட முடியும்** (`IAutomationStateProvider`) — [மேலே](#custom-controls) பாருங்கள்.
- ✅ **UIA இல் live regions மற்றும் உதவி உரை** — `Label.LiveSetting` LiveRegionChanged-ஐ எழுப்புகிறது; `QueryAccessibilityHelp` HelpText-ஐ வழங்குகிறது.
- Roles மற்றும் நிலைகளை விரிவாக்குதல் (தேர்வு, expand/collapse, மதிப்பு வரம்புகள்) — ஒரு `ListBox` item இன்னும் தான் தேர்ந்தெடுக்கப்பட்டது என்று தானாக அறிவிக்க முடியாது, அதனால்தான் list அதைக் கொண்டுள்ளது; `IAutomationStateProvider`-இன் சொந்த `State` field ஒரு built-in கட்டுப்பாடு இதற்கும் பயன்படுத்துவதற்காக உள்ளது, ஆனால் `ListBox`-க்கு இன்னும் இணைக்கப்படவில்லை.
- எஞ்சிய painted items-ஐ வெளிக்கொணர்தல்: tab headers, `DataGridView` cells, tree nodes.
- உயர்-மட்ட `Majorsilence.Forms.Testing` பயன்பாட்டு வசதி அடுக்கு — fluent helpers மற்றும் golden-image asserts, இதனால் மேலே உள்ள [wait helper](#waits) மற்றும் [golden-image குழாய் இணைப்பு](#visual) இனி நீங்கள் பராமரிக்க வேண்டியவை அல்ல.

---

## அடுத்து எங்கே செல்வது
{:#next}

- [பயிற்சி வழிகாட்டி, module 8]({{ '/ta/training/' | relative_url }}#module-8) — இந்த உள்ளடக்கம் ஒரே பார்வையில், பரந்த பாடத்திட்டத்துக்குள்.
- [Module 10]({{ '/ta/training/' | relative_url }}#module-10-ci) — ஒரு பயன்பாட்டுக்கான முழு CI வாயில் பட்டியல், இடம்பெயர்த்தல் விலகல் (migration drift) உட்பட.
- [தள backends]({{ '/ta/backends/' | relative_url }}) — Headless backend என்றால் என்ன, மற்றும் ஒரே சோதனைத் தொகுப்பு ஒவ்வொரு இலக்கையும் உள்ளடக்க உதவும் இணைப்புக்கோடு (seam).
