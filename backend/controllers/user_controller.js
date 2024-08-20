import Admin from "../models/admin.js";
import SuperAdmin from "../models/super_admin.js";
import SubTeam from "../models/subteam.js";
import Team from "../models/team.js";

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
        console.log("Subteam Found ", subteam);
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

  static async retryFetchRequest(requestFn, retries, backoff) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await requestFn();
        return response;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed: ${error.message}`);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, backoff));
        } else {
          throw error;
        }
      }
    }
  }

  static async sendBatchPushNotifications(
    tokensArray,
    titlesArray,
    messagesArray
  ) {
    if (
      !Array.isArray(tokensArray) ||
      !Array.isArray(messagesArray) ||
      !Array.isArray(titlesArray)
    ) {
      console.error(
        "Invalid input: tokensArray, messagesArray, and titlesArray must all be arrays."
      );
      return;
    }

    if (
      tokensArray.length !== messagesArray.length ||
      tokensArray.length !== titlesArray.length
    ) {
      console.error(
        "Mismatch: The number of token arrays must match the number of messages and titles."
      );
      return;
    }

    // Prepare a single array of messages to be sent in one request
    const notifications = tokensArray.flatMap((tokens, index) => {
      const messageBody = messagesArray[index];
      const notificationTitle = titlesArray[index];

      return tokens.map((token) => ({
        to: token,
        sound: "default",
        title: notificationTitle, // Customized title for each notification
        body: messageBody,
        // data: { someData: "goes here" }, // You can customize this
      }));
    });

    // Send all notifications in a single request
    try {
      const response = await this.retryFetchRequest(
        () =>
          fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-Encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(notifications),
          }),
        3, // Number of retries
        2000 // Backoff time in milliseconds
      );

      console.log(
        "Push notifications sent successfully:",
        await response.json()
      );
    } catch (error) {
      console.error("Error sending push notifications:", error.message);
    }
  }
}

export default UserController;
