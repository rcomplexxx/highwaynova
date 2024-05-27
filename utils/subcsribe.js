import betterSqlite3 from "better-sqlite3";
import emailSendJob from "./sendEmailJob";


function subscribe(email, source) {



  if(source==="checkout x"){
    subscribeCheckoutX(email);
    return true;
  }


    const db = betterSqlite3(process.env.DB_PATH);

    // Ensure the subscribers table exists
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY,
        email TEXT,
        source TEXT
      )
    `,
    ).run();

        const result = db.prepare("SELECT * FROM subscribers WHERE email = ?").get(email);
        
    
        if(!result){
    // Insert subscriber email into the subscribers table
    db.prepare("INSERT INTO subscribers (email, source) VALUES (?, ?)").run(
        email,
      source
    );





  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS email_campaigns (
      id INTEGER PRIMARY KEY,
      title TEXT,
      sequenceId INTEGER,
      sendingDateInUnix INTEGER,
      emailSentCounter INTEGER,
      retryCounter INTEGER,
      targetSubscribers TEXT
    )
  `).run();


  const result = db.prepare(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetSubscribers) VALUES (?, ?, ?, ?, ?, ?)`)
  .run(
    `Welcome ${email}`,
    1,
    Date.now()+60000,
    0,
    0,
    JSON.stringify([email])
    
  );
   

        const campaignId = result.lastInsertRowid;

     


        emailSendJob(Date.now()+60000,campaignId);

        }

    console.log("Successfully subscribed.");
   

    // Close the database connection when done
    db.close();

    return true;
}

const subscribeCheckoutX = (email)=>{

  const db = betterSqlite3(process.env.DB_PATH);

    // Ensure the subscribers table exists
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS subscribersbh (
        id INTEGER PRIMARY KEY,
        email TEXT,
        source TEXT
      )
    `,
    ).run();

        const result = db.prepare("SELECT * FROM subscribersbh WHERE email = ?").get(email);
        const result2 = db.prepare("SELECT * FROM subscribers WHERE email = ?").get(email);
    
        if(!result && !result2){
    // Insert subscriber email into the subscribers table
    db.prepare("INSERT INTO subscribersbh (email, source) VALUES (?, ?)").run(
        email,
      "bh"
    );
        }

    console.log("Successfully subscribed.");
   

    // Close the database connection when done
    db.close();

    return true;
  
}

module.exports =  subscribe;