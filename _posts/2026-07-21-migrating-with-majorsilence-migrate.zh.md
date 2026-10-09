---
title: "用 majorsilence-migrate 迁移 WinForms 应用"
date: 2026-07-21 08:00:00 -0000
lang: zh
permalink: /zh/blog/2026/07/21/migrating-with-majorsilence-migrate/
read_time: "6 分钟阅读"
excerpt: "一个刻意基于文本的重写器——而非 Roslyn 转换——因此它能在几秒内处理成千上万个文件，即使这些文件当前无法编译。"
description: >-
  majorsilence-migrate 如何自动化地把一个 WinForms 解决方案迁移到跨平台 .NET——它是一个刻意基于文本的重写器，
  能在几秒内处理成千上万个文件，即使这些文件当前无法编译。
---

`majorsilence-migrate` 是把 WinForms 解决方案自动迁移到 Majorsilence.Forms 的 CLI 工具。它最核心的设计
决策很容易被忽略，值得明确指出：它**不**解析语法树，也不解析符号。它是一个对原始源代码文本进行多遍处理的
**文本/正则重写器**——而这是有意为之。

## 为什么基于文本，而不是 Roslyn
{:#why-textual-not-roslyn}

引用该工具源码中的一句注释：*"这是一个刻意基于文本的转换——它不解析语法树——这让它既快速，又能容忍
当前无法编译的文件。"*

这种取舍换来了两样符号感知型工具无法提供的东西：

- **它能处理有问题的代码。** 迁移了一半的解决方案、引用了尚未有人移植的类型的文件、缺少引用的项目——
  这些都不会让重写器停下来，因为它从不需要代码能编译，甚至不需要能完整解析。一个具备真正符号解析能力的
  Roslyn 工具会拒绝处理任何无法构建的项目，这恰恰违背了对遗留代码库做*第一遍*处理的初衷。
- **它很快。** 没有编译、没有 `MSBuildWorkspace`、不加载项目图——它能在几秒内跑完成千上万个文件。

代价是：没有真正的跨项目符号解析。重写器不一定总能分辨一个裸的 `Panel` 引用指的是
`System.Windows.Forms.Panel` 还是你自己的同名类——它依赖的是命名空间前缀和 `using`/`Imports` 上下文。
实践中这很少产生歧义（WinForms 和 Telerik 的类型名都很有辨识度），而任何它不认识的东西都会被标记出来
供人工审查，而不是悄悄瞎猜。

## 可选的 Roslyn 引擎
{:#the-optional-roslyn-engine}

对于真正有歧义的情况——同一个文件里，一个自定义类型与某个 WinForms/GDI+ 类型共用同一个裸名称——
有一个可选启用的第二引擎：`--engine roslyn`。它使用 `MSBuildWorkspace` 和真正的符号解析来代替正则表达式，
并且是*叠加在*文本引擎之上而非取代它；在 Roslyn 模式下仍有若干遍处理保持为文本方式，因为它们从来就
不是符号解析问题。

它的取舍与默认引擎正好相反：它需要一个确实能通过 MSBuild 加载的解决方案或项目（裸目录或单个文件会回退到
文本引擎并给出警告）；它慢上几个数量级，因为 MSBuild 求值占据了运行时间的大头；而且如果某个项目加载失败，
只有该项目的文件会回退到文本引擎——整个运行不会中止。如果根本找不到 MSBuild，整个运行会直接硬性失败，
而不是悄悄降级。

**什么时候该用它：** 在用默认的 `--engine text` 跑完第一遍之后，针对一个已经能干净加载的项目，并且你在
diff 中看到了某个具体、已确认的名称冲突情况。而对于一个庞大、可能半残的遗留代码库的首次处理，默认的
文本引擎仍然是正确的工具。

## 接下来
{:#whats-next}

参阅仓库中的 [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)，了解逐遍处理的完整细目；
以及 [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)，了解迁移后的
代码编译通过之后，哪些功能是真正已实现的。
