-- 보험상담신청 APP 관리자 페이지 데이터베이스 스키마
-- Version 0.6 기준
-- 작성일: 2025-09-25

-- 1. 기기(디바이스) 관리 테이블
CREATE TABLE devices (
    device_id INT PRIMARY KEY AUTO_INCREMENT,
    device_name VARCHAR(100) NOT NULL COMMENT '기기명 (예: test01)',
    ssaid VARCHAR(255) NOT NULL UNIQUE COMMENT 'Android SSAID',
    device_type VARCHAR(50) COMMENT '디바이스 타입 (예: 안드로이드 21.5인치 세로형)',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active' COMMENT '기기 상태',
    INDEX idx_ssaid (ssaid),
    INDEX idx_status (status)
) COMMENT='기기(디바이스) 관리 테이블';

-- 2. 전문가 관리 테이블
CREATE TABLE experts (
    expert_id INT PRIMARY KEY AUTO_INCREMENT,
    expert_name VARCHAR(50) NOT NULL COMMENT '전문가명',
    contact_number VARCHAR(20) NOT NULL COMMENT '연락처',
    specialization TEXT COMMENT '전문분야 (예: 손해보험, 생명보험, 진단비 등)',
    qualifications TEXT COMMENT '자격내용 (예: 손해보험, 생명보험, 연금보험 등)',
    profile_image VARCHAR(255) COMMENT '프로필 이미지 경로',
    display_order INT DEFAULT 0 COMMENT '노출 순서 (1번 고정, 나머지 랜덤)',
    is_fixed BOOLEAN DEFAULT FALSE COMMENT '고정 노출 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
    INDEX idx_status (status),
    INDEX idx_display_order (display_order)
) COMMENT='전문가 관리 테이블';

-- 3. 기기별 전문가 노출 설정 테이블
CREATE TABLE device_expert_mapping (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    expert_id INT NOT NULL,
    display_type ENUM('fixed', 'random') DEFAULT 'random' COMMENT '고정 노출/랜덤 노출',
    display_order INT COMMENT '노출 순서',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (expert_id) REFERENCES experts(expert_id) ON DELETE CASCADE,
    UNIQUE KEY unique_device_expert (device_id, expert_id),
    INDEX idx_device (device_id),
    INDEX idx_expert (expert_id)
) COMMENT='기기별 전문가 노출 설정 테이블';

-- 4. 상담 구분 관리 테이블
CREATE TABLE consultation_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL COMMENT '구분명 (예: 보험보상상담, 보험무료상담)',
    category_icon VARCHAR(255) COMMENT '카테고리 아이콘 이미지',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) COMMENT='상담 구분 관리 테이블';

-- 5. 세부 항목 관리 테이블
CREATE TABLE detail_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(50) NOT NULL COMMENT '세부 항목명 (예: 실손, 수술, 진단, 기타)',
    item_icon VARCHAR(255) COMMENT '항목 아이콘 이미지',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) COMMENT='세부 항목 관리 테이블';

-- 6. 상담 신청 테이블 (메인)
CREATE TABLE consultation_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    request_number VARCHAR(50) UNIQUE NOT NULL COMMENT '신청 번호',
    device_id INT COMMENT '신청한 기기',
    category_id INT NOT NULL COMMENT '상담 구분',
    applicant_name VARCHAR(50) NOT NULL COMMENT '신청자 성명',
    contact_number VARCHAR(20) NOT NULL COMMENT '연락처',
    birth_date DATE COMMENT '생년월일',
    gender ENUM('M', 'F') COMMENT '성별',
    assigned_expert_id INT COMMENT '배정된 상담 전문가',
    consultation_type VARCHAR(100) COMMENT '상담 유형 (예: 보험금청구 상담)',
    detail_items TEXT COMMENT '상담 세부 항목 (JSON 형태)',
    request_status ENUM('pending', 'assigned', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '상담 진행가',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '신청일시',
    assigned_at TIMESTAMP NULL COMMENT '배정일시',
    completed_at TIMESTAMP NULL COMMENT '완료일시',
    expert_contact VARCHAR(20) COMMENT '전문가 연락처',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES consultation_categories(category_id),
    FOREIGN KEY (assigned_expert_id) REFERENCES experts(expert_id) ON DELETE SET NULL,
    INDEX idx_request_number (request_number),
    INDEX idx_request_status (request_status),
    INDEX idx_requested_at (requested_at),
    INDEX idx_contact_number (contact_number),
    INDEX idx_device (device_id)
) COMMENT='상담 신청 메인 테이블';

-- 7. 개인정보 동의 항목 테이블
CREATE TABLE privacy_consent_items (
    consent_item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_title VARCHAR(200) NOT NULL COMMENT '동의 항목 제목',
    item_content TEXT COMMENT '동의 항목 내용',
    is_required BOOLEAN DEFAULT TRUE COMMENT '필수 동의 여부',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) COMMENT='개인정보 동의 항목 관리 테이블';

-- 8. 상담 신청별 개인정보 동의 기록 테이블
CREATE TABLE request_privacy_consents (
    consent_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    consent_item_id INT NOT NULL,
    is_agreed BOOLEAN NOT NULL COMMENT '동의 여부',
    agreed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES consultation_requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (consent_item_id) REFERENCES privacy_consent_items(consent_item_id),
    INDEX idx_request (request_id)
) COMMENT='상담 신청별 개인정보 동의 기록';

-- 9. 만족도 설문조사 테이블
CREATE TABLE satisfaction_surveys (
    survey_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    survey_sent_at TIMESTAMP COMMENT '설문 발송 일시',
    survey_completed_at TIMESTAMP COMMENT '설문 완료 일시',
    survey_status ENUM('sent', 'completed', 'expired') DEFAULT 'sent',
    google_form_url VARCHAR(500) COMMENT 'Google Form URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES consultation_requests(request_id) ON DELETE CASCADE,
    INDEX idx_request (request_id),
    INDEX idx_survey_status (survey_status)
) COMMENT='만족도 설문조사 발송 관리';

-- 10. 설문조사 응답 테이블
CREATE TABLE survey_responses (
    response_id INT PRIMARY KEY AUTO_INCREMENT,
    survey_id INT NOT NULL,
    question_1 VARCHAR(500) COMMENT '질문1: 고객님께 도움을 드린 전문가님 성명',
    question_2 VARCHAR(500) COMMENT '질문2: 보험금청구 도움/무료상담 중 어떤 서비스를 이용',
    question_3 VARCHAR(500) COMMENT '질문3: 담당 전문가가 고객님의 상담 문의사항에',
    question_4 VARCHAR(500) COMMENT '질문4: 담당 전문가가 친절하고 정확한 설명',
    question_5 VARCHAR(500) COMMENT '질문5: 보험금청구 및 설문조사 앱을 다시 이용',
    question_5_1 TEXT COMMENT '질문5-1: 추천하지 않을 경우 이유',
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES satisfaction_surveys(survey_id) ON DELETE CASCADE,
    INDEX idx_survey (survey_id)
) COMMENT='설문조사 응답 데이터';

-- 11. 카카오 알림톡 발송 로그 테이블
CREATE TABLE kakao_message_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    message_type ENUM('request_notification', 'survey_invitation') NOT NULL COMMENT '메시지 유형',
    recipient_phone VARCHAR(20) NOT NULL COMMENT '수신자 전화번호',
    template_code VARCHAR(50) COMMENT '템플릿 코드',
    message_content TEXT COMMENT '메시지 내용',
    send_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    error_message TEXT COMMENT '발송 실패 시 에러 메시지',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES consultation_requests(request_id) ON DELETE CASCADE,
    INDEX idx_request (request_id),
    INDEX idx_send_status (send_status),
    INDEX idx_message_type (message_type)
) COMMENT='카카오 알림톡 발송 로그';

-- 12. 광고 화면(FM AD) 관리 테이블
CREATE TABLE advertisements (
    ad_id INT PRIMARY KEY AUTO_INCREMENT,
    ad_title VARCHAR(200) NOT NULL COMMENT '광고 제목',
    ad_image VARCHAR(255) COMMENT '광고 이미지 경로',
    ad_video VARCHAR(255) COMMENT '광고 비디오 경로',
    ad_type ENUM('image', 'video') DEFAULT 'image',
    display_duration INT DEFAULT 10 COMMENT '표시 시간(초)',
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE COMMENT '광고 시작일',
    end_date DATE COMMENT '광고 종료일',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_dates (start_date, end_date)
) COMMENT='광고 화면(FM AD) 관리';

-- 13. 기기별 광고 매핑 테이블
CREATE TABLE device_advertisement_mapping (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT NOT NULL,
    ad_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (ad_id) REFERENCES advertisements(ad_id) ON DELETE CASCADE,
    UNIQUE KEY unique_device_ad (device_id, ad_id),
    INDEX idx_device (device_id)
) COMMENT='기기별 광고 노출 설정';

-- 14. 관리자 계정 테이블
CREATE TABLE admin_users (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    admin_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    role ENUM('super_admin', 'admin', 'viewer') DEFAULT 'admin',
    last_login_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) COMMENT='관리자 계정 관리';

-- 15. 시스템 로그 테이블
CREATE TABLE system_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT,
    action_type VARCHAR(100) NOT NULL COMMENT '작업 유형',
    target_table VARCHAR(50) COMMENT '대상 테이블',
    target_id INT COMMENT '대상 레코드 ID',
    action_detail TEXT COMMENT '작업 상세 내용',
    ip_address VARCHAR(45) COMMENT 'IP 주소',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id) ON DELETE SET NULL,
    INDEX idx_admin (admin_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) COMMENT='시스템 작업 로그';

-- 16. 엑셀 다운로드 이력 테이블
CREATE TABLE excel_download_logs (
    download_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    download_type VARCHAR(50) NOT NULL COMMENT '다운로드 유형 (상담관리/설문관리/기기관리 등)',
    file_name VARCHAR(255) NOT NULL,
    filter_conditions TEXT COMMENT '필터 조건 (JSON)',
    record_count INT COMMENT '다운로드된 레코드 수',
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id),
    INDEX idx_admin (admin_id),
    INDEX idx_download_type (download_type)
) COMMENT='엑셀 다운로드 이력 관리';

-- 초기 데이터 삽입
-- 상담 구분 초기 데이터
INSERT INTO consultation_categories (category_name, display_order) VALUES
('보험보상상담', 1),
('보험무료상담', 2);

-- 세부 항목 초기 데이터
INSERT INTO detail_items (item_name, display_order) VALUES
('실손', 1),
('수술', 2),
('진단', 3),
('기타', 4);

-- 개인정보 동의 항목 초기 데이터
INSERT INTO privacy_consent_items (item_title, item_content, is_required, display_order) VALUES
('개인정보 수집·이용 동의', '트리힐 [보험보상] 신청이 완료되었습니다. 이름: [이름] 상담 세부 항목: [선택 세부 항목] 상담자: [선택한 상담자 이름]', TRUE, 1),
('개인정보 제3자 제공 동의', '트리힐 개인정보 제3자 제공 동의서', TRUE, 2),
('마케팅/이벤트 안내 수신 동의', '트리힐 개인정보 마케팅 활용 동의서', FALSE, 3),
('설문조사 발송 동의', '실손보험금 발급 2시간 후 발송', FALSE, 4);

-- 뷰(View) 생성
-- 1. 상담 관리 통합 뷰
CREATE VIEW v_consultation_management AS
SELECT 
    cr.request_id,
    cr.request_number,
    cr.applicant_name,
    cr.contact_number,
    cr.birth_date,
    cr.gender,
    cc.category_name,
    cr.detail_items,
    e.expert_name AS assigned_expert_name,
    e.contact_number AS expert_contact,
    cr.request_status,
    cr.requested_at,
    cr.assigned_at,
    cr.completed_at,
    d.device_name,
    d.ssaid,
    (SELECT COUNT(*) FROM satisfaction_surveys ss WHERE ss.request_id = cr.request_id) AS survey_sent,
    (SELECT COUNT(*) FROM satisfaction_surveys ss 
     INNER JOIN survey_responses sr ON ss.survey_id = sr.survey_id 
     WHERE ss.request_id = cr.request_id) AS survey_completed
FROM consultation_requests cr
LEFT JOIN consultation_categories cc ON cr.category_id = cc.category_id
LEFT JOIN experts e ON cr.assigned_expert_id = e.expert_id
LEFT JOIN devices d ON cr.device_id = d.device_id
WHERE cr.request_status != 'cancelled';

-- 2. 설문조사 통합 뷰
CREATE VIEW v_survey_management AS
SELECT 
    ss.survey_id,
    cr.request_number,
    cr.applicant_name,
    e.expert_name AS assigned_expert_name,
    cr.contact_number,
    ss.survey_sent_at,
    ss.survey_completed_at,
    ss.survey_status,
    sr.question_1,
    sr.question_2,
    sr.question_3,
    sr.question_4,
    sr.question_5,
    sr.question_5_1
FROM satisfaction_surveys ss
INNER JOIN consultation_requests cr ON ss.request_id = cr.request_id
LEFT JOIN experts e ON cr.assigned_expert_id = e.expert_id
LEFT JOIN survey_responses sr ON ss.survey_id = sr.survey_id;

-- 3. 기기별 전문가 노출 현황 뷰
CREATE VIEW v_device_expert_display AS
SELECT 
    d.device_id,
    d.device_name,
    d.ssaid,
    e.expert_id,
    e.expert_name,
    e.contact_number,
    dem.display_type,
    dem.display_order,
    e.profile_image
FROM devices d
INNER JOIN device_expert_mapping dem ON d.device_id = dem.device_id
INNER JOIN experts e ON dem.expert_id = e.expert_id
WHERE d.status = 'active' AND e.status = 'active';

-- 인덱스 최적화를 위한 추가 복합 인덱스
CREATE INDEX idx_request_date_status ON consultation_requests(requested_at, request_status);
CREATE INDEX idx_expert_status ON experts(status, display_order);
CREATE INDEX idx_device_status ON devices(status, device_name);
