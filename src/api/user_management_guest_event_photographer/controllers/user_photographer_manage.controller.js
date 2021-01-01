import {userPhotographer} from "../models/user_photographer.model";

export class UserPhotographerController {
    /**
     * Request GET: get list user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getUsers(req, res) {
        const listUser = await userPhotographer.getListUserPhotographer();
        res.status(200).json(listUser);
    }

    /**
     * Request GET: get user data
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async getUserById(req, res) {
        const {code} = req.params;
        const userByCode = await userPhotographer.getDataUserPhotographer(code);
        res.json(userByCode);
    }

    /**
     * Request GET: create account photographer user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async createUser(req, res) {
        const {username, email, password, id_studio} = req.body;
        if (await userPhotographer.createUserPhotographer(username, email, password, id_studio)) {
            res.status(200).json({message: "Created user photographer successfully"});
        }else{
            res.status(200).json({message: "Error in create account photographer"});
        }
    }
}