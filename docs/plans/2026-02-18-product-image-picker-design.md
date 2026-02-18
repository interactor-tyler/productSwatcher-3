# Product Image Picker — Design Document

**Date:** 2026-02-18
**Status:** Approved

## Overview

Add an inline product image picker to the Upload tab so users can select pre-loaded product images as canvas backgrounds without uploading their own files. The picker draws from the `productImgs/` directory which contains 5 top-level color variants and ~200 categorized images in `downloads/` subfolders.

## Approach

Inline accordion within the existing Upload tab (Approach A). No new navigation paradigm — extends the existing sidebar naturally.

## HTML Structure

A `<div class="product-images-section">` placed in the Upload tab below the existing overlay gallery:

1. **Section header**: "Product Images" using `.section-title` styling
2. **Color Variants row**: Horizontal flex row of 5 square thumbnails (BLACK, BLUE, GREEN, ORANGE, YELLOW One-Wrap shots). Always visible, no accordion.
3. **Category accordion**: 10 native `<details>` elements, one per `downloads/` subfolder:
   - Banners & Promotional (2)
   - Collection Images (10)
   - Cord-Lox Products (49)
   - Instagram & Marketing (11)
   - Logo & Branding (2)
   - Miscellaneous (6)
   - One-Wrap Color Variants (8)
   - SPEEDWRAP Products (69)
   - Theme Assets (1)
   - VELCRO Brand Products (42)

Each `<details>` has a `<summary>` with category name + count, and a 3-column `.thumb-grid` inside.

## Styling

- **Color variants row**: Flex row, `gap: 6px`, square thumbnails with `object-fit: cover`
- **Hover**: `border-color: #7ebc59` (primary green)
- **Active/selected**: Green check overlay via CSS `::after` pseudo-element
- **Accordion summaries**: Styled like `.section-title` (uppercase, Hind font, letter-spacing)
- **Disclosure triangle**: Rotates on open
- **Thumbnail grids**: Reuse `.thumb-grid` pattern — `repeat(3, 1fr)`, `gap: 6px`, square aspect ratio
- **No border-radius**: Matches app's sharp-cornered industrial aesthetic
- **Responsive (<=768px)**: Color variants shrink slightly, accordions unchanged, 44px min touch targets
- **Focus-visible**: Existing global `outline: 2px solid #7ebc59; outline-offset: 2px`

## JavaScript Behavior

### Data
- `COLOR_VARIANTS` array: 5 top-level color variant filenames
- `PRODUCT_IMAGES` array: Category objects with `name`, `path` prefix, and filenames array
- All paths hardcoded (no-build-step app, no server directory scanning)

### Rendering
- `renderProductImages()` called during `initApp()`
- Builds color variants row and accordion sections dynamically
- All thumbnails are `<button>` elements containing `<img loading="lazy">`

### Click Handler
- Calls existing `setBackgroundImage(url)` with relative path
- Manages `active` class and `aria-pressed` state on thumbnails
- Only one thumbnail active at a time across all sections

### Integration
- Reuses `setBackgroundImage()` as-is — no modification needed
- User file upload clears any active product image selection
- Cancel/Reset clears product image selection

## Accessibility

- `<details>/<summary>` natively keyboard accessible (Enter/Space)
- Thumbnails are `<button>` elements with descriptive `aria-label`
- Active thumbnail gets `aria-pressed="true"`
- Focus ring uses existing global style
- Touch targets meet 44px minimum (WCAG 2.5.5)
