import express from "express";
import dotenv from 'dotenv';
import mongooseConnectionPromise from './db.js';

import TeamController from './controllers/team_controller.js';
import admin_router from "./routes/admin.js";
import zone_router from "./routes/zone.js";

import Zone from './models/zone.js';

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
    
    // const newAdmin = new Admin({
    //     name: 'admin',
    //     password: 'admin'
    // });
    // newAdmin.save().then(() => {
    //     console.log('Admin user created');
    // }).catch((err) => {
    //     console.error('Error creating admin user:', err);
    // });

    // create a zone
    const volleyPoints = [
        { latitude: 30.35927840030033, longitude: 30.394175088567142 },
        { latitude: 30.359132592615552, longitude: 30.394722259177602 },
        { latitude: 30.358181365719084, longitude: 30.39435747877063},
        { latitude: 30.35833442651126, longitude: 30.393810737054782}
      ];

    const newZone = new Zone({
        color: '#FF0000',
        label: 'Stadium',
        points: volleyPoints
    });
    // newZone.save().then(() => {
    //     console.log('Zone created');
    // }).catch((err) => {
    //     console.error('Error creating zone:', err);
    // });


});

app.use("/admin", admin_router);
app.use("/zones", zone_router);

app.get("/team/:number", TeamController.get_team);
app.get("/all_teams", TeamController.get_all_teams);

