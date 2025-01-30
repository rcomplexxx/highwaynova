import { useAdminStore } from "../../AdminZustand";
import styles from "./updatedatabutton.module.css";

export default function UpdateDataButton({
  dataName,
  dataType,
 
  newData,
  
  
}) {

  
    const { setData } = useAdminStore();

  
  const saveData = async () => {

    if(!newData.length)return setData([], dataType, true);

    try {
      const response = await fetch("/api/admincheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataType, data: newData }),
      });
  
      if (response.ok)  setData([], dataType, true);
        
      
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return  <button className={styles.saveButton} onClick={saveData}>Update {dataName}</button>;
  
}
