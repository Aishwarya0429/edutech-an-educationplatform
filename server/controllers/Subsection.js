const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create a new SubSection (video lecture)
exports.createSubSection = async (req, res) => {
	try {
		const { sectionId, title, description } = req.body;
		const video = req.files ? req.files.video : null;

		if (!sectionId || !title || !description || !video) {
			return res.status(400).json({
				success: false,
				message: "All fields including lecture video are required",
			});
		}

		// Upload video to Cloudinary
		const uploadDetails = await uploadImageToCloudinary(
			video,
			process.env.FOLDER_NAME || "studynotion"
		);

		// Create SubSection record
		const subSectionDetails = await SubSection.create({
			title,
			timeDuration: `${uploadDetails.duration || 0}`,
			description,
			videoUrl: uploadDetails.secure_url,
		});

		// Add subsection to parent section
		const updatedSection = await Section.findByIdAndUpdate(
			sectionId,
			{ $push: { subSection: subSectionDetails._id } },
			{ new: true }
		).populate("subSection");

		return res.status(200).json({
			success: true,
			message: "SubSection created successfully",
			data: updatedSection,
		});
	} catch (error) {
		console.error("Error creating sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create sub-section",
			error: error.message,
		});
	}
};

// Update SubSection details or video
exports.updateSubSection = async (req, res) => {
	try {
		const { sectionId, subSectionId, title, description } = req.body;
		const subSection = await SubSection.findById(subSectionId);

		if (!subSection) {
			return res.status(404).json({
				success: false,
				message: "SubSection not found",
			});
		}

		if (title !== undefined) {
			subSection.title = title;
		}

		if (description !== undefined) {
			subSection.description = description;
		}

		if (req.files && req.files.video) {
			const video = req.files.video;
			const uploadDetails = await uploadImageToCloudinary(
				video,
				process.env.FOLDER_NAME || "studynotion"
			);
			subSection.videoUrl = uploadDetails.secure_url;
			subSection.timeDuration = `${uploadDetails.duration || 0}`;
		}

		await subSection.save();

		const updatedSection = await Section.findById(sectionId).populate(
			"subSection"
		);

		return res.status(200).json({
			success: true,
			message: "SubSection updated successfully",
			data: updatedSection,
		});
	} catch (error) {
		console.error("Error updating sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update sub-section",
			error: error.message,
		});
	}
};

// Delete a SubSection
exports.deleteSubSection = async (req, res) => {
	try {
		const { subSectionId, sectionId } = req.body;

		if (!subSectionId || !sectionId) {
			return res.status(400).json({
				success: false,
				message: "SubSection ID and Section ID are required",
			});
		}

		// Pull subsection from section
		await Section.findByIdAndUpdate(sectionId, {
			$pull: { subSection: subSectionId },
		});

		const subSection = await SubSection.findByIdAndDelete(subSectionId);
		if (!subSection) {
			return res.status(404).json({
				success: false,
				message: "SubSection not found",
			});
		}

		const updatedSection = await Section.findById(sectionId).populate(
			"subSection"
		);

		return res.status(200).json({
			success: true,
			message: "SubSection deleted successfully",
			data: updatedSection,
		});
	} catch (error) {
		console.error("Error deleting sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to delete sub-section",
			error: error.message,
		});
	}
};
