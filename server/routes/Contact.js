const express = require("express");
const router = express.Router();

const { contactUsControllers } = require("../controllers/ContactUs");

router.post("/contact", contactUsControllers);

module.exports = router;
