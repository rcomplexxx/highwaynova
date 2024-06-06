import  {  useState } from 'react'
import styles from './delaypicker.module.css'

export default function DelayPicker({sendTimeGap, setSendTimeGap}) {
    const [delay, setDelay] = useState();

  


    const handleChange= (event)=>{
        let value = event.target.value

        if(value.length>8) return;
        if(value.length==2 || value.length==5)value=value+':';
        else if(value.length == 3 || value.length == 5)value = value.slice(0, value.length-1);

        setDelay(value);
    }

    const handleConfirmEmailDelay = ()=>{

        if(delay?.length!=8) return;
        const delayValues = delay.split(':');
        if(delayValues.length!=3)return;
        if(delayValues.filter(value=>{return value.length==2 && !isNaN(parseInt(value))} ).length != 3)return;

        if(delayValues[0]<0 || delayValues[0]>31){
            console.log('warning!! Days')
            return;
        }
        if(delayValues[1]<0 || delayValues[1]>24){
            console.log('warning!! hours')
            return;
        }
        if(delayValues[2]<0 || delayValues[2]>60 ){
            console.log('warning!! mins')
            return;
        }

        //takodje i uslovi da day sme da bude max 30, itd.
        //ovde setovati starting date u unix.
        const unixDelay =  (delayValues[0] * 24 * 60 * 60 + delayValues[1] * 60 * 60 + delayValues[2] * 60) * 1000;
  
        setSendTimeGap(unixDelay)
    }


    if(sendTimeGap)return  <div className={styles.delayPickerDiv}>Time gap confirmed</div>



  return (
    <div className={styles.delayPickerDiv}>
        <input value={delay} onChange={handleChange}  
        placeholder='Delay format DD:HH:MM' className={styles.delayInput}/>
      
        <button onClick={handleConfirmEmailDelay} className={styles.setDelayButton}>Confirm time gap</button>
    </div>
  )
}
