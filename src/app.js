import express from 'express';
import {sequelize} from './config/database';

export class App {
    constructor() {
        this.app=express();
    }

    async testDatabase(){
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    async listen(port){
        this.app.set('port', port);
        await this.testDatabase();
        await this.app.listen(this.app.get('port'));
        console.log(`Server on port ${this.app.get('port')}`);
    }
}