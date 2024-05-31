import GetDataButton from "../MagicButtons/GetDataButton";
import SaveButton from "../MagicButtons/SaveButton";
import MessageCard from "./MessageCard/MsgCard";
import { useState } from "react";
import styles from "./inbox.module.css";
import PageIndexButtons from "../MagicButtons/PageIndexButtons";

export default function Inbox({ data, setData }) {
  const [page, setPage] = useState(0);
  const [msgStatusArray, setMsgStatusArray] = useState([]);


  console.log('hello', data)

  const handleMsgStatusChange = (i, msgStatus) => {
    const updatedMsgStatusArray = [];
    msgStatusArray.map((ps, id) => {
      if (id === i) updatedMsgStatusArray.push(msgStatus);
      else updatedMsgStatusArray.push(ps);
    });

    setMsgStatusArray(updatedMsgStatusArray);
  };

  const clearAfterDataSave = () => {
    setMsgStatusArray([]);
    setPage(0);
  };

  const initializeMsgStatusData = (data) => {
    let newMsgStatusArray = [];
    for (let i = 0; i < data.length; i++) {
      newMsgStatusArray.push(data[i].msgStatus);
    }

    setMsgStatusArray(newMsgStatusArray);
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
          <SaveButton
            dataType="send_unanswered_messages"
            oldData={data}
            statusData={msgStatusArray}
            setOldData={setData}
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
                id={page * 10 + index}
                name={msg.name}
                email={msg.email}
                totalOrderCount={msg.totalOrderCount}
                message={msg.message}
                msgStatus={msgStatusArray[index]}
                handleMsgStatusChange={handleMsgStatusChange}
              />
            ))}
        </>
      )}

      <PageIndexButtons data={data} page={page} setPage={setPage} />
    </>
  );
}
