---
layout: docs
lang: zh
title: 培训指南
subtitle: 面向在 Majorsilence.Forms 上构建和交付应用的团队的结构化课程——每个示例都同时提供 C# 和 VB.NET 版本。2026 年 10 月针对 26.9.0 修订。
seo_title: "跨平台 WinForms 培训指南（C# 与 VB.NET）"
description: >-
  面向在跨平台技术栈上构建或迁移 WinForms 应用的团队的结构化课程——心智模型、迁移、七个后端、
  异步对话框、主题、测试、CI。C# 与 VB.NET。
keywords:
  - WinForms 培训
  - 跨平台 WinForms 教程
  - WinForms 迁移指南
  - VB.NET 跨平台界面
  - WinForms 团队课程
  - WinForms Linux macOS
  - Majorsilence.Forms 教程
permalink: /zh/training/
priority: "0.8"
---

这是一份交给即将在 Majorsilence.Forms 上构建——或迁移——**一个应用**的开发团队的指南。它假定你有
WinForms 经验，除此之外别无要求。

它刻意把范围限定在*使用*这个框架：引用包、编写窗体、把旧代码库迁移过来、选择目标平台、测试你所构建的
东西，然后交付。它**不是**贡献者指南——跟着它走，你完全不需要克隆或构建框架本身。（如果你最终确实想修
框架里的某个问题，[模块 10](#module-10-gaps) 会把你指向唯一要紧的那一段。）

**每个代码示例都同时以 C# 和 VB.NET 给出。**原版中的 C# 示例在发布前都在 macOS 上编译并运行过——全文
的截图就是那些运行的结果，不是示意图；而且下面你将读到的两条坦诚的注意事项正是通过运行它们发现的。
2026 年 10 月修订版新增的示例（主题、MVVM、异步对话框、较新的后端、动画帧、自定义自动化状态）是对照仓
库自身的文档和示例核对的，而不是为本指南实际运行过的，在要紧之处均有相应标注。VB 在这里是一等迁移目
标：迁移工具能处理 `.vbproj`/`.vb` 文件，重新注入经典 VB 编译器曾经自动提供的构造函数，并生成一个
`My.Resources` 访问器。三条 VB 特有的注意事项会在各自出现的地方指出——[`--dual-build` 仅支持
C#](#module-5-dualbuild)、[`My.*` 只实现了一部分](#module-5-checklist)，以及 [VB 没有可用于测试初始化的
模块初始化器](#module-8-headless)。

两种使用方式：

| 形式 | 做法 | 模块 |
|---|---|---|
| **两天工作坊** | 第 1 天：模块 0–4（模型、第一个应用、了解什么能用、绘图）。第 2 天：模块 5–10（迁移、目标平台、互操作、测试、原生内容、交付）。 | 全部 |
| **自定进度** | 模块 0–3 是必修核心——没学完它们的人不应开始任何迁移。然后，如果你在做迁移就学模块 5；如果你在从零构建就学模块 6 + 8。附录 D 和 E（主题、MVVM 辅助类）是可选阅读，留给负责外观和视图模型绑定的人。 | 自选 |

有两件事要先接受下来，因为它们决定了下面的每一个决策。Majorsilence.Forms 处于**测试版（beta）**：
API 正在趋于稳定，并非 WinForms 的每个角落都已覆盖——所以请锁定你的包版本。而且它是**"能编译、近似可
用"，而非像素级一致**：迁移后的代码被设计成能编译*并运行*，但有些成员刻意暂时什么也不做。模块 3 全部
都在讲如何分辨二者，它也是最值得慢慢读的一个模块。

---

## 目录
{:#contents}

- [Module 0 — 先跑起来](#module-0)
- [Module 1 — 心智模型：自绘控件 + 可替换宿主](#module-1)
- [Module 2 — 你的第一个应用](#module-2)
- [Module 3 — 在依赖之前先弄清什么能用](#module-3)
- [Module 4 — 绘图与自定义绘制](#module-4)
- [Module 5 — 迁移你的 WinForms 应用](#module-5)
- [Module 6 — 选择你的目标平台](#module-6)
- [Module 7 — 在 Windows 上增量采用](#module-7)
- [Module 8 — 测试你的应用](#module-8)
- [Module 9 — 原生内容与视频](#module-9)
- [Module 10 — 发布：CI、版本管理与保持更新](#module-10)
- [附录 A — 按症状排查问题](#appendix-a)
- [附录 B — 真实代码库的推广计划](#appendix-b)
- [附录 C — 速查卡](#appendix-c)
- [附录 D — 用 CSS 为你的应用设置主题](#appendix-d)
- [附录 E — MVVM 辅助方法](#appendix-e)

---

## Module 0 — 先跑起来
{:#module-0}

**目标：**每位开发者都在自己的操作系统上跑起一个自己的应用，并且知道去哪里查"这个框架能不能做 X"。

你只需要 [.NET 10 SDK](https://dotnet.microsoft.com/download)。不需要 Windows，不需要 Visual Studio，
不需要平台工作负载，也不需要框架源码。

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

这就是一个正在运行的跨平台应用。注意一下脚手架生成的结构，因为这正是应该保持的结构：一个**包含两个项目
的解决方案**——`MajorsilenceFormsApp.Shared` 是一个普通类库，存放 `MainForm` 及其设计器文件
（Designer.cs）；`MajorsilenceFormsApp` 则是运行在 Avalonia 后端上的一个轻薄桌面*头项目（head）*。你的窗
体放在共享库里；头项目只是一个入口点加一个后端。正因为如此，同一套 UI 之后能在手机或浏览器上运行——只需
再加一个头项目，而不必动窗体（[模块 6](#module-6)）：

```
dotnet new majorsilenceforms -n MyApp --IncludeAndroid --IncludeWasm --IncludeiOS
```

每个开关各添加一个头项目，并需要对应的工作负载（`android`、`wasm-tools`、`ios`——最后一个仅限 Mac）；
三者默认都关闭，所以不带参数的命令无需安装任何额外工作负载即可构建。`--msformsVersion` 和
`--avaloniaVersion` 用来锁定脚手架所引用的包版本。

接下来是参考资料。

**你的 API 文档就是控件库（ControlGallery）。**目前还没有独立的 API 参考，所以回答"`TreeView` 支不支持
X"最快的办法就是控件库——每个内置控件一个演示面板。最快捷的一瞥不花任何代价：[在线浏览器控件库]({{ '/gallery/' | relative_url }})
就是编译成 WebAssembly 的真实框架，无需安装。

![ControlGallery 示例在 macOS 上运行，选中了 Button 面板]({{ '/assets/img/gallery-macos.png' | relative_url }})

*`ControlGallery` 在 macOS 26 上运行，Avalonia 后端，选中了 `Button` 面板。注意哪些是框架的、哪些不是：
红绿灯式的标题栏是操作系统的，而它下面的每一个像素——导航树、它的滚动条、各种按钮变体——都是
Majorsilence.Forms 通过 Skia 绘制的。*

当你需要阅读控件背后的代码而不只是看一眼时，克隆仓库以获取它的
[`samples/`]({{ site.github_url }}/tree/main/samples) 文件夹，然后运行你想研究的那个：

```
git clone https://github.com/majorsilence/Majorsilence.Forms.git
dotnet run --project samples/Gallery.Avalonia   # 控件库，桌面后端
dotnet run --project samples/Explorer           # 一个 Windows 资源管理器克隆
dotnet run --project samples/Outlaw             # 一个 Outlook 克隆
```

> **用 `dotnet run --project …` 运行示例，或者从构建输出目录运行——不要从仓库根目录运行。**每个示例都通
> 过*相对*路径加载图标（`ImageLoader` 使用 `"Images"`），而相对路径是相对于**进程工作目录**解析的，不是
> 程序集所在位置。从别的地方启动已构建的可执行文件，每个图标文件都会找不到——而 `Bitmap(string)` 会退化
> 成一个 1×1 的占位图而不是抛出异常，于是应用干净地启动、什么也不记录，然后以所有图标都不可见的状态渲染。
>
> 值得刻意做一次，因为**你自己的应用也会继承这个行为**。在你的代码里，修复方法是相对于程序集位置解析
> 资源：
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
> 这是[静默空操作失败模式](#module-3-cost)的缩影；在一个你*知道*能正常工作的示例上遇到它，比在生产环境
> 里第一次遇到它要便宜得多。

**练习 0。**创建模板应用并运行，然后添加一个弹出 `MessageBox` 的 `Button`。接着打开在线控件库，找出你自
己的应用所依赖的三个控件。

---

## Module 1 — 心智模型：自绘控件 + 可替换宿主
{:#module-1}

**目标：**你能从第一性原理出发——而不是靠查资料——预测哪些 WinForms 习惯用法可以原封不动地沿用，
哪些行为会有所不同，哪些根本不可能工作。

只有一个架构事实，几乎其他一切都由它推导而来：

> **Majorsilence.Forms 用 SkiaSharp 完成自己全部的绘制。底下的窗口工具包只是一个宿主。**

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

七个后端，一套窗体。两个仅限 Windows 的后端只为一个目的而存在——让 WinForms 或 WPF 应用一次一个控件地
采用 Majorsilence.Forms（[模块 7](#module-7-c)）；而 Terminal 后端则证明了宿主确实可以互换：你的窗体
里没有任何东西知道自己是通过 GPU 交换链呈现的，还是通过一个 `▄` 字符呈现的。

每个控件都绘制到一个 Skia 画布上。底下的宿主负责创建原生窗口、运行消息循环、投递输入并呈现渲染好的表
面——它只做这些。核心包不引用任何窗口工具包；由你引用的后端来提供。对作为应用开发者的你来说，这道接缝
（seam）恰好有两个实际后果：**项目文件里的一行决定你的宿主**（[模块 6](#module-6)），以及**你的代码
里永远不会出现任何工具包类型**——你面向 `Form`、`Control`、`MouseButtons`、`Keys` 和 `System.Drawing`
值类型编程，与 WinForms 完全一样。

### 由此推出什么
{:#module-1-consequences}

这张表是本模块的收获。表里的每一项都是一个可以推理出来、而不必死记的行为差异。

| 因为绘制归框架、窗口归宿主…… | 所以…… |
|---|---|
| 每个顶层窗口对应一个原生操作系统窗口；窗口里的一切都是绘制出来的 | `Control.Handle` 是 `IntPtr.Zero`。`Button` 背后没有可供报告的操作系统对象。见[模块 9](#module-9)。 |
| `WindowBase.Handle` 仍得满足 WinForms 里"碰一下 `.Handle` 以强制创建"的习惯用法 | 它返回一个**不透明的非零令牌——不是 `HWND`**。绝不要把它交给原生代码。`WindowBase.PlatformHandle` 才是真货——在 Avalonia 后端上是真实的（`HWND`/`NSWindow`/`XID`），在 WinForms 后端上也是（真实 `HWND`）；其他后端上为零。 |
| 框架自己把画布缩放到显示器 | **你在 `Control` 上看到的一切都是逻辑单位**——`Width`/`Height`/`Bounds`、`MouseEventArgs`，以及（自 2026-10-01 起）`ClientRectangle`、`ClientSize` 和绘制画布也是。普通的 WinForms 布局与绘制代码在任何缩放下都是正确大小，无需改动。设备像素需要显式选用（`ScaledBounds`、`PaintEventArgs.Scaling`、`LogicalToDeviceUnits`）。唯一的例外：所有者绘制事件（`DrawItem`、`DrawNode`、`CellPainting`……）仍然交给你设备像素的边界和一个设备像素的 `Graphics`。见[模块 4](#module-4-paint)。 |
| 外观由框架解析，而不是由 Win32 | `BackColor`、`ForeColor` 和 `Font` 是**环境式（ambient）**的——见下面的示例。而且因为一切都由框架绘制，一份 CSS 样式表就能重新设计整个应用的样式（[附录 D](#appendix-d)）。 |
| 输入路由归框架 | **鼠标捕获在整个手势期间都属于获取它的那个控件**——在容器上开始的拖动，跨过放在容器上的按钮时不会中断。自己获取捕获的子控件仍然优先于其祖先。 |
| 这里的 `Form` 不是 `Control`——它派生自内部的 `WindowBase` | `Form` 上有常见的 `Control` 成员（`Anchor`、`Dock`、`TabIndex`、`Padding`/`Margin`、`Parent`、`MouseEnter`/`MouseLeave`），但 `Form` 仍然不能放进 `Control.ControlCollection`，也不会被以 `Control` 为类型的树遍历找到。 |
| 触控是一等输入，不是鼠标模拟 | `Control` 会引发 `LongPress`、`Pinch`、`Swipe` 和 `ScrollGesture`。**它们都不会因鼠标而触发。**`ScrollableControl` 已经把 `ScrollGesture` 应用到 `AutoScrollPosition`，所以你的 `Panel`/`ListBox`/`TreeView` 子类无需改一行代码就获得了触控平移。 |

**环境式外观，这是幸存下来的 WinForms 习惯用法。**`BackColor`、`ForeColor` 和 `Font` 各自先沿控件自己的
样式链查找，再沿父级链，再到宿主窗口，最后到主题。所以给容器着色一次、让子控件自动继承，完全如你所料地
工作：

**C#**

```csharp
var panel = new Panel {
    BackColor = Color.FromArgb (32, 32, 32),
    ForeColor = Color.White,                 // 子控件会继承这个……
    Dock = DockStyle.Fill
};

panel.Controls.Add (new Label  { Text = "Inherits white text", Left = 12, Top = 12 });
panel.Controls.Add (new Button { Text = "So does this",        Left = 12, Top = 40 });

// ……但输入表面会固定自己的背景，因为 WinForms 给它的是 SystemColors.Window。
panel.Controls.Add (new TextBox { Left = 12, Top = 80, Width = 200 });   // 保持浅色
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

' 输入表面会固定自己的背景，因为 WinForms 给它的是 SystemColors.Window。
panel.Controls.Add(New TextBox With {.Left = 12, .Top = 80, .Width = 200})   ' 保持浅色
Controls.Add(panel)
```

![环境式外观示例在 macOS 上运行]({{ '/assets/img/example-ambient.png' | relative_url }})

*正是这段代码在运行。`Label` 和 `Button` 的文字从面板继承了白色；`TextBox` 保留了自己的浅色背景。*

这种刻意的不对称——容器层层传递，`TextBox`/`ComboBox` 不传递——是最常见的"为什么我的深色主题只应用了
一半"问题，而它恰恰符合 WinForms 的行为。

这一切换来的可移植性是看得见的。同一个 `Explorer` 示例，三个操作系统，一套代码：

![Explorer 示例在 Windows 上]({{ '/assets/img/explorer-windows.png' | relative_url }})

*Windows——来自项目自己的文档。*

![Explorer 示例在 Ubuntu 上]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

*Ubuntu（AMD64）——来自项目自己的文档。*

![Explorer 示例在 macOS 上]({{ '/assets/img/explorer-macos.png' | relative_url }})

*macOS 26——用当前构建截取。*

**练习 1。**不要查资料，根据上表回答：如果你把 `myButton.Handle` 传给一个原生视频库，会发生什么？你应
该改做什么？然后在你自己的 WinForms 代码库里找一处在容器上设置 `BackColor` 并依赖子控件继承它的代码，
预测它是否仍然有效。

---

## Module 2 — 你的第一个应用
{:#module-2}

**目标：**你能用任一语言从零创建一个 Majorsilence.Forms 应用，并解释每一行的作用。

### 项目文件
{:#module-2-project}

从一个控制台应用开始，改三处。

**C# —— `MyApp.csproj`**

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

**VB.NET —— `MyApp.vbproj`**

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

注意 VB 版本里**没有**的东西：没有 `MyType`，没有 VB 应用程序框架。这是迁移工具无法掩盖的唯一一处结构
差异，也是 [`--dual-build` 不提供给 VB](#module-5-dualbuild) 的原因。

关于目标框架的一点说明，因为 `-windows` 后缀是迁移首先移除的东西：一个跨平台头项目只需要普通的
`net10.0`（或 `net8.0`）。核心包（`Majorsilence.Forms`、`Majorsilence.Forms.Drawing.Common`、
`Majorsilence.Forms.Telerik`）还提供 **`netstandard2.0`** 构建，这正是让经典 **.NET Framework 4.8**
应用能引用这些控件的原因——搭配 WinForms 或 WPF 后端的 `net48` 版本（[模块 7](#module-7-c)）。跨平台
后端仅支持 `net8.0` 及以上。

**两个包都要，而这正是培训时要大声说出来的部分。**核心包 `Majorsilence.Forms` 完全不引用任何窗口工具
包——只引用 SkiaSharp。它拥有控件和绘制；它无法把窗口放到屏幕上。`Majorsilence.Forms.Avalonia` 是能做
到这一点的后端，引用它才让应用在 Windows、macOS 和 Linux 上*可运行*。把第二行换成
`Majorsilence.Forms.Uno`、`.Gtk4`、`.Terminal`、`.WinForms`、`.Wpf` 或 `.Headless` 即可面向不同的宿
主——这一行（对非默认后端再加一行选择代码）就是全部的切换（[模块 6](#module-6)）。

### 最小的完整应用
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

这个应用无需任何额外配置就能在 Windows、macOS 和 Linux 上运行，因为只要引用了后端的包，后端就会被自动
解析。如果你想要*另一个*后端，请**在创建第一个窗口之前**赋值：

**C#**

```csharp
Majorsilence.Forms.Backends.Platform.Backend =
    new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Application.Run (new MainForm ());     // 必须放在后面
```

**VB.NET**

```vb
Majorsilence.Forms.Backends.Platform.Backend =
    New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Application.Run(New MainForm())        ' 必须放在后面
```

这个顺序约束是真实存在的，而且会咬人：构造一个窗体就会触及后端。这也是移动端和浏览器入口点
（[模块 6](#module-6)）接受一个*工厂*而不是一个实例的原因。

### 一个真正做点事情的窗体
{:#module-2-interactive}

用代码布局、一个事件处理程序、一个对话框和一个模态结果——每个界面都需要的四样东西。注意这些都是普通的
WinForms 肌肉记忆：`Anchor`、`Dock`、`DialogResult`、`MessageBox`。

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

![GreetForm 示例在 macOS 上运行]({{ '/assets/img/example-greet.png' | relative_url }})

*`GreetForm` 在运行。`TextBox` 因为其 `Top | Left | Right` 锚定而随窗口拉伸；两个按钮保持固定在右下角。*

在输入框为空时按 OK，就会走到校验路径：

![校验路径弹出的 MessageBox]({{ '/assets/img/example-messagebox.png' | relative_url }})

*`MessageBox.Show` 打开一个真正的模态窗口——它阻塞处理程序并禁用父窗体，正如它应该的那样。注意这个坦诚
的细节：`MessageBoxIcon.Warning` 被接受，但目前还没有绘制警告图标。这就是[存根策略](#module-3-stub-policy)
在起作用——调用能工作，一个视觉细节不工作，而且什么也不会抛出。*

从父窗体以模态方式显示它，与 WinForms 完全相同：

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

有两件事要注意，因为它们正是容易绊倒人的地方：每个交互控件上的 `Name` 不是装饰——它会成为测试定位符
*和*无障碍 id（[模块 8](#module-8)）；而 `Anchor` 在 VB 里用 `AnchorStyles.Top Or AnchorStyles.Left`，
C# 里用 `|`，这是最常见的 VB 移植笔误。

如果浏览器或手机头项目出现在你路线图的任何位置，那还有第三件事：上面阻塞式的 `ShowDialog` 和
`MessageBox.Show` 仅限桌面。在浏览器、Android 和 iOS 上，它们会在显示任何内容*之前*就抛出
`PlatformNotSupportedException`，而每个对话框都有一个可等待的孪生方法（`ShowDialogAsync`、
`MessageBox.ShowAsync`）。今天不用改任何东西——但在写第一百个处理程序之前请先读
[异步对话框规则](#module-6-async)，因为一个共享 UI 库从一开始就写成异步，远比日后再转换便宜得多。

### 真实应用长什么样
{:#module-2-real}

单个窗体不是培训目标。`PointOfSale` 示例是做业务（LOB）应用时应照抄的形态——四个项目，而不是一个：

| 项目 | 角色 |
|---|---|
| `PointOfSale.Client` | Majorsilence.Forms 桌面应用（窗体、面板、自定义控件、服务） |
| `PointOfSale.Api` | 带 JWT 认证和基于角色策略的 ASP.NET Core 最小 API |
| `PointOfSale.Contracts` | 两侧共享的 DTO |
| `PointOfSale.Data` | EF Core + SQLite 持久化与种子数据 |

UI 层不会对你的架构施加任何约束：它就是一个普通的 .NET 客户端，所以你现有的 DI、HTTP、日志和持久化选
择都可以原样沿用。

而 `Outlaw` 回答的是"它能撑得住复杂的多窗格应用吗？"：

![Outlaw 示例（一个 Outlook 克隆）在 macOS 上运行]({{ '/assets/img/outlaw-macos.png' | relative_url }})

*`Outlaw` 在 macOS 26 上——一个 Outlook 克隆，刻意不做成玩具演示：图标栏、文件夹树、虚拟化的邮件列表
和状态栏，全部由 Majorsilence.Forms 绘制。邮件行已选中；阅读窗格仍是占位符，因为示例从未把选中项接到
它上面——这是一个布局与控件密度练习，不是一个邮件客户端。*

**现在就为此做好规划：目前还没有可视化设计器。**设计器*代码*能迁移并运行——`*.Designer.cs`/
`*.Designer.vb` 模式原样保留，你的控件库所引用的设计时类型仍能编译——但运行时没有任何东西会实例化它
们，也没有可以编辑布局的设计界面。这是一个有书面计划的、想要实现的功能，而不是被搁置的功能。请为手工编
辑设计器文件、或像上面那样用代码布局预留预算。

**练习 2。**用你团队的语言构建 `GreetForm`。然后把后端包切换成 Headless，确认应用能在不打开窗口的情况下
启动并退出——你将在[模块 8](#module-8)里原样复用这套设置。

---

## Module 3 — 在依赖之前先弄清什么能用
{:#module-3}

**目标：**在依赖任何成员之前，你知道如何查明它是否真的能用——并且能一眼认出这个框架特有的失败模式。

这是本指南里最重要的模块。把
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) 从头到尾读一遍，
然后在工作时一直把它打开着。它正是为你这种处境而存在的：一个拥有 WinForms 代码库、正在决定该信任什么的
开发者。

### 存根策略
{:#module-3-stub-policy}

> **如果一个成员还没有可用的实现，它会安全地空操作（或返回一个合理的默认值），而不是抛出
> `NotImplementedException`。**

这是贯穿整个兼容层的、刻意且一致的策略，正是它让迁移后的代码即使在某个视觉功能还什么都不做的地方也能
编译*并运行*。具体来说：

- 没有后台行为的属性是一个普通的可设置自动属性——它存下你设置的值并能读回来，只是不改变运行时行为。
- 没有实现的方法返回一个中性值而不是抛出——例如一个 `ShowDialog()` 尚无真正 UI 的对话框会立即返回
  `DialogResult.OK`。
- 从不引发的事件仍然能编译、能订阅；它只是永远不会触发。这种情况用得很少，并在矩阵中按类型逐一标注。

**如果你碰到一个抛出异常而不是存根的成员，那是 bug——请报告它**（[模块 10](#module-10-gaps)）。

### 这一策略的代价——以及该怎么跟你的团队讲
{:#module-3-cost}

静默空操作是最难发现的一类缺口：它能编译、能运行，唯一的症状是下游某处输出不对。这个经典例子值得逐字
复述，因为它比任何规则都更能教会人这种失败模式：

`Image.MakeTransparent` 曾经是空的。移植过来的游戏代码把精灵图集的背景色设为透明，这个调用什么也没
做，于是每个精灵背后都画着一个白色方块。什么也没抛出。没有任何东西可以 grep。

对你来说有两个推论。第一，**当某个东西渲染或行为不对而又什么都没抛出时，先怀疑存根，再怀疑你自己的代
码**——查一下相关成员在矩阵里的那一行。第二，这类缺口现在有了防护：项目把已知的空方法体的公开 `void`
方法锁定在一个基线测试里（`NoOpStubBaseline.txt`——撰写本文时有 161 项），所以新的空方法不能被悄悄加
进来，而且这些条目会随着版本发布而减少。另外三个同类基线锁定了其他几种"空心"情形——已声明但惰性的事
件、从不引发的事件，以及只存值的属性（按矩阵目前的报告，分别为 1,254 个中的 79、127 和 812 个）。这就
是为什么矩阵值得作为参考资料来信任、而不是当作营销材料：这些数字是强制执行的，不是估计的。

### 锁定你所依赖的行为
{:#module-3-pin}

实际的防御手段是每个假设配一个测试。当某个功能很重要时，断言*效果*，而不是成员的存在——这就是能抓住存
根的测试与抓不住的测试之间的区别：

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

    // 断言结果，而不是方法存在——存根能通过"它能编译"式的测试。
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

        ' 断言结果，而不是方法存在。
        Assert.Equal(0, CInt(bitmap.GetPixel(0, 0).A))
    End Using
End Sub
```

为你关键路径上的每个成员写一个这样的测试。它只花几分钟，却能在要紧的那一天把一个静默空操作变成一次红色
构建。

### 要核查，不要假设——证据
{:#module-3-apidiff}

项目通过反射把自己的公开接口与真正的 `System.Windows.Forms` 引用程序集做差异比较，并把结果作为提交的
基线保存下来。这项审计的首次运行发现了 **1,905 个缺失条目**——其中包括 **126 个存在但数值错误的枚举成
员**。最后这一类最值得你放在心上：代码能编译、能运行，却悄悄地表示着另一个意思。这是"验证你的应用所倚
赖的特定成员，而不是假设对等"这一做法的最有力论据。

**两条 API 表面基线——WinForms 和 GDI+——现在都已归零。**上游声明的每个成员，这一层都声明了。请仔细
读这句话，因为这只是问题中较小的那一半：名称级别的差异比较无法回答一个成员的*行为*是否像 WinForms。一
次覆盖十二个领域的源码审计（2026-08-25）恰恰问了这个问题，发现了 **483 处行为不同**——其中 41 处严重
到足以让一个常见的迁移应用出问题。这份清单的大部分此后已分阶段落地（通过 `ProcessCmdKey` 的键盘预处
理、单一的焦点/校验关卡、真正的对话框、`AutoScaleMode.Font` 真正地缩放、带可用 `CurrencyManager` 的实
时数据绑定、`ListView.View = Details` 渲染为表格、与上游顺序一致的窗体生命周期事件、文本框 Ctrl+Z 撤
销……）；剩余部分在
[`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md) 中跟踪。
对你团队的教训不变：**"它能编译"意味着名字存在；矩阵里的那一行才告诉你它是否能用。**

### 阅读按控件划分的表格
{:#module-3-reading}

矩阵里的状态是从一个正在迁移的开发者的角度打分的：

| 状态 | 含义 |
|---|---|
| **Implemented（已实现）** | 主流接口都在。缺口仅限于深层/罕见的角落，或矩阵一次性说明的系统性模式。 |
| **Partial（部分）** | 点名列出缺失的、常用的特定成员。 |
| **Missing（缺失）** | 该类型在那个名字下根本不存在。 |

高频控件（`Button`、`TextBox`、`Panel`、`TabControl`、`TableLayoutPanel`、`TreeView`、`ListView`、菜
单、工具栏、状态栏、通用对话框……）都是功能上已实现的，不是存根。在规划工作之前值得了解的缺口：

| 类型 | 注意事项 |
|---|---|
| `DataGridView` | 单一类型中最大的缺口——但流量最高的钩子是**真实且会触发的**：`CellFormatting`、`CellPainting`、`RowPrePaint`/`RowPostPaint`、`CellParsing`、`RowValidating`/`RowValidated`、`GetClipboardContent()`，以及边框样式属性。仍然是已声明但从不引发的：`RowsAdded`/`RowsRemoved`、`DataError`、`SortCompare`、`CellValueNeeded`/`CellValuePushed`、`CellMouse*` 系列，以及细粒度的 `*Changed` 事件。自动调整大小只会触发失效重绘。 |
| `ListView` | 没有所有者绘制，没有虚拟模式的检索回调（`VirtualMode` 是一个普通属性），没有 `InsertionMark`。 |
| `TreeView` | 没有 `Sorted`，没有 `ImageKey`/`SelectedImageKey`（基于索引的 `ImageIndex` 可用），没有 `HitTest`，没有 `ShowNodeToolTips`。 |
| `ComboBox`/`ListBox`/`CheckedListBox` | `DataSource`/`DisplayMember`/`ValueMember` 存在；绑定的*格式化*钩子和 `Sort()` 不存在。 |
| `RichTextBox`、`MaskedTextBox` | 分别缺少：撤销/重做与 `SelectedRtf`；改写模式与按字符索引定位。 |
| `ToolStrip` 系列 | `MenuStrip`/`ContextMenuStrip`/`StatusStrip` 确实派生自 `ToolStrip`，所以整个接口都可以访问——但 `ToolStrip` 级别的成员是存根。给 `Renderer`/`RenderMode` 赋值**不会**改变绘制；`LayoutStyle` 不改变布局；没有溢出按钮。能用的就是每个控件原本就做得好的那些。 |
| `WebBrowser` | 导航可用；完全没有 DOM 对象模型（`Document`、`HtmlElement`……），因为它背后是一个真正的 webview，而不是 COM 自动化。 |
| 通用对话框 | 结果和 `ShowDialog()` 可用。仅限 Windows shell 的附加功能（`CustomPlaces`、`AutoUpgradeEnabled`、对话框钩子管道）不存在——这是意料之中的，没有可供挂钩的原生对话框。 |

**具体地说说如何使用网格。**既然 `DataGridView` 是大多数 LOB 应用的核心所在，下面是*受支持*的写法——
通过真正会触发的事件来做格式化和绘制，而不是通过那些不会触发的成员：

**C#**

```csharp
var grid = new DataGridView { Name = "ordersGrid", Dock = DockStyle.Fill };
grid.DataSource = orders;

// CellFormatting 是真实的：它在绘制期间按单元格触发。
grid.CellFormatting += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name != "Total")
        return;

    if (e.Value is decimal total) {
        e.Value = total.ToString ("C");
        e.CellStyle.ForeColor = total < 0 ? Color.Firebrick : Color.Black;
        e.FormattingApplied = true;          // 告诉网格不要再格式化一次
    }
};

// CellParsing 也是真实的：它在提交编辑时运行，你给出的类型化值就是被存储的值。
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

' CellFormatting 是真实的：它在绘制期间按单元格触发。
AddHandler grid.CellFormatting,
    Sub(sender As Object, e As DataGridViewCellFormattingEventArgs)
        If grid.Columns(e.ColumnIndex).Name <> "Total" Then Return

        If TypeOf e.Value Is Decimal Then
            Dim total = CDec(e.Value)
            e.Value = total.ToString("C")
            e.CellStyle.ForeColor = If(total < 0, Color.Firebrick, Color.Black)
            e.FormattingApplied = True        ' 告诉网格不要再格式化一次
        End If
    End Sub

' CellParsing 也是真实的：它在提交编辑时运行，你给出的类型化值就是被存储的值。
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

![DataGridView CellFormatting 示例在 macOS 上运行]({{ '/assets/img/example-grid.png' | relative_url }})

*这段代码针对一个普通的 `List<Order>` 运行：列由绑定类型自动生成，值格式化为货币，负数显示为红色，因为
处理程序的 `e.CellStyle.ForeColor` 确实传到了渲染器。*

> **如果你仍锁定在 26.0.30，有一个版本注意事项值得了解。**在那个包里，绑定单元格的值到达
> `CellFormatting` 时已经被转换成字符串，所以 `e.Value is decimal` 永远不会匹配，这个处理程序会静默地什
> 么也不做——正是本模块所讲的那种失败模式。它在随后的版本中已修复（绑定单元格保留成员的类型），所以上
> 面的代码在 26.9.0 这样的当前版本上是正确的。如果你在 26.0.30 上看到未格式化的值，请改为防御性解析：
> `decimal.TryParse (e.Value?.ToString (), out var total)`。这种写法在两种情况下都有效。

同一张表里，你目前*不能*依赖的有：`RowsAdded`、`DataError`、`SortCompare`、`CellValueNeeded`（所以没
有虚拟模式），以及 `CellMouse*` 系列。它们每一个都能编译，并且静默地永远不会触发——正是[上文](#module-3-cost)
的那种失败模式。

给来自供应商技术栈的团队两点说明。**Telerik UI for WinForms** 有一个一等的兼容层
（`Majorsilence.Forms.Telerik`），其自身源码直白地说明了约定：*覆盖是"能编译、近似可用"，而非像素级一
致*。而**拼写检查**（接入 `TextBox`）是一个无依赖、从零实现的功能，带波浪下划线和建议菜单——它根本不
是 WinForms API；它的存在是为了支撑 Telerik 的 `RadSpellChecker`。

**练习 3。**挑出你自己的应用所依赖的三个成员——一个你有把握的、一个你没把握的、一个冷门的。对每一个，
从矩阵判断它是已实现、存根还是不存在，然后为你最没把握的那个写一个[锁定测试](#module-3-pin)。

---

## Module 4 — 绘图与自定义绘制
{:#module-4}

**目标：**你知道哪些 `System.Drawing` 类型保持不变、哪些要搬家，以及如何同时编写 WinForms 风格和
Skia 原生的绘制代码。

`Majorsilence.Forms.Drawing` 是对仅限 Windows 的 `System.Drawing.Common`（GDI+）的一个基于 Skia 的跨
平台替代品。支配一切的划分如下：

| 来源 | 目标 | 原因 |
|---|---|---|
| `System.Drawing` **基元类型**——`Color`、`Point`、`PointF`、`Size`、`SizeF`、`Rectangle`、`RectangleF` | *不变* | 它们本来就随 `System.Drawing.Primitives` 在每个平台上提供。 |
| `System.Drawing` **GDI+ 类型**——`Bitmap`、`Font`、`Pen`、`Brush`、`Graphics` 相关 | `Majorsilence.Forms.Drawing` | GDI+ 在 `System.Drawing.Common` 里仅限 Windows；在 SkiaSharp 上重新实现。 |
| `System.Drawing.Drawing2D` / `.Imaging` / `.Text` | `Majorsilence.Forms.Drawing.Drawing2D` / `.Imaging` / `.Text` | 同样的划分，按子命名空间。 |
| `System.Drawing.Printing` | `Majorsilence.Forms.Printing` | 打印位于兼容层的 Forms 一侧，而不是绘图一侧。 |
| `System.Windows.Forms.VisualStyles`、`System.Drawing.Design`、`System.ComponentModel.Design` | *不动* | 没有对应物——标记为需人工审查，而不是改写成不存在的东西。 |

一个打包细节会绊倒那些想单独使用绘图层的人：值类型、图像、字体和资源在 `Majorsilence.Forms.Drawing.Common`
包里，但 **`Graphics` 本身随核心包 `Majorsilence.Forms` 一起提供**（仍在 `Majorsilence.Forms.Drawing`
命名空间下）。所以无头的图像处理也需要引用核心包——反正任何应用里你本来就有它。

三个会真正产生支持工单的具体问题：

1. **必须从你的项目中移除 `System.Drawing.Common`**，不仅因为从 .NET 7 起它仅限 Windows，还因为保留
   这个引用会让 `System.Drawing.Bitmap`/`Font`/`Pen` 与 Majorsilence 的替代品一起回到作用域内——此后每
   一处未限定的使用都会以*引用不明确*的错误失败，而不是解析到移植版本。
2. **`SystemColors` 和 `ColorTranslator` 是"不明确"问题中的例外。**它们位于 `System.Drawing.Primitives`
   里，所以仍能通过你为基元类型保留的 `using System.Drawing;` 解析到——不加限定地使用时，会与
   Majorsilence 的同名类型冲突（CS0104）。修复方法是一行别名，迁移工具会替你添加，且仅在需要的文件里：

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

3. **渐变和阴影画刷位于 GDI+ 放置它们的地方**：`LinearGradientBrush`、`PathGradientBrush`、`HatchBrush`
   和 `HatchStyle` 在 `Majorsilence.Forms.Drawing.Drawing2D` 里。`Brush`、`SolidBrush` 和 `TextureBrush`
   在 `Majorsilence.Forms.Drawing` 里——它们确实是 `System.Drawing` 类型。通过改写后的导入访问它们的代
   码不受影响；只有完全限定的引用需要更新。

### 离屏图像处理
{:#module-4-offscreen}

`Graphics.FromImage` 的工作方式和在 GDI+ 里一样，这意味着你现有的大多数图像处理代码只需改导入就能移
植：

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

![离屏图像处理示例生成的缩略图]({{ '/assets/img/example-thumbnail.png' | relative_url }})

*该方法的实际输出：一张 1080×752 的截图用双三次插值缩放到 320 px 宽，底部带半透明水印条。*

这段代码完全没有 UI 依赖——它可以在控制台应用、服务或测试里运行。

### 自定义绘制：两种方式，以及各自的适用场合
{:#module-4-paint}

`PaintEventArgs` 把**两个**表面都给了你。`e.Graphics` 是 GDI+ 形态的包装器，所以移植过来的 `OnPaint`
代码无需修改即可编译。`e.Canvas` 是框架自己用来绘制的原始 `SKCanvas`——当你想要 Skia 擅长而 GDI+ 从来
做不到的效果时，就用它。

**C# —— WinForms 风格，原样移植**

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

**VB.NET —— WinForms 风格，原样移植**

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

**C# —— Skia 原生，用于 GDI+ 无法表达的效果**

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

    // 带真正渐变着色器的圆角矩形——一次调用，GDI+ 没有对应物。
    e.Canvas.DrawRoundRect (new SKRect (0, 0, Width, Height), 12, 12, paint);
}
```

**VB.NET —— Skia 原生**

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
        ' 带真正渐变着色器的圆角矩形——一次调用，GDI+ 没有对应物。
        e.Canvas.DrawRoundRect(New SKRect(0, 0, Width, Height), 12, 12, paint)
    End Using
End Sub
```

![两种自定义绘制方式并排在 macOS 上运行]({{ '/assets/img/example-paint.png' | relative_url }})

*两个控件在同一个窗口里。左：GDI+ 形态的路径——纯色填充，2 px 白色边框。右：Skia 路径——圆角和真正的
渐变着色器，只用了一次 `DrawRoundRect` 调用。*

**给你团队的指导：**用 `e.Graphics` 迁移（它是免费的——代码已经存在），而为新的视觉效果有意识地选用
`e.Canvas`。在同一个处理程序里混用二者没有问题；它们绘制到同一个表面。

**画布是逻辑单位——不要自己去缩放它。**上面两个示例都是针对 `ClientRectangle`、`Width` 和 `Height` 绘
制的，在 HiDPI 桌面或手机上（Android 报告的缩放大约是 2.6–2.75）无需更多代码就是正确大小，因为框架在你
的 `OnPaint` 运行之前就已把画布缩放到显示器。在 2026-10-01 之前，画布是*设备*像素，自定义控件必须自己
调用 `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`。**如果你的控件里有这个调用，请删掉它**——它现
在会把绘制缩放两次，症状是控件在 2× 显示器上以两倍大小绘制，而在你的 1× 显示器上看起来正常。
`e.ClipRectangle` 和 `e.Canvas` 也是逻辑单位；`PaintEventArgs.Scaling` 仍然保留，用于你想精确落在某个
设备像素上的罕见情形（一条细线、一个像素画精灵）。你唯一仍会收到设备像素的地方是所有者绘制系列——
`DrawItem`、`DrawNode`、`CellPainting` 及其同类——它们的 `Bounds` 和 `Graphics` 彼此一致，但与控件的逻
辑 `ClientRectangle` 不一致。两类都请在 `MF_HEADLESS_SCALE=2` 下测试（[模块 8](#module-8-headless)）。

### 让控件动起来：`RequestAnimationFrame`
{:#module-4-animation}

16 ms 的 `Timer` 是 WinForms 做动画的方式，它仍然可用。框架还提供了浏览器的习惯用法，它在 Avalonia 上与
显示器对齐，并且——对你的测试来说要紧的部分——在 Headless 上完全确定。`control.RequestAnimationFrame (callback)`
在下一帧开始时回调**一次**，带一个只有作为差值才有意义的时间戳；要继续，就在回调里再次请求。（对照
`docs/animation.md` 核对过，未为本指南实际运行。）

**C#**

```csharp
private TimeSpan? start;
private float fade;                  // 0..1——由 OnPaint 读取

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
        RequestAnimationFrame (OnFrame);   // 在*下一*帧执行，绝不会在本帧
}
```

**VB.NET**

```vb
Private start As TimeSpan?
Private fade As Single               ' 0..1——由 OnPaint 读取

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
        RequestAnimationFrame(AddressOf OnFrame)   ' 在*下一*帧执行，绝不会在本帧
    End If
End Sub
```

在 Headless 后端上，在你步进时钟之前什么都不会运行，这把动画变成了一个精确的断言：
`HeadlessRenderer.AnimationClock.Reset ()`，请求你的帧，然后 `HeadlessRenderer.AnimationClock.Step (10)`
运行十帧、每帧 1/60 秒，你的回调就恰好看到了十个时间戳。`Majorsilence.Forms.Animation` 包在同一个帧请
求之上叠加了 `Tween<T>`、`Easing` 和 `control.Animate (…)`，而 `SystemInformation.PrefersReducedMotion`
会告诉你用户是否要求减少动画——它只是建议性的，所以在你*启动*动画的那一点做检查是你的责任。详情见
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)。

走 Skia 原生路线时有一个陷阱：**原始的 `SKFont`/`DrawText` 不做字体回退。**框架自己的文本渲染会通过回
退链解析缺失的字形，但裸的 `SKTypeface.Default` 不会——绘制一个包含该字体缺失字形的字符串（箭头、emoji、
CJK），你得到的是缺字方框，而且没有任何提示。面向用户的文本请坚持用 `e.Graphics.DrawString`，或者显式
选择你的字体。

在 Skia 确实无法跟上 GDI+ 的地方，矩阵会如实说明而不是假装：带自定义线帽的 `Pen` 用该线帽声明的
`BaseCap` 描边（`SKPaint` 只提供 butt/round/square），`Pen.Alignment` 被存储但不应用，而给 `Image.Palette`
赋值不会重新量化，因为现代 SkiaSharp 没有索引位图类型——每个表面都是 32bpp。

**练习 4。**把一段你自己的 GDI+ 代码——缩略图生成器、图表、水印——在一个没有 UI 的控制台应用里移植到
`Majorsilence.Forms.Drawing` 上。然后挑一个自定义绘制的控件，通过 `e.Canvas` 加一点 Skia 原生的点缀
（渐变、模糊、圆角裁剪）。

---

## Module 5 — 迁移你的 WinForms 应用
{:#module-5}

**目标：**你能在你的解决方案上运行 `majorsilence-migrate`，读懂它的报告，并逐项完成随后的手工修复清单。

### 安装
{:#module-5-install}

```
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help
```

更推荐按仓库安装（`dotnet new tool-manifest`，然后 `dotnet tool install Majorsilence.Forms.Migrator`，
以 `dotnet majorsilence-migrate` 运行），这样整个团队运行的是同一个版本。**工具包是唯一发布的形式**——
以前每次发布会附带每个平台的自包含单文件二进制，现在不再提供。它需要机器上有 .NET 运行时（它会前滚到你
拥有的任何更新的主版本）；如果你宁愿什么也不安装，可以从克隆里用
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>` 运行。

### 迁移在你的源码里是什么样子
{:#module-5-beforeafter}

在做其他任何事之前，先看看改动的规模。这是一个典型窗体的开头，迁移前后对比：

**C# —— 之前**

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

**C# —— 之后**

```csharp
using System;
using System.Drawing;                                        // 保留：Color、Point、Size、Rectangle
using Majorsilence.Forms;                                    // 原为 System.Windows.Forms
using Majorsilence.Forms.Drawing;                            // 为了 Bitmap
using SystemColors = Majorsilence.Forms.SystemColors;         // 新增：解决 CS0104

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();                          // 你的设计器文件原封未动
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**VB.NET —— 之前**

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

**VB.NET —— 之后**

```vb
Imports System.Drawing                                        ' 保留：Color、Point、Size、Rectangle
Imports Majorsilence.Forms                                    ' 原为 System.Windows.Forms
Imports Majorsilence.Forms.Drawing                            ' 为了 Bitmap
Imports SystemColors = Majorsilence.Forms.SystemColors         ' 新增：解决歧义

Public Class CustomerForm
    Inherits Form

    ' 迁移工具还会重新注入 MyType=Empty 曾经自动提供的隐式无参构造函数，
    ' 它了解这个窗体的 Designer 分部类，所以不会重复生成。
    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

这就是它的全部形态：导入改变，`Handles` 子句和设计器代码保留，你的业务逻辑不被触碰。

### 在跟工具争论之前先弄清它是什么
{:#module-5-design}

`majorsilence-migrate` 是一个刻意设计的多遍**文本/正则重写器**。它不解析语法树，也不解析符号，而这正是
重点：

- **它能在坏掉的代码上工作。**迁移了一半的解决方案、引用了未移植类型的 `.vb`、缺少引用的项目——这些都
  拦不住重写器，因为它从不需要代码能编译甚至能解析。一个 Roslyn 工具在项目能构建之前会拒绝触碰它，这
  违背了对遗留代码库做*第一遍*处理的目的。
- **它很快**——几秒钟处理数千个文件。
- **它放弃的东西：**真正的跨项目符号解析。它无法分辨一个裸的 `Panel` 是 `System.Windows.Forms.Panel`
  还是你自己名为 `Panel` 的类；它依赖命名空间前缀模式和导入上下文。每一个它不认识的命名空间都会**被
  标记为需人工审查，而不是悄悄猜测**。

针对这个盲点*确实*有一个可选的第二引擎——`--engine roslyn`，叠加在文本引擎之上，使用真正的符号解析：

| | `--engine text`（默认） | `--engine roslyn` |
|---|---|---|
| 输入 | 任何 `.sln`/`.csproj`/`.vbproj`/目录/单个文件 | 需要一个**可加载**的项目；裸目录或单个文件会让整次运行回退到文本引擎，并给出警告 |
| 容忍无法编译的代码 | 是 | 否 |
| 速度 | 几秒 | 慢几个数量级（MSBuild 求值占主导） |
| 同名类型消歧 | 否 | **是——这正是它存在的理由** |
| 失败处理 | 不适用 | *按项目*安全失败（该项目的文件回退到文本引擎）。如果完全找不到 MSBuild，整次运行硬性失败，而不是悄悄降级 |

**团队规则：**对大型遗留代码库的第一遍处理总是使用默认的 `--engine text`。之后，在已经可加载的结果上，
只有当你有一个*已确认*的自定义类型与 WinForms/GDI+ 类型同名的案例时，才去用 `--engine roslyn`。注意它
在一个地方产生的警告也*更少*——它会直接修复裸 `using System.Drawing;` 下未限定的 GDI+ 类型，而不是标记
它们。这种差异不是退化。

### 推荐的首次运行
{:#module-5-firstrun}

```
# 在一个干净的 git 分支上，先空跑一遍以了解范围：
majorsilence-migrate MySolution.sln --dry-run --diff

# 然后真正运行——相对上一次提交的差异就是迁移本身：
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

在 git 跟踪的分支上就地运行（带 `--no-backup`，因为 git *就是*你的备份）使迁移幂等且可比对差异：运行
它，逐文件检查，日后引入更多遗留代码时可以安全地重新运行。

第一天就值得了解的选项：

| 选项 | 用途 |
|---|---|
| `-o, --output <dir>` | 写入一个镜像目录树，而不是就地转换 |
| `-n, --dry-run`、`--diff` | 在下决心之前先了解范围 |
| `--backend <name>` | `avalonia`（默认）\| `uno` \| `headless`——引用哪个后端包 |
| `--tfm <tfm>` | 强制指定 TFM。默认：保留版本，去掉 `-windows` 后缀 |
| `--package-version <v>` | 默认为迁移工具自身的版本——工具和包来自同一次发布 |
| `--map <file>` | 为没有内置支持的供应商提供额外的命名空间映射（可重复） |
| `--dual-build` | 让 C# 项目同时也能针对真正的 WinForms 构建——见下文 |
| `--strict` | 遇到任何人工审查警告即以非零退出。**这是你的 CI 门禁。** |
| `--report <file>` / `--no-report` | Markdown 报告 |

对于没有内置映射的供应商，`--map` 文件只是 JSON：

```json
{
  "namespaces":     { "DevExpress.XtraEditors": "Majorsilence.Forms.DevExpress" },
  "removePackages": [ "DevExpress.Win.*" ]
}
```

### 它实际改变了什么
{:#module-5-changes}

1. **项目文件**——移除 `UseWindowsForms`/`UseWPF`，去掉 `-windows` TFM 后缀（包括导入的
   `.props`/`.targets` 里的），去掉 Windows 桌面框架引用，移除仅限 WinForms 的 NuGet 包（Telerik、
   DevExpress、**`System.Drawing.Common`**），并添加 `Majorsilence.Forms` + 一个后端引用——**对它触碰的
   每个项目都如此**。这个集合比"WinForms 项目"更宽：一个从未提到 `System.Windows.Forms` 的普通类库，
   只要有图像或字体辅助代码，也会被重写，因为没有这个引用它无法编译。只使用那些保留下来的基元类型的
   项目则完全不动。
2. **源文件**——通过最长前缀优先的表进行命名空间重写，合并重复导入，在需要处生成
   `SystemColors`/`ColorTranslator` 别名；对 VB：重新注入隐式构造函数，生成 `My.Resources` 访问器，并对
   其余的 `My.*` 用法给出警告。
3. **Resx 文件**——扫描在切换中必须保留的图像/类型引用。
4. **报告**——一份 Markdown 摘要（默认 `migration-report.md`）。

### 阅读报告
{:#module-5-report}

三个部分要紧：

- **已扫描与已更改**的计数——一眼看出差异的范围。
- **按文件的更改列表**——实际触碰到的一切。
- **人工审查**——按原因分组的每一条警告：不支持的命名空间、裸 `System.Drawing` 导入下未限定的 GDI+ 类
  型、`My.*` 用法，以及任何被直接跳过的项目。最常见的跳过是**遗留的非 SDK 风格 `.csproj`/`.vbproj`**，
  你必须先把它转换为 SDK 风格——这是项目格式的前提条件，不是迁移工具遗漏了什么。

### 用 `--dual-build` 做增量迁移（仅 C#）
{:#module-5-dualbuild}

默认情况下，工具会把项目彻底转换。`--dual-build` 则让一个 C# 项目能针对**任一**技术栈构建，由一个
MSBuild 属性切换——这样你的 Windows 开发者可以继续针对真正的 WinForms 构建，直到他们满意为止。项目文件
在其他方面保持不变，只有文件顶部的导入变成条件式：

```csharp
#if MAJORSILENCE_FORMS
using Majorsilence.Forms;
#else
using System.Windows.Forms;
#endif
```

用仓库根目录的 `Directory.Build.props` 切换构建：

```xml
<Project>
  <PropertyGroup>
    <MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>
  </PropertyGroup>
</Project>
```

两个注意事项。它**刻意很窄**：文件主体中任何*完全限定*的引用（`System.Windows.Forms.MessageBox.Show(...)`）
仍然会被无条件重写，只有在该符号有定义时才能编译。

而且**没有 VB 等价物**，这也是本节没有 VB 示例的原因。`MyType=Empty` 会关闭整个 VB "My" 应用程序框
架——隐式构造函数、`My.*`、一切——没有任何预处理符号能切换它。传入 `--dual-build` 的 VB 项目会改以普通
的彻底转换方式处理，并附带一条解释原因的警告。**对 VB 团队，请规划一次切换，而不是一段双构建期**，并
保留迁移前的分支，直到转换后的分支值得信任为止。

### 手工修复清单
{:#module-5-checklist}

重写器看不到这些。差异落地之后请明确地逐项处理——它们是"它编译了"和"它行为正确"之间的差别。

| # | 变更 | 该做什么 |
|---|---|---|
| 1 | **`SplitContainer.Orientation` 改变了含义**——它现在是分隔*条*的方向，与 WinForms 一致，而不是布局的方向。`Vertical`（默认）= 面板左右并排。 | 如果你从未设置过它，什么都不会变。**如果你设置过，就把它反过来。**没有任何东西会提醒你：两个值在之前和之后都能编译，而迁移工具在文本遍历中无法区分 `SplitContainer.Orientation` 和其他任何 `Orientation`。用 grep 找。`Splitter` 同理。 |
| 2 | **事件委托类型现在与 WinForms 一致。**`KeyDown`/`KeyUp` → `KeyEventHandler`；`Mouse*` 系列 → `MouseEventHandler`；`Form.FormClosing` → `FormClosingEventHandler`；`PrintDocument.PrintPage` → `PrintPageEventHandler`；`Control.MouseEnter` 和菜单/工具条项的 `Click` → 普通 `EventHandler`。 | Lambda、`AddressOf` 处理程序和 VB 的 `Handles` 子句继续有效。C# 中**显式构造**的 `new KeyEventHandler<…>` 式包装器（`new EventHandler<KeyEventArgs>(…)`）不再能转换——去掉包装器，或者写出 WinForms 的委托名。 |
| 3 | **`Click` 和 `MouseEnter` 不再携带鼠标坐标**——因为在 WinForms 里它们从来就不携带。 | 从 `Click` 读取 `e.X`/`e.Button` 的处理程序改用 `MouseClick`。在菜单项上（WinForms 里同样没有鼠标类型的变体），从所属控件取位置。在 C# 中，重写旧的 `OnMouseEnter(MouseEventArgs)` 会以 CS0115 失败；在 VB 中对应的 `Overrides` 会因新签名而无法编译——两者都很响亮，这正是你想要的。 |
| 4 | **`TreeViewDrawMode.OwnerDrawContent` 已重命名**为 WinForms 的 `OwnerDrawText`，并且 `OwnerDrawAll` 现在存在了。 | 什么都不会坏——旧名字是一个值相同的 `[Obsolete]` 别名——但它会被移除。现在就重命名。`OwnerDrawText` 在背景/焦点绘制之后引发 `DrawNode`；`OwnerDrawAll` 在任何东西绘制之前引发它。 |
| 5 | **两个 `DataGridViewDataErrorContexts` 成员被移除了**（`RowDirtyStateNeeded`、`CleanupExceptionHandling`）——二者都不是 WinForms 成员。 | 替换为现在位于那些值上的真正成员：`RowDeletion`、`ClipboardContent`。 |
| 6 | **强类型资源设计器。**生成的 `Resources.Designer.cs`/`.vb` 会把 `ResourceManager.GetObject(...)` 强制转换为某个绘图类型；而真正的 `System.Resources.ResourceManager` 返回的是编译后 `.resources` 里所记录的类型，所以这个转换在运行时首次读取资源时抛出 `InvalidCastException`，尽管编译时一切正常。 | 迁移工具替你处理了这一点，以生成器自身的 `GeneratedCodeAttribute` 为门槛：仅在这些文件里，`ResourceManager` 变为 `Majorsilence.Forms.ComponentResourceManager`，它读取同样的 `.resources`，但会规范化图形条目。手写的字符串查找保留 BCL 类型。**尽早验证你资源密集的窗体。** |
| 7 | **VB 的 `My.*` 只实现了一部分，依据是证据而不是 API。**对一个大型真实 VB 代码库的可行性审计发现，手写代码只触及三处，所以恰好这三处是真实的：`My.Application.Info.*`（`Title`、作为真正 `Version` 的 `Version`、`Copyright`、`CompanyName`……）、`My.Resources.*`（一个生成的访问器模块）和 `My.Computer.Name`。 | 其他一切仍然只是警告而不被悄悄重写：`My.Forms`、`My.Settings`、`My.User`、`My.Application.Log`/`Startup`/`Shutdown`/`UnhandledException`、启动画面、`My.Computer.Registry`/`Clipboard`/`Info`——审计在生成的 `Settings.Designer.vb` 样板之外没有发现任何一处手写用法，而且其中几项没有可移植的等价物。见下面的移植模式，以及 MIGRATION.md 的"Still not implemented, and why"。另请注意：以 `ResXFileRef`（链接文件而非内联数据）形式存储的 resx 条目能编译，但在运行时解析为 `null`。 |
| 8 | **没有兼容目标的 Telerik 子命名空间**——`Telerik.WinControls.Themes`、`.Design`、`.Primitives`、`.Layouts`——采取警告并保留原样。 | 按用法逐一决定：放弃主题，或者重新实现。另外：`RadScheduler` 的月/周/日**日历网格 UI** 被刻意排除在范围之外（数据层、导航和日程视图是真实的），所以使用网格的代码需要针对日程视图重写。 |

**移植 VB 的 `My.*` 接口。**已实现的三处无需任何工作：

```vb
' 这些在迁移后继续有效：
Dim title = My.Application.Info.Title
Dim ver As Version = My.Application.Info.Version      ' 真正的 Version，不是 String
logo.Image = My.Resources.CompanyLogo                 ' 生成的访问器模块
Dim machine = My.Computer.Name
```

`My.Forms` 是大多数代码库会碰到的那一个。把隐式单例换成显式实例：

```vb
' 之前——My.Forms 为每个窗体类型提供一个延迟创建的单例：
My.Forms.CustomerForm.Show()

' 之后——自己持有实例（或从你的 DI 容器解析它）：
Private customerForm As CustomerForm

Private Sub ShowCustomers()
    If customerForm Is Nothing OrElse customerForm.IsDisposed Then
        customerForm = New CustomerForm()
    End If
    customerForm.Show()
End Sub
```

而 `My.Settings` 变成你在 .NET 其他地方已经在用的任何配置方式——`Microsoft.Extensions.Configuration`、
一个 JSON 文件，或你自己的设置类：

```vb
' 之前：  Dim url = My.Settings.ApiBaseUrl
' 之后：
Dim url = AppSettings.Current.ApiBaseUrl
```

### 当你根本不能重写导入时
{:#module-5-compat}

有一种情况是迁移工具无能为力的：一个**公开 API 以 `System.Windows.Forms` 为类型的、对外分发的控件
库**——它的使用者传给它的是真正的 WinForms 类型，所以重写它的 `using` 会破坏这些使用者。针对这种情况，
有一个概念验证的源生成器
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/tree/main/src/Majorsilence.Forms.WinFormsShims.Compat)，
它生成*由* Majorsilence.Forms *支撑的* `System.Windows.Forms` 和 `System.Drawing` 命名空间，使得
**未经修改**的 WinForms 源码——包括设计器文件——无需任何真正的 WinForms 程序集参与即可针对本框架编译。
[`WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo) 示例展示了它的工作情
况，其 `RESULTS.md` 记录了哪些成功、哪些没有。把它当作一个有待评估的实验，而不是一个可以依赖的计划；迁
移工具才是正式发布的路径。

**破坏性变更在哪里。**上面清单里的每一项都来自 [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)
的"Breaking change"和"Renamed to match WinForms"小节，新的变更也会最先出现在那里。每次升级都要读这些小
节，而不只是在第一次迁移时——这个习惯正是[模块 10](#module-10-versioning) 要讲的。

**练习 5。**在一个真实的内部应用上运行迁移工具——最好是本季度没人依赖的那个——先用 `--dry-run --diff`。
然后在一个分支上真正运行它，让它能构建，并逐项完成上面的清单。把时间限定在一天之内；目标是对你其余产
品组合的一个经过校准的估算，而不是一个完成的移植。

---

## Module 6 — 选择你的目标平台
{:#module-6}

**目标：** 你能为每个目标平台选对后端包，并且清楚每个平台上哪些能力确实不可用，而不是到后期才发现。

你的目标平台集合就是一个包选择：

| 引用这个包 | 目标平台 | 说明 |
|---|---|---|
| `Majorsilence.Forms.Avalonia` | **默认。** Windows/macOS/Linux 桌面——另外通过 Avalonia 自己的平台包支持浏览器/WASM（始终构建）、Android 和 iOS（可选，需要工作负载） | 引用后自动解析。这个跨平台后端的窗口宿主*就是*一个真正的原生窗口，因此它能交出真正的平台句柄，并为宿主应用提供操作系统级的模态语义。WebView 通过 WebView2/WKWebView/WebKitGTK 实现 |
| `Majorsilence.Forms.Uno` | 桌面，以及通过 Uno 技术栈支持 iOS/Android/WebAssembly | 通过 `SKXamlCanvas` 呈现；需要一个 Uno 应用头（app head）。没有 owner 概念——用 `Form.ShowDialog(parent)` 实现模态 |
| `Majorsilence.Forms.Gtk4` | Linux 优先——每个窗体对应一个真正的 `Gtk.Window`；安装了 GTK 4 运行时的 Windows/macOS 也可以 | 需显式选择。支持两个方向的嵌入，`NativeControlHost` **没有空域（airspace）问题**，`WebBrowser` 通过 WebKitGTK 6.0 实现。已知限制：无法控制屏幕位置（GTK 4 移除了该能力，所以 `Location` 只是提示）、`SetIcon(byte[])` 为空操作、文件选择器回退到框架自己的对话框、只支持整数缩放因子 |
| `Majorsilence.Forms.Terminal` | 控制台——窗体填满终端，没有标题栏，像手机一样 | 终端支持时以真实像素分辨率使用 Kitty 图形协议或 Sixel，否则使用 Unicode 方块字形；支持鼠标和键盘；Ctrl+C 始终退出。已在 xterm 和 WezTerm 上验证。没有原生选择器、`NativeControlHost` 或 webview |
| `Majorsilence.Forms.WinForms` | **仅 Windows**——Win32 消息泵上的真正 `System.Windows.Forms` 窗口 | 一个*迁移*后端（[模块 7](#module-7-c)）：把 Majorsilence 控件一次一个地嵌入 WinForms 应用。也面向 `net48`。真正的 `HWND`。没有手势，没有 webview |
| `Majorsilence.Forms.Wpf` | **仅 Windows**——`Dispatcher` 循环上的真正 WPF `Window` | 与 WinForms 后端形态和用途相同：`ToWpfElement()`、`ToWpfWindow()`。`net48`、`net8.0-windows`、`net10.0-windows` |
| `Majorsilence.Forms.Headless` | 测试、CI、服务器、像素比对 | 不需要显示器。这是你的测试方案（[模块 8](#module-8)）。手动动画时钟 |

Avalonia 是唯一会自行安装的后端。其他后端都只需一行代码，放在构造第一个窗体之前（也就是[模块 2](#module-2-code)中提到的顺序约束）：

**C#**

```csharp
// GTK 4——有一个辅助方法
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();

// Terminal——同样
Majorsilence.Forms.Terminal.TerminalApplication.Use ();

// WinForms、WPF、Headless——直接赋值后端
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.WinForms.WinFormsPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Majorsilence.Forms.Application.Run (new MainForm ());   // 放在你选的那一行之后
```

**VB.NET**

```vb
' GTK 4——有一个辅助方法
Majorsilence.Forms.Gtk4.Gtk4Application.Use()

' Terminal——同样
Majorsilence.Forms.Terminal.TerminalApplication.Use()

' WinForms、WPF、Headless——直接赋值后端
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.WinForms.WinFormsPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Wpf.WpfPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Majorsilence.Forms.Application.Run(New MainForm())      ' 放在你选的那一行之后
```

（当然只选一个——上面的代码块把这一行的所有写法都列出来了。）GTK 4 后端还需要机器上装有原生库：Debian/Ubuntu 上是 `libgtk-4-1`，Fedora/Arch 上是 `gtk4`，macOS 上是 `brew install
gtk4`，如果你用 `WebBrowser` 还需要 WebKitGTK 6.0。

Avalonia 上的桌面是成熟路径。下面的内容全都关于较新的目标平台，以及每一个的真实现状。

### 单视图平台：浏览器、Android、iOS
{:#module-6-singleview}

这三个平台都没有操作系统窗口管理器——每个应用/标签页/屏幕只提供恰好一个可嵌入的视图。它们共用一个宿主，其中**每个**窗口都是一块画布：第一个非弹出窗口填满视口；其余的一切——ComboBox 下拉列表、菜单、额外的顶层窗体——都是它的绝对定位子元素。

启动由宿主驱动，所以每个平台都有自己的入口点，接受一个**工厂**（在后端初始化完成之前窗体不能存在），而且它们都不阻塞：

**C#**

```csharp
// 浏览器（WASM）——浏览器头的 Program.cs
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());

// Android——在 Activity 的 OnCreate 中
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());

// iOS——在 FinishedLaunching 中
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());
```

**VB.NET**

```vb
' 浏览器（WASM）。VB 没有 async 入口点，而 RunBrowserAsync 不会阻塞——
' 标签页自己的事件循环驱动 UI——所以启动它然后返回即可。
Module Program
    Sub Main()
        Dim starting = Majorsilence.Forms.Application.RunBrowserAsync(Function() New MainForm())
    End Sub
End Module

' Android——在 Activity 的 OnCreate 中
Majorsilence.Forms.Application.RunAndroid(Function() New MainForm())

' iOS——在 FinishedLaunching 中
Majorsilence.Forms.Application.RunIOS(Function() New MainForm())
```

注意参数的形态：是一个**工厂**（`Function() New MainForm()`），而不是实例。直接传入 `New MainForm()` 会在后端存在之前就构造窗体。

**在这些平台上不可用的东西**——这是没有窗口管理器的固有结果，不是待办工作：

- **没有窗口外观（chrome）。** `Title`、`Topmost`、`SetSystemDecorations`、`SetIcon`、最小/最大尺寸、`CanResize`、`ShowInTaskbar` 和 `WindowState` 都是空操作；`WindowState` 读取时始终为 `Normal`。
- **对话框不是操作系统级模态**，因为没有模态窗口的概念——对话框是主视图的子元素，带有禁用父级等语义。而且**阻塞式调用完全不可用**：见下一节。
- **没有 WebView**，所以需要 WebView 的兼容控件（`RadPdfViewer`、`RadRichTextEditor`）会回退到它们的纯查看器/`RichTextBox` 路径。
- **通过窗口失活触发的点击外部关闭弹出层不会触发。** 在应用*内部*点击别处仍会关闭弹出层；只有焦点完全丢给应用之外的东西这种情况没有处理。

### 异步对话框规则
{:#module-6-async}

这是本模块中唯一会改变你*写代码方式*的规则，所以单独成节。在浏览器中，.NET 运行在页面唯一的 JavaScript 线程上，一个不返回的调用会停掉本该让它返回的输入、计时器和绘制。在 Android 和 iOS 上，Avalonia 的调度器无法推入嵌套帧。因此在这三个平台上，Avalonia 后端报告 `CanRunModalLoop = false`，而每一个阻塞式模态调用——`Form.ShowDialog`、`MessageBox.Show`、文件选择器的 `ShowDialog`、`TaskDialog.ShowDialog`、`VbInteraction.MsgBox`/`InputBox`、`RadMessageBox.Show`——都会抛出 `PlatformNotSupportedException`，**在显示任何内容之前就指出它的异步孪生方法**。（在 Android 15 模拟器和 iPhone 17 Pro 模拟器上实测；记录在 `docs/backends.md` 中。）

异步形式在每个后端上都可用，桌面也包括在内，所以共享 UI 库只需写一次：

**C#**

```csharp
// 之前——仅限桌面
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

// 之后——到处都能运行。async void 处理程序是惯用写法；结果仍然是 DialogResult。
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
' 之前——仅限桌面
Private Sub OkButton_Click(sender As Object, e As EventArgs)
    If String.IsNullOrWhiteSpace(nameBox.Text) Then
        MessageBox.Show("Please enter a name.", "Greeter")
        Return
    End If
    Using confirm As New ConfirmForm()
        If confirm.ShowDialog(Me) = DialogResult.OK Then Save()
    End Using
End Sub

' 之后——到处都能运行。Async Sub ... Await 是 VB 的事件处理程序惯用写法。
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

同一条规则也覆盖其他所有阻塞 UI 线程的东西——`.Result`、`.Wait()`、`GetAwaiter().GetResult()` 和 `Thread.Sleep`——所以改为 `await` 任务、用 `await Task.Delay (n)` 代替。

**你不必手工去找这些调用。** 核心包 `Majorsilence.Forms` 自带一个 Roslyn 分析器——`MFB001`（阻塞式模态调用，并指出其可等待的孪生方法）、`MFB002`（对任务的同步等待）和 `MFB003`（`Thread.Sleep`）——附带代码修复，在不改变程序结构的前提下把处理程序改写为 await 形式（在 `async` 方法内，或在 `void` 事件处理程序内，后者会被标记为 `async`）。它在仅限桌面的代码中保持沉默，对 `net*-browser` 目标则会启用。要覆盖一个被浏览器头引用的**共享 UI 库**，在该库旁边手动开启：

```ini
# .editorconfig（或 .globalconfig），放在共享 UI 项目旁边
[*.cs]
majorsilence_forms.browser_target = true
```

任何路线图上有浏览器或手机头的项目，都应在第一天就开启这个选项；这比以后再转换处理程序便宜得多。一个诚实的限制：分析器目前只针对浏览器，所以一个只从 Android 或 iOS 代码触达的阻塞调用在构建时不会被标记——它会在运行时失败，并给出上面的消息。（分析器及其诊断是仅限 C# 的 Roslyn 规则；VB 项目会得到运行时异常，但没有构建时警告。）

### 手机行上确实可用的东西
{:#module-6-mobile}

Avalonia 的 Android 和 iOS 行已经补上了手机应用不可或缺的那些能力，而且从窗体的角度看全是自动的：

- **屏幕键盘**在 `TextBox` 获得焦点时弹出、失焦时收起；键盘打开时输入框会被滚动到键盘上方。`TextBoxBase.InputKind`（`Number`、`Email`、`Url`、`Phone`）决定键盘布局——请在输入框获得焦点之前设置它，因为它是在那时读取的。桌面会忽略它。
- **安全区内边距**（状态栏、刘海、Home 指示条）通过 `Form.SafeAreaPadding` 应用到窗体的客户区布局，因此停靠和锚定的控件无需代码就能避开这些区域。
- **Android 返回键**会触发 `WindowBase.BackRequested`（一个可取消的事件——打开的弹出层或底部面板会先收到它）。模板生成的 `MainActivity` 已经做了转发。
- **`Form.SizeClass`**（低于 600 逻辑像素为 `Compact`，`Medium`，840 起为 `Expanded`）和 `SizeClassChanged` 让同一个窗体能在手机布局和平板布局之间切换。
- `Application.Suspended`/`Resumed`、触觉反馈、保持屏幕常亮、进程内音频。

还有四个为手机形态屏幕打造的控件，全部在核心包里，桌面上同样可用：**`StackPanel`**（Majorsilence 的扩展——把每个子控件拉伸到列宽，并在宽窗口上把列宽限制在可读范围内）、**`Card`**（圆角、带边框、按主题着色的 `Panel`）、**`RichListBox`**（行是模板化多行项的 `ListBox`）以及 **`NavigationHost`**（带标题栏和返回按钮的页面栈，遵守 `BackRequested`）。一个按 `docs/mobile-layout.md` 推荐形态写的设置页面（对照该文档核对过，本指南未实际运行）：

**C#**

```csharp
var column = new StackPanel {
    Dock = DockStyle.Fill, AutoScroll = true,
    MaximumContentWidth = 560, Spacing = 8, Padding = new Padding (8)
};
column.Controls.Add (new Label { Text = "Server address", AutoSize = true });      // 按列宽换行
column.Controls.Add (new TextBox { Name = "serverBox", Height = 48, InputKind = TextInputKind.Url });

var card = new Card { Height = 120 };                                              // 圆角、随主题
card.Controls.Add (new Label { Text = "Reminders", Dock = DockStyle.Top });
column.Controls.Add (card);

var nav = new NavigationHost { Dock = DockStyle.Fill };                            // 页面栈 + 返回按钮
Controls.Add (nav);
await nav.PushAsync (column);                                                      // 在 async 处理程序中
```

**VB.NET**

```vb
Dim column As New StackPanel With {
    .Dock = DockStyle.Fill, .AutoScroll = True,
    .MaximumContentWidth = 560, .Spacing = 8, .Padding = New Padding(8)
}
column.Controls.Add(New Label With {.Text = "Server address", .AutoSize = True})   ' 按列宽换行
column.Controls.Add(New TextBox With {.Name = "serverBox", .Height = 48, .InputKind = TextInputKind.Url})

Dim card As New Card With {.Height = 120}                                           ' 圆角、随主题
card.Controls.Add(New Label With {.Text = "Reminders", .Dock = DockStyle.Top})
column.Controls.Add(card)

Dim nav As New NavigationHost With {.Dock = DockStyle.Fill}                         ' 页面栈 + 返回按钮
Controls.Add(nav)
Await nav.PushAsync(column)                                                         ' 在 Async 处理程序中
```

（`TextInputKind` 位于 `Majorsilence.Forms.Backends`。）这套写法里的其他一切都是你熟悉的 WinForms——`AutoSize` 标签会换行，`FlowLayoutPanel`/`TableLayoutPanel` 放进卡片里。

**成熟度差异很大，这一点应该写进你的计划，而不是放在脚注里。** 三行都能在 CI 中编译。**浏览器**能运行完整的控件库，但还很年轻。**Android** 做过一轮初步的真机测试：控件库能启动，点击落在正确的控件上，渲染缩放正确，硬件上触摸滚动和轻扫都可用——但上面提到的键盘、安全区和旋转行为只在 Headless 上做了单元测试，尚未在设备上验证。**iOS** 可以编译，CI 会在模拟器中启动真正的应用头做冒烟检查，但还没有人在模拟器或设备上交互式地运行过它。如果移动端在你的路线图上，请把它当成一个有真实风险的探索（spike），而不是一个勾选项——比几个月前小得多的探索，但仍然是探索。

你需要的工作负载，每个只装一次：

```
dotnet workload install wasm-tools   # 浏览器——发布时需要，构建时不需要
dotnet workload install android
dotnet workload install ios          # 仅 macOS；没有 Linux/Windows 路径
```

对于浏览器，注意 `dotnet run` 不会托管 WebAssembly 项目：请 `dotnet publish` 它，然后用任意静态文件服务器托管 `wwwroot` 输出。

一个会立刻咬到浏览器移植的坑：**按相对路径加载的文件在那里不存在。** 没有真正的文件系统，所以桌面上正常工作的图片加载会悄悄地产出空白图标（也就是[模块 0](#module-0)里那个 1×1 占位符行为）。请把图片作为嵌入资源发布，并通过程序集读取：

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

**浏览器中的无障碍是免费的——前提是你给控件起了名字。** 画布对屏幕阅读器、浏览器的页内查找以及任何基于 DOM 的测试工具都是不透明的。所以在浏览器行上，Avalonia 后端在画布旁边维护一份已打开窗体的 **DOM 镜像**：每个控件对应一个透明、可点击穿透的元素，携带它的 ARIA 角色、名称、状态和边界，由你的测试读取的同一棵自动化树（[模块 8](#module-8-tree)）生成，并在每次绘制后最多每 100 毫秒重新同步一次。测试能找到的任何东西，屏幕阅读器也能找到——这又多了一个理由，把模块 8 的"每个交互控件都要有 `Name`"规则放进你的代码评审清单。

### 嵌入到现有的 Avalonia、Uno、WinForms、WPF 或 GTK 4 应用中
{:#module-6-embedding}

如果你已经在这五种工具包之一上交付了应用，可以以增量方式采用 Majorsilence.Forms——把它的控件和窗口当作原生对象来使用，而不改变正常的 `Form.Show()` 流程。各处的模式完全相同（一个 `MajorsilenceFormsPresenter` 加一对扩展方法）；只有宿主类型不同。这里展示 Avalonia 和 Uno，Windows 的一对在[模块 7](#module-7-c)，GTK 4 则是 `ToGtkWidget()` / `ToGtkWindow()`：

**C#**

```csharp
// 一个 Majorsilence 控件，作为原生控件托管
Avalonia.Controls.Control          hostControl = myMfControl.ToAvaloniaControl ();
Microsoft.UI.Xaml.FrameworkElement unoControl  = myMfControl.ToUnoControl ();

// 一个 Majorsilence Form 的后端窗口，交还给宿主
Avalonia.Controls.Window window = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window unoWin = myForm.ToUnoWindow ();

window.Show ();                    // 从这里开始由宿主负责显示它
```

**VB.NET**

```vb
' 一个 Majorsilence 控件，作为原生控件托管
Dim hostControl As Avalonia.Controls.Control = myMfControl.ToAvaloniaControl()
Dim unoControl As Microsoft.UI.Xaml.FrameworkElement = myMfControl.ToUnoControl()

' 一个 Majorsilence Form 的后端窗口，交还给宿主
Dim window As Avalonia.Controls.Window = myForm.ToAvaloniaWindow()
Dim unoWin As Microsoft.UI.Xaml.Window = myForm.ToUnoWindow()

window.Show()                      ' 从这里开始由宿主负责显示它
```

**owner/模态关系因后端而异：** `ToAvaloniaWindow()`、`ToWinFormsForm()` 和 `ToGtkWindow()` 各自提供真正的操作系统级模态关系；Uno 在这个后端里没有 owner 概念，所以 `ToUnoWindow()` 返回的是一个独立的顶层窗口。在 Uno 下，请使用 `Form.ShowDialog(parent)`——框架自己的模态循环，不依赖原生窗口归属。

### 如果你自己绘制标题栏
{:#module-6-chrome}

对任何在做自定义窗口外观的人来说，这值得单独一页。在 Avalonia 后端上，拖动和调整大小通过交互式的 begin-drag 调用完成。在 Uno 上做不到（WinUI 没有编程式的 begin-drag），所以移动/调整大小是声明式的：窗体把它的标题栏条带发布为一个标题区域（caption region），宿主再把它转发给 WinUI。那是一个 Windows 桌面 API，所以操作系统级的标题栏拖动在 Win32 头上可用；macOS 使用原生装饰，由操作系统负责拖动/调整大小；而在 **X11 头上标题栏拖动不可用**——如果你需要操作系统的窗口拖动，请在那里使用系统装饰。

**练习 6。** 拿[模块 2](#module-2)的 `GreetForm`，通过更换包引用（对非 Avalonia 后端再加上那一行选择代码）在两个后端上运行它（Linux 上用 GTK 4；任何地方都可以用 Terminal——这是*感受*宿主接缝层最快的方式）。然后把它发布到 WebAssembly 并在浏览器中打开：`OkButton_Click` 中的 `MessageBox.Show` 在那里会抛出异常，把那个处理程序改成 `ShowAsync` 就是异步对话框规则的全部内容，一处修改即可。记下你观察到的每一个行为差异，并逐一对照上面的列表——任何不在列表上的都值得报告。

---

## Module 7 — 在 Windows 上增量采用
{:#module-7}

**目标：** 你能在一个进程中同时运行 Majorsilence.Forms 和真正的 WinForms，两个方向、两种粒度——整个窗体或单个控件——都可以，并且知道保持稳定的三条规则。

有两个仅限 Windows 的工具可以做这件事，它们工作在不同的层：

| | `Majorsilence.Forms.WindowsFormsInterop`（方向 A 和 B） | `Majorsilence.Forms.WinForms` 后端（方向 C） |
|---|---|---|
| 粒度 | 整个窗体和对话框 | 单个控件（以及窗体） |
| Majorsilence 运行在 | Avalonia 后端上，与 WinForms 共享 Win32 消息泵 | 真正的 WinForms 窗口——不涉及 Avalonia |
| 最适合 | 从 Majorsilence 应用打开旧的 WinForms 窗体，以及反过来 | 在 WinForms UI 中嵌入 Majorsilence 控件；控件库先移植内部实现；.NET Framework 4.8 宿主 |

两者可以共存——方向 C 中的 presenter 不会动已经配置好的后端。

`Majorsilence.Forms.WindowsFormsInterop` 是一个**仅限 Windows** 的桥接。在 Windows 之外，这个程序集是一个空占位（这样跨平台构建保持绿色），每个调用都会抛出 `PlatformNotSupportedException`。

**为什么它能工作：** 在 Windows 上，Avalonia 后端把它的窗口注册到操作系统消息泵，而不是运行自己的循环，而 `System.Windows.Forms` 使用的是同一个消息泵。因此两个工具包共享无论哪一个被调用的 `Application.Run`——一个循环服务两者。

### 方向 A——Majorsilence.Forms 应用打开旧的 WinForms 窗体
{:#module-7-a}

适用于应用已经迁移、但少数对话框还没迁的情况。

**C#**

```csharp
using Majorsilence.Forms.Interop;

// 非模态——立即返回
WindowsFormsInterop.Show (new LegacySettingsForm (), owner: this);

// 模态——阻塞直到 WinForms 对话框关闭
var result = WindowsFormsInterop.ShowDialog (new LegacyWizardForm (), owner: this);
if (result == System.Windows.Forms.DialogResult.OK) {
    // …
}

// 工厂重载——在显示时于 UI 线程上构造窗体
WindowsFormsInterop.Show (() => new LegacySettingsForm ());
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Interop

' 非模态——立即返回
WindowsFormsInterop.Show(New LegacySettingsForm(), owner:=Me)

' 模态——阻塞直到 WinForms 对话框关闭
Dim result = WindowsFormsInterop.ShowDialog(New LegacyWizardForm(), owner:=Me)
If result = System.Windows.Forms.DialogResult.OK Then
    ' …
End If

' 工厂重载——在显示时于 UI 线程上构造窗体
WindowsFormsInterop.Show(Function() New LegacySettingsForm())
```

要让 WinForms 对话框真正归属于 Majorsilence 父窗体（并对它模态），请在启动时**一次性**接好句柄解析器——在你这样做之前，WinForms 窗体都是以无 owner 的方式显示的：

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

### 方向 B——WinForms 应用打开 Majorsilence.Forms 界面
{:#module-7-b}

这是在做出任何承诺之前验证这个框架的低风险方式：在你已经交付的应用内部，用 Majorsilence.Forms 构建*新的*界面。

**C#**

```csharp
[STAThread]
static void Main ()
{
    System.Windows.Forms.Application.EnableVisualStyles ();
    System.Windows.Forms.Application.SetCompatibleTextRenderingDefault (false);
    System.Windows.Forms.Application.SetHighDpiMode (HighDpiMode.PerMonitorV2);

    WindowsFormsInterop.InitializeMajorsilence ();   // 一次，在第一个 MF 窗口之前
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

        WindowsFormsInterop.InitializeMajorsilence()   ' 一次，在第一个 MF 窗口之前
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

要让它返回 `DialogResult.None` 以外的结果（`None` 表示"关闭时没有显式结果"，例如点了标题栏的 ✕），请在 Majorsilence 窗体中先设置 `DialogResult` 再 `Close()`：

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

### 方向 C——一次一个控件，运行在 WinForms（或 WPF）后端上
{:#module-7-c}

方向 A 和 B 移动的是整个界面。当你负担得起的迁移单位是*一个控件*——一个自定义网格、一个图表、一个繁忙窗体上的一个面板——请改为引用 `Majorsilence.Forms.WinForms`。它是一个完整的平台后端（[模块 6](#module-6)），窗口是经典 Win32 消息泵上真正的 `System.Windows.Forms` 窗体，Skia 表面通过一个基于 GDI 的控件呈现。放进 WinForms 容器的 Majorsilence 控件会成为一个普通的 `System.Windows.Forms.Control`；后端在第一次创建 presenter 时自行安装，应用现有的 `Application.Run` 负责服务一切。（对照包的 README 和 `samples/EmbeddingWinForms` 核对过，本指南未实际运行。）

**C#**

```csharp
using Majorsilence.Forms.WinForms;

// 用命名空间限定：这个文件同时引入了 System.Windows.Forms 和 Majorsilence.Forms。
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });

System.Windows.Forms.Control host = scene.ToWinFormsControl ();   // 或者：new MajorsilenceFormsPresenter { Content = scene }
legacyForm.Controls.Add (host);

// 一个完整的 Majorsilence Form，归 WinForms 所有——真正的原生模态关系：
var dialog = new Majorsilence.Forms.Form { Text = "Ported dialog" };
System.Windows.Forms.Form native = dialog.ToWinFormsForm ();
native.ShowDialog (legacyForm);
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WinForms

' 用命名空间限定：这个文件同时引入了 System.Windows.Forms 和 Majorsilence.Forms。
Dim scene As New Majorsilence.Forms.Panel()
scene.Controls.Add(New Majorsilence.Forms.Button With {.Text = "Ported button", .Left = 12, .Top = 12})

Dim host As System.Windows.Forms.Control = scene.ToWinFormsControl()   ' 或者：New MajorsilenceFormsPresenter With {.Content = scene}
legacyForm.Controls.Add(host)

' 一个完整的 Majorsilence Form，归 WinForms 所有——真正的原生模态关系：
Dim dialog As New Majorsilence.Forms.Form With {.Text = "Ported dialog"}
Dim native As System.Windows.Forms.Form = dialog.ToWinFormsForm()
native.ShowDialog(legacyForm)
```

这条路线有三个对规划很重要的特性：

- **它面向 `net48`。** 与核心包的 `netstandard2.0` 构建配合，一个 **.NET Framework 4.8** 应用可以在不先迁移到现代 .NET 的情况下托管 Majorsilence 控件。这会重排很多迁移计划：UI 移植和运行时升级不再必须是同一个项目。
- **它双向可用。** `NativeControlHost`（[模块 9](#module-9-route-a)）在嵌入的 Majorsilence 场景中托管一个*真正的* WinForms 控件，后端通过 `PlatformHandle` 返回真正的 `HWND`。嵌入内容打开的弹出层（下拉列表、菜单）是真正的无边框操作系统窗口。
- **当最后一个控件移植完成后，换掉包**，改为 `Majorsilence.Forms.Avalonia`，同一份代码就是跨平台的。后端接缝层之上的任何东西都不会改变。

不具备的：手势（WinForms 没有手势 API——触摸以鼠标形式到达）和 webview（依赖 WebView 的兼容控件会回退，与 Headless 上一样）。`Majorsilence.Forms.Wpf` 是面向 WPF 外壳的同一思路——`ToWpfElement()` 和 `ToWpfWindow()`，`net48`/`net8.0-windows`/`net10.0-windows`，通过 `Platform.Backend = new WpfPlatformBackend ()` 选择。

**让两半看起来像同一个应用。** 混合工具包应用最明显的破绽是同一屏幕上出现两种视觉风格。`Majorsilence.Forms.Theming.WinForms` 把*同一个* CSS 主题（[附录 D](#appendix-d)）应用到真正的 `System.Windows.Forms` 控件上，在 WinForms 允许的范围内尽量做到，而且每一处做不到的地方都会作为诊断信息报告，而不是被悄悄跳过：

**C#**

```csharp
using Majorsilence.Forms.Theming.WinForms;

Theme.LoadFromCssFile ("Themes/graphite.css");                     // Majorsilence 这一半
WinFormsCssTheme.Apply (File.ReadAllText ("Themes/graphite.css")); // WinForms 这一半
WinFormsCssTheme.Track (legacyForm);                               // 现在就应用样式，之后添加的控件也会
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Theming.WinForms

Theme.LoadFromCssFile("Themes/graphite.css")                        ' Majorsilence 这一半
WinFormsCssTheme.Apply(File.ReadAllText("Themes/graphite.css"))     ' WinForms 这一半
WinFormsCssTheme.Track(legacyForm)                                  ' 现在就应用样式，之后添加的控件也会
```

（`WinFormsCssTheme.Watch (path)` 会在每次保存时重新应用，仅限 Windows 的 `ThemeStudio.WinForms` 示例就是这样工作的。）

### 三条规则
{:#module-7-rules}

1. **每个进程只有一个 `Application.Run`。** 绝不要同时调用 `Majorsilence.Forms.Application.Run` 和 `System.Windows.Forms.Application.Run`。选一个宿主；另一个方向用桥接。
2. **只在 UI（STA）线程上**——和 WinForms 完全一样。从后台线程要切回来：

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

3. **Win32 的父子关系是不对称的。** MF → WF 的父子关系通过上面的句柄解析器实现；在 WF → MF 方向上，MF 窗口目前在操作系统层面是无 owner 的。

**练习 7。** 在一个现有 WinForms 应用的临时副本中，通过方向 B 添加一个用 Majorsilence.Forms 构建的新界面，并接好 owner 句柄。然后，在同一个应用中，通过方向 C 把一个现有控件替换为 Majorsilence 控件。两者合起来就是能说服干系人的演示，因为它们完全不改变你已经交付的东西。

---

## Module 8 — 测试你的应用
{:#module-8}

**目标：** 你的团队能编写在没有显示器的 CI 中运行的 UI 测试，使用不会失效的定位器——并且知道哪些无障碍能力是免费得到的。

> 本模块是概览。[**自动化与 UI 测试**]({{ '/zh/automation/' | relative_url }})是面向实践者的版本：页面对象、等待辅助方法（这里没有隐式等待）、用真正的 Selenium 驱动应用、Windows 上的 FlaUI/WinAppDriver、黄金图像回归、GitHub Actions、Azure DevOps 和 Jenkins 的 CI 配方，以及 AI 代理如何接入同一套接口。

### 一棵自动化树，三类消费者
{:#module-8-tree}

框架暴露一棵与后端无关的**自动化树**：你实时控件层级的一份快照，带有 id、名称、角色、值、状态和边界。

| 消费者 | 包 | 给你的能力 |
|---|---|---|
| 进程内 UI 测试 | `Majorsilence.Forms.Automation`（在核心包中） | 用 C#/VB 驱动窗体，无需像素计算 |
| 远程自动化 | `Majorsilence.Forms.WebDriver` | 一个任何 Selenium 客户端都能驱动的 W3C WebDriver 服务器 |
| 屏幕阅读器和放大镜 | `Majorsilence.Forms.WindowsUIAutomation` | Windows 上的 Narrator / NVDA / JAWS |

这棵树读取的是渲染器使用的同一套逻辑边界和状态，所以它在无头后端和真实后端上的行为完全一致——**针对 Headless 写的测试，描述的就是用户在 Avalonia 上看到的东西。**

### 让控件可被找到——一条团队约定，第一天就采用
{:#module-8-findable}

定位器依赖两个你本来就在设置的属性：

- `Control.Name` → 元素的 **AutomationId**。稳定的定位器。始终优先使用它。
- `Control.AccessibleName`（回退到 `Text`，再回退到 `Name`）→ 元素的 **Name**。

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

角色由控件类型推断（`button`、`textbox`、`checkbox`、`radio`、`combobox`、`list`、`label`、`tablist`、`window`……），除非你设置了 `Control.AccessibleRole`。把"每个交互控件都要有 `Name`"定为代码评审规则——同一次敲击键盘既买到了测试定位器，*也*买到了屏幕阅读器支持：Windows 上通过 UI Automation，浏览器中通过 [ARIA DOM 镜像](#module-6-singleview)。

### 自定义绘制的控件：发布你自己的值和状态
{:#module-8-stateprovider}

内置控件知道如何报告自己的值——`TextBox` 报告文本，`CheckBox` 报告 `"true"`。你自己绘制的控件（[模块 4](#module-4-paint)）没有可供推断的东西，所以它在树中出现时值为空，角色是根据类型名猜的。`AccessibleRole` 和 `AccessibleName` 已经能修正角色和名称。对于值和任何额外状态，请实现 `IAutomationStateProvider`——树会使用你报告的内容而不是猜测，而且每个状态项都会成为一个可独立查询的 `state-{key}` 属性。（来自 `docs/automation.md`；本指南未实际运行。）

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

    protected override void OnPaint (PaintEventArgs e) { /* 绘制信标 */ }
}

// 在测试中——状态可以用 XPath 寻址：
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
        ' 绘制信标
    End Sub
End Class

' 在测试中——状态可以用 XPath 寻址：
session.Find(By.XPath("//BeaconIndicator[@state-level='3']"))
```

再给它设置 `Name`、`AccessibleName` 和 `AccessibleRole`，元素就会在 `GetPageSource()` 中携带全部四项——而通过 WebDriver，`getAttribute("state-level")` 读到的是同一个东西。状态键只用字母、数字、`-` 和 `_`。要知道一条规则：`AutomationValue` *替代*内置推断，而不是与之混合，所以一个类似复选框的自定义控件要自己报告 `"true"`/`"false"`。

### Headless 后端就是你的 CI 方案
{:#module-8-headless}

`Majorsilence.Forms.Headless` 不需要显示器。为整个测试程序集安装一次，之后每个测试都会用到它。

**C#——模块初始化器是最整洁的挂钩点**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Headless;

internal static class TestBootstrap
{
    [ModuleInitializer]
    internal static void Init () => HeadlessRenderer.Use ();
}
```

**VB.NET——VB 没有模块初始化器，所以用你测试框架的程序集级挂钩**

```vb
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBootstrap
    ' MSTest：<AssemblyInitialize>。NUnit 的等价物是带 <OneTimeSetUp> 的 <SetUpFixture>；
    ' xUnit 的是 collection/assembly fixture。VB 不能使用 <ModuleInitializer>——VB
    ' 编译器不会生成模块初始化器，所以只加这个特性什么也不会发生。
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        HeadlessRenderer.Use()
    End Sub
End Class
```

这是真正的语言差异，不是风格偏好：如果你把 C# 的写法照搬到 VB，你的测试会在完全没有后端的情况下运行，并以令人困惑的方式失败。

也不要因为"Avalonia 才是真正的后端"就忍不住在 Avalonia 后端上运行 UI 测试：Avalonia 的调度器绑定线程，会与测试运行器的工作线程冲突。Headless 的存在正是为了让你的测试套件既不需要显示器也不需要 UI 线程——框架自己的测试套件就运行在它上面，而 `HeadlessRenderer.Use ()` 等价于你自己赋值 `HeadlessPlatformBackend`。

### 一个完整的 UI 测试
{:#module-8-inprocess}

`By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` 用于定位元素；`Find`、`FindOrThrow` 和 `FindAll` 每次都查询一份**新的快照**。动作（`Click`、`SendKeys`、`PressKey`、`Clear`）走的是真实后端使用的同一条中立输入管线，所以它们会真正经过路由、焦点和布局——不是测试专用的捷径。

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

        // 黄金图像检查：离屏渲染并与已提交的 PNG 比对。
        var png = HeadlessRenderer.CapturePng (form, 360, 140);

        Assert.NotEmpty (png);
        // File.WriteAllBytes ("greetform.expected.png", png);   // 有意重新生成时再启用
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
            ' 黄金图像检查：离屏渲染并与已提交的 PNG 比对。
            Dim png = HeadlessRenderer.CapturePng(form, 360, 140)
            Assert.IsTrue(png.Length > 0)
        End Using
    End Sub
End Class
```

`By.XPath` 针对树的 XML 呈现求值，也就是 `session.GetPageSource()` 返回的同一形态——当你没有稳定 id 可用时很有用：

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

**在 HiDPI 下测试。** `MF_HEADLESS_SCALE=2` 让无头后端报告一个缩放后的显示器，这就是在没有缩放显示器的情况下测试 2× 布局的方法。框架自己的测试套件在该缩放下通过，并且 CI 以此为门禁，所以这是受支持的做法，而不是一个已知有问题的角落。

不过请从那些失败是如何被修复的里面吸取教训，因为你的代码里也有同一个陷阱：几乎所有失败都是**同一个混淆——逻辑单位与设备单位。** 自 2026-10-01 起，你从 `Control` 上读到的一切——`Bounds`、`ClientRectangle`、`ClientSize`、`MouseEventArgs`、绘制画布——都是逻辑单位（[模块 4](#module-4-paint)），这消除了陷阱中最糟糕的部分。*仍然*以设备像素计的有：捕获的位图（`HeadlessRenderer.CapturePng` 在缩放 2 下每个方向都是两倍大小）、你按名字请求的 `Scaled*` 系列，以及 owner-draw 事件的 `Bounds`。它们在缩放 1 下完全相同，所以混用时看不出来，直到出现一个缩放显示器。因此：**按比例断言几何，而不是按缩放 1 下的像素**，并且当你把捕获的位图与矩形比较时，先检查各自处于哪个空间。一个仍在调用 `ScaleTransform (e.Scaling, …)` 的自定义控件，是今天过不了这道门禁最常见的原因。

### 使用 Selenium 的远程自动化
{:#module-8-webdriver}

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

var server = new WebDriverServer (form, port: 4444);
server.Start ();          // http://127.0.0.1:4444/  （仅回环地址）
// …… 用任意 WebDriver 客户端驱动它 ……
server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Dim server As New WebDriverServer(form, port:=4444)
server.Start()            ' http://127.0.0.1:4444/  （仅回环地址）
' …… 用任意 WebDriver 客户端驱动它 ……
server.Stop()
```

因为 WebDriver 只是 HTTP 和 JSON，所以任何语言的任何客户端都可以：

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

支持：新建/删除会话、查找元素（单个/多个）、点击、发送按键、清除、获取文本、获取名称（角色）、获取属性、获取矩形、获取启用状态、**页面源码**（XML）、截图（PNG）、`GET /status`。定位器：`id`、`name`、`tag name`（角色）、`xpath`、`css selector`（`#id` 和 `[name='…']`），以及自定义的 `role`、`type`、`link text`。元素引用在每次使用时都针对新的快照重新解析，优先使用稳定的 AutomationId，所以编辑之后值仍然是实时的。

**录制定位器。** 因为服务器暴露 XML 页面源码*以及*一个针对正是这份源码运行的 xpath 策略，任何 Appium 风格的检查器都能把实时的树叠加在截图上渲染出来，让你通过点击节点捕获定位器。把它指向 `127.0.0.1`、你的端口、路径 `/`、纯 http；capabilities 会被忽略。按这个顺序选择定位器：**`id`** → **`xpath`** → `name`/`role`/`type`。注意事项：这是一个 W3C WebDriver 服务器，不是完整的 Appium 服务器（Appium 专有端点返回 404——通用 WebDriver 客户端是最可靠的检查器）；如果截图是在不同 DPI 下捕获的，叠加层可能有偏移；一次只有一个窗口；隐藏控件不会出现在树中。

在**无头**测试中没有消息循环，所以在 HTTP 调用于工作线程上运行时，要泵一下队列：

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

**Playwright 不适合**这个桌面应用——它通过 DOM 自动化浏览器引擎，而这里没有 DOM。（浏览器头的 [ARIA 镜像](#module-6-singleview)是一个 DOM，但它是无障碍接口，不是自动化 API；请通过 WebDriver 驱动应用。）别让这个问题耗掉一个冲刺。

### 让 AI 代理驱动应用
{:#module-8-mcp}

同一个 WebDriver 端点也是 AI 助手所使用的。`Majorsilence.Forms.Mcp` 是一个以 dotnet 全局工具形式发布的 MCP 服务器：它通过 stdio 与助手讲 MCP，通过回环地址上的 HTTP 与你应用的 `WebDriverServer` 通信，暴露 `ui_snapshot`、`ui_find`、`ui_read`、`ui_click`、`ui_type`、`ui_wait_for` 和 `ui_screenshot`。每个工具接受的都是定位器而不是元素句柄，所以在查找和动作之间不会有任何东西过期。

```
dotnet tool install -g Majorsilence.Forms.Mcp
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444     # 或者在任何 MCP 客户端的配置中使用同一条命令
```

学习时可以拿来练手的目标：`samples/AutomationTarget` 是一个正是为此而建的小应用——`dotnet run --project samples/AutomationTarget -- --webdriver 4444` 启动端点并打印出驱动它的命令。它的每个控件各自考验客户端必须处理的一件事：一个永久禁用的按钮（让你看到的是拒绝而不是假的成功）、一个只有勾选复选框后才启用的 Submit 按钮（`ui_wait_for` 就是为这个准备的）、一个故意不命名的控件，以及一份可见的全部动作日志，让你能把客户端*声称*做了的事与应用实际看到的对照检查。这个自动化接口没有身份验证，所以只在开发和测试构建中暴露它。

### Windows 上的无障碍
{:#module-8-a11y}

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // 必须先显示——它需要一个原生句柄
WindowsUIAutomation.Enable (form);  // 窗口关闭时自动分离
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' 必须先显示——它需要一个原生句柄
WindowsUIAutomation.Enable(form)    ' 窗口关闭时自动分离
```

> **这段代码在 Windows 之外无法编译**——这是验证过的，不是推测。离开 Windows，这个包以空存根的形式发布，所以 `Majorsilence.Forms.WindowsUIAutomation` 命名空间不存在，你得到的是 CS0234 而不是运行时的 `PlatformNotSupportedException`。在跨平台应用中，请多目标（`net10.0;net10.0-windows`）并用 `#if WINDOWS` 保护这个调用，或者把它放在一个由你的桌面头按条件引用的仅限 Windows 的项目里。

每个控件都会成为一个 UIA 元素，带有 **Name**、**AutomationId**（`Control.Name`）、**ControlType**、**IsEnabled**、**HasKeyboardFocus** 和屏幕上的 **BoundingRectangle**。`Invoke`（按钮）是实时的；`Value` 和 `Toggle` 以只读方式暴露。焦点变化会触发 UIA 的焦点变化事件——这正是让屏幕阅读器播报新控件、让放大镜跟随的东西。

第一版尚未包含：逐键的 `TextBox` 值事件（屏幕阅读器会回退到它们自己的键入字符回显；输入框在获得焦点时仍会被播报）、结构变化事件，以及子控件项（单个选项卡、列表行）。基于同一棵树的 Linux（AT-SPI）和 macOS（NSAccessibility）桥接在路线图上——所以如果你在这些平台上有无障碍义务，请现在就提出来，而不是等到发布时。

**练习 8。** 用你自己团队的语言写出上面的 `GreetFormTests`，让它在没有显示器的 CI 中变绿，然后加上一个黄金图像断言。那个测试就是你代码库中每个 UI 测试都应遵循的模板。

---

## Module 9 — 原生内容与视频
{:#module-9}

**目标：**团队里没有人再伪造窗口句柄，而视频、地图、浏览器等内容以真正能正确合成的方式被托管。

两个问题其实是同一个问题——“如何把原生内容放进一个控件里？”和“如何拿到某个控件的 `HWND`？”——而第二个问题的答案是：**拿不到，也不应该伪造一个。**

| 成员 | 值 | 原因 |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | 不存在逐控件的操作系统窗口。`ImageList.Handle`、`TreeNode.Handle`、`Cursor.Handle`、`TaskDialog.Handle` 同理。 |
| `WindowBase.Handle` | 一个不透明的非零令牌 | **不是 `HWND`。**它存在的原因是 WinForms 代码经常在 `Invoke` 之前读取 `.Handle` 来强制创建句柄，返回零会破坏这一惯用写法。它只在托管代码内部有意义。 |
| `WindowBase.PlatformHandle` | 真正的原生句柄，或零 | 这才是真货——在 Avalonia 后端是 `HWND`/`NSWindow`/`XID`，在 WinForms 后端是真正的 `HWND`。在 Uno 和 Headless 上为零。 |

**关于伪造的规则：**一个捏造的句柄*只有*在你自己掌控的托管代码中来回传递时才是安全的。一旦它跨进原生代码，就不再安全——LibVLC 的 `libvlc_media_player_set_hwnd`、mpv 的 `--wid`、GStreamer 的 `GstVideoOverlay.set_window_handle` 都会把它交给操作系统（`SetParent`、`CreateWindowEx`、`SetWindowPos`），而操作系统不会容忍一个编造出来的值。

### 路线 A——`NativeControlHost`
{:#module-9-route-a}

这是受支持的接缝（seam）：你的控件预留一块矩形区域，后端用一个真正的工具包元素填进去，叠加在 Skia 表面之上，并保持与占位控件的边界、裁剪和可见性对齐。在 Avalonia、Uno、GTK 4 和 WinForms 后端上可用；在 Headless 和 Terminal 上不存在。

**C#**

```csharp
using Majorsilence.Forms;

var host = new NativeControlHost {
    Name = "mapHost",
    Dock = DockStyle.Fill
};

// 赋值为工具包自身的元素类型。在 Avalonia 后端上，这是一个 Avalonia Control：
host.NativeControl = new Avalonia.Controls.Button { Content = "I am a real Avalonia button" };

Controls.Add (host);

// 设为 null 会再次移除被托管的元素。
host.NativeControl = null;
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Dim host As New NativeControlHost With {
    .Name = "mapHost",
    .Dock = DockStyle.Fill
}

' 赋值为工具包自身的元素类型。在 Avalonia 后端上，这是一个 Avalonia Control：
host.NativeControl = New Avalonia.Controls.Button With {
    .Content = "I am a real Avalonia button"
}

Controls.Add(host)

' 设为 Nothing 会再次移除被托管的元素。
host.NativeControl = Nothing
```

![托管在 Majorsilence 窗体内的原生 Avalonia 按钮]({{ '/assets/img/example-native.png' | relative_url }})

*上面这段代码的运行效果：那个 Avalonia `Button` 真实存在，托管在 Skia 表面之上。注意它渲染成了没有任何按钮外观的裸文本——被托管的原生控件由**宿主应用程序**的 Avalonia 样式决定外观，而后端只引导了一个不安装任何主题的最小 Avalonia 应用。接缝是通的；样式需要你自己提供。如果你打算托管真正的原生 UI，而不是像地图或视频视图这样自绘的表面，请为此预留工作量。*

有三件事需要知道。**空域（airspace）限制：**叠加层是位于你所绘内容*之上*的原生元素，所以框架绘制的任何东西都无法出现在它上面（GTK 4 是例外——它把每个部件都合成到同一棵渲染树中，所以那里不存在空域问题）。**样式不会从 Majorsilence.Forms 继承**——见上面的截图。还有，**赋了错误的类型会静默失败**——`NativeControl` 的类型是 `Object`，每个后端会对它做类型检查，不匹配就直接返回；不抛异常，不记录日志，什么也不显示。把 Avalonia 的 `Control` 交给 Uno 后端就是这个结果；把 WinForms 控件交给 GTK 4 也是。如果你的原生内容不可见，先检查类型：Avalonia `Control`、Uno `UIElement`、`System.Windows.Forms.Control`、`Gtk.Widget`。

### 路线 B——通过帧回调播放视频（推荐）
{:#module-9-route-b}

与其托管一个原生表面，不如从播放器取得解码后的帧，自己把它们画进 Skia。它能与你绘制的其他一切正确合成，并且完全绕开了空域问题和句柄问题。大致形态如下：

**C#**

```csharp
public class VideoSurface : Control
{
    private SKBitmap? frame;

    // 由播放器的帧回调调用，运行在播放器使用的任意线程上。
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

    ' 由播放器的帧回调调用，运行在播放器使用的任意线程上。
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

![帧回调视频表面正在合成一帧解码后的画面]({{ '/assets/img/example-video.png' | relative_url }})

*同一段代码，用一帧合成的画面代替解码器。位图被直接画进控件的 Skia 画布，因此它与你绘制的其他一切合成在一起——没有空域问题，没有句柄，并且在包括 Headless 在内的每个后端上行为完全一致（这也正是你对它做单元测试的方式）。*

完整的对比和已知缺口见 [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md)。

**练习 9。**在你的代码库中找出每一处 `.Handle`，并对每个用法分类：强制创建句柄（没问题——保留）、传给托管代码（没问题）、传给原生代码（必须修改）。五分钟的 grep，就能预防一类真正令人困惑的 bug。

---

## Module 10 — 发布：CI、版本管理与保持更新
{:#module-10}

**目标：**你的流水线能捕获这个框架实际会产生的那些回归，而且你知道遇到缺口时该怎么做。

### 为流水线设门禁
{:#module-10-ci}

| 门禁 | 命令 | 捕获什么 |
|---|---|---|
| 干净构建 | `dotnet build --configuration Release` | 在警告累积之前把它们揪出来 |
| 测试 | `dotnet test --configuration Release --no-build` | [Module 8](#module-8) 中的一切——不需要显示器 |
| 迁移漂移 | `majorsilence-migrate <sln> --dry-run --strict` | 一个新的未映射引用一落到分支上就被发现，而你还在收敛中 |
| HiDPI | 在对缩放敏感的测试上设置 `MF_HEADLESS_SCALE=2` | 只在缩放为 1 时才正常的布局——以及仍在自行缩放画布的自定义控件（[Module 4](#module-4-paint)） |
| 浏览器代码中的阻塞调用 | `MFB001`–`MFB003` 分析器，在共享 UI 库的 `.editorconfig` 中设置 `majorsilence_forms.browser_target = true`，并在该项目上把警告视为错误 | 会抛异常或冻结页面的 `ShowDialog`/`MessageBox.Show`/`.Result`/`Thread.Sleep`（[Module 6](#module-6-async)） |
| 浏览器启动 | `dotnet publish` 你的 wasm 头部项目 + 一个无头 Chromium 冒烟测试 | wasm 流水线坏掉 |

如果你以浏览器为目标，最后那一条值得原样照搬：**wasm 目标能构建，并不能证明它能运行。**`dotnet publish` 才会运行 wasm-tools 流水线（emcc/wasm-opt 原生链接），而只有在浏览器里真正启动一次才能证明这个包没问题。一次成功的 `dotnet build` 对此什么也说明不了。框架自己的 CI 是这样做的：控件库头部项目能识别一个 `?check=<name>` 查询字符串，再配上一个小的 Node 脚本（`samples/Gallery.Wasm/tools/modal-check.mjs`），它在无头 Chrome 中启动已发布的包，运行每个具名检查，并把结果与一张预期表比对——模态检查正是证明异步对话框规则的方式。照搬这个形态：在你自己的头部项目里加一个 `?check=` 开关只需一个下午，却能把“它发布了”变成“它跑起来了”。

### 版本纪律
{:#module-10-versioning}

- **锁定你的包版本。**这是测试版（beta）软件；API 正在趋于稳定。锁定版本，有意识地升级，并阅读发行说明——[Module 5 的检查清单](#module-5-checklist)中记录的那些破坏性变更，正是会在版本之间出现的那类东西。
- **让核心包、后端包和迁移器的版本保持同步。**迁移器的 `--package-version` 默认为它自身的版本，因为工具和包来自同一个发行版本。
- **集中管理版本**，让一次升级只需改一处。在 `Directory.Packages.props` 中：

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

  随着采用进度，把 `Majorsilence.Forms.Mvvm`、`.Theming.WinForms`、`.Animation` 或第二个后端加进同一个列表——这个家族里的每个包都来自同一个发行版本、使用同一个版本号。

- **在分支上升级，并确保你的黄金图像测试全绿**，再让它触及其他任何人。渲染变化正是那些测试存在的意义。

### 遇到缺口时
{:#module-10-gaps}

你一定会遇到。值得知道的是，这个框架里有好几个缺口只是通过*迁移真实应用*才发现的——一个 WinForms 游戏、一个 Ribbon 控件库——而不是通过阅读 API 表面。如果你的团队移植了某个真实项目并撞上了一个静默空操作，这个发现的价值超出你自己的项目。

- **一个本应空操作却抛异常的成员**违反了[存根策略](#module-3-stub-policy)——请把它作为 bug 报告。
- **一个让你耗掉一整天的静默空操作**同样值得提一个 issue：提交时请写明*症状*，而不只是成员名（“`X` 什么也没做，所以精灵图绘制出来带着白框”），因为症状才是让下一个团队能搜到它的关键。附上你写的[固定测试](#module-3-pin)——它就是一个随时可运行的复现。
- **被卡住又等不起？**项目接受 pull request，无论是否借助 AI，门槛很简单：`dotnet build --configuration Release` 和 `dotnet test` 干净通过，新行为由能证明它*可用*（而不只是能编译）的测试覆盖，并且 [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) 与它所描述的代码一同更新。补上那个正阻塞你的具体缺口，通常远比绕着它设计要省事得多。

**练习 10。**把上面的门禁加到你的仓库里。然后从 [Module 3](#module-3) 练习中挑出那个你的应用真正需要的缺口，由团队一起决定：绕开它设计，还是在上游补上。写下选了哪条以及原因。

---

## 附录 A — 按症状排查问题
{:#appendix-a}

| 症状 | 可能原因 | 修复 |
|---|---|---|
| 应用无法启动 / 没有窗口出现 | 没有引用任何后端包——核心包本身无法把窗口放到屏幕上 | 添加 `Majorsilence.Forms.Avalonia`（或 Uno/Headless） |
| 迁移后 `Bitmap`/`Font`/`Pen` 出现引用不明确错误 | `System.Drawing.Common` 仍与 Majorsilence 的替代类型并存被引用 | 移除该包引用（迁移器会对它触及的每个项目这样做） |
| `SystemColors` / `ColorTranslator` 上出现 CS0104（C#）/ 二义性（VB） | 两者都位于 `System.Drawing.Primitives` 中，所以仍会通过保留下来的 `System.Drawing` 导入解析 | 添加别名——`using SystemColors = Majorsilence.Forms.SystemColors;` / `Imports SystemColors = Majorsilence.Forms.SystemColors` |
| 一个从未提到 WinForms 的类库无法编译 | 它里面有一个图像/字体辅助方法被重写成了 `Majorsilence.Forms.Drawing.*` | 添加 `Majorsilence.Forms` 引用；“重写触及的项目”比“WinForms 项目”范围更广 |
| 设计器事件接线无法编译（`new EventHandler<KeyEventArgs>(…)`） | 事件委托类型现在与 WinForms 一致 | 去掉包装，或直接写出 WinForms 的委托名（`KeyEventHandler`、`MouseEventHandler`……） |
| `Click` 处理程序中缺少 `e.X` / `e.Button` | `Click` 在 WinForms 中同样是 `EventArgs` 事件 | 改用 `MouseClick`；对于菜单项，从所属控件取位置 |
| VB：`Anchor`/`DockStyle` 标志上 `Or` 与 `|` 的问题 | VB 中标志的组合使用 `Or` | `AnchorStyles.Top Or AnchorStyles.Left` |
| VB：测试在没有后端的情况下运行 | VB 没有模块初始化器——C# 的 `<ModuleInitializer>` 模式会静默地什么也不做 | 在 `<AssemblyInitialize>` / `<SetUpFixture>` 中安装后端——见 [Module 8](#module-8-headless) |
| 分割布局的方向翻转了 | `SplitContainer.Orientation` 现在表示*分隔条*的方向 | 把你设置的值反过来（没有任何警告——两个值都能编译） |
| 第一次读取资源时出现 `InvalidCastException` | 生成的资源设计器在对 `System.Resources.ResourceManager` 的结果做强制转换 | 使用 `Majorsilence.Forms.ComponentResourceManager`（迁移器会自动重写生成的设计器） |
| 某个资源在运行时解析为 `null` | 该 resx 条目是 `ResXFileRef`（链接文件，而非内联数据） | 把资源内联，或自行加载 |
| 所有图标都不可见，没有任何日志 | 相对资源路径相对于错误的**工作目录**解析了；缺失的文件变成了 1×1 占位图而不是抛异常 | 相对于 `AppContext.BaseDirectory` 解析资源——见 [Module 0](#module-0) |
| 只有浏览器构建中图标缺失 | 那里没有真正的文件系统；相对文件加载不可能成功 | 把图像作为嵌入资源发布——见 [Module 6](#module-6-singleview) |
| 设置某个属性完全没有可见效果 | 按照[存根策略](#module-3-stub-policy)它是一个存根——存储并可读回，但没有任何东西消费它 | 查看矩阵中的那一行。如果它反而*抛异常*，那就是 bug——请报告 |
| 托管的原生内容不可见 | 后端对你的原生控件做了类型检查，不匹配，于是静默返回 | 检查类型：Avalonia 后端用 Avalonia `Control`，Uno 用 Uno `UIElement`，WinForms 后端用 `System.Windows.Forms.Control`，GTK 4 用 `Gtk.Widget` |
| 最大化/最小化没有反应；`Title` 被忽略 | 你在单视图平台上（浏览器/Android/iOS/Terminal）——没有窗口管理器 | 预期行为。见 [Module 6](#module-6-singleview) |
| HiDPI 下点击落到了错误的位置 | 输入路由混用了逻辑单位和设备单位——26.0.30 中的一个框架 bug，已修复，并在 CI 中以缩放 2 设了门禁 | 升级（26.9.0 或更高）。如果仍然存在，那就是你自己的代码在混用两个坐标空间——见 [Module 8](#module-8-headless) |
| 自定义控件在 HiDPI 显示器上画成两倍大小，1× 下正常 | 绘制画布现在是逻辑单位；控件仍在调用 `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`，于是缩放了两次 | 去掉 `ScaleTransform`——见 [Module 4](#module-4-paint)。在 `MF_HEADLESS_SCALE=2` 下测试 |
| 所有者绘制的项（`DrawItem`、`DrawNode`、`CellPainting`）在 HiDPI 下偏小或偏移 | 这些事件仍使用设备像素，与控件的逻辑 `ClientRectangle` 不同 | 配套使用 `e.Bounds` 和 `e.Graphics`，不要混入控件自身的逻辑几何；见 [Module 4](#module-4-paint) |
| 在浏览器、Android 或 iOS 上 `ShowDialog` / `MessageBox.Show` 抛出 `PlatformNotSupportedException` | 这些平台无法运行嵌套的模态循环；异常信息会给出可等待的孪生方法名 | 在 `async` 处理程序中使用 `ShowDialogAsync` / `MessageBox.ShowAsync`——见 [Module 6](#module-6-async)。打开 `MFB` 分析器，让构建帮你找出其余的 |
| 点击之后浏览器标签页冻结 | 有东西阻塞了页面唯一的线程——`.Result`、`.Wait()`、`Thread.Sleep` | `await` 它（`MFB002`/`MFB003` 会标出这些）——见 [Module 6](#module-6-async) |
| GTK 4 窗口忽略 `Location` / `StartPosition` | GTK 4 移除了顶层窗口的客户端定位；由窗口管理器决定 | 预期行为。在该后端上 `Location` 只是一个被存储的提示——见 [Module 6](#module-6) |
| GTK 4 / Headless 上文件选择器什么也不返回 | 这些后端还没有原生选择器，所以使用的是框架自带的回退对话框 | 预期行为；回退对话框可用。`Gtk.FileDialog` 的接线是推迟的工作 |
| WinForms 对话框对它的 Majorsilence 父窗体不是模态的 | `OwnerHandleResolver` 从未被接上 | 在启动时接一次——见 [Module 7](#module-7-a) |
| Windows 上死锁或出现双重消息循环 | 两个 `Application.Run` 都被调用了 | 每个进程只有一个宿主；另一个方向用桥接 |
| macOS/Linux 上互操作抛出 `PlatformNotSupportedException` | 那里不存在 `System.Windows.Forms` | 把互操作调用放在 Windows 检查之后 |
| 某条 CSS 主题规则没有效果，也没有错误 | 有控件在代码中设置了该属性（`button.BackColor = …`）——和 WinForms 一样，逐控件的显式值优先 | 去掉逐控件的值，或接受现状。相比之下，*拼写错误*的规则总会报错——查看 `ThemeStyleSheet.Parse` 的诊断信息（[附录 D](#appendix-d)） |
| 一个用了 `BindCommand` 的按钮每次点击运行命令两次 | 同一个控件上还设置了 `Button.Command` | 二者只用其一（[附录 E](#appendix-e)） |

---

## 附录 B — 真实代码库的推广计划
{:#appendix-b}

一个让证据先于承诺到达的顺序。

1. **预研（1 天）。**Module 0–3。模板应用在每位开发者的操作系统上跑起来，浏览过在线控件库，读过兼容性矩阵。交付物：你的应用最依赖的 20 个 UI 能力的清单，并逐一标注为已实现 / 存根 / 不存在。
2. **试点迁移（2–5 天）。**挑一个小的、真实的、低风险的内部应用。在分支上运行迁移器，让它能构建起来，过一遍[手动修复检查清单](#module-5-checklist)。交付物：一个校准过的每千行代码（KLOC）估算，以及一份真正阻塞*你*的缺口清单。
3. **决定采用形态。**三个选项，并不互斥：
   - **新应用**——直接从 Majorsilence.Forms 开始（[Module 2](#module-2)）。
   - **旧应用中的新界面**——Windows 上的方向 B 互操作，不改变你发布的任何东西（[Module 7](#module-7-b)）。
   - **旧应用中逐个控件替换**——WinForms 或 WPF 后端（[Module 7](#module-7-c)），它同样能在 .NET Framework 4.8 上工作，所以 UI 移植不必等待运行时升级。
   - **整个应用迁移**——使用迁移器，如果你用的是 C#，可选 `--dual-build`（[Module 5](#module-5-dualbuild)）。**VB 团队：请改为规划一次性切换**——双构建对你们不可用。
4. **在大规模工作之前建好测试网。**在试点项目上实施 [Module 8](#module-8)：定位器命名约定、CI 中的无头测试、你关心的那些界面的黄金图像。要在迁移大应用*之前*完成——测试是你了解移植结果是否正常的方式。
5. **设置 CI 门禁**（[Module 10](#module-10-ci)），包括 `--strict` 迁移漂移检查。
6. **分批迁移**，一次一个可部署单元，每一批都以门禁全绿收尾。
7. **把发现反馈回去**（[Module 10](#module-10-gaps)）。你撞上的那些静默空操作，正是别人仅靠阅读 API 找不到的。

请尽早且明确地决定以下事项，因为每一项都会约束计划：你真正需要哪些平台（仅桌面与“再加上 iOS”是截然不同的项目）、是否需要可视化设计器（目前还没有）、是否依赖某家供应商的控件套件（Telerik 有兼容层；其他供应商需要 `--map` 文件和手动工作）、在 Windows 之外是否有无障碍方面的义务、你的代码库是否是 VB（一次性切换，而非双构建）、应用中是否有任何地方托管原生内容或读取窗口句柄，以及——如果浏览器或手机头部项目在范围内——你的对话框是否从一开始就按异步方式编写（[Module 6](#module-6-async)）。

---

## 附录 C — 速查卡
{:#appendix-c}

**站点页面：**[快速上手]({{ '/zh/getting-started/' | relative_url }}) ·
[迁移]({{ '/zh/migration/' | relative_url }}) ·
[示例]({{ '/zh/samples/' | relative_url }}) · [平台后端]({{ '/zh/backends/' | relative_url }}) ·
[自动化与 UI 测试]({{ '/zh/automation/' | relative_url }}) ·
[原生互操作]({{ '/zh/native-interop/' | relative_url }}) · [常见问题]({{ '/zh/faq/' | relative_url }}) ·
[博客]({{ '/zh/blog/' | relative_url }}) · [在线浏览器控件库]({{ '/gallery/' | relative_url }})

**仓库中——应用团队真正需要的文档：**

| 文档 | 何时阅读 |
|---|---|
| [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) | 在依赖任何成员之前。请一直开着它 |
| [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) | 运行迁移器时；每一处破坏性变更都记录在这里 |
| [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) | 选择后端；逻辑单位与设备单位；单视图平台；异步对话框规则与分析器 |
| [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) | 编写 CSS 主题——整个语言都在这一页上 |
| [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) | 用 `Observe`/`BindText`/`BindCommand` 接线视图模型 |
| [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md) | 布局手机形态的界面——`StackPanel`、`Card`、`RichListBox` |
| [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md) | `RequestAnimationFrame`、补间动画、减少动态效果、Headless 时钟 |
| [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md) | 深入测试，包括自定义控件的 `IAutomationStateProvider` 和 MCP 服务器 |
| [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) | 在 Windows 上让两套技术栈运行于同一进程 |
| [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) | 托管原生内容或视频 |

**值得记住的命令：**

```
dotnet new install Majorsilence.Forms.Templates        # 只需一次
dotnet new majorsilenceforms -n MyApp                  # 新应用（共享库 + 桌面头部项目）
dotnet run --project MyApp
dotnet build --configuration Release && dotnet test --configuration Release --no-build
MF_HEADLESS_SCALE=2 dotnet test --configuration Release --no-build   # HiDPI 门禁
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff   # 评估迁移范围
majorsilence-migrate MySolution.sln --no-backup        # 在分支上运行
majorsilence-migrate MySolution.sln --dry-run --strict # CI 漂移门禁
dotnet tool install -g Majorsilence.Forms.Mcp          # 让 AI 代理驱动应用（Module 8）
dotnet workload install wasm-tools && dotnet publish <YourWasmHead> -c Release -o out
dotnet run --project samples/ThemeStudio               # 从克隆的仓库运行：实时 CSS 主题编辑器（附录 D）
```

**给任何问“到底变了什么”的人的两行总结：**你的导入从 `System.Windows.Forms` 换成 `Majorsilence.Forms`，从 GDI+ 换成 `Majorsilence.Forms.Drawing`，再加一个后端包。你的窗体、设计器文件、事件处理程序和业务逻辑仍然是你自己的。

---

## 附录 D — 用 CSS 为你的应用设置主题
{:#appendix-d}

**目标：**你能用一个文件重新设计整个应用的外观，知道主题语言能表达什么、不能表达什么，并且知道一条规则写错时如何发现。

因为框架自己绘制每一个像素（[Module 1](#module-1)），外观是框架层面的事而非操作系统层面的事——框架把它暴露为一个**小而严格定义的 CSS 子集**。一个主题就是一个 `.css` 文件；整个语言一页就能放下（[`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md)），而解析器会拒绝任何超出范围的东西，并给出行号、列号和受支持的替代写法。在框架的这个角落里，刻意**没有任何静默空操作**——拼错的属性是一个错误，而不是存根。（本附录对照该文档和 `ThemeStudio` 示例核对过，但没有为本指南实际运行。较旧的 `<Theme>` XML 格式仍然可用，并且可以与 CSS 混用。）

### 加载主题
{:#appendix-d-load}

**C#**

```csharp
using Majorsilence.Forms;

// 直接应用一个文件：
Theme.LoadFromCssFile ("Themes/ocean.css");

// 或者按名称注册，并在运行时切换：
Theme.RegisterThemeCssFromFile ("Themes/ocean.css");   // 返回 "Ocean"，来自文件的 @theme 头部
Theme.ApplyTheme ("Ocean");
Theme.SetBuiltInTheme (BuiltInTheme.Light);            // 回到内置主题；重置一切

// 以当前主题为起点创建你自己的主题：
File.WriteAllText ("mine.css", Theme.ExportCss ("Mine", "Light"));
```

**VB.NET**

```vb
Imports Majorsilence.Forms

' 直接应用一个文件：
Theme.LoadFromCssFile("Themes/ocean.css")

' 或者按名称注册，并在运行时切换：
Theme.RegisterThemeCssFromFile("Themes/ocean.css")     ' 返回 "Ocean"，来自文件的 @theme 头部
Theme.ApplyTheme("Ocean")
Theme.SetBuiltInTheme(BuiltInTheme.Light)              ' 回到内置主题；重置一切

' 以当前主题为起点创建你自己的主题：
File.WriteAllText("mine.css", Theme.ExportCss("Mine", "Light"))
```

如果不想出现闪烁，请在第一个窗体显示之前加载主题；之后再应用会重绘所有已打开的内容。

### 一个例子讲完整个语言
{:#appendix-d-language}

三种语句——头部、令牌（token）和控件规则——此外再无其他：

```css
/* Ocean：一个深蓝绿色的深色主题。 */
@theme "Ocean" extends Dark;             /* 以内置主题（Light、Dark、Classic、Aero……）或任何已注册主题为起点 */

:root {
  --brand: #1e90ff;                      /* 你自己的变量，下面用 var() 引用 */

  --accent-color: var(--brand);          /* 令牌：每个 Theme 属性对应一个，kebab-case 命名 */
  --background-color: #0a1929;
  --control-mid-color: #102a43;
  --foreground-color: #cfe8ff;
  --foreground-color-on-accent: white;
  --font-size: 14px;                     /* 只接受整数像素——pt/em/rem/% 都是错误 */
  --ui-font: "Segoe UI", "Noto Sans", sans-serif;
}

/* 一条规则作用于一种控件类型——应用中每一个没有在代码里自行设置颜色的 Button。 */
Button        { border: 1px solid #15395c; border-radius: 4px; box-shadow: 2px 2px #06101c; }
Button:hover  { background-color: var(--brand); color: white; }
Button:active { box-shadow: 0px 0px #06101c; }

TextBox, ComboBox, NumericUpDown { background-color: #061120; border-color: var(--border-low-color); }

/* 部件（part）：控件在自身内部绘制的组成部分。 */
DataGridView::header    { background-color: #2c2c30; color: #e8e8ea; font-weight: bold; }
DataGridView::selection { background-color: var(--accent-color); color: var(--foreground-color-on-accent); }
ScrollBar::thumb        { background-color: #55555c; border-radius: 4px; }
Menu::item:hover        { background-color: #34343a; }
```

该告诉团队的几点，因为每一点都是 CSS 直觉会误导人的地方：

- **令牌优先。**只设置 `:root` 令牌就已经能给每个控件*和*每个部件重新上色；只在默认值不合你意的地方才添加控件规则。
- **选择器就是控件类型名**（`Button`、`TextBox`、`DataGridView`，以及每一个 Telerik 兼容控件）。没有 class、没有 id、没有后代选择器、没有 `*`——一条规则作用于该类型的每一个控件，无论它位于何处。要给*某一个*控件设置样式，请在代码中设置 `button.Style.BackgroundColor`（或 WinForms 的 `BackColor`）；**逐控件的显式值永远优先**，和 WinForms 完全一样。
- **四个伪类**（`:hover`、`:active`、`:disabled`、`:focus`），并且只对会为该状态重绘的控件有效——目前是 `Button`、`LinkLabel` 和 `TrackBar`。`TextBox:hover` 是一个带解释的错误，而不是静默的无效果。
- **没有层叠、没有优先级（specificity）、没有 `!important`。**后面的声明替换前面的。没有 `@import`、没有 `@media`——注册两个主题，然后在代码中选一个。
- **布局不可主题化。**颜色、边框、圆角（可按角分别设置）、虚线边框、硬偏移的 `box-shadow` 和字体可以；`margin`/`padding` 是错误——请在代码中设置。
- **十六进制颜色的 alpha 放在最后**（`#rrggbbaa`），与 XML 格式的 `#AARRGGBB` 正好相反。

### Theme Studio，以及让助手来写主题
{:#appendix-d-studio}

`samples/ThemeStudio`（在仓库中，GitHub 发行版附有预构建的二进制文件）是一个实时编辑器：左侧是 CSS，右侧是每一个可主题化的控件，下方是解析器的诊断信息，随着你的输入即时重新应用——包括应用到 Studio 自己的窗口上。打开一个文件后它会被**监视**，所以你可以在自己的编辑器里改它，或者让编程助手来改。它的 **Copy reference for AI** 按钮会把完整的令牌/选择器/属性参考放进剪贴板；把它粘贴到一段对话中，加上“一个温暖、高对比度、按钮带圆角的浅色主题”，再把回答粘贴回来。如果解析器有异议，把错误文本粘回给助手——每条消息都会指出有问题的文本和替代写法。`--render-headless out.png theme.css` 会在没有显示器的情况下渲染预览，并在出错时以非零退出码退出，这让主题文件成为 CI 可以检查的东西。`samples/ThemeStudio/Themes/` 中附带六个起点：`light`/`dark`（一对配套主题）、`ocean`、`graphite`、`paper`、`parchment`。

### 从代码获取诊断信息
{:#appendix-d-diagnostics}

对于用户提供的主题，请自己解析并把问题展示出来，而不是盲目应用：

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

### 一张样式表，三个工具包
{:#appendix-d-hosts}

在一个混合迁移的应用中，同一个文件还能给*另一半*重新设置样式：`Majorsilence.Forms.Theming.WinForms` 把它应用到真正的 `System.Windows.Forms` 控件上（[Module 7](#module-7-c)），`Majorsilence.Forms.Theming.Avalonia` 把它应用到原生的 Avalonia Fluent 控件上（`AvaloniaCssTheme.Apply` / `Watch`），两者各有一份文档化的支持矩阵，每个缺口都以诊断信息报告。这就是对漫长迁移期间“它看起来会像两个应用钉在一起”这一担忧的回答。

**练习 D。**导出 Light 主题（`Theme.ExportCss`），改三个令牌和一条 `Button` 规则，并在启动时加载它。然后故意写下 `TextBox:hover { color: red; }`，读一读解析器给你的错误——框架这个角落的全部哲学，就浓缩在那一条消息里。

---

## 附录 E — MVVM 辅助方法
{:#appendix-e}

**目标：**你能在不使用反射的情况下把视图模型接到窗体上，这种方式在裁剪和 NativeAOT 下是安全的，并且你知道什么时候*不该*用它。

迁移到共享 UI 库的 WinForms 团队常常借此机会把视图模型从窗体中分离出来。`Control.DataBindings` 在这里可用，而且是双向的——但它基于反射，这意味着你得为裁剪器把视图模型的属性标记为根。`Majorsilence.Forms.Mvvm` 是另一种选择：一小组基于 `INotifyPropertyChanged` 和 `ICommand` 的扩展方法，用 `nameof` 指明属性名，并通过 lambda 读写属性，因此运行时没有任何东西按字符串查找。它不依赖任何工具包，可与任何视图模型配合，包括用 CommunityToolkit.Mvvm 编写的视图模型。（对照 [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) 和控件库中的 `MvvmHelpersPanel` 核对过，但没有为本指南实际运行。）

### 四个辅助方法
{:#appendix-e-helpers}

**C#**

```csharp
using Majorsilence.Forms.Mvvm;

var scope = new BindingScope ();                        // 收集这个页面建立的每一个订阅

// 单向：立即应用，并在该属性每次 PropertyChanged 时再次应用。
viewModel.Observe (nameof (CounterViewModel.Count), vm => vm.Count,
                   count => countLabel.Text = $"Count: {count}").AddTo (scope);

// 双向：TextBox.Text <-> ProfileViewModel.Name（还有 BindChecked、BindSelectedIndex、BindValue）。
nameBox.BindText (viewModel, nameof (ProfileViewModel.Name),
                  vm => vm.Name, (vm, value) => vm.Name = value).AddTo (scope);

// 命令：Enabled 跟随 CanExecute；Click 运行命令。对任何控件都有效，包括自定义绘制的控件。
incrementButton.BindCommand (viewModel.IncrementCommand).AddTo (scope);

// 离开页面时：
scope.Dispose ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Mvvm

Dim scope As New BindingScope()                          ' 收集这个页面建立的每一个订阅

' 单向：立即应用，并在该属性每次 PropertyChanged 时再次应用。
viewModel.Observe(NameOf(CounterViewModel.Count), Function(vm) vm.Count,
                  Sub(count) countLabel.Text = $"Count: {count}").AddTo(scope)

' 双向：TextBox.Text <-> ProfileViewModel.Name（还有 BindChecked、BindSelectedIndex、BindValue）。
nameBox.BindText(viewModel, NameOf(ProfileViewModel.Name),
                 Function(vm) vm.Name, Sub(vm, value) vm.Name = value).AddTo(scope)

' 命令：Enabled 跟随 CanExecute；Click 运行命令。对任何控件都有效，包括自定义绘制的控件。
incrementButton.BindCommand(viewModel.IncrementCommand).AddTo(scope)

' 离开页面时：
scope.Dispose()
```

### 辅助方法保证什么——以及两条规则
{:#appendix-e-rules}

- **每次推送都落在 UI 线程上。**在工作线程上引发的 `PropertyChanged` 会通过调度器投递；在 UI 线程上引发的则立即应用，因此顺序得以保持。如果多个变更排了队，每次推送在运行时读取的是*当前*值，所以控件永远不会在显示了较新的值之后又显示较旧的值。
- **双向绑定不会动光标。**只有在值不同时才写入控件，并且在应用某一个方向的期间会忽略另一个方向，所以两边不会来回“乒乓”。需要知道的后果是：如果视图模型*改写*了它收到的值（去空格、转大写），文本框会保留用户输入的内容，直到视图模型自己引发一次变更。
- **当异步命令报告自己无法运行时，`BindCommand` 会禁用控件**——CommunityToolkit 的 `AsyncRelayCommand` 默认就会这样报告——无需额外代码。
- **规则 1：不要在同一个控件上同时使用 `BindCommand` 和 `Button.Command`。**两者都会运行命令，于是每次点击运行两次。二者只用其一。
- **规则 2：页面消失时释放 scope。**`BindingScope` 会释放它持有的一切，后加入的先释放，因此不会有视图把处理程序泄漏到比它活得更久的视图模型上。名称为 `null`/空的 `PropertyChanged` 表示“一切都变了”，会刷新每一个观察。

双向绑定目前覆盖四个控件：`TextBox`、`CheckBox`、`ComboBox`（选中索引）和 `NumericUpDown`（像控件自身一样钳制到其范围内）。其他任何控件——`TrackBar`、`DateTimePicker`、单选按钮组——都是一个方向用 `Observe`，另一个方向用控件自身的事件，或者使用 `DataBindings`。

### 不用 UI 线程测试接线
{:#appendix-e-testing}

这些辅助方法接受一个可选的 `IUiDispatcher`（`CheckAccess()` + `Post(Action)`）。默认实现会询问当前活动的后端你是否在 UI 线程上，并通过 `Application.RunOnUIThread` 投递。在测试中，传入一个报告“不在 UI 线程上”并把收到的内容排队的伪实现——这样你的测试就能*证明*一次后台变更被封送了，并在它想要的时机运行队列。这比任何基于反射的绑定所能让你写出的测试都更有力。

**练习 E。**从你的试点迁移中挑一个带手写视图模型接线（事件进、属性赋值出）的窗体，用 `BindingScope` 中的 `Observe`/`BindText`/`BindCommand` 替换它。数一数删掉了多少行；然后用一个伪调度器写一个测试，证明工作线程上的变更能到达标签。
