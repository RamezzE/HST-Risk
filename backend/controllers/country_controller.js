import Country from "../models/country.js";
import { io } from "../app.js"; 

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
      // Find and update the country in one operation
      const country = await Country.findOneAndUpdate(
        { name: name },
        { $set: { teamNo: teamNo } },
      );
  
      if (!country) {
        result.errorMsg = `${name} not found`;
        return res.json(result); // 404 Not Found status code
      }
  
      io.emit("update_country", country);
  
      result.success = true;
      return res.json(result); // 200 OK status code for a successful update
    } catch (error) {
      result.errorMsg = `Error updating ${name}: ${error.message}`;
      console.error("Error updating country:", error);
      return res.json(result); // 500 Internal Server Error status code for server-side errors
    }
  }
  
}

export default CountryController;
