import React from 'react';
import { Users, FileText, Smartphone, UserCircle, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
  handleLogout: () => void;
}

export default function Sidebar({ selectedMenu, setSelectedMenu, handleLogout }: SidebarProps) {
  const menuItems = [
    { id: 'consultation', label: '상담 관리', icon: Users },
    { id: 'survey', label: '설문 관리', icon: FileText },
    { id: 'device', label: '기기 관리', icon: Smartphone },
    { id: 'consultant', label: '전문가 관리', icon: UserCircle },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img src="/assets/admin/adminlogo.svg" alt="TreeHeal" className={styles.logoImage} />
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.menuList}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedMenu(item.id)}
                className={`${styles.menuItem} ${
                  selectedMenu === item.id ? styles.menuItemActive : ''
                }`}
              >
                <Icon className={styles.icon} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className={styles.logoutContainer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          로그아웃
        </button>
      </div>
    </div>
  );
}
