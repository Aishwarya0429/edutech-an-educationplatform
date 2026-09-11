const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// Create a new section
exports.createSection = async (req, res) => {
	try {
		const { sectionName, courseId } = req.body;

		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Section name and Course ID are required",
			});
		}

		// Create section
		const newSection = await Section.create({ sectionName });

		// Add section to course
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{ $push: { courseContent: newSection._id } },
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: { path: "subSection" },
			})
			.exec();

		return res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		console.error("Error creating section:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create section",
			error: error.message,
		});
	}
};

// Update an existing section
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId, courseId } = req.body;

		if (!sectionName || !sectionId) {
			return res.status(400).json({
				success: false,
				message: "Section name and Section ID are required",
			});
		}

		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
			.populate({
				path: "courseContent",
				populate: { path: "subSection" },
			})
			.exec();

		return res.status(200).json({
			success: true,
			message: "Section updated successfully",
			data: course || section,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update section",
			error: error.message,
		});
	}
};

// Delete a section
exports.deleteSection = async (req, res) => {
	try {
		const { sectionId, courseId } = req.body;

		if (!sectionId || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Section ID and Course ID are required",
			});
		}

		// Remove section reference from course
		await Course.findByIdAndUpdate(courseId, {
			$pull: { courseContent: sectionId },
		});

		const section = await Section.findById(sectionId);
		if (!section) {
			return res.status(404).json({
				success: false,
				message: "Section not found",
			});
		}

		// Delete all subsections belonging to this section
		await SubSection.deleteMany({ _id: { $in: section.subSection } });

		// Delete section
		await Section.findByIdAndDelete(sectionId);

		const course = await Course.findById(courseId)
			.populate({
				path: "courseContent",
				populate: { path: "subSection" },
			})
			.exec();

		return res.status(200).json({
			success: true,
			message: "Section deleted successfully",
			data: course,
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete section",
			error: error.message,
		});
	}
};
