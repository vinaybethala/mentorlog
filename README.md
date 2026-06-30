<div align="center">

<img src="https://img.shields.io/badge/MentorLog-AI%20Academy%20Platform-6366f1?style=for-the-badge&logo=bookopen&logoColor=white" alt="MentorLog Badge" />

# 📚 MentorLog

### The Intelligent, AI-Powered Academy Management Platform

**MentorLog** is a full-featured academy management system designed for modern educational institutions. It connects Admins, Tutors, Students, and Parents through a seamless, beautifully designed interface — with real-time analytics, progress tracking, attendance management, fee management, and more.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter)](https://reactrouter.com)
[![Recharts](https://img.shields.io/badge/Recharts-3-22c55e?style=flat-square)](https://recharts.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

</div>

## ✨ Features

### 🔐 Role-Based Authentication
- **Three separate login portals** — Admin, Tutor, and Student
- Admin-only **Academy Registration** flow (first-time setup)
- Autofill disabled for admin login for security
- Forgot Password only available for Admin
- Students & Tutors redirected to contact admin

### 🛡️ Admin Portal
| Feature | Description |
|---|---|
| 📊 Dashboard | Live KPIs, at-risk student alerts, fee summary, activity feed |
| 👨‍🎓 Student Management | Add, edit, view all students with full profile and status control |
| 👩‍🏫 Tutor Management | Manage tutors, their schedules, and performance data |
| 💰 Fee Management | Track payments, set fee amounts, mark paid/partial |
| 📈 Reports & Analytics | Subject distribution, attendance trends, homework completion rates |
| 🔔 Notification System | In-app notifications for all roles |

### 📖 Tutor Portal
- **Session Log** — Record student progress logs per subject and topic
- View assigned students and their performance
- Mark attendance, assign homework

### 🎓 Student Portal
- View personal dashboard with progress, attendance, homework status
- Fee status and payment history
- Real-time notifications

### 👨‍👩‍👧 Parent Portal
- Monitor linked student's progress
- View attendance, homework, and fees

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) **v18+**
- npm **v9+**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vinaybethala/mentorlog.git
cd mentorlog

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be live at **`http://localhost:5173`**

---

## 🏗️ Project Structure

```
mentorlog/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── layout/          # App shell — sidebar, top header, Layout
│   │   └── ui/              # Reusable UI components (Button, Card, Input, Modal, etc.)
│   ├── contexts/
│   │   └── AuthContext.jsx  # Global authentication state
│   ├── pages/
│   │   ├── auth/            # Login page (role tabs, admin registration)
│   │   ├── admin/           # Admin dashboard, students, tutors, fees, reports
│   │   ├── tutor/           # Tutor dashboard and session log
│   │   ├── student/         # Student dashboard
│   │   └── parent/          # Parent portal
│   ├── services/
│   │   └── api.js           # LocalStorage-backed data API (mock backend)
│   ├── App.jsx              # Root router
│   └── index.css            # Global design system tokens
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Design System

MentorLog features a **premium, handcrafted design system** with:

- **Glassmorphism UI** on the Login page
- Animated gradient backgrounds with floating shape elements
- Custom CSS design tokens (spacing, typography, radius, shadows, colors)
- **Dark & Light mode** on the Login page (toggle in top-right corner)
- Smooth micro-animations and hover transitions throughout
- **Fully responsive layout** — works on desktop, tablet, and mobile

### Color Palette
| Token | Usage |
|---|---|
| `--color-primary-*` | Brand blue-indigo gradient |
| `--color-surface` | Card and panel backgrounds |
| `--color-background` | Page background |
| `--color-text-*` | Primary, secondary, tertiary text |
| `--color-danger` | Errors and warnings |
| `--color-success` | Confirmations and positive states |

---

## 📱 Responsive Design

| Breakpoint | Behavior |
|---|---|
| **≥ 1024px** | Full two-column layout with fixed sidebar |
| **768px – 1024px** | Reduced padding, same layout |
| **≤ 768px** | Mobile sidebar (slide-in drawer with overlay + hamburger) |
| **≤ 480px** | Compact spacing and smaller typography |

---

## 🔑 Demo Credentials

> ⚠️ Data is stored in your browser's **localStorage**. No backend or database required.

| Role | Email | Password |
|---|---|---|
| **Tutor** | `tutor1@mentorlog.com` | `password` |
| **Student** | `student1@mentorlog.com` | `password` |
| **Parent** | `parent1@mentorlog.com` | `password` |

**Admin:** Register a new academy on the login page → click **"Register for Academy"** on the Admin tab.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vitejs.dev) | Build tool & dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Recharts](https://recharts.org) | Charts and analytics visualizations |
| [Lucide React](https://lucide.dev) | Icon library |
| [date-fns](https://date-fns.org) | Date formatting utilities |
| Vanilla CSS | Styling — no Tailwind, no UI libraries |
| localStorage | Mock data persistence (no backend required) |

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server (http://localhost:5173)
npm run build     # Build for production (output: /dist)
npm run preview   # Preview the production build locally
npm run lint      # Run OxLint for code quality checks
```

---

## 🚢 Deployment

MentorLog is a static single-page app — it can be deployed to any static hosting provider with **zero configuration**.

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Build the app
npm run build

# Drag and drop the /dist folder into Netlify UI
# OR use Netlify CLI:
npx netlify-cli deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

npm run build
npm run deploy
```

> **Note:** Since this is a client-side SPA using React Router, make sure your hosting provider is configured to redirect all routes to `index.html`. On Netlify, add a `public/_redirects` file with `/* /index.html 200`.

---

## 🧩 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                      Browser                         │
│                                                       │
│  ┌─────────┐   ┌────────────┐   ┌────────────────┐  │
│  │  Login  │──▶│ AuthContext│──▶│ Role-based      │  │
│  │  Page   │   │ (useState) │   │ Protected Routes│  │
│  └─────────┘   └────────────┘   └────────────────┘  │
│                                         │             │
│                        ┌────────────────┼──────────┐  │
│                        ▼               ▼           ▼  │
│                   ┌─────────┐  ┌──────────┐  ┌──────┐│
│                   │  Admin  │  │  Tutor   │  │Student││
│                   │  Pages  │  │  Pages   │  │ Pages ││
│                   └────┬────┘  └────┬─────┘  └──┬───┘│
│                        │            │            │     │
│                        └────────────┴────────────┘     │
│                                     │                   │
│                              ┌──────▼──────┐            │
│                              │   api.js    │            │
│                              │ (localStorage)│          │
│                              └─────────────┘            │
└─────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **Vinay Bethala**

⭐ If you found this useful, please give it a star!

</div>
