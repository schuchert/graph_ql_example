#!/bin/sh
# Query a specific course template by ID

if [ -z "$1" ]; then
  echo "Usage: $0 <course-template-id>"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"query { courseTemplate(id: \\\"$COURSE_TEMPLATE_ID\\\") { id legacyId name description code title learningMode lifecycleState createdAt updatedAt lmsContents { edges { node { ... on LmsResourceType { id title description resourceUrl order autoComplete } ... on LmsExternalType { id title description externalUrl order } ... on LmsSeparatorType { id title order } } } } achievementTypes { edges { node { id achievementType { id name description points badgeUrl } autoAward } } } } }\"
  }" | python3 -m json.tool

