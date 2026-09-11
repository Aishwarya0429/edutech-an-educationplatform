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

// Import Section Controllers
const {
	createSection,
	updateSection,
	deleteSection,
} = require("../controllers/Section");

// Import SubSection Controllers
const {
	createSubSection,
	updateSubSection,
	deleteSubSection,
} = require("../controllers/Subsection");

// Import Course Progress Controller
const { updateCourseProgress } = require("../controllers/courseProgress");

// Import Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course Routes (Instructors)
// ********************************************************************************************************

router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.post("/getCourseDetails", getCourseDetails);
router.get("/getAllCourses", getAllCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

// ********************************************************************************************************
//                                      Section & SubSection Routes (Instructors)
// ********************************************************************************************************

// Sections
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);

// SubSections
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// ********************************************************************************************************
//                                      Course Progress Routes (Students)
// ********************************************************************************************************

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category Routes (Admin only for creation)
// ********************************************************************************************************

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

module.exports = router;
