import { Router } from 'express';
var router = Router();

import AttackController from './../controllers/attack_controller.js';

router.get('/', AttackController.get_attacks);
router.get('/zones/:zone', AttackController.get_attacks_on_zone);
router.get('/wars/:war', AttackController.get_attacks_by_war);

router.post('/attack', AttackController.attack);
router.post('/check', AttackController.attack_check);
router.post('/set_result', AttackController.set_attack_result);

router.delete('/', AttackController.delete_attack);

export default router;