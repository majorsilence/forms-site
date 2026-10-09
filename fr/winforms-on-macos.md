---
layout: docs
lang: fr
title: WinForms sous macOS
subtitle: Exécuter une base de code Windows Forms sur Mac Apple Silicon et Intel — ce qui fonctionne, ce qui paraît différent, et comment livrer un .app.
permalink: /fr/winforms-on-macos/
seo_title: "Exécuter WinForms sous macOS — Windows Forms multiplateforme sur Mac"
description: >-
  Windows Forms n'a jamais fonctionné sur Mac. Comment Majorsilence.Forms exécute votre application
  WinForms nativement sur Apple Silicon et Intel — et comment livrer un bundle .app.
keywords:
  - winforms mac
  - winforms macos
  - windows forms macos
  - exécuter winforms sur mac
  - c# winforms mac
  - framework gui .net mac
  - winforms apple silicon
  - system.windows.forms macos
  - winforms mode sombre mac
priority: "0.9"
---

## Pourquoi WinForms seul n'y arrive pas
{:#why-plain-winforms-cant-do-it}

`System.Windows.Forms` vit dans le runtime Windows Desktop et enveloppe `user32.dll` et GDI+. Il
n'en existe aucune version pour macOS et il n'y en a jamais eu — un projet `net10.0-windows` ne
compile même pas sur un Mac. Les contournements habituels ne tiennent pas non plus : le portage
WinForms de Mono n'a jamais atteint le .NET moderne, `System.Drawing.Common` lève une
`PlatformNotSupportedException` hors de Windows depuis .NET 7, et faire tourner l'application dans
une VM Windows ou sous CrossOver signifie que vous livrez toujours une application Windows.

## Ce que Majorsilence.Forms fait à la place
{:#what-majorsilenceforms-does-instead}

Il réimplémente l'API WinForms sur SkiaSharp et l'héberge dans une vraie `NSWindow` via Avalonia.
Une simple compilation `net10.0` — sans TFM `-windows` — produit une application qui se lance
nativement sur les Mac **Apple Silicon (arm64) et Intel (x64)**.

```bash
dotnet new install Majorsilence.Forms.Templates
dotnet new majorsilenceforms
dotnet run --project MajorsilenceFormsApp
```

Le modèle produit une bibliothèque d'interface partagée plus une tête de bureau ; le même code
source compile sans modification sous Windows et Linux.

## Ce qui fonctionne réellement sous macOS
{:#what-actually-works-on-macos}

| Domaine | Sous macOS |
|---|---|
| Fenêtrage et entrées | `NSWindow` native via le backend Avalonia, avec les boutons « feux tricolores » standard de macOS et le déplacement/redimensionnement natifs |
| Apple Silicon | arm64 natif — `osx-arm64` et `osx-x64` sont tous deux des cibles de publication normales |
| Rendu, Retina | SkiaSharp, accéléré par le GPU et compatible HiDPI — le même code de dessin que sous Windows et Linux |
| Polices et texte | Résolus via CoreText par SkiaSharp, avec un jeu de polices de secours embarqué pour tout ce qui manque |
| Code GDI+ / `System.Drawing` | Remplacé par `Majorsilence.Forms.Drawing` — `Bitmap`, `Font`, `Pen`, `Brush`, `Region`, `Drawing2D`, `Imaging`, lecture EMF/WMF |
| Boîtes de dialogue courantes | Boîtes de dialogue natives d'ouverture/enregistrement/dossier/couleur/police via le backend |
| Impression | `PrintDocument` rend via Skia vers un PDF, à l'identique sur chaque OS |
| Contrôles WebView | Vraie `WKWebView`, y compris le rendu PDF intégré |
| Son | Joué via `afplay` |
| Stockage sécurisé et synthèse vocale | `Majorsilence.Forms.Essentials` : `SecureStorage` écrit dans Keychain Services, `Speech` utilise la voix système `say` ; les deux exposent `IsSupported` et se dégradent en no-ops plutôt que de lever une exception |
| Thèmes et mode sombre | Les thèmes sont des fichiers CSS (un sous-ensemble documenté) ; `BuiltInTheme.Default` suit l'apparence clair/sombre de l'OS, et `Theme.SetBuiltInTheme`/`Theme.ApplyTheme` basculent à l'exécution. L'exemple [Theme Studio]({{ site.github_url }}/tree/main/samples/ThemeStudio) est un éditeur CSS en direct avec aperçu, et des binaires précompilés sont joints aux GitHub Releases |
| Gestes du trackpad | `Pinch`, `Swipe`, `LongPress` et `ScrollGesture` avec inertie sont des événements de premier ordre ; `ScrollableControl` les applique déjà, donc `Panel`/`ListBox`/`TreeView` se déplacent sans aucune modification de l'application |
| Handle de fenêtre natif | Un vrai pointeur `NSWindow` via `WindowBase.PlatformHandle` (les handles par *contrôle* valent `IntPtr.Zero` partout — voir [Interopérabilité native]({{ '/fr/native-interop/' | relative_url }})) |
| Backend Uno | Également pris en charge, et vérifié démarrant et rendant un formulaire complet sous macOS, si vous préférez héberger dans Uno |
| Backend GTK 4 | Compile et s'exécute sous macOS avec le runtime GTK de Homebrew (`brew install gtk4`) — un backend pensé d'abord pour Linux, attendez-vous donc à une fenêtre GTK plutôt qu'AppKit ; utile surtout pour tester la tête GTK sur un Mac |

## Là où l'application ne fera pas très « Mac »
{:#where-it-will-feel-un-mac-like}

À connaître avant une revue de design, parce que ce sont des conséquences du modèle de compatibilité
et non des bogues :

- **La barre de menus est dans la fenêtre.** `MenuStrip` est une vraie barre ancrée en haut à
  l'intérieur du formulaire, comme WinForms la dessine — elle n'est pas projetée sur la barre de
  menus globale de macOS en haut de l'écran.
- **Les contrôles sont dessinés, pas natifs.** Un `Button` est du code de dessin Skia thématisé par
  le framework ; il correspond donc à votre application sous Windows et Linux plutôt qu'à AppKit. La
  cohérence entre plateformes et l'apparence native sur chacune sont des objectifs réellement
  opposés ; ce projet choisit le premier. Le thème CSS vous permet de vous approcher d'une palette et
  d'une typographie Mac, mais cela reste votre thème, pas celui d'AppKit.
- **Les conventions Windows voyagent avec le code.** Les raccourcis clavier, l'ordre des boutons des
  boîtes de dialogue et la sémantique de fermeture des fenêtres viennent de votre conception WinForms
  existante. Les adapter aux habitudes macOS est un travail au niveau de l'application.
- **Pas de pont UI Automation.** La prise en charge des lecteurs d'écran
  (`Majorsilence.Forms.WindowsUIAutomation`) est aujourd'hui réservée à Windows ; un pont
  `NSAccessibility` est sur la feuille de route, pas câblé. L'[arbre
  d'automatisation]({{ '/fr/automation/' | relative_url }}) indépendant du backend pilote tout de
  même les tests, Selenium et le serveur MCP sous macOS.

## Livrer un `.app`
{:#shipping-a-app}

L'empaquetage est le même que pour toute application de bureau Avalonia ou .NET — le framework
n'ajoute aucune étape supplémentaire :

```bash
dotnet publish -c Release -r osx-arm64 --self-contained
```

À partir de là, les corvées macOS habituelles s'appliquent : envelopper la sortie publiée dans une
arborescence de bundle `YourApp.app/Contents/MacOS` avec un `Info.plist` et un `.icns`, puis la
signer avec `codesign`, et la faire notariser par Apple si vous distribuez en dehors de l'App Store.
Construisez un binaire universel en publiant `osx-arm64` et `osx-x64` et en les réunissant avec
`lipo`.

## Vérifié sous macOS
{:#verified-on-macos}

L'exemple [`Explorer`]({{ '/fr/samples/' | relative_url }}) et la galerie de contrôles complète
tournent tous deux sous macOS, et la tête Uno de la galerie y a aussi été vérifiée :

![L'exemple Explorer en cours d'exécution sous macOS]({{ '/assets/img/explorer-macos.png' | relative_url }})

## Ensuite
{:#next}

- [Démarrer]({{ '/fr/getting-started/' | relative_url }}) — première application, depuis un modèle
  ou de zéro.
- [Migrer une application WinForms existante]({{ '/fr/migration/' | relative_url }}) — la
  réécriture automatisée.
- [WinForms sous Linux]({{ '/fr/winforms-on-linux/' | relative_url }}) — la même histoire sous
  Ubuntu, Fedora et Debian.
- [WinForms multiplateforme]({{ '/fr/cross-platform-winforms/' | relative_url }}) — l'architecture
  et ses compromis.
