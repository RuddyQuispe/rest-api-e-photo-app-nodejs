import connectionDB from "../../../config/database";

class UserOrganizerEvent {
    constructor() {
        console.log("Initialize UserOrganizerEvent Model");
    }

    /**
     * Get list User Organizer event
     */
    async getListUserOrganizerEvent() {
        try {
            const userOrganizerEventList = await connectionDB.query(`select id, "name", phone, email, status from event_organizer_user`);
            return userOrganizerEventList.rows;
        } catch (error) {
            console.error("Error in getListUserOrganizerEvent()", error);
            return null;
        }
    }

    /**
     * Get data specified user organizer event
     * @param {integer} id : id organizer event user
     */
    async getDataUserOrganizerEvent(id) {
        try {
            const userOrganizerEventData = await connectionDB.query(`select id, "name", phone, email, status from event_organizer_user where id=${id}`);
            return userOrganizerEventData.rows[0];
        } catch (error) {
            console.error("Error in getDataUserOrganizerEvent(id)", error);
            return null;
        }
    }

    /**
     * return data user organizer event for login system
     * @param {string} email : email user login
     */
    async getLoginUserData(email) {
        try {
            const userOrganizerEventLogin = await connectionDB.query(`select id, "name", phone, email, "password" from event_organizer_user where status and email='${email}'`);
            return userOrganizerEventLogin.rows[0];
        } catch (error) {
            console.error("Error in getLoginUserData()", error);
            return null;
        }
    }

    /**
     * create account user organizer event
     * @param {string} name 
     * @param {string} phone
     * @param {string} password 
     * @param {string} email 
     */
    async createUserOrganizerEvent(name, phone, email, password) {
        try {
            const result = await connectionDB.query(`insert into event_organizer_user("name", phone, email, "password", status) values ('${name}', '${phone}', '${email}', '${password}', true)returning id;`);
            return result.rows[0].id;
        } catch (error) {
            console.error("Error in createUserOrganizerEvent(name, email, password, idStudio)", error);
            return -1;
        }
    }
}

export const userOrganizerEvent = new UserOrganizerEvent();