---
layout: docs
lang: zh
title: WinForms 替代方案对比
subtitle: Majorsilence.Forms 与 .NET MAUI、Avalonia、Uno Platform、Eto.Forms、WPF 和 Wine 的对比——每一种方案对现有 WinForms 代码库到底要求什么。
permalink: /zh/winforms-alternatives/
seo_title: "WinForms 替代方案对比 — MAUI、Avalonia、Uno 等"
description: >-
  面向 WinForms 代码库的坦诚对比：.NET MAUI、Avalonia、Uno Platform、Eto.Forms、WPF 和 Wine——
  以及哪些方案会迫使你彻底重写 UI。
keywords:
  - WinForms 替代方案
  - WinForms 替代品
  - Windows Forms 替代
  - MAUI Avalonia Uno 对比
  - WinForms vs Avalonia
  - WinForms 迁移 MAUI
  - .NET 跨平台 UI 框架
  - WinForms 增量迁移
  - WinForms GTK
priority: "0.9"
---

如果你手上有一个能正常运行的 WinForms 应用，并且需要让它跑在 macOS 或 Linux 上，真正的问题
不是"哪个 UI 框架最好"，而是**"我现有的代码能留下多少？"**下面每一个选项都是好框架。只是
它们要求你付出的代码库比例差别极大。

## 一句话版本
{:#the-short-version}

| 选项 | UI 范式 | Linux | macOS | 移动 / Web | 你现有的 WinForms 代码会怎样 |
|---|---|---|---|---|---|
| **Majorsilence.Forms** | WinForms（`Form`、控件、事件、设计器文件） | 是（Avalonia 或 GTK 4） | 是 | 浏览器（尚年轻）、Android 和 iOS（早期）；还有终端 | **保留。**更换命名空间 + 一个兼容层；迁移工具自动完成机械性部分。在 Windows 上还可以在现有 WinForms 或 WPF 应用内部一次一个控件地采用，包括 .NET Framework 4.8 |
| **Avalonia** | XAML + MVVM | 是 | 是 | 是 | 重写为 XAML 视图和视图模型 |
| **Uno Platform** | WinUI XAML + MVVM | 是 | 是 | 是 | 重写为 WinUI XAML |
| **.NET MAUI** | XAML + MVVM | 无官方支持 | 是（Mac Catalyst） | 是 | 重写，并针对移动优先的控件集重新界定范围 |
| **Eto.Forms** | 自有的窗体风格 .NET API，每个操作系统使用原生部件 | 是 | 是 | 否 | 按 Eto 的 API 重写——形态相似，但与 WinForms 不是源码兼容 |
| **WPF** | XAML + MVVM | 否 | 否 | 否 | 重写，而且仍然只支持 Windows |
| **Wine** | 无——直接运行 Windows 二进制 | 是 | 是 | 否 | 原样不动，但你交付的是一个模拟运行的 Windows 应用，而不是原生应用 |

## Majorsilence.Forms 本身就*构建在*其中几个之上
{:#majorsilenceforms-is-built-on-several-of-these}

值得明说，因为这是一个常见的误读：Majorsilence.Forms 并不与 Avalonia、Uno Platform 或 GTK 竞争。
它**使用**它们。每个控件都由 Majorsilence.Forms 自己用 SkiaSharp 绘制，而底下的宿主——默认是
Avalonia，也可以是 Uno，或通过 gir.core 得到的真实 GTK 4 窗口——负责创建窗口、运行消息循环并
呈现 Skia 表面。在 Windows 上，同样的控件也可以改由真实的 `System.Windows.Forms` 或 WPF 窗口宿主，
这正是增量、原地迁移得以成立的原因。见[平台后端]({{ '/zh/backends/' | relative_url }})。

所以选择题不是"Majorsilence.Forms 还是 Avalonia"。而是：*你是直接写 Avalonia 的 XAML，还是继续写
WinForms，让 Avalonia（或 GTK 4、或 Uno）充当底层管道？*

## 逐一分析
{:#option-by-option}

### .NET MAUI
{:#net-maui}

微软官方的 Xamarin.Forms 跨平台继任者，也是大多数搜索结果会给你的答案。对于**全新的**移动加
桌面应用，它是一个有力的选择。

但对现有的 WinForms 业务（LOB）应用来说，它通常是最难走的路：没有官方的 Linux 支持，控件集是
移动优先的（没有 `DataGridView` 的对应物，窗口和对话框模型也不同），每个界面都要用 XAML 重建，
还要加一层你的 WinForms 代码几乎肯定没有的视图模型。`*.Designer.cs` 文件没有任何有意义的复用。

### Avalonia
{:#avalonia}

成熟、真正跨平台的 XAML 框架——桌面、移动和 WebAssembly——Linux 支持出色，使用 Skia 渲染器。
如果你想要一套现代的 XAML 技术栈，并且准备好重写 UI 层，这是最有力的通用答案，也是
Majorsilence.Forms 默认运行其上的宿主。

注意 Avalonia 的商业产品 **XPF** 是面向 *WPF* 的兼容层，不是 WinForms；它对
`System.Windows.Forms` 代码库没有帮助。

### Uno Platform
{:#uno-platform}

在桌面、移动和 WebAssembly 上实现 WinUI/UWP XAML API，覆盖面极广，工具链强大。决策形态与
Avalonia 相同：极好的目标，但要从 WinForms 彻底重写 UI。如果你的组织已经在 Uno 上有投入，它也
可作为 Majorsilence.Forms 的后端使用。

### Eto.Forms
{:#etoforms}

本项目之外、精神上最接近的方案：一个跨平台 .NET UI 库，提供窗体加控件的 API 而不是 XAML，绑定到
每个平台的*原生*部件（Windows 上是 WinForms，macOS 上是 Cocoa，Linux 上是 GTK）。各操作系统上的
原生外观是实打实的优势。

但它的 API 是自成一体的——`Eto.Forms.Form` 不是 `System.Windows.Forms.Form`，布局基于容器而不是
坐标/锚点，现有的设计器文件也没有迁移路径。你是在用一种熟悉的习惯用法重写。即便
Majorsilence.Forms 现在有了自己的 GTK 4 后端，这个对比依然成立：Eto 把它的控件映射到 GTK 部件上，
而 Majorsilence.Forms 只把 GTK 窗口和输入循环当作宿主，继续自己绘制 WinForms 形态的控件。

### Mono 的 `System.Windows.Forms`
{:#monos-systemwindowsforms}

Mono 确实发布过一个 WinForms 重新实现，这就是旧论坛帖子里"WinForms 能在 Linux 上跑"的由来。
它面向的是 .NET Framework 时代，从未被带入现代 .NET，今天已不是新移植项目可行的目标。

### Wine
{:#wine}

Wine 在 Linux 和 macOS 上运行你未经修改的 Windows 二进制文件。代码一行不改，这确实很有吸引力——
直到你需要为它提供支持：你交付的是一个 Windows 应用外加一个兼容运行时，Wine 对 Win32/GDI+ 的覆盖
程度如何你就得照单全收，与宿主操作系统的集成是近似的，安装程序和更新也会变得复杂。它是部署层面的
权宜之计，不是平台战略。

### 留在 WPF
{:#staying-on-wpf}

WPF 是一个优秀的框架，从 WinForms 过去在概念上只是一小步，但它只支持 Windows。它解决的是
"让 UI 现代化"；解决不了"在 macOS 和 Linux 上运行"。（如果你已经有一个 WPF 外壳，想在其中放入
跨平台界面，Majorsilence.Forms 正好有一个 WPF 宿主后端——但 WPF 外壳本身仍留在 Windows 上。）

## 什么时候 Majorsilence.Forms 是正确答案
{:#when-majorsilenceforms-is-the-right-answer}

- 你有一个规模可观的 WinForms 代码库——尤其是拥有大量窗体的业务（LOB）应用——业务逻辑和用户
  体验是资产，重写风险才是问题。
- 你团队的技能在 WinForms，一轮 XAML/MVVM 再培训是实实在在的成本。
- 你需要用一套代码覆盖 Windows、macOS 和 Linux，浏览器和移动端留作后续选项。
- 你不能停下一切来做移植。`Majorsilence.Forms.WinForms` 和 `.Wpf` 后端把跨平台控件宿主在你*现有的*
  Windows 应用里，一次一个控件或一个窗体——而且它们以 `net48` 为目标，所以在你迁移到现代 .NET
  之前，就能从 .NET Framework 4.8 应用开始。同一份 CSS 主题还能为移植控件旁边的真实 WinForms 控件
  重新设置样式（`Majorsilence.Forms.Theming.WinForms`），让混合应用看起来像一个应用。
- 你能接受一个测试版（beta）兼容层，并锁定版本。

## 什么时候不是
{:#when-it-isnt}

- **全新项目，没有 WinForms 代码，也没有 WinForms 团队。**直接写 Avalonia 或 Uno；你会得到一套成熟的
  XAML 技术栈，中间没有兼容层。
- **移动优先。**MAUI、Avalonia 或 Uno 今天就能像样地支持手机。Majorsilence.Forms 的 Android 支持只做过
  首轮真机测试，iOS 只有 CI 模拟器冒烟检查——两者都处于早期——而且按坐标摆放的桌面窗体本来就不是
  好的手机 UI，即便框架现在提供了手机风格的 `StackPanel`/`Card`/`NavigationHost` 控件。
- **你的应用深陷 Win32。**大量 `WndProc`、`Control.Handle` P/Invoke 或自定义 Win32 控件，在任何一种移植
  方案中——包括这一种——都无法不费工夫地存活下来。
- **你需要与 Windows 上的原生 WinForms 像素级一致。**控件由 Skia 绘制、由 CSS 设置主题，追求跨平台
  一致，而不是匹配各操作系统的原生部件。（移植后的应用一旦设置了字体，按钮和复选/单选符号确实
  会呈现 Windows 11 风格的外观，但那是对混合应用的一种照顾，不是一致性保证。）

## 下一步
{:#next}

- [跨平台 WinForms]({{ '/zh/cross-platform-winforms/' | relative_url }})——兼容层如何工作，代价是什么。
- [迁移现有 WinForms 应用]({{ '/zh/migration/' | relative_url }})——自动化改写。
- [兼容性矩阵]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)——逐控件的覆盖情况，在你下决心之前先看看。
