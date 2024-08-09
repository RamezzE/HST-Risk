import Admin from "../models/admin.js";
import Team from "../models/team.js";
import Country from "../models/country.js";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI, {});

class AdminController {
  static async login(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { name, password } = req.body;

    const admin = await Admin.findOne({ name, password });

    if (!admin) {
      result.errorMsg = "Server: Invalid credentials";
      return res.json(result);
    }

    result.success = true;
    return res.json(result);
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

  static async update_country(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { name } = req.params;
    const { teamNo } = req.body;

    try {
      const country = await Country.findOne({ name: name });

      if (!country) {
        result.errorMsg = `Server: ${name} not found`;
        return res.json(result);
      }

      country.teamNo = teamNo;

      await country.save();

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Server: Error updating country";
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

  static async get_admins(req, res) {
    const result = {
      success: false,
      errorMsg: "",
      admins: [],
    };

    try {
      const admins = await Admin.find();

      result.success = true;
      result.admins = admins;

      return res.json(result);
    } catch (error) {
      result.errorMsg = "Server: Error fetching admins";
      console.log(error);
      return res.json(result);
    }
  }

  static async add_admin(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { name, password, war } = req.body;

    const admin = await Admin.findOne({ name });

    if (admin) {
      result.errorMsg = `Server: Admin ${name} already exists`;
      return res.json(result);
    }

    const newAdmin = new Admin({
      name: name,
      password: password,
      war: war,
    });

    try {
      await newAdmin.save();
      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Server: Error adding admin:", error);
      result.errorMsg = "Server: Error adding admin";
      return res.json(result);
    }
  }

  static async update_admin(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { oldName, name, password, war } = req.body;

    try {
      const admin = await Admin.findOne({ name: oldName });

      if (!admin) {
        result.errorMsg = `Server: Admin ${name} not found`;
        return res.json(result);
      }

      admin.name = name;
      admin.password = password;
      admin.war = war;

      await admin.save();

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Server: Error updating admin";
      console.log(error);
      return res.json(result);
    }
  }

  static async delete_admin(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { name } = req.body;

    try {
      const admin = await Admin.findOne({ name });

      if (!admin) {
        result.errorMsg = `Server: Admin ${name} not found`;
        return res.json(result);
      }

    } catch (error) {
      result.errorMsg = `Server: Admin ${name} not found`;
      return res.json(result);
    }

    try {
      await Admin.deleteOne({ name });
      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Server: Error deleting admin";
      console.log(error);
      return res.json(result);
    }
  }
}

export default AdminController;
