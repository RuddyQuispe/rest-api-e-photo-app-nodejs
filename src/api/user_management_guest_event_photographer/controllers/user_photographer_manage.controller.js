import { photoSocial } from "../models/photo_social.model";
import { userPhotographer } from "../models/user_photographer.model";

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
        const { code } = req.params;
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
        const { username, email, password, id_studio, list_social } = req.body;
        const codeUserPhotographer = await userPhotographer.createUserPhotographer(username, email, password, id_studio);
        if (codeUserPhotographer > 0) {
            for (let indexListSocial = 0; indexListSocial < list_social.length; indexListSocial++) {
                let { id, description } = list_social[indexListSocial];
                if (await photoSocial.addSocialNetwork(id, codeUserPhotographer, description)) {
                    console.log("Registered social network");
                } else {
                    console.log("Error in register social", id, description, list_social);
                }
            }
            res.status(200).json({ message: "Created user photographer successfully" });
        } else {
            res.status(200).json({ message: "Error in create account photographer" });
        }
    }

    /**
     * update status accoutn photographer user
     * @param {Rquerst} req : http
     * @param {Response} res : http
     */
    static async enableDisableAccount(req, res) {
        const { id } = req.params;
        if (await userPhotographer.enableDisablePhotographer(id)) {
            res.status(200).json({ message: `updated status user code: ${id}` });
        } else {
            res.status(200).json({ message: `i have an error in change status id: ${id}` });
        }
    }
}