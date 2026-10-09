---
layout: docs
lang: fr
title: Exemples
subtitle: De vraies applications construites avec Majorsilence.Forms, présentes dans le dépôt aujourd'hui.
permalink: /fr/samples/
seo_title: "Exemples et applications de démonstration WinForms multiplateformes"
description: >-
  De vraies applications WinForms multiplateformes que vous pouvez exécuter : un clone de l'Explorateur
  Windows, un clone d'Outlook, une application de point de vente client/serveur, un studio de thèmes
  CSS en direct et la galerie de contrôles complète sur le bureau, GTK 4, dans le navigateur, sur
  mobile et même dans un terminal.
keywords:
  - exemples winforms
  - winforms multiplateforme exemple
  - démo winforms c# linux macos
  - galerie de contrôles winforms
  - thème css winforms
  - exemple point de vente winforms
  - winforms gtk 4
  - winforms interface terminal
priority: "0.8"
---

Chaque exemple se trouve sous [`samples/`]({{ site.github_url }}/tree/main/samples) dans le dépôt.
Sauf mention contraire, chacun s'exécute avec `dotnet run --project samples/<Name>` et ne nécessite que
le SDK .NET 10.

| Exemple | Ce qu'il montre | Plateformes |
|---|---|---|
| [`ControlGallery`](#controlgallery) | Tous les contrôles intégrés (une bibliothèque — voir les têtes d'application ci-dessous) | — |
| [`Gallery.Avalonia`](#galleryavalonia) | La galerie sur le backend par défaut, y compris le rendu headless | Windows, macOS, Linux |
| [`Gallery.Uno`](#galleryuno) | La même galerie sur le backend Uno | Bureau (vérifié sous macOS) |
| [`Gallery.Gtk4`](#gallerygtk4) | La même galerie sur le backend GTK 4 (gir.core) | Bureau avec GTK 4 (vérifié sous Wayland) |
| [`Gallery.Wasm`](#gallerywasm) | La même galerie dans le navigateur | WebAssembly |
| [`Gallery.Android`](#galleryandroid) | La même galerie sur Android | Android |
| [`Gallery.iOS`](#galleryios) | La même galerie sur iOS | iOS |
| [`Gallery.Terminal`](#galleryterminal) | La même galerie dans un terminal | Console / terminaux ANSI |
| [`Gallery.Wpf`](#gallerywpf) | La même galerie sur le backend WPF | Windows |
| [`Explorer`](#explorer) | Un clone de l'Explorateur Windows | Windows, macOS, Linux |
| [`Outlaw`](#outlaw) | Un clone d'Outlook | Windows, macOS, Linux |
| [`PointOfSale`](#pointofsale) | Une application métier client/serveur complète | Windows, macOS, Linux |
| [`ThemeStudio`](#themestudio) | Éditeur de thèmes CSS en direct avec aperçu | Windows, macOS, Linux |
| [`ThemeStudio.WinForms`](#themestudiowinforms) | Le même Studio face à de vrais contrôles `System.Windows.Forms` | Windows |
| [`EmbeddingAvalonia` / `EmbeddingUno` / `EmbeddingWinForms` / `EmbeddingGtk4`](#embedding) | Majorsilence.Forms hébergé *à l'intérieur* d'une application native | Bureau (WinForms : Windows uniquement ; Gtk4 : nécessite GTK 4) |
| [`WinFormsInterop`](#winformsinterop) | Interopérabilité bidirectionnelle avec `System.Windows.Forms` | Windows |
| [`WinFormsCompatDemo`](#winformscompatdemo) | Espace de noms `System.Windows.Forms` généré par source, sans véritable assembly WinForms | Windows, macOS, Linux |
| [`AutomationTarget`](#automationtarget) | Une application qui expose son propre point de terminaison d'automatisation | Windows, macOS, Linux |

Vous n'avez pas besoin de compiler vous-même les têtes de galerie pour les essayer. La CI publie le bundle
navigateur (`gallery-wasm`), un APK + AAB Android installable manuellement (`gallery-android`, signé avec la
clé de débogage .NET Android — convenable pour le sideloading, pas pour le Play Store), une `.app` zippée pour
le simulateur iOS (`gallery-ios` ; il n'existe pas de `.ipa` signé pour appareil) et des binaires ThemeStudio
autonomes pour Windows, Linux et macOS, et les attache tous à chaque [GitHub Release]({{ site.github_url }}/releases).

## ControlGallery
{:#controlgallery}

Tous les contrôles intégrés, en direct, un panneau de démonstration par contrôle. `ControlGallery` est
lui-même une **bibliothèque** indépendante du backend — le `MainForm` partagé et les panneaux de
démonstration — qui ne référence aucun backend ; chaque backend reçoit donc une tête d'application légère
qui l'héberge sans entraîner les dépendances des autres backends dans le processus. Lancez l'une des têtes
`Gallery.*` ci-dessous.

## Gallery.Avalonia
{:#galleryavalonia}

La tête bureau, sur le backend par défaut (Avalonia) :

```
dotnet run --project samples/Gallery.Avalonia
```

Elle effectue aussi un rendu headless, utile pour la CI et les comparaisons pixel à pixel :

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

## Gallery.Uno
{:#galleryuno}

La même galerie de contrôles sur le backend **Uno** — avec une portée bureau, iOS, Android et WebAssembly.

```
dotnet run --project samples/Gallery.Uno
```

Elle nécessite une session de fenêtrage et ne fait donc pas partie du build CI headless ; ses paquets Uno
se restaurent depuis nuget.org via le `nuget.config` propre à l'exemple. Vérifié : lancement et rendu de la
galerie complète sous macOS.

## Gallery.Gtk4
{:#gallerygtk4}

La même galerie sur le backend **GTK 4** (gir.core) — une vraie `Gtk.Window`, pensée d'abord pour Linux.

```
dotnet run --project samples/Gallery.Gtk4                    # ControlGallery complète
MF_GTK4_DEMO=1 dotnet run --project samples/Gallery.Gtk4     # petit formulaire de test du rendu et de la saisie
MF_GTK4_WEBVIEW=1 dotnet run --project samples/Gallery.Gtk4  # un WebBrowser sur WebKitGTK 6.0
```

Elle nécessite une session d'affichage (X11/Wayland) et les bibliothèques natives GTK 4 (le formulaire webview
nécessite en plus `libwebkitgtk-6.0`), et ne fait donc pas partie du build CI headless. Ses paquets `GirCore.*`
se restaurent depuis nuget.org via le `nuget.config` propre à l'exemple. `MF_GTK4_SELFTEST=1` exécute une
vérification non interactive puis quitte. Vérifié : lancement et rendu de la galerie complète sous Wayland. Voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }}) pour ce que le backend GTK 4 fait et ne fait pas encore.

## Gallery.Wasm
{:#gallerywasm}

La même galerie de contrôles, cette fois dans le navigateur, sur la cible `net10.0-browser` du backend
Avalonia — **[essayez-la en direct]({{ '/gallery/' | relative_url }})**, sans rien installer.
C'est le vrai framework compilé en WebAssembly, le premier chargement télécharge donc le runtime .NET.

Pour la compiler vous-même, il vous faut une fois le workload wasm-tools :

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

Servez ensuite `out/wwwroot` avec n'importe quel serveur de fichiers statiques et ouvrez `index.html` — les
projets du SDK WebAssembly ne sont pas servis par `dotnet run` comme l'est un exécutable ordinaire. Ou
passez-vous de la chaîne d'outils : le bundle `gallery-wasm` que la CI construit à chaque PR est attaché à
chaque GitHub Release. Voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }}#running-in-the-browser-webassembly)
pour les détails de compilation et les limites actuelles.

> **Lacune connue :** les icônes de la galerie ne s'affichent pas dans le navigateur (ni sur Android ou iOS) —
> l'élément `WasmFilesToIncludeInFileSystem` censé les précharger est silencieusement ignoré par le SDK
> WebAssembly, si bien que `Bitmap(string)` se dégrade en un substitut de 1×1. L'application démarre
> proprement, avec des icônes invisibles.

La tête navigateur porte aussi les **vérifications de la tête navigateur** : ouvrez le bundle publié avec
`?check=<name>` et la page exécute une vérification au lieu de la galerie — les appels modaux bloquants (qui
lèvent une exception dans le navigateur en nommant leur jumeau asynchrone), leurs formes attendables
(awaitable), une vérification du DOM d'accessibilité et quatre vérifications de rendu — en écrivant des
lignes `MFCHECK` dans la console. `tools/modal-check.mjs` les exécute toutes dans Chrome headless et la CI
le lance avec `--expect` dans le job `wasm` ; le même formulaire est relié aux têtes Android et iOS, chacune
avec son propre `tools/modal-check.sh`. Les noms, variables d'environnement et résultats attendus sont tous
dans [`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md#gallerywasm) dans le dépôt.

## Gallery.Android (Android uniquement, travail en cours)
{:#galleryandroid}

Le même `MainForm` de `ControlGallery`, sur la cible Android du backend Avalonia, hébergé par une seule
Activity. Nécessite le workload `android` :

```
dotnet workload install android
dotnet build samples/Gallery.Android -t:Run
```

Une fois le workload installé, `Directory.Build.props` le détecte et fait passer automatiquement ce projet de
son build stub à la vraie tête `net10.0-android` — un simple `dotnet build` / `dotnet test` à la racine du
dépôt n'a donc jamais besoin du workload, et Visual Studio fonctionne tel quel avec F5 sur un émulateur.
Passez `-p:EnableAndroidTarget=true` pour le forcer ; celui-ci n'est pas conditionné, un workload manquant
fait donc échouer le build au lieu de revenir silencieusement au stub.

> La prise en charge d'Android est à ses débuts. Elle a connu une première passe sur appareil réel — la galerie
> démarre (un plantage au démarrage lié au thème AppCompat y a été trouvé et corrigé), et la détection des
> touchers, la mise à l'échelle du rendu et le défilement/balayage tactile sont confirmés sur matériel — mais le
> clavier à l'écran, les marges de zone sûre (safe area), la rotation et la couverture complète des contrôles
> n'ont pas reçu les mêmes tests que les backends bureau et navigateur. Attendez-vous à des aspérités.

La CI publie un APK + AAB installable manuellement à chaque PR (artefact `gallery-android`) et les attache à
chaque GitHub Release. Android partage l'hôte à vue unique du navigateur, les mêmes limites s'appliquent donc
au chrome de fenêtre et au WebView — voir [Backends de plateforme]({{ '/fr/backends/' | relative_url }}).

## Gallery.iOS (iOS uniquement, non vérifié)
{:#galleryios}

L'équivalent iOS, hébergé par un seul `UIViewController`. Nécessite un Mac avec le workload `ios` :

```
dotnet workload install ios
dotnet build samples/Gallery.iOS -t:Run
```

Comme pour `Gallery.Android`, `Directory.Build.props` fait passer automatiquement ce projet d'un stub à la
vraie tête `net10.0-ios` dès qu'un workload mobile est présent — mais uniquement sous macOS, puisque le
workload `ios` n'existe nulle part ailleurs. Forcez-le avec `-p:EnableIOSTarget=true` ; préférez-le au
parapluie `EnableMobileHeads`, qui, sur un Mac sans le workload `android`, demanderait aussi la ligne
`net10.0-android` et échouerait.

> iOS est le backend le moins éprouvé : il a été écrit à partir de la surface d'API d'Avalonia.iOS et des
> conventions standard de .NET pour iOS. Le job `ios` de la CI (sur `macos-latest`) compile désormais la
> vraie tête et la lance dans un simulateur comme test de fumée — mais le job est toujours en
> `continue-on-error`, et personne ne l'a exécuté de manière interactive sur un appareil. Considérez les
> aspérités comme attendues, pas comme une régression.

La CI publie une `.app` zippée pour le simulateur iOS à chaque PR lorsque le build réussit (artefact
`gallery-ios`) et l'attache à chaque GitHub Release. Il n'existe pas de `.ipa` signé pour appareil — cela
nécessite un certificat de distribution Apple.

## Gallery.Terminal
{:#galleryterminal}

La même galerie sur le backend **Terminal** : le formulaire remplit le terminal, sans barre de titre, comme
il remplirait l'écran d'un téléphone. Skia effectue le rendu hors écran, affiché en graphiques Kitty ou en
Sixel à la résolution réelle en pixels du terminal lorsque celui-ci les propose, sinon en éléments de bloc
Unicode.

```
dotnet run --project samples/Gallery.Terminal                       # ControlGallery complète
MF_TERMINAL_DEMO=1 dotnet run --project samples/Gallery.Terminal    # un petit formulaire de test à la place
```

Lancez-la dans un terminal truecolor. Le mode de sortie est déterminé en interrogeant le terminal ;
`MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` en force un, et `MF_TERMINAL_SCALE=0.5` dispose le
formulaire sur un canevas deux fois plus grand que la grille de pixels (utile en mode demi-bloc classique).
La souris et le clavier fonctionnent ; Ctrl+C quitte toujours. Vérifié dans xterm et WezTerm jusqu'ici. Voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }}) pour les limites du backend (pas de sélecteurs
natifs, de `NativeControlHost` ni de vue web).

## Gallery.Wpf (Windows uniquement)
{:#gallerywpf}

La même galerie sur le backend **WPF** — une vraie `Window` WPF, Skia présenté à travers un
`WriteableBitmap`. WPF n'est pas le backend par défaut résolu automatiquement, la tête l'installe donc
explicitement avant la première fenêtre (`Platform.Backend = new WpfPlatformBackend ();`).

```
dotnet run --project samples/Gallery.Wpf
```

Comme le backend WinForms, c'est un backend de *migration* réservé à Windows — voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }}).

## Explorer
{:#explorer}

Un clone de l'Explorateur Windows — navigation dans les fichiers, arborescence et vues en liste qui
sollicitent le jeu de contrôles de base de bout en bout. Le projet se trouve dans `samples/Explorer` et
s'appelle `Explore.csproj`.

```
dotnet run --project samples/Explorer
```

Vérifié en fonctionnement sous Windows, Ubuntu et macOS.

## Outlaw
{:#outlaw}

Un clone de Microsoft Outlook, qui montre Majorsilence.Forms tenant une application réelle, complexe et à
plusieurs volets, plutôt qu'une démonstration jouet.

```
dotnet run --project samples/Outlaw
```

## PointOfSale
{:#pointofsale}

Une application métier complète répartie sur quatre projets, plutôt qu'une démonstration à fenêtre unique —
la forme que prend une vraie application Majorsilence.Forms :

| Projet | Rôle |
|---|---|
| `PointOfSale.Client` | L'application bureau Majorsilence.Forms (formulaires, panneaux, contrôles personnalisés, services) |
| `PointOfSale.Api` | Une API minimale ASP.NET Core avec authentification JWT et stratégies par rôle |
| `PointOfSale.Contracts` | Les DTO partagés par les deux côtés |
| `PointOfSale.Data` | Persistance EF Core + SQLite et données initiales (couvert par `tests/PointOfSale.Data.Tests`) |

Démarrez d'abord l'API, puis le client — le client lit `ApiBaseUrl` (et ses paramètres de mode kiosque)
dans son propre `appsettings.json`, avec `http://127.0.0.1:5000` par défaut :

```
dotnet run --project samples/PointOfSale/PointOfSale.Api
dotnet run --project samples/PointOfSale/PointOfSale.Client
```

L'API crée et remplit une base locale `pos.db` au premier lancement. La clé de signature JWT par défaut dans
`appsettings.json` est un substitut, pas un secret — remplacez-la dans `appsettings.Development.json` ou
dans l'environnement. Source : [`samples/PointOfSale`]({{ site.github_url }}/tree/main/samples/PointOfSale).

## ThemeStudio
{:#themestudio}

Une application bureau pour écrire des thèmes CSS : un éditeur CSS à gauche, un exemplaire de chaque contrôle
thémable à droite, et les diagnostics de l'analyseur en dessous. Chaque modification réapplique la feuille (y
compris à la fenêtre du Studio lui-même), un fichier ouvert est surveillé sur le disque pour qu'un éditeur
externe ou un assistant de codage puisse le piloter, et **Copy reference for AI** place la référence complète
du thématisage dans le presse-papiers pour la soumettre à un assistant.

```
dotnet run --project samples/ThemeStudio                                           # partir du thème Light en CSS
dotnet run --project samples/ThemeStudio -- samples/ThemeStudio/Themes/ocean.css   # ouvrir et surveiller un thème
dotnet run --project samples/ThemeStudio -- --render-headless out.png samples/ThemeStudio/Themes/paper.css --tab 1
```

La dernière forme effectue le rendu de l'aperçu dans un PNG sans affichage (onglets : 0 saisies, 1 listes et
grilles, 2 menus et chrome, 3 nuancier des tokens, 4 Avalonia natif) et quitte avec un code non nul si le
thème contient des erreurs. L'onglet 4 héberge de vrais contrôles Avalonia thémés par la même feuille via
`Majorsilence.Forms.Theming.Avalonia`.

`samples/ThemeStudio/Themes/` fournit des thèmes d'exemple comme point de départ : `light.css` et `dark.css`
(une paire assortie partageant un même accent, pour qu'une application puisse changer de mode sans que rien
ne bouge), `ocean.css`, `graphite.css`, `paper.css` et `parchment.css`. Des binaires ThemeStudio précompilés
et autonomes pour `win-x64`, `linux-x64` et `osx-arm64` sont attachés à chaque GitHub Release. La référence
du thématisage elle-même est [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md) dans le dépôt.

## ThemeStudio.WinForms (Windows uniquement)
{:#themestudiowinforms}

La tête réservée à Windows du Theme Studio pour de **vraies applications `System.Windows.Forms`** : le même
éditeur et les mêmes diagnostics, avec un aperçu d'un exemplaire de chaque contrôle WinForms que
l'applicateur sait associer, thémé via `Majorsilence.Forms.Theming.WinForms`. La liste des diagnostics
ajoute ce que WinForms n'a pas pu exprimer (info / avertissement) à ceux de l'analyseur.

```
dotnet run --project samples/ThemeStudio.WinForms                                              # partir du thème Light en CSS
dotnet run --project samples/ThemeStudio.WinForms -- samples/ThemeStudio/Themes/graphite.css   # ouvrir et surveiller un thème
dotnet run --project samples/ThemeStudio.WinForms -- --screenshot out.png samples/ThemeStudio/Themes/graphite.css
```

`--screenshot` effectue le rendu de l'aperçu avec `Control.DrawToBitmap` — WinForms n'a pas de backend
headless, une session bureau reste donc nécessaire — et quitte avec un code non nul en cas d'erreur
d'analyse. Un build `win-x64` est attaché à chaque GitHub Release aux côtés des binaires ThemeStudio. Voir
[`docs/theming-winforms.md`]({{ site.github_url }}/blob/main/docs/theming-winforms.md).

## EmbeddingAvalonia / EmbeddingUno / EmbeddingWinForms / EmbeddingGtk4
{:#embedding}

Le sens inverse : une application Avalonia, Uno, WinForms classique ou GTK 4 ordinaire qui utilise des
contrôles et des fenêtres Majorsilence.Forms comme s'il s'agissait de ses propres éléments natifs, au lieu de
laisser Majorsilence.Forms posséder la fenêtre de premier niveau.

```
dotnet run --project samples/EmbeddingAvalonia
dotnet run --project samples/EmbeddingUno
dotnet run --project samples/EmbeddingWinForms   # Windows uniquement
dotnet run --project samples/EmbeddingGtk4       # nécessite un affichage + GTK 4
```

Chaque fenêtre place côte à côte des contrôles natifs de l'hôte et une scène Majorsilence.Forms intégrée :

- `ToAvaloniaControl()` / `ToUnoControl()` / `ToWinFormsControl()` / `ToGtkWidget()` — un contrôle
  Majorsilence hébergé comme un contrôle natif via `MajorsilenceFormsPresenter`.
- `ToAvaloniaWindow()` / `ToUnoWindow()` / `ToWinFormsForm()` / `ToGtkWindow()` — la fenêtre backend d'un
  `Form` Majorsilence rendue à l'hôte. Avalonia, WinForms et GTK 4 obtiennent une véritable boîte de dialogue
  modale au niveau de l'OS ; Uno n'a pas de notion de propriétaire dans ce backend, il obtient donc une
  fenêtre de premier niveau indépendante et `Form.ShowDialog(parent)` est le moyen d'y obtenir un
  comportement modal.
- `NativeControlHost` — un bouton natif hébergé *à l'intérieur* de la scène Majorsilence, à nouveau dans
  l'autre sens (les quatre ; sur GTK 4 il se compose proprement, sans problème d'airspace). Voir
  [Interopérabilité native]({{ '/fr/native-interop/' | relative_url }}).

`EmbeddingWinForms` thématise les deux moitiés depuis une seule feuille de style, `Themes/graphite.css`, via
`WinFormsCssTheme` (`--no-theme` pour l'apparence brute) ; `EmbeddingAvalonia` fait de même via
`AvaloniaCssTheme` (son bouton **Apply ocean.css**, ou `--theme file.css`, et `--render-headless out.png`
dessine la fenêtre hors écran puis quitte). Les versions Avalonia et Uno basculent aussi le thème de l'hôte,
pour que vous puissiez voir les contrôles Majorsilence.Forms le suivre. La version WinForms est le chemin de
migration « un contrôle à la fois » sur le backend WinForms ; la version GTK 4 exécute la boucle de son
`Gtk.Application` hôte avec le backend Gtk4 à l'intérieur (`EMBED_SELFTEST=1` pour une vérification non
interactive). Voir [Intégration dans une application hôte]({{ '/fr/backends/' | relative_url }}#embedding-in-a-host-app)
pour l'API et les différences de propriétaire/modalité entre les backends.

## WinFormsInterop (Windows uniquement)
{:#winformsinterop}

Démontre l'interopérabilité bidirectionnelle entre `System.Windows.Forms` et Majorsilence.Forms dans un
seul processus — l'exemple démarre comme un vrai hôte WinForms et chaque fenêtre Majorsilence.Forms ouverte
peut à son tour ouvrir des formulaires WinForms hérités. Il s'agit d'un pontage de formulaires entiers sur le
backend Avalonia, distinct du backend WinForms qu'utilise `EmbeddingWinForms`.

```
dotnet run --project samples/WinFormsInterop
```

Voir [`docs/winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md) pour l'API
complète.

## WinFormsCompatDemo
{:#winformscompatdemo}

À ne pas confondre avec `WinFormsInterop` : il n'y a aucun véritable assembly `System.Windows.Forms` nulle
part dans ce processus. `Form1.cs`/`Form1.Designer.cs` sont des sources ordinaires et non modifiées
générées par le designer WinForms — un `Button`, un `Label`, un `TextBox`, un appel à `MessageBox.Show(...)`
— qui compilent contre Majorsilence.Forms parce que le générateur de source Roslyn
`Majorsilence.Forms.WinFormsShims.Compat` émet un espace de noms `System.Windows.Forms` du même nom, adossé
à celui-ci, purement à la compilation. L'exemple référence le backend Avalonia pour qu'`Application.Run`
ouvre une vraie fenêtre, et pas seulement une vérification de compilation.

```
dotnet run --project samples/WinFormsCompatDemo
```

Son [`RESULTS.md`]({{ site.github_url }}/blob/main/samples/WinFormsCompatDemo/RESULTS.md) consigne ce qui
survit ou non à la traduction aujourd'hui — le formulaire généré par le designer compile sans erreur, et la
première chose qui casse est un gestionnaire typé sur un délégué autre qu'`EventHandler`, comme
`PaintEventArgs`. Voir [Migration]({{ '/fr/migration/' | relative_url }}) pour savoir où cela s'inscrit.

## AutomationTarget
{:#automationtarget}

Une application volontairement petite qui démarre un `WebDriverServer` sur elle-même, afin d'avoir quelque
chose de réel à piloter pendant l'apprentissage de l'outillage d'automatisation — depuis le serveur MCP, un
client Selenium ou un simple `curl`.

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

Elle affiche le point de terminaison et les commandes pour la piloter. `--webdriver <port>` choisit le port
(4444 par défaut) ; `--no-webdriver` l'exécute comme une application ordinaire. Chaque contrôle illustre une
chose avec laquelle un client doit composer — un contrôle qui refuse d'être cliqué, un autre qui ne devient
actif qu'une fois une case cochée, et un autre volontairement laissé sans nom — et chaque action est
journalisée à l'écran et sur stdout, pour que vous puissiez confronter les affirmations d'un client à ce que
l'application a réellement vu. Les captures d'écran sont indisponibles ici à dessein : elle tourne sur
Avalonia, et la capture d'image est le travail du backend Headless.

Voir [`samples/AutomationTarget/README.md`]({{ site.github_url }}/blob/main/samples/AutomationTarget/README.md)
pour le détail contrôle par contrôle, et [Automatisation et tests d'interface]({{ '/fr/automation/' | relative_url }})
pour l'outillage lui-même.

## Compiler depuis les sources
{:#building-from-source}

- Clonez le [dépôt]({{ site.github_url }})
- Installez le SDK .NET 10
- Ouvrez `Majorsilence.Forms.slnx` dans votre IDE, ou lancez n'importe quel exemple directement avec `dotnet run --project samples/<Name>`

`Gallery.Android` et `Gallery.iOS` sont dans la solution mais compilent comme des bibliothèques stub vides
tant que le workload correspondant n'est pas installé, si bien qu'un simple `dotnet build` / `dotnet test` à la
racine du dépôt fonctionne sans aucun workload de plateforme. Forcez une plateforme avec
`-p:EnableAndroidTarget=true` ou `-p:EnableIOSTarget=true`.

Pour les notes de compilation propres à chaque plateforme, voir
[`docs/samples.md`]({{ site.github_url }}/blob/main/docs/samples.md) dans le dépôt.
