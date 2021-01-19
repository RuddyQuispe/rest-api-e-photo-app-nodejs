import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import aws from 'aws-sdk';
import './config/database';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from './middleware/index';
import credentials from './config';
import multer from 'multer';
import multerS3 from 'multer-s3';

/**
 * Import Routes
 */
import { UserPhotographerRouter, UserOrganizerEventRouter } from './api/user_management_guest_event_photographer/routes/';
import { RouterEvent, RouterPhotoStudio } from './api/photo_studio_event_management/routes/index';
import AuthRouter from './routes/auth.routes'
import { RouterPhotography, RouterSaleNote } from './api/photography_guest_management/routes';

/**
 * Main object, it's initialize to rest-api server
 */
export class App {
    /**
     * initialize expressjs framework
     */
    constructor() {
        this.app = express();
        this.upload = null;
    }

    /**
     * function storage process and run before of any http request
     * first running functions storage in middlewares
     * last running http request
     */
    middlewares() {
        aws.config.setPromisesDependency();
        var s3 = new aws.S3({
            accessKeyId: credentials.aws_access_key_id,
            secretAccessKey: credentials.aws_secret_access_key,
            region: credentials.AWS_REGION
        });
        console.log("S3 config");
        this.upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: 'bucket-e-photo-app-sw1',
                acl: 'public-read',
                metadata: function (req, file, cb) {
                    cb(null, { fieldName: file.fieldname });
                },
                key: function (req, file, cb) {
                    var re = /(?:\.([^.]+))?$/;
                    cb(null, uuidv4() + '.' + re.exec(file.originalname)[1]);
                }
            })
        })
        console.log("S3 uploaded", this.upload);
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Imports Routes HTTP implemented in this Rest-API
     */
    routes() {
        this.app.use('/api/auth', AuthRouter);
        this.app.use('/api/user_photographer_manage', UserPhotographerRouter);
        this.app.use('/api/user_organizer_manage', UserOrganizerEventRouter);
        this.app.use('/api/photo_studio', RouterPhotoStudio);
        this.app.use('/api/event_manage', RouterEvent);
        this.app.use('/api/photography_manage', RouterPhotography);
        this.app.post('/upload', this.upload.array('photos'), async function (req, res) {
            console.log("data:_", req.files);
            res.status(200).json({
                list_photos_name: req.files[0].key
            });
        });
        this.app.use('/api/sale_note_manage', RouterSaleNote);
        this.app.use(errorHandler);
        this.app.use((req, res, next) => {
            res.status(404).json({ error: 'error 404' });
        });
    }

    /**
     * Function enables {port} on service this backend for listen
     * @param port
     * @returns {Promise<void>}
     */
    async listen(port) {
        this.app.set('port', port);
        // Execute Middlewares
        this.middlewares();
        // Listen routes of the Rest API
        this.routes();
        // Initialize port Rest API
        await this.app.listen(this.app.get('port'));
        console.log(`Server on port ${this.app.get('port')}`);
    }
}