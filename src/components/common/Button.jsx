import styles from "./Common.module.css";

const Button = ({
  children,
  onClick,
  className = "",
  style,
  variant = "primary",
}) => {
  const variantClass = styles[variant] || "";

  return (
    <button
      className={`${styles.btnBase} ${variantClass} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
