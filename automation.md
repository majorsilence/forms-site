---
layout: docs
title: Accessibility & automation
subtitle: One automation tree, three consumers — UI tests, Selenium, and screen readers.
---

Majorsilence.Forms exposes a backend-neutral **automation tree**: a snapshot of the live control
hierarchy with ids, names, roles, values, state, and bounds. Three things consume that one model.

| Consumer | Package | What it gives you |
|---|---|---|
| In-process UI tests | `Majorsilence.Forms.Automation` (in the core package) | Drive a form from C# without pixel math |
| Remote automation | `Majorsilence.Forms.WebDriver` | A W3C WebDriver server any Selenium client can drive |
| Screen readers & magnifiers | `Majorsilence.Forms.WindowsUIAutomation` | Narrator / NVDA / JAWS on Windows |

The tree reads the same logical bounds and state the renderers use, so it behaves identically on the
headless and real backends — a test written against Headless describes what a user sees on Avalonia.

## Making controls findable

Locators key off two properties you're already setting:

- `Control.Name` → the element's **AutomationId**. The stable locator — prefer this one.
- `Control.AccessibleName` (falling back to `Text`, then `Name`) → the element's **Name**.

```csharp
var okButton = new Button { Name = "okButton", Text = "OK" };
var nameBox  = new TextBox { Name = "nameBox", AccessibleName = "Full name" };
```

Roles are inferred from the control type — `button`, `textbox`, `checkbox`, `radio`, `combobox`,
`list`, `label`, `tablist`, `window`, and so on — unless you set `Control.AccessibleRole` yourself.

## In-process UI tests

```csharp
using Majorsilence.Forms.Automation;

var session = new AutomationSession (form);

session.Click    (session.FindOrThrow (By.Id ("okButton")));
session.SendKeys (session.FindOrThrow (By.Id ("nameBox")), "Ada Lovelace");

var value = session.GetText (session.FindOrThrow (By.Id ("nameBox")));   // "Ada Lovelace"
```

`By.Id` / `By.Name` / `By.Role` / `By.Type` / `By.Text` / `By.XPath` locate elements, and `Find`,
`FindOrThrow`, and `FindAll` each query a fresh snapshot. Actions — `Click`, `SendKeys`, `PressKey`,
`Clear` — go through the same neutral input pipeline a real backend uses, so they exercise the real
routing, focus, and layout.

`By.XPath` evaluates against the tree's XML rendering, the same shape `session.GetPageSource ()`
returns:

```csharp
session.Find    (By.XPath ("//Button[@id='okButton']"));
session.Find    (By.XPath ("//TextBox[@name='Full name']"));
session.FindAll (By.XPath ("//Panel//Button"));
```

## Remote automation with Selenium

`Majorsilence.Forms.WebDriver` hosts a minimal **W3C WebDriver** endpoint over HTTP. Because
WebDriver is just HTTP and JSON, any WebDriver client in any language can drive the app.

```csharp
using Majorsilence.Forms.WebDriver;

var server = new WebDriverServer (form, port: 4444);
server.Start ();          // listens on http://127.0.0.1:4444/
// ... run your Selenium / WebDriver client against server.Url ...
server.Stop ();
```

Then point a `RemoteWebDriver` at it and use the normal API:

```csharp
driver.FindElement (By.CssSelector ("#okButton")).Click ();
driver.FindElement (By.Name ("nameBox")).SendKeys ("Ada Lovelace");
```

Supported commands: new/delete session, find element(s), click, send keys, clear, get text, get name
(role), get attribute, get rect, get enabled, page source (XML), screenshot (PNG via the offscreen
renderer), and `GET /status`. Locator strategies are `id`, `name`, `tag name` (role), `xpath`,
`css selector` (`#id` and `[name='…']` forms), plus custom `role`, `type`, and `link text`. Element
references re-resolve against a fresh snapshot on every use, preferring the stable AutomationId, so
values stay live after edits.

Element actions are marshalled onto the UI thread, so the server can run on its own thread while your
app pumps its message loop as usual. In a headless test there is no message loop, so pump the queue
while the WebDriver calls run on a worker:

```csharp
var task = Task.Run (RunWebDriverFlow);
while (!task.IsCompleted) { Platform.Backend.DoEvents (); Thread.Sleep (5); }
```

## Recording locators with an inspector

Because the server exposes XML page source *and* an xpath strategy evaluated against that exact
source, any Appium-style inspector can render the live element tree, overlay it on a screenshot, and
let you capture locators by clicking nodes. This is the recommended recording path — Selenium IDE
records DOM events inside a browser and has no way to attach to a native app.

The whole loop is three commands:

| Step | Command | Returns |
|---|---|---|
| Snapshot the tree | `GET /session/{id}/source` | XML (tag = control type) |
| Show the UI | `GET /session/{id}/screenshot` | base64 PNG |
| Confirm a locator | `POST /session/{id}/element` | the element |

Every node carries the attributes you build locators from:

```xml
<Form name="Login" role="window" type="Form" x="0" y="0" width="400" height="300">
  <Button id="okButton" name="OK" role="button" type="Button"
          value="" enabled="true" visible="true" x="10" y="10" width="100" height="30" />
  <TextBox id="nameBox" name="Full name" role="textbox" type="TextBox"
           value="" enabled="true" visible="true" x="10" y="50" width="200" height="30" />
</Form>
```

Point the inspector at `127.0.0.1`, your chosen port, path `/`, plain `http` — the server ignores
capability matching and always grants a session. Prefer locators in this order: **`id`** (maps to
`Control.Name`, and what element references re-resolve against first), then **`xpath`** against the
exact XML you were shown, then `name` / `role` / `type` as coarser fallbacks.

Caveats worth knowing: this is a W3C WebDriver server, not a full Appium server, so Appium-only
endpoints (settings, gestures, app management) return `404`; bounds are logical client coordinates,
so an overlay can be offset if the screenshot was captured at a different DPI; it handles one
session/window at a time; and hidden controls are omitted from the tree.

## Screen readers & magnifiers (Windows)

`Majorsilence.Forms.WindowsUIAutomation` projects the same tree onto **Windows UI Automation**, so
Narrator, NVDA, and JAWS can navigate, read, and activate controls, and focus-following magnifiers
track the caret. It's backend-neutral — it works for any Windows host that supplies a native window
handle — and Windows-only; off Windows the package is an empty stub.

```csharp
using Majorsilence.Forms.WindowsUIAutomation;

form.Show ();                       // the window must be shown first (it needs a native handle)
WindowsUIAutomation.Enable (form);  // detaches automatically when the window closes
```

Each control becomes a UIA element with **Name**, **AutomationId**, **ControlType**, **IsEnabled**,
**HasKeyboardFocus**, and a screen **BoundingRectangle**. The `Invoke` pattern (buttons) is live;
`Value` (text/combo) and `Toggle` (checkbox) are exposed for reading. Moving keyboard focus fires a
UIA focus-changed event — that's what makes a screen reader announce the new control and a magnifier
follow it.

Not in this first cut: per-keystroke value events for `TextBox`, structure-changed events, and
sub-control items such as individual tabs or list rows.

## What about Playwright?

**Playwright is not a fit.** It automates browser engines over the Chrome DevTools Protocol against a
DOM. Majorsilence.Forms renders natively with Skia and has no DOM or browser engine to attach to. For
desktop UI automation, use the WebDriver server or the in-process API above.

## Roadmap

- ✅ **Windows UI Automation bridge** — screen readers, magnifiers, and existing UIA tools (FlaUI,
  Appium/WinAppDriver) with no custom protocol.
- Complete the UIA patterns: `Value`/`Toggle` write support, structure-changed events, and `TextBox`
  per-keystroke value events.
- **AT-SPI (Linux)** and **NSAccessibility (macOS)** bridges over the same tree.
- Expand roles and states (selection, expand/collapse, value ranges), and surface non-control items
  such as individual tabs and list items.
- A higher-level `Majorsilence.Forms.Testing` ergonomics layer — fluent helpers, golden-image asserts.

Full detail lives in [`docs/automation.md`]({{ site.github_url }}/blob/main/docs/automation.md) in
the repository.
