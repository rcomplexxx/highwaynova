import { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./admin.module.css";
import AdminNavbar from "./Admin_Navbar/AdminNavbar";
import { useRouter } from "next/router";
import AdminLogin from "./Admin_Login/AdminLogin";
import AdminHome from "./Admin_Pages/Admin_Home/AdminHome";
import Orders from "./Admin_Pages/Orders/Orders";
import Inbox from "./Admin_Pages/Inbox/Inbox";
import Reviews from "./Admin_Pages/Reviews/Reviews";
import Emails from "./Admin_Pages/Emails/Emails";
import NewEmail from "./Admin_Pages/Emails/NewEmail/NewEmail";
import NewCampaign from "./Admin_Pages/Emails/NewCampaign/NewCampaign";
import Campaigns from "./Admin_Pages/Emails/Campaigns/Campaigns";
import DataWiper from "./Admin_Pages/DataWiper/DataWiper";
import DescriptionMaker from "./Admin_Pages/DescriptionMaker/DescriptionMaker";

import ProductReturns from "./Admin_Pages/ProductReturn/ProductReturns";
import NewSequence from "./Admin_Pages/Emails/NewSequence/NewSequence";
import Sequences from "./Admin_Pages/Emails/Sequences/Sequences";
import Customers from "./Admin_Pages/Customers/Customers";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState();
  const [triggerRender, setTriggerRender] = useState(false);


  const [emailData, setEmailData] = useState({emails: [], campaigns: []});

  const customers = useRef([]);
  const orders = useRef([]);
  const messages = useRef([]);
  const reviews = useRef([]);



  const setData = (data, type, typeName) => {
    type.current = data.length === 1 && data[0] === "reset_data" 
      ? [] 
      : data.map(item => typeName === "reviews" 
        ? { id: item.id, name: item.name, stars: item.stars, text: item.text, imageNames: item.imageNames } 
        : item);
    
    setTriggerRender(prev => !prev);
  };




  const setOrders = (data) => {
  
    setData(data, orders, "orders")
  };

  const setMessages = (data) => {setData(data, messages, "messages")}

  const setReviews = (data)=>{setData(data, reviews, "reviews")}

  const setCustomers = (data)=>{setData(data, customers, "customers")}


  

  

 

const checkAdminStatus = async () => {
  try {
    const { successfulLogin } = await (await fetch("/api/admincheck")).json();
    setIsAdmin(successfulLogin);
  } catch (error) {
    setIsAdmin(false);
    console.error("Error checking admin status:", error);
  }
};



  useLayoutEffect(() => {
    

    checkAdminStatus();
  }, []); 
  
  

  if (isAdmin === undefined) return <div className={styles.adminMainDiv}>
     <AdminNavbar setIsAdmin={setIsAdmin} />
    <h1>Loading...</h1></div>;

  if (!isAdmin) return <AdminLogin checkAdminStatus={checkAdminStatus} />;
  



    const router = useRouter();
    const { adminroute } = router.query;

    if(!adminroute?.length) return  <div className={styles.adminMainDiv}>
    <AdminNavbar setIsAdmin={setIsAdmin} />
    <AdminHome />
  </div>
  
 


  console.log('admin route', adminroute)


      
    let content;
    

    

    const componentsMap = {
      orders: <Orders data={orders.current} setData={setOrders} />,
      inbox: <Inbox data={messages.current} setData={setMessages} />,
      customers: <Customers customers={customers.current} setCustomers={setCustomers} />,
      reviews: <Reviews reviews={reviews.current} setReviews={setReviews} />,
      descriptionmaker: <DescriptionMaker />,
      productreturns: <ProductReturns/>,
      datawiper: <DataWiper />,
    };
    
    const emailRoutes = {
      'new-email': <NewEmail />,
      campaigns: <Campaigns emails={emailData?.emails} sequences={emailData?.sequences} campaignData={emailData?.campaigns} />,
      sequences: <Sequences emails={emailData?.emails} sequences={emailData?.sequences} />,
      'new-campaign': <NewCampaign sequences={emailData?.sequences} setEmailData={setEmailData} />,
      'new-sequence': <NewSequence emailData={emailData} setEmailData={setEmailData} />,
      default: <Emails emailData={emailData} setEmailData={setEmailData} />,
    };
    
    content = componentsMap[adminroute[0]] || (
      adminroute[0] === "emails"
        ? emailRoutes[adminroute[1]] || emailRoutes.default
        : <h1>Error 404. Page does not exist.</h1>
    );
  




    return (
      <div className={styles.adminMainDiv}>
        <AdminNavbar setIsAdmin={setIsAdmin} />
        {content}
      </div>
    );
  

}
