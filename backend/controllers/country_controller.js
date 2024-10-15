import Country from "../models/country.js";
import { io } from "../app.js";

class CountryController {
  static async get_country_mappings(req, res) {
    let countries = await Country.find();

    countries.sort((a, b) => {
      const order = [
        "South Africa",
        "Congo",
        "Central Africa",
        "Egypt",
        "North Africa",
        "Madagascar",
        "New Zealand",
        "Western Australia",
        "Eastern Australia",
        "New Guinea",
        "Indonesia",
        "Brazil",
        "Venezuela",
        "Peru",
        "Bolivia",
        "Chile",
        "Argentina",
        "Paraguay",
        "Greenland",
        "Honduras",
        "Mexico",
        "Western US",
        "Eastern US",
        "Cuba",
        "Quebec",
        "Canada",
        "Alaska",
        "Northwest Territories",
        "Russia",
        "Japan",
        "Iceland",
        "China",
        "Mongolia",
        "Korea",
        "India",
        "Kazakhstan",
        "Middle East",
        "Northern Europe",
        "Britain",
        "Europe",
      ];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });
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

    const maxRetries = 3;
    const retryDelay = 1000; // 1 second delay between retries

    let attempt = 0;
    let updated = false;

    while (attempt < maxRetries && !updated) {
      attempt++;

      try {
        // Find the country and check if it's locked
        const country = await Country.findOne({ name: name });

        if (!country) {
          result.errorMsg = `${name} not found`;
          return res.json(result); // 404 Not Found status code
        }

        if (country.locked) {
          result.errorMsg = `${name} is currently locked and cannot be updated`;
          return res.json(result); // 403 Forbidden status code or 409 Conflict status code
        }

        // Update the country if it's not locked
        country.teamNo = teamNo;
        await country.save();

        io.emit("update_country", country);

        result.success = true;
        updated = true; // Mark as successfully updated
        return res.json(result); // 200 OK status code for a successful update
      } catch (error) {
        console.error(`Error updating country on attempt ${attempt}:`, error);

        if (attempt >= maxRetries) {
          result.errorMsg = `Error updating ${name} after ${maxRetries} attempts: ${error.message}`;
          return res.json(result); // 500 Internal Server Error status code for server-side errors
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }
}

export default CountryController;
