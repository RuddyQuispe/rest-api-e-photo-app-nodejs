// import aws from 'aws-sdk';
// import { credentials } from './config';
// import fs from 'fs';
import { compareFaceInPhotos } from '../../../services/aws/rekogition_face_aws';
import { guest } from '../models/guest_manage.model';
import { photography } from '../models/photography_manage.model'

export class PhotographyCOntroller {

    static async uploadPhotos(req, res) {
        console.log(req);

        // aws.config.setPromisesDependency();
        // aws.config.update({
        //     accessKeyId: credentials.aws_access_key_id,
        //     secretAccessKey: credentials.aws_secret_access_key,
        //     region: credentials.AWS_REGION
        // });
        // const s3 = new aws.S3();
        // console.log(req.file);
        // var params = {
        //     ACL: 'public-read',
        //     Bucket: credentials.BUCKET_NAME,
        //     Body: fs.createReadStream(req.file.path),
        //     Key: `userAvatar/${req.file.originalname}`
        // };

        // s3.upload(params, (err, data) => {
        //     if (err) {
        //         console.log('Error occured while trying to upload to S3 bucket', err);
        //     }
        //     if (data) {
        //         // fs.unlinkSync(req.file.path); // Empty temp folder
        //         const locationUrl = data.Location;
        //         console.log(locationUrl);
        res.status(200).json({ message: "Files saved successfully" });
        //     }
        // });
    }

    static async getListPhotographies(req, res) {
        const { code_event, email_guest } = req.params;
        console.log(code_event, email_guest);
        const listPhotos = await photography.getListPhotographiesAndOwnerEvent(code_event);
        const listGuestProfies = await guest.getListPhotos(email_guest);
        let listPhotographiesRekognized = new Array();
        console.log(listPhotos, listGuestProfies);
        for (let index = 0; index < listPhotos.length; index++) {
            console.log("aaaa", listGuestProfies.photo_1, listPhotos[index].photo_name);
            let rekognitionPromise = compareFaceInPhotos(listGuestProfies.photo_1, listPhotos[index].photo_name);
            rekognitionPromise.then(resolve => {
                if (resolve) {
                    listPhotographiesRekognized.push(listPhotos[index]);
                    console.log(listPhotos[index]);
                } else {
                    console.log("not exists comparission ", listPhotos[index].id);
                }
            }).catch(err => {
                console.log(err);
            });
        }

        setTimeout(() => {
            console.log(listPhotographiesRekognized);
            res.status(200).json({
                list_photographies: listPhotographiesRekognized
            })
        }, (listPhotos.length+1)*1000);
    }
}