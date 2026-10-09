---
layout: docs
lang: si
title: ස්වයංක්‍රීයකරණය සහ UI පරීක්ෂණ
subtitle: එක් ස්වයංක්‍රීයකරණ ගසයක් — in-process පරීක්ෂණ, Selenium, තිර කියවන, සහ AI agents සඳහා MCP server එකක් — සහ ඒ මත සැබෑ පරීක්ෂණ කට්ටලයක් ගොඩනඟන ආකාරය. සෑම නිදසුනක්ම C# සහ VB.NET යන දෙකෙන්ම.
seo_title: "WinForms UI පරීක්ෂණ සහ ස්වයංක්‍රීයකරණය — Headless CI, Selenium සහ MCP"
description: >-
  එක් ස්වයංක්‍රීයකරණ ගසයක් (automation tree) හරහා බහු-වේදිකා WinForms යෙදුමක් ස්වයංක්‍රීය කර පරීක්ෂා කරන්න:
  in-process UI පරීක්ෂණ, headless CI, W3C WebDriver server එකක්, තිර කියවන (Windows UIA සහ බ්‍රවුසරයේ ARIA),
  සහ ධාවනය වන යෙදුම AI agents වලට පාලනය කිරීමට ඉඩ දෙන MCP server එකක්.
keywords:
  - winforms ui පරීක්ෂණ
  - winforms ui testing
  - winforms යෙදුම ස්වයංක්‍රීය කිරීම
  - winforms selenium webdriver
  - headless winforms ci
  - winforms තිර කියවනය accessibility
  - mcp
  - ai agent ui testing
priority: "0.8"
permalink: /si/automation/
---

Majorsilence.Forms, backend-මධ්‍යස්ථ **ස්වයංක්‍රීයකරණ ගසයක් (automation tree)** ලබා දෙයි: ids, නම්, භූමිකා (roles), අගයන්,
තත්ත්වය (state) සහ මායිම් (bounds) සහිත, සජීවී පාලක ධුරාවලියේ ක්ෂණික රූපයක් (snapshot). මෙම පිටුව එම ගසය පිළිබඳ
යොමු මාර්ගෝපදේශය මෙන්ම, ඒ මත **ඔබේ** යෙදුම පරීක්ෂා කිරීම සඳහා වන ප්‍රායෝගික මාර්ගෝපදේශයද වේ — page objects, waits,
කර්මාන්තයේ මෙවලම්, දෘශ්‍ය ප්‍රතිගමන පරීක්ෂණ (visual regression), CI වට්ටෝරු, සහ AI agents එම මතුපිටටම සම්බන්ධ වන ආකාරය.

පුහුණු මාර්ගෝපදේශයේ [Module 8]({{ '/si/training/' | relative_url }}#module-8) කෙටි අනුවාදයයි.

මෙහි ඇති සියල්ල, එය ලියන අතරතුර macOS මත framework එකේ වත්මන් main branch එකට එරෙහිව ධාවනය කරන ලදී — සැබෑ
Selenium `RemoteWebDriver` session එකක්ද ඇතුළුව. යමක් ක්‍රියා නොකරන තැන, එය එසේ බව පවසයි.

---

## පටුන
{:#contents}

- [එක් ගසයක්, පරිභෝජකයින් හතරක්](#tree)
- [අභිරුචි ලෙස අඳින (custom-painted) පාලක: ඔබේම අගය සහ තත්ත්වය ප්‍රකාශ කිරීම](#custom-controls)
- [ඔබේ මට්ටම තෝරන්න](#levels)
- [පූර්වාවශ්‍යතා හතරක්](#prerequisites)
- [මට්ටම 1 — headless backend මත in-process පරීක්ෂණ](#level-1)
- [`Thread.Sleep` නොමැතිව රැඳී සිටීම](#waits)
- [Page objects](#page-objects)
- [මට්ටම 2 — Selenium සහ WebDriver server](#level-2)
- [inspector එකක් මගින් locators පටිගත කිරීම](#inspector)
- [මට්ටම 3 — Windows-ස්වදේශීය මෙවලම් (FlaUI, WinAppDriver, Appium)](#level-3)
- [golden images සමඟ දෘශ්‍ය ප්‍රතිගමන පරීක්ෂණ](#visual)
- [BDD: ඉහළින් Reqnroll / SpecFlow](#bdd)
- [CI වට්ටෝරු](#ci)
- [AI මෙවලම් මේ සියල්ලට සම්බන්ධ වන ආකාරය](#ai)
- [සීමා සහ වැරදි රටා (anti-patterns)](#limits)
- [මාර්ග සිතියම (Roadmap)](#roadmap)

---

## එක් ගසයක්, පරිභෝජකයින් හතරක්
{:#tree}

ගසය, විදැහුම්කාරක (renderers) භාවිත කරන එම තාර්කික මායිම් සහ තත්ත්වයම කියවයි, එබැවින් එය headless backend
සහ සැබෑ backends (Avalonia, Uno, GTK 4, සහ අනෙකුත් — බලන්න
[වේදිකා backends]({{ '/si/backends/' | relative_url }})) මත එක හා සමානව හැසිරේ — **Headless එකට එරෙහිව ලියූ පරීක්ෂණයක්,
පරිශීලකයෙකු Avalonia මත දකින දේ විස්තර කරයි.** එම එක් ආකෘතියම පරිභෝජනය කරන්නේ දේවල් හතරකි:

| පරිභෝජකයා | පැකේජය | එය ඔබට ලබා දෙන දේ |
|---|---|---|
| In-process UI පරීක්ෂණ | `Majorsilence.Forms.Automation` (core පැකේජය තුළ) | පික්සල් ගණනය කිරීමකින් තොරව C#/VB වෙතින් පෝරමයක් පාලනය කරන්න |
| දුරස්ථ ස්වයංක්‍රීයකරණය | `Majorsilence.Forms.WebDriver` | ඕනෑම Selenium client එකකට පාලනය කළ හැකි W3C WebDriver server එකක් — සහ AI agents සඳහා වන [MCP server](#ai-mcp) කතා කරන්නේද එයටයි |
| තිර කියවන සහ විශාලන (Windows) | `Majorsilence.Forms.WindowsUIAutomation` | Windows මත Narrator / NVDA / JAWS |
| තිර කියවන සහ DOM මෙවලම් (බ්‍රවුසරය) | `net10.0-browser` මත `Majorsilence.Forms.Avalonia` තුළ ගොඩනඟා ඇත | canvas එක අසල, විවෘත පෝරමවල විනිවිද පෙනෙන ARIA DOM පිළිබිඹුවක් — එක් එක් පාලකයට role, name, state සහ bounds, සහ live regions ([විස්තර]({{ '/si/backends/' | relative_url }}#accessibility-dom-browser)) |

ඒ සෑම එකක්ම දකින්නේ එකම දෙයයි, සහ එම දෙය **පෙළ (text)** වේ. `session.GetPageSource()` සජීවී UI එක XML ලෙස
විදැහුම් කරයි — locators පටිගත කළ හැකි, snapshots diff කළ හැකි, සහ එක පික්සලයක්වත් නොමැතිව
[AI agents ප්‍රයෝජනවත්](#ai) වන්නේ ඒ නිසාය:

```xml
<Form name="Login" role="window" type="Form" x="0" y="0" width="400" height="300">
  <Button id="okButton" name="OK" role="button" type="Button"
          value="" enabled="true" visible="true" x="10" y="10" width="100" height="30" />
  <TextBox id="nameBox" name="Full name" role="textbox" type="TextBox"
           value="" enabled="true" visible="true" x="10" y="50" width="200" height="30" />
</Form>
```

tag එක පාලක වර්ගයයි; `id` යනු `Control.Name`, `name` යනු ප්‍රවේශ්‍ය නාමය (accessible name) වේ. පහත සෑම locator එකක්ම
ගැළපෙන්නේ හරියටම එම attributes වලටයි.

**ගසයේ ඇති සියල්ල පාලක නොවේ.** Menu items, toolbar buttons, සහ `ListBox` items child පාලක ලෙස ධාරණය
කරනු වෙනුවට ඒවායේ මව් පාලකය විසින් අඳිනු ලැබේ, එබැවින් පාලක ධුරාවලියෙන් පමණක් ගොඩනැඟූ ගසයක් strip එකෙන් හෝ
list එකෙන් නතර විය — ඔබට `ToolStrip` එකක් සොයාගත හැකි වුවත් එහි කිසිවක් click කළ නොහැකි විය, නැතහොත් list එකක්
සොයාගත හැකි වුවත් එහි කිසිවක් කියවිය නොහැකි විය. දැන් ඒවා තමන්ගේම තිරය මත මායිම් සහිත, ස්වාධීන nodes වේ:

```xml
<ListBox id="wordList" name="wordList" role="list" type="ListBox" value="Beta" ... >
  <ListBoxItem id="" name="Alpha" role="listitem" type="ListBoxItem" x="11" y="11" width="258" height="17" />
  <ListBoxItem id="" name="Beta"  role="listitem" type="ListBoxItem" x="11" y="28" width="258" height="17" />
</ListBox>
```

items ගැන දැනගත යුතු කරුණු දෙකක් ඇත. ඒවාට **`id` එකක් නැත** — item එකකට තමන්ගේම `Name` එකක් නැති අතර, කෘත්‍රිම
දර්ශකයක් (index) list එක scroll වන විට ඔබට නොදැනීම වෙනස් වනු ඇත — එබැවින් ඒවා නම, පෙළ, හෝ XPath මගින් සොයන්න
(`By.Name ("Beta")`, `//*[@role='listitem']`). තවද **තෝරාගත් item එක කුමක්දැයි කියවන්නේ list එකෙනි**, එහි
`value` එය තෝරාගත් item එකයි; item එකක පෙළ එහි පෙළ ලෙසම පවතී. දර්ශනයට scroll වී ඇති items පමණක් දිස් වේ,
මන්ද තිරයෙන් පිටත ඇති item එකකට click කිරීමට සෘජුකෝණාස්‍රයක් නැති බැවිනි.

*Menu සහ toolbar items, list items, සහ ඒවා click කිරීම පිටුපස ඇති HiDPI hit-test නිවැරදි කිරීම 26.0.30 සිට සෑම
නිකුතුවකම ඇතුළත් කර ඇත — තවමත් 26.0.30 ට ස්ථිර කර ඇති ව්‍යාපෘතියක් පමණක් strip එක සහ list එක ඒවායේ අන්තර්ගතය නොමැතිව දකියි.*

### අභිරුචි ලෙස අඳින (custom-painted) පාලක: ඔබේම අගය සහ තත්ත්වය ප්‍රකාශ කිරීම
{:#custom-controls}

ඉහත සියල්ල ගොඩනඟා ඇති පාලක සඳහා කිසිදු සැකසීමකින් තොරව ක්‍රියා කරයි — `Button`, `TextBox`, `CheckBox` සහ
අනෙකුත් ඒවා තමන්ගේම role සහ value වාර්තා කරන්නේ කෙසේදැයි දැනටමත් දනී. අභිරුචි ලෙස අඳින පාලකයකට (ඔබ විසින්ම
`OnPaint` තුළ අඳින එකක්) එවැනි අනුමානයක් මත යැපීමට නොහැක: වෙනත් කිසිවක් නොමැතිව, එය ගසයේ දිස් වන්නේ
`""` අගයක් සහ කිසිදු තත්ත්වයක් නොමැතිව, එහි වර්ග නාමයෙන් අනුමාන කළ role එකක් පමණක් සමඟිනි.

**Role සහ name සඳහා දැනටමත් ස්ථානයක් ඇත**, ඕනෑම පාලකයක් සඳහා: `Control.AccessibleRole` සහ
`Control.AccessibleName` (දැනට පවතින WinForms-ගැළපෙන properties) ගොඩනඟා ඇති අනුමානයට පෙර පරීක්ෂා කෙරේ,
එබැවින් ඒවා සැකසීම අභිරුචි පාලකයක් සඳහාද වෙනත් ඕනෑම දෙයක් සඳහා මෙන්ම ක්‍රියා කරයි — එම දෙක සඳහා නව API
එකක් අවශ්‍ය නැත.

**Value සහ අමතර state සඳහා `IAutomationStateProvider` අවශ්‍ය වේ.** එය ඔබේ පාලකය මත implement කරන්න, එවිට
ගසය අනුමාන කරනු වෙනුවට එය භාවිත කරයි — නිදසුනක් ලෙස, තත්ත්ව widget එකක් පෙන්වන මට්ටම:

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

    protected override void OnPaint (PaintEventArgs e) { /* beacon එක අඳින්න */ }
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
        ' beacon එක අඳින්න
    End Sub
End Class
```

`AccessibleRole`/`AccessibleName` ද සකසන්න, එවිට element එක හතරම රැගෙන යයි:

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

...එය `session.GetPageSource()` තුළ ගොඩනඟා ඇති පාලකයක් ලෙසම දිස් වේ, ඊට අමතරව එක් එක් ප්‍රවේශයට `state-{key}`
attribute එකක් සමඟ — එක් පාරදෘශ්‍ය නොවන ගොන්නක් නොව, ස්වාධීනව query කළ හැකි ලෙස:

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

එම `state-{key}` නාමයම WebDriver හි `getAttribute` හරහාද ක්‍රියා කරයි — page source එකෙන් හෝ සජීවී `getAttribute`
ඇමතුමකින් ග්‍රහණය කළ locator එකක් එකම attribute එක දකියි. Keys සරල identifiers විය යුතුය
(අකුරු, ඉලක්කම්, `-`/`_`): අසාමාන්‍ය key එකක් XML attribute *නාමය* සඳහා පාලක වර්ග නාමයක් මෙන්ම sanitize
කෙරේ, නමුත් `getAttribute` key එක sanitize නොකර සොයයි, එබැවින් sanitize කිරීම අවශ්‍ය වූ key එකක් සඳහා
දෙක එකඟ නොවනු ඇත.

`AutomationValue` ගොඩනඟා ඇති අනුමානය සම්පූර්ණයෙන්ම ප්‍රතිස්ථාපනය කරයි, එය සමඟ මිශ්‍ර නොවේ — `"true"`/`"false"`
අවශ්‍ය `CheckBox` වැනි අභිරුචි පාලකයක් `ValueOf` හි switch එක නොමිලේ ලබා ගැනීම වෙනුවට එය තමන් විසින්ම වාර්තා
කරයි. ගොඩනඟා ඇති සෑම පාලකයකම `State` හිස්ව පවතී; මෙහි කිසිවක්, පවතින පාලකයක් (interface එක implement නොකරන
එකක්) වාර්තා කරන දේ වෙනස් නොකරයි.

එම state එකම අනෙකුත් පරිභෝජකයින් වෙතද ළඟා වේ: බ්‍රවුසරයේ එය පාලකයේ ARIA පිළිබිඹු element එක මත
`data-mf-state-*` attributes ලෙස දිස් වේ, එබැවින් ඔබ ස්වයංක්‍රීය කළ හැකි කරන අභිරුචි පාලකයක් තිර කියවනයකට
විස්තර කළ හැකි එකක්ද වේ.

---

## ඔබේ මට්ටම තෝරන්න
{:#levels}

ඇතුළු වීමට මාර්ග තුනක් ඇති අතර, ඒවා සියල්ල *එකම* ස්වයංක්‍රීයකරණ ගසය පරිභෝජනය කරයි — එබැවින් එක් මට්ටමක ඔබ
ලියන locator එකක් අනෙක් මට්ටම්වලද වලංගු වේ.

| මට්ටම | යෙදුම පාලනය කරන්නේ කුමක්ද | display එකක් නොමැතිව ධාවනය වේද | භාවිත කරන්නේ |
|---|---|---|---|
| **1. In-process** — `AutomationSession` | එකම process එකේ ඇති ඔබේ පරීක්ෂණ කේතය | **ඔව්** (Headless backend) | ඔබේ කට්ටලයේ වැඩි කොටස. වේගවත්, debug කළ හැකි, ports නැත, drivers නැත. |
| **2. Remote** — `WebDriverServer` + Selenium | HTTP හරහා ඕනෑම W3C WebDriver client එකක් | ඔව් | පවතින Selenium කට්ටලයක් නැවත භාවිතය, .NET නොවන පරීක්ෂණ භාෂා, inspector එකක් මගින් locators පටිගත කිරීම. |
| **3. Windows-native** — UIA bridge | FlaUI, WinAppDriver, Appium, Accessibility Insights | නැත (Windows desktop session එකක් අවශ්‍යයි) | සැබෑ තිර කියවන හැසිරීම තහවුරු කිරීම, සහ ඔබේ Windows QA කණ්ඩායම දැනටමත් සතු මෙවලම් මගින් යෙදුම පාලනය කිරීම. |

ආවරණය සඳහා **පෙරනිමියෙන් මට්ටම 1** ද, ප්‍රවේශ්‍යතා (accessibility) තහවුරු කිරීම සඳහා මට්ටම 3 ද භාවිත කරන්න. .NET වලින්
පිටත යමකට යෙදුම පාලනය කිරීමට සිදු වූ විට මට්ටම 2 වෙත යොමු වන්න.

---

## පූර්වාවශ්‍යතා හතරක්
{:#prerequisites}

මේවා වැරදුණොත් සෑම මට්ටමක්ම ව්‍යාකූල ආකාරවලින් වැරදි ලෙස හැසිරේ.

### 1. සෑම අන්තර්ක්‍රියාකාරී පාලකයකටම නමක් දෙන්න
{:#prerequisites-names}

Locators රඳා පවතින්නේ properties දෙකක් මතය. `Control.Name` element එකේ **AutomationId** බවට පත් වේ — ස්ථායී
locator එක. `Control.AccessibleName` (නොමැති නම් `Text`, ඉන්පසු `Name`) එහි **Name** බවට පත් වේ.

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

එය review නීතියක් කරන්න. එකම යතුරු එබීම පරීක්ෂණ locator එකක් *සහ* තිර කියවන සහාය යන දෙකම ලබා දෙයි, තවද
පවතින යෙදුමක් පුරා පසුව නම් එක් කිරීම UI පරීක්ෂණ භාවිතයට ගැනීමේ වඩාත්ම වෙහෙසකර කොටසයි.

### 2. ස්වයංක්‍රීය කිරීමට පෙර layout pass එකක් බල කරන්න
{:#prerequisites-layout}

පෝරමය layout වන තුරු bounds සහ hit-testing නොපවතී. headless backend මත යමක් frame එකක් ඉල්ලන තුරු කිසිවක්
layout නොවේ, එබැවින් පරීක්ෂණයක් කරන පළමු දෙය එක් වරක් විදැහුම් කිරීමයි:

**C#**

```csharp
using var form = new GreetForm ();
HeadlessRenderer.CapturePng (form, 360, 140);   // layout බල කරයි; bytes ඉවත දමන්න
```

**VB.NET**

```vb
Using form As New GreetForm()
    HeadlessRenderer.CapturePng(form, 360, 140)   ' layout බල කරයි; bytes ඉවත දමන්න
End Using
```

එය මඟ හැරියොත් `Click` කිසිවක් මත පතිත නොවේ, මන්ද සෑම පාලකයකම `Bounds` තවමත් හිස් බැවිනි. ඔබට `Show()`
ඇමතීමට **අවශ්‍ය නැත** — පෙන්වා නැති පෝරමයක් in-process ලෙස සම්පූර්ණයෙන්ම ස්වයංක්‍රීය කළ හැක.

### 3. UI පරීක්ෂණ අනුක්‍රමිකව ධාවනය කරන්න
{:#prerequisites-serial}

සක්‍රිය backend එක (`Platform.Backend`) සහ `Application.OpenForms` process-ගෝලීය වේ. ඒවා බෙදා ගන්නා පරීක්ෂණ
සමාන්තරව ධාවනය කළ නොහැක — එක් පරීක්ෂණයක ඇති modal සංවාද කවුළුවක් තම හිමිකරු ගෝලීය open-forms ලැයිස්තුවෙන්
තෝරා ගන්නා අතර, වෙනත් පරීක්ෂණයක කවුළුවක් මත සදහටම රැඳී සිටිය හැක.

**C# (xUnit)**

```csharp
using Xunit;

// backend එක සහ Application.OpenForms ගෝලීය process state වේ.
[assembly: CollectionBehavior (DisableTestParallelization = true)]
```

NUnit: `[assembly: LevelOfParallelism(1)]` සහ `[Parallelizable]` නැත. MSTest: ඔබේ `.runsettings` වෙතින්
`<Parallelize>` ඉවත් කරන්න, නැතහොත් `Workers` `1` ලෙස සකසන්න.

UI නොවන පරීක්ෂණ සඳහා සමාන්තරකරණය තබා ගැනීමට ඔබ කැමති නම්, framework එකේම කට්ටලය කරන දේ කරන්න: backend එක
ස්පර්ශ කරන සෑම class එකක්ම එක් xUnit collection එකකට (`[Collection ("Headless")]`) දමන්න, xUnit එය අනුක්‍රමිකව
ධාවනය කරයි, සහ ඉතිරිය නිදහසේ තබන්න. framework එක එම සම්මුතිය පරීක්ෂණයක් මගින් බලාත්මක කරයි
([`HeadlessCollectionConventionTests`]({{ site.github_url }}/blob/main/tests/Majorsilence.Forms.Tests/HeadlessCollectionConventionTests.cs))
— එය compile කළ assembly එකේ `HeadlessRenderer.Use ()` ඇමතුම් සොයා, attribute එක නොමැතිව එවැනි ඇමතුමක් කළ
ඕනෑම class එකක් නම් කරමින් අසාර්ථක වේ — එය බලාත්මක කිරීමට පෙර එක් වරක් ගොනු හැත්තෑවක් සම්මුතියෙන් බැහැර විය,
එබැවින් ඔබ මෙම රටාව භාවිතයට ගන්නේ නම්, ආරක්ෂකයද (guard) පිටපත් කරන්න.

### 4. එක් assembly එකකට එක් වරක් Headless backend එක ස්ථාපනය කරන්න
{:#prerequisites-bootstrap}

**C# — module initializer එකක් වඩාත්ම පිළිවෙළ hook එකයි**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Backends;
using Majorsilence.Forms.Headless;

internal static class TestBackend
{
    // assembly එකේ ඕනෑම පරීක්ෂණයකට පෙර ධාවනය වේ. Headless backend එකට UI-thread
    // dispatcher සම්බන්ධතාවයක් නැත, test runner එකක worker threads යටතේ එය ආරක්ෂිත වන්නේ එබැවිනි.
    [ModuleInitializer]
    internal static void Init () => Platform.Backend = new HeadlessPlatformBackend ();
}
```

**VB.NET — VB හි module initializer නැත**

```vb
Imports Majorsilence.Forms.Backends
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBackend
    ' VB හට <ModuleInitializer> භාවිත කළ නොහැක — VB compiler එක module initializers
    ' නිකුත් නොකරයි, එබැවින් attribute එක පමණක් නිහඬව කිසිවක් නොකරන අතර සෑම පරීක්ෂණයක්ම
    ' backend එකක් නොමැතිව ධාවනය වනු ඇත. ඒ වෙනුවට framework එකේ assembly-මට්ටමේ hook එක භාවිත කරන්න:
    ' MSTest <AssemblyInitialize>, NUnit <SetUpFixture> + <OneTimeSetUp>, හෝ
    ' xUnit assembly fixture එකක්.
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        Platform.Backend = New HeadlessPlatformBackend()
    End Sub
End Class
```

ඔබ කැමති නම් `HeadlessRenderer.Use ()` ද එයම කරයි, දැනගත යුතු එක් අමතර හැසිරීමක් සමඟ: Headless backend එක
දැනටමත් සක්‍රිය නැති විට එය ස්ථාපනය කිරීමට අමතරව, **සෑම ඇමතුමක්ම ඇමතුම් කරන thread එක Headless backend එකේ
UI thread එක බවට පත් කරයි**. test runner එකක් යටතේ එය වැදගත් වේ, මන්ද එය සෑම පරීක්ෂණයක්ම නිදහස්ව ඇති ඕනෑම
worker thread එකකට භාර දෙන බැවිනි: `Application.RunOnUIThread` සහ backend එකේ පෝලිම "මම UI thread එකේද?"
යන්න තීරණය කරන්නේ thread id මගිනි, එබැවින් කවදා හෝ ඇසූ *පළමු* thread එක පමණක් මතක තබා ගන්නා backend එකක්
පසුව එන සෑම පරීක්ෂණයකම වැඩ thread එකෙන් පිටත ලෙස සලකනු ඇත. එබැවින් framework එකේම කට්ටලය assembly එකකට එක් වරක්
නොව, සෑම පරීක්ෂණයකම ආරම්භයේ `HeadlessRenderer.Use ()` අමතයි — ඔබේ පරීක්ෂණ වැඩ නැවත UI thread එකට marshal
කරන්නේ නම් පිටපත් කිරීමට වටින, අඩු වියදම් පුරුද්දකි.

> **Avalonia backend එක මත UI පරීක්ෂණ ධාවනය නොකරන්න.** Avalonia හි dispatcher එක thread-බැඳි වන අතර
> test runner එකක worker threads සමඟ ගැටේ. Headless backend එක පවතින්නේ ඔබේ කට්ටලයට display එකක් *හෝ*
> UI thread එකක් අවශ්‍ය නොවීමටමය — framework එකේම කට්ටලය එය මත ධාවනය වන්නේ එබැවිනි.

---

## මට්ටම 1 — headless backend මත in-process පරීක්ෂණ
{:#level-1}

API එක එක් වාඩිවීමකින් ඉගෙන ගත හැකි තරම් කුඩාය.

| ඇමතුම | කරන දේ |
|---|---|
| `new AutomationSession (form)` | පෝරමයක් (හෝ ඕනෑම `WindowBase` එකක්) ආවරණය කරයි |
| `session.Find (by)` / `FindOrThrow (by)` / `FindAll (by)` | සෑම වරම **නැවුම්** snapshot එකක් query කරයි |
| `By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` | Locators |
| `session.Click (element)` | සැබෑ input pipeline එක හරහා ඔබයි |
| `session.SendKeys (element, text)` | Focus + type |
| `session.PressKey (Keys.Enter)` | focus කළ පාලකයට, තනි යතුරක් |
| `session.Clear (element)` | සංස්කරණය කළ හැකි පාලකයක් හිස් කරයි |
| `session.GetText (element)` | value/text කියවයි |
| `session.Root` / `session.GetPageSource ()` | සම්පූර්ණ ගසය objects ලෙස / XML ලෙස |

Elements මගින් `AutomationId`, `Name`, `Role`, `ControlType`, `Value`, `State` (අභිරුචි ලෙස අඳින පාලකයක
තමන්ගේම අමතර state — [ඉහත](#custom-controls) බලන්න; ගොඩනඟා ඇති සෑම පාලකයකටම හිස්), `Enabled`, `Visible`,
`Focused`, `Bounds`, `Children`, `ClickPoint`, සහ `Descendants()` ලබා දේ.

> **`AutomationElement` එකක් වෙනස් කළ නොහැකි snapshot එකකි — කියවීමට පෙර නැවත resolve කරන්න.** සැමටම මුහුණ
> දීමට සිදු වන එකම උගුල මෙයයි, තවද එය අසමමිතිකය: කලින් ග්‍රහණය කළ element එකක් මත *ක්‍රියා* හොඳින් ක්‍රියා කරයි
> (`Click`/`SendKeys` සජීවී පාලකයට යොමු වේ), නමුත් *කියවීම්* ග්‍රහණය කළ මොහොතේ state එක ආපසු ලබා දෙයි.
>
> ```csharp
> var box = session.FindOrThrow (By.Id ("nameBox"));
> session.SendKeys (box, "Ada");          // ක්‍රියා කරයි — ක්‍රියාව සජීවී පාලකයට ළඟා වේ
> session.GetText (box);                  // "" — මෙම snapshot එක ටයිප් කිරීමට පෙර එකකි
> session.GetText (session.FindOrThrow (By.Id ("nameBox")));   // "Ada" — නැවුම් snapshot එක
> ```
>
> එබැවින්: ඔබ කැමති නම් ක්‍රියා සඳහා ග්‍රහණය කරන්න, නමුත් `GetText`, `Enabled`, `Visible`, `Value`
> සහ `Bounds` සඳහා සැමවිටම නැවත `Find` කරන්න. [පහත page-object රටාව](#page-objects) locators *properties*
> ලෙස නිරාවරණය කිරීමෙන් මෙය ස්වයංක්‍රීය කරයි.

සම්පූර්ණ පරීක්ෂණයක්:

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

        // ඔබේම field references මත නොව, ගසයෙන් කියවූ state මත assert කරන්න.
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

`Click` සහ `SendKeys` සැබෑ backend එකක් භාවිත කරන එම මධ්‍යස්ථ input මාර්ගය හරහාම යයි, එබැවින් ඒවා පරීක්ෂණයට පමණක්
වූ කෙටිමඟක් නොව, සැබෑ routing, focus සහ layout ක්‍රියාත්මක කරයි. headless assertion එකක් අර්ථවත් වන්නේ එබැවිනි.

### ස්ථායී id එකක් නොමැති විට XPath
{:#level-1-xpath}

`By.XPath` ධාවනය වන්නේ `GetPageSource()` ආපසු ලබා දෙන එම XML එකටමය, එබැවින් ඔබ දකින දේ ඔබට ගැළපිය හැක:

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

element තෝරන ප්‍රකාශන පමණි — ස්ථාන, attribute predicates සහ descendant axis සියල්ල ක්‍රියා කරයි.

### ඉඟියක් (gesture) අවශ්‍ය විට, පහළ මට්ටමේ input
{:#level-1-input}

`AutomationSession` click සහ type ආවරණය කරයි. drags, wheel scrolling, හෝ චලනයක් පුරා අල්ලාගෙන සිටින press එකක්
සඳහා, එක් මට්ටමක් පහළට `HeadlessRenderer` වෙත යන්න, එය කවුළු ඛණ්ඩාංකවලදී input ඇතුළු කරයි:

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

මෙහි ඛණ්ඩාංක **තාර්කික (logical)** වන අතර, renderer එක ඒවා ඔබ වෙනුවෙන් උපාංග පික්සල බවට පරිවර්තනය කරයි — ඔබ එම
පරීක්ෂණයම `MF_HEADLESS_SCALE=2` යටතේ ධාවනය කරන විටද මේවා දිගටම ක්‍රියා කරන්නේ එබැවිනි; එය framework එකේම CI එක
තම හැඩතල හතරෙන් එකක් ලෙස ධාවනය කරන අනුකරණය කළ-HiDPI ද්වාරයයි (Debug, Release, `MF_FORCE_CUSTOM_CHROME=1`, සහ
`MF_FORCE_CUSTOM_CHROME=1 MF_HEADLESS_SCALE=2`). ඔබේ කට්ටලයද ඒ යටතේ ධාවනය කරන්න; තාර්කික-එදිරිව-උපාංග
පටලැවිල්ලක් scale 1 දී නොපෙනේ.

---

## `Thread.Sleep` නොමැතිව රැඳී සිටීම
{:#waits}

**ගොඩනඟා ඇති implicit wait එකක් නැත**, සහ in-process පරීක්ෂණ සඳහා එය නිවැරදි පෙරනිමියයි: ඔබේ යෙදුම එසේ නොකළහොත්
කිසිවක් අසමමුහුර්ත (asynchronous) නොවේ. නමුත් ඔබේ කේතය background thread එකක වැඩ කර `Application.RunOnUIThread`
මගින් නැවත marshal කරන මොහොතේම, ඔබට නිදාගැනීම (sleep) වෙනුවට pump සහ poll කිරීමට සිදු වේ.

මෙය එක් වරක් ලියා සෑම තැනකම භාවිත කරන්න:

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

            // නැවත probe කිරීමට පෙර පෝලිමේ ඇති වැඩ (timers, RunOnUIThread callbacks) ධාවනය වීමට ඉඩ දෙන්න.
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

            ' නැවත probe කිරීමට පෙර පෝලිමේ ඇති වැඩ (timers, RunOnUIThread callbacks) ධාවනය වීමට ඉඩ දෙන්න.
            Platform.Backend.DoEvents()
            Thread.Sleep(10)
        Loop While clock.ElapsedMilliseconds < timeoutMs

        Throw New TimeoutException($"Timed out after {timeoutMs}ms: {message}")
    End Function
End Module
```

ඉන්පසු: `Wait.For (session, By.Id ("resultsGrid"))`, හෝ
`Wait.Until (() => session.GetText (label) == "Done" ? label : null, 5000, "label never said Done")`.

**කිසිවිටෙක `Thread.Sleep` පමණක් භාවිත නොකරන්න.** `DoEvents()` නොමැතිව පෝලිමේ ඇති callback එක කිසිදා ධාවනය නොවේ,
එබැවින් හුදු sleep එකක් පරීක්ෂණය මන්දගාමී කරයි *සහ* එය තවමත් අසාර්ථක වේ.

---

## Page objects
{:#page-objects}

පරීක්ෂණ 200 ක් පුරා විසිරී ඇති `By.Id ("okButton")` යනු UI කට්ටල නඩත්තු කිරීම මිල අධික කරන දෙයයි. සෑම තිරයක්ම
එක් වරක් ආවරණය (wrap) කරන්න.

**C#**

```csharp
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

public sealed class GreetPage
{
    private readonly AutomationSession session;

    public GreetPage (GreetForm form)
    {
        HeadlessRenderer.CapturePng (form, 360, 140);   // layout pass, එක් වරක්, මෙහි
        session = new AutomationSession (form);
    }

    // Locators පවතින්නේ හරියටම එක් තැනක පමණි.
    private AutomationElement NameBox => session.FindOrThrow (By.Id ("nameBox"));
    private AutomationElement Ok      => session.FindOrThrow (By.Id ("okButton"));
    private AutomationElement Cancel  => session.FindOrThrow (By.Id ("cancelButton"));

    // Methods කියවෙන්නේ clicks ලෙස නොව, පරිශීලක අභිප්‍රාය ලෙසය.
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
        HeadlessRenderer.CapturePng(form, 360, 140)     ' layout pass, එක් වරක්, මෙහි
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

Locators **fields නොව properties** ලෙස තිබීම වැදගත් වේ: `Find` සෑම ඇමතුමකදීම නැවුම් snapshot එකක් query කරයි,
එබැවින් UI එක වෙනස් වූ පසු property එකක් නැවත resolve වන අතර, cache කළ field එකක් යල් පැන යයි.

එවිට පරීක්ෂණය හැසිරීමක් ලෙස කියවේ:

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

## මට්ටම 2 — Selenium සහ WebDriver server
{:#level-2}

`Majorsilence.Forms.WebDriver` loopback මත HTTP හරහා **W3C WebDriver** endpoint එකක් ධාරණය කරයි. WebDriver යනු
හුදෙක් HTTP සහ JSON නිසා, ඕනෑම භාෂාවක ඕනෑම client එකකට ඔබේ desktop යෙදුම පාලනය කළ හැක — ඔබේ web කණ්ඩායම
දැනටමත් භාවිත කරන Selenium bindings ද ඇතුළුව.

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

using var server = new WebDriverServer (form, port: 4444);
server.Start ();

Console.WriteLine (server.Url);      // http://127.0.0.1:4444/  (loopback පමණි)

// … එය පාලනය කරන්න …

server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Using server As New WebDriverServer(form, port:=4444)
    server.Start()

    Console.WriteLine(server.Url)    ' http://127.0.0.1:4444/  (loopback පමණි)

    ' … එය පාලනය කරන්න …

    server.Stop()
End Using
```

**සහාය දක්වන commands:** new/delete session, find element(s), click, send keys, clear, get text, get name
(role), get attribute, get rect, get enabled, **page source** (`GET …/source`, XML), screenshot (PNG,
offscreen renderer හරහා), සහ `GET /status`.

දැනගත යුතු එක් අසමමිතියක්: ඉහත සියල්ල ඕනෑම backend එකක ඇති කවුළුවකට එරෙහිව ක්‍රියා කරයි, නමුත් **screenshots
Headless සඳහා පමණි**. `GET …/screenshot` විදැහුම් කරන්නේ `HeadlessRenderer` හරහාය, එය තමන් ධාරණය නොකරන කවුළුවක්
ප්‍රතික්ෂේප කරයි — Avalonia backend එකේ ඇති desktop යෙදුමකට එය යොමු කළොත් එය `Window is not hosted on
the Headless backend` ලෙස පිළිතුරු දෙයි. ඒ වෙනුවට ගසය කියවන්න, සහ screenshots ගන්න headless පරීක්ෂණ ධාවනයේදීය —
කෙසේ වෙතත් [golden images](#visual) පවතින්නේද එහිය.

**Locator උපාය මාර්ග:** `id`, `name`, `tag name` (role), `xpath`, `css selector` (`#id` සහ `[name='…']`
ආකෘති), ඊට අමතරව අභිරුචි `role`, `type`, සහ `link text`. Element references සෑම භාවිතයකදීම නැවුම් snapshot එකකට
එරෙහිව නැවත resolve වේ, ස්ථායී AutomationId එකට ප්‍රමුඛත්වය දෙමින් — එබැවින් යටින් ඇති UI එක වෙනස් වූ පසුවද
reference එකක් වලංගුව පවතී.

### සැබෑ Selenium client එක මගින් එය පාලනය කිරීම
{:#level-2-selenium}

Element ක්‍රියා UI thread එක මතට marshal කෙරේ, එබැවින් message loop එකක් නොමැති පරීක්ෂණයකදී, HTTP ඇමතුම් worker
එකක ධාවනය වන අතරතුර ඔබ main thread එකේ පෝලිම pump කරයි. framework එකේම පරීක්ෂණ භාවිත කරන රටාව මෙය වන අතර,
පිටපත් කළ යුත්තේද මෙයයි:

**C#**

```csharp
using System.Net;
using System.Net.Sockets;
using Majorsilence.Forms.WebDriver;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using MFPlatform = Majorsilence.Forms.Backends.Platform;   // පහත උගුල බලන්න

static int FreePort ()
{
    var listener = new TcpListener (IPAddress.Loopback, 0);
    listener.Start ();
    var port = ((IPEndPoint) listener.LocalEndpoint).Port;
    listener.Stop ();
    return port;                                   // CI තුළ කිසිවිටෙක 4444 hard-code නොකරන්න
}

static T RunPumped<T> (Func<T> work)
{
    var task = Task.Run (work);
    while (!task.IsCompleted) {
        MFPlatform.Backend.DoEvents ();            // මෙම thread එක මත pump කරන්න
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

උගුල් තුනක් — සියල්ල සොයාගත්තේ එය සැබවින්ම ධාවනය කිරීමෙනි:

1. **`Platform` අපැහැදිලිය.** `Majorsilence.Forms.Backends.Platform`, `OpenQA.Selenium.Platform` සමඟ ගැටේ
   — namespaces දෙකම import කරන මොහොතේම CS0104. ඉහත පරිදි එකකට alias එකක් දෙන්න.
2. **`GetAttribute` නොව `GetDomAttribute` භාවිත කරන්න.** Selenium 4 හි පැරණි `GetAttribute`,
   `/session/{id}/execute/sync` හරහා JavaScript atom එකක් ධාවනය කරයි, ස්වදේශීය (native) යෙදුමකට එයට සමාන දෙයක් නැත
   — එය `NotImplementedException` විසි කරයි. `GetDomAttribute` implement කර ඇති සරල `/attribute/{name}` endpoint
   එකට යන අතර, `id`, `name`, `role`, `type`, `value`, `enabled`, `visible`, සහ bounds ආපසු ලබා දෙයි.
3. **`By.CssSelector ("#id")` සහ `By.XPath` වලට ප්‍රමුඛත්වය දෙන්න.** Selenium හි .NET client එක `By.Name` සඳහා
   `using: "name"` යවන්නේ නැත — එය එය `*[name ="x"]` CSS selector එක ලෙස නැවත ලියයි. එම ආකෘතිය පිළිගනු
   ලැබේ, නමුත් `By.CssSelector ("#okButton")` සහ XPath අවම විස්මයජනක තේරීම් වේ. JavaScript අවශ්‍ය ඕනෑම දෙයක්
   (`ExecuteScript`, ඒ මත ගොඩනැඟූ implicit waits) සැලසුම අනුවම ලබා ගත නොහැක.

### නැතහොත් bindings සම්පූර්ණයෙන්ම මඟ හරින්න
{:#level-2-http}

smoke test එකක් සඳහා — නැතහොත් Selenium ස්ථාපනයක් නොමැති භාෂාවකින් — අමු protocol එක ඇමතුම් තුනකි:

```bash
SID=$(curl -s -XPOST 127.0.0.1:4444/session -d '{}' | jq -r .value.sessionId)

curl -s 127.0.0.1:4444/session/$SID/source                       # XML ගසය
curl -s -XPOST 127.0.0.1:4444/session/$SID/element \
     -d '{"using":"css selector","value":"#okButton"}'            # සොයන්න
curl -s -XPOST 127.0.0.1:4444/session/$SID/element/$EID/click -d '{}'
```

Python, framework එක ගැන කිසිදු දැනුමක් නොමැතිව:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Remote("http://127.0.0.1:4444", options=webdriver.ChromeOptions())
print(driver.page_source)                          # XML ගසය
driver.find_element(By.CSS_SELECTOR, "#okButton").click()
driver.quit()
```

Capabilities නොසලකා හරිනු ලැබේ — server එක සැමවිටම session එකක් ලබා දෙයි, එබැවින් ඔබේ client එකට අවශ්‍ය ඕනෑම දෙයක් යවන්න.

---

## inspector එකක් මගින් locators පටිගත කිරීම
{:#inspector}

server එක XML **page source** *සහ* හරියටම එම source එකට එරෙහිව ඇගයෙන `xpath` උපාය මාර්ගයක් නිරාවරණය කරන නිසා,
ඕනෑම Appium-ශෛලියේ inspector එකකට screenshot එකක් මත සජීවී element ගසය විදැහුම් කර, nodes click කිරීමෙන් locators
ග්‍රහණය කිරීමට ඔබට ඉඩ දිය හැක. inspector එකක් භාවිත කරන loop එක server එක implement කරන commands තුනක් පමණි:

| පියවර | Command | ආපසු ලබා දෙන්නේ |
|---|---|---|
| ගසයේ snapshot එකක් | `GET /session/{id}/source` | XML ([ඉහත නිදසුන](#tree) බලන්න) |
| UI එක පෙන්වන්න | `GET /session/{id}/screenshot` | base64 PNG |
| locator එකක් තහවුරු කරන්න | `POST /session/{id}/element` + `…/attribute/{name}` | element එක / එහි attributes |

නිර්දේශිත පටිගත කිරීමේ මාර්ගය මෙයයි: Selenium IDE බ්‍රවුසරයක් තුළ DOM සිදුවීම් පටිගත කරන අතර, ස්වදේශීය යෙදුමකට
සම්බන්ධ වීමට එයට ක්‍රමයක් නැත.

| සැකසුම | අගය |
|---|---|
| Remote Host | `127.0.0.1` |
| Remote Port | ඔබ `WebDriverServer` වෙත ලබා දුන් ඕනෑම අගයක් |
| Remote Path | `/` |
| Protocol | `http`, SSL නැත |
| Capabilities | ඕනෑම JSON object එකක් — capability ගැළපීම නොසලකා හරිනු ලැබේ |

ග්‍රහණය කළ locators මෙම අනුපිළිවෙළින් ප්‍රමුඛත්වය දෙන්න: **`id`** (`Control.Name` වෙත සිතියම් වේ; element references
පළමුව එයට එරෙහිව නැවත resolve වේ) → **`xpath`** → `name` / `role` / `type`.

අවවාද: මෙය පූර්ණ Appium server එකක් නොව W3C WebDriver server එකකි, එබැවින් Appium-පමණක් endpoints (settings,
gestures, app management) 404 ආපසු ලබා දෙයි — සාමාන්‍ය WebDriver client එකක් වඩාත්ම විශ්වසනීය inspector එකයි. Bounds
යනු තාර්කික client ඛණ්ඩාංක වේ, එබැවින් වෙනත් DPI එකකදී ග්‍රහණය කළ overlay එකක්, locators නිවැරදි වූවත් විස්ථාපනය
වී තිබිය හැක. එක් session එකකට එක් කවුළුවක්, සහ සඟවා ඇති පාලක ගසයෙන් ඉවත් කෙරේ.

---

## මට්ටම 3 — Windows-ස්වදේශීය මෙවලම් (FlaUI, WinAppDriver, Appium)
{:#level-3}

`Majorsilence.Forms.WindowsUIAutomation` එම ගසයම **Windows UI Automation** මතට ප්‍රක්ෂේපණය කරයි. Narrator, NVDA
සහ JAWS වලට ඔබේ යෙදුම කියවීමට ඉඩ දෙන්නේ එයයි — තවද එයින් අදහස් වන්නේ UIA-පාදක පරීක්ෂණ මෙවලම්වලට කිසිදු
අභිරුචි protocol එකකින් තොරව එය පාලනය කළ හැකි බවයි.

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // පළමුව පෙන්විය යුතුය — එයට native handle එකක් අවශ්‍යයි
WindowsUIAutomation.Enable (form);  // කවුළුව වසන විට ස්වයංක්‍රීයව වෙන් වේ
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' පළමුව පෙන්විය යුතුය — එයට native handle එකක් අවශ්‍යයි
WindowsUIAutomation.Enable(form)    ' කවුළුව වසන විට ස්වයංක්‍රීයව වෙන් වේ
```

> **මෙය Windows වලින් පිටත compile නොවේ** — න්‍යායාත්මකව නොව, තහවුරු කර ඇත. Windows වලින් පිටත පැකේජය හිස්
> stub එකක් ලෙස නිකුත් වේ, එබැවින් namespace එක නොපවතින අතර ඔබට ලැබෙන්නේ runtime
> `PlatformNotSupportedException` එකක් නොව **CS0234** වේ. Multi-target (`net10.0;net10.0-windows`) කර `#if WINDOWS`
> මගින් ආරක්ෂා කරන්න, නැතහොත් ඇමතුම Windows-පමණක් ව්‍යාපෘතියක තබන්න.

සෑම පාලකයක්ම **Name**, **AutomationId** (`Control.Name`), **ControlType**, **IsEnabled**, **HasKeyboardFocus**
සහ තිර **BoundingRectangle** එකක් සහිත UIA element එකක් බවට පත් වේ. Focus වෙනස්වීම් UIA focus-changed සිදුවීම්
මතු කරයි.

එය backend-මධ්‍යස්ථය — native window handle එකක් සපයන ඕනෑම Windows ධාරකයක් (host) සඳහා එය ක්‍රියා කරයි — සහ
keyboard focus චලනය කිරීම UIA focus-changed සිදුවීමක් ක්‍රියාත්මක කරයි, තිර කියවනයක් නව පාලකය නිවේදනය කරන්නේත්,
විශාලනයක් caret එක අනුගමනය කරන්නේත් එබැවිනි. focus කළ පාලකයේ අගය වෙනස්වීම් property-changed සිදුවීමක්
මතු කරයි.

`LiveSetting` එක `Polite` හෝ `Assertive` වන `Label` එකක් live region එකකි: එහි element එක UIA හි **LiveSetting**
වාර්තා කරන අතර, එහි පෙළ වෙනස් කිරීම UIA හි **LiveRegionChanged** සිදුවීම මතු කරයි — පරිශීලකයා එය වෙත නොගොස්ම
Narrator සහ NVDA තත්ත්ව label එකක නව පෙළ කියවන්නේ එබැවිනි (upstream හි `Label.OnTextChanged` කරන පරිදි). element
එකක **HelpText** යනු එහි පාලකයේ `AccessibilityObject.Help` වේ, එබැවින් `Control.QueryAccessibilityHelp`
හසුරුවනයක `HelpString` යනු තිර කියවනයක් පාලකයේ උදව් ලෙස කියවන දෙයයි. දෙකම Windows reference assemblies වලට
එරෙහිව compile කර ඇති නමුත් සැබෑ තිර කියවනයකින් තවම අසා නැත.

**අද ක්‍රියා කරන දේ, සහ බලාපොරොත්තු විය යුතු දේ:** `Invoke` රටාව (buttons) සජීවීය, එබැවින් FlaUI හෝ WinAppDriver
script එකකට පාලක සොයාගෙන ඒවා click කළ හැක. `Value` (text, combo) සහ `Toggle` (checkbox) නිරාවරණය කර ඇත්තේ
**කියවීම සඳහා** පමණි; ලිවීමේ සහාය පසු අදියරකි — එබැවින් UIA හරහා පෙළ *සැකසීම* තවම ක්‍රියා නොකළ හැකි අතර,
මට්ටම 1 හෝ මට්ටම 2 මතුපිට හරහා ටයිප් කිරීම විශ්වසනීය මාර්ගයයි. මෙම පළමු අනුවාදයේ නැති දේ: එක් එක් යතුරු එබීමට
`TextBox` value සිදුවීම් (පාලකය තවම `TextChanged` මතු නොකරයි, එබැවින් තිර කියවන තමන්ගේම ටයිප් කළ-අක්ෂර echo එකට
යොමු වේ — field එකේ අගය focus වූ විට තවමත් නිවේදනය කෙරේ), structure-changed සිදුවීම්, සහ උප-පාලක items
(තනි tabs, list පේළි).

එම බෙදීම නිසා, Windows මත ප්‍රායෝගික වැඩ බෙදීම වන්නේ: **මට්ටම 1 හෝ 2 මගින් පාලනය කරන්න, මට්ටම 3 මගින්
ප්‍රවේශ්‍යතාව තහවුරු කරන්න.**

පිරිසිදු tree/role තර්කනය framework එක තුළම unit-test කර ඇත
(`Majorsilence.Forms.WindowsUIAutomation.Tests`, Windows CI මත), නමුත් සම්පූර්ණ COM round-trip එකට අන්තර්ක්‍රියාකාරී
Windows desktop session එකක් අවශ්‍යයි — එය headless ලෙස assert කළ නොහැක. ඔබේ යෙදුම ධාවනය කර, bridge එක `Enable`
කර, ඉන්පසු තිර කියවනයක් දකින ආකාරයටම ගසය බැලීමට **Accessibility Insights** හෝ `inspect.exe` මගින් පරීක්ෂා කරන්න.
සැබවින්ම වැදගත් වන පරීක්ෂාව නම් **Narrator** සක්‍රිය කර කවුළුව හරහා tab කිරීමයි: සෑම පාලකයක්ම එහි නම සහ role
සමඟ නිවේදනය විය යුතු අතර, button එකක් තිර කියවනයෙන් සක්‍රිය විය යුතුය.

එම ගසයම මත Linux (AT-SPI) සහ macOS (NSAccessibility) bridges මාර්ග සිතියමේ (roadmap) ඇත. එම වේදිකා මත ඔබට
ප්‍රවේශ්‍යතා වගකීමක් ඇත්නම්, දැන්ම එය සැලකිල්ලට ගෙන සැලසුම් කරන්න.

**බ්‍රවුසරය වෙනස් ආකාරයකින් ආවරණය වේ.** `net10.0-browser` මත Avalonia backend එක එම ගසයම canvas එක අසල ඇති
විනිවිද පෙනෙන, click-through elements වලින් යුත් DOM එකකට පිළිබිඹු කරයි — එක් පාලකයකට එකක් බැගින්, ARIA role,
name, state සහ bounds සමඟ, ඊට අමතරව UIA bridge එක මතු කරන එම label/status/dialog නිවේදන සඳහාම `aria-live` regions
සමඟ. තිර කියවනයක්, find-in-page, හෝ DOM-පාදක පරීක්ෂණ මෙවලමක් දකින්නේ එයයි. එයට ඔබෙන් කිසිදු ඇමතුමක් අවශ්‍ය
නැත (`Majorsilence.Forms.Browser.DisableAccessibilityDom` AppContext switch එක මගින් ඉවත් විය හැක), තවද එය
තහවුරු කරන්නේ සැබෑ තිර කියවනයකින් නොව, CI තුළ headless Chrome හි DOM එක කියවීමෙනි.
[backends පිටුව]({{ '/si/backends/' | relative_url }}#accessibility-dom-browser) roles, states සහ live-region
නීති ලේඛනගත කරයි.

---

## Golden images සමඟ දෘශ්‍ය regression පරීක්ෂාව
{:#visual}

`HeadlessRenderer.CapturePng` පෝරමයක් (`Form`) තිරයෙන් පිටත PNG bytes ලෙස විදැහුම් කරයි (render). ඔබේ golden-image මූලික ක්‍රියාව එයයි, එයට කිසිදු display එකක් අවශ්‍ය නැත:

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
        return;                                   // පළමු ධාවනය පටිගත කරයි; පසුව කිසි විටෙක නිහඬව සමත් නොවේ
    }

    var expected = File.ReadAllBytes (goldenPath);

    if (!expected.AsSpan ().SequenceEqual (actual)) {
        // CI හට artifact එකක් ලෙස අමුණා ගත හැකි වන පරිදි සැබෑ bytes ලියන්න.
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

අත්දැකීමෙන්, නීරස ආකාරයෙන් ඉගෙන ගත් ප්‍රායෝගික නීති:

- **හිතාමතාම නැවත ජනනය කරන්න, කිසි විටෙක ස්වයංක්‍රීයව නොවේ.** `UPDATE_GOLDEN=1` env gate එකක් (හෝ [Verify](https://github.com/VerifyTests/Verify) / ApprovalTests හි සමාන දෙය; ඒවා මෙය සහ diff-tool launcher එකක් නොමිලේ ලබා දෙයි) මඟින් "test එක කොළ පාට වුණා" යන්න "baseline එක චලනය වුණා" යන අර්ථය ගැනීම වළක්වයි.
- **`.actual.png` සැමවිටම CI artifact එකක් ලෙස publish කරන්න.** රූපයක් අමුණා නැති byte-compare අසාර්ථකත්වයක් යනු කිසිවෙකුට ක්‍රියා කළ නොහැකි bug report එකකි.
- **තිර කිහිපයක් පමණක් golden-image කරන්න, සියල්ලම නොවේ.** ඒවා layout සහ තේමා (theming) regressions අල්ලා ගනී; නමුත් හිතාමතා කරන සෑම pixel වෙනසකදීම අසාර්ථක වන නිසා, කට්ටලය කුඩා හා ඉහළ වටිනාකමකින් යුතුව තබා ගන්න.
- **මෙහෙයුම් පද්ධති (OS) අතර fonts වෙනස් වේ.** එක් එක් OS සඳහා baseline එකක් නඩත්තු කරනවා වෙනුවට, CI හි golden images එක් වේදිකාවකට ස්ථිර කරන්න (Linux ලාභම වේ).
- **2× baseline එකක් ද තබා නොගන්නේ නම් `MF_HEADLESS_SCALE=2` හිදී golden-image නොකරන්න** — ඒ වෙනුවට පරිමාණනය කළ (scaled) ධාවනවලදී layout *සමානුපාතිකව* assert කරන්න, සහ pixel සංසන්දනය scale 1 හිදී පමණක් තබා ගන්න.

අර්ථාන්විත (pixel නොවන) snapshots සඳහා, `session.GetPageSource()` බොහෝ ස්ථාවර baseline එකකි: ව්‍යුහය වෙනස් වන විට එය වෙනස් වන අතර විදැහුම්කරණය (rendering) නොසලකා හරියි. "UI එක එකම හැඩය තබා ගත්තාද" යන පරීක්ෂා සඳහා එම XML snapshot කරන්න, සහ PNG "එය තවමත් නිවැරදිව පෙනේද" සඳහා පමණක් වෙන් කරන්න.

---

## BDD: ඉහළින් Reqnroll / SpecFlow
{:#bdd}

විශේෂ කිසිවක් අවශ්‍ය නැත — page objects වැඩේ කරන අතර, step definitions තුනීව පවතී.

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

assembly මට්ටමින් සමාන්තරකරණය (parallelism) අක්‍රිය කර තබන්න ([ඉහත](#prerequisites-serial)) — එය BDD runners සඳහා ද අදාළ වේ.

---

## CI වට්ටෝරු
{:#ci}

display එකක් නැත, driver බාගැනීම් නැත, X server එකක් නැත. UI suite එකක් යනු සරලවම `dotnet test` පමණි.

### GitHub Actions
{:#ci-github}

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest          # display එකක් අවශ්‍ය නැත — Headless backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x

      - run: dotnet build --configuration Release
      - run: dotnet test --configuration Release --no-build --logger "trx;LogFileName=test.trx"

      # 2x හි layout. පරිමාණන අසාර්ථකත්වයක් පැහැදිලිව කියවිය හැකි වන සේ එය වෙනම job/step එකක් ලෙස තබන්න.
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

Windows job එකක් එක් කරන්න සැබවින්ම Windows අවශ්‍ය දේ සඳහා පමණි — UIA/ප්‍රවේශ්‍යතා (accessibility) පරීක්ෂාව:

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

Hosted සේවාවලට වඩා Jenkins හට මඳක් වැඩි සැකසුමක් අවශ්‍ය වේ, මන්ද එයට .NET හි ස්වදේශීය test output කියවිය නොහැකි අතර, Windows agents සාමාන්‍යයෙන් ස්ථාපනය කරන්නේ UI ස්වයංක්‍රීයකරණය බිඳ දමන ආකාරයට ය. මේ දෙකම එක් වරක් කරන නිවැරදි කිරීම් වේ.

**පළමුව, test-results publisher එකක් තෝරන්න.** `dotnet test` TRX ලියයි, එය කිසිදු Jenkins publisher එකක් ස්වදේශීයව කියවන්නේ නැත — එබැවින් ඔබ එක් එක් test ව්‍යාපෘතියට logger package එකක් එක් කර, ගැළපෙන step එක එහි output වෙත යොමු කරයි. සංයෝජන තුනක් ක්‍රියා කරයි; ඔබේ Jenkins හි දැනටමත් ඇති plugin එක අනුව තෝරන්න:

| Publisher step | Logger package | Plugin |
|---|---|---|
| `junit` | `JunitXml.TestLogger` | JUnit plugin — සම්මත Jenkins සැකසුමේ දැනටමත් ඇත, එබැවින් මෙයට plugin වැඩක් අවශ්‍ය නැත |
| `nunit` | `NunitXml.TestLogger` | NUnit plugin — වෙනම ස්ථාපනයකි, නමුත් බොහෝ .NET ආයතන දැනටමත් එය ධාවනය කරයි |
| `mstest` | *කිසිවක් නැත* — `--logger trx` භාවිත කරන්න | MSTest plugin — වෙනම ස්ථාපනයකි; TRX පරිවර්තනය කරයි, සහ ඔබට package reference එකක් එක් කළ නොහැකි නම් ඇති එකම විකල්පය එයයි |

```xml
<!-- එක් එක් test ව්‍යාපෘතියේ, මේවායින් එකක් -->
<PackageReference Include="JunitXml.TestLogger" Version="8.0.0" />
<PackageReference Include="NunitXml.TestLogger" Version="8.0.0" />
```

මෙහිදී වැදගත් සෑම ආකාරයකින්ම loggers දෙක එකිනෙකට හුවමාරු කළ හැකිය: එකම `--logger "<name>;LogFilePath=…"` syntax, එකම `{assembly}` token, පහත සඳහන් එකම namespace අවවාදය. වෙනස් වන්නේ output dialect එක සහ Jenkins step එක පමණි. package එක නොමැතිව, `--logger junit` `Could not find a test logger with AssemblyQualifiedName, URI or FriendlyName 'junit'` සමඟ **build එක අසාර්ථක කරයි** — නිහඬ no-op එකක් නොවේ, එය අවම වශයෙන් පළමු වතාවේදීම අතපසුවීම පැහැදිලි කරයි.

ඉන්පසු `Jenkinsfile` (JUnit ප්‍රභේදය; NUnit හුවමාරුව [පහතින්](#ci-jenkins-nunit)):

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
                            // dotnet හට ලිවිය හැකි HOME එකක් අවශ්‍යයි; mount එක builds අතර NuGet restores
                            // උණුසුම්ව තබයි (NUGET_PACKAGES, HOME යටතේ විසඳේ).
                            args '-e DOTNET_CLI_HOME=/tmp -e HOME=/tmp ' +
                                 '-v $HOME/.nuget/packages:/tmp/.nuget/packages'
                        }
                    }
                    steps {
                        sh 'dotnet build --configuration Release'

                        // display නැත, Xvfb නැත, driver බාගැනීම් නැත — Headless backend.
                        sh '''
                            dotnet test --configuration Release --no-build \
                                --logger "junit;LogFilePath=$WORKSPACE/artifacts/junit/{assembly}.xml"
                        '''

                        // 2x හි layout. වෙනම ධාවනයක් නිසා පරිමාණන අසාර්ථකත්වයක් ප්‍රධාන ධාවනයට
                        // මිශ්‍ර නොවී Jenkins test report එකේ පැහැදිලිව කියවිය හැකිය.
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
                            // රූපය නොමැතිව golden-image අසාර්ථකත්ව සමාලෝචනය කළ නොහැක.
                            archiveArtifacts artifacts: '**/*.actual.png', allowEmptyArchive: true
                        }
                    }
                }

                stage('Accessibility (Windows)') {
                    // අන්තර්ක්‍රියාකාරී desktop session එකක ධාවනය වන agent එකක් විය යුතුය — පහත බලන්න.
                    agent { label 'windows-desktop' }
                    steps {
                        // ත්‍රිත්ව-උද්ධෘත: තනි-උද්ධෘත Groovy string එකකට පේළි කිහිපයක් විහිදිය නොහැක.
                        // Windows මත dotnet සඳහා forward slashes ගැටලුවක් නැත.
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

#### ඒ වෙනුවට NUnit plugin භාවිත කිරීම
{:#ci-jenkins-nunit}

ඔබේ Jenkins හි දැනටමත් NUnit plugin ඇත්නම්, package එක `NunitXml.TestLogger` සඳහා හුවමාරු කර පේළි දෙකක් වෙනස් කරන්න — logger නාමය සහ publisher step එක. parameter නාමය වෙනස් බව සලකන්න: `junit` `testResults` ගන්නා අතර, `nunit` `testResultsPattern` ගනී.

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

එය NUnit v3 `<test-run>` XML නිපදවන අතර, plugin එක ඇතුළු වන විට එය පරිවර්තනය කරයි — එබැවින් Jenkins test trend, එක් එක් test එකේ ඉතිහාසය, සහ අසාර්ථකත්ව පිරික්සීම යන සියල්ල `junit` සමඟ හැසිරෙන ආකාරයටම හැසිරේ. එකකට වඩා අනෙක තෝරා ගැනීමට ක්‍රියාකාරී හේතුවක් නැත; ඔබ දැනටමත් නඩත්තු කරන plugin එක භාවිත කරන්න.

#### දැනගත යුතු Jenkins-විශේෂිත කරුණු හතරක්
{:#ci-jenkins-gotchas}

නැතහොත් මේ සෑම එකක්ම සොයා ගැනීමට දහවල් කාලයක් වැය වේ.

- **ඔබේ test classes වලට namespace එකක් දෙන්න.** loggers දෙකම එක් එක් test එකේ `classname` එහි namespace එකෙන් ව්‍යුත්පන්න කරයි. global namespace එකේ ඇති class එකක් `classname="UnknownNamespace.UnknownType"` ලෙස එළියට එයි — loggers දෙකම පැත්තෙන් පැත්තට ධාවනය කර තහවුරු කර ඇත — එබැවින් සෑම test එකක්ම අර්ථ විරහිත එක් බකට් එකකට වැටෙන අතර Jenkins හි test browser හට කිසිවක් කාණ්ඩ කළ නොහැක. `namespace MyApp.UiTests` හි ඇති class එකක් `classname="MyApp.UiTests.GreetFormTests"` ලෙස එළියට එන අතර report එක සැරිසැරිය හැකි (navigable) වේ.
- **`LogFilePath` හි `{assembly}` test assembly නාමයට විහිදේ**, එබැවින් test ව්‍යාපෘති කිහිපයක් එකිනෙකාගේ ප්‍රතිඵල උඩින් ලියන්නේ නැත. directory එක සාදන්න හෝ logger හට එය කිරීමට ඉඩ දෙන්න, සහ `junit` තනි ගොනුවක් වෙනුවට glob එක වෙත යොමු කරන්න.
- **Windows agent එක අන්තර්ක්‍රියාකාරී desktop session එකක ධාවනය විය යුතුය.** Windows UIA bridge හට සැබෑ ස්වදේශීය කවුළුවක් සහ සම්බන්ධ වීමට desktop එකක් අවශ්‍ය වේ. *Windows service* එකක් ලෙස ස්ථාපනය කළ Jenkins agent එකකට අන්තර්ක්‍රියාකාරී session එකක් නැත, එබැවින් කවුළු සහිත යෙදුම් සහ සෑම UIA assertion එකක්ම framework bugs මෙන් පෙනෙන ආකාරවලින් අසාර්ථක වේ. ඒ වෙනුවට එම agent එක ලොග් වූ පරිශීලක session එකකින් දියත් කරන්න (logon අවස්ථාවේ agent JAR ධාවනය කරන scheduled task එකක්, හෝ කැපවූ පරිගණකයක අතින් ආරම්භ කළ agent එකක්). Linux stage එකට එවැනි අවශ්‍යතාවක් නැත — Headless backend හි සම්පූර්ණ අරමුණ එයයි.
- **සෑම `agent` block එකකටම තමන්ගේම workspace එකක් ලැබේ.** `--no-build` ක්‍රියා කරන්නේ එක් agent එකක් තුළ පමණි; agents අතර build output එක එහි නැත. එක්කෝ එක් එක් stage එකේ build කරන්න (ඉහත පරිදි), නැතහොත් output එක පැහැදිලිව `stash`/`unstash` කරන්න. කලින් එක් agent එකක් භාවිත කළ pipeline එකකට stage එකකට `agent` එකක් එක් කිරීම, හදිසියේ ඇතිවන "project file not found" හෝ "assembly missing" අසාර්ථකත්වයට සුපුරුදු හේතුවයි.

ඔබේ Jenkins හි Docker නොමැති නම්, `docker` agent එක ඉවත් කර සරල `agent { label 'linux' }` එකක් භාවිත කර node එකේ .NET SDK ස්ථාපනය කරන්න (හෝ **.NET SDK Support** plugin හි `dotnetsdk` tool එක භාවිත කර steps `withDotNet` තුළ ඔතන්න). test suite එකේ කිසිවක් වෙනස් නොවේ — කෙසේ වුවත් එයට display එකක් අවශ්‍ය නැත.

> **මෙහි තහවුරු කළේ කුමක්ද, නොකළේ කුමක්ද.** .NET කොටස ධාවනය කරන ලදී: loggers දෙකම (`JunitXml.TestLogger`
> සහ `NunitXml.TestLogger`, 8.0.0), package එක නොමැති විට ලැබෙන අසාර්ථක පණිවිඩය, එක් test assembly එකකට එක් ගොනුවක් ලෙස විහිදෙන `{assembly}`
> token එක, සහ ඉහත namespace-සිට-`classname` හැසිරීම. Jenkins steps සහ plugin parameters පැමිණෙන්නේ සජීවී
> controller එකකින් නොව, එම plugins වල ලේඛනවලිනි — ඔබ ස්ථාපනය කළ plugin අනුවාද සමඟ `testResults` / `testResultsPattern` පරීක්ෂා කරන්න.

### මිනිසුන් මඟ හරින එකම gate එක
{:#ci-wasm}

ඔබ browser එකට ship කරන්නේ නම්, **wasm target එක build කිරීම එය ක්‍රියා කරන බවට සාක්ෂියක් නොවේ.** wasm-tools pipeline එක (emcc/wasm-opt native link) ධාවනය කරන්නේ `dotnet publish` වන අතර, bundle එක සනාථ කරන්නේ browser එකක සැබෑ ආරම්භයක් (boot) පමණි. එය publish කර headless Chromium සමඟ smoke-test කරන්න:

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
      # out/wwwroot සේවනය කර canvas එක render වන බව / console errors නැති බව assert කරන්න.
      - run: node scripts/wasm-smoke.mjs
```

දැනගත යුතු උපහාසය සලකන්න: Playwright හට ඔබේ *යෙදුමේ* UI එක පාලනය කළ නොහැක (DOM නැත — [සීමා](#limits) බලන්න), නමුත් WebAssembly bundle එක ආරම්භ වන බව assert කිරීමට එය හරියටම නිවැරදි මෙවලමයි.

---

## AI මෙවලම් මේ සියල්ලට සම්බන්ධ වන ආකාරය
{:#ai}

එක් ව්‍යුහාත්මක හේතුවක් නිසා මෙම framework එක AI coding assistants සහ agents සඳහා අසාමාන්‍ය ලෙස හිතකර වේ:

> **ස්වයංක්‍රීයකරණ ගසය (automation tree) පෙළ (text) වේ.** `session.GetPageSource()` සජීවී UI එක ids, names,
> roles, values, state සහ bounds සමඟ XML ලෙස ආපසු දෙයි.

pixels නොමැතිව, OCR නොමැතිව, සහ vision model එකක් නොමැතිව model එකකට ඔබේ පරිශීලක අතුරුමුහුණත *කියවිය* හැකිය. එය "GUI එක පාලනය කිරීම" computer-use ගැටලුවක සිට පෙළ ගැටලුවක් බවට පත් කරයි — එය බොහෝ ලාභදායී මෙන්ම බොහෝ විශ්වාසදායක ද වේ.

```xml
<Form name="Greeter" role="window" type="Form" x="0" y="0" width="360" height="140">
  <Label   id="promptLabel" name="Your name:" role="label" ... />
  <TextBox id="nameBox" name="Full name" role="textbox" value="" enabled="true" ... />
  <Button  id="okButton" name="OK" role="button" enabled="false" ... />
</Form>
```

ඒකාබද්ධ කිරීමේ රටා හතරක්, ලාභදායීම එක මුලින්.

### 1. Shell + curl — ඒකාබද්ධ කිරීමේ වැඩ ශුන්‍යයි
{:#ai-shell}

shell commands ධාවනය කළ හැකි ඕනෑම agent එකකට දැනටමත් ඔබේ යෙදුම පාලනය කළ හැකිය: WebDriver server එක ආරම්භ කරන්න, ඉන්පසු [level 2](#level-2-http) හි endpoints එයට `curl` කිරීමට ඉඩ දෙන්න. bindings නැත, SDK නැත, MCP server නැත. ධාවනය වන යෙදුමක් මත coding assistant කෙනෙකුට *තමන්ගේම වැඩ පරීක්ෂා කිරීමට* ඉඩ දීමට ඇති වේගවත්ම ක්‍රමය මෙය වන අතර, සාමාන්‍යයෙන් ආරම්භ කළ යුත්තේ මෙතැනිනි.

agent හට commands තුන (`/source`, `/element`, `/element/{id}/click`) දෙන්න, එවිට එයට ගවේෂණය කළ හැකිය.

### 2. assistant ව test loop එක වෙත යොමු කරන්න
{:#ai-loop}

ඉහළම වටිනාකම ඇති රටාවට කිසිදු නව API surface එකක් අවශ්‍ය නැත — එය නම් **සම්පූර්ණ loop එක display එකක් නොමැතිව වැසේ**:

1. පාලක (control) නාම ඉගෙන ගැනීමට agent `GetPageSource()` output එක (හෝ පවතින test එකක්) කියවයි.
2. එය `By.Id` locators භාවිතයෙන් test එකක් ලියයි.
3. එය `dotnet test` ධාවනය කරයි.
4. එය අසාර්ථකත්වය කියවා, සංස්කරණය කර, නැවත කරයි.

එය container එකක, CI හි, සහ GUI session එකක් නැති පරිගණකයක ක්‍රියා කරයි — coding agents ධාවනය වන්නේ හරියටම එවැනි තැන්වලය. එය pixel-මත පදනම් වූ GUI ස්වයංක්‍රීයකරණය සමඟ සසඳන්න, එහිදී තිරයක් නොමැතිව agent හට ප්‍රතිඵලය කිසිසේත් දැකිය නොහැක.

මෙයට assistant කෙනෙකු දක්ෂ කිරීමට ඔබේ repo එකේ කෙටි `AGENTS.md` / `CLAUDE.md` එකක් ප්‍රමාණවත් වේ:

```markdown
## UI එක ධාවනය කිරීම සහ test කිරීම

- UI tests headless ලෙස ධාවනය වේ: `dotnet test`. display එකක් අවශ්‍ය නැත. කිසි විටෙක `Thread.Sleep` එක් නොකරන්න;
  `tests/Support/Wait.cs` හි ඇති `Wait` helper භාවිත කරන්න (එය backend queue එක pump කරයි).
- backend එක ස්ථාපනය කරන්නේ එක් test assembly එකකට එක් වරක් `TestBackend.Init` හි ය — එය එක් එක් test එකට සකසන්න එපා.
- Tests අනුක්‍රමිකව (serial) පැවතිය යුතුය: `Platform.Backend` සහ `Application.OpenForms` global වේ.
- Locators පැමිණෙන්නේ `Control.Name` වෙතිනි (`By.Id("okButton")`). පාලකයකට `Name` එකක් නොමැති නම්,
  text හෝ index මඟින් සොයනවා වෙනුවට එකක් එක් කරන්න.
- පෝරමයක් ස්වයංක්‍රීය කිරීමට පෙර එක් වරක් `HeadlessRenderer.CapturePng(form, w, h)` අමතන්න — එය layout බල කරයි.
- automation layer එක දකින ආකාරයට UI එක දැකීමට: `session.GetPageSource()` ගසය XML ලෙස මුද්‍රණය කරයි.
- *ප්‍රතිඵලය* (state, DialogResult, rendered output) assert කරන්න, member එකක් පවතින බව කිසි විටෙක නොවේ.
```

### 3. MCP tool surface එකක් — අන්තර්ක්‍රියාකාරී assistants සඳහා
{:#ai-mcp}

*ධාවනය වන* යෙදුමක් සංවාදාත්මකව පාලනය කිරීමට assistant කෙනෙකුට ඉඩ දීම සඳහා, automation surface එක [Model Context Protocol](https://modelcontextprotocol.io) tools ලෙස නිරාවරණය කරන්න. **framework එක එකක් සමඟ එයි** — [`Majorsilence.Forms.Mcp`]({{ site.github_url }}/tree/main/tools/Majorsilence.Forms.Mcp), stdin/stdout හරහා MCP කතා කරන සහ [level 2](#level-2) හි WebDriver endpoint එක හරහා යෙදුම පාලනය කරන, publish කළ `dotnet` global tool එකකි:

```
dotnet tool install -g Majorsilence.Forms.Mcp
```

```
assistant  ──MCP/stdio──▶  majorsilence-mcp  ──HTTP/loopback──▶  your app (WebDriverServer)
```

framework එකට link කරනවා වෙනුවට HTTP හරහා සම්බන්ධ කිරීම, එය අනුවාදයෙන් සහ backend එකෙන් ස්වාධීන කරයි: එය `WebDriverServer` එකක් ආරම්භ කරන ඕනෑම Majorsilence.Forms යෙදුමක් පාලනය කරන අතර, කිසි විටෙක වෙනත් කෙනෙකුගේ UI thread එකට marshal කිරීමට අවශ්‍ය නොවේ.

එබැවින් යෙදුම් පැත්තේ සැකසුම යනු Selenium සඳහා ඔබට දැනටමත් අවශ්‍ය පේළි දෙකයි:

```csharp
using var server = new WebDriverServer (form, 4444);
server.Start ();
```

ඉන්පසු client එකක් එය වෙත යොමු කරන්න. Claude Code:

```
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444
```

MCP servers තමන් විසින්ම දියත් කරන ඕනෑම client එකක් (Claude Desktop, editors, agent frameworks) එම command එකම තමන්ගේම config ආකෘතියෙන් ගනී:

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

විකල්ප: `--port <port>` (loopback, පෙරනිමිය 4444), සම්පූර්ණ base URL එකක් සඳහා `--url <url>`, හෝ `MAJORSILENCE_MCP_URL` පරිසර විචල්‍යය; `--help` එම සාරාංශයම මුද්‍රණය කරයි.

එය නිරාවරණය කරන tools:

| Tool | Arguments | ආපසු දෙන්නේ |
|---|---|---|
| `ui_snapshot` | — | සම්පූර්ණ පාලක ගසය XML ලෙස |
| `ui_find` | `target`, `strategy` | id, name, role, type, value, text, enabled/visible, bounds |
| `ui_read` | `target`, `strategy` | පාලකය දැනට පෙන්වන දේ |
| `ui_click` | `target`, `strategy` | තහවුරු කිරීම, හෝ එය ප්‍රතික්ෂේප වූයේ ඇයි |
| `ui_type` | `target`, `text`, `strategy`, `clear` | පසුව පාලකය කියවන දේ |
| `ui_wait_for` | `target`, `strategy`, `timeoutMs`, `requireEnabled` | සූදානම, හෝ wait එක කල් ඉකුත් වූයේ ඇයි |
| `ui_screenshot` | — | කවුළුවේ PNG එකක් — [Headless-ධාරක කවුළු පමණි](#level-2) |

ඔබ ඔබේම එකක් ගොඩනගන්නේ නම් පිටපත් කිරීමට වටින තීරණ තුනක් එහි ඇත:

- **සෑම tool එකක්ම element handle එකක් නොව locator එකක් ගනී.** සෑම call එකක්ම තමන් ක්‍රියා කරන දේ නැවත විසඳන (re-resolve) නිසා, [staleness උගුලට](#level-1) දෂ්ට කිරීමට ක්‍රමයක් නැත: model එකකට turns අතර තබා ගැනීමට handle එකක් නැත.
- **`strategy` හි පෙරනිමිය `id` වේ** — පාලකයේ `Name` — සහ හඳුනා නොගත් strategy එකක් pass through කරනවා වෙනුවට නාමයෙන් ප්‍රතික්ෂේප කෙරේ. server එක තමන් හඳුනා නොගන්නා ඕනෑම දෙයක් සඳහා *name* සෙවීමකට ආපසු වැටේ, එබැවින් පරීක්ෂා නොකළ අකුරු වැරැද්දක් නිහඬව වැරදි ආකාරයට සොයා "not found" ලෙස පිළිතුරු දෙනු ඇත.
- **`ui_click` සහ `ui_type` destructive ලෙස annotate කර ඇති අතර, ඉතිරිය read-only වේ**, ස්වයංක්‍රීයව අනුමත කළ යුත්තේ කුමක්දැයි තීරණය කිරීමේදී host එකක් පරිශීලකයාට පෙන්වන්නේ එයයි.

**එය යොමු කිරීමට යමක්.**
[`samples/AutomationTarget`]({{ site.github_url }}/tree/main/samples/AutomationTarget) යනු හරියටම මේ සඳහා ගොඩනැගූ කුඩා යෙදුමකි: එය endpoint එක තනිවම ආරම්භ කර එය පාලනය කිරීමට commands මුද්‍රණය කරයි (MCP `claude mcp add` පේළිය, Selenium `RemoteWebDriver` constructor එකක්, සහ `/status` සඳහා `curl` එකක්).

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

`--webdriver <port>` port එක තෝරයි; `--no-webdriver` එය සාමාන්‍ය යෙදුමක් ලෙස ධාවනය කරයි. එහි සෑම පාලකයක්ම client එකකට හැසිරවිය යුතු එක් දෙයක් අභ්‍යාස කරයි — ලිවීමට සහ කියවීමට text box එකක් (`nameBox`), handler එක label එකක් වෙනස් කරන button එකක් (`greetButton` → `greetingLabel`), ස්ථිරවම අක්‍රිය button එකක් (`lockedButton`, එවිට ඔබට ව්‍යාජ සාර්ථකත්වයක් වෙනුවට ප්‍රතික්ෂේපයක් දැකිය හැක), `agreeCheck` checkbox එක ලකුණු කළ පසු පමණක් සක්‍රිය වන Submit button එකක් (`ui_wait_for` තිබෙන්නේ ඒ සඳහාය), පේළි `listitem` nodes වන `logList` එකක්, සහ හිතාමතාම *නම් නොකළ* label එකක්, එවිට හිස් `id` එකක් ගසයේ පෙනෙන්නේ කෙසේදැයි ඔබට දැකිය හැක. සෑම ක්‍රියාවක්ම දෘශ්‍යමාන log එකට සහ stdout වෙත එකතු වේ, එබැවින් client එක කළා යැයි කියන දේ යෙදුම සැබවින්ම දුටු දේ දැයි ඔබට පරීක්ෂා කළ හැක. හොඳ පළමු අභ්‍යාසයක්: *"type 'Grace Hopper' into nameBox, click greetButton, and read greetingLabel"* `Hello, Grace Hopper!` ලෙස ආපසු පැමිණිය යුතුය.

එය අමාරු ආකාරයෙන් උගන්වන දේවල් දෙකක්: එය Avalonia backend මත ධාවනය වේ, එබැවින් `ui_screenshot` ප්‍රතික්ෂේප කෙරේ (screenshots [Headless-පමණි](#level-2)); සහ එහි list items වලට `id` එකක් නැත, එබැවින් ඒවා සොයා ගන්නේ name, text හෝ XPath මඟිනි.

කොටස් දෙකම NuGet හි ඇත — tool එක, සහ test කරන යෙදුම සඳහා `Majorsilence.Forms.WebDriver` — එබැවින් repo එකෙන් කිසිවක් build කිරීමට අවශ්‍ය නැත. ඔබට source එකෙන් server එක ධාවනය කිරීමට අවශ්‍ය නම් (උදාහරණයක් ලෙස එය වෙනස් කිරීමට), සමාන දෙය වන්නේ:

```
dotnet run --project tools/Majorsilence.Forms.Mcp -- --port 4444
```

#### නැතහොත් surface එක ඔබේම process එක තුළ host කරන්න
{:#ai-mcp-inprocess}

ඔබ මෙම tools යෙදුම තුළ සිටම නිරාවරණය කිරීමට කැමති නම් — හෝ MCP නොවන agent framework එකකට සම්බන්ධ කිරීමට — framework-විශේෂිත කොටස `AutomationSession` මත තුනී adapter එකකි:

**C#**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

// test කරන එක් යෙදුමකට එක් instance එකක්. සෑම method එකක්ම UI thread එක මත අමතනු ලැබේ.
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
            return $"no element with id '{id}'";       // model එකට ක්‍රියා කළ හැකි සරල දෝෂයක්
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

        // කියවීමට නැවත විසඳන්න: අල්ලා ගත් element එක typing වලට පෙර ගත් snapshot එකකි.
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

        ' කියවීමට නැවත විසඳන්න: අල්ලා ගත් element එක typing වලට පෙර ගත් snapshot එකකි.
        Return session.GetText(session.FindOrThrow(By.Id(id)))
    End Function

    Public Function Screenshot(width As Integer, height As Integer) As Byte()
        Return HeadlessRenderer.CapturePng(form, width, height)
    End Function
End Class
```

ජලනළ කාර්යයට (plumbing) වඩා වැදගත් වන සැලසුම් සටහන් දෙකක්:

- **දෝෂ exceptions ලෙස නොව text ලෙස ආපසු දෙන්න.** "no element with id 'okButton'" යනු model එකකට යථා තත්ත්වයට පත් විය හැකි දෙයකි; tool සීමාවක් හරහා යන stack trace එකක් සාමාන්‍යයෙන් එසේ නොවේ.
- **UI thread එකට marshal කරන්න.** ඔබේ host යෙදුම සැබෑ message loop එකක් ධාවනය කරන්නේ නම්, සෑම call එකක්ම `Application.RunOnUIThread` සමඟ ඔතන්න. WebDriver server එක දැනටමත් ඔබ වෙනුවෙන් මෙය කරයි — යෙදුම ධාවනය වන desktop process එකක් වන විට `AutomationSession` වෙනුවට *එය* ඔතා ගැනීමට එය හොඳ තර්කයකි.

**නැතහොත් MCP සම්පූර්ණයෙන්ම මඟ හරින්න:** WebDriver endpoint එක loopback මත සරල HTTP වන නිසා, shell ප්‍රවේශය ඇති assistant කෙනෙකුට ([රටාව 1](#ai-shell)) හෝ HTTP-හැකියාව ඇති සාමාන්‍ය MCP server එකකට අමතර process එකක් කිසිසේත් නොමැතිව එම යෙදුමම පාලනය කළ හැක.

### 4. ඔබේම agent loop එක, in-process
{:#ai-agentloop}

ඔබ ඔබේ නිෂ්පාදනය *තුළට* agent කෙනෙකු ගොඩනගන්නේ නම් — UI එක ක්‍රියාත්මක කරන "මට මෙය කරන්න" ආකාරයේ assistant කෙනෙකු — එම adapter එකම සාමාන්‍ය tool-use loop එකක tool definitions බවට පත් වේ. [Anthropic C# SDK](https://github.com/anthropics/anthropic-sdk-csharp) (`dotnet add package Anthropic`) සමඟ, tools යනු raw JSON schemas වන අතර `client.Beta.Messages.ToolRunner(...)` ඔබ වෙනුවෙන් loop එක ධාවනය කරයි; model එක නවතින තුරු ඔබේ functions අමතා ප්‍රතිඵල ආපසු ලබා දෙයි:

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

// පෙරනිමි model: claude-opus-5. ඉන්පසු tool calls ඉහත UiAgentSurface වෙත යොමු කරන්න.
```

සෑම tool එකකටම **නියමාත්මක (prescriptive)** විස්තරයක් දෙන්න — එය කරන්නේ කුමක්ද යන්න පමණක් නොව, එය අමතන්න ඕනේ *කවදාද* යන්න කියන්න ("Call `ui_snapshot` before your first `ui_click` in a screen you haven't inspected"). කිසිදු prompt tuning ප්‍රමාණයකට වඩා විශ්වාසනීයත්වය සඳහා එම එක් පුරුද්ද වැඩි යමක් කරයි.

### agent-ලියූ tests සඳහා ආරක්ෂක වැටවල් (guardrails)
{:#ai-guardrails}

මෙවැනි test ලිවීමට agents සැබවින්ම දක්ෂයි. කිසිවක් ඔප්පු නොකර සමත් වන tests ලිවීමට ද ඔවුන් දක්ෂයි, එබැවින් විශේෂයෙන් මේවා සඳහා සමාලෝචනය කරන්න:

- **පැවැත්ම නොව, ප්‍රතිඵල assert කරන්න.** `Assert.NotNull(session.Find(By.Id("okButton")))` පාලකය පවතින බව ඔප්පු කරයි; එය click කිරීම යමක් කරන බව ඔප්පු නොකරයි. බොහෝ frameworks වලට වඩා මෙහිදී මෙය වැදගත් වන්නේ, ක්‍රියාත්මක නොකළ members [throw කරනවා වෙනුවට ආරක්ෂිතව no-op වන]({{ '/si/training/' | relative_url }}#module-3-stub-policy) නිසාය — member එකක් ළඟා විය හැකි බව පමණක් පරීක්ෂා කරන test එකක් stub එකකට එරෙහිව සමත් වේ.
- **test එකක් කොළ පාට කිරීමට ලිහිල් කළ assertions ගැන විමසිලිමත් වන්න.** වෙනස් කළ `Assert.Equal` එකක් යනු වෙස්වළාගත් හැසිරීම් වෙනසකි. test ගණන පමණක් නොව, assertions diff කරන්න.
- **agent කෙනෙකුට කිසි විටෙක golden images නැවත ජනනය කිරීමට ඉඩ නොදෙන්න.** `UPDATE_GOLDEN` මිනිස් ක්‍රියාවක් ලෙස තබා ගන්න; agent විසින් තමන්ගේම output එකට ගැළපෙන ලෙස නැවත ලියූ baseline එකක් කිසිවක් test නොකරයි.
- **index එකක් වෙනුවට `Name` එකක් අවශ්‍ය කරන්න.** `By.XPath("(//Button)[3]")` ක්‍රියා කරන්නේ කවුරුහරි button එකක් එක් කරන තුරු පමණි. පාලකයකට `Name` එකක් නොමැති නම්, නිවැරදි විසඳුම එකක් එක් කිරීමයි.
- **සොයා ගැනීමට පෙර page source එක කියවීමට සලස්වන්න.** සැබෑ ගසයෙන් නොව source code එකෙන් නිර්මාණය කළ locators, agent-ලියූ flakes (අස්ථාවර tests) සඳහා වඩාත් පොදු හේතුවයි.

---

## සීමා සහ anti-patterns
{:#limits}

**Playwright හට ඔබේ desktop යෙදුම පාලනය කළ නොහැක.** එය Chrome DevTools Protocol හරහා DOM එකකට එරෙහිව browser engines ස්වයංක්‍රීය කරයි; desktop backend එකක ඇති Majorsilence.Forms යෙදුමක් Skia සමඟ ස්වදේශීයව විදැහුම් කරන අතර සම්බන්ධ වීමට DOM එකක් හෝ browser engine එකක් නැත. HTTP surface එක HTTP සේවාවක් ලෙස සලකමින් Playwright හි API-request client එකෙන් අභ්‍යාස *කළ හැකිය* — නමුත් එය browser ස්වයංක්‍රීයකරණයක් නොවන අතර සරල WebDriver client එකකට වඩා කිසිවක් ලබා නොදේ. ඒ වෙනුවට [WebDriver server](#level-2) භාවිත කරන්න. (ඔබේ [WebAssembly bundle එක ආරම්භ වන](#ci-wasm) බව smoke-test කිරීමට Playwright නිවැරදි මෙවලම *වේ* — එය වෙනස් කාර්යයකි.)

**browser target එක අර්ධ ව්‍යතිරේකයයි.** එහිදී Avalonia backend විවෘත පෝරමවල [ARIA DOM mirror](#tree) එකක් තබා ගනී, එබැවින් DOM tool එකකට පාලක සොයා ගැනීමට *හැකිය* — role සහ name මඟින්, හෝ `[data-mf-automation-id="okButton"]` මඟින් — සහ ඒවායේ state කියවීමට හැකිය. ආදානය (input) තවමත් අයත් වන්නේ canvas එකට ය: mirror elements `pointer-events: none` වේ, එබැවින් DOM click එකක් වෙනුවට element එකේ bounding box එකේ click කරන්න (`locator.boundingBox ()` ඉන්පසු `page.mouse.click`). browser smoke test එකකට එය ප්‍රමාණවත්ය; suite එකක වැඩි කොටස තවමත් අයත් වන්නේ level 1 ට ය.

ඒවා වටා suite එකක් සැලසුම් කිරීමට පෙර දැනගත යුතු අනෙකුත් සීමා:

| සීමාව | ප්‍රතිවිපාකය |
|---|---|
| WebDriver session එකකට එක් කවුළුවක් | frame හෝ window මාරු කිරීමක් නැත; බහු-කවුළු ප්‍රවාහ level 1 ට අයත් වේ |
| Screenshots සඳහා Headless backend අවශ්‍යයි | desktop-ධාරක කවුළුවකට එරෙහිව `GET …/screenshot` අසාර්ථක වේ ([ඉහත](#level-2)); headless ධාවනයේදී capture කරන්න |
| Tab headers සහ grid cells ගසයේ නැත | Menu, toolbar සහ list items ඇත ([ඉහත](#tree)); tabs සහ `DataGridView` cells සඳහා තවමත් තමන්ගේම nodes අවශ්‍යයි |
| එක් එක් item එකට selection state නැත | තෝරාගත් item එක සඳහා list එකේ `value` කියවන්න; item එකකට තවමත් තනිවම "selected" බව වාර්තා කළ නොහැක |
| සැඟවුණු පාලක ගසයෙන් ඉවත් කර ඇත | අදෘශ්‍ය පාලකයක අන්තර්ගතය මත assert කළ නොහැක — ඒ වෙනුවට දෘශ්‍යතාව assert කරන්න |
| JavaScript ක්‍රියාත්මක කිරීමේ endpoint එකක් නැත | `execute/sync` මත ගොඩනැගූ Selenium APIs (`ExecuteScript`, `GetAttribute`, JS-පදනම් waits) ලබා ගත නොහැක; `GetDomAttribute` සහ ඔබේම polling භාවිත කරන්න |
| Implicit waits නැත | ඔබේම [`Wait` helper](#waits) එකක් ගෙන එන්න |
| UIA write patterns අසම්පූර්ණයි | text level 1/2 හරහා සකසන්න; level 3 භාවිත කරන්න ආදානය පාලනයට නොව, නිවේදනය (announcement) තහවුරු කිරීමට |
| UIA package එක compile වේලාවේදී Windows-පමණි | `#if WINDOWS` සමඟ ආරක්ෂා කරන්න හෝ Windows-පමණක් ව්‍යාපෘතියක හුදකලා කරන්න |
| `AutomationElement` වෙනස් කළ නොහැකි snapshot එකකි | ක්‍රියා අල්ලා ගත් element එකක් පිළිගනී; **කියවීම් නැවත විසඳිය යුතුය** ([ඉහත](#level-1)) |
| Tests global backend state බෙදා ගනී | අනුක්‍රමික ක්‍රියාත්මක කිරීම, සැමවිටම |

සහ වැඩිපුරම වේදනාව ඇති කරන පුරුදු දෙක:

- **scale-1 pixel ජ්‍යාමිතිය assert නොකරන්න.** framework එකේම HiDPI අසාර්ථකත්ව බොහෝ දුරට සම්පූර්ණයෙන්ම එක් ව්‍යාකූලත්වයකි — තාර්කික ඒකක එදිරිව උපාංග ඒකක. 2026-10-01 සිට public surface එක ස්ථාවරව **තාර්කික (logical)** වේ: `Bounds`, `ClientRectangle`, `ClientSize`, `MouseEventArgs`, `GetTabRect`, සහ paint canvas (`OnPaint`, `e.ClipRectangle`) සියල්ල එක් ඒකකයක් බෙදා ගන්නා අතර, framework එක ඔබ වෙනුවෙන් canvas එක පරිමාණනය කරයි (තවමත් `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` අමතන custom පාලකයක් දැන් දෙවරක් පරිමාණනය කරයි — එය ඉවත් කරන්න). උපාංග පික්සල (device pixels) ළඟා විය හැක්කේ ඒවා එලෙස නම් කර ඇති තැන්වල පමණි — `Scaled*` පවුල (`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling`, `LogicalToDeviceUnits`, back buffers සහ අල්ලා ගත් bitmaps — සහ ඉතිරි ව්‍යතිරේකය: **owner-draw events** (`DrawItem`, `DrawNode`, `CellPainting`) තවමත් ඔබට device-pixel bounds ලබා දෙයි. scale 1 හිදී ඒකක පද්ධති දෙක සමාන වේ, එබැවින් පරිමාණනය කළ display එකක් පෙනී සිටින තුරු ඒවා මිශ්‍ර කිරීම අදෘශ්‍යමාන වේ. සමානුපාතිකව assert කරන්න, සහ `MF_HEADLESS_SCALE=2` gate එක ධාවනය කරන්න.
- **runner එකක් යටතේ Avalonia backend මත test නොකරන්න.** එය ක්‍රියා කරන බව පෙනී, ඉන්පසු deadlock වනු ඇත හෝ අස්ථාවර ලෙස හැසිරෙනු ඇත, මන්ද එහි dispatcher එක thread-bound වේ. Headless පවතින්නේ මේ සඳහාය.

---

## මාර්ග සිතියම (Roadmap)
{:#roadmap}

- ✅ **Windows UI Automation bridge** — තිර කියවන (screen readers), විශාලන (magnifiers), සහ පවතින UIA මෙවලම් (FlaUI, Appium/WinAppDriver), custom protocol එකක් නොමැතිව.
- UIA patterns සම්පූර්ණ කිරීම: `Value`/`Toggle` write සහාය, structure-changed events, සහ `TextBox` එක් එක් යතුරු එබීමේ value events (editor එකෙන් `TextChanged` නැංවීම).
- ✅ **Browser accessibility DOM** — `net10.0-browser` මත එම ගසයම live regions සමඟ ARIA elements වෙත mirror කෙරේ, එබැවින් තිර කියවන, find-in-page සහ DOM test මෙවලම්වලට UI එක දැකිය හැක ([විස්තර]({{ '/si/backends/' | relative_url }}#accessibility-dom-browser)). තවමත් සැබෑ තිර කියවනයක් හරහා අසා නැත — headless Chrome හි DOM කියවීමෙන් තහවුරු කර ඇත.
- එම ගසයම මත **AT-SPI (Linux)** සහ **NSAccessibility (macOS)** bridges.
- ✅ **පාලක නොවන items**: menu items, toolbar buttons සහ `ListBox` items තමන්ගේම bounds සමඟ ගසයේ ඇති අතර, click කළ හැකිය.
- ✅ **Custom-painted පාලකවලට තමන්ගේම value සහ අමතර state publish කළ හැක** (`IAutomationStateProvider`) — [ඉහත](#custom-controls) බලන්න.
- ✅ **UIA හි live regions සහ help text** — `Label.LiveSetting` LiveRegionChanged නංවයි; `QueryAccessibilityHelp` HelpText පෝෂණය කරයි.
- roles සහ states පුළුල් කිරීම (selection, expand/collapse, value ranges) — `ListBox` item එකකට තවමත් තනිවම තමන් තෝරාගෙන ඇති බව වාර්තා කළ නොහැක, list එක එය රැගෙන යන්නේ ඒ නිසාය; `IAutomationStateProvider` හි `State` field එක built-in පාලකයකට ද මේ සඳහා භාවිත කිරීමට ඇත, නමුත් තවමත් `ListBox` සඳහා සම්බන්ධ කර නැත.
- ඉතිරි painted items මතුපිටට ගෙන ඒම: tab headers, `DataGridView` cells, tree nodes.
- ඉහළ මට්ටමේ `Majorsilence.Forms.Testing` ergonomics layer එකක් — fluent helpers සහ golden-image asserts, එවිට ඉහත [wait helper](#waits) සහ [golden-image plumbing](#visual) ඔබට අයිති කර ගැනීමට අවශ්‍ය දේවල් නොවේ.

---

## ඊළඟට යා යුත්තේ කොතැනටද
{:#next}

- [පුහුණු මාර්ගෝපදේශය, Module 8]({{ '/si/training/' | relative_url }}#module-8) — පුළුල් විෂය නිර්දේශය තුළ, මෙම ද්‍රව්‍ය එක් බැල්මකින්.
- [Module 10]({{ '/si/training/' | relative_url }}#module-10-ci) — යෙදුමක් සඳහා සම්පූර්ණ CI gate ලැයිස්තුව, සංක්‍රමණ drift ද ඇතුළුව.
- [වේදිකා backends]({{ '/si/backends/' | relative_url }}) — Headless backend යනු කුමක්ද, සහ එක් test suite එකකට සෑම target එකක්ම ආවරණය කිරීමට ඉඩ දෙන සන්ධිය (seam).
