'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Smartphone,
  UserCircle,
  Settings
} from 'lucide-react';
import styles from './AdminDashboard.module.css';
import LoginPage from './LoginPage';
import Sidebar from './Sidebar';
import ConsultationManagement from './ConsultationManagement';
import SurveyManagement from './SurveyManagement';
import DeviceManagement from './DeviceManagement';
import ConsultantManagement from './ConsultantManagement';
import SettingsPage from './SettingsPage';
import LogoutPopup from './LogoutPopup';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedMenu, setSelectedMenu] = useState('consultation');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.id) {
          setIsLoggedIn(true);
          setCurrentPage('dashboard');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const handleLogin = async () => {
    if (!loginForm.id || !loginForm.password) {
      setLoginError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoggingIn(true);
      setLoginError('');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
        setLoginError('');
        // Store user session in localStorage
        localStorage.setItem('adminUser', JSON.stringify(data.user));
      } else {
        setLoginError(data.message || '아이디 혹은 비밀번호가 잘못되어 있습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setLoginForm({ id: '', password: '' });
    setLoginError('');
    setShowLogoutPopup(false);
    // Clear localStorage
    localStorage.removeItem('adminUser');
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loginError={loginError}
        isLoggingIn={isLoggingIn}
      />
    );
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        handleLogout={handleLogout}
      />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {selectedMenu === 'consultation' && '상담 관리'}
            {selectedMenu === 'survey' && '설문 관리'}
            {selectedMenu === 'device' && '기기 관리'}
            {selectedMenu === 'consultant' && '전문가 관리'}
            {selectedMenu === 'settings' && '설정'}
          </h2>
        </div>

        {selectedMenu === 'consultation' && <ConsultationManagement />}
        {selectedMenu === 'survey' && <SurveyManagement />}
        {selectedMenu === 'device' && <DeviceManagement />}
        {selectedMenu === 'consultant' && <ConsultantManagement />}
        {selectedMenu === 'settings' && <SettingsPage />}
      </div>

      {showLogoutPopup && (
        <LogoutPopup
          confirmLogout={confirmLogout}
          setShowLogoutPopup={setShowLogoutPopup}
        />
      )}
    </div>
  );
}
