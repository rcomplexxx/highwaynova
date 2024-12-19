import { ErrorIcon } from "@/public/images/svgs/svgImages";
import styles from "./inputfield.module.css";

export default function InputField({
  id,
  autocomplete,
  placeHolder,
  type,
  handleChange,
  handleKeyUp,
  error,
  children,
}) {
  return (
    <div className={styles.form_group}>
      <div className={styles.inputWrapper}>
      <input
        type={type}
        id={id}
        placeholder=" "
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        maxLength={127}
        autoComplete={autocomplete}
        className={`${styles.input_field} ${error && styles.input_error}`}
      />

<label htmlFor={id} className={styles.label}>
        {placeHolder}
      </label>

      {children && children}

      </div>
      
      
     
      {error && <span className={`${styles.error} ${id==="coupon_code" && styles.couponError}`}><ErrorIcon/>{error}</span>}
    </div>
  );
}
