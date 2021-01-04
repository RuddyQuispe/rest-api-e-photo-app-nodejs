import connectionDB from '../../../config/database';

class StudioSocial {

    constructor(){
        console.log("Initialize Studio Social Model");
    }

    /**
     * add social network
     * @param {integer} idSocial : id social network
     * @param {integer} idStudio : code user
     * @param {string} description : link social
     */
    async addSocialNetwork(idSocial, idStudio, description){
        try {
            await connectionDB.query(`insert into studio_social(id_social, id_studio, description) values (${idSocial},${idStudio},'${description}')`);
            return true;
        } catch (error) {
            console.log("Error in addSocialNetwork(idSocial, idStudio, description)", error);
            return false;
        }
    }

}

export const studioSocial = new StudioSocial();