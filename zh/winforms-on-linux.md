---
layout: docs
lang: zh
title: WinForms 在 Linux 上
subtitle: 在 Ubuntu、Fedora、Debian 等发行版上运行 Windows Forms 代码库——哪些能用、要注意什么、如何发布。
permalink: /zh/winforms-on-linux/
seo_title: "WinForms 如何在 Linux 上运行 — 跨平台 Windows Forms"
description: >-
  Windows Forms 无法在 Linux 上运行，Mono 的移植也早已消失。Majorsilence.Forms 如何在 Ubuntu、
  Fedora 和 Debian 上原生构建并运行你的 WinForms 应用——在 Avalonia 窗口、真实的 GTK 4 窗口，
  或终端里。
keywords:
  - WinForms Linux
  - WinForms Linux 运行
  - Windows Forms Linux
  - Ubuntu 运行 WinForms
  - C# WinForms Linux
  - .NET Linux 桌面 GUI
  - System.Windows.Forms Linux
  - WinForms Mono Linux
  - WinForms GTK
  - WinForms Wayland
priority: "0.9"
---

## 为什么原版 WinForms 做不到
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` 只随 **Windows Desktop** 运行时发布。在 Linux 上没有
`Microsoft.WindowsDesktop.App` 共享框架可供解析，所以一个 `net10.0-windows` 项目不只是运行失败——
`dotnet build` 直接拒绝构建。这个程序集是 `user32.dll` 和 GDI+ 之上的封装，而两者在这里都不存在。

人们通常会尝试的三件事：

- **Mono 的 `System.Windows.Forms`。**一个真正的重新实现，也是旧论坛帖子说"这能行"的原因。它是为
  .NET Framework 时代构建的，从未被带入现代 .NET，今天已不是你能采用的目标。
- **Wine。**运行 Windows 二进制文件，而不是移植它。作为权宜之计可行；但这意味着交付一个 Windows
  可执行文件外加一个兼容运行时，与宿主系统的集成只是近似的。
- **Linux 上的 `System.Drawing.Common`。**即使是非 UI 的绘图代码，这条路也走不通了：自 .NET 7 起，
  它在非 Windows 平台上会抛出 `PlatformNotSupportedException`，除非设置一个现已移除的兼容开关。

## Majorsilence.Forms 的做法
{:#what-majorsilenceforms-does-instead}

它在 SkiaSharp 之上重新实现 WinForms API，并把它宿主在后端提供的窗口中。在 Linux 上你有三种宿主
可选，全部使用同一份应用代码：

- **Avalonia**（默认）——一个普通的 X11 应用：在你的窗口管理器中是一个真实窗口，有真实输入，
  可用时有 GPU 合成。在 Wayland 会话中通过 XWayland 运行。
- **GTK 4**（`Majorsilence.Forms.Gtk4`）——通过 [gir.core](https://github.com/gircore/gir.core)
  绑定得到的真实 `Gtk.Window`，原生支持 Wayland 和 X11。需要显式选择；详情见[下文](#gtk4)。
- **Terminal**（`Majorsilence.Forms.Terminal`）——在终端模拟器中绘制窗体，不需要显示服务器；
  详情见[下文](#terminal)。

无论选哪一种，它都是普通的 `net10.0`（或 `net8.0`）构建，任何地方都没有 `-windows` 后缀。

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

在一台装好 .NET SDK 的普通 Ubuntu 机器上，这就是全部的设置步骤。模板会生成一个共享 UI 库加一个
使用 Avalonia 后端的桌面头；同一份源码无需改动即可在 Windows 和 macOS 上构建运行。

## Linux 上实际能用什么
{:#what-actually-works-on-linux}

| 领域 | 在 Linux 上 |
|---|---|
| 窗口、输入、HiDPI | 原生。Avalonia 后端使用 X11（Wayland 会话中为 XWayland）。GTK 4 后端是原生 Wayland/X11——已在 Wayland 上验证——但使用 GTK 的整数缩放因子，所以目前 1.25×/1.5× 的显示器会按 1× 渲染，再由合成器放大 |
| 渲染 | SkiaSharp，GPU 加速——与 Windows 和 macOS 相同的绘制代码，所以控件外观完全一致 |
| 字体与文本 | SkiaSharp 通过 fontconfig 解析系统字体；`Majorsilence.Forms.Drawing.Common` 还内置了一套后备字体，所以即使在没有安装任何字体的精简镜像上，文本也能渲染 |
| GDI+ / `System.Drawing` 代码 | 由 `Majorsilence.Forms.Drawing` 替代——`Bitmap`、`Font`、`Pen`、`Brush`、`Region`、`Drawing2D`、`Imaging`，以及 EMF/WMF 回放 |
| 通用对话框 | `OpenFileDialog`、`SaveFileDialog`、`FolderBrowserDialog`、`ColorDialog`、`FontDialog` 通过 Avalonia 后端的原生对话框工作。在 GTK 4 上原生文件选择器尚未接入，因此会改为显示框架自己的后备对话框 |
| 打印 | `PrintDocument` 通过 Skia 渲染为 PDF，而不是输出到打印驱动——在每个操作系统上都一样 |
| WebView 控件 | 两个桌面后端上都是真实的 WebKitGTK——Avalonia 上通过 `Avalonia.Controls.WebView`，GTK 4 上直接使用 WebKitGTK 6.0（必须安装 `libwebkitgtk-6.0`；`IsWebViewFunctional` 会告诉你） |
| 声音 | 通过系统工具（`paplay`/`aplay`）播放 |
| 安全存储与语音 | `Majorsilence.Forms.Essentials`：`SecureStorage` 通过 `secret-tool` 使用 Secret Service（缺少密钥环守护进程或 `libsecret-tools` 时 `IsSupported` 为 false，绝不会回退到明文）；`Speech` 使用 `espeak`/`espeak-ng` |
| 主题 | CSS 主题文件在这里和在其他地方一样工作；`BuiltInTheme.Default` 跟随操作系统的浅色/深色偏好 |
| 原生窗口句柄 | Avalonia 上通过 `WindowBase.PlatformHandle` 得到真实的 X11 `XID`（*控件*级别的句柄在所有平台都是 `IntPtr.Zero`——见[原生互操作]({{ '/zh/native-interop/' | relative_url }})）。在 GTK 4 上，`NativeControlHost` 可以把真实的 `Gtk.Widget` 叠放在你的窗体内，没有空域（airspace）问题，因为 GTK 4 把所有内容合成到同一棵渲染树中 |
| UI 自动化 / 屏幕阅读器 | 仍然只支持 Windows（`Majorsilence.Forms.WindowsUIAutomation`）；AT-SPI 桥在路线图上，尚未接入。浏览器构建确实会向屏幕阅读器暴露 ARIA DOM 镜像。与后端无关的[自动化树]({{ '/zh/automation/' | relative_url }})无论如何都能在 Linux 上驱动测试、Selenium 和 MCP 服务器 |
| `Majorsilence.Forms.WindowsFormsInterop`、`.WinForms`、`.Wpf` | 从定义上就只支持 Windows——它们宿主真实的 `System.Windows.Forms`/WPF 窗口，而这些在这里并不存在 |

## GTK 4 后端
{:#gtk4}

如果你想要一个真实的 GTK 窗口而不是 Avalonia 窗口——为了 GNOME 桌面、为了原生 Wayland，或者因为
你已经有一个 `Gtk.Application` 需要嵌入——引用 GTK 4 后端，并在 `Application.Run` 之前选择它：

```bash
dotnet add package Majorsilence.Forms
dotnet add package Majorsilence.Forms.Gtk4
```

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // 安装 GTK 4 后端（否则默认是 Avalonia）
Application.Run (new MainForm ());      // GLib 主循环
```

机器上需要安装 GTK 4 本身：Debian/Ubuntu 上是 `libgtk-4-1`，Fedora/Arch 上是 `gtk4`。如果要用
`WebBrowser` 和基于 webview 的兼容控件，还要加上 WebKitGTK 6.0（Debian/Ubuntu 上是
`libwebkitgtk-6.0-4`，Fedora 上是 `webkitgtk6.0`，Arch 上是 `webkitgtk`）。嵌入是双向的——
`myControl.ToGtkWidget ()` / `myForm.ToGtkWindow ()` 把 Majorsilence.Forms 的内容放进现有 GTK 应用，
而 `ShowDialog` 会得到一个真正的 transient-for 模态窗口。

已知限制，大多源自 GTK 4 移除的 API，而非待完成的工作：`Form.Location` 只是一个提示，窗口管理器
可以忽略（GTK 4 取消了客户端定位），`SetIcon(byte[])` 是空操作（GTK 4 的图标是主题名称），文件
选择器回退到框架自己的对话框，缩放只支持整数倍，而且该后端尚未做 AOT 分析。完整列表见
[GTK 4 后端文档]({{ site.github_url }}/blob/main/docs/backends.md#the-gtk-4-backend)。

## Terminal 后端
{:#terminal}

`Majorsilence.Forms.Terminal` 让同一个窗体运行在终端模拟器里——凡是有终端的地方都行，包括
tmux/screen 或 SSH 会话，不需要显示服务器。窗体由正常的 Skia 管线渲染，在支持的终端里以 Kitty
图形或 Sixel 按终端的真实像素分辨率显示，在其他任何地方则以 Unicode 方块字符（每个单元格
2×4 个子像素）显示；模式和 24 位色通过查询终端自动发现，`MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel`
可以固定为某一种。鼠标和键盘都能用，终端提供时会使用 Kitty 键盘协议，Ctrl+C 始终退出。

它是一个单视图宿主，像手机一样：窗体铺满终端，没有标题栏。已在 xterm 和 WezTerm 中验证；
kitty、Ghostty、foot、iTerm2 和 Windows Terminal 尚未测试。原生文件选择器、`NativeControlHost`
和 Web 视图在终端里没有对应物。见 `samples/Gallery.Terminal` 和
[Terminal README]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Terminal/README.md)。

## 部署说明
{:#deployment-notes}

没有什么特别的——它就是一个普通的 .NET 应用：

```bash
dotnet publish -c Release -r linux-x64 --self-contained
```

三件值得知道的事：

- **原生 Skia 二进制。**`SkiaSharp.NativeAssets.Linux` 携带 `libSkiaSharp.so`，它链接到 fontconfig。
  桌面发行版已经自带；精简的容器镜像通常需要显式添加 `libfontconfig1`（Debian/Ubuntu）或
  `fontconfig`（Fedora/Alpine）。
- **GTK 运行时（仅 GTK 4 后端）。**你的安装程序或软件包必须依赖 `libgtk-4-1`（Debian/Ubuntu）或
  `gtk4`（Fedora/Arch），如果使用 `WebBrowser` 还要加上 `libwebkitgtk-6.0-4`/`webkitgtk6.0`。
  Avalonia 后端没有这类依赖。
- **无头（Headless）环境。**对于没有显示器的 CI、服务器和容器，引用 `Majorsilence.Forms.Headless`
  代替桌面后端并做离屏渲染——不需要 Xvfb，不需要显示服务器。本项目自己的测试套件就是这样运行的。
  见[自动化与 UI 测试]({{ '/zh/automation/' | relative_url }})。

## 已在 Linux 上验证
{:#verified-on-linux}

[`Explorer`]({{ '/zh/samples/' | relative_url }}) 示例——一个 Windows 资源管理器克隆——可在 Ubuntu 上
运行，完整的[控件库]({{ '/zh/samples/' | relative_url }})可在那里的 Avalonia 后端上运行，`Gallery.Gtk4`
已在 Wayland 上验证了渲染、处理输入和加载 WebKitGTK，`Gallery.Terminal` 已在 xterm 和 WezTerm
中运行过：

![Explorer 示例在 Ubuntu 上运行]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

## 下一步
{:#next}

- [快速上手]({{ '/zh/getting-started/' | relative_url }})——第一个应用，从模板或从零开始。
- [迁移现有 WinForms 应用]({{ '/zh/migration/' | relative_url }})——自动化改写，包括去掉 `-windows` TFM
  和 `System.Drawing.Common` 引用。
- [平台后端]({{ '/zh/backends/' | relative_url }})——Avalonia、GTK 4、Terminal 及其他。
- [WinForms 在 macOS 上]({{ '/zh/winforms-on-macos/' | relative_url }})——Apple 硬件上的同一个故事。
- [跨平台 WinForms]({{ '/zh/cross-platform-winforms/' | relative_url }})——架构及其取舍。
