import { useState } from "react";
import { useTrade } from "../context/TradeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./SettingPage.module.css";

const SHOP_INPUTS = [
  { name: "name", placeholder: "상호명" },
  { name: "owner", placeholder: "대표자 성명" },
  { name: "mobile", placeholder: "휴대폰 번호", type: "tel" },
  { name: "phone", placeholder: "사무실 번호 (선택)", type: "tel" },
  { name: "fax", placeholder: "팩스 번호 (선택)", type: "tel" },
  { name: "account1", placeholder: "계좌번호 1" },
  { name: "account2", placeholder: "계좌번호 2 (선택)" },
];

const SettingsPage = () => {
  const {
    shopInfo,
    setShopInfo,
    favorites,
    setFavorites,
    customers,
    setCustomers,
    updateShopInfo,
  } = useTrade();
  const navigate = useNavigate();

  const [newFavorite, setNewFavorite] = useState("");
  const [newCustomer, setNewCustomer] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (value, setValue, listSetter, isProduct = false) => {
    if (!value.trim()) return;
    const newItem = {
      id: Date.now(),
      name: value,
      ...(isProduct && { unit: "kg", price: 0 }),
    };
    listSetter((prev) => [...prev, newItem]);
    setValue("");
  };

  const handleDeleteItem = (id, listSetter) => {
    listSetter((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    updateShopInfo(shopInfo);
    toast.success("정보가 저장되었습니다. 💾");
    navigate("/");
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsWrapper}>
        <header className={styles.settingsHeader}>
          <h1 className={styles.headerTitle}>⚙️ 설정</h1>
        </header>

        <div className={styles.settingsContent}>
          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}>🏠 내 가게 정보 설정</h2>
            <div className={styles.inputGroup}>
              {SHOP_INPUTS.map((input) => (
                <input
                  key={input.name}
                  type={input.type || "text"}
                  name={input.name}
                  value={shopInfo[input.name] || ""}
                  onChange={handleChange}
                  placeholder={input.placeholder}
                  className={styles.customInput}
                />
              ))}
              <button onClick={handleSave} className={styles.btnSave}>
                정보 저장하기
              </button>
            </div>
          </div>

          <ItemListCard
            title="🐟 자주 거래하는 어종"
            items={favorites}
            value={newFavorite}
            setValue={setNewFavorite}
            onAdd={() =>
              handleAddItem(newFavorite, setNewFavorite, setFavorites, true)
            }
            onDelete={(id) => handleDeleteItem(id, setFavorites)}
            placeholder="어종 입력"
          />

          <ItemListCard
            title="🏪 자주 거래하는 거래처"
            items={customers}
            value={newCustomer}
            setValue={setNewCustomer}
            onAdd={() =>
              handleAddItem(newCustomer, setNewCustomer, setCustomers)
            }
            onDelete={(id) => handleDeleteItem(id, setCustomers)}
            placeholder="거래처 입력"
          />

          <div className={styles.versionInfo}>
            <p className={styles.versionText}>버전 1.0.1 | 오늘의 거래</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemListCard = ({
  title,
  items,
  value,
  setValue,
  onAdd,
  onDelete,
  placeholder,
}) => (
  <div className={styles.settingsCard}>
    <h2 className={styles.cardTitle}>{title}</h2>
    <div className={styles.addInputArea}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`${styles.customInput} ${styles.inputFlex}`}
        onKeyPress={(e) => e.key === "Enter" && onAdd()}
      />
      <button onClick={onAdd} className={styles.btnAdd}>
        추가
      </button>
    </div>
    {items?.length > 0 ? (
      <div className={styles.listContainer}>
        {items.map((item) => (
          <div key={item.id} className={styles.listItem}>
            <span className={styles.itemName}>{item.name}</span>
            <button
              onClick={() => onDelete(item.id)}
              className={styles.btnDeleteItem}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className={styles.emptyList}>
        <p className={styles.emptyText}>등록된 항목이 없습니다.</p>
      </div>
    )}
  </div>
);

export default SettingsPage;
