import styles from "./reviewssavebutton.module.css";

export default function SaveButton({

  reviews,
  setOldReviews,
  clearAfterReviewsSave,
  
}) {
  const saveData = async () => {
    let data = [];

    for (let i = 0; i < reviews.length; i++) {
      if (reviews[i].changed)
        data.push({
          id: reviews[i].id.toString(),
          name: reviews[i].name,
          text: reviews[i].text,
          imageNames: reviews[i].imageNames,
          stars: reviews[i].stars,
          deleted: reviews[i].deleted && reviews[i].deleted,
          swapId:
            reviews[i].swapId && reviews[i].swapId != "" && reviews[i].swapId,
        });
    }

    
    console.log(data);
    if (data.length !== 0)
      await fetch("/api/admincheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataType: "send_reviews", data: data }),
      })
        .then((response) => {
          if (response.ok) {
            setOldReviews(["reset_data"]);
            clearAfterReviewsSave();
          }
        })

        .catch((error) => {});
    else {
      console.log("data je 0");
      setOldReviews(["reset_data"]);
      clearAfterReviewsSave();
    }
  };

  return (
    <button className={styles.saveButton} onClick={saveData}>
      Save
    </button>
  );
}
