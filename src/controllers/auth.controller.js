import jwt from 'jsonwebtoken'
import { userPhotographer } from '../api/user_management_guest_event_photographer/models/user_photographer.model';
import { userOrganizerEvent } from '../api/user_management_guest_event_photographer/models/user_organizer_event.model'
import { Encrypt } from '../libs/encrypt';
import config from '../config';

export class AuthController {

    /**
     * Request POST: sign up create new account
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async signUp(req, res) {
        const { type_user } = req.params;
        if (parseInt(type_user) === 1) {
            // Create account user photographer
            const { name, email, password, id_studio } = req.body;
            const resultNewAccount = await userPhotographer.getLoginUserData(email);
            if (resultNewAccount) {
                res.json({
                    message: `User ${name} or email: ${email} does exists as photographer`
                });
            } else {
                const passwordCifrate = await Encrypt.encryptPassword(password);
                const codeUser = await userPhotographer.createUserPhotographer(name, email, passwordCifrate, id_studio);
                if (codeUser > 0) {
                    console.log("new code photographer user", codeUser);
                    const token = jwt.sign({ id: codeUser }, config.SECRET, {
                        expiresIn: 86400    // 24 hours
                    });
                    res.json({
                        message: `Account Photographer user created succesfully`,
                        token
                    });
                }
            }
        } else if (parseInt(type_user) === 0) {
            // create account user event organizer
            const { name, phone, email, password } = req.body;
            const resultNewAccount = await userOrganizerEvent.getLoginUserData(email);
            if (resultNewAccount) {
                res.json({
                    message: `User ${name} or email: ${email} does exists as organizer user`
                });
            } else {
                const passwordCifrate = await Encrypt.encryptPassword(password);
                const codeUser = await userOrganizerEvent.createUserOrganizerEvent(name, phone, email, passwordCifrate);
                if (codeUser > 0) {
                    console.log("new code user organizer", codeUser);
                    const token = jwt.sign({ id: codeUser }, config.SECRET, {
                        expiresIn: 86400    // 24 hours
                    });
                    res.json({
                        message: `Account Organizer Event user created succesfully`,
                        token
                    });
                }
            }
        } else {
            res.status(401).send("You lose");
        }
    }

    /**
     * Request POST: sign in session to input system
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async signIn(req, res) {
        const { email, password } = req.body;
        let userAccount = await userPhotographer.getLoginUserData(email);
        // if not user photographer ?
        if (!userAccount) {
            userAccount = await userOrganizerEvent.getLoginUserData(email);
            // if not user organizer event
            if (!userAccount) {
                res.status(200).json({ message: `User not found` });
            } else {
                // is user organizer event
                const matchPassword = await Encrypt.comparePassword(password, userAccount.password);
                if (!matchPassword) {
                    res.status(401).json({ token: null, message: `invalid password` });
                } else {
                    const token = jwt.sign({ id: userAccount.code }, config.SECRET, {
                        expiresIn: 86400
                    });
                    res.json({ token, message: `welcome` });
                }
            }
        } else {
            // is user photographer
            const matchPassword = await Encrypt.comparePassword(password, userAccount.password);
            if (!matchPassword) {
                res.status(401).json({ token: null, message: `invalid password` });
            } else {
                const token = jwt.sign({ id: userAccount.code }, config.SECRET, {
                    expiresIn: 86400
                });
                res.json({ token, message: `welcome` });
            }
        }
    }
}