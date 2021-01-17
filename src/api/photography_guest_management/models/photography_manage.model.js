import connectionDB from '../../../config/database';

class Photography {
    constructor() {
        console.log("Initialize Photography Model");
    }

    /**
     * get list photography contains
     * @param {integer} code : code event contains photographies
     * @returns
     */
    async getListPhotographiesAndOwnerEvent(code) {
        try {
            const response = await connectionDB.query(`select p.id, p."name" as photo_name, p.price, pu."name", pu.email, array(select (id_social, description)::text from photo_social where code_photographer=pu.code) from photography p, "event" e, photographer_user pu where e.code=p.code_event and p.code_photographer=pu.code and e.code=p.code_event and e.code=${code}`);
            // console.log(response.rows);
            return response.rows;
        } catch (error) {
            console.log("Error in getListPhotographiesAndOwnerEvent(code)", error);
            return null;
        }
    }

    /**
     * return names photos
     * @param {list[int]} listPhotography : list id photos
     * @returns : list names photos
     */
    async getListPurchaseGuest(listPhotography){
        try {
            const response = await connectionDB.query(`select p.id, p."name", pu."name" as photographer from photography p, photographer_user pu where pu.code=p.code_photographer and p.id in (${listPhotography})`);
            return response.rows;
        } catch (error) {
            console.log("Error in method getListPurchaseGuest(listPhotography)", error);
            return null;
        }
    }
}

export const photography = new Photography();