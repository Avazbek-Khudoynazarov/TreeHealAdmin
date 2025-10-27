import React, { useState } from 'react';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const [settingsTab, setSettingsTab] = useState('basic');

  // 기본 설정 states
  const [mainTitle, setMainTitle] = useState('보험금 청구 상담');
  const [mainImage, setMainImage] = useState('icon_01.png (95kb)');
  const [mainDescription, setMainDescription] = useState('전문성담자가 고 객님의의 상담을 도와드립니다.\n빠르고 정확한 업무를 위해 항사한 기다려주세요.');

  const [subTitle, setSubTitle] = useState('무료 보험 상담');
  const [subImage, setSubImage] = useState('icon_02.png (100kb)');
  const [subDescription, setSubDescription] = useState('전문성담자가 3회차 예약도의 상담을 도와드립니다.\n빠르고 정확한 업무를 위해 항사한 기다려주세요.');

  const [item1Title, setItem1Title] = useState('실손보험');
  const [item1Image, setItem1Image] = useState('icon_2Depth_01.png (95kb)');

  const [item2Title, setItem2Title] = useState('수술비');
  const [item2Image, setItem2Image] = useState('icon_2Depth_02.png (95kb)');

  const [item3Title, setItem3Title] = useState('진단비');
  const [item3Image, setItem3Image] = useState('icon_2Depth_03.png (95kb)');

  const [item4Title, setItem4Title] = useState('기타 상담');
  const [item4Image, setItem4Image] = useState('icon_2Depth_04.png (95kb)');

  // 약관 설정 states
  const [terms1, setTerms1] = useState('');
  const [terms2, setTerms2] = useState('');
  const [terms3, setTerms3] = useState('');
  const [terms4, setTerms4] = useState('');

  // 설문조사 발송링크 state
  const [googleFormUrl, setGoogleFormUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(`${file.name} (${Math.round(file.size / 1024)}kb)`);
    }
  };

  const handleSaveBasic = () => {
    alert('저장되었습니다.');
  };

  const handleSaveTerms = () => {
    alert('저장되었습니다.');
  };

  const handleSaveSurveyLink = () => {
    alert('저장되었습니다.');
  };

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setSettingsTab('basic')}
          className={`${styles.tab} ${settingsTab === 'basic' ? styles.tabActive : ''}`}
        >
          기본 설정
        </button>
        <button
          onClick={() => setSettingsTab('terms')}
          className={`${styles.tab} ${settingsTab === 'terms' ? styles.tabActive : ''}`}
        >
          약관 설정
        </button>
        <button
          onClick={() => setSettingsTab('survey')}
          className={`${styles.tab} ${settingsTab === 'survey' ? styles.tabActive : ''}`}
        >
          설문조사 발송링크
        </button>
      </div>

      {/* 기본 설정 Tab */}
      {settingsTab === 'basic' && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>구분 관리</h3>

            {/* 구분명 1 */}
            <div className={styles.settingGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  구분명*
                  <div className={styles.fieldHint}>최대 10자</div>
                </label>
                <input
                  type="text"
                  value={mainTitle}
                  onChange={(e) => setMainTitle(e.target.value)}
                  className={styles.inputField}
                  placeholder="구분명을 입력하세요"
                />
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  아이콘*
                  <div className={styles.fieldHint}>1MB 이하의 PNG 파일 첨부<br />가능함 400x400px)</div>
                </label>
                <div className={styles.fileUploadArea}>
                  <label className={styles.uploadButton}>
                    파일찾기
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => handleImageUpload(e, setMainImage)}
                      className={styles.fileInput}
                    />
                  </label>
                  <span className={styles.fileName}>{mainImage}</span>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  선정완료 메시지*
                  <div className={styles.fieldHint}>최대 100자</div>
                </label>
                <textarea
                  value={mainDescription}
                  onChange={(e) => setMainDescription(e.target.value)}
                  className={styles.textareaField}
                  rows={3}
                  placeholder="메시지를 입력하세요"
                />
              </div>
            </div>

            {/* 구분명 2 */}
            <div className={styles.settingGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  구분명*
                  <div className={styles.fieldHint}>최대 10자</div>
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className={styles.inputField}
                  placeholder="구분명을 입력하세요"
                />
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  아이콘*
                  <div className={styles.fieldHint}>1MB 이하의 PNG 파일 첨부<br />가능함 400x400px)</div>
                </label>
                <div className={styles.fileUploadArea}>
                  <label className={styles.uploadButton}>
                    파일찾기
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => handleImageUpload(e, setSubImage)}
                      className={styles.fileInput}
                    />
                  </label>
                  <span className={styles.fileName}>{subImage}</span>
                </div>
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  선정완료 메시지*
                  <div className={styles.fieldHint}>최대 100자</div>
                </label>
                <textarea
                  value={subDescription}
                  onChange={(e) => setSubDescription(e.target.value)}
                  className={styles.textareaField}
                  rows={3}
                  placeholder="메시지를 입력하세요"
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>세부 항목 관리</h3>

            {/* 세부 항목 1 */}
            <div className={styles.settingGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  세부 항목명*
                  <div className={styles.fieldHint}>최대 10자</div>
                </label>
                <input
                  type="text"
                  value={item1Title}
                  onChange={(e) => setItem1Title(e.target.value)}
                  className={styles.inputField}
                  placeholder="세부 항목명을 입력하세요"
                />
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  아이콘*
                  <div className={styles.fieldHint}>1MB 이하의 PNG 파일 첨부<br />가능함 400x400px)</div>
                </label>
                <div className={styles.fileUploadArea}>
                  <label className={styles.uploadButton}>
                    파일찾기
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => handleImageUpload(e, setItem1Image)}
                      className={styles.fileInput}
                    />
                  </label>
                  <span className={styles.fileName}>{item1Image}</span>
                </div>
              </div>
            </div>

            {/* 세부 항목 2 */}
            <div className={styles.settingGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  세부 항목명*
                  <div className={styles.fieldHint}>최대 10자</div>
                </label>
                <input
                  type="text"
                  value={item2Title}
                  onChange={(e) => setItem2Title(e.target.value)}
                  className={styles.inputField}
                  placeholder="세부 항목명을 입력하세요"
                />
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  아이콘*
                  <div className={styles.fieldHint}>1MB 이하의 PNG 파일 첨부<br />가능함 400x400px)</div>
                </label>
                <div className={styles.fileUploadArea}>
                  <label className={styles.uploadButton}>
                    파일찾기
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => handleImageUpload(e, setItem2Image)}
                      className={styles.fileInput}
                    />
                  </label>
                  <span className={styles.fileName}>{item2Image}</span>
                </div>
              </div>
            </div>

            {/* 세부 항목 3 */}
            <div className={styles.settingGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  세부 항목명*
                  <div className={styles.fieldHint}>최대 10자</div>
                </label>
                <input
                  type="text"
                  value={item3Title}
                  onChange={(e) => setItem3Title(e.target.value)}
                  className={styles.inputField}
                  placeholder="세부 항목명을 입력하세요"
                />
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  아이콘*
                  <div className={styles.fieldHint}>1MB 이하의 PNG 파일 첨부<br />가능함 400x400px)</div>
                </label>
                <div className={styles.fileUploadArea}>
                  <label className={styles.uploadButton}>
                    파일찾기
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => handleImageUpload(e, setItem3Image)}
                      className={styles.fileInput}
                    />
                  </label>
                  <span className={styles.fileName}>{item3Image}</span>
                </div>
              </div>
            </div>

            {/* 세부 항목 4 */}
            <div className={styles.settingGroup}>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  세부 항목명*
                  <div className={styles.fieldHint}>최대 10자</div>
                </label>
                <input
                  type="text"
                  value={item4Title}
                  onChange={(e) => setItem4Title(e.target.value)}
                  className={styles.inputField}
                  placeholder="세부 항목명을 입력하세요"
                />
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>
                  아이콘*
                  <div className={styles.fieldHint}>1MB 이하의 PNG 파일 첨부<br />가능함 400x400px)</div>
                </label>
                <div className={styles.fileUploadArea}>
                  <label className={styles.uploadButton}>
                    파일찾기
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => handleImageUpload(e, setItem4Image)}
                      className={styles.fileInput}
                    />
                  </label>
                  <span className={styles.fileName}>{item4Image}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.saveButtonContainer}>
            <button onClick={handleSaveBasic} className={styles.saveButton}>
              저장하기
            </button>
          </div>
        </div>
      )}

      {/* 약관 설정 Tab */}
      {settingsTab === 'terms' && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>약관 설정</h3>

            <div className={styles.termsGroup}>
              <label className={styles.termsLabel}>개인정보 수집·이용 동의</label>
              <textarea
                value={terms1}
                onChange={(e) => setTerms1(e.target.value)}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요"
              />
            </div>

            <div className={styles.termsGroup}>
              <label className={styles.termsLabel}>서비스 이용 약관</label>
              <textarea
                value={terms2}
                onChange={(e) => setTerms2(e.target.value)}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요"
              />
            </div>

            <div className={styles.termsGroup}>
              <label className={styles.termsLabel}>상담 안내 메시지 수신 동의</label>
              <textarea
                value={terms3}
                onChange={(e) => setTerms3(e.target.value)}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요"
              />
            </div>

            <div className={styles.termsGroup}>
              <label className={styles.termsLabel}>마케팅이벤트 안내 수신 동의</label>
              <textarea
                value={terms4}
                onChange={(e) => setTerms4(e.target.value)}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요"
              />
            </div>
          </div>

          <div className={styles.saveButtonContainer}>
            <button onClick={handleSaveTerms} className={styles.saveButton}>
              저장하기
            </button>
          </div>
        </div>
      )}

      {/* 설문조사 발송링크 Tab */}
      {settingsTab === 'survey' && (
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>설문조사 발송링크</h3>

            <div className={styles.surveyGroup}>
              <label className={styles.surveyLabel}>Google Form URL*</label>
              <input
                type="url"
                value={googleFormUrl}
                onChange={(e) => setGoogleFormUrl(e.target.value)}
                className={styles.surveyInput}
                placeholder="https://docs.google.com/forms/d/1...."
              />
            </div>
          </div>

          <div className={styles.saveButtonContainer}>
            <button onClick={handleSaveSurveyLink} className={styles.saveButton}>
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
