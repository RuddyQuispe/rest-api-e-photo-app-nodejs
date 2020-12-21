import {sequelize} from "../../../config/database";
import {DataTypes, Model} from 'sequelize';

export class User extends Model {}

User.init({
    id: {
        type: DataTypes.TEXT,
        primaryKey: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(8),
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
},{
    sequelize,
    freezeTableName: true,
    modelName: 'user',
});

/**
 * Apply synchronize with model-sql table
 * @returns {Promise<void>}
 */
async function synchronize(){
    await User.sync();
    console.log(`The table for the ${User.getTableName()} model was just (re)created!`);
}

synchronize();