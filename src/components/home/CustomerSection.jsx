import Input from "../common/Input";
import styles from "./CustomerSection.module.css";

const CustomerSection = ({
  customerName,
  setCustomerName,
  selectedDate,
  setSelectedDate,
  customerFavorites,
  onCustomerSelect,
}) => {
  const getDisplayName = (cust) => {
    if (typeof cust === "string") {
      return cust;
    }

    if (cust && typeof cust === "object") {
      return cust.name || cust.customerName || cust.sangho || "";
    }
    return "";
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>거래처 정보</h3>
      <div className={styles.inputWrapper}>
        <Input
          placeholder="거래처를 입력하세요."
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      {customerFavorites && customerFavorites.length > 0 && (
        <div className={styles.favoritesRow}>
          <span className={styles.favoritesLabel}>⭐즐겨찾기 목록 | </span>
          <div className={styles.favoritesList}>
            {customerFavorites.map((cust, idx) => (
              <button
                key={idx}
                onClick={() => onCustomerSelect(getDisplayName(cust))}
                className={styles.favoriteChip}
              >
                {getDisplayName(cust)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.dateWrapper}>
        <label className={styles.dateLabel}>날짜 선택:</label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
    </section>
  );
};

export default CustomerSection;
