#!/bin/sh
# Remove an achievement type from a course template

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <course-template-id> <achievement-type-id>"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
ACHIEVEMENT_TYPE_ID="$2"
GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { courseTemplateRemoveAchievementType(courseTemplateId: \\\"$COURSE_TEMPLATE_ID\\\", achievementTypeId: \\\"$ACHIEVEMENT_TYPE_ID\\\") { errors { field message } courseTemplate { id name updatedAt } } }\"
  }" | python3 -m json.tool

