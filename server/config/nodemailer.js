const nodemailer = require("nodemailer");

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_SECRET;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass
    },
});

module.exports.sendAnswerNotification = (email, subject, message) => {
    transport.sendMail({
        from: user,
        to: email,
        subject: subject,
        html: message,
    })
        .then((res) => {
            console.log(res)
        }).catch(err => console.log(err));
};