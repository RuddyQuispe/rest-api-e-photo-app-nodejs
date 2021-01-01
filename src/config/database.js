import dataConnection from "./config";
import {Pool} from 'pg'

/**
 * Initialize connection to database with sequelize
 * data info to connection in src/config/config.js
 */
class Connection {
    constructor(dataConnectionJson){
        try {
            this.pool = new Pool(dataConnectionJson);
            this.pool.connect();
            console.log("Connected to database succesffully");
        } catch (error) {
            console.error("Error in connection to database", dataConnectionJson, error);
        }
    }

    getCnnection(){
        return this.pool;
    };
}

const connection = new Connection(dataConnection);
export default connection.getCnnection();