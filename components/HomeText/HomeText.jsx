import styles from "./hometext.module.css";
import Image from "next/image.js";

export default function HomeText() {
  return (
    <div className={styles.policy_background_div}>
      <div className={styles.coolImageDiv}>
        <Image
          height={0}
          width={0}
          src={"/images/" + `gamerwporig.png`}
          alt="review image"
          sizes="35vw"
          className={styles.coolImage}
        />
      </div>

      <div className={styles.policy_main_div}>
        <h1>Improve gaming experience!</h1>

        <p>Welcome to the Gamebuff.</p>
        <p>
          Our story began when we saw a gap in the market of new and innovative
          products not being pushed into the market quick enough nor without any
          quality control. Huge brands and corporations are slow and often not
          caring about their customers as they have millions more.
        </p>
        <p>
          That’s where our idea was born - create a shop with highest quality
          products for our favorite game while providing EXCEPTIONAL customer
          satisfaction level.
        </p>
        <p>
          We have worked really hard to pull this all together simply to satisfy
          you - the end customer. Hopefully you can feel that genuine love for
          our products when purchasing from us!
        </p>
        <p>
          Thank you for showing interest in our shop, and gl hf in your future
          games!
        </p>
        <p>Happy shopping! 🌠</p>
      </div>
    </div>
  );
}
