import { MongoClient } from "mongodb";

import Warzone from "../models/warzone.js";

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
  
}

export default WarzoneController;
