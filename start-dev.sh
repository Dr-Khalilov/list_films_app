#!/bin/bash

#################################
## Run application in DEV mode ##
#################################

started_at=$(date +"%s")

echo "-----> Provisioning containers"
docker-compose --file docker-compose.yaml build
docker-compose --file docker-compose.yaml up
echo ""

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m ${seconds}s"