# Docker Hub Publishing Guide

Quick reference for building and publishing to `schuchert/administrate` on Docker Hub.

## Build and Publish

### 1. Login to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### 2. Build the Image

```bash
docker build -t schuchert/administrate:latest .
```

### 3. Tag for Version (Optional)

```bash
# Tag with version number
docker tag schuchert/administrate:latest schuchert/administrate:v1.0.0
```

### 4. Push to Docker Hub

```bash
# Push latest
docker push schuchert/administrate:latest

# Push version tag (if created)
docker push schuchert/administrate:v1.0.0
```

### All-in-One Script

```bash
#!/bin/bash
# Build and push script

# Login (if not already logged in)
# docker login

# Build
docker build -t schuchert/administrate:latest .

# Push
docker push schuchert/administrate:latest

echo "✅ Published to schuchert/administrate:latest"
```

## Running from Docker Hub

### Single Command

```bash
docker run -d -p 4000:4000 --name administrate-dx schuchert/administrate:latest
```

### With Custom Port

```bash
docker run -d -p 5000:4000 --name administrate-dx schuchert/administrate:latest
```

### With Auto-Restart

```bash
docker run -d -p 4000:4000 --name administrate-dx --restart unless-stopped schuchert/administrate:latest
```

### Access the Server

Once running, access:
- **GraphQL API**: http://localhost:4000/graphql
- **GraphiQL Interface**: http://localhost:4000/graphql (GET request)
- **Health Check**: http://localhost:4000/health

### Stop and Remove

```bash
docker stop administrate-dx
docker rm administrate-dx
```

## Quick Reference

```bash
# Build
docker build -t schuchert/administrate:latest .

# Push
docker push schuchert/administrate:latest

# Run (single command)
docker run -d -p 4000:4000 --name administrate-dx schuchert/administrate:latest

# Check logs
docker logs administrate-dx

# Stop
docker stop administrate-dx && docker rm administrate-dx
```

