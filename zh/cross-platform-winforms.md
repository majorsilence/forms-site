---
layout: docs
lang: zh
title: 跨平台 WinForms
subtitle: 在 macOS 和 Linux 上运行 Windows Forms 代码意味着什么、要付出什么代价，以及 Majorsilence.Forms 是如何做到的。
permalink: /zh/cross-platform-winforms/
seo_title: "WinForms 跨平台 — 让 Windows Forms 运行在 macOS 和 Linux 上"
description: >-
  WinForms 兼容层如何让现有的 Windows Forms 应用在 macOS 和 Linux 上运行——架构原理、替换了哪些
  Windows 专有 API，以及要付出的代价。
keywords:
  - WinForms 跨平台
  - 跨平台 WinForms
  - WinForms 兼容层
  - Windows Forms 跨平台
  - WinForms Linux
  - WinForms Mac
  - WinForms 替代方案
  - .NET 跨平台桌面 GUI
  - System.Windows.Forms 跨平台
priority: "0.9"
changefreq: weekly
---

**Windows Forms 只能在 Windows 上运行，从一开始就是如此。** `System.Windows.Forms` 是 Win32 窗口类和
GDI+ 之上的托管封装——`HWND`、`WM_PAINT`、`user32.dll`。.NET 本身到处都能跑，但这个程序集只随
Windows Desktop 运行时发布，所以 WinForms 应用在 macOS 或 Linux 上根本无法构建，更无法启动。
这就是全部问题所在，也是为什么"让我们的 WinForms 应用跨平台"在过去一直等同于"重写它"。

Majorsilence.Forms 走的是另一条路：**在跨平台渲染器上重新实现 WinForms 编程模型。** 同样的类名、
同样的属性、同样的事件、同样的设计器生成代码——只是底层没有任何 Win32。

```csharp
using Majorsilence.Forms;   // 代替 System.Windows.Forms

public class MainForm : Form
{
    public MainForm ()
    {
        var button = new Button { Text = "Click me", Location = new Point (12, 12) };
        button.Click += (s, e) => MessageBox.Show ("Hello from Linux.");
        Controls.Add (button);
    }
}
```

这个文件只需一次 `net10.0`（或 `net8.0`）构建，就能在 Windows、macOS 和 Linux 上编译并运行。
没有 `-windows` TFM，没有 Windows Desktop 运行时，也没有 Wine。核心库还提供 `netstandard2.0`
构建，这也是 Windows 上的 .NET Framework 4.8 应用能够宿主它的原因。

## WinForms 兼容层到底是如何工作的
{:#how-a-winforms-compatibility-layer-actually-works}

把 WinForms 代码搬到另一个平台有三种做法，它们的表现大不相同：

| 做法 | 是什么 | 取舍 |
|---|---|---|
| **模拟**（Wine、Mono 旧版 `System.Windows.Forms`） | 在*未修改的* WinForms 程序集之下重新实现 Win32/GDI+ | 源码零改动，但你要背上庞大的 Win32 接口面、非原生的行为，而且一旦应用碰到尚未实现的部分，支持就到此为止 |
| **重写**（WPF、.NET MAUI、Avalonia、Web） | 用另一种范式重新表达 UI | 结果确实现代化，代价是重建每一个界面并重新培训团队 |
| **API 兼容的重新实现**（Majorsilence.Forms） | 在可移植渲染器上重建 WinForms 的 *API* | 源码级兼容，只需机械地更换命名空间；你放弃的是 `Control.Handle` 和 `WndProc` 这类 Win32 后门 |

Majorsilence.Forms 属于第三种。每个控件都由框架自己用
[SkiaSharp](https://github.com/mono/SkiaSharp) 绘制——也就是 Chrome 和 Flutter 背后那个 GPU 加速的
2D 引擎——所以一个 `Button` 在三个桌面平台上外观和行为完全一致，因为它在三个平台上运行的
就是同一份绘制代码。

## 一张图看懂架构
{:#the-architecture-in-one-diagram}

<div class="msf-diagram">        你的应用  （窗体、控件、设计器文件——你熟悉的 WinForms 模型）
            │
       Majorsilence.Forms  （控件 + 兼容 WinForms 的 API，用 SkiaSharp 绘制）
            │
   可切换的宿主后端
   ├─ Avalonia   → Windows · macOS · Linux  （默认）  · 也支持 Android · iOS · 浏览器
   ├─ Uno         → 桌面 · iOS · Android · WebAssembly
   ├─ GTK 4       → Linux 优先的真实 GTK 窗口（gir.core），安装 GTK 运行时后也可用于 Windows/macOS
   ├─ Terminal    → 在终端中绘制窗体（Kitty 图形、Sixel 或 Unicode 方块字符）
   ├─ WinForms    → 仅限 Windows 的迁移桥：嵌入现有 WinForms 应用，分步移植
   ├─ WPF         → 仅限 Windows 的迁移桥，形态相同，面向现有 WPF 应用
   └─ Headless    → 离屏渲染，用于测试 / CI</div>

核心程序集 `Majorsilence.Forms` **不引用任何窗口工具包**——只引用 SkiaSharp。后端的全部职责就是
创建一个原生窗口（或一个终端，或什么都不创建）、运行消息循环、传递输入，并呈现一个 Skia 表面。
正是这个接缝（seam）让同一个应用二进制文件今天可以在桌面上使用 Avalonia，明天就能切换到
GTK 4、Uno 或 WebAssembly——也让 Windows 应用可以在迁移期间，把完全相同的控件宿主在现有的
WinForms 或 WPF 窗口里。接口定义和如何添加自己的后端，见
[平台后端]({{ '/zh/backends/' | relative_url }})。

## 各平台能得到什么
{:#what-you-get-on-each-platform}

| 平台 | 状态 | 宿主 |
|---|---|---|
| Windows | 支持，开箱即用 | Avalonia（默认）、Uno，或安装 GTK 运行时后使用 GTK 4 |
| Windows，嵌入现有 WinForms 或 WPF 应用 | 支持——增量迁移，一次一个控件；也可从 **.NET Framework 4.8**（`net48`）宿主 | `Majorsilence.Forms.WinForms` / `Majorsilence.Forms.Wpf` |
| macOS（Intel 和 Apple Silicon） | 支持，开箱即用——见 [WinForms 在 macOS 上]({{ '/zh/winforms-on-macos/' | relative_url }}) | Avalonia（默认）、Uno，或通过 Homebrew 安装的 GTK 4 |
| Linux（X11 / Wayland） | 支持，开箱即用——见 [WinForms 在 Linux 上]({{ '/zh/winforms-on-linux/' | relative_url }}) | Avalonia（默认，X11）、GTK 4（原生 Wayland/X11，已在 Wayland 上验证）或 Uno |
| 终端 | 可用，尚年轻——已在 xterm 和 WezTerm 中验证 | `Majorsilence.Forms.Terminal`：窗体铺满终端，以 Kitty 图形、Sixel 或 Unicode 方块字符绘制 |
| WebAssembly / 浏览器 | 可用，尚年轻——[试试在线控件库]({{ '/gallery/' | relative_url }})；屏幕阅读器可看到 UI 的 ARIA DOM 镜像 | Avalonia Browser 或 Uno Wasm |
| Android | 早期——已完成首轮真机测试（在硬件上确认了启动、点击、渲染缩放和触摸滚动）；键盘、安全区域和旋转仅有单元测试 | Avalonia Android 或 Uno |
| iOS | 早期——CI 会编译真实的 iOS 头并在模拟器中做启动冒烟检查，但还没有人交互式地运行过 | Avalonia iOS 或 Uno |
| Headless / CI | 支持 | Headless 后端，离屏 Skia |

## 移植时必须替换的 Windows 专有 API
{:#the-windows-only-apis-a-port-has-to-replace}

让控件可移植只是一半。真实的 WinForms 应用还依赖其他只在 Windows 上存在的技术栈，这里对每一个
都给出了跨平台答案：

- **`System.Drawing.Common`（GDI+）** 自 .NET 7 起只支持 Windows。
  `Majorsilence.Forms.Drawing.Common` 是它基于 Skia 的重新实现——`Bitmap`、`Font`、`Pen`、`Brush`、
  `Icon`、`Region`、`StringFormat`、`Drawing2D`、`Imaging`，甚至 EMF/WMF 图元文件回放。值类型
  （`Color`、`Point`、`Size`、`Rectangle`）刻意*没有*重新实现；直接使用本来就可移植的
  `System.Drawing.Primitives` 真实类型，因此它们能与 .NET 中的其他一切互操作。
- **打印**通过 `Majorsilence.Forms.Printing.PrintDocument` 完成，它用同一条 Skia 管线渲染页面并
  生成 PDF，而不是与操作系统的打印驱动对话。这是有意设计的平台无关替代方案，不是尚未完成的
  各平台缺口。
- **视觉样式（uxtheme）。** WinForms 通过 `Application.EnableVisualStyles()` 向操作系统主题引擎借用外观；
  在这里该调用是空操作，外观来自框架自己的主题。主题就是普通的 CSS 文件——一个有文档说明的子集，
  包含颜色和字体的令牌以及针对每个控件的规则——所以一张样式表能让应用在每个操作系统上长得一模一样，
  而内置的 `Default` 主题会跟随操作系统的浅色/深色偏好。见
  [用 CSS 定制主题]({{ site.github_url }}/blob/main/docs/theming.md)。

## 代价是什么
{:#what-it-costs}

坦诚地说明取舍，比列一张功能清单更有用：

- **`Control.Handle` 是 `IntPtr.Zero`。** 这里的控件是画布上的绘制操作，不是操作系统窗口，所以没有
  `HWND` 可以交出去，框架也拒绝凭空造一个。窗口级别的句柄*是*真实的（`HWND`/`NSWindow`/`XID`，
  在 WinForms 后端上是真实的 HWND）。见[原生互操作]({{ '/zh/native-interop/' | relative_url }})。
- **没有 `WndProc`，不能对控件做 Win32 P/Invoke。** 基于消息的技巧必须改写为使用真实 API。
- **浏览器和手机上不存在阻塞式对话框。** 在浏览器、Android 和 iOS 目标上，宿主没有嵌套消息循环，
  所以 `Form.ShowDialog`、`MessageBox.Show` 和文件选择器会在显示任何内容之前抛出
  `PlatformNotSupportedException`，并指出对应的异步版本。`ShowDialogAsync`、`MessageBox.ShowAsync`
  及其同类在所有平台都可用，核心包中自带的 Roslyn 分析器（`MFB001`–`MFB003`，附代码修复）会在
  这些目标上标出阻塞调用。桌面应用可以继续使用阻塞调用。
- **坐标是逻辑单位，不是设备像素。** `Width`、`Bounds`、`ClientRectangle`、鼠标位置和绘制画布全部
  使用逻辑单位；框架负责按显示器缩放。过去自己按 DPI 系数做 `ScaleTransform` 的自绘控件必须去掉
  这一步；设备像素可通过 `ScaledBounds`、`PaintEventArgs.Scaling` 和 `LogicalToDeviceUnits` 获得。
- **覆盖率不是 100%。** 本项目处于测试版（beta）。尚未实现的成员会刻意做空操作或返回合理的默认值，
  而不是抛出异常，所以迁移后的代码既能编译*也能运行*——这也意味着缺口可能是无声的。
  [兼容性矩阵]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) 逐控件记录了哪些是真实实现、
  哪些是近似实现、哪些不在范围内。
- **与原生 WinForms 像素级一致不是目标。** 控件由 Skia 按主题绘制；它们追求跨平台一致，而不是
  匹配各操作系统的原生部件。有一个刻意的例外：如果移植后的应用像 WinForms 应用那样用
  `Application.SetDefaultFont` 选择字体，那么按钮以及复选/单选符号会按 WinForms 在 Windows 11
  主题下的画法绘制，这样并排迁移时看起来不会像两个产品。

## 接下来去哪里
{:#where-to-go-next}

- **[快速上手]({{ '/zh/getting-started/' | relative_url }})**——几分钟内跑起一个应用。
- **[迁移现有 WinForms 应用]({{ '/zh/migration/' | relative_url }})**——`majorsilence-migrate` CLI 替你完成
  机械性的改写。
- **[WinForms 替代方案对比]({{ '/zh/winforms-alternatives/' | relative_url }})**——它与 .NET MAUI、
  Avalonia、Uno Platform、Eto.Forms 和 Wine 有何不同。
- **[常见问题]({{ '/zh/faq/' | relative_url }})**——对最先冒出来的那些问题的简短回答。
