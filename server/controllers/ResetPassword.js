const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Generate reset password token & send email
exports.resetPasswordToken = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: `Email ${email} is not registered with us`,
			});
		}

		// Generate token and expiration (1 hour)
		const token = crypto.randomBytes(20).toString("hex");

		await User.findOneAndUpdate(
			{ email },
			{
				token,
				resetPasswordExpires: Date.now() + 3600000,
			},
			{ new: true }
		);

		const url = `http://localhost:3000/update-password/${token}`;

		await mailSender(
			email,
			"Password Reset Link - StudyNotion",
			`Your link to reset your password is: <a href="${url}">${url}</a><br>This link is valid for 1 hour.`
		);

		return res.status(200).json({
			success: true,
			message: "Password reset email sent successfully",
		});
	} catch (error) {
		console.error("Error in resetPasswordToken:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while generating reset token",
			error: error.message,
		});
	}
};

// Reset password in database using token
exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password do not match",
			});
		}

		const userDetails = await User.findOne({ token });
		if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: "Reset token is invalid",
			});
		}

		if (userDetails.resetPasswordExpires < Date.now()) {
			return res.status(403).json({
				success: false,
				message: "Reset token has expired. Please request a new one.",
			});
		}

		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token },
			{
				password: encryptedPassword,
				token: null,
				resetPasswordExpires: null,
			},
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			message: "Password reset successful",
		});
	} catch (error) {
		console.error("Error in resetPassword:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while resetting password",
			error: error.message,
		});
	}
};
