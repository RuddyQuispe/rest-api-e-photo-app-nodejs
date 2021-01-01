import jwt from 'jsonwebtoken';
import config from '../config';
import { userPhotographer } from '../api/user_management_guest_event_photographer/models/user_photographer.model';
// verify  si viene token o si es un rol 1 rol 2

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        console.log(token);
        if (!token) {
            return res.status(403).json({ message: `Not token provided` });
        } else {
            const decoded = jwt.verify(token, config.SECRET);
            const user = await userPhotographer.getDataUserPhotographer(decoded.id);
            if (!user) {
                return res.status(404).json({ message: `not user found` });
            }else{
                // verify user event organizer
            }
        }
        next();
    } catch (error) {
        console.log("Error is method verifyToken()", error);
        return res.status(500).json({ message: `Unauthorized`});
    }
}

export const isPhotographerUser = async (req, res, next) => {
    try {
        const user = await userPhotographer.getDataUserPhotographer(req.userId)
        if (user) {
            next();
            return;
        }
        return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
        console.log("Error in isPhotographerUser() tokens",error);
        return res.status(500).send({ message: error });
    }
}