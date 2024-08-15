import { CancelIcon } from '@/public/images/svgs/svgImages';
import styles from './suppliercostinput.module.css'
import { useState } from 'react';

export default function SupplierCostInput({
    handleChangedOrdersArray, setSupplierCostInputOpen
}) {

    const [supplierPrice, setSupplierPrice] = useState('');



  return (

    <div className={styles.mainWrapper}>
    <div className={styles.mainDiv}>

        <span className={styles.titleText}>Input supplier cost</span>

        <input value={`$${supplierPrice}`} onChange={(event)=>{

const newValue = event.target.value.substring(1);


            if(/^\d+(\.\d{0,2})?$/.test(newValue) || newValue === ''){
                setSupplierPrice(newValue)
            }

        }} className={styles.costInput}/>

        <button onClick={()=>{

console.log('final supp pri', supplierPrice)
          
            if(isNaN(parseFloat(supplierPrice)))return;

            const finalSupplierPrice = parseFloat(parseFloat(supplierPrice).toFixed(2));
            console.log('final supp pri', finalSupplierPrice)


            handleChangedOrdersArray(finalSupplierPrice);
            setSupplierCostInputOpen(false);
        }} className={styles.inputButton}>Apply supplier costs</button>


        <CancelIcon handleClick={()=>{setSupplierCostInputOpen(false)}} styleClassName={styles.cancelButton} color={'red'}/>
    
    </div>

    </div>
  )
}
