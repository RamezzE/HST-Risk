import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongooseConnectionPromise from "./db.js";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import fs from "fs";
import path from "path";
import TeamController from "./controllers/team_controller.js";

// Import routers
import admin_router from "./routes/admin.js";
import country_router from "./routes/country.js";
import team_router from "./routes/team.js";
import attack_router from "./routes/attack.js";
import warzone_router from "./routes/warzone.js";
import user_router from "./routes/user.js";
import settings_router from "./routes/settings.js";

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// Determine if we are in production or development
const isProduction = process.env.NODE_ENV === "production";

// Set up server (HTTP for development, HTTPS for production)
let server;
if (isProduction) {
  // Set up SSL credentials for production
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/carmel-california.store/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/carmel-california.store/fullchain.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/carmel-california.store/chain.pem",
    "utf8"
  );

  const credentials = { key: privateKey, cert: certificate, ca: ca };

  // Create HTTPS server
  server = createHttpsServer(credentials, app);
  console.log("Starting in production mode with HTTPS");
} else {
  // Create HTTP server for development
  server = createHttpServer(app);
  console.log("Starting in development mode with HTTP");
}

// Set up Socket.io with the appropriate server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity, adjust as needed
    methods: ["GET"],
  },
});

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
      secure: isProduction, // Only secure cookies in production
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Set environment variables for the app
app.set("env", process.env.NODE_ENV || "development");
app.set("port", process.env.PORT || 3000);
app.set("host", process.env.HOST || "localhost");

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("get_initial_data", async () => {
    try {
      // Example: Fetch initial teams and countries data
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Start the server after database connection
mongooseConnectionPromise
  .then(() => {
    server.listen(app.get("port"), () => {
      console.log(
        `Server is up and running on ${
          isProduction ? "https" : "http"
        }://${app.get("host")}:${app.get("port")}`
      );

      // Update team balances periodically
      TeamController.updateTeamBalances();
      setInterval(() => {
        TeamController.updateTeamBalances(io); // Pass io to emit updates if necessary
      }, 1000 * 60 * 1);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Route to check server status and insert countries
app.get("/", (req, res) => {
  res.send("Server is up and running.");
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
  res.status(500).send("Something broke!");
});

export { io };
