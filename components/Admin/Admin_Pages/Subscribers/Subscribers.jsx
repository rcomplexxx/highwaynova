import GetDataButton from "../MagicButtons/GetDataButton";
import styles from "./subscribers.module.css";
import { useState } from "react";

export default function Subscribers({ subscribers, setSubscribers }) {
  const initializeSubscribersData = (data) => {
    console.log('data s', data)
    if (data && data.length == 0) setSubscribers("No Subscribers");
 

    setSubscribers(data);
  };

  if (subscribers && subscribers[0] === "No Subscribers")
    return (
      <>
        <h1>Subscribers</h1>
        <GetDataButton
          name="Subscribers"
          dataType={"get_subscribers"}
          setData={() => {}}
          initializeData={initializeSubscribersData}
        />
        <p>Noone subscribed yet bro :/</p>
      </>
    );



  const renderEmailList = () => {

    if (subscribers.length === 0)
    return (
  <div>
      <GetDataButton
        name="Subscribers"
        dataType={"get_subscribers"}
        setData={() => {}}
        initializeData={initializeSubscribersData}
      />

<GetDataButton
      name="Subscribers bh"
      dataType={"get_subscribers_bh"}
      setData={() => {}}
      initializeData={initializeSubscribersData}
    />

    </div>
    );
   
    console.log('subscr', subscribers)

    const subscribersLength = subscribers.length;
    
    return subscribers?.map((subscriber,index)=>{
      if((index)%5==0){
        return <div className={styles.subscribersRowWrapper}>
        <h1 className={styles.identifier}>{index==0?index:index/5}</h1>
        <div className={styles.subscribersRow}>
        {[0,1,2,3,4].map((number) => {
          return subscribersLength>index+number?<div className={styles.subscribePair}>
          <p key={index+number} className={styles.emailP}>Email: {subscribers[index+number]?.email}</p>
          <p key={index+number} className={styles.source}>Source: {subscribers[index+number]?.source}</p>
          </div> :<></>
        })}
        </div>
      </div>
      }
    })

     

    
  };

  return (
    <>
      <h1>Subscribers</h1>

      <div className={styles.subscribersWrapper}>
      <div className={styles.subscribersMain}>
      {renderEmailList()}
      </div>
      </div>
    </>
  );
}
