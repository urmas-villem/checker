const k8s = require('@kubernetes/client-node');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const softwares = require('./software.json');

const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();
const coreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api);

async function fetchLatestImageTag(command) {
  const networkErrorMessage = 'Network error occurred with getting latest version, try again in a few minutes';
  try {
    const { stdout, stderr } = await exec(command);
    if (stderr || !stdout || stdout.trim() === 'null') {
      console.error(`Error in command execution: ${stderr}`);
      return networkErrorMessage;
    }
    return stdout.trim();
  } catch (error) {
    console.error('Error fetching latest tag:', error.message);
    return networkErrorMessage;
  }
}

async function fetchEOLDate(appName, version) {
  console.log(`Fetching EOL date for ${appName} version ${version}`);
  return '2023-12-31'; // Dummy date
}

async function getRunningPodImages() {
  try {
    const res = await coreV1Api.listPodForAllNamespaces();
    const containerObjects = res.body.items.flatMap(pod => {
      const appName = pod.metadata.labels?.app;
      const software = softwares.find(s => s.name === appName);

      if (software && pod.status.containerStatuses) {
        return pod.status.containerStatuses.map(status => ({
          containerName: status.name,
          imageRepository: status.image.split(':')[0],
          imageVersionUsedInCluster: status.image.split(':')[1],
          appName: appName,
          command: software.command,
          note: software.note || ''
        }));
      }
      return [];
    });

    for (const containerObj of containerObjects) {
      if (containerObj.command) {
        containerObj.newestImageAvailable = await fetchLatestImageTag(containerObj.command);
        containerObj.eolDate = await fetchEOLDate(containerObj.appName, containerObj.imageVersionUsedInCluster);
      }
    }

    console.log(containerObjects);
    return containerObjects;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

module.exports.getRunningPodImages = getRunningPodImages;