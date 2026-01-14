# MentorLog

MentorLog is a full-stack, multi-platform tutor–student management system designed to
digitize and streamline academic session tracking, progress monitoring, and planning
for tutors, academies, and students.

---

## 🚩 Problem Statement

In most coaching centers and private tutoring setups:
- Tutor attendance and leave tracking is manual
- Session details (subject, time, student) are not recorded properly
- Student progress is scattered across notebooks or chats
- Admins lack visibility into daily academic activity

This leads to poor tracking, miscommunication, and inefficiency.

---

## 💡 Solution

MentorLog provides a **centralized digital platform** where:

- Tutors can log sessions with time, subject, and student details
- Students can track their progress, homework, and upcoming plans
- Admins can monitor attendance, sessions, and academic planning
- Data is structured, searchable, and scalable

---

## 👥 User Roles

- **Admin**
  - View all tutor and student activity
  - Monitor attendance and academic sessions
  - Manage overall system data

- **Tutor**
  - Log sessions (student, subject, time)
  - Track weekly progress
  - Plan upcoming lessons

- **Student**
  - View session history
  - Track progress and homework
  - Access academic plans

---

## 🏗️ System Architecture (High Level)

Frontend (Admin Web / Mobile Apps)
↓
Backend API (Business Logic & Auth)
↓
Database (Structured Academic Data)


The system is built as a **modular, scalable product**, not a single monolithic script.

---

## 📂 Project Structure

mentorlog/
│
├── backend/ # Backend APIs, authentication, database logic
├── admin-web/ # Web dashboard for admins and tutors
├── mobile-app/ # Student-facing mobile application
├── tutor_mobile/ # Tutor-specific mobile application
├── apks/ # Build artifacts (APK files)
├── .gitignore
├── README.md
└── LICENSE

Each module is developed independently but designed to work together.

---

## 🛠️ Tech Stack

### Backend
- Node.js / Python (API & business logic)
- Database: SQL-based (schema-driven)

### Admin Web
- Modern frontend stack (React-based)
- Responsive dashboard UI

### Mobile Apps
- Flutter (cross-platform Android/iOS support)

### Tools & Practices
- Git & GitHub (version control)
- Modular folder structure
- Clean separation of concerns

---

## 📈 Project Status

🚧 **Active Development**

Current focus:
- Feature stabilization
- Code cleanup & documentation
- Preparing the system for real-world usage scenarios

---

## 🎯 Why This Project Matters

MentorLog demonstrates:
- Full-stack development skills
- Multi-platform system design
- Real-world problem solving
- Ability to structure and scale a product

This is not a demo project — it is a **product-oriented system**.

---

## 📌 Future Improvements

- Role-based authentication
- Analytics dashboard
- Notifications & reminders
- Cloud deployment
- Multi-academy support

---

## 📫 Contact

If you want to discuss this project or collaborate:
- GitHub: https://github.com/vinaybethala

