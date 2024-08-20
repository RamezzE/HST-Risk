import Admin from "../models/admin.js";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI, {});
const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};
class AdminController {

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
      result.errorMsg = "Error fetching admins";
      console.log(error);
      return res.json(result);
    }
  }

  static async add_admin(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { name, war, type } = req.body;

    const admin = await Admin.findOne({ name });

    if (admin) {
      result.errorMsg = `Admin ${name} already exists`;
      return res.json(result);
    }

    const newAdmin = new Admin({
      name: name,
      password: generatePassword(),
      war: war,
      type: type,
    });

    try {
      await newAdmin.save();
      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Error adding admin:", error);
      result.errorMsg = "Error adding admin";
      return res.json(result);
    }
  }

  static async update_admin(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { oldName, name, password, war, type } = req.body;

    try {
      const admin = await Admin.findOne({ name: oldName });

      if (!admin) {
        result.errorMsg = `Admin ${name} not found`;
        return res.json(result);
      }

      admin.name = name;
      admin.password = password;
      admin.war = war;
      admin.type = type;

      await admin.save();

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Error updating admin";
      console.log(error);
      return res.json(result);
    }
  }

  static async delete_admin(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { name } = req.params;

    try {
      const admin = await Admin.findOne({ name });

      if (!admin) {
        result.errorMsg = `Admin ${name} not found`;
        return res.json(result);
      }

    } catch (error) {
      result.errorMsg = `Admin ${name} not found`;
      return res.json(result);
    }

    try {
      await Admin.deleteOne({ name });
      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Error deleting admin";
      console.log(error);
      return res.json(result);
    }
  }

  static async get_admin_by_name(req, res) {
    const result = {
      success: false,
      errorMsg: "",
      admin: {},
    };

    const { name } = req.params;

    try {
      const admin = await Admin.findOne({ name });

      if (!admin) {
        result.errorMsg = `Admin ${name} not found`;
        return res.json(result);
      }

      result.success = true;
      result.admin = admin;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Error getting admin by name";
      console.log(error);
      return res.json(result);
    }
  }
}

export default AdminController;
