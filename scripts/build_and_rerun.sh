#!/bin/sh

open -a Docker
docker stop graphql-mock-server 
docker container remove graphql-mock-server 
docker build -t administrate-dx-graphql-mock . 
docker run -d --name graphql-mock-server -p 4000:4000 administrate-dx-graphql-mock
sleep 2 
open http://localhost:4000/graphql
