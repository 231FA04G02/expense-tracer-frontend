import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import axios from 'axios';
import './index.css';

const API_URL = 'https://expense-tracer-backend-34qu.vercel.app'

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [notification, setNotification] = useState('');

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSignup = async (name, email, password) => {
    if (!name || !email || !password) {
      showNotification('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        showNotification('Account created successfully! Please log in.');
        setCurrentPage('login');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          showNotification(error.response.data.errors.join(', '));
        } else {
          showNotification(error.response.data.msg || 'Signup failed');
        }
      } else {
        showNotification('Network error. Please try again.');
      }
    }
  };

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      showNotification('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const userData = { email, name: 'User' };
        setUser(userData);
        setCurrentPage('dashboard');
        showNotification('Welcome back!');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          showNotification(error.response.data.errors.join(', '));
        } else {
          showNotification(error.response.data.msg || 'Login failed');
        }
      } else {
        showNotification('Network error. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    showNotification('You have logged out successfully.');
  };

  return (
    <div>
      <Navbar user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} handleLogout={handleLogout} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} handleLogin={handleLogin} />}
        {currentPage === 'signup' && <SignUpPage setCurrentPage={setCurrentPage} handleSignup={handleSignup} />}
        {currentPage === 'dashboard' && <DashboardPage showNotification={showNotification} />}
      </div>
      {notification && <div id="notification" className="show">{notification}</div>}
    </div>
  );
};

export default App;
