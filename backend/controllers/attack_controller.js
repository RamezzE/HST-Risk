import { MongoClient } from "mongodb";

import Attack from "../models/attack.js";
import Country from "../models/country.js";
import Warzone from "../models/warzone.js";
import Settings from "../models/setting.js";
import SubTeam from "../models/subteam.js";
import Team from "../models/team.js";

import UserController from './user_controller.js';

const client = new MongoClient(process.env.MONGO_URI, {});

class AttackController {
  static async get_attacks(req, res) {
    const attacks = await Attack.find();
    return res.json(attacks);
  }

  static async attack_check(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { zone_1, team_1, subteam_1, zone_2, team_2 } = req.body;

    const attacking_country = await Country.findOne({ name: zone_1 });
    const defending_country = await Country.findOne({ name: zone_2 });

    const real_team_1 = attacking_country.teamNo;
    const real_team_2 = defending_country.teamNo;

    if (team_1 !== real_team_1) {
      result.errorMsg = `You do not own ${zone_1}`;
      return res.json(result);
    }

    if (team_2 !== real_team_2) {
      result.errorMsg = `Defending team changed from ${team_2} to ${real_team_2}. Please recheck if you want to proceed`;
      return res.json(result);
    }

    if (team_1 === real_team_2) {
      result.errorMsg = "You cannot attack your own zone";
      return res.json(result);
    }

    const duplicate_attack = await AttackController.check_duplicate_attack(
      zone_1,
      team_1,
      zone_2,
      team_2
    );

    if (!duplicate_attack.success) {
      result.errorMsg = duplicate_attack.errorMsg;
      return res.json(result);
    }

    if (duplicate_attack.duplicate) {
      console.log("Duplicate Attack detected");
      result.errorMsg = duplicate_attack.errorMsg;
      return res.json(result);
    }

    try {
      const cooldown = await Settings.findOne({ name: "Attack Cooldown" });
      if (!cooldown) {
        result.errorMsg = "Attack cooldown setting not found";
        return res.json(result);
      }

      const username = team_1.toString() + subteam_1.toString();
      const subteam = await SubTeam.findOne({ username: username });

      if (!subteam) {
        result.errorMsg = "Subteam not found";
        return res.json(result);
      }

      const cooldown_start_time = subteam.cooldown_start_time;

      // Get the current server time
      const currentTime = new Date();

      // Calculate the difference between the current time and the cooldown start time
      const diff = currentTime - cooldown_start_time;
      const diffInMinutes = diff / 60000;

      if (diffInMinutes < cooldown.value) {
        console.log(diffInMinutes);
        const remainingTime = cooldown.value - diffInMinutes;
        const minutes = parseInt(remainingTime);
        const seconds = parseInt(Math.floor((remainingTime % 1) * 60));

        console.log("Minutes:", minutes);
        console.log("Seconds:", seconds);

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

        console.log("Time message:", timeMessage);

        result.errorMsg = `Attack cooldown not over yet\nRemaining: ${timeMessage}`;
        return res.json(result);
      }

      const canAttack = await AttackController.check_if_subteam_can_attack(
        subteam.number,
        subteam.letter,
        real_team_2
      );

      if (!canAttack.success) {
        result.errorMsg = canAttack.errorMsg;
        return res.json(result);
      }

      const canAttackCountry =
        await AttackController.check_country_if_involved_in_attack(zone_1);
      const canDefendCountry =
        await AttackController.check_country_if_involved_in_attack(zone_2);

      if (!canAttackCountry.success) {
        result.errorMsg = canAttackCountry.errorMsg;
        return res.json(result);
      }

      if (!canDefendCountry.success) {
        result.errorMsg = canDefendCountry.errorMsg;
        return res.json(result);
      }

      const attack_cost = await Settings.findOne({ name: "Attack Cost" });

      if (!attack_cost) {
        result.errorMsg = "Attack cost setting not found";
        return res.json(result);
      }

      const attacking_team = await Team.findOne({ number: team_1 });

      if (!attacking_team) {
        result.errorMsg = "Attacking team not found";
        return res.json(result);
      }

      if (attacking_team.balance < attack_cost.value) {
        result.errorMsg =
          "Insufficient balance\nYou cannot afford the attack cost of " +
          attack_cost.value;
        return res.json(result);
      }
    } catch (error) {
      console.error("Error checking attack cooldown:", error);
      result.errorMsg = "Error checking attack cooldown";
      return res.json(result);
    }

    result.success = true;
    return res.json(result);
  }

  static async attack(req, res) {
    console.log("Attack request received");

    const result = {
      success: false,
      errorMsg: "",
    };

    const attack_cost = await Settings.findOne({ name: "Attack Cost" });

    const { zone_1, team_1, subteam_1, zone_2, team_2, warzone_id, war } =
      req.body;

    const attacking_country = await Country.findOne({ name: zone_1 });
    const defending_country = await Country.findOne({ name: zone_2 });

    const real_team_1 = attacking_country.teamNo;
    const real_team_2 = defending_country.teamNo;

    if (team_1.toString() !== real_team_1.toString()) {
      result.errorMsg = `You do not own ${zone_1}`;
      return res.json(result);
    }

    if (team_1.toString() === real_team_2.toString()) {
      result.errorMsg = "You cannot attack your own zone";
      return res.json(result);
    }

    if (team_2.toString() !== real_team_2.toString()) {
      result.errorMsg = `Defending team changed from ${team_2} to ${real_team_2}. Please recheck if you want to proceed`;
      return res.json(result);
    }

    const duplicate_attack = await AttackController.check_duplicate_attack(
      zone_1,
      team_1,
      zone_2,
      team_2
    );

    if (!duplicate_attack.success) {
      result.errorMsg = duplicate_attack.errorMsg;
      return res.json(result);
    }

    if (duplicate_attack.duplicate) {
      console.log("You are already attacking this country");
      result.errorMsg = duplicate_attack.errorMsg;
      return res.json(result);
    }

    try {
      const cooldown = await Settings.findOne({ name: "Attack Cooldown" });
      if (!cooldown) {
        result.errorMsg = "Attack cooldown setting not found";
        return res.json(result);
      }

      const username = team_1.toString() + subteam_1.toString();
      const subteam = await SubTeam.findOne({ username: username });

      if (!subteam) {
        result.errorMsg = "Subteam not found";
        return res.json(result);
      }

      const cooldown_start_time = subteam.cooldown_start_time;

      // Get the current server time
      const currentTime = new Date();

      // Calculate the difference between the current time and the cooldown start time
      const diff = currentTime - cooldown_start_time;
      const diffInMinutes = diff / 60000;

      if (diffInMinutes < cooldown.value) {
        console.log(diffInMinutes);
        const remainingTime = cooldown.value - diffInMinutes;
        const minutes = parseInt(remainingTime);
        const seconds = parseInt(Math.floor((remainingTime % 1) * 60));

        console.log("Minutes:", minutes);
        console.log("Seconds:", seconds);

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

        console.log("Time message:", timeMessage);

        result.errorMsg = `Attack cooldown not over yet\nRemaining: ${timeMessage}`;
        return res.json(result);
      }
    } catch (error) {
      console.error("Error checking attack cooldown:", error);
      result.errorMsg = "Error checking attack cooldown";
      return res.json(result);
    }

    try {
      const username = team_1.toString() + subteam_1.toString();
      const subteam = await SubTeam.findOne({ username: username });

      const canAttack = await AttackController.check_if_subteam_can_attack(
        subteam.number,
        subteam.letter,
        real_team_2
      );

      if (!canAttack.success) {
        result.errorMsg = canAttack.errorMsg;
        return res.json(result);
      }

      const canAttackCountry =
        await AttackController.check_country_if_involved_in_attack(zone_1);
      const canDefendCountry =
        await AttackController.check_country_if_involved_in_attack(zone_2);

      if (!canAttackCountry.success) {
        result.errorMsg = canAttackCountry.errorMsg;
        return res.json(result);
      }

      if (!canDefendCountry.success) {
        result.errorMsg = canDefendCountry.errorMsg;
        return res.json(result);
      }

      if (!attack_cost) {
        result.errorMsg = "Attack cost setting not found";
        return res.json(result);
      }

      const attacking_team = await Team.findOne({ number: team_1 });

      if (!attacking_team) {
        result.errorMsg = "Attacking team not found";
        return res.json(result);
      }

      if (attacking_team.balance < attack_cost.value) {
        result.errorMsg =
          "Insufficient balance\nYou cannot afford the attack cost of " +
          attack_cost.value;
        return res.json(result);
      }
    } catch (error) {
      console.error("Error checking attack cooldown:", error);
      result.errorMsg = "Error checking attack cooldown";
      return res.json(result);
    }

    try {
      const attack = new Attack({
        attacking_zone: zone_1,
        attacking_team: team_1,
        attacking_subteam: subteam_1,
        defending_zone: zone_2,
        defending_team: real_team_2,
        warzone_id: warzone_id,
        war: war,
      });

      const attacking_team = await Team.findOne({ number: team_1 });

      let chosenWar = war;

      attack
        .save()
        .then(async () => {
          try {
            const warzone = await Warzone.findById(warzone_id);

            if (warzone) {
              console.log(warzone);
              const warIndex = warzone.wars.findIndex(
                (war) => war.name === chosenWar
              );

              if (warIndex !== -1) {
                // Set the war's availability to false
                warzone.wars[warIndex].available = false;

                // Save the updated warzone
                await warzone.save();

                console.log(`${chosenWar.name} is now marked as unavailable.`);
              } else {
                console.log("War not found in the warzone.");
              }
            } else {
              console.log("Warzone not found.");
            }

            // Deduct the attack cost from the attacking team's balance
            attacking_team.balance -= attack_cost.value;
            await attacking_team.save();

            const defending_team = await Team.findOne({ number: real_team_2 });

            if (!defending_team) {
              result.errorMsg = "Defending team not found";
              return res.json(result);
            }

            await UserController.sendBatchPushNotifications(
              [attacking_team.expoPushTokens, defending_team.expoPushTokens],
              [
                `${team_1}${subteam_1} is attacking ${real_team_2}, ${zone_2} in ${war}`,
                `You are under attack!\n${zone_1} is under attack by ${team_1}${subteam_1} in ${war}`,
              ]
            );

          } catch (error) {
            console.error(
              "Error updating war availability or pushing tokens:",
              error
            );
          }
        })
        .catch((e) => {
          console.log("Error saving attack:", e);
        });

      result.success = true;
      return res.json(result);
    } catch (error) {
      console.error("Error making attack:", error);
      result.errorMsg = "Error making attack";
      return res.json(result);
    }
  }

  static async check_if_subteam_can_attack(team, subteam, otherTeam) {
    const result = {
      success: false,
      errorMsg: "",
    };

    try {
      const attacks = await Attack.find({
        attacking_team: team,
        // attacking_subteam: subteam,
      });

      const subteam_attacks = attacks.filter(
        (attack) => attack.attacking_subteam === subteam
      );

      if (subteam_attacks.length === 0) {
        const attack_limit = await Settings.findOne({
          name: "Max concurrent attacks per team",
        });

        if (!attack_limit) {
          result.errorMsg = "Attack limit setting not found";
          return result;
        }

        if (attacks.length >= parseInt(attack_limit.value)) {
          result.errorMsg = `Your team has reached the maximum attack limit of ${attack_limit.value}`;
          return result;
        }

        const defence_limit = await Settings.findOne({
          name: "Max concurrent defences per team",
        });

        if (!defence_limit) {
          result.errorMsg = "Defence limit setting not found";
          return result;
        }

        console.log(otherTeam);

        const defence_attacks = await Attack.find({
          defending_team: otherTeam,
          // defending_subteam: subteam,
        });

        if (!defence_attacks) {
          result.errorMsg = "Error getting defence attacks";
          return result;
        }

        console.log("Defence attacks:", defence_attacks.length);
        console.log(defence_limit.value);

        if (defence_attacks.length >= parseInt(defence_limit.value)) {
          result.errorMsg = `Team ${otherTeam} has reached the maximum defence limit of ${defence_limit.value}`;
          return result;
        }

        result.success = true;
        return result;
      }

      if (subteam_attacks.length > 0) {
        result.errorMsg = `You are already attacking ${attacks[0].defending_zone}`;
        return result;
      }
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
      const attacks = await Attack.find({
        $or: [{ attacking_zone: zone }, { defending_zone: zone }],
      });

      if (attacks.length === 0) {
        result.success = true;
        return result;
      }

      if (attacks.length > 0) {
        result.errorMsg = `${zone} is already involved in an attack`;
        return result;
      }
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
      const attack = await Attack.findOne({
        attacking_zone: zone_1,
        attacking_team: team_1,
        defending_zone: zone_2,
        defending_team: team_2,
      });

      if (attack) {
        result.duplicate = true;
        result.errorMsg = `Your team is already attacking ${zone_2}`;
        return result;
      }

      result.success = true;
      return result;
    } catch (error) {
      console.error("Error checking duplicate attack:", error);
      result.errorMsg = "Error checking duplicate attack";
      return result;
    } finally {
      await client.close();
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

      const country1 = await Country.findOne({ name: winnerZone });
      country1.teamNo = winnerTeam;
      await country1.save();

      const country2 = await Country.findOne({ name: loserZone });
      country2.teamNo = winnerTeam;
      await country2.save();

      const subteam_username =
        attack.attacking_team.toString() + attack.attacking_subteam.toString();

      const subteam = await SubTeam.findOne({ username: subteam_username });

      if (!subteam) {
        result.errorMsg = "Subteam not found";
        return res.json(result);
      }

      subteam.cooldown_start_time = new Date();
      await subteam.save();

      await Attack.deleteOne({ _id: attack_id })
        .then(() => {
          console.log("Attack deleted successfully.");
        })
        .catch((e) => {
          console.log("Error deleting attack:", e);
          result.errorMsg = "Error deleting attack";
          return res.json(result);
        });

      const warzone = await Warzone.findById(attack.warzone_id);

      const warIndex = warzone.wars.findIndex((war) => war.name === attack.war);

      Attack.deleteOne({ _id: attack_id })
        .then(() => {
          console.log("Attack deleted successfully.");
        })
        .catch((e) => {
          console.log("Error deleting attack:", e);
        });

      if (warIndex !== -1) {
        warzone.wars[warIndex].available = true;

        await warzone
          .save()
          .then(() => {
            console.log(`${attack.war.name} is now marked as available.`);
          })
          .catch((e) => {
            console.log("Error saving warzone:", e);
            result.errorMsg = "Error saving warzone";
            return res.json(result);
          });

        console.log(`${attack.war.name} is now marked as available.`);

        result.success = true;
        return res.json(result);
      } else {
        console.log("War not found in the warzone.");
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
      const attack = await Attack.findById(attack_id);

      if (!attack) {
        result.errorMsg = "Attack not found";
        return res.json(result);
      }

      const warzone = await Warzone.findById(attack.warzone_id);

      const warIndex = warzone.wars.findIndex((war) => war.name === attack.war);

      Attack.deleteOne({ _id: attack_id })
        .then(() => {
          console.log("Attack deleted successfully.");
        })
        .catch((e) => {
          console.log("Error deleting attack:", e);
          result.errorMsg = "Error deleting attack";
          return res.json(result);
        });

      if (warIndex !== -1) {
        warzone.wars[warIndex].available = true;

        await warzone
          .save()
          .then(() => {
            console.log(`${attack.war.name} is now marked as available.`);
          })
          .catch((e) => {
            console.log("Error saving warzone:", e);
            result.errorMsg = "Error saving warzone";
            return res.json(result);
          });

        console.log(`${attack.war.name} is now marked as available.`);

        result.success = true;
        return res.json(result);
      } else {
        console.log("War not found in the warzone.");
      }
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
      console.log("Attack ID:", attack_id);

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
