const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { cloudinaryConnect } = require("./config/cloudinary");

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to Database & Cloudinary
database.connect();
cloudinaryConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// Mount Routes
const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Course");

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/course", courseRoutes);

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
