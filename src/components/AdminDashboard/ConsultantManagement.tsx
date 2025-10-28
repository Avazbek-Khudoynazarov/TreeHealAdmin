import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ConsultantManagement.module.css';

interface Consultant {
  id?: number;
  name: string;
  phone: string;
  career: string;
  qualification: string;
  image: string | null;
}

export default function ConsultantManagement() {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [isNewConsultant, setIsNewConsultant] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Consultant | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch consultants from API
  useEffect(() => {
    fetchConsultants();
  }, [currentPage, searchQuery]);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        q: searchQuery
      });
      const response = await fetch(`/api/consultants?${params}`);
      if (!response.ok) throw new Error('Failed to fetch consultants');
      const result = await response.json();
      setConsultants(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching consultants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConsultant = () => {
    setIsNewConsultant(true);
    setSelectedConsultant({
      name: '',
      phone: '',
      career: '',
      qualification: '',
      image: null
    });
  };

  const handleSaveConsultant = async () => {
    if (!selectedConsultant) return;

    try {
      const method = isNewConsultant ? 'POST' : 'PUT';
      const url = isNewConsultant
        ? '/api/consultants'
        : `/api/consultants/${selectedConsultant.id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedConsultant),
      });

      if (!response.ok) throw new Error('Failed to save consultant');

      alert('저장되었습니다.');
      await fetchConsultants();
      setSelectedConsultant(null);
      setIsNewConsultant(false);
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
      console.error('Error saving consultant:', err);
    }
  };

  const handleCancelConsultant = () => {
    setSelectedConsultant(null);
    setIsNewConsultant(false);
  };

  const handleDeleteClick = (consultant: Consultant) => {
    setDeleteTarget(consultant);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;

    try {
      const response = await fetch(`/api/consultants/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete consultant');

      alert('삭제되었습니다.');
      await fetchConsultants();
      setShowDeletePopup(false);
      setDeleteTarget(null);
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error('Error deleting consultant:', err);
    }
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

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageNumber} ${currentPage === i ? styles.pageNumberActive : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
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
                value={selectedConsultant.qualification}
                onChange={(e) => setSelectedConsultant({ ...selectedConsultant, qualification: e.target.value })}
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
            <input
              type="text"
              placeholder="검색어"
              className={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyPress}
            />
          </div>
          <button onClick={handleSearch} className={styles.searchButton}>검색</button>
        </div>
        <button onClick={handleNewConsultant} className={styles.newButton}>
          전문가 등록
        </button>
      </div>

      <p className={styles.dataCount}>data. {total}건</p>

      {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>로딩 중...</p>}
      {error && <p style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>에러: {error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.gridContainer}>
            {consultants.map((consultant) => (
              <div key={consultant.id} className={styles.card}>
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
            {renderPageNumbers()}
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className={styles.paginationIcon} />
            </button>
          </div>
        </>
      )}

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
