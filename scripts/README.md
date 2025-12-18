# GraphQL Scripts

This directory contains shell scripts for common GraphQL queries and mutations. All scripts use `curl` and `jq` for making requests and formatting JSON responses.

## Prerequisites

- `curl` - For making HTTP requests
- `jq` - For JSON formatting (install with `brew install jq` on macOS or `apt-get install jq` on Linux)

## Available Scripts

### Query Scripts

#### `query-course-templates.sh`

Query all course templates with pagination.

**Usage:**
```bash
./scripts/query-course-templates.sh
```

**Example Output:**
```json
{
  "data": {
    "courseTemplates": {
      "edges": [
        {
          "cursor": "Y3Vyc29yXzA=",
          "node": {
            "id": "ct_1_1234567890",
            "code": "INTRO-101",
            "title": "Introduction to GraphQL",
            "lifecycleState": "draft",
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "hasPreviousPage": false,
        "startCursor": "Y3Vyc29yXzA=",
        "endCursor": "Y3Vyc29yXzA="
      }
    }
  }
}
```

### Mutation Scripts

#### `mutation-create-course-template.sh`

Create a new course template.

**Usage:**
```bash
./scripts/mutation-create-course-template.sh <code> <title> [lifecycleState]
```

**Arguments:**
- `code` (required) - Course template code (e.g., "ADV-201")
- `title` (required) - Course template title
- `lifecycleState` (optional) - Lifecycle state: "draft", "active", or "archived" (default: "draft")

**Examples:**
```bash
# Create with default lifecycle state (draft)
./scripts/mutation-create-course-template.sh "ADV-201" "Advanced GraphQL Patterns"

# Create with specific lifecycle state
./scripts/mutation-create-course-template.sh "ADV-201" "Advanced GraphQL Patterns" "active"
```

**Example Output:**
```json
{
  "data": {
    "courseTemplate": {
      "create": {
        "courseTemplate": {
          "id": "ct_2_1234567891",
          "code": "ADV-201",
          "title": "Advanced GraphQL Patterns",
          "lifecycleState": "draft",
          "createdAt": "2024-01-15T10:35:00.000Z",
          "updatedAt": "2024-01-15T10:35:00.000Z"
        },
        "errors": []
      }
    }
  }
}
```

#### `mutation-update-course-template.sh`

Update an existing course template.

**Usage:**
```bash
./scripts/mutation-update-course-template.sh <courseTemplateId> <title> [lifecycleState]
```

**Arguments:**
- `courseTemplateId` (required) - ID of the course template to update
- `title` (required) - New title for the course template
- `lifecycleState` (optional) - New lifecycle state

**Examples:**
```bash
# Update title only
./scripts/mutation-update-course-template.sh "ct_2_1234567891" "Advanced GraphQL Patterns and Best Practices"

# Update title and lifecycle state
./scripts/mutation-update-course-template.sh "ct_2_1234567891" "Advanced GraphQL Patterns" "active"
```

**Example Output:**
```json
{
  "data": {
    "courseTemplate": {
      "update": {
        "courseTemplate": {
          "id": "ct_2_1234567891",
          "code": "ADV-201",
          "title": "Advanced GraphQL Patterns and Best Practices",
          "lifecycleState": "active",
          "updatedAt": "2024-01-15T10:40:00.000Z"
        },
        "errors": []
      }
    }
  }
}
```

#### `mutation-clear-all-data.sh`

Clear all in-memory data from the store. Useful for testing and resetting.

**Usage:**
```bash
./scripts/mutation-clear-all-data.sh
```

**Example Output:**
```json
{
  "data": {
    "clearAllData": {
      "success": true,
      "message": "Cleared 5 items from in-memory storage",
      "itemsCleared": 5
    }
  }
}
```

## Environment Variables

All scripts support the `GRAPHQL_URL` environment variable to specify a different server URL:

```bash
# Use a different server
GRAPHQL_URL=http://localhost:5000/graphql ./scripts/query-course-templates.sh

# Or export it for the session
export GRAPHQL_URL=http://localhost:5000/graphql
./scripts/query-course-templates.sh
```

Default URL: `http://localhost:4000/graphql`

## Common Workflows

### 1. Query existing course templates
```bash
./scripts/query-course-templates.sh
```

### 2. Create a new course template
```bash
./scripts/mutation-create-course-template.sh "CODE-123" "My Course Title" "draft"
```

### 3. Update the course template
```bash
# First, get the ID from the query or create response, then:
./scripts/mutation-update-course-template.sh "ct_1_1234567890" "Updated Title" "active"
```

### 4. Clear all data and start fresh
```bash
./scripts/mutation-clear-all-data.sh
```

### 5. Complete workflow example
```bash
# Clear existing data
./scripts/mutation-clear-all-data.sh

# Create a course template
./scripts/mutation-create-course-template.sh "INTRO-101" "Introduction to GraphQL" "draft"

# Query to see it
./scripts/query-course-templates.sh

# Update it
./scripts/mutation-update-course-template.sh "ct_1_1234567890" "Introduction to GraphQL - Updated" "active"

# Query again to see the update
./scripts/query-course-templates.sh
```

## Error Handling

All scripts will display errors if they occur. For example, if you try to update a non-existent course template:

```json
{
  "data": {
    "courseTemplate": {
      "update": {
        "courseTemplate": null,
        "errors": [
          {
            "label": "courseTemplateId",
            "message": "Course Template with ID ct_invalid not found",
            "value": "ct_invalid"
          }
        ]
      }
    }
  }
}
```

## Troubleshooting

### Scripts are not executable
```bash
chmod +x scripts/*.sh
```

### jq not found
Install jq:
- macOS: `brew install jq`
- Ubuntu/Debian: `sudo apt-get install jq`
- Fedora: `sudo dnf install jq`

### Connection refused
Make sure the GraphQL server is running:
```bash
npm start
```

### Invalid JSON response
Check that the server is responding correctly:
```bash
curl http://localhost:4000/graphql
```

## Creating New Scripts

When creating new scripts, follow this pattern:

1. Use `GRAPHQL_URL` environment variable with default
2. Use `jq` for JSON formatting
3. Include usage instructions in comments
4. Handle errors gracefully
5. Make scripts executable

Example template:
```bash
#!/bin/bash

# Description of what the script does
# Usage: ./script-name.sh <args>

GRAPHQL_URL="${GRAPHQL_URL:-http://localhost:4000/graphql}"

QUERY_OR_MUTATION='
{
  # Your GraphQL query or mutation here
}
'

echo "Description of action..."
echo ""

curl -X POST "${GRAPHQL_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$QUERY_OR_MUTATION" | jq -Rs .)}" \
  | jq '.'
```

