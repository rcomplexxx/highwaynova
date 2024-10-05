
const getPool = require('@/utils/utils-server/mariaDbPool');



async function createSqliteTables() {







  let dbConnection;



  try {


    dbConnection = await getPool().getConnection();


    console.log('Creating sqlite tables.');


    


    await dbConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    await dbConnection.query(`CREATE DATABASE IF NOT EXISTS mariadatabase_northhold CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    


    
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS rateLimiter (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ip VARCHAR(255),
          tokenNumber INT,
          apiNumber TINYINT,
          expireDate BIGINT
      )
  `);

  



  await dbConnection.query(`
    CREATE INDEX IF NOT EXISTS idx_ip_apiNumber ON rateLimiter(ip, apiNumber)
`);






await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId TINYINT UNIQUE,
    description TEXT CHARACTER SET utf8mb4
  )
`);

await dbConnection.query(`
  CREATE INDEX IF NOT EXISTS idx_productId ON products (productId)
  `);


  

await dbConnection.query(`
  CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name TEXT,
                text TEXT CHARACTER SET utf8mb4,
                stars TINYINT,
                imageNames TEXT,
                product_id TINYINT
            )
`);



await dbConnection.query(`
CREATE INDEX IF NOT EXISTS idx_product_id_stars ON reviews (product_id, stars)
`);





await dbConnection.query(
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





      await dbConnection.query(`
        CREATE INDEX IF NOT EXISTS idx_email ON customers(email)
    `);



      



    await dbConnection.query(
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
                supplyCost DECIMAL(10, 2) DEFAULT 0,
                createdDate BIGINT
        )
      `,
      );

     


      await dbConnection.query(
        `
        CREATE TABLE IF NOT EXISTS product_returns (
         id INT AUTO_INCREMENT PRIMARY KEY,
                orderId VARCHAR(255) REFERENCES orders(id),
                items TEXT,
                couponCode TEXT,
                tip TEXT,
                returnCost DECIMAL(10, 2) DEFAULT 0,
                createdDate BIGINT,
                prevPackageStatus TINYINT
        )
      `);

      


 




      await dbConnection.query(
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




    //   await dbConnection.query(`
    //     ALTER TABLE messages
    //     DROP COLUMN status;
    // `);

    

  // await dbConnection.query(`
      //   ALTER TABLE email_campaigns
      //   MODIFY sendingDateInUnix BIGINT;
      // `);


          // await dbConnection.query(`
    //     ALTER TABLE orders
    //      ADD COLUMN supplyCost DECIMAL(10, 2) DEFAULT 0
    //   `);

 
      await dbConnection.query(`
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






      await dbConnection.query(
        `
        CREATE TABLE IF NOT EXISTS emails (
         id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                text TEXT CHARACTER SET utf8mb4
        )
      `);



      



      await dbConnection.query(
        `
        CREATE TABLE IF NOT EXISTS email_sequences (
         id INT AUTO_INCREMENT PRIMARY KEY,
                title TEXT,
                emails TEXT
        )
      `);

      await dbConnection.query(
        `
        CREATE TABLE IF NOT EXISTS key_email_sequences (
           id INT AUTO_INCREMENT PRIMARY KEY,
                thank_you_sequence INT REFERENCES email_sequences(id),
                welcome_sequence INT REFERENCES email_sequences(id)
        )
      `);

     
      
      if (!await dbConnection.query('SELECT 1 FROM key_email_sequences WHERE id = 1').length === 0) {
        await dbConnection.query(`
          INSERT INTO key_email_sequences (id, thank_you_sequence, welcome_sequence)
          VALUES (1, NULL, NULL)
        `);
      };







      await dbConnection.query(
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





      // await dbConnection.query(`
      //   ALTER TABLE email_campaigns
      //   MODIFY sendingDateInUnix BIGINT;
      // `);




   












    } catch (error) {
      console.error('Error creating MARIA DB tables:', error);
  }

  finally{

    

    if (dbConnection)  await dbConnection.release(); // Release the connection
  
  }




}






module.exports =  createSqliteTables;


//CREATE DATABASE IF NOT EXISTS DBname