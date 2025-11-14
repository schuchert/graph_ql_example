# Example Scripts

This directory contains example shell scripts for querying and mutating the Administrate DX GraphQL mock server.

## Usage

All scripts can be run directly. Most scripts accept command-line arguments. Set the `GRAPHQL_URL` environment variable to point to a different server (defaults to `http://localhost:4000/graphql`).

## Query Scripts

### query-course-templates.sh
Query all course templates with pagination.

```bash
./query-course-templates.sh
```

### query-course-template.sh
Query a specific course template by ID.

```bash
./query-course-template.sh <course-template-id>
```

### query-achievement-types.sh
Query all achievement types.

```bash
./query-achievement-types.sh
```

### query-lms-contents.sh
Query all LMS contents.

```bash
./query-lms-contents.sh
```

## Mutation Scripts

### mutation-create-course-template.sh
Create a new course template.

```bash
./mutation-create-course-template.sh [name] [description] [code] [learning-mode]
```

Example:
```bash
./mutation-create-course-template.sh "GraphQL Basics" "Learn GraphQL" "GRP-101" LMS
```

### mutation-update-course-template.sh
Update an existing course template.

```bash
./mutation-update-course-template.sh <course-template-id> [name] [description] [code]
```

Example:
```bash
./mutation-update-course-template.sh "template-123" "Updated Name" "New description" "GRP-102"
```

### mutation-delete-course-template.sh
Delete a course template.

```bash
./mutation-delete-course-template.sh <course-template-id>
```

### mutation-add-lms-resource.sh
Add an LMS resource to a course template.

```bash
./mutation-add-lms-resource.sh <course-template-id> <title> [description] [resource-url] [order]
```

Example:
```bash
./mutation-add-lms-resource.sh "template-123" "Introduction Video" "Watch this first" "https://example.com/video" 1
```

### mutation-add-lms-external.sh
Add an external link to a course template.

```bash
./mutation-add-lms-external.sh <course-template-id> <title> <external-url> [description] [order]
```

Example:
```bash
./mutation-add-lms-external.sh "template-123" "GraphQL Docs" "https://graphql.org" "Official documentation" 2
```

### mutation-add-lms-separator.sh
Add a separator to a course template.

```bash
./mutation-add-lms-separator.sh <course-template-id> <title> [order]
```

Example:
```bash
./mutation-add-lms-separator.sh "template-123" "Section Break" 3
```

### mutation-remove-lms-content.sh
Remove LMS content from a course template.

```bash
./mutation-remove-lms-content.sh <course-template-id> <content-id>
```

### mutation-create-achievement-type.sh
Create a new achievement type (standalone).

```bash
./mutation-create-achievement-type.sh <name> [description] [points] [badge-url]
```

Example:
```bash
./mutation-create-achievement-type.sh "GraphQL Expert" "Mastered GraphQL" 100 "https://example.com/badge.png"
```

### mutation-add-achievement-to-course.sh
Add an achievement type to a course template.

```bash
./mutation-add-achievement-to-course.sh <course-template-id> <achievement-name> [description] [points] [badge-url] [auto-award]
```

Example:
```bash
./mutation-add-achievement-to-course.sh "template-123" "Course Completion" "Completed the course" 50 "https://example.com/badge.png" true
```

### mutation-remove-achievement-from-course.sh
Remove an achievement type from a course template.

```bash
./mutation-remove-achievement-from-course.sh <course-template-id> <achievement-type-id>
```

## Complete Workflow Example

```bash
echo "The State of the System==================="
./scripts/query-course-templates.sh
echo "=========================================="

TEMPLATE_ID=$(./mutation-create-course-template.sh "Full Stack Course" "Learn full stack" "FSD-101" LMS | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created template: $TEMPLATE_ID"

./mutation-add-lms-resource.sh "$TEMPLATE_ID" "Module 1" "Introduction" "https://example.com/module1" 1
./mutation-add-lms-external.sh "$TEMPLATE_ID" "External Docs" "https://example.com/docs" "Additional resources" 2

ACHIEVEMENT_ID=$(./mutation-create-achievement-type.sh "Course Completion" "Completed the course" 100 | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Created achievement: $ACHIEVEMENT_ID"

./mutation-add-achievement-to-course.sh "$TEMPLATE_ID" "Course Completion" "Awarded on completion" 100 "https://example.com/badge.png" true

./query-course-template.sh "$TEMPLATE_ID"

echo "The State of the System==================="
./scripts/query-course-templates.sh
echo "=========================================="

```

## Environment Variables

- `GRAPHQL_URL`: Override the default GraphQL endpoint (default: `http://localhost:4000/graphql`)

Example:
```bash
GRAPHQL_URL=http://localhost:5000/graphql ./query-course-templates.sh
```

