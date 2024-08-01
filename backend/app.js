import express from "express";
import dotenv from 'dotenv';
import mongooseConnectionPromise from './db.js';

import Team from './models/team.js'

import login_router from './routes/login.js'

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

// app.get('/', (req, res, next) => {
//     res.send('Server is up and running');
    
// });

app.use('/login', login_router);

app.get('/', async (req, res, next) => {
    try {
      const newTeam = new Team({
        number: 1,
        name: 'Team A',
      });
  
      // Save the team to the database
      await newTeam.save();
  
      res.send('Server is up and running. Team saved to database.');
    } catch (error) {
      console.error('Error saving team:', error);
      res.status(500).send('Error saving team');
    }
});
