const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		// Check if user is already registered
		const checkUserPresent = await User.findOne({ email });
		if (checkUserPresent) {
			return res.status(401).json({
				success: false,
				message: "User is already registered",
			});
		}

		// Generate 6-digit numeric OTP
		let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		// Ensure uniqueness of OTP
		let result = await OTP.findOne({ otp: otp });
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});
			result = await OTP.findOne({ otp: otp });
		}

		const otpPayload = { email, otp };
		await OTP.create(otpPayload);

		return res.status(200).json({
			success: true,
			message: "OTP sent successfully",
			otp,
		});
	} catch (error) {
		console.error("Error in sendotp:", error.message);
		return res.status(500).json({
			success: false,
			message: "Failed to send OTP",
			error: error.message,
		});
	}
};

// Signup Controller for Registering Users
exports.signup = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
		} = req.body;

		// Validate required fields
		if (
			!firstName ||
			!lastName ||
			!email ||
			!password ||
			!confirmPassword ||
			!otp
		) {
			return res.status(403).json({
				success: false,
				message: "All fields are required",
			});
		}

		// Check password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Password and Confirm Password do not match",
			});
		}

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User already exists. Please login to continue.",
			});
		}

		// Verify OTP
		const recentOtp = await OTP.find({ email })
			.sort({ createdAt: -1 })
			.limit(1);

		if (recentOtp.length === 0 || otp !== recentOtp[0].otp) {
			return res.status(400).json({
				success: false,
				message: "The OTP is invalid or expired",
			});
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Default approved state (Instructors may need approval in some workflows)
		const approved = accountType === "Instructor" ? true : true;

		// Create default profile for user
		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: contactNumber || null,
		});

		// Create user record
		const user = await User.create({
			firstName,
			lastName,
			email,
			contactNumber,
			password: hashedPassword,
			accountType,
			approved,
			additionalDetails: profileDetails._id,
			image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
		});

		user.password = undefined;

		return res.status(200).json({
			success: true,
			user,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error("Error in signup:", error);
		return res.status(500).json({
			success: false,
			message: "User registration failed. Please try again.",
			error: error.message,
		});
	}
};

// Login Controller for Authenticating Users
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please fill in all required fields",
			});
		}

		const user = await User.findOne({ email }).populate("additionalDetails");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User is not registered with us. Please sign up to continue.",
			});
		}

		// Compare password
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{
					email: user.email,
					id: user._id,
					accountType: user.accountType,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			user.token = token;
			user.password = undefined;

			const cookieOptions = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

			return res.cookie("token", token, cookieOptions).status(200).json({
				success: true,
				token,
				user,
				message: "User login successful",
			});
		} else {
			return res.status(401).json({
				success: false,
				message: "Password is incorrect",
			});
		}
	} catch (error) {
		console.error("Error in login:", error);
		return res.status(500).json({
			success: false,
			message: "Login failed. Please try again.",
			error: error.message,
		});
	}
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		const userDetails = await User.findById(req.user.id);
		const { oldPassword, newPassword } = req.body;

		if (!oldPassword || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			return res.status(401).json({
				success: false,
				message: "The old password is incorrect",
			});
		}

		// Hash and update new password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			await mailSender(
				updatedUserDetails.email,
				"Password Updated Successfully",
				passwordUpdated(
					updatedUserDetails.email,
					`${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
		} catch (mailError) {
			console.error("Error sending password update email:", mailError.message);
		}

		return res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		console.error("Error in changePassword:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};
