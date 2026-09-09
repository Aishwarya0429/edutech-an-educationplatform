const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const database = require("./config/database");

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to Database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Health Check / Default Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your StudyNotion server is up and running...",
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
