const mailSender = require("../utils/mailSender");

exports.contactUsControllers = async (req, res) => {
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
    try {
        await mailSender(
            email,
            "Your message has been received - StudyNotion",
            `<h3>Hello ${firstname} ${lastname || ""},</h3>
            <p>Thank you for reaching out to us. We have received your message:</p>
            <blockquote>${message}</blockquote>
            <p>We will get back to you shortly at ${phoneNo ? `(${countrycode || ""}) ` + phoneNo : email}.</p>
            <p>Warm regards,<br/>StudyNotion Team</p>`
        );
        return res.json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        console.error("Contact Us Error:", error);
        return res.json({
            success: false,
            message: "Something went wrong while sending message",
        });
    }
};
