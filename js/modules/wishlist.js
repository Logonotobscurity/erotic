/**
 * Wishlist Module
 * Handles wishlist functionality
 */

import { AppConfig } from '../config/app-config.js';
import { eventBus } from '../core/event-bus.js';
import { getFromStorage, saveToStorage } from '../utils/helpers.js';

class Wishlist {
  constructor() {
    this.items = new Set();
    this.storageKey = AppConfig.storage.wishlist;
  }

  /**
   * Initialize the wishlist
   */
  init() {
    this.loadWishlist();
    this.bindEvents();
    this.updateUI();
    console.log('❤️ Wishlist initialized');
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Listen for wishlist toggle clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="toggle-wishlist"]') || 
          e.target.closest('[data-action="toggle-wishlist"]')) {
        const button = e.target.matches('[data-action="toggle-wishlist"]') 
          ? e.target 
          : e.target.closest('[data-action="toggle-wishlist"]');
        
        const productId = button.getAttribute('data-product-id');
        if (productId) {
          this.toggle(productId, button);
        }
      }
    });

    // Listen for cart additions to potentially remove from wishlist
    eventBus.on('cart:item-added', ({ productId }) => {
      if (this.has(productId)) {
        // Optionally remove from wishlist when added to cart
        // this.remove(productId);
      }
    });
  }

  /**
   * Load wishlist from storage
   */
  loadWishlist() {
    const saved = getFromStorage(this.storageKey, []);
    this.items = new Set(saved);
  }

  /**
   * Save wishlist to storage
   */
  saveWishlist() {
    saveToStorage(this.storageKey, Array.from(this.items));
  }

  /**
   * Toggle item in wishlist
   * @param {string} productId - Product ID
   * @param {HTMLElement} button - Button element
   */
  toggle(productId, button) {
    if (this.has(productId)) {
      this.remove(productId, button);
    } else {
      this.add(productId, button);
    }
  }

  /**
   * Add item to wishlist
   * @param {string} productId - Product ID
   * @param {HTMLElement} button - Button element
   */
  add(productId, button) {
    this.items.add(productId);
    this.saveWishlist();
    
    if (button) {
      button.classList.add('active');
    }
    
    eventBus.emit('wishlist:item-added', { productId });
    eventBus.emit('notification:show', {
      message: 'Added to wishlist',
      type: 'success'
    });
    
    this.updateUI();
  }

  /**
   * Remove item from wishlist
   * @param {string} productId - Product ID
   * @param {HTMLElement} button - Button element
   */
  remove(productId, button) {
    this.items.delete(productId);
    this.saveWishlist();
    
    if (button) {
      button.classList.remove('active');
    }
    
    eventBus.emit('wishlist:item-removed', { productId });
    eventBus.emit('notification:show', {
      message: 'Removed from wishlist',
      type: 'info'
    });
    
    this.updateUI();
  }

  /**
   * Check if item is in wishlist
   * @param {string} productId - Product ID
   * @returns {boolean} Is in wishlist
   */
  has(productId) {
    return this.items.has(productId);
  }

  /**
   * Get all wishlist items
   * @returns {Array} Array of product IDs
   */
  getItems() {
    return Array.from(this.items);
  }

  /**
   * Get wishlist count
   * @returns {number} Number of items
   */
  getCount() {
    return this.items.size;
  }

  /**
   * Clear wishlist
   */
  clear() {
    this.items.clear();
    this.saveWishlist();
    this.updateUI();
    
    eventBus.emit('wishlist:cleared');
    eventBus.emit('notification:show', {
      message: 'Wishlist cleared',
      type: 'info'
    });
  }

  /**
   * Update UI elements
   */
  updateUI() {
    // Update all wishlist buttons
    document.querySelectorAll('[data-action="toggle-wishlist"]').forEach(button => {
      const productId = button.getAttribute('data-product-id');
      if (this.has(productId)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Update wishlist badge if exists
    const wishlistBadge = document.getElementById('wishlistBadge');
    if (wishlistBadge) {
      wishlistBadge.textContent = this.getCount();
    }
  }
}

// Export singleton instance
export const wishlist = new Wishlist();
