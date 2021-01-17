import { Router } from 'express';
import { UserPhotographerController } from '../controllers/user_photographer_manage.controller';
import { verifyToken, isPhotographerUser } from '../../../middleware'

const router = Router();
// [verifyToken],
router.get('/',  UserPhotographerController.getUsers);

router.get('/:id', [verifyToken, isPhotographerUser], UserPhotographerController.getUserById);

router.post('/', UserPhotographerController.createUser);

router.put('/:id', [verifyToken], UserPhotographerController.enableDisableAccount);

export default router;