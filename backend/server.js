const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // 👈 import cors
const app = express();

app.use(cors()); // 👈 enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'metro',
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.log("Error for connection: ", err);
    } else {
        console.log("Connected Successfully");
    }
});

app.get('/userdata', (req, res) => {
    db.query(`SELECT * FROM userinfo`, (err, result) => {
        if (err) {
            console.log('Error came while fetching data', err);
            return res.status(500).json({ error: err });
        }
        const userinf = { dbdata: result }; // assuming only one user for now
        res.json(userinf);
    });
});

app.post('/add', (req, res) => {
    const { name, email, mobno, password } = req.body;

    if (!name || !email || !mobno || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO userinfo (name, email, mobno, stat, password) VALUES (?, ?, ?,'A',?)`;

    db.query(query, [name, email, mobno, password], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: err });
        }
        console.log('Inserted ID:', result.insertId);
        res.json({ message: 'Data added successfully', insertId: result.insertId });
    });
});

app.listen(3000, () => {
    console.log('Server Running Successfully on port 3000');
});
