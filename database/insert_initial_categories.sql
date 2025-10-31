-- consultation_categories 테이블 초기 데이터 삽입
-- 기존 데이터가 있는지 확인 후 삽입

-- 1. 보험보상상담 (보상청구)
INSERT INTO consultation_categories (category_name, category_icon, completion_message, display_order, is_active)
VALUES
  ('보험보상상담', NULL, '보험보상 전문가가 곧 연락드릴 예정입니다.', 1, TRUE)
ON DUPLICATE KEY UPDATE
  category_name = category_name;

-- 2. 보험무료상담
INSERT INTO consultation_categories (category_name, category_icon, completion_message, display_order, is_active)
VALUES
  ('보험무료상담', NULL, '보험 전문가가 곧 연락드릴 예정입니다.', 2, TRUE)
ON DUPLICATE KEY UPDATE
  category_name = category_name;

-- 결과 확인
SELECT * FROM consultation_categories ORDER BY display_order;
