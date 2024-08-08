import express from "express";
import session from "express-session";

import dotenv from "dotenv";
import mongooseConnectionPromise from "./db.js";

import TeamController from "./controllers/team_controller.js";

import admin_router from "./routes/admin.js";
import zone_router from "./routes/zone.js";
import team_router from "./routes/team.js";
import attack_router from "./routes/attack.js";

import Zone from "./models/zone.js";
import Admin from "./models/admin.js";

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

 
  
  const pts = [
    { latitude: 16.05104675898324, longitude: 16.341821661949158 },
    { latitude: 31.891760855372407, longitude: 15.49693495821058 },
    { latitude: 32.39010286226811, longitude: 15.205680400884063 },
    { latitude: 33.05211429923357, longitude: 13.234284229169287 },
    { latitude: 32.8616489255095, longitude: 12.582543701785672 },
    { latitude: 33.31724900517517, longitude: 11.153138584934693 },
    { latitude: 33.87374159102214, longitude: 10.982231451398164 },
    { latitude: 33.705878513509305, longitude: 10.469510050788573 },
    { latitude: 34.10562325721567, longitude: 10.018936698737722 },
    { latitude: 35.141219002331006, longitude: 11.137601572795008 },
    { latitude: 36.351732536227, longitude: 10.79578730572195 },
    { latitude: 36.90037168647951, longitude: 11.137601572795008 },
    { latitude: 37.018516898905176, longitude: 11.13297453144303 },
    { latitude: 37.35706767098503, longitude: 9.525499423174534 },
    { latitude: 36.6942541033817, longitude: 0.8703206351287422 },
    { latitude: 35.12954026229675, longitude: -2.173035840814271 },
    { latitude: 35.704495657617166, longitude: -5.282510337008217 },
    { latitude: 32.83307342164833, longitude: -9.332666418598276 },
    { latitude: 30.752762459433466, longitude: -9.953800552543596 },
    { latitude: 30.258093260000233, longitude: -9.662824576081992 },
    { latitude: 28.115125113774845, longitude: -13.0188194755583 },
    { latitude: 21.576809698391678, longitude: -17.17375721835958 },
    { latitude: 17.904721198896354, longitude: -16.517561461057124 },
    { latitude: 14.926861373114578, longitude: -17.53389536355368 },
    { latitude: 12.430827329895047, longitude: -16.814817830701408 },
    { latitude: 9.046742026631359, longitude: -13.490096589966376 },
    { latitude: 7.654377358854606, longitude: -13.106281840302023 },
    { latitude: 6.829419905703505, longitude: -11.5710228416446 },
    { latitude: 4.245129710706169, longitude: -7.713541478219482 },
    { latitude: 5.011930082767388, longitude: -4.031992622118569 },
    { latitude: 4.422680256592398, longitude: -1.814785393024083 },
    { latitude: 6.318331249527331, longitude: 2.9747583888347724 },
    { latitude: 6.09351596174411, longitude: 4.843622256900305 },
    { latitude: 4.266370765877477, longitude: 5.93126868446359 },
    { latitude: 4.392237623731884, longitude: 8.65065650615065 },
    { latitude: 3.3289974213254068, longitude: 9.845994929152084 },
    { latitude: 10.25240845043157, longitude: 10.697733500790408 }
  ];
  

  const newZone3 = new Zone({
    color: "#229AF2",
    label: "North Africa",
    team_no: 2,
    points: pts,
  });

  // newZone3
  //   .save()
  //   .then(() => {
  //     console.log("Zone created");
  //   })
  //   .catch((err) => {
  //     console.error("Error creating zone:", err);
  //   });


  // create admin user 

  const newAdmin = new Admin({
    name: "Ramez",
    password: "1",
    zone: "North Africa",
  });

  // newAdmin.save().then(() => {
  //   console.log("Admin created");
  // }
  // ).catch((err) => {
  //   console.error("Error creating admin:", err);
  // });

});

app.use("/admin", admin_router);
app.use("/teams", team_router);
app.use("/zones", zone_router);
app.use("/attacks", attack_router);

app.get("/team/:number", TeamController.get_team);
app.get("/all_teams", TeamController.get_all_teams);

