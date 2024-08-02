import express from "express";
import dotenv from 'dotenv';
import mongooseConnectionPromise from './db.js';

import TeamController from './controllers/team_controller.js';
import Team from './models/team.js';

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

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

app.post("/login", TeamController.login);
app.post("/add_team", TeamController.add_team);

app.get("/team/:number", TeamController.get_team);
app.get("/all_teams", TeamController.get_all_teams);

app.put("/team/:number", TeamController.update_team);
