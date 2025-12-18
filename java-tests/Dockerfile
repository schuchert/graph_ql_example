# Multi-stage Dockerfile for Java GraphQL Tests
# Stage 1: Build
FROM amazoncorretto:25-alpine AS build

# Install necessary tools
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradle.properties .

# Copy source code
COPY src/ src/

# Make gradlew executable
RUN chmod +x ./gradlew

# Build the project (including tests)
RUN ./gradlew clean build --no-daemon

# Stage 2: Runtime (for running tests)
FROM amazoncorretto:25-alpine

# Install necessary tools
RUN apk add --no-cache bash curl

# Set working directory
WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradle.properties .

# Copy source code
COPY src/ src/

# Copy built artifacts from build stage
COPY --from=build /app/build/ build/

# Make gradlew executable
RUN chmod +x ./gradlew

# Default command: run tests
CMD ["./gradlew", "test", "--no-daemon"]

