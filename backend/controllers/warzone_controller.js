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
        // Collect the duplicated war names
        const duplicatedNames = existingWarzones.flatMap((warzone) =>
          warzone.wars
            .filter((war) => newWarNames.includes(war.name))
            .map((war) => war.name)
        );
  
        result.errorMsg = `One or more wars are already associated with another warzone: ${Array.from(new Set(duplicatedNames)).join(', ')}`;
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
      result.errorMsg = "Error creating warzone";
      console.log(error);
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
      const currentAttacks = await Attack.find({ warzone_id: id });
      if (currentAttacks.length > 0) {
        result.errorMsg =
          "This warzone has ongoing attacks. You cannot modify it.";
        return res.json(result);
      }

      // Trim and extract war names from the incoming wars
      const newWarNames = wars.map((war) => war.name.trim());

      // Check for duplicated war names in other warzones
      const existingWarzones = await Warzone.find({
        _id: { $ne: id }, // Exclude the current warzone
        "wars.name": { $in: newWarNames }, // Check if any war name already exists in other warzones
      });

      if (existingWarzones.length > 0) {
        // Collect the duplicated war names
        const duplicatedNames = existingWarzones.flatMap(
          (warzone) =>
            warzone.wars
              .filter((war) => newWarNames.includes(war.name.trim())) // Trim before comparison
              .map((war) => war.name.trim()) // Trim before adding to the list
        );

        result.errorMsg =
          "One or more war names are already associated with another warzone";
        result.duplicatedWarNames = Array.from(new Set(duplicatedNames)); // Remove duplicates from the list
        return res.json(result);
      }

      // If there are any wars that are not in the new wars list, check for associated attacks
      const currentWarNames = warzone.wars.map((war) => war.name.trim());
      const warsToDelete = currentWarNames.filter(
        (warName) => !newWarNames.includes(warName)
      );

      if (warsToDelete.length > 0) {
        const attacks = await Attack.find({
          "war.name": { $in: warsToDelete },
        });
        if (attacks.length > 0) {
          result.errorMsg =
            "This warzone has attacks that need to be finished or deleted first before you can modify it";
          return res.json(result);
        }
      }

      // Update warzone with new wars and name
      warzone.name = name;
      warzone.wars = wars.map((war) => ({ ...war, name: war.name.trim() })); // Trim before saving
      await warzone.save();

      io.emit("update_warzone", warzone);

      result.success = true;
      result.errorMsg = "Warzone updated successfully";
      return res.json(result);
    } catch (error) {
      result.errorMsg = "Error updating warzone";
      console.log(error);
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
      const ongoingAttacks = await Attack.find({ warzone_id: id });
      if (ongoingAttacks.length > 0) {
        result.errorMsg =
          "This warzone has ongoing attacks and cannot be deleted.";
        return res.json(result);
      }

      // Check if there are any attacks related to the wars in this warzone
      const attacks = await Attack.find({ war: { $in: warzone.wars } });
      if (attacks.length > 0) {
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
      result.errorMsg = "Error deleting warzone";
      console.log(error);
      return res.json(result);
    }
  }
}

export default WarzoneController;
