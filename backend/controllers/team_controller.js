import Team from "../models/team.js";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const client = new MongoClient(process.env.MONGO_URI, {});

class TeamController {
  static async login(req, res) {
    const { number, password } = req.body;
    try {
      const team = await Team.findOne({ number });

      if (!team) {
        console.log(`Team ${number} not found`);
        return res.status(404).send("Team not found");
      }

      console.log("Login Successful");
      res.send("Login successful");
    } catch (error) {
      console.log("Error during login:", error);
      res.status(500).send("Error during login");
    }
  }

  static async add_team(req, res) {
    const { number, name, password } = req.body;

    // Create a new team instance
    const newTeam = new Team({
      number,
      name,
      password,
    });

    // Save the team to the database
    await newTeam.save();
  }
}

export default TeamController;
