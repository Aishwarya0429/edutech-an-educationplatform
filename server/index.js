const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const database = require("./config/database");
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
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const contactRoutes = require("./routes/Contact");

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);

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
