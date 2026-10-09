# forms-site backlog

## Translations

The site is published in English (`/`), Chinese (`/zh/`) and French (`/fr/`). The language layer
(`_config.yml` → `languages`, `_data/i18n/<code>.yml`, `_includes/lang-vars.html`) takes more
languages without template changes.

### Sinhala (`si`) and Tamil (`ta`): translated, awaiting native-speaker review

Translated 2026-10-09 for a Sri Lankan developer audience. Every page, post, the home page, blog
index and feed exist under `/si/` and `/ta/`, with UI strings in `_data/i18n/si.yml` and
`_data/i18n/ta.yml`. Both languages are still `enabled: false` in `_config.yml`.

While a language is disabled its pages are built and reachable by URL, so a reviewer can read them
at `https://forms.majorsilence.com/si/` and `/ta/`. Search engines are kept out: every page carries
`noindex`, nothing appears in `sitemap.xml`, and no English/Chinese/French page links to it through
the language switcher or hreflang.

To ship a language:

1. Have a native speaker review it, starting with the home page, getting started, the FAQ and the
   four landing pages (`cross-platform-winforms`, `winforms-alternatives`, `winforms-on-linux`,
   `winforms-on-macos`). Wording the translators flagged as least certain:
   - Sinhala: "Touch gestures" was rendered ස්පර්ශ ඉඟි (closer to "touch hints"; අභිනය may be
     better); ගෘහ නිර්මාණය for "architecture"; හුවමාරුව for "trade-off"; ස්වදේශීය for "native".
   - Tamil: காட்சிப் பின்னடைவுச் சோதனை for "visual regression"; "The Headless backend is your CI
     story" rendered as "…உங்கள் CI வழி".
   - Both: many English developer terms were deliberately kept in Latin script (build, workload,
     stub, airspace, locator…). Confirm that matches how local developers write.
2. Flip `enabled: true` for the language in `_config.yml`.
3. Run `jekyll build` and spot-check the language switcher, the hreflang tags in `<head>`,
   `sitemap.xml` and `/<code>/feed.xml`.
4. Add the language to the "Translations" section of `llms.txt`.

### Adding another language

1. Add it to `languages` in `_config.yml` with `enabled: false`.
2. Create `_data/i18n/<code>.yml` (copy `en.yml`, translate every value, keep the keys).
3. Translate every English page into `<code>/<same path>`, each post into
   `_posts/<date>-<slug>.<code>.md` with `lang: <code>` and `permalink: /<code>/blog/YYYY/MM/DD/<slug>/`,
   and copy `feed.xml` to `<code>/feed.xml` with its own `permalink` and `lang`.
   Rules: translate prose, titles and SEO fields; leave code, Liquid, file, package and API names
   untouched; prefix site links with `/<code>` except `/gallery/` and `/assets/`; give every heading
   the English heading's id as an explicit kramdown IAL (use the long form `{: id="…"}` when the id
   starts with a dash); copy FAQ `id:` keys verbatim.
4. For a non-Latin script, add a Noto font to the `lang-fonts` block in `_layouts/default.html` and a
   font stack in `assets/css/main.css`.
5. Review, then enable as above.
