const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// Create a new course (Instructor Only)
exports.createCourse = async (req, res) => {
	try {
		const userId = req.user.id;

		let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag: _tag,
			category,
			status,
			instructions: _instructions,
		} = req.body;

		// Get thumbnail image
		const thumbnail = req.files ? req.files.thumbnailImage : null;

		// Parse arrays from stringified JSON if needed
		const tag = typeof _tag === "string" ? JSON.parse(_tag) : _tag;
		const instructions =
			typeof _instructions === "string"
				? JSON.parse(_instructions)
				: _instructions;

		if (
			!courseName ||
			!courseDescription ||
			!whatYouWillLearn ||
			!price ||
			!tag ||
			!tag.length ||
			!thumbnail ||
			!category ||
			!instructions ||
			!instructions.length
		) {
			return res.status(400).json({
				success: false,
				message: "All fields are mandatory",
			});
		}

		if (!status) {
			status = "Draft";
		}

		// Verify instructor details
		const instructorDetails = await User.findById(userId);
		if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
			return res.status(404).json({
				success: false,
				message: "Instructor details not found",
			});
		}

		// Verify category
		const categoryDetails = await Category.findById(category);
		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// Upload thumbnail to Cloudinary
		const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME || "studynotion"
		);

		// Create course record
		const newCourse = await Course.create({
			courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn,
			price,
			tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status,
			instructions,
		});

		// Add course to Instructor's courses list
		await User.findByIdAndUpdate(
			instructorDetails._id,
			{ $push: { courses: newCourse._id } },
			{ new: true }
		);

		// Add course to Category's courses list
		await Category.findByIdAndUpdate(
			category,
			{ $push: { courses: newCourse._id } },
			{ new: true }
		);

		return res.status(200).json({
			success: true,
			data: newCourse,
			message: "Course created successfully",
		});
	} catch (error) {
		console.error("Error creating course:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create course",
			error: error.message,
		});
	}
};

// Edit Course Details
exports.editCourse = async (req, res) => {
	try {
		const { courseId } = req.body;
		const updates = req.body;
		const course = await Course.findById(courseId);

		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		// If new thumbnail is uploaded
		if (req.files && req.files.thumbnailImage) {
			const thumbnail = req.files.thumbnailImage;
			const thumbnailImage = await uploadImageToCloudinary(
				thumbnail,
				process.env.FOLDER_NAME || "studynotion"
			);
			course.thumbnail = thumbnailImage.secure_url;
		}

		// Update fields present in request
		for (const key in updates) {
			if (Object.prototype.hasOwnProperty.call(updates, key)) {
				if (key === "tag" || key === "instructions") {
					course[key] =
						typeof updates[key] === "string"
							? JSON.parse(updates[key])
							: updates[key];
				} else if (key !== "courseId") {
					course[key] = updates[key];
				}
			}
		}

		await course.save();

		const updatedCourse = await Course.findById(courseId)
			.populate({
				path: "instructor",
				populate: { path: "additionalDetails" },
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: { path: "subSection" },
			})
			.exec();

		return res.status(200).json({
			success: true,
			message: "Course updated successfully",
			data: updatedCourse,
		});
	} catch (error) {
		console.error("Error updating course:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update course",
			error: error.message,
		});
	}
};

// Get All Published Courses
exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find(
			{ status: "Published" },
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnrolled: true,
			}
		)
			.populate("instructor")
			.exec();

		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.error("Error fetching courses:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch course data",
			error: error.message,
		});
	}
};

// Get Single Course Details (Public view)
exports.getCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body;

		const courseDetails = await Course.findById(courseId)
			.populate({
				path: "instructor",
				populate: { path: "additionalDetails" },
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
					select: "-videoUrl",
				},
			})
			.exec();

		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			});
		}

		let totalDurationInSeconds = 0;
		courseDetails.courseContent.forEach((section) => {
			section.subSection.forEach((subSection) => {
				const time = parseInt(subSection.timeDuration) || 0;
				totalDurationInSeconds += time;
			});
		});

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
			},
		});
	} catch (error) {
		console.error("Error getting course details:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve course details",
			error: error.message,
		});
	}
};

// Get Full Course Details with Video URLs (Enrolled Student / Instructor View)
exports.getFullCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body;
		const userId = req.user.id;

		const courseDetails = await Course.findById(courseId)
			.populate({
				path: "instructor",
				populate: { path: "additionalDetails" },
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: { path: "subSection" },
			})
			.exec();

		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			});
		}

		const courseProgressCount = await CourseProgress.findOne({
			courseID: courseId,
			userId: userId,
		});

		let totalDurationInSeconds = 0;
		courseDetails.courseContent.forEach((section) => {
			section.subSection.forEach((subSection) => {
				const time = parseInt(subSection.timeDuration) || 0;
				totalDurationInSeconds += time;
			});
		});

		const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
				completedVideos: courseProgressCount?.completedVideos || [],
			},
		});
	} catch (error) {
		console.error("Error getting full course details:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve full course details",
			error: error.message,
		});
	}
};

// Get All Courses of an Instructor
exports.getInstructorCourses = async (req, res) => {
	try {
		const instructorId = req.user.id;

		const instructorCourses = await Course.find({
			instructor: instructorId,
		}).sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			data: instructorCourses,
		});
	} catch (error) {
		console.error("Error fetching instructor courses:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to retrieve instructor courses",
			error: error.message,
		});
	}
};

// Delete Course
exports.deleteCourse = async (req, res) => {
	try {
		const { courseId } = req.body;

		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}

		// Unenroll students
		const studentsEnrolled = course.studentsEnrolled || [];
		for (const studentId of studentsEnrolled) {
			await User.findByIdAndUpdate(studentId, {
				$pull: { courses: courseId },
			});
		}

		// Delete associated sections and sub-sections
		for (const sectionId of course.courseContent) {
			const section = await Section.findById(sectionId);
			if (section) {
				for (const subSectionId of section.subSection) {
					await SubSection.findByIdAndDelete(subSectionId);
				}
			}
			await Section.findByIdAndDelete(sectionId);
		}

		// Remove from category
		await Category.findByIdAndUpdate(course.category, {
			$pull: { courses: courseId },
		});

		// Remove from instructor
		await User.findByIdAndUpdate(course.instructor, {
			$pull: { courses: courseId },
		});

		// Delete the course document
		await Course.findByIdAndDelete(courseId);

		return res.status(200).json({
			success: true,
			message: "Course deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting course:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete course",
			error: error.message,
		});
	}
};
