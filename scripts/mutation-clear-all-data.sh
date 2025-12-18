#!/bin/bash

# Mutation: Clear All Data
# Clears all in-memory data from the store
# Useful for testing and resetting the server state

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

MUTATION='
mutation {
  clearAllData {
    success
    message
    itemsCleared
  }
}
'

echo "Clearing all data from ${GRAPHQL_URL}..."
echo ""

curl -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$MUTATION" | jq -Rs .)}" \
  | jq '.'

