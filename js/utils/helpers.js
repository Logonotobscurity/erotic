/**
 * Utility Helper Functions
 * Common utilities used throughout the application
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: NGN)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
}

/**
 * Get category color for styling
 * @param {string} category - Product category
 * @returns {string} Color name
 */
export function getCategoryColor(category) {
  const colors = {
    vibrators: 'pink',
    couples: 'purple',
    wellness: 'green',
    accessories: 'gray'
  };
  return colors[category] || 'gray';
}

/**
 * Create rating stars HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string of stars
 */
export function createRatingStars(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    return `<i class="fas fa-star${filled ? '' : ' opacity-30'}"></i>`;
  }).join('');
}

/**
 * Safe localStorage access
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Stored value or default
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safe localStorage write
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error writing to localStorage:`, error);
    return false;
  }
}

/**
 * Generate unique ID
 * @returns {string} Unique identifier
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Is in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 * @param {string} selector - CSS selector
 * @param {number} offset - Offset from top (default: 80)
 */
export function scrollToElement(selector, offset = 80) {
  const element = document.querySelector(selector);
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
