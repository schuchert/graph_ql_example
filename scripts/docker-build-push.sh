#!/bin/bash

# Script to build and push Docker image to Docker Hub
# Usage: ./scripts/docker-build-push.sh [version]

set -e

IMAGE_NAME="schuchert/administrate"
VERSION=${1:-latest}

echo "🐳 Building Docker image: ${IMAGE_NAME}:${VERSION}"

# Build the image
docker build -t ${IMAGE_NAME}:${VERSION} .

# Also tag as latest if version is not latest
if [ "$VERSION" != "latest" ]; then
  echo "📌 Tagging as latest..."
  docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
fi

echo "✅ Build complete!"
echo ""
echo "To push to Docker Hub, run:"
echo "  docker push ${IMAGE_NAME}:${VERSION}"
if [ "$VERSION" != "latest" ]; then
  echo "  docker push ${IMAGE_NAME}:latest"
fi
echo ""
echo "Or use: npm run docker:push"
echo ""
read -p "Push to Docker Hub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🚀 Pushing to Docker Hub..."
  docker push ${IMAGE_NAME}:${VERSION}
  if [ "$VERSION" != "latest" ]; then
    docker push ${IMAGE_NAME}:latest
  fi
  echo "✅ Push complete!"
else
  echo "⏭️  Skipping push. Run 'npm run docker:push' when ready."
fi

