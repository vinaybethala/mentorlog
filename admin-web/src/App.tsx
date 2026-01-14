import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tutors from './pages/Tutors';
import Parents from './pages/Parents';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="tutors" element={<Tutors />} />
                            <Route path="parents" element={<Parents />} />
                            <Route path="students" element={<Students />} />
                            <Route path="reports" element={<Reports />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
