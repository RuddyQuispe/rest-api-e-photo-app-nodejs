import dataConnection from "./config";
import Sequelize from "sequelize";

/**
 * Initialize connection to database with sequelize
 * data info to connection in src/config/config.js
 */
export const sequelize = new Sequelize(dataConnection.database, dataConnection.user, dataConnection.passwd, {
    host: dataConnection.host,
    dialect: dataConnection.dialect,
    logging : (msg) => console.log(msg)
});
