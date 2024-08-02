import { Router } from 'express';
var router = Router();

import AdminController from '../controllers/admin_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.post("/login", AdminController.login);
router.post("/add_team", AdminController.add_team);
router.put("/team/:number", AdminController.update_team);

export default router;