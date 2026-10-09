---
layout: docs
lang: zh
title: WinForms 在 macOS 上
subtitle: 在 Apple Silicon 和 Intel Mac 上运行 Windows Forms 代码库——哪些能用、哪些感觉不同，以及如何发布 .app。
permalink: /zh/winforms-on-macos/
seo_title: "WinForms 如何在 macOS 上运行 — 跨平台 Windows Forms"
description: >-
  Windows Forms 从未在 Mac 上运行过。Majorsilence.Forms 如何让你的 WinForms 应用在 Apple Silicon
  和 Intel Mac 上原生运行——以及如何发布 .app 包。
keywords:
  - WinForms Mac
  - WinForms macOS 运行
  - Windows Forms macOS
  - Mac 运行 WinForms
  - C# WinForms Mac
  - .NET Mac 桌面 GUI 框架
  - WinForms Apple Silicon
  - System.Windows.Forms macOS
  - WinForms 深色模式 Mac
priority: "0.9"
---

## 为什么原版 WinForms 做不到
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` 存在于 Windows Desktop 运行时中，封装的是 `user32.dll` 和 GDI+。它没有
macOS 版本，从来就没有——一个 `net10.0-windows` 项目在 Mac 上甚至无法构建。常见的变通办法也站不住脚：
Mono 的 WinForms 移植从未进入现代 .NET，`System.Drawing.Common` 自 .NET 7 起在非 Windows 平台上会抛出
`PlatformNotSupportedException`，而在 Windows 虚拟机或 CrossOver 里运行应用，意味着你交付的仍然是
一个 Windows 应用。

## Majorsilence.Forms 的做法
{:#what-majorsilenceforms-does-instead}

它在 SkiaSharp 上重新实现 WinForms API，并通过 Avalonia 把它宿主在一个真实的 `NSWindow` 中。一次普通的
`net10.0` 构建——没有 `-windows` TFM——就能产出一个在 **Apple Silicon（arm64）和 Intel（x64）** Mac 上
原生启动的应用。

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

模板会生成一个共享 UI 库加一个桌面头；同一份源码无需改动即可在 Windows 和 Linux 上构建。

## macOS 上实际能用什么
{:#what-actually-works-on-macos}

| 领域 | 在 macOS 上 |
|---|---|
| 窗口与输入 | 通过 Avalonia 后端得到原生 `NSWindow`，带有标准的 macOS 红绿灯窗口按钮和原生拖动/调整大小 |
| Apple Silicon | 原生 arm64——`osx-arm64` 和 `osx-x64` 都是常规的发布目标 |
| 渲染、Retina | SkiaSharp，GPU 加速且支持 HiDPI——与 Windows 和 Linux 相同的绘制代码 |
| 字体与文本 | 由 SkiaSharp 通过 CoreText 解析，并内置一套后备字体以应对任何缺失 |
| GDI+ / `System.Drawing` 代码 | 由 `Majorsilence.Forms.Drawing` 替代——`Bitmap`、`Font`、`Pen`、`Brush`、`Region`、`Drawing2D`、`Imaging`、EMF/WMF 回放 |
| 通用对话框 | 通过后端得到原生的打开/保存/文件夹/颜色/字体对话框 |
| 打印 | `PrintDocument` 通过 Skia 渲染为 PDF，在每个操作系统上完全一致 |
| WebView 控件 | 真实的 `WKWebView`，包括内联 PDF 渲染 |
| 声音 | 通过 `afplay` 播放 |
| 安全存储与语音 | `Majorsilence.Forms.Essentials`：`SecureStorage` 写入 Keychain Services，`Speech` 使用系统的 `say` 语音；两者都会报告 `IsSupported`，不可用时降级为空操作而不是抛出异常 |
| 主题与深色模式 | 主题是 CSS 文件（一个有文档说明的子集）；`BuiltInTheme.Default` 跟随操作系统的浅色/深色外观，`Theme.SetBuiltInTheme`/`Theme.ApplyTheme` 可在运行时切换。[Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) 示例是一个带预览的实时 CSS 编辑器，预编译的二进制文件附在 GitHub Releases 上 |
| 触控板手势 | `Pinch`、`Swipe`、`LongPress` 和带惯性的 `ScrollGesture` 都是一等事件；`ScrollableControl` 已经应用了它们，所以 `Panel`/`ListBox`/`TreeView` 无需改动应用即可平移 |
| 原生窗口句柄 | 通过 `WindowBase.PlatformHandle` 得到真实的 `NSWindow` 指针（*控件*级别的句柄在所有平台都是 `IntPtr.Zero`——见[原生互操作]({{ '/zh/native-interop/' | relative_url }})） |
| Uno 后端 | 同样支持，并已在 macOS 上验证可启动并渲染完整窗体，如果你更愿意宿主在 Uno 中 |
| GTK 4 后端 | 使用 Homebrew 安装的 GTK 运行时（`brew install gtk4`）即可在 macOS 上编译运行——这是一个 Linux 优先的后端，所以你得到的是 GTK 窗口而不是 AppKit 窗口；主要用于在 Mac 上测试 GTK 头 |

## 哪些地方会感觉不像 Mac
{:#where-it-will-feel-un-mac-like}

值得在设计评审前了解，因为这些是兼容模型带来的必然结果，而不是 bug：

- **菜单栏在窗口里。**`MenuStrip` 是窗体内部一条真实的顶部停靠栏，就像 WinForms 画的那样——它不会
  投射到屏幕顶部的 macOS 全局菜单栏上。
- **控件是绘制出来的，不是原生的。**一个 `Button` 是由框架设置主题的 Skia 绘制代码，所以它匹配的是你
  在 Windows 和 Linux 上的应用，而不是 AppKit。跨平台一致性和各平台原生外观是真正对立的目标；本项目
  选择前者。CSS 主题能让你接近 Mac 的配色和排版，但那仍然是你的主题，不是 AppKit 的。
- **Windows 的约定会随代码一起过来。**键盘快捷键、对话框按钮顺序和窗口关闭语义都来自你现有的
  WinForms 设计。把它们改成 macOS 习惯是应用层面的工作。
- **没有 UI 自动化桥。**屏幕阅读器支持（`Majorsilence.Forms.WindowsUIAutomation`）今天只有 Windows 版；
  `NSAccessibility` 桥在路线图上，尚未接入。与后端无关的[自动化树]({{ '/zh/automation/' | relative_url }})
  仍能在 macOS 上驱动测试、Selenium 和 MCP 服务器。

## 发布 `.app`
{:#shipping-a-app}

打包方式与任何 Avalonia 或 .NET 桌面应用相同——框架不增加任何额外步骤：

```bash
dotnet publish -c Release -r osx-arm64 --self-contained
```

之后就是标准的 macOS 例行工作：把发布输出包装成 `YourApp.app/Contents/MacOS` 的 bundle 目录结构，
加上 `Info.plist` 和 `.icns`，然后用 `codesign` 签名；如果在 App Store 之外分发，还要到 Apple 做公证。
要构建通用二进制，分别发布 `osx-arm64` 和 `osx-x64`，再用 `lipo` 合并。

## 已在 macOS 上验证
{:#verified-on-macos}

[`Explorer`]({{ '/zh/samples/' | relative_url }}) 示例和完整的控件库都能在 macOS 上运行，控件库的
Uno 头也已在那里验证过：

![Explorer 示例在 macOS 上运行]({{ '/assets/img/explorer-macos.png' | relative_url }})

## 下一步
{:#next}

- [快速上手]({{ '/zh/getting-started/' | relative_url }})——第一个应用，从模板或从零开始。
- [迁移现有 WinForms 应用]({{ '/zh/migration/' | relative_url }})——自动化改写。
- [WinForms 在 Linux 上]({{ '/zh/winforms-on-linux/' | relative_url }})——Ubuntu、Fedora 和 Debian 上的
  同一个故事。
- [跨平台 WinForms]({{ '/zh/cross-platform-winforms/' | relative_url }})——架构及其取舍。
