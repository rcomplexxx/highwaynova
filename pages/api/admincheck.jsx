
import { verifyToken } from "@/utils/utils-server/utils-admin/auth.js"; // Adjust the path based on your project structure
import RateLimiter from "@/utils/utils-server/rateLimiter.js";


import reorderReviewsByRatingAndImages from '@/utils/utils-server/reorderReviews.jsx';



import insertInDb from '@/utils/utils-server/utils-admin/adminInsertDb'
import updateDb from '@/utils/utils-server/utils-admin/adminUpdateDb'
import getFromDb from '@/utils/utils-server/utils-admin/adminGetFromDb';
import wipeData from '@/utils/utils-server/utils-admin/adminDataWiper'
import deleteRow from '@/utils/utils-server/utils-admin/adminDbRowDeleter';
import {obtainDbQueryParams, obtainGetDbQueryParams} from "@/utils/utils-server/utils-admin/obtainAdminDbQueryParmas";
import products from '@/data/products.json'


const getPool = require('@/utils/utils-server/mariaDbPool');


const limiterPerTwoMins = new RateLimiter({
  apiNumberArg: 6,
  tokenNumberArg: 40,
  expireDurationArg: 120, //secs
});

export default async function adminCheckHandler(req, res) {
  const { token } = req.cookies;




let dbConnection;


const revalidateReviews = async()=>{

  // await res.revalidate('/posts/1')
  // await res.revalidateTag('review_data_revalidation');

  await res.revalidate('/products');
}


  const resReturn = async(statusNumber, jsonObject)=>{

    


    res.status(statusNumber).json(jsonObject)

 }









  

  try {


    
    dbConnection = await getPool().getConnection()


    // const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // if (!(await limiterPerTwoMins.rateLimiterGate(clientIp, dbConnection))) return await resReturn(429, { error: "Too many requests." })
   


    

      
      
    if (!verifyToken(token))  return await resReturn(400, { successfulLogin: false,
        error: "You do not have access to this sector. Unable to hack, amateur ;).", })



    
      const { dataType, data } = req.body;
     
     
      
      if (!dataType) return await resReturn(200, { successfulLogin: true })

        

        
        

        console.log('data', data);

        
        if(!data && (dataType.startsWith("insert_") || dataType.startsWith("update_") || dataType.startsWith("delete_"))) return await resReturn(500, { successfulLogin: false, error: "No data to send" })
      

        

        if(dataType.startsWith("get_")){


         const {table, queryCondition, selectVariables} = obtainGetDbQueryParams(dataType, data);
        return await getFromDb(dbConnection, resReturn, table, queryCondition, selectVariables ); 




        }
        

      else if (dataType.startsWith("update_")){


      
        const table = obtainDbQueryParams(dataType);



        
     
         if (dataType === "update_email_data")  console.log('started email send');



           

        

        if(table) return await updateDb(dbConnection, resReturn, table, data, revalidateReviews);
 
         


        else {
      

       if (dataType === "update_reviews_reorder") {



          const successfulReorder= await reorderReviewsByRatingAndImages(data.product_id, dbConnection);
         if(successfulReorder) return await resReturn(200, { success: true })
          else  return await resReturn(500, { success: false })
     
          
     
    } 
     

       
        else{
        return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })
        }

        }





      }



      else if(dataType.startsWith('insert_')){


      
        const table = obtainDbQueryParams(dataType);

       

        if(!table) return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })

        


        
        return await insertInDb(dbConnection,  resReturn, table, data);




      }






      else if(dataType.startsWith('delete_')){


      
    
        const table = obtainDbQueryParams(dataType);

       


        if(!table) return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })
       

         return await deleteRow(dbConnection, resReturn, table, data.deleteId)


      }


      else if(dataType.startsWith('wipe')){


      
        
        const table = obtainDbQueryParams(dataType);
        
        
      
        


        if(!table) return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })

          if(table==='reviews'){
            console.log('reviews wiping', data.product_id)
            return await wipeData(dbConnection,  resReturn,'reviews', data.product_id, revalidateReviews)
          }
        
        return await wipeData(dbConnection, resReturn, table);

        

      }


     

      
     
        
        else  return await resReturn(500, { successfulLogin: false, error: "Wrong data type" })


          
      



  }
  
  
   catch (error) {
    console.error('error in admin check api', error);

    return await resReturn(500, { successfulLogin: false, error: "Internal Server Error" })


 
    
  }

  finally{

    if(dbConnection) await dbConnection.release();
  }
} //
