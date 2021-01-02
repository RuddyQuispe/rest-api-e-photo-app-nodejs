import { photoStudio } from "../models/photo_studio.model";

export class PhotoStudioController {
    static async getListPhotoStudio(req, res) {
        const lisStudio = await photoStudio.getListPhotoStudio();
        res.status(200).json(lisStudio);
    }

    static async createPhotoStudio(req, res) {
        const {name, address} = req.body;
        const id = await photoStudio.registerPhotoStudio(name, address);
        if (id>0) {
            res.status(200).json({message : `photo studio created successfully: new ID: ${id}`});
        }else{
            res.status(200).json({message : `photo studio ${name} has problems to register, again please`});
        }
    }
}