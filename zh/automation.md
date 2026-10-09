---
layout: docs
lang: zh
title: 自动化与 UI 测试
subtitle: 一棵自动化树——进程内测试、Selenium、屏幕阅读器，以及面向 AI 代理的 MCP 服务器——以及如何在它之上构建一套真正的测试套件。每个示例都提供 C# 与 VB.NET 版本。
seo_title: "WinForms UI 测试与自动化——无头 CI、Selenium 与 MCP"
description: >-
  从一棵自动化树出发，自动化并测试跨平台 WinForms 应用：进程内 UI 测试、无头 CI、
  W3C WebDriver 服务器、屏幕阅读器（Windows UIA 与浏览器 ARIA），以及让 AI 代理
  驱动运行中应用的 MCP 服务器。
keywords:
  - winforms ui 测试
  - winforms 自动化测试
  - winforms selenium webdriver
  - 无头 winforms ci
  - winforms 屏幕阅读器 无障碍
  - mcp 服务器 ui 自动化
  - ai 代理 ui 测试
  - 跨平台 winforms 测试
priority: "0.8"
permalink: /zh/automation/
---

Majorsilence.Forms 暴露了一棵与后端无关的**自动化树**：它是实时控件层次结构的快照，包含 id、名称、角色、值、状态和边界。本页既是这棵树的参考文档，也是在它之上测试**你的**应用的实践指南——页面对象、等待、业界工具、视觉回归、CI 配方，以及 AI 代理如何接入同一套表面。

培训指南的[模块 8]({{ '/zh/training/' | relative_url }}#module-8)是本页的精简版。

本页所有内容都是在撰写时于 macOS 上针对框架当前的 main 分支实际运行过的，包括一次真实的 Selenium `RemoteWebDriver` 会话。凡是不能工作的地方，文中都会直说。

---

## 目录
{:#contents}

- [一棵树，四类消费者](#tree)
- [自定义绘制的控件：发布你自己的值与状态](#custom-controls)
- [选择你的层级](#levels)
- [四个前提条件](#prerequisites)
- [层级 1——在无头后端上的进程内测试](#level-1)
- [等待，而不用 `Thread.Sleep`](#waits)
- [页面对象](#page-objects)
- [层级 2——Selenium 与 WebDriver 服务器](#level-2)
- [用检查器录制定位器](#inspector)
- [层级 3——Windows 原生工具（FlaUI、WinAppDriver、Appium）](#level-3)
- [基于黄金图像的视觉回归](#visual)
- [BDD：在其上运行 Reqnroll / SpecFlow](#bdd)
- [CI 配方](#ci)
- [AI 工具如何接入这一切](#ai)
- [限制与反模式](#limits)
- [路线图](#roadmap)

---

## 一棵树，四类消费者
{:#tree}

这棵树读取的是渲染器所用的同一份逻辑边界和状态，因此它在无头后端和真实后端（Avalonia、Uno、GTK 4 等——见[平台后端]({{ '/zh/backends/' | relative_url }})）上的行为完全一致——**针对 Headless 编写的测试，描述的就是用户在 Avalonia 上看到的东西。**有四类东西消费这同一个模型：

| 消费者 | 包 | 它给你什么 |
|---|---|---|
| 进程内 UI 测试 | `Majorsilence.Forms.Automation`（包含在核心包中） | 从 C#/VB 驱动窗体，无需像素计算 |
| 远程自动化 | `Majorsilence.Forms.WebDriver` | 任何 Selenium 客户端都能驱动的 W3C WebDriver 服务器——也是面向 AI 代理的 [MCP 服务器](#ai-mcp)所对话的对象 |
| 屏幕阅读器与放大镜（Windows） | `Majorsilence.Forms.WindowsUIAutomation` | Windows 上的 Narrator / NVDA / JAWS |
| 屏幕阅读器与 DOM 工具（浏览器） | 内置于 `net10.0-browser` 上的 `Majorsilence.Forms.Avalonia` | 在画布旁边为打开的窗体提供一个透明的 ARIA DOM 镜像——每个控件的角色、名称、状态和边界，外加实时区域（[详情]({{ '/zh/backends/' | relative_url }}#accessibility-dom-browser)） |

它们看到的都是同一样东西，而这样东西是**文本**。`session.GetPageSource()` 把实时 UI 渲染成 XML——正是这一点让定位器可录制、快照可比对，并让 [AI 代理派上用场](#ai)，而无需一个像素：

```xml
<Form name="Login" role="window" type="Form" x="0" y="0" width="400" height="300">
  <Button id="okButton" name="OK" role="button" type="Button"
          value="" enabled="true" visible="true" x="10" y="10" width="100" height="30" />
  <TextBox id="nameBox" name="Full name" role="textbox" type="TextBox"
           value="" enabled="true" visible="true" x="10" y="50" width="200" height="30" />
</Form>
```

标签是控件类型；`id` 是 `Control.Name`，`name` 是无障碍名称。下文每个定位器匹配的正是这些属性。

**树中并非所有东西都是控件。**菜单项、工具栏按钮和 `ListBox` 的项是由其父控件绘制的，而不是作为子控件托管的，因此仅从控件层次结构构建的树会在工具条或列表处停下——你能找到一个 `ToolStrip`，却点不到它上面的任何东西；能找到一个列表，却读不到其中任何内容。现在它们是独立的节点，拥有自己的屏幕边界：

```xml
<ListBox id="wordList" name="wordList" role="list" type="ListBox" value="Beta" ... >
  <ListBoxItem id="" name="Alpha" role="listitem" type="ListBoxItem" x="11" y="11" width="258" height="17" />
  <ListBoxItem id="" name="Beta"  role="listitem" type="ListBoxItem" x="11" y="28" width="258" height="17" />
</ListBox>
```

关于项，有两点需要了解。它们**没有 `id`**——项本身没有自己的 `Name`，而合成的索引会随着列表滚动而移位——所以请按名称、文本或 XPath 定位它们（`By.Name ("Beta")`、`//*[@role='listitem']`）。另外，**哪一项被选中要从列表读取**，列表的 `value` 就是它的选中项；项自身的文本仍是它的文本。只有滚动到可见区域的项才会出现，因为屏幕外的项没有可以点击的矩形。

*菜单和工具栏项、列表项，以及点击它们所依赖的 HiDPI 命中测试修复，已随 26.0.30 之后的每个版本发布——只有仍锁定在 26.0.30 的项目才会看到工具条和列表没有内容。*

### 自定义绘制的控件：发布你自己的值与状态
{:#custom-controls}

上面的一切对内置控件开箱即用——`Button`、`TextBox`、`CheckBox` 等已经知道如何报告自己的角色和值。自定义绘制的控件（你自己在 `OnPaint` 中绘制的控件）没有这样的推断可以依赖：不做额外工作的话，它在树中显示为值 `""`、完全没有状态，只有一个从类型名猜出来的角色。

**角色和名称已经有归属**，对任何控件都是如此：`Control.AccessibleRole` 和 `Control.AccessibleName`（现有的 WinForms 兼容属性）会在内置推断之前被检查，所以为自定义控件设置它们，与为其他任何控件设置完全一样——这两项不需要新 API。

**值和额外状态需要 `IAutomationStateProvider`。**在你的控件上实现它，树就会使用它而不是猜测——比如一个状态小部件正在显示的级别：

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

    protected override void OnPaint (PaintEventArgs e) { /* 绘制信标 */ }
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
        ' 绘制信标
    End Sub
End Class
```

同时设置 `AccessibleRole`/`AccessibleName`，元素就会携带全部四项：

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

……它在 `session.GetPageSource()` 中的显示方式与内置控件完全一样，外加每个条目一个 `state-{key}` 属性——可以单独查询，而不是一团不透明的数据：

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

同样的 `state-{key}` 名称通过 WebDriver 的 `getAttribute` 也能用——无论从页面源代码还是从实时的 `getAttribute` 调用捕获的定位器，看到的都是同一个属性。键应当是简单标识符（字母、数字、`-`/`_`）：古怪的键会像控件类型名一样，为 XML 属性*名称*做清理，但 `getAttribute` 查找键时不做清理，所以对于需要清理的键，两者会不一致。

`AutomationValue` 会完全取代内置推断，而不是与之混合——一个类似 `CheckBox` 的自定义控件若想报告 `"true"`/`"false"`，要自己报告，而不会白白获得 `ValueOf` 自身的分支逻辑。每个内置控件的 `State` 保持为空；这里的任何改动都不会改变现有控件（未实现该接口的控件）的报告内容。

同样的状态也会到达其他消费者：在浏览器中，它作为 `data-mf-state-*` 属性出现在控件的 ARIA 镜像元素上，所以你让一个自定义控件可自动化，也就让它成为屏幕阅读器可以描述的控件。

---

## 选择你的层级
{:#levels}

有三条入口，它们消费的是*同一棵*自动化树——所以你在一个层级写的定位器，在其他层级同样有效。

| 层级 | 驱动应用的是什么 | 无显示器可运行 | 用途 |
|---|---|---|---|
| **1. 进程内**——`AutomationSession` | 你的测试代码，在同一进程中 | **是**（Headless 后端） | 套件的主体。快速、可调试、无端口、无驱动。 |
| **2. 远程**——`WebDriverServer` + Selenium | 任何 W3C WebDriver 客户端，通过 HTTP | 是 | 复用现有 Selenium 套件、非 .NET 测试语言、用检查器录制定位器。 |
| **3. Windows 原生**——UIA 桥 | FlaUI、WinAppDriver、Appium、Accessibility Insights | 否（需要 Windows 桌面会话） | 验证真实的屏幕阅读器行为，以及用 Windows QA 团队已有的工具驱动应用。 |

**默认用层级 1**保证覆盖率，用层级 3 做无障碍验证。当 .NET 之外的东西必须驱动应用时，才用层级 2。

---

## 四个前提条件
{:#prerequisites}

这些弄错了，每个层级都会以令人困惑的方式出问题。

### 1. 为每个交互控件命名
{:#prerequisites-names}

定位器依赖两个属性。`Control.Name` 成为元素的 **AutomationId**——稳定的定位器。`Control.AccessibleName`（回退到 `Text`，再回退到 `Name`）成为它的 **Name**。

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

把它定为代码评审规则。同样几下键盘既买到了测试定位器，*也*买到了屏幕阅读器支持；而在现有应用中补全名称，是采用 UI 测试过程中最乏味的一步。

### 2. 在自动化之前强制执行一次布局
{:#prerequisites-layout}

窗体完成布局之前，边界和命中测试并不存在。在无头后端上，只有有人请求一帧时才会布局，所以测试做的第一件事是渲染一次：

**C#**

```csharp
using var form = new GreetForm ();
HeadlessRenderer.CapturePng (form, 360, 140);   // 强制布局；丢弃返回的字节
```

**VB.NET**

```vb
Using form As New GreetForm()
    HeadlessRenderer.CapturePng(form, 360, 140)   ' 强制布局；丢弃返回的字节
End Using
```

跳过这一步，`Click` 就会落空，因为每个控件的 `Bounds` 仍是空的。你**不需要**调用 `Show()`——未显示的窗体在进程内是完全可自动化的。

### 3. 串行运行 UI 测试
{:#prerequisites-serial}

活动后端（`Platform.Backend`）和 `Application.OpenForms` 是进程全局的。共享它们的测试不能并行运行——一个测试中的模态对话框会从全局打开窗体列表中选取它的所有者，可能会在另一个测试的窗口上永远等待下去。

**C#（xUnit）**

```csharp
using Xunit;

// 后端和 Application.OpenForms 是进程全局状态。
[assembly: CollectionBehavior (DisableTestParallelization = true)]
```

NUnit：`[assembly: LevelOfParallelism(1)]`，且不要用 `[Parallelizable]`。MSTest：在 `.runsettings` 中不写 `<Parallelize>`，或把 `Workers` 设为 `1`。

如果你想为非 UI 测试保留并行，可以照框架自己的测试套件的做法：把所有触及后端的类放进同一个 xUnit 集合（`[Collection ("Headless")]`），xUnit 会串行运行它，其余的保持自由。框架用一个测试（[`HeadlessCollectionConventionTests`]({{ site.github_url }}/blob/main/tests/Majorsilence.Forms.Tests/HeadlessCollectionConventionTests.cs)）来强制这一约定：它扫描编译后的程序集，查找对 `HeadlessRenderer.Use ()` 的调用，并点名任何没有加该特性却调用了它的类，使测试失败——在强制执行之前，曾有七十个文件偏离了这一约定，所以如果你采用这个模式，把这道守卫也一并复制过去。

### 4. 每个程序集只安装一次 Headless 后端
{:#prerequisites-bootstrap}

**C#——模块初始化器是最整洁的挂接点**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Backends;
using Majorsilence.Forms.Headless;

internal static class TestBackend
{
    // 在程序集中任何测试之前运行。Headless 后端没有 UI 线程
    // 调度器亲和性，这正是它在测试运行器的工作线程下安全的原因。
    [ModuleInitializer]
    internal static void Init () => Platform.Backend = new HeadlessPlatformBackend ();
}
```

**VB.NET——VB 没有模块初始化器**

```vb
Imports Majorsilence.Forms.Backends
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBackend
    ' VB 不能使用 <ModuleInitializer>——VB 编译器不会生成模块初始化器，
    ' 所以仅加该特性会悄无声息地什么都不做，每个测试都会在没有后端的
    ' 情况下运行。请改用测试框架的程序集级挂接点：
    ' MSTest 的 <AssemblyInitialize>、NUnit 的 <SetUpFixture> + <OneTimeSetUp>，
    ' 或 xUnit 的程序集 fixture。
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        Platform.Backend = New HeadlessPlatformBackend()
    End Sub
End Class
```

如果你更喜欢 `HeadlessRenderer.Use ()`，它做的是同一件事，但有一个额外行为值得了解：除了在 Headless 后端尚未激活时安装它之外，**每次调用都会把调用线程设为** Headless 后端的 **UI 线程**。这在测试运行器下很重要，因为运行器会把每个测试交给任何一个空闲的工作线程：`Application.RunOnUIThread` 和后端的队列是按线程 id 判断"我在 UI 线程上吗？"的，所以一个只记住*第一个*提问线程的后端，会把之后每个测试的工作都当成线程外的。因此框架自己的测试套件在每个测试的开头都调用 `HeadlessRenderer.Use ()`，而不是每个程序集一次——如果你的测试会把工作封送回 UI 线程，这个廉价的习惯值得复制。

> **不要在 Avalonia 后端上运行 UI 测试。**Avalonia 的调度器是线程绑定的，与测试运行器的工作线程冲突。Headless 后端的存在正是为了让你的套件既不需要显示器*也*不需要 UI 线程——这就是框架自己的套件在它上面运行的原因。

---

## 层级 1——在无头后端上的进程内测试
{:#level-1}

这套 API 小到一次就能学会。

| 调用 | 作用 |
|---|---|
| `new AutomationSession (form)` | 包装一个窗体（或任何 `WindowBase`） |
| `session.Find (by)` / `FindOrThrow (by)` / `FindAll (by)` | 每次都查询一个**新的**快照 |
| `By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` | 定位器 |
| `session.Click (element)` | 按下，经过真实的输入管线 |
| `session.SendKeys (element, text)` | 聚焦 + 输入 |
| `session.PressKey (Keys.Enter)` | 向聚焦的控件发送一个单独的按键 |
| `session.Clear (element)` | 清空可编辑控件 |
| `session.GetText (element)` | 读取值/文本 |
| `session.Root` / `session.GetPageSource ()` | 整棵树，以对象 / XML 的形式 |

元素暴露 `AutomationId`、`Name`、`Role`、`ControlType`、`Value`、`State`（自定义绘制控件自己的额外状态——见[上文](#custom-controls)；对所有内置控件为空）、`Enabled`、`Visible`、`Focused`、`Bounds`、`Children`、`ClickPoint` 和 `Descendants()`。

> **`AutomationElement` 是不可变的快照——读取之前要重新解析。**这是人人都会踩的一个坑，而且它是不对称的：对先前捕获的元素执行*动作*没问题（`Click`/`SendKeys` 会路由到实时控件），但*读取*返回的是捕获时的状态。
>
> ```csharp
> var box = session.FindOrThrow (By.Id ("nameBox"));
> session.SendKeys (box, "Ada");          // 可行——动作到达实时控件
> session.GetText (box);                  // ""——这个快照早于输入
> session.GetText (session.FindOrThrow (By.Id ("nameBox")));   // "Ada"——新的快照
> ```
>
> 所以：如果愿意，可以为动作捕获元素，但 `GetText`、`Enabled`、`Visible`、`Value` 和 `Bounds` 一定要重新 `Find`。[下文的页面对象模式](#page-objects)通过把定位器暴露为*属性*，让这一点自动完成。

一个完整的测试：

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
        HeadlessRenderer.CapturePng (form, 360, 140);        // 布局

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

        // 断言从树中读取的状态，而不是你自己的字段引用。
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
            HeadlessRenderer.CapturePng(form, 360, 140)      ' 布局

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

`Click` 和 `SendKeys` 走的是真实后端所用的同一条中立输入路径，所以它们锻炼的是真实的路由、焦点和布局——而不是仅供测试的捷径。这正是无头断言有意义的原因。

### XPath，当没有稳定 id 时
{:#level-1-xpath}

`By.XPath` 是针对 `GetPageSource()` 返回的同一份 XML 运行的，所以你看到什么就能匹配什么：

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

仅限选择元素的表达式——位置、属性谓词和后代轴都可以用。

### 更底层的输入，当你需要手势时
{:#level-1-input}

`AutomationSession` 覆盖了点击和输入。对于拖拽、滚轮滚动，或在移动过程中保持按下，请下探一层到 `HeadlessRenderer`，它按窗口坐标注入：

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

这里的坐标是**逻辑单位**，渲染器会替你转换为设备像素——这就是为什么当你以 `MF_HEADLESS_SCALE=2` 运行同一测试时它们依然有效。`MF_HEADLESS_SCALE=2` 是模拟 HiDPI 的门禁，框架自己的 CI 把它作为四种形态之一运行（Debug、Release、`MF_FORCE_CUSTOM_CHROME=1`，以及 `MF_FORCE_CUSTOM_CHROME=1 MF_HEADLESS_SCALE=2`）。你的套件也要在它之下运行；逻辑单位与设备像素的混淆在缩放 1 时是看不见的。

---

## 等待，而不用 `Thread.Sleep`
{:#waits}

**没有内置的隐式等待**，而这对进程内测试来说是正确的默认值：除非你的应用让它异步，否则没有什么是异步的。但一旦你的代码在后台线程上工作并用 `Application.RunOnUIThread` 封送回来，你就需要泵送消息并轮询，而不是睡眠。

写一次，到处用：

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

            // 在再次探测之前，让排队的工作（计时器、RunOnUIThread 回调）运行。
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

            ' 在再次探测之前，让排队的工作（计时器、RunOnUIThread 回调）运行。
            Platform.Backend.DoEvents()
            Thread.Sleep(10)
        Loop While clock.ElapsedMilliseconds < timeoutMs

        Throw New TimeoutException($"Timed out after {timeoutMs}ms: {message}")
    End Function
End Module
```

然后：`Wait.For (session, By.Id ("resultsGrid"))`，或 `Wait.Until (() => session.GetText (label) == "Done" ? label : null, 5000, "label never said Done")`。

**绝不要单独使用 `Thread.Sleep`。**没有 `DoEvents()`，排队的回调永远不会运行，所以单纯的睡眠只会让测试更慢，*而且*依然失败。

---

## 页面对象
{:#page-objects}

散落在 200 个测试里的 `By.Id ("okButton")`，正是让 UI 套件维护成本高昂的原因。每个界面只包装一次。

**C#**

```csharp
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

public sealed class GreetPage
{
    private readonly AutomationSession session;

    public GreetPage (GreetForm form)
    {
        HeadlessRenderer.CapturePng (form, 360, 140);   // 布局，只在这里做一次
        session = new AutomationSession (form);
    }

    // 定位器只存在于一个地方。
    private AutomationElement NameBox => session.FindOrThrow (By.Id ("nameBox"));
    private AutomationElement Ok      => session.FindOrThrow (By.Id ("okButton"));
    private AutomationElement Cancel  => session.FindOrThrow (By.Id ("cancelButton"));

    // 方法读起来是用户意图，而不是点击。
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
        HeadlessRenderer.CapturePng(form, 360, 140)     ' 布局，只在这里做一次
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

定位器用**属性而不是字段**很重要：`Find` 每次调用都查询新的快照，所以属性会在 UI 变化后重新解析，而缓存的字段会过时。

于是测试读起来就是行为：

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

## 层级 2——Selenium 与 WebDriver 服务器
{:#level-2}

`Majorsilence.Forms.WebDriver` 在回环地址上通过 HTTP 托管一个 **W3C WebDriver** 端点。由于 WebDriver 只是 HTTP 和 JSON，任何语言的任何客户端都能驱动你的桌面应用——包括你的 Web 团队已经在用的 Selenium 绑定。

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

using var server = new WebDriverServer (form, port: 4444);
server.Start ();

Console.WriteLine (server.Url);      // http://127.0.0.1:4444/  （仅回环地址）

// … 驱动它 …

server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Using server As New WebDriverServer(form, port:=4444)
    server.Start()

    Console.WriteLine(server.Url)    ' http://127.0.0.1:4444/  （仅回环地址）

    ' … 驱动它 …

    server.Stop()
End Using
```

**支持的命令：**新建/删除会话、查找元素（单个/多个）、点击、发送按键、清空、获取文本、获取名称（角色）、获取属性、获取矩形、获取启用状态、**页面源代码**（`GET …/source`，XML）、截图（PNG，通过离屏渲染器），以及 `GET /status`。

有一处不对称需要了解：上述一切都能针对任何后端上的窗口工作，但**截图仅限 Headless**。`GET …/screenshot` 通过 `HeadlessRenderer` 渲染，而它会拒绝自己没有托管的窗口——把它指向 Avalonia 后端上的桌面应用，它会回答 `Window is not hosted on the Headless backend`。请改为读取树，并在无头测试运行中截图，反正[黄金图像](#visual)也在那里。

**定位器策略：**`id`、`name`、`tag name`（角色）、`xpath`、`css selector`（`#id` 和 `[name='…']` 两种形式），外加自定义的 `role`、`type` 和 `link text`。元素引用在每次使用时都针对新的快照重新解析，优先使用稳定的 AutomationId——所以在 UI 发生变化之后，引用依然有效。

### 用真正的 Selenium 客户端驱动它
{:#level-2-selenium}

元素动作会被封送到 UI 线程上，所以在一个没有消息循环的测试里，你要在主线程泵送队列，同时让 HTTP 调用在工作线程上运行。这是框架自己的测试所用的模式，也是应该复制的那个：

**C#**

```csharp
using System.Net;
using System.Net.Sockets;
using Majorsilence.Forms.WebDriver;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using MFPlatform = Majorsilence.Forms.Backends.Platform;   // 见下文的坑

static int FreePort ()
{
    var listener = new TcpListener (IPAddress.Loopback, 0);
    listener.Start ();
    var port = ((IPEndPoint) listener.LocalEndpoint).Port;
    listener.Stop ();
    return port;                                   // 在 CI 中绝不要硬编码 4444
}

static T RunPumped<T> (Func<T> work)
{
    var task = Task.Run (work);
    while (!task.IsCompleted) {
        MFPlatform.Backend.DoEvents ();            // 在此线程上泵送
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

三个坑，全都是实际运行时发现的：

1. **`Platform` 有歧义。**`Majorsilence.Forms.Backends.Platform` 与 `OpenQA.Selenium.Platform` 冲突——两个命名空间一起导入就会报 CS0104。像上面那样给其中一个起别名。
2. **用 `GetDomAttribute`，不要用 `GetAttribute`。**Selenium 4 的旧版 `GetAttribute` 会通过 `/session/{id}/execute/sync` 运行一个 JavaScript 原子，而原生应用没有与之对应的东西——它会抛出 `NotImplementedException`。`GetDomAttribute` 走的是普通的 `/attribute/{name}` 端点，这个端点已经实现，会返回 `id`、`name`、`role`、`type`、`value`、`enabled`、`visible` 以及边界。
3. **优先使用 `By.CssSelector ("#id")` 和 `By.XPath`。**Selenium 的 .NET 客户端对 `By.Name` 不发送 `using: "name"`——它把它改写为 CSS 选择器 `*[name ="x"]`。这种形式可以接受，但 `By.CssSelector ("#okButton")` 和 XPath 是最不令人意外的选择。任何需要 JavaScript 的东西（`ExecuteScript`、建立在它之上的隐式等待）从结构上就不可用。

### 或者完全跳过绑定
{:#level-2-http}

对于冒烟测试——或者在一种没有安装 Selenium 的语言里——原始协议只是三次调用：

```bash
SID=$(curl -s -XPOST 127.0.0.1:4444/session -d '{}' | jq -r .value.sessionId)

curl -s 127.0.0.1:4444/session/$SID/source                       # XML 树
curl -s -XPOST 127.0.0.1:4444/session/$SID/element \
     -d '{"using":"css selector","value":"#okButton"}'            # 查找
curl -s -XPOST 127.0.0.1:4444/session/$SID/element/$EID/click -d '{}'
```

Python，完全不需要了解框架：

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Remote("http://127.0.0.1:4444", options=webdriver.ChromeOptions())
print(driver.page_source)                          # XML 树
driver.find_element(By.CSS_SELECTOR, "#okButton").click()
driver.quit()
```

能力（capabilities）会被忽略——服务器总是授予会话，所以传你的客户端要求的任何内容即可。

---

## 用检查器录制定位器
{:#inspector}

由于服务器既暴露 XML **页面源代码**，*又*提供一个针对这份源代码求值的 `xpath` 策略，任何 Appium 风格的检查器都可以把实时元素树渲染在截图之上，让你通过点击节点捕获定位器。检查器用的循环只是服务器实现的三条命令：

| 步骤 | 命令 | 返回 |
|---|---|---|
| 树的快照 | `GET /session/{id}/source` | XML（见[上面的示例](#tree)） |
| 显示 UI | `GET /session/{id}/screenshot` | base64 PNG |
| 确认定位器 | `POST /session/{id}/element` + `…/attribute/{name}` | 元素 / 它的属性 |

这是推荐的录制路径：Selenium IDE 录制的是浏览器内的 DOM 事件，没有办法附加到原生应用上。

| 设置 | 值 |
|---|---|
| Remote Host | `127.0.0.1` |
| Remote Port | 你传给 `WebDriverServer` 的端口 |
| Remote Path | `/` |
| Protocol | `http`，不用 SSL |
| Capabilities | 任意 JSON 对象——能力匹配会被忽略 |

按以下顺序优先选用捕获到的定位器：**`id`**（映射到 `Control.Name`；元素引用优先按它重新解析）→ **`xpath`** → `name` / `role` / `type`。

注意事项：这是一个 W3C WebDriver 服务器，不是完整的 Appium 服务器，所以 Appium 专有端点（设置、手势、应用管理）会返回 404——通用的 WebDriver 客户端是最可靠的检查器。边界是逻辑客户区坐标，所以在不同 DPI 下捕获的叠加层即使定位器正确也可能有偏移。每个会话一个窗口，隐藏的控件会从树中省略。

---

## 层级 3——Windows 原生工具（FlaUI、WinAppDriver、Appium）
{:#level-3}

`Majorsilence.Forms.WindowsUIAutomation` 把同一棵树投射到 **Windows UI Automation** 上。这就是让 Narrator、NVDA 和 JAWS 读出你的应用的东西——同时也意味着基于 UIA 的测试工具无需自定义协议就能驱动它。

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // 必须先显示——它需要原生句柄
WindowsUIAutomation.Enable (form);  // 窗口关闭时自动分离
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' 必须先显示——它需要原生句柄
WindowsUIAutomation.Enable(form)    ' 窗口关闭时自动分离
```

> **这在 Windows 之外无法编译**——这是验证过的，不是推测。离开 Windows，该包以空存根的形式发布，所以命名空间不存在，你得到的是 **CS0234**，而不是运行时的 `PlatformNotSupportedException`。请多目标化（`net10.0;net10.0-windows`）并用 `#if WINDOWS` 保护，或者把这个调用放在仅限 Windows 的项目里。

每个控件都成为一个 UIA 元素，具有 **Name**、**AutomationId**（`Control.Name`）、**ControlType**、**IsEnabled**、**HasKeyboardFocus** 和屏幕 **BoundingRectangle**。焦点变化会引发 UIA 的焦点变化事件。

它与后端无关——对任何提供原生窗口句柄的 Windows 宿主都有效——并且键盘焦点的移动会触发 UIA 焦点变化事件，这正是让屏幕阅读器播报新控件、让放大镜跟随光标的机制。聚焦控件的值变化会引发属性变化事件。

`LiveSetting` 为 `Polite` 或 `Assertive` 的 `Label` 是一个实时区域：它的元素报告 UIA 的 **LiveSetting**，而改变它的文本会引发 UIA 的 **LiveRegionChanged** 事件，这正是让 Narrator 和 NVDA 在用户没有移动到状态标签时也读出其新文本的机制（与上游的 `Label.OnTextChanged` 一样）。元素的 **HelpText** 是其控件的 `AccessibilityObject.Help`，所以 `Control.QueryAccessibilityHelp` 处理程序的 `HelpString` 就是屏幕阅读器读出的该控件的帮助文本。这两项都是针对 Windows 引用程序集编译的，但尚未在真实屏幕阅读器上听到过效果。

**今天能用什么，以及可以期待什么：**`Invoke` 模式（按钮）已可用，所以 FlaUI 或 WinAppDriver 脚本可以找到控件并点击它们。`Value`（文本、组合框）和 `Toggle`（复选框）**仅暴露为可读**；写入支持是后续阶段的工作——所以通过 UIA *设置*文本可能还不行，通过层级 1 或层级 2 的表面输入才是可靠的路径。这一版尚未包含：逐键的 `TextBox` 值事件（该控件尚未引发 `TextChanged`，所以屏幕阅读器会回退到自己的逐字符回显——字段的值在获得焦点时仍会被播报）、结构变化事件，以及子控件项（单个标签页、列表行）。

由于这种分工，Windows 上务实的做法是：**用层级 1 或 2 驱动，用层级 3 验证无障碍。**

纯粹的树/角色逻辑在框架自身中有单元测试（`Majorsilence.Forms.WindowsUIAutomation.Tests`，在 Windows CI 上），但完整的 COM 往返需要一个交互式的 Windows 桌面会话——无法无头地断言。运行你的应用，`Enable` 这座桥，然后用 **Accessibility Insights** 或 `inspect.exe` 检查，以屏幕阅读器的视角查看这棵树。真正重要的检查是打开 **Narrator** 并用 Tab 在窗口中切换：每个控件都应连同名称和角色被播报，按钮应能从屏幕阅读器激活。

基于同一棵树的 Linux（AT-SPI）和 macOS（NSAccessibility）桥在路线图上。如果你在这些平台上有无障碍义务，现在就要围绕这一点做规划。

**浏览器的覆盖方式不同。**在 `net10.0-browser` 上，Avalonia 后端把同一棵树镜像到画布旁边一个由透明、可点击穿透的元素组成的 DOM 中——每个控件一个，带有 ARIA 角色、名称、状态和边界，外加 `aria-live` 区域，用于 UIA 桥所引发的同样的标签/状态/对话框播报。这就是屏幕阅读器、页内查找或基于 DOM 的测试工具所看到的东西。它不需要你做任何调用（可通过 `Majorsilence.Forms.Browser.DisableAccessibilityDom` AppContext 开关退出），并且它是在 CI 中通过读取无头 Chrome 的 DOM 来验证的，而不是通过真实屏幕阅读器。[后端页面]({{ '/zh/backends/' | relative_url }}#accessibility-dom-browser)记录了角色、状态和实时区域规则。

---

## 基于黄金图像的视觉回归
{:#visual}

`HeadlessRenderer.CapturePng` 把窗体离屏渲染为 PNG 字节。这就是你的黄金图像原语，而且它不需要显示器：

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
        return;                                   // 首次运行记录基线；之后绝不悄悄通过
    }

    var expected = File.ReadAllBytes (goldenPath);

    if (!expected.AsSpan ().SequenceEqual (actual)) {
        // 写出实际字节，以便 CI 把它们作为产物附加。
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

几条实用规则，都是以枯燥的方式学到的：

- **有意地重新生成，绝不自动生成。**一个 `UPDATE_GOLDEN=1` 环境变量门禁（或者 [Verify](https://github.com/VerifyTests/Verify) / ApprovalTests 中的等价物，它们免费附带这一点以及一个差异工具启动器）可以防止"测试变绿了"变成"基线被移动了"。
- **始终把 `.actual.png` 作为 CI 产物发布。**没有附带图像的字节比较失败，是谁也无法处理的 bug 报告。
- **只给少数几个界面做黄金图像，而不是全部。**它们能捕获布局和主题回归；但也会在每一次有意的像素变化上失败，所以要让这组图像保持小而高价值。
- **字体在不同操作系统上不同。**在 CI 中把黄金图像锁定在一个平台上（Linux 最便宜），而不是为每个操作系统维护一套基线。
- **不要在 `MF_HEADLESS_SCALE=2` 下做黄金图像**，除非你也维护一套 2× 基线——在缩放运行中改为*按比例*断言布局，并把像素比较保持在缩放 1。

对于语义（非像素）快照，`session.GetPageSource()` 是稳定得多的基线：它在结构变化时变化，而忽略渲染。为"UI 是否保持了同样的形状"这类检查快照这份 XML，把 PNG 留给"它看起来是否还正确"。

---

## BDD：在其上运行 Reqnroll / SpecFlow
{:#bdd}

不需要任何特殊处理——页面对象完成工作，步骤定义保持精简。

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

保持程序集级别的并行禁用（[上文](#prerequisites-serial)）——这同样适用于 BDD 运行器。

---

## CI 配方
{:#ci}

没有显示器，不用下载驱动，没有 X 服务器。UI 套件就只是 `dotnet test`。

### GitHub Actions
{:#ci-github}

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest          # 不需要显示器——Headless 后端
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x

      - run: dotnet build --configuration Release
      - run: dotnet test --configuration Release --no-build --logger "trx;LogFileName=test.trx"

      # 2 倍缩放下的布局。保持为单独的作业/步骤，这样缩放失败一目了然。
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

只为真正需要 Windows 的部分添加 Windows 作业——UIA/无障碍检查：

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

Jenkins 比托管服务需要多一点设置，因为它读不了 .NET 的原生测试输出，也因为 Windows 代理的安装方式通常会破坏 UI 自动化。两者都是一次性修复。

**首先，选择一个测试结果发布器。**`dotnet test` 写出 TRX，没有哪个 Jenkins 发布器能原生读取它——所以你要给每个测试项目添加一个日志记录器包，并把对应的步骤指向它的输出。三种组合都可行；按你的 Jenkins 已有的插件来选：

| 发布器步骤 | 日志记录器包 | 插件 |
|---|---|---|
| `junit` | `JunitXml.TestLogger` | JUnit 插件——标准 Jenkins 安装中已有，所以这不需要任何插件工作 |
| `nunit` | `NunitXml.TestLogger` | NUnit 插件——需要单独安装，但许多 .NET 团队已经在用 |
| `mstest` | *无*——使用 `--logger trx` | MSTest 插件——需要单独安装；它转换 TRX，是你无法添加包引用时的唯一选择 |

```xml
<!-- 在每个测试项目中加其中一个 -->
<PackageReference Include="JunitXml.TestLogger" Version="8.0.0" />
<PackageReference Include="NunitXml.TestLogger" Version="8.0.0" />
```

这两个日志记录器在这里所有重要的方面都可以互换：同样的 `--logger "<name>;LogFilePath=…"` 语法、同样的 `{assembly}` 标记、同样的下文命名空间注意事项。只有输出方言和 Jenkins 步骤不同。没有这个包，`--logger junit` 会**让构建失败**，报 `Could not find a test logger with AssemblyQualifiedName, URI or FriendlyName 'junit'`——而不是悄无声息的空操作，这至少让遗漏在第一次就显而易见。

然后是 `Jenkinsfile`（JUnit 变体；NUnit 的替换见[下文](#ci-jenkins-nunit)）：

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
                            // dotnet 需要可写的 HOME；这个挂载让 NuGet 还原在构建之间
                            // 保持热缓存（NUGET_PACKAGES 解析到 HOME 之下）。
                            args '-e DOTNET_CLI_HOME=/tmp -e HOME=/tmp ' +
                                 '-v $HOME/.nuget/packages:/tmp/.nuget/packages'
                        }
                    }
                    steps {
                        sh 'dotnet build --configuration Release'

                        // 没有显示器，没有 Xvfb，不用下载驱动——Headless 后端。
                        sh '''
                            dotnet test --configuration Release --no-build \
                                --logger "junit;LogFilePath=$WORKSPACE/artifacts/junit/{assembly}.xml"
                        '''

                        // 2 倍缩放下的布局。单独调用，这样缩放失败在 Jenkins 测试报告中
                        // 一目了然，而不是混在主运行里。
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
                            // 没有图像，黄金图像失败就无法审查。
                            archiveArtifacts artifacts: '**/*.actual.png', allowEmptyArchive: true
                        }
                    }
                }

                stage('Accessibility (Windows)') {
                    // 必须是运行在交互式桌面会话中的代理——见下文。
                    agent { label 'windows-desktop' }
                    steps {
                        // 三重引号：单引号的 Groovy 字符串不能跨行。
                        // 在 Windows 上 dotnet 可以接受正斜杠。
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

#### 改用 NUnit 插件
{:#ci-jenkins-nunit}

如果你的 Jenkins 已经有 NUnit 插件，把包换成 `NunitXml.TestLogger` 并改两行——日志记录器名称和发布器步骤。注意参数名不同：`junit` 用 `testResults`，`nunit` 用 `testResultsPattern`。

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

这会产生 NUnit v3 的 `<test-run>` XML，插件在导入时转换它——所以 Jenkins 的测试趋势、逐测试历史和失败浏览的行为都与 `junit` 完全一样。没有任何功能上的理由偏向其中一个；用你已经在维护的那个插件就好。

#### 四件值得了解的 Jenkins 特有事项
{:#ci-jenkins-gotchas}

否则这些每一件都要花一个下午才能发现。

- **给测试类加命名空间。**两个日志记录器都从命名空间推导每个测试的 `classname`。全局命名空间中的类会输出为 `classname="UnknownNamespace.UnknownType"`——这是并排运行两个日志记录器验证过的——于是每个测试都落进同一个毫无意义的桶里，Jenkins 的测试浏览器什么也分不了组。`namespace MyApp.UiTests` 中的类会输出为 `classname="MyApp.UiTests.GreetFormTests"`，报告就可以导航了。
- **`LogFilePath` 中的 `{assembly}` 会展开为测试程序集名**，所以多个测试项目不会互相覆盖结果。创建该目录或让日志记录器创建，并把 `junit` 指向通配符而不是单个文件。
- **Windows 代理必须运行在交互式桌面会话中。**Windows UIA 桥需要一个真实的原生窗口和一个可附加的桌面。作为 *Windows 服务*安装的 Jenkins 代理没有交互式会话，所以带窗口的应用和每一个 UIA 断言都会以看起来像框架 bug 的方式失败。改为从已登录的用户会话启动该代理（登录时运行代理 JAR 的计划任务，或在专用机器上手动启动代理）。Linux 阶段没有这样的要求——这正是 Headless 后端的全部意义。
- **每个 `agent` 块都有自己的工作区。**`--no-build` 只在同一个代理内有效；跨代理时构建输出不在那里。要么在每个阶段都构建（如上），要么显式地 `stash`/`unstash` 输出。给原本只用一个代理的流水线添加逐阶段的 `agent`，是突然出现"project file not found"或"assembly missing"失败的常见原因。

如果你的 Jenkins 没有 Docker，把 `docker` 代理换成普通的 `agent { label 'linux' }`，并在节点上安装 .NET SDK（或使用 **.NET SDK Support** 插件的 `dotnetsdk` 工具并把步骤包在 `withDotNet` 中）。测试套件本身没有任何变化——无论哪种方式它都不需要显示器。

> **这里验证了什么，没验证什么。**.NET 这一半是实际运行过的：两个日志记录器（`JunitXml.TestLogger` 和 `NunitXml.TestLogger`，8.0.0）、缺少包时的失败消息、`{assembly}` 标记展开为每个测试程序集一个文件，以及上文的命名空间到 `classname` 的行为。Jenkins 步骤和插件参数来自这些插件自己的文档，而不是来自一台实际运行的控制器——请对照你安装的插件版本检查 `testResults` / `testResultsPattern`。

### 人们跳过的那道门禁
{:#ci-wasm}

如果你要发布到浏览器，**构建 wasm 目标并不能证明它能工作。**运行 wasm-tools 管线（emcc/wasm-opt 原生链接）的是 `dotnet publish`，而只有在浏览器中真正启动一次才能证明这个包没问题。发布它，然后用无头 Chromium 做冒烟测试：

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
      # 提供 out/wwwroot 并断言画布已渲染 / 没有控制台错误。
      - run: node scripts/wasm-smoke.mjs
```

注意这个值得了解的讽刺之处：Playwright 不能驱动你*应用*的 UI（没有 DOM——见[限制](#limits)），但它恰恰是断言 WebAssembly 包能启动的正确工具。

---

## AI 工具如何接入这一切
{:#ai}

这个框架对 AI 编码助手和代理异常友好，原因只有一个结构性的理由：

> **自动化树是文本。**`session.GetPageSource()` 以 XML 返回实时 UI，带有 id、名称、角色、值、状态和边界。

模型可以*读取*你的用户界面，不需要像素、不需要 OCR、不需要视觉模型。这把"驱动 GUI"从一个计算机使用问题变成了一个文本问题——既便宜得多，也可靠得多。

```xml
<Form name="Greeter" role="window" type="Form" x="0" y="0" width="360" height="140">
  <Label   id="promptLabel" name="Your name:" role="label" ... />
  <TextBox id="nameBox" name="Full name" role="textbox" value="" enabled="true" ... />
  <Button  id="okButton" name="OK" role="button" enabled="false" ... />
</Form>
```

四种集成模式，从最便宜的开始。

### 1. Shell + curl——零集成工作
{:#ai-shell}

任何能运行 shell 命令的代理已经可以驱动你的应用了：启动 WebDriver 服务器，然后让它用 `curl` 调用[层级 2](#level-2-http) 中的端点。没有绑定、没有 SDK、没有 MCP 服务器。这是让编码助手在运行中的应用上*检查自己工作*的最快方式，而且通常也是起步的地方。

把三条命令（`/source`、`/element`、`/element/{id}/click`）交给代理，它就能自己探索。

### 2. 让助手面向测试循环
{:#ai-loop}

价值最高的模式根本不需要新的 API 表面——它就是：**整个循环无需显示器即可闭合**：

1. 代理读取 `GetPageSource()` 的输出（或一个现有测试）来了解控件名称。
2. 它用 `By.Id` 定位器写一个测试。
3. 它运行 `dotnet test`。
4. 它读取失败信息，编辑，重复。

这在容器里、在 CI 里、在没有 GUI 会话的机器上都能工作——而这正是编码代理运行的地方。对比像素驱动的 GUI 自动化：没有屏幕，代理根本看不到结果。

在你的仓库里放一份简短的 `AGENTS.md` / `CLAUDE.md`，就足以让助手擅长这件事：

```markdown
## 运行与测试 UI

- UI 测试无头运行：`dotnet test`。不需要显示器。绝不要添加 `Thread.Sleep`；
  使用 `tests/Support/Wait.cs` 中的 `Wait` 辅助类（它会泵送后端队列）。
- 后端在 `TestBackend.Init` 中每个测试程序集只安装一次——不要逐测试设置。
- 测试必须保持串行：`Platform.Backend` 和 `Application.OpenForms` 是全局的。
- 定位器来自 `Control.Name`（`By.Id("okButton")`）。如果控件没有 `Name`，就加一个，
  而不是按文本或索引定位。
- 在自动化一个窗体之前调用一次 `HeadlessRenderer.CapturePng(form, w, h)`——它会强制布局。
- 要以自动化层的视角查看 UI：`session.GetPageSource()` 把树打印为 XML。
- 断言*效果*（状态、DialogResult、渲染输出），绝不断言某个成员存在。
```

### 3. MCP 工具表面——面向交互式助手
{:#ai-mcp}

要让助手以对话方式驱动一个*正在运行*的应用，把自动化表面暴露为 [Model Context Protocol](https://modelcontextprotocol.io) 工具。**框架自带一个**——[`Majorsilence.Forms.Mcp`]({{ site.github_url }}/tree/main/tools/Majorsilence.Forms.Mcp)，一个已发布的 `dotnet` 全局工具，它通过 stdin/stdout 讲 MCP，并通过[层级 2](#level-2) 的 WebDriver 端点驱动应用：

```
dotnet tool install -g Majorsilence.Forms.Mcp
```

```
assistant  ──MCP/stdio──▶  majorsilence-mcp  ──HTTP/loopback──▶  your app (WebDriverServer)
```

通过 HTTP 桥接而不是链接到框架，正是它与版本和后端无关的原因：它能驱动任何启动了 `WebDriverServer` 的 Majorsilence.Forms 应用，而且永远不必封送到别人的 UI 线程上。

所以应用端的设置就是你为 Selenium 已经需要的那两行：

```csharp
using var server = new WebDriverServer (form, 4444);
server.Start ();
```

然后把客户端指向它。Claude Code：

```
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444
```

任何自己启动 MCP 服务器的客户端（Claude Desktop、编辑器、代理框架）都以各自的配置格式接受同一条命令：

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

选项：`--port <port>`（回环地址，默认 4444）、`--url <url>` 指定完整的基础 URL，或 `MAJORSILENCE_MCP_URL` 环境变量；`--help` 打印同样的摘要。

它暴露的工具：

| 工具 | 参数 | 返回 |
|---|---|---|
| `ui_snapshot` | — | 整棵控件树，XML 形式 |
| `ui_find` | `target`、`strategy` | id、名称、角色、类型、值、文本、启用/可见、边界 |
| `ui_read` | `target`、`strategy` | 控件当前显示的内容 |
| `ui_click` | `target`、`strategy` | 确认，或被拒绝的原因 |
| `ui_type` | `target`、`text`、`strategy`、`clear` | 之后控件读出的内容 |
| `ui_wait_for` | `target`、`strategy`、`timeoutMs`、`requireEnabled` | 就绪状态，或等待超时的原因 |
| `ui_screenshot` | — | 窗口的 PNG——[仅限 Headless 托管的窗口](#level-2) |

其中有三个决定值得在你自己构建时复制：

- **每个工具接受定位器，而不是元素句柄。**每次调用都重新解析它要操作的对象，所以[过时陷阱](#level-1)无从下口：没有任何句柄可以让模型跨轮次持有。
- **`strategy` 默认为 `id`**——即控件的 `Name`——无法识别的策略会被按名称拒绝，而不是透传。服务器对任何它不认识的策略都会回退到*名称*查找，所以一个未经检查的拼写错误会悄悄地以错误方式搜索，然后回答"not found"。
- **`ui_click` 和 `ui_type` 被标注为破坏性操作，其余为只读**，宿主在决定自动批准什么时会把这一点展示给用户。

**可以指向的目标。**[`samples/AutomationTarget`]({{ site.github_url }}/tree/main/samples/AutomationTarget) 是一个正为此而建的小应用：它自己启动端点，并打印驱动它的命令（MCP 的 `claude mcp add` 一行、一个 Selenium `RemoteWebDriver` 构造函数，以及一条针对 `/status` 的 `curl`）。

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

`--webdriver <port>` 选择端口；`--no-webdriver` 把它作为普通应用运行。它的每个控件都锻炼客户端必须处理的一件事——一个可写可读的文本框（`nameBox`）、一个其处理程序会改变标签的按钮（`greetButton` → `greetingLabel`）、一个永久禁用的按钮（`lockedButton`，让你看到拒绝而不是虚假的成功）、一个只有勾选 `agreeCheck` 复选框后才启用的 Submit 按钮（这正是 `ui_wait_for` 的用途）、一个行是 `listitem` 节点的 `logList`，以及一个故意*未命名*的标签，让你看到空 `id` 在树中是什么样子。每个动作都会追加到可见的日志和 stdout，所以你可以核对客户端声称做了的事与应用实际看到的是否一致。一个很好的第一个练习：*"在 nameBox 中输入 'Grace Hopper'，点击 greetButton，然后读取 greetingLabel"*，应当返回 `Hello, Grace Hopper!`。

它以吃亏的方式教会两件事：它运行在 Avalonia 后端上，所以 `ui_screenshot` 会被拒绝（截图[仅限 Headless](#level-2)）；而它的列表项没有 `id`，所以要按名称、文本或 XPath 定位。

两半都在 NuGet 上——这个工具，以及供被测应用使用的 `Majorsilence.Forms.WebDriver`——所以不需要从仓库构建任何东西。如果你确实想从源码运行服务器（比如为了修改它），等价的命令是：

```
dotnet run --project tools/Majorsilence.Forms.Mcp -- --port 4444
```

#### 或者把这个表面托管在你自己的进程内
{:#ai-mcp-inprocess}

如果你更愿意从应用内部暴露这些工具——或者把它们接入一个不是 MCP 的代理框架——框架特有的部分只是 `AutomationSession` 之上的一个薄适配器：

**C#**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

// 每个被测应用一个实例。每个方法都在 UI 线程上调用。
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
            return $"no element with id '{id}'";       // 模型可以据此行动的普通错误
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

        // 重新解析再读取：捕获的元素是输入之前的快照。
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

        ' 重新解析再读取：捕获的元素是输入之前的快照。
        Return session.GetText(session.FindOrThrow(By.Id(id)))
    End Function

    Public Function Screenshot(width As Integer, height As Integer) As Byte()
        Return HeadlessRenderer.CapturePng(form, width, height)
    End Function
End Class
```

两条比管道代码更重要的设计说明：

- **以文本而不是异常返回错误。**"no element with id 'okButton'" 是模型可以从中恢复的东西；跨越工具边界的堆栈跟踪通常不是。
- **封送到 UI 线程。**如果你的宿主应用运行着真实的消息循环，用 `Application.RunOnUIThread` 包装每次调用。WebDriver 服务器已经替你做了这件事——这是一个很好的理由：当应用是运行中的桌面进程时，去包装*它*而不是 `AutomationSession`。

**或者完全跳过 MCP：**由于 WebDriver 端点就是回环地址上的普通 HTTP，拥有 shell 访问权限的助手（[模式 1](#ai-shell)）或一个通用的支持 HTTP 的 MCP 服务器，无需任何额外进程就能驱动同一个应用。

### 4. 你自己的代理循环，进程内
{:#ai-agentloop}

如果你要把代理构建*进*你的产品——一个操作 UI 的"替我做这件事"助手——同一个适配器就成为普通工具使用循环中的工具定义。使用 [Anthropic C# SDK](https://github.com/anthropics/anthropic-sdk-csharp)（`dotnet add package Anthropic`），工具是原始 JSON 模式，`client.Beta.Messages.ToolRunner(...)` 替你运行循环，调用你的函数并把结果回传，直到模型停止：

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

// 模型默认值：claude-opus-5。然后把工具调用分发给上面的 UiAgentSurface。
```

给每个工具一个**规定性的**描述——说明*何时*调用它，而不只是它做什么（"在一个你尚未检查过的界面上，首次 `ui_click` 之前先调用 `ui_snapshot`"）。这一个习惯对可靠性的贡献，超过任何程度的提示词调优。

### 代理编写测试的护栏
{:#ai-guardrails}

代理确实擅长编写这类测试。它们同样擅长编写那种能通过却什么都证明不了的测试，所以请专门针对以下几点进行审查：

- **断言效果，而不是存在。**`Assert.NotNull(session.Find(By.Id("okButton")))` 证明控件存在；它不证明点击它会发生任何事。这一点在这里比在大多数框架中更重要，因为未实现的成员
  [会安全地空操作而不是抛出异常]({{ '/zh/training/' | relative_url }}#module-3-stub-policy)——一个只检查成员可达的测试，面对存根也会通过。
- **留意为了让测试变绿而被放宽的断言。**一个被改动的 `Assert.Equal` 是伪装起来的行为变更。要对比断言的差异，而不只是测试数量。
- **绝不让代理重新生成黄金图像。**让 `UPDATE_GOLDEN` 始终是人的操作；一个被代理改写成与它自己的输出相匹配的基线什么都测不到。
- **要求使用 `Name` 而不是索引。**`By.XPath("(//Button)[3]")` 一直有效，直到有人添加一个按钮。如果某个控件没有 `Name`，正确的修复是给它加一个。
- **让它在定位之前先读取页面源。**从源代码而不是从实际的树中凭空想出来的定位器，是代理编写的测试出现抖动的最常见原因。

---

## 限制与反模式
{:#limits}

**Playwright 无法驱动你的桌面应用。**它通过 Chrome DevTools 协议针对 DOM 来自动化浏览器引擎；而桌面后端上的 Majorsilence.Forms 应用使用 Skia 原生渲染，没有可供附加的 DOM 或浏览器引擎。HTTP 表面*可以*通过 Playwright 的 API 请求客户端来调用，把它当作一个 HTTP 服务——但那不是浏览器自动化，与普通的 WebDriver 客户端相比也没有任何优势。请改用 [WebDriver 服务器](#level-2)。（Playwright *确实*是用来冒烟测试你的 [WebAssembly 包能否启动](#ci-wasm)的正确工具——那是另一项工作。）

**浏览器目标是部分例外。**在那里，Avalonia 后端为打开的窗体维护一个 [ARIA DOM 镜像](#tree)，所以 DOM 工具*可以*定位控件——按角色和名称，或者按 `[data-mf-automation-id="okButton"]`——并读取它们的状态。输入仍然属于画布：镜像元素是 `pointer-events: none`，所以要在元素的边界框处点击（先 `locator.boundingBox ()` 再 `page.mouse.click`），而不是使用 DOM 点击。这对浏览器冒烟测试已经足够；套件的主体仍然属于层级 1。

在围绕它们设计套件之前，还有一些值得了解的边界：

| 限制 | 后果 |
|---|---|
| 每个 WebDriver 会话一个窗口 | 没有框架或窗口切换；多窗口流程属于层级 1 |
| 截图需要 Headless 后端 | `GET …/screenshot` 针对桌面托管的窗口会失败（[见上文](#level-2)）；请在无头运行中截图 |
| 选项卡标题和网格单元格不在树中 | 菜单、工具栏和列表项在（[见上文](#tree)）；选项卡和 `DataGridView` 单元格仍需要它们自己的节点 |
| 没有逐项选择状态 | 读取列表的 `value` 来获取其选中项；一个项目目前还不能自行报告"已选中" |
| 隐藏控件从树中省略 | 你无法对不可见控件的内容进行断言——请改为断言可见性 |
| 没有 JavaScript 执行端点 | 建立在 `execute/sync` 之上的 Selenium API（`ExecuteScript`、`GetAttribute`、基于 JS 的等待）不可用；请使用 `GetDomAttribute` 和你自己的轮询 |
| 没有隐式等待 | 自带你的 [`Wait` 助手](#waits) |
| UIA 写入模式不完整 | 通过层级 1/2 设置文本；用层级 3 验证播报，而不是驱动输入 |
| UIA 包在编译时仅限 Windows | 用 `#if WINDOWS` 保护，或隔离到一个仅限 Windows 的项目中 |
| `AutomationElement` 是不可变快照 | 操作接受捕获的元素；**读取必须重新解析**（[见上文](#level-1)） |
| 测试共享全局后端状态 | 始终串行执行 |

以及造成大部分痛苦的两个习惯：

- **不要断言缩放 1 下的像素几何。**框架自身的 HiDPI 故障几乎全部源于同一个混淆——逻辑单位与设备单位。自 2026-10-01 起，公共表面始终是**逻辑**单位：`Bounds`、`ClientRectangle`、`ClientSize`、`MouseEventArgs`、`GetTabRect` 以及绘制画布（`OnPaint`、`e.ClipRectangle`）共用同一种单位，并且框架会替你缩放画布（一个仍在调用 `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` 的自定义控件现在会被缩放两次——请移除它）。设备像素只能在明确以此命名的地方触及——`Scaled*` 家族（`ScaledWidth`、`ScaledBounds`……）、`PaintEventArgs.Scaling`、`LogicalToDeviceUnits`、后台缓冲区和捕获的位图——再加上剩下的一个例外：**自绘事件**（`DrawItem`、`DrawNode`、`CellPainting`）仍然交给你设备像素边界。两套单位系统在缩放 1 时完全相同，所以混用它们在缩放显示器出现之前是看不见的。请按比例断言，并运行 `MF_HEADLESS_SCALE=2` 门禁。
- **不要在运行器下于 Avalonia 后端上测试。**它看起来能工作，然后会死锁或行为不一致，因为它的调度器绑定在线程上。Headless 正是为此而存在。

---

## 路线图
{:#roadmap}

- ✅ **Windows UI Automation 桥**——屏幕阅读器、放大镜以及现有的 UIA 工具（FlaUI、Appium/WinAppDriver），无需自定义协议。
- 补全 UIA 模式：`Value`/`Toggle` 写入支持、结构变更事件，以及 `TextBox` 逐次击键的值事件（从编辑器引发 `TextChanged`）。
- ✅ **浏览器无障碍 DOM**——在 `net10.0-browser` 上，同一棵树被镜像为带有实时区域的 ARIA 元素，所以屏幕阅读器、页内查找和 DOM 测试工具都能看到 UI（[详情]({{ '/zh/backends/' | relative_url }}#accessibility-dom-browser)）。尚未通过真实屏幕阅读器听过——是通过读取无头 Chrome 中的 DOM 验证的。
- 基于同一棵树的 **AT-SPI（Linux）** 和 **NSAccessibility（macOS）** 桥。
- ✅ **非控件项**：菜单项、工具栏按钮和 `ListBox` 项都在树中，拥有自己的边界，并且可点击。
- ✅ **自定义绘制的控件可以发布自己的值和额外状态**（`IAutomationStateProvider`）——见[上文](#custom-controls)。
- ✅ **UIA 中的实时区域与帮助文本**——`Label.LiveSetting` 引发 LiveRegionChanged；`QueryAccessibilityHelp` 提供 HelpText。
- 扩展角色和状态（选择、展开/折叠、值范围）——`ListBox` 项目前还不能自行报告它已被选中，这就是为什么由列表来承载这一信息；`IAutomationStateProvider` 自己的 `State` 字段也是为了让内置控件用于此目的，只是尚未为 `ListBox` 接通。
- 暴露剩余的绘制项：选项卡标题、`DataGridView` 单元格、树节点。
- 一个更高层的 `Majorsilence.Forms.Testing` 人体工学层——流式助手和黄金图像断言，让上面的[等待助手](#waits)和[黄金图像管道](#visual)不再需要由你自己维护。

---

## 下一步去哪里
{:#next}

- [培训指南，模块 8]({{ '/zh/training/' | relative_url }}#module-8)——这份材料的概览，置于更广的课程体系之中。
- [模块 10]({{ '/zh/training/' | relative_url }}#module-10-ci)——一个应用的完整 CI 门禁清单，包括迁移漂移。
- [平台后端]({{ '/zh/backends/' | relative_url }})——Headless 后端是什么，以及让一套测试套件覆盖所有目标的接缝（seam）。
