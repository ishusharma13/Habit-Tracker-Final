FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the remaining application code
COPY . .

# Make sure the main server file (server.js) is executable
RUN chmod +x /app/server.js

# Expose the port Cloud Run expects (8080)
EXPOSE 8080 

# Command to start the backend server
CMD ["node", "server.js"]

