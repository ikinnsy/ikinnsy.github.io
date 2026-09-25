# ikinnsy.github.io

A personal homepage: plain HTML, CSS and JavaScript. No framework, no build step,
no dependencies. Published with GitHub Pages from the `main` branch.

All visitor-facing text lives in `locales/en.json`, `zh.json` and `ja.json`. The
English text also appears inside the HTML as the no-JS fallback, so when you change
a locale value, change the matching text in the HTML too. Comment markers flag
anything that still needs input - see [Comment convention](#comment-convention).

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Landing page: identity, a rotating motto, and one link card per subpage |
| `about.html` | Bio, skills, timeline |
| `projects.html` | Project list |
| `contact.html` | E-mail and other links |
| `404.html` | Served by GitHub Pages for any unknown path |
| `assets/img/favicon.ico` | Favicon |
| `assets/img/avatar.jpg` | Portrait shown in the hero |
| `assets/css/reset.css` | Reset. Unchanged since the first commit. |
| `assets/css/style.css` | The only stylesheet: tokens plus numbered sections |
| `assets/js/main.js` | Page behaviour: footer year plus the cursor glow. Every lookup is guarded. |
| `assets/js/i18n.js` | Translation loader for en / zh / ja. An array value picks one entry at random. |
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

Every page starts with an `[EDIT MAP]` comment. It says whether anything on that
page still needs input, and lists the markers used across the site.

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
   simply leaves the text already written in the HTML - and put the same English
   text in the HTML, so visitors without JavaScript see the real text as well.
2. In the HTML, use either `data-i18n="some.key"` for text, or
   `data-i18n-<attribute>="some.key"` for an attribute - for example
   `data-i18n-alt`, `data-i18n-aria-label` or `data-i18n-content` (on a `<meta>`).

The attribute form is a plain prefix, so it maps one-to-one onto whatever
attribute you want filled and needs no extra configuration.

## Home page behaviour

Two things on `index.html` come from code rather than from markup:

- **Rotating motto.** `home.mottos` is an **array** in each locale file, and
  `i18n.js` shows one random entry per page load. Edit the arrays in all three
  files to change the set. They do not have to be the same length, but keeping
  them aligned makes them easier to maintain.
- **Cursor glow.** `initCursorGlow()` in `main.js` trails a soft blob behind the
  pointer, eased by a factor of `GLOW_EASE` (0.08). It is styled by `.cursor-glow`
  in section 14 of `style.css`. The blob sits at `z-index: 0` while `main` and
  `footer` are lifted to `z-index: 1`, so it is painted **underneath** the content
  and can never reduce text contrast. It is skipped when the visitor prefers
  reduced motion, and it stays invisible on touch devices. Only `index.html`
  contains the element; copy `<div class="cursor-glow" aria-hidden="true"></div>`
  into another page to enable it there.

The three link cards reuse `about.heading`, `projects.heading` and
`contact.heading` as their `<h2>`, so their wording always matches the target
page's own `<h1>`.

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
