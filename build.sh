#!/bin/bash

set -e

export DOCKER_REGISTRY=${DOCKER_REGISTRY:-52.17.169.90:5000}
export BUILD_NUMBER=${BUILD_NUMBER:-1}

BASE_VERSION=`cat version.txt`
export BOOKING_DEMO_VERSION=${BASE_VERSION}.${BUILD_NUMBER}

echo "Build bookings-client"
cd bookings-client
docker build -t ${DOCKER_REGISTRY}/tikalk/bookings-client:${BOOKING_DEMO_VERSION} .
echo "Run unit tests"
docker run --rm -e CI=true --name bookings-client-test ${DOCKER_REGISTRY}/tikalk/bookings-client:${BOOKING_DEMO_VERSION} yarn test
cd -

echo "Build listings-gql"
cd listings-gql
docker build -t ${DOCKER_REGISTRY}/tikalk/listings-gql:${BOOKING_DEMO_VERSION} .
echo "Run unit tests"
docker run --rm -e CI=true --name listings-gql-test ${DOCKER_REGISTRY}/tikalk/listings-gql:${BOOKING_DEMO_VERSION} yarn test
cd -

echo "Build listings-service"
cd listings-service
docker build -t ${DOCKER_REGISTRY}/tikalk/listings-service:${BOOKING_DEMO_VERSION} .
echo "Run unit tests"
docker run --rm -e CI=true --name listings-service ${DOCKER_REGISTRY}/tikalk/listings-service:${BOOKING_DEMO_VERSION} yarn test
cd -

echo "Get demo data"
wget https://tikal-academy-mongo-seed-data.s3-eu-west-1.amazonaws.com/backup_data.tgz
tar xvfz backup_data.tgz

echo "Run integration test"
# TODO update docker-compose
docker-compose up -d
sleep 20

# echo "Load data"
docker exec bookings-demo_mongo_1 mongorestore --gzip /var/backup

INTTEST=`curl -I -s http://localhost:5000/\#/0 | grep "200 OK" | wc -l`

docker-compose stop
docker-compose rm -f

echo $INTTEST

if [[ "${INTTEST}" != "1" ]]
then
  echo "The test has failed!!"
  exit 1
else
  echo "Test has finished successfully"
fi

echo "Push docker images to the registry"
# docker push ${DOCKER_REGISTRY}/tikalk/bookings-client:${BOOKING_DEMO_VERSION}
# docker push ${DOCKER_REGISTRY}/tikalk/listings-gql:${BOOKING_DEMO_VERSION}
# docker push ${DOCKER_REGISTRY}/tikalk/listings-gql:${BOOKING_DEMO_VERSION}
