import { forwardRef } from "react";
import styles from "./Common.module.css";

const Input = forwardRef(
  (
    { value, onChange, placeholder, type = "text", style, id, className = "" },
    ref
  ) => {
    return (
      <input
        ref={ref}
        id={id}
        className={`${styles.inputBase} ${className}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
