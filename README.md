# NodeJS WebSocket Server with Kafka , Nginx And Redis Backend Integration

This Node.js application sets up a WebSocket server using Express and \`websocket\` library. It also integrates with Kafka and Redis for message queueing and storage.

## Technologies Used:
- Express.js
- WebSocket
- Kafka
- Redis

## Features:
- **WebSocket Server**: Establishes a WebSocket server to handle incoming connections.
- **Token Endpoint**: Provides a simple HTTP GET endpoint (\`/get-token\`) returning a greeting message with the server name.
- **Kafka Integration**: Connects to Kafka broker for producing and consuming messages.
- **Redis Integration**: Utilizes Redis for storing key-value pairs to associate WebSocket clients with servers.

## How to Use:
1. Install dependencies using \`npm install\`.
2. Set environment variables:
   - \`SERVER_NAME\`: Name of the server.
   - \`SERVER_PORT\`: Port number for the server.

## Example Usage:
- Connect to the WebSocket server using client libraries or tools like \`websocket\` library in a web application or command-line tool.
- Send messages to the server, which will be processed and distributed using Kafka to other servers if necessary.
- You need to manually connect and send messages from browser console since it doesnot touch frontend part.
