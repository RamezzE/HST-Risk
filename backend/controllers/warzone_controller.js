import { MongoClient } from "mongodb";

import Warzone from "../models/warzone.js";
import Attack from "../models/attack.js";

import { io } from "../app.js";

class WarzoneController {
  static async get_warzones(req, res) {
    const zones = await Warzone.find();
    return res.json(zones);
  }
  static async get_wars(req, res) {
    const zones = await Warzone.find();
    const wars = zones.map((zone) => zone.wars).flat();
    return res.json(wars);
  }

  static async create_warzone(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };
  
    const { name, wars } = req.body;
  
    try {
      // Trim the warzone name and war names
      const trimmedName = name.trim();
      const trimmedWars = wars.map((war) => ({
        ...war,
        name: war.name.trim(),
        location: war.location.trim(),
      }));
  
      // Check if the warzone name already exists
      const existingWarzone = await Warzone.findOne({ name: trimmedName });
      if (existingWarzone) {
        result.errorMsg = "A warzone with this name already exists";
        return res.json(result);
      }
  
      // Extract the war names to validate
      const newWarNames = trimmedWars.map((war) => war.name);
  
      // Check if any of the wars are already associated with another warzone
      const existingWarzones = await Warzone.find({
        "wars.name": { $in: newWarNames },
      });
  
      if (existingWarzones.length > 0) {
        const duplicatedNames = new Set();
        existingWarzones.forEach((warzone) =>
          warzone.wars.forEach((war) => {
            if (newWarNames.includes(war.name)) {
              duplicatedNames.add(war.name);
            }
          })
        );
  
        result.errorMsg = `One or more wars are already associated with another warzone: ${Array.from(
          duplicatedNames
        ).join(", ")}`;
        return res.json(result);
      }
  
      // Create the new warzone
      const newWarzone = new Warzone({
        name: trimmedName,
        wars: trimmedWars,
      });
  
      await newWarzone.save();
  
      io.emit("new_warzone", newWarzone);
  
      result.success = true;
      result.errorMsg = "Warzone created successfully";
      return res.json(result);
    } catch (error) {
      console.error("Error creating warzone:", error);
      result.errorMsg = "Error creating warzone";
      return res.json(result);
    }
  }
  
  static async update_warzone(req, res) {
    const result = {
      success: false,
      errorMsg: "",
      duplicatedWarNames: [],
    };
  
    const { id, name, wars } = req.body;
  
    try {
      const warzone = await Warzone.findById(id);
      if (!warzone) {
        result.errorMsg = "Warzone not found";
        return res.json(result);
      }
  
      // Check if there are any current attacks associated with this warzone_id
      const ongoingAttacks = await Attack.exists({ warzone_id: id });
      if (ongoingAttacks) {
        result.errorMsg =
          "This warzone has ongoing attacks. You cannot modify it.";
        return res.json(result);
      }
  
      // Trim and extract war names from the incoming wars
      const newWarNames = wars.map((war) => war.name.trim());
  
      // Check for duplicated war names in other warzones
      const existingWarzones = await Warzone.find({
        _id: { $ne: id },
        "wars.name": { $in: newWarNames },
      });
  
      if (existingWarzones.length > 0) {
        const duplicatedNames = new Set();
        existingWarzones.forEach((warzone) =>
          warzone.wars.forEach((war) => {
            if (newWarNames.includes(war.name.trim())) {
              duplicatedNames.add(war.name.trim());
            }
          })
        );
  
        result.errorMsg =
          "One or more war names are already associated with another warzone";
        result.duplicatedWarNames = Array.from(duplicatedNames);
        return res.json(result);
      }
  
      // Check for associated attacks if wars are removed
      const currentWarNames = warzone.wars.map((war) => war.name.trim());
      const warsToDelete = currentWarNames.filter(
        (warName) => !newWarNames.includes(warName)
      );
  
      if (warsToDelete.length > 0) {
        const attacks = await Attack.exists({
          "war.name": { $in: warsToDelete },
        });
        if (attacks) {
          result.errorMsg =
            "This warzone has attacks that need to be finished or deleted first before you can modify it";
          return res.json(result);
        }
      }
  
      // Update warzone with new wars and name
      warzone.name = name.trim();
      warzone.wars = wars.map((war) => ({
        ...war,
        name: war.name.trim(),
      }));
      await warzone.save();
  
      io.emit("update_warzone", warzone);
  
      result.success = true;
      result.errorMsg = "Warzone updated successfully";
      return res.json(result);
    } catch (error) {
      console.error("Error updating warzone:", error);
      result.errorMsg = "Error updating warzone";
      return res.json(result);
    }
  }
  
  static async delete_warzone(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };
  
    const { id } = req.params;
  
    try {
      const warzone = await Warzone.findById(id);
      if (!warzone) {
        result.errorMsg = "Warzone not found";
        return res.json(result);
      }
  
      // Check if there are any ongoing attacks associated with this warzone
      const ongoingAttacks = await Attack.exists({ warzone_id: id });
      if (ongoingAttacks) {
        result.errorMsg =
          "This warzone has ongoing attacks and cannot be deleted.";
        return res.json(result);
      }
  
      // Check if there are any attacks related to the wars in this warzone
      const associatedAttacks = await Attack.exists({
        "war.name": { $in: warzone.wars.map((war) => war.name) },
      });
      if (associatedAttacks) {
        result.errorMsg =
          "This warzone has attacks associated with its wars that need to be finished or deleted before you can delete the warzone.";
        return res.json(result);
      }
  
      // If no attacks are found, delete the warzone
      await Warzone.deleteOne({ _id: id });
  
      io.emit("delete_warzone", id);
  
      result.success = true;
      result.errorMsg = "Warzone deleted successfully.";
      return res.json(result);
    } catch (error) {
      console.error("Error deleting warzone:", error);
      result.errorMsg = "Error deleting warzone";
      return res.json(result);
    }
  }
  
}

export default WarzoneController;
