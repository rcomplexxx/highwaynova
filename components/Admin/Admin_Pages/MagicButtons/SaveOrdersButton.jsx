import styles from "./saveordersbutton.module.css";

export default function SaveOrdersButton({
  dataType,
 
  newData,
  setData,
  clearAfterDataSave,
}) {
  const saveData = async () => {
   
   
    
      await fetch("/api/admincheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataType: dataType, data: newData }),
      })
        .then((response) => {
          if (response.ok) {
            setData(["reset_data"]);
            clearAfterDataSave();
          }
        })

        .catch((error) => {});
  };

  return (
    <button className={styles.saveButton} onClick={saveData}>
      Save
    </button>
  );
}
