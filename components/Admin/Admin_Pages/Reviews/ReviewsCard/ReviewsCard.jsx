import styles from "./reviewscard.module.css";
import { useRef, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import ReviewImage from "./ReviewImage/ReviewImage";
import Image from "next/image";

export default function ReviewsCard({
  id,
  index,
  name,
  text,
  stars,
  productId,
  imageNames,
  handleReviewsChange,
  changed
}) {

  const [newStars, setNewStars] = useState(stars);
  const [deleted, setDeleted] = useState(false);
  const [swapId, setSwapId] = useState("");
  const [images, setImages] = useState(
    imageNames && imageNames != null && imageNames != "null"
      ? JSON.parse(imageNames)?.map((img) => {
          return { imageName: img, deleted: false };
        })
      : null,
  );


 

  const transformedText = ReactHtmlParser(text);
  const divEditorRef = useRef();
  const divEditorRefName = useRef();

 

  const changeReview = () => {
    let imageNames = null;
    if (images) {
      const survivedImages = images.filter((img) => !img.deleted);
      if (survivedImages.length > 0) {
        imageNames = [];
        survivedImages.map((img) => imageNames.push(img.imageName));
      }
    }

    handleReviewsChange(
      id,
      !changed,
      divEditorRefName.current?.textContent === ""
        ? null
        : divEditorRefName.current?.textContent,
      divEditorRef.current?.innerHTML,
      JSON.stringify(imageNames),
      newStars,
      deleted,
      swapId,
    );
  };

  console.log('img names', images)

  const addImage = async (imageName) => {
    try {
        console.log('IMAGE NAME', imageName);

        // Check if the image has changed or already exists
        if (changed || images?.find(img => img.imageName === imageName)) return;

        // Check if the image exists in the main path
        let response = await fetch(`/images/review_images/productId_${productId}/${imageName}`, { method: "HEAD" });

        if (response.ok)  setImages((prevImages) => [
                ...(prevImages || []),
                { imageName, deleted: false }
            ]);

         else {
            // Check if the image exists in the deleted_images path
            response = await fetch(`/images/review_images/productId_${productId}/deleted_images/${imageName}`, { method: "HEAD" });

            if (response.ok) setImages((prevImages) => [
                    ...(prevImages || []),
                    { imageName, deleted: false }
                ]);
            
        }
    } catch (error) {
        console.error("Error:", error);
    }
};



  return (
    <div
      className={`${styles.cardMainDiv} ${
        deleted && styles.cardMainDivDeleted
      }`}
    >

<div className={styles.idDiv}>
      <span className={styles.identifier}>{index + 1}</span>
      <span className={styles.swapperLabelCurrentId}>
            {id}<span> current id</span>
          </span>
      </div>

      <div className={styles.headDiv}>
     
        <span
          ref={divEditorRefName}
          contentEditable={!changed}
          suppressContentEditableWarning={true}
          className={styles.textAreaName}
        >
           
          {name}
        </span>
        
        <div className={styles.swapperDiv}>


       


         


          <span className={styles.swapperLabelDescription}>
            Enter review id to swap positions
          </span>


          <input
            placeholder="Enter id"
            
            disabled={changed}
            onChange={(event) => {
              const value = event.target.value;
              if (
                (!isNaN(value) && value >= 0 && value <= 100000) ||
                value == ""
              )
                setSwapId(value);
            }}
            value={swapId}
          />
        </div>
      </div>

      <div
        ref={divEditorRef}
        contentEditable={!changed}
        suppressContentEditableWarning={true}
        className={styles.textArea}
        onFocus={(event) => {
          event.target.style.height = event.target.scrollHeight + "px";
        }}
      >
        {transformedText}
      </div>
      <p className={styles.deleteImageInstruction}>
        Click ➕ icon to add Image to review
      </p>
      {images && (
        <p className={styles.deleteImageInstruction}>
          If image border is red, it will be deleted if edit is saved, and saved
          in db. Click to change image's state
        </p>
      )}
      <div className={styles.imagesDiv}>
        {images &&
          images.map((img, i) => {
            return (
              <ReviewImage
              productId={productId}
                imageIndex={i}
                imageName={img.imageName}
                deleted={img.deleted}
                setImages={setImages}
                changed={changed}
              />
            );
          })}
          <div className={styles.addImage}>
        <Image
          src="/images/add_image.png"
           className={styles.addImageIcon}
          height={40}
          width={40}
          
        />
        <input  className={styles.addImagePathInput} type="file"
          onChange={(event)=>{ 
            const files = event.target.files;
            console.log('files', files);
            for (let i =0; i<files.length; i++)
            addImage(files[i].name);

          }}
        />
</div>


      </div>

      <div 
      className={styles.ratingDiv}
      contentEditable={!changed}
      suppressContentEditableWarning={true}
      onInput={(event)=>{
          const ratingText = event.target.textContent;
          if(!ratingText.startsWith('Rating:') || ratingText.length<8 || ratingText.length>9)
          event.target.textContent = `Rating: ${newStars}`;
        else{
          if(ratingText.length === 9){
            if(parseInt(ratingText[8])>0 && parseInt(ratingText[8])<6 )
            setNewStars(ratingText[8]);
          else event.target.textContent = `Rating: ${newStars}`;
          }
        }

         
    
    }}
      >{`Rating: ${newStars}`} </div>

      <button className={styles.reviewEditButton} onClick={changeReview}>
        {changed ? "Unsave edit" : "Save edit"}
      </button>
      <button
        className={`${styles.reviewEditButton} ${styles.deleteReviewButton}`}
        onClick={() => {
          if (changed) return;
          setDeleted(!deleted);
        }}
      >
        {deleted ? "Restore review" : "Delete review"}
      </button>

      {changed && (
       < Image src="/images/correct.png" height={64} width={64} className={styles.savedImage} />
      )}
    </div>
  );
}
