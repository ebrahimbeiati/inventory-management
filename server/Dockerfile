# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Create app user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Install production dependencies only
RUN npm ci --production && \
    npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Use non-root user for security
USER appuser

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.js"] 