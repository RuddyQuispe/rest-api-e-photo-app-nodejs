import {Router} from "express";
import {UserOrganizerEventController} from "../controllers/user_organizer_event.controller.";


const router = Router()

router.get('/', UserOrganizerEventController.getUsersOrganizerList);

router.get('/:id', UserOrganizerEventController.getUserById);

router.post('/', UserOrganizerEventController.createUser)

export default router;