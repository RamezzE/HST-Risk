import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongooseConnectionPromise from "./db.js";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createHttpServer } from "http";
import TeamController from "./controllers/team_controller.js";

import admin_router from "./routes/admin.js";
import country_router from "./routes/country.js";
import team_router from "./routes/team.js";
import attack_router from "./routes/attack.js";
import warzone_router from "./routes/warzone.js";
import user_router from "./routes/user.js";
import settings_router from "./routes/settings.js";

dotenv.config({ path: "./.env" });

const app = express();

const isProduction = process.env.NODE_ENV === "production";

let server;

server = createHttpServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET"],
  },
});

app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "idk_what_to_put_here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.set("env", process.env.NODE_ENV || "development");
app.set("port", process.env.PORT || 3000);
app.set("host", process.env.HOST || "localhost");

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

mongooseConnectionPromise
  .then(() => {
    server.listen(app.get("port"), () => {
      console.log(
        `Server is up and running on ${
          isProduction ? "https" : "http"
        }://${app.get("host")}:${app.get("port")}`
      );

      TeamController.updateTeamBalances();
      setInterval(() => {
        TeamController.updateTeamBalances();
      }, 1000 * 60 * 1);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export { io };
