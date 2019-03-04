#!/usr/bin/env bash

export HOST1=192.168.1.24
export HOST2=192.168.1.24


export CHANNEL_NAME=composerchannel
export ORDERER_CA=/etc/hyperledger/orderer/msp/tlscacerts/tlsca.example.com-cert.pem

./hlfv12/startFabricOrg1.sh
./hlfv12/createPeerAdminCardOrg1.sh
composer network install --card PeerAdminOrg1@hlfv1 --archiveFile ./composer@0.0.1.bna
composer identity request -c PeerAdminOrg1@hlfv1 -u admin -s adminpw -d restadminOrg1
