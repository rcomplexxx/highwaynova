import betterSqlite3 from "better-sqlite3";


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