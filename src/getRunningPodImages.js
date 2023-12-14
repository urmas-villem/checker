const k8s = require('@kubernetes/client-node');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();
const coreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api);

const softwareCommands = {
  'prometheus': `curl -s "https://api.github.com/repos/prometheus/prometheus/releases/latest" | jq -r '.tag_name'`,
  'alertmanager': `curl -s "https://api.github.com/repos/prometheus/alertmanager/releases/latest" | jq -r '.tag_name'`,
};

async function fetchLatestImageTag(command) {
  try {
    const { stdout, stderr } = await exec(command);
    if (stderr) throw new Error(`Command Error: ${stderr}`);
    if (!stdout) throw new Error('No output received from command.');
    return stdout.trim();
  } catch (error) {
    console.error('Error fetching latest tag:', error.message);
    return 'fetch-error';
  }
}

async function getRunningPodImages() {
  try {
    const res = await coreV1Api.listPodForAllNamespaces();
    const containerObjects = res.body.items.flatMap(pod => 
      pod.status.containerStatuses?.filter(status => softwareCommands[pod.metadata.labels?.app])
        .map(status => ({
          containerName: status.name,
          imageName: status.image.split(':')[0],
          imageUsedInCluster: status.image.split(':')[1],
        })) || []
    );    

    for (const containerObj of containerObjects) {
      const command = softwareCommands[containerObj.containerName];
      if (command) {
        containerObj.newestImageAvailable = await fetchLatestImageTag(command);
      }
    }

    console.log(containerObjects)
    return containerObjects;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

module.exports.getRunningPodImages = getRunningPodImages;