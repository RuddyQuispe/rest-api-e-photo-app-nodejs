import { Router } from 'express';
import { verifyToken } from '../../../middleware';
import { PhotoStudioController } from '../controllers/photo_studio.controller';

const router = Router();

router.get('/', [verifyToken], PhotoStudioController.getListPhotoStudio);

router.post('/', [verifyToken], PhotoStudioController.createPhotoStudio);

export default router;