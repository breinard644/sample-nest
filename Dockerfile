# Base image
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]
