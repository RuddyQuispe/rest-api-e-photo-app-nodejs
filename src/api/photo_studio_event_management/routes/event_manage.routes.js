import { Router } from 'express';
import { verifyToken } from '../../../middleware';
import { EventController } from '../controllers/event_manage.controller';

const router = Router();

router.get('/organizer/:email_owner', [verifyToken], EventController.getEventRegister);

router.get('/studio/:email_photograph',[verifyToken], EventController.getEventContainsStudio);

router.put('/:code', [verifyToken], EventController.enableEvent)

router.post('/', [verifyToken], EventController.registerNewEvent);

export default router;