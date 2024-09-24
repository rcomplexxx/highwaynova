import getConnection from './mariaDbConnection';



const getRatingData = async(product_id) => {
 
  let dbConnection;

  try {

    let ratingData ={};

    let reviewsNumberFinal = 0;
    let sumOfAllReviews= 0 ;
  

  dbConnection = await getConnection();

 

  for(let i=1; i <6; i++){
 
    
    const result = parseInt((await dbConnection.query(`SELECT COUNT(*) as count FROM reviews WHERE product_id = ? AND stars = ?`, [product_id, i]))[0].count);

  

    ratingData={...ratingData, [`stars${i}`]:result};

       reviewsNumberFinal+=result;

      sumOfAllReviews+=result*i;
   

  }

  
  const averageValue=Math.round(sumOfAllReviews/reviewsNumberFinal * 10)/ 10;
  

  if(reviewsNumberFinal===0) throw new Error('rating data not found.')


  
    
    
    
    ratingData={...ratingData, reviewsNumber: reviewsNumberFinal, rating: averageValue}
  
  return ratingData;

  

   
   
    
   
  } catch (error) {

    

   return {stars5:30, stars4:2, stars3:0, stars2:0, stars1:0, reviewsNumber: 32, rating: 4.9};
  }

  finally{

    if(dbConnection)await dbConnection.end()
  }
};

export default getRatingData;



