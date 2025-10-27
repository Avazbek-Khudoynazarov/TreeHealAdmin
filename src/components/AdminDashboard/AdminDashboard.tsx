'use client';

import React, { useState } from 'react';
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

  const handleLogin = () => {
    if (loginForm.id && loginForm.password) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
    setLoginForm({ id: '', password: '' });
    setShowLogoutPopup(false);
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
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
