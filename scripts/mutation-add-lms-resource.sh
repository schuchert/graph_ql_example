#!/bin/sh
# Add an LMS resource to a course template

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <course-template-id> <title> [description] [resource-url] [order]"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
TITLE="$2"
DESCRIPTION="${3:-}"
RESOURCE_URL="${4:-https://example.com/resource}"
ORDER="${5:-1}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

# Build input object
INPUT="{ title: \\\"$TITLE\\\", resourceUrl: \\\"$RESOURCE_URL\\\", order: $ORDER"
if [ -n "$DESCRIPTION" ]; then
  INPUT="$INPUT, description: \\\"$DESCRIPTION\\\""
fi
INPUT="$INPUT }"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { courseTemplateAddLmsContentTypeResource(courseTemplateId: \\\"$COURSE_TEMPLATE_ID\\\", input: $INPUT) { errors { field message } courseTemplate { id name updatedAt } } }\"
  }" | python3 -m json.tool

