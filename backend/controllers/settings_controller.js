import Settings from "../models/setting.js";

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
      const setting = await Settings.findOne({ name });

      console.log(setting);

      if (!setting) {
        result.errorMsg = "Setting not found";
        return res.json(result);
      }

      setting.value = value;
      await setting.save();
      result.success = true;
      return res.json(result);
    } catch (error) {
      console.log(error);
      result.success = false;
      result.errorMsg = "Failed to update setting";
      return res.json(result);
    }
  }
}

export default SettingsController;
