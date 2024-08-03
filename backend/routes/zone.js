import { Router } from 'express';
var router = Router();

import ZoneController from '../controllers/zone_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});


router.get("/", ZoneController.get_zones);

export default router;