import { useEffect, useMemo, useState } from 'react';
import styles from './coreorderinfo.module.css'
import Image from 'next/image';


export default function CoreOrderInfo(discount, setDiscount, products){


    const [couponCode, setCouponCode] = useState("");
    const [couponValidCode, setCouponValidCode] = useState("");
    const [couponError, setCouponError] = useState(false);

    const prices = useMemo(() => {
        let s = 0;
        products?.forEach((cp, i) => {
          s = s + cp.quantity * cp.price;
        });
        s = s.toFixed(2);
        let discountPrice = 0;
        if (discount.discount != 0) discountPrice = ((s * discount.discount) / 100).toFixed(2);
        const total = (s - discountPrice).toFixed(2);
        return { subTotal: s, discount: discountPrice, total: total };
      }, [products, discount]);
      


    const getProductElements = () => {
        return (
          <>
            {products?.map((cp, i) => (
              <div className={styles.order_pair} key={i}>
                <div className={styles.productImageDiv}>
                  <Image
                    className={styles.productImage}
                    src={`/images/${cp.image}`}
                    alt={`${cp.name}`}
                    height={0}
                    width={0}
                    sizes="25vw"
                  />
                  <span>
                    {cp.quantity} {cp.name}s
                  </span>
                </div>
                <span>${(cp.quantity * cp.price).toFixed(2)}</span>
              </div>
            ))}
          </>
        );
      };
    
    
  
  
  
  const handleCouponApply = () => {
      if (couponCode == "") return;
      const newCoupon = coupons.find((c) => {
        return c.code.toUpperCase() == couponCode.toUpperCase();
      });
      if (newCoupon) {
          setCouponValidCode(newCoupon.code.toUpperCase())
        setDiscount({code: newCoupon.code, discount:newCoupon.discountPercentage});
        setCouponError(false);
        setCouponCode("");
      } else setCouponError(true);
    }
  
  










    return  <div className={styles.segmentWrapper2}>
      {getProductElements()}
      <div className={styles.coupon_code}>
        <div className={styles.form_group}>
          <input
            id="coupon_code"
            type="text"
            value={couponCode}
            onChange={(event) => {
              setCouponCode(event.target.value);
            }}
            onKeyUp={(e) => e.key === 'Enter' && handleCouponApply()}
            className={`${styles.coupon_code_input} ${
              couponError && styles.coupon_code_input_error
            }`}
            placeholder={" "}
          />
          <label htmlFor={"coupon_code"} className={styles.myLabel}>
            Coupon code
          </label>
         
        </div>
        <button
          className={`${styles.apply} ${
            couponCode != "" && styles.applyEnabled
          }`}
          onClick={handleCouponApply}
        >
          Apply
        </button>
      </div>

      {couponError && (
        <p className={styles.couponError}>
          Enter a valid discount code or gift card
        </p>
      )}
{couponValidCode &&
      <div className={styles.mainCouponCode}> 
          <Image src='/images/discount7.png' className={styles.mainDiscountImg} height={16} width={16}/>
          <span>{couponValidCode}</span>
          <Image src='/images/cancelDark.png' onClick={(()=>{setCouponValidCode(undefined);setDiscount({code: '', discount: 0});})}
           className={styles.discountCancelImage} height={16} width={16}/>
          </div>
}

     

      <div className={`${styles.order_pair} ${styles.subTotal}`}>
        <span>Subtotal</span>
        <span>${prices.subTotal}</span>
      </div>
      {discount.discount != 0 && (
        <>
        <div className={styles.order_pair}>
          <span>Order Discount</span>
          <span id="discountPrice">- ${prices.discount}</span>
        </div>

        <div className={`${styles.order_pair} ${styles.discountPair}`}>
        <div className={styles.couponCodeDiv}>
            <Image src='/images/discount7.png' className={styles.discountImg} height={16} width={16}/>
            <span id="couponCode">{couponValidCode}</span>
            </div>
        <span id="discountPrice">- ${prices.discount}</span>
        </div>
     </>

      )}
      <div className={styles.order_pair}>
        <span>Shipping</span>
        <span>Free</span>
      </div>

      <div className={styles.order_pair}>
        
            <span className={styles.totalText}>Total</span>
            
            <div>
        <span className={styles.valute}>USD</span>
        <span id='totalPrice' className={styles.total}>${prices.total}</span>
        </div>
      </div>
    </div>
}