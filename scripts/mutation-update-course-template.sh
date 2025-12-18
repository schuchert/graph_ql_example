#!/bin/bash

# Mutation: Update Course Template
# Updates an existing course template
#
# Usage: ./mutation-update-course-template.sh <courseTemplateId> <title> [lifecycleState]
# Example: ./mutation-update-course-template.sh "ct_1_1234567890" "Updated Title" "active"

if [ $# -lt 2 ]; then
  echo "Usage: $0 <courseTemplateId> <title> [lifecycleState]"
  echo "Example: $0 \"ct_1_1234567890\" \"Updated Course Title\" \"active\""
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
TITLE="$2"
LIFECYCLE_STATE="${3:-}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

# Build the input object dynamically
INPUT_OBJ="title: \"$TITLE\""
if [ -n "$LIFECYCLE_STATE" ]; then
  INPUT_OBJ="$INPUT_OBJ, lifecycleState: \"$LIFECYCLE_STATE\""
fi

MUTATION=$(cat <<EOF
{
  courseTemplate {
    update(
      courseTemplateId: "$COURSE_TEMPLATE_ID"
      input: {
        $INPUT_OBJ
      }
    ) {
      courseTemplate {
        id
        code
        title
        lifecycleState
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

echo "Updating course template: $COURSE_TEMPLATE_ID"
echo ""

curl -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$MUTATION" | jq -Rs .)}" \
  | jq '.'

