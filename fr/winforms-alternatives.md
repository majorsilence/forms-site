---
layout: docs
lang: fr
title: Comparatif des alternatives à WinForms
subtitle: Majorsilence.Forms face à .NET MAUI, Avalonia, Uno Platform, Eto.Forms, WPF et Wine — ce que chacun exige réellement d'une base de code WinForms existante.
permalink: /fr/winforms-alternatives/
seo_title: "Alternatives à WinForms — Comparatif MAUI, Avalonia, Uno et plus"
description: >-
  Un comparatif honnête pour une base de code WinForms : .NET MAUI, Avalonia, Uno Platform,
  Eto.Forms, WPF et Wine — et lesquels imposent une réécriture complète de l'interface.
keywords:
  - alternative à winforms
  - remplacer winforms
  - alternative windows forms
  - maui vs avalonia vs uno
  - winforms vs avalonia
  - migrer winforms vers maui
  - framework ui .net multiplateforme
  - meilleure alternative winforms
  - winforms gtk
  - migration winforms incrémentale
priority: "0.9"
---

Si vous avez une application WinForms qui fonctionne et que vous en avez besoin sous macOS ou Linux,
la vraie question n'est pas « quel framework d'interface est le meilleur » — c'est **« quelle part
de mon code existant survit ? »** Chaque option ci-dessous est un bon framework. Elles demandent
simplement des quantités très différentes de votre base de code.

## La version courte
{:#the-short-version}

| Option | Paradigme d'interface | Linux | macOS | Mobile / web | Ce qu'il advient de votre code WinForms existant |
|---|---|---|---|---|---|
| **Majorsilence.Forms** | WinForms (`Form`, contrôles, événements, fichiers Designer) | Oui (Avalonia ou GTK 4) | Oui | Navigateur (jeune), Android et iOS (précoce) ; aussi un terminal | **Conservé.** Changement de namespace + une couche de compatibilité ; le migrateur automatise la partie mécanique. Sous Windows, il peut aussi être adopté un contrôle à la fois dans l'application WinForms ou WPF existante, y compris sous .NET Framework 4.8 |
| **Avalonia** | XAML + MVVM | Oui | Oui | Oui | Réécrit en vues XAML et modèles de vue |
| **Uno Platform** | XAML WinUI + MVVM | Oui | Oui | Oui | Réécrit en XAML WinUI |
| **.NET MAUI** | XAML + MVVM | Pas de support officiel | Oui (Mac Catalyst) | Oui | Réécrit, et redimensionné pour un jeu de contrôles pensé d'abord pour le mobile |
| **Eto.Forms** | Sa propre API .NET de type formulaires, widgets natifs par OS | Oui | Oui | Non | Réécrit contre l'API d'Eto — familière dans sa forme, mais pas compatible au niveau du code source avec WinForms |
| **WPF** | XAML + MVVM | Non | Non | Non | Réécrit, et toujours réservé à Windows |
| **Wine** | Aucun — exécute le binaire Windows | Oui | Oui | Non | Intact, mais vous livrez une application Windows émulée, pas une application native |

## Majorsilence.Forms est construit *sur* plusieurs d'entre eux
{:#majorsilenceforms-is-built-on-several-of-these}

Cela mérite d'être explicite, parce que c'est une méprise courante : Majorsilence.Forms n'est pas en
concurrence avec Avalonia, Uno Platform ou GTK. Il les **utilise**. Chaque contrôle est dessiné par
Majorsilence.Forms lui-même avec SkiaSharp, et l'hôte en dessous — Avalonia par défaut, ou Uno, ou
une vraie fenêtre GTK 4 via gir.core — crée la fenêtre, fait tourner la boucle de messages et
présente la surface Skia. Sous Windows, les mêmes contrôles peuvent à la place être hébergés par de
vraies fenêtres `System.Windows.Forms` ou WPF, ce qui rend possible une migration incrémentale, sur
place. Voir [Backends de plateforme]({{ '/fr/backends/' | relative_url }}).

Le choix n'est donc pas « Majorsilence.Forms ou Avalonia ». C'est : *écrivez-vous directement le XAML
d'Avalonia, ou continuez-vous à écrire du WinForms en laissant Avalonia (ou GTK 4, ou Uno) servir de
plomberie ?*

## Option par option
{:#option-by-option}

### .NET MAUI
{:#net-maui}

Le successeur multiplateforme officiel de Xamarin.Forms chez Microsoft, et la réponse que la plupart
des résultats de recherche vous donneront. C'est un choix solide pour une **nouvelle** application
mobile et bureau.

Pour une application métier WinForms existante, c'est généralement le chemin le plus difficile : il
n'y a pas de support Linux officiel, le jeu de contrôles est pensé d'abord pour le mobile (pas
d'équivalent de `DataGridView`, un modèle de fenêtrage et de boîtes de dialogue différent), et
chaque écran est reconstruit en XAML avec une couche de modèles de vue que votre code WinForms n'a
presque certainement pas. Il n'y a aucune réutilisation significative des fichiers `*.Designer.cs`.

### Avalonia
{:#avalonia}

Un framework XAML mûr et réellement multiplateforme — bureau, mobile et WebAssembly — avec un
excellent support Linux et un moteur de rendu Skia. Si vous voulez une pile XAML moderne et que
vous êtes prêt à réécrire la couche d'interface, c'est la réponse générale la plus solide, et c'est
l'hôte par défaut sur lequel tourne Majorsilence.Forms.

Notez que le produit commercial **XPF** d'Avalonia est une couche de compatibilité pour *WPF*, pas
pour WinForms ; il n'aide pas une base de code `System.Windows.Forms`.

### Uno Platform
{:#uno-platform}

Implémente l'API XAML de WinUI/UWP sur bureau, mobile et WebAssembly, avec une portée très large et
un outillage solide. Même forme de décision qu'avec Avalonia : excellente cible, réécriture complète
de l'interface depuis WinForms. Il est aussi disponible comme backend Majorsilence.Forms si votre
organisation y a déjà investi.

### Eto.Forms
{:#etoforms}

Ce qui, en dehors de ce projet, s'en rapproche le plus dans l'esprit : une bibliothèque d'interface
.NET multiplateforme avec une API de formulaires et de contrôles plutôt que du XAML, liée aux widgets
*natifs* de chaque plateforme (WinForms sous Windows, Cocoa sous macOS, GTK sous Linux). L'apparence
native par OS est un vrai avantage.

Mais son API lui est propre — `Eto.Forms.Form` n'est pas `System.Windows.Forms.Form`, la mise en
page est fondée sur des conteneurs plutôt que sur des coordonnées et des ancres, et il n'existe
aucun chemin pour les fichiers Designer existants. Vous réécrivez, dans un idiome familier. Cette
comparaison reste valable maintenant que Majorsilence.Forms a son propre backend GTK 4 : Eto projette
ses contrôles sur des widgets GTK, alors que Majorsilence.Forms n'utilise la fenêtre GTK et sa
boucle d'entrée que comme hôte et continue de dessiner ses propres contrôles à la WinForms.

### Le `System.Windows.Forms` de Mono
{:#monos-systemwindowsforms}

Mono a bien livré une réimplémentation de WinForms, ce qui explique pourquoi « WinForms fonctionne
sous Linux » ressort dans de vieux fils de forum. Elle visait l'ère .NET Framework, n'a jamais été
portée vers le .NET moderne, et n'est pas une cible viable pour un nouveau portage aujourd'hui.

### Wine
{:#wine}

Wine exécute votre binaire Windows non modifié sous Linux et macOS. Rien ne change dans votre code,
ce qui est réellement attrayant — jusqu'à ce que vous deviez en assurer le support : vous livrez une
application Windows plus un runtime de compatibilité, vous héritez de la couverture Win32/GDI+ que
Wine se trouve avoir, l'intégration avec l'OS hôte est approximative, et les installateurs et mises
à jour se compliquent. C'est un contournement de déploiement, pas une stratégie de plateforme.

### Rester sur WPF
{:#staying-on-wpf}

WPF est un bon framework et un pas conceptuel modeste depuis WinForms, mais il est réservé à
Windows. Il résout « moderniser l'interface » ; il ne résout pas « tourner sous macOS et Linux ».
(Si vous avez déjà une coque WPF et voulez des écrans multiplateformes à l'intérieur,
Majorsilence.Forms a un backend hôte WPF exactement pour cela — mais la coque WPF elle-même reste
sous Windows.)

## Quand Majorsilence.Forms est la bonne réponse
{:#when-majorsilenceforms-is-the-right-answer}

- Vous avez une base de code WinForms conséquente — en particulier une application métier avec de
  nombreux formulaires — où la logique métier et l'expérience utilisateur sont l'actif et où le
  risque de la réécriture est le problème.
- Les compétences de votre équipe sont WinForms, et un cycle de reformation XAML/MVVM est un coût
  réel.
- Vous avez besoin de Windows, macOS et Linux à partir d'une seule base de code, avec le navigateur
  et le mobile comme option ultérieure.
- Vous ne pouvez pas tout arrêter pour porter. Les backends `Majorsilence.Forms.WinForms` et `.Wpf`
  hébergent les contrôles multiplateformes à l'intérieur de votre application Windows *existante*,
  un contrôle ou un formulaire à la fois — et ils ciblent `net48`, donc cela fonctionne depuis une
  application .NET Framework 4.8 avant même que vous soyez passé au .NET moderne. Le même thème CSS
  peut restyler les vrais contrôles WinForms à côté des contrôles portés
  (`Majorsilence.Forms.Theming.WinForms`), de sorte que l'application mixte ressemble à une seule
  application.
- Vous pouvez accepter une couche de compatibilité en bêta et figer la version.

## Quand ce n'est pas le cas
{:#when-it-isnt}

- **Projet neuf, pas de code WinForms, pas d'équipe WinForms.** Écrivez directement en Avalonia ou
  Uno ; vous obtenez une pile XAML mûre sans couche de compatibilité au milieu.
- **Mobile d'abord.** MAUI, Avalonia ou Uno ciblent correctement les téléphones aujourd'hui. Le
  support Android de Majorsilence.Forms n'a eu qu'une première passe sur appareil réel et iOS
  seulement un test de fumée en simulateur dans la CI — les deux sont précoces — et un formulaire de
  bureau positionné par coordonnées fait de toute façon une mauvaise interface de téléphone, même
  avec les contrôles de type téléphone `StackPanel`/`Card`/`NavigationHost` que le framework livre
  désormais.
- **Votre application est enfouie dans Win32.** Un usage intensif de `WndProc`, du P/Invoke sur
  `Control.Handle` ou des contrôles Win32 personnalisés ne survivent à aucun de ces portages — y
  compris celui-ci — sans un vrai travail.
- **Vous avez besoin d'une parité au pixel près avec le WinForms natif sous Windows.** Les
  contrôles sont dessinés par Skia et thématisés par CSS, de manière cohérente d'une plateforme à
  l'autre, plutôt que de reproduire les widgets natifs de chaque OS. (Les boutons poussoirs et les
  glyphes de cases à cocher/boutons radio prennent bien l'apparence de style Windows 11 une fois
  qu'une application portée a défini sa police, mais c'est une courtoisie pour les applications
  mixtes, pas une garantie de parité.)

## Ensuite
{:#next}

- [WinForms multiplateforme]({{ '/fr/cross-platform-winforms/' | relative_url }}) — comment
  fonctionne la couche de compatibilité et ce qu'elle coûte.
- [Migrer une application WinForms existante]({{ '/fr/migration/' | relative_url }}) — la
  réécriture automatisée.
- [Matrice de compatibilité]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — la
  couverture contrôle par contrôle, avant de vous engager.
