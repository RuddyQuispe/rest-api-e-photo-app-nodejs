import jwt from 'jsonwebtoken';
import config from '../config';
import { userPhotographer } from '../api/user_management_guest_event_photographer/models/user_photographer.model';
import { userOrganizerEvent } from '../api/user_management_guest_event_photographer/models/user_organizer_event.model';
// verify  si viene token o si es un rol 1 rol 2

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        console.log(token);
        if (!token) {
            return res.status(403).json({ message: `Not token provided` });
        } else {
            const decoded = jwt.verify(token, config.SECRET);
            let user = await userPhotographer.getDataUserPhotographer(decoded.id);
            if (!user) {
                // if not user organizer event
                user = await userOrganizerEvent.getDataUserOrganizerEvent(decoded.id);
                if (!user) {
                    return res.status(404).json({ message: `not user found` });
                } else {
                    console.log("authenticated user organizer event");
                }
            } else {
                // if is user photographer
                console.log("authenticated user photographer");
            }
        }
        next();
    } catch (error) {
        console.log("Error is method verifyToken()", error);
        return res.status(500).json({ message: `Unauthorized` });
    }
}

export const isPhotographerUser = async (req, res, next) => {
    try {
        const user = await userPhotographer.getDataUserPhotographer(req.userId)
        if (user) {
            next();
            return;
        }
        return res.status(403).json({ message: "Require Photographer User Role!" });
    } catch (error) {
        console.log("Error in isPhotographerUser() tokens", error);
        return res.status(500).send({ message: error });
    }
}

export const isOrganizerEventUser = async (req, res, next) => {
    try {
        const user = await userOrganizerEvent.getDataUserOrganizerEvent(req.userId);
        if (user) {
            next();
            return;
        }
        return res.status(403).json({ message: "Require Organizer Event User Role!" });
    } catch (error) {
        console.log("Error in isOrganizerEventUser() tokens", error);
        return res.status(500).send({ message: error });
    }
}