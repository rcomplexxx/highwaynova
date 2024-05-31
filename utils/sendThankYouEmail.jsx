



const sendThankYouEmail = (email, orderId)=>{

    //mozda doraditi name u fazonu thank you, order number 2 ili 3 ili 4 koji vec



  
  
  
    const result = db.prepare(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetCustomers) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(
      `Thank you ${email}`,
      process.env.THANK_YOU_SEQUENCE_ID,
      Date.now()+60000,
      0,
      0,
      JSON.stringify([email])
      
    );
     
  
          const campaignId = result.lastInsertRowid;
  
       
  
  
          emailSendJob(Date.now()+60000,campaignId);
  }