
import GooglePay from "./GooglePay/GooglePay";
import PayPalButton from "./PayPal/PayPal";
import styles from "./expresscheckout.module.css";

import { CheckoutContext } from "@/contexts/CheckoutContext";
import { useContext } from "react";



export default function ExpressCheckout() 



{






  const {checkFields} = useContext(CheckoutContext);



  return (
    <div className={styles.expressCheckoutWrapper}>
      <h3 className={styles.expressCheckoutTitle}>Express checkout</h3>
      <div className={styles.expressPaymentsWrapper}>
        <div className={styles.paymentDiv}>
         
          <PayPalButton
          color='blue'
          type='express'
             checkFields={checkFields}
             
             
          
             
           
             
             
          />
         
        </div>

        <div className={styles.paymentDiv}>
       
          <GooglePay />
        
        </div>
        
      </div>

      <div className={styles.expressCheckoutBottomBorder}>
        <div className={styles.borderLineDiv} />
        <span className={styles.borderOrSpan}>OR</span>
        <div className={styles.borderLineDiv} />
      </div>
    </div>
  );
}
