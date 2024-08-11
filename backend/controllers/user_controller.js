import Admin from "../models/admin.js";
import SuperAdmin from "../models/super_admin.js";
import Team from "../models/team.js";

function isNumberString(value) {
  return /^\d+$/.test(value);
}

class UserController {
  static async login(req, res) {
    const response = {
      success: false,
      team: "",
      admin: "",
      superAdmin: "",
      errorMsg: "",
    };

    const { username, password } = req.body;

    if (isNumberString(username)) {
      const team = await Team.findOne({ number: username, password });

      try {
        if (team) {
          response.success = true;
          response.team = team;
          return res.json(response);
        }
      } catch (error) {}
    }

    const admin = await Admin.findOne({ name: username, password });

    try {
      if (admin) {
        response.success = true;
        response.admin = admin;
        return res.json(response);
      }
    } catch (error) {}

    const superAdmin = await SuperAdmin.findOne({ name: username, password });

    try {
      if (superAdmin) {
        response.success = true;
        response.superAdmin = superAdmin;
        return res.json(response);
      }
    } catch (error) {}

    response.errorMsg = "Invalid Credentials";
    return res.json(response);
  }
}

export default UserController;
