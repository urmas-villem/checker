'use strict';

const express = require('express');

const PORT = 9191;
const HOST = '0.0.0.0';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world \n');
});

const fs = require('fs');
app.get('/console', function(req, res){
    var console2 = fs.readFileSync("./console.txt", 'utf8');
    res.send(console2);
});


app.listen(PORT, HOST);

console.log(`Running version 3 on http://${HOST}:${PORT}`);