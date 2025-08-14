#!/usr/bin/env node

/**
 * Generate sitemap.xml for Erotica Lifestyle website
 * Includes all pages with appropriate priorities and change frequencies
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: process.env.NETLIFY_URL || 'https://logonotobscurity.netlify.app',
  currentDate: new Date().toISOString().split('T')[0],
  outputPath: path.join(__dirname, '../sitemap.xml')
};

// Define all pages with their metadata
const pages = [
  {
    url: '/',
    priority: '1.0',
    changefreq: 'daily',
    lastmod: config.currentDate,
    title: 'Home - Premium Adult Wellness Products'
  },
  {
    url: '/pages/catalog.html',
    priority: '0.9',
    changefreq: 'daily',
    lastmod: config.currentDate,
    title: 'Product Catalog - Adult Wellness Collection'
  },
  {
    url: '/pages/blog.html',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: config.currentDate,
    title: 'Wellness Blog - Sexual Health Education'
  },
  {
    url: '/pages/privacy.html',
    priority: '0.3',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Privacy Policy'
  },
  {
    url: '/pages/terms.html',
    priority: '0.3',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Terms and Conditions'
  },
  {
    url: '/pages/cookies.html',
    priority: '0.2',
    changefreq: 'yearly',
    lastmod: config.currentDate,
    title: 'Cookie Policy'
  },
  {
    url: '/pages/shipping.html',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Shipping & Returns Information'
  },
  {
    url: '/pages/size-guide.html',
    priority: '0.5',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Size Guide - Product Sizing Information'
  },
  {
    url: '/pages/care.html',
    priority: '0.5',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Product Care Instructions'
  },
  {
    url: '/pages/ambassador.html',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Ambassador Program - Join Our Team'
  },
  {
    url: '/pages/quiz.html',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: config.currentDate,
    title: 'Product Recommendation Quiz'
  },
  {
    url: '/pages/account.html',
    priority: '0.4',
    changefreq: 'weekly',
    lastmod: config.currentDate,
    title: 'My Account - User Dashboard'
  },
  {
    url: '/pages/auth.html',
    priority: '0.4',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Login & Registration'
  },
  {
    url: '/pages/support.html',
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: 'Customer Support & Help'
  },
  {
    url: '/pages/age-verification.html',
    priority: '0.3',
    changefreq: 'yearly',
    lastmod: config.currentDate,
    title: 'Age Verification Information'
  }
];

// Add product category pages
const categories = [
  {
    slug: 'vibrators',
    name: 'Vibrators',
    priority: '0.8'
  },
  {
    slug: 'couples',
    name: 'For Couples',
    priority: '0.8'
  },
  {
    slug: 'wellness',
    name: 'Wellness Products',
    priority: '0.7'
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    priority: '0.7'
  }
];

categories.forEach(category => {
  pages.push({
    url: `/pages/catalog.html?category=${category.slug}`,
    priority: category.priority,
    changefreq: 'weekly',
    lastmod: config.currentDate,
    title: `${category.name} - Premium Adult Wellness Products`
  });
});

// Add blog article pages (sample articles from the website)
const blogArticles = [
  {
    slug: 'understanding-your-body',
    title: 'Understanding Your Body: A Guide to Self-Discovery',
    priority: '0.6'
  },
  {
    slug: 'kegel-exercises',
    title: 'Kegel Exercises: Strengthening Your Pelvic Floor',
    priority: '0.6'
  },
  {
    slug: 'communication-intimacy',
    title: 'Communication: The Key to Better Intimacy',
    priority: '0.6'
  },
  {
    slug: 'menstrual-health',
    title: 'Menstrual Health and Intimacy',
    priority: '0.6'
  },
  {
    slug: 'self-care-rituals',
    title: 'Self-Care Rituals for Intimate Wellness',
    priority: '0.6'
  },
  {
    slug: 'safe-practices',
    title: 'Safe Practices and Product Care',
    priority: '0.6'
  }
];

blogArticles.forEach(article => {
  pages.push({
    url: `/pages/blog/${article.slug}.html`,
    priority: article.priority,
    changefreq: 'monthly',
    lastmod: config.currentDate,
    title: article.title
  });
});

/**
 * Generate XML sitemap content
 */
function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

  // Add all pages to sitemap
  pages.forEach(page => {
    xml += `  <url>
    <loc>${config.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <mobile:mobile/>
  </url>
`;
  });

  xml += '</urlset>';
  return xml;
}

/**
 * Generate robots.txt file
 */
function generateRobotsTxt() {
  const robotsContent = `# Robots.txt for Erotica Lifestyle Website
# Adult content website - 18+ only

User-agent: *
# Allow all well-behaved crawlers
Disallow: /admin/
Disallow: /.env*
Disallow: /node_modules/
Disallow: /*.log
Disallow: /scripts/
Disallow: /netlify/

# Adult content specific
# Some conservative crawlers may choose not to index
User-agent: Googlebot
Allow: /

User-agent: Bingbot  
Allow: /

User-agent: YandexBot
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block potential scrapers and unwanted bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Crawl delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${config.baseUrl}/sitemap.xml

# Additional sitemaps (for future expansion)
# Sitemap: ${config.baseUrl}/sitemap-products.xml
# Sitemap: ${config.baseUrl}/sitemap-blog.xml
`;

  return robotsContent;
}

/**
 * Main execution function
 */
function main() {
  try {
    console.log('🚀 Generating sitemap and robots.txt for Erotica Lifestyle website...');
    
    // Ensure scripts directory exists
    const scriptsDir = path.dirname(config.outputPath);
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }

    // Generate and write sitemap.xml
    const sitemapContent = generateSitemap();
    const sitemapPath = path.join(__dirname, '../sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log(`✅ Generated sitemap.xml with ${pages.length} pages`);

    // Generate and write robots.txt
    const robotsContent = generateRobotsTxt();
    const robotsPath = path.join(__dirname, '../robots.txt');
    fs.writeFileSync(robotsPath, robotsContent, 'utf8');
    console.log('✅ Generated robots.txt');

    // Generate sitemap index (for future expansion)
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${config.baseUrl}/sitemap.xml</loc>
    <lastmod>${config.currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    const sitemapIndexPath = path.join(__dirname, '../sitemap-index.xml');
    fs.writeFileSync(sitemapIndexPath, sitemapIndex, 'utf8');
    console.log('✅ Generated sitemap-index.xml');

    console.log('\n📊 Sitemap Statistics:');
    console.log(`   • Base URL: ${config.baseUrl}`);
    console.log(`   • Total pages: ${pages.length}`);
    console.log(`   • Last modified: ${config.currentDate}`);
    console.log(`   • High priority pages: ${pages.filter(p => parseFloat(p.priority) >= 0.8).length}`);
    console.log(`   • Medium priority pages: ${pages.filter(p => parseFloat(p.priority) >= 0.5 && parseFloat(p.priority) < 0.8).length}`);
    console.log(`   • Low priority pages: ${pages.filter(p => parseFloat(p.priority) < 0.5).length}`);

    console.log('\n🎯 SEO Notes:');
    console.log('   • Adult content website - ensure compliance with search engine guidelines');
    console.log('   • Age verification is required for all content');
    console.log('   • Consider geo-blocking in restricted jurisdictions');
    console.log('   • Submit sitemap to Google Search Console and Bing Webmaster Tools');
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSitemap, generateRobotsTxt, pages, config };
