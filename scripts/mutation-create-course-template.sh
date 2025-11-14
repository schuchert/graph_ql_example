#!/bin/sh
# Create a new course template

NAME="${1:-Introduction to GraphQL}"
DESCRIPTION="${2:-Learn the fundamentals of GraphQL}"
CODE="${3:-GRP-101}"
LEARNING_MODE="${4:-LMS}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { createCourseTemplate(input: { name: \\\"$NAME\\\", description: \\\"$DESCRIPTION\\\", code: \\\"$CODE\\\", learningMode: $LEARNING_MODE }) { errors { field message } courseTemplate { id legacyId name description code title learningMode lifecycleState createdAt updatedAt } } }\"
  }" | python3 -m json.tool

