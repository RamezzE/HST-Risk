import Admin from "../models/admin.js";
import SuperAdmin from "../models/super_admin.js";
import SubTeam from "../models/subteam.js";
import Team from "../models/team.js";

import fetch from "node-fetch";

function isNumberString(value) {
  return /^\d+$/.test(value);
}

class UserController {
  static async login(req, res) {
    const response = {
      success: false,
      subteam: "",
      admin: "",
      superAdmin: "",
      errorMsg: "",
    };

    const { username, password } = req.body;

    try {
      const subteam = await SubTeam.findOne({ username: username });

      if (subteam != null) {
        if (subteam.password !== password) {
          response.errorMsg = "Invalid Credentials";
          return res.json(response);
        }
        console.log("Subteam Found");
        console.log(subteam._id);
        req.session.user = { id: subteam._id, mode: "subteam" };
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
          } else {
            console.log("Session saved successfully");
          }
        });
        console.log("Session Created");
        console.log(req.session);
        response.success = true;
        response.subteam = subteam;
        return res.json(response);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const admin = await Admin.findOne({ name: username, password });

      if (admin != null) {
        if (admin.password !== password) {
          response.errorMsg = "Invalid Credentials";
          return res.json(response);
        }
        req.session.user = { id: admin._id, mode: "admin" };
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
          } else {
            console.log("Session saved successfully");
          }
        });
        console.log("Session Created");
        console.log(req.session.user);
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
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
          } else {
            console.log("Session saved successfully");
          }
        });
        console.log(req.session.user);
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
    try {
      if (!req.session.user) {
        console.log("Session Does Not Exist");
        console.log(req.session);
        return res.json({ success: false, errorMsg: "No session to destroy" });
      }
      console.log("Session Exists");
      console.log(req.session);

      req.session.destroy((err) => {});

      return res.json({ success: true });
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        errorMsg: "Failed to destroy session",
      });
    }
  }

  static async is_logged_in(req, res) {
    const response = {
      success: false,
      subteam: "",
      admin: "",
      superAdmin: "",
      errorMsg: "",
    };

    if (!req.session.user) {
      console.log("Session Does Not Exist");
      console.log(req.session);
      response.success = false;
      return res.json(response);
    }

    console.log("Session Exists");
    console.log(req.session);
    const { id, mode } = req.session.user;

    if (mode == "subteam") {
      const subteam = await SubTeam.findById(id);

      if (subteam) {
        response.success = true;
        response.subteam = subteam;
        return res.json(response);
      }
    } else if (mode == "admin") {
      const admin = await Admin.findById(id);

      if (admin) {
        response.success = true;
        response.admin = admin;
        return res.json(response);
      }
    } else if (mode == "super_admin") {
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

  static async addPushToken(req, res) {
    try {
      const response = {
        success: false,
        errorMsg: "",
      };

      const { token, teamNo } = req.body;

      console.log("Token backend: ", token);
      // check if token is a number
      if (token.length == 0) {
        response.errorMsg = "Invalid token";
        return res.json(response);
      }

      const teams = await Team.find({});

      // check expoPushTokens array in all teams if token already exists

      for (const team of teams) {
        if (team.expoPushTokens.includes(token)) {
          if (team.number == teamNo) return res.json({ success: true });

          if (team.number != teamNo) {
            // remove token
            const index = team.expoPushTokens.indexOf(token);
            team.expoPushTokens.splice(index, 1);
            await team.save();
            break;
          }
        }
      }

      // add token to team
      // filter from teams
      const team = teams.filter((team) => team.number == teamNo)[0];
      team.expoPushTokens.push(token);
      await team.save();

      response.success = true;
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, errorMsg: "Failed to input token" });
    }
  }

  static async deletePushToken(req, res) {
    try {
      const response = {
        success: false,
        errorMsg: "",
      };

      const { token, teamNo } = req.body;

      console.log("Token backend: ", token);
      // check if token is a number
      if (token.length == 0) {
        response.errorMsg = "Invalid token";
        return res.json(response);
      }

      const teams = await Team.find({});

      // check expoPushTokens array in all teams if token already exists

      for (const team of teams) {
        if (team.expoPushTokens.includes(token)) {
          if (team.number == teamNo) {
            // remove token
            const index = team.expoPushTokens.indexOf(token);
            team.expoPushTokens.splice(index, 1);
            await team.save();
            return;
          }
        }
      }

      response.success = true;
      return res.json(response);
    } catch (error) {
      console.log(error);
      return res.json({ success: false, errorMsg: "Failed to delete token" });
    }
  }

  static async sendBatchPushNotifications(tokensArray, messagesArray) {
    if (!Array.isArray(tokensArray) || !Array.isArray(messagesArray)) {
      console.log(
        "Invalid input: Both tokensArray and messagesArray must be arrays."
      );
      return;
    }

    if (tokensArray.length !== messagesArray.length) {
      console.log(
        "Mismatch: The number of token arrays must match the number of messages."
      );
      return;
    }

    const requests = tokensArray.map((tokens, index) => {
      const messageBody = messagesArray[index];

      // Constructing the messages array for this batch
      const messages = tokens.map((token) => ({
        to: token,
        sound: "default", // Optional: Adjust sound as needed
        body: messageBody,
        badge: 1, // Optional: Set badge number, adjust or remove as needed
      }));

      // Sending the request for this batch
      return fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        body: JSON.stringify(messages),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(
            `Push notification response for message ${index + 1}:`,
            data
          );
        })
        .catch((error) => {
          console.error(
            `Error sending push notifications for message ${index + 1}:`,
            error
          );
        });
    });

    // Wait for all requests to finish
    await Promise.all(requests);
  }
}

export default UserController;
