import Team from "../models/team.js";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI, {});

class TeamController {
  static async login(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { teamNo, password } = req.body;

    try {
      const team = await Team.findOne({ number: teamNo });

      if (!team) {
        console.log(`Team ${teamNo} not found`);
        result.errorMsg = `Team ${teamNo} not found`;
        return res.json(result);
      }

      console.log("Team found:", team);

      const isPasswordValid = team.password === password;

      if (!isPasswordValid) {
        console.log("Invalid password");
        result.errorMsg = "Invalid password";
        return res.json(result);
      }

      console.log("Login Successful");
      result.success = true;
      return res.json(result);
    } catch (error) {
      console.log("Error during login:", error);
      result.errorMsg = "Error logging in";
      return res.json(result);
    }
  }

  static async add_team(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };
    
    const { teamNo, teamName, password } = req.body;

    const team = await Team.findOne({ number: teamNo });

    if (team) {
      result.errorMsg = `Team ${teamNo} already exists`;
      return res.json(result);
    }

    const newTeam = new Team({
      number: teamNo,
      name: teamName,
      password: password,
    });

    try {
      await newTeam.save();
      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Error adding team:", error);
      result.errorMsg = "Error adding team";
      return res.json(result);
    }
  }

  // Get team function
  static async get_team(req, res) {
    const { number } = req.params;

    try {
      const team = await Team.findOne({ number });

      if (!team) {
        return res.status(404).send("Team not found");
      }

      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).send("Error fetching team");
    }
  }
}

export default TeamController;
