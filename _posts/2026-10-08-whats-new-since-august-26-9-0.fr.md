---
title: "Ce qui a atterri depuis août : 26.9.0, quatre nouveaux backends, thèmes CSS et l'audit de comportement"
date: 2026-10-08 12:00:00 -0230
lang: fr
permalink: /fr/blog/2026/10/08/whats-new-since-august-26-9-0/
read_time: "7 min de lecture"
excerpt: "Sept semaines et 557 commits : hôtes GTK 4, Terminal, WinForms et WPF, prise en charge de .NET Framework 4.8, thèmes CSS, boîtes de dialogue exclusivement asynchrones sur mobile et navigateur, et un changement de peinture qui exige une action de votre part."
description: >-
  Majorsilence.Forms 26.9.0 : backends GTK 4, Terminal, WinForms et WPF, net48 et netstandard2.0,
  thèmes CSS, MVVM, l'audit de comportement et les notes de mise à niveau.
---

Le dernier billet publié ici a été écrit à partir de la version 26.0.30. Depuis le 2026-08-17, le
dépôt a reçu 557 commits et la version actuelle est **26.9.0**. Voici un tour d'horizon pour les
utilisateurs existants et ceux qui évaluent le projet : ce qui a changé, le degré de maturité de
chaque élément, et la seule chose que vous devez faire lors de la mise à niveau.

## Quatre nouveaux backends
{:#four-new-backends}

Il y avait trois hôtes — Avalonia, Uno, Headless. Il y en a maintenant sept, qui exécutent tous le
même jeu de contrôles ; la différence tient à qui crée la fenêtre et présente la surface Skia.

**GTK 4** (`Majorsilence.Forms.Gtk4`) est un hôte pensé d'abord pour Linux, construit sur gir.core :
une vraie `Gtk.Window` par formulaire, la boucle principale GLib, utilisable aussi sous Windows et
macOS avec le runtime GTK 4. Sélectionnez-le explicitement avec `Gtk4Application.Use ();` avant
`Application.Run`. L'intégration fonctionne dans les deux sens (`ToGtkWidget()`, `ToGtkWindow()`),
`NativeControlHost` n'a pas de problème d'« airspace » parce que GTK 4 compose un seul arbre de rendu,
et `WebBrowser` s'appuie sur WebKitGTK 6.0. Vérifié sous Wayland. Lacunes connues : pas de contrôle
de la position à l'écran (GTK 4 a supprimé l'API), `SetIcon(byte[])` est un no-op, les sélecteurs de
fichiers natifs renvoient un résultat vide et des boîtes de dialogue de repli sont donc utilisées,
facteur d'échelle entier uniquement, non analysé pour l'AOT.

**Terminal** (`Majorsilence.Forms.Terminal`, 2026-10-04) héberge un formulaire dans une console en
vue unique — le formulaire remplit le terminal, sans barre de titre, comme sur un téléphone. Il
utilise le protocole graphique Kitty ou Sixel à la résolution réelle en pixels lorsque c'est
disponible, sinon des caractères de bloc Unicode ; la détection se fait en interrogeant le terminal,
et `MF_TERMINAL_GRAPHICS=halfblock|kitty|sixel` fige un mode. La souris et le clavier fonctionnent ;
Ctrl+C quitte toujours. Sélectionné avec `TerminalApplication.Use (options);`. Vérifié uniquement
dans xterm et WezTerm. Pas de sélecteurs natifs, ni de `NativeControlHost`, ni de webview.

**WinForms** (`Majorsilence.Forms.WinForms`) est un backend de *migration* réservé à Windows : de
vraies fenêtres `System.Windows.Forms` sur la pompe de messages Win32, Skia présenté via un bitmap
GDI. Il existe pour que vous puissiez intégrer des contrôles Majorsilence.Forms dans une application
WinForms existante, un contrôle à la fois — `myMfControl.ToWinFormsControl()`,
`myForm.ToWinFormsForm()`, `MajorsilenceFormsPresenter` — puis basculer l'hôte vers Avalonia ou Uno
une fois que tout est porté. Pas de gestes, pas d'`IWebViewFactory`. Il est distinct de l'ancien
`WindowsFormsInterop`, qui fait le pont pour des formulaires entiers sur l'hôte Avalonia.

**WPF** (`Majorsilence.Forms.Wpf`) a la même forme et le même objectif pour les applications WPF : une
vraie `Window` WPF, une présentation par `WriteableBitmap`, `ToWpfElement()` et `ToWpfWindow()`.
Sélectionnez-le avec `Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();`.

Avalonia, WinForms et GTK 4 offrent de véritables boîtes de dialogue modales au niveau du système ;
Uno ouvre une fenêtre indépendante, utilisez donc `Form.ShowDialog(parent)` sur cet hôte.

## .NET Framework 4.8 et netstandard2.0
{:#net-framework-48-and-netstandard20}

Les paquets cœur — `Majorsilence.Forms`, `.Drawing.Common`, `.Telerik` — ciblent désormais à la fois
`net8.0`, `net10.0` **et `netstandard2.0`**, et les backends WinForms et WPF ajoutent `net48`. Une
application .NET Framework 4.8 peut donc héberger des contrôles Majorsilence.Forms sans passer d'abord
à .NET moderne, ce qui supprime un problème d'ordonnancement que beaucoup de migrations
rencontraient.

## L'audit des écarts de comportement
{:#the-behaviour-gap-audit}

Les deux plans de couverture de la surface d'API (WinForms et GDI+) sont à **zéro** : chaque membre
présent en amont est déclaré. C'était de toute façon la moitié la moins intéressante. Un membre qui
existe mais stocke une valeur que personne ne lit, ou déclenche un événement que personne ne lève,
compile votre application migrée puis ne fait discrètement rien.

Le 2026-08-25, un audit en douze domaines a donc comparé chaque domaine à l'implémentation en amont et
consigné **483 constats** où le comportement différait. Depuis, les phases 0 à 4 et la plupart des
familles de contrôles ont atterri. Éléments concrets désormais réels : la chaîne de prétraitement
`ProcessCmdKey`, un point de passage unique pour le focus et la validation, la barre de titre hors de
la zone cliente, `AutoScaleMode.Font` qui met réellement à l'échelle, la liaison de données vivante
(`CurrencyManager`, `BindingNavigator`), `ListView.View = Details`, le cycle de vie du formulaire
dans l'ordre en amont (Load → VisibleChanged → Activated, Shown posté), le réordonnancement des
colonnes de DataGridView, Ctrl+Z dans les contrôles de texte, `NotifyIcon` dans la zone de
notification, `Application.AddMessageFilter`, et la libération d'un formulaire qui libère ses
contrôles.

La surface creuse est en outre *mesurée* maintenant : des fichiers de référence figent les méthodes
no-op connues, les événements inertes et les propriétés simplement stockées, de sorte qu'en ajouter
relève d'un acte conscient et non d'un accident. La politique des stubs est inchangée — no-op ou
valeur par défaut, jamais de `NotImplementedException`.

## Unités logiques : la seule chose que vous devez faire
{:#logical-units-the-one-thing-you-must-do}

Le 2026-10-01, `ClientRectangle`, `ClientSize` et le canvas de peinture (`OnPaint`, `Paint`,
`e.ClipRectangle`, `e.Canvas`) sont passés en **unités logiques**, à l'image de
`Width`/`Height`/`Bounds` et de `MouseEventArgs`. Le framework met le canvas à l'échelle de l'affichage
pour vous.

**Si un contrôle personnalisé appelait `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`,
supprimez cet appel** — le dessin est maintenant mis à l'échelle deux fois. Les pixels physiques
restent accessibles via la famille `Scaled*` (`ScaledWidth`, `ScaledBounds`, …),
`PaintEventArgs.Scaling` et `LogicalToDeviceUnits`. La seule exception concerne les événements
owner-draw (`DrawItem`, `DrawNode`, `CellPainting`), qui vous transmettent toujours des bornes en
pixels physiques. Exécutez vos tests avec `MF_HEADLESS_SCALE=2` pour attraper tout ce qui dépend de
l'ancien comportement.

## Navigateur et mobile
{:#browser-and-mobile}

Sur `net10.0-browser`, `-android` et `-ios`, le backend Avalonia signale `CanRunModalLoop = false`,
et les appels bloquants — `Form.ShowDialog`, `MessageBox.Show`, les sélecteurs de fichiers,
`TaskDialog.ShowDialog`, `VbInteraction.MsgBox`/`InputBox`, `RadMessageBox.Show` — lèvent désormais
une `PlatformNotSupportedException` nommant leur jumeau asynchrone *avant* que quoi que ce soit ne
soit affiché, au lieu de se figer. Les formes asynchrones (`ShowDialogAsync`, `MessageBox.ShowAsync`,
`FileDialog.ShowDialogAsync`, …) fonctionnent sur tous les hôtes ; l'idiome est donc un gestionnaire
`async void` avec `await`. Un analyseur Roslyn dans le paquet cœur les repère à l'avance — `MFB001`
appel modal bloquant, `MFB002` attente synchrone sur une Task, `MFB003` `Thread.Sleep`, chacun avec un
correctif de code — actif pour les TFM navigateur ou avec `majorsilence_forms.browser_target = true`
dans `.editorconfig`.

La cible navigateur maintient aussi un **DOM d'accessibilité** à côté du canvas : un élément
transparent et traversé par les clics par contrôle, avec rôle ARIA, nom, état et bornes, construit à
partir de l'arbre d'automatisation propre au framework. Les lecteurs d'écran, la recherche dans la
page et les outils de test fondés sur le DOM peuvent désormais voir l'interface.

Sur Android et iOS, le clavier à l'écran apparaît quand une `TextBox` prend le focus,
`TextBoxBase.InputKind` choisit le type de clavier, les marges de zone sûre s'appliquent via
`Form.SafeAreaPadding`, et `WindowBase.BackRequested` gère le bouton Retour d'Android. État honnête :
Android a eu une première passe sur appareil réel (démarrage, touchers, mise à l'échelle du rendu,
défilement tactile confirmés sur matériel) ; le clavier, la zone sûre et la rotation ne sont couverts
que par des tests unitaires. La CI iOS compile la vraie tête et la lance dans un test de fumée sur
simulateur, mais personne ne l'a exécutée de manière interactive et le job est toujours en
`continue-on-error`.

Des contrôles de disposition de type téléphone sont arrivés en même temps : `StackPanel`, `Card`,
`RichListBox` (lignes multilignes à modèle) et `NavigationHost` (une pile de pages avec un bouton
Retour).

## Thèmes CSS et Theme Studio
{:#css-theming-and-theme-studio}

Les thèmes peuvent désormais s'écrire dans un sous-ensemble strict et documenté de CSS :
`@theme "Ocean" extends Dark;`, des jetons `:root` à raison d'un par propriété de `Theme`, des règles
par type de contrôle comme `Button:hover { … }`, des parties via `Type::part`. L'analyseur n'échoue
jamais en silence — `ThemeStyleSheet.Parse` collecte des diagnostics. Chargez avec
`Theme.LoadFromCssFile`, ou `Theme.RegisterThemeCssFromFile` + `Theme.ApplyTheme ("Ocean")` ; exportez
avec `Theme.ExportCss`. Chaque contrôle, y compris la couche de compatibilité Telerik, a un sélecteur,
et l'ancien XML `<Theme>` fonctionne toujours.

Deux paquets compagnons appliquent la *même* feuille à d'autres hôtes : `Majorsilence.Forms.Theming.WinForms`
restyle de vrais contrôles `System.Windows.Forms` (Windows uniquement) et `Majorsilence.Forms.Theming.Avalonia`
restyle les contrôles Fluent natifs d'Avalonia, si bien qu'un seul fichier CSS peut thémer une
application de migration mixte. `samples/ThemeStudio` est un éditeur en direct avec aperçu et
diagnostics ; des binaires précompilés sont attachés aux GitHub Releases.

## MVVM, Essentials, animation
{:#mvvm-essentials-animation}

`Majorsilence.Forms.Mvvm` est un câblage compatible trimming et AOT au-dessus d'`INotifyPropertyChanged`
et d'`ICommand`, sans réflexion ni dépendance à un toolkit : `viewModel.Observe (nameof (VM.Count), vm => vm.Count, …)`,
des liaisons bidirectionnelles `BindText`/`BindChecked`/`BindSelectedIndex`/`BindValue`, `BindCommand`,
et un `BindingScope` pour tout libérer. Il fonctionne aux côtés de CommunityToolkit.Mvvm.

`Majorsilence.Forms.Essentials` garde les capacités propres à chaque plateforme hors du cœur :
`SecureStorage`, la synthèse vocale `Speech`, `Launcher.OpenAsync` (http/https/mailto/tel/sms) et
`FileSystem.OpenAppPackageFileAsync`. Tout se dégrade en no-op ; vérifiez `IsSupported`.

`control.RequestAnimationFrame` plus `Majorsilence.Forms.Animation` (`Tween<T>`, `Easing`, `Animator`)
offrent une animation alignée sur l'affichage sous Avalonia et une horloge manuelle sous Headless.

## Outillage
{:#tooling}

- Le serveur MCP est un outil dotnet publié : `dotnet tool install -g Majorsilence.Forms.Mcp`, puis
  `claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444`. Il expose `ui_snapshot`, `ui_find`,
  `ui_click`, `ui_type`, `ui_wait_for` et `ui_screenshot`, en dialoguant avec le `WebDriverServer` de
  votre application.
- `samples/AutomationTarget` est une petite application volontairement récalcitrante (des contrôles
  qui refusent les clics, un contrôle sans nom) pour apprendre l'outillage. Les contrôles à peinture
  personnalisée publient leur valeur et leur état via `IAutomationStateProvider`.
- Le migrateur est désormais livré **uniquement** sous forme d'outil dotnet
  (`dotnet tool install -g Majorsilence.Forms.Migrator`) ; les binaires autonomes ne sont plus attachés
  aux releases. Nouvelles options : `--map`, `--dual-build`, `--strict`, `--dry-run --diff`.
- `Majorsilence.Forms.WinFormsShims.Compat` est un générateur de source à l'état de preuve de concept
  qui émet les espaces de noms `System.Windows.Forms` et `System.Drawing` adossés à Majorsilence.Forms,
  de sorte qu'un code source WinForms non modifié — y compris `Designer.cs` — compile. Destiné aux
  bibliothèques de contrôles dont l'API publique est typée sur WinForms. Statut PoC ; voir
  `samples/WinFormsCompatDemo`.

## Notes de mise à niveau
{:#upgrade-notes}

- Figez la version **26.9.0**. Le projet est toujours en bêta et n'a toujours pas de concepteur visuel.
- Supprimez tout `ScaleTransform (e.Scaling, e.Scaling)` dans votre code de peinture personnalisé
  (voir ci-dessus).
- L'identifiant du paquet de modèles est `Majorsilence.Forms.Templates`, installé avec
  `dotnet new install Majorsilence.Forms.Templates`. `dotnet new majorsilenceforms` génère désormais
  une solution avec une bibliothèque d'interface partagée et une tête bureau ; `--IncludeAndroid`,
  `--IncludeiOS` et `--IncludeWasm` ajoutent des têtes.
- Les changements cassants sont listés dans `MIGRATION.md` : `SplitContainer.Orientation`,
  `TreeViewDrawMode.OwnerDrawContent`, les types de délégués d'événements correspondent désormais à
  WinForms, et les pinceaux dégradés et hachurés ont été déplacés pour correspondre à GDI+.
- Sur navigateur, Android et iOS, remplacez les appels de boîtes de dialogue bloquants par leurs
  jumeaux asynchrones ; laissez `MFB001`–`MFB003` les trouver.

## Pour aller plus loin
{:#where-to-read-more}

- [Backends de plateforme]({{ '/fr/backends/' | relative_url }}) et
  [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md)
- [Premiers pas]({{ '/fr/getting-started/' | relative_url }}) et
  [Migration]({{ '/fr/migration/' | relative_url }}) /
  [`MIGRATION.md`]({{ site.github_url }}/blob/main/MIGRATION.md)
- [`docs/theming.md`]({{ site.github_url }}/blob/main/docs/theming.md),
  [`docs/mvvm.md`]({{ site.github_url }}/blob/main/docs/mvvm.md),
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md),
  [`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md)
- [`docs/behaviour-gap-plan.md`]({{ site.github_url }}/blob/main/docs/behaviour-gap-plan.md)
- [Automatisation]({{ '/fr/automation/' | relative_url }}) et
  [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md)
- [Exemples]({{ '/fr/samples/' | relative_url }})
