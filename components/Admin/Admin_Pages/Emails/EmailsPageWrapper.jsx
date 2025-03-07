







import  { useEffect } from 'react'
import { useAdminStore } from '../../AdminZustand';
import { useRouter } from 'next/router';
import { adminAlert } from '@/utils/utils-client/utils-admin/adminAlert';

export default function EmailsPageWrapper({children}) {


     const { isAdmin, emailData, setEmailData , emailDataUpdate, setEmailDataUpdate } = useAdminStore();

     const router = useRouter();


    useEffect(()=>{

      
    
      console.log('hello', isAdmin, emailDataUpdate.shouldUpdate)
        if(!isAdmin || !emailDataUpdate.shouldUpdate)return;

        
    
        if(emailDataUpdate.swapToEmailRootPage && !router.asPath!=='/admin/emails')router.push('/admin/emails');
    
        const fetchAdminData = async () => {

    
          if(!emailDataUpdate.shouldUpdate)return;

        
          try {


            

            const response = await fetch("/api/admincheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ dataType: "get_emails" }),
            });
        
            if (!response.ok) throw new Error("Network response was not ok.");
        
            const { data } = await response.json();
            console.log("Maine DATA!", data);
        
            // Process emails
            const unsequencedEmails = data?.emails.filter((email) => 
                !data?.sequences.some((sequence) => 
                  JSON.parse(sequence.emails).some((seqEmail) => seqEmail.id === email.id)
                )
              ) || [];
        
            setEmailData({ ...data, unsequencedEmails });
            setEmailDataUpdate(false, false);
          } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
            setEmailDataUpdate(false, false);
            adminAlert('error', 'Server error', 'Email data could not be fetched');
          }
        };
    
        fetchAdminData();
    
    
    
      },[isAdmin, emailDataUpdate.shouldUpdate])



  return children
}
