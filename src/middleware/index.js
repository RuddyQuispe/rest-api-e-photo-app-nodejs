import { verifyToken, isPhotographerUser } from './authjwt';

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}

export { verifyToken, errorHandler ,isPhotographerUser}