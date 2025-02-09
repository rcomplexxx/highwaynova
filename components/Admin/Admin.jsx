import {  useEffect } from "react";
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


import { useAdminStore } from "@/components/Admin/AdminZustand";
import EmailsPageWrapper from "./Admin_Pages/Emails/EmailsPageWrapper";

export default function Admin() {
  
  

  


  
  



  const { isAdmin, setIsAdmin, checkAdminStatus } = useAdminStore();


  const router = useRouter();


  





    useEffect(() => {
      

      checkAdminStatus();
    }, []); 






 
  
  
  

  if (isAdmin === undefined) return <div className={styles.adminMainDiv}>
     
     <div className={styles.loadingDiv}>
     <Spinner2 style={{justifySelf: 'flex-start'}}/>
     </div>
     </div>;

  if (!isAdmin) return <AdminLogin checkAdminStatus={checkAdminStatus} />;
  


  

    const { adminroute } = router.query;

   
  
 


    

      
  
  
  const emailRoutes = {
    '': <Emails />,
    'new-email': <NewEmail />,
    campaigns: <Campaigns />,
    sequences: <Sequences />,
    'new-campaign': <NewCampaign  />,
    'new-sequence': <NewSequence  />,
   
  };

    const componentsMap = {
      '':  <AdminHome />,
      orders: <Orders/>,
      inbox: <Inbox/>,
      customers: <Customers />,
      reviews: <Reviews />,
      emails: <EmailsPageWrapper>{emailRoutes[adminroute?.[1] || '']}</EmailsPageWrapper>,
      descriptionmaker: <DescriptionMaker />,
      productreturns: <ProductReturns/>,
      datawiper: <DataWiper />,
    };
    
  
    
    
    const content = componentsMap[adminroute?.[0] || '']  || <h1>Error 404. Page does not exist.</h1>;
  




    return (
      <div className={styles.adminMainDiv}>
        <AdminNavbar setIsAdmin={setIsAdmin} />
        {content}
      </div>
    );
  

}
