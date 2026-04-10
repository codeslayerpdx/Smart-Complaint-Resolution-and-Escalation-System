import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { ComplaintContext } from '../context/ComplaintContext';
import './RaiseComplaint.css';

const RaiseComplaint = () => {
  const { addComplaint } = useContext(ComplaintContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'low',
    location: '',
    description: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert("Category is required");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority
        })
      });

      if (response.ok) {
        addComplaint({
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          location: formData.location,
          description: formData.description
        });
        alert('Complaint raised successfully!');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create complaint.');
      }
    } catch (err) {
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="raise-complaint-page">
      <div className="page-header">
        <h1 className="page-title">Raise a Complaint</h1>
        <p className="page-subtitle">Fill in the details below to register a new issue.</p>
      </div>

      <div className="form-container">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="form-content">
              <Input
                id="title"
                label="Complaint Title *"
                placeholder="e.g. AC not working in room 103"
                value={formData.title}
                onChange={handleChange}
                required
              />
              
              <div className="form-row">
                <Input
                  id="category"
                  label="Category *"
                  type="select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water & Plumbing</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="security">Security</option>
                  <option value="network">Network/Wi-Fi</option>
                  <option value="other">Other</option>
                </Input>

                <Input
                  id="priority"
                  label="Priority Level *"
                  type="select"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Input>
              </div>

              <Input
                id="location"
                label="Exact Location / Room No *"
                placeholder="e.g. Block A, Room 402"
                value={formData.location}
                onChange={handleChange}
                required
              />

              <Input
                id="description"
                label="Detailed Description *"
                type="textarea"
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </CardContent>
            <CardFooter className="form-footer">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Complaint
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RaiseComplaint;
