// assets/js/main.js
// Page behaviour for the personal homepage skeleton.
//
// This file is loaded on all 4 pages, so every element lookup is guarded:
// a missing element is skipped instead of throwing and killing the rest of
// the script. (The previous version assumed every element existed and threw a
// TypeError on about.html, projects.html and contact.html.)
//
// [STRUCT] Keep this file free of page-specific content. Anything that is text
// belongs in the HTML plus locales/*.json, not here.

// ---------------------------------------------------------------------------
// Footer copyright year.
// Reads the [data-year] element in the footer shell. If it is missing, the
// value already written in the HTML is kept as a no-JS fallback.
// ---------------------------------------------------------------------------
function initYear() {
    const yearEl = document.querySelector("[data-year]");
    if (!yearEl) return;

    yearEl.textContent = String(new Date().getFullYear());
}

// ---------------------------------------------------------------------------
// Bootstrap. Add future page behaviour inside this one listener.
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initYear();
});


