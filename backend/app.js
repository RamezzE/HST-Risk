import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose'

const app = express();

dotenv.config({ path: './.env' })

app.set('env', process.env.ENV);

app.set('port', process.env.PORT);
app.set('host', process.env.HOST);


mongoose.connect(process.env.MONGO_URI)
.then(()=> {
    console.log("MongoDB is succesfully connected")
})
.catch((err) => { console.log(err) })


app.listen(process.env.PORT, () => {
    console.log('Server is up and running')
    console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`);
});

app.get('/', (req, res, next) => {
    res.send('Server is up and running');
});

