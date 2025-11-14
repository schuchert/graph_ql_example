#!/bin/sh
# Query all course templates with pagination

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { courseTemplates { edges { node { id name description code title learningMode lifecycleState createdAt updatedAt } } pageInfo { hasNextPage hasPreviousPage startCursor endCursor } } }"
  }' | python3 -m json.tool

