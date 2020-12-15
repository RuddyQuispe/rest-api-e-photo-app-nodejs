import {Router} from "express";
import {RoleController} from "../controllers/role_manage.controller";


const router = Router()

router.get('/', RoleController.getRoles);

router.get('/:id', RoleController.getRoleById);

export default router;