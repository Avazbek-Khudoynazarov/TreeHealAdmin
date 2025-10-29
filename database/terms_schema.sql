-- Terms settings table for 약관 설정
CREATE TABLE IF NOT EXISTS terms_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  privacy_consent TEXT,
  service_terms TEXT,
  consultation_consent TEXT,
  marketing_consent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO terms_settings (privacy_consent, service_terms, consultation_consent, marketing_consent) VALUES
('', '', '', '');
