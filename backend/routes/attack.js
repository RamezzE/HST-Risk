import { Router } from 'express';
var router = Router();

import AttackController from './../controllers/attack_controller.js';

router.use(function (req, res, next) {
//   if (req.session.userType)
//     return res.redirect('/');
  
  next();
});


router.get('/', AttackController.get_attacks);
router.get('/get_attacks/:zone', AttackController.get_attacks_on_zone);

router.post('/attack', AttackController.attack);
router.post('/attack_check', AttackController.attack_check);

export default router;