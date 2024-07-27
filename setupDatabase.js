const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'auctionpe_user', // your MySQL username
    password: 'Sagar@2024', // your MySQL password
    multipleStatements: true
});

const createDatabaseAndTables = `
    CREATE DATABASE IF NOT EXISTS auctionpe;
    USE auctionpe;

    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS actions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT,
        action_type VARCHAR(255),
        action_time TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions(id)
    );
`;

db.query(createDatabaseAndTables, (err, results) => {
    if (err) {
        console.error('Error creating database and tables', err);
        process.exit(1);
    }
    console.log('Database and tables created successfully');
    db.end();
});
