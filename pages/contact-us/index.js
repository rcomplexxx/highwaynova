



import styles from './contactus.module.css'
import Link from "next/link";
import { unimportantPageSeo } from "@/utils/SEO-configs/next-seo.config";
import { NextSeo } from "next-seo";
import ContactForm from '@/components/ContactForm/ContactForm';


export default function ContactUs() {

 
  return (


    <div className={styles.mainDiv}>
      <NextSeo {...unimportantPageSeo('/contact-us')}/>
        <h1>Contact Us</h1>



        <div className={styles.contactUsTextDiv}>

        <span>Before contacting us, check if your question/concern has been answered on our <Link href={'/faq'}>FAQ PAGE</Link>.</span>
        <span>We're happy to answer any question/concern you may have. If applicable, please include your <b>order id number</b> (sent by email after purchase).</span>
        <span>Please note, we will respond to you by email within 24-48 hours. Please include as much details as possible to help us understand your requirements.</span>
        


        </div>  

        <ContactForm/>
        




        </div>
     
  );
}
