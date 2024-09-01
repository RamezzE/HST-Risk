import { Router } from "express";
import Settings from "../models/setting.js";
import WarzoneController from "./../controllers/warzone_controller.js";

const checkGameStatus = async (req, res, next) => {
    try {
      const setting = await Settings.findOne({ name: "Game Status" });
      
      if (setting && setting.value === "Paused") {
        next(); // Proceed to the route handler
      } else {
        res.json({ success: false, errorMsg: "You cannot modify warzones while game is active" });
      }
    } catch (error) {
      console.error('Error checking game status:', error);
      res.json({ success: false, errorMsg: "Internal server error" });
    }
  };

var router = Router();

router.get("/", WarzoneController.get_warzones);
router.get("/wars", WarzoneController.get_wars);

router.use((req, res, next) => {
  if (!req.session.user || req.session.user.mode !== "super_admin") {
    res.json({ success: false, errorMsg: "Please log in" });
  } else {
    next();
  }
});

router.post("/", WarzoneController.create_warzone);
router.put("/", WarzoneController.update_warzone);
router.delete("/:id", WarzoneController.delete_warzone);

export default router;
