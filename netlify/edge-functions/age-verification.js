/**
 * Netlify Edge Function for Age Verification
 * Handles age verification requirements for adult content compliance
 * Runs at the edge for optimal performance
 */

export default async (request, context) => {
  const url = new URL(request.url);
  const cookies = request.headers.get('cookie') || '';
  
  // Check if user has already verified age
  const hasAgeVerification = cookies.includes('age_verified=true');
  
  // Pages that don't require age verification
  const publicPaths = [
    '/404.html',
    '/robots.txt',
    '/sitemap.xml',
    '/sitemap-index.xml',
    '/pages/privacy.html',
    '/pages/terms.html',
    '/pages/age-verification.html'
  ];
  
  // Static assets that don't require age verification
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
  
  // Check if current path is public or static
  const isPublicPath = publicPaths.some(path => url.pathname === path);
  const isStaticAsset = staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
  
  // Skip age verification for public paths and static assets
  if (isPublicPath || isStaticAsset) {
    return context.next();
  }
  
  // If user hasn't verified age, show age gate
  if (!hasAgeVerification) {
    // For API requests, return JSON response
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          error: 'Age verification required',
          message: 'You must verify your age to access this content',
          code: 'AGE_VERIFICATION_REQUIRED'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        }
      );
    }
    
    // For regular page requests, inject age verification modal
    const response = await context.next();
    
    if (response.headers.get('content-type')?.includes('text/html')) {
      const html = await response.text();
      
      // Inject age verification styles and script
      const ageGateStyles = `
        <style>
          .age-verification-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
          }
          .age-verification-modal {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          .age-verification-title {
            color: #2E1037;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .age-verification-text {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .age-verification-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }
          .age-verify-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .age-verify-btn.accept {
            background: #E6007E;
            color: white;
          }
          .age-verify-btn.accept:hover {
            background: #B8005F;
          }
          .age-verify-btn.decline {
            background: #f5f5f5;
            color: #666;
          }
          .age-verify-btn.decline:hover {
            background: #e5e5e5;
          }
        </style>
      `;
      
      const ageGateHTML = `
        <div id="edgeAgeVerification" class="age-verification-overlay">
          <div class="age-verification-modal">
            <div class="age-verification-title">Age Verification Required</div>
            <div class="age-verification-text">
              You must be 18 years or older to access this website. This site contains adult content.
              <br><br>
              Are you 18 years of age or older?
            </div>
            <div class="age-verification-buttons">
              <button class="age-verify-btn accept" onclick="verifyAge(true)">Yes, I am 18+</button>
              <button class="age-verify-btn decline" onclick="verifyAge(false)">No, Exit Site</button>
            </div>
          </div>
        </div>
        <script>
          function verifyAge(isVerified) {
            if (isVerified) {
              // Set cookie for 30 days
              const expiryDate = new Date();
              expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000));
              document.cookie = 'age_verified=true; expires=' + expiryDate.toUTCString() + '; path=/; secure; samesite=strict';
              
              // Remove age verification overlay
              document.getElementById('edgeAgeVerification').remove();
              
              // Track age verification event
              if (typeof gtag !== 'undefined') {
                gtag('event', 'age_verification', {
                  event_category: 'compliance',
                  event_label: 'verified'
                });
              }
            } else {
              // Redirect to a safe page or close window
              window.location.href = 'https://www.google.com';
            }
          }
          
          // Prevent right-click and keyboard shortcuts on age verification
          document.getElementById('edgeAgeVerification').addEventListener('contextmenu', function(e) {
            e.preventDefault();
          });
          
          document.addEventListener('keydown', function(e) {
            if (document.getElementById('edgeAgeVerification')) {
              if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'J')) {
                e.preventDefault();
              }
            }
          });
        </script>
      `;
      
      // Insert age gate into HTML
      const modifiedHtml = html.replace('</head>', `${ageGateStyles}</head>`).replace('<body>', `<body>${ageGateHTML}`);
      
      return new Response(modifiedHtml, {
        status: response.status,
        headers: response.headers
      });
    }
  }
  
  return context.next();
};
