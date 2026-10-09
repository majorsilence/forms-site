---
layout: docs
lang: zh
title: 迁移 WinForms 应用
subtitle: 通过自动化重写把现有的 Windows Forms 解决方案迁移到 Majorsilence.Forms——或者增量进行，一次一个窗体或一个控件，其余部分继续基于真正的 WinForms 或 WPF 构建。
permalink: /zh/migration/
seo_title: "WinForms 迁移到跨平台 .NET——迁移工具"
description: >-
  无需重写即可把 Windows Forms 应用迁移到跨平台 .NET。majorsilence-migrate 命令行工具以 git diff
  的形式重写命名空间、项目和资源，WinForms 与 WPF 后端则让你一次只移植一个控件。
keywords:
  - WinForms 迁移
  - WinForms 迁移工具
  - WinForms 跨平台
  - WinForms 现代化改造
  - WinForms 升级 .NET 10
  - WinForms 移植 Linux
  - System.Windows.Forms 替换
  - 老旧 WinForms 项目升级
priority: "0.9"
---

把 WinForms 应用迁移到 XAML 框架意味着重建每一个界面。迁移到 Majorsilence.Forms 则基本上是一次
**机械式重写**——同样的窗体、同样的控件、同样的事件处理程序，只是指向了另一个命名空间——而且有一个
命令行工具替你完成这件事。

```bash
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff
```

完整参考见仓库中的 [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)。本页是导览。

## 安装工具
{:#installing-the-tool}

迁移器以 .NET 工具的形式发布到 nuget.org，而且这现在是它**唯一**的发布形式——以前的发布版本还会
为每个平台附带一个自包含的单文件二进制，现在不再提供。这意味着机器上需要有 .NET 运行时（该包面向
`net10.0`，并设置了 `RollForward=latestMajor`，所以更新的运行时也可以）。

```bash
# 全局安装
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help

# 或者按仓库安装，在工具清单中锁定版本
dotnet new tool-manifest
dotnet tool install Majorsilence.Forms.Migrator
dotnet majorsilence-migrate --help
```

如果你不想安装任何东西，可以从仓库的克隆中用
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>` 运行它。

## 迁移器会改动什么
{:#what-the-migrator-changes}

| 目标 | 会发生什么 |
|---|---|
| `.csproj` / `.vbproj` | 移除 `UseWindowsForms`/`UseWPF`，去掉 `-windows` TFM 后缀（`net8.0-windows` → `net8.0`，`net10.0-windows10.0.19041.0` → `net10.0`）——包括导入的 `.props`/`.targets` 中的——去掉 Windows Desktop 框架引用，移除仅限 WinForms 的包（Telerik UI for WinForms、DevExpress、**`System.Drawing.Common`**），并为重写实际触及的每个项目添加 `Majorsilence.Forms` 和一个后端。使用中央包管理（Central Package Management）的解决方案会被尊重：`PackageReference` 不带版本，版本添加到 `Directory.Packages.props` 中 |
| `.cs` / `.vb` | 通过"最长前缀优先"的映射表重写命名空间，合并由此产生的重复 `using`/`Imports` 行，为少数在保留 `System.Drawing` 导入时会产生歧义的名称添加别名（`SystemColors`、`ColorTranslator`、Telerik 的 `TabStripItem`），并注释掉 `ApplicationConfiguration.Initialize()` |
| Visual Basic 特有 | 注入在 `MyType=Empty` 不再生效后丢失的隐式 WinForms 构造函数，生成 `My.Resources` 访问器模块，并对剩余的 `My.*` 用法发出警告。`My.Application.Info.*`、`My.Resources.*` 和 `My.Computer.Name` 是真正实现的；`My.Forms`、`My.Settings`、`My.User` 及其余部分仍然只是警告 |
| `.resx` | 找出必须在框架切换后继续有效的图像和类型引用 |
| 强类型资源设计器 | 在生成的 `Resources.Designer.cs` 类文件中（且仅限这些文件），`System.Resources.ResourceManager` 变为 `Majorsilence.Forms.ComponentResourceManager`，这样生成的 `(Icon) ResourceManager.GetObject(...)` 强制转换在运行时能成功，而不是在第一次读取资源时抛出异常 |
| 报告 | 写出一份 Markdown 摘要，列出它改动的所有内容以及它希望人工检查的所有内容 |

移除 `System.Drawing.Common` 比看起来更重要：如果保留对它的引用，`System.Drawing.Bitmap`/`Font`/`Pen`
会回到作用域中，与它们在 `Majorsilence.Forms.Drawing` 中的替代品并列，于是每一处未限定的使用都会以
*引用不明确*失败，而不是解析到移植版本。另外，"重写触及的项目"比"WinForms 项目"范围更广：一个带有
图像辅助类的普通类库也会被重写为 `Majorsilence.Forms.Drawing.*`，因此也需要这个引用。只使用仍留在
`System.Drawing` 中的基元类型（`Color`、`Point`、`Size`）的库则不会被改动。

### 你真正会用到的选项
{:#the-options-youll-actually-use}

- `--dry-run --diff`——显示统一 diff，不写入任何内容。
- `--no-backup`——就地修改，不生成 `.bak` 文件，因为 git 就是备份。
- `--backend avalonia|uno|headless`——要添加哪个后端包（默认是 Avalonia）。
- `--package-version <v>`——锁定包版本；默认为迁移器自身的版本，因为工具和包来自同一次发布。
- `--map <file>`——一个 JSON 文件，为工具不认识的第三方供应商（比如 DevExpress）提供额外的命名空间
  映射和包通配模式。Telerik UI for WinForms 是内置的，无需 `--map` 即可映射到
  `Majorsilence.Forms.Telerik`。
- `--strict`——只要产生任何人工检查警告就以非零退出码退出。在迁移分支上把它用作 CI 门禁，这样新出现
  的未映射引用会让流水线失败。
- `--engine roslyn`——具备符号感知能力的第二遍处理，见下文。

Krypton Toolkit 的移植多一个步骤：工具无法修正类型关系层面的事实（Majorsilence.Forms 的 `Form` 不是
`Control`），因此仓库在 [`tools/fixups/`]({{ site.github_url }}/tree/main/tools/fixups) 中为 Standard
和 Extended 工具包提供了幂等的桥接脚本，剩余工作在
[`docs/krypton-port-plan.md`]({{ site.github_url }}/blob/main/docs/krypton-port-plan.md) 中跟踪。

## 推荐的首次运行方式
{:#the-recommended-first-run}

在一个 git 分支上就地运行，这样迁移就是一份你可以阅读、重跑和回退的 diff：

```bash
# 在改动任何东西之前先看看范围
majorsilence-migrate MySolution.sln --dry-run --diff

# 然后真正执行——git 就是备份，所以跳过 .bak 文件
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

重写是幂等的，所以在合并更多旧代码之后重新运行是安全的。请阅读报告：它按原因对每条警告分组，最常见的
"跳过的项目"是旧式的非 SDK 风格 `.csproj`，必须先转换为 SDK 风格工具才能解析——这是一个前置步骤，
而不是迁移缺口。

## 两种引擎
{:#two-engines}

默认引擎是刻意设计的**文本重写器**——没有语法树，没有符号解析。这听起来像是走捷径，其实不然：这意味着
工具可以处理迁移到一半的解决方案、引用了尚未有人移植的类型的 `.vb` 文件、当前根本无法编译的项目。
基于 Roslyn 的工具在项目能构建之前拒绝碰它，这就违背了对旧代码库做*第一遍*处理的初衷。它处理数千个
文件也只需几秒钟。

它放弃的是跨项目的符号解析：当你自己的 `Panel` 类和 `System.Windows.Forms.Panel` 都以裸名称使用时，
它分不清两者。针对这种特定情况，有一个可选启用的 `--engine roslyn`，使用 `MSBuildWorkspace` 和真正的
符号解析。它慢得多，而且需要一个可加载的项目，所以它是第二遍——而不是第一遍。它按项目"失败即关闭"：
某个加载不了的项目，其文件会回退到文本引擎处理，并附带警告。

## 增量迁移：五种不必一次性切换的方法
{:#incremental-migration-five-ways-to-not-flip-the-switch-at-once}

你很少会想在一次提交中把一个大型应用整个迁移过去。现在有好几种分步进行的方法，而且它们可以组合使用。

### `--dual-build`：一套代码，两种技术栈
{: id="--dual-build-one-codebase-either-stack"}

`--dual-build` 让一个 C# 项目可以基于**任一**技术栈构建，由单个 MSBuild 属性切换，这样 Windows 开发者
可以在移植进行期间继续基于真正的 WinForms 编译。`UseWindowsForms`、`-windows` TFM 和仅限 WinForms 的
包全部保留；Majorsilence.Forms 被添加到它们旁边，只有文件顶部的 `using System.Windows.Forms;` 变成
一个 `#if MAJORSILENCE_FORMS` 条件。在 `Directory.Build.props` 中设置
`<MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>` 即可切换。VB 不提供此选项——`MyType=Empty` 会关闭
整个 `My` 框架，无法用预处理器符号切换——因此传入 `--dual-build` 的 VB 项目会按常规方式转换，并附带
警告。

### `WindowsFormsInterop`：整个窗体，双向互通
{:#windowsformsinterop-whole-forms-both-directions}

在 Windows 上，[`Majorsilence.Forms.WindowsFormsInterop`]({{ site.github_url }}/blob/main/docs/winforms-interop.md)
可以把真正的 `System.Windows.Forms` 窗体宿主在运行于 Avalonia 后端的 Majorsilence.Forms 应用中
（反过来也可以），共享同一个 Win32 消息泵，因此可以在运行中的应用里一次迁移一个完整界面。

### WinForms 与 WPF 后端：一次一个控件
{:#the-winforms-and-wpf-backends-one-control-at-a-time}

`Majorsilence.Forms.WinForms` 和 `Majorsilence.Forms.Wpf` 是仅限 Windows 的**迁移后端**。Majorsilence.Forms
之下的宿主不是 Avalonia，而是一个真正的 `System.Windows.Forms` 窗口（或 WPF 的 `Window`），Skia 表面
通过 GDI 位图（或 `WriteableBitmap`）呈现。重点在于嵌入的方向：一个已移植的 Majorsilence.Forms 控件
可以作为普通的 WinForms `Control` 或 WPF `FrameworkElement` 放回现有应用中。

```csharp
// WinForms 宿主
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// WPF 宿主
myWpfGrid.Children.Add (myMfControl.ToWpfElement ());
```

`ToWinFormsForm()` / `ToWpfWindow()` 对整个 `Form` 做同样的事，包括真正的原生模态 `ShowDialog(owner)`。
这两个包除了 `net8.0-windows` 和 `net10.0-windows` 之外还面向 **`net48`**，并与核心包的 `netstandard2.0`
构建配对，因此 .NET Framework 4.8 应用可以在迁移到现代 .NET *之前*就开始采用 Majorsilence.Forms。
一个 WinForms 控件库可以移植其内部实现，同时继续向使用者交付 WinForms 控件。

当一切都移植完成后，把后端包换成 `Majorsilence.Forms.Avalonia`（或 Uno，或 GTK 4），同一份代码就能
跨平台运行；后端接缝（seam）之上的任何东西都不需要改。这些后端没有 `IWebViewFactory`，也不支持手势，
而且在 Windows 之外它们会构建为空的占位程序集，这样跨平台解决方案在任何地方都仍能编译。示例：
[`samples/EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) 和
[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf)；包的 README：
[WinForms]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinForms/README.md)、
[WPF]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Wpf/README.md)。

### `WinFormsShims.Compat`：当你无法重写命名空间时
{:#winformsshimscompat-when-you-cant-rewrite-the-namespace}

有时重写 `using System.Windows.Forms;` 并不可行：比如一个对外分发的控件库，它自己的**公共 API**
就是以 `System.Windows.Forms`/`System.Drawing` 类型定义的，而它的使用者不可能被要求修改代码。
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinFormsShims.Compat/README.md)
是一个 Roslyn 源生成器，生成由 Majorsilence.Forms 支撑的 `System.Windows.Forms` 和 `System.Drawing`
命名空间，使未经修改的 WinForms 源码——包括 Designer.cs 文件——能针对移植版本编译。它以**概念验证**
的形式发布：为每个非密封类生成子类，为密封的绘图叶子类型（`Font`、`Pen`、`Bitmap`……）生成带隐式转换
的包装器，转发静态类（`Application`、`MessageBox`、`Brushes`……），以及 `Control` 自身的事件族。它最
主要的缺口是通过 `Control` 本身进行的多态存储，这是 C# 的单继承无法掩盖的。依赖它之前请先阅读 README
中的范围章节；示例是
[`samples/WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo)，其结论
记录在 `RESULTS.md` 中。

### `Theming.WinForms`：两半共用一份样式表
{:#themingwinforms-one-stylesheet-for-both-halves}

混合应用在同一个窗口里有两套视觉系统。[`Majorsilence.Forms.Theming.WinForms`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Theming.WinForms/README.md)
把 Majorsilence.Forms 使用的同一份 CSS 主题应用到**真正的** `System.Windows.Forms` 控件上——同样的
令牌、同样的选择器、同样的诊断信息——方法是遍历控件树并设置 `BackColor`、`ForeColor`、`Font`、
`FlatAppearance`、`DataGridView` 单元格样式、一个由令牌构建的 `ToolStripProfessionalRenderer`，
以及通过 DWM 设置 Windows 11 标题栏。启动时调用一次 `WinFormsCssTheme.Apply`，为每个窗体调用
`Track(form)`，然后读取 `Diagnostics` 查看 WinForms 无法表达的内容；没有任何东西会被悄悄忽略。
支持矩阵见 [`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md)。

## 编译通过之后
{:#after-it-compiles}

迁移器让代码能够构建。它*不会*告诉你的是：哪些 WinForms 行为已完整实现，哪些是近似实现，哪些是刻意
排除在范围之外——这些都在
[兼容性矩阵]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) 中，它是你接下来该读的文档。

兼容层有一个特性值得在测试前牢记：**未实现的成员执行空操作或返回合理的默认值，而不是抛出异常。**
迁移后的代码即使在某个视觉功能尚未实现的地方也能编译和运行，这是正确的默认行为——但这也意味着缺口
可能是无声的，而不是显眼的。`Image.MakeTransparent` 就曾是一例：一张颜色键控的精灵图在每个精灵后面
都画出一个白色方块，却没有任何异常。仓库现在用 `NoOpStubBaselineTests` 防范这种情况，它把已知的
空函数体公共 `void` 方法集合固定在 `NoOpStubBaseline.txt` 中（撰写本文时为 161 个），这样接受一个
新的存根就成为一次有意识、有记录的行为。请测试迁移后的应用，不要只是构建它。

项目在兼容性两个方面的现状：

- **API 表面：**针对上游 WinForms 和 GDI+ 的自动化缺口计划已降至**零**——上游拥有的每一个公共成员都
  已声明。
- **行为：**一次覆盖十二个领域的审计（2026 年 8 月）发现了 **483 处**成员存在但行为与 WinForms 不一致
  的地方。其中大多数阶段此后已经完成——键盘预处理（`ProcessCmdKey`）、焦点与验证、真正的对话框、
  窗体生命周期与事件顺序、实时数据绑定、`ListView` 详细信息视图、`DataGridView` 事件、文本框撤销、
  `ToolStrip` 行为、`NotifyIcon`、`Application.AddMessageFilter`。持续更新的统计在
  [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md)。

有两类变更值得在测试前到 `MIGRATION.md` 中仔细读一读，因为无论哪种情况它们都能干净地编译通过：

- **为匹配 WinForms 而做的破坏性变更。**`SplitContainer.Orientation` 现在和 WinForms 一样表示分隔条
  的方向，所以如果你设置过它，请反转它。`TreeViewDrawMode.OwnerDrawContent` 是 `OwnerDrawText` 的
  `[Obsolete]` 别名，`OwnerDrawAll` 现在存在了。事件委托类型与 WinForms 一致（`KeyEventHandler`、
  `MouseEventHandler`、`FormClosingEventHandler`），因此设计器生成的 `new KeyEventHandler(...)` 行
  可以编译——但 `Click` 和 `MouseEnter` 不再携带鼠标坐标，因为在 WinForms 中它们从来就没有。渐变
  和阴影线画刷移到了 `Majorsilence.Forms.Drawing.Drawing2D`，与 GDI+ 中的位置一致。
- **自定义绘制的控件以逻辑单位绘制**（自 2026-10-01 起）。`ClientRectangle`、`ClientSize` 以及你的
  `OnPaint`/`Paint` 处理程序收到的画布现在都是逻辑单位，和 `Bounds` 一样，由框架缩放到显示器。
  如果某个自定义控件自己调用了 `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`，请删除该调用，
  否则所有内容都会以双倍比例绘制。所有者绘制事件（`DrawItem`、`DrawNode`、`CellPainting`）仍然给
  你设备像素。在测试运行中设置 `MF_HEADLESS_SCALE=2` 可以看出差别。

## 已迁移的真实应用
{:#real-apps-that-have-been-migrated}

这不是纸上谈兵。Majorsilence 自己的
[MPlayercontrol](https://github.com/majorsilence/MPlayercontrol) 和
[Reporting](https://github.com/majorsilence/Reporting/tree/feature/modernization-roadmap) 正在迁移，
还有一组开源 WinForms 项目被专门 fork 出来用于检验兼容层和迁移器——一个 Notepad++ 克隆、DarkUI、
PKHeX、metroframework、RibbonWinForms、一个 Super Mario Bros 重制版、advanceddatagridview 等等。
上文存根基线表中的若干缺口就是这样发现的。完整列表见仓库 readme 的
[Migrated Project Examples]({{ site.github_url }}#migrated-project-examples) 章节。

## 一份切实可行的计划
{:#a-realistic-plan}

1. 在分支上运行迁移器，先 dry-run。阅读报告。
2. 让它编译通过。逐条处理人工检查警告；警告清零后把 `--strict` 加入 CI。
3. 对照兼容性矩阵检查你的应用重度依赖的部分——`DataGridView`、自定义绘制、第三方控件套件。
4. 基于[自动化树]({{ '/zh/automation/' | relative_url }})建立 UI 测试，让回归问题可见；它可以在任何
   操作系统的 CI 中以无头（Headless）方式运行。
5. 先发布到 Windows——同一平台、新框架，一次只改一个变量。如果应用很大，就在 WinForms 或 WPF 后端上
   一次移植一个控件。然后切换后端，加上 macOS 和 Linux。
6. 锁定你的包版本。项目仍处于测试版（beta），API 仍在稳定中。

[培训指南的模块 5]({{ '/zh/training/' | relative_url }}#module-5) 会带领团队详细走完这一过程，附有
C# 和 VB.NET 两种示例。

## 下一步
{:#next}

- [培训指南]({{ '/zh/training/' | relative_url }})——面向迁移团队的完整课程。
- [跨平台 WinForms]({{ '/zh/cross-platform-winforms/' | relative_url }})——兼容层能做什么、不能做什么。
- [后端]({{ '/zh/backends/' | relative_url }})——Avalonia、Uno、GTK 4、Terminal、WinForms、WPF 和
  Headless 并排对比。
- [WinForms 替代方案对比]({{ '/zh/winforms-alternatives/' | relative_url }})——如果你仍在这个方案和
  重写之间犹豫。
- [常见问题]({{ '/zh/faq/' | relative_url }})——最先会遇到的那些问题。
