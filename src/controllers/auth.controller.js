import { Op } from 'sequelize';
import jwt from 'jsonwebtoken'
import { UserPhotographer } from '../api/user_management/models/user_photographer.model';
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
        const { name, email, phone, password } = req.body;
        // Verify exists account
        const { count } = await UserPhotographer.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: name },
                    { email: email }
                ]
            }
        });
        console.log("count: ", count, count > 0);
        if (count > 0) {
            // Not exists
            res.json({
                message: `User ${name} or email: ${email} does exists`
            });
        } else {
            // Yes exists
            const passwordCifrate = await Encrypt.encryptPassword(password);
            const codeUserPhotographer = await UserPhotographer.create({
                name,
                email,
                phone,
                password: passwordCifrate
            });
            const {code} = await codeUserPhotographer.save();
            console.log("result: ", code);
            // generate token
            const token = jwt.sign({id: code}, config.SECRET,{
                expiresIn : 86400    // 24 hours
            });

            res.json({
                message: `Account Photographer user created succesfully`,
                token
            });
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
        const userAccount = await UserPhotographer.findOne({
            where: {
                email
            }
        });
        if (!userAccount) {
            res.status(200).json({message: `user not found`});
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