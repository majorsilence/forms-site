---
layout: docs
lang: zh
title: 示例
subtitle: 用 Majorsilence.Forms 构建的真实应用，今天就在仓库里。
permalink: /zh/samples/
seo_title: "跨平台 WinForms 示例与演示应用"
description: >-
  可直接运行的跨平台 WinForms 真实应用：一个 Windows 资源管理器克隆、一个 Outlook 克隆、
  一个客户端/服务器收银（POS）应用、一个实时 CSS 主题工作室，以及在桌面、GTK 4、浏览器、
  移动端乃至终端中运行的完整控件库。
keywords:
  - winforms 示例
  - 跨平台 winforms 示例
  - c# winforms linux macos 演示
  - winforms 控件库
  - winforms css 主题
  - winforms 收银系统示例
  - winforms gtk4
  - winforms 终端界面
priority: "0.8"
---

所有示例都位于仓库的 [`samples/`]({{ site.github_url }}/tree/main/samples) 目录下。
除非另有说明，每个示例都可以用 `dotnet run --project samples/<Name>` 运行，并且只需要
.NET 10 SDK。

| 示例 | 展示内容 | 平台 |
|---|---|---|
| [`ControlGallery`](#controlgallery) | 每一个内置控件（这是一个库——见下方各宿主头） | — |
| [`Gallery.Avalonia`](#galleryavalonia) | 默认后端上的控件库，含无头（Headless）渲染 | Windows、macOS、Linux |
| [`Gallery.Uno`](#galleryuno) | 同一个控件库运行在 Uno 后端上 | 桌面（已在 macOS 上验证） |
| [`Gallery.Gtk4`](#gallerygtk4) | 同一个控件库运行在 GTK 4 后端上（gir.core） | 装有 GTK 4 的桌面（已在 Wayland 上验证） |
| [`Gallery.Wasm`](#gallerywasm) | 同一个控件库运行在浏览器中 | WebAssembly |
| [`Gallery.Android`](#galleryandroid) | 同一个控件库运行在 Android 上 | Android |
| [`Gallery.iOS`](#galleryios) | 同一个控件库运行在 iOS 上 | iOS |
| [`Gallery.Terminal`](#galleryterminal) | 同一个控件库运行在终端中 | 控制台 / ANSI 终端 |
| [`Gallery.Wpf`](#gallerywpf) | 同一个控件库运行在 WPF 后端上 | Windows |
| [`Explorer`](#explorer) | 一个 Windows 资源管理器克隆 | Windows、macOS、Linux |
| [`Outlaw`](#outlaw) | 一个 Outlook 克隆 | Windows、macOS、Linux |
| [`PointOfSale`](#pointofsale) | 一个完整的客户端/服务器业务（LOB）应用 | Windows、macOS、Linux |
| [`ThemeStudio`](#themestudio) | 实时 CSS 主题编辑器与预览 | Windows、macOS、Linux |
| [`ThemeStudio.WinForms`](#themestudiowinforms) | 同一个 Studio，作用于真实的 `System.Windows.Forms` 控件 | Windows |
| [`EmbeddingAvalonia` / `EmbeddingUno` / `EmbeddingWinForms` / `EmbeddingGtk4`](#embedding) | Majorsilence.Forms 被托管在原生应用*内部* | 桌面（WinForms：仅 Windows；Gtk4：需要 GTK 4） |
| [`WinFormsInterop`](#winformsinterop) | 与 `System.Windows.Forms` 的双向互操作 | Windows |
| [`WinFormsCompatDemo`](#winformscompatdemo) | 源生成的 `System.Windows.Forms` 命名空间，不含真实 WinForms 程序集 | Windows、macOS、Linux |
| [`AutomationTarget`](#automationtarget) | 一个暴露自身自动化端点的应用 | Windows、macOS、Linux |

要试用这些控件库宿主头，你不必自己构建任何一个。CI 会发布浏览器包（`gallery-wasm`）、可侧载的
Android APK + AAB（`gallery-android`，使用 .NET Android 调试密钥签名——适合侧载，不适合上架 Play
商店）、打包为 zip 的 iOS 模拟器 `.app`（`gallery-ios`；没有已签名的真机 `.ipa`），以及面向 Windows、
Linux 和 macOS 的自包含 ThemeStudio 二进制文件，并把它们全部附加到每个
[GitHub Release]({{ site.github_url }}/releases) 上。

## ControlGallery
{:#controlgallery}

每一个内置控件，实时运行，每个控件一个演示面板。`ControlGallery` 本身是一个与后端无关的
**库**——共享的 `MainForm` 和各演示面板——它不引用任何后端，因此每个后端都有一个很薄的应用
宿主头来托管它，而不会把其他后端的依赖拖进进程。请运行下面任意一个 `Gallery.*` 宿主头。

## Gallery.Avalonia
{:#galleryavalonia}

桌面宿主头，运行在默认（Avalonia）后端上：

```
dotnet run --project samples/Gallery.Avalonia
```

它也能以无头方式渲染，适合 CI 和像素级比对检查：

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

## Gallery.Uno
{:#galleryuno}

同一个控件库运行在 **Uno** 后端上——可覆盖桌面、iOS、Android 和 WebAssembly。

```
dotnet run --project samples/Gallery.Uno
```

它需要一个窗口会话，因此不属于无头 CI 构建的一部分；它的 Uno 包通过示例自带的 `nuget.config`
从 nuget.org 还原。已在 macOS 上验证可以启动并渲染完整的控件库。

## Gallery.Gtk4
{:#gallerygtk4}

同一个控件库运行在 **GTK 4** 后端上（gir.core）——一个真实的 `Gtk.Window`，以 Linux 为先。

```
dotnet run --project samples/Gallery.Gtk4                    # 完整的 ControlGallery
MF_GTK4_DEMO=1 dotnet run --project samples/Gallery.Gtk4     # 极小的渲染 + 输入冒烟窗体
MF_GTK4_WEBVIEW=1 dotnet run --project samples/Gallery.Gtk4  # 基于 WebKitGTK 6.0 的 WebBrowser
```

它需要一个显示会话（X11/Wayland）以及 GTK 4 原生库（webview 窗体还额外需要
`libwebkitgtk-6.0`），因此不属于无头 CI 构建的一部分。它的 `GirCore.*` 包通过示例自带的
`nuget.config` 从 nuget.org 还原。`MF_GTK4_SELFTEST=1` 会运行一次非交互式检查然后退出。已在
Wayland 上验证可以启动并渲染完整的控件库。GTK 4 后端目前能做什么、还不能做什么，见
[平台后端]({{ '/zh/backends/' | relative_url }})。

## Gallery.Wasm
{:#gallerywasm}

还是同一个控件库，这次运行在浏览器中，使用 Avalonia 后端的 `net10.0-browser` 目标——
**[在线试用]({{ '/gallery/' | relative_url }})**，无需安装。它是编译为 WebAssembly 的真实框架，
所以首次加载会下载 .NET 运行时。

要自己构建，你需要先安装一次 wasm-tools 工作负载：

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

然后用任意静态文件服务器托管 `out/wwwroot` 并打开 `index.html`——WebAssembly SDK 项目不像
普通 exe 那样由 `dotnet run` 直接提供服务。或者跳过工具链：CI 在每个 PR 上构建的 `gallery-wasm`
包都附加在每个 GitHub Release 上。构建细节和当前限制见
[平台后端]({{ '/zh/backends/' | relative_url }}#running-in-the-browser-webassembly)。

> **已知缺口：**控件库的图标在浏览器中（以及在 Android 和 iOS 上）不会渲染——本应预加载它们的
> `WasmFilesToIncludeInFileSystem` 项被 WebAssembly SDK 静默忽略，因此 `Bitmap(string)` 退化为
> 1×1 的占位图。应用能干净地启动，只是图标不可见。

浏览器宿主头还带有**浏览器端检查**：用 `?check=<name>` 打开已发布的包，页面就会运行一项检查而
不是控件库——阻塞式模态调用（它们在浏览器上会抛出异常，并指出对应的异步版本）、它们的可等待
形式、一项无障碍 DOM 检查和四项渲染检查——并把 `MFCHECK` 行写到控制台。`tools/modal-check.mjs`
在无头 Chrome 中运行全部检查，CI 在 `wasm` 作业中带 `--expect` 运行它；同一个窗体也链接进了
Android 和 iOS 宿主头，各自带有自己的 `tools/modal-check.sh`。名称、环境变量和预期结果都在仓库的
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md#gallerywasm) 中。

## Gallery.Android（仅 Android，开发中）
{:#galleryandroid}

还是同一个 `ControlGallery` `MainForm`，运行在 Avalonia 后端的 Android 目标上，由单个 Activity
托管。需要 `android` 工作负载：

```
dotnet workload install android
dotnet build samples/Gallery.Android -t:Run
```

一旦安装了该工作负载，`Directory.Build.props` 会检测到它，并自动把这个项目从存根构建切换为真正的
`net10.0-android` 宿主头——因此在仓库根目录执行普通的 `dotnet build` / `dotnet test` 永远不需要
该工作负载，而 Visual Studio 用 F5 对着模拟器直接就能跑。传入 `-p:EnableAndroidTarget=true` 可以
强制启用；这个开关没有门控，所以缺少工作负载时会让构建失败，而不是静默回退到存根。

> Android 支持尚处早期。它已经经过一轮初步的真机测试——控件库能够启动（在那里发现并修复了一个
> AppCompat 主题导致的启动崩溃），点击命中测试、渲染缩放和触摸滚动/快速滑动已确认在硬件上可用——
> 但屏幕键盘、安全区边距、旋转以及完整的控件覆盖还没有经历与桌面和浏览器后端同等程度的测试。
> 预计会有一些粗糙之处。

CI 在每个 PR 上发布可侧载的 APK + AAB（产物 `gallery-android`），并附加到每个 GitHub Release 上。
Android 与浏览器共用同一个单视图宿主，因此同样的窗口外观和 WebView 限制也适用——见
[平台后端]({{ '/zh/backends/' | relative_url }})。

## Gallery.iOS（仅 iOS，未经验证）
{:#galleryios}

iOS 版对应物，由单个 `UIViewController` 托管。需要一台装有 `ios` 工作负载的 Mac：

```
dotnet workload install ios
dotnet build samples/Gallery.iOS -t:Run
```

和 `Gallery.Android` 一样，一旦存在移动端工作负载，`Directory.Build.props` 就会自动把它从存根切换为
真正的 `net10.0-ios` 宿主头——但只在 macOS 上，因为 `ios` 工作负载在别处并不存在。用
`-p:EnableIOSTarget=true` 强制启用；优先用它而不是 `EnableMobileHeads` 这个总开关，因为后者在一台
没有 `android` 工作负载的 Mac 上还会要求 `net10.0-android` 这一行，从而失败。

> iOS 是验证最少的后端：它是依据 Avalonia.iOS 的 API 表面和标准的 .NET for iOS 约定编写的。CI 的
> `ios` 作业（在 `macos-latest` 上）现在会编译真正的宿主头并在模拟器中启动它作为冒烟检查——但该作业
> 仍是 `continue-on-error`，而且还没有人在真机上交互式地运行过它。把粗糙之处视为预期之内，而不是
> 回归。

当构建成功时，CI 会在每个 PR 上发布打包为 zip 的 iOS 模拟器 `.app`（产物 `gallery-ios`），并附加到
每个 GitHub Release 上。没有已签名的真机 `.ipa`——那需要 Apple 分发证书。

## Gallery.Terminal
{:#galleryterminal}

同一个控件库运行在 **Terminal** 后端上：窗体铺满整个终端，没有标题栏，就像它铺满手机屏幕一样。
Skia 在屏外渲染，在终端支持的情况下以 Kitty 图形或 Sixel 按终端的真实像素分辨率显示，否则以
Unicode 方块元素显示。

```
dotnet run --project samples/Gallery.Terminal                       # 完整的 ControlGallery
MF_TERMINAL_DEMO=1 dotnet run --project samples/Gallery.Terminal    # 改为一个小的冒烟窗体
```

请在真彩色终端中运行。输出模式通过询问终端来确定；`MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel`
可强制指定一种，`MF_TERMINAL_SCALE=0.5` 则把窗体布局在一块比像素网格大一倍的画布上（在经典的
半方块模式下很有用）。鼠标和键盘可用；Ctrl+C 总是退出。目前已在 xterm 和 WezTerm 中验证。该后端的
限制（没有原生选择器、`NativeControlHost` 或 Web 视图）见
[平台后端]({{ '/zh/backends/' | relative_url }})。

## Gallery.Wpf（仅 Windows）
{:#gallerywpf}

同一个控件库运行在 **WPF** 后端上——一个真实的 WPF `Window`，Skia 通过 `WriteableBitmap` 呈现。
WPF 不是自动解析的默认后端，因此该宿主头会在第一个窗口之前显式安装它
（`Platform.Backend = new WpfPlatformBackend ();`）。

```
dotnet run --project samples/Gallery.Wpf
```

和 WinForms 后端一样，这是一个仅限 Windows 的*迁移*后端——见
[平台后端]({{ '/zh/backends/' | relative_url }})。

## Explorer
{:#explorer}

一个 Windows 资源管理器的克隆——文件浏览、树形导航和列表视图，端到端地检验核心控件集。项目位于
`samples/Explorer`，名为 `Explore.csproj`。

```
dotnet run --project samples/Explorer
```

已在 Windows、Ubuntu 和 macOS 上验证运行。

## Outlaw
{:#outlaw}

一个 Microsoft Outlook 的克隆，展示 Majorsilence.Forms 能撑起一个复杂、多窗格、贴近真实世界的
应用形态，而不只是一个玩具演示。

```
dotnet run --project samples/Outlaw
```

## PointOfSale
{:#pointofsale}

一个完整的业务（LOB）应用，拆分为四个项目，而不是单窗口演示——这就是一个真实的 Majorsilence.Forms
应用所采用的形态：

| 项目 | 角色 |
|---|---|
| `PointOfSale.Client` | Majorsilence.Forms 桌面应用（窗体、面板、自定义控件、服务） |
| `PointOfSale.Api` | 一个带 JWT 身份验证和基于角色的策略的 ASP.NET Core 最小 API |
| `PointOfSale.Contracts` | 双方共享的 DTO |
| `PointOfSale.Data` | EF Core + SQLite 持久化与种子数据（由 `tests/PointOfSale.Data.Tests` 覆盖） |

先启动 API，再启动客户端——客户端从自己的 `appsettings.json` 读取 `ApiBaseUrl`（以及它的
自助终端模式设置），默认值为 `http://127.0.0.1:5000`：

```
dotnet run --project samples/PointOfSale/PointOfSale.Api
dotnet run --project samples/PointOfSale/PointOfSale.Client
```

API 首次运行时会创建并填充本地的 `pos.db`。`appsettings.json` 中默认的 JWT 签名密钥只是占位符，
不是机密——请在 `appsettings.Development.json` 或环境变量中覆盖它。源码：
[`samples/PointOfSale`]({{ site.github_url }}/tree/main/samples/PointOfSale)。

## ThemeStudio
{:#themestudio}

一个用来编写 CSS 主题的桌面应用：左侧是 CSS 编辑器，右侧是每种可换主题控件各一个，下方是解析器的
诊断信息。每次编辑都会重新应用样式表（也作用于 Studio 自己的窗口），打开的文件会在磁盘上被监视，
因此外部编辑器或编码助手都可以驱动它，而 **Copy reference for AI** 会把完整的主题参考放到剪贴板，
方便向助手提问。

```
dotnet run --project samples/ThemeStudio                                           # 从 Light 主题的 CSS 开始
dotnet run --project samples/ThemeStudio -- samples/ThemeStudio/Themes/ocean.css   # 打开并监视一个主题
dotnet run --project samples/ThemeStudio -- --render-headless out.png samples/ThemeStudio/Themes/paper.css --tab 1
```

最后一种形式会在没有显示器的情况下把预览渲染为 PNG（选项卡：0 输入控件，1 列表和网格，2 菜单和
窗口外观，3 令牌色板，4 原生 Avalonia），并在主题有错误时以非零状态退出。选项卡 4 托管真实的
Avalonia 控件，它们通过 `Majorsilence.Forms.Theming.Avalonia` 由同一张样式表换上主题。

`samples/ThemeStudio/Themes/` 附带了可作为起点的示例主题：`light.css` 和 `dark.css`（一对配套主题，
共用同一个强调色，因此应用切换模式时不会有任何东西移位）、`ocean.css`、`graphite.css`、`paper.css`
和 `parchment.css`。面向 `win-x64`、`linux-x64` 和 `osx-arm64` 的预构建、自包含 ThemeStudio
二进制文件附加在每个 GitHub Release 上。主题参考本身是仓库中的
[`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md)。

## ThemeStudio.WinForms（仅 Windows）
{:#themestudiowinforms}

Theme Studio 面向**真实 `System.Windows.Forms`** 应用的仅限 Windows 的宿主头：同样的编辑器和诊断，
外加一个预览，展示应用器所映射的每种 WinForms 控件各一个，并通过 `Majorsilence.Forms.Theming.WinForms`
换上主题。诊断列表会在解析器自己的诊断之外，再加上 WinForms 无法表达的内容（信息 / 警告）。

```
dotnet run --project samples/ThemeStudio.WinForms                                              # 从 Light 主题的 CSS 开始
dotnet run --project samples/ThemeStudio.WinForms -- samples/ThemeStudio/Themes/graphite.css   # 打开并监视一个主题
dotnet run --project samples/ThemeStudio.WinForms -- --screenshot out.png samples/ThemeStudio/Themes/graphite.css
```

`--screenshot` 用 `Control.DrawToBitmap` 渲染预览——WinForms 没有无头后端，所以仍然需要桌面会话——
并在出现解析错误时以非零状态退出。一个 `win-x64` 构建与 ThemeStudio 二进制文件一起附加在每个
GitHub Release 上。见
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md)。

## EmbeddingAvalonia / EmbeddingUno / EmbeddingWinForms / EmbeddingGtk4
{:#embedding}

反过来的方向：一个普通的 Avalonia、Uno、经典 WinForms 或 GTK 4 应用，把 Majorsilence.Forms 的
控件和窗口当作自己的原生控件和窗口来使用，而不是让 Majorsilence.Forms 拥有顶层窗口。

```
dotnet run --project samples/EmbeddingAvalonia
dotnet run --project samples/EmbeddingUno
dotnet run --project samples/EmbeddingWinForms   # 仅 Windows
dotnet run --project samples/EmbeddingGtk4       # 需要显示器 + GTK 4
```

每个窗口都把原生宿主控件和一个嵌入的 Majorsilence.Forms 场景并排放置：

- `ToAvaloniaControl()` / `ToUnoControl()` / `ToWinFormsControl()` / `ToGtkWidget()`——一个
  Majorsilence 控件通过 `MajorsilenceFormsPresenter` 作为原生控件被托管。
- `ToAvaloniaWindow()` / `ToUnoWindow()` / `ToWinFormsForm()` / `ToGtkWindow()`——把一个 Majorsilence
  `Form` 的后端窗口交回给宿主。Avalonia、WinForms 和 GTK 4 得到的是真正的操作系统级模态对话框；Uno
  在这个后端里没有所有者（owner）概念，所以得到的是一个独立的顶层窗口，在那里要获得模态行为需要
  使用 `Form.ShowDialog(parent)`。
- `NativeControlHost`——一个托管在 Majorsilence 场景*内部*的原生按钮，又是反过来的方向（四者都
  支持；在 GTK 4 上它能干净地合成，没有空域（airspace）问题）。见
  [原生互操作]({{ '/zh/native-interop/' | relative_url }})。

`EmbeddingWinForms` 通过 `WinFormsCssTheme` 用一张样式表 `Themes/graphite.css` 给两半同时换上主题
（`--no-theme` 显示未处理的外观）；`EmbeddingAvalonia` 通过 `AvaloniaCssTheme` 做同样的事（它的
**Apply ocean.css** 按钮，或 `--theme file.css`，而 `--render-headless out.png` 会在屏外绘制窗口然后
退出）。Avalonia 和 Uno 这两个示例还会切换宿主主题，让你能看到 Majorsilence.Forms 控件跟随变化。
WinForms 示例是 WinForms 后端上"一次移植一个控件"的迁移路径；GTK 4 示例则在其宿主
`Gtk.Application` 的循环中运行 Gtk4 后端（`EMBED_SELFTEST=1` 用于非交互式检查）。API 以及各后端
之间所有者/模态行为的差异，见
[在宿主应用中嵌入]({{ '/zh/backends/' | relative_url }}#embedding-in-a-host-app)。

## WinFormsInterop（仅 Windows）
{:#winformsinterop}

演示 `System.Windows.Forms` 与 Majorsilence.Forms 在单个进程内的双向互操作——示例以一个真实的
WinForms 宿主启动，每个打开的 Majorsilence.Forms 窗口又可以反过来打开旧的 WinForms 窗体。这是
Avalonia 后端上的整窗体桥接，与 `EmbeddingWinForms` 所使用的 WinForms 后端不同。

```
dotnet run --project samples/WinFormsInterop
```

完整 API 见
[`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md)。

## WinFormsCompatDemo
{:#winformscompatdemo}

不要与 `WinFormsInterop` 混淆：这个进程里任何地方都没有真实的 `System.Windows.Forms` 程序集。
`Form1.cs`/`Form1.Designer.cs` 是普通的、未经修改的 WinForms 设计器生成源码——一个 `Button`、
`Label`、`TextBox`，一个 `MessageBox.Show(...)` 调用——之所以能针对 Majorsilence.Forms 编译，是因为
`Majorsilence.Forms.WinFormsShims.Compat` 这个 Roslyn 源生成器纯粹在编译期生成了一个同名的、由
Majorsilence.Forms 支撑的 `System.Windows.Forms` 命名空间。示例引用了 Avalonia 后端，所以
`Application.Run` 会打开一个真实窗口，而不只是一次编译检查。

```
dotnet run --project samples/WinFormsCompatDemo
```

它的 [`RESULTS.md`]({{ site.github_url }}/blob/main/samples/WinFormsCompatDemo/RESULTS.md) 记录了今天
哪些能、哪些不能通过这种转换——设计器生成的窗体能干净地编译，而最先出问题的是类型为非 `EventHandler`
委托（例如 `PaintEventArgs`）的处理程序。它在整体中的位置见
[迁移]({{ '/zh/migration/' | relative_url }})。

## AutomationTarget
{:#automationtarget}

一个刻意做小的应用，它在自己身上启动一个 `WebDriverServer`，这样在学习自动化工具时就有一个真实的
东西可以驱动——无论是从 MCP 服务器、Selenium 客户端，还是普通的 `curl`。

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

它会打印端点以及用来驱动它的命令。`--webdriver <port>` 选择端口（默认 4444）；`--no-webdriver`
让它作为普通应用运行。每个控件演示一件客户端必须应对的事情——一个拒绝被点击的控件，一个只有勾选
复选框后才变为可用的控件，以及一个刻意不命名的控件——而且每个操作都会记录到屏幕和 stdout，这样你就
能用应用实际看到的内容来核对客户端的说法。这里刻意不提供截图：它运行在 Avalonia 上，而图像捕获是
Headless 后端的工作。

逐控件的说明见
[`samples/AutomationTarget/README.md`]({{ site.github_url }}/blob/main/samples/AutomationTarget/README.md)，
工具本身见[自动化与 UI 测试]({{ '/zh/automation/' | relative_url }})。

## 从源码构建
{:#building-from-source}

- 克隆[仓库]({{ site.github_url }})
- 安装 .NET 10 SDK
- 在你的 IDE 中打开 `Majorsilence.Forms.slnx`，或直接用 `dotnet run --project samples/<Name>` 运行任意示例

`Gallery.Android` 和 `Gallery.iOS` 在解决方案中，但除非安装了对应的工作负载，否则会编译为空的存根库，
因此在仓库根目录执行普通的 `dotnet build` / `dotnet test` 无需任何平台工作负载即可工作。用
`-p:EnableAndroidTarget=true` 或 `-p:EnableIOSTarget=true` 强制启用某一个平台。

平台相关的构建说明见仓库中的
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md)。
