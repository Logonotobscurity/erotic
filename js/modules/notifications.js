/**
 * Notification Manager Module
 * Handles toast notifications, alerts, and user feedback
 */

class NotificationManager {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.init();
  }

  init() {
    this.createContainer();
    console.log('🔔 Notifications initialized');
  }

  createContainer() {
    if (this.container) {return;}

    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none';
    
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', options = {}) {
    const notification = this.createNotification(message, type, options);
    this.notifications.push(notification);
    
    // Add to DOM
    this.container.appendChild(notification.element);
    
    // Trigger animation
    setTimeout(() => {
      notification.element.classList.add('show');
    }, 10);

    // Auto dismiss
    if (options.autoDismiss !== false) {
      const duration = options.duration || this.getDefaultDuration(type);
      setTimeout(() => {
        this.dismiss(notification.id);
      }, duration);
    }

    return notification.id;
  }

  createNotification(message, type, options) {
    const id = 'notification-' + Date.now() + Math.random().toString(36).substr(2, 9);
    
    const element = document.createElement('div');
    element.id = id;
    element.className = `notification notification-${type} transform translate-x-full opacity-0 transition-all duration-300 ease-out pointer-events-auto`;
    
    const config = this.getTypeConfig(type);
    
    element.innerHTML = `
      <div class="bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border-l-4 ${config.borderColor} p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0 ${config.iconColor} text-xl">
            <i class="${config.icon}"></i>
          </div>
          <div class="ml-3 flex-1">
            <div class="text-sm font-medium text-gray-900">
              ${message}
            </div>
            ${options.description ? `
              <div class="text-xs text-gray-600 mt-1">
                ${options.description}
              </div>
            ` : ''}
          </div>
          ${options.closeable !== false ? `
            <div class="ml-4 flex-shrink-0">
              <button onclick="window.NotificationManager.dismiss('${id}')" 
                      class="text-gray-400 hover:text-gray-600 transition-colors">
                <i class="fas fa-times"></i>
              </button>
            </div>
          ` : ''}
        </div>
        
        ${options.actions && options.actions.length > 0 ? `
          <div class="mt-3 flex gap-2">
            ${options.actions.map(action => `
              <button onclick="${action.handler}" 
                      class="btn-sm ${action.class || 'btn-secondary'}">
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
        
        ${options.showProgress ? `
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-1">
              <div class="bg-${config.color} h-1 rounded-full notification-progress" 
                   style="width: 100%; transition: width ${options.duration || this.getDefaultDuration(type)}ms linear;"></div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Add CSS classes for show state
    const showClasses = 'translate-x-0 opacity-100';
    element.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform' && !element.classList.contains('show')) {
        // Animation complete, remove from DOM
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        
        // Remove from notifications array
        this.notifications = this.notifications.filter(n => n.id !== id);
      }
    });

    // Start progress bar animation if enabled
    if (options.showProgress) {
      setTimeout(() => {
        const progressBar = element.querySelector('.notification-progress');
        if (progressBar) {
          progressBar.style.width = '0%';
        }
      }, 100);
    }

    const notification = {
      id,
      element,
      type,
      message,
      options,
      createdAt: new Date()
    };

    // Add show class definition
    element.classList.add = (function(originalAdd) {
      return function(className) {
        originalAdd.call(this, className);
        if (className === 'show') {
          this.classList.remove('translate-x-full', 'opacity-0');
          this.classList.add('translate-x-0', 'opacity-100');
        }
      };
    })(element.classList.add);

    return notification;
  }

  getTypeConfig(type) {
    const configs = {
      success: {
        icon: 'fas fa-check-circle',
        iconColor: 'text-green-500',
        borderColor: 'border-green-500',
        color: 'green-500'
      },
      error: {
        icon: 'fas fa-exclamation-circle',
        iconColor: 'text-red-500',
        borderColor: 'border-red-500',
        color: 'red-500'
      },
      warning: {
        icon: 'fas fa-exclamation-triangle',
        iconColor: 'text-yellow-500',
        borderColor: 'border-yellow-500',
        color: 'yellow-500'
      },
      info: {
        icon: 'fas fa-info-circle',
        iconColor: 'text-blue-500',
        borderColor: 'border-blue-500',
        color: 'blue-500'
      },
      loading: {
        icon: 'fas fa-spinner fa-spin',
        iconColor: 'text-purple-500',
        borderColor: 'border-purple-500',
        color: 'purple-500'
      }
    };

    return configs[type] || configs.info;
  }

  getDefaultDuration(type) {
    const durations = {
      success: 3000,
      error: 5000,
      warning: 4000,
      info: 3000,
      loading: 0 // Don't auto-dismiss loading notifications
    };

    return durations[type] || 3000;
  }

  dismiss(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) {return false;}

    // Trigger exit animation
    notification.element.classList.remove('translate-x-0', 'opacity-100');
    notification.element.classList.add('translate-x-full', 'opacity-0');

    return true;
  }

  dismissAll() {
    this.notifications.forEach(notification => {
      this.dismiss(notification.id);
    });
  }

  dismissByType(type) {
    this.notifications
      .filter(n => n.type === type)
      .forEach(notification => {
        this.dismiss(notification.id);
      });
  }

  // Convenience methods
  success(message, options = {}) {
    return this.show(message, 'success', options);
  }

  error(message, options = {}) {
    return this.show(message, 'error', options);
  }

  warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  loading(message, options = {}) {
    return this.show(message, 'loading', { 
      autoDismiss: false, 
      closeable: false,
      ...options 
    });
  }

  // Update an existing notification
  update(id, message, type = null, options = {}) {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) {return false;}

    // Update message
    const messageElement = notification.element.querySelector('.text-sm.font-medium');
    if (messageElement) {
      messageElement.textContent = message;
    }

    // Update description if provided
    if (options.description) {
      let descElement = notification.element.querySelector('.text-xs.text-gray-600');
      if (!descElement) {
        descElement = document.createElement('div');
        descElement.className = 'text-xs text-gray-600 mt-1';
        messageElement.parentNode.appendChild(descElement);
      }
      descElement.textContent = options.description;
    }

    // Update type if provided
    if (type && type !== notification.type) {
      const config = this.getTypeConfig(type);
      const iconElement = notification.element.querySelector('.flex-shrink-0 i');
      if (iconElement) {
        iconElement.className = config.icon;
        iconElement.parentNode.className = `flex-shrink-0 ${config.iconColor} text-xl`;
      }
      
      const borderElement = notification.element.querySelector('.border-l-4');
      if (borderElement) {
        // Remove old border class and add new one
        borderElement.classList.remove(this.getTypeConfig(notification.type).borderColor);
        borderElement.classList.add(config.borderColor);
      }
      
      notification.type = type;
    }

    return true;
  }

  // Get all active notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Get notifications by type
  getNotificationsByType(type) {
    return this.notifications.filter(n => n.type === type);
  }

  // Check if a notification exists
  exists(id) {
    return this.notifications.some(n => n.id === id);
  }

  // Clear all notifications and reset
  clear() {
    this.dismissAll();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  // Destroy the notification manager
  destroy() {
    this.clear();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.notifications = [];
  }
}

// Create global instance
window.NotificationManager = new NotificationManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add necessary CSS if not already present
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        will-change: transform, opacity;
      }
      
      .btn-sm {
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
      }
      
      .btn-secondary {
        background: var(--plum-100);
        color: var(--plum-700);
      }
      
      .btn-secondary:hover {
        background: var(--plum-200);
        color: var(--plum-800);
      }
      
      .btn-primary {
        background: var(--magenta-500);
        color: white;
      }
      
      .btn-primary:hover {
        background: var(--magenta-600);
      }
    `;
    document.head.appendChild(style);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationManager;
}
