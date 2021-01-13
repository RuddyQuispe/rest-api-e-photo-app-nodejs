import connectionDB from '../../../config/database';

class Guest {
    constructor() {
        console.log("Initialize Guest Model");
    }

    async getDataLogin(email) {
        try {
            const response = await connectionDB.query(`select id, name, email, phone, password from guest_user where email='${email}'`);
            console.log(response.rows);
            return response.rows[0];
        } catch (error) {
            console.log("Error in getDataLogin(email)", error);
            return null;
        }
    }

    async createNewUserGuest(name, email, phone, password, photo_1, photo_2, photo_3) {
        try {
            const response = await connectionDB.query(`insert into guest_user("name",email,phone,"password",photo_1,photo_2,photo_3) values ('${name}','${email}','${phone}','${password}','${photo_1}','${photo_2}','${photo_3}') returning id`);
            return response.rows[0].id;
        } catch (error) {
            console.log("Error in createNewUserGuest(name, email, phone, password, photo_1, photo_2, photo_3)", error);
            return -1;
        }

    }
}

export const guest = new Guest();