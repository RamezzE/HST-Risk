import Team from "../models/team.js";
import { MongoClient } from "mongodb";

class TeamController {
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
        result.errorMsg = `Server: Team ${number} not found`;
        return res.json(result);
      }

      team.name = teamName;
      team.password = password;

      await team.save();

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Server: Error updating team";
      console.log(error);
      return res.json(result);
    }
  }

  static async delete_team(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { number } = req.params;

    try {
      const team = await Team.findOne({ number });

      if (!team) {
        result.errorMsg = `Server: Team ${number} not found`;
        return res.json(result);
      }

      const response = await Team.deleteOne({ number });

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Server: Error deleting team";
      console.log(error);
      return res.json(result);
    }
  }

  static async get_all_teams(req, res) {
    try {
      const teams = await Team.find();
      return res.json(teams);
    } catch (error) {
      return res.json({});
    }
  }

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
}

export default TeamController;
