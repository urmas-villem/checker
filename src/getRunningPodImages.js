// Import Kubernetes client library.
const k8s = require('@kubernetes/client-node');
const { exec } = require('child_process');
const util = require('util');

// Promisify exec for use with async/await.
const execAsync = util.promisify(exec);

// Initialize the Kubernetes configuration object.
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Create a Kubernetes API client for the CoreV1 API.
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// List of app=value labels. This is used to filter the pods we are checking inside the cluster.
const appLabelValues = ['prometheus'];

async function getLatestImageTagForSoftware(software) {
  try {
    let command;
    switch (software) {
      case 'prometheus':
        command = `curl -s -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/prometheus/prometheus/releases/latest" | jq -r '.tag_name'`;
        break;
      // Add more cases for other software as needed.
    }

    if (!command) return null;

    const { stdout, stderr } = await execAsync(command);
    if (stderr) throw new Error(stderr);
    return stdout.trim();
  } catch (error) {
    console.error('Error fetching latest image tag for', software, ':', error);
    return null;
  }
}

async function getRunningPodImages() {
  try {
    const res = await k8sApi.listPodForAllNamespaces();
    const pods = res.body.items;

    const containerObjects = [];

    pods.forEach(pod => {
      const { labels } = pod.metadata;
      if (labels && labels.app && appLabelValues.includes(labels.app)) {
        (pod.status.containerStatuses || []).forEach(containerStatus => {
          const [imageName, imageTag] = containerStatus.image.split(':');
          containerObjects.push({
            containerName: containerStatus.name,
            imageName,
            imageTag
          });
        });
      }
    });

    for (const containerObj of containerObjects) {
      if (appLabelValues.includes(containerObj.containerName)) {
        const newestImageTag = await getLatestImageTagForSoftware(containerObj.containerName);
        if (newestImageTag) {
          containerObj.newestImageTag = newestImageTag;
        }
      }
    }

    console.log(containerObjects);

  } catch (error) {
    console.error('Error fetching pod details:', error);
  }
}

getRunningPodImages();
