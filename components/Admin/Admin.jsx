import { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./admin.module.css";
import AdminNavbar from "./Admin_Navbar/AdminNavbar";
import { useRouter } from "next/router";

import { Spinner2 } from "@/public/images/svgs/svgImages";

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
import { adminAlert } from "@/utils/utils-client/utils-admin/adminAlert";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState();
  const [triggerRender, setTriggerRender] = useState(false);


  const [emailData, setEmailData] = useState({emails: [], campaigns: []});

  const customers = useRef([]);
  const orders = useRef([]);
  const messages = useRef([]);
  const reviews = useRef([]);



  const setData = (data, type, typeName) => {
    if (!data.length) {
      const alerts = {
        reviews: ['No reviews found.', 'No reviews imported yet, or incorrect product id.'],
        orders: ['No orders found.', 'All orders fulfilled for now.'],
        messages: ['No messages found.', 'All messages answered for now.'],
        customers: ['No customers found.', 'Noone subscribed yet bro.']
      };
  
      const alert = alerts[Object.keys(alerts).find(key => typeName.includes(key))];
      if (alert && !type.current.length) return adminAlert('info', alert[0], alert[1]);
    }
  
    type.current = data;
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
     
     <div className={styles.loadingDiv}>
     <Spinner2 style={{justifySelf: 'flex-start'}}/>
     </div>
     </div>;

  if (!isAdmin) return <AdminLogin checkAdminStatus={checkAdminStatus} />;
  



    const router = useRouter();
    const { adminroute } = router.query;

    if(!adminroute?.length) return  <div className={styles.adminMainDiv}>
    <AdminNavbar setIsAdmin={setIsAdmin} />
    <AdminHome />
  </div>
  
 


  console.log('admin route', adminroute)


      
  
  
    

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
      'new-campaign': <NewCampaign 
      sequences = {emailData?.sequences?.filter(sequence => !emailData?.specialCampaignIds.includes(sequence.id.toString()))} 
      setEmailData={setEmailData} />,
      'new-sequence': <NewSequence emailData={emailData} setEmailData={setEmailData} />,
      default: <Emails emailData={emailData} setEmailData={setEmailData} />,
    };
    
    const content = componentsMap[adminroute[0]] || (
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
