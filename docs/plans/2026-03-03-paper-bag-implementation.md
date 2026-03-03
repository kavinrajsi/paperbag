# Paper Bag Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete Shopify 2.0 theme for fashion/lifestyle brands with clean & modern design.

**Architecture:** JSON templates with sections-everywhere, SCSS compiled via Gulp, vanilla JS, no external dependencies. Mobile-first responsive design.

**Tech Stack:** Liquid, Shopify 2.0, SCSS, vanilla JS, Gulp build system

**Reference:** See `docs/plans/2026-03-03-paper-bag-theme-design.md` for full design spec. See `.claude/skills/referances/liquid-development.md` for Liquid coding standards.

**ESLint:** ES5 syntax (`ecmaVersion: 5`), single quotes, semicolons, 2-space indent. Globals: `Shopify`, `theme`.

---

## Phase 1: Foundation (Layout, Config, Locales, Base Styles)

### Task 1: Create directory structure

**Files:**
- Create: All theme directories

**Step 1: Create all required directories**

```bash
mkdir -p layout templates/customers sections snippets blocks config locales assets dev/style/base dev/style/components dev/style/sections dev/style/layout dev/scripts tests
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: scaffold theme directory structure"
```

---

### Task 2: Theme settings schema (config/settings_schema.json)

**Files:**
- Create: `config/settings_schema.json`
- Create: `config/settings_data.json`

**Step 1: Write settings_schema.json**

Define all theme setting groups:
1. `theme_info` - theme name, version, author
2. `colors` - primary, secondary, accent, background, text, border, error, success
3. `typography` - heading_font (font_picker), body_font (font_picker), base_font_size (range 14-20)
4. `logo` - logo image_picker, logo_width range, favicon image_picker
5. `social_media` - text inputs for Instagram, Facebook, Twitter/X, Pinterest, TikTok, YouTube URLs
6. `cart` - cart_type select (drawer/page), enable_cart_notes checkbox, enable_upsells checkbox
7. `product` - enable_size_guide checkbox, enable_recently_viewed checkbox, enable_sticky_cart checkbox
8. `search` - enable_predictive_search checkbox

Use Shopify settings schema format. All labels must use `t:` translation keys referencing `en.default.schema.json`.

**Step 2: Write settings_data.json**

Minimal defaults file:

```json
{
  "current": {
    "color_primary": "#2C2C2C",
    "color_secondary": "#F5F5F0",
    "color_accent": "#C4A35A",
    "color_background": "#FFFFFF",
    "color_text": "#1A1A1A",
    "color_border": "#E5E5E5",
    "cart_type": "drawer",
    "enable_cart_notes": true,
    "enable_upsells": true,
    "enable_size_guide": true,
    "enable_recently_viewed": true,
    "enable_sticky_cart": true,
    "enable_predictive_search": true,
    "base_font_size": 16
  }
}
```

**Step 3: Commit**

```bash
git add config/
git commit -m "feat: add theme settings schema and defaults"
```

---

### Task 3: Locales (en.default.json + en.default.schema.json)

**Files:**
- Create: `locales/en.default.json`
- Create: `locales/en.default.schema.json`

**Step 1: Write en.default.json**

Full translation file with keys organized by:
- `general` - search, cart, menu, close, continue_shopping, loading, skip_to_content, pagination (next, previous, page)
- `products.product` - add_to_cart, sold_out, unavailable, quantity, description, size_guide, shipping, care, sale, new, from_price, vendor, type, sku, share
- `collections` - title, sorting (featured, best_selling, price_asc, price_desc, az, za, date_new, date_old), filtering (filter, clear, apply, results_count), empty
- `cart` - title, empty, subtotal, checkout, note, remove, update, item_count (one, other), taxes_and_shipping
- `customer` - account, login, register, logout, orders, addresses, reset_password, first_name, last_name, email, password, forgot_password, order_number, date, total, fulfillment_status, financial_status
- `blog` - title, read_more, by_author, posted_on, tags, comments (one, other), comment_form (name, email, body, submit)
- `contact` - title, form (name, email, phone, message, submit, success)
- `search` - title, placeholder, results (one, other), no_results
- `404` - title, subtext
- `password` - title, subtext, email_placeholder, submit
- `accessibility` - skip_to_content, close, menu, cart_count, next_slide, previous_slide, loading

**Step 2: Write en.default.schema.json**

Translation keys for theme editor settings labels:
- `settings_schema` group titles and descriptions
- Setting labels, info text, and option labels for all groups in settings_schema.json

**Step 3: Commit**

```bash
git add locales/
git commit -m "feat: add English locale files"
```

---

### Task 4: Base SCSS styles

**Files:**
- Create: `dev/style/base/_reset.scss`
- Create: `dev/style/base/_variables.scss`
- Create: `dev/style/base/_typography.scss`
- Create: `dev/style/base/_utilities.scss`
- Create: `dev/style/main.scss`

**Step 1: Write _variables.scss**

CSS custom properties using Liquid settings values (will be output in layout). SCSS variables for breakpoints and spacing scale only:
- `$breakpoint-sm: 750px`, `$breakpoint-md: 990px`, `$breakpoint-lg: 1200px`
- Spacing scale map: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Container max-width: 1200px

**Step 2: Write _reset.scss**

Minimal CSS reset: box-sizing border-box, margin/padding reset, image max-width, list-style removal, button reset, input font inheritance.

**Step 3: Write _typography.scss**

Base typography styles using CSS custom properties:
- Body: `var(--font-body)`, `var(--font-size-base)`, line-height 1.6, `var(--color-text)`
- Headings h1-h4: `var(--font-heading)`, line-height 1.2, modular scale (2.5rem, 2rem, 1.5rem, 1.25rem)
- Links: `var(--color-primary)`, text-decoration underline on hover
- `.visually-hidden` class for accessibility

**Step 4: Write _utilities.scss**

Utility classes:
- `.container` - max-width, centered, padding
- `.grid` - CSS grid with gap, responsive column classes (`.grid--2`, `.grid--3`, `.grid--4`)
- `.text-center`, `.text-left`, `.text-right`
- `.hidden`, `.hidden-mobile`, `.hidden-desktop`
- `.section-padding` - top/bottom padding using CSS variable

**Step 5: Write main.scss**

Import all partials in order: variables, reset, typography, utilities, then component/section/layout partials (as they're created).

**Step 6: Build and verify**

Run: `npm run build`
Verify `assets/base.css` is generated.

**Step 7: Commit**

```bash
git add dev/style/ assets/base.css
git commit -m "feat: add base SCSS styles (reset, variables, typography, utilities)"
```

---

### Task 5: Component SCSS (buttons, forms, cards, badges)

**Files:**
- Create: `dev/style/components/_buttons.scss`
- Create: `dev/style/components/_forms.scss`
- Create: `dev/style/components/_cards.scss`
- Create: `dev/style/components/_badges.scss`
- Modify: `dev/style/main.scss` - add imports

**Step 1: Write _buttons.scss**

BEM classes:
- `.btn` - base button (padding, border-radius 4px, font, cursor, transition)
- `.btn--primary` - filled with `var(--color-primary)`, white text
- `.btn--secondary` - outlined with border, transparent bg
- `.btn--text` - underline style, no border/bg
- `.btn--full` - width 100%
- Hover/focus/disabled states

**Step 2: Write _forms.scss**

- `.form__group` - margin-bottom spacing
- `.form__label` - font weight, margin-bottom
- `.form__input` - border, padding, border-radius 4px, focus ring with `var(--color-primary)`
- `.form__textarea` - same as input, min-height
- `.form__select` - custom select styling
- `.form__error` - error color text

**Step 3: Write _cards.scss**

- `.card` - background, border-radius 8px, overflow hidden
- `.card__image` - aspect-ratio, object-fit cover
- `.card__content` - padding
- `.card__title` - font size, weight
- `.card__price` - price display, compare-at strikethrough
- `.card:hover` - subtle lift (translateY -2px, shadow)

**Step 4: Write _badges.scss**

- `.badge` - small label, padding, border-radius, uppercase, small font
- `.badge--sale` - accent color bg
- `.badge--sold-out` - gray bg
- `.badge--new` - primary color bg

**Step 5: Update main.scss, build, commit**

```bash
git add dev/style/ assets/base.css
git commit -m "feat: add component styles (buttons, forms, cards, badges)"
```

---

### Task 6: Layout (theme.liquid)

**Files:**
- Create: `layout/theme.liquid`

**Step 1: Write theme.liquid**

The main layout wrapper. Must include:
- `<!DOCTYPE html>` with `lang` attribute from `request.locale.iso_code`
- `<head>`: charset, viewport meta, `{{ content_for_header }}`, title tag, CSS custom properties block (outputting all theme settings colors + fonts as `:root` variables), `{{ 'base.css' | asset_url | stylesheet_tag }}`, preconnect to `cdn.shopify.com`
- `<body>`: skip-to-content link, `{% sections 'header-group' %}`, `<main id="MainContent">{{ content_for_layout }}</main>`, `{% sections 'footer-group' %}`, `{{ 'global.js' | asset_url | script_tag }}` deferred
- Conditional: if `settings.cart_type == 'drawer'`, render cart-drawer section

CSS custom properties block in a `<style>` tag:
```liquid
:root {
  --color-primary: {{ settings.color_primary }};
  --color-secondary: {{ settings.color_secondary }};
  --color-accent: {{ settings.color_accent }};
  --color-background: {{ settings.color_background }};
  --color-text: {{ settings.color_text }};
  --color-border: {{ settings.color_border }};
  --font-heading: {{ settings.heading_font.family }}, {{ settings.heading_font.fallback_families }};
  --font-body: {{ settings.body_font.family }}, {{ settings.body_font.fallback_families }};
  --font-size-base: {{ settings.base_font_size }}px;
}
```

Include `{{ settings.heading_font | font_face: font_display: 'swap' }}` and same for body_font.

**Step 2: Commit**

```bash
git add layout/
git commit -m "feat: add theme.liquid layout with CSS custom properties"
```

---

### Task 7: Section groups (header-group, footer-group JSON)

**Files:**
- Create: `sections/header-group.json`
- Create: `sections/footer-group.json`

**Step 1: Write header-group.json**

Section group with `type: "header"`, `name: "Header group"`, sections array referencing `announcement-bar` and `header`.

**Step 2: Write footer-group.json**

Section group with `type: "footer"`, `name: "Footer group"`, sections array referencing `footer`.

**Step 3: Commit**

```bash
git add sections/header-group.json sections/footer-group.json
git commit -m "feat: add header and footer section groups"
```

---

## Phase 2: Global Sections (Header, Footer, Announcement Bar, Cart Drawer)

### Task 8: Icon snippet

**Files:**
- Create: `snippets/icon.liquid`

**Step 1: Write icon.liquid**

SVG icon snippet with `{% doc %}` header. Accepts `icon` param (string). Uses case/when to output inline SVGs for: search, cart, menu, close, chevron-down, chevron-left, chevron-right, facebook, instagram, twitter, pinterest, tiktok, youtube, plus, minus, check, arrow-right.

Keep SVGs minimal (24x24 viewBox, stroke-based, currentColor).

**Step 2: Commit**

```bash
git add snippets/icon.liquid
git commit -m "feat: add SVG icon snippet"
```

---

### Task 9: Header section + SCSS

**Files:**
- Create: `sections/header.liquid`
- Create: `dev/style/layout/_header.scss`
- Modify: `dev/style/main.scss` - add import

**Step 1: Write header.liquid**

Desktop: Logo left, navigation center (from `section.settings.menu` linklist), cart/search icons right.
Mobile: Logo center, hamburger left, cart right.

Schema settings:
- `menu` - link_list picker (default: `main-menu`)
- `logo` - image_picker
- `logo_width` - range (50-200, default 120)
- `enable_sticky` - checkbox (default true)
- `color_scheme` - select (light/dark)

Include mobile nav drawer markup (hidden by default, toggled via JS).

**Step 2: Write _header.scss**

BEM classes: `.header`, `.header__logo`, `.header__nav`, `.header__icons`, `.header__mobile-toggle`, `.mobile-nav` overlay/drawer.
Sticky header: `.header--sticky` (position sticky, top 0, z-index 100).
Responsive: mobile nav hidden on desktop, desktop nav hidden on mobile.

**Step 3: Build, commit**

```bash
git add sections/header.liquid dev/style/ assets/base.css
git commit -m "feat: add header section with responsive nav"
```

---

### Task 10: Announcement bar section

**Files:**
- Create: `sections/announcement-bar.liquid`

**Step 1: Write announcement-bar.liquid**

Simple bar with text and optional link. Schema: `text` (text), `link` (url), `color_background` (color), `color_text` (color). Use `{% stylesheet %}` for scoped styles.

**Step 2: Commit**

```bash
git add sections/announcement-bar.liquid
git commit -m "feat: add announcement bar section"
```

---

### Task 11: Footer section + SCSS

**Files:**
- Create: `sections/footer.liquid`
- Create: `snippets/social-icons.liquid`
- Create: `dev/style/layout/_footer.scss`
- Modify: `dev/style/main.scss` - add import

**Step 1: Write social-icons.liquid**

Snippet with `{% doc %}`. Loops through social media settings, renders icon + link for each non-blank URL.

**Step 2: Write footer.liquid**

Multi-column footer with blocks. Block types:
- `menu` - link_list picker, renders column of links
- `text` - richtext content (for about text, etc.)
- `newsletter` - email signup form (Shopify customer form)

Bottom bar: copyright, payment icons, social icons snippet.

Schema: section settings for `color_scheme`, blocks array with menu/text/newsletter types, presets.

**Step 3: Write _footer.scss**

BEM: `.footer`, `.footer__grid`, `.footer__column`, `.footer__bottom`, `.footer__copyright`, `.footer__payment-icons`.
Grid: responsive columns (stack on mobile).

**Step 4: Build, commit**

```bash
git add sections/footer.liquid snippets/social-icons.liquid dev/style/ assets/base.css
git commit -m "feat: add footer section with social icons"
```

---

### Task 12: Cart drawer section

**Files:**
- Create: `sections/cart-drawer.liquid`

**Step 1: Write cart-drawer.liquid**

Slide-out drawer from right. Contains:
- Close button header
- Line items loop (image, title, variant, quantity +/- buttons, line price, remove link)
- Empty cart message when `cart.item_count == 0`
- Subtotal + checkout button footer
- Overlay backdrop

Use `data-` attributes for JS hooks: `data-cart-drawer`, `data-cart-items`, `data-cart-count`, `data-cart-subtotal`.

Schema: minimal (just the section name, no merchant settings needed - controlled via theme settings).

Use `{% stylesheet %}` for drawer styles (position fixed, right 0, z-index 200, transform translateX(100%), transition).

**Step 2: Commit**

```bash
git add sections/cart-drawer.liquid
git commit -m "feat: add AJAX cart drawer section"
```

---

### Task 13: Global JavaScript (init.js)

**Files:**
- Create: `dev/scripts/init.js`

**Step 1: Write init.js**

ES5 syntax (per ESLint config). Module pattern with IIFE. Features:
- **Mobile menu:** toggle `.mobile-nav` open/close, body scroll lock
- **Sticky header:** add/remove `.header--sticky` class on scroll (throttled)
- **Cart drawer:** open/close drawer, AJAX add-to-cart via fetch to `/cart/add.js`, update drawer HTML via `/cart.js`, update cart count badge
- **Search overlay:** toggle search form visibility (if predictive search enabled later)
- **Announcement dismiss:** hide on click, sessionStorage to persist

All event listeners attached via delegation on `document` where possible.
AJAX cart functions: `addToCart(formData)`, `getCart()`, `updateCartItem(key, quantity)`, `removeCartItem(key)`, `renderCartDrawer(cart)`.

**Step 2: Build and verify**

Run: `npm run build`
Verify `assets/global.js` is generated.

**Step 3: Commit**

```bash
git add dev/scripts/init.js assets/global.js
git commit -m "feat: add global JS (mobile nav, sticky header, AJAX cart)"
```

---

## Phase 3: Snippets & Homepage Sections

### Task 14: Core snippets (image, price, product-card, breadcrumb, pagination)

**Files:**
- Create: `snippets/image.liquid`
- Create: `snippets/price.liquid`
- Create: `snippets/product-card.liquid`
- Create: `snippets/breadcrumb.liquid`
- Create: `snippets/pagination.liquid`

**Step 1: Write image.liquid**

Responsive image snippet. Params: `image` (image object), `widths` (string of widths), `sizes` (sizes attr), `alt`, `lazy` (boolean, default true), `class`. Uses `image_url` and `image_tag` filters with srcset.

**Step 2: Write price.liquid**

Price display snippet. Params: `product` or `variant`. Shows current price, compare-at price (strikethrough) if on sale, "From" prefix if price varies. Uses `money` filter.

**Step 3: Write product-card.liquid**

Product card for grids. Params: `product`, `show_vendor` (boolean). Renders: image (with sale/sold-out/new badge), title link, vendor, price snippet. Hover: second image if available.

**Step 4: Write breadcrumb.liquid**

Breadcrumb nav using `<nav aria-label>` and structured data. Builds trail from template type (home > collection > product, etc.).

**Step 5: Write pagination.liquid**

Pagination snippet. Params: `paginate` object. Renders prev/next + page numbers with current page highlighted.

**Step 6: Commit**

```bash
git add snippets/
git commit -m "feat: add core snippets (image, price, product-card, breadcrumb, pagination)"
```

---

### Task 15: Hero banner section

**Files:**
- Create: `sections/hero-banner.liquid`
- Create: `dev/style/sections/_hero.scss`
- Modify: `dev/style/main.scss` - add import

**Step 1: Write hero-banner.liquid**

Full-width hero with optional slideshow. Block type `slide` with settings: `image` (image_picker), `heading` (text), `subheading` (textarea), `button_label` (text), `button_link` (url), `text_alignment` (select: left/center/right), `overlay_opacity` (range 0-100).

Max 5 slides. Single slide = static hero. Multiple = auto-rotating slideshow with prev/next arrows and dot indicators.

Use `{% javascript %}` for slideshow logic (auto-advance interval, pause on hover, prev/next click handlers).
Use `{% stylesheet %}` for hero styles.

Schema: section settings for `height` (select: small/medium/large/full), `autoplay_speed` (range 3-10 seconds). Block: `slide` type with above settings. Presets with 1 default slide.

**Step 2: Write _hero.scss**

`.hero`, `.hero__slide`, `.hero__content`, `.hero__heading`, `.hero__subheading`, `.hero__button`, `.hero__overlay`, `.hero__controls`.
Full-width, responsive text sizing, overlay with configurable opacity.

**Step 3: Build, commit**

```bash
git add sections/hero-banner.liquid dev/style/ assets/base.css
git commit -m "feat: add hero banner section with slideshow"
```

---

### Task 16: Featured collection section

**Files:**
- Create: `sections/featured-collection.liquid`
- Create: `dev/style/sections/_collection.scss`
- Modify: `dev/style/main.scss`

**Step 1: Write featured-collection.liquid**

Displays products from a selected collection in a grid. Schema: `collection` (collection picker), `heading` (text), `products_to_show` (range 4-12), `columns` (select 2/3/4), `show_vendor` (checkbox), `show_view_all` (checkbox). Renders product-card snippet in grid. "View all" link to collection page.

**Step 2: Write _collection.scss**

Grid layout styles, responsive columns.

**Step 3: Build, commit**

```bash
git add sections/featured-collection.liquid dev/style/ assets/base.css
git commit -m "feat: add featured collection section"
```

---

### Task 17: Remaining homepage sections

**Files:**
- Create: `sections/featured-product.liquid`
- Create: `sections/collection-list.liquid`
- Create: `sections/image-with-text.liquid`
- Create: `sections/rich-text.liquid`
- Create: `sections/video.liquid`
- Create: `sections/testimonials.liquid`
- Create: `sections/newsletter.liquid`
- Create: `sections/logo-list.liquid`
- Create: `dev/style/sections/_testimonials.scss`
- Modify: `dev/style/main.scss`

**Step 1: Write featured-product.liquid**

Single product highlight with large image + details side-by-side. Schema: `product` (product picker), layout select (image-left/image-right).

**Step 2: Write collection-list.liquid**

Grid of collection images with titles. Schema: blocks of type `collection` (collection picker, image override). Max 6 blocks.

**Step 3: Write image-with-text.liquid**

Split layout: image on one side, text + optional button on other. Schema: `image`, `heading`, `text` (richtext), `button_label`, `button_link`, `layout` (image-left/image-right).

**Step 4: Write rich-text.liquid**

Simple centered rich text content. Schema: `heading` (text), `content` (richtext), `narrow_width` (checkbox).

**Step 5: Write video.liquid**

Video embed section. Schema: `heading`, `video_url` (video_url type supporting YouTube/Vimeo), `cover_image` (image_picker), `autoplay` (checkbox).

**Step 6: Write testimonials.liquid**

Customer testimonials grid/carousel. Block type `testimonial`: `quote` (textarea), `author` (text), `rating` (range 1-5). Schema: `heading`, `columns` (select 2/3). Use `{% stylesheet %}` for testimonial card styles.

**Step 7: Write newsletter.liquid**

Email signup section with Shopify customer form. Schema: `heading`, `subtext` (richtext), `color_scheme` (select light/dark).

**Step 8: Write logo-list.liquid**

Row of brand/partner logos. Block type `logo`: `image` (image_picker), `link` (url). Schema: `heading`. Flexbox row with grayscale filter, color on hover.

**Step 9: Build, commit**

```bash
git add sections/ dev/style/ assets/base.css
git commit -m "feat: add homepage sections (featured product, collections, image-text, rich text, video, testimonials, newsletter, logos)"
```

---

### Task 18: Homepage template (index.json)

**Files:**
- Create: `templates/index.json`

**Step 1: Write index.json**

JSON template referencing sections in order:
1. `hero-banner` (with 1 default slide)
2. `featured-collection`
3. `image-with-text`
4. `collection-list`
5. `rich-text`
6. `newsletter`

Include default settings/block values so the theme looks reasonable in editor preview.

**Step 2: Commit**

```bash
git add templates/index.json
git commit -m "feat: add homepage template"
```

---

## Phase 4: Product Page

### Task 19: Main product section + SCSS

**Files:**
- Create: `sections/main-product.liquid`
- Create: `dev/style/sections/_product.scss`
- Modify: `dev/style/main.scss`

**Step 1: Write main-product.liquid**

Two-column layout: image gallery left, product info right.

**Image gallery:**
- Main image display area
- Thumbnail strip below (or side on desktop)
- Click thumbnail to swap main image
- Data attributes for JS: `data-product-gallery`, `data-gallery-main`, `data-gallery-thumbs`

**Product info (via blocks):**
Block types allowing merchant reordering:
- `title` - product title (h1)
- `price` - price snippet with compare-at
- `variant_picker` - variant selector. Color options as swatches (small colored circles), size as buttons. Updates price/availability/image on change.
- `quantity_selector` - quantity input with +/- buttons
- `buy_buttons` - add to cart button + dynamic checkout button (`{{ form | payment_button }}`)
- `description` - product description in tab/accordion
- `size_guide` - size guide tab (richtext setting)
- `shipping` - shipping info tab (richtext setting)
- `care` - care instructions tab (richtext setting)
- `share` - social share buttons

Section settings: `enable_sticky_cart` (checkbox), `enable_zoom` (checkbox), `media_size` (select: small/medium/large for gallery width ratio).

Schema with presets, blocks array, default block order: title, price, variant_picker, quantity_selector, buy_buttons, description.

**Step 2: Write _product.scss**

`.product`, `.product__gallery`, `.product__gallery-main`, `.product__gallery-thumbs`, `.product__info`, `.product__title`, `.product__variants`, `.product__swatches`, `.product__swatch` (color circles), `.product__size-buttons`, `.product__quantity`, `.product__tabs`, `.product__tab-content`.

Sticky cart bar: `.sticky-cart` fixed bottom bar.
Zoom: `.product__gallery-main--zoomed` with CSS transform scale.

Two-column grid on desktop, stacked on mobile.

**Step 3: Build, commit**

```bash
git add sections/main-product.liquid dev/style/ assets/base.css
git commit -m "feat: add main product section with gallery, variants, tabs"
```

---

### Task 20: Product page JavaScript

**Files:**
- Create: `dev/scripts/product-page.js`

**Step 1: Write product-page.js**

ES5 syntax. Features:
- **Gallery:** thumbnail click swaps main image (update src/srcset). Keyboard arrow navigation.
- **Zoom:** on click, toggle CSS class that scales image. On mousemove, update transform-origin for pan effect.
- **Variant selection:** listen for swatch/size button clicks. Update: selected variant, price display, availability, main image (if variant has image), add-to-cart button state (enabled/disabled/sold-out text). Update URL with `?variant=ID` without page reload.
- **Quantity:** increment/decrement buttons, min 1.
- **Tabs:** click to switch active tab content.
- **Sticky add-to-cart:** use IntersectionObserver on main buy button. When it scrolls out of view, show sticky bar at bottom.
- **Recently viewed:** on product page load, save product handle + title + image + price + URL to localStorage array (max 10). Provide function to retrieve list.

Product JSON: access via `<script type="application/json" data-product-json>{{ product | json }}</script>` in the section.

**Step 2: Build and verify**

Run: `npm run build`
Verify `assets/product-page.js` is generated.

**Step 3: Commit**

```bash
git add dev/scripts/product-page.js assets/product-page.js
git commit -m "feat: add product page JS (gallery, variants, zoom, sticky cart, recently viewed)"
```

---

### Task 21: Product recommendations + recently viewed sections

**Files:**
- Create: `sections/product-recommendations.liquid`

**Step 1: Write product-recommendations.liquid**

Uses Shopify recommendations API: `{{ routes.product_recommendations_url }}?section_id={{ section.id }}&product_id={{ product.id }}`. Renders product cards in a grid. Schema: `heading` (text, default "You may also like"), `products_to_show` (range 4-8).

Also add a "Recently viewed" block/section that renders from localStorage data via JS (injects product cards client-side).

**Step 2: Commit**

```bash
git add sections/product-recommendations.liquid
git commit -m "feat: add product recommendations and recently viewed sections"
```

---

### Task 22: Product template

**Files:**
- Create: `templates/product.json`

**Step 1: Write product.json**

JSON template with sections:
1. `main-product` with default blocks (title, price, variant_picker, quantity_selector, buy_buttons, description)
2. `product-recommendations`

**Step 2: Commit**

```bash
git add templates/product.json
git commit -m "feat: add product page template"
```

---

## Phase 5: Collection Page

### Task 23: Main collection section + filters

**Files:**
- Create: `sections/main-collection.liquid`
- Create: `sections/collection-filters.liquid`

**Step 1: Write main-collection.liquid**

Collection page with:
- Collection banner (image + title + description) at top
- Sort dropdown (best selling, price asc/desc, newest, A-Z, Z-A)
- Product grid using product-card snippet
- Pagination using pagination snippet

Schema: `products_per_page` (range 8-24, default 12), `columns` (select 2/3/4, default 3/4 desktop), `show_vendor` (checkbox), `enable_filtering` (checkbox), `enable_sorting` (checkbox).

Use `{% paginate collection.products by section.settings.products_per_page %}`.

**Step 2: Write collection-filters.liquid**

Sidebar/horizontal filter bar using Shopify's storefront filtering API (`collection.filters`). Renders filter groups (price range, availability, product type, vendor, options like color/size). Form submits as URL params. Clear/apply controls.

**Step 3: Commit**

```bash
git add sections/main-collection.liquid sections/collection-filters.liquid
git commit -m "feat: add collection page sections with filtering and sorting"
```

---

### Task 24: Collection templates

**Files:**
- Create: `templates/collection.json`
- Create: `templates/collection.list.json`

**Step 1: Write collection.json**

Sections: `main-collection`.

**Step 2: Write collection.list.json**

Collection list page showing all collections as image cards with titles. Uses `collections` global object in a grid.

**Step 3: Commit**

```bash
git add templates/collection.json templates/collection.list.json
git commit -m "feat: add collection templates"
```

---

## Phase 6: Cart Page

### Task 25: Main cart section + SCSS

**Files:**
- Create: `sections/main-cart.liquid`
- Create: `dev/style/sections/_cart.scss`
- Modify: `dev/style/main.scss`

**Step 1: Write main-cart.liquid**

Full cart page with:
- Line items table/list (image, title, variant, quantity adjuster, line price, remove)
- Order notes textarea (if `settings.enable_cart_notes`)
- Cart summary sidebar: subtotal, taxes/shipping note, checkout button, continue shopping link
- Empty cart state with message and continue shopping button
- Upsell products (if `settings.enable_upsells` - show product recommendations)

Form wrapping items for Shopify checkout submission.

**Step 2: Write _cart.scss**

`.cart`, `.cart__items`, `.cart__item`, `.cart__item-image`, `.cart__item-details`, `.cart__item-quantity`, `.cart__item-price`, `.cart__summary`, `.cart__empty`.
Responsive: table-like on desktop, stacked cards on mobile.

**Step 3: Build, commit**

```bash
git add sections/main-cart.liquid dev/style/ assets/base.css templates/cart.json
git commit -m "feat: add cart page section and template"
```

---

### Task 26: Cart template

**Files:**
- Create: `templates/cart.json`

**Step 1: Write cart.json with main-cart section. Commit.**

---

## Phase 7: Blog, Article, Pages

### Task 27: Blog + article sections and templates

**Files:**
- Create: `sections/main-blog.liquid`
- Create: `sections/main-article.liquid`
- Create: `dev/style/sections/_blog.scss`
- Create: `templates/blog.json`
- Create: `templates/article.json`
- Modify: `dev/style/main.scss`

**Step 1: Write main-blog.liquid**

Blog listing with article cards in grid. Each card: featured image, title, excerpt, date, author. Paginated. Schema: `articles_per_page` (range 6-24), `columns` (select 2/3), `show_date` (checkbox), `show_author` (checkbox).

**Step 2: Write main-article.liquid**

Article page: featured image (full-width), title, author + date meta, article content, tags, social sharing links, prev/next article nav. Comments section if blog has comments enabled.

**Step 3: Write _blog.scss, templates, build, commit**

```bash
git add sections/main-blog.liquid sections/main-article.liquid dev/style/ assets/base.css templates/blog.json templates/article.json
git commit -m "feat: add blog and article sections and templates"
```

---

### Task 28: Page templates (generic + contact)

**Files:**
- Create: `sections/main-page.liquid`
- Create: `sections/contact-form.liquid`
- Create: `templates/page.json`
- Create: `templates/page.contact.json`

**Step 1: Write main-page.liquid**

Simple page content section: page title (h1) + page content. Centered, max-width container for readability.

**Step 2: Write contact-form.liquid**

Contact form section using Shopify `{% form 'contact' %}`. Fields: name, email, phone (optional), message. Success/error handling. Schema: `heading` (text), `subtext` (richtext).

**Step 3: Write templates, commit**

```bash
git add sections/main-page.liquid sections/contact-form.liquid templates/page.json templates/page.contact.json
git commit -m "feat: add page and contact templates"
```

---

## Phase 8: Search, 404, Password, Customer Pages

### Task 29: Search section + template

**Files:**
- Create: `sections/main-search.liquid`
- Create: `templates/search.json`

**Step 1: Write main-search.liquid**

Search form + results. Shows product cards for product results, article cards for article results, page links for page results. Result count. Empty state message. Schema: `products_per_page` (range).

**Step 2: Commit**

```bash
git add sections/main-search.liquid templates/search.json
git commit -m "feat: add search results section and template"
```

---

### Task 30: 404 + password sections and templates

**Files:**
- Create: `sections/main-404.liquid`
- Create: `sections/main-password.liquid`
- Create: `templates/404.json`
- Create: `templates/password.json`
- Create: `layout/password.liquid`

**Step 1: Write main-404.liquid**

404 page: heading, subtext, search bar, "continue shopping" button, optional featured collection.

**Step 2: Write main-password.liquid + password.liquid layout**

Password/coming soon page: store name, custom message, email signup form, password entry form. Separate layout (`layout/password.liquid`) without header/footer - just minimal branding.

**Step 3: Commit**

```bash
git add sections/main-404.liquid sections/main-password.liquid templates/404.json templates/password.json layout/password.liquid
git commit -m "feat: add 404 and password pages"
```

---

### Task 31: Customer account templates

**Files:**
- Create: `templates/customers/login.json`
- Create: `templates/customers/register.json`
- Create: `templates/customers/account.json`
- Create: `templates/customers/order.json`
- Create: `templates/customers/addresses.json`
- Create: `templates/customers/reset_password.json`
- Create: `sections/main-login.liquid`
- Create: `sections/main-register.liquid`
- Create: `sections/main-account.liquid`
- Create: `sections/main-order.liquid`
- Create: `sections/main-addresses.liquid`
- Create: `sections/main-reset-password.liquid`

**Step 1: Write login section + template**

Login form with email/password, "forgot password" link, link to register.

**Step 2: Write register section + template**

Registration form: first name, last name, email, password.

**Step 3: Write account section + template**

Account dashboard: customer name, order history table (order number, date, payment status, fulfillment status, total), link to addresses.

**Step 4: Write order section + template**

Order detail: order number, date, line items, billing/shipping address, totals.

**Step 5: Write addresses section + template**

Address book: list of saved addresses with edit/delete, add new address form.

**Step 6: Write reset password section + template**

Password reset form: email input + submit.

**Step 7: Commit**

```bash
git add sections/main-login.liquid sections/main-register.liquid sections/main-account.liquid sections/main-order.liquid sections/main-addresses.liquid sections/main-reset-password.liquid templates/customers/
git commit -m "feat: add customer account pages (login, register, account, order, addresses, reset password)"
```

---

## Phase 9: Tests & Validation

### Task 32: Theme structure tests

**Files:**
- Create: `tests/theme-structure.test.js`
- Create: `tests/theme-sections.test.js`
- Create: `tests/theme-locale.test.js`
- Create: `tests/theme-assets.test.js`

**Step 1: Write theme-structure.test.js**

Tests that verify required directories and files exist:
- layout/theme.liquid exists
- All required template JSON files exist
- All customer template files exist
- config/settings_schema.json exists and is valid JSON
- config/settings_data.json exists and is valid JSON

**Step 2: Write theme-sections.test.js**

Tests that verify:
- All sections referenced in templates exist as .liquid files
- All section files contain `{% schema %}` tag
- All schema JSON is valid and parseable
- Required sections exist (header, footer, main-product, main-collection, etc.)

**Step 3: Write theme-locale.test.js**

Tests that verify:
- locales/en.default.json exists and is valid JSON
- locales/en.default.schema.json exists and is valid JSON
- Required top-level keys exist (general, products, collections, cart, customer, blog, etc.)

**Step 4: Write theme-assets.test.js**

Tests that verify:
- assets/base.css exists and is non-empty
- assets/global.js exists and is non-empty
- assets/product-page.js exists and is non-empty

**Step 5: Run tests**

Run: `npm run test:structure`
Expected: All tests pass.

**Step 6: Commit**

```bash
git add tests/
git commit -m "feat: add theme structure and validation tests"
```

---

### Task 33: Final validation

**Step 1: Run full build**

```bash
npm run build
```

**Step 2: Run all tests**

```bash
npm run test:structure
```

**Step 3: Run Shopify theme check (if CLI available)**

```bash
npm run test:shopify
```

Fix any errors flagged.

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: final validation and fixes"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-7 | Foundation: dirs, config, locales, base styles, layout |
| 2 | 8-13 | Global: icons, header, footer, announcement, cart drawer, JS |
| 3 | 14-18 | Homepage: snippets, hero, featured collection, all sections, template |
| 4 | 19-22 | Product: main section, JS, recommendations, template |
| 5 | 23-24 | Collection: main section, filters, templates |
| 6 | 25-26 | Cart: main section, template |
| 7 | 27-28 | Content: blog, article, pages |
| 8 | 29-31 | Utility: search, 404, password, customer accounts |
| 9 | 32-33 | Testing: structure tests, validation |

**Total: 33 tasks across 9 phases**
