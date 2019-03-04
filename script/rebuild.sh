#!/usr/bin/env bash
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
docker volume rm --force $(docker volume ls -q)
rm -R ~/.composer/cards/
rm -R ~/.composer/client-data/
./hlfv12/startFabricOrg1.sh
./rebuildOrg1.sh
./rebuildOrg2.sh
export HOST1=192.168.1.24
export HOST2=192.168.1.24

BUSSINESS_NAME='composer'
composer network start -c PeerAdminOrg1@hlfv1 -n $BUSSINESS_NAME --networkVersion 0.0.1 -o endorsementPolicyFile=./hlfv12/policy.json -A restadminOrg1 -C restadminOrg1/admin-pub.pem -A restadminOrg2 -C restadminOrg2/admin-pub.pem

./runRestServerOrg1.sh