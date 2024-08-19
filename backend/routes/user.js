import { Router } from 'express';
var router = Router();

import UserController from '../controllers/user_controller.js';

router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/is_logged_in", UserController.is_logged_in);

router.post("/pushToken", UserController.addPushToken);
router.delete("/pushToken", UserController.deletePushToken);

export default router;