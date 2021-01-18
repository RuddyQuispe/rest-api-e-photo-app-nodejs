import { Router } from 'express';
import { PhotographyCOntroller } from '../controllers/photography_manage.controller';

const router = Router();

router.get(`/list_photographies/:code_event/:email_guest`, PhotographyCOntroller.getListPhotographies)

router.get(`/list_photographies/:code_event`, PhotographyCOntroller.getListPhotosEvent);

export default { router, PhotographyCOntroller };