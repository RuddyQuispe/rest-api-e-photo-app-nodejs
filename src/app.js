import express from 'express';
import morgan from "morgan";
import cors from 'cors';
import './config/database';
import { errorHandler } from './middleware/index';
/**
 * Import Routes
 */
import { UserPhotographerRouter, UserOrganizerEventRouter } from './api/user_management_guest_event_photographer/routes/';
import { RouterEvent, RouterPhotoStudio } from './api/photo_studio_event_management/routes/index';
import AuthRouter from './routes/auth.routes'
import {RouterPhotography, RouterSaleNote} from './api/photography_guest_management/routes';

/**
 * Main object, it's initialize to rest-api server
 */
export class App {
    /**
     * initialize expressjs framework
     */
    constructor() {
        this.app = express();
    }

    /**
     * function storage process and run before of any http request
     * first running functions storage in middlewares
     * last running http request
     */
    middlewares() {
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