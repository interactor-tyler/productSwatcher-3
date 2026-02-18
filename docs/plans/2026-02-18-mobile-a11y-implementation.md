# Mobile, Tablet & Accessibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Product Swatcher responsive on mobile/tablet (hamburger sidebar ≤768px) and WCAG 2.1 AA compliant without regressing any desktop functionality.

**Architecture:** Additive CSS media queries (≤768px block at bottom of `styles.css`) + small JS additions in `app.js`. No new files, no new dependencies. Desktop layout (>768px) is left entirely untouched — all mobile styles are gated inside `@media (max-width: 768px)`.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript ES6, Fabric.js 5.3.1

---

## Task 1: ARIA roles on the tab system (`index.html`)

**Files:**
- Modify: `index.html` (lines 19–103)

The tab system currently has no ARIA semantics. Screen readers can't identify it as a tab widget.

**Step 1: Add `role="tablist"` and `aria-label` to `#tab-bar`**

In `index.html`, change:
```html
<div id="tab-bar">
```
to:
```html
<div id="tab-bar" role="tablist" aria-label="Editor tools">
```

**Step 2: Add tab button ARIA attributes**

Change the two `.tab-btn` elements:
```html
<button class="tab-btn active" data-tab="upload"
        role="tab" aria-selected="true" aria-controls="tab-upload" id="tab-btn-upload">Upload</button>
<button class="tab-btn" data-tab="text"
        role="tab" aria-selected="false" aria-controls="tab-text" id="tab-btn-text">Add Text</button>
```

**Step 3: Add tabpanel ARIA attributes to both `.tab-pane` divs**

```html
<div id="tab-upload" class="tab-pane active"
     role="tabpanel" aria-labelledby="tab-btn-upload" tabindex="0">
```
```html
<div id="tab-text" class="tab-pane"
     role="tabpanel" aria-labelledby="tab-btn-text" tabindex="0">
```

**Step 4: Verify in browser**

Open `index.html`. Open DevTools → Accessibility → inspect `#tab-bar`. Confirm role is `tablist` and buttons show as `tab` with `aria-selected`.

**Step 5: Commit**
```bash
git add index.html
git commit -m "a11y: add ARIA roles to tab system"
```

---

## Task 2: ARIA on style buttons and color input (`index.html`)

**Files:**
- Modify: `index.html` (lines 84–96)

Style toggle buttons (Bold, Italic, Underline) have `title` but no `aria-label` or pressed state. The color input has no label.

**Step 1: Update the three style buttons**

```html
<button id="btn-bold" class="style-btn" title="Bold"
        aria-label="Bold" aria-pressed="false"><b>B</b></button>
<button id="btn-italic" class="style-btn" title="Italic"
        aria-label="Italic" aria-pressed="false"><i>I</i></button>
<button id="btn-underline" class="style-btn" title="Underline"
        aria-label="Underline" aria-pressed="false"><u>U</u></button>
```

**Step 2: Add `aria-label` to the color input**

```html
<input type="color" id="font-color" class="form-color" value="#000000" aria-label="Text color">
```

**Step 3: Verify in browser**

Inspect `#btn-bold` in DevTools Accessibility panel. Confirm `aria-label="Bold"` and `aria-pressed="false"` are present.

**Step 4: Commit**
```bash
git add index.html
git commit -m "a11y: add aria-label and aria-pressed to style buttons, label color input"
```

---

## Task 3: Fix focus visibility (`styles.css`)

**Files:**
- Modify: `styles.css` (lines 285–305)

`outline: none` on `.form-input` and `.form-select` breaks keyboard navigation visibility. Fix with a visible `:focus-visible` ring.

**Step 1: Remove `outline: none` from `.form-input`**

In `styles.css`, find the `.form-input` block (around line 277). Change:
```css
.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cccccc;
  border-radius: 0;
  font-size: 13px;
  font-family: "Lato", sans-serif;
  outline: none;
  transition: border-color 0.2s;
}
```
to:
```css
.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cccccc;
  border-radius: 0;
  font-size: 13px;
  font-family: "Lato", sans-serif;
  transition: border-color 0.2s;
}
```

**Step 2: Remove `outline: none` from `.form-select`**

Find `.form-select` (around line 292). Change:
```css
.form-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cccccc;
  border-radius: 0;
  font-size: 13px;
  font-family: "Lato", sans-serif;
  outline: none;
  background: #ffffff;
}
```
to:
```css
.form-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cccccc;
  border-radius: 0;
  font-size: 13px;
  font-family: "Lato", sans-serif;
  background: #ffffff;
}
```

**Step 3: Add a global `:focus-visible` rule**

Append to the bottom of `styles.css` (above the responsive block you'll add next):
```css
/* ===== FOCUS VISIBILITY (a11y) ===== */
:focus-visible {
  outline: 2px solid #7ebc59;
  outline-offset: 2px;
}
```

**Step 4: Verify**

Tab through the UI. Every interactive element should show a green ring when focused. The existing green border on focused inputs is still there (from `.form-input:focus`) — that's fine, it complements the outline.

**Step 5: Commit**
```bash
git add styles.css
git commit -m "a11y: fix focus visibility — remove outline:none, add :focus-visible ring"
```

---

## Task 4: Add hamburger button and sidebar backdrop (`index.html`)

**Files:**
- Modify: `index.html`

Two new DOM elements needed: a hamburger toggle button in the header, and a backdrop div for the sidebar overlay.

**Step 1: Add hamburger button inside `#header`**

Change:
```html
<header id="header">
  <h1>Product Swatcher</h1>
</header>
```
to:
```html
<header id="header">
  <h1>Product Swatcher</h1>
  <button id="menu-toggle" class="menu-toggle"
          aria-label="Open menu" aria-expanded="false">&#9776;</button>
</header>
```

(`&#9776;` is the `☰` hamburger character.)

**Step 2: Add backdrop div inside `#app`, before `#main`**

Change:
```html
<div id="app">
  <header id="header">
```
to:
```html
<div id="app">
  <header id="header">
```
…and add the backdrop just before `</div>` closing `#app` (after the `<footer>`):
```html
    </footer>
    <div id="sidebar-backdrop" class="sidebar-backdrop" aria-hidden="true"></div>
  </div>
```

Full end of `#app` should look like:
```html
    <footer id="bottom-toolbar">
      <button id="btn-cancel" class="btn btn-secondary">Cancel</button>
      <button id="btn-save" class="btn btn-primary">Save Image</button>
      <button id="btn-download" class="btn btn-primary">Download JPG</button>
    </footer>
    <div id="sidebar-backdrop" class="sidebar-backdrop" aria-hidden="true"></div>
  </div>
```

**Step 3: Verify**

Open the browser. The `☰` button appears in the header on all screen sizes (it'll be styled to only show on mobile in Task 5). The backdrop div exists in the DOM but is invisible.

**Step 4: Commit**
```bash
git add index.html
git commit -m "feat: add hamburger toggle button and sidebar backdrop to markup"
```

---

## Task 5: Hamburger/backdrop styles + mobile layout (`styles.css`)

**Files:**
- Modify: `styles.css` (append to bottom)

**Step 1: Add hamburger button base styles (desktop: hidden)**

Append to `styles.css`:
```css
/* ===== HAMBURGER BUTTON ===== */
.menu-toggle {
  display: none; /* hidden on desktop; shown via media query */
  background: none;
  border: none;
  color: #ffffff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 6px 8px;
  margin-left: auto;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
}

/* ===== SIDEBAR BACKDROP ===== */
.sidebar-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

/* ===== RESPONSIVE (≤768px) ===== */
@media (max-width: 768px) {

  /* Header: flex layout so hamburger aligns right */
  #header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 101; /* stays above sidebar overlay */
  }

  /* Show hamburger on mobile */
  .menu-toggle {
    display: flex;
  }

  /* Hide right panel (zoom buttons) — replaced by pinch-to-zoom */
  #right-panel {
    display: none;
  }

  /* Left panel becomes a fixed full-height overlay */
  #left-panel {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: 2px 0 16px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
  }

  /* Sidebar open state (class toggled by JS) */
  #app.sidebar-open #left-panel {
    transform: translateX(0);
  }

  #app.sidebar-open .sidebar-backdrop {
    display: block;
  }

  /* Touch targets: WCAG 2.5.5 requires ≥44×44px */
  .style-btn {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }

  .btn {
    padding: 12px 16px;
    min-height: 44px;
  }

  .tab-btn {
    padding: 14px 8px;
    min-height: 44px;
  }

  .zoom-btn {
    width: 44px;
    height: 44px;
  }

  /* Larger tap target for dropzone */
  .dropzone {
    padding: 32px 24px;
  }

  /* Bottom toolbar: wrap if needed */
  #bottom-toolbar {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 12px;
  }

  #bottom-toolbar .btn {
    flex: 1;
    min-width: 80px;
    text-align: center;
  }
}
```

**Step 2: Verify (DevTools device emulation)**

In Chrome, open DevTools → Toggle device toolbar → set to iPhone 14 (390px wide).
- Hamburger (`☰`) should appear in the header.
- Right panel (Zoom) should be gone.
- Canvas should fill the full width.
- Buttons should be at least 44px tall.

Switch to desktop (1200px). Verify layout is identical to before — three columns, no hamburger visible.

**Step 3: Commit**
```bash
git add styles.css
git commit -m "feat: add responsive mobile layout — hamburger sidebar, hide zoom panel"
```

---

## Task 6: Mobile sidebar open/close behavior (`app.js`)

**Files:**
- Modify: `app.js` (add new function, call from DOMContentLoaded)

**Step 1: Add `initMobileSidebar()` function**

Insert this new function in `app.js` after `initKeyboard()` and before the DOMContentLoaded block:

```js
// ===== MOBILE SIDEBAR =====
function initMobileSidebar() {
  const toggle = document.getElementById('menu-toggle');
  const backdrop = document.getElementById('sidebar-backdrop');
  const app = document.getElementById('app');

  function openSidebar() {
    app.classList.add('sidebar-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  function closeSidebar() {
    app.classList.remove('sidebar-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (app.classList.contains('sidebar-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  backdrop.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && app.classList.contains('sidebar-open')) {
      e.preventDefault();
      closeSidebar();
    }
  });
}
```

**Step 2: Call it from DOMContentLoaded**

Find the `DOMContentLoaded` block at the bottom of `app.js`:
```js
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTabs();
  initUpload();
  initText();
  initZoom();
  initPanning();
  initToolbar();
  initResize();
  initKeyboard();
});
```

Add `initMobileSidebar()` to the end:
```js
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTabs();
  initUpload();
  initText();
  initZoom();
  initPanning();
  initToolbar();
  initResize();
  initKeyboard();
  initMobileSidebar();
});
```

**Step 3: Verify (mobile emulation)**

In DevTools mobile emulation:
- Tap `☰` → sidebar slides in, backdrop appears, `aria-expanded` becomes `true`
- Tap backdrop → sidebar slides out, focus returns to `☰`
- Open sidebar → press `Escape` → sidebar closes

**Step 4: Commit**
```bash
git add app.js
git commit -m "feat: add mobile sidebar open/close with keyboard and focus management"
```

---

## Task 7: Update `initTabs()` for ARIA state management (`app.js`)

**Files:**
- Modify: `app.js` (lines 93–107, the `initTabs` function)

Currently clicking a tab doesn't update `aria-selected`. Screen readers won't know which tab is active.

**Step 1: Update the tab click handler**

Find the click handler inside `initTabs()`:
```js
btn.addEventListener('click', () => {
  tabBtns.forEach(b => b.classList.remove('active'));
  tabPanes.forEach(p => p.classList.remove('active'));

  btn.classList.add('active');
  const tabId = 'tab-' + btn.dataset.tab;
  document.getElementById(tabId).classList.add('active');
});
```

Replace with:
```js
btn.addEventListener('click', () => {
  tabBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  tabPanes.forEach(p => p.classList.remove('active'));

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  const tabId = 'tab-' + btn.dataset.tab;
  document.getElementById(tabId).classList.add('active');
});
```

**Step 2: Verify**

Open the browser. Click "Add Text" tab. Inspect `#tab-btn-text` in DevTools → Accessibility. `aria-selected` should be `true`. Click "Upload" tab → `aria-selected` should switch back.

**Step 3: Commit**
```bash
git add app.js
git commit -m "a11y: update initTabs to manage aria-selected state"
```

---

## Task 8: Update style button handlers for `aria-pressed` (`app.js`)

**Files:**
- Modify: `app.js` (style button click handlers and `updateTextControls`)

**Step 1: Update Bold button handler**

Find (inside `initText()`):
```js
btnBold.addEventListener('click', () => {
  btnBold.classList.toggle('active');
  updateActiveTextStyle('fontWeight', btnBold.classList.contains('active') ? 'bold' : 'normal');
});
```

Replace with:
```js
btnBold.addEventListener('click', () => {
  btnBold.classList.toggle('active');
  const isActive = btnBold.classList.contains('active');
  btnBold.setAttribute('aria-pressed', String(isActive));
  updateActiveTextStyle('fontWeight', isActive ? 'bold' : 'normal');
});
```

**Step 2: Update Italic button handler**

```js
btnItalic.addEventListener('click', () => {
  btnItalic.classList.toggle('active');
  const isActive = btnItalic.classList.contains('active');
  btnItalic.setAttribute('aria-pressed', String(isActive));
  updateActiveTextStyle('fontStyle', isActive ? 'italic' : 'normal');
});
```

**Step 3: Update Underline button handler**

```js
btnUnderline.addEventListener('click', () => {
  btnUnderline.classList.toggle('active');
  const isActive = btnUnderline.classList.contains('active');
  btnUnderline.setAttribute('aria-pressed', String(isActive));
  updateActiveTextStyle('underline', isActive);
});
```

**Step 4: Update `updateTextControls()` to sync `aria-pressed`**

Find `updateTextControls()`:
```js
function updateTextControls() {
  const active = state.canvas.getActiveObject();
  if (!active || (active.type !== 'i-text' && active.type !== 'text')) return;

  document.getElementById('font-family').value = active.fontFamily || 'Arial';
  document.getElementById('font-size').value = active.fontSize || 24;
  document.getElementById('font-color').value = active.fill || '#000000';

  document.getElementById('btn-bold').classList.toggle('active', active.fontWeight === 'bold');
  document.getElementById('btn-italic').classList.toggle('active', active.fontStyle === 'italic');
  document.getElementById('btn-underline').classList.toggle('active', !!active.underline);
}
```

Replace with:
```js
function updateTextControls() {
  const active = state.canvas.getActiveObject();
  if (!active || (active.type !== 'i-text' && active.type !== 'text')) return;

  document.getElementById('font-family').value = active.fontFamily || 'Arial';
  document.getElementById('font-size').value = active.fontSize || 24;
  document.getElementById('font-color').value = active.fill || '#000000';

  const isBold = active.fontWeight === 'bold';
  const isItalic = active.fontStyle === 'italic';
  const isUnderline = !!active.underline;

  const btnBold = document.getElementById('btn-bold');
  const btnItalic = document.getElementById('btn-italic');
  const btnUnderline = document.getElementById('btn-underline');

  btnBold.classList.toggle('active', isBold);
  btnBold.setAttribute('aria-pressed', String(isBold));
  btnItalic.classList.toggle('active', isItalic);
  btnItalic.setAttribute('aria-pressed', String(isItalic));
  btnUnderline.classList.toggle('active', isUnderline);
  btnUnderline.setAttribute('aria-pressed', String(isUnderline));
}
```

**Step 5: Verify**

Add text to canvas. Select it. Click Bold — `aria-pressed` should toggle to `true`. Inspect in DevTools Accessibility panel.

**Step 6: Commit**
```bash
git add app.js
git commit -m "a11y: add aria-pressed state management to style toggle buttons"
```

---

## Task 9: Touch panning — fix `initPanning()` for touch events (`app.js`)

**Files:**
- Modify: `app.js` (the `initPanning` function, lines 351–407)

Fabric.js fires `mouse:down/move/up` for both mouse and touch, but on touch the underlying event (`opt.e`) is a `TouchEvent` — `opt.e.clientX` is `undefined`. Also, when the user is doing a two-finger pinch, the single-touch pan handler should not fire.

**Step 1: Add a helper function above `initPanning`**

Insert before `initPanning()`:
```js
// Returns {x, y} from either MouseEvent or TouchEvent
function getPointerXY(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}
```

**Step 2: Update `initPanning()` to use `getPointerXY` and skip multi-touch**

Replace the entire `initPanning()` function:
```js
function initPanning() {
  const canvas = state.canvas;

  canvas.on('mouse:down', function(opt) {
    const e = opt.e;
    // Skip multi-touch (pinch gesture) — handled by initTouchZoom
    if (e.touches && e.touches.length > 1) return;
    if (state.zoomLevel <= 1) return;
    if (opt.target) return;

    const { x, y } = getPointerXY(e);
    state.isPanning = true;
    state.panStartX = x;
    state.panStartY = y;
    canvas.selection = false;
    canvas.setCursor('grabbing');
  });

  canvas.on('mouse:move', function(opt) {
    if (!state.isPanning) return;
    const e = opt.e;
    if (e.touches && e.touches.length > 1) return;

    const { x, y } = getPointerXY(e);
    const dx = x - state.panStartX;
    const dy = y - state.panStartY;

    const vpt = canvas.viewportTransform;
    vpt[4] += dx;
    vpt[5] += dy;

    const zoom = state.zoomLevel;
    const maxPanX = (canvas.width * zoom - canvas.width) / 2;
    const maxPanY = (canvas.height * zoom - canvas.height) / 2;
    vpt[4] = Math.max(-maxPanX, Math.min(maxPanX, vpt[4]));
    vpt[5] = Math.max(-maxPanY, Math.min(maxPanY, vpt[5]));

    canvas.setViewportTransform(vpt);

    state.panStartX = x;
    state.panStartY = y;
  });

  canvas.on('mouse:up', function() {
    if (state.isPanning) {
      state.isPanning = false;
      canvas.selection = true;
      updatePanCursor();
    }
  });

  canvas.on('mouse:over', function(opt) {
    if (state.zoomLevel > 1 && !opt.target) {
      canvas.defaultCursor = 'grab';
    }
  });

  canvas.on('mouse:out', function() {
    if (state.zoomLevel > 1) {
      canvas.defaultCursor = 'grab';
    }
  });
}
```

**Step 3: Verify (desktop)**

Desktop panning must still work. Zoom in via buttons. Click and drag on empty canvas — it should pan. Objects should still be draggable.

**Step 4: Commit**
```bash
git add app.js
git commit -m "fix: update canvas panning to handle touch events alongside mouse events"
```

---

## Task 10: Pinch-to-zoom via touch (`app.js`)

**Files:**
- Modify: `app.js` (add new function, call from DOMContentLoaded)

Fabric.js 5.x fires `touch:gesture` when two fingers move on the canvas. `opt.self.scale` is the cumulative scale from the start of the gesture. We capture the zoom level at gesture start and multiply by the cumulative scale.

**Step 1: Add `initTouchZoom()` function**

Insert after `initMobileSidebar()`, before the DOMContentLoaded block:
```js
// ===== TOUCH ZOOM (PINCH) =====
function initTouchZoom() {
  const canvas = state.canvas;
  let gestureStartZoom = null;

  canvas.on('touch:gesture', function(opt) {
    if (!opt.e.touches || opt.e.touches.length < 2) return;

    // Capture zoom at gesture start
    if (gestureStartZoom === null) {
      gestureStartZoom = state.zoomLevel;
    }

    // opt.self.scale is cumulative from gesture start
    const newZoom = gestureStartZoom * opt.self.scale;
    setZoom(newZoom);
  });

  // Reset on finger lift so next gesture starts fresh
  canvas.on('mouse:up', function() {
    gestureStartZoom = null;
  });
}
```

**Step 2: Add to DOMContentLoaded**

```js
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTabs();
  initUpload();
  initText();
  initZoom();
  initPanning();
  initToolbar();
  initResize();
  initKeyboard();
  initMobileSidebar();
  initTouchZoom();
});
```

**Step 3: Verify (DevTools touch simulation)**

In Chrome DevTools, enable the device toolbar. Set to a touch device. Open the app. Use two-finger pinch gesture on the canvas (simulate via DevTools). The canvas should zoom in/out. Zoom level display in the right panel (on desktop) should update. The ≤25% and ≥300% clamping from `setZoom()` should still be respected.

**Step 4: Commit**
```bash
git add app.js
git commit -m "feat: add pinch-to-zoom touch gesture on canvas"
```

---

## Task 11: Smoke test + final commit

No code changes. Verify everything works end-to-end across screen sizes.

**Desktop (1280px+):**
- [ ] Upload background image → canvas updates
- [ ] Upload overlay image → appears on canvas, selectable/movable
- [ ] Add text with styles (font, size, color, bold, italic, underline) → renders on canvas
- [ ] Select text on canvas → style controls update (including aria-pressed)
- [ ] Delete selected object via button and via keyboard Delete key
- [ ] Zoom in/out/reset via buttons → canvas zooms
- [ ] Zoom in then pan (mouse drag on empty canvas) → canvas pans
- [ ] Download JPG → file downloaded with full canvas contents
- [ ] Cancel → confirm dialog, all reset
- [ ] Tab through UI with keyboard — every element has a visible focus ring
- [ ] Hamburger button NOT visible on desktop

**Mobile emulation (390px, iPhone 14):**
- [ ] Hamburger button visible in header
- [ ] Tap `☰` → sidebar slides in, backdrop appears
- [ ] Tap backdrop → sidebar closes, focus returns to `☰`
- [ ] Press `Escape` → sidebar closes
- [ ] Upload image from sidebar (Browse Files)
- [ ] Add text from sidebar
- [ ] Pinch gesture on canvas → canvas zooms
- [ ] Single-finger drag on empty canvas when zoomed → pans
- [ ] Download JPG → file downloads
- [ ] Cancel → resets

**Accessibility:**
- [ ] Tab through all interactive controls — visible focus ring on each
- [ ] Style buttons (B/I/U) show `aria-pressed` in DevTools
- [ ] Tab bar shows `role="tablist"`, buttons show `role="tab"` and `aria-selected`

**Step 1: Final commit**
```bash
git add -A
git commit -m "chore: smoke test complete — mobile, tablet and accessibility implementation"
```
