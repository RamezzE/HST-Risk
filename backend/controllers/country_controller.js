import Country from "../models/country.js";

class CountryController {
  static async get_country_mappings(req, res) {
    const countries = await Country.find();
    return res.json(countries);
  }

  static async get_countries_by_team(req, res) {
    const result = {
      success: false,
      countries: "",
      errorMsg: "",
    };

    const { number } = req.params;

    try {
      const response = await Country.find({
        teamNo: number,
      });

      result.countries = response;
      result.success = true;

      return res.json(result);
    } catch (error) {
      console.error("Error getting countries by team", error);
      result.success = false;
      result.errorMsg = "Error getting countries by team";
      return res.json(result);
    }
  }

  static async update_country(req, res) {
    const result = {
      success: false,
      errorMsg: "",
    };

    const { name } = req.params;
    const { teamNo } = req.body;

    try {
      const country = await Country.findOne({ name: name });

      if (!country) {
        result.errorMsg = `${name} not found`;
        return res.json(result);
      }

      country.teamNo = teamNo;

      await country.save();

      result.success = true;
      return res.json(result);
    } catch (error) {
      result.errorMsg = `Error updating ${name}`;
      console.log(error);
      return res.json(result);
    }
  }
}

export default CountryController;
