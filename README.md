# ikinnsy.github.io

A personal homepage skeleton: plain HTML, CSS and JavaScript. No framework, no
build step, no dependencies. Published with GitHub Pages from the `main` branch.

**Everything in this repository is placeholder content.** There is no real name,
project, link or contact detail in it yet. Every field that needs your input is
marked with a comment - see [Comment convention](#comment-convention).

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home: hero, short about, featured projects, contact call to action |
| `about.html` | Bio, skills, timeline |
| `projects.html` | Project list (empty state + commented-out card template) |
| `contact.html` | E-mail and other links (all placeholders) |
| `404.html` | Served by GitHub Pages for any unknown path |
| `assets/css/reset.css` | Reset. Unchanged since the first commit. |
| `assets/css/style.css` | The only stylesheet: tokens plus numbered sections |
| `assets/js/main.js` | Page behaviour (footer year). Every lookup is guarded. |
| `assets/js/i18n.js` | Translation loader for en / zh / ja |
| `locales/en.json` `zh.json` `ja.json` | UI strings. Identical key sets in all three. |
| `robots.txt` `sitemap.xml` | Crawler metadata |

## Previewing locally

The language switcher needs `http://`. If you open `index.html` directly over
`file://`, the browser refuses to `fetch()` the locale files, so you would only
ever see the English text baked into the HTML, plus three console messages. That
is a graceful fallback, not a crash - but to test switching languages, use a
local server:

```powershell
python -m http.server 8000     # then open http://localhost:8000/
```

## Comment convention

Every page starts with an `[EDIT MAP]` comment listing the fields that still need
input, so you do not have to read the whole file.

| Marker | Meaning |
| --- | --- |
| `[EDIT]` | You must fill this in. The current value is an obvious placeholder. |
| `[TODO]` | Structure is ready, the content comes later. |
| `[TBD]` | Intentionally undecided (mostly the visual identity). |
| `[I18N]` | This string must also exist in all three locale files. |
| `[SYNC]` | This block is duplicated. Keep every copy identical. |
| `[STRUCT]` | Layout code. Change it only if you also change the CSS. |

To list everything that still needs you:

```powershell
Select-String -Path *.html -Pattern '\[EDIT\]'
Select-String -Path *.html -Pattern '\[SYNC\]'   # counts must agree across pages
```

## The `[SYNC]` blocks

The skip link, header shell, language switcher and footer are duplicated
verbatim on every page, because the site has no build step and therefore no
templating. When you change one of them, change every copy - that is what the
`[SYNC]` markers and the second command above are for.

`404.html` is the one exception: it uses root-absolute URLs (see the `[STRUCT]`
note in its `<head>`), so its body markup is not byte-identical. Mirror shell
changes there by hand.

## Translations

`locales/en.json`, `zh.json` and `ja.json` must always hold the same key set. To
add a string:

1. Add the key to **all three** files. English is the fallback, so a missing key
   simply leaves the text already written in the HTML.
2. In the HTML, use either `data-i18n="some.key"` for text, or
   `data-i18n-<attribute>="some.key"` for an attribute - for example
   `data-i18n-alt`, `data-i18n-aria-label` or `data-i18n-content` (on a `<meta>`).

The attribute form is a plain prefix, so it maps one-to-one onto whatever
attribute you want filled and needs no extra configuration.

## Known limitations

- **Multi-language SEO.** All three languages share one URL (`?lang=`), so the
  `<link rel="alternate">` tags do not provide real multi-language SEO. Splitting
  the site into `/zh/` and `/ja/` paths is a separate decision.
- **No contact form.** A static site cannot submit one. The contact page only
  offers a `mailto:` link; a working form needs a backend or a third-party
  service.
- **The visual identity is undecided.** Colours, spacing, radii and fonts all
  live in the `:root` block at the top of `style.css`. Body copy is left-aligned
  while the hero is centred; that is a readability choice, not a design decision.
- **`--header-offset`** in `style.css` is an estimate of the sticky header
  height, used to stop anchor links from hiding underneath it. Adjust it after
  looking at the rendered pages.

## Accessibility notes

Each page has exactly one `<h1>`, semantic landmarks (`header`, `nav`, `main`,
`section`, `footer`), a skip link, translated `aria-label` attributes, and
`:focus-visible` outlines. No content is injected by JavaScript, so the pages stay
readable and crawlable if scripts fail.

## Deploying

GitHub Pages serves the root of the `main` branch, so committing and pushing is
the entire deployment. The site lives at <https://ikinnsy.github.io/>.
