import { useEffect, useState } from 'react'
import styles from './unsubscribe.module.css'
import { Spinner2 } from '@/public/images/svgs/svgImages';
import Link from 'next/link';

export default function Unsubscribe() {

    const [loadingUnsubscribe, setLoadingUnsubscribe] = useState(true);

    const [unsubscribeSuccess, setUnsubscribeSuccess] = useState(false);

    const [unsubscribeError, setUnsubscribeError] = useState(false);



    useEffect(()=>{

        const searchParams = new URLSearchParams(window.location.search);
        const  customer_id = Number(searchParams.get('c'));
        const customer_hash = searchParams.get('k');

        if(customer_id ===NaN)  {setLoadingUnsubscribe(false); return}
       


        const fetchData = async () => {
        const response = await fetch("/api/unsubscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ customer_id, customer_hash}),
          })
        
          if(response.ok){
            console.log(response);
            const data = await response.json();
            if(data.success) setUnsubscribeSuccess(true)
              
          }

          else setUnsubscribeError(true);

          setLoadingUnsubscribe(false);
        }

        fetchData();

    },[])



    



//     Something is amiss. We're on it.
// The address you asked for didn't work for some reason. Here are some possible reasons why:

// This could be a bug and our team has already been notified.
//  1 It might be a temporary issue. Please try again.
//  2 You may have typed the page address incorrectly.
//  3 Thanks for your patience.

if(loadingUnsubscribe) return   <div className={styles.mainDiv}><Spinner2/></div>


if(unsubscribeError) return <div className={styles.mainDiv}>

  <div className={`${styles.subscribedDiv} ${styles.errorWrapper}`}>
  
  <h1 className={styles.title}>Something is amiss. We're on it.</h1>

  <p className={styles.instruction}>The address you asked for didn't work for some reason. Here are some possible reasons why:</p>
<ul className={styles.errorUl}>
    <li>This could be a bug and our team has already been notified.</li>
    <li>It might be a temporary issue. Please try again.</li>
    <li>You may have typed the page address incorrectly.</li>
</ul>
<p className={styles.instruction}>Thanks for your patience.</p>
</div>
</div>;



if(unsubscribeSuccess) return <div className={styles.mainDiv}>


<div className={styles.subscribedDiv}>
  <h1 className={styles.title}>You've been unsubscribed</h1>
  <p className={styles.instruction}>If you'd like to re-subscribe to the list, use the link below.</p>
  <Link href='/subscriptions/subscribe' className={`mainButton ${styles.subscribeButton}`}>Subscribe</Link>
</div>

</div>


  return (
    <div className={styles.mainDiv}>{unsubscribeSuccess?'Successfully unsubscribed':'Error unsubscribing'}</div>
  )
}
