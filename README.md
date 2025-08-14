# Erotica Lifestyle - Modern E-commerce Website

A modern, responsive, and accessible adult wellness e-commerce website built with vanilla HTML, CSS, and JavaScript. Features contemporary design patterns, smooth animations, and professional user experience.

## 🎨 Features

### Design & UI/UX
- **Modern Design System**: Comprehensive CSS custom properties and utility classes
- **Glassmorphism Effects**: Modern blur effects and transparent elements
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Dark Mode Support**: Automatic theme switching based on user preference
- **Accessibility**: WCAG compliant with proper focus management and screen reader support

### Functionality
- **Age Verification Gate**: Required for adult content compliance
- **Product Catalog**: Dynamic product loading with filtering and search
- **Discreet Mode**: Privacy toggle for sensitive browsing
- **Shopping Cart**: Full e-commerce cart functionality
- **Wishlist System**: Save favorite products for later
- **Form Handling**: Contact forms with validation and feedback
- **Notifications**: Toast-style user feedback system

### Performance
- **Modern CSS**: CSS Grid, Flexbox, custom properties
- **Optimized Animations**: GPU-accelerated transitions and micro-interactions
- **Lazy Loading**: Performance-optimized resource loading
- **Progressive Enhancement**: Works without JavaScript as fallback

## 📁 Project Structure

```
erotica-lifestyle-website/
├── index.html                 # Main homepage
├── README.md                  # This file
│
├── css/                       # Stylesheets
│   ├── main.css              # Core styles and design system
│   ├── components/           # Component-specific styles
│   │   ├── navigation.css
│   │   ├── hero.css
│   │   ├── products.css
│   │   ├── modal.css
│   │   └── forms.css
│   └── utils/                # Utility styles
│       ├── animations.css
│       └── responsive.css
│
├── js/                       # JavaScript modules
│   ├── main.js              # Main application logic
│   └── modules/             # Feature modules
│       ├── ageGate.js
│       ├── cart.js
│       ├── productFilter.js
│       ├── navigation.js
│       ├── forms.js
│       └── notifications.js
│
├── data/                     # Data files
│   └── products.json        # Product catalog data
│
├── images/                   # Image assets
│   ├── products/            # Product images
│   ├── banners/             # Hero and banner images
│   └── icons/               # Icon assets
│
├── assets/                   # Static assets
│   ├── icons/               # Favicon and app icons
│   └── fonts/               # Custom web fonts (if any)
│
├── pages/                    # Additional pages
│   ├── catalog.html
│   ├── blog.html
│   ├── privacy.html
│   └── terms.html
│
├── components/               # Reusable HTML components
├── tests/                    # Test files
└── docs/                     # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for testing AJAX features)

### Installation
1. **Clone or download** this repository
2. **Open** the project folder in your code editor
3. **Serve** the files using a local web server:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx serve .

# Using PHP (if installed)
php -S localhost:8000

# Or simply open index.html in your browser
```

4. **Navigate** to `http://localhost:8000` in your browser

### Development Setup
1. **Customize** the color scheme in `css/main.css` (`:root` section)
2. **Add products** by editing `data/products.json`
3. **Modify content** in `index.html`
4. **Add images** to the appropriate folders in `/images`

## 🎯 Key Components

### Age Gate System
- Compliant age verification modal
- LocalStorage persistence
- Keyboard navigation support
- Analytics tracking integration

### Product System
- Dynamic product loading from JSON
- Category filtering and search
- Product cards with animations
- Price formatting and currency support
- Stock management

### Discreet Mode
- Privacy-focused browsing toggle
- Content blurring for sensitive areas
- LocalStorage preference saving
- Visual indicators and feedback

### Shopping Cart
- Add/remove products
- Quantity management
- Local storage persistence
- Visual feedback and animations

## 🎨 Design System

### Color Palette
- **Plum Shades**: Primary brand colors (#2E1037 to #EEE9E3)
- **Magenta Accent**: Call-to-action color (#E6007E)
- **Sand Background**: Warm neutral tones (#F5F1EC)
- **Charcoal Text**: High contrast text colors

### Typography
- **Display Font**: Playfair Display (serif, elegant)
- **Body Font**: Inter (sans-serif, readable)
- **Responsive Scale**: clamp() functions for fluid typography

### Components
- **Glass Cards**: Backdrop blur with subtle transparency
- **Modern Buttons**: Gradient backgrounds with shimmer effects
- **Product Cards**: Hover animations and category-specific styling
- **Badges**: Status indicators with various styles

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 480px and below
- **Tablet**: 768px and below
- **Desktop**: 1024px and above
- **Large Desktop**: 1280px and above

### Mobile Features
- Touch-friendly interface
- Optimized navigation
- Compressed layouts
- Performance optimizations

## ⚡ Performance Optimizations

### CSS
- Custom properties for consistent theming
- Utility-first approach for smaller file sizes
- CSS Grid and Flexbox for efficient layouts
- Hardware acceleration for animations

### JavaScript
- Modular architecture for better maintainability
- Debounced scroll events
- Intersection Observer for animations
- Performance monitoring built-in

### Images
- Responsive image sizing
- Lazy loading implementation
- WebP format support (when implemented)
- Optimized placeholder graphics

## 🔧 Customization

### Adding Products
Edit `data/products.json`:

```json
{
  "id": "unique-product-id",
  "name": "Product Name",
  "description": "Product description",
  "price": 25000,
  "category": "vibrators|couples|wellness|accessories",
  "badge": "New|Bestseller|Sale",
  "rating": 4.8,
  "reviews": 123,
  "inStock": true
}
```

### Styling Modifications
1. **Colors**: Modify CSS custom properties in `css/main.css`
2. **Fonts**: Update font imports and variables
3. **Spacing**: Adjust spacing scale variables
4. **Components**: Edit component-specific CSS files

### Adding Pages
1. Create HTML file in `/pages` directory
2. Follow existing structure and include necessary CSS/JS
3. Update navigation links in main files

## 🛡️ Security & Privacy

### Age Verification
- Required for adult content compliance
- Persistent verification storage
- Proper legal disclaimers

### Privacy Features
- Discreet mode for private browsing
- No tracking without consent
- Secure form handling practices

### Data Protection
- No sensitive data stored in localStorage
- HTTPS recommendation for production
- Privacy policy compliance

## 🌐 Browser Support

### Modern Browsers (Recommended)
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Fallback Support
- Graceful degradation for older browsers
- CSS Grid fallbacks
- JavaScript feature detection

## 📈 Analytics & SEO

### SEO Features
- Semantic HTML structure
- Meta tags and Open Graph
- Structured data markup ready
- Performance optimized

### Analytics Ready
- Google Analytics integration points
- Custom event tracking
- Performance monitoring
- User behavior insights

## 🚀 Deployment

### Static Hosting
- Netlify, Vercel, GitHub Pages compatible
- No server-side requirements
- CDN optimization recommended

### Production Checklist
- [ ] Update contact information
- [ ] Add real product images
- [ ] Configure analytics
- [ ] Test all forms
- [ ] Optimize images
- [ ] Enable HTTPS
- [ ] Test on multiple devices

## 📝 License

This project is created for educational and demonstration purposes. Please ensure compliance with local laws and regulations when adapting for commercial use.

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For questions or support, please contact the development team or create an issue in the project repository.

---

**Built with ❤️ for modern web experiences**
