import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ConsultantManagement.module.css';

interface Consultant {
  name: string;
  phone: string;
  career: string;
  qualifications: string;
  image: string | null;
}

export default function ConsultantManagement() {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [isNewConsultant, setIsNewConsultant] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Consultant | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [consultants, setConsultants] = useState<Consultant[]>([
    { name: '김철수', phone: '010-1234-1234', career: '메리츠화재 TC 실장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '이영희', phone: '010-1234-1234', career: '삼성생명 지점장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '송이안', phone: '010-1234-1234', career: '한화생명 팀장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '박민준', phone: '010-1234-5678', career: 'KB손해보험 부장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '최서연', phone: '010-2345-6789', career: '현대해상 팀장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '정우진', phone: '010-3456-7890', career: 'DB손해보험 차장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '강지훈', phone: '010-4567-8901', career: '삼성화재 과장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '한소희', phone: '010-5678-9012', career: '교보생명 지점장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '윤상민', phone: '010-6789-0123', career: '흥국화재 실장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '오지영', phone: '010-7890-1234', career: 'AIA생명 부지점장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
    { name: '임재현', phone: '010-8901-2345', career: '롯데손해보험 팀장', qualifications: '- 손해보험 자격\n- 생명보험 자격\n- 변액보험 자격\n- 연금보험 자격', image: null },
  ]);

  const handleNewConsultant = () => {
    setIsNewConsultant(true);
    setSelectedConsultant({
      name: '',
      phone: '',
      career: '',
      qualifications: '',
      image: null
    });
  };

  const handleSaveConsultant = () => {
    console.log('저장:', selectedConsultant);
    alert('저장되었습니다.');
    setSelectedConsultant(null);
    setIsNewConsultant(false);
  };

  const handleCancelConsultant = () => {
    setSelectedConsultant(null);
    setIsNewConsultant(false);
  };

  const handleDeleteClick = (consultant: Consultant) => {
    setDeleteTarget(consultant);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    console.log('삭제:', deleteTarget);
    setShowDeletePopup(false);
    setDeleteTarget(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedConsultant) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedConsultant({
          ...selectedConsultant,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 전문가 상세/수정 화면
  if (selectedConsultant) {
    return (
      <div className={styles.detailContainer}>
        <h3 className={styles.detailTitle}>전문가 수정</h3>

        <div className={styles.detailContent}>
          <div className={styles.detailRow}>
            <div className={styles.labelColumn}>
              성함*
              <div className={styles.labelHint}>최대 6자</div>
            </div>
            <div className={styles.inputColumn}>
              <input
                type="text"
                value={selectedConsultant.name}
                onChange={(e) => setSelectedConsultant({ ...selectedConsultant, name: e.target.value })}
                className={styles.detailInput}
                placeholder="강지훈"
              />
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelColumn}>연락처*</div>
            <div className={styles.inputColumn}>
              <input
                type="tel"
                value={selectedConsultant.phone}
                onChange={(e) => setSelectedConsultant({ ...selectedConsultant, phone: e.target.value })}
                className={styles.detailInput}
                placeholder="010-4567-8901"
              />
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelColumn}>
              약력
              <div className={styles.labelHint}>최대 300자</div>
            </div>
            <div className={styles.inputColumn}>
              <textarea
                value={selectedConsultant.career}
                onChange={(e) => setSelectedConsultant({ ...selectedConsultant, career: e.target.value })}
                className={styles.detailTextarea}
                rows={5}
                placeholder="- 메리츠화재 TC 실장&#10;- 인기급용서비스재향 사업단지점장&#10;- 프라임에셋 217분부 지사장&#10;- 보험 뽑만제도 (경제 TV) 출연"
              />
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelColumn}>
              자격내용
              <div className={styles.labelHint}>최대 300자</div>
            </div>
            <div className={styles.inputColumn}>
              <textarea
                value={selectedConsultant.qualifications}
                onChange={(e) => setSelectedConsultant({ ...selectedConsultant, qualifications: e.target.value })}
                className={styles.detailTextarea}
                rows={5}
                placeholder="- 손해보험 자격&#10;- 생명보험 자격&#10;- 변액보험 자격&#10;- 연금보험 자격"
              />
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.labelColumn}>
              이미지
              <div className={styles.labelHint}>2MB 이하의 이미지 파일<br />첨부(권장 600x800px)</div>
            </div>
            <div className={styles.inputColumn}>
              <div className={styles.imageUploadArea}>
                <label className={styles.imageUploadButton}>
                  파일첨부
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.fileInput}
                  />
                </label>
                <span className={styles.imageFileName}>
                  {selectedConsultant.image ? '선택된 파일 있음' : '선택된 파일 없음'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.detailButtons}>
          <button onClick={handleCancelConsultant} className={styles.cancelButton}>
            취소
          </button>
          <button onClick={handleSaveConsultant} className={styles.submitButton}>
            저장하기
          </button>
        </div>
      </div>
    );
  }

  // 전문가 목록 화면
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input type="text" placeholder="검색어" className={styles.searchInput} />
          </div>
          <button className={styles.searchButton}>검색</button>
        </div>
        <button onClick={handleNewConsultant} className={styles.newButton}>
          전문가 등록
        </button>
      </div>

      <p className={styles.dataCount}>data. 999건</p>

      <div className={styles.gridContainer}>
        {consultants.map((consultant, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.cardImage}>
              {consultant.image ? (
                <img src={consultant.image} alt={consultant.name} className={styles.consultantImage} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span className={styles.avatarEmoji}>👨‍💼</span>
                </div>
              )}
            </div>
            <div className={styles.cardContent}>
              <h4 className={styles.consultantName}>{consultant.name}</h4>
              <p className={styles.consultantPhone}>{consultant.phone}</p>
              <div className={styles.cardActions}>
                <button
                  onClick={() => {
                    setSelectedConsultant(consultant);
                    setIsNewConsultant(false);
                  }}
                  className={styles.editButton}
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteClick(consultant)}
                  className={styles.deleteButton}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className={styles.paginationIcon} />
        </button>
        <button
          className={`${styles.pageNumber} ${currentPage === 1 ? styles.pageNumberActive : ''}`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
        <button
          className={`${styles.pageNumber} ${currentPage === 2 ? styles.pageNumberActive : ''}`}
          onClick={() => setCurrentPage(2)}
        >
          2
        </button>
        <button
          className={`${styles.pageNumber} ${currentPage === 3 ? styles.pageNumberActive : ''}`}
          onClick={() => setCurrentPage(3)}
        >
          3
        </button>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.min(3, prev + 1))}
          disabled={currentPage === 3}
        >
          <ChevronRight className={styles.paginationIcon} />
        </button>
      </div>

      {/* 삭제 확인 팝업 */}
      {showDeletePopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>전문가 삭제</h3>
            <p className={styles.popupMessage}>
              정말로 <strong>{deleteTarget?.name}</strong> 전문가를 삭제하시겠습니까?
            </p>
            <div className={styles.popupButtons}>
              <button onClick={() => setShowDeletePopup(false)} className={styles.popupCancelButton}>
                취소
              </button>
              <button onClick={confirmDelete} className={styles.popupConfirmButton}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
