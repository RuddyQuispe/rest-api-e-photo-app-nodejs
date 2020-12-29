import jwt from 'jsonwebtoken';
import config from '../config';
import { UserPhotographer } from '../api/user_management/models/user_photographer.model';
// verify  si viene token o si es un rol 1 rol 2
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];
        console.log(token);
        if (!token) {
            return res.status(403).json({ message: `Not token provided` });
        } else {
            const decoded = jwt.verify(token, config.SECRET);
            const user = await UserPhotographer.findOne({
                where: {
                    code: decoded.id
                }
            })
            if (!user) {
                return res.status(404).json({ message: `not user found` });
            }

        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Unauthorized`});
    }
}

export const isAdmin = async (req, res, next) => {
    //BUscar y verificar si es admin
    // res.status(403).json({message: require moderator role});
    console.log("is admin?");
    next();
}