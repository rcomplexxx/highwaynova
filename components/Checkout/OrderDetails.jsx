import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useContext,
  } from "react";
  import styles from "./orderdetails.module.css";
  import Image from "next/image";
  import coupons from "@/data/coupons.json";
import { CheckoutContext } from "@/contexts/CheckoutContext";
  
  export default function OrderDetails({  products }) {
    const [showAnswer, setShowAnswer] = useState(false);

    const [tempCouponCode, setTemptempCouponCode] = useState("");
    const [couponError, setCouponError] = useState(false);

    const summeryDivRef = useRef();
    const expendHeightTimeout = useRef();
    const mountedRef=useRef();
  
   

    const {total, subTotal, couponCode, setAndValidateCouponCode, discount, tip} = useContext(CheckoutContext);


      useEffect(()=>{

        if(!mountedRef.current){mountedRef.current=true; return;}

        clearTimeout(expendHeightTimeout.current);


        const summeryDiv = summeryDivRef.current;
        if(showAnswer){

          summeryDiv.style.maxHeight = `${summeryDiv.scrollHeight}px`;
          expendHeightTimeout.current=setTimeout(()=>{
       
            summeryDiv.style.maxHeight=`none`;
           }, 300)

      }

        else {



          summeryDiv.style.transition=`max-height 0s ease`;
          summeryDiv.style.maxHeight=`${summeryDiv.scrollHeight}px`;
          setTimeout(()=>{
            summeryDiv.style.transition=`max-height 0.3s ease`;
            summeryDiv.style.maxHeight =0;
           }, 1)



        }



      },[showAnswer])

  

   
  
 




const handleCouponApply = () => {
    if (tempCouponCode === "") return;
    
    const couponActivated = setAndValidateCouponCode(tempCouponCode);
    if(couponActivated){
      setCouponError(false);
          setTemptempCouponCode("");
    }
    else setCouponError(true);
    
  }



    
  
    return (
      <div className={styles.rightWrapper}>
        <div id="checkout_right" className={styles.checkout_right}>
        
           
              <div className={styles.title_div} onClick={()=>{ setShowAnswer(!showAnswer);}}>
               
                  <div className={styles.titleWrapper}>
                    <div className={styles.mobileTitle}>
                      Order summery
                      <Image
                        src={"/images/greaterLess3.png"}
                        height={8}
                        width={8}
                        alt="arrow"
                        className={`${styles.arrowImg} ${
                          !showAnswer && styles.arrowDown
                        }`}
                      />
                    </div>
                  </div>
  
                  <div className={styles.mainPriceDiv}>
                  {couponCode!="" && <span className={styles.mainPriceSub}>${subTotal}</span>}
                  <span className={styles.mainPrice}>${total}</span>
                  
                  </div>
             
              </div>
  
              <div
              ref={summeryDivRef}
                className={styles.emerge}
              >
                <div className={styles.orderDiv}>
                 
                 {products.map((cp, i) => (
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
                <div className={styles.productTitleDiv}>
                <span>
                  {cp.quantity} {`${cp.name}${cp.quantity>1?'s':''}`}
                </span>
                <span className={styles.variant}>
                  {cp.variant}
                </span>
                </div>
              </div>
              <span>${(cp.quantity * cp.price).toFixed(2)}</span>
            </div>
          ))}
                  <div className={styles.coupon_code}>
                    <div className={styles.form_group}>
                      <input
                        id="coupon_code"
                        type="text"
                        value={tempCouponCode}
                        onChange={(event) => {
                          setTemptempCouponCode(event.target.value);
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
                      {couponError && (
                    <span className={styles.couponError}>
                      Enter a valid discount code.
                    </span>
                  )}

                {couponCode &&
                  <div className={styles.mainCouponCode}> 
                      <Image src='/images/svgs/discountIcon13.svg' className={styles.mainDiscountImg} height={18} width={18}/>
                      <span>{couponCode}</span>
                      <Image src='/images/svgs/cancelIconDark.svg' onClick={(()=>{setAndValidateCouponCode("");})}
                       className={styles.discountCancelImage} height={16} width={16}/>
                      </div>
                   }


                    </div>


                    <button
                      className={`${styles.apply} ${ tempCouponCode !== "" && styles.applyEnabled }`}
                      onClick={handleCouponApply}
                    >
                      Apply
                    </button>
                  </div>

                 
        

                 
  
                  <div className={styles.order_pair}>
                    <span>Subtotal</span>
                    <span>${subTotal}</span>
                  </div>
                  {couponCode && (
                    <>
                    
                      <span className={styles.discountPairTitle}>Order Discount</span>
                     

                    <div className={`${styles.order_pair} ${styles.discountPair}`}>
                    <div className={styles.couponCodeDiv}>
                        <Image src='/images/svgs/discountIconFaded.svg' className={styles.discountImg} height={16} width={16}/>
                        <span id="couponCode">{couponCode}</span>
                        </div>
                    <span id="discountPrice">- ${(subTotal*discount/100).toFixed(2)}</span>
                    </div>
                 </>

                  )}
                  <div className={styles.order_pair}>
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  {tip!==0 && tip!=="" && <div className={styles.order_pair}>
                    <span>Tip</span>
                    <span id="tipPrice">{`$${tip.toFixed(2)}`}</span>
                  </div>}

                  
  
                  <div className={styles.order_pair}>
                    
                        <span className={styles.totalText}>Total</span>
                        
                        <div>
                    <span className={styles.currency}>USD</span>
                    <span id='totalPrice' className={styles.total}>${total}</span>
                    </div>
                  </div>

                  {couponCode &&
                  <div className={styles.totalDiscount}> 
                      <Image src='/images/svgs/discountIconTotal5.svg' className={styles.totalDiscountImg} height={20} width={20}/>
                      <span className={styles.totalDiscountSpan}>Total savings</span><span className={styles.totalDiscountSpan}>${(subTotal*discount/100).toFixed(2)}</span>
                      
                      </div>
  }
                </div>
              </div>
            
  
          {/* sacuvaj client id vrednost i ostale bitne informacije u .env fajlu */}
        </div>
      </div>
    );
  }