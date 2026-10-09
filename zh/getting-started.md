---
layout: docs
lang: zh
title: 快速上手
subtitle: 几分钟内搭建你的第一个 Majorsilence.Forms 应用。
seo_title: "快速上手 — 构建一个跨平台 WinForms 应用"
description: >-
  用 dotnet 模板在几分钟内搭建一个跨平台 WinForms 应用，或者把 Majorsilence.Forms 加入
  一个普通的 .NET 项目。支持 Windows、macOS 和 Linux。
keywords:
  - WinForms 跨平台教程
  - Majorsilence.Forms 入门
  - dotnet new WinForms 跨平台
  - 跨平台 WinForms Hello World
  - WinForms Linux 入门
  - WinForms macOS 教程
permalink: /zh/getting-started/
priority: "0.8"
---

## 从模板开始
{:#from-a-template}

开始一个 Majorsilence.Forms 应用最简单的方式是 `dotnet` 模板，它以 `Majorsilence.Forms.Templates`
的名字发布在 NuGet 上。

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

这会搭建出一个**包含两个项目的解决方案**，并运行一个基本的 "Hello World" `MainForm`：

- `MajorsilenceFormsApp.Shared`——一个 UI 库，存放 `MainForm` 和 `MainForm.Designer.cs`。你所有的
  窗体都放在这里，下面的每个头项目（head）都共享它们。
- `MajorsilenceFormsApp`——桌面头项目：运行在 Avalonia 后端上的 `WinExe`，支持 Windows、macOS
  和 Linux。

`dotnet new majorsilenceforms -n MyApp`（可选 `-o <dir>`）会以指定名称搭建项目和命名空间。

### 移动端与浏览器头项目
{:#mobile-and-browser-heads}

通过开关为 Avalonia 的其他目标添加头项目——每一个都是建立在同一个共享 UI 库之上的薄薄一层：

```
dotnet new majorsilenceforms --IncludeAndroid --IncludeWasm --IncludeiOS
```

| 开关 | 添加 | 需要 |
|---|---|---|
| `--IncludeAndroid` | `MajorsilenceFormsApp.Android`（`net10.0-android`） | `dotnet workload install android` |
| `--IncludeWasm` | `MajorsilenceFormsApp.Wasm`（`net10.0-browser`） | `dotnet workload install wasm-tools`（用于 `publish`） |
| `--IncludeiOS` | `MajorsilenceFormsApp.iOS`（`net10.0-ios`） | 一台安装了 `dotnet workload install ios` 的 Mac |

所有开关默认关闭，因此直接 `dotnet new majorsilenceforms` 再 `dotnet build` 不需要任何额外的工作负载。
iOS 头项目仍是实验性的。`--msformsVersion` 和 `--avaloniaVersion` 可以覆盖脚手架锁定的包版本；
参见[模板 README]({{ site.github_url }}/blob/main/tools/Majorsilence.Forms.Templates/README.md)。

目前还没有独立的 API 文档，但对任何有 Windows Forms 经验的人来说，这套 API 表面应该都很熟悉。
最好的参考是示例应用的源代码：

- [`ControlGallery`]({{ site.github_url }}/tree/main/samples/ControlGallery)——每一个内置控件，实时运行。
- [`Explorer`]({{ site.github_url }}/tree/main/samples/Explorer)——一个 Windows Explorer 克隆。

完整列表以及每个示例的运行方法见[示例]({{ '/zh/samples/' | relative_url }})。

## 从零开始
{:#from-scratch}

要把一个普通的 .NET 控制台应用变成 Majorsilence.Forms 应用，做以下改动。

### 项目文件
{:#project-file}

```xml
<PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
</PropertyGroup>
```

添加对 `Majorsilence.Forms` 和一个后端的引用——核心包不引用任何窗口工具包，所以真正把窗口放到
屏幕上的是后端：

```xml
<ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
</ItemGroup>
```

核心包多目标支持 `net8.0`、`net10.0` 和 `netstandard2.0`。任何跨平台后端都不需要 `-windows` 后缀。

### 一个空窗体
{:#an-empty-form}

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}
```

### Program.cs
{:#programcs}

用你的窗体实例调用 `Application.Run()`：

```csharp
static void Main (string [] args)
{
    Application.Run (new MainForm ());
}
```

你的应用现在可以运行了——在默认的 Avalonia 后端上，也就是 Windows、macOS 和 Linux，无需任何
额外配置。

### 选择另一个后端
{:#selecting-another-backend}

Avalonia 是默认后端：当没有任何代码设置 `Platform.Backend` 时，只要引用了
`Majorsilence.Forms.Avalonia`，框架就会加载它。要让同一个窗体运行在不同的宿主上，改为引用那个后端的包，
并在 `Application.Run` 之前选择它：

```csharp
// GTK 4——真正的 Gtk.Window，Linux 优先（需要 GTK 4 运行时，例如 libgtk-4-1）
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();
Application.Run (new MainForm ());

// Terminal——窗体填满终端；Kitty 图形协议、Sixel 或 Unicode 块元素
Majorsilence.Forms.Terminal.TerminalApplication.Use ();
Application.Run (new MainForm ());

// Headless——用于测试和 CI 的离屏渲染
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();
```

在 Windows 上还有两个后端，用于迁移而非新应用：`Majorsilence.Forms.WinForms` 和
`Majorsilence.Forms.Wpf` 把 Majorsilence.Forms 控件托管在现有的 WinForms 或 WPF 应用内部
（`myControl.ToWinFormsControl()`、`myControl.ToWpfElement()`），包括 .NET Framework 4.8 上，
这样你可以逐个控件移植，等最后一块完成后再切换到 Avalonia 或 Uno。Uno Platform 通过它自己的
应用头项目运行。全部七个后端、各自能做什么和不能做什么、以及如何添加你自己的后端，见
[平台后端]({{ '/zh/backends/' | relative_url }})。

## 自绘控件以逻辑单位绘制
{:#custom-painted-controls-draw-in-logical-units}

控件的 `OnPaint` 和 `OnPaintBackground` 重写，以及它的 `Paint` 处理程序，都以**逻辑单位**绘制——
与框架中其他一切相同的单位：`Left`、`Top`、`Width`、`Height`、`ClientRectangle`、`ClientSize` 和
`MouseEventArgs.X`/`Y`。框架会把画布缩放到显示器，因此普通的 WinForms 绘图代码在 HiDPI 桌面或任何
手机上（Android 报告的 `Scaling` 大约为 2.6–2.75）尺寸都是正确的，无需改动：

```csharp
protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    e.Graphics.DrawRectangle (Pens.Gray, 0, 0, Width - 1, Height - 1);   // 给控件画边框
    e.Graphics.FillRectangle (Brushes.LimeGreen, 0, 0, 10, 10);         // 一个 10x10 的逻辑正方形
}
```

`e.ClipRectangle` 也是如此，如果你直接用 SkiaSharp 绘制，`e.Canvas` 同样如此。
`PaintEventArgs.Scaling` 仍然保留，供想把东西放到精确设备像素上的代码使用，`ScaledWidth`、
`ScaledBounds` 和 `LogicalToDeviceUnits` 也是。
控件库中的 [`GameOfLifePanel.cs`]({{ site.github_url }}/blob/main/samples/ControlGallery/Panels/GameOfLifePanel.cs)
是一个完整的自定义控件。

> **从 2026-10-01 之前的版本升级？** 绘图画布过去以设备像素为单位，自定义控件必须自己调用
> `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`。如果你加过这个调用，请删掉——否则绘图现在会被
> 缩放两次。所有者绘制事件（`DrawItem`、`DrawNode`、`CellPainting`）仍然交给你设备像素的边界。
> 用 `MF_HEADLESS_SCALE=2` 运行你的测试，以捕获任何漏网之鱼。

命中测试天然就是一致的：`MouseEventArgs.X`/`Y` 到达时与 `Width`/`Height` 和绘图画布使用相同的
逻辑单位，所以一次构建的几何图形两边都能用。

## 下一步去哪里
{:#where-to-go-next}

- **[培训指南]({{ '/zh/training/' | relative_url }})**——面向整个团队的结构化课程：心智模型、兼容性契约、
  迁移、后端、测试，以及配套的 CI 门禁和推广计划。
- **[平台后端]({{ '/zh/backends/' | relative_url }})**——宿主接缝（seam）、全部七个后端、在浏览器中运行、
  把 Majorsilence.Forms 嵌入现有的 Avalonia、Uno、GTK 4、WinForms 或 WPF 应用，以及触控手势。
- **[用 CSS 定制主题]({{ site.github_url }}/blob/main/docs/theming.md)**——可以重新设定每个控件样式的
  小型 CSS 子集、`Theme.LoadFromCssFile`，以及实时的
  [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) 示例。
- **[MVVM 辅助工具]({{ site.github_url }}/blob/main/docs/mvvm.md)**——来自 `Majorsilence.Forms.Mvvm` 的
  `Observe`、`BindText`、`BindCommand` 和 `BindingScope`：无反射、裁剪和 AOT 安全，并与
  CommunityToolkit.Mvvm 兼容。
- **[布局手机风格的屏幕]({{ site.github_url }}/blob/main/docs/mobile-layout.md)**——
  面向 Android 和 iOS 头项目的文本换行、`Card`、`RichListBox`、`StackPanel` 和 `NavigationHost`。
- **[动画]({{ site.github_url }}/blob/main/docs/animation.md)**——`RequestAnimationFrame`、
  补间与缓动，以及用于无头（Headless）测试的手动时钟。
- **[自动化与 UI 测试]({{ '/zh/automation/' | relative_url }})**——编写在 CI 中以无头方式运行的 UI 测试，
  通过 Selenium、FlaUI 或借助 MCP 服务器的 AI 助手驱动应用，并在 Windows 上启用屏幕阅读器。
- **[原生互操作]({{ '/zh/native-interop/' | relative_url }})**——托管原生内容（视频、地图、浏览器引擎），
  以及为什么 `Control.Handle` 不是 `HWND`。

## 迁移现有的 WinForms 应用
{:#migrating-an-existing-winforms-app}

是要搬迁一个现有的代码库，而不是从头开始？有两份文档涵盖这件事：

- **[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)**——`majorsilence-migrate` CLI
  （`dotnet tool install -g Majorsilence.Forms.Migrator`）如何把一个 WinForms 解决方案重写到
  Majorsilence.Forms 上，以及如何解读它的输出。
- **[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)**——在你的代码
  编译通过之后，哪些已完整实现、哪些是近似实现、哪些是有意不在范围内的。

> 测试版（beta）阶段：API 正在趋于稳定，但还没有覆盖 WinForms 的每一个角落。它很适合新的跨平台业务（LOB）
> 应用，也适合今天就迁移真实的应用——只需锁定版本。
