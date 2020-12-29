import {sequelize} from "../../../config/database";
import {DataTypes, Model} from 'sequelize';

export class UserPhotographer extends Model {}

UserPhotographer.init({
    code: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    sequelize,
    freezeTableName: true,
    modelName: 'photographer_user',
});

/**
 * Apply synchronize with model-sql table
 * @returns {Promise<void>}
 */
async function synchronize(){
    await UserPhotographer.sync();
    console.log(`The table for the ${UserPhotographer.getTableName()} model was just (re)created!`);
}

synchronize();