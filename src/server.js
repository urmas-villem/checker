'use strict';

const express = require('express');
const path = require('path');
const { getRunningPodImages } = require('./getRunningPodImages');

const PORT = 9191;
const HOST = '0.0.0.0';
const UPDATE_INTERVAL = 300000; // 5 minutes

const app = express();
let cache = null;
let lastUpdated = Date.now();

async function updateCache() {
    try {
        cache = await getRunningPodImages();
        lastUpdated = Date.now();
    } catch (error) {
        console.error('Error updating cache:', error);
    }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/pod-images', (req, res) => {
    res.json({ data: cache, lastUpdated });
});

app.post('/trigger-update', async (req, res) => {
    await updateCache();
    res.status(200).send('Cache updated');
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
    updateCache();
    setInterval(updateCache, UPDATE_INTERVAL);
});