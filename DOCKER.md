# Docker Guide

Quick reference for building and running the Administrate DX GraphQL Mock Server in Docker.

## Quick Start

```bash
# Build the image
docker build -t administrate-dx-graphql-mock .

# Run the container
docker run -d -p 4000:4000 --name graphql-mock administrate-dx-graphql-mock

# Check if it's running
curl http://localhost:4000/health

# View logs
docker logs graphql-mock

# Stop the container
docker stop graphql-mock
docker rm graphql-mock
```

## Docker Compose

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

## Custom Configuration

### Change Port

```bash
# Docker
docker run -d -p 5000:4000 administrate-dx-graphql-mock

# Docker Compose
PORT=5000 docker-compose up -d
```

### Environment Variables

```bash
docker run -d \
  -p 4000:4000 \
  -e PORT=4000 \
  -e NODE_ENV=production \
  administrate-dx-graphql-mock
```

## Publishing

### Tag for Registry

```bash
# Docker Hub
docker tag administrate-dx-graphql-mock yourusername/administrate-dx-graphql-mock:latest
docker tag administrate-dx-graphql-mock yourusername/administrate-dx-graphql-mock:v1.0.0

# Private Registry
docker tag administrate-dx-graphql-mock registry.example.com/administrate-dx-graphql-mock:latest
```

### Push to Registry

```bash
# Docker Hub
docker push yourusername/administrate-dx-graphql-mock:latest

# Private Registry
docker push registry.example.com/administrate-dx-graphql-mock:latest
```

### Pull and Run

```bash
# From Docker Hub
docker pull yourusername/administrate-dx-graphql-mock:latest
docker run -d -p 4000:4000 yourusername/administrate-dx-graphql-mock:latest

# From Private Registry
docker pull registry.example.com/administrate-dx-graphql-mock:latest
docker run -d -p 4000:4000 registry.example.com/administrate-dx-graphql-mock:latest
```

## Image Details

- **Base Image**: `node:20-alpine` (lightweight Alpine Linux)
- **Port**: 4000 (configurable via PORT env var)
- **User**: Runs as non-root user (`nodejs`)
- **Health Check**: Built-in health check at `/health`
- **Size**: ~150MB (optimized with multi-stage build)

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs graphql-mock

# Check if port is already in use
lsof -i :4000

# Run interactively to see errors
docker run -it --rm administrate-dx-graphql-mock
```

### Permission issues

The container runs as a non-root user. If you need to bind to ports < 1024, you'll need to run with elevated privileges or use a reverse proxy.

### Network issues

```bash
# Check container network
docker network ls
docker network inspect graph_ql_graphql-network

# Connect to container network
docker run -d --network graph_ql_graphql-network administrate-dx-graphql-mock
```

## Production Considerations

1. **Use specific tags** instead of `latest` for production
2. **Set resource limits** in docker-compose or docker run
3. **Use a reverse proxy** (nginx, traefik) for SSL/TLS
4. **Monitor health checks** in your orchestration platform
5. **Consider persistent storage** if you need data to survive container restarts (currently in-memory)

Example with resource limits:

```yaml
# docker-compose.yml addition
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

