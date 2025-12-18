# Упрощенный Frontend Dockerfile для теста
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Create minimal React app if needed
RUN echo 'import React from "react"; import ReactDOM from "react-dom/client"; const root = ReactDOM.createRoot(document.getElementById("root")); root.render(<h1>CS2 Case Battle - Coming Soon</h1>);' > main.jsx
RUN echo '<!DOCTYPE html><html><head><title>CS2 Case Battle</title></head><body><div id="root"></div><script type="module" src="./main.jsx"></script></body></html>' > index.html

# Build the application
RUN echo "console.log('Build complete')" > build.js && mkdir -p dist && cp index.html dist/

# Production stage with nginx
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create minimal HTML for testing
RUN echo '<!DOCTYPE html><html><head><title>CS2 Case Battle</title></head><body><h1>CS2 Case Battle</h1><p>Site is under construction</p></body></html>' > /usr/share/nginx/html/index.html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]