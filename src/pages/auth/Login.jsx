import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { 
  BookOpen, Target, Users, LineChart, CheckCircle, 
  ShieldCheck, Zap, Cloud, Mail, Lock, Eye, EyeOff, 
  Moon, Sun, Loader2, Building, Phone
} from 'lucide-react';
import './Login.css';

// ── Shared Left Side Content ──────────────────────────────────────────────
const LeftSideContent = () => (
  <div className="login-left">
    <img 
      src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" 
      alt="Modern Classroom" 
      className="login-bg-image" 
    />
    <div className="login-bg-overlay"></div>
    <div className="login-bg-gradient"></div>
    
    <div className="login-shape login-shape-1"></div>
    <div className="login-shape login-shape-2"></div>
    
    <div className="login-left-content">
      <div className="login-brand">
        <BookOpen size={40} className="login-brand-icon" />
        <h1>MentorLog</h1>
      </div>
      
      <div className="login-hero-text">
        <h2>Empowering Academies.<br/>Elevating Learning.</h2>
        <p>The intelligent academy management platform that connects administrators, tutors, students, and parents through AI-powered progress tracking, attendance, analytics, and performance insights.</p>
      </div>
      
      <div className="login-features">
        <div className="login-feature-item">
          <Target size={24} className="login-feature-icon" />
          <div className="login-feature-text">
            <h3>AI Student Progress Tracking</h3>
            <p>Track every student's academic journey in real time.</p>
          </div>
        </div>
        <div className="login-feature-item">
          <Users size={24} className="login-feature-icon" />
          <div className="login-feature-text">
            <h3>Tutor Management</h3>
            <p>Manage tutors, schedules, attendance and performance effortlessly.</p>
          </div>
        </div>
        <div className="login-feature-item">
          <LineChart size={24} className="login-feature-icon" />
          <div className="login-feature-text">
            <h3>Smart Analytics</h3>
            <p>Understand student performance using AI insights.</p>
          </div>
        </div>
        <div className="login-feature-item">
          <CheckCircle size={24} className="login-feature-icon" />
          <div className="login-feature-text">
            <h3>Homework & Attendance</h3>
            <p>Everything managed from one intelligent platform.</p>
          </div>
        </div>
      </div>
      
      <div className="login-trust">
        <span><ShieldCheck size={18} /> Secure Platform</span>
        <span><Zap size={18} /> Fast Performance</span>
        <span><Cloud size={18} /> Cloud Ready</span>
        <span><LineChart size={18} /> Real-Time Analytics</span>
        <span><Users size={18} /> Trusted by Leading Academies</span>
      </div>
    </div>
  </div>
);

// ── Main Login Page ──────────────────────────────────────────────
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState('dark');
  
  // Setup state
  const [adminExists, setAdminExists] = useState(null);
  const [setupDone, setSetupDone] = useState(false);
  const [isRegisteringAdmin, setIsRegisteringAdmin] = useState(false);
  
  // Role State
  const [loginRole, setLoginRole] = useState('admin');

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const exists = api.checkAdminExists();
    setAdminExists(exists);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleRoleChange = (role) => {
    setLoginRole(role);
    setError('');
    setEmail('');
    setPassword('');
    setIsRegisteringAdmin(false);
  };

  const handleLoginSubmit = async (e) => {
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

  if (adminExists === null) return null;
  const showSetup = isRegisteringAdmin;

  return (
    <div className="login-wrapper" data-theme={theme}>
      <LeftSideContent />
      
      <div className="login-right">
        <button 
          className="login-theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="login-card-modern">
          {showSetup ? (
            <AdminSetupForm 
              onSuccess={() => {
                setIsRegisteringAdmin(false);
                setSetupDone(true);
                setAdminExists(true);
              }}
              onCancel={() => setIsRegisteringAdmin(false)}
            />
          ) : (
            <>
              <div className="login-card-header">
                <div className="login-card-icon">
                  <BookOpen size={28} />
                </div>
                <h2>Welcome Back 👋</h2>
                <p>Sign in to continue to your MentorLog workspace.</p>
              </div>

              <div className="login-role-tabs">
                <button 
                  className={`login-role-tab ${loginRole === 'admin' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('admin')}
                  type="button"
                >
                  Admin
                </button>
                <button 
                  className={`login-role-tab ${loginRole === 'tutor' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('tutor')}
                  type="button"
                >
                  Tutor
                </button>
                <button 
                  className={`login-role-tab ${loginRole === 'student' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('student')}
                  type="button"
                >
                  Student
                </button>
              </div>

              {setupDone && (
                <div className="login-error-msg" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
                  ✅ Admin account created! Please sign in.
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="login-form-modern" autoComplete="on">
                
                <div className="login-input-group">
                  <input
                    type="email"
                    className="login-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete={loginRole === 'admin' ? 'off' : 'username'}
                    name={loginRole === 'admin' ? 'admin_email_no_autofill' : 'email'}
                  />
                  <Mail className="login-input-icon" size={20} />
                  <label className="login-label">Email Address</label>
                </div>

                <div className="login-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={loginRole === 'admin' ? 'new-password' : 'current-password'}
                    name={loginRole === 'admin' ? 'admin_password_no_autofill' : 'password'}
                  />
                  <Lock className="login-input-icon" size={20} />
                  <label className="login-label">Password</label>
                  <button 
                    type="button" 
                    className="login-input-action"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="login-options">
                  <label className="login-checkbox-group">
                    <input type="checkbox" className="login-checkbox" />
                    <span>Remember me</span>
                  </label>
                  {loginRole === 'admin' && (
                    <a href="#" className="login-forgot-link">Forgot Password?</a>
                  )}
                </div>

                {error && (
                  <div className="login-error-msg">
                    <ShieldCheck size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="login-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="login-spinner" size={20} />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {loginRole !== 'admin' ? (
                <div className="login-bottom-text">
                  Need access? <br />
                  Please contact your academy administrator.
                </div>
              ) : (
                <div className="login-bottom-text">
                  Don't have an account? <br />
                  <button 
                    type="button" 
                    className="login-forgot-link" 
                    onClick={() => setIsRegisteringAdmin(true)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'inherit', marginTop: '0.5rem' }}
                  >
                    Register for Academy
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Admin Setup Form (Restyled to match new theme) ──────────────────────
const AdminSetupForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '', academyName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Name, email, and password are required.'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.'); return;
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
    <>
      <div className="login-card-header">
        <div className="login-card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
          <ShieldCheck size={28} />
        </div>
        <h2>Set Up Admin Account</h2>
        <p>Create the primary administrator account to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form-modern" autoComplete="off">
        <div className="login-input-group">
          <input type="text" name="name" className="login-input" placeholder=" " value={formData.name} onChange={handleChange} required />
          <Users className="login-input-icon" size={20} />
          <label className="login-label">Full Name</label>
        </div>

        <div className="login-input-group">
          <input type="text" name="academyName" className="login-input" placeholder=" " value={formData.academyName} onChange={handleChange} />
          <Building className="login-input-icon" size={20} />
          <label className="login-label">Academy Name</label>
        </div>

        <div className="login-input-group">
          <input type="email" name="email" className="login-input" placeholder=" " value={formData.email} onChange={handleChange} required />
          <Mail className="login-input-icon" size={20} />
          <label className="login-label">Admin Email</label>
        </div>

        <div className="login-input-group">
          <input type="tel" name="phone" className="login-input" placeholder=" " value={formData.phone} onChange={handleChange} />
          <Phone className="login-input-icon" size={20} />
          <label className="login-label">Phone Number (optional)</label>
        </div>

        <div className="login-input-group">
          <input type={showPassword ? 'text' : 'password'} name="password" className="login-input" placeholder=" " value={formData.password} onChange={handleChange} required />
          <Lock className="login-input-icon" size={20} />
          <label className="login-label">Password</label>
          <button type="button" className="login-input-action" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="login-input-group">
          <input type={showPassword ? 'text' : 'password'} name="confirmPassword" className="login-input" placeholder=" " value={formData.confirmPassword} onChange={handleChange} required />
          <Lock className="login-input-icon" size={20} />
          <label className="login-label">Confirm Password</label>
        </div>

        {error && (
          <div className="login-error-msg">
            <ShieldCheck size={18} />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="login-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 className="login-spinner" size={20} /> Setting Up...</>
          ) : 'Create Admin Account'}
        </button>
        
        <button 
          type="button" 
          onClick={onCancel}
          style={{ background: 'none', border: 'none', color: 'var(--login-text-secondary)', cursor: 'pointer', marginTop: '1rem', width: '100%' }}
        >
          Back to Login
        </button>
      </form>
    </>
  );
};

