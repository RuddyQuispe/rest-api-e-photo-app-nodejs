import express from 'express';

export class App {
    constructor() {
        this.app=express();
    }

    async listen(port){
        this.app.set('port', port);
        await this.app.listen(this.app.get('port'));
        console.log(`Server on port ${this.app.get('port')}`);
    }
}