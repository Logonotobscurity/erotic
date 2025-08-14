/**
 * AGE GATE MODULE
 * Handles age verification for adult content website
 */

const AgeGate = {
    /**
     * Initialize age gate functionality
     */
    init() {
        this.checkAgeVerification();
        this.setupEventListeners();
    },

    /**
     * Check if user has already verified their age
     */
    checkAgeVerification() {
        const isVerified = localStorage.getItem('ageVerified');
        const ageGate = document.getElementById('ageGate');
        
        if (isVerified === 'true' && ageGate) {
            this.hideAgeGate();
        }
    },

    /**
     * Setup event listeners for age gate interactions
     */
    setupEventListeners() {
        // Set up global functions for age gate buttons
        window.acceptAge = () => this.acceptAge();
        window.declineAge = () => this.declineAge();
        
        // Handle keyboard interactions
        document.addEventListener('keydown', (e) => {
            const ageGate = document.getElementById('ageGate');
            if (ageGate && !ageGate.classList.contains('hidden')) {
                if (e.key === 'Enter') {
                    this.acceptAge();
                } else if (e.key === 'Escape') {
                    this.declineAge();
                }
            }
        });
    },

    /**
     * Handle age acceptance
     */
    acceptAge() {
        try {
            // Store verification in localStorage
            localStorage.setItem('ageVerified', 'true');
            localStorage.setItem('ageVerifiedDate', new Date().toISOString());
            
            // Hide the age gate
            this.hideAgeGate();
            
            // Track event for analytics (if available)
            this.trackAgeVerification(true);
            
            // Show welcome notification
            if (typeof Notifications !== 'undefined') {
                setTimeout(() => {
                    Notifications.show('Welcome to Erotica Lifestyle', 'success');
                }, 1000);
            }
            
        } catch (error) {
            console.error('Error accepting age verification:', error);
        }
    },

    /**
     * Handle age decline
     */
    declineAge() {
        try {
            // Track event for analytics (if available)
            this.trackAgeVerification(false);
            
            // Clear any stored verification
            localStorage.removeItem('ageVerified');
            localStorage.removeItem('ageVerifiedDate');
            
            // Redirect to safe site
            window.location.href = 'https://www.google.com';
            
        } catch (error) {
            console.error('Error declining age verification:', error);
            // Fallback: try to close the window or go to safe site
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = 'https://www.google.com';
            }
        }
    },

    /**
     * Hide the age gate with animation
     */
    hideAgeGate() {
        const ageGate = document.getElementById('ageGate');
        if (ageGate) {
            // Add hidden class with transition
            ageGate.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (ageGate.parentNode) {
                    ageGate.parentNode.removeChild(ageGate);
                }
            }, 500);
        }
    },

    /**
     * Track age verification for analytics
     */
    trackAgeVerification(accepted) {
        // This would integrate with analytics services like Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'age_verification', {
                'event_category': 'engagement',
                'event_label': accepted ? 'accepted' : 'declined',
                'value': accepted ? 1 : 0
            });
        }
        
        // Custom analytics tracking could go here
        console.log(`Age verification ${accepted ? 'accepted' : 'declined'}`);
    },

    /**
     * Check if age verification has expired (optional security measure)
     */
    isVerificationExpired() {
        const verificationDate = localStorage.getItem('ageVerifiedDate');
        if (!verificationDate) return true;
        
        const verifiedDate = new Date(verificationDate);
        const now = new Date();
        const daysSinceVerification = (now - verifiedDate) / (1000 * 60 * 60 * 24);
        
        // Expire after 30 days (configurable)
        return daysSinceVerification > 30;
    },

    /**
     * Reset age verification (for testing or security)
     */
    resetVerification() {
        localStorage.removeItem('ageVerified');
        localStorage.removeItem('ageVerifiedDate');
        location.reload();
    },

    /**
     * Get verification status
     */
    isVerified() {
        const isVerified = localStorage.getItem('ageVerified') === 'true';
        const isExpired = this.isVerificationExpired();
        
        return isVerified && !isExpired;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgeGate;
}
