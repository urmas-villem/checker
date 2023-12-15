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

## Current status of the code:

I have a script called getRunningPodImages.js (rename it later).                                      
This script works by looking in the ```software.json``` file you specify the name of the software you want to check inside the cluster and then the corresponding curl command which identifies the latest version.                                
```
[
    {
      "name": "prometheus",
      "command": "curl -s \"https://api.github.com/repos/prometheus/prometheus/releases/latest\" | jq -r '.tag_name'",
      "note": "Prometheus has a very unclear definition of 'end of life': <i>Every 6 weeks, a new minor release cycle begins. After 6 weeks, minor releases generally no longer receive bugfixes.</i> Keep prometheus updated to the latest version. Approximate 'end of life' can be viewed here: <a href='https://endoflife.date/prometheus' target='_blank'>endoflife.date</a>."
    },
    {
      "name": "alertmanager",
      "command": "curl -s \"https://api.github.com/repos/prometheus/alertmanager/releases/latest\" | jq -r '.tag_name'",
      "note": "Alertmanager versions do not have a specific 'end of life'"
    }
]
```                                                                 
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

# 14.12.23
I wanted the output of the pod to be shown to the user in UI so i added a table version of that can be accessed by ```localhost:80```                           
The table itself looks something like this:              

| Container Name | Image Name        | Image Used In Cluster | Newest Image Available |
|----------------|-------------------|----------------------|------------------------|
| alertmanager   | prom/alertmanager | v0.25.0              | v0.26.0                |
| prometheus     | prom/prometheus   | v2.48.1              | v2.48.1                | 

Also added some minor styling to the page                                        

# 15.12.23
fixed https://github.com/urmas-villem/checker/issues/2                 
Added an indicator to the frontend if the currently used image and the newest image available have a mismatch                         
Added notes.json where notes can be put for every software we are checking                                  
Added ```fetchEOLDate()``` function for the future if there are some softwares that have specific EOL dates this function will find it and display it in the EOL Date column for the user      
#### Reworked:
The curl command used to be in the getRunningPodImages.js file but since I added a notes file, this did not seem to make sense anymore to have the notes about the software in one place and the curl commands about the same software in another place so I consolidated them both into a ```software.json``` file that looks like this:
```
[
    {
      "name": "prometheus",
      "command": "curl -s \"https://api.github.com/repos/prometheus/prometheus/releases/latest\" | jq -r '.tag_name'",
      "note": "Prometheus has a very unclear definition of 'end of life': <i>Every 6 weeks, a new minor release cycle begins. After 6 weeks, minor releases generally no longer receive bugfixes.</i> Keep prometheus updated to the latest version. Approximate 'end of life' can be viewed here: <a href='https://endoflife.date/prometheus' target='_blank'>endoflife.date</a>."
    },
    {
      "name": "alertmanager",
      "command": "curl -s \"https://api.github.com/repos/prometheus/alertmanager/releases/latest\" | jq -r '.tag_name'",
      "note": "Alertmanager versions do not have a specific 'end of life'"
    }
]
```
Instead of the old constant:
```
const softwareCommands = {
  'prometheus': `curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/prometheus/prometheus/releases/latest" | jq -r '.tag_name'`,
  'alertmanager': `curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/prometheus/alertmanager/releases/latest" | jq -r '.tag_name'`,
};
``` 
