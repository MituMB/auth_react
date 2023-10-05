// import nodemailer from 'nodemailer';
const nodemailer = require("nodemailer");

const sendEmail = async (subject,message,email_to,email_from,reply_to) => {
  
        //Create email transporter
        const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port:Number(process.env.EMAIL_PORT) ,
                // secure: Boolean(process.env.SECURE), // true for 465, false for other ports
                auth: {
                  user: process.env.EMAIL_USER, // generated ethereal user
                  pass: process.env.EMAIL_PASS, // generated ethereal password
                },
                tls:{
                    rejectUnauthorized: false
                }
            })

            //Option for sending Email
            const options = {
                from:email_from,
                to:email_to,
                replyTo:reply_to,
                subject:subject,
                html:message,
            }
            //send email
            transporter.sendMail(options, function(err,info) {
            if(err) {
                console.log(err);
            }else{

                console.log(info);
            }
        })
 
}

// export default sendEmail;
module.exports = sendEmail;
