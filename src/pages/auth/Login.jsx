import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Button, Input, Card, CardContent } from '../../components/ui';
import { BookOpen, ShieldCheck } from 'lucide-react';
import './Login.css';

// ── Login Form ──────────────────────────────────────────────────
const LoginForm = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'tutor') navigate('/tutor');
      else if (user.role === 'student') navigate('/student');
      else if (user.role === 'parent') navigate('/parent');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <CardContent>
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <div className="login-error">{error}</div>}
          <Button type="submit" size="lg" className="w-full mt-4" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// ── First-Time Admin Setup Form ──────────────────────────────────
const AdminSetupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    academyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await api.createAdmin({
        name: formData.name.trim(),
        academyName: formData.academyName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="login-card">
      <CardContent>
        <div className="login-header">
          <div className="setup-icon-wrapper">
            <ShieldCheck size={32} className="setup-icon" />
          </div>
          <h2>Set Up Admin Account</h2>
          <p>No admin account found. Create the primary admin account to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <Input
            label="Academy Name"
            name="academyName"
            type="text"
            value={formData.academyName}
            onChange={handleChange}
            autoComplete="off"
          />
          <Input
            label="Admin Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <Input
            label="Phone Number (optional)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="off"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
          {error && <div className="login-error">{error}</div>}
          <Button type="submit" size="lg" className="w-full mt-4" isLoading={isLoading}>
            Create Admin Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// ── Main Login Page ──────────────────────────────────────────────
export const Login = () => {
  // null = still checking, true = admin exists, false = first-time setup
  const [adminExists, setAdminExists] = useState(null);
  const [setupDone, setSetupDone] = useState(false);

  useEffect(() => {
    // Check synchronously — no async needed since it reads localStorage
    const exists = api.checkAdminExists();
    setAdminExists(exists);
  }, []);

  const handleSetupSuccess = () => {
    // After creating admin, switch to login form
    setSetupDone(true);
    setAdminExists(true);
  };

  if (adminExists === null) {
    // Brief loading while checking localStorage
    return null;
  }

  const showSetup = !adminExists && !setupDone;

  return (
    <div className="login-container">
      <div className="login-visual glass">
        <BookOpen size={64} className="login-icon" />
        <h1>MentorLog</h1>
        <p>The premium academy management platform.</p>
      </div>
      <div className="login-form-container">
        {showSetup ? (
          <AdminSetupForm onSuccess={handleSetupSuccess} />
        ) : (
          <>
            {setupDone && (
              <div className="setup-success-banner">
                ✅ Admin account created! Please sign in below.
              </div>
            )}
            <LoginForm />
          </>
        )}
      </div>
    </div>
  );
};
