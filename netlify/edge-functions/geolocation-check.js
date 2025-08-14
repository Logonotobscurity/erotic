/**
 * Netlify Edge Function for Geolocation Checking
 * Handles geographic restrictions for adult content compliance
 * Some jurisdictions have specific laws regarding adult content
 */

export default async (request, context) => {
  const url = new URL(request.url);
  
  // Get country from Netlify's geolocation data
  const country = context.geo?.country?.code || 'UNKNOWN';
  const subdivision = context.geo?.subdivision?.code || '';
  
  // Countries/regions with strict adult content laws
  const restrictedCountries = [
    'CN', // China
    'AE', // United Arab Emirates
    'SA', // Saudi Arabia
    'IR', // Iran
    'PK', // Pakistan
    'BD', // Bangladesh
    'ID', // Indonesia (partial restrictions)
    'IN', // India (partial restrictions)
    'MY', // Malaysia
    'SG', // Singapore (regulated)
    'TH' // Thailand (regulated)
  ];
  
  // US states with additional restrictions
  const restrictedUSStates = [
    'UT', // Utah
    'TX', // Texas (some restrictions)
    'LA'  // Louisiana (age verification laws)
  ];
  
  // Check if country is restricted
  const isCountryRestricted = restrictedCountries.includes(country);
  const isUSStateRestricted = country === 'US' && restrictedUSStates.includes(subdivision);
  
  // If accessing from restricted location
  if (isCountryRestricted || isUSStateRestricted) {
    // For API requests
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          error: 'Geographic restriction',
          message: 'This content is not available in your region due to local laws and regulations.',
          code: 'GEO_RESTRICTED',
          country: country,
          subdivision: subdivision
        }),
        {
          status: 451, // 451 Unavailable For Legal Reasons
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        }
      );
    }
    
    // For regular page requests, show geographic restriction message
    const restrictionHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Content Not Available - Erotica Lifestyle</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #2E1037 0%, #1a0620 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          
          .restriction-container {
            max-width: 600px;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 3rem;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .icon {
            font-size: 4rem;
            margin-bottom: 2rem;
            opacity: 0.8;
          }
          
          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #EEE9E3;
          }
          
          .message {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          
          .legal-notice {
            font-size: 0.9rem;
            opacity: 0.7;
            margin-bottom: 2rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            border-left: 4px solid #E6007E;
          }
          
          .location-info {
            font-size: 0.9rem;
            opacity: 0.6;
            margin-top: 2rem;
          }
          
          .support-link {
            color: #E6007E;
            text-decoration: none;
            font-weight: 600;
          }
          
          .support-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="restriction-container">
          <div class="icon">🌍</div>
          <h1>Content Not Available</h1>
          
          <div class="message">
            We're sorry, but this content is not available in your region due to local laws and regulations regarding adult content.
          </div>
          
          <div class="legal-notice">
            <strong>Legal Notice:</strong> We respect and comply with local laws in all jurisdictions. This restriction is in place to ensure compliance with regional regulations regarding adult content distribution.
          </div>
          
          <div class="message">
            If you believe this is an error or if you have questions about content availability in your region, please contact our support team.
          </div>
          
          <div class="location-info">
            Detected location: ${country}${subdivision ? ' - ' + subdivision : ''}<br>
            <a href="mailto:support@eroticalifestyle.com" class="support-link">Contact Support</a>
          </div>
        </div>
        
        <script>
          // Track geographic restriction event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'geo_restriction', {
              event_category: 'compliance',
              event_label: '${country}${subdivision ? '_' + subdivision : ''}',
              custom_map: {
                country: '${country}',
                subdivision: '${subdivision}'
              }
            });
          }
          
          // Prevent caching of this response
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
              registrations.forEach(function(registration) {
                registration.unregister();
              });
            });
          }
        </script>
      </body>
      </html>
    `;
    
    return new Response(restrictionHTML, {
      status: 451, // 451 Unavailable For Legal Reasons
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Geo-Restricted': 'true',
        'X-Restricted-Country': country,
        'X-Restricted-Subdivision': subdivision || 'N/A'
      }
    });
  }
  
  // For allowed regions, add geolocation headers and continue
  const response = await context.next();
  
  // Add geolocation information to response headers for analytics
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-User-Country', country);
  newHeaders.set('X-User-Subdivision', subdivision || 'N/A');
  
  // Add specific headers for certain regions that require additional compliance
  if (country === 'US') {
    newHeaders.set('X-US-State', subdivision || 'UNKNOWN');
    // Add CCPA compliance header for California
    if (subdivision === 'CA') {
      newHeaders.set('X-Privacy-Rights', 'CCPA-Applicable');
    }
  }
  
  // Add GDPR compliance header for EU countries
  const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
  if (euCountries.includes(country)) {
    newHeaders.set('X-Privacy-Rights', 'GDPR-Applicable');
    newHeaders.set('X-Cookie-Consent-Required', 'true');
  }
  
  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
};
