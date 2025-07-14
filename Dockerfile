FROM node:22-alpine

# Setup project files
WORKDIR /app
COPY . .

# Install dependencies
RUN npm install

# Run app
EXPOSE 9000
CMD ["npm", "start"]
