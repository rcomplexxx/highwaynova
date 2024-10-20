



export default function SaveButton({

  reviews,
  setData,
  clearAfterReviewsSave,
  
}) {





 const saveData = async () => {
  const data = reviews
    .filter(r => r.changed)
    .map(({ id, name, text, imageNames, stars, deleted, swapId }) => ({
      id: id.toString(),
      name,
      text,
      imageNames,
      stars,
      deleted: deleted || false,
      swapId: swapId || null,
    }));


 
    


  if (data.length) {
    try {
      const response = await fetch("/api/admincheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataType: "update_reviews", data }),
      });

      if (response.ok) {
        setData(["reset_data"]);
        clearAfterReviewsSave();
      }
    } catch (error) {
      // handle error if needed
    }
  } else {
    console.log("data je 0");
    setData(["reset_data"]);
    clearAfterReviewsSave();
  }
};






  return (
    <button onClick={saveData}>
      Save
    </button>
  );
}
