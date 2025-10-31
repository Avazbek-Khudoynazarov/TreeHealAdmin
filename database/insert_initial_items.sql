-- detail_items 테이블 초기 데이터 삽입

INSERT INTO detail_items (item_name, item_icon, display_order, is_active)
VALUES
  ('실손', NULL, 1, TRUE),
  ('수술', NULL, 2, TRUE),
  ('진단', NULL, 3, TRUE),
  ('기타', NULL, 4, TRUE)
ON DUPLICATE KEY UPDATE
  item_name = item_name;

-- 결과 확인
SELECT * FROM detail_items ORDER BY display_order;
