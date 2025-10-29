-- Settings Tables Schema

-- Table for 구분 관리 (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(10) NOT NULL,
  icon LONGTEXT,
  description VARCHAR(100),
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for 세부 항목 관리 (Detail Items)
CREATE TABLE IF NOT EXISTS detail_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(10) NOT NULL,
  icon LONGTEXT,
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for 약관 설정 (Terms)
CREATE TABLE IF NOT EXISTS terms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  term_type VARCHAR(50) NOT NULL UNIQUE,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for 설문조사 발송링크 (Survey Settings)
CREATE TABLE IF NOT EXISTS survey_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  google_form_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default data for categories (구분 관리)
INSERT INTO categories (title, icon, description, display_order) VALUES
('보험금 청구 상담', '', '전문성담자가 고객님의 상담을 도와드립니다.\n빠르고 정확한 업무를 위해 잠시만 기다려주세요.', 1),
('무료 보험 상담', '', '전문성담자가 3회차 예약도의 상담을 도와드립니다.\n빠르고 정확한 업무를 위해 잠시만 기다려주세요.', 2);

-- Insert default data for detail items (세부 항목 관리)
INSERT INTO detail_items (title, icon, display_order) VALUES
('실손보험', '', 1),
('수술비', '', 2),
('진단비', '', 3),
('기타 상담', '', 4);

-- Insert default data for terms (약관 설정)
INSERT INTO terms (term_type, content) VALUES
('privacy', ''),
('service', ''),
('consultation', ''),
('marketing', '');

-- Insert default data for survey settings
INSERT INTO survey_settings (google_form_url) VALUES ('');
