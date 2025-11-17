# GraphQL API Tests

Simple JUnit test project demonstrating Spring Boot and Spring GraphQL integration with the Administrate DX GraphQL Mock Server.

## Requirements

- Java 25 (Amazon Corretto or compatible)
- Gradle 9.0+ (wrapper included)
- GraphQL Mock Server running on http://localhost:4000

**Note:** This project uses Java 25 with Spring Boot 3.4.0. The `spring.classformat.ignore=true` system property is set to work around Spring's ASM compatibility with Java 25 class files.

## Project Structure

```
java-tests/
├── build.gradle.kts              # Gradle build (Kotlin DSL)
├── settings.gradle.kts            # Gradle settings
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/administrate/graphql/
│   │   │       ├── GraphQLApplication.java
│   │   │       ├── config/GraphQLConfig.java
│   │   │       └── model/
│   │   │           ├── CourseTemplate.java
│   │   │           └── CreateCourseTemplateResponse.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/administrate/graphql/
│               └── CourseTemplateTest.java
└── README.md
```

## Running the Test

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

### 3. Run the Test

```bash
cd java-tests
./gradlew test
```

## Test Description

The test `shouldCreateCourseTemplateAndVerifyItExists`:

1. **Creates** a course template via GraphQL mutation
2. **Verifies** the creation was successful (no errors, all fields match)
3. **Queries** the created course template by ID
4. **Asserts** that the queried course template matches the created one

## Build Commands

```bash
# Clean build
./gradlew clean build

# Run tests only
./gradlew test

# View test report
open build/reports/tests/test/index.html
```

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


