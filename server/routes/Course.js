const express = require("express");
const router = express.Router();

// Import Category Controllers
const {
	createCategory,
	showAllCategories,
	categoryPageDetails,
} = require("../controllers/Category");

// Import Middlewares
const { auth, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Category Routes (Admin only for creation)
// ********************************************************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

module.exports = router;
