import { useState, useEffect, useRef } from "react";
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
  const [customers, setCustomers] = useState([]);

  const [emailData, setEmailData] = useState({emails: [], campaigns: []});

  const orders = useRef([]);
  const messages = useRef([]);
  const reviews = useRef([]);

  const setOrders = (data) => {
    let newOrders = [];
    if (data.length == 1 && data[0] == "reset_data") {
      orders.current = [];
      setTriggerRender(!triggerRender);
      return;
    }

    if (data.length == 0) {
      orders.current = ["No orders"];
      setTriggerRender(!triggerRender);
      return;
    }

    for (let i = 0; i < data.length; i++) {
      const order = data[i];
      newOrders.push({
        id: order.id,
        email: order.email,
        firstName: order.firstName,
        lastName: order.lastName,
        address: order.address,
        country: order.country,
        zipcode: order.zipcode,
        state: order.state,
        city: order.city,
        phone: order.phone,
        items: order.items,
        couponCode: order.couponCode,
        tip: order.tip,
        packageStatus: order.packageStatus,
        paymentMethod: order.paymentMethod,
        paymentId: order.paymentId
      });
    }

    orders.current = newOrders;
    setTriggerRender(!triggerRender);
  };

  const setMessages = (data) => {
    let newOrders = [];
    if (data.length == 1 && data[0] == "reset_data") {
      messages.current = [];
      setTriggerRender(!triggerRender);
      return;
    }

    if (data.length == 0) {
      messages.current = ["No Messages"];
      setTriggerRender(!triggerRender);
      return;
    }

    for (let i = 0; i < data.length; i++) {
      const message = data[i];
      newOrders.push({
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
      });
    }

    messages.current = newOrders;
    setTriggerRender(!triggerRender);
  };

  const setReviews = (data) => {
    let newReviews = [];
    if (data.length == 1 && data[0] == "reset_data") {
      reviews.current = [];
      setTriggerRender(!triggerRender);
      return;
    }

    if (data.length == 0) {
      reviews.current = ["No Reviews"];
      setTriggerRender(!triggerRender);
      return;
    }

    for (let i = 0; i < data.length; i++) {
      const review = data[i];

  
      newReviews.push({
        id: review.id,
        name: review.name,
        stars: review.stars,
        text: review.text,
        imageNames: review.imageNames,
      });
    }

    reviews.current = newReviews;
    setTriggerRender(!triggerRender);
  };

 

  const checkAdminStatus = async () => {
    try {
      const response = await fetch("/api/admincheck");
      const data = await response.json();
      setIsAdmin(data.successfulLogin);
    } catch (error) {
      setIsAdmin(false);
      console.error("Error checking admin status:", error);
    }
  };



  useEffect(() => {
    // Check if the user is an admin when the component mounts

    checkAdminStatus();
  }, []); // The empty dependency array ensures this effect runs once when the component mounts

  if (isAdmin === undefined) return <div className={styles.adminMainDiv}>
     <AdminNavbar setIsAdmin={setIsAdmin} />
    <h1>Loading...</h1></div>;

  if (isAdmin) {
    const router = useRouter();
    const { adminroute } = router.query;
      
    let content;
    console.log('new route', adminroute);
    if (adminroute && adminroute.length!=0) {

    

      switch (adminroute[0]) {
        case "orders":
          content = <Orders data={orders.current} setData={setOrders} />;
          break;
        case "inbox":
          content = <Inbox data={messages.current} setData={setMessages} />;
          break;
        case "customers":
          content = (
         
            <Customers
            customers={customers}
              setCustomers={setCustomers}
            />
          );
          break;
        case "reviews":
          content = (
            <Reviews reviews={reviews.current} setReviews={setReviews} />
          );
          break;
          case "emails":
            if(adminroute.length==2){
                if(adminroute[1]=='new-email')content= <NewEmail/>
                else if(adminroute[1]=='campaigns')content = <Campaigns emails={emailData?.emails} sequences={emailData?.sequences} campaignData={emailData?.campaigns}/>
                else if(adminroute[1]=='sequences')content = <Sequences emails={emailData?.emails} sequences={emailData?.sequences}/>
               
                else if(adminroute[1]=='new-campaign')content = <NewCampaign  sequences={emailData?.sequences} setEmailData={setEmailData}/>
                else if(adminroute[1]=='new-sequence')content = <NewSequence  emailData={emailData} setEmailData={setEmailData}/>
             
                else{ 
               content = <Emails  emailData={emailData} setEmailData={setEmailData}/>
               }
            }

            else{
              content = <Emails  emailData={emailData} setEmailData={setEmailData}/>
            }


        
            break;

            case "descriptionmaker":
              content = (
                <DescriptionMaker/>
              );
            break;

            case "productreturns":
              content = (
                <ProductReturns/>
              );
            break;

            case "datawiper":
              content = (
                <DataWiper/>
              );
            break;
        default:
          content = <h1>Error 404. Page does not exist.</h1>;
      }
    } else content = <AdminHome />;

    return (
      <div className={styles.adminMainDiv}>
        <AdminNavbar setIsAdmin={setIsAdmin} />
        {content}
      </div>
    );
  }

  return <AdminLogin checkAdminStatus={checkAdminStatus} />;
}
