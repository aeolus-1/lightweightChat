docker stop chat
docker rm chat
docker build . -t nekoify/chat
docker run -d -p 127.0.0.1:8414:8414 --name chat nekoify/chat