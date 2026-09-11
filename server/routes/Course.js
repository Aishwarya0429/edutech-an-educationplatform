const express = require("express");
const router = express.Router();

// Import Course Controllers
const {
	createCourse,
	getAllCourses,
	getCourseDetails,
	getFullCourseDetails,
	editCourse,
	getInstructorCourses,
	deleteCourse,
} = require("../controllers/Course");

// Import Category Controllers
const {
	createCategory,
	showAllCategories,
	categoryPageDetails,
} = require("../controllers/Category");

// Import Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course Routes
// ********************************************************************************************************

// Courses can only be created, edited, or deleted by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.post("/getCourseDetails", getCourseDetails);
router.get("/getAllCourses", getAllCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

// ********************************************************************************************************
//                                      Category Routes (Admin only for creation)
// ********************************************************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

module.exports = router;
