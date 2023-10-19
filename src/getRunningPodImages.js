// Import Kubernetes client library.
const k8s = require('@kubernetes/client-node');

// Initialize the Kubernetes configuration object.
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Create a Kubernetes API client for the CoreV1 API.
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

// List of app=value labels. This is used to filter the pods we are checking inside the cluster.
const appLabelValues = ['jsapp', 'nginx'];

async function getPodImageVersionsAndTags() {
  try {
    // Fetch all pods from the Kubernetes cluster across all namespaces.
    const podsResponse = await k8sApi.listPodForAllNamespaces();
    const pods = podsResponse.body.items;

    // Loop through each pod to check and process the ones matching our label criteria.
    pods.forEach(pod => {
      const { labels } = pod.metadata;

      // Check if the current pod's app label matches any of our desired labels.
      if (labels && labels.app && appLabelValues.includes(labels.app)) {

        // Log pod information.
        console.log(`Pod: ${pod.metadata.name}, Namespace: ${pod.metadata.namespace}`);
        console.log('Container Image Versions and Tags:');
        
        // If the pod has containers, loop through each container to extract image details.
        (pod.status.containerStatuses || []).forEach(containerStatus => {
          
          // Split the container image into its name and tag.
          const [imageName, imageTag] = containerStatus.image.split(':');

          // Log results.
          console.log(`  Container: ${containerStatus.name}`);
          console.log(`  Image Name: ${imageName}`);
          console.log(`  Image Tag: ${imageTag}`);
          console.log('---');
        });
      }
    });

  } catch (error) {
    // Log the error for troubleshooting.
    console.error('Error fetching pod details:', error);
  }
}

// Start
getPodImageVersionsAndTags();