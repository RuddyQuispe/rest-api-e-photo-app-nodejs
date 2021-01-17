import { Router } from 'express';
import { SaleNoteController } from '../controllers/sale_note.controller';

const router = Router();

router.post(`/register_sale_note_guest`, SaleNoteController.registerSaleNote);

export default router;