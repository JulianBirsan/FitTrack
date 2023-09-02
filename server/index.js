const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/get', (req, res) => {
    res.send("getting info");
});

app.post('/api/insert', (req, res) => {
    const id = req.id;
    const title = req.title;
    const date = req.date;
    const exercises = req.exercises;

    res.send("inserting info");
});

app.listen(3001, () => {
    console.log('running on port 3001');
});