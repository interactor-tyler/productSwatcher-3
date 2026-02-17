# Product Swatcher Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side product customization tool where users can upload product images, add overlays/text, apply color tints, and export compositions as JPG.

**Architecture:** Single HTML file with embedded CSS and JS. Fabric.js handles the interactive canvas (background image, color tint overlay, user-placed images and text). Quill provides the WYSIWYG editor in the Product Details tab. Three-column layout: left panel (tabs), center (canvas), right panel (zoom).

**Tech Stack:** Vanilla HTML/CSS/JS, Fabric.js 5.3.1 (CDN), Quill 2.0.3 (CDN)

---

### Task 1: Initialize Project and Create HTML Skeleton

**Files:**
- Create: `index.html`

**Step 1: Initialize git repo**

```bash
cd /Users/ghostcodestudios/Sites/2025_INTERACTOR/CLIENT/Richard\ Marshall/productSwatcher-3
git init
```

**Step 2: Create the HTML skeleton**

Create `index.html` with:
- DOCTYPE, html, head with meta charset/viewport
- CDN links: Fabric.js 5.3.1, Quill 2.0.3 CSS + JS
- Body structure with these empty container divs:
  - `#app` wrapper
  - `#header` — contains h1 "Product Swatcher"
  - `#main` — flex container for the three columns
  - `#left-panel` — will hold tabs
  - `#canvas-area` — will hold the Fabric.js canvas element
  - `#right-panel` — will hold zoom controls
  - `#bottom-toolbar` — will hold action buttons

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Swatcher</title>
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">
  <style>
    /* CSS will go here in Task 2 */
  </style>
</head>
<body>
  <div id="app">
    <header id="header">
      <h1>Product Swatcher</h1>
    </header>
    <div id="main">
      <aside id="left-panel">
        <div id="tab-bar">
          <button class="tab-btn active" data-tab="upload">Upload</button>
          <button class="tab-btn" data-tab="text">Add Text</button>
          <button class="tab-btn" data-tab="details">Product Details</button>
        </div>
        <div id="tab-content">
          <div id="tab-upload" class="tab-pane active"></div>
          <div id="tab-text" class="tab-pane"></div>
          <div id="tab-details" class="tab-pane"></div>
        </div>
      </aside>
      <main id="canvas-area">
        <canvas id="product-canvas"></canvas>
      </main>
      <aside id="right-panel"></aside>
    </div>
    <footer id="bottom-toolbar"></footer>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
  <script>
    // JS will go here starting Task 3
  </script>
</body>
</html>
```

**Step 3: Verify — open in browser**

Open `index.html` in browser. Should see the header "Product Swatcher", three tab buttons, an empty canvas area, and empty right panel/toolbar areas. Layout won't look right yet (no CSS).

**Step 4: Commit**

```bash
git add index.html docs/
git commit -m "feat: project init with HTML skeleton and design docs"
```

---

### Task 2: CSS Layout — Three-Column Structure

**Files:**
- Modify: `index.html` (the `<style>` block)

**Step 1: Add base reset and layout CSS**

Inside the `<style>` tag, add all CSS for the app layout:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #e8e8e8;
  color: #333;
  height: 100vh;
  overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Header */
#header {
  background: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  z-index: 10;
}

#header h1 {
  font-size: 18px;
  font-weight: 600;
  color: #1e39d2;
}

/* Main three-column layout */
#main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Panel */
#left-panel {
  width: 280px;
  min-width: 280px;
  background: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

#tab-bar {
  display: flex;
  border-bottom: 2px solid #eee;
  background: #fafafa;
}

.tab-btn {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.2s, border-color 0.2s;
}

.tab-btn:hover {
  color: #1e39d2;
}

.tab-btn.active {
  color: #1e39d2;
  border-bottom-color: #1e39d2;
}

#tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
}

/* Canvas Area */
#canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  padding: 20px;
  position: relative;
}

/* Right Panel */
#right-panel {
  width: 80px;
  min-width: 80px;
  background: #fff;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  gap: 8px;
}

/* Bottom Toolbar */
#bottom-toolbar {
  background: #fff;
  padding: 12px 20px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
}
```

**Step 2: Verify — open in browser**

Open `index.html`. Should see:
- White header at top with blue "Product Swatcher" title
- Three-column layout: white left panel (280px) with tabs, gray center area, white right panel (80px)
- White bottom toolbar bar

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add three-column CSS layout"
```

---

### Task 3: Fabric.js Canvas Setup with Default Background

**Files:**
- Modify: `index.html` (the `<script>` block)

**Step 1: Initialize Fabric.js canvas and create default background**

Inside the `<script>` tag, add the canvas initialization code. The canvas should size itself to fit the center area. Create a default placeholder background (gray rectangle with "Upload a Product Image" text).

```javascript
// ===== APP STATE =====
const state = {
  canvas: null,
  backgroundImage: null,
  tintOverlay: null,
  tintColor: null,
  quillEditor: null,
  zoomLevel: 1,
  uploadedOverlays: [],
};

// ===== CANVAS SETUP =====
function initCanvas() {
  const area = document.getElementById('canvas-area');
  const width = Math.min(area.clientWidth - 40, 600);
  const height = Math.min(area.clientHeight - 40, 500);

  state.canvas = new fabric.Canvas('product-canvas', {
    width: width,
    height: height,
    backgroundColor: '#ffffff',
    selection: true,
    preserveObjectStacking: true,
  });

  loadDefaultBackground();
}

function loadDefaultBackground() {
  const canvas = state.canvas;
  const defaultBg = new fabric.Rect({
    width: canvas.width,
    height: canvas.height,
    fill: '#e0e0e0',
    selectable: false,
    evented: false,
  });

  const placeholderText = new fabric.Text('Upload a Product Image', {
    fontSize: 20,
    fill: '#999',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    selectable: false,
    evented: false,
  });

  placeholderText.set({
    left: (canvas.width - placeholderText.width) / 2,
    top: (canvas.height - placeholderText.height) / 2,
  });

  const bgGroup = new fabric.Group([defaultBg, placeholderText], {
    selectable: false,
    evented: false,
    name: 'defaultBackground',
  });

  state.backgroundImage = bgGroup;
  canvas.insertAt(bgGroup, 0);
  canvas.renderAll();
}

function setBackgroundImage(dataUrl) {
  const canvas = state.canvas;

  fabric.Image.fromURL(dataUrl, function(img) {
    if (state.backgroundImage) {
      canvas.remove(state.backgroundImage);
    }

    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    const scale = Math.min(scaleX, scaleY);

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: (canvas.width - img.width * scale) / 2,
      top: (canvas.height - img.height * scale) / 2,
      selectable: false,
      evented: false,
      name: 'backgroundImage',
    });

    state.backgroundImage = img;
    canvas.insertAt(img, 0);

    if (state.tintOverlay) {
      canvas.remove(state.tintOverlay);
      canvas.insertAt(state.tintOverlay, 1);
    }

    canvas.renderAll();
  });
}

// ===== TAB SWITCHING =====
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const tabId = 'tab-' + btn.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTabs();
});
```

**Step 2: Verify — open in browser**

Should see the Fabric.js canvas centered in the gray area, showing a light gray rectangle with "Upload a Product Image" placeholder text. Tab buttons should switch active states when clicked (though tab content is still empty).

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: Fabric.js canvas with default background and tab switching"
```

---

### Task 4: Upload Tab — Background and Overlay Upload

**Files:**
- Modify: `index.html` — add HTML inside `#tab-upload`, add CSS, add JS

**Step 1: Add Upload tab HTML**

Inside `<div id="tab-upload" class="tab-pane active">`, add:

```html
<div class="upload-section">
  <h3 class="section-title">Upload Image</h3>

  <div id="upload-dropzone" class="dropzone">
    <p>Drag & drop image here</p>
    <p class="dropzone-sub">or</p>
    <label class="btn btn-primary upload-label">
      Browse Files
      <input type="file" id="file-input" accept="image/*" hidden>
    </label>
  </div>

  <div class="upload-mode">
    <label class="radio-label">
      <input type="radio" name="upload-mode" value="overlay" checked>
      Add as Overlay
    </label>
    <label class="radio-label">
      <input type="radio" name="upload-mode" value="background">
      Set as Background
    </label>
  </div>

  <div id="overlay-gallery" class="overlay-gallery">
    <h4 class="section-subtitle">Uploaded Overlays</h4>
    <div id="overlay-thumbs" class="thumb-grid"></div>
  </div>
</div>
```

**Step 2: Add Upload CSS**

```css
/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background: #1e39d2;
  color: #fff;
}

.btn-primary:hover {
  background: #1630b0;
}

.btn-secondary {
  background: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Section titles */
.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.section-subtitle {
  font-size: 12px;
  font-weight: 600;
  margin: 12px 0 8px;
  color: #666;
}

/* Upload dropzone */
.dropzone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.dropzone.drag-over {
  border-color: #1e39d2;
  background: #f0f3ff;
}

.dropzone p {
  margin-bottom: 4px;
}

.dropzone-sub {
  font-size: 11px;
  margin: 8px 0 !important;
}

.upload-label {
  display: inline-block;
  margin-top: 8px;
}

/* Upload mode radios */
.upload-mode {
  margin-top: 12px;
  display: flex;
  gap: 16px;
}

.radio-label {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #555;
}

/* Overlay gallery */
.overlay-gallery {
  margin-top: 16px;
}

.thumb-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.thumb-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border: 2px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumb-grid img:hover {
  border-color: #1e39d2;
}
```

**Step 3: Add Upload JS**

```javascript
// ===== UPLOAD FUNCTIONALITY =====
function initUpload() {
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('file-input');

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
    fileInput.value = '';
  });

  dropzone.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT') {
      fileInput.click();
    }
  });
}

function handleImageUpload(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    const mode = document.querySelector('input[name="upload-mode"]:checked').value;

    if (mode === 'background') {
      setBackgroundImage(dataUrl);
    } else {
      addOverlayImage(dataUrl);
      addOverlayThumbnail(dataUrl);
    }
  };
  reader.readAsDataURL(file);
}

function addOverlayImage(dataUrl) {
  const canvas = state.canvas;

  fabric.Image.fromURL(dataUrl, function(img) {
    const maxW = canvas.width * 0.4;
    const maxH = canvas.height * 0.4;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      name: 'overlay',
    });

    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  });
}

function addOverlayThumbnail(dataUrl) {
  state.uploadedOverlays.push(dataUrl);
  const thumbsContainer = document.getElementById('overlay-thumbs');
  const thumb = document.createElement('img');
  thumb.src = dataUrl;
  thumb.title = 'Click to add again';
  thumb.addEventListener('click', () => addOverlayImage(dataUrl));
  thumbsContainer.appendChild(thumb);
}
```

Add `initUpload()` call inside the `DOMContentLoaded` handler.

**Step 4: Verify — open in browser**

- Upload tab should show a drag-and-drop zone with "Browse Files" button
- Select "Add as Overlay" and upload an image — it should appear on the canvas, movable/resizable
- Select "Set as Background" and upload — it should replace the default placeholder
- Uploaded overlays should appear as thumbnails; clicking a thumbnail adds it again

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: upload tab with background and overlay image support"
```

---

### Task 5: Add Text Tab with Font Controls

**Files:**
- Modify: `index.html` — add HTML inside `#tab-text`, add CSS, add JS

**Step 1: Add Text tab HTML**

Inside `<div id="tab-text" class="tab-pane">`, add:

```html
<div class="text-section">
  <h3 class="section-title">Add Text</h3>

  <div class="form-group">
    <input type="text" id="text-input" class="form-input" placeholder="Enter your text...">
    <button id="add-text-btn" class="btn btn-primary" style="width:100%; margin-top:8px;">Add Text</button>
  </div>

  <div class="text-controls" id="text-controls">
    <h4 class="section-subtitle">Text Properties</h4>

    <div class="form-group">
      <label class="form-label">Font</label>
      <select id="font-family" class="form-select">
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
        <option value="Verdana">Verdana</option>
        <option value="Impact">Impact</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Size</label>
      <input type="number" id="font-size" class="form-input" value="24" min="8" max="120">
    </div>

    <div class="form-group">
      <label class="form-label">Color</label>
      <input type="color" id="font-color" class="form-color" value="#000000">
    </div>

    <div class="form-group">
      <label class="form-label">Style</label>
      <div class="style-buttons">
        <button id="btn-bold" class="style-btn" title="Bold"><b>B</b></button>
        <button id="btn-italic" class="style-btn" title="Italic"><i>I</i></button>
        <button id="btn-underline" class="style-btn" title="Underline"><u>U</u></button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Align</label>
      <div class="style-buttons">
        <button class="style-btn align-btn" data-align="left" title="Left Align">&#8676;</button>
        <button class="style-btn align-btn" data-align="center" title="Center Align">&#8803;</button>
        <button class="style-btn align-btn" data-align="right" title="Right Align">&#8677;</button>
      </div>
    </div>

    <button id="delete-selected" class="btn btn-secondary" style="width:100%; margin-top:12px;">Delete Selected</button>
  </div>
</div>
```

**Step 2: Add Text CSS**

```css
/* Form elements */
.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.form-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #1e39d2;
}

.form-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  background: #fff;
}

.form-color {
  width: 100%;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
}

/* Style buttons */
.style-buttons {
  display: flex;
  gap: 4px;
}

.style-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}

.style-btn:hover {
  background: #f0f3ff;
  border-color: #1e39d2;
}

.style-btn.active {
  background: #1e39d2;
  color: #fff;
  border-color: #1e39d2;
}
```

**Step 3: Add Text JS**

```javascript
// ===== TEXT FUNCTIONALITY =====
function initText() {
  const addBtn = document.getElementById('add-text-btn');
  const textInput = document.getElementById('text-input');
  const fontFamily = document.getElementById('font-family');
  const fontSize = document.getElementById('font-size');
  const fontColor = document.getElementById('font-color');
  const btnBold = document.getElementById('btn-bold');
  const btnItalic = document.getElementById('btn-italic');
  const btnUnderline = document.getElementById('btn-underline');
  const deleteBtn = document.getElementById('delete-selected');

  addBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) return;

    const itext = new fabric.IText(text, {
      left: state.canvas.width / 2,
      top: state.canvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: fontFamily.value,
      fontSize: parseInt(fontSize.value),
      fill: fontColor.value,
      fontWeight: btnBold.classList.contains('active') ? 'bold' : 'normal',
      fontStyle: btnItalic.classList.contains('active') ? 'italic' : 'normal',
      underline: btnUnderline.classList.contains('active'),
      name: 'userText',
    });

    state.canvas.add(itext);
    state.canvas.setActiveObject(itext);
    state.canvas.renderAll();
    textInput.value = '';
  });

  btnBold.addEventListener('click', () => {
    btnBold.classList.toggle('active');
    updateActiveTextStyle('fontWeight', btnBold.classList.contains('active') ? 'bold' : 'normal');
  });

  btnItalic.addEventListener('click', () => {
    btnItalic.classList.toggle('active');
    updateActiveTextStyle('fontStyle', btnItalic.classList.contains('active') ? 'italic' : 'normal');
  });

  btnUnderline.addEventListener('click', () => {
    btnUnderline.classList.toggle('active');
    updateActiveTextStyle('underline', btnUnderline.classList.contains('active'));
  });

  fontFamily.addEventListener('change', () => {
    updateActiveTextStyle('fontFamily', fontFamily.value);
  });

  fontSize.addEventListener('change', () => {
    updateActiveTextStyle('fontSize', parseInt(fontSize.value));
  });

  fontColor.addEventListener('input', () => {
    updateActiveTextStyle('fill', fontColor.value);
  });

  document.querySelectorAll('.align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateActiveTextStyle('textAlign', btn.dataset.align);
    });
  });

  deleteBtn.addEventListener('click', () => {
    const active = state.canvas.getActiveObject();
    if (active && active.name !== 'defaultBackground' && active.name !== 'backgroundImage' && active.name !== 'tintOverlay') {
      state.canvas.remove(active);
      state.canvas.renderAll();
    }
  });

  state.canvas.on('selection:created', updateTextControls);
  state.canvas.on('selection:updated', updateTextControls);
}

function updateActiveTextStyle(property, value) {
  const active = state.canvas.getActiveObject();
  if (active && (active.type === 'i-text' || active.type === 'text')) {
    active.set(property, value);
    state.canvas.renderAll();
  }
}

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

Add `initText()` call inside the `DOMContentLoaded` handler.

**Step 4: Verify — open in browser**

- Click "Add Text" tab
- Type text, click "Add Text" — text should appear on canvas
- Select text object — controls should update to match its properties
- Change font, size, color, bold/italic/underline — should update the selected text live
- Double-click text on canvas — should enable inline editing
- "Delete Selected" should remove the selected object

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add text tab with font controls and inline editing"
```

---

### Task 6: Product Details Tab — Color Swatches and Quill Editor

**Files:**
- Modify: `index.html` — add HTML inside `#tab-details`, add CSS, add JS

**Step 1: Add Product Details tab HTML**

Inside `<div id="tab-details" class="tab-pane">`, add:

```html
<div class="details-section">
  <h3 class="section-title">Product Details</h3>

  <div class="color-swatches-section">
    <h4 class="section-subtitle">Product Colors Available</h4>
    <div id="color-swatches" class="swatch-grid">
      <button class="swatch" data-color="#FF0000" style="background:#FF0000" title="Red"></button>
      <button class="swatch" data-color="#0000FF" style="background:#0000FF" title="Blue"></button>
      <button class="swatch" data-color="#008000" style="background:#008000" title="Green"></button>
      <button class="swatch" data-color="#FFFF00" style="background:#FFFF00" title="Yellow"></button>
      <button class="swatch" data-color="#FF8C00" style="background:#FF8C00" title="Orange"></button>
      <button class="swatch" data-color="#800080" style="background:#800080" title="Purple"></button>
      <button class="swatch" data-color="#000000" style="background:#000000" title="Black"></button>
      <button class="swatch" data-color="#FFFFFF" style="background:#FFFFFF; border-color:#ccc" title="White"></button>
    </div>
    <button id="clear-tint" class="btn btn-secondary" style="width:100%; margin-top:8px; font-size:11px;">Clear Tint</button>
  </div>

  <div class="product-info-section">
    <h4 class="section-subtitle">Product Details</h4>
    <div id="quill-editor"></div>
  </div>
</div>
```

**Step 2: Add Product Details CSS**

```css
/* Color swatches */
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.swatch {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
  padding: 0;
}

.swatch:hover {
  transform: scale(1.1);
  border-color: #1e39d2;
}

.swatch.active {
  border-color: #1e39d2;
  box-shadow: 0 0 0 2px #1e39d2;
}

/* Quill editor container */
.product-info-section {
  margin-top: 20px;
}

#quill-editor {
  min-height: 150px;
  background: #fff;
  border-radius: 0 0 4px 4px;
}

.product-info-section .ql-toolbar {
  border-radius: 4px 4px 0 0;
}

.product-info-section .ql-container {
  border-radius: 0 0 4px 4px;
  font-size: 13px;
}
```

**Step 3: Add Product Details JS (swatches + tint + Quill)**

```javascript
// ===== PRODUCT DETAILS FUNCTIONALITY =====
function initProductDetails() {
  state.quillEditor = new Quill('#quill-editor', {
    theme: 'snow',
    placeholder: 'Enter product details, specs, or notes...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }],
        ['clean'],
      ],
    },
  });

  const swatches = document.querySelectorAll('.swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      applyTint(swatch.dataset.color);
    });
  });

  document.getElementById('clear-tint').addEventListener('click', () => {
    swatches.forEach(s => s.classList.remove('active'));
    removeTint();
  });
}

function applyTint(color) {
  const canvas = state.canvas;

  if (state.tintOverlay) {
    canvas.remove(state.tintOverlay);
  }

  const tint = new fabric.Rect({
    width: canvas.width,
    height: canvas.height,
    fill: color,
    opacity: 0.25,
    selectable: false,
    evented: false,
    name: 'tintOverlay',
  });

  state.tintOverlay = tint;
  state.tintColor = color;

  canvas.insertAt(tint, 1);
  canvas.renderAll();
}

function removeTint() {
  if (state.tintOverlay) {
    state.canvas.remove(state.tintOverlay);
    state.tintOverlay = null;
    state.tintColor = null;
    state.canvas.renderAll();
  }
}
```

Add `initProductDetails()` call inside the `DOMContentLoaded` handler.

**Step 4: Verify — open in browser**

- Click "Product Details" tab
- See grid of 8 color swatches
- Click a swatch — canvas should show a semi-transparent color overlay on top of the background
- Click "Clear Tint" — overlay should be removed
- Quill editor should be visible with toolbar (bold, italic, underline, headers, lists, color)
- Typing in the editor should work with formatting

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: product details tab with color tint swatches and Quill editor"
```

---

### Task 7: Zoom Controls — Right Panel

**Files:**
- Modify: `index.html` — add HTML inside `#right-panel`, add CSS, add JS

**Step 1: Add Zoom HTML**

Inside `<aside id="right-panel">`, add:

```html
<div class="zoom-controls">
  <span class="zoom-label">Zoom</span>
  <button id="zoom-in" class="zoom-btn" title="Zoom In">+</button>
  <span id="zoom-level" class="zoom-value">100%</span>
  <button id="zoom-out" class="zoom-btn" title="Zoom Out">&minus;</button>
  <button id="zoom-reset" class="zoom-btn zoom-reset" title="Reset Zoom">Reset</button>
</div>
```

**Step 2: Add Zoom CSS**

```css
/* Zoom controls */
.zoom-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.zoom-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}

.zoom-btn:hover {
  background: #f0f3ff;
  border-color: #1e39d2;
}

.zoom-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.zoom-reset {
  border-radius: 4px;
  width: auto;
  padding: 6px 12px;
  font-size: 11px;
  margin-top: 4px;
}
```

**Step 3: Add Zoom JS**

```javascript
// ===== ZOOM FUNCTIONALITY =====
function initZoom() {
  document.getElementById('zoom-in').addEventListener('click', () => {
    setZoom(state.zoomLevel + 0.1);
  });

  document.getElementById('zoom-out').addEventListener('click', () => {
    setZoom(state.zoomLevel - 0.1);
  });

  document.getElementById('zoom-reset').addEventListener('click', () => {
    setZoom(1);
  });
}

function setZoom(level) {
  level = Math.max(0.25, Math.min(3, level));
  state.zoomLevel = level;
  state.canvas.setZoom(level);
  document.getElementById('zoom-level').textContent = Math.round(level * 100) + '%';
  state.canvas.renderAll();
}
```

Add `initZoom()` call inside the `DOMContentLoaded` handler.

**Step 4: Verify — open in browser**

- Right panel should show "Zoom" label, +/- buttons, percentage, and Reset button
- Click + to zoom in — canvas content should enlarge, percentage should increase
- Click - to zoom out — canvas content should shrink, percentage should decrease
- Click Reset — should return to 100%
- Zoom should be clamped between 25% and 300%

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: zoom controls in right panel"
```

---

### Task 8: Bottom Toolbar — Cancel, Save Image, Download JPG

**Files:**
- Modify: `index.html` — add HTML inside `#bottom-toolbar`, add JS

**Step 1: Add Bottom Toolbar HTML**

Inside `<footer id="bottom-toolbar">`, add:

```html
<button id="btn-cancel" class="btn btn-secondary">Cancel</button>
<button id="btn-save" class="btn btn-primary">Save Image</button>
<button id="btn-download" class="btn btn-primary">Download JPG</button>
```

**Step 2: Add Bottom Toolbar JS**

```javascript
// ===== BOTTOM TOOLBAR =====
function initToolbar() {
  document.getElementById('btn-cancel').addEventListener('click', handleCancel);
  document.getElementById('btn-save').addEventListener('click', handleSaveImage);
  document.getElementById('btn-download').addEventListener('click', handleDownloadJPG);
}

function handleCancel() {
  if (!confirm('Reset all changes? This cannot be undone.')) return;

  const canvas = state.canvas;

  canvas.clear();

  state.backgroundImage = null;
  state.tintOverlay = null;
  state.tintColor = null;
  state.uploadedOverlays = [];
  state.zoomLevel = 1;

  canvas.setZoom(1);
  document.getElementById('zoom-level').textContent = '100%';

  canvas.backgroundColor = '#ffffff';
  loadDefaultBackground();

  // Clear overlay thumbnails using safe DOM manipulation
  const thumbsContainer = document.getElementById('overlay-thumbs');
  while (thumbsContainer.firstChild) {
    thumbsContainer.removeChild(thumbsContainer.firstChild);
  }

  if (state.quillEditor) {
    state.quillEditor.setContents([]);
  }

  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));

  const overlayRadio = document.querySelector('input[name="upload-mode"][value="overlay"]');
  if (overlayRadio) overlayRadio.checked = true;

  canvas.renderAll();
}

function handleSaveImage() {
  const canvas = state.canvas;

  canvas.discardActiveObject();
  canvas.renderAll();

  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2,
  });

  canvas.clear();
  canvas.backgroundColor = '#ffffff';

  fabric.Image.fromURL(dataUrl, function(img) {
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    img.set({
      scaleX: scale,
      scaleY: scale,
      left: canvas.width / 2,
      top: canvas.height / 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });
    canvas.add(img);
    canvas.renderAll();
  });
}

function handleDownloadJPG() {
  const canvas = state.canvas;

  canvas.discardActiveObject();
  canvas.renderAll();

  const dataUrl = canvas.toDataURL({
    format: 'jpeg',
    quality: 0.95,
    multiplier: 2,
  });

  const link = document.createElement('a');
  link.download = 'product-swatcher-' + Date.now() + '.jpg';
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

Add `initToolbar()` call inside the `DOMContentLoaded` handler.

**Step 3: Verify — open in browser**

- Three buttons should appear in the bottom bar: Cancel (gray), Save Image (blue), Download JPG (blue)
- Add some text/images to canvas, then click Cancel — confirm dialog should appear, then reset everything
- Click "Save Image" — canvas should flatten into a static high-res image preview
- Click "Download JPG" — browser should download a JPG file

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: bottom toolbar with cancel, save, and download"
```

---

### Task 9: Polish — Canvas Resize, Keyboard Shortcuts, Visual Refinements

**Files:**
- Modify: `index.html`

**Step 1: Add window resize handler**

```javascript
// ===== WINDOW RESIZE =====
function initResize() {
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const area = document.getElementById('canvas-area');
      const width = Math.min(area.clientWidth - 40, 600);
      const height = Math.min(area.clientHeight - 40, 500);
      state.canvas.setDimensions({ width, height });
      state.canvas.renderAll();
    }, 200);
  });
}
```

**Step 2: Add Delete key support**

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.classList.contains('ql-editor')) return;

    const active = state.canvas.getActiveObject();
    if (active && active.name !== 'defaultBackground' && active.name !== 'backgroundImage' && active.name !== 'tintOverlay') {
      state.canvas.remove(active);
      state.canvas.renderAll();
    }
  }
});
```

**Step 3: Add canvas shadow styling**

Add to CSS:

```css
.canvas-container {
  box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important;
  border-radius: 4px !important;
}
```

Add `initResize()` call inside the `DOMContentLoaded` handler.

**Step 4: Final verification — test complete flow**

1. Open app — see default background, three tabs, zoom controls, bottom toolbar
2. Upload tab: upload background image, upload overlay, see thumbnails
3. Add Text tab: add text, format it, move it around
4. Product Details tab: select color swatch (see tint), clear tint, type in Quill editor
5. Zoom: zoom in/out/reset
6. Cancel: confirm and reset everything
7. Save Image: flatten canvas to static preview
8. Download JPG: download file
9. Resize browser window — canvas should adapt

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: polish — resize handling, keyboard shortcuts, visual refinements"
```

---

## Summary of All Tasks

| Task | Description | Key Steps |
|------|-------------|-----------|
| 1 | HTML skeleton + git init | 4 |
| 2 | CSS three-column layout | 3 |
| 3 | Fabric.js canvas + default background | 3 |
| 4 | Upload tab (background + overlay) | 5 |
| 5 | Add Text tab with font controls | 5 |
| 6 | Product Details (swatches + Quill) | 5 |
| 7 | Zoom controls | 5 |
| 8 | Bottom toolbar (Cancel/Save/Download) | 4 |
| 9 | Polish (resize, keyboard, styling) | 5 |

**Total: 9 tasks, ~39 steps**

**DOMContentLoaded init order:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTabs();
  initUpload();
  initText();
  initProductDetails();
  initZoom();
  initToolbar();
  initResize();
});
```
