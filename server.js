
const next = require('next');
const express = require('express');
const createSqliteTables = require('./utils/createSqliteTables.js')
const dbCleaner = require('./utils/dbCleaner.jsx');
const sendEmailJob = require('./utils/sendEmailJob.jsx');

const getPool = require('./utils/mariaDbPool');



const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
let appServer;










async function startEmailJobs(){


  

let dbConnection;


  try{


    dbConnection = await (await getPool()).getConnection();





 



const campaigns= await dbConnection.query(` SELECT 
    email_campaigns.id, 
    email_campaigns.emailSentCounter, 
    email_campaigns.sendingDateInUnix,
    email_sequences.emails
  FROM email_campaigns
  JOIN email_sequences ON email_campaigns.sequenceId = email_sequences.id`);




//Ako je campaign email counter manji od sequence.emails.length - 1, runovati tu kampanju
//I datum izracunati na osnovu sendingDate i time gapove, mislim da je vec uradjen algoritam za to na sendEmailJob


console.log('campaigns', campaigns);

for(const campaign of campaigns){


 


  
  const currentEmailIndex = campaign.emailSentCounter;



  if(currentEmailIndex < campaign.emails.length ){



    const emailPointers =  campaign.emails && JSON.parse(campaign.emails);

    console.log('em pointers', emailPointers)

    
   
    
     
    

    let dateCalculated = parseInt(campaign.sendingDateInUnix);

  

    emailPointers.forEach((emailPointer, index) =>{
    
      if(index!==0 && index < currentEmailIndex+1)
      dateCalculated = dateCalculated + parseInt(emailPointer.sendTimeGap);
   

    })

    

    let   finalSendingDate=(Date.now() - dateCalculated) >  -5000?
    Date.now()+5000: dateCalculated;




      // const altSendDate= new Date(new Date().getTime() + 1000 * 60 * 30).getTime();
      // console.log('My send time is', new Date(finalSendingDate));


      
      await sendEmailJob(finalSendingDate, campaign.id);
  }
}


  }
  catch(error){
    console.log('server start error', error);
  }

  finally{
    
    if(dbConnection) await dbConnection.release();

  }


  


//mozda dodati i retry numbers i pokusati da posaljem mejl kroz 30 min. Tipa 5 retryja
//kad radim retryje, svaki email pomeriti za 30 min.
}


//PUT ADDITIONAL CODE HERE. IMPORTANT!

console.log('Additional code.');


 app.prepare().then(async() => {

  BigInt.prototype.toJSON = function() { return this.toString() }


 await createSqliteTables();


  await dbCleaner();
  //Here start email crons
  await startEmailJobs();
  

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;

  appServer = server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT} - env ${process.env.NODE_ENV}`);
  });




  
}).catch((err) => {

  
   
  console.log('Server error.', err);
  process.kill(process.pid, 'SIGTERM');
 
});






async function closeServerGracefully() {
  console.log('Gracefully shutting down...');

  //  stopEmailJobs(); ??


  try{

    process.off('SIGINT', closeServerGracefully); // Remove the signal handler
    process.off('SIGTERM', closeServerGracefully); // Remove the signal handler

    try{

    await (await getPool()).end();

    console.log('MariaDB pool closed.');

    }

    catch(err){
      console.log('MariaDb pool was already closed.', err)
    }

    if (appServer && appServer.listening) {

      console.log('Server still alive. Closing server.')
    await appServer.close();

    }

    console.log('Server closed.');

    process.exit(0);
   
 
  }
  catch(err){
    process.exit(1);

  }
   
  


    


}

// Signal handling
process.on('SIGINT', closeServerGracefully);  // Handle Ctrl+C
process.on('SIGTERM', closeServerGracefully); // Handle termination


