import connectionDB from '../../../config/database';

class EventModel {
    constructor(){
        console.log("INitialize Event Model");
    }

    /**
     * return list event organizer account
     * @param {string} emailPhotographer : email account photographer
     */
    async getListEventPhotoStudio(emailPhotographer){
        try {
            const response = await connectionDB.query(`select e.code, e.description, e.date_event, e.status_request, eou."name", ps."name" as studio_name
            from event_organizer_user eou, "event" e, photo_studio ps, photographer_user pu 
            where eou.id=e.id_event_organizer_user and e.id_photo_studio=ps.id and ps.id=pu.id_studio and pu.email='${emailPhotographer}'`);
            return response.rows;
        } catch (error) {
            console.log("Error in getListEventPhotoStudio(emailPhotographer)", error);
            return null;
        }
    }

    /**
     * return list event registered owner user
     * @param {string} emailOwnerOrganizerUser : email account user organizer event
     */
    async getListEventOfOrganizerUser(emailOwnerOrganizerUser){
        try {
            const response = await connectionDB.query(`select code, description, date_event, "location", status_request, ps."name" as studio_name from "event" e, event_organizer_user eou, photo_studio ps where e.id_photo_studio=ps.id and e.id_event_organizer_user=eou.id and eou.email='${emailOwnerOrganizerUser}'`);
            return response.rows;
        } catch (error) {
            console.log("Error in getListEventOfOrganizerUser(emailOwnerOrganizerUser)", error);
            return null;
        }
    }

    /**
     * return event details
     * @param {integer} codeEvent : code event
     */
    async getEventData(codeEvent){
        try {
            const response = await connectionDB.query(`select code, description, date_event, "location", status_request, eou."name" as event_owner, ps."name" as studio_name from "event" e, event_organizer_user eou, photo_studio ps where e.id_photo_studio=ps.id and e.id_event_organizer_user=eou.id and e.code=${codeEvent}`);
            return response.rows[0];
        } catch (error) {
            console.log("Error in getListEvent()", error);
            return null;
        }
    }

    /**
     * enable event for load photos
     * @param {integer} codeEvent : event code identifier
     */
    async enableEvent(codeEvent){
        try {
            await connectionDB.query(`update "event" set status_request=true where code=${codeEvent}`);
            return true;
        } catch (error) {
            console.log("Error in enableEvent(codeEvent)", error);
            return false;
        }
    }

    /**
     * 
     * @param {string} description : description event
     * @param {date} date_event : date event
     * @param {string} location : address
     * @param {integer} id_photo_studio : id photo studio 
     * @param {integer} id_user_organizer : id organizer owner
     */
    async registerNewEvent(description, date_event, location, id_photo_studio, id_user_organizer){
        try {
            console.log("Initialize");
            const response = await connectionDB.query(`insert into "event"(description,date_event,"location",status_request,id_event_organizer_user,id_photo_studio) values ('${description}', '${date_event}','${location}',false,${id_user_organizer},${id_photo_studio}) returning code`);
            console.log("Initialize", response);
            return response.rows[0].code;
        } catch (error) {
            console.log("Error in registerNewEvent(code, description, date_event, location, id_photo_studio, email_user)", error);
            return -1;
        }
    }
    
}

export const eventModel = new EventModel();