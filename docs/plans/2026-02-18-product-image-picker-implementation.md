# Product Image Picker Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an inline product image picker to the Upload tab that lets users select pre-loaded product images as canvas backgrounds.

**Architecture:** A new "Product Images" section in the Upload tab with a color-variants quick-pick row and collapsible `<details>` accordion sections for each category. All image paths are hardcoded in a JS data structure. Clicking a thumbnail calls the existing `setBackgroundImage()`. Native lazy loading handles the ~200 images.

**Tech Stack:** Vanilla JS, HTML `<details>/<summary>`, CSS Grid, Fabric.js (existing)

---

### Task 1: Add Product Images HTML Container

**Files:**
- Modify: `index.html:51-55` (inside `#tab-upload`, after overlay gallery)

**Step 1: Add the product images section container**

In `index.html`, after the closing `</div>` of `#overlay-gallery` (line 54) and before the closing `</div>` of `.upload-section` (line 55), insert:

```html
              <div id="product-images" class="product-images-section">
                <h3 class="section-title">Product Images</h3>
                <div id="color-variants" class="color-variants-row"></div>
                <div id="product-categories"></div>
              </div>
```

**Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add product images section container in upload tab"
```

---

### Task 2: Add Image Data Structure and Render Function

**Files:**
- Modify: `app.js:1` (add data constants at top, before `const state`)
- Modify: `app.js:692-704` (add `initProductImages()` call in DOMContentLoaded)

**Step 1: Add data constants at the top of app.js**

Insert before `// ===== APP STATE =====` (line 1):

```javascript
// ===== PRODUCT IMAGE DATA =====
const COLOR_VARIANTS = [
  { file: 'BLACK_-_OW_1.jpg', label: 'Black One-Wrap' },
  { file: 'BLUE_-_OW_1.jpg', label: 'Blue One-Wrap' },
  { file: 'GREEN_-_OW_1.jpg', label: 'Green One-Wrap' },
  { file: 'ORANGE_-_OW_1.jpg', label: 'Orange One-Wrap' },
  { file: 'YELLOW_-_OW_1.jpg', label: 'Yellow One-Wrap' },
];

const PRODUCT_CATEGORIES = [
  {
    name: 'One-Wrap Color Variants',
    path: 'productImgs/downloads/One-Wrap_Color_Variants/',
    files: [
      '1-1.jpg',
      '3_c80685b0-8469-40c8-9f07-f7d88658121d.jpg',
      'BLACK_-_OW_1.jpg',
      'BLUE_-_OW_1.jpg',
      'ezgif-1-ee7e1548a7.jpg',
      'GREEN_-_OW_1.jpg',
      'ORANGE_-_OW_1.jpg',
      'YELLOW_-_OW_1.jpg',
    ],
  },
  {
    name: 'SPEEDWRAP Products',
    path: 'productImgs/downloads/SPEEDWRAP_Products/',
    files: [
      '12_f2eaaee1-53e9-4525-9c7b-5b28583dd3ec.jpg',
      '37_94adb1d3-1e0d-46fe-9c81-84b7cfeb6425.jpg',
      '38_eac3c35c-2523-41ff-80c0-786c0a6cd896.jpg',
      '39_5579aaf4-8150-403e-a5f7-86810429c2ba.jpg',
      '40_49465b7d-9fc3-4845-bd56-671ae6394eb6.jpg',
      '41_sharpie.jpg',
      '42_817167ad-03b1-4955-8826-f529ac5876d9.jpg',
      '43_34007d3b-e3c7-4ad2-91e0-40dc16e340da.jpg',
      '49_5cdbd3e5-151f-4f3a-b4fa-bd28373bcfd7.jpg',
      '7_6e4c6fcb-60ce-48db-a735-522910d37888.jpg',
      'aqua_roll_36aa203d-1984-4703-9f72-6663ddb46b21.jpg',
      'black_roll_9c0d4b6c-d9fd-4e44-88fa-fed0b6561bb7.jpg',
      'brown_roll_wrapped_3f1c6608-3299-4f82-ba0f-955ed47c80a6.jpg',
      'CableTies_4af0f037-ecb5-47c1-8675-21a70b388b71.png',
      'CableTies_e3b96fa2-e2a8-475f-a564-90bce8df792d.png',
      'CableTies.png',
      'cinch-straps-speedwrap-anylength-strap-10-pack-9-1_331b59ba-b047-4c4e-8c84-abf448f849f6.jpg',
      'cinch.jpg',
      'cinch3.jpg',
      'CinchStraps_3a5b841a-c3fa-49fb-a976-c6e8d50a0749.png',
      'CinchStraps.png',
      'green_roll_2712ba81-1e8b-4860-a679-a3da4721e09d.jpg',
      'Hook_LoopTapes_c2a5583d-bee8-4913-a480-c6e6043bc97e.png',
      'IUL1.jpg',
      'IUOW1.jpg',
      'IUOW2.jpg',
      'IUOW3.jpg',
      'place_9f22b7bc-8f2c-4a4a-a348-fd2c2c7ab992.jpg',
      'printedcableties.jpg',
      'printedtape.jpg',
      'purple_roll_wrapped_0d1f2295-d94d-4a9a-900e-d7fac2773d96.jpg',
      'red_roll_59f3ea1d-16bd-4050-8f8c-21d2d213e349.jpg',
      'remove_a9dcf0fa-55fa-4747-bd53-88b1990e7409.jpg',
      'remove_strip_873ef5da-f9dd-4abd-938e-2356ec1bc16a.jpg',
      'rolls_7b904c2f-851a-4b05-816d-9f93dc8f9a82.jpg',
      'sign_5c19c81f-38bc-4d27-b90c-c3828b920454.jpg',
      'SOW1.jpg',
      'SOW2.jpg',
      'SPEEDWRAP__40piece_variety_Pack_4_sizes-scaled-600x600_jpg.jpg',
      'SPEEDWRAP__Cable_Tie_Maroon.jpg',
      'SPEEDWRAP__Hook_and_Loop_Cord_Connector_1_Final-1-resize_2e9cc017-25b4-48b0-88c8-f94d99f07290.jpg',
      'SPEEDWRAP__Hook_and_Loop_Heavy_Duty_Cable_Tie_8780b39c-5f77-4b28-88c5-f9f30a88bcd9.jpg',
      'SPEEDWRAP__Ty_UP_Engaged_994b55ad-1e97-4ff9-b66c-ed6c4d5a65f2.jpg',
      'SPEEDWRAP_C2_AE_Hook_and_Loop_Cable_Tie_Black_1_Final_476c0f92-8392-4c9b-92ce-0fe6f7941796.jpg',
      'SPEEDWRAP_C2_AE_Hook_and_Loop_Cinch_Strap_Grommet_1_Final-600x401_7964f4dd-fcb3-4a77-9f04-1c21c69f329a.jpg',
      'SPEEDWRAP_C2_AE_Hook_and_Loop_Printed_Cable_Tie_Xfinity-600x600_39d2bab4-8162-492a-88d1-22650a701135.jpg',
      'SPEEDWRAP_C2_AE_Hook_and_Loop_Tie_Bundle_Band_4_Final_fd9c2d97-04f2-4c53-909d-6aad80bf7963.jpg',
      'SPEEDWRAP_C2_AE_Hook_and_Loop_Tie_Wrap_1_Final_00ef1bf4-610a-48df-bc32-744d586497c6.jpg',
      'SPEEDWRAP_C2_AE_Hook_and_Loop_Writable_Surface_Tie_Final_4ac194dd-c5d2-4a4f-bbf7-ee322c427718.jpg',
      'SPEEDWRAP_C2_AE_Low_Profile_Cable_Tie_TopBottom_3985db55-a054-45a7-8353-d21e888112a8.jpg',
      'SPEEDWRAP_C2_AE_LowProfile_CableTie_2-1-600x899_e283ed9e-4a3a-4595-89cf-a7482620ea76.jpg',
      'SPEEDWRAP_C2_AE-All_Weather_Cinch_Strap_A_ecc71621-8021-45f7-a231-03fea564517a.jpg',
      'SPEEDWRAP_C2_AE-Compression_Cinch_Strap_A_cf8df499-d24e-4e77-8bda-95dbe167a5aa.jpg',
      'SPEEDWRAP_C2_AE-Cut_to_Length_HookLoop_Tape_Purple_A_2f9fec7d-3fcd-48ea-965e-a418e081e4d1.jpg',
      'SPEEDWRAP_C2_AE-Cut_to_Length_HookLoop_Tape_Reel_Maroon_A_65dd5f82-e50a-47a2-abe0-2ce1bdb36425.jpg',
      'SPEEDWRAP_C2_AE-HookLoop_Cinch_Strap_End_Grommet_C_dd4f5bad-b60c-4b7d-8b64-20682b8d3a62.jpg',
      'SPEEDWRAP_Cinch_Strap_Black.jpg',
      'SPEEDWRAP_Compression_Cinch_Strap_B.jpg',
      'SPEEDWRAP_Cut_to_Length_Hook_Loop_Tape_Blue_A_1.jpg',
      'SPEEDWRAP_Cut_to_Length_Hook_Loop_Tape_Orange_A.jpg',
      'SPEEDWRAP_Cut_to_Length_Hook_Loop_Tape_Roll_White.jpg',
      'speedwrap-fibertie_straight_strip_3d700a69-e742-46d5-8fbd-ecf5a7fc0068.png',
      'strap.jpg',
      'tie-mount-no-tie_026f895b-8ee0-44a9-8668-406a0e7a4a81.jpg',
      'tie-mount-no-tie_e188b44e-6e7e-4ef4-8fc5-f5004778702e.jpg',
      'videoscreenshot_1_6492a6b9-e9fd-40ab-836f-e226f83ea6db.jpg',
      'yellow_roll_0bce9f9e-2759-4c75-95d1-a7293e784060.jpg',
      'yellow_roll_2_2d4ba55a-ffba-4ade-b5f1-d85c131ea2e2.jpg',
    ],
  },
  {
    name: 'Cord-Lox Products',
    path: 'productImgs/downloads/Cord-Lox_Products/',
    files: [
      '206-Yx10bk_v2.jpg',
      '309-Rx10.jpg',
      '310-Cx10.jpg',
      '310-OX10.jpg',
      'ClosedLoop.jpg',
      'Coil-n-Carry-BLK-IG3.jpg',
      'Coil-n-Carry-BLK-MAIN.jpg',
      'Coil-n-Carry-BLU-MAIN.jpg',
      'Coil-n-Carry-CAMO-IUL1.jpg',
      'Coil-n-Carry-Features-Blue.jpg',
      'Coil-n-Carry-ProsChoice-BL.jpg',
      'Coil-n-Carry-RED-IG2.jpg',
      'Coil-n-Carry-RED-IUL3.jpg',
      'Coil-n-Carry-RED-MAIN.jpg',
      'Coil-n-Carry-solo-CAMO.jpg',
      'Cord-Lox__Closed_Loop_Lighting.jpg',
      'Cord-Lox__Closed_Loop_Series_Cable__Insertion.jpg',
      'Cord-Lox__Closed_Loop_Series_Quality-USA.jpg',
      'Cord-Lox__Closed_Loop_Series-Color-Code-cables_Colors.jpg',
      'Cord-Lox__Closed_Series-Bundling.jpg',
      'Cord-Lox__Closed-Series_Multi-Purpose.jpg',
      'Cord-Lox__Closed-Series_Professional-Grade.jpg',
      'Cord-Lox__Coil-N-Carry_Quality-USA.jpg',
      'Cord-Lox__Open-Series_Colors.jpg',
      'Cord-Lox__Open-Series_Multi-Purpose.jpg',
      'Cord-Lox__Open-Series_Perfect-For-Larger-Plugs_b128cd19-084d-4ec7-b238-104f972e6b11.jpg',
      'Cord-Lox__Open-Series_Pro-Audio-Video-Studio-Stage.jpg',
      'Cord-Lox__Open-Series_Recreation_RV.jpg',
      'Cord-Lox__Open-Series_Stays_On-Cable.jpg',
      'Cord-Lox__Rivet_Series_4Musicians.jpg',
      'Cord-Lox__Rivet_Series_How_To_Apply.jpg',
      'Cord-Lox__Rivet_Series_Identify_Color-Code_Organize.jpg',
      'Cord-Lox__Rivet_Series_Multipurpose.jpg',
      'Cord-Lox__Rivet_Series_Stays_AttachedToCables.jpg',
      'Cord-Lox__Y_Series_Multi.jpg',
      'Cord-Lox__Y-Series_Color-Code_Colors.jpg',
      'Cord-Lox__Y-Series_Great-For-Larger-Plugs.jpg',
      'Cord-Lox__Y-Series_Quality_USA.jpg',
      'Cord-Lox__Y-Series_Stays-On-Cables.jpg',
      'Cord-Lox_-Coil-N-Carry_Various_Colors-Available.jpg',
      'KVNR6847.jpg',
      'KVNR6850a.jpg',
      'KVNR6862a.jpg',
      'KVNR6894b.jpg',
      'KVNR6895b.jpg',
      'KVNR6902b.jpg',
      'KVNR6906.jpg',
      'KVNR6919b.jpg',
      'YSeries.jpg',
    ],
  },
  {
    name: 'VELCRO Brand Products',
    path: 'productImgs/downloads/VELCRO_Brand_Products/',
    files: [
      '126937.jpg',
      '151492.jpg',
      '158786.jpg',
      '170015.jpg',
      '173765.jpg',
      '173829.jpg',
      '176062.jpg',
      '176063.jpg',
      '176064.jpg',
      '176065.jpg',
      '176066.jpg',
      '176076.jpg',
      '176077.jpg',
      '176078.jpg',
      '176079.jpg',
      '189589.jpg',
      '189645.jpg',
      '189661.jpg',
      '189754.jpg',
      '189755.jpg',
      '189811.jpg',
      '31060.jpg',
      '31091.jpg',
      '5M_Industrial_Product_Logistrap_Blue_1.jpg',
      'APPLICATION-IMAGES_MILITAR_Tent.jpg',
      'b-300x300_jpg.jpg',
      'One_wrap_Red_diagonal_jpg.jpg',
      'stickyback_white_fr.jpg',
      'VELCRO__ONE-WRAP_Tie_CloseUp_jpg.jpg',
      'VELCRO__ONE-WRAP_Tie_Green_2-scaled-2048x1367_jpg.jpg',
      'VELCRO_Brand_CableTie_2_FINAL-scaled-2048x1367_jpg.jpg',
      'VELCRO_ONE_WRAP_CableTie_1-scaled_jpg.jpg',
      'VELCRO_ONE_WRAP_CableTie_2-scaled-2048x1367_jpg.jpg',
      'velcro_one_wrap_tape_roll_2.jpg',
      'VELCRO_One-Wrap_-_Emdom_USA_Tactical_Gear.png',
      'VELCROExtreme.jpg',
      'VELCROExtremeStrips90812.jpg',
      'VELCROIndStrength_30194back.jpg',
      'VELCROIndStrength_30194front.jpg',
      'VELCROr-Brand-Sleek-Thin_MATED-1200x1200-1-1024x1024.jpg',
      'VELCROStickyBack_90081fr.jpg',
    ],
  },
  {
    name: 'Instagram & Marketing',
    path: 'productImgs/downloads/Instagram__Marketing_Images/',
    files: [
      'ALT-IG3.jpg',
      'BLACK-IG6.jpg',
      'BLUE-IG1.jpg',
      'BLUE-IG5.jpg',
      'BLUE-IG7.jpg',
      'GREEN-IG3.jpg',
      'IG2.jpg',
      'IG5.jpg',
      'IG6.jpg',
      'ORANGE-IG2.jpg',
      'YELLOW-IG4.jpg',
    ],
  },
  {
    name: 'Collection Images',
    path: 'productImgs/downloads/Collection_Images/',
    files: [
      'al-wholesale_7133a4d9-bc9d-4db4-ab8b-b552a54a40e9.jpg',
      'audio-strap_81c63545-173c-4f78-bc2d-35e747646e7a.jpg',
      'automation_6951bd97-c267-48ac-bea7-a8afdcd7456c.jpg',
      'cable-tie_2770bc6a-e0ab-4106-8a3c-275f439fe692.jpg',
      'Construction_0a41a758-8727-45b1-a781-1584f42aaf16.jpg',
      'double-side_2eca59ce-874c-4920-a72c-ad2a36897175.jpg',
      'elector_4bf0457d-1b4a-48f4-880b-e553d25b193c.jpg',
      'printed_f56eab4c-d361-4f68-9c04-7ba7c8b9d0f8.jpg',
      'the-strap-store-collection-automotive_07ebc2db-0d15-4cc8-899c-98cfca4ad28e.jpg',
      'the-strap-store-collection-communications_cf1d0fdb-c845-46ff-a596-94e1a715b18b.jpg',
    ],
  },
  {
    name: 'Banners & Promotional',
    path: 'productImgs/downloads/Banners__Promotional/',
    files: [
      'Banner-home_1.jpg',
      'Strapstore-megamenu.jpg',
    ],
  },
  {
    name: 'Logo & Branding',
    path: 'productImgs/downloads/Logo__Branding/',
    files: [
      'logo-no-spaces.png',
      'TSS_1.png',
    ],
  },
  {
    name: 'Miscellaneous',
    path: 'productImgs/downloads/Miscellaneous_Files/',
    files: [
      '13_234944bc-c59e-46c4-b19c-4c8993064662.jpg',
      '2_5e53c426-bd0c-48fc-b843-920af4830e0d.jpg',
      '3_cbbe7907-00cf-44a6-8df1-b5896848ea98.jpg',
      '4_10f4f255-8d8c-4e8a-b652-88417ecfdb82.jpg',
      '50-off-speedwrap-wire-wrap-aka-extender-8-10-pack-1_9e2d4611-6098-48f2-9b43-1f6e619a23af.jpg',
      'BExJLL1m.jpg',
    ],
  },
  {
    name: 'Theme Assets',
    path: 'productImgs/downloads/Theme_Assets/',
    files: [
      'soldout.png',
    ],
  },
];

```

**Step 2: Add the `initProductImages()` function**

Insert before the `// ===== INIT =====` comment (after `initTouchZoom` function):

```javascript
// ===== PRODUCT IMAGE PICKER =====
function initProductImages() {
  const colorContainer = document.getElementById('color-variants');
  const catContainer = document.getElementById('product-categories');
  if (!colorContainer || !catContainer) return;

  // Helper: create a thumbnail button
  function createThumbBtn(src, label) {
    const btn = document.createElement('button');
    btn.className = 'product-thumb-btn';
    btn.setAttribute('aria-label', 'Set ' + label + ' as background');
    btn.setAttribute('aria-pressed', 'false');
    btn.type = 'button';

    const img = document.createElement('img');
    img.src = src;
    img.alt = label;
    img.loading = 'lazy';
    btn.appendChild(img);

    btn.addEventListener('click', function() {
      selectProductImage(btn, src);
    });
    return btn;
  }

  // Helper: clear active state from all product thumb buttons
  function clearActiveProductThumbs() {
    document.querySelectorAll('.product-thumb-btn').forEach(function(b) {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
  }

  // Select a product image as background
  function selectProductImage(btn, src) {
    clearActiveProductThumbs();
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    setBackgroundImage(src);
  }

  // Expose clearActiveProductThumbs for use by upload handler and cancel
  state.clearActiveProductThumbs = clearActiveProductThumbs;

  // Render color variants row
  COLOR_VARIANTS.forEach(function(variant) {
    var src = 'productImgs/' + variant.file;
    colorContainer.appendChild(createThumbBtn(src, variant.label));
  });

  // Render category accordions
  PRODUCT_CATEGORIES.forEach(function(cat) {
    var details = document.createElement('details');
    details.className = 'product-category';

    var summary = document.createElement('summary');
    summary.className = 'product-category-header';
    summary.textContent = cat.name + ' (' + cat.files.length + ')';
    details.appendChild(summary);

    var grid = document.createElement('div');
    grid.className = 'thumb-grid';

    cat.files.forEach(function(file) {
      var src = cat.path + file;
      var label = file.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '');
      grid.appendChild(createThumbBtn(src, label));
    });

    details.appendChild(grid);
    catContainer.appendChild(details);
  });
}
```

**Step 3: Wire into init**

In the `DOMContentLoaded` handler, add `initProductImages();` after `initTouchZoom();`:

```javascript
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
  initProductImages();
});
```

**Step 4: Commit**

```bash
git add app.js
git commit -m "feat: add product image data and picker rendering logic"
```

---

### Task 3: Add CSS Styles for Product Image Picker

**Files:**
- Modify: `styles.css:236` (insert new section after overlay gallery styles, before form elements)

**Step 1: Add product images CSS**

Insert after the `.thumb-grid img:hover` rule (line 259) and before the `/* ===== FORM ELEMENTS ===== */` comment (line 261):

```css
/* ===== PRODUCT IMAGE PICKER ===== */
.product-images-section {
  margin-top: 20px;
  border-top: 1px solid #cccccc;
  padding-top: 16px;
}

.color-variants-row {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.product-thumb-btn {
  padding: 0;
  border: 2px solid #cccccc;
  border-radius: 0;
  background: none;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;
}

.color-variants-row .product-thumb-btn {
  flex: 1;
  min-width: 0;
}

.product-thumb-btn img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.product-thumb-btn:hover {
  border-color: #7ebc59;
}

.product-thumb-btn.active {
  border-color: #7ebc59;
}

.product-thumb-btn.active::after {
  content: '\2713';
  position: absolute;
  top: 2px;
  right: 2px;
  background: #7ebc59;
  color: #ffffff;
  width: 18px;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  font-weight: 700;
}

.product-category {
  margin-bottom: 4px;
}

.product-category-header {
  font-family: "Hind", sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #8c8b8b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 0;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.product-category-header::-webkit-details-marker {
  display: none;
}

.product-category-header::before {
  content: '\25B6';
  font-size: 8px;
  transition: transform 0.2s;
  display: inline-block;
}

.product-category[open] > .product-category-header::before {
  transform: rotate(90deg);
}

.product-category-header:hover {
  color: #7ebc59;
}

.product-category .thumb-grid {
  padding-bottom: 12px;
}
```

**Step 2: Add responsive overrides**

Inside the existing `@media (max-width: 768px)` block, add at the end (before the closing `}`):

```css
  /* Product image picker: touch targets */
  .product-thumb-btn {
    min-height: 44px;
  }

  .product-category-header {
    min-height: 44px;
    padding: 12px 0;
  }
```

**Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add CSS for product image picker with responsive touch targets"
```

---

### Task 4: Integrate with Upload and Cancel Flows

**Files:**
- Modify: `app.js` — `handleImageUpload()` function (line 151)
- Modify: `app.js` — `handleCancel()` function (line 461)

**Step 1: Clear product image selection on user upload**

In `handleImageUpload()`, after `setBackgroundImage(dataUrl);` (line 158), add:

```javascript
      if (state.clearActiveProductThumbs) {
        state.clearActiveProductThumbs();
      }
```

So the `if (mode === 'background')` block becomes:

```javascript
    if (mode === 'background') {
      setBackgroundImage(dataUrl);
      if (state.clearActiveProductThumbs) {
        state.clearActiveProductThumbs();
      }
    } else {
```

**Step 2: Clear product image selection on cancel**

In `handleCancel()`, after the style button ARIA reset block (after line 500, before `canvas.renderAll()`), add:

```javascript
  // Clear product image picker selection
  if (state.clearActiveProductThumbs) {
    state.clearActiveProductThumbs();
  }
```

**Step 3: Commit**

```bash
git add app.js
git commit -m "feat: clear product image selection on user upload and cancel"
```

---

### Task 5: Manual Testing and Verification

**Step 1: Open the app in browser and verify:**

1. The "Product Images" section appears in the Upload tab below the overlay gallery
2. The 5 color variant thumbnails show in a horizontal row
3. Clicking a color variant sets it as the canvas background with a green check
4. The 10 accordion sections are present, each with the correct count
5. Expanding an accordion shows the 3-column thumbnail grid
6. Clicking a category image sets it as background and shows the green check
7. Clicking a different image moves the green check (only one active at a time)
8. Uploading an image via the dropzone as "Set as Background" clears the product selection
9. Clicking Cancel clears the product selection
10. On mobile (≤768px via dev tools), all touch targets are ≥44px
11. Tab through the color variants and accordion — keyboard focus ring works
12. `<details>` open/close with Enter/Space
13. Screen reader: buttons announce their `aria-label` and `aria-pressed` state

**Step 2: Commit any fixes if needed**

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: product image picker — complete implementation"
```
