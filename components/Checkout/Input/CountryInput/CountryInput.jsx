import { useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import styles from "./countryinput.module.css";

import { ArrowDown } from "@/public/images/svgs/svgImages";

import { CheckoutContext } from "@/contexts/CheckoutContext";
import { useContext } from "react";

export default function CountryInput({ id }) {
  const [country, setCountry] = useState("");
  const [isFocused, setIsFocused]= useState(false);


  const {errors, setErrors} = useContext(CheckoutContext);


  const handleChange = (c) => {
 
    

    setCountry(c);

    if (errors[country] && c !== "" && c !== null) {
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
    <div className={`${styles.form_group} ${isFocused && styles.countryFocused} ${errors[id] && styles.input_error}`}>
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
     
     
      <label
        htmlFor={id}
        className={`${styles.label} ${country != "" && styles.labelDown}`}
      >
        Country
      </label>


      <span className={styles.countryNameLabel} >
        {country != "" && country}
      </span>



      <ArrowDown color={'var(--checkout-input-placeholder)'} styleClassName={styles.arrowDown}/>


    </div>
  );
}
