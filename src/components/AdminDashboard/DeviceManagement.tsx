import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import styles from "./DeviceManagement.module.css";

interface Device {
  id: number;
  account: string;
  ssaid: string;
  device_name: string;
  experts: string[];
  created_at: string;
}

interface Expert {
  expert_id: number;
  expert_name: string;
  is_fixed: boolean;
}

interface SelectedExpert {
  expert_id: number;
  expert_name: string;
  is_fixed: boolean;
}

export default function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isNewDevice, setIsNewDevice] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableExperts, setAvailableExperts] = useState<Expert[]>([]);
  const [selectedExpertIds, setSelectedExpertIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    account: "",
    ssaid: "",
    device_name: "",
    experts: [] as string[],
  });

  // Fetch experts from API
  const fetchExperts = async () => {
    try {
      const response = await fetch('/api/experts');
      const data = await response.json();

      if (data.success) {
        setAvailableExperts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch experts:', error);
    }
  };

  // Fetch devices from API
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/devices?page=${currentPage}&limit=10&q=${searchQuery}`
      );
      const data = await response.json();

      // Check if response is successful and has data
      if (!response.ok || !data.data) {
        console.error("API error:", data.error || "Failed to fetch devices");
        setDevices([]);
        setTotalPages(1);
        setTotalCount(0);
        return;
      }

      setDevices(data.data);
      setTotalPages(data.totalPages);
      setTotalCount(data.total);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setDevices([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchExperts();
  }, [currentPage, searchQuery]);

  const handleExpertToggle = (expertId: number, isFixed: boolean) => {
    let newExpertIds = [...selectedExpertIds];

    if (newExpertIds.includes(expertId)) {
      newExpertIds = newExpertIds.filter((id) => id !== expertId);
    } else {
      if (isFixed) {
        // Remove other fixed experts (only one fixed allowed)
        const fixedExpert = availableExperts.find(e => e.expert_id === expertId);
        newExpertIds = newExpertIds.filter((id) => {
          const expert = availableExperts.find(e => e.expert_id === id);
          return expert && !expert.is_fixed;
        });
        newExpertIds.unshift(expertId);
      } else {
        newExpertIds.push(expertId);
      }
    }

    setSelectedExpertIds(newExpertIds);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleSave = async () => {
    try {
      // Convert expert IDs to expert objects with display info
      const expertsData = selectedExpertIds.map(id => {
        const expert = availableExperts.find(e => e.expert_id === id);
        return {
          expert_id: id,
          display_type: expert?.is_fixed ? 'fixed' : 'random'
        };
      });

      if (isNewDevice) {
        // Create new device
        const response = await fetch("/api/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ssaid: formData.ssaid,
            device_name: formData.device_name,
            device_type: null,
            experts: expertsData
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          alert(error.error || "Failed to create device");
          return;
        }

        alert("기기가 성공적으로 등록되었습니다.");
      } else if (selectedDevice) {
        // Update existing device
        const response = await fetch(`/api/devices/${selectedDevice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ssaid: selectedDevice.ssaid,
            device_name: selectedDevice.device_name,
            device_type: null,
            status: 'active',
            experts: expertsData
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          alert(error.error || "Failed to update device");
          return;
        }

        alert("기기가 성공적으로 수정되었습니다.");
      }

      // Refresh data and close form
      setSelectedDevice(null);
      setIsNewDevice(false);
      setSelectedExpertIds([]);
      setFormData({ account: "", ssaid: "", device_name: "", experts: [] });
      fetchDevices();
    } catch (error) {
      console.error("Save error:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (deviceId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete device");
        return;
      }

      alert("기기가 성공적으로 삭제되었습니다.");
      fetchDevices();
    } catch (error) {
      console.error("Delete error:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // Load device expert mappings when editing
  const loadDeviceExperts = async (deviceId: number) => {
    try {
      const response = await fetch(`/api/experts/device/${deviceId}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const expertIds = data.data.map((expert: Expert) => expert.expert_id);
        setSelectedExpertIds(expertIds);
      }
    } catch (error) {
      console.error('Failed to load device experts:', error);
      setSelectedExpertIds([]);
    }
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    loadDeviceExperts(device.id);
  };

  const handleNewDevice = () => {
    setIsNewDevice(true);
    setSelectedExpertIds([]);
    setFormData({ account: "", ssaid: "", device_name: "", experts: [] });
  };

  const handleCancel = () => {
    setSelectedDevice(null);
    setIsNewDevice(false);
    setSelectedExpertIds([]);
    setFormData({ account: "", ssaid: "", device_name: "", experts: [] });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace("T", " ");
  };

  const getExpertNote = (experts: string[]) => {
    if (experts.length === 0) return "NULL";
    if (experts.length <= 3) return experts.join(", ");
    return `${experts[0]} 등 ${experts.length}명`;
  };

  if (selectedDevice || isNewDevice) {
    const currentData = isNewDevice
      ? formData
      : {
          account: selectedDevice?.account || "",
          ssaid: selectedDevice?.ssaid || "",
          device_name: selectedDevice?.device_name || "",
          experts: selectedDevice?.experts || [],
        };

    return (
      <div className={styles.editContainer}>
        <h3 className={styles.editTitle}>
          {isNewDevice ? "기기 등록" : "기기 수정"}
        </h3>

        <table className={styles.editTable}>
          <tbody>
            <tr>
              <td className={styles.labelCell}>계정</td>
              <td className={styles.valueCell}>
                {isNewDevice ? (
                  <input
                    type="text"
                    value={currentData.account}
                    onChange={(e) =>
                      setFormData({ ...formData, account: e.target.value })
                    }
                    className={styles.input}
                    placeholder="계정을 입력하세요"
                  />
                ) : (
                  currentData.account
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.labelCell}>SSAID</td>
              <td className={styles.valueCell}>
                {isNewDevice ? (
                  <input
                    type="text"
                    value={currentData.ssaid}
                    onChange={(e) =>
                      setFormData({ ...formData, ssaid: e.target.value })
                    }
                    className={styles.input}
                    placeholder="SSAID를 입력하세요"
                  />
                ) : (
                  currentData.ssaid
                )}
              </td>
            </tr>
            <tr>
              <td className={styles.labelCell}>
                디바이스명*
                <div className={styles.helpText}>최대 30자</div>
              </td>
              <td className={styles.valueCell}>
                <input
                  type="text"
                  value={currentData.device_name}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 30);
                    if (isNewDevice) {
                      setFormData({ ...formData, device_name: value });
                    } else if (selectedDevice) {
                      setSelectedDevice({ ...selectedDevice, device_name: value });
                    }
                  }}
                  maxLength={30}
                  className={styles.input}
                  placeholder="디바이스명을 입력하세요 (최대 30자)"
                />
              </td>
            </tr>
            <tr>
              <td className={styles.labelCell}>
                노출 전문가*
                <div className={styles.warningText}>
                  *고정 노출은 한명만 선택 가능하며, 그외 전문가는 랜덤으로
                  노출됩니다.
                </div>
              </td>
              <td className={styles.valueCell}>
                <button
                  onClick={() => setShowExpertModal(true)}
                  className={styles.selectButton}>
                  선택하기
                </button>
                <div className={styles.expertTags}>
                  {selectedExpertIds.map((expertId) => {
                    const expert = availableExperts.find(e => e.expert_id === expertId);
                    if (!expert) return null;
                    const expertDisplay = expert.is_fixed ? `${expert.expert_name}(고정)` : expert.expert_name;
                    return (
                      <span key={expertId} className={styles.expertTag}>
                        {expertDisplay}
                      </span>
                    );
                  })}
                </div>
              </td>
            </tr>
            <tr>
              <td className={styles.labelCell}>등록일시</td>
              <td className={styles.valueCell}>
                {isNewDevice
                  ? new Date()
                      .toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace("T", " ")
                  : formatDate(selectedDevice?.created_at || "")}
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.buttonGroup}>
          <button onClick={handleCancel} className={styles.cancelButton}>
            취소
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            저장하기
          </button>
        </div>

        {showExpertModal && (
          <div
            className={styles.modalOverlay}
            onClick={() => setShowExpertModal(false)}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>전문가 선택</h3>
              <div className={styles.expertGrid}>
                {availableExperts.map((expert) => {
                  const expertDisplay = expert.is_fixed ? `${expert.expert_name}(고정)` : expert.expert_name;
                  return (
                    <button
                      key={expert.expert_id}
                      onClick={() => handleExpertToggle(expert.expert_id, expert.is_fixed)}
                      className={`${styles.expertButton} ${
                        selectedExpertIds.includes(expert.expert_id)
                          ? styles.expertButtonActive
                          : ""
                      }`}>
                      {expertDisplay}
                    </button>
                  );
                })}
              </div>
              <div className={styles.modalButtons}>
                <button
                  onClick={() => setShowExpertModal(false)}
                  className={styles.modalCloseButton}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="검색어"
              className={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button onClick={handleSearch} className={styles.searchButton}>
            검색
          </button>
        </div>
        <button onClick={handleNewDevice} className={styles.newButton}>
          <AddRoundedIcon style={{ fontSize: "20px" }} />
          <span>기기 등록 하기</span>
        </button>
      </div>

      <p className={styles.dataCount}>data. {totalCount}건</p>

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
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  Loading...
                </td>
              </tr>
            ) : devices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              devices.map((item, idx) => (
                <tr key={item.id} className={styles.tr}>
                  <td className={styles.td}>
                    {totalCount - (currentPage - 1) * 10 - idx}
                  </td>
                  <td className={styles.td}>{item.account}</td>
                  <td className={styles.td}>{item.ssaid}</td>
                  <td className={styles.td}>{item.device_name}</td>
                  <td className={styles.td}>{getExpertNote(item.experts)}</td>
                  <td className={styles.td}>{formatDate(item.created_at)}</td>
                  <td className={styles.tdCenter}>
                    <button
                      onClick={() => handleEditDevice(item)}
                      className={styles.editLink}>
                      [수정]
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={styles.deleteLink}>
                      [삭제]
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}>
          <ChevronLeft className={styles.paginationIcon} />
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`${styles.pageNumber} ${
              currentPage === i + 1 ? styles.pageNumberActive : ""
            }`}
            onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button
          className={styles.paginationButton}
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}>
          <ChevronRight className={styles.paginationIcon} />
        </button>
      </div>
    </div>
  );
}
