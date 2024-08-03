import { MongoClient } from "mongodb";

import Zone from "../models/zone.js";

const client = new MongoClient(process.env.MONGO_URI, {});

class ZoneController {
  static async get_zones(req, res) {
    const zones = await Zone.find();
    return res.json(zones);
  }
}

export default ZoneController;
