
import { photoStudio } from "../models/photo_studio.model";
import { listSocial } from "../models/social_network.model";
import { studioSocial } from "../models/studio_social.model";

export class PhotoStudioController {

    /**
     * Get List Studio Photo
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async getListPhotoStudio(req, res) {
        const listStudio = await photoStudio.getListPhotoStudio();
        const listSocialNetwork = await listSocial;
        res.status(200).json({ list_photo_studio: listStudio, list_social_network: listSocialNetwork });
    }

    /**
     * Create pHoto Studio
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async createPhotoStudio(req, res) {
        const { name, address, list_social_network } = req.body;
        const idStudio = await photoStudio.registerPhotoStudio(name, address);
        if (idStudio > 0) {
            for (let indexSocialNetwork = 0; indexSocialNetwork < list_social_network.length; indexSocialNetwork++) {
                let { id, description } = list_social_network[indexSocialNetwork];
                if (await studioSocial.addSocialNetwork(id, idStudio, description)) {
                    console.log("Registered successffully", id, description);
                }else{
                    console.log("Error in register social photo studio", id, description);
                }
            }
            res.status(200).json({ message: `photo studio created successfully: new ID: ${idStudio}` });
        } else {
            res.status(200).json({ message: `photo studio ${name} has problems to register, again please` });
        }
    }
}