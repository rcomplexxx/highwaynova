import PolicyCard from "@/components/Cards/PolicyCard/PolicyCard";
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/ourstory.module.css'

export default function OurStory() {
  return (
    <div className="centered">
  
      <div className={styles.mainDiv}>
        <h1>Our story</h1>
        <div className={styles.mainContent}>
        <Image src='/images/gamingFriends2.jpg' className={styles.ourStoryImage} sizes="100vw" height={0} width={0}/>
        <div className={styles.ourStoryText}>
        
        <p>
        In our tight-knit group of four, our profound connection centered around a shared passion for gaming. From the early consoles of our childhood to the intricate worlds of adulthood, our bond deepened through countless nights spent in front of screens, navigating virtual landscapes together. Victories and defeats wove into the fabric of our connection, creating enduring memories.

       </p>
        <p>
        Facing the challenges of growing up, gaming became more than an escape – it became a vessel for self-discovery. Each of us brought a unique flair to the gaming table – the strategist, the creative soul, the quick reflexes, and the meticulous attention to detail.
        </p>
        <p>
        Our shared experiences in virtual realms spilled into our real lives. As graduation loomed, we collectively decided to channel our passion into something greater, the Gamebuff! Our mission is promoting the amazing gaming night experience with friends, and enhancing that experience by providing exceptional gaming equipment. 
         </p>
         <p>
         Join us in utilizing technology to create the sureally joyful experience noone has ever had a chance to experience throughout history.
         </p>
         <p>
          Happy shopping!
           </p>
        </div>
      </div>
      </div>
    </div>
  );
}


// The Nue Cup™ was designed from long nights and hard days filled with neck and shoulder pain. I found myself incredibly frequent to cupping therapy appointments, massages and even acupuncture to help cure my build up of stress, knots, and over all pain and discomfort. I quickly realized this was not sustainable and looked to begin developing a new and improved solution. Cupping was the form of therapy that helped my shoulder and neck tension the most so I worked tirelessly to develop something that I could use myself, while sitting at my desk with ease, after 4 years of development I am extremely proud to present to you.... The Nue Cup™