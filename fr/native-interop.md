---
layout: docs
lang: fr
title: Interopérabilité native
subtitle: Contenu natif hébergé, vidéo, et pourquoi il n'y a pas de HWND derrière un Button.
permalink: /fr/native-interop/
seo_title: "Interopérabilité native — Pourquoi Control.Handle n'est pas un HWND"
description: >-
  Hébergez du contenu natif — vidéo, cartes, moteurs de navigateur — dans un contrôle WinForms
  multiplateforme sur Avalonia, Uno, WinForms, WPF ou GTK 4, et comprenez pourquoi Control.Handle
  vaut IntPtr.Zero ici.
keywords:
  - winforms control handle hwnd
  - héberger contrôle natif winforms multiplateforme
  - lecture vidéo winforms multiplateforme
  - nativecontrolhost skiasharp
  - winforms hwnd linux
  - interop native winforms avalonia
priority: "0.7"
---

Deux questions se révèlent n'en faire qu'une :

- *« Comment mettre un élément natif — une surface vidéo, une vue cartographique, un moteur de
  navigateur — à l'intérieur d'un contrôle Majorsilence.Forms ? »*
- *« Comment obtenir un `HWND` pour un contrôle, afin de le passer à une bibliothèque qui en
  réclame un ? »*

La réponse courte à la seconde est : **vous ne pouvez pas, et vous ne devez pas en fabriquer un**.
Vous en avez rarement besoin, parce que la première a une vraie réponse :
[`NativeControlHost`](#the-seam-nativecontrolhost).

Héberger une fenêtre Majorsilence.Forms dans une vraie application WinForms est le sens inverse, et
fait l'objet de [`winforms-interop.md`]({{ site.github_url }}/blob/main/docs/winforms-interop.md).

## Pourquoi les handles ne sont pas réels ici
{:#why-handles-arent-real-here}

Majorsilence.Forms effectue tout son dessin lui-même dans une seule surface Skia. Chaque backend suit
le même modèle que le toolkit sous-jacent : **une fenêtre hôte par fenêtre de premier niveau — une
vraie fenêtre de l'OS sur les backends de bureau — et tout ce qu'elle contient est dessiné, pas
composé à partir de fenêtres enfants natives.** Un `Button` est un ensemble d'opérations de peinture
sur un canevas. Il n'y a pas de `HWND` derrière lui parce qu'il n'y a pas d'objet de l'OS derrière lui.

| Membre | Valeur | Pourquoi |
|---|---|---|
| `Control.Handle` | `IntPtr.Zero` | Il n'existe aucune fenêtre de l'OS par contrôle à rapporter. Sa lecture conserve l'effet de bord de la version amont : elle crée l'état de handle du contrôle, donc `IsHandleCreated` devient vrai et `HandleCreated` est déclenché, ce pour quoi `_ = control.Handle;` est écrit. Même valeur pour `ImageList.Handle`, `TreeNode.Handle`, `Cursor.Handle`, `TaskDialog.Handle`. |
| `WindowBase.Handle` | Un jeton opaque non nul | **Pas un `HWND`.** Le code WinForms lit couramment `.Handle` pour forcer la création du handle avant `Invoke`, et renvoyer zéro casse cet idiome. N'a de sens qu'à l'intérieur du code managé. |
| `WindowBase.PlatformHandle` | Le vrai handle natif, ou `IntPtr.Zero` | L'authentique, via `IWindowBackend.TryGetPlatformHandle()`. Implémenté par le backend Avalonia — `HWND` sous Windows, `NSWindow` sous macOS, `XID` sous X11 — et par le backend WinForms réservé à Windows, qui renvoie le `HWND` de son formulaire. Actuellement zéro sur Uno et Headless. |

### La règle sur la falsification
{:#the-rule-about-faking}

Un handle fabriqué n'est sûr **que tant qu'il fait l'aller-retour dans du code managé que vous
contrôlez** — ce qui est exactement ce que fait `WindowBase.Handle`, et tout ce à quoi il sert. Il
cesse d'être sûr dès l'instant où il passe dans du code natif.

Les bibliothèques natives ne se contentent pas de stocker le handle que vous leur donnez. Le
`libvlc_media_player_set_hwnd` de LibVLC, le `--wid` de mpv et le `GstVideoOverlay.set_window_handle`
de GStreamer le transmettent tous à l'OS — `SetParent`, `CreateWindowEx`, `GetClientRect`,
`SetWindowPos`, `XReparentWindow`. Leur passer un nombre inventé donne l'un de deux résultats, et le
second est le pire :

1. L'appel échoue, et vous obtenez un rectangle noir ou un plantage à l'intérieur de la bibliothèque
   native.
2. L'appel *réussit sur une fenêtre qui appartient à autre chose.* Les `HWND` sont des indices dans
   une table de handles, pas des pointeurs, et les petits entiers sont des valeurs vivantes. Un code
   de hachage a précisément la forme du nombre qui entre en collision avec une vraie fenêtre.

Donc : ne synthétisez jamais un handle pour quoi que ce soit qui atteindra l'OS. Utilisez l'une des
deux voies ci-dessous.

## La couture : `NativeControlHost`
{:#the-seam-nativecontrolhost}

`Majorsilence.Forms.NativeControlHost` est un `Control` qui **réserve un rectangle** pour un élément
natif du toolkit sous-jacent. Il ne peint rien lui-même ; le backend superpose le vrai élément
au-dessus de la surface Skia et le maintient aligné sur les limites de l'emplacement réservé. Sur la
plupart des backends, c'est le modèle d'interopérabilité dit « airspace » — les éléments natifs ne
peuvent pas être composés dans le tampon Skia, ils sont donc positionnés par-dessus. GTK 4 est
l'exception, traitée plus bas.

```csharp
var host = new NativeControlHost { Dock = DockStyle.Fill };
host.NativeControl = someAvaloniaControl;   // ou un UIElement Uno, un Control WinForms, un Gtk.Widget…
panel.Controls.Add (host);
```

L'hôte suit les limites, la région de découpe intersectée de chaque ancêtre défilant, et la
visibilité effective le long de toute la chaîne de parents, en transmettant les trois au backend. La
resynchronisation se fait automatiquement lors de la peinture et des changements de visibilité ;
appelez `SyncNativeControl()` vous-même si vous déplacez ou redimensionnez l'hôte hors du cycle de
peinture normal.

`INativeControlHostBackend` est une capacité de backend optionnelle (voir
[Backends]({{ '/fr/backends/' | relative_url }})). Quels backends l'implémentent, et ce qu'ils
attendent :

| Backend | Type attendu de `NativeControl` | Comportement |
|---|---|---|
| Avalonia (hôte fenêtre, hôte vue unique, presenter) | `Avalonia.Controls.Control` | Ajouté à un `Canvas` de superposition au-dessus de la surface Skia. |
| Uno (hôte fenêtre, presenter) | `Microsoft.UI.Xaml.UIElement` | Ajouté au `Canvas`/panneau racine au-dessus du `SKXamlCanvas`. |
| WinForms / WPF (hôte fenêtre, presenter) | `System.Windows.Forms.Control` / `System.Windows.FrameworkElement` | Ajouté à une couche de superposition au-dessus du contrôle Skia. |
| GTK 4 (hôte fenêtre, presenter) | `Gtk.Widget` | Ajouté comme enfant d'un `Gtk.Overlay` au-dessus du `Gtk.DrawingArea`. **Aucun problème d'airspace** — GTK compose chaque widget dans un seul arbre de rendu, donc le widget hébergé est découpé et fusionné comme n'importe quel autre. |
| Headless, Terminal | — | N'implémentent pas la capacité ; l'hôte s'affiche comme un emplacement vide. |

> **Assigner le mauvais type échoue en silence.** Chaque backend vérifie le type de `NativeControl`
> et se contente de retourner s'il ne correspond pas. Rien n'est levé, rien n'est journalisé, rien
> n'apparaît à l'écran. Si votre contenu natif est invisible, vérifiez d'abord le type — un `Control`
> Avalonia donné au backend Uno, ou l'inverse, produit exactement cela.

### Limites de l'airspace
{:#airspace-limitations}

Elles s'appliquent à tout élément natif hébergé sur les backends Avalonia, Uno, WinForms et WPF, et
sont inhérentes au modèle plutôt que des bogues à corriger :

- L'élément natif se dessine **au-dessus** de toute la scène Majorsilence.Forms. Il ne peut pas être
  ordonné en z entre des contrôles Majorsilence, et tout ce qui le chevauche visuellement — une liste
  déroulante, une infobulle, un menu contextuel — est peint en dessous de lui.
- La découpe est rectangulaire uniquement. La rotation, les découpes non rectangulaires et l'opacité
  côté Majorsilence ne s'appliquent pas à lui.
- Le défilement fonctionne mais n'est pas gratuit : la superposition est repositionnée à chaque
  synchronisation, elle peut donc visiblement traîner derrière le contenu Skia lors d'un défilement
  rapide. Gardez les éléments hébergés dans des zones sans défilement quand vous le pouvez.

**GTK 4 est l'exception.** La surface Skia se trouve dans un `Gtk.Overlay` et le widget hébergé est
un enfant de superposition, mais GTK 4 compose chaque widget dans un seul arbre de rendu — le widget
hébergé est donc ordonné en z, découpé et fusionné comme n'importe quel autre, et aucune des réserves
ci-dessus ne s'applique. Le seul compromis : un hôte partiellement défilé hors d'une zone d'affichage
*réagence* son widget natif dans la boîte visible au lieu de le translater sous une découpe, donc un
widget à moitié défilé se remet en page dans le rectangle plus petit au lieu d'être coupé.

## Voie A — héberger du vrai contenu natif
{:#route-a--hosting-real-native-content}

Utilisez-la quand il vous faut quelque chose qui doit réellement être une fenêtre de l'OS : une
surface vidéo accélérée par le GPU, une vue cartographique ou CAO native, un moteur de navigateur.

Le point essentiel est que vous **ne falsifiez pas un handle — vous en créez un vrai** et c'est
celui-là que vous donnez à la bibliothèque native. `NativeControl` prend un objet du toolkit plutôt
qu'un handle, il y a donc une étape d'enveloppe entre les deux. `AvaloniaWebViewHandle` (dans
`Majorsilence.Forms.Avalonia`) et `Gtk4WebViewHandle` (dans `Majorsilence.Forms.Gtk4`) sont les
exemples travaillés déjà présents dans l'arbre : ils enveloppent `Avalonia.Controls.NativeWebView` /
`WebKit.WebView` et les exposent comme `IWebViewHandle.NativeControl`.

**GTK 4 est le cas facile.** `WebKit.WebView` n'est qu'un `Gtk.Widget` ; le backend l'ajoute au
`Gtk.Overlay` au-dessus de la surface Skia et GTK le compose dans le même arbre de rendu — aucun
handle à créer, pas d'airspace, aucune réserve de portée de plateforme. Le `IWebViewHandle` complet
(événements de navigation, évaluation JS, le pont de messages de script) est implémenté sur
WebKitGTK 6.0 via `IWebViewFactory`, qui est ce qu'utilisent `WebBrowser` et les contrôles de
compatibilité adossés à une webview sur ce backend.

**Avalonia.** Sous-classez `Avalonia.Controls.NativeControlHost` et redéfinissez
`CreateNativeControlCore (IPlatformHandle parent)`, qui renvoie un vrai `IPlatformHandle` — un
`HWND` sous Windows, un `XID` sous X11, un `NSView` sous macOS. Créez-y votre fenêtre enfant, passez
son handle au lecteur, libérez-le dans `DestroyNativeControlCore`, et assignez le contrôle Avalonia
obtenu à `NativeControlHost.NativeControl`.

**Uno.** `Uno.UI.NativeElementHosting` expose `Win32NativeWindow(IntPtr Hwnd)` et
`X11NativeWindow(IntPtr WindowId)` — des enveloppes publiques autour d'un handle que vous avez créé —
ainsi que `BrowserHtmlElement` pour WASM. Définissez-en un comme `Content` d'un `ContentPresenter`
et donnez celui-ci à `NativeControl`.

**Portée de plateforme : réalistement Windows et X11** pour les chemins basés sur un handle. Wayland
nécessite des sous-surfaces, macOS vous donne un `NSView` plutôt que quoi que ce soit ressemblant à
un `HWND`, et WASM/Android/iOS ne vous donnent aucun handle de fenêtre utilisable. Une fonctionnalité
construite ainsi ne s'exécutera pas partout où le reste du framework s'exécute. Le chemin widget
GTK 4 n'a pas cette limite — il fonctionne partout où GTK 4 fonctionne, Wayland compris.

## Voie B — la vidéo sans handle (recommandée)
{:#route-b--video-without-a-handle-recommended}

La plupart des bibliothèques vidéo peuvent vous remettre des **images décodées** au lieu de prendre
une fenêtre, ce qui retire entièrement le handle du problème : `libvlc_video_set_callbacks` (`vmem`)
de LibVLC, l'API de rendu de mpv en mode logiciel, un `appsink` GStreamer, ou FFmpeg, où vous
possédez déjà les images.

Vous recevez un tampon de pixels, vous le copiez dans un `SKBitmap`, et vous le dessinez dans
`OnPaint` comme n'importe quel autre contrôle :

```csharp
public class VideoView : Control
{
    private SKBitmap? frame;

    // Appelé depuis le thread de rappel propre au décodeur avec une image BGRA fraîchement décodée.
    // Demandez à la bibliothèque un pitch de width * 4 quand vous définissez le format de sortie,
    // pour que le tampon entrant soit compact et corresponde à la disposition des lignes de SKBitmap.
    public void PresentFrame (ReadOnlySpan<byte> bgra, int width, int height)
    {
        if (frame is null || frame.Width != width || frame.Height != height) {
            frame?.Dispose ();
            frame = new SKBitmap (width, height, SKColorType.Bgra8888, SKAlphaType.Premul);
        }

        // Une seule copie en bloc, pas pixel par pixel : SKBitmap.SetPixel est un P/Invoke par appel,
        // ce qui pour une image d'un mégapixel coûte des secondes plutôt que des millisecondes.
        bgra.CopyTo (frame.GetPixelSpan ());
        frame.NotifyPixelsChanged ();

        // Invalidate() ne fait PAS de marshaling -- il remonte jusqu'à la fenêtre et la marque sale
        // depuis le thread d'où vous l'appelez. Passez explicitement sur le thread d'interface.
        BeginInvoke (Invalidate);
    }

    protected override void OnPaint (PaintEventArgs e)
    {
        base.OnPaint (e);
        if (frame is not null)
            e.Canvas.DrawBitmap (frame, new SKRect (0, 0, Width, Height));
    }
}
```

Cette esquisse utilise un seul bitmap, donc une peinture peut le lire pendant que le décodeur écrit
l'image suivante — visible sous forme de déchirure (tearing) sous charge, pas sous forme de plantage.
Alterner entre deux bitmaps (écrire dans celui de derrière, publier par une seule affectation de
référence) est la correction habituelle, et vaut la peine pour tout ce qui dépasse une démo.

**Pourquoi c'est le meilleur choix par défaut.** L'image devient une partie de la scène Skia, donc
l'ordre en z, la découpe, le défilement, l'opacité et les transformations se comportent tous comme
pour n'importe quel autre contrôle — aucune des réserves de l'airspace ne s'applique. Cela fonctionne
sur chaque backend, y compris Headless et WASM, ce qui le rend aussi testable : vous pouvez faire des
assertions sur les pixels rendus. Le coût est une copie CPU par image et un décodage logiciel.

## Choisir
{:#choosing}

| | Voie A (hôte natif) | Voie B (rappels d'images) |
|---|---|---|
| Se compose avec le contenu Majorsilence | Non — se dessine par-dessus (GTK 4 : oui) | Oui |
| Backends | Avalonia, Uno, WinForms, WPF, GTK 4 | Tous, y compris Headless et Terminal |
| Plateformes | Windows, X11 réalistement (GTK 4 : aussi Wayland) | Partout |
| Chemin de décodage GPU | Oui | Non (décodage logiciel + copie) |
| Testable en CI | Non | Oui |
| Nécessite un vrai handle de l'OS | Oui (créez-en un — ne le falsifiez jamais) ; GTK 4 : non, un `Gtk.Widget` | Non |

Choisissez **B** par défaut pour la vidéo. Tournez-vous vers **A** quand il vous faut un moteur de
navigateur, du décodage matériel, ou une vue native tierce qui ne sait que dessiner dans une fenêtre.

## Lacunes connues
{:#known-gaps}

- **Uno n'implémente pas `TryGetPlatformHandle`**, donc `WindowBase.PlatformHandle` y vaut
  `IntPtr.Zero` même si les enveloppes publiques d'Uno (`Win32NativeWindow.Hwnd`,
  `X11NativeWindow.WindowId`) permettraient de combler cette lacune. Cela signifie aussi que les ponts
  d'accessibilité de plateforme ne peuvent pas s'attacher sur Uno.
- **Aucun contrôle média ou vidéo n'est livré dans le framework.** Les deux voies ci-dessus sont des
  recommandations d'intégration, pas un `VideoView` que vous pouvez instancier.
- **Le chemin Uno de la voie A est documenté à partir de la surface d'API publique, pas d'une
  application en fonctionnement.** Le chemin Avalonia est exercé dans l'arbre par
  `AvaloniaWebViewHandle`, et le chemin GTK 4 par `Gtk4WebViewHandle` (vérifié sous Wayland contre
  WebKitGTK 6.0) ; l'équivalent Uno ne l'est pas.

Le détail complet se trouve dans
[`docs/native-interop.md`]({{ site.github_url }}/blob/main/docs/native-interop.md) dans le dépôt.
