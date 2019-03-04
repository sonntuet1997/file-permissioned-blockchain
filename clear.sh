#!/usr/bin/env bash
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
docker volume rm --force $(docker volume ls -q)
rm -R ~/.composer/cards/
rm -R ~/.composer/client-data/
