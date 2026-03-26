(function() {
  'use strict';

  // ==========================================
  // Mobile Menu
  // ==========================================
  var MobileMenu = {
    init: function() {
      var toggle = document.querySelector('[data-mobile-toggle]');
      var nav = document.querySelector('[data-mobile-nav]');
      var close = document.querySelector('[data-mobile-nav-close]');

      if (!toggle || !nav) return;

      toggle.addEventListener('click', function() {
        nav.classList.add('mobile-nav--open');
        document.body.style.overflow = 'hidden';
      });

      if (close) {
        close.addEventListener('click', function() {
          nav.classList.remove('mobile-nav--open');
          document.body.style.overflow = '';
        });
      }

      // Close on overlay click
      nav.addEventListener('click', function(e) {
        if (e.target === nav) {
          nav.classList.remove('mobile-nav--open');
          document.body.style.overflow = '';
        }
      });

      // Sub-menu toggles
      var subToggles = document.querySelectorAll('[data-sub-toggle]');
      for (var i = 0; i < subToggles.length; i++) {
        subToggles[i].addEventListener('click', function() {
          var item = this.closest('.mobile-nav__item');
          var isOpen = item.classList.contains('mobile-nav__item--open');
          // Close all open items
          var openItems = document.querySelectorAll('.mobile-nav__item--open');
          for (var j = 0; j < openItems.length; j++) {
            openItems[j].classList.remove('mobile-nav__item--open');
            var t = openItems[j].querySelector('[data-sub-toggle]');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
          // Toggle current
          if (!isOpen) {
            item.classList.add('mobile-nav__item--open');
            this.setAttribute('aria-expanded', 'true');
          }
        });
      }
    }
  };

  // ==========================================
  // Sticky Header
  // ==========================================
  var StickyHeader = {
    init: function() {
      var header = document.querySelector('[data-header]');
      if (!header) return;

      var ticking = false;

      window.addEventListener('scroll', function() {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            var currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
              header.classList.add('header--scrolled');
            } else {
              header.classList.remove('header--scrolled');
            }

            ticking = false;
          });
          ticking = true;
        }
      });
    }
  };

  // ==========================================
  // Cart (AJAX)
  // ==========================================
  var Cart = {
    init: function() {
      this.bindAddToCart();
      this.bindDrawer();
      this.bindQuantity();
      this.bindRemove();
    },

    bindAddToCart: function() {
      document.addEventListener('submit', function(e) {
        var form = e.target;
        if (!form.matches('form[action="/cart/add"]')) return;
        e.preventDefault();

        var formData = new FormData(form);
        Cart.addToCart(formData);
      });
    },

    bindDrawer: function() {
      // Open drawer
      var cartTriggers = document.querySelectorAll('[data-cart-trigger]');
      for (var i = 0; i < cartTriggers.length; i++) {
        cartTriggers[i].addEventListener('click', function(e) {
          e.preventDefault();
          Cart.openDrawer();
        });
      }

      // Close drawer
      document.addEventListener('click', function(e) {
        if (e.target.closest('[data-cart-drawer-close]') || e.target.closest('[data-cart-drawer-overlay]')) {
          Cart.closeDrawer();
        }
      });

      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          Cart.closeDrawer();
        }
      });
    },

    bindQuantity: function() {
      document.addEventListener('click', function(e) {
        var minus = e.target.closest('[data-quantity-minus]');
        var plus = e.target.closest('[data-quantity-plus]');

        if (minus || plus) {
          var item = e.target.closest('[data-cart-item]');
          if (!item) return;

          var input = item.querySelector('[data-quantity-input]');
          var key = item.getAttribute('data-key');
          var currentQty = parseInt(input.value, 10);
          var newQty = minus ? Math.max(0, currentQty - 1) : currentQty + 1;

          if (newQty === 0) {
            Cart.updateItem(key, 0);
          } else {
            input.value = newQty;
            Cart.updateItem(key, newQty);
          }
        }
      });
    },

    bindRemove: function() {
      document.addEventListener('click', function(e) {
        var removeBtn = e.target.closest('[data-cart-remove]');
        if (!removeBtn) return;

        var item = removeBtn.closest('[data-cart-item]');
        if (!item) return;

        var key = item.getAttribute('data-key');
        Cart.updateItem(key, 0);
      });
    },

    addToCart: function(formData) {
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
        .then(function(response) {
          return response.json();
        })
        .then(function() {
          Cart.refreshDrawer();
          Cart.openDrawer();
        })
        .catch(function(error) {
          // eslint-disable-next-line no-console
          console.error('Add to cart error:', error);
        });
    },

    updateItem: function(key, quantity) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(cart) {
          Cart.updateCartCount(cart.item_count);
          Cart.refreshDrawer();
        })
        .catch(function(error) {
          // eslint-disable-next-line no-console
          console.error('Update cart error:', error);
        });
    },

    refreshDrawer: function() {
      fetch('/?section_id=cart-drawer')
        .then(function(response) {
          return response.text();
        })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var newDrawer = doc.querySelector('[data-cart-drawer]');
          var currentDrawer = document.querySelector('[data-cart-drawer]');

          if (newDrawer && currentDrawer) {
            currentDrawer.innerHTML = newDrawer.innerHTML;
          }

          // Update cart count
          fetch('/cart.js')
            .then(function(r) { return r.json(); })
            .then(function(cart) {
              Cart.updateCartCount(cart.item_count);
            });
        });
    },

    updateCartCount: function(count) {
      var countElements = document.querySelectorAll('[data-cart-count]');
      for (var i = 0; i < countElements.length; i++) {
        countElements[i].textContent = count;
      }
    },

    openDrawer: function() {
      var drawer = document.querySelector('[data-cart-drawer]');
      if (drawer) {
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    },

    closeDrawer: function() {
      var drawer = document.querySelector('[data-cart-drawer]');
      if (drawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  };

  // ==========================================
  // Announcement Bar Dismiss
  // ==========================================
  var AnnouncementBar = {
    init: function() {
      var bar = document.querySelector('[data-announcement-bar]');
      var dismiss = document.querySelector('[data-announcement-dismiss]');

      if (!bar || !dismiss) return;

      if (sessionStorage.getItem('announcement-dismissed') === 'true') {
        bar.style.display = 'none';
        return;
      }

      dismiss.addEventListener('click', function() {
        bar.style.display = 'none';
        sessionStorage.setItem('announcement-dismissed', 'true');
      });
    }
  };

  // ==========================================
  // Header Offset (body padding for fixed header)
  // ==========================================
  var HeaderOffset = {
    init: function() {
      var header = document.querySelector('[data-header]');
      if (!header) return;

      var update = function() {
        document.body.style.paddingTop = header.offsetHeight + 'px';
      };

      update();
      window.addEventListener('resize', update);
    }
  };

  // ==========================================
  // Initialize
  // ==========================================
  document.addEventListener('DOMContentLoaded', function() {
    MobileMenu.init();
    StickyHeader.init();
    HeaderOffset.init();
    Cart.init();
    AnnouncementBar.init();
  });
})();
