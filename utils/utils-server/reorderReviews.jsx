

async function reorderReviewsByRatingAndImages( product_id, dbConnection ) {


   




    try{





        const {minId} = (await dbConnection.query(`
    SELECT MIN(id) AS minId
    FROM reviews WHERE product_id = ?
`, [product_id]))[0];




    const reviews = await dbConnection.query(
    `SELECT * FROM reviews WHERE product_id = ? ORDER BY stars DESC, CASE WHEN imageNames IS NOT NULL THEN 0 ELSE 1 END, 
    id ASC`, [product_id]);

    

    for(let i=0; i<reviews.length; i++){
        reviews[i].id=minId+i;
    }

    for(const review of reviews){
        await dbConnection.query(`UPDATE reviews SET name = ?, text = ?, stars = ?, imageNames = ? WHERE id = ?`
            , [review.name, review.text, review.stars, review.imageNames, review.id]);
    }


    
    
  
    

          
            return true;



    }
    catch(error){
        console.log('error', error)
        return false;
    }




 }

 module.exports = reorderReviewsByRatingAndImages;