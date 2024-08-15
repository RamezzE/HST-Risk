import { Router } from 'express';
import WarzoneController from './../controllers/warzone_controller.js';
var router = Router();

router.get("/", WarzoneController.get_warzones);
router.get("/wars", WarzoneController.get_wars);

export default router;