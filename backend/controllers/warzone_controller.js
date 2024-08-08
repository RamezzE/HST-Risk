import { MongoClient } from "mongodb";

import Warzone from "../models/warzone.js";

const client = new MongoClient(process.env.MONGO_URI, {});

class WarzoneController {
  static async get_warzones(req, res) {
    const zones = await Warzone.find();
    return res.json(zones);
  }
}

export default WarzoneController;
