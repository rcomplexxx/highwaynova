import { ErrorIcon } from "@/public/images/svgs/svgImages";
import styles from "./inputfield.module.css";

import { CheckoutContext } from "@/contexts/CheckoutContext";
import { useContext } from "react";

export default function InputField({
  id,
  autocomplete,
  placeHolder,
  type,
  handleKeyUp,
  
  children,
}) {

  const {errors, setErrors} = useContext(CheckoutContext);



  const handleChange = () => {
    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };



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
        className={`${styles.input_field} ${errors[id] && styles.input_error}`}
      />

<label htmlFor={id} className={styles.label}>
        {placeHolder}
      </label>

      {children && children}

      </div>
      
      
     
      {errors[id] && <span className={`${styles.error} ${id==="coupon_code" && styles.couponError}`}><ErrorIcon/>{errors[id]}</span>}
    </div>
  );
}
