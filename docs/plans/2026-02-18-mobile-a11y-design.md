# Product Swatcher — Mobile, Tablet & Accessibility Design

**Date:** 2026-02-18
**Status:** Approved

## Goal

Make the app usable on phones and tablets, meeting WCAG 2.1 AA accessibility standards, without regressing any existing desktop functionality.

## Approach

Additive CSS media queries inside `styles.css` plus small JS additions in `app.js`. No layout refactor, no new files, no new dependencies.

## Breakpoints

| Range | Layout |
|-------|--------|
| >768px | Desktop — three-column layout unchanged |
| ≤768px | Mobile — hamburger sidebar, canvas fills screen, right panel hidden |

## Layout — Mobile (≤768px)

- `#right-panel` hidden (`display: none`)
- `#left-panel` becomes a fixed full-height overlay sidebar, translated off-screen (`translateX(-100%)`) by default
- A hamburger button (`☰`) added inside `#header`, visible only on mobile
- Clicking `☰` toggles class `sidebar-open` on `#app` → panel slides in via CSS `transition: transform 0.25s ease`
- A `#sidebar-backdrop` div (semi-transparent overlay) appears behind the panel; clicking it closes the sidebar
- `Escape` key also closes the sidebar
- `#main` loses fixed widths; canvas fills the full viewport
- Zoom buttons hidden on mobile — pinch-to-zoom replaces them

## Accessibility

### ARIA Roles
- Tab buttons: `role="tab"`, `aria-selected="true/false"`, `aria-controls="tab-{id}"`
- Tab panels: `role="tabpanel"`, `aria-labelledby="tab-btn-{id}"`, `tabindex="0"`
- Tab bar container: `role="tablist"`

### Hamburger Button
- `aria-label="Open menu"` / `"Close menu"` toggled on state change
- `aria-expanded="true/false"` reflecting sidebar open state
- Receives focus when sidebar closes (focus management)

### Style Toggle Buttons (B, I, U)
- Add `aria-label="Bold"` / `"Italic"` / `"Underline"`
- Add `aria-pressed="true/false"` reflecting active state

### Focus Styles
- Remove `outline: none` from all form inputs/selects
- Add universal `:focus-visible` ring: `outline: 2px solid #7ebc59; outline-offset: 2px`

### Touch Targets
- All buttons ≥44×44px on mobile (padding bumped where needed)
- `.style-btn` bumped to 44×44px on mobile
- Bottom toolbar buttons get extra padding

### Labels
- Color input: add `aria-label="Text color"`
- All existing form labels kept (they are correctly associated)

## Touch / Canvas

- Enable `allowTouchScrolling: true` on Fabric canvas init
- Add `touch:gesture` handler for pinch-to-zoom (maps to existing `setZoom()`)
- Add touch-based panning: `touch:drag` mirrors the existing `mouse:down/move/up` pan logic
- Existing `window resize` listener already handles orientation change

## Non-Regression Safeguards

- All CSS additions at the bottom of `styles.css` in a clearly marked `/* ===== RESPONSIVE ===== */` block
- All JS additions are new functions; no existing functions modified
- Desktop behaviour gated by `>768px` — only mobile styles apply at ≤768px
- Smoke-test checklist after implementation:
  - [ ] Upload background image (desktop + mobile)
  - [ ] Add overlay image (desktop + mobile)
  - [ ] Add text, style it (desktop + mobile)
  - [ ] Zoom in/pan with buttons (desktop)
  - [ ] Pinch-to-zoom on canvas (mobile)
  - [ ] Download JPG (desktop + mobile)
  - [ ] Cancel / reset (desktop + mobile)
  - [ ] Keyboard navigation (Tab, Enter, Escape, Delete)
  - [ ] Screen reader: tab roles announced correctly

## Files Changed

| File | Changes |
|------|---------|
| `index.html` | Add hamburger button; add `#sidebar-backdrop` div; add ARIA attributes to tabs, tab panels, style buttons, color input |
| `styles.css` | Add `:focus-visible` ring; bump touch targets; add responsive block at bottom |
| `app.js` | Add `initMobileSidebar()` function; add `initTouchCanvas()` function; update `initCanvas()` to enable touch; update ARIA state in existing tab/style toggle handlers |
