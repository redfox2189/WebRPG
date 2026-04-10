const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.static('Public'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.post('/save', (req, res) =>{
    console.log(req.body);
    fs.writeFile('savegame.json', JSON.stringify(req.body), (err) => {
        if (err) {
            console.error('Error saving game:', err);
            res.status(500).send('Failed to save game!');
        } else {
            res.send('Game saved successfully!');
        }
    });

});

app.get ('/load', (req, res) => {
    fs.readFile('savegame.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error loading game:', err);
            res.status(500).send('Failed to load game!');
        } else {
            res.json(JSON.parse(data));
        }
    });
});