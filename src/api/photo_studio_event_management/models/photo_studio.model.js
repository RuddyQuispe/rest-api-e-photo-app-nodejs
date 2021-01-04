import connectionDB from '../../../config/database';

class PhotoStudio {
    
    constructor(){
        console.log("initialized Photo Studio Model");
    }

    /**
     * Get list of the photo studio existent
     */
    async getListPhotoStudio(){
        try {
            const listStudio = await connectionDB.query(`select id, "name", address, array(select (ss.id_social ,ss.description)::text from studio_social ss where ss.id_studio=id) from photo_studio`);
            return listStudio.rows;
        } catch (error) {
            console.log("Erro in getListPhotoStudio()", error);
            return null;
        }
    }

    /**
     * register photo studio
     * @param {string} name : name photostudio
     * @param {string} address : address location (latitude, logitude)
     */
    async registerPhotoStudio(name, address){
        try {
            const result = await connectionDB.query(`insert into photo_studio("name", address) values ('${name}','${address}')returning id`);
            return result.rows[0].id;
        } catch (error) {
            console.log("Error in registerPhotoStudio(name, address)", error);
            return -1;
        }
    }
}

export const photoStudio = new PhotoStudio();