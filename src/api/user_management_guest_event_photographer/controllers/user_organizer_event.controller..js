import { userOrganizerEvent } from "../models/user_organizer_event.model";

export class UserOrganizerEventController {
    /**
     * Request GET: get list user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getUsersOrganizerList(req, res) {
        const listUser = await userOrganizerEvent.getListUserOrganizerEvent();
        res.status(200).json(listUser);
    }

    /**
     * Request GET: get user data
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getUserById(req, res) {
        const { code } = req.params;
        const userByCode = await userOrganizerEvent.getDataUserOrganizerEvent(code);
        res.json(userByCode);
    }

    /**
     * Request GET: create account organizer event user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async createUser(req, res) {
        const { name, phone, email, password } = req.body;
        if (await userOrganizerEvent.createUserOrganizerEvent(name, phone, email, password)) {
            res.status(200).json({ message: "Created user organizer event successfully" });
        } else {
            res.status(200).json({ message: "Error in create account organizer event" });
        }
    }

    /**
     * update status accoutn organizer event user
     * @param {Rquerst} req : http
     * @param {Response} res : http
     */
    static async enableDisableAccount(req, res) {
        const { id } = req.params;
        if (await userOrganizerEvent.enableDisableOrganizerEvent(id)) {
            res.status(200).json({ message: `updated status user code: ${id}` });
        } else {
            res.status(200).json({ message: `i have an error in change status id: ${id}` });
        }
    }
}