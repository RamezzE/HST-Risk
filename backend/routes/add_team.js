import { Router } from 'express';
import TeamController from '../controllers/team_controller.js'
var router = Router();


router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.post('/', TeamController.add_team);

export default router;