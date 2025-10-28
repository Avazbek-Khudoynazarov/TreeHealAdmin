import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DeviceManagement.module.css';

interface Device {
  no: number;
  name: string;
  ssaid: string;
  type: string;
  note: string;
  registered: string;
  experts: string[];
}

export default function DeviceManagement() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const devices: Device[] = [
    { no: 100, name: 'test01', ssaid: '803b849bfa3417', type: '전안 터미널', note: 'NULL', registered: '2025-07-11 15:00', experts: ['홍길동(고정)', '김진수', '송이나'] },
    { no: 99, name: 'test01', ssaid: '703b849bfa3417', type: '대구 동성로', note: '홍길동 등 40명', registered: '2025-07-11 13:00', experts: [] },
    { no: 98, name: 'test01', ssaid: '603b849bfa3417', type: '대전노은점', note: '김진수 등 26명', registered: '2025-07-06 11:00', experts: [] }
  ];

  if (selectedDevice) {
    return (
      <div className={styles.editContainer}>
        <h3 className={styles.editTitle}>기기 수정</h3>

        <table className={styles.editTable}>
          <tbody>
            <tr>
              <td className={styles.labelCell}>계정</td>
              <td className={styles.valueCell}>{selectedDevice.name}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>SSAID</td>
              <td className={styles.valueCell}>{selectedDevice.ssaid}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>
                디바이스명*
                <div className={styles.helpText}>최대 30자</div>
              </td>
              <td className={styles.valueCell}>
                <input type="text" value={selectedDevice.type} className={styles.input} />
              </td>
            </tr>
            <tr>
              <td className={styles.labelCell}>
                노출 전문가*
                <div className={styles.warningText}>*고정 노출은 한명만 선택 가능하며, 그외 전문가는 랜덤으로 노출됩니다.</div>
              </td>
              <td className={styles.valueCell}>
                <button className={styles.selectButton}>선택하기</button>
                <div className={styles.expertTags}>
                  {selectedDevice.experts.map((expert, idx) => (
                    <span key={idx} className={styles.expertTag}>{expert}</span>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className={styles.labelCell}>등록일시</td>
              <td className={styles.valueCell}>{selectedDevice.registered}</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.buttonGroup}>
          <button onClick={() => setSelectedDevice(null)} className={styles.cancelButton}>취소</button>
          <button onClick={() => setSelectedDevice(null)} className={styles.saveButton}>저장하기</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input type="text" placeholder="검색어" className={styles.searchInput} />
          </div>
          <button className={styles.searchButton}>검색</button>
        </div>
      </div>

      <p className={styles.dataCount}>data. 100건</p>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>No</th>
              <th className={styles.th}>계정</th>
              <th className={styles.th}>SSAID</th>
              <th className={styles.th}>디바이스명</th>
              <th className={styles.th}>노출 전문가</th>
              <th className={styles.th}>등록일시</th>
              <th className={styles.thCenter}>관리</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {devices.map((item, idx) => (
              <tr key={idx} className={styles.tr}>
                <td className={styles.td}>{item.no}</td>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{item.ssaid}</td>
                <td className={styles.td}>{item.type}</td>
                <td className={styles.td}>{item.note}</td>
                <td className={styles.td}>{item.registered}</td>
                <td className={styles.tdCenter}>
                  <button onClick={() => setSelectedDevice(item)} className={styles.editLink}>[수정]</button>
                  <button className={styles.deleteLink}>[삭제]</button>
                </td>
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
