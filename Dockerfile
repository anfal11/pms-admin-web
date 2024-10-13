# Step 1: Use an official Node.js image
FROM node:16-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the entire project into the container
COPY . .

# Step 5: Expose the React app's default port
EXPOSE 3000

# Step 6: Set environment variables (optional)
ENV SKIP_PREFLIGHT_CHECK=true
ENV REACT_APP_BASENAME=""

# Step 7: Start the React development server
CMD ["npm", "start"]
