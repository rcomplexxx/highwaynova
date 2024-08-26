
const getPool = require('../../utils/mariaDbPool');
import RateLimiter from "@/utils/rateLimiter.js";

const limiterPerDay = new RateLimiter({
  apiNumberArg: 4,
  tokenNumberArg: 70,
  expireDurationArg: 1800, //secs
});


function fisherYatesShuffle(array, seed) {
  const shuffledArray = [...array];
  const random = (seed) => {
    let x = Math.sin(seed) * 100;
    return x - Math.floor(x);
  };

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(random(seed + i) * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

const craftShuffledArrayQuery = (array)=>{
  let craftedQueryIds= "(";
  array.forEach((el, index)=>{
    craftedQueryIds=craftedQueryIds+el;
    if(index!==array.length-1)craftedQueryIds=craftedQueryIds+', ';
  })

  craftedQueryIds=  craftedQueryIds + ")"

  return `SELECT * FROM reviews WHERE id IN ${ craftedQueryIds}`;


}



const getReviews = async (req, res) => {

 



let dbConnection = await (await getPool()).getConnection();

  


  const resReturn = async(statusNumber, jsonObject)=>{

    if(dbConnection) await dbConnection.release();
    res.status(statusNumber).json(jsonObject)

 }


 

  const { product_id, starting_position, limit = 40 ,sortingType} = req.body;


  try {
    



    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;



  

      if (!(await  limiterPerDay.rateLimiterGate(clientIp, dbConnection)))
        
          return await resReturn(429,{ error: "Too many requests." } )
     
          
        

   

   if(sortingType === "featured"){
    

    const result = await dbConnection.query(`SELECT * FROM reviews WHERE product_id = ? LIMIT ? OFFSET ?`, [product_id, limit, starting_position]);

    

 
    // console.log('rs', result)

    return await resReturn(200, { reviews: result } )


    
  
  }

   else if(sortingType === "new"){



    /*   const { lowestId, highestId } = (await dbConnection.query(`
      SELECT MIN(id) AS lowestId, MAX(id) AS highestId
      FROM reviews
      WHERE product_id = ?
    `, [product_id]))[0];
    */




    const { lowestId, totalRows } = (await dbConnection.query(  `SELECT 
      (SELECT id FROM reviews WHERE product_id = ? ORDER BY id LIMIT 1) AS lowestId,
      (SELECT COUNT(*) FROM reviews WHERE product_id = ?) AS totalRows`, [product_id, product_id]))[0];

      const highestId = lowestId + parseInt(totalRows);

      console.log('high and low', lowestId, highestId)
   



    
   
    
      const array = Array.from({ length: highestId - lowestId + 1 }, (_, i) => lowestId + i);
      const newArray = fisherYatesShuffle(array, 42)
      
     
      const newArraySliced = newArray.slice(starting_position, starting_position+limit);

      const query = craftShuffledArrayQuery(newArraySliced);
     


      
    const result = await dbConnection.query(query);

    


    return await resReturn(200, { reviews: result } )

  
    
  

  }
  
  else {
   
  

    let ratingArrayIds = [];

    for(let stars = 5; stars >0; stars--){



    const currarr= (await dbConnection.query(`SELECT id FROM reviews WHERE product_id = ? AND stars = ?`, [product_id, stars]))?.map(revIdPacked=>revIdPacked.id);

   

    const currarrShuffled =  fisherYatesShuffle(currarr, 33);
    
      
    

    ratingArrayIds=ratingArrayIds.concat(currarrShuffled);
  }

 

    

    if(sortingType === "lowest_ratings"){
      ratingArrayIds=ratingArrayIds.reverse();
    }

  
    
    const query= craftShuffledArrayQuery(ratingArrayIds.slice(starting_position, starting_position+limit))



    const myReviews= await dbConnection.query(query);


    return await resReturn(200, { reviews: myReviews } )

  
    

   
    

  }

    
  
  

   

   

  
   
  } catch (error) {

    console.log('error', error)

    return await resReturn(500, {error: "Verification error." } )
    

    

  }
};

export default getReviews;
