import { Router } from 'express';
var router = Router();

import TeamController from '../controllers/team_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.get("/", TeamController.get_all_teams)
router.get(":number", TeamController.get_team);

router.put("/", TeamController.add_team)

router.post("/update:number", TeamController.update_team)

router.delete("/:number", TeamController.delete_team)




export default router;