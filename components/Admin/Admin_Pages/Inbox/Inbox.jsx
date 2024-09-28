import GetDataButton from "../MagicButtons/GetDataButton";
import SaveOrdersButton from "../MagicButtons/SaveOrdersButton";
import MessageCard from "./MessageCard/MsgCard";
import { useState } from "react";
import styles from "./inbox.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";

export default function Inbox({ data, setData }) {
  const [page, setPage] = useState(0);
  const [changedMessagesArray, setChangedMessagesArray] = useState([]);


  console.log('hello', data)




  const handleChangedMessagesArray = (changedMessage) => {

    

    let updatedChangedMessagesArray = [...changedMessagesArray].filter(status => {
      return status.id !== changedMessage.id
    });

    updatedChangedMessagesArray.push(changedMessage)
 

    setChangedMessagesArray(updatedChangedMessagesArray);


  };



  const clearAfterDataSave = () => {
    setChangedMessagesArray([]);
    setPage(0);
  };

  const initializeMsgStatusData = (data) => {

    
  };

  if (data.length === 1 && data[0] === "No Messages")
    return (
      <>
        <h1>Inbox</h1>
        <GetDataButton
          name="Messages"
          dataType={"get_unanswered_messages"}
          setData={setData}
          initializeData={initializeMsgStatusData}
        />
        <p>All/No messages answered for now.</p>
      </>
    );

  return (
    <>
      <div className={styles.titleDiv}>
        <h1>Inbox</h1>
        {data.length !== 0 ? (
          <SaveOrdersButton
            dataType="update_unanswered_messages"
            
            
            newData={changedMessagesArray}
            setData={setData}
            clearAfterDataSave={clearAfterDataSave}
          />
        ) : (
          <GetDataButton
            name="Answered Messages"
            secondStyle={true}
            dataType={"get_answered_messages"}
            setData={setData}
            initializeData={initializeMsgStatusData}
          />
        )}
      </div>
      {data.length === 0 && (
        <GetDataButton
          name="Messages"
          dataType={"get_unanswered_messages"}
          setData={setData}
          initializeData={initializeMsgStatusData}
        />
      )}
      {data.length !== 0 && data.length >= page * 10 && (
        <>
          {data
            .slice(
              page * 10,
              (page + 1) * 10 > data.length - 1
                ? data.length 
                : (page + 1) * 10,
            )
            .map((msg, index) => (
              <MessageCard
                key={page * 10 + index}
                id={msg.id}
                name={msg.name}
                email={msg.email}
                totalOrderCount={msg.totalOrderCount}
                message={msg.message}
                msgStatus={data[index].msgStatus}
                handleChangedMessagesArray={handleChangedMessagesArray}
              />
            ))}
        </>
      )}

      <PageIndexButtons data={data} page={page} setPage={setPage} />
    </>
  );
}
