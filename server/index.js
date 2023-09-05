const mysql = require("mysql");
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "FitTrack",
    port: 3306,
});

app.get('/api/get', (req, res) => {
    if(req.query.id) {
        const getQuery = "SELECT * from workoutTable WHERE id = ?";
        console.log(getQuery);
        db.query(getQuery, req.query.id, (err, data) => {
            if (err) {
                console.error('MySQL Error:', err);
                return res.status(500).json(err); 
            }
            return res.json(data);
        });
    } else if(req.query.date) {
        const getQuery = "SELECT * from workoutTable WHERE date = ?";
        db.query(getQuery, req.query.date, (err, data) => {
            if (err) {
                console.error('MySQL Error:', err);
                return res.status(500).json(err); 
            }
            return res.json(data);
        });
    } else {
        const getQuery = "SELECT * from workoutTable";
        db.query(getQuery, (err, data) => {
            if (err) {
                console.error('MySQL Error:', err);
                return res.status(500).json(err); 
            }
            return res.json(data);
        });  
    } 
});

app.post('/api/insert', (req, res) => {
    const id = req.body.id;
    const date = req.body.date;
    const exercises = req.body.exercises;

    const deleteQuery = `DELETE from workoutTable WHERE id = ?`;

    db.query(deleteQuery, id, (err, data) => {
        if(err) console.log(err);

        let newData = [];

        exercises.forEach((exercise) => {
            exercise.sets.forEach((set) => {
                const insertQuery = `INSERT INTO workoutTable (id, date, exercise, weight, reps) VALUES (?, ?, ?, ?, ?)`;
                db.query(insertQuery, [id, date, exercise.name, set[1], set[0]], (err, data) => {
                    if(err) console.log(err);
                    console.log(data);
                });
            });
        });
    });

    res.send("inserting info");
});

app.delete('/api/delete', (req, res) => {
    const id = req.body.id;
    const deleteQuery = "DELETE FROM workoutTable WHERE id = ?";
    console.log('id');
    console.log(id);
    db.query(deleteQuery, id, (err, data) => {
        if(err) console.log(err); 
    });
});

app.listen(3001, () => {
    console.log('running on port 3001');
});