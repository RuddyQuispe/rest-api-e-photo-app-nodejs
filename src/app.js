import express from 'express';
import morgan from "morgan";
import {sequelize} from './config/database';
import {errorHandler} from './middleware/index';

/**
 * Import Routes
 */
import {UserPhotographerRouter, RoleRouter} from './api/user_management/routes/index';
import AuthRouter from './routes/auth.routes'

/**
 * Main object, it's initialize to rest-api server
 */
export class App {
    /**
     * initialize expressjs framework
     */
    constructor() {
        this.app=express();
    }

    /**
     * function for testing connection to database
     * sequelize object is src/config/database.js
     * @returns {Promise<void>}
     */
    async testDatabase(){
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    /**
     * function storage process and run before of any http request
     * first running functions storage in middlewares
     * last running http request
     */
    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    /**
     * Imports Routes HTTP implemented in this Rest-API
     */
    routes(){
        this.app.use('/api/auth', AuthRouter);
        this.app.use('/api/user_photographer_manage', UserPhotographerRouter);
        this.app.use('/api/role_manage', RoleRouter);
        this.app.use(errorHandler);
        this.app.use((req, res, next)=>{
            res.status(404).json({error: 'error 404'});
        });
    }

    /**
     * Function enables {port} on service this backend for listen
     * @param port
     * @returns {Promise<void>}
     */
    async listen(port){
        this.app.set('port', port);
        // Execute Middlewares
        await this.middlewares();
        // Testing Connection SQL database
        await this.testDatabase();
        // Listen routes of the Rest API
        await this.routes();
        // Initialize port Rest API
        await this.app.listen(this.app.get('port'));
        console.log(`Server on port ${this.app.get('port')}`);
    }
}