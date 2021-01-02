import { Router } from "express";
import { UserOrganizerEventController } from "../controllers/user_organizer_event.controller.";
import { verifyToken, isOrganizerEventUser } from '../../../middleware/index'

const router = Router()

router.get('/', UserOrganizerEventController.getUsersOrganizerList);

router.get('/:id', [verifyToken, isOrganizerEventUser], UserOrganizerEventController.getUserById);

router.post('/', UserOrganizerEventController.createUser)

export default router;