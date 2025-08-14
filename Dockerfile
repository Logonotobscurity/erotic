# Use the official Nginx image as base
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from host to container
COPY . .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a non-root user to run the container
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the working directory to the nodejs user
RUN chown -R nextjs:nodejs /usr/share/nginx/html
RUN chown -R nextjs:nodejs /var/cache/nginx
RUN chown -R nextjs:nodejs /var/log/nginx
RUN chown -R nextjs:nodejs /etc/nginx/conf.d

# Create directories that nginx needs
RUN mkdir -p /var/cache/nginx/client_temp
RUN mkdir -p /var/cache/nginx/proxy_temp
RUN mkdir -p /var/cache/nginx/fastcgi_temp
RUN mkdir -p /var/cache/nginx/uwsgi_temp
RUN mkdir -p /var/cache/nginx/scgi_temp

RUN chown -R nextjs:nodejs /var/cache/nginx

# Expose port 80
EXPOSE 80

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
