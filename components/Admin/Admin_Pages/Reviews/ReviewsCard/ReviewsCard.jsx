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
  imageNames,
  handleReviewsChange,
}) {
  const [changed, setChanged] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [swapId, setSwapId] = useState("");
  const [images, setImages] = useState(
    imageNames && imageNames != null && imageNames != "null"
      ? JSON.parse(imageNames).map((img) => {
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
      divEditorRefName.current.textContent === ""
        ? null
        : divEditorRefName.current.textContent,
      divEditorRef.current.innerHTML,
      JSON.stringify(imageNames),
      deleted,
      swapId,
    );
    setChanged(!changed);
  };

  const addImage = () => {
    if (changed) return;
    const imageName = window.prompt("Enter link of new pic:");
    fetch(`/images/review_images/${imageName}`, {
      method: "HEAD",
    })
      .then((response) => {
        if (response.ok) {
          setImages((prevImages) => {
            if (prevImages == null) return [{ imageName, deleted: false }];

            let newImages = [...prevImages];

            newImages.push({ imageName, deleted: false });
            return newImages;
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div
      className={`${styles.cardMainDiv} ${
        deleted && styles.cardMainDivDeleted
      }`}
    >
      <h1 className={styles.identifier}>{index}</h1>

      <div className={styles.headDiv}>
        {" "}
        <div
          ref={divEditorRefName}
          contentEditable={!changed}
          suppressContentEditableWarning={true}
          className={styles.textAreaName}
        >
          {name}
        </div>
        <div className={styles.swiperDiv}>
          <label className={styles.swiperLabelCurrentId}>
            {id}
            <span> current id</span>
          </label>
          <label className={styles.swiperLabelDescription}>
            Enter review id to swap positions with
          </label>
          <input
            placeholder="Enter id"
            className={styles.textAreaName}
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
                imageIndex={i}
                imageName={img.imageName}
                deleted={img.deleted}
                setImages={setImages}
              />
            );
          })}
        <Image
          src="/images/add_image.png"
          className={styles.addImage}
          height={40}
          width={40}
          onClick={addImage}
        ></Image>
      </div>

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
