# Use the official Node.js 22 image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port
EXPOSE 4000

# Run the app
CMD ["node", "dist/main"]
