import Attack from "../models/attack.js";
import Country from "../models/country.js";
import Warzone from "../models/warzone.js";
import Settings from "../models/setting.js";
import SubTeam from "../models/subteam.js";
import Team from "../models/team.js";

import UserController from "./user_controller.js";
import { io } from "../app.js";
import mongoose from "mongoose";

class AttackController {
  static async get_attacks(req, res) {
    const attacks = await Attack.find();
    return res.json(attacks);
  }

  static async attack_check_helper(req) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { zone_1, team_1, subteam_1, zone_2, team_2 } = req.body;

    const maxRetries = 3;
    const retryDelay = 1000;
    let lockAcquired = false;

    try {
      const attacking_country = await Country.findOne({ name: zone_1 });
      const defending_country = await Country.findOne({ name: zone_2 });

      let real_team_1;
      try {
        real_team_1 = attacking_country.teamNo;
      } catch (error) {
        real_team_1 = team_1;
      }
      const real_team_2 = defending_country.teamNo;

      if (team_1.toString() !== real_team_1.toString()) {
        result.errorMsg = `Your team does not own ${zone_1}`;
        return result;
      }

      if (team_2.toString() !== real_team_2.toString()) {
        result.errorMsg = `Defending team changed from ${team_2} to ${real_team_2}. Please recheck if you want to proceed`;
        return result;
      }

      if (team_1.toString() === real_team_2.toString()) {
        result.errorMsg = "You cannot attack your own zone";
        return result;
      }

      const duplicate_attack = await AttackController.check_duplicate_attack(
        zone_1,
        team_1,
        zone_2,
        team_2
      );

      if (!duplicate_attack.success) {
        result.errorMsg = duplicate_attack.errorMsg;
        return result;
      }

      if (duplicate_attack.duplicate) {
        result.errorMsg = duplicate_attack.errorMsg;
        return result;
      }

      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          attempt++;

          // Attempt to acquire a lock on the attacking team
          const attacking_team = await Team.findOneAndUpdate(
            { number: team_1, locked: false },
            { $set: { locked: true } },
            { new: true }
          );

          if (!attacking_team) {
            if (attempt >= maxRetries) {
              result.errorMsg = `Could not acquire lock on the attacking team`;
              return result; // 409 Conflict
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          }

          lockAcquired = true;

          const cooldown = await Settings.findOne({ name: "Attack Cooldown" });
          if (!cooldown) {
            result.errorMsg = "Attack cooldown setting not found";
            return result;
          }

          const username = team_1.toString() + subteam_1.toString();
          const subteam = await SubTeam.findOne({ username: username });

          if (!subteam) {
            result.errorMsg = "Subteam not found";
            return result;
          }

          const cooldown_start_time = subteam.cooldown_start_time;
          const currentTime = new Date();
          const diffInMinutes = (currentTime - cooldown_start_time) / 60000;

          if (diffInMinutes < cooldown.value) {
            const remainingTime = cooldown.value - diffInMinutes;
            const minutes = parseInt(remainingTime);
            const seconds = parseInt(Math.floor((remainingTime % 1) * 60));

            let timeMessage = "";
            if (minutes > 0) {
              timeMessage += `${minutes} minute${minutes !== 1 ? "s" : ""}`;
            }
            if (seconds > 0) {
              if (minutes > 0) {
                timeMessage += " and ";
              }
              timeMessage += `${seconds} second${seconds !== 1 ? "s" : ""}`;
            }

            result.errorMsg = `Attack cooldown not over yet\nRemaining: ${timeMessage}`;
            return result;
          }

          const canAttack = await AttackController.check_if_subteam_can_attack(
            subteam.number,
            subteam.letter,
            real_team_2
          );

          if (!canAttack.success) {
            result.errorMsg = canAttack.errorMsg;
            return result;
          }

          const canAttackCountry =
            await AttackController.check_country_if_involved_in_attack(zone_1);
          const canDefendCountry =
            await AttackController.check_country_if_involved_in_attack(zone_2);

          if (!canAttackCountry.success) {
            result.errorMsg = canAttackCountry.errorMsg;
            return result;
          }

          if (!canDefendCountry.success) {
            result.errorMsg = canDefendCountry.errorMsg;
            return result;
          }

          const attack_cost = await Settings.findOne({ name: "Attack Cost" });

          if (!attack_cost) {
            result.errorMsg = "Attack cost setting not found";
            return result;
          }

          if (attacking_team.balance < attack_cost.value) {
            result.errorMsg =
              "Insufficient balance\nYour team cannot afford the attack cost of " +
              attack_cost.value;
            return result;
          }

          result.success = true;
          return result;
        } catch (error) {
          console.error(
            `Error during attack check on attempt ${attempt}:`,
            error
          );

          if (attempt >= maxRetries) {
            result.errorMsg =
              "Error processing attack check after multiple attempts";
            return result;
          }

          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } finally {
          if (lockAcquired) {
            // Ensure the lock is released if it was acquired
            await Team.findOneAndUpdate(
              { number: team_1 },
              { $set: { locked: false } }
            );
            console.log(`Lock released for team ${team_1}`);
          }
        }
      }
    } catch (error) {
      console.error("Error handling attack check:", error);
      result.errorMsg = "Error handling attack check";
      return result;
    }
  }

  static async attack_check(req, res) {
    console.log("Attack check request received");

    const result = await AttackController.attack_check_helper(req);

    res.json(result);
  }

  static async attack(req, res) {
    console.log("Attack request received");

    const result = {
      success: false,
      errorMsg: "",
    };

    const { zone_1, team_1, subteam_1, zone_2, team_2, warzone_id, war } =
      req.body;

    let session;
    let lockAcquired = false;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const attackCheck = await AttackController.attack_check_helper(req);

      if (!attackCheck.success) {
        result.errorMsg = attackCheck.errorMsg;
        return res.json(result);
      }

      const warzone = await Warzone.findOneAndUpdate(
        { _id: warzone_id, "wars.name": war, "wars.available": true },
        { $set: { "wars.$.available": false } },
        { new: true, session }
      );

      if (!warzone) {
        result.errorMsg = `${war} is no longer available or warzone not found.\nPlease refresh.`;
        return res.json(result);
      }

      console.log(`Lock acquired for war ${war} in warzone ${warzone_id}`);
      lockAcquired = true;

      const attack_cost = await Settings.findOne({ name: "Attack Cost" });

      const attacking_country = await Country.findOneAndUpdate(
        { name: zone_1, locked: false },
        { $set: { locked: true } },
        { new: true, session }
      );

      const defending_country = await Country.findOneAndUpdate(
        { name: zone_2, locked: false },
        { $set: { locked: true } },
        { new: true, session }
      );

      if (!attacking_country || !defending_country) {
        result.errorMsg = `Could not acquire lock on countries for the attack`;
        return res.json(result);
      }

      const attack = new Attack({
        attacking_zone: zone_1,
        attacking_team: team_1,
        attacking_subteam: subteam_1,
        defending_zone: zone_2,
        defending_team: team_2,
        warzone_id: warzone_id,
        war: war,
        location: warzone.wars.find((w) => w.name === war).location || "",
      });

      await attack.save({ session });

      attacking_country.locked = false;
      defending_country.locked = false;
      await attacking_country.save({ session });
      await defending_country.save({ session });

      const attacking_team = await Team.findOneAndUpdate(
        { number: team_1 },
        {
          $inc: { balance: attack_cost.value * -1 },
          $set: { locked: false },
        },
        { new: true, session }
      );

      if (!attacking_team) {
        result.errorMsg = "Error updating attacking team balance.";
        return res.json(result);
      }

      console.log(`${war} is now marked as unavailable.`);

      await session.commitTransaction();


      io.emit("new_attack", attack);
      io.emit("update_country", attacking_country);
      io.emit("update_country", defending_country);
      io.emit("update_warzone", warzone);

      result.success = true;
      return res.json(result);

    } catch (error) {
      session.abortTransaction();
      if (result.errorMsg == "") {
        result.errorMsg = "Error processing attack";
      }
      return result;
    } finally {
      if (lockAcquired) {
        await Country.findOneAndUpdate(
          { name: zone_1 },
          { $set: { locked: false } },
        );
        await Country.findOneAndUpdate(
          { name: zone_2 },
          { $set: { locked: false } },
        );
        console.log(`Locks released for countries ${zone_1} and ${zone_2}`);
      }
    }
  }

  static async check_if_subteam_can_attack(team, subteam, otherTeam) {
    const result = {
      success: false,
      errorMsg: "",
    };

    try {
      // Fetch all attacks by the team
      const attacks = await Attack.find({ attacking_team: team });

      // Filter attacks by the specific subteam
      const subteam_attacks = attacks.filter(
        (attack) => attack.attacking_subteam === subteam
      );

      // If the subteam is already attacking, return an error
      if (subteam_attacks.length > 0) {
        result.errorMsg = `This subteam is already attacking ${subteam_attacks[0].defending_zone}`;
        return result;
      }

      // Fetch the attack limit setting
      const attack_limit_setting = await Settings.findOne({
        name: "Max concurrent attacks per team",
      });

      if (!attack_limit_setting) {
        result.errorMsg = "Attack limit setting not found";
        return result;
      }

      const attack_limit = parseInt(attack_limit_setting.value);

      // Check if the team has reached the maximum number of concurrent attacks
      if (attacks.length >= attack_limit) {
        result.errorMsg = `Your team has reached the maximum attack limit of ${attack_limit}`;
        return result;
      }

      // Fetch the defence limit setting
      const defence_limit_setting = await Settings.findOne({
        name: "Max concurrent defences per team",
      });

      if (!defence_limit_setting) {
        result.errorMsg = "Defence limit setting not found";
        return result;
      }

      const defence_limit = parseInt(defence_limit_setting.value);

      // Fetch all attacks against the other team (defending team)
      const defence_attacks = await Attack.find({
        defending_team: otherTeam,
      });

      if (defence_attacks.length >= defence_limit) {
        result.errorMsg = `Team ${otherTeam} has reached the maximum defence limit of ${defence_limit}`;
        return result;
      }

      // If all checks pass, the subteam can attack
      result.success = true;
      return result;
    } catch (error) {
      console.error("Error checking if subteam can attack:", error);
      result.errorMsg = "Error checking if subteam can attack";
      return result;
    }
  }

  static async check_country_if_involved_in_attack(zone) {
    const result = {
      success: false,
      errorMsg: "",
    };

    try {
      // Check if the zone is involved in any attack
      const isInvolvedInAttack = await Attack.exists({
        $or: [{ attacking_zone: zone }, { defending_zone: zone }],
      });

      if (isInvolvedInAttack) {
        result.errorMsg = `${zone} is already involved in an attack`;
      } else {
        result.success = true;
      }
      return result;
    } catch (error) {
      console.error("Error checking if country is involved in attack:", error);
      result.errorMsg = "Error checking if country is involved in attack";
      return result;
    }
  }

  static async check_duplicate_attack(zone_1, team_1, zone_2, team_2) {
    const result = {
      success: false,
      duplicate: false,
      errorMsg: "",
    };

    try {
      // Check if there's already an attack with the specified parameters
      const isDuplicate = await Attack.exists({
        attacking_zone: zone_1,
        attacking_team: team_1,
        defending_zone: zone_2,
        defending_team: team_2,
      });

      if (isDuplicate) {
        result.duplicate = true;
        result.errorMsg = `Your team is already attacking ${zone_2}`;
      } else {
        result.success = true;
      }

      return result;
    } catch (error) {
      console.error("Error checking duplicate attack:", error);
      result.errorMsg = "Error checking duplicate attack";
      return result;
    }
  }

  static async get_attacks_by_war(req, res) {
    const result = {
      success: false,
      attacks: "",
      errorMsg: "",
    };

    const { war } = req.params;

    try {
      const response = await Attack.find({
        war: war,
      });

      if (response) {
        result.attacks = response;
        result.success = true;
        return res.json(result);
      }

      result.errorMsg = "No attacks found";
      return res.json(result);
    } catch (error) {
      console.error("Error getting attacks by war:", error);
      result.success = false;
      result.errorMsg = "Error getting attacks by war";
      return res.json(result);
    }
  }

  static async set_attack_result(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { attack_id, winnerTeam } = req.body;

    try {
      const attack = await Attack.findById(attack_id);

      if (!attack) {
        result.errorMsg = "Attack not found";
        return res.json(result);
      }

      const winnerZone = attack.attacking_zone;
      const loserZone = attack.defending_zone;

      console.log("Winner Zone:", winnerZone);
      console.log("Loser Zone:", loserZone);

      // Update the team number for the winner and loser zones
      const updateZones = async () => {
        try {
          const country1 = await Country.findOneAndUpdate(
            { name: winnerZone },
            { $set: { teamNo: winnerTeam } },
            { new: true }
          );

          const country2 = await Country.findOneAndUpdate(
            { name: loserZone },
            { $set: { teamNo: winnerTeam } },
            { new: true }
          );

          return { country1, country2 };
        } catch (error) {
          console.error("Error updating zones:", error);
          throw new Error("Error updating zones");
        }
      };

      const { country1, country2 } = await updateZones();

      // Find and update the subteam cooldown time
      const subteam_username = `${attack.attacking_team}${attack.attacking_subteam}`;
      const subteam = await SubTeam.findOneAndUpdate(
        { username: subteam_username },
        { $set: { cooldown_start_time: new Date() } },
        { new: true }
      );

      if (!subteam) {
        result.errorMsg = "Subteam not found";
        return res.json(result);
      }

      // Delete the attack after processing
      try {
        await Attack.deleteOne({ _id: attack_id });
        console.log("Attack deleted successfully.");
      } catch (e) {
        console.error("Error deleting attack:", e);
        result.errorMsg = "Error deleting attack";
        return res.json(result);
      }

      // Update the warzone
      const warzone = await Warzone.findById(attack.warzone_id);
      if (!warzone) {
        result.errorMsg = "Warzone not found";
        return res.json(result);
      }

      const warIndex = warzone.wars.findIndex((war) => war.name === attack.war);
      if (warIndex !== -1) {
        warzone.wars[warIndex].available = true;

        try {
          await warzone.save();
          console.log(`${attack.war} is now marked as available.`);
        } catch (e) {
          console.error("Error saving warzone:", e);
          result.errorMsg = "Error saving warzone";
          return res.json(result);
        }

        // Emit updates to clients
        io.emit("update_country", country1);
        io.emit("update_country", country2);
        io.emit("remove_attack", attack_id);
        io.emit("update_warzone", warzone);

        result.success = true;
        return res.json(result);
      } else {
        console.error("War not found in the warzone.");
        result.errorMsg = "War not found in the warzone.";
        return res.json(result);
      }
    } catch (error) {
      console.error("Error setting attack result:", error);
      result.errorMsg = "Error setting attack result";
      return res.json(result);
    }
  }

  static async delete_attack(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { attack_id } = req.body;

    try {
      // Find the attack by ID
      const attack = await Attack.findById(attack_id);

      if (!attack) {
        result.errorMsg = "Attack not found";
        return res.json(result);
      }

      // Find the associated warzone
      const warzone = await Warzone.findById(attack.warzone_id);
      if (!warzone) {
        result.errorMsg = "Warzone not found";
        return res.json(result);
      }

      // Find the war in the warzone and mark it as available
      const warIndex = warzone.wars.findIndex((war) => war.name === attack.war);
      if (warIndex !== -1) {
        warzone.wars[warIndex].available = true;

        try {
          await warzone.save();
          console.log(`${attack.war} is now marked as available.`);
        } catch (e) {
          console.error("Error saving warzone:", e);
          result.errorMsg = "Error saving warzone";
          return res.json(result);
        }
      } else {
        console.error("War not found in the warzone.");
        result.errorMsg = "War not found in the warzone.";
        return res.json(result);
      }

      // Delete the attack
      try {
        await Attack.deleteOne({ _id: attack_id });
        console.log("Attack deleted successfully.");
      } catch (e) {
        console.error("Error deleting attack:", e);
        result.errorMsg = "Error deleting attack";
        return res.json(result);
      }

      // Emit updates to the clients
      io.emit("remove_attack", attack_id);
      io.emit("update_warzone", warzone);

      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Error deleting attack:", error);
      result.errorMsg = "Error deleting attack";
      return res.json(result);
    }
  }

  static async get_attack_expiry_time(req, res) {
    const result = {
      success: false,
      createdAt: "",
      expiryTime: "",
      currentTime: "",
      timerExpired: "",
      errorMsg: "",
    };

    const { attack_id } = req.params;

    if (!attack_id) {
      result.errorMsg = "No attack ID provided";
      return res.json(result);
    }

    try {
      const attack = await Attack.findById(attack_id);

      const arr = {
        timerDuration: 5,
      };

      try {
        arr.timerDuration = await Settings.findOne({
          name: "Disqualify Timer",
        });
      } catch (error) {
        console.error("Error getting timer duration:", error);
      }

      if (!attack) {
        result.errorMsg = "Attack not found";
        return res.json(result);
      }

      const attackTime = new Date(attack.createdAt);
      const currentTime = new Date(); // Get the current server time

      // to number

      const minutes = parseInt(arr.timerDuration.value, 10) * 60000;

      const attackExpiryTime = new Date(attackTime.getTime() + minutes); // Add 5 minutes to attack time

      result.success = true;
      result.createdAt = attackTime.toISOString();
      result.expiryTime = attackExpiryTime.toISOString();
      result.currentTime = currentTime.toISOString(); // Include current server time in the response

      return res.json(result);
    } catch (error) {
      console.error("Error getting attack expiry time:", error);
      result.errorMsg = "Error getting attack expiry time";
      return res.json(result);
    }
  }
}

export default AttackController;
