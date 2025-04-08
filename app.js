const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "api1"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint to fetch letter images
app.get('/api/images', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const offset = (page - 1) * limit;

        const query = 'SELECT id, image, letter FROM letter LIMIT ? OFFSET ?';
        db.query(query, [limit, offset], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const imagesWithBase64 = results.map((row) => ({
                id: row.id,
                image: row.image ? row.image.toString('base64') : null,
                letter:row.letter //Include the letter column
            }));

            const responseObj = { letters: imagesWithBase64 };

            res.json(responseObj);
        });
    }
    catch (err) {
        console.log(`Error : ${err}`);
        res.send(`Error : ${err}`);
    }
});

// Endpoint to fetch original letter images
app.get('/api/letters', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const offset = (page - 1) * limit;

        const query = 'SELECT id, orgin_image FROM letter LIMIT ? OFFSET ?';
        db.query(query, [limit, offset], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const imagesWithBase64 = results.map((row) => ({
                id: row.id,
                orgin_image: row.orgin_image ? row.orgin_image.toString('base64') : null,
            }));

            const responseObj = { letters: imagesWithBase64 };

            res.json(responseObj);
        });
    }
    catch (err) {
        console.log(`Error : ${err}`);
        res.send(`Error : ${err}`);
    }
});

// Endpoint to fetch word images
app.get('/api/words', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const offset = (page - 1) * limit;

        const query = 'SELECT id, image FROM words LIMIT ? OFFSET ?';
        db.query(query, [limit, offset], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const imagesWithBase64 = results.map((row) => ({
                id: row.id,
                image: row.image ? row.image.toString('base64') : null,
            }));

            const responseObj = { words: imagesWithBase64 };

            res.json(responseObj);
        });
    }
    catch (err) {
        console.log(`Error : ${err}`);
        res.send(`Error : ${err}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});