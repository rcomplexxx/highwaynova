const next = require('next');
const express = require('express');
const createSqliteTables = require('./utils/createSqliteTables.js')
const dbCleaner = require('./utils/dbCleaner.jsx');
const sendEmailJob = require('./utils/sendEmailJob.jsx');
const betterSqlite3 = require ("better-sqlite3");




const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

function startEmailJobs(){

  try{
  const db = betterSqlite3(process.env.DB_PATH);

const campaigns= db.prepare(` SELECT 
    email_campaigns.id, 
    email_campaigns.emailSentCounter, 
    email_campaigns.sendingDateInUnix,
    email_sequences.emails
  FROM email_campaigns
  JOIN email_sequences ON email_campaigns.sequenceId = email_sequences.id`).all();




//Ako je campaign email counter manji od sequence.emails.length - 1, runovati tu kampanju
//I datum izracunati na osnovu sendingDate i time gapove, mislim da je vec uradjen algoritam za to na sendEmailJob


console.log('campaigns', campaigns);

campaigns.forEach(campaign=>{


 


  
  const currentEmailIndex = campaign.emailSentCounter;



  if(currentEmailIndex < campaign.emails.length ){



    const emailPointers =  campaign.emails && JSON.parse(campaign.emails);

    console.log('em pointers', emailPointers)

    
   
    
     
    

    let dateCalculated = campaign.sendingDateInUnix;

  

    emailPointers.forEach((emailPointer, index) =>{
    
      if(index!==0 && index < currentEmailIndex+1)
      dateCalculated = dateCalculated + parseInt(emailPointer.sendTimeGap);
   

    })

    

    let   finalSendingDate=(Date.now() - dateCalculated) >  -5000?
    Date.now()+5000: dateCalculated;




      // const altSendDate= new Date(new Date().getTime() + 1000 * 60 * 30).getTime();
      // console.log('My send time is', new Date(finalSendingDate));


      
      sendEmailJob(finalSendingDate, campaign.id);
  }
})
  }
  catch(error){
    console.log('server start error', error);
  }

//mozda dodati i retry numbers i pokusati da posaljem mejl kroz 30 min. Tipa 5 retryja
//kad radim retryje, svaki email pomeriti za 30 min.
}


//PUT ADDITIONAL CODE HERE. IMPORTANT!

console.log('Additional code.');



app.prepare().then(() => {


  createSqliteTables();


  dbCleaner();
  //Here start email crons
  startEmailJobs();
  

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT} - env ${process.env.NODE_ENV}`);
  });
});