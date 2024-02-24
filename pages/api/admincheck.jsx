import fs from 'fs'
import { verifyToken } from "../../utils/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/rateLimiter.js";
import betterSqlite3 from "better-sqlite3";
import emailSendJob from '@/utils/sendEmailJob.jsx';

const limiterPerTwoMins = new RateLimiter({
  apiNumberArg: 5,
  tokenNumberArg: 20,
  expireDurationArg: 120, //secs
});

export default async function adminCheckHandler(req, res) {
  const { token } = req.cookies;

  const getFromDb = (table, queryCondition=true, selectVariables='*') => {
    try {
      const db = betterSqlite3(process.env.DB_PATH);
      let rows;

      if(table=="emails"){
        
       let queryString = `SELECT * FROM emails`;
       const rows1 = db.prepare(queryString).all();

       
       let rows2=[];
       try{
        queryString = `SELECT * FROM emailCampaigns`;
        rows2 = db.prepare(queryString).all();
       }catch{}
       rows= {emails: rows1, campaigns: rows2};

      }

else{


      let queryString;
      if (table === "orders" || table === "messages" || table==="subscribers") {
        queryString = `SELECT ${selectVariables} FROM ${table} WHERE ${queryCondition}`;
      } 
      
      else {
        queryString = `SELECT id, name, text, stars, imageNames, product_id FROM ${table} WHERE ${queryCondition}`;
      }

      // Fetching data from the specified table with the given query condition
     rows = db.prepare(queryString).all();

    }

      // Closing the database connection
      db.close();

      res.status(200).json({ data: rows });
    } catch (error) {
      console.error("Error fetching data from database:", error);
      return res
        .status(500)
        .json({ successfulLogin: false, error: "No data to send" });
    }
  };

  const updateDb = async (table, data, queryCondition) => {
    try {
      const db = betterSqlite3(process.env.DB_PATH);
      if(table!='emails' && table!='emailCampaigns'){
      for (let i = 0; i < data.length; i++) {
        if (table === "reviews") {
          if (data[i].deleted) {
            const deleteStatement = db.prepare(
              `DELETE FROM ${table} WHERE id = ?`,
            );
            deleteStatement.run(data[i].id);
            db.prepare(`UPDATE ${table} SET id = id - 1 WHERE id > ?`).run(
              data[i].id,
            );


            console.log('deleted',deleted)


          } else {
              let reviewImages= JSON.parse(data[i].imageNames);
            console.log(reviewImages, 'and', );
            if(!reviewImages)reviewImages=[];
            const allReviewImages=  JSON.parse(db.prepare(`SELECT imageNames FROM reviews WHERE id = ${data[i].id}`).all()[0].imageNames);
            
            const deletedImages= allReviewImages?.filter((img)=>{
              console.log('img name', img)
              return !reviewImages.includes(img)
            });


           if(deletedImages) deletedImages.forEach((deletedImage)=>{
            console.log('path', deletedImage);
            fs.rename(process.cwd() +`/public/images/review_images/${deletedImage}`, process.cwd() +`/public/images/review_images/deleted_images/${deletedImage}`,function (err) {
              if (err) throw err
              console.log('Successfully renamed - AKA moved!')
            });
            
          
          });

            db.prepare(`UPDATE ${table} ${queryCondition}`).run(
              data[i].name,
              data[i].text,
              data[i].imageNames === "null" ? null : data[i].imageNames,
              data[i].id,
            );

            if (data[i].swapId) {
              const currentRowData = db
                .prepare(`SELECT * FROM ${table} WHERE id = ?`)
                .get(data[i].id);
              const targetRowData = db
                .prepare(`SELECT * FROM ${table} WHERE id = ?`)
                .get(data[i].swapId);

              if (targetRowData) {
                db.prepare(
                  `UPDATE ${table} SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                ).run(
                  targetRowData.name,
                  targetRowData.text,
                  targetRowData.stars,
                  targetRowData.imageNames,
                  data[i].id,
                );

                db.prepare(
                  `UPDATE ${table} SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`,
                ).run(
                  currentRowData.name,
                  currentRowData.text,
                  currentRowData.stars,
                  currentRowData.imageNames,
                  data[i].swapId,
                );
              } else {
                db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(data[i].id);

                db.prepare(
                  `INSERT INTO ${table} (id, name, text, stars, imageNames, product_id) VALUES (?, ?, ?, ?, ?, ?)`,
                ).run(
                  data[i].swapId,
                  currentRowData.name,
                  currentRowData.text,
                  currentRowData.stars,
                  currentRowData.imageNames,
                  currentRowData.product_id,
                );
              }
            }
          }
        } 
       
        
        else {
          db.prepare(`UPDATE ${table} ${queryCondition}`).run(
            data[i].status,
            data[i].id,
          );
        }
      }
    }

      else if(table=='emails'){

        console.log('in table emails');
        db.prepare(
          `
          CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY,
            title TEXT,
            text TEXT 
          )
        `).run();

        console.log('should be created');

        db.prepare(`INSERT INTO ${table} (title, text) VALUES (?, ?)`).run(
          data.title,
          data.text,
        );

        console.log('should be inserted?');
      }

      else{
        console.log('in table emailCampaigns');
        db.prepare(
          `
          CREATE TABLE IF NOT EXISTS emailCampaigns (
            id INTEGER PRIMARY KEY,
            title TEXT,
            emails TEXT 
          )
        `).run();

        console.log('should be created');

        const result =db.prepare(`INSERT INTO ${table} (title, emails) VALUES (?, ?)`).run(
          data.title,
          data.emails,
        );

        const campaignId = result.lastInsertRowid;

        console.log('should be inserted?',data.title,
        data.emails,);
        console.log('first email date,',JSON.parse(data.emails)[0]);
        emailSendJob(JSON.parse(data.emails)[0].sendDate,campaignId, JSON.parse(data.emails)[0].id);
      }

      db.close();

      return res.status(200).json({ data_saved: true });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ successfulLogin: false, error: "Database update error" });
    }
  };

  //   } catch (error) {
  //     console.error('Error handling GET request:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // }

  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (!(await limiterPerTwoMins.rateLimiterGate(clientIp)))
      return res.status(429).json({ error: "Too many requests." });

    // Verify the token
    const userIsAdmin = verifyToken(token);

    // You might want to check if the user with this ID has admin privileges in your database
    // For simplicity, let's assume userId 1 is the admin
    if (userIsAdmin) {
      const { dataType, data } = req.body;
      console.log(dataType);
      if (!dataType) return res.status(200).json({ successfulLogin: true });
      else {
        if(dataType === "get_order_cash_info")  return getFromDb("orders", `approved = '1'`, "createdDate, items");
        else if (dataType === "get_unfulfilled_orders")
          return getFromDb("orders", `approved = '1' AND packageStatus = '0'`);
        else if (dataType === "get_unapproved_orders")
          return getFromDb("orders", `approved = '0'`);
        else if (dataType === "get_fulfilled_orders")
          return getFromDb("orders", `packageStatus != '0'`);
        else if (dataType === "get_unanswered_messages")
          return getFromDb("messages", `msgStatus = '0'`);
        else if (dataType === "get_answered_messages")
          return getFromDb("messages", `msgStatus != '0'`);
        else if (dataType === "get_reviews")
          return getFromDb(
            "reviews",
            `product_id = ${data.product_id}`,
          ); //Doraditi za product_id===data.product_id
        else if (dataType === "get_subscribers")
          return getFromDb("subscribers");
          else if (dataType === "get_emails")
          {return getFromDb("emails");}
          else if (dataType === "get_email_campaigns")
          return getFromDb("email_campaigns");
        else if (dataType === "send_unfulfilled_orders") {
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

          await updateDb("orders", data, `SET packageStatus = ? WHERE id = ?`);
        } else if (dataType === "send_unanswered_messages") {
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

          await updateDb("messages", data, `SET msgStatus = ? WHERE id = ?`);
        } else if (dataType === "send_reviews") {
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

          await updateDb(
            "reviews",
            data,
            "SET name = ?, text = ?, imageNames = ? WHERE id = ?",
          );
        } else if (dataType === "send_new_email") {
          console.log('started email send');
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

              console.log('No data crossed', data);

          await updateDb(
            "emails",
            data,
          );
        } else if(dataType === 'send_new_capaign'){
          console.log('started campaign send');
          if (!data)
            return res
              .status(500)
              .json({ successfulLogin: false, error: "No data to send" });

              console.log('No data crossed', data);

          await updateDb(
            "emailCampaigns",
            data,
          );
        }
        
        
        else {
          console.error("Wrong data type");
          res
            .status(500)
            .json({ successfulLogin: false, error: "Wrong data type" });
        }
      }
    } else {
      res
        .status(400)
        .json({
          successfulLogin: false,
          error: "You do not have access to this sector. Get lost noob.",
        });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ successfulLogin: false, error: "Internal Server Error" });
  }
} //
