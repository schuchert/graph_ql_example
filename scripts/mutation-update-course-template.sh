#!/bin/sh
# Update an existing course template

if [ -z "$1" ]; then
  echo "Usage: $0 <course-template-id> [name] [description] [code]"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
NAME="${2:-Updated Course Name}"
DESCRIPTION="${3:-Updated description}"
CODE="${4:-}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

# Build the input object dynamically
INPUT="{ id: \\\"$COURSE_TEMPLATE_ID\\\", name: \\\"$NAME\\\", description: \\\"$DESCRIPTION\\\""
if [ -n "$CODE" ]; then
  INPUT="$INPUT, code: \\\"$CODE\\\""
fi
INPUT="$INPUT }"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { updateCourseTemplate(input: $INPUT) { errors { field message } courseTemplate { id name description code updatedAt } } }\"
  }" | python3 -m json.tool

