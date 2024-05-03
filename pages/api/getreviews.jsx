import betterSqlite3 from "better-sqlite3";
import RateLimiter from "@/utils/rateLimiter.js";

const limiterPerDay = new RateLimiter({
  apiNumberArg: 7,
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



const getReviews = (req, res) => {
  const { product_id, starting_position, limit = 40 ,sortingType} = req.body;


  try {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    limiterPerDay
      .rateLimiterGate(clientIp)
      .then((result) => {
        if (!result)
          return res.status(429).json({ error: "Too many requests." });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: "Too many requests." });
      });

    const db = betterSqlite3(process.env.DB_PATH);

    let query;


   if(sortingType === "featured"){
    query=`SELECT * FROM reviews WHERE product_id = ? LIMIT ? OFFSET ?`;

    const stmt = db.prepare(query);

    

    const result = stmt.all(product_id, limit, starting_position);
    // console.log('rs', result)

    db.close();

    return res.status(200).json({ reviews: result });
  
  }

   else if(sortingType === "new"){




    
    const { id: lowestId } = db.prepare('SELECT id FROM reviews WHERE product_id = ? LIMIT 1').get(product_id);
    const { count } = db.prepare(`SELECT COUNT(*) AS count FROM reviews WHERE product_id = ?`).get(product_id);

   
    const highestId = lowestId + count;
   
    
      const array = Array.from({ length: highestId - lowestId + 1 }, (_, i) => lowestId + i);
      const newArray = fisherYatesShuffle(array, 42)
      
     
      const newArraySliced = newArray.slice(starting_position, starting_position+limit);

      query = craftShuffledArrayQuery(newArraySliced);
     

    
    const stmt = db.prepare(query);

    

    const result = stmt.all();

    db.close();

    return res.status(200).json({ reviews: result });
  

  }
  
  else if ( sortingType === "highest_ratings" || sortingType === "lowest_ratings"){
   
  

    let highestRatingsArray = [];

    for(let stars = 5; stars >0; stars--){



    const currarr= db.prepare(`SELECT * FROM reviews WHERE product_id = ? AND stars = ?`).all(product_id, stars);

   

    const currarrShuffled =  fisherYatesShuffle(currarr, 42);
    
      
    

    highestRatingsArray=highestRatingsArray.concat(currarrShuffled);
  }

 

    db.close();

    if(sortingType === "lowest_ratings"){
      highestRatingsArray=highestRatingsArray.reverse();
    }

    console.log('h or l ratings, ', starting_position, limit)
    const highestRatingsArraySliced= highestRatingsArray.slice(starting_position, starting_position+limit)

    return res.status(200).json({ reviews: highestRatingsArraySliced });

   
    

  }

    
  
  

   

   

  
   
  } catch (error) {
    console.error("Capture request failed:", error);
    res.status(500).json({ error: "Verification error." });
  }
};

export default getReviews;
