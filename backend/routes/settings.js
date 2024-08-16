import { Router } from 'express';
var router = Router();

import SettingsController from '../controllers/settings_controller.js';

router.get("/", SettingsController.get_settings);

export default router;