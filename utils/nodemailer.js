const nodemailer = require("nodemailer");
const { config } = require('dotenv');
const user = require("../models/user");
config();

const transport = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
        },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    console.log("Check");
    transport.sendMail({
        from: process.env.USER,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:2000/confirm/${confirmationCode}> Click here</a>
        </div>`,
    }).catch(err => console.log(err));
};

