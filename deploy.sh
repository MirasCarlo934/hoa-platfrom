#!/bin/bash

# Create temporary .stage directory for deployment. 
# Copies all contents except .stage, .git, and .gitignore
mkdir -p .stage
rsync -av --progress ./ .stage --exclude .stage --exclude .git --exclude .gitignore
cd .stage

# Replace .env with .env-stage
cp .env-stage .env
rm .env-stage

# Deploy prisma migrations
npx prisma migrate deploy

# Build and push Docker image
cd .stage
docker build --platform=linux/amd64 -t cpmiras/c8yhub:latest .
docker push cpmiras/c8yhub:latest

# Delete .stage directory
cd ..
rm -rf .stage

# # SFTP upload docker-compose.yml to remote server
# sftp user@your.remote.host <<EOF
# put docker-compose.yml /remote/path/to/docker-compose.yml
# bye
# EOF