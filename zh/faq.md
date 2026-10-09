---
layout: docs
lang: zh
title: 常见问题
subtitle: 对人们关于跨平台 WinForms 最先会问的问题，给出简短直接的回答。
permalink: /zh/faq/
seo_title: "跨平台 WinForms 常见问题——WinForms 能在 Linux 上运行吗？"
description: >-
  WinForms 能在 Linux 或 macOS 上运行吗？WinForms 是跨平台的吗？我必须重写吗？
  关于这个开源 WinForms 兼容层的直截了当的回答。
keywords:
  - winforms 能在 linux 上运行吗
  - winforms 跨平台
  - winforms mac
  - winforms 兼容层
  - winforms 替代方案
  - winforms 设计器 跨平台
  - vb.net winforms 跨平台
  - winforms 深色模式 主题
  - winforms gtk
  - winforms 终端
  - winforms nativeaot
  - winforms mvvm
priority: "0.8"
faq:
  - question: WinForms 能在 Linux 上运行吗？
    id: can-winforms-run-on-linux
    answer: >-
      原样不行。System.Windows.Forms 只随 Windows Desktop 运行时发布，并且封装的是 user32.dll 和 GDI+，所以 WinForms 项目在 Linux 上连构建都过不了。Majorsilence.Forms 的解决办法是在 SkiaSharp 上重新实现 WinForms API，并通过 Avalonia 把它托管在原生窗口中，或托管在真实的 GTK 4 窗口中，这样同一份 C# 或 VB.NET 源码只需一个普通的 net10.0 构建、不带 -windows 目标框架，就能在 Ubuntu、Fedora 和 Debian 上原生构建和运行。
  - question: WinForms 能在 macOS 上运行吗？
    id: can-winforms-run-on-macos
    answer: >-
      原样不行——System.Windows.Forms 从来没有过 macOS 版本。Majorsilence.Forms 让同样的 WinForms 代码在 Apple Silicon 和 Intel Mac 上都运行在真实的 NSWindow 中，用普通的 osx-arm64 和 osx-x64 运行时标识符发布。
  - question: 它能作为原生 Linux 工具包运行在 GTK 上吗？
    id: does-it-run-on-gtk-as-a-native-linux-toolkit
    answer: >-
      能。Majorsilence.Forms.Gtk4 是基于 gir.core 绑定构建的 GTK 4 后端：在 Wayland 或 X11 上是一个真实的 Gtk.Window，通过在 Application.Run 之前调用 Gtk4Application.Use 显式选择，而且只要安装了 GTK 4 运行时，它在 Windows 和 macOS 上也能运行。它通过 ToGtkWidget 和 ToGtkWindow 支持双向嵌入，托管原生 GTK 部件时没有常见的空域（airspace）问题，并为 WebBrowser 提供 WebKitGTK 引擎。已知缺口是：无法控制屏幕位置、缩放因子只支持整数，以及文件选择器会回退到框架自己的对话框。
  - question: 它能在终端中运行吗？
    id: can-it-run-in-a-terminal
    answer: >-
      能。Majorsilence.Forms.Terminal 把一个窗体作为单个全屏视图托管在控制台中，就像手机那样；在终端支持的情况下通过 Kitty 图形或 Sixel 以真实像素分辨率渲染，否则回退到 Unicode 方块元素。鼠标和键盘可用，Ctrl+C 总是退出，并且已在 xterm 和 WezTerm 中验证。这个后端上没有原生文件选择器、原生托管或 Web 视图。
  - question: WinForms 是跨平台的吗？
    id: is-winforms-cross-platform
    answer: >-
      不是。Windows Forms 本身只支持 Windows，而且一直如此；只有它底下的 .NET 运行时是跨平台的。要让一个 WinForms 应用跨平台，要么用另一个框架重写 UI，要么用 Wine 之类的东西模拟 Windows，要么使用像 Majorsilence.Forms 这样 API 兼容的重新实现。
  - question: 什么是 WinForms 兼容层？
    id: what-is-a-winforms-compatibility-layer
    answer: >-
      一个暴露与 System.Windows.Forms 相同的类、属性和事件的库——Form、Button、DataGridView、事件处理程序、Designer.cs 模式——但把它们实现在某种可移植的东西上，而不是 Win32 上。你的源码保持原有形态，只是换了命名空间；底下的一切都不一样了。
  - question: 要让我的 WinForms 应用跨平台，我必须重写它吗？
    id: do-i-have-to-rewrite-my-winforms-app-to-make-it-cross-platform
    answer: >-
      用 Majorsilence.Forms 就不必。迁移基本上是机械性的——命名空间、项目文件和资源——而且 majorsilence-migrate 命令行工具会替你完成，就地修改，并产出一份可读的 git diff。你的窗体、控件、事件处理程序和设计器文件都会保留。通过 WndProc 或 Control.Handle 直接触及 Win32 的代码确实需要重写。
  - question: Majorsilence.Forms 与 Avalonia、Uno Platform 或 .NET MAUI 有什么不同？
    id: how-is-majorsilenceforms-different-from-avalonia-uno-platform-or-net-maui
    answer: >-
      那些是 XAML 框架：都是很好的目标，但采用其中任何一个都意味着把你的 UI 重建为 XAML 视图和视图模型。Majorsilence.Forms 保留 WinForms 编程模型，并把底下的工具包当作可替换的宿主：默认是 Avalonia 或 Uno，也可以是 GTK 4、真实的 WinForms、WPF 或终端——它构建在它们之上，而不是与它们竞争。全新项目请直接选 XAML；当你要保住的资产是一个现有的 WinForms 代码库时，选 Majorsilence.Forms。
  - question: 我的 Designer.cs 文件还能用吗？
    id: do-my-designercs-files-still-work
    answer: >-
      能。Designer.cs 和 Designer.vb 的代码隐藏模式原样保留，生成的布局代码无需改动即可运行。目前还不存在的是用来编辑它的可视化设计界面——没有拖放式设计器，这是待办列表上一个大家想要的功能。
  - question: 除了 C#，它也支持 VB.NET 吗？
    id: does-it-support-vbnet-as-well-as-c
    answer: >-
      支持。迁移工具会重写 .vb 项目，注入在 MyType=Empty 不再生效时丢失的隐式 WinForms 构造函数，并生成一个 My.Resources 访问器。VB 应用程序模型的部分内容（My.Application、My.Forms）也已实现，MIGRATION.md 列出了尚未实现的部分及其原因。培训指南的每个示例都同时给出 C# 和 VB.NET 版本。
  - question: 什么取代了 System.Drawing 和 GDI+？
    id: what-replaces-systemdrawing-and-gdi
    answer: >-
      Majorsilence.Forms.Drawing.Common，一个基于 SkiaSharp 的重新实现，覆盖 Bitmap、Font、Pen、Brush、Icon、Region、StringFormat、Drawing2D、Imaging 以及 EMF/WMF 图元文件回放。值类型——Color、Point、Size、Rectangle——刻意没有重新实现；改用真实的、本就跨平台的 System.Drawing.Primitives 类型。这一点很重要，因为自 .NET 7 起 System.Drawing.Common 在 Windows 之外会抛出 PlatformNotSupportedException。
  - question: 我能给它换主题吗？有深色模式吗？
    id: can-i-theme-it-and-is-there-a-dark-mode
    answer: >-
      能。主题用一个小而完整记录的 CSS 子集编写：一个主题头，例如 @theme "Ocean" extends Dark，用于强调色、背景和字体属性的根令牌，以及带 hover、active、disabled 和 focus 状态的按控件类型规则。内置浅色和深色主题，每个控件都有 CSS 选择器，解析器对子集之外的任何内容都会报告诊断，而不是静默忽略。Theme Studio 示例是一个带预览的实时编辑器，配套的 Theming.WinForms 和 Theming.Avalonia 包把同一张样式表应用到真实的 System.Windows.Forms 和原生 Avalonia 控件上，因此一个主题就能为混合迁移应用重新定义样式。
  - question: Majorsilence.Forms 是免费开源的吗？
    id: is-majorsilenceforms-free-and-open-source
    answer: >-
      是。它采用 MIT 许可证，在 GitHub 上公开开发，并发布到 NuGet。没有商业版本或付费许可。
  - question: 它可以用于生产环境了吗？
    id: is-it-production-ready
    answer: >-
      它是测试版（beta）。API 正在趋于稳定，并非 WinForms 的每个角落都已覆盖，所以请锁定你的包版本。现在每个 WinForms 和 GDI+ 成员都已声明，一项涵盖十二个领域的行为差距审计——针对成员尚未表现得像 WinForms 的地方——正在分阶段推进，其中键盘链、焦点与验证、真实对话框、数据绑定、ListView 详细信息视图以及大多数按控件划分的家族都已落地。已有多个真实应用被分叉到它上面，其中包括一个 Notepad++ 克隆、DarkUI、PKHeX 和 RibbonWinForms。在做出承诺之前请先阅读兼容性矩阵。
  - question: 它支持 DataGridView 吗？
    id: does-it-support-datagridview
    answer: >-
      部分支持，它仍然是最大的单一类型缺口，不过已经缩小了很多。流量最高的挂钩都是真实可用的——单元格格式化和绘制、行的前置和后置绘制、单元格解析、行验证、剪贴板内容、边框样式、虚拟模式、未提交的新行，以及列显示顺序的重新排列。少数事件，例如 CellStateChanged 和 RowStateChanged，仍然只是为了源码兼容而声明，但永远不会触发。兼容性矩阵准确列出了具体是哪些。
  - question: 支持哪些 .NET 版本？
    id: which-net-versions-are-supported
    answer: >-
      每个后端都支持 .NET 8 和 .NET 10，不带 -windows 目标框架后缀，也不依赖 Windows Desktop 运行时。核心包还面向 netstandard2.0 构建，WinForms 和 WPF 迁移后端额外提供 net48 目标，因此 .NET Framework 4.8 应用也能托管它们。
  - question: 它能和 .NET Framework 4.8 一起用吗？
    id: does-it-work-with-net-framework-48
    answer: >-
      只能通过仅限 Windows 的迁移后端。核心库面向 netstandard2.0，Majorsilence.Forms.WinForms 和 Majorsilence.Forms.Wpf 各自附带一个 net48 构建，因此一个经典的 .NET Framework 4.8 WinForms 或 WPF 应用今天就可以嵌入 Majorsilence.Forms 控件，以后再迁移到 .NET 8 或 10 以及跨平台后端。Avalonia、Uno、GTK 4 和 Headless 后端需要 .NET 8 或更新版本。
  - question: 它能在网页浏览器中运行吗？
    id: can-it-run-in-a-web-browser
    answer: >-
      能，通过 WebAssembly，使用 Avalonia 的浏览器目标或 Uno Platform 均可，而且完整的控件库已作为浏览器内在线演示发布。浏览器只有一个线程，没有嵌套消息循环，所以 Form.ShowDialog 和 MessageBox.Show 这类阻塞调用会在显示任何内容之前抛出一个明确的 PlatformNotSupportedException；请改用 Form.ShowDialogAsync、MessageBox.ShowAsync 以及其他异步对应方法，附带的 Roslyn 分析器会替你标记出阻塞调用。在画布之外，框架还维护一棵 ARIA 无障碍 DOM，每个控件一个元素，带有角色、名称和状态，因此屏幕阅读器、页内查找和 DOM 测试工具都能看到这个 UI。这个目标上仍然没有原生 WebView。
  - question: 有 Android 和 iOS 方案吗？成熟度如何？
    id: is-there-an-android-and-ios-story-and-how-mature-is-it
    answer: >-
      有，通过 Avalonia 的 Android 和 iOS 目标，项目模板用 --IncludeAndroid 和 --IncludeiOS 添加它们。屏幕键盘、输入类型、安全区边距、返回键、挂起与恢复、触觉反馈，以及 StackPanel、Card 和 NavigationHost 这类手机风格的布局控件都已就绪，阻塞式对话框会像在浏览器中一样抛出异常、让位于异步形式。Android 已经过一轮初步的真机测试，覆盖启动、点击、缩放和触摸滚动；iOS 能在 CI 模拟器冒烟检查中编译并启动，但还没有人交互式地运行过它，所以预计会有一轮磨合。
  - question: 我能把它和 MVVM 或 CommunityToolkit.Mvvm 一起用吗？
    id: can-i-use-it-with-mvvm-or-communitytoolkitmvvm
    answer: >-
      能。Majorsilence.Forms.Mvvm 提供基于 INotifyPropertyChanged 和 ICommand 的连接：Observe 用于单向更新，BindText、BindChecked、BindSelectedIndex 和 BindValue 用于双向绑定，BindCommand 用于按钮，还有一个 BindingScope 用来一次性释放所有绑定。它用 nameof 命名属性、用 lambda 读取属性，所以没有反射，在裁剪下也没有任何需要保留根的东西。它不依赖任何工具包，因此用 CommunityToolkit.Mvvm 编写的视图模型无需改动即可使用。
  - question: 它支持裁剪和 NativeAOT 吗？
    id: does-it-support-trimming-and-nativeaot
    answer: >-
      核心、Drawing.Common、Avalonia 和 Headless 包支持，它们以 IsAotCompatible 构建，因此任何裁剪或 AOT 隐患都会让它们自己的构建失败，并且 CI 中有一个 NativeAOT 冒烟测试在执行发布。经典的 Control.DataBindings API 基于反射，所以经过裁剪的应用必须用 TrimmerRootDescriptor 为它所绑定的视图模型成员保留根；框架为其控件的可绑定属性内嵌了自己的描述符，而 Mvvm 包则完全避开了这个问题。netstandard2.0 和 GTK 4 这两行尚未分析。
  - question: 我怎样获取控件的 HWND？
    id: how-do-i-get-an-hwnd-for-a-control
    answer: >-
      在跨平台后端上做不到，而且框架拒绝伪造一个。这里的控件是画布上的绘制操作，而不是操作系统窗口，所以 Control.Handle 是 IntPtr.Zero。窗口级句柄是真实的——WindowBase.PlatformHandle 在 Windows 上返回真实的 HWND，在 macOS 上返回 NSWindow，在 X11 上返回 XID。要托管原生内容，有一个受支持的 NativeControlHost 接缝（seam）；而仅限 Windows 的 WinForms 后端确实会返回真实的 HWND，因为那个窗口本来就是 WinForms 窗口。
  - question: 我能一次只迁移一个界面吗？
    id: can-i-migrate-one-screen-at-a-time
    answer: >-
      能，有好几种方式。迁移工具的双构建模式让一个项目在一个 MSBuild 属性的控制下同时能针对真实 WinForms 和 Majorsilence.Forms 编译。在 Windows 上，Majorsilence.Forms.WindowsFormsInterop 可以把真实的 System.Windows.Forms 窗体托管在 Majorsilence.Forms 应用内部，反之亦然，因此整个界面可以逐个迁移。再细一些，WinForms 和 WPF 后端通过 ToWinFormsControl 或 ToWpfElement 把 Majorsilence.Forms 控件一次一个地嵌入现有应用，而 WinFormsShims.Compat 源生成器让未经修改的 System.Windows.Forms 源码（包括设计器文件）针对 Majorsilence.Forms 编译，适用于类型绑定到 WinForms 的控件库。
  - question: AI 编码助手能驱动这个 UI 吗？
    id: can-an-ai-coding-assistant-drive-the-ui
    answer: >-
      能。每个控件都通过一棵文本自动化树暴露出来，应用可以通过一个回环 WebDriver 端点提供它，Selenium 或 curl 都能与之通信。Majorsilence.Forms.Mcp 是一个已发布的 dotnet 工具，它把该端点包装成 MCP 服务器，提供 ui_snapshot、ui_find、ui_read、ui_click、ui_type、ui_wait_for 和 ui_screenshot 工具，因此像 Claude Code 这样的助手可以检查并操作一个正在运行的窗体。自定义绘制的控件通过实现 IAutomationStateProvider 来发布自己的值和状态。
  - question: 自定义绘制的控件需要自己处理 DPI 缩放吗？
    id: do-custom-painted-controls-need-to-handle-dpi-scaling
    answer: >-
      不需要，而且自 2026-10-01 起也不应该这样做。ClientRectangle、ClientSize 和绘制画布都以逻辑单位计，与 Width、Height、Bounds 和鼠标坐标一致，由框架把画布缩放到显示器。如果一个较旧的控件曾用 e.Scaling 调用 e.Graphics.ScaleTransform，请移除它，否则绘制会被缩放两次。设备像素仍然可以通过 ScaledBounds、PaintEventArgs.Scaling 和 LogicalToDeviceUnits 获得，DrawItem 和 CellPainting 这类所有者绘制事件仍然交出设备像素边界。用 MF_HEADLESS_SCALE=2 在 2 倍缩放下测试。
---

{% for entry in page.faq %}
### {{ entry.question }}
{:#{{ entry.id }}}

{{ entry.answer }}
{% endfor %}

## 还在找别的内容？
{:#still-looking-for-something}

- [跨平台 WinForms]({{ '/zh/cross-platform-winforms/' | relative_url }})——架构，以及兼容模型的代价。
- [Linux 上的 WinForms]({{ '/zh/winforms-on-linux/' | relative_url }})和
  [macOS 上的 WinForms]({{ '/zh/winforms-on-macos/' | relative_url }})——逐平台的细节。
- [平台后端]({{ '/zh/backends/' | relative_url }})——Avalonia、Uno、GTK 4、Terminal、WinForms、
  WPF 和 Headless 并排对比。
- [迁移 WinForms 应用]({{ '/zh/migration/' | relative_url }})——自动化重写。
- [WinForms 替代方案对比]({{ '/zh/winforms-alternatives/' | relative_url }})——MAUI、Avalonia、
  Uno、Eto.Forms、Wine。
- [用 CSS 换主题]({{ site.github_url }}/blob/main/docs/theming.md)——主题子集、令牌和 Theme Studio。
- [兼容性矩阵]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)——逐控件回答"*X* 支持吗？"。
- [提交 issue]({{ site.github_url }}/issues)——如果这里没有你要的答案。
