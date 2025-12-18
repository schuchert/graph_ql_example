# GraphQL API Tests

Simple JUnit test project demonstrating Spring Boot and Spring GraphQL integration with the Administrate DX GraphQL Mock Server.

## Requirements

- Java 25 (Amazon Corretto or compatible)
- Gradle 9.0+ (wrapper included)
- GraphQL Mock Server running on http://localhost:4000
- Docker (optional, for containerized builds and tests)

**Note:** This project uses Java 25 with Spring Boot 3.4.0. The `spring.classformat.ignore=true` system property is set to work around Spring's ASM compatibility with Java 25 class files.

## Project Structure

```
java-tests/
├── build.gradle.kts              # Gradle build (Kotlin DSL)
├── settings.gradle.kts            # Gradle settings
├── Dockerfile                     # Docker build configuration
├── .dockerignore                  # Docker ignore patterns
├── docker-build.sh                # Docker build helper script
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/administrate/graphql/
│   │   │       ├── GraphQLApplication.java
│   │   │       ├── config/GraphQLConfig.java
│   │   │       └── model/
│   │   │           ├── AchievementType.java
│   │   │           ├── CourseTemplate.java
│   │   │           └── [other model classes]
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/administrate/graphql/
│               ├── AchievementTypeTest.java
│               └── CourseTemplateTest.java
└── README.md
```

## Running Tests Locally

### 1. Start the GraphQL Mock Server

From the project root:

```bash
npm start
```

Or using Docker:

```bash
docker run -d -p 4000:4000 --name administrate-dx schuchert/administrate:latest
```

### 2. Verify Server is Running

```bash
curl http://localhost:4000/health
```

### 3. Run the Tests

```bash
cd java-tests
./gradlew test
```

## Build Commands

```bash
# Clean build
./gradlew clean build

# Run tests only
./gradlew test

# View test report
open build/reports/tests/test/index.html
```

## Test Description

The test suite includes:

### AchievementTypeTest
- Creates achievement types via GraphQL mutation
- Updates achievement types
- Filters achievement types by name and lifecycle state
- Verifies creation and updates were successful

### CourseTemplateTest
- Creates course templates via GraphQL mutation
- Updates course templates
- Filters course templates by title, code, and learning mode
- Verifies creation and updates were successful

Both test classes include a `clearAllData()` helper method for cleaning up test data.

## Configuration

The GraphQL server URL can be configured in `src/main/resources/application.yml`:

```yaml
graphql:
  server:
    url: http://localhost:4000
```

Or override via system property:

```bash
./gradlew test -Dgraphql.server.url=http://localhost:5000
```

## Docker Build and Push

This project includes Docker support for containerized builds and test execution.

### Prerequisites

- Docker installed and running
- Access to a Docker registry (Docker Hub, private registry, etc.)

### Quick Start

#### Build the Docker Image

```bash
# Build with default tag (latest)
docker build -t java-graphql-tests:latest .

# Build with specific tag
docker build -t java-graphql-tests:v1.0.0 .
```

#### Using the Helper Script

The `docker-build.sh` script simplifies building and pushing:

```bash
# Make script executable (first time only)
chmod +x docker-build.sh

# Build with defaults (java-graphql-tests:latest)
./docker-build.sh

# Build with custom name and tag
./docker-build.sh my-tests v1.0.0

# Build and tag for registry (will prompt to push)
./docker-build.sh java-graphql-tests latest your-username
```

### Push to Docker Hub

```bash
# 1. Tag the image with your Docker Hub username
docker tag java-graphql-tests:latest your-username/java-graphql-tests:latest

# 2. Login to Docker Hub (if not already logged in)
docker login

# 3. Push the image
docker push your-username/java-graphql-tests:latest
```

### Push to Private Registry

```bash
# 1. Tag the image for your private registry
docker tag java-graphql-tests:latest registry.example.com/java-graphql-tests:latest

# 2. Login to your private registry
docker login registry.example.com

# 3. Push the image
docker push registry.example.com/java-graphql-tests:latest
```

### Run Tests in Docker Container

```bash
# Run tests (requires GraphQL server accessible from container)
docker run --rm java-graphql-tests:latest

# Run tests with GraphQL server URL override
docker run --rm -e GRAPHQL_SERVER_URL=http://host.docker.internal:4000 java-graphql-tests:latest

# Run tests interactively (for debugging)
docker run -it --rm java-graphql-tests:latest /bin/bash
```

**Note:** When running tests in Docker, ensure the GraphQL mock server is accessible:
- On Mac/Windows: Use `host.docker.internal:4000` to access the host machine
- On Linux: Use the host's IP address or run the GraphQL server in another container on the same network

### Docker Compose Example

You can also use Docker Compose to run both the GraphQL server and tests together:

```yaml
version: '3.8'
services:
  graphql-server:
    image: schuchert/administrate:latest
    ports:
      - "4000:4000"
  
  tests:
    build: .
    depends_on:
      - graphql-server
    environment:
      - GRAPHQL_SERVER_URL=http://graphql-server:4000
```

Then run:

```bash
docker-compose up --build
```

## Dockerfile Details

The Dockerfile uses a multi-stage build:

1. **Build Stage**: Compiles the project and runs tests using Amazon Corretto 25
2. **Runtime Stage**: Creates a lightweight image for running tests

The image includes:
- Amazon Corretto 25 (Java 25)
- Gradle wrapper
- All project source code and dependencies
- Built artifacts from the build stage

## Troubleshooting

### Docker Build Issues

If you encounter issues building the Docker image:

```bash
# Clean Docker build cache
docker builder prune

# Build without cache
docker build --no-cache -t java-graphql-tests:latest .
```

### Test Connection Issues

If tests can't connect to the GraphQL server:

1. Verify the server is running: `curl http://localhost:4000/health`
2. Check the server URL configuration
3. For Docker containers, ensure proper network configuration
4. Use `host.docker.internal` on Mac/Windows to access host services

### Java Version Issues

Ensure you're using Java 25. The Dockerfile uses Amazon Corretto 25, which matches the project requirements.


