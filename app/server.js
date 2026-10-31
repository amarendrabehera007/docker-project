const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

const dbConfig = {
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'appdb'
};

app.get('/', async (req, res) => {
    res.send('Welcome to Docker Multi-Stage Application!');
});

app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

app.get('/db-check', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT NOW() AS database_time');
        await connection.end();

        res.json({
            database: 'CONNECTED',
            result: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            database: 'DISCONNECTED',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Application running on port ${PORT}`);
});
