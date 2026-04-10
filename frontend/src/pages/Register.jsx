import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (response.ok) {
        alert('Account created! Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <AlertCircle size={40} className="logo-icon" />
          <h1>SmartFix</h1>
          <p>Create a new account</p>
        </div>

        <Card className="auth-card">
          <CardHeader title="Register" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input
                id="name"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />

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
                label="Register As"
                type="select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="staff">Staff/Maintenance</option>
              </Input>

              <Button type="submit" variant="primary" fullWidth className="mt-4">
                Create Account
              </Button>
            </form>
            
            <div className="auth-footer">
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
