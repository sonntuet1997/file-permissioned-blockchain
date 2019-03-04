#!/bin/bash

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

Usage() {
	echo ""
	echo "Usage: ./createPeerAdminOrg2Card.sh [-h host] [-n]"
	echo ""
	echo "Options:"
	echo -e "\t-h or --host:\t\t(Optional) name of the host to specify in the connection profile"
	echo -e "\t-n or --noimport:\t(Optional) don't import into card store"
	echo ""
	echo "Example: ./createPeerAdminOrg2Card.sh"
	echo ""
	exit 1
}

Parse_Arguments() {
	while [ $# -gt 0 ]; do
		case $1 in
			--help)
				HELPINFO=true
				;;
			--host | -h)
                shift
				HOST="$1"
				;;
            --noimport | -n)
				NOIMPORT=true
				;;
		esac
		shift
	done
}

Parse_Arguments $@

if [ "${HELPINFO}" == "true" ]; then
    Usage
fi

# Grab the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z "${HL_COMPOSER_CLI}" ]; then
  HL_COMPOSER_CLI=$(which composer)
fi

echo
# check that the composer command exists at a version >v0.16
COMPOSER_VERSION=$("${HL_COMPOSER_CLI}" --version 2>/dev/null)
COMPOSER_RC=$?

if [ $COMPOSER_RC -eq 0 ]; then
    AWKRET=$(echo $COMPOSER_VERSION | awk -F. '{if ($2<20) print "1"; else print "0";}')
    if [ $AWKRET -eq 1 ]; then
        echo Cannot use $COMPOSER_VERSION version of composer with fabric 1.2, v0.20 or higher is required
        exit 1
    else
        echo Using composer-cli at $COMPOSER_VERSION
    fi
else
    echo 'No version of composer-cli has been detected, you need to install composer-cli at v0.20 or higher'
    exit 1
fi

cat << EOF > dist/DevServerOrg2_connection.json
{
    "name": "hlfv1",
    "x-type": "hlfv1",
    "x-commitTimeout": 3000,
    "version": "1.0.0",
    "client": {
        "organization": "Org2",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "3000",
                    "eventHub": "3000",
                    "eventReg": "3000"
                },
                "orderer": "3000"
            }
        }
    },
    "channels": {
        "composerchannel": {
            "orderers": [
                "orderer.example.com"
            ],
            "peers": {
                "peer0.org1.example.com": {},
                "peer0.org2.example.com": {}
            }
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.org1.example.com"
            ]
        },
        "Org2": {
            "mspid": "Org2MSP",
            "peers": [
                "peer0.org2.example.com"
            ],
            "certificateAuthorities": [
                "ca.org2.example.com"
            ]
        }
    },
    "orderers": {
        "orderer.example.com": {
            "url": "grpcs://${HOST1}:7050",
            "grpcOptions": {
                "ssl-target-name-override": "orderer.example.com"
            },
            "tlsCACerts": {
                "pem": "-----BEGIN CERTIFICATE-----\nMIICNjCCAdygAwIBAgIRAOvdV+htjp/ju1qNxUiYriIwCgYIKoZIzj0EAwIwbDEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xFDASBgNVBAoTC2V4YW1wbGUuY29tMRowGAYDVQQDExF0bHNjYS5l\neGFtcGxlLmNvbTAeFw0xODA4MTcwNjQzMzlaFw0yODA4MTQwNjQzMzlaMGwxCzAJ\nBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4gRnJh\nbmNpc2NvMRQwEgYDVQQKEwtleGFtcGxlLmNvbTEaMBgGA1UEAxMRdGxzY2EuZXhh\nbXBsZS5jb20wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASEQyDDtl3NZ1ryxcCb\nVnfb+DCFo2Y6lU6ZJa5uuWINOG2KVfArhhpppVjFWWEm2Uu+CzcadXrF7fwYId0c\n8Og0o18wXTAOBgNVHQ8BAf8EBAMCAaYwDwYDVR0lBAgwBgYEVR0lADAPBgNVHRMB\nAf8EBTADAQH/MCkGA1UdDgQiBCAcWTYkgNEFYHFbmP4fudzVnH1eppNWseNR0bMc\n1VAAxjAKBggqhkjOPQQDAgNIADBFAiEA3H5wpbedc2gX1VbDfOtJvEVUZxvNdHq+\nS95cDGqFE78CIEUxtFserTZU8xPOYKC965MgGjPnHOnhpOyq2gweHAB5\n-----END CERTIFICATE-----\n"
            }}
    },
    "peers": {
        "peer0.org1.example.com": {
            "url": "grpcs://${HOST1}:7051",
            "eventUrl": "grpcs://${HOST1}:7053",
            "grpcOptions": {
                "ssl-target-name-override": "peer0.org1.example.com"
            },
            "tlsCACerts": {
                "pem": "-----BEGIN CERTIFICATE-----\nMIICSDCCAe+gAwIBAgIQS1/XjnNnBVLMm1zre9tlujAKBggqhkjOPQQDAjB2MQsw\nCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy\nYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEfMB0GA1UEAxMWdGxz\nY2Eub3JnMS5leGFtcGxlLmNvbTAeFw0xODA4MTcwNjQzMzlaFw0yODA4MTQwNjQz\nMzlaMHYxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQH\nEw1TYW4gRnJhbmNpc2NvMRkwFwYDVQQKExBvcmcxLmV4YW1wbGUuY29tMR8wHQYD\nVQQDExZ0bHNjYS5vcmcxLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0D\nAQcDQgAEMPwgPUidI72puyiD0YCHZzDnPL3fFXu42LFzGix5i8j+V7ECkd/oEh0d\nJrhyFp1d1O++L5E1FhNbGl5p9j51bKNfMF0wDgYDVR0PAQH/BAQDAgGmMA8GA1Ud\nJQQIMAYGBFUdJQAwDwYDVR0TAQH/BAUwAwEB/zApBgNVHQ4EIgQg+MhKB8S/Kk3f\n87wRfP0QbeCQm1dkuPXCZMcdEAcASU8wCgYIKoZIzj0EAwIDRwAwRAIgJpmjIDLo\nsOxGvD3/JFSXhyqOPHZKqdWUzSgI2QJxB1sCIDr8KD+gKNiHknfqK0wu7tST9ZoB\niHUMko/kacl9yA7L\n-----END CERTIFICATE-----\n"
            }  
        },
        "peer0.org2.example.com": {
            "url": "grpcs://${HOST2}:8051",
            "eventUrl": "grpcs://${HOST2}:8053",
            "grpcOptions": {
                "ssl-target-name-override": "peer0.org2.example.com"
            },
            "tlsCACerts": {
                "pem": "-----BEGIN CERTIFICATE-----\nMIICSjCCAfCgAwIBAgIRAI2uvhJYFu3dIm87k5/Wrp4wCgYIKoZIzj0EAwIwdjEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xGTAXBgNVBAoTEG9yZzIuZXhhbXBsZS5jb20xHzAdBgNVBAMTFnRs\nc2NhLm9yZzIuZXhhbXBsZS5jb20wHhcNMTgwODE3MDY0MzM5WhcNMjgwODE0MDY0\nMzM5WjB2MQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UE\nBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQb3JnMi5leGFtcGxlLmNvbTEfMB0G\nA1UEAxMWdGxzY2Eub3JnMi5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49\nAwEHA0IABPyTtpGB9zZOx0f6c2SQBxaM4mzDP7hJ7F+Si7e84mIxJ0OWr+Y5Ttf3\n22VPefzetJ7qRrUVAcaTfsYKBcr7IxyjXzBdMA4GA1UdDwEB/wQEAwIBpjAPBgNV\nHSUECDAGBgRVHSUAMA8GA1UdEwEB/wQFMAMBAf8wKQYDVR0OBCIEIEkXS3XpDzuW\nl8W3IdL24JwkTQmSEpJFj4YZ74v3AN4dMAoGCCqGSM49BAMCA0gAMEUCIQCS2v29\nnbUTDqlOLcESEq488ppSddsim5G0P+urVU8afgIgPHcFPBMbU+/ZTYKiRLFHzHZp\nPaqsIRHFnjAj/uMvSPw=\n-----END CERTIFICATE-----\n"
            }
        }
    },
    "certificateAuthorities": {
        "ca.org1.example.com": {
            "url": "https://${HOST1}:7054",
            "caName": "ca.org1.example.com",
            "registrar": {
                "enrollId": "admin",
                "enrollSecret": "adminpw"
            },
            "httpOptions":{
                "verify": false
            }},
        "ca.org2.example.com": {
            "url": "https://${HOST2}:8054",
            "caName": "ca.org2.example.com",
            "registrar": {
                "enrollId": "admin",
                "enrollSecret": "adminpw"
            },
            "httpOptions":{
                "verify": false
            } 
        }
    }
}
EOF

PRIVATE_KEY="${DIR}"/composer/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/27cfed76975cf395c5f826bbdb69fd67376539f589a5580140ac03caf294c3de_sk
CERT="${DIR}"/composer/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/signcerts/Admin@org2.example.com-cert.pem

if [ "${NOIMPORT}" != "true" ]; then
    CARDOUTPUT=/tmp/PeerAdminOrg2@hlfv1.card
else
    CARDOUTPUT=PeerAdminOrg2@hlfv1.card
fi

"${HL_COMPOSER_CLI}"  card create -p dist/DevServerOrg2_connection.json -u PeerAdminOrg2 -c "${CERT}" -k "${PRIVATE_KEY}" -r PeerAdmin -r ChannelAdmin --file $CARDOUTPUT

if [ "${NOIMPORT}" != "true" ]; then
    if "${HL_COMPOSER_CLI}"  card list -c PeerAdminOrg2@hlfv1 > /dev/null; then
        "${HL_COMPOSER_CLI}"  card delete -c PeerAdminOrg2@hlfv1
    fi
    "${HL_COMPOSER_CLI}"  card import --file /tmp/PeerAdminOrg2@hlfv1.card
    "${HL_COMPOSER_CLI}"  card list
    echo "Hyperledger Composer PeerAdminOrg2 card has been imported, host of fabric specified as '${HOST}'"
    rm /tmp/PeerAdminOrg2@hlfv1.card
else
    echo "Hyperledger Composer PeerAdminOrg2 card has been created, host of fabric specified as '${HOST}'"
fi
