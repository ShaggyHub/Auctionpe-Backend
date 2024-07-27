const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost', // or your MySQL server IP
    user: 'auctionpe_user', // your MySQL username
    password: 'Sagar@2024', // your MySQL password
    database: 'auctionpe'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database', err);
        return;
    }
    console.log('Connected to the database');
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).send('Error registering the user');
        res.status(200).send('User registered successfully');
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Error on the server');
        if (results.length === 0) return res.status(404).send('No user found');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});

app.get('/sessions', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided' });

    jwt.verify(token, 'supersecret', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token' });

        db.query('SELECT * FROM sessions WHERE user_id = ?', [decoded.id], (err, results) => {
            if (err) return res.status(500).send('Error fetching sessions');
            res.status(200).send(results);
        });
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
