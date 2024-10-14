import {
    useState,
    
    useEffect,
    useRef,
    useContext,
    useMemo,
  } from "react";
  import styles from "./orderdetails.module.css";
  import Image from "next/image";
  
import { CheckoutContext } from "@/contexts/CheckoutContext";
import { ArrowDown, CancelIcon, DiscountIcon, DiscountIconTotal, ErrorIcon } from "@/public/images/svgs/svgImages";
  
  export default function OrderDetails() {
    const [showAnswer, setShowAnswer] = useState(false);

    const [tempCouponCode, setTemptempCouponCode] = useState("");
    const [couponError, setCouponError] = useState();
    

    const summeryDivRef = useRef();
    const expendHeightTimeout = useRef();
    const mountedRef=useRef();
  
   

    const {cartProducts, total, subTotal, coupon, setAndValidateCoupon, tip} = useContext(CheckoutContext);

  
    




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
    
    const couponActivated = setAndValidateCoupon(tempCouponCode);
    if(!couponActivated.error){
      setCouponError();
          setTemptempCouponCode("");
    }
    else if(couponActivated.error === 'Incorrect coupon code')setCouponError('Incorrect coupon code');

    else if(couponActivated.error === 'Coupon code saves less then bundle'){


      setCouponError(`${couponActivated.couponCode?.toUpperCase()} couldn't be used with your current discounts.`)

      //Ovde setovati vrednost za couponMessage(ili neko slicno ime). I aktivirati na
      //taj nacin message za Coupon cant be implemented.
    }
    
  }



    
  
    return (
      <div className={styles.rightWrapper}>
        <div id="checkout_right" className={styles.checkout_right}>
        

        <div className={styles.titleDivWrapper} onClick={()=>{ setShowAnswer(!showAnswer);}}>
           
              <div className={styles.title_div} >
               
                  
                  
                    <div className={styles.mobileTitle}>
                      Order summery
              

          <ArrowDown color={'var(--summery-title-color)'} styleClassName={`${styles.arrowImg} ${
                          !showAnswer && styles.arrowDown
                        }`}/>
                   


                    </div>
                
                
  
                  <div className={styles.mainPriceDiv}>
                  {coupon.discount!=0 && <span className={styles.mainPriceSub}>${(parseFloat(total) + parseFloat(coupon.discount)).toFixed(2)}</span>}
                  <span className={styles.mainPrice}>${total}</span>
                  
                  </div>
             
              </div>


              </div>
              
  
              <div
              ref={summeryDivRef}
                className={styles.emerge}
              >
                
                 
                 {cartProducts.map((cp, i) => (
            <div className={`${i===0 && styles.emergePaddingTop} ${styles.order_pair}`} key={i}>

              <div className={styles.productImageDiv}>


                <div className={styles.productImageWrapper}>
                <Image
                  className={styles.productImage}
                  src={`/images/${cp.image}`}
                  alt={`${cp.name}`}
                  height={0}
                  width={0}
                  sizes="64px"
                />

            <div className={styles.badgeDiv}>{cp.quantity}</div>

  
                </div>
                <div className={styles.productTitleDiv}>
                <span>{cp.name}</span>
                <span className={styles.variant}>
                  {cp.variant}
                </span>
                {cp.bundleQuantity && <span className={styles.bundleDisc}>

                <DiscountIcon color={`var(--bundle-discount-icon-color)`} styleClassName={styles.bundleDiscIcon}/>
                  BUY {cp.bundleLabel} (-$
                  
                  {
                  
                 parseFloat(((cp.priceBeforeBundle - cp.price).toFixed(2))*cp.quantity).toFixed(2)
                  
                  })
                </span>
                  }
                </div>
              </div>
              <div className={styles.productTitleDiv}>
              {cp.stickerPrice && <span className={styles.stickerPrice}>${(cp.quantity * cp.stickerPrice).toFixed(2)}</span>}
              <span>${(cp.quantity * cp.price).toFixed(2)}</span>
             
              </div>

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
                          couponError === 'Incorrect coupon code' && styles.coupon_code_input_error
                        }`}
                        placeholder={" "}
                      />
                      <label htmlFor={"coupon_code"} className={styles.myLabel}>
                        Coupon code
                      </label>
                      {couponError ==='Incorrect coupon code' && (
                    <span className={styles.couponError}>
                      <ErrorIcon/>Enter a valid discount code.
                    </span>
                  )}



                {coupon.code && coupon.code!=='BUNDLE' &&
                  <div className={styles.mainCouponCode}> 
                  <DiscountIcon color={`var(--discount-icon-color)`} styleClassName={styles.mainDiscountImg}/>
                  
                      <span>{coupon.code}</span>
                      <CancelIcon color={`var(--weak-discount-cancel-color)`} styleClassName={styles.discountCancelImage} handleClick={()=>{setAndValidateCoupon("");}}
                    />
                      </div>
                   }


                    </div>


                    <button
                      className={`${styles.apply} ${tempCouponCode === "" && styles.applyDisabled }`}
                      onClick={handleCouponApply}
                    >
                      Apply
                    </button>
                  </div>

                 
              {couponError && couponError.includes( "couldn't be used with your current discounts.") && (
                    <span className={styles.weakCouponError}>
                      {couponError}  <CancelIcon color={`var(--weak-coupon-cancel-color)`} styleClassName={styles.weakCouponCacel} handleClick={()=>{setCouponError()}}
                    />
                    </span>
                  )}
        

                 
  
                  <div className={styles.order_pair}>
                    <span>Subtotal</span>
                    <span>${subTotal}</span>
                  </div>

                  
                  {coupon.code && coupon.code!=='BUNDLE' &&  (
                    <>
                    
                      <span className={styles.discountPairTitle}>Order Discount</span>
                     

                    <div className={`${styles.order_pair} ${styles.discountPair}`}>
                    <div className={styles.couponCodeDiv}>
                      <DiscountIcon color={`var(--discount-order-pair-color)`} styleClassName={styles.discountIcon}/>
                        <span id="couponCode">{coupon.code}</span>
                        </div>
                    <span id="discountPrice">- ${coupon.discount}</span>
                    </div>
                 </>

                  )}









                  <div className={styles.order_pair}>
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  {tip!=="0.00" && tip!=="" && <div className={styles.order_pair}>
                    <span>Tip</span>
                    <span id="tipPrice">{`$${tip}`}</span>
                  </div>}

                  
  
                  <div className={`${styles.order_pair} ${coupon.discount===0 && styles.totalPair}`}>
                    
                        <span className={styles.totalText}>Total</span>
                        
                        <div>
                    <span className={styles.currency}>USD</span>
                    <span id='totalPrice' className={styles.total}>${total}</span>
                    </div>
                  </div>

                  {coupon.discount!=0 &&
                  <div className={styles.totalDiscount}> 
                    <DiscountIconTotal color={`var(--discount-icon-total-color)`} styleClassName={styles.totalDiscountImg}/>
                      <span className={`${styles.totalDiscountSpan} ${styles.totalDiscountTxt}`}>Total savings</span>
                      <span className={styles.totalDiscountSpan}>${coupon.discount}</span>
                      
                      </div>
                     }
              
              
              </div>
            
            
        </div>
      </div>
    );
  }