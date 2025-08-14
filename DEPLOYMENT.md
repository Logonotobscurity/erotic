# Deployment Guide for Erotica Lifestyle Website

This document provides comprehensive deployment instructions for the Erotica Lifestyle website across various hosting platforms and environments.

## 📋 Prerequisites

- Git installed on your system
- Basic understanding of web hosting
- Domain name (for production deployment)
- SSL certificate (recommended for adult content sites)

## 🚀 Deployment Options

### 1. GitHub Pages (Free)

**Automatic deployment via GitHub Actions:**

1. Push your code to GitHub repository
2. Go to repository Settings > Pages
3. Select "GitHub Actions" as source
4. The site will automatically deploy on push to main/master branch

**Manual deployment:**

```bash
# Enable GitHub Pages in repository settings
# Choose source: Deploy from a branch > main > / (root)
```

**Custom Domain Setup:**
- Add `CNAME` file with your domain
- Configure DNS A records to point to GitHub Pages IPs:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

### 2. Netlify (Recommended)

**Via Git Integration:**

1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
   - Environment variables: (none required)

**Manual Deployment:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
npx netlify deploy --prod --dir .
```

**Features:**
- Automatic SSL certificates
- Custom domain support
- Form handling
- CDN optimization
- Header/redirect configuration via `netlify.toml`

### 3. Vercel

**Via Git Integration:**

1. Import repository in Vercel dashboard
2. Framework preset: Other
3. Build and output settings:
   - Build command: (leave empty)
   - Output directory: (leave empty)
   - Install command: `npm install` (optional)

**Manual Deployment:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 4. Traditional Web Hosting (cPanel/FTP)

**Upload via FTP:**

1. Compress your project files (excluding node_modules, .git, etc.)
2. Upload to public_html or www directory
3. Extract files on server
4. Configure `.htaccess` for proper routing

**Sample .htaccess:**

```apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<filesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
  Header set Cache-Control "max-age=31536000, public, immutable"
</filesMatch>

# Cache HTML files
<filesMatch "\\.(html)$">
  Header set Cache-Control "max-age=0, public, must-revalidate"
</filesMatch>

# Redirects
Redirect 301 /privacy /pages/privacy.html
Redirect 301 /terms /pages/terms.html
Redirect 301 /shop /pages/catalog.html
```

### 5. Docker Deployment

**Build and run locally:**

```bash
# Build image
docker build -t erotica-lifestyle .

# Run container
docker run -p 8080:80 erotica-lifestyle
```

**Using Docker Compose:**

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop services
docker-compose down
```

**Production deployment with Docker:**

```bash
# Build for production
docker build -t erotica-lifestyle:prod .

# Tag for registry
docker tag erotica-lifestyle:prod your-registry/erotica-lifestyle:latest

# Push to registry
docker push your-registry/erotica-lifestyle:latest

# Deploy on server
docker pull your-registry/erotica-lifestyle:latest
docker run -d -p 80:80 --restart unless-stopped your-registry/erotica-lifestyle:latest
```

### 6. AWS S3 + CloudFront

**S3 Static Website Hosting:**

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-domain-name

# Enable static website hosting
aws s3 website s3://your-domain-name --index-document index.html

# Upload files
aws s3 sync . s3://your-domain-name --exclude ".git/*" --exclude "node_modules/*"

# Set bucket policy for public read
```

**CloudFront Distribution:**
- Origin: S3 bucket
- Default root object: index.html
- Custom error pages: 404 -> index.html (for SPA routing)
- SSL certificate: AWS Certificate Manager

## 🔒 Security Considerations

### SSL/HTTPS Setup

**For adult content websites, HTTPS is mandatory:**

1. **Netlify/Vercel**: Automatic SSL certificates
2. **Traditional hosting**: Purchase SSL certificate or use Let's Encrypt
3. **AWS**: Use AWS Certificate Manager
4. **Self-hosted**: Use Certbot for Let's Encrypt certificates

### Content Security Policy (CSP)

The website includes CSP headers for security. Customize in:
- `netlify.toml` for Netlify
- `vercel.json` for Vercel
- `nginx.conf` for Docker/Nginx
- `.htaccess` for Apache servers

### Age Verification Compliance

Ensure your deployment includes:
- Age verification modal (already implemented)
- Legal disclaimers
- Terms of service and privacy policy
- Appropriate content warnings

## 🌐 Domain and DNS Configuration

### DNS Settings

**A Records (for root domain):**
```
Type: A
Name: @
Value: [Your hosting provider's IP]
TTL: 3600
```

**CNAME Records (for www subdomain):**
```
Type: CNAME
Name: www
Value: your-domain.com
TTL: 3600
```

**For Netlify/Vercel:**
- Set CNAME to point to their provided subdomain
- Configure custom domain in hosting dashboard

### CDN Configuration

**Recommended CDN settings:**
- Cache static assets (CSS, JS, images) for 1 year
- Cache HTML files with short TTL (1 hour)
- Enable gzip compression
- Set up geo-blocking if required by local laws

## 📊 Performance Optimization

### Pre-deployment Checklist

- [ ] Optimize images (compress, use WebP format)
- [ ] Minify CSS and JavaScript files
- [ ] Enable gzip compression
- [ ] Configure proper caching headers
- [ ] Test on multiple devices and browsers
- [ ] Validate HTML and CSS
- [ ] Check accessibility compliance
- [ ] Test form submissions
- [ ] Verify age gate functionality

### Monitoring and Analytics

**Setup recommendations:**
- Google Analytics 4
- Google Search Console
- Performance monitoring (Lighthouse CI)
- Uptime monitoring
- Error logging

## 🚨 Troubleshooting

### Common Issues

**404 Errors:**
- Ensure `index.html` is in root directory
- Configure server redirects for SPA routing
- Check file permissions (755 for directories, 644 for files)

**CSS/JS Not Loading:**
- Verify file paths are correct
- Check server MIME types
- Ensure files are uploaded correctly

**Age Gate Not Working:**
- Verify JavaScript files are loaded
- Check browser console for errors
- Ensure localStorage is available

**Form Submissions Failing:**
- Configure form handling service (Netlify Forms, Formspree, etc.)
- Set up proper CORS headers
- Verify form action URLs

### Environment-Specific Issues

**GitHub Pages:**
- Enable Pages in repository settings
- Ensure branch is set correctly
- Check if custom domain DNS is configured properly

**Netlify:**
- Review build logs for errors
- Check `netlify.toml` configuration
- Verify custom headers and redirects

**Docker:**
- Check container logs: `docker logs container-name`
- Verify port mappings
- Ensure Nginx configuration is correct

## 📝 Deployment Logs

Keep track of deployments:

```bash
# Create deployment log
echo "Deployment $(date): Version 1.0.0 deployed to production" >> deployment.log

# Tag releases
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

## 🔄 Continuous Integration/Continuous Deployment (CI/CD)

The included GitHub Actions workflow provides:
- Automatic deployment on push to main branch
- HTML validation
- Performance testing with Lighthouse
- Asset optimization

**Customize workflow:**
- Edit `.github/workflows/deploy.yml`
- Add environment variables for secrets
- Configure deployment notifications

## 📋 Post-Deployment Tasks

After successful deployment:

1. **Test all functionality:**
   - Age verification
   - Product filtering
   - Cart operations
   - Form submissions
   - Mobile responsiveness

2. **SEO Setup:**
   - Submit sitemap to search engines
   - Verify Google Search Console
   - Set up Google Analytics
   - Configure social media meta tags

3. **Legal Compliance:**
   - Verify age verification works
   - Test geo-blocking if implemented
   - Ensure privacy policy is accessible
   - Check terms of service links

4. **Performance:**
   - Run Lighthouse audit
   - Test page load speeds
   - Verify CDN configuration
   - Monitor Core Web Vitals

5. **Security:**
   - Verify HTTPS is working
   - Test security headers
   - Check for exposed sensitive files
   - Validate CSP configuration

## 📞 Support

For deployment issues:
1. Check this documentation first
2. Review hosting provider documentation
3. Check browser developer console for errors
4. Verify all files are uploaded correctly
5. Test in incognito/private browsing mode

---

**Remember**: Always test thoroughly before deploying to production, especially for adult content websites where compliance and user privacy are critical.
