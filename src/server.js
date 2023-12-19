'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { getRunningPodImages } = require('./getRunningPodImages');

const PORT = 9191;
const HOST = '0.0.0.0';

const app = express();

let cache = null;
let lastUpdated = Date.now();

async function updateCache() {
    cache = await getRunningPodImages();
    lastUpdated = Date.now();
}

updateCache();

setInterval(updateCache, 300000);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/pod-images', async (req, res) => {
    res.json({ data: cache, lastUpdated });
});

app.listen(PORT, HOST);
console.log(`http://${HOST}:${PORT}`);