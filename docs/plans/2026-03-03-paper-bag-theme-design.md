# Paper Bag Shopify Theme - Design Document

## Overview

A full-featured Shopify 2.0 theme for fashion and lifestyle brands. Clean & modern aesthetic with balanced layouts, neutral palette, accent colors, and functional design.

**Target:** Fashion and lifestyle brands (think Everlane, Uniqlo style)
**Stack:** Liquid, JSON templates, SCSS (via Gulp), vanilla JS, Shopify 2.0 sections everywhere

---

## Theme Architecture

### Directory Structure

```
paperbag/
├── layout/
│   └── theme.liquid
├── templates/
│   ├── index.json
│   ├── product.json
│   ├── collection.json
│   ├── collection.list.json
│   ├── cart.json
│   ├── blog.json
│   ├── article.json
│   ├── page.json
│   ├── page.contact.json
│   ├── search.json
│   ├── 404.json
│   ├── password.json
│   └── customers/
│       ├── login.json
│       ├── register.json
│       ├── account.json
│       ├── order.json
│       ├── addresses.json
│       └── reset_password.json
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── announcement-bar.liquid
│   ├── hero-banner.liquid
│   ├── featured-collection.liquid
│   ├── featured-product.liquid
│   ├── collection-list.liquid
│   ├── image-with-text.liquid
│   ├── rich-text.liquid
│   ├── video.liquid
│   ├── testimonials.liquid
│   ├── newsletter.liquid
│   ├── logo-list.liquid
│   ├── main-product.liquid
│   ├── product-recommendations.liquid
│   ├── main-collection.liquid
│   ├── collection-filters.liquid
│   ├── main-cart.liquid
│   ├── cart-drawer.liquid
│   ├── main-blog.liquid
│   ├── main-article.liquid
│   ├── main-page.liquid
│   ├── contact-form.liquid
│   ├── main-search.liquid
│   ├── main-404.liquid
│   └── main-password.liquid
├── snippets/
│   ├── product-card.liquid
│   ├── price.liquid
│   ├── image.liquid
│   ├── icon.liquid
│   ├── pagination.liquid
│   ├── breadcrumb.liquid
│   └── social-icons.liquid
├── blocks/
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── locales/
│   ├── en.default.json
│   └── en.default.schema.json
├── assets/
├── dev/
│   ├── style/
│   │   ├── base/
│   │   │   ├── _reset.scss
│   │   │   ├── _variables.scss
│   │   │   ├── _typography.scss
│   │   │   └── _utilities.scss
│   │   ├── components/
│   │   │   ├── _buttons.scss
│   │   │   ├── _forms.scss
│   │   │   ├── _cards.scss
│   │   │   └── _badges.scss
│   │   ├── sections/
│   │   │   ├── _hero.scss
│   │   │   ├── _product.scss
│   │   │   ├── _collection.scss
│   │   │   ├── _cart.scss
│   │   │   ├── _blog.scss
│   │   │   └── _testimonials.scss
│   │   ├── layout/
│   │   │   ├── _header.scss
│   │   │   ├── _footer.scss
│   │   │   └── _grid.scss
│   │   └── main.scss
│   └── scripts/
│       ├── init.js
│       └── product-page.js
└── tests/
    ├── theme-structure.test.js
    ├── theme-sections.test.js
    ├── theme-locale.test.js
    └── theme-assets.test.js
```

---

## Pages & Templates

### Homepage (index.json)
Sections-everywhere template with the full sections library available:
- Announcement bar (global, in header group)
- Hero banner with slideshow support (up to 5 slides)
- Featured collection grid
- Image with text (alternating layout)
- Featured product highlight
- Collection list (2-4 collections with images)
- Video section (YouTube/Vimeo embed or hosted)
- Testimonials (carousel or grid)
- Brand logos row
- Newsletter signup
- Rich text (flexible content block)

### Product Page (product.json)
- **Image gallery:** Thumbnails below or side, click-to-zoom, supports multiple images and video
- **Product info:** Title, vendor, price (with compare-at), variant selector with color swatches and size buttons
- **Sticky add-to-cart:** Appears when main button scrolls out of view
- **Tabbed details:** Description, size guide, shipping info, care instructions
- **Size guide modal:** Popup with sizing chart
- **Related products:** Shopify product recommendations API
- **Recently viewed:** Client-side tracking via localStorage

### Collection Page (collection.json)
- **Filters:** Sidebar or horizontal filter bar (price, color, size, vendor, product type)
- **Sort:** Best selling, price low-high, price high-low, newest, alphabetical
- **Grid:** 2/3/4 columns (responsive), with product cards
- **Pagination:** Numbered pagination with prev/next
- **Banner:** Collection image and description at top

### Cart Page (cart.json)
- Line items with image, title, variant, quantity adjuster, line price
- Order notes field
- Subtotal and checkout button
- Continue shopping link
- Upsell/cross-sell recommendations

### Cart Drawer (cart-drawer.liquid)
- AJAX slide-out drawer from right
- Same line item display as cart page (compact)
- Quick quantity adjustment
- Remove item
- Subtotal + checkout button
- Configurable via theme settings (drawer vs page)

### Blog (blog.json) & Article (article.json)
- Blog listing with featured image grid, title, excerpt, date, author
- Article page with featured image, content, tags, social sharing, author bio
- Prev/next article navigation
- Comment form (if enabled)

### Search (search.json)
- Search overlay/bar in header
- Results page with product cards, articles, and pages
- Filter by type (products, articles, pages)

### Customer Pages
- Login, register, reset password forms
- Account dashboard with order history
- Order detail page
- Address book management

### Other Pages
- **page.json:** Generic page template for about, FAQ, etc.
- **page.contact.json:** Contact page with form
- **404.json:** Not found with search bar and featured collections
- **password.json:** Coming soon page with email signup and store info

---

## Design System

### Color Palette (Theme Settings)
- **Background:** #FFFFFF (white)
- **Text:** #1A1A1A (near black)
- **Primary:** #2C2C2C (dark charcoal - buttons, links)
- **Secondary:** #F5F5F0 (warm off-white - backgrounds, cards)
- **Accent:** #C4A35A (warm gold - highlights, badges)
- **Border:** #E5E5E5 (light gray)
- **Error:** #D32F2F
- **Success:** #2E7D32

All colors configurable via theme settings color pickers.

### Typography
- **Headings:** System sans-serif stack or merchant-selected font via Shopify font picker
- **Body:** System sans-serif stack or merchant-selected font
- **Base size:** 16px with modular scale for headings (h1: 2.5rem, h2: 2rem, h3: 1.5rem, h4: 1.25rem)
- **Line height:** 1.6 for body, 1.2 for headings

### Spacing
- Consistent spacing scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
- Section padding: 64px top/bottom (configurable per section)
- Container max-width: 1200px centered

### Breakpoints
- Mobile: < 750px
- Tablet: 750px - 989px
- Desktop: 990px+
- Mobile-first approach

### Components
- **Buttons:** Primary (filled), secondary (outlined), text (underlined). Rounded corners (4px), consistent padding
- **Cards:** Subtle shadow or border, rounded corners (8px), hover lift effect
- **Forms:** Clean inputs with border, focus ring, consistent sizing
- **Badges:** Sale badge, sold out badge, new badge on product cards

---

## Theme Settings (settings_schema.json)

### Setting Groups
1. **Colors:** Primary, secondary, accent, background, text, button colors
2. **Typography:** Heading font, body font, base size
3. **Logo:** Logo image, logo width, favicon
4. **Social media:** Links for Instagram, Facebook, Twitter, Pinterest, TikTok, YouTube
5. **Cart:** Cart type (drawer/page), enable cart notes, enable upsells
6. **Product:** Enable size guide, enable recently viewed, enable sticky add-to-cart
7. **Search:** Enable predictive search
8. **Announcement bar:** Enable, text, link, background color

---

## JavaScript Features

### Global (init.js)
- Mobile menu toggle (hamburger)
- Cart drawer open/close with AJAX add-to-cart
- Search overlay toggle
- Announcement bar dismiss
- Smooth scroll for anchor links
- Sticky header on scroll

### Product Page (product-page.js)
- Image gallery with thumbnail navigation
- Click-to-zoom (CSS transform based, no library)
- Variant selector (updates price, image, availability)
- Color swatches and size buttons
- Sticky add-to-cart (IntersectionObserver)
- Quantity input increment/decrement
- Tab switching for product details
- Size guide modal
- Recently viewed products (localStorage)

### Cart (in init.js)
- AJAX add to cart (fetch API)
- Cart drawer update (line item quantity, remove)
- Cart count badge update
- Cart page quantity adjusters

All JS uses vanilla JS, no external dependencies. Web Components pattern where appropriate. Event-driven communication between components.

---

## Locales Structure

```json
{
  "general": {
    "search": "Search",
    "cart": "Cart",
    "menu": "Menu",
    "close": "Close",
    "continue_shopping": "Continue shopping",
    "loading": "Loading..."
  },
  "products": {
    "product": {
      "add_to_cart": "Add to cart",
      "sold_out": "Sold out",
      "quantity": "Quantity",
      "description": "Description",
      "size_guide": "Size guide",
      "shipping": "Shipping & returns",
      "care": "Care instructions",
      "sale": "Sale",
      "new": "New"
    }
  },
  "collections": {
    "sorting": { ... },
    "filtering": { ... },
    "pagination": { ... }
  },
  "cart": {
    "title": "Your cart",
    "empty": "Your cart is empty",
    "subtotal": "Subtotal",
    "checkout": "Checkout",
    "note": "Order notes",
    "remove": "Remove"
  },
  "customer": { ... },
  "blog": { ... },
  "sections": { ... }
}
```

---

## Performance Considerations

- Lazy-load all images below fold with `loading="lazy"`
- Use `image_url` filter with appropriate widths and srcset
- Critical CSS inlined in layout, component styles via `{% stylesheet %}`
- Defer non-critical JS
- Minimal DOM, no unnecessary wrappers
- No external library dependencies
- Preconnect to Shopify CDN

---

## Accessibility

- Semantic HTML throughout (nav, main, article, section, aside, footer)
- Skip-to-content link
- Focus management for modals and drawers
- ARIA labels on interactive elements
- Color contrast meeting WCAG AA
- Keyboard navigation for all interactive elements
- Reduced motion media query support
