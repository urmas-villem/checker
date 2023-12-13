# Checker

Checks images used by pods inside cluster and compares them with the newest versions. Notifies if necessary

#### Dockerhub link:
https://hub.docker.com/r/huxlee/jsapp/tags

#### Building and pushing to Dockerhub
Navigate inside https://github.com/urmas-villem/checker folder                                 
```docker build . -t huxlee/jsapp:v1.19```                            
```docker push  huxlee/jsapp:v1.19```                            
Edit deployment to use the new image                                  


#### Testing commands:
```kubectl run nginx --image=nginx --port=80```                    
```kubectl run prometheus --image=prom/prometheus:v2.48.1 --port=9090 --labels="app=prometheus"```                    
```kubectl run alertmanager --image=prom/alertmanager:v0.26.0 --port=9093 --labels="app=alertmanager"```    

#### Current status of the code:

I have a script called getRunningPodImages.js (rename it later).
This script works by taking in a constant like this:
```
const softwareCommands = {
  'prometheus': `curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/prometheus/prometheus/releases/latest" | jq -r '.tag_name'`,
  'alertmanager': `curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/prometheus/alertmanager/releases/latest" | jq -r '.tag_name'`,
};
```
Here you specify the name of the software you want to check inside the cluster and then the corresponding curl command which identifies the latest version.
The ```fetchLatestImageTag``` function finds the latest image versions using curl
The ```getRunningPodImages``` finds the software in the cluster by the label (the pods need a label like app: prometheus or app: alertmanager) then it creates an object for each of the software where you can see output like this:
```
[
  {
    containerName: 'alertmanager',
    imageName: 'prom/alertmanager',
    imageUsedInCluster: 'v0.25.0',
    newestImageAvailable: 'v0.26.0'
  },
  {
    containerName: 'prometheus',
    imageName: 'prom/prometheus',
    imageUsedInCluster: 'v2.48.1',
    newestImageAvailable: 'v2.48.1'
  }
]
```
