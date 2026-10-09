---
layout: docs
lang: zh
title: 原生互操作
subtitle: 宿主原生内容、视频播放，以及为什么 Button 背后没有 HWND。
permalink: /zh/native-interop/
seo_title: "原生互操作——为什么 Control.Handle 不是 HWND"
description: >-
  在 Avalonia、Uno、WinForms、WPF 或 GTK 4 上，把原生内容——视频、地图、浏览器引擎——宿主到跨平台
  WinForms 控件内部，以及为什么这里的 Control.Handle 是 IntPtr.Zero。
keywords:
  - WinForms Control.Handle HWND
  - WinForms 跨平台 原生控件
  - WinForms 视频播放 跨平台
  - NativeControlHost SkiaSharp
  - WinForms 嵌入原生窗口
  - LibVLC WinForms Linux
priority: "0.7"
---

两个问题其实是同一个问题：

- *"我怎样把一个原生的东西——视频表面、地图视图、浏览器引擎——放进 Majorsilence.Forms 控件里？"*
- *"我怎样为一个控件获取 `HWND`，交给一个需要它的库？"*

第二个问题的简短回答是：**你做不到，也不应该伪造一个。**而你很少真的需要它，因为第一个问题有一个
真正的答案：[`NativeControlHost`](#the-seam-nativecontrolhost)。

把 Majorsilence.Forms 窗口宿主在真正的 WinForms 应用中是相反的方向，由
[`winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) 介绍。

## 为什么这里的句柄不是真的
{:#why-handles-arent-real-here}

Majorsilence.Forms 把所有绘制都做在单一的 Skia 表面上。每个后端都遵循其底层工具包的同一模型：
**每个顶级窗口对应一个宿主窗口——在桌面后端上是一个真正的操作系统窗口——而窗口内的一切都是绘制
出来的，而不是由原生子窗口组合而成。**一个 `Button` 就是画布上的一组绘制操作。它背后没有 `HWND`，
因为它背后没有操作系统对象。

| 成员 | 值 | 原因 |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | 不存在可以报告的按控件划分的操作系统窗口。读取它仍然保留上游的副作用——它会创建控件的句柄状态，使 `IsHandleCreated` 变为 true 并触发 `HandleCreated`，这正是 `_ = control.Handle;` 这种写法的用意。`ImageList.Handle`、`TreeNode.Handle`、`Cursor.Handle`、`TaskDialog.Handle` 的值相同。 |
| `WindowBase.Handle` | 一个不透明的非零令牌 | **不是 `HWND`。**WinForms 代码经常在 `Invoke` 之前读取 `.Handle` 来强制创建句柄，返回零会破坏这个惯用法。它只在托管代码内部有意义。 |
| `WindowBase.PlatformHandle` | 真正的原生句柄，或 `IntPtr.Zero` | 货真价实的句柄，通过 `IWindowBackend.TryGetPlatformHandle()` 获取。由 Avalonia 后端实现——Windows 上是 `HWND`，macOS 上是 `NSWindow`，X11 上是 `XID`——以及仅限 Windows 的 WinForms 后端，它返回其窗体的 `HWND`。在 Uno 和 Headless 上目前为零。 |

### 关于伪造的规则
{:#the-rule-about-faking}

一个编造出来的句柄**只有在它始终在你控制的托管代码中往返**时才是安全的——`WindowBase.Handle`
做的正是这件事，也仅限于此。一旦它跨入原生代码，就不再安全。

原生库并不只是存储你交给它们的句柄。LibVLC 的 `libvlc_media_player_set_hwnd`、mpv 的 `--wid`、
GStreamer 的 `GstVideoOverlay.set_window_handle` 都会把它继续传给操作系统——`SetParent`、
`CreateWindowEx`、`GetClientRect`、`SetWindowPos`、`XReparentWindow`。把一个编造的数字交给它们
会得到两种结果之一，而第二种更糟：

1. 调用失败，你得到一个黑色矩形，或者原生库内部崩溃。
2. 调用*针对属于别人的某个窗口成功了*。`HWND` 是句柄表索引，不是指针，小整数都是活跃的值。
   一个哈希码恰恰就是会与真实窗口碰撞的那种数字。

所以：永远不要为任何会到达操作系统的东西合成句柄。请使用下面两条路线之一。

## 接缝（seam）：`NativeControlHost`
{:#the-seam-nativecontrolhost}

`Majorsilence.Forms.NativeControlHost` 是一个为底层工具包的原生元素**预留一块矩形区域**的 `Control`。
它自己不绘制任何内容；后端把真正的元素叠加在 Skia 表面之上，并让它与占位符的边界保持对齐。在大多数
后端上，这就是"空域（airspace）"互操作模型——原生元素无法合成进 Skia 缓冲区，所以它们被定位在其
上方。GTK 4 是例外，见下文。

```csharp
var host = new NativeControlHost { Dock = DockStyle.Fill };
host.NativeControl = someAvaloniaControl;   // 或者 Uno 的 UIElement、WinForms 的 Control、Gtk.Widget……
panel.Controls.Add (host);
```

宿主会跟踪边界、所有可滚动祖先的裁剪区域交集，以及整条父链上的有效可见性，并把这三者全部转发给后端。
在绘制时和可见性变化时会自动重新同步；如果你在正常绘制周期之外移动或调整宿主的大小，请自己调用
`SyncNativeControl()`。

`INativeControlHostBackend` 是一项可选的后端能力（见[后端]({{ '/zh/backends/' | relative_url }})）。
哪些后端实现了它，以及它们期望什么：

| 后端 | `NativeControl` 期望的类型 | 行为 |
|---|---|---|
| Avalonia（窗口宿主、单视图宿主、呈现器） | `Avalonia.Controls.Control` | 添加到 Skia 表面之上的叠加 `Canvas` 中。 |
| Uno（窗口宿主、呈现器） | `Microsoft.UI.Xaml.UIElement` | 添加到 `SKXamlCanvas` 之上的根 `Canvas`/面板中。 |
| WinForms / WPF（窗口宿主、呈现器） | `System.Windows.Forms.Control` / `System.Windows.FrameworkElement` | 添加到 Skia 控件之上的叠加层中。 |
| GTK 4（窗口宿主、呈现器） | `Gtk.Widget` | 作为 `Gtk.Overlay` 的子项添加到 `Gtk.DrawingArea` 之上。**没有空域问题**——GTK 把每个 widget 都合成到同一棵渲染树中，所以被宿主的 widget 和其他任何 widget 一样裁剪和混合。 |
| Headless、Terminal | — | 不实现该能力；宿主渲染为一个空的占位符。 |

> **赋予错误的类型会静默失败。**每个后端都会对 `NativeControl` 做类型检查，不匹配就直接返回。
> 不抛异常，不记日志，屏幕上什么也不出现。如果你的原生内容不可见，先检查类型——把 Avalonia 的
> `Control` 交给 Uno 后端，或者反过来，产生的正是这种现象。

### 空域限制
{:#airspace-limitations}

以下限制适用于 Avalonia、Uno、WinForms 和 WPF 后端上任何被宿主的原生元素，它们是模型固有的，而不是
有待修复的缺陷：

- 原生元素绘制在整个 Majorsilence.Forms 场景的**上方**。它无法在 Majorsilence 控件之间按 z 顺序排列，
  任何在视觉上与它重叠的东西——下拉列表、工具提示、上下文菜单——都会被绘制在它下面。
- 裁剪只能是矩形的。来自 Majorsilence 一侧的旋转、非矩形裁剪和不透明度都不会作用于它。
- 滚动可以工作，但并非没有代价：叠加层在每次同步时重新定位，所以在快速滚动期间它可能明显落后于
  Skia 内容。尽可能把被宿主的元素放在不滚动的区域。

**GTK 4 是例外。**Skia 表面位于一个 `Gtk.Overlay` 内，被宿主的 widget 是叠加层的子项，但 GTK 4 把每个
widget 都合成到同一棵渲染树中——所以被宿主的 widget 和其他任何 widget 一样按 z 顺序排列、裁剪和混合，
上述所有注意事项都不适用。唯一的折中：部分滚出视口的宿主会把它的原生 widget *重新布局*到可见框内，
而不是在裁剪之下平移它，因此滚到一半的 widget 会重新布局到更小的矩形，而不是被截断。

## 路线 A——宿主真正的原生内容
{:#route-a--hosting-real-native-content}

当你需要的东西确实必须是一个操作系统窗口时使用这条路线：GPU 加速的视频表面、原生地图或 CAD 视图、
浏览器引擎。

重点在于你**不是在伪造句柄——而是在创建一个真正的句柄**，并把它交给原生库。`NativeControl` 接受的是
工具包对象而不是句柄，所以中间有一个包装步骤。`AvaloniaWebViewHandle`（在 `Majorsilence.Forms.Avalonia`
中）和 `Gtk4WebViewHandle`（在 `Majorsilence.Forms.Gtk4` 中）是代码树中已有的完整示例：它们包装
`Avalonia.Controls.NativeWebView` / `WebKit.WebView`，并以 `IWebViewHandle.NativeControl` 的形式暴露出来。

**GTK 4 是简单情形。**`WebKit.WebView` 就是一个 `Gtk.Widget`；后端把它添加到 Skia 表面之上的
`Gtk.Overlay` 中，GTK 把它合成进同一棵渲染树——不需要创建句柄，没有空域问题，也没有平台覆盖范围的
注意事项。完整的 `IWebViewHandle`（导航事件、JS 求值、脚本消息桥）是通过 `IWebViewFactory` 针对
WebKitGTK 6.0 实现的，`WebBrowser` 和基于 webview 的兼容控件在该后端上用的就是它。

**Avalonia。**继承 `Avalonia.Controls.NativeControlHost` 并重写
`CreateNativeControlCore (IPlatformHandle parent)`，它返回一个真正的 `IPlatformHandle`——Windows 上是
`HWND`，X11 上是 `XID`，macOS 上是 `NSView`。在那里创建你的子窗口，把它的句柄交给播放器，在
`DestroyNativeControlCore` 中释放它，然后把得到的 Avalonia 控件赋给 `NativeControlHost.NativeControl`。

**Uno。**`Uno.UI.NativeElementHosting` 公开了 `Win32NativeWindow(IntPtr Hwnd)` 和
`X11NativeWindow(IntPtr WindowId)`——对你创建的句柄的公共包装——以及用于 WASM 的 `BrowserHtmlElement`。
把其中一个设为 `ContentPresenter` 的 `Content`，再把它交给 `NativeControl`。

**平台覆盖范围：基于句柄的路径实际上只有 Windows 和 X11。**Wayland 需要子表面（subsurface），macOS
给你的是 `NSView` 而不是任何 `HWND` 形状的东西，而 WASM/Android/iOS 根本不提供可用的窗口句柄。以这种
方式构建的功能无法在框架其余部分能运行的所有地方运行。GTK 4 的 widget 路径没有这种限制——GTK 4 能
运行的地方它都能运行，包括 Wayland。

## 路线 B——不用句柄的视频（推荐）
{:#route-b--video-without-a-handle-recommended}

大多数视频库可以把**解码后的帧**交给你，而不是接收一个窗口，这就把句柄从问题中完全移除了：LibVLC 的
`libvlc_video_set_callbacks`（`vmem`）、mpv 软件模式下的渲染 API、GStreamer 的 `appsink`，或者
FFmpeg——在那里帧本来就归你所有。

你收到一个像素缓冲区，把它复制进 `SKBitmap`，然后像其他任何控件一样在 `OnPaint` 中绘制它：

```csharp
public class VideoView : Control
{
    private SKBitmap? frame;

    // 由解码器自己的回调线程调用，传入一帧刚解码好的 BGRA 数据。
    // 设置输出格式时向库请求 width * 4 的行间距（pitch），这样传入的缓冲区
    // 是紧密打包的，与 SKBitmap 的行布局一致。
    public void PresentFrame (ReadOnlySpan<byte> bgra, int width, int height)
    {
        if (frame is null || frame.Width != width || frame.Height != height) {
            frame?.Dispose ();
            frame = new SKBitmap (width, height, SKColorType.Bgra8888, SKAlphaType.Premul);
        }

        // 一次批量复制，而不是逐像素：SKBitmap.SetPixel 每次调用都是一次 P/Invoke，
        // 对一帧百万像素的图像来说要花几秒而不是几毫秒。
        bgra.CopyTo (frame.GetPixelSpan ());
        frame.NotifyPixelsChanged ();

        // Invalidate() 不会做线程封送——它会一路走到窗口并在你调用它的任何线程上
        // 把窗口标记为脏。请显式切换到 UI 线程。
        BeginInvoke (Invalidate);
    }

    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);
        if (frame is not null)
            e.Canvas.DrawBitmap (frame, new SKRect (0, 0, Width, Height));
    }
}
```

这个草图只用了一个位图，所以一次绘制可能在解码器写入下一帧的同时读取它——在高负载下表现为撕裂，
而不是崩溃。在两个位图之间交换（写入后备位图，再通过一次引用赋值发布）是常见的修复方法，任何超出
演示范畴的东西都值得这样做。

**为什么这是更好的默认选择。**帧成为 Skia 场景的一部分，所以 z 顺序、裁剪、滚动、不透明度和变换
的行为都和其他任何控件一样——空域方面的注意事项一个都不适用。它在每个后端上都能工作，包括 Headless
和 WASM，这也使它可测试：你可以对渲染出来的像素做断言。代价是每帧一次 CPU 复制和软件解码。

## 如何选择
{:#choosing}

| | 路线 A（原生宿主） | 路线 B（帧回调） |
|---|---|---|
| 与 Majorsilence 内容合成 | 否——绘制在上方（GTK 4：是） | 是 |
| 后端 | Avalonia、Uno、WinForms、WPF、GTK 4 | 全部，包括 Headless 和 Terminal |
| 平台 | 实际上只有 Windows、X11（GTK 4：还有 Wayland） | 所有平台 |
| GPU 解码路径 | 是 | 否（软件解码 + 复制） |
| 可在 CI 中测试 | 否 | 是 |
| 需要真正的操作系统句柄 | 是（创建一个——绝不伪造）；GTK 4：否，用 `Gtk.Widget` | 否 |

视频默认选 **B**。当你需要浏览器引擎、硬件解码，或者只会往窗口里绘制的第三方原生视图时，再选 **A**。

## 已知缺口
{:#known-gaps}

- **Uno 没有实现 `TryGetPlatformHandle`**，所以在 Uno 上 `WindowBase.PlatformHandle` 是
  `IntPtr.Zero`，尽管 Uno 的公共包装器（`Win32NativeWindow.Hwnd`、`X11NativeWindow.WindowId`）
  本可以填补这个缺口。这也意味着平台辅助功能桥在 Uno 上无法挂接。
- **框架中不附带任何媒体或视频控件。**上面两条路线都是集成指导，而不是一个可以直接实例化的
  `VideoView`。
- **路线 A 的 Uno 路径是根据公共 API 表面写成的，而不是来自一个运行中的应用。**Avalonia 路径在
  代码树中由 `AvaloniaWebViewHandle` 实际运用，GTK 4 路径由 `Gtk4WebViewHandle` 实际运用（已在
  Wayland 上针对 WebKitGTK 6.0 验证）；Uno 的对应实现则没有。

完整细节见仓库中的
[`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md)。
