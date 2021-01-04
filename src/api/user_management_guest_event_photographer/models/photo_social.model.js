import connectionDB from '../../../config/database';

class PhotoSocial {

    constructor(){
        console.log("Initialize Photo Social Model");
    }
    /**
     * add social network
     * @param {integer} idSocial : id social network
     * @param {integer} codePhotographer : id user
     * @param {string} description : link social
     */
    async addSocialNetwork(idSocial, codePhotographer, description){
        try {
            await connectionDB.query(`insert into photo_social(id_social, code_photographer, description) values (${idSocial},${codePhotographer},'${description}')`);
            return true;
        } catch (error) {
            console.log("Error in addSocialNetwork(idSocial, codePhotographer, description)", error);
            return false;
        }
    }

}

export const photoSocial = new PhotoSocial();