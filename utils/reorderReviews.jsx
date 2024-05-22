
const betterSqlite3 = require('better-sqlite3');


async function reorderReviewsByRatingAndImages( product_id ) {


   




    try{




        const db = betterSqlite3(process.env.DB_PATH);

        const {minId} = db.prepare(`
    SELECT MIN(id) AS minId
    FROM reviews WHERE product_id = ?
`).get(product_id);




    const reviews =  db.prepare
    (`SELECT * FROM reviews WHERE product_id = ? ORDER BY stars DESC, CASE WHEN imageNames IS NOT NULL THEN 0 ELSE 1 END, 
    id ASC`).all(product_id);

    

    for(let i=0; i<reviews.length; i++){
        reviews[i].id=minId+i;
    }

    reviews.forEach(review=>{ 
        
        db.prepare(`UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`)
        .run(review.name, review.text, review.stars, review.imageNames, review.id);
    
    })
   
    
  




            db.close();

          
            return true;



    }
    catch(error){
        console.log('error', error)
        return false;
    }




 }

 module.exports = reorderReviewsByRatingAndImages;