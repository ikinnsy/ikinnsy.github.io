// assets/js/main.js
// Page behaviour for the personal homepage skeleton.
//
// This file is loaded on every page, so every element lookup is guarded: a
// missing element is skipped instead of throwing and killing the rest of the
// script. (An earlier version assumed every element existed and threw a
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
// Cursor glow.
// A soft blob that trails the pointer. [STRUCT] Only a page that actually
// contains a .cursor-glow element gets the effect, so this stays safe to load
// everywhere. The glow is painted underneath the content (section 14 in
// style.css), which is what keeps it from reducing text contrast.
// ---------------------------------------------------------------------------
const GLOW_EASE = 0.08; // [TBD] 0 = never catches up, 1 = no lag at all

function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    if (!glow) return;

    // Respect the user's motion preference: leave the element at opacity 0.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let started = false;
    let frame = null;

    function render() {
        frame = null;

        const dx = targetX - currentX;
        const dy = targetY - currentY;

        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            // Close enough: snap, then let the loop go idle until the next move.
            currentX = targetX;
            currentY = targetY;
        } else {
            currentX += dx * GLOW_EASE;
            currentY += dy * GLOW_EASE;
        }

        // transform only, so this never triggers layout.
        glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

        if (currentX !== targetX || currentY !== targetY) {
            frame = window.requestAnimationFrame(render);
        }
    }

    function ensureRunning() {
        if (frame === null && !document.hidden) {
            frame = window.requestAnimationFrame(render);
        }
    }

    window.addEventListener("mousemove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!started) {
            // First move: put the glow under the pointer rather than animating it
            // in from the top-left corner, and fade it in.
            started = true;
            currentX = targetX;
            currentY = targetY;
            glow.classList.add("is-active");
            return;
        }

        ensureRunning();
    });

    // Don't burn frames while the tab is in the background.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (frame !== null) {
                window.cancelAnimationFrame(frame);
                frame = null;
            }
        } else if (started) {
            ensureRunning();
        }
    });
}

// ---------------------------------------------------------------------------
// Bootstrap. Add future page behaviour inside this one listener.
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initCursorGlow();
});


