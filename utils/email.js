const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //  1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        // tls: { rejectUnauthorized: false }

    })

    //  2) Define the email options
    let { email, subject, message } = options;
    const mailOptions = {
        from: "Olga Rublova <olga.i.rubleva@gmail.com>",
        to: email,
        subject: subject,
        text: message
        //html
    }

    //  3) Actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;