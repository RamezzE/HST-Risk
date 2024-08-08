import express from "express";
import session from "express-session";

import dotenv from "dotenv";
import mongooseConnectionPromise from "./db.js";

import TeamController from "./controllers/team_controller.js";

import admin_router from "./routes/admin.js";
import zone_router from "./routes/zone.js";
import team_router from "./routes/team.js";
import attack_router from "./routes/attack.js";
import warzone_router from "./routes/warzone.js";

import Zone from "./models/zone.js";
import Continent from "./models/continent.js";
import Warzone from "./models/warzone.js";

const app = express();

// app.use(session({
//   secret: 'secret-key',
//   resave: true,
//   saveUninitialized: true
// }));

app.use(express.json()); // Middleware to parse JSON bodies

dotenv.config({ path: "./.env" });

app.set("env", process.env.ENV);
app.set("port", process.env.PORT);
app.set("host", process.env.HOST);

mongooseConnectionPromise
  .then(() => {
    // Database connection is established, start your Express server
    app.listen(process.env.PORT, () => {
      console.log("Server is up and running");
      console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // Handle error if database connection fails
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/", (req, res, next) => {
  res.send("Server is up and running");

  // Zone.findOneAndDelete({ label: "Paraguay" }).then(() => {
  //   console.log("Zone deleted");
  // });

  // const newZone3 = new Zone({
  //   color: "#DDFDFF",
  //   label: "Paraguay",
  //   team_no: 3,
  //   points: pts,
  // });

  // newZone3
  //   .save()
  //   .then(() => {
  //     console.log("Zone created");
  //   })
  //   .catch((err) => {
  //     console.error("Error creating zone:", err);
  //   });

  // create admin user

  // const newAdmin = new Admin({
  //   name: "Ramez",
  //   password: "1",
  //   zone: "North Africa",
  // });

  // newAdmin.save().then(() => {
  //   console.log("Admin created");
  // }
  // ).catch((err) => {
  //   console.error("Error creating admin:", err);
  // });



//   const africa = new Continent({
//     name: 'South America',
//     countryNames: ['Venezuela', 'Brazil', 'Peru', 'Bolivia', 'Paraguay', 'Argentina', 'Chile']
//     // countryNames: ['Indonesia', 'New Guinea', 'Western Australia', 'Eastern Australia', 'New Zealand']
//     // countryNames: ['North Africa', 'Egypt', 'East Africa', 'Central Africa', 'South Africa', 'Madagascar']
// });
// africa.save().then(() => {
//     console.log('Africa continent with countries saved');
// }).catch((err) => {
//     console.error('Error saving Africa continent:', err);
// });

const warzones = [
  {
      name: 'Warzone Alpha',
      number: 1,
      wars: ['War A1', 'War A2', 'War A3']
  },
  {
      name: 'Warzone Bravo',
      number: 2,
      wars: ['War B1', 'War B2', 'War B3']
  },
  {
      name: 'Warzone Charlie',
      number: 3,
      wars: ['War C1', 'War C2', 'War C3']
  },
  {
      name: 'Warzone Delta',
      number: 4,
      wars: ['War D1', 'War D2', 'War D3']
  }
];

Warzone.insertMany(warzones).then(() => {
  console.log('Warzones saved');
}).catch((err) => {
  console.error('Error saving warzones:', err);
});


});

app.use("/admin", admin_router);
app.use("/teams", team_router);
app.use("/zones", zone_router);
app.use("/attacks", attack_router);
app.use("/warzones", warzone_router);

app.get("/team/:number", TeamController.get_team);
app.get("/all_teams", TeamController.get_all_teams);
