---
title: "Majorsilence.Forms 简介"
date: 2026-07-21 15:00:00 -0000
lang: zh
permalink: /zh/blog/2026/07/21/introducing-majorsilence-forms/
read_time: "4 分钟阅读"
excerpt: "一个 WinForms 风格的 UI 框架，用于把传统和现代的 WinForms 应用迁移到跨平台技术栈上——无需重写。"
description: >-
  介绍 Majorsilence.Forms：一个面向 .NET 的开源跨平台 WinForms 库。保留你的窗体（Form）、控件和设计器文件，
  让同一个应用在 Windows、macOS 和 Linux 上运行，无需重写。
---

要把一个 WinForms 应用从仅限 Windows 的桌面环境中迁出，传统做法意味着从头重写：XAML、被迫改成 MVVM 结构，
或者转向 Web。这样做成本高、风险大，而且会丢掉多年积累下来、运转良好的业务逻辑和用户体验——而这套代码
往往只是需要换一层新外观而已。

**Majorsilence.Forms** 采取了不同的思路：它镜像 WinForms 的 API 表面——`Form`、控件、事件处理程序，
甚至 `*.Designer.cs` 代码隐藏文件——并提供一个兼容层，让现有的窗体和控件以小得多的改动迁移过来。
编程模型不变；改变的只是它运行的地方。

## 它是如何构建的
{:#how-its-built}

每个控件都通过 [SkiaSharp](https://github.com/mono/SkiaSharp) 绘制到一个 `SKSurface` 上，
下面是一个可替换的宿主后端：

- **Avalonia**（默认）——开箱即用地支持 Windows、macOS、Linux 桌面，并自带 Android、iOS 和
  Browser（WebAssembly）目标，因此也是通往移动端和 Web 的一条路径。
- **Uno Platform**——覆盖面最广：桌面、iOS、Android 和 WebAssembly。
- **Headless**（无头）——不依赖任何显示环境的离屏渲染，用于 CI 和自动化测试。

核心程序集 `Majorsilence.Forms` 完全不引用任何窗口工具包——只引用 SkiaSharp。各个后端是独立的程序集，
通过两个小接口 `IPlatformBackend` 和 `IWindowBackend` 接入。正是这条接缝（seam）让完全相同的应用今天可以
面向 Avalonia、明天面向 Uno，而应用代码无需任何改动。详见[平台后端]({{ '/zh/backends/' | relative_url }})。

## 它适合谁
{:#who-its-for}

如果你手上有一套目前仅限 Windows 的 WinForms 代码库，又想保持前进的势头——复用你的控件、团队的既有
习惯和业务逻辑——而不是开启一场持续多年的重写，那么它就是为你而设计的。

这个项目仍处于早期阶段：API 正在趋于稳定，WinForms 的每个角落尚未全部覆盖。它已经很适合用于新的跨平台
业务（LOB）应用，如果锁定版本，也可以用于迁移真实的生产应用。请查看
[兼容性矩阵]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)，了解目前哪些已实现、哪些还是存根。

## 试一试
{:#try-it}

```
dotnet new --install MajorsilenceForms.Templates
dotnet new majorsilenceforms
dotnet run
```

或者直接研究一个真实的应用——[`samples/Explorer`]({{ site.github_url }}/tree/main/samples/Explorer)
是一个完整的 Windows 资源管理器克隆，[`samples/Outlaw`]({{ site.github_url }}/tree/main/samples/Outlaw)
是一个 Outlook 克隆，两者都在同一套控件上跨平台原样运行，无需修改。

参阅[快速上手]({{ '/zh/getting-started/' | relative_url }})来搭建你的第一个应用。
