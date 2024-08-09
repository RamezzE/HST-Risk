import { Router } from 'express';
var router = Router();

import AdminController from '../controllers/admin_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.get("/", AdminController.get_admins);

router.post("/login", AdminController.login);
router.post("/add_team", AdminController.add_team);
router.post("/update_admin", AdminController.update_admin);

router.delete("/admin", AdminController.delete_admin);

router.put("/team/:number", AdminController.update_team);
router.put("/country/:name", AdminController.update_country);

router.put("/", AdminController.add_admin);

router.delete("/team/:number", AdminController.delete_team);


export default router;