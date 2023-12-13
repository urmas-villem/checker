# Checker

Checks images used by pods inside cluster and compares them with the newest versions. Notifies if necessary

#### Dockerhub link:
https://hub.docker.com/r/huxlee/jsapp/tags

#### Building and pushing to Dockerhub
Navigate inside https://github.com/urmas-villem/checker folder
```  docker build . -t huxlee/jsapp:v1.19```
```  docker push  huxlee/jsapp:v1.19```
Edit deployment to use the new image
