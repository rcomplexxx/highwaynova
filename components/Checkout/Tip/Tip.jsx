
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import InputField from '../Input/InputField'
import styles from './tip.module.css'
import Image from 'next/image';
import { CheckoutContext } from '@/contexts/CheckoutContext';
import { CorrectIcon } from '@/public/images/svgs/svgImages';


export default function Tip(){

    const [tipShow, setTipShow] = useState(false);
    const [selectedField, setSelectedField] =useState();
    
    const [tipInputValue, setTipInputValue]= useState("");
    const [applyDisabled, setApplyDisabled] = useState(true);
    const [tipError, setTipError] = useState();

    const expendHeightTimeout = useRef();
    const mounted = useRef(false);
    const tipDivRef = useRef();

    const {subTotal, discount, tip, setTip} = useContext(CheckoutContext);


    const fullProductCost= useMemo(()=>{
    return subTotal - subTotal*discount/100;
    }, [subTotal, discount])
 


  useEffect(()=>{

    if(!mounted.current){mounted.current=true;return;}

          clearTimeout(expendHeightTimeout.current);
          const tipDiv= tipDivRef.current;
          if(tipShow){



         
            tipDiv.style.maxHeight=`${ tipDiv.scrollHeight}px`;
          expendHeightTimeout.current=setTimeout(()=>{
           
             tipDiv.style.maxHeight=`none`;
           }, 600)
          }
          else{

            
            tipDiv.style.transition=`max-height 0s ease`;
            tipDiv.style.maxHeight=`${tipDiv.scrollHeight}px`;
            setTimeout(()=>{
              tipDiv.style.transition=`max-height 0.5s ease`;
              tipDiv.style.maxHeight=`0`;
             }, 1)
             setTipInputValue("");
             setSelectedField();
            setTip(0);

          }
        },[tipShow])


       

    
      


    return <div className={styles.tipMainDiv}>


<div tabIndex={0} className={styles.tipShowCheckboxDiv}  onClick={()=>{ setTipShow(!tipShow)}}>
      <div  className={`${styles.tipShowChecker} ${tipShow && styles.tipShowCheckerChecked}`}>
        <CorrectIcon styleClassName={styles.checkImage}/>
      </div>
     
  
      <span className={styles.tipShowCheckboxLabel}>
     Show your support for the GameBuff team
    </span>

   
    </div>
      
      <div id='tipDiv' ref={tipDivRef} className={styles.tipDiv}>
        <div className={styles.roundPercentWrapper}>
            <div className={`${styles.roundPercent} ${styles.firstRoundPercent} ${selectedField==5 && styles.selectedPercent}`} 
            onClick={()=>{
              setTipError(); setTipInputValue(""); setApplyDisabled(true); setSelectedField(5); setTip(parseFloat(fullProductCost*5/100, 2));}}>
            <span className={styles.roundPercentSpan}>5%</span>
            <span className={styles.roundTipSpan}>${(fullProductCost*5/100).toFixed(2)}</span>
           
            </div>
            <div className={`${styles.roundPercent} ${styles.centerRoundPercent} ${selectedField==10 && styles.selectedPercent}`}
             onClick={()=>{setTipError();setTipInputValue(""); setApplyDisabled(true); setSelectedField(10); setTip(parseFloat(fullProductCost*10/100, 2));}}>
            <span className={styles.roundPercentSpan}>10%</span>
            <span className={styles.roundTipSpan}>${(fullProductCost*10/100).toFixed(2)}</span>
        
            </div>
            <div className={`${styles.roundPercent} ${styles.lastRoundPercent} ${selectedField==15 && styles.selectedPercent}`} 
            onClick={()=>{setTipError();setTipInputValue(""); setApplyDisabled(true); setSelectedField(15); setTip(parseFloat(fullProductCost*15/100, 2));}}>
            <span className={styles.roundPercentSpan}>15%</span>
            <span className={styles.roundTipSpan}>${(fullProductCost*15/100).toFixed(2)}</span>
         
            </div>
           
        </div>
        <div className={styles.customTipDiv}>
        <div className={styles.customTipField}>
      <input
        id="tip"
         value={tipInputValue}
        type='number'
        onChange={(event)=>{
            const tipValue= event.target.value;

            const tipValueFloat = (tipValue==="" || tipValue==='.')?0:parseFloat(tipValue);
            
            setTipError();

          
            setApplyDisabled(tipValueFloat==tip);


            if(tipInputValue!==0 && tipValueFloat===0) {
              setTipInputValue("")
            }
            else{
            setTipInputValue(tipValue);
            }
            
        
        }}
      
        placeholder=" "
        className={`${styles.customTipInput}`}
      />

       <div className={styles.tipChangerDiv}>
        <span onClick={()=>{
          if(tipInputValue===""){setTipInputValue(0);  setApplyDisabled(0===tip);return;}
          const newTip =parseFloat(tipInputValue<1?1:tipInputValue)-1;
          setTipInputValue(newTip);
          setApplyDisabled(newTip===tip);
        }} 
        className={`${styles.tipIncrement} ${styles.tipDecrement}`}>–</span>
      <span onClick={()=>{
        const newTip =parseFloat(tipInputValue===""?0:tipInputValue)+1;
        setTipInputValue(newTip);
        setApplyDisabled(newTip===tip);
      }} 
      className={styles.tipIncrement}>+</span>
      
      </div>
        
      <label htmlFor={"tip"} className={styles.label}>
        {"Custom tip"}
      </label>

       

       <span className={styles.dollarSign}>$ </span>

        </div>
        <button className={`${styles.addTip} accentButton ${applyDisabled && styles.addTipDisabled}`}
        onClick={()=>{
          if(parseFloat(tipInputValue, 2) > fullProductCost) {setTipInputValue(""); setTipError(true); return;}
            setSelectedField(0);
            setApplyDisabled(true);
            if(tipInputValue==="")setTip(0);
            else setTip(parseFloat(tipInputValue, 2));
        }}    >{tip==0?"Add tip":"Update tip"}</button>
      


        </div>
        {tipError && <span className={styles.tipError}>Enter a tip less than ${fullProductCost}</span>}
            <span className={styles.thankYouMessage}>Thank you for supporting us.</span>

    </div>
     </div>
}

// <div className={styles.tipCheckerBorderSupport}/>