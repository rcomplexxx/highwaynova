
const getPool = require('./mariaDbPool');



async function createSqliteTables() {

  try{





  let conn = await getPool().getConnection();



  try {


  


    console.log('Creating sqlite tables.');




    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    await conn.query(`CREATE DATABASE IF NOT EXISTS mariadatabase_northhold CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    


    
    await conn.query(`
      CREATE TABLE IF NOT EXISTS rateLimiter (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ip VARCHAR(255),
          tokenNumber INT,
          apiNumber TINYINT,
          expireDate BIGINT
      )
  `);

  



  await conn.query(`
    CREATE INDEX IF NOT EXISTS idx_ip_apiNumber ON rateLimiter(ip, apiNumber)
`);




await conn.query(`
  CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name TEXT,
                text TEXT CHARACTER SET utf8mb4,
                stars TINYINT,
                imageNames TEXT,
                product_id INT
            )
`);



await conn.query(`
CREATE INDEX IF NOT EXISTS idx_product_id_stars ON reviews (product_id, stars)
`);





await conn.query(
        `
        CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255),
                totalOrderCount INT DEFAULT 0,
                money_spent DECIMAL(10, 2) DEFAULT 0,
                subscribed TINYINT,
                source TEXT,
                used_discounts TEXT DEFAULT '[]'
            )
      `,
      );





      await conn.query(`
        CREATE INDEX IF NOT EXISTS idx_email ON customers(email)
    `);



      



    await conn.query(
        `
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY,
                customer_id INT REFERENCES customers(id),
                firstName TEXT,
                lastName TEXT,
                address TEXT,
                apt TEXT,
                country TEXT,
                zipcode TEXT,
                state TEXT,
                city TEXT,
                phone VARCHAR(20),
                couponCode TEXT,
                tip TEXT,
                items TEXT,
                total DECIMAL(10, 2) DEFAULT 0,
                paymentMethod TEXT,
                paymentId TEXT,
                packageStatus TINYINT DEFAULT 0,
                approved TINYINT,
                createdDate BIGINT
        )
      `,
      );

  





      await conn.query(
        `
        CREATE TABLE IF NOT EXISTS product_returns (
         id INT AUTO_INCREMENT PRIMARY KEY,
                orderId VARCHAR(255) REFERENCES orders(id),
                items TEXT,
                couponCode TEXT,
                tip TEXT,
                cashReturned TEXT,
                createdDate BIGINT,
                prevPackageStatus TINYINT
        )
      `);




 




      await conn.query(
        `
        CREATE TABLE IF NOT EXISTS messages (
         id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT REFERENCES customers(id),
                name TEXT,
                message TEXT,
                msgStatus TINYINT DEFAULT 0
        )
      `,
      );


  // await conn.query(`
      //   ALTER TABLE email_campaigns
      //   MODIFY sendingDateInUnix BIGINT;
      // `);

 
      await conn.query(`
            CREATE TABLE IF NOT EXISTS email_templates (
         id INT AUTO_INCREMENT PRIMARY KEY,
                designJson TEXT CHARACTER SET utf8mb4,
                emailFontSize INT,
                emailFontValue TEXT,
                emailWidthModeValue TEXT,
                mainBackgroundColor TEXT,
                templateType TEXT
      )
        `);






      await conn.query(
        `
        CREATE TABLE IF NOT EXISTS emails (
         id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                text TEXT CHARACTER SET utf8mb4
        )
      `);



      



      await conn.query(
        `
        CREATE TABLE IF NOT EXISTS email_sequences (
         id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                emails TEXT
        )
      `);

      await conn.query(
        `
        CREATE TABLE IF NOT EXISTS key_email_sequences (
           id INT AUTO_INCREMENT PRIMARY KEY,
                thank_you_sequence INT REFERENCES email_sequences(id),
                welcome_sequence INT REFERENCES email_sequences(id)
        )
      `);

     
      
      if (!await conn.query('SELECT 1 FROM key_email_sequences WHERE id = 1').length === 0) {
        await conn.query(`
          INSERT INTO key_email_sequences (id, thank_you_sequence, welcome_sequence)
          VALUES (1, NULL, NULL)
        `);
      };







      await conn.query(
        `
        CREATE TABLE IF NOT EXISTS email_campaigns (
         id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                sequenceId INT REFERENCES email_sequences(id),
                sendingDateInUnix BIGINT,
                emailSentCounter INT,
                retryCounter INT,
                targetCustomers TEXT,
                extraData TEXT,
                reserveTargetedCustomers INT DEFAULT 0,
                finished TINYINT DEFAULT 0
             

        )
      `);





      // await conn.query(`
      //   ALTER TABLE email_campaigns
      //   MODIFY sendingDateInUnix BIGINT;
      // `);




   












    } catch (error) {
      console.error('Error creating MARIA DB tables:', error);
  }

  finally{
    if (conn) {
      conn.release(); // Release the connection
  }
  }

}
catch(error){ console.error('Error establishing MARIA DB connection:', error);}


}






module.exports =  createSqliteTables;


//CREATE DATABASE IF NOT EXISTS DBname