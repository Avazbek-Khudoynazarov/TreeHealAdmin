import React, { useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ConsultationManagement.module.css';

export default function ConsultationManagement() {
  const [dateRangeFilter, setDateRangeFilter] = useState('1month');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const consultations = [
    { no: 100, date: '2025-07-11 15:00', name: '김진수', gender: '남성', phone: '010-1234-1234', type: '보험금청구 상담', status: '수술비', consultant: '이서연', contact: '010-1234-1234' },
    { no: 99, date: '2025-07-11 13:00', name: '이성진', gender: '남성', phone: '010-1234-1234', type: '보험금청구 상담', status: '수술비, 진단비', consultant: '정상훈', contact: '010-1234-1234' },
    { no: 98, date: '2025-07-06 11:00', name: '이하나', gender: '여성', phone: '010-1234-1234', type: '무료 보험 상담', status: '실손보험', consultant: '-', contact: '-' }
  ];

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
              placeholder="검색어"
              className={styles.searchInput}
            />
          </div>
          <button className={styles.searchButton}>검색</button>
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

      <p className={styles.dataCount}>data. 100건</p>

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
            {consultations.map((item, idx) => (
              <tr key={idx} className={styles.tr}>
                <td className={styles.td}>{item.no}</td>
                <td className={styles.td}>{item.date}</td>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{item.gender}</td>
                <td className={styles.td}>{item.phone}</td>
                <td className={styles.td}>{item.type}</td>
                <td className={styles.td}>{item.status}</td>
                <td className={styles.td}>{item.consultant}</td>
                <td className={styles.td}>{item.contact}</td>
              </tr>
            ))}
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
    </div>
  );
}
