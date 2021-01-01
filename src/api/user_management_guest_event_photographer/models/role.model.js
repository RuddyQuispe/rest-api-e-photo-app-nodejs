import connectionDB from "../../../config/database";

export class Role {}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    sequelize,
    freezeTableName: true,
    modelName: 'role',
});

/**
 * Apply synchronize with model-sql table
 * @returns {Promise<void>}
 */
async function synchronize(){
    await Role.sync();
    console.log(`The table for the ${Role.getTableName()} model was just (re)created!`);
}

synchronize();