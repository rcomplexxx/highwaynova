import { CancelIcon } from '@/public/images/svgs/svgImages';
import styles from './suppliercostinput.module.css'

export default function SupplierCostInput({
    handleChangedOrdersArray, setSupplierCostInputOpen,
    supplierCost, setSupplierCost
}) {

 


  return (

    <div className={styles.mainWrapper}>
    <div className={styles.mainDiv}>

        <span className={styles.titleText}>Input supplier cost</span>

        <input value={`$${supplierCost}`} onChange={(event)=>{

const newValue = event.target.value.substring(1);


            if(/^\d+(\.\d{0,2})?$/.test(newValue) || newValue === ''){
                setSupplierCost(newValue)
            }

        }} className={styles.costInput}/>

        <button onClick={()=>{

console.log('final supp pri', supplierCost)
          
            if(isNaN(parseFloat(supplierCost)))return;

            const finalSupplierCost = parseFloat(parseFloat(supplierCost).toFixed(2));
            console.log('final supp pri', finalSupplierCost)


            handleChangedOrdersArray(finalSupplierCost);
            setSupplierCostInputOpen(false);
        }} className={styles.inputButton}>Apply supplier costs</button>


        <CancelIcon handleClick={()=>{setSupplierCostInputOpen(false)}} styleClassName={styles.cancelButton} color={'red'}/>
    
    </div>

    </div>
  )
}
