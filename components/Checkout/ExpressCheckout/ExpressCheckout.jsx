import GooglePay from '../GooglePay/GooglePay'
import PayPalButton from '../PayPal/PayPal'
import styles from './expresscheckout.module.css'



export default function ExpressCheckout({products, discount, checkFields, organizeUserData,  setCartProducts, setErrors}){


    return <div className={styles.expressCheckoutWrapper}>
            <h3 className={styles.expressCheckoutTitle}>Express checkout</h3>
            <div className={styles.expressPaymentsWrapper}>
                <div className={styles.paymentDiv}>
                <PayPalButton checkFields={checkFields} organizeUserData={organizeUserData} method="paypal" setCartProducts={setCartProducts } setErrors={setErrors}/>
         
                </div>

                <div className={`${styles.paymentDiv} ${styles.paymentDivLast}`}>
                <GooglePay products={products} setCartProducts={setCartProducts} discount={discount} organizeUserData={(paymentToken)=>{return organizeUserData('GPAY', paymentToken)}} />
                    </div>

            </div>

            <div className={styles.expressCheckoutBottomBorder}>
                <div className={styles.borderLineDiv}/>
                <span className={styles.borderOrSpan}>OR</span>
                <div className={styles.borderLineDiv}/>
            </div>
    </div>
}
