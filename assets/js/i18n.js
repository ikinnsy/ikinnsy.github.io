// assets/js/i18n.js
// Translation loader for the homepage skeleton.
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
// [TODO] Intentionally NOT implemented yet, planned for a later phase:
//   - highlighting the active language button
//   - translating attributes such as alt and aria-label
//   - a <link rel="alternate"> setup that search engines can actually use
//
// [EDIT] All strings live in ./locales/en.json, zh.json and ja.json.
//        Keep the same key set in all three files.

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

// Replace the text of every [data-i18n] element for the current language.
// A key that is missing from the locale file keeps the HTML default, so text
// never goes blank and a raw key is never shown to a visitor.
function updateContent() {
    const current = translations[currentLang] || {};

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        const value = current[key];
        if (typeof value !== "string") return;

        // textContent works for <title> as well as for normal elements.
        element.textContent = value;
    });

    document.documentElement.lang = currentLang;
    // [TODO] Mark the active language button here in a later phase.
}

// Switch language: remember the choice, make sure the file is loaded, redraw.
async function setLanguage(lang) {
    if (!supportedLanguages.includes(lang) || lang === currentLang) return;

    currentLang = lang;
    localStorage.setItem("userLang", lang);
    await loadTranslations(currentLang);
    updateContent();
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