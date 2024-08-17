import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongooseConnectionPromise from "./db.js";

import admin_router from "./routes/admin.js";
import country_router from "./routes/country.js";
import team_router from "./routes/team.js";
import attack_router from "./routes/attack.js";
import warzone_router from "./routes/warzone.js";
import user_router from "./routes/user.js";
import settings_router from "./routes/settings.js";

import Settings from "./models/setting.js";

const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "idk_what_to_put_here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI }),
  })
);

dotenv.config({ path: "./.env" });

app.set("env", process.env.ENV);
app.set("port", process.env.PORT);
app.set("host", process.env.HOST);

// Session configuration with MongoDB store

app.use(express.json());

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

const insertSettings = async () => {
  try {
    const settings = [
      { name: "Disqualify Timer (mins)", value: "3", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
    ];
    
    const result = await Settings.insertMany(settings);
    console.log("Settings inserted:", result);

  } catch (error) {
    console.error("Error inserting settings:", error);
  }
};

app.get("/", (req, res, next) => {
  res.send("Server is up and running. HST");

  insertSettings();
});



app.use("/users", user_router);
app.use("/admins", admin_router);
app.use("/countries", country_router);
app.use("/teams", team_router);
app.use("/warzones", warzone_router);
app.use("/settings", settings_router);

app.use("/attacks", attack_router);
