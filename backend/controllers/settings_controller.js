import Settings from "../models/setting.js";
import { io } from "../app.js";
class SettingsController {
  static async get_settings(req, res) {
    const settings = await Settings.find();
    return res.json(settings);
  }

  static async update_setting(req, res) {
    const { name, value } = req.body;
  
    const result = {
      success: false,
      errorMsg: "",
    };
  
    try {
      const setting = await Settings.findOneAndUpdate(
        { name: name },
        { $set: { value: value } },
        { new: true }
      );
  
      if (!setting) {
        result.errorMsg = "Setting not found";
        return res.json(result);
      }
  
      io.emit("update_setting", setting);
  
      result.success = true;
      return res.json(result);
    } catch (error) {
      console.log(error);
      result.errorMsg = "Failed to update setting";
      return res.json(result);
    }
  }
  
}

export default SettingsController;
