import { guest } from '../../photography_guest_management/models/guest_manage.model';
import { saleDetail } from '../models/sale_detail.model';
import { saleNote } from '../models/sale_note.model';
import { sendMail } from '../../../services/email/email'
import { photography } from '../models/photography_manage.model';

export class SaleNoteController {

    /**
     * register sale note
     * @param {Request} req : HTTP
     * @param {Response} res : HTTP
     */
    static async registerSaleNote(req, res) {
        const { list_photography, email_guest, total_cost } = req.body;
        const userData = await guest.getDataLogin(email_guest);
        const noSaleNote = await saleNote.createSaleNote(userData.id, total_cost);
        if (await saleDetail.registerPhotographyList(list_photography, noSaleNote)) {
            console.log("registered purchase successfully");
            const listPhotoNames = await photography.getListPurchaseGuest(list_photography);
            let listPhotosLink = `<div style="background: #56CCF2;  /* fallback for old browsers */
            background: -webkit-linear-gradient(to right, #2F80ED, #56CCF2);  /* Chrome 10-25, Safari 5.1-6 */
            background: linear-gradient(to right, #2F80ED, #56CCF2); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */"><b>Purchase App Movil E-photo App</b><br>`;
            for (let index = 0; index < listPhotoNames.length; index++) {
                listPhotosLink+=`<a href="https://bucket-e-photo-app-sw1.s3.amazonaws.com/${listPhotoNames[index].name}" style="color:blue">https://bucket-e-photo-app-sw1.s3.amazonaws.com/${listPhotoNames[index].name}</a> - Author: ${listPhotoNames[index].photographer}<br>`
            }
            listPhotosLink+=`</div>`;
            await sendMail(email_guest, "Purchase Photography", listPhotosLink);
            res.status(200).json({
                message: `Sale note #${noSaleNote}, registered succesffully`
            })
        } else {
            console.log("i have a problems to register purchase sale note");
            res.status(200).json({
                message: `I have a problems to register purchase, call to administration`
            })
        }
    }
}