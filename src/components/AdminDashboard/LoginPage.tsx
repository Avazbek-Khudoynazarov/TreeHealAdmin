import React from 'react';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  loginForm: { id: string; password: string };
  setLoginForm: (form: { id: string; password: string }) => void;
  handleLogin: () => void;
  loginError: string;
  isLoggingIn: boolean;
}

export default function LoginPage({ loginForm, setLoginForm, handleLogin, loginError, isLoggingIn }: LoginPageProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <div className={styles.logoPlaceholder}>
            <img src="/assets/admin/adminlogo.svg" alt="TreeHeal" className={styles.logoImage} />
          </div>
          <p className={styles.subtitle}>관리자 로그인</p>
        </div>

        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              value={loginForm.id}
              onChange={(e) => setLoginForm({ ...loginForm, id: e.target.value })}
              placeholder="아이디를 입력해주세요"
              className={styles.input}
              onKeyDown={handleKeyPress}
              disabled={isLoggingIn}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="비밀번호를 입력해주세요"
              className={styles.input}
              onKeyDown={handleKeyPress}
              disabled={isLoggingIn}
            />
          </div>
          {loginError && (
            <p className={styles.errorText}>
              {loginError}
            </p>
          )}
          <button
            onClick={handleLogin}
            className={styles.loginButton}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  );
}
