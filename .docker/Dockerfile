# Use the official Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies (clean & fast)
RUN npm ci

# Copy the rest of the app
COPY . .

# Set environment to development to ensure error overlays are active
ENV NODE_ENV=development

# Expose the port Vite uses
EXPOSE 5173

# Start Vite dev server with host exposed
CMD ["sh", "-c", "npm run dev -- --host"]
