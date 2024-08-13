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
      try {
        const team = await Team.findOne({ number: username });

        if (team != null) {
          if (team.password !== password) {
            response.errorMsg = "Invalid Credentials";
            return res.json(response);
          }
          req.session.user = { id: team._id, mode: "team" };
          response.success = true;
          response.team = team;
          return res.json(response);
        }
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const admin = await Admin.findOne({ name: username, password });

      if (admin != null) {
        if (admin.password !== password) {
          response.errorMsg = "Invalid Credentials";
          return res.json(response);
        }
        req.session.user = { id: admin._id, mode: "admin" };
        response.success = true;
        response.admin = admin;
        return res.json(response);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const superAdmin = await SuperAdmin.findOne({ name: username, password });
      if (superAdmin != null) {
        if (superAdmin.password !== password) {
          response.errorMsg = "Invalid Credentials";
          return res.json(response);
        }
        req.session.user = { id: superAdmin._id, mode: "super_admin" };
        response.success = true;
        response.superAdmin = superAdmin;
        return res.json(response);
      }
    } catch (error) {
      console.log(error);
    }

    response.errorMsg = "Invalid Credentials";
    return res.json(response);
  }

  static async logout(req, res) {
    req.session.destroy((err) => {});
  }

  static async is_logged_in(req, res) {
    const response = {
      success: false,
      team: "",
      admin: "",
      superAdmin: "",
      errorMsg: "",
    };

    if (!req.session.user) {
      response.success = false;
      return res.json(response);
    }

    const { id, mode } = req.session.user;

    if (mode === "team") {
      const team = await Team.findById(id);

      if (team) {
        response.success = true;
        response.team = team;
        return res.json(response);
      }
    } else if (mode === "admin") {
      const admin = await Admin.findById(id);

      if (admin) {
        response.success = true;
        response.admin = admin;
        return res.json(response);
      }
    } else if (mode === "super_admin") {
      const superAdmin = await SuperAdmin.findById(id);

      if (superAdmin) {
        response.success = true;
        response.superAdmin = superAdmin;
        return res.json(response);
      }
    }
    response.success = false;
    return res.json(response);
  }
}

export default UserController;
