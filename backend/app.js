import express from "express";
import session from "express-session";

import dotenv from "dotenv";
import mongooseConnectionPromise from "./db.js";

import TeamController from "./controllers/team_controller.js";

import admin_router from "./routes/admin.js";
import country_router from "./routes/country.js";
import team_router from "./routes/team.js";
import attack_router from "./routes/attack.js";
import warzone_router from "./routes/warzone.js";

import Zone from "./models/zone.js";
import Continent from "./models/continent.js";
import Warzone from "./models/warzone.js";
import Team from "./models/team.js";
import Country from "./models/country.js";
import countries from "../frontend/constants/countries.js";

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

// Warzone.insertMany(warzones).then(() => {
//   console.log('Warzones saved');
// }).catch((err) => {
//   console.error('Error saving warzones:', err);
// });

const countries = [
  {
    name: 'South Africa',
    teamNo: 1,
  },
  {
    name: 'Central Africa',
    teamNo: 2,
  },
  {
    name: 'East Africa',
    teamNo: 3,
  },
  {
    name: 'Egypt',
    teamNo: 4,
  },
  {
    name: 'North Africa',
    teamNo: 5,
  },
  {
    name: 'Madagascar',
    teamNo: 1,
  },
  {
    name: 'New Zealand',
    teamNo: 2,
  },
  {
    name: 'Western Australia',
    teamNo: 3,
  },
  {
    name: 'Eastern Australia',
    teamNo: 4,
  },
  {
    name: 'New Guinea',
    teamNo: 5,
  },
  {
    name: 'Indonesia',
    teamNo: 1,
  },
  {
    name: 'Brazil',
    teamNo: 2,
  },
  {
    name: 'Venezuela',
    teamNo: 3,
  },
  {
    name: 'Peru',
    teamNo: 4,
  },
  {
    name: 'Bolivia',
    teamNo: 5,
  },
  {
    name: 'Chile',
    teamNo: 1,
  },
  {
    name: 'Argentina',
    teamNo: 2,
  },
  {
    name: 'Paraguay',
    teamNo: 3,
  },
]

// Country.insertMany(countries).then(() => {
//   console.log('countries saved');
// }).catch((err) => {
//   console.error('Error saving countries:', err);
// });


});

app.use("/admin", admin_router);
app.use("/teams", team_router);
app.use("/countries", country_router);
app.use("/attacks", attack_router);
app.use("/warzones", warzone_router);

app.get("/team/:number", TeamController.get_team);
app.get("/all_teams", TeamController.get_all_teams);
