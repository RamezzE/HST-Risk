import Admin from "../models/admin.js";
import { io } from "../app.js";

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

    try {
      // Check if the admin already exists
      const adminExists = await Admin.exists({ name: name });

      if (adminExists) {
        result.errorMsg = `Admin ${name} already exists`;
        return res.json(result);
      }

      // Create a new admin
      const newAdmin = new Admin({
        name,
        password: generatePassword(), // Ensure generatePassword() is a secure function
        war,
        type,
      });

      // Save the new admin to the database
      await newAdmin.save();

      // Emit the event after successful save
      io.emit("add_admin", newAdmin);

      result.success = true;
      return res.json(result); // 201 Created status code for a successfully created resource
    } catch (error) {
      console.error("Error adding admin:", error);
      result.errorMsg = "Error adding admin: " + error.message; // Include the error message for more context
      return res.json(result); // 500 Internal Server Error status code for server-side errors
    }
  }

  static async update_admin(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { oldName, name, password, war, type } = req.body;

    try {
      const admin = await Admin.findOneAndUpdate(
        { name: oldName },
        { $set: { name: name, password: password, war: war, type: type } },
        { new: true }
      );

      if (!admin) {
        result.errorMsg = `Admin ${oldName} not found`;
        return res.json(result);
      }

      io.emit("update_admin", admin);

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Error updating admin";
      console.error("Error updating admin:", error);
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
      // Attempt to find and delete the admin in one step
      const admin = await Admin.findOneAndDelete({ name: name });

      if (!admin) {
        result.errorMsg = `Admin ${name} not found`;
        return res.json(result); // 404 Not Found status code
      }

      // Emit event after successful deletion
      io.emit("delete_admin", name);

      result.success = true;
      return res.json(result); // 200 OK status code for successful deletion
    } catch (error) {
      result.errorMsg = "Error deleting admin: " + error.message;
      console.error("Error deleting admin:", error);
      return res.json(result); // 500 Internal Server Error status code for server-side errors
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
      const admin = await Admin.findOne({ name: name });

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
