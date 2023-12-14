async function fetchAndDisplayPodImages() {
    document.getElementById('loadingMessage').style.display = 'block';

    try {
        const response = await fetch('/pod-images');
        const data = await response.json();

        await new Promise(resolve => setTimeout(resolve, 500));

        const container = document.getElementById('podImagesContainer');
        container.innerHTML = '<h2>Images:</h2>';

        // Create a table and add header row
        let table = '<table border="1"><tr>';
        table += '<th>Container Name</th>';
        table += '<th>Image Name</th>';
        table += '<th>Image Used In Cluster</th>';
        table += '<th>Newest Image Available</th>';
        table += '</tr>';

        // Add data rows
        data.forEach(item => {
            table += `<tr>
                        <td>${item.containerName}</td>
                        <td>${item.imageName}</td>
                        <td>${item.imageUsedInCluster}</td>
                        <td>${item.newestImageAvailable}</td>
                      </tr>`;
        });

        table += '</table>';
        container.innerHTML += table;

        document.getElementById('loadingMessage').style.display = 'none';
    } catch (error) {
        console.error('Error fetching pod images:', error);
        document.getElementById('loadingMessage').innerText = 'Failed to load pod images.';
    }
}

fetchAndDisplayPodImages();
