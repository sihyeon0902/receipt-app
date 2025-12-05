import { UNITS } from "../../constants/units";
import styles from "./CartListSection.module.css";

const CartListSection = ({ cart, onUpdateItem, onRemoveItem }) => {
  if (cart.length === 0) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>수량 확인</h3>
      <div className={styles.tableContainer}>
        <div className={styles.header}>
          <div className={styles.colName}>품명</div>
          <div className={styles.colQty}>수량</div>
          <div className={styles.colPrice}>단가</div>
          <div className={styles.colAction}></div>
        </div>

        {cart.map((item) => (
          <div key={item.id} className={styles.row}>
            <div className={styles.colName}>{item.name}</div>
            <div className={styles.colQty}>
              <div className={styles.qtyControl}>
                <input
                  type="number"
                  value={item.weight}
                  onChange={(e) =>
                    onUpdateItem(item.id, "weight", e.target.value)
                  }
                  className={styles.qtyInput}
                />
                <span className={styles.unitText}>
                  {item.unit === UNITS.PIECE ? "개" : "kg"}
                </span>
              </div>
            </div>

            <div className={styles.colPrice}>
              <span className={styles.priceText}>
                {item.price.toLocaleString()}
              </span>
            </div>

            <div className={styles.colAction}>
              <button
                onClick={() => onRemoveItem(item.id)}
                className={styles.removeBtn}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CartListSection;
