# Code Review — 2025-03-25

**Scope:** Uncommitted changes on `main`
**Files changed:** 7 (+95 / -292 lines)

## Overview

1. **New "Best Sellers" section** — grid-based product section with collection picker, configurable columns, colors, and view-all CTA
2. **Breadcrumb refinements** — padding cleanup, active-state bold, slash separator spacing
3. **Global breadcrumb placement** — moved into `theme.liquid` so it renders on all pages
4. **Section deletions** — removed `logo-list.liquid` and `video.liquid`
5. **Minor fix** — `shopify-policy__title` padding-bottom

---

## Issues & Suggestions

### 1. Best sellers reuses `scroll-collection__*` classes — coupling risk

**File:** `sections/best-sellers.liquid:46-65`

The product cards use `scroll-collection__card`, `scroll-collection__media`, `scroll-collection__image`, etc. This creates tight coupling to another section's styles.

- If `scroll-collection` styles change, best-sellers silently breaks.
- Consider creating dedicated `best-sellers__card` styles, or extracting the shared card into a reusable snippet (e.g., `snippets/product-card.liquid`).

### 2. `image_url` called without size parameters

**File:** `sections/best-sellers.liquid:49`

```liquid
src="{{ product.featured_image | image_url }}"
```

This loads the **full-resolution original image**. Should use width parameters:

```liquid
src="{{ product.featured_image | image_url: width: 600 }}"
```

Also consider adding `srcset` + `sizes` for responsive images, or using the existing `render 'image'` snippet like the deleted `logo-list` section did.

### 3. Missing newline at end of file in `assets/base.css`

The compiled CSS is missing a trailing newline. Minor, but keeps diffs clean.

### 4. Breadcrumb renders on every page including homepage

**File:** `layout/theme.liquid:73-75`

The breadcrumb is rendered unconditionally inside `<main>`. If the breadcrumb snippet doesn't handle the homepage case (hiding itself on `template-index`), you'll get an empty or malformed breadcrumb on the homepage. Verify this is handled.

### 5. `best-sellers__grid--4` uses 3 columns at tablet

**File:** `dev/style/sections/_best-sellers.scss:60-62`

```scss
.best-sellers__grid--4 {
  @media screen and (min-width: $breakpoint-sm) {
    grid-template-columns: repeat(3, 1fr); // 4-col setting shows 3 at tablet
  }
}
```

Likely intentional (progressive 2 -> 3 -> 4), but a comment would help clarify intent.

### 6. Deleted sections — verify no references remain

`logo-list.liquid` and `video.liquid` are deleted. If any existing page templates or JSON templates reference these sections, those pages will break. Verify:

- No `*.json` template files in `templates/` reference `logo-list` or `video`
- No `{% section 'logo-list' %}` or `{% section 'video' %}` calls exist elsewhere

### 7. Hardcoded colors in breadcrumb SCSS

**File:** `dev/style/components/_breadcrumb.scss`

Uses `#313D65`, `#353535`, `#606060` directly. The design system brand color is `#8fa1b7`. Consider using CSS variables or SCSS variables for consistency and easier theming.

---

## What Looks Good

- **BEM naming** is consistent throughout the new section — follows project conventions
- **Schema is well-structured** — sensible defaults, grouped settings with headers, appropriate control types (range, color picker, select)
- **CSS custom properties** for padding/colors give theme editors good flexibility
- **SCSS source and compiled CSS are in sync** — both files match
- **Breadcrumb spacing rework** is cleaner — `margin` on the separator is better than `padding` on items
