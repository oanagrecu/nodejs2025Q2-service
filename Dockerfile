# Use Node.js LTS version
FROM node:22-alpine

# Set working directory
WORKDIR /app


# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "dist/src/main.js"]

