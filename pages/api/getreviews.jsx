import betterSqlite3 from "better-sqlite3";
import RateLimiter from "@/utils/rateLimiter.js";

const limiterPerDay = new RateLimiter({
  apiNumberArg: 4,
  tokenNumberArg: 35,
  expireDurationArg: 1800, //secs
});


function fisherYatesShuffle(array, seed) {
  const shuffledArray = [...array];
  const random = (seed) => {
    let x = Math.sin(seed) * 10000;
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

 


  const resReturn = (statusNumber, jsonObject, db)=>{

     
    res.status(statusNumber).json(jsonObject)
    if(db)db.close();
 }


 
 const db = betterSqlite3(process.env.DB_PATH);

  const { product_id, starting_position, limit = 40 ,sortingType} = req.body;


  try {
    



    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;


    // if(!(await limiterPerDay.rateLimiterGate(clientIp)))

  

      if (!(await  limiterPerDay.rateLimiterGate(clientIp, db)))
        
          return resReturn(429,{ error: "Too many requests." }, db )
     
          
        

   

    let query;


   if(sortingType === "featured"){
    query=`SELECT * FROM reviews WHERE product_id = ? LIMIT ? OFFSET ?`;

    const stmt = db.prepare(query);

    

    const result = stmt.all(product_id, limit, starting_position);
    // console.log('rs', result)

    return resReturn(200, { reviews: result }, db )


    
  
  }

   else if(sortingType === "new"){




    const { lowestId, highestId } = db.prepare(`
      SELECT MIN(id) AS lowestId, MAX(id) AS highestId
      FROM reviews
      WHERE product_id = ?
    `).get(product_id);


    
   
    
      const array = Array.from({ length: highestId - lowestId + 1 }, (_, i) => lowestId + i);
      const newArray = fisherYatesShuffle(array, 42)
      
     
      const newArraySliced = newArray.slice(starting_position, starting_position+limit);

      query = craftShuffledArrayQuery(newArraySliced);
     

    
    const stmt = db.prepare(query);

    

    const result = stmt.all();

    return resReturn(200, { reviews: result }, db )

  
    
  

  }
  
  else {
   
  

    let ratingArrayIds = [];

    for(let stars = 5; stars >0; stars--){



    const currarr= db.prepare(`SELECT id FROM reviews WHERE product_id = ? AND stars = ?`).all(product_id, stars).map(revIdPacked=>revIdPacked.id);

   

    const currarrShuffled =  fisherYatesShuffle(currarr, 33);
    
      
    

    ratingArrayIds=ratingArrayIds.concat(currarrShuffled);
  }

 

    

    if(sortingType === "lowest_ratings"){
      ratingArrayIds=ratingArrayIds.reverse();
    }

  
    
    const ratingArrayIdsSlicedQuery= craftShuffledArrayQuery(ratingArrayIds.slice(starting_position, starting_position+limit))



    const myReviews= db.prepare(ratingArrayIdsSlicedQuery).all();


    return resReturn(200, { reviews: myReviews }, db )

  
    

   
    

  }

    
  
  

   

   

  
   
  } catch (error) {

    console.log('error', error)

    return resReturn(500, {error: "Verification error." }, db )
    

    

  }
};

export default getReviews;
