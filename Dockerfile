# Build stage
FROM node:20-slim as development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Production stage
FROM development as production

# Build the project
RUN npm run build

# Install a simple http server
RUN npm install -g http-server

# Expose production port
EXPOSE 8080

# Start the server
CMD ["http-server", "dist", "-p", "8080"] 