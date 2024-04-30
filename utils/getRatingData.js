import betterSqlite3 from "better-sqlite3";


const getRatingData = (product_id, stars) => {
 

  try {
  

    const db = betterSqlite3(process.env.DB_PATH);

    const query = `SELECT COUNT(*) as count FROM reviews WHERE product_id = ? AND stars = ?`;
   
    
    const stmt = db.prepare(query);

    const result = stmt.pluck().get(product_id, stars);;
   
    db.close();
    console.log('number', result);
    return result;
  } catch (error) {

   return 0;
  }
};

export default getRatingData;



