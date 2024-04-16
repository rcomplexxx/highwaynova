import React from "react";
import { useState, useRef } from "react";
import Head from "next/head";

import styles from "./faq.module.css";
import Image from "next/image";

function Question(props) {
  const [showAnswer, setShowAnswer] = useState(false);
  const answerRef= useRef();
  
  function summonAnswer() {
    if(!showAnswer){
     
      answerRef.current.style.maxHeight = `${answerRef.current.scrollHeight}px`;
    } else{
      answerRef.current.style.maxHeight = 0;
    }
    setShowAnswer(!showAnswer);
  }

  return (
    <>
      <button className={styles.question_div} onClick={summonAnswer}>
        {props.question}
        <Image
        src='/images/greaterLess3.png'
        height={12} width={12}
          className={`${styles.plusStyle} ${
            showAnswer ? styles.plusStyleRotate : ""
          }`}
        />
          
       
      </button>
      <p ref={answerRef} className={`${styles.emerge} ${showAnswer && styles.show }`} >
        {props.answer}
      </p>
    </>
  );
}

export default function Faq({ questionData }) {
  return (
    <div className={styles.coverDiv}>
      <Head>
        <title>FAQ - Gamesmoke shop</title>
      </Head>
      <div className={styles.mainDiv}>
        <h1 className={styles.title}>FAQ</h1>
        <p>
          Here are a few of the frequently asked questions. To provide you with
          the best customer experience, your feedback is greatly encouraged. If
          you have any questions please send us an email at:
          support@petboutique.co.
        </p>
      
      <div className={styles.questions_div}>
        {questionData.map((q, i) => {
          return (
            <Question
              key={i}
              id={i}
              question={q.question}
              answer={q.answer}
            ></Question>
          );
        })}
      </div>
    </div>
    </div>
  );
}

export async function getStaticProps() {
  const questionData = [
    {
      question: "Where do you ship from?",
      answer:
        "We ship from our partnered warehouses & factories located in China.",
    },

    {
      question: "How long will it take for my items to arrive?",
      answer:
        "It will usually take 7-20 business days for all orders to arrive. Shipping times vary based on customer location, season and shipping location.",
    },

    {
      question: "How long will it take to dispatch the order?",
      answer:
        "It will take usually up to 3 business days, while, in peak times, it may take up to 5 business days to dispatch.",
    },

    {
      question: "Do you ship Worldwide?",
      answer: "Triple yes! We want the whole world to enjoy our products!",
    },

    {
      question: "Where is your company located?",
      answer:
        "Our company's headquarters are located in the LT, while our warehouses and vendors are scattered across China, USA and Europe.",
    },

    {
      question: "Which currency will I be charged in?",
      answer:
        "We process all orders in USD. While the content of the cart is displayed in several currencies, you will checkout using USD at the most current exchange rate.",
    },

    {
      question: "Will I receive a confirmation number when I place my order?",
      answer:
        "Yes, all customers will receive an order number after placing their orders. Please contact us if you don't receive one within 24 hours.",
    },

    {
      question: "Who can I contact if I have a problem with my order?",
      answer: "All inquiries can be forwarded to support@petboutique.co",
    },

    {
      question: "How can I pay?",
      answer:
        "You can be absolutely sure that all purchases here are safe and secure and are SSL-encrypted to protect your data!",
    },

    {
      question: "If I enter my email address will you sell my information?",
      answer:
        "We do not sell our customers information. Emails are strictly for follow-up and to send newsletters of our promotions and coupons for discounts.",
    },

    {
      question: "Will I have to pay customs?",
      answer:
        "For most countries, you will not have to pay customs, but it depends where are you located and if you order more than 1 piece.",
    },

   
  ];

  // Return the data as props
  return {
    props: {
      questionData,
    },
  };
}
