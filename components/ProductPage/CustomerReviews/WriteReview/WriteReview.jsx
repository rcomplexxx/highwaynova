import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./writereview.module.css";
import StarRatings from "react-star-ratings";
import Link from "next/link";

import { useRouter } from "next/router";
import { ErrorIcon, STARPATH } from "@/public/images/svgs/svgImages";
import { BackIcon, CancelIcon } from "@/public/images/svgs/svgImages";
import { useGlobalStore } from "@/contexts/AppContext";

export default function WriteReview({ setWriteReviewOpen }) {
 
  
  const [rating, setRating] = useState(5);
  const [ratingPage, setRatingPage] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [images, setImages] = useState([]);
  const [reviewInfo, setReviewInfo] = useState({
   
  });
  const [errors, setErrors] = useState({  email: false, images5: false });
  
  const { increaseDeepLink, decreaseDeepLink, shouldDeepLinkSurvivePopState } = useGlobalStore((state) => ({
    increaseDeepLink: state.increaseDeepLink,
    decreaseDeepLink: state.decreaseDeepLink,
    shouldDeepLinkSurvivePopState: state.shouldDeepLinkSurvivePopState,
  }));



  
  const nextLink= useRef();

  
  const router = useRouter();
 

  useEffect(()=>{


   
  
  


    const handlePopState=()=>{  
      
     if(shouldDeepLinkSurvivePopState('write_review'))return;
      window?.removeEventListener("popstate", handlePopState);
      setWriteReviewOpen(false);
    
    }

 
    
     increaseDeepLink('write_review', 'write-review');

    window?.addEventListener("popstate", handlePopState);
    
    
    document.documentElement.classList.add("hideScroll");
   

   return ()=>{
    window?.removeEventListener("popstate", handlePopState);
    
    document.documentElement.classList.remove("hideScroll");
    decreaseDeepLink(nextLink.current);
   }
  },[])




  const handleImageUpload = useCallback(({ target: { files } }) => {
    const arrayMax = Math.min(files.length, 5 - images.length);
    setErrors({ ...errors, images5: files.length > arrayMax });
  
    const newImages = [
      ...images,
      ...Array.from(files).slice(0, arrayMax).map((file) => URL.createObjectURL(file))
    ];
  
    setImages(newImages);
  }, [images, errors]);

//Videti da li trebam errors da stavim kao dependency ili ne



const handleNext = useCallback(() => {
  if (animation) return;

  setAnimation("swipeOutLeft");

  setTimeout(() => {
    setRatingPage(prev => prev + 1);
    setAnimation("swipeInRight");

    setTimeout(() => setAnimation(), 200);
  }, 500);
}, [animation]);

  

const handleBack = useCallback(() => {
  if (animation) return;

  setAnimation("swipeOutRight");

  setTimeout(() => {
    setRatingPage(prev => Math.max(prev - 1, 0));
    setAnimation("swipeInLeft");

    setTimeout(() => setAnimation(), 200);
  }, 500);
}, [animation]);








 



  return (
   
      

     
        <div className={styles.writeReviewPopupDiv}>
          <div className={`${styles.mainReviewDiv}`}>
            {ratingPage !== 0 && ratingPage !== 4 && (
              <div
                className={`${styles.writeReviewFooter} ${styles.writeReviewFooterMobile}`}
              >
                
                <BackIcon color={`var(--writing-button-txt-color)`} styleClassName={`${styles.arrowBack} ${styles.arrowBackMob}`}
                handleClick={handleBack}/>
              
              
                {/* //doraditi uslov */}
                {ratingPage == 1 && (
                  <button onClick={handleNext} className={`${styles.writingActionButton} ${styles.skipInFooter}`}>
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
              {ratingPage === 0 ? (
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
              ) : ratingPage === 1 ? (
                <>
                 
                    <h1 className={styles.showImageTitle}>Show it off!</h1>

                    <span>We'd love to see it in action!</span>
                 

                  {images.length !== 0 ? (
                    <div className={styles.userImagesDivWrapper}>
                      
                      <div className={styles.userImagesDiv}>

                        
                      {images.map((image, i) => {
                       return <div key={i} className={styles.userImageDiv}>
                          <CancelIcon color={"var(--writing-cancel-added-image-color)"}
              styleClassName={styles.cancelImage} handleClick={() => {
                let newImages= images.filter(img=>{return img!=image});
                            setImages(newImages);
                            setErrors({...errors, images5:false});
             
              }}
              />
                        
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
                         / >
                            
                      <span>+</span></div>}
                      
                      
                  
                     
                    </div>
                    
                      {errors.images5 && <p className={styles.requiredError}><ErrorIcon/>You can select up to 5 photos</p>}
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
                          />
                        </button>
                        <button className={styles.mediaButton}>
                          Add video
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleNext}
                            className={styles.mediaButtonImgInput}
                          />
                        </button>
                      </div>
                      <button
                        className={`${styles.writingActionButton} ${styles.remindMeLater}`}
                        onClick={handleNext}
                      >
                        Remind me later
                      </button>
                    </>
                  )}
                </>
              ) : ratingPage === 2 ? (
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
              ) : ratingPage === 3 ? (
                <>
                  <h1>About you</h1>
                  <div className={styles.personInfo}>

                    <div>
                      <label>
                        First Name <span className={styles.required}>*</span>
                      </label>
                      <input
                        value={reviewInfo.firstName}
                        onChange={(event) => {
                        
                          setReviewInfo( {...reviewInfo, firstName: event.target.value });
                        }}
                        className={styles.personInfoInput}
                      />
                      
                    </div>

                    <div>
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
                      autoComplete="email"
                      onChange={(event) => {
                        if (errors.email)
                          setErrors({ ...errors, email: false });
                        
                        setReviewInfo({ ...reviewInfo, email: event.target.value});
                      }}
                    />
                    {errors.email && (
                      <p className={styles.requiredError}>
                        <ErrorIcon/>{reviewInfo.email === ""
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

            {ratingPage === 0 || ratingPage === 4 ? (
              

              <CancelIcon color={"var(--cancel-write-review-color)"}
              styleClassName={styles.closeButton} handleClick={() => {
                router.back();
             
              }}
              />
             
               
                            

                     
            ) : (
              <div
                className={`${styles.writeReviewFooter} ${
                  ratingPage === 1
                    ? animation === "swipeInRight"
                      ? styles.writeReviewFooterSpawn
                      : animation === "swipeOutRight"
                      ? styles.swipeOutRightFooterAnimation
                      : animation === "swipeOutLeft" &&
                        styles.nextButtonMobileAnim
                    : ratingPage === 3 &&
                      animation === "swipeOutLeft" &&
                      styles.swipeOutLeftFooterAnimation
                }`}
              >
                <button
                  onClick={handleBack}
                  className={`${styles.writingActionButton} ${styles.writingActionButtonMobileControl}`}
                >
            <BackIcon color={`var(--writing-button-txt-color)`} styleClassName={`${styles.arrowBack}`}
                /> Back
                </button>

               



                <div
                  className={`${styles.progressDiv} 
                   ${(ratingPage > 1 ||
                      (ratingPage === 1 && animation === "swipeOutLeft")) &&
                    styles.progressDivMobileControl
                  }`}
                >
                  <div className={styles.progressBar}>
                    <div className={`${styles.progressBarFilled}`} />
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressBarFiller} ${
                        ((ratingPage === 0 &&
                        animation === "swipeOutLeft") || (ratingPage === 1 && animation !== "swipeOutRight") || ratingPage>1) &&
                        styles.fillProgressBarFiller
                      }`}
                    />
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressBarFiller} ${
                        ((ratingPage === 1 && animation === "swipeOutLeft") ||  (ratingPage === 2 && animation !== "swipeOutRight") || (ratingPage>2)) &&
                         
                        styles.fillProgressBarFiller
                      }`}
                    />
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressBarFiller} 
                      ${ ((ratingPage === 2 && animation === "swipeOutLeft") ||  (ratingPage === 3 && animation !== "swipeOutRight")) &&
                        styles.fillProgressBarFiller
                      }`}
                    />
                  </div>
                </div>


                {

                (ratingPage===1 &&  animation !== "swipeOutLeft") ?

                <button
                onClick={handleNext}
                className={`${styles.writingActionButton} ${styles.writingActionButtonMobileControl}`}
                >
                {images.length!=0?'Continue':'Skip'}
                </button>
                
                
                
                
                
                :(ratingPage===1 || (ratingPage===2 &&  animation !== "swipeOutLeft")) ?
              
                <button
                      
                      onClick={()=>{if( !reviewInfo.text || reviewInfo.text === "")return; handleNext();}}
                      className={`${styles.nextButton} ${
                        (!reviewInfo.text || reviewInfo.text === "") && styles.nextButtonDisabled
                      }`}
                    >
                      Next
                    </button>: (ratingPage===2 || ratingPage===3) &&

                      <button
                      onClick={() => {

                        if(!reviewInfo.firstName || reviewInfo.firstName === "" ||
                          !reviewInfo.email || reviewInfo.firstName ===""
                        )return;


                        const newErrors={...errors};
                       
                        if( !/^\S{3,}@\S{3,}\.\S{2,}$/.test(reviewInfo.email))
                          newErrors.email=true;
                        else newErrors.email=false;


                        setErrors(newErrors);


                       if(!newErrors.email)
                        handleNext();
                      }}
                      className={`${styles.nextButton} ${
                        (!reviewInfo.firstName || reviewInfo.firstName==="" || !reviewInfo.email || reviewInfo.email==="") && styles.nextButtonDisabled}`}
                      >
                      Done
                      </button>

                }


              </div>
            )}

            {ratingPage === 4 && (
              <div
                className={`${styles.writeReviewFooter}`}
              >
                <Link onClick={(event)=>{ event.preventDefault();nextLink.current='/products'; router.back();}} href="/products" className={`${styles.continueLink}`}>
                  Continue
                </Link>
              </div>
            )}
          </div>
        </div>
      
   
  );
}
