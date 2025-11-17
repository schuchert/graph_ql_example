# Spring Boot GraphQL Client for Administrate DX GraphQL API

Spring Boot application using Spring GraphQL to interact with the Administrate DX GraphQL Mock Server. Demonstrates reading, writing, and filtering entities using reactive programming with Spring WebFlux.

## Requirements

- Java 25 (or latest Java version)
- Gradle 9.0+ (or use Gradle Wrapper)
- GraphQL Mock Server running (default: http://localhost:4000)

## Project Structure

```
java-tests/
├── build.gradle.kts                           # Gradle build configuration (Kotlin DSL)
├── settings.gradle.kts                         # Gradle settings
├── gradle.properties                           # Gradle properties
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/administrate/graphql/
│   │   │       ├── GraphQLApplication.java    # Spring Boot application
│   │   │       ├── config/
│   │   │       │   └── GraphQLConfig.java    # Spring GraphQL configuration
│   │   │       ├── model/                     # Entity models
│   │   │       │   ├── CourseTemplate.java
│   │   │       │   ├── AchievementType.java
│   │   │       │   ├── LmsContent.java
│   │   │       │   └── Connection.java
│   │   │       └── service/                   # Service layer
│   │   │           ├── CourseTemplateService.java
│   │   │           └── AchievementTypeService.java
│   │   └── resources/
│   │       └── application.yml                # Application configuration
│   └── test/
│       ├── java/
│       │   └── com/administrate/graphql/
│       │       ├── BaseGraphQLTest.java      # Base test class
│       │       ├── QueryTests.java            # Reading entities
│       │       ├── MutationTests.java         # Writing entities
│       │       └── FilterTests.java           # Filtering entities
│       └── resources/
│           └── application-test.yml          # Test configuration
└── README.md
```

## Features

- ✅ **Spring Boot 3.3.0** - Modern Spring Boot framework
- ✅ **Spring GraphQL 1.2.6** - Official Spring GraphQL client
- ✅ **Reactive Programming** - Uses Spring WebFlux and Project Reactor
- ✅ **Type-Safe Models** - Jackson-based entity models
- ✅ **Service Layer** - Clean service abstraction
- ✅ **Comprehensive Tests** - JUnit 5 tests with AssertJ

## Running the Application

### Prerequisites

1. Start the GraphQL mock server:
   ```bash
   # From project root
   npm start
   
   # Or using Docker
   docker run -d -p 4000:4000 --name administrate-dx schuchert/administrate:latest
   ```

2. Verify the server is running:
   ```bash
   curl http://localhost:4000/health
   ```

### Run the Spring Boot Application

```bash
cd java-tests
./gradlew bootRun
```

### Run All Tests

```bash
cd java-tests
./gradlew test
```

### Run Specific Test Class

```bash
# Run only query tests
./gradlew test --tests QueryTests

# Run only mutation tests
./gradlew test --tests MutationTests

# Run only filter tests
./gradlew test --tests FilterTests
```

### Run with Custom Server URL

```bash
./gradlew test -Dgraphql.server.url=http://localhost:5000
```

### Build the Application

```bash
# Build JAR
./gradlew build

# Run the JAR
java -jar build/libs/graphql-api-tests-1.0.0.jar
```

## Spring GraphQL Usage

### Configuration

The `GraphQLConfig` class configures the Spring GraphQL client:

```java
@Configuration
public class GraphQLConfig {
    @Bean
    public HttpGraphQlClient graphQlClient(WebClient webClient) {
        return HttpGraphQlClient.builder(webClient).build();
    }
}
```

### Service Layer

Services use Spring GraphQL's reactive client:

```java
@Service
public class CourseTemplateService {
    private final HttpGraphQlClient graphQlClient;
    
    public Mono<CourseTemplate[]> findAll() {
        return graphQlClient.document(query)
                .retrieve("courseTemplates.edges[*].node")
                .toEntityList(CourseTemplate.class)
                .map(list -> list.toArray(new CourseTemplate[0]));
    }
}
```

### Reactive Programming

All operations return `Mono` or `Flux` for reactive programming:

```java
// Blocking (for tests)
CourseTemplate course = service.findById(id).block();

// Non-blocking (for production)
service.findById(id)
    .subscribe(course -> {
        // Handle result
    });
```

## Test Coverage

### QueryTests - Reading Entities

- ✅ Query all course templates with pagination
- ✅ Query specific course template by ID
- ✅ Query all achievement types
- ✅ Query course template with nested LMS contents
- ✅ Query course template with achievement types
- ✅ Reactive streams with StepVerifier

### MutationTests - Writing Entities

- ✅ Create course template
- ✅ Update course template
- ✅ Delete course template
- ✅ Create achievement type
- ✅ Update achievement type
- ✅ Delete achievement type
- ✅ Reactive mutations with StepVerifier

### FilterTests - Filtering Entities

- ✅ Filter by learning mode
- ✅ Filter by lifecycle state
- ✅ Filter achievement types by points range
- ✅ Query with pagination structure
- ✅ Filter by name pattern

## Dependencies

- **Spring Boot 3.3.0** - Application framework
- **Spring GraphQL 1.2.6** - GraphQL client
- **Spring WebFlux** - Reactive web client
- **JUnit 5** - Testing framework
- **AssertJ** - Fluent assertions
- **Jackson** - JSON processing
- **Lombok** - Boilerplate reduction
- **Project Reactor** - Reactive streams

## Configuration

### application.yml

```yaml
graphql:
  server:
    url: http://localhost:4000

spring:
  application:
    name: administrate-graphql-client
```

### Environment Variables

```bash
export GRAPHQL_SERVER_URL=http://localhost:5000
mvn spring-boot:run
```

## Example Usage

### Using Services

```java
@Autowired
private CourseTemplateService courseTemplateService;

// Create
var result = courseTemplateService
    .create("My Course", "Description", "CODE-001", "LMS")
    .block();

// Query
var course = courseTemplateService
    .findById(courseId)
    .block();

// Update
courseTemplateService
    .update(courseId, "New Name", "New Description", null)
    .block();

// Delete
courseTemplateService.delete(courseId).block();
```

### Direct GraphQL Client

```java
@Autowired
private HttpGraphQlClient graphQlClient;

var result = graphQlClient.document("""
    query {
      courseTemplates {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    """)
    .retrieve("courseTemplates.edges[*].node")
    .toEntityList(CourseTemplate.class)
    .block();
```

## Model Classes

All entity models use Jackson annotations for JSON mapping:

- `CourseTemplate` - Course template entity
- `AchievementType` - Achievement type entity
- `LmsContent` - Union type for LMS content (Resource, External, Separator)
- `Connection<T>` - GraphQL connection type for pagination
- `MutationResponse<T>` - Generic mutation response wrapper

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run GraphQL Tests
  run: |
    cd java-tests
    ./gradlew test -Dgraphql.server.url=http://localhost:4000
```

## Troubleshooting

### Server Not Available

If tests fail with connection errors:
1. Ensure the server is running: `curl http://localhost:4000/health`
2. Check the URL in `application.yml` or set `-Dgraphql.server.url`

### Port Conflicts

If port 4000 is in use:
1. Start server on different port: `PORT=5000 npm start`
2. Update `application.yml` or use `-Dgraphql.server.url=http://localhost:5000`

### Java Version

Ensure you're using Java 25 or compatible version:
```bash
java -version
./gradlew --version
```

### Gradle Wrapper

If Gradle is not installed, use the wrapper (will be generated on first run):
```bash
# Generate wrapper (if needed)
gradle wrapper --gradle-version 9.0

# Use wrapper
./gradlew build
```

### Spring Boot Version

If you encounter compatibility issues, check Spring Boot and Spring GraphQL versions in `build.gradle.kts`.

## Building

```bash
# Build the application
./gradlew clean build

# Run the JAR
java -jar build/libs/graphql-api-tests-1.0.0.jar
```

## Contributing

When adding new features:
1. Follow Spring Boot best practices
2. Use reactive programming (Mono/Flux)
3. Add comprehensive tests
4. Update this README
5. Use descriptive JavaDoc comments
