---
layout: docs
lang: fr
title: Automatisation et tests d'interface
subtitle: Un seul arbre d'automatisation — tests in-process, Selenium, lecteurs d'écran et un serveur MCP pour les agents IA — et comment bâtir une vraie suite de tests dessus. Chaque exemple en C# et en VB.NET.
seo_title: "Tests d'interface et automatisation WinForms — CI headless, Selenium et MCP"
description: >-
  Automatisez et testez une application WinForms multiplateforme depuis un seul arbre d'automatisation :
  tests d'interface in-process, CI headless, un serveur W3C WebDriver, lecteurs d'écran (UIA Windows et
  ARIA dans le navigateur), et un serveur MCP qui permet aux agents IA de piloter l'application en cours
  d'exécution.
keywords:
  - tests interface winforms
  - automatiser application winforms
  - winforms selenium webdriver
  - winforms headless ci
  - winforms accessibilité lecteur d'écran
  - tests ui sans affichage
  - mcp
  - agent ia tests interface
priority: "0.8"
permalink: /fr/automation/
---

Majorsilence.Forms expose un **arbre d'automatisation** indépendant du backend : un instantané de la
hiérarchie de contrôles vivante avec les ids, noms, rôles, valeurs, états et limites. Cette page est à la
fois la référence de cet arbre et le guide du praticien pour tester **votre** application par-dessus —
page objects, attentes, les outils du marché, régression visuelle, recettes CI, et la manière dont les
agents IA se branchent sur la même surface.

Le [module 8]({{ '/fr/training/' | relative_url }}#module-8) du guide de formation en est la version courte.

Tout ce qui suit a été exécuté contre la branche main actuelle du framework sous macOS pendant la
rédaction, y compris une vraie session Selenium `RemoteWebDriver`. Là où quelque chose ne fonctionne pas,
c'est écrit.

---

## Sommaire
{:#contents}

- [Un arbre, quatre consommateurs](#tree)
- [Contrôles à dessin personnalisé : publier sa propre valeur et son propre état](#custom-controls)
- [Choisir son niveau](#levels)
- [Quatre prérequis](#prerequisites)
- [Niveau 1 — tests in-process sur le backend headless](#level-1)
- [Attendre, sans `Thread.Sleep`](#waits)
- [Page objects](#page-objects)
- [Niveau 2 — Selenium et le serveur WebDriver](#level-2)
- [Enregistrer des localisateurs avec un inspecteur](#inspector)
- [Niveau 3 — outils natifs Windows (FlaUI, WinAppDriver, Appium)](#level-3)
- [Régression visuelle avec images de référence](#visual)
- [BDD : Reqnroll / SpecFlow par-dessus](#bdd)
- [Recettes CI](#ci)
- [Comment les outils IA se branchent sur tout cela](#ai)
- [Limites et anti-patterns](#limits)
- [Feuille de route](#roadmap)

---

## Un arbre, quatre consommateurs
{:#tree}

L'arbre lit les mêmes limites logiques et le même état que les moteurs de rendu, il se comporte donc à
l'identique sur le backend headless et sur les vrais backends (Avalonia, Uno, GTK 4 et les autres — voir
[Backends de plateforme]({{ '/fr/backends/' | relative_url }})) — **un test écrit contre Headless décrit
ce qu'un utilisateur voit sur Avalonia.** Quatre choses consomment ce modèle unique :

| Consommateur | Package | Ce qu'il vous apporte |
|---|---|---|
| Tests d'interface in-process | `Majorsilence.Forms.Automation` (dans le package principal) | Piloter un formulaire depuis C#/VB sans arithmétique de pixels |
| Automatisation à distance | `Majorsilence.Forms.WebDriver` | Un serveur W3C WebDriver que n'importe quel client Selenium peut piloter — et ce à quoi parle le [serveur MCP](#ai-mcp) pour les agents IA |
| Lecteurs d'écran et loupes (Windows) | `Majorsilence.Forms.WindowsUIAutomation` | Narrateur / NVDA / JAWS sous Windows |
| Lecteurs d'écran et outils DOM (navigateur) | Intégré à `Majorsilence.Forms.Avalonia` sur `net10.0-browser` | Un miroir DOM ARIA transparent des formulaires ouverts à côté du canvas — rôle, nom, état et limites par contrôle, plus des régions live ([détails]({{ '/fr/backends/' | relative_url }}#accessibility-dom-browser)) |

Chacun d'eux voit la même chose, et cette chose est du **texte**. `session.GetPageSource()` rend
l'interface vivante en XML — ce qui rend les localisateurs enregistrables, les instantanés comparables, et
les [agents IA utiles](#ai) sans le moindre pixel :

```xml
<Form name="Login" role="window" type="Form" x="0" y="0" width="400" height="300">
  <Button id="okButton" name="OK" role="button" type="Button"
          value="" enabled="true" visible="true" x="10" y="10" width="100" height="30" />
  <TextBox id="nameBox" name="Full name" role="textbox" type="TextBox"
           value="" enabled="true" visible="true" x="10" y="50" width="200" height="30" />
</Form>
```

La balise est le type du contrôle ; `id` est `Control.Name`, `name` est le nom accessible. Ces attributs
sont exactement ce sur quoi chaque localisateur ci-dessous fait correspondance.

**Tout ce qui est dans l'arbre n'est pas un contrôle.** Les éléments de menu, les boutons de barre d'outils
et les éléments de `ListBox` sont dessinés par leur parent plutôt qu'hébergés comme contrôles enfants ; un
arbre construit depuis la seule hiérarchie de contrôles s'arrêtait donc à la barre ou à la liste — vous
pouviez trouver un `ToolStrip` et n'y rien cliquer, ou trouver une liste et n'y rien lire. Ce sont
désormais des nœuds à part entière, avec leurs propres limites à l'écran :

```xml
<ListBox id="wordList" name="wordList" role="list" type="ListBox" value="Beta" ... >
  <ListBoxItem id="" name="Alpha" role="listitem" type="ListBoxItem" x="11" y="11" width="258" height="17" />
  <ListBoxItem id="" name="Beta"  role="listitem" type="ListBoxItem" x="11" y="28" width="258" height="17" />
</ListBox>
```

Deux choses à savoir sur les éléments. Ils ne portent **pas d'`id`** — un élément n'a pas de `Name` qui lui
soit propre, et un index synthétique se décalerait sous vos pieds à mesure que la liste défile — localisez-les
donc par nom, texte ou XPath (`By.Name ("Beta")`, `//*[@role='listitem']`). Et **l'élément sélectionné se lit
sur la liste**, dont la `value` est son élément sélectionné ; le texte d'un élément reste son texte. Seuls les
éléments visibles après défilement apparaissent, parce qu'un élément hors écran n'a pas de rectangle à cliquer.

*Les éléments de menu et de barre d'outils, les éléments de liste et le correctif de hit-test HiDPI qui
permet de les cliquer sont livrés dans chaque version depuis la 26.0.30 — seul un projet encore figé sur la
26.0.30 voit la barre et la liste sans leur contenu.*

### Contrôles à dessin personnalisé : publier sa propre valeur et son propre état
{:#custom-controls}

Tout ce qui précède fonctionne d'emblée pour les contrôles intégrés — `Button`, `TextBox`, `CheckBox` et
les autres savent déjà rapporter leur propre rôle et leur propre valeur. Un contrôle à dessin personnalisé
(que vous dessinez vous-même dans `OnPaint`) n'a pas une telle inférence sur laquelle se rabattre : sans
rien de plus, il apparaît dans l'arbre avec une valeur `""` et aucun état, juste un rôle deviné d'après
le nom de son type.

**Le rôle et le nom ont déjà leur place**, pour n'importe quel contrôle : `Control.AccessibleRole` et
`Control.AccessibleName` (propriétés de compatibilité WinForms existantes) sont consultés avant l'inférence
intégrée, donc les renseigner fonctionne pour un contrôle personnalisé exactement comme pour n'importe quel
autre — aucune nouvelle API n'est nécessaire pour ces deux-là.

**La valeur et l'état supplémentaire demandent `IAutomationStateProvider`.** Implémentez-le sur votre
contrôle et l'arbre l'utilise au lieu de deviner — le niveau qu'affiche un widget d'état, par exemple :

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
        ["level"] = Level.ToString (CultureInfo.InvariantCulture),
        ["status"] = Status,
    };

    protected override void OnPaint (PaintEventArgs e) { /* dessiner la balise */ }
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation

Public NotInheritable Class BeaconIndicator
    Inherits Control
    Implements IAutomationStateProvider

    Public Property Level As Integer
    Public Property Status As String = "warning"

    Public ReadOnly Property AutomationValue As String Implements IAutomationStateProvider.AutomationValue
        Get
            Return Level.ToString(Globalization.CultureInfo.InvariantCulture)
        End Get
    End Property

    Public ReadOnly Property AutomationState As IReadOnlyDictionary(Of String, String) _
            Implements IAutomationStateProvider.AutomationState
        Get
            Return New Dictionary(Of String, String) From {
                {"level", Level.ToString(Globalization.CultureInfo.InvariantCulture)},
                {"status", Status}
            }
        End Get
    End Property

    Protected Overrides Sub OnPaint(e As PaintEventArgs)
        ' dessiner la balise
    End Sub
End Class
```

Renseignez aussi `AccessibleRole`/`AccessibleName` et l'élément porte les quatre :

**C#**

```csharp
var beacon = new BeaconIndicator {
    Name = "workshopBeacon",             // AutomationId
    AccessibleName = "Workshop beacon",  // Name
    AccessibleRole = AccessibleRole.StatusBar,
    Level = 3,
    Status = "alarm",
};
```

**VB.NET**

```vb
Dim beacon As New BeaconIndicator With {
    .Name = "workshopBeacon",             ' AutomationId
    .AccessibleName = "Workshop beacon",  ' Name
    .AccessibleRole = AccessibleRole.StatusBar,
    .Level = 3,
    .Status = "alarm"
}
```

... ce qui apparaît dans `session.GetPageSource()` exactement comme un contrôle intégré, plus un attribut
`state-{key}` par entrée — interrogeable indépendamment, pas un bloc opaque :

```xml
<BeaconIndicator id="workshopBeacon" name="Workshop beacon" role="statusbar" type="BeaconIndicator"
                 value="3" state-level="3" state-status="alarm"
                 enabled="true" visible="true" x="10" y="10" width="60" height="60" />
```

**C#**

```csharp
session.Find (By.XPath ("//BeaconIndicator[@state-level='3']"));
```

**VB.NET**

```vb
session.Find(By.XPath("//BeaconIndicator[@state-level='3']"))
```

Le même nom `state-{key}` fonctionne aussi via le `getAttribute` de WebDriver — un localisateur capturé
depuis la source de page ou depuis un appel `getAttribute` en direct voit le même attribut. Les clés
doivent être des identifiants simples (lettres, chiffres, `-`/`_`) : une clé inhabituelle est assainie pour
le *nom* d'attribut XML de la même façon qu'un nom de type de contrôle, mais `getAttribute` cherche la clé
non assainie, si bien que les deux divergeraient pour une clé qui en aurait eu besoin.

`AutomationValue` remplace entièrement l'inférence intégrée, il ne s'y mélange pas — un contrôle
personnalisé de type `CheckBox` qui veut `"true"`/`"false"` le rapporte lui-même au lieu de recevoir
gratuitement le propre aiguillage de `ValueOf`. Le `State` de chaque contrôle intégré reste vide ; rien
ici ne change ce que rapporte un contrôle existant (qui n'implémente pas l'interface).

Le même état atteint les autres consommateurs : dans le navigateur, il apparaît sous forme d'attributs
`data-mf-state-*` sur l'élément miroir ARIA du contrôle, de sorte qu'un contrôle personnalisé que vous
rendez automatisable est aussi un contrôle qu'un lecteur d'écran peut décrire.

---

## Choisir son niveau
{:#levels}

Trois portes d'entrée, et elles consomment le *même* arbre d'automatisation — un localisateur écrit à un
niveau est donc valable aux autres.

| Niveau | Ce qui pilote l'application | Fonctionne sans affichage | À utiliser pour |
|---|---|---|---|
| **1. In-process** — `AutomationSession` | Votre code de test, dans le même processus | **Oui** (backend Headless) | Le gros de votre suite. Rapide, débogable, pas de ports, pas de pilotes. |
| **2. À distance** — `WebDriverServer` + Selenium | N'importe quel client W3C WebDriver, via HTTP | Oui | Réutiliser une suite Selenium existante, des langages de test hors .NET, enregistrer des localisateurs avec un inspecteur. |
| **3. Natif Windows** — pont UIA | FlaUI, WinAppDriver, Appium, Accessibility Insights | Non (nécessite une session de bureau Windows) | Vérifier le vrai comportement des lecteurs d'écran, et piloter l'application avec l'outillage que votre équipe QA Windows possède déjà. |

**Prenez le niveau 1 par défaut** pour la couverture et le niveau 3 pour la vérification de
l'accessibilité. Passez au niveau 2 quand quelque chose en dehors de .NET doit piloter l'application.

---

## Quatre prérequis
{:#prerequisites}

Ratez-les et chaque niveau se comporte mal de façon déroutante.

### 1. Nommez chaque contrôle interactif
{:#prerequisites-names}

Les localisateurs s'appuient sur deux propriétés. `Control.Name` devient l'**AutomationId** de l'élément —
le localisateur stable. `Control.AccessibleName` (avec repli sur `Text`, puis `Name`) devient son **Name**.

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

Faites-en une règle de revue de code. La même frappe au clavier achète un localisateur de test *et* la prise
en charge des lecteurs d'écran, et rajouter des noms après coup dans une application existante est de loin
la partie la plus fastidieuse de l'adoption des tests d'interface.

### 2. Forcez une passe de mise en page avant d'automatiser
{:#prerequisites-layout}

Les limites et le hit-testing n'existent pas tant que le formulaire n'a pas été mis en page. Sur le
backend headless, rien n'est mis en page tant que quelque chose ne demande pas une image, donc la première
chose que fait un test est un rendu :

**C#**

```csharp
using var form = new GreetForm ();
HeadlessRenderer.CapturePng (form, 360, 140);   // force la mise en page ; on jette les octets
```

**VB.NET**

```vb
Using form As New GreetForm()
    HeadlessRenderer.CapturePng(form, 360, 140)   ' force la mise en page ; on jette les octets
End Using
```

Sautez cette étape et `Click` ne touche rien, parce que les `Bounds` de chaque contrôle sont encore vides.
Vous n'avez **pas** besoin d'appeler `Show()` — un formulaire non affiché est entièrement automatisable
in-process.

### 3. Exécutez les tests d'interface en série
{:#prerequisites-serial}

Le backend actif (`Platform.Backend`) et `Application.OpenForms` sont globaux au processus. Les tests qui
les partagent ne peuvent pas s'exécuter en parallèle — une boîte de dialogue modale dans un test choisit
son propriétaire dans la liste globale des formulaires ouverts et peut attendre indéfiniment la fenêtre
d'un autre test.

**C# (xUnit)**

```csharp
using Xunit;

// Le backend et Application.OpenForms sont un état global du processus.
[assembly: CollectionBehavior (DisableTestParallelization = true)]
```

NUnit : `[assembly: LevelOfParallelism(1)]` et pas de `[Parallelizable]`. MSTest : laissez
`<Parallelize>` hors de votre `.runsettings`, ou mettez `Workers` à `1`.

Si vous préférez garder le parallélisme pour les tests non liés à l'interface, faites ce que fait la
propre suite du framework : mettez chaque classe qui touche au backend dans une seule collection xUnit
(`[Collection ("Headless")]`), que xUnit exécute en série, et laissez le reste libre. Le framework fait
respecter cette convention par un test
([`HeadlessCollectionConventionTests`]({{ site.github_url }}/blob/main/tests/Majorsilence.Forms.Tests/HeadlessCollectionConventionTests.cs))
qui parcourt l'assembly compilé à la recherche d'appels à `HeadlessRenderer.Use ()` et échoue en nommant
toute classe qui en a fait un sans l'attribut — soixante-dix fichiers avaient dérivé hors de la convention
avant qu'elle ne soit imposée, donc si vous adoptez le motif, copiez aussi le garde-fou.

### 4. Installez le backend Headless une fois par assembly
{:#prerequisites-bootstrap}

**C# — un initialiseur de module est le crochet le plus propre**

```csharp
using System.Runtime.CompilerServices;
using Majorsilence.Forms.Backends;
using Majorsilence.Forms.Headless;

internal static class TestBackend
{
    // S'exécute avant tout test de l'assembly. Le backend Headless n'a aucune affinité
    // avec un dispatcher de thread UI, ce qui le rend sûr sous les threads de travail d'un runner.
    [ModuleInitializer]
    internal static void Init () => Platform.Backend = new HeadlessPlatformBackend ();
}
```

**VB.NET — VB n'a pas d'initialiseur de module**

```vb
Imports Majorsilence.Forms.Backends
Imports Majorsilence.Forms.Headless
Imports Microsoft.VisualStudio.TestTools.UnitTesting

<TestClass>
Public Class TestBackend
    ' VB ne peut pas utiliser <ModuleInitializer> — le compilateur VB n'émet pas
    ' d'initialiseurs de module, donc l'attribut seul ne ferait silencieusement rien et
    ' chaque test s'exécuterait sans backend. Utilisez plutôt le crochet au niveau de
    ' l'assembly de votre framework : MSTest <AssemblyInitialize>, NUnit <SetUpFixture> +
    ' <OneTimeSetUp>, ou une assembly fixture xUnit.
    <AssemblyInitialize>
    Public Shared Sub Init(context As TestContext)
        Platform.Backend = New HeadlessPlatformBackend()
    End Sub
End Class
```

`HeadlessRenderer.Use ()` fait la même chose si vous le préférez, avec un comportement supplémentaire bon
à connaître : en plus d'installer le backend Headless s'il n'est pas déjà actif, **chaque appel fait du
thread appelant le thread UI** du backend Headless. Cela compte sous un runner de tests, qui confie chaque
test au thread de travail disponible : `Application.RunOnUIThread` et la file du backend décident « suis-je
sur le thread UI ? » par id de thread, donc un backend qui ne retiendrait que le *premier* thread à avoir
posé la question traiterait le travail de chaque test suivant comme hors thread. La propre suite du
framework appelle donc `HeadlessRenderer.Use ()` en tête de chaque test plutôt qu'une fois par assembly —
une habitude peu coûteuse à copier si vos tests renvoient du travail vers le thread UI.

> **N'exécutez pas les tests d'interface sur le backend Avalonia.** Le dispatcher d'Avalonia est lié à un
> thread et entre en conflit avec les threads de travail d'un runner de tests. Le backend Headless existe
> précisément pour que votre suite n'ait besoin ni d'un affichage *ni* d'un thread UI — c'est pourquoi la
> propre suite du framework s'exécute dessus.

---

## Niveau 1 — tests in-process sur le backend headless
{:#level-1}

L'API est assez petite pour s'apprendre en une séance.

| Appel | Fait |
|---|---|
| `new AutomationSession (form)` | Enveloppe un formulaire (ou n'importe quel `WindowBase`) |
| `session.Find (by)` / `FindOrThrow (by)` / `FindAll (by)` | Interroge un instantané **frais** à chaque fois |
| `By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` | Localisateurs |
| `session.Click (element)` | Appuie, à travers le vrai pipeline d'entrée |
| `session.SendKeys (element, text)` | Focus + saisie |
| `session.PressKey (Keys.Enter)` | Une touche seule, vers le contrôle qui a le focus |
| `session.Clear (element)` | Vide un contrôle éditable |
| `session.GetText (element)` | Lit la valeur/le texte |
| `session.Root` / `session.GetPageSource ()` | L'arbre entier en objets / en XML |

Les éléments exposent `AutomationId`, `Name`, `Role`, `ControlType`, `Value`, `State` (l'état
supplémentaire propre à un contrôle à dessin personnalisé — voir [ci-dessus](#custom-controls) ; vide pour
chaque contrôle intégré), `Enabled`, `Visible`, `Focused`, `Bounds`, `Children`, `ClickPoint` et
`Descendants()`.

> **Un `AutomationElement` est un instantané immuable — ré-résolvez avant de lire.** C'est le piège que
> tout le monde rencontre, et il est asymétrique : les *actions* sur un élément capturé auparavant
> fonctionnent très bien (`Click`/`SendKeys` sont routés vers le contrôle vivant), mais les *lectures*
> renvoient l'état tel qu'il était au moment de la capture.
>
> ```csharp
> var box = session.FindOrThrow (By.Id ("nameBox"));
> session.SendKeys (box, "Ada");          // fonctionne — l'action atteint le contrôle vivant
> session.GetText (box);                  // "" — cet instantané est antérieur à la saisie
> session.GetText (session.FindOrThrow (By.Id ("nameBox")));   // "Ada" — instantané frais
> ```
>
> Donc : capturez pour les actions si vous voulez, mais refaites toujours un `Find` pour `GetText`,
> `Enabled`, `Visible`, `Value` et `Bounds`. Le [motif page object ci-dessous](#page-objects) rend cela
> automatique en exposant les localisateurs comme *propriétés*.

Un test complet :

**C#**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;
using Xunit;

public class GreetFormTests
{
    [Fact]
    public void Entering_a_name_and_pressing_OK_accepts_the_dialog ()
    {
        using var form = new GreetForm ();
        HeadlessRenderer.CapturePng (form, 360, 140);        // passe de mise en page

        var session = new AutomationSession (form);

        session.SendKeys (session.FindOrThrow (By.Id ("nameBox")), "Ada Lovelace");
        Assert.Equal ("Ada Lovelace", session.GetText (session.FindOrThrow (By.Id ("nameBox"))));

        session.Click (session.FindOrThrow (By.Id ("okButton")));

        Assert.Equal (DialogResult.OK, form.DialogResult);
    }

    [Fact]
    public void OK_is_disabled_until_a_name_is_entered ()
    {
        using var form = new GreetForm ();
        HeadlessRenderer.CapturePng (form, 360, 140);

        var session = new AutomationSession (form);

        // Vérifiez l'état lu depuis l'arbre, pas vos propres références de champs.
        Assert.False (session.FindOrThrow (By.Id ("okButton")).Enabled);
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
            HeadlessRenderer.CapturePng(form, 360, 140)      ' passe de mise en page

            Dim session As New AutomationSession(form)

            session.SendKeys(session.FindOrThrow(By.Id("nameBox")), "Ada Lovelace")
            Assert.AreEqual("Ada Lovelace",
                            session.GetText(session.FindOrThrow(By.Id("nameBox"))))

            session.Click(session.FindOrThrow(By.Id("okButton")))

            Assert.AreEqual(DialogResult.OK, form.DialogResult)
        End Using
    End Sub
End Class
```

`Click` et `SendKeys` passent par le même chemin d'entrée neutre qu'un vrai backend, ils exercent donc le
vrai routage, le vrai focus et la vraie mise en page — pas un raccourci réservé aux tests. C'est ce qui
donne du sens à une assertion headless.

### XPath, quand il n'y a pas d'id stable
{:#level-1-xpath}

`By.XPath` s'exécute contre le même XML que renvoie `GetPageSource()`, donc ce que vous voyez est ce que
vous pouvez faire correspondre :

**C#**

```csharp
session.Find    (By.XPath ("//Button[@id='okButton']"));
session.Find    (By.XPath ("//TextBox[@name='Full name']"));
session.FindAll (By.XPath ("//Panel//Button"));
session.Find    (By.XPath ("(//Button)[2]"));
```

**VB.NET**

```vb
session.Find(By.XPath("//Button[@id='okButton']"))
session.Find(By.XPath("//TextBox[@name='Full name']"))
session.FindAll(By.XPath("//Panel//Button"))
session.Find(By.XPath("(//Button)[2]"))
```

Expressions de sélection d'éléments uniquement — positions, prédicats d'attributs et axe descendant
fonctionnent tous.

### Entrée de plus bas niveau, quand il vous faut un geste
{:#level-1-input}

`AutomationSession` couvre le clic et la saisie. Pour les glissements, le défilement à la molette ou un
appui maintenu pendant un déplacement, descendez d'un niveau vers `HeadlessRenderer`, qui injecte en
coordonnées de fenêtre :

**C#**

```csharp
HeadlessRenderer.MouseDown (form, 40, 60);
HeadlessRenderer.MouseMove (form, 120, 60, MouseButtons.Left);
HeadlessRenderer.MouseUp   (form, 120, 60);

HeadlessRenderer.KeyDown   (form, Keys.Control | Keys.A);
HeadlessRenderer.TextInput (form, "typed text");
```

**VB.NET**

```vb
HeadlessRenderer.MouseDown(form, 40, 60)
HeadlessRenderer.MouseMove(form, 120, 60, MouseButtons.Left)
HeadlessRenderer.MouseUp(form, 120, 60)

HeadlessRenderer.KeyDown(form, Keys.Control Or Keys.A)
HeadlessRenderer.TextInput(form, "typed text")
```

Les coordonnées ici sont **logiques**, et le moteur de rendu les convertit en pixels physiques pour vous —
c'est pourquoi elles continuent de fonctionner quand vous exécutez le même test avec `MF_HEADLESS_SCALE=2`,
la porte HiDPI simulée que la propre CI du framework exécute comme l'une de ses quatre configurations
(Debug, Release, `MF_FORCE_CUSTOM_CHROME=1`, et `MF_FORCE_CUSTOM_CHROME=1 MF_HEADLESS_SCALE=2`). Exécutez
aussi votre suite sous cette porte ; une confusion logique/physique est invisible à l'échelle 1.

---

## Attendre, sans `Thread.Sleep`
{:#waits}

Il n'y a **aucune attente implicite intégrée**, et c'est le bon défaut pour des tests in-process : rien
n'est asynchrone sauf si votre application l'a rendu tel. Mais dès que votre code travaille sur un thread
d'arrière-plan et revient via `Application.RunOnUIThread`, il vous faut pomper et sonder plutôt que dormir.

Écrivez ceci une fois et utilisez-le partout :

**C#**

```csharp
using System.Diagnostics;
using Majorsilence.Forms.Backends;
using Majorsilence.Forms.Automation;

public static class Wait
{
    public static AutomationElement For (AutomationSession session, By by, int timeoutMs = 2000)
        => Until (() => session.Find (by), timeoutMs, $"no element matched {by.Description}");

    public static T Until<T> (Func<T?> probe, int timeoutMs, string message) where T : class
    {
        var clock = Stopwatch.StartNew ();

        do {
            var hit = probe ();
            if (hit is not null)
                return hit;

            // Laisse le travail en file (timers, rappels RunOnUIThread) s'exécuter avant de sonder à nouveau.
            Platform.Backend.DoEvents ();
            Thread.Sleep (10);
        } while (clock.ElapsedMilliseconds < timeoutMs);

        throw new TimeoutException ($"Timed out after {timeoutMs}ms: {message}");
    }
}
```

**VB.NET**

```vb
Imports System.Diagnostics
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Backends

Public Module Wait

    Public Function ForElement(session As AutomationSession, by As By,
                               Optional timeoutMs As Integer = 2000) As AutomationElement
        Return Until(Function() session.Find(by), timeoutMs,
                     $"no element matched {by.Description}")
    End Function

    Public Function Until(Of T As Class)(probe As Func(Of T), timeoutMs As Integer,
                                        message As String) As T
        Dim clock = Stopwatch.StartNew()

        Do
            Dim hit = probe()
            If hit IsNot Nothing Then Return hit

            ' Laisse le travail en file (timers, rappels RunOnUIThread) s'exécuter avant de sonder à nouveau.
            Platform.Backend.DoEvents()
            Thread.Sleep(10)
        Loop While clock.ElapsedMilliseconds < timeoutMs

        Throw New TimeoutException($"Timed out after {timeoutMs}ms: {message}")
    End Function
End Module
```

Puis : `Wait.For (session, By.Id ("resultsGrid"))`, ou
`Wait.Until (() => session.GetText (label) == "Done" ? label : null, 5000, "label never said Done")`.

**Jamais `Thread.Sleep` seul.** Sans `DoEvents()`, le rappel en file ne s'exécute jamais, donc un simple
sommeil rend le test plus lent *et* toujours en échec.

---

## Page objects
{:#page-objects}

`By.Id ("okButton")` éparpillé dans 200 tests, voilà ce qui rend les suites d'interface coûteuses à
maintenir. Enveloppez chaque écran une seule fois.

**C#**

```csharp
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

public sealed class GreetPage
{
    private readonly AutomationSession session;

    public GreetPage (GreetForm form)
    {
        HeadlessRenderer.CapturePng (form, 360, 140);   // passe de mise en page, une fois, ici
        session = new AutomationSession (form);
    }

    // Les localisateurs vivent à un seul endroit.
    private AutomationElement NameBox => session.FindOrThrow (By.Id ("nameBox"));
    private AutomationElement Ok      => session.FindOrThrow (By.Id ("okButton"));
    private AutomationElement Cancel  => session.FindOrThrow (By.Id ("cancelButton"));

    // Les méthodes se lisent comme une intention utilisateur, pas comme des clics.
    public GreetPage EnterName (string name)
    {
        session.Clear (NameBox);
        session.SendKeys (NameBox, name);
        return this;
    }

    public void Accept () => session.Click (Ok);
    public void Dismiss () => session.Click (Cancel);

    public string EnteredName => session.GetText (NameBox);
    public bool CanAccept => Ok.Enabled;
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Headless

Public NotInheritable Class GreetPage
    Private ReadOnly session As AutomationSession

    Public Sub New(form As GreetForm)
        HeadlessRenderer.CapturePng(form, 360, 140)     ' passe de mise en page, une fois, ici
        session = New AutomationSession(form)
    End Sub

    Private ReadOnly Property NameBox As AutomationElement
        Get
            Return session.FindOrThrow(By.Id("nameBox"))
        End Get
    End Property

    Private ReadOnly Property Ok As AutomationElement
        Get
            Return session.FindOrThrow(By.Id("okButton"))
        End Get
    End Property

    Public Function EnterName(name As String) As GreetPage
        session.Clear(NameBox)
        session.SendKeys(NameBox, name)
        Return Me
    End Function

    Public Sub Accept()
        session.Click(Ok)
    End Sub

    Public ReadOnly Property EnteredName As String
        Get
            Return session.GetText(NameBox)
        End Get
    End Property

    Public ReadOnly Property CanAccept As Boolean
        Get
            Return Ok.Enabled
        End Get
    End Property
End Class
```

Les localisateurs en **propriétés, pas en champs**, c'est important : `Find` interroge un instantané frais
à chaque appel, donc une propriété se ré-résout après un changement de l'interface, tandis qu'un champ en
cache devient périmé.

Le test se lit alors comme un comportement :

**C#**

```csharp
using var form = new GreetForm ();
var page = new GreetPage (form);

Assert.False (page.CanAccept);
page.EnterName ("Ada Lovelace").Accept ();
Assert.Equal (DialogResult.OK, form.DialogResult);
```

**VB.NET**

```vb
Using form As New GreetForm()
    Dim page As New GreetPage(form)

    Assert.IsFalse(page.CanAccept)
    page.EnterName("Ada Lovelace").Accept()
    Assert.AreEqual(DialogResult.OK, form.DialogResult)
End Using
```

---

## Niveau 2 — Selenium et le serveur WebDriver
{:#level-2}

`Majorsilence.Forms.WebDriver` héberge un point de terminaison **W3C WebDriver** en HTTP sur l'interface
de bouclage. Comme WebDriver n'est que du HTTP et du JSON, n'importe quel client dans n'importe quel
langage peut piloter votre application de bureau — y compris les bindings Selenium que votre équipe web
utilise déjà.

**C#**

```csharp
using Majorsilence.Forms.WebDriver;

using var server = new WebDriverServer (form, port: 4444);
server.Start ();

Console.WriteLine (server.Url);      // http://127.0.0.1:4444/  (bouclage uniquement)

// … le piloter …

server.Stop ();
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WebDriver

Using server As New WebDriverServer(form, port:=4444)
    server.Start()

    Console.WriteLine(server.Url)    ' http://127.0.0.1:4444/  (bouclage uniquement)

    ' … le piloter …

    server.Stop()
End Using
```

**Commandes prises en charge :** création/suppression de session, recherche d'élément(s), clic, envoi de
touches, effacement, lecture du texte, lecture du nom (rôle), lecture d'attribut, lecture du rectangle,
lecture de l'état activé, **source de page** (`GET …/source`, XML), capture d'écran (PNG, via le moteur de
rendu hors écran), et `GET /status`.

Une asymétrie à connaître : tout ce qui précède fonctionne contre une fenêtre sur n'importe quel backend,
mais **les captures d'écran sont réservées à Headless**. `GET …/screenshot` rend via `HeadlessRenderer`,
qui refuse une fenêtre qu'il n'héberge pas — pointez-le sur une application de bureau sur le backend
Avalonia et il répond `Window is not hosted on the Headless backend`. Lisez plutôt l'arbre, et prenez les
captures dans l'exécution de tests headless, là où vivent de toute façon les [images de
référence](#visual).

**Stratégies de localisation :** `id`, `name`, `tag name` (rôle), `xpath`, `css selector` (formes `#id` et
`[name='…']`), plus les stratégies personnalisées `role`, `type` et `link text`. Les références d'éléments
se ré-résolvent contre un instantané frais à chaque utilisation, en privilégiant l'AutomationId stable —
une référence reste donc valide après que l'interface a changé sous elle.

### Le piloter avec le vrai client Selenium
{:#level-2-selenium}

Les actions sur les éléments sont marshalées sur le thread UI, donc dans un test sans boucle de messages,
vous pompez la file sur le thread principal pendant que les appels HTTP tournent sur un thread de travail.
C'est le motif qu'utilisent les propres tests du framework, et c'est celui à copier :

**C#**

```csharp
using System.Net;
using System.Net.Sockets;
using Majorsilence.Forms.WebDriver;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Remote;
using MFPlatform = Majorsilence.Forms.Backends.Platform;   // voir le piège ci-dessous

static int FreePort ()
{
    var listener = new TcpListener (IPAddress.Loopback, 0);
    listener.Start ();
    var port = ((IPEndPoint) listener.LocalEndpoint).Port;
    listener.Stop ();
    return port;                                   // ne jamais coder 4444 en dur en CI
}

static T RunPumped<T> (Func<T> work)
{
    var task = Task.Run (work);
    while (!task.IsCompleted) {
        MFPlatform.Backend.DoEvents ();            // pomper sur ce thread
        Thread.Sleep (5);
    }
    return task.GetAwaiter ().GetResult ();
}

[Fact]
public void Selenium_can_drive_the_form ()
{
    using var form = new GreetForm ();
    HeadlessRenderer.CapturePng (form, 360, 140);

    using var server = new WebDriverServer (form, FreePort ());
    server.Start ();

    var typed = RunPumped (() => {
        var driver = new RemoteWebDriver (server.Url,
            new ChromeOptions ().ToCapabilities (), TimeSpan.FromSeconds (30));
        try {
            driver.FindElement (By.CssSelector ("#okButton")).Click ();
            driver.FindElement (By.Name ("nameBox")).SendKeys ("Ada Lovelace");
            return driver.FindElement (By.CssSelector ("#nameBox")).Text;
        } finally {
            driver.Quit ();
        }
    });

    Assert.Equal ("Ada Lovelace", typed);
}
```

**VB.NET**

```vb
Imports System.Net
Imports System.Net.Sockets
Imports Majorsilence.Forms.WebDriver
Imports OpenQA.Selenium
Imports OpenQA.Selenium.Chrome
Imports OpenQA.Selenium.Remote
Imports MFPlatform = Majorsilence.Forms.Backends.Platform

Private Shared Function FreePort() As Integer
    Dim listener As New TcpListener(IPAddress.Loopback, 0)
    listener.Start()
    Dim port = CType(listener.LocalEndpoint, IPEndPoint).Port
    listener.Stop()
    Return port
End Function

Private Shared Function RunPumped(Of T)(work As Func(Of T)) As T
    Dim task = Threading.Tasks.Task.Run(work)
    While Not task.IsCompleted
        MFPlatform.Backend.DoEvents()
        Threading.Thread.Sleep(5)
    End While
    Return task.GetAwaiter().GetResult()
End Function
```

Trois pièges, tous découverts en l'exécutant réellement :

1. **`Platform` est ambigu.** `Majorsilence.Forms.Backends.Platform` entre en collision avec
   `OpenQA.Selenium.Platform` — CS0104 dès que vous importez les deux espaces de noms. Créez un alias pour
   l'un des deux, comme ci-dessus.
2. **Utilisez `GetDomAttribute`, pas `GetAttribute`.** Le `GetAttribute` historique de Selenium 4 exécute
   un atome JavaScript via `/session/{id}/execute/sync`, ce pour quoi une application native n'a pas
   d'équivalent — il lève `NotImplementedException`. `GetDomAttribute` frappe le simple point de terminaison
   `/attribute/{name}`, qui est implémenté, et renvoie `id`, `name`, `role`, `type`, `value`, `enabled`,
   `visible` et les limites.
3. **Préférez `By.CssSelector ("#id")` et `By.XPath`.** Le client .NET de Selenium n'envoie pas
   `using: "name"` pour `By.Name` — il le réécrit en sélecteur CSS `*[name ="x"]`. Cette forme est
   acceptée, mais `By.CssSelector ("#okButton")` et XPath sont les choix les moins surprenants. Tout ce qui
   requiert JavaScript (`ExecuteScript`, les attentes implicites bâties dessus) est indisponible par
   construction.

### Ou sautez complètement les bindings
{:#level-2-http}

Pour un test de fumée — ou depuis un langage sans installation Selenium — le protocole brut tient en trois
appels :

```bash
SID=$(curl -s -XPOST 127.0.0.1:4444/session -d '{}' | jq -r .value.sessionId)

curl -s 127.0.0.1:4444/session/$SID/source                       # l'arbre XML
curl -s -XPOST 127.0.0.1:4444/session/$SID/element \
     -d '{"using":"css selector","value":"#okButton"}'            # recherche
curl -s -XPOST 127.0.0.1:4444/session/$SID/element/$EID/click -d '{}'
```

Python, sans aucune connaissance du framework :

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Remote("http://127.0.0.1:4444", options=webdriver.ChromeOptions())
print(driver.page_source)                          # l'arbre XML
driver.find_element(By.CSS_SELECTOR, "#okButton").click()
driver.quit()
```

Les capabilities sont ignorées — le serveur accorde toujours une session, passez donc ce que votre client
exige.

---

## Enregistrer des localisateurs avec un inspecteur
{:#inspector}

Comme le serveur expose une **source de page** XML *et* une stratégie `xpath` évaluée exactement contre
cette source, n'importe quel inspecteur de type Appium peut afficher l'arbre d'éléments vivant par-dessus
une capture d'écran et vous laisser capturer des localisateurs en cliquant sur les nœuds. La boucle qu'un
inspecteur utilise n'est que trois commandes que le serveur implémente :

| Étape | Commande | Renvoie |
|---|---|---|
| Prendre un instantané de l'arbre | `GET /session/{id}/source` | XML (voir [l'exemple ci-dessus](#tree)) |
| Afficher l'interface | `GET /session/{id}/screenshot` | PNG en base64 |
| Confirmer un localisateur | `POST /session/{id}/element` + `…/attribute/{name}` | l'élément / ses attributs |

C'est le chemin d'enregistrement recommandé : Selenium IDE enregistre des événements DOM dans un navigateur
et n'a aucun moyen de s'attacher à une application native.

| Paramètre | Valeur |
|---|---|
| Remote Host | `127.0.0.1` |
| Remote Port | ce que vous avez passé à `WebDriverServer` |
| Remote Path | `/` |
| Protocol | `http`, sans SSL |
| Capabilities | n'importe quel objet JSON — la correspondance des capabilities est ignorée |

Privilégiez les localisateurs capturés dans cet ordre : **`id`** (correspond à `Control.Name` ; les
références d'éléments se ré-résolvent d'abord contre lui) → **`xpath`** → `name` / `role` / `type`.

Réserves : il s'agit d'un serveur W3C WebDriver, pas d'un serveur Appium complet, donc les points de
terminaison propres à Appium (paramètres, gestes, gestion d'application) renvoient 404 — un client
WebDriver générique est l'inspecteur le plus fiable. Les limites sont des coordonnées client logiques, donc
une superposition capturée à un DPI différent peut être décalée même quand les localisateurs sont justes.
Une fenêtre par session, et les contrôles masqués sont omis de l'arbre.

---

## Niveau 3 — outils natifs Windows (FlaUI, WinAppDriver, Appium)
{:#level-3}

`Majorsilence.Forms.WindowsUIAutomation` projette le même arbre sur **Windows UI Automation**. C'est ce
qui permet au Narrateur, à NVDA et à JAWS de lire votre application — et cela signifie aussi que les outils
de test basés sur UIA peuvent la piloter sans protocole particulier.

**C#**

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // doit être affiché d'abord — il faut un handle natif
WindowsUIAutomation.Enable (form);  // se détache automatiquement à la fermeture de la fenêtre
```

**VB.NET**

```vb
Imports Majorsilence.Forms.WindowsUIAutomation

form.Show()                         ' doit être affiché d'abord — il faut un handle natif
WindowsUIAutomation.Enable(form)    ' se détache automatiquement à la fermeture de la fenêtre
```

> **Ceci ne compile pas hors de Windows** — vérifié, pas théorisé. Hors de Windows, le package est livré
> sous forme de stub vide, donc l'espace de noms n'existe pas et vous obtenez **CS0234**, pas une
> `PlatformNotSupportedException` à l'exécution. Multi-ciblez (`net10.0;net10.0-windows`) et protégez
> avec `#if WINDOWS`, ou gardez l'appel dans un projet réservé à Windows.

Chaque contrôle devient un élément UIA avec **Name**, **AutomationId** (`Control.Name`), **ControlType**,
**IsEnabled**, **HasKeyboardFocus** et un **BoundingRectangle** à l'écran. Les changements de focus lèvent
des événements UIA de changement de focus.

C'est indépendant du backend — cela fonctionne pour tout hôte Windows qui fournit un handle de fenêtre
natif — et le déplacement du focus clavier déclenche un événement UIA de changement de focus, ce qui fait
qu'un lecteur d'écran annonce le nouveau contrôle et qu'une loupe suit le curseur. Les changements de
valeur du contrôle qui a le focus lèvent un événement de changement de propriété.

Un `Label` dont le `LiveSetting` est `Polite` ou `Assertive` est une région live : son élément rapporte le
**LiveSetting** d'UIA, et changer son texte lève l'événement **LiveRegionChanged** d'UIA, ce qui fait que
le Narrateur et NVDA lisent le nouveau texte d'une étiquette d'état sans que l'utilisateur s'y déplace
(comme le fait `Label.OnTextChanged` en amont). Le **HelpText** d'un élément est l'`AccessibilityObject.Help`
de son contrôle, donc le `HelpString` d'un gestionnaire `Control.QueryAccessibilityHelp` est ce qu'un
lecteur d'écran lit comme aide du contrôle. Les deux sont compilés contre les assemblys de référence
Windows mais n'ont pas été entendus depuis un vrai lecteur d'écran.

**Ce qui fonctionne aujourd'hui, et à quoi s'attendre :** le pattern `Invoke` (boutons) est actif, donc
un script FlaUI ou WinAppDriver peut trouver des contrôles et les cliquer. `Value` (texte, combo) et
`Toggle` (case à cocher) sont exposés **en lecture** ; la prise en charge de l'écriture est une phase
ultérieure — *définir* du texte via UIA peut donc ne pas encore fonctionner, et la saisie via les surfaces
de niveau 1 ou 2 est le chemin fiable. Pas dans cette première mouture : les événements de valeur par
frappe sur `TextBox` (le contrôle ne lève pas encore `TextChanged`, donc les lecteurs d'écran se rabattent
sur leur propre écho des caractères saisis — la valeur du champ est tout de même annoncée à la prise de
focus), les événements de changement de structure, et les sous-éléments de contrôle (onglets individuels,
lignes de liste).

À cause de cette séparation, la répartition pragmatique des tâches sous Windows est : **piloter avec le
niveau 1 ou 2, vérifier l'accessibilité avec le niveau 3.**

La logique pure d'arbre et de rôles est testée unitairement dans le framework lui-même
(`Majorsilence.Forms.WindowsUIAutomation.Tests`, sur la CI Windows), mais l'aller-retour COM complet
nécessite une session de bureau Windows interactive — il ne peut pas être vérifié en headless. Lancez
votre application, activez le pont avec `Enable`, puis inspectez avec **Accessibility Insights** ou
`inspect.exe` pour voir l'arbre comme le voit un lecteur d'écran. La vérification qui compte vraiment est
d'activer le **Narrateur** et de parcourir la fenêtre avec Tab : chaque contrôle doit être annoncé avec son
nom et son rôle, et un bouton doit s'activer depuis le lecteur d'écran.

Les ponts Linux (AT-SPI) et macOS (NSAccessibility) sur le même arbre sont sur la feuille de route. Si
vous avez une obligation d'accessibilité sur ces plateformes, planifiez en conséquence dès maintenant.

**Le navigateur est couvert différemment.** Sur `net10.0-browser`, le backend Avalonia reflète le même
arbre dans un DOM d'éléments transparents et traversables aux clics à côté du canvas — un par contrôle,
avec rôle, nom, état et limites ARIA, plus des régions `aria-live` pour les mêmes annonces
d'étiquette/état/dialogue que lève le pont UIA. C'est ce que voit un lecteur d'écran, la recherche dans la
page ou un outil de test basé sur le DOM. Cela ne demande aucun appel de votre part (désactivable avec le
commutateur AppContext `Majorsilence.Forms.Browser.DisableAccessibilityDom`), et c'est vérifié en lisant le
DOM dans Chrome headless en CI plutôt que par un vrai lecteur d'écran. La
[page des backends]({{ '/fr/backends/' | relative_url }}#accessibility-dom-browser) documente les rôles,
les états et les règles des régions live.

---

## Régression visuelle avec images de référence
{:#visual}

`HeadlessRenderer.CapturePng` rend un formulaire hors écran en octets PNG. C'est votre primitive d'image
de référence, et elle ne nécessite aucun affichage :

**C#**

```csharp
[Fact]
public void GreetForm_matches_its_golden_image ()
{
    using var form = new GreetForm ();
    var actual = HeadlessRenderer.CapturePng (form, 360, 140);

    var goldenPath = Path.Combine (AppContext.BaseDirectory, "Golden", "greetform.png");

    if (!File.Exists (goldenPath) || Environment.GetEnvironmentVariable ("UPDATE_GOLDEN") == "1") {
        Directory.CreateDirectory (Path.GetDirectoryName (goldenPath)!);
        File.WriteAllBytes (goldenPath, actual);
        return;                                   // la première exécution enregistre ; ne passe jamais silencieusement ensuite
    }

    var expected = File.ReadAllBytes (goldenPath);

    if (!expected.AsSpan ().SequenceEqual (actual)) {
        // Écrit les octets réels pour que la CI puisse les joindre comme artefact.
        File.WriteAllBytes (Path.ChangeExtension (goldenPath, ".actual.png"), actual);
        Assert.Fail ($"Render differs from {goldenPath}. Actual written alongside it.");
    }
}
```

**VB.NET**

```vb
<TestMethod>
Public Sub GreetForm_matches_its_golden_image()
    Using form As New GreetForm()
        Dim actual = HeadlessRenderer.CapturePng(form, 360, 140)

        Dim goldenPath = Path.Combine(AppContext.BaseDirectory, "Golden", "greetform.png")

        If Not File.Exists(goldenPath) OrElse
           Environment.GetEnvironmentVariable("UPDATE_GOLDEN") = "1" Then
            Directory.CreateDirectory(Path.GetDirectoryName(goldenPath))
            File.WriteAllBytes(goldenPath, actual)
            Return
        End If

        Dim expected = File.ReadAllBytes(goldenPath)

        If Not expected.SequenceEqual(actual) Then
            File.WriteAllBytes(Path.ChangeExtension(goldenPath, ".actual.png"), actual)
            Assert.Fail($"Render differs from {goldenPath}. Actual written alongside it.")
        End If
    End Using
End Sub
```

Règles pratiques, apprises de la manière ennuyeuse :

- **Régénérez délibérément, jamais automatiquement.** Une porte d'environnement `UPDATE_GOLDEN=1` (ou
  l'équivalent dans [Verify](https://github.com/VerifyTests/Verify) / ApprovalTests, qui vous offrent cela
  plus un lanceur d'outil de diff gratuitement) empêche « le test est passé au vert » de vouloir dire « la
  référence a bougé ».
- **Publiez toujours le `.actual.png`** comme artefact CI. Un échec de comparaison d'octets sans image jointe
  est un rapport de bogue sur lequel personne ne peut agir.
- **Faites des images de référence pour une poignée d'écrans, pas pour tous.** Elles attrapent les
  régressions de mise en page et de thème ; elles échouent aussi à chaque changement de pixel intentionnel,
  gardez donc l'ensemble petit et à forte valeur.
- **Les polices diffèrent d'un OS à l'autre.** Figez les images de référence sur une seule plateforme en CI
  (Linux est la moins chère) plutôt que de maintenir une référence par OS.
- **Ne faites pas d'images de référence à `MF_HEADLESS_SCALE=2`** sauf si vous conservez aussi une référence
  2× — vérifiez plutôt la mise en page *proportionnellement* dans les exécutions mises à l'échelle, et
  gardez la comparaison de pixels à l'échelle 1.

Pour des instantanés sémantiques (non pixel), `session.GetPageSource()` est une référence bien plus
stable : elle change quand la structure change et ignore le rendu. Prenez un instantané de ce XML pour les
vérifications « l'interface a-t-elle gardé la même forme » et réservez les PNG à « a-t-elle toujours la bonne
apparence ».

---

## BDD : Reqnroll / SpecFlow par-dessus
{:#bdd}

Rien de spécial n'est requis — les page objects font le travail, et les définitions d'étapes restent
minces.

```gherkin
Feature: Greeting

  Scenario: A name is required
    Given the greeter is open
    When I press OK without entering a name
    Then I am warned that a name is required

  Scenario: Entering a name accepts the dialog
    Given the greeter is open
    When I enter the name "Ada Lovelace"
    And I press OK
    Then the dialog is accepted
```

**C#**

```csharp
using Reqnroll;

[Binding]
public sealed class GreetingSteps : IDisposable
{
    private readonly GreetForm form = new ();
    private GreetPage? page;

    [Given ("the greeter is open")]
    public void GivenTheGreeterIsOpen () => page = new GreetPage (form);

    [When ("I enter the name {string}")]
    public void WhenIEnterTheName (string name) => page!.EnterName (name);

    [When ("I press OK")]
    public void WhenIPressOk () => page!.Accept ();

    [Then ("the dialog is accepted")]
    public void ThenTheDialogIsAccepted ()
        => Assert.Equal (DialogResult.OK, form.DialogResult);

    public void Dispose () => form.Dispose ();
}
```

**VB.NET**

```vb
Imports Reqnroll

<Binding>
Public NotInheritable Class GreetingSteps
    Implements IDisposable

    Private ReadOnly form As New GreetForm()
    Private page As GreetPage

    <Given("the greeter is open")>
    Public Sub GivenTheGreeterIsOpen()
        page = New GreetPage(form)
    End Sub

    <When("I enter the name {string}")>
    Public Sub WhenIEnterTheName(name As String)
        page.EnterName(name)
    End Sub

    <Then("the dialog is accepted")>
    Public Sub ThenTheDialogIsAccepted()
        Assert.AreEqual(DialogResult.OK, form.DialogResult)
    End Sub

    Public Sub Dispose() Implements IDisposable.Dispose
        form.Dispose()
    End Sub
End Class
```

Gardez le parallélisme désactivé au niveau de l'assembly ([ci-dessus](#prerequisites-serial)) — cela
s'applique aussi aux runners BDD.

---

## Recettes CI
{:#ci}

Pas d'affichage, pas de téléchargement de pilotes, pas de serveur X. Une suite d'interface n'est qu'un
`dotnet test`.

### GitHub Actions
{:#ci-github}

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest          # aucun affichage requis — backend Headless
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x

      - run: dotnet build --configuration Release
      - run: dotnet test --configuration Release --no-build --logger "trx;LogFileName=test.trx"

      # Mise en page à 2x. Garder un job/une étape séparés pour qu'un échec de mise à l'échelle soit lisible.
      - name: UI tests at simulated HiDPI
        env:
          MF_HEADLESS_SCALE: "2"
        run: dotnet test --configuration Release --no-build --filter "Category=Scaling"

      - name: Upload failed golden images
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: golden-image-diffs
          path: |
            **/*.actual.png
            **/Golden/**
```

Ajoutez un job Windows uniquement pour ce qui a réellement besoin de Windows — la passe
UIA/accessibilité :

```yaml
  accessibility:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x
      - run: dotnet test tests/YourApp.Accessibility.Tests --configuration Release
```

### Azure DevOps
{:#ci-azure}

```yaml
pool:
  vmImage: ubuntu-latest

steps:
  - task: UseDotNet@2
    inputs:
      version: 10.0.x

  - script: dotnet build --configuration Release
    displayName: Build

  - script: dotnet test --configuration Release --no-build --logger trx
    displayName: Test

  - task: PublishTestResults@2
    condition: always()
    inputs:
      testResultsFormat: VSTest
      testResultsFiles: '**/*.trx'
```

### Jenkins
{:#ci-jenkins}

Jenkins demande un peu plus de configuration que les services hébergés, parce qu'il ne sait pas lire la
sortie de tests native de .NET et parce que les agents Windows sont généralement installés d'une façon qui
casse l'automatisation d'interface. Les deux sont des correctifs à faire une seule fois.

**D'abord, choisissez un éditeur de résultats de tests.** `dotnet test` écrit du TRX, qu'aucun éditeur
Jenkins ne lit nativement — vous ajoutez donc un package de logger à chaque projet de test et pointez
l'étape correspondante vers sa sortie. Trois combinaisons fonctionnent ; choisissez selon le plugin que
votre Jenkins possède déjà :

| Étape d'édition | Package de logger | Plugin |
|---|---|---|
| `junit` | `JunitXml.TestLogger` | Plugin JUnit — présent dans l'installation Jenkins standard, donc aucun travail de plugin n'est nécessaire |
| `nunit` | `NunitXml.TestLogger` | Plugin NUnit — une installation séparée, mais beaucoup d'équipes .NET l'utilisent déjà |
| `mstest` | *aucun* — utilisez `--logger trx` | Plugin MSTest — une installation séparée ; convertit le TRX, et c'est la seule option si vous ne pouvez pas ajouter une référence de package |

```xml
<!-- l'un de ceux-ci, dans chaque projet de test -->
<PackageReference Include="JunitXml.TestLogger" Version="8.0.0" />
<PackageReference Include="NunitXml.TestLogger" Version="8.0.0" />
```

Les deux loggers sont interchangeables sur tout ce qui compte ici : même syntaxe
`--logger "<name>;LogFilePath=…"`, même jeton `{assembly}`, même réserve sur les espaces de noms ci-dessous.
Seuls le dialecte de sortie et l'étape Jenkins diffèrent. Sans le package, `--logger junit` **fait
échouer le build** avec `Could not find a test logger with AssemblyQualifiedName, URI or FriendlyName 'junit'`
— pas un no-op silencieux, ce qui rend au moins l'oubli évident dès la première fois.

Puis le `Jenkinsfile` (variante JUnit ; l'échange pour NUnit est [ci-dessous](#ci-jenkins-nunit)) :

```groovy
pipeline {
    agent none

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '10'))
    }

    environment {
        DOTNET_CLI_TELEMETRY_OPTOUT = '1'
        DOTNET_NOLOGO               = '1'
    }

    stages {
        stage('Verify') {
            parallel {

                stage('Headless UI suite') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/dotnet/sdk:10.0'
                            // dotnet a besoin d'un HOME inscriptible ; le montage garde les restaurations
                            // NuGet au chaud entre les builds (NUGET_PACKAGES se résout sous HOME).
                            args '-e DOTNET_CLI_HOME=/tmp -e HOME=/tmp ' +
                                 '-v $HOME/.nuget/packages:/tmp/.nuget/packages'
                        }
                    }
                    steps {
                        sh 'dotnet build --configuration Release'

                        // Pas d'affichage, pas de Xvfb, pas de téléchargement de pilotes — le backend Headless.
                        sh '''
                            dotnet test --configuration Release --no-build \
                                --logger "junit;LogFilePath=$WORKSPACE/artifacts/junit/{assembly}.xml"
                        '''

                        // Mise en page à 2x. Invocation séparée pour qu'un échec de mise à l'échelle soit
                        // lisible dans le rapport de tests Jenkins au lieu d'être mêlé à l'exécution principale.
                        withEnv(['MF_HEADLESS_SCALE=2']) {
                            sh '''
                                dotnet test --configuration Release --no-build \
                                    --filter "Category=Scaling" \
                                    --logger "junit;LogFilePath=$WORKSPACE/artifacts/junit/{assembly}.hidpi.xml"
                            '''
                        }
                    }
                    post {
                        always {
                            junit testResults: 'artifacts/junit/*.xml', allowEmptyResults: false
                            // Les échecs d'images de référence sont impossibles à examiner sans l'image.
                            archiveArtifacts artifacts: '**/*.actual.png', allowEmptyArchive: true
                        }
                    }
                }

                stage('Accessibility (Windows)') {
                    // Doit être un agent exécuté dans une session de bureau interactive — voir ci-dessous.
                    agent { label 'windows-desktop' }
                    steps {
                        // Triple guillemets : une chaîne Groovy à guillemets simples ne peut pas s'étendre sur plusieurs lignes.
                        // Les barres obliques conviennent à dotnet sous Windows.
                        bat '''
                            dotnet test tests/YourApp.Accessibility.Tests --configuration Release ^
                                --logger "junit;LogFilePath=%WORKSPACE%/artifacts/junit/uia.xml"
                        '''
                    }
                    post {
                        always {
                            junit testResults: 'artifacts/junit/uia.xml', allowEmptyResults: true
                        }
                    }
                }
            }
        }
    }
}
```

#### Utiliser plutôt le plugin NUnit
{:#ci-jenkins-nunit}

Si votre Jenkins possède déjà le plugin NUnit, remplacez le package par `NunitXml.TestLogger` et changez
deux lignes — le nom du logger et l'étape d'édition. Notez que le nom du paramètre diffère : `junit` prend
`testResults`, `nunit` prend `testResultsPattern`.

```groovy
steps {
    sh '''
        dotnet test --configuration Release --no-build \
            --logger "nunit;LogFilePath=$WORKSPACE/artifacts/nunit/{assembly}.xml"
    '''
}
post {
    always {
        nunit testResultsPattern: 'artifacts/nunit/*.xml', failedTestsFailBuild: true
        archiveArtifacts artifacts: '**/*.actual.png', allowEmptyArchive: true
    }
}
```

Cela produit du XML NUnit v3 `<test-run>`, que le plugin convertit à l'entrée — la tendance des tests
Jenkins, l'historique par test et la navigation dans les échecs se comportent donc exactement comme avec
`junit`. Il n'y a aucune raison fonctionnelle de préférer l'un à l'autre ; utilisez le plugin que vous
maintenez déjà.

#### Quatre particularités de Jenkins bonnes à connaître
{:#ci-jenkins-gotchas}

Chacune coûte un après-midi à découvrir autrement.

- **Mettez vos classes de test dans un espace de noms.** Les deux loggers dérivent le `classname` de chaque
  test de son espace de noms. Une classe dans l'espace de noms global ressort en
  `classname="UnknownNamespace.UnknownType"` — vérifié en exécutant les deux loggers côte à côte — donc
  chaque test atterrit dans un seul seau sans signification et le navigateur de tests de Jenkins ne peut
  rien regrouper. Une classe dans `namespace MyApp.UiTests` ressort en
  `classname="MyApp.UiTests.GreetFormTests"` et le rapport devient navigable.
- **`{assembly}` dans `LogFilePath` se développe en nom de l'assembly de test**, donc plusieurs projets de
  test n'écrasent pas les résultats les uns des autres. Créez le répertoire ou laissez le logger le faire,
  et pointez `junit` vers le glob plutôt que vers un fichier unique.
- **L'agent Windows doit s'exécuter dans une session de bureau interactive.** Le pont UIA Windows a besoin
  d'une vraie fenêtre native et d'un bureau auquel s'attacher. Un agent Jenkins installé comme *service
  Windows* n'a pas de session interactive, donc les applications fenêtrées et chaque assertion UIA échouent
  d'une manière qui ressemble à des bogues du framework. Lancez plutôt cet agent depuis une session
  utilisateur connectée (une tâche planifiée à l'ouverture de session exécutant le JAR de l'agent, ou
  l'agent démarré manuellement sur une machine dédiée). L'étape Linux n'a pas cette exigence — c'est tout
  l'intérêt du backend Headless.
- **Chaque bloc `agent` reçoit son propre espace de travail.** `--no-build` ne fonctionne qu'au sein d'un
  seul agent ; d'un agent à l'autre, la sortie du build n'est pas là. Soit vous construisez dans chaque
  étape (comme ci-dessus), soit vous faites explicitement `stash`/`unstash` de la sortie. Ajouter un
  `agent` par étape à un pipeline qui n'en utilisait qu'un auparavant est la cause habituelle d'un soudain
  échec « project file not found » ou « assembly missing ».

Si votre Jenkins n'a pas Docker, remplacez l'agent `docker` par un simple `agent { label 'linux' }` et
installez le SDK .NET sur le nœud (ou utilisez l'outil `dotnetsdk` du plugin **.NET SDK Support** et
enveloppez les étapes dans `withDotNet`). Rien ne change dans la suite de tests — elle n'a besoin d'aucun
affichage dans un cas comme dans l'autre.

> **Ce qui a été vérifié ici, et ce qui ne l'a pas été.** La moitié .NET a été exécutée : les deux loggers
> (`JunitXml.TestLogger` et `NunitXml.TestLogger`, 8.0.0), le message d'échec quand le package manque, le
> jeton `{assembly}` se développant en un fichier par assembly de test, et le comportement espace de
> noms → `classname` ci-dessus. Les étapes Jenkins et les paramètres des plugins viennent de la
> documentation de ces plugins plutôt que d'un contrôleur en direct — vérifiez `testResults` /
> `testResultsPattern` contre les versions de plugins que vous avez installées.

### La porte que les gens sautent
{:#ci-wasm}

Si vous livrez vers le navigateur, **compiler la cible wasm n'est pas la preuve qu'elle fonctionne.**
`dotnet publish` est ce qui exécute le pipeline wasm-tools (l'édition de liens native emcc/wasm-opt), et
seul un vrai démarrage dans un navigateur prouve le bundle. Publiez-le et faites un test de fumée avec
Chromium headless :

```yaml
  wasm:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: 10.0.x }
      - run: dotnet workload install wasm-tools
      - run: dotnet publish src/YourApp.Wasm -c Release -o out
      - run: npx playwright install --with-deps chromium
      # Servir out/wwwroot et vérifier que le canvas se rend / qu'il n'y a pas d'erreurs console.
      - run: node scripts/wasm-smoke.mjs
```

Notez l'ironie, bonne à connaître : Playwright ne peut pas piloter l'interface de votre *application*
(pas de DOM — voir [limites](#limits)), mais c'est exactement le bon outil pour vérifier que le bundle
WebAssembly démarre.

---

## Comment les outils IA se branchent sur tout cela
{:#ai}

Ce framework est inhabituellement accueillant pour les assistants et agents de codage IA, pour une raison
structurelle :

> **L'arbre d'automatisation est du texte.** `session.GetPageSource()` renvoie l'interface vivante en XML,
> avec les ids, noms, rôles, valeurs, états et limites.

Un modèle peut *lire* votre interface utilisateur sans pixels, sans OCR et sans modèle de vision. Cela
transforme « piloter l'interface graphique » d'un problème de computer-use en un problème de texte — ce qui
est à la fois bien moins cher et bien plus fiable.

```xml
<Form name="Greeter" role="window" type="Form" x="0" y="0" width="360" height="140">
  <Label   id="promptLabel" name="Your name:" role="label" ... />
  <TextBox id="nameBox" name="Full name" role="textbox" value="" enabled="true" ... />
  <Button  id="okButton" name="OK" role="button" enabled="false" ... />
</Form>
```

Quatre motifs d'intégration, du moins cher au plus cher.

### 1. Shell + curl — zéro travail d'intégration
{:#ai-shell}

Tout agent capable d'exécuter des commandes shell peut déjà piloter votre application : démarrez le serveur
WebDriver, puis laissez-le faire des `curl` sur les points de terminaison du [niveau 2](#level-2-http).
Pas de bindings, pas de SDK, pas de serveur MCP. C'est le moyen le plus rapide de laisser un assistant de
codage *vérifier son propre travail* sur une application en cours d'exécution, et c'est généralement par là
qu'il faut commencer.

Donnez à l'agent les trois commandes (`/source`, `/element`, `/element/{id}/click`) et il peut explorer.

### 2. Pointez l'assistant vers la boucle de test
{:#ai-loop}

Le motif à la plus forte valeur ne demande aucune nouvelle surface d'API — c'est que **toute la boucle se
referme sans affichage** :

1. L'agent lit la sortie de `GetPageSource()` (ou un test existant) pour apprendre les noms des contrôles.
2. Il écrit un test avec des localisateurs `By.Id`.
3. Il exécute `dotnet test`.
4. Il lit l'échec, modifie, recommence.

Cela fonctionne dans un conteneur, en CI, et sur une machine sans session graphique — exactement là où
tournent les agents de codage. Comparez avec l'automatisation d'interface pilotée par les pixels, où l'agent
ne peut pas du tout voir le résultat sans écran.

Un court `AGENTS.md` / `CLAUDE.md` dans votre dépôt suffit pour rendre un assistant bon à cet exercice :

```markdown
## Exécuter et tester l'interface

- Les tests d'interface s'exécutent en headless : `dotnet test`. Aucun affichage requis. N'ajoutez jamais
  `Thread.Sleep` ; utilisez l'assistant `Wait` dans `tests/Support/Wait.cs` (il pompe la file du backend).
- Le backend est installé une fois par assembly de test dans `TestBackend.Init` — ne le définissez pas par test.
- Les tests doivent rester en série : `Platform.Backend` et `Application.OpenForms` sont globaux.
- Les localisateurs viennent de `Control.Name` (`By.Id("okButton")`). Si un contrôle n'a pas de `Name`,
  ajoutez-en un plutôt que de localiser par texte ou par index.
- Appelez `HeadlessRenderer.CapturePng(form, w, h)` une fois avant d'automatiser un formulaire — cela force la mise en page.
- Pour voir l'interface comme la voit la couche d'automatisation : `session.GetPageSource()` affiche l'arbre en XML.
- Vérifiez l'*effet* (état, DialogResult, sortie rendue), jamais qu'un membre existe.
```

### 3. Une surface d'outils MCP — pour les assistants interactifs
{:#ai-mcp}

Pour laisser un assistant piloter une application *en cours d'exécution* de manière conversationnelle,
exposez la surface d'automatisation sous forme d'outils
[Model Context Protocol](https://modelcontextprotocol.io). **Le framework en livre un** —
[`Majorsilence.Forms.Mcp`]({{ site.github_url }}/tree/main/tools/Majorsilence.Forms.Mcp), un outil global
`dotnet` publié qui parle MCP sur stdin/stdout et pilote l'application via le point de terminaison
WebDriver du [niveau 2](#level-2) :

```
dotnet tool install -g Majorsilence.Forms.Mcp
```

```
assistant  ──MCP/stdio──▶  majorsilence-mcp  ──HTTP/loopback──▶  your app (WebDriverServer)
```

Faire le pont par HTTP plutôt que de se lier au framework est ce qui le rend indépendant de la version et
du backend : il pilote n'importe quelle application Majorsilence.Forms qui démarre un `WebDriverServer`,
et n'a jamais à marshaler sur le thread d'interface de quelqu'un d'autre.

La configuration côté application tient donc aux deux lignes dont vous avez déjà besoin pour Selenium :

```csharp
using var server = new WebDriverServer (form, 4444);
server.Start ();
```

Pointez ensuite un client dessus. Claude Code :

```
claude mcp add majorsilence-ui -- majorsilence-mcp --port 4444
```

Tout client qui lance lui-même des serveurs MCP (Claude Desktop, éditeurs, frameworks d'agents) prend la
même commande dans son propre format de configuration :

```json
{
  "mcpServers": {
    "majorsilence-ui": {
      "command": "majorsilence-mcp",
      "args": ["--port", "4444"]
    }
  }
}
```

Options : `--port <port>` (interface de bouclage, 4444 par défaut), `--url <url>` pour une URL de base
complète, ou la variable d'environnement `MAJORSILENCE_MCP_URL` ; `--help` affiche le même résumé.

Les outils qu'il expose :

| Outil | Arguments | Renvoie |
|---|---|---|
| `ui_snapshot` | — | tout l'arbre de contrôles en XML |
| `ui_find` | `target`, `strategy` | id, nom, rôle, type, valeur, texte, activé/visible, limites |
| `ui_read` | `target`, `strategy` | ce que le contrôle affiche actuellement |
| `ui_click` | `target`, `strategy` | une confirmation, ou la raison du refus |
| `ui_type` | `target`, `text`, `strategy`, `clear` | ce que le contrôle affiche ensuite |
| `ui_wait_for` | `target`, `strategy`, `timeoutMs`, `requireEnabled` | l'état de disponibilité, ou la raison de l'expiration de l'attente |
| `ui_screenshot` | — | un PNG de la fenêtre — [fenêtres hébergées par Headless uniquement](#level-2) |

Trois décisions là-dedans valent la peine d'être copiées si vous construisez le vôtre :

- **Chaque outil prend un localisateur, pas un handle d'élément.** Chaque appel ré-résout ce sur quoi il
  agit, donc le [piège de l'instantané périmé](#level-1) n'a aucun moyen de mordre : il n'y a aucun handle
  qu'un modèle pourrait conserver d'un tour à l'autre.
- **`strategy` vaut `id` par défaut** — le `Name` du contrôle — et une stratégie non reconnue est rejetée
  par son nom plutôt que transmise telle quelle. Le serveur se rabat sur une recherche par *nom* pour tout
  ce qu'il ne reconnaît pas, donc une faute de frappe non vérifiée chercherait silencieusement de la
  mauvaise façon et répondrait « not found ».
- **`ui_click` et `ui_type` sont annotés destructifs, les autres en lecture seule**, ce qui est ce qu'un
  hôte montre à l'utilisateur quand il décide quoi approuver automatiquement.

**Quelque chose sur quoi le pointer.**
[`samples/AutomationTarget`]({{ site.github_url }}/tree/main/samples/AutomationTarget) est une petite
application construite exactement pour cela : elle démarre elle-même le point de terminaison et affiche
les commandes pour la piloter (la ligne MCP `claude mcp add`, un constructeur Selenium `RemoteWebDriver`,
et un `curl` pour `/status`).

```
dotnet run --project samples/AutomationTarget -- --webdriver 4444
```

`--webdriver <port>` choisit le port ; `--no-webdriver` la lance comme une application ordinaire. Ses
contrôles exercent chacun une chose qu'un client doit savoir gérer — une zone de texte à écrire et à lire
(`nameBox`), un bouton dont le gestionnaire change un libellé (`greetButton` → `greetingLabel`), un bouton
définitivement désactivé (`lockedButton`, pour que vous puissiez voir un refus plutôt qu'un faux succès),
un bouton Submit qui ne devient actif qu'une fois la case `agreeCheck` cochée (c'est à cela que sert
`ui_wait_for`), une `logList` dont les lignes sont des nœuds `listitem`, et un libellé délibérément *sans
nom*, pour que vous puissiez voir à quoi ressemble un `id` vide dans l'arbre. Chaque action est ajoutée au
journal visible et à stdout, pour que vous puissiez vérifier que ce que le client prétend avoir fait est
bien ce que l'application a vu. Un bon premier exercice : *« tape 'Grace Hopper' dans nameBox, clique sur
greetButton et lis greetingLabel »* doit renvoyer `Hello, Grace Hopper!`.

Deux choses qu'elle enseigne à la dure : elle tourne sur le backend Avalonia, donc `ui_screenshot` est
refusé (les captures d'écran sont [réservées à Headless](#level-2)) ; et ses éléments de liste n'ont pas
d'`id`, ils se localisent donc par nom, par texte ou par XPath.

Les deux moitiés sont sur NuGet — l'outil, et `Majorsilence.Forms.WebDriver` pour l'application testée —
donc rien n'a besoin d'être construit depuis le dépôt. Si vous voulez tout de même exécuter le serveur
depuis les sources (pour le modifier, par exemple), l'équivalent est :

```
dotnet run --project tools/Majorsilence.Forms.Mcp -- --port 4444
```

#### Ou hébergez la surface dans votre propre processus
{:#ai-mcp-inprocess}

Si vous préférez exposer ces outils depuis l'intérieur de l'application — ou les brancher sur un framework
d'agents qui n'est pas MCP — la partie spécifique au framework est un mince adaptateur par-dessus
`AutomationSession` :

**C#**

```csharp
using Majorsilence.Forms;
using Majorsilence.Forms.Automation;
using Majorsilence.Forms.Headless;

// Une instance par application testée. Chaque méthode est appelée sur le thread d'interface.
public sealed class UiAgentSurface
{
    private readonly Form form;
    private readonly AutomationSession session;

    public UiAgentSurface (Form form)
    {
        this.form = form;
        session = new AutomationSession (form);
    }

    public string Snapshot () => session.GetPageSource ();

    public string Click (string id)
    {
        var element = session.Find (By.Id (id));
        if (element is null)
            return $"no element with id '{id}'";       // une simple erreur sur laquelle le modèle peut agir
        if (!element.Enabled)
            return $"'{id}' is disabled";

        session.Click (element);
        return "ok";
    }

    public string Type (string id, string text)
    {
        var element = session.FindOrThrow (By.Id (id));
        session.Clear (element);
        session.SendKeys (element, text);

        // Ré-résoudre pour lire : l'élément capturé est un instantané d'avant la saisie.
        return session.GetText (session.FindOrThrow (By.Id (id)));
    }

    public string Read (string id) => session.GetText (session.FindOrThrow (By.Id (id)));

    public byte[] Screenshot (int width, int height)
        => HeadlessRenderer.CapturePng (form, width, height);
}
```

**VB.NET**

```vb
Imports Majorsilence.Forms
Imports Majorsilence.Forms.Automation
Imports Majorsilence.Forms.Headless

Public NotInheritable Class UiAgentSurface
    Private ReadOnly form As Form
    Private ReadOnly session As AutomationSession

    Public Sub New(form As Form)
        Me.form = form
        session = New AutomationSession(form)
    End Sub

    Public Function Snapshot() As String
        Return session.GetPageSource()
    End Function

    Public Function Click(id As String) As String
        Dim element = session.Find(By.Id(id))
        If element Is Nothing Then Return $"no element with id '{id}'"
        If Not element.Enabled Then Return $"'{id}' is disabled"

        session.Click(element)
        Return "ok"
    End Function

    Public Function Type(id As String, text As String) As String
        Dim element = session.FindOrThrow(By.Id(id))
        session.Clear(element)
        session.SendKeys(element, text)

        ' Ré-résoudre pour lire : l'élément capturé est un instantané d'avant la saisie.
        Return session.GetText(session.FindOrThrow(By.Id(id)))
    End Function

    Public Function Screenshot(width As Integer, height As Integer) As Byte()
        Return HeadlessRenderer.CapturePng(form, width, height)
    End Function
End Class
```

Deux notes de conception qui comptent plus que la plomberie :

- **Renvoyez les erreurs sous forme de texte, pas d'exceptions.** « no element with id 'okButton' » est
  quelque chose dont un modèle peut se remettre ; une trace de pile qui traverse une frontière d'outil ne
  l'est généralement pas.
- **Marshalez sur le thread d'interface.** Si votre application hôte exécute une vraie boucle de messages,
  enveloppez chaque appel dans `Application.RunOnUIThread`. Le serveur WebDriver le fait déjà pour vous —
  ce qui est un bon argument pour envelopper *celui-ci* plutôt que `AutomationSession` quand l'application
  est un processus de bureau en cours d'exécution.

**Ou passez-vous entièrement de MCP :** comme le point de terminaison WebDriver est du simple HTTP sur
l'interface de bouclage, un assistant disposant d'un accès shell ([motif 1](#ai-shell)) ou un serveur MCP
générique capable de HTTP peut piloter la même application sans aucun processus supplémentaire.

### 4. Votre propre boucle d'agent, in-process
{:#ai-agentloop}

Si vous intégrez un agent *dans* votre produit — un assistant « fais ça pour moi » qui manipule
l'interface — le même adaptateur devient des définitions d'outils dans une boucle d'utilisation d'outils
ordinaire. Avec le [SDK C# d'Anthropic](https://github.com/anthropics/anthropic-sdk-csharp)
(`dotnet add package Anthropic`), les outils sont des schémas JSON bruts et
`client.Beta.Messages.ToolRunner(...)` exécute la boucle pour vous, en appelant vos fonctions et en
renvoyant les résultats jusqu'à ce que le modèle s'arrête :

```csharp
using System.Text.Json;
using Anthropic;
using Anthropic.Models.Messages;

var clickTool = new Tool {
    Name = "ui_click",
    Description = "Click a control in the running application by its automation id. "
                + "Call ui_snapshot first to discover valid ids.",
    InputSchema = new () {
        Properties = new Dictionary<string, JsonElement> {
            ["id"] = JsonSerializer.SerializeToElement (
                new { type = "string", description = "The control's automation id, e.g. okButton" }),
        },
        Required = ["id"],
    },
};

// Modèle par défaut : claude-opus-5. Puis dispatchez les appels d'outils vers UiAgentSurface ci-dessus.
```

Donnez à chaque outil une description **prescriptive** — dites *quand* l'appeler, pas seulement ce qu'il
fait (« Appelez `ui_snapshot` avant votre premier `ui_click` dans un écran que vous n'avez pas encore
inspecté »). Cette seule habitude fait plus pour la fiabilité que n'importe quelle quantité de réglage de
prompt.

### Garde-fous pour les tests écrits par des agents
{:#ai-guardrails}

Les agents sont vraiment bons pour écrire ce genre de test. Ils sont aussi bons pour écrire des tests qui
passent sans rien prouver, alors relisez spécifiquement ces points :

- **Vérifiez des effets, pas une existence.** `Assert.NotNull(session.Find(By.Id("okButton")))` prouve
  que le contrôle existe ; cela ne prouve pas que cliquer dessus fait quoi que ce soit. C'est plus
  important ici que dans la plupart des frameworks, parce que les membres non implémentés
  [sont des no-op sûrs plutôt que de lever une exception]({{ '/fr/training/' | relative_url }}#module-3-stub-policy) —
  un test qui vérifie seulement qu'un membre est accessible passera contre un stub.
- **Méfiez-vous des assertions assouplies pour rendre un test vert.** Un `Assert.Equal` modifié est un
  changement de comportement déguisé. Faites le diff des assertions, pas seulement du nombre de tests.
- **Ne laissez jamais un agent régénérer les images de référence.** Gardez `UPDATE_GOLDEN` comme une
  action humaine ; une référence que l'agent a réécrite pour correspondre à sa propre sortie ne teste rien.
- **Exigez un `Name` plutôt qu'un index.** `By.XPath("(//Button)[3]")` fonctionne jusqu'à ce que quelqu'un
  ajoute un bouton. Si un contrôle n'a pas de `Name`, la bonne correction est d'en ajouter un.
- **Faites-lui lire la source de la page avant de localiser.** Les localisateurs inventés à partir du code
  source, plutôt qu'à partir de l'arbre réel, sont la cause la plus fréquente des tests instables écrits par
  des agents.

---

## Limites et anti-patterns
{:#limits}

**Playwright ne peut pas piloter votre application de bureau.** Il automatise des moteurs de navigateur via
le Chrome DevTools Protocol contre un DOM ; une application Majorsilence.Forms sur un backend de bureau
se rend nativement avec Skia et n'a ni DOM ni moteur de navigateur auquel s'attacher. La surface HTTP
*pourrait* être exercée depuis le client de requêtes API de Playwright, en la traitant comme un service
HTTP — mais ce n'est pas de l'automatisation de navigateur et cela n'offre rien de plus qu'un simple client
WebDriver. Utilisez plutôt [le serveur WebDriver](#level-2). (Playwright *est* le bon outil pour faire un
test de fumée vérifiant que votre [bundle WebAssembly démarre](#ci-wasm) — un autre travail.)

**La cible navigateur est l'exception partielle.** Là, le backend Avalonia maintient un
[miroir DOM ARIA](#tree) des formulaires ouverts, donc un outil DOM *peut* localiser des contrôles — par
rôle et nom, ou par `[data-mf-automation-id="okButton"]` — et lire leur état. La saisie appartient toujours
au canvas : les éléments du miroir sont en `pointer-events: none`, donc cliquez sur le rectangle englobant
de l'élément (`locator.boundingBox ()` puis `page.mouse.click`) plutôt qu'avec un clic DOM. C'est suffisant
pour un test de fumée dans le navigateur ; le gros d'une suite appartient toujours au niveau 1.

D'autres frontières à connaître avant de concevoir une suite autour d'elles :

| Limite | Conséquence |
|---|---|
| Une fenêtre par session WebDriver | Pas de changement de frame ou de fenêtre ; les flux multi-fenêtres appartiennent au niveau 1 |
| Les captures d'écran nécessitent le backend Headless | `GET …/screenshot` échoue contre une fenêtre hébergée sur le bureau ([ci-dessus](#level-2)) ; capturez dans l'exécution headless |
| Les en-têtes d'onglets et les cellules de grille ne sont pas dans l'arbre | Les éléments de menu, de barre d'outils et de liste y sont ([ci-dessus](#tree)) ; les onglets et les cellules de `DataGridView` ont encore besoin de leurs propres nœuds |
| Pas d'état de sélection par élément | Lisez la `value` de la liste pour son élément sélectionné ; un élément ne peut pas encore rapporter « sélectionné » par lui-même |
| Les contrôles masqués sont omis de l'arbre | Vous ne pouvez pas faire d'assertion sur le contenu d'un contrôle invisible — vérifiez plutôt la visibilité |
| Pas de point de terminaison d'exécution JavaScript | Les API Selenium bâties sur `execute/sync` (`ExecuteScript`, `GetAttribute`, attentes basées sur JS) sont indisponibles ; utilisez `GetDomAttribute` et votre propre sondage |
| Pas d'attentes implicites | Apportez votre propre [assistant `Wait`](#waits) |
| Patterns d'écriture UIA incomplets | Définissez le texte via le niveau 1/2 ; utilisez le niveau 3 pour vérifier l'annonce, pas pour piloter la saisie |
| Le package UIA est Windows uniquement à la compilation | Protégez avec `#if WINDOWS` ou isolez dans un projet Windows uniquement |
| `AutomationElement` est un instantané immuable | Les actions acceptent un élément capturé ; **les lectures doivent ré-résoudre** ([ci-dessus](#level-1)) |
| Les tests partagent l'état global du backend | Exécution en série, toujours |

Et les deux habitudes qui causent l'essentiel de la douleur :

- **Ne faites pas d'assertions sur la géométrie en pixels à l'échelle 1.** Les propres échecs HiDPI du
  framework venaient presque entièrement d'une seule confusion — unités logiques contre unités physiques.
  Depuis le 2026-10-01, la surface publique est uniformément **logique** : `Bounds`, `ClientRectangle`,
  `ClientSize`, `MouseEventArgs`, `GetTabRect` et le canvas de peinture (`OnPaint`, `e.ClipRectangle`)
  partagent tous une même unité, et le framework met le canvas à l'échelle pour vous (un contrôle
  personnalisé qui appelle encore `e.Graphics.ScaleTransform (e.Scaling, e.Scaling)` met désormais à
  l'échelle deux fois — supprimez-le). Les pixels physiques ne sont accessibles que là où ils sont nommés
  comme tels — la famille `Scaled*` (`ScaledWidth`, `ScaledBounds`, …), `PaintEventArgs.Scaling`,
  `LogicalToDeviceUnits`, les tampons arrière et les bitmaps capturés — plus l'exception restante : les
  **événements owner-draw** (`DrawItem`, `DrawNode`, `CellPainting`) vous donnent encore des limites en
  pixels physiques. Les deux systèmes d'unités sont identiques à l'échelle 1, donc les mélanger est
  invisible jusqu'à ce qu'un écran mis à l'échelle se présente. Faites des assertions proportionnelles,
  et exécutez la porte `MF_HEADLESS_SCALE=2`.
- **Ne testez pas sur le backend Avalonia sous un runner.** Cela semblera fonctionner puis se bloquera
  (deadlock) ou se comportera de façon incohérente, parce que son dispatcher est lié à un thread. Headless
  existe pour cela.

---

## Feuille de route
{:#roadmap}

- ✅ **Pont Windows UI Automation** — lecteurs d'écran, loupes et outils UIA existants (FlaUI,
  Appium/WinAppDriver) sans protocole personnalisé.
- Compléter les patterns UIA : prise en charge en écriture de `Value`/`Toggle`, événements de changement
  de structure, et événements de valeur par frappe pour `TextBox` (en levant `TextChanged` depuis
  l'éditeur).
- ✅ **DOM d'accessibilité du navigateur** — sur `net10.0-browser`, le même arbre est reflété en éléments
  ARIA avec des régions live, de sorte que les lecteurs d'écran, la recherche dans la page et les outils de
  test DOM peuvent voir l'interface
  ([détails]({{ '/fr/backends/' | relative_url }}#accessibility-dom-browser)). Pas encore entendu via un
  vrai lecteur d'écran — vérifié en lisant le DOM dans Chrome headless.
- Ponts **AT-SPI (Linux)** et **NSAccessibility (macOS)** sur le même arbre.
- ✅ **Éléments non-contrôles** : les éléments de menu, les boutons de barre d'outils et les éléments de
  `ListBox` sont dans l'arbre, avec leurs propres limites, et cliquables.
- ✅ **Les contrôles à dessin personnalisé peuvent publier leur propre valeur et un état supplémentaire**
  (`IAutomationStateProvider`) — voir [ci-dessus](#custom-controls).
- ✅ **Régions live et texte d'aide dans UIA** — `Label.LiveSetting` lève LiveRegionChanged ;
  `QueryAccessibilityHelp` alimente HelpText.
- Étendre les rôles et les états (sélection, développer/réduire, plages de valeurs) — un élément de
  `ListBox` ne peut pas encore rapporter lui-même qu'il est sélectionné, c'est pourquoi la liste porte cette
  information ; le champ `State` propre à `IAutomationStateProvider` est là pour qu'un contrôle intégré
  l'utilise aussi à cette fin, pas encore câblé pour `ListBox`.
- Exposer les éléments peints restants : en-têtes d'onglets, cellules de `DataGridView`, nœuds d'arbre.
- Une couche d'ergonomie de plus haut niveau `Majorsilence.Forms.Testing` — assistants fluides et
  assertions sur images de référence, pour que l'[assistant d'attente](#waits) et la
  [plomberie des images de référence](#visual) ci-dessus cessent d'être à votre charge.

---

## Pour aller plus loin
{:#next}

- [Guide de formation, module 8]({{ '/fr/training/' | relative_url }}#module-8) — ce contenu en un coup
  d'œil, au sein du programme plus large.
- [Module 10]({{ '/fr/training/' | relative_url }}#module-10-ci) — la liste complète des portes CI pour
  une application, dérive de migration comprise.
- [Backends de plateforme]({{ '/fr/backends/' | relative_url }}) — ce qu'est le backend Headless, et la
  couture qui permet à une seule suite de tests de couvrir toutes les cibles.
