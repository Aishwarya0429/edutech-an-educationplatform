const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: "StudyNotion - Online Education Platform",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Email sent info:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error in mailSender:", error.message);
        throw error;
    }
};

module.exports = mailSender;
