







import  { useEffect } from 'react'
import { useAdminStore } from '../../AdminZustand';
import { useRouter } from 'next/router';

export default function EmailsPageWrapper({children}) {


     const { isAdmin, emailData, setEmailData , emailDataUpdate, setEmailDataUpdate } = useAdminStore();

     const router = useRouter();


    useEffect(()=>{

        console.log('hello!', router.asPath)
    
        if(!isAdmin || !emailDataUpdate)return;

        console.log("hello, ", router.asPath)
    
        if(!router.asPath!=='/admin/emails')router.push('/admin/emails');
    
        const fetchAdminData = async () => {
    
          if(!emailData)return;
        
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
            setEmailDataUpdate(false);
          } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
            setEmailDataUpdate(false);
          }
        };
    
        fetchAdminData();
    
    
    
      },[isAdmin, emailDataUpdate])



  return children
}
