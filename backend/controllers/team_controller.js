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

  static async get_all_teams(req, res) {

    try {
      const teams = await Team.find();
      console.log(teams)
      return res.json(teams);
    } catch (error) {
      return res.json({})    
    }
  }

  // Get team function
  static async get_team(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { number } = req.params;

    try {
      const team = await Team.findOne({ number });

      if (!team) {
        result.errorMsg = `Team ${number} not found`;
        return res.json(result);
      }

      result.success = true;
      result.team = team;
      return res.json(result);

    } catch (error) {
      console.error("Error fetching team:", error);
      result.errorMsg = "Error fetching team";
      return res.json(result);
    }
  }

  static async update_team(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { number } = req.params;
    const { teamName, password } = req.body;

    try {
      const team = await Team.findOne({ number });

      if (!team) {
        result.errorMsg = `Team ${number} not found`;
        return res.json(result);
      }

      team.name = teamName;
      team.password = password;

      await team.save();

      result.success = true;
      return res.json(result);

    } catch (error) {
      result.errorMsg = "Error updating team";
      return res.json(result);
    }
  }
}

export default TeamController;
