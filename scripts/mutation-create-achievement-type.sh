#!/bin/sh
# Create a new achievement type

if [ -z "$1" ]; then
  echo "Usage: $0 <name> [description] [points] [badge-url]"
  exit 1
fi

NAME="$1"
DESCRIPTION="${2:-}"
POINTS="${3:-100}"
BADGE_URL="${4:-}"

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

# Build input object
INPUT="{ name: \\\"$NAME\\\", points: $POINTS"
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
    \"query\": \"mutation { createAchievementType(input: $INPUT) { errors { field message } achievementType { id legacyId name description points badgeUrl createdAt updatedAt } } }\"
  }" | python3 -m json.tool

