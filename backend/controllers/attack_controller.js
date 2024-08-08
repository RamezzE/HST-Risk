import { MongoClient } from "mongodb";

import Attack from "../models/attack.js";

const client = new MongoClient(process.env.MONGO_URI, {});

class AttackController {
    static async get_attacks(req, res) {
        const attacks = await Attack.find();
        return res.json(attacks);
    }

    static async attack(req, res) {
        const result = {
            success: false,
            errorMsg: "",
        };

        const { zone_1, team_1, zone_2, team_2 } = req.body;

        const duplicate_attack = await AttackController.check_duplicate_attack(zone_1, team_1, zone_2, team_2);

        if (!duplicate_attack.success) {
            result.errorMsg = duplicate_attack.errorMsg;
            return res.json(result);
        }

        if (duplicate_attack.duplicate) {
            console.log("Duplicate Attack detected")
            result.errorMsg = duplicate_attack.errorMsg;
            return res.json(result);
        }

        const attack = new Attack({
            attacking_zone: zone_1,
            attacking_team: team_1,
            defending_zone: zone_2,
            defending_team: team_2,
        });

        try {
            await attack.save();
            result.success = true;
            return res.json(result);
        } catch (error) {
            console.error("Server: Error attacking zone:", error);
            result.errorMsg = "Server: Error attacking zone";
            return res.json(result);    
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
                result.errorMsg = "The same attack already exists";
                return result;
            }

            result.success = true;
            return result;
        } catch (error) {
            console.error("Server: Error checking duplicate attack:", error);
            result.errorMsg = "Server: Error checking duplicate attack";
            return result;
        } finally {
            await client.close();
        }
    }

    static async get_attacks_on_zone(req, res) {

        const result = {
            success: false,
            attack: "",
            errorMsg: "",
        };

        const { zone } = req.params;

        try {
            const response = await Attack.findOne({
                defending_zone: zone,
            });
            result.attack = response;

            result.success = true;

            return res.json(result);
        } catch (error) {
            console.error("Server: Error getting attacks by zone:", error);
            result.success = false;
            result.errorMsg = "Server: Error getting attacks by zone";
            return res.json(result);
        }

    }
}

export default AttackController;
