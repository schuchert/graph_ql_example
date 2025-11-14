#!/bin/sh
# Add an external link to a course template

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: $0 <course-template-id> <title> <external-url> [description] [order]"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
TITLE="$2"
EXTERNAL_URL="$3"
DESCRIPTION="${4:-}"
ORDER="${5:-1}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

# Build input object
INPUT="{ title: \\\"$TITLE\\\", externalUrl: \\\"$EXTERNAL_URL\\\", order: $ORDER"
if [ -n "$DESCRIPTION" ]; then
  INPUT="$INPUT, description: \\\"$DESCRIPTION\\\""
fi
INPUT="$INPUT }"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { courseTemplateAddLmsContentTypeExternal(courseTemplateId: \\\"$COURSE_TEMPLATE_ID\\\", input: $INPUT) { errors { field message } courseTemplate { id name updatedAt } } }\"
  }" | python3 -m json.tool

