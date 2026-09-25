# TODO / Roadmap — ikinnsy.github.io

Personal homepage. Plain HTML / CSS / JavaScript, no framework, no build step, no
dependencies. Published by GitHub Pages from the `main` branch.

**Last reviewed:** 2026-09-25
**Last code commit before this document:** `9ec7e33`
**Live:** <https://ikinnsy.github.io/>

---

## 0. Status snapshot

| Check | Result |
| --- | --- |
| Working tree | clean, level with `origin/main` |
| Locale keys | 64, identical key set in `en` / `zh` / `ja` |
| Missing / unused keys | 0 / 0 |
| Pages | 5 (`index`, `about`, `projects`, `contact`, `404`) — each has exactly one `<h1>`, tags and comments balanced |
| `[SYNC]` shell | `header` and `footer` are identical on all 5 pages |
| Stylesheet | braces balanced, every HTML class has a rule, all 24 CSS variables defined |
| JavaScript | `node --check` clean; i18n (including the rotating motto) and the cursor glow are covered by tests that actually execute the code |
| Real `[EDIT]` markers | 2, both conditional — see [2.3](#23-conditional--only-when-something-changes) |

Verified on the live site: all five pages, three languages, rotating motto, cursor
glow, portrait.

---

## 1. Can the project be paused?

**Yes.** Nothing is half-finished. Every remaining item is either routine
maintenance or a deliberate deferral, and the last content change was staged as
"add the capability (purely additive) → then switch the pages over", so no
intermediate commit left the site broken.

### 1.1 Completed before pausing

The stale-comment cleanup is committed as `9ec7e33`. It mattered because `[EDIT]`
is defined as "everything still outstanding", and seven markers had been left on
fields that were already filled — plus a CSS comment claiming the
active-language highlight was *not* implemented, when it had been for several
phases. `grep '[EDIT]'` now returns real work only (section 5.2).

### 1.2 When you come back

1. `git pull`
2. Preview locally:

   ```powershell
   python -m http.server 8000     # then open http://localhost:8000/
   ```

   Opening `index.html` directly over `file://` **will not** switch languages: the
   browser refuses to `fetch()` the locale files. The page falls back to the
   English text baked into the HTML, plus three console messages.
3. Run the checks in section 5.
4. Bump `footer.updated` (section 2.1).

---

## 2. TODO

### 2.1 Routine maintenance

| Item | Where | Note |
| --- | --- | --- |
| `footer.updated` | `locales/{en,zh,ja}.json` | **Not generated.** Currently `2026-09-25`; the same date is repeated as the no-JS fallback in all five HTML files. Bump it whenever you change the site. |
| Portrait crop | `assets/img/avatar.jpg` | `.avatar` uses `object-fit: cover`, i.e. a centred square crop. If the framing looks off, add `object-position` to `.avatar` in `style.css`. |

### 2.2 Fixed in `9ec7e33` (listed so they do not creep back)

- `style.css` — a comment claimed the active-language button highlight "is not in
  use yet", but `markActiveLanguageButton()` in `i18n.js` has implemented it.
- All five pages — `[EDIT] Site brand` marker left on a field that was filled.
- `404.html` — two `[EDIT] i18n key:` markers left on filled strings.
- `i18n.js` and `style.css` — `[EDIT]` / `[TBD]` used for pointers and history
  notes rather than for genuine open questions.

### 2.3 Conditional — only when something changes

| Trigger | What to do |
| --- | --- |
| The handbook repository goes public | Add a `projects.item1.link` key to all three locale files, then uncomment the `<a>` snippet that both `projects.html` and `index.html` already carry |
| You buy a custom domain | Add a `CNAME` file, and update the host in `robots.txt` and `sitemap.xml`. These are the only two real `[EDIT]` markers in the repository |
| A second project or timeline entry | Copy the template block, give it `projects.item2.*` / `about.timeline.item2.*`, and add those keys to all three locale files |
| You want the cursor glow on more pages | Copy `<div class="cursor-glow" aria-hidden="true"></div>` into the page. `main.js` only activates it when the element exists |

### 2.4 Optional improvements

See section 3.

---

## 3. Improvement directions

Ordered roughly by value for effort.

### 3.1 Add CI so the checks run themselves — best next step

**Why.** The validation I run is written from scratch each time and thrown away.
The `[SYNC]` shell has already drifted once in this project (a comment line
differed between `index.html` and the other pages) and only a manual check caught
it. Three languages × five pages means key drift is the most likely future bug,
and it is silent: a missing key just leaves the English fallback sitting there.

**Do.**
- Commit the checks as `tools/validate.js`: three locale files hold the same key
  set, the same `home.mottos` length, no missing or unused keys, exactly one
  `<h1>` per page, tags and comments balanced, the `header`/`footer` shell
  identical across all five pages, CSS braces balanced, every HTML class has a
  rule, every `var()` is defined, and every local `src`/`href` target exists.
- Add `.github/workflows/validate.yml` running `node tools/validate.js` on push
  and pull request, so a red check blocks a bad deploy.

**Files:** new `tools/validate.js`, new workflow file.
**Effort:** small to medium — the logic already exists, it only needs generalising
and the missing-file check added.
**Precondition:** none.

### 3.2 Multi-language SEO — the only structural limitation

**Why.** All three languages share one URL (`?lang=`), so the
`<link rel="alternate" hreflang>` tags in `<head>` all point at the *same*
document. Search engines therefore see one page and the tags do nothing. This is
flagged as `[TBD]` in `i18n.js`, in the `[SYNC]` hreflang comment on every page,
and in `README.md`.

**Options.**
- **(a) Duplicate every page per language** — `/zh/about.html`, `/ja/about.html`
  and so on. Real multi-language SEO, but 15 files to keep in step by hand, which
  multiplies the exact problem that CI in 3.1 exists to catch.
- **(b) Adopt Jekyll** (GitHub Pages runs it natively, no extra service) and keep
  one template per page, with the shell and the language variants included. Solves
  this *and* removes the five-way `[SYNC]` duplication.
- **(c) Leave it.** Every page already declares `<html lang>` correctly and each
  language is reachable; you simply do not get per-language search results.

**Files for (a)/(b):** all five HTML files, `i18n.js`, `README.md`, `.gitignore`,
plus a build config for (b).
**Effort:** large for both (a) and (b).
**Precondition:** a decision on whether the site ever needs to be *found* through
search in Chinese or Japanese. If it is a link you share rather than a page people
search for, (c) is a perfectly good answer.

### 3.3 Visual identity — deliberately `[TBD]`

**Why.** The palette, typography and radii are neutral placeholders, on purpose.
Every one of them is a token in the `:root` block at the top of `style.css`, so
changing a value there changes the whole site at once. Nothing is hard-coded.

**Open questions.**
- Palette, font stack, corner radii. No web font is loaded today, which keeps the
  site dependency-free and free of layout shift.
- Body copy is left-aligned while the hero and the cards are centred. That was a
  readability choice, not a design decision — see the `[TBD]` note above `p` in
  `style.css`. One declaration flips it back.
- **Dark mode is not implemented.** `prefers-color-scheme` could drive a second set
  of token values. The cursor glow colour would need re-checking against a dark
  background.

**Files:** `assets/css/style.css` (the `:root` block).
**Effort:** small once you have decided what you want — the token layer makes the
mechanical part trivial.

### 3.4 Interaction tuning

| Knob | Where | Current | Note |
| --- | --- | --- | --- |
| Glow diameter | `style.css` `:root` | `--glow-size: 220px` | Already reduced once, from 340px |
| Glow opacity | `style.css` `:root` | `--glow-opacity: 0.18` | Keep at or below 0.2 |
| Glow lag | `main.js` | `GLOW_EASE = 0.08` | `0` never catches up, `1` has no lag |
| Sticky-header height | `style.css` `:root` | `--header-offset` 150px / 72px | **An estimate**, used to stop anchor links hiding under the header. Worth measuring and correcting |
| Motto set | `locales/*.json` | `home.mottos`, 9 entries | Adding or removing lines is enough; the three arrays do not have to be the same length |

The glow already honours `prefers-reduced-motion`, stays hidden until the first
pointer move, and pauses while the tab is in the background.

### 3.5 Accessibility — never audited with real tooling

**Why.** The structure is sound: one `<h1>` per page, semantic landmarks, a skip
link, translated `aria-label` attributes, `:focus-visible` outlines, and no content
that depends on JavaScript. But **no automated audit has ever been run**, because
there is no browser environment available here.

**Do.**
- Run Lighthouse / axe DevTools over all five pages in all three languages.
- **Measure one contrast value by hand:** `--color-text-muted` (`#6b7280`) on
  `--color-bg` (`#f7f8fa`) is roughly **4.55 : 1**. It clears the 4.5 : 1 AA
  minimum for normal text by almost nothing, so any change to either token should
  be re-measured.
- Walk the site with the keyboard only: skip link → navigation → language buttons
  → cards → back to top.
- Check the longest strings wrap without horizontal scroll at 320px. The timeline
  entry title is a long institutional name in every language, and the German-style
  worst case here is Japanese.

**Effort:** small.

### 3.6 Sharing and structured data — cheap, visible wins

**Why.** The site has no `og:` or Twitter card tags, so a link pasted into a chat
app or social platform shows a bare URL with no title, description or image.
`meta description` is set, but that is what search results use, not what social
previews use.

**Do.**
- Add `og:title`, `og:description`, `og:url`, `og:image`, `og:locale` and the
  `twitter:card` equivalents to all five pages. The text values already exist in
  the locale files as `meta.*.title` and `meta.*.description`; an `og:` image would
  have to be produced once.
- Consider JSON-LD `Person` structured data. Every fact it would contain is already
  on the site — name, nickname, institution, field of study — so nothing would have
  to be invented. It carries the same single-URL caveat as 3.2.
- Attribute-level i18n already exists (`data-i18n-content="…"`), so translated
  `og:` tags need no new mechanism.

**Files:** the five HTML files, plus `assets/img/` for the share image.
**Effort:** small.

### 3.7 Feature ideas — only if you want them

| Idea | Note |
| --- | --- |
| Contact form | A static site cannot submit one. It needs a backend or a third-party form service. The `contact.html` comment records this |
| Notes / study-log section | Would suit the site's stated purpose ("documents my learning process"). A new page plus a few `notes.*` keys, following exactly the same pattern as `projects.html` |
| RSS feed | Ironic while there is no dated content; becomes worthwhile once the notes section exists |
| Richer favicon | Currently a single `favicon.ico`. An `apple-touch-icon` and a maskable PNG would improve how the site looks when saved to a phone home screen |
| Glow on every page | One line of HTML per page; the CSS and JS already handle it |

---

## 4. Known limitations

These are properties of the current design, not defects. They are also recorded in
`README.md`.

| Limitation | Why it exists | See |
| --- | --- | --- |
| `hreflang` has no effect | All three languages share one URL via `?lang=` | 3.2 |
| No contact form | A static site cannot submit one; `contact.html` offers a `mailto:` link only | 3.7 |
| Visual identity is undecided | Deliberate — the `:root` tokens are neutral placeholders | 3.3 |
| `--header-offset` is an estimate | It is set by eye, not measured | 3.4 |
| Accessibility never audited | No browser tooling available in this environment | 3.5 |
| No social-share preview | No `og:` tags | 3.6 |
| `footer.updated` is manual | There is no build step to generate it | 2.1 |
| The shell is duplicated 5× | No templating, by design (no build step), which is why `[SYNC]` exists | 3.2 (b) |
| `404.html` is not byte-identical | It must use root-absolute URLs, because GitHub Pages serves it for arbitrary paths | note in its `<head>` |

---

## 5. Working on this later

### 5.1 Where to change text

**The locale files are the source of truth.** To change any word a visitor reads,
edit `locales/en.json`, `zh.json` or `ja.json` — not the HTML.

The same English text is **also** written inside the HTML, as the no-JS fallback
for visitors and crawlers that do not run scripts. When you change an English
locale value, change the matching text in the HTML too. Each page carries an
`[EDIT MAP]` comment at the top saying exactly this.

A new key must be added to **all three** locale files. English is the fallback, so
a missing key is not an error — it just leaves the HTML text in place.

### 5.2 Comment markers

| Marker | Meaning |
| --- | --- |
| `[EDIT]` | Genuinely open work. Right now there are only two, both conditional |
| `[TODO]` | Structure is ready, something is still deferred |
| `[TBD]` | Intentionally undecided (mostly the visual identity) |
| `[I18N]` | The string must also exist in all three locale files |
| `[SYNC]` | This block is duplicated — keep every copy identical |
| `[STRUCT]` | Layout or plumbing. Change it only alongside the CSS/JS |

### 5.3 Finding outstanding work

```powershell
# Real field markers - none at present, and this is what "nothing outstanding" means.
Select-String -Path *.html -Pattern '<!-- \[EDIT\]'

# Every occurrence of the token, including the legend lines inside the [EDIT MAP]
# blocks and the two conditional items in robots.txt / sitemap.xml.
Select-String -Recurse -Path . -Include *.html,*.json,*.js,*.css,*.xml,*.txt -Pattern '\[EDIT\]'

# The shared shell. The hit count must be the same for every page.
Select-String -Path *.html -Pattern '\[SYNC\]'
```

### 5.4 File map

```
index.html            landing page: portrait, nickname, rotating motto, 2 buttons, 3 link cards
about.html            lead + bio, skills (label/value pairs), timeline
projects.html         project list
contact.html          e-mail and outbound links
404.html              served by GitHub Pages for unknown paths; root-absolute URLs
assets/css/reset.css  unchanged since the first commit
assets/css/style.css  the only stylesheet: tokens + 14 numbered sections
assets/js/main.js     footer year + cursor glow; every lookup is guarded
assets/js/i18n.js     translation loader; array values pick one entry at random
assets/img/           favicon.ico, avatar.jpg
locales/{en,zh,ja}.json   64 keys each, identical sets
README.md             how the site works
TODO.md               this file
robots.txt sitemap.xml    crawler metadata; the only two real [EDIT] markers
```

### 5.5 Deploying, and confirming a deploy actually happened

Pushing to `main` is the whole deployment. GitHub Pages usually rebuilds within a
minute or two, but two things can make it *look* like nothing happened:

1. **The Pages build has not finished.** Check the repository's Actions or
   Environments tab.
2. **The CDN is still serving the previous asset.** `style.css`, `main.js` and the
   locale JSON are cached; `index.html` refreshes sooner. Add a throwaway query
   string to bypass the cache:

   ```powershell
   (Invoke-WebRequest 'https://ikinnsy.github.io/assets/css/style.css?cb=1' -UseBasicParsing).Content
   ```

To tell "the push did not land" apart from "Pages has not rebuilt", compare
against the branch itself, which bypasses Pages entirely:

```powershell
(Invoke-WebRequest 'https://raw.githubusercontent.com/ikinnsy/ikinnsy.github.io/main/assets/css/style.css' -UseBasicParsing).Content
```

If the raw branch is correct but the live URL is stale, the push landed and you are
only waiting on GitHub.
