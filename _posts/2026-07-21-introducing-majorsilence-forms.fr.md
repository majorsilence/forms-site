---
title: "Présentation de Majorsilence.Forms"
date: 2026-07-21 15:00:00 -0000
lang: fr
permalink: /fr/blog/2026/07/21/introducing-majorsilence-forms/
read_time: "4 min de lecture"
excerpt: "Un framework d'interface de style WinForms pour porter des applications WinForms anciennes ou récentes sur une pile multiplateforme — sans réécriture."
description: >-
  Présentation de Majorsilence.Forms, une bibliothèque WinForms multiplateforme open source pour .NET :
  conservez vos formulaires, vos contrôles et vos fichiers Designer, et exécutez la même application
  sous Windows, macOS et Linux sans réécriture.
---

Sortir une application WinForms du bureau Windows a toujours signifié, jusqu'ici, une réécriture
complète : XAML, une restructuration MVVM imposée, ou le web. C'est coûteux, risqué, et cela jette des
années de logique métier et d'expérience utilisateur qui fonctionnent, pour un code qui n'a souvent
besoin que d'un coup de peinture neuve.

**Majorsilence.Forms** adopte une autre approche : il reproduit la surface d'API de WinForms — les
`Form`, les contrôles, les gestionnaires d'événements, et même le code-behind `*.Designer.cs` — et
fournit une couche de compatibilité pour que les formulaires et contrôles existants migrent avec bien
moins de remous. Le modèle de programmation ne change pas ; c'est l'endroit où il s'exécute qui change.

## Comment c'est construit
{:#how-its-built}

Chaque contrôle est dessiné avec [SkiaSharp](https://github.com/mono/SkiaSharp) dans une `SKSurface`,
au-dessus d'un backend hôte interchangeable :

- **Avalonia** (par défaut) — Windows, macOS et Linux pour le bureau, prêts à l'emploi, avec ses propres
  cibles Android, iOS et Browser (WebAssembly) comme voie vers le mobile et le web également.
- **Uno Platform** — la portée la plus large : bureau, iOS, Android et WebAssembly.
- **Headless** — rendu hors écran sans dépendance, pour la CI et les tests automatisés.

L'assembly cœur `Majorsilence.Forms` ne référence aucun toolkit de fenêtrage — uniquement SkiaSharp.
Les backends sont des assemblies séparés qui se branchent sur deux petites interfaces,
`IPlatformBackend` et `IWindowBackend`. C'est cette couture qui permet à la même application, à
l'identique, de cibler Avalonia aujourd'hui et Uno demain sans toucher au code applicatif. Pour en
savoir plus, voir [Backends de plateforme]({{ '/fr/backends/' | relative_url }}).

## À qui cela s'adresse
{:#who-its-for}

Si vous disposez d'une base de code WinForms aujourd'hui limitée à Windows et que vous voulez garder
l'élan — réutiliser vos contrôles, les réflexes de votre équipe, votre logique métier — plutôt que de
vous lancer dans une réécriture de plusieurs années, c'est pour vous que ceci a été conçu.

Le projet en est à ses débuts : l'API se stabilise et tous les recoins de WinForms ne sont pas encore
couverts. Il convient déjà très bien aux nouvelles applications métier multiplateformes, et à la
migration de vraies applications en production si vous figez la version. Consultez la
[matrice de compatibilité]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) pour savoir
exactement ce qui est implémenté et ce qui n'est encore qu'un stub aujourd'hui.

## Essayez-le
{:#try-it}

```
dotnet new --install MajorsilenceForms.Templates
dotnet new majorsilenceforms
dotnet run
```

Ou plongez dans une vraie application — [`samples/Explorer`]({{ site.github_url }}/tree/main/samples/Explorer)
est un clone complet de l'Explorateur Windows, et [`samples/Outlaw`]({{ site.github_url }}/tree/main/samples/Outlaw)
un clone d'Outlook ; tous deux tournent sans modification sur le même jeu de contrôles, sur toutes les
plateformes.

Voir [Premiers pas]({{ '/fr/getting-started/' | relative_url }}) pour générer votre première application.
