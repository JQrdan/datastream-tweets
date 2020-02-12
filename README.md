# datastream-tweets

Contains 2 applications:

  - **Source**: read tweets from a stream and produce to 'twitter-raw' (default) topic
  - **Sink**: read tweets from 'twitter-raw' (default), do some toxicity analysis using Tensorflow, then produce to 'twitter-toxicity' (default)

## How to build and run for Local

```
npm install
export KAFKA_BROKERS=<kafkaBrokerList>
export CONSUMER_KEY=<twitterAPIConsumerKey>
export CONSUMER_SECRET=<twitterAPIConsumerSecret>
npm run <source/sink>
```

## How to build and run for Docker

```
./buildDocker
export KAFKA_BROKERS=<kafkaBrokerList>
export CONSUMER_KEY=<twitterAPIConsumerKey>
export CONSUMER_SECRET=<twitterAPIConsumerSecret>
docker run datastream-tweets-<source/sink>
```