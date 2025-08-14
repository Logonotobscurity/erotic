/**
 * Shopping Cart Module
 * Handles cart functionality including add, remove, update quantities
 */

import { AppConfig } from '../config/app-config.js';
import { eventBus } from '../core/event-bus.js';
import { getFromStorage, saveToStorage } from '../utils/helpers.js';
import { productManager } from './product-manager.js';

class ShoppingCart {
  constructor() {
    this.items = new Map();
    this.storageKey = AppConfig.storage.cart;
    this.cartBadge = null;
  }

  /**
   * Initialize the cart
   */
  init() {
    this.loadCart();
    this.bindEvents();
    this.updateUI();
    console.log('🛒 Shopping Cart initialized');
  }

  bindEvents() {
    // Listen for add to cart button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="add-to-cart"]') || 
          e.target.closest('[data-action="add-to-cart"]')) {
        const button = e.target.matches('[data-action="add-to-cart"]') 
          ? e.target 
          : e.target.closest('[data-action="add-to-cart"]');
        
        const productId = button.getAttribute('data-product-id');
        if (productId) {
          this.addToCart(productId);
        }
      }
    });

    // Listen for remove from cart button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="remove-from-cart"]') || 
          e.target.closest('[data-action="remove-from-cart"]')) {
        const button = e.target.matches('[data-action="remove-from-cart"]') 
          ? e.target 
          : e.target.closest('[data-action="remove-from-cart"]');
        
        const productId = button.getAttribute('data-product-id');
        if (productId) {
          this.removeFromCart(productId);
        }
      }
    });

    // Listen for cart updates
    document.addEventListener('change', (e) => {
      if (e.target.matches('[data-action="update-quantity"]')) {
        const productId = e.target.getAttribute('data-product-id');
        const quantity = parseInt(e.target.value, 10);
        if (productId && quantity >= 0) {
          this.updateQuantity(productId, quantity);
        }
      }
    });
  }

  /**
   * Load cart from storage
   */
  loadCart() {
    const saved = getFromStorage(this.storageKey, {});
    this.items = new Map(Object.entries(saved));
  }

  /**
   * Save cart to storage
   */
  saveCart() {
    const cartObject = Object.fromEntries(this.items);
    saveToStorage(this.storageKey, cartObject);
  }

  /**
   * Add item to cart
   * @param {string} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {boolean} Success status
   */
  add(productId, quantity = 1) {
    if (!productId) {return false;}

    const product = productManager.getProduct(productId);
    if (!product) {
      console.warn('Product not found:', productId);
      return false;
    }

    // Add or update cart item
    if (this.items.has(productId)) {
      const item = this.items.get(productId);
      item.quantity += quantity;
    } else {
      this.items.set(productId, {
        id: productId,
        name: product.name,
        price: product.price,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    this.updateUI();
    
    // Emit events
    eventBus.emit('cart:item-added', {
      productId,
      quantity,
      totalItems: this.getTotalItems()
    });
    
    eventBus.emit('notification:show', {
      message: `${product.name} added to cart!`,
      type: 'success'
    });

    return true;
  }

  /**
   * Remove item from cart
   * @param {string} productId - Product ID
   * @returns {boolean} Success status
   */
  remove(productId) {
    if (!productId || !this.items.has(productId)) {return false;}

    const item = this.items.get(productId);
    this.items.delete(productId);
    
    this.saveCart();
    this.updateUI();
    
    // Emit events
    eventBus.emit('cart:item-removed', {
      productId,
      totalItems: this.getTotalItems()
    });
    
    eventBus.emit('notification:show', {
      message: `${item.name} removed from cart`,
      type: 'info'
    });

    return true;
  }

  /**
   * Update item quantity
   * @param {string} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {boolean} Success status
   */
  updateQuantity(productId, quantity) {
    if (!productId || !this.items.has(productId)) {return false;}

    if (quantity <= 0) {
      return this.remove(productId);
    }

    const item = this.items.get(productId);
    item.quantity = quantity;
    
    this.saveCart();
    this.updateUI();
    
    // Emit event
    eventBus.emit('cart:quantity-updated', {
      productId,
      quantity,
      totalItems: this.getTotalItems()
    });

    return true;
  }

  /**
   * Clear entire cart
   */
  clear() {
    this.items.clear();
    this.saveCart();
    this.updateUI();
    
    // Emit events
    eventBus.emit('cart:cleared', {
      totalItems: 0
    });
    
    eventBus.emit('notification:show', {
      message: 'Cart cleared',
      type: 'info'
    });
  }

  /**
   * Get cart items
   * @returns {Array} Array of cart items
   */
  getItems() {
    return Array.from(this.items.values());
  }

  /**
   * Get total number of items
   * @returns {number} Total item count
   */
  getTotalItems() {
    return Array.from(this.items.values()).reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get cart total value
   * @returns {number} Total cart value
   */
  getTotal() {
    return Array.from(this.items.values()).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  /**
   * Check if cart has item
   * @param {string} productId - Product ID
   * @returns {boolean} Has item
   */
  has(productId) {
    return this.items.has(productId);
  }

  /**
   * Update UI elements
   */
  updateUI() {
    this.cartBadge = this.cartBadge || document.getElementById('cartBadge');
    
    if (this.cartBadge) {
      const totalItems = this.getTotalItems();
      this.cartBadge.textContent = totalItems;
      
      // Add visual feedback for cart updates
      if (totalItems > 0) {
        this.cartBadge.style.display = 'flex';
        this.cartBadge.classList.add('animate-pulse');
        setTimeout(() => {
          this.cartBadge.classList.remove('animate-pulse');
        }, 1000);
      } else {
        this.cartBadge.style.display = 'none';
      }
    }
  }

  // Show cart notification
  showCartNotification(action, productName) {
    const messages = {
      added: `${productName} added to cart`,
      removed: `${productName} removed from cart`,
      cleared: 'Cart cleared'
    };

    const message = messages[action] || 'Cart updated';
    
    // Use the notifications module if available
    if (window.NotificationManager) {
      window.NotificationManager.show(message, 'success');
    } else {
      // Fallback notification
      console.log(`🛒 ${message}`);
    }
  }

  // Get product data (mock function - in real app would fetch from API)
  getProductData(productId) {
    // This would typically fetch from a products API or database
    // For now, return mock data based on the product IDs used in the HTML
    const products = {
      'rose-luxe-vibrator': {
        id: 'rose-luxe-vibrator',
        name: 'Rose Luxe Vibrator',
        price: 45800,
        image: '/images/products/rose-luxe.jpg',
        category: 'vibrators'
      },
      'couples-ring-set': {
        id: 'couples-ring-set',
        name: 'Couples Ring Set',
        price: 49500,
        image: '/images/products/couples-ring.jpg',
        category: 'couples'
      },
      'organic-wellness-kit': {
        id: 'organic-wellness-kit',
        name: 'Organic Wellness Kit',
        price: 26750,
        image: '/images/products/wellness-kit.jpg',
        category: 'wellness'
      },
      'heated-massage-wand': {
        id: 'heated-massage-wand',
        name: 'Heated Massage Wand',
        price: 62400,
        image: '/images/products/massage-wand.jpg',
        category: 'vibrators'
      },
      'smart-kegel-trainer': {
        id: 'smart-kegel-trainer',
        name: 'Smart Kegel Trainer',
        price: 38250,
        image: '/images/products/kegel-trainer.jpg',
        category: 'wellness'
      },
      'luxury-care-essentials': {
        id: 'luxury-care-essentials',
        name: 'Luxury Care Essentials',
        price: 22400,
        image: '/images/products/care-essentials.jpg',
        category: 'accessories'
      }
    };

    return products[productId] || null;
  }

  // Dispatch custom cart events
  dispatchCartEvent(eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail: {
        cart: this.cart,
        ...detail
      }
    });
    document.dispatchEvent(event);
  }

  // Format price (Nigerian Naira)
  formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  }

  // Check if product is in cart
  isInCart(productId) {
    return !!this.cart[productId];
  }

  // Get product quantity in cart
  getProductQuantity(productId) {
    return this.cart[productId] ? this.cart[productId].quantity : 0;
  }

  // Export cart data (for checkout or external processing)
  exportCart() {
    return {
      items: this.getCartItems(),
      totalItems: this.getTotalItems(),
      totalValue: this.getCartTotal(),
      exportedAt: new Date().toISOString()
    };
  }

  // Import cart data (for restoring cart state)
  importCart(cartData) {
    if (cartData && typeof cartData === 'object') {
      this.cart = cartData;
      this.saveCart();
      this.updateCartBadge();
      
      this.dispatchCartEvent('cart:imported', {
        totalItems: this.getTotalItems()
      });
      
      return true;
    }
    return false;
  }
}

// Global cart functions for backward compatibility
window.addToCart = function(productId) {
  if (window.cart) {
    return window.cart.addToCart(productId);
  }
};

window.removeFromCart = function(productId) {
  if (window.cart) {
    return window.cart.removeFromCart(productId);
  }
};

window.clearCart = function() {
  if (window.cart) {
    return window.cart.clearCart();
  }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new ShoppingCart();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShoppingCart;
}
