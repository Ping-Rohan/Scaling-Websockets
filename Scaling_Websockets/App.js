const app = require('express')();
const http = require('http');
const crypto = require('crypto');
const ws = require('websocket').server;
const { createClient } = require('redis');
const KafkaService = require('./KafkaService');

const SOCKET_MAP = {};
const kafkaService = new KafkaService('kafka:9092', process.env.SERVER_NAME);

const redisClient = createClient({
  url: 'redis://redis:6379',
});

app.get('/get-token', (req, res) => {
  res.send(`Hello from ${process.env.SERVER_NAME}!`);
});

const server = http.createServer(app);

const SOCKET = new ws({
  httpServer: server,
});

server.listen(process.env.SERVER_PORT, async () => {
  console.log('Server is running on port 3000');
  await kafkaService.createProducer();
  await kafkaService.createConsumer(process.env.SERVER_NAME);
  await kafkaService.subscribe(process.env.SERVER_NAME);
  await kafkaService.consumeMessage();
  await redisClient.connect();
});

SOCKET.on('request', async (req) => {
  const connection = req.accept(null, req.origin);
  console.log('New connection');
  const clientId = crypto.randomBytes(8).toString('hex');
  kafkaService.setSocket(clientId, connection);
  redisClient.set(clientId, process.env.SERVER_NAME);
  connection.on('message', async (message) => {
    if (message.type === 'utf8') {
      const { key, text } = JSON.parse(message.utf8Data);
      const serverName = await redisClient.get(key);
      if (serverName === process.env.SERVER_NAME) {
        kafkaService.getSocket(key).send(JSON.stringify({ text }));
        return;
      }
      await kafkaService.produceMessage(serverName.toString(), [
        {
          value: JSON.stringify({ text, key }),
        },
      ]);
    }
  });
});
