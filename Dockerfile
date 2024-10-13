# FROM node:16-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["npm", "start"]

FROM node:18-alpine

WORKDIR /home/ubuntu/pms_admin_web

COPY package*.json ./

# Install npm dependencies
RUN npm install


# Copy the rest of your application code
COPY . .
EXPOSE 9003
# Command to start your application
CMD ["npm", "start"]
