---
layout: docs
lang: fr
title: Guide de formation
subtitle: Un cursus structuré pour les équipes applicatives qui développent et livrent sur Majorsilence.Forms — chaque exemple en C# et en VB.NET. Révisé en octobre 2026 pour 26.9.0.
seo_title: "Guide de formation WinForms multiplateforme (C# et VB.NET)"
description: >-
  Un cursus structuré pour les équipes qui développent ou migrent une application WinForms vers une
  pile multiplateforme — modèle mental, migration, sept backends, boîtes de dialogue asynchrones,
  thèmes, tests, CI. C# et VB.NET.
keywords:
  - formation winforms
  - tutoriel winforms multiplateforme
  - guide de migration winforms
  - vb.net interface multiplateforme
  - winforms linux mac
  - cursus équipe winforms
  - migrer une application winforms
priority: "0.8"
permalink: /fr/training/
---

Voici le guide à remettre à une équipe de développement qui s'apprête à construire — ou à migrer —
**une application** sur Majorsilence.Forms. Il suppose une expérience de WinForms et rien d'autre.

Il se limite délibérément à l'*utilisation* du framework : référencer les paquets, écrire des
formulaires, déplacer une base de code existante, choisir vos cibles, tester ce que vous avez construit
et le livrer. Ce n'est **pas** un guide du contributeur — vous n'avez jamais besoin de cloner ni de
compiler le framework lui-même pour en suivre une seule ligne. (Si vous finissez par vouloir corriger
quelque chose dans le framework, le [module 10](#module-10-gaps) vous indique le seul paragraphe qui
compte.)

**Chaque exemple de code apparaît en C# et en VB.NET.** Les exemples C# de l'édition originale ont été
compilés et exécutés sous macOS avant publication — les captures d'écran de ce guide sont ces
exécutions, pas des maquettes, et deux des mises en garde honnêtes que vous lirez ci-dessous ont été
découvertes en les exécutant. Les exemples ajoutés dans la révision d'octobre 2026 (thèmes, MVVM,
boîtes de dialogue asynchrones, les backends les plus récents, images d'animation, état d'automatisation
personnalisé) ont été vérifiés par rapport à la documentation et aux exemples du dépôt lui-même plutôt
qu'exécutés pour ce guide, et sont signalés comme tels là où cela compte. VB est ici une cible de
migration de premier rang : le migrateur traite les fichiers `.vbproj`/`.vb`, réinjecte le constructeur
que le compilateur VB classique fournissait, et génère un accesseur `My.Resources`. Trois mises en garde
propres à VB sont signalées là où elles tombent — [`--dual-build` est réservé à C#](#module-5-dualbuild),
[`My.*` n'est que partiellement implémenté](#module-5-checklist), et [VB n'a pas d'initialiseur de
module pour la mise en place des tests](#module-8-headless).

Deux façons de l'utiliser :

| Format | Comment | Modules |
|---|---|---|
| **Atelier de deux jours** | Jour 1 : modules 0–4 (modèle, première application, savoir ce qui fonctionne, dessin). Jour 2 : modules 5–10 (migration, cibles, interopérabilité, tests, contenu natif, livraison). | tous |
| **En autonomie** | Les modules 0–3 sont le tronc commun obligatoire — personne ne devrait commencer une migration sans eux. Ensuite, prenez le 5 si vous migrez, ou le 6 + le 8 si vous construisez quelque chose de nouveau. Les annexes D et E (thèmes, helpers MVVM) sont une lecture facultative pour qui est responsable de l'apparence et du câblage des view-models. | au choix |

Deux choses à accepter d'emblée, parce qu'elles façonnent chaque décision ci-dessous. Majorsilence.Forms
est en **bêta** : l'API se stabilise et tous les recoins de WinForms ne sont pas couverts — figez donc
la version de vos paquets. Et il est **compile-et-approxime, pas au pixel près** : le code migré est
conçu pour compiler *et s'exécuter*, certains membres ne faisant délibérément rien pour l'instant. Le
module 3 est entièrement consacré à la façon de distinguer les deux, et c'est le module qui récompense le
plus une lecture lente.

---

## Sommaire
{:#contents}

- [Module 0 — Faire tourner quelque chose](#module-0)
- [Module 1 — Le modèle mental : des contrôles auto-dessinés sur un hôte interchangeable](#module-1)
- [Module 2 — Votre première application](#module-2)
- [Module 3 — Savoir ce qui fonctionne avant de construire dessus](#module-3)
- [Module 4 — Dessin et peinture personnalisée](#module-4)
- [Module 5 — Migrer votre application WinForms](#module-5)
- [Module 6 — Choisir vos cibles](#module-6)
- [Module 7 — Adoption incrémentale sous Windows](#module-7)
- [Module 8 — Tester votre application](#module-8)
- [Module 9 — Contenu natif et vidéo](#module-9)
- [Module 10 — Livrer : CI, gestion des versions, rester à jour](#module-10)
- [Annexe A — Dépannage par symptôme](#appendix-a)
- [Annexe B — Plan de déploiement pour une base de code réelle](#appendix-b)
- [Annexe C — Carte de référence](#appendix-c)
- [Annexe D — Thémer votre application avec CSS](#appendix-d)
- [Annexe E — Helpers MVVM](#appendix-e)

---

## Module 0 — Faire tourner quelque chose
{:#module-0}

**Objectif :** chaque développeur a sa propre application qui tourne sur son propre OS, et sait où
chercher la réponse à « ce framework sait-il faire X ».

Il vous faut seulement le [SDK .NET 10](https://dotnet.microsoft.com/download). Pas de Windows, pas de
Visual Studio, pas de workloads de plateforme, et pas de sources du framework.

```
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

Voilà une application multiplateforme qui tourne. Notez la forme de ce qui a été généré, parce que c'est
la forme à conserver : une **solution avec deux projets** — `MajorsilenceFormsApp.Shared`, une
bibliothèque de classes ordinaire contenant `MainForm` et son fichier Designer, et
`MajorsilenceFormsApp`, une mince *tête* bureau sur le backend Avalonia. Vos formulaires vivent dans la
bibliothèque partagée ; une tête n'est qu'un point d'entrée plus un backend. C'est ce qui permet à la
même interface de tourner plus tard sur un téléphone ou dans un navigateur en ajoutant une autre tête
plutôt qu'en touchant aux formulaires ([module 6](#module-6)) :

```
dotnet new majorsilenceforms -n MyApp --IncludeAndroid --IncludeWasm --IncludeiOS
```

Chaque option ajoute un projet de tête et nécessite son workload (`android`, `wasm-tools`, `ios` — le
dernier sur Mac uniquement) ; les trois sont désactivées par défaut, de sorte que la commande simple
compile sans aucun workload supplémentaire installé. `--msformsVersion` et `--avaloniaVersion` figent
les versions de paquets que le projet généré référence.

Passons maintenant à la documentation de référence.

**Votre documentation d'API, c'est la galerie de contrôles.** Il n'existe pas encore de référence d'API
autonome, donc la réponse la plus rapide à « est-ce que `TreeView` prend en charge X » est la galerie —
un panneau de démonstration par contrôle intégré. Le coup d'œil le plus rapide ne coûte rien : la
[galerie en direct dans le navigateur]({{ '/gallery/' | relative_url }}) est le vrai framework compilé
en WebAssembly, sans aucune installation.

![L'exemple ControlGallery tournant sous macOS, avec le panneau Button sélectionné]({{ '/assets/img/gallery-macos.png' | relative_url }})

*`ControlGallery` sous macOS 26, backend Avalonia, panneau `Button` sélectionné. Notez ce qui appartient
au framework et ce qui ne lui appartient pas : la barre de titre aux boutons « feux tricolores » est
celle de l'OS, et chaque pixel en dessous — l'arbre de navigation, sa barre de défilement, les variantes
de bouton — est dessiné par Majorsilence.Forms via Skia.*

Quand vous avez besoin de lire le code derrière un contrôle plutôt que de simplement le regarder, clonez
le dépôt pour son dossier [`samples/`]({{ site.github_url }}/tree/main/samples) et lancez ce que vous
voulez étudier :

```
git clone https://github.com/majorsilence/Majorsilence.Forms.git
dotnet run --project samples/Gallery.Avalonia   # la galerie, sur le backend bureau
dotnet run --project samples/Explorer           # un clone de l'Explorateur Windows
dotnet run --project samples/Outlaw             # un clone d'Outlook
```

> **Lancez les exemples avec `dotnet run --project …`, ou depuis le répertoire de sortie de la
> compilation — pas depuis la racine du dépôt.** Chaque exemple charge ses icônes via un chemin
> *relatif* (`ImageLoader` utilise `"Images"`), qui se résout par rapport au **répertoire de travail du
> processus**, pas à l'emplacement de l'assembly. Lancez l'exécutable compilé depuis n'importe où ailleurs
> et chaque fichier d'icône manque — et `Bitmap(string)` se dégrade en un substitut de 1×1 au lieu de
> lever une exception, donc l'application démarre proprement, ne journalise rien, et s'affiche avec
> toutes ses icônes invisibles.
>
> Cela vaut la peine de le faire une fois exprès, parce que **votre propre application hérite de ce
> comportement**. Le correctif dans votre code consiste à résoudre les ressources par rapport à
> l'emplacement de l'assembly :
>
> **C#**
>
> ```csharp
> using Majorsilence.Forms.Drawing;
>
> static readonly string ImageRoot =
>     Path.Combine (AppContext.BaseDirectory, "Images");
>
> public static Bitmap Load (string fileName)
>     => new Bitmap (Path.Combine (ImageRoot, fileName));
> ```
>
> **VB.NET**
>
> ```vb
> Imports System.IO
> Imports Majorsilence.Forms.Drawing
>
> Private Shared ReadOnly ImageRoot As String =
>     Path.Combine(AppContext.BaseDirectory, "Images")
>
> Public Shared Function Load(fileName As String) As Bitmap
>     Return New Bitmap(Path.Combine(ImageRoot, fileName))
> End Function
> ```
>
> C'est le [mode de défaillance du no-op silencieux](#module-3-cost) en miniature, et le rencontrer sur
> un exemple dont vous *savez* qu'il fonctionne coûte bien moins cher que de le rencontrer pour la
> première fois en production.

**Exercice 0.** Créez l'application à partir du modèle, lancez-la, et ajoutez un `Button` qui affiche
une `MessageBox`. Ouvrez ensuite la galerie en direct et trouvez trois contrôles dont dépend votre
propre application.

---

## Module 1 — Le modèle mental : des contrôles auto-dessinés sur un hôte interchangeable
{:#module-1}

**Objectif :** vous savez prédire quels idiomes WinForms passent intacts, lesquels se comportent
différemment, et lesquels ne peuvent pas fonctionner du tout — à partir des premiers principes plutôt
qu'en cherchant dans la documentation.

Il y a un fait architectural, et presque tout le reste en découle :

> **Majorsilence.Forms fait tout son dessin lui-même avec SkiaSharp. La boîte à outils de fenêtrage
> en dessous n'est qu'un hôte.**

```
        Votre application  (Forms, contrôles, fichiers Designer — le modèle WinForms que vous connaissez)
            │
       Majorsilence.Forms  (contrôles + API compatible WinForms, dessinés avec SkiaSharp)
            │
   Backend hôte interchangeable
   ├─ Avalonia   → Windows · macOS · Linux  (défaut)  · aussi Android · iOS · navigateur
   ├─ Uno        → bureau · iOS · Android · WebAssembly
   ├─ GTK 4      → Linux d'abord (vrai Gtk.Window) ; Windows/macOS avec le runtime GTK
   ├─ Terminal   → une console (graphiques Kitty / Sixel / blocs Unicode) — vue unique, comme un téléphone
   ├─ WinForms   → Windows uniquement ; de vraies fenêtres System.Windows.Forms — un backend de *migration*
   ├─ WPF        → Windows uniquement ; une vraie Window WPF — la même idée de migration
   └─ Headless   → rendu hors écran pour les tests / la CI
```

Sept backends, un seul jeu de formulaires. Les deux réservés à Windows existent dans un seul but —
permettre à une application WinForms ou WPF d'adopter Majorsilence.Forms un contrôle à la fois
([module 7](#module-7-c)) — et le backend Terminal est la preuve que l'hôte est vraiment
interchangeable : rien dans votre formulaire ne sait s'il est présenté à travers une swapchain GPU ou un
caractère `▄`.

Chaque contrôle peint dans un canevas Skia. L'hôte en dessous crée les fenêtres natives, fait tourner
la boucle de messages, délivre les entrées et présente la surface rendue — et c'est tout ce qu'il fait.
Le paquet cœur ne référence absolument aucune boîte à outils de fenêtrage ; c'est le backend que vous
référencez qui en fournit une. Pour vous, développeur d'application, cette couture a exactement deux
conséquences pratiques : **une ligne de votre fichier projet choisit votre hôte** ([module 6](#module-6)),
et **aucun type de boîte à outils n'apparaît jamais dans votre code** — vous écrivez contre `Form`,
`Control`, `MouseButtons`, `Keys` et les types valeur de `System.Drawing`, exactement comme en WinForms.

### Ce qui en découle
{:#module-1-consequences}

Ce tableau est la récompense du module. Tout ce qu'il contient est une différence de comportement que
vous pouvez déduire par le raisonnement, plutôt que mémoriser.

| Parce que le dessin appartient au framework et les fenêtres à l'hôte… | Donc… |
|---|---|
| Une fenêtre native de l'OS par fenêtre de premier niveau ; tout ce qu'elle contient est peint | `Control.Handle` vaut `IntPtr.Zero`. Il n'y a aucun objet de l'OS derrière un `Button` à rapporter. Voir le [module 9](#module-9). |
| `WindowBase.Handle` doit encore satisfaire l'idiome WinForms « toucher `.Handle` pour forcer la création » | Il renvoie un **jeton opaque non nul — pas un `HWND`**. Ne le passez jamais à du code natif. `WindowBase.PlatformHandle` est le vrai de vrai — réel sur le backend Avalonia (`HWND`/`NSWindow`/`XID`) et sur le backend WinForms (un vrai `HWND`) ; zéro ailleurs. |
| Le framework met lui-même son canevas à l'échelle de l'écran | **Tout ce que vous voyez sur un `Control` est en unités logiques** — `Width`/`Height`/`Bounds`, `MouseEventArgs`, et (depuis le 2026-10-01) `ClientRectangle`, `ClientSize` et le canevas de peinture aussi. Le code WinForms ordinaire de disposition et de peinture a la bonne taille à n'importe quelle mise à l'échelle, sans modification. Les pixels physiques sont en opt-in (`ScaledBounds`, `PaintEventArgs.Scaling`, `LogicalToDeviceUnits`). La seule exception : les événements owner-draw (`DrawItem`, `DrawNode`, `CellPainting`, …) vous donnent toujours des bornes en pixels physiques avec un `Graphics` en pixels physiques. Voir le [module 4](#module-4-paint). |
| L'apparence est résolue par le framework, pas par Win32 | `BackColor`, `ForeColor` et `Font` sont **ambiants** — voir l'exemple ci-dessous. Et comme le framework peint tout, une seule feuille de style CSS peut restyler toute l'application ([annexe D](#appendix-d)). |
| Le routage des entrées appartient au framework | **La capture de la souris appartient au contrôle qui l'a prise pour toute la durée du geste** — un glissement commencé sur un conteneur survit au passage au-dessus d'un bouton posé dessus. Un enfant qui prend lui-même la capture l'emporte toujours sur ses ancêtres. |
| Ici, un `Form` n'est pas un `Control` — il dérive d'un `WindowBase` interne | Les membres courants de `Control` existent sur `Form` (`Anchor`, `Dock`, `TabIndex`, `Padding`/`Margin`, `Parent`, `MouseEnter`/`MouseLeave`), mais un `Form` ne peut toujours pas entrer dans une `Control.ControlCollection` ni être trouvé par un parcours d'arbre typé `Control`. |
| Le tactile est une entrée de premier rang, pas une émulation de souris | `Control` lève `LongPress`, `Pinch`, `Swipe` et `ScrollGesture`. **Aucun d'eux ne se déclenche pour la souris.** `ScrollableControl` applique déjà `ScrollGesture` à `AutoScrollPosition`, donc vos sous-classes de `Panel`/`ListBox`/`TreeView` obtiennent le défilement tactile sans changer de code. |

**L'apparence ambiante, l'idiome WinForms qui survit.** `BackColor`, `ForeColor` et `Font` parcourent
chacun la chaîne de style propre au contrôle, puis la chaîne des parents, puis la fenêtre hôte, puis le
thème. Colorer une fois un conteneur et laisser ses enfants en hériter fonctionne donc exactement comme
vous l'attendez :

**C#**

```csharp
var panel = new Panel {
    BackColor = Color.FromArgb (32, 32, 32),
    ForeColor = Color.White,                 // les enfants en héritent…
    Dock = DockStyle.Fill
};

panel.Controls.Add (new Label  { Text = "Inherits white text", Left = 12, Top = 12 });
panel.Controls.Add (new Button { Text = "So does this",        Left = 12, Top = 40 });

// …mais une surface de saisie fige son propre fond, parce que WinForms lui donne SystemColors.Window.
panel.Controls.Add (new TextBox { Left = 12, Top = 80, Width = 200 });   // reste clair
Controls.Add (panel);
```

**VB.NET**

```vb
Dim panel As New Panel With {
    .BackColor = Color.FromArgb(32, 32, 32),
    .ForeColor = Color.White,
    .Dock = DockStyle.Fill
}

panel.Controls.Add(New Label With {.Text = "Inherits white text", .Left = 12, .Top = 12})
panel.Controls.Add(New Button With {.Text = "So does this", .Left = 12, .Top = 40})

' Une surface de saisie fige son propre fond, parce que WinForms lui donne SystemColors.Window.
panel.Controls.Add(New TextBox With {.Left = 12, .Top = 80, .Width = 200})   ' reste clair
Controls.Add(panel)
```

![L'exemple d'apparence ambiante tournant sous macOS]({{ '/assets/img/example-ambient.png' | relative_url }})

*Exactement ce code, en cours d'exécution. Les libellés du `Label` et du `Button` ont hérité du blanc du
panneau ; le `TextBox` a gardé son propre fond clair.*

Cette asymétrie délibérée — les conteneurs cascadent, `TextBox`/`ComboBox` non — est la question
« pourquoi mon thème sombre n'est-il appliqué qu'à moitié » la plus fréquente, et elle est conforme à
WinForms.

La portabilité que tout cela achète est visible. Le même exemple `Explorer`, trois systèmes
d'exploitation, une seule base de code :

![L'exemple Explorer sous Windows]({{ '/assets/img/explorer-windows.png' | relative_url }})

*Windows — tiré de la documentation du projet.*

![L'exemple Explorer sous Ubuntu]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

*Ubuntu (AMD64) — tiré de la documentation du projet.*

![L'exemple Explorer sous macOS]({{ '/assets/img/explorer-macos.png' | relative_url }})

*macOS 26 — capturé depuis la version actuelle.*

**Exercice 1.** Répondez à partir du tableau ci-dessus, sans chercher : si vous passez `myButton.Handle`
à une bibliothèque vidéo native, que se passe-t-il, et que devriez-vous faire à la place ? Trouvez
ensuite dans votre propre base de code WinForms un endroit qui définit `BackColor` sur un conteneur et
compte sur l'héritage par les enfants, et prédisez s'il fonctionne encore.

---

## Module 2 — Votre première application
{:#module-2}

**Objectif :** vous savez créer une application Majorsilence.Forms de zéro, dans l'un ou l'autre
langage, et expliquer ce que fait chaque ligne.

### Le fichier projet
{:#module-2-project}

Partez d'une application console et changez trois choses.

**C# — `MyApp.csproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
  </ItemGroup>
</Project>
```

**VB.NET — `MyApp.vbproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <RootNamespace>MyApp</RootNamespace>
    <OptionStrict>On</OptionStrict>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Majorsilence.Forms" Version="26.9.0" />
    <PackageReference Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
  </ItemGroup>
</Project>
```

Notez ce qui **n'est pas** là dans la version VB : pas de `MyType`, pas de framework d'application VB.
C'est la seule différence structurelle que le migrateur ne peut pas masquer, et c'est pourquoi
[`--dual-build` n'est pas proposé pour VB](#module-5-dualbuild).

Une note sur les frameworks cibles, puisque le suffixe `-windows` est la première chose qu'une migration
retire : un simple `net10.0` (ou `net8.0`) est tout ce dont une tête multiplateforme a besoin. Les paquets
cœur (`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`) livrent
aussi une version **`netstandard2.0`**, et c'est ce qui permet à une application classique
**.NET Framework 4.8** de référencer les contrôles — associée à la ligne `net48` du backend WinForms ou
WPF ([module 7](#module-7-c)). Les backends multiplateformes sont `net8.0`+ uniquement.

**Les deux paquets, et c'est la partie à dire à voix haute en formation.** Le paquet cœur
`Majorsilence.Forms` ne référence aucune boîte à outils de fenêtrage — seulement SkiaSharp. Il possède
les contrôles et le dessin ; il ne peut pas mettre une fenêtre à l'écran. `Majorsilence.Forms.Avalonia`
est le backend qui le fait, et c'est en le référençant que l'application devient *exécutable* sous
Windows, macOS et Linux. Remplacez cette seconde ligne par `Majorsilence.Forms.Uno`, `.Gtk4`,
`.Terminal`, `.WinForms`, `.Wpf` ou `.Headless` pour cibler un autre hôte — cette seule ligne (plus,
pour les backends autres que celui par défaut, une ligne de code de sélection) constitue tout le
changement ([module 6](#module-6)).

### La plus petite application complète
{:#module-2-code}

**C#**

```csharp
using Majorsilence.Forms;

public class MainForm : Form
{
}

static class Program
{
    [STAThread]
    static void Main (string [] args)
    {
        Application.Run (new MainForm ());
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Public Class MainForm
    Inherits Form
End Class

Module Program
    <STAThread>
    Sub Main(args As String())
        Application.Run(New MainForm())
    End Sub
End Module
```

Cette application tourne sous Windows, macOS et Linux sans autre configuration, parce que le backend est
résolu automatiquement quand son paquet est référencé. Si vous voulez un backend *différent*,
affectez-le **avant la création de la première fenêtre** :

**C#**

```csharp
Majorsilence.Forms.Backends.Platform.Backend =
    new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Application.Run (new MainForm ());     // doit venir après
```

**VB.NET**

```vb
Majorsilence.Forms.Backends.Platform.Backend =
    New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Application.Run(New MainForm())        ' doit venir après
```

Cette contrainte d'ordre est réelle et piège les gens : construire un formulaire touche le backend.
C'est aussi pourquoi les points d'entrée mobile et navigateur ([module 6](#module-6)) prennent une
*fabrique* plutôt qu'une instance.

### Un formulaire qui fait vraiment quelque chose
{:#module-2-interactive}

La disposition en code, un gestionnaire d'événements, une boîte de dialogue et un résultat modal — les
quatre choses dont chaque écran a besoin. Notez que c'est de la mémoire musculaire WinForms ordinaire :
`Anchor`, `Dock`, `DialogResult`, `MessageBox`.

**C#**

```csharp
using Majorsilence.Forms;
using System.Drawing;

public class GreetForm : Form
{
    private readonly TextBox nameBox;
    private readonly Button  okButton;

    public GreetForm ()
    {
        Text = "Greeter";
        ClientSize = new Size (360, 140);

        var prompt = new Label {
            Name = "promptLabel", Text = "Your name:",
            Left = 12, Top = 16, Width = 100
        };

        nameBox = new TextBox {
            Name = "nameBox", AccessibleName = "Full name",
            Left = 12, Top = 40, Width = 336,
            Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right
        };

        okButton = new Button {
            Name = "okButton", Text = "OK",
            Left = 188, Top = 96, Width = 75,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Right
        };

        var cancelButton = new Button {
            Name = "cancelButton", Text = "Cancel",
            Left = 273, Top = 96, Width = 75,
            Anchor = AnchorStyles.Bottom | AnchorStyles.Right
        };

        okButton.Click     += OkButton_Click;
        cancelButton.Click += (sender, e) => {
            DialogResult = DialogResult.Cancel;
            Close ();
        };

        Controls.Add (prompt);
        Controls.Add (nameBox);
        Controls.Add (okButton);
        Controls.Add (cancelButton);
    }

    private void OkButton_Click (object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace (nameBox.Text)) {
            MessageBox.Show ("Please enter a name.", "Greeter",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return;
        }

        DialogResult = DialogResult.OK;
        Close ();
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports System.Drawing

Public Class GreetForm
    Inherits Form

    Private ReadOnly nameBox As TextBox
    Private ReadOnly okButton As Button

    Public Sub New()
        Text = "Greeter"
        ClientSize = New Size(360, 140)

        Dim prompt As New Label With {
            .Name = "promptLabel", .Text = "Your name:",
            .Left = 12, .Top = 16, .Width = 100
        }

        nameBox = New TextBox With {
            .Name = "nameBox", .AccessibleName = "Full name",
            .Left = 12, .Top = 40, .Width = 336,
            .Anchor = AnchorStyles.Top Or AnchorStyles.Left Or AnchorStyles.Right
        }

        okButton = New Button With {
            .Name = "okButton", .Text = "OK",
            .Left = 188, .Top = 96, .Width = 75,
            .Anchor = AnchorStyles.Bottom Or AnchorStyles.Right
        }

        Dim cancelButton As New Button With {
            .Name = "cancelButton", .Text = "Cancel",
            .Left = 273, .Top = 96, .Width = 75,
            .Anchor = AnchorStyles.Bottom Or AnchorStyles.Right
        }

        AddHandler okButton.Click, AddressOf OkButton_Click
        AddHandler cancelButton.Click,
            Sub(sender As Object, e As EventArgs)
                DialogResult = DialogResult.Cancel
                Close()
            End Sub

        Controls.Add(prompt)
        Controls.Add(nameBox)
        Controls.Add(okButton)
        Controls.Add(cancelButton)
    End Sub

    Private Sub OkButton_Click(sender As Object, e As EventArgs)
        If String.IsNullOrWhiteSpace(nameBox.Text) Then
            MessageBox.Show("Please enter a name.", "Greeter",
                            MessageBoxButtons.OK, MessageBoxIcon.Warning)
            Return
        End If

        DialogResult = DialogResult.OK
        Close()
    End Sub
End Class
```

![L'exemple GreetForm tournant sous macOS]({{ '/assets/img/example-greet.png' | relative_url }})

*`GreetForm`, en cours d'exécution. Le `TextBox` s'est étiré avec la fenêtre grâce à son ancrage
`Top | Left | Right` ; les deux boutons sont restés épinglés en bas à droite.*

Appuyez sur OK avec la zone vide et le chemin de validation s'exécute :

![La MessageBox du chemin de validation]({{ '/assets/img/example-messagebox.png' | relative_url }})

*`MessageBox.Show` ouvre une vraie fenêtre modale — elle bloque le gestionnaire et désactive le parent,
comme il se doit. Notez le détail honnête : `MessageBoxIcon.Warning` est accepté mais aucun glyphe
d'avertissement n'est encore dessiné. C'est la [politique des stubs](#module-3-stub-policy) en action —
l'appel fonctionne, un détail visuel non, et rien ne lève d'exception.*

L'afficher en modal depuis un formulaire parent est inchangé par rapport à WinForms :

**C#**

```csharp
using var dialog = new GreetForm ();

if (dialog.ShowDialog (this) == DialogResult.OK)
    statusLabel.Text = "Hello!";
```

**VB.NET**

```vb
Using dialog As New GreetForm()
    If dialog.ShowDialog(Me) = DialogResult.OK Then
        statusLabel.Text = "Hello!"
    End If
End Using
```

Deux choses à remarquer, parce que ce sont celles qui piègent les gens : le `Name` sur chaque contrôle
interactif n'est pas décoratif — il devient le localisateur de test *et* l'identifiant d'accessibilité
([module 8](#module-8)) — et `Anchor` utilise `AnchorStyles.Top Or AnchorStyles.Left` en VB là où C#
utilise `|`, ce qui est la faute de portage VB la plus fréquente.

Une troisième, si une tête navigateur ou téléphone figure quelque part sur votre feuille de route : les
`ShowDialog` et `MessageBox.Show` bloquants ci-dessus sont réservés au bureau. Sur les lignes navigateur,
Android et iOS, ils lèvent `PlatformNotSupportedException` *avant* d'afficher quoi que ce soit, et chaque
boîte de dialogue a un jumeau awaitable (`ShowDialogAsync`, `MessageBox.ShowAsync`). Rien à changer
aujourd'hui — mais lisez la [règle des boîtes de dialogue asynchrones](#module-6-async) avant d'écrire
votre centième gestionnaire, parce qu'une bibliothèque d'interface partagée coûte bien moins cher à
écrire en asynchrone dès le départ qu'à convertir plus tard.

### À quoi ressemble une vraie application
{:#module-2-real}

Un formulaire isolé n'est pas une cible de formation. L'exemple `PointOfSale` est la forme à copier pour
le travail métier — quatre projets, pas un :

| Projet | Rôle |
|---|---|
| `PointOfSale.Client` | L'application bureau Majorsilence.Forms (formulaires, panneaux, contrôles personnalisés, services) |
| `PointOfSale.Api` | API minimale ASP.NET Core avec authentification JWT et stratégies basées sur les rôles |
| `PointOfSale.Contracts` | DTO partagés par les deux côtés |
| `PointOfSale.Data` | Persistance et amorçage EF Core + SQLite |

Rien dans la couche d'interface ne contraint votre architecture : c'est un client .NET ordinaire, donc
vos choix existants de DI, HTTP, journalisation et persistance passent tous inchangés.

Et `Outlaw` est la réponse à « est-ce que ça tient pour une application complexe à plusieurs volets ? » :

![L'exemple Outlaw, un clone d'Outlook, tournant sous macOS]({{ '/assets/img/outlaw-macos.png' | relative_url }})

*`Outlaw` sous macOS 26 — un clone d'Outlook, délibérément pas une démo jouet : un rail d'icônes, un
arbre de dossiers, une liste de messages virtualisée et une barre d'état, tous dessinés par
Majorsilence.Forms. La ligne de message est sélectionnée ; le volet de lecture reste un substitut parce
que l'exemple ne lui câble jamais la sélection — c'est un exercice de disposition et de densité de
contrôles, pas un client de messagerie.*

**Prévoyez ceci dès maintenant :** il n'y a **pas encore de concepteur visuel**. Le *code* Designer
migre et s'exécute — le motif `*.Designer.cs`/`*.Designer.vb` est préservé tel quel, et les types de
conception que vos bibliothèques de contrôles référencent compilent toujours — mais rien ne les
instancie à l'exécution et il n'y a pas de surface de conception pour éditer la disposition. C'est une
fonctionnalité souhaitée avec un plan écrit, pas une fonctionnalité reportée. Budgétez l'édition
manuelle des fichiers Designer, ou la disposition en code comme ci-dessus.

**Exercice 2.** Construisez `GreetForm` dans le langage de votre équipe. Basculez ensuite le paquet de
backend vers Headless et confirmez que l'application démarre et se termine sans ouvrir de fenêtre — vous
réutiliserez exactement cette configuration au [module 8](#module-8).

---

## Module 3 — Savoir ce qui fonctionne avant de construire dessus
{:#module-3}

**Objectif :** avant de dépendre d'un membre quelconque, vous savez comment découvrir s'il fonctionne
vraiment — et vous reconnaissez au premier coup d'œil le mode de défaillance caractéristique du
framework.

C'est le module le plus important du guide. Lisez une fois de bout en bout le
[`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md), puis gardez-le
ouvert pendant que vous travaillez. Il existe exactement pour votre situation : un développeur avec une
base de code WinForms qui décide à quoi se fier.

### La politique des stubs
{:#module-3-stub-policy}

> **Si un membre n'a pas encore d'implémentation fonctionnelle, il ne fait rien en toute sécurité (ou
> renvoie une valeur par défaut raisonnable) au lieu de lever `NotImplementedException`.**

C'est une politique délibérée et cohérente sur toute la couche de compatibilité, et c'est ce qui permet
au code migré de compiler *et de s'exécuter* même là où une fonctionnalité visuelle ne fait encore rien.
Concrètement :

- Une propriété sans comportement sous-jacent est une simple propriété automatique affectable — elle
  stocke ce que vous définissez et le relit, elle ne change simplement pas le comportement à l'exécution.
- Une méthode sans implémentation renvoie une valeur neutre plutôt que de lever une exception — par
  exemple une boîte de dialogue dont le `ShowDialog()` n'a pas encore de vraie interface renvoie
  immédiatement `DialogResult.OK`.
- Un événement qui n'est jamais levé compile toujours et peut être souscrit ; il ne se déclenche
  simplement jamais. Utilisé avec parcimonie, et signalé par type dans la matrice.

**Si vous tombez sur un membre qui lève une exception au lieu d'être un stub, c'est un bogue —
signalez-le** ([module 10](#module-10-gaps)).

### Le coût de cette politique — et l'histoire à raconter à votre équipe
{:#module-3-cost}

Un no-op silencieux est le type de lacune le plus difficile à trouver : il compile, il s'exécute, et le
seul symptôme est une sortie erronée quelque part en aval. L'exemple canonique mérite d'être raconté
mot pour mot, parce qu'il enseigne le mode de défaillance mieux que n'importe quelle règle :

`Image.MakeTransparent` était vide. Du code de jeu porté rendait transparente la couleur de fond d'une
feuille de sprites, l'appel ne faisait rien, et chaque sprite se dessinait avec une boîte blanche
derrière lui. Rien n'a levé d'exception. Il n'y avait rien à chercher avec grep.

Deux choses en découlent pour vous. Premièrement, **quand quelque chose s'affiche ou se comporte mal et
que rien n'a levé d'exception, soupçonnez un stub avant de soupçonner votre propre code** — vérifiez la
ligne de la matrice pour le membre concerné. Deuxièmement, cette classe de lacune est maintenant
gardée : le projet fige ses méthodes publiques `void` à corps vide connues dans un test de référence
(`NoOpStubBaseline.txt` — 161 entrées au moment de la rédaction), de sorte qu'une nouvelle ne peut pas
être ajoutée en silence, et les entrées diminuent au fil des versions. Trois références sœurs figent
les autres formes de vacuité — les événements déclarés mais inertes, les événements jamais levés, et
les propriétés qui ne font que stocker une valeur (respectivement 79, 127 et 812 sur 1 254 selon ce que
la matrice rapporte actuellement). C'est pourquoi la matrice mérite d'être considérée comme une
référence fiable plutôt que comme du marketing : les chiffres sont imposés, pas estimés.

### Figez le comportement dont vous dépendez
{:#module-3-pin}

La défense pratique est un test par hypothèse. Quand une fonctionnalité compte, vérifiez l'*effet*, pas
l'existence du membre — c'est la différence entre un test qui attrape un stub et un test qui ne
l'attrape pas :

**C#**

```csharp
using Majorsilence.Forms.Drawing;
using Majorsilence.Forms.Drawing.Imaging;
using Xunit;

[Fact]
public void MakeTransparent_actually_clears_the_key_colour ()
{
    using var bitmap = new Bitmap (4, 4);
    using (var g = Graphics.FromImage (bitmap))
    using (var brush = new SolidBrush (Color.Magenta))
        g.FillRectangle (brush, new Rectangle (0, 0, 4, 4));

    bitmap.MakeTransparent (Color.Magenta);

    // Vérifiez le RÉSULTAT, pas l'existence de la méthode — un stub passerait un test « ça compile ».
    Assert.Equal (0, bitmap.GetPixel (0, 0).A);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing
Imports Majorsilence.Forms.Drawing.Imaging
Imports Xunit

<Fact>
Public Sub MakeTransparent_actually_clears_the_key_colour()
    Using bitmap As New Bitmap(4, 4)
        Using g = Graphics.FromImage(bitmap)
            Using brush As New SolidBrush(Color.Magenta)
                g.FillRectangle(brush, New Rectangle(0, 0, 4, 4))
            End Using
        End Using

        bitmap.MakeTransparent(Color.Magenta)

        ' Vérifiez le RÉSULTAT, pas l'existence de la méthode.
        Assert.Equal(0, CInt(bitmap.GetPixel(0, 0).A))
    End Using
End Sub
```

Écrivez-en un pour chaque membre sur votre chemin critique. Cela coûte quelques minutes et convertit un
no-op silencieux en une compilation rouge le jour où cela compte.

### Vérifiez, ne supposez pas — les preuves
{:#module-3-apidiff}

Le projet compare par réflexion sa propre surface publique à l'assembly de référence réel
`System.Windows.Forms` et conserve le résultat comme référence validée. La première exécution de cet
audit a trouvé **1 905 entrées manquantes** — dont **126 membres d'énumération qui existent avec la
mauvaise valeur numérique**. Cette dernière catégorie est celle à prendre personnellement : le code
compile, s'exécute, et signifie silencieusement autre chose. C'est le meilleur argument disponible pour
vérifier les membres précis sur lesquels votre application s'appuie au lieu de supposer la parité.

**Les deux références de surface d'API — WinForms et GDI+ — sont maintenant à zéro.** Chaque membre que
l'amont déclare, cette couche le déclare. Lisez cela attentivement, parce que c'est la plus petite
moitié du problème : une comparaison au niveau des noms ne peut pas demander si un membre *se comporte*
comme WinForms. Un audit de source en douze domaines (2026-08-25) a posé exactement cette question et a
trouvé **483 endroits où le comportement différait** — dont 41 assez graves pour casser une application
migrée courante. L'essentiel de cette liste a depuis été livré par phases (pré-traitement du clavier via
`ProcessCmdKey`, un seul point de passage focus/validation, de vraies boîtes de dialogue,
`AutoScaleMode.Font` qui met vraiment à l'échelle, la liaison de données en direct avec un
`CurrencyManager` fonctionnel, `ListView.View = Details` rendu comme un tableau, les événements de cycle
de vie des formulaires dans l'ordre de l'amont, l'annulation Ctrl+Z dans les zones de texte, …) ; ce
qui reste est suivi dans
[`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md). La leçon
pour votre équipe ne change pas : **« ça compile » signifie que le nom existe ; la ligne de la matrice
vous dit s'il fonctionne.**

### Lire le tableau par contrôle
{:#module-3-reading}

Le statut dans la matrice est noté du point de vue d'un développeur en migration :

| Statut | Signifie |
|---|---|
| **Implemented** | La surface courante est là. Les lacunes se limitent aux recoins profonds/rares ou aux motifs systémiques que la matrice énonce une fois. |
| **Partial** | Nomme les membres d'usage courant précis qui manquent. |
| **Missing** | Le type n'existe pas du tout sous ce nom. |

Les contrôles à fort trafic (`Button`, `TextBox`, `Panel`, `TabControl`, `TableLayoutPanel`, `TreeView`,
`ListView`, menus, barres d'outils, barres d'état, boîtes de dialogue communes, …) sont
fonctionnellement implémentés, pas des stubs. Les lacunes à connaître avant de planifier le travail :

| Type | Attention à |
|---|---|
| `DataGridView` | La plus grande lacune pour un seul type — mais les points d'accroche les plus utilisés sont **réels et se déclenchent** : `CellFormatting`, `CellPainting`, `RowPrePaint`/`RowPostPaint`, `CellParsing`, `RowValidating`/`RowValidated`, `GetClipboardContent()`, et les propriétés de style de bordure. Toujours déclarés mais jamais levés : `RowsAdded`/`RowsRemoved`, `DataError`, `SortCompare`, `CellValueNeeded`/`CellValuePushed`, la famille `CellMouse*`, et les événements `*Changed` granulaires. Le dimensionnement automatique ne fait qu'invalider. |
| `ListView` | Pas d'owner-draw, pas de rappels de récupération en mode virtuel (`VirtualMode` est une simple propriété), pas d'`InsertionMark`. |
| `TreeView` | Pas de `Sorted`, pas d'`ImageKey`/`SelectedImageKey` (l'`ImageIndex` par index fonctionne), pas de `HitTest`, pas de `ShowNodeToolTips`. |
| `ComboBox`/`ListBox`/`CheckedListBox` | `DataSource`/`DisplayMember`/`ValueMember` existent ; les points d'accroche de *format* de liaison et `Sort()` non. |
| `RichTextBox`, `MaskedTextBox` | Annuler/rétablir et `SelectedRtf` ; mode écrasement et positionnement par index de caractère, respectivement. |
| Famille `ToolStrip` | `MenuStrip`/`ContextMenuStrip`/`StatusStrip` dérivent réellement de `ToolStrip`, donc toute la surface est accessible — mais les membres au niveau `ToolStrip` sont des stubs. Affecter `Renderer`/`RenderMode` ne change **pas** la peinture ; `LayoutStyle` ne change pas la disposition ; il n'y a pas de bouton de débordement. Ce qui fonctionne est ce que chaque contrôle faisait déjà bien. |
| `WebBrowser` | La navigation fonctionne ; il n'y a aucun modèle objet DOM (`Document`, `HtmlElement`, …), parce qu'il repose sur une vraie webview, pas sur l'automatisation COM. |
| Boîtes de dialogue communes | Les résultats et `ShowDialog()` fonctionnent. Les extras propres au shell Windows (`CustomPlaces`, `AutoUpgradeEnabled`, la plomberie des hooks de dialogue) sont absents — c'est attendu, il n'y a pas de boîte de dialogue native à accrocher. |

**Travailler avec la grille, concrètement.** Puisque `DataGridView` est là où vivent la plupart des
applications métier, voici la forme qui *est* prise en charge — formatage et peinture via les événements
qui se déclenchent vraiment, plutôt que via les membres qui ne le font pas :

**C#**

```csharp
var grid = new DataGridView { Name = "ordersGrid", Dock = DockStyle.Fill };
grid.DataSource = orders;

// CellFormatting est réel : il se déclenche par cellule pendant la peinture.
grid.CellFormatting += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name != "Total")
        return;

    if (e.Value is decimal total) {
        e.Value = total.ToString ("C");
        e.CellStyle.ForeColor = total < 0 ? Color.Firebrick : Color.Black;
        e.FormattingApplied = true;          // dire à la grille de ne pas le reformater
    }
};

// CellParsing est réel aussi : il s'exécute à la validation de l'édition, et la valeur typée est ce qui est stocké.
grid.CellParsing += (sender, e) => {
    if (grid.Columns [e.ColumnIndex].Name == "Total"
        && decimal.TryParse (e.Value?.ToString (), out var parsed)) {
        e.Value = parsed;
        e.ParsingApplied = true;
    }
};
```

**VB.NET**

```vb
Dim grid As New DataGridView With {.Name = "ordersGrid", .Dock = DockStyle.Fill}
grid.DataSource = orders

' CellFormatting est réel : il se déclenche par cellule pendant la peinture.
AddHandler grid.CellFormatting,
    Sub(sender As Object, e As DataGridViewCellFormattingEventArgs)
        If grid.Columns(e.ColumnIndex).Name <> "Total" Then Return

        If TypeOf e.Value Is Decimal Then
            Dim total = CDec(e.Value)
            e.Value = total.ToString("C")
            e.CellStyle.ForeColor = If(total < 0, Color.Firebrick, Color.Black)
            e.FormattingApplied = True        ' dire à la grille de ne pas le reformater
        End If
    End Sub

' CellParsing est réel aussi : il s'exécute à la validation de l'édition, et la valeur typée est ce qui est stocké.
AddHandler grid.CellParsing,
    Sub(sender As Object, e As DataGridViewCellParsingEventArgs)
        Dim parsed As Decimal
        If grid.Columns(e.ColumnIndex).Name = "Total" AndAlso
           Decimal.TryParse(If(e.Value?.ToString(), String.Empty), parsed) Then
            e.Value = parsed
            e.ParsingApplied = True
        End If
    End Sub
```

![L'exemple DataGridView CellFormatting tournant sous macOS]({{ '/assets/img/example-grid.png' | relative_url }})

*Ce code, exécuté contre une simple `List<Order>` : colonnes générées automatiquement à partir du type
lié, valeurs formatées en devise, et négatifs en rouge parce que le `e.CellStyle.ForeColor` du
gestionnaire atteint vraiment le moteur de rendu.*

> **Une mise en garde de version à connaître si vous êtes encore figé sur 26.0.30.** Dans ce paquet, les
> valeurs des cellules liées arrivent à `CellFormatting` déjà converties en chaînes, donc
> `e.Value is decimal` ne correspond jamais et ce gestionnaire ne fait silencieusement rien — exactement
> le mode de défaillance dont traite ce module. Cela a été corrigé dans les versions suivantes (les
> cellules liées conservent le type du membre), donc le code ci-dessus est correct sur une version
> actuelle telle que 26.9.0. Si vous êtes sur 26.0.30 et voyez des valeurs non formatées, analysez
> défensivement à la place : `decimal.TryParse (e.Value?.ToString (), out var total)`. Cette forme
> fonctionne dans les deux cas.

Ce contre quoi vous ne devez *pas* encore écrire, d'après le même tableau : `RowsAdded`, `DataError`,
`SortCompare`, `CellValueNeeded` (donc pas de mode virtuel), et la famille `CellMouse*`. Chacun compile
et ne se déclenche silencieusement jamais — exactement le mode de défaillance vu [plus haut](#module-3-cost).

Deux notes pour les équipes venant de piles éditeur. **Telerik UI for WinForms** dispose d'une couche de
compatibilité de premier rang (`Majorsilence.Forms.Telerik`) dont le propre code source énonce le marché
sans détour : *la couverture est compile-et-approxime, pas au pixel près*. Et la **correction
orthographique** (câblée dans `TextBox`) est une implémentation de zéro sans dépendance, avec
soulignements ondulés et menu de suggestions — pas du tout une API WinForms ; elle existe pour soutenir
le `RadSpellChecker` de Telerik.

**Exercice 3.** Choisissez trois membres dont votre propre application dépend — un dont vous êtes sûr,
un dont vous ne l'êtes pas, et un exotique. Pour chacun, déterminez d'après la matrice s'il est
implémenté, stub ou absent, puis écrivez un [test de figeage](#module-3-pin) pour celui dont vous êtes
le moins sûr.

---

## Module 4 — Dessin et peinture personnalisée
{:#module-4}

**Objectif :** vous savez quels types `System.Drawing` restent, lesquels déménagent, et comment écrire du
code de peinture aussi bien à la façon WinForms que natif Skia.

`Majorsilence.Forms.Drawing` est un remplacement multiplateforme, basé sur Skia, du
`System.Drawing.Common` (GDI+) réservé à Windows. La répartition qui gouverne tout :

| Source | Cible | Pourquoi |
|---|---|---|
| **Primitives** `System.Drawing` — `Color`, `Point`, `PointF`, `Size`, `SizeF`, `Rectangle`, `RectangleF` | *inchangées* | Elles sont déjà livrées dans `System.Drawing.Primitives` sur toutes les plateformes. |
| **Types GDI+** `System.Drawing` — `Bitmap`, `Font`, `Pen`, `Brush`, tout ce qui touche à `Graphics` | `Majorsilence.Forms.Drawing` | GDI+ est réservé à Windows dans `System.Drawing.Common` ; réimplémenté sur SkiaSharp. |
| `System.Drawing.Drawing2D` / `.Imaging` / `.Text` | `Majorsilence.Forms.Drawing.Drawing2D` / `.Imaging` / `.Text` | Même répartition, en sous-espaces de noms. |
| `System.Drawing.Printing` | `Majorsilence.Forms.Printing` | L'impression se trouve du côté Forms de la couche de compatibilité, pas du côté dessin. |
| `System.Windows.Forms.VisualStyles`, `System.Drawing.Design`, `System.ComponentModel.Design` | *laissés tels quels* | Pas d'équivalent — signalés pour revue manuelle plutôt que réécrits vers quelque chose qui n'existe pas. |

Un détail d'empaquetage qui piège ceux qui essaient d'utiliser la couche de dessin seule : les types
valeur, images, polices et ressources vivent dans le paquet `Majorsilence.Forms.Drawing.Common`, mais
**`Graphics` lui-même est livré dans le paquet cœur `Majorsilence.Forms`** (toujours sous l'espace de
noms `Majorsilence.Forms.Drawing`). La manipulation d'images headless a donc aussi besoin que le paquet
cœur soit référencé — ce que vous avez de toute façon dans n'importe quelle application.

Trois points précis qui génèrent de vrais tickets de support :

1. **`System.Drawing.Common` doit être retiré de votre projet**, pas seulement parce qu'il est réservé à
   Windows à partir de .NET 7, mais parce que le laisser référencé remet `System.Drawing.Bitmap`/`Font`/
   `Pen` dans la portée à côté des remplacements Majorsilence — chaque utilisation non qualifiée échoue
   alors en *référence ambiguë* au lieu de se résoudre vers le portage.
2. **`SystemColors` et `ColorTranslator` sont les exceptions d'ambiguïté.** Ils vivent dans
   `System.Drawing.Primitives`, donc ils restent résolubles via le `using System.Drawing;` que vous
   conservez pour les primitives — et utilisés sans qualification, ils entrent en collision avec ceux de
   Majorsilence (CS0104). Le correctif est un alias d'une ligne, que le migrateur ajoute pour vous,
   uniquement dans les fichiers qui en ont besoin :

   **C#**

   ```csharp
   using System.Drawing;
   using SystemColors = Majorsilence.Forms.SystemColors;
   ```

   **VB.NET**

   ```vb
   Imports System.Drawing
   Imports SystemColors = Majorsilence.Forms.SystemColors
   ```

3. **Les pinceaux de dégradé et de hachures vivent là où GDI+ les met** : `LinearGradientBrush`,
   `PathGradientBrush`, `HatchBrush` et `HatchStyle` sont dans `Majorsilence.Forms.Drawing.Drawing2D`.
   `Brush`, `SolidBrush` et `TextureBrush` sont dans `Majorsilence.Forms.Drawing` — ce sont vraiment des
   types `System.Drawing`. Le code qui les atteint via l'import réécrit n'est pas affecté ; seule une
   référence pleinement qualifiée doit être mise à jour.

### Travail d'image hors écran
{:#module-4-offscreen}

`Graphics.FromImage` fonctionne comme en GDI+, ce qui signifie que la plupart de votre code d'imagerie
existant se porte en changeant seulement les imports :

**C#**

```csharp
using Majorsilence.Forms.Drawing;
using Majorsilence.Forms.Drawing.Drawing2D;
using Majorsilence.Forms.Drawing.Imaging;
using System.Drawing;

public static void SaveThumbnail (string sourcePath, string targetPath, int width)
{
    using var source = new Bitmap (sourcePath);
    var height = (int) (source.Height * (width / (double) source.Width));

    using var thumb = new Bitmap (width, height);

    using (var g = Graphics.FromImage (thumb)) {
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.SmoothingMode     = SmoothingMode.AntiAlias;

        g.DrawImage (source,
            new Rectangle (0, 0, width, height),
            0, 0, source.Width, source.Height,
            GraphicsUnit.Pixel);

        using var watermark = new SolidBrush (Color.FromArgb (96, Color.Black));
        g.FillRectangle (watermark, new Rectangle (0, height - 18, width, 18));
    }

    thumb.Save (targetPath, ImageFormat.Png);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing
Imports Majorsilence.Forms.Drawing.Drawing2D
Imports Majorsilence.Forms.Drawing.Imaging
Imports System.Drawing

Public Shared Sub SaveThumbnail(sourcePath As String, targetPath As String, width As Integer)
    Using source As New Bitmap(sourcePath)
        Dim height = CInt(source.Height * (width / CDbl(source.Width)))

        Using thumb As New Bitmap(width, height)
            Using g = Graphics.FromImage(thumb)
                g.InterpolationMode = InterpolationMode.HighQualityBicubic
                g.SmoothingMode = SmoothingMode.AntiAlias

                g.DrawImage(source,
                            New Rectangle(0, 0, width, height),
                            0, 0, source.Width, source.Height,
                            GraphicsUnit.Pixel)

                Using watermark As New SolidBrush(Color.FromArgb(96, Color.Black))
                    g.FillRectangle(watermark, New Rectangle(0, height - 18, width, 18))
                End Using
            End Using

            thumb.Save(targetPath, ImageFormat.Png)
        End Using
    End Using
End Sub
```

![La miniature produite par l'exemple d'imagerie hors écran]({{ '/assets/img/example-thumbnail.png' | relative_url }})

*La sortie réelle de cette méthode : une capture d'écran 1080×752 redimensionnée à 320 px de large avec
interpolation bicubique, avec la barre de filigrane semi-transparente le long du bas.*

Ce code n'a aucune dépendance à l'interface — il tourne dans une application console, un service ou un
test.

### Peinture personnalisée : deux façons, et quand utiliser chacune
{:#module-4-paint}

`PaintEventArgs` vous donne **les deux** surfaces. `e.Graphics` est le wrapper à la forme de GDI+, donc le
code `OnPaint` porté compile sans changement. `e.Canvas` est le `SKCanvas` brut avec lequel le framework
lui-même dessine — prenez-le quand vous voulez quelque chose que Skia fait bien et que GDI+ n'a jamais
fait.

**C# — façon WinForms, se porte sans changement**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Drawing;
using System.Drawing;

public class Badge : Control
{
    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);

        using var fill = new SolidBrush (Color.FromArgb (110, 67, 166));
        using var pen  = new Pen (Color.White, 2);

        e.Graphics.FillRectangle (fill, ClientRectangle);
        e.Graphics.DrawRectangle (pen, 1, 1, Width - 3, Height - 3);
    }
}
```

**VB.NET — façon WinForms, se porte sans changement**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Drawing
Imports System.Drawing

Public Class Badge
    Inherits Control

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        MyBase.OnPaint(e)

        Using fill As New SolidBrush(Color.FromArgb(110, 67, 166))
            Using pen As New Pen(Color.White, 2)
                e.Graphics.FillRectangle(fill, ClientRectangle)
                e.Graphics.DrawRectangle(pen, 1, 1, Width - 3, Height - 3)
            End Using
        End Using
    End Sub
End Class
```

**C# — natif Skia, pour les effets que GDI+ ne peut pas exprimer**

```csharp
using SkiaSharp;

protected override void OnPaint (PaintEventArgs e)
{
    base.OnPaint (e);

    using var paint = new SKPaint {
        IsAntialias = true,
        Shader = SKShader.CreateLinearGradient (
            new SKPoint (0, 0), new SKPoint (0, Height),
            new [] { new SKColor (110, 67, 166), new SKColor (185, 138, 255) },
            SKShaderTileMode.Clamp)
    };

    // Rectangle arrondi avec un vrai shader de dégradé — un seul appel, pas d'équivalent GDI+.
    e.Canvas.DrawRoundRect (new SKRect (0, 0, Width, Height), 12, 12, paint);
}
```

**VB.NET — natif Skia**

```vb
Imports SkiaSharp

Protected Overrides Sub OnPaint(e As PaintEventArgs)
    MyBase.OnPaint(e)

    Using paint As New SKPaint With {
        .IsAntialias = True,
        .Shader = SKShader.CreateLinearGradient(
            New SKPoint(0, 0), New SKPoint(0, Height),
            {New SKColor(110, 67, 166), New SKColor(185, 138, 255)},
            SKShaderTileMode.Clamp)
    }
        ' Rectangle arrondi avec un vrai shader de dégradé — un seul appel, pas d'équivalent GDI+.
        e.Canvas.DrawRoundRect(New SKRect(0, 0, Width, Height), 12, 12, paint)
    End Using
End Sub
```

![Les deux approches de peinture personnalisée côte à côte, tournant sous macOS]({{ '/assets/img/example-paint.png' | relative_url }})

*Les deux contrôles dans une seule fenêtre. À gauche : le chemin à la forme de GDI+ — remplissage plat,
bordure blanche de 2 px. À droite : le chemin Skia — coins arrondis et vrai shader de dégradé, en un seul
appel `DrawRoundRect`.*

**Conseil pour votre équipe :** migrez avec `e.Graphics` (c'est gratuit — le code existe déjà), et
prenez `e.Canvas` délibérément pour les nouveaux visuels. Les mélanger dans un même gestionnaire ne pose
aucun problème ; ils dessinent sur la même surface.

**Le canevas est en unités logiques — ne le mettez pas à l'échelle vous-même.** Les deux exemples
ci-dessus dessinent contre `ClientRectangle`, `Width` et `Height` et ont la bonne taille sur un bureau
HiDPI ou un téléphone (où Android rapporte une mise à l'échelle d'environ 2,6–2,75) sans code
supplémentaire, parce que le framework met le canevas à l'échelle de l'écran avant que votre `OnPaint`
ne s'exécute. Avant le 2026-10-01, le canevas était en pixels *physiques* et un contrôle personnalisé
devait appeler lui-même `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`. **Si vous avez cet appel
dans un contrôle, retirez-le** — il met maintenant le dessin à l'échelle deux fois, et le symptôme est un
contrôle qui se dessine à taille double sur un écran 2× et paraît correct sur votre moniteur 1×.
`e.ClipRectangle` et `e.Canvas` sont logiques aussi ; `PaintEventArgs.Scaling` est toujours là pour le
cas rare où vous voulez tomber sur un pixel physique exact (un trait fin, un sprite en pixel art). Le
seul endroit où vous recevez encore des pixels physiques est la famille owner-draw — `DrawItem`,
`DrawNode`, `CellPainting` et consorts — dont les `Bounds` et le `Graphics` sont cohérents entre eux mais
pas avec le `ClientRectangle` logique du contrôle. Testez l'un ou l'autre sous `MF_HEADLESS_SCALE=2`
([module 8](#module-8-headless)).

### Animer un contrôle : `RequestAnimationFrame`
{:#module-4-animation}

Un `Timer` à 16 ms est la façon dont WinForms animait, et cela fonctionne toujours. Le framework offre
aussi l'idiome du navigateur, qui est aligné sur l'affichage sous Avalonia et — la partie qui compte
pour vos tests — entièrement déterministe sous Headless. `control.RequestAnimationFrame (callback)`
rappelle **une fois**, au début de la trame suivante, avec un horodatage qui n'a de sens que comme
différence ; redemandez depuis l'intérieur du rappel pour continuer. (Vérifié par rapport à
`docs/animation.md`, pas exécuté pour ce guide.)

**C#**

```csharp
private TimeSpan? start;
private float fade;                  // 0..1 — lu par OnPaint

public void StartFade ()
{
    start = null;
    RequestAnimationFrame (OnFrame);
}

private void OnFrame (TimeSpan timestamp)
{
    start ??= timestamp;
    var progress = Math.Min (1, (timestamp - start.Value).TotalSeconds / 0.4);

    fade = (float) progress;
    Invalidate ();

    if (progress < 1)
        RequestAnimationFrame (OnFrame);   // servi sur la trame *suivante*, jamais celle-ci
}
```

**VB.NET**

```vb
Private start As TimeSpan?
Private fade As Single               ' 0..1 — lu par OnPaint

Public Sub StartFade()
    start = Nothing
    RequestAnimationFrame(AddressOf OnFrame)
End Sub

Private Sub OnFrame(timestamp As TimeSpan)
    If Not start.HasValue Then start = timestamp
    Dim progress = Math.Min(1, (timestamp - start.Value).TotalSeconds / 0.4)

    fade = CSng(progress)
    Invalidate()

    If progress < 1 Then
        RequestAnimationFrame(AddressOf OnFrame)   ' servi sur la trame *suivante*, jamais celle-ci
    End If
End Sub
```

Sur le backend Headless, rien ne s'exécute tant que vous ne faites pas avancer l'horloge, ce qui
transforme une animation en une assertion exacte : `HeadlessRenderer.AnimationClock.Reset ()`, demandez
vos trames, puis `HeadlessRenderer.AnimationClock.Step (10)` exécute dix trames de 1/60 s et votre
rappel a vu exactement dix horodatages. Le paquet `Majorsilence.Forms.Animation` superpose `Tween<T>`,
`Easing` et `control.Animate (…)` à la même demande de trame, et
`SystemInformation.PrefersReducedMotion` vous dit quand l'utilisateur en a demandé moins — à titre
indicatif, donc la vérification vous revient au moment où vous *démarrez* une animation. Détails dans
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md).

Un piège quand vous passez en natif Skia : **`SKFont`/`DrawText` bruts ne font aucun repli de police.**
Le rendu de texte propre au framework résout les glyphes manquants via une chaîne de repli, mais un
`SKTypeface.Default` nu ne le fait pas — dessinez une chaîne contenant un glyphe que cette police n'a pas
(une flèche, un emoji, du CJK) et vous obtenez la boîte de glyphe manquant, en silence. Tenez-vous-en à
`e.Graphics.DrawString` pour le texte destiné à l'utilisateur, ou choisissez votre police explicitement.

Là où Skia ne peut vraiment pas suivre GDI+, la matrice le dit au lieu de faire semblant : un `Pen` avec
une extrémité de ligne personnalisée trace en utilisant le `BaseCap` déclaré de cette extrémité
(`SKPaint` n'offre que butt/round/square), `Pen.Alignment` est stocké mais pas appliqué, et affecter
`Image.Palette` ne requantifie pas parce que le SkiaSharp moderne n'a pas de type de bitmap indexé —
chaque surface est en 32 bpp.

**Exercice 4.** Portez un morceau de code GDI+ qui vous appartient — un générateur de miniatures, un
graphique, un filigrane — contre `Majorsilence.Forms.Drawing` dans une application console sans
interface. Prenez ensuite un contrôle à peinture personnalisée et ajoutez-lui une touche native Skia (un
dégradé, un flou, un découpage arrondi) via `e.Canvas`.

---

## Module 5 — Migrer votre application WinForms
{:#module-5}

**Objectif :** vous savez lancer `majorsilence-migrate` sur votre solution, lire son rapport et
dérouler la liste de corrections manuelles qui suit.

### Installation
{:#module-5-install}

```
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate --help
```

Préférez une installation par dépôt (`dotnet new tool-manifest`, puis
`dotnet tool install Majorsilence.Forms.Migrator`, exécuté via `dotnet majorsilence-migrate`), pour que
toute l'équipe utilise la même version. **Le paquet d'outil est la seule forme livrée** — les versions
joignaient autrefois un binaire autonome à fichier unique par plateforme et ne le font plus. Il a besoin
d'un runtime .NET sur la machine (il bascule vers n'importe quelle version majeure plus récente que vous
avez), et si vous préférez ne rien installer, lancez-le depuis un clone avec
`dotnet run --project tools/Majorsilence.Forms.Migrator -- <input>`.

### À quoi ressemble la migration dans votre code source
{:#module-5-beforeafter}

Avant toute chose, mesurez la taille du changement. Voici l'en-tête d'un formulaire typique, avant et
après :

**C# — avant**

```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**C# — après**

```csharp
using System;
using System.Drawing;                                        // conservé : Color, Point, Size, Rectangle
using Majorsilence.Forms;                                    // était System.Windows.Forms
using Majorsilence.Forms.Drawing;                            // pour Bitmap
using SystemColors = Majorsilence.Forms.SystemColors;         // ajouté : résout CS0104

namespace Legacy.App
{
    public partial class CustomerForm : Form
    {
        public CustomerForm ()
        {
            InitializeComponent ();                          // votre fichier Designer est intact
            headerLabel.ForeColor = SystemColors.ControlText;
            logo.Image = new Bitmap ("Images/logo.png");
        }
    }
}
```

**VB.NET — avant**

```vb
Imports System.Drawing
Imports System.Windows.Forms

Public Class CustomerForm
    Inherits Form

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

**VB.NET — après**

```vb
Imports System.Drawing                                        ' conservé : Color, Point, Size, Rectangle
Imports Majorsilence.Forms                                    ' était System.Windows.Forms
Imports Majorsilence.Forms.Drawing                            ' pour Bitmap
Imports SystemColors = Majorsilence.Forms.SystemColors         ' ajouté : résout l'ambiguïté

Public Class CustomerForm
    Inherits Form

    ' Le migrateur réinjecte aussi le constructeur implicite sans paramètre que MyType=Empty
    ' fournissait autrefois, en s'appuyant sur le partiel Designer de ce formulaire pour ne pas le dupliquer.
    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub CustomerForm_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        headerLabel.ForeColor = SystemColors.ControlText
        logo.Image = New Bitmap("Images/logo.png")
    End Sub
End Class
```

C'est toute la forme de la chose : les imports changent, les clauses `Handles` et le code Designer
survivent, et votre logique métier n'est pas touchée.

### Sachez ce qu'est l'outil avant de discuter avec lui
{:#module-5-design}

`majorsilence-migrate` est un **réécriveur textuel/regex** multi-passes délibéré. Il n'analyse pas
d'arbre syntaxique et ne résout pas de symboles, et c'est justement le but :

- **Il fonctionne sur du code cassé.** Une solution à moitié migrée, un `.vb` référençant un type non
  porté, un projet avec une référence manquante — rien de tout cela n'arrête le réécriveur, parce qu'il
  n'a jamais besoin que le code compile ni même s'analyse. Un outil Roslyn refuserait de toucher un
  projet tant qu'il ne compile pas, ce qui va à l'encontre d'une *première passe* sur une base de code
  héritée.
- **Il est rapide** — des milliers de fichiers en quelques secondes.
- **Ce à quoi il renonce :** la vraie résolution de symboles entre projets. Il ne peut pas dire si un
  `Panel` nu est `System.Windows.Forms.Panel` ou votre propre classe nommée `Panel` ; il s'appuie sur des
  motifs de préfixe d'espace de noms et le contexte des imports. Chaque espace de noms qu'il ne
  reconnaît pas est **signalé pour revue manuelle plutôt que deviné en silence**.

Il *existe* un second moteur en opt-in pour exactement cet angle mort — `--engine roslyn`, superposé au
moteur textuel, qui utilise une vraie résolution de symboles :

| | `--engine text` (défaut) | `--engine roslyn` |
|---|---|---|
| Entrée | N'importe quel `.sln`/`.csproj`/`.vbproj`/répertoire/fichier isolé | Nécessite un projet **chargeable** ; un simple répertoire ou un fichier isolé retombe sur le texte pour toute l'exécution, avec un avertissement |
| Tolère le code qui ne compile pas | Oui | Non |
| Vitesse | Quelques secondes | Des ordres de grandeur plus lent (l'évaluation MSBuild domine) |
| Désambiguïsation des types homonymes | Non | **Oui — la raison de son existence** |
| Gestion des échecs | S.O. | Échoue de façon sûre *par projet* (les fichiers de ce projet retombent sur le texte). Si MSBuild est introuvable, l'exécution échoue franchement au lieu de se dégrader en silence |

**Règle d'équipe :** la première passe sur une grande base de code héritée utilise toujours le
`--engine text` par défaut. Prenez `--engine roslyn` ensuite, sur le résultat désormais chargeable,
seulement quand vous avez un cas *confirmé* d'un type personnalisé partageant un nom nu avec un type
WinForms/GDI+. Notez qu'il produit aussi *moins* d'avertissements à un endroit — il corrige d'emblée les
types GDI+ non qualifiés sous un simple `using System.Drawing;` au lieu de les signaler. Cette
divergence n'est pas une régression.

### La première exécution recommandée
{:#module-5-firstrun}

```
# Sur une branche git propre, commencez par un essai à blanc pour voir l'étendue :
majorsilence-migrate MySolution.sln --dry-run --diff

# Puis lancez pour de vrai — le diff par rapport au commit précédent EST la migration :
git checkout -b migrate-to-majorsilence
majorsilence-migrate MySolution.sln --no-backup
git add -A && git commit -m "Migrate to Majorsilence.Forms"
```

Exécuter sur place sur une branche suivie par git (avec `--no-backup`, puisque git *est* votre
sauvegarde) rend la migration idempotente et diffable : lancez-la, inspectez fichier par fichier,
relancez-la sans risque quand vous récupérez plus de code hérité plus tard.

Options à connaître dès le premier jour :

| Option | Usage |
|---|---|
| `-o, --output <dir>` | Écrire dans une arborescence miroir au lieu de convertir sur place |
| `-n, --dry-run`, `--diff` | Mesurer l'étendue avant de s'engager |
| `--backend <name>` | `avalonia` (défaut) \| `uno` \| `headless` — le paquet de backend qu'il référence |
| `--tfm <tfm>` | Forcer un TFM. Défaut : garder la version, retirer le suffixe `-windows` |
| `--package-version <v>` | Par défaut la version du migrateur lui-même — l'outil et les paquets sont livrés depuis la même version |
| `--map <file>` | Correspondances d'espaces de noms supplémentaires pour un éditeur sans prise en charge intégrée (répétable) |
| `--dual-build` | Garder un projet C# compilable aussi contre le vrai WinForms — voir ci-dessous |
| `--strict` | Sortir avec un code non nul au moindre avertissement de revue manuelle. **C'est votre garde-fou CI.** |
| `--report <file>` / `--no-report` | Le rapport Markdown |

Pour un éditeur sans correspondance intégrée, un fichier `--map` n'est que du JSON :

```json
{
  "namespaces":     { "DevExpress.XtraEditors": "Majorsilence.Forms.DevExpress" },
  "removePackages": [ "DevExpress.Win.*" ]
}
```

### Ce qu'il change réellement
{:#module-5-changes}

1. **Fichiers projet** — retire `UseWindowsForms`/`UseWPF`, retire le suffixe de TFM `-windows` (y
   compris dans les `.props`/`.targets` importés), retire la référence au framework Windows Desktop,
   retire les paquets NuGet réservés à WinForms (Telerik, DevExpress, **`System.Drawing.Common`**), et
   ajoute `Majorsilence.Forms` + une référence de backend — **à chaque projet qu'il touche**. Cet
   ensemble est plus large que « les projets WinForms » : une simple bibliothèque de classes qui ne
   mentionne jamais `System.Windows.Forms` est quand même réécrite si elle a un helper d'image ou de
   police, et ne peut pas compiler sans la référence. Les projets qui n'utilisent que les primitives
   survivantes sont laissés complètement tranquilles.
2. **Fichiers source** — réécritures d'espaces de noms via une table du préfixe le plus long d'abord,
   imports en double fusionnés, alias `SystemColors`/`ColorTranslator` émis là où nécessaire, et pour
   VB : le constructeur implicite réinjecté, un accesseur `My.Resources` généré, et les usages restants
   de `My.*` signalés par un avertissement.
3. **Fichiers resx** — analysés à la recherche de références d'images/de types qui doivent survivre à
   l'échange.
4. **Rapport** — un résumé Markdown (par défaut `migration-report.md`).

### Lire le rapport
{:#module-5-report}

Trois sections comptent :

- **Compteurs analysés vs modifiés** — l'étendue du diff, d'un coup d'œil.
- **Liste des changements par fichier** — tout ce qui a réellement été touché.
- **Revue manuelle** — chaque avertissement regroupé par cause : espaces de noms non pris en charge,
  types GDI+ non qualifiés sous un simple import `System.Drawing`, usage de `My.*`, et tout projet
  ignoré d'emblée. L'omission la plus fréquente est un **`.csproj`/`.vbproj` hérité non SDK**, que vous
  devez d'abord convertir au style SDK — un prérequis de format de projet, pas quelque chose que le
  migrateur a raté.

### Migration incrémentale avec `--dual-build` (C# uniquement)
{:#module-5-dualbuild}

Par défaut, l'outil convertit un projet d'emblée. `--dual-build` permet à la place à un projet C# de
compiler contre **l'une ou l'autre** pile, commutée par une seule propriété MSBuild — ainsi vos
développeurs Windows peuvent continuer à compiler contre le vrai WinForms jusqu'à ce qu'ils soient
satisfaits. Les fichiers projet sont par ailleurs laissés intacts, et seul l'import en tête de fichier
devient conditionnel :

```csharp
#if MAJORSILENCE_FORMS
using Majorsilence.Forms;
#else
using System.Windows.Forms;
#endif
```

Basculez la compilation avec un `Directory.Build.props` à la racine du dépôt :

```xml
<Project>
  <PropertyGroup>
    <MAJORSILENCE_FORMS>true</MAJORSILENCE_FORMS>
  </PropertyGroup>
</Project>
```

Deux mises en garde. C'est **délibérément étroit** : toute référence *pleinement qualifiée* dans le corps
d'un fichier (`System.Windows.Forms.MessageBox.Show(...)`) est toujours réécrite inconditionnellement, et
ne compile qu'une fois le symbole défini.

Et **il n'y a pas d'équivalent VB**, c'est pourquoi cette section n'a pas d'exemple VB. `MyType=Empty`
désactive tout le framework d'application « My » de VB — constructeur implicite, `My.*`, tout — et aucun
symbole de préprocesseur ne peut basculer cela. Un projet VB auquel on passe `--dual-build` est converti
de la façon définitive normale à la place, avec un avertissement expliquant pourquoi. **Pour les équipes
VB, planifiez une bascule plutôt qu'une période de double compilation**, et gardez la branche
d'avant-migration vivante jusqu'à ce que la branche convertie soit digne de confiance.

### La liste de corrections manuelles
{:#module-5-checklist}

Le réécriveur ne peut pas voir ces points. Traitez-les explicitement une fois le diff en place — ils font
la différence entre « ça a compilé » et « ça se comporte correctement ».

| # | Changement | Quoi faire |
|---|---|---|
| 1 | **`SplitContainer.Orientation` a changé de sens** — c'est maintenant la direction de la *barre*, comme en WinForms, pas celle de la disposition. `Vertical` (défaut) = panneaux côte à côte. | Si vous ne l'avez jamais défini, rien ne change. **Si vous l'avez défini, inversez-le.** Rien ne vous avertit : les deux valeurs compilent avant et après, et le migrateur ne peut pas distinguer un `SplitContainer.Orientation` de n'importe quel autre `Orientation` dans une passe textuelle. Cherchez-le avec grep. Idem pour `Splitter`. |
| 2 | **Les types de délégués d'événements correspondent maintenant à WinForms.** `KeyDown`/`KeyUp` → `KeyEventHandler` ; la famille `Mouse*` → `MouseEventHandler` ; `Form.FormClosing` → `FormClosingEventHandler` ; `PrintDocument.PrintPage` → `PrintPageEventHandler` ; `Control.MouseEnter` et le `Click` des éléments de menu/barre d'outils → simple `EventHandler`. | Les lambdas, les gestionnaires `AddressOf` et les clauses `Handles` VB continuent de fonctionner. Les wrappers **explicitement construits** du style `new KeyEventHandler<…>` en C# (`new EventHandler<KeyEventArgs>(…)`) ne se convertissent plus — retirez le wrapper ou nommez le délégué WinForms. |
| 3 | **`Click` et `MouseEnter` ne portent plus de coordonnées de souris** — parce qu'en WinForms ils ne l'ont jamais fait. | Un gestionnaire qui lit `e.X`/`e.Button` sur `Click` passe à `MouseClick`. Sur un élément de menu (pas de variante typée souris en WinForms non plus), prenez la position depuis le contrôle propriétaire. En C#, redéfinir l'ancien `OnMouseEnter(MouseEventArgs)` échoue avec CS0115 ; en VB, l'`Overrides` équivalent ne compile pas contre la nouvelle signature — les deux sont bruyants, ce que vous voulez. |
| 4 | **`TreeViewDrawMode.OwnerDrawContent` a été renommé** en `OwnerDrawText` de WinForms, et `OwnerDrawAll` existe maintenant. | Rien ne casse — l'ancien nom est un alias `[Obsolete]` de même valeur — mais il sera retiré. Renommez dès maintenant. `OwnerDrawText` lève `DrawNode` après la peinture du fond/du focus ; `OwnerDrawAll` le lève avant que quoi que ce soit ne soit peint. |
| 5 | **Deux membres de `DataGridViewDataErrorContexts` ont été retirés** (`RowDirtyStateNeeded`, `CleanupExceptionHandling`) — aucun des deux n'est un membre WinForms. | Remplacez-les par les vrais membres maintenant présents à ces valeurs : `RowDeletion`, `ClipboardContent`. |
| 6 | **Designers de ressources fortement typés.** Un `Resources.Designer.cs`/`.vb` généré convertit `ResourceManager.GetObject(...)` en un type de dessin ; un vrai `System.Resources.ResourceManager` renvoie ce que le `.resources` compilé nomme, donc la conversion lève `InvalidCastException` à l'exécution à la première lecture de ressource, après avoir compilé proprement. | Le migrateur gère cela pour vous, conditionné au `GeneratedCodeAttribute` du générateur lui-même : dans ces fichiers seulement, `ResourceManager` devient `Majorsilence.Forms.ComponentResourceManager`, qui lit le même `.resources` mais normalise les entrées graphiques. Les recherches de chaînes écrites à la main gardent le type de la BCL. **Vérifiez tôt vos formulaires riches en ressources.** |
| 7 | **`My.*` de VB est partiellement implémenté, selon les preuves plutôt que selon l'API.** Un audit de faisabilité d'une grande base de code VB réelle a trouvé du code écrit à la main touchant seulement trois éléments, donc exactement ces trois-là sont réels : `My.Application.Info.*` (`Title`, `Version` comme vraie `Version`, `Copyright`, `CompanyName`, …), `My.Resources.*` (un module accesseur généré) et `My.Computer.Name`. | Tout le reste déclenche encore un avertissement au lieu d'être réécrit en silence : `My.Forms`, `My.Settings`, `My.User`, `My.Application.Log`/`Startup`/`Shutdown`/`UnhandledException`, les écrans de démarrage, `My.Computer.Registry`/`Clipboard`/`Info` — l'audit n'a trouvé aucun usage écrit à la main d'aucun d'eux en dehors du code standard généré dans `Settings.Designer.vb`, et plusieurs n'ont pas d'équivalent portable. Voir les motifs de portage ci-dessous, et la section « Still not implemented, and why » de MIGRATION.md. Notez aussi : les entrées resx stockées comme `ResXFileRef` (fichier lié plutôt que données en ligne) compilent mais se résolvent en `null` à l'exécution. |
| 8 | **Les sous-espaces de noms Telerik sans cible de compatibilité** — `Telerik.WinControls.Themes`, `.Design`, `.Primitives`, `.Layouts` — sont avertis et laissés tels quels. | Décidez par usage : abandonner le thème, ou réimplémenter. Aussi : l'**interface de grille calendrier** mois/semaine/jour de `RadScheduler` est délibérément hors périmètre (la couche de données, la navigation et la vue agenda sont réelles), donc le code utilisant la grille doit être réécrit contre la vue agenda. |

**Porter la surface `My.*` de VB.** Les trois éléments implémentés ne demandent aucun travail :

```vb
' Ceux-ci continuent de fonctionner après la migration :
Dim title = My.Application.Info.Title
Dim ver As Version = My.Application.Info.Version      ' une vraie Version, pas une String
logo.Image = My.Resources.CompanyLogo                 ' module accesseur généré
Dim machine = My.Computer.Name
```

`My.Forms` est celui que la plupart des bases de code rencontrent. Remplacez le singleton implicite par
une instance explicite :

```vb
' Avant — My.Forms vous donnait un singleton créé paresseusement par type de formulaire :
My.Forms.CustomerForm.Show()

' Après — conservez l'instance vous-même (ou résolvez-la depuis votre conteneur DI) :
Private customerForm As CustomerForm

Private Sub ShowCustomers()
    If customerForm Is Nothing OrElse customerForm.IsDisposed Then
        customerForm = New CustomerForm()
    End If
    customerForm.Show()
End Sub
```

Et `My.Settings` devient la configuration que vous utilisez déjà ailleurs en .NET —
`Microsoft.Extensions.Configuration`, un fichier JSON, ou votre propre classe de paramètres :

```vb
' Avant :  Dim url = My.Settings.ApiBaseUrl
' Après :
Dim url = AppSettings.Current.ApiBaseUrl
```

### Quand vous ne pouvez pas du tout réécrire les imports
{:#module-5-compat}

Une situation que le migrateur ne peut pas servir : une **bibliothèque de contrôles distribuée dont
l'API publique est typée sur `System.Windows.Forms`** — ses consommateurs lui passent de vrais types
WinForms, donc réécrire ses `using` les casse. Pour ce cas, il existe un générateur de source de
démonstration de faisabilité,
[`Majorsilence.Forms.WinFormsShims.Compat`]({{ site.github_url }}/tree/main/src/Majorsilence.Forms.WinFormsShims.Compat),
qui émet des espaces de noms `System.Windows.Forms` et `System.Drawing` *adossés à* Majorsilence.Forms,
de sorte que du code source WinForms **non modifié** — fichiers Designer compris — compile contre le
framework sans aucun vrai assembly WinForms impliqué. L'exemple
[`WinFormsCompatDemo`]({{ site.github_url }}/tree/main/samples/WinFormsCompatDemo) le montre en
fonctionnement et son `RESULTS.md` consigne ce qui a marché et ce qui n'a pas marché. Considérez-le
comme une expérience à évaluer, pas comme un plan sur lequel compter ; le migrateur est le chemin livré.

**Où vivent les changements cassants.** Chaque élément de la liste ci-dessus provient des sections
« Breaking change » et « Renamed to match WinForms » de
[`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md), qui est l'endroit où un nouveau
changement apparaîtra en premier. Lisez ces sections à chaque mise à niveau, pas seulement à la
première migration — cette habitude est le sujet du [module 10](#module-10-versioning).

**Exercice 5.** Lancez le migrateur sur une vraie application interne — idéalement une dont personne ne
dépend ce trimestre — d'abord avec `--dry-run --diff`. Puis lancez-le pour de vrai sur une branche,
faites-la compiler, et déroulez la liste ci-dessus point par point. Limitez-vous à une journée ;
l'objectif est une estimation calibrée pour le reste de votre portefeuille, pas un portage terminé.

---

## Module 6 — Choisir vos cibles
{:#module-6}

**Objectif :** vous savez choisir le bon paquet backend pour chaque cible, et vous savez ce qui est
réellement indisponible sur chacune au lieu de le découvrir trop tard.

Votre ensemble de cibles est un choix de paquet :

| Référencez ceci | Pour cibler | Remarques |
|---|---|---|
| `Majorsilence.Forms.Avalonia` | **Par défaut.** Bureau Windows/macOS/Linux — plus Browser/WASM (toujours compilé), Android et iOS (opt-in, nécessitent des workloads) via les paquets de plateforme d'Avalonia | Résolu automatiquement lorsqu'il est référencé. Le backend multiplateforme dont l'hôte de fenêtre *est* une vraie fenêtre native : il fournit donc un vrai handle de plateforme et donne à une application hôte une sémantique modale au niveau de l'OS. WebView via WebView2/WKWebView/WebKitGTK |
| `Majorsilence.Forms.Uno` | Bureau plus iOS/Android/WebAssembly via la pile Uno | Présente via `SKXamlCanvas` ; nécessite une tête d'application Uno. Pas de notion de propriétaire (owner) — utilisez `Form.ShowDialog(parent)` pour la modalité |
| `Majorsilence.Forms.Gtk4` | Linux d'abord — une vraie `Gtk.Window` par formulaire ; aussi Windows/macOS avec le runtime GTK 4 installé | Sélectionné explicitement. Les deux sens d'intégration, `NativeControlHost` **sans problème d'airspace**, `WebBrowser` via WebKitGTK 6.0. Limites connues : pas de contrôle de la position à l'écran (GTK 4 l'a supprimé, donc `Location` n'est qu'une indication), `SetIcon(byte[])` est un no-op, les sélecteurs de fichiers se rabattent sur les boîtes de dialogue du framework, facteur d'échelle entier uniquement |
| `Majorsilence.Forms.Terminal` | Une console — le formulaire remplit le terminal sans barre de titre, comme sur un téléphone | Graphiques Kitty ou Sixel à la résolution réelle en pixels là où le terminal les prend en charge, sinon des glyphes de blocs Unicode ; souris et clavier ; Ctrl+C quitte toujours. Vérifié sous xterm et WezTerm. Pas de sélecteurs natifs, ni `NativeControlHost`, ni webview |
| `Majorsilence.Forms.WinForms` | **Windows uniquement** — de vraies fenêtres `System.Windows.Forms` sur la pompe de messages Win32 | Un backend de *migration* ([module 7](#module-7-c)) : intégrez les contrôles Majorsilence dans une application WinForms un à la fois. Cible aussi `net48`. Vrai `HWND`. Pas de gestes, pas de webview |
| `Majorsilence.Forms.Wpf` | **Windows uniquement** — une vraie `Window` WPF sur la boucle du `Dispatcher` | Même forme et même but que le backend WinForms : `ToWpfElement()`, `ToWpfWindow()`. `net48`, `net8.0-windows`, `net10.0-windows` |
| `Majorsilence.Forms.Headless` | Tests, CI, serveurs, comparaison de pixels | Aucun affichage nécessaire. C'est votre stratégie de test ([module 8](#module-8)). Horloge d'animation manuelle |

Avalonia est le seul backend qui s'installe de lui-même. Les autres tiennent en une ligne, placée avant
la construction du premier formulaire (la contrainte d'ordre vue au [module 2](#module-2-code)) :

**C#**

```csharp
// GTK 4 — dispose d'un helper
Majorsilence.Forms.Gtk4.Gtk4Application.Use ();

// Terminal — idem
Majorsilence.Forms.Terminal.TerminalApplication.Use ();

// WinForms, WPF, Headless — affectez le backend directement
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.WinForms.WinFormsPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Headless.HeadlessPlatformBackend ();

Majorsilence.Forms.Application.Run (new MainForm ());   // après la ligne que vous avez choisie
```

**VB.NET**

```vb
' GTK 4 — dispose d'un helper
Majorsilence.Forms.Gtk4.Gtk4Application.Use()

' Terminal — idem
Majorsilence.Forms.Terminal.TerminalApplication.Use()

' WinForms, WPF, Headless — affectez le backend directement
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.WinForms.WinFormsPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Wpf.WpfPlatformBackend()
Majorsilence.Forms.Backends.Platform.Backend = New Majorsilence.Forms.Headless.HeadlessPlatformBackend()

Majorsilence.Forms.Application.Run(New MainForm())      ' après la ligne que vous avez choisie
```

(N'en choisissez qu'une, bien sûr — le bloc montre toutes les variantes de la ligne.) Le backend GTK 4
a aussi besoin des bibliothèques natives sur la machine : `libgtk-4-1` sous Debian/Ubuntu, `gtk4` sous
Fedora/Arch, `brew install gtk4` sous macOS, plus WebKitGTK 6.0 si vous utilisez `WebBrowser`.

Le bureau sur Avalonia est la voie mature. Tout ce qui suit concerne les cibles plus récentes, et l'état
honnête de chacune.

### Plateformes à vue unique : navigateur, Android, iOS
{:#module-6-singleview}

Aucune de ces trois plateformes n'a de gestionnaire de fenêtres au niveau de l'OS — chacune offre
exactement une vue intégrable par application/onglet/écran. Elles partagent un hôte où **chaque**
fenêtre est un canevas : la première fenêtre non-popup remplit la zone d'affichage ; tout le reste —
listes déroulantes de ComboBox, menus, formulaires de premier niveau supplémentaires — en est un enfant
positionné de façon absolue.

Le démarrage est piloté par l'hôte, donc chaque plateforme a son propre point d'entrée qui prend une
**fabrique** (le formulaire ne doit pas exister avant que le backend soit initialisé), et aucun d'eux ne
bloque :

**C#**

```csharp
// Navigateur (WASM) — Program.cs de votre tête navigateur
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());

// Android — depuis le OnCreate de votre Activity
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());

// iOS — depuis FinishedLaunching
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());
```

**VB.NET**

```vb
' Navigateur (WASM). VB n'a pas de point d'entrée async, et RunBrowserAsync ne bloque pas —
' la boucle d'événements de l'onglet pilote l'interface — donc lancez-le et retournez.
Module Program
    Sub Main()
        Dim starting = Majorsilence.Forms.Application.RunBrowserAsync(Function() New MainForm())
    End Sub
End Module

' Android — depuis le OnCreate de votre Activity
Majorsilence.Forms.Application.RunAndroid(Function() New MainForm())

' iOS — depuis FinishedLaunching
Majorsilence.Forms.Application.RunIOS(Function() New MainForm())
```

Notez la forme de l'argument : une **fabrique** (`Function() New MainForm()`), pas une instance. Passer
`New MainForm()` directement construirait le formulaire avant que le backend existe.

**Ce qui ne fonctionne pas là-bas** — inhérent à l'absence de gestionnaire de fenêtres, pas un travail en
attente :

- **Pas de chrome de fenêtre.** `Title`, `Topmost`, `SetSystemDecorations`, `SetIcon`, taille min/max,
  `CanResize`, `ShowInTaskbar` et `WindowState` sont des no-ops ; `WindowState` renvoie toujours `Normal`.
- **Les boîtes de dialogue ne sont pas modales au niveau de l'OS**, car il n'existe pas de notion de
  fenêtre modale — une boîte de dialogue est un enfant de la vue principale, avec la sémantique de parent
  désactivé et tout le reste. Et **les appels bloquants ne fonctionnent pas du tout** : voir la section
  suivante.
- **Pas de WebView**, donc les contrôles de compatibilité qui en ont besoin (`RadPdfViewer`,
  `RadRichTextEditor`) se rabattent sur leur chemin visionneuse simple/`RichTextBox`.
- **La fermeture des popups par clic extérieur via la désactivation de fenêtre ne se déclenche pas.**
  Cliquer ailleurs *à l'intérieur* de l'application ferme toujours les popups ; seule la perte du focus au
  profit de quelque chose d'entièrement extérieur à l'application n'est pas gérée.

### La règle des boîtes de dialogue asynchrones
{:#module-6-async}

C'est la seule règle du module qui change la façon dont vous *écrivez* le code, elle a donc droit à son
propre titre. Dans le navigateur, .NET s'exécute sur l'unique thread JavaScript de la page, et un appel
qui ne retourne pas arrête les entrées, les minuteries et le rendu qui lui auraient permis de retourner.
Sous Android et iOS, le dispatcher d'Avalonia ne peut pas pousser de trame imbriquée. Donc, sur ces
trois lignes, le backend Avalonia signale `CanRunModalLoop = false`, et chaque appel modal bloquant —
`Form.ShowDialog`, `MessageBox.Show`, le `ShowDialog` des sélecteurs de fichiers, `TaskDialog.ShowDialog`,
`VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show` — lève une `PlatformNotSupportedException`
**qui nomme son jumeau asynchrone, avant que quoi que ce soit ne soit affiché**. (Mesuré sur un émulateur
Android 15 et un simulateur iPhone 17 Pro ; consigné dans `docs/backends.md`.)

Les formes asynchrones fonctionnent sur tous les backends, bureau compris, donc une bibliothèque
d'interface partagée les écrit une seule fois :

**C#**

```csharp
// Avant — bureau uniquement
private void OkButton_Click (object? sender, EventArgs e)
{
    if (string.IsNullOrWhiteSpace (nameBox.Text)) {
        MessageBox.Show ("Please enter a name.", "Greeter");
        return;
    }
    using var confirm = new ConfirmForm ();
    if (confirm.ShowDialog (this) == DialogResult.OK)
        Save ();
}

// Après — fonctionne partout. Un gestionnaire async void est l'idiome ; le résultat reste un DialogResult.
private async void OkButton_Click (object? sender, EventArgs e)
{
    if (string.IsNullOrWhiteSpace (nameBox.Text)) {
        await MessageBox.ShowAsync ("Please enter a name.", "Greeter");
        return;
    }
    using var confirm = new ConfirmForm ();
    if (await confirm.ShowDialogAsync (this) == DialogResult.OK)
        Save ();
}
```

**VB.NET**

```vb
' Avant — bureau uniquement
Private Sub OkButton_Click(sender As Object, e As EventArgs)
    If String.IsNullOrWhiteSpace(nameBox.Text) Then
        MessageBox.Show("Please enter a name.", "Greeter")
        Return
    End If
    Using confirm As New ConfirmForm()
        If confirm.ShowDialog(Me) = DialogResult.OK Then Save()
    End Using
End Sub

' Après — fonctionne partout. Async Sub ... Await est l'idiome VB pour un gestionnaire d'événements.
Private Async Sub OkButton_Click(sender As Object, e As EventArgs)
    If String.IsNullOrWhiteSpace(nameBox.Text) Then
        Await MessageBox.ShowAsync("Please enter a name.", "Greeter")
        Return
    End If
    Using confirm As New ConfirmForm()
        If Await confirm.ShowDialogAsync(Me) = DialogResult.OK Then Save()
    End Using
End Sub
```

La même règle couvre tout ce qui bloque par ailleurs le thread d'interface — `.Result`, `.Wait()`,
`GetAwaiter().GetResult()` et `Thread.Sleep` — donc attendez la tâche avec `await` et utilisez
`await Task.Delay (n)` à la place.

**Vous n'avez pas à les chercher à la main.** Le paquet cœur `Majorsilence.Forms` embarque un analyseur
Roslyn — `MFB001` (appel modal bloquant, nommant son jumeau awaitable), `MFB002` (attente synchrone sur
une tâche) et `MFB003` (`Thread.Sleep`) — avec des correctifs de code qui réécrivent un gestionnaire
sous sa forme awaitée lorsque cela préserve la forme du programme (dans une méthode `async`, ou un
gestionnaire d'événements `void`, qu'il marque `async`). Il est silencieux dans du code bureau uniquement
et s'active pour une cible `net*-browser`. Pour couvrir une **bibliothèque d'interface partagée**
référencée par une tête navigateur, activez-le à côté de cette bibliothèque :

```ini
# .editorconfig (ou un .globalconfig) à côté du projet d'interface partagé
[*.cs]
majorsilence_forms.browser_target = true
```

Faites cette activation dès le premier jour de tout projet qui a une tête navigateur ou téléphone dans sa
feuille de route ; c'est bien moins coûteux que de convertir les gestionnaires plus tard. Une limite
honnête : l'analyseur ne couvre aujourd'hui que le navigateur, donc un appel bloquant atteint uniquement
depuis du code Android ou iOS n'est pas signalé à la compilation — il échoue à l'exécution avec le message
ci-dessus. (L'analyseur et ses diagnostics sont des règles Roslyn C# uniquement ; un projet VB obtient
l'exception à l'exécution mais pas l'avertissement à la compilation.)

### Ce qui fonctionne bel et bien sur les lignes téléphone
{:#module-6-mobile}

Les lignes Avalonia Android et iOS ont gagné ce dont une application téléphone ne peut se passer, le tout
automatique du point de vue du formulaire :

- **Le clavier à l'écran** apparaît quand une `TextBox` prend le focus et disparaît à la perte du focus ;
  le champ est remonté au-dessus du clavier à son ouverture. `TextBoxBase.InputKind` (`Number`, `Email`,
  `Url`, `Phone`) choisit la disposition du clavier — définissez-le avant que la zone prenne le focus, car
  il est lu à ce moment-là. Le bureau l'ignore.
- **Les marges de zone sûre** (barre d'état, encoche, indicateur d'accueil) sont appliquées à la
  disposition cliente du formulaire via `Form.SafeAreaPadding`, donc les contrôles ancrés et dockés
  restent dégagés sans code.
- **Le bouton Retour d'Android** déclenche `WindowBase.BackRequested` (un événement annulable — un popup ou
  une feuille ouverte le reçoit en premier). La `MainActivity` générée par le modèle le transmet déjà.
- **`Form.SizeClass`** (`Compact` sous 600 px logiques, `Medium`, `Expanded` à partir de 840) et
  `SizeClassChanged` permettent à un même formulaire de basculer entre une disposition téléphone et une
  disposition tablette.
- `Application.Suspended`/`Resumed`, retour haptique, maintien de l'écran allumé, audio in-process.

Et quatre contrôles conçus pour les écrans en forme de téléphone, tous dans le paquet cœur et utilisables
aussi sur le bureau : **`StackPanel`** (une extension Majorsilence — étire chaque enfant à la largeur de la
colonne, et plafonne la colonne à une largeur lisible sur une fenêtre large), **`Card`** (un `Panel` arrondi
et bordé, coloré d'après le thème), **`RichListBox`** (une `ListBox` dont les lignes sont des éléments
multilignes à modèle) et **`NavigationHost`** (une pile de pages avec barre de titre et bouton Retour qui
respecte `BackRequested`). Un écran de paramètres, dans la forme que `docs/mobile-layout.md` recommande
(vérifié par rapport à ce document, non exécuté pour ce guide) :

**C#**

```csharp
var column = new StackPanel {
    Dock = DockStyle.Fill, AutoScroll = true,
    MaximumContentWidth = 560, Spacing = 8, Padding = new Padding (8)
};
column.Controls.Add (new Label { Text = "Server address", AutoSize = true });      // s'adapte à la colonne
column.Controls.Add (new TextBox { Name = "serverBox", Height = 48, InputKind = TextInputKind.Url });

var card = new Card { Height = 120 };                                              // arrondi, thémé
card.Controls.Add (new Label { Text = "Reminders", Dock = DockStyle.Top });
column.Controls.Add (card);

var nav = new NavigationHost { Dock = DockStyle.Fill };                            // pile de pages + bouton Retour
Controls.Add (nav);
await nav.PushAsync (column);                                                      // depuis un gestionnaire async
```

**VB.NET**

```vb
Dim column As New StackPanel With {
    .Dock = DockStyle.Fill, .AutoScroll = True,
    .MaximumContentWidth = 560, .Spacing = 8, .Padding = New Padding(8)
}
column.Controls.Add(New Label With {.Text = "Server address", .AutoSize = True})   ' s'adapte à la colonne
column.Controls.Add(New TextBox With {.Name = "serverBox", .Height = 48, .InputKind = TextInputKind.Url})

Dim card As New Card With {.Height = 120}                                           ' arrondi, thémé
card.Controls.Add(New Label With {.Text = "Reminders", .Dock = DockStyle.Top})
column.Controls.Add(card)

Dim nav As New NavigationHost With {.Dock = DockStyle.Fill}                         ' pile de pages + bouton Retour
Controls.Add(nav)
Await nav.PushAsync(column)                                                         ' depuis un gestionnaire Async
```

(`TextInputKind` se trouve dans `Majorsilence.Forms.Backends`.) Tout le reste de la recette est le WinForms
que vous connaissez — les étiquettes `AutoSize` passent à la ligne, `FlowLayoutPanel`/`TableLayoutPanel`
se placent dans une carte.

**La maturité diffère fortement, et cela relève de votre planification plutôt que d'une note de bas de
page.** Les trois lignes compilent en CI. Le **navigateur** fait tourner la galerie complète et est
jeune. **Android** a eu une première passe sur appareil réel : la galerie démarre, les touchers atteignent
le bon contrôle, la mise à l'échelle du rendu est correcte, et le défilement tactile et le balayage
fonctionnent sur le matériel — mais les comportements de clavier, de zone sûre et de rotation décrits
ci-dessus sont testés unitairement sur Headless, pas encore exercés sur un appareil. **iOS** compile, et
la CI lance la vraie tête dans un simulateur comme test de fumée, mais personne ne l'a encore fait tourner
de façon interactive sur un simulateur ou un appareil. Si le mobile est dans votre feuille de route,
traitez-le comme un spike avec un risque réel, pas comme une case à cocher — un spike bien plus petit
qu'il y a quelques mois, mais un spike.

Les workloads dont vous aurez besoin, une fois chacun :

```
dotnet workload install wasm-tools   # navigateur — nécessaire pour publier, pas pour compiler
dotnet workload install android
dotnet workload install ios          # macOS uniquement ; il n'existe pas de chemin Linux/Windows
```

Pour le navigateur, notez que `dotnet run` ne sert pas un projet WebAssembly : faites un `dotnet publish`
et servez la sortie `wwwroot` avec n'importe quel serveur de fichiers statiques.

Un écart qui mordra immédiatement un portage navigateur : **les fichiers chargés par chemin relatif n'y
existent pas.** Il n'y a pas de vrai système de fichiers, donc un chargement d'image qui fonctionne sur le
bureau produit silencieusement des icônes vides (le même comportement d'espace réservé 1×1 vu au
[module 0](#module-0)). Livrez plutôt les images en ressources embarquées et lisez-les via l'assembly :

**C#**

```csharp
using Majorsilence.Forms.Drawing;

public static Bitmap LoadEmbedded (string name)
{
    var assembly = typeof (MainForm).Assembly;
    using var stream = assembly.GetManifestResourceStream ($"MyApp.Images.{name}")
        ?? throw new InvalidOperationException ($"Missing embedded resource: {name}");

    return new Bitmap (stream);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Drawing

Public Shared Function LoadEmbedded(name As String) As Bitmap
    Dim assembly = GetType(MainForm).Assembly
    Using stream = assembly.GetManifestResourceStream($"MyApp.Images.{name}")
        If stream Is Nothing Then
            Throw New InvalidOperationException($"Missing embedded resource: {name}")
        End If
        Return New Bitmap(stream)
    End Using
End Function
```

**L'accessibilité dans le navigateur est gratuite — si vous avez nommé vos contrôles.** Un canevas est
opaque pour un lecteur d'écran, pour la recherche dans la page du navigateur et pour tout outil de test
basé sur le DOM. Donc, sur la ligne navigateur, le backend Avalonia maintient un **miroir DOM** des
formulaires ouverts à côté du canevas : un élément transparent et traversant par contrôle, portant son
rôle ARIA, son nom, son état et ses limites, construit à partir du même arbre d'automatisation que vos
tests lisent ([module 8](#module-8-tree)) et resynchronisé au plus toutes les 100 ms après un rendu. Tout
ce qu'un test peut trouver, un lecteur d'écran peut le trouver — une raison de plus pour que la règle
« chaque contrôle interactif reçoit un `Name` » du module 8 figure dans votre liste de revue de code.

### Intégration dans une application Avalonia, Uno, WinForms, WPF ou GTK 4 existante
{:#module-6-embedding}

Si vous livrez déjà une application sur l'un de ces cinq toolkits, vous pouvez adopter Majorsilence.Forms
de façon additive — en utilisant ses contrôles et fenêtres comme s'il s'agissait d'objets natifs, sans
changer le flux normal `Form.Show()`. Le motif est identique partout (un `MajorsilenceFormsPresenter` plus
une paire de méthodes d'extension) ; seul le type hôte change. Avalonia et Uno sont montrés ici, la paire
Windows au [module 7](#module-7-c), et GTK 4 est `ToGtkWidget()` / `ToGtkWindow()` :

**C#**

```csharp
// Un contrôle Majorsilence, hébergé comme un contrôle natif
Avalonia.Controls.Control          hostControl = myMfControl.ToAvaloniaControl ();
Microsoft.UI.Xaml.FrameworkElement unoControl  = myMfControl.ToUnoControl ();

// La fenêtre backend d'un Form Majorsilence, rendue à l'hôte
Avalonia.Controls.Window window = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window unoWin = myForm.ToUnoWindow ();

window.Show ();                    // à partir d'ici, c'est l'hôte qui gère l'affichage
```

**VB.NET**

```vb
' Un contrôle Majorsilence, hébergé comme un contrôle natif
Dim hostControl As Avalonia.Controls.Control = myMfControl.ToAvaloniaControl()
Dim unoControl As Microsoft.UI.Xaml.FrameworkElement = myMfControl.ToUnoControl()

' La fenêtre backend d'un Form Majorsilence, rendue à l'hôte
Dim window As Avalonia.Controls.Window = myForm.ToAvaloniaWindow()
Dim unoWin As Microsoft.UI.Xaml.Window = myForm.ToUnoWindow()

window.Show()                      ' à partir d'ici, c'est l'hôte qui gère l'affichage
```

**Les relations propriétaire/modal diffèrent selon le backend :** `ToAvaloniaWindow()`, `ToWinFormsForm()`
et `ToGtkWindow()` donnent chacun une véritable relation modale au niveau de l'OS ; Uno n'a pas de notion
de propriétaire dans ce backend, donc `ToUnoWindow()` renvoie une fenêtre de premier niveau indépendante.
Sous Uno, utilisez `Form.ShowDialog(parent)` — la boucle modale propre au framework, qui ne dépend pas de
la propriété native des fenêtres.

### Si vous dessinez votre propre barre de titre
{:#module-6-chrome}

Cela vaut une diapositive pour quiconque construit un chrome personnalisé. Sur le backend Avalonia, le
déplacement et le redimensionnement passent par des appels interactifs de début de glissement. Sous Uno,
c'est impossible (WinUI n'a pas de début de glissement programmatique), donc le déplacement/
redimensionnement est déclaratif : le formulaire publie sa bande de barre de titre comme région de
légende (caption), que l'hôte transmet à WinUI. C'est une API Windows bureau, donc le glissement de la
barre de titre par l'OS fonctionne sur la tête Win32 ; macOS utilise les décorations natives et l'OS gère
le déplacement/redimensionnement ; sur la **tête X11, le glissement de la barre de titre est
indisponible** — utilisez-y les décorations système si vous avez besoin du déplacement de fenêtre par
l'OS.

**Exercice 6.** Prenez le `GreetForm` du [module 2](#module-2) et exécutez-le sur deux backends en
changeant la référence de paquet et, pour un backend autre qu'Avalonia, l'unique ligne de sélection (sous
Linux, GTK 4 ; partout, Terminal — c'est le moyen le plus rapide de *ressentir* la couture de l'hôte).
Publiez-le ensuite en WebAssembly et ouvrez-le dans un navigateur : le `MessageBox.Show` de
`OkButton_Click` y lève une exception, et convertir ce gestionnaire en `ShowAsync` est toute la règle des
boîtes de dialogue asynchrones en une seule modification. Notez chaque différence de comportement que
vous observez et confrontez-la aux listes ci-dessus — tout ce qui n'y figure pas mérite d'être signalé.

---


## Module 7 — Adoption incrémentale sous Windows
{:#module-7}

**Objectif :** vous savez faire tourner Majorsilence.Forms et le vrai WinForms dans un même processus,
dans les deux sens et à deux granularités — formulaires entiers ou contrôles isolés — et vous connaissez
les trois règles qui gardent l'ensemble stable.

Il existe deux outils Windows uniquement pour cela, et ils opèrent à des couches différentes :

| | `Majorsilence.Forms.WindowsFormsInterop` (sens A et B) | Backend `Majorsilence.Forms.WinForms` (sens C) |
|---|---|---|
| Granularité | Formulaires et boîtes de dialogue entiers | Contrôles individuels (et formulaires) |
| Majorsilence s'exécute sur | Le backend Avalonia, partageant la pompe Win32 avec WinForms | De vraies fenêtres WinForms — Avalonia n'intervient pas |
| Idéal pour | Ouvrir des formulaires WinForms hérités depuis une application Majorsilence, et inversement | Intégrer des contrôles Majorsilence dans une interface WinForms ; une bibliothèque de contrôles qui porte d'abord ses rouages internes ; des hôtes .NET Framework 4.8 |

Ils peuvent coexister — le presenter du sens C laisse tranquille un backend déjà configuré.

`Majorsilence.Forms.WindowsFormsInterop` est un pont **Windows uniquement**. Hors Windows, l'assembly
est un espace réservé vide (pour que les builds multiplateformes restent au vert) et chaque appel lève
une `PlatformNotSupportedException`.

**Pourquoi cela fonctionne :** sous Windows, le backend Avalonia enregistre ses fenêtres auprès de la
pompe de messages de l'OS au lieu de faire tourner sa propre boucle, et `System.Windows.Forms` utilise la
même pompe. Les deux toolkits partagent donc l'`Application.Run` qui est appelé, quel qu'il soit — une
seule boucle sert les deux.

### Sens A — une application Majorsilence.Forms ouvrant un formulaire WinForms hérité
{:#module-7-a}

Pour quand l'application a migré mais que quelques boîtes de dialogue ne l'ont pas encore fait.

**C#**

```csharp
using Majorsilence.Forms.Interop;

// Non modal — retourne immédiatement
WindowsFormsInterop.Show (new LegacySettingsForm (), owner: this);

// Modal — bloque jusqu'à la fermeture de la boîte de dialogue WinForms
var result = WindowsFormsInterop.ShowDialog (new LegacyWizardForm (), owner: this);
if (result == System.Windows.Forms.DialogResult.OK) {
    // …
}

// Surcharge avec fabrique — construit le formulaire sur le thread d'interface au moment de l'affichage
WindowsFormsInterop.Show (() => new LegacySettingsForm ());
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Interop

' Non modal — retourne immédiatement
WindowsFormsInterop.Show(New LegacySettingsForm(), owner:=Me)

' Modal — bloque jusqu'à la fermeture de la boîte de dialogue WinForms
Dim result = WindowsFormsInterop.ShowDialog(New LegacyWizardForm(), owner:=Me)
If result = System.Windows.Forms.DialogResult.OK Then
    ' …
End If

' Surcharge avec fabrique — construit le formulaire sur le thread d'interface au moment de l'affichage
WindowsFormsInterop.Show(Function() New LegacySettingsForm())
```

Pour que la boîte de dialogue WinForms soit réellement possédée par le parent Majorsilence (et modale
vis-à-vis de lui), branchez le résolveur de handle **une seule fois** au démarrage — tant que ce n'est pas
fait, les formulaires WinForms sont affichés sans propriétaire :

**C#**

```csharp
WindowsFormsInterop.OwnerHandleResolver = mfForm =>
{
    var host = mfForm.Backend as Majorsilence.Forms.Backends.MajorsilenceFormsWindowHost;
    return host?.TryGetPlatformHandle ()?.Handle ?? IntPtr.Zero;
};
```

**VB.NET**

```vb
WindowsFormsInterop.OwnerHandleResolver =
    Function(mfForm)
        Dim host = TryCast(mfForm.Backend,
                           Majorsilence.Forms.Backends.MajorsilenceFormsWindowHost)
        If host Is Nothing Then Return IntPtr.Zero
        Return If(host.TryGetPlatformHandle()?.Handle, IntPtr.Zero)
    End Function
```

### Sens B — une application WinForms ouvrant des écrans Majorsilence.Forms
{:#module-7-b}

C'est la façon à faible risque de valider le framework avant de s'engager sur quoi que ce soit :
construisez les *nouveaux* écrans sur Majorsilence.Forms, à l'intérieur de l'application que vous livrez
déjà.

**C#**

```csharp
[STAThread]
static void Main ()
{
    System.Windows.Forms.Application.EnableVisualStyles ();
    System.Windows.Forms.Application.SetCompatibleTextRenderingDefault (false);
    System.Windows.Forms.Application.SetHighDpiMode (HighDpiMode.PerMonitorV2);

    WindowsFormsInterop.InitializeMajorsilence ();   // une fois, avant la première fenêtre MF
    System.Windows.Forms.Application.Run (new MainForm ());
}
```

```csharp
using MF = Majorsilence.Forms;

WindowsFormsInterop.ShowMajorsilenceForm (new NewSettingsForm (), owner: this);

MF.DialogResult r = WindowsFormsInterop.ShowMajorsilenceDialog (new NewWizardForm (), owner: this);
if (r == MF.DialogResult.OK) {
    // …
}
```

**VB.NET**

```vb
Module Program
    <STAThread>
    Sub Main()
        System.Windows.Forms.Application.EnableVisualStyles()
        System.Windows.Forms.Application.SetCompatibleTextRenderingDefault(False)
        System.Windows.Forms.Application.SetHighDpiMode(HighDpiMode.PerMonitorV2)

        WindowsFormsInterop.InitializeMajorsilence()   ' une fois, avant la première fenêtre MF
        System.Windows.Forms.Application.Run(New MainForm())
    End Sub
End Module
```

```vb
Imports MF = Majorsilence.Forms

WindowsFormsInterop.ShowMajorsilenceForm(New NewSettingsForm(), owner:=Me)

Dim r As MF.DialogResult =
    WindowsFormsInterop.ShowMajorsilenceDialog(New NewWizardForm(), owner:=Me)
If r = MF.DialogResult.OK Then
    ' …
End If
```

Définissez `DialogResult` avant `Close()` dans le formulaire Majorsilence pour que cet appel renvoie
autre chose que `DialogResult.None` (qui signifie « fermé sans résultat explicite », par exemple le ✕ de
la barre de titre) :

**C#**

```csharp
okButton.Click += (sender, e) => {
    DialogResult = Majorsilence.Forms.DialogResult.OK;
    Close ();
};
```

**VB.NET**

```vb
AddHandler okButton.Click,
    Sub(sender As Object, e As EventArgs)
        DialogResult = Majorsilence.Forms.DialogResult.OK
        Close()
    End Sub
```

### Sens C — un contrôle à la fois, sur le backend WinForms (ou WPF)
{:#module-7-c}

Les sens A et B déplacent des écrans entiers. Quand l'unité que vous pouvez vous permettre de déplacer est
*un contrôle* — une grille personnalisée, un graphique, un panneau d'un formulaire chargé — référencez
plutôt `Majorsilence.Forms.WinForms`. C'est un backend de plateforme complet ([module 6](#module-6)) dont
les fenêtres sont de vrais formulaires `System.Windows.Forms` sur la pompe Win32 classique, la surface
Skia étant présentée au travers d'un contrôle adossé à GDI. Un contrôle Majorsilence déposé dans un
conteneur WinForms devient un `System.Windows.Forms.Control` ordinaire ; le backend s'installe de
lui-même à la création du premier presenter, et l'`Application.Run` existant de l'application sert tout
le reste. (Vérifié par rapport au README du paquet et à `samples/EmbeddingWinForms`, non exécuté pour ce
guide.)

**C#**

```csharp
using Majorsilence.Forms.WinForms;

// Qualifiez par l'espace de noms : ce fichier a System.Windows.Forms et Majorsilence.Forms tous deux en portée.
var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });

System.Windows.Forms.Control host = scene.ToWinFormsControl ();   // ou : new MajorsilenceFormsPresenter { Content = scene }
legacyForm.Controls.Add (host);

// Un Form Majorsilence entier, possédé par WinForms — une véritable relation modale native :
var dialog = new Majorsilence.Forms.Form { Text = "Ported dialog" };
System.Windows.Forms.Form native = dialog.ToWinFormsForm ();
native.ShowDialog (legacyForm);
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WinForms

' Qualifiez par l'espace de noms : ce fichier a System.Windows.Forms et Majorsilence.Forms tous deux en portée.
Dim scene As New Majorsilence.Forms.Panel()
scene.Controls.Add(New Majorsilence.Forms.Button With {.Text = "Ported button", .Left = 12, .Top = 12})

Dim host As System.Windows.Forms.Control = scene.ToWinFormsControl()   ' ou : New MajorsilenceFormsPresenter With {.Content = scene}
legacyForm.Controls.Add(host)

' Un Form Majorsilence entier, possédé par WinForms — une véritable relation modale native :
Dim dialog As New Majorsilence.Forms.Form With {.Text = "Ported dialog"}
Dim native As System.Windows.Forms.Form = dialog.ToWinFormsForm()
native.ShowDialog(legacyForm)
```

Trois propriétés de cette voie comptent pour la planification :

- **Elle cible `net48`.** Associée à la build `netstandard2.0` du cœur, une application **.NET Framework
  4.8** peut héberger des contrôles Majorsilence sans d'abord passer au .NET moderne. Cela réordonne bien
  des plans de migration : le portage de l'interface et la mise à niveau du runtime n'ont plus à être le
  même projet.
- **Elle fonctionne dans les deux sens.** `NativeControlHost` ([module 9](#module-9-route-a)) héberge un
  *vrai* contrôle WinForms à l'intérieur de la scène Majorsilence intégrée, et le backend renvoie un vrai
  `HWND` via `PlatformHandle`. Les popups ouverts par le contenu intégré (listes déroulantes, menus) sont
  de vraies fenêtres OS sans bordure.
- **Quand le dernier contrôle est porté, changez de paquet** pour `Majorsilence.Forms.Avalonia` et le
  même code devient multiplateforme. Rien ne change au-dessus de la couture backend.

Absents : les gestes (WinForms n'a pas d'API de gestes — le toucher arrive sous forme de souris) et une
webview (les contrôles de compatibilité dépendant de WebView se rabattent, comme sur Headless).
`Majorsilence.Forms.Wpf` est la même idée pour un shell WPF — `ToWpfElement()` et `ToWpfWindow()`,
`net48`/`net8.0-windows`/`net10.0-windows`, sélectionné avec `Platform.Backend = new WpfPlatformBackend ()`.

**Faire en sorte que les deux moitiés ressemblent à une seule application.** Ce qui trahit une
application à toolkits mixtes, ce sont deux styles visuels sur un même écran.
`Majorsilence.Forms.Theming.WinForms` applique le *même* thème CSS ([annexe D](#appendix-d)) aux vrais
contrôles `System.Windows.Forms`, dans la mesure où WinForms le permet et en signalant chaque écart par
un diagnostic plutôt qu'en le sautant silencieusement :

**C#**

```csharp
using Majorsilence.Forms.Theming.WinForms;

Theme.LoadFromCssFile ("Themes/graphite.css");                     // la moitié Majorsilence
WinFormsCssTheme.Apply (File.ReadAllText ("Themes/graphite.css")); // la moitié WinForms
WinFormsCssTheme.Track (legacyForm);                               // le style maintenant, et les contrôles ajoutés plus tard
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Theming.WinForms

Theme.LoadFromCssFile("Themes/graphite.css")                        ' la moitié Majorsilence
WinFormsCssTheme.Apply(File.ReadAllText("Themes/graphite.css"))     ' la moitié WinForms
WinFormsCssTheme.Track(legacyForm)                                  ' le style maintenant, et les contrôles ajoutés plus tard
```

(`WinFormsCssTheme.Watch (path)` réapplique le thème à chaque enregistrement ; c'est ainsi que
fonctionne l'exemple Windows uniquement `ThemeStudio.WinForms`.)

### Les trois règles
{:#module-7-rules}

1. **Un seul `Application.Run` par processus.** N'appelez jamais à la fois
   `Majorsilence.Forms.Application.Run` et `System.Windows.Forms.Application.Run`. Choisissez un hôte ;
   utilisez le pont pour l'autre sens.
2. **Thread d'interface (STA) uniquement** — exactement comme WinForms. Depuis un thread d'arrière-plan,
   revenez sur le thread d'interface :

   **C#**

   ```csharp
   await Task.Run (() => {
       var data = LoadFromDatabase ();
       Majorsilence.Forms.Application.RunOnUIThread (() => grid.DataSource = data);
   });
   ```

   **VB.NET**

   ```vb
   Await Task.Run(
       Sub()
           Dim data = LoadFromDatabase()
           Majorsilence.Forms.Application.RunOnUIThread(Sub() grid.DataSource = data)
       End Sub)
   ```

3. **Le parentage Win32 est asymétrique.** Le parentage MF → WF fonctionne grâce au résolveur de handle
   ci-dessus ; dans le sens WF → MF, la fenêtre MF est actuellement sans propriétaire au niveau de l'OS.

**Exercice 7.** Dans une copie de travail d'une application WinForms existante, ajoutez un nouvel écran
construit sur Majorsilence.Forms via le sens B, avec le handle de propriétaire branché. Puis, dans la même
application, remplacez un contrôle existant par un contrôle Majorsilence via le sens C. Ensemble, ils
constituent la démonstration qui débloque les parties prenantes, car ils ne changent rien à ce que vous
livrez déjà.

---

## Module 8 — Tester votre application
{:#module-8}

**Objectif :** votre équipe écrit des tests d'interface qui s'exécutent en CI sans affichage, avec des
localisateurs qui ne cassent pas — et sait quelle accessibilité est offerte gratuitement.

> Ce module est la vue d'ensemble. [**Automatisation et tests d'interface**]({{ '/fr/automation/' | relative_url }})
> en est la version pour praticiens : objets de page, un helper d'attente (il n'y a pas d'attentes
> implicites), piloter l'application depuis un vrai Selenium, FlaUI/WinAppDriver sous Windows, régression
> par image de référence, recettes CI pour GitHub Actions, Azure DevOps et Jenkins, et la façon dont les
> agents IA se branchent sur la même surface.

### Un arbre d'automatisation, trois consommateurs
{:#module-8-tree}

Le framework expose un **arbre d'automatisation** indépendant du backend : un instantané de votre
hiérarchie de contrôles vivante, avec identifiants, noms, rôles, valeurs, état et limites.

| Consommateur | Paquet | Vous apporte |
|---|---|---|
| Tests d'interface in-process | `Majorsilence.Forms.Automation` (dans le paquet cœur) | Piloter un formulaire depuis C#/VB sans calculs de pixels |
| Automatisation à distance | `Majorsilence.Forms.WebDriver` | Un serveur WebDriver W3C que n'importe quel client Selenium peut piloter |
| Lecteurs d'écran et loupes | `Majorsilence.Forms.WindowsUIAutomation` | Narrateur / NVDA / JAWS sous Windows |

L'arbre lit les mêmes limites logiques et le même état que les moteurs de rendu, donc il se comporte à
l'identique sur le backend headless et sur les vrais backends — **un test écrit contre Headless décrit ce
qu'un utilisateur voit sur Avalonia.**

### Rendre les contrôles trouvables — une convention d'équipe, adoptée dès le premier jour
{:#module-8-findable}

Les localisateurs s'appuient sur deux propriétés que vous définissez déjà :

- `Control.Name` → l'**AutomationId** de l'élément. Le localisateur stable. Préférez-le toujours.
- `Control.AccessibleName` (avec repli sur `Text`, puis `Name`) → le **Name** de l'élément.

**C#**

```csharp
var okButton = new Button  { Name = "okButton", Text = "OK" };
var nameBox  = new TextBox { Name = "nameBox",  AccessibleName = "Full name" };
```

**VB.NET**

```vb
Dim okButton As New Button With {.Name = "okButton", .Text = "OK"}
Dim nameBox As New TextBox With {.Name = "nameBox", .AccessibleName = "Full name"}
```

Les rôles sont déduits du type de contrôle (`button`, `textbox`, `checkbox`, `radio`, `combobox`, `list`,
`label`, `tablist`, `window`, …) sauf si vous définissez `Control.AccessibleRole`. Faites de « chaque
contrôle interactif reçoit un `Name` » une règle de revue de code — elle vous achète les localisateurs de
test *et* la prise en charge des lecteurs d'écran d'une même frappe, sous Windows via UI Automation et
dans le navigateur via le [miroir DOM ARIA](#module-6-singleview).

### Contrôles dessinés sur mesure : publiez votre propre valeur et votre propre état
{:#module-8-stateprovider}

Les contrôles intégrés savent rapporter leur valeur — une `TextBox` son texte, une `CheckBox` `"true"`.
Un contrôle que vous dessinez vous-même ([module 4](#module-4-paint)) n'a rien d'où déduire quoi que ce
soit, donc il apparaît dans l'arbre avec une valeur vide et un rôle deviné d'après le nom de son type.
`AccessibleRole` et `AccessibleName` corrigent déjà le rôle et le nom. Pour la valeur et tout état
supplémentaire, implémentez `IAutomationStateProvider` — l'arbre utilise alors ce que vous rapportez au
lieu de deviner, et chaque entrée d'état devient un attribut `state-{key}` que vous pouvez interroger
indépendamment. (D'après `docs/automation.md` ; non exécuté pour ce guide.)

**C#**

```csharp
using System.Collections.Generic;
using System.Globalization;
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;

public sealed class BeaconIndicator : Control, IAutomationStateProvider
{
    public int Level { get; set; }
    public string Status { get; set; } = "warning";

    public string? AutomationValue => Level.ToString (CultureInfo.InvariantCulture);

    public IReadOnlyDictionary<string, string> AutomationState => new Dictionary<string, string> {
        ["level"]  = Level.ToString (CultureInfo.InvariantCulture),
        ["status"] = Status,
    };

    protected override void OnPaint (PaintEventArgs e) { /* dessiner la balise */ }
}

// Dans un test — l'état est adressable en XPath :
session.Find (By.XPath ("//BeaconIndicator[@state-level='3']"));
```

**VB.NET**

```vb
Imports System.Globalization
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation

Public NotInheritable Class BeaconIndicator
    Inherits Control
    Implements IAutomationStateProvider

    Public Property Level As Integer
    Public Property Status As String = "warning"

    Public ReadOnly Property AutomationValue As String Implements IAutomationStateProvider.AutomationValue
        Get
            Return Level.ToString(CultureInfo.InvariantCulture)
        End Get
    End Property

    Public ReadOnly Property AutomationState As IReadOnlyDictionary(Of String, String) _
            Implements IAutomationStateProvider.AutomationState
        Get
            Return New Dictionary(Of String, String) From {
                {"level", Level.ToString(CultureInfo.InvariantCulture)},
                {"status", Status}
            }
        End Get
    End Property

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        ' dessiner la balise
    End Sub
End Class

' Dans un test — l'état est adressable en XPath :
session.Find(By.XPath("//BeaconIndicator[@state-level='3']"))
```

Définissez aussi `Name`, `AccessibleName` et `AccessibleRole` dessus, et l'élément porte les quatre dans
`GetPageSource()` — et, via WebDriver, `getAttribute("state-level")` lit la même chose. Limitez les clés
d'état aux lettres, chiffres, `-` et `_`. Une règle à connaître : `AutomationValue` *remplace* l'inférence
intégrée au lieu de s'y mélanger, donc un contrôle personnalisé de type case à cocher rapporte lui-même
`"true"`/`"false"`.

### Le backend Headless est votre stratégie de CI
{:#module-8-headless}

`Majorsilence.Forms.Headless` n'a besoin d'aucun affichage. Installez-le une fois pour tout l'assembly de
tests, et chaque test en bénéficie.

**C# — un initialiseur de module est le point d'accroche le plus propre**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Headless;

internal static class TestBootstrap
{
    [ModuleInitializer]
    internal static void Init () => HeadlessRenderer.Use ();
}
```

**VB.NET — VB n'a pas d'initialiseur de module, utilisez donc le point d'accroche d'assembly de votre framework de test**

```vb
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBootstrap
    ' MSTest : <AssemblyInitialize>. L'équivalent NUnit est une <SetUpFixture> avec <OneTimeSetUp> ;
    ' celui de xUnit est une fixture de collection/d'assembly. VB ne peut pas utiliser <ModuleInitializer> —
    ' le compilateur VB n'émet pas d'initialiseurs de module, donc l'attribut seul ne ferait rien.
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        HeadlessRenderer.Use()
    End Sub
End Class
```

C'est une véritable différence de langage, pas une préférence de style : si vous copiez le motif C# en VB,
vos tests s'exécuteront sans aucun backend et échoueront de façon déroutante.

Et ne soyez pas tenté d'exécuter les tests d'interface sur le backend Avalonia « parce que c'est le
vrai » : le dispatcher d'Avalonia est lié à un thread et entre en conflit avec les threads de travail d'un
exécuteur de tests. Headless existe précisément pour que votre suite n'ait besoin ni d'un affichage ni
d'un thread d'interface — la propre suite du framework tourne dessus, et `HeadlessRenderer.Use ()`
équivaut à affecter `HeadlessPlatformBackend` vous-même.

### Un test d'interface complet
{:#module-8-inprocess}

`By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` localisent les éléments ; `Find`,
`FindOrThrow` et `FindAll` interrogent chacun un **instantané frais**. Les actions (`Click`, `SendKeys`,
`PressKey`, `Clear`) passent par le même pipeline d'entrée neutre qu'utilise un vrai backend, donc elles
exercent le vrai routage, le vrai focus et la vraie disposition — pas un raccourci réservé aux tests.

**C#**

```csharp
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;
using Xunit;

public class GreetFormTests
{
    [Fact]
    public void Entering_a_name_and_pressing_OK_accepts_the_dialog ()
    {
        using var form = new GreetForm ();
        var session = new AutomationSession (form);

        session.SendKeys (session.FindOrThrow (By.Id ("nameBox")), "Ada Lovelace");
        Assert.Equal ("Ada Lovelace", session.GetText (session.FindOrThrow (By.Id ("nameBox"))));

        session.Click (session.FindOrThrow (By.Id ("okButton")));
        Assert.Equal (DialogResult.OK, form.DialogResult);
    }

    [Fact]
    public void The_form_still_renders_at_the_expected_size ()
    {
        using var form = new GreetForm ();

        // Vérification par image de référence : rendu hors écran, comparé à un PNG validé dans le dépôt.
        var png = HeadlessRenderer.CapturePng (form, 360, 140);

        Assert.NotEmpty (png);
        // File.WriteAllBytes ("greetform.expected.png", png);   // régénérer délibérément
    }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class GreetFormTests

    <TestMethod>
    Public Sub Entering_a_name_and_pressing_OK_accepts_the_dialog()
        Using form As New GreetForm()
            Dim session As New AutomationSession(form)

            session.SendKeys(session.FindOrThrow(By.Id("nameBox")), "Ada Lovelace")
            Assert.AreEqual("Ada Lovelace",
                            session.GetText(session.FindOrThrow(By.Id("nameBox"))))

            session.Click(session.FindOrThrow(By.Id("okButton")))
            Assert.AreEqual(DialogResult.OK, form.DialogResult)
        End Using
    End Sub

    <TestMethod>
    Public Sub The_form_still_renders_at_the_expected_size()
        Using form As New GreetForm()
            ' Vérification par image de référence : rendu hors écran, comparé à un PNG validé dans le dépôt.
            Dim png = HeadlessRenderer.CapturePng(form, 360, 140)
            Assert.IsTrue(png.Length > 0)
        End Using
    End Sub
End Class
```

`By.XPath` s'évalue contre le rendu XML de l'arbre, la même forme que renvoie `session.GetPageSource()` —
utile quand vous n'avez aucun identifiant stable sur lequel vous appuyer :

**C#**

```csharp
session.Find    (By.XPath ("//Button[@id='okButton']"));
session.Find    (By.XPath ("//TextBox[@name='Full name']"));
session.FindAll (By.XPath ("//Panel//Button"));
```

**VB.NET**

```vb
session.Find(By.XPath("//Button[@id='okButton']"))
session.Find(By.XPath("//TextBox[@name='Full name']"))
session.FindAll(By.XPath("//Panel//Button"))
```

**Tester en HiDPI.** `MF_HEADLESS_SCALE=2` fait rapporter au backend headless un affichage mis à
l'échelle, ce qui est la façon de tester la disposition à 2× sans moniteur mis à l'échelle. La propre
suite du framework passe à cette échelle et la CI en fait une porte, donc c'est une pratique prise en
charge plutôt qu'un recoin connu pour être cassé.

Tirez cependant la leçon de la façon dont ces échecs ont été corrigés, car c'est le même piège dans votre
code : presque tous relevaient d'**une seule confusion — unités logiques contre unités physiques.** Depuis
le 2026-10-01, tout ce que vous lisez sur un `Control` — `Bounds`, `ClientRectangle`, `ClientSize`,
`MouseEventArgs`, le canevas de peinture — est logique ([module 4](#module-4-paint)), ce qui a supprimé le
pire du piège. Ce qui est *encore* en pixels physiques : les bitmaps capturés (`HeadlessRenderer.CapturePng`
à l'échelle 2 est deux fois plus grand dans chaque direction), la famille `Scaled*` que vous avez demandée
par son nom, et les `Bounds` des événements owner-draw. Ils sont identiques à l'échelle 1, donc les
mélanger est invisible jusqu'à ce qu'un affichage mis à l'échelle se présente. Donc : **vérifiez la
géométrie proportionnellement plutôt qu'en pixels d'échelle 1**, et quand vous comparez un bitmap capturé
à un rectangle, vérifiez dans quel espace chacun se trouve. Un contrôle personnalisé qui appelle encore
`ScaleTransform (e.Scaling, …)` est aujourd'hui la façon la plus courante d'échouer à cette porte.

### Automatisation à distance avec Selenium
{:#module-8-webdriver}

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

var server = new WebDriverServer (form, port: 4444);
server.Start ();          // http://127.0.0.1:4444/  (boucle locale uniquement)
// … pilotez-le avec n'importe quel client WebDriver …
server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Dim server As New WebDriverServer(form, port:=4444)
server.Start()            ' http://127.0.0.1:4444/  (boucle locale uniquement)
' … pilotez-le avec n'importe quel client WebDriver …
server.Stop()
```

Comme WebDriver n'est que du HTTP et du JSON, n'importe quel client dans n'importe quel langage
fonctionne :

**C#**

```csharp
driver.FindElement (By.CssSelector ("#okButton")).Click ();
driver.FindElement (By.Name ("nameBox")).SendKeys ("Ada Lovelace");
```

**VB.NET**

```vb
driver.FindElement(By.CssSelector("#okButton")).Click()
driver.FindElement(By.Name("nameBox")).SendKeys("Ada Lovelace")
```

Pris en charge : créer/supprimer une session, trouver un ou plusieurs éléments, cliquer, envoyer des
touches, effacer, lire le texte, lire le nom (rôle), lire un attribut, lire le rectangle, lire l'état
activé, **source de la page** (XML), capture d'écran (PNG), `GET /status`. Localisateurs : `id`, `name`,
`tag name` (rôle), `xpath`, `css selector` (`#id` et `[name='…']`), plus les stratégies personnalisées
`role`, `type`, `link text`. Les références d'éléments se résolvent à nouveau contre un instantané frais à
chaque utilisation, en privilégiant l'AutomationId stable, donc les valeurs restent à jour après des
modifications.

**Enregistrer des localisateurs.** Comme le serveur expose la source de page XML *et* une stratégie xpath
qui s'exécute exactement contre cette source, n'importe quel inspecteur de type Appium peut afficher
l'arbre vivant par-dessus une capture d'écran et vous laisser capturer des localisateurs en cliquant sur
les nœuds. Pointez-le vers `127.0.0.1`, votre port, le chemin `/`, en http simple ; les capabilities sont
ignorées. Préférez les localisateurs dans cet ordre : **`id`** → **`xpath`** → `name`/`role`/`type`.
Mises en garde : c'est un serveur WebDriver W3C, pas un serveur Appium complet (les points de terminaison
propres à Appium renvoient 404 — un client WebDriver générique est l'inspecteur le plus fiable) ; la
superposition peut être décalée si la capture d'écran est prise à un DPI différent ; une fenêtre à la
fois ; les contrôles masqués sont omis de l'arbre.

Dans un test **headless**, il n'y a pas de boucle de messages, donc pompez la file pendant que les appels
HTTP s'exécutent sur un thread de travail :

**C#**

```csharp
var task = Task.Run (RunWebDriverFlow);
while (!task.IsCompleted) {
    Platform.Backend.DoEvents ();
    Thread.Sleep (5);
}
```

**VB.NET**

```vb
Dim task = Task.Run(AddressOf RunWebDriverFlow)
While Not task.IsCompleted
    Platform.Backend.DoEvents()
    Thread.Sleep(5)
End While
```

**Playwright n'est pas adapté** à l'application de bureau — il automatise des moteurs de navigateur via un
DOM, et il n'y a pas de DOM ici. (Le [miroir ARIA](#module-6-singleview) de la tête navigateur est bien un
DOM, mais c'est une surface d'accessibilité, pas une API d'automatisation ; pilotez l'application via
WebDriver.) Ne laissez pas cette question consommer un sprint.

### Laisser un agent IA piloter l'application
{:#module-8-mcp}

Le même point de terminaison WebDriver est ce qu'utilise un assistant IA. `Majorsilence.Forms.Mcp` est un
serveur MCP livré sous forme d'outil global dotnet : il parle MCP via stdio à l'assistant et HTTP via la
boucle locale au `WebDriverServer` de votre application, en exposant `ui_snapshot`, `ui_find`, `ui_read`,
`ui_click`, `ui_type`, `ui_wait_for` et `ui_screenshot`. Chaque outil prend un localisateur, pas un handle
d'élément, donc rien ne devient périmé entre une recherche et une action.

```
dotnet tool install -g Majorsilence.Forms.Mcp
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444     # ou la même commande dans la configuration de n'importe quel client MCP
```

Quelque chose vers quoi le pointer pendant l'apprentissage : `samples/AutomationTarget` est une petite
application construite exactement pour cela — `dotnet run --project samples/AutomationTarget -- --webdriver 4444`
démarre le point de terminaison et affiche les commandes pour le piloter. Chacun de ses contrôles exerce
une chose qu'un client doit gérer : un bouton définitivement désactivé (pour que vous voyiez un refus
plutôt qu'un faux succès), un bouton Submit qui ne s'active qu'une fois une case cochée (ce à quoi sert
`ui_wait_for`), un contrôle délibérément sans nom, et un journal visible de chaque action pour que vous
puissiez confronter ce que le client *prétend* avoir fait à ce que l'application a vu. La surface
d'automatisation n'est pas authentifiée, donc n'exposez-la que dans les builds de développement et de
test.

### Accessibilité sous Windows
{:#module-8-a11y}

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // doit d'abord être affiché — il faut un handle natif
WindowsUIAutomation.Enable (form);  // se détache automatiquement à la fermeture de la fenêtre
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' doit d'abord être affiché — il faut un handle natif
WindowsUIAutomation.Enable(form)    ' se détache automatiquement à la fermeture de la fenêtre
```

> **Cet extrait ne compile pas hors Windows** — vérifié, pas théorisé. Hors Windows, le paquet est livré
> sous forme de stub vide, donc l'espace de noms `Majorsilence.Forms.WindowsUIAutomation` n'existe pas et
> vous obtenez CS0234 plutôt qu'une `PlatformNotSupportedException` à l'exécution. Dans une application
> multiplateforme, multi-ciblez (`net10.0;net10.0-windows`) et protégez l'appel avec `#if WINDOWS`, ou
> gardez-le dans un projet Windows uniquement que votre tête bureau référence conditionnellement.

Chaque contrôle devient un élément UIA avec **Name**, **AutomationId** (`Control.Name`), **ControlType**,
**IsEnabled**, **HasKeyboardFocus** et un **BoundingRectangle** à l'écran. `Invoke` (boutons) est actif ;
`Value` et `Toggle` sont exposés en lecture. Les changements de focus déclenchent des événements UIA de
changement de focus — c'est ce qui fait qu'un lecteur d'écran annonce le nouveau contrôle et qu'une loupe
le suit.

Absents de cette première version : les événements de valeur de `TextBox` à chaque frappe (les lecteurs
d'écran se rabattent sur leur propre écho des caractères saisis ; le champ est toujours annoncé à la prise
de focus), les événements de changement de structure, et les éléments de sous-contrôle (onglets
individuels, lignes de liste). Les ponts Linux (AT-SPI) et macOS (NSAccessibility) au-dessus du même arbre
sont des éléments de la feuille de route — donc si vous avez une obligation d'accessibilité sur ces
plateformes, soulevez-la maintenant plutôt qu'au moment de livrer.

**Exercice 8.** Écrivez les `GreetFormTests` ci-dessus dans le langage de votre équipe, faites-les passer
au vert en CI sans affichage, puis ajoutez une assertion par image de référence. Ce test est le modèle que
chaque test d'interface de votre base de code devrait suivre.

---
## Module 9 — Contenu natif et vidéo
{:#module-9}

**Objectif :** personne dans l'équipe ne fabrique jamais de faux handle de fenêtre, et le contenu
vidéo/cartes/navigateur est hébergé de la manière qui compose réellement avec le reste.

Deux questions se révèlent n'en faire qu'une — « comment placer du contenu natif dans un contrôle ? » et
« comment obtenir un `HWND` pour un contrôle ? » — et la réponse à la seconde est **impossible, et il ne
faut pas en fabriquer un.**

| Membre | Valeur | Pourquoi |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | Aucune fenêtre OS par contrôle n'existe. Idem pour `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle`. |
| `WindowBase.Handle` | Un jeton opaque non nul | **Ce n'est pas un `HWND`.** Il existe parce que le code WinForms lit couramment `.Handle` pour forcer la création du handle avant `Invoke`, et renvoyer zéro casse cet idiome. N'a de sens qu'à l'intérieur du code managé. |
| `WindowBase.PlatformHandle` | Le véritable handle natif, ou zéro | L'authentique — `HWND`/`NSWindow`/`XID` sur le backend Avalonia, un vrai `HWND` sur le backend WinForms. Zéro sur Uno et Headless. |

**La règle sur les faux handles :** un handle fabriqué n'est sûr *que* tant qu'il circule dans du code
managé que vous contrôlez. Il cesse de l'être dès qu'il passe dans du code natif — le
`libvlc_media_player_set_hwnd` de LibVLC, le `--wid` de mpv, le `GstVideoOverlay.set_window_handle` de
GStreamer le transmettent tous à l'OS (`SetParent`, `CreateWindowEx`, `SetWindowPos`), qui ne tolérera
pas une valeur inventée.

### Route A — `NativeControlHost`
{:#module-9-route-a}

La couture prise en charge : votre contrôle réserve un rectangle, et le backend le remplit avec un
véritable élément du toolkit superposé à la surface Skia, maintenu aligné sur les limites, le clip et la
visibilité du placeholder. Disponible sur Avalonia, Uno, GTK 4 et le backend WinForms ; absent sur
Headless et Terminal.

**C#**

```csharp
using Majorsilence.Forms;

var host = new NativeControlHost {
    Name = "mapHost",
    Dock = DockStyle.Fill
};

// Affectez le type d'élément propre au toolkit. Sur le backend Avalonia, c'est un Control Avalonia :
host.NativeControl = new Avalonia.Controls.Button { Content = "I am a real Avalonia button" };

Controls.Add (host);

// Affecter null retire à nouveau l'élément hébergé.
host.NativeControl = null;
```

**VB.NET**

```vb
Imports Majorsilence.Forms

Dim host As New NativeControlHost With {
    .Name = "mapHost",
    .Dock = DockStyle.Fill
}

' Affectez le type d'élément propre au toolkit. Sur le backend Avalonia, c'est un Control Avalonia :
host.NativeControl = New Avalonia.Controls.Button With {
    .Content = "I am a real Avalonia button"
}

Controls.Add(host)

' Affecter Nothing retire à nouveau l'élément hébergé.
host.NativeControl = Nothing
```

![Un bouton Avalonia natif hébergé dans un formulaire Majorsilence]({{ '/assets/img/example-native.png' | relative_url }})

*Ce code, en exécution : le `Button` Avalonia est bel et bien là, hébergé au-dessus de la surface Skia.
Remarquez qu'il s'affiche comme du texte brut sans habillage de bouton — un contrôle natif hébergé est
stylé par les styles Avalonia de **l'application hôte**, et le backend amorce une application Avalonia
minimale qui n'installe aucun thème. La couture fonctionne ; le style, c'est à vous de le fournir.
Prévoyez ce budget si vous comptez héberger de véritables interfaces natives plutôt qu'une surface qui se
dessine elle-même, comme une vue carte ou vidéo.*

Trois choses à savoir. **Limites d'airspace :** la superposition est un élément natif *au-dessus* de votre
contenu peint, donc rien de ce que le framework dessine ne peut apparaître par-dessus (GTK 4 est
l'exception — il compose chaque widget dans un seul arbre de rendu, il n'y a donc pas de problème
d'airspace là-bas). **Le style n'est pas hérité** de Majorsilence.Forms — voir la capture ci-dessus. Et
**affecter le mauvais type échoue silencieusement** — `NativeControl` est typé `Object`, chaque backend
vérifie le type et se contente de retourner s'il ne correspond pas ; rien ne lève, rien ne journalise,
rien n'apparaît. Un `Control` Avalonia passé au backend Uno produit exactement cela ; de même un contrôle
WinForms passé à GTK 4. Si votre contenu natif est invisible, vérifiez d'abord le type : `Control`
Avalonia, `UIElement` Uno, `System.Windows.Forms.Control`, `Gtk.Widget`.

### Route B — vidéo par rappels de trame (recommandée)
{:#module-9-route-b}

Plutôt que d'héberger une surface native, prenez les trames décodées du lecteur et dessinez-les
vous-même dans Skia. Cela compose correctement avec tout ce que vous peignez par ailleurs, et contourne
entièrement à la fois le problème d'airspace et le problème de handle. La forme :

**C#**

```csharp
public class VideoSurface : Control
{
    private SKBitmap? frame;

    // Appelé depuis le rappel de trame de votre lecteur, sur le thread qu'il utilise.
    public void OnFrameDecoded (SKBitmap decoded)
    {
        frame = decoded;
        Majorsilence.Forms.Application.RunOnUIThread (Invalidate);
    }

    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);

        if (frame is not null)
            e.Canvas.DrawBitmap (frame, new SKRect (0, 0, Width, Height));
    }
}
```

**VB.NET**

```vb
Public Class VideoSurface
    Inherits Control

    Private frame As SKBitmap

    ' Appelé depuis le rappel de trame de votre lecteur, sur le thread qu'il utilise.
    Public Sub OnFrameDecoded(decoded As SKBitmap)
        frame = decoded
        Majorsilence.Forms.Application.RunOnUIThread(AddressOf Invalidate)
    End Sub

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        MyBase.OnPaint(e)

        If frame IsNot Nothing Then
            e.Canvas.DrawBitmap(frame, New SKRect(0, 0, Width, Height))
        End If
    End Sub
End Class
```

![La surface vidéo par rappels de trame composant une trame décodée]({{ '/assets/img/example-video.png' | relative_url }})

*Le même code avec une trame synthétisée tenant lieu de décodeur. Le bitmap est dessiné directement dans
le canevas Skia du contrôle, il compose donc avec tout ce que vous peignez par ailleurs — pas d'airspace,
pas de handle, et cela fonctionne à l'identique sur chaque backend, Headless compris (c'est ainsi que
vous le testeriez unitairement).*

Voir [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) pour la
comparaison complète et les lacunes connues.

**Exercice 9.** Trouvez chaque `.Handle` dans votre base de code et classez chaque usage : forcer la
création du handle (correct — gardez-le), passage à du code managé (correct), ou passage à du code natif
(doit changer). Un grep de cinq minutes qui prévient une classe de bugs réellement déroutante.

---

## Module 10 — Livrer : CI, versions et suivi des mises à jour
{:#module-10}

**Objectif :** votre pipeline attrape les régressions que ce framework produit réellement, et vous savez
quoi faire quand vous tombez sur une lacune.

### Verrouillez votre pipeline
{:#module-10-ci}

| Garde-fou | Commande | Attrape |
|---|---|---|
| Build propre | `dotnet build --configuration Release` | Les avertissements avant qu'ils ne s'accumulent |
| Tests | `dotnet test --configuration Release --no-build` | Tout ce qui vient du [module 8](#module-8) — aucun affichage requis |
| Dérive de migration | `majorsilence-migrate <sln> --dry-run --strict` | Une nouvelle référence non mappée dès qu'elle atterrit sur une branche, pendant que vous convergez encore |
| HiDPI | `MF_HEADLESS_SCALE=2` sur vos tests sensibles à la mise à l'échelle | Une disposition qui ne fonctionne qu'à l'échelle 1 — et un contrôle personnalisé qui met encore à l'échelle son propre canevas ([module 4](#module-4-paint)) |
| Appels bloquants dans le code navigateur | L'analyseur `MFB001`–`MFB003`, avec `majorsilence_forms.browser_target = true` dans le `.editorconfig` de la bibliothèque UI partagée, et les avertissements traités comme erreurs sur ce projet | Un `ShowDialog`/`MessageBox.Show`/`.Result`/`Thread.Sleep` qui lèvera une exception ou figera la page ([module 6](#module-6-async)) |
| Démarrage navigateur | `dotnet publish` de votre tête wasm + un test de fumée Chromium headless | La rupture du pipeline wasm |

Ce dernier mérite d'être copié tel quel si vous ciblez le navigateur : **compiler une cible wasm ne
prouve pas qu'elle fonctionne.** C'est `dotnet publish` qui exécute le pipeline wasm-tools (l'édition de
liens native emcc/wasm-opt), et seul un vrai démarrage dans un navigateur valide le bundle. Un
`dotnet build` qui réussit ne vous dit rien à ce sujet. La CI du framework lui-même le fait avec une
chaîne de requête `?check=<name>` que la tête de la galerie comprend et un petit script Node
(`samples/Gallery.Wasm/tools/modal-check.mjs`) qui démarre le bundle publié dans Chrome headless, exécute
chaque vérification nommée et compare le résultat à une table attendue — ce sont les vérifications
modales qui ont prouvé la règle des boîtes de dialogue asynchrones. Copiez la forme : un commutateur
`?check=` dans votre propre tête coûte un après-midi et transforme « ça a publié » en « ça a tourné ».

### Discipline de version
{:#module-10-versioning}

- **Figez la version de votre paquet.** C'est un logiciel en bêta ; l'API se stabilise. Figez, mettez à
  niveau délibérément et lisez les notes de version — les changements cassants documentés dans la
  [liste de contrôle du module 5](#module-5-checklist) sont le genre de chose qui arrive entre deux
  versions.
- **Gardez les versions du cœur, du backend et du migrateur synchronisées.** Le `--package-version` du
  migrateur prend par défaut sa propre version, parce que l'outil et les paquets sortent de la même
  release.
- **Centralisez la version** pour qu'une mise à niveau tienne en une seule modification. Dans
  `Directory.Packages.props` :

  ```xml
  <Project>
    <PropertyGroup>
      <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
    </PropertyGroup>
    <ItemGroup>
      <PackageVersion Include="Majorsilence.Forms" Version="26.9.0" />
      <PackageVersion Include="Majorsilence.Forms.Avalonia" Version="26.9.0" />
      <PackageVersion Include="Majorsilence.Forms.Headless" Version="26.9.0" />
    </ItemGroup>
  </Project>
  ```

  Ajoutez `Majorsilence.Forms.Mvvm`, `.Theming.WinForms`, `.Animation` ou un second backend à la même
  liste au fur et à mesure que vous les adoptez — chaque paquet de la famille sort de la même release, à la
  même version.

- **Mettez à niveau sur une branche avec vos tests d'images de référence au vert** avant que cela
  n'atteigne qui que ce soit d'autre. Les changements de rendu sont exactement ce pour quoi ces tests
  existent.

### Quand vous tombez sur une lacune
{:#module-10-gaps}

Cela arrivera. Ce qu'il est utile de savoir, c'est que plusieurs lacunes de ce framework n'ont été
trouvées qu'en *migrant de vraies applications* — un jeu WinForms, une bibliothèque de contrôles ruban —
et non en lisant la surface de l'API. Si votre équipe porte quelque chose de réel et tombe sur un no-op
silencieux, cette découverte a de la valeur au-delà de votre propre projet.

- **Un membre qui lève une exception au lieu d'être un no-op** contredit la
  [politique des stubs](#module-3-stub-policy) — signalez-le comme un bug.
- **Un no-op silencieux qui vous a coûté une journée** mérite aussi un ticket : déposez-le avec le
  *symptôme*, pas seulement le nom du membre (« `X` n'a rien fait, donc les sprites se sont dessinés avec
  une boîte blanche »), parce que c'est le symptôme qui le rend trouvable pour l'équipe suivante. Joignez
  le [test de verrouillage](#module-3-pin) que vous avez écrit — c'est une reproduction, prête à
  s'exécuter.
- **Bloqué et impossible d'attendre ?** Le projet accepte les pull requests, assistées par IA ou non, avec
  une barre simple : `dotnet build --configuration Release` et `dotnet test` propres, le nouveau
  comportement couvert par des tests qui prouvent qu'il *fonctionne* plutôt qu'il compile, et
  [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) mis à jour en même
  temps que le code qu'il décrit. Combler la lacune précise qui vous bloque représente généralement bien
  moins de travail que de la contourner par la conception.

**Exercice 10.** Ajoutez les garde-fous ci-dessus à votre dépôt. Puis prenez la lacune de l'exercice du
[module 3](#module-3) dont votre application a réellement besoin, et décidez en équipe : la contourner
par la conception, ou la combler en amont. Notez par écrit laquelle et pourquoi.

---

## Annexe A — Dépannage par symptôme
{:#appendix-a}

| Symptôme | Cause probable | Correctif |
|---|---|---|
| L'application ne démarre pas / aucune fenêtre n'apparaît | Aucun paquet backend référencé — le paquet cœur ne peut pas afficher une fenêtre à l'écran | Ajoutez `Majorsilence.Forms.Avalonia` (ou Uno/Headless) |
| Erreurs de référence ambiguë sur `Bitmap`/`Font`/`Pen` après la migration | `System.Drawing.Common` est toujours référencé à côté des remplacements Majorsilence | Retirez la référence de paquet (le migrateur le fait pour chaque projet qu'il touche) |
| CS0104 (C#) / ambiguïté (VB) sur `SystemColors` / `ColorTranslator` | Les deux vivent dans `System.Drawing.Primitives`, ils se résolvent donc encore via l'import `System.Drawing` conservé | Ajoutez l'alias — `using SystemColors = Majorsilence.Forms.SystemColors;` / `Imports SystemColors = Majorsilence.Forms.SystemColors` |
| Une bibliothèque de classes qui n'a jamais mentionné WinForms ne compile plus | Elle contenait un utilitaire image/police qui a été réécrit vers `Majorsilence.Forms.Drawing.*` | Ajoutez la référence `Majorsilence.Forms` ; « les projets que la réécriture touche » est plus large que « les projets WinForms » |
| Le câblage d'événements du Designer ne compile pas (`new EventHandler<KeyEventArgs>(…)`) | Les types de délégués d'événements correspondent désormais à WinForms | Retirez l'enveloppe, ou nommez le délégué WinForms (`KeyEventHandler`, `MouseEventHandler`, …) |
| `e.X` / `e.Button` manquants dans un gestionnaire `Click` | `Click` est un événement `EventArgs` dans WinForms aussi | Passez à `MouseClick` ; sur un élément de menu, prenez la position depuis le contrôle propriétaire |
| VB : `Or` contre `|` sur les drapeaux `Anchor`/`DockStyle` | La combinaison de drapeaux utilise `Or` en VB | `AnchorStyles.Top Or AnchorStyles.Left` |
| VB : les tests s'exécutent sans backend | VB n'a pas d'initialiseur de module — le motif C# `<ModuleInitializer>` ne fait silencieusement rien | Installez le backend depuis `<AssemblyInitialize>` / `<SetUpFixture>` — voir le [module 8](#module-8-headless) |
| Une disposition scindée a inversé son orientation | `SplitContainer.Orientation` désigne désormais la direction de la *barre* | Inversez la valeur que vous définissez (rien ne prévient — les deux valeurs compilent) |
| `InvalidCastException` à la première lecture de ressource | Un designer de ressources généré convertit un résultat `System.Resources.ResourceManager` | Utilisez `Majorsilence.Forms.ComponentResourceManager` (le migrateur réécrit automatiquement les designers générés) |
| Une ressource se résout en `null` à l'exécution | L'entrée resx est un `ResXFileRef` (fichier lié, pas des données en ligne) | Intégrez la ressource en ligne, ou chargez-la vous-même |
| Toutes les icônes invisibles, rien dans les journaux | Un chemin d'actif relatif résolu par rapport au mauvais **répertoire de travail** ; le fichier manquant est devenu un placeholder 1×1 au lieu de lever une exception | Résolvez les actifs par rapport à `AppContext.BaseDirectory` — voir le [module 0](#module-0) |
| Icônes manquantes uniquement dans la version navigateur | Pas de vrai système de fichiers là-bas ; les chargements de fichiers relatifs ne peuvent pas fonctionner | Livrez les images comme ressources embarquées — voir le [module 6](#module-6-singleview) |
| Définir une propriété n'a aucun effet visible | C'est un stub selon la [politique des stubs](#module-3-stub-policy) — elle stocke et relit, rien ne la consomme | Vérifiez la ligne de la matrice. Si elle *lève une exception* à la place, c'est un bug — signalez-le |
| Le contenu natif hébergé est invisible | Le backend a vérifié le type de votre contrôle natif, il ne correspondait pas, et il est retourné silencieusement | Vérifiez le type : `Control` Avalonia pour le backend Avalonia, `UIElement` Uno pour Uno, `System.Windows.Forms.Control` pour le backend WinForms, `Gtk.Widget` pour GTK 4 |
| Agrandir/réduire ne fait rien ; `Title` est ignoré | Vous êtes sur une plateforme à vue unique (navigateur/Android/iOS/Terminal) — pas de gestionnaire de fenêtres | Attendu. Voir le [module 6](#module-6-singleview) |
| Les clics atterrissent au mauvais endroit en HiDPI | Le routage des entrées mélange unités logiques et unités physiques — un bug du framework en 26.0.30, corrigé depuis et verrouillé en CI à l'échelle 2 | Mettez à niveau (26.9.0 ou ultérieur). Si cela persiste, c'est votre propre code qui mélange les deux espaces — voir le [module 8](#module-8-headless) |
| Un contrôle personnalisé se dessine à deux fois sa taille sur un écran HiDPI, correctement à 1× | Le canevas de peinture est désormais logique ; le contrôle appelle encore `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` et met à l'échelle deux fois | Retirez le `ScaleTransform` — voir le [module 4](#module-4-paint). Testez sous `MF_HEADLESS_SCALE=2` |
| Les éléments dessinés par le propriétaire (`DrawItem`, `DrawNode`, `CellPainting`) ressortent petits ou décalés en HiDPI | Ces événements sont toujours en pixels physiques, contrairement au `ClientRectangle` logique du contrôle | Utilisez `e.Bounds` et `e.Graphics` ensemble et n'y mélangez pas la géométrie logique propre au contrôle ; voir le [module 4](#module-4-paint) |
| `PlatformNotSupportedException` depuis `ShowDialog` / `MessageBox.Show` dans le navigateur, sur Android ou iOS | Ces lignes ne peuvent pas exécuter une boucle modale imbriquée ; l'exception nomme le jumeau awaitable | Utilisez `ShowDialogAsync` / `MessageBox.ShowAsync` depuis un gestionnaire `async` — voir le [module 6](#module-6-async). Activez l'analyseur `MFB` pour que le build trouve le reste |
| L'onglet du navigateur se fige après un clic | Quelque chose a bloqué l'unique thread de la page — `.Result`, `.Wait()`, `Thread.Sleep` | Faites un `await` (`MFB002`/`MFB003` les signalent) — voir le [module 6](#module-6-async) |
| Une fenêtre GTK 4 ignore `Location` / `StartPosition` | GTK 4 a retiré le positionnement côté client des fenêtres de premier niveau ; c'est le gestionnaire de fenêtres qui décide | Attendu. `Location` est une indication stockée sur ce backend — voir le [module 6](#module-6) |
| Les sélecteurs de fichiers ne renvoient rien sur GTK 4 / Headless | Ces backends n'ont pas encore de sélecteur natif, la boîte de dialogue de repli propre au framework est donc utilisée | Attendu ; le repli fonctionne. Le câblage de `Gtk.FileDialog` est un travail différé |
| Une boîte de dialogue WinForms n'est pas modale par rapport à son parent Majorsilence | `OwnerHandleResolver` n'a jamais été câblé | Câblez-le une fois au démarrage — voir le [module 7](#module-7-a) |
| Interblocage ou double boucle de messages sous Windows | Les deux `Application.Run` ont été appelés | Un hôte par processus ; utilisez le pont pour l'autre direction |
| `PlatformNotSupportedException` depuis l'interop sous macOS/Linux | `System.Windows.Forms` n'existe pas là-bas | Protégez les appels d'interop derrière une vérification Windows |
| Une règle de thème CSS n'a aucun effet, aucune erreur | Un contrôle a défini cette propriété dans le code (`button.BackColor = …`) — les valeurs explicites par contrôle l'emportent, comme dans WinForms | Retirez la valeur par contrôle, ou acceptez-la. Une règle *mal orthographiée*, en revanche, produit toujours une erreur — consultez les diagnostics de `ThemeStyleSheet.Parse` ([annexe D](#appendix-d)) |
| Un bouton lié par `BindCommand` exécute sa commande deux fois par clic | `Button.Command` est aussi défini sur le même contrôle | Utilisez l'un ou l'autre ([annexe E](#appendix-e)) |

---

## Annexe B — Plan de déploiement pour une base de code réelle
{:#appendix-b}

Une séquence où les preuves arrivent avant l'engagement.

1. **Spike (1 jour).** Modules 0–3. L'application du modèle tourne sur l'OS de chaque développeur, la
   galerie en ligne a été explorée, la matrice de compatibilité a été lue. Livrable : une liste des
   20 principales dépendances UI de votre application, chacune notée implémentée / stub / absente.
2. **Migration pilote (2–5 jours).** Choisissez une petite application interne, réelle et à faible
   enjeu. Lancez le migrateur sur une branche, obtenez un build, travaillez la
   [liste de contrôle des corrections manuelles](#module-5-checklist). Livrable : une estimation
   calibrée par KLOC et une liste des lacunes qui *vous* bloquent réellement.
3. **Décidez la forme de l'adoption.** Quatre options, qui ne s'excluent pas mutuellement :
   - **Nouvelle application** — démarrez directement sur Majorsilence.Forms ([module 2](#module-2)).
   - **Nouveaux écrans dans une ancienne application** — interop Direction B sous Windows, sans rien
     changer à ce que vous livrez ([module 7](#module-7-b)).
   - **Un contrôle à la fois dans une ancienne application** — le backend WinForms ou WPF
     ([module 7](#module-7-c)), qui fonctionne aussi sur .NET Framework 4.8, de sorte que le portage de
     l'UI n'a pas à attendre la mise à niveau du runtime.
   - **Migration de toute l'application** — le migrateur, éventuellement avec `--dual-build` si vous
     êtes en C# ([module 5](#module-5-dualbuild)). **Équipes VB : planifiez plutôt une bascule** — le
     double build ne vous est pas accessible.
4. **Mettez en place le filet de tests avant le gros du travail.** Le [module 8](#module-8), sur le
   pilote : convention de nommage des localisateurs, tests headless en CI, images de référence pour les
   écrans qui comptent. Faites-le *avant* de migrer la grosse application — les tests sont le moyen de
   savoir que le portage se comporte correctement.
5. **Posez les garde-fous de CI** ([module 10](#module-10-ci)), y compris la dérive de migration en
   `--strict`.
6. **Migrez par tranches**, une unité déployable à la fois, chacune finissant au vert sur les
   garde-fous.
7. **Faites remonter vos découvertes** ([module 10](#module-10-gaps)). Les no-op silencieux que vous
   rencontrez sont ceux que personne d'autre ne peut trouver en lisant l'API.

Tranchez ces questions explicitement et tôt, parce que chacune contraint le plan : les plateformes dont
vous avez réellement besoin (« bureau uniquement » est un projet très différent de « et iOS »), si vous
avez besoin d'un designer visuel (il n'y en a pas encore), si vous dépendez d'une suite de contrôles
d'un éditeur (Telerik dispose d'une couche de compatibilité ; les autres éditeurs demandent un fichier
`--map` et du travail manuel), si vous avez une obligation d'accessibilité hors Windows, si votre base de
code est en VB (bascule, pas de double build), si quelque chose dans votre application héberge du contenu
natif ou lit des handles de fenêtre, et — si une tête navigateur ou téléphone est dans le périmètre — si
vos boîtes de dialogue sont écrites en asynchrone dès le départ ([module 6](#module-6-async)).

---

## Annexe C — Carte de référence
{:#appendix-c}

**Pages du site :** [Bien démarrer]({{ '/fr/getting-started/' | relative_url }}) ·
[Migration]({{ '/fr/migration/' | relative_url }}) ·
[Exemples]({{ '/fr/samples/' | relative_url }}) · [Backends de plateforme]({{ '/fr/backends/' | relative_url }}) ·
[Automatisation et tests d'interface]({{ '/fr/automation/' | relative_url }}) ·
[Interopérabilité native]({{ '/fr/native-interop/' | relative_url }}) · [FAQ]({{ '/fr/faq/' | relative_url }}) ·
[Blog]({{ '/fr/blog/' | relative_url }}) · [Galerie en ligne dans le navigateur]({{ '/gallery/' | relative_url }})

**Dans le dépôt — les documents dont une équipe applicative a réellement besoin :**

| Document | Lisez-le quand |
|---|---|
| [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) | Avant de vous appuyer sur un membre, quel qu'il soit. Gardez-la ouverte |
| [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md) | Vous lancez le migrateur ; chaque changement cassant y est documenté |
| [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) | Vous choisissez un backend ; unités logiques contre unités physiques ; les lignes à vue unique ; la règle des boîtes de dialogue asynchrones et l'analyseur |
| [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) | Vous écrivez un thème CSS — tout le langage tient sur cette seule page |
| [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) | Vous câblez des view-models avec `Observe`/`BindText`/`BindCommand` |
| [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md) | Vous mettez en page un écran au format téléphone — `StackPanel`, `Card`, `RichListBox` |
| [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md) | `RequestAnimationFrame`, interpolations (tweens), mouvement réduit, l'horloge Headless |
| [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md) | Les tests en profondeur, y compris l'`IAutomationStateProvider` des contrôles personnalisés et le serveur MCP |
| [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) | Vous faites tourner les deux piles dans un seul processus sous Windows |
| [`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) | Vous hébergez du contenu natif ou de la vidéo |

**Commandes à mémoriser :**

```
dotnet new install Majorsilence.Forms.Templates        # une seule fois
dotnet new majorsilenceforms -n MyApp                  # nouvelle application (bibliothèque partagée + tête bureau)
dotnet run --project MyApp
dotnet build --configuration Release && dotnet test --configuration Release --no-build
MF_HEADLESS_SCALE=2 dotnet test --configuration Release --no-build   # le garde-fou HiDPI
dotnet tool install -g Majorsilence.Forms.Migrator
majorsilence-migrate MySolution.sln --dry-run --diff   # cadrer une migration
majorsilence-migrate MySolution.sln --no-backup        # la lancer sur une branche
majorsilence-migrate MySolution.sln --dry-run --strict # garde-fou de dérive en CI
dotnet tool install -g Majorsilence.Forms.Mcp          # laisser un agent IA piloter l'application (module 8)
dotnet workload install wasm-tools && dotnet publish <YourWasmHead> -c Release -o out
dotnet run --project samples/ThemeStudio               # depuis un clone : éditeur de thèmes CSS en direct (annexe D)
```

**Le résumé en deux lignes pour qui demande ce qui change :** vos imports passent de
`System.Windows.Forms` à `Majorsilence.Forms` et de GDI+ à `Majorsilence.Forms.Drawing`, et vous
ajoutez un paquet backend. Vos formulaires, fichiers Designer, gestionnaires d'événements et logique
métier restent les vôtres.

---

## Annexe D — Thémer votre application avec CSS
{:#appendix-d}

**Objectif :** vous pouvez restyler toute une application depuis un seul fichier, vous savez ce que le
langage de thème peut et ne peut pas exprimer, et vous savez comment découvrir qu'une règle est fausse.

Parce que le framework peint lui-même chaque pixel ([module 1](#module-1)), l'apparence est l'affaire du
framework et non de l'OS — et le framework l'expose sous la forme d'un **petit sous-ensemble de CSS,
strictement défini**. Un thème est un fichier `.css` ; tout le langage tient sur une page
([`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md)), et l'analyseur rejette tout ce
qui en sort avec une ligne, une colonne et l'alternative prise en charge. Il n'y a délibérément **aucun
no-op silencieux** dans ce coin du framework — une propriété mal orthographiée est une erreur, pas un
stub. (Cette annexe a été vérifiée par rapport à ce document et à l'exemple `ThemeStudio`, pas exécutée
pour ce guide. L'ancien format XML `<Theme>` fonctionne toujours et peut être mélangé avec le CSS.)

### Charger un thème
{:#appendix-d-load}

**C#**

```csharp
using Majorsilence.Forms;

// Appliquer un fichier immédiatement :
Theme.LoadFromCssFile ("Themes/ocean.css");

// Ou l'enregistrer par nom et basculer à l'exécution :
Theme.RegisterThemeCssFromFile ("Themes/ocean.css");   // renvoie "Ocean", d'après l'en-tête @theme du fichier
Theme.ApplyTheme ("Ocean");
Theme.SetBuiltInTheme (BuiltInTheme.Light);            // retour à un thème intégré ; réinitialise tout

// Démarrer le vôtre à partir du thème courant :
File.WriteAllText ("mine.css", Theme.ExportCss ("Mine", "Light"));
```

**VB.NET**

```vb
Imports Majorsilence.Forms

' Appliquer un fichier immédiatement :
Theme.LoadFromCssFile("Themes/ocean.css")

' Ou l'enregistrer par nom et basculer à l'exécution :
Theme.RegisterThemeCssFromFile("Themes/ocean.css")     ' renvoie "Ocean", d'après l'en-tête @theme du fichier
Theme.ApplyTheme("Ocean")
Theme.SetBuiltInTheme(BuiltInTheme.Light)              ' retour à un thème intégré ; réinitialise tout

' Démarrer le vôtre à partir du thème courant :
File.WriteAllText("mine.css", Theme.ExportCss("Mine", "Light"))
```

Chargez le thème avant l'affichage du premier formulaire si vous ne voulez aucun scintillement ;
l'appliquer plus tard repeint tout ce qui est ouvert.

### Le langage, en un seul exemple
{:#appendix-d-language}

Trois sortes d'instructions — un en-tête, des jetons et des règles de contrôle — et rien d'autre :

```css
/* Ocean : un thème sombre bleu-vert profond. */
@theme "Ocean" extends Dark;             /* partir d'un thème intégré (Light, Dark, Classic, Aero, …) ou de tout thème enregistré */

:root {
  --brand: #1e90ff;                      /* votre propre variable, référencée plus bas avec var() */

  --accent-color: var(--brand);          /* jetons : un par propriété Theme, en kebab-case */
  --background-color: #0a1929;
  --control-mid-color: #102a43;
  --foreground-color: #cfe8ff;
  --foreground-color-on-accent: white;
  --font-size: 14px;                     /* pixels entiers uniquement — pt/em/rem/% sont des erreurs */
  --ui-font: "Segoe UI", "Noto Sans", sans-serif;
}

/* Une règle style un TYPE de contrôle — chaque Button de l'application qui n'a pas défini sa propre couleur dans le code. */
Button        { border: 1px solid #15395c; border-radius: 4px; box-shadow: 2px 2px #06101c; }
Button:hover  { background-color: var(--brand); color: white; }
Button:active { box-shadow: 0px 0px #06101c; }

TextBox, ComboBox, NumericUpDown { background-color: #061120; border-color: var(--border-low-color); }

/* Parties : les morceaux qu'un contrôle peint à l'intérieur de lui-même. */
DataGridView::header    { background-color: #2c2c30; color: #e8e8ea; font-weight: bold; }
DataGridView::selection { background-color: var(--accent-color); color: var(--foreground-color-on-accent); }
ScrollBar::thumb        { background-color: #55555c; border-radius: 4px; }
Menu::item:hover        { background-color: #34343a; }
```

Ce qu'il faut en dire à votre équipe, parce que chaque point est un endroit où l'intuition CSS induit en
erreur :

- **Les jetons d'abord.** Définir uniquement les jetons `:root` recolore déjà chaque contrôle *et*
  chaque partie ; n'ajoutez des règles de contrôle que là où les valeurs par défaut ne vous conviennent
  pas.
- **Les sélecteurs sont des noms de types de contrôles** (`Button`, `TextBox`, `DataGridView`, et chaque
  contrôle de compatibilité Telerik). Il n'y a ni classes, ni ids, ni sélecteurs descendants, ni `*` —
  une règle s'applique à chaque contrôle de ce type, où qu'il se trouve. Pour styler *un seul* contrôle,
  définissez `button.Style.BackgroundColor` (ou le `BackColor` WinForms) dans le code ; **les valeurs
  explicites par contrôle l'emportent toujours**, exactement comme dans WinForms.
- **Quatre pseudo-classes** (`:hover`, `:active`, `:disabled`, `:focus`), et uniquement sur les
  contrôles qui se repeignent pour cet état — aujourd'hui `Button`, `LinkLabel` et `TrackBar`.
  `TextBox:hover` est une erreur accompagnée d'une explication, pas un rien silencieux.
- **Pas de cascade, pas de spécificité, pas de `!important`.** Les déclarations ultérieures remplacent
  les précédentes. Pas d'`@import`, pas d'`@media` — enregistrez deux thèmes et choisissez-en un dans le
  code.
- **La disposition n'est pas thémable.** Couleurs, bordures, rayons (par coin), bordures en pointillés,
  `box-shadow` à décalage dur et polices le sont ; `margin`/`padding` sont des erreurs — définissez-les
  dans le code.
- **L'alpha hexadécimal vient en dernier** (`#rrggbbaa`), à l'inverse du `#AARRGGBB` du format XML.

### Theme Studio, et laisser un assistant écrire le thème
{:#appendix-d-studio}

`samples/ThemeStudio` (dans le dépôt, avec des binaires précompilés joints aux releases GitHub) est un
éditeur en direct : le CSS à gauche, chaque contrôle thémable à droite, les diagnostics de l'analyseur en
dessous, réappliqués au fil de la frappe — y compris à la propre fenêtre du Studio. Ouvrez un fichier et
il est **surveillé**, vous pouvez donc le modifier dans votre propre éditeur ou laisser un assistant de
codage le modifier. Son bouton **Copy reference for AI** place la référence complète
jetons/sélecteurs/propriétés dans le presse-papiers ; collez-la dans une conversation avec « un thème
clair chaleureux à fort contraste avec des boutons arrondis » et collez la réponse en retour. Si
l'analyseur proteste, recollez le texte de l'erreur à l'assistant — chaque message nomme le texte fautif
et l'alternative. `--render-headless out.png theme.css` rend l'aperçu sans affichage et se termine avec
un code non nul en cas d'erreur, ce qui fait d'un fichier de thème quelque chose que la CI peut vérifier.
Six points de départ sont livrés dans `samples/ThemeStudio/Themes/` : `light`/`dark` (une paire
assortie), `ocean`, `graphite`, `paper`, `parchment`.

### Diagnostics depuis le code
{:#appendix-d-diagnostics}

Pour un thème fourni par vos utilisateurs, analysez-le vous-même et affichez les problèmes plutôt que
de l'appliquer à l'aveugle :

**C#**

```csharp
var sheet = ThemeStyleSheet.Parse (File.ReadAllText (path));

foreach (var d in sheet.Diagnostics)
    log.WriteLine ($"{d.Severity} ({d.Line}:{d.Column}): {d.Message}");
```

**VB.NET**

```vb
Dim sheet = ThemeStyleSheet.Parse(File.ReadAllText(path))

For Each d In sheet.Diagnostics
    log.WriteLine($"{d.Severity} ({d.Line}:{d.Column}): {d.Message}")
Next
```

### Une seule feuille, trois toolkits
{:#appendix-d-hosts}

Dans une application en migration mixte, le même fichier peut aussi restyler l'*autre* moitié :
`Majorsilence.Forms.Theming.WinForms` l'applique à de vrais contrôles `System.Windows.Forms`
([module 7](#module-7-c)) et `Majorsilence.Forms.Theming.Avalonia` aux contrôles Fluent natifs d'Avalonia
(`AvaloniaCssTheme.Apply` / `Watch`), chacun avec une matrice de prise en charge documentée et chaque
lacune signalée par un diagnostic. C'est la réponse au « ça va ressembler à deux applications agrafées
ensemble » pendant une longue migration.

**Exercice D.** Exportez le thème Light (`Theme.ExportCss`), changez trois jetons et une règle `Button`,
et chargez-le au démarrage. Puis écrivez délibérément `TextBox:hover { color: red; }` et lisez l'erreur
que l'analyseur vous donne — c'est toute la philosophie de ce coin du framework en un seul message.

---

## Annexe E — Helpers MVVM
{:#appendix-e}

**Objectif :** vous pouvez câbler un view-model à un formulaire sans réflexion, d'une manière sûre sous
trimming et NativeAOT, et vous savez quand *ne pas* l'utiliser.

Les équipes WinForms qui passent à une bibliothèque UI partagée profitent souvent de l'occasion pour
séparer les view-models des formulaires. `Control.DataBindings` fonctionne ici et est bidirectionnel —
mais il repose sur la réflexion, ce qui veut dire enraciner vos propriétés de view-model pour le
trimmer. `Majorsilence.Forms.Mvvm` est l'alternative : un petit ensemble de méthodes d'extension sur
`INotifyPropertyChanged` et `ICommand` qui nomment la propriété avec `nameof` et la lisent et l'écrivent
via des lambdas, de sorte que rien n'est recherché par chaîne à l'exécution. Il n'a aucune dépendance
envers un toolkit et fonctionne avec n'importe quel view-model, y compris un écrit avec
CommunityToolkit.Mvvm. (Vérifié par rapport à
[`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md) et au `MvvmHelpersPanel` de la galerie,
pas exécuté pour ce guide.)

### Les quatre helpers
{:#appendix-e-helpers}

**C#**

```csharp
using Majorsilence.Forms.Mvvm;

var scope = new BindingScope ();                        // collecte chaque abonnement que cette page effectue

// Unidirectionnel : appliquer maintenant, puis à chaque PropertyChanged pour cette propriété.
viewModel.Observe (nameof (CounterViewModel.Count), vm => vm.Count,
                   count => countLabel.Text = $"Count: {count}").AddTo (scope);

// Bidirectionnel : TextBox.Text <-> ProfileViewModel.Name (aussi BindChecked, BindSelectedIndex, BindValue).
nameBox.BindText (viewModel, nameof (ProfileViewModel.Name),
                  vm => vm.Name, (vm, value) => vm.Name = value).AddTo (scope);

// Commandes : Enabled suit CanExecute ; Click exécute la commande. Fonctionne sur N'IMPORTE QUEL contrôle, peint sur mesure compris.
incrementButton.BindCommand (viewModel.IncrementCommand).AddTo (scope);

// Quand on quitte la page :
scope.Dispose ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Mvvm

Dim scope As New BindingScope()                          ' collecte chaque abonnement que cette page effectue

' Unidirectionnel : appliquer maintenant, puis à chaque PropertyChanged pour cette propriété.
viewModel.Observe(NameOf(CounterViewModel.Count), Function(vm) vm.Count,
                  Sub(count) countLabel.Text = $"Count: {count}").AddTo(scope)

' Bidirectionnel : TextBox.Text <-> ProfileViewModel.Name (aussi BindChecked, BindSelectedIndex, BindValue).
nameBox.BindText(viewModel, NameOf(ProfileViewModel.Name),
                 Function(vm) vm.Name, Sub(vm, value) vm.Name = value).AddTo(scope)

' Commandes : Enabled suit CanExecute ; Click exécute la commande. Fonctionne sur N'IMPORTE QUEL contrôle, peint sur mesure compris.
incrementButton.BindCommand(viewModel.IncrementCommand).AddTo(scope)

' Quand on quitte la page :
scope.Dispose()
```

### Ce que les helpers garantissent — et les deux règles
{:#appendix-e-rules}

- **Chaque poussée atterrit sur le thread UI.** Un `PropertyChanged` levé sur un thread de travail est
  posté via le dispatcher ; un levé sur le thread UI s'applique immédiatement, l'ordre est donc
  conservé. Si plusieurs changements s'accumulent en file, chaque poussée lit la valeur *courante* au
  moment où elle s'exécute, de sorte qu'un contrôle n'affiche jamais une valeur plus ancienne après une
  plus récente.
- **La liaison bidirectionnelle ne touche pas au curseur.** Le contrôle n'est écrit que lorsque sa
  valeur diffère, et pendant qu'une direction s'applique, l'autre est ignorée, les deux ne peuvent donc
  pas faire du ping-pong. La conséquence à connaître : si le view-model *réécrit* ce qu'on lui donne
  (suppression des espaces, passage en majuscules), la zone de saisie garde ce que l'utilisateur a tapé
  jusqu'à ce que le view-model lève un changement de son côté.
- **`BindCommand` désactive le contrôle pendant qu'une commande asynchrone signale qu'elle ne peut pas
  s'exécuter** — ce que l'`AsyncRelayCommand` de CommunityToolkit fait par défaut — sans code
  supplémentaire.
- **Règle 1 : ne combinez pas `BindCommand` avec `Button.Command` sur le même contrôle.** Les deux
  exécuteraient la commande, elle s'exécute donc deux fois par clic. Utilisez l'un ou l'autre.
- **Règle 2 : disposez le scope quand la page disparaît.** `BindingScope` dispose tout ce qu'il
  détient, le plus récent en premier, de sorte qu'aucune vue ne laisse fuir un gestionnaire sur un
  view-model qui lui survit. Un `PropertyChanged` avec un nom `null`/vide signifie « tout a changé » et
  rafraîchit chaque observation.

Le bidirectionnel couvre quatre contrôles aujourd'hui : `TextBox`, `CheckBox`, `ComboBox` (index
sélectionné) et `NumericUpDown` (borné à sa plage, comme le fait le contrôle lui-même). Tout le reste —
un `TrackBar`, un `DateTimePicker`, un groupe de boutons radio — c'est `Observe` dans un sens plus
l'événement propre au contrôle dans l'autre, ou `DataBindings`.

### Tester le câblage sans thread UI
{:#appendix-e-testing}

Les helpers acceptent un `IUiDispatcher` facultatif (`CheckAccess()` + `Post(Action)`). Celui par défaut
demande au backend actif si vous êtes sur le thread UI et poste via `Application.RunOnUIThread`. Dans un
test, passez un faux qui répond « pas sur le thread UI » et met en file ce qu'on lui donne — votre test
peut alors *prouver* qu'un changement en arrière-plan a été marshalé, et exécuter la file quand il le
décide. C'est un test plus fort que tout ce qu'une liaison par réflexion vous laisse écrire.

**Exercice E.** Prenez un formulaire de votre migration pilote doté d'un câblage de view-model écrit à
la main (événements en entrée, affectations de propriétés en sortie) et remplacez-le par
`Observe`/`BindText`/`BindCommand` dans un `BindingScope`. Comptez les lignes supprimées ; puis écrivez
un test avec un faux dispatcher qui prouve qu'un changement depuis un thread de travail atteint
l'étiquette.
