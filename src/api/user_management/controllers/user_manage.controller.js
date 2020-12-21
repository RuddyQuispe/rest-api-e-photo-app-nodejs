import {User} from "../models/user.model";

export class UserController {
    /**
     * Request GET: get list user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getUsers(req, res) {
        const listUser = await User.findAll();
        res.json(listUser);
    }

    static async getUserById(req, res) {
        const {id} = req.params;
        const userById = await User.findOne({
            where: {
                id
            }
        });
        res.json(userById);
    }

    static async createUser(req, res) {
        const {id, username, email, phone, status} = req.body;
        res.send(req.body);
    }
}