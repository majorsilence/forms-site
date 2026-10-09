---
title: "Backends de plateforme : Avalonia, Uno et Headless"
date: 2026-07-21 11:00:00 -0000
lang: fr
permalink: /fr/blog/2026/07/21/platform-backends-avalonia-uno-headless/
read_time: "5 min de lecture"
excerpt: "Majorsilence.Forms dessine lui-même chaque contrôle avec SkiaSharp — le toolkit de fenêtrage en dessous n'est qu'un hôte. Voici comment fonctionne la couture."
description: >-
  Comment WinForms multiplateforme s'exécute sur Avalonia, Uno Platform et une surface Skia headless :
  chaque contrôle est dessiné avec SkiaSharp et le toolkit de fenêtrage en dessous n'est qu'un hôte
  interchangeable.
---

Majorsilence.Forms effectue **tout son dessin lui-même** avec SkiaSharp. Chaque contrôle peint dans
une `SKSurface`/`SKCanvas` ; le toolkit de fenêtrage en dessous n'est qu'un *hôte* — il crée les
fenêtres natives, fait tourner la boucle de messages, achemine les entrées et présente la surface
Skia à l'écran. C'est cette séparation qui permet au même jeu de contrôles, à l'identique, de tourner
aujourd'hui sur trois toolkits très différents.

## La couture
{:#the-seam}

Deux interfaces définissent tout ce qu'un hôte doit fournir :

`IPlatformBackend` couvre les services au niveau de l'application — le dispatcher (`Post`/`Invoke`),
les timers, le presse-papiers, l'énumération des écrans et la boucle modale. `IWindowBackend` couvre
une seule fenêtre native — taille et position, afficher/masquer/fermer, curseur, décorations, boîtes
de dialogue de fichiers. Les entrées et les demandes de peinture circulent dans *l'autre* sens : le
backend appelle directement les méthodes neutres `RenderFrame(SKCanvas, …)` et `Handle*` de la
fenêtre. Aucun type de plateforme — aucun type Avalonia, aucun type WinUI — ne franchit jamais la
frontière vers le code cœur de Majorsilence.Forms.

## Trois backends aujourd'hui
{:#three-backends-today}

**`Majorsilence.Forms.Avalonia`** est le backend par défaut — Avalonia 12, qui donne Windows, macOS et
Linux pour le bureau sans aucune configuration. Référencez-le, et `Application.Run(new MyForm())`
fonctionne tout simplement. Il ne se limite pas au bureau, d'ailleurs : Avalonia fournit ses propres
cibles Android, iOS et Browser (WASM), si bien que ce même backend constitue une seconde voie vers le
mobile et le web, à côté du backend Uno dédié présenté ci-dessous.

**`Majorsilence.Forms.Headless`** est le backend le plus simple possible et sert aussi de modèle de
référence pour en écrire un nouveau : une boucle de messages à file de travail, un presse-papiers en
mémoire, un écran virtuel et un rendu hors écran. Il n'a besoin d'aucun affichage ; c'est donc sur lui
que tourne la suite de tests unitaires, et il peut rendre l'exemple ControlGallery directement en PNG
pour la comparaison pixel par pixel en CI :

```
dotnet run --project samples/ControlGallery -- --render-headless out.png 1100 750 --select-row 0
```

**`Majorsilence.Forms.Uno`** cible le moteur de rendu Skia d'Uno Platform, héberge un `SKXamlCanvas`
et atteint le bureau, iOS, Android et WebAssembly. Il a été vérifié de bout en bout sous macOS : l'hôte
Uno se lance, le backend crée la fenêtre et le `MainForm` complet de la ControlGallery se rend dans le
canvas. Comme il a besoin d'une session interactive, il s'exécute via une tête d'application dédiée —
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — plutôt que par la
build CI headless.

Un détail mérite d'être souligné : Uno n'a pas d'API programmatique « commencer un déplacement de
fenêtre », si bien que le déplacement et le redimensionnement du chrome de fenêtre auto-dessiné de
Majorsilence.Forms sont gérés de manière déclarative — un presenter sans bordure conserve gratuitement
les marges de redimensionnement du système, et le glisser de la barre de titre s'appuie sur l'API de
zone de légende (caption region) de WinUI sur la tête bureau Windows. Sous macOS, ce sont les
décorations natives qui prennent en charge le déplacement et le redimensionnement.

## Ajouter le vôtre
{:#adding-your-own}

Un nouveau backend n'est qu'un assembly de plus : référencez le cœur `Majorsilence.Forms` et votre
toolkit, implémentez `IPlatformBackend` et `IWindowBackend`, et calquez-vous sur le trio
Avalonia/Headless/Uno — pilotez le dispatcher dans le backend de plateforme, et présentez une surface
Skia et traduisez les entrées dans le backend de fenêtre. Voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }}) pour la liste complète des interfaces.
