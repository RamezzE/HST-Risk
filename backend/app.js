import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongooseConnectionPromise from "./db.js";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
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

// Create HTTP server
const httpServer = createServer(app);

// Set up Socket.io
const io = new SocketIOServer(httpServer, {
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
      secure: process.env.NODE_ENV === "production",
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

  // Emit initial data or listen to specific events
  socket.on("get_initial_data", async () => {
    try {
      // Example: Fetch initial teams and countries data
      // const teams = await TeamController.get_all_teams();
      // const countries = await Country.find(); // Assuming Country model is imported
      // socket.emit("update_teams", teams);
      // socket.emit("update_countries", countries);
    } catch (error) {
      // console.error("Error fetching initial data:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Start the server after database connection
mongooseConnectionPromise
  .then(() => {
    httpServer.listen(app.get("port"), () => {
      console.log(`Server is up and running on http://${app.get("host")}:${app.get("port")}`);

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
  res.send("Server is up and running. HST");
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

