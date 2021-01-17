import connectionDB from '../../../config/database';

class SaleNote {
    constructor() {
        console.log("Initialize Sale Note Model");
    }

    /**
     * get sale note
     * @param {double} totalCost : total cost of the purchase
     * @returns int
     */
    async createSaleNote(idGuest, totalCost){
        try {
            const response = await connectionDB.query(`insert into sale_note(id_guest, total_cost) values (${idGuest},cast(${totalCost} as decimal(10,2)))returning no_sale`);
            return response.rows[0].no_sale;
        } catch (error) {
            console.log("Error in createSaleNote(totalCost)", error);
            return -1;
        }
    }
}

export const saleNote = new SaleNote();