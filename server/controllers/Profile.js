const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// Update Profile Details
exports.updateProfile = async (req, res) => {
	try {
		const {
			firstName = "",
			lastName = "",
			dateOfBirth = "",
			about = "",
			contactNumber = "",
			gender = "",
		} = req.body;
		const id = req.user.id;

		const userDetails = await User.findById(id);
		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Update User fields
		if (firstName || lastName) {
			await User.findByIdAndUpdate(id, {
				firstName: firstName || userDetails.firstName,
				lastName: lastName || userDetails.lastName,
			});
		}

		// Update Profile document
		const profile = await Profile.findById(userDetails.additionalDetails);
		if (profile) {
			profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
			profile.about = about || profile.about;
			profile.contactNumber = contactNumber || profile.contactNumber;
			profile.gender = gender || profile.gender;
			await profile.save();
		}

		const updatedUserDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: updatedUserDetails,
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update profile",
			error: error.message,
		});
	}
};

// Delete User Account
exports.deleteAccount = async (req, res) => {
	try {
		const id = req.user.id;
		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Delete Profile associated with user
		if (user.additionalDetails) {
			await Profile.findByIdAndDelete(user.additionalDetails);
		}

		// Unenroll user from enrolled courses
		for (const courseId of user.courses) {
			await Course.findByIdAndUpdate(courseId, {
				$pull: { studentsEnrolled: id },
			});
		}

		// Delete course progress records
		await CourseProgress.deleteMany({ userId: id });

		// Delete User record
		await User.findByIdAndDelete(id);

		return res.status(200).json({
			success: true,
			message: "Account deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting account:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete account",
			error: error.message,
		});
	}
};

// Get Full Details of Authenticated User
exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();

		return res.status(200).json({
			success: true,
			message: "User data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		console.error("Error fetching user details:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch user details",
			error: error.message,
		});
	}
};

// Update Display Picture (Avatar)
exports.updateDisplayPicture = async (req, res) => {
	try {
		const displayPicture = req.files ? req.files.displayPicture : null;
		const userId = req.user.id;

		if (!displayPicture) {
			return res.status(400).json({
				success: false,
				message: "Display picture file is required",
			});
		}

		const image = await uploadImageToCloudinary(
			displayPicture,
			process.env.FOLDER_NAME || "studynotion",
			1000,
			1000
		);

		const updatedProfile = await User.findByIdAndUpdate(
			userId,
			{ image: image.secure_url },
			{ new: true }
		).populate("additionalDetails");

		return res.status(200).json({
			success: true,
			message: "Image updated successfully",
			data: updatedProfile,
		});
	} catch (error) {
		console.error("Error updating display picture:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update profile picture",
			error: error.message,
		});
	}
};

// Get All Enrolled Courses for Student
exports.getEnrolledCourses = async (req, res) => {
	try {
		const userId = req.user.id;
		let userDetails = await User.findById(userId)
			.populate({
				path: "courses",
				populate: {
					path: "courseContent",
					populate: {
						path: "subSection",
					},
				},
			})
			.exec();

		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		userDetails = userDetails.toObject();

		for (let i = 0; i < userDetails.courses.length; i++) {
			let totalDurationInSeconds = 0;
			let totalSubsections = 0;

			for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
				const section = userDetails.courses[i].courseContent[j];
				totalDurationInSeconds += section.subSection.reduce(
					(acc, curr) => acc + (parseInt(curr.timeDuration) || 0),
					0
				);
				totalSubsections += section.subSection.length;
			}

			userDetails.courses[i].totalDuration = convertSecondsToDuration(
				totalDurationInSeconds
			);

			const courseProgressCount = await CourseProgress.findOne({
				courseID: userDetails.courses[i]._id,
				userId: userId,
			});

			const completedCount = courseProgressCount?.completedVideos?.length || 0;

			if (totalSubsections === 0) {
				userDetails.courses[i].progressPercentage = 100;
			} else {
				const percentage = (completedCount / totalSubsections) * 100;
				userDetails.courses[i].progressPercentage = Math.round(percentage * 100) / 100;
			}
		}

		return res.status(200).json({
			success: true,
			data: userDetails.courses,
		});
	} catch (error) {
		console.error("Error fetching enrolled courses:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch enrolled courses",
			error: error.message,
		});
	}
};

// Instructor Analytics Dashboard
exports.instructorDashboard = async (req, res) => {
	try {
		const courseDetails = await Course.find({ instructor: req.user.id });

		const courseData = courseDetails.map((course) => {
			const studentsList = course.studentsEnrolled || course.studentsEnroled || [];
			const totalStudentsEnrolled = studentsList.length;
			const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0);

			return {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudentsEnrolled,
				totalAmountGenerated,
			};
		});

		return res.status(200).json({
			success: true,
			courses: courseData,
		});
	} catch (error) {
		console.error("Error generating instructor dashboard stats:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve instructor dashboard data",
			error: error.message,
		});
	}
};
