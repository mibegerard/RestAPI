# Use Node.js LTS Alpine for smaller image
FROM node:20-alpine

# Set working directory
WORKDIR /app
RUN mkdir logs && chown -R 1001:1001 logs

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S restapi -u 1001 -G nodejs
USER restapi

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "src/server.js"]
