import GetDataButton from "../MagicButtons/GetDataButton";
import UpdateDataButton from "../MagicButtons/UpdateDataButton";
import MessageCard from "./MessageCard/MsgCard";
import {  useState } from "react";
import styles from "./inbox.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";
import { useAdminStore } from "../../AdminZustand";

export default function Inbox() {
  const [page, setPage] = useState(0);
  


  const {messages, setMessages } = useAdminStore();



  




  const handleChangedMessagesArray = (changedMessage) => {

    
    const updatedMessages = messages.map(message => message.id === changedMessage.id?{...message, ...changedMessage, changed:true}: message)

   
    

    
 

    setMessages(updatedMessages);

   
    


  };



  

 
  

  

  return (
    <>
      <div className={styles.mainCommandDiv}>
        <h1>Inbox</h1>
        {messages.length !== 0 ? (
          <UpdateDataButton

          dataName={'messages'}
            dataType="update_unanswered_messages"
            
            
            newData={messages.filter(message => message.changed)}
          
            
          />
        ) : (
          <>
          <GetDataButton
            name="Answered Messages"
          
            dataType={"get_answered_messages"}
            setData={setMessages}
            
          />
          <GetDataButton
          name="Messages"
          dataType={"get_unanswered_messages"}
          setData={setMessages}
          
        />
        </>
        )}
      </div>
    
    
   
   
          {messages.slice(
              page * 10,
               (page + 1) * 10,
            )
            .map((msg, index) => (
              <MessageCard
                key={page * 10 + index}
                index= {page*10+index}
                messageInfo ={msg}
                
                msgStatus={messages[index].msgStatus}
                handleChangedMessagesArray={handleChangedMessagesArray}
              />
            ))
            
            }
       
       

      <PageIndexButtons data={messages} page={page} setPage={setPage} />
    </>
  );
}
