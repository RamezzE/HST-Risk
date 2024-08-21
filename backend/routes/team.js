import { Router } from 'express';
import Settings from "../models/setting.js";
import TeamController from './../controllers/team_controller.js';

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


router.get("/", TeamController.get_all_teams)
router.get("/subteams", TeamController.get_all_subteams)
router.get("/:number", TeamController.get_team);

router.put("/", TeamController.add_team)

router.post("/update/:number", TeamController.update_team)
router.post("/update-subteam", TeamController.update_subteam)
router.post("/create-teams", TeamController.create_teams)
router.post("/update-balance", checkGameStatus, TeamController.update_team_balance)

router.delete("/:number", TeamController.delete_team)


export default router;