import express from "express";
import session from "express-session";

import dotenv from "dotenv";
import mongooseConnectionPromise from "./db.js";

import TeamController from "./controllers/team_controller.js";
import AttackController from "./controllers/attack_controller.js";

import admin_router from "./routes/admin.js";
import zone_router from "./routes/zone.js";
import team_router from "./routes/team.js";

import Zone from "./models/zone.js";

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
    { latitude: -4.85606018722551, longitude: 11.87022968697101 },
    { latitude: -3.3841921516029365, longitude: 10.627191126598888 },
    { latitude: -3.001106865644673, longitude: 10.292883886696027 },
    { latitude: -1.3587498795628754, longitude: 16.747659890553496 },
    { latitude: 4.0132168068751195, longitude: 18.530326090801836 },
    { latitude: 4.299996393042105, longitude: 22.84336905502744 },
    { latitude: 4.68220011621426, longitude: 27.731484414483123 },
    { latitude: 3.4542185820690765, longitude: 32.01519374583605 },
    { latitude: 0.1116679083567425, longitude: 34.001076617354876 },
    { latitude: -4.3587815908493, longitude: 39.12548819306352 },
    { latitude: 5.727802176539433, longitude: 48.65734687427881 },
    { latitude: 11.71923932637453, longitude: 50.67883114368935 },
    { latitude: 10.511877828397884, longitude: 44.35070647423024 },
    { latitude: 15.39254902163103, longitude: 39.69250297737176 },
    { latitude: 22.04723323222197, longitude: 36.352659401823885 },
    { latitude: 20.31972649750868, longitude: 24.807954815418174 },
    { latitude: 16.05104675898324, longitude: 16.341821661949158 },
    { latitude: 10.25240845043157, longitude: 10.697733500790408 },
    { latitude: 3.4015223816101186, longitude: 9.85864769301634 },
    { latitude: 1.1408574950932684, longitude: 9.305788795229992 },
    { latitude: -0.38169165242649095, longitude: 9.243640741535984 },
    { latitude: -0.6302739868516516, longitude: 8.66877124486643 },
    { latitude: -1.9534387420808224, longitude: 9.304913520540412 },
  ];

  const newZone3 = new Zone({
    color: "#0000FF",
    label: "East Africa",
    team_no: 1,
    points: pts,
  });

  newZone3
    .save()
    .then(() => {
      console.log("Zone created");
    })
    .catch((err) => {
      console.error("Error creating zone:", err);
    });
});

app.use("/admin", admin_router);
app.use("/teams", team_router);
app.use("/zones", zone_router);

app.get("/team/:number", TeamController.get_team);
app.get("/all_teams", TeamController.get_all_teams);

app.post("/attack", AttackController.attack);
