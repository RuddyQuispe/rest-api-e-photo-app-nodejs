import aws from 'aws-sdk';
import { credentials } from './config';
import fs from 'fs';

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
                res.status(200).json({message: "Files saved successfully"});
        //     }
        // });
    }
}