import { Router } from 'express';
var router = Router();

import TeamController from '../controllers/team_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.post("/login", TeamController.login);

export default router;