const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Handle token fetching errors
const handleResponse = async (response) => {
  if (response.status === 401) {
    throw new Error('Unauthorized: Missing or invalid token.');
  }
  if (response.status === 403) {
    throw new Error('Forbidden: You do not have permission for this action.');
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'An error occurred during the request.');
  }
  return response.json();
};

export const fetchComplaints = async () => {
  const role = localStorage.getItem('userRole'); // Relies on login setting it
  const endpoint = role === 'student' ? '/complaints/my' : '/complaints';
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const fetchComplaint = async (id) => {
  const response = await fetch(`${API_URL}/complaints/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const fetchAssignedComplaints = async () => {
  const response = await fetch(`${API_URL}/complaints/assigned`, {
    method: 'GET',
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const fetchNotifications = async () => {
  const response = await fetch(`${API_URL}/notifications`, {
    method: 'GET',
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const sendNotification = async (payload) => {
  console.log("Sending notification:", payload.message);
  
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    
    console.log("Response status:", response.status);
    return await handleResponse(response);
  } catch (error) {
    console.error("API Error sending notification:", error);
    throw error;
  }
};

export const updateComplaintStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/complaints/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  
  return handleResponse(response);
};

export const assignComplaint = async (id, userId) => {
  const response = await fetch(`${API_URL}/complaints/assign/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ assignedTo: userId })
  });
  
  return handleResponse(response);
};

export const fetchSummary = async () => {
  const response = await fetch(`${API_URL}/complaints/summary`, {
    method: 'GET',
    headers: getHeaders()
  });

  return handleResponse(response);
};

export const fetchEscalated = async () => {
  const response = await fetch(`${API_URL}/complaints/escalated`, {
    method: 'GET',
    headers: getHeaders()
  });

  return handleResponse(response);
};
