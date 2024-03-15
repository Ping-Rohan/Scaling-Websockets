const { Kafka } = require('kafkajs');

class KafkaService {
  #producer;
  #consumer;
  #socketMap = {};
  constructor(broker_uri, clientId) {
    this.kafka = new Kafka({
      clientId,
      brokers: [broker_uri],
    });
    this.#socketMap = {};
  }

  async createProducer() {
    this.#producer = this.kafka.producer();
    await this.#producer.connect();
  }

  async createConsumer(groupId) {
    this.#consumer = this.kafka.consumer({ groupId });
    await this.#consumer.connect();
  }

  async subscribe(topic) {
    await this.#consumer.subscribe({ topic });
  }

  async produceMessage(topic, messages) {
    await this.#producer.send({
      topic,
      messages,
    });
  }

  async consumeMessage() {
    await this.#consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { text, key } = JSON.parse(message.value);
        this.#socketMap[key].send(JSON.stringify({ text }));
      },
    });
  }

  setSocket(clientId, connection) {
    this.#socketMap[clientId] = connection;
  }

  getSocket(clientId) {
    return this.#socketMap[clientId];
  }
}

module.exports = KafkaService;
