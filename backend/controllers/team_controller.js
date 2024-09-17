import Team from "../models/team.js";
import Settings from "../models/setting.js";
import SubTeam from "../models/subteam.js";
import Attack from "../models/attack.js";
import Warzone from "../models/warzone.js";
import Country from "../models/country.js";

import mongoose from "mongoose";

import { io } from "../app.js"; // Adjust the path based on your file structure

const getTeamColor = (teamNo) => {
  if (teamNo === "1") {
    return "#0000FF"; // Blue
  } else if (teamNo === "2") {
    return "#FF0000"; // Red
  } else if (teamNo === "3") {
    return "#00FF00"; // Green
  } else if (teamNo === "4") {
    return "#FFFF00"; // Yellow
  } else if (teamNo === "5") {
    return "#800080"; // Purple
  } else if (teamNo === "6") {
    return "#8B4513"; // Brown
  } else if (teamNo === "7") {
    return "#00FFFF"; // Cyan
  } else if (teamNo === "8") {
    return "#FFC0CB"; // Pink
  } else if (teamNo === "9") {
    return "#808080"; // Gray
  } else if (teamNo === "10") {
    return "#FFA500"; // Orange
  } else {
    return "#FFFFFF"; // White (default)
  }
};

const getTeamName = (teamNo) => {
  if (teamNo === "1") {
    return "Zeus";
  } else if (teamNo === "2") {
    return "Poseidon";
  } else if (teamNo === "3") {
    return "Athena";
  } else if (teamNo === "4") {
    return "Apollo";
  } else if (teamNo === "5") {
    return "Artemis";
  } else if (teamNo === "6") {
    return "Hermes";
  } else if (teamNo === "7") {
    return "Demeter";
  } else if (teamNo === "8") {
    return "Ares";
  } else if (teamNo === "9") {
    return "Hephaestus";
  } else if (teamNo === "10") {
    return "Hera";
  } else {
    return "Unknown";
  }
};

const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

const distributeCountries = async (numberOfTeams) => {
  try {
    const countries = await Country.find();

    if (countries.length === 0) {
      console.log("No countries found to distribute.");
      return;
    }

    // Create bulk operations
    const bulkOps = countries.map((country, index) => ({
      updateOne: {
        filter: { _id: country._id },
        update: { teamNo: (index % numberOfTeams) + 1 },
      },
    }));

    // Perform bulk update
    const result = await Country.bulkWrite(bulkOps);

    console.log(
      `Distributed ${countries.length} countries across ${numberOfTeams} teams.`
    );
  } catch (error) {
    console.error("Error distributing countries:", error);
  }
};

class TeamController {
  static async create_teams(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { numTeams, numSubTeams } = req.body;

    if (numTeams < 2 || numTeams > 10 || numSubTeams < 1 || numSubTeams > 10) {
      result.errorMsg = "Invalid number of teams";
      return res.json(result);
    }

    let teams = [];
    let subTeams = [];

    try {
      const gameStatus = await Settings.findOne({ name: "Game Status" });

      if (gameStatus && gameStatus.value === "Active") {
        result.errorMsg =
          "Game is already active.\nPlease pause or end the game first.";
        return res.json(result);
      }

      await Team.deleteMany({});
      await SubTeam.deleteMany({});
      await mongoose.connection.db.collection("sessions").deleteMany({});

      for (let i = 1; i <= numTeams; i++) {
        const teamNo = i.toString();
        const teamName = getTeamName(teamNo);
        const color = getTeamColor(teamNo);

        const initialMoney = await Settings.findOne({ name: "Initial Money" });

        const team = new Team({
          number: teamNo,
          name: teamName,
          color: color,
          balance: initialMoney.value,
        });

        teams.push(team);

        for (let j = 0; j < numSubTeams; j++) {
          const subTeam = new SubTeam({
            number: i.toString(),
            name: teamName,
            letter: String.fromCharCode(65 + j),
            username: i.toString() + String.fromCharCode(65 + j),
            password: generatePassword(),
          });

          subTeams.push(subTeam);
        }
      }

      try {
        const gameStatus = await Settings.findOne({ name: "Game Status" });
        gameStatus.value = "Paused";

        await gameStatus.save();

        await Team.insertMany(teams);

        await SubTeam.insertMany(subTeams);

        // delete all attacks

        await Attack.deleteMany({});
        // make all warzones unoccupied

        await Warzone.updateMany(
          {}, // Empty filter to match all documents
          { $set: { "wars.$[].available": true } }
        );

        await distributeCountries(numTeams);
      } catch (error) {
        console.error("Error creating teams:", error);
        result.errorMsg = "Error creating teams";
        return res.json(result);
      }

      result.success = true;

      io.emit("new_game", { teams, subTeams });

      return res.json(result);
    } catch (error) {
      console.error("Error creating teams:", error);
      result.errorMsg = "Error creating teams";
      return res.json(result);
    }
  }

  static async add_team(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { teamNo, teamName, password } = req.body;

    try {
      // Check if the team already exists
      const teamExists = await Team.exists({ number: teamNo });

      if (teamExists) {
        result.errorMsg = `Team ${teamNo} already exists`;
        return res.json(result);
      }

      // Generate team color
      const color = getTeamColor(teamNo);

      // Create a new team document
      const newTeam = new Team({
        number: teamNo,
        name: teamName,
        color,
        password,
      });

      // Save the new team to the database
      await newTeam.save();

      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Error adding team:", error);
      result.errorMsg = "Error adding team";
      return res.json(result);
    }
  }

  static async update_team(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { number } = req.params;
    const { teamName } = req.body;
    const maxRetries = 3; // Maximum number of retry attempts
    const retryDelay = 1000; // Delay between retries in milliseconds

    if (!teamName || typeof teamName !== "string") {
      result.errorMsg = "Invalid input data";
      return res.json(result);
    }

    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        attempt++;

        // Attempt to acquire the lock by finding an unlocked team and locking it
        const team = await Team.findOneAndUpdate(
          { number, locked: false },
          { $set: { locked: true } },
          { new: true }
        );

        if (!team) {
          if (attempt >= maxRetries) {
            result.errorMsg = `Team ${number} is currently being updated. Please try again later.`;
            return res.json(result); // Returning JSON without a status code as requested
          } else {
            await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
            continue;
          }
        }

        // Update the team and release the lock
        const updatedTeam = await Team.findOneAndUpdate(
          { number: team.number },
          { $set: { name: teamName, locked: false } }, // Release lock after updating
          { new: true }
        );

        // Update all subteams
        const subteams = await SubTeam.updateMany(
          { number },
          { $set: { name: teamName } }
        );

        io.emit("update_team", updatedTeam);

        result.success = true;
        return res.json(result);
      } catch (error) {
        console.error(
          `Error updating team ${number} on attempt ${attempt}:`,
          error
        );

        if (attempt >= maxRetries) {
          result.errorMsg = "Error updating team after multiple attempts";
          return res.json(result);
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
      }
    }
  }

  static async get_all_teams(req, res) {
    try {
      const teams = await Team.find();
      return res.json(teams);
    } catch (error) {
      return res.json({});
    }
  }

  static async get_all_subteams(req, res) {
    try {
      const subteams = await SubTeam.find();
      return res.json(subteams);
    } catch (error) {
      return res.json({});
    }
  }

  static async update_subteam(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { username, password } = req.body;

    try {
      // Attempt to find the subteam and update the password
      const subteam = await SubTeam.findOneAndUpdate(
        { username },
        { $set: { password } },
        { new: true }
      );

      if (!subteam) {
        result.errorMsg = `Subteam ${username} not found`;
        return res.json(result);
      }

      // Emit the updated subteam data
      io.emit("update_subteam", subteam);

      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Error updating subteam:", error);
      result.errorMsg = "Error updating subteam";
      return res.json(result);
    }
  }

  static async get_team(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { number } = req.params;

    try {
      const team = await Team.findOne({ number });

      if (!team) {
        result.errorMsg = `Team ${number} not found`;
        return res.json(result);
      }

      result.success = true;
      result.team = team;
      return res.json(result);
    } catch (error) {
      console.error("Error fetching team:", error);
      result.errorMsg = "Error fetching team";
      return res.json(result);
    }
  }

  static async updateTeamBalances() {
    console.log("Updating team balances");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const settings = await Settings.find().session(session);

      if (!settings) {
        console.error("Error fetching settings");
        throw new Error("Settings not found");
      }

      const gameStatus = settings.find(
        (setting) => setting.name === "Game Status"
      );

      if (gameStatus && gameStatus.value !== "Active") {
        console.log("Game is not active. Balances will not be updated.");
        throw new Error("Game is not active");
      }

      const rate = settings.find(
        (setting) => setting.name === "Rate ($/min) per country"
      );

      if (!rate) {
        console.error("Error fetching settings");
        throw new Error("Rate setting not found");
      }

      const rateValue = rate.value;
      const countries = await Country.find().session(session);

      const teamCounts = countries.reduce((acc, country) => {
        acc[country.teamNo] = (acc[country.teamNo] || 0) + 1;
        return acc;
      }, {});

      const teamsToUpdate = await Team.find({
        number: { $in: Object.keys(teamCounts) },
      }).session(session);

      const maxRetries = 10;
      const retryDelay = 1000;

      for (const team of teamsToUpdate) {
        let attempt = 0;
        let success = false;

        while (attempt < maxRetries && !success) {
          try {
            attempt++;

            // Attempt to acquire the lock
            const lockedTeam = await Team.findOneAndUpdate(
              { number: team.number, locked: false },
              { $set: { locked: true } },
              { new: true, session }
            );

            if (!lockedTeam) {
              console.error(
                `Could not acquire lock for team ${team.number}. Aborting...`
              );
              throw new Error(`Failed to acquire lock for team ${team.number}`);
            }

            console.log(
              `Lock acquired for team ${team.number}, updating balance...`
            );

            // Update balance and release lock
            const updatedTeam = await Team.findOneAndUpdate(
              { number: team.number, locked: true },
              {
                $inc: { balance: teamCounts[team.number] * rateValue },
                $set: { locked: false }, // Release lock after updating
              },
              { new: true, session }
            );

            // Emit the updated team data to all connected clients
            io.emit("update_team", updatedTeam);

            console.log(
              `Balance updated and lock released for team ${team.number}`
            );
            success = true; // Break the retry loop
          } catch (error) {
            console.error(
              `Error updating balance for team ${team.number} on attempt ${attempt}:`,
              error
            );

            if (
              attempt >= maxRetries ||
              !error.message.includes("Write conflict")
            ) {
              console.error(
                `Failed to update balance for team ${team.number} after ${maxRetries} attempts`
              );
              throw error;
            }

            // If a write conflict occurs, wait and retry
            console.log(
              `Write conflict detected for team ${team.number}. Retrying in ${retryDelay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }

        if (!success) {
          throw new Error(
            `Unable to update team ${team.number} after ${maxRetries} attempts`
          );
        }
      }

      await session.commitTransaction();
      console.log("Team balances updated successfully.");
    } catch (error) {
      console.error("An error occurred while updating team balances:", error);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  static async update_team_balance(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { teamNo, amount, type } = req.body;
    const maxRetries = 3;
    const retryDelay = 1000;

    if (!teamNo || !amount || !type) {
      result.errorMsg = "Invalid input data";
      return res.json(result);
    }

    const amountToChange = parseInt(amount);

    if (isNaN(amountToChange) || amountToChange <= 0) {
      result.errorMsg = "Please enter a valid positive number";
      return res.json(result);
    }

    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        attempt++;

        // Attempt to acquire the lock
        const team = await Team.findOneAndUpdate(
          { number: teamNo, locked: false },
          { $set: { locked: true } },
          { new: true } // Return the updated document
        );

        if (!team) {
          if (attempt >= maxRetries) {
            result.errorMsg = `Team ${teamNo} not found or is currently being updated`;
            return res.json(result);
          }
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }

        console.log(`Updating balance for team ${teamNo} by ${amountToChange}`);

        if (type === "remove" && amountToChange > team.balance) {
          result.errorMsg = "Insufficient balance";
          // Release the lock immediately
          await Team.findOneAndUpdate(
            { number: teamNo, locked: true },
            { $set: { locked: false } }
          );
          return res.json(result);
        }

        const updatedBalance =
          type === "add"
            ? team.balance + amountToChange
            : team.balance - amountToChange;

        // Save the updated balance and release the lock
        const updatedTeam = await Team.findOneAndUpdate(
          { number: teamNo, locked: true },
          {
            $set: {
              balance: updatedBalance,
              locked: false,
            },
          },
          { new: true }
        );

        // Emit the updated team data to all connected clients
        io.emit("update_team", updatedTeam);

        result.success = true;
        return res.json(result);
      } catch (error) {
        console.error(
          `Error updating balance for team ${teamNo} on attempt ${attempt}:`,
          error
        );

        if (attempt >= maxRetries) {
          result.errorMsg =
            "Error updating team balance after multiple attempts";
          return res.json(result);
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  static async get_subteam_letters(req, res) {
    // Get the number of subteams for each team
    const subteamCounts = await SubTeam.aggregate([
      {
        $group: {
          _id: "$team", // Group by team
          count: { $sum: 1 }, // Count subteams for each team
        },
      },
    ]);

    // Determine the maximum number of subteams for any single team
    const maxSubteamsPerTeam = Math.max(
      ...subteamCounts.map((subteam) => subteam.count)
    );

    // Generate the letters (A, B, C, ...) based on the max number of subteams per team
    const subteamLetters = Array.from(
      { length: maxSubteamsPerTeam },
      (_, i) => String.fromCharCode(65 + i) // Generate letters from A based on maxSubteamsPerTeam
    );

    return res.json(subteamLetters);
  }
}

export default TeamController;
