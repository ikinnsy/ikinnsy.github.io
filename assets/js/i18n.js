// assets/js/i18n.js
// Translation loader for the homepage.
//
// [STRUCT] Architecture (kept from the original file, which was already sound):
//   1. Work out which language to use.
//   2. Fetch the matching JSON file from ./locales/.
//   3. Replace the text of every element that carries a data-i18n attribute.
//
// Bugs fixed in this pass. The original file threw on load, so language
// switching never worked at all:
//   - "translation" was declared but "translations" was used everywhere
//   - locale files were fetched from ./lang/ instead of ./locales/
//   - the Japanese button had no click listener
//   - the ?lang= value was never validated against the supported languages
//
// Attribute translation: any element may carry
//   data-i18n-<attribute>="some.key"
// and the matching attribute is filled from the locale file. Examples:
//   data-i18n-alt="hero.avatarAlt"            -> sets alt
//   data-i18n-aria-label="nav.mainLabel"      -> sets aria-label
//   data-i18n-content="meta.home.description" -> sets content on a <meta> tag
//
// An ARRAY value means "pick one at random", which is how the rotating motto on
// the home page works:
//   "home.mottos": ["Because it is there.", "Knowledge is power.", ...]
// updateContent() runs exactly once per page load, so an array lands on a random
// entry on every refresh - and again if the visitor switches language.
//
// [TBD] Still open on purpose: all three languages share one URL, so the
// <link rel="alternate"> tags in the HTML do not give real multi-language SEO.
// Splitting the site into /zh/ and /ja/ paths is a separate decision.
//
// [STRUCT] All strings live in ./locales/en.json, zh.json and ja.json.
//          Keep the same key set in all three files.

const translations = {};                        // was "translation" - a typo
const supportedLanguages = ["en", "zh", "ja"];  // [STRUCT] add a language here
let currentLang = "en";

// Fallback chain: ?lang= parameter, then the stored choice, then the browser
// language, then English.
function getPreferredLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (supportedLanguages.includes(langParam)) {
        return langParam;
    }

    const storedLang = localStorage.getItem("userLang");
    if (supportedLanguages.includes(storedLang)) {
        return storedLang;
    }

    const browserLang = (navigator.language || "en").split("-")[0];
    if (supportedLanguages.includes(browserLang)) {
        return browserLang;
    }

    return "en";
}

// Fetch a locale file once, then cache it.
async function loadTranslations(lang) {
    if (translations[lang]) return;

    try {
        // [STRUCT] The locale files live in ./locales/, not ./lang/.
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        translations[lang] = await response.json();
    } catch (error) {
        // A missing locale file must not break the page. The English text that
        // is already written in the HTML simply stays visible.
        console.error(`Could not load "${lang}" translations:`, error);
    }
}

const ATTRIBUTE_PREFIX = "data-i18n-"; // [STRUCT] plain data-i18n carries text

// Turn a locale value into a string to apply.
//   string -> used as is
//   array  -> one random entry, which is what makes home.mottos rotate
//   anything else (including a missing key) -> null, so the caller keeps the text
//   already written in the HTML and nothing ever goes blank
function resolveValue(value) {
    if (typeof value === "string") return value;

    if (Array.isArray(value) && value.length > 0) {
        const index = Math.floor(Math.random() * value.length);
        return String(value[index]);
    }

    return null;
}

// Replace the text and the translatable attributes of every marked element for
// the current language.
// A key that is missing from the locale file keeps whatever is already written
// in the HTML, so nothing ever goes blank and a raw key is never shown.
function updateContent() {
    const dictionary = translations[currentLang] || {};

    document.querySelectorAll("*").forEach((element) => {
        // 1. text content, e.g. <title data-i18n="meta.home.title">
        const textValue = resolveValue(dictionary[element.getAttribute("data-i18n")]);
        if (textValue !== null) {
            // textContent works for <title> as well as for normal elements.
            element.textContent = textValue;
        }

        // 2. attributes, e.g. data-i18n-alt / data-i18n-aria-label / data-i18n-content
        // Arrays work here too, so a rotating value could fill an attribute.
        element.getAttributeNames().forEach((name) => {
            // "data-i18n" itself does not start with "data-i18n-", so it is skipped.
            if (!name.startsWith(ATTRIBUTE_PREFIX)) return;

            const targetAttribute = name.slice(ATTRIBUTE_PREFIX.length);
            const value = resolveValue(dictionary[element.getAttribute(name)]);
            if (value !== null) {
                element.setAttribute(targetAttribute, value);
            }
        });
    });

    document.documentElement.lang = currentLang;
    markActiveLanguageButton();
}

// Show which language is selected. [STRUCT] The rule that reacts to this is
// .lang-switcher button[aria-current="true"] in style.css.
function markActiveLanguageButton() {
    supportedLanguages.forEach((lang) => {
        const button = document.getElementById(`lang-${lang}`);
        if (!button) return;

        if (lang === currentLang) {
            button.setAttribute("aria-current", "true");
        } else {
            button.removeAttribute("aria-current");
        }
    });
}

// Switch language: remember the choice, make sure the file is loaded, redraw.
async function setLanguage(lang) {
    if (!supportedLanguages.includes(lang) || lang === currentLang) return;

    currentLang = lang;
    localStorage.setItem("userLang", lang);
    syncLanguageToUrl();
    await loadTranslations(currentLang);
    updateContent();
}

// Put ?lang= into the address bar, so a copied link keeps the chosen language.
// That is also the URL shape the <link rel="alternate"> tags already point at.
// Only runs on an explicit switch, never on first load.
function syncLanguageToUrl() {
    if (!window.history || !window.history.replaceState) return;

    try {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", currentLang);
        window.history.replaceState(null, "", url);
    } catch (error) {
        // Sandboxes and file:// pages may refuse this. Not worth breaking over.
        console.warn("Could not set the ?lang= parameter:", error);
    }
}

// Wire up the language buttons. Every supported language gets a listener, so
// lang-ja works now too. Each lookup is guarded, so this file stays safe to
// load on any page.
function initLanguageButtons() {
    supportedLanguages.forEach((lang) => {
        const button = document.getElementById(`lang-${lang}`);
        if (!button) return;

        button.addEventListener("click", () => setLanguage(lang));
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    currentLang = getPreferredLanguage();

    // Preload every language so switching is instant. There are only three
    // files and they are tiny.
    await Promise.all(supportedLanguages.map((lang) => loadTranslations(lang)));

    updateContent();
    initLanguageButtons();
});