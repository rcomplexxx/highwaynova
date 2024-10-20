import { useState } from 'react'

import products from '@/data/products.json'

import styles from './pickreturnproducts.module.css'





export default function PickReturnProducts({orderProducts, returnProducts, setReturnProducts, returnCost, setReturnCost, coupon,  shouldReturnTip, setShouldReturnTip, tipExist}) {



   


    const [returnProductsNumberInputValue, setReturnProductsNumberInputValue] = useState();
    


  return (
    <>
    <h2 className={styles.pickProductsTitle}>Return information</h2>
    
    {coupon && <span className={styles.discountWarning}>Warning! Order has DISCOUNT. Calculate return cost with DISCOUNT!</span>}

    

    <label className={`${styles.inputLabel}`} htmlFor='returnCostInput'>Return cost</label>

    <input
    id='returnCostInput'
    className={`${styles.productReturnsInput}`}
    value={`$${returnCost}`} onChange={(event)=>{

      const newValue = event.target.value.substring(1);
      
      
                  if(/^\d+(\.\d{0,2})?$/.test(newValue) || newValue === ''){
                      setReturnCost(newValue)
                  }
      
              }}

              
              
 
 
  />



<input
    className={`${styles.productReturnsInput}`}
    value={returnProductsNumberInputValue}
    placeholder="How many different types of products user wants to return?"


    onChange={(event) => {



      const currentReturnProductNumberValue = event.target.value;
      if(!isNaN(currentReturnProductNumberValue) && currentReturnProductNumberValue>=0 && 
      currentReturnProductNumberValue <=orderProducts.length )


     { 

      let newReturnProductsArray = [];


      if(returnProducts.length < currentReturnProductNumberValue){

        newReturnProductsArray = [...returnProducts];

        while(newReturnProductsArray.length < currentReturnProductNumberValue)  newReturnProductsArray.push({id: undefined, variant: undefined, quantity: 1});


     
       

      }
      else if(returnProducts.length > currentReturnProductNumberValue){

        let counter=0;

        while(newReturnProductsArray<currentReturnProductNumberValue){
          
          newReturnProductsArray.push(returnProducts[counter]);
          counter++;

        }

   

      }

      setReturnProducts(newReturnProductsArray)
      setReturnProductsNumberInputValue(currentReturnProductNumberValue)
     }
   }}
 
  />

{tipExist &&
   <div className={styles.tipReturnWrapper}>
  <span>Return tip as well?</span>
   
   <button onClick={()=>{setShouldReturnTip(false)}} className={`${styles.tipReturnButton} ${!shouldReturnTip && styles.tipReturnButtonSelected}`}>No</button>
   <button onClick={()=>{setShouldReturnTip(true)}} className={`${styles.tipReturnButton} ${shouldReturnTip && styles.tipReturnButtonSelected}`}>Yes</button>
  </div>
}





















  {returnProducts.length>0 && returnProducts.map((product, index)=>

{
  
  return <div key={index} className={styles.returnedProductsInputWrapper}>
    
    <select
    
  className={`${styles.productReturnsInput} ${styles.selectItem}`}
  defaultValue={""}







  onChange={(event) => {
    const newReturnProduct = orderProducts[event.target.value];
    const newReturnProductsArray = returnProducts.map((rp, i) =>
      i === index
        ? event.target.value === ""
          ? { id: undefined, variant: undefined, quantity: 1 }
          : { id: newReturnProduct.id, variant: newReturnProduct.variant, quantity: 1 }
        : rp
    );
    setReturnProducts(newReturnProductsArray);
  }}
>





  <option value={""}
   
  >Select product for returning</option>



  {orderProducts.map((p,i) => 
    
    {return <option value={i}>
      id: {p.id} | {products.find(prGlobal =>{return prGlobal.id==p.id})?.name} {p.variant && `| ${p.variant}`}
  </option>


})};
  {/* Add more options as needed */}


  
</select>





<input
    className={styles.productReturnsInput}
    value={returnProducts[index].quantity}
    placeholder="Quantity"
    onChange={(event) => {
      //set quantity

      console.log('checking', orderProducts, product);


      const returnProductQuantity = event.target.value;

      if(isNaN(returnProductQuantity) || returnProductQuantity < 0 || returnProducts[index].id===undefined || returnProducts[index].id==="" || 
      returnProductQuantity> orderProducts.find(op=>product.id == op.id && product.variant == op.variant).quantity) return;


      const newReturnProducts = [...returnProducts];

      newReturnProducts[index].quantity = returnProductQuantity;

      setReturnProducts(newReturnProducts)
   }}
 
  />
</div>


})


}














    </>
  )
}
