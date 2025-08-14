/**
 * Shopping Cart Module
 * Handles cart functionality including add, remove, update quantities
 */

class ShoppingCart {
  constructor() {
    this.cart = this.loadCart();
    this.cartBadge = document.getElementById('cartBadge');
    this.init();
  }

  init() {
    this.updateCartBadge();
    this.bindEvents();
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

  // Load cart from localStorage
  loadCart() {
    try {
      const cartData = localStorage.getItem('erotica_cart');
      return cartData ? JSON.parse(cartData) : {};
    } catch (error) {
      console.warn('Error loading cart from localStorage:', error);
      return {};
    }
  }

  // Save cart to localStorage
  saveCart() {
    try {
      localStorage.setItem('erotica_cart', JSON.stringify(this.cart));
    } catch (error) {
      console.warn('Error saving cart to localStorage:', error);
    }
  }

  // Add item to cart
  addToCart(productId, quantity = 1) {
    if (!productId) {return false;}

    // Get product data (in a real app, this would come from an API)
    const productData = this.getProductData(productId);
    if (!productData) {
      console.warn('Product not found:', productId);
      return false;
    }

    // Add or update cart item
    if (this.cart[productId]) {
      this.cart[productId].quantity += quantity;
    } else {
      this.cart[productId] = {
        id: productId,
        name: productData.name,
        price: productData.price,
        quantity,
        image: productData.image || null,
        addedAt: new Date().toISOString()
      };
    }

    this.saveCart();
    this.updateCartBadge();
    this.showCartNotification('added', productData.name);
    
    // Dispatch custom event for other modules
    this.dispatchCartEvent('cart:item-added', {
      productId,
      quantity,
      totalItems: this.getTotalItems()
    });

    return true;
  }

  // Remove item from cart
  removeFromCart(productId) {
    if (!productId || !this.cart[productId]) {return false;}

    const productName = this.cart[productId].name;
    delete this.cart[productId];
    
    this.saveCart();
    this.updateCartBadge();
    this.showCartNotification('removed', productName);
    
    // Dispatch custom event
    this.dispatchCartEvent('cart:item-removed', {
      productId,
      totalItems: this.getTotalItems()
    });

    return true;
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    if (!productId || !this.cart[productId]) {return false;}

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    this.cart[productId].quantity = quantity;
    this.saveCart();
    this.updateCartBadge();
    
    // Dispatch custom event
    this.dispatchCartEvent('cart:quantity-updated', {
      productId,
      quantity,
      totalItems: this.getTotalItems()
    });

    return true;
  }

  // Clear entire cart
  clearCart() {
    this.cart = {};
    this.saveCart();
    this.updateCartBadge();
    
    // Dispatch custom event
    this.dispatchCartEvent('cart:cleared', {
      totalItems: 0
    });

    this.showCartNotification('cleared', 'Cart');
  }

  // Get cart items
  getCartItems() {
    return Object.values(this.cart);
  }

  // Get total number of items
  getTotalItems() {
    return Object.values(this.cart).reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total value
  getCartTotal() {
    return Object.values(this.cart).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Update cart badge
  updateCartBadge() {
    if (!this.cartBadge) {return;}
    
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
