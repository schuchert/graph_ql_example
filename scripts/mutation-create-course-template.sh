#!/bin/bash

# Mutation: Create Course Template
# Creates a new course template
#
# Usage: ./mutation-create-course-template.sh <code> <title> [lifecycleState]
# Example: ./mutation-create-course-template.sh "ADV-201" "Advanced GraphQL" "draft"

if [ $# -lt 2 ]; then
  echo "Usage: $0 <code> <title> [lifecycleState]"
  echo "Example: $0 \"ADV-201\" \"Advanced GraphQL Patterns\" \"draft\""
  exit 1
fi

CODE="$1"
TITLE="$2"
LIFECYCLE_STATE="${3:-draft}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

# Build the input object - enum values must be unquoted in GraphQL
INPUT_OBJ="code: \"$CODE\", title: \"$TITLE\""
if [ -n "$LIFECYCLE_STATE" ]; then
  INPUT_OBJ="$INPUT_OBJ, lifecycleState: $LIFECYCLE_STATE"
fi

MUTATION=$(cat <<EOF
mutation {
  courseTemplate {
    create(input: {
      $INPUT_OBJ
    }) {
      courseTemplate {
        id
        code
        title
        lifecycleState
        createdAt
        updatedAt
      }
      errors {
        label
        message
        value
      }
    }
  }
}
EOF
)

echo "Creating course template: $CODE - $TITLE"
echo ""

curl -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$MUTATION" | jq -Rs .)}" \
  | jq '.'

