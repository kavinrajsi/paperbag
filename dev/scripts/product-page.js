(function() {
  'use strict';

  // ==========================================
  // Product Gallery
  // ==========================================
  var Gallery = {
    init: function() {
      var gallery = document.querySelector('[data-product-gallery]');
      if (!gallery) return;

      this.mainImage = gallery.querySelector('[data-gallery-main] img');
      this.thumbs = gallery.querySelectorAll('[data-gallery-thumb]');

      if (!this.mainImage || this.thumbs.length === 0) return;

      for (var i = 0; i < this.thumbs.length; i++) {
        this.thumbs[i].addEventListener('click', this.handleThumbClick.bind(this));
      }
    },

    handleThumbClick: function(e) {
      var thumb = e.currentTarget;
      var imageUrl = thumb.getAttribute('data-image-url');
      var imageSrcset = thumb.getAttribute('data-image-srcset');

      if (this.mainImage) {
        this.mainImage.src = imageUrl;
        if (imageSrcset) {
          this.mainImage.srcset = imageSrcset;
        }
      }

      // Update active state
      for (var i = 0; i < this.thumbs.length; i++) {
        this.thumbs[i].classList.remove('product__gallery-thumb--active');
      }
      thumb.classList.add('product__gallery-thumb--active');
    },

    updateImage: function(imageUrl, imageSrcset) {
      if (this.mainImage && imageUrl) {
        this.mainImage.src = imageUrl;
        if (imageSrcset) {
          this.mainImage.srcset = imageSrcset;
        }
      }
    }
  };

  // ==========================================
  // Zoom
  // ==========================================
  var Zoom = {
    init: function() {
      var main = document.querySelector('[data-gallery-main]');
      if (!main) return;

      this.container = main;
      this.zoomed = false;

      main.addEventListener('click', this.toggleZoom.bind(this));
      main.addEventListener('mousemove', this.handleMouseMove.bind(this));
      main.addEventListener('mouseleave', this.resetZoom.bind(this));
    },

    toggleZoom: function() {
      this.zoomed = !this.zoomed;
      if (this.zoomed) {
        this.container.classList.add('product__gallery-main--zoomed');
      } else {
        this.container.classList.remove('product__gallery-main--zoomed');
        var img = this.container.querySelector('img');
        if (img) {
          img.style.transformOrigin = 'center center';
        }
      }
    },

    handleMouseMove: function(e) {
      if (!this.zoomed) return;
      var rect = this.container.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      var img = this.container.querySelector('img');
      if (img) {
        img.style.transformOrigin = x + '% ' + y + '%';
      }
    },

    resetZoom: function() {
      this.zoomed = false;
      this.container.classList.remove('product__gallery-main--zoomed');
      var img = this.container.querySelector('img');
      if (img) {
        img.style.transformOrigin = 'center center';
      }
    }
  };

  // ==========================================
  // Variant Selection
  // ==========================================
  var VariantPicker = {
    init: function() {
      var jsonEl = document.querySelector('[data-product-json]');
      if (!jsonEl) return;

      try {
        this.product = JSON.parse(jsonEl.textContent);
      } catch (e) {
        return;
      }

      this.options = [];
      var optionBtns = document.querySelectorAll('[data-option-value]');

      for (var i = 0; i < optionBtns.length; i++) {
        optionBtns[i].addEventListener('click', this.handleOptionClick.bind(this));
      }

      // Initialize current options
      this.updateCurrentOptions();
    },

    updateCurrentOptions: function() {
      this.options = [];
      var optionGroups = document.querySelectorAll('.product__option');
      for (var i = 0; i < optionGroups.length; i++) {
        var selected = optionGroups[i].querySelector('.product__option-btn--selected');
        if (selected) {
          this.options.push(selected.getAttribute('data-option-value'));
        }
      }
    },

    handleOptionClick: function(e) {
      var btn = e.currentTarget;
      var index = parseInt(btn.getAttribute('data-option-index'), 10);
      var value = btn.getAttribute('data-option-value');

      // Update selected state in this option group
      var parent = btn.closest('.product__option-values');
      var siblings = parent.querySelectorAll('[data-option-value]');
      for (var i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove('product__option-btn--selected');
      }
      btn.classList.add('product__option-btn--selected');

      // Update options array
      this.options[index] = value;

      // Find matching variant
      var variant = this.findVariant();
      if (variant) {
        this.updateVariant(variant);
      }
    },

    findVariant: function() {
      var variants = this.product.variants;
      for (var i = 0; i < variants.length; i++) {
        var match = true;
        for (var j = 0; j < this.options.length; j++) {
          if (variants[i].options[j] !== this.options[j]) {
            match = false;
            break;
          }
        }
        if (match) return variants[i];
      }
      return null;
    },

    updateVariant: function(variant) {
      // Update hidden variant ID input
      var variantInput = document.querySelector('[data-variant-id]');
      if (variantInput) {
        variantInput.value = variant.id;
      }

      // Update price
      var priceEl = document.querySelector('[data-product-price]');
      if (priceEl) {
        var priceHtml = '';
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          priceHtml = '<div class="price price--on-sale">';
          priceHtml += '<span class="price__regular">' + this.formatMoney(variant.price) + '</span>';
          priceHtml += '<span class="price__compare"><s>' + this.formatMoney(variant.compare_at_price) + '</s></span>';
          priceHtml += '</div>';
        } else {
          priceHtml = '<div class="price">';
          priceHtml += '<span class="price__regular">' + this.formatMoney(variant.price) + '</span>';
          priceHtml += '</div>';
        }
        priceEl.innerHTML = priceHtml;
      }

      // Update sticky price
      var stickyPrice = document.querySelector('[data-sticky-price]');
      if (stickyPrice) {
        stickyPrice.textContent = this.formatMoney(variant.price);
      }

      // Update add to cart button
      var addBtn = document.querySelector('[data-add-to-cart]');
      if (addBtn) {
        if (variant.available) {
          addBtn.disabled = false;
          addBtn.textContent = addBtn.getAttribute('data-add-text') || 'Add to cart';
        } else {
          addBtn.disabled = true;
          addBtn.textContent = addBtn.getAttribute('data-sold-text') || 'Sold out';
        }
      }

      // Update URL
      if (window.history && window.history.replaceState) {
        var url = window.location.pathname + '?variant=' + variant.id;
        window.history.replaceState({}, '', url);
      }

      // Update gallery image if variant has featured image
      if (variant.featured_image) {
        Gallery.updateImage(
          variant.featured_image.src,
          null
        );
        // Also update active thumbnail
        var thumbs = document.querySelectorAll('[data-gallery-thumb]');
        for (var i = 0; i < thumbs.length; i++) {
          thumbs[i].classList.remove('product__gallery-thumb--active');
          var thumbUrl = thumbs[i].getAttribute('data-image-url');
          if (thumbUrl && thumbUrl.indexOf(variant.featured_image.src.split('?')[0].split('/').pop()) > -1) {
            thumbs[i].classList.add('product__gallery-thumb--active');
          }
        }
      }
    },

    formatMoney: function(cents) {
      var amount = (cents / 100).toFixed(2);
      // Use Shopify money format if available
      if (window.Shopify && window.Shopify.money_format) {
        return window.Shopify.money_format.replace(/\{\{\s*amount\s*\}\}/, amount);
      }
      return '$' + amount;
    }
  };

  // ==========================================
  // Quantity Selector
  // ==========================================
  var QuantitySelector = {
    init: function() {
      var section = document.querySelector('[data-product-section]');
      if (!section) return;

      section.addEventListener('click', function(e) {
        var minus = e.target.closest('[data-quantity-minus]');
        var plus = e.target.closest('[data-quantity-plus]');

        if (!minus && !plus) return;

        var container = e.target.closest('.product__quantity-controls');
        if (!container) return;

        var input = container.querySelector('[data-quantity-input]');
        var current = parseInt(input.value, 10) || 1;

        if (minus) {
          input.value = Math.max(1, current - 1);
        } else if (plus) {
          input.value = current + 1;
        }
      });
    }
  };

  // ==========================================
  // Tabs (Accordion)
  // ==========================================
  var Tabs = {
    init: function() {
      var triggers = document.querySelectorAll('[data-tab-trigger]');
      for (var i = 0; i < triggers.length; i++) {
        triggers[i].addEventListener('click', this.handleClick);
      }
    },

    handleClick: function() {
      var tabId = this.getAttribute('data-tab-trigger');
      var content = document.querySelector('[data-tab-content="' + tabId + '"]');
      var expanded = this.getAttribute('aria-expanded') === 'true';

      this.setAttribute('aria-expanded', String(!expanded));

      if (content) {
        content.hidden = expanded;
      }

      // Rotate chevron icon
      var icon = this.querySelector('.icon');
      if (icon) {
        icon.style.transform = expanded ? '' : 'rotate(180deg)';
      }
    }
  };

  // ==========================================
  // Sticky Add to Cart
  // ==========================================
  var StickyCart = {
    init: function() {
      var stickyBar = document.querySelector('[data-sticky-cart]');
      var addBtn = document.querySelector('[data-add-to-cart]');

      if (!stickyBar || !addBtn) return;

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              stickyBar.hidden = true;
            } else {
              stickyBar.hidden = false;
            }
          }
        }, { threshold: 0 });

        observer.observe(addBtn);
      }

      // Sticky bar add-to-cart clicks the main form button
      var stickyAddBtn = stickyBar.querySelector('[data-sticky-add-to-cart]');
      if (stickyAddBtn) {
        stickyAddBtn.addEventListener('click', function() {
          addBtn.click();
        });
      }
    }
  };

  // ==========================================
  // Recently Viewed
  // ==========================================
  var RecentlyViewed = {
    storageKey: 'paperbag-recently-viewed',
    maxItems: 10,

    init: function() {
      this.saveCurrentProduct();
    },

    saveCurrentProduct: function() {
      var jsonEl = document.querySelector('[data-product-json]');
      if (!jsonEl) return;

      var product;
      try {
        product = JSON.parse(jsonEl.textContent);
      } catch (e) {
        return;
      }

      var items = this.getItems();
      // Remove if already exists
      var filtered = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].handle !== product.handle) {
          filtered.push(items[i]);
        }
      }

      // Add to front
      filtered.unshift({
        handle: product.handle,
        title: product.title,
        url: '/products/' + product.handle,
        price: product.price,
        image: product.featured_image ? product.featured_image : null
      });

      // Limit
      if (filtered.length > this.maxItems) {
        filtered = filtered.slice(0, this.maxItems);
      }

      try {
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      } catch (e) {
        // Storage full or unavailable
      }
    },

    getItems: function() {
      try {
        var data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }
  };

  // ==========================================
  // Initialize
  // ==========================================
  document.addEventListener('DOMContentLoaded', function() {
    Gallery.init();
    Zoom.init();
    VariantPicker.init();
    QuantitySelector.init();
    Tabs.init();
    StickyCart.init();
    RecentlyViewed.init();
  });
})();
