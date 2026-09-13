const Razorpay = require("razorpay");

exports.instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY || "rzp_test_TbZVjwt7SncLoU",
    key_secret: process.env.RAZORPAY_SECRET || "rzp_secret_dummy_12345",
});
