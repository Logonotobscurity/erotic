/**
 * EROTICA LIFESTYLE - MAIN JAVASCRIPT
 * Modern e-commerce functionality and interactions
 */

// Global Application State
window.EroticaLifestyle = {
  isDiscreetMode: false,
  cartItems: [],
  wishlistItems: [],
  currentProducts: [],
  filters: {
    category: 'all',
    priceRange: [0, 100000],
    sortBy: 'name'
  }
};

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎉 Erotica Lifestyle - Modern UI loaded successfully');
    
  // Initialize all modules
  initializeApp();
    
  // Load products
  loadProducts();
    
  // Set up intersection observers for animations
  setupAnimations();
    
  // Initialize performance monitoring
  setupPerformanceMonitoring();
});

/**
 * Initialize all application modules
 */
function initializeApp() {
  // Check if modules exist before initializing
  if (typeof AgeGate !== 'undefined') {
    AgeGate.init();
  }
    
  if (typeof Navigation !== 'undefined') {
    Navigation.init();
  }
    
  if (typeof Cart !== 'undefined') {
    Cart.init();
  }
    
  if (typeof ProductFilter !== 'undefined') {
    ProductFilter.init();
  }
    
  if (typeof Forms !== 'undefined') {
    Forms.init();
  }
    
  if (typeof Notifications !== 'undefined') {
    Notifications.init();
  }
    
  // Initialize discreet mode
  setupDiscreetMode();
    
  // Initialize scroll effects
  setupScrollEffects();
    
  // Initialize keyboard shortcuts
  setupKeyboardShortcuts();
}

/**
 * Load products from data source
 */
async function loadProducts() {
  try {
    // First try to load from JSON file
    const response = await fetch('./data/products.json');
    if (response.ok) {
      const data = await response.json();
      window.EroticaLifestyle.currentProducts = data.products;
      renderProducts(data.products);
    } else {
      // Fallback to dummy data
      loadDummyProducts();
    }
  } catch (error) {
    console.log('Loading dummy products as fallback');
    loadDummyProducts();
  }
}

/**
 * Load dummy products for demonstration
 */
function loadDummyProducts() {
  const dummyProducts = [
    {
      id: 'luxury-rabbit',
      name: 'Luxury Rabbit Vibrator',
      description: 'Premium silicone dual stimulation with 10 vibration patterns',
      price: 45000,
      originalPrice: null,
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
      originalPrice: null,
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
      originalPrice: null,
      category: 'wellness',
      badge: 'Organic',
      badgeType: 'default',
      rating: 4.8,
      reviews: 203,
      icon: 'fas fa-leaf',
      inStock: true
    },
    {
      id: 'clitoral-stimulator',
      name: 'Clitoral Stimulator',
      description: 'Whisper-quiet suction technology with 11 intensity levels',
      price: 52800,
      originalPrice: null,
      category: 'vibrators',
      badge: '4.9★',
      badgeType: 'default',
      rating: 4.9,
      reviews: 156,
      icon: 'fas fa-star',
      inStock: true
    },
    {
      id: 'kegel-balls',
      name: 'Smart Kegel Balls',
      description: 'App-connected pelvic floor trainer with biofeedback',
      price: 38250,
      originalPrice: null,
      category: 'wellness',
      badge: 'Kegel',
      badgeType: 'default',
      rating: 4.6,
      reviews: 78,
      icon: 'fas fa-dumbbell',
      inStock: true
    },
    {
      id: 'care-kit',
      name: 'Luxury Care Kit',
      description: 'Complete cleaning & maintenance essentials bundle',
      price: 22400,
      originalPrice: null,
      category: 'accessories',
      badge: 'Bundle',
      badgeType: 'default',
      rating: 4.5,
      reviews: 92,
      icon: 'fas fa-box',
      inStock: true
    }
  ];
    
  window.EroticaLifestyle.currentProducts = dummyProducts;
  renderProducts(dummyProducts);
}

/**
 * Render products to the grid
 */
function renderProducts(products) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) {return;}
    
  productGrid.innerHTML = '';
    
  products.forEach(product => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
    
  // Re-initialize animations for new elements
  setupAnimations();
}

/**
 * Create a product card element
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-category', product.category);
    
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(product.price);
    
  // Create rating stars
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(product.rating);
    return `<i class="fas fa-star${filled ? '' : ' opacity-30'}"></i>`;
  }).join('');
    
  card.innerHTML = `
        <div class="product-image bg-gradient-to-br from-${getCategoryColor(product.category)}-100 to-${getCategoryColor(product.category)}-200">
            <i class="${product.icon} text-6xl opacity-50 text-${getCategoryColor(product.category)}-500"></i>
            <div class="product-badge">
                <span class="badge ${product.badgeType === 'primary' ? 'badge-primary' : product.badgeType === 'success' ? 'badge-success' : ''}">${product.badge}</span>
            </div>
            <button class="product-quickview" onclick="openQuickView('${product.id}')" title="Quick View">
                <i class="fas fa-eye"></i>
            </button>
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <div class="product-stars">
                    ${stars}
                </div>
                <span class="product-reviews">(${product.reviews} reviews)</span>
            </div>
            <div class="product-footer">
                <div class="product-price">${formattedPrice}</div>
                <div class="product-actions">
                    <button class="product-btn" onclick="addToCart('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="product-btn-wishlist" onclick="toggleWishlist('${product.id}')" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
  return card;
}

/**
 * Get category color for styling
 */
function getCategoryColor(category) {
  const colors = {
    vibrators: 'pink',
    couples: 'purple',
    wellness: 'green',
    accessories: 'gray'
  };
  return colors[category] || 'gray';
}

/**
 * Setup discreet mode functionality
 */
function setupDiscreetMode() {
  window.toggleDiscreetMode = function() {
    window.EroticaLifestyle.isDiscreetMode = !window.EroticaLifestyle.isDiscreetMode;
    const body = document.body;
    const icon = document.getElementById('discreteIcon');
        
    if (window.EroticaLifestyle.isDiscreetMode) {
      body.classList.add('discreet-mode');
      icon.className = 'fas fa-eye-slash text-xl';
      if (typeof Notifications !== 'undefined') {
        Notifications.show('Discreet mode enabled', 'success');
      }
    } else {
      body.classList.remove('discreet-mode');
      icon.className = 'fas fa-eye text-xl';
      if (typeof Notifications !== 'undefined') {
        Notifications.show('Discreet mode disabled', 'info');
      }
    }
        
    // Store preference
    localStorage.setItem('discreteMode', window.EroticaLifestyle.isDiscreetMode);
  };
    
  // Load saved preference
  const savedMode = localStorage.getItem('discreteMode');
  if (savedMode === 'true') {
    toggleDiscreetMode();
  }
}

/**
 * Add product to cart
 */
window.addToCart = function(productId) {
  const product = window.EroticaLifestyle.currentProducts.find(p => p.id === productId);
  if (!product) {return;}
    
  window.EroticaLifestyle.cartItems.push(productId);
    
  if (typeof Cart !== 'undefined') {
    Cart.updateBadge();
  } else {
    // Fallback update
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = window.EroticaLifestyle.cartItems.length;
      badge.style.animation = 'pulse 0.3s ease';
      setTimeout(() => badge.style.animation = '', 300);
    }
  }
    
  if (typeof Notifications !== 'undefined') {
    Notifications.show(`${product.name} added to cart!`, 'success');
  }
};

/**
 * Toggle wishlist item
 */
window.toggleWishlist = function(productId) {
  const index = window.EroticaLifestyle.wishlistItems.indexOf(productId);
  const button = event.target.closest('.product-btn-wishlist');
    
  if (index > -1) {
    window.EroticaLifestyle.wishlistItems.splice(index, 1);
    button.classList.remove('active');
    if (typeof Notifications !== 'undefined') {
      Notifications.show('Removed from wishlist', 'info');
    }
  } else {
    window.EroticaLifestyle.wishlistItems.push(productId);
    button.classList.add('active');
    if (typeof Notifications !== 'undefined') {
      Notifications.show('Added to wishlist', 'success');
    }
  }
    
  // Store wishlist
  localStorage.setItem('wishlist', JSON.stringify(window.EroticaLifestyle.wishlistItems));
};

/**
 * Open product quick view
 */
window.openQuickView = function(productId) {
  const product = window.EroticaLifestyle.currentProducts.find(p => p.id === productId);
  if (!product) {return;}
    
  // For now, just show a notification
  // This would normally open a modal with product details
  if (typeof Notifications !== 'undefined') {
    Notifications.show(`Quick view for ${product.name} - Feature coming soon!`, 'info');
  }
};

/**
 * Setup scroll effects
 */
function setupScrollEffects() {
  let lastScrollTop = 0;
  let ticking = false;
    
  function updateScrollEffects() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.getElementById('navbar');
        
    if (navbar) {
      // Add scrolled class for styling
      if (scrollTop > 100) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
            
      // Hide/show navbar on scroll (optional)
      if (Math.abs(scrollTop - lastScrollTop) > 5) {
        if (scrollTop > lastScrollTop && scrollTop > 200) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
      }
    }
        
    ticking = false;
  }
    
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Setup animations with Intersection Observer
 */
function setupAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
    
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
    
  // Observe elements that should animate
  const elementsToAnimate = document.querySelectorAll(
    '.product-card, .glass-card, .hero-content'
  );
    
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Escape key - close modals
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.active');
      modals.forEach(modal => modal.classList.remove('active'));
    }
        
    // D key - toggle discreet mode
    if (e.key === 'd' && e.ctrlKey) {
      e.preventDefault();
      toggleDiscreetMode();
    }
        
    // / key - focus search (if available)
    if (e.key === '/') {
      e.preventDefault();
      const searchInput = document.querySelector('.nav-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
  // Monitor page load performance
  window.addEventListener('load', function() {
    setTimeout(() => {
      if (performance.getEntriesByType) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          console.log('Page Load Performance:', {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            fullyLoaded: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
          });
        }
      }
    }, 0);
  });
    
  // Monitor resource loading
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) {
          console.warn('Slow resource detected:', entry.name, entry.duration + 'ms');
        }
      }
    });
        
    observer.observe({ entryTypes: ['resource'] });
  }
}

/**
 * Utility function to debounce function calls
 */
window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Utility function to throttle function calls
 */
window.throttle = function(func, limit) {
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
};

/**
 * Load more products functionality
 */
window.loadMoreProducts = function() {
  if (typeof Notifications !== 'undefined') {
    Notifications.show('Loading more products...', 'info');
  }
    
  // Simulate loading more products
  setTimeout(() => {
    const additionalProducts = [
      {
        id: 'rose-gold-wand',
        name: 'Rose Gold Wand Massager',
        description: 'Elegant powerful wand with luxury rose gold finish and 20 vibration patterns',
        price: 67500,
        category: 'vibrators',
        badge: 'Luxury',
        badgeType: 'warning',
        rating: 4.8,
        reviews: 64,
        icon: 'fas fa-magic',
        inStock: true
      },
      {
        id: 'intimate-serum',
        name: 'Intimate Wellness Serum',
        description: 'Natural sensitivity-enhancing serum with organic ingredients',
        price: 19800,
        category: 'wellness',
        badge: 'Natural',
        badgeType: 'success',
        rating: 4.4,
        reviews: 134,
        icon: 'fas fa-seedling',
        inStock: true
      }
    ];
        
    const productGrid = document.getElementById('productGrid');
    additionalProducts.forEach(product => {
      const productCard = createProductCard(product);
      productGrid.appendChild(productCard);
    });
        
    // Add to current products
    window.EroticaLifestyle.currentProducts.push(...additionalProducts);
        
    if (typeof Notifications !== 'undefined') {
      Notifications.show(`${additionalProducts.length} more products loaded!`, 'success');
    }
        
    // Re-initialize animations for new products
    setupAnimations();
        
  }, 1000);
};

/**
 * Blog functionality
 */

// Open blog post
window.openBlogPost = function(postId) {
  if (typeof Notifications !== 'undefined') {
    Notifications.show('Opening blog post...', 'info');
  }
    
  // For now, show a notification - this would normally navigate to the blog post
  setTimeout(() => {
    if (typeof Notifications !== 'undefined') {
      Notifications.show('Blog post feature coming soon! We\'re working on detailed wellness content.', 'info');
    }
  }, 500);
};

// Bookmark article
window.bookmarkArticle = function(articleId) {
  // Get saved bookmarks
  let bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
  const button = event.target.closest('.blog-bookmark');
    
  if (bookmarks.includes(articleId)) {
    // Remove bookmark
    bookmarks = bookmarks.filter(id => id !== articleId);
    button.classList.remove('bookmarked');
        
    if (typeof Notifications !== 'undefined') {
      Notifications.show('Bookmark removed', 'info');
    }
  } else {
    // Add bookmark
    bookmarks.push(articleId);
    button.classList.add('bookmarked');
        
    if (typeof Notifications !== 'undefined') {
      Notifications.show('Article bookmarked!', 'success');
    }
  }
    
  // Save bookmarks
  localStorage.setItem('blogBookmarks', JSON.stringify(bookmarks));
};

// Share article
window.shareArticle = function(articleId) {
  if (navigator.share) {
    // Use native sharing if available
    navigator.share({
      title: 'Erotica Lifestyle Wellness Article',
      text: 'Check out this wellness article from Erotica Lifestyle',
      url: window.location.href + '#' + articleId
    }).then(() => {
      if (typeof Notifications !== 'undefined') {
        Notifications.show('Article shared successfully!', 'success');
      }
    }).catch(() => {
      fallbackShare(articleId);
    });
  } else {
    fallbackShare(articleId);
  }
};

// Fallback sharing function
function fallbackShare(articleId) {
  const url = window.location.href + '#' + articleId;
    
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      if (typeof Notifications !== 'undefined') {
        Notifications.show('Article link copied to clipboard!', 'success');
      }
    }).catch(() => {
      showShareOptions(articleId);
    });
  } else {
    showShareOptions(articleId);
  }
}

// Show share options
function showShareOptions(articleId) {
  const shareText = `Check out this wellness article from Erotica Lifestyle: ${window.location.href}#${articleId}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(window.location.href + '#' + articleId);
    
  // Create temporary share menu
  const shareMenu = document.createElement('div');
  shareMenu.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); z-index: 1000; max-width: 300px;">
            <h3 style="margin-bottom: 16px; color: #2E1037; font-family: 'Playfair Display', serif;">Share Article</h3>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;">
                <a href="https://twitter.com/intent/tweet?text=${encodedText}" target="_blank" style="padding: 8px 16px; background: #1DA1F2; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">Twitter</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" style="padding: 8px 16px; background: #4267B2; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">Facebook</a>
                <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" style="padding: 8px 16px; background: #25D366; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">WhatsApp</a>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="padding: 8px 16px; background: #E6007E; color: white; border: none; border-radius: 6px; cursor: pointer; width: 100%;">Close</button>
        </div>
        <div onclick="this.remove()" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999;"></div>
    `;
    
  document.body.appendChild(shareMenu);
}

// Initialize blog bookmarks on page load
function initializeBlogBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
    
  bookmarks.forEach(articleId => {
    const bookmarkButton = document.querySelector(`[onclick="bookmarkArticle('${articleId}')"]`);
    if (bookmarkButton) {
      bookmarkButton.classList.add('bookmarked');
    }
  });
}

// Initialize blog features when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeBlogBookmarks);
} else {
  initializeBlogBookmarks();
}

/**
 * Partners functionality
 */

// Open partner application form
window.openPartnerForm = function(partnerType) {
  if (typeof Notifications !== 'undefined') {
    Notifications.show('Opening partnership application...', 'info');
  }
    
  const partnerTitles = {
    manufacturer: 'Manufacturing Partner Application',
    distributor: 'Distribution Partner Application',
    retailer: 'Retail Partner Application',
    technology: 'Technology Partner Application'
  };
    
  const partnerEmails = {
    manufacturer: 'manufacturers@eroticalifestyle.com',
    distributor: 'logistics@eroticalifestyle.com',
    retailer: 'retail@eroticalifestyle.com',
    technology: 'tech@eroticalifestyle.com'
  };
    
  // Create application form modal
  const formModal = document.createElement('div');
  formModal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="this.remove()">
            <div style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); max-width: 600px; width: 100%; max-height: 80vh; overflow-y: auto;" onclick="event.stopPropagation()">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #2E1037; font-family: 'Playfair Display', serif; font-size: 1.75rem; margin-bottom: 8px;">${partnerTitles[partnerType]}</h2>
                    <p style="color: #535353; font-size: 0.875rem;">Join Africa's premier wellness ecosystem</p>
                </div>
                
                <form id="partnerForm" style="space-y: 16px;">
                    <div style="margin-bottom: 16px;">
                        <input type="text" name="companyName" placeholder="Company Name" required style="width: 100%; padding: 12px 16px; border: 2px solid #EBE3D6; border-radius: 8px; font-size: 0.875rem; transition: border-color 0.3s;" onfocus="this.style.borderColor='#E6007E'" onblur="this.style.borderColor='#EBE3D6'">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <input type="text" name="contactName" placeholder="Contact Person" required style="width: 100%; padding: 12px 16px; border: 2px solid #EBE3D6; border-radius: 8px; font-size: 0.875rem; transition: border-color 0.3s;" onfocus="this.style.borderColor='#E6007E'" onblur="this.style.borderColor='#EBE3D6'">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <input type="email" name="email" placeholder="Email Address" required style="padding: 12px 16px; border: 2px solid #EBE3D6; border-radius: 8px; font-size: 0.875rem; transition: border-color 0.3s;" onfocus="this.style.borderColor='#E6007E'" onblur="this.style.borderColor='#EBE3D6'">
                        <input type="tel" name="phone" placeholder="Phone Number" required style="padding: 12px 16px; border: 2px solid #EBE3D6; border-radius: 8px; font-size: 0.875rem; transition: border-color 0.3s;" onfocus="this.style.borderColor='#E6007E'" onblur="this.style.borderColor='#EBE3D6'">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <input type="text" name="location" placeholder="Company Location" required style="width: 100%; padding: 12px 16px; border: 2px solid #EBE3D6; border-radius: 8px; font-size: 0.875rem; transition: border-color 0.3s;" onfocus="this.style.borderColor='#E6007E'" onblur="this.style.borderColor='#EBE3D6'">
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <textarea name="experience" placeholder="Tell us about your company and relevant experience..." rows="4" required style="width: 100%; padding: 12px 16px; border: 2px solid #EBE3D6; border-radius: 8px; font-size: 0.875rem; transition: border-color 0.3s; resize: vertical;" onfocus="this.style.borderColor='#E6007E'" onblur="this.style.borderColor='#EBE3D6'"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 24px;">
                        <textarea name="proposal" placeholder="What specific partnership opportunities are you interested in?" rows="3" required style="width: 100%; padding: 12px 16px; border: 2px solid #EBE3D6; border-radius: 8px; font-size: 0.875rem; transition: border-color 0.3s; resize: vertical;" onfocus="this.style.borderColor='#E6007E'" onblur="this.style.borderColor='#EBE3D6'"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 12px;">
                        <button type="submit" style="flex: 1; padding: 12px 24px; background: linear-gradient(135deg, #E6007E, #C5006B); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            <i class="fas fa-paper-plane" style="margin-right: 8px;"></i>
                            Submit Application
                        </button>
                        <button type="button" onclick="this.closest('div[style*="position: fixed"]').remove()" style="padding: 12px 24px; background: transparent; color: #2E1037; border: 2px solid #2E1037; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.backgroundColor='#2E1037'; this.style.color='white'" onmouseout="this.style.backgroundColor='transparent'; this.style.color='#2E1037'">
                            Cancel
                        </button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #EBE3D6;">
                        <p style="font-size: 0.75rem; color: #535353;">Direct contact: <a href="mailto:${partnerEmails[partnerType]}" style="color: #E6007E; text-decoration: none;">${partnerEmails[partnerType]}</a></p>
                    </div>
                </form>
            </div>
        </div>
    `;
    
  // Add form submission handler
  const form = formModal.querySelector('#partnerForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
        
    if (typeof Notifications !== 'undefined') {
      Notifications.show('Partnership application submitted! We\'ll contact you within 48 hours.', 'success');
    }
        
    // Simulate form submission
    setTimeout(() => {
      formModal.remove();
    }, 1500);
        
    // In a real application, you would send this data to your server
    const formData = new FormData(form);
    const applicationData = {
      partnerType,
      companyName: formData.get('companyName'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      experience: formData.get('experience'),
      proposal: formData.get('proposal'),
      timestamp: new Date().toISOString()
    };
        
    console.log('Partner Application:', applicationData);
  });
    
  document.body.appendChild(formModal);
    
  // Focus first input
  setTimeout(() => {
    const firstInput = formModal.querySelector('input[name="companyName"]');
    if (firstInput) {firstInput.focus();}
  }, 100);
};
