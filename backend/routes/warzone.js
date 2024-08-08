import { Router } from 'express';
import WarzoneController from '../controllers/warzone_controller.js';
var router = Router();


router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});

router.get("/", WarzoneController.get_warzones);


export default router;