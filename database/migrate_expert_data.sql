-- 기존 devices.last_access_expert 데이터를 device_expert_mapping으로 마이그레이션
-- 실행 전 주의사항:
-- 1. 데이터베이스 백업을 먼저 수행하세요
-- 2. experts 테이블에 전문가 데이터가 먼저 입력되어 있어야 합니다

-- Step 1: last_access_expert에 값이 있는 기기 확인
SELECT
    device_id,
    device_name,
    last_access_expert
FROM devices
WHERE last_access_expert IS NOT NULL
  AND last_access_expert != '';

-- Step 2: 마이그레이션 실행
-- last_access_expert 값을 expert_name과 매칭하여 device_expert_mapping에 삽입
INSERT INTO device_expert_mapping (device_id, expert_id, display_type, display_order)
SELECT
    d.device_id,
    e.expert_id,
    CASE
        WHEN e.is_fixed = TRUE THEN 'fixed'
        ELSE 'random'
    END as display_type,
    1 as display_order
FROM devices d
INNER JOIN experts e ON d.last_access_expert = e.expert_name
WHERE d.last_access_expert IS NOT NULL
  AND d.last_access_expert != ''
  AND NOT EXISTS (
    SELECT 1
    FROM device_expert_mapping dem
    WHERE dem.device_id = d.device_id
      AND dem.expert_id = e.expert_id
  );

-- Step 3: 마이그레이션 결과 확인
SELECT
    d.device_id,
    d.device_name,
    d.ssaid,
    d.last_access_expert,
    e.expert_name,
    dem.display_type,
    dem.display_order
FROM devices d
LEFT JOIN device_expert_mapping dem ON d.device_id = dem.device_id
LEFT JOIN experts e ON dem.expert_id = e.expert_id
ORDER BY d.device_id, dem.display_order;

-- Step 4 (선택사항): 마이그레이션 완료 후 last_access_expert 컬럼 NULL 처리
-- UPDATE devices SET last_access_expert = NULL WHERE last_access_expert IS NOT NULL;
