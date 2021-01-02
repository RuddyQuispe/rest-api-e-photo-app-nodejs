import jwt from 'jsonwebtoken'
import { userPhotographer } from '../api/user_management_guest_event_photographer/models/user_photographer.model';
import { userOrganizerEvent } from '../api/user_management_guest_event_photographer/models/user_organizer_event.model'
import { Encrypt } from '../libs/encrypt';
import { sendMail } from '../services/email/email';
import config from '../config';

let keyLogger = new Array();

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

    /**
     * generate key and send email for restore account
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async restoreAccount(req, res) {
        try {
            const { email, type } = req.body;
            if (type) {
                // type = true -> user photographer
                const user = await userPhotographer.getLoginUserData(email);
                if (!user.code) {
                    const numRandom = parseInt(Math.floor((Math.random() * 999999) + 111111), 16);  //Generate Key Randomize for confirm code
                    const key = numRandom.toString(15);
                    keyLogger.push({
                        email,
                        key,
                        type
                    });
                    contentHTML = `
                    <div style="width:75%; margin:0px auto;">
                        <div style="display:table-cell; vertical-align:middle; text-align: center;">
                            <div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; border-radius: 5px; background: #373B44;  /* fallback for old browsers */
                        background: -webkit-linear-gradient(to left, #4286f4, #373B44);  /* Chrome 10-25, Safari 5.1-6 */
                        background: linear-gradient(to left, #4286f4, #373B44); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                        ">
                                <img src="http://ec2-54-232-175-236.sa-east-1.compute.amazonaws.com/img/logo_oficial.png"
                                    alt="Logo Technical Support" style="border-radius: 5px 5px 0 0;">
                                <div style="padding: 2px 16px;" style="color: whitesmoke;">
                                    <h2 style="color: whitesmoke;">Usuario E-photo-App</h2>
                                    <h3 style="color: whitesmoke;">Estimado usuario<br>
                                        Este es una llave de seguridad: <b style="color: yellow;">${key}</b>
                                        <a style="color: greenyellow;" href="http://${req.headers.host}/confirm_key">Porfavor sigue este
                                            enlace para recuperar tu cuenta</a>
                                        gracias. <br>
                                        No respondas a este email, es un boot.
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    const info = await sendMail(email, 'Restore Account E-Photo-App', contentHTML);
                    console.log('status email sent:', info);
                    res.status(200).json({
                        message: "sended email restore successfully"
                    })
                } else {
                    res.status(200).json({
                        message: `Error! you email or account not exists.`
                    });
                }
            }else{
                // type = false -> user organizer event
                const user = await userOrganizerEvent.getLoginUserData(email);
                if (!user.code) {
                    const numRandom = parseInt(Math.floor((Math.random() * 999999) + 111111), 16);  //Generate Key Randomize for confirm code
                    const key = numRandom.toString(15);
                    keyLogger.push({
                        email,
                        key,
                        type
                    });
                    contentHTML = `
                    <div style="width:75%; margin:0px auto;">
                        <div style="display:table-cell; vertical-align:middle; text-align: center;">
                            <div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; border-radius: 5px; background: #373B44;  /* fallback for old browsers */
                        background: -webkit-linear-gradient(to left, #4286f4, #373B44);  /* Chrome 10-25, Safari 5.1-6 */
                        background: linear-gradient(to left, #4286f4, #373B44); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
                        ">
                                <img src="http://ec2-54-232-175-236.sa-east-1.compute.amazonaws.com/img/logo_oficial.png"
                                    alt="Logo Technical Support" style="border-radius: 5px 5px 0 0;">
                                <div style="padding: 2px 16px;" style="color: whitesmoke;">
                                    <h2 style="color: whitesmoke;">Usuario E-photo-App</h2>
                                    <h3 style="color: whitesmoke;">Estimado usuario<br>
                                        Este es una llave de seguridad: <b style="color: yellow;">${key}</b>
                                        <a style="color: greenyellow;" href="http://${req.headers.host}/confirm_key">Porfavor sigue este
                                            enlace para recuperar tu cuenta</a>
                                        gracias. <br>
                                        No respondas a este email, es un boot.
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    const info = await sendMail(email, 'Restore Account E-Photo-App', contentHTML);
                    console.log('status email sent:', info);
                    res.status(200).json({
                        message: "sended email restore successfully"
                    })
                } else {
                    res.status(200).json({
                        message: `Error! you email or account not exists.`
                    });
                }
            }
        } catch (error) {
            console.log("Error in restore account restoreAccount()", error);
            res.status(401).json({
                message: "Error in process restore account"
            });
        }
    }

    /**
     * confirm key for restor account
     * @param {Request} req : http
     * @param {REsponse} res : http
     */
    static async postConfirmKey (req, res) {
        const { key, email } = req.body;
        for (let index = 0; index < keyLogger.length; index++) {
            if (await key === keyLogger[index].key && email===keyLogger[index].email) {
                keyLogger[index].key = "#$%%$#";
                res.status(200).json({
                    message: "Done"
                });
                return;
            }
        }
        res.status(200).json({message: 'Erroneous key or email incorrect, we already called the police. runs!'});
    }

    /**
     * verify password and change password
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async postVerifyPasswd (req, res) {
        const { password, password_retype, email } = req.body;
        try {
            // Search email unlocked for restore account
        for (let index = 0; index < keyLogger.length; index++) {
            if (keyLogger[index].key === "#$%%$#" && keyLogger[index].email === email) {
                // if unlocked
                // compare password equals and unlocked email
                if (password === password_retype) {
                    const hash = await Encrypt.encryptPassword(password);
                    // if user photographer
                    let idUser;
                    if (keyLogger[index].type) {
                        idUser = await userPhotographer.changePasswordUser(idUser.code, hash);
                    }else{
                        // if organizer event user 
                        idUser = await userOrganizerEvent.changePasswordUser(idUser.id, hash);
                    }
                    // externalLibrary.updatePassword(idUser, hash);
                    res.status(200).json({message: `new password change successfully`});
                } else {
                    res.status(200).json({message: `The password does not match or ${email} doesn't not validated.`});
                }
            }
        }
        } catch (error) {
            console.log("Error in postVerifyPasswd()", error);
            res.status(401).json({message: "Error in process backend."});
        }
    }
}