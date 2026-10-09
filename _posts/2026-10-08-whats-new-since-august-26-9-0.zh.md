---
title: "八月以来的进展：26.9.0、四个新后端、CSS 主题，以及行为审计"
date: 2026-10-08 12:00:00 -0230
lang: zh
permalink: /zh/blog/2026/10/08/whats-new-since-august-26-9-0/
read_time: "7 分钟阅读"
excerpt: "七周、557 次提交：GTK 4、Terminal、WinForms 和 WPF 宿主，.NET Framework 4.8 支持，CSS 主题，移动端和浏览器上仅限异步的对话框，以及一项你需要采取行动的绘制变更。"
description: >-
  Majorsilence.Forms 26.9.0：GTK 4、Terminal、WinForms 和 WPF 后端，net48 和 netstandard2.0，
  CSS 主题，MVVM，行为审计，以及升级说明。
---

上一篇文章是基于 26.0.30 写的。自 2026-08-17 以来，仓库新增了 557 次提交，当前发布版本是 **26.9.0**。
这是一篇面向现有用户和评估者的汇总：有哪些变化，各部分的成熟度如何，以及升级时你必须做的那一件事。

## 四个新后端
{:#four-new-backends}

之前有三个宿主——Avalonia、Uno、Headless。现在有七个，全都运行同一套控件；区别只在于由谁来创建窗口、
呈现 Skia 表面。

**GTK 4**（`Majorsilence.Forms.Gtk4`）是一个 Linux 优先的宿主，基于 gir.core 构建：每个窗体对应一个真正的
`Gtk.Window`，使用 GLib 主循环，在装有 GTK 4 运行时的 Windows 和 macOS 上同样可用。在 `Application.Run`
之前用 `Gtk4Application.Use ();` 显式选择它。嵌入可双向进行（`ToGtkWidget()`、`ToGtkWindow()`），
`NativeControlHost` 没有空域（airspace）问题，因为 GTK 4 以单一渲染树进行合成；`WebBrowser` 由
WebKitGTK 6.0 支撑。已在 Wayland 上验证。已知缺口：无法控制屏幕位置（GTK 4 移除了该 API），
`SetIcon(byte[])` 是空操作，原生文件选择器返回空结果因此使用回退对话框，仅支持整数缩放因子，
尚未做 AOT 分析。

**Terminal**（`Majorsilence.Forms.Terminal`，2026-10-04）把一个窗体以单视图的形式宿主在控制台里——
窗体填满终端，没有标题栏，就像手机一样。在可用的情况下，它以真实像素分辨率使用 Kitty graphics 或 Sixel，
否则使用 Unicode 块元素；检测方式是向终端查询，`MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` 可锁定某种
模式。鼠标和键盘可用；Ctrl+C 始终退出。用 `TerminalApplication.Use (options);` 选择它。仅在 xterm 和
WezTerm 中验证过。没有原生选择器、`NativeControlHost` 或 webview。

**WinForms**（`Majorsilence.Forms.WinForms`）是一个仅限 Windows 的*迁移*后端：在 Win32 消息泵上使用真正的
`System.Windows.Forms` 窗口，Skia 通过 GDI 位图呈现。它的存在是为了让你能把 Majorsilence.Forms 控件一个
一个地嵌入现有的 WinForms 应用——`myMfControl.ToWinFormsControl()`、`myForm.ToWinFormsForm()`、
`MajorsilenceFormsPresenter`——等全部移植完成后再把宿主切换到 Avalonia 或 Uno。不支持手势，没有
`IWebViewFactory`。它不同于更早的 `WindowsFormsInterop`，后者是在 Avalonia 宿主上桥接整个窗体。

**WPF**（`Majorsilence.Forms.Wpf`）对 WPF 应用而言有着相同的形态和用途：一个真正的 WPF `Window`、
`WriteableBitmap` 呈现、`ToWpfElement()` 和 `ToWpfWindow()`。用
`Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();` 选择它。

Avalonia、WinForms 和 GTK 4 提供真正的操作系统级模态对话框；Uno 则会打开一个独立窗口，因此在那里请使用
`Form.ShowDialog(parent)`。

## .NET Framework 4.8 与 netstandard2.0
{:#net-framework-48-and-netstandard20}

核心包——`Majorsilence.Forms`、`.Drawing.Common`、`.Telerik`——现在多目标于 `net8.0`、`net10.0`
**以及 `netstandard2.0`**，WinForms 和 WPF 后端还增加了 `net48`。因此，一个 .NET Framework 4.8 应用可以
在不先迁移到现代 .NET 的情况下宿主 Majorsilence.Forms 控件，这消除了许多迁移项目曾面临的先后顺序问题。

## 行为缺口审计
{:#the-behaviour-gap-audit}

两份 API 表面缺口计划（WinForms 和 GDI+）已归**零**：上游拥有的每一个成员都已声明。但这一直是不太有意思的
那一半。一个存在却只是存储一个无人读取的值、或者引发一个无人触发的事件的成员，能让你迁移后的应用编译
通过，然后悄悄地什么也不做。

因此在 2026-08-25，一次覆盖十二个领域的审计把每个领域与上游实现逐一对比，记录了 **483 项**行为不一致的
发现。此后，阶段 0–4 和大部分按控件族划分的工作已经落地。现在已经真实可用的具体项目包括：`ProcessCmdKey`
预处理链、单一的焦点/验证汇聚点、标题栏移出客户区、`AutoScaleMode.Font` 真正进行缩放、实时数据绑定
（`CurrencyManager`、`BindingNavigator`）、`ListView.View = Details`、按上游顺序执行的窗体生命周期
（Load → VisibleChanged → Activated，Shown 以投递方式触发）、DataGridView 列重排、文本控件中的 Ctrl+Z、
系统托盘中的 `NotifyIcon`、`Application.AddMessageFilter`，以及释放窗体时同时释放其控件。

空心的表面现在也被*度量*了：基线文件锁定了已知的空操作方法、惰性事件和仅存储的属性，因此再往里添加
就成了有意识的行为，而不是意外。存根策略不变——空操作或返回默认值，绝不抛出 `NotImplementedException`。

## 逻辑单位：你必须做的那一件事
{:#logical-units-the-one-thing-you-must-do}

在 2026-10-01，`ClientRectangle`、`ClientSize` 和绘制画布（`OnPaint`、`Paint`、`e.ClipRectangle`、
`e.Canvas`）改为使用**逻辑单位**，与 `Width`/`Height`/`Bounds` 和 `MouseEventArgs` 保持一致。框架会替你
把画布缩放到显示器。

**如果某个自定义控件调用了 `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`，请把它删掉**——否则绘制
现在会被缩放两次。设备像素仍可通过 `Scaled*` 系列（`ScaledWidth`、`ScaledBounds`……）、
`PaintEventArgs.Scaling` 和 `LogicalToDeviceUnits` 获得。唯一的例外是所有者绘制事件（`DrawItem`、
`DrawNode`、`CellPainting`），它们交给你的仍然是设备像素边界。用 `MF_HEADLESS_SCALE=2` 运行你的测试，
以捕获任何依赖旧行为的地方。

## 浏览器与移动端
{:#browser-and-mobile}

在 `net10.0-browser`、`-android` 和 `-ios` 上，Avalonia 后端报告 `CanRunModalLoop = false`，而那些阻塞调用——
`Form.ShowDialog`、`MessageBox.Show`、文件选择器、`TaskDialog.ShowDialog`、`VbInteraction.MsgBox`/`InputBox`、
`RadMessageBox.Show`——现在会在显示任何内容*之前*抛出 `PlatformNotSupportedException` 并指出对应的异步
版本，而不是挂起。异步形式（`ShowDialogAsync`、`MessageBox.ShowAsync`、`FileDialog.ShowDialogAsync`……）
在每个宿主上都可用，因此惯用写法是带 `await` 的 `async void` 处理程序。核心包中的一个 Roslyn 分析器可以
提前找出这些问题——`MFB001` 阻塞式模态调用、`MFB002` 对 Task 的同步等待、`MFB003` `Thread.Sleep`，
每一项都附带代码修复——对浏览器 TFM 自动启用，或在 `.editorconfig` 中设置
`majorsilence_forms.browser_target = true` 启用。

浏览器目标还在画布旁边维护一棵**无障碍 DOM**：每个控件对应一个透明、可点击穿透的元素，带有 ARIA 角色、
名称、状态和边界，由框架自身的自动化树构建而成。屏幕阅读器、页内查找以及基于 DOM 的测试工具现在都能
看到这个 UI 了。

在 Android 和 iOS 上，`TextBox` 获得焦点时会弹出屏幕键盘，`TextBoxBase.InputKind` 决定键盘类型，安全区
内边距通过 `Form.SafeAreaPadding` 生效，`WindowBase.BackRequested` 处理 Android 的返回键。坦白说明现状：
Android 已完成一轮初步的真机测试（在硬件上确认了启动、点击、渲染缩放、触摸滚动）；键盘、安全区和旋转
仅有单元测试。iOS CI 会编译真正的应用头并在模拟器中做启动冒烟检查，但还没有人以交互方式运行过它，
该任务仍然是 `continue-on-error`。

手机风格的布局控件也随之到来：`StackPanel`、`Card`、`RichListBox`（多行模板化行）和 `NavigationHost`
（带返回按钮的页面栈）。

## CSS 主题与 Theme Studio
{:#css-theming-and-theme-studio}

主题现在可以用一个严格、有文档的 CSS 子集来编写：`@theme "Ocean" extends Dark;`、每个 `Theme` 属性对应
一个 `:root` 令牌、像 `Button:hover { … }` 这样的控件类型规则、通过 `Type::part` 指定部件。解析器绝不会
悄悄失败——`ThemeStyleSheet.Parse` 会收集诊断信息。用 `Theme.LoadFromCssFile` 加载，或用
`Theme.RegisterThemeCssFromFile` + `Theme.ApplyTheme ("Ocean")`；用 `Theme.ExportCss` 导出。每个控件，
包括 Telerik 兼容层，都有选择器，而更早的 `<Theme>` XML 仍然可用。

两个配套包把*同一份*样式表应用到其他宿主上：`Majorsilence.Forms.Theming.WinForms` 重新设置真正的
`System.Windows.Forms` 控件的样式（仅限 Windows），`Majorsilence.Forms.Theming.Avalonia` 重新设置原生
Avalonia Fluent 控件的样式，因此一个 CSS 文件就能为混合的迁移应用设置主题。`samples/ThemeStudio` 是一个
带预览和诊断的实时编辑器；预构建的二进制文件附在 GitHub Releases 上。

## MVVM、Essentials、动画
{:#mvvm-essentials-animation}

`Majorsilence.Forms.Mvvm` 是建立在 `INotifyPropertyChanged` 和 `ICommand` 之上、对裁剪和 AOT 安全的接线
层，不用反射，不依赖任何工具包：`viewModel.Observe (nameof (VM.Count), vm => vm.Count, …)`、双向的
`BindText`/`BindChecked`/`BindSelectedIndex`/`BindValue`、`BindCommand`，以及一个用来统一释放的
`BindingScope`。它可以与 CommunityToolkit.Mvvm 一起使用。

`Majorsilence.Forms.Essentials` 把各平台特有的能力放在核心之外：`SecureStorage`、`Speech` 文本转语音、
`Launcher.OpenAsync`（http/https/mailto/tel/sms）和 `FileSystem.OpenAppPackageFileAsync`。一切都会降级为
空操作；请检查 `IsSupported`。

`control.RequestAnimationFrame` 加上 `Majorsilence.Forms.Animation`（`Tween<T>`、`Easing`、`Animator`）
在 Avalonia 上提供与显示器对齐的动画，在 Headless 上提供手动时钟。

## 工具
{:#tooling}

- MCP 服务器现在是一个已发布的 dotnet 工具：`dotnet tool install -g Majorsilence.Forms.Mcp`，然后
  `claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444`。它暴露 `ui_snapshot`、`ui_find`、
  `ui_click`、`ui_type`、`ui_wait_for` 和 `ui_screenshot`，与你应用中的 `WebDriverServer` 通信。
- `samples/AutomationTarget` 是一个刻意设计得别扭的小应用（有拒绝点击的控件，还有一个没有命名），
  用于学习这套工具。自定义绘制的控件通过 `IAutomationStateProvider` 发布值和状态。
- 迁移器现在**仅**以 dotnet 工具的形式发布（`dotnet tool install -g Majorsilence.Forms.Migrator`）；
  不再向发布版附加自包含二进制文件。新增开关：`--map`、`--dual-build`、`--strict`、`--dry-run --diff`。
- `Majorsilence.Forms.WinFormsShims.Compat` 是一个概念验证性质的源生成器，它生成由 Majorsilence.Forms
  支撑的 `System.Windows.Forms` 和 `System.Drawing` 命名空间，让未经修改的 WinForms 源码——包括
  `Designer.cs`——得以编译。面向公共 API 以 WinForms 类型声明的控件库。目前为 PoC 状态；参见
  `samples/WinFormsCompatDemo`。

## 升级说明
{:#upgrade-notes}

- 锁定 **26.9.0**。该项目仍是测试版（beta），仍然没有可视化设计器。
- 删除自定义绘制代码中所有的 `ScaleTransform (e.Scaling, e.Scaling)`（见上文）。
- 模板包 id 为 `Majorsilence.Forms.Templates`，用 `dotnet new install Majorsilence.Forms.Templates` 安装。
  `dotnet new majorsilenceforms` 现在会搭建一个包含共享 UI 库和桌面头的解决方案；`--IncludeAndroid`、
  `--IncludeiOS` 和 `--IncludeWasm` 可添加其他头。
- 破坏性变更列在 `MIGRATION.md` 中：`SplitContainer.Orientation`、`TreeViewDrawMode.OwnerDrawContent`、
  事件委托类型现在与 WinForms 一致，以及渐变/阴影线画刷已调整为与 GDI+ 一致。
- 在浏览器、Android 和 iOS 上，把阻塞式对话框调用替换为对应的异步版本；让 `MFB001`–`MFB003` 帮你找到它们。

## 延伸阅读
{:#where-to-read-more}

- [平台后端]({{ '/zh/backends/' | relative_url }})和
  [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md)
- [快速上手]({{ '/zh/getting-started/' | relative_url }})和
  [迁移]({{ '/zh/migration/' | relative_url }}) /
  [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)
- [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md)、
  [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md)、
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md)、
  [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)
- [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md)
- [自动化]({{ '/zh/automation/' | relative_url }})和
  [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md)
- [示例]({{ '/zh/samples/' | relative_url }})
