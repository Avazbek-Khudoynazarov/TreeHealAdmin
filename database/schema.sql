-- Create consultants table
CREATE TABLE IF NOT EXISTS consultants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  career TEXT,
  qualification TEXT,
  image LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO consultants (name, phone, career, qualification, image) VALUES
('홍길동', '010-1234-5678', '서울대학교 심리학과 졸업\n10년 경력 심리상담사', '심리상담사 1급\n가족상담사 자격증', ''),
('김영희', '010-2345-6789', '연세대학교 상담학과 졸업\n8년 경력 전문상담사', '전문상담사 2급\n청소년상담사', ''),
('이철수', '010-3456-7890', '고려대학교 교육학과 졸업\n15년 경력 교육상담 전문가', '교육상담사 1급\n진로상담사', '');
