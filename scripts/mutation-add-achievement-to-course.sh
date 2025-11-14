#!/bin/sh
# Add an achievement type to a course template

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <course-template-id> <achievement-name> [description] [points] [badge-url] [auto-award]"
  exit 1
fi

COURSE_TEMPLATE_ID="$1"
NAME="$2"
DESCRIPTION="${3:-}"
POINTS="${4:-50}"
BADGE_URL="${5:-}"
AUTO_AWARD="${6:-true}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

# Build input object
INPUT="{ name: \\\"$NAME\\\", points: $POINTS, autoAward: $AUTO_AWARD"
if [ -n "$DESCRIPTION" ]; then
  INPUT="$INPUT, description: \\\"$DESCRIPTION\\\""
fi
if [ -n "$BADGE_URL" ]; then
  INPUT="$INPUT, badgeUrl: \\\"$BADGE_URL\\\""
fi
INPUT="$INPUT }"

curl -s -X POST "$GRAPHQL_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"query\": \"mutation { courseTemplateAddAchievementType(courseTemplateId: \\\"$COURSE_TEMPLATE_ID\\\", input: $INPUT) { errors { field message } courseTemplate { id name achievementTypes { edges { node { id achievementType { id name points badgeUrl } autoAward } } } } } }\"
  }" | python3 -m json.tool

