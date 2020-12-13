import dataConnection from "./config";
import Sequelize from "sequelize";

export const sequelize = new Sequelize(dataConnection.database, dataConnection.user, dataConnection.passwd, {
    host: dataConnection.host,
    dialect: dataConnection.dialect,
    logging : (msg) => console.log(msg)
});
