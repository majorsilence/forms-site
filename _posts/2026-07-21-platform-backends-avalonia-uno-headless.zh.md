---
title: "平台后端：Avalonia、Uno 与 Headless"
date: 2026-07-21 11:00:00 -0000
lang: zh
permalink: /zh/blog/2026/07/21/platform-backends-avalonia-uno-headless/
read_time: "5 分钟阅读"
excerpt: "Majorsilence.Forms 用 SkiaSharp 自行绘制每一个控件——底下的窗口工具包只是一个宿主。这里介绍这条接缝（seam）是如何工作的。"
description: >-
  跨平台 WinForms 如何在 Avalonia、Uno Platform 和无头（Headless）Skia 表面上运行：每个控件都用 SkiaSharp 绘制，
  底下的窗口工具包只是一个可替换的宿主。
---

Majorsilence.Forms 用 SkiaSharp **完成全部自己的绘制**。每个控件都绘制到一个 `SKSurface`/`SKCanvas` 上；
底下的窗口工具包只是一个*宿主*——它创建原生窗口、运行消息循环、传递输入，并把 Skia 表面呈现到屏幕上。
正是这种分离，让完全相同的一套控件今天能在三个差异极大的工具包上运行。

## 接缝
{:#the-seam}

两个接口定义了宿主必须提供的一切：

`IPlatformBackend` 负责应用级服务——调度器（`Post`/`Invoke`）、计时器、剪贴板、屏幕枚举以及模态循环。
`IWindowBackend` 负责单个原生窗口——尺寸和位置、显示/隐藏/关闭、光标、窗口装饰、文件对话框。输入和绘制
请求则沿*相反*方向流动：后端直接调用窗口的中立方法 `RenderFrame(SKCanvas, …)` 和 `Handle*`。
没有任何平台类型——没有 Avalonia 类型，也没有 WinUI 类型——会越过边界进入 Majorsilence.Forms 的核心代码。

## 今天的三个后端
{:#three-backends-today}

**`Majorsilence.Forms.Avalonia`** 是默认后端——基于 Avalonia 12，零配置即可支持 Windows、macOS 和 Linux
桌面。引用它，然后 `Application.Run(new MyForm())` 就能直接工作。它也不仅限于桌面：Avalonia 自带 Android、
iOS 和 Browser（WASM）目标，因此这同一个后端也是通往移动端和 Web 的第二条路径，与下文专门的 Uno 后端并行。

**`Majorsilence.Forms.Headless`** 是最简单的后端，同时也是编写新后端的参考模板：一个工作队列式消息循环、
一个内存剪贴板、一个虚拟屏幕，以及离屏渲染。它不需要显示器，因此单元测试套件就运行在它之上；它还能把
ControlGallery 示例直接渲染成 PNG，供 CI 做像素差异比对：

```
dotnet run --project samples/ControlGallery -- --render-headless out.png 1100 750 --select-row 0
```

**`Majorsilence.Forms.Uno`** 面向 Uno Platform 的 Skia 渲染器，宿主于一个 `SKXamlCanvas` 之中，覆盖桌面、
iOS、Android 和 WebAssembly。它已在 macOS 上端到端验证：Uno 宿主启动，后端创建窗口，ControlGallery 的完整
`MainForm` 渲染进画布。由于它需要交互式会话，它通过一个专门的应用头——
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno)——运行，而不是无头的 CI 构建。

有一个细节值得指出：Uno 没有以编程方式"开始拖动窗口"的 API，因此 Majorsilence.Forms 自绘窗口边框的
移动/调整大小改为以声明方式处理——一个无边框的 presenter 免费保留了操作系统的调整大小边距，而标题栏拖动
在 Windows 桌面头上借助 WinUI 的标题区域（caption-region）API 实现。在 macOS 上，则由原生窗口装饰接管
拖动/调整大小。

## 添加你自己的后端
{:#adding-your-own}

一个新后端只是另一个程序集：引用核心的 `Majorsilence.Forms` 和你的工具包，实现 `IPlatformBackend` 和
`IWindowBackend`，并仿照 Avalonia/Headless/Uno 三者的做法——在平台后端中驱动调度器，在窗口后端中呈现
Skia 表面并翻译输入。完整的接口清单请参阅[平台后端]({{ '/zh/backends/' | relative_url }})。
