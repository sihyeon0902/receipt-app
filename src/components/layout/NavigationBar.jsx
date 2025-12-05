import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";

const NavigationBar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navBar}>
      <Link
        to="/"
        className={`${styles.navLink} ${
          location.pathname === "/" ? styles.active : ""
        }`}
      >
        🏠 현재 거래 입력
      </Link>

      <Link
        to="/history"
        className={`${styles.navLink} ${
          location.pathname === "/history" ? styles.active : ""
        }`}
      >
        📅 지난 거래 내역
      </Link>

      <Link
        to="/settings"
        className={`${styles.navLink} ${
          location.pathname === "/settings" ? styles.active : ""
        }`}
      >
        ⚙️ 설정
      </Link>
    </nav>
  );
};

export default NavigationBar;
