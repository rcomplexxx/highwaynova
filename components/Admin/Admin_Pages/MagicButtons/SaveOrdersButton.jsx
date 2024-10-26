import styles from "./saveordersbutton.module.css";

export default function SaveOrdersButton({
  dataType,
 
  newData,
  setData,
  
}) {

  
  const saveData = async () => {
    try {
      const response = await fetch("/api/admincheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataType, data: newData }),
      });
  
      if (response.ok)  setData([]);
        
      
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <button className={styles.saveButton} onClick={saveData}>
      Save
    </button>
  );
}
