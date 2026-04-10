import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' // default role for testing
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext to store full user details
        login(data.user, data.token);

        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <AlertCircle size={40} className="logo-icon" />
          <h1>SmartFix</h1>
          <p>Login to your account to manage complaints.</p>
        </div>

        <Card className="auth-card">
          <CardHeader title="Sign In" />
          <CardContent>
            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                id="role"
                label="Login As (Demo Feature)"
                type="select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="staff">Staff/Maintenance</option>
                <option value="admin">Administrator</option>
              </Input>

              <Button type="submit" variant="primary" fullWidth className="mt-4" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="auth-footer">
              Don't have an account? <Link to="/register">Register here</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
