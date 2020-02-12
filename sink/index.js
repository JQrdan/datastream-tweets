const toxicity = require('@tensorflow-models/toxicity');
const _ = require('lodash');
const kafka = require('kafka-node');
const config = require('../config/config.js');

console.log("Kakfa broker(s) to connect to:", config.KAFKA_BROKERS);

let client = new kafka.KafkaClient({ kafkaHost: config.KAFKA_BROKERS });
let topics = [{ topic: config.SOURCE_TOPIC }];
let options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };

let consumer = new kafka.Consumer(client, topics, options);
const producer = new kafka.Producer(client);

let tweetBuffer = [];
let tweetIDBuffer = [];

const predict = async (model, buffer, ids) => {
  model.classify(buffer).then(predictions => {
    let message = JSON.stringify({
      tweetIDs: ids,
      predictions
    });

    producer.send([{topic: config.SINK_TOPIC, messages: [message]}], err => {
      if (err) {
        console.log(`Broker failed to update on topic ${config.SINK_TOPIC}`);
        console.log(err);
      } else {
        console.log(`Broker update success on topic ${config.SINK_TOPIC}`);
      }
    });
  })
  .catch(error => {
    console.log('Failed to classify messages:', error);
  });
};

producer.on('ready', () => {
  toxicity.load(config.PREDICTION_THRESHOLD).then(model => {
    consumer.on('message', message => {
      const json = JSON.parse(message.value);
      const text = json.data.text;
      const id = json.data.id;

      tweetBuffer.push(text);
      tweetIDBuffer.push(id);

      if(tweetBuffer.length === config.BUFFER_SIZE) {
        predict(model, _.cloneDeep(tweetBuffer), tweetIDBuffer);
        tweetBuffer = [];
        tweetIDBuffer = [];
      }
    });
    consumer.on('error', err => {
      console.log(err);
    });
  })
  .catch(error => {
    console.log('Failed to load model:', error);
  });
});