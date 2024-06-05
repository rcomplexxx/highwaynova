import styles from "./xummpay.module.css";
import Image from "next/image";
import classNames from "classnames";

export default function XummPay({

}) {


    const initiateXumm= async()=>{
        try {
        
            const response = await fetch("/api/xummpay", {
              method: "GET",
             
            });
            // Parse the JSON response
      
            if (response.ok) {
              console.log("Payment was successful". response.payLoadRef);
              // Handle successful payment logic here
           
            } else {
             console.log('nO patment', response.error);
            }
          } catch (error) {
            console.error("Error capturing payment:", error);
            // Handle fetch or other errors here
          }
    }


  return (
    <div className={styles.xummWrapper}>
    <Image
    src='/images/xumm.png'
    onClick={initiateXumm}
    height={0}
    width={0}
    sizes="100vw"
    className={styles.xummImg}
    />
    </div>
  );
}
