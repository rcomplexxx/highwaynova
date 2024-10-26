



export default function SaveButton({

  reviews,
  setData,
  
  
}) {





 const saveData = async () => {
  const data = reviews
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

      if (response.ok) setData([]);
        
      
    } catch (error) {
      // handle error if needed
    }
  } else {
    console.log("data je 0");
    setData([]);
    
  }
};






  return (
    <button onClick={saveData}>
      Save
    </button>
  );
}
