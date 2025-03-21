# Use the Node.js image
FROM node:19-alpine

# Set the working directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app uses
EXPOSE 8080

# Run the application
CMD ["node", "app.js"]