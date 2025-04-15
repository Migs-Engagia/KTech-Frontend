# Use the official Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Install dependencies (leveraging Docker cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Force Vite to use polling (best for Docker + bind mounts)
ENV CHOKIDAR_USEPOLLING=true

# Optional: improves debugging overlays
ENV NODE_ENV=development

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server, bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host"]
