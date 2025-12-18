# GraphQL Mock Server Template

This is a template for creating a GraphQL mock server that matches your generated GraphQL client code structure.

## Project Structure

```
.
├── README.md                 # This file
├── package.json              # Node.js dependencies
├── .gitignore                # Git ignore rules
├── src/
│   ├── server.js            # Main server entry point
│   ├── handler.js           # GraphQL handler setup
│   ├── schema.graphql       # YOUR SCHEMA GOES HERE
│   ├── mocks/
│   │   ├── resolvers.js     # Mock resolvers (auto-generated structure)
│   │   └── paper-store.js  # In-memory data store
│   └── utils/
│       └── helpers.js       # Utility functions
└── tests/                    # Example test files (optional)
    └── example.test.js
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Schema

The schema file `src/schema.graphql` has been populated with your Administrate GraphQL schema.

### 3. Add Your Generated Client Code

Your generated client code is located at:
- `/Users/brettschuchert/Downloads/graphql/main/com/fsi/tm2poc`

The mock server has been configured to match the structure found in your client code.

### 4. Update Resolvers

The `src/mocks/resolvers.js` file contains a template structure that matches your client code:

1. **Mutation Structure**: The nested structure matches your client:
   - `mutation { courseTemplate { create(...) } }`
   - `mutation { courseTemplate { update(...) } }`
   - Resolver structure: `courseTemplate: () => ({ create: ..., update: ... })`

2. **Response Types**: Mock responses match your generated response types:
   - `CourseTemplateCreateResponse` with `courseTemplate` and `errors` fields
   - `CourseTemplateUpdateResponse` with `courseTemplate` and `errors` fields
   - Error structure: `{ label, message, value }`

3. **Field Mappings**: Schema fields are mapped to your generated types

### 5. Start the Server

```bash
npm start
```

The server will run on `http://localhost:4000/graphql`

## Key Files to Customize

### `src/schema.graphql`
Your complete GraphQL schema. The mock server uses this to validate requests.

### `src/mocks/resolvers.js`
Contains the mock resolver functions. Key sections:
- `queryResolvers`: Query operations (e.g., `courseTemplates`, `courseTemplate`)
- `mutationResolvers`: Mutation operations with nested structure
  - `courseTemplate.create`: Creates a new course template
  - `courseTemplate.update`: Updates an existing course template
  - `clearAllData`: **Mock-only utility** to clear all in-memory data without restarting
- `fieldResolvers`: Field-level customizations

### `src/mocks/paper-store.js`
In-memory data store for persistence. **Data persists across requests until the server is restarted.** Currently supports:
- `createCourseTemplate(input)`: Create a new course template
- `updateCourseTemplate(id, input)`: Update an existing course template
- `getCourseTemplateById(id)`: Get a course template by ID
- `getAllCourseTemplates()`: Get all course templates
- `clear()`: Clear all data (used by the `clearAllData` mutation)

### `src/utils/helpers.js`
Utility functions for generating IDs, timestamps, pagination cursors, etc.

## Understanding Generated Client Structure

Based on your generated client code, the structure is:

1. **Mutation Structure**:
   ```kotlin
   // CreateCourseTemplate.kt
   mutation CreateCourseTemplate($input: CourseTemplateCreateInput!) {
       courseTemplate {
           create(input: $input) { ... }
       }
   }
   ```
   Resolver: `courseTemplate: () => ({ create: ... })`

2. **Response Structure**:
   ```kotlin
   // CourseTemplateCreateResponse.kt
   data class CourseTemplateCreateResponse(
       val courseTemplate: CourseTemplate?,
       val errors: List<FieldError>
   )
   ```
   Mock response includes both `courseTemplate` and `errors` fields.

3. **Error Structure**:
   ```kotlin
   // FieldError.kt
   data class FieldError(
       val label: String?,
       val message: String,
       val value: String?
   )
   ```
   Errors are returned in this exact format.

4. **Query Structure**:
   ```kotlin
   // CourseTemplatesQuery.kt
   query CourseTemplatesQuery {
       courseTemplates {
           edges {
               node { ... }
           }
           pageInfo { ... }
       }
   }
   ```
   Uses connection-based pagination with `edges`, `node`, and `pageInfo`.

## Data Persistence

**All mutations persist in memory until the server is restarted.** The `paper-store.js` uses a singleton pattern, so:
- ✅ Created entities persist across requests
- ✅ Updated entities persist across requests
- ✅ Data is shared across all requests to the server
- ⚠️ Data is lost when the server restarts (in-memory only)

To clear all data without restarting the server, use the `clearAllData` mutation (see below).

## Testing

You can test the mock server using:

1. **GraphiQL Interface**: Visit `http://localhost:4000/graphql` in your browser

2. **cURL**:
   ```bash
   # Create a course template
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "mutation CreateCourseTemplate($input: CourseTemplateCreateInput!) { courseTemplate { create(input: $input) { courseTemplate { id code title lifecycleState } errors { label message value } } } }",
       "variables": {
         "input": {
           "code": "TEST-001",
           "title": "Test Course"
         }
       }
     }'
   
   # Query course templates
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{
       "query": "{ courseTemplates { edges { node { id code title lifecycleState } } pageInfo { hasNextPage hasPreviousPage } } }"
     }'
   ```

3. **Your Generated Client**: Use your generated Kotlin client code to make requests

## Utility Mutations

### Clear All Data (Mock-Only)

This is a **mock-only utility mutation** that clears all in-memory data without restarting the server:

```graphql
mutation ClearAllData {
  clearAllData {
    success
    message
    itemsCleared
  }
}
```

**Response:**
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

**cURL Example:**
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { clearAllData { success message itemsCleared } }"
  }'
```

## Example Mutations

### Create Course Template
```graphql
mutation CreateCourseTemplate($input: CourseTemplateCreateInput!) {
  courseTemplate {
    create(input: $input) {
      courseTemplate {
        id
        code
        title
        lifecycleState
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

Variables:
```json
{
  "input": {
    "code": "TEST-001",
    "title": "Test Course Template",
    "lifecycleState": "draft"
  }
}
```

### Update Course Template
```graphql
mutation UpdateCourseTemplate($courseTemplateId: ID!, $input: CourseTemplateUpdateInput!) {
  courseTemplate {
    update(courseTemplateId: $courseTemplateId, input: $input) {
      courseTemplate {
        id
        code
        title
        lifecycleState
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

### Query Course Templates
```graphql
query CourseTemplatesQuery {
  courseTemplates {
    edges {
      node {
        id
        code
        title
        lifecycleState
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

## Tips

1. **Start Simple**: Begin with one mutation type, get it working, then add others
2. **Match Exactly**: The response structure must match your generated types exactly
3. **Use Paper Store**: The included Paper store provides in-memory persistence
4. **Check Logs**: The server logs all requests for debugging
5. **Extend Resolvers**: Add more resolvers as you need to support additional mutations and queries

## Docker

### Building the Docker Image

Build the Docker image:

```bash
npm run docker:build
```

Or use the script:

```bash
./scripts/docker-build-push.sh
```

### Pushing to Docker Hub

**Prerequisites:** You must be logged in to Docker Hub:
```bash
docker login
```

Push the image:

```bash
npm run docker:push
```

Or build and push in one command:

```bash
npm run docker:build:push
```

Or use the interactive script:

```bash
./scripts/docker-build-push.sh
```

The image will be published as: `schuchert/administrate:latest`

### Running the Docker Container

**Option 1: Using docker-compose (recommended)**

```bash
npm run docker:compose:up
```

Or manually:

```bash
docker-compose up -d
```

View logs:

```bash
npm run docker:compose:logs
```

Stop the container:

```bash
npm run docker:compose:down
```

**Option 2: Using docker run**

```bash
npm run docker:run
```

Or manually:

```bash
docker run -p 4000:4000 schuchert/administrate:latest
```

The GraphQL server will be available at `http://localhost:4000/graphql`

### Docker Commands Summary

- `npm run docker:build` - Build the Docker image
- `npm run docker:push` - Push to Docker Hub
- `npm run docker:build:push` - Build and push in one command
- `npm run docker:run` - Run the container locally (docker run)
- `npm run docker:compose:up` - Start container with docker-compose
- `npm run docker:compose:down` - Stop container with docker-compose
- `npm run docker:compose:logs` - View container logs
- `./scripts/docker-build-push.sh [version]` - Interactive build and push script

## Next Steps

1. ✅ Schema file is in place (`src/schema.graphql`)
2. ✅ Resolvers match your client code structure
3. ✅ Test with your generated client
4. **Extend as needed**: Add more mutations/queries as required
5. **Customize data**: Modify `paper-store.js` to add seed data or custom logic
6. **Deploy**: Build and push Docker image to Docker Hub

## Troubleshooting

- **Schema errors**: Make sure `src/schema.graphql` is valid GraphQL
- **Resolver errors**: Check that resolver structure matches your client code
- **Type mismatches**: Ensure response types match your generated Kotlin types exactly
- **Port conflicts**: Change `PORT` in `src/server.js` if 4000 is in use

