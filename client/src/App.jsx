
import { useState } from 'react';
import './App.css';
import Dashboard from './dashboard';
import API_BASE_URL from './api';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(
  localStorage.getItem('taskflowToken')
);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError('');
  setSuccess('');
  setLoading(true);

  const endpoint = isLogin
    ? `${API_BASE_URL}/api/auth/login`
    : `${API_BASE_URL}/api/auth/register`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }

    if (isLogin) {
      if (!data.token) {
        throw new Error('Login succeeded, but no token was returned.');
      }

      localStorage.setItem('taskflowToken', data.token);
      setToken(data.token);
      setSuccess('Login successful! Your account is authenticated.');
    } else {
      setSuccess('Account created successfully! You can now log in.');

      setIsLogin(true);
      setFormData({
        name: '',
        email: formData.email,
        password: '',
      });
    }
  } catch (err) {
    setError(err.message || 'Unable to connect to the server.');
  } finally {
    setLoading(false);
  }
};
const handleLogout = () => {
  localStorage.removeItem('taskflowToken');
  setToken(null);
  setIsLogin(true);
  setFormData({ name: '', email: '', password: '' });
};

  const switchMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };
  if (token) {
    return (
      <Dashboard
        token={token}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-container">
        <div className="auth-brand">
          <div className="brand-icon">T</div>
          <span>TaskFlow</span>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">YOUR PRODUCTIVITY, SIMPLIFIED</p>
          <h1>{isLogin ? 'Welcome back!' : 'Create your account'}</h1>
          <p>
            {isLogin
              ? 'Log in to continue managing your tasks.'
              : 'Get organised and make every day count.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="message error-message">{error}</p>}
          {success && <p className="message success-message">{success}</p>}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="form-options">
              <label className="remember-option">
                <input type="checkbox" />
                Remember me
              </label>
              <button type="button" className="text-button">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Log in'
                : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={switchMode}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

        <p className="auth-footer">
          © 2026 TaskFlow. Stay focused. Get things done.
        </p>
      </section>

      <section className="auth-visual">
        <div className="visual-content">
          <div className="visual-tag">PLAN. PRIORITISE. ACHIEVE.</div>
          <h2>Make space for what matters.</h2>
          <p>
            Bring your tasks together, stay on top of your priorities,
            and turn your plans into progress.
          </p>

          <div className="preview-card">
            <div className="preview-top">
              <span>Today's focus</span>
              <span className="preview-date">YOUR TASKS</span>
            </div>
            <div className="preview-task">
              <span className="task-check">✓</span>
              <span>Plan your week</span>
              <span className="task-done">Done</span>
            </div>
            <div className="preview-task">
              <span className="task-check empty"></span>
              <span>Complete important tasks</span>
              <span className="task-priority">High</span>
            </div>
            <div className="preview-task">
              <span className="task-check empty"></span>
              <span>Review your progress</span>
              <span className="task-priority medium">Medium</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
