# Paperbag — Shopify Theme Design System
**Store Type:** Fashion / Apparel  
**Vibe:** Minimal & Clean  
**Last Updated:** 2026-03-25

---

## 1. Brand Identity

| Property | Value |
|---|---|
| Theme Name | `Paperbag` |
| Primary Brand Color | `#8fa1b7` |
| Font Family | `Outfit` (Google Fonts) |
| Design Language | Minimal, editorial, refined whitespace |

---

## 2. Coding Standards

### 2.1 Google HTML/CSS Style Guide Rules

#### HTML Rules
| Rule | Requirement |
|---|---|
| Doctype | Always use `<!doctype html>` |
| Encoding | `<meta charset="utf-8">` on every page |
| Indentation | 2 spaces — no tabs |
| Capitalization | All lowercase: elements, attributes, values |
| Protocol | Always use `https://` for external resources |
| Quotes | Double quotes `""` for all HTML attribute values |
| Type attributes | Omit `type` on `<link>` and `<script>` tags |
| `id` attributes | Avoid for styling; use `class` instead. If required, use hyphenated values (`user-profile`) |
| Semantics | Use elements for their purpose: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` |
| Multimedia | Always include meaningful `alt` on images; empty `alt=""` for decorative images |
| Separation | No inline styles; no inline JS event handlers |
| TODOs | Mark with `<!-- TODO: description -->` |
| Trailing whitespace | Remove all trailing whitespace |

**HTML Example:**
```html
<!doctype html>
<meta charset="utf-8">
<link rel="stylesheet" href="{{ 'paperbag-base.css' | asset_url }}">

<section class="featured-collection">
  <h2 class="featured-collection__title">Shop the Edit</h2>
  <ul class="featured-collection__grid">
    <li class="product-card">
      <img
        src="{{ product.featured_image | image_url: width: 600 }}"
        alt="{{ product.title | escape }}"
        loading="lazy"
        width="600"
        height="750"
      >
    </li>
  </ul>
</section>
```

#### CSS Rules
| Rule | Requirement |
|---|---|
| Validity | Write valid CSS; no hacks or `!important` |
| Indentation | 2 spaces for all block content |
| Semicolons | End every declaration with `;` |
| Spacing | One space after `:` in declarations |
| Spacing | One space before `{` in rule sets |
| Selectors | Each selector on its own line |
| Blank lines | One blank line between rules |
| Quotes | Single quotes `''` in CSS (not double) |
| Zero units | Omit units after `0` (e.g. `margin: 0`) |
| Leading zeros | Always include (e.g. `0.8em` not `.8em`) |
| Hex notation | Shorthand where possible (`#ebc` not `#eebbcc`) |
| Shorthand | Use shorthand properties where possible |
| Declaration order | Alphabetical order within each rule block |
| ID selectors | Never use `#id` selectors in CSS |
| Type selectors | Avoid qualifying: use `.btn` not `button.btn` |
| `!important` | Never use |

**CSS Example:**
```css
/* Hero Banner */

.hero-banner {
  align-items: center;
  display: flex;
  min-height: 85vh;
  position: relative;
}

.hero-banner__content {
  max-width: var(--container-narrow);
  padding: var(--space-8);
  text-align: center;
}

.hero-banner__title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
}
```

---

### 2.2 BEM Naming Convention

**Syntax:** `block__element--modifier`

| Level | Pattern | Example |
|---|---|---|
| Block | `.block` | `.product-card` |
| Element | `.block__element` | `.product-card__image` |
| Modifier | `.block--modifier` | `.product-card--sold-out` |
| Element + Modifier | `.block__element--modifier` | `.product-card__price--sale` |

#### Rules
- Use **double underscore** `__` to separate block from element
- Use **double hyphen** `--` to separate block/element from modifier
- Use **single hyphen** `-` to separate words within a name
- Never nest BEM selectors (`.block .block__element {}` → just `.block__element {}`)
- Modifier is **always used alongside** the base class: `class="btn btn--primary"`
- Prefix with theme namespace `pb-` for global/shared components to avoid conflicts

#### Paperbag BEM Examples

```html
<!-- Block -->
<article class="product-card">

  <!-- Elements -->
  <div class="product-card__media">
    <img class="product-card__image" src="..." alt="...">
    <span class="product-card__badge product-card__badge--sale">Sale</span>
  </div>

  <div class="product-card__body">
    <h3 class="product-card__title">Linen Midi Dress</h3>
    <div class="product-card__price">
      <span class="product-card__price-current">₹2,499</span>
      <span class="product-card__price-compare">₹3,999</span>
    </div>
  </div>

</article>

<!-- Block modifier -->
<article class="product-card product-card--sold-out">
  ...
</article>
```

```css
/* Block */
.product-card {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* Elements */
.product-card__media {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  position: relative;
}

.product-card__image {
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
  width: 100%;
}

.product-card__badge {
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  left: var(--space-3);
  padding: var(--space-1) var(--space-3);
  position: absolute;
  top: var(--space-3);
}

/* Modifiers */
.product-card__badge--sale {
  background: var(--color-error);
  color: var(--color-white);
}

.product-card--sold-out .product-card__image {
  opacity: 0.5;
}
```

---

### 2.3 Atomic Design Structure

Atomic Design breaks UI into 5 levels. In Shopify theme context:

```
Atoms      → snippets/            (smallest reusable units)
Molecules  → snippets/ or blocks/ (combinations of atoms)
Organisms  → sections/            (full UI regions)
Templates  → templates/           (page-level layout)
Pages      → Shopify renders      (real content in templates)
```

#### Level 1 — Atoms (`snippets/`)
Smallest indivisible UI units. No layout logic, no container.

| Atom | File | Output |
|---|---|---|
| Button | `snippets/atom-button.liquid` | `<button class="btn btn--primary">` |
| Badge | `snippets/atom-badge.liquid` | `<span class="badge badge--sale">` |
| Icon | `snippets/atom-icon.liquid` | Inline SVG icon |
| Price | `snippets/atom-price.liquid` | Price + compare-at markup |
| Image | `snippets/atom-image.liquid` | Responsive `<img>` with srcset |
| Label | `snippets/atom-label.liquid` | Form field label |
| Input | `snippets/atom-input.liquid` | Text/email input field |

**Example — `snippets/atom-button.liquid`:**
```liquid
{% doc %}
  Renders a button atom.
  @param {String} label - Button text
  @param {String} url - Optional href
  @param {String} [variant='primary'] - primary | outline | ghost
  @param {String} [size='md'] - sm | md | lg
  @param {Boolean} [full_width=false] - Full width block button
{% enddoc %}

{% assign variant = variant | default: 'primary' %}
{% assign size = size | default: 'md' %}

{% if url %}
  <a
    href="{{ url }}"
    class="btn btn--{{ variant }} btn--{{ size }}{% if full_width %} btn--full{% endif %}"
  >
    {{ label }}
  </a>
{% else %}
  <button
    type="button"
    class="btn btn--{{ variant }} btn--{{ size }}{% if full_width %} btn--full{% endif %}"
  >
    {{ label }}
  </button>
{% endif %}
```

---

#### Level 2 — Molecules (`snippets/` or `blocks/`)
Combinations of atoms forming a simple UI unit.

| Molecule | File | Composed Of |
|---|---|---|
| Product card | `blocks/molecule-product-card.liquid` | atom-image + atom-price + atom-button |
| Search bar | `snippets/molecule-search-bar.liquid` | atom-input + atom-button + atom-icon |
| Rating stars | `snippets/molecule-rating.liquid` | atom-icon × 5 + count label |
| Form field | `snippets/molecule-field.liquid` | atom-label + atom-input |
| Price block | `snippets/molecule-price-block.liquid` | atom-price + atom-badge |

**Example — `snippets/molecule-price-block.liquid`:**
```liquid
{% doc %}
  Renders price + optional sale badge.
  @param {Object} product - Shopify product object
{% enddoc %}

<div class="price-block">
  <span class="price-block__current">
    {{ product.price | money }}
  </span>

  {% if product.compare_at_price > product.price %}
    <span class="price-block__compare">
      {{ product.compare_at_price | money }}
    </span>
    {% render 'atom-badge', label: 'Sale', variant: 'sale' %}
  {% endif %}
</div>
```

---

#### Level 3 — Organisms (`sections/`)
Complex UI regions composed of molecules and atoms.

| Organism | File | Composed Of |
|---|---|---|
| Hero Banner | `sections/hero-banner.liquid` | atom-image + atom-button + heading |
| Featured Collection | `sections/featured-collection.liquid` | grid of molecule-product-card |
| Image with Text | `sections/image-with-text.liquid` | atom-image + text + atom-button |
| Testimonials | `sections/testimonials.liquid` | grid of molecule-testimonial-card |
| Video Section | `sections/video-section.liquid` | video embed + atom-button (play) |
| Header | `sections/header.liquid` | logo + nav + atom-icon (cart, search) |
| Footer | `sections/footer.liquid` | nav columns + molecule-newsletter |

---

#### Level 4 — Templates (`templates/`)
Page-level layout shells — defines which organisms appear on each page type.

| Template | Organisms Included |
|---|---|
| `templates/index.json` | hero-banner, featured-collection, image-with-text, testimonials, video-section |
| `templates/product.json` | product-media, product-form, product-recommendations |
| `templates/collection.json` | collection-banner, product-grid, pagination |
| `templates/page.contact.json` | page-header, contact-form |
| `templates/cart.json` | cart-items, cart-summary |

---

#### Atomic Naming Prefix Convention

| Prefix | Location | Example |
|---|---|---|
| `atom-` | `snippets/` | `snippets/atom-button.liquid` |
| `molecule-` | `snippets/` or `blocks/` | `snippets/molecule-field.liquid` |
| *(descriptive)* | `sections/` | `sections/hero-banner.liquid` |

---

### 2.4 Full Class Naming Reference

```
{block}                        → BEM block
{block}__{element}             → BEM element
{block}--{modifier}            → BEM modifier
{block}__{element}--{modifier} → BEM element modifier
is-{state}                     → JS state hook  (styled)
js-{name}                      → JS selector hook only — never styled
```

**Full example across all levels:**
```html
<!-- Atom -->
<button class="btn btn--primary btn--lg">Shop Now</button>

<!-- Molecule -->
<div class="price-block">
  <span class="price-block__current">₹2,499</span>
  <span class="price-block__compare">₹3,999</span>
  <span class="badge badge--sale">Sale</span>
</div>

<!-- Organism -->
<section class="featured-collection">
  <div class="featured-collection__header">
    <h2 class="featured-collection__title">Shop the Edit</h2>
  </div>
  <ul class="featured-collection__grid">
    <li class="product-card product-card--new">...</li>
  </ul>
</section>

<!-- JS hook — never style this class -->
<button class="btn btn--primary js-add-to-cart">Add to Cart</button>

<!-- State — toggled by JS -->
<div class="cart-drawer is-open">...</div>
```

---

## 3. Typography

### Font Import
```liquid
{{ 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap' | stylesheet_tag }}
```

Or in `layout/theme.liquid`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--font-size-xs` | 11px | 400 | Labels, badges |
| `--font-size-sm` | 13px | 400 | Captions, metadata |
| `--font-size-base` | 15px | 400 | Body text |
| `--font-size-md` | 17px | 500 | Sub-headings |
| `--font-size-lg` | 22px | 500 | Section sub-titles |
| `--font-size-xl` | 30px | 600 | Section headings |
| `--font-size-2xl` | 42px | 600 | Page titles |
| `--font-size-3xl` | 58px | 700 | Hero headline |
| `--font-size-4xl` | 72px | 700 | Hero large display |

### Line Heights

| Token | Value |
|---|---|
| `--leading-tight` | 1.1 |
| `--leading-snug` | 1.3 |
| `--leading-normal` | 1.5 |
| `--leading-relaxed` | 1.7 |

### Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `--tracking-tight` | -0.02em | Large headings |
| `--tracking-normal` | 0 | Body text |
| `--tracking-wide` | 0.08em | Labels, nav links |
| `--tracking-wider` | 0.15em | Eyebrow text, badges |

---

## 4. Color System

### CSS Variables
```css
:root {
  /* Brand */
  --color-brand:        #8fa1b7;
  --color-brand-light:  #b3c3d3;
  --color-brand-dark:   #6b82a0;

  /* Neutrals */
  --color-white:        #ffffff;
  --color-off-white:    #f8f7f5;
  --color-light:        #f0eeeb;
  --color-muted:        #e2dfd9;
  --color-border:       #d6d3ce;
  --color-text-muted:   #9a9590;
  --color-text-secondary: #6b6660;
  --color-text:         #2a2826;
  --color-black:        #1a1816;

  /* Semantic */
  --color-success:      #7aab8a;
  --color-error:        #c97b7b;
  --color-warning:      #d4a96a;

  /* Backgrounds */
  --color-bg:           #ffffff;
  --color-bg-alt:       #f8f7f5;
  --color-bg-section:   #f0eeeb;

  /* Overlays */
  --color-overlay:      rgba(26, 24, 22, 0.45);
  --color-overlay-light: rgba(26, 24, 22, 0.12);
}
```

### Color Usage Guide

| Color | Hex | Use For |
|---|---|---|
| Brand | `#8fa1b7` | CTAs, active states, links, accents |
| Brand Light | `#b3c3d3` | Hover states, tinted backgrounds |
| Brand Dark | `#6b82a0` | Pressed states, dark accents |
| Off White | `#f8f7f5` | Alternate section backgrounds |
| Light | `#f0eeeb` | Card backgrounds, input fills |
| Border | `#d6d3ce` | Dividers, input borders |
| Text | `#2a2826` | Primary body text |
| Text Secondary | `#6b6660` | Metadata, secondary text |
| Text Muted | `#9a9590` | Placeholders, hints |

---

## 5. Spacing System

```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   20px;
  --space-6:   24px;
  --space-8:   32px;
  --space-10:  40px;
  --space-12:  48px;
  --space-16:  64px;
  --space-20:  80px;
  --space-24:  96px;
  --space-32:  128px;
}
```

### Section Padding Convention

| Device | Top/Bottom Padding |
|---|---|
| Mobile | `--space-16` (64px) |
| Tablet | `--space-20` (80px) |
| Desktop | `--space-24` (96px) |

---

## 6. Layout & Grid

```css
:root {
  --container-max:      1280px;
  --container-narrow:   880px;
  --container-wide:     1440px;
  --container-padding:  clamp(16px, 4vw, 48px);

  --grid-cols-2:        repeat(2, 1fr);
  --grid-cols-3:        repeat(3, 1fr);
  --grid-cols-4:        repeat(4, 1fr);
  --grid-gap:           24px;
  --grid-gap-lg:        40px;
}
```

### Breakpoints

| Name | Min Width | Usage |
|---|---|---|
| `sm` | 480px | Small phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1440px | Wide screens |

---

## 7. Border & Radius

```css
:root {
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-lg:    12px;
  --radius-xl:    20px;
  --radius-full:  9999px;

  --border-thin:  1px solid var(--color-border);
  --border-base:  1.5px solid var(--color-border);
}
```

---

## 8. Shadows

```css
:root {
  --shadow-xs:  0 1px 3px rgba(0,0,0,0.06);
  --shadow-sm:  0 2px 8px rgba(0,0,0,0.08);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.10);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.12);
  --shadow-xl:  0 16px 48px rgba(0,0,0,0.14);
}
```

---

## 9. Motion & Transitions

```css
:root {
  --ease-out:     cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);

  --duration-fast:    150ms;
  --duration-base:    250ms;
  --duration-slow:    400ms;
  --duration-slower:  600ms;
}
```

### Usage Pattern
```css
.element {
  transition: transform var(--duration-base) var(--ease-out),
              opacity var(--duration-base) var(--ease-out);
}
```

---

## 10. Buttons

### Schema Settings (settings_schema.json)
```json
{
  "name": "Buttons",
  "settings": [
    { "type": "select", "id": "button_style", "label": "Button style",
      "options": [
        { "value": "filled", "label": "Filled" },
        { "value": "outline", "label": "Outline" },
        { "value": "ghost", "label": "Ghost" }
      ],
      "default": "filled"
    },
    { "type": "range", "id": "button_border_radius", "min": 0, "max": 40, "step": 2,
      "unit": "px", "label": "Border radius", "default": 4 }
  ]
}
```

### CSS
```css
.btn {
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  padding: 14px 32px;
  border-radius: var(--radius-sm);
  transition: all var(--duration-base) var(--ease-out);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.btn--primary {
  background: var(--color-brand);
  color: var(--color-white);
  border: 1.5px solid var(--color-brand);
}
.btn--primary:hover {
  background: var(--color-brand-dark);
  border-color: var(--color-brand-dark);
}

.btn--outline {
  background: transparent;
  color: var(--color-text);
  border: 1.5px solid var(--color-text);
}
.btn--outline:hover {
  background: var(--color-text);
  color: var(--color-white);
}

.btn--ghost {
  background: transparent;
  color: var(--color-brand);
  border: none;
  padding-left: 0;
  padding-right: 0;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

---

## 11. Sections

### 11.1 Hero Banner

**File:** `sections/hero-banner.liquid`

**Schema Settings:**
| Setting | Type | Default |
|---|---|---|
| Heading | text | "New Collection" |
| Subheading | textarea | — |
| CTA Label | text | "Shop Now" |
| CTA Link | url | — |
| Image (desktop) | image_picker | — |
| Image (mobile) | image_picker | — |
| Text alignment | select | center |
| Min height | range | 85vh |
| Overlay opacity | range | 0.3 |

**Design Notes:**
- Full-viewport height on desktop, 70vh on mobile
- Image object-fit: cover with lazy loading
- Headline: `--font-size-4xl`, weight 700, tracking tight
- CTA: `btn--outline` (white border on dark image)
- Fade-in animation on page load (opacity + translateY)

---

### 11.2 Featured Collection

**File:** `sections/featured-collection.liquid`

**Schema Settings:**
| Setting | Type | Default |
|---|---|---|
| Section title | text | "Shop the Edit" |
| Collection | collection | — |
| Products to show | range | 4 |
| Columns (desktop) | select | 4 |
| Show vendor | checkbox | false |
| Show sale badge | checkbox | true |

**Product Card Design:**
- Image ratio: 4:5 (portrait) — standard fashion ratio
- Hover: second image crossfade (if available)
- Price: regular + strikethrough compare-at
- Sale badge: `--color-error` pill, top-left
- Title: `--font-size-base`, weight 400
- Subtle card shadow on hover (`--shadow-md`)

---

### 11.3 Image with Text

**File:** `sections/image-with-text.liquid`

**Schema Settings:**
| Setting | Type | Default |
|---|---|---|
| Image | image_picker | — |
| Image position | select | left |
| Eyebrow text | text | — |
| Heading | text | — |
| Body text | richtext | — |
| CTA Label | text | — |
| CTA Link | url | — |
| Background | select | white |

**Design Notes:**
- 50/50 split on desktop, stacked on mobile
- Eyebrow: `--font-size-xs`, tracking wider, brand color
- Heading: `--font-size-2xl`, weight 600
- Body: `--font-size-base`, leading relaxed, text secondary
- Image: slight scale(1.02) on scroll enter

---

### 11.4 Testimonials

**File:** `sections/testimonials.liquid`

**Schema Settings:**
| Setting | Type | Default |
|---|---|---|
| Section title | text | "What They Say" |
| Layout | select | grid / slider |
| Columns | select | 3 |
| Show stars | checkbox | true |
| Background | select | off-white |

**Block: Testimonial Item**
| Setting | Type |
|---|---|
| Quote text | textarea |
| Author name | text |
| Author title | text |
| Star rating | range (1–5) |

**Design Notes:**
- Background: `--color-bg-alt`
- Card: white bg, `--shadow-xs`, `--radius-md`, padding `--space-8`
- Quote: `--font-size-md`, italic, leading relaxed
- Stars: `--color-brand` filled SVG icons
- Author: `--font-size-sm`, weight 600

---

### 11.5 Video Section

**File:** `sections/video-section.liquid`

**Schema Settings:**
| Setting | Type | Default |
|---|---|---|
| Video URL | text | YouTube / Vimeo |
| Poster image | image_picker | — |
| Autoplay | checkbox | false |
| Muted | checkbox | true |
| Section title | text | — |
| Layout | select | full-width / contained |

**Design Notes:**
- Full-bleed or max-width contained with `--radius-lg`
- Play button: centered overlay, translucent white circle
- Poster image with `--color-overlay` tint
- On click: poster fades, iframe/video loads

---

## 12. Global Components

### Header
- Sticky on scroll (background: white, `--shadow-xs`)
- Logo: centered or left-aligned
- Nav: `--font-size-sm`, tracking wide, uppercase
- Cart icon with item count badge (`--color-brand`)
- Mobile: hamburger → slide-in drawer

### Footer
- Background: `--color-black`
- Text: `--color-text-muted` on dark
- Columns: Links, Contact, Newsletter
- Social icons: SVG, hover color `--color-brand-light`
- Border-top: 1px `rgba(255,255,255,0.1)`

### Cart Drawer
- Slide in from right
- Header: "Your Bag" + close icon
- Line items: product image, name, variant, qty stepper, price
- Footer: subtotal + checkout CTA (`btn--primary`, full width)

### Announcement Bar
- Background: `--color-brand`
- Text: white, `--font-size-sm`, centered
- Dismissible with `×` icon

---

## 13. Product Page Elements

| Element | Style Notes |
|---|---|
| Gallery | Main image (4:5) + thumbnail strip |
| Title | `--font-size-xl`, weight 600 |
| Price | `--font-size-lg`, weight 500 |
| Vendor | `--font-size-xs`, tracking wider, muted |
| Variant swatches | 32×32px circles, border on selected |
| Size selector | Pill buttons, outline style |
| Qty stepper | `−` count `+` inline row |
| ATC button | `btn--primary`, full width, 54px height |
| Description | `--font-size-base`, leading relaxed |
| Accordion | Size guide, shipping, returns |

---

## 14. Form Elements

```css
.field__input {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text);
  background: var(--color-bg);
  border: var(--border-base);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  width: 100%;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.field__input:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px rgba(143, 161, 183, 0.18);
}

.field__input::placeholder {
  color: var(--color-text-muted);
}
```

---

## 15. Accessibility Standards

- All images must have meaningful `alt` text
- Interactive elements minimum touch target: **44×44px**
- Focus-visible outline: `2px solid var(--color-brand)` + `outline-offset: 3px`
- Color contrast ratio: minimum **4.5:1** for body text
- Use semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`
- ARIA labels on icon-only buttons (cart, wishlist, close)
- Skip-to-content link as first focusable element

---

## 16. File Structure Reference

```
paperbag/
├── layout/
│   └── theme.liquid          # Global font import, CSS vars
├── sections/
│   ├── hero-banner.liquid
│   ├── featured-collection.liquid
│   ├── image-with-text.liquid
│   ├── testimonials.liquid
│   └── video-section.liquid
├── blocks/
│   ├── product-card.liquid
│   └── testimonial-item.liquid
├── snippets/
│   ├── button.liquid
│   ├── product-price.liquid
│   ├── icon-*.liquid
│   └── image-wrapper.liquid
├── assets/
│   ├── paperbag-base.css     # CSS variables + resets
│   ├── component-*.css       # Per-component styles
│   └── section-*.css
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
└── locales/
    └── en.default.json
```

---

*Paperbag — Design System v2.0 — Fashion / Apparel Theme*