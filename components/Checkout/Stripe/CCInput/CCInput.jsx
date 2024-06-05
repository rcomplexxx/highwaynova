import styles from "./ccinput.module.css";

export default function CCInput({
  id,
  value,
  handleChange,
  handleBlur,
  maxlength,
  autocomplete,
  placeHolder,
  type,
  error,
  children,
}) {
  return (<>
    <div className={`${styles.form_group} ${error && styles.formGroupError}`}>
      <input
        type={type}
        id={id}
        value={value}
        placeholder=" "
        maxLength={  maxlength?maxlength:128}
        onBlur={handleBlur}
        onChange={(event)=>{handleChange(event)}}
        autoComplete={autocomplete && autocomplete}
        className={`${styles.input_field} ${error && styles.input_error}`}
      />
      <label htmlFor={id} className={styles.label}>
        {placeHolder}
      </label>
      {children && children}
      {error && (
        <p className={styles.error}>{error}</p>
      )}
    </div>
   
      </>
  );
}
