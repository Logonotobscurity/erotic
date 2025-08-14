/**
 * Forms Module
 * Handles form validation, submission, and user feedback
 */

class FormHandler {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.bindEvents();
    console.log('📝 Forms initialized');
  }

  bindEvents() {
    this.forms.forEach(form => {
      form.addEventListener('submit', this.handleSubmit.bind(this));
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', this.validateField.bind(this));
        input.addEventListener('input', this.clearValidationState.bind(this));
      });
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formId = form.id || 'unknown-form';
    
    // Clear previous states
    this.clearFormValidation(form);
    
    // Validate form
    const isValid = this.validateForm(form);
    if (!isValid) {
      this.showNotification('Please correct the errors below', 'error');
      return;
    }

    // Show loading state
    this.setFormLoading(form, true);

    try {
      const formData = new FormData(form);
      const result = await this.submitForm(formId, formData);
      
      if (result.success) {
        this.handleSubmissionSuccess(form, result);
      } else {
        this.handleSubmissionError(form, result.error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.handleSubmissionError(form, 'An unexpected error occurred. Please try again.');
    } finally {
      this.setFormLoading(form, false);
    }
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField({ target: input })) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation (basic)
    else if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // URL validation
    else if (field.type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        isValid = false;
        errorMessage = 'Please enter a valid URL';
      }
    }

    // Min/Max length validation
    if (field.minLength && value.length < field.minLength) {
      isValid = false;
      errorMessage = `Minimum ${field.minLength} characters required`;
    }
    if (field.maxLength && value.length > field.maxLength) {
      isValid = false;
      errorMessage = `Maximum ${field.maxLength} characters allowed`;
    }

    // Pattern validation
    if (field.pattern && value) {
      const pattern = new RegExp(field.pattern);
      if (!pattern.test(value)) {
        isValid = false;
        errorMessage = field.title || 'Invalid format';
      }
    }

    // Age verification (for adult content)
    if (fieldName === 'age' || fieldName === 'birthdate') {
      if (!this.validateAge(field)) {
        isValid = false;
        errorMessage = 'You must be 18 or older';
      }
    }

    // Custom validations
    if (fieldName === 'password-confirm') {
      const passwordField = field.form.querySelector('[name="password"]');
      if (passwordField && value !== passwordField.value) {
        isValid = false;
        errorMessage = 'Passwords do not match';
      }
    }

    this.setFieldValidationState(field, isValid, errorMessage);
    return isValid;
  }

  validateAge(field) {
    if (field.type === 'date') {
      const birthDate = new Date(field.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    } else if (field.type === 'number') {
      return parseInt(field.value, 10) >= 18;
    }
    return true;
  }

  setFieldValidationState(field, isValid, errorMessage = '') {
    const formGroup = field.closest('.form-group') || field.parentNode;
    
    // Remove existing states
    formGroup.classList.remove('has-error', 'has-success');
    field.classList.remove('error', 'success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    if (field.value.trim()) {
      if (isValid) {
        formGroup.classList.add('has-success');
        field.classList.add('success');
      } else {
        formGroup.classList.add('has-error');
        field.classList.add('error');
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errorMessage}`;
        formGroup.appendChild(errorElement);
      }
    }
  }

  clearValidationState(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group') || field.parentNode;
    
    // Only clear if user is typing (not on blur)
    if (e.type === 'input') {
      formGroup.classList.remove('has-error');
      field.classList.remove('error');
      
      const errorElement = formGroup.querySelector('.form-error');
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  clearFormValidation(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      group.classList.remove('has-error', 'has-success');
    });

    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      field.classList.remove('error', 'success');
    });

    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
  }

  setFormLoading(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (isLoading) {
      form.classList.add('form-loading');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      }
    } else {
      form.classList.remove('form-loading');
      if (submitButton) {
        submitButton.disabled = false;
        // Restore original button text
        const originalText = submitButton.getAttribute('data-original-text') || 'Submit';
        submitButton.innerHTML = originalText;
      }
    }
  }

  async submitForm(formId, formData) {
    // Convert FormData to object for easier handling
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // In a real application, this would submit to your backend
    // For this demo, we'll simulate different responses based on form type
    
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (formId) {
          case 'contactForm':
            resolve({
              success: true,
              message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
              data
            });
            break;
            
          case 'newsletterForm':
            resolve({
              success: true,
              message: 'Successfully subscribed to our newsletter!',
              data
            });
            break;
            
          case 'ageGateForm':
            const isAdult = data.age >= 18 || data.ageConfirm === 'yes';
            resolve({
              success: isAdult,
              message: isAdult 
                ? 'Age verification successful' 
                : 'You must be 18 or older to access this site',
              data
            });
            break;
            
          default:
            resolve({
              success: true,
              message: 'Form submitted successfully!',
              data
            });
        }
      }, 1500); // Simulate network delay
    });
  }

  handleSubmissionSuccess(form, result) {
    this.showNotification(result.message, 'success');
    
    // Handle different form types
    const formId = form.id;
    
    switch (formId) {
      case 'contactForm':
        form.reset();
        this.clearFormValidation(form);
        break;
        
      case 'newsletterForm':
        form.reset();
        // Maybe hide the form and show a thank you message
        break;
        
      case 'ageGateForm':
        // Handle age gate success
        if (window.ageGate && typeof window.ageGate.handleAgeVerification === 'function') {
          window.ageGate.handleAgeVerification(true);
        }
        break;
    }
    
    // Dispatch success event
    this.dispatchFormEvent('form:submit-success', {
      formId,
      result
    });
  }

  handleSubmissionError(form, errorMessage) {
    this.showNotification(errorMessage, 'error');
    
    // Dispatch error event
    this.dispatchFormEvent('form:submit-error', {
      formId: form.id,
      error: errorMessage
    });
  }

  showNotification(message, type = 'info') {
    // Use the notifications module if available
    if (window.NotificationManager) {
      window.NotificationManager.show(message, type);
    } else {
      // Fallback to console
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  dispatchFormEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  // Public API methods
  validateFormById(formId) {
    const form = document.getElementById(formId);
    return form ? this.validateForm(form) : false;
  }

  resetFormById(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
      this.clearFormValidation(form);
      return true;
    }
    return false;
  }

  setFieldValue(formId, fieldName, value) {
    const form = document.getElementById(formId);
    if (form) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.value = value;
        // Trigger validation
        this.validateField({ target: field });
        return true;
      }
    }
    return false;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.formHandler = new FormHandler();
  
  // Set original button text for loading states
  document.querySelectorAll('button[type="submit"]').forEach(button => {
    if (!button.hasAttribute('data-original-text')) {
      button.setAttribute('data-original-text', button.textContent.trim());
    }
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormHandler;
}
