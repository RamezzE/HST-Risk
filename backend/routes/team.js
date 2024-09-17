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
router.get("/subteam-letters", TeamController.get_subteam_letters)

router.get("/:number", TeamController.get_team);

// router.put("/", TeamController.add_team)

router.use((req, res, next) => {
  if (!req.session.user || (req.session.user.mode !== "admin" && req.session.user.mode !== "super_admin")) {
    res.json({ success: false, errorMsg: "Please log in" });
  } else {
    next();
  }
});


router.post("/update/:number", TeamController.update_team)
router.post("/update-subteam", TeamController.update_subteam)
router.post("/update-balance", checkGameStatus, TeamController.update_team_balance)

router.post("/create-teams", TeamController.create_teams)

export default router;