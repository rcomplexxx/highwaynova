import  {  useState } from 'react'
import styles from './delaypicker.module.css'
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';

export default function DelayPicker({sendTimeGap, setSendTimeGap}) {
    const [delay, setDelay] = useState();

  


    const handleChange = (event) => {
        let { value } = event.target;
      
        if (value.length > 8) return;
         //value.slice(0, -1) znaci da se oduzima poslednji karakter iz niza.
        value = value.length === 2 || value.length === 5 ? value + ':' : value.length === 3 || value.length === 6 ? value.slice(0, -1) : value;
       
      
        setDelay(value);
      };

    const handleConfirmEmailDelay = () => {
        if (delay?.length !== 8) return adminAlert('error', 'Error', 'Invalid delay input');
        const [days, hours, mins] = delay.split(':').map(Number);
        if ([days, hours, mins].some(isNaN) || days < 0 || days > 31 || hours < 0 || hours > 24 || mins < 0 || mins > 60) {
        
          return adminAlert('error', 'Error', 'Invalid delay input');
        }
      
        const unixDelay = (days * 86400 + hours * 3600 + mins * 60) * 1000;
        setSendTimeGap(unixDelay);
      };


    if(sendTimeGap)return  <div className={styles.delayPickerDiv}>Time gap confirmed</div>



  return (
    <div className={styles.delayPickerDiv}>
        <input value={delay} onChange={handleChange}  
        placeholder='Delay format DD:HH:MM' className={styles.delayInput}/>
      
        <button onClick={handleConfirmEmailDelay} className={styles.setDelayButton}>Confirm time gap</button>
    </div>
  )
}
