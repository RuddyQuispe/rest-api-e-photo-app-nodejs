import connectionDB from '../../../config/database';

class Photography {
    constructor() {
        console.log("Initialize Photography Model");
    }

    /**
     * register photo in event
     * @param {string} image : image name
     * @param {double} price : price photo
     * @param {integer} codeEvent : code event
     * @param {int} codeUserPhotographer : code user
     * @returns int
     */
    async uploadPhotoToEvent(image, price, codeEvent, codeUserPhotographer){
        try {
            const response = await connectionDB.query(`insert into photography("name",price,code_event,code_photographer) values ('${image}', cast(${price} as decimal(10,2)), ${codeEvent}, ${codeUserPhotographer}) returning id`);
            return response.rows[0].id;
        } catch (error) {
            console.log("Error in method uploadPhotoToEvent(image, price, codeEvent, codeUserPhotographer)", error);
            return -1;
        }
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

    /**
     * get list photos picked in a event
     * @param {int} codeEvent : code event
     * @returns
     */
    async getListPhotographyOfEvent(codeEvent){
        try {
            const response = await connectionDB.query(`select "name" from photography p where code_event=${codeEvent}`);
            return response.rows;
        } catch (error) {
            console.log("Error in method getListPhotographyOfEvent(codeEvent)", error);
            return null;
        }
    }
}

export const photography = new Photography();