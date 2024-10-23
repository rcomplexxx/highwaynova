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
