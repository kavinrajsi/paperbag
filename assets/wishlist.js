/**
 * Global wishlist functionality using localStorage.
 * Powers all heart/wishlist buttons across the theme.
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'paperbag_wishlist';

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch(e) {
      return [];
    }
  }

  function saveWishlist(handles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
  }

  function isInWishlist(handle) {
    return getWishlist().indexOf(handle) !== -1;
  }

  function addToWishlist(handle) {
    var list = getWishlist();
    if (list.indexOf(handle) === -1) {
      list.push(handle);
      saveWishlist(list);
    }
  }

  function removeFromWishlist(handle) {
    var list = getWishlist().filter(function(h) { return h !== handle; });
    saveWishlist(list);
  }

  function toggleWishlist(handle) {
    if (isInWishlist(handle)) {
      removeFromWishlist(handle);
      return false;
    } else {
      addToWishlist(handle);
      return true;
    }
  }

  /**
   * Update all wishlist buttons on the page to reflect current state.
   * Buttons should have:
   *   data-wishlist-toggle="product-handle"
   */
  function syncButtons() {
    var btns = document.querySelectorAll('[data-wishlist-toggle]');
    for (var i = 0; i < btns.length; i++) {
      var handle = btns[i].getAttribute('data-wishlist-toggle');
      var active = isInWishlist(handle);
      btns[i].classList.toggle('wishlist-active', active);
      btns[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function bindButtons() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-wishlist-toggle]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      var handle = btn.getAttribute('data-wishlist-toggle');
      if (!handle) return;

      toggleWishlist(handle);
      syncButtons();
      window.dispatchEvent(new CustomEvent('wishlist:changed'));
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      bindButtons();
      syncButtons();
    });
  } else {
    bindButtons();
    syncButtons();
  }

  // Re-sync after dynamic content loads (e.g., section rendering)
  window.addEventListener('wishlist:changed', syncButtons);

  // Expose API globally
  window.PaperbagWishlist = {
    get: getWishlist,
    add: addToWishlist,
    remove: removeFromWishlist,
    toggle: toggleWishlist,
    has: isInWishlist,
    sync: syncButtons
  };
})();
