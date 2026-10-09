---
layout: docs
lang: fr
title: Bien démarrer
subtitle: Créez votre première application Majorsilence.Forms en quelques minutes.
seo_title: "Bien démarrer — Créer une application WinForms multiplateforme"
description: >-
  Créez une application WinForms multiplateforme en quelques minutes avec le modèle dotnet, ou ajoutez
  Majorsilence.Forms à un projet .NET ordinaire. Windows, macOS et Linux.
keywords:
  - tutoriel winforms multiplateforme
  - majorsilence.forms bien démarrer
  - dotnet new winforms multiplateforme
  - winforms hello world linux mac
  - créer une application winforms multiplateforme
  - modèle dotnet winforms
priority: "0.8"
permalink: /fr/getting-started/
---

## À partir d'un modèle
{:#from-a-template}

La façon la plus simple de démarrer une application Majorsilence.Forms est le modèle `dotnet`, publié
sur NuGet sous le nom `Majorsilence.Forms.Templates`.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

Cela génère une **solution avec deux projets** et lance un `MainForm` « Hello World » basique :

- `MajorsilenceFormsApp.Shared` — une bibliothèque d'interface contenant `MainForm` et `MainForm.Designer.cs`.
  Tous vos formulaires vont ici, de sorte que chaque tête ci-dessous les partage.
- `MajorsilenceFormsApp` — la tête bureau : un `WinExe` sur le backend Avalonia pour Windows, macOS
  et Linux.

`dotnet new majorsilenceforms -n MyApp` (éventuellement `-o <dir>`) génère le projet et l'espace de
noms sous le nom indiqué.

### Têtes mobile et navigateur
{:#mobile-and-browser-heads}

Ajoutez des projets de tête pour les autres cibles d'Avalonia à l'aide d'options — chacune est une tête
légère au-dessus de la même bibliothèque d'interface partagée :

```
dotnet new majorsilenceforms --IncludeAndroid --IncludeWasm --IncludeiOS
```

| Option | Ajoute | Nécessite |
|---|---|---|
| `--IncludeAndroid` | `MajorsilenceFormsApp.Android` (`net10.0-android`) | `dotnet workload install android` |
| `--IncludeWasm` | `MajorsilenceFormsApp.Wasm` (`net10.0-browser`) | `dotnet workload install wasm-tools` (pour `publish`) |
| `--IncludeiOS` | `MajorsilenceFormsApp.iOS` (`net10.0-ios`) | un Mac avec `dotnet workload install ios` |

Toutes sont désactivées par défaut, si bien qu'un simple `dotnet new majorsilenceforms` suivi de
`dotnet build` fonctionne sans workload supplémentaire. La tête iOS est expérimentale. `--msformsVersion`
et `--avaloniaVersion` remplacent les versions de paquets que le modèle fige ; voir le
[README du modèle]({{ site.github_url }}/blob/main/tools/Majorsilence.Forms.Templates/README.md).

Il n'existe pas encore de documentation d'API autonome, mais la surface devrait être familière à
quiconque a de l'expérience avec Windows Forms. La meilleure référence est le code source des
applications d'exemple :

- [`ControlGallery`]({{ site.github_url }}/tree/main/samples/ControlGallery) — chaque contrôle intégré, en direct.
- [`Explorer`]({{ site.github_url }}/tree/main/samples/Explorer) — un clone de l'Explorateur Windows.

Voir [Exemples]({{ '/fr/samples/' | relative_url }}) pour la liste complète et la façon de lancer chacun.

## À partir de zéro
{:#from-scratch}

Pour transformer une application console .NET ordinaire en application Majorsilence.Forms, apportez
les modifications suivantes.

### Fichier projet
{:#project-file}

```xml
<PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
</PropertyGroup>
```

Ajoutez une référence à `Majorsilence.Forms` et à un backend — le paquet de base ne référence aucun
toolkit de fenêtrage, c'est donc le backend qui met réellement une fenêtre à l'écran :

```xml
<ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
</ItemGroup>
```

Le paquet de base cible à la fois `net8.0`, `net10.0` et `netstandard2.0`. Aucun suffixe `-windows`
n'est nécessaire pour un backend multiplateforme.

### Un formulaire vide
{:#an-empty-form}

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}
```

### Program.cs
{:#programcs}

Appelez `Application.Run()` avec une instance de votre formulaire :

```csharp
static void Main (string [] args)
{
    Application.Run (new MainForm ());
}
```

Votre application est maintenant prête à s'exécuter — sur le backend Avalonia par défaut, cela veut dire
Windows, macOS et Linux sans autre configuration.

### Sélectionner un autre backend
{:#selecting-another-backend}

Avalonia est le backend par défaut : quand rien ne définit `Platform.Backend`, le framework charge
`Majorsilence.Forms.Avalonia` s'il est référencé. Pour exécuter le même formulaire sur un autre hôte,
référencez plutôt le paquet de ce backend et sélectionnez-le avant `Application.Run` :

```csharp
// GTK 4 — une vraie Gtk.Window, Linux d'abord (nécessite le runtime GTK 4, p. ex. libgtk-4-1)
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();
Application.Run (new MainForm ());

// Terminal — le formulaire remplit le terminal ; graphiques Kitty, Sixel ou blocs Unicode
Majorsilence.Forms.Terminal.TerminalApplication.Use ();
Application.Run (new MainForm ());

// Headless — rendu hors écran pour les tests et la CI
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();
```

Sous Windows, deux backends supplémentaires existent pour la migration plutôt que pour les nouvelles
applications : `Majorsilence.Forms.WinForms` et `Majorsilence.Forms.Wpf` hébergent des contrôles
Majorsilence.Forms dans une application WinForms ou WPF existante (`myControl.ToWinFormsControl()`,
`myControl.ToWpfElement()`), y compris sur .NET Framework 4.8, pour que vous puissiez porter un
contrôle à la fois et passer à Avalonia ou Uno une fois le dernier morceau terminé. Uno Platform
s'exécute à travers sa propre tête d'application. Voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }}) pour les sept backends, ce que chacun
peut et ne peut pas faire, et comment ajouter le vôtre.

## Les contrôles à dessin personnalisé dessinent en unités logiques
{:#custom-painted-controls-draw-in-logical-units}

Les redéfinitions `OnPaint` et `OnPaintBackground` d'un contrôle, ainsi que ses gestionnaires `Paint`,
dessinent en **unités logiques** — les mêmes unités que tout le reste du framework : `Left`, `Top`,
`Width`, `Height`, `ClientRectangle`, `ClientSize` et `MouseEventArgs.X`/`Y`. Le framework met le
canevas à l'échelle de l'affichage, de sorte que du code de dessin WinForms ordinaire a la bonne taille
sur un bureau HiDPI ou sur n'importe quel téléphone (Android rapporte un `Scaling` d'environ 2,6 à 2,75)
sans aucune modification :

```csharp
protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    e.Graphics.DrawRectangle (Pens.Gray, 0, 0, Width - 1, Height - 1);   // encadre le contrôle
    e.Graphics.FillRectangle (Brushes.LimeGreen, 0, 0, 10, 10);         // un carré logique de 10x10
}
```

Il en va de même pour `e.ClipRectangle`, et pour `e.Canvas` si vous dessinez directement avec SkiaSharp.
`PaintEventArgs.Scaling` reste disponible pour le code qui veut placer quelque chose sur un pixel
physique précis, tout comme `ScaledWidth`, `ScaledBounds` et `LogicalToDeviceUnits`.

La saisie est cohérente sans effort supplémentaire : `MouseEventArgs.X`/`Y` arrivent dans les mêmes
unités logiques que `Width`/`Height` et le canevas de dessin, de sorte qu'une géométrie construite une
fois sert aux deux.

## Pour aller plus loin
{:#where-to-go-next}

- **[Guide de formation]({{ '/fr/training/' | relative_url }})** — le programme structuré pour toute une
  équipe : le modèle mental, le contrat de compatibilité, la migration, les backends, les tests, ainsi
  que les barrières de CI et le plan de déploiement qui les accompagnent.
- **[Backends de plateforme]({{ '/fr/backends/' | relative_url }})** — la couture hôte, les sept backends,
  l'exécution dans le navigateur, l'intégration de Majorsilence.Forms dans une application Avalonia, Uno,
  GTK 4, WinForms ou WPF existante, et les gestes tactiles.
- **[Thèmes en CSS]({{ site.github_url }}/blob/main/docs/theming.md)** — le petit sous-ensemble de CSS
  qui restyle chaque contrôle, `Theme.LoadFromCssFile`, et l'exemple
  [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) en direct.
- **[Aides MVVM]({{ site.github_url }}/blob/main/docs/mvvm.md)** — `Observe`, `BindText`,
  `BindCommand` et `BindingScope` de `Majorsilence.Forms.Mvvm` : sans réflexion, compatibles trimming
  et AOT, et compatibles avec CommunityToolkit.Mvvm.
- **[Mise en page d'un écran de type téléphone]({{ site.github_url }}/blob/main/docs/mobile-layout.md)** —
  texte avec retour à la ligne, `Card`, `RichListBox`, `StackPanel` et `NavigationHost` pour les têtes
  Android et iOS.
- **[Animation]({{ site.github_url }}/blob/main/docs/animation.md)** — `RequestAnimationFrame`,
  interpolations et courbes d'accélération, et l'horloge manuelle pour les tests headless.
- **[Automatisation et tests d'interface]({{ '/fr/automation/' | relative_url }})** — écrivez des tests
  d'interface qui s'exécutent en headless dans la CI, pilotez l'application depuis Selenium, FlaUI ou un
  assistant IA via le serveur MCP, et activez les lecteurs d'écran sous Windows.
- **[Interopérabilité native]({{ '/fr/native-interop/' | relative_url }})** — héberger du contenu natif
  (vidéo, cartes, moteurs de navigateur) et pourquoi `Control.Handle` n'est pas un `HWND`.

## Migrer une application WinForms existante
{:#migrating-an-existing-winforms-app}

Vous reprenez une base de code existante plutôt que de partir de zéro ? Deux documents couvrent le sujet :

- **[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)** — comment la CLI
  `majorsilence-migrate` (`dotnet tool install -g Majorsilence.Forms.Migrator`) réécrit une solution
  WinForms sur Majorsilence.Forms, et comment lire sa sortie.
- **[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md)** — ce qui
  est entièrement implémenté, ce qui est approximé, et ce qui est délibérément hors périmètre, une fois
  que votre code compile.

> Stade bêta : l'API se stabilise et tous les recoins de WinForms ne sont pas encore couverts. C'est un
> bon choix pour de nouvelles applications métier multiplateformes et pour migrer de vraies applications
> dès aujourd'hui — figez simplement votre version.
