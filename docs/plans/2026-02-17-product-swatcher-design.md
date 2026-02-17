# Product Swatcher App - Design Document

**Date:** 2026-02-17
**Status:** Approved

## Overview

A client-side product customization tool inspired by CustomInk's Design Lab. Users can upload a product background image, place overlay images and text on top, adjust product color tinting, and export the final composition as a JPG.

## Tech Stack

- **Vanilla HTML/CSS/JS** — single HTML file, no build step
- **Fabric.js** (CDN) — canvas manipulation, object selection/transforms
- **Quill** (CDN) — WYSIWYG editor for product details
- **No backend** — purely client-side, all operations in-browser

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Product Swatcher"                                 │
├──────────┬──────────────────────────────────┬───────────────┤
│  LEFT    │        CENTER                    │    RIGHT      │
│  PANEL   │        CANVAS                    │    PANEL      │
│  ~250px  │        (fluid)                   │    ~80px      │
│          │                                  │               │
│ Tabs:    │   Fabric.js canvas with:         │  Zoom +/-     │
│ Upload   │   - Background image layer       │  Zoom %       │
│ Add Text │   - Color tint overlay layer     │               │
│ Product  │   - User overlays/text on top    │               │
│ Details  │                                  │               │
├──────────┴──────────────────────────────────┴───────────────┤
│  Bottom Toolbar:  [Cancel]  [Save Image]  [Download JPG]    │
└─────────────────────────────────────────────────────────────┘
```

## Canvas Architecture (Fabric.js Layer Stack)

1. **Background image** — non-selectable, non-movable. Default placeholder or user-uploaded product photo.
2. **Color tint overlay** — semi-transparent rectangle matching canvas dimensions. Color set by swatch selection. Non-selectable.
3. **User objects** — uploaded overlay images (`fabric.Image`) and text (`fabric.IText`). Fully interactive: move, resize, rotate.

## Left Panel Tabs

### Tab 1: Upload
- Drag-and-drop zone + "Browse Files" button
- Accepts PNG, JPG, SVG, GIF
- Two modes via toggle/buttons:
  - "Upload as Background" — replaces product background
  - "Upload as Overlay" — adds movable Fabric object
- Thumbnail gallery of uploaded overlays for re-use

### Tab 2: Add Text
- Text input field + "Add Text" button
- Creates `fabric.IText` object (double-click to edit inline)
- Controls: font family, font size, color picker, bold/italic/underline, text alignment (L/C/R)

### Tab 3: Product Details
- **Product Colors Available**: Grid of primary color swatches (red, blue, green, yellow, orange, purple, black, white). Clicking a swatch applies a semi-transparent color tint overlay on the canvas background.
- **Product Details**: Quill WYSIWYG editor for freeform product info (description, specs, notes). Standard toolbar: bold, italic, underline, lists, headings.

## Right Panel

- Zoom in (+) / Zoom out (-) buttons
- Zoom percentage display
- Implemented via `canvas.setZoom()`

## Bottom Toolbar

- **Cancel**: Full reset — clears overlays, text, resets background to default, zoom to 100%, clears Quill editor. Confirmation dialog before executing.
- **Save Image**: Renders high-res composition via `canvas.toDataURL()`, updates main canvas view with composited image as static preview.
- **Download JPG**: Exports canvas as JPG (`canvas.toDataURL('image/jpeg', 0.95)`), triggers browser download.

## Visual Design

- Clean white/light gray background
- Left panel: white with subtle right border
- Tabs: horizontal tab bar, active state highlight (blue underline)
- Primary button color: `#1e39d2` (blue)
- Cancel button: gray
- Font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Canvas area: light gray (`#f0f0f0`) background
- Subtle shadows/borders for panel separation

## Dependencies (CDN)

- Fabric.js: `https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js`
- Quill: `https://cdn.quilljs.com/1.3.7/quill.snow.css` + `https://cdn.quilljs.com/1.3.7/quill.js`
