---
layout: docs
lang: fr
title: WinForms multiplateforme
subtitle: Ce que signifie exécuter du code Windows Forms sous macOS et Linux, ce que cela coûte, et comment Majorsilence.Forms s'y prend.
permalink: /fr/cross-platform-winforms/
seo_title: "WinForms multiplateforme — Exécuter Windows Forms sous macOS et Linux"
description: >-
  Comment une couche de compatibilité WinForms permet d'exécuter des applications Windows Forms
  existantes sous macOS et Linux — l'architecture, ce qu'elle remplace, et ce que cela coûte.
keywords:
  - winforms multiplateforme
  - winforms linux
  - winforms mac
  - windows forms multiplateforme
  - couche de compatibilité winforms
  - winforms cross platform
  - alternative à winforms
  - system.windows.forms linux
  - interface graphique .net multiplateforme
  - winforms gtk
  - winforms terminal
priority: "0.9"
changefreq: weekly
---

**Windows Forms est réservé à Windows, et l'a toujours été.** `System.Windows.Forms` est une
enveloppe managée au-dessus des classes de fenêtres Win32 et de GDI+ — des `HWND`, `WM_PAINT`,
`user32.dll`. .NET lui-même fonctionne partout, mais cet assembly n'est livré que dans le runtime
Windows Desktop : une application WinForms ne peut donc ni être compilée ni être lancée sous macOS
ou Linux. C'est là tout le problème, et c'est pourquoi « rendre notre application WinForms
multiplateforme » a historiquement signifié « la réécrire ».

Majorsilence.Forms prend l'autre chemin : **réimplémenter le modèle de programmation WinForms sur un
moteur de rendu multiplateforme.** Mêmes noms de classes, mêmes propriétés, mêmes événements, même
code généré par le concepteur — mais rien en dessous n'est du Win32.

```csharp
using Majorsilence.Forms;   // à la place de System.Windows.Forms

public class MainForm : Form
{
    public MainForm ()
    {
        var button = new Button { Text = "Click me", Location = new Point (12, 12) };
        button.Click += (s, e) => MessageBox.Show ("Hello from Linux.");
        Controls.Add (button);
    }
}
```

Ce fichier compile et s'exécute sous Windows, macOS et Linux à partir d'une seule compilation
`net10.0` (ou `net8.0`). Pas de TFM `-windows`, pas de runtime Windows Desktop, pas de Wine. La
bibliothèque de base est aussi livrée en `netstandard2.0`, ce qui permet à une application
.NET Framework 4.8 sous Windows de l'héberger elle aussi.

## Comment fonctionne réellement une couche de compatibilité WinForms
{:#how-a-winforms-compatibility-layer-actually-works}

Il existe trois approches pour porter du code WinForms sur une autre plateforme, et elles se
comportent très différemment :

| Approche | Ce que c'est | Compromis |
|---|---|---|
| **Émulation** (Wine, l'ancien `System.Windows.Forms` de Mono) | Réimplémenter Win32/GDI+ sous l'assembly WinForms *non modifié* | Zéro changement de code source, mais vous héritez d'une énorme surface Win32, d'un comportement non natif, et d'un support qui s'arrête dès que votre application touche quelque chose de non implémenté |
| **Réécriture** (WPF, .NET MAUI, Avalonia, le web) | Réexprimer l'interface dans un autre paradigme | Un résultat réellement moderne, au prix de la reconstruction de chaque écran et de la reformation de l'équipe |
| **Réimplémentation compatible au niveau de l'API** (Majorsilence.Forms) | Reconstruire l'*API* WinForms sur un moteur de rendu portable | Compatibilité au niveau du code source moyennant un changement mécanique de namespace ; vous renoncez aux portes de sortie Win32 comme `Control.Handle` et `WndProc` |

Majorsilence.Forms est la troisième. Chaque contrôle est dessiné par le framework lui-même avec
[SkiaSharp](https://github.com/mono/SkiaSharp) — le même moteur 2D accéléré par le GPU qui se trouve
derrière Chrome et Flutter — si bien qu'un `Button` a exactement le même aspect et le même
comportement sur les trois bureaux, parce que c'est littéralement le même code de dessin sur les
trois.

## L'architecture en un schéma
{:#the-architecture-in-one-diagram}

<div class="msf-diagram">        Votre application  (formulaires, contrôles, fichiers Designer — le modèle WinForms que vous connaissez)
            │
       Majorsilence.Forms  (contrôles + API compatible WinForms, dessinés avec SkiaSharp)
            │
   Backend hôte interchangeable
   ├─ Avalonia   → Windows · macOS · Linux  (par défaut)  · aussi Android · iOS · navigateur
   ├─ Uno         → bureau · iOS · Android · WebAssembly
   ├─ GTK 4       → vraie fenêtre GTK, Linux d'abord (gir.core), aussi Windows/macOS avec le runtime GTK
   ├─ Terminal    → le formulaire dessiné dans un terminal (graphiques Kitty, Sixel ou blocs Unicode)
   ├─ WinForms    → pont de migration Windows uniquement : intégrez dans une application WinForms existante, portez par étapes
   ├─ WPF         → pont de migration Windows uniquement, même principe, pour une application WPF existante
   └─ Headless    → rendu hors écran pour les tests / la CI</div>

L'assembly de base `Majorsilence.Forms` ne référence **aucune boîte à outils de fenêtrage** —
uniquement SkiaSharp. Le seul travail d'un backend est de créer une fenêtre native (ou un terminal,
ou rien du tout), de faire tourner une boucle de messages, de transmettre les entrées et de
présenter une surface Skia. Cette couture (la frontière backend) est la raison pour laquelle le même
binaire d'application peut viser Avalonia sur le bureau aujourd'hui et GTK 4, Uno ou WebAssembly
demain — et pour laquelle une application Windows peut héberger exactement les mêmes contrôles dans
ses fenêtres WinForms ou WPF existantes pendant sa migration. Voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }}) pour les interfaces et la façon
d'ajouter le vôtre.

## Ce que vous obtenez sur chaque plateforme
{:#what-you-get-on-each-platform}

| Plateforme | État | Hôte |
|---|---|---|
| Windows | Pris en charge, prêt à l'emploi | Avalonia (par défaut), Uno, ou GTK 4 avec le runtime GTK installé |
| Windows, à l'intérieur d'une application WinForms ou WPF existante | Pris en charge — migration incrémentale, un contrôle à la fois ; s'héberge aussi depuis **.NET Framework 4.8** (`net48`) | `Majorsilence.Forms.WinForms` / `Majorsilence.Forms.Wpf` |
| macOS (Intel et Apple Silicon) | Pris en charge, prêt à l'emploi — voir [WinForms sous macOS]({{ '/fr/winforms-on-macos/' | relative_url }}) | Avalonia (par défaut), Uno, ou GTK 4 via Homebrew |
| Linux (X11 / Wayland) | Pris en charge, prêt à l'emploi — voir [WinForms sous Linux]({{ '/fr/winforms-on-linux/' | relative_url }}) | Avalonia (par défaut, X11), GTK 4 (Wayland/X11 natif, vérifié sous Wayland), ou Uno |
| Terminal | Fonctionnel, jeune — vérifié dans xterm et WezTerm | `Majorsilence.Forms.Terminal` : le formulaire remplit le terminal, dessiné en graphiques Kitty, Sixel ou blocs Unicode |
| WebAssembly / navigateur | Fonctionnel, jeune — [essayez la galerie en ligne]({{ '/gallery/' | relative_url }}) ; les lecteurs d'écran voient un miroir DOM ARIA de l'interface | Avalonia Browser ou Uno Wasm |
| Android | Précoce — première passe sur appareil réel effectuée (démarrage, appuis, mise à l'échelle du rendu, défilement tactile confirmés sur matériel) ; clavier, zone sûre et rotation testés unitairement seulement | Avalonia Android ou Uno |
| iOS | Précoce — la CI compile la vraie tête et la lance dans un simulateur pour un test de fumée, mais personne ne l'a encore utilisée de manière interactive | Avalonia iOS ou Uno |
| Headless / CI | Pris en charge | Backend Headless, Skia hors écran |

## Les API réservées à Windows qu'un portage doit remplacer
{:#the-windows-only-apis-a-port-has-to-replace}

Rendre les contrôles portables n'est que la moitié du travail. Une vraie application WinForms
s'appuie aussi sur d'autres piles réservées à Windows, et chacune a ici sa réponse multiplateforme :

- **`System.Drawing.Common` (GDI+)** est réservé à Windows depuis .NET 7.
  `Majorsilence.Forms.Drawing.Common` en est une réimplémentation basée sur Skia — `Bitmap`, `Font`,
  `Pen`, `Brush`, `Icon`, `Region`, `StringFormat`, `Drawing2D`, `Imaging`, et même la lecture des
  métafichiers EMF/WMF. Les types valeur (`Color`, `Point`, `Size`, `Rectangle`) ne sont
  délibérément *pas* réimplémentés ; ce sont les vrais types déjà portables de
  `System.Drawing.Primitives` qui sont utilisés, de sorte qu'ils interopèrent avec tout le reste
  de .NET.
- **L'impression** passe par `Majorsilence.Forms.Printing.PrintDocument`, qui rend les pages avec
  le même pipeline Skia et produit un PDF au lieu de dialoguer avec un pilote d'impression du
  système. C'est un substitut indépendant de la plateforme par conception, pas une lacune par OS
  restée inachevée.
- **Styles visuels (uxtheme).** WinForms emprunte son apparence au moteur de thèmes de l'OS via
  `Application.EnableVisualStyles()` ; ici cet appel est un no-op (sans effet), et l'apparence vient
  du thème propre au framework. Les thèmes sont de simples fichiers CSS — un sous-ensemble documenté
  avec des jetons pour les couleurs et les polices plus des règles par contrôle — si bien qu'une
  seule feuille habille l'application à l'identique sur chaque OS, et le thème intégré `Default`
  suit la préférence clair/sombre de l'OS. Voir
  [Thèmes avec CSS]({{ site.github_url }}/blob/main/docs/theming.md).

## Ce que cela coûte
{:#what-it-costs}

Être honnête sur le compromis est plus utile qu'une liste de fonctionnalités :

- **`Control.Handle` vaut `IntPtr.Zero`.** Ici, un contrôle est un ensemble d'opérations de dessin
  sur un canevas, pas une fenêtre de l'OS ; il n'y a donc aucun `HWND` à fournir et le framework
  refuse d'en inventer un. Les handles au niveau de la fenêtre, eux, *sont* réels
  (`HWND`/`NSWindow`/`XID`, et un vrai HWND sur le backend WinForms). Voir
  [Interopérabilité native]({{ '/fr/native-interop/' | relative_url }}).
- **Pas de `WndProc`, pas de P/Invoke Win32 contre les contrôles.** Les astuces fondées sur les
  messages doivent être réécrites contre de vraies API.
- **Les boîtes de dialogue bloquantes n'existent pas dans un navigateur ni sur un téléphone.** Sur
  les cibles navigateur, Android et iOS, l'hôte n'a pas de boucle de messages imbriquée ;
  `Form.ShowDialog`, `MessageBox.Show` et les sélecteurs de fichiers lèvent donc une
  `PlatformNotSupportedException` — en nommant le jumeau asynchrone — avant d'afficher quoi que ce
  soit. `ShowDialogAsync`, `MessageBox.ShowAsync` et consorts fonctionnent partout, et un analyseur
  Roslyn livré dans le paquet de base (`MFB001`–`MFB003`, avec correctifs de code) signale les
  appels bloquants sur ces cibles. Les applications de bureau peuvent conserver leurs appels
  bloquants.
- **Les coordonnées sont des unités logiques, pas des pixels physiques.** `Width`, `Bounds`,
  `ClientRectangle`, les positions de la souris et le canevas de dessin sont tous en unités
  logiques ; le framework fait la mise à l'échelle vers l'écran. Les contrôles à dessin personnalisé
  qui appliquaient leur propre `ScaleTransform` selon le facteur DPI doivent l'abandonner, et les
  pixels physiques restent accessibles via `ScaledBounds`, `PaintEventArgs.Scaling` et
  `LogicalToDeviceUnits`.
- **La couverture n'est pas de 100 %.** Le projet est en bêta. Les membres non implémentés sont
  délibérément des no-ops ou renvoient une valeur par défaut raisonnable au lieu de lever une
  exception, de sorte que le code migré compile *et s'exécute* — ce qui signifie aussi qu'une lacune
  peut être silencieuse. La
  [matrice de compatibilité]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) suit ce qui
  est réel, ce qui est approximé et ce qui est hors périmètre, contrôle par contrôle.
- **Un rendu identique au pixel près avec le WinForms natif n'est pas un objectif.** Les contrôles
  sont thématisés et dessinés par Skia ; ils ont un aspect cohérent d'une plateforme à l'autre
  plutôt que de reproduire les widgets natifs de chaque OS. Une exception délibérée : une
  application portée qui choisit sa police avec `Application.SetDefaultFont` — comme le fait une
  application WinForms — obtient des boutons poussoirs et des glyphes de cases à cocher/boutons
  radio dessinés comme WinForms les dessine sous le thème Windows 11, de sorte qu'une migration
  côte à côte ne ressemble pas à deux produits.

## Pour aller plus loin
{:#where-to-go-next}

- **[Démarrer]({{ '/fr/getting-started/' | relative_url }})** — une application qui tourne en
  quelques minutes.
- **[Migrer une application WinForms existante]({{ '/fr/migration/' | relative_url }})** — la CLI
  `majorsilence-migrate` effectue la réécriture mécanique pour vous.
- **[Comparatif des alternatives à WinForms]({{ '/fr/winforms-alternatives/' | relative_url }})** —
  en quoi ceci diffère de .NET MAUI, Avalonia, Uno Platform, Eto.Forms et Wine.
- **[FAQ]({{ '/fr/faq/' | relative_url }})** — des réponses courtes aux questions qui viennent en
  premier.
