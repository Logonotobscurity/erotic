/**
 * Discrete Mode Module
 * Handles discrete mode functionality for privacy
 */

import { AppConfig } from '../config/app-config.js';
import { eventBus } from '../core/event-bus.js';
import { getFromStorage, saveToStorage } from '../utils/helpers.js';

class DiscreteMode {
  constructor() {
    this.isEnabled = false;
    this.storageKey = AppConfig.storage.discreteMode;
    this.toggleButton = null;
    this.icon = null;
  }

  /**
   * Initialize discrete mode
   */
  init() {
    this.loadPreference();
    this.bindEvents();
    this.updateUI();
    console.log('👁️ Discrete Mode initialized');
  }

  /**
   * Bind events
   */
  bindEvents() {
    // Listen for toggle button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="toggle-discrete"]') || 
          e.target.closest('[data-action="toggle-discrete"]')) {
        this.toggle();
      }
    });

    // Listen for keyboard shortcut (Ctrl+D)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        this.toggle();
      }
    });

    // Listen for visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (this.isEnabled && document.hidden) {
        this.applyEmergencyMode();
      }
    });
  }

  /**
   * Load saved preference
   */
  loadPreference() {
    this.isEnabled = getFromStorage(this.storageKey, false);
    if (this.isEnabled) {
      this.enable(false);
    }
  }

  /**
   * Toggle discrete mode
   */
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Enable discrete mode
   * @param {boolean} showNotification - Show notification
   */
  enable(showNotification = true) {
    this.isEnabled = true;
    document.body.classList.add('discrete-mode');
    
    // Update page title
    this.originalTitle = document.title;
    document.title = 'Shopping - Online Store';
    
    // Update favicon
    this.updateFavicon('/assets/icons/discrete-favicon.ico');
    
    saveToStorage(this.storageKey, true);
    this.updateUI();
    
    if (showNotification) {
      eventBus.emit('notification:show', {
        message: 'Discrete mode enabled',
        type: 'success'
      });
    }
    
    eventBus.emit('discrete:enabled');
  }

  /**
   * Disable discrete mode
   */
  disable() {
    this.isEnabled = false;
    document.body.classList.remove('discrete-mode');
    
    // Restore original title
    if (this.originalTitle) {
      document.title = this.originalTitle;
    }
    
    // Restore original favicon
    this.updateFavicon('/assets/icons/favicon.ico');
    
    saveToStorage(this.storageKey, false);
    this.updateUI();
    
    eventBus.emit('notification:show', {
      message: 'Discrete mode disabled',
      type: 'info'
    });
    
    eventBus.emit('discrete:disabled');
  }

  /**
   * Apply emergency mode (quick hide)
   */
  applyEmergencyMode() {
    if (!this.emergencyOverlay) {
      this.emergencyOverlay = document.createElement('div');
      this.emergencyOverlay.className = 'emergency-overlay';
      this.emergencyOverlay.innerHTML = `
        <div class="emergency-content">
          <h1>Shopping Cart</h1>
          <p>Your session has been paused.</p>
          <button onclick="discreteMode.removeEmergencyMode()">Resume</button>
        </div>
      `;
    }
    
    document.body.appendChild(this.emergencyOverlay);
  }

  /**
   * Remove emergency mode
   */
  removeEmergencyMode() {
    if (this.emergencyOverlay && this.emergencyOverlay.parentNode) {
      this.emergencyOverlay.remove();
    }
  }

  /**
   * Update favicon
   * @param {string} href - Favicon URL
   */
  updateFavicon(href) {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  /**
   * Update UI elements
   */
  updateUI() {
    // Update toggle button
    this.toggleButton = this.toggleButton || document.querySelector('[data-action="toggle-discrete"]');
    this.icon = this.icon || document.getElementById('discreteIcon');
    
    if (this.icon) {
      this.icon.className = this.isEnabled 
        ? 'fas fa-eye-slash text-xl' 
        : 'fas fa-eye text-xl';
    }
    
    if (this.toggleButton) {
      this.toggleButton.setAttribute('title', 
        this.isEnabled ? 'Disable Discrete Mode' : 'Enable Discrete Mode'
      );
    }
  }

  /**
   * Check if discrete mode is enabled
   * @returns {boolean} Is enabled
   */
  isActive() {
    return this.isEnabled;
  }
}

// Export singleton instance
export const discreteMode = new DiscreteMode();
