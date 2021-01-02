import { Router } from "express";
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/signup/:type_user', AuthController.signUp);

router.post('/signin', AuthController.signIn);

export default router;