import nodemailer from 'nodemailer';
import config from './config.account';

/**
 * send email
 * @param {string} from : account email local
 * @param {string} to : destiny
 * @param {string} subject : title email
 * @param {string} text : container email
 */
export async function sendMail(from, to, subject, text){
        let acccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user : config.username,
                password: config.password
            },
            tls: {rejectUnauthorized: false}
        }
        );    
        let infoMailer = await transporter.sendMail({
            from,
            to,
            subject,
            text
        });
        console.log("Status Mailer: "+infoMailer);
        return infoMailer;
    
}

