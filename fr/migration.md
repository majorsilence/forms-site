---
layout: docs
lang: fr
title: Migrer une application WinForms
subtitle: Déplacez une solution Windows Forms existante vers Majorsilence.Forms grâce à une réécriture automatisée — ou procédez de façon incrémentale, un formulaire ou un contrôle à la fois, pendant que le reste continue de compiler avec le vrai WinForms ou WPF.
permalink: /fr/migration/
seo_title: "Migrer WinForms vers .NET multiplateforme — Outil de migration"
description: >-
  Migrez une application Windows Forms vers .NET multiplateforme sans réécriture. La CLI
  majorsilence-migrate réécrit les espaces de noms, les projets et les ressources sous forme de
  diff git, et les backends WinForms et WPF vous laissent porter un contrôle à la fois.
keywords:
  - migrer winforms
  - migration winforms
  - outil de migration winforms
  - convertir winforms multiplateforme
  - moderniser application winforms
  - winforms vers .net 10
  - porter winforms sur linux
  - migration system.windows.forms
priority: "0.9"
---

Migrer une application WinForms vers un framework XAML signifie reconstruire chaque écran. La migrer
vers Majorsilence.Forms est essentiellement une **réécriture mécanique** — les mêmes formulaires, les
mêmes contrôles, les mêmes gestionnaires d'événements, pointés vers un autre espace de noms — et une
CLI s'en charge pour vous.

```bash
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff
```

La référence complète est [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) dans le
dépôt. Cette page sert d'orientation.

## Installer l'outil
{:#installing-the-tool}

Le migrateur est publié sur nuget.org comme outil .NET, et c'est désormais la **seule** forme sous
laquelle il est livré — les versions attachaient autrefois aussi un binaire autonome à fichier unique
par plateforme, ce qui n'est plus le cas. Il lui faut donc un runtime .NET sur la machine (le paquet
cible `net10.0` avec `RollForward=latestMajor`, un runtime plus récent convient donc).

```bash
# Installation globale
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help

# Ou par dépôt, figé dans un manifeste d'outils
dotnet new tool-manifest
dotnet tool install Majorsilence.Forms.Migrator
dotnet majorsilence-migrate --help
```

Si vous préférez ne rien installer, lancez-le depuis un clone du dépôt avec
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>`.

## Ce que le migrateur modifie
{:#what-the-migrator-changes}

| Cible | Ce qui se passe |
|---|---|
| `.csproj` / `.vbproj` | Supprime `UseWindowsForms`/`UseWPF`, retire le suffixe de TFM `-windows` (`net8.0-windows` → `net8.0`, `net10.0-windows10.0.19041.0` → `net10.0`) — y compris dans les `.props`/`.targets` importés — retire la référence au framework Windows Desktop, supprime les paquets réservés à WinForms (Telerik UI for WinForms, DevExpress, **`System.Drawing.Common`**), et ajoute `Majorsilence.Forms` plus un backend à chaque projet que la réécriture touche réellement. Les solutions utilisant la gestion centralisée des paquets (Central Package Management) sont respectées : `PackageReference` sans version, versions ajoutées dans `Directory.Packages.props` |
| `.cs` / `.vb` | Réécrit les espaces de noms via une table « préfixe le plus long d'abord », fusionne les lignes `using`/`Imports` en double que cela produit, ajoute des alias pour les quelques noms qu'un import `System.Drawing` conservé rendrait ambigus (`SystemColors`, `ColorTranslator`, le `TabStripItem` de Telerik), et met en commentaire `ApplicationConfiguration.Initialize()` |
| Spécificités Visual Basic | Injecte le constructeur WinForms implicite perdu quand `MyType=Empty` cesse de s'appliquer, génère un module d'accès `My.Resources`, et avertit sur les usages restants de `My.*`. `My.Application.Info.*`, `My.Resources.*` et `My.Computer.Name` sont réellement implémentés ; `My.Forms`, `My.Settings`, `My.User` et le reste déclenchent encore un avertissement |
| `.resx` | Repère les références d'images et de types qui doivent survivre au changement de framework |
| Designers de ressources fortement typés | Dans les fichiers générés du type `Resources.Designer.cs` (et uniquement ceux-là), `System.Resources.ResourceManager` devient `Majorsilence.Forms.ComponentResourceManager`, de sorte que les casts générés `(Icon) ResourceManager.GetObject(...)` réussissent à l'exécution au lieu de lever une exception à la première lecture de ressource |
| Rapport | Écrit un résumé Markdown de tout ce qu'il a touché et de tout ce qu'il souhaite faire relire par un humain |

La disparition de `System.Drawing.Common` compte plus qu'il n'y paraît : la laisser référencée remet
`System.Drawing.Bitmap`/`Font`/`Pen` dans la portée à côté de leurs remplaçants
`Majorsilence.Forms.Drawing`, et chaque usage non qualifié échoue alors comme *référence ambiguë* au
lieu de se résoudre vers le port. Et « les projets que la réécriture touche » est plus large que « les
projets WinForms » : une simple bibliothèque de classes avec un utilitaire d'images est elle aussi
réécrite vers `Majorsilence.Forms.Drawing.*` et a besoin de la référence. Les bibliothèques qui
n'utilisent que les primitives restées dans `System.Drawing` (`Color`, `Point`, `Size`) ne sont pas
touchées.

### Les options que vous utiliserez vraiment
{:#the-options-youll-actually-use}

- `--dry-run --diff` — affiche le diff unifié sans rien écrire.
- `--no-backup` — en place, sans fichiers `.bak`, parce que git est la sauvegarde.
- `--backend avalonia|uno|headless` — quel paquet de backend ajouter (Avalonia par défaut).
- `--package-version <v>` — fige la version du paquet ; par défaut, la version du migrateur lui-même,
  puisque l'outil et les paquets sont livrés depuis la même version.
- `--map <file>` — un fichier JSON de correspondances d'espaces de noms et de globs de paquets
  supplémentaires pour un fournisseur tiers que l'outil ne connaît pas (DevExpress, par exemple).
  Telerik UI for WinForms est intégré et correspond à `Majorsilence.Forms.Telerik` sans `--map`.
- `--strict` — sortie avec un code non nul si un avertissement de relecture manuelle est produit.
  Utilisez-le comme garde-fou CI sur la branche migrée pour qu'une nouvelle référence non mappée
  fasse échouer le pipeline.
- `--engine roslyn` — la seconde passe, consciente des symboles, décrite plus bas.

Les ports de Krypton Toolkit ont une étape supplémentaire : l'outil ne peut pas corriger les faits de
relation entre types (un `Form` Majorsilence.Forms n'est pas un `Control`), donc le dépôt fournit des
scripts de pont idempotents dans [`tools/fixups/`]({{ site.github_url }}/tree/main/tools/fixups)
pour les toolkits Standard et Extended, le travail restant étant suivi dans
[`docs/krypton-port-plan.md`]({{ site.github_url }}/blob/main/docs/krypton-port-plan.md).

## La première exécution recommandée
{:#the-recommended-first-run}

Lancez-le en place sur une branche git, pour que la migration soit un diff que vous pouvez lire,
relancer et annuler :

```bash
# Voir la portée avant de modifier quoi que ce soit
majorsilence-migrate MySolution.sln --dry-run --diff

# Puis pour de vrai — git est la sauvegarde, donc on saute les fichiers .bak
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

La réécriture est idempotente : la relancer après avoir fusionné davantage de code hérité est sans
danger. Lisez le rapport : il regroupe chaque avertissement par cause, et le « projet ignoré » le plus
fréquent est un `.csproj` hérité non-SDK qui doit être converti au style SDK avant que l'outil puisse
l'analyser — une étape préalable, pas une lacune de la migration.

## Deux moteurs
{:#two-engines}

Le moteur par défaut est délibérément un **réécrivain textuel** — pas d'arbre syntaxique, pas de
résolution de symboles. Cela ressemble à un raccourci et n'en est pas un : cela veut dire que l'outil
fonctionne sur une solution à moitié migrée, sur un fichier `.vb` qui référence un type que personne
n'a encore porté, sur un projet qui ne compile pas pour le moment. Un outil basé sur Roslyn refuse de
toucher un projet tant qu'il ne compile pas, ce qui va à l'encontre d'une *première passe* sur une
base de code héritée. Il traite aussi des milliers de fichiers en quelques secondes.

Ce qu'il abandonne, c'est la résolution de symboles entre projets : il ne peut pas distinguer votre
propre classe `Panel` de `System.Windows.Forms.Panel` quand les deux sont utilisées par leur nom nu.
Pour ce cas précis, il existe un `--engine roslyn` optionnel qui utilise `MSBuildWorkspace` et une
vraie résolution de symboles. Il est bien plus lent et a besoin d'un projet chargeable : c'est donc
la seconde passe — pas la première. Il échoue de façon sûre projet par projet : un projet qui ne se
charge pas retombe sur le moteur textuel pour ses fichiers, avec un avertissement.

## Migration incrémentale : cinq façons de ne pas tout basculer d'un coup
{:#incremental-migration-five-ways-to-not-flip-the-switch-at-once}

On souhaite rarement déplacer une grande application en un seul commit. Il existe désormais
plusieurs façons de procéder par étapes, et elles se combinent.

### `--dual-build` : une base de code, l'une ou l'autre pile
{: id="--dual-build-one-codebase-either-stack"}

`--dual-build` laisse un projet C# compiler contre **l'une ou l'autre** pile, commutée par une seule
propriété MSBuild, afin qu'un développeur Windows puisse continuer à compiler contre le vrai WinForms
pendant que le port avance. `UseWindowsForms`, le TFM `-windows` et les paquets réservés à WinForms
restent tous ; Majorsilence.Forms est ajouté à côté d'eux, et seul le
`using System.Windows.Forms;` en tête de fichier devient une condition `#if MAJORSILENCE_FORMS`.
Définissez `<MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>` dans `Directory.Build.props` pour
basculer. Non proposé pour VB — `MyType=Empty` désactive tout le framework `My` et ne peut pas être
commuté par un symbole de préprocesseur — donc un projet VB auquel on passe `--dual-build` est
converti de la manière habituelle, avec un avertissement.

### `WindowsFormsInterop` : des formulaires entiers, dans les deux sens
{:#windowsformsinterop-whole-forms-both-directions}

Sous Windows, [`Majorsilence.Forms.WindowsFormsInterop`]({{ site.github_url }}/blob/main/docs/winforms-interop.md)
héberge de vrais formulaires `System.Windows.Forms` à l'intérieur d'une application Majorsilence.Forms
tournant sur le backend Avalonia (et l'inverse), en partageant une seule pompe de messages Win32, de
sorte que des écrans entiers peuvent être déplacés un par un dans une application en cours
d'exécution.

### Les backends WinForms et WPF : un contrôle à la fois
{:#the-winforms-and-wpf-backends-one-control-at-a-time}

`Majorsilence.Forms.WinForms` et `Majorsilence.Forms.Wpf` sont des **backends de migration**
réservés à Windows. Au lieu d'Avalonia, l'hôte sous Majorsilence.Forms est une vraie fenêtre
`System.Windows.Forms` (ou une `Window` WPF) avec la surface Skia présentée via un bitmap GDI (ou un
`WriteableBitmap`). L'intérêt est le sens de l'intégration : un contrôle Majorsilence.Forms porté
se replace dans l'application existante comme un `Control` WinForms ordinaire ou un
`FrameworkElement` WPF.

```csharp
// Hôte WinForms
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// Hôte WPF
myWpfGrid.Children.Add (myMfControl.ToWpfElement ());
```

`ToWinFormsForm()` / `ToWpfWindow()` font de même pour un `Form` entier, y compris un vrai
`ShowDialog(owner)` modal natif. Les deux paquets ciblent **`net48`** en plus de `net8.0-windows` et
`net10.0-windows`, associés à la build `netstandard2.0` du paquet principal, de sorte qu'une
application .NET Framework 4.8 peut commencer à adopter Majorsilence.Forms *avant* de passer au .NET
moderne. Une bibliothèque de contrôles WinForms peut porter ses entrailles tout en continuant à
livrer des contrôles WinForms à ses consommateurs.

Quand tout est porté, remplacez le paquet de backend par `Majorsilence.Forms.Avalonia` (ou Uno, ou
GTK 4) et le même code devient multiplateforme ; rien au-dessus de la couture backend ne change. Il
n'y a pas d'`IWebViewFactory` ni de prise en charge des gestes sur ces backends, et hors Windows ils
se compilent en assemblys vides servant de substituts, pour qu'une solution multiplateforme compile
quand même partout. Exemples :
[`samples/EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) et
[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf) ; README des paquets :
[WinForms]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinForms/README.md),
[WPF]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Wpf/README.md).

### `WinFormsShims.Compat` : quand vous ne pouvez pas réécrire l'espace de noms
{:#winformsshimscompat-when-you-cant-rewrite-the-namespace}

Parfois, réécrire `using System.Windows.Forms;` n'est pas envisageable : une bibliothèque de contrôles
distribuée dont l'**API publique** elle-même est typée sur `System.Windows.Forms`/`System.Drawing`,
et dont on ne peut pas demander aux consommateurs de changer leur code.
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.WinFormsShims.Compat/README.md)
est un générateur de source Roslyn qui émet des espaces de noms `System.Windows.Forms` et
`System.Drawing` adossés à Majorsilence.Forms, de sorte que du code source WinForms non modifié —
fichiers Designer.cs compris — compile contre le port. Il est publié comme **preuve de concept** :
des sous-classes pour chaque classe non scellée, des wrappers avec conversions implicites pour les
feuilles de dessin scellées (`Font`, `Pen`, `Bitmap`...), des classes statiques de relais
(`Application`, `MessageBox`, `Brushes`...), et la famille d'événements propre à `Control`. Sa lacune
principale est le stockage polymorphe à travers `Control` lui-même, que l'héritage simple de C# ne
peut pas masquer. Lisez la section « portée » du README avant de vous y fier ; l'exemple est
[`samples/WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo), avec
ses conclusions dans `RESULTS.md`.

### `Theming.WinForms` : une seule feuille de style pour les deux moitiés
{:#themingwinforms-one-stylesheet-for-both-halves}

Une application mixte a deux systèmes visuels dans une même fenêtre. [`Majorsilence.Forms.Theming.WinForms`]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Theming.WinForms/README.md)
applique le même thème CSS que Majorsilence.Forms utilise aux **vrais** contrôles
`System.Windows.Forms` — mêmes jetons, mêmes sélecteurs, mêmes diagnostics — en parcourant l'arbre
des contrôles et en définissant `BackColor`, `ForeColor`, `Font`, `FlatAppearance`, les styles de
cellules de `DataGridView`, un `ToolStripProfessionalRenderer` construit à partir des jetons, et la
barre de titre de Windows 11 via DWM. `WinFormsCssTheme.Apply` une fois au démarrage, `Track(form)`
pour chaque formulaire, et lisez `Diagnostics` pour tout ce que WinForms n'a pas pu exprimer ; rien
n'est ignoré en silence. La matrice de prise en charge est
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md).

## Une fois que ça compile
{:#after-it-compiles}

Le migrateur amène le code à compiler. Ce qu'il ne vous dit *pas*, c'est quel comportement WinForms
est pleinement implémenté, lequel est approximé, et lequel est délibérément hors périmètre — c'est la
[matrice de compatibilité]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md), et c'est le
document à lire ensuite.

Une propriété de la couche de compatibilité mérite d'être intériorisée avant de tester : **les
membres non implémentés sont des no-op (sans effet) ou renvoient une valeur par défaut raisonnable
plutôt que de lever une exception.** Le code migré compile et s'exécute même là où une fonctionnalité
visuelle n'existe pas encore, ce qui est le bon comportement par défaut — mais cela signifie aussi
qu'une lacune peut être silencieuse plutôt que bruyante. `Image.MakeTransparent` en a été une : une
feuille de sprites à couleur de transparence se dessinait avec un rectangle blanc derrière chaque
sprite, et rien ne levait d'exception. Le dépôt s'en protège désormais avec `NoOpStubBaselineTests`,
qui fige l'ensemble connu des méthodes publiques `void` à corps vide dans `NoOpStubBaseline.txt`
(161 au moment d'écrire ces lignes), de sorte qu'accepter un nouveau stub soit un acte conscient et
consigné. Testez l'application migrée, ne vous contentez pas de la compiler.

Où en est le projet sur les deux moitiés de la compatibilité :

- **Surface d'API :** les plans automatisés d'écarts par rapport au WinForms et au GDI+ amont sont à
  **zéro** — chaque membre public existant en amont est déclaré.
- **Comportement :** un audit en douze domaines (août 2026) a relevé **483 endroits** où un membre
  existait mais ne faisait pas ce que fait WinForms. La plupart de ces phases ont depuis été livrées —
  prétraitement du clavier (`ProcessCmdKey`), focus et validation, vraies boîtes de dialogue, cycle
  de vie des formulaires et ordre des événements, liaison de données en direct, vue détails de
  `ListView`, événements de `DataGridView`, annulation dans les zones de texte, comportement de
  `ToolStrip`, `NotifyIcon`, `Application.AddMessageFilter`. Le décompte courant est dans
  [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md).

Deux types de changements méritent une lecture attentive de `MIGRATION.md` avant de tester, parce
qu'ils compilent proprement dans les deux cas :

- **Changements cassants faits pour s'aligner sur WinForms.** `SplitContainer.Orientation` désigne
  désormais la direction de la barre de séparation, comme dans WinForms : si vous la définissez,
  inversez-la. `TreeViewDrawMode.OwnerDrawContent` est un alias `[Obsolete]` de `OwnerDrawText`, et
  `OwnerDrawAll` existe désormais. Les types de délégués d'événements correspondent à WinForms
  (`KeyEventHandler`, `MouseEventHandler`, `FormClosingEventHandler`), donc les lignes
  `new KeyEventHandler(...)` générées par le designer compilent — mais `Click` et `MouseEnter` ne
  transportent plus les coordonnées de la souris, parce que dans WinForms ils ne l'ont jamais fait.
  Les pinceaux dégradés et hachurés ont été déplacés vers `Majorsilence.Forms.Drawing.Drawing2D`, là
  où GDI+ les range.
- **Les contrôles à dessin personnalisé dessinent en unités logiques** (depuis le 2026-10-01).
  `ClientRectangle`, `ClientSize` et le canevas que reçoit votre gestionnaire `OnPaint`/`Paint` sont
  désormais logiques, comme `Bounds`, et le framework met à l'échelle pour l'affichage. Si un
  contrôle personnalisé appelait lui-même `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`,
  supprimez cet appel, sinon tout se dessine à double échelle. Les événements owner-draw (`DrawItem`,
  `DrawNode`, `CellPainting`) vous donnent toujours des pixels physiques. `MF_HEADLESS_SCALE=2` dans
  une exécution de tests montre la différence.

## De vraies applications ont été migrées
{:#real-apps-that-have-been-migrated}

Ce n'est pas théorique. Les propres projets de Majorsilence,
[MPlayercontrol](https://github.com/majorsilence/MPlayercontrol) et
[Reporting](https://github.com/majorsilence/Reporting/tree/feature/modernization-roadmap), sont en
cours de migration, et un ensemble de projets WinForms open source a été forké spécifiquement pour
mettre à l'épreuve la couche de compatibilité et le migrateur — un clone de Notepad++, DarkUI, PKHeX,
metroframework, RibbonWinForms, un remake de Super Mario Bros, advanceddatagridview et d'autres.
Plusieurs lacunes de la table de référence des stubs ci-dessus ont été découvertes ainsi. La liste
complète se trouve dans la section
[Migrated Project Examples]({{ site.github_url }}#migrated-project-examples) du readme du dépôt.

## Un plan réaliste
{:#a-realistic-plan}

1. Lancez le migrateur sur une branche, en dry-run d'abord. Lisez le rapport.
2. Faites-le compiler. Traitez les avertissements de relecture manuelle ; ajoutez `--strict` à la CI
   une fois qu'ils ont disparu.
3. Vérifiez la matrice de compatibilité pour tout ce sur quoi votre application s'appuie fortement —
   `DataGridView`, dessin personnalisé, suites de contrôles tierces.
4. Mettez en place des tests d'interface contre l'[arbre d'automatisation]({{ '/fr/automation/' | relative_url }})
   pour que les régressions soient visibles ; il s'exécute en headless dans la CI sur n'importe quel
   OS.
5. Livrez d'abord sous Windows — même plateforme, nouveau framework, une variable à la fois. Si
   l'application est grande, procédez un contrôle à la fois sur le backend WinForms ou WPF. Puis
   changez de backend et ajoutez macOS et Linux.
6. Figez la version de votre paquet. Le projet est en bêta et l'API se stabilise encore.

Le [module 5 du guide de formation]({{ '/fr/training/' | relative_url }}#module-5) accompagne une
équipe à travers tout cela en détail, avec des exemples en C# et en VB.NET.

## Pour la suite
{:#next}

- [Guide de formation]({{ '/fr/training/' | relative_url }}) — le cursus complet pour une équipe en
  cours de migration.
- [WinForms multiplateforme]({{ '/fr/cross-platform-winforms/' | relative_url }}) — ce que la couche
  de compatibilité peut et ne peut pas faire.
- [Backends]({{ '/fr/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms, WPF et
  Headless côte à côte.
- [Comparatif des alternatives à WinForms]({{ '/fr/winforms-alternatives/' | relative_url }}) — si
  vous hésitez encore entre ceci et une réécriture.
- [FAQ]({{ '/fr/faq/' | relative_url }}) — les questions qui se posent en premier.
