---
layout: docs
lang: fr
title: Backends de plateforme
subtitle: Un seul cœur de rendu, sept hôtes interchangeables.
seo_title: "Backends de plateforme — WinForms sur Avalonia, Uno, GTK 4, Terminal, WinForms, WPF ou Headless"
description: >-
  Comment une application WinForms multiplateforme est hébergée sur Avalonia, Uno Platform, GTK 4, un
  terminal, de vraies fenêtres WinForms ou WPF, ou une surface Skia headless — la couture backend, les
  pixels logiques, le trimming, WebAssembly, le mobile et l'intégration dans une application hôte.
keywords:
  - winforms sur avalonia
  - winforms uno platform
  - winforms gtk4 linux
  - winforms dans un terminal
  - winforms webassembly navigateur
  - backend wpf majorsilence.forms
  - backend winforms majorsilence.forms
  - rendu winforms headless
  - backend ui skiasharp
priority: "0.8"
permalink: /fr/backends/
---

Majorsilence.Forms réalise **tout son dessin lui-même** avec SkiaSharp. Chaque contrôle peint dans une
`SKSurface`/`SKCanvas` ; la boîte à outils de fenêtrage située en dessous n'est qu'un *hôte* — elle crée
les fenêtres natives, fait tourner la boucle de messages, délivre les entrées et présente la surface Skia
à l'écran.

Cet hôte est abstrait derrière une petite couture (seam), de sorte que le même code applicatif tourne sur
n'importe lequel des sept backends :

| Package | Hôte | À quoi il sert | Plateformes | Comment le sélectionner |
|---|---|---|---|---|
| `Majorsilence.Forms.Avalonia` | Avalonia 12 | Le backend par défaut. De vraies fenêtres de bureau ; aussi navigateur, Android et iOS via les packages de plateforme propres à Avalonia. Le seul backend multiplateforme avec un vrai `TryGetPlatformHandle` (HWND / NSWindow / XID). | Windows, macOS, Linux ; WebAssembly ; Android et iOS (sur activation) | Automatique — référencez le package et appelez `Application.Run (new MainForm ())`. |
| `Majorsilence.Forms.Uno` | Uno Platform Skia (Uno.WinUI 6.5) | Présente via `SKXamlCanvas` dans une tête d'application Uno. | Bureau (vérifié sous macOS) ; Uno cible aussi iOS/Android/WASM | `Platform.Backend = new UnoPlatformBackend ()` depuis le `OnLaunched` de l'application Uno. |
| `Majorsilence.Forms.Gtk4` | GTK 4 via gir.core (`GirCore.Gtk-4.0 0.8.1`) | Une vraie `Gtk.Window` par formulaire sur la boucle principale GLib. Linux d'abord. Intégration dans les deux sens, `NativeControlHost` sans problème d'airspace, `WebBrowser` via WebKitGTK 6.0. | Linux (Wayland/X11, vérifié sous Wayland) ; Windows/macOS avec GTK 4 installé | `Gtk4Application.Use ();` puis `Application.Run`. |
| `Majorsilence.Forms.Terminal` | Console / ANSI | Exécute un formulaire dans un terminal comme hôte à vue unique (le formulaire remplit l'écran, pas de barre de titre). Graphiques Kitty ou Sixel à la résolution réelle en pixels, sinon des éléments de bloc Unicode. | Tout terminal ; vérifié dans xterm et WezTerm | `TerminalApplication.Use ();` puis `Application.Run`. |
| `Majorsilence.Forms.WinForms` | vrai `System.Windows.Forms` | Backend de *migration* réservé à Windows : de vraies fenêtres WinForms sur la pompe Win32, Skia présenté via un bitmap GDI. Adoptez Majorsilence.Forms un contrôle à la fois. Cible aussi `net48`. | Windows | `Platform.Backend = new WinFormsPlatformBackend ()` — ou déposez un `MajorsilenceFormsPresenter` dans un formulaire WinForms ; il s'installe tout seul. |
| `Majorsilence.Forms.Wpf` | `Window` WPF | Backend de migration réservé à Windows, de même forme que celui de WinForms : une vraie `Window` WPF sur la boucle du `Dispatcher`, Skia présenté via un `WriteableBitmap`. Cible aussi `net48`. | Windows | `Platform.Backend = new WpfPlatformBackend ()`. |
| `Majorsilence.Forms.Headless` | SkiaSharp sans dépendance | Rendu hors écran pour les tests, la CI et les serveurs ; le backend de référence à copier. | Partout où .NET tourne ; aucun affichage | `HeadlessRenderer.Use ()`. |

L'**assembly cœur `Majorsilence.Forms` ne référence aucune boîte à outils de fenêtrage** — uniquement
SkiaSharp. Les backends sont des assemblies séparées qui dépendent du cœur et accèdent à sa plomberie
interne de rendu et d'entrée.

### Frameworks cibles
{:#target-frameworks}

Le cœur (`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Telerik`)
multi-cible `net8.0`, `net10.0` **et `netstandard2.0`**. `Majorsilence.Forms.WinForms` et
`Majorsilence.Forms.Wpf` ajoutent chacun une ligne **`net48`** (associée à la build `netstandard2.0` du
cœur) à côté de `net8.0-windows` / `net10.0-windows`, de sorte qu'une application WinForms ou WPF
classique sous .NET Framework 4.8 peut héberger des contrôles Majorsilence.Forms dès aujourd'hui. Les
lignes `net48` compilent sur tous les OS en CI ; seule leur *exécution* nécessite Windows.

Les backends multiplateformes (Avalonia, Uno, GTK 4, Terminal, Headless) ciblent `net8.0`+ et n'ont
besoin d'aucun suffixe TFM `-windows`. Il n'existe pas de backend `netstandard2.0` : sur un runtime .NET
Framework hors Windows, une application peut donc référencer les contrôles mais pas héberger une fenêtre.

## La couture
{:#the-seam}

Deux interfaces dans `Majorsilence.Forms.Backends` définissent tout ce qu'un hôte doit fournir :

- **`IPlatformBackend`** — les services d'application et de processus : le dispatcher (`Post`/`Invoke`),
  les timers, le presse-papiers, les écrans, `CreateWindow` et la boucle modale.
- **`IWindowBackend`** — une fenêtre native : position/taille/mise à l'échelle, affichage/masquage/
  fermeture, titre, curseur, décorations, déplacement/redimensionnement et les boîtes de dialogue de
  fichiers natives.

`IWindowBackend` est le côté *pull*. Le côté *push* — demandes de peinture et entrées natives — est le
backend qui appelle directement les méthodes neutres de la fenêtre propriétaire : `RenderFrame (SKCanvas,
physW, physH, scaling)`, `HandlePointer*`, `HandleKeyDown/Up`, `HandleTextInput` et les hooks de cycle de
vie `OnBackend*`. Toutes les coordonnées qui traversent la couture sont des types valeur `System.Drawing`
et des énumérations Majorsilence.Forms — aucun type de boîte à outils ne fuit dans le cœur. Les capacités
optionnelles (`IWebViewFactory`, `INativeControlHostBackend`, `IAudioBackend`, `IModalLoopSupport`, …)
se trouvent à côté des deux interfaces ; un backend qui en omet une ne lève simplement jamais les
événements correspondants.

### Sélectionner un backend
{:#selecting-a-backend}

`Majorsilence.Forms.Backends.Platform.Backend` contient l'`IPlatformBackend` actif. S'il n'est pas défini,
il se résout par nom vers `AvaloniaPlatformBackend` lorsque `Majorsilence.Forms.Avalonia` est référencé —
une application de bureau référence donc simplement ce package et appelle `Application.Run (new MyForm ())`.
Tout autre backend s'installe explicitement, **avant la création de la première fenêtre** :

```csharp
Majorsilence.Forms.Backends.Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();
// ou les helpers :  Gtk4Application.Use ();   TerminalApplication.Use ();   HeadlessRenderer.Use ();
Application.Run (new MainForm ());
```

### Pixels logiques vs pixels physiques
{:#logical-vs-device-pixels}

Tout ce qu'une application voit sur `Control` est en **unités logiques** — les nombres qu'elle définit et
relit, quelle que soit la mise à l'échelle de l'affichage : `Width`/`Height`/`Location`/`Bounds`,
`ClientSize` et `ClientRectangle`, `MouseEventArgs.X/Y`, et **le canevas de peinture**. `OnPaint`, les
gestionnaires `Paint` et `e.ClipRectangle` sont tous logiques ; le framework met le canevas à l'échelle
de l'affichage.

```csharp
child.Left = (ClientSize.Width - child.Width) / 2;            // centre l'enfant à n'importe quel DPI
e.Graphics.DrawRectangle (pen, 0, 0, Width - 1, Height - 1);  // encadre le contrôle à n'importe quel DPI
```

**Cela a changé le 2026-10-01.** Jusque-là, `ClientSize`, `ClientRectangle` et le canevas de peinture
étaient en pixels physiques et un contrôle personnalisé devait appeler lui-même
`e.Graphics.ScaleTransform (e.Scaling, e.Scaling)`. Si vous aviez ajouté un tel appel, **supprimez-le** —
le dessin est désormais mis à l'échelle deux fois. Les pixels physiques restent accessibles via la famille
explicitement nommée `Scaled*` (`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling` et
`LogicalToDeviceUnits`.

Une exception subsiste : les **événements owner-draw** (`DrawItem`, `DrawNode`, `DrawListViewItem`, le
`CellPainting` de la grille, …) fournissent toujours des `Bounds` en pixels physiques avec un `Graphics` en
pixels physiques. Les deux sont cohérents entre eux, mais pas avec le reste du contrôle.

Testez vos hypothèses de mise à l'échelle sous `MF_HEADLESS_SCALE=2` (voir
[Automatisation]({{ '/fr/automation/' | relative_url }})) — du code correct à l'échelle 1 et incorrect à
toute autre échelle est le bug le plus courant.

### Trimming et NativeAOT
{:#trimming-and-nativeaot}

`Majorsilence.Forms`, `Majorsilence.Forms.Drawing.Common`, `Majorsilence.Forms.Avalonia` et
`Majorsilence.Forms.Headless` sont compilés avec `IsAotCompatible`, de sorte qu'un nouveau risque de
trimming/AOT fait échouer la build Release au lieu de casser silencieusement un consommateur élagué, et
`tests/Majorsilence.Forms.AotSmoke` publie un vrai binaire NativeAOT en CI. Les assemblies Uno, GTK 4,
WinForms, WPF et Telerik ne sont **pas** analysées — leurs boîtes à outils reposent lourdement sur la
réflexion et sortent du périmètre d'une garantie AOT.

**La liaison de données est le seul recoin réflexif.** `Control.DataBindings` trouve les propriétés et
les événements `<Property>Changed` par nom à l'exécution. Le framework embarque son propre
`ILLink.Descriptors.xml` qui enracine les paires liables de ses propres contrôles (`Text`/`TextChanged`,
`Checked`, `SelectedIndex`, `Value`) : le **côté contrôle n'exige rien de vous**. Le **côté view-model
reste à votre charge** : enracinez les propriétés que vous liez avec un `TrimmerRootDescriptor` dans le
projet de l'application, ou évitez la question en câblant le view-model en code ordinaire — ce que fait le
package sans réflexion `Majorsilence.Forms.Mvvm` (`Observe`, `BindText`, `BindCommand`). Un membre
manquant ou élagué échoue bruyamment dans `DataBindings.Add` avec le nom du membre ; seul un événement
`Changed` manquant se dégrade silencieusement en liaison unidirectionnelle. La couverture au-delà de
`Label`/`TextBox.Text` n'est pas exercée par un test automatisé : vérifiez donc une build publiée avant de
vous y fier.

## Intégration dans une application hôte
{:#embedding-in-a-host-app}

Tout ce qui précède suppose que Majorsilence.Forms possède la fenêtre de premier niveau. Les backends
Avalonia, Uno, WinForms, WPF et GTK 4 prennent aussi en charge la direction *inverse* : une application
hôte existante qui traite les objets Majorsilence.Forms comme s'ils étaient ses propres objets natifs — de
manière additive, sans rien changer au flux habituel `Form.Show()`.

**Un contrôle Majorsilence devient un contrôle hôte**, via `MajorsilenceFormsPresenter` (un vrai
`Avalonia.Controls.Canvas` / `Grid` WinUI / `System.Windows.Forms.Control` / `Grid` WPF / `DrawingArea`
GTK) et ses méthodes d'extension. Déposez le résultat dans n'importe quel arbre visuel natif :

```csharp
Avalonia.Controls.Control            c = myMfControl.ToAvaloniaControl ();  // Majorsilence.Forms
Microsoft.UI.Xaml.FrameworkElement   c = myMfControl.ToUnoControl ();       // Majorsilence.Forms.Uno
System.Windows.Forms.Control         c = myMfControl.ToWinFormsControl ();  // Majorsilence.Forms.WinForms
System.Windows.FrameworkElement      c = myMfControl.ToWpfElement ();       // Majorsilence.Forms.Wpf
Gtk.Widget                           c = myMfControl.ToGtkWidget ();        // Majorsilence.Forms.Gtk4
```

Le presenter GTK 4 *expose* une propriété `Widget` au lieu de dériver d'un widget GTK (le sous-classage
GObject de gir.core exige un package d'intégration supplémentaire) ; tout le reste a la même forme.

**Un `Form` Majorsilence devient une fenêtre hôte.** La fenêtre backend d'un `Form` est créée de manière
anticipée dans son constructeur, et sur ces backends cet objet *est* déjà (Avalonia, WinForms, WPF, GTK 4)
ou *enveloppe* (Uno) une vraie fenêtre native ; ces méthodes la renvoient donc directement :

```csharp
Avalonia.Controls.Window  w = myForm.ToAvaloniaWindow ();
Microsoft.UI.Xaml.Window  w = myForm.ToUnoWindow ();
System.Windows.Forms.Form w = myForm.ToWinFormsForm ();
System.Windows.Window     w = myForm.ToWpfWindow ();
Gtk.Window                w = myForm.ToGtkWindow ();
```

À partir de là, c'est l'hôte qui gère l'affichage — assignez-la comme fenêtre principale, définissez
`Owner`, appelez `Show()`/`ShowDialog(owner)`. La comptabilité propre à Majorsilence
(`Load`/`Shown`/`Application.OpenForms`) s'exécute toujours la première fois que la fenêtre devient
visible, quel que soit le côté qui l'a déclenchée.

**Les relations de propriétaire et de modalité diffèrent selon le backend.** Avalonia, WinForms et GTK 4
offrent une véritable relation modale au niveau de l'OS via leur `Owner`/`ShowDialog(owner)` natif (GTK :
transient-for + modal). Uno n'a pas de notion de propriétaire dans ce backend, donc `ToUnoWindow()`
renvoie une fenêtre de premier niveau indépendante ; utilisez `Form.ShowDialog(parent)` — la boucle modale
propre à Majorsilence, qui ne dépend pas de la propriété native — pour un comportement modal sous Uno.

Chaque direction est démontrée par
[`EmbeddingAvalonia`]({{ site.github_url }}/tree/main/samples/EmbeddingAvalonia),
[`EmbeddingUno`]({{ site.github_url }}/tree/main/samples/EmbeddingUno),
[`EmbeddingWinForms`]({{ site.github_url }}/tree/main/samples/EmbeddingWinForms) et
[`EmbeddingGtk4`]({{ site.github_url }}/tree/main/samples/EmbeddingGtk4) ; voir
[Exemples]({{ '/fr/samples/' | relative_url }}).

## Le backend Avalonia
{:#the-avalonia-backend}

Le backend par défaut, et ce qu'une nouvelle application de bureau obtient sans aucune configuration. Sous
Windows/macOS/Linux, l'hôte de fenêtre *est* une vraie `Avalonia.Controls.Window`, ce qui explique
pourquoi c'est le seul backend multiplateforme qui implémente `TryGetPlatformHandle` (voir
[Interopérabilité native]({{ '/fr/native-interop/' | relative_url }})) et pourquoi `ToAvaloniaWindow()`
donne à une application hôte une véritable sémantique propriétaire/modal au niveau de l'OS.

Il n'est pas réservé au bureau. Le projet multi-cible :

| TFM | Compilé | Package de plateforme Avalonia |
|---|---|---|
| `net8.0`, `net10.0` | Toujours | `Avalonia.Desktop` + `Avalonia.Controls.WebView` |
| `net10.0-browser` | Toujours | `Avalonia.Browser` |
| `net10.0-android` | Sur activation : `-p:EnableAndroidTarget=true` (nécessite le workload `android`) | `Avalonia.Android` |
| `net10.0-ios` | Sur activation : `-p:EnableIOSTarget=true` (nécessite le workload `ios`, macOS uniquement) | `Avalonia.iOS` |

La ligne navigateur est inconditionnelle parce que wasm-tools n'est nécessaire que pour *publier*. Android
et iOS sont sur activation parce que leurs workloads sont nécessaires rien que pour compiler cette ligne,
et les deux interrupteurs sont séparés parce qu'une machine a couramment un workload sans l'autre.

### Plateformes à vue unique (navigateur, Android, iOS)
{:#single-view-platforms-browser-android-ios}

Aucune des trois n'a de gestionnaire de fenêtres au niveau de l'OS ; chacune offre exactement une vue par
application/onglet/écran. Elles partagent un hôte où **chaque** fenêtre Majorsilence.Forms est un `Canvas`
plutôt qu'une `Window` Avalonia : le premier formulaire non-popup remplit la zone d'affichage, et les
popups, menus et formulaires de premier niveau supplémentaires en sont des enfants positionnés de manière
absolue. Le démarrage est piloté par l'hôte et prend une **fabrique**, parce que le formulaire ne doit pas
exister avant l'initialisation du backend :

```csharp
await Majorsilence.Forms.Application.RunBrowserAsync (() => new MainForm ());  // navigateur
Majorsilence.Forms.Application.RunAndroid (() => new MainForm ());             // depuis OnCreate
Majorsilence.Forms.Application.RunIOS (() => new MainForm ());                 // depuis FinishedLaunching
```

**Ce qui n'y fonctionne pas**, le plus souvent par nature plutôt qu'en attente :

- **Pas de chrome de fenêtre.** `Topmost`, les décorations système, `SetIcon`, `Min`/`MaximumSize`,
  `CanResize`, `ShowInTaskbar`, `WindowState` et les glisser de déplacement/redimensionnement sont des
  no-op. `Title` est aussi un no-op aujourd'hui, mais celui-là est un travail en attente.
- **`ShowDialog` n'est pas modal au niveau de l'OS** — il se *comporte* toujours de manière modale, parce
  que la désactivation du parent se situe au-dessus de la couture ; une fenêtre secondaire s'ouvre dans le
  coin supérieur gauche de la vue. Et le `ShowDialog` **bloquant** ne fonctionne pas du tout sur aucune
  des trois — voir [Threading dans le navigateur](#browser-threading).
- **Pas de WebView.** Les contrôles de compatibilité qui en ont besoin (`RadPdfViewer`,
  `RadRichTextEditor`) se rabattent sur leur chemin de visionneuse simple. Le navigateur n'a pas de webview
  native ; Android et iOS en ont, donc ces deux-là sont un travail différé plutôt qu'une limite ferme.
- **La fermeture des popups à la perte du focus au profit d'une autre application ne se déclenche pas** ;
  cliquer ailleurs dans l'application ferme toujours les popups.

**Ce qui y fonctionne** (parité mobile) :

- **Clavier à l'écran.** Donner le focus à un `TextBox` fait apparaître le clavier logiciel et le ferme à
  la perte du focus. `TextBoxBase.InputKind` (`Number`, `Email`, `Url`, `Phone`) choisit la disposition ;
  les zones masquées et multilignes reçoivent le clavier correspondant. Les backends de bureau l'ignorent.
- **Marges de zone sûre.** `Form.SafeAreaPadding` est appliqué automatiquement, de sorte que les contrôles
  ancrés et dockés restent à l'écart de la barre d'état, de l'encoche et de l'indicateur d'accueil ;
  quand le clavier s'ouvre, le champ ayant le focus est amené dans la vue par défilement.
- **Cycle de vie, bouton Retour, classes de taille.** `Application.Suspended`/`Resumed`,
  `WindowBase.BackRequested` (la `MainActivity` du modèle relaie le bouton Retour d'Android),
  `Form.SizeClass`/`SizeClassChanged`, les barres de défilement tactiles sous Android, et les contrôles
  de mise en page de style téléphone (`StackPanel`, `Card`, `RichListBox`, `NavigationHost`) dans
  [`docs/mobile-layout.md`]({{ site.github_url }}/blob/main/docs/mobile-layout.md).

**La maturité diffère fortement entre les trois.** Les trois compilent en CI, mais la suite de tests
headless exerce le cœur partagé, pas une vraie tête.

- **Navigateur** : exécute la galerie complète — la [démo en direct]({{ '/gallery/' | relative_url }}),
  c'est elle — et ses vérifications de modalité et d'accessibilité tournent dans Chrome headless à chaque
  build CI. Le chemin est encore jeune.
- **Android** : a eu une première passe sur appareil réel : la galerie démarre, et le hit-testing au
  toucher, la mise à l'échelle du rendu et le défilement/flick tactile sont confirmés sur le matériel. Le
  clavier à l'écran, les marges de zone sûre et la rotation sont testés unitairement sur Headless mais pas
  encore exercés sur un appareil.
- **iOS** : compile, et la CI le lance dans un simulateur comme test de fumée, mais personne ne l'a
  exécuté de manière interactive sur un simulateur ou un appareil ; le job `ios` est toujours en
  `continue-on-error`.

### Exécution dans le navigateur (WebAssembly)
{:#running-in-the-browser-webassembly}

Il n'existe pas de package WASM séparé — la ligne `net10.0-browser` de `Majorsilence.Forms.Avalonia` est
construite sur la plateforme `Avalonia.Browser` d'Avalonia 12 (WebGL2/Emscripten, le même moteur de rendu
Skia que sur le bureau). Une tête navigateur minimale référence `Majorsilence.Forms.Avalonia` +
`Avalonia.Browser` depuis un projet `Microsoft.NET.Sdk.WebAssembly` — voir
[`samples/Gallery.Wasm`]({{ site.github_url }}/tree/main/samples/Gallery.Wasm), ou générez-en une avec
`dotnet new majorsilenceforms --IncludeWasm`.

```
dotnet workload install wasm-tools
dotnet publish samples/Gallery.Wasm -c Release -o out
```

Servez `out/wwwroot` avec n'importe quel serveur de fichiers statiques — `dotnet run` ne sert pas un
projet du SDK WebAssembly. La CI publie ce bundle à chaque PR et l'attache à chaque release.

Il n'y a pas de vrai système de fichiers dans le navigateur. `WasmFilesToIncludeInFileSystem`, l'item
habituel pour en précharger un, est silencieusement ignoré sous `Microsoft.NET.Sdk.WebAssembly`, ce qui
explique pourquoi les icônes de la galerie elle-même manquent encore dans les builds navigateur (et
Android/iOS). Livrez plutôt de tels assets sous forme d'`EmbeddedResource`.

### Threading dans le navigateur
{:#browser-threading}

Dans le navigateur, .NET s'exécute sur l'unique thread JavaScript de la page. Un appel qui ne rend pas la
main arrête aussi les entrées, les timers et la peinture qui lui auraient permis de la rendre — une boucle
modale imbriquée ne peut donc pas tourner, et le backend Avalonia signale `CanRunModalLoop = false` sur
`net10.0-browser`. **Il en va de même sous Android et iOS**, pour une raison différente : le dispatcher
d'Avalonia ne peut pas y pousser une trame imbriquée (mesuré sur un émulateur Android 15 et un simulateur
iPhone 17 Pro).

Chaque point d'entrée modal bloquant vérifie ce drapeau **avant d'afficher quoi que ce soit** et lève une
`PlatformNotSupportedException` nommant son jumeau asynchrone, de sorte qu'un appel refusé ne laisse
aucune boîte de dialogue ouverte ni aucun propriétaire désactivé. Chaque API modale a une forme awaitable,
et chacune fonctionne sur tous les backends :

| Bloquant | Awaitable |
|---|---|
| `Form.ShowDialog (…)` | `Form.ShowDialogAsync (…)` — les mêmes surcharges de propriétaire |
| `MessageBox.Show (…)` | `MessageBox.ShowAsync (…)` |
| `OpenFileDialog`/`SaveFileDialog`/`FolderBrowserDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `TaskDialog.ShowDialog (…)` | `TaskDialog.ShowDialogAsync (…)` |
| `ColorDialog`/`FontDialog`/`PrintPreviewDialog.ShowDialog` | `ShowDialogAsync (…)` |
| `CommonDialog.ShowDialog` (votre propre sous-classe) | `CommonDialog.ShowDialogAsync` ; redéfinissez `RunDialogAsync` |
| `VbInteraction.MsgBox`/`InputBox` | `VbInteraction.MsgBoxAsync`/`InputBoxAsync` |
| `RadMessageBox.Show (…)` (compatibilité Telerik) | `RadMessageBox.ShowAsync (…)` |

La forme habituelle est un gestionnaire d'événements `async void` — le seul endroit où `async void` est
l'idiome :

```csharp
private async void deleteButton_Click (object sender, EventArgs e)
{
    if (await MessageBox.ShowAsync (this, "Delete the selected rows?", "Orders", MessageBoxButtons.YesNo) != DialogResult.Yes)
        return;

    using var options = new DeleteOptionsForm ();
    if (await options.ShowDialogAsync (this) == DialogResult.OK)
        await DeleteAsync (options.Mode);
}
```

La même règle couvre `task.Result`, `.Wait ()`, `GetAwaiter ().GetResult ()` et `Thread.Sleep` —
utilisez `await` et `await Task.Delay`.

**L'analyseur.** Le package cœur `Majorsilence.Forms` embarque un analyseur Roslyn avec des correctifs de
code : `MFB001` un appel modal bloquant (nommant son jumeau awaitable), `MFB002` une attente synchrone sur
une tâche, `MFB003` `Thread.Sleep`. Il reste silencieux sauf si le code est du code navigateur — un TFM
`net*-browser`, une bibliothèque déclarant `<SupportedPlatform Include="browser" />`, ou une activation
explicite pour une bibliothèque d'interface partagée qu'une tête navigateur référence :

```ini
# .editorconfig à côté de la bibliothèque d'interface partagée
[*.cs]
majorsilence_forms.browser_target = true
```

L'analyseur est réservé au navigateur ; un appel bloquant dans du code Android ou iOS n'est pas signalé à
la compilation et échoue à l'exécution avec le même message. Si JSPI ou le runtime navigateur CoreCLR
permet un jour à une boucle imbriquée de tourner, `CanRunModalLoop` est le seul interrupteur à réactiver.

### DOM d'accessibilité (navigateur)
{:#accessibility-dom-browser}

Un canevas unique est invisible pour un lecteur d'écran, la recherche dans la page ou un outil de test
DOM. Sur la cible navigateur, le backend Avalonia maintient donc un **miroir DOM des formulaires ouverts
à côté du canevas** : un élément transparent et traversable au clic par contrôle, portant son rôle ARIA,
son nom, son état et ses limites, construit à partir de l'arbre d'automatisation propre au framework — le
même arbre que lisent le pont Windows UI Automation et le serveur WebDriver, de sorte que tout ce qu'un
test peut trouver, un lecteur d'écran peut le trouver aussi. Il se resynchronise après la peinture au plus
toutes les 100 ms et n'envoie que ce qui a changé ; les popups sont reflétés dans la fenêtre pour laquelle
ils se sont ouverts ; deux régions live annoncent les boîtes de dialogue, les boîtes de message, le texte
d'état et les étiquettes avec un `LiveSetting`. Les outils de test localisent par rôle et nom ou par
`[data-mf-automation-id=…]` et cliquent au niveau du rectangle englobant de l'élément, puisque l'entrée
appartient toujours au canevas.

Mise en garde honnête : cela a été vérifié en lisant le DOM et en enregistrant les régions live dans Chrome
headless. **Rien n'a encore été essayé avec un vrai lecteur d'écran.** Désactivez-le avec le commutateur
AppContext `Majorsilence.Forms.Browser.DisableAccessibilityDom`.

## Le backend Headless
{:#the-headless-backend}

Le backend le plus simple possible et l'implémentation de référence à copier : une boucle de messages à
file de travail, un presse-papiers en mémoire, un écran virtuel et un rendu hors écran vers une
`SKSurface`. `HeadlessRenderer.Use ()` l'installe et fait du thread appelant le thread d'interface ;
`CapturePng (window, w, h)` rend en PNG ; les helpers `Click`/`MouseDown`/`KeyDown`/`TextInput` pilotent
le même chemin neutre `Handle*` qu'utilise un vrai backend. Il n'a besoin d'aucun affichage, il alimente
donc les tests unitaires et rend la ControlGallery pour la CI et les comparaisons pixel à pixel :

```
dotnet run --project samples/Gallery.Avalonia -- --render-headless out.png 1100 750 --select-row 0
```

L'animation y est déterministe : `control.RequestAnimationFrame (…)` est pilotée par une horloge
manuelle, `HeadlessRenderer.AnimationClock.Step (n)`, au lieu d'un timer d'affichage. Voir
[`docs/animation.md`]({{ site.github_url }}/blob/main/docs/animation.md).

## Le backend Uno
{:#the-uno-backend}

Implémente la couture sur la cible Skia d'Uno Platform : `UnoPlatformBackend` pilote la `DispatcherQueue`
et le presse-papiers WinUI, `UnoWindowHost` héberge un `SKXamlCanvas` et traduit les événements
pointeur/touche/caractère vers le chemin d'entrée neutre. Il nécessite une *tête d'application* Uno — voir
[`samples/Gallery.Uno`]({{ site.github_url }}/tree/main/samples/Gallery.Uno) — et a été vérifié en
lançant et en rendant la galerie complète sous macOS.

Le déplacement/redimensionnement de fenêtre pour le chrome auto-dessiné de Majorsilence.Forms est
déclaratif plutôt qu'impératif sur ce backend : le redimensionnement vient gratuitement d'un presenter
sans bordure qui conserve les marges de redimensionnement de l'OS, et le glisser de la barre de titre
utilise l'API de région de légende de WinUI (`SetCaptionRegions`) sur la tête de bureau Windows. Sous
macOS, les décorations natives gèrent le déplacement/redimensionnement ; sous X11, le glisser de la barre
de titre est indisponible et `UseSystemDecorations` est le repli.

## Le backend GTK 4
{:#the-gtk-4-backend}

`Majorsilence.Forms.Gtk4` implémente la couture sur GTK 4 via les bindings
[gir.core](https://github.com/gircore/gir.core). C'est un backend de bureau à vraies fenêtres pensé pour
Linux d'abord (Wayland/X11), qui compile et tourne aussi sous Windows/macOS partout où le runtime GTK 4
est installé. Contrairement à Avalonia, il se sélectionne explicitement :

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Gtk4;

Gtk4Application.Use ();                 // installe Gtk4PlatformBackend
Application.Run (new MainForm ());      // boucle principale GLib
```

**Ce qui fonctionne :** une vraie `Gtk.Window` par formulaire de premier niveau et des fenêtres sans
bordure pour les popups ; Skia rendu dans une surface image Cairo à chaque peinture ; souris, clavier et
texte saisi via les contrôleurs d'événements GTK ; des timers GLib derrière `Timer` ; le texte du
presse-papiers et le `Screen` multi-moniteur ; les glisser de déplacement/redimensionnement du chrome
personnalisé via `Gdk.Toplevel.BeginMove/BeginResize` ; `ShowDialog` avec une véritable relation
transient-for/modal ; l'intégration dans les deux sens (`ToGtkWidget()`, `ToGtkWindow()`) ; et
`NativeControlHost` — un vrai `Gtk.Widget` superposé dans une scène Majorsilence. GTK 4 compose chaque
widget dans un seul arbre de rendu, donc **il n'y a pas de problème d'airspace** ici, contrairement à
Avalonia/Uno/WinForms. `WebBrowser`, `RadPdfViewer` et `RadRichTextEditor` s'appuient sur
**WebKitGTK 6.0** (événements de navigation, `ExecuteScriptAsync`, un pont de messages JS vers l'hôte) ;
la bibliothèque native n'est chargée que lorsqu'un `WebBrowser` est créé, et `IsWebViewFunctional` est
faux sans elle.

Vérifié sous Wayland : la fenêtre s'affiche, la ControlGallery complète est rendue, les timers se
déclenchent, les repeints suivent les entrées, l'exemple d'intégration se présente, et la webview fait
l'aller-retour d'un message de script.

**Ce qui ne fonctionne pas**, le plus souvent des suppressions d'API dans GTK 4 plutôt qu'un travail en
attente : pas de contrôle de la position à l'écran (`Form.Location` est une indication que le gestionnaire
de fenêtres peut ignorer ; `Topmost`, `ShowInTaskbar` et `MaximumSize` font l'aller-retour mais ne sont
pas appliqués) ; `SetIcon(byte[])` est un no-op (les icônes GTK 4 sont des noms thématiques) ; les
sélecteurs de fichiers et de dossiers renvoient vide, donc les replis de boîte de dialogue commune prennent
le relais comme sous Headless ; la mise à l'échelle fractionnaire utilise le facteur d'échelle entier de
GTK (1 ou 2) ; et le backend n'est pas analysé pour l'AOT. Il nécessite un serveur d'affichage — utilisez
Headless pour le rendu hors écran.

**Installation.** `libgtk-4-1` sous Debian/Ubuntu, `gtk4` sous Fedora/Arch, `brew install gtk4` sous
macOS, le runtime GTK sous Windows ; pour la webview, ajoutez WebKitGTK 6.0 (`libwebkitgtk-6.0-4` sous
Debian/Ubuntu). Lancez [`samples/Gallery.Gtk4`]({{ site.github_url }}/tree/main/samples/Gallery.Gtk4)
(`MF_GTK4_WEBVIEW=1` pour le formulaire webview). Voir aussi
[WinForms sous Linux]({{ '/fr/winforms-on-linux/' | relative_url }}).

## Le backend Terminal
{:#the-terminal-backend}

`Majorsilence.Forms.Terminal` exécute un formulaire dans un terminal. Le terminal est la fenêtre, c'est
donc un hôte à vue unique comme un téléphone : le formulaire remplit l'écran, ne dessine ni barre de titre
ni boutons de légende, et son `Text` va dans le titre propre du terminal. L'application fournit sa propre
porte de sortie (`Close ()`) ; **Ctrl+C quitte toujours** et n'est jamais délivré à l'application. Les
popups se composent par-dessus le formulaire ; une boîte de dialogue remplace l'écran tant qu'elle est
affichée.

```csharp
TerminalApplication.Use ();             // ou Use (new TerminalOptions { … })
Application.Run (new MainForm ());
```

**Modes de sortie.** Le pipeline Skia habituel rend hors écran et l'image est affichée de l'une de quatre
manières :

| Mode | Résolution | Quand |
|---|---|---|
| Graphiques Kitty | les vrais pixels du terminal | kitty, WezTerm, Ghostty |
| Sixel | vrais pixels, 256 couleurs | foot, mlterm, iTerm2, Contour, xterm `-ti vt340` |
| Blocs (par défaut sans graphiques) | 2×4 pixels par cellule à partir des glyphes de quadrant Unicode | tout le reste, et toujours dans tmux/screen |
| Demi-bloc | 1×2 pixels par cellule | uniquement sur figeage, pour une police sans les glyphes de quadrant |

Le mode Blocs fait d'un terminal de 300×80 un écran de 600×320, lisible à l'échelle 1. Seules les
cellules, régions ou tuiles de 16×8 cellules modifiées sont renvoyées, de sorte qu'un clignotement de
curseur n'est qu'une tuile.

**Détection et figeage.** Au démarrage, l'hôte demande au terminal ce qu'il prend en charge (graphiques
Kitty, clavier Kitty et attributs de périphérique, qui listent aussi Sixel) au lieu de faire confiance à
`TERM` ; le truecolor est confirmé de la même manière. Figez un mode avec
`MF_TERMINAL_GRAPHICS=halfblock|blocks|kitty|sixel` ou `TerminalOptions.GraphicsMode` ; un mode figé n'est
jamais remplacé. `MF_TERMINAL_SIXEL_MAX=WxH` informe l'hôte d'un `maxGraphicsSize` xterm relevé (xterm
tronque les images Sixel à 1000×1000 par défaut, le formulaire est donc dimensionné pour tenir), et
`MF_TERMINAL_TRACE=/path` journalise les réponses brutes, le mode choisi et chaque événement d'entrée
décodé.

**Entrée.** La souris (clics, glisser, survol, molette) et le clavier (texte, flèches, touches de
navigation, F1–F12, modificateurs) sont décodés depuis le flux d'octets ; avec les graphiques Kitty, la
souris est exacte au pixel. Lorsque le terminal offre le protocole clavier Kitty, il est activé, ce qui
donne de vrais relâchements de touche, des modificateurs exacts et des dispositions non américaines
correctes. Un formulaire démarre sans rien de focalisé : appuyez donc une fois sur Tab avant d'utiliser
les flèches.

**Vérifié** dans xterm 407 (Sixel avec `-ti vt340` ; Blocs/truecolor par défaut) et WezTerm (graphiques
Kitty, Sixel sur figeage). **Pas encore vérifié :** kitty, Ghostty, foot, iTerm2, Windows Terminal,
Terminal macOS, tmux, et les E/S de console Windows (écrites d'après les modes VT, non exercées). Les
sélecteurs de fichiers natifs, `NativeControlHost` et les vues web n'ont pas d'équivalent terminal. Lancez
[`samples/Gallery.Terminal`]({{ site.github_url }}/tree/main/samples/Gallery.Terminal) dans un terminal
truecolor.

## Les backends WinForms et WPF (migration)
{:#the-winforms-and-wpf-backends-migration}

Ces deux-là existent dans un seul but : la **migration incrémentale sous Windows**. Une application
WinForms ou WPF garde son shell, ses menus et ses fenêtres sur la vraie boîte à outils pendant que des
écrans ou contrôles individuels passent à Majorsilence.Forms — chaque pièce portée se réinsère comme un
`System.Windows.Forms.Control` standard ou un `FrameworkElement` WPF. Une *bibliothèque de contrôles*
WinForms peut porter ses internes tout en continuant à livrer des contrôles WinForms à ses consommateurs.
Quand tout est porté, remplacez le package par `Majorsilence.Forms.Avalonia` et le même code devient
multiplateforme ; rien ne change au-dessus de la couture. Les deux ciblent **`net48`** en plus de
`net8.0-windows`/`net10.0-windows`, de sorte qu'une application .NET Framework 4.8 peut commencer à
migrer sans d'abord passer au .NET moderne.

**`Majorsilence.Forms.WinForms`** héberge de vraies fenêtres `System.Windows.Forms` sur la pompe Win32
classique et présente Skia via un contrôle adossé à GDI. L'entrée WinForms est déjà en pixels physiques
et ses énumérations `Keys`/`MouseButtons` sont numériquement identiques à celles de Majorsilence.Forms,
la traduction est donc un simple cast. Les popups sont des fenêtres outil sans bordure ;
`TryGetPlatformHandle` renvoie le vrai HWND. Le presenter installe le backend automatiquement quand aucun
n'est configuré, de sorte que l'`Application.Run` existant de l'application sert tout :

```csharp
using Majorsilence.Forms.WinForms;

var scene = new Majorsilence.Forms.Panel ();
scene.Controls.Add (new Majorsilence.Forms.Button { Text = "Ported button", Left = 12, Top = 12 });
myWinFormsForm.Controls.Add (scene.ToWinFormsControl ());

// ou confier un Form MF entier à WinForms comme boîte de dialogue modale native
System.Windows.Forms.Form native = myMfForm.ToWinFormsForm ();
native.ShowDialog (ownerWinFormsForm);
```

Vérifié de manière interactive sous Windows via `samples/EmbeddingWinForms` : rendu, entrées souris et
clavier, popups de liste déroulante de combo, superpositions `NativeControlHost` et boîtes de dialogue
modales `ToWinFormsForm()`. Non implémenté : les gestes (WinForms n'a pas d'API de gestes) et
`IWebViewFactory` (les contrôles de compatibilité dépendant d'une webview se rabattent). Hors Windows,
les lignes .NET moderne se compilent comme un espace réservé vide, de sorte qu'une solution
multiplateforme compile toujours partout.

**`Majorsilence.Forms.Wpf`** a la même forme sur une vraie `Window` WPF et la boucle du `Dispatcher`,
avec Skia présenté via un `WriteableBitmap`, les boîtes de dialogue de fichiers `Microsoft.Win32` et
`System.Windows.Clipboard`. `NotifyIcon` utilise le vrai `System.Windows.Forms.NotifyIcon`, puisque WPF
n'en a pas. Sélectionnez-le explicitement, ou intégrez :

```csharp
Platform.Backend = new Majorsilence.Forms.Wpf.WpfPlatformBackend ();   // MF possède l'application
Application.Run (new MainForm ());

myWpfGrid.Children.Add (myMfControl.ToWpfElement ());                  // ou intégrer dans une application WPF
```

[`samples/Gallery.Wpf`]({{ site.github_url }}/tree/main/samples/Gallery.Wpf) y exécute la galerie
complète.

**Relation avec `WindowsFormsInterop`.** Les deux existent pour la migration incrémentale et en résolvent
des couches différentes. `Majorsilence.Forms.WindowsFormsInterop` fait le pont pour des **formulaires
entiers** entre une application WinForms et Majorsilence.Forms tournant sur le backend Avalonia, en
partageant une seule pompe de messages. Le backend WinForms retire Avalonia de l'équation et travaille à la
granularité du **contrôle**. Ils peuvent coexister — le presenter laisse tranquille un backend déjà
configuré. Pour une bibliothèque de contrôles dont l'API publique est typée WinForms, il existe une
troisième option, le générateur de source `Majorsilence.Forms.WinFormsShims.Compat` ; voir le
[Guide de migration]({{ '/fr/migration/' | relative_url }}).

## Gestes tactiles
{:#touch-gestures}

`Control` possède des événements purement additifs pour l'entrée tactile et au stylet : `LongPress`,
`Pinch` (pincer pour zoomer et rotation à deux doigts ensemble), `Swipe` et `ScrollGesture` — un glisser
pour défiler continu qui continue de se déclencher avec un delta décroissant pendant la phase d'inertie de
la plateforme après que le contact est levé, ce qui constitue toute l'implémentation du défilement par
flick. Aucun d'eux ne se déclenche pour la souris. `ScrollableControl` applique `ScrollGesture` à
`AutoScrollPosition`, `ListBox` et `TreeView` font défiler leur propre barre de la même manière, et
`LongPress` ouvre `ContextMenu` par défaut. Les points de geste sont convertis en unités logiques à la
couture, de sorte que le hit-testing est juste à n'importe quelle mise à l'échelle.

Les backends **Avalonia** et **Uno** implémentent les gestes, que Majorsilence.Forms possède la fenêtre ou
soit intégré. Les deux modèles de gestes diffèrent en dessous — Avalonia attache des reconnaisseurs dédiés
qui se limitent d'eux-mêmes au toucher/stylet ; WinUI/Uno a un flux de manipulation unifié qui ne le fait
pas, rapporte la vélocité dans d'autres unités et n'a pas de swipe natif — le backend Uno filtre donc les
pointeurs souris, convertit la vélocité et synthétise `Swipe`. Les arbitrages que cela exige vivent dans
`GestureHeuristics` dans le cœur et sont testés unitairement, puisque ni l'un ni l'autre ne peut être
vérifié sans matériel multi-touch. Les autres backends ne lèvent aucun événement de geste.

## Héberger des éléments natifs
{:#hosting-native-elements}

`INativeControlHostBackend` est une capacité optionnelle implémentée par les backends **Avalonia, Uno,
WinForms, WPF et GTK 4** et absente sur Headless et Terminal. Elle permet à un contrôle
`NativeControlHost` de réserver un rectangle que le backend remplit avec un vrai élément de la boîte à
outils — un `Control` Avalonia, un `UIElement` Uno, un `System.Windows.Forms.Control`, un `Gtk.Widget` —
superposé à la surface Skia et maintenu aligné sur les limites, le découpage et la visibilité de l'espace
réservé. GTK 4 est l'exception aux limites d'airspace habituelles : il compose chaque widget dans un seul
arbre de rendu, donc un widget hébergé se découpe et se fond correctement.

`IWebViewFactory` est la capacité sœur derrière `WebBrowser` : WebView2 / WKWebView / WebKitGTK sur
Avalonia bureau, WebKitGTK sur GTK 4, aucune sur Headless, navigateur, Terminal ou le backend WinForms.

Voir [Interopérabilité native]({{ '/fr/native-interop/' | relative_url }}) pour savoir comment l'utiliser,
ses limites d'airspace, pourquoi les handles natifs ne peuvent pas être simulés, et pourquoi la vidéo est
généralement mieux réalisée avec des callbacks de trame dessinés dans Skia qu'avec une surface native
hébergée.

## Capacités mobiles
{:#mobile-capabilities}

Une poignée de coutures optionnelles supplémentaires existent principalement pour les lignes Android et
iOS du backend Avalonia. Tout se dégrade en no-op ailleurs ; vérifiez les drapeaux `IsSupported`.

- **Audio in-process** (`IAudioBackend`). `Media.SoundPlayer` et `Media.SystemSounds` jouent via le
  backend sous Android et iOS et se rabattent sur `Media.NativeAudio` (qui lance l'utilitaire de lecture
  de l'OS) sur le bureau. `Media.AudioPlayer` — volume, `AudioUsage` (p. ex. `Alarm`), un vrai événement
  `Completed` — n'a pas de repli bureau et n'est réel que là où `AudioPlayer.IsSupported` le dit.
- **Haptique.** `Haptics.Tap`/`Impact`/`Vibrate` ; `Haptics.IsSupported` n'est vrai que sous Android et
  iOS. La permission `VIBRATE` est fusionnée automatiquement dans le manifeste de l'application
  consommatrice.
- **Notifications locales.** `LocalNotifications.RegisterChannel`/`Show`/`Tapped`, Android uniquement pour
  l'instant ; la `MainActivity` de l'hôte s'enregistre elle-même et relaie les intents et les résultats
  de permission.
- **Garder l'écran allumé.** `Application.KeepScreenAwake` est réel sur toutes les lignes sauf le
  navigateur — Android, iOS, Windows (`SetThreadExecutionState`), macOS (assertion d'alimentation IOKit)
  et Linux (`systemd-inhibit`). Headless l'implémente comme un simple faux paramétrable pour les tests de
  view-model.
- **Cycle de vie et bouton Retour.** `Application.Suspended`/`Resumed` et `WindowBase.BackRequested`
  sont levés par les hôtes à vue unique ; tout autre backend déclenche déjà `Activated`/`Deactivate`
  depuis sa vraie fenêtre et n'a rien à suspendre.

Les capacités qui n'ont rien à voir avec le backend d'interface actif — `SecureStorage`, `Speech`
(synthèse vocale), `Launcher.OpenAsync`, `FileSystem.OpenAppPackageFileAsync` — vivent dans le package
séparé **`Majorsilence.Forms.Essentials`**, qui choisit sa propre implémentation par plateforme et ne
passe pas du tout par `Platform.Backend`. Le détail par plateforme et l'état de vérification de tout cela
se trouvent dans [`COMPATIBILITY_MATRIX.md`]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md).

## Ajouter un autre backend
{:#adding-another-backend}

Un nouveau backend est une nouvelle assembly référençant `Majorsilence.Forms` (le cœur) plus la boîte à
outils cible, implémentant `IPlatformBackend` et `IWindowBackend` — prenez Headless comme modèle pour la
forme : pilotez le dispatcher et le cycle de vie dans `IPlatformBackend`, présentez une surface Skia (en
appelant `owner.RenderFrame`) et traduisez les entrées (`owner.Handle*`) dans `IWindowBackend`, et ajoutez
une entrée `[InternalsVisibleTo]` dans le projet cœur. Les capacités optionnelles (`IWebViewFactory`,
`INativeControlHostBackend`, `IModalLoopSupport`, …) peuvent venir plus tard, ou jamais.

Voir [`docs/backends.md`]({{ site.github_url }}/blob/main/docs/backends.md) dans le dépôt pour la liste
complète des interfaces et les notes d'implémentation par backend que cette page condense.
