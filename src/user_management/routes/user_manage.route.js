import {Router} from 'express';

const router = Router();

router.get('/user_manage', (req, res) => {
    res.send('Hola Ruddy')
});

export default router;