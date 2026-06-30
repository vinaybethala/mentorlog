import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';

// Placeholder imports (will be created next)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminTutors } from './pages/admin/AdminTutors';
import { TutorDashboard } from './pages/tutor/TutorDashboard';
import { TutorLog } from './pages/tutor/TutorLog';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ParentDashboard } from './pages/parent/ParentDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Layout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="tutors" element={<AdminTutors />} />
          </Route>

          {/* Tutor Routes */}
          <Route path="/tutor" element={<Layout role="tutor" />}>
            <Route index element={<TutorDashboard />} />
            <Route path="log" element={<TutorLog />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<Layout role="student" />}>
            <Route index element={<StudentDashboard />} />
          </Route>

          {/* Parent Routes */}
          <Route path="/parent" element={<Layout role="parent" />}>
            <Route index element={<ParentDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
