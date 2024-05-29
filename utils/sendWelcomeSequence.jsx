



const betterSqlite3 = require('better-sqlite3');
const emailSendJob = require('./sendEmailJob');





 async function sendWelcomeSequence( targetEmail) {

const db = betterSqlite3(process.env.DB_PATH);



db.prepare(
  `
  CREATE TABLE IF NOT EXISTS email_campaigns (
    id INTEGER PRIMARY KEY,
    title TEXT,
    sequenceId INTEGER,
    sendingDateInUnix INTEGER,
    emailSentCounter INTEGER,
    retryCounter INTEGER,
    targetCustomers TEXT
  )
`).run();

console.log('target email', targetEmail)


const result = db.prepare(`INSERT INTO email_campaigns (title, sequenceId, sendingDateInUnix, emailSentCounter, retryCounter, targetCustomers) VALUES (?, ?, ?, ?, ?, ?)`)
.run(
`Thank you for purcasing ${targetEmail}`,
2,
Date.now()+60000,
0,
0,
JSON.stringify([targetEmail])

);


    const campaignId = result.lastInsertRowid;

 


    await emailSendJob(Date.now()+60000,campaignId);




    db.close();


}



module.exports = sendWelcomeSequence;