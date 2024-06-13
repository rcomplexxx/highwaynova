import GooglePay from "../GooglePay/GooglePay";
import PayPalButton from "../PayPal/PayPal";
import styles from "./expresscheckout.module.css";

export default function ExpressCheckout({
  products,
  
  
  checkFields,
  organizeUserData,
 
  
  
}) {
  return (
    <div className={styles.expressCheckoutWrapper}>
      <h3 className={styles.expressCheckoutTitle}>Express checkout</h3>
      <div className={styles.expressPaymentsWrapper}>
        <div className={styles.paymentDiv}>
         
          <PayPalButton
          color='blue'
          type='express'
             checkFields={checkFields}
             organizeUserData={organizeUserData}
          
             
           
             
             
          />
         
        </div>

        <div className={styles.paymentDiv}>
       
          <GooglePay
            products={products}
          
            
            
          
            
          />
        
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
