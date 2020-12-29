import nodemailer from 'nodemailer';

export async function main(user, password, from, to, subject, text){
    
        let acccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user,
                password
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

