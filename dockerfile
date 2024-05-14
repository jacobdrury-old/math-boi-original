# Use the official Node.js 14 image as the base image
FROM node:14.16.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Set environment variables (if you have any in your .env file, copy it)
COPY .env .env

# Define the command to run the application
CMD ["npm", "start"]
