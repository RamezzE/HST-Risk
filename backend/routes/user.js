import { Router } from 'express';
var router = Router();

import UserController from './../controllers/user_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/is_logged_in", UserController.is_logged_in);

export default router;