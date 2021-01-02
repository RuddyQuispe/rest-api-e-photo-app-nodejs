import { Router } from 'express';
import { PhotoStudioController } from '../controllers/photo_studio.controller';

const router = Router();

router.get('/', PhotoStudioController.getListPhotoStudio);

router.post('/', PhotoStudioController.createPhotoStudio);

export default router;