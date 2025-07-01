import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, (req, res, next) => {
  Promise.resolve(login(req, res)).catch(next);
});

export default router;
