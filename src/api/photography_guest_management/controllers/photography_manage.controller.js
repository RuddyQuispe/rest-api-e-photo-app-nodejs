import { compareFaceInPhotos } from '../../../services/aws/rekogition_face_aws';
import { userPhotographer } from '../../user_management_guest_event_photographer/models/user_photographer.model';
import { guest } from '../models/guest_manage.model';
import { photography } from '../models/photography_manage.model'

export class PhotographyCOntroller {

    static async uploadPhotoEvent(req, res) {
        const { image_name_list, price, code_event, email_user_photographer } = req.body;
        const idUser = await userPhotographer.getLoginUserData(email_user_photographer);
        console.log(idUser);
        for (let index = 0; index < image_name_list.length; index++) {
            const idPhoto = await photography.uploadPhotoToEvent(image_name_list[index], price, code_event, idUser.code);
            if (idPhoto <= 0) {
                res.status(200).json({
                    message: `uploaded files i have a problems`
                });
                return;
            }
        }
        res.status(200).json({
            message: `uploaded ${image_name_list.length} files successfully`
        });
    }

    /**
     * get list photos
     * @param {Request} req : HTTP 
     * @param {Response} res : HTTP
     */
    static async getListPhotosEvent(req, res) {
        const { code_event } = req.params;
        const listPhotos = await photography.getListPhotographyOfEvent(code_event);
        res.status(200).json({
            list_photos: listPhotos
        });
    }

    static async getListPhotographies(req, res) {
        const { code_event, email_guest } = req.params;
        console.log(code_event, email_guest);
        const listPhotos = await photography.getListPhotographiesAndOwnerEvent(code_event);
        const listGuestProfies = await guest.getListPhotos(email_guest);
        let listPhotographiesRekognized = new Array();
        console.log(listPhotos, listGuestProfies);
        // for (let index = 0; index < listPhotos.length; index++) {
        //     console.log("aaaa", listGuestProfies.photo_1, listPhotos[index].photo_name);
        //     let rekognitionPromise = compareFaceInPhotos(listGuestProfies.photo_1, listPhotos[index].photo_name);
        //     rekognitionPromise.then(resolve => {
        //         if (resolve) {
        //             listPhotographiesRekognized.push(listPhotos[index]);
        //             console.log(listPhotos[index]);
        //         } else {
        //             console.log("not exists comparission ", listPhotos[index].id);
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // }
        setTimeout(() => {
            // console.log(listPhotographiesRekognized);
            res.status(200).json({
                list_photographies: listPhotos //listPhotographiesRekognized
            })
        }, (listPhotos.length + 1) * 1000);
    }
}