/**
 * EROTICA LIFESTYLE - MAIN APPLICATION
 * Modern modular architecture with ES6 modules
 */

import { AppConfig } from './config/app-config.js';
import { eventBus } from './core/event-bus.js';
import { productManager } from './modules/product-manager.js';
import { cart } from './modules/cart-refactored.js';
import { wishlist } from './modules/wishlist.js';
import { ageGate } from './modules/age-gate-refactored.js';
import { navigation } from './modules/navigation-refactored.js';
import { notifications } from './modules/notifications-refactored.js';
import { forms } from './modules/forms-refactored.js';
import { productFilter } from './modules/product-filter-refactored.js';
import { discreteMode } from './modules/discrete-mode.js';
import { scrollEffects } from './modules/scroll-effects.js';
import { animations } from './modules/animations.js';
import { keyboard } from './modules/keyboard.js';
import { blog } from './modules/blog.js';
import { partners } from './modules/partners.js';

/**
 * Application State
 */
const AppState = {
  initialized: false,
  modules: new Map()
};

/**
 * Initialize the application
 */
async function initializeApp() {
  if (AppState.initialized) return;

  console.log('🚀 Initializing Erotica Lifestyle...');

  try {
    // Initialize core modules in order
    const modules = [
      { name: 'AgeGate', instance: ageGate },
      { name: 'Notifications', instance: notifications },
      { name: 'Navigation', instance: navigation },
      { name: 'ProductManager', instance: productManager },
      { name: 'Cart', instance: cart },
      { name: 'Wishlist', instance: wishlist },
      { name: 'ProductFilter', instance: productFilter },
      { name: 'Forms', instance: forms },
      { name: 'DiscreteMode', instance: discreteMode },
      { name: 'ScrollEffects', instance: scrollEffects },
      { name: 'Animations', instance: animations },
      { name: 'Keyboard', instance: keyboard },
      { name: 'Blog', instance: blog },
      { name: 'Partners', instance: partners }
    ];

    // Initialize each module
    for (const module of modules) {
      try {
        if (module.instance && typeof module.instance.init === 'function') {
          await module.instance.init();
          AppState.modules.set(module.name, module.instance);
        }
      } catch (error) {
        console.error(`Failed to initialize ${module.name}:`, error);
      }
    }

    // Set up global event listeners
    setupGlobalListeners();

    // Set up performance monitoring
    setupPerformanceMonitoring();

    AppState.initialized = true;
    console.log('✅ Erotica Lifestyle initialized successfully');

    // Emit app ready event
    eventBus.emit('app:ready', {
      modules: Array.from(AppState.modules.keys())
    });

  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}

/**
 * Setup global event listeners
 */
function setupGlobalListeners() {
  // Handle quick view requests
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-action="quick-view"]') || 
        e.target.closest('[data-action="quick-view"]')) {
      const button = e.target.matches('[data-action="quick-view"]') 
        ? e.target 
        : e.target.closest('[data-action="quick-view"]');
      
      const productId = button.getAttribute('data-product-id');
      if (productId && AppConfig.features.quickView) {
        eventBus.emit('quickview:open', { productId });
      }
    }
  });

  // Handle load more button
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-action="load-more"]') || 
        e.target.closest('[data-action="load-more"]')) {
      productManager.loadMore();
    }
  });

  // Handle smooth scroll links
  document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const target = e.target.getAttribute('href');
      if (target && target !== '#') {
        scrollToElement(target);
      }
    }
  });
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
  // Monitor page load performance
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('📊 Performance Metrics:', {
            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
            fullyLoaded: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
          });
        }
      }, 0);
    });
  }

  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('⚠️ Long task detected:', {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime)
            });
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task monitoring not supported
    }
  }
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector
 */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    const offset = AppConfig.ui.scrollOffset;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for debugging
window.EroticaLifestyle = {
  version: '2.0.0',
  config: AppConfig,
  state: AppState,
  eventBus,
  modules: {
    productManager,
    cart,
    wishlist,
    notifications
  }
};
