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
          if(!mounted.current)return;

          clearTimeout(visibilityTimeout.current);
          const billingInfoDiv= billingInfoDivRef.current
          if(isOpen){



         
          billingInfoDiv.style.maxHeight=`${billingInfoDiv.scrollHeight}px`;
          visibilityTimeout.current=setTimeout(()=>{
            billingInfoDiv.style.maxHeight=`none`;
           }, 500)
          }
          else{

            billingInfoDiv.style.transition=`max-height 0s ease`;
           
            billingInfoDiv.style.maxHeight=`${billingInfoDiv.scrollHeight}px`;
            setTimeout(()=>{
              billingInfoDiv.style.transition=`max-height 0.5s ease`;
              billingInfoDiv.style.maxHeight=`0`;
             }, 1)


            
          }
        },[isOpen])

        useEffect(()=>{
          mounted.current=true;
        },[])
        
        const handleChange = (event) => {
         if (errors.hasOwnProperty(event.target.id)) {
           const newErrors = { ...errors };
           const field = event.target.id;
           delete newErrors[field];
           setErrors(newErrors);
         }
       };
    

    return <div id='billingInfo' ref={billingInfoDivRef} className={`${styles.billingAddressWrapper}`}> 
        
            <h3 className={styles.billingAddressTitle}>Billing address</h3>

            <div className={styles.InputFieldRow}>
    <InputField
           id="billingEmail"
           placeHolder='Email'
              type="text"
              name="name"
              handleChange={handleChange} 
            //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
       
            //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
             error={errors.billingEmail}
            />
    

          </div>

        <div className={`${styles.InputFieldRow} ${styles.billingCountry}`}>
        <CountryInput
                  id="billingCountry"
                  setErrors={setErrors}
                  error={errors.billingCountry}
                  inputNumber={9}
                />
</div>
        
       








          <div className={styles.InputFieldRow}>
    <InputField
           id="billingAddress"
           placeHolder='Address'
              type="text"
              name="name"
              handleChange={handleChange} 
            //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
       
            //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
             error={errors.billingAddress}
            />
    

          </div>


          

               
               

{ showApt ?  <div className={styles.InputFieldRow}> <InputField
                       id="billingApt"
                       placeHolder='Apartment, suite, etc. (Optional)'
                          type="text"
                          name="name"
                          handleChange={handleChange}   
                        //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
                   
                        //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
                         error={errors.billingApt}
                        /> </div>:<p className={styles.aptAdder} onClick={()=>{setShowApt(true);}}>+ Add apartment, suite etc.</p>}
                
            
                     



          <div className={styles.InputFieldRow}>
    <InputField
           id="billingCity"
           placeHolder='City'
              type="text"
              name="name"
              handleChange={handleChange}
            //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
       
            //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
             error={errors.billingCity}
            />

<InputField
           id="billingState"
           placeHolder='State'
              type="text"
              name="name"
              handleChange={handleChange}
            //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
       
            //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
             error={errors.billingState}
            />

<InputField
           id="billingZipcode"
           placeHolder='ZIP code'
              type="text"
              name="name"
              handleChange={handleChange} 
            //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
       
            //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
             error={errors.billingZipcode}
            />
    

          </div>



          <div className={styles.InputFieldRow}>
    <InputField
           id="billingPhone"
           placeHolder='Phone (optional)'
              type="text"
              name="name"
              handleChange={handleChange}  
            //  handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
       
            //   if(event.target.value==='') setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
             error={errors.billingPhone}
             children={ <FloatingBadge message={'In case we need to contact you about your order'}/>}
            />
       

          </div>




          </div>
    
    
}