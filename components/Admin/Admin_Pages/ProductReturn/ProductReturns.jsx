import { useState } from 'react'
import styles from './productreturns.module.css'
import PickReturnProducts from './PickReturnProducts/PickReturnProducts';
import OrderCard from '../Orders/OrderCard/OrderCard';
import { adminConfirm } from '@/utils/utils-client/utils-admin/adminConfirm';
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';



export default function ProductReturns() {

const [emailToFindOrders, setEmailToFindOrders] = useState();
const [foundOrders, setFoundOrders] = useState();

const [linkedOrder, setLinkedOrder] = useState();


const [linkOrderIdValue, setLinkOrderIdValue] = useState();

const [returnProducts, setReturnProducts] = useState([]);

const [returnCost, setReturnCost] = useState('0.00');

const [shouldReturnTip, setShouldReturnTip] = useState(false);

const [myProductReturns , setMyProductReturns] = useState();









const getProductReturns = async () => {
  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'get_product_returns' }),
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const {data} = await response.json();
    setMyProductReturns(data);
   
    console.log('orders found', data);
  } catch (error) {
    console.log(error);
  }
};



const getOrdersByEmail = async () => {
  if (!emailToFindOrders) return;

  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'get_orders_by_email', data: { email: emailToFindOrders } }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const {data} = await response.json();
    if(data.length===0) {
      setFoundOrders();
      return adminAlert('error', `No orders found.`, `Order(s) from customer with email ${emailToFindOrders} not found.`)
    }
    setFoundOrders(data);
    console.log('orders found', data);
  } catch (error) {
    console.log(error);
  }
};




const linkReturnToOrder = async () => {
  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'get_order_by_orderId', data: { orderId: linkOrderIdValue } }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const {data} = await response.json();
    console.log('order found', data, data[0]);
    if(data.length===0)  return adminAlert('error', `No order found.`, `Order with reference id #${linkOrderIdValue} not found.`)
      setFoundOrders();
    setLinkedOrder(data[0]);
  } catch (error) {
    console.log(error);
  }
};




const saveNewReturn = async () => {
  console.log('return data', returnProducts, linkedOrder);

  if ((!returnProducts.length || 
      returnProducts.some(rp => rp.id===undefined || rp.quantity === 0)) && !shouldReturnTip) return adminAlert('error', 'Return data required.', 'Fill return of either products, or tip.');
      

  const totalPrice= parseFloat(parseFloat(returnCost).toFixed(2));

  const newReturnData = {
    orderId: linkedOrder.id,
    products: JSON.stringify(returnProducts),
    couponCode: linkedOrder.couponCode,
    tip: shouldReturnTip ? linkedOrder.tip : "0.00",
    returnCost: totalPrice
  };


  try {
    const response = await fetch("/api/admincheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataType: 'insert_new_return', data: newReturnData }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const {data_saved} = await response.json();
    console.log('Were saving new return successful?', data_saved);

    if (!data_saved) return;
    
      setLinkedOrder();
      setReturnProducts([]);
      setLinkOrderIdValue();
    
  } catch (error) {
    console.log(error);
  }
};



  if(myProductReturns && myProductReturns.length!=0) return  <>
  <h1>Product returns</h1>

  <div className={styles.mainDiv}>
  <button onClick={()=>{setMyProductReturns();}} 
  className={`${styles.productReturnButton} ${styles.clearProductReturns}`}>Clear product returns</button>
   { myProductReturns.map((product, index) =>{
    
    return <div key={index} className={styles.productReturnWrapper}>


{Object.keys(product).map(key => {

  if(key == 'couponCode' && product[key]=="")return;
  if(key == 'tip' && product[key]=="0.00")return;

return <div className={styles.productReturnInfoPair}>

<div className={styles.productReturnInfo}>{key}</div>
<div className={styles.productReturnInfo}>{product[key]}</div>
</div>

   })
  }
<button onClick={async()=>{

if(!await adminConfirm('Are you sure you want to proceed?'))return;


  

try {
  const response = await fetch("/api/admincheck", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dataType: "delete_product_return", data: { deleteId: product.id } }),
  });

  if (response.ok)  setMyProductReturns(myProductReturns.filter(pr => pr.id !== product.id));
  
} catch (error) {
  console.error("Error deleting return:", error);
}

    



}}>Delete return</button>
     

      </div>
    })

  }
    </div>
    </>





  

  return (
    <>
    <h1>Product returns</h1>



      <div className={styles.mainDiv}>


      {linkedOrder ? <>   

        
      
          <h2>Linked order</h2>
          <OrderCard
            

                index={0}
               
                
                
                info={{id:linkedOrder.id, email:linkedOrder.email, firstName:linkedOrder.firstName, lastName:linkedOrder.lastName, address:linkedOrder.address, apt: linkedOrder.apt, country: linkedOrder.country, zipcode:linkedOrder.zipcode, state:linkedOrder.state, city:linkedOrder.city, phone: linkedOrder.phone, couponCode:linkedOrder.couponCode,
                tip:linkedOrder.tip,items:linkedOrder.items, total: linkedOrder.total, paymentMethod: linkedOrder.paymentMethod,paymentId:linkedOrder.paymentId }}
               
               
                packageStatus={linkedOrder.packageStatus}
                
               
                productReturnsPageStyle ={true}
              />

          <button 
          onClick={()=>{setLinkedOrder(); setLinkOrderIdValue();}}
          className={`${styles.productReturnButton} ${styles.fileNewReturnButton}`}>Unlink order</button>

       <PickReturnProducts returnProducts={returnProducts} setReturnProducts={setReturnProducts} 
       orderProducts={JSON.parse(linkedOrder.items)} returnCost={returnCost} setReturnCost={setReturnCost} coupon={linkedOrder.couponCode}
       shouldReturnTip={shouldReturnTip} setShouldReturnTip={setShouldReturnTip} tipExist={linkedOrder.tip !=0}
       />

<button 
onClick={saveNewReturn}
className={`${styles.productReturnButton} ${styles.fileNewReturnButton}`}>Save new return</button>

</>
:
<>

<button 
          onClick={getProductReturns}
          className={`${styles.productReturnButton} ${styles.fileNewReturnButton}`}>Get product returns</button>
       
        <input
            id="product_id"
            className={styles.inputProductId}
            value={linkOrderIdValue}

            onChange={(event)=>{setLinkOrderIdValue(event.target.value)}}
            
            placeholder="Enter order id of order of returned product(s)"
         
              
            
          />
          
      


        

        <button 
          onClick={linkReturnToOrder}
        className={`${styles.productReturnButton} ${styles.fileNewReturnButton}`}>Link return with order</button>
    
        
        <h2>Handful features</h2>
   

      <input
            id="order_id"
            className={styles.inputProductId}
            value={emailToFindOrders}
            placeholder="Enter email to FIND associated orders"
            onChange={(event) => {
              setEmailToFindOrders(event.target.value);
           }}
         
          />

        

        <button 
        // onClick={handleSaveDescription} 
        
        className={`${styles.productReturnButton}`}
        
        
        onClick={getOrdersByEmail} 
        >Find orders by email</button>


        <div className= {styles.ordersByEmailDiv}>

          {foundOrders && foundOrders.map((order, index)=>{
            
          

        return <OrderCard
                key={index}
                index={index}
               
                
                
                info={{id:order.id, email:order.email, firstName:order.firstName, lastName:order.lastName, address:order.address, apt: order.apt, country: order.country, zipcode:order.zipcode, state:order.state, city:order.city, phone: order.phone, couponCode:order.couponCode,
                tip:order.tip,items:order.items, total: order.total, paymentMethod: order.paymentMethod,paymentId:order.paymentId }}
               
                packageStatus={order.packageStatus}
            
               
                
              />

            })}

        </div>


        </>}

      </div>
      </>
  )
}
