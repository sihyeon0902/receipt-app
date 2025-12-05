import { UNITS, UNIT_LABELS } from "../../constants/units";
import Button from "../common/Button";
import Input from "../common/Input";
import styles from "./ProductInputSection.module.css";

const ProductInputSection = ({
  unit,
  setUnit,
  name,
  setName,
  price,
  setPrice,
  onAdd,
  favorites,
  onFavoriteSelect,
  nameRef,
  priceRef,
}) => {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>어종 및 단가 입력</h3>
      <div className={styles.inputBox}>
        <div className={styles.radioGroup}>
          {Object.values(UNITS).map((u) => (
            <label key={u} className={styles.radioLabel}>
              <input
                type="radio"
                name="unit"
                value={u}
                checked={unit === u}
                onChange={(e) => setUnit(e.target.value)}
                className={styles.radioInput}
              />
              {UNIT_LABELS[u]}
            </label>
          ))}
        </div>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapperName}>
            <Input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="어종"
              className={styles.fullWidthInput}
            />
          </div>
          <div className={styles.inputWrapperPrice}>
            <Input
              ref={priceRef}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="단가"
              className={styles.fullWidthInput}
            />
          </div>
        </div>
        <Button variant="success" onClick={onAdd}>
          + 추가하기
        </Button>
        {favorites.length > 0 && (
          <div className={styles.favoritesRow}>
            <span className={styles.favoritesLabel}>⭐즐겨찾기 목록 | </span>
            <div className={styles.favoritesList}>
              {favorites.map((fish, idx) => (
                <button
                  key={idx}
                  onClick={() => onFavoriteSelect(fish.name)}
                  className={styles.favoriteChip}
                >
                  {fish.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default ProductInputSection;
