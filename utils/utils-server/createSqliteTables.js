
const getPool = require('@/utils/utils-server/mariaDbPool');
const { createConnection } = require('mariadb');



async function createSqliteTables() {







  let dbConnection;



  try {



    
    await createDbIfNotExist();


    dbConnection = await getPool().getConnection();


    console.log('Creating sqlite tables.');


    



    


    
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
                used_discounts TEXT DEFAULT '[]',
                createdDate BIGINT,
                emailBounceCount TINYINT DEFAULT 0
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
                msgStatus TINYINT DEFAULT 0,
                createdDate BIGINT
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

    

    // await dbConnection.query('DROP TABLE email_templates');

    
 
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

        


        const rows = await dbConnection.query(`
          SELECT 1 FROM email_templates WHERE templateType = 'main' LIMIT 1
        `);

        
        
        if(rows.length === 0){



          const defaultDesignJson = JSON.stringify({
            "counters":{"u_column":2,"u_row":2,"u_content_button":1,"u_content_html":2,"u_content_image":1},"body":{"id":"nXM8Ac7JgC","rows":[{"id":"D8sPt4wwRI","cells":[1],"columns":[{"id":"xwmm7U8NL0","contents":[{"id":"oMWKmh2ZD4","type":"image","values":{"containerPadding":"5px","anchor":"","src":{"url":"https://assets.unlayer.com/projects/0/1742962687641-Lightbook-1.png","width":2400,"height":800,"contentType":"image/png","size":118092,"dynamic":true,"autoWidth":false,"maxWidth":"30%"},"textAlign":"center","altText":"","action":{"name":"web","values":{"href":"","target":"_blank"}},"displayCondition":null,"_styleGuide":null,"_meta":{"htmlID":"u_content_image_1","htmlClassNames":"u_content_image"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true,"locked":false,"pending":false}}],"values":{"backgroundColor":"","padding":"0px","border":{},"borderRadius":"0px","_meta":{"htmlID":"u_column_2","htmlClassNames":"u_column"},"deletable":true,"locked":false}}],"values":{"displayCondition":null,"columns":false,"_styleGuide":null,"backgroundColor":"#000000","columnsBackgroundColor":"","backgroundImage":{"url":"","fullWidth":true,"repeat":"no-repeat","size":"custom","position":"center"},"padding":"0px","anchor":"","_meta":{"htmlID":"u_row_2","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true,"locked":false}},{"id":"dr9xqTzh10","cells":[1],"columns":[{"id":"0OV9CDha6W","contents":[{"id":"-NTkMKY3Zv","type":"html","values":{"html":"<div style=\"\n  width: 100%;\n  text-align: center;\n  padding: 64px 12px;\n  box-sizing: border-box;\n\">\n  <h1 style=\"\n    color: black;\n    line-height: 120%;\n    text-align: center;\n    font-size: 26px;\n    font-weight: 700;\n    border-radius: 16px;\n    padding: 12px;\n    background-color: rgba(178, 163, 108, 0.7);\n  \">\n    Thanks for letting us be a part of your immersive reading ambiance!\n  </h1>\n</div>","displayCondition":null,"_styleGuide":null,"containerPadding":"10px","anchor":"","_meta":{"htmlID":"u_content_html_1","htmlClassNames":"u_content_html"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true,"locked":false}}],"values":{"backgroundColor":"","padding":"0px","border":{},"borderRadius":"0px","_meta":{"htmlID":"u_column_1","htmlClassNames":"u_column"},"deletable":true,"locked":false}}],"values":{"displayCondition":null,"columns":false,"_styleGuide":null,"backgroundColor":"","columnsBackgroundColor":"","backgroundImage":{"url":"https://assets.unlayer.com/projects/0/1742962472928-fire_biker.jpg","fullWidth":true,"repeat":"no-repeat","size":186549,"position":"center","customPosition":["50%","50%"],"width":1024,"height":1024,"contentType":"image/jpeg","dynamic":true},"padding":"100px 0px","anchor":"","hideDesktop":false,"_meta":{"htmlID":"u_row_1","htmlClassNames":"u_row"},"selectable":true,"draggable":true,"duplicatable":true,"deletable":true,"hideable":true,"locked":false,"pending":false}}],"headers":[],"footers":[],"values":{"_styleGuide":null,"popupPosition":"center","popupWidth":"600px","popupHeight":"auto","borderRadius":"10px","contentAlign":"center","contentVerticalAlign":"center","contentWidth":"500px","fontFamily":{"label":"Arial","value":"arial,helvetica,sans-serif"},"textColor":"#000000","popupBackgroundColor":"#FFFFFF","popupBackgroundImage":{"url":"","fullWidth":true,"repeat":"no-repeat","size":"cover","position":"center"},"popupOverlay_backgroundColor":"rgba(0, 0, 0, 0.1)","popupCloseButton_position":"top-right","popupCloseButton_backgroundColor":"#DDDDDD","popupCloseButton_iconColor":"#000000","popupCloseButton_borderRadius":"0px","popupCloseButton_margin":"0px","popupCloseButton_action":{"name":"close_popup","attrs":{"onClick":"document.querySelector('.u-popup-container').style.display = 'none';"}},"language":{},"backgroundColor":"#F7F8F9","preheaderText":"","linkStyle":{"body":true,"linkColor":"#0000ee","linkHoverColor":"#0000ee","linkUnderline":true,"linkHoverUnderline":true},"backgroundImage":{"url":"","fullWidth":true,"repeat":"no-repeat","size":"custom","position":"center"},"_meta":{"htmlID":"u_body","htmlClassNames":"u_body"}}},"schemaVersion":20
           });

          await dbConnection.query(`
            INSERT INTO email_templates (
              designJson, emailFontSize, emailFontValue, emailWidthModeValue, 
              mainBackgroundColor, templateType
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [defaultDesignJson, 16, "", "clear_max_width", '#000000', 'main']
          );
        }


     


    
        





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
                targetType TEXT,
                targetCustomers TEXT,
                extraData TEXT,
                reserveTargetedCustomers INT DEFAULT 0,
                sendFailCounter  TINYINT,
                finished TINYINT DEFAULT 0
             

        )
      `);





      // await dbConnection.query(`
      //   ALTER TABLE email_campaigns
      //   CHANGE retryCounter sendFailCounter TINYINT;
      // `);


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


const createDbIfNotExist = async() =>{

  let dbConnection

try{

   dbConnection = await createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  const dbName = process.env.DB_DATABASE;

  
 

  await dbConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);


}

catch(error){
  console.log('Error creating db', error)
}
finally{
  if (dbConnection) await dbConnection.end();
}
}






module.exports =  createSqliteTables;


//CREATE DATABASE IF NOT EXISTS DBname