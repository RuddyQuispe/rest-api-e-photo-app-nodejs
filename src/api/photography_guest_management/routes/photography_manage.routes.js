import { Router } from 'express';
import { PhotographyCOntroller } from '../controllers/photography_manage.controller';

const router = Router();

router.get(`/photo/:codeEvent`, (req, res) => {

});

router.post(`/upload_photos`, PhotographyCOntroller.uploadPhotos)

export default router;