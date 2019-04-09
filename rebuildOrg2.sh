#!/usr/bin/env bash

export HOST1=192.168.1.24
export HOST2=192.168.1.24

./hlfv12/startFabricOrg2.sh
./hlfv12/createPeerAdminCardOrg2.sh
composer network install --card PeerAdminOrg2@hlfv1 --archiveFile ./composer@0.0.1.bna
composer identity request -c PeerAdminOrg2@hlfv1 -u admin -s adminpw -d restadminOrg2
