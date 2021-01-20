import connectionDB from '../../../config/database';

class Guest {
    constructor() {
        console.log("Initialize Guest Model");
    }

    async getDataLogin(email) {
        try {
            const response = await connectionDB.query(`select id, name, email, phone, photo_1, photo_2, photo_3, password from guest_user where email='${email}'`);
            console.log(response.rows);
            return response.rows[0];
        } catch (error) {
            console.log("Error in getDataLogin(email)", error);
            return null;
        }
    }

    /**
     * create account user guest of the app movil
     * @param {string} name : name guest user
     * @param {string} email : email acccount
     * @param {string} phone : phone number
     * @param {string} password : passwd accoutn cifrate
     * @param {string} photo_1 name photo #1
     * @param {string} photo_2 name photo #2
     * @param {string} photo_3 name photo #3
     * @returns
     */
    async createNewUserGuest(name, email, phone, password, photo_1, photo_2, photo_3) {
        try {
            const response = await connectionDB.query(`insert into guest_user("name",email,phone,"password",photo_1,photo_2,photo_3) values ('${name}','${email}','${phone}','${password}','${photo_1}','${photo_2}','${photo_3}') returning id`);
            return response.rows[0].id;
        } catch (error) {
            console.log("Error in createNewUserGuest(name, email, phone, password, photo_1, photo_2, photo_3)", error);
            return -1;
        }

    }

    /**
     * get 3 photos profiles of the guest owner user
     * @param {string} emailGuest : email account
     * @returns
     */
    async getListPhotos(emailGuest){
        try {
            const response = await connectionDB.query(`select photo_1, photo_2, photo_3 from guest_user where email='${emailGuest}'`);
            return response.rows[0];
        } catch (error) {
            console.log("Error in getListPhotos(emailGuest)", error);
            return null;
        }
    }
}

export const guest = new Guest();