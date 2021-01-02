import nodeMailer from 'nodemailer';
import config from './config.account';

/**
 * send email
 * @param {string} from : account email local
 * @param {string} to : destiny
 * @param {string} subject : title email
 * @param {string} text : container email
 */
export async function sendMail(to, subject, text) {
    const transporter = await nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.username,
            pass: config.password
        },
        tls: { rejectUnauthorized: false }
    });
    transporter.verify(function (error, success) {
        if (error) {
            console.log("Error connection to email server and account", error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });
    const info = await transporter.sendMail({
        from,                                   //"'RestTeam Server' <restteam2020@nodejs.net>",
        to,
        subject,
        html: text
    });
    console.log("info the email: ", info);
    return info;
}

