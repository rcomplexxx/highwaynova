import { useState } from 'react'
import styles from './productreturns.module.css'
import PickReturnProducts from './PickReturnProducts/PickReturnProducts';
import OrderCard from '../Orders/OrderCard/OrderCard';
import products from '@/data/products.json'
import coupons from '@/data/coupons.json'


export default function ProductReturns({resetOrders}) {

const [emailToFindOrders, setEmailToFindOrders] = useState();
const [foundOrders, setFoundOrders] = useState();

const [linkedOrder, setLinkedOrder] = useState();

const [linkOrderIdValue, setLinkOrderIdValue] = useState();

const [returnProducts, setReturnProducts] = useState([]);

const [returnCost, setReturnCost] = useState('');

const [shouldReturnTip, setShouldReturnTip] = useState(false);

const [myProductReturns , setMyProductReturns] = useState();




const getProductReturns = async () => {




  


  await fetch("/api/admincheck", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dataType: 'get_product_returns'}),
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error('Network response was not ok');
      }
    }).then((data) => {
      setMyProductReturns(data.data);
      resetOrders();
    
      console.log('orders found',data.data);
    
    })

    .catch((error) => {console.log(error)});

}



  const getOrdersByEmail= async()=>{

    if(!emailToFindOrders || emailToFindOrders=="")return;


  


    await fetch("/api/admincheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataType: 'get_orders_by_email', data: { email:emailToFindOrders}}),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
        } else {
          throw new Error('Network response was not ok');
        }
      }).then((data) => {


        const orders = data.data; 
        setFoundOrders(orders)
        console.log('orders found',orders);
      
      })

      .catch((error) => {console.log(error)});

   
  }

  const linkReturnToOrder = async()=>{


    


    

    await fetch("/api/admincheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataType: 'get_order_by_orderId', data: {orderId: linkOrderIdValue} }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
          
        } else {
          throw new Error('Network response was not ok');
        }
      }).then((data) => {

        console.log('order found',data);
        setLinkedOrder(data.data[0]);
      //data
      
      })

      .catch((error) => {console.log(error)});

  }




const saveNewReturn = async()=>{

  console.log('return data', returnProducts ,linkedOrder);


  if(!linkedOrder || returnProducts.length ===0 || 
    
    returnProducts.find(rp =>{return rp.id==undefined 
      
      || rp.id==="" || rp.quantity===0}) ||  returnProducts.find(rp=>{return rp.id === "" || rp.quantity === 0}))return;
  


  
 
 
  
  const totalPrice= parseFloat(parseFloat(returnCost).toFixed(2));


    let newReturnData = { orderId: linkedOrder.id, products:JSON.stringify(returnProducts), 
      couponCode: linkedOrder.couponCode, tip:shouldReturnTip?linkedOrder.tip:"0.00", returnCost: totalPrice };


    await fetch("/api/admincheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dataType: 'send_new_return', data: newReturnData }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
          
        } else {
          throw new Error('Network response was not ok');
        }
      }).then((data) => {
          console.log('Were saving new return successful?', data.data_saved);

          if(data.data_saved){
            setLinkedOrder();
            setReturnProducts([]);
            setLinkOrderIdValue();
          }

      //data
      
      })

      .catch((error) => {console.log(error)});

  }


  if(myProductReturns && myProductReturns.length!=0) return  <>
  <h1>Product returns</h1>

  <div className={styles.mainDiv}>
  <button onClick={()=>{setMyProductReturns();}} 
  className={`${styles.saveDescription} ${styles.clearProductReturns}`}>Clear product returns</button>
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

const result = window.confirm('Are you sure you want to proceed?');
if (result) {

  

    try {
      const response = await fetch("/api/admincheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataType:"delete_product_return", data: {deleteId: product.id} }),
      });

      if(response.ok){
        setMyProductReturns(myProductReturns.filter(pr=>{return pr.id!==product.id}));
      }


    } catch (error) {
   
      

      console.error("Error deleting return:", error);
    }


    
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
               
                id={linkedOrder.id}
                total = {linkedOrder.total}
                info={
                  JSON.stringify({id:linkedOrder.id, email:linkedOrder.email, firstName:linkedOrder.firstName, lastName:linkedOrder.lastName, address:linkedOrder.address, apt: linkedOrder.apt, country: linkedOrder.country, zipcode:linkedOrder.zipcode, state:linkedOrder.state, city:linkedOrder.city, phone: linkedOrder.phone, couponCode:linkedOrder.couponCode,
                tip:linkedOrder.tip,items:linkedOrder.items, paymentMethod: linkedOrder.paymentMethod,paymentId:linkedOrder.paymentId })}
               
               
             


                packageStatus={linkedOrder.packageStatus}
                handlePackageStatusChange={()=>{}}
                products={products}
                coupons={coupons}
                productReturnsPageStyle ={true}
              />

          <button 
          onClick={()=>{setLinkedOrder(); setLinkOrderIdValue();}}
          className={`${styles.saveDescription} ${styles.fileNewReturnButton}`}>Unlink order</button>

       <PickReturnProducts returnProducts={returnProducts} setReturnProducts={setReturnProducts} 
       orderProducts={JSON.parse(linkedOrder.items)} returnCost={returnCost} setReturnCost={setReturnCost} coupon={linkedOrder.couponCode}
       shouldReturnTip={shouldReturnTip} setShouldReturnTip={setShouldReturnTip} tipExist={linkedOrder.tip !=0}
       />

<button 
onClick={saveNewReturn}
className={`${styles.saveDescription} ${styles.fileNewReturnButton}`}>Save new return</button>

</>
:
<>

<button 
          onClick={getProductReturns}
          className={`${styles.saveDescription} ${styles.fileNewReturnButton}`}>Get product returns</button>
       
        <input
            id="product_id"
            className={styles.inputProductId}
            value={linkOrderIdValue}
            
            placeholder="Enter order id of order of returned product(s)"
         
               onChange={(event) => {
              const linkedOrderIdValue = event.target.value;
              setLinkOrderIdValue(linkedOrderIdValue);
            }}
          />
          
      


        

        <button 
          onClick={linkReturnToOrder}
        className={`${styles.saveDescription} ${styles.fileNewReturnButton}`}>Link return with order</button>
    
        
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
        
        className={`${styles.saveDescription}`}
        
        
        onClick={getOrdersByEmail} 
        >Find orders by email</button>


        <div className= {styles.ordersByEmailDiv}>

          {foundOrders && foundOrders.map((order, index)=>{
            
          

        return <OrderCard
                key={index}
                index={index}
               
                id={order.id}
                total = {order.total}
                info={
                  JSON.stringify({id:order.id, email:order.email, firstName:order.firstName, lastName:order.lastName, address:order.address, apt: order.apt, country: order.country, zipcode:order.zipcode, state:order.state, city:order.city, phone: order.phone, couponCode:order.couponCode,
                tip:order.tip,items:order.items, paymentMethod: order.paymentMethod,paymentId:order.paymentId })}
               
                packageStatus={order.packageStatus}
                handlePackageStatusChange={()=>{}}
                products={products}
                coupons={coupons}
              />

            })}

        </div>


        </>}

      </div>
      </>
  )
}
