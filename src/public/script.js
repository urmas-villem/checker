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
        table += '<th>EOL of used version</th>';
        table += '<th>Newest image available</th>';
        table += '<th>Notes</th>';
        table += '</tr>';

        // Add data rows
        data.forEach(item => {
            const versionMismatch = item.imageVersionUsedInCluster !== item.newestImageAvailable;
            const versionCellClass = versionMismatch ? 'version-mismatch' : '';
            const eolDatePassed = isDatePassed(item.eolDate);
            let eolDateClass = '';
        
            if (eolDatePassed === true) {
                eolDateClass = 'date-passed';
            } else if (eolDatePassed === false) {
                eolDateClass = 'date-valid';
            }
        
            const formattedEolDate = formatDate(item.eolDate);
            const timeDiffMessage = getTimeDifferenceMessage(item.eolDate);
        
            table += `<tr>
                        <td>${item.containerName}</td>
                        <td>${item.imageRepository}</td>
                        <td class="${versionCellClass}">${item.imageVersionUsedInCluster}</td>
                        <td class="${eolDateClass}">${formattedEolDate} ${timeDiffMessage}</td>
                        <td>${item.newestImageAvailable}</td>
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

function formatDate(dateString) {
    if (!dateString || isNaN(Date.parse(dateString))) {
        return dateString;
    }

    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}. ${month} ${year}`;
}

function isDatePassed(eolDate) {
    if (!eolDate || isNaN(Date.parse(eolDate))) {
        return null;
    }

    const today = new Date();
    const eol = new Date(eolDate);
    return today > eol;
}
function getTimeDifferenceMessage(eolDate) {
    if (!eolDate || isNaN(Date.parse(eolDate))) {
        return '';
    }

    const today = new Date();
    const eol = new Date(eolDate);

    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const eolStart = new Date(eol.getFullYear(), eol.getMonth(), eol.getDate());

    const timeDifference = eolStart - todayStart;

    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (timeDifference >= 0) {
        // EOL Date is in the future
        return `(Ends in ${days} day${days !== 1 ? 's' : ''})`;
    } else {
        // EOL Date has passed
        return `(Ended ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago)`;
    }
}

fetchAndDisplayPodImages();