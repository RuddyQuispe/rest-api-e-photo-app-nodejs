import connectionDB from '../../../config/database';

class SocialNetwork {

    constructor() {
        console.log("initialize Social Network Model");
    }

    /**
     * Get List 
     */
    async getListSocialNetwrok() {
        try {
            const listSocial = await connectionDB.query(`select id, description from social_network`);
            return listSocial.rows;
        } catch (error) {
            console.log("Error in getListSocialNetwrok()", error);
            return null;
        }
    }
}

const socialNetwork = new SocialNetwork();

export const listSocial = socialNetwork.getListSocialNetwrok();