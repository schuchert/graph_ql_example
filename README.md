# Administrate GraphQL Mock Server

A GraphQL mock server for the Administrate API that matches the generated client code structure from Kotlin/Java. This server provides in-memory data storage using a Paper-like store pattern and supports the nested mutation structure used by the Administrate GraphQL API.

## Features

- 🚀 **GraphQL Mock Server** - Full GraphQL API simulation
- 📊 **GraphiQL Interface** - Built-in GraphQL playground for testing
- 💾 **In-Memory Storage** - Paper-like store for data persistence
- 🔄 **Nested Mutations** - Supports the Administrate mutation pattern
- 🧹 **Data Management** - Utility mutation to clear all data
- 📦 **Docker Support** - Easy deployment with Docker

## Project Structure

```
graph_ql/
├── src/
│   ├── schema.graphql          # GraphQL schema definition
│   ├── handler.js              # Schema loader and resolver setup
│   ├── server.js               # Express + Apollo Server setup
│   ├── mocks/
│   │   ├── resolvers.js        # GraphQL resolvers
│   │   └── paper-store.js      # In-memory data store
│   └── utils/
│       └── helpers.js          # Utility functions
├── scripts/                    # Example query and mutation scripts
│   ├── query-course-templates.sh
│   ├── mutation-create-course-template.sh
│   ├── mutation-update-course-template.sh
│   └── mutation-clear-all-data.sh
├── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Setup

```bash
npm install
```

## Running the Server

### Local Development

```bash
npm start
```

Or with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:4000` (or the port specified in `PORT` environment variable).

### Docker

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run

# Or use docker-compose
npm run docker:compose:up
```

## Endpoints

- **GraphQL API**: `POST http://localhost:4000/graphql`
- **GraphiQL Interface**: `GET http://localhost:4000/graphql`
- **Health Check**: The server responds to GraphQL queries on `/graphql`

## GraphQL Queries and Mutations

### Query: Get Course Templates

Query all course templates with pagination support.

**GraphQL Query:**
```graphql
query {
  courseTemplates(first: 10) {
    edges {
      cursor
      node {
        id
        code
        title
        lifecycleState
        createdAt
        updatedAt
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

**Example Response:**
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

**Script:**
```bash
./scripts/query-course-templates.sh
```

### Mutation: Create Course Template

Create a new course template using the nested mutation pattern.

**GraphQL Mutation:**
```graphql
mutation {
  courseTemplate {
    create(input: {
      code: "ADV-201"
      title: "Advanced GraphQL Patterns"
      lifecycleState: "draft"
    }) {
      courseTemplate {
        id
        code
        title
        lifecycleState
        createdAt
        updatedAt
      }
      errors {
        label
        message
        value
      }
    }
  }
}
```

**Example Response:**
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

**Script:**
```bash
./scripts/mutation-create-course-template.sh "ADV-201" "Advanced GraphQL Patterns" "draft"
```

### Mutation: Update Course Template

Update an existing course template.

**GraphQL Mutation:**
```graphql
mutation {
  courseTemplate {
    update(
      courseTemplateId: "ct_2_1234567891"
      input: {
        title: "Advanced GraphQL Patterns and Best Practices"
        lifecycleState: "active"
      }
    ) {
      courseTemplate {
        id
        code
        title
        lifecycleState
        updatedAt
      }
      errors {
        label
        message
        value
      }
    }
  }
}
```

**Example Response:**
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

**Script:**
```bash
./scripts/mutation-update-course-template.sh "ct_2_1234567891" "Advanced GraphQL Patterns and Best Practices" "active"
```

### Mutation: Clear All Data

Clear all in-memory data. Useful for testing and resetting the server state without restarting.

**GraphQL Mutation:**
```graphql
mutation {
  clearAllData {
    success
    message
    itemsCleared
  }
}
```

**Example Response:**
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

**Script:**
```bash
./scripts/mutation-clear-all-data.sh
```

## Error Handling

All mutations return an `errors` array. If validation fails or an error occurs, the mutation will return errors with details:

```graphql
{
  "data": {
    "courseTemplate": {
      "create": {
        "courseTemplate": null,
        "errors": [
          {
            "label": "code",
            "message": "Code is required",
            "value": null
          },
          {
            "label": "title",
            "message": "Title is required",
            "value": null
          }
        ]
      }
    }
  }
}
```

## Using the Scripts

All scripts are located in the `scripts/` directory and can be executed directly:

```bash
# Make scripts executable (if needed)
chmod +x scripts/*.sh

# Query course templates
./scripts/query-course-templates.sh

# Create a course template
./scripts/mutation-create-course-template.sh "CODE-123" "Course Title" "draft"

# Update a course template
./scripts/mutation-update-course-template.sh "ct_1_1234567890" "New Title" "active"

# Clear all data
./scripts/mutation-clear-all-data.sh
```

### Script Environment Variables

All scripts support the `GRAPHQL_URL` environment variable to specify a different server URL:

```bash
GRAPHQL_URL=http://localhost:5000/graphql ./scripts/query-course-templates.sh
```

## Data Storage

The server uses an in-memory Paper-like store (`src/mocks/paper-store.js`) that:

- Persists data across requests during server runtime
- Automatically generates unique IDs for new entities
- Supports CRUD operations for course templates
- Can be cleared using the `clearAllData` mutation

**Note:** Data is lost when the server restarts. This is intentional for a mock server.

## Development

### Project Structure

- **`src/handler.js`**: Loads the GraphQL schema and creates executable schema with resolvers
- **`src/mocks/resolvers.js`**: Contains all GraphQL resolvers (queries, mutations, field resolvers)
- **`src/mocks/paper-store.js`**: In-memory data store singleton
- **`src/utils/helpers.js`**: Utility functions for ID generation, timestamps, pagination, etc.

### Adding New Resolvers

1. Add the resolver function to `src/mocks/resolvers.js`
2. Add the corresponding schema definition to `src/schema.graphql` (if not already present)
3. The resolver will be automatically picked up by the schema builder

### Adding New Store Methods

1. Add methods to the `PaperStore` class in `src/mocks/paper-store.js`
2. Use the singleton instance exported by the module
3. Access via `require('./mocks/paper-store')` in resolvers

## Testing

You can test the API using:

1. **GraphiQL Interface**: Visit `http://localhost:4000/graphql` in your browser
2. **cURL**: Use the provided scripts or create your own
3. **Postman/Insomnia**: Import the GraphQL endpoint
4. **Your Client Code**: Point your generated Kotlin/Java client to the mock server

## Troubleshooting

### Server won't start

- Check that port 4000 is not already in use
- Verify all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be 16+)

### Queries return empty results

- Use the `clearAllData` mutation to reset, then create new data
- Check that mutations are succeeding (no errors in response)

### Schema errors

- Ensure `src/schema.graphql` is valid GraphQL
- Check that resolver return types match schema definitions

## License

ISC
