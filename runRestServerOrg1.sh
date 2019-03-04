#!/usr/bin/env bash
BUSSINESS_NAME='composer'

composer card create -p ~/.composer/cards/PeerAdminOrg1@hlfv1/connection.json -u restadminOrg1 -n $BUSSINESS_NAME -c restadminOrg1/admin-pub.pem -k restadminOrg1/admin-priv.pem
rm -R restadminOrg1

composer card import -f restadminOrg1@$BUSSINESS_NAME.card
composer network ping -c restadminOrg1@$BUSSINESS_NAME
composer card export -f restadminOrg1@$BUSSINESS_NAME.card -c restadminOrg1@$BUSSINESS_NAME
docker container rm rest --force
docker container rm mongo --force

docker run -d --name mongo --network composer_default -p 27017:27017 mongo

COMPOSER_CARD=restadminOrg1@$BUSSINESS_NAME
COMPOSER_NAMESPACES=never
COMPOSER_AUTHENTICATION=true
COMPOSER_MULTIUSER=true
COMPOSER_PROVIDERS='{
    "google": {
        "provider": "google",
        "module": "passport-google-oauth2",
        "clientID": "127626644563-9o3mqseblm0pmk4lngfdsm7falkmdk8h.apps.googleusercontent.com",
        "clientSecret": "f1Fj3Wp27KcTeuRA2bY_PPZO",
        "authPath": "/auth/google",
        "callbackURL": "/auth/google/callback",
        "scope": "https://www.googleapis.com/auth/plus.login",
        "successRedirect": "http://localhost:4200/assets/success.html",
        "failureRedirect": "http://localhost:4200/assets/error.html"
    },
    "local": {
        "provider": "local",
        "module": "passport-local",
        "usernameField": "username",
        "passwordField": "password",
        "authPath": "/auth/local",
        "successRedirect": "/success",
        "failureRedirect": "/error"
    }
}'
COMPOSER_DATASOURCES='{
    "db": {
        "name": "db",
        "connector": "mongodb",
        "host": "mongo"
    }
}'
docker run \
-d \
-e COMPOSER_CARD=${COMPOSER_CARD} \
-e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
-e COMPOSER_AUTHENTICATION=${COMPOSER_AUTHENTICATION} \
-e COMPOSER_MULTIUSER=${COMPOSER_MULTIUSER} \
-e COMPOSER_PROVIDERS="${COMPOSER_PROVIDERS}" \
-e COMPOSER_DATASOURCES="${COMPOSER_DATASOURCES}" \
-v ~/.composer:/home/composer/.composer \
--name rest \
--network composer_default \
-p 3000:3000 \
myorg/composer-rest-server
