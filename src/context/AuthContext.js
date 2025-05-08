import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  // لیست کاربران تستی
  const TEST_USERS = [
    {
      username: "admin",
      password: "admin27231",
      name: "مدیر سیستم",
      email: "admin@example.com",
      phone: "09121234567",
      department: "IT",
      specialization: "مدیریت سیستم",
      personalCode: "100001"
    },
      {
      username: "Ali_Mashhadi",
      password: "2723101386",
      name: "علی مشهدی",
      email: "mashhadia640@gmail.com",
      phone: "09195379488",
      department: "IT",
      specialization: "مدیریت سیستم",
      personalCode: "27231"
    },
      {
      username: "hajrezvan",
      password: "hajrezvan",
      name: "Haj Rezvan",
      email: "Haj.Rezvan@salman27.com",
      phone: "09376226180",
      department: "IT",
      specialization: "مدیریت سیستم",
      personalCode: "100001"
    },
      {
      username: "user",
      password: "user272",
      name: "کاربر عادی",
      email: "user@salman27.com",
      phone: "",
      department: "",
      specialization: "",
      personalCode: ""
    },
    {
      username: "test",
      password: "test123",
      name: "دکتر علی رضایی",
      email: "Dr.Ali.Rezaeei@gmail.com",
      phone: "091256680635",
      department: "داخلی",
      specialization: "متخصص داخلی",
      personalCode: "200682",
    }
  ];

  const login = async (credentials) => {
    try {
      // بررسی کاربران تستی
      const testUser = TEST_USERS.find(user =>
        user.username === credentials.username && user.password === credentials.password
      );

      if (testUser) {
        const userData = {
          ...testUser,
          isLoggedIn: true,
          isTestUser: true
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard');
        return;
      }

      // اگر اطلاعات تست نبود، درخواست به API ارسال شود
      const response = await axios.post('YOUR_API_ENDPOINT/login', credentials);
      const userData = {
        ...response.data,
        isLoggedIn: true,
        isTestUser: false
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');

    } catch (error) {
      throw new Error(error.response?.data?.message || 'خطا در ورود به سیستم');
    }
  };

  const logout = () => {
    if (user && !user.isTestUser) {
      // اگر کاربر تستی نیست، درخواست لاگ‌اوت به API ارسال شود
      try {
        axios.post('YOUR_API_ENDPOINT/logout');
      } catch (error) {
        console.error('خطا در خروج از سیستم:', error);
      }
    }

    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
