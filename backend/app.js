import express from "express";
import dotenv from 'dotenv';
import mongooseConnectionPromise from './db.js';

const app = express();

dotenv.config({ path: './.env' })

app.set('env', process.env.ENV);
app.set('port', process.env.PORT);
app.set('host', process.env.HOST);

mongooseConnectionPromise.then(() => {
    // Database connection is established, start your Express server
    app.listen(process.env.PORT, () => {
        console.log('Server is up and running');
        console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`);
    });
}).catch((err) => {
    // Handle error if database connection fails
    console.error('Error connecting to MongoDB:', err);
});

app.get('/', (req, res, next) => {
    res.send('Server is up and running');
});
