import React from 'react';
import styles from './LogoutPopup.module.css';

interface LogoutPopupProps {
  confirmLogout: () => void;
  setShowLogoutPopup: (show: boolean) => void;
}

export default function LogoutPopup({ confirmLogout, setShowLogoutPopup }: LogoutPopupProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3 className={styles.title}>로그아웃</h3>
        <p className={styles.message}>로그아웃 하시겠습니까?</p>
        <div className={styles.buttonGroup}>
          <button onClick={() => setShowLogoutPopup(false)} className={styles.cancelButton}>
            취소
          </button>
          <button onClick={confirmLogout} className={styles.confirmButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
