import jwt from 'jsonwebtoken'
import { userPhotographer } from '../api/user_management_guest_event_photographer/models/user_photographer.model';
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
        const {type_user} = req.params;
        if (type_user) {
            // Create account user photographer
            const { name, email, password, id_studio } = req.body;
            const resultNewAccount = await userPhotographer.getLoginUserData(email);
            if (resultNewAccount) {
                res.json({
                    message: `User ${name} or email: ${email} does exists`
                });
            }else{
                const passwordCifrate = await Encrypt.encryptPassword(password);
                if (await userPhotographer.createUserPhotographer(name, email, passwordCifrate, id_studio)) {
                    const token = jwt.sign({id: code}, config.SECRET,{
                        expiresIn : 86400    // 24 hours
                    });
        
                    res.json({
                        message: `Account Photographer user created succesfully`,
                        token
                    });
                }
            }
        }else{
            //create account user event orgnaizer
            res.send("create account user organizer event");
        }
    }

    /**
     * Request POST: sign in session to input system
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    static async signIn(req, res) {
        const {email, password} = req.body;
        const userAccount = await userPhotographer.getLoginUserData(email);
        if (!userAccount) {
            res.status(200).json({message: `User not found`});
        }else{
            const matchPassword = await Encrypt.comparePassword(password, userAccount.password);
            if (!matchPassword) {
                res.status(401).json({token: null, message: `invalid password`});
            }else{
                const token = jwt.sign({id: userAccount.code}, config.SECRET,{
                    expiresIn: 86400
                });
                res.json({token, message: `welcome`});
            }
        }
    }
}