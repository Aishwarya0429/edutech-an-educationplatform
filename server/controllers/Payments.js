const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Capture Payment and create Razorpay Order
exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;

    if (!courses || courses.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;

    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(200).json({ success: false, message: "Could not find the course" });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    };

    try {
        const paymentResponse = await instance.orders.create(options);
        return res.json({
            success: true,
            message: paymentResponse,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Could not initiate order" });
    }
};

// Verify Payment Signature and enroll student
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(200).json({ success: false, message: "Payment Failed: Missing details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET || "rzp_secret_placeholder")
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        await enrollStudents(courses, userId, res);
        return res.status(200).json({ success: true, message: "Payment Verified" });
    }

    return res.status(200).json({ success: false, message: "Payment Verification Failed" });
};

// Helper: Enroll student in purchased courses
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({ success: false, message: "Please Provide Data for Courses or UserId" });
    }

    for (const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not Found" });
            }

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            // Send notification mail to student
            await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                `Congratulations ${enrolledStudent.firstName}, you are successfully enrolled into ${enrolledCourse.courseName}!`
            );
        } catch (error) {
            console.error("Error enrolling student:", error);
        }
    }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            "Payment Received - StudyNotion",
            `Hello ${enrolledStudent.firstName}, we have received your payment of ₹${amount / 100}. Payment ID: ${paymentId}, Order ID: ${orderId}.`
        );
        return res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending payment success email:", error);
        return res.status(500).json({ success: false, message: "Could not send email" });
    }
};
