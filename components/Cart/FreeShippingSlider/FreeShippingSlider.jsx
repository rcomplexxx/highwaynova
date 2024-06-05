import { useEffect, useRef, useState } from 'react';
import styles from './fresshippingslider.module.css'





export default function FreeShippingSlider({subtotal}){
    const [subtotalDelayed, setSubtotalDelayed] = useState(subtotal);
    const sliderTimeout = useRef();

    useEffect(()=>{
        clearTimeout( sliderTimeout.current);
        sliderTimeout.current = setTimeout(()=>{
        setSubtotalDelayed(subtotal);
        }, 220);
    }, 
    [subtotal])



    return <div className={styles.shippingSliderWrapper}>
        {subtotalDelayed<40 ? <span>
            Add just <span className={styles.boldedSliderText}>${(40-subtotalDelayed).toFixed(2)}</span> more to get <span className={styles.boldedSliderText}>FREE SHIPPING</span> 💫</span>:
            <span>You've unlocked free shipping! 🎉</span>
}
        <div className={styles.sliderWrapper}>
     <div className={styles.sliderShell}>
        <div className={styles.sliderCore} style={{width:`${subtotal>40?100:Math.round(subtotal/40 * 100)}%`}}>
    <div className={styles.sliderCircle}/>
        </div>

     </div>
            </div>
    </div>
}