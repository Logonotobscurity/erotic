module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Errors
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    'no-console': 'off', // Allow console for development
    'no-debugger': 'error',
    'no-alert': 'warn',
    
    // Best Practices
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    
    // Style
    'indent': ['error', 2, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    
    // ES6+
    'arrow-spacing': 'error',
    'template-curly-spacing': 'error',
    'object-shorthand': 'error',
    
    // Functions
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'no-unused-expressions': 'error',
    
    // Variables
    'no-undef': 'error',
    'no-global-assign': 'error',
    'no-redeclare': 'error'
  },
  globals: {
    // Browser globals
    window: 'readonly',
    document: 'readonly',
    localStorage: 'readonly',
    sessionStorage: 'readonly',
    navigator: 'readonly',
    console: 'readonly',
    
    // Custom globals from our app
    acceptAge: 'writable',
    declineAge: 'writable',
    toggleMenu: 'writable',
    toggleDiscreetMode: 'writable',
    addToCart: 'writable',
    removeFromCart: 'writable',
    clearCart: 'writable',
    filterProducts: 'writable',
    resetFilters: 'writable',
    loadMoreProducts: 'writable',
    openQuickView: 'writable',
    toggleWishlist: 'writable',
    openBlogPost: 'writable',
    bookmarkArticle: 'writable',
    shareArticle: 'writable',
    openPartnerForm: 'writable',
    scrollToSection: 'writable'
  }
};
