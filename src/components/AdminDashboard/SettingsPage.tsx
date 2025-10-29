import React, { useState, useEffect } from 'react';
import styles from './SettingsPage.module.css';

interface Category {
  id: number;
  title: string;
  icon: string;
  description: string;
  display_order: number;
}

interface DetailItem {
  id: number;
  title: string;
  icon: string;
  display_order: number;
}

export default function SettingsPage() {
  const [settingsTab, setSettingsTab] = useState('basic');
  const [loading, setLoading] = useState(true);

  // 기본 설정 states - Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainTitle, setMainTitle] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [mainDescription, setMainDescription] = useState('');

  const [subTitle, setSubTitle] = useState('');
  const [subImage, setSubImage] = useState('');
  const [subDescription, setSubDescription] = useState('');

  // 기본 설정 states - Detail Items
  const [detailItems, setDetailItems] = useState<DetailItem[]>([]);
  const [item1Title, setItem1Title] = useState('');
  const [item1Image, setItem1Image] = useState('');

  const [item2Title, setItem2Title] = useState('');
  const [item2Image, setItem2Image] = useState('');

  const [item3Title, setItem3Title] = useState('');
  const [item3Image, setItem3Image] = useState('');

  const [item4Title, setItem4Title] = useState('');
  const [item4Image, setItem4Image] = useState('');

  // Fetch data from API
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const categoriesRes = await fetch('/api/settings/categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

      if (categoriesData.length >= 2) {
        setMainTitle(categoriesData[0].title);
        setMainImage(categoriesData[0].icon || '');
        setMainDescription(categoriesData[0].description);

        setSubTitle(categoriesData[1].title);
        setSubImage(categoriesData[1].icon || '');
        setSubDescription(categoriesData[1].description);
      }

      // Fetch detail items
      const itemsRes = await fetch('/api/settings/items');
      const itemsData = await itemsRes.json();
      setDetailItems(itemsData);

      if (itemsData.length >= 4) {
        setItem1Title(itemsData[0].title);
        setItem1Image(itemsData[0].icon || '');

        setItem2Title(itemsData[1].title);
        setItem2Image(itemsData[1].icon || '');

        setItem3Title(itemsData[2].title);
        setItem3Image(itemsData[2].icon || '');

        setItem4Title(itemsData[3].title);
        setItem4Image(itemsData[3].icon || '');
      }

      // Fetch terms settings
      const termsRes = await fetch('/api/settings/terms');
      const termsData = await termsRes.json();
      setTerms1(termsData.privacy_consent || '');
      setTerms2(termsData.service_terms || '');
      setTerms3(termsData.consultation_consent || '');
      setTerms4(termsData.marketing_consent || '');

    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('설정을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBasic = async () => {
    try {
      // Prepare categories data
      const categoriesToUpdate = [
        {
          id: categories[0]?.id,
          title: mainTitle,
          icon: mainImage,
          description: mainDescription
        },
        {
          id: categories[1]?.id,
          title: subTitle,
          icon: subImage,
          description: subDescription
        }
      ];

      // Prepare detail items data
      const itemsToUpdate = [
        { id: detailItems[0]?.id, title: item1Title, icon: item1Image },
        { id: detailItems[1]?.id, title: item2Title, icon: item2Image },
        { id: detailItems[2]?.id, title: item3Title, icon: item3Image },
        { id: detailItems[3]?.id, title: item4Title, icon: item4Image }
      ];

      // Save categories
      const categoriesRes = await fetch('/api/settings/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: categoriesToUpdate })
      });

      if (!categoriesRes.ok) throw new Error('Failed to save categories');

      // Save detail items
      const itemsRes = await fetch('/api/settings/items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate })
      });

      if (!itemsRes.ok) throw new Error('Failed to save items');

      alert('저장되었습니다.');
      await fetchSettings(); // Refresh data
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleSaveTerms = async () => {
    try {
      const response = await fetch('/api/settings/terms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacy_consent: terms1,
          service_terms: terms2,
          consultation_consent: terms3,
          marketing_consent: terms4
        })
      });

      if (!response.ok) throw new Error('Failed to save terms');

      alert('저장되었습니다.');
      await fetchSettings(); // Refresh data
    } catch (error) {
      console.error('Error saving terms:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleSaveSurveyLink = () => {
    alert('저장되었습니다.');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ textAlign: 'center', padding: '2rem' }}>로딩 중...</p>
      </div>
    );
  }

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
              <label className={styles.termsLabel}>
                개인정보 수집·이용 동의
                <span className={styles.charCount}>{terms1.length}/1000자</span>
              </label>
              <textarea
                value={terms1}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 1000);
                  setTerms1(value);
                }}
                maxLength={1000}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요 (최대 1000자)"
              />
            </div>

            <div className={styles.termsGroup}>
              <label className={styles.termsLabel}>
                서비스 이용 약관
                <span className={styles.charCount}>{terms2.length}/1000자</span>
              </label>
              <textarea
                value={terms2}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 1000);
                  setTerms2(value);
                }}
                maxLength={1000}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요 (최대 1000자)"
              />
            </div>

            <div className={styles.termsGroup}>
              <label className={styles.termsLabel}>
                상담 안내 메시지 수신 동의
                <span className={styles.charCount}>{terms3.length}/1000자</span>
              </label>
              <textarea
                value={terms3}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 1000);
                  setTerms3(value);
                }}
                maxLength={1000}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요 (최대 1000자)"
              />
            </div>

            <div className={styles.termsGroup}>
              <label className={styles.termsLabel}>
                마케팅이벤트 안내 수신 동의
                <span className={styles.charCount}>{terms4.length}/1000자</span>
              </label>
              <textarea
                value={terms4}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 1000);
                  setTerms4(value);
                }}
                maxLength={1000}
                className={styles.termsTextarea}
                rows={5}
                placeholder="약관 내용을 입력하세요 (최대 1000자)"
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
