import express from "express";
import dotenv from 'dotenv';
import mongooseConnectionPromise from './db.js';

import TeamController from './controllers/team_controller.js';
import AdminController from "./controllers/admin_controller.js";
import Admin from "./models/admin.js";
import admin_router from "./routes/admin.js";

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

    // create an admin user
    const newAdmin = new Admin({
        name: 'admin',
        password: 'admin'
    });
    newAdmin.save().then(() => {
        console.log('Admin user created');
    }).catch((err) => {
        console.error('Error creating admin user:', err);
    });

});

app.use("/admin", admin_router);

app.get("/team/:number", TeamController.get_team);
app.get("/all_teams", TeamController.get_all_teams);

