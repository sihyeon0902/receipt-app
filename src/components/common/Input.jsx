import { forwardRef } from "react";
import styles from "./Common.module.css";

/**
 * [공통 컴포넌트] Input
 * - 부모 컴포넌트에서 포커스 제어 등 DOM 요소에 직접 접근해야 하는 상황을 고려하여 forwardRef로 구현했습니다.
 * - 기본 스타일(Base)을 유지하면서 외부에서 스타일을 확장할 수 있도록 설계했습니다.
 */
const Input = forwardRef(
  (
    { value, onChange, placeholder, type = "text", style, id, className = "" },
    ref
  ) => {
    return (
      <input
        ref={ref} // 부모 컴포넌트로부터 전달받은 ref를 실제 DOM 요소에 바인딩
        id={id}
        // 모듈형 CSS의 기본 스타일과 외부에서 주입된 클래스를 병합하여 재사용성 극대화
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

// HOC나 forwardRef 사용 시 React DevTools에서 컴포넌트 이름이 익명으로 뜨는 것을 방지 (디버깅 편의성)
Input.displayName = "Input";

export default Input;
