# Database Setup Instructions

## 1. Production Server에서 데이터베이스 생성

Ubuntu 서버에서 다음 명령어를 실행하세요:

```bash
# MySQL에 로그인
mysql -u treeheal -p treeheal_db

# 또는 root로 로그인
sudo mysql -u root -p
```

## 2. 스키마 실행

서버에 `complete_schema.sql` 파일을 업로드한 후:

```bash
# 현재 프로젝트 디렉토리로 이동
cd ~/treeheal/TreeHealAdmin

# 스키마 파일 실행
mysql -u treeheal -p treeheal_db < database/complete_schema.sql
```

## 3. 기존 데이터 마이그레이션 (선택사항)

기존 `consultants` 테이블의 데이터를 `experts` 테이블로 마이그레이션:

```sql
-- consultants -> experts 데이터 복사
INSERT INTO experts (expert_name, contact_number, specialization, qualifications, profile_image, status)
SELECT name, phone, career, qualification, image, 'active'
FROM consultants;
```

기존 `devices` 테이블이 다른 구조로 있다면:

```sql
-- 기존 devices 데이터 백업
CREATE TABLE devices_backup AS SELECT * FROM devices;

-- 새로운 devices 테이블에 데이터 마이그레이션
-- (기존 구조에 따라 조정 필요)
```

## 4. 데이터베이스 확인

```sql
-- 테이블 목록 확인
SHOW TABLES;

-- 각 테이블의 데이터 확인
SELECT * FROM consultation_categories;
SELECT * FROM detail_items;
SELECT * FROM privacy_consent_items;
SELECT * FROM experts LIMIT 10;
SELECT * FROM devices LIMIT 10;
```

## 5. API 테스트

PM2를 재시작하여 새로운 API 사용:

```bash
cd ~/treeheal/TreeHealAdmin
pm2 restart treeheal-admin
pm2 logs treeheal-admin
```

## API Endpoint

### POST /api/consultation-requests

앱에서 상담 신청 시 사용하는 엔드포인트

**Request Body:**
```json
{
  "device_ssaid": "android_ssaid_value",
  "category_id": 1,
  "applicant_name": "홍길동",
  "contact_number": "01012345678",
  "birth_date": "1990-01-01",
  "gender": "M",
  "residence_region": "서울특별시",
  "residence_detail": "강남구",
  "selected_expert_id": 5,
  "detail_items": ["실손", "수술"],
  "privacy_consents": [
    {
      "consent_item_id": 1,
      "is_agreed": true
    },
    {
      "consent_item_id": 2,
      "is_agreed": true
    },
    {
      "consent_item_id": 3,
      "is_agreed": false
    },
    {
      "consent_item_id": 4,
      "is_agreed": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Consultation request created successfully",
  "data": {
    "request_id": 123,
    "request_number": "REQ-20251029-00001",
    "applicant_name": "홍길동",
    "expert_contact": "01012345678",
    "request_status": "pending"
  }
}
```

### GET /api/consultation-requests

관리자 대시보드에서 상담 신청 목록 조회

**Query Parameters:**
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 개수 (default: 10)
- `q`: 검색어 (신청자명, 연락처, 신청번호)
- `status`: 상태 필터 (pending, assigned, completed, cancelled)

**Example:**
```
GET /api/consultation-requests?page=1&limit=10&status=pending
```

## 주의사항

1. Foreign key constraints가 설정되어 있으므로 테이블 삭제 순서 주의
2. `detail_items` 필드는 JSON 형태로 저장됨
3. `request_number`는 자동 생성되며 유니크해야 함
4. Privacy consents는 별도 테이블에 저장되어 추적 가능

## 문제 해결

### Foreign key constraint 에러
```sql
-- Foreign key check 임시 비활성화
SET FOREIGN_KEY_CHECKS = 0;
-- 작업 수행
SET FOREIGN_KEY_CHECKS = 1;
```

### 테이블 초기화 (개발 환경에서만!)
```sql
-- 모든 데이터 삭제 후 재생성
DROP DATABASE treeheal_db;
CREATE DATABASE treeheal_db;
USE treeheal_db;
SOURCE database/complete_schema.sql;
```
