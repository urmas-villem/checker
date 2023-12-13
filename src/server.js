'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 9191;
const HOST = '0.0.0.0';

const app = express();

// Serve static files from the "public" directory inside the "src" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/console', function(req, res){
    var console2 = fs.readFileSync("./console.txt", 'utf8');
    res.send(console2);
});

app.listen(PORT, HOST);
console.log(`Running version 3 on http://${HOST}:${PORT}`);