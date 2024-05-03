import GooglePay from "../GooglePay/GooglePay";
import PayPalButton from "../PayPal/PayPal";
import styles from "./expresscheckout.module.css";

export default function ExpressCheckout({
  products,
  tip,
  discount,
  checkFields,
  organizeUserData,
  setCartProducts,
  setErrors,
}) {
  return (
    <div className={styles.expressCheckoutWrapper}>
      <h3 className={styles.expressCheckoutTitle}>Express checkout</h3>
      <div className={styles.expressPaymentsWrapper}>
        <div className={styles.paymentDiv}>
          <div className={styles.paymentDivFront}>
          <PayPalButton
          color='blue'
          type='express'
             checkFields={checkFields}
             organizeUserData={organizeUserData}
             method="paypal"
             setCartProducts={setCartProducts}
             setErrors={setErrors}
          />
          </div>
        </div>

        <div className={`${styles.paymentDiv} ${styles.paymentDivLast}`}>
          <div className={styles.paymentDivFront}>
          <GooglePay
            products={products}
            setCartProducts={setCartProducts}
            discount={discount}
            tip={tip}
            organizeUserData={(paymentToken) => {
              return organizeUserData("GPAY", paymentToken);
            }}
          />
          </div>
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
