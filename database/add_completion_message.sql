-- Add completion_message column to consultation_categories table
ALTER TABLE consultation_categories
ADD COLUMN completion_message VARCHAR(500) COMMENT '선정완료 메시지 (최대 100자)' AFTER category_icon;
