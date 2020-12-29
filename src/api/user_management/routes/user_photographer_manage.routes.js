import { Router } from 'express';
import { UserPhotographerController } from '../controllers/user_photographer_manage.controller';
import { verifyToken, isAdmin } from '../../../middleware'

const router = Router();

router.get('/', UserPhotographerController.getUsers);

router.get('/:id', UserPhotographerController.getUserById);

router.post('/', [verifyToken, isAdmin], UserPhotographerController.createUser);

export default router;