import styles from "./reviewssavebutton.module.css";

import Swal from 'sweetalert2';

export default function SaveButton({

  reviews,
  setData,
  clearAfterReviewsSave,
  
}) {


  const showError = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonText: 'Okay',
        background: '#333', // Dark background color
        color: '#fff', // Text color
        customClass: {
            popup: 'dark-popup', // Custom class for the popup
            title: 'dark-title', // Custom class for the title
            icon: 'dark-icon', // Custom class for the icon
            confirmButton: 'dark-confirm-button' // Custom class for the button
        }
    });
};


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


    for(let dataReview of data){
      if(!reviews.find(review => review.id == dataReview.swapId)) return showError(`Cannot swap review ${dataReview.id} with a non-existent review, or review from a different product (${dataReview.swapId}).`);
      
    }


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
    <button className={styles.saveButton} onClick={saveData}>
      Save
    </button>
  );
}
