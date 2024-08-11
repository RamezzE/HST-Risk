import Admin from "../models/admin.js";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI, {});

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
