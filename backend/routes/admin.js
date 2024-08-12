import { Router } from 'express';
var router = Router();

import AdminController from '../controllers/admin_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.get("/", AdminController.get_admins);
router.get("/:name", AdminController.get_admin_by_name);

router.put("/", AdminController.add_admin);

router.post("/update", AdminController.update_admin);

router.delete("/:name", AdminController.delete_admin);

export default router;