import Settings from "../models/setting.js";
import { io } from "../app.js";
class SettingsController {
  static async get_settings(req, res) {
    let settings = await Settings.find();
    const order = [
      "Game Status",
      "Attack Cost",
      "Rate ($/min) per country",
      "Disqualify Timer",
      "Attack Cooldown",
      "Max concurrent attacks per team",
      "Max concurrent defences per team",
      "Initial Money",
      "No of Teams",
      "No of Subteams",
    ];
    settings.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
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
      if (req.session.user && req.session.user.mode == "super_admin") 
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
