#!/bin/sh
# Query all LMS contents

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { lmsContents { edges { node { ... on LmsResourceType { id title description resourceUrl order autoComplete displayName createdAt } ... on LmsExternalType { id title description externalUrl order autoComplete displayName createdAt } ... on LmsSeparatorType { id title order createdAt } } } pageInfo { hasNextPage hasPreviousPage } } }"
  }' | python3 -m json.tool

