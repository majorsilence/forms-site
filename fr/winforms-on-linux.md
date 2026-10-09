---
layout: docs
lang: fr
title: WinForms sous Linux
subtitle: Exécuter une base de code Windows Forms sous Ubuntu, Fedora, Debian et consorts — ce qui fonctionne, ce qu'il faut surveiller, et comment le livrer.
permalink: /fr/winforms-on-linux/
seo_title: "Exécuter WinForms sous Linux — Windows Forms multiplateforme"
description: >-
  Windows Forms ne tourne pas sous Linux et le portage de Mono a disparu depuis longtemps. Comment
  Majorsilence.Forms compile et exécute votre application WinForms nativement sous Ubuntu, Fedora et
  Debian — dans une fenêtre Avalonia, une vraie fenêtre GTK 4, ou un terminal.
keywords:
  - winforms linux
  - winforms sous linux
  - windows forms linux
  - exécuter winforms sur ubuntu
  - c# winforms linux
  - interface graphique .net linux
  - system.windows.forms linux
  - winforms mono linux
  - winforms gtk
  - winforms wayland
  - winforms terminal
priority: "0.9"
---

## Pourquoi WinForms seul n'y arrive pas
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` n'est livré que dans le runtime **Windows Desktop**. Sous Linux, il n'existe
aucun framework partagé `Microsoft.WindowsDesktop.App` sur lequel le résoudre ; un projet
`net10.0-windows` ne se contente donc pas d'échouer à l'exécution — `dotnet build` le refuse.
L'assembly est une enveloppe au-dessus de `user32.dll` et de GDI+, et aucun des deux n'existe ici.

Les trois choses que l'on essaie habituellement :

- **Le `System.Windows.Forms` de Mono.** Une vraie réimplémentation, et la raison pour laquelle de
  vieux fils de forum disent que cela fonctionne. Elle a été construite pour l'ère .NET Framework,
  n'a jamais été portée vers le .NET moderne, et n'est pas une cible que vous pouvez adopter
  aujourd'hui.
- **Wine.** Exécute le binaire Windows au lieu de le porter. Praticable comme solution provisoire ;
  cela signifie livrer un exécutable Windows plus un runtime de compatibilité, avec une intégration
  approximative à l'hôte.
- **`System.Drawing.Common` sous Linux.** Même pour du code de dessin sans interface, ce n'est plus
  une option : il lève une `PlatformNotSupportedException` hors de Windows depuis .NET 7, sauf à
  activer un commutateur de compatibilité désormais supprimé.

## Ce que Majorsilence.Forms fait à la place
{:#what-majorsilenceforms-does-instead}

Il réimplémente l'API WinForms au-dessus de SkiaSharp et l'héberge dans une fenêtre fournie par un
backend. Sous Linux, vous avez le choix entre trois hôtes, tous à partir du même code d'application :

- **Avalonia** (par défaut) — une application X11 normale : une vraie fenêtre dans votre
  gestionnaire de fenêtres, de vraies entrées, une composition GPU quand elle est disponible.
  Fonctionne sous XWayland dans les sessions Wayland.
- **GTK 4** (`Majorsilence.Forms.Gtk4`) — une vraie `Gtk.Window` via les liaisons
  [gir.core](https://github.com/gircore/gir.core), native sous Wayland et X11. Sélectionné
  explicitement ; détails [ci-dessous](#gtk4).
- **Terminal** (`Majorsilence.Forms.Terminal`) — le formulaire dessiné dans un émulateur de
  terminal, sans serveur d'affichage ; détails [ci-dessous](#terminal).

Quel que soit votre choix, il s'agit d'une simple compilation `net10.0` (ou `net8.0`) sans aucun
suffixe `-windows` nulle part.

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

C'est toute l'installation sur une machine Ubuntu standard avec le SDK .NET installé. Le modèle
produit une bibliothèque d'interface partagée plus une tête de bureau sur le backend Avalonia ; le
même code source compile et s'exécute sans modification sous Windows et macOS.

## Ce qui fonctionne réellement sous Linux
{:#what-actually-works-on-linux}

| Domaine | Sous Linux |
|---|---|
| Fenêtrage, entrées, HiDPI | Natif. Le backend Avalonia utilise X11 (XWayland dans une session Wayland). Le backend GTK 4 est natif Wayland/X11 — vérifié sous Wayland — mais utilise le facteur d'échelle entier de GTK, de sorte que les écrans en 1,25×/1,5× sont rendus en 1× et laissent pour l'instant le compositeur agrandir |
| Rendu | SkiaSharp, accéléré par le GPU — le même code de dessin que sous Windows et macOS, les contrôles sont donc identiques |
| Polices et texte | SkiaSharp résout les polices système via fontconfig ; `Majorsilence.Forms.Drawing.Common` embarque aussi un jeu de polices de secours, de sorte que le texte s'affiche même sur une image minimale sans aucune police installée |
| Code GDI+ / `System.Drawing` | Remplacé par `Majorsilence.Forms.Drawing` — `Bitmap`, `Font`, `Pen`, `Brush`, `Region`, `Drawing2D`, `Imaging`, et lecture EMF/WMF |
| Boîtes de dialogue courantes | `OpenFileDialog`, `SaveFileDialog`, `FolderBrowserDialog`, `ColorDialog`, `FontDialog` fonctionnent via les boîtes de dialogue natives du backend Avalonia. Sous GTK 4, les sélecteurs de fichiers natifs ne sont pas encore câblés ; ce sont les boîtes de dialogue de repli du framework qui apparaissent à la place |
| Impression | `PrintDocument` rend via Skia vers un PDF plutôt que vers un pilote d'impression — pareil sur chaque OS |
| Contrôles WebView | Vrai WebKitGTK sur les deux backends de bureau — via `Avalonia.Controls.WebView` sous Avalonia, et WebKitGTK 6.0 directement sous GTK 4 (`libwebkitgtk-6.0` doit être installé ; `IsWebViewFunctional` vous le dit) |
| Son | Joué via l'utilitaire de l'OS (`paplay`/`aplay`) |
| Stockage sécurisé et synthèse vocale | `Majorsilence.Forms.Essentials` : `SecureStorage` utilise le Secret Service via `secret-tool` (un démon de trousseau ou `libsecret-tools` manquant signifie `IsSupported` à false, jamais un repli en texte clair) ; `Speech` utilise `espeak`/`espeak-ng` |
| Thèmes | Les fichiers de thème CSS fonctionnent ici comme partout ailleurs ; `BuiltInTheme.Default` suit la préférence clair/sombre de l'OS |
| Handle de fenêtre natif | Un vrai `XID` X11 via `WindowBase.PlatformHandle` sous Avalonia (les handles par *contrôle* valent `IntPtr.Zero` partout — voir [Interopérabilité native]({{ '/fr/native-interop/' | relative_url }})). Sous GTK 4, `NativeControlHost` superpose un vrai `Gtk.Widget` dans votre formulaire sans problème d'« airspace », parce que GTK 4 compose tout dans un seul arbre de rendu |
| UI Automation / lecteurs d'écran | Toujours réservé à Windows (`Majorsilence.Forms.WindowsUIAutomation`) ; un pont AT-SPI est sur la feuille de route, pas câblé. La version navigateur expose bien un miroir DOM ARIA aux lecteurs d'écran. L'[arbre d'automatisation]({{ '/fr/automation/' | relative_url }}) indépendant du backend pilote quoi qu'il en soit les tests, Selenium et le serveur MCP sous Linux |
| `Majorsilence.Forms.WindowsFormsInterop`, `.WinForms`, `.Wpf` | Réservés à Windows par définition — ils hébergent de vraies fenêtres `System.Windows.Forms`/WPF, qui n'existent pas ici |

## Le backend GTK 4
{:#gtk4}

Si vous voulez une vraie fenêtre GTK plutôt qu'une fenêtre Avalonia — pour un bureau GNOME, pour du
Wayland natif, ou parce que vous avez déjà une `Gtk.Application` dans laquelle vous intégrer —
référencez le backend GTK 4 et sélectionnez-le avant `Application.Run` :

```bash
dotnet add package Majorsilence.Forms
dotnet add package Majorsilence.Forms.Gtk4
```

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // installe le backend GTK 4 (sinon Avalonia est le défaut)
Application.Run (new MainForm ());      // boucle principale GLib
```

La machine a besoin de GTK 4 lui-même : `libgtk-4-1` sous Debian/Ubuntu, `gtk4` sous Fedora/Arch.
Pour `WebBrowser` et les contrôles de compatibilité fondés sur une webview, ajoutez WebKitGTK 6.0
(`libwebkitgtk-6.0-4` sous Debian/Ubuntu, `webkitgtk6.0` sous Fedora, `webkitgtk` sous Arch).
L'intégration fonctionne dans les deux sens — `myControl.ToGtkWidget ()` / `myForm.ToGtkWindow ()`
placent du contenu Majorsilence.Forms dans une application GTK existante, et `ShowDialog` obtient une
véritable fenêtre modale avec transient-for.

Limites connues, pour l'essentiel des suppressions d'API dans GTK 4 plutôt que du travail en
attente : `Form.Location` est une indication que le gestionnaire de fenêtres peut ignorer (GTK 4 a
abandonné le positionnement côté client), `SetIcon(byte[])` est un no-op (les icônes GTK 4 sont des
noms thématisés), les sélecteurs de fichiers se replient sur les boîtes de dialogue du framework, la
mise à l'échelle est entière uniquement, et le backend n'est pas analysé pour l'AOT. Liste complète
dans la [documentation du backend GTK 4]({{ site.github_url }}/blob/main/docs/backends.md#the-gtk-4-backend).

## Le backend Terminal
{:#terminal}

`Majorsilence.Forms.Terminal` exécute le même formulaire dans un émulateur de terminal — partout où
il y a un terminal, y compris tmux/screen ou une session SSH, sans serveur d'affichage. Le
formulaire est rendu par le pipeline Skia normal et affiché en graphiques Kitty ou Sixel à la vraie
résolution en pixels du terminal quand celui-ci les prend en charge, ou en blocs Unicode
(2×4 sous-pixels par cellule) partout ailleurs ; le mode et la couleur 24 bits sont découverts en
interrogeant le terminal, et `MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` en fige un. La souris et le
clavier fonctionnent, le protocole clavier Kitty est utilisé quand il est proposé, et Ctrl+C quitte
toujours.

C'est un hôte à vue unique, comme un téléphone : le formulaire remplit le terminal, sans barre de
titre. Il a été vérifié dans xterm et WezTerm ; kitty, Ghostty, foot, iTerm2 et Windows Terminal ne
sont pas encore exercés. Les sélecteurs de fichiers natifs, `NativeControlHost` et les vues web
n'ont pas d'équivalent terminal. Voir `samples/Gallery.Terminal` et le
[README du Terminal]({{ site.github_url }}/blob/main/src/Majorsilence.Forms.Terminal/README.md).

## Notes de déploiement
{:#deployment-notes}

Rien d'exotique — c'est une application .NET ordinaire :

```bash
dotnet publish -c Release -r linux-x64 --self-contained
```

Trois choses à savoir :

- **Binaire Skia natif.** `SkiaSharp.NativeAssets.Linux` embarque `libSkiaSharp.so`, qui est lié à
  fontconfig. Les distributions de bureau l'ont déjà ; les images de conteneur allégées ont
  généralement besoin qu'on ajoute explicitement `libfontconfig1` (Debian/Ubuntu) ou `fontconfig`
  (Fedora/Alpine).
- **Runtime GTK (backend GTK 4 uniquement).** Votre installateur ou paquet doit dépendre de
  `libgtk-4-1` (Debian/Ubuntu) ou `gtk4` (Fedora/Arch), plus `libwebkitgtk-6.0-4`/`webkitgtk6.0` si
  vous utilisez `WebBrowser`. Le backend Avalonia n'a pas de telle dépendance.
- **Environnements headless (sans affichage).** Pour la CI, les serveurs et les conteneurs sans
  écran, référencez `Majorsilence.Forms.Headless` au lieu d'un backend de bureau et effectuez le
  rendu hors écran — pas de Xvfb, pas de serveur d'affichage. C'est ainsi que tourne la suite de
  tests de ce projet. Voir [Automatisation et tests d'interface]({{ '/fr/automation/' | relative_url }}).

## Vérifié sous Linux
{:#verified-on-linux}

L'exemple [`Explorer`]({{ '/fr/samples/' | relative_url }}) — un clone de l'Explorateur Windows —
tourne sous Ubuntu, la [galerie de contrôles]({{ '/fr/samples/' | relative_url }}) complète y tourne
sur le backend Avalonia, `Gallery.Gtk4` a été vérifié en rendu, en gestion des entrées et en
chargement de WebKitGTK sous Wayland, et `Gallery.Terminal` a été exécuté dans xterm et WezTerm :

![L'exemple Explorer en cours d'exécution sous Ubuntu]({{ '/assets/img/explorer-ubuntu.png' | relative_url }})

## Ensuite
{:#next}

- [Démarrer]({{ '/fr/getting-started/' | relative_url }}) — première application, depuis un modèle
  ou de zéro.
- [Migrer une application WinForms existante]({{ '/fr/migration/' | relative_url }}) — la
  réécriture automatisée, y compris l'abandon du TFM `-windows` et de la référence à
  `System.Drawing.Common`.
- [Backends de plateforme]({{ '/fr/backends/' | relative_url }}) — Avalonia, GTK 4, Terminal et les
  autres.
- [WinForms sous macOS]({{ '/fr/winforms-on-macos/' | relative_url }}) — la même histoire sur
  matériel Apple.
- [WinForms multiplateforme]({{ '/fr/cross-platform-winforms/' | relative_url }}) — l'architecture
  et ses compromis.
