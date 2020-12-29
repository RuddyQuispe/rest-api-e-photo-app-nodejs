import {UserPhotographer} from "../models/user_photographer.model";

export class UserPhotographerController {
    /**
     * Request GET: get list user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getUsers(req, res) {
        const listUser = await UserPhotographer.findAll();
        res.json(listUser);
    }

    static async getUserById(req, res) {
        const {code} = req.params;
        const userByCode = await UserPhotographer.findOne({
            where: {
                code
            }
        });
        res.json(userByCode);
    }

    static async createUser(req, res) {
        const {id, username, email, phone, status} = req.body;
        res.send(req.body);
    }
}