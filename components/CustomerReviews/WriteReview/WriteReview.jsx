import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./writereview.module.css";
import StarRatings from "react-star-ratings";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { STARPATH } from "@/data/constants";

export default function WriteReview({ setInfoDivOpen }) {
 
  
  const [rating, setRating] = useState(5);
  const [ratingPage, setRatingPage] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [images, setImages] = useState([]);
  const [reviewInfo, setReviewInfo] = useState({
   
  });
  const [cancelImageLoaded, setCancelImageLoaded] = useState(false);
  const [errors, setErrors] = useState({ firstName: false, email: false, images5: false });
  

  
 

  useEffect(()=>{


   
  
  


    const handlePopState=(event)=>{  event.preventDefault(); global.stopRouteExecution=true; setInfoDivOpen(false);}

 

    window?.addEventListener("popstate", handlePopState);

   return ()=>{
    window?.removeEventListener("popstate", handlePopState);
   }
  },[])




  const handleImageUpload = useCallback((e) => {

    const files = e.target.files;
    
    const newImages = [...images];
    let arrayMax = 5 - images.length;
    if(files.length>arrayMax) setErrors({...errors, images5:true}); else setErrors({...errors,images5:false});

    for (
      let i = 0;
      i < (files.length < arrayMax ? files.length : arrayMax);
      i++
    ) {
      if (files[i]) {
        const uploadedImagePath = URL.createObjectURL(files[i]);
        newImages.push(uploadedImagePath);
      }
    }
    setImages(newImages);

 
  },[images]);

  const handleNext = useCallback(() => {
    const outAnimationTime = 500;
    const inAnimationTime = 200;
    if (animation) return;

    setAnimation("swipeOutLeft");

    setTimeout(() => {
      setRatingPage(ratingPage + 1);

      setAnimation("swipeInRight");
      setTimeout(() => {
        setAnimation(undefined);
      }, inAnimationTime);
    }, outAnimationTime);
  },[ratingPage, animation]);

  

  const handleBack = useCallback(() => {
    const outAnimationTime = 500;
    const inAnimationTime = 200;
    if (animation) return;

    setAnimation("swipeOutRight");

    setTimeout(() => {
     
      setRatingPage(ratingPage>0?ratingPage-1:0);

      setAnimation("swipeInLeft");
      setTimeout(() => {
        setAnimation(undefined);
      }, inAnimationTime);
    }, outAnimationTime);
  },[ratingPage, animation]);




 



  return (
   
      

     
        <div className={styles.writeReviewPopupDiv}>
          <div className={`${styles.mainReviewDiv} ${cancelImageLoaded && styles.spawnReviewDiv}`}>
            {ratingPage !== 0 && ratingPage !== 4 && (
              <div
                className={`${styles.writeReviewFooter} ${styles.writeReviewFooterMobile}`}
              >
                
                <Image src='/images/arrowRight3.png'
                onClick={handleBack}
                className={`${styles.arrowBack} ${styles.arrowBackMob}`}
                height={0}
                width={0}
                sizes="32px"
                />
              
                {/* //doraditi uslov */}
                {ratingPage == 1 && (
                  <button onClick={handleNext} className={`${styles.remindMeLater} ${styles.skipInFooter}`}>
                    {images.length===0?'Skip':'Continue'}
                  </button>
                )}
              </div>
            )}

            <div
              className={`${styles.reviewPageDiv} ${
                animation == "swipeOutLeft"
                  ? styles.swipeOutLeftAnimation
                  : animation == "swipeInRight"
                  ? styles.swipeInRightAnimation
                  : animation == "swipeInLeft"
                  ? styles.swipeInLeftAnimation
                  : animation == "swipeOutRight"
                  && styles.swipeOutRightAnimation
                  
              }`}
            >
              {ratingPage == 0 ? (
                <>
                  <span className={styles.rateQuestion}>
                    How would you rate this product?
                  </span>
                  <StarRatings
                    rating={rating}
                    svgIconPath={STARPATH}
                    starRatedColor="var(--star-color)"
                    numberOfStars={5}
                    changeRating={(newRating) => {    
                      setRating(newRating);
                      handleNext();
                    }}
                    starEmptyColor={"var(--star-empty-color)"}
                    starHoverColor="var(--star-hover-color)"
                    starDimension="48px"
                    starSpacing="12px"
                  />
                </>
              ) : ratingPage == 1 ? (
                <>
                 
                    <h1 className={styles.showImageTitle}>Show it off!</h1>

                    <span>We'd love to see it in action!</span>
                 

                  {images.length !== 0 ? (
                    <div className={styles.userImagesDivWrapper}>
                      
                      <div className={styles.userImagesDiv}>

                        
                      {images.map((image, i) => {
                       return <div key={i} className={styles.userImageDiv}>
                          <img height={0} width={0} src='/images/svgs/cancelIconWriteReview.svg' className={styles.cancelImage} onClick={()=>{
                            let newImages= images.filter(img=>{return img!=image});
                            setImages(newImages);
                          }}>
                            

                          </img>
                          <img src={image} className={styles.userImage} />
                        </div>;
                      })}

                    { images.length!==5 && <div className={styles.addImageDiv} onClick={handleImageUpload}>
                    <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              handleImageUpload(event);
                            }}
                            className={styles.mediaButtonImgInput}
                            multiple
                          ></input>
                      <span>+</span></div>}
                      
                      
                  
                     
                    </div>
                    
                      {errors.images5 && <p className={styles.requiredError}>You can select up to 5 photos</p>}
                      </div>
                  ) : (
                    <>
                      <div className={styles.centerButtons}>
                        <button className={styles.mediaButton}>
                          Add photos
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              handleImageUpload(event);
                            }}
                            className={styles.mediaButtonImgInput}
                            multiple
                          ></input>
                        </button>
                        <button className={styles.mediaButton}>
                          Add video
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleNext}
                            className={styles.mediaButtonImgInput}
                          ></input>
                        </button>
                      </div>
                      <button
                        className={styles.remindMeLater}
                        onClick={handleNext}
                      >
                        Remind me later
                      </button>
                    </>
                  )}
                </>
              ) : ratingPage == 2 ? (
                <>
                  <h1 className={styles.tellUsMore}>Tell us more!</h1>
                  <textarea
                    className={styles.writeReviewText}
                    value={reviewInfo.text}
                    onChange={(event) => {
                      setReviewInfo((prev) => {
                        return { ...prev, text: event.target.value };
                      });
                    }}
                    rows={8}
                  />
                </>
              ) : ratingPage == 3 ? (
                <>
                  <h1>About you</h1>
                  <div className={styles.personInfo}>
                    <div className={styles.personInfoDiv}>
                      <label>
                        First Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        value={reviewInfo.firstName}
                        onChange={(event) => {
                        
                            setErrors( { ...errors, firstName: false } );
                          setReviewInfo( {...reviewInfo, firstName: event.target.value });
                        }}
                        className={styles.personInfoInput}
                      />
                      {errors.firstName && (
                        <p className={styles.requiredError}>Required field</p>
                      )}
                    </div>
                    <div className={styles.personInfoDiv}>
                      <label>Last Name</label>
                      <input
                        className={styles.personInfoInput}
                        value={reviewInfo.lastName}
                        onChange={(event) => {
                          setReviewInfo( { ...reviewInfo, lastName: event.target.value });
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.personEmailDiv}>
                    <label>
                      Email<span className={styles.required}>*</span>
                    </label>
                    <input
                      className={styles.personEmail}
                      value={reviewInfo.email}
                      onChange={(event) => {
                        if (errors.email)
                          setErrors({ ...errors, email: false });
                        
                        setReviewInfo({ ...reviewInfo, email: event.target.value});
                      }}
                    />
                    {errors.email && (
                      <p className={styles.requiredError}>
                        {reviewInfo.email == ""
                          ? "Required field"
                          : "Please fill a valid email address"}
                      </p>
                    )}
                  </div>
                  <p className={styles.writeReviewTerms}>
                    By submitting, I acknowledge the{" "}
                    <Link href="/terms-of-service">Terms of Service</Link> and{" "}
                    <Link href="/privacy-policy">Privacy Policy</Link> and that
                    my review will be publicly posted and shared online
                  </p>
                </>
              ) : (
                <>
                  <h1>Thank you!</h1>
                  <span>Your review has been submitted</span>
                </>
              )}
            </div>

            {ratingPage == 0 || ratingPage == 4 ? (
               <Image height={20} width={20} src='/images/svgs/cancelIconWriteReview.svg'
               onLoad={()=>{setCancelImageLoaded(true)}}
               onError={()=>{setCancelImageLoaded(true)}}
                onClick={() => {
                  setInfoDivOpen(false);
               
                }}
                className={styles.closeButton}
              />
             
               
                            

                     
            ) : (
              <div
                className={`${styles.writeReviewFooter} ${
                  ratingPage == 1
                    ? animation == "swipeInRight"
                      ? styles.writeReviewFooterSpawn
                      : animation == "swipeOutRight"
                      ? styles.swipeOutRightFooterAnimation
                      : animation == "swipeOutLeft" &&
                        styles.nextButtonMobileAnim
                    : ratingPage == 3 &&
                      animation == "swipeOutLeft" &&
                      styles.swipeOutLeftFooterAnimation
                }`}
              >
                <button
                  onClick={handleBack}
                  className={`${styles.remindMeLater} ${styles.remindMeLaterMobileControl}`}
                >
            <Image src='/images/arrowRight3.png'
                className={styles.arrowBack}
                height={0} width={0} sizes="32px"
                /> Back
                </button>

                <div
                  className={`${styles.progressDiv} 
                   ${(ratingPage > 1 ||
                      (ratingPage == 1 && animation == "swipeOutLeft")) &&
                    styles.progressDivMobileControl
                  }`}
                >
                  <div className={styles.progressBar}>
                    <div className={`${styles.progressBarFilled}`} />
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressBarFiller} ${
                        ((ratingPage == 0 &&
                        animation == "swipeOutLeft") || (ratingPage == 1 && animation != "swipeOutRight") || ratingPage>1) &&
                        styles.fillProgressBarFiller
                      }`}
                    />
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressBarFiller} ${
                        ((ratingPage == 1 && animation == "swipeOutLeft") ||  (ratingPage == 2 && animation != "swipeOutRight") || (ratingPage>2)) &&
                         
                        styles.fillProgressBarFiller
                      }`}
                    />
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressBarFiller} 
                      ${ ((ratingPage == 2 && animation == "swipeOutLeft") ||  (ratingPage == 3 && animation != "swipeOutRight")) &&
                        styles.fillProgressBarFiller
                      }`}
                    />
                  </div>
                </div>


                {

                (ratingPage==1 &&  animation != "swipeOutLeft") ?

                <button
                onClick={handleNext}
                className={`${styles.remindMeLater} ${styles.remindMeLaterMobileControl}`}
                >
                {images.length!=0?'Continue':'Skip'}
                </button>
                
                
                
                
                
                :(ratingPage==1 || (ratingPage==2 &&  animation != "swipeOutLeft")) ?
              
                <button
                      
                      onClick={()=>{if( !reviewInfo.text || reviewInfo.text == "")return; handleNext();}}
                      className={`${styles.nextButton} ${
                        (!reviewInfo.text || reviewInfo.text == "") && styles.nextButtonDisabled
                      }`}
                    >
                      Next
                    </button>: (ratingPage==2 || ratingPage==3) &&

                      <button
                      onClick={() => {
                        if (reviewInfo.firstName == "") {
                          if (!/^\S{3,}@\S{3,}\.\S{2,}$/.test(reviewInfo.email))
                            setErrors({ email: true, firstName: true });
                          else setErrors({ email: false, firstName: true });
                          return;
                        } else if (
                          !/^\S{3,}@\S{3,}\.\S{2,}$/.test(reviewInfo.email)
                        ) {
                          setErrors({ firstName: false, email: true });
                          return;
                        } else {
                          setErrors({ firstName: false, email: false });
                          handleNext();
                        }
                      }}
                      className={`${styles.nextButton} ${
                        (!reviewInfo.firstName || reviewInfo.firstName=="" || !reviewInfo.email || reviewInfo.email=="") && styles.nextButtonDisabled}`}
                      >
                      Done
                      </button>

                }


              </div>
            )}

            {ratingPage == 4 && (
              <div
                className={`${styles.writeReviewFooter}`}
              >
                <Link href="/products" className={`${styles.continueLink}`}>
                  Continue
                </Link>
              </div>
            )}
          </div>
        </div>
      
   
  );
}
