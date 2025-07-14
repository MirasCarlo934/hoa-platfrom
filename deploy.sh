#!/bin/bash

docker build --platform=linux/amd64 -t cpmiras/c8yhub:latest .
docker push cpmiras/c8yhub:latest

# # SFTP upload docker-compose.yml to remote server
# sftp user@your.remote.host <<EOF
# put docker-compose.yml /remote/path/to/docker-compose.yml
# bye
# EOF