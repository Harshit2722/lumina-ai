FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install nodemon globally for development hot-reloading
RUN npm install -g nodemon

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (this is also volume mounted in dev, but good practice for prod builds)
COPY . .

# Expose port
EXPOSE 5000

# Default command (overridden by docker-compose for dev)
CMD ["npm", "run", "dev"]
