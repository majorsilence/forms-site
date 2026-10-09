---
title: "Migrer une application WinForms avec majorsilence-migrate"
date: 2026-07-21 08:00:00 -0000
lang: fr
permalink: /fr/blog/2026/07/21/migrating-with-majorsilence-migrate/
read_time: "6 min de lecture"
excerpt: "Un réécriveur délibérément textuel — pas une transformation Roslyn — pour traiter des milliers de fichiers en quelques secondes, même ceux qui ne compilent pas actuellement."
description: >-
  Comment majorsilence-migrate automatise la migration d'une solution WinForms vers .NET
  multiplateforme — un réécriveur délibérément textuel qui traite des milliers de fichiers en quelques
  secondes, même ceux qui ne compilent pas actuellement.
---

`majorsilence-migrate` est l'outil en ligne de commande qui automatise le passage d'une solution
WinForms vers Majorsilence.Forms. Sa décision de conception centrale passe facilement inaperçue et
mérite d'être dite explicitement : il ne construit **pas** d'arbre syntaxique et ne résout pas les
symboles. C'est un **réécriveur textuel à base d'expressions régulières**, en plusieurs passes, sur le
texte source brut — et c'est voulu.

## Pourquoi textuel, et non Roslyn
{:#why-textual-not-roslyn}

Extrait du commentaire présent dans le code source de l'outil : *« Il s'agit d'une transformation
délibérément textuelle — elle n'analyse pas l'arbre syntaxique — ce qui la garde rapide et tolérante
aux fichiers qui ne compilent pas actuellement. »*

Ce compromis apporte deux choses qu'un outil conscient des symboles ne peut pas offrir :

- **Il fonctionne sur du code cassé.** Une solution à moitié migrée, un fichier qui référence un type
  que personne n'a encore porté, un projet avec une référence manquante — rien de tout cela n'arrête
  le réécriveur, parce qu'il n'a jamais besoin que le code compile, ni même qu'il soit entièrement
  analysable. Un outil fondé sur Roslyn, avec une vraie résolution de symboles, refuserait de toucher
  à un projet tant qu'il ne se construit pas, ce qui va à l'encontre d'une *première passe* sur une
  base de code héritée.
- **Il est rapide.** Pas de compilation, pas de `MSBuildWorkspace`, pas de chargement du graphe de
  projets — il traite des milliers de fichiers en quelques secondes.

Le prix à payer : pas de véritable résolution de symboles entre projets. Le réécriveur ne peut pas
toujours savoir si une référence nue à `Panel` désigne `System.Windows.Forms.Panel` ou votre propre
classe du même nom — il s'appuie à la place sur le préfixe d'espace de noms et sur le contexte des
`using`/`Imports`. En pratique, c'est rarement ambigu (les noms de types WinForms et Telerik sont
reconnaissables), et tout ce qu'il ne reconnaît pas est signalé pour revue manuelle plutôt que deviné
en silence.

## Le moteur Roslyn optionnel
{:#the-optional-roslyn-engine}

Pour le cas réellement ambigu — un type personnalisé partageant un nom nu avec un type WinForms/GDI+
dans le même fichier — il existe un second moteur, à activer explicitement : `--engine roslyn`. Il
utilise `MSBuildWorkspace` et une vraie résolution de symboles au lieu d'expressions régulières,
*par-dessus* le moteur textuel plutôt qu'à sa place ; plusieurs passes restent textuelles même en mode
Roslyn, parce qu'elles n'ont jamais été des problèmes de résolution de symboles.

Les compromis sont à l'inverse de ceux du moteur par défaut : il lui faut une solution ou un projet
qui se charge réellement via MSBuild (un simple répertoire ou un fichier isolé retombe sur le moteur
textuel avec un avertissement), il est plus lent de plusieurs ordres de grandeur parce que
l'évaluation MSBuild domine l'exécution, et si un projet échoue à se charger, seuls les fichiers de ce
projet retombent sur le moteur textuel — l'exécution ne s'interrompt pas. Si MSBuild lui-même est
introuvable, l'exécution entière échoue franchement plutôt que de se dégrader en silence.

**Quand y recourir :** après une première passe avec le moteur par défaut `--engine text`, sur un
projet qui se charge déjà proprement, si vous constatez dans le diff un cas précis et confirmé de
collision de noms. Pour la passe initiale sur une grande base de code héritée, éventuellement à moitié
cassée, le moteur textuel par défaut reste le bon outil.

## La suite
{:#whats-next}

Voir [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) dans le dépôt pour le détail
passe par passe, et
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) pour ce qui est
réellement implémenté une fois que votre code migré compile.
