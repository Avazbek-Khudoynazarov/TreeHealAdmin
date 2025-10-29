-- Devices table for 기기 관리
CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account VARCHAR(100) NOT NULL,
  ssaid VARCHAR(100) NOT NULL UNIQUE,
  device_name VARCHAR(30) NOT NULL,
  experts JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO devices (account, ssaid, device_name, experts) VALUES
('test01', '803b849bfa3417', '전안 터미널', '["홍길동(고정)", "김진수", "송이나"]'),
('test01', '703b849bfa3417', '대구 동성로', '[]'),
('test01', '603b849bfa3417', '대전노은점', '[]');
