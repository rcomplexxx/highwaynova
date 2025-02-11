

import styles from "./homeReviews.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Stars } from "@/public/images/svgs/svgImages";
import useIsLargeScreen from "@/Hooks/useIsLargeScreen";

const reviews = [
  {
    id: 1,
    title: "Much love from night gamer",
    reviewText:
      "I don't like ordering online, but I decided to go with the flow. When it arrived, I gamed the whole night, and had a perfect gaming night! Gaming was out of this world! Love it!",
    author: "Monika W.",
    authorImage: "girl1edited3.png"
  },

  {
    id: 2,
    title: "Very cool keyboard!",
    reviewText:
      "I knew I found the best online store for gaming when I've seen amazing keyboard that I couldn't find anywhere! I ordered, it arrived, and I am more then satisfied with product.",
    author: "Luke B.",
    authorImage: "guy1edited3.png"
  },

  {
    id: 3,
    title: "Love your headphones!",
    reviewText:
      "I love the headphones I got from here. The sound is three dimensional, litelarry! My fav song hits different haha. Also, they fit so comfortably on ears! :3",
    author: "Marta N.",
    authorImage: "girl2edited3.png"
  },
  
];


function Review({ reviewText, author, authorImage }) {
  
  return (
    <div className={styles.reviewDiv}>
      
    
    
          <Stars ratingNumber={5} starWrapperClassName={styles.starWrapperClassName} starClassName={styles.starClassName} fillColor={`var(--star-home-review-color)`}/>


      <p className={styles.reviewText}>{reviewText}</p>
      <div className={styles.authorDiv}>
        <Image alt={author} className={styles.authorImage} src={`/images/${authorImage}`} height={48} width={48} sizes="48px"/>
      <p className={styles.authorName}>{author}</p>
      </div>
    </div>
  );
}

export default function HomeReviews() {
  

  const isLargeScreen = useIsLargeScreen();

  const settings = {
    speed: 400,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0", // Set padding between centered items to 0
    variableWidth: true,
  };
  

 
  

  return ( isLargeScreen !== undefined &&
    <div className={styles.mainReviewDiv}>
      <h1>Customer reviews</h1>
      <div className={styles.mainDiv}>
        {isLargeScreen ? (
          reviews.map((review, index) => (
            <Review
              key={review.id}
              title={review.title}
              reviewText={review.reviewText}
              author={review.author}
              authorImage={review.authorImage}
            />
          ))
        ) : (
          <>
            <Slider {...settings} className={styles.slider}>
              {reviews.map((review, index) => (
                
                  <Review
                    key={index}
                    smallScreen={true}
                    title={review.title}
                    reviewText={review.reviewText}
                    author={review.author}
                    authorImage={review.authorImage}
                  />
              
              ))}
            </Slider>
          </>
        )}
      </div>
    </div>
  );
}
