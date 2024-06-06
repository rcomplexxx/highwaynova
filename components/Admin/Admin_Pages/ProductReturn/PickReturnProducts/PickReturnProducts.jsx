import { useState } from 'react'

import products from '@/data/products.json'

import styles from './pickreturnproducts.module.css'





export default function PickReturnProducts({orderProducts, returnProducts, setReturnProducts, shouldReturnTip, setShouldReturnTip, tipExist}) {



   


    const [returnProductsNumberInputValue, setReturnProductsNumberInputValue] = useState();


  return (
    <>
    <h2 className={styles.pickProductsTitle}>Pick returned products</h2>

<input
    className={`${styles.inputProductId}`}
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
        for(let i=returnProducts.length; i< currentReturnProductNumberValue; i++){
          newReturnProductsArray.push({id: undefined, quantity: 1});
        }
       

      }
      else if(returnProducts.length > currentReturnProductNumberValue){

        for(let i =0; i < currentReturnProductNumberValue; i++){
          newReturnProductsArray.push(returnProducts[i]);
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
    
  className={styles.inputProductId}
  defaultValue={product.id}
  onChange={(event) => {
    console.log(returnProducts, 'sdsd')

  


   
   if( returnProducts.find(rp => rp.id ==event.target.value)){
    event.target.value= returnProducts[index].id;
    return;
   }


    const newReturnProductsArray= returnProducts.map((rp, i)=>{
        if(index==i) return {id: event.target.value, quantity: 1};
        else return rp;
    });

    setReturnProducts(newReturnProductsArray);
  }}
>


  <option value={""}
   
  >Select product for returning</option>
  {orderProducts.map(p => 
    
    {return <option value={p.id}>id: {p.id} | 
  {products.find(prGlobal =>{return prGlobal.id==p.id})?.name}
  </option>


})};
  {/* Add more options as needed */}


  
</select>

<input
    className={`${styles.inputProductId} ${styles.productQuantity}`}
    value={returnProducts[index].quantity}
    placeholder="Quantity"
    onChange={(event) => {
      //set quantity
      const currentValue = event.target.value;
      if(isNaN(currentValue) || currentValue < 0 || returnProducts[index].id==undefined || returnProducts[index].id=="" || 
      currentValue> orderProducts.find(op=>product.id == op.id).quantity){return;}
      const newReturnProducts = [...returnProducts];

      newReturnProducts[index].quantity = event.target.value;

      setReturnProducts(newReturnProducts)
   }}
 
  />
</div>


})


}

    </>
  )
}
