import Settings from "../models/setting.js";

class SettingsController {
  static async get_settings(req, res) {
    const settings = await Settings.find();
    return res.json(settings);
  }

  
}

export default SettingsController;
