import styles from "./inputfield.module.css";

export default function InputField({
  id,
  autocomplete,
  placeHolder,
  type,
  handleChange,
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
        maxLength={127}
        autoComplete={autocomplete && autocomplete}
        className={`${styles.input_field} ${error ? styles.input_error : ""}`}
      />

<label htmlFor={id} className={styles.label}>
        {placeHolder}
      </label>
      </div>
     
      {children && children}
    </div>
  );
}
