import  { useState } from 'react';

import styles from './creditcard.module.css'
import CCInput from './CCInput/CCInput';
import FloatingBadge from '../FloatingBadge/FloatingBadge';

const CreditCardForm = () => {
    const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);
    const [cardNumber, setCardNumber]= useState('');
    const [expDate, setExpDate]= useState('');
    const [cvv, setCvv]= useState('');
    const [cardHolderName, setCardHolderName]= useState('');
    const [cardStatesEntered, setCardStatesEntered]= useState({
      cardNumber:false, expiryDate:false, cvv:false, cardHolderName:false
    });
    const [errors, setErrors] = useState({});



    const deleteError = (field) => {
      if (errors.hasOwnProperty(field)) {
        const newErrors = { ...errors };
      
        delete newErrors[field];
        setErrors(newErrors);
      }
    };
 
  

    const handleCardNumber = (event)=>{
      deleteError(event.target.id)
        const value=event.target.value;
        const newValue= value.replace(/\s/g, '');
        if((+cardNumber.replace(/\s/g, '').length)%4===0 && (+newValue.length)%4===0)
        
        {setCardNumber((Math.floor(+newValue / 10)).toString().replace(/(.{4})/g, '$1 ')); return;}
       
        if(!isNaN(+newValue)){
          setCardStatesEntered({...cardStatesEntered,cardNumber:true});
         setCardNumber( newValue.replace(/(.{4})/g, '$1 '));
        }
        
    }

   


    const handleExpDate = (event)=>{
       
      deleteError(event.target.id)
        const value=event.target.value;
        let newValue=value.replace(/\//g, '').replace(/\s/g, '');
        if(expDate.length===5 && value.length===4){setExpDate(Math.floor(+newValue / 10)); return;}
        if(!isNaN(+newValue)){
        if(value.length===1 && value>1)newValue=`0${value}`;
      
        if(newValue.length>1)newValue=newValue.slice(0, 2) + ' / ' + newValue.slice(2)
        setCardStatesEntered({...cardStatesEntered,expiryDate:true});
         setExpDate(newValue);
        }
        
    }


    const handleCvv = (event)=>{
      deleteError(event.target.id)
        const value=event.target.value;
        if(!isNaN(+value) && value.length<5){
          setCardStatesEntered({...cardStatesEntered,cvv:true});
         setCvv(value);
        }
        
    }
    

    const handleCardNumberBlur = (event)=>{
       
     
      if(!cardStatesEntered.cardNumber) return;
      const value=event.target.value.replace(/\s/g, '');
      if(value===''){ setErrors({ ...errors, cardNumber: 'Enter a card number' }); return;}
      if(value.length<12){ setErrors({ ...errors, cardNumber: 'Enter a valid card number' }); return;}
      let s =0 ;
      for(let i=0; i<value.length;i++)
      {
        if(i%2!==0)s=s+(+value[i]);
        else {
          const m=(+value[i])*2;
          if(m>9)s=s+m-9;
          else s=s+m;
        }
      }
      if(s%10!==0)   setErrors({ ...errors, cardNumber: 'Enter a valid card number' });
    
      
  }

  const handleExpDateBlur = (event)=>{
   
    if(!cardStatesEntered.expiryDate) return;
   
    if(event.target.value.length!==9) setErrors({ ...errors, expiryDate: 'Enter a valid card number' });
  }

  const handleCvvBlur = (event)=>{
   
    if(!cardStatesEntered.cvv) return;
   
    if(event.target.value.length<3) setErrors({ ...errors, cvv: 'Enter a valid card number' });
  }


  
    

  return (
    <div className={styles.creditCardForm}>
    
     
    <div className={styles.ccInputRow}>
       
        <CCInput
        id="cardNumber"
        placeHolder='Card number'
        type="tel"
          name="number"
          maxLength="23"
          value={cardNumber}
          
          handleChange={handleCardNumber}
          handleBlur={handleCardNumberBlur}
          children={<FloatingBadge imageName='lock3.png'/>}
          error={errors.cardNumber}
        />
        
</div>
      <div className={styles.ccInputRow}>
       

       
        <CCInput
         id="expiryDate"
         placeHolder='Expiration date (MM / YY)'
         type="tel"
          name="expiry"
          maxLength="9"
          value={expDate}
          handleChange={handleExpDate}
          handleBlur={handleExpDateBlur}
          error={errors.expiryDate}
        />
         <CCInput
         id="cvv"
         placeHolder='Security code'
          type="tel"
          name="cvc"
          maxLength="4"
          value={cvv}
          handleChange={handleCvv}
          handleBlur={handleCvvBlur}
          children={<FloatingBadge message={'3-digit security code usually found on the back of your card. American Express cards have a 4-digit code located on the front.'}/>}
          error={errors.cvv}
       />

</div>
       
<div className={styles.ccInputRow}>
<CCInput
       id="cardHolderName"
       placeHolder='Name on card'
          type="text"
          name="name"
         value={cardHolderName}
         handleChange={(event)=>{deleteError(event.target.id);setCardStatesEntered({...cardStatesEntered,cardHolderName:true});setCardHolderName(event.target.value)}}
         
         handleBlur={(event)=>{if(!cardStatesEntered.cardHolderName) return;
   
          if(event.target.value.length===0) setErrors({ ...errors, cardHolderName: 'Enter a valid card number' });}}
         error={errors.cardHolderName}
        />
      </div>
      <label>
      <input type="checkbox" id="isShippingBilling" checked={billingAddressSameAsShipping}
      onChange={()=>{setBillingAddressSameAsShipping(!billingAddressSameAsShipping)}}
      />
      Use shipping address as billing
    </label>
    <button className={styles.payNowButton}>Pay now</button>
    </div>
  );
};

export default CreditCardForm;


// {/* <Cards
// number={cardNumber}
// name={name}
// expiry={expiry}
// cvc={cvc}
// focused={focus}
// /> */}