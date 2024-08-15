import Team from "../models/team.js";

const getTeamColor = (teamNo) => {
  if (teamNo === "1") {
    return "#0000FF"; // Blue
  } else if (teamNo === "2") {
    return "#FF0000"; // Red
  } else if (teamNo === "3") {
    return "#00FF00"; // Green
  } else if (teamNo === "4") {
    return "#FFFF00"; // Yellow
  } else if (teamNo === "5") {
    return "#800080"; // Purple
  } else if (teamNo === "6") {
    return "#8B4513"; // Brown
  } else if (teamNo === "7") {
    return "#00FFFF"; // Cyan
  } else if (teamNo === "8") {
    return "#FFC0CB"; // Pink
  } else if (teamNo === "9") {
    return "#808080"; // Gray
  } else if (teamNo === "10") {
    return "#FFA500"; // Orange
  } else {
    return "#FFFFFF"; // White (default)
  }
};

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

    const color = getTeamColor(teamNo);

    const newTeam = new Team({
      number: teamNo,
      name: teamName,
      color: color,
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
