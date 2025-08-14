/**
 * Product Manager Module
 * Handles all product-related functionality
 */

import { AppConfig } from '../config/app-config.js';
import { eventBus } from '../core/event-bus.js';
import { formatCurrency, getCategoryColor, createRatingStars } from '../utils/helpers.js';

class ProductManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentFilters = {
      category: 'all',
      priceRange: [0, 100000],
      sortBy: 'name'
    };
  }

  /**
   * Initialize the product manager
   */
  async init() {
    await this.loadProducts();
    this.bindEvents();
    console.log('📦 Product Manager initialized');
  }

  /**
   * Load products from data source
   */
  async loadProducts() {
    try {
      const response = await fetch(AppConfig.api.products);
      if (response.ok) {
        const data = await response.json();
        this.products = data.products;
        this.filteredProducts = [...this.products];
        this.renderProducts();
      } else {
        this.loadFallbackProducts();
      }
    } catch (error) {
      console.error('Error loading products:', error);
      this.loadFallbackProducts();
    }
  }

  /**
   * Load fallback products
   */
  loadFallbackProducts() {
    this.products = [
      {
        id: 'luxury-rabbit',
        name: 'Luxury Rabbit Vibrator',
        description: 'Premium silicone dual stimulation with 10 vibration patterns',
        price: 45000,
        category: 'vibrators',
        badge: 'Bestseller',
        badgeType: 'primary',
        rating: 4.9,
        reviews: 127,
        icon: 'fas fa-heart',
        inStock: true
      },
      {
        id: 'couples-ring',
        name: 'Couples\' Pleasure Ring',
        description: 'Rechargeable vibrating ring for enhanced intimacy',
        price: 28500,
        category: 'couples',
        badge: 'New',
        badgeType: 'success',
        rating: 4.7,
        reviews: 89,
        icon: 'fas fa-users',
        inStock: true
      },
      {
        id: 'organic-lube',
        name: 'Premium Organic Lubricant',
        description: 'Long-lasting, water-based, pH-balanced formula',
        price: 15750,
        category: 'wellness',
        badge: 'Organic',
        badgeType: 'default',
        rating: 4.8,
        reviews: 203,
        icon: 'fas fa-leaf',
        inStock: true
      }
    ];
    
    this.filteredProducts = [...this.products];
    this.renderProducts();
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Listen for filter changes
    eventBus.on('filter:change', (filters) => {
      this.applyFilters(filters);
    });

    // Listen for sort changes
    eventBus.on('sort:change', (sortBy) => {
      this.sortProducts(sortBy);
    });
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Object|null} Product object or null
   */
  getProduct(productId) {
    return this.products.find(p => p.id === productId) || null;
  }

  /**
   * Apply filters to products
   * @param {Object} filters - Filter criteria
   */
  applyFilters(filters) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (this.currentFilters.category !== 'all' && 
          product.category !== this.currentFilters.category) {
        return false;
      }
      
      // Price range filter
      if (product.price < this.currentFilters.priceRange[0] || 
          product.price > this.currentFilters.priceRange[1]) {
        return false;
      }
      
      return true;
    });
    
    this.sortProducts(this.currentFilters.sortBy);
  }

  /**
   * Sort products
   * @param {string} sortBy - Sort criteria
   */
  sortProducts(sortBy) {
    this.currentFilters.sortBy = sortBy;
    
    switch (sortBy) {
      case 'name':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    this.renderProducts();
  }

  /**
   * Render products to the grid
   */
  renderProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) {return;}
    
    productGrid.innerHTML = '';
    
    this.filteredProducts.forEach(product => {
      const productCard = this.createProductCard(product);
      productGrid.appendChild(productCard);
    });
    
    // Emit event for other modules
    eventBus.emit('products:rendered', {
      count: this.filteredProducts.length,
      products: this.filteredProducts
    });
  }

  /**
   * Create a product card element
   * @param {Object} product - Product data
   * @returns {HTMLElement} Product card element
   */
  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    card.setAttribute('data-product-id', product.id);
    
    const colorClass = getCategoryColor(product.category);
    const formattedPrice = formatCurrency(product.price);
    const stars = createRatingStars(product.rating);
    
    card.innerHTML = `
      <div class="product-image bg-gradient-to-br from-${colorClass}-100 to-${colorClass}-200">
        <i class="${product.icon} text-6xl opacity-50 text-${colorClass}-500"></i>
        <div class="product-badge">
          <span class="badge ${product.badgeType === 'primary' ? 'badge-primary' : product.badgeType === 'success' ? 'badge-success' : ''}">${product.badge}</span>
        </div>
        ${AppConfig.features.quickView ? `
          <button class="product-quickview" data-action="quick-view" data-product-id="${product.id}" title="Quick View">
            <i class="fas fa-eye"></i>
          </button>
        ` : ''}
      </div>
      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        ${AppConfig.features.reviews ? `
          <div class="product-rating">
            <div class="product-stars">
              ${stars}
            </div>
            <span class="product-reviews">(${product.reviews} reviews)</span>
          </div>
        ` : ''}
        <div class="product-footer">
          <div class="product-price">${formattedPrice}</div>
          <div class="product-actions">
            <button class="product-btn" data-action="add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
              <i class="fas fa-cart-plus"></i>
              ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            ${AppConfig.features.wishlist ? `
              <button class="product-btn-wishlist" data-action="toggle-wishlist" data-product-id="${product.id}" title="Add to Wishlist">
                <i class="fas fa-heart"></i>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    
    return card;
  }

  /**
   * Load more products
   * @param {number} count - Number of products to load
   */
  async loadMore(count = 6) {
    // In a real app, this would fetch more products from the API
    eventBus.emit('notification:show', {
      message: 'Loading more products...',
      type: 'info'
    });
    
    // Simulate API delay
    setTimeout(() => {
      eventBus.emit('notification:show', {
        message: 'More products feature coming soon!',
        type: 'info'
      });
    }, 1000);
  }
}

// Export singleton instance
export const productManager = new ProductManager();
