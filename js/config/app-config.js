/**
 * Application Configuration
 * Centralized configuration for the Erotica Lifestyle website
 */

export const AppConfig = {
  // API endpoints
  api: {
    baseUrl: '/api',
    products: '/data/products.json',
    timeout: 10000
  },

  // Storage keys
  storage: {
    cart: 'erotica_cart',
    wishlist: 'erotica_wishlist',
    discreteMode: 'erotica_discrete_mode',
    ageVerified: 'erotica_age_verified',
    bookmarks: 'erotica_bookmarks',
    preferences: 'erotica_preferences'
  },

  // Feature flags
  features: {
    quickView: true,
    wishlist: true,
    reviews: true,
    blog: true,
    partners: true,
    quiz: true
  },

  // UI settings
  ui: {
    animationDuration: 300,
    notificationDuration: 3000,
    scrollOffset: 80,
    productsPerPage: 12
  },

  // Validation rules
  validation: {
    minAge: 18,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phonePattern: /^[\d\s\-\+\(\)]+$/
  }
};
