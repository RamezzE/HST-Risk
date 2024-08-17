import Team from "../models/team.js";
import Settings from "../models/setting.js";
import SubTeam from "../models/subteam.js";

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

const getTeamName = (teamNo) => {
  if (teamNo === "1") {
    return "Zeus";
  } else if (teamNo === "2") {
    return "Poseidon";
  } else if (teamNo === "3") {
    return "Athena";
  } else if (teamNo === "4") {
    return "Apollo";
  } else if (teamNo === "5") {
    return "Artemis";
  } else if (teamNo === "6") {
    return "Hermes";
  } else if (teamNo === "7") {
    return "Demeter";
  } else if (teamNo === "8") {
    return "Ares";
  } else if (teamNo === "9") {
    return "Hephaestus";
  } else if (teamNo === "10") {
    return "Hera";
  } else {
    return "Unknown";
  }
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

class TeamController {
  static async create_teams(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { numTeams, numSubTeams } = req.body;

    if (numTeams < 2 || numTeams > 10 || numSubTeams < 1 || numSubTeams > 10) {
      result.errorMsg = "Invalid number of teams";
      return res.json(result);
    }

    let teams = [];
    let subTeams = [];

    try {
      await Team.deleteMany({});
      await SubTeam.deleteMany({});

      for (let i = 1; i <= numTeams; i++) {
        const teamNo = i.toString();
        const teamName = getTeamName(teamNo);
        const color = getTeamColor(teamNo);

        const initialMoney = await Settings.findOne({ name: "Initial Money" });

        const team = new Team({
          number: teamNo,
          name: teamName,
          color: color,
          balance: initialMoney.value,
        });

        teams.push(team);

        for (let j = 0; j < numSubTeams; j++) {
          const subTeam = new SubTeam({
            number: i.toString(),
            name: teamName,
            letter: String.fromCharCode(65 + j),
            username: i.toString() + String.fromCharCode(65 + j),
            password: generatePassword(),
          });

          subTeams.push(subTeam);
        }
      }

      await Team.insertMany(teams);

      await SubTeam.insertMany(subTeams);

      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Error creating teams:", error);
      result.errorMsg = "Error creating teams";
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
    const { teamName } = req.body;

    try {
      const team = await Team.findOne({ number });

      if (!team) {
        result.errorMsg = `Server: Team ${number} not found`;
        return res.json(result);
      }

      team.name = teamName;

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

  static async get_all_subteams(req, res) {
    try {
      const subteams = await SubTeam.find();
      return res.json(subteams);
    } catch (error) {
      return res.json({});
    }
  }

  static async update_subteam(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { username, password } = req.body;

    try {
      const subteam = await SubTeam.findOne({ username });

      if (!subteam) {
        result.errorMsg = `Subteam ${username} not found`;
        return res.json(result);
      }

      subteam.password = password;

      await subteam.save();

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.success = false;
      result.errorMsg = "Error updating subteam";
      console.error("Error updating subteam:", error);
      return res.json(result);
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
