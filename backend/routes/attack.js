import { Router } from "express";
import Settings from "../models/setting.js";
import AttackController from "./../controllers/attack_controller.js";

var router = Router();
// Middleware to check if the game is active
const checkGameStatus = async (req, res, next) => {
  try {
    const setting = await Settings.findOne({ name: "Game Status" });
    
    if (setting && setting.value === "Active") {
      next(); // Proceed to the route handler
    } else {
      res.json({ success: false, errorMsg: "Game has ended or is paused" });
    }
  } catch (error) {
    console.error('Error checking game status:', error);
    res.json({ success: false, errorMsg: "Internal server error" });
  }
};

// Define routes without middleware
router.get("/", AttackController.get_attacks);
router.get("/zones/:zone", AttackController.get_attacks_on_zone);
router.get("/wars/:war", AttackController.get_attacks_by_war);
router.delete("/", AttackController.delete_attack);

// Apply middleware to routes that need game status check
router.post("/attack", checkGameStatus, AttackController.attack);
router.post("/check", checkGameStatus, AttackController.attack_check);
router.post("/set_result", checkGameStatus, AttackController.set_attack_result);

export default router;
