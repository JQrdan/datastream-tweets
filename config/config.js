module.exports = {
  KAFKA_BROKERS: process.env.KAFKA_BROKERS,
  SOURCE_TOPIC: 'twitter-raw',
  SINK_TOPIC: 'twitter-toxicity',
  PREDICTION_THRESHOLD: 0.9,
  BUFFER_SIZE: 10
};