// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');
var budget = {};

app.use(cors());

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello world');
});


fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the JSON file:", err);
        return;
    }

     budget = JSON.parse(data);

});


app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});