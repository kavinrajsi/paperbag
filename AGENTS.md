# Shopify Liquid Theme Development Codex for ChatGPT

## Quick Reference Guide

### Essential Commands

- **Always call `learn_shopify_api` first when working with Liquid themes**
- Focus on generating: snippets, blocks, sections
- Users create templates via theme editor

## Theme Architecture Overview

### Directory Structure

```
theme/
├── assets/         # CSS, JS, images, fonts
├── blocks/         # Reusable customizable components
├── config/         # Theme settings (settings_schema.json, settings_data.json)
├── layout/         # Page wrappers (must include {{ content_for_header }} and {{ content_for_layout }})
├── locales/        # Translation files (en.default.json required)
├── sections/       # Full-width page modules with {% schema %}
├── snippets/       # Reusable code fragments with {% doc %}
└── templates/      # Page structure definitions (JSON files)
```

## Component Types & When to Use

### Snippets

**Use for:** Reusable code NOT editable in theme editor
**Required:** {% doc %} header
**Example Use Cases:** Buttons, meta tags, form elements

### Blocks  

**Use for:** Small customizable components
**Required:** {% schema %} and {% doc %} (when statically rendered)
**Example Use Cases:** Testimonials, carousel slides, feature items

### Sections

**Use for:** Full-width customizable modules
**Required:** {% schema %} tag
**Example Use Cases:** Hero banners, product grids, featured collections

## Liquid Syntax Quick Reference

### Output & Logic Tags

```liquid
{{ variable }}              # Output
{{- variable -}}           # Output with whitespace trim
{% if condition %}         # Logic (no output)
{%- if condition -%}       # Logic with whitespace trim
```

### Variables

```liquid
{% assign var = 'value' %}
{% capture var %}content{% endcapture %}
{% increment counter %}
{% decrement counter %}
```

### Conditionals

```liquid
{% if condition %}
{% elsif other %}
{% else %}
{% endif %}

{% unless condition %}
{% endunless %}

{% case variable %}
  {% when 'value1' %}
  {% when 'value2' %}
  {% else %}
{% endcase %}
```

### Loops

```liquid
{% for item in collection %}
  {{ forloop.index }}
{% else %}
  No items
{% endfor %}

{% paginate collection by 20 %}
  {% for item in collection %}
  {% endfor %}
{% endpaginate %}
```

## CSS & JavaScript in Components

### Per-Component Styles

```liquid
{% stylesheet %}
  .component {
    /* CSS here */
  }
{% endstylesheet %}
```

### Per-Component Scripts

```liquid
{% javascript %}
  // JavaScript here
{% endjavascript %}
```

## Schema Best Practices

### Single CSS Property → Use CSS Variables

```liquid
<div style="--gap: {{ block.settings.gap }}px">

{% stylesheet %}
  .element { gap: var(--gap); }
{% endstylesheet %}

{% schema %}
{
  "settings": [{
    "type": "range",
    "id": "gap",
    "label": "Gap",
    "min": 0,
    "max": 100,
    "unit": "px",
    "default": 20
  }]
}
{% endschema %}
```

### Multiple CSS Properties → Use Classes

```liquid
<div class="{{ block.settings.layout }}">

{% stylesheet %}
  .layout--wide { /* multiple styles */ }
  .layout--narrow { /* multiple styles */ }
{% endstylesheet %}

{% schema %}
{
  "settings": [{
    "type": "select",
    "id": "layout",
    "label": "Layout",
    "options": [
      { "value": "layout--wide", "label": "Wide" },
      { "value": "layout--narrow", "label": "Narrow" }
    ]
  }]
}
{% endschema %}
```

## Translation Pattern

### Always Use Translation Filters

```liquid
<!-- CORRECT -->
<h2>{{ 'sections.hero.title' | t }}</h2>

<!-- WRONG -->
<h2>Featured Products</h2>
```

### With Variables

```liquid
{{ 'products.price' | t: price: product.price | money }}
```

### Locale File Structure

```json
{
  "sections": {
    "hero": {
      "title": "Welcome to our store"
    }
  },
  "products": {
    "price": "Price: {{ price }}"
  }
}
```

## Complete Component Examples

### Snippet Example

```liquid
{% doc %}
  Renders a button with optional link
  
  @param {string} text - Button text
  @param {string} [url] - Optional link URL
  @param {string} [class] - Additional CSS classes
  
  @example
  {% render 'button', text: 'Shop Now', url: product.url %}
{% enddoc %}

<a 
  href="{{ url | default: '#' }}"
  class="btn {{ class }}"
>
  {{ text }}
</a>

{% stylesheet %}
  .btn {
    display: inline-block;
    padding: 12px 24px;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
{% endstylesheet %}
```

### Block Example

```liquid
{% doc %}
  Feature card block for grid layouts
  
  @example
  {% content_for 'block', type: 'feature_card', id: 'card1' %}
{% enddoc %}

<div class="feature-card" {{ block.shopify_attributes }}>
  {% if block.settings.image %}
    {{ block.settings.image | image_url: width: 400 | image_tag }}
  {% endif %}
  
  <h3>{{ block.settings.title }}</h3>
  <p>{{ block.settings.text }}</p>
</div>

{% stylesheet %}
  .feature-card {
    padding: 20px;
    text-align: center;
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Feature Card",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Image"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Feature"
    },
    {
      "type": "textarea",
      "id": "text",
      "label": "Description"
    }
  ]
}
{% endschema %}
```

### Section Example

```liquid
<section class="hero-section">
  <div class="hero-section__container">
    {% if section.settings.image %}
      <div class="hero-section__background">
        {{ section.settings.image | image_url: width: 1920 | image_tag }}
      </div>
    {% endif %}
    
    <div class="hero-section__content">
      <h1>{{ section.settings.title }}</h1>
      {% if section.settings.text %}
        <p>{{ section.settings.text }}</p>
      {% endif %}
      
      {% if section.settings.button_text %}
        <a href="{{ section.settings.button_url }}" class="hero-section__button">
          {{ section.settings.button_text }}
        </a>
      {% endif %}
    </div>
  </div>
</section>

{% stylesheet %}
  .hero-section {
    position: relative;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .hero-section__background {
    position: absolute;
    inset: 0;
    z-index: -1;
  }
  
  .hero-section__background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .hero-section__content {
    text-align: center;
    padding: 40px 20px;
    max-width: 800px;
  }
  
  .hero-section__button {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 30px;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
{% endstylesheet %}

{% schema %}
{
  "name": "Hero Section",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background Image"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Welcome to our store"
    },
    {
      "type": "textarea",
      "id": "text",
      "label": "Description"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Shop Now"
    },
    {
      "type": "url",
      "id": "button_url",
      "label": "Button Link"
    }
  ],
  "presets": [
    {
      "name": "Hero Section"
    }
  ]
}
{% endschema %}
```

## Common Liquid Filters

### String Filters

- `{{ 'hello' | upcase }}` → HELLO
- `{{ 'HELLO' | downcase }}` → hello
- `{{ 'hello world' | capitalize }}` → Hello world
- `{{ 'hello' | append: ' world' }}` → hello world
- `{{ 'hello world' | split: ' ' }}` → ['hello', 'world']
- `{{ 'hello world' | replace: 'world', 'shopify' }}` → hello shopify
- `{{ '  hello  ' | strip }}` → hello
- `{{ 'hello world' | truncate: 8 }}` → hello...

### Array Filters

- `{{ array | first }}` → first item
- `{{ array | last }}` → last item
- `{{ array | size }}` → count
- `{{ array | join: ', ' }}` → comma-separated string
- `{{ array | map: 'title' }}` → array of titles
- `{{ array | where: 'available', true }}` → filtered array
- `{{ array | sort }}` → sorted array

### Math Filters

- `{{ 10 | plus: 5 }}` → 15
- `{{ 10 | minus: 3 }}` → 7
- `{{ 10 | times: 2 }}` → 20
- `{{ 10 | divided_by: 2 }}` → 5
- `{{ 10.7 | floor }}` → 10
- `{{ 10.2 | ceil }}` → 11
- `{{ -5 | abs }}` → 5

### Money Filters

- `{{ product.price | money }}` → $19.99
- `{{ product.price | money_without_currency }}` → 19.99
- `{{ product.price | money_with_currency }}` → $19.99 USD

### Image Filters

- `{{ image | image_url: width: 400 }}` → optimized URL
- `{{ url | image_tag }}` → <img> tag
- `{{ image | image_url: width: 400 | image_tag: alt: 'Product' }}` → complete img

## Form Types

```liquid
{% form 'product' %}
  <!-- Product form -->
{% endform %}

{% form 'customer_login' %}
  <!-- Login form -->
{% endform %}

{% form 'contact' %}
  <!-- Contact form -->
{% endform %}

{% form 'create_customer' %}
  <!-- Registration form -->
{% endform %}
```

## Global Objects Reference

### Always Available

- `shop` - Store information
- `cart` - Current cart
- `customer` - Logged-in customer
- `settings` - Theme settings
- `request` - Current request info
- `template` - Current template
- `theme` - Theme information

### Page-Specific

- `product` - On product pages
- `collection` - On collection pages
- `article` - On article pages
- `blog` - On blog pages
- `page` - On custom pages

## Best Practices Checklist

✅ Always use translations for user-facing text
✅ Include {% doc %} headers in snippets
✅ Add {% schema %} to sections and blocks
✅ Use CSS variables for single properties
✅ Use classes for multiple properties
✅ Keep styles component-scoped
✅ Validate JSON schemas
✅ Use sentence case for UI text
✅ Handle empty states in loops
✅ Escape variables to prevent XSS
✅ Use semantic HTML elements
✅ Implement responsive designs
✅ Consider accessibility (ARIA labels)
✅ Optimize images with filters
✅ Use Liquid filters efficiently

## Common Patterns

### Responsive Image

```liquid
{{ image | image_url: width: 1200 | image_tag: 
  loading: 'lazy',
  widths: '375, 550, 750, 1100',
  sizes: '(min-width: 1200px) 1200px, 100vw'
}}
```

### Conditional Classes

```liquid
<div class="
  product-card
  {% if product.available %}product-card--available{% endif %}
  {% if product.featured_image %}product-card--has-image{% endif %}
">
```

### Safe Default Values

```liquid
{{ section.settings.title | default: 'Default Title' }}
{{ block.settings.columns | default: 3 }}
```

### Loop with Index

```liquid
{% for item in collection limit: 6 %}
  <div class="item-{{ forloop.index }}">
    {% if forloop.first %}First item{% endif %}
    {% if forloop.last %}Last item{% endif %}
  </div>
{% endfor %}
```

## Schema Setting Types

- `text` - Single line text
- `textarea` - Multi-line text
- `richtext` - Rich text editor
- `number` - Number input
- `range` - Slider
- `select` - Dropdown
- `checkbox` - Boolean
- `radio` - Radio buttons
- `color` - Color picker
- `color_background` - Background color
- `font_picker` - Font selector
- `collection` - Collection picker
- `product` - Product picker
- `blog` - Blog picker
- `page` - Page picker
- `link_list` - Menu picker
- `url` - URL input
- `video_url` - Video URL
- `image_picker` - Image upload
- `html` - HTML code
- `article` - Article picker
- `header` - Section header (no input)
- `paragraph` - Explanatory text

## Important Rules

1. **Never hardcode text** - Always use translations
2. **Component isolation** - Keep CSS/JS scoped
3. **Mobile-first** - Design for mobile, enhance for desktop
4. **Performance** - Lazy load images, minimize JS
5. **Accessibility** - ARIA labels, semantic HTML
6. **Theme editor** - Make settings intuitive for merchants
7. **Validation** - Test all schema settings
8. **Documentation** - Use {% doc %} tags extensively

---

*This codex is optimized for ChatGPT to understand Shopify Liquid theme development patterns and generate accurate, production-ready code.*
