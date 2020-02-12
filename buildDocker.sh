docker build . -t datastream-tweets-sink --build-arg FOLDER=sink
docker build . -t datastream-tweets-source --build-arg FOLDER=source