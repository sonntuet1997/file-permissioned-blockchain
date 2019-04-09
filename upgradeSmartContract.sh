#!/usr/bin/env bash

export CHANNEL_NAME=composerchannel
export ORDERER_CA=/etc/hyperledger/orderer/msp/tlscacerts/tlsca.example.com-cert.pem

composer network install --card PeerAdminOrg1@hlfv1 --archiveFile ./composer@0.0.2.bna
composer network install --card PeerAdminOrg2@hlfv1 --archiveFile ./composer@0.0.2.bna
composer network upgrade -c PeerAdminOrg1@hlfv1 -n composer -V 0.0.2
