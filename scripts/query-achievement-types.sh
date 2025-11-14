#!/bin/sh
# Query all achievement types

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { achievementTypes { edges { node { id legacyId name description points badgeUrl createdAt updatedAt } } pageInfo { hasNextPage hasPreviousPage } } }"
  }' | python3 -m json.tool

