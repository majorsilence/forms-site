---
layout: docs
lang: fr
title: Foire aux questions
subtitle: Des réponses courtes et directes aux premières questions que l'on se pose sur WinForms multiplateforme.
permalink: /fr/faq/
seo_title: "FAQ WinForms multiplateforme — WinForms peut-il tourner sous Linux ?"
description: >-
  WinForms peut-il tourner sous Linux ou macOS ? WinForms est-il multiplateforme ? Faut-il tout
  réécrire ? Des réponses franches sur la couche de compatibilité WinForms open source.
keywords:
  - winforms linux
  - winforms multiplateforme
  - winforms mac
  - couche de compatibilité winforms
  - alternative à winforms
  - winforms designer multiplateforme
  - winforms vb.net multiplateforme
  - winforms mode sombre thème
  - winforms gtk
  - winforms terminal
  - winforms nativeaot
  - winforms mvvm
priority: "0.8"
faq:
  - question: WinForms peut-il tourner sous Linux ?
    id: can-winforms-run-on-linux
    answer: >-
      Pas tel quel. System.Windows.Forms n'est livré que dans le runtime Windows Desktop et encapsule
      user32.dll et GDI+, si bien qu'un projet WinForms ne compile même pas sous Linux.
      Majorsilence.Forms résout le problème en réimplémentant l'API WinForms sur SkiaSharp et en
      l'hébergeant dans une fenêtre native via Avalonia, ou dans une vraie fenêtre GTK 4, de sorte que
      le même code source C# ou VB.NET se compile et s'exécute nativement sous Ubuntu, Fedora et Debian
      à partir d'un simple build net10.0, sans framework cible -windows.
  - question: WinForms peut-il tourner sous macOS ?
    id: can-winforms-run-on-macos
    answer: >-
      Pas tel quel — il n'y a jamais eu de build macOS de System.Windows.Forms. Majorsilence.Forms
      exécute le même code WinForms dans une vraie NSWindow sur les Mac Apple Silicon comme Intel,
      publié avec les identifiants de runtime ordinaires osx-arm64 et osx-x64.
  - question: Tourne-t-il sur GTK, comme toolkit Linux natif ?
    id: does-it-run-on-gtk-as-a-native-linux-toolkit
    answer: >-
      Oui. Majorsilence.Forms.Gtk4 est un backend GTK 4 construit sur les liaisons gir.core : une vraie
      Gtk.Window sous Wayland ou X11, sélectionnée explicitement avec Gtk4Application.Use avant
      Application.Run, et il tourne aussi sous Windows et macOS partout où le runtime GTK 4 est
      installé. Il s'intègre dans les deux sens via ToGtkWidget et ToGtkWindow, héberge des widgets GTK
      natifs sans le problème d'airspace habituel, et donne à WebBrowser un moteur WebKitGTK. Les
      lacunes connues sont l'absence de contrôle de la position à l'écran, des facteurs d'échelle
      uniquement entiers et des sélecteurs de fichiers qui se rabattent sur les boîtes de dialogue
      propres au framework.
  - question: Peut-il tourner dans un terminal ?
    id: can-it-run-in-a-terminal
    answer: >-
      Oui. Majorsilence.Forms.Terminal héberge un formulaire comme une vue unique plein écran dans une
      console, comme le fait un téléphone, avec un rendu en graphiques Kitty ou en Sixel à la
      résolution réelle en pixels lorsque le terminal les prend en charge, et un repli sur les éléments
      de bloc Unicode ailleurs. La souris et le clavier fonctionnent, Ctrl+C quitte toujours, et il a
      été vérifié dans xterm et WezTerm. Il n'y a pas de sélecteurs de fichiers natifs, d'hébergement
      natif ni de vue web sur ce backend.
  - question: WinForms est-il multiplateforme ?
    id: is-winforms-cross-platform
    answer: >-
      Non. Windows Forms lui-même est réservé à Windows et l'a toujours été ; seul le runtime .NET
      en dessous est multiplateforme. Rendre une application WinForms multiplateforme signifie soit
      réécrire l'interface dans un autre framework, soit émuler Windows avec quelque chose comme Wine,
      soit utiliser une réimplémentation compatible au niveau de l'API telle que Majorsilence.Forms.
  - question: Qu'est-ce qu'une couche de compatibilité WinForms ?
    id: what-is-a-winforms-compatibility-layer
    answer: >-
      Une bibliothèque qui expose les mêmes classes, propriétés et événements que System.Windows.Forms
      — Form, Button, DataGridView, les gestionnaires d'événements, le motif Designer.cs — mais les
      implémente sur quelque chose de portable au lieu de Win32. Votre code source garde sa forme et
      change d'espace de noms ; tout ce qui est en dessous est différent.
  - question: Dois-je réécrire mon application WinForms pour la rendre multiplateforme ?
    id: do-i-have-to-rewrite-my-winforms-app-to-make-it-cross-platform
    answer: >-
      Pas avec Majorsilence.Forms. La migration est essentiellement mécanique — espaces de noms,
      fichiers projet et ressources — et la CLI majorsilence-migrate l'effectue pour vous, sur place et
      sous la forme d'un diff git lisible. Vos formulaires, contrôles, gestionnaires d'événements et
      fichiers Designer sont conservés. Le code qui accède directement à Win32, via WndProc ou
      Control.Handle, doit en revanche être réécrit.
  - question: En quoi Majorsilence.Forms diffère-t-il d'Avalonia, d'Uno Platform ou de .NET MAUI ?
    id: how-is-majorsilenceforms-different-from-avalonia-uno-platform-or-net-maui
    answer: >-
      Ce sont des frameworks XAML : d'excellentes cibles, mais en adopter un signifie reconstruire votre
      interface sous forme de vues XAML et de modèles de vue. Majorsilence.Forms conserve le modèle de
      programmation WinForms et traite le toolkit sous-jacent comme un hôte interchangeable : Avalonia
      ou Uno par défaut, mais aussi GTK 4, le vrai WinForms, WPF ou un terminal — il est construit sur
      eux plutôt qu'en concurrence avec eux. Choisissez XAML directement pour une application partant
      de zéro ; choisissez Majorsilence.Forms lorsqu'une base de code WinForms existante est l'actif que
      vous cherchez à préserver.
  - question: Mes fichiers Designer.cs fonctionnent-ils toujours ?
    id: do-my-designercs-files-still-work
    answer: >-
      Oui. Le motif de code-behind Designer.cs et Designer.vb est préservé tel quel et le code de mise
      en page généré s'exécute sans modification. Ce qui n'existe pas encore, c'est une surface de
      conception visuelle pour l'éditer — il n'y a pas de designer par glisser-déposer, et c'est une
      fonctionnalité souhaitée dans le backlog.
  - question: Prend-il en charge VB.NET aussi bien que C# ?
    id: does-it-support-vbnet-as-well-as-c
    answer: >-
      Oui. Le migrateur réécrit les projets .vb, injecte le constructeur WinForms implicite perdu
      lorsque MyType=Empty cesse de s'appliquer, et génère un accesseur My.Resources. Des parties du
      modèle d'application VB (My.Application, My.Forms) sont également implémentées, et MIGRATION.md
      énumère ce qui ne l'est pas encore et pourquoi. Le guide de formation donne chaque exemple en C#
      et en VB.NET.
  - question: Qu'est-ce qui remplace System.Drawing et GDI+ ?
    id: what-replaces-systemdrawing-and-gdi
    answer: >-
      Majorsilence.Forms.Drawing.Common, une réimplémentation adossée à SkiaSharp couvrant Bitmap, Font,
      Pen, Brush, Icon, Region, StringFormat, Drawing2D, Imaging et la lecture des métafichiers EMF/WMF.
      Les types valeur — Color, Point, Size, Rectangle — ne sont délibérément pas réimplémentés ; ce
      sont les vrais types System.Drawing.Primitives, déjà multiplateformes, qui sont utilisés. C'est
      important parce que System.Drawing.Common lève PlatformNotSupportedException hors de Windows
      depuis .NET 7.
  - question: Puis-je le thématiser, et existe-t-il un mode sombre ?
    id: can-i-theme-it-and-is-there-a-dark-mode
    answer: >-
      Oui. Les thèmes s'écrivent dans un petit sous-ensemble de CSS entièrement documenté : un en-tête
      de thème tel que @theme "Ocean" extends Dark, des tokens racine pour l'accent, l'arrière-plan et
      les propriétés de police, et des règles par type de contrôle avec les états hover, active,
      disabled et focus. Des thèmes clair et sombre sont fournis d'origine, chaque contrôle possède un
      sélecteur CSS, et l'analyseur signale un diagnostic au lieu d'ignorer silencieusement ce qui sort
      du sous-ensemble. L'exemple Theme Studio est un éditeur en direct avec aperçu, et les paquets
      compagnons Theming.WinForms et Theming.Avalonia appliquent la même feuille à de vrais contrôles
      System.Windows.Forms et Avalonia natifs, de sorte qu'un seul thème peut restyler une application
      de migration mixte.
  - question: Majorsilence.Forms est-il gratuit et open source ?
    id: is-majorsilenceforms-free-and-open-source
    answer: >-
      Oui. Il est sous licence MIT, développé au grand jour sur GitHub et publié sur NuGet. Il n'existe
      ni offre commerciale ni licence payante.
  - question: Est-il prêt pour la production ?
    id: is-it-production-ready
    answer: >-
      Il est en bêta. L'API se stabilise et tous les recoins de WinForms ne sont pas couverts, figez
      donc la version de votre paquet. Chaque membre de WinForms et de GDI+ est désormais déclaré, et un
      audit en douze domaines des écarts de comportement, là où des membres ne se comportaient pas
      encore comme WinForms, est traité par phases ; la chaîne clavier, le focus et la validation, les
      vraies boîtes de dialogue, la liaison de données, la vue détaillée de ListView et la plupart des
      familles de contrôles sont déjà livrés. Plusieurs applications réelles ont été forkées dessus,
      parmi lesquelles un clone de Notepad++, DarkUI, PKHeX et RibbonWinForms. Lisez la matrice de
      compatibilité avant de vous engager.
  - question: Prend-il en charge DataGridView ?
    id: does-it-support-datagridview
    answer: >-
      Partiellement, et cela reste la plus grande lacune pour un seul type, même si elle s'est beaucoup
      réduite. Les points d'accroche les plus sollicités sont réels — formatage et peinture des
      cellules, pré- et post-peinture des lignes, analyse des cellules, validation des lignes, contenu
      du presse-papiers, styles de bordure, mode virtuel, nouvelle ligne non validée et réordonnancement
      de l'ordre d'affichage des colonnes. Quelques événements tels que CellStateChanged et
      RowStateChanged sont encore déclarés pour la compatibilité source mais jamais levés. La matrice
      de compatibilité indique exactement lesquels.
  - question: Quelles versions de .NET sont prises en charge ?
    id: which-net-versions-are-supported
    answer: >-
      .NET 8 et .NET 10 pour chaque backend, sans suffixe de framework cible -windows et sans dépendance
      au runtime Windows Desktop. Les paquets de base se compilent aussi pour netstandard2.0, et les
      backends de migration WinForms et WPF ajoutent une cible net48 pour qu'une application
      .NET Framework 4.8 puisse les héberger.
  - question: Fonctionne-t-il avec .NET Framework 4.8 ?
    id: does-it-work-with-net-framework-48
    answer: >-
      Uniquement via les backends de migration réservés à Windows. La bibliothèque de base cible
      netstandard2.0, et Majorsilence.Forms.WinForms comme Majorsilence.Forms.Wpf livrent chacun un
      build net48, si bien qu'une application WinForms ou WPF .NET Framework 4.8 classique peut
      intégrer des contrôles Majorsilence.Forms dès aujourd'hui et passer plus tard à .NET 8 ou 10 et
      à un backend multiplateforme. Les backends Avalonia, Uno, GTK 4 et Headless nécessitent .NET 8
      ou plus récent.
  - question: Peut-il tourner dans un navigateur web ?
    id: can-it-run-in-a-web-browser
    answer: >-
      Oui, via WebAssembly, en utilisant soit la cible navigateur d'Avalonia, soit Uno Platform, et la
      galerie de contrôles complète est publiée comme démonstration en direct dans le navigateur. Le
      navigateur n'a qu'un seul thread et pas de boucle de messages imbriquée, si bien que les appels
      bloquants tels que Form.ShowDialog et MessageBox.Show lèvent une PlatformNotSupportedException
      explicite avant que quoi que ce soit ne s'affiche ; utilisez plutôt Form.ShowDialogAsync,
      MessageBox.ShowAsync et les autres jumeaux asynchrones, et un analyseur Roslyn livré avec le
      framework signale les appels bloquants pour vous. À côté du canevas, le framework maintient un
      DOM d'accessibilité ARIA, un élément par contrôle avec rôle, nom et état, pour que les lecteurs
      d'écran, la recherche dans la page et les outils de test du DOM puissent voir l'interface. Il n'y
      a toujours pas de WebView natif sur cette cible.
  - question: Existe-t-il une prise en charge d'Android et d'iOS, et quelle est sa maturité ?
    id: is-there-an-android-and-ios-story-and-how-mature-is-it
    answer: >-
      Oui, via les cibles Android et iOS d'Avalonia, que le modèle de projet ajoute avec
      --IncludeAndroid et --IncludeiOS. Le clavier à l'écran, les types de saisie, les marges de zone
      sûre, le bouton retour, la suspension et la reprise, le retour haptique et les contrôles de mise
      en page de type téléphone tels que StackPanel, Card et NavigationHost sont en place, et les boîtes
      de dialogue bloquantes lèvent une exception au profit des formes asynchrones, comme dans le
      navigateur. Android a connu une première passe sur appareil réel couvrant le démarrage, les
      touchers, la mise à l'échelle et le défilement tactile ; iOS compile et se lance dans un test de
      fumée sur simulateur en CI, mais personne ne l'a encore exécuté de manière interactive,
      attendez-vous donc à une phase de rodage.
  - question: Puis-je l'utiliser avec MVVM ou CommunityToolkit.Mvvm ?
    id: can-i-use-it-with-mvvm-or-communitytoolkitmvvm
    answer: >-
      Oui. Majorsilence.Forms.Mvvm fournit le câblage au-dessus d'INotifyPropertyChanged et d'ICommand :
      Observe pour les mises à jour unidirectionnelles, BindText, BindChecked, BindSelectedIndex et
      BindValue pour la liaison bidirectionnelle, BindCommand pour les boutons, et un BindingScope pour
      tout libérer. Il nomme les propriétés avec nameof et les lit avec des lambdas, il n'y a donc
      aucune réflexion et rien à enraciner pour le trimming. Il ne dépend d'aucun toolkit, un modèle de
      vue écrit avec CommunityToolkit.Mvvm fonctionne donc sans modification.
  - question: Prend-il en charge le trimming et NativeAOT ?
    id: does-it-support-trimming-and-nativeaot
    answer: >-
      Oui pour les paquets de base, Drawing.Common, Avalonia et Headless, qui se compilent avec
      IsAotCompatible de sorte que tout risque lié au trimming ou à l'AOT fait échouer leur propre
      build, et un test de fumée NativeAOT est publié en CI. L'API classique Control.DataBindings
      repose sur la réflexion, une application élaguée doit donc enraciner les membres du modèle de vue
      qu'elle lie au moyen d'un TrimmerRootDescriptor ; le framework embarque son propre descripteur
      pour les propriétés liables de ses contrôles, et le paquet Mvvm évite entièrement le problème.
      Les lignes netstandard2.0 et GTK 4 ne sont pas encore analysées.
  - question: Comment obtenir un HWND pour un contrôle ?
    id: how-do-i-get-an-hwnd-for-a-control
    answer: >-
      Vous ne le pouvez pas sur les backends multiplateformes, et le framework refuse d'en simuler un.
      Un contrôle est ici un ensemble d'opérations de peinture sur un canevas et non une fenêtre de
      l'OS, Control.Handle vaut donc IntPtr.Zero. Les handles au niveau de la fenêtre sont authentiques
      — WindowBase.PlatformHandle renvoie un vrai HWND sous Windows, une NSWindow sous macOS et un XID
      sous X11. Pour héberger du contenu natif, il existe une couture NativeControlHost prise en
      charge, et le backend WinForms réservé à Windows renvoie bien un vrai HWND parce que la fenêtre
      est réellement une fenêtre WinForms.
  - question: Puis-je migrer un écran à la fois ?
    id: can-i-migrate-one-screen-at-a-time
    answer: >-
      Oui, de plusieurs manières. Le mode double build du migrateur garde un projet compilable à la fois
      contre le vrai WinForms et contre Majorsilence.Forms derrière une seule propriété MSBuild. Sous
      Windows, Majorsilence.Forms.WindowsFormsInterop héberge de vrais formulaires System.Windows.Forms
      dans une application Majorsilence.Forms et inversement, les écrans entiers migrent donc un par un.
      Plus finement encore, les backends WinForms et WPF intègrent des contrôles Majorsilence.Forms dans
      une application existante un contrôle à la fois via ToWinFormsControl ou ToWpfElement, et le
      générateur de source WinFormsShims.Compat permet à du code source System.Windows.Forms non modifié,
      fichiers Designer compris, de compiler contre Majorsilence.Forms pour les bibliothèques de
      contrôles typées sur WinForms.
  - question: Un assistant de codage IA peut-il piloter l'interface ?
    id: can-an-ai-coding-assistant-drive-the-ui
    answer: >-
      Oui. Chaque contrôle est exposé via un arbre d'automatisation textuel, et l'application peut le
      servir sur un point de terminaison WebDriver en boucle locale auquel Selenium ou curl peuvent
      parler. Majorsilence.Forms.Mcp est un outil dotnet publié qui enveloppe ce point de terminaison
      dans un serveur MCP, avec les outils ui_snapshot, ui_find, ui_read, ui_click, ui_type, ui_wait_for
      et ui_screenshot, de sorte qu'un assistant tel que Claude Code peut inspecter et manipuler un
      formulaire en cours d'exécution. Les contrôles à peinture personnalisée publient leur propre
      valeur et leur propre état en implémentant IAutomationStateProvider.
  - question: Les contrôles à peinture personnalisée doivent-ils gérer la mise à l'échelle DPI ?
    id: do-custom-painted-controls-need-to-handle-dpi-scaling
    answer: >-
      Non, et depuis le 2026-10-01 ils ne le devraient pas. ClientRectangle, ClientSize et le canevas de
      peinture sont en unités logiques, comme Width, Height, Bounds et les coordonnées de la souris, et
      le framework met le canevas à l'échelle de l'affichage. Si un contrôle plus ancien appelait
      e.Graphics.ScaleTransform avec e.Scaling, supprimez cet appel, sinon le dessin est mis à l'échelle
      deux fois. Les pixels physiques restent disponibles via ScaledBounds, PaintEventArgs.Scaling et
      LogicalToDeviceUnits, et les événements owner-draw tels que DrawItem et CellPainting transmettent
      toujours des limites en pixels physiques. Testez à l'échelle 2 avec MF_HEADLESS_SCALE=2.
---

{% for entry in page.faq %}
### {{ entry.question }}
{:#{{ entry.id }}}

{{ entry.answer }}
{% endfor %}

## Vous cherchez encore quelque chose ?
{:#still-looking-for-something}

- [WinForms multiplateforme]({{ '/fr/cross-platform-winforms/' | relative_url }}) — l'architecture et
  ce que coûte le modèle de compatibilité.
- [WinForms sous Linux]({{ '/fr/winforms-on-linux/' | relative_url }}) et
  [WinForms sous macOS]({{ '/fr/winforms-on-macos/' | relative_url }}) — le détail plateforme par plateforme.
- [Backends de plateforme]({{ '/fr/backends/' | relative_url }}) — Avalonia, Uno, GTK 4, Terminal, WinForms,
  WPF et Headless côte à côte.
- [Migrer une application WinForms]({{ '/fr/migration/' | relative_url }}) — la réécriture automatisée.
- [Comparatif des alternatives à WinForms]({{ '/fr/winforms-alternatives/' | relative_url }}) — MAUI, Avalonia,
  Uno, Eto.Forms, Wine.
- [Thématisage avec CSS]({{ site.github_url }}/blob/main/docs/theming.md) — le sous-ensemble de thèmes, les
  tokens et le Theme Studio.
- [Matrice de compatibilité]({{ site.github_url }}/blob/main/COMPATIBILITY_MATRIX.md) — la réponse
  contrôle par contrôle à « *X* est-il pris en charge ? ».
- [Ouvrir un ticket]({{ site.github_url }}/issues) — si la réponse n'est pas ici.
