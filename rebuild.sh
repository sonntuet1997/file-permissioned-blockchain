#!/usr/bin/env bash
./clear.sh
./rebuildOrg1.sh
./rebuildOrg2.sh

BUSSINESS_NAME='composer'
composer network start -c PeerAdminOrg1@hlfv1 -n $BUSSINESS_NAME --networkVersion 0.0.1 -o endorsementPolicyFile=./hlfv12/policy.json -A restadminOrg1 -C restadminOrg1/admin-pub.pem -A restadminOrg2 -C restadminOrg2/admin-pub.pem

./runRestServerOrg1.sh