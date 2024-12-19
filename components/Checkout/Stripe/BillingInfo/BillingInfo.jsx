import styles from './billinginfo.module.css'
import { useEffect, useRef, useState } from 'react';
import CountryInput from '../../Input/CountryInput/CountryInput';
import FloatingBadge from '../../FloatingBadge/FloatingBadge';
import InputField from '../../Input/InputField';







export default function BillingInfo({isOpen, errors, setErrors}){
    const [showApt, setShowApt] = useState(false);
    const mounted= useRef(false);
    const visibilityTimeout= useRef();
    const billingInfoDivRef = useRef();
   

    useEffect(()=>{
        showApt && document.getElementById("billingApt").focus();
        }, [showApt]);

        useEffect(()=>{
          if(!mounted.current){ mounted.current=true; return;}

          clearTimeout(visibilityTimeout.current);
          const billingInfoDiv= billingInfoDivRef.current
          if(isOpen){



         
          billingInfoDiv.style.maxHeight=`${billingInfoDiv.scrollHeight}px`;
          visibilityTimeout.current=setTimeout(()=>{
            billingInfoDiv.style.maxHeight=`none`;
            billingInfoDiv.style.overflow= 'visible';
           }, 500)
          }
          else{

            billingInfoDiv.style.overflow= 'hidden';
            billingInfoDiv.style.transition=`max-height 0s ease`;
           
            billingInfoDiv.style.maxHeight=`${billingInfoDiv.scrollHeight}px`;
            setTimeout(()=>{
              billingInfoDiv.style.transition=`max-height 0.5s ease`;
              billingInfoDiv.style.maxHeight=`0`;
             }, 1)


            
          }
        },[isOpen])

       
        
        
        const handleChange = (event) => {
         if (errors.hasOwnProperty(event.target.id)) {
           const newErrors = { ...errors };
           const field = event.target.id;
           delete newErrors[field];
           setErrors(newErrors);
         }
       };
    

    return <div ref={billingInfoDivRef} className={`${styles.billingAddressWrapper}`}> 
        
            <h3 className={styles.billingAddressTitle}>Billing address</h3>

            <div className={styles.inputFields}>

      
      
    <InputField
           id="billingEmail"
           placeHolder='Email'
              type="text"
              handleChange={handleChange} 
            
             error={errors.billingEmail}
            />
    




        <CountryInput
                  id="billingCountry"
                  setErrors={setErrors}
                  error={errors.billingCountry}
                  inputNumber={9}
                />


        
       








    <InputField
           id="billingAddress"
           placeHolder='Address'
              type="text"
              handleChange={handleChange} 
            
             error={errors.billingAddress}
            />
    

      
      


          

               
               

{ showApt ? <InputField
                       id="billingApt"
                       placeHolder='Apartment, suite, etc. (Optional)'
                          type="text"
                          handleChange={handleChange}   
                    
                          
                         error={errors.billingApt}
                        />:<span className={styles.aptAdder} onClick={()=>{setShowApt(true);}}>+ Add apartment, suite etc.</span>}
                
            
                     



          <div className={styles.InputFieldRow}>
    <InputField
           id="billingCity"
           placeHolder='City'
              type="text"
              handleChange={handleChange}
        
              
             error={errors.billingCity}
            />

<InputField
           id="billingState"
           placeHolder='State'
              type="text"
             
              handleChange={handleChange}
           
              
             error={errors.billingState}
            />

<InputField
           id="billingZipcode"
           placeHolder='ZIP code'
              type="text"
              
              handleChange={handleChange} 
            
             error={errors.billingZipcode}
            />
    

          </div>




    <InputField
           id="billingPhone"
           placeHolder='Phone (optional)'
              type="text"
              
              handleChange={handleChange}  
            
             error={errors.billingPhone}
             children={ <FloatingBadge message={'In case we need to contact you about your order'}/>}
            />
       



          
          </div>



          </div>
    
    
}