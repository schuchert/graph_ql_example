#!/bin/sh
# Delete a course template

if [ -z "$1" ]; then
  echo "Usage: $0 <course-template-id>"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { deleteCourseTemplate(id: \\\"$COURSE_TEMPLATE_ID\\\") }\"
  }" | python3 -m json.tool

