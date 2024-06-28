


import Image from "next/image";
import styles from '../styles/ourstory.module.css'

export default function OurStory() {
  return (
    <div className="centered">
  
      <div className={styles.mainDiv}>
        <h1>Our story</h1>
        <div className={styles.mainContent}>
        <Image src='/images/our_story1.jpeg' className={styles.ourStoryImage} sizes="100vw" height={0} width={0}/>
        <div className={styles.ourStoryText}>
        <p>Hi. Welcome to my website, Lightbook.</p>

        <p>Growing up as a 'weird' and 'nerdy' girl, I didn't have a lot of friends. 
          I wouldn't spend nights hanging out, nor enjoying conversations in coffee shops like other people did. 
          You need friends for that.</p>

          <p>But it's okay, I spent nights reading. Diving deep into stories, being opsessed with all these different characters, going through
            their own circumstances, handling problems in their own way. For me, it was the place where my imagination could freely thrive as I explore unlimited number of new worlds.
            Better then any night club I could have ever gone to. But I needed to have at least one true friend to share my passions with...
          </p>

          <p>
            Finally, when I started university, I got accepted for who I am for the first time in my life.
            The people who accepted me were book lovers as well. We shared passion for books, cute things, and cozy, comfortable atmosphere.
            We go to the library together, buy cute things, and explore convoluted journeies of many different, unique characters.
            We also like to go to coffee shop from time to time to drink coffee, tell stories, and discuss variaty of topics.
          </p>

          <p>
            Books and cozy atmosphere are everything for me, and I would like for everyone to feel the late-night reads in cozy room enriched with cute dimmed night light vibes.
            For people who are not familiar yet, I hope my story inspires your curiosity to discover atmosphere by yourself.

          </p>

          <p>
            This is probably not the ordinary brand story you expected to read, but I felt like expressing myself on this section of my website,
            like a writer allowing her readers to get a glimps of the depth of her soul. 
            And also, I hope that I correctly presented origin, values, and mission of Lightbook.
       
          </p>

        <p>Thank you for taking time of your day for reading my story.</p>
        </div>
      </div>
      </div>
    </div>
  );
}


// The Nue Cup™ was designed from long nights and hard days filled with neck and shoulder pain. I found myself incredibly frequent to cupping therapy appointments, massages and even acupuncture to help cure my build up of stress, knots, and over all pain and discomfort. I quickly realized this was not sustainable and looked to begin developing a new and improved solution. Cupping was the form of therapy that helped my shoulder and neck tension the most so I worked tirelessly to develop something that I could use myself, while sitting at my desk with ease, after 4 years of development I am extremely proud to present to you.... The Nue Cup™