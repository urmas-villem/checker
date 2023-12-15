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
        table += '<th>Container name</th>';
        table += '<th>Image repository</th>';
        table += '<th>Image version used in cluster</th>';
        table += '<th>Newest image available</th>';
        table += '<th>EOL Date (currently dummy date)</th>';
        table += '<th>Notes</th>';
        table += '</tr>';

        // Add data rows
        data.forEach(item => {
            const versionMismatch = item.imageVersionUsedInCluster !== item.newestImageAvailable;
            const versionCellClass = versionMismatch ? 'version-mismatch' : '';
        
            table += `<tr>
                        <td>${item.containerName}</td>
                        <td>${item.imageRepository}</td>
                        <td class="${versionCellClass}">${item.imageVersionUsedInCluster}</td>
                        <td>${item.newestImageAvailable}</td>
                        <td class="no-wrap">${item.eolDate}</td>
                        <td>${item.note}</td>
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