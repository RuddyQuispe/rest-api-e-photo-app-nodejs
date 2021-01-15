import { Router } from 'express';
import { PhotographyCOntroller } from '../controllers/photography_manage.controller';

const router = Router();

router.post(`/upload_photos`, PhotographyCOntroller.uploadPhotos)

router.get(`/list_photographies/:code_event/:email_guest`, PhotographyCOntroller.getListPhotographies)

export default router;