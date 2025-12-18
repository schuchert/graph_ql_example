#!/bin/bash

# Docker build and push script for Java GraphQL Tests
# Usage: ./docker-build.sh [image-name] [tag] [registry]

set -e

# Default values
IMAGE_NAME="${1:-java-graphql-tests}"
TAG="${2:-latest}"
REGISTRY="${3:-}"

# If registry is provided, prepend it to image name
if [ -n "$REGISTRY" ]; then
    FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${TAG}"
else
    FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"
fi

echo "Building Docker image: ${FULL_IMAGE_NAME}"

# Build the Docker image
docker build -t "${FULL_IMAGE_NAME}" .

echo "Build complete: ${FULL_IMAGE_NAME}"

# Ask if user wants to push
read -p "Do you want to push the image to registry? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing ${FULL_IMAGE_NAME}..."
    docker push "${FULL_IMAGE_NAME}"
    echo "Push complete!"
else
    echo "Skipping push. To push manually, run:"
    echo "  docker push ${FULL_IMAGE_NAME}"
fi

