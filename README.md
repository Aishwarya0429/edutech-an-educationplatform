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

---

## 📅 5-Day Development Roadmap (5 Commits / Day)

### 📌 Day 1: Architecture, Server & Auth Foundation
- [x] **Commit 1.1:** `chore: initial commit - project scaffolding and 5-day roadmap`
- [ ] **Commit 1.2:** `feat(server): setup express app, database connection, and config`
- [ ] **Commit 1.3:** `feat(models): define core mongoose schemas and relationships`
- [ ] **Commit 1.4:** `feat(utils): implement nodemailer mail sender and otp generator`
- [ ] **Commit 1.5:** `feat(auth): add signup, login, sendotp, and jwt auth middlewares`

### 📌 Day 2: Course System & Media Services
- [ ] **Commit 2.1:** `feat(services): integrate cloudinary media upload utility`
- [ ] **Commit 2.2:** `feat(controllers): category management and admin category handlers`
- [ ] **Commit 2.3:** `feat(controllers): course creation, edit, and deletion controllers`
- [ ] **Commit 2.4:** `feat(controllers): section and sub-section curriculum crud apis`
- [ ] **Commit 2.5:** `feat(controllers): profile controllers and course progress tracker`

### 📌 Day 3: Frontend Foundation & Auth UI
- [ ] **Commit 3.1:** `feat(client): initialize react client and configure tailwind css theme`
- [ ] **Commit 3.2:** `feat(client): setup redux store and auth/profile/cart/course slices`
- [ ] **Commit 3.3:** `feat(client): create navbar, footer, and core navigation layout`
- [ ] **Commit 3.4:** `feat(client): build login, signup, otp verification, and password reset pages`
- [ ] **Commit 3.5:** `feat(client): configure protected routes and role-based redirect handlers`

### 📌 Day 4: Instructor Studio & Course Discovery UI
- [ ] **Commit 4.1:** `feat(client): create multi-step course creation wizard for instructors`
- [ ] **Commit 4.2:** `feat(client): build instructor dashboard with analytics and course manager`
- [ ] **Commit 4.3:** `feat(client): implement course catalog and category exploration cards`
- [ ] **Commit 4.4:** `feat(client): build course details page with curriculum accordion`
- [ ] **Commit 4.5:** `feat(client): create lecture video player with lecture progress navigation`

### 📌 Day 5: Checkout, Reviews & Final Polish
- [ ] **Commit 5.1:** `feat(client): build cart management and wishlist interface`
- [ ] **Commit 5.2:** `feat(payment): integrate razorpay payment gateway and verify payment signature`
- [ ] **Commit 5.3:** `feat(reviews): add course rating and review modal and testimonial slider`
- [ ] **Commit 5.4:** `feat(profile): implement user profile settings and account deletion`
- [ ] **Commit 5.5:** `chore: build verification, environment configurations, and release polish`

---

## 👤 Author
- **GitHub:** [@Aishwarya0429](https://github.com/Aishwarya0429)
