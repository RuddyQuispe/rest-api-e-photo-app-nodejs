import connectionDB from '../../../config/database';

class SaleDetail {
    constructor() {
        console.log("Initialize Sale Detail Model");
    }

    /**
     * register sale note details
     * @param {list[int]} listPhotographies : list photographies purchase
     * @param {int} noSale : sale note#
     * @returns boolean
     */
    async registerPhotographyList(listPhotographies, noSale){
        try {
            for (let index = 0; index < listPhotographies.length; index++) {
                await connectionDB.query(`insert into sale_detail(id_photo, no_sale) values (${listPhotographies[index]}, ${noSale})`);
            }
            return true;
        } catch (error) {
            console.log("Error in method registerPhotographyList(listPhotographies, noSale)", error);
            return false;
        }
    }
}

export const saleDetail = new SaleDetail();