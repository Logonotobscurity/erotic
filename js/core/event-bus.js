/**
 * Event Bus
 * Centralized event system for module communication
 */

class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   * @returns {Function} Unsubscribe function
   */
  on(event, handler) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(handler);
    
    // Return unsubscribe function
    return () => {
      this.off(event, handler);
    };
  }

  /**
   * Subscribe to an event once
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  once(event, handler) {
    const wrappedHandler = (data) => {
      handler(data);
      this.off(event, wrappedHandler);
    };
    
    this.on(event, wrappedHandler);
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  off(event, handler) {
    if (!this.events[event]) {return;}
    
    this.events[event] = this.events[event].filter(h => h !== handler);
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (!this.events[event]) {return;}
    
    this.events[event].forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Clear all event listeners
   */
  clear() {
    this.events = {};
  }
}

// Export singleton instance
export const eventBus = new EventBus();
