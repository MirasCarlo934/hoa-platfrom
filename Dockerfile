FROM node:22-alpine

# Setup project files
WORKDIR /app
COPY . .

# Install dependencies and build the project
RUN npm install

# Run app
EXPOSE 9000
CMD ["node", "dist/app.js"]
