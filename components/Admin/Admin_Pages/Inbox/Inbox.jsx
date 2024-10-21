import GetDataButton from "../MagicButtons/GetDataButton";
import SaveOrdersButton from "../MagicButtons/SaveOrdersButton";
import MessageCard from "./MessageCard/MsgCard";
import { useEffect, useState } from "react";
import styles from "./inbox.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";

export default function Inbox({ data, setData }) {
  const [page, setPage] = useState(0);
  


  useEffect(()=>{
    if(data.length===0)setPage(0);
  },[data])


  




  const handleChangedMessagesArray = (changedMessage) => {

    
    const updatedMessages = data.map(message => message.id === changedMessage.id?{...message, ...changedMessage, changed:true}: message)

   
    

    
 

    setData(updatedMessages);

   
    


  };



  

 
  

  

  return (
    <>
      <div className={styles.mainCommandDiv}>
        <h1>Inbox</h1>
        {data.length !== 0 ? (
          <SaveOrdersButton
            dataType="update_unanswered_messages"
            
            
            newData={data.filter(message => message.changed)}
            setData={setData}
          />
        ) : (
          <>
          <GetDataButton
            name="Answered Messages"
          
            dataType={"get_answered_messages"}
            setData={setData}
            
          />
          <GetDataButton
          name="Messages"
          dataType={"get_unanswered_messages"}
          setData={setData}
          
        />
        </>
        )}
      </div>
    
    
   
   
          {data.slice(
              page * 10,
               (page + 1) * 10,
            )
            .map((msg, index) => (
              <MessageCard
                key={page * 10 + index}
                index= {page*10+index}
                id={msg.id}
                name={msg.name}
                email={msg.email}
                totalOrderCount={msg.totalOrderCount}
                message={msg.message}
                msgStatus={data[index].msgStatus}
                handleChangedMessagesArray={handleChangedMessagesArray}
              />
            ))
            
            }
       
       

      <PageIndexButtons data={data} page={page} setPage={setPage} />
    </>
  );
}
