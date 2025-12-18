#!/bin/bash

# Query: Get Course Templates
# Fetches all course templates with pagination support

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

QUERY='
{
  courseTemplates(first: 10) {
    edges {
      cursor
      node {
        id
        code
        title
        lifecycleState
        createdAt
        updatedAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
'

echo "Querying course templates from ${GRAPHQL_URL}..."
echo ""

curl -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$QUERY" | jq -Rs .)}" \
  | jq '.'

