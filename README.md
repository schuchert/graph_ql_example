# Administrate DX GraphQL Mock Server

A comprehensive, well-factored GraphQL mock server for integration testing using [graphql-mocks](https://www.graphql-mocks.com/). This server simulates the Administrate DX API based on the official API documentation.

## Features

- 🚀 Mock GraphQL API server running on localhost
- 📊 Built-in GraphiQL interface for testing queries
- 🎯 Complete Administrate DX schema simulation
- 📚 Full entity coverage: CourseTemplate, AchievementType, LMS Content Types
- 🔄 Comprehensive mutations for all entities
- 🔧 Well-factored, modular code structure
- 📖 Based on official Administrate DX API documentation

## Project Structure

```
graph_ql/
├── src/
│   ├── schema.graphql      # GraphQL schema definition
│   ├── schema.js           # Schema loader
│   ├── handler.js          # GraphQL handler configuration
│   ├── server.js           # HTTP server setup
│   ├── mocks/
│   │   └── resolvers.js    # Custom resolver functions
│   └── utils/
│       └── helpers.js      # Utility functions
├── scripts/                # Example query and mutation scripts
│   ├── query-*.sh         # Query examples
│   ├── mutation-*.sh      # Mutation examples
│   └── README.md          # Scripts documentation
├── package.json
├── README.md
└── MUTATIONS.md           # Complete mutations reference
```

## Installation

```bash
npm install
```

### Troubleshooting

If you encounter import errors with `graphql-mocks`, the package structure may have changed. You may need to install scoped packages instead:

```bash
npm install @graphql-mocks/handler @graphql-mocks/paper graphql
```

Then update the imports in `src/handler.js` to use the scoped packages.

## Usage

### Start the server

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:4000` (or the port specified in `PORT` environment variable).

### Endpoints

- **GraphQL API**: `POST http://localhost:4000/graphql`
- **GraphiQL Interface**: `GET http://localhost:4000/graphql`
- **Health Check**: `GET http://localhost:4000/health`

## Example Queries

### Query Course Templates with Pagination

```graphql
query {
  courseTemplates {
    edges {
      node {
        id
        name
        description
        code
        title
        learningMode
        lifecycleState
        createdAt
        updatedAt
        lmsContents {
          edges {
            node {
              ... on LmsResourceType {
                id
                title
                description
                resourceUrl
                order
                autoComplete
              }
              ... on LmsExternalType {
                id
                title
                description
                externalUrl
                order
              }
              ... on LmsSeparatorType {
                id
                title
                order
              }
            }
          }
        }
        achievementTypes {
          edges {
            node {
              achievementType {
                id
                name
                description
                points
                badgeUrl
              }
              autoAward
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Create Course Template

```graphql
mutation {
  createCourseTemplate(
    input: {
      name: "Advanced GraphQL"
      description: "Complete course on GraphQL"
      code: "GRP-101"
      title: "Advanced GraphQL Course"
      learningMode: LMS
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      description
      code
      title
      learningMode
      lifecycleState
      createdAt
      updatedAt
    }
  }
}
```

### Add LMS Resource to Course Template

```graphql
mutation {
  courseTemplateAddLmsContentTypeResource(
    courseTemplateId: "template-1"
    input: {
      title: "Introduction to GraphQL"
      description: "Learn the basics of GraphQL"
      resourceUrl: "https://example.com/resource"
      order: 1
      autoComplete: true
      displayName: "Intro Video"
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      updatedAt
    }
  }
}
```

### Create Achievement Type (Standalone)

```graphql
mutation {
  createAchievementType(
    input: {
      name: "GraphQL Expert"
      description: "Mastered GraphQL"
      points: 100
      badgeUrl: "https://example.com/badge.png"
    }
  ) {
    errors {
      field
      message
    }
    achievementType {
      id
      name
      description
      points
      badgeUrl
      createdAt
      updatedAt
    }
  }
}
```

### Add Achievement Type to Course Template

```graphql
mutation {
  courseTemplateAddAchievementType(
    courseTemplateId: "template-1"
    input: {
      name: "GraphQL Master"
      description: "Completed all GraphQL modules"
      points: 100
      badgeUrl: "https://example.com/badge.png"
      autoAward: true
    }
  ) {
    errors {
      field
      message
    }
    courseTemplate {
      id
      name
      achievementTypes {
        edges {
          node {
            achievementType {
              id
              name
              points
            }
            autoAward
          }
        }
      }
    }
  }
}
```

## Schema Overview

The mock server provides a complete simulation of the Administrate DX API with the following entities:

### Core Entities

- **CourseTemplate**: Course templates with full metadata (name, code, title, learningMode, lifecycleState, etc.)
- **AchievementType**: Achievement/badge system with points, badges, and certificate types
- **LmsContent** (Union): LMS content types
  - **LmsResourceType**: Internal resource content with documents and auto-completion
  - **LmsExternalType**: External link content
  - **LmsSeparatorType**: Visual separator in course structure
- **CourseTemplateAchievementType**: Join table linking courses to achievements

### Supporting Types

- **CertificateType**: Certificate types for achievements
- **Document**: Document management system integration
- **CustomFieldValue**: Custom field values
- **ExternalId**: External ID tracking
- **ExternalLog**: External integration logging
- **ContentComment**: Comments on LMS content

### Features

- **Pagination**: All list queries support cursor-based pagination via Connection types
- **Filtering**: Comprehensive filtering support with FilterOperation enums
- **Ordering**: Field-based ordering with ASC/DESC direction
- **Error Handling**: Mutations return structured error responses
- **Lifecycle Management**: Support for DRAFT, ACTIVE, ARCHIVED states
- **Learning Modes**: CLASSROOM, LMS, BLENDED, VIRTUAL modes

### Mutations

The schema includes complete CRUD operations for all entities:

- **CourseTemplate**: create, update, delete
- **AchievementType**: create, update, delete (standalone)
- **LMS Content**: add (Resource/External/Separator), update, remove
- **CourseTemplate AchievementType**: add, update, remove

## Example Scripts

The `scripts/` directory contains ready-to-use shell scripts for common queries and mutations:

### Quick Examples

```bash
echo "The State of the System==================="
./scripts/query-course-templates.sh
echo "=========================================="

./scripts/mutation-create-course-template.sh "GraphQL Basics" "Learn GraphQL" "GRP-101" LMS

./scripts/mutation-add-lms-resource.sh "template-id" "Introduction Video" "Watch this first" "https://example.com/video" 1

./scripts/mutation-create-achievement-type.sh "GraphQL Expert" "Mastered GraphQL" 100

echo "The State of the System==================="
./scripts/query-course-templates.sh
echo "=========================================="
```

See `scripts/README.md` for complete documentation of all available scripts.

## Customization

### Adding Custom Resolvers

Edit `src/mocks/resolvers.js` to customize the behavior of queries and mutations.

### Modifying the Schema

Update `src/schema.graphql` to add new types, queries, or mutations. The schema will be automatically reloaded when using `npm run dev`.

### Creating New Scripts

Add new scripts to the `scripts/` directory following the existing pattern. All scripts should:
- Accept command-line arguments for parameters
- Support `GRAPHQL_URL` environment variable
- Output JSON formatted results using `python3 -m json.tool`

## Development

The project uses ES modules (`type: "module"` in package.json) and requires Node.js 18+.

## License

MIT

