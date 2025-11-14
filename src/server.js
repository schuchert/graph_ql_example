import { createServer } from 'http';
import { createHandler } from './handler.js';

const PORT = process.env.PORT || 4000;

/**
 * Main server entry point
 * Creates an HTTP server with GraphQL endpoint
 */
async function startServer() {
  const handler = createHandler();

  const server = createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url === '/graphql') {
      // GraphiQL interface
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(getGraphiQLHTML());
      return;
    }

    if (req.method === 'POST' && req.url === '/graphql') {
      try {
        let body = '';
        for await (const chunk of req) {
          body += chunk.toString();
        }

        const requestData = JSON.parse(body);
        const result = await handler.query(
          requestData.query,
          requestData.variables
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('Error handling GraphQL request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
      return;
    }

    // Health check
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  });

  server.listen(PORT, () => {
    console.log(`🚀 GraphQL Mock Server running at http://localhost:${PORT}/graphql`);
    console.log(`📊 GraphiQL interface available at http://localhost:${PORT}/graphql`);
    console.log(`❤️  Health check available at http://localhost:${PORT}/health`);
  });
}

function getGraphiQLHTML() {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>GraphQL Mock Server - GraphiQL</title>
  <link rel="stylesheet" href="https://unpkg.com/graphiql@3/graphiql.min.css" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/graphiql@3/graphiql.min.js"></script>
  <style>
    body { margin: 0; height: 100vh; }
    #graphiql { height: 100vh; }
  </style>
</head>
<body>
  <div id="graphiql">Loading...</div>
  <script>
    const fetcher = GraphiQL.createFetcher({
      url: '/graphql',
    });
    ReactDOM.render(
      React.createElement(GraphiQL, { fetcher }),
      document.getElementById('graphiql')
    );
  </script>
</body>
</html>
  `;
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

