import betterSqlite3 from "better-sqlite3";
import RateLimiter from "@/utils/rateLimiter.js";

const limiterPerDay = new RateLimiter({
  apiNumberArg: 7,
  tokenNumberArg: 35,
  expireDurationArg: 1800, //secs
});

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
    query=`SELECT * FROM reviews WHERE product_id = ? LIMIT ? OFFSET ?`;}
   else if(sortingType === "new")
    query = `SELECT * FROM common_reviews WHERE product_id = ? LIMIT ? OFFSET ?`;
    else if(sortingType === "highest_ratings")
     query = `SELECT * FROM common_reviews WHERE product_id = ? ORDER BY stars DESC LIMIT ? OFFSET ?`;
    else 
    query = `SELECT * FROM common_reviews WHERE product_id = ? ORDER BY stars LIMIT ? OFFSET ?`;
   

  
    const stmt = db.prepare(query);

    const result = stmt.all(product_id, limit, starting_position);
    console.log('rs', result)

    db.close();

    return res.status(200).json({ reviews: result });
  } catch (error) {
    console.error("Capture request failed:", error);
    res.status(500).json({ error: "Verification error." });
  }
};

export default getReviews;
