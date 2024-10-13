# FROM node:16-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["npm", "start"]

# Use a base image that includes Node.js
FROM node:18

# Set the working directory
WORKDIR /app

# Install Python and other dependencies
RUN apt-get update && apt-get install -y python3 python-is-python3

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the necessary port (replace with your actual port)
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]

