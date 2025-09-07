const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const QRCode = require('qrcode'); // 👈 QR import
const app = express();

app.use(cors()); 
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

//user data
app.get('/userdata', (req, res) => {
    db.query(`SELECT * FROM userinfo`, (err, result) => {
        if (err) {
            console.log('Error came while fetching data', err);
            return res.status(500).json({ error: err });
        }
        const userinf = { dbdata: result };
        res.json(userinf);
    });
});

//Register and login 
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

//Travel Routes 
app.get('/routes', (req, res) => {
    db.query(`select * from routes`, (err, result) => {
        if (err) {
            console.log('Error while getting routes ', err);
        }
        res.send(result);
    })
})

// Format date for MySQL
function formatDateToMySQL(dateString) {
    const d = new Date(dateString);
    return d.toISOString().slice(0, 19).replace('T', ' '); 
}

// Book ticket & generate QR
app.post('/bookticket', (req, res) => {
    let { fplace, tplace, userid, issuetime } = req.body;

    issuetime = formatDateToMySQL(issuetime);

    const query = `INSERT INTO tjourney (fplace, tplace, userid, issuetime) VALUES (?,?,?,?)`;
    db.query(query, [fplace, tplace, userid, issuetime], async (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: err });
        }

        const insertId = result.insertId;
        console.log('Inserted ID:', insertId);

        // QR Data build cheyyali
        const bookingData = { id: insertId, fplace, tplace, userid, issuetime };

        try {
            // Generate QR as base64 DataURL
            const qrUrl = await QRCode.toDataURL(JSON.stringify(bookingData));

            res.json({ 
                message: 'Data added successfully', 
                insertId, 
                qrUrl   // 👈 Angular lo <img [src]="response.qrUrl" />
            });

        } catch (qrErr) {
            console.error("QR generation failed:", qrErr);
            res.status(500).json({ error: 'QR generation failed' });
        }
    });
});


app.listen(3000, () => {
    console.log('Server Running Successfully on port 3000');
});
