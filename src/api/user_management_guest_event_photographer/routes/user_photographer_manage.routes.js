import { Router } from 'express';
import { UserPhotographerController } from '../controllers/user_photographer_manage.controller';
import { verifyToken, isPhotographerUser } from '../../../middleware'

const router = Router();

router.get('/', UserPhotographerController.getUsers);

router.get('/:id', [verifyToken, isPhotographerUser], UserPhotographerController.getUserById);

router.post('/', UserPhotographerController.createUser);

export default router;