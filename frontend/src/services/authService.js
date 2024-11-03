import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  async register(email, password) {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      password,
    });
    return response.data;
  },

  async getMe() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  }
};

export default authService; 