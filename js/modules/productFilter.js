/**
 * Product Filter Module
 * Handles product filtering, searching, and sorting functionality
 */

class ProductFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.productGrid = document.getElementById('productGrid');
    this.products = [];
    this.currentFilter = 'all';
    this.currentSort = 'default';
    this.searchTerm = '';
    
    this.init();
  }

  init() {
    this.loadProducts();
    this.bindEvents();
    console.log('🔍 Product Filter initialized');
  }

  bindEvents() {
    // Filter button clicks
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const category = button.getAttribute('data-category');
        this.setActiveFilter(button);
        this.filterProducts(category);
      });
    });

    // Search functionality
    const searchInput = document.querySelector('[data-search="products"]');
    if (searchInput) {
      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchProducts(e.target.value);
        }, 300);
      });
    }

    // Sort functionality
    const sortSelect = document.querySelector('[data-sort="products"]');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortProducts(e.target.value);
      });
    }

    // Load more products
    const loadMoreBtn = document.querySelector('[data-action="load-more"]');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreProducts();
      });
    }
  }

  // Load products from DOM
  loadProducts() {
    if (!this.productGrid) {return;}

    const productCards = this.productGrid.querySelectorAll('.product-card');
    this.products = Array.from(productCards).map(card => {
      return {
        element: card,
        id: this.extractProductId(card),
        name: this.extractProductName(card),
        price: this.extractProductPrice(card),
        category: card.getAttribute('data-category') || 'all',
        rating: this.extractProductRating(card),
        badge: this.extractProductBadge(card),
        visible: true
      };
    });
  }

  // Extract product information from card elements
  extractProductId(card) {
    const addButton = card.querySelector('[onclick*="addToCart"]');
    if (addButton) {
      const onclick = addButton.getAttribute('onclick');
      const match = onclick.match(/addToCart\(['"]([^'"]+)['"]\)/);
      return match ? match[1] : null;
    }
    return null;
  }

  extractProductName(card) {
    const titleElement = card.querySelector('.product-title, h3');
    return titleElement ? titleElement.textContent.trim() : '';
  }

  extractProductPrice(card) {
    const priceElement = card.querySelector('.product-price');
    if (priceElement) {
      const priceText = priceElement.textContent.trim();
      const match = priceText.match(/₦([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
    }
    return 0;
  }

  extractProductRating(card) {
    const starsContainer = card.querySelector('.product-stars');
    if (starsContainer) {
      const fullStars = starsContainer.querySelectorAll('.fas.fa-star').length;
      const halfStars = starsContainer.querySelectorAll('.fas.fa-star-half-alt').length;
      return fullStars + (halfStars * 0.5);
    }
    return 0;
  }

  extractProductBadge(card) {
    const badgeElement = card.querySelector('.badge');
    return badgeElement ? badgeElement.textContent.trim().toLowerCase() : '';
  }

  // Set active filter button
  setActiveFilter(activeButton) {
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }

  // Filter products by category
  filterProducts(category) {
    this.currentFilter = category;
    this.applyFilters();
  }

  // Search products by name
  searchProducts(term) {
    this.searchTerm = term.toLowerCase().trim();
    this.applyFilters();
  }

  // Sort products
  sortProducts(sortBy) {
    this.currentSort = sortBy;
    
    const sortedProducts = [...this.products];

    switch (sortBy) {
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => {
          const aIsNew = a.badge === 'new';
          const bIsNew = b.badge === 'new';
          if (aIsNew && !bIsNew) {return -1;}
          if (!aIsNew && bIsNew) {return 1;}
          return 0;
        });
        break;
      case 'bestseller':
        sortedProducts.sort((a, b) => {
          const aIsBest = a.badge === 'bestseller';
          const bIsBest = b.badge === 'bestseller';
          if (aIsBest && !bIsBest) {return -1;}
          if (!aIsBest && bIsBest) {return 1;}
          return 0;
        });
        break;
    }

    this.reorderProducts(sortedProducts);
  }

  // Apply current filters and search
  applyFilters() {
    let visibleCount = 0;

    this.products.forEach(product => {
      let isVisible = true;

      // Apply category filter
      if (this.currentFilter !== 'all' && product.category !== this.currentFilter) {
        isVisible = false;
      }

      // Apply search filter
      if (this.searchTerm && !product.name.toLowerCase().includes(this.searchTerm)) {
        isVisible = false;
      }

      // Update visibility
      product.visible = isVisible;
      
      if (isVisible) {
        visibleCount++;
        product.element.style.display = 'block';
        product.element.classList.add('animate-fadeIn');
      } else {
        product.element.style.display = 'none';
        product.element.classList.remove('animate-fadeIn');
      }
    });

    // Update results count
    this.updateResultsCount(visibleCount);

    // Show no results message if needed
    this.toggleNoResultsMessage(visibleCount === 0);
  }

  // Reorder products in the DOM
  reorderProducts(sortedProducts) {
    if (!this.productGrid) {return;}

    sortedProducts.forEach(product => {
      this.productGrid.appendChild(product.element);
    });

    // Update the products array order
    this.products = sortedProducts;
  }

  // Update results count display
  updateResultsCount(count) {
    const resultsCount = document.querySelector('[data-results-count]');
    if (resultsCount) {
      const totalProducts = this.products.length;
      resultsCount.textContent = `Showing ${count} of ${totalProducts} products`;
    }
  }

  // Toggle no results message
  toggleNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (show && !noResultsMsg) {
      // Create no results message
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results-message text-center py-12';
      noResultsMsg.innerHTML = `
        <div class="text-6xl mb-4 text-plum-300">🔍</div>
        <h3 class="text-2xl font-display font-bold text-plum-700 mb-2">No Products Found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
        <button onclick="resetFilters()" class="btn btn-primary">
          <i class="fas fa-refresh"></i>
          Reset Filters
        </button>
      `;
      
      if (this.productGrid) {
        this.productGrid.parentNode.insertBefore(noResultsMsg, this.productGrid.nextSibling);
      }
    } else if (!show && noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // Reset all filters
  resetFilters() {
    this.currentFilter = 'all';
    this.currentSort = 'default';
    this.searchTerm = '';

    // Reset UI elements
    const searchInput = document.querySelector('[data-search="products"]');
    if (searchInput) {searchInput.value = '';}

    const sortSelect = document.querySelector('[data-sort="products"]');
    if (sortSelect) {sortSelect.value = 'default';}

    // Reset filter buttons
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-category') === 'all') {
        btn.classList.add('active');
      }
    });

    // Apply filters
    this.applyFilters();
  }

  // Load more products (for pagination)
  loadMoreProducts() {
    // This would typically load more products from an API
    // For now, we'll just show a loading state
    const loadMoreBtn = document.querySelector('[data-action="load-more"]');
    if (loadMoreBtn) {
      const originalText = loadMoreBtn.innerHTML;
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      loadMoreBtn.disabled = true;

      // Simulate loading delay
      setTimeout(() => {
        loadMoreBtn.innerHTML = originalText;
        loadMoreBtn.disabled = false;
        
        // In a real app, you would append new products here
        console.log('Load more products functionality would be implemented here');
      }, 2000);
    }
  }

  // Get filtered products
  getFilteredProducts() {
    return this.products.filter(product => product.visible);
  }

  // Get products by category
  getProductsByCategory(category) {
    return this.products.filter(product => 
      category === 'all' ? true : product.category === category
    );
  }

  // Advanced filtering
  filterByPriceRange(minPrice, maxPrice) {
    this.products.forEach(product => {
      const inPriceRange = product.price >= minPrice && product.price <= maxPrice;
      const currentlyVisible = product.visible;
      
      product.visible = currentlyVisible && inPriceRange;
      
      if (product.visible) {
        product.element.style.display = 'block';
      } else {
        product.element.style.display = 'none';
      }
    });

    const visibleCount = this.products.filter(p => p.visible).length;
    this.updateResultsCount(visibleCount);
    this.toggleNoResultsMessage(visibleCount === 0);
  }

  // Filter by rating
  filterByRating(minRating) {
    this.products.forEach(product => {
      const meetsRating = product.rating >= minRating;
      const currentlyVisible = product.visible;
      
      product.visible = currentlyVisible && meetsRating;
      
      if (product.visible) {
        product.element.style.display = 'block';
      } else {
        product.element.style.display = 'none';
      }
    });

    const visibleCount = this.products.filter(p => p.visible).length;
    this.updateResultsCount(visibleCount);
    this.toggleNoResultsMessage(visibleCount === 0);
  }

  // Get current filter state
  getFilterState() {
    return {
      category: this.currentFilter,
      sort: this.currentSort,
      search: this.searchTerm,
      visibleCount: this.products.filter(p => p.visible).length,
      totalCount: this.products.length
    };
  }
}

// Global functions for backward compatibility
window.filterProducts = function(category) {
  if (window.productFilter) {
    return window.productFilter.filterProducts(category);
  }
};

window.resetFilters = function() {
  if (window.productFilter) {
    return window.productFilter.resetFilters();
  }
};

window.loadMoreProducts = function() {
  if (window.productFilter) {
    return window.productFilter.loadMoreProducts();
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.productFilter = new ProductFilter();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductFilter;
}
