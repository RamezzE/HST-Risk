import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongooseConnectionPromise from "./db.js";
import TeamController from "./controllers/team_controller.js";

// Import routers
import admin_router from "./routes/admin.js";
import country_router from "./routes/country.js";
import team_router from "./routes/team.js";
import attack_router from "./routes/attack.js";
import warzone_router from "./routes/warzone.js";
import user_router from "./routes/user.js";
import settings_router from "./routes/settings.js";

// Import models
import Country from "./models/country.js";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// Session configuration with MongoDB store
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

// Set environment variables for the app
app.set("env", process.env.ENV);
app.set("port", process.env.PORT);
app.set("host", process.env.HOST);

// Start the server after database connection
mongooseConnectionPromise
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server is up and running");
      console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`);

      // Update team balances periodically
      TeamController.updateTeamBalances();
      setInterval(() => {
        TeamController.updateTeamBalances();
      }, 1000 * 60 * 1);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Array of countries
const countries = [
  { name: 'North Africa', teamNo: 1 },
  { name: 'Egypt', teamNo: 3 },
  { name: 'Central Africa', teamNo: 5 },
  { name: 'Congo', teamNo: 1 },
  { name: 'South Africa', teamNo: 2 },
  { name: 'Madagascar', teamNo: 3 },
  { name: 'New Guinea', teamNo: 2 },
  { name: 'Eastern Australia', teamNo: 4 },
  { name: 'Western Australia', teamNo: 3 },
  { name: 'New Zealand', teamNo: 4 },
  { name: 'Indonesia', teamNo: 4 },
  { name: 'Venezuela', teamNo: 1 },
  { name: 'Peru', teamNo: 2 },
  { name: 'Brazil', teamNo: 4 },
  { name: 'Bolivia', teamNo: 5 },
  { name: 'Chile', teamNo: 1 },
  { name: 'Paraguay', teamNo: 4 },
  { name: 'Argentina', teamNo: 5 },
  { name: 'Alaska', teamNo: 3 },
  { name: 'Northwest Territories', teamNo: 4 },
  { name: 'Canada', teamNo: 2 },
  { name: 'Western US', teamNo: 5 },
  { name: 'Eastern US', teamNo: 1 },
  { name: 'Quebec', teamNo: 3 },
  { name: 'Honduras', teamNo: 1 },
  { name: 'Cuba', teamNo: 2 },
  { name: 'Mexico', teamNo: 2 },
  { name: 'Greenland', teamNo: 2 },
  { name: 'Iceland', teamNo: 5 },
  { name: 'Britain', teamNo: 5 },
  { name: 'Northern Europe', teamNo: 1 },
  { name: 'Europe', teamNo: 5 },
  { name: 'Russia', teamNo: 1 },
  { name: 'Kazakhstan', teamNo: 2 },
  { name: 'Middle East', teamNo: 3 },
  { name: 'India', teamNo: 4 },
  { name: 'China', teamNo: 3 },
  { name: 'Mongolia', teamNo: 2 },
  { name: 'Korea', teamNo: 2 },
  { name: 'Japan', teamNo: 2 },
];

// Route to check server status and insert countries
app.get("/", async (req, res, next) => {
  try {
    res.send("Server is up and running. HST");
  } catch (error) {
    next(error);
  }
});

// Use routers
app.use("/users", user_router);
app.use("/admins", admin_router);
app.use("/countries", country_router);
app.use("/teams", team_router);
app.use("/warzones", warzone_router);
app.use("/settings", settings_router);
app.use("/attacks", attack_router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
