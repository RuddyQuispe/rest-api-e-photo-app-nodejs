import express from 'express';
import morgan from "morgan";
import {sequelize} from './config/database';
import errorHandler from './middleware/index';
import {main} from './services/email/email';

/**
 * Import Routes
 */
import {UserRouter, RoleRouter} from './api/user_management/routes/index';

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
            let mailerTest =  await main('smtp.gmail.com', 587, false, 'restteam.si@gmail.com', '11235813.restTeam.13853211', '"software 1" <foo@example.com>', 'zuleny.cr@gmail.com', 'Test 1 software', 'Test1 hello world');
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
        this.app.use('/user_manage', UserRouter);
        this.app.use('/role_manage', RoleRouter);
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
        await this.middlewares();
        await this.testDatabase();

        await this.routes();

        await this.app.listen(this.app.get('port'));
        console.log(`Server on port ${this.app.get('port')}`);
    }
}