const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

// Authentication middleware to verify JWT token
exports.auth = async (req, res, next) => {
	try {
		// Extract token from cookies, body, or Bearer header
		const token =
			req.cookies.token ||
			req.body.token ||
			(req.header("Authorization")
				? req.header("Authorization").replace("Bearer ", "")
				: null);

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Authentication token is missing",
			});
		}

		try {
			// Verify token using secret
			const decode = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decode;
		} catch (error) {
			return res.status(401).json({
				success: false,
				message: "Invalid or expired token",
			});
		}

		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Something went wrong while validating the token",
			error: error.message,
		});
	}
};

// Middleware for Student role verification
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (!userDetails || userDetails.accountType !== "Student") {
			return res.status(403).json({
				success: false,
				message: "Access forbidden: This is a protected route for Students",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Unable to verify student role",
			error: error.message,
		});
	}
};

// Middleware for Instructor role verification
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (!userDetails || userDetails.accountType !== "Instructor") {
			return res.status(403).json({
				success: false,
				message: "Access forbidden: This is a protected route for Instructors",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Unable to verify instructor role",
			error: error.message,
		});
	}
};

// Middleware for Admin role verification
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (!userDetails || userDetails.accountType !== "Admin") {
			return res.status(403).json({
				success: false,
				message: "Access forbidden: This is a protected route for Admins",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Unable to verify admin role",
			error: error.message,
		});
	}
};
