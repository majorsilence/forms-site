---
layout: docs
lang: zh
title: 平台后端
subtitle: 一个渲染核心，七个可替换的宿主。
seo_title: "平台后端 — 在 Avalonia、Uno、GTK 4、终端、WinForms、WPF 或 Headless 上运行 WinForms"
description: >-
  跨平台 WinForms 应用如何被 Avalonia、Uno Platform、GTK 4、终端、真正的 WinForms 或 WPF 窗口，
  或无头 Skia 表面所承载——后端接缝（seam）、逻辑像素、裁剪、WebAssembly、移动端，以及在宿主应用中嵌入。
keywords:
  - WinForms Avalonia 后端
  - WinForms Uno Platform
  - WinForms GTK4 Linux
  - 终端运行 WinForms
  - WinForms WebAssembly 浏览器
  - Majorsilence.Forms WPF 后端
  - Majorsilence.Forms WinForms 后端
  - 无头 WinForms 渲染
  - SkiaSharp UI 后端
priority: "0.8"
permalink: /zh/backends/
---

Majorsilence.Forms 使用 SkiaSharp **完成全部绘制**。每个控件都绘制到一个
`SKSurface`/`SKCanvas` 上；底层的窗口工具包只是一个*宿主*——它创建原生窗口、运行消息循环、
传递输入，并把 Skia 表面呈现到屏幕上。

这个宿主被抽象在一个很小的接缝（seam）之后，因此同一份应用代码可以运行在七个后端中的任意一个上：

| 包 | 宿主 | 用途 | 平台 | 如何选择 |
|---|---|---|---|---|
| `Majorsilence.Forms.Avalonia` | Avalonia 12 | 默认后端。真正的桌面窗口；通过 Avalonia 自己的平台包还支持浏览器、Android 和 iOS。唯一一个拥有真实 `TryGetPlatformHandle`（HWND / NSWindow / XID）的跨平台后端。 | Windows、macOS、Linux；WebAssembly；Android 和 iOS（需显式启用） | 自动——引用该包并调用 `Application.Run (new MainForm ())`。 |
| `Majorsilence.Forms.Uno` | Uno Platform Skia（Uno.WinUI 6.5） | 在 Uno 应用头（app head）中通过 `SKXamlCanvas` 呈现。 | 桌面（已在 macOS 上验证）；Uno 还面向 iOS/Android/WASM | 在 Uno 应用的 `OnLaunched` 中执行 `Platform.Backend = new UnoPlatformBackend ()`。 |
| `Majorsilence.Forms.Gtk4` | 通过 gir.core 的 GTK 4（`GirCore.Gtk-4.0 0.8.1`） | 每个窗体对应一个运行在 GLib 主循环上的真实 `Gtk.Window`。以 Linux 为先。双向嵌入，`NativeControlHost` 没有空域（airspace）问题，`WebBrowser` 由 WebKitGTK 6.0 提供。 | Linux（Wayland/X11，已在 Wayland 上验证）；安装了 GTK 4 的 Windows/macOS | `Gtk4Application.Use ();` 然后 `Application.Run`。 |
| `Majorsilence.Forms.Terminal` | 控制台 / ANSI | 以单视图宿主的方式在终端中运行窗体（窗体填满屏幕，没有标题栏）。支持真实像素分辨率的 Kitty graphics 或 Sixel，否则使用 Unicode 块状字符。 | 任意终端；已在 xterm 和 WezTerm 中验证 | `TerminalApplication.Use ();` 然后 `Application.Run`。 |
| `Majorsilence.Forms.WinForms` | 真正的 `System.Windows.Forms` | 仅限 Windows 的*迁移*后端：Win32 消息泵上的真实 WinForms 窗口，Skia 通过 GDI 位图呈现。可以一次一个控件地采用 Majorsilence.Forms。还面向 `net48`。 | Windows | `Platform.Backend = new WinFormsPlatformBackend ()`——或者把一个 `MajorsilenceFormsPresenter` 放进 WinForms 窗体，它会自行安装。 |
| `Majorsilence.Forms.Wpf` | WPF `Window` | 仅限 Windows 的迁移后端，与 WinForms 后端形态相同：`Dispatcher` 循环上的真实 WPF `Window`，Skia 通过 `WriteableBitmap` 呈现。还面向 `net48`。 | Windows | `Platform.Backend = new WpfPlatformBackend ()`。 |
| `Majorsilence.Forms.Headless` | 无依赖的 SkiaSharp | 用于测试、CI 和服务器的离屏渲染；可供参考复制的基准后端。 | 任何能运行 .NET 的地方；不需要显示器 | `HeadlessRenderer.Use ()`。 |

**核心程序集 `Majorsilence.Forms` 不引用任何窗口工具包**——只引用 SkiaSharp。
后端是独立的程序集，它们依赖核心，并接入核心内部的渲染/输入管线。

### 目标框架
{:#target-frameworks}

核心（`Majorsilence.Forms`、`Majorsilence.Forms.Drawing.Common`、`Majorsilence.Forms.Telerik`）
多目标 `net8.0`、`net10.0` **以及 `netstandard2.0`**。`Majorsilence.Forms.WinForms` 和
`Majorsilence.Forms.Wpf` 在 `net8.0-windows` / `net10.0-windows` 之外各自增加了一行 **`net48`**
（与核心的 `netstandard2.0` 构建配对），因此经典的 .NET Framework 4.8 WinForms 或 WPF 应用今天就可以
承载 Majorsilence.Forms 控件。`net48` 行在 CI 的每个操作系统上都能编译；只有*运行*它们需要 Windows。

跨平台后端（Avalonia、Uno、GTK 4、Terminal、Headless）面向 `net8.0`+，不需要 `-windows` TFM 后缀。
没有 `netstandard2.0` 后端，所以在非 Windows 的 .NET Framework 运行时上，应用可以引用这些控件，
但无法承载窗口。

## 接缝（seam）
{:#the-seam}

`Majorsilence.Forms.Backends` 中的两个接口定义了宿主必须提供的一切：

- **`IPlatformBackend`**——应用程序和进程级服务：调度器（`Post`/`Invoke`）、
  计时器、剪贴板、屏幕、`CreateWindow`，以及模态循环。
- **`IWindowBackend`**——一个原生窗口：位置/尺寸/缩放、显示/隐藏/关闭、标题、光标、
  装饰、拖动/调整大小，以及原生文件对话框。

`IWindowBackend` 是*拉取*的一侧。*推送*的一侧——绘制请求和原生输入——是后端直接调用所属窗口的中立方法：
`RenderFrame (SKCanvas, physW, physH, scaling)`、`HandlePointer*`、`HandleKeyDown/Up`、`HandleTextInput`，
以及 `OnBackend*` 生命周期钩子。所有穿过接缝的坐标都是 `System.Drawing` 值类型和 Majorsilence.Forms
枚举——没有任何工具包类型泄漏进核心。可选能力（`IWebViewFactory`、`INativeControlHostBackend`、
`IAudioBackend`、`IModalLoopSupport`……）位于这两个接口旁边；省略了某项能力的后端只是永远不会触发对应的事件。

### 选择后端
{:#selecting-a-backend}

`Majorsilence.Forms.Backends.Platform.Backend` 保存当前激活的 `IPlatformBackend`。如果未设置，
当引用了 `Majorsilence.Forms.Avalonia` 时它会按名称解析为 `AvaloniaPlatformBackend`——所以桌面应用只需
引用该包并调用 `Application.Run (new MyForm ())`。其他每个后端都要显式安装，**而且必须在创建第一个窗口之前**：

```csharp
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
// 或者使用辅助方法：  Gtk4Application.Use ();   TerminalApplication.Use ();   HeadlessRenderer.Use ();
Application.Run (new MainForm ());
```

### 逻辑像素与设备像素
{:#logical-vs-device-pixels}

应用程序在 `Control` 上看到的一切都是**逻辑单位**——即在任何显示缩放下它所设置和读回的数值：
`Width`/`Height`/`Location`/`Bounds`、`ClientSize` 和 `ClientRectangle`、`MouseEventArgs.X/Y`，
以及**绘制画布**。`OnPaint`、`Paint` 处理程序和 `e.ClipRectangle` 全部是逻辑单位；框架负责把画布缩放到显示器。

```csharp
child.Left = (ClientSize.Width - child.Width) / 2;            // 在任何 DPI 下都把子控件居中
e.Graphics.DrawRectangle (pen, 0, 0, Width - 1, Height - 1);  // 在任何 DPI 下都给控件描边
```

**这一点在 2026-10-01 发生了变化。** 在那之前，`ClientSize`、`ClientRectangle` 和绘制画布都是设备像素，
自定义控件必须自己调用 `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`。如果你添加过这样的调用，
**请删除它**——否则绘制会被缩放两次。设备像素仍然可以通过显式命名的 `Scaled*` 系列
（`ScaledWidth`、`ScaledBounds`……）、`PaintEventArgs.Scaling` 和 `LogicalToDeviceUnits` 获取。

还剩一个例外：**所有者绘制事件**（`DrawItem`、`DrawNode`、`DrawListViewItem`、网格的 `CellPainting`……）
仍然交出设备像素的 `Bounds` 和设备像素的 `Graphics`。两者彼此一致，但与控件的其余部分不一致。

请在 `MF_HEADLESS_SCALE=2` 下测试缩放假设（参见
[自动化]({{ '/zh/automation/' | relative_url }})）——在缩放 1 下正确、在其他任何缩放下出错的代码，是最常见的 bug。

### 裁剪与 NativeAOT
{:#trimming-and-nativeaot}

`Majorsilence.Forms`、`Majorsilence.Forms.Drawing.Common`、`Majorsilence.Forms.Avalonia` 和
`Majorsilence.Forms.Headless` 以 `IsAotCompatible` 构建，因此新的裁剪/AOT 隐患会让 Release 构建失败，
而不是悄悄破坏被裁剪的使用者；`tests/Majorsilence.Forms.AotSmoke` 在 CI 中发布一个真正的 NativeAOT 二进制文件。
Uno、GTK 4、WinForms、WPF 和 Telerik 程序集**不**做分析——它们的工具包重度依赖反射，不在 AOT 保证的范围内。

**数据绑定是唯一依赖反射的角落。** `Control.DataBindings` 在运行时按名称查找属性和
`<Property>Changed` 事件。框架内嵌了自己的 `ILLink.Descriptors.xml`，把自身控件的可绑定成员对
（`Text`/`TextChanged`、`Checked`、`SelectedIndex`、`Value`）设为根，所以**控件这一侧不需要你做任何事**。
**视图模型这一侧仍然由你负责**：在应用项目中用 `TrimmerRootDescriptor` 把你绑定的属性设为根，
或者干脆用普通代码连接视图模型来绕开这个问题——这正是无反射的 `Majorsilence.Forms.Mvvm` 包
（`Observe`、`BindText`、`BindCommand`）所做的。缺失或被裁剪的成员会在 `DataBindings.Add` 处带着成员名
大声失败；只有缺失 `Changed` 事件时会静默退化为单向绑定。`Label`/`TextBox.Text` 之外的覆盖范围没有
自动化测试验证，所以在依赖它之前请先检查已发布的构建。

## 在宿主应用中嵌入
{:#embedding-in-a-host-app}

上面的一切都假设 Majorsilence.Forms 拥有顶层窗口。Avalonia、Uno、WinForms、WPF 和 GTK 4 后端还支持
*反向*场景：一个现有的宿主应用把 Majorsilence.Forms 对象当作它自己的原生对象来使用——这是纯增量的，
不会改变通常的 `Form.Show()` 流程中的任何东西。

**一个 Majorsilence 控件变成宿主控件**，通过 `MajorsilenceFormsPresenter`（一个真正的
`Avalonia.Controls.Canvas` / WinUI `Grid` / `System.Windows.Forms.Control` / WPF `Grid` / GTK
`DrawingArea`）及其扩展方法实现。把结果放进任何原生可视化树即可：

```csharp
Avalonia.Controls.Control            c = myMfControl.ToAvaloniaControl ();  // Majorsilence.Forms
Microsoft.UI.Xaml.FrameworkElement   c = myMfControl.ToUnoControl ();       // Majorsilence.Forms.Uno
System.Windows.Forms.Control         c = myMfControl.ToWinFormsControl ();  // Majorsilence.Forms.WinForms
System.Windows.FrameworkElement      c = myMfControl.ToWpfElement ();       // Majorsilence.Forms.Wpf
Gtk.Widget                           c = myMfControl.ToGtkWidget ();        // Majorsilence.Forms.Gtk4
```

GTK 4 的 presenter 是*暴露*一个 `Widget` 属性，而不是从 GTK 组件派生（gir.core 的 GObject 子类化需要
额外的集成包）；其他方面形态完全一致。

**一个 Majorsilence `Form` 变成宿主窗口。** `Form` 的后端窗口在其构造函数中被立即创建，而在这些后端上，
那个对象本身已经*是*（Avalonia、WinForms、WPF、GTK 4）或*包装了*（Uno）一个真正的原生窗口，
所以这些方法直接把它交还给你：

```csharp
Avalonia.Controls.Window  w = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window  w = myForm.ToUnoWindow ();
System.Windows.Forms.Form w = myForm.ToWinFormsForm ();
System.Windows.Window     w = myForm.ToWpfWindow ();
Gtk.Window                w = myForm.ToGtkWindow ();
```

从这里开始由宿主负责显示它——把它设为主窗口、设置 `Owner`、调用 `Show()`/`ShowDialog(owner)`。
Majorsilence 自己的 `Load`/`Shown`/`Application.OpenForms` 记账逻辑仍会在窗口首次可见时运行，
无论是哪一侧触发的。

**所有者与模态关系因后端而异。** Avalonia、WinForms 和 GTK 4 通过各自原生的 `Owner`/`ShowDialog(owner)`
提供真正的操作系统级模态关系（GTK：transient-for + modal）。Uno 在这个后端中没有所有者的概念，
所以 `ToUnoWindow()` 返回一个独立的顶层窗口；在 Uno 下要获得模态行为，请使用 `Form.ShowDialog(parent)`
——Majorsilence 自己的模态循环，它不依赖原生所有权。

每个方向都有示例演示：
[`EmbeddingAvalonia`]({{ site.github_url }}/tree/main/samples/EmbeddingAvalonia)、
[`EmbeddingUno`]({{ site.github_url }}/tree/main/samples/EmbeddingUno)、
[`EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) 和
[`EmbeddingGtk4`]({{ site.github_url }}/tree/main/samples/EmbeddingGtk4)；参见
[示例]({{ '/zh/samples/' | relative_url }})。

## Avalonia 后端
{:#the-avalonia-backend}

默认后端，也是新桌面应用零配置就能得到的后端。在 Windows/macOS/Linux 上，窗口宿主*就是*一个真正的
`Avalonia.Controls.Window`，这就是为什么它是唯一实现了 `TryGetPlatformHandle` 的跨平台后端（参见
[原生互操作]({{ '/zh/native-interop/' | relative_url }})），也是为什么 `ToAvaloniaWindow()` 能给宿主应用
真正的操作系统级所有者/模态语义。

它不只面向桌面。该项目多目标如下：

| TFM | 构建条件 | Avalonia 平台包 |
|---|---|---|
| `net8.0`、`net10.0` | 始终 | `Avalonia.Desktop` + `Avalonia.Controls.WebView` |
| `net10.0-browser` | 始终 | `Avalonia.Browser` |
| `net10.0-android` | 需显式启用：`-p:EnableAndroidTarget=true`（需要 `android` 工作负载） | `Avalonia.Android` |
| `net10.0-ios` | 需显式启用：`-p:EnableIOSTarget=true`（需要 `ios` 工作负载，仅限 macOS） | `Avalonia.iOS` |

浏览器行是无条件的，因为 wasm-tools 只在*发布*时才需要。Android 和 iOS 需要显式启用，因为仅仅编译那一行
就需要它们的工作负载；两个开关相互独立，因为一台机器通常只装了其中一个工作负载而没有另一个。

### 单视图平台（浏览器、Android、iOS）
{:#single-view-platforms-browser-android-ios}

这三者都没有操作系统窗口管理器；每个应用/标签页/屏幕恰好只提供一个视图。它们共享一个宿主，
其中**每一个** Majorsilence.Forms 窗口都是一个 `Canvas`，而不是 Avalonia 的 `Window`：
第一个非弹出窗体填满视口，弹出窗口、菜单和其他顶层窗体则是它的绝对定位子元素。启动由宿主驱动，
并接收一个**工厂**，因为在后端初始化之前窗体不能存在：

```csharp
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());  // 浏览器
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());             // 在 OnCreate 中调用
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());                 // 在 FinishedLaunching 中调用
```

**在这些平台上不可用的功能**，大多是固有限制而非待办事项：

- **没有窗口外框（chrome）。** `Topmost`、系统装饰、`SetIcon`、`Min`/`MaximumSize`、`CanResize`、
  `ShowInTaskbar`、`WindowState` 以及移动/调整大小拖动都是空操作。`Title` 今天也是空操作，
  不过这一项属于待办工作。
- **`ShowDialog` 不是操作系统级模态**——它的*行为*仍然是模态的，因为禁用父窗口的逻辑位于接缝之上；
  第二个窗口会在视图的左上角打开。而**阻塞式**的 `ShowDialog` 在这三个平台上都完全不可用——
  参见[浏览器线程](#browser-threading)。
- **没有 WebView。** 需要它的兼容控件（`RadPdfViewer`、`RadRichTextEditor`）会回退到各自的
  纯查看器路径。浏览器没有原生 webview；Android 和 iOS 有，所以这两个属于推迟的工作，而不是硬性限制。
- **失去焦点到另一个应用时不会触发弹出窗口的关闭**；在应用内部点击其他位置仍然会关闭弹出窗口。

**在这些平台上可用的功能**（移动端对等）：

- **屏幕键盘。** 聚焦 `TextBox` 会弹出软键盘，失焦时收起。
  `TextBoxBase.InputKind`（`Number`、`Email`、`Url`、`Phone`）决定键盘布局；掩码框和多行框会得到
  匹配的键盘。桌面后端忽略它。
- **安全区域内边距。** `Form.SafeAreaPadding` 会自动应用，因此停靠和锚定的控件会避开状态栏、
  刘海和 Home 指示条；键盘打开时，获得焦点的字段会被滚动到可见区域。
- **生命周期、返回键、尺寸类别。** `Application.Suspended`/`Resumed`、
  `WindowBase.BackRequested`（模板的 `MainActivity` 会转发 Android 返回键）、
  `Form.SizeClass`/`SizeClassChanged`、Android 上的触摸滚动条，以及手机风格的布局控件
  （`StackPanel`、`Card`、`RichListBox`、`NavigationHost`），详见
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md)。

**三者的成熟度差别很大。** 三者都能在 CI 中编译，但无头测试套件验证的是共享核心，而不是真正的应用头。

- **浏览器**运行完整的控件库——[在线演示]({{ '/gallery/' | relative_url }})就是它——并且它的模态和
  无障碍检查在每次 CI 构建中都在无头 Chrome 里运行。这条路径仍然很年轻。
- **Android** 已经做过一轮初步的真机验证：控件库可以启动，点按命中测试、渲染缩放和触摸滚动/轻扫已在
  硬件上确认。屏幕键盘、安全区域内边距和旋转在 Headless 上有单元测试，但尚未在设备上验证。
- **iOS** 能编译，CI 会在模拟器中启动它作为冒烟检查，但还没有人在模拟器或设备上交互式地运行过它；
  `ios` 作业仍然是 `continue-on-error`。

### 在浏览器中运行（WebAssembly）
{:#running-in-the-browser-webassembly}

没有单独的 WASM 包——`Majorsilence.Forms.Avalonia` 的 `net10.0-browser` 行构建在 Avalonia 12 的
`Avalonia.Browser` 平台上（WebGL2/Emscripten，与桌面相同的 Skia 渲染器）。
一个最小的浏览器头在 `Microsoft.NET.Sdk.WebAssembly` 项目中引用 `Majorsilence.Forms.Avalonia` +
`Avalonia.Browser`——参见
[`samples/Gallery.Wasm`]({{ site.github_url }}/tree/main/samples/Gallery.Wasm)，或者用
`dotnet new majorsilenceforms --IncludeWasm` 生成一个。

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

用任意静态文件服务器托管 `out/wwwroot`——`dotnet run` 不会托管 WebAssembly SDK 项目。
CI 在每个 PR 上发布这个包，并把它附加到每个发行版。

浏览器中没有真正的文件系统。`WasmFilesToIncludeInFileSystem`——通常用来预加载文件系统的项——在
`Microsoft.NET.Sdk.WebAssembly` 下会被静默忽略，这就是为什么控件库自己的图标在浏览器（以及 Android/iOS）
构建中仍然缺失。请改为以 `EmbeddedResource` 的形式随应用提供这类资源。

### 浏览器线程
{:#browser-threading}

在浏览器中，.NET 运行在页面唯一的 JavaScript 线程上。一个不返回的调用，也会停掉本可以让它返回的输入、
计时器和绘制——所以嵌套的模态循环无法运行，Avalonia 后端在 `net10.0-browser` 上报告
`CanRunModalLoop = false`。**在 Android 和 iOS 上也是如此**，只是原因不同：Avalonia 的调度器在那里无法
推入嵌套帧（在 Android 15 模拟器和 iPhone 17 Pro 模拟器上实测）。

每个阻塞式的模态入口都会**在显示任何东西之前**检查这个标志，并抛出 `PlatformNotSupportedException`，
同时指出它的异步孪生方法，所以被拒绝的调用不会留下打开的对话框，也不会禁用任何所有者窗口。
每个模态 API 都有可等待的形式，并且在每个后端上都可用：

| 阻塞式 | 可等待式 |
|---|---|
| `Form.ShowDialog (…)` | `Form.ShowDialogAsync (…)`——相同的所有者重载 |
| `MessageBox.Show (…)` | `MessageBox.ShowAsync (…)` |
| `OpenFileDialog`/`SaveFileDialog`/`FolderBrowserDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `TaskDialog.ShowDialog (…)` | `TaskDialog.ShowDialogAsync (…)` |
| `ColorDialog`/`FontDialog`/`PrintPreviewDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `CommonDialog.ShowDialog`（你自己的子类） | `CommonDialog.ShowDialogAsync`；重写 `RunDialogAsync` |
| `VbInteraction.MsgBox`/`InputBox` | `VbInteraction.MsgBoxAsync`/`InputBoxAsync` |
| `RadMessageBox.Show (…)`（Telerik 兼容） | `RadMessageBox.ShowAsync (…)` |

通常的写法是一个 `async void` 事件处理程序——这是 `async void` 作为惯用法的唯一场合：

```csharp
private async void deleteButton_Click (object sender, EventArgs e)
{
    if (await MessageBox.ShowAsync (this, "Delete the selected rows?", "Orders", MessageBoxButtons.YesNo) != DialogResult.Yes)
        return;

    using var options = new DeleteOptionsForm ();
    if (await options.ShowDialogAsync (this) == DialogResult.OK)
        await DeleteAsync (options.Mode);
}
```

同样的规则也适用于 `task.Result`、`.Wait ()`、`GetAwaiter ().GetResult ()` 和 `Thread.Sleep`——
请使用 `await` 和 `await Task.Delay`。

**分析器。** 核心 `Majorsilence.Forms` 包自带一个带代码修复的 Roslyn 分析器：
`MFB001` 阻塞式模态调用（指出其可等待的孪生方法），`MFB002` 对任务的同步等待，
`MFB003` `Thread.Sleep`。除非代码是浏览器代码，否则它保持沉默——即 `net*-browser` TFM、
声明了 `<SupportedPlatform Include="browser" />` 的库，或者为被浏览器头引用的共享 UI 库显式开启：

```ini
# 放在共享 UI 库旁边的 .editorconfig
[*.cs]
majorsilence_forms.browser_target = true
```

该分析器仅针对浏览器；Android 或 iOS 代码中的阻塞调用在构建时不会被标记，而是在运行时以同样的消息失败。
如果 JSPI 或 CoreCLR 浏览器运行时将来允许嵌套循环运行，`CanRunModalLoop` 就是唯一需要重新打开的开关。

### 无障碍 DOM（浏览器）
{:#accessibility-dom-browser}

单个画布对屏幕阅读器、页内查找或 DOM 测试工具来说是不可见的。因此在浏览器目标上，Avalonia 后端会在画布旁边
维护一份**已打开窗体的 DOM 镜像**：每个控件对应一个透明、可点击穿透的元素，携带其 ARIA 角色、名称、状态和边界，
由框架自己的自动化树构建——与 Windows UI Automation 桥和 WebDriver 服务器读取的是同一棵树，所以测试能找到的
东西，屏幕阅读器也能找到。它在绘制后最多每 100 毫秒重新同步一次，只发送变化的部分；弹出窗口被镜像在打开它们的
窗口内部；两个实时区域（live region）会播报对话框、消息框、状态文本以及带 `LiveSetting` 的标签。
测试工具按角色和名称或 `[data-mf-automation-id=…]` 定位，并在元素的边界框处点击，因为输入仍然属于画布。

坦诚的提醒：它是通过在无头 Chrome 中读取 DOM 和记录实时区域来验证的。
**还没有用真正的屏幕阅读器试过。** 可以通过 `Majorsilence.Forms.Browser.DisableAccessibilityDom`
AppContext 开关关闭它。

## Headless 后端
{:#the-headless-backend}

最简单的后端，也是可供复制的参考实现：一个工作队列式的消息循环、一个内存剪贴板、一个虚拟屏幕，
以及到 `SKSurface` 的离屏渲染。`HeadlessRenderer.Use ()` 安装它并把调用线程设为 UI 线程；
`CapturePng (window, w, h)` 渲染为 PNG；`Click`/`MouseDown`/`KeyDown`/`TextInput` 辅助方法驱动的是
真实后端所用的同一条中立 `Handle*` 路径。它不需要显示器，因此它支撑着单元测试，并为 CI 和像素比对检查
渲染 ControlGallery：

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

这里的动画是确定性的：`control.RequestAnimationFrame (…)` 由手动时钟
`HeadlessRenderer.AnimationClock.Step (n)` 驱动，而不是显示计时器。参见
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)。

## Uno 后端
{:#the-uno-backend}

在 Uno Platform 的 Skia 目标上实现接缝：`UnoPlatformBackend` 驱动 `DispatcherQueue` 和 WinUI 剪贴板，
`UnoWindowHost` 承载一个 `SKXamlCanvas`，并把指针/按键/字符事件翻译到中立的输入路径。
它需要一个 Uno *应用头*——参见
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno)——并且已经验证可以在
macOS 上启动并渲染完整的控件库。

在这个后端上，Majorsilence.Forms 自绘外框的窗口拖动/调整大小是声明式的而非命令式的：调整大小来自一个
保留了操作系统调整边距的无边框 presenter，无需额外工作；标题栏拖动在 Windows 桌面头上使用 WinUI 的
标题区域 API（`SetCaptionRegions`）。在 macOS 上由原生装饰负责拖动/调整大小；在 X11 上标题栏拖动不可用，
`UseSystemDecorations` 是回退方案。

## GTK 4 后端
{:#the-gtk-4-backend}

`Majorsilence.Forms.Gtk4` 通过 [gir.core](https://github.com/gircore/gir.core) 绑定在 GTK 4 上实现接缝。
它是一个以 Linux 为先（Wayland/X11）的真实窗口桌面后端，在安装了 GTK 4 运行时的 Windows/macOS 上也能
编译和运行。与 Avalonia 不同，它需要显式选择：

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // 安装 Gtk4PlatformBackend
Application.Run (new MainForm ());      // GLib 主循环
```

**可用的功能：**每个顶层窗体对应一个真正的 `Gtk.Window`，弹出窗口使用无边框窗口；每次绘制把 Skia 渲染到
Cairo 图像表面；鼠标、键盘和输入文本通过 GTK 事件控制器传递；`Timer` 背后是 GLib 计时器；剪贴板文本和
多显示器 `Screen`；通过 `Gdk.Toplevel.BeginMove/BeginResize` 实现自定义外框的移动/调整大小拖动；
`ShowDialog` 具有真正的 transient-for/模态关系；双向嵌入（`ToGtkWidget()`、`ToGtkWindow()`）；
以及 `NativeControlHost`——叠放在 Majorsilence 场景中的真正 `Gtk.Widget`。GTK 4 把每个组件合成到同一棵
渲染树中，所以**这里不存在空域问题**，这一点与 Avalonia/Uno/WinForms 不同。`WebBrowser`、`RadPdfViewer`
和 `RadRichTextEditor` 由 **WebKitGTK 6.0** 支持（导航事件、`ExecuteScriptAsync`、JS 到宿主的消息桥）；
原生库只在创建 `WebBrowser` 时才加载，没有它时 `IsWebViewFunctional` 为 false。

已在 Wayland 上验证：窗口能显示，完整的 ControlGallery 能渲染，计时器会触发，重绘跟随输入，
嵌入示例能呈现，webview 能往返传递脚本消息。

**不可用的功能**，大多是 GTK 4 移除的 API 而非待办工作：无法控制屏幕位置（`Form.Location` 只是窗口
管理器可能忽略的提示；`Topmost`、`ShowInTaskbar` 和 `MaximumSize` 能往返读写但不会被强制执行）；
`SetIcon(byte[])` 是空操作（GTK 4 图标是主题名称）；文件和文件夹选择器返回空，所以会像在 Headless 上一样
由通用对话框回退接管；分数缩放使用 GTK 的整数缩放因子（1 或 2）；并且该后端没有做 AOT 分析。
它需要显示服务器——离屏渲染请使用 Headless。

**安装。** Debian/Ubuntu 上安装 `libgtk-4-1`，Fedora/Arch 上安装 `gtk4`，macOS 上执行 `brew install gtk4`，
Windows 上安装 GTK 运行时；如需 webview，再加上 WebKitGTK 6.0（Debian/Ubuntu 上为 `libwebkitgtk-6.0-4`）。
运行 [`samples/Gallery.Gtk4`]({{ site.github_url }}/tree/main/samples/Gallery.Gtk4)
（设置 `MF_GTK4_WEBVIEW=1` 可打开 webview 窗体）。另见
[Linux 上的 WinForms]({{ '/zh/winforms-on-linux/' | relative_url }})。

## Terminal 后端
{:#the-terminal-backend}

`Majorsilence.Forms.Terminal` 在终端中运行窗体。终端就是窗口，所以这是一个像手机一样的单视图宿主：
窗体填满屏幕，不绘制标题栏或标题按钮，它的 `Text` 会写入终端自己的标题。应用需要自己提供退出方式
（`Close ()`）；**Ctrl+C 总是退出**，并且永远不会传递给应用。弹出窗口合成在窗体之上；对话框显示期间
会替换整个屏幕。

```csharp
TerminalApplication.Use ();             // 或 Use (new TerminalOptions { … })
Application.Run (new MainForm ());
```

**输出模式。** 常规的 Skia 管线进行离屏渲染，画面以四种方式之一显示：

| 模式 | 分辨率 | 适用场景 |
|---|---|---|
| Kitty graphics | 终端的真实像素 | kitty、WezTerm、Ghostty |
| Sixel | 真实像素，256 色 | foot、mlterm、iTerm2、Contour、xterm `-ti vt340` |
| Blocks（无图形支持时的默认） | 每个单元格 2×4 像素，使用 Unicode 四分块字形 | 其他所有终端，以及在 tmux/screen 内部时始终如此 |
| Half-block | 每个单元格 1×2 像素 | 仅在锁定时使用，用于缺少四分块字形的字体 |

Blocks 模式把一个 300×80 的终端变成 600×320 的屏幕，在缩放 1 下可读。只有变化的单元格、区域或
16×8 单元格的图块才会重新发送，所以一次光标闪烁只是一个图块。

**检测与锁定。** 启动时宿主会询问终端支持什么（Kitty graphics、Kitty 键盘以及设备属性——后者也会列出
Sixel），而不是信任 `TERM`；真彩色也以同样方式确认。用 `MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel`
或 `TerminalOptions.GraphicsMode` 锁定一种模式；锁定的模式永远不会被覆盖。`MF_TERMINAL_SIXEL_MAX=WxH`
告诉宿主 xterm 的 `maxGraphicsSize` 已被调高（xterm 默认把 Sixel 图像截断在 1000×1000，所以窗体会被
调整到合适的尺寸），`MF_TERMINAL_TRACE=/path` 则记录原始回复、所选模式以及每个解码后的输入事件。

**输入。** 鼠标（点击、拖动、悬停、滚轮）和键盘（文本、方向键、导航键、F1–F12、修饰键）都从字节流中解码；
使用 Kitty graphics 时鼠标是像素级精确的。在终端提供 Kitty 键盘协议的地方它会被开启，从而得到真正的
按键释放、精确的修饰键和正确的非美式布局。窗体启动时没有任何控件获得焦点，所以使用方向键之前请先按一次 Tab。

**已验证**于 xterm 407（使用 `-ti vt340` 时为 Sixel；默认为 Blocks/真彩色）和 WezTerm（Kitty graphics，
锁定时为 Sixel）。**尚未验证：**kitty、Ghostty、foot、iTerm2、Windows Terminal、macOS Terminal、tmux，
以及 Windows 控制台 I/O（按 VT 模式编写，但未实际运行过）。原生文件选择器、`NativeControlHost` 和 web 视图
在终端中没有对应物。请在真彩色终端中运行
[`samples/Gallery.Terminal`]({{ site.github_url }}/tree/main/samples/Gallery.Terminal)。

## WinForms 与 WPF 后端（迁移）
{:#the-winforms-and-wpf-backends-migration}

这两个后端只为一个目的而存在：**在 Windows 上进行增量迁移**。WinForms 或 WPF 应用把它的外壳、菜单和窗口
留在真正的工具包上，而单个屏幕或控件逐步迁移到 Majorsilence.Forms——每个移植完成的部分都以标准的
`System.Windows.Forms.Control` 或 WPF `FrameworkElement` 的形式放回原处。WinForms *控件库*可以移植其内部
实现，同时仍向使用者提供 WinForms 控件。全部移植完成后，把包换成 `Majorsilence.Forms.Avalonia`，
同一份代码就能跨平台运行；接缝之上没有任何改动。两者除了 `net8.0-windows`/`net10.0-windows` 之外还面向
**`net48`**，所以 .NET Framework 4.8 应用无需先迁移到现代 .NET 就能开始迁移。

**`Majorsilence.Forms.WinForms`** 在经典的 Win32 消息泵上承载真正的 `System.Windows.Forms` 窗口，
并通过一个基于 GDI 的控件呈现 Skia。WinForms 的输入本来就是设备像素，它的 `Keys`/`MouseButtons` 枚举
在数值上与 Majorsilence.Forms 的完全相同，所以转换只是一次强制类型转换。弹出窗口是无边框的工具窗口；
`TryGetPlatformHandle` 返回真实的 HWND。当没有配置后端时，presenter 会自动安装后端，所以应用现有的
`Application.Run` 就能服务一切：

```csharp
using Majorsilence.Forms.WinForms;

var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// 或者把整个 MF Form 作为原生模态对话框交给 WinForms
System.Windows.Forms.Form native = myMfForm.ToWinFormsForm ();
native.ShowDialog (ownerWinFormsForm);
```

已通过 `samples/EmbeddingWinForms` 在 Windows 上交互式验证：渲染、鼠标和键盘输入、组合框下拉弹出窗口、
`NativeControlHost` 叠加层以及 `ToWinFormsForm()` 模态对话框。未实现：手势（WinForms 没有手势 API）
和 `IWebViewFactory`（依赖 webview 的兼容控件会回退）。在 Windows 之外，现代 .NET 的行会构建为一个空占位，
以便跨平台解决方案在任何地方都能编译。

**`Majorsilence.Forms.Wpf`** 在真正的 WPF `Window` 和 `Dispatcher` 循环上具有相同的形态，Skia 通过
`WriteableBitmap` 呈现，使用 `Microsoft.Win32` 文件对话框和 `System.Windows.Clipboard`。`NotifyIcon`
使用真正的 `System.Windows.Forms.NotifyIcon`，因为 WPF 没有这个控件。显式选择它，或者进行嵌入：

```csharp
Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();   // 由 MF 拥有应用
Application.Run (new MainForm ());

myWpfGrid.Children.Add (myMfControl.ToWpfElement ());                  // 或者嵌入到 WPF 应用中
```

[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf) 在它上面运行完整的控件库。

**与 `WindowsFormsInterop` 的关系。** 两者都为增量迁移而存在，但解决的是不同层面的问题。
`Majorsilence.Forms.WindowsFormsInterop` 在 WinForms 应用与运行在 Avalonia 后端上的 Majorsilence.Forms
之间桥接**整个窗体**，共享同一个消息泵。WinForms 后端则把 Avalonia 从方案中移除，以**控件**为粒度工作。
二者可以共存——presenter 不会动已经配置好的后端。对于公共 API 以 WinForms 类型声明的控件库，还有第三个选项：
`Majorsilence.Forms.WinFormsShims.Compat` 源生成器；参见[迁移指南]({{ '/zh/migration/' | relative_url }})。

## 触摸手势
{:#touch-gestures}

`Control` 为触摸和笔输入提供了纯增量的事件：`LongPress`、`Pinch`（双指缩放和双指旋转合在一起）、
`Swipe`，以及 `ScrollGesture`——连续的拖动平移，在接触点抬起后仍会在平台的惯性阶段以衰减的增量持续触发，
这就是整个轻扫滚动（flick-scrolling）的实现。这些事件都不会由鼠标触发。`ScrollableControl` 把 `ScrollGesture`
应用到 `AutoScrollPosition`，`ListBox` 和 `TreeView` 以同样的方式平移自己的滚动条，`LongPress` 默认打开
`ContextMenu`。手势点在接缝处被转换为逻辑单位，所以在任何缩放下命中测试都是正确的。

**Avalonia** 和 **Uno** 后端实现了手势，无论 Majorsilence.Forms 是拥有窗口还是被嵌入。两种手势模型在底层
有所不同——Avalonia 附加专用的识别器，这些识别器自身只对触摸/笔生效；WinUI/Uno 则有一条统一的操作
（manipulation）流，不做这种区分，以不同的单位报告速度，并且没有原生的轻扫——所以 Uno 后端会过滤鼠标指针、
转换速度并合成 `Swipe`。这其中需要的判断逻辑位于核心的 `GestureHeuristics` 中并有单元测试，
因为两者都无法在没有多点触控硬件的情况下验证。其他后端不触发任何手势事件。

## 承载原生元素
{:#hosting-native-elements}

`INativeControlHostBackend` 是一项可选能力，由 **Avalonia、Uno、WinForms、WPF 和 GTK 4** 后端实现，
Headless 和 Terminal 上没有。它让 `NativeControlHost` 控件预留一块矩形区域，由后端用真正的工具包元素
填充——Avalonia 的 `Control`、Uno 的 `UIElement`、`System.Windows.Forms.Control`、`Gtk.Widget`——
叠放在 Skia 表面之上，并与占位控件的边界、裁剪和可见性保持对齐。GTK 4 是通常空域限制的例外：
它把每个组件合成到同一棵渲染树中，所以被承载的组件能正确裁剪和混合。

`IWebViewFactory` 是 `WebBrowser` 背后的姊妹能力：Avalonia 桌面上是 WebView2 / WKWebView / WebKitGTK，
GTK 4 上是 WebKitGTK，Headless、浏览器、Terminal 和 WinForms 后端上则没有。

关于如何使用它、它的空域限制、为什么原生句柄无法伪造，以及为什么视频通常更适合用绘制到 Skia 的帧回调
而不是承载的原生表面来实现，参见[原生互操作]({{ '/zh/native-interop/' | relative_url }})。

## 移动端能力
{:#mobile-capabilities}

还有少数几个可选接缝，主要服务于 Avalonia 后端的 Android 和 iOS 行。在其他地方一切都退化为空操作；
请检查 `IsSupported` 标志。

- **进程内音频**（`IAudioBackend`）。`Media.SoundPlayer` 和 `Media.SystemSounds` 在 Android 和 iOS 上
  通过后端播放，在桌面上回退到 `Media.NativeAudio`（启动操作系统的播放工具）。`Media.AudioPlayer`——
  音量、`AudioUsage`（例如 `Alarm`）、真正的 `Completed` 事件——没有桌面回退，只有在
  `AudioPlayer.IsSupported` 为 true 的地方才是真实可用的。
- **触觉反馈。** `Haptics.Tap`/`Impact`/`Vibrate`；`Haptics.IsSupported` 只在 Android 和 iOS 上为 true。
  `VIBRATE` 权限会自动合并到使用方应用的清单中。
- **本地通知。** `LocalNotifications.RegisterChannel`/`Show`/`Tapped`，目前仅限 Android；
  宿主的 `MainActivity` 会自行注册并转发 intent 和权限结果。
- **保持屏幕常亮。** `Application.KeepScreenAwake` 在除浏览器之外的每一行上都是真实可用的——Android、
  iOS、Windows（`SetThreadExecutionState`）、macOS（IOKit 电源断言）和 Linux（`systemd-inhibit`）。
  Headless 把它实现为一个可直接设置的普通假对象，供视图模型测试使用。
- **生命周期与返回键。** `Application.Suspended`/`Resumed` 和 `WindowBase.BackRequested` 由单视图宿主触发；
  其他每个后端已经从其真实窗口触发 `Activated`/`Deactivate`，并且没有什么需要挂起的。

与当前激活的 UI 后端无关的能力——`SecureStorage`、`Speech`（文本转语音）、`Launcher.OpenAsync`、
`FileSystem.OpenAppPackageFileAsync`——位于独立的 **`Majorsilence.Forms.Essentials`** 包中，
该包自行选择每个平台的实现，完全不经过 `Platform.Backend`。所有这些能力的每平台细节和验证状态见
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)。

## 添加另一个后端
{:#adding-another-backend}

新后端是一个新的程序集，引用 `Majorsilence.Forms`（核心）和目标工具包，实现 `IPlatformBackend` 和
`IWindowBackend`——以 Headless 为形态上的参照：在 `IPlatformBackend` 中驱动调度器和生命周期，
在 `IWindowBackend` 中呈现 Skia 表面（调用 `owner.RenderFrame`）并翻译输入（`owner.Handle*`），
并在核心项目中添加一条 `[InternalsVisibleTo]`。可选能力（`IWebViewFactory`、`INativeControlHostBackend`、
`IModalLoopSupport`……）可以以后再加，或者永远不加。

完整的接口列表以及本页所浓缩的每个后端的实现说明，参见仓库中的
[`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md)。
