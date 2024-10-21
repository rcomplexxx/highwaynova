import { adminAlert } from "@/utils/utils-client/utils-admin/adminAlert";
import styles from "./getdatabutton.module.css";

export default function GetDataButton({
  name,
  reqData = undefined,
  dataType,
  setData
}) {
  const handleGetData = async () => {
    try {

      if(dataType === "get_reviews" && isNaN(Number(reqData.product_id))) return adminAlert('error','Error', 'Incorect product id provided.')    

      const response = await fetch("/api/admincheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataType, ...(reqData && { data: reqData }) }),
      });
  
      if (!response.ok) throw new Error("Network response was not ok.");
      
      const { data } = await response.json();
      console.log("Maine DATA!", data);

      if(data.length === 0){

        if(dataType.includes("reviews")) return adminAlert('info','No reviews found.', 'No reviews imported yet, or incorrect product id.') 
          else if (dataType.includes("orders")) return adminAlert('info','No orders found.', 'All orders fulfilled for now.') 
            else if (dataType.includes("messages")) return adminAlert('info','No messages found.', 'All messages answered for now.') 
              else if (dataType.includes("customers")) return adminAlert('info','No customers found.', 'Noone subscribed yet bro.') 
      }

       
      setData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  // 'get_fulfilled_orders' 'get_answered_messages'

  return (
    <button
      className={styles.magicButton}
      onClick={handleGetData}
    >
      Get {name}
    </button>
  );
}
