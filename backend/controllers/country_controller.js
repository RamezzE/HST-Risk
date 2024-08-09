import Country from "../models/country.js";

class CountryController {
  static async get_country_mappings(req, res) {
    const countries = await Country.find();
    return res.json(countries);
  }
}

export default CountryController;
