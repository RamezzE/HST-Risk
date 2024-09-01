import { Router } from 'express';
var router = Router();

import CountryController from '../controllers/country_controller.js';

router.get("/", CountryController.get_country_mappings);
router.get("/:number", CountryController.get_countries_by_team);


router.use((req, res, next) => {
    if (!req.session.user || req.session.user.mode != "super_admin") {
      res.json({ success: false, errorMsg: "Please log in" });
    } else {
      next();
    }
  });

router.post("/:name", CountryController.update_country)

export default router;