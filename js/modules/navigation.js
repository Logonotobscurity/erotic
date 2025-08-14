/**
 * Navigation Module
 * Handles navigation interactions, mobile menu, and discreet mode
 */

class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.menuButton = document.querySelector('[data-action="toggle-menu"]');
    this.discreteButton = document.querySelector('[data-action="toggle-discreet"]');
    this.discreteIcon = document.getElementById('discreteIcon');
    this.isMenuOpen = false;
    this.isDiscreetMode = this.loadDiscreetMode();
    this.scrollPosition = 0;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.initDiscreetMode();
    this.initScrollBehavior();
    console.log('🧭 Navigation initialized');
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.menuButton) {
      this.menuButton.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Discreet mode toggle
    if (this.discreteButton) {
      this.discreteButton.addEventListener('click', () => {
        this.toggleDiscreetMode();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !e.target.closest('.nav') && !e.target.closest('[data-action="toggle-menu"]')) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const href = link.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          e.preventDefault();
          this.smoothScrollTo(href);
          if (this.isMenuOpen) {
            this.closeMobileMenu();
          }
        }
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Scroll event for navbar styling
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
  }

  // Mobile menu functionality
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    document.body.classList.add('menu-open');
    
    if (this.menuButton) {
      this.menuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
      this.menuButton.setAttribute('aria-expanded', 'true');
      this.menuButton.setAttribute('aria-label', 'Close menu');
    }

    // Create mobile menu if it doesn't exist
    this.createMobileMenu();
    
    // Dispatch custom event
    this.dispatchNavEvent('navigation:menu-opened');
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-open');
    
    if (this.menuButton) {
      this.menuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
      this.menuButton.setAttribute('aria-expanded', 'false');
      this.menuButton.setAttribute('aria-label', 'Open menu');
    }

    // Remove mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.add('animate-fadeOut');
      setTimeout(() => {
        if (mobileMenu.parentNode) {
          mobileMenu.parentNode.removeChild(mobileMenu);
        }
      }, 300);
    }
    
    // Dispatch custom event
    this.dispatchNavEvent('navigation:menu-closed');
  }

  createMobileMenu() {
    // Remove existing mobile menu
    const existingMenu = document.querySelector('.mobile-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu fixed top-0 left-0 w-full h-full bg-white/95 backdrop-blur-lg z-50 animate-fadeIn';
    
    mobileMenu.innerHTML = `
      <div class="container py-8 mt-16">
        <nav class="mobile-nav">
          <ul class="space-y-6">
            <li>
              <a href="#shop" class="mobile-nav-link">
                <i class="fas fa-shopping-bag"></i>
                Shop Products
              </a>
            </li>
            <li>
              <a href="#story" class="mobile-nav-link">
                <i class="fas fa-heart"></i>
                Our Story
              </a>
            </li>
            <li>
              <a href="#blog" class="mobile-nav-link">
                <i class="fas fa-book"></i>
                Wellness Blog
              </a>
            </li>
            <li>
              <a href="#partners" class="mobile-nav-link">
                <i class="fas fa-handshake"></i>
                Partners
              </a>
            </li>
            <li>
              <a href="#contact" class="mobile-nav-link">
                <i class="fas fa-envelope"></i>
                Contact
              </a>
            </li>
            <li>
              <a href="./pages/catalog.html" class="mobile-nav-link">
                <i class="fas fa-th-large"></i>
                Full Catalog
              </a>
            </li>
            <li>
              <a href="./pages/quiz.html" class="mobile-nav-link">
                <i class="fas fa-clipboard-list"></i>
                Take Quiz
              </a>
            </li>
          </ul>
          
          <div class="mobile-nav-footer mt-12 pt-8 border-t border-plum-100">
            <div class="flex items-center justify-center gap-4 mb-6">
              <button onclick="toggleDiscreetMode()" class="mobile-nav-button">
                <i class="fas fa-eye" id="mobileDiscreteIcon"></i>
                <span>Discreet Mode</span>
              </button>
            </div>
            
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-4">Follow Us</p>
              <div class="flex justify-center gap-4">
                <a href="#" class="w-10 h-10 bg-magenta rounded-full flex items-center justify-center text-white">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-magenta rounded-full flex items-center justify-center text-white">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="w-10 h-10 bg-magenta rounded-full flex items-center justify-center text-white">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    `;

    // Add CSS for mobile menu
    const style = document.createElement('style');
    style.textContent = `
      .mobile-nav-link {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        color: var(--plum-900);
        font-size: 1.125rem;
        font-weight: 500;
        text-decoration: none;
        border-radius: 12px;
        transition: all 0.2s ease;
      }
      
      .mobile-nav-link:hover {
        background: var(--plum-50);
        color: var(--magenta-600);
        transform: translateX(8px);
      }
      
      .mobile-nav-link i {
        width: 20px;
        text-align: center;
        color: var(--magenta-500);
      }
      
      .mobile-nav-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: var(--plum-50);
        color: var(--plum-700);
        border: none;
        border-radius: 12px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .mobile-nav-button:hover {
        background: var(--magenta-100);
        color: var(--magenta-700);
      }
      
      .mobile-nav-footer {
        border-color: var(--plum-100);
      }
    `;
    
    if (!document.querySelector('#mobile-menu-styles')) {
      style.id = 'mobile-menu-styles';
      document.head.appendChild(style);
    }

    document.body.appendChild(mobileMenu);
    
    // Update mobile discreet mode icon
    this.updateMobileDiscreetIcon();
  }

  // Discreet mode functionality
  toggleDiscreetMode() {
    this.isDiscreetMode = !this.isDiscreetMode;
    this.saveDiscreetMode();
    this.updateDiscreetMode();
    
    // Dispatch custom event
    this.dispatchNavEvent('navigation:discreet-mode-changed', {
      isDiscreetMode: this.isDiscreetMode
    });
  }

  initDiscreetMode() {
    this.updateDiscreetMode();
  }

  updateDiscreetMode() {
    document.body.classList.toggle('discreet-mode', this.isDiscreetMode);
    
    if (this.discreteIcon) {
      this.discreteIcon.className = this.isDiscreetMode 
        ? 'fas fa-eye-slash text-xl' 
        : 'fas fa-eye text-xl';
    }
    
    this.updateMobileDiscreetIcon();
    
    // Update button title
    if (this.discreteButton) {
      this.discreteButton.setAttribute('title', 
        this.isDiscreetMode ? 'Disable Discreet Mode' : 'Enable Discreet Mode'
      );
    }
  }

  updateMobileDiscreetIcon() {
    const mobileIcon = document.getElementById('mobileDiscreteIcon');
    if (mobileIcon) {
      mobileIcon.className = this.isDiscreetMode 
        ? 'fas fa-eye-slash' 
        : 'fas fa-eye';
    }
  }

  loadDiscreetMode() {
    try {
      const saved = localStorage.getItem('erotica_discreet_mode');
      return saved === 'true';
    } catch (error) {
      console.warn('Error loading discreet mode from localStorage:', error);
      return false;
    }
  }

  saveDiscreetMode() {
    try {
      localStorage.setItem('erotica_discreet_mode', this.isDiscreetMode.toString());
    } catch (error) {
      console.warn('Error saving discreet mode to localStorage:', error);
    }
  }

  // Scroll behavior
  initScrollBehavior() {
    this.handleScroll();
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (this.navbar) {
      // Add background when scrolled
      if (currentScrollY > 50) {
        this.navbar.classList.add('nav-scrolled');
      } else {
        this.navbar.classList.remove('nav-scrolled');
      }
      
      // Hide/show navbar on scroll (optional)
      if (currentScrollY > 100) {
        if (currentScrollY > this.scrollPosition) {
          // Scrolling down
          this.navbar.classList.add('nav-hidden');
        } else {
          // Scrolling up
          this.navbar.classList.remove('nav-hidden');
        }
      }
    }
    
    this.scrollPosition = currentScrollY;
  }

  // Smooth scrolling
  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerOffset = this.navbar ? this.navbar.offsetHeight + 20 : 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Dispatch navigation events
  dispatchNavEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: {
        isMenuOpen: this.isMenuOpen,
        isDiscreetMode: this.isDiscreetMode,
        ...detail
      }
    });
    document.dispatchEvent(event);
  }

  // Public API methods
  getNavigationState() {
    return {
      isMenuOpen: this.isMenuOpen,
      isDiscreetMode: this.isDiscreetMode,
      scrollPosition: this.scrollPosition
    };
  }

  setDiscreetMode(enabled) {
    if (this.isDiscreetMode !== enabled) {
      this.toggleDiscreetMode();
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Global functions for backward compatibility
window.toggleMenu = function() {
  if (window.navigation) {
    return window.navigation.toggleMobileMenu();
  }
};

window.toggleDiscreetMode = function() {
  if (window.navigation) {
    return window.navigation.toggleDiscreetMode();
  }
};

window.scrollToSection = function(target) {
  if (window.navigation) {
    return window.navigation.smoothScrollTo(target);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.navigation = new Navigation();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
