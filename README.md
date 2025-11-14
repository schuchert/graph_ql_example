# GraphQL Mock Server

A well-factored GraphQL mock server for integration testing using [graphql-mocks](https://www.graphql-mocks.com/).

## Features

- 🚀 Mock GraphQL API server running on localhost
- 📊 Built-in GraphiQL interface for testing queries
- 🎯 Simulated entities based on CourseTemplate and LMS content types
- 💾 Stateful mutations using graphql-paper in-memory store
- 🔧 Well-factored, modular code structure

## Project Structure

```
graph_ql/
├── src/
│   ├── schema.graphql      # GraphQL schema definition
│   ├── schema.js           # Schema loader
│   ├── handler.js          # GraphQL handler configuration
│   ├── server.js           # HTTP server setup
│   └── mocks/
│       └── resolvers.js    # Custom resolver functions
├── package.json
└── README.md
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

### Query Course Templates

```graphql
query {
  courseTemplates {
    id
    name
    description
    lmsContentTypes {
      ... on LmsResourceType {
        id
        title
        resourceUrl
      }
      ... on LmsExternalType {
        id
        title
        externalUrl
      }
      ... on LmsSeparatorType {
        id
        title
      }
    }
    achievementTypes {
      id
      name
      points
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
    }
  ) {
    id
    name
    lmsContentTypes {
      ... on LmsResourceType {
        id
        title
        resourceUrl
      }
    }
  }
}
```

### Add Achievement Type

```graphql
mutation {
  courseTemplateAddAchievementType(
    courseTemplateId: "template-1"
    input: {
      name: "GraphQL Master"
      description: "Completed all GraphQL modules"
      points: 100
      badgeUrl: "https://example.com/badge.png"
    }
  ) {
    id
    achievementTypes {
      id
      name
      points
    }
  }
}
```

## Schema Overview

The mock server simulates the following entities:

- **CourseTemplate**: Represents a course template with LMS content and achievements
- **LmsContentType** (Union): Can be Resource, External, or Separator
  - **LmsResourceType**: Internal resource content
  - **LmsExternalType**: External link content
  - **LmsSeparatorType**: Visual separator in course structure
- **AchievementType**: Achievement/badge system for courses

## Customization

### Adding Custom Resolvers

Edit `src/mocks/resolvers.js` to customize the behavior of queries and mutations.

### Modifying the Schema

Update `src/schema.graphql` to add new types, queries, or mutations. The schema will be automatically reloaded when using `npm run dev`.

## Development

The project uses ES modules (`type: "module"` in package.json) and requires Node.js 18+.

## License

MIT

