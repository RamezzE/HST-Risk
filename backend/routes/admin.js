import { Router } from "express";
var router = Router();

import AdminController from "./../controllers/admin_controller.js";

router.use((req, res, next) => {
  if (!req.session.user) 
    res.json({ success: false, errorMsg: "Please log in" })
  else if (req.session.user.mode != "super_admin") 
    res.json({ success: false, errorMsg: "You are not authorized" })
  else 
    next();
});

router.get("/", AdminController.get_admins);
router.get("/:name", AdminController.get_admin_by_name);

router.put("/", AdminController.add_admin);

router.post("/update", AdminController.update_admin);

router.delete("/:name", AdminController.delete_admin);

export default router;
