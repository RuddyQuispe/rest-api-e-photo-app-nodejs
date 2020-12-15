import {Role} from "../models/role.model";

export class RoleController {
    /**
     * Request GET: get list roles
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getRoles(req, res) {
        const listRole = await Role.findAll();
        res.json(listRole);
    }

    /**
     * Request GET: get a role specified
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getRoleById(req, res) {
        const {id} = req.params;
        const roleData = await Role.findOne({
            where: {
                id
            }
        });
        res.json(roleData);
    }
}