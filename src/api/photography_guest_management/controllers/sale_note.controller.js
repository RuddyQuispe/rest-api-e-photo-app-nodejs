import { guest } from '../../photography_guest_management/models/guest_manage.model';
import { saleDetail } from '../models/sale_detail.model';
import { saleNote } from '../models/sale_note.model';

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