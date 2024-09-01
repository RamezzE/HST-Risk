import { Router } from "express";
var router = Router();

import SettingsController from "../controllers/settings_controller.js";

router.get("/", SettingsController.get_settings);

router.use((req, res, next) => {
    if (!req.session.user || req.session.user.mode != "super_admin") {
      res.json({ success: false, errorMsg: "Please log in" });
    } else {
      next();
    }
  });

router.put("/update", SettingsController.update_setting);

export default router;
