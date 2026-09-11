const Category = require("../models/Category");

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

// Create Category (Admin Only)
exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;

		if (!name) {
			return res.status(400).json({
				success: false,
				message: "Category name is required",
			});
		}

		const categoryDetails = await Category.create({
			name: name.trim(),
			description: description ? description.trim() : "",
		});

		return res.status(200).json({
			success: true,
			data: categoryDetails,
			message: "Category created successfully",
		});
	} catch (error) {
		console.error("Error creating category:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create category",
			error: error.message,
		});
	}
};

// Show all Categories (Public)
exports.showAllCategories = async (req, res) => {
	try {
		const allCategories = await Category.find({}, { name: true, description: true });

		return res.status(200).json({
			success: true,
			data: allCategories,
		});
	} catch (error) {
		console.error("Error fetching categories:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch categories",
			error: error.message,
		});
	}
};

// Get Category Page Details with courses
exports.categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;

		if (!categoryId) {
			return res.status(400).json({
				success: false,
				message: "Category ID is required",
			});
		}

		// Get courses for selected category
		const selectedCategory = await Category.findById(categoryId)
			.populate({
				path: "courses",
				match: { status: "Published" },
				populate: [
					{ path: "ratingAndReviews" },
					{ path: "instructor" },
				],
			})
			.exec();

		if (!selectedCategory) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		});

		let differentCategory = null;
		if (categoriesExceptSelected.length > 0) {
			const randomIndex = getRandomInt(categoriesExceptSelected.length);
			differentCategory = await Category.findById(categoriesExceptSelected[randomIndex]._id)
				.populate({
					path: "courses",
					match: { status: "Published" },
					populate: { path: "instructor" },
				})
				.exec();
		}

		// Get top selling courses across all categories
		const allCategories = await Category.find().populate({
			path: "courses",
			match: { status: "Published" },
			populate: { path: "instructor" },
		});

		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses
			.sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0))
			.slice(0, 10);

		return res.status(200).json({
			success: true,
			data: {
				selectedCategory,
				differentCategory,
				mostSellingCourses,
			},
		});
	} catch (error) {
		console.error("Error fetching category page details:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch category details",
			error: error.message,
		});
	}
};
