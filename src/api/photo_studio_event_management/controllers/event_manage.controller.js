import { userOrganizerEvent } from "../../user_management_guest_event_photographer/models/user_organizer_event.model";
import { eventModel } from "../models/event.model";
import { photoStudio } from "../models/photo_studio.model";
import QRCode from 'qrcode';


export class EventController {

    /**
     * Get list options for register new event
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async getEventRegister(req, res) {
        const { email_owner } = req.params;
        const list_event = await eventModel.getListEventOfOrganizerUser(email_owner);
        const photoStudioList = await photoStudio.getStudioOptions();
        res.status(200).json({ 
            photo_studio_options: photoStudioList, 
            list_event: list_event 
        });
    }

    /**
     * Get list event of the photo studio
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async getEventContainsStudio(req, res) {
        const { email_photograph } = req.params;
        const list_event_studio = await eventModel.getListEventPhotoStudio(email_photograph);
        res.status(200).json(list_event_studio);
    }

    /**
     * Enable 
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async enableEvent(req, res) {
        const { code } = req.params;
        if (await eventModel.enableEvent(code)) {
            const dataEvent = await eventModel.getEventData(code);
            console.log(dataEvent);
            // await QRCode.toFile('./qr.png', JSON.stringify(dataEvent), { color: { dark: '#000000', light: '#0000' } });
            const QR = await QRCode.toDataURL(JSON.stringify(dataEvent));
            res.send(`<img src="${QR}">`);
        } else {
            res.status(200).json({ message: "Error in enable event" });
        }
    }

    /**
     * Register event but not acepted
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async registerNewEvent(req, res) {
        const { description, date_event, location, id_photo_studio, email_user } = req.body;
        const idOrganizerUser = await userOrganizerEvent.getLoginUserData(email_user);
        console.log("ID", idOrganizerUser);
        if (idOrganizerUser.id) {
            const codeEvent = await eventModel.registerNewEvent(description, date_event, location, id_photo_studio, idOrganizerUser.id);
            if (codeEvent > 0) {
                res.status(200).json({ message: `register event succesfully. code: ${codeEvent}`, code_event: codeEvent })
            } else {
                res.status(200).json({ message: "Error in register event" });
            }
        } else {
            res.status(200).json({ message: "Error in register event, user doesn't exists" });
        }
    }
}