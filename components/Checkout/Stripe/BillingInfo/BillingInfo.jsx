import styles from './billinginfo.module.css'
import { useEffect, useRef, useState } from 'react';
import CountryInput from '../../Input/CountryInput/CountryInput';
import FloatingBadge from '../../FloatingBadge/FloatingBadge';
import InputField from '../../Input/InputField';





export default function BillingInfo({isOpen}){
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

       
        
        
     

    return <div ref={billingInfoDivRef} className={`${styles.billingAddressWrapper}`}> 
        
            <h3 className={styles.billingAddressTitle}>Billing address</h3>

            <div className={styles.inputFields}>

      
      
    <InputField
           id="billingEmail"
           placeHolder='Email'
              type="text"
            
            
            />
    




        <CountryInput
                  id="billingCountry"
                
                />


        
       








    <InputField
           id="billingAddress"
           placeHolder='Address'
              type="text"
              
            
            />
    

      
      


          

               
               

{ showApt ? <InputField
                       id="billingApt"
                       placeHolder='Apartment, suite, etc. (Optional)'
                          type="text"
                            
                    
                          
                        />:<span className={styles.aptAdder} onClick={()=>{setShowApt(true);}}>+ Add apartment, suite etc.</span>}
                
            
                     



          <div className={styles.InputFieldRow}>
    <InputField
           id="billingCity"
           placeHolder='City'
              type="text"
              
        
              
            />

<InputField
           id="billingState"
           placeHolder='State'
              type="text"
             
              
           
              
            />

<InputField
           id="billingZipcode"
           placeHolder='ZIP code'
              type="text"
              
              
            
            />
    

          </div>




    <InputField
           id="billingPhone"
           placeHolder='Phone (optional)'
              type="text"
              
               
            
             children={ <FloatingBadge message={'In case we need to contact you about your order'}/>}
            />
       



          
          </div>



          </div>
    
    
}