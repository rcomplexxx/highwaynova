import { useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import styles from "./countryinput.module.css";

import { ArrowDown } from "@/public/images/svgs/svgImages";

export default function CountryInput({ id, setErrors, error }) {
  const [country, setCountry] = useState("");
  const [isFocused, setIsFocused]= useState(false);

  const handleChange = (c) => {
    console.log(c);

    setCountry(c);

    if (error && c !== "" && c !== null) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };

        delete newErrors[id];
        return newErrors;
      });
    }


   

    if(c!=="" && isFocused){

      const nextInputNode = id==="country"?document.getElementById('firstName'):document.getElementById('billingAddress')
     
      if(nextInputNode.value==="")nextInputNode.focus();
      else  document.getElementById(id).blur();
    }
    else   document.getElementById(id).blur();

  
  };

  return (
    <div className={`${styles.form_group} ${isFocused && styles.countryFocused} ${error && styles.input_error}`}>
      <CountryDropdown
        id={id}
        value={country}
        priorityOptions={["CA", "US", "GB"]}
        onChange={(c) => {
          handleChange(c);
        
          
        }}
        onFocus={()=>{setIsFocused(true);}}
        onBlur={()=>{setIsFocused(false)}}
        defaultOptionLabel="Country *"
        classes={`${styles.countrySelectStyle}`}
        
       
      />
      <ArrowDown color={'var(--checkout-input-placeholder)'} styleClassName={styles.arrowDown}/>
     
      <label
        htmlFor={id}
        className={`${styles.label} ${country != "" && styles.labelDown}`}
      >
        Country
      </label>
      <span
        
        className={`${styles.countryNameLabel} ${
          country != "" && styles.countryNameLabelEnabled
        }`}
      >
        {country != "" ? country : ""}
      </span>
    </div>
  );
}
