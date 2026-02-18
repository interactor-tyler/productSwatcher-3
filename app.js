// ===== APP STATE =====
const state = {
  canvas: null,
  backgroundImage: null,
  quillEditor: null,
  zoomLevel: 1,
  uploadedOverlays: [],
  isPanning: false,
  panStartX: 0,
  panStartY: 0,
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
    fill: '#8c8b8b',
    fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    canvas.renderAll();
  });
}

// ===== TAB SWITCHING =====
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
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
  });
}

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
    if (!e.target.closest('.upload-label')) {
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

// ===== TEXT FUNCTIONALITY =====
function initText() {
  // Initialize Quill editor for product details text input
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

  const addBtn = document.getElementById('add-text-btn');
  const fontFamily = document.getElementById('font-family');
  const fontSize = document.getElementById('font-size');
  const fontColor = document.getElementById('font-color');
  const btnBold = document.getElementById('btn-bold');
  const btnItalic = document.getElementById('btn-italic');
  const btnUnderline = document.getElementById('btn-underline');
  const deleteBtn = document.getElementById('delete-selected');

  // Add text from Quill editor to canvas
  addBtn.addEventListener('click', () => {
    const text = state.quillEditor.getText().trim();
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
    state.quillEditor.setContents([]);
  });

  // Style toggles
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

  // Delete selected object
  deleteBtn.addEventListener('click', () => {
    const active = state.canvas.getActiveObject();
    if (active && active.name !== 'defaultBackground' && active.name !== 'backgroundImage') {
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

  // Reset pan when zooming back to 100% or below
  if (level <= 1) {
    const vpt = state.canvas.viewportTransform;
    vpt[4] = 0;
    vpt[5] = 0;
    state.canvas.setViewportTransform(vpt);
  }

  updatePanCursor();
  state.canvas.renderAll();
}

// ===== CANVAS PANNING =====
function initPanning() {
  const canvas = state.canvas;

  canvas.on('mouse:down', function(opt) {
    // Only pan when zoomed in and clicking on empty canvas (no object targeted)
    if (state.zoomLevel <= 1) return;
    if (opt.target) return;

    state.isPanning = true;
    state.panStartX = opt.e.clientX;
    state.panStartY = opt.e.clientY;
    canvas.selection = false;
    canvas.setCursor('grabbing');
  });

  canvas.on('mouse:move', function(opt) {
    if (!state.isPanning) return;

    const dx = opt.e.clientX - state.panStartX;
    const dy = opt.e.clientY - state.panStartY;

    const vpt = canvas.viewportTransform;
    vpt[4] += dx;
    vpt[5] += dy;

    // Clamp panning so canvas doesn't scroll too far off screen
    const zoom = state.zoomLevel;
    const maxPanX = (canvas.width * zoom - canvas.width) / 2;
    const maxPanY = (canvas.height * zoom - canvas.height) / 2;
    vpt[4] = Math.max(-maxPanX, Math.min(maxPanX, vpt[4]));
    vpt[5] = Math.max(-maxPanY, Math.min(maxPanY, vpt[5]));

    canvas.setViewportTransform(vpt);

    state.panStartX = opt.e.clientX;
    state.panStartY = opt.e.clientY;
  });

  canvas.on('mouse:up', function() {
    if (state.isPanning) {
      state.isPanning = false;
      canvas.selection = true;
      updatePanCursor();
    }
  });

  // Update cursor when hovering over empty canvas area while zoomed
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

function updatePanCursor() {
  const canvas = state.canvas;
  if (state.zoomLevel > 1) {
    canvas.defaultCursor = 'grab';
  } else {
    canvas.defaultCursor = 'default';
  }
}

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
  state.uploadedOverlays = [];
  state.zoomLevel = 1;

  canvas.setZoom(1);
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  document.getElementById('zoom-level').textContent = '100%';
  updatePanCursor();

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

  const overlayRadio = document.querySelector('input[name="upload-mode"][value="overlay"]');
  if (overlayRadio) overlayRadio.checked = true;

  canvas.renderAll();
}

function handleSaveImage() {
  const canvas = state.canvas;

  canvas.discardActiveObject();
  canvas.renderAll();

  // Temporarily reset zoom and pan for accurate export
  const currentZoom = state.zoomLevel;
  const currentVpt = canvas.viewportTransform.slice();
  canvas.setZoom(1);
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2,
  });

  canvas.setZoom(currentZoom);
  canvas.setViewportTransform(currentVpt);

  canvas.clear();
  canvas.backgroundColor = '#ffffff';

  // Clear stale state references after canvas.clear()
  state.backgroundImage = null;

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

  // Temporarily reset zoom and pan for accurate export
  const currentZoom = state.zoomLevel;
  const currentVpt = canvas.viewportTransform.slice();
  canvas.setZoom(1);
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const dataUrl = canvas.toDataURL({
    format: 'jpeg',
    quality: 0.95,
    multiplier: 2,
  });

  canvas.setZoom(currentZoom);
  canvas.setViewportTransform(currentVpt);

  const link = document.createElement('a');
  link.download = 'product-swatcher-' + Date.now() + '.jpg';
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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

// ===== KEYBOARD SHORTCUTS =====
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || e.target.classList.contains('ql-editor')) return;

      const active = state.canvas.getActiveObject();
      // Don't delete if IText is in inline editing mode
      if (active && active.isEditing) return;
      if (active && active.name !== 'defaultBackground' && active.name !== 'backgroundImage') {
        state.canvas.remove(active);
        state.canvas.renderAll();
      }
    }
  });
}

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
      closeSidebar();
    }
  });
}

// ===== INIT =====
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
