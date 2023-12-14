'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const { getRunningPodImages } = require('./getRunningPodImages'); // Import the function

const PORT = 9191;
const HOST = '0.0.0.0';

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/console', function(req, res){
    var console2 = fs.readFileSync("./console.txt", 'utf8');
    res.send(console2);
});

app.get('/pod-images', async (req, res) => {
    try {
        const data = await getRunningPodImages();
        res.json(data);
    } catch (error) {
        console.error('Error fetching pod images:', error);
        res.status(500).send('Error fetching pod images');
    }
});

app.listen(PORT, HOST);
console.log(`Running version 3 on http://${HOST}:${PORT}`);