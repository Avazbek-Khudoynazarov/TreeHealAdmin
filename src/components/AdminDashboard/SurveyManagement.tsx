import React, { useState } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './SurveyManagement.module.css';

export default function SurveyManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const surveys = [
    { no: 100, date: '2025-07-11 15:00', name: '김진수', consultant: '이서연', q1: '① 보험금청구', q2: '② 보험금 청구 등', q3: '③ 담당 전문가가', q4: '④ 담당 전문가의', q5: '⑤ 보험금청구 및', q5_1: '-' },
    { no: 99, date: '2025-07-11 13:00', name: '이성진', consultant: '이서연', q1: '① 보험 상담', q2: '② 보험 상담', q3: '③에도 그러더니', q4: '④그렇다', q5: '④그렇다(다)', q5_1: '④전문성 부족' },
    { no: 98, date: '2025-07-06 11:00', name: '이하나', consultant: '정상훈', q1: '① 보험 상담', q2: '② 보험 상담', q3: '③에도 그러더니', q4: '④그렇다', q5: '④보통', q5_1: '④자료 미기재 감' }
  ];

  const chartData = [
    [
      { name: '보험금 청구', value: 3 },
      { name: '보험 상담', value: 572 }
    ],
    [
      { name: '1시간 이내', value: 100 },
      { name: '2시간 이내', value: 150 },
      { name: '3시간 이내', value: 250 },
      { name: '그 외', value: 72 }
    ],
    [
      { name: '매우 그렇다', value: 5 },
      { name: '그렇다', value: 300 },
      { name: '보통', value: 200 },
      { name: '그렇지 않다', value: 50 },
      { name: '매우 그렇지 않다', value: 17 }
    ]
  ];

  const chartColors = [
    ['#dc2626', '#0369a1'],
    ['#0284c7', '#fb923c', '#16a34a', '#0369a1'],
    ['#c026d3', '#16a34a', '#fb923c', '#0369a1', '#dc2626']
  ];

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterButton} ${styles.filterButtonActive}`}>
            최근 1개월
          </button>
          <button className={styles.filterButton}>최근 6개월</button>
          <button className={styles.filterButton}>최근 1년</button>
          <button className={styles.filterButton}>기간 선택</button>
        </div>
        <div className={styles.searchSection}>
          <select className={styles.select}>
            <option>전문가명 ▼</option>
          </select>
          <button className={styles.searchButton}>검색</button>
          <button className={styles.downloadButton}>
            <Download className={styles.downloadIcon} />
            <span>엑셀 다운로드</span>
          </button>
        </div>
      </div>

      <div className={styles.chartsSection}>
        {[0, 1, 2, 2, 2, 2].map((chartIndex, idx) => (
          <div key={idx} className={styles.chartCard}>
            <p className={styles.chartTitle}>{idx + 1}{idx === 5 ? '-1' : ''}</p>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData[chartIndex] || chartData[2]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {(chartData[chartIndex] || chartData[2]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={(chartColors[chartIndex] || chartColors[2])[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.chartCenter}>
                <span className={styles.chartCenterText}>572</span>
              </div>
            </div>
            <div className={styles.legend}>
              {(chartData[chartIndex] || chartData[2]).map((entry, index) => (
                <p key={index} className={styles.legendItem}>
                  <span style={{ color: (chartColors[chartIndex] || chartColors[2])[index] }}>●</span> {entry.name}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className={styles.dataCount}>data. 100건</p>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.theadRow1}>
              <th rowSpan={2} className={styles.th}>No</th>
              <th rowSpan={2} className={styles.th}>설문일시</th>
              <th rowSpan={2} className={styles.th}>고객명</th>
              <th rowSpan={2} className={styles.th}>상담<br />전문가</th>
              <th className={styles.thMain} colSpan={6}>설문조사</th>
            </tr>
            <tr className={styles.theadRow2}>
              <th className={styles.thSub}>1. 고객님께서 신청<br />하신 서비스는 무엇<br />인가요?</th>
              <th className={styles.thSub}>2. 보험금청구 도<br />움서비스를 이용하<br />셨습니까?</th>
              <th className={styles.thSub}>3. 담당 전문가가 고<br />객님께 이해하기 쉽<br />도록 충분히 설명을 잘<br />해주셨나요?</th>
              <th className={styles.thSub}>4. 담당 전문가에<br />게는전문적인 업무<br />능력을 갖추고 있으며</th>
              <th className={styles.thSub}>5. 보험금청구 & 상담을통<br />해당 트리힐은는 트리힐이</th>
              <th className={styles.thSub}>5-1. 추천하지 않<br />을 경우 이유가 무<br />엇인가요?</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {surveys.map((item, idx) => (
              <tr key={idx} className={styles.tr}>
                <td className={styles.td}>{item.no}</td>
                <td className={styles.td}>{item.date}</td>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{item.consultant}</td>
                <td className={styles.tdSmall}>{item.q1}</td>
                <td className={styles.tdSmall}>{item.q2}</td>
                <td className={styles.tdSmall}>{item.q3}</td>
                <td className={styles.tdSmall}>{item.q4}</td>
                <td className={styles.tdSmall}>{item.q5}</td>
                <td className={styles.tdSmall}>{item.q5_1}</td>
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
