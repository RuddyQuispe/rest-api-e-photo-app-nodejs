import { Router } from "express";
import { UserOrganizerEventController } from "../controllers/user_organizer_event.controller.";
import { verifyToken, isOrganizerEventUser } from '../../../middleware/index'

const router = Router()

router.get('/', [verifyToken], UserOrganizerEventController.getUsersOrganizerList);

router.get('/:id', [verifyToken, isOrganizerEventUser], UserOrganizerEventController.getUserById);

router.post('/', UserOrganizerEventController.createUser)

router.put('/:id', [verifyToken], UserOrganizerEventController.enableDisableAccount);

export default router;