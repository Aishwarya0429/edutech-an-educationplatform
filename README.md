# StudyNotion - Online Education Platform

StudyNotion is a modern, full-stack ed-tech platform built on the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It is designed to provide an engaging, seamless learning experience for students and an intuitive, powerful course management suite for instructors.

---

## 🌟 Key Features

### For Students
- **Course Discovery:** Interactive category browsing, search filters, and course cards with ratings & reviews.
- **Cart & Wishlist:** Easy course saving and purchasing flow.
- **Secure Payments:** Seamless checkout powered by Razorpay.
- **Interactive Video Player:** Section & lecture navigation with progress tracking and completion status.
- **Reviews & Ratings:** Share feedback and rate completed courses.
- **Student Profile:** Customizable profile details, avatars, and purchase history.

### For Instructors
- **Course Studio:** Multi-step course creation wizard with rich details, thumbnails, and pricing.
- **Curriculum Builder:** Dynamic section and sub-section builder with video lecture uploads via Cloudinary.
- **Instructor Dashboard:** Analytics dashboard with visual revenue charts, student enrollment metrics, and course status.

### Security & Architecture
- **Role-Based Access Control:** Distinct roles for Students, Instructors, and Administrators.
- **Secure Authentication:** JWT tokens with HTTP-only cookies, password hashing via bcrypt, and email OTP verification.
- **Cloud Infrastructure:** Scalable media storage using Cloudinary.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Tailwind CSS, Redux Toolkit, React Router v6, React Hook Form, Chart.js, React Icons.
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt, Nodemailer.
- **Database:** MongoDB & Mongoose ODM.
- **External Integrations:** Razorpay (Payments), Cloudinary (Media Hosting).

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aishwarya0429/edutech-an-educationplatform.git
   cd edutech-an-educationplatform
   ```

2. **Server Setup:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run dev
   ```

---

## 👤 Author
- **GitHub:** [@Aishwarya0429](https://github.com/Aishwarya0429)

