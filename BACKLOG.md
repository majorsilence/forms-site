# forms-site backlog

## Translations

The site is published in English (`/`), Chinese (`/zh/`) and French (`/fr/`). The language layer
(`_config.yml` → `languages`, `_data/i18n/<code>.yml`, `_includes/lang-vars.html`) is built to take
more languages without code changes.

### Queued: Sinhala (`si`) and Tamil (`ta`)

Requested 2026-10-08. Both are already declared in `_config.yml` with `enabled: false`, so nothing
about them renders yet. To ship one:

1. Create `_data/i18n/si.yml` (copy `_data/i18n/en.yml`, translate every string; keep the keys).
2. Translate every English page into `si/<same path>`:
   - every `*.md` page in the repo root → `si/<name>.md`, with `permalink: /si/<name>/`
   - `index.html` → `si/index.html`, `blog/index.html` → `si/blog/index.html`
   - `feed.xml` → `si/feed.xml` (copy the English file, change `permalink` and `lang`)
   - each `_posts/*.md` → `_posts/<same date>-<slug>.si.md` with `lang: si` and
     `permalink: /si/blog/:year/:month/:day/<slug>/`
   Translation rules (same as the zh/fr pass): translate prose, titles, subtitles, SEO fields and
   FAQ entries; leave code blocks, Liquid tags, file names, package names and API names untouched;
   prefix every site-internal link with `/si` (`{{ '/si/getting-started/' | relative_url }}`), but
   NOT `/gallery/`, `/assets/...` or repository URLs; give every heading an explicit kramdown id
   `{:#english-slug}` matching the English heading's auto-generated id so cross-page anchors keep
   working.
3. Add a Google Fonts family for the script to the `lang-fonts` block in `_layouts/default.html`
   (Noto Sans Sinhala / Noto Sans Tamil are already wired there; check the stack renders).
4. Flip `enabled: true` for the language in `_config.yml`, run `jekyll build`, and spot-check the
   language switcher, hreflang alternates in `<head>`, `sitemap.xml` and `/si/feed.xml`.
5. Add the language to the "Translations" list in `llms.txt`.

Tamil follows the same steps with `ta`.
