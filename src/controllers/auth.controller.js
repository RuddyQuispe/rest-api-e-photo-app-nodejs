import jwt from 'jsonwebtoken'
import { userPhotographer } from '../api/user_management_guest_event_photographer/models/user_photographer.model';
import { userOrganizerEvent } from '../api/user_management_guest_event_photographer/models/user_organizer_event.model'
import { Encrypt } from '../libs/encrypt';
import { sendMail } from '../services/email/email';
import config from '../config';
import { photoStudio } from '../api/photo_studio_event_management/models/photo_studio.model';
import { listSocial as listSocialNetwork } from "../api/photo_studio_event_management/models/social_network.model";
import { photoSocial } from '../api/user_management_guest_event_photographer/models/photo_social.model';
import { guest } from '../api/photography_guest_management/models/guest_manage.model';
import { compareFaceInPhotos } from '../services/aws/rekogition_face_aws';

let keyLogger = new Array();

export class AuthController {

    /**
     * Get data options and phot studio, social network
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async getCreateAccount(req, res) {
        const listSocial = await listSocialNetwork;
        const listPhotoStudio = await photoStudio.getListPhotoStudio();
        res.status(200).json({
            list_social: listSocial,
            list_studio: listPhotoStudio
        });
    }

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
            const { username, email, password, id_studio, list_social } = req.body;
            const resultNewAccount = await userPhotographer.getLoginUserData(email);
            if (resultNewAccount) {
                res.json({
                    message: `User ${username} or email: ${email} does exists as photographer`
                });
            } else {
                const passwordCifrate = await Encrypt.encryptPassword(password);
                const codeUserPhotographer = await userPhotographer.createUserPhotographer(username, email, passwordCifrate, id_studio);
                if (codeUserPhotographer > 0) {
                    console.log("new code photographer user", codeUserPhotographer);
                    for (let indexListSocial = 0; indexListSocial < list_social.length; indexListSocial++) {
                        let { id, description } = list_social[indexListSocial];
                        if (await photoSocial.addSocialNetwork(id, codeUserPhotographer, description)) {
                            console.log("Registered social network");
                        } else {
                            console.log("Error in register social", id, description, list_social);
                        }
                    }
                    const token = jwt.sign({ id: codeUserPhotographer }, config.SECRET, {
                        expiresIn: 86400    // 24 hours
                    });
                    res.json({
                        message: `Account Photographer user created succesfully`,
                        token
                    });
                } else {
                    res.status(200).json({ message: "Error in create account photographer", token: null });
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
            res.status(200).send("You lose");
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
        console.log(userAccount);
        // if not user photographer ?
        if (!userAccount) {
            userAccount = await userOrganizerEvent.getLoginUserData(email);
            // if not user organizer event
            console.log("organizeer", userAccount);
            if (!userAccount) {
                console.log("crash");
                res.status(200).json({ message: `User not found` });
            } else {
                // is user organizer event
                const matchPassword = await Encrypt.comparePassword(password, userAccount.password);
                console.log("crash", matchPassword);
                if (!matchPassword) {
                    console.log("crash 200");
                    res.status(200).json({ token: null, message: `invalid password` });
                } else {
                    const token = jwt.sign({ id: userAccount.id }, config.SECRET, {
                        expiresIn: 86400
                    });
                    console.log("crash good", token);
                    res.json({ token, message: `welcome`, type: 'Organizer User' });
                }
            }
        } else {
            // is user photographer
            const matchPassword = await Encrypt.comparePassword(password, userAccount.password);
            console.log("crash photographer", matchPassword);
            if (!matchPassword) {
                console.log("crash photo");
                res.status(200).json({ token: null, message: `invalid password` });
            } else {
                console.log("crash god god");
                const token = jwt.sign({ id: userAccount.code }, config.SECRET, {
                    expiresIn: 86400
                });
                res.json({ token, message: `welcome`, type: 'Photographer User' });
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
                console.log(user);
                if (user.code) {
                    const numRandom = parseInt(Math.floor((Math.random() * 999999) + 111111), 16);  //Generate Key Randomize for confirm code
                    const key = numRandom.toString(15);
                    keyLogger.push({
                        email,
                        key,
                        type
                    });
                    let contentHTML = `
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
                                        <a style="color: greenyellow;" href="http://localhost:3000/confirm_key">Porfavor sigue este
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
            } else {
                // type = false -> user organizer event
                const user = await userOrganizerEvent.getLoginUserData(email);
                if (user.code) {
                    const numRandom = parseInt(Math.floor((Math.random() * 999999) + 111111), 16);  //Generate Key Randomize for confirm code
                    const key = numRandom.toString(15);
                    keyLogger.push({
                        email,
                        key,
                        type
                    });
                    let contentHTML = `
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
                                        <a style="color: greenyellow;" href="http://localhost:3000/confirm_key">Porfavor sigue este
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
            res.status(200).json({
                message: "Error in process restore account"
            });
        }
    }

    /**
     * confirm key for restor account
     * @param {Request} req : http
     * @param {REsponse} res : http
     */
    static async postConfirmKey(req, res) {
        const { key, email } = req.body;
        for (let index = 0; index < keyLogger.length; index++) {
            if (await key === keyLogger[index].key && email === keyLogger[index].email) {
                keyLogger[index].key = "#$%%$#";
                res.status(200).json({
                    message: "Done"
                });
                return;
            }
        }
        res.status(200).json({ message: 'Erroneous key or email incorrect, we already called the police. runs!' });
    }

    /**
     * verify password and change password
     * @param {Request} req : http
     * @param {Response} res : http
     */
    static async postVerifyPasswd(req, res) {
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
                            idUser = await userPhotographer.changePasswordUser(email, hash);
                            console.log("result: ", idUser);
                        } else {
                            // if organizer event user 
                            idUser = await userOrganizerEvent.changePasswordUser(email, hash);
                            console.log("result: ", idUser);
                        }
                        // externalLibrary.updatePassword(idUser, hash);
                        res.status(200).json({ message: `new password change successfully` });
                    } else {
                        res.status(200).json({ message: `The password does not match or ${email} doesn't not validated.` });
                    }
                }
            }
        } catch (error) {
            console.log("Error in postVerifyPasswd()", error);
            res.status(200).json({ message: "Error in process backend." });
        }
    }

    static async signInGuest(req, res) {
        const { email, password } = req.body;
        console.log(req.body);
        const userAccount = await guest.getDataLogin(email);
        // if not user organizer event
        console.log("guest", userAccount);
        if (!userAccount) {
            console.log("crashed");
            res.status(200).json({ message: `User not found` });
        } else {
            // guest user exists
            const matchPassword = await Encrypt.comparePassword(password, userAccount.password);
            console.log("crash", matchPassword);
            if (!matchPassword) {
                console.log("crash 200");
                res.status(200).json({ token: null, message: `invalid password` });
            } else {
                const token = jwt.sign({ id: userAccount.id }, config.SECRET, {
                    expiresIn: 86400
                });
                console.log("crash good", token, userAccount.name);
                res.json({ token, message: `welcome`, type: 'Guest User', name: userAccount.name });
            }
        }
    }

    static async signUpGuest(req, res) {
        const { name_user, email, phone, password, photo_1, photo_2, photo_3 } = req.body;
        const resultNewAccount = await guest.getDataLogin(email);
        console.log("User: ", resultNewAccount);
        if (resultNewAccount) {
            res.json({
                message: `User ${name_user} or email: ${email} does exists as guest user`
            });
        } else {
            console.log("braek initial");
            console.time("mytyme");
            let resultComparisionPromise = compareFaceInPhotos(photo_1, photo_2);
            console.log("braek?");
            let resultComparision1Promise = compareFaceInPhotos(photo_2, photo_3);
            console.log("braek end");
            resultComparisionPromise.then(async (resolve1) => {
                console.log("resolve", resolve1);
                if (resolve1) {
                    resultComparision1Promise.then(async (resolve2) => {
                        if (resolve2) {
                            // register new account guest
                            const passwordCifrate = await Encrypt.encryptPassword(password);
                            const codeUserGuest = await guest.createNewUserGuest(name_user, email, phone, passwordCifrate, photo_1, photo_2, photo_3);
                            if (codeUserGuest > 0) {
                                console.log("new code guest user", codeUserGuest);
                                const token = jwt.sign({ id: codeUserGuest }, config.SECRET, {
                                    expiresIn: 86400    // 24 hours
                                });
                                console.timeEnd("mytyme");
                                res.json({
                                    message: `Account Guest user created succesfully`,
                                    token
                                });
                            } else {
                                console.timeEnd("mytyme");
                                res.status(200).json({ message: "Error in create account photographer", token: null });
                            }
                        } else {
                            console.timeEnd("mytyme");
                            console.log("no hay comparacion de rostros entre photo 2 y 3");
                            res.status(200).json({ message: "no compare photo 2 with photo 3", token: null });
                        }
                    }).catch(err => {
                        console.timeEnd("mytyme");
                        console.log("Error in promise resultComparision1Promise", err);
                        res.status(200).json({ message: "no compare photo 2 with photo 3", token: null });
                    });
                } else {
                    console.timeEnd("mytyme");
                    console.log("Error in promise resultComparisionPromise", error);
                    res.status(200).json({ message: "no compare photo 1 with photo 2", token: null });
                }
            }).catch(err => {
                console.timeEnd("mytyme");
                console.log("Error in promise ", err);
                res.status(200).json({ message: "no compare photo 1 with photo 2", token: null });
            });
        }
    }
}