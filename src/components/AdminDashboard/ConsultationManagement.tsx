import React, { useState, useEffect } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ConsultationManagement.module.css';

interface Consultation {
  request_id: number;
  request_number: string;
  applicant_name: string;
  contact_number: string;
  birth_date: string;
  gender: 'M' | 'F';
  category_name: string;
  detail_items: string[];
  expert_name: string | null;
  expert_contact_number: string | null;
  device_name: string | null;
  ssaid: string | null;
  requested_at: string;
  assigned_at: string | null;
  completed_at: string | null;
  request_status: string;
}

interface ApiResponse {
  success: boolean;
  data: Consultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ConsultationManagement() {
  const [dateRangeFilter, setDateRangeFilter] = useState('1month');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  // Fetch consultations from API
  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        q: searchQuery,
      });

      const response = await fetch(`/api/consultation-requests?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setConsultations(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page or search changes
  useEffect(() => {
    fetchConsultations();
  }, [currentPage, searchQuery]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchConsultations();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\. /g, '-').replace('.', '');
  };

  // Format gender
  const formatGender = (gender: 'M' | 'F') => {
    return gender === 'M' ? '남성' : '여성';
  };

  // Parse detail items
  const formatDetailItems = (items: string[] | string) => {
    if (typeof items === 'string') {
      try {
        const parsed = JSON.parse(items);
        return Array.isArray(parsed) ? parsed.join(', ') : items;
      } catch {
        return items;
      }
    }
    return Array.isArray(items) ? items.join(', ') : '-';
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            onClick={() => {
              setDateRangeFilter('1month');
              setShowCustomDatePicker(false);
            }}
            className={`${styles.filterButton} ${
              dateRangeFilter === '1month' ? styles.filterButtonActive : ''
            }`}
          >
            최근 1개월
          </button>
          <button
            onClick={() => {
              setDateRangeFilter('6months');
              setShowCustomDatePicker(false);
            }}
            className={`${styles.filterButton} ${
              dateRangeFilter === '6months' ? styles.filterButtonActive : ''
            }`}
          >
            최근 6개월
          </button>
          <button
            onClick={() => {
              setDateRangeFilter('1year');
              setShowCustomDatePicker(false);
            }}
            className={`${styles.filterButton} ${
              dateRangeFilter === '1year' ? styles.filterButtonActive : ''
            }`}
          >
            최근 1년
          </button>
          <button
            onClick={() => {
              setDateRangeFilter('custom');
              setShowCustomDatePicker(true);
            }}
            className={`${styles.filterButton} ${
              dateRangeFilter === 'custom' ? styles.filterButtonActive : ''
            }`}
          >
            기간 선택
          </button>
        </div>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="검색어 (성명, 연락처, 신청번호)"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className={styles.searchButton} onClick={handleSearch}>검색</button>
          <button className={styles.downloadButton}>
            <Download className={styles.downloadIcon} />
            <span>엑셀 다운로드</span>
          </button>
        </div>
      </div>

      {showCustomDatePicker && (
        <div className={styles.datePickerSection}>
          <div className={styles.datePickerGroup}>
            <label className={styles.dateLabel}>시작일:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <span className={styles.dateSeparator}>~</span>
          <div className={styles.datePickerGroup}>
            <label className={styles.dateLabel}>종료일:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>
          <button className={styles.applyButton}>적용</button>
        </div>
      )}

      <p className={styles.dataCount}>data. {total}건</p>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>No</th>
              <th className={styles.th}>신청일시</th>
              <th className={styles.th}>성명</th>
              <th className={styles.th}>성별</th>
              <th className={styles.th}>연락처</th>
              <th className={styles.th}>상담 항목</th>
              <th className={styles.th}>상담 세부 항목</th>
              <th className={styles.th}>상담 전문가</th>
              <th className={styles.th}>전문가 연락처</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {loading ? (
              <tr>
                <td colSpan={9} className={styles.td} style={{ textAlign: 'center' }}>
                  로딩 중...
                </td>
              </tr>
            ) : consultations.length === 0 ? (
              <tr>
                <td colSpan={9} className={styles.td} style={{ textAlign: 'center' }}>
                  데이터가 없습니다
                </td>
              </tr>
            ) : (
              consultations.map((item, idx) => (
                <tr key={item.request_id} className={styles.tr}>
                  <td className={styles.td}>{item.request_id}</td>
                  <td className={styles.td}>{formatDate(item.requested_at)}</td>
                  <td className={styles.td}>{item.applicant_name}</td>
                  <td className={styles.td}>{formatGender(item.gender)}</td>
                  <td className={styles.td}>{item.contact_number}</td>
                  <td className={styles.td}>{item.category_name}</td>
                  <td className={styles.td}>{formatDetailItems(item.detail_items)}</td>
                  <td className={styles.td}>{item.expert_name || '-'}</td>
                  <td className={styles.td}>{item.expert_contact_number || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className={styles.paginationIcon} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              className={`${styles.pageNumber} ${currentPage === pageNum ? styles.pageNumberActive : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className={styles.paginationIcon} />
        </button>
      </div>
    </div>
  );
}
