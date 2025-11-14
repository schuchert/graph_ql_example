#!/bin/sh
# Add a separator to a course template

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <course-template-id> <title> [order]"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
TITLE="$2"
ORDER="${3:-1}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { courseTemplateAddLmsContentTypeSeparator(courseTemplateId: \\\"$COURSE_TEMPLATE_ID\\\", input: { title: \\\"$TITLE\\\", order: $ORDER }) { errors { field message } courseTemplate { id name updatedAt } } }\"
  }" | python3 -m json.tool

