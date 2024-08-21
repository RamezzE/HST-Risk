import { MongoClient } from "mongodb";

import Warzone from "../models/warzone.js";
import Attack from "../models/attack.js";

class WarzoneController {
  static async get_warzones(req, res) {
    const zones = await Warzone.find();
    return res.json(zones);
  }
  static async get_wars(req, res) {
    const zones = await Warzone.find();
    const wars = zones.map(zone => zone.wars).flat();
    return res.json(wars);
  }


  static async create_warzone(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    }

    const { name, wars } = req.body;

    const newWarzone = new Warzone({
      name,
      wars
    });

    try {
      await newWarzone.save();
      result.success = true;
      result.errorMsg = "Warzone created successfully";
    }
    catch (error) {
      result.errorMsg = "Error creating warzone";
      console.log(error);
      return result;
    }
    
  }

  static async update_warzone(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    }

    const { id, name, wars } = req.body;

    try {
      const warzone = await Warzone.findById(id);
      if (!warzone) {
        result.errorMsg = "Warzone not found";
        return result;
      }


      if (warzone.wars != wars) {
        // check if there are any wars that are not in the new wars list
        const warsToDelete = warzone.wars.filter(war => !wars.includes(war));
        // check if there any attacks in the wars to delete
        const attacks = await Attack.find({ war: { $in: warsToDelete } });
        
        if (attacks.length > 0) {
          result.errorMsg = "This warzone has attacks that need to be finished or deleted first before you can modify it";
          return result;
        }

        warzone.wars = wars;
      }

      const response = await Warzone.updateOne({ _id:id }, { name, wars });
      result.success = true;
      result.errorMsg = "Warzone updated successfully";
    }
    catch (error) {
      result.errorMsg = "Error updating warzone";
      console.log(error);
      return result;
    }
    
  }

  static async delete_warzone(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    }

    const { id } = req.body;

    console.log("Warzone id: ", id)

    try {
      const warzone = await Warzone.findById(id);
      if (!warzone) {
        result.errorMsg = "Warzone not found";
        return result;
      }

      const attacks = await Attack.find({ war: { $in: warzone.wars } });
      if (attacks.length > 0) {
        result.errorMsg = "This warzone has attacks that need to be finished or deleted first before you can delete it";
        return result;
      }

      await Warzone.deleteOne({ _id:id });
      result.success = true;
      return result;
    }
    catch (error) {
      result.errorMsg = "Error deleting warzone";
      console.log(error);
      return result;
    }
    
  }
  
}

export default WarzoneController;
