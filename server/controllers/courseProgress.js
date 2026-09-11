const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");

// Update / mark a lecture as completed in course progress
exports.updateCourseProgress = async (req, res) => {
	const { courseId, subsectionId } = req.body;
	const userId = req.user.id;

	try {
		// Check if the subsection exists
		const subsection = await SubSection.findById(subsectionId);
		if (!subsection) {
			return res.status(404).json({
				success: false,
				message: "Invalid lecture / subsection",
			});
		}

		// Find the course progress document
		let courseProgress = await CourseProgress.findOne({
			courseID: courseId,
			userId: userId,
		});

		if (!courseProgress) {
			return res.status(404).json({
				success: false,
				message: "Course progress record does not exist for this user",
			});
		}

		// Check if lecture is already completed
		if (courseProgress.completedVideos.includes(subsectionId)) {
			return res.status(400).json({
				success: false,
				message: "Lecture already marked as completed",
			});
		}

		// Push to completed videos
		courseProgress.completedVideos.push(subsectionId);
		await courseProgress.save();

		return res.status(200).json({
			success: true,
			message: "Course progress updated successfully",
		});
	} catch (error) {
		console.error("Error updating course progress:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update course progress",
			error: error.message,
		});
	}
};
